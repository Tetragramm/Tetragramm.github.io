import { AircraftBridge } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import { createCollapsibleSection, createFlexCheckbox, createFlexLabel, createFlexNumberInput, createFlexSection, createFlexSelect, createRulesLink, createSelectElement, updateSelectElement, createStatsTable, updateStatsTable, StatDisplayConfig } from '../dom_utils';
import { CreateCheckbox } from '../../disp/Tools';

// Engine stats configuration for stats table
const ENGINE_STATS: StatDisplayConfig[] = [
    // Row 1
    { key: 'power', label: 'Stat Power', positiveIsGood: true },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    // Row 2
    { key: 'reliability', label: 'Stat Reliability', positiveIsGood: true, isDerived: true },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: false },
    { key: 'overspeed', label: 'Stat Overspeed', positiveIsGood: true },
    // Row 3
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'altitude', label: 'Stat Altitude', positiveIsGood: true },
    { key: 'fuelconsumption', label: 'Stat Fuel Consumption', positiveIsGood: false },
    // Row 4
    { key: 'pitchstability', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'lateralstability', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Max Strain', positiveIsGood: true },
    // Row 5
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    // Row 6
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
    { key: '', label: '', positiveIsGood: undefined }, // Empty cell
    { key: '', label: '', positiveIsGood: undefined }  // Empty cell
];

/**
 * Engines UI Component
 * Handles both Engines container and individual Engine/Radiator UI
 */
export class EnginesUI extends BaseComponentUI {
    // Container elements
    private enginesSection: HTMLElement | undefined;
    private asymmetricCheckbox: HTMLInputElement | undefined;
    private numEnginesInput: HTMLInputElement | undefined;
    private numRadiatorsInput: HTMLInputElement | undefined;

    // Individual engine/radiator containers
    private enginesContainer: HTMLDivElement | undefined;
    private radiatorsContainer: HTMLDivElement | undefined;

    // Cached engine/radiator UIs (will be cleared when counts change)
    private engineUIs: EngineUI[] = [];
    private radiatorUIs: RadiatorUI[] = [];
    private cachedEngineCount: number = 0;
    private cachedRadiatorCount: number = 0;

    constructor(
        getBridge: () => AircraftBridge | null,
        containerId: string,
        onUpdate?: () => void
    ) {
        super(getBridge, containerId, onUpdate);
    }

    protected shouldUpdate(): boolean {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return false;

        const bindings = bridge.getEnginesBindings();
        const engineCountChanged = bindings.num_engines !== this.cachedEngineCount;
        const radiatorCountChanged = bindings.num_radiators !== this.cachedRadiatorCount;

        // If counts changed, need full rebuild
        if (engineCountChanged || radiatorCountChanged) return false;

        // Otherwise, can update if we have cached elements
        return this.enginesSection !== undefined;
    }

    protected clearCache(): void {
        this.enginesSection = undefined;
        this.asymmetricCheckbox = undefined;
        this.numEnginesInput = undefined;
        this.numRadiatorsInput = undefined;
        this.enginesContainer = undefined;
        this.radiatorsContainer = undefined;
        this.engineUIs = [];
        this.radiatorUIs = [];
        this.cachedEngineCount = 0;
        this.cachedRadiatorCount = 0;
    }

    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        // Create collapsible section for Engines
        const sectionDiv = document.createElement('div');

        const section = createCollapsibleSection(
            localization.translate('Engines Title'),
            sectionDiv,
            true
        );

        this.sectionElement = section;

        // Add rules link using utility function
        const rulesLine = document.createElement('span');
        rulesLine.appendChild(createRulesLink('_Engines', 'Engine Rules').firstChild);
        rulesLine.appendChild(createRulesLink('_Engines_Upgrades', 'Upgrade Rules').firstChild);
        rulesLine.appendChild(createRulesLink('_Cooling_(Air)', 'Cooling Rules').firstChild);
        rulesLine.appendChild(document.createElement('br'));
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );
        this.container.appendChild(section);
        this.enginesSection = section;

        // Create global controls table
        const controlsSpan = document.createElement('span');
        sectionDiv.appendChild(controlsSpan);

        // Number of engines 
        this.numEnginesInput = createFlexNumberInput({ name: localization.translate("Engines Num Engines"), value: 1, enabled: true },
            { div1: controlsSpan, div2: controlsSpan },
            () => {
                const newNum = parseInt(this.numEnginesInput!.value) || 0;
                this.getBridge().setNumberOfEngines(newNum);
                this.render();
            });
        this.numEnginesInput.min = '0';
        this.numEnginesInput.max = '20';

        // Number of radiators 
        this.numRadiatorsInput = createFlexNumberInput({ name: localization.translate("Engines Num Radiators"), value: 1, enabled: true },
            { div1: controlsSpan, div2: controlsSpan },
            () => {
                const newNum = parseInt(this.numRadiatorsInput!.value) || 0;
                this.getBridge().setNumberOfRadiators(newNum);
                this.render();
            });
        this.numRadiatorsInput.min = '0';
        this.numRadiatorsInput.max = '20';

        // Asymmetric checkbox
        this.asymmetricCheckbox = createFlexCheckbox({ name: localization.translate("Engines Asymmetric Plane"), value: false, enabled: true },
            { div1: controlsSpan, div2: controlsSpan },
            () => {
                const bindings = this.getBridge().getEnginesBindings();
                bindings.is_asymmetric.selected = this.asymmetricCheckbox!.checked;
                this.getBridge().setEnginesBindings(bindings);
                this.render();
            });

        // Container for individual engines
        this.enginesContainer = document.createElement('div');
        sectionDiv.appendChild(this.enginesContainer);

        // Container for individual radiators
        this.radiatorsContainer = document.createElement('div');
        sectionDiv.appendChild(this.radiatorsContainer);

        // Initial update
        this.updateValues();
    }

    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getEnginesBindings();

        // Update container-level controls
        if (this.asymmetricCheckbox) {
            this.asymmetricCheckbox.checked = bindings.is_asymmetric.selected;
            this.asymmetricCheckbox.disabled = !bindings.is_asymmetric.enabled;
        }

        if (this.numEnginesInput) {
            this.numEnginesInput.value = bindings.num_engines.toString();
        }

        if (this.numRadiatorsInput) {
            this.numRadiatorsInput.value = bindings.num_radiators.toString();
        }

        // Check if engine/radiator counts changed
        const engineCountChanged = bindings.num_engines !== this.cachedEngineCount;
        const radiatorCountChanged = bindings.num_radiators !== this.cachedRadiatorCount;

        // Rebuild engine UIs if count changed
        if (engineCountChanged) {
            this.cachedEngineCount = bindings.num_engines;
            this.rebuildEngines();
        } else {
            // Just update existing engine UIs
            this.engineUIs.forEach(engineUI => engineUI.update());
        }

        // Rebuild radiator UIs if count changed
        if (radiatorCountChanged) {
            this.cachedRadiatorCount = bindings.num_radiators;
            this.rebuildRadiators();
        } else {
            // Just update existing radiator UIs
            this.radiatorUIs.forEach(radiatorUI => radiatorUI.update());
        }
    }

    private rebuildEngines(): void {
        if (!this.enginesContainer) return;

        // Clear existing engine UIs
        this.engineUIs = [];
        this.enginesContainer.innerHTML = '';

        const bindings = this.getBridge().getEnginesBindings();

        // Create a table for all engines
        const enginesTable = document.createElement('table');
        enginesTable.className = 'part_table';
        this.enginesContainer.appendChild(enginesTable);

        // Create header row
        const headerRow = enginesTable.insertRow();
        const headerCell = document.createElement('th');
        headerCell.textContent = localization.translate('Engines Engine Type');
        headerRow.appendChild(headerCell);
        const headerCell2 = document.createElement('th');
        headerCell2.textContent = localization.translate('Engines Options');
        headerRow.appendChild(headerCell2);
        const headerCell3 = document.createElement('th');
        headerCell3.textContent = localization.translate('Engines Options 2');
        headerRow.appendChild(headerCell3);
        const headerCell4 = document.createElement('th');
        headerCell4.textContent = localization.translate('Engines Engine Stats');
        headerRow.appendChild(headerCell4);

        // Create each engine
        for (let i = 0; i < bindings.num_engines; i++) {
            const engineRow = enginesTable.insertRow();
            const engineUI = new EngineUI(this.getBridge, i, engineRow);
            this.engineUIs.push(engineUI);
        }
    }

    private rebuildRadiators(): void {
        if (!this.radiatorsContainer) return;

        // Clear existing radiator UIs
        this.radiatorUIs = [];
        this.radiatorsContainer.innerHTML = '';

        const bindings = this.getBridge().getEnginesBindings();

        if (bindings.num_radiators === 0) return;

        // Create a table for all radiators
        const radiatorsTable = document.createElement('table');
        radiatorsTable.className = 'part_table';
        this.radiatorsContainer.appendChild(radiatorsTable);

        // Create header row
        const headerRow = radiatorsTable.insertRow();
        const headerCell = document.createElement('th');
        headerCell.colSpan = 3;
        headerCell.textContent = localization.translate('Radiators');
        headerRow.appendChild(headerCell);

        // Create each radiator
        for (let i = 0; i < bindings.num_radiators; i++) {
            const radiatorRow = radiatorsTable.insertRow();
            const radiatorUI = new RadiatorUI(this.getBridge, i, radiatorRow);
            this.radiatorUIs.push(radiatorUI);
        }
    }
}

// Cache interface for type safety
interface EngineCache {
    listSelect: HTMLSelectElement;
    engineSelect: HTMLSelectElement;
    rarityLabel: HTMLSpanElement;
    statLabels: HTMLSpanElement[];

    // Cooling section (conditional elements based on engine type)
    coolingCell: HTMLTableCellElement;

    // Mounting section
    mountSelect?: HTMLSelectElement;
    pushPullCheckbox?: HTMLInputElement;
    torqueCheckbox?: HTMLInputElement;

    // Upgrades section
    driveshaftCheckbox?: HTMLInputElement;
    outboardCheckbox?: HTMLInputElement;
    gearCountInput?: HTMLInputElement;
    gearReliabilityInput?: HTMLInputElement;

    // Cowl & Electrical section
    cowlSelect?: HTMLSelectElement;
    alternatorCheckbox?: HTMLInputElement;
    generatorCheckbox?: HTMLInputElement;

    // Stats display table
    statsTable?: HTMLTableElement;
}

/**
 * Individual Engine UI
 * Handles UI for a single engine
 */
class EngineUI {
    private getBridge: () => AircraftBridge;
    private index: number;
    private row: HTMLTableRowElement;
    private cache: EngineCache;

    constructor(getBridge: () => AircraftBridge, index: number, row: HTMLTableRowElement) {
        this.getBridge = getBridge;
        this.index = index;
        this.row = row;
        this.buildUI();
    }

    private buildUI(): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        // First cell: Engine Type Selection and Stats Display
        const typeCell = this.row.insertCell();


        // Engine list selection
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(this.index);
        const listSelect = createSelectElement(
            {
                name: localization.translate('Engine List'),
                options: allLists.map((o) => { return { name: o, enabled: true } }),
                selected: allLists.indexOf(selectedList),
                enabled: true
            },
            () => {
                bridge.setEngineSelectedList(this.index, listSelect.options[listSelect.selectedIndex].text);
                //Update engineSelect
                const enginesInList = bridge.getEngineNamesInList(selectedList);
                const selectedEngineName = bridge.getEngineSelectedName(this.index);


                this.update();
            });
        typeCell.appendChild(listSelect);
        typeCell.appendChild(document.createElement('br'));

        // Engine selection within list

        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngineName = bridge.getEngineSelectedName(this.index);
        const engineSelect = createSelectElement(
            {
                name: localization.translate('Engine Type'),
                options: enginesInList.map((o) => { return { name: o, enabled: true } }),
                selected: enginesInList.indexOf(selectedEngineName),
                enabled: true
            },
            () => {
                bridge.setEngineSelectedIndex(this.index, engineSelect.selectedIndex);
                this.update();
            });
        typeCell.appendChild(engineSelect);
        typeCell.appendChild(document.createElement('br'));

        // Get full engine stats (includes rarity, overspeed, altitude, torque, rumble)
        const fullStats = bridge.getEngineFullStats(this.index);
        const flex = createFlexSection();
        // Display rarity with coloring
        const rarityLabel = createFlexLabel({ name: localization.translate('Rarity'), value: this.getRarityText(fullStats.rarity) },
            flex);
        rarityLabel.className = this.getRarityClass(fullStats.rarity);
        const PowerLabel = createFlexLabel({ name: localization.translate('Stat Power'), value: fullStats.stats.power }, flex);
        const MassLabel = createFlexLabel({ name: localization.translate('Stat Mass'), value: fullStats.stats.mass }, flex);
        const DragLabel = createFlexLabel({ name: localization.translate('Stat Drag'), value: fullStats.stats.drag }, flex);
        const ReliabilityLabel = createFlexLabel({ name: localization.translate('Stat Reliability'), value: fullStats.stats.reliability }, flex);
        const CoolingLabel = createFlexLabel({ name: localization.translate('Stat Cooling'), value: fullStats.stats.cooling }, flex);
        const OverspeedLabel = createFlexLabel({ name: localization.translate('Stat Overspeed'), value: fullStats.overspeed }, flex);
        const FuelLabel = createFlexLabel({ name: localization.translate('Stat Fuel Consumption'), value: fullStats.stats.fuelconsumption }, flex);
        const AltitudeLabel = createFlexLabel({ name: localization.translate('Stat Altitude'), value: fullStats.altitude }, flex);
        const TorqueLabel = createFlexLabel({ name: localization.translate('Stat Torque'), value: fullStats.torque }, flex);
        const RumbleLabel = createFlexLabel({ name: localization.translate('Stat Rumble'), value: fullStats.rumble }, flex);
        const CostLabel = createFlexLabel({ name: localization.translate('Stat Cost'), value: fullStats.stats.cost }, flex);
        typeCell.appendChild(flex.div0);

        // Second cell: Options (Cooling, Mounting, Upgrades)
        const optionsCell = this.row.insertCell();
        optionsCell.className = 'inner_table';

        const optionsTable = document.createElement('table');
        optionsTable.className = 'inner_table';
        optionsCell.appendChild(optionsTable);

        // Get engine bindings
        const bindings = bridge.getEngineBindings(this.index);

        // Cooling Section Header
        const coolingHeaderRow = optionsTable.insertRow();
        const coolingHeader = document.createElement('th');
        coolingHeader.textContent = localization.translate('Engine Cooling');
        coolingHeaderRow.appendChild(coolingHeader);

        // Cooling Section Content
        const coolingRow = optionsTable.insertRow();
        const coolingCell = coolingRow.insertCell();
        const coolingElements = this.buildCoolingSection(coolingCell, bindings, fullStats);

        // Mounting Section Header
        const mountingHeaderRow = optionsTable.insertRow();
        const mountingHeader = document.createElement('th');
        mountingHeader.textContent = localization.translate('Engine Mounting');
        mountingHeaderRow.appendChild(mountingHeader);

        // Mounting Section Content
        const mountingRow = optionsTable.insertRow();
        const mountingCell = mountingRow.insertCell();
        const mountingElements = this.buildMountingSection(mountingCell, bindings);

        // Upgrades Section Header
        const upgradesHeaderRow = optionsTable.insertRow();
        const upgradesHeader = document.createElement('th');
        upgradesHeader.textContent = localization.translate('Engine Upgrades');
        upgradesHeaderRow.appendChild(upgradesHeader);

        // Upgrades Section Content
        const upgradesRow = optionsTable.insertRow();
        const upgradesCell = upgradesRow.insertCell();
        const upgradesElements = this.buildUpgradesSection(upgradesCell, bindings);

        // Third cell: Cowl & Electrical
        const cowlElectricalCell = this.row.insertCell();
        cowlElectricalCell.className = 'inner_table';

        const cowlElectricalTable = document.createElement('table');
        cowlElectricalTable.className = 'inner_table';
        cowlElectricalCell.appendChild(cowlElectricalTable);

        // Cowl Section Header
        const cowlHeaderRow = cowlElectricalTable.insertRow();
        const cowlHeader = document.createElement('th');
        cowlHeader.textContent = localization.translate('Engine Cowls');
        cowlHeaderRow.appendChild(cowlHeader);

        // Cowl Section Content
        const cowlRow = cowlElectricalTable.insertRow();
        const cowlCell = cowlRow.insertCell();
        const cowlElements = this.buildCowlSection(cowlCell, bindings);

        // Electrical Section Header
        const electricalHeaderRow = cowlElectricalTable.insertRow();
        const electricalHeader = document.createElement('th');
        electricalHeader.textContent = localization.translate('Engine Electrical');
        electricalHeaderRow.appendChild(electricalHeader);

        // Electrical Section Content
        const electricalRow = cowlElectricalTable.insertRow();
        const electricalCell = electricalRow.insertCell();
        const electricalElements = this.buildElectricalSection(electricalCell, bindings);

        // Fourth cell: Stats Display Table
        const statsTableCell = this.row.insertCell();
        statsTableCell.className = 'inner_table';
        const statsTable = this.buildStatsTable(statsTableCell, bindings);

        this.cache = {
            listSelect,
            engineSelect,
            rarityLabel,
            statLabels: [PowerLabel, MassLabel, DragLabel,
                ReliabilityLabel, CoolingLabel, OverspeedLabel,
                FuelLabel, AltitudeLabel, TorqueLabel,
                RumbleLabel, CostLabel],
            coolingCell,
            ...mountingElements,
            ...upgradesElements,
            ...cowlElements,
            ...electricalElements,
            statsTable
        }
    }

    private buildCoolingSection(cell: HTMLTableCellElement, bindings: any, fullStats: any): {} {
        const bridge = this.getBridge();

        // Check engine type to determine cooling display
        const cooling = fullStats.stats.cooling || 0;

        if (fullStats.oiltank) {
            // Rotary engine
            const span = document.createElement('span');
            span.style = "white-space: pre-line";
            span.textContent = localization.translate('Engine Rotary Cooling');
            cell.appendChild(span);
        } else if (cooling === 0) {
            // Air-cooled engine
            const span = document.createElement('span');
            span.textContent = localization.translate('Engine Air-Cooled Engine.');
            cell.appendChild(span);

            // Add intake fan checkbox (for turbines)
            const flexContainer = createFlexSection();
            const intakeFanCheckbox = createFlexCheckbox(
                bindings.intake_fan,
                flexContainer,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(this.index);
                    updatedBindings.intake_fan.selected = checked;
                    bridge.setEngineBindings(this.index, updatedBindings);
                    this.update();
                }
            );
            cell.appendChild(flexContainer.div0);
        } else {
            // Liquid-cooled engine - show radiator select and cooling count
            const flexContainer = createFlexSection();

            // Radiator select dropdown
            const radiatorSelect = createFlexSelect(
                bindings.radiator_index,
                flexContainer,
                (selectedIndex) => {
                    const updatedBindings = bridge.getEngineBindings(this.index);
                    updatedBindings.radiator_index.selected = selectedIndex;
                    bridge.setEngineBindings(this.index, updatedBindings);
                    this.update();
                }
            );

            // Cooling count input
            const coolingInput = createFlexNumberInput(
                bindings.cooling_count,
                flexContainer,
                (value) => {
                    const updatedBindings = bridge.getEngineBindings(this.index);
                    updatedBindings.cooling_count.value = value;
                    bridge.setEngineBindings(this.index, updatedBindings);
                    this.update();
                }
            );

            cell.appendChild(flexContainer.div0);
        }

        // Return empty object since we rebuild cooling section on update
        return {};
    }

    private buildMountingSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();

        // Mounting location select
        const mountLabel = document.createElement('span');
        mountLabel.textContent = localization.translate('Engine Mounting Location');
        cell.appendChild(mountLabel);
        cell.appendChild(document.createElement('br'));

        const mountSelect = createSelectElement(
            bindings.mount_sel,
            () => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.mount_sel.selected = mountSelect.selectedIndex;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );
        cell.appendChild(mountSelect);
        cell.appendChild(document.createElement('br'));

        // Push-pull and torque-to-struct checkboxes
        const flexContainer = createFlexSection();

        const pushPullCheckbox = createFlexCheckbox(
            bindings.is_push_pull,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.is_push_pull.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        const torqueCheckbox = createFlexCheckbox(
            bindings.torque_to_struct,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.torque_to_struct.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        cell.appendChild(flexContainer.div0);

        return {
            mountSelect,
            pushPullCheckbox,
            torqueCheckbox
        };
    }

    private buildUpgradesSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();
        const flexContainer = createFlexSection();

        // Extended driveshafts checkbox
        const driveshaftCheckbox = createFlexCheckbox(
            bindings.extended_ds,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.extended_ds.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        // Outboard propeller checkbox
        const outboardCheckbox = createFlexCheckbox(
            bindings.outboard_prop,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.outboard_prop.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        // Geared propeller count input
        const gearCountInput = createFlexNumberInput(
            bindings.gear_count,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.gear_count.value = value;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        // Geared propeller reliability input
        const gearReliabilityInput = createFlexNumberInput(
            bindings.geared_reliability,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.geared_reliability.value = value;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        cell.appendChild(flexContainer.div0);

        return {
            driveshaftCheckbox,
            outboardCheckbox,
            gearCountInput,
            gearReliabilityInput
        };
    }

    private buildCowlSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();

        // Cowl select dropdown
        const cowlSelect = createSelectElement(
            bindings.cowl_sel,
            () => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.cowl_sel.selected = cowlSelect.selectedIndex;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );
        cell.appendChild(cowlSelect);

        return {
            cowlSelect
        };
    }

    private buildElectricalSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();
        const flexContainer = createFlexSection();

        // Alternator checkbox
        const alternatorCheckbox = createFlexCheckbox(
            bindings.has_alternator,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.has_alternator.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        // Generator checkbox
        const generatorCheckbox = createFlexCheckbox(
            bindings.is_generator,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.is_generator.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.update();
            }
        );

        cell.appendChild(flexContainer.div0);

        return {
            alternatorCheckbox,
            generatorCheckbox
        };
    }

    private buildStatsTable(cell: HTMLTableCellElement, bindings: any): HTMLTableElement {
        const bridge = this.getBridge();
        const engineStats = bridge.getEngineStats(this.index);
        const derivedStats = bridge.getEngineDerivedStats(this.index);
        const statsTable = createStatsTable(engineStats, ENGINE_STATS, derivedStats);
        cell.appendChild(statsTable);
        return statsTable;
    }

    private getRarityText(rarity: any): string {
        // Rarity enum: CUSTOM = 0, COMMON = 1, RARE = 2, LEGENDARY = 3
        switch (rarity) {
            case 'CUSTOM':
            case 0:
                return localization.translate('Rarity Custom');
            case 'COMMON':
            case 1:
                return localization.translate('Rarity Common');
            case 'RARE':
            case 2:
                return localization.translate('Rarity Rare');
            case 'LEGENDARY':
            case 3:
                return localization.translate('Rarity Legendary');
            default:
                return localization.translate('Rarity Custom');
        }
    }

    private getRarityClass(rarity: any): string {
        // Return CSS class for rarity coloring
        switch (rarity) {
            case 'CUSTOM':
            case 0:
                return 'ER_Custom';
            case 'COMMON':
            case 1:
                return '';
            case 'RARE':
            case 2:
                return 'ER_Rare';
            case 'LEGENDARY':
            case 3:
                return 'ER_Legendary';
            default:
                return 'ER_Custom';
        }
    }

    update(): void {
        const bridge = this.getBridge();
        const bindings = bridge.getEngineBindings(this.index);
        const fullStats = bridge.getEngineFullStats(this.index);

        // Update engine list/type selects
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(this.index);
        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngineName = bridge.getEngineSelectedName(this.index);
        updateSelectElement(this.cache.listSelect,
            {
                name: localization.translate('Engine List'),
                options: allLists.map((o) => { return { name: o, enabled: true } }),
                selected: allLists.indexOf(selectedList),
                enabled: true
            });
        updateSelectElement(this.cache.engineSelect,
            {
                name: localization.translate('Engine Type'),
                options: enginesInList.map((o) => { return { name: o, enabled: true } }),
                selected: enginesInList.indexOf(selectedEngineName),
                enabled: true
            });

        // Update rarity and stats
        this.cache.rarityLabel.textContent = this.getRarityText(fullStats.rarity);
        this.cache.rarityLabel.className = this.getRarityClass(fullStats.rarity);
        const stats = [
            fullStats.stats.power,
            fullStats.stats.mass,
            fullStats.stats.drag,
            fullStats.stats.reliability,
            fullStats.stats.cooling,
            fullStats.overspeed,
            fullStats.stats.fuelconsumption,
            fullStats.altitude,
            fullStats.torque,
            fullStats.rumble,
            fullStats.stats.cost,
        ]
        for (let i = 0; i < this.cache.statLabels.length; i++) {
            this.cache.statLabels[i].innerText = stats[i].toString();
        }

        // Rebuild cooling section (conditional content based on engine type)
        this.cache.coolingCell.innerHTML = '';
        this.buildCoolingSection(this.cache.coolingCell, bindings, fullStats);

        // Update mounting section
        if (this.cache.mountSelect) {
            updateSelectElement(this.cache.mountSelect, bindings.mount_sel);
        }
        if (this.cache.pushPullCheckbox) {
            this.cache.pushPullCheckbox.checked = bindings.is_push_pull.selected;
            this.cache.pushPullCheckbox.disabled = !bindings.is_push_pull.enabled;
        }
        if (this.cache.torqueCheckbox) {
            this.cache.torqueCheckbox.checked = bindings.torque_to_struct.selected;
            this.cache.torqueCheckbox.disabled = !bindings.torque_to_struct.enabled;
        }

        // Update upgrades section
        if (this.cache.driveshaftCheckbox) {
            this.cache.driveshaftCheckbox.checked = bindings.extended_ds.selected;
            this.cache.driveshaftCheckbox.disabled = !bindings.extended_ds.enabled;
        }
        if (this.cache.outboardCheckbox) {
            this.cache.outboardCheckbox.checked = bindings.outboard_prop.selected;
            this.cache.outboardCheckbox.disabled = !bindings.outboard_prop.enabled;
        }
        if (this.cache.gearCountInput) {
            this.cache.gearCountInput.value = bindings.gear_count.value.toString();
            this.cache.gearCountInput.disabled = !bindings.gear_count.enabled;
        }
        if (this.cache.gearReliabilityInput) {
            this.cache.gearReliabilityInput.value = bindings.geared_reliability.value.toString();
            this.cache.gearReliabilityInput.disabled = !bindings.geared_reliability.enabled;
        }

        // Update cowl & electrical section
        if (this.cache.cowlSelect) {
            updateSelectElement(this.cache.cowlSelect, bindings.cowl_sel);
        }
        if (this.cache.alternatorCheckbox) {
            this.cache.alternatorCheckbox.checked = bindings.has_alternator.selected;
            this.cache.alternatorCheckbox.disabled = !bindings.has_alternator.enabled;
        }
        if (this.cache.generatorCheckbox) {
            this.cache.generatorCheckbox.checked = bindings.is_generator.selected;
            this.cache.generatorCheckbox.disabled = !bindings.is_generator.enabled;
        }

        // Update stats table
        if (this.cache.statsTable) {
            const engineStats = bridge.getEngineStats(this.index);
            const derivedStats = bridge.getEngineDerivedStats(this.index);
            updateStatsTable(this.cache.statsTable, engineStats, ENGINE_STATS, derivedStats);
        }
    }
}

/**
 * Individual Radiator UI
 * Handles UI for a single radiator
 */
class RadiatorUI {
    private getBridge: () => AircraftBridge;
    private index: number;
    private row: HTMLTableRowElement;

    constructor(getBridge: () => AircraftBridge, index: number, row: HTMLTableRowElement) {
        this.getBridge = getBridge;
        this.index = index;
        this.row = row;
        this.buildUI();
    }

    private buildUI(): void {
        // Create radiator UI
        const bindings = this.getBridge().getRadiatorBindings(this.index);

        // Type select cell
        const typeCell = this.row.insertCell();
        const typeLabel = document.createElement('span');
        typeLabel.textContent = localization.translate('Radiator Type') + ': ';
        typeCell.appendChild(typeLabel);

        const typeSelect = document.createElement('select');
        bindings.idx_type.options.forEach((opt: any, i: number) => {
            const option = document.createElement('option');
            option.text = opt.name;
            option.disabled = !opt.enabled;
            typeSelect.add(option);
        });
        typeSelect.selectedIndex = bindings.idx_type.selected;
        typeSelect.onchange = () => {
            const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
            updatedBindings.idx_type.selected = typeSelect.selectedIndex;
            this.getBridge().setRadiatorBindings(this.index, updatedBindings);
            this.update();
        };
        typeCell.appendChild(typeSelect);

        // Mount select cell
        const mountCell = this.row.insertCell();
        const mountLabel = document.createElement('span');
        mountLabel.textContent = localization.translate('Radiator Mount') + ': ';
        mountCell.appendChild(mountLabel);

        const mountSelect = document.createElement('select');
        bindings.idx_mount.options.forEach((opt: any, i: number) => {
            const option = document.createElement('option');
            option.text = opt.name;
            option.disabled = !opt.enabled;
            mountSelect.add(option);
        });
        mountSelect.selectedIndex = bindings.idx_mount.selected;
        mountSelect.onchange = () => {
            const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
            updatedBindings.idx_mount.selected = mountSelect.selectedIndex;
            this.getBridge().setRadiatorBindings(this.index, updatedBindings);
            this.update();
        };
        mountCell.appendChild(mountSelect);

        // Coolant select cell
        const coolantCell = this.row.insertCell();
        const coolantLabel = document.createElement('span');
        coolantLabel.textContent = localization.translate('Radiator Coolant') + ': ';
        coolantCell.appendChild(coolantLabel);

        const coolantSelect = document.createElement('select');
        bindings.idx_coolant.options.forEach((opt: any, i: number) => {
            const option = document.createElement('option');
            option.text = opt.name;
            option.disabled = !opt.enabled;
            coolantSelect.add(option);
        });
        coolantSelect.selectedIndex = bindings.idx_coolant.selected;
        coolantSelect.onchange = () => {
            const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
            updatedBindings.idx_coolant.selected = coolantSelect.selectedIndex;
            this.getBridge().setRadiatorBindings(this.index, updatedBindings);
            this.update();
        };
        coolantCell.appendChild(coolantSelect);

        // Harden checkbox (if coolant has it)
        if (bindings.harden_cool) {
            const hardenCheckbox = document.createElement('input');
            hardenCheckbox.type = 'checkbox';
            hardenCheckbox.checked = bindings.harden_cool.selected;
            hardenCheckbox.disabled = !bindings.harden_cool.enabled;
            hardenCheckbox.onchange = () => {
                const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
                updatedBindings.harden_cool.selected = hardenCheckbox.checked;
                this.getBridge().setRadiatorBindings(this.index, updatedBindings);
                this.update();
            };
            const hardenLabel = document.createElement('label');
            hardenLabel.appendChild(hardenCheckbox);
            hardenLabel.appendChild(document.createTextNode(' ' + bindings.harden_cool.name));
            coolantCell.appendChild(document.createElement('br'));
            coolantCell.appendChild(hardenLabel);
        }
    }

    update(): void {
        // Rebuild the row (simple approach for now)
        this.row.innerHTML = '';
        this.buildUI();
    }
}
