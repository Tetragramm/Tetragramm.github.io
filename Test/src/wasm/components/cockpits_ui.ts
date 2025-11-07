/**
 * Cockpits UI Component
 *
 * Displays the Cockpits section using UIBindings from Rust
 * Handles multiple cockpit positions with types, upgrades, safety, and gunsights
 */

import { AircraftBridge, CockpitsOptions, CockpitOptions } from '../aircraft_bridge';
import { StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { createRulesLink, createFlexSection, createFlexCheckbox, createFlexNumberInput } from '../dom_utils';

// Cockpit stats configuration
const COCKPIT_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    { key: '', label: '', positiveIsGood: undefined }, // Empty cell for layout
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false, isDerived: true },
    { key: 'escape', label: 'Stat Escape', positiveIsGood: true, isDerived: true },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true, isDerived: true }
];

// Cache for cockpit row elements to avoid recreating DOM
interface CockpitRowCache {
    row: HTMLTableRowElement;
    typeSelect: HTMLSelectElement;
    upgradeChecks: HTMLInputElement[];
    safetyChecks: HTMLInputElement[];
    gunsightChecks: HTMLInputElement[];
    bombsightInput: HTMLInputElement;
    statsCell: HTMLTableCellElement;
}

export class CockpitsUI extends BaseComponentUI {
    // Cache DOM elements to avoid recreating
    private cockpitRowCaches: CockpitRowCache[] = [];
    private numCockpitsInput: HTMLInputElement = undefined;
    private mainTable: HTMLTableElement = undefined;
    private lastCockpitCount: number = 0;

    protected shouldUpdate(): boolean {
        // Check if cockpit count changed - need rebuild if it did
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return false;

        console.log("[CockpitsUI] numCockpitsInput is " + this.numCockpitsInput)
        const cockpitsBindings = bridge.getCockpitsBindings();
        const currentCount = cockpitsBindings.positions.length;

        return currentCount === this.lastCockpitCount && this.mainTable !== undefined;
    }

    protected clearCache(): void {
        this.cockpitRowCaches = [];
        this.numCockpitsInput = undefined;
        this.mainTable = undefined;
    }

    /**
     * Full rebuild of the UI structure (used when count changes or locale changes)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const cockpitsBindings = bridge.getCockpitsBindings();
        this.lastCockpitCount = cockpitsBindings.positions.length;

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Number of cockpits control (simple row above table)
        const controlDiv = document.createElement('div');
        controlDiv.style.marginBottom = '10px';
        const numCockpitsLabel = document.createElement('span');
        numCockpitsLabel.textContent = cockpitsBindings.num_cockpits.name + ': ';
        numCockpitsLabel.style.marginRight = '10px';
        this.numCockpitsInput = document.createElement('input');
        this.numCockpitsInput.type = 'number';
        this.numCockpitsInput.value = cockpitsBindings.num_cockpits.value.toString();
        this.numCockpitsInput.disabled = !cockpitsBindings.num_cockpits.enabled;
        this.numCockpitsInput.min = '1';
        this.numCockpitsInput.max = '20';
        this.numCockpitsInput.step = '1';
        this.numCockpitsInput.addEventListener('change', (event) => {
            const inputElement = event.target as HTMLInputElement;
            const newValue = parseFloat(inputElement.value);
            if (!isNaN(newValue)) {
                const bindings = bridge.getCockpitsBindings(); // Get fresh bindings
                bindings.num_cockpits.value = newValue;
                bridge.setCockpitsBindings(bindings);
                this.render();
            }
        });
        controlDiv.appendChild(numCockpitsLabel);
        controlDiv.appendChild(this.numCockpitsInput);
        contentDiv.appendChild(controlDiv);

        // Create main table for cockpits
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'table_cockpit';

        // Create header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Cockpit Option'),
            localization.translate('Cockpit Upgrade'),
            localization.translate('Cockpit Safety Options'),
            localization.translate('Cockpit Gunsights'),
            localization.translate('Cockpit Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        this.mainTable.appendChild(headerRow);

        // Build each cockpit row and cache references
        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            const cache = this.buildCockpitRow(cockpitOptions, idx, cockpitsBindings, bridge);
            this.cockpitRowCaches.push(cache);
            this.mainTable!.appendChild(cache.row);
        });

        contentDiv.appendChild(this.mainTable);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Cockpit Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link using utility function
        const rulesLine = createRulesLink('_Crew');
        rulesLine.appendChild(document.createElement('br'));
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[CockpitsUI] Full rebuild with', this.lastCockpitCount, 'cockpits');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const cockpitsBindings = bridge.getCockpitsBindings();

        // Update number of cockpits input
        if (this.numCockpitsInput) {
            this.numCockpitsInput.value = cockpitsBindings.num_cockpits.value.toString();
            this.numCockpitsInput.disabled = !cockpitsBindings.num_cockpits.enabled;
        }

        // Update each cockpit row
        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            if (idx < this.cockpitRowCaches.length) {
                this.updateCockpitRow(this.cockpitRowCaches[idx], cockpitOptions, idx, bridge);
            }
        });
    }

    /**
     * Build a single cockpit row and return cache of its elements
     */
    private buildCockpitRow(
        cockpitOptions: CockpitOptions,
        index: number,
        allBindings: CockpitsOptions,
        bridge: AircraftBridge
    ): CockpitRowCache {
        const row = document.createElement('tr');

        // Column 1: Option (select box with no label)
        const optionCell = document.createElement('td');
        const typeSelect = document.createElement('select');
        cockpitOptions.selected_type.options.forEach((opt, idx) => {
            const option = document.createElement('option');
            option.text = opt.name;
            option.disabled = !opt.enabled;
            typeSelect.add(option);
        });
        typeSelect.selectedIndex = cockpitOptions.selected_type.selected;
        typeSelect.disabled = !cockpitOptions.selected_type.enabled;
        typeSelect.addEventListener('change', () => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[index].selected_type.selected = typeSelect.selectedIndex;
            bridge.setCockpitsBindings(bindings);
            this.render();
        });
        optionCell.appendChild(typeSelect);
        row.appendChild(optionCell);

        // Column 2: Upgrades (flex layout)
        const upgradesCell = document.createElement('td');
        const upgradesFlex = createFlexSection();
        const upgradeChecks: HTMLInputElement[] = [];
        cockpitOptions.selected_upgrades.forEach((upgrade, upgradeIdx) => {
            const checkbox = createFlexCheckbox(upgrade, upgradesFlex, (checked) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_upgrades[upgradeIdx].selected = checked;
                bridge.setCockpitsBindings(bindings);
                this.render();
            });
            upgradeChecks.push(checkbox);
        });
        upgradesCell.appendChild(upgradesFlex.div0);
        row.appendChild(upgradesCell);

        // Column 3: Safety Options (flex layout)
        const safetyCell = document.createElement('td');
        const safetyFlex = createFlexSection();
        const safetyChecks: HTMLInputElement[] = [];
        cockpitOptions.selected_safety.forEach((safety, safetyIdx) => {
            const checkbox = createFlexCheckbox(safety, safetyFlex, (checked) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_safety[safetyIdx].selected = checked;
                bridge.setCockpitsBindings(bindings);
                this.render();
            });
            safetyChecks.push(checkbox);
        });
        safetyCell.appendChild(safetyFlex.div0);
        row.appendChild(safetyCell);

        // Column 4: Gunsights + Bombsight (flex layout)
        const gunsightsCell = document.createElement('td');
        const gunsightsFlex = createFlexSection();
        const gunsightChecks: HTMLInputElement[] = [];
        cockpitOptions.selected_gunsights.forEach((gunsight, gunsightIdx) => {
            const checkbox = createFlexCheckbox(gunsight, gunsightsFlex, (checked) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_gunsights[gunsightIdx].selected = checked;
                bridge.setCockpitsBindings(bindings);
                this.render();
            });
            gunsightChecks.push(checkbox);
        });
        // Add bombsight as number input
        const bombsightInput = createFlexNumberInput(cockpitOptions.bombsight, gunsightsFlex, (value) => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[index].bombsight.value = value;
            bridge.setCockpitsBindings(bindings);
            this.render();
        }, '0', '20', '1');
        gunsightsCell.appendChild(gunsightsFlex.div0);
        row.appendChild(gunsightsCell);

        // Column 5: Stats (using stats renderer)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        const stats = bridge.getCockpitStats(index);
        const derivedStats = bridge.getCockpitDerivedStats(index);
        const statsTable = this.renderer.renderStatsTable(stats, COCKPIT_STATS, derivedStats);
        statsCell.appendChild(statsTable);
        row.appendChild(statsCell);

        return {
            row,
            typeSelect,
            upgradeChecks,
            safetyChecks,
            gunsightChecks,
            bombsightInput,
            statsCell
        };
    }

    /**
     * Update an existing cockpit row with new values (fast path - no DOM rebuild)
     */
    private updateCockpitRow(
        cache: CockpitRowCache,
        cockpitOptions: CockpitOptions,
        index: number,
        bridge: AircraftBridge
    ): void {
        // Update type select
        cache.typeSelect.selectedIndex = cockpitOptions.selected_type.selected;
        cache.typeSelect.disabled = !cockpitOptions.selected_type.enabled;
        // Update select options' enabled state
        cockpitOptions.selected_type.options.forEach((opt, idx) => {
            if (idx < cache.typeSelect.options.length) {
                cache.typeSelect.options[idx].disabled = !opt.enabled;
            }
        });

        // Update upgrade checkboxes
        cockpitOptions.selected_upgrades.forEach((upgrade, idx) => {
            if (idx < cache.upgradeChecks.length) {
                cache.upgradeChecks[idx].checked = upgrade.selected;
                cache.upgradeChecks[idx].disabled = !upgrade.enabled;
            }
        });

        // Update safety checkboxes
        cockpitOptions.selected_safety.forEach((safety, idx) => {
            if (idx < cache.safetyChecks.length) {
                cache.safetyChecks[idx].checked = safety.selected;
                cache.safetyChecks[idx].disabled = !safety.enabled;
            }
        });

        // Update gunsight checkboxes
        cockpitOptions.selected_gunsights.forEach((gunsight, idx) => {
            if (idx < cache.gunsightChecks.length) {
                cache.gunsightChecks[idx].checked = gunsight.selected;
                cache.gunsightChecks[idx].disabled = !gunsight.enabled;
            }
        });

        // Update bombsight input
        cache.bombsightInput.value = cockpitOptions.bombsight.value.toString();
        cache.bombsightInput.disabled = !cockpitOptions.bombsight.enabled;

        // Update stats
        cache.statsCell.innerHTML = '';
        const stats = bridge.getCockpitStats(index);
        const derivedStats = bridge.getCockpitDerivedStats(index);
        const statsTable = this.renderer.renderStatsTable(stats, COCKPIT_STATS, derivedStats);
        cache.statsCell.appendChild(statsTable);
    }
}
