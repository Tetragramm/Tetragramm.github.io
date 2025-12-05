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
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileNumberInput,
    createMobileCheckbox,
    createMobileStatsGrid,
    updateMobileStatsGrid
} from '../dom_utils';

// Cache interface for type safety
interface PassengersCache {
    seatsInput: HTMLInputElement;
    bedsInput: HTMLInputElement;
    connectCheckbox: HTMLInputElement;
    statsTable: HTMLTableElement;
    mobileStatsGrid?: HTMLDivElement;
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
        const stats = bridge.getPassengersStats();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

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
            this.onUpdate();
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
            this.onUpdate();
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
                this.onUpdate();
            }
        );
        upgradeCell.appendChild(flexContainer.div0);
        dataRow.appendChild(upgradeCell);

        // Stats cells - create stats table spanning 2 columns
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        statsCell.rowSpan = 2;
        const statsTable = createStatsTable(stats, PASSENGERS_STATS);
        statsCell.appendChild(statsTable);
        headerRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Seats
        const seatsItem = createMobileOptionItem(
            localization.translate('Passengers Number of Seats'),
            mobileDiv
        );
        createMobileNumberInput(
            { ...bindings.seats, name: '' },
            seatsItem.content,
            (value) => {
                const updatedBindings = bridge.getPassengersBindings();
                updatedBindings.seats.value = value;
                bridge.setPassengersBindings(updatedBindings);
                this.onUpdate();
            },
            0
        );

        // Beds
        const bedsItem = createMobileOptionItem(
            localization.translate('Passengers Number of Beds'),
            mobileDiv
        );
        createMobileNumberInput(
            { ...bindings.beds, name: '' },
            bedsItem.content,
            (value) => {
                const updatedBindings = bridge.getPassengersBindings();
                updatedBindings.beds.value = value;
                bridge.setPassengersBindings(updatedBindings);
                this.onUpdate();
            },
            0
        );

        // Connectivity upgrade
        const upgradeItem = createMobileOptionItem(
            localization.translate('Passengers Upgrade'),
            mobileDiv
        );
        createMobileCheckbox(
            bindings.connected,
            upgradeItem.content,
            (checked) => {
                const updatedBindings = bridge.getPassengersBindings();
                updatedBindings.connected.selected = checked;
                bridge.setPassengersBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Stats grid
        const statsItem = createMobileOptionItem(
            localization.translate('Passengers Stats'),
            mobileDiv
        );
        const mobileStatsGrid = createMobileStatsGrid(stats, PASSENGERS_STATS);
        statsItem.content.appendChild(mobileStatsGrid);

        contentWrapper.appendChild(mobileDiv);

        // Cache elements
        this.cache = {
            seatsInput,
            bedsInput,
            connectCheckbox,
            statsTable,
            mobileStatsGrid
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Passengers Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
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

        // Update mobile stats grid
        if (this.cache.mobileStatsGrid) {
            updateMobileStatsGrid(this.cache.mobileStatsGrid, stats, PASSENGERS_STATS);
        }
    }

    /**
     * Apply initial collapse state based on whether passengers are at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getPassengersIsDefault();
        this.setCollapsed(isDefault);
    }
}
