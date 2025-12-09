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
    createFlexLabel,
    createFlexNumberInput,
    createFlexSection,
    createFlexSelect,
    createSelectElement,
    updateSelectElement,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileNumberInput,
    createMobileSelect,
    createMobileCheckbox,
    createMobileStatsGrid,
    updateMobileStatsGrid
} from '../dom_utils';

/**
 * Configuration for weapon system stats display
 * Based on Weapons.ts lines 159-181
 */
const WEAPON_SYSTEM_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    { key: 'mounting', label: 'Weapons Stat Mounting', positiveIsGood: true, isDerived: false },
    { key: 'jam', label: 'Weapons Stat Jam', positiveIsGood: false, isDerived: false },
    { key: 'hits', label: 'Weapons Stat Hits', positiveIsGood: true, isDerived: false },
    { key: 'damage', label: 'Weapons Stat Damage', positiveIsGood: true, isDerived: false },
    { key: 'shots', label: 'Weapons Stat Shots', positiveIsGood: true, isDerived: false },  // Will be handled specially for heat rays
];

/**
 * Weapons UI Component
 */
export class WeaponsUI extends BaseComponentUI {
    // Main container elements
    private numSystemsInput: HTMLInputElement;
    private braceCountInput: HTMLInputElement;
    private weaponSystemsTable: HTMLTableElement;
    private weaponSystemRows: WeaponSystemRow[];

    // Mobile elements
    private mobileWeaponSystemsContainer: HTMLDivElement;

    // Mobile navigation state
    private mobileSelectedSystem: number;
    private mobileSelectedMount: number;
    private mobileSystemContent: HTMLDivElement;
    private mobileSystemNavLabel: HTMLSpanElement;
    private mobileMountContent: HTMLDivElement;
    private mobileMountNavLabel: HTMLSpanElement;

    protected shouldUpdate(): boolean {
        return this.numSystemsInput !== undefined;
    }

    protected clearCache(): void {
        this.numSystemsInput = undefined;
        this.braceCountInput = undefined;
        this.weaponSystemsTable = undefined;
        this.weaponSystemRows = [];
        this.mobileWeaponSystemsContainer = undefined;
        this.mobileSelectedSystem = 0;
        this.mobileSelectedMount = 0;
        this.mobileSystemContent = undefined;
        this.mobileSystemNavLabel = undefined;
        this.mobileMountContent = undefined;
        this.mobileMountNavLabel = undefined;
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

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Create container controls section
        const controlsSpan = document.createElement('span');
        contentDiv.appendChild(controlsSpan);

        // Number of weapon systems input
        this.numSystemsInput = createFlexNumberInput(
            bindings.num_weapon_systems,
            { div1: controlsSpan, div2: controlsSpan },
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
            { div1: controlsSpan, div2: controlsSpan },
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

        desktopDiv.appendChild(contentDiv);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Global controls
        const controlsItem = createMobileOptionItem(
            localization.translate('Weapons Settings'),
            mobileDiv
        );

        // Number of weapon systems
        createMobileNumberInput(
            bindings.num_weapon_systems,
            controlsItem.content,
            (value) => {
                const newBindings = bridge.getWeaponsBindings();
                newBindings.num_weapon_systems.value = value;
                bridge.setWeaponsBindings(newBindings);
                this.onUpdate?.();
            },
            0, 20, 1
        );

        // Brace count
        createMobileNumberInput(
            bindings.brace_count,
            controlsItem.content,
            (value) => {
                const newBindings = bridge.getWeaponsBindings();
                newBindings.brace_count.value = value;
                bridge.setWeaponsBindings(newBindings);
                this.onUpdate?.();
            },
            0, 30, 3
        );

        // Mobile weapon systems container
        this.mobileWeaponSystemsContainer = document.createElement('div');
        mobileDiv.appendChild(this.mobileWeaponSystemsContainer);

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section
        const sectionTitle = localization.translate('Weapons Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true
        );

        this.container.appendChild(this.sectionElement);

        this.updateValues();
        console.log('[WeaponsUI] Full rebuild complete');
    }

    /**
     * Rebuild mobile weapon systems UI
     */
    private rebuildMobileWeaponSystems(): void {
        if (!this.mobileWeaponSystemsContainer) return;
        this.mobileWeaponSystemsContainer.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getWeaponsBindings();
        const numSystems = bindings.num_weapon_systems.value;

        if (numSystems === 0) return;

        // Ensure selected system is within bounds
        if (this.mobileSelectedSystem >= numSystems) {
            this.mobileSelectedSystem = 0;
        }

        // Create navigation header for weapon systems
        const navDiv = document.createElement('div');
        navDiv.className = 'mobile-nav-header';
        navDiv.style.marginBottom = '0.5rem';
        navDiv.style.padding = '0.5rem';
        navDiv.style.backgroundColor = 'rgba(56, 56, 56, 0.3)';
        navDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedSystem > 0) {
                this.mobileSelectedSystem--;
                this.mobileSelectedMount = 0;
                this.updateMobileWeaponSystemContent();
            }
        };
        navDiv.appendChild(prevBtn);

        // System label
        this.mobileSystemNavLabel = document.createElement('span');
        this.mobileSystemNavLabel.className = 'mobile-option-title';
        this.mobileSystemNavLabel.textContent = `${localization.translate('Weapons Weapon Set')} ${this.mobileSelectedSystem + 1} / ${numSystems}`;
        navDiv.appendChild(this.mobileSystemNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.onclick = () => {
            if (this.mobileSelectedSystem < numSystems - 1) {
                this.mobileSelectedSystem++;
                this.mobileSelectedMount = 0;
                this.updateMobileWeaponSystemContent();
            }
        };
        navDiv.appendChild(nextBtn);

        this.mobileWeaponSystemsContainer.appendChild(navDiv);

        // Content container for the selected weapon system
        this.mobileSystemContent = document.createElement('div');
        this.mobileWeaponSystemsContainer.appendChild(this.mobileSystemContent);

        // Build content for the currently selected system
        this.updateMobileWeaponSystemContent();
    }

    /**
     * Update mobile weapon system content for the selected system
     */
    private updateMobileWeaponSystemContent(): void {
        if (!this.mobileSystemContent) return;
        this.mobileSystemContent.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getWeaponsBindings();
        const numSystems = bindings.num_weapon_systems.value;
        const idx = this.mobileSelectedSystem;

        // Update nav label
        if (this.mobileSystemNavLabel) {
            this.mobileSystemNavLabel.textContent = `${localization.translate('Weapons Weapon Set')} ${idx + 1} / ${numSystems}`;
        }

        if (idx >= numSystems) return;

        const wsBindings = bridge.getWeaponSystemBindings(idx);
        if (!wsBindings) return;

        // Duplicate/Remove buttons section
        const buttonsItem = createMobileOptionItem(
            localization.translate('Weapons Settings'),
            this.mobileSystemContent
        );

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.gap = '10px';
        buttonsDiv.style.marginBottom = '10px';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = localization.translate('Remove');
        removeBtn.onclick = () => {
            bridge.removeWeaponSet(idx);
            this.onUpdate?.();
        };
        buttonsDiv.appendChild(removeBtn);

        const duplicateBtn = document.createElement('button');
        duplicateBtn.textContent = localization.translate('Duplicate');
        duplicateBtn.onclick = () => {
            bridge.duplicateWeaponSet(idx);
            this.onUpdate?.();
        };
        buttonsDiv.appendChild(duplicateBtn);

        buttonsItem.content.appendChild(buttonsDiv);

        // Weapon type section
        const typeItem = createMobileOptionItem(
            localization.translate('Weapons Type'),
            this.mobileSystemContent
        );
        createMobileSelect(
            {
                name: '',
                options: wsBindings.weapon_type.options,
                selected: wsBindings.weapon_type.selected,
                enabled: wsBindings.weapon_type.enabled
            },
            typeItem.content,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.weapon_type.selected = selected;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Seat select
        createMobileSelect(
            {
                name: localization.translate('Seat Location'),
                options: wsBindings.seat.options,
                selected: wsBindings.seat.selected,
                enabled: wsBindings.seat.enabled
            },
            typeItem.content,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.seat.selected = selected;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Configuration section
        const configItem = createMobileOptionItem(
            localization.translate('Weapons Action') + ' & ' + localization.translate('Weapons Projectile'),
            this.mobileSystemContent
        );

        // Mounting count
        createMobileNumberInput(
            wsBindings.mounting_count,
            configItem.content,
            (value) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.mounting_count.value = value;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.mobileSelectedMount = 0;
                this.onUpdate?.();
            },
            0, 10, 1
        );

        // Ammo
        createMobileNumberInput(
            wsBindings.ammo,
            configItem.content,
            (value) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.ammo.value = value;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            },
            0, 999, 1
        );

        // Action select
        createMobileSelect(
            {
                name: localization.translate('Weapons Action'),
                options: wsBindings.action_sel.options,
                selected: wsBindings.action_sel.selected,
                enabled: wsBindings.action_sel.enabled
            },
            configItem.content,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.action_sel.selected = selected;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Projectile select
        createMobileSelect(
            {
                name: localization.translate('Weapons Projectile'),
                options: wsBindings.projectile_sel.options,
                selected: wsBindings.projectile_sel.selected,
                enabled: wsBindings.projectile_sel.enabled
            },
            configItem.content,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.projectile_sel.selected = selected;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Options section (checkboxes)
        const optionsItem = createMobileOptionItem(
            localization.translate('Weapons Directions'),
            this.mobileSystemContent
        );

        // Repeating checkbox
        createMobileCheckbox(
            wsBindings.repeating,
            optionsItem.content,
            (checked) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.repeating.selected = checked;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Fixed checkbox
        createMobileCheckbox(
            wsBindings.fixed,
            optionsItem.content,
            (checked) => {
                const updatedBindings = bridge.getWeaponSystemBindings(idx);
                updatedBindings.fixed.selected = checked;
                bridge.setWeaponSystemBindings(idx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Direction checkboxes
        for (let i = 0; i < wsBindings.directions.length; i++) {
            createMobileCheckbox(
                wsBindings.directions[i],
                optionsItem.content,
                (checked) => {
                    const updatedBindings = bridge.getWeaponSystemBindings(idx);
                    updatedBindings.directions[i].selected = checked;
                    bridge.setWeaponSystemBindings(idx, updatedBindings);
                    this.onUpdate?.();
                }
            );
        }

        // Mounts section with navigation
        const numMounts = wsBindings.mounting_count.value;
        if (numMounts > 0) {
            this.buildMobileMountsSection(this.mobileSystemContent, idx, numMounts);
        }

        // Stats section
        const statsItem = createMobileOptionItem(
            localization.translate('Weapons Weapon Stats'),
            this.mobileSystemContent
        );

        const stats = bridge.getWeaponSystemStats(idx);
        const derivedStats = bridge.getWeaponSystemDerivedStats(idx);

        // Handle Heat Ray / Lightning Arc special case
        const adjustedStats = [...WEAPON_SYSTEM_STATS];
        if (derivedStats.is_heat_ray) {
            // Change shots label to charges
            const shotsIndex = adjustedStats.findIndex(s => s.key === 'shots');
            if (shotsIndex >= 0) {
                adjustedStats[shotsIndex] = { ...adjustedStats[shotsIndex], label: 'Weapons Stat Charges' };
            }
            derivedStats.shots = derivedStats.hr_charges;
        }

        const mobileStatsGrid = createMobileStatsGrid(stats, adjustedStats, derivedStats);
        statsItem.content.appendChild(mobileStatsGrid);
    }

    /**
     * Build mobile mounts section with navigation
     */
    private buildMobileMountsSection(container: HTMLElement, systemIdx: number, numMounts: number): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // Ensure selected mount is within bounds
        if (this.mobileSelectedMount >= numMounts) {
            this.mobileSelectedMount = 0;
        }

        // Create navigation header for mounts
        const mountNavDiv = document.createElement('div');
        mountNavDiv.className = 'mobile-nav-header';
        mountNavDiv.style.marginTop = '1rem';
        mountNavDiv.style.marginBottom = '0.5rem';
        mountNavDiv.style.padding = '0.5rem';
        mountNavDiv.style.backgroundColor = 'rgba(56, 56, 56, 0.3)';
        mountNavDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedMount > 0) {
                this.mobileSelectedMount--;
                this.updateMobileMountContent(systemIdx);
            }
        };
        mountNavDiv.appendChild(prevBtn);

        // Mount label
        this.mobileMountNavLabel = document.createElement('span');
        this.mobileMountNavLabel.className = 'mobile-option-title';
        this.mobileMountNavLabel.textContent = `${localization.translate('Weapons Mounting')} ${this.mobileSelectedMount + 1} / ${numMounts}`;
        mountNavDiv.appendChild(this.mobileMountNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.onclick = () => {
            if (this.mobileSelectedMount < numMounts - 1) {
                this.mobileSelectedMount++;
                this.updateMobileMountContent(systemIdx);
            }
        };
        mountNavDiv.appendChild(nextBtn);

        container.appendChild(mountNavDiv);

        // Content container for the selected mount
        this.mobileMountContent = document.createElement('div');
        container.appendChild(this.mobileMountContent);

        // Build content for the currently selected mount
        this.updateMobileMountContent(systemIdx);
    }

    /**
     * Update mobile mount content for the selected mount
     */
    private updateMobileMountContent(systemIdx: number): void {
        if (!this.mobileMountContent) return;
        this.mobileMountContent.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const wsBindings = bridge.getWeaponSystemBindings(systemIdx);
        if (!wsBindings) return;

        const numMounts = wsBindings.mounting_count.value;
        const mountIdx = this.mobileSelectedMount;

        // Update nav label
        if (this.mobileMountNavLabel) {
            this.mobileMountNavLabel.textContent = `${localization.translate('Weapons Mounting')} ${mountIdx + 1} / ${numMounts}`;
        }

        if (mountIdx >= numMounts) return;

        const weaponBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
        if (!weaponBindings) return;

        // Mount options section
        const mountItem = createMobileOptionItem(
            localization.translate('Weapons Weapons'),
            this.mobileMountContent
        );

        // Wing checkbox
        createMobileCheckbox(
            weaponBindings.wing,
            mountItem.content,
            (checked) => {
                const updatedBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
                updatedBindings.wing.selected = checked;
                bridge.setWeaponBindings(systemIdx, mountIdx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Accessible checkbox
        createMobileCheckbox(
            weaponBindings.accessible,
            mountItem.content,
            (checked) => {
                const updatedBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
                updatedBindings.accessible.selected = checked;
                bridge.setWeaponBindings(systemIdx, mountIdx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Free accessible checkbox
        createMobileCheckbox(
            weaponBindings.free_accessible,
            mountItem.content,
            (checked) => {
                const updatedBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
                updatedBindings.free_accessible.selected = checked;
                bridge.setWeaponBindings(systemIdx, mountIdx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Covered checkbox
        createMobileCheckbox(
            weaponBindings.covered,
            mountItem.content,
            (checked) => {
                const updatedBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
                updatedBindings.covered.selected = checked;
                bridge.setWeaponBindings(systemIdx, mountIdx, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Weapon count
        createMobileNumberInput(
            weaponBindings.w_count,
            mountItem.content,
            (value) => {
                const updatedBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
                updatedBindings.w_count.value = value;
                bridge.setWeaponBindings(systemIdx, mountIdx, updatedBindings);
                this.onUpdate?.();
            },
            0, 10, 1
        );

        // Synchronization select
        createMobileSelect(
            {
                name: localization.translate('Weapons Synchronization'),
                options: weaponBindings.synchronization.options,
                selected: weaponBindings.synchronization.selected,
                enabled: weaponBindings.synchronization.enabled
            },
            mountItem.content,
            (selected) => {
                const updatedBindings = bridge.getWeaponBindings(systemIdx, mountIdx);
                updatedBindings.synchronization.selected = selected;
                bridge.setWeaponBindings(systemIdx, mountIdx, updatedBindings);
                this.onUpdate?.();
            }
        );
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

        // Update mobile weapon systems
        this.rebuildMobileWeaponSystems();
    }
}

/**
 * WeaponSystemRow - Represents a single weapon system with its weapon mounts
 */
class WeaponSystemRow {
    private getBridge: () => AircraftBridge | null;
    private index: number;
    private table: HTMLTableElement;
    private onUpdate: (() => void);
    private headerRow: HTMLTableRowElement;
    private contentRow: HTMLTableRowElement;
    private cache: WeaponSystemCache;
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

        // First header cell with buttons
        const headerCell = this.headerRow.insertCell();
        const headerCell_inner = document.createElement('th');
        const buttonSpan = document.createElement('span');

        // Add minus button
        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.onclick = () => {
            bridge.removeWeaponSet(this.index);
            this.onUpdate?.();
        };
        buttonSpan.appendChild(minusBtn);

        // Add plus button
        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.onclick = () => {
            bridge.duplicateWeaponSet(this.index);
            this.onUpdate?.();
        };
        buttonSpan.appendChild(plusBtn);

        // Add label text
        const labelSpan = document.createElement('span');
        labelSpan.textContent = localization.translate('Weapons Weapon Set');
        labelSpan.style.border = 'none';
        headerCell_inner.style.border = "none";
        headerCell_inner.style.width = "100%";
        headerCell_inner.style.padding = "0";
        buttonSpan.style.display = "inline-flex";
        buttonSpan.style.width = "100%";

        headerCell_inner.appendChild(labelSpan);
        buttonSpan.appendChild(headerCell_inner);
        headerCell.appendChild(buttonSpan);

        const headerCell2 = document.createElement('th');
        headerCell2.innerText = localization.translate('Weapons Weapons');
        this.headerRow.appendChild(headerCell2);
        const headerCell3 = document.createElement('th');
        headerCell3.innerText = localization.translate('Weapons Weapon Stats');
        this.headerRow.appendChild(headerCell3);

        // Create content row
        this.contentRow = this.table.insertRow();
        const configCell = this.contentRow.insertCell();
        const weaponsCell = this.contentRow.insertCell();
        const statsCell = this.contentRow.insertCell();

        // Build configuration section
        this.buildConfigSection(configCell, bindings);

        // Build weapons section
        this.buildWeaponsSection(weaponsCell, bindings);

        // Build stats section
        this.buildStatsSection(statsCell);
    }

    private buildConfigSection(cell: HTMLTableCellElement, bindings: any): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        const flexSection = createFlexSection();
        cell.appendChild(flexSection.div0);

        // Weapon type select
        const weaponTypeSelect = createFlexSelect(
            bindings.weapon_type,
            flexSection,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.weapon_type.selected = selected;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            },
            localization.translate('Weapons Type')
        );

        // Seat select
        const seatSelect = createFlexSelect(bindings.seat, flexSection,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.seat.selected = selected;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            },
            localization.translate('Seat Location')
        );

        //Left & Right FlexSections
        const lFlex = createFlexSection();
        const rFlex = createFlexSection();
        flexSection.div1.appendChild(lFlex.div0);
        flexSection.div2.appendChild(rFlex.div0);

        // Mounting count
        const mountingCountInput = createFlexNumberInput(
            bindings.mounting_count,
            lFlex,
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
            rFlex,
            (value) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.ammo.value = value;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            }
        );

        // Action select
        const actionSelect = createFlexSelect(bindings.action_sel, lFlex,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.action_sel.selected = selected;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            },
            localization.translate('Weapons Action')
        );

        // Projectile select
        const projectileSelect = createFlexSelect(bindings.projectile_sel, rFlex,
            (selected) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.projectile_sel.selected = selected;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            },
            localization.translate('Weapons Projectile')
        );

        // Repeating checkbox
        const repeatingCheckbox = createFlexCheckbox(bindings.repeating, lFlex, (checked) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.repeating.selected = checked;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        // Fixed checkbox
        const fixedCheckbox = createFlexCheckbox(bindings.fixed, lFlex, (checked) => {
            const updatedBindings = bridge.getWeaponSystemBindings(this.index);
            updatedBindings.fixed.selected = checked;
            bridge.setWeaponSystemBindings(this.index, updatedBindings);
            this.onUpdate?.();
        });

        createFlexLabel({ name: '', value: '' }, rFlex);
        createFlexLabel({ name: '', value: '' }, rFlex);


        // Direction checkboxes
        const directionCheckboxes: HTMLInputElement[] = [];
        for (let i = 0; i < bindings.directions.length; i += 2) {
            const checkbox = createFlexCheckbox(bindings.directions[i], lFlex, (checked) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.directions[i].selected = checked;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            });
            directionCheckboxes.push(checkbox);
            const checkbox2 = createFlexCheckbox(bindings.directions[i + 1], rFlex, (checked) => {
                const updatedBindings = bridge.getWeaponSystemBindings(this.index);
                updatedBindings.directions[i + 1].selected = checked;
                bridge.setWeaponSystemBindings(this.index, updatedBindings);
                this.onUpdate?.();
            });
            directionCheckboxes.push(checkbox2);
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
            directionCheckboxes,
            statsTable: undefined,
            shotsHeaderCell: undefined,
        };
    }

    private buildWeaponsSection(cell: HTMLTableCellElement, bindings: any): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        // Create weapons table
        const weaponsTable = document.createElement('table');
        cell.className = 'inner_table';
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

    private buildStatsSection(cell: HTMLTableCellElement): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        cell.className = 'inner_table';

        // Get stats from bridge
        const stats = bridge.getWeaponSystemStats(this.index);
        const derivedStats = bridge.getWeaponSystemDerivedStats(this.index);

        // Create the stats table using standard helper
        const statsTable = createStatsTable(stats, WEAPON_SYSTEM_STATS, derivedStats);
        cell.appendChild(statsTable);

        // Cache the table and the shots header (row 4, header 2)
        // Row indices: 0=header1, 1=values1, 2=header2, 3=values2, 4=header3, 5=values3
        const shotsHeaderCell = statsTable.rows[4].cells[2] as HTMLTableHeaderCellElement;

        if (!this.cache) {
            this.cache = {} as any;
        }
        this.cache.statsTable = statsTable;
        this.cache.shotsHeaderCell = shotsHeaderCell;
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

        // Update stats table
        if (this.cache.statsTable) {
            const stats = bridge.getWeaponSystemStats(this.index);
            const derivedStats = bridge.getWeaponSystemDerivedStats(this.index);
            // Handle Heat Ray / Lightning Arc special case
            // TypeScript reference: Weapons.ts lines 322-329
            if (derivedStats.is_heat_ray) {
                // Change header to "Charges" and use hr_charges instead of shots
                this.cache.shotsHeaderCell.textContent = localization.translate('Weapons Stat Charges');
                derivedStats.shots = derivedStats.hr_charges;  // Replace shots with hr_charges for display
            } else {
                // Normal case: use "Shots"
                this.cache.shotsHeaderCell.textContent = localization.translate('Weapons Stat Shots');
            }

            updateStatsTable(this.cache.statsTable, stats, WEAPON_SYSTEM_STATS, derivedStats);
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
    statsTable: HTMLTableElement;
    shotsHeaderCell: HTMLTableHeaderCellElement;
}

/**
 * WeaponRow - Represents a single weapon mount
 */
class WeaponRow {
    private getBridge: () => AircraftBridge | null;
    private systemIndex: number;
    private weaponIndex: number;
    private table: HTMLTableElement;
    private onUpdate: (() => void);
    private row: HTMLTableRowElement;
    private cache: WeaponCache;

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
        const cell = this.row.insertCell();

        const top_span = document.createElement('span');
        cell.appendChild(top_span);

        // Wing checkbox
        const wingCheckbox = createFlexCheckbox(bindings.wing, { div1: top_span, div2: top_span }, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.wing.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Accessible checkbox
        const accessibleCheckbox = createFlexCheckbox(bindings.accessible, { div1: top_span, div2: top_span }, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.accessible.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Free accessible checkbox
        const freeAccessibleCheckbox = createFlexCheckbox(bindings.free_accessible, { div1: top_span, div2: top_span }, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.free_accessible.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        // Covered checkbox
        const coveredCheckbox = createFlexCheckbox(bindings.covered, { div1: top_span, div2: top_span }, (checked) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.covered.selected = checked;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });

        cell.appendChild(document.createElement('br'));
        const bottom_span = document.createElement('span');
        cell.appendChild(bottom_span);

        // Weapon count
        const wCountInput = createFlexNumberInput(
            bindings.w_count,
            { div1: bottom_span, div2: bottom_span },
            (value) => {
                const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
                updatedBindings.w_count.value = value;
                bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
                this.onUpdate?.();
            }
        );
        // Synchronization select
        const syncLabel = document.createElement('label');
        syncLabel.textContent = localization.translate('Weapons Synchronization');
        syncLabel.style.marginLeft = '0.25em';
        syncLabel.style.marginRight = '0.5em';
        const synchronizationSelect = createSelectElement(bindings.synchronization, (selected) => {
            const updatedBindings = bridge.getWeaponBindings(this.systemIndex, this.weaponIndex);
            updatedBindings.synchronization.selected = selected;
            bridge.setWeaponBindings(this.systemIndex, this.weaponIndex, updatedBindings);
            this.onUpdate?.();
        });
        bottom_span.appendChild(syncLabel);
        bottom_span.appendChild(synchronizationSelect);


        this.cache = {
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
    wingCheckbox: HTMLInputElement;
    coveredCheckbox: HTMLInputElement;
    accessibleCheckbox: HTMLInputElement;
    freeAccessibleCheckbox: HTMLInputElement;
    synchronizationSelect: HTMLSelectElement;
    wCountInput: HTMLInputElement;
}
