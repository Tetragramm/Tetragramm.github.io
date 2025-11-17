/**
 * Turbine Engine Builder UI Component
 *
 * UI for configuring turbine engines (jets, turbofans, turboprops) using WASM backend
 */

import { createTurbineEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createFlexSection, createFlexNumberInput, createFlexSelect, createFlexCheckbox, createFlexLabel } from '../dom_utils';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class TurboBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private nameInput: HTMLInputElement;
    private eraSelect: HTMLSelectElement;
    private typeSelect: HTMLSelectElement;
    private diameterInput: HTMLInputElement;
    private compressionInput: HTMLInputElement;
    private bypassInput: HTMLInputElement;
    private flowAdjustInput: HTMLInputElement;
    private afterburnerCheckbox: HTMLInputElement;

    // Output elements
    private descriptionCell: HTMLTableCellElement;
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private fuelDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;
    private altitudeDisplay: HTMLSpanElement;

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

        const table = document.createElement('table');
        table.style.width = '100%';
        const row = table.insertRow();

        const inputCell = row.insertCell();
        inputCell.style.verticalAlign = 'top';
        this.buildInputSection(inputCell);

        this.descriptionCell = row.insertCell();
        this.descriptionCell.style.verticalAlign = 'top';
        this.descriptionCell.style.padding = '10px';
        this.descriptionCell.style.maxWidth = '300px';

        const outputCell = row.insertCell();
        outputCell.style.verticalAlign = 'top';
        this.buildOutputSection(outputCell);

        this.container.appendChild(table);
    }

    private buildInputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        const eras: string[] = wasm.getPropellerEras();
        const types: string[] = wasm.getTurbineTypes();

        // Name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Engine Builder Name');
        nameLabel.style.marginLeft = '0.25em';
        nameLabel.style.marginRight = '0.5em';
        flex.div1.appendChild(nameLabel);

        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.className = 'flex-item';
        this.nameInput.value = 'Custom Turbine';
        this.nameInput.onchange = () => this.updateStats();
        flex.div2.appendChild(this.nameInput);

        this.eraSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Era'), options: eras.map(e => ({ name: e, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        this.typeSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Type'), options: types.map(t => ({ name: t, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateTypeChanged()
        );

        this.diameterInput = createFlexNumberInput(
            { name: localization.translate('Turbo Builder Diameter'), value: 1.0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '0.01'
        );
        this.diameterInput.valueAsNumber = 1.0;

        this.compressionInput = createFlexNumberInput(
            { name: localization.translate('Turbo Builder Overall Pressure Ratio'), value: 10, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '0.01'
        );
        this.compressionInput.valueAsNumber = 10;

        this.bypassInput = createFlexNumberInput(
            { name: localization.translate('Turbo Builder Bypass Ratio'), value: 0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '0.1'
        );
        this.bypassInput.valueAsNumber = 0;

        this.flowAdjustInput = createFlexNumberInput(
            { name: localization.translate('Turbo Builder Mass Flow Adjustment'), value: 0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '-0.5', '0.5', '0.05'
        );
        this.flowAdjustInput.valueAsNumber = 0;

        this.afterburnerCheckbox = createFlexCheckbox(
            { name: localization.translate('Turbo Builder Afterburner'), selected: false, enabled: true },
            flex,
            () => this.updateStats()
        );
    }

    private buildOutputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        this.nameDisplay = createFlexLabel({ name: localization.translate('Engine Builder Name'), value: '' }, flex);
        this.powerDisplay = createFlexLabel({ name: localization.translate('Turbo Builder Thrust'), value: '0' }, flex);
        this.massDisplay = createFlexLabel({ name: localization.translate('Engine Builder Mass'), value: '0' }, flex);
        this.dragDisplay = createFlexLabel({ name: localization.translate('Engine Builder Drag'), value: '0' }, flex);
        this.reliabilityDisplay = createFlexLabel({ name: localization.translate('Engine Builder Reliability'), value: '0' }, flex);
        this.fuelDisplay = createFlexLabel({ name: localization.translate('Engine Builder Fuel Consumption'), value: '0' }, flex);
        this.costDisplay = createFlexLabel({ name: localization.translate('Engine Builder Cost'), value: '0' }, flex);
        this.altitudeDisplay = createFlexLabel({ name: localization.translate('Engine Builder Altitude'), value: '0' }, flex);
    }

    private updateTypeChanged(): void {
        const selectedType = this.typeSelect.selectedIndex;
        if (selectedType === 0 || selectedType === 3) {
            this.bypassInput.disabled = true;
        } else {
            this.bypassInput.disabled = false;
        }
        this.updateStats();
    }

    private updateStats(): void {
        const upgrades = [this.afterburnerCheckbox.checked];

        const engineInputs = createTurbineEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0,
            this.flowAdjustInput.valueAsNumber,
            this.diameterInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.bypassInput.valueAsNumber,
            upgrades
        );

        try {
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;
            this.displayStats();
            this.updateDescription();
        } catch (e) {
            console.error('Failed to calculate engine stats:', e);
        }
    }

    private displayStats(): void {
        if (!this.currentStats) return;

        this.nameDisplay.textContent = this.nameInput.value;
        this.powerDisplay.textContent = this.currentStats.power.toString();
        this.massDisplay.textContent = this.currentStats.mass.toString();
        this.dragDisplay.textContent = this.currentStats.drag.toString();
        this.reliabilityDisplay.textContent = this.currentStats.reliability.toString();
        this.fuelDisplay.textContent = this.currentStats.fuel_consumption.toString();
        this.costDisplay.textContent = this.currentStats.cost.toString();
        this.altitudeDisplay.textContent = this.currentStats.altitude.toString();
    }

    private updateDescription(): void {
        const typeIndex = this.typeSelect.selectedIndex;

        const thrust = 'N/A';
        const tsfc = 'N/A';

        let description = '';

        switch (typeIndex) {
            case 0:
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake) and OPR. Then
                    adjust the mass flow rate until the Thrust is just below the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.<br/>`;
                break;

            case 1:
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.`;
                break;

            case 2:
                description = `<b>Engine Parameters:</b><br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = ${thrust} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = ${tsfc} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total diameter of the largest fan, Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.`;
                break;

            case 3:
                description = `For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Power is just below
                    the rated takeoff power (in effective shp if available, shp if not). Note
                    that Power = 10*hp<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.`;
                break;
        }

        this.descriptionCell.innerHTML = description;
    }

    public getEngineInputs(): EngineInputs {
        const upgrades = [this.afterburnerCheckbox.checked];

        return createTurbineEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0,
            this.flowAdjustInput.valueAsNumber,
            this.diameterInput.valueAsNumber,
            this.compressionInput.valueAsNumber,
            this.bypassInput.valueAsNumber,
            upgrades
        );
    }

    public setEngineInputs(inputs: EngineInputs): void {
        if (inputs.etype !== 2 || !('Turbine' in inputs.inputs)) {
            console.error('Invalid engine type for turbine builder');
            return;
        }

        const turbineInputs = (inputs.inputs as any).Turbine;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        this.flowAdjustInput.valueAsNumber = turbineInputs.flow_adjustment;
        this.diameterInput.valueAsNumber = turbineInputs.diameter;
        this.compressionInput.valueAsNumber = turbineInputs.compression_ratio;
        this.bypassInput.valueAsNumber = turbineInputs.bypass_ratio;
        this.afterburnerCheckbox.checked = turbineInputs.upgrades[0] || false;

        this.updateStats();
    }
}
