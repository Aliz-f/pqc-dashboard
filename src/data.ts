export type Protocol = "ML-KEM" | "Classical";
export type ConnectionStatus = "Active" | "Inactive";
export type CustomerScope = "The Organization" | "Internal only";
export type DataClass = "Personal data" | "Operational data";
export type MigrationBlocker =
  | "Hardware replacement pending"
  | "Software upgrade pending"
  | "Compatibility issue"
  | "Unknown blocker";
export type ExceptionStatus = "Accepted in simulation" | "Pending assessment" | "Unknown";

export type Connection = {
  id: string;
  ip: string | null;
  protocol: Protocol;
  status: ConnectionStatus;
  customerScope: CustomerScope;
  customerRef?: string;
  primaryMigrationBlocker?: MigrationBlocker;
  fallbackReason?: string;
  monitoringImpactIfDisabled?: string | null;
  expectedReplacementAvailability?: string | null;
  simulatedExceptionStatus?: ExceptionStatus;
  notes?: string;
};

export type TrafficVolumeRecord = {
  connectionId: string;
  dataClass: DataClass;
  transferredVolume: number;
  volumeUnit: "GB";
  monitoringPeriod: string;
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
  {
    id: "CN-001",
    customerRef: "C-01",
    ip: "10.20.0.11",
    protocol: "ML-KEM",
    status: "Active",
    customerScope: "The Organization",
  },
  {
    id: "CN-002",
    customerRef: "C-02",
    ip: "10.20.0.12",
    protocol: "ML-KEM",
    status: "Active",
    customerScope: "The Organization",
  },
  {
    id: "CN-003",
    customerRef: "C-04",
    ip: "10.20.1.21",
    protocol: "Classical",
    status: "Active",
    customerScope: "The Organization",
    primaryMigrationBlocker: "Hardware replacement pending",
    fallbackReason: "Current field device requires classical key establishment.",
    monitoringImpactIfDisabled: "Removing fallback may interrupt monitoring of this legacy device.",
    expectedReplacementAvailability: "2028",
    simulatedExceptionStatus: "Accepted in simulation",
    notes: "Certified replacement availability is expected after the proposed customer deadline.",
  },
  {
    id: "CN-004",
    customerRef: "C-03",
    ip: "10.20.0.14",
    protocol: "ML-KEM",
    status: "Active",
    customerScope: "The Organization",
  },
  {
    id: "CN-005",
    customerRef: "C-05",
    ip: "10.20.1.25",
    protocol: "Classical",
    status: "Active",
    customerScope: "The Organization",
    primaryMigrationBlocker: "Compatibility issue",
    fallbackReason:
      "Current endpoint compatibility does not support the assessed ML-KEM configuration.",
    monitoringImpactIfDisabled:
      "Service connectivity may be interrupted until compatibility is assessed.",
    expectedReplacementAvailability: null,
    simulatedExceptionStatus: "Pending assessment",
    notes: "Compatibility path has not been technically validated.",
  },
  {
    id: "CN-006",
    ip: "10.20.0.16",
    protocol: "ML-KEM",
    status: "Active",
    customerScope: "Internal only",
  },
  {
    id: "CN-007",
    ip: null,
    protocol: "ML-KEM",
    status: "Inactive",
    customerScope: "Internal only",
  },
  {
    id: "CN-008",
    ip: "10.20.1.28",
    protocol: "Classical",
    status: "Active",
    customerScope: "Internal only",
    primaryMigrationBlocker: "Software upgrade pending",
    fallbackReason: "Required software upgrade is pending.",
    monitoringImpactIfDisabled: "Not available",
    expectedReplacementAvailability: null,
    simulatedExceptionStatus: "Pending assessment",
    notes: "Internal-only connection; no customer deadline applies.",
  },
  {
    id: "CN-009",
    ip: "10.20.0.19",
    protocol: "ML-KEM",
    status: "Active",
    customerScope: "Internal only",
  },
  {
    id: "CN-010",
    ip: "10.20.0.20",
    protocol: "ML-KEM",
    status: "Active",
    customerScope: "Internal only",
  },
  {
    id: "CN-011",
    ip: "10.20.1.31",
    protocol: "Classical",
    status: "Active",
    customerScope: "Internal only",
    primaryMigrationBlocker: "Hardware replacement pending",
    fallbackReason: "Current field device requires classical key establishment.",
    monitoringImpactIfDisabled: "Removing fallback may interrupt internal device monitoring.",
    expectedReplacementAvailability: "2028",
    simulatedExceptionStatus: "Unknown",
    notes: "Replacement timing is illustrative and requires confirmation.",
  },
  {
    id: "CN-012",
    ip: "10.20.0.22",
    protocol: "ML-KEM",
    status: "Inactive",
    customerScope: "Internal only",
  },
];

export const trafficVolumeRecords: TrafficVolumeRecord[] = [
  {
    connectionId: "CN-001",
    dataClass: "Personal data",
    transferredVolume: 20,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-001",
    dataClass: "Operational data",
    transferredVolume: 60,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-002",
    dataClass: "Personal data",
    transferredVolume: 20,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-002",
    dataClass: "Operational data",
    transferredVolume: 60,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-004",
    dataClass: "Personal data",
    transferredVolume: 20,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-004",
    dataClass: "Operational data",
    transferredVolume: 60,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-003",
    dataClass: "Personal data",
    transferredVolume: 25,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-003",
    dataClass: "Operational data",
    transferredVolume: 10,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-005",
    dataClass: "Personal data",
    transferredVolume: 15,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
  {
    connectionId: "CN-005",
    dataClass: "Operational data",
    transferredVolume: 10,
    volumeUnit: "GB",
    monitoringPeriod: "Sample assessment period",
  },
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

export function calculateCustomerMetrics(records: Connection[]) {
  return calculateMetrics(records.filter((record) => record.customerScope === "The Organization"));
}

export function calculateTrafficMetrics(
  records: Connection[],
  volumeRecords: TrafficVolumeRecord[] = trafficVolumeRecords,
) {
  const connectionMap = new Map(records.map((record) => [record.id, record]));
  const included = volumeRecords.filter((record) => connectionMap.has(record.connectionId));
  const classical = included.filter(
    (record) => connectionMap.get(record.connectionId)?.protocol === "Classical",
  );
  const totalVolume = included.reduce((sum, record) => sum + record.transferredVolume, 0);
  const classicalVolume = classical.reduce((sum, record) => sum + record.transferredVolume, 0);
  const byClass = (["Personal data", "Operational data"] as DataClass[]).map((dataClass) => {
    const classRecords = included.filter((record) => record.dataClass === dataClass);
    const classClassical = classical.filter((record) => record.dataClass === dataClass);
    const total = classRecords.reduce((sum, record) => sum + record.transferredVolume, 0);
    const potentiallyExposed = classClassical.reduce(
      (sum, record) => sum + record.transferredVolume,
      0,
    );
    return {
      dataClass,
      total,
      potentiallyExposed,
      percentage: total === 0 ? null : (potentiallyExposed / total) * 100,
    };
  });

  return {
    totalVolume,
    classicalVolume,
    classicalShare: totalVolume === 0 ? null : (classicalVolume / totalVolume) * 100,
    byClass,
    knownConnectionIds: new Set(included.map((record) => record.connectionId)),
  };
}
