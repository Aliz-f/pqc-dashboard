# Risk register — transition from Sprint 1 to Sprint 2

**Group 21 — updated 16 November 2026** | Jira owner: **Niko** | [MEM-74](https://aliz.atlassian.net/browse/MEM-74)

We retained Sprint 1 risks and reassessed their relevance after the customer's proposed deadline change. **Observed** identifies a situation supported by project materials, **Potential** identifies a threat to manage, and **Mitigated** means the known prototype-level mechanism has been implemented; it does not mean production risk has disappeared.

**Priority below is an evidence-based *working triage*, not a team-approved probability/impact rating.** Team-confirmed severity, formally appointed owners and acceptance decisions should be added after discussion. The named owners below are *suggested coordination roles*, not authorizations.

| ID | Condition and evidence | Working priority | Response, evidence and remaining issue | Suggested coordination |
| --- | --- | --- | --- | --- |
| R01 | **Observed** — a fifth student joined remotely. Sprint 1 report describes contribution to UX and narration; earlier Jira notes describe difficulties with the arrangement. | Medium | Retain a hybrid-participation check in the retrospective. Reconcile the differing assessments with members; confirm the participation arrangement with Mikko if still relevant. | Scrum Master |
| R02 | **Potential** — short sprint and 18 points of main stories compared with Sprint 1's 11; 500-word report, slides and video are separately due. | High | Protect time for review, retro and submission. Draft documents, slide deck and rehearsal exist; actual team submission still requires confirmation. | Scrum Master |
| R03 | **Mitigated in prototype** — inconsistent numerators, denominators or stakeholder totals could mislead. | Medium | One `src/data.ts` fixture; customer vs all-connection calculations; automated tests (18 passed) and explicit missing-data handling. Continue regression checks as fixture changes. | Verification lead |
| R04 | **Mitigated in code** — LLM-produced UI may overstate HNDL/claim attack detection or invent percentages. | Medium | Source reviewed; terminology qualifies potential exposure; stale/invalid, duplicate and incomplete volume handling corrected. Browser readability and PO-facing explanation remain to review. | Security/verification |
| R05 | **Open** — missing course submission or wrongly claiming completed ceremonies. | High | MEM-81–84 track planning, review, retro and actual upload confirmation; the 18 November 23:59 Finnish deadline remains. | Scrum Master |
| R06 | **Observed requirement change** — late stakeholder reprioritization may disrupt scope and collaboration. | Medium | MEM-76 C03/C04, MEM-75 keep/change/defer options, revised Sprint Goal and stories. Formal team approval and personal impact should be documented through the real ceremonies. | Scrum Master |
| R07 | **Observed scenario conflict** — customer connection CN-003 (C-04) has certified replacement expected in **2028**, later than proposed **31 Dec 2027**. | High | V2 Blockers and Customer Report show dependency; investigate feasible alternatives, contingencies and communication. Do not promise the contract can be met or claim a workaround approved. | Migration perspective (Roope) |
| R08 | **Mitigated in prototype** — class-volume data could be incomplete, duplicated, invalid or calculated using incorrect scope. | Medium | V2 checks per-connection/class coverage and rejects incomplete, negative or nonfinite inputs; 18-test CI suite. No external data source is connected. | Customer-report/verification |
| R09 | **Mitigated in UI, operational safeguard outstanding** — internal or other-customer data may accidentally enter customer-facing reporting. | High | Customer-only filtering and distinct presentation frame; no production authorization/login mechanism is claimed. Validate separation in any future deployment. | Customer-report owner |
| R10 | **Mitigated in prototype** — hypothetical exception statuses may be mistaken for actual security approval; classical exposure mistaken for observed attack. | Medium | UI explicitly states 'Accepted in simulation', 'Potential HNDL exposure', and no approved remedy; source contract checks. | Security/verification |
| R11 | **Open** — implementation, 18 passed automated tests and a successful build might be mistaken for stakeholder acceptance or deployed interaction tests. | Medium | Keep parent stories in Review; MEM-82 requires actual demo and feedback; MEM-83 genuine retrospective; MEM-84 submission confirmation. | Review lead |

## Risks that changed between the two sprints

1. **R06 became an actual change event**, documented in the lecturer's 12 November slides. The main customer deadline and exposure-by-class report were new priorities.
2. **R07 was made concrete** by the combination of 2027 contract proposal and 2028 example hardware replacement.
3. **R03/R04 were improved by source-level verification**: customer scope, missing/invalid values and language are covered by automated regression checks, though these do not prove production behavior.
4. **R02/R05 remain schedule-related** because technical completion does not replace ceremonies or uploading final coursework.
5. **R01 requires the team's own account** because the Sprint 1 report and earlier Jira process entries describe remote collaboration differently.

## Team review protocol

For each active risk at the team meeting: confirm the condition, discuss likelihood/impact, appoint an accountable owner, choose an action, and record a re-check date. The course requires maintaining the register; it does not prescribe an unsupported numerical score. The customer deadline is a *proposed* contractual amendment.

**Evidence:** [Sprint 2 requirement slide](https://aliz.atlassian.net/browse/MEM-76); [V2 source](https://github.com/Aliz-f/pqc-dashboard/tree/v2); [18 passing tests and build](https://github.com/Aliz-f/pqc-dashboard/actions/runs/43916024168); [whole-sprint review](../team-review-2026-11-16.md).


## Sprint 2 retrospective update — team-reported (16 November 2026)

The team reports that **meeting scheduling and workload balance improved**, and that **Tancredi's remote participation in Sprint 2 was effective and improved work quality**. This updates the working status of **R01** from the earlier Sprint 1 hybrid-collaboration concern: the team experienced an improvement, while maintaining a check on equitable remote participation in Sprint 3. This is not a claim that any pending lecturer decision about the formal group arrangement was made.

The team also reports **better Jira alignment**. The Sprint 3 improvement actions cover residual risks: insufficient manual-browser acceptance evidence ([MEM-97](https://aliz.atlassian.net/browse/MEM-97)), cross-sprint dependency ambiguity ([MEM-98](https://aliz.atlassian.net/browse/MEM-98)) and delayed recording of requirement/PO decisions ([MEM-99](https://aliz.atlassian.net/browse/MEM-99)). Track their outcomes at [MEM-87](https://aliz.atlassian.net/browse/MEM-87).
