/**
 * Load UI Component
 *
 * Combined component for Fuel, Munitions, and Cargo
 * Matches the original TypeScript 4-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class LoadUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;

    // Fuel elements
    private fuelInputs: HTMLInputElement[] = [];
    private sealCheckbox: HTMLInputElement | null = null;
    private extinguisherCheckbox: HTMLInputElement | null = null;

    // Munitions elements
    private bombsInput: HTMLInputElement | null = null;
    private rocketsInput: HTMLInputElement | null = null;
    private bayCountInput: HTMLInputElement | null = null;
    private bay1Checkbox: HTMLInputElement | null = null;
    private bay2Checkbox: HTMLInputElement | null = null;

    // Cargo element
    private cargoSelect: HTMLSelectElement | null = null;

    // Stat cells
    private statCells: Map<string, HTMLTableCellElement> = new Map();

    constructor(
        private getBridge: () => AircraftBridge | null,
        containerId: string,
        private onUpdate?: () => void
    ) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element '${containerId}' not found`);
        }
        this.container = container;

        // Get the initial bridge for renderer
        const bridge = this.getBridge();
        if (!bridge) {
            throw new Error('Bridge not available during LoadUI construction');
        }

        // Create renderer with stats update callback
        this.renderer = new BindingRenderer(bridge, () => {
            if (this.onUpdate) {
                this.onUpdate();
            }
        });

        // Listen for locale changes and do full rebuild (text changes)
        localization.onLocaleChange(() => this.rebuildFull());

        this.render();
    }

    /**
     * Render the Load UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[LoadUI] Bridge not initialized, skipping render');
            return;
        }

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.mainTable) {
            this.updateValues();
        } else {
            this.rebuildFull();
        }
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    private rebuildFull(): void {
        // Clear cache
        this.mainTable = null;
        this.fuelInputs = [];
        this.sealCheckbox = null;
        this.extinguisherCheckbox = null;
        this.bombsInput = null;
        this.rocketsInput = null;
        this.bayCountInput = null;
        this.bay1Checkbox = null;
        this.bay2Checkbox = null;
        this.cargoSelect = null;
        this.statCells.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[LoadUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Create main table with 4 columns: Fuel | Munitions | Cargo | Stats
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'tbl_load';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Load Fuel'),
            localization.translate('Load Munitions'),
            localization.translate('Load Cargo and Passengers'),
            localization.translate('Load Load Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        this.mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Fuel cell
        const fuelCell = document.createElement('td');
        this.createFuelSection(fuelCell, fuelBindings, bridge);
        dataRow.appendChild(fuelCell);

        // Munitions cell
        const munitionsCell = document.createElement('td');
        this.createMunitionsSection(munitionsCell, munitionsBindings, bridge);
        dataRow.appendChild(munitionsCell);

        // Cargo cell
        const cargoCell = document.createElement('td');
        this.createCargoSection(cargoCell, cargoBindings, bridge);
        dataRow.appendChild(cargoCell);

        // Stats cell
        const statsCell = document.createElement('td');
        this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        this.mainTable.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Load Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            this.mainTable,
            true // Initially open
        );

        // Add rules link
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Load';
        const rulesText = document.createElement('u');
        rulesText.textContent = 'Rules';
        rulesLink.appendChild(rulesText);
        rulesLine.appendChild(document.createTextNode('('));
        rulesLine.appendChild(rulesLink);
        rulesLine.appendChild(document.createTextNode(')'));

        // Insert rules link before content
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[LoadUI] Full rebuild complete');
    }

    /**
     * Create flex section matching original Tools.ts CreateFlexSection
     */
    private createFlexSection(): { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement } {
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
     * Create fuel section with flex layout
     */
    private createFuelSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Render fuel tank inputs dynamically
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'value' in binding && typeof binding.value === 'number') {
                // Number binding (fuel tanks)
                const label = document.createElement('label');
                label.textContent = binding.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                flexContainer.div1.appendChild(label);

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.className = 'flex-item';
                input.value = binding.value.toString();
                input.disabled = !binding.enabled;
                input.addEventListener('change', () => {
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings[key].value = parseInt(input.value) || 0;
                    bridge.setFuelBindings(updatedBindings);
                    this.render();
                });
                flexContainer.div2.appendChild(input);
                this.fuelInputs.push(input);
            } else if (binding && typeof binding === 'object' && 'selected' in binding && typeof binding.selected === 'boolean') {
                // Checkbox binding
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
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings[key].selected = checkbox.checked;
                    bridge.setFuelBindings(updatedBindings);
                    this.render();
                });

                const emptyLabel = document.createElement('label');
                checkboxSpan.appendChild(emptyLabel);
                checkboxSpan.appendChild(checkbox);
                flexContainer.div2.appendChild(checkboxSpan);

                // Store references
                if (key === 'self_sealing') {
                    this.sealCheckbox = checkbox;
                } else if (key === 'extinguisher') {
                    this.extinguisherCheckbox = checkbox;
                }
            }
        }

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create munitions section with flex layout
     */
    private createMunitionsSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Render munitions inputs dynamically
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'value' in binding && typeof binding.value === 'number') {
                // Number binding
                const label = document.createElement('label');
                label.textContent = binding.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                flexContainer.div1.appendChild(label);

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.className = 'flex-item';
                input.value = binding.value.toString();
                input.disabled = !binding.enabled;
                input.addEventListener('change', () => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings[key].value = parseInt(input.value) || 0;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.render();
                });
                flexContainer.div2.appendChild(input);

                // Store references
                if (key === 'bombs') {
                    this.bombsInput = input;
                } else if (key === 'rockets') {
                    this.rocketsInput = input;
                } else if (key === 'bay_count') {
                    this.bayCountInput = input;
                }
            } else if (binding && typeof binding === 'object' && 'selected' in binding && typeof binding.selected === 'boolean') {
                // Checkbox binding
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
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings[key].selected = checkbox.checked;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.render();
                });

                const emptyLabel = document.createElement('label');
                checkboxSpan.appendChild(emptyLabel);
                checkboxSpan.appendChild(checkbox);
                flexContainer.div2.appendChild(checkboxSpan);

                // Store references
                if (key === 'widen_bay_1') {
                    this.bay1Checkbox = checkbox;
                } else if (key === 'widen_bay_2') {
                    this.bay2Checkbox = checkbox;
                }
            }
        }

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create cargo section with simple select
     */
    private createCargoSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        // Find the select binding
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'options' in binding && 'selected' in binding) {
                // This is a select binding
                this.cargoSelect = document.createElement('select');
                this.cargoSelect.disabled = !binding.enabled;

                // Add options
                binding.options.forEach((opt: any, idx: number) => {
                    const option = document.createElement('option');
                    option.value = idx.toString();
                    option.textContent = opt.name;
                    option.disabled = !opt.enabled;
                    if (idx === binding.selected) {
                        option.selected = true;
                    }
                    this.cargoSelect!.appendChild(option);
                });

                this.cargoSelect.addEventListener('change', () => {
                    const updatedBindings = bridge.getCargoBindings();
                    updatedBindings[key].selected = parseInt(this.cargoSelect!.value);
                    bridge.setCargoBindings(updatedBindings);
                    this.render();
                });

                cell.appendChild(this.cargoSelect);
                break;
            }
        }
    }

    /**
     * Create stats section (inner table with 7 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): void {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        // Row 1: Drag | Mass | Wet Mass
        const header1 = statsTable.insertRow();
        ['Stat Drag', 'Stat Mass', 'Stat Wet Mass'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header1.appendChild(th);
        });

        const data1 = statsTable.insertRow();
        ['drag', 'mass', 'wetmass'].forEach(key => {
            const td = data1.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 2: Required Sections | Fuel | Cost
        const header2 = statsTable.insertRow();
        ['Stat Required Sections', 'Stat Fuel', 'Stat Cost'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header2.appendChild(th);
        });

        const data2 = statsTable.insertRow();
        ['reqsections', 'fuel', 'cost'].forEach(key => {
            const td = data2.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 3: Empty | Fuel Uses | Empty (derived stat)
        const header3 = statsTable.insertRow();
        const th3_1 = document.createElement('th');
        th3_1.textContent = '';
        header3.appendChild(th3_1);
        const th3_2 = document.createElement('th');
        th3_2.textContent = localization.translate('Derived Fuel Uses');
        header3.appendChild(th3_2);
        const th3_3 = document.createElement('th');
        th3_3.textContent = '';
        header3.appendChild(th3_3);

        const data3 = statsTable.insertRow();
        data3.insertCell(); // empty
        const fuelUsesCell = data3.insertCell();
        fuelUsesCell.textContent = '0';
        this.statCells.set('fueluseage', fuelUsesCell);
        data3.insertCell(); // empty

        cell.appendChild(statsTable);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            return;
        }

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Update fuel inputs
        let fuelIdx = 0;
        for (const key in fuelBindings) {
            if (!fuelBindings.hasOwnProperty(key)) continue;
            const binding = fuelBindings[key];

            if (binding && typeof binding === 'object' && 'value' in binding) {
                if (fuelIdx < this.fuelInputs.length) {
                    this.fuelInputs[fuelIdx].value = binding.value.toString();
                    this.fuelInputs[fuelIdx].disabled = !binding.enabled;
                    fuelIdx++;
                }
            }
        }

        if (this.sealCheckbox) {
            this.sealCheckbox.checked = fuelBindings.self_sealing?.selected || false;
            this.sealCheckbox.disabled = !fuelBindings.self_sealing?.enabled;
        }

        if (this.extinguisherCheckbox) {
            this.extinguisherCheckbox.checked = fuelBindings.extinguisher?.selected || false;
            this.extinguisherCheckbox.disabled = !fuelBindings.extinguisher?.enabled;
        }

        // Update munitions inputs
        if (this.bombsInput) {
            this.bombsInput.value = munitionsBindings.bombs?.value?.toString() || '0';
            this.bombsInput.disabled = !munitionsBindings.bombs?.enabled;
        }

        if (this.rocketsInput) {
            this.rocketsInput.value = munitionsBindings.rockets?.value?.toString() || '0';
            this.rocketsInput.disabled = !munitionsBindings.rockets?.enabled;
        }

        if (this.bayCountInput) {
            this.bayCountInput.value = munitionsBindings.bay_count?.value?.toString() || '0';
            this.bayCountInput.disabled = !munitionsBindings.bay_count?.enabled;
        }

        if (this.bay1Checkbox) {
            this.bay1Checkbox.checked = munitionsBindings.widen_bay_1?.selected || false;
            this.bay1Checkbox.disabled = !munitionsBindings.widen_bay_1?.enabled;
        }

        if (this.bay2Checkbox) {
            this.bay2Checkbox.checked = munitionsBindings.widen_bay_2?.selected || false;
            this.bay2Checkbox.disabled = !munitionsBindings.widen_bay_2?.enabled;
        }

        // Update cargo select
        if (this.cargoSelect) {
            for (const key in cargoBindings) {
                if (!cargoBindings.hasOwnProperty(key)) continue;
                const binding = cargoBindings[key];
                if (binding && 'selected' in binding) {
                    this.cargoSelect.selectedIndex = binding.selected;
                    this.cargoSelect.disabled = !binding.enabled;
                    break;
                }
            }
        }

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        // Get all three component stats and combine them
        const fuelStats = bridge.getFuelStats();
        const munitionsStats = bridge.getMunitionsStats();
        const cargoStats = bridge.getCargoStats();

        // Combine stats (simple addition for now)
        const combinedStats = {
            drag: (fuelStats.drag || 0) + (munitionsStats.drag || 0) + (cargoStats.drag || 0),
            mass: (fuelStats.mass || 0) + (munitionsStats.mass || 0) + (cargoStats.mass || 0),
            wetmass: (fuelStats.wetmass || 0) + (munitionsStats.wetmass || 0) + (cargoStats.wetmass || 0),
            reqsections: (fuelStats.reqsections || 0) + (munitionsStats.reqsections || 0) + (cargoStats.reqsections || 0),
            fuel: (fuelStats.fuel || 0) + (munitionsStats.fuel || 0) + (cargoStats.fuel || 0),
            cost: (fuelStats.cost || 0) + (munitionsStats.cost || 0) + (cargoStats.cost || 0),
            fueluseage: fuelStats.fueluseage || 0  // Only from fuel
        };

        // Update stat cells
        for (const [key, cell] of this.statCells) {
            const value = combinedStats[key as keyof typeof combinedStats];
            this.blinkIfChanged(cell, value?.toString() || '0', false);
        }
    }

    /**
     * Blink animation when stat changes
     */
    private blinkIfChanged(elem: HTMLTableCellElement, str: string, positiveGood: boolean | null): void {
        if (elem.textContent !== str) {
            elem.textContent = str;
        }
    }

    /**
     * Update the UI (e.g., when data changes externally)
     */
    update(): void {
        this.render();
    }

    /**
     * Destroy the component and clean up listeners
     */
    destroy(): void {
        this.container.innerHTML = '';
        this.mainTable = null;
        this.fuelInputs = [];
        this.sealCheckbox = null;
        this.extinguisherCheckbox = null;
        this.bombsInput = null;
        this.rocketsInput = null;
        this.bayCountInput = null;
        this.bay1Checkbox = null;
        this.bay2Checkbox = null;
        this.cargoSelect = null;
        this.statCells.clear();
    }
}
