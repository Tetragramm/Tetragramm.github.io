/**
 * Wings UI Component
 *
 * Displays the Wings section using UIBindings from Rust
 * Complex UI with variable-length wing arrays and extensive stats
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createSelectElement,
    updateSelectElement,
    createCollapsibleSection,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createFlexCheckbox,
    createFlexSection,
    createFlexNumberInputs,
    createFlexNumberInput
} from '../dom_utils';

// Stats configuration for wings
const WINGS_STATS: StatDisplayConfig[] = [
    { key: 'wingarea', label: 'Stat Wing Area', positiveIsGood: true },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Raw Strain', positiveIsGood: true },
    { key: 'crashsafety', label: 'Stat Crash Safety', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true },
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
];

// Cache interface for type safety
interface WingsCache {
    // Global controls
    staggerSelect: HTMLSelectElement;
    closedCheckbox: HTMLInputElement;
    sweptCheckbox: HTMLInputElement;

    // Full wings
    fullWingRows: FullWingRowCache[];
    addFullWingSelect: HTMLSelectElement;

    // Mini wings
    miniWingRows: MiniWingRowCache[];
    addMiniWingSelect: HTMLSelectElement;

    // Stats
    statsTable: HTMLTableElement;
}

interface FullWingRowCache {
    row: HTMLTableRowElement;
    deckSelect: HTMLSelectElement;
    skinSelect: HTMLSelectElement;
    areaInput: HTMLInputElement;
    spanInput: HTMLInputElement;
    gullCheckbox: HTMLInputElement;
    dihedralInput: HTMLInputElement;
    anhedralInput: HTMLInputElement;
}

interface MiniWingRowCache {
    row: HTMLTableRowElement;
    deckSelect: HTMLSelectElement;
    skinSelect: HTMLSelectElement;
    areaInput: HTMLInputElement;
    spanInput: HTMLInputElement;
}

export class WingsUI extends BaseComponentUI {
    private cache: WingsCache = undefined;

    protected shouldUpdate(): boolean {
        return this.cache !== undefined;
    }

    protected clearCache(): void {
        this.cache = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getWingsBindings();
        const stats = bridge.getWingsStats();

        // Create complete Wings section
        this.sectionElement = this.createWingsSection(bindings, stats);
        this.container.appendChild(this.sectionElement);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getWingsBindings();
        const stats = bridge.getWingsStats();

        // Update global controls
        updateSelectElement(this.cache.staggerSelect, bindings.stagger);
        this.cache.closedCheckbox.checked = bindings.closed.selected;
        this.cache.closedCheckbox.disabled = !bindings.closed.enabled;
        this.cache.sweptCheckbox.checked = bindings.swept.selected;
        this.cache.sweptCheckbox.disabled = !bindings.swept.enabled;

        // Check if wings count changed - if so, need full rebuild
        if (bindings.full_wings.length !== this.cache.fullWingRows.length ||
            bindings.mini_wings.length !== this.cache.miniWingRows.length) {
            this.render(true);
            return;
        }

        // Update full wings
        for (let i = 0; i < bindings.full_wings.length; i++) {
            this.updateFullWingRow(this.cache.fullWingRows[i], bindings.full_wings[i]);
        }

        // Update mini wings
        for (let i = 0; i < bindings.mini_wings.length; i++) {
            this.updateMiniWingRow(this.cache.miniWingRows[i], bindings.mini_wings[i]);
        }

        // Update add wing selects
        updateSelectElement(this.cache.addFullWingSelect, bindings.add_full_wing.deck);
        this.cache.addFullWingSelect.disabled = !bindings.add_full_wing.can_add;

        updateSelectElement(this.cache.addMiniWingSelect, bindings.add_mini_wing.deck);
        this.cache.addMiniWingSelect.disabled = !bindings.add_mini_wing.can_add;

        // Update stats
        updateStatsTable(this.cache.statsTable, stats, WINGS_STATS);
    }

    /**
     * Create the complete Wings section
     */
    private createWingsSection(bindings: any, stats: any): HTMLElement {
        const contentDiv = document.createElement('div');

        // Global controls (h4 with stagger select and checkboxes)
        const controlsDiv = document.createElement('h4');

        // Stagger
        const staggerSpan = document.createElement('span');
        const staggerLabel = document.createElement('label');
        staggerLabel.htmlFor = 'wing_stagger_wasm';
        staggerLabel.textContent = localization.translate('Wings Wing Stagger') + ': ';
        staggerSpan.appendChild(staggerLabel);

        const staggerSelect = createSelectElement(
            bindings.stagger,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.stagger.selected = selectedIndex;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate(); // Full rebuild when stagger changes
            }
        );
        staggerSelect.id = 'wing_stagger_wasm';
        staggerSpan.appendChild(staggerSelect);
        controlsDiv.appendChild(staggerSpan);

        // Closed Wing
        const closedSpan = document.createElement('span');
        const closedCheckbox = createFlexCheckbox(bindings.closed, { div1: closedSpan, div2: closedSpan }, (selected) => {
            const updatedBindings = this.getBridge().getWingsBindings();
            updatedBindings.closed.selected = selected;
            this.getBridge().setWingsBindings(updatedBindings);
            this.onUpdate();
        });
        controlsDiv.appendChild(closedSpan);

        // Swept Wing
        const sweptSpan = document.createElement('span');
        const sweptCheckbox = createFlexCheckbox(bindings.swept, { div1: sweptSpan, div2: sweptSpan }, (selected) => {
            const updatedBindings = this.getBridge().getWingsBindings();
            updatedBindings.swept.selected = selected;
            this.getBridge().setWingsBindings(updatedBindings);
            this.onUpdate();
        });
        controlsDiv.appendChild(sweptSpan);

        contentDiv.appendChild(controlsDiv);

        // Wings table
        const table = document.createElement('table');
        table.id = 'wing_table';

        // Header row
        const headerRow = document.createElement('tr');
        const wingTypeHeader = document.createElement('th');
        wingTypeHeader.textContent = localization.translate('Wings Wing Type');
        headerRow.appendChild(wingTypeHeader);

        const wingOptionsHeader = document.createElement('th');
        wingOptionsHeader.textContent = localization.translate('Wings Wing Options');
        headerRow.appendChild(wingOptionsHeader);

        const wingStatsHeader = document.createElement('th');
        wingStatsHeader.textContent = localization.translate('Wings Wing Stats');
        headerRow.appendChild(wingStatsHeader);

        table.appendChild(headerRow);

        // Full Wings row
        const fullWingsLabelRow = document.createElement('tr');
        const fullWingsLabel = document.createElement('th');
        fullWingsLabel.textContent = localization.translate('Wings Full Wings');
        fullWingsLabelRow.appendChild(fullWingsLabel);
        table.appendChild(fullWingsLabelRow);

        // Mini Wings row
        const miniWingsLabelRow = document.createElement('tr');
        const miniWingsLabel = document.createElement('th');
        miniWingsLabel.textContent = localization.translate('Wings Miniature Wings');
        miniWingsLabelRow.appendChild(miniWingsLabel);
        table.appendChild(miniWingsLabelRow);

        const fullWingsOptionsCell = document.createElement('td');
        fullWingsLabelRow.appendChild(fullWingsOptionsCell);

        // Stats cell (spans both full + mini rows)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        statsCell.rowSpan = 2;
        const statsTable = createStatsTable(stats, WINGS_STATS);
        statsCell.appendChild(statsTable);
        fullWingsLabelRow.appendChild(statsCell);

        // Mini wings data row
        const miniWingsOptionsCell = document.createElement('td');
        miniWingsLabelRow.appendChild(miniWingsOptionsCell);

        // Build full wing rows
        const fullWingRows: FullWingRowCache[] = [];
        for (let i = 0; i < bindings.full_wings.length; i++) {
            const rowCache = this.createFullWingRow(bindings.full_wings[i], i, fullWingsOptionsCell);
            fullWingRows.push(rowCache);
        }

        // Add "add full wing" select
        const addFullWingSelect = createSelectElement(
            bindings.add_full_wing.deck,
            (selectedIndex) => {
                if (selectedIndex > 0) { // 0 is "No Wing"
                    const updatedBindings = this.getBridge().getWingsBindings();
                    updatedBindings.add_full_wing.deck.selected = selectedIndex;
                    this.getBridge().setWingsBindings(updatedBindings);
                    this.onUpdate(); // Full rebuild when adding wing
                }
            }
        );
        addFullWingSelect.disabled = !bindings.add_full_wing.can_add;
        fullWingsOptionsCell.appendChild(addFullWingSelect);

        // Build mini wing rows
        const miniWingRows: MiniWingRowCache[] = [];
        for (let i = 0; i < bindings.mini_wings.length; i++) {
            const rowCache = this.createMiniWingRow(bindings.mini_wings[i], i, miniWingsOptionsCell);
            miniWingRows.push(rowCache);
        }

        // Add "add mini wing" select
        const addMiniWingSelect = createSelectElement(
            bindings.add_mini_wing.deck,
            (selectedIndex) => {
                if (selectedIndex > 0) {
                    const updatedBindings = this.getBridge().getWingsBindings();
                    updatedBindings.add_mini_wing.deck.selected = selectedIndex;
                    this.getBridge().setWingsBindings(updatedBindings);
                    this.onUpdate();
                }
            }
        );
        addMiniWingSelect.disabled = !bindings.add_mini_wing.can_add;
        miniWingsOptionsCell.appendChild(addMiniWingSelect);

        contentDiv.appendChild(table);

        // Store cache
        this.cache = {
            staggerSelect,
            closedCheckbox,
            sweptCheckbox,
            fullWingRows,
            addFullWingSelect,
            miniWingRows,
            addMiniWingSelect,
            statsTable,
        };

        // Create collapsible section
        const section = createCollapsibleSection(
            localization.translate('Wings Section Title'),
            contentDiv,
            true
        );

        // Add rules link
        const rulesLine = createRulesLink('_Wings');
        rulesLine.appendChild(document.createElement('br'));
        section.insertBefore(rulesLine, section.children[1]);

        return section;
    }

    /**
     * Create a single full wing row
     */
    private createFullWingRow(
        wingBindings: any,
        index: number,
        optionsCell: HTMLTableCellElement
    ): FullWingRowCache {
        // Wing span (deck select)
        const wingSpan = document.createElement('span');

        const deckSelect = createSelectElement(
            wingBindings.deck,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].deck.selected = selectedIndex;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate(); // Full rebuild when changing deck (might remove wing)
            }
        );
        wingSpan.appendChild(deckSelect);

        const skinSelect = createSelectElement(
            wingBindings.skin,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].skin.selected = selectedIndex;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        wingSpan.appendChild(skinSelect);

        // Options span (area, span, gull, dihedral, anhedral)
        const optionsSpan = document.createElement('span');

        // Create number inputs for area and span
        const flexContainer = { div0: optionsSpan, div1: optionsSpan, div2: optionsSpan };

        // Area input
        const areaBinding = { ...wingBindings.area, name: localization.translate('Wings Area') };
        const areaInput = createFlexNumberInput(areaBinding, flexContainer,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].area.value = value;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        areaInput.min = '3';

        // Span input
        const spanBinding = { ...wingBindings.span, name: localization.translate('Wings Span') };
        const spanInput = createFlexNumberInput(spanBinding, flexContainer,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].span.value = value;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        spanInput.min = '1';

        // Gull checkbox
        const gullBinding = { ...wingBindings.gull, name: localization.translate('Wings Gull') };
        const gullCheckbox = createFlexCheckbox(
            gullBinding,
            flexContainer,
            (checked) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].gull.selected = checked;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Dihedral input
        const dihedralBinding = { ...wingBindings.dihedral, name: localization.translate('Wings Dihedral') };
        const dihedralInput = createFlexNumberInput(dihedralBinding, flexContainer,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].dihedral.value = value;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        dihedralInput.min = '0';
        dihedralInput.max = (wingBindings.span.value - wingBindings.anhedral.value - 1).toString();

        // Anhedral input
        const anhedralBinding = { ...wingBindings.anhedral, name: localization.translate('Wings Anhedral') };
        const anhedralInput = createFlexNumberInput(anhedralBinding, flexContainer,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.full_wings[index].anhedral.value = value;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        anhedralInput.min = '0';
        anhedralInput.max = (wingBindings.span.value - wingBindings.dihedral.value - 1).toString();

        wingSpan.appendChild(optionsSpan);
        wingSpan.appendChild(document.createElement('br'));
        optionsCell.appendChild(wingSpan);

        return {
            row: null!, // Not used
            deckSelect,
            skinSelect,
            areaInput,
            spanInput,
            gullCheckbox,
            dihedralInput,
            anhedralInput,
        };
    }

    /**
     * Create a single mini wing row
     */
    private createMiniWingRow(
        wingBindings: any,
        index: number,
        optionsCell: HTMLTableCellElement
    ): MiniWingRowCache {
        // Wing span (deck select)
        const wingSpan = document.createElement('span');

        const deckSelect = createSelectElement(
            wingBindings.deck,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.mini_wings[index].deck.selected = selectedIndex;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        wingSpan.appendChild(deckSelect);

        const skinSelect = createSelectElement(
            wingBindings.skin,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.mini_wings[index].skin.selected = selectedIndex;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        wingSpan.appendChild(skinSelect);

        // Options span (area and span only)
        const optionsSpan = document.createElement('span');
        const flexContainer = { div0: optionsSpan, div1: optionsSpan, div2: optionsSpan };

        // Area input
        const areaBinding = { ...wingBindings.area, name: localization.translate('Wings Area') };
        const areaInput = createFlexNumberInput(areaBinding, flexContainer,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.mini_wings[index].area.value = value;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        areaInput.min = '1';
        areaInput.max = '2';

        // Span input
        const spanBinding = { ...wingBindings.span, name: localization.translate('Wings Span') };
        const spanInput = createFlexNumberInput(spanBinding, flexContainer,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.mini_wings[index].span.value = value;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        spanInput.min = '1';

        wingSpan.appendChild(optionsSpan);
        wingSpan.appendChild(document.createElement('br'));
        optionsCell.appendChild(wingSpan);

        return {
            row: null!, // Not used
            deckSelect,
            skinSelect,
            areaInput,
            spanInput,
        };
    }

    /**
     * Update a full wing row
     */
    private updateFullWingRow(rowCache: FullWingRowCache, wingBindings: any): void {
        updateSelectElement(rowCache.deckSelect, wingBindings.deck);
        updateSelectElement(rowCache.skinSelect, wingBindings.skin);

        rowCache.areaInput.valueAsNumber = wingBindings.area.value;
        rowCache.spanInput.valueAsNumber = wingBindings.span.value;

        rowCache.gullCheckbox.checked = wingBindings.gull.selected;
        rowCache.gullCheckbox.disabled = !wingBindings.gull.enabled;

        rowCache.dihedralInput.valueAsNumber = wingBindings.dihedral.value;
        rowCache.dihedralInput.max = (wingBindings.span.value - wingBindings.anhedral.value - 1).toString();

        rowCache.anhedralInput.valueAsNumber = wingBindings.anhedral.value;
        rowCache.anhedralInput.max = (wingBindings.span.value - wingBindings.dihedral.value - 1).toString();
    }

    /**
     * Update a mini wing row
     */
    private updateMiniWingRow(rowCache: MiniWingRowCache, wingBindings: any): void {
        updateSelectElement(rowCache.deckSelect, wingBindings.deck);
        updateSelectElement(rowCache.skinSelect, wingBindings.skin);

        rowCache.areaInput.valueAsNumber = wingBindings.area.value;
        rowCache.spanInput.valueAsNumber = wingBindings.span.value;
    }
}
