/**
 * Cockpits UI Component
 *
 * Displays the Cockpits section using UIBindings from Rust
 * Handles multiple cockpit positions with types, upgrades, safety, and gunsights
 */

import { AircraftBridge, CockpitsOptions, CockpitOptions } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexNumberInput,
    createFlexCell,
    createFlexCheckboxes,
    createSelectElement,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileSelect,
    createMobileCheckbox,
    createMobileNumberInput,
    createMobileStatsGrid,
    updateMobileStatsGrid
} from '../dom_utils';

// Cockpit stats configuration
const COCKPIT_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    { key: '', label: '', positiveIsGood: undefined }, // Empty cell for layout
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false, isDerived: true },
    { key: 'pos_escape', label: 'Stat Escape', positiveIsGood: true, isDerived: true },
    { key: 'pos_visibility', label: 'Stat Visibility', positiveIsGood: true, isDerived: true }
];

// Cache for cockpit row elements to avoid recreating DOM
interface CockpitRowCache {
    row: HTMLTableRowElement;
    typeSelect: HTMLSelectElement;
    upgradeChecks: HTMLInputElement[];
    safetyChecks: HTMLInputElement[];
    gunsightChecks: HTMLInputElement[];
    bombsightInput: HTMLInputElement;
    statsTable: HTMLTableElement;
}

// Cache for mobile cockpit elements
interface MobileCockpitCache {
    cockpitIndex: number;
    typeSelect: HTMLSelectElement;
    upgradeChecks: HTMLInputElement[];
    safetyChecks: HTMLInputElement[];
    gunsightChecks: HTMLInputElement[];
    bombsightInput: HTMLInputElement;
    statsGrid: HTMLDivElement;
}

export class CockpitsUI extends BaseComponentUI {
    // Cache DOM elements to avoid recreating
    private cockpitRowCaches: CockpitRowCache[];
    private mobileNumCockpitsInput: HTMLInputElement;
    private numCockpitsInput: HTMLInputElement;
    private mainTable: HTMLTableElement;
    private lastCockpitCount: number;

    // Mobile navigation state
    private mobileSelectedCockpit: number;
    private mobileCockpitContainer: HTMLDivElement;
    private mobileCockpitContent: HTMLDivElement;
    private mobileCockpitNavLabel: HTMLSpanElement;
    private mobileCockpitCache: MobileCockpitCache | undefined;

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
        this.mobileNumCockpitsInput = undefined;
        this.numCockpitsInput = undefined;
        this.mainTable = undefined;
        this.mobileSelectedCockpit = 0;
        this.mobileCockpitContainer = undefined;
        this.mobileCockpitContent = undefined;
        this.mobileCockpitNavLabel = undefined;
        this.mobileCockpitCache = undefined;
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

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only content';

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
                this.onUpdate();
            }
        });
        controlDiv.appendChild(numCockpitsLabel);
        controlDiv.appendChild(this.numCockpitsInput);
        desktopDiv.appendChild(controlDiv);

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
            localization.translate('Cockpit Cockpit Stats')
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

        desktopDiv.appendChild(this.mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Number of cockpits
        const numItem = createMobileOptionItem(
            cockpitsBindings.num_cockpits.name,
            mobileDiv
        );
        const { input: mobileNumInput } = createMobileNumberInput(
            cockpitsBindings.num_cockpits,
            numItem.content,
            (value) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.num_cockpits.value = value;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            },
            1, 20
        );
        this.mobileNumCockpitsInput = mobileNumInput;

        // Container for mobile cockpit navigation
        this.mobileCockpitContainer = document.createElement('div');
        mobileDiv.appendChild(this.mobileCockpitContainer);

        // Build the cockpit navigation
        this.buildMobileCockpitNav();

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Cockpit Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
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
     * Build mobile cockpit navigation with prev/next buttons
     */
    private buildMobileCockpitNav(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.mobileCockpitContainer) return;

        this.mobileCockpitContainer.innerHTML = '';
        const cockpitsBindings = bridge.getCockpitsBindings();
        const cockpitCount = cockpitsBindings.positions.length;

        if (cockpitCount === 0) return;

        // Ensure selected cockpit is within bounds
        if (this.mobileSelectedCockpit >= cockpitCount) {
            this.mobileSelectedCockpit = 0;
        }

        // Create navigation header
        const navDiv = document.createElement('div');
        navDiv.className = 'mobile-nav-header';
        navDiv.style.marginBottom = '0.5rem';
        navDiv.style.padding = '0.5rem';
        navDiv.style.backgroundColor = 'rgba(56, 56, 56, 0.3)';
        navDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedCockpit > 0) {
                this.mobileSelectedCockpit--;
                this.updateMobileCockpitContent();
            }
        };
        navDiv.appendChild(prevBtn);

        // Cockpit label
        this.mobileCockpitNavLabel = document.createElement('span');
        this.mobileCockpitNavLabel.className = 'mobile-option-title';
        this.mobileCockpitNavLabel.textContent = `${localization.translate('Cockpit Position')} ${this.mobileSelectedCockpit + 1} / ${cockpitCount}`;
        navDiv.appendChild(this.mobileCockpitNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.onclick = () => {
            if (this.mobileSelectedCockpit < cockpitCount - 1) {
                this.mobileSelectedCockpit++;
                this.updateMobileCockpitContent();
            }
        };
        navDiv.appendChild(nextBtn);

        this.mobileCockpitContainer.appendChild(navDiv);

        // Content container for the selected cockpit
        this.mobileCockpitContent = document.createElement('div');
        this.mobileCockpitContainer.appendChild(this.mobileCockpitContent);

        // Build content for the currently selected cockpit
        this.updateMobileCockpitContent();
    }

    /**
     * Update mobile cockpit content for the selected position
     * Uses cache if available for the same cockpit, otherwise rebuilds
     */
    private updateMobileCockpitContent(): void {
        if (!this.mobileCockpitContent) return;

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const cockpitsBindings = bridge.getCockpitsBindings();
        const cockpitCount = cockpitsBindings.positions.length;
        const idx = this.mobileSelectedCockpit;

        // Update nav label
        if (this.mobileCockpitNavLabel) {
            this.mobileCockpitNavLabel.textContent = `${localization.translate('Cockpit Position')} ${idx + 1} / ${cockpitCount}`;
        }

        if (idx >= cockpitCount) return;

        // Check if cache is valid for this cockpit
        if (this.mobileCockpitCache && this.mobileCockpitCache.cockpitIndex === idx) {
            // Update existing cache values
            this.updateMobileCockpitCacheValues(bridge, idx);
        } else {
            // Rebuild content and create new cache
            this.buildMobileCockpitContent(bridge, idx);
        }
    }

    /**
     * Build mobile cockpit content and create cache
     */
    private buildMobileCockpitContent(bridge: AircraftBridge, idx: number): void {
        this.mobileCockpitContent.innerHTML = '';

        const cockpitsBindings = bridge.getCockpitsBindings();
        const cockpitOptions = cockpitsBindings.positions[idx];

        // Type select
        const typeItem = createMobileOptionItem(
            localization.translate('Cockpit Type'),
            this.mobileCockpitContent
        );
        const typeSelect = createMobileSelect(
            cockpitOptions.selected_type,
            typeItem.content,
            (selectedIndex) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[idx].selected_type.selected = selectedIndex;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            }
        );

        // Upgrades
        const upgradeChecks: HTMLInputElement[] = [];
        if (cockpitOptions.selected_upgrades && cockpitOptions.selected_upgrades.length > 0) {
            const upgradeItem = createMobileOptionItem(
                localization.translate('Cockpit Upgrade'),
                this.mobileCockpitContent
            );
            upgradeItem.content.style.display = 'flex';
            upgradeItem.content.style.flexWrap = 'wrap';
            upgradeItem.content.style.gap = '0.25rem';

            cockpitOptions.selected_upgrades.forEach((upgrade, upgradeIdx) => {
                const checkbox = createMobileCheckbox(
                    upgrade,
                    upgradeItem.content,
                    (checked) => {
                        const bindings = bridge.getCockpitsBindings();
                        bindings.positions[idx].selected_upgrades[upgradeIdx].selected = checked;
                        bridge.setCockpitsBindings(bindings);
                        this.onUpdate();
                    }
                );
                upgradeChecks.push(checkbox);
            });
        }

        // Safety Options
        const safetyChecks: HTMLInputElement[] = [];
        if (cockpitOptions.selected_safety && cockpitOptions.selected_safety.length > 0) {
            const safetyItem = createMobileOptionItem(
                localization.translate('Cockpit Safety Options'),
                this.mobileCockpitContent
            );
            safetyItem.content.style.display = 'flex';
            safetyItem.content.style.flexWrap = 'wrap';
            safetyItem.content.style.gap = '0.25rem';

            cockpitOptions.selected_safety.forEach((safety, safetyIdx) => {
                const checkbox = createMobileCheckbox(
                    safety,
                    safetyItem.content,
                    (checked) => {
                        const bindings = bridge.getCockpitsBindings();
                        bindings.positions[idx].selected_safety[safetyIdx].selected = checked;
                        bridge.setCockpitsBindings(bindings);
                        this.onUpdate();
                    }
                );
                safetyChecks.push(checkbox);
            });
        }

        // Gunsights
        const gunsightChecks: HTMLInputElement[] = [];
        let bombsightInput: HTMLInputElement | undefined;
        if (cockpitOptions.selected_gunsights && cockpitOptions.selected_gunsights.length > 0) {
            const gunsightItem = createMobileOptionItem(
                localization.translate('Cockpit Gunsights'),
                this.mobileCockpitContent
            );
            gunsightItem.content.style.display = 'flex';
            gunsightItem.content.style.flexWrap = 'wrap';
            gunsightItem.content.style.gap = '0.25rem';

            cockpitOptions.selected_gunsights.forEach((gunsight, gunsightIdx) => {
                const checkbox = createMobileCheckbox(
                    gunsight,
                    gunsightItem.content,
                    (checked) => {
                        const bindings = bridge.getCockpitsBindings();
                        bindings.positions[idx].selected_gunsights[gunsightIdx].selected = checked;
                        bridge.setCockpitsBindings(bindings);
                        this.onUpdate();
                    }
                );
                gunsightChecks.push(checkbox);
            });

            // Bombsight
            const { input } = createMobileNumberInput(
                cockpitOptions.bombsight,
                gunsightItem.content,
                (value) => {
                    const bindings = bridge.getCockpitsBindings();
                    bindings.positions[idx].bombsight.value = value;
                    bridge.setCockpitsBindings(bindings);
                    this.onUpdate();
                },
                0, 20
            );
            bombsightInput = input;
        }

        // Stats
        const statsItem = createMobileOptionItem(
            localization.translate('Cockpit Cockpit Stats'),
            this.mobileCockpitContent
        );
        const stats = bridge.getCockpitStats(idx);
        const derivedStats = bridge.getCockpitDerivedStats(idx);
        const statsGrid = createMobileStatsGrid(stats, COCKPIT_STATS, derivedStats);
        statsItem.content.appendChild(statsGrid);

        // Store cache
        this.mobileCockpitCache = {
            cockpitIndex: idx,
            typeSelect,
            upgradeChecks,
            safetyChecks,
            gunsightChecks,
            bombsightInput,
            statsGrid
        };
    }

    /**
     * Update values in cached mobile cockpit elements
     */
    private updateMobileCockpitCacheValues(bridge: AircraftBridge, idx: number): void {
        if (!this.mobileCockpitCache) return;

        const cockpitsBindings = bridge.getCockpitsBindings();
        const cockpitOptions = cockpitsBindings.positions[idx];
        const cache = this.mobileCockpitCache;

        // Update type select
        if (cache.typeSelect) {
            cache.typeSelect.selectedIndex = cockpitOptions.selected_type.selected;
            cache.typeSelect.disabled = !cockpitOptions.selected_type.enabled;
            cockpitOptions.selected_type.options.forEach((opt, optIdx) => {
                if (optIdx < cache.typeSelect.options.length) {
                    cache.typeSelect.options[optIdx].disabled = !opt.enabled;
                }
            });
        }

        // Update upgrade checkboxes
        cockpitOptions.selected_upgrades?.forEach((upgrade, upgradeIdx) => {
            if (upgradeIdx < cache.upgradeChecks.length) {
                cache.upgradeChecks[upgradeIdx].checked = upgrade.selected;
                cache.upgradeChecks[upgradeIdx].disabled = !upgrade.enabled;
            }
        });

        // Update safety checkboxes
        cockpitOptions.selected_safety?.forEach((safety, safetyIdx) => {
            if (safetyIdx < cache.safetyChecks.length) {
                cache.safetyChecks[safetyIdx].checked = safety.selected;
                cache.safetyChecks[safetyIdx].disabled = !safety.enabled;
            }
        });

        // Update gunsight checkboxes
        cockpitOptions.selected_gunsights?.forEach((gunsight, gunsightIdx) => {
            if (gunsightIdx < cache.gunsightChecks.length) {
                cache.gunsightChecks[gunsightIdx].checked = gunsight.selected;
                cache.gunsightChecks[gunsightIdx].disabled = !gunsight.enabled;
            }
        });

        // Update bombsight input
        if (cache.bombsightInput) {
            cache.bombsightInput.value = cockpitOptions.bombsight.value.toString();
            cache.bombsightInput.disabled = !cockpitOptions.bombsight.enabled;
        }

        // Update stats grid
        if (cache.statsGrid) {
            const stats = bridge.getCockpitStats(idx);
            const derivedStats = bridge.getCockpitDerivedStats(idx);
            updateMobileStatsGrid(cache.statsGrid, stats, COCKPIT_STATS, derivedStats);
        }
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const cockpitsBindings = bridge.getCockpitsBindings();

        // Update number of cockpits input (desktop and mobile)
        if (this.numCockpitsInput) {
            this.numCockpitsInput.value = cockpitsBindings.num_cockpits.value.toString();
            this.numCockpitsInput.disabled = !cockpitsBindings.num_cockpits.enabled;
        }
        if (this.mobileNumCockpitsInput) {
            this.mobileNumCockpitsInput.value = cockpitsBindings.num_cockpits.value.toString();
            this.mobileNumCockpitsInput.disabled = !cockpitsBindings.num_cockpits.enabled;
        }

        // Update desktop cockpit rows
        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            if (idx < this.cockpitRowCaches.length) {
                this.updateCockpitRow(this.cockpitRowCaches[idx], cockpitOptions, idx, bridge);
            }
        });

        // Update mobile cockpit content (rebuilds current view)
        this.updateMobileCockpitContent();
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
        const typeSelect = createSelectElement(
            cockpitOptions.selected_type,
            (selectedIndex) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_type.selected = selectedIndex;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            }
        );
        optionCell.appendChild(typeSelect);
        row.appendChild(optionCell);

        // Column 2: Upgrades (flex layout)
        const { cell: upgradesCell, flex: upgradesFlex } = createFlexCell();
        const upgradeChecks = createFlexCheckboxes(
            upgradesFlex,
            cockpitOptions.selected_upgrades,
            (idx) => (checked) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_upgrades[idx].selected = checked;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            }
        );
        row.appendChild(upgradesCell);

        // Column 3: Safety Options (flex layout)
        const { cell: safetyCell, flex: safetyFlex } = createFlexCell();
        const safetyChecks = createFlexCheckboxes(
            safetyFlex,
            cockpitOptions.selected_safety,
            (idx) => (checked) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_safety[idx].selected = checked;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            }
        );
        row.appendChild(safetyCell);

        // Column 4: Gunsights + Bombsight (flex layout)
        const { cell: gunsightsCell, flex: gunsightsFlex } = createFlexCell();
        const gunsightChecks = createFlexCheckboxes(
            gunsightsFlex,
            cockpitOptions.selected_gunsights,
            (idx) => (checked) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].selected_gunsights[idx].selected = checked;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            }
        );
        // Add bombsight as number input
        const bombsightInput = createFlexNumberInput(
            cockpitOptions.bombsight,
            gunsightsFlex,
            (value) => {
                const bindings = bridge.getCockpitsBindings();
                bindings.positions[index].bombsight.value = value;
                bridge.setCockpitsBindings(bindings);
                this.onUpdate();
            },
            '0', '20', '1'
        );
        row.appendChild(gunsightsCell);

        // Column 5: Stats (using stats renderer)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        const stats = bridge.getCockpitStats(index);
        const derivedStats = bridge.getCockpitDerivedStats(index);
        const statsTable = createStatsTable(stats, COCKPIT_STATS, derivedStats);
        statsCell.appendChild(statsTable);
        row.appendChild(statsCell);

        return {
            row,
            typeSelect,
            upgradeChecks,
            safetyChecks,
            gunsightChecks,
            bombsightInput,
            statsTable
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
        const stats = bridge.getCockpitStats(index);
        const derivedStats = bridge.getCockpitDerivedStats(index);
        updateStatsTable(cache.statsTable, stats, COCKPIT_STATS, derivedStats);
    }
}
