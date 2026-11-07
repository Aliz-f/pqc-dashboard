import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  calculateMetrics,
  recordsForScenario,
  scenarios,
  type Connection,
  type Protocol,
  type ScenarioId,
} from "./data";

type Page = "overview" | "connections" | "migration" | "guide" | "system";
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
    | "check";
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
    icon: "overview" | "connections" | "migration";
  }[] = [
    { id: "overview", label: "Overview", caption: "Executive view", icon: "overview" },
    {
      id: "connections",
      label: "Connections",
      caption: "Security view",
      icon: "connections",
    },
    { id: "migration", label: "Migration", caption: "Coverage view", icon: "migration" },
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
            <span>Sprint 1 prototype</span>
          </div>
          <button className="mobile-close" onClick={onClose} aria-label="Close navigation">
            <Icon name="close" />
          </button>
        </div>
        <nav aria-label="Stakeholder views">
          <div className="nav-label">Workspace</div>
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

const guideSections = [
  {
    number: "01",
    title: "Purpose and product boundaries",
    summary: "What this prototype represents—and what it deliberately does not claim.",
    points: [
      "A Sprint 1 decision-support prototype for reviewing an illustrative migration from classical key exchange to ML-KEM.",
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
    title: "Sprint 1 exclusions and handoff",
    summary: "What should not be interpreted as implemented functionality.",
    points: [
      "Downgrade investigation, response actions, blocker analysis, budget analytics, risk ranking, notifications, and network-zone heatmaps are outside Sprint 1.",
      "The Design System page documents shared tokens and reusable component states.",
      "Implementation ownership can be divided by product view while preserving src/data.ts and shared UI conventions as common dependencies.",
    ],
  },
];

function PrototypeGuide() {
  return (
    <>
      <PageIntro
        eyebrow="Prototype documentation"
        title="Prototype Guide"
        description="A detailed reference for understanding, demonstrating, validating, and handing off every part of the Sprint 1 prototype."
      />
      <section className="guide-hero">
        <div>
          <Badge tone="blue">Sprint 1 reference</Badge>
          <h2>Start here before the demonstration</h2>
          <p>
            This guide explains the prototype’s data, calculations, status behavior, interactions,
            edge cases, responsive rules, and limitations. It is supporting documentation, not part
            of the operational dashboard.
          </p>
        </div>
        <div className="guide-facts">
          <span>
            <strong>3</strong> product views
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
          {page === "guide" && <PrototypeGuide />}
          {page === "system" && <DesignSystem />}
        </main>
        <footer className="app-footer">
          <span>PQC Security Monitoring Dashboard · Sprint 1 educational prototype</span>
          <span>Synthetic data · Not a live monitoring platform</span>
        </footer>
      </div>
    </div>
  );
}
