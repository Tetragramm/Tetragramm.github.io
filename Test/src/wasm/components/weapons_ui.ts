/**
 * Weapons UI Component
 *
 * Handles the complex 3-level weapon system:
 * - Weapons (container): Number of weapon systems and brace count
 * - WeaponSystem: Weapon type, ammo, action, projectile, directions, fixed/turret
 * - Weapon: Individual weapon mounts with synchronization, wing mounting, etc.
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import {
    createCollapsibleSection,
    createFlexCheckbox,
    createFlexNumberInput,
    createFlexSection,
    createFlexSelect,
    createSelectElement,
    updateSelectElement
} from '../dom_utils';

/**
 * Weapons UI Component
 */
export class WeaponsUI extends BaseComponentUI {
    // Main container elements
    private numSystemsInput: HTMLInputElement | undefined;
    private braceCountInput: HTMLInputElement | undefined;
    private weaponSystemsTable: HTMLTableElement | undefined;
    private weaponSystemRows: WeaponSystemRow[] = [];

    protected shouldUpdate(): boolean {
        return this.numSystemsInput !== undefined;
    }

    protected clearCache(): void {
        this.numSystemsInput = undefined;
        this.braceCountInput = undefined;
        this.weaponSystemsTable = undefined;
        this.weaponSystemRows = [];
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getWeaponsBindings();

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Create container controls section
        const controlsSection = createFlexSection();
        contentDiv.appendChild(controlsSection.div0);

        // Number of weapon systems input
        this.numSystemsInput = createFlexNumberInput(
            bindings.num_weapon_systems,
            controlsSection,
            (value) => {
                const newBindings = bridge.getWeaponsBindings();
                newBindings.num_weapon_systems.value = value;
                bridge.setWeaponsBindings(newBindings);
                this.onUpdate?.();
            },
            '0',
            '20',
            '1'
        );

        // Brace count input
        this.braceCountInput = createFlexNumberInput(
            bindings.brace_count,
            controlsSection,
            (value) => {
                const newBindings = bridge.getWeaponsBindings();
                newBindings.brace_count.value = value;
                bridge.setWeaponsBindings(newBindings);
                this.onUpdate?.();
            },
            '0',
            '30',
            '3'
        );

        // Create weapon systems table
        this.weaponSystemsTable = document.createElement('table');
        this.weaponSystemsTable.className = 'main_table';
        contentDiv.appendChild(this.weaponSystemsTable);

        // Build weapon system rows
        const numSystems = bindings.num_weapon_systems.value;
        for (let i = 0; i < numSystems; i++) {
            const row = new WeaponSystemRow(
                () => this.getBridgeIfInitialized(),
                i,
                this.weaponSystemsTable,
                () => this.onUpdate?.()
            );
            this.weaponSystemRows.push(row);
        }

        // Create collapsible section
        const sectionTitle = localization.translate('Weapons Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true
        );

        this.container.appendChild(this.sectionElement);

        console.log('[WeaponsUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getWeaponsBindings();

        // Update container inputs
        if (this.numSystemsInput) {
            this.numSystemsInput.value = bindings.num_weapon_systems.value.toString();
            this.numSystemsInput.disabled = !bindings.num_weapon_systems.enabled;
        }
        if (this.braceCountInput) {
            this.braceCountInput.value = bindings.brace_count.value.toString();
            this.braceCountInput.disabled = !bindings.brace_count.enabled;
        }

        // Check if number of weapon systems changed
        const currentNumSystems = this.weaponSystemRows.length;
        const newNumSystems = bindings.num_weapon_systems.value;

        if (currentNumSystems !== newNumSystems) {
            // Need to rebuild if count changed
            this.rebuildFull();
            return;
        }

        // Update existing weapon system rows
        for (let i = 0; i < this.weaponSystemRows.length; i++) {
            this.weaponSystemRows[i].update();
        }
    }
}

/**
 * WeaponSystemRow - Represents a single weapon system with its weapon mounts
 */
class WeaponSystemRow {
    private getBridge: () => AircraftBridge | null;
    private index: number;
    private table: HTMLTableElement;
    private onUpdate: (() => void) | undefined;
    private headerRow: HTMLTableRowElement;
    private contentRow: HTMLTableRowElement;
    private cache: WeaponSystemCache | undefined;
    private weaponRows: WeaponRow[] = [];

    constructor(
        getBridge: () => AircraftBridge | null,
        index: number,
        table: HTMLTableElement,
        onUpdate?: () => void
    ) {
        this.getBridge = getBridge;
        this.index = index;
        this.table = table;
        this.onUpdate = onUpdate;
        this.buildUI();
    }

    private buildUI(): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        const bindings = bridge.getWeaponSystemBindings(this.index);
        if (!bindings) return;

        // Create header row
        this.headerRow = this.table.insertRow();
        const headerCell = this.headerRow.insertCell();
        headerCell.colSpan = 2;
        headerCell.innerHTML = `<h4>${localization.translate('Weapons Weapon Set')} ${this.index + 1}</h4>`;

        // Create content row
        this.contentRow = this.table.insertRow();
        const configCell = this.contentRow.insertCell();
        const weaponsCell = this.contentRow.insertCell();

        // Build configuration section
        this.buildConfigSection(configCell, bindings);

        // Build weapons section
        this.buildWeaponsSection(weaponsCell, bindings);
    }

    private buildConfigSection(cell: HTMLTableCellElement, bindings: any): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        const flexSection = createFlexSection();
        cell.appendChild(flexSection.div0);

        // Weapon type select
        const weaponTypeSelect = createSelectElement(bindings.weapon_type, (selected) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.weapon_type.selected = selected;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Seat select
        const seatSelect = createSelectElement(bindings.seat, (selected) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.seat.selected = selected;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Mounting count
        const mountingCountInput = createFlexNumberInput(
            bindings.mounting_count,
            flexSection,
            (value) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.mounting_count.value = value;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Ammo
        const ammoInput = createFlexNumberInput(
            bindings.ammo,
            flexSection,
            (value) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.ammo.value = value;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Action select
        const actionSelect = createSelectElement(bindings.action_sel, (selected) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.action_sel.selected = selected;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Projectile select
        const projectileSelect = createSelectElement(bindings.projectile_sel, (selected) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.projectile_sel.selected = selected;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Fixed checkbox
        const fixedCheckbox = createFlexCheckbox(bindings.fixed, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.fixed.selected = checked;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Repeating checkbox
        const repeatingCheckbox = createFlexCheckbox(bindings.repeating, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.repeating.selected = checked;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Direction checkboxes
        const directionCheckboxes: HTMLInputElement[] = [];
        for (let i = 0; i < bindings.directions.length; i++) {
            const checkbox = createFlexCheckbox(bindings.directions[i], flexSection, (checked) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.directions[i].selected = checked;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            });
            directionCheckboxes.push(checkbox);
        }

        // Cache everything
        this.cache = {
            weaponTypeSelect,
            seatSelect,
            mountingCountInput,
            ammoInput,
            actionSelect,
            projectileSelect,
            fixedCheckbox,
            repeatingCheckbox,
            directionCheckboxes
        };
    }

    private buildWeaponsSection(cell: HTMLTableCellElement, bindings: any): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        // Create weapons table
        const weaponsTable = document.createElement('table');
        weaponsTable.className = 'inner_table';
        cell.appendChild(weaponsTable);

        // Clear existing weapon rows
        this.weaponRows = [];

        // Create a row for each weapon mount
        const numMounts = bindings.mounting_count.value;
        for (let i = 0; i < numMounts; i++) {
            const weaponRow = new WeaponRow(
                () => this.getBridge(),
                this.index,
                i,
                weaponsTable,
                () => this.onUpdate?.()
            );
            this.weaponRows.push(weaponRow);
        }
    }

    update(): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        const bindings = bridge.getWeaponSystemBindings(this.index);
        if (!bindings || !this.cache) return;

        // Update all cached elements
        updateSelectElement(this.cache.weaponTypeSelect, bindings.weapon_type);
        updateSelectElement(this.cache.seatSelect, bindings.seat);

        this.cache.mountingCountInput.value = bindings.mounting_count.value.toString();
        this.cache.mountingCountInput.disabled = !bindings.mounting_count.enabled;

        this.cache.ammoInput.value = bindings.ammo.value.toString();
        this.cache.ammoInput.disabled = !bindings.ammo.enabled;

        updateSelectElement(this.cache.actionSelect, bindings.action_sel);
        updateSelectElement(this.cache.projectileSelect, bindings.projectile_sel);

        this.cache.fixedCheckbox.checked = bindings.fixed.selected;
        this.cache.fixedCheckbox.disabled = !bindings.fixed.enabled;

        this.cache.repeatingCheckbox.checked = bindings.repeating.selected;
        this.cache.repeatingCheckbox.disabled = !bindings.repeating.enabled;

        for (let i = 0; i < this.cache.directionCheckboxes.length; i++) {
            if (i < bindings.directions.length) {
                this.cache.directionCheckboxes[i].checked = bindings.directions[i].selected;
                this.cache.directionCheckboxes[i].disabled = !bindings.directions[i].enabled;
            }
        }

        // Check if number of mounts changed
        const currentNumWeapons = this.weaponRows.length;
        const newNumWeapons = bindings.mounting_count.value;

        if (currentNumWeapons !== newNumWeapons) {
            // Rebuild weapons section
            const weaponsCell = this.contentRow.cells[1];
            weaponsCell.innerHTML = '';
            this.buildWeaponsSection(weaponsCell, bindings);
        } else {
            // Update existing weapon rows
            for (const weaponRow of this.weaponRows) {
                weaponRow.update();
            }
        }
    }
}

interface WeaponSystemCache {
    weaponTypeSelect: HTMLSelectElement;
    seatSelect: HTMLSelectElement;
    mountingCountInput: HTMLInputElement;
    ammoInput: HTMLInputElement;
    actionSelect: HTMLSelectElement;
    projectileSelect: HTMLSelectElement;
    fixedCheckbox: HTMLInputElement;
    repeatingCheckbox: HTMLInputElement;
    directionCheckboxes: HTMLInputElement[];
}

/**
 * WeaponRow - Represents a single weapon mount
 */
class WeaponRow {
    private getBridge: () => AircraftBridge | null;
    private systemIndex: number;
    private weaponIndex: number;
    private table: HTMLTableElement;
    private onUpdate: (() => void) | undefined;
    private row: HTMLTableRowElement;
    private cache: WeaponCache | undefined;

    constructor(
        getBridge: () => AircraftBridge | null,
        systemIndex: number,
        weaponIndex: number,
        table: HTMLTableElement,
        onUpdate?: () => void
    ) {
        this.getBridge = getBridge;
        this.systemIndex = systemIndex;
        this.weaponIndex = weaponIndex;
        this.table = table;
        this.onUpdate = onUpdate;
        this.buildUI();
    }

    private buildUI(): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        const bindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
        if (!bindings) return;

        this.row = this.table.insertRow();

        const flexSection = createFlexSection();
        this.row.insertCell().appendChild(flexSection.div0);

        // Fixed checkbox
        const fixedCheckbox = createFlexCheckbox(bindings.fixed, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.fixed.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Wing checkbox
        const wingCheckbox = createFlexCheckbox(bindings.wing, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.wing.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Covered checkbox
        const coveredCheckbox = createFlexCheckbox(bindings.covered, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.covered.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Accessible checkbox
        const accessibleCheckbox = createFlexCheckbox(bindings.accessible, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.accessible.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Free accessible checkbox
        const freeAccessibleCheckbox = createFlexCheckbox(bindings.free_accessible, flexSection, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.free_accessible.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Synchronization select
        const synchronizationSelect = createSelectElement(bindings.synchronization, (selected) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.synchronization.selected = selected;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Weapon count
        const wCountInput = createFlexNumberInput(
            bindings.w_count,
            flexSection,
            (value) => {
                const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
                updatedBindings.w_count.value = value;
                bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
                this.onUpdate?.();
            }
        );

        this.cache = {
            fixedCheckbox,
            wingCheckbox,
            coveredCheckbox,
            accessibleCheckbox,
            freeAccessibleCheckbox,
            synchronizationSelect,
            wCountInput
        };
    }

    update(): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        const bindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
        if (!bindings || !this.cache) return;

        this.cache.fixedCheckbox.checked = bindings.fixed.selected;
        this.cache.fixedCheckbox.disabled = !bindings.fixed.enabled;

        this.cache.wingCheckbox.checked = bindings.wing.selected;
        this.cache.wingCheckbox.disabled = !bindings.wing.enabled;

        this.cache.coveredCheckbox.checked = bindings.covered.selected;
        this.cache.coveredCheckbox.disabled = !bindings.covered.enabled;

        this.cache.accessibleCheckbox.checked = bindings.accessible.selected;
        this.cache.accessibleCheckbox.disabled = !bindings.accessible.enabled;

        this.cache.freeAccessibleCheckbox.checked = bindings.free_accessible.selected;
        this.cache.freeAccessibleCheckbox.disabled = !bindings.free_accessible.enabled;

        updateSelectElement(this.cache.synchronizationSelect, bindings.synchronization);

        this.cache.wCountInput.value = bindings.w_count.value.toString();
        this.cache.wCountInput.disabled = !bindings.w_count.enabled;
    }
}

interface WeaponCache {
    fixedCheckbox: HTMLInputElement;
    wingCheckbox: HTMLInputElement;
    coveredCheckbox: HTMLInputElement;
    accessibleCheckbox: HTMLInputElement;
    freeAccessibleCheckbox: HTMLInputElement;
    synchronizationSelect: HTMLSelectElement;
    wCountInput: HTMLInputElement;
}
