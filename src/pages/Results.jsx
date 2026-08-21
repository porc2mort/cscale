import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

// The Typeform webhook (netlify/functions/webhook.js) writes the row a moment
// after submit, so we poll a few times before giving up.
const MAX_ATTEMPTS = 8
const RETRY_DELAY_MS = 1500

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

    return (
        <main className="results-page">
            <div className="results-shell">
                <p className="kicker">Your assessment</p>
                <h1>Your Health &amp; Efficiency Score</h1>
                <p className="results-lede">A clear snapshot of where your customer success system is strong and where it can grow.</p>

                <section className="results-summary card">
                    <div className="results-score-row">
                        <div>
                            <div className="results-summary-label">Your score</div>
                            <div className="results-score">{result?.score ?? 0}<span>/100</span></div>
                        </div>
                        <div className="results-score-label">{result?.scoreLabel || 'Assessment complete'}</div>
                    </div>
                    <p>{result?.summary || 'Your assessment is ready.'}</p>
                </section>

                {answers.length > 0 && (
                    <section className="results-answers">
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
                )}

                <a className="btn btn-secondary" href="/">Back to CScale</a>
            </div>
        </main>
    )
}

export default Results
