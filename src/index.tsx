import React from 'react';
import { Widget } from '@typeform/embed-react';
import { useNavigate } from 'react-router-dom';
import { CALENDLY_URL, openCalendly } from './lib/calendly';
// @ts-ignore: no type declarations for this plain JS helper
import { useRadarPush, pushRadarCoords, radarCoordsToPoints } from './lib/radar';
// @ts-ignore: no type declarations for this plain JS helper
import { useLanguage } from './lib/i18n.jsx';
// @ts-ignore: no type declarations for this plain JS helper
import LanguageSwitcher from './components/LanguageSwitcher.jsx';
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

function IconTrendDown() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8l5 6 4-4 8 9" />
            <path d="M15 19h5v-5" />
        </svg>
    );
}

function IconScatter() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="7" r="1.6" />
            <circle cx="17" cy="6" r="1.6" />
            <circle cx="9" cy="17" r="1.6" />
            <circle cx="18" cy="15" r="1.6" />
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

function IconGauge() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 15a8 8 0 1116 0" />
            <path d="M12 15l4-5" />
            <path d="M12 15h.01" />
        </svg>
    );
}

function IconRepeat() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-deep)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12a8 8 0 0113.66-5.66L20 8" />
            <path d="M20 4v4h-4" />
            <path d="M20 12a8 8 0 01-13.66 5.66L4 16" />
            <path d="M4 20v-4h4" />
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
    const { t } = useLanguage();
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
            {tagline && <div className="logo-tagline">{typeof tagline === 'string' ? tagline : t('logo.tagline')}</div>}
        </div>
    );
}

/* ============================================================
   Content
   ============================================================ */

type ScoreRow = { label: string; value: number };

const CATEGORY_KEYS = ['Onboarding', 'Adoption', 'Satisfaction', 'Retention', 'Expansion', 'GTM Strategy', 'Cross-Team Alignment'];

const CATEGORY_SCORE_VALUES: Record<string, number> = {
    Onboarding: 76,
    Adoption: 62,
    Satisfaction: 70,
    Retention: 47,
    Expansion: 54,
    'GTM Strategy': 56,
    'Cross-Team Alignment': 74,
};

const CATEGORY_ICONS = [IconArrow, IconBarsSmall, IconChat, IconShield, IconExpand, IconTarget, IconNodes];

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

function radarPointCoords(rows: ScoreRow[]) {
    const rcx = 150;
    const rcy = 150;
    const rmax = 105;
    const n = rows.length;
    return rows.map((row, i) => {
        const a = -90 + i * (360 / n);
        const rad = toRad(a);
        const r = rmax * (row.value / 100);
        return { x: rcx + r * Math.cos(rad), y: rcy + r * Math.sin(rad) };
    });
}

type ProblemCard = { icon: React.ReactNode; title: string; body: string };

const PROBLEM_CARD_ICONS = [IconTrendDown, IconScatter, IconBarsAsc, IconGauge, IconRepeat, IconTrendUp];

type MethodCategory = { name: string; description: string; icon: React.ReactNode };

type OfferStage = {
    step: number;
    title: string;
    duration: string;
    description: string;
    price: string;
    showPrice?: boolean;
    featured?: boolean;
};

const OFFER_STAGE_META = [
    { showPrice: true, featured: false },
    { showPrice: false, featured: true },
    { showPrice: false, featured: false },
];

type FaqItem = { q: string; a: string };

function LiveTypeform() {
    const navigate = useNavigate();

    const formId = (import.meta as ImportMeta & { env?: { VITE_TYPEFORM_FORM_ID?: string } }).env?.VITE_TYPEFORM_FORM_ID || 'Hq9MVJgW';

    return <Widget id={formId} className="typeform-live" onSubmit={({ responseId }) => navigate(`/results?rid=${encodeURIComponent(responseId.trim())}`)} />;
}

function HealthCheckSection({ started, onStart }: { started: boolean; onStart: () => void }) {
    const { t } = useLanguage();
    return (
        <section id="health-check" className="wrap health-check-section">
            <div className="section-heading">
                <div className="kicker">{t('healthCheck.kicker')}</div>
                <h2>{t('healthCheck.heading')}</h2>
            </div>
            {started ? (
                <LiveTypeform />
            ) : (
                <div className="typeform-welcome">
                    <div className="typeform-welcome-inner">
                        <Logo variant="white" fs={44} tagline />
                        <h2>{t('healthCheck.welcomeHeading')}</h2>
                        <p>{t('healthCheck.welcomeBody')}</p>
                        <button type="button" className="btn btn-primary-onDark" style={{ marginTop: 8 }} onClick={onStart}>
                            {t('healthCheck.cta')}
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

function ProblemCarousel({ cards }: { cards: ProblemCard[] }) {
    const { t } = useLanguage();
    const [index, setIndex] = React.useState(0);

    const goTo = (i: number) => setIndex((i + cards.length) % cards.length);

    return (
        <div className="problem-carousel">
            <div className="problem-carousel-track">
                {cards.map((card, i) => (
                    <div className="card problem-card" key={card.title} style={{ display: i === index ? undefined : 'none' }}>
                        {card.icon}
                        <h3>{card.title}</h3>
                        <p>{card.body}</p>
                    </div>
                ))}
            </div>
            <div className="problem-carousel-nav">
                <button type="button" className="problem-carousel-arrow problem-carousel-arrow--prev" aria-label={t('problem.prevAria')} onClick={() => goTo(index - 1)}>
                    <IconArrow />
                </button>
                <div className="problem-carousel-dots">
                    {cards.map((card, i) => (
                        <button
                            type="button"
                            key={card.title}
                            className={`problem-carousel-dot${i === index ? ' active' : ''}`}
                            aria-label={`${t('problem.goToAria')} ${i + 1}`}
                            aria-current={i === index}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>
                <button type="button" className="problem-carousel-arrow" aria-label={t('problem.nextAria')} onClick={() => goTo(index + 1)}>
                    <IconArrow />
                </button>
            </div>
        </div>
    );
}

/* ============================================================
   Page
   ============================================================ */

export default function CScaleLandingPage() {
    const { t } = useLanguage();
    const [healthCheckStarted, setHealthCheckStarted] = React.useState(false);
    const [activeRadarPoint, setActiveRadarPoint] = React.useState<number | null>(null);

    const categoryText = t('categories') as Record<string, { name: string; description: string }>;
    const scoreRows: ScoreRow[] = CATEGORY_KEYS.map((key) => ({
        label: categoryText[key].name,
        value: CATEGORY_SCORE_VALUES[key],
    }));
    const methodCategories: MethodCategory[] = CATEGORY_KEYS.map((key, i) => ({
        name: categoryText[key].name,
        description: categoryText[key].description,
        icon: React.createElement(CATEGORY_ICONS[i]),
    }));
    const problemCardsText = t('problem.cards') as { title: string; body: string }[];
    const problemCards: ProblemCard[] = problemCardsText.map((card, i) => ({
        ...card,
        icon: React.createElement(PROBLEM_CARD_ICONS[i]),
    }));
    const offerStagesText = t('offer.stages') as { title: string; duration: string; description: string; price: string }[];
    const offerStages: OfferStage[] = offerStagesText.map((stage, i) => ({
        ...stage,
        step: i + 1,
        showPrice: OFFER_STAGE_META[i].showPrice,
        featured: OFFER_STAGE_META[i].featured,
    }));
    const whoPoints = t('who.points') as string[];
    const faqItems = t('faq.items') as FaqItem[];
    const heroTitleLines = t('hero.titleLines') as string[];
    const problemHeadingLines = t('problem.headingLines') as string[];
    const offerHeadingLines = t('offer.headingLines') as string[];
    const whoHeadingLines = t('who.headingLines') as string[];
    const aboutParagraphs = t('about.paragraphs') as string[];

    const radarPush = useRadarPush(activeRadarPoint, scoreRows.length);

    const handleRadarMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 300;
        const my = ((e.clientY - rect.top) / rect.height) * 300;
        let nearest = 0;
        let nearestDist = Infinity;
        radarPointCoords(scoreRows).forEach((p, i) => {
            const d = (p.x - mx) ** 2 + (p.y - my) ** 2;
            if (d < nearestDist) {
                nearestDist = d;
                nearest = i;
            }
        });
        setActiveRadarPoint(nearest);
    };

    return (
        <div>
            {/* ============ HEADER ============ */}
            <header className="header">
                <div className="wrap header-inner">
                    <Logo variant="dark" fs={58} />
                    <div className="header-inner-right">
                        <nav className="nav">
                            <a href="#method">{t('nav.framework')}</a>
                            <a href="#offer">{t('nav.howItWorks')}</a>
                            <a href="#who">{t('nav.whoItsFor')}</a>
                            <a href="#faq">{t('nav.faq')}</a>
                        </nav>
                        <LanguageSwitcher />
                    </div>
                </div>
            </header>

            <div className="header-subline">
                <div className="wrap">{t('header.subline')}</div>
            </div>

            {/* ============ HERO ============ */}
            <section className="wrap hero">
                <div className="hero-copy">
                    <h1>
                        {heroTitleLines[0]} <br />{heroTitleLines[1]}
                    </h1>
                    <p>
                        {t('hero.body')}
                    </p>
                    <div className="hero-ctas">
                        <a className="btn btn-primary" href="#health-check">{t('hero.ctaPrimary')}</a>
                        <div className="btn btn-secondary">{t('hero.ctaSecondary')}</div>
                    </div>
                    <div className="hero-facts">
                        <div className="hero-fact">

                            <p>{t('hero.fact1')}</p>
                        </div>
                        <div className="hero-fact">

                            <p>{t('hero.fact2')}</p>
                        </div>

                    </div>
                </div>

                <div className="card score-card">
                    <div className="score-card-head">
                        <div className="score-card-head-label">{t('scoreCard.label')}</div>
                        <div className="score-card-badge">{t('scoreCard.badge')}</div>
                    </div>
                    <div className="score-value-row">
                        <div className="score-value">62</div>
                        <div className="score-value-max">{t('scoreCard.outOf')}</div>
                        <div className="score-zone">{t('scoreCard.zone')}</div>
                    </div>
                    <div className="score-divider" />
                    <div className="radar-chart">
                        <svg
                            viewBox="0 0 300 300"
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                            onMouseMove={handleRadarMouseMove}
                            onMouseLeave={() => setActiveRadarPoint(null)}
                        >
                            {RADAR_RINGS.map((points, i) => (
                                <polygon key={i} points={points} fill="none" stroke="var(--border)" strokeWidth="1" />
                            ))}
                            {RADAR_SPOKES.map(([x, y], i) => (
                                <line key={i} x1="150" y1="150" x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />
                            ))}
                            <polygon
                                className="radar-poly"
                                points={radarCoordsToPoints(pushRadarCoords(radarPointCoords(scoreRows), radarPush))}
                                fill="#B8860B"
                                fillOpacity="0.16"
                                stroke="#B8860B"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                            />
                            {pushRadarCoords(radarPointCoords(scoreRows), radarPush).map((p: { x: number; y: number }, i: number) => (
                                <circle
                                    key={i}
                                    className={`radar-dot${i === activeRadarPoint ? ' active' : ''}`}
                                    cx={p.x}
                                    cy={p.y}
                                    r="4"
                                    fill="#B8860B"
                                />
                            ))}
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
                        <div className="kicker">{t('problem.kicker')}</div>
                        <h2>{problemHeadingLines[0]} <br />{problemHeadingLines[1]}</h2>
                    </div>
                    <div className="problem-grid">
                        {problemCards.map((card) => (
                            <div className="card problem-card" key={card.title}>
                                {card.icon}
                                <h3>{card.title}</h3>
                                <p>{card.body}</p>
                            </div>
                        ))}
                    </div>
                    <ProblemCarousel cards={problemCards} />
                </div>
            </section>

            {/* ============ METHOD ============ */}
            <section id="method" className="wrap method-section">
                <div className="section-heading">
                    <div className="kicker">{t('method.kicker')}</div>
                    <h2 style={{ marginBottom: 16 }}>{t('method.heading')}</h2>
                    <p>{t('method.body')}</p>
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
                        <div className="method-summary-title">{t('method.summaryTitle')}</div>
                        <div className="method-summary-copy">{t('method.summaryCopy')}</div>
                    </div>
                </div>
            </section>

            {/* ============ OFFER ============ */}
            <section id="offer" className="offer-section">
                <div className="wrap section-pad">
                    <div className="section-heading">
                        <div className="kicker">{t('offer.kicker')}</div>
                        <h2>{offerHeadingLines[0]} <br />{offerHeadingLines[1]} <br /> {offerHeadingLines[2]}</h2>
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
                                    {t('offer.cta')}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============ WHO IT'S FOR ============ */}
            <section id="who" className="wrap who-section">
                <div className="who-intro">
                    <div className="kicker" style={{ marginBottom: 14 }}>{t('who.kicker')}</div>
                    <h2>{whoHeadingLines[0]} <br /> {whoHeadingLines[1]}</h2>
                </div>
                <div className="who-list">
                    {whoPoints.map((point) => (
                        <div className="who-item" key={point}>
                            <p>{point}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ============ ABOUT ============ */}
            <section className="about-section">
                <div className="wrap about-grid">
                    <img className="about-photo" src="/1779646966328.jpg" alt="Founder of CScale" />
                    <div className="about-copy">
                        <div className="kicker">{t('about.kicker')}</div>
                        <h2>{t('about.heading')}</h2>
                        {aboutParagraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
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
                    <h2>{t('ctaBanner.heading')}</h2>
                    <p>{t('ctaBanner.body')}</p>
                    <a
                        className="btn btn-primary-onDark"
                        href="#health-check"
                        style={{ marginTop: 8 }}
                        onClick={() => setHealthCheckStarted(true)}
                    >
                        {t('ctaBanner.cta')}
                    </a>
                </div>
            </section>

            {/* ============ FAQ ============ */}
            <section id="faq" className="wrap faq-section">
                <div className="section-heading" style={{ maxWidth: 640, marginBottom: 48 }}>
                    <div className="kicker">{t('faq.kicker')}</div>
                    <h2>{t('faq.heading')}</h2>
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
                        <a href="#method">{t('nav.framework')}</a>
                        <a href="#offer">{t('nav.howItWorks')}</a>
                        <a href="#faq">{t('nav.faq')}</a>
                        <a href="#">{t('nav.linkedin')}</a>
                    </div>
                </div>
                <div className="wrap footer-bottom">
                    <div className="footer-rule" />
                    <p className="footer-copy">{t('footer.copy')}</p>
                </div>
            </footer>
        </div>
    );
}
