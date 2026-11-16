# Sprint 2 — Evidence-Based Whole-Sprint Review (16 November 2026)

**Group 21 · Professional Software Engineering Processes and Human Factors (811373A)**

**Record classification:** Code and Jira evidence review. Actual team Sprint Review and formal Product Owner acceptance are separate events; they are not represented as completed here.

## Sprint goal and change
Mikko Mäkitalo's Sprint 2 scenario directs the team to prioritize its largest customer's readiness report. The proposed customer deadline changes from the end of 2030 to **31 December 2027**, and the customer requests potential HNDL exposure **by data class** plus an initial report structure. The amendment remains pending. The 2028 example device-replacement expectation creates a material dependency.

## V1 to V2 increment
The V1 `main` branch includes Overview (Emma), Connection Security (Sarah) and Migration Coverage (Michael), using twelve synthetic connections (eight ML-KEM; four classical, 66.7%).
The V2 branch preserves them and adds Migration Blockers, Fallback Exceptions, a separate Customer Report Preview and customer-scoped classical traffic exposure. The source extends `src/data.ts` with customerScope, primaryMigrationBlocker, fallback reason, monitoring impact, expectedReplacementAvailability, simulatedExceptionStatus and data-class traffic-volume records.

## Reconciled results
| Metric | Result |
|---|---|
| Overall adoption | 8 / 12 = 66.7% |
| Customer connection adoption | 3 / 5 = 60% |
| Customer classical connections | 2 / 5 = 40% |
| Customer classical-associated transferred volume | 60 / 300 GB = 20% |
| Personal data | 40 / 100 GB = 40% |
| Operational data | 20 / 200 GB = 10% |
| Standard classical blocker categories | Hardware 2; software 1; compatibility 1; unknown 0 |

These describe fictional data associated with classical key establishment; they are **not evidence that traffic was intercepted or decrypted**. The customer report excludes the seven internal-only connections.

## LLM/code evaluation and verification
Code review found three weaknesses: V2 customer-report metrics were not withheld for stale snapshots; completeness was reported with a fixed five-connection statement rather than computed; and missing class percentages could display misleading placeholders. Changes on `v2` added stale suppression, explicit unavailable values, per-connection/data-class completeness checks and protection against duplicates, negative numbers and nonfinite values.

GitHub Actions verification: **18 tests passed, zero failed, production build passed**.
[Verification run](https://github.com/Aliz-f/pqc-dashboard/actions/runs/43916024168).
The tests include source-level UI contracts, not end-to-end human browser acceptance.

## Jira acceptance summary
- Implementation **Done**: MEM-36–38; MEM-46–48; MEM-50–52; MEM-93–95.
- Calculation, exception and report desk verification **Done**: MEM-49, MEM-53, MEM-96, with individual evidence comments and CI links.
- Parent stakeholder stories: MEM-17, MEM-18, MEM-92 — ready for team/PO review; no approval inferred.
- Process and evidence: MEM-74/75/76 (risk/decisions/change), MEM-81/82/83/84 (planning/review/retro/submission) remain tracked separately.

## Stakeholder and human factors review
**Sarah** needs credible potential-HNDL visibility without describing a malicious downgrade as detected. **Michael** needs service continuity and explicit 2028 hardware dependencies. **Emma** needs customer-safe readiness information and a clear distinction between an amendment proposal and an accepted contract. These are competing product concerns, not conclusions about the team members' emotions or comments.

The source changes show a concrete adaptation of product scope. Actual team discussions of capacity, hybrid collaboration, responsibility, emotions, conflict management, and retrospective improvements must be captured by the Scrum team.

## Review findings and improvements
1. Preserve the original three stakeholder views and shared synthetic baseline.
2. Verify V2's customer isolation, complete volume scope, status freshness and exception language; source and automated verification support these behaviors.
3. Keep 2027/2028 risks visible, and do not present unapproved workarounds or simulated exceptions as policy decisions.
4. Capture screenshots and actual V2 interaction evidence for the end-of-sprint demonstration.
5. Record keep/change/defer choices, team participants, PO acceptance and follow-up tasks as the events occur.

**Suggested retrospective improvements:** (a) attach verification evidence to each Jira issue promptly, (b) track change rationale and approval status in MEM-75/76, and (c) require one shared source of truth and explicit Unknown handling for stakeholder reports. These are proposals until the team adopts them.

## Supporting sources
- Course: `Human_factors_project_instructions.pdf`, sections 1–4.
- Requirement change: `PQC_Scrum_Project_Sprint2_pdf.pdf`, slides 3–5.
- Sprint 1: `sprint1_report.pdf`.
- V2 source: https://github.com/Aliz-f/pqc-dashboard/tree/v2
- Jira whole-sprint review: https://aliz.atlassian.net/browse/MEM-82
