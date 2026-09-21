import { useLanguage } from '../lib/i18n.jsx';

function LanguageSwitcher({ variant = 'light' }) {
    const { lang, setLang } = useLanguage();

    return (
        <div className={`lang-switch lang-switch--${variant}`} data-lang={lang}>
            <span className="lang-switch-thumb" aria-hidden="true" />
            <button
                type="button"
                className={lang === 'fr' ? 'active' : ''}
                aria-pressed={lang === 'fr'}
                onClick={() => setLang('fr')}
            >
                FR
            </button>
            <button
                type="button"
                className={lang === 'en' ? 'active' : ''}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
            >
                EN
            </button>
        </div>
    );
}

export default LanguageSwitcher;
