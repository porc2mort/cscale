export const CALENDLY_URL = 'https://calendly.com/contact-cscaleconsulting/30min'

export function openCalendly(event) {
    event?.preventDefault()
    window.Calendly?.initPopupWidget({ url: CALENDLY_URL })
}
