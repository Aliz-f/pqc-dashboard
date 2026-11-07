export type Protocol = "ML-KEM" | "Classical";
export type ConnectionStatus = "Active" | "Inactive";

export type Connection = {
  id: string;
  ip: string | null;
  protocol: Protocol;
  status: ConnectionStatus;
};

export type ScenarioId =
  | "standard"
  | "empty"
  | "all-mlkem"
  | "all-classical"
  | "stale"
  | "invalid"
  | "critical";

export const standardConnections: Connection[] = [
  { id: "CN-001", ip: "10.20.0.11", protocol: "ML-KEM", status: "Active" },
  { id: "CN-002", ip: "10.20.0.12", protocol: "ML-KEM", status: "Active" },
  { id: "CN-003", ip: "10.20.1.21", protocol: "Classical", status: "Active" },
  { id: "CN-004", ip: "10.20.0.14", protocol: "ML-KEM", status: "Active" },
  { id: "CN-005", ip: "10.20.1.25", protocol: "Classical", status: "Active" },
  { id: "CN-006", ip: "10.20.0.16", protocol: "ML-KEM", status: "Active" },
  { id: "CN-007", ip: null, protocol: "ML-KEM", status: "Inactive" },
  { id: "CN-008", ip: "10.20.1.28", protocol: "Classical", status: "Active" },
  { id: "CN-009", ip: "10.20.0.19", protocol: "ML-KEM", status: "Active" },
  { id: "CN-010", ip: "10.20.0.20", protocol: "ML-KEM", status: "Active" },
  { id: "CN-011", ip: "10.20.1.31", protocol: "Classical", status: "Active" },
  { id: "CN-012", ip: "10.20.0.22", protocol: "ML-KEM", status: "Inactive" },
];

export const scenarios: {
  id: ScenarioId;
  name: string;
  shortName: string;
  description: string;
}[] = [
  {
    id: "standard",
    name: "Standard dataset",
    shortName: "Standard",
    description: "8 ML-KEM, 4 classical — current Sprint 1 baseline",
  },
  {
    id: "empty",
    name: "Empty dataset",
    shortName: "Empty",
    description: "No assessed connections; coverage and status unavailable",
  },
  {
    id: "all-mlkem",
    name: "All ML-KEM",
    shortName: "100% ML-KEM",
    description: "Illustrative Green state with all 12 connections migrated",
  },
  {
    id: "all-classical",
    name: "All classical",
    shortName: "0% ML-KEM",
    description: "All 12 connections use classical fallback",
  },
  {
    id: "stale",
    name: "Stale snapshot",
    shortName: "Stale data",
    description: "Values exist, but the snapshot is too old to justify a status",
  },
  {
    id: "invalid",
    name: "Invalid assessment",
    shortName: "Invalid data",
    description: "Assessment validation failed; status is withheld",
  },
  {
    id: "critical",
    name: "Critical concern",
    shortName: "Critical",
    description: "Illustrative Red scenario with a declared critical concern",
  },
];

export function recordsForScenario(scenario: ScenarioId): Connection[] {
  if (scenario === "empty") return [];
  if (scenario === "all-mlkem") {
    return standardConnections.map((record) => ({ ...record, protocol: "ML-KEM" }));
  }
  if (scenario === "all-classical") {
    return standardConnections.map((record) => ({ ...record, protocol: "Classical" }));
  }
  return standardConnections;
}

export function calculateMetrics(records: Connection[]) {
  const total = records.length;
  const mlkem = records.filter((record) => record.protocol === "ML-KEM").length;
  const classical = records.filter((record) => record.protocol === "Classical").length;
  const activeClassical = records.filter(
    (record) => record.protocol === "Classical" && record.status === "Active",
  ).length;

  return {
    total,
    mlkem,
    classical,
    activeClassical,
    coverage: total === 0 ? null : (mlkem / total) * 100,
  };
}
