# Group 21 — Sprint 2 Retrospective

**Project:** PQC Security Monitoring Dashboard  
**Sprint:** 2 (course deadline 18 November 2026)  
**Meeting:** Held by the team, as reported in the conversation on 16 November 2026. The precise meeting date, time and attendance list were not supplied; these should be added to the Jira record if needed.  
**Scrum Master for Sprint 2:** Niko (as recorded in MEM-75).

## What improved compared with Sprint 1

We discussed the way our team worked during Sprint 2 and identified three changes that made the sprint easier to manage.

1. **Better meeting schedule and workload balance.** We organized meetings more consistently and distributed the work more evenly. This made it easier to coordinate the new customer-report requirement alongside implementation and review tasks.
2. **Better remote collaboration.** Our fifth team member, **Tancredi**, worked remotely with us during Sprint 2. Collaboration improved noticeably compared with Sprint 1, and we found that his contribution helped the quality of our work. We want to keep the practices that enabled remote participation instead of assuming that in-person attendance is necessary for every task.
3. **Better Jira alignment.** We improved the way we tracked tasks, status changes and process work in Jira. The board gave us a clearer picture of the new requirements, responsibilities and the distinction between implementation, verification and acceptance.

These are **team-reported retrospective observations**. They update the earlier Sprint 1 concerns about scheduling, hybrid participation and Jira coordination.

## Where we can still improve

The following three weaknesses were identified through the Sprint 2 work and code/Jira review. They are adopted here as the three improvement actions to carry into Sprint 3. They do not undo the progress above.

| ID | Weakness seen in Sprint 2 | Improvement for Sprint 3 | Owner (Jira) | Deadline/check | Measure |
| --- | --- | --- | --- | --- | --- |
| **A01** | Most quality evidence came from GitHub source checks and CI. A consistent record of **manual, deployed-dashboard journeys** and screenshots was not collected per story. | Run and document a browser acceptance checklist, including customer-scope isolation, alternate scenarios, navigation and responsive behavior. | **Alireza** — [MEM-97](https://aliz.atlassian.net/browse/MEM-97) | Before Sprint 3 Review (MEM-86) | Every demonstrated journey has a pass/fail/not-tested result with supporting evidence |
| **A02** | Some work crosses sprint boundaries without a single clear handoff: MEM-24 is a Sprint 3 parent, although MEM-36–38 were done in Sprint 2; customer-report scope also grew beyond its initial wireframe. | Make one cross-sprint dependency/ownership matrix during Sprint 3 planning, including Tancredi's remote review and handoffs. | **Masoud** — [MEM-98](https://aliz.atlassian.net/browse/MEM-98) | Sprint 3 Planning (MEM-85), then review at MEM-86 | Each selected story has an integration owner, dependencies and acceptance evidence defined |
| **A03** | The 2030-to-proposed-2027 requirement change reached the implementation before the team had a complete, contemporaneous written record of its keep/change/defer rationale and approval status. | Record each important change and stakeholder decision in Jira when it happens, with links to affected work, risks and pending PO feedback. | **Niko** — [MEM-99](https://aliz.atlassian.net/browse/MEM-99) | Start in MEM-85; inspect at Sprint 3 Retro (MEM-87) | Each material change has a dated decision record and an owner for pending approval |

The owners above are the Jira task assignees for coordinating follow-up. All three tasks are currently scheduled for **PQC Sprint 3** and remain **To Do** until worked on.

## How we will apply the improvements

**In Sprint 3 Planning (MEM-85):** Check the three actions and their planned workload. Use A02 to clarify what the team is actually committing to, and A03 to establish the lightweight decision/change recording template. Continue the more balanced meeting schedule and keep Tancredi included in planning and handoffs.

**During Sprint 3:** A01 will capture real browser demonstration results as each feature is checked. Link tests and screenshots to the story being reviewed. Use A03 when Product Owner changes or stakeholder conflicts arise.

**In Sprint 3 Review (MEM-86):** Check whether each demonstrated feature has evidence; compare progress against acceptance criteria; verify how the three process changes affected the work.

**In Sprint 3 Retrospective (MEM-87):** Assess whether the three actions were achieved. Discuss whether workload balance, remote collaboration and Jira synchronization stayed strong, and carry over only remaining actions.

## Connection with the Sprint 2 Review

The team reports that it held the Sprint Review and prepared a separate review report, [Sprint 2 Review](team-review-2026-11-16.md). That review addresses the V1-to-V2 increment, 18 passing automated tests and the customer-specific reporting changes. This retrospective is about **how the team worked** and what to improve in Sprint 3; it does not constitute a Product Owner's approval of product stories.

## Record boundaries

The team has confirmed that the Sprint Review and Retrospective took place and has supplied the three improvements described above. The precise meeting times, full attendance lists and any exact quotations from Mikko were not supplied. We have not invented them. The Sprint 3 follow-up actions reflect the user-approved retrospective output, with assignees and measurable results recorded in Jira.

**Related Jira:** [MEM-82 Review](https://aliz.atlassian.net/browse/MEM-82), [MEM-83 Retro](https://aliz.atlassian.net/browse/MEM-83), [MEM-84 Submission](https://aliz.atlassian.net/browse/MEM-84), [MEM-85 Sprint 3 Planning](https://aliz.atlassian.net/browse/MEM-85), [MEM-86 Sprint 3 Review](https://aliz.atlassian.net/browse/MEM-86), [MEM-87 Sprint 3 Retro](https://aliz.atlassian.net/browse/MEM-87).
