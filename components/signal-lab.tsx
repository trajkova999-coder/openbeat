'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- A pointer-operable scientific SVG is exposed as an image inside a keyboard-operable slider. */
import { useMemo, useState } from 'react';
import { Ruler, ZoomIn, X, Crosshair } from 'lucide-react';
import { Switch } from './ui/switch';
import { voltageAt, type Simulation } from '@/lib/simulation';
import { measurementDelta, timeFromFraction } from '@/lib/interaction';

export function SignalLab({
  sim,
  time,
  compare,
  onSeek,
}: {
  sim: Simulation;
  time: number;
  compare: Simulation | null;
  onSeek: (t: number) => void;
}) {
  const [zoom, setZoom] = useState(false),
    [measure, setMeasure] = useState(false),
    [pins, setPins] = useState<number[]>([]);
  const beat =
      sim.beats[Math.max(0, Math.min(3, Math.floor(time / sim.cycle)))],
    start = zoom ? sim.beats.indexOf(beat) * sim.cycle : 0,
    duration = zoom ? sim.cycle : sim.duration;
  const x = (t: number) => 25 + ((t - start) / duration) * 1030;
  const points = useMemo(
    () =>
      Array.from({ length: 1801 }, (_, i) => {
        const t = start + (i / 1800) * duration;
        return `${i ? 'L' : 'M'}${25 + (i / 1800) * 1030},${110 - voltageAt(sim, t) * 73}`;
      }).join(' '),
    [sim, start, duration],
  );
  const normal = useMemo(
    () =>
      compare
        ? Array.from({ length: 1801 }, (_, i) => {
            const t = start + (i / 1800) * duration;
            return `${i ? 'L' : 'M'}${25 + (i / 1800) * 1030},${110 - voltageAt(compare, t) * 73}`;
          }).join(' ')
        : '',
    [compare, start, duration],
  );
  function pin(t: number) {
    setPins((p) => (p.length === 2 ? [t] : [...p, t]));
  }
  function pointer(e: React.PointerEvent<HTMLDivElement>) {
    const bounds = e.currentTarget.getBoundingClientRect();
    const t = timeFromFraction(
      (((e.clientX - bounds.left) / bounds.width) * 1080 - 25) / 1030,
      start,
      duration,
      sim.duration,
    );
    onSeek(t);
    if (measure) pin(t);
    else e.currentTarget.setPointerCapture(e.pointerId);
  }
  const delta = measurementDelta(pins);
  return (
    <div className="signal-lab">
      <div className="signal-tools">
        <span>
          <Crosshair size={15} />
          Drag to explore the signal
        </span>
        <div>
          <label className="switch-label" htmlFor="zoom-beat">
            <ZoomIn size={15} />
            One beat
            <Switch
              id="zoom-beat"
              checked={zoom}
              onCheckedChange={(value) => {
                setZoom(value);
                onSeek(time);
              }}
            />
          </label>
          <button
            className={`measure-button ${measure ? 'active' : ''}`}
            aria-pressed={measure}
            onClick={() => {
              onSeek(time);
              setMeasure((m) => !m);
              setPins([]);
            }}
          >
            <Ruler size={15} />
            Calipers
          </button>
        </div>
      </div>
      <div
        className={`signal-surface ${measure ? 'measuring' : ''}`}
        role="slider"
        tabIndex={0}
        aria-label="ECG inspection time in milliseconds"
        aria-valuemin={Math.round(start)}
        aria-valuemax={Math.floor(start + duration - 1)}
        aria-valuenow={Math.round(time)}
        aria-valuetext={`${Math.round(time)} milliseconds. Use arrow keys to move; Enter places a caliper in measurement mode.`}
        onPointerDown={pointer}
        onPointerMove={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId) && !measure) {
            const b = e.currentTarget.getBoundingClientRect();
            onSeek(
              timeFromFraction(
                (((e.clientX - b.left) / b.width) * 1080 - 25) / 1030,
                start,
                duration,
                sim.duration,
              ),
            );
          }
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onKeyDown={(e) => {
          if (
            ['ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '].includes(
              e.key,
            )
          ) {
            e.preventDefault();
            if (e.key === 'Enter' && measure) pin(time);
            else if (e.key === 'Home') onSeek(start);
            else if (e.key === 'End') onSeek(Math.floor(start + duration - 1));
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
              onSeek(
                Math.max(
                  start,
                  Math.min(
                    start + duration - 1,
                    time +
                      (e.key === 'ArrowRight' ? 1 : -1) * (e.shiftKey ? 50 : 5),
                  ),
                ),
              );
          }
        }}
      >
        <svg viewBox="0 0 1080 190" aria-hidden="true">
          <defs>
            <pattern
              id="signal-small-grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 0H0V10"
                fill="none"
                stroke="#274b4d"
                strokeWidth=".5"
              />
            </pattern>
            <pattern
              id="signal-grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <rect width="50" height="50" fill="url(#signal-small-grid)" />
              <path
                d="M50 0H0V50"
                fill="none"
                stroke="#3f6865"
                strokeWidth=".5"
              />
            </pattern>
            <linearGradient id="signal-colour">
              <stop stopColor="#47dcb8" />
              <stop offset=".5" stopColor="#b7ffbd" />
              <stop offset="1" stopColor="#50dfc6" />
            </linearGradient>
            <filter id="trace-glow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <clipPath id="signal-clip">
              <rect x="25" y="0" width="1030" height="190" />
            </clipPath>
          </defs>
          <rect width="1080" height="190" fill="url(#signal-grid)" />
          <g clipPath="url(#signal-clip)">
            {normal && (
              <path
                d={normal}
                fill="none"
                stroke="#ffa887"
                strokeWidth="1.5"
                strokeDasharray="5 5"
              />
            )}
            <path
              d={points}
              fill="none"
              stroke="#70eacd"
              strokeWidth="4"
              opacity=".25"
              filter="url(#trace-glow)"
            />
            <path
              d={points}
              fill="none"
              stroke="url(#signal-colour)"
              strokeWidth="2.4"
              strokeLinejoin="round"
            />
            {sim.beats.map((b, i) => (
              <g
                key={b.start}
                fill="#b4cac9"
                fontSize="12"
                fontFamily="monospace"
              >
                <text x={x(b.start + 50)} y="91" textAnchor="middle">
                  P
                </text>
                {b.qrs !== null ? (
                  <>
                    <text x={x(b.qrs + 37)} y="21" textAnchor="middle">
                      QRS
                    </text>
                    <text x={x(b.tStart! + 80)} y="79" textAnchor="middle">
                      T
                    </text>
                    <path
                      d={`M${x(b.start)} 144v6H${x(b.qrs)}v-6`}
                      fill="none"
                      stroke="#8aafa5"
                    />
                    <text
                      x={(x(b.start) + x(b.qrs)) / 2}
                      y="169"
                      textAnchor="middle"
                    >
                      {b.pr} ms
                    </text>
                  </>
                ) : (
                  <text x={x(b.start + 150)} y="159" fill="#ffac91">
                    Not conducted
                  </text>
                )}
                <text x={x(i * sim.cycle) + 6} y="185" fill="#839e9f">
                  {((i * sim.cycle) / 1000).toFixed(2)} s
                </text>
              </g>
            ))}
            {pins.length === 2 && (
              <rect
                x={x(Math.min(...pins))}
                width={Math.abs(x(pins[1]) - x(pins[0]))}
                height="190"
                fill="#e7bb7317"
              />
            )}
            {pins.map((p, i) => (
              <g key={`${i}-${p}`}>
                <line
                  x1={x(p)}
                  x2={x(p)}
                  y1="0"
                  y2="190"
                  stroke="#ffd08e"
                  strokeDasharray="4 3"
                />
                <text x={x(p) + 5} y="40" fill="#ffd08e" fontSize="14">
                  {i === 0 ? 'A' : 'B'}
                </text>
              </g>
            ))}
            <line
              x1={x(time)}
              x2={x(time)}
              y1="0"
              y2="190"
              stroke="#dcfff0"
              strokeWidth="1"
            />
            <circle
              cx={x(time)}
              cy={110 - voltageAt(sim, time) * 73}
              r="5"
              fill="#f6ffe8"
            />
            <circle
              cx={x(time)}
              cy={110 - voltageAt(sim, time) * 73}
              r="12"
              fill="#8fffc2"
              opacity=".2"
            />
          </g>
        </svg>
      </div>
      {measure && (
        <div className="caliper-panel">
          <Ruler size={17} />
          <output>
            {delta === null ? (
              pins.length ? (
                'Place the second caliper.'
              ) : (
                'Click two points on the trace.'
              )
            ) : (
              <>
                Interval <strong>{delta} ms</strong>
              </>
            )}
          </output>
          <button onClick={() => pin(time)} className="text-button">
            Pin {pins.length === 1 ? 'B' : 'A'} at cursor
          </button>
          <button
            className="icon-button"
            onClick={() => setPins([])}
            aria-label="Clear calipers"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="signal-caption">
        <span>
          {zoom
            ? `Beat ${sim.beats.indexOf(beat) + 1} of 4 · magnified`
            : 'Four atrial cycles · illustrative waveform'}
        </span>
        <span>Time in milliseconds · decorative grid</span>
      </div>
    </div>
  );
}
