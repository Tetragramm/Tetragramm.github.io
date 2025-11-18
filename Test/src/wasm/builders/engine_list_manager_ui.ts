/**
 * Engine List Manager UI Component
 *
 * Manages engine lists: viewing, adding, removing, saving, loading
 */

import { EngineInputs } from '../types/engine_inputs';
import { AircraftBridge } from '../aircraft_bridge';
import { BlinkGood, BlinkBad } from '../dom_utils';
import { localization } from '../localization';

export class EngineListManagerUI {
    private container: HTMLElement;
    private bridge: AircraftBridge;

    // UI elements
    private listSelect: HTMLSelectElement;
    private engineSelect: HTMLSelectElement;
    private listNameInput: HTMLInputElement;
    private createListBtn: HTMLButtonElement;
    private deleteListBtn: HTMLButtonElement;
    private deleteEngineBtn: HTMLButtonElement;
    private deleteEngineLabel: HTMLLabelElement;
    private saveListBtn: HTMLButtonElement;
    private loadListInput: HTMLInputElement;
    private addPropellerBtn: HTMLButtonElement;
    private addPulsejetBtn: HTMLButtonElement;
    private addTurbineBtn: HTMLButtonElement;
    private addElectricBtn: HTMLButtonElement;

    // Callbacks for getting engine inputs from each builder
    private onGetPropellerEngine: (() => EngineInputs) | null = null;
    private onGetPulsejetEngine: (() => EngineInputs) | null = null;
    private onGetTurbineEngine: (() => EngineInputs) | null = null;
    private onGetElectricEngine: (() => EngineInputs) | null = null;

    // Callback for when an engine is selected from the list
    private onEngineSelected: ((engine: EngineInputs) => void) | null = null;

    private currentList: string = 'Custom';
    private selectedEngineName: string = '';
    private internalIdCounter: number = 0;

    constructor(containerId: string, bridge: AircraftBridge) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container ${containerId} not found`);
        }
        this.container = container;
        this.bridge = bridge;

        this.buildUI();
        this.updateLists();
    }

    private generateID(): string {
        this.internalIdCounter++;
        return `engine_list_manager_${this.internalIdCounter}`;
    }

    private createSelect(text: string, select: HTMLSelectElement, parent: HTMLElement, br: boolean = true): void {
        const span = document.createElement('span');
        const label = document.createElement('label');
        select.id = this.generateID();
        label.htmlFor = select.id;
        label.style.marginLeft = '0.25em';
        label.style.marginRight = '0.5em';
        label.textContent = text;
        span.appendChild(label);
        span.appendChild(select);
        parent.appendChild(span);
        if (br) {
            parent.appendChild(document.createElement('br'));
        }
    }

    private createButton(text: string, button: HTMLElement, parent: HTMLElement, br: boolean = true): HTMLLabelElement {
        const span = document.createElement('span');
        const label = document.createElement('label');
        button.hidden = true;
        button.id = this.generateID();
        button.textContent = text;
        label.htmlFor = button.id;
        label.style.marginLeft = '0.25em';
        label.style.marginRight = '0.5em';
        label.textContent = text;
        label.classList.add('lbl_action');
        label.classList.add('btn_th');
        span.appendChild(label);
        span.appendChild(button);
        parent.appendChild(span);
        if (br) {
            parent.appendChild(document.createElement('br'));
        }
        return label;
    }

    private buildUI(): void {
        this.container.innerHTML = '';

        // Create elements
        this.listSelect = document.createElement('select');
        this.engineSelect = document.createElement('select');
        this.listNameInput = document.createElement('input');
        this.createListBtn = document.createElement('button');
        this.deleteListBtn = document.createElement('button');
        this.deleteEngineBtn = document.createElement('button');
        this.saveListBtn = document.createElement('button');
        this.loadListInput = document.createElement('input');
        this.addPropellerBtn = document.createElement('button');
        this.addPulsejetBtn = document.createElement('button');
        this.addTurbineBtn = document.createElement('button');
        this.addElectricBtn = document.createElement('button');

        // Set up event handlers
        this.listSelect.onchange = () => this.onListChanged();
        this.engineSelect.onchange = () => this.onEngineChanged();
        this.deleteEngineBtn.onclick = () => this.deleteEngine();
        this.saveListBtn.onclick = () => this.saveList();
        this.loadListInput.type = 'file';
        this.loadListInput.accept = 'application/json';
        this.loadListInput.style.display = 'none';
        this.loadListInput.onchange = () => this.loadList();
        this.addPropellerBtn.onclick = () => this.addFromBuilder('propeller');
        this.addPulsejetBtn.onclick = () => this.addFromBuilder('pulsejet');
        this.addTurbineBtn.onclick = () => this.addFromBuilder('turbine');
        this.addElectricBtn.onclick = () => this.addFromBuilder('electric');
        this.createListBtn.onclick = () => this.createList();
        this.deleteListBtn.onclick = () => this.deleteList();

        // Build layout
        this.createSelect(localization.translate('Engine Builder Lists'), this.listSelect, this.container);
        this.createSelect(localization.translate('Engine Builder Engines'), this.engineSelect, this.container);
        this.container.appendChild(document.createElement('br'));

        this.createButton(localization.translate('Engine Builder Save List'), this.saveListBtn, this.container);
        const loadLabel = this.createButton(localization.translate('Engine Builder Load List'), this.loadListInput, this.container);
        loadLabel.onclick = () => this.loadListInput.click();

        this.createButton(localization.translate('Engine Builder Add From Propeller'), this.addPropellerBtn, this.container);
        this.createButton(localization.translate('Engine Builder Add From Pulsejet'), this.addPulsejetBtn, this.container);
        this.createButton(localization.translate('Engine Builder Add From Turbine'), this.addTurbineBtn, this.container);
        this.createButton(localization.translate('Engine Builder Add From Electric'), this.addElectricBtn, this.container);

        // Delete engine button with engine name display
        const deleteSpan = document.createElement('span');
        this.deleteEngineLabel = document.createElement('label');
        this.deleteEngineBtn.hidden = true;
        this.deleteEngineBtn.id = this.generateID();
        this.deleteEngineLabel.htmlFor = this.deleteEngineBtn.id;
        this.deleteEngineLabel.style.marginLeft = '0.25em';
        this.deleteEngineLabel.style.marginRight = '0.5em';
        this.deleteEngineLabel.classList.add('lbl_action');
        this.deleteEngineLabel.classList.add('btn_th');
        this.updateDeleteButtonLabel();
        deleteSpan.appendChild(this.deleteEngineLabel);
        deleteSpan.appendChild(this.deleteEngineBtn);
        this.container.appendChild(deleteSpan);
        this.container.appendChild(document.createElement('br'));

        // Create list section
        const createSpan = document.createElement('span');
        const createLabel = document.createElement('label');
        this.createListBtn.hidden = true;
        this.createListBtn.id = this.generateID();
        createLabel.htmlFor = this.createListBtn.id;
        createLabel.innerHTML = '<b>&nbsp;' + localization.translate('Engine Builder Create List') + '&nbsp;&nbsp;</b>';
        createLabel.classList.add('lbl_action');
        createLabel.classList.add('btn_th');
        createSpan.appendChild(createLabel);
        createSpan.appendChild(this.createListBtn);
        createSpan.appendChild(this.listNameInput);
        this.container.appendChild(createSpan);
        this.container.appendChild(document.createElement('br'));
        this.container.appendChild(document.createElement('br'));

        this.createButton(localization.translate('Engine Builder Delete List'), this.deleteListBtn, this.container);
    }

    private updateDeleteButtonLabel(): void {
        if (this.selectedEngineName) {
            this.deleteEngineLabel.textContent = `${localization.translate('Engine Builder Delete Engine')} (${this.selectedEngineName})`;
        } else {
            this.deleteEngineLabel.textContent = localization.translate('Engine Builder Delete Engine');
        }
    }

    private onListChanged(): void {
        const selected = this.listSelect.options[this.listSelect.selectedIndex];
        if (selected) {
            this.currentList = selected.text;
            this.selectedEngineName = '';
            this.updateDeleteButtonLabel();
            this.updateEngines();
        }
    }

    private onEngineChanged(): void {
        const selectedIndex = this.engineSelect.selectedIndex;
        if (selectedIndex >= 0 && this.onEngineSelected) {
            try {
                const engines = this.bridge.getEnginesInList(this.currentList);
                if (selectedIndex < engines.length) {
                    this.selectedEngineName = engines[selectedIndex].name;
                    this.updateDeleteButtonLabel();
                    this.onEngineSelected(engines[selectedIndex]);
                }
            } catch (e) {
                console.error('Failed to get engine from list:', e);
            }
        }
        // Deselect after loading
        this.engineSelect.selectedIndex = -1;
    }

    private updateLists(): void {
        // Get list names from bridge (via localStorage)
        const namesJson = localStorage.getItem('test.engines_names');
        const listNames: string[] = namesJson ? JSON.parse(namesJson) : ['Custom'];

        // Clear and rebuild list selector
        this.listSelect.innerHTML = '';
        for (const name of listNames) {
            const opt = document.createElement('option');
            opt.text = name;
            opt.selected = name === this.currentList;
            this.listSelect.add(opt);
        }

        this.updateEngines();
    }

    private updateEngines(): void {
        // Clear engine selector
        this.engineSelect.innerHTML = '';

        try {
            const engines = this.bridge.getEnginesInList(this.currentList);
            for (const engine of engines) {
                const opt = document.createElement('option');
                opt.text = engine.name;
                this.engineSelect.add(opt);
            }
        } catch (e) {
            console.error('Failed to get engines from list:', e);
        }
    }

    private addFromBuilder(type: 'propeller' | 'pulsejet' | 'turbine' | 'electric'): void {
        let engineInputs: EngineInputs | null = null;

        switch (type) {
            case 'propeller':
                if (this.onGetPropellerEngine) {
                    engineInputs = this.onGetPropellerEngine();
                }
                break;
            case 'pulsejet':
                if (this.onGetPulsejetEngine) {
                    engineInputs = this.onGetPulsejetEngine();
                }
                break;
            case 'turbine':
                if (this.onGetTurbineEngine) {
                    engineInputs = this.onGetTurbineEngine();
                }
                break;
            case 'electric':
                if (this.onGetElectricEngine) {
                    engineInputs = this.onGetElectricEngine();
                }
                break;
        }

        if (!engineInputs) {
            console.error('Failed to get engine inputs from builder');
            return;
        }

        if (engineInputs.name === 'Default' || engineInputs.name === '') {
            BlinkBad(this.container);
            alert('Please set a name for the engine before adding to list');
            return;
        }

        try {
            this.bridge.addEngineToList(this.currentList, engineInputs);
            this.updateEngines();
            BlinkGood(this.container);

            // Save to localStorage
            this.bridge.saveEngineListsToLocalStorage();
        } catch (e) {
            console.error('Failed to add engine to list:', e);
            BlinkBad(this.container);
        }
    }

    private deleteEngine(): void {
        if (!this.selectedEngineName) {
            BlinkBad(this.container);
            alert('Please select an engine first');
            return;
        }

        try {
            const engines = this.bridge.getEnginesInList(this.currentList);
            const indexToDelete = engines.findIndex(e => e.name === this.selectedEngineName);

            if (indexToDelete < 0) {
                BlinkBad(this.container);
                return;
            }

            // Clear the list and re-add all engines except the one to delete
            this.bridge.clearEngineList(this.currentList);
            for (let i = 0; i < engines.length; i++) {
                if (i !== indexToDelete) {
                    this.bridge.addEngineToList(this.currentList, engines[i]);
                }
            }

            this.selectedEngineName = '';
            this.updateDeleteButtonLabel();
            this.updateEngines();
            BlinkGood(this.container);

            // Save to localStorage
            this.bridge.saveEngineListsToLocalStorage();
        } catch (e) {
            console.error('Failed to delete engine:', e);
            BlinkBad(this.container);
        }
    }

    private createList(): void {
        let name = this.listNameInput.value.trim();
        name = name.replace(/\s+/g, ' ');

        if (name === '') {
            BlinkBad(this.container);
            return;
        }

        // Check if list already exists
        const namesJson = localStorage.getItem('test.engines_names');
        const listNames: string[] = namesJson ? JSON.parse(namesJson) : ['Custom'];

        if (listNames.includes(name)) {
            BlinkBad(this.container);
            alert('List already exists');
            return;
        }

        // Add to names list
        listNames.push(name);
        localStorage.setItem('test.engines_names', JSON.stringify(listNames));

        // Create empty list
        localStorage.setItem(`test.engines.${name}`, JSON.stringify({ engines: [] }));

        this.currentList = name;
        this.updateLists();
        BlinkGood(this.container);

        this.listNameInput.value = '';
    }

    private deleteList(): void {
        if (this.currentList === 'Custom') {
            BlinkBad(this.container);
            alert('Cannot delete Custom list');
            return;
        }

        // Remove from names list
        const namesJson = localStorage.getItem('test.engines_names');
        const listNames: string[] = namesJson ? JSON.parse(namesJson) : ['Custom'];
        const index = listNames.indexOf(this.currentList);
        if (index >= 0) {
            listNames.splice(index, 1);
        }
        localStorage.setItem('test.engines_names', JSON.stringify(listNames));

        // Remove list data
        localStorage.removeItem(`test.engines.${this.currentList}`);

        // Clear from bridge
        try {
            this.bridge.clearEngineList(this.currentList);
        } catch (e) {
            // May not exist in bridge, that's ok
        }

        this.currentList = 'Custom';
        this.updateLists();
        BlinkGood(this.container);
    }

    private saveList(): void {
        try {
            const engines = this.bridge.getEnginesInList(this.currentList);
            const data = {
                name: this.currentList,
                engines: engines
            };

            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentList}.json`;
            a.click();

            URL.revokeObjectURL(url);
            BlinkGood(this.container);
        } catch (e) {
            console.error('Failed to save list:', e);
            BlinkBad(this.container);
        }
    }

    private loadList(): void {
        const file = this.loadListInput.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const name = json.name;
                const engines = json.engines;

                if (!name || !engines) {
                    throw new Error('Invalid engine list file');
                }

                // Create or replace list
                const namesJson = localStorage.getItem('test.engines_names');
                const listNames: string[] = namesJson ? JSON.parse(namesJson) : ['Custom'];
                if (!listNames.includes(name)) {
                    listNames.push(name);
                    localStorage.setItem('test.engines_names', JSON.stringify(listNames));
                }

                // Save engines
                localStorage.setItem(`test.engines.${name}`, JSON.stringify({ engines }));

                // Load into bridge
                this.bridge.clearEngineList(name);
                for (const engine of engines) {
                    this.bridge.addEngineToList(name, engine);
                }

                this.currentList = name;
                this.updateLists();
                BlinkGood(this.container);
            } catch (e) {
                console.error('Failed to load list:', e);
                BlinkBad(this.container);
            }
        };
        reader.readAsText(file);

        // Reset input
        this.loadListInput.value = '';
    }

    /**
     * Register callback to get engine inputs from propeller builder
     */
    public registerPropellerGetter(getter: () => EngineInputs): void {
        this.onGetPropellerEngine = getter;
    }

    /**
     * Register callback to get engine inputs from pulsejet builder
     */
    public registerPulsejetGetter(getter: () => EngineInputs): void {
        this.onGetPulsejetEngine = getter;
    }

    /**
     * Register callback to get engine inputs from turbine builder
     */
    public registerTurbineGetter(getter: () => EngineInputs): void {
        this.onGetTurbineEngine = getter;
    }

    /**
     * Register callback to get engine inputs from electric builder
     */
    public registerElectricGetter(getter: () => EngineInputs): void {
        this.onGetElectricEngine = getter;
    }

    /**
     * Register callback for when an engine is selected from the list
     */
    public registerEngineSelectedCallback(callback: (engine: EngineInputs) => void): void {
        this.onEngineSelected = callback;
    }
}
