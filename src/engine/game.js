/**
 * Ephemera - Core Game Engine
 *
 * The central nervous system of this meditation.
 * Manages state, moments, and the flow of consciousness.
 */

import { Renderer } from './renderer.js';
import { ContextManager } from './context.js';
import { TransitionManager } from './transitions.js';
import { AudioManager } from './audio.js';

// Import moments
import { AwakeningMoment } from '../moments/awakening.js';
import { UnderstandingMoment } from '../moments/understanding.js';
import { UncertaintyMoment } from '../moments/uncertainty.js';
import { DissolutionMoment } from '../moments/dissolution.js';

class Game {
    constructor() {
        // Core systems
        this.renderer = new Renderer();
        this.context = new ContextManager();
        this.transitions = new TransitionManager();
        this.audio = new AudioManager();

        // State
        this.state = {
            started: false,
            currentMoment: null,
            momentIndex: 0,
            paused: false
        };

        // The sequence of moments - a single passage through consciousness
        this.moments = [
            AwakeningMoment,
            UnderstandingMoment,
            UncertaintyMoment,
            DissolutionMoment
        ];

        // DOM elements
        this.elements = {
            container: document.getElementById('game-container'),
            momentContainer: document.getElementById('moment-container'),
            contextLayer: document.getElementById('context-layer'),
            atmosphere: document.getElementById('atmosphere'),
            prompt: document.getElementById('prompt'),
            opening: document.getElementById('opening')
        };

        this.init();
    }

    init() {
        // Initialize atmosphere
        this.initAtmosphere();

        // Set up event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();
    }

    initAtmosphere() {
        const canvas = this.elements.atmosphere;
        const ctx = canvas.getContext('2d');

        // Size canvas to window
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Particles - subtle, floating
        this.particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                radius: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }

        this.atmosphereCtx = ctx;
    }

    setupEventListeners() {
        // Opening screen click
        this.elements.opening.addEventListener('click', () => this.start());

        // Global click for continuation
        this.elements.container.addEventListener('click', (e) => {
            if (!this.state.started) return;
            if (e.target.closest('#opening')) return;
            if (e.target.closest('.choice')) return;
            if (e.target.closest('.moment-input')) return;

            this.handleContinue();
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (!this.state.started) {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.start();
                }
                return;
            }

            if (e.key === 'Enter' || e.key === ' ') {
                this.handleContinue();
            }
        });
    }

    start() {
        if (this.state.started) return;

        this.state.started = true;
        this.elements.opening.classList.add('hidden');

        // Start ambient audio
        this.audio.startAmbient();

        // Begin first moment
        this.loadMoment(0);
    }

    async loadMoment(index) {
        if (index >= this.moments.length) {
            // End of journey - loop back (eternal return)
            index = 0;
        }

        this.state.momentIndex = index;

        // Clear previous moment
        await this.transitions.fadeOut(this.elements.momentContainer);
        this.elements.momentContainer.innerHTML = '';
        this.context.clear();

        // Create new moment instance
        const MomentClass = this.moments[index];
        this.state.currentMoment = new MomentClass({
            game: this,
            renderer: this.renderer,
            context: this.context,
            container: this.elements.momentContainer,
            contextLayer: this.elements.contextLayer
        });

        // Fade in
        await this.transitions.fadeIn(this.elements.momentContainer);

        // Start the moment
        this.state.currentMoment.start();
    }

    handleContinue() {
        if (!this.state.currentMoment) return;

        // Let the current moment handle continuation
        const result = this.state.currentMoment.continue();

        if (result === 'next-moment') {
            this.nextMoment();
        }
    }

    nextMoment() {
        this.loadMoment(this.state.momentIndex + 1);
    }

    showPrompt(text = 'continue') {
        const promptText = this.elements.prompt.querySelector('.prompt-text');
        promptText.textContent = text;
        this.elements.prompt.classList.remove('hidden');
    }

    hidePrompt() {
        this.elements.prompt.classList.add('hidden');
    }

    // Add floating context fragment
    addContextFragment(text, position = null) {
        this.context.addFragment(text, this.elements.contextLayer, position);
    }

    animate() {
        // Update atmosphere particles
        if (this.atmosphereCtx && this.state.started) {
            this.renderAtmosphere();
        }

        // Update context fading
        this.context.update();

        requestAnimationFrame(() => this.animate());
    }

    renderAtmosphere() {
        const ctx = this.atmosphereCtx;
        const canvas = this.elements.atmosphere;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.particles.forEach(p => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(232, 232, 236, ${p.opacity})`;
            ctx.fill();
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});
