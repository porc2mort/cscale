import React from 'react';
import { Widget } from '@typeform/embed-react';
import { useNavigate } from 'react-router-dom';
import { CALENDLY_URL, openCalendly } from './lib/calendly';
// @ts-ignore: side-effect CSS import handled by bundler
import './index.css';

/* ============================================================
   Icons — small inline SVGs, no icon library dependency
   ============================================================ */

function IconTrendUp() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 16l5-6 4 4 8-9" />
            <path d="M15 5h5v5" />
        </svg>
    );
}

function IconClock() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4l3 2" />
        </svg>
    );
}

function IconBarsAsc() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19V10M11 19V4M18 19v-7" />
        </svg>
    );
}

function IconArrow() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h11M12 5l7 7-7 7" />
        </svg>
    );
}

function IconBarsSmall() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19V13M11 19V8M18 19v-4" />
        </svg>
    );
}

function IconChat() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>
    );
}

function IconShield() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l7 4v6c0 5-3.4 7.8-7 9-3.6-1.2-7-4-7-9V6l7-4z" />
        </svg>
    );
}

function IconExpand() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
        </svg>
    );
}

function IconTarget() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8.5" />
            <circle cx="12" cy="12" r="4.5" />
            <circle cx="12" cy="12" r="0.8" fill="var(--navy)" />
        </svg>
    );
}

function IconNodes() {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--navy)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="7" cy="7" r="3" />
            <circle cx="17" cy="7" r="3" />
            <circle cx="12" cy="17" r="3" />
            <path d="M9.3 8.6L10.5 15M14.7 8.6L13.5 15M9.7 6h4.6" />
        </svg>
    );
}

function IconCheck() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

/* ============================================================
   Logo — the "C" icon stands in for the letter, glued to
   "Scale" so it reads as one word. See index.css for the
   pixel-aligned --fs sizing system.
   ============================================================ */

function LogoIcon({ variant }: { variant: 'dark' | 'white' }) {
    const arcColor = variant === 'dark' ? 'var(--navy)' : 'var(--white)';
    return (
        <svg viewBox="0 0 120 120" className="logo-icon" style={{ display: 'block', width: '100%', height: '100%' }}>
            <path d="M 87.05 94.18 A 42 42 0 1 1 87.05 29.82" fill="none" stroke={arcColor} strokeWidth="11" strokeLinecap="round" />
            <rect x="33.5" y="66" width="11" height="20" rx="5" fill="var(--green)" opacity="0.55" />
            <rect x="51.5" y="54" width="11" height="32" rx="5" fill="var(--green)" opacity="0.78" />
            <rect x="69.5" y="42" width="11" height="44" rx="5" fill="var(--green)" />
        </svg>
    );
}

function Logo({ variant, fs, tagline }: { variant: 'dark' | 'white'; fs: number; tagline?: boolean | string }) {
    return (
        <div className="logo" style={{ '--fs': `${fs}px` } as React.CSSProperties}>
            <div className="logo-row">
                <div className="logo-icon-wrap" style={{
                    width: `calc(var(--fs) * 0.909664)`,
                    height: `calc(var(--fs) * 0.909664)`,
                    marginTop: `calc(var(--fs) * 0.027252)`,
                    marginRight: `calc(var(--fs) * -0.229373)`,
                    flexShrink: 0,
                }}>
                    <LogoIcon variant={variant} />
                </div>
                <div className={`logo-word ${variant === 'dark' ? 'logo-navy' : 'logo-white'}`}>
                    S<span className="logo-green">cale</span>
                </div>
            </div>
            {tagline && <div className="logo-tagline">{typeof tagline === 'string' ? tagline : 'Customer Success, built to scale'}</div>}
        </div>
    );
}

/* ============================================================
   Content
   ============================================================ */

type ScoreRow = { label: string; value: number };

const scoreRows: ScoreRow[] = [
    { label: 'Onboarding', value: 76 },
    { label: 'Adoption', value: 62 },
    { label: 'Satisfaction', value: 70 },
    { label: 'Retention', value: 47 },
    { label: 'Expansion', value: 54 },
    { label: 'GTM Strategy', value: 56 },
    { label: 'Cross-Team Alignment', value: 74 },
];

const toRad = (d: number) => (d * Math.PI) / 180;

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

function radarPoints(rows: ScoreRow[]) {
    const rcx = 150;
    const rcy = 150;
    const rmax = 105;
    const n = rows.length;
    return rows
        .map((row, i) => {
            const a = -90 + i * (360 / n);
            const rad = toRad(a);
            const r = rmax * (row.value / 100);
            const x = rcx + r * Math.cos(rad);
            const y = rcy + r * Math.sin(rad);
            return `${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ');
}

type MethodCategory = { name: string; description: string; icon: React.ReactNode };

const methodCategories: MethodCategory[] = [
    { name: 'Onboarding', description: 'Time-to-value, not just a checklist.', icon: <IconArrow /> },
    { name: 'Adoption', description: 'Usage that actually turns into business value.', icon: <IconBarsSmall /> },
    { name: 'Satisfaction', description: 'Signals you act on, not just track.', icon: <IconChat /> },
    { name: 'Retention', description: 'The number that protects everything else.', icon: <IconShield /> },
    { name: 'Expansion', description: 'Growth from the customers you already have.', icon: <IconExpand /> },
    { name: 'GTM Strategy', description: 'The root cause most teams miss.', icon: <IconTarget /> },
    { name: 'Cross-Team Alignment', description: 'Sales, CS, and Product, speaking the same language.', icon: <IconNodes /> },
];

type OfferStage = {
    step: number;
    title: string;
    duration: string;
    description: string;
    price: string;
    showPrice?: boolean;
    featured?: boolean;
};

const offerStages: OfferStage[] = [
    {
        step: 1,
        title: 'Diagnostic',
        duration: '2–3 weeks',
        description: 'Get your Health & Efficiency Score, a full breakdown across all 7 categories, and a top-5 action plan ranked by impact.',
        price: 'Starting at $5,000 CAD',
        showPrice: true,
    },
    {
        step: 2,
        title: 'Build',
        duration: '4–6 weeks',
        description: 'Get an operational health score, retention playbooks, dashboards, and an onboarding process — live in your CRM, not on slides.',
        price: 'Starting at $13,000 CAD',
        featured: true,
    },
    {
        step: 3,
        title: 'Scale',
        duration: 'Monthly retainer',
        description: 'A fractional Head of CS Ops keeps the system we built from breaking as you grow — a few days a month, until it\'s ready to run on its own.',
        price: 'Starting at $3,500 CAD / mo',
    },
];

const whoPoints: string[] = [
    'No Head of CS yet — or one who started in the last few months.',
    "You sense a retention or expansion problem, but you can't put a number on it.",
    "You'd rather build the system now than rebuild it after a bad quarter.",
];

type FaqItem = { q: string; a: string };

const faqItems: FaqItem[] = [
    { q: "Don't we need a CRM in place first?", a: 'No — setting that up, or fixing what you already have, is part of the Build.' },
    { q: 'How much time does this take on our side?', a: "Plan for a few hours across the Diagnostic, mostly interviews. The Build needs more from your team — we'll scope exact hours together before starting." },
    { q: 'What happens after Ongoing Support ends?', a: "Either your team runs it independently, or a newly hired Head of CS inherits a system that's already built — not a blank page." },
];

function LiveTypeform() {
    const navigate = useNavigate();

    const formId = (import.meta as ImportMeta & { env?: { VITE_TYPEFORM_FORM_ID?: string } }).env?.VITE_TYPEFORM_FORM_ID || 'Hq9MVJgW';

    return <Widget id={formId} className="typeform-live" onSubmit={({ responseId }) => navigate(`/results?rid=${encodeURIComponent(responseId.trim())}`)} />;
}

function HealthCheckSection({ started, onStart }: { started: boolean; onStart: () => void }) {
    return (
        <section id="health-check" className="wrap health-check-section">
            <div className="section-heading">
                <div className="kicker">Free health check</div>
                <h2>Find your Health &amp; Efficiency Score.</h2>
            </div>
            {started ? (
                <LiveTypeform />
            ) : (
                <div className="typeform-welcome">
                    <div className="typeform-welcome-inner">
                        <Logo variant="white" fs={44} tagline />
                        <h2>Find out your score before your next board meeting.</h2>
                        <p>Free, 15 questions, five minutes, no credit card, no sales call required to see your result.</p>
                        <button type="button" className="btn btn-primary-onDark" style={{ marginTop: 8 }} onClick={onStart}>
                            Take the free Health Check
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

/* ============================================================
   Page
   ============================================================ */

export default function CScaleLandingPage() {
    const [healthCheckStarted, setHealthCheckStarted] = React.useState(false);

    return (
        <div>
            {/* ============ HEADER ============ */}
            <header className="header">
                <div className="wrap header-inner">
                    <Logo variant="dark" fs={58} />
                    <nav className="nav">
                        <a href="#method">Framework</a>
                        <a href="#offer">How it works</a>
                        <a href="#who">Who it's for</a>
                        <a href="#faq">FAQ</a>
                    </nav>
                </div>
            </header>

            <div className="header-subline">
                <div className="wrap">Customer Success Operations, built to scale</div>
            </div>

            {/* ============ HERO ============ */}
            <section className="wrap hero">
                <div className="hero-copy">
                    <h1>
                        Customer Success isn't just an hire.
                        <br />
                        It's an entire system.
                    </h1>
                    <p>
                        CScale diagnoses, builds, and runs the CS Ops foundations for growing SaaS startups without <br>
                        </br>the six
                        months and the salary of a senior hire.
                    </p>
                    <div className="hero-ctas">
                        <a className="btn btn-primary" href="#health-check">Take the free health check</a>
                        <div className="btn btn-secondary">Start the full diagnostic</div>
                    </div>
                    <div className="hero-facts">
                        <div className="hero-fact">
                            <IconCheck />
                            <p>2–3 weeks to your first Diagnostic</p>
                        </div>
                        <div className="hero-fact">
                            <IconCheck />
                            <p>7 categories scored, not a guess</p>
                        </div>
                        <div className="hero-fact">
                            <IconCheck />
                            <p>No six-month contract to start</p>
                        </div>
                    </div>
                </div>

                <div className="card score-card">
                    <div className="score-card-head">
                        <div className="score-card-head-label">Health &amp; Efficiency Score</div>
                        <div className="score-card-badge">SAMPLE RESULT</div>
                    </div>
                    <div className="score-value-row">
                        <div className="score-value">62</div>
                        <div className="score-value-max">/ 100</div>
                        <div className="score-zone">Orange zone</div>
                    </div>
                    <div className="score-divider" />
                    <div className="radar-chart">
                        <svg viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                            {RADAR_RINGS.map((points, i) => (
                                <polygon key={i} points={points} fill="none" stroke="var(--border)" strokeWidth="1" />
                            ))}
                            {RADAR_SPOKES.map(([x, y], i) => (
                                <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />
                            ))}
                            <polygon
                                points={radarPoints(scoreRows)}
                                fill="#B8860B"
                                fillOpacity="0.16"
                                stroke="#B8860B"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {scoreRows.map((row, i) => (
                            <div key={row.label} className="radar-label" style={RADAR_LABEL_POS[i]}>
                                {row.label} - {row.value}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <HealthCheckSection started={healthCheckStarted} onStart={() => setHealthCheckStarted(true)} />

            {/* ============ PROBLEM ============ */}
            <section className="problem-section">
                <div className="wrap section-pad">
                    <div className="section-heading">
                        <div className="kicker">Sound familiar?</div>
                        <h2>You can feel the problem. You just can't see it yet.</h2>
                    </div>
                    <div className="problem-grid">
                        <div className="card problem-card">
                            <IconTrendUp />
                            <h3>Customers are churning and you don't know why</h3>
                            <p>Without a health score, every loss feels like a surprise — even when the signs were there weeks earlier.</p>
                        </div>
                        <div className="card problem-card">
                            <IconClock />
                            <h3>CS runs on instinct, not a system</h3>
                            <p>One person — maybe you — is holding onboarding, support, and renewals together with spreadsheets and memory.</p>
                        </div>
                        <div className="card problem-card">
                            <IconBarsAsc />
                            <h3>Investors are starting to ask about NRR</h3>
                            <p>And you don't have a confident number to give them before the next round.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ METHOD ============ */}
            <section id="method" className="wrap method-section">
                <div className="section-heading">
                    <div className="kicker">The framework</div>
                    <h2 style={{ marginBottom: 16 }}>The Health &amp; Efficiency Score</h2>
                    <p>50 weighted questions across 7 categories turn "something feels off" into a number — and a plan.</p>
                </div>
                <div className="method-grid">
                    {methodCategories.map((cat) => (
                        <div className="card method-card" key={cat.name}>
                            {cat.icon}
                            <h3>{cat.name}</h3>
                            <p>{cat.description}</p>
                        </div>
                    ))}
                    <div className="method-summary">
                        <div className="method-summary-title">100 points total.</div>
                        <div className="method-summary-copy">Weighted by what actually protects ARR at your stage — not equally split.</div>
                    </div>
                </div>
            </section>

            {/* ============ OFFER ============ */}
            <section id="offer" className="offer-section">
                <div className="wrap section-pad">
                    <div className="section-heading">
                        <div className="kicker">How we work together</div>
                        <h2>Three stages. No six-month commitment to find out if it's working.</h2>
                    </div>
                    <div className="offer-grid">
                        {offerStages.map((stage) => (
                            <div className={`card offer-card ${stage.featured ? 'featured' : ''}`} key={stage.step}>
                                <div className={`offer-step ${stage.featured ? 'offer-step-featured' : 'offer-step-default'}`}>
                                    {stage.step}
                                </div>
                                <h3>{stage.title}</h3>
                                <div className="offer-duration">{stage.duration}</div>
                                <p className="offer-desc">{stage.description}</p>
                                {stage.showPrice && <div className="offer-price">{stage.price}</div>}
                                <a
                                    className={`btn btn-sm offer-cta ${stage.featured ? 'btn-primary-onDark' : 'btn-secondary'}`}
                                    href={CALENDLY_URL}
                                    onClick={openCalendly}
                                >
                                    Request a quote
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ WHO IT'S FOR ============ */}
            <section id="who" className="wrap who-section">
                <div>
                    <div className="kicker" style={{ marginBottom: 14 }}>Is this you?</div>
                    <h2>Built for SaaS startups between $1M and $10M</h2>
                </div>
                <div className="who-list">
                    {whoPoints.map((point) => (
                        <div className="who-item" key={point}>
                            <IconCheck />
                            <p>{point}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============ PROOF ============ */}
            {/* <section className="proof-section">
                <div className="wrap proof-grid">
                    <div className="card proof-card">
                        <div className="proof-stat">[+X points NRR]</div>
                        <p className="proof-stat-caption">
                            [Placeholder — swap in your first client's real result once you have one, e.g. "+12 points of NRR in 4 months."]
                        </p>
                    </div>
                    <div className="card proof-card">
                        <p className="proof-quote">"[A one-sentence client quote goes here once you have your first engagement.]"</p>
                        <p className="proof-quote-attr">[Name, Title — Company]</p>
                    </div>
                </div>
                <div className="wrap proof-bio-wrap">
                    <div className="card proof-bio">
                        <div className="proof-avatar" />
                        <div>
                            <div className="proof-bio-name">[Laurie Martin — Founder, CScale]</div>
                            <p className="proof-bio-desc">
                                [One or two sentences on your Customer Success / RevOps background go here — specific roles, companies, or results, not a generic bio.]
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* ============ CTA BANNER ============ */}
            <section className="cta-banner">
                <div className="wrap cta-banner-inner">
                    <Logo variant="white" fs={44} tagline />
                    <h2>Find out your score before your next board meeting.</h2>
                    <p>Free, 15 questions, five minutes, no credit card, no sales call required to see your result.</p>
                    <a
                        className="btn btn-primary-onDark"
                        href="#health-check"
                        style={{ marginTop: 8 }}
                        onClick={() => setHealthCheckStarted(true)}
                    >
                        Take the free Health Check
                    </a>
                </div>
            </section>

            {/* ============ FAQ ============ */}
            <section id="faq" className="wrap faq-section">
                <div className="section-heading" style={{ maxWidth: 640, marginBottom: 48 }}>
                    <div className="kicker">Questions</div>
                    <h2>Before you book a call</h2>
                </div>
                <div className="faq-list">
                    {faqItems.map((item) => (
                        <div className="faq-item" key={item.q}>
                            <h3>{item.q}</h3>
                            <p>{item.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============ FOOTER ============ */}
            <footer className="footer">
                <div className="wrap footer-top">
                    <Logo variant="white" fs={32} />
                    <div className="footer-links">
                        <a href="#method">Framework</a>
                        <a href="#offer">How it works</a>
                        <a href="#faq">FAQ</a>
                        <a href="#">LinkedIn</a>
                    </div>
                </div>
                <div className="wrap footer-bottom">
                    <div className="footer-rule" />
                    <p className="footer-copy">© 2026 CScale. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
