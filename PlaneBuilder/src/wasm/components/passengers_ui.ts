/**
 * Passengers UI Component
 *
 * Displays the Passengers section using UIBindings from Rust
 * Includes number of seats, beds, and connectivity upgrade
 */

import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createCollapsibleSection,
    StatDisplayConfig,
    DualControl,
    dualNumber,
    dualCheckbox,
    dualStats,
} from '../dom_utils';

// Passengers stats configuration
const PASSENGERS_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
];

export class PassengersUI extends BaseComponentUI {
    private controls: DualControl[] = [];

    protected shouldUpdate(): boolean {
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // One definition per control; each yields a desktop node and a mobile node.
        const seatsCtl = dualNumber(
            localization.translate('Passengers Number of Seats'),
            () => bridge.getPassengersBindings().seats,
            (value) => {
                const b = bridge.getPassengersBindings();
                b.seats.value = value;
                bridge.setPassengersBindings(b);
                this.onUpdate();
            },
            { desktopLabel: '' } // Seats column is labelled by the table header
        );
        const bedsCtl = dualNumber(
            localization.translate('Passengers Number of Beds'),
            () => bridge.getPassengersBindings().beds,
            (value) => {
                const b = bridge.getPassengersBindings();
                b.beds.value = value;
                bridge.setPassengersBindings(b);
                this.onUpdate();
            },
            { desktopLabel: '' } // Beds column is labelled by the table header
        );
        const connectCtl = dualCheckbox(
            localization.translate('Passengers Upgrade'),
            () => bridge.getPassengersBindings().connected,
            (checked) => {
                const b = bridge.getPassengersBindings();
                b.connected.selected = checked;
                bridge.setPassengersBindings(b);
                this.onUpdate();
            }
        );
        const statsCtl = dualStats(
            localization.translate('Passengers Stats'),
            () => bridge.getPassengersStats(),
            PASSENGERS_STATS
        );
        this.controls = [seatsCtl, bedsCtl, connectCtl, statsCtl];

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION (unchanged layout) ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Main table: Seats | Beds | Upgrade | Stats (rowSpan 2)
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

        const seatsCell = document.createElement('td');
        seatsCell.appendChild(seatsCtl.desktop);
        dataRow.appendChild(seatsCell);

        const bedsCell = document.createElement('td');
        bedsCell.appendChild(bedsCtl.desktop);
        dataRow.appendChild(bedsCell);

        const upgradeCell = document.createElement('td');
        upgradeCell.appendChild(connectCtl.desktop);
        dataRow.appendChild(upgradeCell);

        // Stats cell spanning both rows, attached to the header row
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        statsCell.rowSpan = 2;
        statsCell.appendChild(statsCtl.desktop);
        headerRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';
        mobileDiv.appendChild(seatsCtl.mobile);
        mobileDiv.appendChild(bedsCtl.mobile);
        mobileDiv.appendChild(connectCtl.mobile);
        mobileDiv.appendChild(statsCtl.mobile);
        contentWrapper.appendChild(mobileDiv);

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
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;
        this.controls.forEach(c => c.update());
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
