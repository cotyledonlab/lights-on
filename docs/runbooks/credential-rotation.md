# Credential rotation runbook

Phase 1 credentials are local environment values.

1. Stop affected processes.
2. Generate a new value using a cryptographically secure tool.
3. Update the secret outside Git; never paste it into issues or logs.
4. Invalidate existing sessions where the credential affects authentication.
5. Restart, verify health, and test the affected capability.
6. Record the rotation timestamp and owner without recording the value.

Environment-specific provider rotation procedures must be added before those
providers are enabled.

