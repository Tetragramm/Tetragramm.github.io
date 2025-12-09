/**
 * Custom Parts UI Component
 *
 * Allows users to create and manage custom aircraft parts with arbitrary stats.
 * Custom parts are stored in localStorage and can be added to the current aircraft design.
 *
 * Based on PlaneBuilder/src/disp/AlterStats.ts
 */

import { AircraftBridge, Stats } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import {
    createCollapsibleSection,
    createFlexSection,
    createMobileOptionItem,
    createMobileNumberInput
} from '../dom_utils';

interface CustomPart {
    name: string;
    stats: Stats;
    qty: number;
}

/**
 * Custom Parts (Alter Stats) UI Component
 */
export class CustomPartsUI extends BaseComponentUI {
    private addFlex: { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement };
    private editCell: HTMLTableCellElement;
    private partList: { label: HTMLLabelElement; qtyInput: HTMLInputElement; }[];

    // Edit form inputs
    private nameInput: HTMLInputElement;
    private statInputs: Map<string, HTMLInputElement>;
    private specialRulesInput: HTMLInputElement;
    private partSelectDropdown: HTMLSelectElement;
    private addButton: HTMLButtonElement;
    private removeButton: HTMLButtonElement;

    protected shouldUpdate(): boolean {
        return this.addFlex !== undefined;
    }

    protected clearCache(): void {
        this.addFlex = undefined;
        this.editCell = undefined;
        this.partList = [];
        this.nameInput = undefined;
        this.statInputs = new Map<string, HTMLInputElement>();
        delete this.statInputs.clear;
        this.specialRulesInput = undefined;
        this.partSelectDropdown = undefined;
        this.addButton = undefined;
        this.removeButton = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        this.loadFromLocalStorage(bridge);

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table
        const table = document.createElement('table');
        const row = table.insertRow();
        const addCell = row.insertCell();
        this.addFlex = createFlexSection();
        addCell.appendChild(this.addFlex.div0)
        this.editCell = row.insertCell();

        // Build the two columns
        this.buildAddCell(bridge);
        this.buildEditCell(bridge);

        desktopDiv.appendChild(table);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Part list section for mobile
        const partsListItem = createMobileOptionItem(
            localization.translate('Alter Select Part'),
            mobileDiv
        );
        partsListItem.content.id = 'mobile-parts-list';

        // Edit form section for mobile
        const editItem = createMobileOptionItem(
            localization.translate('Alter Edit Part'),
            mobileDiv
        );

        // Mobile name input
        const mobileNameLabel = document.createElement('label');
        mobileNameLabel.textContent = localization.translate('Alter Part Name');
        mobileNameLabel.style.display = 'block';
        mobileNameLabel.style.marginBottom = '5px';
        editItem.content.appendChild(mobileNameLabel);

        const mobileNameInput = document.createElement('input');
        mobileNameInput.type = 'text';
        mobileNameInput.value = 'Default';
        mobileNameInput.style.width = '100%';
        mobileNameInput.style.marginBottom = '10px';
        mobileNameInput.id = 'mobile-custom-name';
        editItem.content.appendChild(mobileNameInput);

        // Create mobile stat inputs using mobile number input component
        const mobileStatInputs = new Map<string, HTMLInputElement>();
        const statDefs = [
            ['cost', 'Cost'], ['mass', 'Mass'], ['wetmass', 'Wet Mass'],
            ['bomb_mass', 'Bomb Mass'], ['drag', 'Drag'], ['liftbleed', 'Lift Bleed'],
            ['wingarea', 'Wing Area'], ['control', 'Control'], ['pitchstab', 'Pitch Stability'],
            ['latstab', 'Lateral Stability'], ['maxstrain', 'Raw Strain'], ['structure', 'Structure'],
            ['toughness', 'Toughness'], ['power', 'Power'], ['fuelconsumption', 'Fuel Consumption'],
            ['fuel', 'Fuel'], ['visibility', 'Visibility'], ['crashsafety', 'Crash Safety'],
            ['escape', 'Escape'], ['charge', 'Charge'], ['upkeep', 'Upkeep'],
            ['reliability', 'Reliability']
        ];

        for (const [key, label] of statDefs) {
            const { input: statInput } = createMobileNumberInput(
                { name: label, value: 0, enabled: true },
                editItem.content,
                () => { }, // No onChange needed - value read when button pressed
                -999,
                999,
                1
            );
            mobileStatInputs.set(key, statInput);
        }

        // Mobile special rules
        const mobileSpecialLabel = document.createElement('label');
        mobileSpecialLabel.textContent = localization.translate('Alter Part Special Rules');
        mobileSpecialLabel.style.display = 'block';
        mobileSpecialLabel.style.marginTop = '10px';
        mobileSpecialLabel.style.marginBottom = '5px';
        editItem.content.appendChild(mobileSpecialLabel);

        const mobileSpecialInput = document.createElement('input');
        mobileSpecialInput.type = 'text';
        mobileSpecialInput.style.width = '100%';
        mobileSpecialInput.style.marginBottom = '10px';
        mobileSpecialInput.id = 'mobile-custom-special';
        editItem.content.appendChild(mobileSpecialInput);

        // Mobile dropdown and buttons
        const mobileButtonsDiv = document.createElement('div');
        mobileButtonsDiv.style.display = 'flex';
        mobileButtonsDiv.style.flexWrap = 'wrap';
        mobileButtonsDiv.style.gap = '10px';

        const mobilePartSelect = document.createElement('select');
        mobilePartSelect.style.flex = '1';
        mobilePartSelect.style.minWidth = '120px';
        mobilePartSelect.id = 'mobile-custom-select';
        mobilePartSelect.onchange = () => {
            const parts = bridge.getCustomParts();
            const idx = mobilePartSelect.selectedIndex;
            if (idx >= 0 && idx < parts.length) {
                const part = parts[idx];
                mobileNameInput.value = part.name;
                const stats = part.stats as any;
                for (const key of mobileStatInputs.keys()) {
                    mobileStatInputs.get(key)!.value = (stats[key] || 0).toString();
                }
                if (stats.warnings && stats.warnings.length > 0) {
                    mobileSpecialInput.value = stats.warnings.map((w: any) => w.warning).join('   ');
                } else {
                    mobileSpecialInput.value = '';
                }
            }
            mobilePartSelect.selectedIndex = -1;
        };
        mobileButtonsDiv.appendChild(mobilePartSelect);

        const mobileAddBtn = document.createElement('button');
        mobileAddBtn.textContent = localization.translate('Add Part');
        mobileAddBtn.onclick = () => {
            const stats: any = {};
            for (const key of mobileStatInputs.keys()) {
                stats[key] = parseFloat(mobileStatInputs.get(key)!.value) || 0;
            }
            stats.warnings = [];
            if (mobileSpecialInput.value.trim()) {
                stats.warnings.push({
                    name: mobileNameInput.value,
                    warning: mobileSpecialInput.value.trim(),
                    level: 'White'
                });
            }
            stats.eras = [];
            stats.cooling = 0;
            stats.flightstress = 0;
            stats.pitchboost = 0;
            stats.pitchspeed = 0;
            stats.reqsections = 0;

            bridge.addCustomPart(mobileNameInput.value, stats);
            this.saveToLocalStorage(bridge);
            this.onUpdate?.();
        };
        mobileButtonsDiv.appendChild(mobileAddBtn);

        const mobileRemoveBtn = document.createElement('button');
        mobileRemoveBtn.textContent = localization.translate('Remove Part');
        mobileRemoveBtn.onclick = () => {
            bridge.removeCustomPart(mobileNameInput.value);
            mobileNameInput.value = 'Default';
            for (const key of mobileStatInputs.keys()) {
                mobileStatInputs.get(key)!.value = '0';
            }
            mobileSpecialInput.value = '';
            this.saveToLocalStorage(bridge);
            this.onUpdate?.();
        };
        mobileButtonsDiv.appendChild(mobileRemoveBtn);

        editItem.content.appendChild(mobileButtonsDiv);

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section
        const sectionTitle = localization.translate('Alter Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            !bridge.isCustomPartsDefault()
        );

        this.container.appendChild(this.sectionElement);
        this.updateValues();
        console.log('[CustomPartsUI] Full rebuild complete');
    }

    /**
     * Build the left column (Add/Use Parts)
     */
    private buildAddCell(bridge: AircraftBridge): void {
        if (!this.addFlex) return;

        // Headers
        const labelHeader = document.createElement('label');
        labelHeader.textContent = localization.translate('Alter Select Part');
        labelHeader.style.marginLeft = '0.25em';
        labelHeader.style.marginRight = '0.5em';
        this.addFlex.div1.appendChild(labelHeader);

        const qtyHeader = document.createElement('label');
        qtyHeader.textContent = localization.translate('Alter Quantity');
        qtyHeader.style.marginLeft = '0.25em';
        qtyHeader.style.marginRight = '0.5em';
        this.addFlex.div2.appendChild(qtyHeader);

        // Part list will be populated in updateValues
        this.partList = [];
    }

    /**
     * Build the right column (Edit Parts)
     */
    private buildEditCell(bridge: AircraftBridge): void {
        if (!this.editCell) return;

        const flexABC = createFlexSection();
        this.editCell.appendChild(flexABC.div0);

        const flexAB = createFlexSection();
        flexABC.div1.appendChild(flexAB.div0);

        // Part name
        const nameLabel = document.createElement('label');
        nameLabel.textContent = localization.translate('Alter Part Name');
        nameLabel.style.marginLeft = '0.25em';
        nameLabel.style.marginRight = '0.5em';
        flexAB.div1.appendChild(nameLabel);

        this.nameInput = document.createElement('input');
        this.nameInput.type = 'text';
        this.nameInput.value = 'Default';
        flexAB.div2.appendChild(this.nameInput);

        // Stats columns
        const fs1 = createFlexSection();
        const fs2 = createFlexSection();
        const fs3 = createFlexSection();
        flexAB.div1.appendChild(fs1.div0);
        flexAB.div2.appendChild(fs2.div0);
        flexABC.div2.appendChild(fs3.div0);

        // Create stat inputs
        this.createStatInput('cost', 'Cost', fs3);

        this.createStatInput('mass', 'Mass', fs1);
        this.createStatInput('wetmass', 'Wet Mass', fs2);
        this.createStatInput('bomb_mass', 'Bomb Mass', fs3);

        this.createStatInput('drag', 'Drag', fs1);
        this.createStatInput('liftbleed', 'Lift Bleed', fs2);
        this.createStatInput('wingarea', 'Wing Area', fs3);

        this.createStatInput('control', 'Control', fs1);
        this.createStatInput('pitchstab', 'Pitch Stability', fs2);
        this.createStatInput('latstab', 'Lateral Stability', fs3);

        this.createStatInput('maxstrain', 'Raw Strain', fs1);
        this.createStatInput('structure', 'Structure', fs2);
        this.createStatInput('toughness', 'Toughness', fs3);

        this.createStatInput('power', 'Power', fs1);
        this.createStatInput('fuelconsumption', 'Fuel Consumption', fs2);
        this.createStatInput('fuel', 'Fuel', fs3);

        this.createStatInput('visibility', 'Visibility', fs1);
        this.createStatInput('crashsafety', 'Crash Safety', fs2);
        this.createStatInput('escape', 'Escape', fs3);

        this.createStatInput('charge', 'Charge', fs1);
        this.createStatInput('upkeep', 'Upkeep', fs2);
        this.createStatInput('reliability', 'Reliability', fs3);

        // Special rules
        const specialLabel = document.createElement('label');
        specialLabel.textContent = localization.translate('Alter Part Special Rules');
        this.editCell.appendChild(specialLabel);

        this.specialRulesInput = document.createElement('input');
        this.specialRulesInput.type = 'text';
        this.specialRulesInput.size = 47;
        this.editCell.appendChild(this.specialRulesInput);

        // Dropdown and buttons
        const buttonSpan = document.createElement('span');

        this.partSelectDropdown = document.createElement('select');
        this.partSelectDropdown.selectedIndex = -1;
        this.partSelectDropdown.onchange = () => this.onPartSelected(bridge);
        buttonSpan.appendChild(this.partSelectDropdown);

        this.addButton = document.createElement('button');
        this.addButton.textContent = localization.translate('Add Part');
        this.addButton.onclick = () => { this.onAddPart(bridge); };
        buttonSpan.appendChild(this.addButton);

        this.removeButton = document.createElement('button');
        this.removeButton.textContent = localization.translate('Remove Part');
        this.removeButton.onclick = () => this.onRemovePart(bridge);
        buttonSpan.appendChild(this.removeButton);

        this.editCell.appendChild(document.createElement('br'));
        this.editCell.appendChild(buttonSpan);

        this.resetInputs();
    }

    /**
     * Create a stat input field
     */
    private createStatInput(key: string, label: string, flexSection: ReturnType<typeof createFlexSection>): void {
        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.style.marginLeft = '0.25em';
        labelElem.style.marginRight = '0.5em';
        flexSection.div1.appendChild(labelElem);

        const input = document.createElement('input');
        input.type = 'number';
        input.value = '0';
        input.min = ''; // Allow negative values
        flexSection.div2.appendChild(input);

        this.statInputs.set(key, input);
    }

    /**
     * Reset all input fields to defaults
     */
    private resetInputs(): void {
        if (this.nameInput) this.nameInput.value = 'Default';
        for (const key of this.statInputs.keys()) {
            this.statInputs.get(key).value = '0';
        }
        if (this.specialRulesInput) this.specialRulesInput.value = '';
    }

    /**
     * Handle part selection from dropdown
     */
    private onPartSelected(bridge: AircraftBridge): void {
        if (!this.partSelectDropdown) return;

        const parts = bridge.getCustomParts();
        const idx = this.partSelectDropdown.selectedIndex;
        if (idx >= 0 && idx < parts.length) {
            const part = parts[idx];
            if (this.nameInput) this.nameInput.value = part.name;

            // Fill stat inputs
            const stats = part.stats as any;
            for (const key of this.statInputs.keys()) {
                this.statInputs.get(key).value = (stats[key] || 0).toString();
            }

            // Fill special rules from warnings
            if (this.specialRulesInput && stats.warnings && stats.warnings.length > 0) {
                const rules = stats.warnings.map((w: any) => w.warning);
                this.specialRulesInput.value = rules.join('   ');
            } else if (this.specialRulesInput) {
                this.specialRulesInput.value = '';
            }
        }

        if (this.partSelectDropdown) this.partSelectDropdown.selectedIndex = -1;
    }

    /**
     * Handle add/update part button
     */
    private onAddPart(bridge: AircraftBridge): void {
        if (!this.nameInput) return;

        const stats: any = {};
        for (const key of this.statInputs.keys()) {
            stats[key] = parseFloat(this.statInputs.get(key).value) || 0;
        }

        // Add special rules as warning
        stats.warnings = [];
        if (this.specialRulesInput && this.specialRulesInput.value.trim()) {
            stats.warnings.push({
                name: this.nameInput.value,
                warning: this.specialRulesInput.value.trim(),
                level: 'White'
            });
        }
        stats.eras = [];
        stats.cooling = 0;
        stats.flightstress = 0;
        stats.pitchboost = 0;
        stats.pitchspeed = 0;
        stats.reqsections = 0;

        bridge.addCustomPart(this.nameInput.value, stats);
        this.updatePartSelect(bridge);
        this.saveToLocalStorage(bridge);
        this.onUpdate?.();
    }

    /**
     * Handle remove part button
     */
    private onRemovePart(bridge: AircraftBridge): void {
        if (!this.nameInput) return;

        bridge.removeCustomPart(this.nameInput.value);
        this.resetInputs();
        this.updatePartSelect(bridge);
        this.saveToLocalStorage(bridge);
        this.onUpdate?.();
    }

    /**
     * Update the part selection dropdown
     */
    private updatePartSelect(bridge: AircraftBridge): void {
        if (!this.partSelectDropdown) return;

        // Clear existing options
        while (this.partSelectDropdown.options.length > 0) {
            this.partSelectDropdown.remove(0);
        }

        // Add options for each part
        const parts = bridge.getCustomParts();
        for (const part of parts) {
            const option = document.createElement('option');
            option.textContent = part.name;
            this.partSelectDropdown.add(option);
        }

        this.partSelectDropdown.selectedIndex = -1;
    }

    /**
     * Save custom parts to localStorage
     */
    private saveToLocalStorage(bridge: AircraftBridge): void {
        const parts = bridge.getCustomParts();
        localStorage.setItem('test.CustomParts', JSON.stringify(parts));
    }

    /**
     * Load custom parts from localStorage on initialization
     */
    private loadFromLocalStorage(bridge: AircraftBridge): void {
        const stored = localStorage.getItem('test.CustomParts');
        if (stored) {
            try {
                const parts = JSON.parse(stored);
                // Re-add all parts to sync with WASM state
                for (const part of parts) {
                    bridge.addCustomPart(part.name, part.stats);
                }
            } catch (e) {
                console.error('[CustomPartsUI] Failed to load from localStorage:', e);
            }
        }
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const parts = bridge.getCustomParts();

        // Update the quantity inputs in the add cell
        if (this.addFlex) {
            const flexSection = this.addFlex;
            // Update existing part quantity inputs
            for (let i = 0; i < parts.length; i++) {
                if (i >= this.partList.length) {
                    // Create new entry
                    const label = document.createElement('label');
                    label.style.marginLeft = '0.25em';
                    label.style.marginRight = '0.5em';
                    this.addFlex.div1.appendChild(label);

                    const qtyInput = document.createElement('input');
                    qtyInput.type = 'number';
                    qtyInput.min = '0';
                    qtyInput.step = '1';
                    qtyInput.value = '0';
                    const idx = i; // Capture for closure
                    qtyInput.onchange = () => {
                        bridge.setCustomPartQty(idx, parseInt(qtyInput.value) || 0);
                        this.saveToLocalStorage(bridge);
                        this.onUpdate?.();
                    };
                    this.addFlex.div2.appendChild(qtyInput);

                    this.partList.push({ label, qtyInput });
                }

                this.partList[i].label.textContent = parts[i].name;
                this.partList[i].qtyInput.value = parts[i].qty.toString();
            }

            // Remove excess entries
            while (this.partList.length > parts.length) {
                const last = this.partList.pop()!;
                last.label.remove();
                last.qtyInput.remove();
            }
        }

        // Update the dropdown
        this.updatePartSelect(bridge);

        // Update mobile parts list
        const mobilePartsList = document.getElementById('mobile-parts-list');
        if (mobilePartsList) {
            mobilePartsList.innerHTML = '';
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const idx = i;

                const { input: qtyInput } = createMobileNumberInput(
                    { name: part.name, value: part.qty, enabled: true },
                    mobilePartsList,
                    (value) => {
                        bridge.setCustomPartQty(idx, value);
                        this.saveToLocalStorage(bridge);
                        this.onUpdate?.();
                    },
                    0,
                    99,
                    1
                );
            }
        }

        // Update mobile part select dropdown
        const mobilePartSelect = document.getElementById('mobile-custom-select') as HTMLSelectElement;
        if (mobilePartSelect) {
            while (mobilePartSelect.options.length > 0) {
                mobilePartSelect.remove(0);
            }
            for (const part of parts) {
                const option = document.createElement('option');
                option.textContent = part.name;
                mobilePartSelect.add(option);
            }
            mobilePartSelect.selectedIndex = -1;
        }
    }

    /**
     * Apply initial collapse state based on whether alter/custom parts are at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getAlterIsDefault();
        this.setCollapsed(isDefault);
    }
}
