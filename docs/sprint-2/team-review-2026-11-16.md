# Group 21 — Sprint 2 Review

**Professional Software Engineering Processes and Human Factors (811373A)**  
**Date: 16 November 2026 | Deadline: 18 November 2026**  
**Dashboard: [V1](https://pqc-dashboard.arfadaei.ir/) / [V2](https://pqc-dashboard-v2.arfadaei.ir/)**

## Our goal

In Sprint 2 we had to respond to the new requirement introduced by Emma. The largest customer wants to know where it stands on post-quantum migration and how much data may still be exposed to Harvest-Now-Decrypt-Later (HNDL) risks by data class. It has proposed moving the deadline for connections carrying its data from the end of 2030 to **31 December 2027**. The change is still proposed; we do not present it as an accepted contract amendment.

Rather than start over, we kept our Sprint 1 stakeholder views and expanded the dashboard around this customer question.

## What V2 adds

V1 explained the organization's overall position in three views: connection security for Sarah, migration coverage for Michael, and an executive overview for Emma. We retained the shared twelve-connection synthetic dataset: eight ML-KEM and four classical, or **66.7% connection adoption**.

V2 adds a customer-specific readiness report, a migration-blocker view, a classical fallback exception register, and a customer-scoped transferred-volume analysis. The customer report is separate from internal planning screens. It shows a pending 2027 deadline, the earlier 2030 target, and an applicable 2028 legacy-replacement dependency.

| Customer metric | Example calculation | Result |
|---|---|---|
| ML-KEM adoption | 3 / 5 customer connections | 60.0% |
| Classical customer connections | 2 / 5 | 40.0% |
| Classical-associated customer data | 60 / 300 GB | 20.0% |
| Personal data | 40 / 100 GB | 40.0% |
| Operational data | 20 / 200 GB | 10.0% |

These figures are different measures, not competing answers. Connection adoption counts connections; volume association measures the supplied data-class traffic records. Neither represents confirmed interception. The seven internal-only connections are excluded from the customer report.

## Risks and the three stakeholder positions

The blockers screen assigns four standard classical connections to two hardware replacement blockers, one software upgrade and one compatibility issue. The customer connection C-04 / CN-003 depends on a replacement expected in 2028, after the proposed 2027 deadline. C-05 / CN-005 has a compatibility issue whose resolution still needs assessment.

This is where Sarah's, Michael's and Emma's needs genuinely pull in different directions. Sarah wants potential exposure visible even if a summary looks positive. Michael has to protect monitoring continuity for legacy field devices. Emma needs a clear customer explanation and cannot casually promise migration by the new date or extra budget. V2 puts these points in context and describes possible remedies as discussion topics, not approvals. “Accepted in simulation” is only an example label.

## Verification and what we improved

We compared the main and v2 branches, checked the calculations against synthetic records and added regression tests. Code review found that a stale report could still show its usual figures, that volume-data completeness had been assumed in a fixed sentence, and that unavailable class percentages needed safer handling.

We corrected the V2 code to withhold stale metrics, validate class-volume completeness, reject duplicate, negative and nonfinite inputs, and show “Not available” where the calculation cannot be supported. The automated workflow passed **18 tests with zero failures**, and the production build passed: [GitHub Actions evidence](https://github.com/Aliz-f/pqc-dashboard/actions/runs/43917067470). These are code and source-contract checks; the meeting demonstration and final stakeholder acceptance remain distinct.

## Jira and scope

Sprint 2 includes three principal stories, totaling **18 story points**: MEM-17 (blockers, 5), MEM-18 (fallback exceptions, 5), and MEM-92 (customer report, 8). Source-backed implementation and desk-verification tasks are marked Done: MEM-36–38, MEM-46–53 and MEM-93–96. The three parent stories remain In Review. The larger traffic-exposure story MEM-24 remains assigned to Sprint 3, although its three preparatory tasks were implemented in Sprint 2.

The changed requirement is documented in MEM-76; risk and decision material is in MEM-74 and MEM-75. This review is tracked under MEM-82, with the retrospective and submission tracked separately in MEM-83 and MEM-84.

## What worked and what to improve

We are pleased that the changed requirement resulted in a useful addition to the product rather than an isolated mock-up. Preserving one synthetic data source helped the reports stay consistent. The automated checks also made shortcomings in generated interface code easier to identify and correct.

The main process lesson is that a change affecting customer reporting, security, migration and the presentation needs a record of why priorities shifted, not just new code. Sprint 1 already highlighted task ownership, hybrid collaboration, and preparing deliverables earlier as issues worth improving. We recommend:
1. Link code and tests to the corresponding Jira issue when work is checked, not at the end of the sprint.
2. Write the keep/change/defer rationale down when stakeholder priorities shift.
3. Check customer-facing figures against shared examples, including missing and stale data, before showing them.

These are proposals for the retrospective. The team should decide the owners and follow-up dates, and record meeting feedback and Product Owner acceptance when those events occur.

## Conclusion

V1 showed our organization's broad PQC transition. V2 can also explain this customer's specific position, the class of data associated with remaining classical connections, and the conflict between an accelerated contractual target and legacy replacement timing. The next review should focus on demonstrating the working increment, agreeing on the customer-facing message, and deciding how to improve our process before Sprint 3.

**Evidence:** Sprint 1 report; Mikko Mäkitalo's course instructions, persona cards, and Sprint 2 slides; Jira MEM; GitHub `main`/`v2`; [successful CI run](https://github.com/Aliz-f/pqc-dashboard/actions/runs/43917067470).


## Sprint Review meeting confirmation and handoff

After this written report was prepared, the team confirmed that **the Sprint 2 Review was held**. The detailed product analysis, implementation evidence, CI checks and remaining acceptance distinctions are described above. The team did not supply the precise meeting time, participant list, verbatim feedback or formal Product Owner sign-off for this record, so those details are not attributed to anyone.

The team also confirmed that the **Sprint 2 Retrospective was held**. The key improvements reported were (1) more predictable meeting scheduling and a better balance of work, (2) better collaboration with Tancredi as the fifth member working remotely, improving the quality of the group's output, and (3) more consistent use of Jira for tasks and Scrum process tracking.

The retrospective identified three practical Sprint 3 follow-ups: manual/browser acceptance evidence ([MEM-97](https://aliz.atlassian.net/browse/MEM-97)), cross-sprint dependency and handoff clarity ([MEM-98](https://aliz.atlassian.net/browse/MEM-98)), and recording stakeholder changes/decisions closer to when they occur ([MEM-99](https://aliz.atlassian.net/browse/MEM-99)). The full meeting outcome and action criteria are documented in [Sprint 2 Retrospective](retrospective-and-sprint3-actions.md).

This confirms **the team's review activity**; it is not a statement that the lecturer/PO accepted all three outstanding stories or the proposed contract amendment.
