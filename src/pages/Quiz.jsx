import { Widget } from '@typeform/embed-react'
import { useNavigate } from 'react-router-dom'

const formId = import.meta.env.VITE_TYPEFORM_FORM_ID

function Quiz() {
    const navigate = useNavigate()

    return (
        <section>
            <h1>Take the quiz</h1>
            <Widget
                id={formId}
                className="quiz-embed"
                onSubmit={({ responseId }) => {
                    navigate(`/results?rid=${responseId}`)
                }}
            />
        </section>
    )
}

export default Quiz
