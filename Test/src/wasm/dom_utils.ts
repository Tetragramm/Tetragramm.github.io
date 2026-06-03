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

// Base path (relative to the host HTML page) for shared assets that physically
// live under Test/ — the Rules pages and the Engine Builder. Test's own pages
// leave this as '' (assets are siblings); the Helicopter pages live in a sibling
// directory and set it to '../Test/' so these links resolve correctly.
let assetBasePath = '';

/** Set the base path used for links to shared Test/ assets (Rules, engine builder). */
export function setAssetBasePath(path: string): void {
    assetBasePath = path;
}

/** Current shared-asset base path (see setAssetBasePath). */
export function getAssetBasePath(): string {
    return assetBasePath;
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
    rulesLink.href = `${assetBasePath}Rules/Rules_${localization.getCurrentLocale()}.html#${sectionName}`;
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
    select.onchange = () => {
        onChange(parseInt(select.value));
    };

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

    // Add label if binding has a name
    if (binding.name) {
        const label = document.createElement('span');
        label.className = 'mobile-number-label';
        label.textContent = binding.name;
        container.appendChild(label);
    }

    // Controls wrapper - groups buttons and input together
    const controls = document.createElement('div');
    controls.className = 'mobile-number-controls';

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
        minusBtn.disabled = input.disabled || value <= parseInt(input.min);
        plusBtn.disabled = input.disabled || (input.max !== undefined && value >= parseInt(input.max));
    };

    input['_max'] = max !== undefined ? max.toString() : undefined;
    input['_min'] = min !== undefined ? min.toString() : undefined;
    Object.defineProperty(input, 'max', {
        set: function (newMax: string) { this._max = newMax; updateButtonStates(); },
        get: function () { return this._max; }
    });
    Object.defineProperty(input, 'min', {
        set: function (newMin: string) { this._min = newMin; updateButtonStates(); },
        get: function () { return this._min; }
    });

    // Event handlers
    minusBtn.onclick = () => {
        const currentValue = parseInt(input.value) || 0;
        const newValue = Math.max(parseInt(input.min), currentValue - step);
        input.value = newValue.toString();
        onChange(newValue);
        updateButtonStates();
    };

    plusBtn.onclick = () => {
        const currentValue = parseInt(input.value) || 0;
        const newValue = input.max !== undefined ? Math.min(parseInt(input.max), currentValue + step) : currentValue + step;
        input.value = newValue.toString();
        onChange(newValue);
        updateButtonStates();
    };

    input.addEventListener('change', () => {
        let value = parseInt(input.value) || 0;
        // Clamp value to min/max
        value = Math.max(parseInt(input.min), value);
        if (max !== undefined) {
            value = Math.min(parseInt(input.max), value);
        }
        input.value = value.toString();
        onChange(value);
        updateButtonStates();
    });

    controls.appendChild(minusBtn);
    controls.appendChild(input);
    controls.appendChild(plusBtn);
    container.appendChild(controls);
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
    parent?: HTMLElement
): { container: HTMLElement, content: HTMLElement } {
    const container = document.createElement('div');
    container.className = 'mobile-option-item';

    if (title && title.length > 0) {
        const titleDiv = document.createElement('div');
        titleDiv.className = 'mobile-option-title';
        titleDiv.textContent = title;
        container.appendChild(titleDiv);
    }

    const content = document.createElement('div');
    content.className = 'mobile-option-content';
    container.appendChild(content);

    if (parent) parent.appendChild(container);

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
    checkbox.onchange = () => {
        onChange(checkbox.checked);
    };

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

    let idx2 = 0;
    for (let idx = 0; idx < statConfig.length; idx++) {
        const config = statConfig[idx];
        if (!config.key) continue; // Skip empty configs
        const item = grid.children[idx2];
        idx2++;
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

// ============================================================================
// Dual-emit controls
//
// Every component renders the same control twice: once for the desktop layout
// and once for the mobile option group, with the change handler duplicated. A
// dual control builds both nodes from a single definition and a single handler.
// The desktop node is returned for the component to place wherever its existing
// desktop layout expects it, so the desktop DOM is unchanged; the mobile node is
// a ready-to-append `.mobile-option-item`. Call update() from updateValues().
// ============================================================================

/** Anything the component refreshes in updateValues() via update(). */
export interface Updatable {
    /** Refresh both desktop and mobile from current data. Call in updateValues(). */
    update(): void;
}

export interface DualControl extends Updatable {
    /** Desktop control node — place it in the component's existing desktop layout. */
    desktop: HTMLElement;
    /** `.mobile-option-item` node — append it to the component's mobile group. */
    mobile: HTMLElement;
}

/**
 * A select rendered for both desktop and mobile from one binding + one handler.
 * @param label - Mobile option title (already localized). Desktop labelling stays
 *                with the caller, so passing this does not affect the desktop DOM.
 * @param getBinding - Returns the current SelectBinding (called on build + update).
 * @param onChange - Selection handler, shared by both nodes.
 */
export function dualSelect(
    label: string,
    getBinding: () => any,
    onChange: (selectedIndex: number) => void
): DualControl & { desktop: HTMLSelectElement } {
    const desktop = createSelectElement(getBinding(), onChange);
    const { container, content } = createMobileOptionItem(label);
    const mobileSelect = createMobileSelect(getBinding(), content, onChange);
    return {
        desktop,
        mobile: container,
        update() {
            updateSelectElement(desktop, getBinding());
            updateSelectElement(mobileSelect, getBinding());
        },
    };
}

/**
 * A stats block rendered as a desktop table and a mobile grid from one source.
 * @param label - Mobile option title (already localized).
 * @param getStats - Returns the current stats object (called on build + update).
 * @param config - Which stats to show.
 * @param getDerived - Optional derived-stats source for derived rows.
 */
export function dualStats(
    label: string,
    getStats: () => any,
    config: StatDisplayConfig[],
    getDerived?: () => any
): DualControl & { desktop: HTMLTableElement } {
    const desktop = createStatsTable(getStats(), config, getDerived?.());
    const { container, content } = createMobileOptionItem(label);
    const grid = createMobileStatsGrid(getStats(), config, getDerived?.());
    content.appendChild(grid);
    return {
        desktop,
        mobile: container,
        update() {
            updateStatsTable(desktop, getStats(), config, getDerived?.());
            updateMobileStatsGrid(grid, getStats(), config, getDerived?.());
        },
    };
}

/**
 * A number input (flex label/control layout on desktop) for both desktop and
 * mobile. The desktop node is the flex container (`.flex-container-o`) to place
 * where the component already put its `createFlexNumberInput` output.
 * @param mobileLabel - Mobile option title (already localized).
 * @param getBinding - Returns the current { name, value, enabled } binding.
 * @param onChange - Value handler, shared by both nodes.
 * @param opts.desktopLabel - Override the desktop adjacent label (defaults to
 *        binding.name; pass '' when a table header already labels the column).
 */
export function dualNumber(
    mobileLabel: string,
    getBinding: () => any,
    onChange: (value: number) => void,
    opts?: { min?: number; max?: number; step?: number; desktopLabel?: string }
): DualControl & { desktop: HTMLDivElement } {
    const min = opts?.min ?? 0;
    const { max, step, desktopLabel } = opts ?? {};

    const flex = createFlexSection();
    const desktopBinding = desktopLabel !== undefined
        ? { ...getBinding(), name: desktopLabel }
        : getBinding();
    const desktopInput = createFlexNumberInput(
        desktopBinding, flex, onChange,
        String(min), max !== undefined ? String(max) : undefined, String(step ?? 1)
    );

    const { container, content } = createMobileOptionItem(mobileLabel);
    const { input: mobileInput } = createMobileNumberInput(
        { ...getBinding(), name: '' }, content, onChange, min, max, step ?? 1
    );
    return {
        desktop: flex.div0,
        mobile: container,
        update() {
            const b = getBinding();
            desktopInput.value = b.value.toString();
            desktopInput.disabled = !b.enabled;
            mobileInput.value = b.value.toString();
            mobileInput.disabled = !b.enabled;
        },
    };
}

/**
 * A checkbox (flex label/control layout on desktop) for both desktop and mobile.
 * The desktop node is the flex container (`.flex-container-o`) to place where the
 * component already put its `createFlexCheckbox` output. The desktop label comes
 * from binding.name (as before); `label` is the mobile option title.
 * @param getBinding - Returns the current { name, selected, enabled } binding.
 * @param onChange - Checked handler, shared by both nodes.
 */
export function dualCheckbox(
    label: string,
    getBinding: () => any,
    onChange: (checked: boolean) => void
): DualControl & { desktop: HTMLDivElement } {
    const flex = createFlexSection();
    const desktopCheckbox = createFlexCheckbox(getBinding(), flex, onChange);
    const { container, content } = createMobileOptionItem(label);
    const mobileCheckbox = createMobileCheckbox(getBinding(), content, onChange);
    return {
        desktop: flex.div0,
        mobile: container,
        update() {
            const b = getBinding();
            desktopCheckbox.checked = b.selected;
            desktopCheckbox.disabled = !b.enabled;
            mobileCheckbox.checked = b.selected;
            mobileCheckbox.disabled = !b.enabled;
        },
    };
}

// ----------------------------------------------------------------------------
// Grouped "into" controls
//
// Many components put several controls into ONE shared desktop flex section, and
// on mobile either one item each or one shared item. The component owns the flex
// section and the mobile item(s) (that's where the grouping decision lives); each
// of these helpers appends ONE control into both the given desktop flex and the
// given mobile parent, wiring a single handler and returning an Updatable.
//
// Desktop labels come from binding.name (override via desktopLabel on the select),
// matching createFlexSelect/createFlexCheckbox/createFlexNumberInput.
// ----------------------------------------------------------------------------

export function dualSelectInto(
    desktopFlex: { div1: HTMLElement; div2: HTMLElement },
    mobileParent: HTMLElement,
    getBinding: () => any,
    onChange: (selectedIndex: number) => void,
    desktopLabel?: string
): Updatable {
    const desktop = createFlexSelect(getBinding(), desktopFlex, onChange, desktopLabel);
    const mobile = createMobileSelect(getBinding(), mobileParent, onChange);
    return {
        update() {
            updateSelectElement(desktop, getBinding());
            updateSelectElement(mobile, getBinding());
        },
    };
}

/**
 * A select whose DESKTOP node is a bare `<select>` (createSelectElement — no flex
 * wrapper/label/id) that the caller places itself, while the mobile select is
 * appended into a shared mobile item. Use when several controls share one mobile
 * item but the desktop select sits bare in a cell (e.g. select + count layouts).
 */
export function dualSelectBareInto(
    mobileParent: HTMLElement,
    getBinding: () => any,
    onChange: (selectedIndex: number) => void
): Updatable & { desktop: HTMLSelectElement } {
    const desktop = createSelectElement(getBinding(), onChange);
    const mobile = createMobileSelect(getBinding(), mobileParent, onChange);
    return {
        desktop,
        update() {
            updateSelectElement(desktop, getBinding());
            updateSelectElement(mobile, getBinding());
        },
    };
}

export function dualCheckboxInto(
    desktopFlex: { div1: HTMLElement; div2: HTMLElement },
    mobileParent: HTMLElement,
    getBinding: () => any,
    onChange: (checked: boolean) => void
): Updatable {
    const desktop = createFlexCheckbox(getBinding(), desktopFlex, onChange);
    const mobile = createMobileCheckbox(getBinding(), mobileParent, onChange);
    return {
        update() {
            const b = getBinding();
            desktop.checked = b.selected;
            desktop.disabled = !b.enabled;
            mobile.checked = b.selected;
            mobile.disabled = !b.enabled;
        },
    };
}

export function dualNumberInto(
    desktopFlex: { div1: HTMLElement; div2: HTMLElement },
    mobileParent: HTMLElement,
    getBinding: () => any,
    onChange: (value: number) => void,
    opts?: { min?: number; max?: number; step?: number }
): Updatable {
    const min = opts?.min ?? 0;
    const { max, step } = opts ?? {};
    const desktop = createFlexNumberInput(
        getBinding(), desktopFlex, onChange,
        String(min), max !== undefined ? String(max) : undefined, String(step ?? 1)
    );
    const { input: mobile } = createMobileNumberInput(
        getBinding(), mobileParent, onChange, min, max, step ?? 1
    );
    return {
        update() {
            const b = getBinding();
            desktop.value = b.value.toString();
            desktop.disabled = !b.enabled;
            mobile.value = b.value.toString();
            mobile.disabled = !b.enabled;
        },
    };
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


/**
 * Calculate the maximum natural width of grid items and set CSS variable
 * This ensures all columns are wide enough to fit the largest item
 */
export function updateResponsiveGridColumnWidth(gridElement: HTMLElement): void {
    if (!gridElement || gridElement.children.length === 0) {
        console.log('[CustomPartsUI] Grid element empty or missing');
        return;
    }

    // Create a hidden measurement container
    const measureContainer = document.createElement('div');
    measureContainer.style.position = 'absolute';
    measureContainer.style.visibility = 'hidden';
    measureContainer.style.width = 'auto';
    measureContainer.style.height = 'auto';
    measureContainer.style.overflow = 'visible';
    measureContainer.style.whiteSpace = 'nowrap';
    document.body.appendChild(measureContainer);

    // Find the maximum natural width by cloning and measuring
    let maxWidth = 0;
    for (let i = 0; i < gridElement.children.length; i++) {
        const child = gridElement.children[i] as HTMLElement;
        const clone = child.cloneNode(true) as HTMLElement;
        clone.style.width = 'auto';
        clone.style.position = 'static';
        measureContainer.appendChild(clone);
        const width = clone.offsetWidth;
        measureContainer.removeChild(clone);

        if (width > maxWidth) {
            maxWidth = width;
        }
    }

    document.body.removeChild(measureContainer);

    console.log('[CustomPartsUI] Measured max width:', maxWidth);

    if (maxWidth > 0) {
        gridElement.style.setProperty('--min-col-width', `${Math.ceil(maxWidth)}px`);
    }
}