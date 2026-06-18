import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const workflow = readFileSync(".github/workflows/agent-gov-review.yml", "utf8");

function stepBlock(name) {
  const match = workflow.match(
    new RegExp(String.raw`^      - name: ${name}\r?\n[\s\S]*?(?=^      - name: |\r?\n      # |\r?\n$)`, "m"),
  );

  assert.ok(match, `missing ${name} step`);
  return match[0];
}

test("ScopeTrail is pinned to the semantic-fingerprint release", () => {
  assert.match(workflow, /uses: Conalh\/ScopeTrail@v0\.4\.0/);
});

test("SessionTrail is skipped when the optional transcript fixture is absent", () => {
  const probe = stepBlock("Check SessionTrail transcripts");
  assert.match(probe, /id: sessiontrail-input/);
  assert.match(probe, /find ai-agent-transcripts -type f -name '\*\.jsonl'/);
  assert.match(probe, /has-transcripts=true/);
  assert.match(probe, /has-transcripts=false/);

  const sessionTrail = stepBlock("SessionTrail");
  assert.match(sessionTrail, /if: steps\.sessiontrail-input\.outputs\.has-transcripts == 'true'/);

  const collectReport = stepBlock("Collect SessionTrail report");
  assert.match(collectReport, /steps\.sessiontrail-input\.outputs\.has-transcripts == 'true'/);
});

test("GovVerdict remains the red-by-design critical gate", () => {
  const govVerdict = stepBlock("GovVerdict");
  assert.match(govVerdict, /if: always\(\)/);
  assert.match(govVerdict, /fail-on: critical/);
  assert.doesNotMatch(govVerdict, /fail-on: none/);
});
