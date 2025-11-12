/**
 * DOM Utility Functions for WASM Components
 *
 * Shared functions for creating common DOM elements to reduce duplication
 */

import { localization } from './localization';

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
 * Create a rules link with standard formatting
 * @param sectionName - The anchor name in the Rules HTML (e.g., "_Cockpits", "_Era")
 * @returns An H4 element containing the formatted rules link
 */
export function createRulesLink(sectionName: string, specialText?: string): HTMLElement {
    const rulesLine = document.createElement('h4');
    const rulesSpan = document.createElement('span');
    const rulesLink = document.createElement('a');
    rulesLink.href = `./Rules/Rules.htm#${sectionName}`;
    const rulesText = document.createElement('u');
    if (specialText === undefined) {
        rulesText.textContent = 'Rules';
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
    const label = document.createElement('label');
    label.textContent = binding.name;
    // label.className = 'flex-item';
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    // const checkboxSpan = document.createElement('span');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'flex-item';
    checkbox.checked = binding.selected;
    checkbox.disabled = !binding.enabled;
    checkbox.addEventListener('change', () => {
        onChange(checkbox.checked);
    });

    // checkboxSpan.appendChild(checkbox);
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
    const label = document.createElement('label');
    label.textContent = binding.name;
    // label.className = 'flex-item';
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    const input = document.createElement('input');
    input.type = 'number';
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
    flexContainer.div2.appendChild(input);

    return input;
}

/**
 * Update stat cells with blink animation when changed
 * @param elem - The table cell element to update
 * @param newValue - The new value to display
 * @param positiveGood - Whether positive values are good (for potential future styling)
 */
export function blinkIfChanged(elem: HTMLTableCellElement, newValue: string, positiveGood: boolean | null): void {
    if (elem.textContent !== newValue) {
        elem.textContent = newValue;
        // TODO: Add blink animation CSS class if desired
    }
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
    derivedStats?: any
): HTMLTableElement {
    const table = document.createElement('table');
    table.className = 'inner_table';

    // Group stats into rows of 3
    const statsPerRow = 3;
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
            if (config.isDerived === undefined || !config.isDerived) {
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

            value = value?.toString() || '';

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
    derivedStats?: any
): void {
    // Group stats into rows of 3
    const statsPerRow = 3;
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
            if (config.isDerived === undefined || !config.isDerived) {
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

            value = value?.toString() || '';

            td.textContent = value;

            // Apply derived stat styling if applicable
            if (config.isDerived) {
                td.className = 'part_local';
            }
            blinkIfChanged(td, value?.toString() || '0', null);
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
    flexContainer: { div1: HTMLDivElement, div2: HTMLDivElement },
    onChange: (selectedIndex: number) => void,
    labelText?: string
): HTMLSelectElement {
    const label = document.createElement('label');
    label.textContent = labelText || binding.name;
    label.className = 'flex-item';
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    const select = createSelectElement(binding, onChange);
    select.className = 'flex-item';
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
    const label = document.createElement('label');
    label.textContent = binding.name;
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    const valueSpan = document.createElement('span');
    valueSpan.textContent = binding.value?.toString() || '';
    valueSpan.className = 'flex-item';
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

