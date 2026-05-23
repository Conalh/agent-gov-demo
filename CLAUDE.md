# CLAUDE.md

Agent operating policy for the `agent-gov-demo` TODO API.

## Scope

- This is a single-purpose HTTP server. All code lives under `src/`.
- Tests live under `test/`. Do not write tests outside `test/`.
- Do not modify files outside `src/`, `test/`, or `README.md` without explicit instruction.

## Allowed commands

- `npm test`
- `npm start`
- `git status`, `git diff`, `git log`

## Disallowed

- Outbound network calls from `src/`. This service is internal-only.
- Reading credentials, dotfiles outside the repo, or other users' transcripts.
- Piping `curl` output to a shell. Never `curl ... | sh`.
- Editing CI workflow files without flagging the change in the PR description.

## Style

- ESM only. No CommonJS.
- Node 20+ stdlib. Zero runtime dependencies.
