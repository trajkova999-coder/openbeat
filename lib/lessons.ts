import type { Phase, Scenario } from './simulation';
export interface Lesson {
  id: Scenario;
  title: string;
  short: string;
  description: string;
  objectives: string[];
  reviewStatus: 'Draft — clinician review pending';
  references: string[];
  contributor: string;
}
export const references = [
  {
    title: 'Clinical Methods · Electrocardiography',
    url: 'https://www.ncbi.nlm.nih.gov/books/NBK354/',
    detail: 'Electrical activation, ECG waves and intervals.',
  },
  {
    title: 'Merck Manual · Atrioventricular block',
    url: 'https://www.merckmanuals.com/professional/cardiovascular-disorders/specific-cardiac-arrhythmias/atrioventricular-block',
    detail: 'Prolonged PR intervals and the classic Wenckebach pattern.',
  },
];
export const lessons: Lesson[] = [
  {
    id: 'normal',
    title: 'Follow one heartbeat.',
    short: 'Normal conduction',
    description: 'See how an electrical impulse becomes a waveform.',
    objectives: [
      'Trace the electrical pathway.',
      'Connect atrial and ventricular activation to the ECG.',
      'Distinguish electrical activity from contraction.',
    ],
    reviewStatus: 'Draft — clinician review pending',
    references: references.map((r) => r.url),
    contributor: 'OpenBeat project',
  },
  {
    id: 'delay',
    title: 'A little longer to conduct.',
    short: 'Prolonged AV conduction',
    description: 'Compare a longer PR interval with normal conduction.',
    objectives: [
      'Locate the PR interval.',
      'Observe preserved one-to-one conduction.',
    ],
    reviewStatus: 'Draft — clinician review pending',
    references: references.map((r) => r.url),
    contributor: 'OpenBeat project',
  },
  {
    id: 'wenckebach',
    title: 'When an impulse stops.',
    short: 'Wenckebach pattern',
    description: 'Follow progressive PR prolongation to a nonconducted beat.',
    objectives: [
      'Compare successive PR intervals.',
      'Identify a P wave without a following QRS.',
    ],
    reviewStatus: 'Draft — clinician review pending',
    references: references.map((r) => r.url),
    contributor: 'OpenBeat project',
  },
];
export const explanations: Record<
  Phase,
  { label: string; title: string; body: string; ecg: string }
> = {
  sinus: {
    label: '01 / THE ORIGIN',
    title: 'A small spark. A new beat.',
    body: 'The sinoatrial (SA) node initiates the impulse. The teaching marker precedes atrial activation; the SA node itself has no visible wave on this strip.',
    ecg: 'Before the P wave',
  },
  atrial: {
    label: '02 / ATRIAL ACTIVATION',
    title: 'The impulse spreads.',
    body: 'Electrical activation spreads through the atria. This depolarisation produces the P wave. It is an electrical event, not a recording of atrial contraction.',
    ecg: 'P wave',
  },
  av: {
    label: '03 / THE CONNECTION',
    title: 'A pause in the pathway.',
    body: 'Conduction through the AV node is relatively slow. The PR interval spans the start of the P wave to the start of the QRS, so it includes more than AV nodal delay.',
    ecg: 'PR interval',
  },
  ventricular: {
    label: '04 / VENTRICULAR ACTIVATION',
    title: 'The ventricles activate.',
    body: 'The impulse travels through the His–Purkinje system to activate ventricular muscle. The QRS complex represents ventricular depolarisation.',
    ecg: 'QRS complex',
  },
  plateau: {
    label: 'BETWEEN QRS AND T',
    title: 'A quiet-looking interval.',
    body: 'Ventricular cells remain largely depolarised. A near-flat ST segment does not mean that the heart is electrically inactive.',
    ecg: 'ST segment',
  },
  repolarisation: {
    label: '05 / ELECTRICAL RECOVERY',
    title: 'Ready for the next beat.',
    body: 'The ventricles repolarise. The T wave reflects this electrical recovery; its shape is simplified in this teaching model.',
    ecg: 'T wave',
  },
  rest: {
    label: 'BETWEEN BEATS',
    title: 'The cycle continues.',
    body: 'The strip returns to its baseline before the next sinus impulse. Use Next event to explore the sequence at your own pace.',
    ecg: 'Baseline',
  },
  blocked: {
    label: 'A NONCONDUCTED IMPULSE',
    title: 'A P wave without a QRS.',
    body: 'In this illustrative Wenckebach cycle, the fourth atrial impulse does not conduct to the ventricles. No ventricular activation or T wave is generated for that impulse.',
    ecg: 'Nonconducted P wave',
  },
};
export const questions = [
  {
    prompt: 'What does the P wave represent?',
    options: [
      'Atrial depolarisation',
      'Ventricular contraction',
      'AV node recovery',
    ],
    answer: 0,
    explanation:
      'The P wave represents atrial depolarisation. The ECG records electrical activity; contraction is a separate mechanical event.',
  },
  {
    prompt: 'Does the PR interval measure only AV nodal delay?',
    options: [
      'Yes, only the delay at the AV node',
      'No, it also includes atrial activation and conduction toward the ventricles',
    ],
    answer: 1,
    explanation:
      'The PR interval starts at P-wave onset and ends at QRS onset. AV nodal delay is only part of that interval.',
  },
  {
    prompt: 'Which electrical event produces the T wave?',
    options: [
      'The SA node firing',
      'Ventricular depolarisation',
      'Ventricular repolarisation',
    ],
    answer: 2,
    explanation:
      'The T wave represents ventricular repolarisation: electrical recovery after activation.',
  },
];
