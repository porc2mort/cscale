import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cscale-lang';

export const translations = {
    en: {
        nav: {
            framework: 'Framework',
            howItWorks: 'How it works',
            whoItsFor: "Who it's for",
            faq: 'FAQ',
            linkedin: 'LinkedIn',
        },
        logo: {
            tagline: 'Customer Success, built to scale',
        },
        header: {
            subline: 'Customer Success Operations, built to scale',
        },
        hero: {
            titleLines: [
                "Retention isn't just a Customer Success problem.",
                "It's a company-wide system, built into every part of the customer journey.",
            ],
            body: 'CScale diagnoses, builds, and runs the CS Ops foundations for growing startups, without the six-month wait and the cost of a senior hire.',
            ctaPrimary: 'Take the free health check',
            ctaSecondary: 'Start the full diagnostic',
            fact1: 'It starts with a diagnosis across 7 key areas of your organization. CScale identifies the priorities that are costing you time, money, and customers.',
            fact2: 'From there, we turn those insights into action. Building the processes, workflows, tools, and operating structure needed to make Customer Success more efficient, predictable, and scalable. Less guesswork. Clear priorities. Faster impact.',
        },
        scoreCard: {
            label: 'Health & Efficiency Score',
            badge: 'SAMPLE RESULT',
            outOf: '/ 100',
            zone: 'Orange zone',
        },
        healthCheck: {
            kicker: 'Free health check',
            heading: 'Find your Health & Efficiency Score.',
            welcomeHeading: 'Find out your score before your next board meeting.',
            welcomeBody: '15 questions, about five minutes. Free, no credit card, no sales call.',
            cta: 'Take the free Health Check',
        },
        problem: {
            kicker: 'Sound familiar?',
            headingLines: ['You can feel the problem.', "But you don't know where to start."],
            prevAria: 'Previous problem',
            nextAria: 'Next problem',
            goToAria: 'Go to problem',
            cards: [
                {
                    title: "Customers are churning and you don't know why",
                    body: "You're reacting to churn instead of preventing it. The warning signs were there. You just didn't have a way to see them early enough.",
                },
                {
                    title: 'CS runs on instinct, not a system',
                    body: "Onboarding, support, renewals and follow ups are held together by spreadsheets, scattered tools, and memory (maybe yours). It works until it doesn't.",
                },
                {
                    title: "Your best customers aren't getting the attention they deserve",
                    body: 'Without segmentation and clear priorities, your team can spend as much time on low value accounts as on the customers driving your growth.',
                },
                {
                    title: 'Investors are asking about NRR',
                    body: "You know how retention matters. But when investors ask for your NRR, you don't have a number you fully trust to share.",
                },
                {
                    title: 'You keep fixing the same problems',
                    body: 'The team is constantly reacting to tickets, escalations and unhappy customers instead of fixing the processes creating those problems in the first place.',
                },
                {
                    title: 'Your CS team is growing faster than your processes',
                    body: "You hired more people to keep up with customers, but the underlying workflows and responsibilities haven't evolved with them.",
                },
            ],
        },
        method: {
            kicker: 'The framework',
            heading: 'The Health & Efficiency Score',
            body: '50 weighted questions across 7 categories. The result is a real score, and a plan for what to fix first.',
            summaryTitle: '100 points total.',
            summaryCopy: "Categories aren't weighted equally. Each one is scored by how much it protects ARR at your stage.",
        },
        offer: {
            kicker: 'How we work together',
            headingLines: ['Three stages.', 'No six-month commitment', "to find out if it's working."],
            cta: 'Request a quote',
            stages: [
                {
                    title: 'Diagnostic',
                    duration: '2–3 weeks',
                    description: 'Get your Health & Efficiency Score, a full breakdown across all 7 categories, and a top-5 action plan ranked by impact.',
                    price: 'Starting at $5,000 CAD',
                },
                {
                    title: 'Build',
                    duration: '8–12 weeks',
                    description: 'Get a full CS health assessment, a prioritized action plan, and clear processes and playbooks, built to work in your day to day operations.',
                    price: 'Starting at $13,000 CAD',
                },
                {
                    title: 'Scale',
                    duration: 'Monthly retainer',
                    description: 'A fractional Head of CS Ops keeps your Customer Success operation moving as you grow, providing strategic guidance and ongoing optimization a few days a month, until your team is ready to run it on its own.',
                    price: 'Starting at $3,500 CAD / mo',
                },
            ],
        },
        who: {
            kicker: 'Is this you?',
            headingLines: ['Built for startups between', '$1M and $10M'],
            points: [
                "You're growing. Your CS operation isn't ready to scale with you.",
                "You're between $1M and $10M ARR.",
                "You don't have a Head of CS yet, or you've only recently hired one.",
                "You know there's a retention or expansion problem, but you don't know exactly where it starts.",
            ],
        },
        about: {
            kicker: 'The founder',
            heading: 'Meet the person behind CScale',
            paragraphs: [
                "I've spent the last 12 years building and scaling Customer Success Operations across Tech, SaaS, and AI companies in Europe and North America.",
                "I've built CS functions from the ground up, scaled teams and operations, and worked across onboarding, adoption, retention, expansion, CS Ops, and cross functional strategy. Along the way, I've partnered closely with CEOs to drive business transformation, operational excellence, and sustainable revenue growth.",
                "I created CScale to bring that hands-on experience to growing SaaS companies that want to turn their Customer Success operation into a healthy, efficient, and scalable function, without having to figure it all out from scratch.",
            ],
        },
        ctaBanner: {
            heading: 'Find out your score before your next board meeting.',
            body: '15 questions, about five minutes. Free, no credit card, no sales call.',
            cta: 'Take the free Health Check',
        },
        faq: {
            kicker: 'Questions',
            heading: 'Before you book a call',
            items: [
                { q: "Don't we need a CRM in place first?", a: 'No. Setting that up, or fixing what you already have, is part of the Build.' },
                {
                    q: 'How much time does this take on our side?',
                    a: "Plan for a few hours during the Diagnostic, mostly interviews. The Build takes more time from your team, and we'll scope exact hours together before starting.",
                },
                {
                    q: 'What happens after Ongoing Support ends?',
                    a: "Either your team runs it on their own, or a newly hired Head of CS takes over a system that's already built and running.",
                },
            ],
        },
        footer: {
            copy: '© 2026 CScale. All rights reserved.',
        },
        results: {
            loadingKicker: 'Health & Efficiency Score',
            loadingHeading: 'Crunching your answers...',
            loadingBody: 'Your results are being prepared. This usually takes a few seconds.',
            notFoundHeading: 'Your result is almost ready.',
            notFoundBody: "We couldn't find this submission yet. Wait a few seconds, then refresh the page.",
            notFoundCta: 'Refresh result',
            errorHeading: 'We hit a snag.',
            errorBody: 'Something went wrong loading your result. Please try refreshing the page.',
            errorCta: 'Try again',
            yourResult: 'Your result',
            defaultSummary: 'Your assessment is ready.',
            footnotePrefix: 'This preview is based on 15 of the full 50-question Diagnostic —',
            footnoteLink: 'book a call',
            footnoteSuffix: 'with me for the complete picture.',
            scoreLabel: 'Health & Efficiency Score',
            assessmentResult: 'ASSESSMENT RESULT',
            outOf100: 'out of 100',
            breakdownHeading: 'Your 7-category breakdown',
            breakdownBody: 'Each axis is one category of the Health & Efficiency Score, out of 100.',
            strongest: 'Strongest area',
            strongestBody: 'This is the category doing the most to protect your score right now - keep it that way as you grow.',
            weakest: 'Biggest opportunity',
            weakestBody: 'The single fastest place to move your overall score - this is usually where the Diagnostic starts.',
            yourResponses: 'Your responses',
            whatYouToldUs: 'What you told us',
            yes: 'Yes',
            no: 'No',
            backToCScale: 'Back to CScale',
            footerCopy: 'Copyright 2026 CScale. All rights reserved.',
        },
        zones: {
            red: { label: 'Red zone', headline: "You're running Customer Success on hope.", cta: 'Book a call this week' },
            orange: { label: 'Orange zone', headline: "The basics exist. The system doesn't - yet.", cta: 'Book a 30-minute call' },
            yellow: { label: 'Yellow zone', headline: "You're doing more right than wrong.", cta: 'See what the Build fixes' },
            green: { label: 'Green zone', headline: "You've built what most startups still hire for.", cta: 'See what Ongoing Support looks like' },
        },
        categories: {
            Onboarding: { name: 'Onboarding', description: 'How fast new customers reach real value.' },
            Adoption: { name: 'Adoption', description: 'Whether usage turns into real business value.' },
            Satisfaction: { name: 'Satisfaction', description: 'The signals that tell you how customers really feel.' },
            Retention: { name: 'Retention', description: 'The number that protects everything else.' },
            Expansion: { name: 'Expansion', description: 'Growth from the customers you already have.' },
            'GTM Strategy': { name: 'GTM Strategy', description: 'The root cause most teams miss.' },
            'Cross-Team Alignment': { name: 'Cross-Team Alignment', description: 'Sales, CS, and Product, speaking the same language.' },
        },
    },
    fr: {
        nav: {
            framework: 'Méthodologie',
            howItWorks: 'Comment ça marche',
            whoItsFor: 'Pour qui',
            faq: 'FAQ',
            linkedin: 'LinkedIn',
        },
        logo: {
            tagline: 'Le Customer Success, conçu pour grandir',
        },
        header: {
            subline: 'Des opérations Customer Success conçues pour grandir',
        },
        hero: {
            titleLines: [
                "La rétention n'est pas seulement un enjeu du Customer Success.",
                "C'est un système à l'échelle de l'entreprise, ancré dans chaque étape du parcours client.",
            ],
            body: "CScale diagnostique, construit et fait tourner les fondations des opérations CS pour les startups en croissance, sans les six mois d'attente ni le coût d'une embauche senior.",
            ctaPrimary: 'Faire le bilan de santé gratuit',
            ctaSecondary: 'Démarrer le diagnostic complet',
            fact1: "Tout commence par un diagnostic couvrant 7 domaines clés de votre organisation. CScale identifie les priorités qui vous coûtent du temps, de l'argent et des clients.",
            fact2: "Ensuite, nous transformons ces constats en actions concrètes : processus, workflows, outils et structure opérationnelle, pour rendre le Customer Success plus efficace, prévisible et évolutif. Moins de tâtonnements. Des priorités claires. Un impact plus rapide.",
        },
        scoreCard: {
            label: "Score de santé et d'efficacité",
            badge: 'RÉSULTAT EXEMPLE',
            outOf: '/ 100',
            zone: 'Zone orange',
        },
        healthCheck: {
            kicker: 'Bilan de santé gratuit',
            heading: "Découvrez votre score de santé et d'efficacité.",
            welcomeHeading: 'Découvrez votre score avant votre prochain comité stratégique.',
            welcomeBody: '15 questions, environ cinq minutes. Gratuit, sans carte de crédit, sans appel commercial.',
            cta: 'Faire le bilan de santé gratuit',
        },
        problem: {
            kicker: 'Ça vous parle ?',
            headingLines: ['Vous sentez le problème.', 'Mais vous ne savez pas par où commencer.'],
            prevAria: 'Problème précédent',
            nextAria: 'Problème suivant',
            goToAria: 'Aller au problème',
            cards: [
                {
                    title: 'Vos clients partent et vous ne savez pas pourquoi',
                    body: "Vous subissez le churn au lieu de l'anticiper. Les signaux d'alerte étaient là. Vous n'aviez simplement aucun moyen de les voir assez tôt.",
                },
                {
                    title: "Le CS fonctionne à l'instinct, pas comme un système",
                    body: "Onboarding, support, renouvellements et suivis tiennent grâce à des tableurs, des outils épars et de la mémoire (peut-être la vôtre). Ça marche, jusqu'au jour où ça ne marche plus.",
                },
                {
                    title: "Vos meilleurs clients n'obtiennent pas l'attention qu'ils méritent",
                    body: "Sans segmentation ni priorités claires, votre équipe peut passer autant de temps sur des comptes à faible valeur que sur les clients qui portent votre croissance.",
                },
                {
                    title: 'Les investisseurs vous questionnent sur votre NRR',
                    body: "Vous savez à quel point la rétention compte. Mais quand les investisseurs demandent votre NRR, vous n'avez pas de chiffre en lequel vous avez pleinement confiance.",
                },
                {
                    title: 'Vous réglez sans cesse les mêmes problèmes',
                    body: "L'équipe réagit en permanence aux tickets, aux escalades et aux clients mécontents, au lieu de corriger les processus qui créent ces problèmes en premier lieu.",
                },
                {
                    title: 'Votre équipe CS grandit plus vite que vos processus',
                    body: "Vous avez recruté pour suivre le rythme de vos clients, mais les workflows et les responsabilités sous-jacents n'ont pas évolué avec eux.",
                },
            ],
        },
        method: {
            kicker: 'La méthodologie',
            heading: "Le score de santé et d'efficacité",
            body: "50 questions pondérées réparties sur 7 catégories. Le résultat : un score réel, et un plan pour savoir quoi corriger en premier.",
            summaryTitle: '100 points au total.',
            summaryCopy: "Les catégories ne sont pas pondérées de façon égale. Chacune est notée selon ce qu'elle protège de votre ARR à votre stade.",
        },
        offer: {
            kicker: 'Comment nous travaillons ensemble',
            headingLines: ['Trois étapes.', 'Aucun engagement de six mois', 'pour savoir si ça fonctionne.'],
            cta: 'Demander un devis',
            stages: [
                {
                    title: 'Diagnostic',
                    duration: '2 à 3 semaines',
                    description: "Obtenez votre score de santé et d'efficacité, une analyse complète des 7 catégories, et un plan d'action des 5 priorités classées par impact.",
                    price: 'À partir de 5 000 $ CAD',
                },
                {
                    title: 'Construction',
                    duration: '8 à 12 semaines',
                    description: "Obtenez une évaluation complète de la santé de votre CS, un plan d'action priorisé, ainsi que des processus et playbooks clairs, conçus pour s'intégrer à votre quotidien.",
                    price: 'À partir de 13 000 $ CAD',
                },
                {
                    title: 'Scale',
                    duration: 'Mandat mensuel',
                    description: "Un Head of CS Ops à temps partagé maintient votre opération Customer Success en mouvement à mesure que vous grandissez, en apportant orientation stratégique et optimisation continue quelques jours par mois, jusqu'à ce que votre équipe soit prête à prendre le relais.",
                    price: 'À partir de 3 500 $ CAD / mois',
                },
            ],
        },
        who: {
            kicker: "C'est vous ?",
            headingLines: ['Conçu pour les startups entre', '1 M$ et 10 M$'],
            points: [
                "Vous grandissez. Votre opération CS n'est pas prête à suivre le rythme.",
                "Vous êtes entre 1 M$ et 10 M$ d'ARR.",
                "Vous n'avez pas encore de Head of CS, ou vous venez tout juste d'en embaucher un.",
                "Vous savez qu'il y a un problème de rétention ou d'expansion, mais vous ne savez pas exactement où il commence.",
            ],
        },
        about: {
            kicker: 'La fondatrice',
            heading: 'La personne derrière CScale',
            paragraphs: [
                "J'ai passé les 12 dernières années à construire et à faire grandir des opérations Customer Success dans des entreprises Tech, SaaS et IA, en Europe et en Amérique du Nord.",
                "J'ai bâti des fonctions CS depuis zéro, fait grandir des équipes et des opérations, et travaillé sur l'onboarding, l'adoption, la rétention, l'expansion, les CS Ops et la stratégie transverse. En chemin, j'ai travaillé en étroite collaboration avec des PDG pour porter la transformation business, l'excellence opérationnelle et une croissance de revenus durable.",
                "J'ai créé CScale pour mettre cette expérience terrain au service des entreprises SaaS en croissance qui veulent transformer leur opération Customer Success en une fonction saine, efficace et évolutive, sans avoir à tout réinventer seules.",
            ],
        },
        ctaBanner: {
            heading: 'Découvrez votre score avant votre prochain comité stratégique.',
            body: '15 questions, environ cinq minutes. Gratuit, sans carte de crédit, sans appel commercial.',
            cta: 'Faire le bilan de santé gratuit',
        },
        faq: {
            kicker: 'Questions',
            heading: 'Avant de réserver un appel',
            items: [
                { q: "N'avons-nous pas besoin d'un CRM en place d'abord ?", a: 'Non. Le mettre en place, ou corriger celui que vous avez déjà, fait partie de la phase Construction.' },
                {
                    q: 'Combien de temps cela demande-t-il de notre côté ?',
                    a: "Prévoyez quelques heures pendant le Diagnostic, principalement des entretiens. La Construction demande plus de temps à votre équipe, et nous définirons ensemble le nombre d'heures exact avant de démarrer.",
                },
                {
                    q: "Que se passe-t-il une fois l'accompagnement continu terminé ?",
                    a: "Soit votre équipe prend le relais seule, soit un nouveau Head of CS récemment embauché reprend un système déjà construit et opérationnel.",
                },
            ],
        },
        footer: {
            copy: '© 2026 CScale. Tous droits réservés.',
        },
        results: {
            loadingKicker: "Score de santé et d'efficacité",
            loadingHeading: 'Analyse de vos réponses...',
            loadingBody: 'Vos résultats sont en cours de préparation. Cela prend généralement quelques secondes.',
            notFoundHeading: 'Votre résultat est presque prêt.',
            notFoundBody: "Nous n'avons pas encore trouvé cette soumission. Patientez quelques secondes, puis actualisez la page.",
            notFoundCta: 'Actualiser le résultat',
            errorHeading: 'Un imprévu est survenu.',
            errorBody: "Une erreur s'est produite lors du chargement de votre résultat. Veuillez actualiser la page.",
            errorCta: 'Réessayer',
            yourResult: 'Votre résultat',
            defaultSummary: 'Votre évaluation est prête.',
            footnotePrefix: 'Cet aperçu se base sur 15 des 50 questions du Diagnostic complet —',
            footnoteLink: 'réservez un appel',
            footnoteSuffix: "avec moi pour obtenir la vue d'ensemble complète.",
            scoreLabel: "Score de santé et d'efficacité",
            assessmentResult: "RÉSULTAT DE L'ÉVALUATION",
            outOf100: 'sur 100',
            breakdownHeading: 'Votre analyse en 7 catégories',
            breakdownBody: "Chaque axe correspond à une catégorie du score de santé et d'efficacité, sur 100.",
            strongest: 'Point le plus fort',
            strongestBody: "C'est la catégorie qui protège le plus votre score actuellement - maintenez ce niveau en grandissant.",
            weakest: 'Plus grande opportunité',
            weakestBody: "L'endroit le plus rapide pour faire progresser votre score global - c'est généralement par là que commence le Diagnostic.",
            yourResponses: 'Vos réponses',
            whatYouToldUs: 'Ce que vous nous avez dit',
            yes: 'Oui',
            no: 'Non',
            backToCScale: 'Retour à CScale',
            footerCopy: '© 2026 CScale. Tous droits réservés.',
        },
        zones: {
            red: { label: 'Zone rouge', headline: "Vous gérez le Customer Success à l'instinct et à l'espoir.", cta: 'Réserver un appel cette semaine' },
            orange: { label: 'Zone orange', headline: 'Les bases existent. Le système, pas encore.', cta: 'Réserver un appel de 30 minutes' },
            yellow: { label: 'Zone jaune', headline: 'Vous faites plus juste que faux.', cta: 'Voir ce que la Construction corrige' },
            green: { label: 'Zone verte', headline: "Vous avez déjà bâti ce que la plupart des startups embauchent pour obtenir.", cta: "Voir à quoi ressemble l'accompagnement continu" },
        },
        categories: {
            Onboarding: { name: 'Intégration', description: 'La vitesse à laquelle vos nouveaux clients atteignent une vraie valeur.' },
            Adoption: { name: 'Adoption', description: "Si l'usage se transforme réellement en valeur pour votre entreprise." },
            Satisfaction: { name: 'Satisfaction', description: 'Les signaux qui révèlent ce que vos clients ressentent vraiment.' },
            Retention: { name: 'Rétention', description: 'Le chiffre qui protège tout le reste.' },
            Expansion: { name: 'Expansion', description: 'La croissance issue des clients que vous avez déjà.' },
            'GTM Strategy': { name: 'Stratégie GTM', description: 'La cause profonde que la plupart des équipes manquent.' },
            'Cross-Team Alignment': { name: 'Alignement inter-équipes', description: 'Ventes, CS et Produit, qui parlent enfin le même langage.' },
        },
    },
};

const defaultContextValue = {
    lang: 'fr',
    setLang: () => {},
    t: (path) => path,
};

const LanguageContext = createContext(defaultContextValue);

function getStoredLang() {
    if (typeof window === 'undefined') return 'fr';
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'en' || stored === 'fr' ? stored : 'fr';
    } catch {
        return 'fr';
    }
}

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(getStoredLang);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            // localStorage unavailable (private mode, etc.) — language just won't persist.
        }
        document.documentElement.lang = lang;
    }, [lang]);

    const value = useMemo(() => {
        const dict = translations[lang] || translations.fr;
        const t = (path) => {
            const parts = path.split('.');
            let node = dict;
            let fallbackNode = translations.en;
            for (const p of parts) {
                node = node?.[p];
                fallbackNode = fallbackNode?.[p];
            }
            return node ?? fallbackNode ?? path;
        };
        return { lang, setLang, t };
    }, [lang]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}
