/**
 * Shared utilities for engine builder UI components
 */

import { localization } from '../localization';

/**
 * Create a labeled input element
 */
export function createLabeledInput(
    label: string,
    type: string = 'number',
    min?: string,
    max?: string,
    step?: string
): { container: HTMLDivElement; label: HTMLLabelElement; input: HTMLInputElement } {
    const container = document.createElement('div');
    container.classList.add('flex-row');
    container.style.marginBottom = '8px';

    const labelEl = document.createElement('label');
    labelEl.textContent = localization.translate(label);
    labelEl.style.display = 'inline-block';
    labelEl.style.minWidth = '200px';
    labelEl.style.marginRight = '10px';

    const input = document.createElement('input');
    input.type = type;
    if (min !== undefined) input.min = min;
    if (max !== undefined) input.max = max;
    if (step !== undefined) input.step = step;
    input.style.width = '150px';

    container.appendChild(labelEl);
    container.appendChild(input);

    return { container, label: labelEl, input };
}

/**
 * Create a labeled select element
 */
export function createLabeledSelect(
    label: string,
    options: string[]
): { container: HTMLDivElement; label: HTMLLabelElement; select: HTMLSelectElement } {
    const container = document.createElement('div');
    container.classList.add('flex-row');
    container.style.marginBottom = '8px';

    const labelEl = document.createElement('label');
    labelEl.textContent = localization.translate(label);
    labelEl.style.display = 'inline-block';
    labelEl.style.minWidth = '200px';
    labelEl.style.marginRight = '10px';

    const select = document.createElement('select');
    select.style.width = '150px';

    for (const optText of options) {
        const opt = document.createElement('option');
        opt.textContent = optText;
        select.appendChild(opt);
    }

    container.appendChild(labelEl);
    container.appendChild(select);

    return { container, label: labelEl, select };
}

/**
 * Create a labeled checkbox element
 */
export function createLabeledCheckbox(
    label: string
): { container: HTMLDivElement; label: HTMLLabelElement; checkbox: HTMLInputElement } {
    const container = document.createElement('div');
    container.classList.add('flex-row');
    container.style.marginBottom = '8px';

    const labelEl = document.createElement('label');
    labelEl.textContent = localization.translate(label);
    labelEl.style.display = 'inline-block';
    labelEl.style.minWidth = '200px';
    labelEl.style.marginRight = '10px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    container.appendChild(labelEl);
    container.appendChild(checkbox);

    return { container, label: labelEl, checkbox };
}

/**
 * Create a labeled display element (read-only)
 */
export function createLabeledDisplay(
    label: string
): { container: HTMLDivElement; label: HTMLLabelElement; display: HTMLLabelElement } {
    const container = document.createElement('div');
    container.classList.add('flex-row');
    container.style.marginBottom = '8px';

    const labelEl = document.createElement('label');
    labelEl.textContent = localization.translate(label);
    labelEl.style.display = 'inline-block';
    labelEl.style.minWidth = '200px';
    labelEl.style.marginRight = '10px';

    const display = document.createElement('label');
    display.style.fontWeight = 'bold';
    display.textContent = '0';

    container.appendChild(labelEl);
    container.appendChild(display);

    return { container, label: labelEl, display };
}

/**
 * Create a section container
 */
export function createSection(title?: string): HTMLDivElement {
    const section = document.createElement('div');
    section.classList.add('builder-section');
    section.style.padding = '10px';
    section.style.marginBottom = '10px';
    section.style.border = '1px solid #ccc';
    section.style.borderRadius = '4px';

    if (title) {
        const heading = document.createElement('h3');
        heading.textContent = localization.translate(title);
        heading.style.marginTop = '0';
        section.appendChild(heading);
    }

    return section;
}

/**
 * Blink animation to show value changed
 */
export function blinkElement(element: HTMLElement, good: boolean = true): void {
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = good ? '#90EE90' : '#FFB6C1';
    element.style.transition = 'background-color 0.5s';

    setTimeout(() => {
        element.style.backgroundColor = originalBg;
    }, 500);
}
