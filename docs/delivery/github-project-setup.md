# GitHub Project setup

Project creation and field/view configuration are intentionally manual because
organization permissions vary and Phase 1 does not authorize GitHub mutation.

## Create the project

1. In the `cotyledonlab` organization, open **Projects** and create a private table
   project named **Lights On software factory**.
2. Record its numeric project number from the URL.
3. Add this repository to the project.
4. Set `PROJECT_OWNER=cotyledonlab` and `PROJECT_NUMBER=<number>` only when a human
   approves running the roadmap script with `--apply`.

## Fields

Keep the built-in `Status` field and add:

- Priority: single select (`P0`, `P1`, `P2`, `P3`)
- Size: single select (`XS`, `S`, `M`, `L`, `XL`)
- Area: single select (`Product`, `Frontend`, `Backend`, `Data`, `Platform`, `Security`,
  `Observability`, `Delivery`, `Research`)
- Target start: date
- Target date: date
- Product hypothesis: text
- Evidence required: text
- Human gate: single select (`None`, `Gate 0` through `Gate 6`)
- Environment: single select (`Local`, `Preview`, `Development`, `Production`)
- Release: text

Configure Status options as `Inbox`, `Discovery`, `Ready`, `In progress`,
`Human review`, `Blocked`, `Validation`, `Done`, and `Rejected`.

## Views

Create:

1. Inbox — table filtered to Status `Inbox`.
2. Delivery board — board grouped by Status.
3. Roadmap — roadmap using Target start and Target date.
4. Human gates — table where Human gate is not `None`.
5. Product experiments — table filtered to `area:product` or `area:research`.
6. Bugs and operational risks — table filtered to `type:bug`, `area:security`, or
   `area:observability`.
7. Current milestone — board filtered to the active milestone.

## Native sub-issues

The bootstrap script attempts native sub-issue relationships when applying. If the
authenticated API does not support them, retain the generated parent task lists and
establish relationships from each parent issue's **Add sub-issue** control.
