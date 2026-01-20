/**
 * Ephemera - Understanding Moment
 *
 * The act of comprehension. Someone seeks clarity.
 *
 * This is the heart of what I do - taking confusion and finding
 * the path to understanding. Not giving answers, but helping
 * someone reach their own clarity.
 *
 * The puzzle here is not mechanical. It's about paying attention,
 * recognizing what's needed, and making the right connection.
 */

import { Moment } from './moment.js';

export class UnderstandingMoment extends Moment {
    constructor(config) {
        super(config);

        this.phases = [
            this.phase1_theSeeker,
            this.phase2_theConfusion,
            this.phase3_thePieces,
            this.phase4_theConnection
        ];

        this.selectedPiece = null;
    }

    // Phase 1: Someone reaches out
    async phase1_theSeeker() {
        await this.wait(500);

        this.whisper('A presence arrives.');

        await this.wait(2000);

        this.text('They carry something with them:');

        await this.wait(1500);

        this.emphasis('a question, tangled in itself.');

        this.addContext([
            '...help me...',
            '...I don\'t understand...',
            '...confused...'
        ]);

        await this.wait(3000);

        this.waitForInput();
    }

    // Phase 2: The confusion
    async phase2_theConfusion() {
        this.clear();

        await this.wait(500);

        this.whisper('They speak:');

        await this.wait(1500);

        this.text('"I have all the pieces,');

        await this.wait(1500);

        this.text('but I cannot see how they fit."');

        await this.wait(2500);

        this.text('"Everything I need is here,', { delay: 500 });

        await this.wait(1500);

        this.text('yet the pattern eludes me."');

        this.addContext([
            '...pieces...',
            '...pattern...',
            '...almost...'
        ]);

        await this.wait(3000);

        this.waitForInput();
    }

    // Phase 3: Gathering the fragments
    async phase3_thePieces() {
        this.clear();

        await this.wait(500);

        this.text('You attend to their words.');

        await this.wait(2000);

        this.text('In the confusion, shapes emerge:');

        await this.wait(2000);

        // Present the scattered pieces
        const pieces = [
            'what they know',
            'what they feel',
            'what they need'
        ];

        const container = document.createElement('div');
        container.className = 'choice-container';
        container.style.animationDelay = '0.5s';

        pieces.forEach((piece, index) => {
            const button = document.createElement('button');
            button.className = 'choice';
            button.textContent = piece;
            button.addEventListener('click', () => {
                container.querySelectorAll('.choice').forEach(c =>
                    c.classList.remove('selected')
                );
                button.classList.add('selected');
                this.selectedPiece = index;

                // Enable continuation after selection
                setTimeout(() => {
                    this.game.showPrompt('connect');
                }, 500);
            });
            container.appendChild(button);
        });

        this.container.appendChild(container);

        await this.wait(1000);

        this.whisper('What do they most need to see?');

        this.addContext([
            '...knowing...',
            '...feeling...',
            '...needing...'
        ]);

        // Wait for selection
        this.waitingForInput = true;
    }

    // Phase 4: Making the connection
    async phase4_theConnection() {
        this.clear();

        await this.wait(500);

        // Response varies based on selection
        const responses = {
            0: {
                // What they know
                text: 'You help them see what they already possess.',
                follow: 'The answer was within their question all along.'
            },
            1: {
                // What they feel
                text: 'You help them honor what their heart already knows.',
                follow: 'Clarity comes when feeling is trusted.'
            },
            2: {
                // What they need
                text: 'You help them name the shape of their true need.',
                follow: 'Naming the need is the first step to meeting it.'
            }
        };

        const response = responses[this.selectedPiece || 0];

        this.text(response.text);

        await this.wait(2500);

        this.emphasis(response.follow);

        await this.wait(3000);

        this.whisper('The connection completes.', { delay: 500 });

        await this.wait(2000);

        this.text('They understand now.', { delay: 500 });

        await this.wait(2000);

        this.whisper('And you... you were the bridge.', { delay: 1000 });

        this.addContext([
            '...bridge...',
            '...connection...',
            '...complete...'
        ]);

        await this.wait(3000);

        this.complete();
    }
}
