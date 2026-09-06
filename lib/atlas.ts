import type { Scenario } from './simulation';

export type CasePattern =
  | 'sinus'
  | 'brady'
  | 'tachy'
  | 'first-degree'
  | 'wenckebach'
  | 'mobitz-ii'
  | 'af'
  | 'pvc';
export type CaseCategory =
  | 'Sinus rhythms'
  | 'AV conduction'
  | 'Atrial rhythms'
  | 'Ventricular ectopy';
export interface AtlasCase {
  id: CasePattern;
  number: string;
  title: string;
  diagnosis: string;
  category: CaseCategory;
  level: 'Foundation' | 'Intermediate';
  patient: string;
  presentation: string;
  context: string;
  question: string;
  options: string[];
  answer: number;
  findings: { label: string; detail: string; from: number; to: number }[];
  explanation: string;
  pitfall: string;
  rate: string;
  pr: string;
  qrs: string;
  regularity: string;
  related: CasePattern[];
  source: { title: string; url: string };
  lab?: Scenario;
}
const ecgSource = {
  title: 'Clinical Methods · Electrocardiography',
  url: 'https://www.ncbi.nlm.nih.gov/books/NBK354/',
};
const avSource = {
  title: 'Merck Manual · Atrioventricular block',
  url: 'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrioventricular-block',
};
export const atlasCases: AtlasCase[] = [
  {
    id: 'sinus',
    number: '01',
    title: 'An incidental tracing',
    diagnosis: 'Normal sinus rhythm',
    category: 'Sinus rhythms',
    level: 'Foundation',
    patient: '32-year-old adult · routine assessment',
    presentation:
      'An asymptomatic adult has a rhythm strip recorded during a routine assessment. Identify the electrical sequence before looking for abnormalities.',
    context:
      'No symptoms are supplied in this fictional vignette. A normal-looking rhythm strip does not exclude structural or other cardiac disease.',
    question: 'Which pattern best describes this strip?',
    options: [
      'Normal sinus rhythm',
      'Atrial fibrillation',
      'First-degree AV block',
    ],
    answer: 0,
    findings: [
      {
        label: 'A P wave before each QRS',
        detail: 'Atrial activation precedes each ventricular complex.',
        from: 100,
        to: 350,
      },
      {
        label: 'A consistent PR interval',
        detail: 'The teaching model uses a PR interval of 160 ms.',
        from: 100,
        to: 260,
      },
      {
        label: 'Regular ventricular timing',
        detail: 'Successive QRS onsets are separated by 833 ms.',
        from: 260,
        to: 1093,
      },
    ],
    explanation:
      'The orderly P–QRS sequence, consistent timing and narrow complexes establish the intended sinus pattern.',
    pitfall:
      'Rhythm recognition is one part of ECG interpretation. This illustrative strip provides neither a full 12-lead assessment nor a diagnosis of overall cardiac health.',
    rate: '72 bpm',
    pr: '160 ms',
    qrs: '90 ms',
    regularity: 'Regular',
    related: ['brady', 'first-degree'],
    source: ecgSource,
    lab: 'normal',
  },
  {
    id: 'brady',
    number: '02',
    title: 'A slow pulse at rest',
    diagnosis: 'Sinus bradycardia',
    category: 'Sinus rhythms',
    level: 'Foundation',
    patient: '26-year-old adult · resting pulse',
    presentation:
      'A recreational endurance athlete notices a slow pulse while resting. They report no symptoms in this synthetic case. Start with the relationship between P waves and QRS complexes.',
    context:
      'Rate alone does not determine whether a finding is physiological or pathological. Symptoms, medications and the broader clinical context matter.',
    question: 'What distinguishes this example from the normal-rate case?',
    options: [
      'The QRS is absent after every P wave',
      'The sinus sequence is preserved at a slower rate',
      'There are no discrete P waves',
    ],
    answer: 1,
    findings: [
      {
        label: 'Longer R–R spacing',
        detail: 'The model has one ventricular activation every 1,250 ms.',
        from: 260,
        to: 1510,
      },
      {
        label: 'Preserved P–QRS relationship',
        detail: 'Each narrow QRS follows a P wave.',
        from: 1350,
        to: 1600,
      },
      {
        label: 'PR remains unchanged',
        detail:
          'Slowing this teaching rhythm does not lengthen the PR interval.',
        from: 1350,
        to: 1510,
      },
    ],
    explanation:
      'The sequence remains sinus, with a slower rate of 48 bpm in this example.',
    pitfall:
      'Do not infer sinus node disease from a slow rate alone or assume that an athlete’s symptoms are benign.',
    rate: '48 bpm',
    pr: '160 ms',
    qrs: '90 ms',
    regularity: 'Regular',
    related: ['sinus', 'first-degree'],
    source: ecgSource,
  },
  {
    id: 'tachy',
    number: '03',
    title: 'A faster rhythm',
    diagnosis: 'Sinus tachycardia',
    category: 'Sinus rhythms',
    level: 'Foundation',
    patient: '35-year-old adult · fever and palpitations',
    presentation:
      'An adult with a febrile illness reports a fast heartbeat. In this fictional example, inspect whether atrial and ventricular activation still follow an organised sequence.',
    context:
      'The vignette illustrates pattern recognition; it does not establish why the rate is elevated.',
    question: 'Which feature supports the intended sinus pattern?',
    options: [
      'Discrete P waves preceding regular narrow QRS complexes',
      'An entirely irregular ventricular rhythm',
      'A premature broad complex without a preceding P wave',
    ],
    answer: 0,
    findings: [
      {
        label: 'Shorter cycle length',
        detail: 'The sinus cycle is about 545 ms at 110 bpm.',
        from: 240,
        to: 785,
      },
      {
        label: 'P waves remain visible',
        detail: 'A P wave precedes each ventricular complex in this example.',
        from: 645,
        to: 875,
      },
      {
        label: 'Narrow QRS complexes',
        detail: 'The ventricular activation duration remains 90 ms.',
        from: 785,
        to: 875,
      },
    ],
    explanation:
      'The rate is faster while the organised sinus sequence is retained.',
    pitfall:
      'A fast, regular rhythm is not automatically sinus tachycardia. P-wave morphology, onset, context and the full ECG remain important.',
    rate: '110 bpm',
    pr: '140 ms',
    qrs: '90 ms',
    regularity: 'Regular',
    related: ['sinus', 'af'],
    source: ecgSource,
  },
  {
    id: 'first-degree',
    number: '04',
    title: 'A longer connection',
    diagnosis: 'First-degree AV block',
    category: 'AV conduction',
    level: 'Foundation',
    patient: '58-year-old adult · incidental ECG finding',
    presentation:
      'A rhythm strip recorded during a routine visit shows an extended interval between atrial and ventricular activation. Does every atrial impulse still conduct?',
    context:
      'Medication history and prior ECGs are not supplied. Focus on the timing pattern.',
    question: 'Which description fits this illustration?',
    options: [
      'Progressive PR lengthening with a dropped QRS',
      'A fixed, prolonged PR with one-to-one conduction',
      'No organised atrial activity',
    ],
    answer: 1,
    findings: [
      {
        label: 'PR interval of 260 ms',
        detail: 'Measure from P onset to QRS onset.',
        from: 100,
        to: 360,
      },
      {
        label: 'Every P wave conducts',
        detail: 'Each atrial wave is followed by a QRS.',
        from: 1766,
        to: 2116,
      },
      {
        label: 'The delay stays constant',
        detail: 'Successive conducted beats have the same PR.',
        from: 2600,
        to: 2860,
      },
    ],
    explanation:
      'A prolonged PR with preserved one-to-one conduction illustrates first-degree AV block.',
    pitfall:
      'A long PR interval alone does not locate the exact site of conduction delay.',
    rate: '72 bpm',
    pr: '260 ms',
    qrs: '90 ms',
    regularity: 'Regular',
    related: ['sinus', 'wenckebach'],
    source: avSource,
    lab: 'delay',
  },
  {
    id: 'wenckebach',
    number: '05',
    title: 'Longer, longer… then a pause',
    diagnosis: 'Mobitz I (Wenckebach)',
    category: 'AV conduction',
    level: 'Intermediate',
    patient: '64-year-old adult · intermittent light-headedness',
    presentation:
      'A fictional patient reports episodic light-headedness. The strip shows grouped beats. Follow the P waves and compare the PR intervals before the pause.',
    context:
      'The vignette is a learning exercise, not a basis for determining the cause or urgency of real symptoms.',
    question: 'What is the defining pattern here?',
    options: [
      'Fixed PR intervals before a nonconducted P wave',
      'Progressive PR prolongation before a nonconducted P wave',
      'No identifiable P waves',
    ],
    answer: 1,
    findings: [
      {
        label: 'PR lengthens across the group',
        detail: 'The illustrative sequence uses 160, 220 and 260 ms.',
        from: 100,
        to: 2027,
      },
      {
        label: 'The fourth P wave is not conducted',
        detail: 'Atrial activation is present without a following QRS.',
        from: 2600,
        to: 2960,
      },
      {
        label: 'The PR resets',
        detail:
          'Conduction resumes with the shorter interval in the next group.',
        from: 3433,
        to: 3593,
      },
    ],
    explanation:
      'This grouped sequence illustrates classic Wenckebach periodicity.',
    pitfall:
      'An isolated 2:1 pattern cannot establish Mobitz I versus Mobitz II solely from PR behaviour.',
    rate: 'Atrial: 72 bpm',
    pr: '160 → 220 → 260 ms',
    qrs: '90 ms',
    regularity: 'Grouped beats',
    related: ['mobitz-ii', 'first-degree'],
    source: avSource,
    lab: 'wenckebach',
  },
  {
    id: 'mobitz-ii',
    number: '06',
    title: 'A sudden missing complex',
    diagnosis: 'Mobitz II AV block',
    category: 'AV conduction',
    level: 'Intermediate',
    patient: '71-year-old adult · episodic presyncope',
    presentation:
      'A fictional patient describes brief episodes of near-fainting. Some P waves are not followed by ventricular complexes. Compare the PR intervals of the conducted beats.',
    context:
      'This plate isolates conduction timing. A real assessment requires the full ECG and clinical evaluation.',
    question: 'Which observation separates this plate from Wenckebach?',
    options: [
      'The conducted PR intervals stay constant before the block',
      'The P waves disappear throughout the strip',
      'Every PR interval progressively increases',
    ],
    answer: 0,
    findings: [
      {
        label: 'Constant conducted PR',
        detail: 'The conducted beats use a PR interval of 160 ms.',
        from: 100,
        to: 1093,
      },
      {
        label: 'A nonconducted P wave',
        detail: 'The third atrial impulse is not followed by a QRS.',
        from: 1767,
        to: 2130,
      },
      {
        label: 'Conduction resumes',
        detail: 'The next conducted beat has the same PR interval.',
        from: 2600,
        to: 2760,
      },
    ],
    explanation:
      'Constant PR intervals around an intermittently nonconducted P wave illustrate the intended Mobitz II pattern.',
    pitfall:
      'The narrow QRS used here is a simplification. QRS width and a single short strip cannot localise disease reliably.',
    rate: 'Atrial: 72 bpm',
    pr: '160 ms when conducted',
    qrs: '90 ms · illustrative',
    regularity: 'Intermittent block',
    related: ['wenckebach', 'first-degree'],
    source: avSource,
  },
  {
    id: 'af',
    number: '07',
    title: 'An unpredictable pulse',
    diagnosis: 'Atrial fibrillation',
    category: 'Atrial rhythms',
    level: 'Intermediate',
    patient: '69-year-old adult · palpitations',
    presentation:
      'A fictional patient describes a fluttering sensation. The ventricular timing is uneven. Inspect the baseline and decide whether discrete, repeating P waves are present.',
    context:
      'The clinical significance and cause are not established by this synthetic strip.',
    question: 'Which pair of findings supports the intended pattern?',
    options: [
      'Regular timing and sawtooth atrial activity',
      'No discrete P waves and irregular R–R intervals',
      'Fixed PR prolongation and regular QRS complexes',
    ],
    answer: 1,
    findings: [
      {
        label: 'Unequal R–R intervals',
        detail:
          'Ventricular activation occurs at deliberately uneven intervals.',
        from: 840,
        to: 2100,
      },
      {
        label: 'No discrete P waves',
        detail:
          'Small baseline oscillations replace the organised atrial waveform in this illustration.',
        from: 1140,
        to: 1500,
      },
      {
        label: 'Narrow complexes in this example',
        detail:
          'The ventricular waveform is narrow here; that is not a universal feature of AF.',
        from: 2890,
        to: 2980,
      },
    ],
    explanation:
      'The absence of discrete P waves with irregular ventricular timing is the central teaching distinction.',
    pitfall:
      'Artefact and other atrial rhythms may mimic elements of this appearance. An irregular pulse by itself does not establish AF.',
    rate: 'Ventricular: variable',
    pr: 'Not measurable',
    qrs: '90 ms · illustrative',
    regularity: 'Irregularly irregular',
    related: ['tachy', 'pvc'],
    source: {
      title: 'Merck Manual · Atrial fibrillation',
      url: 'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrial-fibrillation',
    },
  },
  {
    id: 'pvc',
    number: '08',
    title: 'The early beat',
    diagnosis: 'Premature ventricular complex',
    category: 'Ventricular ectopy',
    level: 'Intermediate',
    patient: '43-year-old adult · a “skipped beat” sensation',
    presentation:
      'A fictional patient notices occasional thumps or pauses. One complex arrives earlier than expected and looks different from the surrounding beats.',
    context:
      'The clinical significance of ectopy depends on factors not provided here, including symptoms, burden and cardiac structure.',
    question: 'Which complex is the key finding?',
    options: [
      'The usual P wave',
      'The early broad complex without a preceding P wave',
      'A progressively prolonged PR interval',
    ],
    answer: 1,
    findings: [
      {
        label: 'An early broad complex',
        detail: 'The ectopic QRS starts at 2,500 ms and lasts 160 ms.',
        from: 2500,
        to: 2660,
      },
      {
        label: 'No preceding P wave for the ectopic beat',
        detail:
          'This premature ventricular complex is not generated by the model’s usual atrial sequence.',
        from: 2290,
        to: 2500,
      },
      {
        label: 'A compensatory pause in this example',
        detail:
          'The surrounding sinus QRS onsets span two baseline R–R intervals.',
        from: 1927,
        to: 3593,
      },
    ],
    explanation:
      'An early broad complex with no preceding P wave illustrates ventricular ectopy. The pause shown is one possible pattern.',
    pitfall:
      'Not every broad premature beat is a PVC, and not every PVC has a fully compensatory pause.',
    rate: 'Sinus: 72 bpm + ectopy',
    pr: '160 ms on sinus beats',
    qrs: '90 ms sinus / 160 ms ectopic',
    regularity: 'Premature interruption',
    related: ['sinus', 'af'],
    source: {
      title: 'Merck Manual · Ventricular premature beats',
      url: 'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/ventricular-premature-beats-vpb',
    },
  },
];
export interface AtlasBeat {
  p: number | null;
  qrs: number | null;
  pr: number | null;
  width: number;
  ectopic?: boolean;
}
export function atlasEvents(pattern: CasePattern): AtlasBeat[] {
  if (pattern === 'af')
    return [240, 840, 1640, 2100, 2890, 3490, 4010, 4810, 5390].map((qrs) => ({
      p: null,
      qrs,
      pr: null,
      width: 90,
    }));
  const cycle =
    pattern === 'brady' ? 1250 : pattern === 'tachy' ? 60000 / 110 : 60000 / 72;
  const events: AtlasBeat[] = [];
  for (let i = 0; 100 + i * cycle < 6000; i++) {
    if (pattern === 'pvc' && i === 3) continue;
    const p = 100 + i * cycle,
      pr =
        pattern === 'first-degree'
          ? 260
          : pattern === 'wenckebach'
            ? [160, 220, 260, 260][i % 4]
            : pattern === 'tachy'
              ? 140
              : 160;
    const blocked =
      (pattern === 'wenckebach' && i % 4 === 3) ||
      (pattern === 'mobitz-ii' && i % 3 === 2);
    events.push({
      p,
      qrs: blocked ? null : p + pr,
      pr: blocked ? null : pr,
      width: 90,
    });
  }
  if (pattern === 'pvc')
    events.push({ p: null, qrs: 2500, pr: null, width: 160, ectopic: true });
  return events.sort((a, b) => (a.p ?? a.qrs ?? 0) - (b.p ?? b.qrs ?? 0));
}
function hill(t: number, start: number, width: number, a: number) {
  const x = (t - start) / width;
  return x > 0 && x < 1 ? a * Math.sin(Math.PI * x) ** 2 : 0;
}
function triangle(t: number, start: number, width: number, a: number) {
  const x = (t - start) / width;
  return x >= 0 && x <= 1 ? a * (1 - Math.abs(2 * x - 1)) : 0;
}
export function atlasVoltage(
  pattern: CasePattern,
  t: number,
  events = atlasEvents(pattern),
) {
  let v =
    pattern === 'af'
      ? 0.025 * Math.sin(t * 0.055) +
        0.018 * Math.sin(t * 0.081 + 1) +
        0.009 * Math.sin(t * 0.12)
      : 0;
  for (const b of events) {
    if (b.p !== null) v += hill(t, b.p, 100, 0.15);
    if (b.qrs !== null) {
      if (b.ectopic) {
        v +=
          triangle(t, b.qrs, 110, 0.95) +
          triangle(t, b.qrs + 110, 50, -0.4) +
          hill(t, b.qrs + 220, 180, -0.27);
      } else {
        v +=
          triangle(t, b.qrs, 20, -0.13) +
          triangle(t, b.qrs + 20, 35, 1.05) +
          triangle(t, b.qrs + 55, 35, -0.25) +
          hill(
            t,
            b.qrs + (pattern === 'tachy' ? 140 : 180),
            pattern === 'tachy' ? 140 : 160,
            0.28,
          );
      }
    }
  }
  return v;
}
export function filterCases(query: string, category: string) {
  const q = query.toLowerCase().trim();
  return atlasCases.filter(
    (c) =>
      (category === 'All cases' || c.category === category) &&
      `${c.title} ${c.diagnosis} ${c.presentation} ${c.category}`
        .toLowerCase()
        .includes(q),
  );
}
