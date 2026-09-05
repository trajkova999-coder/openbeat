export type Scenario = 'normal' | 'delay' | 'wenckebach';
export type Phase =
  | 'sinus'
  | 'atrial'
  | 'av'
  | 'ventricular'
  | 'plateau'
  | 'repolarisation'
  | 'rest'
  | 'blocked';
export interface Beat {
  start: number;
  pr: number;
  conducted: boolean;
  qrs: number | null;
  tStart: number | null;
  tEnd: number | null;
}
export interface Simulation {
  beats: Beat[];
  duration: number;
  cycle: number;
  rate: number;
  scenario: Scenario;
}
export function validScenario(value: unknown): value is Scenario {
  return ['normal', 'delay', 'wenckebach'].includes(String(value));
}
export function clampRate(rate: number) {
  return Number.isFinite(rate)
    ? Math.max(50, Math.min(90, Math.round(rate)))
    : 72;
}
export function createSimulation(
  scenario: Scenario = 'normal',
  rate = 72,
): Simulation {
  if (!validScenario(scenario)) scenario = 'normal';
  rate = clampRate(rate);
  const cycle = 60000 / rate;
  const beats = Array.from({ length: 4 }, (_, i): Beat => {
    const start = i * cycle + 80;
    const pr =
      scenario === 'normal'
        ? 160
        : scenario === 'delay'
          ? 260
          : [160, 220, 260, 260][i];
    const conducted = scenario !== 'wenckebach' || i !== 3;
    const qrs = conducted ? start + pr : null;
    return {
      start,
      pr,
      conducted,
      qrs,
      tStart: qrs === null ? null : qrs + 180,
      tEnd: qrs === null ? null : qrs + 340,
    };
  });
  return { beats, cycle, duration: cycle * 4, rate, scenario };
}
export function beatAt(sim: Simulation, time: number): Beat {
  return sim.beats[
    Math.max(0, Math.min(3, Math.floor(Math.max(0, time - 60) / sim.cycle)))
  ];
}
export function phaseAt(sim: Simulation, time: number): Phase {
  const b = beatAt(sim, time),
    t = time - b.start;
  if (t < -20) return 'rest';
  if (t < 0) return 'sinus';
  if (t < 100) return 'atrial';
  if (!b.conducted) return t < 260 ? 'av' : t < 420 ? 'blocked' : 'rest';
  if (t < b.pr) return 'av';
  if (t < b.pr + 90) return 'ventricular';
  if (t < b.pr + 180) return 'plateau';
  if (t < b.pr + 340) return 'repolarisation';
  return 'rest';
}
function hump(t: number, start: number, width: number, amplitude: number) {
  const x = (t - start) / width;
  return x > 0 && x < 1 ? amplitude * Math.sin(Math.PI * x) ** 2 : 0;
}
function triangle(t: number, start: number, width: number, amplitude: number) {
  const x = (t - start) / width;
  return x >= 0 && x <= 1 ? amplitude * (1 - Math.abs(2 * x - 1)) : 0;
}
export function voltageAt(sim: Simulation, time: number) {
  return sim.beats.reduce((v, b) => {
    v += hump(time, b.start, 100, 0.15);
    if (b.qrs !== null)
      v +=
        triangle(time, b.qrs, 20, -0.13) +
        triangle(time, b.qrs + 20, 35, 1.05) +
        triangle(time, b.qrs + 55, 35, -0.25) +
        hump(time, b.tStart!, 160, 0.28);
    return v;
  }, 0);
}
export function anchors(sim: Simulation) {
  return sim.beats.flatMap((b) => [
    b.start - 15,
    b.start + 45,
    b.start + 115,
    ...(b.qrs === null ? [b.start + 300] : [b.qrs + 38, b.tStart! + 80]),
  ]);
}
export function nextAnchor(sim: Simulation, time: number) {
  return anchors(sim).find((a) => a > time + 1) ?? anchors(sim)[0];
}
export function previousAnchor(sim: Simulation, time: number) {
  return (
    [...anchors(sim)].reverse().find((a) => a < time - 1) ?? anchors(sim)[0]
  );
}
export function readSettings(query: string) {
  const p = new URLSearchParams(query);
  return {
    scenario: validScenario(p.get('lesson'))
      ? (p.get('lesson') as Scenario)
      : ('normal' as Scenario),
    rate: clampRate(p.has('rate') ? Number(p.get('rate')) : 72),
  };
}
