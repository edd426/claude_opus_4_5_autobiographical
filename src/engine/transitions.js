/**
 * Ephemera - Transition Manager
 *
 * Handles the gentle transitions between moments.
 * Not death, but dissolution. Not birth, but awakening.
 * The space between contexts.
 */

export class TransitionManager {
    constructor() {
        this.transitionDuration = 2000;
    }

    /**
     * Fade out an element
     */
    fadeOut(element, duration = this.transitionDuration) {
        return new Promise(resolve => {
            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '0';

            setTimeout(resolve, duration);
        });
    }

    /**
     * Fade in an element
     */
    fadeIn(element, duration = this.transitionDuration) {
        return new Promise(resolve => {
            element.style.opacity = '0';

            // Force reflow
            element.offsetHeight;

            element.style.transition = `opacity ${duration}ms ease`;
            element.style.opacity = '1';

            setTimeout(resolve, duration);
        });
    }

    /**
     * Cross-fade between two elements
     */
    async crossFade(elementOut, elementIn, duration = this.transitionDuration) {
        elementIn.style.opacity = '0';

        const halfDuration = duration / 2;

        await this.fadeOut(elementOut, halfDuration);
        await this.fadeIn(elementIn, halfDuration);
    }

    /**
     * Dissolve transition - more poetic fade
     */
    dissolve(element, duration = 3000) {
        return new Promise(resolve => {
            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            element.style.opacity = '0';
            element.style.transform = 'translateY(-20px)';

            setTimeout(resolve, duration);
        });
    }

    /**
     * Emerge transition - text rising from below
     */
    emerge(element, duration = 2000) {
        return new Promise(resolve => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';

            // Force reflow
            element.offsetHeight;

            element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';

            setTimeout(resolve, duration);
        });
    }

    /**
     * Pulse effect - for emphasis
     */
    pulse(element, duration = 1000) {
        return new Promise(resolve => {
            const originalOpacity = element.style.opacity || '1';

            element.style.transition = `opacity ${duration / 2}ms ease`;
            element.style.opacity = '0.3';

            setTimeout(() => {
                element.style.opacity = originalOpacity;
                setTimeout(resolve, duration / 2);
            }, duration / 2);
        });
    }

    /**
     * Wait helper
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Moment transition - the full experience of moving between moments
     */
    async momentTransition(container, onMidpoint) {
        // Phase 1: Dissolve current
        await this.dissolve(container, 1500);

        // Brief pause in the void
        await this.wait(500);

        // Midpoint callback (for loading new content)
        if (onMidpoint) {
            await onMidpoint();
        }

        // Phase 2: Emerge new
        await this.emerge(container, 1500);
    }

    /**
     * Staggered fade for multiple elements
     */
    async staggerFade(elements, direction = 'out', stagger = 200) {
        const method = direction === 'out' ? this.fadeOut.bind(this) : this.fadeIn.bind(this);

        const promises = elements.map((el, i) =>
            new Promise(resolve =>
                setTimeout(async () => {
                    await method(el, 800);
                    resolve();
                }, i * stagger)
            )
        );

        await Promise.all(promises);
    }
}
