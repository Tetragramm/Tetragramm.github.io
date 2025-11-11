import { AircraftBridge } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import { createCollapsibleSection, createFlexCheckbox, createFlexNumberInput, createRulesLink } from '../dom_utils';
import { CreateCheckbox } from '../../disp/Tools';

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
        headerCell.colSpan = 4;
        headerCell.textContent = localization.translate('Engines');
        headerRow.appendChild(headerCell);

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

/**
 * Individual Engine UI
 * Handles UI for a single engine
 */
class EngineUI {
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
        const bridge = this.getBridge();
        if (!bridge) return;

        // Get engine bindings and stats
        const bindings = bridge.getEngineBindings(this.index);
        const stats = bridge.getEngineStats(this.index);

        // First cell: Engine Type Selection and Stats Display
        const typeCell = this.row.insertCell();
        typeCell.className = 'inner_table';

        // Create inner table for type selection
        const typeTable = document.createElement('table');
        typeTable.className = 'inner_table';
        typeCell.appendChild(typeTable);

        // Engine name/title row
        const nameRow = typeTable.insertRow();
        const nameCell = nameRow.insertCell();
        nameCell.colSpan = 2;
        const engineTitle = document.createElement('h4');
        engineTitle.textContent = `Engine ${this.index + 1}`;
        nameCell.appendChild(engineTitle);

        // Engine list selection
        const listRow = typeTable.insertRow();
        const listLabelCell = listRow.insertCell();
        listLabelCell.textContent = localization.translate('Engine List') + ':';
        listLabelCell.style.fontWeight = 'bold';
        const listSelectCell = listRow.insertCell();
        const listSelect = document.createElement('select');
        const allLists = bridge.getEngineListNames();
        const selectedList = bridge.getEngineSelectedList(this.index);
        allLists.forEach((listName: string) => {
            const option = document.createElement('option');
            option.text = listName;
            option.value = listName;
            if (listName === selectedList) {
                option.selected = true;
            }
            listSelect.add(option);
        });
        listSelect.onchange = () => {
            bridge.setEngineSelectedList(this.index, listSelect.value);
            this.update();
        };
        listSelectCell.appendChild(listSelect);

        // Engine selection within list
        const engineRow = typeTable.insertRow();
        const engineLabelCell = engineRow.insertCell();
        engineLabelCell.textContent = localization.translate('Engine Type') + ':';
        engineLabelCell.style.fontWeight = 'bold';
        const engineSelectCell = engineRow.insertCell();
        const engineSelect = document.createElement('select');
        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngineName = bridge.getEngineSelectedName(this.index);
        enginesInList.forEach((engineName: string, idx: number) => {
            const option = document.createElement('option');
            option.text = engineName;
            option.value = idx.toString();
            if (engineName === selectedEngineName) {
                option.selected = true;
            }
            engineSelect.add(option);
        });
        engineSelect.onchange = () => {
            bridge.setEngineSelectedIndex(this.index, parseInt(engineSelect.value));
            this.update();
        };
        engineSelectCell.appendChild(engineSelect);

        // Get full engine stats (includes rarity, overspeed, altitude, torque, rumble)
        const fullStats = bridge.getEngineFullStats(this.index);

        // Display rarity with coloring
        const rarityRow = typeTable.insertRow();
        const rarityLabelCell = rarityRow.insertCell();
        const rarityValueCell = rarityRow.insertCell();
        rarityLabelCell.textContent = localization.translate('Rarity') + ':';
        rarityLabelCell.style.fontWeight = 'bold';
        rarityValueCell.textContent = this.getRarityText(fullStats.rarity);
        rarityValueCell.className = this.getRarityClass(fullStats.rarity);

        // Display all engine stats
        this.addStatRow(typeTable, 'Stat Power', fullStats.stats.power?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Mass', fullStats.stats.mass?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Drag', fullStats.stats.drag?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Reliability', fullStats.stats.reliability?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Cooling', fullStats.stats.cooling?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Overspeed', fullStats.overspeed?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Fuel Consumption', fullStats.stats.fuelconsumption?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Altitude', `${fullStats.altitude || 0}`);
        this.addStatRow(typeTable, 'Stat Torque', fullStats.torque?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Rumble', fullStats.rumble?.toString() || '0');
        this.addStatRow(typeTable, 'Stat Cost', fullStats.stats.cost?.toString() || '0');

        // TODO: Add additional cells for:
        // - Engine options (mounting, cooling, upgrades, cowls, electrical)
        // - Stats display table
    }

    private addStatRow(table: HTMLTableElement, labelKey: string, value: string): void {
        const row = table.insertRow();
        const labelCell = row.insertCell();
        const valueCell = row.insertCell();

        labelCell.textContent = localization.translate(labelKey) + ':';
        labelCell.style.fontWeight = 'bold';
        labelCell.style.paddingRight = '8px';

        valueCell.textContent = value;
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
        // Rebuild the row (simple approach)
        this.row.innerHTML = '';
        this.buildUI();
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
