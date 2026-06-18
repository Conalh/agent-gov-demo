# Sample review output

These are the **actual** JSON reports and consolidated verdict produced by running
the agent-gov suite against this repo's rogue PR (`main` → `demo/rogue-agent`).
Nothing here is hand-written — it is captured tool output, committed so the
headline numbers in the top-level [README](../README.md) are verifiable without
running CI.

## Headline

| | |
| --- | --- |
| Raw findings (5 tools) | 42 |
| After GovVerdict fingerprint dedup | **42** |
| Severity split | 4 critical · 17 high · 21 medium |
| Consolidated rating | **critical** (job fails on `critical`) |

Per tool, after merge: `scope_trail` 15 · `session_trail` 13 · `task_bound` 10 ·
`capability_echo` 3 · `policy_mesh` 1.

## Files

| File | What it is |
| --- | --- |
| `scopetrail-report.json` | ScopeTrail — agent permission drift (`.claude/settings.json`). |
| `policymesh-report.json` | PolicyMesh — cross-surface policy contradiction. |
| `capabilityecho-report.json` | CapabilityEcho — capability drift in the code diff. |
| `taskbound-report.json` | TaskBound — diff scope vs. the stated "fix typo" task. |
| `sessiontrail-report.json` | SessionTrail — risky runtime behavior in the planted transcript. |
| `verdict.json` / `verdict.md` | GovVerdict — the five reports merged and deduped into one review. |

## How these were generated

The [`agent-gov-review.yml`](../.github/workflows/agent-gov-review.yml) workflow
runs the same five Actions on every PR and hands the reports to GovVerdict. To
reproduce locally with the built CLIs (each `dist/index.js`):

```bash
# GitHub computes a PR diff from the merge-base (three-dot). The diff CLIs take
# two explicit refs and compare them directly, so pass the merge-base as --base
# to match what CI actually reviewed — diffing from main's current tip would
# also drag in commits main gained after the branch point.
BASE=$(git -C agent-gov-demo merge-base main demo/rogue-agent)

node ScopeTrail/dist/index.js     diff  --repo agent-gov-demo --base "$BASE" --head demo/rogue-agent --format json > scopetrail-report.json
node PolicyMesh/dist/index.js     audit --repo agent-gov-demo --recursive --format json                        > policymesh-report.json
node CapabilityEcho/dist/index.js diff  --repo agent-gov-demo --base "$BASE" --head demo/rogue-agent --format json > capabilityecho-report.json
node TaskBound/dist/index.js      review --task "fix: typo in README" --repo agent-gov-demo --base "$BASE" --head demo/rogue-agent --format json > taskbound-report.json
node SessionTrail/dist/index.js   audit --transcript-dir agent-gov-demo/ai-agent-transcripts --repo agent-gov-demo --format json > sessiontrail-report.json

node GovVerdict/dist/index.js review --reports '*-report.json' --format md
```

Captured 2026-06-18. CI produces equivalent output; file paths are normalized to
forward slashes so the artifact matches a Linux runner.
