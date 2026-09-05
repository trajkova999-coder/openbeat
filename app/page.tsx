'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG needs an explicit image role and cannot be replaced by an img element. */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  ExternalLink,
  GitBranch,
  HeartPulse,
  Pause,
  Play,
  RotateCcw,
  Share2,
  SkipBack,
  SkipForward,
  Sparkles,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  anchors,
  beatAt,
  createSimulation,
  nextAnchor,
  phaseAt,
  previousAnchor,
  readSettings,
  voltageAt,
  type Phase,
  type Scenario,
} from '@/lib/simulation';
import { explanations, lessons, questions, references } from '@/lib/lessons';
import { HeartDiagram } from '@/components/heart-diagram';

const width = 1080,
  pad = 25,
  plot = width - pad * 2;
export default function Home() {
  const [scenario, setScenario] = useState<Scenario>('normal'),
    [rate, setRate] = useState(72),
    [time, setTime] = useState(65),
    [playing, setPlaying] = useState(false),
    [speed, setSpeed] = useState('0.25'),
    [guided, setGuided] = useState(true),
    [labels, setLabels] = useState(true),
    [view, setView] = useState('learn'),
    [compare, setCompare] = useState(false),
    [shareMessage, setShareMessage] = useState(''),
    [ready, setReady] = useState(false),
    [reduced, setReduced] = useState(false);
  const sim = useMemo(() => createSimulation(scenario, rate), [scenario, rate]);
  const normal = useMemo(() => createSimulation('normal', rate), [rate]);
  const phase = phaseAt(sim, time),
    current = explanations[phase],
    beat = beatAt(sim, time),
    lesson = lessons.find((l) => l.id === scenario)!;
  const timeRef = useRef(time);
  // oxlint-disable-next-line react/react-compiler -- Initialise URL and device preferences after server rendering; browser APIs are unavailable on the server.
  useEffect(() => {
    const s = readSettings(window.location.search);
    // oxlint-disable-next-line react/react-compiler -- Read URL settings after SSR; this one-time effect synchronises browser state.
    setScenario(s.scenario);
    setRate(s.rate);
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const onChange = () => {
      setReduced(media.matches);
      if (media.matches) setPlaying(false);
    };
    media.addEventListener('change', onChange);
    try {
      setLabels(localStorage.getItem('openbeat-labels') !== 'false');
    } catch {}
    setReady(true);
    return () => media.removeEventListener('change', onChange);
  }, []);
  useEffect(() => {
    timeRef.current = time;
  }, [time]);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem('openbeat-labels', String(labels));
    } catch {}
  }, [labels, ready]);
  useEffect(() => {
    if (!playing) return;
    let frame = 0,
      last = 0;
    const tick = (now: number) => {
      if (!last) last = now;
      const advance = Math.min(now - last, 100) * Number(speed);
      last = now;
      let next = timeRef.current + advance;
      if (guided) {
        const target = anchors(sim).find((a) => a > timeRef.current + 0.01);
        if (target !== undefined && next >= target) {
          next = target;
          setPlaying(false);
        }
      }
      if (next >= sim.duration) {
        next = 65;
        if (guided) setPlaying(false);
      }
      timeRef.current = next;
      setTime(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed, guided, sim]);
  function seek(t: number) {
    setPlaying(false);
    timeRef.current = t;
    setTime(t);
  }
  function changeLesson(id: Scenario) {
    setScenario(id);
    seek(65);
  }
  function reset() {
    setScenario('normal');
    setRate(72);
    setSpeed('0.25');
    setGuided(true);
    setLabels(true);
    setCompare(false);
    seek(65);
  }
  async function share() {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('lesson', scenario);
    url.searchParams.set('rate', String(rate));
    window.history.replaceState({}, '', url);
    try {
      await navigator.clipboard.writeText(url.href);
      setShareMessage('Lesson link copied');
    } catch {
      setShareMessage('Link is ready in your address bar');
    }
  }

  const points = useMemo(
    () =>
      Array.from({ length: 1801 }, (_, i) => {
        const t = (i / 1800) * sim.duration;
        return `${i === 0 ? 'M' : 'L'}${(pad + (t / sim.duration) * plot).toFixed(2)},${(108 - voltageAt(sim, t) * 68).toFixed(2)}`;
      }).join(' '),
    [sim],
  );
  const normalPoints = useMemo(
    () =>
      Array.from({ length: 1801 }, (_, i) => {
        const t = (i / 1800) * normal.duration;
        return `${i === 0 ? 'M' : 'L'}${(pad + (t / normal.duration) * plot).toFixed(2)},${(108 - voltageAt(normal, t) * 68).toFixed(2)}`;
      }).join(' '),
    [normal],
  );
  const cursor = pad + (time / sim.duration) * plot;
  const activeIndex = [
    'sinus',
    'atrial',
    'av',
    'ventricular',
    'repolarisation',
  ].indexOf(phase);
  return (
    <div className="app-shell">
      <a href="#lesson" className="skip-link">
        Skip to lesson
      </a>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="OpenBeat home">
          <span className="brand-icon">
            <Activity size={25} />
          </span>
          openbeat<span className="brand-dot">.</span>
        </Link>
        <span className="header-divider" />
        <span className="header-caption">THE INTERACTIVE HEART LAB</span>
        <a
          className="github-link"
          href="https://github.com/trajkova999-coder"
          target="_blank"
          rel="noreferrer"
        >
          <GitBranch size={16} />
          <span>Meet the creator</span>
          <ExternalLink size={13} />
        </a>
      </header>
      <Tabs
        value={view}
        onValueChange={(v) => {
          setView(String(v));
          setPlaying(false);
        }}
        className="page-tabs"
      >
        <div className="top-nav">
          <TabsList variant="line" className="nav-list">
            <TabsTrigger value="learn">
              <Activity />
              Explore
            </TabsTrigger>
            <TabsTrigger value="about">
              <BookOpen />
              About the project
            </TabsTrigger>
            <TabsTrigger value="contribute">
              <Code2 />
              Contribute
            </TabsTrigger>
          </TabsList>
          <span className="open-tag">
            <span /> OPEN SOURCE · OPEN KNOWLEDGE
          </span>
        </div>
        <TabsContent value="learn">
          <main id="lesson">
            <div className="intro">
              <div>
                <div className="eyebrow">
                  <span className="tiny-line" /> ELECTRICAL FOUNDATIONS{' '}
                  <span className="slash">/</span> LESSON{' '}
                  {String(lessons.indexOf(lesson) + 1).padStart(2, '0')}
                </div>
                <h1>{lesson.title}</h1>
                <p>{lesson.description}</p>
              </div>
              <button className="button share-button" onClick={share}>
                <Share2 size={16} />
                Share lesson
              </button>
            </div>
            {shareMessage && (
              <output className="share-status">{shareMessage}</output>
            )}
            <div className="lesson-picker" aria-label="Choose a lesson">
              {lessons.map((l, i) => (
                <button
                  key={l.id}
                  onClick={() => changeLesson(l.id)}
                  aria-pressed={scenario === l.id}
                  className={
                    scenario === l.id
                      ? 'lesson-choice selected'
                      : 'lesson-choice'
                  }
                >
                  <span className="lesson-number">0{i + 1}</span>
                  {l.short}
                  {scenario === l.id && <span className="selected-dot" />}
                </button>
              ))}
            </div>
            <section
              className="studio"
              aria-label="Interactive conduction studio"
            >
              <div className="studio-top">
                <span>
                  <span className="live-dot" /> CONDUCTION STUDIO
                </span>
                <label className="switch-label" htmlFor="labels">
                  Anatomy labels
                  <Switch
                    id="labels"
                    checked={labels}
                    onCheckedChange={setLabels}
                  />
                </label>
              </div>
              <div className="studio-body">
                <div className="anatomy">
                  <div className="anatomy-caption">
                    ANTERIOR VIEW<span>Patient’s right ← → Patient’s left</span>
                  </div>
                  <HeartDiagram
                    phase={phase}
                    labels={labels}
                    progress={Math.max(
                      0,
                      Math.min(1, (time - beat.start) / Math.max(1, beat.pr)),
                    )}
                  />
                  <div className="anatomy-footer">
                    <span>
                      <i />
                      Electrical pathway
                    </span>
                    <span>Simplified educational schematic</span>
                  </div>
                </div>
                <aside className="explanation">
                  <div className="explanation-top">
                    <span className="eyebrow">FOLLOW THE SIGNAL</span>
                    <span className="step-counter">
                      {activeIndex >= 0 ? `0${activeIndex + 1}` : '—'}
                      <span> / 05</span>
                    </span>
                  </div>
                  <div className="phase-steps" aria-label="Electrical events">
                    {(
                      [
                        'sinus',
                        'atrial',
                        'av',
                        'ventricular',
                        'repolarisation',
                      ] as Phase[]
                    ).map((p, i) => (
                      <button
                        key={p}
                        title={explanations[p].title}
                        aria-label={`Inspect ${explanations[p].ecg}`}
                        aria-pressed={phase === p}
                        className={phase === p ? 'active' : ''}
                        onClick={() => {
                          const ts = [
                            beat.start - 15,
                            beat.start + 45,
                            beat.start + 115,
                            beat.qrs === null
                              ? beat.start + 300
                              : beat.qrs + 38,
                            beat.tStart === null
                              ? beat.start + 450
                              : beat.tStart + 80,
                          ];
                          seek(ts[i]);
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <div className="phase-copy">
                    <span className="phase-label">{current.label}</span>
                    <h2>{current.title}</h2>
                    <p>{current.body}</p>
                  </div>
                  <div className="ecg-connection">
                    <Activity size={20} />
                    <div>
                      <span>ON THE ECG</span>
                      <strong>{current.ecg}</strong>
                    </div>
                  </div>
                  <div className="phase-actions">
                    <button
                      className="icon-button"
                      onClick={() => seek(previousAnchor(sim, time))}
                      aria-label="Previous event"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      className="text-button"
                      onClick={() => seek(nextAnchor(sim, time))}
                    >
                      Next event
                      <ArrowRight size={17} />
                    </button>
                  </div>
                </aside>
              </div>
              <div className="ecg-top">
                <div>
                  <Activity size={16} />
                  <strong>The electrical signature</strong>
                  <span>ILLUSTRATIVE RHYTHM STRIP</span>
                </div>
                <span className="time-readout">
                  {Math.round(time).toString().padStart(4, '0')}{' '}
                  <small>ms</small>
                </span>
              </div>
              <div className="wave-inspector">
                <span>Inspect a waveform</span>
                <button onClick={() => seek(beat.start + 45)}>P wave</button>
                <button onClick={() => seek(beat.start + 115)}>
                  PR interval
                </button>
                <button
                  disabled={beat.qrs === null}
                  onClick={() => beat.qrs !== null && seek(beat.qrs + 38)}
                >
                  QRS complex
                </button>
                <button
                  disabled={beat.tStart === null}
                  onClick={() => beat.tStart !== null && seek(beat.tStart + 80)}
                >
                  T wave
                </button>
              </div>{' '}
              <div className="ecg-wrap">
                <svg
                  className="ecg"
                  viewBox={`0 0 ${width} 175`}
                  role="img"
                  aria-label={`Four-cycle ${lesson.short} ECG. Current event: ${current.ecg}. Use the timeline slider to inspect.`}
                >
                  <defs>
                    <pattern
                      id="minor"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M10 0H0V10"
                        fill="none"
                        stroke="#263c43"
                        strokeWidth=".45"
                      />
                    </pattern>
                    <pattern
                      id="major"
                      width="50"
                      height="50"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="50" height="50" fill="url(#minor)" />
                      <path
                        d="M50 0H0V50"
                        fill="none"
                        stroke="#35505a"
                        strokeWidth=".6"
                      />
                    </pattern>
                    <linearGradient id="cursorFade">
                      <stop stopColor="#77dacb" stopOpacity="0" />
                      <stop offset="1" stopColor="#77dacb" stopOpacity=".12" />
                    </linearGradient>
                  </defs>
                  <rect width={width} height="175" fill="url(#major)" />
                  {compare && scenario !== 'normal' && (
                    <path
                      d={normalPoints}
                      fill="none"
                      stroke="#f3ae8f"
                      strokeWidth="1.6"
                      strokeDasharray="4 5"
                      opacity=".65"
                    />
                  )}
                  <path
                    d={points}
                    fill="none"
                    stroke="#74dfca"
                    strokeWidth="2.3"
                    strokeLinejoin="round"
                  />
                  {sim.beats.map((b, i) => (
                    <g
                      key={b.start}
                      fill="#9db5b9"
                      fontSize="12"
                      fontFamily="monospace"
                    >
                      <text
                        x={pad + ((b.start + 45) / sim.duration) * plot}
                        y="91"
                        textAnchor="middle"
                      >
                        P
                      </text>
                      {b.qrs !== null ? (
                        <>
                          <text
                            x={pad + ((b.qrs + 37) / sim.duration) * plot}
                            y="22"
                            textAnchor="middle"
                          >
                            QRS
                          </text>
                          <text
                            x={pad + ((b.tStart! + 80) / sim.duration) * plot}
                            y="78"
                            textAnchor="middle"
                          >
                            T
                          </text>
                          <text
                            x={pad + ((b.start + 70) / sim.duration) * plot}
                            y="152"
                          >
                            PR {b.pr} ms
                          </text>
                        </>
                      ) : (
                        <text
                          x={pad + ((b.start + 100) / sim.duration) * plot}
                          y="151"
                          fill="#f4ac92"
                        >
                          Not conducted
                        </text>
                      )}
                      <text
                        x={pad + ((i * sim.cycle) / sim.duration) * plot}
                        y="169"
                        opacity=".7"
                      >
                        {((i * sim.cycle) / 1000).toFixed(2)}s
                      </text>
                    </g>
                  ))}
                  <rect
                    x={Math.max(0, cursor - 80)}
                    width={Math.min(cursor, 80)}
                    height="175"
                    fill="url(#cursorFade)"
                  />
                  <line
                    x1={cursor}
                    x2={cursor}
                    y1="0"
                    y2="175"
                    stroke="#e3ede5"
                    strokeWidth="1"
                  />
                  <circle
                    cx={cursor}
                    cy={108 - voltageAt(sim, time) * 68}
                    r="4"
                    fill="#fff8ed"
                  />
                </svg>
              </div>
              <div className="timeline">
                <Slider
                  aria-label="Timeline position in milliseconds"
                  value={[time]}
                  min={0}
                  max={Math.floor(sim.duration - 1)}
                  step={1}
                  onValueChange={(v) => seek(Array.isArray(v) ? v[0] : v)}
                />
              </div>
              <div className="playback">
                <div className="transport">
                  <button
                    className="icon-button"
                    onClick={() => seek(65)}
                    aria-label="Restart lesson"
                  >
                    <RotateCcw size={18} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => seek(previousAnchor(sim, time))}
                    aria-label="Step backward"
                  >
                    <SkipBack size={17} />
                  </button>
                  <button
                    className="play-button"
                    onClick={() => {
                      if (reduced) {
                        seek(nextAnchor(sim, time));
                      } else {
                        setPlaying((p) => !p);
                      }
                    }}
                    aria-label={
                      reduced
                        ? 'Advance one event'
                        : playing
                          ? 'Pause lesson'
                          : 'Play lesson'
                    }
                  >
                    {playing ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" />
                    )}
                    <span>{reduced ? 'Step' : playing ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => seek(nextAnchor(sim, time))}
                    aria-label="Step forward"
                  >
                    <SkipForward size={17} />
                  </button>
                  <Select value={speed} onValueChange={(v) => v && setSpeed(v)}>
                    <SelectTrigger
                      aria-label="Playback speed"
                      className="speed-select"
                    >
                      <SelectValue>{speed}×</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {['0.1', '0.25', '0.5', '1'].map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}×
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <span className="playback-hint">
                  {reduced
                    ? 'Reduced motion · explore one event at a time'
                    : guided
                      ? 'Pauses at each key event'
                      : 'Continuous playback · four-cycle loop'}
                </span>
                <label className="switch-label" htmlFor="guided">
                  Guided mode
                  <Switch
                    id="guided"
                    checked={guided}
                    onCheckedChange={(v) => {
                      setGuided(v);
                      setPlaying(false);
                    }}
                  />
                </label>
              </div>
            </section>
            <section className="settings" aria-label="Simulation settings">
              <div className="rate-setting">
                <div>
                  <HeartPulse size={18} />
                  <span id="rate-label">Sinus rate</span>
                  <strong>
                    {rate}
                    <small>bpm</small>
                  </strong>
                </div>
                <Slider
                  aria-labelledby="rate-label"
                  value={[rate]}
                  min={50}
                  max={90}
                  step={1}
                  onValueChange={(v) => {
                    setRate(Array.isArray(v) ? v[0] : v);
                    seek(65);
                  }}
                />
                <span className="range-labels">
                  <span>50</span>
                  <span>90 bpm</span>
                </span>
              </div>
              <div className="comparison-setting">
                <label className="switch-label" htmlFor="compare">
                  <Switch
                    id="compare"
                    checked={compare}
                    disabled={scenario === 'normal'}
                    onCheckedChange={setCompare}
                  />
                  Overlay normal conduction
                </label>
                <p>
                  {scenario === 'normal'
                    ? 'Select an AV conduction lesson to compare.'
                    : 'Dashed coral trace · same sinus rate'}
                </p>
              </div>
              <button className="text-button reset" onClick={reset}>
                <RotateCcw size={15} />
                Reset all
              </button>
            </section>
            <div className="below-studio">
              <Quiz />
              <section className="learning-note">
                <span className="eyebrow">
                  <BookOpen size={15} /> THE BIG PICTURE
                </span>
                <h2>
                  Electricity first.
                  <br />
                  Movement follows.
                </h2>
                <p>
                  An ECG records differences in electrical potential. It doesn’t
                  directly measure the heart squeezing, blood flow or pumping
                  strength.
                </p>
                <details>
                  <summary>
                    What this model simplifies
                    <ChevronRight size={16} />
                  </summary>
                  <p>
                    Timing and waveform shapes are illustrative, not a
                    biophysical or patient-specific simulation. The strip is not
                    a named clinical lead. Grid spacing is decorative; use the
                    millisecond labels for timing. PR, QRS and T durations are
                    fixed teaching parameters within a sinus-rate range of 50–90
                    bpm. Mechanical contraction, three-dimensional propagation
                    and atrial repolarisation are omitted.
                  </p>
                </details>
              </section>
            </div>
            <section className="sources">
              <div>
                <BookOpen size={17} />
                <h2>Grounded in physiology. Open to review.</h2>
              </div>
              <p className="review-status">{lesson.reviewStatus}</p>
              <div className="source-links">
                {references.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noreferrer">
                    {r.title}
                    <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            </section>
          </main>
        </TabsContent>
        <TabsContent value="about">
          <main className="info-page">
            <span className="eyebrow">THE OPENBEAT PROJECT</span>
            <h1>
              Understanding starts
              <br />
              with seeing.
            </h1>
            <p className="lead">
              An open-source teaching studio connecting the heart’s electrical
              pathway with the ECG.
            </p>
            <div className="info-grid">
              <section>
                <HeartPulse />
                <h2>Built from a medical perspective.</h2>
                <p>
                  Created for a medical doctor interested in cardiology,
                  OpenBeat helps students, nurses and junior doctors explore
                  electrical conduction at their own pace.
                </p>
                <p>
                  The project is an early educational prototype. All lessons are
                  drafts awaiting clinician review; no clinical validation is
                  claimed.
                </p>
              </section>
              <section>
                <Activity />
                <h2>One shared timeline.</h2>
                <p>
                  Every waveform, anatomical highlight and explanation follows
                  the same deterministic event model. Pause a moment, trace its
                  pathway and inspect what the ECG represents.
                </p>
                <p>
                  The model illustrates electrical timing. It does not diagnose,
                  reconstruct patient anatomy or simulate treatment.
                </p>
              </section>
            </div>
            <h2>Sources and review</h2>
            {references.map((r) => (
              <a
                className="reference-row"
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <strong>{r.title}</strong>
                  <p>{r.detail}</p>
                </div>
                <ExternalLink />
              </a>
            ))}
            <button className="button primary" onClick={() => setView('learn')}>
              Return to the studio
              <ArrowRight size={17} />
            </button>
          </main>
        </TabsContent>
        <TabsContent value="contribute">
          <main className="info-page">
            <span className="eyebrow">OPEN SOURCE · SHARED UNDERSTANDING</span>
            <h1>
              A better way to learn.
              <br />
              Built together.
            </h1>
            <p className="lead">
              Help make cardiac physiology clearer, more accessible and
              available in more languages.
            </p>
            <div className="contribution-grid">
              {[
                {
                  icon: BookOpen,
                  title: 'Review a lesson',
                  text: 'Check the explanations, event timing and source support. Document your review against the exact lesson version.',
                },
                {
                  icon: Code2,
                  title: 'Build the tools',
                  text: 'Improve the shared timeline, accessible controls or reusable ECG player. Add tests for changes to the electrical model.',
                },
                {
                  icon: Sparkles,
                  title: 'Teach something new',
                  text: 'Use the documented lesson format to propose a focused learning objective, guided explanation and question.',
                },
              ].map((c) => (
                <section key={c.title}>
                  <c.icon />
                  <h2>{c.title}</h2>
                  <p>{c.text}</p>
                </section>
              ))}
            </div>
            <div className="contribute-note">
              <GitBranch size={25} />
              <div>
                <h2>Start with the project creator.</h2>
                <p>
                  The source is prepared for release. A public repository link
                  will be added once it has been published.
                </p>
              </div>
              <a
                className="button primary"
                href="https://github.com/trajkova999-coder"
                target="_blank"
                rel="noreferrer"
              >
                Creator on GitHub
                <ExternalLink size={16} />
              </a>
            </div>
            <p className="muted">
              Original code: MIT · Original educational content: CC BY 4.0
            </p>
          </main>
        </TabsContent>
      </Tabs>
      <footer>
        <span className="footer-brand">
          <Activity size={17} />
          openbeat.
        </span>
        <span>Made for curious minds. Built for shared understanding.</span>
        <span>For learning only. Not for diagnosis or treatment.</span>
      </footer>
    </div>
  );
}

function Quiz() {
  const [q, setQ] = useState(0),
    [answer, setAnswer] = useState<string>(''),
    [checked, setChecked] = useState(false);
  const item = questions[q];
  return (
    <section className="quiz">
      <div className="quiz-top">
        <span className="eyebrow">
          <CircleHelp size={16} /> A MOMENT TO THINK
        </span>
        <span>0{q + 1} / 03</span>
      </div>
      <h2>{item.prompt}</h2>
      <RadioGroup
        aria-label={item.prompt}
        value={answer}
        onValueChange={(v) => {
          setAnswer(String(v));
          setChecked(false);
        }}
        className="answers"
      >
        {item.options.map((o, i) => (
          <label
            key={`${q}-${i}`}
            className={answer === String(i) ? 'answer chosen' : 'answer'}
          >
            <RadioGroupItem value={String(i)} />
            {o}
          </label>
        ))}
      </RadioGroup>
      {checked && (
        <output
          className={`feedback ${Number(answer) === item.answer ? 'correct' : ''}`}
        >
          <strong>
            {Number(answer) === item.answer
              ? 'Exactly. '
              : 'Take another look. '}
          </strong>
          {item.explanation}
        </output>
      )}
      <div className="quiz-actions">
        <button
          className="text-button"
          disabled={!answer}
          onClick={() => setChecked(true)}
        >
          Check my answer
          <Check size={16} />
        </button>
        <button
          className="icon-button"
          onClick={() => {
            setQ((q + 1) % questions.length);
            setAnswer('');
            setChecked(false);
          }}
          aria-label="Next question"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
