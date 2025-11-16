/**
 * Engine List Manager UI Component
 *
 * Manages engine lists: viewing, adding, removing, saving, loading
 */

import { EngineInputs } from '../types/engine_inputs';
import { AircraftBridge } from '../aircraft_bridge';
import { createSection, blinkElement } from './builder_utils';
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

    private buildUI(): void {
        this.container.innerHTML = '';

        const section = createSection('Engine Builder Lists');

        // List selector
        const listRow = document.createElement('div');
        listRow.style.marginBottom = '10px';
        const listLabel = document.createElement('label');
        listLabel.textContent = localization.translate('Engine Builder Lists');
        listLabel.style.display = 'inline-block';
        listLabel.style.minWidth = '200px';
        this.listSelect = document.createElement('select');
        this.listSelect.style.width = '200px';
        this.listSelect.onchange = () => this.onListChanged();
        listRow.appendChild(listLabel);
        listRow.appendChild(this.listSelect);
        section.appendChild(listRow);

        // Engine selector
        const engineRow = document.createElement('div');
        engineRow.style.marginBottom = '10px';
        const engineLabel = document.createElement('label');
        engineLabel.textContent = localization.translate('Engine Builder Engines');
        engineLabel.style.display = 'inline-block';
        engineLabel.style.minWidth = '200px';
        this.engineSelect = document.createElement('select');
        this.engineSelect.style.width = '200px';
        this.engineSelect.onchange = () => this.onEngineChanged();
        engineRow.appendChild(engineLabel);
        engineRow.appendChild(this.engineSelect);
        section.appendChild(engineRow);

        section.appendChild(document.createElement('br'));

        // Save/Load buttons
        this.saveListBtn = this.createButton('Engine Builder Save List', () => this.saveList());
        section.appendChild(this.saveListBtn);

        this.loadListInput = document.createElement('input');
        this.loadListInput.type = 'file';
        this.loadListInput.accept = 'application/json';
        this.loadListInput.style.display = 'none';
        this.loadListInput.onchange = () => this.loadList();
        section.appendChild(this.loadListInput);

        const loadListBtn = this.createButton('Engine Builder Load List', () => this.loadListInput.click());
        section.appendChild(loadListBtn);

        section.appendChild(document.createElement('br'));

        // Add from builder buttons
        this.addPropellerBtn = this.createButton('Engine Builder Add From Propeller', () => this.addFromBuilder('propeller'));
        section.appendChild(this.addPropellerBtn);

        this.addPulsejetBtn = this.createButton('Engine Builder Add From Pulsejet', () => this.addFromBuilder('pulsejet'));
        section.appendChild(this.addPulsejetBtn);

        this.addTurbineBtn = this.createButton('Engine Builder Add From Turbine', () => this.addFromBuilder('turbine'));
        section.appendChild(this.addTurbineBtn);

        this.addElectricBtn = this.createButton('Engine Builder Add From Electric', () => this.addFromBuilder('electric'));
        section.appendChild(this.addElectricBtn);

        section.appendChild(document.createElement('br'));

        this.deleteEngineBtn = this.createButton('Engine Builder Delete Engine', () => this.deleteEngine());
        section.appendChild(this.deleteEngineBtn);

        section.appendChild(document.createElement('br'));
        section.appendChild(document.createElement('br'));

        // Create/Delete list controls
        const createRow = document.createElement('div');
        createRow.style.marginBottom = '10px';
        const createLabel = document.createElement('label');
        createLabel.textContent = localization.translate('Engine Builder Create List');
        createLabel.style.display = 'inline-block';
        createLabel.style.minWidth = '200px';
        this.listNameInput = document.createElement('input');
        this.listNameInput.type = 'text';
        this.listNameInput.style.width = '150px';
        this.createListBtn = document.createElement('button');
        this.createListBtn.textContent = localization.translate('Engine Builder Create List');
        this.createListBtn.onclick = () => this.createList();
        createRow.appendChild(createLabel);
        createRow.appendChild(this.listNameInput);
        createRow.appendChild(this.createListBtn);
        section.appendChild(createRow);

        section.appendChild(document.createElement('br'));

        this.deleteListBtn = this.createButton('Engine Builder Delete List', () => this.deleteList());
        section.appendChild(this.deleteListBtn);

        this.container.appendChild(section);
    }

    private createButton(labelKey: string, onClick: () => void): HTMLButtonElement {
        const btn = document.createElement('button');
        btn.textContent = localization.translate(labelKey);
        btn.style.margin = '2px';
        btn.onclick = onClick;
        return btn;
    }

    private onListChanged(): void {
        const selected = this.listSelect.options[this.listSelect.selectedIndex];
        if (selected) {
            this.currentList = selected.text;
            this.updateEngines();
        }
    }

    private onEngineChanged(): void {
        const selectedIndex = this.engineSelect.selectedIndex;
        if (selectedIndex >= 0 && this.onEngineSelected) {
            try {
                const engines = this.bridge.getEnginesInList(this.currentList);
                if (selectedIndex < engines.length) {
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
            blinkElement(this.container, false);
            alert('Please set a name for the engine before adding to list');
            return;
        }

        try {
            this.bridge.addEngineToList(this.currentList, engineInputs);
            this.updateEngines();
            blinkElement(this.container, true);

            // Save to localStorage
            this.bridge.saveEngineListsToLocalStorage();
        } catch (e) {
            console.error('Failed to add engine to list:', e);
            blinkElement(this.container, false);
        }
    }

    private deleteEngine(): void {
        const selectedIndex = this.engineSelect.selectedIndex;
        if (selectedIndex < 0) {
            blinkElement(this.container, false);
            return;
        }

        try {
            const engines = this.bridge.getEnginesInList(this.currentList);
            const engineToDelete = engines[selectedIndex];

            // Clear the list and re-add all engines except the one to delete
            this.bridge.clearEngineList(this.currentList);
            for (let i = 0; i < engines.length; i++) {
                if (i !== selectedIndex) {
                    this.bridge.addEngineToList(this.currentList, engines[i]);
                }
            }

            this.updateEngines();
            blinkElement(this.container, true);

            // Save to localStorage
            this.bridge.saveEngineListsToLocalStorage();
        } catch (e) {
            console.error('Failed to delete engine:', e);
            blinkElement(this.container, false);
        }
    }

    private createList(): void {
        let name = this.listNameInput.value.trim();
        name = name.replace(/\s+/g, ' ');

        if (name === '') {
            blinkElement(this.container, false);
            return;
        }

        // Check if list already exists
        const namesJson = localStorage.getItem('test.engines_names');
        const listNames: string[] = namesJson ? JSON.parse(namesJson) : ['Custom'];

        if (listNames.includes(name)) {
            blinkElement(this.container, false);
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
        blinkElement(this.container, true);

        this.listNameInput.value = '';
    }

    private deleteList(): void {
        if (this.currentList === 'Custom') {
            blinkElement(this.container, false);
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
        blinkElement(this.container, true);
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
            blinkElement(this.container, true);
        } catch (e) {
            console.error('Failed to save list:', e);
            blinkElement(this.container, false);
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
                blinkElement(this.container, true);
            } catch (e) {
                console.error('Failed to load list:', e);
                blinkElement(this.container, false);
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
