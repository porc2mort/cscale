import { getDatabase } from '@netlify/database'

const db = getDatabase({ connectionString: process.env.NETLIFY_DB_URL })

const questionWeights = [2, 2, 2, 2, 2, 2.5, 3, 2, 2, 2, 3, 2.5, 3, 2, 2.5]

// Fill in your real scoring/rules logic here. Receives the flat
// { [fieldTitle]: answer } map built below and must return whatever
// shape you want to render on the results page.
function computeTailoredResult(answers, scoredQuestions) {
    const maxScore = questionWeights.reduce((total, weight) => total + weight, 0)
    const earnedScore = scoredQuestions.reduce((total, question, index) => {
        const answer = answers[question]
        const isPositive = answer === true || answer === 'yes'
        return total + (isPositive ? questionWeights[index] : 0)
    }, 0)
    const score = maxScore > 0 ? Math.round((earnedScore / maxScore) * 100) : 0

    return {
        score,
        scoreLabel: score >= 70 ? 'Strong foundation' : score >= 40 ? 'Room to grow' : 'Needs attention',
        summary: `You scored ${score} out of 100 on the Health & Efficiency Score.`,
        answers,
    }
}

function flattenAnswers(formResponse) {
    const fields = new Map(
        (formResponse.definition?.fields ?? []).map((f) => [f.id, f.title ?? f.ref ?? f.id]),
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
    const scoredQuestions = (formResponse.definition?.fields ?? [])
        .filter((field) => field.type === 'yes_no')
        .map((field) => field.title ?? field.ref ?? field.id)
    const tailoredResult = computeTailoredResult(answers, scoredQuestions)

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
