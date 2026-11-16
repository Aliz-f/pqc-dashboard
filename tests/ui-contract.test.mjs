import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

function component(from, to) {
  const start = app.indexOf(from);
  assert.ok(start >= 0, `Missing ${from}`);
  const end = app.indexOf(to, start + from.length);
  assert.ok(end > start, `Missing terminator ${to}`);
  return app.slice(start, end);
}

test("customer preview has a separate frame and scope filter", () => {
  const report = component("function CustomerReport({", "const guideSections");
  assert.match(report, /customerScope === "The Organization"/);
  assert.match(report, /className="customer-report-shell"/);
  assert.match(report, /31 December 2027/);
  assert.match(report, /31 December 2030/);
  assert.match(report, /Contract amendment pending/);
  assert.match(report, /Potential HNDL Exposure by Data Class/);
  assert.doesNotMatch(report, /Top 3 Organizational Risks/);
});

test("customer preview withholds metrics for stale and incomplete snapshots", () => {
  const report = component("function CustomerReport({", "const guideSections");
  assert.match(report, /scenario === "stale"/);
  assert.match(report, /const volumeDataComplete = traffic.complete/);
  assert.match(report, /volumeUnavailable/);
  assert.match(report, /"Not available"/);
});

test("blockers have customer scoping, primary categories, and a pending deadline warning", () => {
  const blockers = component("function MigrationBlockers({", "function FallbackExceptions({");
  assert.match(blockers, /primaryMigrationBlocker/);
  assert.match(blockers, /The Organization/);
  assert.match(blockers, /Internal only/);
  assert.match(blockers, /2028/);
  assert.match(blockers, /31 Dec 2027/);
  assert.match(blockers, /not been approved or technically validated/);
});

test("fallback exception status is clearly simulated rather than a real authorization", () => {
  const exceptions = component("function FallbackExceptions({", "function CustomerReport({");
  assert.match(exceptions, /Accepted in simulation/);
  assert.match(exceptions, /not approval by a real security/);
  assert.match(exceptions, /Potential HNDL exposure/);
  assert.match(exceptions, /monitoringImpactIfDisabled/);
});

test("security view refuses detected-attack and downgrade claims", () => {
  const security = component("function Connections({", "function EmptyState({");
  assert.match(security, /not evidence that harvesting occurred/);
  assert.match(security, /does not mean traffic/);
  assert.match(security, /malicious downgrade/);
});

test("traffic exposure uses the customer scope and labels its subtotal", () => {
  const exposure = component("function TrafficExposure({", "function Connections({");
  assert.match(exposure, /customerScope === "The Organization"/);
  assert.match(exposure, /60 GB/);
  assert.match(exposure, /company-wide classical/);
  assert.match(exposure, /!traffic.complete/);
});
