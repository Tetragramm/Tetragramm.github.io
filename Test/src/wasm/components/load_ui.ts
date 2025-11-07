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

        // Fuel tank inputs (number_list binding)
        const tankCountBinding = bindings.tank_count;
        if (tankCountBinding && Array.isArray(tankCountBinding)) {
            tankCountBinding.forEach((item: any, idx: number) => {
                const label = document.createElement('label');
                label.textContent = item.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                flexContainer.div1.appendChild(label);

                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.className = 'flex-item';
                input.value = item.value.toString();
                input.disabled = !item.enabled;
                input.addEventListener('change', () => {
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings.tank_count[idx].value = parseInt(input.value) || 0;
                    bridge.setFuelBindings(updatedBindings);
                    this.render();
                });
                flexContainer.div2.appendChild(input);
                this.fuelInputs.push(input);
            });
        }

        // Self-sealing gas tank checkbox
        const sealBinding = bindings.self_sealing;
        if (sealBinding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Self-Sealing Gas Tank');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            const checkboxSpan = document.createElement('span');
            this.sealCheckbox = document.createElement('input');
            this.sealCheckbox.type = 'checkbox';
            this.sealCheckbox.className = 'flex-item';
            this.sealCheckbox.checked = sealBinding.selected;
            this.sealCheckbox.disabled = !sealBinding.enabled;
            this.sealCheckbox.addEventListener('change', () => {
                const updatedBindings = bridge.getFuelBindings();
                updatedBindings.self_sealing.selected = this.sealCheckbox!.checked;
                bridge.setFuelBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(this.sealCheckbox);
            flexContainer.div2.appendChild(checkboxSpan);
        }

        // Remote fire extinguisher checkbox
        const extinguisherBinding = bindings.fire_extinguisher;
        if (extinguisherBinding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Remote Fire Extinguisher');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            const checkboxSpan = document.createElement('span');
            this.extinguisherCheckbox = document.createElement('input');
            this.extinguisherCheckbox.type = 'checkbox';
            this.extinguisherCheckbox.className = 'flex-item';
            this.extinguisherCheckbox.checked = extinguisherBinding.selected;
            this.extinguisherCheckbox.disabled = !extinguisherBinding.enabled;
            this.extinguisherCheckbox.addEventListener('change', () => {
                const updatedBindings = bridge.getFuelBindings();
                updatedBindings.fire_extinguisher.selected = this.extinguisherCheckbox!.checked;
                bridge.setFuelBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(this.extinguisherCheckbox);
            flexContainer.div2.appendChild(checkboxSpan);
        }

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create munitions section with flex layout
     */
    private createMunitionsSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Bombs input
        const bombsBinding = bindings.bomb_count;
        if (bombsBinding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Bombs');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            this.bombsInput = document.createElement('input');
            this.bombsInput.type = 'number';
            this.bombsInput.min = '0';
            this.bombsInput.className = 'flex-item';
            this.bombsInput.value = bombsBinding.value.toString();
            this.bombsInput.disabled = !bombsBinding.enabled;
            this.bombsInput.addEventListener('change', () => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.bomb_count.value = parseInt(this.bombsInput!.value) || 0;
                bridge.setMunitionsBindings(updatedBindings);
                this.render();
            });
            flexContainer.div2.appendChild(this.bombsInput);
        }

        // Rockets input
        const rocketsBinding = bindings.rocket_count;
        if (rocketsBinding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Rockets');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            this.rocketsInput = document.createElement('input');
            this.rocketsInput.type = 'number';
            this.rocketsInput.min = '0';
            this.rocketsInput.className = 'flex-item';
            this.rocketsInput.value = rocketsBinding.value.toString();
            this.rocketsInput.disabled = !rocketsBinding.enabled;
            this.rocketsInput.addEventListener('change', () => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.rocket_count.value = parseInt(this.rocketsInput!.value) || 0;
                bridge.setMunitionsBindings(updatedBindings);
                this.render();
            });
            flexContainer.div2.appendChild(this.rocketsInput);
        }

        // Internal bay count input
        const bayCountBinding = bindings.bay_count;
        if (bayCountBinding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Internal Bay Count');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            this.bayCountInput = document.createElement('input');
            this.bayCountInput.type = 'number';
            this.bayCountInput.min = '0';
            this.bayCountInput.className = 'flex-item';
            this.bayCountInput.value = bayCountBinding.value.toString();
            this.bayCountInput.disabled = !bayCountBinding.enabled;
            this.bayCountInput.addEventListener('change', () => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.bay_count.value = parseInt(this.bayCountInput!.value) || 0;
                bridge.setMunitionsBindings(updatedBindings);
                this.render();
            });
            flexContainer.div2.appendChild(this.bayCountInput);
        }

        // Widen bay 1 checkbox
        const bay1Binding = bindings.bay1;
        if (bay1Binding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Widen Internal Bay 1');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            const checkboxSpan = document.createElement('span');
            this.bay1Checkbox = document.createElement('input');
            this.bay1Checkbox.type = 'checkbox';
            this.bay1Checkbox.className = 'flex-item';
            this.bay1Checkbox.checked = bay1Binding.selected;
            this.bay1Checkbox.disabled = !bay1Binding.enabled;
            this.bay1Checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.bay1.selected = this.bay1Checkbox!.checked;
                bridge.setMunitionsBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(this.bay1Checkbox);
            flexContainer.div2.appendChild(checkboxSpan);
        }

        // Widen bay 2 checkbox
        const bay2Binding = bindings.bay2;
        if (bay2Binding) {
            const label = document.createElement('label');
            label.textContent = localization.translate('Load Widen Internal Bay 2');
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            const checkboxSpan = document.createElement('span');
            this.bay2Checkbox = document.createElement('input');
            this.bay2Checkbox.type = 'checkbox';
            this.bay2Checkbox.className = 'flex-item';
            this.bay2Checkbox.checked = bay2Binding.selected;
            this.bay2Checkbox.disabled = !bay2Binding.enabled;
            this.bay2Checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.bay2.selected = this.bay2Checkbox!.checked;
                bridge.setMunitionsBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(this.bay2Checkbox);
            flexContainer.div2.appendChild(checkboxSpan);
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

        // Update fuel tank inputs
        if (fuelBindings.tank_count && Array.isArray(fuelBindings.tank_count)) {
            fuelBindings.tank_count.forEach((item: any, idx: number) => {
                if (idx < this.fuelInputs.length) {
                    this.fuelInputs[idx].value = item.value.toString();
                    this.fuelInputs[idx].disabled = !item.enabled;
                }
            });
        }

        if (this.sealCheckbox) {
            this.sealCheckbox.checked = fuelBindings.self_sealing?.selected || false;
            this.sealCheckbox.disabled = !fuelBindings.self_sealing?.enabled;
        }

        if (this.extinguisherCheckbox) {
            this.extinguisherCheckbox.checked = fuelBindings.fire_extinguisher?.selected || false;
            this.extinguisherCheckbox.disabled = !fuelBindings.fire_extinguisher?.enabled;
        }

        // Update munitions inputs
        if (this.bombsInput) {
            this.bombsInput.value = munitionsBindings.bomb_count?.value?.toString() || '0';
            this.bombsInput.disabled = !munitionsBindings.bomb_count?.enabled;
        }

        if (this.rocketsInput) {
            this.rocketsInput.value = munitionsBindings.rocket_count?.value?.toString() || '0';
            this.rocketsInput.disabled = !munitionsBindings.rocket_count?.enabled;
        }

        if (this.bayCountInput) {
            this.bayCountInput.value = munitionsBindings.bay_count?.value?.toString() || '0';
            this.bayCountInput.disabled = !munitionsBindings.bay_count?.enabled;
        }

        if (this.bay1Checkbox) {
            this.bay1Checkbox.checked = munitionsBindings.bay1?.selected || false;
            this.bay1Checkbox.disabled = !munitionsBindings.bay1?.enabled;
        }

        if (this.bay2Checkbox) {
            this.bay2Checkbox.checked = munitionsBindings.bay2?.selected || false;
            this.bay2Checkbox.disabled = !munitionsBindings.bay2?.enabled;
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
