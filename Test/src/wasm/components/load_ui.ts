/**
 * Load UI Component
 *
 * Combined component for Fuel, Munitions, and Cargo
 * Matches the original TypeScript 4-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { createRulesLink, createFlexSection, updateSelectElement } from '../dom_utils';

// Cache interface for type safety
interface LoadCache {
    // Fuel elements
    fuelInputs: HTMLInputElement[];
    sealCheckbox: HTMLInputElement;
    extinguisherCheckbox: HTMLInputElement;

    // Munitions elements
    bombsInput: HTMLInputElement;
    rocketsInput: HTMLInputElement;
    bayCountInput: HTMLInputElement;
    bay1Checkbox: HTMLInputElement;
    bay2Checkbox: HTMLInputElement;

    // Cargo element
    cargoSelect: HTMLSelectElement;

    // Stat cells
    statCells: Map<string, HTMLTableCellElement>;
}

export class LoadUI extends BaseComponentUI {
    private cache: LoadCache = undefined;

    protected shouldUpdate(): boolean {
        return this.cache !== undefined;
    }

    protected clearCache(): void {
        this.cache = undefined;
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Create main table with 4 columns: Fuel | Munitions | Cargo | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_load';

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
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Fuel cell
        const fuelCell = document.createElement('td');
        const fuelCache = this.createFuelSection(fuelCell, fuelBindings, bridge);
        dataRow.appendChild(fuelCell);

        // Munitions cell
        const munitionsCell = document.createElement('td');
        const munitionsCache = this.createMunitionsSection(munitionsCell, munitionsBindings, bridge);
        dataRow.appendChild(munitionsCell);

        // Cargo cell
        const cargoCell = document.createElement('td');
        const cargoSelect = this.createCargoSection(cargoCell, cargoBindings, bridge);
        dataRow.appendChild(cargoCell);

        // Stats cell
        const statsCell = document.createElement('td');
        const statCells = this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);

        // Cache elements
        this.cache = {
            ...fuelCache,
            ...munitionsCache,
            cargoSelect,
            statCells
        };

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Load Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            mainTable,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Load');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[LoadUI] Full rebuild complete');
    }

    /**
     * Create fuel section with flex layout
     */
    private createFuelSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        fuelInputs: HTMLInputElement[];
        sealCheckbox: HTMLInputElement;
        extinguisherCheckbox: HTMLInputElement;
    } {
        const flexContainer = createFlexSection();

        const fuelInputs: HTMLInputElement[] = [];
        let sealCheckbox: HTMLInputElement = undefined;
        let extinguisherCheckbox: HTMLInputElement = undefined;

        // Render fuel bindings dynamically
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (Array.isArray(binding)) {
                // number_list binding (e.g., tank_count)
                binding.forEach((item: any, idx: number) => {
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
                    input.addEventListener('change', (event) => {
                        const target = event.target as HTMLInputElement;
                        const updatedBindings = bridge.getFuelBindings();
                        updatedBindings[key][idx].value = parseInt(target.value) || 0;
                        bridge.setFuelBindings(updatedBindings);
                        this.render();
                    });
                    flexContainer.div2.appendChild(input);
                    fuelInputs.push(input);
                });
            } else if (binding && typeof binding === 'object' && 'value' in binding && typeof binding.value === 'number') {
                // Single number binding
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
                input.addEventListener('change', (event) => {
                    const target = event.target as HTMLInputElement;
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings[key].value = parseInt(target.value) || 0;
                    bridge.setFuelBindings(updatedBindings);
                    this.render();
                });
                flexContainer.div2.appendChild(input);
                fuelInputs.push(input);
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
                checkbox.addEventListener('change', (event) => {
                    const target = event.target as HTMLInputElement;
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings[key].selected = target.checked;
                    bridge.setFuelBindings(updatedBindings);
                    this.render();
                });

                const emptyLabel = document.createElement('label');
                checkboxSpan.appendChild(emptyLabel);
                checkboxSpan.appendChild(checkbox);
                flexContainer.div2.appendChild(checkboxSpan);

                // Store references
                if (key === 'self_sealing') {
                    sealCheckbox = checkbox;
                } else if (key === 'fire_extinguisher') {
                    extinguisherCheckbox = checkbox;
                }
            }
        }

        cell.appendChild(flexContainer.div0);
        return { fuelInputs, sealCheckbox, extinguisherCheckbox };
    }

    /**
     * Create munitions section with flex layout
     */
    private createMunitionsSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        bombsInput: HTMLInputElement;
        rocketsInput: HTMLInputElement;
        bayCountInput: HTMLInputElement;
        bay1Checkbox: HTMLInputElement;
        bay2Checkbox: HTMLInputElement;
    } {
        const flexContainer = createFlexSection();

        let bombsInput: HTMLInputElement = undefined;
        let rocketsInput: HTMLInputElement = undefined;
        let bayCountInput: HTMLInputElement = undefined;
        let bay1Checkbox: HTMLInputElement = undefined;
        let bay2Checkbox: HTMLInputElement = undefined;

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
                input.addEventListener('change', (event) => {
                    const target = event.target as HTMLInputElement;
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings[key].value = parseInt(target.value) || 0;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.render();
                });
                flexContainer.div2.appendChild(input);

                // Store references
                if (key === 'bomb_count') {
                    bombsInput = input;
                } else if (key === 'rocket_count') {
                    rocketsInput = input;
                } else if (key === 'internal_bay_count') {
                    bayCountInput = input;
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
                checkbox.addEventListener('change', (event) => {
                    const target = event.target as HTMLInputElement;
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings[key].selected = target.checked;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.render();
                });

                const emptyLabel = document.createElement('label');
                checkboxSpan.appendChild(emptyLabel);
                checkboxSpan.appendChild(checkbox);
                flexContainer.div2.appendChild(checkboxSpan);

                // Store references
                if (key === 'internal_bay_1') {
                    bay1Checkbox = checkbox;
                } else if (key === 'internal_bay_2') {
                    bay2Checkbox = checkbox;
                }
            }
        }

        cell.appendChild(flexContainer.div0);
        return { bombsInput, rocketsInput, bayCountInput, bay1Checkbox, bay2Checkbox };
    }

    /**
     * Create cargo section with simple select
     */
    private createCargoSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLSelectElement {
        let cargoSelect: HTMLSelectElement = undefined;

        // Find the select binding
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'options' in binding && 'selected' in binding) {
                // This is a select binding
                cargoSelect = document.createElement('select');
                cargoSelect.disabled = !binding.enabled;

                // Add options
                binding.options.forEach((opt: any, idx: number) => {
                    const option = document.createElement('option');
                    option.value = idx.toString();
                    option.textContent = opt.name;
                    option.disabled = !opt.enabled;
                    if (idx === binding.selected) {
                        option.selected = true;
                    }
                    cargoSelect!.appendChild(option);
                });

                cargoSelect.addEventListener('change', (event) => {
                    const target = event.target as HTMLSelectElement;
                    const updatedBindings = bridge.getCargoBindings();
                    updatedBindings[key].selected = parseInt(target.value);
                    bridge.setCargoBindings(updatedBindings);
                    this.render();
                });

                cell.appendChild(cargoSelect);
                break;
            }
        }

        return cargoSelect;
    }

    /**
     * Create stats section (inner table with 7 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): Map<string, HTMLTableCellElement> {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        const statCells = new Map<string, HTMLTableCellElement>();

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
            statCells.set(key, td);
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
            statCells.set(key, td);
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
        statCells.set('fueluseage', fuelUsesCell);
        data3.insertCell(); // empty

        cell.appendChild(statsTable);
        return statCells;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Update fuel inputs
        let fuelIdx = 0;
        for (const key in fuelBindings) {
            if (!fuelBindings.hasOwnProperty(key)) continue;
            const binding = fuelBindings[key];

            if (Array.isArray(binding)) {
                // number_list binding (e.g., tank_count)
                binding.forEach((item: any) => {
                    if (fuelIdx < this.cache!.fuelInputs.length) {
                        this.cache!.fuelInputs[fuelIdx].value = item.value.toString();
                        this.cache!.fuelInputs[fuelIdx].disabled = !item.enabled;
                        fuelIdx++;
                    }
                });
            } else if (binding && typeof binding === 'object' && 'value' in binding) {
                // Single number binding
                if (fuelIdx < this.cache!.fuelInputs.length) {
                    this.cache!.fuelInputs[fuelIdx].value = binding.value.toString();
                    this.cache!.fuelInputs[fuelIdx].disabled = !binding.enabled;
                    fuelIdx++;
                }
            }
        }

        if (this.cache.sealCheckbox) {
            this.cache.sealCheckbox.checked = fuelBindings.self_sealing?.selected || false;
            this.cache.sealCheckbox.disabled = !fuelBindings.self_sealing?.enabled;
        }

        if (this.cache.extinguisherCheckbox) {
            this.cache.extinguisherCheckbox.checked = fuelBindings.fire_extinguisher?.selected || false;
            this.cache.extinguisherCheckbox.disabled = !fuelBindings.fire_extinguisher?.enabled;
        }

        // Update munitions inputs
        if (this.cache.bombsInput) {
            this.cache.bombsInput.value = munitionsBindings.bomb_count?.value?.toString() || '0';
            this.cache.bombsInput.disabled = !munitionsBindings.bomb_count?.enabled;
        }

        if (this.cache.rocketsInput) {
            this.cache.rocketsInput.value = munitionsBindings.rocket_count?.value?.toString() || '0';
            this.cache.rocketsInput.disabled = !munitionsBindings.rocket_count?.enabled;
        }

        if (this.cache.bayCountInput) {
            this.cache.bayCountInput.value = munitionsBindings.internal_bay_count?.value?.toString() || '0';
            this.cache.bayCountInput.disabled = !munitionsBindings.internal_bay_count?.enabled;
        }

        if (this.cache.bay1Checkbox) {
            this.cache.bay1Checkbox.checked = munitionsBindings.internal_bay_1?.selected || false;
            this.cache.bay1Checkbox.disabled = !munitionsBindings.internal_bay_1?.enabled;
        }

        if (this.cache.bay2Checkbox) {
            this.cache.bay2Checkbox.checked = munitionsBindings.internal_bay_2?.selected || false;
            this.cache.bay2Checkbox.disabled = !munitionsBindings.internal_bay_2?.enabled;
        }

        // Update cargo select
        if (this.cache.cargoSelect) {
            for (const key in cargoBindings) {
                if (!cargoBindings.hasOwnProperty(key)) continue;
                const binding = cargoBindings[key];
                if (binding && 'selected' in binding) {
                    this.cache.cargoSelect.selectedIndex = binding.selected;
                    this.cache.cargoSelect.disabled = !binding.enabled;
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
        if (!this.cache) return;

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
        for (const [key, cell] of this.cache.statCells) {
            const value = combinedStats[key as keyof typeof combinedStats];
            if (cell.textContent !== (value?.toString() || '0')) {
                cell.textContent = value?.toString() || '0';
            }
        }
    }
}
