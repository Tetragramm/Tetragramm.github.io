/**
 * LandingGear UI Component
 *
 * Displays the LandingGear section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    createCollapsibleSection,
    StatDisplayConfig,
    createMobileOptionItem,
    Updatable,
    dualStats,
    dualSelectInto,
    dualCheckboxInto,
} from '../dom_utils';

// Landing Gear stats configuration
const GEAR_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'crashsafety', label: 'Stat Crash Safety', positiveIsGood: true },
    { key: '', label: '', positiveIsGood: undefined },
];

export class LandingGearUI extends BaseComponentUI {
    // Dual controls (desktop + mobile) built in rebuildFull, refreshed in updateValues.
    private controls: Updatable[] = [];

    protected shouldUpdate(): boolean {
        // Null-safe: BaseComponentUI's constructor triggers the first render()
        // (hence shouldUpdate) before this subclass's field initializer runs.
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

        const bindings = bridge.getLandingGearBindings();

        // Stats block converted to a dual control (desktop table + mobile grid).
        const statsCtl = dualStats(
            localization.translate('Landing Gear Gear Stats'),
            () => bridge.getLandingGearStats(),
            GEAR_STATS
        );

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 3 columns: Landing Gear | Extras | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_gear';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Landing Gear Landing Gear'),
            localization.translate('Landing Gear Extras'),
            localization.translate('Landing Gear Gear Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const UIRow = document.createElement('tr');

        // Landing Gear cell (type select + retractable checkbox) — shared desktop flex.
        const gearCell = document.createElement('td');
        const gearFlex = createFlexSection();
        gearCell.appendChild(gearFlex.div0);
        UIRow.appendChild(gearCell);

        // Extras cell (list of checkboxes) — shared desktop flex.
        const extrasCell = document.createElement('td');
        const extrasFlex = createFlexSection();
        extrasCell.appendChild(extrasFlex.div0);
        UIRow.appendChild(extrasCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        statsCell.appendChild(statsCtl.desktop);
        UIRow.appendChild(statsCell);
        mainTable.appendChild(UIRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Landing Gear Type + retract — desktop shares gearFlex; mobile shares one item.
        const gearItem = createMobileOptionItem(
            localization.translate('Landing Gear Landing Gear'),
            mobileDiv
        );
        if (bindings.gear_sel) {
            this.controls.push(dualSelectInto(
                gearFlex,
                gearItem.content,
                () => bridge.getLandingGearBindings().gear_sel,
                (selectedIndex) => {
                    const updatedBindings = bridge.getLandingGearBindings();
                    updatedBindings.gear_sel.selected = selectedIndex;
                    bridge.setLandingGearBindings(updatedBindings);
                    this.onUpdate();
                },
                'Type'
            ));
        }
        if (bindings.retract) {
            this.controls.push(dualCheckboxInto(
                gearFlex,
                gearItem.content,
                () => bridge.getLandingGearBindings().retract,
                (checked) => {
                    const updatedBindings = bridge.getLandingGearBindings();
                    updatedBindings.retract.selected = checked;
                    bridge.setLandingGearBindings(updatedBindings);
                    this.onUpdate();
                }
            ));
        }

        // Extras — desktop shares extrasFlex; mobile shares one item.
        const extrasItem = createMobileOptionItem(
            localization.translate('Landing Gear Extras'),
            mobileDiv
        );
        if (bindings.extra_sel && Array.isArray(bindings.extra_sel)) {
            bindings.extra_sel.forEach((_extra: any, idx: number) => {
                this.controls.push(dualCheckboxInto(
                    extrasFlex,
                    extrasItem.content,
                    () => bridge.getLandingGearBindings().extra_sel[idx],
                    (checked) => {
                        const updatedBindings = bridge.getLandingGearBindings();
                        updatedBindings.extra_sel[idx].selected = checked;
                        bridge.setLandingGearBindings(updatedBindings);
                        this.onUpdate();
                    }
                ));
            });
        }

        // Stats grid
        mobileDiv.appendChild(statsCtl.mobile);

        contentWrapper.appendChild(mobileDiv);

        this.controls.push(statsCtl);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Landing Gear Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Landing_Gear');
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
     * Apply initial collapse state based on whether landing gear is at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getLandingGearIsDefault();
        this.setCollapsed(isDefault);
    }
}
