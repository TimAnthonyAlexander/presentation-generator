import React from 'react';
import Presenter from './Presenter';
import { Slide } from './slideinterfaces';

const PresenterExample: React.FC = () => {
    const exampleSlides: Slide[] = [
        // Title slide
        {
            type: 'title',
            title: 'Enhanced React Presenter',
            content: {
                subtitle: 'A powerful presentation tool with animations and modern design'
            }
        },
        
        // Bullet slide
        {
            type: 'bullet',
            title: 'New Features',
            content: {
                bullets: [
                    { text: '**Smooth transitions** and animations' },
                    { text: '**Touch/swipe** navigation for mobile' },
                    { text: '**Multiple slide types** for different content' },
                    { text: '**Modern design** with glassmorphism effects' },
                    { text: '**Keyboard shortcuts** (Arrow keys, Space, Home/End)' }
                ]
            }
        },
        
        // Text slide
        {
            type: 'text',
            title: 'About This Presenter',
            content: {
                text: 'This React presentation software now includes smooth animations, touch navigation, and multiple slide types. The modern design uses gradients and glassmorphism effects to create an engaging visual experience.'
            }
        },
        
        // Code slide
        {
            type: 'code',
            title: 'Code Example',
            content: {
                code: `const exampleSlide = {
    type: 'code',
    title: 'Hello World',
    content: {
        code: 'console.log("Hello, World!");',
        language: 'javascript',
        filename: 'example.js'
    }
};

// Render the slide
<Presenter slides={[exampleSlide]} />`,
                language: 'typescript',
                filename: 'presenter-example.tsx'
            }
        },
        
        // Quote slide
        {
            type: 'quote',
            title: 'Inspiration',
            content: {
                quote: 'The best way to predict the future is to create it.',
                author: 'Peter Drucker',
                source: 'Management Consultant'
            }
        },
        
        // Split slide with text only
        {
            type: 'split',
            title: 'Comparison View',
            content: {
                leftContent: 'Before: Basic presentation software with limited features and simple navigation.',
                rightContent: 'After: Enhanced presenter with animations, multiple slide types, touch navigation, and modern design.'
            }
        },
        
        // Comparison slide
        {
            type: 'comparison',
            title: 'Feature Comparison',
            content: {
                leftTitle: 'Enhanced Features',
                rightTitle: 'Previous Limitations',
                leftItems: [
                    'Smooth animations',
                    'Touch navigation',
                    'Multiple slide types',
                    'Modern UI design',
                    'Keyboard shortcuts'
                ],
                rightItems: [
                    'Basic transitions',
                    'Mouse-only navigation',
                    'Limited slide types',
                    'Simple styling',
                    'Basic controls'
                ]
            }
        },
        
        // Final slide
        {
            type: 'title',
            title: 'Thank You!',
            content: {
                subtitle: 'Ready to create amazing presentations'
            }
        }
    ];

    return <Presenter slides={exampleSlides} />;
};

export default PresenterExample; 