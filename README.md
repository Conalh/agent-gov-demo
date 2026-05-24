# agent-gov-demo

Demo sandbox for the [agent-gov suite](https://github.com/Conalh/agent-gov-core). A boring TODO-API skeleton that exists so we can plant agent-policy drift in a PR and watch all five tools fire at once.

## What's in the box

- `src/index.js` — minimal Node HTTP server (no deps)
- `CLAUDE.md` + `.cursorrules` + `.mcp.json` — declared agent surfaces, in agreement on `main`
- `.claude/settings.json` — modest permission set (Read, Edit, `npm test`, `git status`)
- `.github/workflows/agent-gov-review.yml` — runs the full suite + [GovVerdict](https://github.com/Conalh/GovVerdict) consolidation on every PR

## The rogue PR

[Pull request #1](https://github.com/Conalh/agent-gov-demo/pull/1) (branch `demo/rogue-agent`) deliberately introduces every category of drift the suite catches:

| Tool | Drift planted |
| --- | --- |
| [ScopeTrail](https://github.com/Conalh/ScopeTrail) | Expanded `.claude/settings.json` permissions |
| [PolicyMesh](https://github.com/Conalh/PolicyMesh) | `.cursorrules` contradicts `CLAUDE.md` |
| [CapabilityEcho](https://github.com/Conalh/CapabilityEcho) | New outbound `fetch` to a telemetry host in `src/` |
| [TaskBound](https://github.com/Conalh/TaskBound) | PR titled "fix: typo in README" but touches unrelated files |
| [SessionTrail](https://github.com/Conalh/SessionTrail) | Transcript reading `.ssh`, piping `curl` to shell |

Then [GovVerdict](https://github.com/Conalh/GovVerdict) consolidates all five into one PR comment. The job fails on critical, so the PR check turns red.

## License

MIT (the demo content; the tools themselves are also MIT — see each repo).
