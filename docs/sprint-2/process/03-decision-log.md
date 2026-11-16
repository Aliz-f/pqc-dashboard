# Decision log — Sprint 1 to Sprint 2

**Group 21 · updated 16 November 2026** | Jira owner: **Niko** | [MEM-75](https://aliz.atlassian.net/browse/MEM-75)

We use three distinct decision types:
- **Team-reported decision**: already identified as a team decision in earlier Jira or the Sprint 1 report.
- **Observed implementation choice**: directly established by the V1/V2 source or current Jira scope, but not evidence of a formal team vote or PO sign-off.
- **Proposed next decision**: an option to be approved, rejected or amended in a real meeting.

## Prior agreed decisions (retained)

| ID | Decision | Evidence / rationale | Standing |
| --- | --- | --- | --- |
| D01 | Continue first-session preparation with four locally present members while seeking guidance about the fifth member joining later. | Earlier Jira session records | **Team-reported**; lecturer's approval of an exception not established |
| D02 | Rotate Scrum Master duties, and use Sarah/Michael/Emma persona needs when identifying work. | Jira MEM-75 and Sprint 1 report | **Team-reported** |
| D03 | Sprint 1 roles: Roope Scrum Master; Masoud Sarah; Alireza Michael; Niko Emma; Tancredi UX/verification contribution. | Sprint 1 report, Jira | **Documented** |
| D04 | Sprint 2 roles: Niko Scrum Master; Alireza Sarah; Roope Michael; Masoud Emma. | MEM-75 prior entry and assigned Sprint 2 work | **Team-reported**; confirm Tancredi's current contribution |
| D05 | Sprint 3 rotation as previously planned: Masoud Scrum Master; Roope Sarah; Niko Michael; Alireza Emma. | MEM-75 prior entry | **Previously planned**; reconfirm during Sprint 3 planning |
| D06 | Track work through **To Do → In Progress → In Review → Done**. | Jira and current board | **Implemented** |
| D07 | Reassess hybrid participation after reported difficulties; do not assume non-participation or formal exclusion. | Prior Jira entry, alongside positive evidence of contribution in Sprint 1 report | **Follow-up open**, not a decision to exclude |

## Sprint 2: keep, change, defer — traceable product choices

| ID | Option reflected by implementation | Alternative and reasoning | Evidence type |
| --- | --- | --- | --- |
| D08 | **KEEP** Sprint 1's three stakeholder views, shared 12-record synthetic baseline and explicit security caveats. | Replacing the old UI would sacrifice working stakeholder context and make cross-view comparisons harder. | **Observed implementation choice** from GitHub `main` vs `v2` |
| D09 | **CHANGE** focus from mostly organization-wide indicators to a customer-only readiness report with data-class volume calculations. | A single organization-wide percentage cannot answer the largest customer's class-specific question. | **Observed implementation choice**, matches 12 November PO scenario |
| D10 | **CHANGE** migration discussion to separate customer/internal blockers, 2028 device dependency, classical fallback reasons and simulated exception status. | A percentage alone hides the schedule and continuity trade-off. | **Observed implementation choice**, MEM-17/18 |
| D11 | **BRING FORWARD** MEM-36–38 as Sprint 2 preparatory work; retain the broader MEM-24 story in Sprint 3. | Supports the requested per-class volume explanation without treating the whole Sprint 3 story as delivered. | **Observed Jira placement** |
| D12 | **DEFER** broader executive top-three risks (MEM-9), migration milestones (MEM-19) and production/live-monitoring functions beyond Sprint 2. | Prioritize the customer's immediate information request and keep the sprint realistic. | **Observed scope/backlog**, not proof of an agreed scope vote |
| D13 | **USE EXPLICIT UNKNOWN handling**, source-level tests, and a distinct customer presentation frame rather than presenting invalid values or internal-only records as valid customer results. | Avoid misleading client reporting and questionable LLM-generated text. | **Verified code and CI** |

**D08–D13 are the choices visible in implemented work, not invented group decisions.** Team/PO authorization and alternative proposals should be logged with actual date, participants and outcome when available.

## Three stakeholder trade-offs informing these choices

- **Sarah** wants potential HNDL exposure visible and actionable; classical fallback must not be labeled as a proven malicious downgrade.
- **Michael** needs a believable migration plan and continuity of device telemetry until replacements; the case gives **2028** for some certified replacements.
- **Emma** needs customer-ready information, service continuity and credible contract discussions; the proposed new **2027** deadline cannot be presented as already agreed or guaranteed.

The V2 design addresses these perspectives through separate views and qualified language instead of automatically disabling classical fallback, accepting a hypothetical security exception, or promising contract compliance.

## Decisions reserved for real team/PO agreement

| ID | Question | Action to record when decided |
| --- | --- | --- |
| P01 | What is Mikko's position on the fifth student's participation arrangement? | Record dated response; do not assume lecturer approval |
| P02 | What working communication/dispute-resolution and hybrid-participation approach will the group follow? | Record participant input and concrete protocol |
| P03 | Was the Sprint 2 18-point commitment and changed priority formally accepted, and what capacity assumptions were used? | Add planning date, participants and PO feedback |
| P04 | How should the potential 2027/2028 schedule conflict be presented to the customer? | Record alternatives, decision maker, result and customer-facing wording |
| P05 | Which follow-up improvements will the retrospective commit to? | Record 1–3 actual actions, named owners and Sprint 3 check |

## Approval discipline

The proposed 2027 contract amendment, simulated accepted exceptions, alternative routing/workarounds, and illustrative Green/Amber/Red rules are **not** real approvals. Evidence of functionality and automated tests does not establish teacher/PO acceptance.

**References:** [planning and scope](01-planning-and-transition.md), [risk register](02-risk-register.md), [change log](04-change-log.md), [review](../team-review-2026-11-16.md).


## Sprint 2 retrospective decision handoff — reported by the team

The team reports completing the Sprint 2 Review and Retrospective and records three positive changes: a more reliable meeting schedule and balanced workload; good remote collaboration with fifth member Tancredi, which improved the work; and more synchronized Jira task/process management. The three agreed-for-tracking improvement areas have been converted into Sprint 3 tasks, with current Jira assignees and explicit completion measures:

- **D14 / A01:** capture actual browser-demo acceptance artifacts for stakeholder journeys — [MEM-97](https://aliz.atlassian.net/browse/MEM-97), Alireza, before MEM-86.
- **D15 / A02:** map cross-sprint dependencies, ownership and remote handoffs before implementation — [MEM-98](https://aliz.atlassian.net/browse/MEM-98), Masoud, during MEM-85 planning.
- **D16 / A03:** record requirement changes, impact, alternatives and pending Product Owner decisions when they arise — [MEM-99](https://aliz.atlassian.net/browse/MEM-99), Niko, beginning MEM-85.

The specific meeting timestamp and participants are not recorded here because none were supplied. The owners named are the issue assignees; the team can adjust them at Sprint 3 Planning. Full details: [Sprint 2 Retrospective](../retrospective-and-sprint3-actions.md).
