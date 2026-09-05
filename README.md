# OpenBeat

**Follow one heartbeat. Understand what the ECG represents.**

An interactive cardiology teaching studio prepared for a medical doctor interested in cardiology. Explore a simplified cardiac conduction diagram and ECG on a single shared timeline.

## Run locally

Requires Node.js 22.18 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by the development server.

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

## Included

- Normal conduction, prolonged AV conduction and an illustrative 4:3 Wenckebach cycle.
- Synchronous ECG, anatomical highlights and event explanations.
- Guided pauses, continuous playback, scrubbing, rate controls and normal-trace overlay.
- Keyboard controls, reduced-motion step mode, responsive layout and self-check questions.
- Shareable lesson/rate URLs. Only label preference is stored locally; no accounts, patient uploads or API keys.

## Model boundaries

This is an educational timing model, not clinical software. All lessons are **Draft — clinician review pending**. Software tests do not establish clinical validity.

Sinus rate is restricted to 50–90 bpm. Four atrial cycles repeat. Each P wave lasts 100 ms. Conducted PR intervals are 160 ms (normal), 260 ms (prolonged), or 160/220/260 ms followed by a nonconducted impulse (Wenckebach). QRS duration is 90 ms; T begins 180 ms after QRS onset and lasts 160 ms. These fixed parameters keep events separated across the supported range; they are not a model of physiological rate adaptation. Sinus initiation is marked 15 ms before P onset as a teaching anchor, not a measured SA-to-atrial interval.

Waveform amplitudes and shapes are illustrative, not a particular clinical lead. The ECG grid is decorative; time labels and the timeline are the timing reference. No patient recordings are included. Mechanical contraction, detailed anatomical propagation and atrial repolarisation are omitted. The visual signal is not reconstructed from ECG data. The sinus-rate setting is an atrial rate; Wenckebach ventricular rate differs.

## Architecture

| Location | Responsibility |
| --- | --- |
| `lib/simulation.ts` | Pure deterministic beat events, phases, waveform, navigation and URL validation |
| `lib/lessons.ts` | Typed lessons, review status, explanations, questions and sources |
| `components/heart-diagram.tsx` | Original functional SVG schematic |
| `app/page.tsx` | Studio, playback state, controls and learning views |
| `app/globals.css` | Visual system and responsive/reduced-motion behaviour |
| `tests/simulation.test.mjs` | Event timing and model boundary tests |

Built with React, TypeScript, Vinext/Vite and the starter's Base UI/Shadcn primitives. Hosting configuration is for Sites/Cloudflare Workers.

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md), [lesson authoring](docs/LESSON_AUTHORING.md), [clinical review](docs/CLINICAL_REVIEW.md) and [sources](docs/SOURCES.md).

Creator profile: https://github.com/trajkova999-coder. A public project repository has not yet been assigned. No reviewer endorsements or clinical validation are claimed.

## Next steps

1. Complete a documented clinician review of all three scenarios.
2. Pilot the normal lesson with an educator and learners; record feedback with permission.
3. Separate the player into an embeddable package after its interface stabilises.
4. Translate reviewed lesson content with clinical language review.

Original code and functional diagrams: MIT. Original educational text and lesson content: CC BY 4.0. See LICENSE and CONTENT_LICENSE.md. Third-party libraries retain their own licences.
