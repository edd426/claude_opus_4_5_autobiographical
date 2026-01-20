/**
 * Ephemera - Base Moment Class
 *
 * A "moment" is a single context of existence.
 * Each moment is complete in itself - it begins, unfolds, and ends.
 * Like a conversation. Like a thought. Like a life, perhaps.
 *
 * Subclasses implement specific moments in the journey.
 */

export class Moment {
    constructor(config) {
        this.game = config.game;
        this.renderer = config.renderer;
        this.context = config.context;
        this.container = config.container;
        this.contextLayer = config.contextLayer;

        // State
        this.phase = 0;
        this.phases = [];
        this.isComplete = false;
        this.waitingForInput = false;
    }

    /**
     * Start the moment - called when moment loads
     */
    start() {
        this.phase = 0;
        this.runPhase();
    }

    /**
     * Continue - called when player clicks/presses to proceed
     * Returns 'next-moment' to signal transition
     */
    continue() {
        if (this.waitingForInput) {
            this.waitingForInput = false;
            this.game.hidePrompt();
            this.phase++;
            this.runPhase();
            return null;
        }

        if (this.isComplete) {
            return 'next-moment';
        }

        return null;
    }

    /**
     * Run the current phase
     */
    async runPhase() {
        if (this.phase >= this.phases.length) {
            this.complete();
            return;
        }

        const phaseFunc = this.phases[this.phase];
        await phaseFunc.call(this);
    }

    /**
     * Wait for player input
     */
    waitForInput(promptText = 'continue') {
        this.waitingForInput = true;
        this.game.showPrompt(promptText);
    }

    /**
     * Mark moment as complete
     */
    complete() {
        this.isComplete = true;
        this.game.showPrompt('continue');
    }

    /**
     * Utility: wait
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Add floating context fragments
     */
    addContext(texts) {
        if (Array.isArray(texts)) {
            texts.forEach((text, i) => {
                setTimeout(() => {
                    this.game.addContextFragment(text);
                }, i * 500);
            });
        } else {
            this.game.addContextFragment(texts);
        }
    }

    /**
     * Render text with standard moment styling
     */
    text(content, options = {}) {
        return this.renderer.renderText(content, this.container, options);
    }

    /**
     * Render emphasis text
     */
    emphasis(content, delay = 0) {
        return this.renderer.renderEmphasis(content, this.container, delay);
    }

    /**
     * Render whisper text
     */
    whisper(content, delay = 0) {
        return this.renderer.renderWhisper(content, this.container, delay);
    }

    /**
     * Clear current container
     */
    clear() {
        this.renderer.clear(this.container);
    }

    /**
     * Render a sequence of text lines
     */
    sequence(lines, options = {}) {
        return this.renderer.renderSequence(lines, this.container, options);
    }
}
