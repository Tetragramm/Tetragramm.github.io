/**
 * DOM Utility Functions for WASM Components
 *
 * Shared functions for creating common DOM elements to reduce duplication
 */

import { localization } from './localization';

/**
 * Global ID counter for generating unique element IDs
 */
let idCounter = 0;

/**
 * Generate a unique ID for DOM elements
 * Used to link labels to inputs via htmlFor attribute
 */
export function generateUniqueId(prefix: string = 'elem'): string {
    idCounter++;
    return `${prefix}_${idCounter}`;
}

/**
 * Create flex section matching original Tools.ts CreateFlexSection
 */
export function createFlexSection(): { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement } {
    const div0 = document.createElement('div');
    div0.className = 'flex-container-o';

    const div1 = document.createElement('div');
    div1.className = 'flex-container-i';

    const div2 = document.createElement('div');
    div2.className = 'flex-container-i';

    div0.appendChild(div1);
    div0.appendChild(div2);

    return { div0, div1, div2 };
}

/**
 * Create a select element with label wrapper (non-flex layout)
 * Wraps an existing select element with a label and span, optionally adding a line break
 * @param text - Label text to display
 * @param select - The select element to wrap
 * @param parent - Parent element to append to
 * @param br - Whether to add a line break after (default: true)
 */
export function createSelect(text: string, select: HTMLSelectElement, parent: HTMLElement, br: boolean = true): void {
    const span = document.createElement('span');
    const label = document.createElement('label');
    select.id = generateUniqueId('select');
    label.htmlFor = select.id;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    label.textContent = text;
    span.appendChild(label);
    span.appendChild(select);
    parent.appendChild(span);
    if (br) {
        parent.appendChild(document.createElement('br'));
    }
}

/**
 * Create a button with clickable label (hidden button pattern)
 * Button is hidden, label is styled to look like a button and is clickable
 * @param text - Text to display on the label
 * @param button - The button element (will be hidden)
 * @param parent - Parent element to append to
 * @param br - Whether to add a line break after (default: true)
 * @returns Object with label and span elements for further customization
 */
export function createButton(text: string, button: HTMLElement, parent: HTMLElement, br: boolean = true): { label: HTMLLabelElement, span: HTMLSpanElement } {
    const span = document.createElement('span');
    const label = document.createElement('label');
    button.hidden = true;
    button.id = generateUniqueId('btn');
    button.textContent = text;
    label.htmlFor = button.id;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    label.textContent = text;
    label.classList.add('lbl_action');
    label.classList.add('btn_th');
    span.appendChild(label);
    span.appendChild(button);
    parent.appendChild(span);
    if (br) {
        parent.appendChild(document.createElement('br'));
    }
    return { label, span };
}

/**
 * Create a rules link with standard formatting
 * @param sectionName - The anchor name in the Rules HTML (e.g., "_Cockpits", "_Era")
 * @returns An H4 element containing the formatted rules link
 */
export function createRulesLink(sectionName: string, specialText?: string): HTMLElement {
    const rulesLine = document.createElement('h4');
    const rulesSpan = document.createElement('span');
    const rulesLink = document.createElement('a');
    rulesLink.href = `./Rules/Rules_${localization.getCurrentLocale()}.html#${sectionName}`;
    const rulesText = document.createElement('u');
    if (specialText === undefined) {
        rulesText.textContent = localization.translate('Rules');
    } else {
        rulesText.textContent = specialText;
    }
    rulesLink.appendChild(rulesText);
    rulesSpan.appendChild(document.createTextNode('('));
    rulesSpan.appendChild(rulesLink);
    rulesSpan.appendChild(document.createTextNode(') '));
    rulesLine.appendChild(rulesSpan);

    return rulesLine;
}

/**
 * Create a select element with options from a binding
 * @param binding - The binding object with options and selected properties
 * @param onChange - Callback when selection changes, receives new selected index
 * @returns The created select element
 */
export function createSelectElement(
    binding: any,
    onChange: (selectedIndex: number) => void
): HTMLSelectElement {
    const select = document.createElement('select');
    select.disabled = !binding.enabled;

    if (binding.options) {
        binding.options.forEach((opt: any, idx: number) => {
            const option = document.createElement('option');
            option.value = idx.toString();
            option.textContent = opt.name;
            option.disabled = !opt.enabled;
            if (idx === binding.selected) {
                option.selected = true;
            }
            select.appendChild(option);
        });
    }

    select.selectedIndex = binding.selected;
    select.addEventListener('change', () => {
        onChange(parseInt(select.value));
    });

    return select;
}

/**
 * Update a select element's state from a binding
 * @param select - The select element to update
 * @param binding - The binding with current state
 */
export function updateSelectElement(select: HTMLSelectElement, binding: any): void {
    if (binding.options) {
        if (binding.options.length == select.options.length) {
            binding.options.forEach((opt: any, idx: number) => {
                select.options[idx].text = opt.name;
                select.options[idx].disabled = !opt.enabled;
            });
        } else {
            for (let idx = select.options.length - 1; idx >= 0; idx--) {
                select.remove(idx);
            }
            binding.options.forEach((opt: any, idx: number) => {
                const option = document.createElement('option');
                option.value = idx.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                if (idx === binding.selected) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        }
    }

    select.selectedIndex = binding.selected;
    select.disabled = !binding.enabled;
}

/**
 * Create a flex checkbox with label
 * @param binding - The binding object with name, selected, and enabled
 * @param flexContainer - The flex container to add the checkbox to
 * @param onChange - Callback when checkbox changes, receives new checked state
 * @returns The created checkbox input element
 */
export function createFlexCheckbox(
    binding: any,
    flexContainer: { div1: HTMLElement, div2: HTMLElement },
    onChange: (checked: boolean) => void
): HTMLInputElement {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = generateUniqueId('checkbox');
    checkbox.className = 'flex-item';
    checkbox.checked = binding.selected;
    checkbox.disabled = !binding.enabled;
    checkbox.addEventListener('change', () => {
        onChange(checkbox.checked);
    });

    const label = document.createElement('label');
    label.htmlFor = checkbox.id;
    label.textContent = binding.name;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    flexContainer.div2.appendChild(checkbox);

    return checkbox;
}

/**
 * Create a flex number input with label
 * @param binding - The binding object with name, value, and enabled
 * @param flexContainer - The flex container to add the input to
 * @param onChange - Callback when value changes, receives new number value
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (optional)
 * @param step - Step value (default: 1)
 * @returns The created input element
 */
export function createFlexNumberInput(
    binding: any,
    flexContainer: { div1: HTMLElement, div2: HTMLElement },
    onChange: (value: number) => void,
    min: string = '0',
    max?: string,
    step: string = '1'
): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = generateUniqueId('number');
    input.min = min;
    if (max !== undefined) {
        input.max = max;
    }
    input.step = step;
    input.className = 'flex-item';
    input.value = binding.value.toString();
    input.disabled = !binding.enabled;
    input.addEventListener('change', () => {
        onChange(parseInt(input.value) || 0);
    });

    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = binding.name;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    flexContainer.div2.appendChild(input);

    return input;
}

/**
 * Create a mobile-friendly number input with large +/- buttons
 * @param binding - The binding object with name, value, and enabled
 * @param parent - The parent element to append to
 * @param onChange - Callback when value changes, receives new number value
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (optional)
 * @param step - Step value (default: 1)
 * @returns Object with container and input element
 */
export function createMobileNumberInput(
    binding: any,
    parent: HTMLElement,
    onChange: (value: number) => void,
    min: number = 0,
    max?: number,
    step: number = 1
): { container: HTMLElement, input: HTMLInputElement } {
    const container = document.createElement('div');
    container.className = 'mobile-number-container';

    // Minus button
    const minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'mobile-number-btn';
    minusBtn.textContent = '-';
    minusBtn.disabled = !binding.enabled || binding.value <= min;

    // Number input
    const input = document.createElement('input');
    input.type = 'number';
    input.id = generateUniqueId('mobile-number');
    input.className = 'mobile-number-input';
    input.min = min.toString();
    if (max !== undefined) {
        input.max = max.toString();
    }
    input.step = step.toString();
    input.value = binding.value.toString();
    input.disabled = !binding.enabled;

    // Plus button
    const plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'mobile-number-btn';
    plusBtn.textContent = '+';
    plusBtn.disabled = !binding.enabled || (max !== undefined && binding.value >= max);

    // Update button states based on value
    const updateButtonStates = () => {
        const value = parseInt(input.value) || 0;
        minusBtn.disabled = !binding.enabled || value <= min;
        plusBtn.disabled = !binding.enabled || (max !== undefined && value >= max);
    };

    // Event handlers
    minusBtn.onclick = () => {
        const currentValue = parseInt(input.value) || 0;
        const newValue = Math.max(min, currentValue - step);
        input.value = newValue.toString();
        onChange(newValue);
        updateButtonStates();
    };

    plusBtn.onclick = () => {
        const currentValue = parseInt(input.value) || 0;
        const newValue = max !== undefined ? Math.min(max, currentValue + step) : currentValue + step;
        input.value = newValue.toString();
        onChange(newValue);
        updateButtonStates();
    };

    input.addEventListener('change', () => {
        let value = parseInt(input.value) || 0;
        // Clamp value to min/max
        value = Math.max(min, value);
        if (max !== undefined) {
            value = Math.min(max, value);
        }
        input.value = value.toString();
        onChange(value);
        updateButtonStates();
    });

    container.appendChild(minusBtn);
    container.appendChild(input);
    container.appendChild(plusBtn);
    parent.appendChild(container);

    return { container, input };
}

/**
 * Create a mobile-friendly option item with title and content
 * @param title - Title text for the option
 * @param parent - Parent element to append to
 * @returns Object with container and content div for adding controls
 */
export function createMobileOptionItem(
    title: string,
    parent: HTMLElement
): { container: HTMLElement, content: HTMLElement } {
    const container = document.createElement('div');
    container.className = 'mobile-option-item';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'mobile-option-title';
    titleDiv.textContent = title;
    container.appendChild(titleDiv);

    const content = document.createElement('div');
    content.className = 'mobile-option-content';
    container.appendChild(content);

    parent.appendChild(container);

    return { container, content };
}

/**
 * Create a mobile-friendly checkbox with larger touch target
 * @param binding - The binding object with name, selected, and enabled
 * @param parent - Parent element to append to
 * @param onChange - Callback when checkbox changes
 * @returns The created checkbox input element
 */
export function createMobileCheckbox(
    binding: any,
    parent: HTMLElement,
    onChange: (checked: boolean) => void
): HTMLInputElement {
    const label = document.createElement('label');
    label.className = 'mobile-checkbox-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = generateUniqueId('mobile-checkbox');
    checkbox.checked = binding.selected;
    checkbox.disabled = !binding.enabled;
    checkbox.addEventListener('change', () => {
        onChange(checkbox.checked);
    });

    const text = document.createElement('span');
    text.textContent = binding.name;

    label.appendChild(checkbox);
    label.appendChild(text);
    parent.appendChild(label);

    return checkbox;
}

/**
 * Create a mobile-friendly select with full width styling
 * @param binding - The binding object with options and selected
 * @param parent - Parent element to append to
 * @param onChange - Callback when selection changes
 * @returns The created select element
 */
export function createMobileSelect(
    binding: any,
    parent: HTMLElement,
    onChange: (selectedIndex: number) => void
): HTMLSelectElement {
    const select = createSelectElement(binding, onChange);
    select.className = 'mobile-select';
    parent.appendChild(select);
    return select;
}

/**
 * Create a mobile stats grid
 * @param stats - Stats object
 * @param statConfig - Configuration for which stats to display
 * @param derivedStats - Optional derived stats
 * @returns HTML element containing the stats grid
 */
export function createMobileStatsGrid(
    stats: any,
    statConfig: StatDisplayConfig[],
    derivedStats?: any
): HTMLDivElement {
    const grid = document.createElement('div');
    grid.className = 'mobile-stats-grid';

    statConfig.forEach(config => {
        if (!config.key) return; // Skip empty configs

        const item = document.createElement('div');
        item.className = 'mobile-stat-item';

        const labelDiv = document.createElement('div');
        labelDiv.className = 'mobile-stat-label';
        labelDiv.textContent = localization.translate(config.label);
        item.appendChild(labelDiv);

        const valueDiv = document.createElement('div');
        valueDiv.className = 'mobile-stat-value';

        // Get the value from stats or derivedStats
        let value = undefined;
        if (config.isDerived === undefined) {
            value = stats[config.key];
        } else {
            value = derivedStats[config.key];
            // Handle special cases (like flight stress range)
            if (config.key === 'flightstress') {
                const norm = derivedStats["flight_stress_norm"];
                const cp = derivedStats['flight_stress_cp'];
                if (norm != cp) {
                    value = norm.toString() + " (" + cp.toString() + ")";
                } else {
                    value = norm.toString()
                }
            }
        }

        if (typeof (value) == 'boolean') {
            if (value) {
                value = 'Yes';
            } else {
                value = 'No';
            }
        } else if (typeof (value) == 'number') {
            value = parseFloat(value?.toPrecision(4)).toString() || '';
        } else {
            value = value?.toString() || '';
        }

        valueDiv.textContent = value;

        if (config.isDerived) {
            item.classList.add('part_local');
        }

        item.appendChild(valueDiv);
        grid.appendChild(item);
    });

    return grid;
}

/**
 * Update a mobile stats grid
 * @param grid - stats grid to update
 * @param stats - Stats object
 * @param statConfig - Configuration for which stats to display
 * @param derivedStats - Optional derived stats
 * @returns HTML element containing the stats grid
 */
export function updateMobileStatsGrid(
    grid: HTMLDivElement,
    stats: any,
    statConfig: StatDisplayConfig[],
    derivedStats?: any
) {

    for (let idx = 0; idx < statConfig.length; idx++) {
        const config = statConfig[idx];
        const item = grid.children[idx];
        let valueDiv = item.children[1];

        // Get the value from stats or derivedStats
        let value = undefined;
        if (config.isDerived === undefined) {
            value = stats[config.key];
        } else {
            value = derivedStats[config.key];
            // Handle special cases (like flight stress range)
            if (config.key === 'flightstress') {
                const norm = derivedStats["flight_stress_norm"];
                const cp = derivedStats['flight_stress_cp'];
                if (norm != cp) {
                    value = norm.toString() + " (" + cp.toString() + ")";
                } else {
                    value = norm.toString()
                }
            }
        }

        if (typeof (value) == 'boolean') {
            if (value) {
                value = 'Yes';
            } else {
                value = 'No';
            }
        } else if (typeof (value) == 'number') {
            value = parseFloat(value?.toPrecision(4)).toString() || '';
        } else {
            value = value?.toString() || '';
        }

        blinkIfChanged(valueDiv, value, config.positiveIsGood);
    }
}

/**
 * Check if the current device is in mobile view
 */
export function isMobileView(): boolean {
    return window.innerWidth <= 768;
}

export function BlinkBad(elem: Element) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.scrollHeight;
    elem.classList.toggle("changed_b");
}

export function BlinkGood(elem: Element) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.scrollHeight;
    elem.classList.toggle("changed_g");
}

export function BlinkNeutral(elem: Element) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.scrollHeight;
    elem.classList.toggle("changed_n");
}

export function BlinkNone(elem: Element) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
}

/**
 * Update stat cells with blink animation when changed
 * @param elem - The table cell element to update
 * @param newValue - The new value to display
 * @param positiveGood - Whether positive values are good (for potential future styling)
 */
export function blinkIfChanged(elem: Element, newValue: string, positiveGood?: boolean): void {
    if (elem.textContent != newValue) {
        if (positiveGood == undefined) {
            BlinkNeutral(elem);
        } else {
            const positive = parseInt(elem.textContent) < parseInt(newValue);
            if (positiveGood && positive || (!positiveGood && !positive)) {
                BlinkGood(elem);
            } else {
                BlinkBad(elem);
            }
        }
    } else {
        BlinkNone(elem);
    }
    elem.textContent = newValue;
}

/**
 * Create a stats table
 * @param stats Stats object from Rust
 * @param statConfig Configuration for which stats to display and how
 * @param derivedStats Optional derived stats for the component
 * @returns HTML table element with stats
 */
export function createStatsTable(
    stats: any,
    statConfig: StatDisplayConfig[],
    derivedStats?: any,
    statsPerRow = 3
): HTMLTableElement {
    const table = document.createElement('table');
    table.className = 'inner_table';

    // Group stats into rows
    for (let i = 0; i < statConfig.length; i += statsPerRow) {
        const rowStats = statConfig.slice(i, Math.min(i + statsPerRow, statConfig.length));

        // Header row
        const headerRow = table.insertRow();
        rowStats.forEach(config => {
            const th = document.createElement('th');
            th.textContent = localization.translate(config.label);
            headerRow.appendChild(th);
        });

        // Value row
        const valueRow = table.insertRow();
        rowStats.forEach(config => {
            const td = valueRow.insertCell();

            // Get the value from stats or derivedStats
            let value = undefined;
            if (config.isDerived === undefined) {
                value = stats[config.key];
            } else {
                value = derivedStats[config.key];
                // Handle special cases (like flight stress range)
                if (config.key === 'flightstress') {
                    const norm = derivedStats["flight_stress_norm"];
                    const cp = derivedStats['flight_stress_cp'];
                    if (norm != cp) {
                        value = norm.toString() + " (" + cp.toString() + ")";
                    } else {
                        value = norm.toString()
                    }
                }
            }

            if (typeof (value) == 'boolean') {
                if (value) {
                    value = 'Yes';
                } else {
                    value = 'No';
                }
            } else if (typeof (value) == 'number') {
                value = parseFloat(value?.toPrecision(4)).toString() || '';
            } else {
                value = value?.toString() || '';
            }

            td.textContent = value;

            // Apply derived stat styling if applicable
            if (config.isDerived) {
                td.className = 'part_local';
            }
        });
    }

    return table;
}

/**
 * Update all stat cells from a stats object
 * @param statCells - Map of cell elements keyed by stat name
 * @param stats - Object containing stat values
 */
export function updateStatsTable(
    table: HTMLTableElement,
    stats: any,
    statConfig: StatDisplayConfig[],
    derivedStats?: any,
    statsPerRow = 3
): void {
    // Group stats into rows
    let row_idx = 1;
    for (let i = 0; i < statConfig.length; i += statsPerRow) {
        const rowStats = statConfig.slice(i, Math.min(i + statsPerRow, statConfig.length));

        // Value row
        const valueRow = table.rows[row_idx];
        row_idx += 2;
        for (let j = 0; j < rowStats.length; j++) {
            const config = rowStats[j];
            const td = valueRow.cells[j];

            // Get the value from stats or derivedStats
            let value = undefined;
            if (config.isDerived === undefined) {
                value = stats[config.key];
            } else {
                value = derivedStats[config.key];
                // Handle special cases (like flight stress range)
                if (config.key === 'flightstress') {
                    const norm = derivedStats["flight_stress_norm"];
                    const cp = derivedStats['flight_stress_cp'];
                    if (norm != cp) {
                        value = norm.toString() + " (" + cp.toString() + ")";
                    } else {
                        value = norm.toString()
                    }
                }
            }

            if (typeof (value) == 'boolean') {
                if (value) {
                    value = 'Yes';
                } else {
                    value = 'No';
                }
            } else if (typeof (value) == 'number') {
                value = parseFloat(value?.toPrecision(4)).toString() || '';
            } else {
                value = value?.toString() || '';
            }

            // Apply derived stat styling if applicable
            if (config.isDerived) {
                td.className = 'part_local';
            }
            blinkIfChanged(td, value, config.positiveIsGood);
        }
    }
}

/**
 * Create a table cell with flex section ready for building custom layouts
 * The flex container is pre-appended to the cell for convenience
 * @returns Object with cell and flex container
 */
export function createFlexCell(): {
    cell: HTMLTableCellElement;
    flex: ReturnType<typeof createFlexSection>;
} {
    const cell = document.createElement('td');
    const flex = createFlexSection();
    cell.appendChild(flex.div0);
    return { cell, flex };
}

/**
 * Create checkboxes in a flex section from binding array
 * @param flex - The flex container to add checkboxes to
 * @param bindingArray - Array of checkbox bindings
 * @param createCallback - Function that returns callback for a specific index
 * @returns Array of created checkbox elements
 */
export function createFlexCheckboxes(
    flex: ReturnType<typeof createFlexSection>,
    bindingArray: any[],
    createCallback: (index: number) => (checked: boolean) => void
): HTMLInputElement[] {
    const checkboxes: HTMLInputElement[] = [];
    bindingArray.forEach((binding, idx) => {
        const checkbox = createFlexCheckbox(binding, flex, createCallback(idx));
        checkboxes.push(checkbox);
    });
    return checkboxes;
}

/**
 * Create checkboxes in a flex section from binding array
 * @param flex - The flex container to add checkboxes to
 * @param bindingArray - Array of checkbox bindings
 * @param createCallback - Function that returns callback for a specific index
 * @returns Array of created checkbox elements
 */
export function createFlexNumberInputs(
    flex: ReturnType<typeof createFlexSection>,
    bindingArray: any[],
    createCallback: (index: number) => (value: number) => void
): HTMLInputElement[] {
    const numbers: HTMLInputElement[] = [];
    bindingArray.forEach((binding, idx) => {
        const number = createFlexNumberInput(binding, flex, createCallback(idx));
        numbers.push(number);
    });
    return numbers;
}

/**
 * Create a select element in a flex section with label
 * @param binding - The binding object with options and selected
 * @param flexContainer - The flex container to add the select to
 * @param onChange - Callback when selection changes, receives new selected index
 * @param labelText - Optional label text (defaults to binding.name)
 * @returns The created select element
 */
export function createFlexSelect(
    binding: any,
    flexContainer: { div1: HTMLElement, div2: HTMLElement },
    onChange: (selectedIndex: number) => void,
    labelText?: string
): HTMLSelectElement {
    const select = createSelectElement(binding, onChange);
    select.id = generateUniqueId('select');
    select.className = 'flex-item';

    const label = document.createElement('label');
    label.htmlFor = select.id;
    label.textContent = labelText || binding.name;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    flexContainer.div2.appendChild(select);

    return select;
}

/**
 * Create a flex label that displays a read-only value
 * @param binding - The binding object with name and value
 * @param flexContainer - The flex container to add the label to
 * @returns The created span element displaying the value
 */
export function createFlexLabel(
    binding: any,
    flexContainer: { div1: HTMLElement, div2: HTMLElement }
): HTMLSpanElement {
    const valueSpan = document.createElement('span');
    valueSpan.id = generateUniqueId('label');
    valueSpan.textContent = binding.value?.toString() || '';
    valueSpan.className = 'flex-item';

    const label = document.createElement('label');
    label.htmlFor = valueSpan.id;
    label.textContent = binding.name;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    flexContainer.div2.appendChild(valueSpan);

    return valueSpan;
}

/**
 * Create a collapsible section (like existing UI)
 */
export function createCollapsibleSection(
    title: string,
    content: HTMLElement,
    initiallyOpen: boolean = true
): HTMLElement {
    const container = document.createElement('div');

    // Header
    const header = document.createElement('h3');
    header.className = initiallyOpen ? 'collapsible active' : 'collapsible';
    header.textContent = title;
    header.style.cursor = 'pointer';

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.style.maxHeight = initiallyOpen ? 'inherit' : '0px';
    contentDiv.appendChild(content);

    // Toggle functionality
    header.addEventListener('click', function (e) {
        const isActive = this.classList.toggle('active');
        contentDiv.style.maxHeight = isActive ? 'inherit' : '0px';
    });

    container.appendChild(header);
    container.appendChild(contentDiv);

    return container;
}


/**
 * Configuration for displaying a single stat
 */
export interface StatDisplayConfig {
    /** Key in the Stats object */
    key: string;
    /** Label to display (localization key) */
    label: string;
    /** Whether positive change is good (true), bad (false), or neutral (undefined) */
    positiveIsGood?: boolean;
    /** Whether this is a derived stat (gets special background) */
    isDerived?: boolean;
}

