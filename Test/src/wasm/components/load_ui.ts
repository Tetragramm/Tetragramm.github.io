/**
 * Load UI Component
 *
 * Combined component for Fuel, Munitions, and Cargo
 * Matches the original TypeScript 4-column table layout
 */

import { addStats } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    createCollapsibleSection,
    StatDisplayConfig,
    createMobileOptionItem,
    Updatable,
    dualSelect,
    dualStats,
    dualNumberInto,
    dualCheckboxInto,
} from '../dom_utils';


// Load stats configuration
const LOAD_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'wetmass', label: 'Stat Wet Mass', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    { key: 'fuel', label: 'Stat Fuel', positiveIsGood: true },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: '', label: '', positiveIsGood: undefined },
    { key: 'fuel_uses', label: 'Derived Fuel Uses', positiveIsGood: true, isDerived: true },
    { key: '', label: '', positiveIsGood: undefined },
];

export class LoadUI extends BaseComponentUI {
    private controls: Updatable[] = [];

    protected shouldUpdate(): boolean {
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
    }

    /**
     * Combined Load stats: fuel + munitions + cargo summed via addStats.
     * Shared by build and update through the dualStats closure.
     */
    private getCombinedStats(bridge: any): any {
        return addStats(
            bridge.getFuelStats(),
            bridge.getMunitionsStats(),
            bridge.getCargoStats()
        );
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Stats: combined fuel + munitions + cargo, one desktop table + one mobile grid.
        const statsCtl = dualStats(
            localization.translate('Load Load Stats'),
            () => this.getCombinedStats(bridge),
            LOAD_STATS,
            () => bridge.getDerivedStats()
        );

        // Cargo: bare desktop select (no flex/label) + own mobile item, matching original.
        let cargoCtl: (Updatable & { desktop: HTMLSelectElement; mobile: HTMLElement }) | undefined;
        if (cargoBindings.space_sel) {
            cargoCtl = dualSelect(
                localization.translate('Load Cargo and Passengers'),
                () => bridge.getCargoBindings().space_sel,
                (selectedIndex) => {
                    const updatedBindings = bridge.getCargoBindings();
                    updatedBindings.space_sel.selected = selectedIndex;
                    bridge.setCargoBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 4 columns: Fuel | Munitions | Cargo | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_load';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Load Fuel'),
            localization.translate('Load Munitions'),
            localization.translate('Load Cargo and Passengers'),
            localization.translate('Load Load Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Fuel cell: one shared desktop flex section.
        const fuelCell = document.createElement('td');
        const fuelFlex = createFlexSection();
        fuelCell.appendChild(fuelFlex.div0);
        dataRow.appendChild(fuelCell);

        // Munitions cell: one shared desktop flex section.
        const munitionsCell = document.createElement('td');
        const munitionsFlex = createFlexSection();
        munitionsCell.appendChild(munitionsFlex.div0);
        dataRow.appendChild(munitionsCell);

        // Cargo cell: bare select appended directly (no flex), matching original.
        const cargoCell = document.createElement('td');
        if (cargoCtl) {
            cargoCell.appendChild(cargoCtl.desktop);
        }
        dataRow.appendChild(cargoCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        statsCell.appendChild(statsCtl.desktop);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Fuel section: desktop shares fuelFlex; mobile shares one item.
        const fuelItem = createMobileOptionItem(
            localization.translate('Load Fuel'),
            mobileDiv
        );
        // Fuel tank inputs (array of number bindings)
        if (fuelBindings.tank_count && Array.isArray(fuelBindings.tank_count)) {
            fuelBindings.tank_count.forEach((_tank: any, idx: number) => {
                this.controls.push(dualNumberInto(
                    fuelFlex,
                    fuelItem.content,
                    () => bridge.getFuelBindings().tank_count[idx],
                    (value) => {
                        const updatedBindings = bridge.getFuelBindings();
                        updatedBindings.tank_count[idx].value = value;
                        bridge.setFuelBindings(updatedBindings);
                        this.onUpdate();
                    }
                ));
            });
        }
        // Self-sealing checkbox
        if (fuelBindings.self_sealing) {
            this.controls.push(dualCheckboxInto(
                fuelFlex,
                fuelItem.content,
                () => bridge.getFuelBindings().self_sealing,
                (checked) => {
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings.self_sealing.selected = checked;
                    bridge.setFuelBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }
        // Fire extinguisher checkbox
        if (fuelBindings.fire_extinguisher) {
            this.controls.push(dualCheckboxInto(
                fuelFlex,
                fuelItem.content,
                () => bridge.getFuelBindings().fire_extinguisher,
                (checked) => {
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings.fire_extinguisher.selected = checked;
                    bridge.setFuelBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }

        // Munitions section: desktop shares munitionsFlex; mobile shares one item.
        const munitionsItem = createMobileOptionItem(
            localization.translate('Load Munitions'),
            mobileDiv
        );
        if (munitionsBindings.bomb_count) {
            this.controls.push(dualNumberInto(
                munitionsFlex,
                munitionsItem.content,
                () => bridge.getMunitionsBindings().bomb_count,
                (value) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.bomb_count.value = value;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }
        if (munitionsBindings.rocket_count) {
            this.controls.push(dualNumberInto(
                munitionsFlex,
                munitionsItem.content,
                () => bridge.getMunitionsBindings().rocket_count,
                (value) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.rocket_count.value = value;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }
        if (munitionsBindings.internal_bay_count) {
            this.controls.push(dualNumberInto(
                munitionsFlex,
                munitionsItem.content,
                () => bridge.getMunitionsBindings().internal_bay_count,
                (value) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.internal_bay_count.value = value;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }
        if (munitionsBindings.internal_bay_1) {
            this.controls.push(dualCheckboxInto(
                munitionsFlex,
                munitionsItem.content,
                () => bridge.getMunitionsBindings().internal_bay_1,
                (checked) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.internal_bay_1.selected = checked;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }
        if (munitionsBindings.internal_bay_2) {
            this.controls.push(dualCheckboxInto(
                munitionsFlex,
                munitionsItem.content,
                () => bridge.getMunitionsBindings().internal_bay_2,
                (checked) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.internal_bay_2.selected = checked;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }

        // Cargo section: standalone dual control owns its own mobile item.
        if (cargoCtl) {
            mobileDiv.appendChild(cargoCtl.mobile);
            this.controls.push(cargoCtl);
        }

        // Stats grid
        mobileDiv.appendChild(statsCtl.mobile);
        this.controls.push(statsCtl);

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Load Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Load');
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
}
