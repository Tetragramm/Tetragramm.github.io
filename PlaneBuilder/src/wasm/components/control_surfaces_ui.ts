/**
 * ControlSurfaces UI Component
 *
 * Displays the ControlSurfaces section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { AIRCRAFT_TYPE } from './aircraft_type_ui';
import {
    createRulesLink,
    createFlexSection,
    StatDisplayConfig,
    createCollapsibleSection,
    createMobileOptionItem,
    Updatable,
    dualStats,
    dualSelectInto,
    dualCheckboxInto,
} from '../dom_utils';

// Control Surfaces stats configuration
const CONTROLS_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'crashsafety', label: 'Stat Crash Safety', positiveIsGood: true },
    { key: '', label: '', positiveIsGood: undefined },
];

const SURFACE_KEYS = ['aileron_sel', 'rudder_sel', 'elevator_sel', 'flaps_sel', 'slats_sel'];
const SURFACE_LABELS = [
    'Control Surfaces Ailerons',
    'Control Surfaces Rudders',
    'Control Surfaces Elevators',
    'Control Surfaces Flaps',
    'Control Surfaces Slats',
];

export class ControlSurfacesUI extends BaseComponentUI {
    private controls: Updatable[] = [];
    public showControlSurfaces: boolean;

    protected shouldUpdate(): boolean {
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
    }

    /**
     * Current stats including the flap-cost adjustment the original applied to
     * stats.cost. Shared by build and update via the dualStats closure.
     */
    private getStatsWithFlapCost(bridge: AircraftBridge): any {
        const stats = bridge.getControlSurfacesStats();
        const derivedStats = bridge.getDerivedStats();
        stats.cost += bridge.getControlSurfacesFlapCost(Math.round(derivedStats.dry_mp));
        return stats;
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getControlSurfacesBindings();
        const aircraftType = bridge.getAircraftType();

        const statsCtl = dualStats(
            localization.translate('Control Surfaces Stats'),
            () => this.getStatsWithFlapCost(bridge),
            CONTROLS_STATS
        );

        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION (unchanged layout) ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // 3-column table: Control Surfaces | Drag Inducers | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_control_surfaces';

        const headerRow = document.createElement('tr');
        [
            localization.translate('Control Surfaces Control Surfaces'),
            localization.translate('Control Surfaces Drag Inducers'),
            localization.translate('Control Surfaces Stats'),
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        const dataRow = document.createElement('tr');

        // The two control cells hold a shared flex section each; the controls are
        // filled in by the dual*Into helpers below (desktop side).
        const csCell = document.createElement('td');
        const csFlex = createFlexSection();
        csCell.appendChild(csFlex.div0);
        dataRow.appendChild(csCell);

        const dragCell = document.createElement('td');
        const dragFlex = createFlexSection();
        dragCell.appendChild(dragFlex.div0);
        dataRow.appendChild(dragCell);

        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        statsCell.appendChild(statsCtl.desktop);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Surface selects: desktop shares csFlex; mobile gets one item each.
        SURFACE_KEYS.forEach((key, idx) => {
            const binding = bindings[key];
            if (!binding || !binding.options) return;
            const label = localization.translate(SURFACE_LABELS[idx]);
            const item = createMobileOptionItem(label, mobileDiv);
            this.controls.push(dualSelectInto(
                csFlex,
                item.content,
                () => bridge.getControlSurfacesBindings()[key],
                (selectedIndex) => {
                    const b = bridge.getControlSurfacesBindings();
                    b[key].selected = selectedIndex;
                    bridge.setControlSurfacesBindings(b);
                    this.onUpdate();
                },
                label
            ));
        });

        // Drag inducers: desktop shares dragFlex; mobile shares one item.
        const dragItem = createMobileOptionItem(
            localization.translate('Control Surfaces Drag Inducers'),
            mobileDiv
        );
        if (Array.isArray(bindings.drag_sel)) {
            bindings.drag_sel.forEach((_d: any, idx: number) => {
                this.controls.push(dualCheckboxInto(
                    dragFlex,
                    dragItem.content,
                    () => bridge.getControlSurfacesBindings().drag_sel[idx],
                    (checked) => {
                        const b = bridge.getControlSurfacesBindings();
                        b.drag_sel[idx].selected = checked;
                        bridge.setControlSurfacesBindings(b);
                        this.onUpdate();
                    }
                ));
            });
        }

        mobileDiv.appendChild(statsCtl.mobile);
        contentWrapper.appendChild(mobileDiv);

        this.controls.push(statsCtl);

        // Collapsible section with localized title
        const sectionTitle = localization.translate('Control Surfaces Section Title');
        this.sectionElement = createCollapsibleSection(sectionTitle, contentWrapper, true);

        const rulesLine = createRulesLink('_Control_Surfaces');
        this.sectionElement.insertBefore(rulesLine, this.sectionElement.children[1]);

        this.container.appendChild(this.sectionElement);

        this.updateVisibility(aircraftType);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;
        this.updateVisibility(bridge.getAircraftType());
        this.controls.forEach(c => c.update());
    }

    /**
     * Update visibility based on aircraft type
     */
    private updateVisibility(aircraftType: number): void {
        const typeNum = Number(aircraftType);
        this.showControlSurfaces = typeNum !== AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = this.showControlSurfaces ? '' : 'none';
        }
    }

    public isVisible(): boolean {
        return this.showControlSurfaces;
    }

    /**
     * Apply initial collapse state based on whether control surfaces are at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getControlSurfacesIsDefault();
        this.setCollapsed(isDefault);
    }
}
