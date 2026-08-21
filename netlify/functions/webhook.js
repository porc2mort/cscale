import { getDatabase } from '@netlify/database'

const db = getDatabase({ connectionString: process.env.NETLIFY_DB_URL })

// Fill in your real scoring/rules logic here. Receives the flat
// { [fieldRef]: answer } map built below and must return whatever
// shape you want to render on the results page.
function computeTailoredResult(answers) {
    return {
        summary: 'Placeholder result — replace computeTailoredResult() with real logic.',
        answers,
    }
}

function flattenAnswers(formResponse) {
    const fields = new Map(
        (formResponse.definition?.fields ?? []).map((f) => [f.id, f.ref ?? f.id]),
    )

    const answers = {}
    for (const answer of formResponse.answers ?? []) {
        const key = fields.get(answer.field.id) ?? answer.field.id
        answers[key] =
            answer[answer.type] !== undefined ? answer[answer.type] : answer
    }
    return answers
}

export const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) }
    }

    const payload = JSON.parse(event.body || '{}')
    const formResponse = payload?.form_response
    const responseId = formResponse?.token?.trim().toLowerCase()

    if (!responseId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing form_response.token' }) }
    }

    const answers = flattenAnswers(formResponse)
    const tailoredResult = computeTailoredResult(answers)

    try {
        await db.sql`
            INSERT INTO responses (response_id, answers, tailored_result)
            VALUES (${responseId}, ${JSON.stringify(answers)}, ${JSON.stringify(tailoredResult)})
            ON CONFLICT (response_id)
            DO UPDATE SET answers = EXCLUDED.answers, tailored_result = EXCLUDED.tailored_result
        `
    } catch (error) {
        console.error('Database upsert failed', error)
        return { statusCode: 500, body: JSON.stringify({ error: 'Failed to store response' }) }
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
