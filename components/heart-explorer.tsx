'use client';
import { useState } from 'react';
import { Focus, Minus, Plus, X, MousePointer2 } from 'lucide-react';
import { HeartDiagram } from './heart-diagram';
import { Switch } from './ui/switch';
import type { Beat, Phase } from '@/lib/simulation';

const structures = [
  {
    id: 'sa',
    name: 'SA node',
    sub: 'The starting point',
    x: 243,
    y: 159,
    phase: 'sinus',
    text: 'The sinoatrial node initiates the normal electrical sequence. Click the other structures to follow the route.',
  },
  {
    id: 'atria',
    name: 'Atria',
    sub: 'The first wave',
    x: 408,
    y: 180,
    phase: 'atrial',
    text: 'Activation spreads across the atria. This electrical event is represented by the P wave.',
  },
  {
    id: 'av',
    name: 'AV node',
    sub: 'The connection',
    x: 316,
    y: 235,
    phase: 'av',
    text: 'Relatively slow AV nodal conduction helps separate atrial and ventricular activation. It is only part of the PR interval.',
  },
  {
    id: 'his',
    name: 'His bundle',
    sub: 'Into the ventricles',
    x: 335,
    y: 272,
    phase: 'ventricular',
    text: 'The His bundle carries the impulse into the ventricular conduction system, continuing into the bundle branches.',
  },
  {
    id: 'purkinje',
    name: 'Purkinje network',
    sub: 'A branching pathway',
    x: 391,
    y: 359,
    phase: 'ventricular',
    text: 'The specialised conduction network distributes activation to ventricular muscle. The QRS represents ventricular depolarisation.',
  },
] as const;
function along(points: number[][], p: number) {
  const n = Math.max(0, Math.min(0.9999, p)) * (points.length - 1),
    i = Math.floor(n),
    f = n - i;
  return {
    x: points[i][0] + (points[i + 1][0] - points[i][0]) * f,
    y: points[i][1] + (points[i + 1][1] - points[i][1]) * f,
  };
}
export function HeartExplorer({
  phase,
  labels,
  beat,
  time,
  onSeek,
}: {
  phase: Phase;
  labels: boolean;
  beat: Beat;
  time: number;
  onSeek: (time: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null),
    [zoom, setZoom] = useState(1),
    [isolate, setIsolate] = useState(false);
  const structure = structures.find((s) => s.id === selected);
  const p =
    phase === 'atrial'
      ? (time - beat.start) / 100
      : phase === 'ventricular'
        ? (time - beat.qrs!) / 90
        : 0;
  const paths =
    phase === 'atrial'
      ? [
          [
            [243, 159],
            [271, 177],
            [282, 212],
            [316, 235],
          ],
          [
            [243, 159],
            [304, 145],
            [361, 161],
            [423, 205],
          ],
        ]
      : phase === 'ventricular'
        ? [
            [
              [316, 235],
              [336, 276],
              [351, 339],
            ],
            [
              [316, 235],
              [337, 278],
              [296, 299],
              [290, 335],
              [264, 322],
              [239, 276],
            ],
            [
              [316, 235],
              [342, 297],
              [357, 372],
              [397, 353],
              [426, 275],
            ],
          ]
        : [];
  function pick(id: string) {
    const s = structures.find((s) => s.id === id)!;
    setSelected(id);
    onSeek(
      s.phase === 'sinus'
        ? beat.start - 15
        : s.phase === 'atrial'
          ? beat.start + 45
          : s.phase === 'av'
            ? beat.start + 115
            : beat.qrs === null
              ? beat.start + 300
              : beat.qrs + 38,
    );
  }
  return (
    <div className={`heart-explorer ${isolate ? 'isolate-pathway' : ''}`}>
      <div className="explorer-tools">
        <label htmlFor="isolate" className="switch-label">
          <Switch id="isolate" checked={isolate} onCheckedChange={setIsolate} />
          Pathway only
        </label>
        <div>
          <button
            className="icon-button"
            disabled={zoom <= 1}
            onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
            aria-label="Zoom heart out"
          >
            <Minus size={15} />
          </button>
          <button
            className="zoom-reset"
            onClick={() => setZoom(1)}
            aria-label="Reset heart zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            className="icon-button"
            disabled={zoom >= 1.6}
            onClick={() => setZoom((z) => Math.min(1.6, z + 0.2))}
            aria-label="Zoom heart in"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
      <div className="heart-viewport">
        <div className="heart-scene" style={{ transform: `scale(${zoom})` }}>
          <HeartDiagram phase={phase} labels={labels} />
          <svg
            className="signal-overlay"
            viewBox="0 0 680 480"
            aria-hidden="true"
          >
            <defs>
              <filter id="particle-bloom">
                <feGaussianBlur stdDeviation="5" />
              </filter>
            </defs>
            {paths.map((path, i) => {
              const pt = along(path, p);
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="13"
                    fill="#67ffe1"
                    opacity=".55"
                    filter="url(#particle-bloom)"
                  />
                  <circle cx={pt.x} cy={pt.y} r="3.8" fill="#effff8" />
                </g>
              );
            })}
            {phase === 'sinus' && (
              <circle
                cx="243"
                cy="159"
                r="20"
                fill="none"
                stroke="#89f5d9"
                opacity=".7"
              />
            )}
            {phase === 'blocked' && (
              <g stroke="#ffae9a" strokeWidth="3">
                <path d="M307 226L325 244M325 226L307 244" />
              </g>
            )}
          </svg>
          <div className="anatomy-hotspots">
            {structures.map((s) => (
              <button
                key={s.id}
                className={`anatomy-hotspot ${selected === s.id ? 'selected' : ''}`}
                style={{
                  left: `${(s.x / 680) * 100}%`,
                  top: `${(s.y / 480) * 100}%`,
                }}
                onClick={() => pick(s.id)}
                aria-label={`Explore ${s.name}`}
                aria-pressed={selected === s.id}
              >
                <span className="hotspot-ring" />
                <span className="hotspot-tooltip">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {structure ? (
        <section className="structure-card" aria-label="Selected structure">
          <div>
            <span className="eyebrow">{structure.sub}</span>
            <strong>{structure.name}</strong>
          </div>
          <button
            className="icon-button"
            onClick={() => setSelected(null)}
            aria-label="Close structure explanation"
          >
            <X size={16} />
          </button>
          <p>
            {structure.text}
            {beat.qrs === null && structure.phase === 'ventricular'
              ? ' This atrial impulse is blocked, so this pathway is not activated.'
              : ''}
          </p>
        </section>
      ) : (
        <div className="explorer-invitation">
          <MousePointer2 size={15} />
          <span>Touch a glowing point. Follow the connection.</span>
          <Focus size={17} />
        </div>
      )}
    </div>
  );
}
