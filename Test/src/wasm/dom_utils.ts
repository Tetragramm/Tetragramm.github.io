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
export function createRulesLink(sectionName: string): HTMLElement {
    const rulesLine = document.createElement('h4');
    const rulesLink = document.createElement('a');
    rulesLink.href = `./Rules/Rules.htm#${sectionName}`;
    const rulesText = document.createElement('u');
    rulesText.textContent = 'Rules';
    rulesLink.appendChild(rulesText);
    rulesLine.appendChild(document.createTextNode('('));
    rulesLine.appendChild(rulesLink);
    rulesLine.appendChild(document.createTextNode(')'));

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
    select.selectedIndex = binding.selected;
    select.disabled = !binding.enabled;

    if (binding.options) {
        binding.options.forEach((opt: any, idx: number) => {
            if (idx < select.options.length) {
                select.options[idx].disabled = !opt.enabled;
            }
        });
    }
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
    flexContainer: { div1: HTMLDivElement, div2: HTMLDivElement },
    onChange: (checked: boolean) => void
): HTMLInputElement {
    const label = document.createElement('label');
    label.textContent = binding.name;
    label.className = 'flex-item';
    label.style.marginLeft = '0.25em';
    label.style.marginRight = '0.5em';
    flexContainer.div1.appendChild(label);

    const checkboxSpan = document.createElement('span');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'flex-item';
    checkbox.checked = binding.selected;
    checkbox.disabled = !binding.enabled;
    checkbox.addEventListener('change', () => {
        onChange(checkbox.checked);
    });

    const emptyLabel = document.createElement('label');
    checkboxSpan.appendChild(emptyLabel);
    checkboxSpan.appendChild(checkbox);
    flexContainer.div2.appendChild(checkboxSpan);

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
    flexContainer: { div1: HTMLDivElement, div2: HTMLDivElement },
    onChange: (value: number) => void,
    min: string = '0',
    max?: string,
    step: string = '1'
): HTMLInputElement {
    const label = document.createElement('label');
    label.textContent = binding.name;
    label.className = 'flex-item';
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
 * Create a stats table with headers and data cells
 * @param headers - Array of translation keys for headers
 * @param dataKeys - Array of keys for the stat data
 * @returns Object with the table element and map of stat cells
 */
export function createStatsTable(
    headers: string[],
    dataKeys: string[]
): { table: HTMLTableElement, cells: Map<string, HTMLTableCellElement> } {
    const table = document.createElement('table');
    table.className = 'inner_table';

    const statCells = new Map<string, HTMLTableCellElement>();

    // Create header row
    const headerRow = table.insertRow();
    headers.forEach(key => {
        const th = document.createElement('th');
        th.textContent = localization.translate(key);
        headerRow.appendChild(th);
    });

    // Create data row
    const dataRow = table.insertRow();
    dataKeys.forEach(key => {
        const td = dataRow.insertCell();
        td.textContent = '0';
        statCells.set(key, td);
    });

    return { table, cells: statCells };
}

/**
 * Create a multi-row stats table (multiple header/data row pairs)
 * @param rows - Array of row configurations, each with headers and dataKeys
 * @returns Object with the table element and map of all stat cells
 */
export function createMultiRowStatsTable(
    rows: Array<{ headers: string[], dataKeys: string[], specialClasses?: Map<string, string> }>
): { table: HTMLTableElement, cells: Map<string, HTMLTableCellElement> } {
    const table = document.createElement('table');
    table.className = 'inner_table';

    const statCells = new Map<string, HTMLTableCellElement>();

    rows.forEach(row => {
        // Create header row
        const headerRow = table.insertRow();
        row.headers.forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            headerRow.appendChild(th);
        });

        // Create data row
        const dataRow = table.insertRow();
        row.dataKeys.forEach(key => {
            const td = dataRow.insertCell();
            td.textContent = '0';

            // Apply special class if specified
            if (row.specialClasses && row.specialClasses.has(key)) {
                td.className = row.specialClasses.get(key)!;
            }

            statCells.set(key, td);
        });
    });

    return { table, cells: statCells };
}

/**
 * Update all stat cells from a stats object
 * @param statCells - Map of cell elements keyed by stat name
 * @param stats - Object containing stat values
 */
export function updateStatCells(
    statCells: Map<string, HTMLTableCellElement>,
    stats: any
): void {
    for (const [key, cell] of statCells) {
        const value = stats[key];
        blinkIfChanged(cell, value?.toString() || '0', null);
    }
}
