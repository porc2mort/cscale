import { getDatabase } from '@netlify/database'

const db = getDatabase({ connectionString: process.env.NETLIFY_DB_URL })

export const handler = async (event) => {
    const responseId = event.queryStringParameters?.rid?.trim().toLowerCase()

    if (!responseId) {
        return { statusCode: 400, body: JSON.stringify({ error: 'Missing rid' }) }
    }

    const rows = await db.sql`
        SELECT tailored_result
        FROM responses
        WHERE LOWER(TRIM(response_id)) = ${responseId}
    `

    if (rows.length === 0) {
        const recentRows = await db.sql`
            SELECT response_id FROM responses ORDER BY created_at DESC LIMIT 5
        `
        console.error('Result not found', {
            requestedResponseId: responseId,
            recentResponseIds: recentRows.map((row) => row.response_id),
        })
        return { statusCode: 404, body: JSON.stringify({ error: 'Not found' }) }
    }

    return {
        statusCode: 200,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tailoredResult: rows[0].tailored_result }),
    }
}
