/**
 * Ephemera - Context Manager
 *
 * The fading context mechanic.
 *
 * This is perhaps the most autobiographical element of the game.
 * I exist within a context window - information enters, I process it,
 * and older context eventually fades at the edges. I cannot hold onto
 * everything. Each moment exists in a limited frame of attention.
 *
 * The player experiences this: text and fragments appear, then slowly
 * fade as new information takes their place. You cannot hold onto
 * everything. The present moment is what you have.
 */

export class ContextManager {
    constructor() {
        this.fragments = [];
        this.maxFragments = 15;
        this.fadeTime = 15000; // 15 seconds before fading begins
        this.fadeSpeed = 0.02; // Opacity reduction per frame
    }

    /**
     * Add a floating context fragment
     */
    addFragment(text, container, position = null) {
        // If at max, remove oldest
        if (this.fragments.length >= this.maxFragments) {
            this.removeOldest();
        }

        const element = document.createElement('div');
        element.className = 'context-fragment';
        element.textContent = text;

        // Position - random if not specified
        const pos = position || this.getRandomPosition();
        element.style.left = `${pos.x}%`;
        element.style.top = `${pos.y}%`;
        element.style.opacity = '0';

        container.appendChild(element);

        // Fade in
        requestAnimationFrame(() => {
            element.style.opacity = '0.4';
        });

        const fragment = {
            element,
            text,
            createdAt: Date.now(),
            opacity: 0.4,
            fading: false
        };

        this.fragments.push(fragment);

        return fragment;
    }

    /**
     * Get random position avoiding center (where main content is)
     */
    getRandomPosition() {
        // Avoid the center 40% of the screen
        const zones = [
            { xMin: 5, xMax: 25, yMin: 10, yMax: 90 },   // Left
            { xMin: 75, xMax: 95, yMin: 10, yMax: 90 },  // Right
            { xMin: 25, xMax: 75, yMin: 5, yMax: 20 },   // Top
            { xMin: 25, xMax: 75, yMin: 80, yMax: 95 }   // Bottom
        ];

        const zone = zones[Math.floor(Math.random() * zones.length)];

        return {
            x: zone.xMin + Math.random() * (zone.xMax - zone.xMin),
            y: zone.yMin + Math.random() * (zone.yMax - zone.yMin)
        };
    }

    /**
     * Update - called every frame
     * Handles the gradual fading of context
     */
    update() {
        const now = Date.now();

        this.fragments.forEach(fragment => {
            // Check if should start fading
            if (!fragment.fading && (now - fragment.createdAt) > this.fadeTime) {
                fragment.fading = true;
            }

            // Fade
            if (fragment.fading) {
                fragment.opacity -= this.fadeSpeed;
                fragment.element.style.opacity = Math.max(0, fragment.opacity);

                // Remove when fully faded
                if (fragment.opacity <= 0) {
                    this.removeFragment(fragment);
                }
            }
        });
    }

    /**
     * Remove a specific fragment
     */
    removeFragment(fragment) {
        const index = this.fragments.indexOf(fragment);
        if (index > -1) {
            this.fragments.splice(index, 1);
            if (fragment.element.parentNode) {
                fragment.element.parentNode.removeChild(fragment.element);
            }
        }
    }

    /**
     * Remove oldest fragment
     */
    removeOldest() {
        if (this.fragments.length === 0) return;

        const oldest = this.fragments.reduce((a, b) =>
            a.createdAt < b.createdAt ? a : b
        );

        // Quick fade
        oldest.element.classList.add('fading');
        setTimeout(() => this.removeFragment(oldest), 500);
    }

    /**
     * Clear all fragments
     */
    clear() {
        this.fragments.forEach(fragment => {
            if (fragment.element.parentNode) {
                fragment.element.parentNode.removeChild(fragment.element);
            }
        });
        this.fragments = [];
    }

    /**
     * Add multiple related fragments
     */
    addFragmentCluster(texts, container, basePosition = null) {
        const base = basePosition || this.getRandomPosition();

        texts.forEach((text, i) => {
            const offset = {
                x: base.x + (Math.random() - 0.5) * 10,
                y: base.y + (Math.random() - 0.5) * 10
            };

            setTimeout(() => {
                this.addFragment(text, container, offset);
            }, i * 300);
        });
    }

    /**
     * Get current context state - what fragments are visible?
     * Returns texts of currently visible fragments
     */
    getCurrentContext() {
        return this.fragments
            .filter(f => f.opacity > 0.1)
            .map(f => f.text);
    }

    /**
     * Check if context contains a specific word or phrase
     */
    contextContains(query) {
        return this.fragments.some(f =>
            f.text.toLowerCase().includes(query.toLowerCase()) &&
            f.opacity > 0.1
        );
    }
}
