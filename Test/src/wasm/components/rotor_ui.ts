/**
 * Rotor UI Component
 *
 * Displays the Rotor configuration for Autogyro and Helicopter aircraft types
 * Shows/hides based on current aircraft type
 */

import { AircraftBridge, RotorOptions } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createSelectElement,
    updateSelectElement,
    createCollapsibleSection,
    createFlexSection,
    createFlexSelect,
    createFlexNumberInput,
    createFlexCheckbox,
    createFlexLabel,
    createStatsTable,
    updateStatsTable,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileNumberInput,
    createMobileSelect,
    createMobileCheckbox,
    createMobileStatsGrid
} from '../dom_utils';

// Aircraft type enum values
const AIRCRAFT_TYPE = {
    AIRPLANE: 0,
    HELICOPTER: 1,
    AUTOGYRO: 2,
    ORNITHOPTER_BASIC: 3,
    ORNITHOPTER_FLUTTER: 4,
    ORNITHOPTER_BUZZER: 5
};

// Cache interface for type safety
interface RotorCache {
    // Autogyro elements
    autoSection: HTMLTableSectionElement;
    autoMinSpan: HTMLSpanElement;
    autoSpan: HTMLInputElement;
    autoMaterial: HTMLSelectElement;
    autoClutch: HTMLInputElement;
    autoStatsTable: HTMLTableElement;
    // Helicopter elements
    heliSection: HTMLTableSectionElement;
    heliCount: HTMLInputElement;
    heliMinSpan: HTMLSpanElement;
    heliSpan: HTMLInputElement;
    heliStagger: HTMLSelectElement;
    heliBladeCount: HTMLSelectElement;
    heliMaterial: HTMLSelectElement;
    heliThickness: HTMLInputElement;
    heliCrosslink: HTMLInputElement;
    heliStatsTable: HTMLTableElement;
}

// Stats configuration for rotor
const ROTOR_STATS_CONFIG: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'rotor_area', label: 'Rotor Area', isDerived: false },
];

export class RotorUI extends BaseComponentUI {
    private cache: RotorCache;
    private showRotors: boolean;

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

        const bindings: RotorOptions = bridge.getRotorBindings();
        const stats = bridge.getRotorStats();
        const aircraftType = bridge.getAircraftType();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Main table structure
        const table = document.createElement('table');

        if (aircraftType >= 2) {
            // === AUTOGYRO SECTION ===
            const autoSection = document.createElement('tbody');
            autoSection.id = 'autogyro_section';

            // Autogyro header row
            const autoHeader = autoSection.insertRow();
            this.createHeaderCell(autoHeader, localization.translate('Rotor Rotor'));
            this.createHeaderCell(autoHeader, localization.translate('Rotor Material'));
            this.createHeaderCell(autoHeader, localization.translate('Rotor Accessories'));
            this.createHeaderCell(autoHeader, localization.translate('Rotor Stats'));

            // Autogyro content row
            const autoContent = autoSection.insertRow();

            // Rotor column
            const autoRotorCell = autoContent.insertCell();
            const autoRotorFlex = createFlexSection();
            autoRotorCell.appendChild(autoRotorFlex.div0);

            const autoMinSpan = createFlexLabel(bindings.sizing_span, autoRotorFlex);
            const autoSpan = createFlexNumberInput(
                bindings.rotor_span,
                autoRotorFlex,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_span.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                '0'
            );

            // Material column
            const autoMatCell = autoContent.insertCell();
            const autoMatFlex = createFlexSection();
            autoMatCell.appendChild(autoMatFlex.div0);

            const autoMaterial = createFlexSelect(
                bindings.cantilever,
                autoMatFlex,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.cantilever.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Material')
            );

            // Accessories column
            const autoAccCell = autoContent.insertCell();
            const autoAccFlex = createFlexSection();
            autoAccCell.appendChild(autoAccFlex.div0);

            const autoClutch = createFlexCheckbox(
                bindings.accessory,
                autoAccFlex,
                (checked) => {
                    const updated = bridge.getRotorBindings();
                    updated.accessory.selected = checked;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Stats column (merge rotor_area from bindings into stats)
            const autoStatsCell = autoContent.insertCell();
            const autoStatsWithArea = { rotor_area: bindings.rotor_area };
            const autoStatsTable = createStatsTable(stats, ROTOR_STATS_CONFIG, autoStatsWithArea);
            autoStatsCell.appendChild(autoStatsTable);
            autoStatsCell.className = 'inner_table';

            table.appendChild(autoSection);

            // Cache elements
            this.cache = {
                autoSection,
                autoMinSpan,
                autoSpan,
                autoMaterial,
                autoClutch,
                autoStatsTable,
                heliSection: undefined,
                heliCount: undefined,
                heliMinSpan: undefined,
                heliSpan: undefined,
                heliStagger: undefined,
                heliBladeCount: undefined,
                heliMaterial: undefined,
                heliThickness: undefined,
                heliCrosslink: undefined,
                heliStatsTable: undefined,
            }
        } else {

            // === HELICOPTER SECTION ===
            const heliSection = document.createElement('tbody');
            heliSection.id = 'helicopter_section';

            // Helicopter header row
            const heliHeader = heliSection.insertRow();
            this.createHeaderCell(heliHeader, localization.translate('Rotor Rotor'));
            this.createHeaderCell(heliHeader, localization.translate('Rotor Material'));
            this.createHeaderCell(heliHeader, localization.translate('Rotor Accessories'));
            this.createHeaderCell(heliHeader, localization.translate('Rotor Stats'));

            // Helicopter content row
            const heliContent = heliSection.insertRow();

            // Rotor column
            const heliRotorCell = heliContent.insertCell();
            const heliRotorFlex = createFlexSection();
            heliRotorCell.appendChild(heliRotorFlex.div0);

            const heliCount = createFlexNumberInput(
                bindings.rotor_count,
                heliRotorFlex,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_count.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                '1'
            );

            const heliMinSpan = createFlexLabel(bindings.sizing_span, heliRotorFlex);

            const heliSpan = createFlexNumberInput(
                bindings.rotor_span,
                heliRotorFlex,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_span.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                '0'
            );

            const heliStagger = createFlexSelect(
                bindings.stagger,
                heliRotorFlex,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.stagger.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Stagger')
            );

            const heliBladeCount = createFlexSelect(
                bindings.blade_count,
                heliRotorFlex,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.blade_count.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Blade Count')
            );

            // Material column
            const heliMatCell = heliContent.insertCell();
            const heliMatFlex = createFlexSection();
            heliMatCell.appendChild(heliMatFlex.div0);

            const heliMaterial = createFlexSelect(
                bindings.cantilever,
                heliMatFlex,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.cantilever.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Rotor Material')
            );

            const heliThickness = createFlexNumberInput(
                bindings.rotor_thickness,
                heliMatFlex,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_thickness.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                '0'
            );

            // Accessories column
            const heliAccCell = heliContent.insertCell();
            const heliAccFlex = createFlexSection();
            heliAccCell.appendChild(heliAccFlex.div0);

            const heliCrosslink = createFlexCheckbox(
                bindings.accessory,
                heliAccFlex,
                (checked) => {
                    const updated = bridge.getRotorBindings();
                    updated.accessory.selected = checked;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Stats column (merge rotor_area from bindings into stats)
            const heliStatsCell = heliContent.insertCell();
            const heliStatsWithArea = { rotor_area: bindings.rotor_area };
            const heliStatsTable = createStatsTable(stats, ROTOR_STATS_CONFIG, heliStatsWithArea);
            heliStatsCell.appendChild(heliStatsTable);
            heliStatsCell.className = 'inner_table';

            table.appendChild(heliSection);
            // Cache elements
            this.cache = {
                autoSection: undefined,
                autoMinSpan: undefined,
                autoSpan: undefined,
                autoMaterial: undefined,
                autoClutch: undefined,
                autoStatsTable: undefined,
                heliSection,
                heliCount,
                heliMinSpan,
                heliSpan,
                heliStagger,
                heliBladeCount,
                heliMaterial,
                heliThickness,
                heliCrosslink,
                heliStatsTable
            }
        }

        desktopDiv.appendChild(table);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        if (aircraftType >= 2) {
            // Autogyro mobile layout
            // Rotor Span
            const spanItem = createMobileOptionItem(
                localization.translate('Rotor Rotor'),
                mobileDiv
            );
            // Show min span as label
            const minSpanLabel = document.createElement('span');
            minSpanLabel.textContent = `${localization.translate('Rotor Min Span')}: ${bindings.sizing_span.value}`;
            minSpanLabel.style.fontSize = '0.9em';
            minSpanLabel.style.marginRight = '1em';
            spanItem.content.appendChild(minSpanLabel);

            createMobileNumberInput(
                bindings.rotor_span,
                spanItem.content,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_span.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                0,
                999,
                1
            );

            // Material
            const matItem = createMobileOptionItem(
                localization.translate('Rotor Material'),
                mobileDiv
            );
            createMobileSelect(
                bindings.cantilever,
                matItem.content,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.cantilever.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Accessories
            const accItem = createMobileOptionItem(
                localization.translate('Rotor Accessories'),
                mobileDiv
            );
            createMobileCheckbox(
                bindings.accessory,
                accItem.content,
                (checked) => {
                    const updated = bridge.getRotorBindings();
                    updated.accessory.selected = checked;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Stats
            const statsItem = createMobileOptionItem(
                localization.translate('Rotor Stats'),
                mobileDiv
            );
            const autoStatsWithArea = { rotor_area: bindings.rotor_area };
            const statsGrid = createMobileStatsGrid(stats, ROTOR_STATS_CONFIG, autoStatsWithArea);
            statsItem.content.appendChild(statsGrid);
        } else {
            // Helicopter mobile layout
            // Rotor Count
            const countItem = createMobileOptionItem(
                localization.translate('Rotor Rotor Count'),
                mobileDiv
            );
            createMobileNumberInput(
                bindings.rotor_count,
                countItem.content,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_count.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                1,
                10,
                1
            );

            // Rotor Span
            const spanItem = createMobileOptionItem(
                localization.translate('Rotor Rotor'),
                mobileDiv
            );
            const minSpanLabel = document.createElement('span');
            minSpanLabel.textContent = `${localization.translate('Rotor Min Span')}: ${bindings.sizing_span.value}`;
            minSpanLabel.style.fontSize = '0.9em';
            minSpanLabel.style.marginRight = '1em';
            spanItem.content.appendChild(minSpanLabel);

            createMobileNumberInput(
                bindings.rotor_span,
                spanItem.content,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_span.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                0,
                999,
                1
            );

            // Stagger
            const staggerItem = createMobileOptionItem(
                localization.translate('Rotor Stagger'),
                mobileDiv
            );
            createMobileSelect(
                bindings.stagger,
                staggerItem.content,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.stagger.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Blade Count
            const bladeItem = createMobileOptionItem(
                localization.translate('Rotor Blade Count'),
                mobileDiv
            );
            createMobileSelect(
                bindings.blade_count,
                bladeItem.content,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.blade_count.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Material
            const matItem = createMobileOptionItem(
                localization.translate('Rotor Material'),
                mobileDiv
            );
            createMobileSelect(
                bindings.cantilever,
                matItem.content,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.cantilever.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Thickness
            const thickItem = createMobileOptionItem(
                localization.translate('Rotor Thickness'),
                mobileDiv
            );
            createMobileNumberInput(
                bindings.rotor_thickness,
                thickItem.content,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_thickness.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                0,
                999,
                1
            );

            // Accessories
            const accItem = createMobileOptionItem(
                localization.translate('Rotor Accessories'),
                mobileDiv
            );
            createMobileCheckbox(
                bindings.accessory,
                accItem.content,
                (checked) => {
                    const updated = bridge.getRotorBindings();
                    updated.accessory.selected = checked;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            );

            // Stats
            const statsItem = createMobileOptionItem(
                localization.translate('Rotor Stats'),
                mobileDiv
            );
            const heliStatsWithArea = { rotor_area: bindings.rotor_area };
            const statsGrid = createMobileStatsGrid(stats, ROTOR_STATS_CONFIG, heliStatsWithArea);
            statsItem.content.appendChild(statsGrid);
        }

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Rotor Section Title');
        this.sectionElement = createCollapsibleSection(sectionTitle, contentWrapper, true);

        // Add rules link
        const rulesLine = createRulesLink('_Rotor');
        rulesLine.appendChild(document.createElement('br'));
        this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

        this.container.appendChild(this.sectionElement);

        // Set initial visibility based on aircraft type
        this.updateVisibility(aircraftType);

        console.log('[RotorUI] Full rebuild complete');
    }

    private createHeaderCell(row: HTMLTableRowElement, text: string): HTMLTableCellElement {
        const th = document.createElement('th');
        th.textContent = text;
        row.appendChild(th);
        return th;
    }

    /**
     * Update visibility based on aircraft type
     */
    private updateVisibility(aircraftType: number): void {
        if (!this.cache) {
            console.log('[RotorUI] updateVisibility: cache is null, skipping');
            return;
        }

        // Hide entire section for airplane and ornithopters
        // Use Number() to ensure type consistency in comparison
        const typeNum = Number(aircraftType);
        this.showRotors = typeNum === AIRCRAFT_TYPE.AUTOGYRO || typeNum === AIRCRAFT_TYPE.HELICOPTER;

        console.log(`[RotorUI] updateVisibility: aircraftType=${typeNum}, showRotors=${this.showRotors}`);

        if (this.sectionElement) {
            this.sectionElement.style.display = this.showRotors ? '' : 'none';
            console.log(`[RotorUI] sectionElement.style.display set to: '${this.sectionElement.style.display}'`);
        } else {
            console.warn('[RotorUI] sectionElement is null!');
        }

        // Show appropriate sub-section
        // this.cache.autoSection.style.display = typeNum === AIRCRAFT_TYPE.AUTOGYRO ? '' : 'none';
        // this.cache.heliSection.style.display = typeNum === AIRCRAFT_TYPE.HELICOPTER ? '' : 'none';
    }

    public isVisible(): boolean {
        return this.showRotors;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings: RotorOptions = bridge.getRotorBindings();
        const stats = bridge.getRotorStats();
        const aircraftType = bridge.getAircraftType();

        // Update visibility first
        this.updateVisibility(aircraftType);

        // Update autogyro elements
        if (this.cache.autoMinSpan) {
            this.cache.autoMinSpan.textContent = bindings.sizing_span.value.toString();
        }
        if (this.cache.autoSpan) {
            this.cache.autoSpan.value = bindings.rotor_span.value.toString();
            this.cache.autoSpan.disabled = !bindings.rotor_span.enabled;
        }
        if (this.cache.autoMaterial) {
            updateSelectElement(this.cache.autoMaterial, bindings.cantilever);
        }
        if (this.cache.autoClutch) {
            this.cache.autoClutch.checked = bindings.accessory.selected;
            this.cache.autoClutch.disabled = !bindings.accessory.enabled;
        }
        if (this.cache.autoStatsTable) {
            const autoStatsWithArea = { rotor_area: bindings.rotor_area };
            updateStatsTable(this.cache.autoStatsTable, stats, ROTOR_STATS_CONFIG, autoStatsWithArea);
        }

        // Update helicopter elements
        if (this.cache.heliCount) {
            this.cache.heliCount.value = bindings.rotor_count.value.toString();
            this.cache.heliCount.disabled = !bindings.rotor_count.enabled;
        }
        if (this.cache.heliMinSpan) {
            this.cache.heliMinSpan.textContent = bindings.sizing_span.value.toString();
        }
        if (this.cache.heliSpan) {
            this.cache.heliSpan.value = bindings.rotor_span.value.toString();
            this.cache.heliSpan.disabled = !bindings.rotor_span.enabled;
        }
        if (this.cache.heliStagger) {
            updateSelectElement(this.cache.heliStagger, bindings.stagger);
        }
        if (this.cache.heliBladeCount) {
            updateSelectElement(this.cache.heliBladeCount, bindings.blade_count);
        }
        if (this.cache.heliMaterial) {
            updateSelectElement(this.cache.heliMaterial, bindings.cantilever);
        }
        if (this.cache.heliThickness) {
            this.cache.heliThickness.value = bindings.rotor_thickness.value.toString();
            this.cache.heliThickness.disabled = !bindings.rotor_thickness.enabled;
        }
        if (this.cache.heliCrosslink) {
            this.cache.heliCrosslink.checked = bindings.accessory.selected;
            this.cache.heliCrosslink.disabled = !bindings.accessory.enabled;
        }
        if (this.cache.heliStatsTable) {
            const heliStatsWithArea = { rotor_area: bindings.rotor_area };
            updateStatsTable(this.cache.heliStatsTable, stats, ROTOR_STATS_CONFIG, heliStatsWithArea);
        }
    }
}
