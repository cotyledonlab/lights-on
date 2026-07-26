#!/usr/bin/env bash
set -euo pipefail

mode="dry-run"
for argument in "$@"; do
  case "${argument}" in
    --dry-run) mode="dry-run" ;;
    --apply) mode="apply" ;;
    -h | --help)
      echo "Usage: $0 [--dry-run|--apply]"
      echo "Defaults to --dry-run. Only --apply may mutate GitHub."
      exit 0
      ;;
    *)
      echo "Unknown argument: ${argument}" >&2
      exit 2
      ;;
  esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
catalogue="${repo_root}/scripts/github-roadmap.json"
artifact_dir="${repo_root}/.artifacts"
report="${artifact_dir}/github-roadmap-report.json"
work_dir="$(mktemp -d)"
actions_file="${work_dir}/actions.ndjson"
issue_map="${work_dir}/issues.tsv"
trap 'rm -rf "${work_dir}"' EXIT

for required in gh jq; do
  if ! command -v "${required}" >/dev/null 2>&1; then
    echo "Required command is missing: ${required}" >&2
    exit 1
  fi
done

if [[ ! -f "${catalogue}" ]]; then
  echo "Roadmap catalogue is missing: ${catalogue}" >&2
  exit 1
fi

if ! jq -e '
  .issues
  | all(
      .verification?
      | type == "string" and length > 0
    )
' "${catalogue}" >/dev/null; then
  echo "Every roadmap issue must define a non-empty verification expectation." >&2
  exit 1
fi

echo "Verifying GitHub authentication."
gh auth status >/dev/null

name_with_owner="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
owner="${name_with_owner%%/*}"
repository="${name_with_owner#*/}"
mkdir -p "${artifact_dir}"
: >"${actions_file}"
: >"${issue_map}"

if [[ -n "${PROJECT_OWNER:-}" || -n "${PROJECT_NUMBER:-}" ]]; then
  if [[ -z "${PROJECT_OWNER:-}" || -z "${PROJECT_NUMBER:-}" ]]; then
    echo "PROJECT_OWNER and PROJECT_NUMBER must be supplied together." >&2
    exit 1
  fi
fi

project_issue_urls=""
if [[ "${mode}" == "apply" && -n "${PROJECT_OWNER:-}" ]]; then
  project_issue_urls="$(
    gh project item-list "${PROJECT_NUMBER}" \
      --owner "${PROJECT_OWNER}" \
      --limit 1000 \
      --format json |
      jq -r '.items[]?.content.url // empty'
  )"
fi

record() {
  local action="$1"
  local target="$2"
  local status="$3"
  local detail="${4:-}"
  jq -cn \
    --arg action "${action}" \
    --arg detail "${detail}" \
    --arg status "${status}" \
    --arg target "${target}" \
    '{action: $action, target: $target, status: $status, detail: $detail}' \
    >>"${actions_file}"
}

announce() {
  local verb="$1"
  local target="$2"
  if [[ "${mode}" == "dry-run" ]]; then
    echo "[dry-run] would ${verb}: ${target}"
  else
    echo "[apply] ${verb}: ${target}"
  fi
}

label_catalogue="$(
  cat <<'LABELS'
type:initiative|5319e7|Roadmap initiative
type:epic|8250df|Roadmap epic
type:story|1d76db|User or operator outcome
type:task|0e8a16|Implementation task
type:bug|d73a4a|Defect or operational risk
type:spike|c5def5|Time-boxed research
area:product|fbca04|Product and evidence
area:frontend|bfdadc|User interface
area:backend|d4c5f9|Application backend
area:data|006b75|Data model and persistence
area:platform|0052cc|Infrastructure and platform
area:security|b60205|Security and privacy
area:observability|7057ff|Logging, metrics, and errors
area:delivery|0366d6|CI, release, and governance
area:research|d876e3|Discovery and research
gate:human-review|b60205|Explicit human stop gate
status:blocked|000000|Cannot proceed
status:needs-evidence|e4e669|Evidence required before closing
priority:p0|b60205|Immediate priority
priority:p1|d93f0b|High priority
priority:p2|fbca04|Normal priority
priority:p3|cfd3d7|Low priority
size:xs|c2e0c6|One to two hours
size:s|bfd4f2|Two to four hours
size:m|d4c5f9|Four to eight hours
size:l|c5def5|One to two focused days
size:xl|5319e7|Must be decomposed before implementation
LABELS
)"

existing_labels="$(gh label list --limit 200 --json name --jq '.[].name')"
while IFS='|' read -r label color description; do
  [[ -n "${label}" ]] || continue
  if grep -Fqx "${label}" <<<"${existing_labels}"; then
    echo "[skip] label exists: ${label}"
    record "label" "${label}" "skipped" "already exists"
    continue
  fi

  announce "create label" "${label}"
  if [[ "${mode}" == "apply" ]]; then
    gh label create "${label}" --color "${color}" --description "${description}"
    record "label" "${label}" "created"
  else
    record "label" "${label}" "planned"
  fi
done <<<"${label_catalogue}"

existing_milestones="$(
  gh api --paginate "repos/${owner}/${repository}/milestones?state=all&per_page=100" \
    --jq '.[].title'
)"
while IFS= read -r milestone; do
  title="$(jq -r .title <<<"${milestone}")"
  description="$(jq -r .description <<<"${milestone}")"
  if grep -Fqx "${title}" <<<"${existing_milestones}"; then
    echo "[skip] milestone exists: ${title}"
    record "milestone" "${title}" "skipped" "already exists"
    continue
  fi

  announce "create milestone" "${title}"
  if [[ "${mode}" == "apply" ]]; then
    gh api "repos/${owner}/${repository}/milestones" \
      -X POST \
      -f title="${title}" \
      -f description="${description}" >/dev/null
    record "milestone" "${title}" "created"
  else
    record "milestone" "${title}" "planned"
  fi
done < <(jq -c '.milestones[]' "${catalogue}")

existing_issues="$(
  gh issue list --state all --limit 1000 --json number,title
)"

write_issue_body() {
  local item="$1"
  local destination="$2"
  local parent_number="${3:-}"
  local title kind outcome verification gate size hours confidence
  title="$(jq -r .title <<<"${item}")"
  kind="$(jq -r .kind <<<"${item}")"
  outcome="$(jq -r .outcome <<<"${item}")"
  verification="$(jq -r .verification <<<"${item}")"
  gate="$(jq -r .gate <<<"${item}")"
  size="$(jq -r .size <<<"${item}" | tr '[:lower:]' '[:upper:]')"
  hours="$(jq -r .hours <<<"${item}")"
  confidence="$(jq -r .confidence <<<"${item}")"

  {
    echo "## Outcome"
    echo
    echo "${outcome}"
    echo
    echo "## Context"
    echo
    echo "This ${kind} is part of the evidence-gated software-factory roadmap. It is needed to move the stated outcome forward without silently broadening provider, infrastructure, or product commitments."
    echo
    echo "## Scope"
    echo
    echo "- Deliver and document the bounded outcome described above."
    echo "- Preserve the repository security baseline and applicable human gate."
    echo "- Capture observable verification evidence before closure."
    echo
    echo "## Out of scope"
    echo
    echo "- Unrelated roadmap epics or opportunistic refactors."
    echo "- External infrastructure, production deployment, live credentials, or paid-provider activation without the applicable approval."
    echo "- Treating software completion as product validation."
    echo
    echo "## Acceptance criteria"
    echo
    echo "- [ ] ${outcome}"
    echo "- [ ] Verification evidence is attached or linked and risks are updated."
    echo "- [ ] Documentation, tests, and runbooks affected by the behavior are current."
    echo
    echo "## Verification"
    echo
    echo "${verification}"
    echo
    echo "## Risks"
    echo
    echo "Review security, privacy, delivery, recurring cost, data-loss, and operational risks. Escalate any irreversible action or unexpected provider behavior to a human."
    echo
    echo "## Dependencies"
    echo
    if [[ -n "${parent_number}" ]]; then
      echo "Parent: #${parent_number}"
    else
      echo "No parent issue. Link concrete prerequisites as they become known."
    fi
    echo
    echo "## Human stop gate"
    echo
    echo "Applicable gate: **${gate}**. Passing automated checks does not approve this gate; a human must record the decision explicitly."
    echo
    echo "## Estimate"
    echo
    echo "- Size: ${size}"
    echo "- Focused engineering hours: ${hours}"
    echo "- Confidence: ${confidence}"
    echo "- Key uncertainty: Evidence, integration, and operational findings may require further decomposition."
    echo
    echo "---"
    echo
    echo "_Generated from \`scripts/github-roadmap.json\` by \`scripts/bootstrap-github.sh\`._"
  } >"${destination}"
}

lookup_number() {
  local key="$1"
  awk -F $'\t' -v key="${key}" '$1 == key { print $2; exit }' "${issue_map}"
}

reconcile_project_item() {
  local issue_url="$1"
  local title="$2"
  if [[ -z "${PROJECT_OWNER:-}" ]]; then
    return
  fi

  if [[ "${mode}" == "dry-run" ]]; then
    announce "add or reconcile issue in project ${PROJECT_OWNER}/${PROJECT_NUMBER}" "${title}"
    record "project-item" "${title}" "planned" "${PROJECT_OWNER}/${PROJECT_NUMBER}"
    return
  fi

  if grep -Fqx "${issue_url}" <<<"${project_issue_urls}"; then
    echo "[skip] project item exists: ${title}"
    record "project-item" "${title}" "skipped" "${PROJECT_OWNER}/${PROJECT_NUMBER}"
    return
  fi

  announce "add issue to project ${PROJECT_OWNER}/${PROJECT_NUMBER}" "${title}"
  gh project item-add "${PROJECT_NUMBER}" \
    --owner "${PROJECT_OWNER}" \
    --url "${issue_url}" >/dev/null
  if [[ -n "${project_issue_urls}" ]]; then
    project_issue_urls+=$'\n'
  fi
  project_issue_urls+="${issue_url}"
  record "project-item" "${title}" "created" "${PROJECT_OWNER}/${PROJECT_NUMBER}"
}

while IFS= read -r item; do
  key="$(jq -r .key <<<"${item}")"
  kind="$(jq -r .kind <<<"${item}")"
  title="$(jq -r .title <<<"${item}")"
  parent_key="$(jq -r '.parent // empty' <<<"${item}")"
  parent_number=""
  if [[ -n "${parent_key}" && "${mode}" == "apply" ]]; then
    parent_number="$(lookup_number "${parent_key}")"
    if [[ -z "${parent_number}" ]]; then
      echo "Parent issue was not resolved for ${key}: ${parent_key}" >&2
      exit 1
    fi
  fi

  existing_number="$(
    jq -r --arg title "${title}" \
      '.[] | select(.title == $title) | .number' \
      <<<"${existing_issues}" | head -n 1
  )"
  if [[ -n "${existing_number}" ]]; then
    echo "[skip] issue exists: #${existing_number} ${title}"
    printf '%s\t%s\n' "${key}" "${existing_number}" >>"${issue_map}"
    record "issue" "${title}" "skipped" "issue #${existing_number}"
    issue_url="https://github.com/${name_with_owner}/issues/${existing_number}"
  elif [[ "${mode}" == "dry-run" ]]; then
    announce "create issue" "${title}"
    record "issue" "${title}" "planned" "catalogue key ${key}"
    reconcile_project_item "" "${title}"
    continue
  else
    announce "create issue" "${title}"
    body_file="${work_dir}/${key}.md"
    write_issue_body "${item}" "${body_file}" "${parent_number}"
    area="$(jq -r .area <<<"${item}")"
    priority="$(jq -r .priority <<<"${item}")"
    size="$(jq -r .size <<<"${item}")"
    milestone="$(jq -r .milestone <<<"${item}")"
    if [[ "${kind}" == "gate" ]]; then
      labels="type:task,gate:human-review,status:needs-evidence,area:${area},priority:${priority},size:${size}"
    else
      labels="type:${kind},status:needs-evidence,area:${area},priority:${priority},size:${size}"
    fi

    issue_url="$(
      gh issue create \
        --title "${title}" \
        --body-file "${body_file}" \
        --label "${labels}" \
        --milestone "${milestone}"
    )"
    issue_number="${issue_url##*/}"
    printf '%s\t%s\n' "${key}" "${issue_number}" >>"${issue_map}"
    record "issue" "${title}" "created" "issue #${issue_number}"
  fi

  reconcile_project_item "${issue_url}" "${title}"
done < <(jq -c '.issues[]' "${catalogue}")

while IFS= read -r relationship; do
  child_key="$(jq -r .key <<<"${relationship}")"
  parent_key="$(jq -r .parent <<<"${relationship}")"
  title="$(jq -r .title <<<"${relationship}")"
  announce "link child to parent ${parent_key}" "${title}"

  if [[ "${mode}" == "dry-run" ]]; then
    record "relationship" "${parent_key} -> ${child_key}" "planned" "native sub-issue with task-list fallback"
    continue
  fi

  child_number="$(lookup_number "${child_key}")"
  parent_number="$(lookup_number "${parent_key}")"
  child_id="$(gh api "repos/${owner}/${repository}/issues/${child_number}" --jq .id)"

  if gh api "repos/${owner}/${repository}/issues/${parent_number}/sub_issues" \
    -X POST \
    -F sub_issue_id="${child_id}" >/dev/null 2>&1; then
    record "relationship" "#${parent_number} -> #${child_number}" "created" "native sub-issue"
    continue
  fi

  parent_body_file="${work_dir}/parent-${parent_number}.md"
  gh issue view "${parent_number}" --json body --jq .body >"${parent_body_file}"
  if ! grep -Fq "#${child_number}" "${parent_body_file}"; then
    {
      echo
      echo "## Child issues"
      echo
      echo "- [ ] #${child_number}"
    } >>"${parent_body_file}"
    gh issue edit "${parent_number}" --body-file "${parent_body_file}" >/dev/null
  fi
  record "relationship" "#${parent_number} -> #${child_number}" "created" "task-list fallback"
done < <(jq -c '.issues[] | select(.parent != null)' "${catalogue}")

jq -s \
  --arg generatedAt "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --arg mode "${mode}" \
  --arg repository "${name_with_owner}" \
  '{
    generatedAt: $generatedAt,
    mode: $mode,
    repository: $repository,
    mutationPerformed: ($mode == "apply"),
    actions: .
  }' \
  "${actions_file}" >"${report}"

echo "Machine-readable report: ${report}"
if [[ "${mode}" == "dry-run" ]]; then
  echo "Dry run complete. No GitHub labels, milestones, issues, relationships, or project items were changed."
fi
