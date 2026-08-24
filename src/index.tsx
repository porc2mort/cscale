import React, { useState } from 'react';
import { Widget } from '@typeform/embed-react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function LogoIcon({ variant }: { variant: 'dark' | 'white' }) {
  const arcColor = variant === 'dark' ? 'var(--navy)' : 'var(--white)';
  return (
    <svg viewBox="0 0 120 120" style={{ display: 'block', width: '100%', height: '100%' }}>
      <path d="M 87.05 94.18 A 42 42 0 1 1 87.05 29.82" fill="none" stroke={arcColor} strokeWidth="11" strokeLinecap="round" />
      <rect x="33.5" y="66" width="11" height="20" rx="5" fill="var(--green)" opacity="0.55" />
      <rect x="51.5" y="54" width="11" height="32" rx="5" fill="var(--green)" opacity="0.78" />
      <rect x="69.5" y="42" width="11" height="44" rx="5" fill="var(--green)" />
    </svg>
  );
}

function Logo({ variant, fs }: { variant: 'dark' | 'white'; fs: number }) {
  return (
    <div className="logo" style={{ '--fs': `${fs}px` } as React.CSSProperties}>
      <div className="logo-row">
        <div
          className="logo-icon-wrap"
          style={{
            width: `calc(var(--fs) * 0.909664)`,
            height: `calc(var(--fs) * 0.909664)`,
            marginTop: `calc(var(--fs) * 0.027252)`,
            marginRight: `calc(var(--fs) * -0.229373)`,
            flexShrink: 0,
          }}
        >
          <LogoIcon variant={variant} />
        </div>
        <div className={`logo-word ${variant === 'dark' ? 'logo-navy' : 'logo-white'}`}>
          S<span className="logo-green">cale</span>
        </div>
      </div>
    </div>
  );
}

type Category = { name: string; value: number };
type ZoneKey = 'red' | 'orange' | 'yellow' | 'green';
type ZoneData = {
  score: number;
  label: string;
  color: string;
  tint: string;
  headline: string;
  paragraph: string;
  cta: string;
  categories: Category[];
};

const ZONES: Record<ZoneKey, ZoneData> = {
  red: {
    score: 22,
    label: 'Red zone',
    color: '#C0483D',
    tint: '#F8EAE8',
    headline: "You're running Customer Success on hope.",
    paragraph:
      "There's no health scoring, onboarding is inconsistent, and renewals get decided in hallway conversations, not data. Small fixes won't move this number - you need the full Diagnostic and Build before a churn you didn't see coming costs you a renewal.",
    cta: 'Book a call this week',
    categories: [
      { name: 'Onboarding', value: 28 },
      { name: 'Adoption', value: 22 },
      { name: 'Satisfaction', value: 30 },
      { name: 'Retention', value: 15 },
      { name: 'Expansion', value: 20 },
      { name: 'GTM Strategy', value: 12 },
      { name: 'Cross-Team Alignment', value: 25 },
    ],
  },
  orange: {
    score: 45,
    label: 'Orange zone',
    color: '#C97A2E',
    tint: '#FBF0E3',
    headline: "The basics exist. The system doesn't - yet.",
    paragraph:
      "Someone owns onboarding, but there's no health score behind it, and expansion is left to chance rather than a process. You have real foundations to build on, just not yet a system you could hand to a new hire.",
    cta: 'Book a 30-minute call',
    categories: [
      { name: 'Onboarding', value: 55 },
      { name: 'Adoption', value: 48 },
      { name: 'Satisfaction', value: 52 },
      { name: 'Retention', value: 35 },
      { name: 'Expansion', value: 38 },
      { name: 'GTM Strategy', value: 30 },
      { name: 'Cross-Team Alignment', value: 50 },
    ],
  },
  yellow: {
    score: 62,
    label: 'Yellow zone',
    color: '#B6912B',
    tint: '#FAF4E1',
    headline: "You're doing more right than wrong.",
    paragraph:
      "CS runs, most of the time, on people who know what they're doing - but it depends on them, not on a system. A couple of categories are dragging the average down. The Build closes exactly those gaps without you starting from zero.",
    cta: 'See what the Build fixes',
    categories: [
      { name: 'Onboarding', value: 76 },
      { name: 'Adoption', value: 62 },
      { name: 'Satisfaction', value: 70 },
      { name: 'Retention', value: 47 },
      { name: 'Expansion', value: 54 },
      { name: 'GTM Strategy', value: 56 },
      { name: 'Cross-Team Alignment', value: 74 },
    ],
  },
  green: {
    score: 86,
    label: 'Green zone',
    color: '#1F8F6F',
    tint: '#E7F4EF',
    headline: "You've built what most startups still hire for.",
    paragraph:
      "Most startups this size don't get here without a dedicated CS Ops hire. The real risk now isn't building the system, it's protecting it as you scale - new segments, headcount turnover, more customers stretching the same process.",
    cta: 'See what Ongoing Support looks like',
    categories: [
      { name: 'Onboarding', value: 92 },
      { name: 'Adoption', value: 85 },
      { name: 'Satisfaction', value: 88 },
      { name: 'Retention', value: 78 },
      { name: 'Expansion', value: 80 },
      { name: 'GTM Strategy', value: 82 },
      { name: 'Cross-Team Alignment', value: 90 },
    ],
  },
};

const ZONE_ORDER: ZoneKey[] = ['red', 'orange', 'yellow', 'green'];

const RADAR_RINGS = [
  '150.00,123.75 170.52,133.63 175.59,155.84 161.39,173.65 138.61,173.65 124.41,155.84 129.48,133.63',
  '150.00,97.50 191.04,117.27 201.19,161.68 172.78,197.30 127.22,197.30 98.81,161.68 108.96,117.27',
  '150.00,71.25 211.57,100.90 226.78,167.52 184.17,220.95 115.83,220.95 73.22,167.52 88.43,100.90',
  '150,45 232.09,84.51 252.39,173.37 195.56,244.60 104.44,244.60 47.61,173.37 67.91,84.51',
];
const RADAR_SPOKES: [string, string][] = [
  ['150', '45'],
  ['232.09', '84.51'],
  ['252.39', '173.37'],
  ['195.56', '244.60'],
  ['104.44', '244.60'],
  ['47.61', '173.37'],
  ['67.91', '84.51'],
];

const RADAR_LABEL_POS = [
  { left: '50.00%', top: '7.33%' },
  { left: '83.36%', top: '23.40%' },
  { left: '91.60%', top: '59.49%' },
  { left: '68.51%', top: '88.44%' },
  { left: '31.49%', top: '88.44%' },
  { left: '8.40%', top: '59.49%' },
  { left: '16.64%', top: '23.40%' },
];

const toRad = (d: number) => (d * Math.PI) / 180;

function gaugeFillPath(score: number): string {
  const gcx = 140;
  const gcy = 150;
  const gr = 110;
  const gaugePoint = (angle: number) => ({
    x: gcx + gr * Math.cos(toRad(angle)),
    y: gcy - gr * Math.sin(toRad(angle)),
  });
  const startA = 180;
  const endA = 180 - (score / 100) * 180;
  const gs = gaugePoint(startA);
  const ge = gaugePoint(endA);
  const largeArc = startA - endA > 180 ? 1 : 0;
  return `M${gs.x.toFixed(2)},${gs.y.toFixed(2)} A${gr},${gr} 0 ${largeArc} 1 ${ge.x.toFixed(2)},${ge.y.toFixed(2)}`;
}

function radarPoints(categories: Category[]): string {
  const rcx = 150;
  const rcy = 150;
  const rmax = 105;
  const n = categories.length;
  const radarPoint = (r: number, i: number) => {
    const a = -90 + i * (360 / n);
    const rad = toRad(a);
    return { x: rcx + r * Math.cos(rad), y: rcy + r * Math.sin(rad) };
  };
  return categories
    .map((c, i) => {
      const p = radarPoint(rmax * (c.value / 100), i);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(' ');
}

function LiveTypeform() {
  const navigate = useNavigate();
  return (
    <Widget
      id={import.meta.env.VITE_TYPEFORM_FORM_ID || 'Hq9MVJgW'}
      className="typeform-live"
      onSubmit={({ responseId }) => navigate(`/results?rid=${encodeURIComponent(responseId.trim())}`)}
    />
  );
}

export default function CScaleResultsPage() {
  const [zone, setZone] = useState<ZoneKey>('yellow');
  const z = ZONES[zone];

  const sorted = z.categories.slice().sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100%' }}>
      <div style={{ background: '#FCFBF8', borderBottom: '1px dashed var(--border)' }}>
        <div className="wrap proto-bar">
          <div className="proto-bar-label">Prototype - click to preview each result; category scores are illustrative sample data</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {ZONE_ORDER.map((key) => {
              const zd = ZONES[key];
              const isActive = key === zone;
              return (
                <button
                  key={key}
                  className="zone-pill"
                  type="button"
                  onClick={() => setZone(key)}
                  style={
                    isActive
                      ? { background: zd.color, color: '#FFFFFF', borderColor: zd.color }
                      : { background: 'transparent', color: 'var(--grey)' }
                  }
                >
                  <span className="zone-pill-dot" style={{ background: zd.color }} />
                  {zd.label.replace(' zone', '')}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap" style={{ display: 'flex', alignItems: 'center', height: 76 }}>
          <Logo variant="dark" fs={26} />
        </div>
      </div>

      <div className="wrap result-hero">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div className="kicker">Your result</div>
          <h1 style={{ fontSize: 38, lineHeight: 1.18 }}>{z.headline}</h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--grey)', maxWidth: '56ch' }}>{z.paragraph}</p>
          <div style={{ marginTop: 6 }}>
            <div className="btn btn-primary">{z.cta}</div>
          </div>
        </div>

        <div className="card gauge-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey)' }}>Health &amp; Efficiency Score</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-deep)', background: 'var(--green-light)', padding: '5px 10px', borderRadius: 6 }}>
              SAMPLE RESULT
            </div>
          </div>
          <div className="gauge-chart">
            <svg viewBox="0 0 280 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <path d="M30,150 A110,110 0 1 1 250,150" fill="none" stroke="var(--border)" strokeWidth="22" strokeLinecap="round" />
              <path d={gaugeFillPath(z.score)} fill="none" stroke={z.color} strokeWidth="22" strokeLinecap="round" />
            </svg>
            <div className="gauge-score">{z.score}</div>
            <div className="gauge-outof">out of 100</div>
          </div>
          <div className="zone-badge" style={{ background: z.tint, color: z.color }}>
            {z.label}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
        <div className="wrap radar-section">
          <div className="card">
            <h3 style={{ fontSize: 17, marginBottom: 4 }}>Your 7-category breakdown</h3>
            <p style={{ fontSize: 14, color: 'var(--grey)', marginBottom: 8 }}>
              Each axis is one category of the Health &amp; Efficiency Score, out of 100.
            </p>
            <div className="radar-chart">
              <svg viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {RADAR_RINGS.map((points, i) => (
                  <polygon key={i} points={points} fill="none" stroke="var(--border)" strokeWidth="1" />
                ))}
                {RADAR_SPOKES.map(([x, y], i) => (
                  <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />
                ))}
                <polygon
                  points={radarPoints(z.categories)}
                  fill={z.color}
                  fillOpacity="0.16"
                  stroke={z.color}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
              </svg>
              {z.categories.map((c, i) => (
                <div key={c.name} className="radar-label" style={RADAR_LABEL_POS[i]}>
                  {c.name} - {c.value}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="kicker" style={{ marginBottom: 10 }}>Strongest area</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 20 }}>{strongest.name}</h3>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-light)' }}>{strongest.value}/100</div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--grey)' }}>
                This is the category doing the most to protect your score right now - keep it that way as you grow.
              </p>
            </div>
            <div className="card">
              <div className="kicker" style={{ marginBottom: 10 }}>Biggest opportunity</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                <h3 style={{ fontSize: 20 }}>{weakest.name}</h3>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--grey-light)' }}>{weakest.value}/100</div>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--grey)' }}>
                The single fastest place to move your overall score - this is usually where the Diagnostic starts.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--paper)', borderTop: '1px solid var(--border)' }}>
        <section id="health-check" className="wrap health-check-section">
          <div className="section-heading" style={{ marginBottom: 20 }}>
            <div className="kicker">Retake assessment</div>
            <h2>Run the Health Check again.</h2>
          </div>
          <LiveTypeform />
        </section>
      </div>

      <div style={{ background: 'var(--navy)' }}>
        <div className="wrap" style={{ paddingTop: 40, paddingBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Logo variant="white" fs={22} />
          <p style={{ fontSize: 13, color: 'var(--grey-light)' }}>Copyright 2026 CScale. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}