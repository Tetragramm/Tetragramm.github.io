/**
 * Rotor UI Component
 *
 * Displays the Rotor configuration for Autogyro and Helicopter aircraft types
 * Shows/hides based on current aircraft type
 */

import { RotorOptions } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createCollapsibleSection,
    createFlexSection,
    createFlexLabel,
    StatDisplayConfig,
    createMobileOptionItem,
    Updatable,
    dualStats,
    dualNumberInto,
    dualSelectInto,
    dualCheckboxInto,
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

// Stats configuration for rotor
const ROTOR_STATS_CONFIG: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'rotor_area', label: 'Rotor Area', isDerived: false },
];

export class RotorUI extends BaseComponentUI {
    // Dual controls (desktop + mobile) built in rebuildFull, refreshed in updateValues.
    private controls: Updatable[] = [];
    private showRotors: boolean;

    // The read-only desktop "min span" display (sizing_span) has no dual* helper:
    // its desktop node is a createFlexLabel span which is cached and refreshed
    // manually below. (The original only refreshed the desktop label; the mobile
    // min-span span was static text set once at build, so it stays uncached to
    // preserve identical behavior.)
    private autoMinSpan: HTMLSpanElement;
    private heliMinSpan: HTMLSpanElement;

    protected shouldUpdate(): boolean {
        // Null-safe: BaseComponentUI's constructor triggers the first render()
        // (hence shouldUpdate) before this subclass's field initializer runs.
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
        this.autoMinSpan = undefined;
        this.heliMinSpan = undefined;
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
        const aircraftType = bridge.getAircraftType();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Main table structure
        const table = document.createElement('table');

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

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

            // Rotor column (read-only min span label + rotor span input share one flex)
            const autoRotorCell = autoContent.insertCell();
            const autoRotorFlex = createFlexSection();
            autoRotorCell.appendChild(autoRotorFlex.div0);

            this.autoMinSpan = createFlexLabel(bindings.sizing_span, autoRotorFlex);

            // Mobile: Rotor Span item carries a custom min-span label + the number input
            const spanItem = createMobileOptionItem(
                localization.translate('Rotor Rotor'),
                mobileDiv
            );
            const autoMinSpanLabel = document.createElement('span');
            autoMinSpanLabel.textContent = `${localization.translate('Rotor Min Span')}: ${bindings.sizing_span.value}`;
            autoMinSpanLabel.style.fontSize = '0.9em';
            autoMinSpanLabel.style.marginRight = '1em';
            spanItem.content.appendChild(autoMinSpanLabel);

            this.controls.push(dualNumberInto(
                autoRotorFlex,
                spanItem.content,
                () => bridge.getRotorBindings().rotor_span,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_span.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                { min: 0, max: 999, step: 1 }
            ));

            // Material column
            const autoMatCell = autoContent.insertCell();
            const autoMatFlex = createFlexSection();
            autoMatCell.appendChild(autoMatFlex.div0);

            const matItem = createMobileOptionItem(
                localization.translate('Rotor Material'),
                mobileDiv
            );
            this.controls.push(dualSelectInto(
                autoMatFlex,
                matItem.content,
                () => bridge.getRotorBindings().cantilever,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.cantilever.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Material')
            ));

            // Accessories column
            const autoAccCell = autoContent.insertCell();
            const autoAccFlex = createFlexSection();
            autoAccCell.appendChild(autoAccFlex.div0);

            const accItem = createMobileOptionItem(
                localization.translate('Rotor Accessories'),
                mobileDiv
            );
            this.controls.push(dualCheckboxInto(
                autoAccFlex,
                accItem.content,
                () => bridge.getRotorBindings().accessory,
                (checked) => {
                    const updated = bridge.getRotorBindings();
                    updated.accessory.selected = checked;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            ));

            // Stats column (merge rotor_area from bindings into stats)
            const autoStatsCell = autoContent.insertCell();
            const statsCtl = dualStats(
                localization.translate('Rotor Stats'),
                () => bridge.getRotorStats(),
                ROTOR_STATS_CONFIG,
                () => ({ rotor_area: bridge.getRotorBindings().rotor_area })
            );
            autoStatsCell.appendChild(statsCtl.desktop);
            autoStatsCell.className = 'inner_table';

            // Mobile stats item
            const statsItem = createMobileOptionItem(
                localization.translate('Rotor Stats'),
                mobileDiv
            );
            statsItem.content.appendChild(statsCtl.mobile);
            this.controls.push(statsCtl);

            table.appendChild(autoSection);
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

            // Rotor column (count + read-only min span + span + stagger + blade share one flex)
            const heliRotorCell = heliContent.insertCell();
            const heliRotorFlex = createFlexSection();
            heliRotorCell.appendChild(heliRotorFlex.div0);

            // Mobile: Rotor Count item
            const countItem = createMobileOptionItem(
                localization.translate('Rotor Rotor Count'),
                mobileDiv
            );
            this.controls.push(dualNumberInto(
                heliRotorFlex,
                countItem.content,
                () => bridge.getRotorBindings().rotor_count,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_count.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                { min: 1, max: 10, step: 1 }
            ));

            // Read-only min span label (desktop only at this position)
            this.heliMinSpan = createFlexLabel(bindings.sizing_span, heliRotorFlex);

            // Mobile: Rotor Span item carries a custom min-span label + the number input
            const spanItem = createMobileOptionItem(
                localization.translate('Rotor Rotor'),
                mobileDiv
            );
            const heliMinSpanLabel = document.createElement('span');
            heliMinSpanLabel.textContent = `${localization.translate('Rotor Min Span')}: ${bindings.sizing_span.value}`;
            heliMinSpanLabel.style.fontSize = '0.9em';
            heliMinSpanLabel.style.marginRight = '1em';
            spanItem.content.appendChild(heliMinSpanLabel);

            this.controls.push(dualNumberInto(
                heliRotorFlex,
                spanItem.content,
                () => bridge.getRotorBindings().rotor_span,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_span.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                { min: 0, max: 999, step: 1 }
            ));

            // Stagger select (desktop shares heliRotorFlex; mobile own item)
            const staggerItem = createMobileOptionItem(
                localization.translate('Rotor Stagger'),
                mobileDiv
            );
            this.controls.push(dualSelectInto(
                heliRotorFlex,
                staggerItem.content,
                () => bridge.getRotorBindings().stagger,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.stagger.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Stagger')
            ));

            // Blade Count select (desktop shares heliRotorFlex; mobile own item)
            const bladeItem = createMobileOptionItem(
                localization.translate('Rotor Blade Count'),
                mobileDiv
            );
            this.controls.push(dualSelectInto(
                heliRotorFlex,
                bladeItem.content,
                () => bridge.getRotorBindings().blade_count,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.blade_count.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Blade Count')
            ));

            // Material column (cantilever select + thickness number share one flex)
            const heliMatCell = heliContent.insertCell();
            const heliMatFlex = createFlexSection();
            heliMatCell.appendChild(heliMatFlex.div0);

            const matItem = createMobileOptionItem(
                localization.translate('Rotor Material'),
                mobileDiv
            );
            this.controls.push(dualSelectInto(
                heliMatFlex,
                matItem.content,
                () => bridge.getRotorBindings().cantilever,
                (idx) => {
                    const updated = bridge.getRotorBindings();
                    updated.cantilever.selected = idx;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                localization.translate('Rotor Rotor Material')
            ));

            const thickItem = createMobileOptionItem(
                localization.translate('Rotor Thickness'),
                mobileDiv
            );
            this.controls.push(dualNumberInto(
                heliMatFlex,
                thickItem.content,
                () => bridge.getRotorBindings().rotor_thickness,
                (value) => {
                    const updated = bridge.getRotorBindings();
                    updated.rotor_thickness.value = value;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                },
                { min: 0, max: 999, step: 1 }
            ));

            // Accessories column
            const heliAccCell = heliContent.insertCell();
            const heliAccFlex = createFlexSection();
            heliAccCell.appendChild(heliAccFlex.div0);

            const accItem = createMobileOptionItem(
                localization.translate('Rotor Accessories'),
                mobileDiv
            );
            this.controls.push(dualCheckboxInto(
                heliAccFlex,
                accItem.content,
                () => bridge.getRotorBindings().accessory,
                (checked) => {
                    const updated = bridge.getRotorBindings();
                    updated.accessory.selected = checked;
                    bridge.setRotorBindings(updated);
                    this.onUpdate();
                }
            ));

            // Stats column (merge rotor_area from bindings into stats)
            const heliStatsCell = heliContent.insertCell();
            const statsCtl = dualStats(
                localization.translate('Rotor Stats'),
                () => bridge.getRotorStats(),
                ROTOR_STATS_CONFIG,
                () => ({ rotor_area: bridge.getRotorBindings().rotor_area })
            );
            heliStatsCell.appendChild(statsCtl.desktop);
            heliStatsCell.className = 'inner_table';

            // Mobile stats item
            const statsItem = createMobileOptionItem(
                localization.translate('Rotor Stats'),
                mobileDiv
            );
            statsItem.content.appendChild(statsCtl.mobile);
            this.controls.push(statsCtl);

            table.appendChild(heliSection);
        }

        desktopDiv.appendChild(table);
        contentWrapper.appendChild(desktopDiv);
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
        // Hide entire section for airplane and ornithopters
        // Use Number() to ensure type consistency in comparison
        const typeNum = Number(aircraftType);
        this.showRotors = typeNum === AIRCRAFT_TYPE.AUTOGYRO || typeNum === AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = this.showRotors ? '' : 'none';
        } else {
            console.error('[RotorUI] sectionElement is null!');
        }
    }

    public isVisible(): boolean {
        return this.showRotors;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;

        const bindings: RotorOptions = bridge.getRotorBindings();
        const aircraftType = bridge.getAircraftType();

        // Update visibility first
        this.updateVisibility(aircraftType);

        // Refresh the read-only desktop min-span labels (no dual* helper covers
        // these). Matches the original, which only updated the desktop labels.
        if (this.autoMinSpan) {
            this.autoMinSpan.textContent = bindings.sizing_span.value.toString();
        }
        if (this.heliMinSpan) {
            this.heliMinSpan.textContent = bindings.sizing_span.value.toString();
        }

        this.controls.forEach(c => c.update());
    }
}
