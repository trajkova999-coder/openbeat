'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG teaching plates require an image role. */
import { useEffect, useId, useMemo, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Columns2,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  Share2,
  X,
} from 'lucide-react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import {
  atlasCases,
  atlasEvents,
  atlasVoltage,
  filterCases,
  type AtlasCase,
  type CasePattern,
} from '@/lib/atlas';
import type { Scenario } from '@/lib/simulation';

export function CaseAtlas({ onLab }: { onLab: (scenario: Scenario) => void }) {
  const [query, setQuery] = useState(''),
    [category, setCategory] = useState('All cases'),
    [study, setStudy] = useState(false),
    [selected, setSelected] = useState<CasePattern | null>(null),
    [comparison, setComparison] = useState<CasePattern[]>([]),
    [comparing, setComparing] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('case');
    if (atlasCases.some((c) => c.id === id)) {
      // oxlint-disable-next-line react/react-compiler -- Initialise an atlas deep link after SSR.
      setSelected(id as CasePattern);
    }
  }, []);
  const filtered = filterCases(query, category),
    item = atlasCases.find((c) => c.id === selected);
  function open(id: CasePattern | null) {
    setSelected(id);
    setComparing(false);
    const url = new URL(window.location.href);
    url.search = '';
    if (id) url.searchParams.set('case', id);
    window.history.replaceState({}, '', url);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  function toggle(id: CasePattern) {
    setComparison((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length < 2
          ? [...prev, id]
          : prev,
    );
  }
  if (comparing && comparison.length === 2)
    return (
      <main className="atlas" id="atlas-top">
        <button
          className="text-button atlas-back"
          onClick={() => setComparing(false)}
        >
          <ArrowLeft size={16} />
          Back to the atlas
        </button>
        <div className="atlas-heading">
          <div>
            <span className="eyebrow">
              SIDE BY SIDE · SAME SIX-SECOND WINDOW
            </span>
            <h1>
              Spot the <em>difference.</em>
            </h1>
            <p>
              Compare timing and morphology. These are illustrative teaching
              plates.
            </p>
          </div>
        </div>
        <div className="atlas-comparison">
          {comparison.map((id) => {
            const c = atlasCases.find((c) => c.id === id)!;
            return (
              <section key={id}>
                <span className="eyebrow">
                  PLATE {c.number} · {c.category}
                </span>
                <h2>{c.diagnosis}</h2>
                <AtlasPlate pattern={id} />
                <dl className="case-metrics">
                  {[
                    ['Rate', c.rate],
                    ['PR interval', c.pr],
                    ['QRS', c.qrs],
                    ['Pattern', c.regularity],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p>{c.explanation}</p>
                <button className="text-button" onClick={() => open(id)}>
                  Open full case
                  <ArrowRight size={16} />
                </button>
              </section>
            );
          })}
        </div>
        <AtlasNotice />
      </main>
    );
  if (item)
    return (
      <CaseDetail
        key={`${item.id}-${study}`}
        item={item}
        study={study}
        onBack={() => open(null)}
        onOpen={open}
        onLab={onLab}
      />
    );
  return (
    <main className="atlas" id="atlas-top">
      <div className="atlas-heading">
        <div>
          <span className="eyebrow">
            <BookOpen size={15} /> THE OPENBEAT CASE COLLECTION
          </span>
          <h1>
            A field guide to
            <br />
            the <em>electrical heart.</em>
          </h1>
          <p>
            Eight clinical stories. Eight patterns to recognise.
            <br />
            Explore the strip, find the clues, understand the difference.
          </p>
        </div>
        <div className="atlas-volume">
          <span>VOLUME</span>
          <strong>
            01<span>/</span>
          </strong>
          <span>RHYTHM & CONDUCTION</span>
          <div>
            8 plates <i /> 4 chapters
          </div>
        </div>
      </div>
      <div className="atlas-toolbar">
        <div className="atlas-search">
          <Search size={18} />
          <Input
            type="search"
            aria-label="Search cases"
            placeholder="Search a rhythm, finding or presentation…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <label className="switch-label" htmlFor="atlas-study">
          <Switch id="atlas-study" checked={study} onCheckedChange={setStudy} />
          <span>
            Challenge mode<small>Hide diagnoses until you’re ready</small>
          </span>
        </label>
      </div>
      <div className="atlas-chapters" aria-label="Filter cases by chapter">
        {[
          'All cases',
          'Sinus rhythms',
          'AV conduction',
          'Atrial rhythms',
          'Ventricular ectopy',
        ].map((c) => (
          <button
            key={c}
            aria-pressed={category === c}
            className={category === c ? 'active' : ''}
            onClick={() => setCategory(c)}
          >
            {c}
            <span>
              {c === 'All cases'
                ? atlasCases.length
                : atlasCases.filter((x) => x.category === c).length}
            </span>
          </button>
        ))}
      </div>
      <div className="atlas-list-caption">
        <span>
          {filtered.length} {filtered.length === 1 ? 'case' : 'cases'} in this
          collection
        </span>
        <span>
          <Columns2 size={14} />
          Select two plates to compare
        </span>
      </div>
      <div className="atlas-grid">
        {filtered.map((c) => (
          <article
            className={`atlas-card category-${c.category.split(' ')[0].toLowerCase()}`}
            key={c.id}
          >
            <button className="atlas-card-main" onClick={() => open(c.id)}>
              <div className="plate-heading">
                <span>PLATE {c.number}</span>
                <span>{c.level}</span>
              </div>
              <AtlasPlate pattern={c.id} compact />
              <div className="atlas-card-content">
                <span className="eyebrow">{c.category}</span>
                <h2>{c.title}</h2>
                <p>
                  {study
                    ? 'Interpret the pattern before revealing the diagnosis.'
                    : c.diagnosis}
                </p>
                <span className="case-patient">{c.patient}</span>
              </div>
              <div className="atlas-card-open">
                <span>Study this case</span>
                <ArrowRight size={17} />
              </div>
            </button>
            <label className="compare-choice">
              <Checkbox
                checked={comparison.includes(c.id)}
                disabled={comparison.length === 2 && !comparison.includes(c.id)}
                onCheckedChange={() => toggle(c.id)}
              />
              <span>Compare plate {c.number}</span>
            </label>
          </article>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="atlas-empty">
          <Search size={27} />
          <h2>No matching cases.</h2>
          <p>Try a broader term or another chapter.</p>
          <button
            className="button"
            onClick={() => {
              setQuery('');
              setCategory('All cases');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      {comparison.length > 0 && (
        <div className="compare-tray">
          <Columns2 size={18} />
          <span>{comparison.length} of 2 plates selected</span>
          <button
            className="button primary"
            disabled={comparison.length !== 2}
            onClick={() => {
              setComparing(true);
              window.scrollTo({ top: 0, behavior: 'instant' });
            }}
          >
            Compare side by side
            <ArrowRight size={16} />
          </button>
          <button
            className="icon-button"
            onClick={() => setComparison([])}
            aria-label="Clear comparison selection"
          >
            <X size={18} />
          </button>
        </div>
      )}
      <AtlasNotice />
    </main>
  );
}

function CaseDetail({
  item,
  study,
  onBack,
  onOpen,
  onLab,
}: {
  item: AtlasCase;
  study: boolean;
  onBack: () => void;
  onOpen: (id: CasePattern) => void;
  onLab: (s: Scenario) => void;
}) {
  const [revealed, setRevealed] = useState(!study),
    [finding, setFinding] = useState<number | null>(null),
    [answer, setAnswer] = useState(''),
    [checked, setChecked] = useState(false),
    [message, setMessage] = useState('');
  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage('Case link copied.');
    } catch {
      setMessage('The address bar contains this case’s link.');
    }
  }
  return (
    <main className="atlas case-detail" id="atlas-top">
      <div className="case-breadcrumb">
        <button className="text-button" onClick={onBack}>
          <ArrowLeft size={16} />
          Case atlas
        </button>
        <ChevronRight size={14} />
        <span>{item.category}</span>
        <span className="plate-number">PLATE {item.number}</span>
      </div>
      <div className="atlas-heading">
        <div>
          <span className="eyebrow">
            {item.level.toUpperCase()} · ORIGINAL SYNTHETIC CASE
          </span>
          <h1>{item.title}</h1>
          <p>{item.patient}</p>
        </div>
        <button className="button" onClick={share}>
          <Share2 size={16} />
          Share case
        </button>
      </div>
      {message && <output className="share-status">{message}</output>}
      <div className="case-story">
        <div>
          <span className="eyebrow">THE PRESENTATION</span>
          <p>{item.presentation}</p>
        </div>
        <aside>
          <span className="eyebrow">KEEP IN MIND</span>
          <p>{item.context}</p>
        </aside>
      </div>
      <section className="case-plate">
        <div className="case-plate-header">
          <div>
            <Activity size={17} />
            <strong>Read the rhythm</strong>
            <span>SYNTHETIC · 6 SECONDS</span>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setRevealed((r) => !r);
              setFinding(null);
            }}
          >
            {revealed ? <EyeOff size={15} /> : <Eye size={15} />}{' '}
            {revealed ? 'Hide interpretation' : 'Reveal interpretation'}
          </button>
        </div>
        <AtlasPlate
          pattern={item.id}
          finding={
            revealed && finding !== null ? item.findings[finding] : undefined
          }
        />
        <div className="case-plate-caption">
          <span>
            Illustrative single-channel teaching plate · not a patient recording
          </span>
          <span>Time labels are calibrated · grid is decorative</span>
        </div>
      </section>
      {!revealed ? (
        <section className="case-question">
          <span className="eyebrow">YOUR INTERPRETATION</span>
          <h2>{item.question}</h2>
          <RadioGroup
            value={answer}
            onValueChange={(v) => {
              setAnswer(String(v));
              setChecked(false);
            }}
            aria-label={item.question}
          >
            {item.options.map((o, i) => (
              <label className="answer" key={o}>
                <RadioGroupItem value={String(i)} />
                {o}
              </label>
            ))}
          </RadioGroup>
          {checked && (
            <output className="feedback">
              {Number(answer) === item.answer
                ? 'That matches the intended teaching pattern. Reveal the interpretation to explore the findings.'
                : 'Look again at the P waves, QRS timing and relationship between them. You can retry or reveal the explanation.'}
            </output>
          )}
          <div className="quiz-actions">
            <button
              disabled={answer === ''}
              className="text-button"
              onClick={() => setChecked(true)}
            >
              Check interpretation
              <Check size={16} />
            </button>
            <button className="text-button" onClick={() => setRevealed(true)}>
              Reveal and learn
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="case-reading">
            <section>
              <div className="diagnosis-label">
                <Check size={15} />
                INTENDED TEACHING DIAGNOSIS
              </div>
              <h2>{item.diagnosis}</h2>
              <p className="case-explanation">{item.explanation}</p>
              <dl className="case-metrics">
                {[
                  ['Rate', item.rate],
                  ['PR interval', item.pr],
                  ['QRS duration', item.qrs],
                  ['Regularity', item.regularity],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="case-findings">
              <span className="eyebrow">
                SELECT A FINDING TO HIGHLIGHT THE STRIP
              </span>
              {item.findings.map((f, i) => (
                <button
                  key={f.label}
                  aria-pressed={finding === i}
                  className={finding === i ? 'active' : ''}
                  onClick={() => setFinding(finding === i ? null : i)}
                >
                  <span>0{i + 1}</span>
                  <div>
                    <strong>{f.label}</strong>
                    <p>{f.detail}</p>
                  </div>
                  <ChevronRight size={16} />
                </button>
              ))}
            </section>
          </div>
          <div className="case-pitfall">
            <BookOpen size={21} />
            <div>
              <span className="eyebrow">THE INTERPRETATION TRAP</span>
              <p>{item.pitfall}</p>
            </div>
          </div>
          {item.lab && (
            <div className="case-lab-link">
              <div>
                <span className="eyebrow">CONNECT THE STRIP TO THE HEART</span>
                <h3>Follow this conduction pattern in the lab.</h3>
              </div>
              <button
                className="button primary"
                onClick={() => onLab(item.lab!)}
              >
                Open interactive lab
                <ArrowRight size={16} />
              </button>
            </div>
          )}
          <section className="related-cases">
            <span className="eyebrow">LEARN THE DISTINCTION</span>
            <h2>Compare with a related case.</h2>
            <div>
              {item.related.map((id) => {
                const related = atlasCases.find((c) => c.id === id)!;
                return (
                  <button key={id} onClick={() => onOpen(id)}>
                    <span>PLATE {related.number}</span>
                    <strong>{related.diagnosis}</strong>
                    <ArrowRight size={18} />
                  </button>
                );
              })}
            </div>
          </section>
          <a
            className="case-source"
            href={item.source.url}
            target="_blank"
            rel="noreferrer"
          >
            <BookOpen size={16} />
            Source: {item.source.title}
            <ExternalLink size={14} />
          </a>
        </>
      )}
      <AtlasNotice />
    </main>
  );
}

function AtlasNotice() {
  return (
    <div className="atlas-notice">
      <BookOpen size={17} />
      <p>
        <strong>
          Original synthetic cases · draft, clinician review pending.
        </strong>{' '}
        These plates teach selected rhythm features. They are not clinical
        recordings, validated diagnostic simulations or treatment guidance.
      </p>
    </div>
  );
}

export function AtlasPlate({
  pattern,
  compact = false,
  finding,
}: {
  pattern: CasePattern;
  compact?: boolean;
  finding?: { label: string; from: number; to: number };
}) {
  const id = useId().replaceAll(':', '');
  const path = useMemo(() => {
    const events = atlasEvents(pattern);
    return Array.from(
      { length: 2401 },
      (_, i) =>
        `${i ? 'L' : 'M'}${20 + (i / 2400) * 1160},${100 - atlasVoltage(pattern, (i / 2400) * 6000, events) * 58}`,
    ).join(' ');
  }, [pattern]);
  const x = (time: number) => 20 + (time / 6000) * 1160;
  return (
    <div className={`atlas-plate ${compact ? 'compact' : ''}`}>
      <svg
        viewBox={`0 0 1200 ${compact ? 145 : 180}`}
        role="img"
        aria-label="Synthetic six-second ECG teaching strip"
      >
        <defs>
          <pattern
            id={`grid-${id}`}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="#395b53"
              strokeWidth=".6"
            />
          </pattern>
        </defs>
        <rect width="1200" height="180" fill={`url(#grid-${id})`} />
        {finding && (
          <>
            <rect
              x={x(finding.from)}
              width={x(finding.to) - x(finding.from)}
              height="150"
              fill="#f2c48324"
            />
            <line
              x1={x(finding.from)}
              x2={x(finding.from)}
              y1="15"
              y2="150"
              stroke="#efc183"
              strokeDasharray="4 4"
            />
            <line
              x1={x(finding.to)}
              x2={x(finding.to)}
              y1="15"
              y2="150"
              stroke="#efc183"
              strokeDasharray="4 4"
            />
          </>
        )}
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth={compact ? 3 : 2}
          strokeLinejoin="round"
        />
        {!compact &&
          Array.from({ length: 7 }, (_, i) => (
            <text
              key={i}
              x={x(i * 1000)}
              y="173"
              textAnchor={i === 6 ? 'end' : i === 0 ? 'start' : 'middle'}
              fill="#9ebcaf"
              fontSize="13"
              fontFamily="monospace"
            >
              {i}s
            </text>
          ))}
      </svg>
      {finding && (
        <div className="plate-highlight-label">
          <span />
          Highlighted: {finding.label}
        </div>
      )}
    </div>
  );
}
