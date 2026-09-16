/**
 * Era UI Component
 *
 * Displays the Era selection using UIBindings from Rust
 * Demonstrates the full WASM + localization flow
 */

import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createCollapsibleSection,
    createRulesLink,
    StatDisplayConfig,
    DualControl,
    dualSelect,
    dualStats,
} from '../dom_utils';

// Era stats configuration (matching original TypeScript: liftbleed, cost, pitchstab)
const ERA_STATS: StatDisplayConfig[] = [
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true }
];

export class EraUI extends BaseComponentUI {
    // Dual controls (desktop + mobile) built in rebuildFull, refreshed in updateValues.
    private controls: DualControl[] = [];

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
        if (!bridge) {
            console.error('[EraUI] rebuildFull: Bridge not available');
            return;
        }

        // One definition per control; each yields a desktop node and a mobile node
        // sharing a single change handler.
        const selectCtl = dualSelect(
            localization.translate('Era Option'),
            () => bridge.getEraBindings().selected_era,
            (selectedIndex) => {
                const bindings = bridge.getEraBindings();
                bindings.selected_era.selected = selectedIndex;
                bridge.setEraBindings(bindings);
                this.onUpdate();
            }
        );
        const statsCtl = dualStats(
            localization.translate('Era Era Stats'),
            () => bridge.getEraStats(),
            ERA_STATS
        );
        this.controls = [selectCtl, statsCtl];

        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION (unchanged layout) ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Table for Era selection (matching original TypeScript layout)
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_era';

        // Header row with Era Option and stat headers
        const headerRow = document.createElement('tr');
        const th = document.createElement('th');
        th.textContent = localization.translate('Era Option');
        headerRow.appendChild(th);
        const th2 = document.createElement('th');
        th2.textContent = localization.translate('Era Era Stats');
        headerRow.appendChild(th2);
        table.appendChild(headerRow);

        // Data row with select and stat cells
        const dataRow = document.createElement('tr');

        const selectCell = document.createElement('td');
        selectCell.appendChild(selectCtl.desktop);
        dataRow.appendChild(selectCell);

        const statCell = document.createElement('td');
        statCell.className = 'inner_table';
        statCell.appendChild(statsCtl.desktop);
        dataRow.appendChild(statCell);

        table.appendChild(dataRow);
        desktopDiv.appendChild(table);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';
        mobileDiv.appendChild(selectCtl.mobile);
        mobileDiv.appendChild(statsCtl.mobile);
        contentWrapper.appendChild(mobileDiv);

        // Collapsible section with localized title
        const sectionTitle = localization.translate('Era Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility function
        const rulesLine = createRulesLink('_Era');
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
