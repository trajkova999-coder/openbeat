# Authoring a lesson

Start with a specific objective: what should the learner understand after five minutes?

`lib/lessons.ts` exports the `Lesson` type and the current lesson collection. `examples/lesson.ts` shows a valid draft object. All medical text is outside the rendering component.

For an existing scenario:

1. Write an original title, description and objectives.
2. Set `id` to a supported scenario. The current UI has one lesson per scenario; replace or extend its content deliberately.
3. Add references, contributor attribution and the draft review status.
4. Edit the phase-keyed explanations and question bank in `lib/lessons.ts`.
5. Check the lesson at every rate from 50 to 90 bpm, including pauses and reverse scrubbing.
6. Follow the clinical review process before changing the draft status.

For a new scenario, extend `Scenario`, `validScenario`, event generation and tests in `lib/simulation.ts` first. Lessons are not arbitrary executable scripts or external JSON uploads. The current typed format documents existing capabilities; a general-purpose lesson editor is future work.

Guided steps use event anchors in `anchors()`: sinus marker, P-wave centre, AV conduction, QRS and T centres. A dropped impulse replaces ventricular events with a blocked-conduction anchor. Keep anchors derived from beat events rather than separate animation timers.

Translation: preserve reference URLs and event IDs, translate text only, and request clinical language review. English is the only reviewed-for-language draft shipped at present; no clinical review has yet occurred.
