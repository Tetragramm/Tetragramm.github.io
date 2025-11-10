/**
 * Passengers UI Component
 *
 * Displays the Passengers section using UIBindings from Rust
 * Includes number of seats, beds, and connectivity upgrade
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    createFlexCheckbox,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig
} from '../dom_utils';

// Cache interface for type safety
interface PassengersCache {
    seatsInput: HTMLInputElement;
    bedsInput: HTMLInputElement;
    connectCheckbox: HTMLInputElement;
    statsTable: HTMLTableElement;
}

// Passengers stats configuration
const PASSENGERS_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
];

export class PassengersUI extends BaseComponentUI {
    private cache: PassengersCache = undefined;

    protected shouldUpdate(): boolean {
        return this.cache !== undefined;
    }

    protected clearCache(): void {
        this.cache = undefined;
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getPassengersBindings();

        // Create main table: Seats | Beds | Upgrade | Mass | Required Sections
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'table_passengers';

        // Header row
        const headerRow = document.createElement('tr');
        [
            localization.translate('Passengers Number of Seats'),
            localization.translate('Passengers Number of Beds'),
            localization.translate('Passengers Upgrade'),
            localization.translate('Stat Mass'),
            localization.translate('Stat Required Sections')
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Seats input cell
        const seatsCell = document.createElement('td');
        const seatsInput = document.createElement('input');
        seatsInput.type = 'number';
        seatsInput.min = '0';
        seatsInput.value = bindings.seats.value.toString();
        seatsInput.disabled = !bindings.seats.enabled;
        seatsInput.addEventListener('change', () => {
            const updatedBindings = bridge.getPassengersBindings();
            updatedBindings.seats.value = parseInt(seatsInput.value) || 0;
            bridge.setPassengersBindings(updatedBindings);
            this.render();
        });
        seatsCell.appendChild(seatsInput);
        dataRow.appendChild(seatsCell);

        // Beds input cell
        const bedsCell = document.createElement('td');
        const bedsInput = document.createElement('input');
        bedsInput.type = 'number';
        bedsInput.min = '0';
        bedsInput.value = bindings.beds.value.toString();
        bedsInput.disabled = !bindings.beds.enabled;
        bedsInput.addEventListener('change', () => {
            const updatedBindings = bridge.getPassengersBindings();
            updatedBindings.beds.value = parseInt(bedsInput.value) || 0;
            bridge.setPassengersBindings(updatedBindings);
            this.render();
        });
        bedsCell.appendChild(bedsInput);
        dataRow.appendChild(bedsCell);

        // Upgrade cell with connectivity checkbox
        const upgradeCell = document.createElement('td');
        const flexContainer = createFlexSection();
        const connectCheckbox = createFlexCheckbox(
            bindings.connected,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getPassengersBindings();
                updatedBindings.connected.selected = checked;
                bridge.setPassengersBindings(updatedBindings);
                this.render();
            }
        );
        upgradeCell.appendChild(flexContainer.div0);
        dataRow.appendChild(upgradeCell);

        // Stats cells - create stats table spanning 2 columns
        const statsCell = document.createElement('td');
        statsCell.colSpan = 2;
        const stats = bridge.getPassengersStats();
        const statsTable = createStatsTable(stats, PASSENGERS_STATS);
        statsCell.appendChild(statsTable);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);

        // Cache elements
        this.cache = {
            seatsInput,
            bedsInput,
            connectCheckbox,
            statsTable
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Passengers Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            mainTable,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Passengers');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[PassengersUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getPassengersBindings();

        // Update seats input
        if (this.cache.seatsInput && bindings.seats) {
            this.cache.seatsInput.value = bindings.seats.value.toString();
            this.cache.seatsInput.disabled = !bindings.seats.enabled;
        }

        // Update beds input
        if (this.cache.bedsInput && bindings.beds) {
            this.cache.bedsInput.value = bindings.beds.value.toString();
            this.cache.bedsInput.disabled = !bindings.beds.enabled;
        }

        // Update connectivity checkbox
        if (this.cache.connectCheckbox && bindings.connected) {
            this.cache.connectCheckbox.checked = bindings.connected.selected;
            this.cache.connectCheckbox.disabled = !bindings.connected.enabled;
        }

        // Update stats table
        const stats = bridge.getPassengersStats();
        updateStatsTable(this.cache.statsTable, stats, PASSENGERS_STATS);
    }
}
