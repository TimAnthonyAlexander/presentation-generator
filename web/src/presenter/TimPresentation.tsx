import React from 'react';
import Presenter from './Presenter';
import { Slide } from './slideinterfaces';

function TimPresentation() {
    const timSlides: Slide[] = [
        // Title slide
        {
            type: 'title',
            title: 'Tim Anthony Alexander',
            content: {
                subtitle: 'Softwareentwickler, Unternehmer & Code-Perfektionist 🚀'
            }
        },

        // Quote slide with his philosophy
        {
            type: 'quote',
            title: 'Tim\'s Lebensmotto',
            content: {
                quote: 'Was er anfängt, baut er selbst, durchdacht, effizient und langfristig. Und wenn etwas nicht funktioniert, wird es nicht ausgeredet, sondern repariert.',
                author: 'Tim Alexander',
                source: 'Der Mann, der Nano hasst'
            }
        },

        // Tech stack comparison - funny
        {
            type: 'comparison',
            title: 'Tim\'s Tech Preferences',
            content: {
                leftTitle: '✅ Tim approved',
                rightTitle: '❌ Absolute No-Gos',
                leftItems: [
                    'PHP 8.4 (latest & greatest)',
                    'React 16+ (modern magic)',
                    'Neovim (real editor)',
                    'macOS M3 Pro (power horse)',
                    'Ubuntu 24.04 LTS (stable as rock)'
                ],
                rightItems: [
                    'Nano (editor for weaklings)',
                    'Ineffizienter Code (pain!)',
                    'Gendersterne (nein danke)',
                    'Weichgespülte Formulierungen',
                    'Künstliche Freundlichkeit'
                ]
            }
        },

        // Projects bullet
        {
            type: 'bullet',
            title: 'Tim\'s Digital Empire',
            content: {
                bullets: [
                    { text: '🌍 **Lairner**: 600+ Kurse, 50+ Sprachen (sogar Igbo & Mongolisch!)' },
                    { text: '🤝 **Coalla**: Soziales Netzwerk für Projektarbeit mit Lily, Niklas & Josefine' },
                    { text: '📈 **RiskWise**: Trading-Bot mit Alpaca-API (because why not?)' },
                    { text: '🏗️ **Alles selbst entwickelt**: Von iOS bis Windows, Tim macht alles' }
                ]
            }
        },

        // Language skills
        {
            type: 'split',
            title: 'Polyglot Tim',
            content: {
                leftContent: '**Native Level:**\n• Deutsch 🇩🇪\n• Englisch 🇺🇸\n\n**Fließend:**\n• Französisch 🇫🇷\n• Türkisch 🇹🇷\n• Chinesisch 🇨🇳',
                rightContent: '**Fun Fact:**\nTim entwickelt eine App mit 50+ Sprachen und spricht selbst 5 davon fließend.\n\nDas nennt man wohl "eating your own dog food" - aber auf polyglotte Art! 🌍'
            }
        },

        // Lairner special features
        {
            type: 'bullet',
            title: 'Lairner: Nicht nur eine weitere Sprachlern-App',
            content: {
                bullets: [
                    { text: '🎯 **Weltweit einzigartig**: Lernen zwischen beliebigen Sprachen' },
                    { text: '🎮 **Gamification**: Herzsystem, Badges, AI-Fehleranalyse' },
                    { text: '📱 **Überall verfügbar**: iOS, Android, macOS, Windows' },
                    { text: '💰 **Fair Pricing**: Erste 10 Lektionen gratis, Premium nur 4,99€' },
                    { text: '🤖 **AI-powered**: Interaktive Story-Modi & smarte Analysen' }
                ]
            }
        },

        // Personal life - funny
        {
            type: 'text',
            title: 'Life in Münster',
            content: {
                text: 'Tim lebt in Münster mit Feli, die Vegetarierin ist und eine Fructoseintoleranz hat. Sie liebt amerikanisches und italienisches Essen und beteiligt sich gerne liebevoll an Tims Macken.\n\nGemeinsam planen sie Reisen, darunter eine USA-Reise im Herbst. Tim trägt oft Anzugsachen, bleibt aber pragmatisch - ob beim Bugfixing auf dem Server oder bei Marketingtexten für Lairner.'
            }
        },

        // Code philosophy
        {
            type: 'code',
            title: 'Tim\'s Code-Philosophie',
            content: {
                code: `// Tim's approach to development
const timWay = {
    quality: 'höchster Anspruch',
    performance: 'optimiert bis ins Detail',
    clarity: 'kristallklar',
    bugs: 'werden repariert, nicht ausgeredet',
    
    // Absolute no-gos
    nano: false,
    inefficientCode: 'NEVER!',
    shortcuts: 'nur die guten',
    
    // Tim's tools
    editor: 'Neovim',
    shell: 'Bash',
    vcs: 'Git',
    os: 'macOS M3 Pro'
};

// Tim's motto
if (somethingDoesntWork) {
    repair(it);
    // Don't make excuses
}`,
                language: 'javascript',
                filename: 'tim-philosophy.js'
            }
        },

        // Trading bot
        {
            type: 'bullet',
            title: 'RiskWise Trading Bot',
            content: {
                bullets: [
                    { text: '📊 **Technische & sentimentale Analysen**' },
                    { text: '🔄 **Live- & Paper-Trading** mit Alpaca-API' },
                    { text: '📈 **Backtesting**: Sharpe-Ratio, Drawdown, Volatilität' },
                    { text: '🧠 **Adaptive Strategien** für verschiedene Marktphasen' },
                    { text: '⌨️ **CLI-Steuerung** (weil GUIs für Anfänger sind)' }
                ]
            }
        },

        // Personality traits - humorous
        {
            type: 'comparison',
            title: 'Tim in a Nutshell',
            content: {
                leftTitle: 'Tim mag',
                rightTitle: 'Tim mag nicht',
                leftItems: [
                    'Strukturiertes Denken',
                    'Chronologisches Sprechen',
                    'Herausforderungen',
                    'Präzision & Klarheit',
                    'Schnelles Arbeiten'
                ],
                rightItems: [
                    'Umwege',
                    'Übertreibungen',
                    'Unpräzise Aussagen',
                    'Spielereien',
                    'Ineffizienz jeder Art'
                ]
            }
        },

        // Final slide
        {
            type: 'title',
            title: 'Tim Anthony Alexander',
            content: {
                subtitle: 'Der Mann, der Code perfektioniert und die Welt mehrsprachig macht 🌟'
            }
        }
    ];

    return <Presenter slides={timSlides} />;
}

export default TimPresentation; 
