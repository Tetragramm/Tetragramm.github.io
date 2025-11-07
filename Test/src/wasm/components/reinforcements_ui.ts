/**
 * Reinforcements UI Component
 *
 * Displays the Reinforcements section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class ReinforcementsUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;
    private extWoodInputs: HTMLInputElement[] = [];
    private extSteelInputs: HTMLInputElement[] = [];
    private cantInputs: HTMLInputElement[] = [];
    private wiresCheckbox: HTMLInputElement | null = null;
    private cabaneSelect: HTMLSelectElement | null = null;
    private wingBladesCheckbox: HTMLInputElement | null = null;
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
            throw new Error('Bridge not available during ReinforcementsUI construction');
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
     * Render the Reinforcements UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[ReinforcementsUI] Bridge not initialized, skipping render');
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
        this.extWoodInputs = [];
        this.extSteelInputs = [];
        this.cantInputs = [];
        this.wiresCheckbox = null;
        this.cabaneSelect = null;
        this.wingBladesCheckbox = null;
        this.statCells.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[ReinforcementsUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getReinforcementsBindings();

        // Create main table with 3 columns: External | Internal | Stats
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'tbl_reinforcements';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Reinforcement External Reinforcements'),
            localization.translate('Reinforcement Internal Reinforcements'),
            localization.translate('Reinforcement Reinforcement Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        this.mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // External reinforcements cell
        const externalCell = document.createElement('td');
        this.createExternalSection(externalCell, bindings, bridge);
        dataRow.appendChild(externalCell);

        // Internal reinforcements cell
        const internalCell = document.createElement('td');
        this.createInternalSection(internalCell, bindings, bridge);
        dataRow.appendChild(internalCell);

        // Stats cell
        const statsCell = document.createElement('td');
        this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        this.mainTable.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Reinforcement Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            this.mainTable,
            true // Initially open
        );

        // Add rules link
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Reinforcements';
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

        console.log('[ReinforcementsUI] Full rebuild complete');
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
     * Create external reinforcements section
     */
    private createExternalSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Create nested flex containers for wood/steel columns
        const fsrDiv = document.createElement('div');
        fsrDiv.className = 'flex-container-o';
        const fsr1 = document.createElement('div');
        fsr1.className = 'flex-container-i';
        const fsr2 = document.createElement('div');
        fsr2.className = 'flex-container-i';
        fsrDiv.appendChild(fsr1);
        fsrDiv.appendChild(fsr2);
        flexContainer.div2.appendChild(fsrDiv);

        const fsWood = this.createFlexSection();
        const fsSteel = this.createFlexSection();
        fsr1.appendChild(fsWood.div0);
        fsr2.appendChild(fsSteel.div0);

        // External wood/steel reinforcements (number_list bindings)
        const extWoodBinding = bindings.ext_wood_count;
        const extSteelBinding = bindings.ext_steel_count;

        if (extWoodBinding && Array.isArray(extWoodBinding) && extSteelBinding && Array.isArray(extSteelBinding)) {
            for (let i = 0; i < extWoodBinding.length; i++) {
                const woodItem = extWoodBinding[i];
                const steelItem = extSteelBinding[i];

                // Label for the reinforcement type
                const label = document.createElement('label');
                label.textContent = woodItem.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                flexContainer.div1.appendChild(label);

                // Wood count input
                const woodLabel = document.createElement('label');
                woodLabel.textContent = localization.translate('Reinforcement Wood');
                woodLabel.className = 'flex-item';
                woodLabel.style.marginLeft = '0.25em';
                woodLabel.style.marginRight = '0.5em';
                fsWood.div1.appendChild(woodLabel);

                const woodInput = document.createElement('input');
                woodInput.type = 'number';
                woodInput.min = '0';
                woodInput.className = 'flex-item';
                woodInput.value = woodItem.value.toString();
                woodInput.disabled = !woodItem.enabled;
                woodInput.addEventListener('change', () => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.ext_wood_count[i].value = parseInt(woodInput.value) || 0;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.render();
                });
                fsWood.div2.appendChild(woodInput);
                this.extWoodInputs.push(woodInput);

                // Steel count input
                const steelLabel = document.createElement('label');
                steelLabel.textContent = localization.translate('Reinforcement Steel');
                steelLabel.className = 'flex-item';
                steelLabel.style.marginLeft = '0.25em';
                steelLabel.style.marginRight = '0.5em';
                fsSteel.div1.appendChild(steelLabel);

                const steelInput = document.createElement('input');
                steelInput.type = 'number';
                steelInput.min = '0';
                steelInput.className = 'flex-item';
                steelInput.value = steelItem.value.toString();
                steelInput.disabled = !steelItem.enabled;
                steelInput.addEventListener('change', () => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.ext_steel_count[i].value = parseInt(steelInput.value) || 0;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.render();
                });
                fsSteel.div2.appendChild(steelInput);
                this.extSteelInputs.push(steelInput);
            }
        }

        // Cabane select
        const cabaneBinding = bindings.cabane_sel;
        if (cabaneBinding && cabaneBinding.options) {
            const cabaneLabel = document.createElement('label');
            cabaneLabel.textContent = localization.translate('Reinforcement Cabane');
            cabaneLabel.className = 'flex-item';
            cabaneLabel.style.marginLeft = '0.25em';
            cabaneLabel.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(cabaneLabel);

            this.cabaneSelect = document.createElement('select');
            this.cabaneSelect.className = 'flex-item';
            this.cabaneSelect.disabled = !cabaneBinding.enabled;

            cabaneBinding.options.forEach((opt: any, idx: number) => {
                const option = document.createElement('option');
                option.value = idx.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                if (idx === cabaneBinding.selected) {
                    option.selected = true;
                }
                this.cabaneSelect!.appendChild(option);
            });

            this.cabaneSelect.addEventListener('change', () => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.cabane_sel.selected = parseInt(this.cabaneSelect!.value);
                bridge.setReinforcementsBindings(updatedBindings);
                this.render();
            });

            flexContainer.div2.appendChild(this.cabaneSelect);
        }

        // Wires checkbox
        const wiresBinding = bindings.wires;
        if (wiresBinding) {
            const wiresLabel = document.createElement('label');
            wiresLabel.textContent = localization.translate('Reinforcement Wires');
            wiresLabel.className = 'flex-item';
            wiresLabel.style.marginLeft = '0.25em';
            wiresLabel.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(wiresLabel);

            const checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'flex-item';

            this.wiresCheckbox = document.createElement('input');
            this.wiresCheckbox.type = 'checkbox';
            this.wiresCheckbox.checked = wiresBinding.selected;
            this.wiresCheckbox.disabled = !wiresBinding.enabled;
            this.wiresCheckbox.addEventListener('change', () => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.wires.selected = this.wiresCheckbox!.checked;
                bridge.setReinforcementsBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(this.wiresCheckbox);
            flexContainer.div2.appendChild(checkboxSpan);
        }

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create internal reinforcements section
     */
    private createInternalSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Cantilever reinforcements (number_list binding)
        const cantBinding = bindings.cant_count;
        if (cantBinding && Array.isArray(cantBinding)) {
            cantBinding.forEach((item: any, idx: number) => {
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
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.cant_count[idx].value = parseInt(input.value) || 0;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.render();
                });

                flexContainer.div2.appendChild(input);
                this.cantInputs.push(input);
            });
        }

        // Wing blades checkbox
        const wingBladesBinding = bindings.wing_blades;
        if (wingBladesBinding) {
            const wingLabel = document.createElement('label');
            wingLabel.textContent = localization.translate('Reinforcement Wing Blades');
            wingLabel.className = 'flex-item';
            wingLabel.style.marginLeft = '0.25em';
            wingLabel.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(wingLabel);

            const checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'flex-item';

            this.wingBladesCheckbox = document.createElement('input');
            this.wingBladesCheckbox.type = 'checkbox';
            this.wingBladesCheckbox.checked = wingBladesBinding.selected;
            this.wingBladesCheckbox.disabled = !wingBladesBinding.enabled;
            this.wingBladesCheckbox.addEventListener('change', () => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.wing_blades.selected = this.wingBladesCheckbox!.checked;
                bridge.setReinforcementsBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(this.wingBladesCheckbox);
            flexContainer.div2.appendChild(checkboxSpan);
        }

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create stats section (inner table with 6 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): void {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        // Row 1: Drag | Mass | Cost
        const header1 = statsTable.insertRow();
        ['Stat Drag', 'Stat Mass', 'Stat Cost'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header1.appendChild(th);
        });

        const data1 = statsTable.insertRow();
        ['drag', 'mass', 'cost'].forEach(key => {
            const td = data1.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 2: Structure | Raw Strain | Aircraft Max Strain
        const header2 = statsTable.insertRow();
        ['Stat Structure', 'Stat Raw Strain', 'Reinforcement Aircraft Max Strain'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header2.appendChild(th);
        });

        const data2 = statsTable.insertRow();
        ['structure', 'maxstrain'].forEach(key => {
            const td = data2.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Aircraft max strain (special class)
        const amaxTd = data2.insertCell();
        amaxTd.textContent = '0';
        amaxTd.className = 'part_local';
        this.statCells.set('amax', amaxTd);

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

        const bindings = bridge.getReinforcementsBindings();

        // Update external wood counts
        if (bindings.ext_wood_count && Array.isArray(bindings.ext_wood_count)) {
            bindings.ext_wood_count.forEach((item: any, idx: number) => {
                if (idx < this.extWoodInputs.length) {
                    this.extWoodInputs[idx].value = item.value.toString();
                    this.extWoodInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update external steel counts
        if (bindings.ext_steel_count && Array.isArray(bindings.ext_steel_count)) {
            bindings.ext_steel_count.forEach((item: any, idx: number) => {
                if (idx < this.extSteelInputs.length) {
                    this.extSteelInputs[idx].value = item.value.toString();
                    this.extSteelInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update cantilever counts
        if (bindings.cant_count && Array.isArray(bindings.cant_count)) {
            bindings.cant_count.forEach((item: any, idx: number) => {
                if (idx < this.cantInputs.length) {
                    this.cantInputs[idx].value = item.value.toString();
                    this.cantInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update cabane select
        if (this.cabaneSelect && bindings.cabane_sel) {
            this.cabaneSelect.selectedIndex = bindings.cabane_sel.selected;
            this.cabaneSelect.disabled = !bindings.cabane_sel.enabled;
            if (bindings.cabane_sel.options) {
                bindings.cabane_sel.options.forEach((opt: any, idx: number) => {
                    if (idx < this.cabaneSelect!.options.length) {
                        this.cabaneSelect!.options[idx].disabled = !opt.enabled;
                    }
                });
            }
        }

        // Update wires checkbox
        if (this.wiresCheckbox && bindings.wires) {
            this.wiresCheckbox.checked = bindings.wires.selected;
            this.wiresCheckbox.disabled = !bindings.wires.enabled;
        }

        // Update wing blades checkbox
        if (this.wingBladesCheckbox && bindings.wing_blades) {
            this.wingBladesCheckbox.checked = bindings.wing_blades.selected;
            this.wingBladesCheckbox.disabled = !bindings.wing_blades.enabled;
        }

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        const stats = bridge.getReinforcementsStats();

        for (const [key, cell] of this.statCells) {
            const value = stats[key];
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
        this.extWoodInputs = [];
        this.extSteelInputs = [];
        this.cantInputs = [];
        this.wiresCheckbox = null;
        this.cabaneSelect = null;
        this.wingBladesCheckbox = null;
        this.statCells.clear();
    }
}
