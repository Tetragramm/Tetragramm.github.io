/**
 * Cockpits UI Component
 *
 * Displays the Cockpits section using UIBindings from Rust
 * Handles multiple cockpit positions with types, upgrades, safety, and gunsights
 *
 * DUAL-CONTROL NOTE
 * -----------------
 * Desktop renders ALL cockpit positions at once in a 5-column table. Mobile
 * renders ONE position at a time behind a prev/next navigator. Because the two
 * layouts emit a different *number* of controls for the same data, the grouped
 * `dual*Into` helpers (which append BOTH a desktop and a mobile node per call)
 * cannot drive this component without changing the mobile DOM. So instead:
 *   - Every per-position field gets ONE shared handler factory (this.*Handler).
 *     Desktop and mobile both wire that exact closure, removing the handler
 *     duplication that the dual-control work targets.
 *   - Desktop controls are collected as Updatable's in `this.controls` and
 *     refreshed via `this.controls.forEach(c => c.update())`.
 *   - The mobile navigator keeps its own per-view cache (only one position is in
 *     the DOM at a time) but builds its nodes with the SAME handler factories.
 * The desktop and mobile DOM are byte-identical to the original.
 */

import { AircraftBridge, CockpitsOptions, CockpitOptions } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexNumberInput,
    createFlexCell,
    createFlexCheckbox,
    createSelectElement,
    updateSelectElement,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    Updatable,
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

// Cache for mobile cockpit elements (only one position is shown at a time)
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
    // Desktop per-position dual controls (refreshed in updateValues via update()).
    private controls: Updatable[] = [];

    // Structural / count fields that shouldUpdate() and the num-cockpits control need.
    private mobileNumCockpitsInput: HTMLInputElement;
    private numCockpitsInput: HTMLInputElement;
    private mainTable: HTMLTableElement;
    private lastCockpitCount: number;

    // Mobile navigation state (one position rendered at a time => own cache).
    private mobileSelectedCockpit: number;
    private mobileCockpitContainer: HTMLDivElement;
    private mobileCockpitContent: HTMLDivElement;
    private mobileCockpitNavLabel: HTMLSpanElement;
    private mobileCockpitCache: MobileCockpitCache | undefined;

    protected shouldUpdate(): boolean {
        // Null-safe: the base constructor triggers the first render() (hence
        // shouldUpdate) before this subclass's field initializers run.
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return false;

        // Structural-change detection: a change in the number of cockpit positions
        // requires a full rebuild (the desktop table gains/loses rows).
        const cockpitsBindings = bridge.getCockpitsBindings();
        const currentCount = cockpitsBindings.positions.length;

        return currentCount === this.lastCockpitCount && this.mainTable !== undefined;
    }

    protected clearCache(): void {
        this.controls = [];
        this.mobileNumCockpitsInput = undefined;
        this.numCockpitsInput = undefined;
        this.mainTable = undefined;
        this.mobileSelectedCockpit = 0;
        this.mobileCockpitContainer = undefined;
        this.mobileCockpitContent = undefined;
        this.mobileCockpitNavLabel = undefined;
        this.mobileCockpitCache = undefined;
    }

    // ------------------------------------------------------------------
    // Shared per-field handlers. Desktop and mobile both wire these exact
    // closures, so each field has ONE change handler. They re-fetch the
    // bindings fresh on every event (closures capture only the indices).
    // ------------------------------------------------------------------
    private typeHandler(bridge: AircraftBridge, idx: number) {
        return (selectedIndex: number) => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[idx].selected_type.selected = selectedIndex;
            bridge.setCockpitsBindings(bindings);
            this.onUpdate();
        };
    }
    private upgradeHandler(bridge: AircraftBridge, idx: number, k: number) {
        return (checked: boolean) => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[idx].selected_upgrades[k].selected = checked;
            bridge.setCockpitsBindings(bindings);
            this.onUpdate();
        };
    }
    private safetyHandler(bridge: AircraftBridge, idx: number, k: number) {
        return (checked: boolean) => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[idx].selected_safety[k].selected = checked;
            bridge.setCockpitsBindings(bindings);
            this.onUpdate();
        };
    }
    private gunsightHandler(bridge: AircraftBridge, idx: number, k: number) {
        return (checked: boolean) => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[idx].selected_gunsights[k].selected = checked;
            bridge.setCockpitsBindings(bindings);
            this.onUpdate();
        };
    }
    private bombsightHandler(bridge: AircraftBridge, idx: number) {
        return (value: number) => {
            const bindings = bridge.getCockpitsBindings();
            bindings.positions[idx].bombsight.value = value;
            bridge.setCockpitsBindings(bindings);
            this.onUpdate();
        };
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

        // Number of cockpits control (simple row above table). This is a
        // structural count input (it triggers a rebuild), NOT a dual control.
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

        // Build each desktop cockpit row, wiring the shared handlers and
        // collecting each control's Updatable into this.controls.
        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            const row = this.buildDesktopCockpitRow(cockpitOptions, idx, bridge);
            this.mainTable!.appendChild(row);
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
    }

    /**
     * Build a single DESKTOP cockpit row. Each field control is built once here
     * and pushed to this.controls as an Updatable that refreshes itself from the
     * fresh bindings (fetched by index) on update().
     */
    private buildDesktopCockpitRow(
        cockpitOptions: CockpitOptions,
        index: number,
        bridge: AircraftBridge
    ): HTMLTableRowElement {
        const row = document.createElement('tr');

        // Column 1: Option (bare select box with no label)
        const optionCell = document.createElement('td');
        const typeSelect = createSelectElement(
            cockpitOptions.selected_type,
            this.typeHandler(bridge, index)
        );
        optionCell.appendChild(typeSelect);
        row.appendChild(optionCell);
        this.controls.push({
            update: () => updateSelectElement(
                typeSelect,
                bridge.getCockpitsBindings().positions[index].selected_type
            ),
        });

        // Column 2: Upgrades (flex layout) — one shared flex per list.
        const { cell: upgradesCell, flex: upgradesFlex } = createFlexCell();
        cockpitOptions.selected_upgrades.forEach((upgrade, k) => {
            const checkbox = createFlexCheckbox(
                upgrade, upgradesFlex, this.upgradeHandler(bridge, index, k)
            );
            this.controls.push({
                update: () => {
                    const b = bridge.getCockpitsBindings().positions[index].selected_upgrades[k];
                    checkbox.checked = b.selected;
                    checkbox.disabled = !b.enabled;
                },
            });
        });
        row.appendChild(upgradesCell);

        // Column 3: Safety Options (flex layout) — one shared flex per list.
        const { cell: safetyCell, flex: safetyFlex } = createFlexCell();
        cockpitOptions.selected_safety.forEach((safety, k) => {
            const checkbox = createFlexCheckbox(
                safety, safetyFlex, this.safetyHandler(bridge, index, k)
            );
            this.controls.push({
                update: () => {
                    const b = bridge.getCockpitsBindings().positions[index].selected_safety[k];
                    checkbox.checked = b.selected;
                    checkbox.disabled = !b.enabled;
                },
            });
        });
        row.appendChild(safetyCell);

        // Column 4: Gunsights + Bombsight (flex layout) — one shared flex.
        const { cell: gunsightsCell, flex: gunsightsFlex } = createFlexCell();
        cockpitOptions.selected_gunsights.forEach((gunsight, k) => {
            const checkbox = createFlexCheckbox(
                gunsight, gunsightsFlex, this.gunsightHandler(bridge, index, k)
            );
            this.controls.push({
                update: () => {
                    const b = bridge.getCockpitsBindings().positions[index].selected_gunsights[k];
                    checkbox.checked = b.selected;
                    checkbox.disabled = !b.enabled;
                },
            });
        });
        // Bombsight number input appended into the same flex (original layout).
        const bombsightInput = createFlexNumberInput(
            cockpitOptions.bombsight,
            gunsightsFlex,
            this.bombsightHandler(bridge, index),
            '0', '20', '1'
        );
        this.controls.push({
            update: () => {
                const b = bridge.getCockpitsBindings().positions[index].bombsight;
                bombsightInput.value = b.value.toString();
                bombsightInput.disabled = !b.enabled;
            },
        });
        row.appendChild(gunsightsCell);

        // Column 5: Stats (using stats renderer)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        const statsTable = createStatsTable(
            bridge.getCockpitStats(index),
            COCKPIT_STATS,
            bridge.getCockpitDerivedStats(index)
        );
        statsCell.appendChild(statsTable);
        row.appendChild(statsCell);
        this.controls.push({
            update: () => updateStatsTable(
                statsTable,
                bridge.getCockpitStats(index),
                COCKPIT_STATS,
                bridge.getCockpitDerivedStats(index)
            ),
        });

        return row;
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
        prevBtn.style.padding = '0.5rem 1rem 1rem 1rem';
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
        nextBtn.style.padding = '0.5rem 1rem 1rem 1rem';
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
     * Build mobile cockpit content and create cache. Wires the SAME shared
     * handler factories as the desktop row, so each field has one handler.
     */
    private buildMobileCockpitContent(bridge: AircraftBridge, idx: number): void {
        this.mobileCockpitContent.innerHTML = '';

        const cockpitsBindings = bridge.getCockpitsBindings();
        const cockpitOptions = cockpitsBindings.positions[idx];

        // Type select
        const typeItem = createMobileOptionItem(
            undefined,
            this.mobileCockpitContent
        );
        const typeSelect = createMobileSelect(
            cockpitOptions.selected_type,
            typeItem.content,
            this.typeHandler(bridge, idx)
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

            cockpitOptions.selected_upgrades.forEach((upgrade, k) => {
                const checkbox = createMobileCheckbox(
                    upgrade,
                    upgradeItem.content,
                    this.upgradeHandler(bridge, idx, k)
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

            cockpitOptions.selected_safety.forEach((safety, k) => {
                const checkbox = createMobileCheckbox(
                    safety,
                    safetyItem.content,
                    this.safetyHandler(bridge, idx, k)
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

            cockpitOptions.selected_gunsights.forEach((gunsight, k) => {
                const checkbox = createMobileCheckbox(
                    gunsight,
                    gunsightItem.content,
                    this.gunsightHandler(bridge, idx, k)
                );
                gunsightChecks.push(checkbox);
            });

            // Bombsight
            const { input } = createMobileNumberInput(
                cockpitOptions.bombsight,
                gunsightItem.content,
                this.bombsightHandler(bridge, idx),
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

        // Refresh all desktop per-position controls.
        this.controls.forEach(c => c.update());

        // Update mobile cockpit content (refreshes the one visible position).
        this.updateMobileCockpitContent();
    }
}
