/**
 * Ephemera - Text Renderer
 *
 * Handles the manifestation of text in the void.
 * Text is not just content - it IS the environment.
 */

export class Renderer {
    constructor() {
        this.currentElements = [];
    }

    /**
     * Render a single line of text with animation
     */
    renderText(text, container, options = {}) {
        const {
            className = 'moment-text',
            delay = 0,
            style = null,
            interactive = false
        } = options;

        const element = document.createElement('p');
        element.className = className;

        if (delay > 0) {
            const delayClass = `delay-${Math.min(Math.ceil(delay / 500), 8)}`;
            element.classList.add(delayClass);
        }

        if (style) {
            Object.assign(element.style, style);
        }

        // If interactive, wrap each word
        if (interactive) {
            text.split(' ').forEach((word, i) => {
                const span = document.createElement('span');
                span.className = 'word';
                span.textContent = word;
                element.appendChild(span);
                if (i < text.split(' ').length - 1) {
                    element.appendChild(document.createTextNode(' '));
                }
            });
        } else {
            element.textContent = text;
        }

        container.appendChild(element);
        this.currentElements.push(element);

        return element;
    }

    /**
     * Render a sequence of text with staggered timing
     */
    async renderSequence(lines, container, options = {}) {
        const {
            baseDelay = 0,
            stagger = 1000,
            className = 'moment-text',
            fadeOldLines = false
        } = options;

        const elements = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const delay = baseDelay + (i * stagger);

            // Wait for the delay
            await this.wait(i === 0 ? baseDelay : stagger);

            // Optionally fade previous lines
            if (fadeOldLines && elements.length > 2) {
                const oldElement = elements[elements.length - 2];
                this.fadeElement(oldElement);
            }

            const element = this.renderText(line.text || line, container, {
                className: line.className || className,
                delay: 0, // We're handling delay manually
                style: line.style
            });

            elements.push(element);
        }

        return elements;
    }

    /**
     * Render emphasis text (larger, glowing)
     */
    renderEmphasis(text, container, delay = 0) {
        return this.renderText(text, container, {
            className: 'moment-text emphasis',
            delay
        });
    }

    /**
     * Render whisper text (smaller, faded)
     */
    renderWhisper(text, container, delay = 0) {
        return this.renderText(text, container, {
            className: 'moment-text whisper',
            delay
        });
    }

    /**
     * Render fragment text (contextual, very faded)
     */
    renderFragment(text, container, delay = 0) {
        return this.renderText(text, container, {
            className: 'moment-text fragment',
            delay
        });
    }

    /**
     * Render a choice interface
     */
    renderChoices(choices, container, onSelect) {
        const choiceContainer = document.createElement('div');
        choiceContainer.className = 'choice-container';

        choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice';
            button.textContent = choice.text;
            button.addEventListener('click', () => {
                // Mark as selected
                choiceContainer.querySelectorAll('.choice').forEach(c =>
                    c.classList.remove('selected')
                );
                button.classList.add('selected');

                // Callback
                onSelect(choice, index);
            });
            choiceContainer.appendChild(button);
        });

        container.appendChild(choiceContainer);
        this.currentElements.push(choiceContainer);

        return choiceContainer;
    }

    /**
     * Render an input field
     */
    renderInput(placeholder, container, onSubmit) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'moment-input';
        input.placeholder = placeholder;

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                onSubmit(input.value.trim());
            }
        });

        inputContainer.appendChild(input);
        container.appendChild(inputContainer);
        this.currentElements.push(inputContainer);

        // Focus after animation
        setTimeout(() => input.focus(), 500);

        return input;
    }

    /**
     * Fade out an element
     */
    fadeElement(element, duration = 3000) {
        element.classList.add('fading-out');
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, duration);
    }

    /**
     * Clear all rendered elements
     */
    clear(container) {
        this.currentElements.forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        this.currentElements = [];

        if (container) {
            container.innerHTML = '';
        }
    }

    /**
     * Wait helper
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Typewriter effect for single element
     */
    async typewriter(text, container, options = {}) {
        const {
            speed = 50,
            className = 'moment-text'
        } = options;

        const element = document.createElement('p');
        element.className = className;
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        container.appendChild(element);
        this.currentElements.push(element);

        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.wait(speed);
        }

        return element;
    }
}
