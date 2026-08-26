import { getDatabase } from '@netlify/database'

const db = getDatabase({ connectionString: process.env.NETLIFY_DB_URL })

const questionWeights = [1.75, 1.75, 2.25, 3, 2, 1.5, 3, 2, 2.75, 2.75, 3.25, 3, 3.5, 2.5, 3]
const scoreBuckets = [
    { name: 'Onboarding', indexes: [0, 1] },
    { name: 'Adoption', indexes: [2, 3] },
    { name: 'Satisfaction', indexes: [4, 5] },
    { name: 'Retention', indexes: [6, 7, 8] },
    { name: 'Expansion', indexes: [9] },
    { name: 'GTM Strategy', indexes: [10, 11, 12] },
    { name: 'Cross-Team Alignment', indexes: [13, 14] },
]

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

    const categories = scoreBuckets.map((bucket) => {
        const maxCategoryScore = bucket.indexes.reduce(
            (total, index) => total + (questionWeights[index] ?? 0),
            0,
        )
        const earnedCategoryScore = bucket.indexes.reduce((total, index) => {
            const question = scoredQuestions[index]
            if (!question) return total
            const answer = answers[question]
            const isPositive = answer === true || answer === 'yes'
            return total + (isPositive ? questionWeights[index] : 0)
        }, 0)

        return {
            name: bucket.name,
            value:
                maxCategoryScore > 0
                    ? Math.round((earnedCategoryScore / maxCategoryScore) * 100)
                    : 0,
        }
    })

    return {
        score,
        scoreLabel: score >= 70 ? 'Strong foundation' : score >= 40 ? 'Room to grow' : 'Needs attention',
        summary: `You scored ${score} out of 100 on the Health & Efficiency Score.`,
        categories,
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
