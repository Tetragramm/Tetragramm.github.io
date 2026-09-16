/**
 * Total Stats UI Component
 *
 * Displays the total sum of all aircraft stats in a large table with 6 stats per row.
 * Based on Test/src/disp/Aircraft.ts InitStats() and UpdateStats() methods.
 */

import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import {
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createMobileStatsGrid,
    createMobileOptionItem
} from '../dom_utils';

/**
 * Configuration for total stats display - 6 stats per row
 * Based on Aircraft.ts lines 1038-1089
 */
const TOTAL_STATS: StatDisplayConfig[] = [
    // Row 1
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'wetmass', label: 'Stat Wet Mass', positiveIsGood: false },
    { key: 'bomb_mass', label: 'Stat Bomb Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },

    // Row 2
    { key: 'upkeep', label: 'Stat Upkeep', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'wingarea', label: 'Stat Wing Area', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Raw Strain', positiveIsGood: true },

    // Row 3
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'toughness', label: 'Stat Toughness', positiveIsGood: true },
    { key: 'power', label: 'Stat Power', positiveIsGood: true },
    { key: 'fuelconsumption', label: 'Stat Fuel Consumption', positiveIsGood: false },
    { key: 'fuel', label: 'Stat Fuel', positiveIsGood: true },
    { key: 'pitchspeed', label: 'Stat Pitch Speed', positiveIsGood: true },

    // Row 4
    { key: 'pitchboost', label: 'Stat Pitch Boost', positiveIsGood: true },
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
    { key: 'crashsafety', label: 'Stat Crash Safety', positiveIsGood: true },
];

/**
 * Total Stats UI Component - displays total aircraft statistics
 */
export class TotalStatsUI extends BaseComponentUI {
    private statsTable: HTMLTableElement;
    private mobileStatsGrid: HTMLDivElement;

    protected shouldUpdate(): boolean {
        return this.statsTable !== undefined;
    }

    protected clearCache(): void {
        this.statsTable = undefined;
        this.mobileStatsGrid = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // Get stats
        const stats = bridge.getStats();

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only content';

        // Create table with 6 stats per row
        this.statsTable = createStatsTable(stats, TOTAL_STATS, undefined, 7);
        desktopDiv.appendChild(this.statsTable);
        this.statsTable.className = '';
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        const statsTitle = createMobileOptionItem(
            '',
            mobileDiv
        );

        this.mobileStatsGrid = createMobileStatsGrid(stats, TOTAL_STATS);
        statsTitle.content.appendChild(this.mobileStatsGrid);
        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section
        const sectionTitle = localization.translate('Aircraft Stats Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            false // Collapsed by default
        );

        this.container.appendChild(this.sectionElement);

        console.log('[TotalStatsUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const stats = bridge.getStats();

        if (this.statsTable) {
            updateStatsTable(this.statsTable, stats, TOTAL_STATS, undefined, 7);
        }

        // Update mobile grid by rebuilding it
        if (this.mobileStatsGrid && this.mobileStatsGrid.parentElement) {
            const parent = this.mobileStatsGrid.parentElement;
            const newGrid = createMobileStatsGrid(stats, TOTAL_STATS);
            parent.replaceChild(newGrid, this.mobileStatsGrid);
            this.mobileStatsGrid = newGrid;
        }
    }
}
