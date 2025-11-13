/**
 * Accessories UI Component
 *
 * Displays the Accessories section using UIBindings from Rust
 * Includes armour, electrical, radio, reconnaissance, visibility, climate, autopilot, and control systems
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createFlexNumberInputs,
    createFlexCheckboxes,
    createSelectElement,
    createStatsTable,
    createCollapsibleSection,
    updateStatsTable,
    StatDisplayConfig
} from '../dom_utils';

// Cache interface for type safety
interface AccessoriesCache {
    // Armour coverage inputs (8 positions for different AP levels)
    armourInputs: HTMLInputElement[];

    // Electrical equipment inputs
    electricalInputs: HTMLInputElement[];

    // Radio select
    radioSelect: HTMLSelectElement;

    // Reconnaissance inputs
    reconInputs: HTMLInputElement[];

    // Visibility checkboxes
    visiCheckboxes: HTMLInputElement[];

    // Climate control checkboxes
    climCheckboxes: HTMLInputElement[];

    // Autopilot select
    autopilotSelect: HTMLSelectElement;

    // Control system select
    controlSelect: HTMLSelectElement;

    // Stat cells
    statsTable: HTMLTableElement;
}

// Accessories stats configuration
const ACCESSORIES_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true },
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
];

export class AccessoriesUI extends BaseComponentUI {
    private cache: AccessoriesCache = undefined;

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

        const bindings = bridge.getAccessoriesBindings();

        // Create main table with 2 rows: first row has 4 cells, second row has 3 cells
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_accessories';

        // Row 1 - Header
        const headerRow1 = document.createElement('tr');
        [
            localization.translate('Accessories Climate'),
            localization.translate('Accessories Armour Coverage'),
            localization.translate('Accessories Visibility'),
            localization.translate('Accessories Additional Part Stats')
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow1.appendChild(th);
        });
        mainTable.appendChild(headerRow1);

        // Row 1 - Data
        const dataRow1 = document.createElement('tr');

        // Climate cell
        const climateCell = document.createElement('td');
        const climCheckboxes = this.createClimateSection(climateCell, bindings, bridge);
        dataRow1.appendChild(climateCell);

        // Armour cell
        const armourCell = document.createElement('td');
        const armourInputs = this.createArmourSection(armourCell, bindings, bridge);
        dataRow1.appendChild(armourCell);

        // Visibility cell
        const visibilityCell = document.createElement('td');
        const visiCheckboxes = this.createVisibilitySection(visibilityCell, bindings, bridge);
        dataRow1.appendChild(visibilityCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        statsCell.rowSpan = 3;
        const stats = bridge.getAccessoriesStats();
        const statsTable = createStatsTable(stats, ACCESSORIES_STATS);
        statsCell.append(statsTable);
        dataRow1.appendChild(statsCell);

        mainTable.appendChild(dataRow1);

        // Row 2 - Header
        const headerRow2 = document.createElement('tr');
        [
            localization.translate('Accessories Information'),
            localization.translate('Accessories Electrical'),
            localization.translate('Accessories Control')
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow2.appendChild(th);
        });
        mainTable.appendChild(headerRow2);

        // Row 2 - Data
        const dataRow2 = document.createElement('tr');

        // Information cell (reconnaissance)
        const infoCell = document.createElement('td');
        const reconInputs = this.createInformationSection(infoCell, bindings, bridge);
        dataRow2.appendChild(infoCell);

        // Electrical cell (radio + electrical equipment)
        const electricalCell = document.createElement('td');
        const { radioSelect, electricalInputs } = this.createElectricalSection(electricalCell, bindings, bridge);
        dataRow2.appendChild(electricalCell);

        // Control cell (autopilot + control system)
        const controlCell = document.createElement('td');
        const { autopilotSelect, controlSelect } = this.createControlSection(controlCell, bindings, bridge);
        dataRow2.appendChild(controlCell);

        mainTable.appendChild(dataRow2);

        // Cache elements
        this.cache = {
            armourInputs,
            electricalInputs,
            radioSelect,
            reconInputs,
            visiCheckboxes,
            climCheckboxes,
            autopilotSelect,
            controlSelect,
            statsTable
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Accessories Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            mainTable,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Accessories');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[AccessoriesUI] Full rebuild complete');
    }

    /**
     * Create armour coverage section (8 number inputs for AP levels)
     * Note: armour_coverage is not a UI binding, needs special handling
     */
    private createArmourSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLInputElement[] {
        const flexContainer = createFlexSection();
        const flexContainerL = createFlexSection();
        const flexContainerR = createFlexSection();
        flexContainer.div1.appendChild(flexContainerL.div0);
        flexContainer.div2.appendChild(flexContainerR.div0);

        // Reconnaissance equipment counts
        const armourBinding = bindings.armour_coverage;
        const armourInputsL = armourBinding && Array.isArray(armourBinding)
            ? createFlexNumberInputs(
                flexContainerL,
                armourBinding.slice(0, 4),
                (idx) => (value) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.armour_coverage[idx].value = value;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];
        const armourInputsR = armourBinding && Array.isArray(armourBinding)
            ? createFlexNumberInputs(
                flexContainerR,
                armourBinding.slice(4, 9),
                (idx) => (value) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.armour_coverage[idx + 4].value = value;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        cell.appendChild(flexContainer.div0);
        return armourInputsL.concat(armourInputsR);
    }

    /**
     * Create electrical section (radio select + electrical equipment counts)
     */
    private createElectricalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        radioSelect: HTMLSelectElement;
        electricalInputs: HTMLInputElement[];
    } {
        const flexContainer = createFlexSection();

        // Radio select
        const radioBinding = bindings.radio_sel;
        const radioSelect = radioBinding ? createSelectElement(
            radioBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getAccessoriesBindings();
                updatedBindings.radio_sel.selected = selectedIndex;
                bridge.setAccessoriesBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (radioSelect) {
            const radioLabel = document.createElement('label');
            radioLabel.textContent = localization.translate('Accessories Radio');
            radioLabel.style.marginRight = '10px';
            cell.appendChild(radioLabel);
            cell.appendChild(radioSelect);
            cell.appendChild(document.createElement('br'));
        }

        // Electrical equipment counts
        const electricalBinding = bindings.electrical_count;
        const electricalInputs = electricalBinding && Array.isArray(electricalBinding)
            ? createFlexNumberInputs(
                flexContainer,
                electricalBinding,
                (idx) => (value) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.electrical_count[idx].value = value;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        cell.appendChild(flexContainer.div0);
        return { radioSelect, electricalInputs };
    }

    /**
     * Create climate section (climate control checkboxes)
     */
    private createClimateSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLInputElement[] {
        const flexContainer = createFlexSection();

        // Climate control toggles
        const climBinding = bindings.clim_sel;
        const climCheckboxes = climBinding && Array.isArray(climBinding)
            ? createFlexCheckboxes(
                flexContainer,
                climBinding,
                (idx) => (checked) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.clim_sel[idx].selected = checked;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        cell.appendChild(flexContainer.div0);
        return climCheckboxes;
    }

    /**
     * Create visibility section (visibility equipment checkboxes)
     */
    private createVisibilitySection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLInputElement[] {
        const flexContainer = createFlexSection();

        // Visibility equipment toggles
        const visiBinding = bindings.visi_sel;
        const visiCheckboxes = visiBinding && Array.isArray(visiBinding)
            ? createFlexCheckboxes(
                flexContainer,
                visiBinding,
                (idx) => (checked) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.visi_sel[idx].selected = checked;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        cell.appendChild(flexContainer.div0);
        return visiCheckboxes;
    }

    /**
     * Create information section (reconnaissance equipment)
     */
    private createInformationSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLInputElement[] {
        const flexContainer = createFlexSection();

        // Reconnaissance equipment counts
        const reconBinding = bindings.recon_sel;
        const reconInputs = reconBinding && Array.isArray(reconBinding)
            ? createFlexNumberInputs(
                flexContainer,
                reconBinding,
                (idx) => (value) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.recon_sel[idx].value = value;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        cell.appendChild(flexContainer.div0);
        return reconInputs;
    }

    /**
     * Create control section (autopilot and control system)
     */
    private createControlSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        autopilotSelect: HTMLSelectElement;
        controlSelect: HTMLSelectElement;
    } {
        const flexContainer = createFlexSection();

        // Autopilot select
        const autopilotBinding = bindings.auto_sel;
        const autopilotSelect = autopilotBinding ? createSelectElement(
            autopilotBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getAccessoriesBindings();
                updatedBindings.auto_sel.selected = selectedIndex;
                bridge.setAccessoriesBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (autopilotSelect) {
            const autopilotLabel = document.createElement('label');
            autopilotLabel.textContent = localization.translate('Accessories Autopilot');
            autopilotLabel.style.marginRight = '10px';
            cell.appendChild(autopilotLabel);
            cell.appendChild(autopilotSelect);
            cell.appendChild(document.createElement('br'));
        }

        // Control system select
        const controlBinding = bindings.cont_sel;
        const controlSelect = controlBinding ? createSelectElement(
            controlBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getAccessoriesBindings();
                updatedBindings.cont_sel.selected = selectedIndex;
                bridge.setAccessoriesBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (controlSelect) {
            const controlLabel = document.createElement('label');
            controlLabel.textContent = localization.translate('Accessories Control System');
            controlLabel.style.marginRight = '10px';
            cell.appendChild(controlLabel);
            cell.appendChild(controlSelect);
            cell.appendChild(document.createElement('br'));
        }

        return { autopilotSelect, controlSelect };
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getAccessoriesBindings();

        // Update armour inputs
        if (bindings.armour_coverage && Array.isArray(bindings.armour_coverage)) {
            bindings.armour_coverage.forEach((item: any, idx: number) => {
                if (idx < this.cache!.armourInputs.length) {
                    this.cache!.armourInputs[idx].value = item.value.toString();
                    this.cache!.armourInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update electrical inputs
        if (bindings.electrical_count && Array.isArray(bindings.electrical_count)) {
            bindings.electrical_count.forEach((item: any, idx: number) => {
                if (idx < this.cache!.electricalInputs.length) {
                    this.cache!.electricalInputs[idx].value = item.value.toString();
                    this.cache!.electricalInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update radio select
        if (this.cache.radioSelect && bindings.radio_sel) {
            updateSelectElement(this.cache.radioSelect, bindings.radio_sel);
        }

        // Update recon inputs
        if (bindings.recon_sel && Array.isArray(bindings.recon_sel)) {
            bindings.recon_sel.forEach((item: any, idx: number) => {
                if (idx < this.cache!.reconInputs.length) {
                    this.cache!.reconInputs[idx].value = item.value.toString();
                    this.cache!.reconInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Update visibility checkboxes
        if (bindings.visi_sel && Array.isArray(bindings.visi_sel)) {
            bindings.visi_sel.forEach((item: any, idx: number) => {
                if (idx < this.cache!.visiCheckboxes.length) {
                    this.cache!.visiCheckboxes[idx].checked = item.selected;
                    this.cache!.visiCheckboxes[idx].disabled = !item.enabled;
                }
            });
        }

        // Update climate checkboxes
        if (bindings.clim_sel && Array.isArray(bindings.clim_sel)) {
            bindings.clim_sel.forEach((item: any, idx: number) => {
                if (idx < this.cache!.climCheckboxes.length) {
                    this.cache!.climCheckboxes[idx].checked = item.selected;
                    this.cache!.climCheckboxes[idx].disabled = !item.enabled;
                }
            });
        }

        // Update autopilot select
        if (this.cache.autopilotSelect && bindings.auto_sel) {
            updateSelectElement(this.cache.autopilotSelect, bindings.auto_sel);
        }

        // Update control select
        if (this.cache.controlSelect && bindings.cont_sel) {
            updateSelectElement(this.cache.controlSelect, bindings.cont_sel);
        }

        // Update stat values
        const stats = bridge.getAccessoriesStats();
        updateStatsTable(this.cache.statsTable, stats, ACCESSORIES_STATS);
    }
}
