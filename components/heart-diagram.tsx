/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Functional inline SVG needs an image role for its accessible name. */
import type { Phase } from '@/lib/simulation';

// Original functional diagram: schematic geometry, not reconstructed anatomy.
export function HeartDiagram({
  phase,
  labels,
  progress,
}: {
  phase: Phase;
  labels: boolean;
  progress: number;
}) {
  const atrial = phase === 'atrial',
    ventricular = phase === 'ventricular',
    recovery = phase === 'repolarisation',
    av = phase === 'av' || phase === 'blocked';
  const mint = '#80e1d0',
    coral = '#f5a58d';
  return (
    <svg
      viewBox="0 0 680 480"
      className="heart-diagram"
      role="img"
      aria-labelledby="heart-title heart-desc"
    >
      <title id="heart-title">Cardiac conduction pathway</title>
      <desc id="heart-desc">
        Simplified anterior cutaway. Patient’s right is on the left of this
        diagram. The SA node connects through the atria to the AV node, His
        bundle, bundle branches and Purkinje network. Current phase: {phase}.
      </desc>
      <defs>
        <linearGradient id="rightChamber" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#1e4a50" />
          <stop offset="1" stopColor="#102a34" />
        </linearGradient>
        <linearGradient id="leftChamber" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#543a42" />
          <stop offset="1" stopColor="#251f2c" />
        </linearGradient>
        <radialGradient id="heartHalo">
          <stop stopColor="#33786b" stopOpacity=".16" />
          <stop offset="1" stopColor="#33786b" stopOpacity="0" />
        </radialGradient>
        <filter id="signalGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <ellipse cx="341" cy="259" rx="240" ry="210" fill="url(#heartHalo)" />
      <g fill="none" stroke="#274047" strokeWidth="1">
        <ellipse cx="340" cy="260" rx="202" ry="183" strokeDasharray="2 8" />
        <path d="M112 260H155M525 260H568M340 50V82M340 432V457" />
        <circle cx="340" cy="260" r="215" opacity=".25" />
      </g>
      <g strokeWidth="2">
        <path
          d="M260 155L250 85Q248 65 272 63L285 149"
          fill="url(#rightChamber)"
          stroke="#447179"
        />
        <path
          d="M350 161L345 101Q340 64 376 61Q415 58 422 92L425 129"
          fill="none"
          stroke="#754951"
          strokeWidth="27"
        />
        <path
          d="M350 161L345 101Q340 64 376 61Q415 58 422 92L425 129"
          fill="none"
          stroke="#342b36"
          strokeWidth="20"
        />
        <path
          d="M331 169C304 128 256 122 225 147C189 176 194 224 214 253L316 261Q350 216 331 169Z"
          fill="url(#rightChamber)"
          stroke={atrial ? mint : '#487079'}
        />
        <path
          d="M343 173C371 130 412 128 442 153C470 176 473 213 449 246L355 263Q326 215 343 173Z"
          fill="url(#leftChamber)"
          stroke={atrial ? mint : '#79515c'}
        />
        <path
          d="M214 253C210 306 254 362 349 416C328 354 326 301 320 263Q269 231 214 253Z"
          fill="url(#rightChamber)"
          stroke={ventricular ? mint : recovery ? coral : '#487079'}
        />
        <path
          d="M351 263C374 244 423 233 449 246C472 306 451 380 349 416C337 374 329 311 351 263Z"
          fill="url(#leftChamber)"
          stroke={ventricular ? mint : recovery ? coral : '#79515c'}
        />
        <path
          d="M326 162Q343 219 335 256Q316 318 349 416"
          fill="none"
          stroke="#7c6568"
          strokeWidth="10"
          opacity=".55"
        />
        <path
          d="M217 250Q244 241 260 257L278 246L308 264M357 261L386 247L405 258Q431 242 448 249"
          fill="none"
          stroke="#a88680"
          strokeWidth="3"
        />
      </g>
      <g
        fill="none"
        stroke={atrial ? mint : '#4b8a84'}
        strokeWidth="2"
        strokeDasharray="5 5"
        opacity={atrial ? 1 : 0.5}
      >
        <path d="M243 159Q271 177 282 212L316 235" />
        <path d="M243 159Q304 130 361 161Q407 181 423 205" />
        <path d="M243 159Q217 189 246 222L316 235" />
      </g>
      <g
        fill="none"
        stroke={ventricular ? mint : '#559b91'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={ventricular ? 1 : 0.65}
      >
        <path d="M316 235L336 276L351 339" />
        <path d="M337 278Q296 299 290 335Q279 353 264 322L239 276" />
        <path d="M342 297L357 372Q379 386 397 353L426 275" />
        <path d="M290 335L257 297M290 335L305 362M278 341L256 327M361 373L389 324M391 361L415 329M398 350L416 299" />
      </g>
      {ventricular && (
        <g
          fill="none"
          stroke={mint}
          strokeWidth="9"
          opacity=".5"
          filter="url(#signalGlow)"
        >
          <path d="M316 235L336 276L351 339M337 278Q296 299 290 335Q279 353 264 322L239 276M342 297L357 372Q379 386 397 353L426 275" />
        </g>
      )}
      <g>
        <circle
          cx="243"
          cy="159"
          r={phase === 'sinus' ? 15 : 11}
          fill={mint}
          opacity=".16"
        />
        <circle cx="243" cy="159" r="6" fill={atrial ? mint : '#64b8aa'} />
        <circle
          cx="316"
          cy="235"
          r={av ? 15 : 10}
          fill={phase === 'blocked' ? coral : mint}
          opacity=".18"
        />
        <circle
          cx="316"
          cy="235"
          r="6"
          fill={phase === 'blocked' ? coral : av ? mint : '#6ab4aa'}
        />
        {atrial && (
          <circle
            cx={243 + 73 * progress}
            cy={159 + 76 * progress}
            r="4"
            fill="#f3fff8"
          />
        )}
      </g>
      {labels && (
        <g
          className="diagram-labels"
          fontFamily="Arial,sans-serif"
          fontSize="13"
          fill="#b6c8cb"
        >
          <g fill="none" stroke="#668086" strokeWidth="1">
            <path d="M237 158H157L141 142H73" />
            <path d="M310 235H173L147 222H73" />
            <path d="M331 268H172L148 291H73" />
            <path d="M348 311H479L499 297H603" />
            <path d="M399 354H471L497 382H603" />
          </g>
          <text x="73" y="133" fill={mint}>
            SA node
          </text>
          <text x="73" y="214" fill={av ? mint : '#b6c8cb'}>
            AV node
          </text>
          <text x="73" y="311">
            His bundle
          </text>
          <text x="603" y="288" textAnchor="end">
            Bundle branches
          </text>
          <text x="603" y="401" textAnchor="end">
            Purkinje network
          </text>
          <text x="261" y="192" fill="#96babc" fontSize="12">
            RA
          </text>
          <text x="390" y="193" fill="#ba9da5" fontSize="12">
            LA
          </text>
          <text x="258" y="291" fill="#96babc" fontSize="12">
            RV
          </text>
          <text x="389" y="292" fill="#ba9da5" fontSize="12">
            LV
          </text>
        </g>
      )}
      <text
        x="340"
        y="463"
        textAnchor="middle"
        fill="#8da3aa"
        fontSize="12"
        letterSpacing="2"
      >
        ELECTRICAL ACTIVITY · NOT CONTRACTION
      </text>
    </svg>
  );
}
