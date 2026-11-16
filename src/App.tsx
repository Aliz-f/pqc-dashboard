import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  calculateCustomerMetrics,
  calculateMetrics,
  calculateTrafficMetrics,
  recordsForScenario,
  scenarios,
  trafficVolumeRecords,
  type Connection,
  type MigrationBlocker,
  type Protocol,
  type ScenarioId,
} from "./data";

type Page =
  | "overview"
  | "connections"
  | "migration"
  | "blockers"
  | "exceptions"
  | "customer-report"
  | "guide"
  | "system";
type ProtocolFilter = "All" | Protocol;

function Icon({
  name,
  size = 18,
}: {
  name:
    | "overview"
    | "connections"
    | "migration"
    | "info"
    | "search"
    | "arrow"
    | "chevron"
    | "database"
    | "clock"
    | "shield"
    | "menu"
    | "close"
    | "check"
    | "file";
  size?: number;
}) {
  const paths: Record<string, ReactNode> = {
    overview: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    connections: (
      <>
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="m8.7 10.7 6.6-3.4M8.7 13.3l6.6 3.4" />
      </>
    ),
    migration: (
      <>
        <path d="M4 19V9M10 19V5M16 19v-7M22 19V2" />
        <path d="M2 19h22" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    database: (
      <>
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 4.5 6v5.5c0 4.5 3 7.8 7.5 9.5 4.5-1.7 7.5-5 7.5-9.5V6L12 3Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    check: <path d="m5 12 4 4L19 6" />,
    file: (
      <>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "teal" | "amber" | "green" | "red" | "neutral" | "blue";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Tooltip({ label }: { label: string }) {
  return (
    <span className="tooltip">
      <button className="icon-button tooltip-trigger" aria-label={label}>
        <Icon name="info" size={15} />
      </button>
      <span className="tooltip-content" role="tooltip">
        {label}
      </span>
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string | number;
  detail?: string;
  tone?: "amber" | "teal";
}) {
  return (
    <article className={`metric-card ${tone ? `metric-${tone}` : ""}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {detail && <div className="metric-detail">{detail}</div>}
    </article>
  );
}

function ScenarioControl({
  value,
  onChange,
}: {
  value: ScenarioId;
  onChange: (value: ScenarioId) => void;
}) {
  const active = scenarios.find((scenario) => scenario.id === value)!;
  return (
    <div className="scenario-control">
      <div className="scenario-copy">
        <span>Prototype scenario</span>
        <strong>{active.shortName}</strong>
      </div>
      <label className="sr-only" htmlFor="scenario">
        Choose prototype test state
      </label>
      <div className="select-wrap">
        <select
          id="scenario"
          value={value}
          onChange={(event) => onChange(event.target.value as ScenarioId)}
        >
          {scenarios.map((scenario) => (
            <option value={scenario.id} key={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
        <Icon name="chevron" size={15} />
      </div>
    </div>
  );
}

function Sidebar({
  page,
  onNavigate,
  open,
  onClose,
}: {
  page: Page;
  onNavigate: (page: Page) => void;
  open: boolean;
  onClose: () => void;
}) {
  const navItems: {
    id: Page;
    label: string;
    caption: string;
    icon: "overview" | "connections" | "migration" | "shield";
  }[] = [
    { id: "overview", label: "Overview", caption: "Executive view", icon: "overview" },
    {
      id: "connections",
      label: "Connections",
      caption: "Security view",
      icon: "connections",
    },
    { id: "migration", label: "Migration", caption: "Coverage view", icon: "migration" },
    { id: "blockers", label: "Blockers", caption: "Migration dependencies", icon: "migration" },
    {
      id: "exceptions",
      label: "Fallback exceptions",
      caption: "Continuity trade-offs",
      icon: "shield",
    },
  ];

  return (
    <>
      {open && <button className="sidebar-scrim" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <Icon name="shield" size={21} />
          </div>
          <div>
            <strong>PQC Monitor</strong>
            <span>Sprint 2 prototype</span>
          </div>
          <button className="mobile-close" onClick={onClose} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Internal dashboard">
          <div className="nav-label">Internal dashboard</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
            >
              <Icon name={item.icon} size={19} />
              <span>
                <strong>{item.label}</strong>
                <small>{item.caption}</small>
              </span>
            </button>
          ))}
          <div className="nav-label nav-label-secondary">Customer reporting</div>
          <button
            className={`nav-item customer-nav-item ${page === "customer-report" ? "active" : ""}`}
            onClick={() => {
              onNavigate("customer-report");
              onClose();
            }}
          >
            <Icon name="file" size={19} />
            <span>
              <strong>Customer report preview</strong>
              <small>Customer-safe presentation</small>
            </span>
          </button>
        </nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-scope">
          <Icon name="database" size={18} />
          <div>
            <strong>Synthetic dataset</strong>
            <span>No live network traffic</span>
          </div>
        </div>
        <div className="internal-links">
          <span>Prototype resources</span>
          <button
            onClick={() => {
              onNavigate("guide");
              onClose();
            }}
          >
            Prototype guide
          </button>
          <button
            onClick={() => {
              onNavigate("system");
              onClose();
            }}
          >
            Design system
          </button>
        </div>
        <div className="sidebar-footer">
          <span className="avatar">U</span>
          <div>
            <strong>University project</strong>
            <span>Educational prototype</span>
          </div>
        </div>
      </aside>
    </>
  );
}

function Header({
  page,
  scenario,
  setScenario,
  onMenu,
}: {
  page: Page;
  scenario: ScenarioId;
  setScenario: (scenario: ScenarioId) => void;
  onMenu: () => void;
}) {
  const names: Record<Page, string> = {
    overview: "Executive overview",
    connections: "Connection security",
    migration: "Migration coverage",
    blockers: "Migration blockers",
    exceptions: "Classical fallback exceptions",
    "customer-report": "Customer report preview",
    guide: "Prototype guide",
    system: "Design system",
  };
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenu} aria-label="Open navigation">
        <Icon name="menu" />
      </button>
      <div className="header-section">
        <span>PQC Security Monitoring Dashboard</span>
        <strong>{names[page]}</strong>
      </div>
      <div className="topbar-meta">
        <div className={`snapshot ${scenario === "stale" ? "stale" : ""}`}>
          <span className="snapshot-dot" />
          <div>
            <strong>Synthetic demonstration data</strong>
            <span>
              <Icon name="clock" size={12} />
              {scenario === "stale"
                ? "Sampled 14 days ago · Stale"
                : "Sampled 14 Jun 2025 · 09:30 UTC"}
            </span>
          </div>
          <Tooltip label="This prototype does not monitor live network traffic." />
        </div>
        <ScenarioControl value={scenario} onChange={setScenario} />
      </div>
    </header>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

function UnavailableNotice({ reason }: { reason: "empty" | "stale" | "invalid" }) {
  const copy = {
    empty: {
      title: "No assessed connections in this scenario",
      text: "Coverage and executive status are unavailable because the assessed population is zero.",
    },
    stale: {
      title: "Synthetic snapshot is stale",
      text: "Values remain visible for demonstration, but their age prevents a justified executive status.",
    },
    invalid: {
      title: "Assessment data could not be validated",
      text: "Metrics are withheld to avoid presenting incomplete or invalid inputs as reliable evidence.",
    },
  }[reason];
  return (
    <div className="notice notice-neutral" role="status">
      <Icon name="info" />
      <div>
        <strong>{copy.title}</strong>
        <p>{copy.text}</p>
      </div>
    </div>
  );
}

function Overview({
  records,
  scenario,
  onNavigate,
}: {
  records: Connection[];
  scenario: ScenarioId;
  onNavigate: (page: Page, filter?: ProtocolFilter) => void;
}) {
  const metrics = calculateMetrics(records);
  const unavailable = scenario === "empty" || scenario === "stale" || scenario === "invalid";
  const status = unavailable
    ? "Unknown"
    : scenario === "critical"
      ? "Red"
      : metrics.classical > 0
        ? "Amber"
        : "Green";
  const statusCopy = {
    Unknown: "Unable to assess",
    Red: "Urgent management attention",
    Amber: "Management attention recommended",
    Green: "No unresolved signal in this scenario",
  }[status];

  return (
    <>
      <PageIntro
        eyebrow="Executive transition summary"
        title="PQC Migration Overview"
        description="A concise view of migration progress, residual exposure, and where management attention may be needed."
      />
      <section className="customer-request-banner">
        <div className="request-label">
          <span>Sprint 2 customer request</span>
          <Badge tone="amber">Contract amendment pending</Badge>
        </div>
        <div className="request-deadline">
          <span>Proposed customer PQC deadline</span>
          <strong>31 Dec 2027</strong>
          <small>Previous proposed schedule: 31 Dec 2030</small>
        </div>
        <p>
          The Organization has requested customer-scoped readiness and potential HNDL exposure
          reporting. This request is not an accepted contractual commitment.
        </p>
        <button className="button button-primary" onClick={() => onNavigate("customer-report")}>
          Open customer report preview <Icon name="arrow" size={16} />
        </button>
      </section>
      <section className={`status-hero status-${status.toLowerCase()}`}>
        <div className="status-main">
          <div className="status-kicker">
            <span className="status-pulse" />
            Illustrative transition status
            <Tooltip label="Illustrative demonstration rules — pending Product Owner approval." />
          </div>
          <div className="status-word">{status === "Unknown" ? "Unable to assess" : status}</div>
          <h2>{statusCopy}</h2>
          <p>
            {unavailable
              ? scenario === "empty"
                ? "There are no assessed connections, so the dashboard cannot calculate coverage or justify a status."
                : scenario === "stale"
                  ? "The available snapshot is too old to support a current management decision."
                  : "The supplied assessment failed validation, so no executive conclusion is shown."
              : scenario === "critical"
                ? "A scenario-defined critical concern requires escalation; 4 connections also continue to rely on classical fallback."
                : `${metrics.mlkem} of ${metrics.total} assessed connections use ML-KEM, while ${metrics.classical} still rely on classical fallback.`}
          </p>
          <div className="hero-actions">
            <button
              className="button button-primary"
              onClick={() => onNavigate("connections", "Classical")}
            >
              Inspect exposure <Icon name="arrow" size={16} />
            </button>
            <button className="button button-secondary" onClick={() => onNavigate("migration")}>
              View migration coverage
            </button>
          </div>
        </div>
        <div className="status-logic">
          <span>Scenario signal</span>
          <div className="traffic-lights" aria-label={`${status} status`}>
            {["Green", "Amber", "Red"].map((light) => (
              <span
                key={light}
                className={`light light-${light.toLowerCase()} ${status === light ? "light-active" : ""}`}
              />
            ))}
            <span className={`light light-unknown ${status === "Unknown" ? "light-active" : ""}`}>
              ?
            </span>
          </div>
          <p>
            Coverage is considered alongside exposure, critical concerns, freshness, and
            completeness.
          </p>
        </div>
      </section>

      {unavailable && <UnavailableNotice reason={scenario as "empty" | "stale" | "invalid"} />}

      <section className="metric-grid three">
        <MetricCard
          label="ML-KEM migration coverage"
          value={
            unavailable || metrics.coverage === null
              ? "Unavailable"
              : `${metrics.coverage.toFixed(1)}%`
          }
          detail={
            unavailable
              ? "A valid, current population is required"
              : `${metrics.mlkem} of ${metrics.total} assessed`
          }
          tone="teal"
        />
        <MetricCard
          label="Remaining classical fallback"
          value={scenario === "invalid" ? "—" : metrics.classical}
          detail="Potential future-decryption exposure"
          tone="amber"
        />
        <MetricCard
          label="Data scope"
          value={scenario === "invalid" ? "Invalid" : metrics.total}
          detail="Assessed synthetic connections"
        />
      </section>

      <section className="content-grid">
        <article className="panel why-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Decision context</span>
              <h2>Why this status?</h2>
            </div>
            <Badge
              tone={
                status === "Amber"
                  ? "amber"
                  : status === "Red"
                    ? "red"
                    : status === "Green"
                      ? "green"
                      : "neutral"
              }
            >
              {status}
            </Badge>
          </div>
          <p className="lead">
            Classical fallback may create future-decryption exposure, but disabling it on
            unsupported legacy equipment could interrupt operational monitoring. Decisions require
            balancing both concerns.
          </p>
          <div className="decision-row">
            <div>
              <span className="decision-icon amber">
                <Icon name="shield" />
              </span>
              <div>
                <strong>Security continuity</strong>
                <p>{metrics.classical} assessed connections retain classical key exchange.</p>
              </div>
            </div>
            <div>
              <span className="decision-icon blue">
                <Icon name="connections" />
              </span>
              <div>
                <strong>Service continuity</strong>
                <p>
                  Legacy equipment may need fallback until certified replacements are available.
                </p>
              </div>
            </div>
          </div>
        </article>
        <aside className="panel attention-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Management focus</span>
              <h2>What needs attention</h2>
            </div>
            <Badge tone={metrics.classical > 0 ? "amber" : "green"}>
              {metrics.classical > 0 ? `${metrics.classical} remaining` : "No fallback"}
            </Badge>
          </div>
          <p className="attention-copy">
            Residual classical fallback is the primary attention signal in this assessed snapshot.
            Review the affected connections before making operational changes.
          </p>
          <div className="attention-list">
            <div>
              <Icon name="shield" size={17} />
              <span>
                <strong>Review potential exposure</strong>
                <small>Inspect the four affected records and their current status.</small>
              </span>
            </div>
            <div>
              <Icon name="connections" size={17} />
              <span>
                <strong>Protect service continuity</strong>
                <small>Confirm legacy constraints before changing fallback behavior.</small>
              </span>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}

function ProtocolBadge({ protocol }: { protocol: Protocol }) {
  return (
    <Badge tone={protocol === "ML-KEM" ? "teal" : "amber"}>
      <span className="badge-dot" /> {protocol === "Classical" ? "Classical fallback" : "ML-KEM"}
    </Badge>
  );
}

function ConnectionDetail({ record, onClose }: { record: Connection; onClose: () => void }) {
  return (
    <div className="drawer-scrim" onClick={onClose}>
      <aside
        className="detail-drawer"
        onClick={(event) => event.stopPropagation()}
        aria-label="Connection details"
      >
        <div className="drawer-header">
          <div>
            <span className="eyebrow">Assessed record</span>
            <h2>{record.id}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close detail panel">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-body">
          <div className="detail-field">
            <span>Connection ID</span>
            <strong>{record.id}</strong>
          </div>
          <div className="detail-field">
            <span>IP address</span>
            <strong>{record.ip ?? "Not provided"}</strong>
          </div>
          <div className="detail-field">
            <span>Key exchange</span>
            <ProtocolBadge protocol={record.protocol} />
          </div>
          <div className="detail-field">
            <span>Connection status</span>
            <Badge tone={record.status === "Active" ? "green" : "neutral"}>{record.status}</Badge>
          </div>
          {record.protocol === "Classical" && (
            <div className="drawer-warning">
              <Icon name="info" />
              <div>
                <strong>Potential HNDL exposure</strong>
                <p>
                  Classical key exchange may leave traffic vulnerable to future decryption if it is
                  recorded and the relevant cryptography is later broken. This is a potential
                  exposure indicator, not evidence that harvesting occurred.
                </p>
              </div>
            </div>
          )}
          <div className="scope-card">
            <strong>Record scope</strong>
            <p>
              This panel only shows fields present in the supplied synthetic dataset. No device
              details are inferred.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

function TrafficExposure({ records, scenario }: { records: Connection[]; scenario: ScenarioId }) {
  const customerRecords = records.filter((record) => record.customerScope === "The Organization");
  const traffic = calculateTrafficMetrics(customerRecords);
  const connectionMap = new Map(customerRecords.map((record) => [record.id, record]));
  const classicalVolumeRows = trafficVolumeRecords.filter(
    (record) => connectionMap.get(record.connectionId)?.protocol === "Classical",
  );
  const unavailable = scenario === "empty" || scenario === "invalid";

  return (
    <section className="exposure-section panel">
      <div className="sprint-section-heading">
        <div>
          <span className="sprint-tag">Sprint 2 · MEM-36, MEM-37, MEM-38</span>
          <h2>Classical Fallback Traffic Exposure</h2>
          <p>
            A static, documented estimate for customer-scoped records with available synthetic
            volume data—not live traffic telemetry.
          </p>
        </div>
        <Badge tone="blue">Synthetic data</Badge>
      </div>
      <div className="exposure-layout">
        <article className="traffic-metric">
          <span>Classical Fallback Traffic</span>
          <strong>{unavailable ? "Unknown" : `${traffic.classicalVolume} GB`}</strong>
          <div className="metric-scope">
            <Icon name="database" size={15} />
            <span>
              <b>Scope</b>
              The Organization · records with available volume data
            </span>
          </div>
          <p>
            Transferred volume associated with customer connections using classical key
            establishment during the sample assessment period.
          </p>
        </article>
        <div className="traffic-explanation">
          <span className="decision-icon amber">
            <Icon name="shield" />
          </span>
          <div>
            <span className="eyebrow">Potential exposure, not detection</span>
            <h3>Classical traffic may face future-decryption risk</h3>
            <p>
              Traffic using classical key establishment may be exposed to future
              Harvest-Now-Decrypt-Later risks. This metric does not indicate that data was stolen,
              harvested, or intercepted.
            </p>
          </div>
        </div>
        <div className="calculation-note">
          <span>Annotated calculation</span>
          <code>
            C-04 (25 + 10 GB) + C-05 (15 + 10 GB)
            <b>= 60 GB</b>
          </code>
          <p>
            Personal and operational records are summed once each. Connections remain uniquely
            counted in connection metrics.
          </p>
        </div>
      </div>
      {unavailable ? (
        <EmptyState
          title="Traffic volume not available"
          description="The selected scenario does not contain valid volume inputs, so no total is presented."
        />
      ) : (
        <div className="compact-table-wrap">
          <table className="compact-table">
            <thead>
              <tr>
                <th>Connection</th>
                <th>Key establishment</th>
                <th>Data class</th>
                <th>Transferred volume</th>
                <th>Measurement period</th>
              </tr>
            </thead>
            <tbody>
              {classicalVolumeRows.map((volume) => (
                <tr key={`${volume.connectionId}-${volume.dataClass}`}>
                  <td>
                    <strong>{connectionMap.get(volume.connectionId)?.customerRef}</strong>
                    <small>{volume.connectionId}</small>
                  </td>
                  <td>
                    <ProtocolBadge protocol="Classical" />
                  </td>
                  <td>{volume.dataClass}</td>
                  <td className="tabular">
                    <strong>
                      {volume.transferredVolume} {volume.volumeUnit}
                    </strong>
                  </td>
                  <td>{volume.monitoringPeriod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="scope-warning">
        <Icon name="info" size={16} />
        <span>
          Internal-only classical connections do not have supplied volume records. Therefore, 60 GB
          is a selected-customer subtotal and must not be described as company-wide classical
          traffic.
        </span>
      </div>
    </section>
  );
}

function Connections({
  records,
  scenario,
  initialFilter,
  onFilterHandled,
}: {
  records: Connection[];
  scenario: ScenarioId;
  initialFilter: ProtocolFilter | null;
  onFilterHandled: () => void;
}) {
  const [filter, setFilter] = useState<ProtocolFilter>(initialFilter ?? "All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Connection | null>(null);
  const metrics = calculateMetrics(records);

  useEffect(() => {
    if (!initialFilter) return;
    setFilter(initialFilter);
    onFilterHandled();
  }, [initialFilter, onFilterHandled]);

  const visible = useMemo(
    () =>
      records.filter(
        (record) =>
          (filter === "All" || record.protocol === filter) &&
          record.id.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [filter, query, records],
  );
  const clearFilters = () => {
    setFilter("All");
    setQuery("");
  };

  return (
    <>
      <PageIntro
        eyebrow="Security assessment workspace"
        title="Connection Security"
        description="Inspect classical fallback across assessed synthetic connections."
      />
      <div className="notice notice-amber">
        <Icon name="info" />
        <div>
          <strong>Classical fallback warrants context, not assumptions</strong>
          <p>
            It may indicate potential Harvest-Now-Decrypt-Later exposure. It does not mean traffic
            is unencrypted, prove harvesting, or demonstrate a malicious downgrade.
          </p>
        </div>
      </div>
      {scenario === "stale" && <UnavailableNotice reason="stale" />}
      {scenario === "invalid" && <UnavailableNotice reason="invalid" />}

      <section className="metric-grid three security-metrics">
        <MetricCard
          label="Assessed connections"
          value={scenario === "invalid" ? "—" : metrics.total}
          detail="Supplied synthetic snapshot"
        />
        <MetricCard
          label="Classical fallback connections"
          value={scenario === "invalid" ? "—" : metrics.classical}
          detail="Potential exposure indicators"
          tone="amber"
        />
        <MetricCard
          label="Active classical fallback"
          value={scenario === "invalid" ? "—" : metrics.activeClassical}
          detail="Active at sample time"
          tone="amber"
        />
      </section>

      <TrafficExposure records={records} scenario={scenario} />

      <section className="panel table-panel">
        <div className="table-toolbar">
          <div>
            <span className="eyebrow">Connection inventory</span>
            <h2>
              {scenario === "invalid"
                ? "Assessment unavailable"
                : `${metrics.total} assessed synthetic connections`}
            </h2>
            <p>Includes the supplied connection ID, IP, key exchange, and sampled status only.</p>
          </div>
          <div className="filter-area">
            <div className="segmented" role="group" aria-label="Filter by key exchange">
              {(["All", "ML-KEM", "Classical"] as ProtocolFilter[]).map((item) => (
                <button
                  key={item}
                  className={filter === item ? "selected" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item === "Classical" ? "Classical fallback" : `${item} connections`}
                  <span>
                    {item === "All"
                      ? metrics.total
                      : item === "ML-KEM"
                        ? metrics.mlkem
                        : metrics.classical}
                  </span>
                </button>
              ))}
            </div>
            <label className="search-field">
              <Icon name="search" size={17} />
              <span className="sr-only">Search connection ID</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search connection ID"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search">
                  <Icon name="close" size={15} />
                </button>
              )}
            </label>
          </div>
        </div>
        <div className="result-line">
          <span>
            {visible.length} {visible.length === 1 ? "result" : "results"}
          </span>
          {(filter !== "All" || query) && <button onClick={clearFilters}>Clear filters</button>}
        </div>

        {scenario === "invalid" ? (
          <EmptyState
            title="Assessment data is unavailable"
            description="The synthetic input failed validation. No connection records are presented as reliable."
          />
        ) : visible.length === 0 ? (
          <EmptyState
            title={records.length === 0 ? "No assessed connections" : "No matching connections"}
            description={
              records.length === 0
                ? "This scenario has an empty assessed population. Coverage is unavailable."
                : "Try another connection ID or clear the current protocol filter."
            }
            action={records.length > 0 ? clearFilters : undefined}
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Device / Connection ID</th>
                  <th>IP address</th>
                  <th>Key exchange</th>
                  <th>Connection status</th>
                  <th>Exposure context</th>
                  <th>
                    <span className="sr-only">Open details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((record) => (
                  <tr key={record.id} onClick={() => setSelected(record)}>
                    <td>
                      <strong>{record.id}</strong>
                      <small>Synthetic connection</small>
                    </td>
                    <td>
                      {record.ip ? (
                        <span className="mono">{record.ip}</span>
                      ) : (
                        <span className="missing-value">
                          <Icon name="info" size={14} /> Not provided
                        </span>
                      )}
                    </td>
                    <td>
                      <ProtocolBadge protocol={record.protocol} />
                    </td>
                    <td>
                      <Badge tone={record.status === "Active" ? "green" : "neutral"}>
                        {record.status}
                      </Badge>
                    </td>
                    <td>
                      {record.protocol === "Classical" ? (
                        <span className="exposure-label">
                          <Icon name="shield" size={16} /> Potential HNDL exposure
                          <Tooltip label="Classical key exchange may leave traffic vulnerable to future decryption if it is recorded and the relevant cryptography is later broken. This is a potential exposure indicator, not evidence that harvesting occurred." />
                        </span>
                      ) : (
                        <span className="muted">No indicator from supplied data</span>
                      )}
                    </td>
                    <td>
                      <button className="row-action" aria-label={`View ${record.id} details`}>
                        <Icon name="arrow" size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">
          <div className="legend">
            <strong>Protocol legend</strong>
            <ProtocolBadge protocol="ML-KEM" />
            <ProtocolBadge protocol="Classical" />
          </div>
          <span>All records are fictional and scoped to this educational prototype.</span>
        </div>
      </section>

      <section className="panel hndl-panel">
        <span className="decision-icon amber">
          <Icon name="shield" />
        </span>
        <div>
          <span className="eyebrow">Exposure context</span>
          <h2>What “Potential HNDL exposure” means</h2>
          <p>
            Classical key exchange may leave traffic vulnerable to future decryption if it is
            recorded and the relevant cryptography is later broken. This is a potential exposure
            indicator, not evidence that harvesting occurred.
          </p>
        </div>
        <div className="does-not-mean">
          <strong>It does not mean</strong>
          <span>Attack detected</span>
          <span>Traffic is unencrypted</span>
          <span>Malicious downgrade</span>
        </div>
      </section>
      {selected && <ConnectionDetail record={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: () => void;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name="search" size={23} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <button className="button button-secondary" onClick={action}>
          Clear filters
        </button>
      )}
    </div>
  );
}

function Migration({
  records,
  scenario,
  onNavigate,
}: {
  records: Connection[];
  scenario: ScenarioId;
  onNavigate: (page: Page, filter?: ProtocolFilter) => void;
}) {
  const metrics = calculateMetrics(records);
  const invalid = scenario === "invalid";
  const unavailable = metrics.coverage === null || invalid;
  const coverageLabel = unavailable ? "Not available" : `${metrics.coverage!.toFixed(1)}%`;

  return (
    <>
      <PageIntro
        eyebrow="Migration management workspace"
        title="ML-KEM Migration Coverage"
        description="Track adoption across the assessed population without confusing migration progress with complete security readiness."
      />
      {(scenario === "empty" || scenario === "stale" || invalid) && (
        <UnavailableNotice reason={scenario as "empty" | "stale" | "invalid"} />
      )}
      <section className="coverage-hero panel">
        <div className="coverage-primary">
          <span className="eyebrow">
            Coverage of {invalid ? "unvalidated" : metrics.total} assessed synthetic connections
          </span>
          <div className={`coverage-value ${unavailable ? "small" : ""}`}>{coverageLabel}</div>
          <p>
            {unavailable
              ? "A non-zero, valid assessed population is required to calculate migration coverage."
              : `${metrics.mlkem} of ${metrics.total} assessed connections use ML-KEM`}
          </p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="ML-KEM migration coverage"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={metrics.coverage ?? undefined}
          >
            {!unavailable && <span style={{ width: `${metrics.coverage}%` }} />}
          </div>
          <div className="progress-labels">
            <span>0%</span>
            <span>Assessed population: {metrics.total}</span>
            <span>100%</span>
          </div>
        </div>
        <div className="formula-card">
          <span>Calculation used</span>
          <code>ML-KEM ÷ all assessed × 100</code>
          <div>
            <strong>{unavailable ? "—" : `${metrics.mlkem} ÷ ${metrics.total}`}</strong>
            <span>= {coverageLabel}</span>
          </div>
          <p>Active and inactive records are both included in the denominator.</p>
        </div>
      </section>

      <section className="metric-grid three">
        <MetricCard
          label="ML-KEM"
          value={invalid ? "—" : metrics.mlkem}
          detail="Assessed connections migrated"
          tone="teal"
        />
        <MetricCard
          label="Classical fallback"
          value={invalid ? "—" : metrics.classical}
          detail="Connections remaining"
          tone="amber"
        />
        <MetricCard
          label="Assessed"
          value={invalid ? "—" : metrics.total}
          detail="Fixed denominator for this snapshot"
        />
      </section>

      <section className="content-grid migration-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Protocol comparison</span>
              <h2>Assessed connections by key exchange</h2>
            </div>
            <Badge tone="blue">Count</Badge>
          </div>
          {unavailable ? (
            <EmptyState
              title="Comparison unavailable"
              description="A valid assessed population is needed to draw this chart."
            />
          ) : (
            <div className="bar-chart">
              <div className="chart-grid">
                <span>12</span>
                <span>8</span>
                <span>4</span>
                <span>0</span>
              </div>
              <div className="bars">
                <div className="bar-group">
                  <strong>{metrics.mlkem}</strong>
                  <div
                    className="bar bar-teal"
                    style={{ height: `${Math.max(8, (metrics.mlkem / 12) * 190)}px` }}
                  />
                  <span>ML-KEM</span>
                </div>
                <div className="bar-group">
                  <strong>{metrics.classical}</strong>
                  <div
                    className="bar bar-amber"
                    style={{ height: `${Math.max(8, (metrics.classical / 12) * 190)}px` }}
                  />
                  <span>Classical fallback</span>
                </div>
              </div>
            </div>
          )}
          <div className="chart-legend">
            <span>
              <i className="teal" /> ML-KEM adoption
            </span>
            <span>
              <i className="amber" /> Remaining classical
            </span>
          </div>
        </article>
        <aside className="panel readiness-panel">
          <span className="decision-icon blue">
            <Icon name="info" />
          </span>
          <span className="eyebrow">Interpret carefully</span>
          <h2>Coverage is not readiness</h2>
          <p>
            Migration coverage indicates adoption of ML-KEM across the assessed connections. It does
            not by itself establish overall security readiness.
          </p>
          <div className="scope-line">
            <Icon name="check" size={16} />
            <span>
              <strong>Included:</strong> all 12 supplied records
            </span>
          </div>
          <div className="scope-line">
            <Icon name="close" size={16} />
            <span>
              <strong>Not claimed:</strong> total network coverage
            </span>
          </div>
          <button
            className="button button-primary full"
            onClick={() => onNavigate("connections", "Classical")}
          >
            Inspect classical fallback connections <Icon name="arrow" size={16} />
          </button>
        </aside>
      </section>
      <section className="test-state-strip">
        <div>
          <span className="eyebrow">Visible validation cases</span>
          <strong>Prototype calculation states</strong>
        </div>
        <span>
          Standard <b>8 / 12 · 66.7%</b>
        </span>
        <span>
          Empty <b>Not available</b>
        </span>
        <span>
          All ML-KEM <b>12 / 12 · 100%</b>
        </span>
        <span>
          All classical <b>0 / 12 · 0%</b>
        </span>
      </section>
    </>
  );
}

type ScopeFilter = "All connections" | "The Organization" | "Internal only";

function ScopeTabs({
  value,
  onChange,
  counts,
}: {
  value: ScopeFilter;
  onChange: (value: ScopeFilter) => void;
  counts: Record<ScopeFilter, number>;
}) {
  return (
    <div className="scope-tabs" role="group" aria-label="Connection scope">
      {(["All connections", "The Organization", "Internal only"] as ScopeFilter[]).map((scope) => (
        <button
          key={scope}
          className={value === scope ? "selected" : ""}
          onClick={() => onChange(scope)}
        >
          <span>{scope === "The Organization" ? "Customer data" : scope}</span>
          <b>{counts[scope]}</b>
        </button>
      ))}
    </div>
  );
}

const blockerOrder: MigrationBlocker[] = [
  "Hardware replacement pending",
  "Software upgrade pending",
  "Compatibility issue",
  "Unknown blocker",
];

function MigrationBlockers({
  records,
  scenario,
  onNavigate,
}: {
  records: Connection[];
  scenario: ScenarioId;
  onNavigate: (page: Page) => void;
}) {
  const [scope, setScope] = useState<ScopeFilter>("All connections");
  const unmigrated = records.filter((record) => record.protocol === "Classical");
  const counts: Record<ScopeFilter, number> = {
    "All connections": unmigrated.length,
    "The Organization": unmigrated.filter((record) => record.customerScope === "The Organization")
      .length,
    "Internal only": unmigrated.filter((record) => record.customerScope === "Internal only").length,
  };
  const scoped =
    scope === "All connections"
      ? unmigrated
      : unmigrated.filter((record) => record.customerScope === scope);
  const blockerCounts = blockerOrder.map((blocker) => ({
    blocker,
    count: scoped.filter(
      (record) => (record.primaryMigrationBlocker ?? "Unknown blocker") === blocker,
    ).length,
  }));
  const hasDeadlineConflict = scoped.some(
    (record) =>
      record.customerScope === "The Organization" &&
      record.expectedReplacementAvailability === "2028",
  );
  const unavailable = scenario === "invalid";

  return (
    <>
      <PageIntro
        eyebrow="Migration management workspace · Sprint 2"
        title="Migration Blockers"
        description="Understand why assessed connections remain on classical key establishment without mixing customer and internal-only scopes."
      />
      <div className="sprint-context-bar">
        <span>
          <b>Sprint 2 increment</b>
          MEM-17 · MEM-46–49
        </span>
        <p>
          One primary blocker per unmigrated connection prevents double-counting in category totals.
        </p>
      </div>
      <ScopeTabs value={scope} onChange={setScope} counts={counts} />
      {hasDeadlineConflict && (
        <section className="deadline-conflict" role="status">
          <span className="deadline-icon">
            <Icon name="clock" size={22} />
          </span>
          <div>
            <span className="eyebrow">Potential schedule conflict</span>
            <h2>Replacement availability extends beyond the proposed deadline</h2>
            <p>
              Some customer-data connections may depend on certified replacements expected in 2028,
              after the proposed 31 December 2027 migration deadline.
            </p>
          </div>
          <div className="deadline-dates">
            <span>
              Proposed customer deadline <strong>31 Dec 2027</strong>
            </span>
            <Icon name="arrow" size={18} />
            <span>
              Expected replacement <strong>2028</strong>
            </span>
          </div>
        </section>
      )}
      <section className="blocker-summary">
        {blockerCounts.map(({ blocker, count }, index) => (
          <article key={blocker} className={count > 0 ? "has-count" : ""}>
            <span className={`blocker-symbol blocker-symbol-${index + 1}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <strong>{count}</strong>
              <span>{blocker}</span>
            </div>
          </article>
        ))}
      </section>
      <section className="panel blocker-table-panel">
        <div className="table-toolbar">
          <div>
            <span className="eyebrow">Primary blocker inventory</span>
            <h2>
              {unavailable ? "Blocker data unavailable" : `${scoped.length} unmigrated connections`}
            </h2>
            <p>
              Scope: {scope === "The Organization" ? "connections carrying customer data" : scope}
            </p>
          </div>
          <Badge tone={scope === "The Organization" ? "blue" : "neutral"}>
            {scope === "The Organization" ? "Customer scoped" : scope}
          </Badge>
        </div>
        {unavailable || scoped.length === 0 ? (
          <EmptyState
            title={unavailable ? "Blocker assessment unavailable" : "No blockers in this scope"}
            description={
              unavailable
                ? "Primary blocker inputs failed validation and are not presented."
                : "No classical connections remain in the selected prototype scope."
            }
          />
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Connection ID</th>
                  <th>Scope</th>
                  <th>Primary blocker</th>
                  <th>Migration status</th>
                  <th>Expected availability</th>
                  <th>Deadline relevance</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {scoped.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.customerRef ?? record.id}</strong>
                      <small>{record.customerRef ? record.id : "Synthetic connection"}</small>
                    </td>
                    <td>
                      <Badge
                        tone={record.customerScope === "The Organization" ? "blue" : "neutral"}
                      >
                        {record.customerScope === "The Organization"
                          ? "Customer data"
                          : "Internal only"}
                      </Badge>
                    </td>
                    <td>
                      <strong>{record.primaryMigrationBlocker ?? "Unknown blocker"}</strong>
                    </td>
                    <td>
                      <Badge tone="amber">Classical · Not migrated</Badge>
                    </td>
                    <td>{record.expectedReplacementAvailability ?? "Not available"}</td>
                    <td>
                      {record.customerScope === "The Organization" ? (
                        <span className="deadline-relevance">Proposed 2027 deadline applies</span>
                      ) : (
                        <span className="muted">Customer deadline not applicable</span>
                      )}
                    </td>
                    <td>{record.notes ?? "Not available"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <section className="content-grid blocker-bottom-grid">
        <article className="panel options-panel">
          <span className="eyebrow">Options for discussion</span>
          <h2>Planning topics—not approved actions</h2>
          <div className="option-chips">
            <span>Workaround assessment</span>
            <span>Alternative routing analysis</span>
            <span>Schedule escalation</span>
          </div>
          <p>
            These options have not been approved or technically validated. The proposed contract
            amendment remains pending.
          </p>
        </article>
        <aside className="panel next-view-panel">
          <Icon name="shield" />
          <div>
            <span className="eyebrow">Related workflow</span>
            <h2>Review fallback exceptions</h2>
            <p>Compare service continuity dependencies with residual security exposure.</p>
          </div>
          <button className="button button-primary" onClick={() => onNavigate("exceptions")}>
            Open exceptions <Icon name="arrow" size={16} />
          </button>
        </aside>
      </section>
    </>
  );
}

function FallbackExceptions({
  records,
  scenario,
  onNavigate,
}: {
  records: Connection[];
  scenario: ScenarioId;
  onNavigate: (page: Page) => void;
}) {
  const [scope, setScope] = useState<ScopeFilter>("All connections");
  const exceptions = records.filter((record) => record.protocol === "Classical");
  const counts: Record<ScopeFilter, number> = {
    "All connections": exceptions.length,
    "The Organization": exceptions.filter((record) => record.customerScope === "The Organization")
      .length,
    "Internal only": exceptions.filter((record) => record.customerScope === "Internal only").length,
  };
  const scoped =
    scope === "All connections"
      ? exceptions
      : exceptions.filter((record) => record.customerScope === scope);
  const unavailable = scenario === "invalid";
  const dataClassesFor = (connectionId: string) => {
    const classes = trafficVolumeRecords
      .filter((volume) => volume.connectionId === connectionId)
      .map((volume) => volume.dataClass);
    return classes.length ? [...new Set(classes)].join(", ") : "Not available";
  };

  return (
    <>
      <PageIntro
        eyebrow="Migration management workspace · Sprint 2"
        title="Classical Fallback Exceptions"
        description="Review operational dependency and potential HNDL exposure together. Simulated acceptance never removes residual security exposure."
      />
      <div className="notice notice-amber exception-principle">
        <Icon name="shield" />
        <div>
          <strong>Exception status does not remove potential exposure</strong>
          <p>
            “Accepted in simulation” is a prototype scenario label—not approval by a real security
            authority. No controls on this page authorize exceptions or terminate connections.
          </p>
        </div>
      </div>
      <ScopeTabs value={scope} onChange={setScope} counts={counts} />
      <section className="metric-grid three">
        <MetricCard
          label="Fallback exceptions"
          value={unavailable ? "—" : scoped.length}
          detail={`Selected scope: ${scope}`}
          tone="amber"
        />
        <MetricCard
          label="Customer deadline relevant"
          value={
            unavailable
              ? "—"
              : scoped.filter((record) => record.customerScope === "The Organization").length
          }
          detail="Proposed 31 December 2027"
        />
        <MetricCard
          label="Potential HNDL exposure"
          value={unavailable ? "Unknown" : scoped.length}
          detail="Visible regardless of simulated status"
          tone="amber"
        />
      </section>
      <section className="panel exception-table-panel">
        <div className="table-toolbar">
          <div>
            <span className="eyebrow">Internal exception register</span>
            <h2>Security exposure and service continuity</h2>
            <p>Synthetic review fields · MEM-18 · MEM-50–53</p>
          </div>
          <button className="button button-secondary" onClick={() => onNavigate("blockers")}>
            View blockers
          </button>
        </div>
        {unavailable || scoped.length === 0 ? (
          <EmptyState
            title={unavailable ? "Exception assessment unavailable" : "No fallback exceptions"}
            description={
              unavailable
                ? "Exception fields could not be validated."
                : "No classical fallback records exist in the selected scope."
            }
          />
        ) : (
          <div className="table-scroll">
            <table className="exception-table">
              <thead>
                <tr>
                  <th>Connection</th>
                  <th>Scope & data class</th>
                  <th>Fallback reason</th>
                  <th>Legacy dependency</th>
                  <th>Consequence if disabled</th>
                  <th>Security exposure</th>
                  <th>Simulated status</th>
                </tr>
              </thead>
              <tbody>
                {scoped.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>{record.customerRef ?? record.id}</strong>
                      <small>{record.customerRef ? record.id : "Synthetic connection"}</small>
                    </td>
                    <td>
                      <Badge
                        tone={record.customerScope === "The Organization" ? "blue" : "neutral"}
                      >
                        {record.customerScope === "The Organization"
                          ? "Customer data"
                          : "Internal only"}
                      </Badge>
                      <small className="table-subline">{dataClassesFor(record.id)}</small>
                    </td>
                    <td>{record.fallbackReason ?? "Unknown"}</td>
                    <td>
                      {record.expectedReplacementAvailability
                        ? `Certified replacement expected ${record.expectedReplacementAvailability}`
                        : (record.primaryMigrationBlocker ?? "Unknown")}
                    </td>
                    <td>{record.monitoringImpactIfDisabled ?? "Unknown"}</td>
                    <td>
                      <span className="exposure-label">
                        <Icon name="shield" size={15} /> Potential HNDL exposure
                      </span>
                    </td>
                    <td>
                      <Badge
                        tone={
                          record.simulatedExceptionStatus === "Accepted in simulation"
                            ? "blue"
                            : record.simulatedExceptionStatus === "Pending assessment"
                              ? "amber"
                              : "neutral"
                        }
                      >
                        {record.simulatedExceptionStatus ?? "Unknown"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">
          <span>
            Customer scope is explicit; internal-only exceptions are excluded from the customer
            report.
          </span>
          <span>Potential exposure is an indicator, not evidence of an attack.</span>
        </div>
      </section>
    </>
  );
}

function CustomerReport({
  records,
  scenario,
  onBack,
}: {
  records: Connection[];
  scenario: ScenarioId;
  onBack: () => void;
}) {
  const customerRecords = records.filter((record) => record.customerScope === "The Organization");
  const metrics = calculateCustomerMetrics(records);
  const traffic = calculateTrafficMetrics(customerRecords);
  const unavailable = scenario === "empty" || scenario === "invalid" || scenario === "stale";
  const volumeDataComplete =
    customerRecords.length > 0 &&
    customerRecords.every((record) => traffic.knownConnectionIds.has(record.id));
  const volumeUnavailable = unavailable || !volumeDataComplete || traffic.totalVolume === 0;
  const customerClassical = customerRecords.filter((record) => record.protocol === "Classical");

  return (
    <div className="customer-report-shell">
      <header className="report-preview-bar">
        <button className="button button-secondary" onClick={onBack}>
          <Icon name="arrow" size={16} /> Back to internal dashboard
        </button>
        <div>
          <strong>Customer Report Preview</strong>
          <span>Customer-safe presentation frame · design demonstration only</span>
        </div>
        <Badge tone="blue">Illustrative / Synthetic Data</Badge>
      </header>
      <main className="customer-report">
        <section className="report-header">
          <div>
            <span className="report-kicker">Sample report · 14 June 2025</span>
            <h1>Customer PQC Readiness Report</h1>
            <p>
              Prepared for <strong>The Organization</strong>
            </p>
          </div>
          <div className="report-mark">
            <Icon name="shield" size={25} />
            <span>PQC readiness</span>
          </div>
        </section>
        <section className="report-deadline">
          <span className="report-deadline-icon">
            <Icon name="clock" size={26} />
          </span>
          <div>
            <span>Proposed PQC deadline</span>
            <strong>31 December 2027</strong>
          </div>
          <div>
            <span>Previous proposed schedule</span>
            <strong>31 December 2030</strong>
          </div>
          <Badge tone="amber">Contract amendment pending</Badge>
        </section>

        <section className="report-kpis">
          <article className="report-kpi primary">
            <div className="report-kpi-icon">
              <Icon name="shield" size={24} />
            </div>
            <span>Customer PQC connection adoption</span>
            <strong>
              {unavailable || metrics.coverage === null
                ? "Not available"
                : `${metrics.coverage.toFixed(1)}%`}
            </strong>
            <p>
              {unavailable
                ? "Valid customer-scoped connection data is required."
                : `${metrics.mlkem} of ${metrics.total} eligible customer connections use ML-KEM.`}
            </p>
            <div className="report-progress">
              <span style={{ width: `${unavailable ? 0 : (metrics.coverage ?? 0)}%` }} />
            </div>
            <small>PQC connections / Eligible customer connections</small>
          </article>
          <article className="report-kpi exposure">
            <div className="report-kpi-icon">
              <Icon name="info" size={24} />
            </div>
            <span>Data volume associated with classical connections</span>
            <strong>
              {volumeUnavailable || traffic.classicalShare === null
                ? "Not available"
                : `${traffic.classicalShare.toFixed(1)}%`}
            </strong>
            <p>
              {unavailable
                ? "A current, complete customer-scoped volume dataset is required."
                : `${traffic.classicalVolume} GB of ${traffic.totalVolume} GB in the sample period.`}
            </p>
            <div className="measure-distinction">
              <Icon name="info" size={15} />
              Volume share—not connection adoption
            </div>
          </article>
          <article className="report-kpi scope">
            <div className="report-kpi-icon">
              <Icon name="connections" size={21} />
            </div>
            <span>Customer connection scope</span>
            <strong>{unavailable ? "—" : metrics.total}</strong>
            <p>
              {metrics.mlkem} ML-KEM · {metrics.classical} classical
            </p>
            <small>Internal-only records excluded</small>
          </article>
        </section>

        <section className="report-section">
          <div className="report-section-heading">
            <span className="report-section-icon">
              <Icon name="database" size={20} />
            </span>
            <div className="report-section-title">
              <span>Customer exposure summary</span>
              <h2>Potential HNDL Exposure by Data Class</h2>
            </div>
            <Badge tone="amber">Potential exposure · Not a detected attack</Badge>
          </div>
          {volumeUnavailable ? (
            <EmptyState
              title="Exposure calculation unavailable"
              description="A current and complete set of customer-scoped volume records is required."
            />
          ) : (
            <div className="report-exposure-grid">
              <div className="report-table-wrap">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Data class</th>
                      <th>Total volume</th>
                      <th>Classical-associated volume</th>
                      <th>Potentially exposed share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {traffic.byClass.map((item) => (
                      <tr key={item.dataClass}>
                        <td>
                          <strong>{item.dataClass}</strong>
                        </td>
                        <td>{item.total} GB</td>
                        <td>{item.potentiallyExposed} GB</td>
                        <td>
                          <strong>{item.percentage === null ? "Not available" : `${item.percentage.toFixed(1)}%`}</strong>
                        </td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{traffic.totalVolume} GB</strong>
                      </td>
                      <td>
                        <strong>{traffic.classicalVolume} GB</strong>
                      </td>
                      <td>
                        <strong>{traffic.classicalShare === null ? "Not available" : `${traffic.classicalShare.toFixed(1)}%`}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="report-data-coverage">
                  Volume coverage: supplied for {traffic.knownConnectionIds.size} of{" "}
                  {customerRecords.length} eligible customer connections in this illustrative
                  scenario. Missing records withhold the overall volume percentage; absence of
                  an expected data-class entry also requires a data-quality review.
                </div>
              </div>
              <div className="exposure-bars">
                {traffic.byClass.map((item) => (
                  <div key={item.dataClass}>
                    <span>
                      <b>{item.dataClass}</b>
                      <strong>
                        {item.potentiallyExposed} / {item.total} GB
                      </strong>
                    </span>
                    <div>
                      <i style={{ width: `${item.percentage ?? 0}%` }} />
                    </div>
                  </div>
                ))}
                <p>
                  Volume is calculated from supplied customer data-class records; it is not
                  estimated from connection counts.
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="report-two-column">
          <article className="report-section dependency-card">
            <span className="report-card-icon amber">
              <Icon name="clock" size={20} />
            </span>
            <span className="eyebrow">Migration dependencies</span>
            <h2>Legacy replacement timing needs discussion</h2>
            <p>
              Some legacy devices may depend on certified replacements expected in 2028, which is
              later than the proposed 2027 customer deadline.
            </p>
            <div className="dependency-record">
              <span>Applicable customer connection</span>
              <strong>
                {customerClassical.find(
                  (record) => record.expectedReplacementAvailability === "2028",
                )?.customerRef ?? "Not available"}
              </strong>
              <Badge tone="amber">Expected 2028</Badge>
            </div>
            <small>
              This does not establish that migration is impossible or that the proposed deadline
              cannot be met.
            </small>
          </article>
          <article className="report-section next-steps-card">
            <span className="report-card-icon blue">
              <Icon name="arrow" size={20} />
            </span>
            <span className="eyebrow">Next steps for discussion</span>
            <h2>Topics for the next review</h2>
            <ol>
              <li>Review customer connections still using classical key establishment.</li>
              <li>Assess legacy replacement dependencies.</li>
              <li>Discuss migration options for the proposed deadline.</li>
              <li>Confirm reporting details and contractual requirements.</li>
            </ol>
            <small>Discussion items only · No corrective action is represented as approved.</small>
          </article>
        </section>
        <section className="report-limitations">
          <Icon name="info" size={18} />
          <div>
            <strong>Assumptions and limitations</strong>
            <p>
              This report uses synthetic example data. Potential HNDL exposure does not indicate a
              detected attack or confirmed interception. The proposed contractual deadline has not
              yet been accepted. Internal-only connections, internal assessments, budgets, and other
              customer information are excluded.
            </p>
          </div>
        </section>
        <footer className="report-footer">
          <span>The Organization · Customer-scoped synthetic records only</span>
          <span>Sample report · Page 1 of 1</span>
        </footer>
      </main>
    </div>
  );
}

const guideSections = [
  {
    number: "01",
    title: "Purpose and product boundaries",
    summary: "What this prototype represents—and what it deliberately does not claim.",
    points: [
      "An integrated Sprint 1 and Sprint 2 decision-support prototype for reviewing an illustrative migration from classical key exchange to ML-KEM.",
      "All records are fictional, locally stored, and shared across every product view.",
      "The interface does not monitor live traffic, detect attacks, control devices, or perform cryptographic assessment.",
      "No backend, external API, authentication service, or operational network connection is used.",
    ],
  },
  {
    number: "02",
    title: "Navigation and information architecture",
    summary: "How each destination supports a different level of decision-making.",
    points: [
      "Overview provides a fast management summary of status, migration coverage, residual fallback, and data scope.",
      "Connections provides the complete assessed inventory, protocol filtering, connection search, exposure context, and record details.",
      "Migration explains the exact coverage calculation, denominator, protocol comparison, and adoption progress.",
      "Blockers and Fallback Exceptions are internal planning views. Customer Report Preview opens a separate customer-safe presentation without internal navigation.",
      "Prototype Guide and Design System are supporting resources and are intentionally separated from primary product navigation.",
    ],
  },
  {
    number: "03",
    title: "Shared synthetic dataset",
    summary:
      "The single source of truth behind all counts, percentages, tables, and status signals.",
    points: [
      "The standard snapshot contains 12 assessed connections: 8 ML-KEM and 4 classical fallback.",
      "Five connections carry The Organization’s data: 3 ML-KEM and 2 classical. The remaining seven are explicitly internal only.",
      "Ten customer volume rows total 300 GB across two data classes; 60 GB is associated with the two classical customer connections.",
      "Coverage uses all 12 supplied records, including active and inactive connections; the denominator never changes silently.",
      "One record intentionally has no supplied IP address and is shown as “Not provided” rather than inferred.",
      "The dataset is defined in src/data.ts so it can be replaced or extended without rewriting individual screens.",
    ],
  },
  {
    number: "04",
    title: "Executive overview",
    summary: "How the summary status and management context should be interpreted.",
    points: [
      "The standard snapshot is Amber because four classical fallback connections remain.",
      "The status is illustrative and pending Product Owner approval; it is not approved organizational policy.",
      "Green requires adequate valid data and no unresolved signal under the demonstration rules.",
      "Red is reserved for the explicit critical-concern test scenario. Missing, invalid, empty, or stale evidence produces Unknown or Unable to assess.",
      "A high migration percentage cannot conceal residual fallback exposure.",
    ],
  },
  {
    number: "05",
    title: "Connection security",
    summary: "How to inspect protocol use without overstating the available evidence.",
    points: [
      "All connections shows 12 records, ML-KEM shows 8, and Classical fallback shows 4 in the standard scenario.",
      "Search matches the supplied connection ID. A nonexistent ID produces a no-results state with a clear reset action.",
      "Selecting a row opens a detail panel containing only fields present in the synthetic record.",
      "Potential HNDL exposure appears only on classical fallback rows. It is not evidence of harvesting, unencrypted traffic, or malicious downgrade.",
      "The Sprint 2 traffic metric is a 60 GB customer subtotal. Internal-only classical volume is unknown, so no company-wide volume total is claimed.",
    ],
  },
  {
    number: "06",
    title: "Migration coverage",
    summary: "The exact calculation used by the metric, progress bar, and chart.",
    points: [
      "Coverage = ML-KEM assessed connections ÷ all assessed connections × 100.",
      "The standard result is 8 ÷ 12 × 100 = 66.7%, rounded to one decimal place for display.",
      "Secondary cards, progress indicator, formula panel, and comparison chart are derived from the same records.",
      "When the assessed population is zero, the result is Not available—not 0%, NaN, or infinity.",
      "Migration coverage indicates adoption; it does not establish overall security readiness.",
      "Customer connection adoption is 3 ÷ 5 = 60%; customer classical-associated volume share is 60 ÷ 300 = 20%. These are deliberately separate measures.",
    ],
  },
  {
    number: "07",
    title: "Scenario selector and test states",
    summary: "How to demonstrate calculation, status, and data-quality behavior during review.",
    points: [
      "Standard: 8 of 12 ML-KEM, 66.7% coverage, four classical fallback records, and Amber executive status.",
      "Empty dataset: no records, unavailable coverage, Unknown status, and an empty inventory.",
      "All ML-KEM: 12 of 12, 100% coverage, no fallback, and the illustrative Green state.",
      "All classical: 0 of 12, 0% coverage, and 12 fallback records.",
      "Stale and Invalid states withhold a justified executive conclusion. Critical concern demonstrates the illustrative Red state.",
      "The selector exists only for prototype demonstration; it is not a live configuration control.",
    ],
  },
  {
    number: "08",
    title: "Connected review flows",
    summary: "The intended click paths reviewers can demonstrate end to end.",
    points: [
      "From Overview, Inspect exposure opens Connections with the classical fallback filter selected and exactly four standard records.",
      "From Migration, Inspect classical fallback connections opens the same filtered inventory.",
      "Within Connections, protocol tabs and Clear filters move between 12, 8, and 4-record views.",
      "Changing the scenario updates all three product destinations from the same underlying scenario records.",
      "Blockers links to Fallback Exceptions, while the internal sidebar opens a distinct Customer Report Preview frame.",
    ],
  },
  {
    number: "09",
    title: "Responsive and accessible behavior",
    summary: "How the interface preserves comprehension across devices and input methods.",
    points: [
      "Desktop uses persistent navigation, wide tables, and side-by-side decision panels.",
      "Tablet condenses navigation and rearranges content into fewer columns.",
      "Mobile uses a navigation drawer, single-column cards, touch-friendly controls, and a horizontally scrollable inventory.",
      "Statuses combine text, icons, labels, and color. Focus indicators, semantic controls, table headings, and accessible labels support keyboard and assistive-technology use.",
    ],
  },
  {
    number: "10",
    title: "Sprint 2 boundaries and handoff",
    summary: "What should not be interpreted as implemented functionality.",
    points: [
      "Downgrade investigation, live response actions, budget analytics, Top 3 organizational risks, notifications, and network-zone heatmaps remain out of scope.",
      "The 31 December 2027 date is a proposed contract amendment, simulated exception statuses are not approvals, and 2028 replacement timing is not a claim that migration is impossible.",
      "The Design System page documents shared tokens and reusable component states.",
      "Implementation ownership can be divided by product view while preserving src/data.ts and shared UI conventions as common dependencies.",
    ],
  },
  {
    number: "11",
    title: "Customer report separation",
    summary: "How customer-safe reporting remains distinct from internal decision support.",
    points: [
      "The report includes only five records scoped to The Organization and excludes all seven internal-only records.",
      "It shows customer adoption, exposure by data class, the pending deadline amendment, dependencies, discussion topics, and limitations.",
      "It does not include internal exception records, budgets, organizational risk rankings, other customer information, or confidential negotiation assessments.",
      "The separate presentation frame demonstrates information architecture only; it does not claim production authentication or access control.",
    ],
  },
];

function PrototypeGuide() {
  return (
    <>
      <PageIntro
        eyebrow="Prototype documentation"
        title="Prototype Guide"
        description="A detailed reference for understanding, demonstrating, validating, and handing off the integrated Sprint 1 and Sprint 2 prototype."
      />
      <section className="guide-hero">
        <div>
          <Badge tone="blue">Sprint 1 + Sprint 2 reference</Badge>
          <h2>Start here before the demonstration</h2>
          <p>
            This guide explains the prototype’s data, calculations, status behavior, interactions,
            edge cases, responsive rules, and limitations. It is supporting documentation, not part
            of the operational dashboard.
          </p>
        </div>
        <div className="guide-facts">
          <span>
            <strong>6</strong> product views
          </span>
          <span>
            <strong>7</strong> test scenarios
          </span>
          <span>
            <strong>1</strong> shared dataset
          </span>
        </div>
      </section>

      <nav className="guide-index" aria-label="Prototype guide contents">
        <span>On this page</span>
        <div>
          {guideSections.map((section) => (
            <a key={section.number} href={`#guide-${section.number}`}>
              {section.number} · {section.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="guide-sections">
        {guideSections.map((section) => (
          <article className="guide-card" id={`guide-${section.number}`} key={section.number}>
            <div className="guide-card-number">{section.number}</div>
            <div className="guide-card-content">
              <span className="eyebrow">Guide section</span>
              <h2>{section.title}</h2>
              <p>{section.summary}</p>
              <ul>
                {section.points.map((point) => (
                  <li key={point}>
                    <span>
                      <Icon name="check" size={13} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="guide-language panel">
        <div>
          <span className="eyebrow">Required language</span>
          <h2>Security claims remain deliberately limited</h2>
        </div>
        <div className="language-grid">
          <div>
            <Badge tone="green">Use</Badge>
            <strong>“Potential HNDL exposure”</strong>
            <p>Describes a future-decryption risk indicator without claiming an observed attack.</p>
          </div>
          <div>
            <Badge tone="red">Avoid</Badge>
            <strong>“Attack detected”</strong>
            <p>The supplied dataset contains no detection evidence or traffic analysis.</p>
          </div>
          <div>
            <Badge tone="red">Avoid</Badge>
            <strong>“Traffic is unencrypted”</strong>
            <p>Classical key exchange does not imply the absence of transport encryption.</p>
          </div>
          <div>
            <Badge tone="red">Avoid</Badge>
            <strong>“Malicious downgrade”</strong>
            <p>Fallback alone does not establish intent, cause, or compromise.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function DesignSystem() {
  return (
    <>
      <PageIntro
        eyebrow="Internal handoff"
        title="Design System"
        description="Reusable foundations and states shared by the three independently owned stakeholder views."
      />
      <section className="system-grid">
        <article className="panel token-card">
          <span className="eyebrow">Color tokens</span>
          <h2>Purposeful, restrained color</h2>
          <div className="swatches">
            {[
              ["Navy 950", "#071a2f"],
              ["Blue 600", "#2366d1"],
              ["Teal 600", "#0c8176"],
              ["Amber 500", "#d98b19"],
              ["Red 600", "#c93b43"],
              ["Slate 100", "#eef2f5"],
            ].map(([name, hex]) => (
              <div key={name}>
                <i style={{ background: hex }} />
                <strong>{name}</strong>
                <span>{hex}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="panel type-card">
          <span className="eyebrow">Typography</span>
          <h2>Inter / clean sans-serif</h2>
          <div className="type-samples">
            <span className="display-sample">66.7%</span>
            <span className="heading-sample">Migration coverage</span>
            <p>Readable body copy for transparent security context and decision support.</p>
            <code>CN-003 · 10.20.1.21</code>
          </div>
        </article>
        <article className="panel component-card">
          <span className="eyebrow">Status components</span>
          <h2>Badges &amp; signals</h2>
          <div className="component-row">
            <ProtocolBadge protocol="ML-KEM" />
            <ProtocolBadge protocol="Classical" />
            <Badge tone="green">Active</Badge>
            <Badge tone="neutral">Inactive</Badge>
            <Badge tone="red">Critical</Badge>
          </div>
        </article>
        <article className="panel component-card">
          <span className="eyebrow">Actions</span>
          <h2>Buttons &amp; inputs</h2>
          <div className="component-row">
            <button className="button button-primary">Primary action</button>
            <button className="button button-secondary">Secondary</button>
            <label className="search-field">
              <Icon name="search" size={17} />
              <input placeholder="Search connection ID" />
            </label>
          </div>
        </article>
        <article className="panel spacing-card">
          <span className="eyebrow">Spacing</span>
          <h2>8 px base rhythm</h2>
          <div>
            {[8, 16, 24, 32, 48].map((size) => (
              <span key={size}>
                <i style={{ width: size }} />
                {size}
              </span>
            ))}
          </div>
        </article>
        <article className="panel state-card">
          <span className="eyebrow">Component states</span>
          <h2>Honest system feedback</h2>
          <div className="state-examples">
            <span>Default</span>
            <span>Selected</span>
            <span>Missing data</span>
            <span>Empty</span>
            <span>Invalid</span>
            <span>Stale</span>
          </div>
        </article>
      </section>
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("overview");
  const [scenario, setScenario] = useState<ScenarioId>("standard");
  const [mobileNav, setMobileNav] = useState(false);
  const [pendingFilter, setPendingFilter] = useState<ProtocolFilter | null>(null);
  const records = recordsForScenario(scenario);

  const navigate = (target: Page, filter?: ProtocolFilter) => {
    if (filter) setPendingFilter(filter);
    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (page === "customer-report") {
    return (
      <CustomerReport records={records} scenario={scenario} onBack={() => navigate("overview")} />
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        onNavigate={navigate}
        open={mobileNav}
        onClose={() => setMobileNav(false)}
      />
      <div className="app-main">
        <Header
          page={page}
          scenario={scenario}
          setScenario={setScenario}
          onMenu={() => setMobileNav(true)}
        />
        <main className="page-content">
          {page === "overview" && (
            <Overview records={records} scenario={scenario} onNavigate={navigate} />
          )}
          {page === "connections" && (
            <Connections
              records={records}
              scenario={scenario}
              initialFilter={pendingFilter}
              onFilterHandled={() => setPendingFilter(null)}
            />
          )}
          {page === "migration" && (
            <Migration records={records} scenario={scenario} onNavigate={navigate} />
          )}
          {page === "blockers" && (
            <MigrationBlockers records={records} scenario={scenario} onNavigate={navigate} />
          )}
          {page === "exceptions" && (
            <FallbackExceptions records={records} scenario={scenario} onNavigate={navigate} />
          )}
          {page === "guide" && <PrototypeGuide />}
          {page === "system" && <DesignSystem />}
        </main>
        <footer className="app-footer">
          <span>PQC Security Monitoring Dashboard · Sprint 2 educational prototype</span>
          <span>Synthetic data · Not a live monitoring platform</span>
        </footer>
      </div>
    </div>
  );
}
