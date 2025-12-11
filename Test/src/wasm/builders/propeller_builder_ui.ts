/**
 * Propeller Engine Builder UI Component
 *
 * UI for configuring propeller engines using WASM backend
 */

import { createPropellerEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class PropellerBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private nameInput: HTMLInputElement;
    private eraSelect: HTMLSelectElement;
    private coolingSelect: HTMLSelectElement;
    private displacementInput: HTMLInputElement;
    private compressionInput: HTMLInputElement;
    private cylPerRowInput: HTMLInputElement;
    private rowsInput: HTMLInputElement;
    private rpmBoostInput: HTMLInputElement;
    private materialFudgeInput: HTMLInputElement;
    private qualityFudgeInput: HTMLInputElement;
    private compressorTypeSelect: HTMLSelectElement;
    private compressorCountInput: HTMLInputElement;
    private minIdealAltInput: HTMLInputElement;
    private upgradeCheckboxes: HTMLInputElement[] = [];

    // Output elements
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private coolingDisplay: HTMLSpanElement;
    private overspeedDisplay: HTMLSpanElement;
    private fuelDisplay: HTMLSpanElement;
    private altitudeDisplay: HTMLSpanElement;
    private torqueDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;
    private oilTankDisplay: HTMLSpanElement;
    private gearedRPMDisplay: HTMLSpanElement;

    // Current stats
    private currentStats: EngineStats | null = null;

    constructor(containerId: string, wasmModule: any) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container ${containerId} not found`);
        }
        this.container = container;
        this.wasmModule = wasmModule;

        this.buildUI();
        this.updateStats();
    }

    private buildUI(): void {
        this.container.innerHTML = '';

        // Create responsive grid container
        const gridContainer = document.createElement('div');
        gridContainer.className = 'engine-builder-container three-column';

        // Left section: Input parameters
        const inputSection = document.createElement('div');
        inputSection.className = 'engine-builder-section';
        const inputTitle = document.createElement('div');
        inputTitle.className = 'engine-builder-section-title';
        inputTitle.textContent = localization.translate('Engines Options');
        inputSection.appendChild(inputTitle);
        this.buildInputSection(inputSection);
        gridContainer.appendChild(inputSection);

        // Middle section: Upgrades
        const upgradesSection = document.createElement('div');
        upgradesSection.className = 'engine-builder-section';
        const upgradesTitle = document.createElement('div');
        upgradesTitle.className = 'engine-builder-section-title';
        upgradesTitle.textContent = localization.translate('Engine Upgrades');
        upgradesSection.appendChild(upgradesTitle);
        this.buildUpgradesSection(upgradesSection);
        gridContainer.appendChild(upgradesSection);

        // Right section: Output stats
        const outputSection = document.createElement('div');
        outputSection.className = 'engine-builder-section';
        const outputTitle = document.createElement('div');
        outputTitle.className = 'engine-builder-section-title';
        outputTitle.textContent = localization.translate('Engines Engine Stats');
        outputSection.appendChild(outputTitle);
        // Name display in title area
        this.nameDisplay = document.createElement('div');
        this.nameDisplay.className = 'engine-builder-name-display';
        this.nameDisplay.textContent = 'Custom Engine';
        outputSection.appendChild(this.nameDisplay);
        this.buildOutputSection(outputSection);
        gridContainer.appendChild(outputSection);

        this.container.appendChild(gridContainer);
    }

    private buildInputSection(container: HTMLElement): void {
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'engine-builder-inputs';

        // Get table data from WASM
        const eras: string[] = wasm.getPropellerEras();
        const coolingTypes: string[] = wasm.getPropellerCoolingTypes();

        // Name
        const nameRow = document.createElement('div');
        nameRow.className = 'engine-builder-row';
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Engine Builder Name');
        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.value = 'Custom Engine';
        this.nameInput.onchange = () => this.updateStats();
        nameRow.appendChild(nameLabel);
        nameRow.appendChild(this.nameInput);
        inputsDiv.appendChild(nameRow);

        // Era
        const eraRow = document.createElement('div');
        eraRow.className = 'engine-builder-row';
        const eraLabel = document.createElement('label');
        eraLabel.textContent = localization.translate('Engine Builder Era');
        this.eraSelect = document.createElement('select');
        eras.forEach((e, i) => {
            const opt = document.createElement('option');
            opt.text = e;
            opt.value = i.toString();
            this.eraSelect.add(opt);
        });
        this.eraSelect.onchange = () => this.updateStats();
        eraRow.appendChild(eraLabel);
        eraRow.appendChild(this.eraSelect);
        inputsDiv.appendChild(eraRow);

        // Cooling Type
        const coolingRow = document.createElement('div');
        coolingRow.className = 'engine-builder-row';
        const coolingLabel = document.createElement('label');
        coolingLabel.textContent = localization.translate('Engine Builder Type');
        this.coolingSelect = document.createElement('select');
        coolingTypes.forEach((c, i) => {
            const opt = document.createElement('option');
            opt.text = c;
            opt.value = i.toString();
            this.coolingSelect.add(opt);
        });
        this.coolingSelect.onchange = () => this.updateStats();
        coolingRow.appendChild(coolingLabel);
        coolingRow.appendChild(this.coolingSelect);
        inputsDiv.appendChild(coolingRow);

        // Displacement
        const dispRow = document.createElement('div');
        dispRow.className = 'engine-builder-row';
        const dispLabel = document.createElement('label');
        dispLabel.textContent = localization.translate('Engine Builder Displacement');
        this.displacementInput = document.createElement('input');
        this.displacementInput.type = 'number';
        this.displacementInput.min = '0.01';
        this.displacementInput.step = '0.01';
        this.displacementInput.valueAsNumber = 1;
        this.displacementInput.onchange = () => this.updateStats();
        dispRow.appendChild(dispLabel);
        dispRow.appendChild(this.displacementInput);
        inputsDiv.appendChild(dispRow);

        // Compression Ratio
        const compRow = document.createElement('div');
        compRow.className = 'engine-builder-row';
        const compLabel = document.createElement('label');
        compLabel.textContent = localization.translate('Engine Builder Compression Ratio');
        this.compressionInput = document.createElement('input');
        this.compressionInput.type = 'number';
        this.compressionInput.min = '0.01';
        this.compressionInput.step = '0.01';
        this.compressionInput.valueAsNumber = 2;
        this.compressionInput.onchange = () => this.updateStats();
        compRow.appendChild(compLabel);
        compRow.appendChild(this.compressionInput);
        inputsDiv.appendChild(compRow);

        // Cylinders per Row
        const cylRow = document.createElement('div');
        cylRow.className = 'engine-builder-row';
        const cylLabel = document.createElement('label');
        cylLabel.textContent = localization.translate('Engine Builder Cylinders Per Row');
        this.cylPerRowInput = document.createElement('input');
        this.cylPerRowInput.type = 'number';
        this.cylPerRowInput.min = '1';
        this.cylPerRowInput.step = '1';
        this.cylPerRowInput.valueAsNumber = 2;
        this.cylPerRowInput.onchange = () => this.updateStats();
        cylRow.appendChild(cylLabel);
        cylRow.appendChild(this.cylPerRowInput);
        inputsDiv.appendChild(cylRow);

        // Number of Rows
        const rowsRow = document.createElement('div');
        rowsRow.className = 'engine-builder-row';
        const rowsLabel = document.createElement('label');
        rowsLabel.textContent = localization.translate('Engine Builder Number of Rows');
        this.rowsInput = document.createElement('input');
        this.rowsInput.type = 'number';
        this.rowsInput.min = '1';
        this.rowsInput.step = '1';
        this.rowsInput.valueAsNumber = 2;
        this.rowsInput.onchange = () => this.updateStats();
        rowsRow.appendChild(rowsLabel);
        rowsRow.appendChild(this.rowsInput);
        inputsDiv.appendChild(rowsRow);

        // RPM Boost
        const rpmRow = document.createElement('div');
        rpmRow.className = 'engine-builder-row';
        const rpmLabel = document.createElement('label');
        rpmLabel.textContent = localization.translate('Engine Builder RPM Boost');
        this.rpmBoostInput = document.createElement('input');
        this.rpmBoostInput.type = 'number';
        this.rpmBoostInput.min = '0.01';
        this.rpmBoostInput.max = '2000';
        this.rpmBoostInput.step = '0.01';
        this.rpmBoostInput.valueAsNumber = 1;
        this.rpmBoostInput.onchange = () => this.updateStats();
        rpmRow.appendChild(rpmLabel);
        rpmRow.appendChild(this.rpmBoostInput);
        inputsDiv.appendChild(rpmRow);

        // Material Fudge
        const matRow = document.createElement('div');
        matRow.className = 'engine-builder-row';
        const matLabel = document.createElement('label');
        matLabel.textContent = localization.translate('Engine Builder Material Fudge');
        this.materialFudgeInput = document.createElement('input');
        this.materialFudgeInput.type = 'number';
        this.materialFudgeInput.min = '0.1';
        this.materialFudgeInput.max = '1.9';
        this.materialFudgeInput.step = '0.1';
        this.materialFudgeInput.valueAsNumber = 1.0;
        this.materialFudgeInput.onchange = () => this.updateStats();
        matRow.appendChild(matLabel);
        matRow.appendChild(this.materialFudgeInput);
        inputsDiv.appendChild(matRow);

        // Quality Fudge
        const qualRow = document.createElement('div');
        qualRow.className = 'engine-builder-row';
        const qualLabel = document.createElement('label');
        qualLabel.textContent = localization.translate('Engine Builder Quality Fudge');
        this.qualityFudgeInput = document.createElement('input');
        this.qualityFudgeInput.type = 'number';
        this.qualityFudgeInput.min = '0.1';
        this.qualityFudgeInput.max = '1.9';
        this.qualityFudgeInput.step = '0.1';
        this.qualityFudgeInput.valueAsNumber = 1.0;
        this.qualityFudgeInput.onchange = () => this.updateStats();
        qualRow.appendChild(qualLabel);
        qualRow.appendChild(this.qualityFudgeInput);
        inputsDiv.appendChild(qualRow);

        container.appendChild(inputsDiv);
    }

    private buildUpgradesSection(container: HTMLElement): void {
        const inputsDiv = document.createElement('div');
        inputsDiv.className = 'engine-builder-inputs';

        // Get table data from WASM
        const compressorTypes: string[] = wasm.getPropellerCompressorTypes();

        // Compressor Type
        const compTypeRow = document.createElement('div');
        compTypeRow.className = 'engine-builder-row';
        const compTypeLabel = document.createElement('label');
        compTypeLabel.textContent = localization.translate('Engine Builder Compressor Type');
        this.compressorTypeSelect = document.createElement('select');
        compressorTypes.forEach((c, i) => {
            const opt = document.createElement('option');
            opt.text = c;
            opt.value = i.toString();
            this.compressorTypeSelect.add(opt);
        });
        this.compressorTypeSelect.onchange = () => this.updateStats();
        compTypeRow.appendChild(compTypeLabel);
        compTypeRow.appendChild(this.compressorTypeSelect);
        inputsDiv.appendChild(compTypeRow);

        // Compressor Count
        const compCountRow = document.createElement('div');
        compCountRow.className = 'engine-builder-row';
        const compCountLabel = document.createElement('label');
        compCountLabel.textContent = localization.translate('Engine Builder Compressor Count');
        this.compressorCountInput = document.createElement('input');
        this.compressorCountInput.type = 'number';
        this.compressorCountInput.min = '0';
        this.compressorCountInput.step = '1';
        this.compressorCountInput.valueAsNumber = 0;
        this.compressorCountInput.onchange = () => this.updateStats();
        compCountRow.appendChild(compCountLabel);
        compCountRow.appendChild(this.compressorCountInput);
        inputsDiv.appendChild(compCountRow);

        // Min Ideal Altitude
        const altRow = document.createElement('div');
        altRow.className = 'engine-builder-row';
        const altLabel = document.createElement('label');
        altLabel.textContent = localization.translate('Engine Builder Min Ideal Altitude');
        this.minIdealAltInput = document.createElement('input');
        this.minIdealAltInput.type = 'number';
        this.minIdealAltInput.min = '0';
        this.minIdealAltInput.step = '10';
        this.minIdealAltInput.valueAsNumber = 0;
        this.minIdealAltInput.onchange = () => this.updateStats();
        altRow.appendChild(altLabel);
        altRow.appendChild(this.minIdealAltInput);
        inputsDiv.appendChild(altRow);

        // Upgrades (checkboxes)
        const upgrades: string[] = wasm.getPropellerUpgrades();
        for (const upgrade of upgrades) {
            const checkRow = document.createElement('div');
            checkRow.className = 'engine-builder-row checkbox-row';
            const checkLabel = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.onchange = () => this.updateStats();
            const checkText = document.createElement('span');
            checkText.textContent = upgrade;
            checkLabel.appendChild(checkbox);
            checkLabel.appendChild(checkText);
            checkRow.appendChild(checkLabel);
            inputsDiv.appendChild(checkRow);
            this.upgradeCheckboxes.push(checkbox);
        }

        container.appendChild(inputsDiv);
    }

    private buildOutputSection(container: HTMLElement): void {
        const statsGrid = document.createElement('div');
        statsGrid.className = 'engine-builder-stats';

        // Helper to create stat items
        const createStatItem = (labelKey: string): HTMLSpanElement => {
            const item = document.createElement('div');
            item.className = 'engine-builder-stat-item';
            const label = document.createElement('div');
            label.className = 'engine-builder-stat-label';
            label.textContent = localization.translate(labelKey);
            const value = document.createElement('span');
            value.className = 'engine-builder-stat-value';
            value.textContent = '0';
            item.appendChild(label);
            item.appendChild(value);
            statsGrid.appendChild(item);
            return value;
        };

        this.powerDisplay = createStatItem('Engine Builder Power');
        this.massDisplay = createStatItem('Engine Builder Mass');
        this.dragDisplay = createStatItem('Engine Builder Drag');
        this.reliabilityDisplay = createStatItem('Engine Builder Reliability');
        this.coolingDisplay = createStatItem('Engine Builder Required Cooling');
        this.overspeedDisplay = createStatItem('Engine Builder Overspeed');
        this.fuelDisplay = createStatItem('Engine Builder Fuel Consumption');
        this.altitudeDisplay = createStatItem('Engine Builder Altitude');
        this.torqueDisplay = createStatItem('Engine Builder Torque');
        this.costDisplay = createStatItem('Engine Builder Cost');
        this.oilTankDisplay = createStatItem('Engine Builder Oil Tank');
        this.gearedRPMDisplay = createStatItem('Engine Builder Geared RPM');

        container.appendChild(statsGrid);
    }

    private updateStats(): void {
        // Construct EngineInputs object
        const upgrades = this.upgradeCheckboxes.map(cb => cb.checked);

        const engineInputs = createPropellerEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            this.coolingSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.displacementInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.cylPerRowInput.valueAsNumber,
            this.rowsInput.valueAsNumber,
            this.rpmBoostInput.valueAsNumber,
            this.materialFudgeInput.valueAsNumber,
            this.qualityFudgeInput.valueAsNumber,
            this.compressorTypeSelect.selectedIndex,
            this.compressorCountInput.valueAsNumber,
            this.minIdealAltInput.valueAsNumber,
            upgrades
        );

        // compressorCount limiting
        if (this.compressorTypeSelect.selectedIndex == 0) {
            this.compressorCountInput.valueAsNumber = 0;
        } else if (this.compressorTypeSelect.selectedIndex == 1) {
            this.compressorCountInput.valueAsNumber = 1;
        } else if (this.compressorTypeSelect.selectedIndex > 1) {
            this.compressorCountInput.valueAsNumber = Math.max(1, Math.min(5, this.compressorCountInput.valueAsNumber));
        }

        try {
            // Call WASM function to calculate stats
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;

            // Update display
            this.displayStats();
        } catch (e) {
            console.error('Failed to calculate engine stats:', e);
        }
    }

    private displayStats(): void {
        if (!this.currentStats) return;

        this.nameDisplay.textContent = this.currentStats.name;
        this.powerDisplay.textContent = this.currentStats.stats.power.toString();
        this.massDisplay.textContent = this.currentStats.stats.mass.toString();
        this.dragDisplay.textContent = this.currentStats.stats.drag.toString();
        this.reliabilityDisplay.textContent = this.currentStats.stats.reliability.toString();
        this.coolingDisplay.textContent = this.currentStats.stats.cooling.toString();
        this.overspeedDisplay.textContent = this.currentStats.overspeed.toString();
        this.fuelDisplay.textContent = this.currentStats.stats.fuelconsumption.toString();

        // Altitude range display
        const minAlt = this.minIdealAltInput.valueAsNumber;
        const maxAlt = minAlt + this.currentStats.altitude;
        this.altitudeDisplay.textContent = `${minAlt}-${maxAlt}`;

        this.torqueDisplay.textContent = this.currentStats.torque.toString();
        this.costDisplay.textContent = this.currentStats.stats.cost.toString();
        this.oilTankDisplay.textContent = this.currentStats.oil_tank > 0
            ? localization.translate('Engine Builder Yes')
            : localization.translate('Engine Builder No');
        this.gearedRPMDisplay.textContent = this.currentStats.es1.toFixed(2);
    }

    /**
     * Get current engine configuration as EngineInputs
     */
    public getEngineInputs(): EngineInputs {
        const upgrades = this.upgradeCheckboxes.map(cb => cb.checked);

        return createPropellerEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            this.coolingSelect.selectedIndex,
            0, // rarity = CUSTOM
            this.displacementInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.cylPerRowInput.valueAsNumber,
            this.rowsInput.valueAsNumber,
            this.rpmBoostInput.valueAsNumber,
            this.materialFudgeInput.valueAsNumber,
            this.qualityFudgeInput.valueAsNumber,
            this.compressorTypeSelect.selectedIndex,
            this.compressorCountInput.valueAsNumber,
            this.minIdealAltInput.valueAsNumber,
            upgrades
        );
    }

    /**
     * Load engine configuration from EngineInputs
     */
    public setEngineInputs(inputs: EngineInputs): void {
        if (!('Propeller' in inputs.inputs)) {
            console.error('Invalid engine type for propeller builder');
            return;
        }

        const propInputs = (inputs.inputs as any).Propeller;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        // Note: cooling type stored separately in Rust, need to extract from inputs
        this.displacementInput.valueAsNumber = propInputs.displacement;
        this.compressionInput.valueAsNumber = propInputs.compression;
        this.cylPerRowInput.valueAsNumber = propInputs.cyl_per_row;
        this.rowsInput.valueAsNumber = propInputs.rows;
        this.rpmBoostInput.valueAsNumber = propInputs.rpm_boost;
        this.materialFudgeInput.valueAsNumber = propInputs.material_fudge;
        this.qualityFudgeInput.valueAsNumber = propInputs.quality_fudge;
        this.compressorTypeSelect.selectedIndex = propInputs.compressor_type;
        this.compressorCountInput.valueAsNumber = propInputs.compressor_count;
        this.minIdealAltInput.valueAsNumber = propInputs.min_ideal_alt;

        for (let i = 0; i < this.upgradeCheckboxes.length && i < propInputs.upgrades.length; i++) {
            this.upgradeCheckboxes[i].checked = propInputs.upgrades[i];
        }

        this.updateStats();
    }
}
