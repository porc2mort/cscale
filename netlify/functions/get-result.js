import { getDatabase } from '@netlify/database'

const db = getDatabase({ connectionString: process.env.NETLIFY_DB_URL })

export const handler = async (event) => {
    const responseId = event.queryStringParameters?.rid

    if (!responseId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing rid' }) }
    }

    const rows = await db.sql`
        SELECT tailored_result FROM responses WHERE response_id = ${responseId}
    `

    if (rows.length === 0) {
        return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) }
    }

    return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tailoredResult: rows[0].tailored_result }),
    }
}
