/**
 * Reinforcements UI Component
 *
 * Displays the Reinforcements section using UIBindings from Rust
 * Includes external reinforcements (wood/steel, cabane, wires) and internal (cantilever, wing blades)
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createFlexNumberInputs,
    createFlexCheckbox,
    createSelectElement,
    createStatsTable,
    createCollapsibleSection,
    updateStatsTable,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileNumberInput,
    createMobileSelect,
    createMobileCheckbox,
    createMobileStatsGrid
} from '../dom_utils';

// Cache interface for type safety
interface ReinforcementsCache {
    // External reinforcements
    extWoodInputs: HTMLInputElement[];
    extSteelInputs: HTMLInputElement[];
    cabaneSelect: HTMLSelectElement;
    wiresCheckbox: HTMLInputElement;

    // Internal reinforcements
    cantInputs: HTMLInputElement[];
    wingBladesCheckbox: HTMLInputElement;

    // Stats table
    statsTable: HTMLTableElement;
}

// Reinforcements stats configuration
const REINFORCEMENTS_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Raw Strain', positiveIsGood: true },
    { key: 'max_strain', label: 'Reinforcement Aircraft Max Strain', positiveIsGood: true, isDerived: true },
];

export class ReinforcementsUI extends BaseComponentUI {
    private cache: ReinforcementsCache = undefined;

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

        const bindings = bridge.getReinforcementsBindings();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 3 columns: External | Internal | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_reinforcements';

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
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // External reinforcements cell
        const externalCell = document.createElement('td');
        const externalCache = this.createExternalSection(externalCell, bindings, bridge);
        dataRow.appendChild(externalCell);

        // Internal reinforcements cell
        const internalCell = document.createElement('td');
        const internalCache = this.createInternalSection(internalCell, bindings, bridge);
        dataRow.appendChild(internalCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        const stats = bridge.getReinforcementsStats();
        const derivedStats = bridge.getDerivedStats();
        const statsTable = createStatsTable(stats, REINFORCEMENTS_STATS, derivedStats);
        statsCell.appendChild(statsTable);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);

        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // External Reinforcements section
        const extItem = createMobileOptionItem(
            localization.translate('Reinforcement External Reinforcements'),
            mobileDiv
        );

        // Wood/Steel counts for each row
        const extWoodBinding = bindings.ext_wood_count;
        const extSteelBinding = bindings.ext_steel_count;

        if (extWoodBinding && Array.isArray(extWoodBinding) && extSteelBinding && Array.isArray(extSteelBinding)) {
            for (let i = 0; i < extWoodBinding.length; i++) {
                const woodItem = extWoodBinding[i];
                const steelItem = extSteelBinding[i];

                // Row label
                const rowDiv = document.createElement('div');
                rowDiv.style.marginBottom = '0.5em';
                const rowLabel = document.createElement('strong');
                rowLabel.textContent = woodItem.name;
                rowDiv.appendChild(rowLabel);
                extItem.content.appendChild(rowDiv);

                // Wood input
                const woodIndex = i;
                createMobileNumberInput(
                    { ...woodItem, name: localization.translate('Reinforcement Wood') },
                    extItem.content,
                    (value) => {
                        const updatedBindings = bridge.getReinforcementsBindings();
                        updatedBindings.ext_wood_count[woodIndex].value = value;
                        bridge.setReinforcementsBindings(updatedBindings);
                        this.onUpdate();
                    },
                    0,
                    99,
                    1
                );

                // Steel input
                const steelIndex = i;
                createMobileNumberInput(
                    { ...steelItem, name: localization.translate('Reinforcement Steel') },
                    extItem.content,
                    (value) => {
                        const updatedBindings = bridge.getReinforcementsBindings();
                        updatedBindings.ext_steel_count[steelIndex].value = value;
                        bridge.setReinforcementsBindings(updatedBindings);
                        this.onUpdate();
                    },
                    0,
                    99,
                    1
                );
            }
        }

        // Cabane select
        const cabaneBinding = bindings.cabane_sel;
        if (cabaneBinding) {
            createMobileSelect(
                { ...cabaneBinding, name: localization.translate('Reinforcement Cabane') },
                extItem.content,
                (selectedIndex) => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.cabane_sel.selected = selectedIndex;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Wires checkbox
        const wiresBinding = bindings.wires;
        if (wiresBinding) {
            createMobileCheckbox(
                { ...wiresBinding, name: localization.translate('Reinforcement Wires') },
                extItem.content,
                (checked) => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.wires.selected = checked;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Internal Reinforcements section
        const intItem = createMobileOptionItem(
            localization.translate('Reinforcement Internal Reinforcements'),
            mobileDiv
        );

        // Cantilever counts
        const cantBinding = bindings.cant_count;
        if (cantBinding && Array.isArray(cantBinding)) {
            cantBinding.forEach((item: any, idx: number) => {
                createMobileNumberInput(
                    item,
                    intItem.content,
                    (value) => {
                        const updatedBindings = bridge.getReinforcementsBindings();
                        updatedBindings.cant_count[idx].value = value;
                        bridge.setReinforcementsBindings(updatedBindings);
                        this.onUpdate();
                    },
                    0,
                    99,
                    1
                );
            });
        }

        // Wing blades checkbox
        const wingBladesBinding = bindings.wing_blades;
        if (wingBladesBinding) {
            createMobileCheckbox(
                { ...wingBladesBinding, name: localization.translate('Reinforcement Wing Blades') },
                intItem.content,
                (checked) => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.wing_blades.selected = checked;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Stats grid
        const statsItem = createMobileOptionItem(
            localization.translate('Reinforcement Reinforcement Stats'),
            mobileDiv
        );
        const statsGrid = createMobileStatsGrid(stats, REINFORCEMENTS_STATS, derivedStats);
        statsItem.content.appendChild(statsGrid);

        contentWrapper.appendChild(mobileDiv);

        // Cache elements
        this.cache = {
            ...externalCache,
            ...internalCache,
            statsTable
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Reinforcement Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Reinforcements');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[ReinforcementsUI] Full rebuild complete');
    }

    /**
     * Create external reinforcements section (wood/steel counts, cabane, wires)
     */
    private createExternalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        extWoodInputs: HTMLInputElement[];
        extSteelInputs: HTMLInputElement[];
        cabaneSelect: HTMLSelectElement;
        wiresCheckbox: HTMLInputElement;
    } {
        const mainFlex = createFlexSection();

        // Create nested flex containers for wood/steel columns
        const fsrDiv = document.createElement('div');
        fsrDiv.className = 'flex-container-o';
        const fsr1 = document.createElement('div');
        fsr1.className = 'flex-container-i';
        const fsr2 = document.createElement('div');
        fsr2.className = 'flex-container-i';
        fsrDiv.appendChild(fsr1);
        fsrDiv.appendChild(fsr2);
        mainFlex.div2.appendChild(fsrDiv);

        const fsWood = createFlexSection();
        const fsSteel = createFlexSection();
        fsr1.appendChild(fsWood.div0);
        fsr2.appendChild(fsSteel.div0);

        // External wood/steel reinforcements (number_list bindings)
        const extWoodBinding = bindings.ext_wood_count;
        const extSteelBinding = bindings.ext_steel_count;

        const extWoodInputs: HTMLInputElement[] = [];
        const extSteelInputs: HTMLInputElement[] = [];

        if (extWoodBinding && Array.isArray(extWoodBinding) && extSteelBinding && Array.isArray(extSteelBinding)) {
            for (let i = 0; i < extWoodBinding.length; i++) {
                const woodItem = extWoodBinding[i];
                const steelItem = extSteelBinding[i];

                // Label for the reinforcement type (on main flex left column)
                const label = document.createElement('label');
                label.textContent = woodItem.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                mainFlex.div1.appendChild(label);

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

                const woodIndex = i; // Capture for closure
                woodInput.addEventListener('change', () => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.ext_wood_count[woodIndex].value = parseInt(woodInput.value) || 0;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                });

                fsWood.div2.appendChild(woodInput);
                extWoodInputs.push(woodInput);

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

                const steelIndex = i; // Capture for closure
                steelInput.addEventListener('change', () => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.ext_steel_count[steelIndex].value = parseInt(steelInput.value) || 0;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                });

                fsSteel.div2.appendChild(steelInput);
                extSteelInputs.push(steelInput);
            }
        }

        // Cabane select
        const cabaneBinding = bindings.cabane_sel;
        const cabaneSelect = cabaneBinding ? createSelectElement(
            cabaneBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.cabane_sel.selected = selectedIndex;
                bridge.setReinforcementsBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (cabaneSelect) {
            const cabaneLabel = document.createElement('label');
            cabaneLabel.textContent = localization.translate('Reinforcement Cabane');
            cabaneLabel.className = 'flex-item';
            cabaneLabel.style.marginLeft = '0.25em';
            cabaneLabel.style.marginRight = '0.5em';
            mainFlex.div1.appendChild(cabaneLabel);

            cabaneSelect.className = 'flex-item';
            mainFlex.div2.appendChild(cabaneSelect);
        }

        // Wires checkbox - need custom layout for empty label
        const wiresBinding = bindings.wires;
        let wiresCheckbox: HTMLInputElement = undefined;

        if (wiresBinding) {
            const wiresLabel = document.createElement('label');
            wiresLabel.textContent = localization.translate('Reinforcement Wires');
            wiresLabel.className = 'flex-item';
            wiresLabel.style.marginLeft = '0.25em';
            wiresLabel.style.marginRight = '0.5em';
            mainFlex.div1.appendChild(wiresLabel);

            const checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'flex-item';

            wiresCheckbox = document.createElement('input');
            wiresCheckbox.type = 'checkbox';
            wiresCheckbox.checked = wiresBinding.selected;
            wiresCheckbox.disabled = !wiresBinding.enabled;
            wiresCheckbox.addEventListener('change', () => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.wires.selected = wiresCheckbox.checked;
                bridge.setReinforcementsBindings(updatedBindings);
                this.onUpdate();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(wiresCheckbox);
            mainFlex.div2.appendChild(checkboxSpan);
        }

        cell.appendChild(mainFlex.div0);

        return { extWoodInputs, extSteelInputs, cabaneSelect, wiresCheckbox };
    }

    /**
     * Create internal reinforcements section (cantilever counts, wing blades)
     */
    private createInternalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        cantInputs: HTMLInputElement[];
        wingBladesCheckbox: HTMLInputElement;
    } {
        const flexContainer = createFlexSection();

        // Cantilever reinforcements (number_list binding)
        const cantBinding = bindings.cant_count;
        const cantInputs = cantBinding && Array.isArray(cantBinding)
            ? createFlexNumberInputs(
                flexContainer,
                cantBinding,
                (idx) => (value) => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.cant_count[idx].value = value;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        // Wing blades checkbox - need custom layout for empty label
        const wingBladesBinding = bindings.wing_blades;
        let wingBladesCheckbox: HTMLInputElement = undefined;

        if (wingBladesBinding) {
            const wingLabel = document.createElement('label');
            wingLabel.textContent = localization.translate('Reinforcement Wing Blades');
            wingLabel.className = 'flex-item';
            wingLabel.style.marginLeft = '0.25em';
            wingLabel.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(wingLabel);

            const checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'flex-item';

            wingBladesCheckbox = document.createElement('input');
            wingBladesCheckbox.type = 'checkbox';
            wingBladesCheckbox.checked = wingBladesBinding.selected;
            wingBladesCheckbox.disabled = !wingBladesBinding.enabled;
            wingBladesCheckbox.addEventListener('change', () => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.wing_blades.selected = wingBladesCheckbox.checked;
                bridge.setReinforcementsBindings(updatedBindings);
                this.onUpdate();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(wingBladesCheckbox);
            flexContainer.div2.appendChild(checkboxSpan);
        }

        cell.appendChild(flexContainer.div0);

        return { cantInputs, wingBladesCheckbox };
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getReinforcementsBindings();

        // Update external wood counts
        if (bindings.ext_wood_count && Array.isArray(bindings.ext_wood_count)) {
            bindings.ext_wood_count.forEach((item: any, idx: number) => {
                if (idx < this.cache!.extWoodInputs.length) {
                    this.cache!.extWoodInputs[idx].value = item.value.toString();
                    this.cache!.extWoodInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update external steel counts
        if (bindings.ext_steel_count && Array.isArray(bindings.ext_steel_count)) {
            bindings.ext_steel_count.forEach((item: any, idx: number) => {
                if (idx < this.cache!.extSteelInputs.length) {
                    this.cache!.extSteelInputs[idx].value = item.value.toString();
                    this.cache!.extSteelInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update cantilever counts
        if (bindings.cant_count && Array.isArray(bindings.cant_count)) {
            bindings.cant_count.forEach((item: any, idx: number) => {
                if (idx < this.cache!.cantInputs.length) {
                    this.cache!.cantInputs[idx].value = item.value.toString();
                    this.cache!.cantInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update cabane select
        if (this.cache.cabaneSelect && bindings.cabane_sel) {
            updateSelectElement(this.cache.cabaneSelect, bindings.cabane_sel);
        }

        // Update wires checkbox
        if (this.cache.wiresCheckbox && bindings.wires) {
            this.cache.wiresCheckbox.checked = bindings.wires.selected;
            this.cache.wiresCheckbox.disabled = !bindings.wires.enabled;
        }

        // Update wing blades checkbox
        if (this.cache.wingBladesCheckbox && bindings.wing_blades) {
            this.cache.wingBladesCheckbox.checked = bindings.wing_blades.selected;
            this.cache.wingBladesCheckbox.disabled = !bindings.wing_blades.enabled;
        }

        // Update stats table
        const stats = bridge.getReinforcementsStats();
        const derivedStats = bridge.getDerivedStats();
        updateStatsTable(this.cache.statsTable, stats, REINFORCEMENTS_STATS, derivedStats);
    }
}
