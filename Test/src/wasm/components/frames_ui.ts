/**
 * Frames + Tail UI Component
 *
 * Displays the Frames and Tail sections using UIBindings from Rust
 * Complex UI with variable-length section arrays and extensive stats
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
    createMobileNumberInput,
    createMobileOptionItem,
    createMobileCheckbox,
    createMobileSelect,
    createMobileStatsGrid,
    updateMobileStatsGrid,
    isMobileView
} from '../dom_utils';

// Stats configuration for the combined frames + tail stats table
const FRAMES_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'toughness', label: 'Stat Toughness', positiveIsGood: true },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true },
    { key: 'wingarea', label: 'Stat Wing Area', positiveIsGood: true },
    { key: 'flammable', label: 'Derived Is Flammable Question', isDerived: false },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Raw Strain', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: '', label: '' }, // Empty cell
];

// Cache interface for type safety
interface FramesCache {
    // Frames section elements
    allFrameSelect: HTMLSelectElement;
    allSkinSelect: HTMLSelectElement;
    sectionRows: SectionRowCache[];
    statsTable: HTMLTableElement;
    framesTableBody: HTMLTableElement; // Container for dynamic rows

    // Tail section elements
    tailTypeSelect: HTMLSelectElement;
    farmanCheckbox: HTMLInputElement;
    boomCheckbox: HTMLInputElement;
    flyingWingCheckbox: HTMLInputElement;
    tailSectionRows: TailSectionRowCache[];

    // Mobile stats grid
    mobileStatsGrid?: HTMLDivElement;

    // Mobile controls
    mobileFlyingWingCheckbox?: HTMLInputElement;
    mobileAllFrameSelect?: HTMLSelectElement;
    mobileAllSkinSelect?: HTMLSelectElement;
    mobileSectionRows?: MobileSectionRowCache[];
    mobileTailTypeSelect?: HTMLSelectElement;
    mobileFarmanCheckbox?: HTMLInputElement;
    mobileBoomCheckbox?: HTMLInputElement;
    mobileTailSectionRows?: MobileTailSectionRowCache[];
}

interface SectionRowCache {
    row: HTMLTableRowElement;
    frameSelect: HTMLSelectElement;
    skinLabel: HTMLLabelElement;
    geodesicCheckbox: HTMLInputElement;
    monocoqueCheckbox: HTMLInputElement;
    internalBracingCheckbox: HTMLInputElement;
    liftingBodyCheckbox: HTMLInputElement;
    addButton: HTMLButtonElement;
    removeButton: HTMLButtonElement;
}

interface TailSectionRowCache {
    row: HTMLTableRowElement;
    frameSelect: HTMLSelectElement;
    skinLabel: HTMLLabelElement;
    geodesicCheckbox: HTMLInputElement;
    monocoqueCheckbox: HTMLInputElement;
    liftingBodyCheckbox: HTMLInputElement;
}

// Mobile section row cache
interface MobileSectionRowCache {
    frameSelect: HTMLSelectElement;
    skinLabel: HTMLElement;
    geodesicCheckbox: HTMLInputElement;
    monocoqueCheckbox: HTMLInputElement;
    internalBracingCheckbox: HTMLInputElement;
    liftingBodyCheckbox: HTMLInputElement;
    addButton: HTMLButtonElement;
    removeButton: HTMLButtonElement;
}

// Mobile tail section row cache
interface MobileTailSectionRowCache {
    frameSelect: HTMLSelectElement;
    skinLabel: HTMLElement;
    geodesicCheckbox: HTMLInputElement;
    monocoqueCheckbox: HTMLInputElement;
    liftingBodyCheckbox: HTMLInputElement;
}

export class FramesUI extends BaseComponentUI {
    private cache: FramesCache;
    private framesSectionElement: HTMLElement;
    private tailSectionElement: HTMLElement;

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

        const bindings = bridge.getFramesBindings();
        const stats = bridge.getFramesStats();
        const derived = { flammable: bridge.getFramesFlammable() };

        // Build desktop Frames section
        const desktopWrapper = document.createElement('div');
        desktopWrapper.className = 'desktop-only';
        this.framesSectionElement = this.createFramesSection(bindings, stats, derived);
        desktopWrapper.appendChild(this.framesSectionElement);
        desktopWrapper.appendChild(document.createElement('br'));
        this.tailSectionElement = this.createTailSection(bindings, this.cache.framesTableBody);
        desktopWrapper.appendChild(this.tailSectionElement);
        this.container.appendChild(desktopWrapper);

        // Build mobile Frames section
        const mobileWrapper = document.createElement('div');
        mobileWrapper.className = 'mobile-only';
        this.createMobileFramesSection(bindings, stats, derived, mobileWrapper);
        this.container.appendChild(mobileWrapper);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getFramesBindings();
        const stats = bridge.getFramesStats();
        const derived = { flammable: bridge.getFramesFlammable() };

        // Update frames section
        this.updateFramesSection(bindings, stats, derived);

        // Update tail section
        this.updateTailSection(bindings);
    }

    /**
     * Create the complete Frames section
     */
    private createFramesSection(bindings: any, stats: any, derived: any): HTMLElement {
        const contentDiv = document.createElement('div');

        // Flying Wing
        const flyingWingSpan = document.createElement('span');
        const flyingWingLabel = document.createElement('label');
        flyingWingLabel.htmlFor = 'flying_wing_wasm';
        flyingWingLabel.textContent = ' ' + localization.translate('Frames Flying Wing') + ': ';
        flyingWingSpan.appendChild(flyingWingLabel);

        const flyingWingCheckbox = document.createElement('input');
        flyingWingCheckbox.type = 'checkbox';
        flyingWingCheckbox.id = 'flying_wing_wasm';
        flyingWingCheckbox.checked = bindings.flying_wing.selected;
        flyingWingCheckbox.disabled = !bindings.flying_wing.enabled;
        flyingWingCheckbox.onchange = () => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.flying_wing.selected = flyingWingCheckbox.checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        };
        flyingWingSpan.appendChild(flyingWingCheckbox);
        contentDiv.appendChild(flyingWingSpan);

        // Create frames table
        const table = document.createElement('table');
        table.id = 'table_frames';

        // Header row with "Apply to All" selects
        const headerRow = document.createElement('tr');

        // Frame Type header with select
        const frameTypeHeader = document.createElement('th');
        frameTypeHeader.textContent = localization.translate('Frames Frame Type');
        frameTypeHeader.appendChild(document.createElement('br'));
        const allFrameSelect = createSelectElement(
            bindings.all_frame,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.all_frame.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        allFrameSelect.selectedIndex = -1; // No selection by default
        frameTypeHeader.appendChild(allFrameSelect);
        headerRow.appendChild(frameTypeHeader);

        // Skin Type header with select
        const skinTypeHeader = document.createElement('th');
        skinTypeHeader.textContent = localization.translate('Frames Skin Type');
        skinTypeHeader.appendChild(document.createElement('br'));
        const allSkinSelect = createSelectElement(
            bindings.all_skin,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.all_skin.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        skinTypeHeader.appendChild(allSkinSelect);
        headerRow.appendChild(skinTypeHeader);

        // Frame Options header
        const optionsHeader = document.createElement('th');
        optionsHeader.textContent = localization.translate('Frames Frame Options');
        headerRow.appendChild(optionsHeader);

        // Frame Stats header
        const statsHeader = document.createElement('th');
        statsHeader.textContent = localization.translate('Frames Frame Stats');
        headerRow.appendChild(statsHeader);

        table.appendChild(headerRow);

        // Data row with sections + stats
        const dataRow = document.createElement('tr');

        // Frame column (contains all section frame selects)
        const frameCell = document.createElement('td');
        dataRow.appendChild(frameCell);

        // Skin column (contains all section skin labels)
        const skinCell = document.createElement('td');
        dataRow.appendChild(skinCell);

        // Options column (contains 4 sub-columns for each checkbox type)
        const optionsCell = document.createElement('td');

        dataRow.appendChild(optionsCell);

        // Stats column (spans all rows, contains stats table)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        statsCell.rowSpan = 3; // Spans header + data + tail header

        const statsTable = createStatsTable(stats, FRAMES_STATS, derived);
        statsCell.appendChild(statsTable);
        dataRow.appendChild(statsCell);

        table.appendChild(dataRow);

        // Build section rows
        const sectionRows: SectionRowCache[] = [];
        for (let i = 0; i < bindings.sections.length; i++) {
            const sectionCache = this.createSectionRow(
                bindings.sections[i],
                i,
                frameCell,
                skinCell,
                optionsCell,
            );
            sectionRows.push(sectionCache);
        }

        contentDiv.appendChild(table);

        // Store cache
        if (!this.cache) {
            this.cache = {
                allFrameSelect,
                allSkinSelect,
                sectionRows,
                statsTable,
                framesTableBody: table,
                tailTypeSelect: null!,
                farmanCheckbox: null!,
                boomCheckbox: null!,
                flyingWingCheckbox,
                tailSectionRows: [],

            };
        } else {
            this.cache.allFrameSelect = allFrameSelect;
            this.cache.allSkinSelect = allSkinSelect;
            this.cache.sectionRows = sectionRows;
            this.cache.statsTable = statsTable;
            this.cache.framesTableBody = table;
            this.cache.flyingWingCheckbox = flyingWingCheckbox;
        }

        // Create collapsible section
        const section = createCollapsibleSection(
            localization.translate('Frames Frames and Covering'),
            contentDiv,
            true
        );

        // Add rules link using utility function
        const rulesLine = createRulesLink('_Frames');
        rulesLine.appendChild(document.createElement('br'));
        section.insertBefore(
            rulesLine,
            section.children[1]
        );

        return section;
    }

    /**
     * Create a single section row
     */
    private createSectionRow(
        sectionBindings: any,
        index: number,
        frameCell: HTMLTableCellElement,
        skinCell: HTMLTableCellElement,
        optionCell: HTMLTableCellElement,
    ): SectionRowCache {
        // Frame span with +/- buttons and select
        const frameSpan = document.createElement('span');

        const removeButton = document.createElement('button');
        removeButton.textContent = '-';
        removeButton.onclick = () => {
            this.getBridge().deleteSection(index);
            this.render(true); // Full rebuild needed for section removal
        };
        frameSpan.appendChild(removeButton);

        const addButton = document.createElement('button');
        addButton.textContent = '+';
        addButton.onclick = () => {
            this.getBridge().duplicateSection(index);
            this.render(true); // Full rebuild needed for section addition
        };
        frameSpan.appendChild(addButton);
        addButton.disabled = !sectionBindings.can_add;
        removeButton.disabled = !sectionBindings.can_remove;

        const frameSelect = createSelectElement(
            sectionBindings.frame,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.sections[index].frame.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        frameSpan.appendChild(frameSelect);
        frameSpan.appendChild(document.createElement('br'));
        frameCell.appendChild(frameSpan);

        // Skin label
        const skinSpan = document.createElement('span');
        const skinLabel = document.createElement('label');
        skinLabel.textContent = this.getSkinNameForSection(sectionBindings);
        skinSpan.appendChild(skinLabel);
        skinSpan.appendChild(document.createElement('br'));
        skinCell.appendChild(skinSpan);

        // Create checkboxes and add each to its own column
        const rowDiv = document.createElement('div');
        const rowSpan = document.createElement('span');

        // Geodesic checkbox -> geodesicColumn
        const geodesicBinding = { ...sectionBindings.geodesic, name: localization.translate('Frames Geodesic') };
        const geodesicCheckbox = createFlexCheckbox(
            geodesicBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.sections[index].geodesic.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Monocoque checkbox -> monocoqueColumn
        const monocoqueBinding = { ...sectionBindings.monocoque, name: localization.translate('Frames Monocoque') };
        const monocoqueCheckbox = createFlexCheckbox(
            monocoqueBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.sections[index].monocoque.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Internal Bracing checkbox -> internalBracingColumn
        const internalBracingBinding = { ...sectionBindings.internal_bracing, name: localization.translate('Frames Internal Bracing') };
        const internalBracingCheckbox = createFlexCheckbox(
            internalBracingBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.sections[index].internal_bracing.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Lifting Body checkbox -> liftingBodyColumn
        const liftingBodyBinding = { ...sectionBindings.lifting_body, name: localization.translate('Frames Lifting Body') };
        const liftingBodyCheckbox = createFlexCheckbox(
            liftingBodyBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.sections[index].lifting_body.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        rowDiv.appendChild(rowSpan);
        optionCell.appendChild(rowDiv);

        return {
            row: null!, // Not using row for this layout
            frameSelect,
            skinLabel,
            geodesicCheckbox,
            monocoqueCheckbox,
            internalBracingCheckbox,
            liftingBodyCheckbox,
            addButton,
            removeButton,
        };
    }

    /**
     * Get skin name for a section (handles internal bracing -> "No Skin")
     */
    private getSkinNameForSection(sectionBindings: any): string {
        const bridge = this.getBridge();
        const bindings = bridge.getFramesBindings();

        if (sectionBindings.internal_bracing.selected) {
            return localization.translate('Frames No Skin');
        } else {
            const skinIndex = bindings.all_skin.selected;
            if (skinIndex < bindings.all_skin.options.length) {
                return bindings.all_skin.options[skinIndex].name;
            }
            return '';
        }
    }

    /**
     * Create the complete Tail section
     */
    private createTailSection(bindings: any, tailTable: HTMLTableElement): HTMLElement {
        const contentDiv = document.createElement('div');

        // Tail controls (h4 with selects and checkboxes)
        const controlsDiv = document.createElement('h4');

        // Tail Length
        const tailLengthSpan = document.createElement('span');
        const tailLengthLabel = document.createElement('label');
        tailLengthLabel.htmlFor = 'tail_type_wasm';
        tailLengthLabel.textContent = localization.translate('Frames Tail Type') + ': ';
        tailLengthSpan.appendChild(tailLengthLabel);

        const tailTypeSelect = createSelectElement(
            bindings.tail_type,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_type.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.render(true); // Full rebuild needed when tail type changes
            }
        );
        tailTypeSelect.id = 'tail_type_wasm';
        tailLengthSpan.appendChild(tailTypeSelect);
        controlsDiv.appendChild(tailLengthSpan);

        // Farman Tail
        const farmanSpan = document.createElement('span');
        const farmanLabel = document.createElement('label');
        farmanLabel.htmlFor = 'tail_farman_wasm';
        farmanLabel.textContent = ' ' + localization.translate('Frames Tail Farman') + ': ';
        farmanSpan.appendChild(farmanLabel);

        const farmanCheckbox = document.createElement('input');
        farmanCheckbox.type = 'checkbox';
        farmanCheckbox.id = 'tail_farman_wasm';
        farmanCheckbox.checked = bindings.farman.selected;
        farmanCheckbox.disabled = !bindings.farman.enabled;
        farmanCheckbox.onchange = () => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.farman.selected = farmanCheckbox.checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        };
        farmanSpan.appendChild(farmanCheckbox);
        controlsDiv.appendChild(farmanSpan);

        // Boom Tail
        const boomSpan = document.createElement('span');
        const boomLabel = document.createElement('label');
        boomLabel.htmlFor = 'tail_boom_wasm';
        boomLabel.textContent = ' ' + localization.translate('Frames Tail Boom') + ': ';
        boomSpan.appendChild(boomLabel);

        const boomCheckbox = document.createElement('input');
        boomCheckbox.type = 'checkbox';
        boomCheckbox.id = 'tail_boom_wasm';
        boomCheckbox.checked = bindings.boom.selected;
        boomCheckbox.disabled = !bindings.boom.enabled;
        boomCheckbox.onchange = () => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.boom.selected = boomCheckbox.checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        };
        boomSpan.appendChild(boomCheckbox);
        controlsDiv.appendChild(boomSpan);

        contentDiv.appendChild(controlsDiv);

        // Tail sections table (if any tail sections exist)
        if (bindings.tail_sections && bindings.tail_sections.length > 0) {
            // Header row
            const tailHeaderRow = document.createElement('tr');
            const tailFrameHeader = document.createElement('th');
            tailFrameHeader.textContent = localization.translate('Frames Tail Frame Type');
            tailHeaderRow.appendChild(tailFrameHeader);

            const tailSkinHeader = document.createElement('th');
            tailSkinHeader.textContent = localization.translate('Frames Tail Skin Type');
            tailHeaderRow.appendChild(tailSkinHeader);

            const tailOptionsHeader = document.createElement('th');
            tailOptionsHeader.textContent = localization.translate('Frames Tail Frame Options');
            tailHeaderRow.appendChild(tailOptionsHeader);

            tailTable.appendChild(tailHeaderRow);

            // Data row
            const tailDataRow = document.createElement('tr');

            const tailFrameCell = document.createElement('td');
            tailDataRow.appendChild(tailFrameCell);

            const tailSkinCell = document.createElement('td');
            tailDataRow.appendChild(tailSkinCell);

            const tailOptionsCell = document.createElement('td');

            tailDataRow.appendChild(tailOptionsCell);

            tailTable.appendChild(tailDataRow);

            // Build tail section rows
            const tailSectionRows: TailSectionRowCache[] = [];
            for (let i = 0; i < bindings.tail_sections.length; i++) {
                const tailSectionCache = this.createTailSectionRow(
                    bindings.tail_sections[i],
                    bindings,
                    i,
                    tailFrameCell,
                    tailSkinCell,
                    tailOptionsCell
                );
                tailSectionRows.push(tailSectionCache);
            }

            // Update cache with tail elements
            if (this.cache) {
                this.cache.tailTypeSelect = tailTypeSelect;
                this.cache.farmanCheckbox = farmanCheckbox;
                this.cache.boomCheckbox = boomCheckbox;
                this.cache.tailSectionRows = tailSectionRows;
            }
        } else {
            // No tail sections, just store the controls
            if (this.cache) {
                this.cache.tailTypeSelect = tailTypeSelect;
                this.cache.farmanCheckbox = farmanCheckbox;
                this.cache.boomCheckbox = boomCheckbox;
                this.cache.tailSectionRows = [];
            }
        }

        // Create collapsible section
        const section = createCollapsibleSection(
            localization.translate('Frames Tail Section Title'),
            contentDiv,
            true
        );

        // Add rules link
        const rulesLine = createRulesLink('_Tail');
        rulesLine.appendChild(document.createElement('br'));
        section.insertBefore(rulesLine, section.children[1]);

        return section;
    }

    /**
     * Create a single tail section row
     */
    private createTailSectionRow(
        tailSectionBindings: any,
        bindings: any,
        index: number,
        frameCell: HTMLTableCellElement,
        skinCell: HTMLTableCellElement,
        tailOptionsCell: HTMLTableCellElement,
    ): TailSectionRowCache {
        // Frame span with select
        const frameSpan = document.createElement('span');
        const frameSelect = createSelectElement(
            tailSectionBindings.frame,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_sections[index].frame.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        frameSpan.appendChild(frameSelect);
        frameSpan.appendChild(document.createElement('br'));
        frameCell.appendChild(frameSpan);

        // Skin label
        const skinSpan = document.createElement('span');
        const skinLabel = document.createElement('label');
        skinLabel.textContent = this.getSkinNameForTailSection(bindings);
        skinSpan.appendChild(skinLabel);
        skinSpan.appendChild(document.createElement('br'));
        skinCell.appendChild(skinSpan);

        const rowDiv = document.createElement('div');
        const rowSpan = document.createElement('span');
        // Geodesic checkbox -> geodesicColumn
        const geodesicBinding = { ...tailSectionBindings.geodesic, name: localization.translate('Frames Geodesic') };
        const geodesicCheckbox = createFlexCheckbox(
            geodesicBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_sections[index].geodesic.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Monocoque checkbox -> monocoqueColumn
        const monocoqueBinding = { ...tailSectionBindings.monocoque, name: localization.translate('Frames Monocoque') };
        const monocoqueCheckbox = createFlexCheckbox(
            monocoqueBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_sections[index].monocoque.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Lifting Body checkbox -> liftingBodyColumn
        const liftingBodyBinding = { ...tailSectionBindings.lifting_body, name: localization.translate('Frames Lifting Body') };
        const liftingBodyCheckbox = createFlexCheckbox(
            liftingBodyBinding,
            { div1: rowSpan, div2: rowSpan },
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_sections[index].lifting_body.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        rowDiv.appendChild(rowSpan);
        tailOptionsCell.appendChild(rowDiv);

        return {
            row: null!, // Not using row for this layout
            frameSelect,
            skinLabel,
            geodesicCheckbox,
            monocoqueCheckbox,
            liftingBodyCheckbox,
        };
    }

    /**
     * Get skin name for a tail section (handles farman -> "No Skin")
     */
    private getSkinNameForTailSection(bindings: any): string {
        if (bindings.farman.selected) {
            return bindings.all_skin.options[0].name; // Farman uses first skin (wire)
        } else {
            const skinIndex = bindings.all_skin.selected;
            if (skinIndex < bindings.all_skin.options.length) {
                return bindings.all_skin.options[skinIndex].name;
            }
            return '';
        }
    }

    /**
     * Update the Frames section values
     */
    private updateFramesSection(bindings: any, stats: any, derived: any): void {
        if (!this.cache) return;

        // Update "apply to all" selects (desktop)
        updateSelectElement(this.cache.allFrameSelect, bindings.all_frame);
        this.cache.allFrameSelect.selectedIndex = -1; // Reset to "no selection"
        updateSelectElement(this.cache.allSkinSelect, bindings.all_skin);

        // Update "apply to all" selects (mobile)
        if (this.cache.mobileAllFrameSelect) {
            updateSelectElement(this.cache.mobileAllFrameSelect, bindings.all_frame);
            this.cache.mobileAllFrameSelect.selectedIndex = -1;
        }
        if (this.cache.mobileAllSkinSelect) {
            updateSelectElement(this.cache.mobileAllSkinSelect, bindings.all_skin);
        }

        // Check if sections count changed - if so, need full rebuild
        if (bindings.sections.length !== this.cache.sectionRows.length) {
            this.render(true);
            return;
        }

        // Update each section (desktop)
        for (let i = 0; i < bindings.sections.length; i++) {
            const sectionBindings = bindings.sections[i];
            const sectionCache = this.cache.sectionRows[i];

            updateSelectElement(sectionCache.frameSelect, sectionBindings.frame);

            sectionCache.skinLabel.textContent = this.getSkinNameForSection(sectionBindings);

            sectionCache.geodesicCheckbox.checked = sectionBindings.geodesic.selected;
            sectionCache.geodesicCheckbox.disabled = !sectionBindings.geodesic.enabled;

            sectionCache.monocoqueCheckbox.checked = sectionBindings.monocoque.selected;
            sectionCache.monocoqueCheckbox.disabled = !sectionBindings.monocoque.enabled;

            sectionCache.internalBracingCheckbox.checked = sectionBindings.internal_bracing.selected;
            sectionCache.internalBracingCheckbox.disabled = !sectionBindings.internal_bracing.enabled;

            sectionCache.liftingBodyCheckbox.checked = sectionBindings.lifting_body.selected;
            sectionCache.liftingBodyCheckbox.disabled = !sectionBindings.lifting_body.enabled;

            sectionCache.addButton.disabled = !sectionBindings.can_add;
            sectionCache.removeButton.disabled = !sectionBindings.can_remove;
        }

        // Update each section (mobile)
        if (this.cache.mobileSectionRows) {
            for (let i = 0; i < bindings.sections.length && i < this.cache.mobileSectionRows.length; i++) {
                const sectionBindings = bindings.sections[i];
                const mobileCache = this.cache.mobileSectionRows[i];

                updateSelectElement(mobileCache.frameSelect, sectionBindings.frame);

                mobileCache.skinLabel.textContent = localization.translate('Frames Skin Type') + ': ' + this.getSkinNameForSection(sectionBindings);

                mobileCache.geodesicCheckbox.checked = sectionBindings.geodesic.selected;
                mobileCache.geodesicCheckbox.disabled = !sectionBindings.geodesic.enabled;

                mobileCache.monocoqueCheckbox.checked = sectionBindings.monocoque.selected;
                mobileCache.monocoqueCheckbox.disabled = !sectionBindings.monocoque.enabled;

                mobileCache.internalBracingCheckbox.checked = sectionBindings.internal_bracing.selected;
                mobileCache.internalBracingCheckbox.disabled = !sectionBindings.internal_bracing.enabled;

                mobileCache.liftingBodyCheckbox.checked = sectionBindings.lifting_body.selected;
                mobileCache.liftingBodyCheckbox.disabled = !sectionBindings.lifting_body.enabled;

                mobileCache.addButton.disabled = !sectionBindings.can_add;
                mobileCache.removeButton.disabled = !sectionBindings.can_remove;
            }
        }

        // Update stats table
        updateStatsTable(this.cache.statsTable, stats, FRAMES_STATS, derived);

        // Update mobile stats grid
        if (this.cache.mobileStatsGrid) {
            updateMobileStatsGrid(this.cache.mobileStatsGrid, stats, FRAMES_STATS, derived);
        }
    }

    /**
     * Update the Tail section values
     */
    private updateTailSection(bindings: any): void {
        if (!this.cache) return;

        // Update tail controls (desktop)
        updateSelectElement(this.cache.tailTypeSelect, bindings.tail_type);

        this.cache.farmanCheckbox.checked = bindings.farman.selected;
        this.cache.farmanCheckbox.disabled = !bindings.farman.enabled;

        this.cache.boomCheckbox.checked = bindings.boom.selected;
        this.cache.boomCheckbox.disabled = !bindings.boom.enabled;

        this.cache.flyingWingCheckbox.checked = bindings.flying_wing.selected;
        this.cache.flyingWingCheckbox.disabled = !bindings.flying_wing.enabled;

        // Update tail controls (mobile)
        if (this.cache.mobileTailTypeSelect) {
            updateSelectElement(this.cache.mobileTailTypeSelect, bindings.tail_type);
        }
        if (this.cache.mobileFarmanCheckbox) {
            this.cache.mobileFarmanCheckbox.checked = bindings.farman.selected;
            this.cache.mobileFarmanCheckbox.disabled = !bindings.farman.enabled;
        }
        if (this.cache.mobileBoomCheckbox) {
            this.cache.mobileBoomCheckbox.checked = bindings.boom.selected;
            this.cache.mobileBoomCheckbox.disabled = !bindings.boom.enabled;
        }
        if (this.cache.mobileFlyingWingCheckbox) {
            this.cache.mobileFlyingWingCheckbox.checked = bindings.flying_wing.selected;
            this.cache.mobileFlyingWingCheckbox.disabled = !bindings.flying_wing.enabled;
        }

        // Check if tail sections count changed - if so, need full rebuild
        if (bindings.tail_sections.length !== this.cache.tailSectionRows.length) {
            this.render(true);
            return;
        }

        // Update each tail section (desktop)
        for (let i = 0; i < bindings.tail_sections.length; i++) {
            const tailSectionBindings = bindings.tail_sections[i];
            const tailSectionCache = this.cache.tailSectionRows[i];

            updateSelectElement(tailSectionCache.frameSelect, tailSectionBindings.frame);

            tailSectionCache.skinLabel.textContent = this.getSkinNameForTailSection(bindings);

            tailSectionCache.geodesicCheckbox.checked = tailSectionBindings.geodesic.selected;
            tailSectionCache.geodesicCheckbox.disabled = !tailSectionBindings.geodesic.enabled;

            tailSectionCache.monocoqueCheckbox.checked = tailSectionBindings.monocoque.selected;
            tailSectionCache.monocoqueCheckbox.disabled = !tailSectionBindings.monocoque.enabled;

            tailSectionCache.liftingBodyCheckbox.checked = tailSectionBindings.lifting_body.selected;
            tailSectionCache.liftingBodyCheckbox.disabled = !tailSectionBindings.lifting_body.enabled;
        }

        // Update each tail section (mobile)
        if (this.cache.mobileTailSectionRows) {
            for (let i = 0; i < bindings.tail_sections.length && i < this.cache.mobileTailSectionRows.length; i++) {
                const tailSectionBindings = bindings.tail_sections[i];
                const mobileCache = this.cache.mobileTailSectionRows[i];

                updateSelectElement(mobileCache.frameSelect, tailSectionBindings.frame);

                mobileCache.skinLabel.textContent = localization.translate('Frames Skin Type') + ': ' + this.getSkinNameForTailSection(bindings);

                mobileCache.geodesicCheckbox.checked = tailSectionBindings.geodesic.selected;
                mobileCache.geodesicCheckbox.disabled = !tailSectionBindings.geodesic.enabled;

                mobileCache.monocoqueCheckbox.checked = tailSectionBindings.monocoque.selected;
                mobileCache.monocoqueCheckbox.disabled = !tailSectionBindings.monocoque.enabled;

                mobileCache.liftingBodyCheckbox.checked = tailSectionBindings.lifting_body.selected;
                mobileCache.liftingBodyCheckbox.disabled = !tailSectionBindings.lifting_body.enabled;
            }
        }
    }

    /**
     * Create mobile-friendly frames section
     */
    private createMobileFramesSection(bindings: any, stats: any, derived: any, parent: HTMLElement): void {
        const contentDiv = document.createElement('div');
        contentDiv.className = 'mobile-option-group';

        // Flying Wing checkbox
        const flyingWingItem = createMobileOptionItem(
            '',
            contentDiv
        );
        const mobileFlyingWingCheckbox = createMobileCheckbox(
            { name: localization.translate('Frames Flying Wing'), selected: bindings.flying_wing.selected, enabled: bindings.flying_wing.enabled },
            flyingWingItem.content,
            (checked) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.flying_wing.selected = checked;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Frame Type selector (apply to all)
        const frameTypeItem = createMobileOptionItem(
            localization.translate('Frames Frame Type'),
            contentDiv
        );
        const mobileAllFrameSelect = createMobileSelect(
            bindings.all_frame,
            frameTypeItem.content,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.all_frame.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        mobileAllFrameSelect.selectedIndex = -1;

        // Skin Type selector (apply to all)
        const skinTypeItem = createMobileOptionItem(
            localization.translate('Frames Skin Type'),
            contentDiv
        );
        const mobileAllSkinSelect = createMobileSelect(
            bindings.all_skin,
            skinTypeItem.content,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.all_skin.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Fuselage Frames section
        const fuselageTitle = document.createElement('div');
        fuselageTitle.className = 'mobile-option-title';
        fuselageTitle.style.marginTop = '1rem';
        fuselageTitle.textContent = localization.translate('Frames Fuselage Frames');
        contentDiv.appendChild(fuselageTitle);

        // Each fuselage section
        const mobileSectionRows: MobileSectionRowCache[] = [];
        for (let i = 0; i < bindings.sections.length; i++) {
            const rowCache = this.createMobileSectionRow(bindings.sections[i], i, contentDiv, bindings);
            mobileSectionRows.push(rowCache);
        }

        // Tail section title
        const tailTitle = document.createElement('div');
        tailTitle.className = 'mobile-option-title';
        tailTitle.style.marginTop = '1rem';
        tailTitle.textContent = localization.translate('Frames Tail Section Title');
        contentDiv.appendChild(tailTitle);

        // Tail type selector
        const tailTypeItem = createMobileOptionItem(
            localization.translate('Frames Tail Type'),
            contentDiv
        );
        const mobileTailTypeSelect = createMobileSelect(
            bindings.tail_type,
            tailTypeItem.content,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_type.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.render(true);
            }
        );

        // Farman checkbox
        const farmanItem = createMobileOptionItem(
            localization.translate('Frames Tail Farman'),
            contentDiv
        );
        const mobileFarmanCheckbox = document.createElement('input');
        mobileFarmanCheckbox.type = 'checkbox';
        mobileFarmanCheckbox.checked = bindings.farman.selected;
        mobileFarmanCheckbox.disabled = !bindings.farman.enabled;
        mobileFarmanCheckbox.onchange = () => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.farman.selected = mobileFarmanCheckbox.checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        };
        farmanItem.content.appendChild(mobileFarmanCheckbox);

        // Boom checkbox
        const boomItem = createMobileOptionItem(
            localization.translate('Frames Tail Boom'),
            contentDiv
        );
        const mobileBoomCheckbox = document.createElement('input');
        mobileBoomCheckbox.type = 'checkbox';
        mobileBoomCheckbox.checked = bindings.boom.selected;
        mobileBoomCheckbox.disabled = !bindings.boom.enabled;
        mobileBoomCheckbox.onchange = () => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.boom.selected = mobileBoomCheckbox.checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        };
        boomItem.content.appendChild(mobileBoomCheckbox);

        // Tail sections
        const mobileTailSectionRows: MobileTailSectionRowCache[] = [];
        if (bindings.tail_sections && bindings.tail_sections.length > 0) {
            for (let i = 0; i < bindings.tail_sections.length; i++) {
                const rowCache = this.createMobileTailSectionRow(bindings.tail_sections[i], bindings, i, contentDiv);
                mobileTailSectionRows.push(rowCache);
            }
        }

        // Stats grid
        const statsTitle = document.createElement('div');
        statsTitle.className = 'mobile-option-title';
        statsTitle.style.marginTop = '1rem';
        statsTitle.textContent = localization.translate('Frames Frame Stats');
        contentDiv.appendChild(statsTitle);

        const statsGrid = createMobileStatsGrid(stats, FRAMES_STATS, derived);
        contentDiv.appendChild(statsGrid);

        // Store mobile controls in cache
        if (this.cache) {
            this.cache.mobileStatsGrid = statsGrid;
            this.cache.mobileFlyingWingCheckbox = mobileFlyingWingCheckbox;
            this.cache.mobileAllFrameSelect = mobileAllFrameSelect;
            this.cache.mobileAllSkinSelect = mobileAllSkinSelect;
            this.cache.mobileSectionRows = mobileSectionRows;
            this.cache.mobileTailTypeSelect = mobileTailTypeSelect;
            this.cache.mobileFarmanCheckbox = mobileFarmanCheckbox;
            this.cache.mobileBoomCheckbox = mobileBoomCheckbox;
            this.cache.mobileTailSectionRows = mobileTailSectionRows;
        }

        // Wrap in collapsible section
        const section = createCollapsibleSection(
            localization.translate('Frames Frames and Covering'),
            contentDiv,
            true
        );

        // Add rules link
        const rulesLine = createRulesLink('_Frames');
        rulesLine.appendChild(document.createElement('br'));
        section.insertBefore(rulesLine, section.children[1]);

        parent.appendChild(section);
    }

    /**
     * Create a mobile fuselage section row
     */
    private createMobileSectionRow(sectionBindings: any, index: number, parent: HTMLElement, bindings: any): MobileSectionRowCache {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mobile-frame-row';

        // Header with +/- buttons and frame count
        const headerDiv = document.createElement('div');
        headerDiv.className = 'mobile-frame-header';

        // Remove button
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'mobile-number-btn';
        removeButton.textContent = '-';
        removeButton.disabled = !sectionBindings.can_remove;
        removeButton.onclick = () => {
            this.getBridge().deleteSection(index);
            this.render(true);
        };
        headerDiv.appendChild(removeButton);

        // Frame select
        const frameSelect = createSelectElement(
            sectionBindings.frame,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.sections[index].frame.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        frameSelect.style.flex = '1';
        headerDiv.appendChild(frameSelect);

        // Add button
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'mobile-number-btn';
        addButton.textContent = '+';
        addButton.disabled = !sectionBindings.can_add;
        addButton.onclick = () => {
            this.getBridge().duplicateSection(index);
            this.render(true);
        };
        headerDiv.appendChild(addButton);

        sectionDiv.appendChild(headerDiv);

        // Skin label
        const skinLabel = document.createElement('div');
        skinLabel.style.fontSize = '0.9rem';
        skinLabel.style.color = 'var(--inp_txt_color)';
        skinLabel.textContent = localization.translate('Frames Skin Type') + ': ' + this.getSkinNameForSection(sectionBindings);
        sectionDiv.appendChild(skinLabel);

        // Options row
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'mobile-frame-options';

        // Geodesic
        const geodesicBinding = { ...sectionBindings.geodesic, name: localization.translate('Frames Geodesic') };
        const geodesicCheckbox = createMobileCheckbox(geodesicBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.sections[index].geodesic.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        // Monocoque
        const monocoqueBinding = { ...sectionBindings.monocoque, name: localization.translate('Frames Monocoque') };
        const monocoqueCheckbox = createMobileCheckbox(monocoqueBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.sections[index].monocoque.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        // Internal Bracing
        const internalBracingBinding = { ...sectionBindings.internal_bracing, name: localization.translate('Frames Internal Bracing') };
        const internalBracingCheckbox = createMobileCheckbox(internalBracingBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.sections[index].internal_bracing.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        // Lifting Body
        const liftingBodyBinding = { ...sectionBindings.lifting_body, name: localization.translate('Frames Lifting Body') };
        const liftingBodyCheckbox = createMobileCheckbox(liftingBodyBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.sections[index].lifting_body.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        sectionDiv.appendChild(optionsDiv);
        parent.appendChild(sectionDiv);

        return {
            frameSelect,
            skinLabel,
            geodesicCheckbox,
            monocoqueCheckbox,
            internalBracingCheckbox,
            liftingBodyCheckbox,
            addButton,
            removeButton
        };
    }

    /**
     * Create a mobile tail section row
     */
    private createMobileTailSectionRow(tailSectionBindings: any, bindings: any, index: number, parent: HTMLElement): MobileTailSectionRowCache {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'mobile-frame-row';

        // Frame select
        const headerDiv = document.createElement('div');
        headerDiv.className = 'mobile-frame-header';
        const frameSelect = createSelectElement(
            tailSectionBindings.frame,
            (selectedIndex) => {
                const updatedBindings = this.getBridge().getFramesBindings();
                updatedBindings.tail_sections[index].frame.selected = selectedIndex;
                this.getBridge().setFramesBindings(updatedBindings);
                this.onUpdate();
            }
        );
        frameSelect.style.flex = '1';
        headerDiv.appendChild(frameSelect);
        sectionDiv.appendChild(headerDiv);

        // Skin label
        const skinLabel = document.createElement('div');
        skinLabel.style.fontSize = '0.9rem';
        skinLabel.style.color = 'var(--inp_txt_color)';
        skinLabel.textContent = localization.translate('Frames Skin Type') + ': ' + this.getSkinNameForTailSection(bindings);
        sectionDiv.appendChild(skinLabel);

        // Options row
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'mobile-frame-options';

        // Geodesic
        const geodesicBinding = { ...tailSectionBindings.geodesic, name: localization.translate('Frames Geodesic') };
        const geodesicCheckbox = createMobileCheckbox(geodesicBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.tail_sections[index].geodesic.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        // Monocoque
        const monocoqueBinding = { ...tailSectionBindings.monocoque, name: localization.translate('Frames Monocoque') };
        const monocoqueCheckbox = createMobileCheckbox(monocoqueBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.tail_sections[index].monocoque.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        // Lifting Body
        const liftingBodyBinding = { ...tailSectionBindings.lifting_body, name: localization.translate('Frames Lifting Body') };
        const liftingBodyCheckbox = createMobileCheckbox(liftingBodyBinding, optionsDiv, (checked) => {
            const updatedBindings = this.getBridge().getFramesBindings();
            updatedBindings.tail_sections[index].lifting_body.selected = checked;
            this.getBridge().setFramesBindings(updatedBindings);
            this.onUpdate();
        });

        sectionDiv.appendChild(optionsDiv);
        parent.appendChild(sectionDiv);

        return {
            frameSelect,
            skinLabel,
            geodesicCheckbox,
            monocoqueCheckbox,
            liftingBodyCheckbox
        };
    }
}
