import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

// The Typeform webhook (netlify/functions/webhook.js) writes the row a moment
// after submit, so we poll a few times before giving up.
const MAX_ATTEMPTS = 8
const RETRY_DELAY_MS = 1500

const ZONES = {
    red: {
        min: 0,
        max: 34,
        label: 'Red zone',
        color: '#C0483D',
        tint: '#F8EAE8',
        headline: "You're running Customer Success on hope.",
        cta: 'Book a call this week',
    },
    orange: {
        min: 35,
        max: 54,
        label: 'Orange zone',
        color: '#C97A2E',
        tint: '#FBF0E3',
        headline: "The basics exist. The system doesn't - yet.",
        cta: 'Book a 30-minute call',
    },
    yellow: {
        min: 55,
        max: 74,
        label: 'Yellow zone',
        color: '#B6912B',
        tint: '#FAF4E1',
        headline: "You're doing more right than wrong.",
        cta: 'See what the Build fixes',
    },
    green: {
        min: 75,
        max: 100,
        label: 'Green zone',
        color: '#1F8F6F',
        tint: '#E7F4EF',
        headline: "You've built what most startups still hire for.",
        cta: 'See what Ongoing Support looks like',
    },
}

const DEFAULT_CATEGORIES = [
    'Onboarding',
    'Adoption',
    'Satisfaction',
    'Retention',
    'Expansion',
    'GTM Strategy',
    'Cross-Team Alignment',
]

const RADAR_RINGS = [
    '150.00,123.75 170.52,133.63 175.59,155.84 161.39,173.65 138.61,173.65 124.41,155.84 129.48,133.63',
    '150.00,97.50 191.04,117.27 201.19,161.68 172.78,197.30 127.22,197.30 98.81,161.68 108.96,117.27',
    '150.00,71.25 211.57,100.90 226.78,167.52 184.17,220.95 115.83,220.95 73.22,167.52 88.43,100.90',
    '150,45 232.09,84.51 252.39,173.37 195.56,244.60 104.44,244.60 47.61,173.37 67.91,84.51',
]

const RADAR_SPOKES = [
    ['150', '45'],
    ['232.09', '84.51'],
    ['252.39', '173.37'],
    ['195.56', '244.60'],
    ['104.44', '244.60'],
    ['47.61', '173.37'],
    ['67.91', '84.51'],
]

const RADAR_LABEL_POS = [
    { left: '50.00%', top: '7.33%' },
    { left: '83.36%', top: '23.40%' },
    { left: '91.60%', top: '59.49%' },
    { left: '68.51%', top: '88.44%' },
    { left: '31.49%', top: '88.44%' },
    { left: '8.40%', top: '59.49%' },
    { left: '16.64%', top: '23.40%' },
]

const toRad = (d) => (d * Math.PI) / 180

function gaugeFillPath(score) {
    const gcx = 140
    const gcy = 150
    const gr = 110
    const gaugePoint = (angle) => ({
        x: gcx + gr * Math.cos(toRad(angle)),
        y: gcy - gr * Math.sin(toRad(angle)),
    })
    const startA = 180
    const endA = 180 - (score / 100) * 180
    const gs = gaugePoint(startA)
    const ge = gaugePoint(endA)
    const largeArc = startA - endA > 180 ? 1 : 0
    return `M${gs.x.toFixed(2)},${gs.y.toFixed(2)} A${gr},${gr} 0 ${largeArc} 1 ${ge.x.toFixed(2)},${ge.y.toFixed(2)}`
}

function radarPoints(categories) {
    const rcx = 150
    const rcy = 150
    const rmax = 105
    const n = categories.length
    const radarPoint = (r, i) => {
        const a = -90 + i * (360 / n)
        const rad = toRad(a)
        return { x: rcx + r * Math.cos(rad), y: rcy + r * Math.sin(rad) }
    }
    return categories
        .map((c, i) => {
            const p = radarPoint(rmax * (c.value / 100), i)
            return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
        })
        .join(' ')
}

function getZone(score) {
    if (score >= ZONES.green.min) return ZONES.green
    if (score >= ZONES.yellow.min) return ZONES.yellow
    if (score >= ZONES.orange.min) return ZONES.orange
    return ZONES.red
}

function normalizeScore(value) {
    const parsed = Number(value)
    if (Number.isNaN(parsed)) return 0
    return Math.max(0, Math.min(100, Math.round(parsed)))
}

function normalizeCategories(resultScore, categories) {
    if (Array.isArray(categories) && categories.length > 0) {
        return categories
            .map((item, index) => ({
                name: item?.name || DEFAULT_CATEGORIES[index] || `Category ${index + 1}`,
                value: normalizeScore(item?.value),
            }))
            .slice(0, 7)
    }

    // Fallback to score-biased defaults if category-level data is not yet saved.
    const baseline = resultScore
    const offsets = [6, 0, 4, -10, -6, -4, 5]
    return DEFAULT_CATEGORIES.map((name, i) => ({
        name,
        value: normalizeScore(baseline + offsets[i]),
    }))
}

function LogoIcon({ variant }) {
    const arcColor = variant === 'dark' ? 'var(--navy)' : 'var(--white)'
    return (
        <svg viewBox="0 0 120 120" style={{ display: 'block', width: '100%', height: '100%' }}>
            <path d="M 87.05 94.18 A 42 42 0 1 1 87.05 29.82" fill="none" stroke={arcColor} strokeWidth="11" strokeLinecap="round" />
            <rect x="33.5" y="66" width="11" height="20" rx="5" fill="var(--green)" opacity="0.55" />
            <rect x="51.5" y="54" width="11" height="32" rx="5" fill="var(--green)" opacity="0.78" />
            <rect x="69.5" y="42" width="11" height="44" rx="5" fill="var(--green)" />
        </svg>
    )
}

function Logo({ variant, fs }) {
    return (
        <div className="logo" style={{ '--fs': `${fs}px` }}>
            <div className="logo-row">
                <div
                    className="logo-icon-wrap"
                    style={{
                        width: 'calc(var(--fs) * 0.909664)',
                        height: 'calc(var(--fs) * 0.909664)',
                        marginTop: 'calc(var(--fs) * 0.027252)',
                        marginRight: 'calc(var(--fs) * -0.229373)',
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
    )
}

function Results() {
    const [searchParams] = useSearchParams()
    const responseId = searchParams.get('rid')
    const [result, setResult] = useState(null)
    const [status, setStatus] = useState('loading') // loading | not-found | error | ready

    useEffect(() => {
        if (!responseId) {
            setStatus('not-found')
            return
        }

        let attempts = 0
        let cancelled = false

        async function fetchResult() {
            attempts += 1

            const response = await fetch(`/api/result?rid=${encodeURIComponent(responseId)}`)

            if (cancelled) return

            if (response.status === 404) {
                if (attempts < MAX_ATTEMPTS) {
                    setTimeout(fetchResult, RETRY_DELAY_MS)
                } else {
                    setStatus('not-found')
                }
                return
            }

            if (!response.ok) {
                setStatus('error')
                return
            }

            const { tailoredResult } = await response.json()
            setResult(tailoredResult)
            setStatus('ready')
        }

        fetchResult()

        return () => {
            cancelled = true
        }
    }, [responseId])

    if (status === 'loading') {
        return (
            <main className="results-page">
                <div className="results-shell">
                    <p className="kicker">Health &amp; Efficiency Score</p>
                    <h1>Crunching your answers...</h1>
                    <p className="results-lede">Your results are being prepared. This usually takes a few seconds.</p>
                    <div className="results-loader" aria-hidden="true" />
                </div>
            </main>
        )
    }

    if (status === 'not-found') {
        return (
            <main className="results-page">
                <div className="results-shell results-message">
                    <p className="kicker">Health &amp; Efficiency Score</p>
                    <h1>Your result is almost ready.</h1>
                    <p className="results-lede">We couldn't find this submission yet. Wait a few seconds, then refresh the page.</p>
                    <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>Refresh result</button>
                </div>
            </main>
        )
    }

    if (status === 'error') {
        return (
            <main className="results-page">
                <div className="results-shell results-message">
                    <p className="kicker">Health &amp; Efficiency Score</p>
                    <h1>We hit a snag.</h1>
                    <p className="results-lede">Something went wrong loading your result. Please try refreshing the page.</p>
                    <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>Try again</button>
                </div>
            </main>
        )
    }

    const answers = result?.answers && typeof result.answers === 'object' ? Object.entries(result.answers) : []
    const score = normalizeScore(result?.score)
    const zone = getZone(score)
    const categories = normalizeCategories(score, result?.categories)
    const sorted = categories.slice().sort((a, b) => b.value - a.value)
    const strongest = sorted[0]
    const weakest = sorted[sorted.length - 1]
    const headline = result?.headline || zone.headline
    const summary = result?.summary || 'Your assessment is ready.'

    return (
        <main style={{ background: 'var(--paper)', minHeight: '100%' }}>
            <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
                <div className="wrap" style={{ display: 'flex', alignItems: 'center', height: 76 }}>
                    <Logo variant="dark" fs={26} />
                </div>
            </div>

            <section className="wrap result-hero">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                    <div className="kicker">Your result</div>
                    <h1 style={{ fontSize: 38, lineHeight: 1.18 }}>{headline}</h1>
                    <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--grey)', maxWidth: '56ch' }}>{summary}</p>
                    <div style={{ marginTop: 6 }}>
                        <a className="btn btn-primary" href="#">{zone.cta}</a>
                    </div>
                </div>

                <div className="card gauge-card">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--grey)' }}>Health &amp; Efficiency Score</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-deep)', background: 'var(--green-light)', padding: '5px 10px', borderRadius: 6 }}>
                            ASSESSMENT RESULT
                        </div>
                    </div>
                    <div className="gauge-chart">
                        <svg viewBox="0 0 280 180" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                            <path d="M30,150 A110,110 0 1 1 250,150" fill="none" stroke="var(--border)" strokeWidth="22" strokeLinecap="round" />
                            <path d={gaugeFillPath(score)} fill="none" stroke={zone.color} strokeWidth="22" strokeLinecap="round" />
                        </svg>
                        <div className="gauge-score">{score}</div>
                        <div className="gauge-outof">out of 100</div>
                    </div>
                    <div className="zone-badge" style={{ background: zone.tint, color: zone.color }}>
                        {result?.scoreLabel || zone.label}
                    </div>
                </div>
            </section>

            <section style={{ background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
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
                                    points={radarPoints(categories)}
                                    fill={zone.color}
                                    fillOpacity="0.16"
                                    stroke={zone.color}
                                    strokeWidth="2.5"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {categories.map((c, i) => (
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
            </section>

            {answers.length > 0 && (
                <section className="results-page" style={{ paddingTop: 0 }}>
                    <div className="results-shell">
                        <section className="results-answers" style={{ marginTop: 24 }}>
                            <div className="results-section-heading">
                                <p className="kicker">Your responses</p>
                                <h2>What you told us</h2>
                            </div>
                            <div className="results-answer-list">
                                {answers.map(([question, answer]) => (
                                    <div className="results-answer card" key={question}>
                                        <h3>{question}</h3>
                                        <p>{typeof answer === 'boolean' ? (answer ? 'Yes' : 'No') : String(answer)}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                        <a className="btn btn-secondary" href="/">Back to CScale</a>
                    </div>
                </section>
            )}

            <footer style={{ background: 'var(--navy)' }}>
                <div className="wrap" style={{ paddingTop: 40, paddingBottom: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    <Logo variant="white" fs={22} />
                    <p style={{ fontSize: 13, color: 'var(--grey-light)' }}>Copyright 2026 CScale. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}

export default Results
