/** Clamp pointer input to the current visible time window. */
export function timeFromFraction(
  fraction: number,
  start: number,
  duration: number,
  total: number,
) {
  if (!Number.isFinite(fraction)) return start;
  return Math.max(
    start,
    Math.min(
      total - 1,
      start + duration - 1,
      Math.round(start + Math.max(0, Math.min(1, fraction)) * duration),
    ),
  );
}
export function measurementDelta(pins: number[]) {
  return pins.length === 2 ? Math.round(Math.abs(pins[1] - pins[0])) : null;
}
