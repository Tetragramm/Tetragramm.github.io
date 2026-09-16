/**
 * Stabilizers UI Component
 *
 * Displays the Stabilizers section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    updateSelectElement,
    createSelectElement,
    createFlexSection,
    createCollapsibleSection,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileSelect,
    Updatable,
    dualStats,
    dualNumberInto,
} from '../dom_utils';

// Stabilizer stats configuration
const STABILIZER_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: true },
];

export class StabilizersUI extends BaseComponentUI {
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
     * Build the dual select + count for one stabilizer.
     *
     * The original desktop placed a BARE select (createSelectElement) directly in
     * the cell, then a <br>, then a separate flex section for the count. That bare
     * select layout is not what dualSelectInto produces (it wraps the select in a
     * flex with a label), so the select pair is built here by hand to keep the
     * desktop DOM byte-identical; the count uses dualNumberInto whose desktop output
     * (its own flex section) matches the original createFlexNumberInput exactly and
     * whose mobile sub-label is taken from binding.name.
     *
     * Desktop nodes are placed into `cell`; the mobile select + count share one
     * mobile-option-item appended to `mobileDiv`.
     */
    private buildStabilizer(
        cell: HTMLTableCellElement,
        mobileDiv: HTMLElement,
        title: string,
        selKey: string,
        countKey: string,
        bridge: AircraftBridge
    ): void {
        // === DESKTOP: bare select, <br>, then count flex (filled by dualNumberInto) ===
        const desktopSelect = createSelectElement(
            bridge.getStabilizersBindings()[selKey],
            (selectedIndex) => {
                const b = bridge.getStabilizersBindings();
                b[selKey].selected = selectedIndex;
                bridge.setStabilizersBindings(b);
                this.onUpdate();
            }
        );
        cell.appendChild(desktopSelect);
        cell.appendChild(document.createElement('br'));

        // === MOBILE: one option item shared by the select and the count ===
        const item = createMobileOptionItem(title, mobileDiv);
        const mobileSelect = createMobileSelect(
            bridge.getStabilizersBindings()[selKey],
            item.content,
            (selectedIndex) => {
                const b = bridge.getStabilizersBindings();
                b[selKey].selected = selectedIndex;
                bridge.setStabilizersBindings(b);
                this.onUpdate();
            }
        );

        // Select dual control (built once, shared handler already wired above).
        this.controls.push({
            update() {
                const binding = bridge.getStabilizersBindings()[selKey];
                updateSelectElement(desktopSelect, binding);
                updateSelectElement(mobileSelect, binding);
            },
        });

        // Count: desktop flex placed where the original count flex went; mobile
        // count appended into the same option item; sub-label kept via binding.name.
        const countLabel = localization.translate('Stabilizers # of Stabilizers');
        const countFlex = createFlexSection();
        this.controls.push(dualNumberInto(
            countFlex,
            item.content,
            () => ({ ...bridge.getStabilizersBindings()[countKey], name: countLabel }),
            (value) => {
                const b = bridge.getStabilizersBindings();
                b[countKey].value = value;
                bridge.setStabilizersBindings(b);
                this.onUpdate();
            },
            { min: 0, max: 20 }
        ));
        cell.appendChild(countFlex.div0);
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // Stats block maps cleanly: one definition yields desktop table + mobile grid.
        const statsCtl = dualStats(
            localization.translate('Stabilizers Stabilizer Stats'),
            () => bridge.getStabilizersStats(),
            STABILIZER_STATS
        );

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 3 columns: Horizontal | Vertical | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'stab_table';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Stabilizers Horizontal Stabilizers'),
            localization.translate('Stabilizers Vertical Stabilizers'),
            localization.translate('Stabilizers Stabilizer Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Horizontal stabilizers cell
        const hCell = document.createElement('td');
        dataRow.appendChild(hCell);

        // Vertical stabilizers cell
        const vCell = document.createElement('td');
        dataRow.appendChild(vCell);

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

        // Each stabilizer: desktop nodes into its cell, select + count grouped under
        // one mobile option item. buildStabilizer pushes both dual controls.
        this.buildStabilizer(
            hCell,
            mobileDiv,
            localization.translate('Stabilizers Horizontal Stabilizers'),
            'hstab_sel',
            'hstab_count',
            bridge
        );
        this.buildStabilizer(
            vCell,
            mobileDiv,
            localization.translate('Stabilizers Vertical Stabilizers'),
            'vstab_sel',
            'vstab_count',
            bridge
        );

        // Stats grid (from the dual stats control)
        mobileDiv.appendChild(statsCtl.mobile);

        contentWrapper.appendChild(mobileDiv);

        this.controls.push(statsCtl);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Stabilizers Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Stabilizers');
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
     * Apply initial collapse state based on whether stabilizers are at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getStabilizersIsDefault();
        this.setCollapsed(isDefault);
    }
}
