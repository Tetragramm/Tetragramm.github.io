/**
 * Wings UI Component
 *
 * Displays the Wings section using UIBindings from Rust
 * Complex UI with variable-length wing arrays and extensive stats
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { AIRCRAFT_TYPE } from './aircraft_type_ui';
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
    createFlexNumberInput,
    createMobileOptionItem,
    createMobileSelect,
    createMobileCheckbox,
    createMobileNumberInput,
    createMobileStatsGrid
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
        const aircraftType = bridge.getAircraftType();

        // Create wrapper for both desktop and mobile
        const contentWrapper = document.createElement('div');

        // Desktop version
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';
        const desktopSection = this.createWingsSection(bindings, stats);
        // Extract just the content, we'll wrap it all together
        desktopDiv.appendChild(desktopSection);

        // Mobile version
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';
        this.createMobileWingsSection(bindings, stats, mobileDiv, bridge);

        contentWrapper.appendChild(desktopDiv);
        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section
        this.sectionElement = createCollapsibleSection(
            localization.translate('Wings Section Title'),
            contentWrapper,
            true
        );

        // Add rules link
        const rulesLine = createRulesLink('_Wings');
        rulesLine.appendChild(document.createElement('br'));
        this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

        this.container.appendChild(this.sectionElement);

        // Set initial visibility based on aircraft type
        this.updateVisibility(aircraftType);
    }

    /**
     * Create mobile wings section
     */
    private createMobileWingsSection(bindings: any, stats: any, parent: HTMLElement, bridge: AircraftBridge): void {
        // Global controls
        const globalItem = createMobileOptionItem(
            localization.translate('Wings Wing Options'),
            parent
        );

        // Stagger
        const staggerRow = document.createElement('div');
        staggerRow.style.width = '100%';
        staggerRow.style.marginBottom = '0.5rem';
        const staggerLabel = document.createElement('span');
        staggerLabel.textContent = localization.translate('Wings Wing Stagger') + ': ';
        staggerRow.appendChild(staggerLabel);
        createMobileSelect(
            bindings.stagger,
            staggerRow,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.stagger.selected = selectedIndex;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        globalItem.content.appendChild(staggerRow);

        // Closed and Swept checkboxes
        createMobileCheckbox(bindings.closed, globalItem.content, (selected) => {
            const updatedBindings = this.getBridge().getWingsBindings();
            updatedBindings.closed.selected = selected;
            this.getBridge().setWingsBindings(updatedBindings);
            this.onUpdate();
        });
        createMobileCheckbox(bindings.swept, globalItem.content, (selected) => {
            const updatedBindings = this.getBridge().getWingsBindings();
            updatedBindings.swept.selected = selected;
            this.getBridge().setWingsBindings(updatedBindings);
            this.onUpdate();
        });

        // Full Wings section
        const fullWingsItem = createMobileOptionItem(
            localization.translate('Wings Full Wings'),
            parent
        );

        bindings.full_wings.forEach((wing: any, i: number) => {
            this.createMobileWingRow(wing, i, 'full', fullWingsItem.content, bridge);
        });

        // Add wing button
        if (bindings.add_full_wing.can_add) {
            const addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'mobile-number-btn';
            addBtn.style.width = '100%';
            addBtn.style.marginTop = '0.5rem';
            addBtn.textContent = '+ ' + localization.translate('Wings Add Wing');
            addBtn.onclick = () => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.add_full_wing.deck.selected = 1; // First non-empty option
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            };
            fullWingsItem.content.appendChild(addBtn);
        }

        // Mini Wings section
        const miniWingsItem = createMobileOptionItem(
            localization.translate('Wings Miniature Wings'),
            parent
        );

        bindings.mini_wings.forEach((wing: any, i: number) => {
            this.createMobileWingRow(wing, i, 'mini', miniWingsItem.content, bridge);
        });

        // Add mini wing button
        if (bindings.add_mini_wing.can_add) {
            const addMiniBtn = document.createElement('button');
            addMiniBtn.type = 'button';
            addMiniBtn.className = 'mobile-number-btn';
            addMiniBtn.style.width = '100%';
            addMiniBtn.style.marginTop = '0.5rem';
            addMiniBtn.textContent = '+ ' + localization.translate('Wings Add Wing');
            addMiniBtn.onclick = () => {
                const updatedBindings = this.getBridge().getWingsBindings();
                updatedBindings.add_mini_wing.deck.selected = 1;
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            };
            miniWingsItem.content.appendChild(addMiniBtn);
        }

        // Stats
        const statsItem = createMobileOptionItem(
            localization.translate('Wings Wing Stats'),
            parent
        );
        const statsGrid = createMobileStatsGrid(stats, WINGS_STATS);
        statsItem.content.appendChild(statsGrid);
    }

    /**
     * Create a mobile wing row
     */
    private createMobileWingRow(wing: any, index: number, type: 'full' | 'mini', parent: HTMLElement, bridge: AircraftBridge): void {
        const wingDiv = document.createElement('div');
        wingDiv.className = 'mobile-frame-row';
        wingDiv.style.marginBottom = '0.5rem';

        // Deck select
        const deckRow = document.createElement('div');
        deckRow.style.display = 'flex';
        deckRow.style.gap = '0.25rem';
        deckRow.style.marginBottom = '0.25rem';
        createMobileSelect(
            wing.deck,
            deckRow,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                if (type === 'full') {
                    updatedBindings.full_wings[index].deck.selected = selectedIndex;
                } else {
                    updatedBindings.mini_wings[index].deck.selected = selectedIndex;
                }
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        createMobileSelect(
            wing.skin,
            deckRow,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                if (type === 'full') {
                    updatedBindings.full_wings[index].skin.selected = selectedIndex;
                } else {
                    updatedBindings.mini_wings[index].skin.selected = selectedIndex;
                }
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            }
        );
        wingDiv.appendChild(deckRow);

        // Area and Span inputs
        const inputsRow = document.createElement('div');
        inputsRow.style.display = 'flex';
        inputsRow.style.gap = '0.25rem';
        inputsRow.style.flexWrap = 'wrap';

        createMobileNumberInput(
            { ...wing.area, name: localization.translate('Wings Area') },
            inputsRow,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                if (type === 'full') {
                    updatedBindings.full_wings[index].area.value = value;
                } else {
                    updatedBindings.mini_wings[index].area.value = value;
                }
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            },
            type === 'full' ? 3 : 1,
            type === 'mini' ? 2 : undefined
        );

        createMobileNumberInput(
            { ...wing.span, name: localization.translate('Wings Span') },
            inputsRow,
            (value) => {
                const updatedBindings = this.getBridge().getWingsBindings();
                if (type === 'full') {
                    updatedBindings.full_wings[index].span.value = value;
                } else {
                    updatedBindings.mini_wings[index].span.value = value;
                }
                this.getBridge().setWingsBindings(updatedBindings);
                this.onUpdate();
            },
            1
        );

        wingDiv.appendChild(inputsRow);

        // Full wing specific options
        if (type === 'full') {
            const optionsRow = document.createElement('div');
            optionsRow.style.display = 'flex';
            optionsRow.style.gap = '0.25rem';
            optionsRow.style.flexWrap = 'wrap';
            optionsRow.style.marginTop = '0.25rem';

            // Gull checkbox
            createMobileCheckbox(
                { ...wing.gull, name: localization.translate('Wings Gull') },
                optionsRow,
                (checked) => {
                    const updatedBindings = this.getBridge().getWingsBindings();
                    updatedBindings.full_wings[index].gull.selected = checked;
                    this.getBridge().setWingsBindings(updatedBindings);
                    this.onUpdate();
                }
            );

            // Dihedral/Anhedral
            createMobileNumberInput(
                { ...wing.dihedral, name: localization.translate('Wings Dihedral') },
                optionsRow,
                (value) => {
                    const updatedBindings = this.getBridge().getWingsBindings();
                    updatedBindings.full_wings[index].dihedral.value = value;
                    this.getBridge().setWingsBindings(updatedBindings);
                    this.onUpdate();
                },
                0
            );

            createMobileNumberInput(
                { ...wing.anhedral, name: localization.translate('Wings Anhedral') },
                optionsRow,
                (value) => {
                    const updatedBindings = this.getBridge().getWingsBindings();
                    updatedBindings.full_wings[index].anhedral.value = value;
                    this.getBridge().setWingsBindings(updatedBindings);
                    this.onUpdate();
                },
                0
            );

            wingDiv.appendChild(optionsRow);
        }

        parent.appendChild(wingDiv);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getWingsBindings();
        const stats = bridge.getWingsStats();
        const aircraftType = bridge.getAircraftType();

        // Update visibility first
        this.updateVisibility(aircraftType);

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
     * Update visibility based on aircraft type
     */
    private updateVisibility(aircraftType: number): void {
        const typeNum = Number(aircraftType);
        const showWings = typeNum !== AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = showWings ? '' : 'none';
        }
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
