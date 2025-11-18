/**
 * Electric Motor Builder UI Component
 *
 * UI for configuring electric motors using WASM backend
 */

import { createElectricEngine, EngineInputs, EngineStats } from '../types/engine_inputs';
import { createFlexSection, createFlexNumberInput, createFlexSelect, createFlexLabel } from '../dom_utils';
import { localization } from '../localization';
import * as wasm from '../../../pkg/flyingcircuswasm';

export class ElectricBuilderUI {
    private container: HTMLElement;
    private wasmModule: any;

    // Input elements
    private nameInput: HTMLInputElement;
    private eraSelect: HTMLSelectElement;
    private windingSelect: HTMLSelectElement;
    private powerInput: HTMLInputElement;
    private chonkInput: HTMLInputElement;
    private qualityInput: HTMLInputElement;

    // Output elements
    private nameDisplay: HTMLSpanElement;
    private powerDisplay: HTMLSpanElement;
    private massDisplay: HTMLSpanElement;
    private dragDisplay: HTMLSpanElement;
    private reliabilityDisplay: HTMLSpanElement;
    private chargeDrawDisplay: HTMLSpanElement;
    private overspeedDisplay: HTMLSpanElement;
    private costDisplay: HTMLSpanElement;

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

        const headerRow = table.insertRow();
        const input = document.createElement('th');
        input.textContent = localization.translate('Engines Options');
        headerRow.appendChild(input);
        const stats = document.createElement('th');
        stats.textContent = localization.translate('Engines Engine Stats');
        headerRow.appendChild(stats);

        const row = table.insertRow();

        const inputCell = row.insertCell();
        inputCell.style.verticalAlign = 'top';
        this.buildInputSection(inputCell);

        const outputCell = row.insertCell();
        outputCell.style.verticalAlign = 'top';
        this.buildOutputSection(outputCell);

        this.container.appendChild(table);
    }

    private buildInputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        const eras: string[] = wasm.getPropellerEras();
        const windings: string[] = wasm.getElectricWindings();

        // Name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Engine Builder Name');
        nameLabel.style.marginLeft = '0.25em';
        nameLabel.style.marginRight = '0.5em';
        flex.div1.appendChild(nameLabel);

        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.className = 'flex-item';
        this.nameInput.value = 'Custom Electric Motor';
        this.nameInput.onchange = () => this.updateStats();
        flex.div2.appendChild(this.nameInput);

        this.eraSelect = createFlexSelect(
            { name: localization.translate('Engine Builder Era'), options: eras.map(e => ({ name: e, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        this.windingSelect = createFlexSelect(
            { name: localization.translate('Electric Builder Winding'), options: windings.map(w => ({ name: w, enabled: true })), selected: 0, enabled: true },
            flex,
            () => this.updateStats()
        );

        this.powerInput = createFlexNumberInput(
            { name: localization.translate('Electric Builder Desired Power'), value: 100, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '1'
        );
        this.powerInput.valueAsNumber = 100;

        this.chonkInput = createFlexNumberInput(
            { name: localization.translate('Electric Builder Chonk'), value: 1.0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0', undefined, '0.1'
        );
        this.chonkInput.valueAsNumber = 1.0;

        this.qualityInput = createFlexNumberInput(
            { name: localization.translate('Electric Builder Quality'), value: 1.0, enabled: true },
            flex,
            (val) => this.updateStats(),
            '0.5', '2', '0.05'
        );
        this.qualityInput.valueAsNumber = 1.0;
    }

    private buildOutputSection(cell: HTMLTableCellElement): void {
        const flex = createFlexSection();
        cell.appendChild(flex.div0);

        this.nameDisplay = createFlexLabel({ name: localization.translate('Engine Builder Name'), value: '' }, flex);
        this.powerDisplay = createFlexLabel({ name: localization.translate('Engine Builder Power'), value: '0' }, flex);
        this.massDisplay = createFlexLabel({ name: localization.translate('Engine Builder Mass'), value: '0' }, flex);
        this.dragDisplay = createFlexLabel({ name: localization.translate('Engine Builder Drag'), value: '0' }, flex);
        this.reliabilityDisplay = createFlexLabel({ name: localization.translate('Engine Builder Reliability'), value: '0' }, flex);
        this.chargeDrawDisplay = createFlexLabel({ name: localization.translate('Electric Builder Charge Draw'), value: '0' }, flex);
        this.overspeedDisplay = createFlexLabel({ name: localization.translate('Engine Builder Overspeed'), value: '0' }, flex);
        this.costDisplay = createFlexLabel({ name: localization.translate('Engine Builder Cost'), value: '0' }, flex);
    }

    private updateStats(): void {
        const engineInputs = createElectricEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0,
            this.powerInput.valueAsNumber,
            this.windingSelect.selectedIndex,
            this.chonkInput.valueAsNumber,
            this.qualityInput.valueAsNumber
        );

        try {
            const statsJs = wasm.calculateEngineStats(engineInputs);
            this.currentStats = statsJs as EngineStats;
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
        this.chargeDrawDisplay.textContent = this.currentStats.stats.charge.toString();
        this.overspeedDisplay.textContent = this.currentStats.overspeed.toString();
        this.costDisplay.textContent = this.currentStats.stats.cost.toString();
    }

    public getEngineInputs(): EngineInputs {
        return createElectricEngine(
            this.nameInput.value,
            this.eraSelect.selectedIndex,
            0,
            this.powerInput.valueAsNumber,
            this.windingSelect.selectedIndex,
            this.chonkInput.valueAsNumber,
            this.qualityInput.valueAsNumber
        );
    }

    public setEngineInputs(inputs: EngineInputs): void {
        if (!('Electric' in inputs.inputs)) {
            console.error('Invalid engine type for electric builder');
            return;
        }

        const electricInputs = (inputs.inputs as any).Electric;

        this.nameInput.value = inputs.name;
        this.eraSelect.selectedIndex = inputs.era_sel;
        this.windingSelect.selectedIndex = electricInputs.winding_sel;
        this.powerInput.valueAsNumber = electricInputs.power;
        this.chonkInput.valueAsNumber = electricInputs.chonk;
        this.qualityInput.valueAsNumber = electricInputs.quality_fudge;

        this.updateStats();
    }
}
