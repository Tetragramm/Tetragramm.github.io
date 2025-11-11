import { AircraftBridge } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import { createCollapsibleSection, createRulesLink } from '../dom_utils';

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
        this.container.appendChild(sectionDiv);

        const { section, header, content } = createCollapsibleSection(
            'engines-section',
            localization.translate('Engines Title'),
            createRulesLink('engines')
        );
        this.enginesSection = section;
        sectionDiv.appendChild(section);

        // Create global controls table
        const controlsTable = document.createElement('table');
        controlsTable.className = 'part_table';
        content.appendChild(controlsTable);

        const controlsRow = controlsTable.insertRow();

        // Asymmetric checkbox cell
        const asymmetricCell = controlsRow.insertCell();
        this.asymmetricCheckbox = document.createElement('input');
        this.asymmetricCheckbox.type = 'checkbox';
        this.asymmetricCheckbox.onchange = () => {
            const bindings = this.getBridge().getEnginesBindings();
            bindings.is_asymmetric.selected = this.asymmetricCheckbox!.checked;
            this.getBridge().setEnginesBindings(bindings);
            this.render();
        };
        const asymmetricLabel = document.createElement('label');
        asymmetricLabel.appendChild(this.asymmetricCheckbox);
        asymmetricLabel.appendChild(document.createTextNode(' ' + localization.translate('Engines Asymmetric Plane')));
        asymmetricCell.appendChild(asymmetricLabel);

        // Number of engines cell
        const numEnginesCell = controlsRow.insertCell();
        const numEnginesLabel = document.createElement('span');
        numEnginesLabel.textContent = localization.translate('Engines Number of Engines') + ': ';
        numEnginesCell.appendChild(numEnginesLabel);

        const enginesMinusBtn = document.createElement('button');
        enginesMinusBtn.textContent = '-';
        enginesMinusBtn.onclick = () => {
            const bindings = this.getBridge().getEnginesBindings();
            const newNum = Math.max(0, bindings.num_engines - 1);
            this.getBridge().setNumberOfEngines(newNum);
            this.render();
        };
        numEnginesCell.appendChild(enginesMinusBtn);

        this.numEnginesInput = document.createElement('input');
        this.numEnginesInput.type = 'number';
        this.numEnginesInput.min = '0';
        this.numEnginesInput.max = '20';
        this.numEnginesInput.style.width = '60px';
        this.numEnginesInput.onchange = () => {
            const newNum = parseInt(this.numEnginesInput!.value) || 0;
            this.getBridge().setNumberOfEngines(newNum);
            this.render();
        };
        numEnginesCell.appendChild(this.numEnginesInput);

        const enginesPlusBtn = document.createElement('button');
        enginesPlusBtn.textContent = '+';
        enginesPlusBtn.onclick = () => {
            const bindings = this.getBridge().getEnginesBindings();
            const newNum = Math.min(20, bindings.num_engines + 1);
            this.getBridge().setNumberOfEngines(newNum);
            this.render();
        };
        numEnginesCell.appendChild(enginesPlusBtn);

        // Number of radiators cell
        const numRadiatorsCell = controlsRow.insertCell();
        const numRadiatorsLabel = document.createElement('span');
        numRadiatorsLabel.textContent = localization.translate('Engines Number of Radiators') + ': ';
        numRadiatorsCell.appendChild(numRadiatorsLabel);

        const radiatorsMinusBtn = document.createElement('button');
        radiatorsMinusBtn.textContent = '-';
        radiatorsMinusBtn.onclick = () => {
            const bindings = this.getBridge().getEnginesBindings();
            const newNum = Math.max(0, bindings.num_radiators - 1);
            this.getBridge().setNumberOfRadiators(newNum);
            this.render();
        };
        numRadiatorsCell.appendChild(radiatorsMinusBtn);

        this.numRadiatorsInput = document.createElement('input');
        this.numRadiatorsInput.type = 'number';
        this.numRadiatorsInput.min = '0';
        this.numRadiatorsInput.max = '20';
        this.numRadiatorsInput.style.width = '60px';
        this.numRadiatorsInput.onchange = () => {
            const newNum = parseInt(this.numRadiatorsInput!.value) || 0;
            this.getBridge().setNumberOfRadiators(newNum);
            this.render();
        };
        numRadiatorsCell.appendChild(this.numRadiatorsInput);

        const radiatorsPlusBtn = document.createElement('button');
        radiatorsPlusBtn.textContent = '+';
        radiatorsPlusBtn.onclick = () => {
            const bindings = this.getBridge().getEnginesBindings();
            const newNum = Math.min(20, bindings.num_radiators + 1);
            this.getBridge().setNumberOfRadiators(newNum);
            this.render();
        };
        numRadiatorsCell.appendChild(radiatorsPlusBtn);

        // Container for individual engines
        this.enginesContainer = document.createElement('div');
        content.appendChild(this.enginesContainer);

        // Container for individual radiators
        this.radiatorsContainer = document.createElement('div');
        content.appendChild(this.radiatorsContainer);

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
        // Note: Engine UI is complex and will be implemented based on Engine.ts
        // For now, create a placeholder
        const cell = this.row.insertCell();
        cell.colSpan = 4;
        cell.textContent = `Engine ${this.index + 1} - Complex UI to be implemented`;
    }

    update(): void {
        // Update engine UI based on current bindings
        // This will be implemented when we flesh out the engine UI
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
