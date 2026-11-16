# Sprint 1 → Sprint 2: planning and scope record

**Group 21 · PQC Security Monitoring Dashboard · 16 November 2026**  
**Jira:** [MEM-81](https://aliz.atlassian.net/browse/MEM-81) · **Status of this record:** planning reconstruction from course materials, Sprint 1 report, Jira and versioned source—not retrospective minutes of an unrecorded meeting.

## How we arrived at Sprint 2

The team's Sprint 1 report describes working sessions on **6–7 November**, asynchronous Discord collaboration and a first functional dashboard increment by the **11 November** sprint deadline. Roope was Sprint 1 Scrum Master. The three delivered views corresponded to the stakeholder stories **MEM-21** (Sarah, 5 points), **MEM-16** (Michael, 3 points), and **MEM-8** (Emma, 3 points), for **11 story points** and ten engineering tasks. The shared prototype data included 12 connections: 8 using ML-KEM and 4 classical, giving 66.7% connection adoption and an Amber executive example.

The Sprint 1 submission also records an intention to clarify task ownership, synchronize Jira updates with development and start multi-part submissions earlier in Sprint 2. It says the remotely participating fifth member, Tancredi, contributed to UX review and slide narration. Earlier Jira process entries describe difficulties with hybrid coordination. Those records agree that participation took place, but differ in their evaluation of how well it worked; the team should reconcile the experience in the retrospective rather than infer that collaboration was either wholly successful or unsuccessful.

At the **12 November** course session, Mikko presented Emma's new priority: the largest customer's proposed agreement change. The customer wants all connections carrying its data to use PQC key establishment by **31 December 2027** instead of the end of 2030, asks for a breakdown of potential HNDL exposure **by data class**, and wants an initial report structure at the next review. The amendment is a proposal, not an accepted contract.

## Sprint 2 objective

The goal currently saved in Jira is to deliver customer-scoped synthetic records and data classes; show customer ML-KEM adoption and potential HNDL exposure by class; analyze blockers and classical-fallback exceptions with the proposed 2027 deadline; and demonstrate an initial customer report structure in a functioning dashboard increment. The project remains a **synthetic decision-support prototype**, not a deployed security enforcement service.

**Sprint window in Jira:** active from **16 November** to **18 November 2026**. **Course deadline:** Wednesday **18 November at 23:59 Finnish time**. The configured Jira sprint end is earlier on that date; these are not the same timestamp.

## Backlog response: keep, change and defer

| Treatment | Evidence in the backlog and source | Why it makes sense |
| --- | --- | --- |
| **Keep** | The Sprint 1 Overview, Connections and Migration views, the 12-record baseline and explicit HNDL cautions | The customer report needs a consistent internal starting point; residual classical risk must not disappear from Sarah's view |
| **Change / add** | MEM-92–96: customer-only records, report metrics and a customer report preview | Emma's new priority concerns this customer's current position, not just organization-wide adoption |
| **Change / add** | MEM-17 and MEM-46–49: blockers and customer/internal scope, including 2028 replacement dependency | Michael needs to explain whether the new proposed date conflicts with existing constraints |
| **Change / add** | MEM-18 and MEM-50–53: fallback exceptions, operational impact, simulated status and potential HNDL | Sarah and Michael must weigh security exposure against monitoring continuity |
| **Bring forward preparation** | MEM-36–38: class-specific transferred-volume fields and calculation explanation | The customer request cannot be answered from connection counts alone |
| **Defer rather than delete** | MEM-24 parent (traffic-exposure story) remains in Sprint 3, while its preparatory tasks are in Sprint 2; MEM-9 and MEM-19 also remain outside the Sprint 2 main commitment | Avoid treating staged work or broader planning as fully delivered in the current sprint |
| **Out of this increment** | Production authentication, live telemetry, real detection and operational cryptographic changes | Outside the educational scope and not required by the course |

**Important:** This table reconstructs the visible product/backlog response. It does not claim that a separate formal keep/change/drop vote or Product Owner acceptance took place.

## Selected stories, estimate and ownership

| Story | Stakeholder | Owner in Jira | Story points | Supporting tickets |
| --- | --- | --- | ---: | --- |
| [MEM-17](https://aliz.atlassian.net/browse/MEM-17) Migration blockers | Michael | Roope Paananen | 5 | MEM-46–49 |
| [MEM-18](https://aliz.atlassian.net/browse/MEM-18) Fallback exceptions | Michael / Sarah | Roope Paananen | 5 | MEM-50–53 |
| [MEM-92](https://aliz.atlassian.net/browse/MEM-92) Customer report | Emma | Masoud Abrishami | 8 | MEM-93–96 |
| **Total main-story estimate** | | | **18** | |

**Additional planned support:** Tancredi owns MEM-36–38 (traffic-volume preparatory tasks), Alireza owns MEM-49, MEM-53, MEM-96 and the whole-sprint review MEM-82, and Niko owns the Scrum process work MEM-74–76 and MEM-81/83/84. These are recorded Jira assignments, not new assignments made by this document.

**Roles documented in MEM-75:** Niko is the rotating **Sprint 2 Scrum Master**, Alireza represents Sarah, Roope Michael, and Masoud Emma. Tancredi's Sprint 1 UX/verification contribution is reported; confirm Sprint 2 expectations and hybrid participation arrangements with the team.

The estimate **18** is larger than Sprint 1's **11** story points. This is a planning signal, **not proof of either overcommitment or increased velocity**. The actual team capacity, agreed Sprint 2 selection and estimates should be confirmed from meeting evidence.

## What implementation and verification show

The V2 React implementation now includes the original views plus customer-specific report, migration blocker, fallback exception and synthetic classical-traffic-exposure views. In the standard customer fixture there are five customer connections (three ML-KEM, two classical): **60%** adoption. Customer class-volume records sum to **300 GB**, of which **60 GB (20%)** are associated with classical connections: personal **40/100 GB (40%)**, operational **20/200 GB (10%)**.

The V2 automated verification includes 18 passing tests and a successful production build: [GitHub Actions evidence](https://github.com/Aliz-f/pqc-dashboard/actions/runs/43916024168). Calculated volume association is *potential exposure*, not observed harvesting or an attack.

## Sprint 2 planning record — completion check

| Planning element | Evidence | Disposition |
| --- | --- | --- |
| Sprint Goal saved | Active Sprint 2 Jira goal | Recorded |
| Stories, acceptance criteria and estimates | MEM-17, MEM-18, MEM-92 (18 points); MEM-36–38 preparatory | Recorded |
| Owner assignments and rotating Scrum Master | Issue assignees and MEM-75 D04 | Recorded |
| Requirement change and rationale | Lecturer slide 3–5, MEM-76 C03–C04, this scope record | Recorded |
| Sprint active and development underway | Jira Sprint 2 and GitHub `v2` | Recorded |
| Team capacity, actual planning meeting date/participants, explicit final PO agreement | No matching verified minutes in the supplied evidence | To be confirmed by the team |

**Recommended Jira handling:** This record fulfills the documentary planning baseline and makes the remaining confirmation items explicit. Close MEM-81 only after the team's actual planning decision/meeting evidence is added; do not convert the evidence summary into invented meeting minutes.

## Links

- [Sprint 2 review](../team-review-2026-11-16.md)
- [Risk register](02-risk-register.md)
- [Decision log](03-decision-log.md)
- [Change log](04-change-log.md)
- Course sources: `Human_factors_project_instructions.pdf`, `PQC_Scrum_Project_Sprint2_pdf.pdf`, `Human_factors_persona_cards.pdf`, `sprint1_report.pdf`.
