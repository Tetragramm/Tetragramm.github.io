/**
 * Generic UIBinding Renderer
 *
 * Provides generic rendering functions for UIBindings from Rust
 * Supports: Select, Number, Check, NumberList, CheckList
 */

import { AircraftBridge, SelectBinding, NumberBinding as NumBinding, CheckBinding as ChkBinding } from './aircraft_bridge';
import { localization } from './localization';

// Re-export types from aircraft_bridge for convenience
export type NumberBinding = NumBinding;
export type CheckBinding = ChkBinding;

/**
 * Generic renderer for UIBindings
 */
export class BindingRenderer {
    constructor(
        private bridge: AircraftBridge,
        private onStatsUpdate?: () => void
    ) {
        // Re-render when locale changes
        localization.onLocaleChange(() => this.handleLocaleChange());
    }

    /**
     * Handle locale changes - subclasses can override
     */
    protected handleLocaleChange(): void {
        // Default: do nothing, let components handle their own re-rendering
        console.log('[BindingRenderer] Locale changed');
    }

    /**
     * Render a select/dropdown binding
     */
    renderSelect(
        binding: SelectBinding,
        updateFn: (selectedIndex: number) => void,
        labelText?: string
    ): HTMLElement {
        const container = document.createElement('span');

        // Add label if provided
        if (labelText) {
            const label = document.createElement('label');
            label.textContent = labelText + ': ';
            container.appendChild(label);
        }

        // Create select element
        const select = document.createElement('select');
        select.disabled = !binding.enabled;

        // Add options
        binding.options.forEach((opt, idx) => {
            const option = document.createElement('option');
            option.value = idx.toString();
            option.textContent = opt.name; // Already translated by Rust
            option.disabled = !opt.enabled;
            if (idx === binding.selected) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        // Add change event listener
        select.addEventListener('change', () => {
            const newIndex = parseInt(select.value);
            updateFn(newIndex);
            if (this.onStatsUpdate) {
                this.onStatsUpdate();
            }
        });

        container.appendChild(select);
        return container;
    }

    /**
     * Render a number input binding
     */
    renderNumber(
        binding: NumberBinding,
        updateFn: (value: number) => void,
        min?: number,
        max?: number,
        step?: number
    ): HTMLElement {
        const container = document.createElement('span');

        // Label (already translated in binding.name)
        const label = document.createElement('label');
        label.textContent = binding.name + ': ';
        container.appendChild(label);

        // Number input
        const input = document.createElement('input');
        input.type = 'number';
        input.value = binding.value.toString();
        input.disabled = !binding.enabled;
        if (min !== undefined) input.min = min.toString();
        if (max !== undefined) input.max = max.toString();
        if (step !== undefined) input.step = step.toString();

        // Add change event listener
        input.addEventListener('change', () => {
            const newValue = parseFloat(input.value);
            if (!isNaN(newValue)) {
                updateFn(newValue);
                if (this.onStatsUpdate) {
                    this.onStatsUpdate();
                }
            }
        });

        container.appendChild(input);
        return container;
    }

    /**
     * Render a checkbox binding
     */
    renderCheck(
        binding: CheckBinding,
        updateFn: (checked: boolean) => void
    ): HTMLElement {
        const container = document.createElement('span');

        // Label (already translated in binding.name)
        const label = document.createElement('label');
        label.textContent = binding.name + ': ';
        container.appendChild(label);

        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = binding.selected;
        checkbox.disabled = !binding.enabled;

        // Add change event listener
        checkbox.addEventListener('change', () => {
            updateFn(checkbox.checked);
            if (this.onStatsUpdate) {
                this.onStatsUpdate();
            }
        });

        container.appendChild(checkbox);
        return container;
    }

    /**
     * Render a list of number inputs
     */
    renderNumberList(
        bindings: NumberBinding[],
        updateFn: (index: number, value: number) => void,
        min?: number,
        max?: number,
        step?: number
    ): HTMLElement {
        const container = document.createElement('div');

        bindings.forEach((binding, idx) => {
            const itemContainer = this.renderNumber(
                binding,
                (value) => updateFn(idx, value),
                min,
                max,
                step
            );
            container.appendChild(itemContainer);
            container.appendChild(document.createElement('br'));
        });

        return container;
    }

    /**
     * Render a list of checkboxes
     */
    renderCheckList(
        bindings: CheckBinding[],
        updateFn: (index: number, checked: boolean) => void
    ): HTMLElement {
        const container = document.createElement('div');

        bindings.forEach((binding, idx) => {
            const itemContainer = this.renderCheck(binding, (checked) =>
                updateFn(idx, checked)
            );
            container.appendChild(itemContainer);
            container.appendChild(document.createElement('br'));
        });

        return container;
    }

    /**
     * Create a collapsible section (like existing UI)
     */
    createCollapsibleSection(
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
        header.addEventListener('click', () => {
            const isActive = header.classList.toggle('active');
            contentDiv.style.maxHeight = isActive ? 'inherit' : '0px';
        });

        container.appendChild(header);
        container.appendChild(contentDiv);

        return container;
    }

    /**
     * Render a stats table
     * @param stats Stats object from Rust
     * @param statConfig Configuration for which stats to display and how
     * @param derivedStats Optional derived stats for the component
     * @returns HTML table element with stats
     */
    renderStatsTable(
        stats: any,
        statConfig: StatDisplayConfig[],
        derivedStats?: any
    ): HTMLElement {
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
                let value = stats[config.key];
                if (value === undefined && derivedStats) {
                    value = derivedStats.get(config.key);
                }

                // Handle special cases (like flight stress range)
                if (config.key === 'flightstress' && derivedStats) {
                    const norm = derivedStats.get('flight_stress_norm');
                    const cp = derivedStats.get('flight_stress_cp');
                    if (norm != cp) {
                        value = norm.toString() + " (" + cp.toString() + ")";
                    } else {
                        value = norm.toString()
                    }
                } else {
                    value = value?.toString() || '0';
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
