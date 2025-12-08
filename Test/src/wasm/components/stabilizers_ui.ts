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
    createFlexSection,
    createFlexNumberInput,
    createSelectElement,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileSelect,
    createMobileNumberInput,
    createMobileStatsGrid,
    updateMobileStatsGrid
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

// Cache interface for type safety
interface StabilizersCache {
    hTypeSelect: HTMLSelectElement;
    hCountInput: HTMLInputElement;
    vTypeSelect: HTMLSelectElement;
    vCountInput: HTMLInputElement;
    statsTable: HTMLTableElement;
    mobileStatsGrid?: HTMLDivElement;
    // Mobile controls
    mobileHTypeSelect?: HTMLSelectElement;
    mobileHCountInput?: HTMLInputElement;
    mobileVTypeSelect?: HTMLSelectElement;
    mobileVCountInput?: HTMLInputElement;
}

export class StabilizersUI extends BaseComponentUI {
    private cache: StabilizersCache = undefined;

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

        const bindings = bridge.getStabilizersBindings();
        const stats = bridge.getStabilizersStats();

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
        const { hTypeSelect, hCountInput } = this.createHorizontalSection(hCell, bindings, bridge);
        dataRow.appendChild(hCell);

        // Vertical stabilizers cell
        const vCell = document.createElement('td');
        const { vTypeSelect, vCountInput } = this.createVerticalSection(vCell, bindings, bridge);
        dataRow.appendChild(vCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        const statsTable = createStatsTable(stats, STABILIZER_STATS);
        statsCell.appendChild(statsTable);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Horizontal Stabilizers
        const hStabItem = createMobileOptionItem(
            localization.translate('Stabilizers Horizontal Stabilizers'),
            mobileDiv
        );
        const mobileHTypeSelect = createMobileSelect(
            bindings.hstab_sel,
            hStabItem.content,
            (selectedIndex) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.hstab_sel.selected = selectedIndex;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            }
        );
        const { input: mobileHCountInput } = createMobileNumberInput(
            { ...bindings.hstab_count, name: localization.translate('Stabilizers # of Stabilizers') },
            hStabItem.content,
            (value) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.hstab_count.value = value;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            },
            0, 20
        );

        // Vertical Stabilizers
        const vStabItem = createMobileOptionItem(
            localization.translate('Stabilizers Vertical Stabilizers'),
            mobileDiv
        );
        const mobileVTypeSelect = createMobileSelect(
            bindings.vstab_sel,
            vStabItem.content,
            (selectedIndex) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.vstab_sel.selected = selectedIndex;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            }
        );
        const { input: mobileVCountInput } = createMobileNumberInput(
            { ...bindings.vstab_count, name: localization.translate('Stabilizers # of Stabilizers') },
            vStabItem.content,
            (value) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.vstab_count.value = value;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            },
            0, 20
        );

        // Stats grid
        const statsItem = createMobileOptionItem(
            localization.translate('Stabilizers Stabilizer Stats'),
            mobileDiv
        );
        const mobileStatsGrid = createMobileStatsGrid(stats, STABILIZER_STATS);
        statsItem.content.appendChild(mobileStatsGrid);

        contentWrapper.appendChild(mobileDiv);

        // Cache elements
        this.cache = {
            hTypeSelect,
            hCountInput,
            vTypeSelect,
            vCountInput,
            statsTable,
            mobileStatsGrid,
            mobileHTypeSelect,
            mobileHCountInput,
            mobileVTypeSelect,
            mobileVCountInput
        };

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

        console.log('[StabilizersUI] Full rebuild complete');
    }

    /**
     * Create horizontal stabilizers section
     */
    private createHorizontalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): { hTypeSelect: HTMLSelectElement; hCountInput: HTMLInputElement } {
        const typeBinding = bindings.hstab_sel;
        const countBinding = bindings.hstab_count;

        // Type select using helper
        const hTypeSelect = createSelectElement(
            typeBinding,
            (selectedIndex) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.hstab_sel.selected = selectedIndex;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            }
        );

        cell.appendChild(hTypeSelect);
        cell.appendChild(document.createElement('br'));

        // Count input using flex helper
        const flexContainer = createFlexSection();

        // Override the binding name with translated label
        const countBindingWithLabel = { ...countBinding, name: localization.translate('Stabilizers # of Stabilizers') };

        const hCountInput = createFlexNumberInput(
            countBindingWithLabel,
            flexContainer,
            (value) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.hstab_count.value = value;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            },
            '0',
            '20'
        );

        cell.appendChild(flexContainer.div0);

        return { hTypeSelect, hCountInput };
    }

    /**
     * Create vertical stabilizers section
     */
    private createVerticalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): { vTypeSelect: HTMLSelectElement; vCountInput: HTMLInputElement } {
        const typeBinding = bindings.vstab_sel;
        const countBinding = bindings.vstab_count;

        // Type select using helper
        const vTypeSelect = createSelectElement(
            typeBinding,
            (selectedIndex) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.vstab_sel.selected = selectedIndex;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            }
        );

        cell.appendChild(vTypeSelect);
        cell.appendChild(document.createElement('br'));

        // Count input using flex helper
        const flexContainer = createFlexSection();

        // Override the binding name with translated label
        const countBindingWithLabel = { ...countBinding, name: localization.translate('Stabilizers # of Stabilizers') };

        const vCountInput = createFlexNumberInput(
            countBindingWithLabel,
            flexContainer,
            (value) => {
                const bindings = bridge.getStabilizersBindings();
                bindings.vstab_count.value = value;
                bridge.setStabilizersBindings(bindings);
                this.onUpdate();
            },
            '0',
            '20'
        );

        cell.appendChild(flexContainer.div0);

        return { vTypeSelect, vCountInput };
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getStabilizersBindings();

        // Update horizontal stabilizers (desktop)
        updateSelectElement(this.cache.hTypeSelect, bindings.hstab_sel);
        this.cache.hCountInput.value = bindings.hstab_count.value.toString();
        this.cache.hCountInput.disabled = !bindings.hstab_count.enabled;

        // Update vertical stabilizers (desktop)
        updateSelectElement(this.cache.vTypeSelect, bindings.vstab_sel);
        this.cache.vCountInput.value = bindings.vstab_count.value.toString();
        this.cache.vCountInput.disabled = !bindings.vstab_count.enabled;

        // Update horizontal stabilizers (mobile)
        if (this.cache.mobileHTypeSelect) {
            updateSelectElement(this.cache.mobileHTypeSelect, bindings.hstab_sel);
        }
        if (this.cache.mobileHCountInput) {
            this.cache.mobileHCountInput.value = bindings.hstab_count.value.toString();
            this.cache.mobileHCountInput.disabled = !bindings.hstab_count.enabled;
        }

        // Update vertical stabilizers (mobile)
        if (this.cache.mobileVTypeSelect) {
            updateSelectElement(this.cache.mobileVTypeSelect, bindings.vstab_sel);
        }
        if (this.cache.mobileVCountInput) {
            this.cache.mobileVCountInput.value = bindings.vstab_count.value.toString();
            this.cache.mobileVCountInput.disabled = !bindings.vstab_count.enabled;
        }

        // Update stat values
        const stats = bridge.getStabilizersStats();
        updateStatsTable(this.cache.statsTable, stats, STABILIZER_STATS);

        // Update mobile stats grid
        if (this.cache.mobileStatsGrid) {
            updateMobileStatsGrid(this.cache.mobileStatsGrid, stats, STABILIZER_STATS);
        }
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
