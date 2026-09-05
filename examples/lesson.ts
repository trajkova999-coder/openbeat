import type { Lesson } from '../lib/lessons';
export const exampleLesson: Lesson = {
  id: 'normal',
  title: 'Follow one heartbeat.',
  short: 'Normal conduction',
  description: 'Connect electrical activation to the P, QRS and T waves.',
  objectives: [
    'Identify atrial depolarisation.',
    'Distinguish electrical activity from contraction.',
  ],
  reviewStatus: 'Draft — clinician review pending',
  references: ['https://www.ncbi.nlm.nih.gov/books/NBK354/'],
  contributor: 'OpenBeat project',
};
