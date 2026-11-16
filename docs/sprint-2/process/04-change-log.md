# Change and Product Owner feedback log — Sprint 1 to Sprint 2

**Group 21 · updated 16 November 2026** | Jira owner: **Niko** | [MEM-76](https://aliz.atlassian.net/browse/MEM-76)

## Change history

| ID | Date / origin | Previous position | New requirement / event | Impact and traceability | Status |
| --- | --- | --- | --- | --- | --- |
| C01 | 6–7 Nov; team situation | Intended five-person group collaboration | Fifth member joined after the initial session and could not attend in person | Capacity, remote participation, task ownership; MEM-74 R01, MEM-75 D01 | Reported; teacher guidance/approval not established |
| C02 | 7 Nov onward; team situation | Initial concern about remote participation | Attempted hybrid contribution | Jira describes difficulties; Sprint 1 report documents later UX and slide-narration contribution. Discuss both in retro, no blanket judgment. | Participation happened; effectiveness needs team discussion |
| **C03** | **12 Nov; Mikko's Sprint 2 PO scenario** | General organizational migration views, and customer deadline **end 2030** | Largest customer's proposed deadline **31 Dec 2027**, class-specific potential HNDL breakdown and initial customer report at next review; Emma says customer reporting is primary | New priorities MEM-92–96; revised MEM-17/18 and subtasks; MEM-36–38; risks R06–R09; decision log D08–D13 | **Customer proposal pending; scenario received and analyzed** |
| C04 | 16 Nov; response in V2 source | V1 Overview/Connections/Migration with overall 12-connection baseline | V2 adds customer report, data classes, customer/internal blocker and exception views, volume data and clear deadline/dependency labels | `src/App.tsx`, `src/data.ts`; implementation MEM-17/18/92 and verification | Implemented and code-verified; story acceptance in review |
| C05 | 16 Nov; source review and regression tests | Report could present stale customer figures; class-volume coverage note hard-coded; missing entries could mislead | Added stale suppression, dynamic class completeness and invalid/duplicate handling; unavailable values, unit checks and regression coverage | 18 GitHub Actions checks, V2 source; MEM-49/53/96 verification, risks R03/R04/R08/R10 | Corrected in V2; CI passed |

## C03 — requirement change analysis

**What was requested, not yet accepted:** The hypothetical customer seeks PQC key establishment on *all connections carrying its data* by 31 December 2027 (previously 31 December 2030), asks *how much customer data* may be exposed to HNDL by class, and expects a report structure in the next review. Mikko's slide on Emma explicitly requests a plan for what the group will keep, change and drop. The course also asks about effects on personas and team dynamics.

**Why the previous increment alone could not answer it:** An 8/12 overall connection metric did not distinguish customer vs internal scope, data classes or volume-based potential exposure. The revised synthetic fixture contains five customer records, of which three use ML-KEM; ten customer volume rows total 300 GB, with 60 GB associated with classical key establishment. The report now distinguishes connection adoption (60%) from classical-associated volume share (20%). These are illustrative exposure indicators, not evidence of a detected attack.

**Stakeholder impact:** Sarah needs qualified risk explanation; Michael must consider service continuity and device dependencies, including 2028 replacements; Emma needs customer-ready information and a credible explanation of the pending deadline. This remains an unresolved **planning and policy conflict**, not an approved technical remedy.

**Team/process impact:** Priority shift changed the Sprint Goal and affected 18 points across the three main stories (MEM-17, 5; MEM-18, 5; MEM-92, 8). Supporting tasks and Jira verification were organized across Roope, Masoud, Alireza, Tancredi and Niko. The sprint window is short; impacts on personal workload, emotion and communication should be discussed by actual participants in MEM-83.

**Keep/change/defer:** Keep the three Sprint 1 views and data baseline; change focus to customer-scoped readiness, data-class exposure, deadline blockers and fallback reasons; bring forward traffic-volume preparatory tasks; defer broader MEM-9/MEM-19 and the remainder of MEM-24 to Sprint 3. This interpretation matches Jira/code evidence but **does not claim a formal PO-approved decision**.

## C04/C05 — implementation verification

The `v2` branch extends `main` and includes source-based customer filter, blocker categories, fallback exceptions and report calculations. Verification passed **18/18 automated tests** and production build: [CI run](https://github.com/Aliz-f/pqc-dashboard/actions/runs/43916024168).

## Outstanding recording responsibilities

- Add any actual **PO response/acceptance** with date, who gave it and which Jira stories it covers.
- Record actual **planning meeting consensus/capacity** and any explicitly rejected alternatives if minutes are available.
- After the **Sprint Review**, document what was demonstrated, what feedback was received, and what changed as a consequence.
- After the **Retrospective**, document agreed improvement owners and Sprint 3 follow-up.

**Related:** [planning](01-planning-and-transition.md), [risks](02-risk-register.md), [decisions](03-decision-log.md), [review](../team-review-2026-11-16.md).
