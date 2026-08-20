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
        return <p className="results-state">Crunching your answers…</p>
    }

    if (status === 'not-found') {
        return (
            <p className="results-state">
                We couldn't find a result for this link yet. If you just submitted
                the quiz, wait a few seconds and refresh.
            </p>
        )
    }

    if (status === 'error') {
        return <p className="results-state">Something went wrong loading your result.</p>
    }

    return (
        <section className="results-state">
            <h1>Your result</h1>
            <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
    )
}

export default Results
