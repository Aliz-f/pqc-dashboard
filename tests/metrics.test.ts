import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateMetrics,
  calculateCustomerMetrics,
  calculateTrafficMetrics,
  recordsForScenario,
  standardConnections,
  trafficVolumeRecords,
} from "../src/data.ts";

const customerRecords = standardConnections.filter(
  (connection) => connection.customerScope === "The Organization",
);

test("Sprint 1 baseline is preserved in V2", () => {
  const result = calculateMetrics(standardConnections);
  assert.deepEqual(
    [result.total, result.mlkem, result.classical, result.activeClassical],
    [12, 8, 4, 4],
  );
  assert.ok(Math.abs(result.coverage! - 66.6666666667) < 0.00001);
});

test("customer scope does not mix internal connections", () => {
  assert.equal(customerRecords.length, 5);
  assert.equal(standardConnections.length - customerRecords.length, 7);
  const result = calculateCustomerMetrics(standardConnections);
  assert.equal(result.total, 5);
  assert.equal(result.mlkem, 3);
  assert.equal(result.classical, 2);
  assert.equal(result.coverage, 60);
});

test("customer-only HNDL-associated transferred data is computed per class", () => {
  const result = calculateTrafficMetrics(customerRecords);
  assert.equal(result.complete, true);
  assert.equal(result.totalVolume, 300);
  assert.equal(result.classicalVolume, 60);
  assert.equal(result.classicalShare, 20);
  assert.deepEqual(result.byClass.map((x) => [
    x.dataClass, x.total, x.potentiallyExposed, x.percentage,
  ]), [
    ["Personal data", 100, 40, 40],
    ["Operational data", 200, 20, 10],
  ]);
});

test("only customer records can contribute to customer volume calculations", () => {
  const injected = [
    ...trafficVolumeRecords,
    { ...trafficVolumeRecords[0], connectionId: "CN-008", transferredVolume: 5000 },
  ];
  const result = calculateTrafficMetrics(customerRecords, injected);
  assert.equal(result.complete, true);
  assert.equal(result.totalVolume, 300);
  assert.equal(result.classicalVolume, 60);
});

test("empty dataset produces unavailable percentages", () => {
  assert.equal(calculateMetrics([]).coverage, null);
  const result = calculateTrafficMetrics([]);
  assert.equal(result.complete, false);
  assert.equal(result.classicalShare, null);
});

test("all ML-KEM and all classical scenarios use the same denominator", () => {
  const allPqc = calculateMetrics(recordsForScenario("all-mlkem"));
  const allClassical = calculateMetrics(recordsForScenario("all-classical"));
  assert.equal(allPqc.coverage, 100);
  assert.equal(allPqc.classical, 0);
  assert.equal(allClassical.coverage, 0);
  assert.equal(allClassical.classical, 12);
});

test("one primary blocker and explicit scopes for each standard classical connection", () => {
  const fallback = standardConnections.filter((record) => record.protocol === "Classical");
  assert.equal(fallback.length, 4);
  assert.equal(fallback.filter((record) => record.customerScope === "The Organization").length, 2);
  assert.ok(fallback.every((record) => record.primaryMigrationBlocker));
  assert.ok(fallback.every((record) => record.fallbackReason));
  assert.ok(fallback.every((record) => record.simulatedExceptionStatus));
  const impacted = fallback.filter((record) =>
    record.customerScope === "The Organization" &&
    record.expectedReplacementAvailability === "2028",
  );
  assert.equal(impacted.length, 1);
});

test("missing volume class entry withholds all percentages", () => {
  const reduced = trafficVolumeRecords.filter((record) =>
    !(record.connectionId === "CN-005" && record.dataClass === "Operational data"),
  );
  const result = calculateTrafficMetrics(customerRecords, reduced);
  assert.equal(result.complete, false);
  assert.equal(result.missingClassEntries.length, 1);
  assert.equal(result.classicalShare, null);
  assert.ok(result.byClass.every((item) => item.percentage === null));
});

test("duplicate class entry cannot silently inflate totals", () => {
  const duplicate = [...trafficVolumeRecords, trafficVolumeRecords[0]];
  const result = calculateTrafficMetrics(customerRecords, duplicate);
  assert.equal(result.complete, false);
  assert.equal(result.classicalShare, null);
});

test("invalid negative or nonfinite values invalidate volume share", () => {
  for (const transferredVolume of [-1, NaN, Infinity]) {
    const rows = trafficVolumeRecords.map((row, i) =>
      i === 0 ? { ...row, transferredVolume } : row
    );
    const result = calculateTrafficMetrics(customerRecords, rows);
    assert.equal(result.complete, false);
    assert.equal(result.classicalShare, null);
  }
});

test("migration blocker totals reconcile with synthetic connection records", () => {
  const fallback = standardConnections.filter((record) => record.protocol === "Classical");
  const types = [
    "Hardware replacement pending", "Software upgrade pending",
    "Compatibility issue", "Unknown blocker",
  ];
  const counts = types.map((blocker) => fallback.filter(
    (record) => (record.primaryMigrationBlocker ?? "Unknown blocker") === blocker,
  ).length);
  assert.deepEqual(counts, [2, 1, 1, 0]);
  assert.equal(counts.reduce((sum, count) => sum + count, 0), fallback.length);
  const customer = fallback.filter((record) => record.customerScope === "The Organization");
  assert.equal(customer.length, 2);
  assert.deepEqual(
    customer.map((record) => record.primaryMigrationBlocker).sort(),
    ["Compatibility issue", "Hardware replacement pending"],
  );
});

test("fallback exception fields retain unknown impacts and simulated approvals", () => {
  const fallback = standardConnections.filter((record) => record.protocol === "Classical");
  const internal = fallback.find((record) => record.id === "CN-008")!;
  assert.equal(internal.monitoringImpactIfDisabled, "Not available");
  assert.equal(internal.customerScope, "Internal only");
  const accepted = fallback.find((record) =>
    record.simulatedExceptionStatus === "Accepted in simulation",
  )!;
  assert.equal(accepted.protocol, "Classical");
  assert.equal(accepted.customerScope, "The Organization");
  assert.equal(accepted.expectedReplacementAvailability, "2028");
});
