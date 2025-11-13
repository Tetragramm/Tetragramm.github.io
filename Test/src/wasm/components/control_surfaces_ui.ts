/**
 * ControlSurfaces UI Component
 *
 * Displays the ControlSurfaces section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createFlexCheckboxes,
    createFlexSelect,
    StatDisplayConfig,
    createStatsTable,
    createCollapsibleSection,
    updateStatsTable
} from '../dom_utils';

// Cache interface for type safety
interface ControlSurfacesCache {
    aileronSelect: HTMLSelectElement;
    rudderSelect: HTMLSelectElement;
    elevatorSelect: HTMLSelectElement;
    flapsSelect: HTMLSelectElement;
    slatsSelect: HTMLSelectElement;
    dragCheckboxes: HTMLInputElement[];
    statsTables: HTMLTableElement;
}

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

export class ControlSurfacesUI extends BaseComponentUI {
    private cache: ControlSurfacesCache = undefined;

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

        const bindings = bridge.getControlSurfacesBindings();

        // Create main table with 3 columns: Control Surfaces | Drag Inducers | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_control_surfaces';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Control Surfaces Control Surfaces'),
            localization.translate('Control Surfaces Drag Inducers'),
            localization.translate('Control Surfaces Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Control surfaces cell (5 selects in flex section)
        const csCell = document.createElement('td');
        const surfaceSelects = this.createControlSurfacesSection(csCell, bindings, bridge);
        dataRow.appendChild(csCell);

        // Drag inducers cell (checkboxes in flex section)
        const dragCell = document.createElement('td');
        const dragCheckboxes = this.createDragInducersSection(dragCell, bindings, bridge);
        dataRow.appendChild(dragCell);

        // Stats cell
        const statsCell = document.createElement('td');
        const stats = bridge.getControlSurfacesStats();
        const statsTables = createStatsTable(stats, CONTROLS_STATS);
        dataRow.appendChild(statsTables);

        mainTable.appendChild(dataRow);

        // Cache elements
        this.cache = {
            ...surfaceSelects,
            dragCheckboxes,
            statsTables
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Control Surfaces Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            mainTable,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Control_Surfaces');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[ControlSurfacesUI] Full rebuild complete');
    }

    /**
     * Create control surfaces section (5 selects in flex layout)
     */
    private createControlSurfacesSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        aileronSelect: HTMLSelectElement;
        rudderSelect: HTMLSelectElement;
        elevatorSelect: HTMLSelectElement;
        flapsSelect: HTMLSelectElement;
        slatsSelect: HTMLSelectElement;
    } {
        const flexContainer = createFlexSection();

        // Expected order: aileron_sel, rudder_sel, elevator_sel, flaps_sel, slats_sel
        const surfaces = ['aileron_sel', 'rudder_sel', 'elevator_sel', 'flaps_sel', 'slats_sel'];
        const labels = [
            'Control Surfaces Ailerons',
            'Control Surfaces Rudders',
            'Control Surfaces Elevators',
            'Control Surfaces Flaps',
            'Control Surfaces Slats'
        ];

        const selects: HTMLSelectElement[] = [];

        surfaces.forEach((surfaceKey, idx) => {
            const binding = bindings[surfaceKey];
            if (!binding || !binding.options) return;

            // Create select using helper
            const select = createFlexSelect(
                binding,
                flexContainer,
                (selectedIndex) => {
                    const bindings = bridge.getControlSurfacesBindings();
                    bindings[surfaceKey].selected = selectedIndex;
                    bridge.setControlSurfacesBindings(bindings);
                    this.onUpdate();
                },
                localization.translate(labels[idx])
            );
            selects.push(select);
        });

        cell.appendChild(flexContainer.div0);

        return {
            aileronSelect: selects[0],
            rudderSelect: selects[1],
            elevatorSelect: selects[2],
            flapsSelect: selects[3],
            slatsSelect: selects[4]
        };
    }

    /**
     * Create drag inducers section (checkboxes in flex layout)
     */
    private createDragInducersSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLInputElement[] {
        const flexContainer = createFlexSection();

        // Get the drag_sel check_list binding (flat array of {name, enabled, selected})
        const dragBinding = bindings.drag_sel;
        if (!dragBinding || !Array.isArray(dragBinding)) {
            cell.appendChild(flexContainer.div0);
            return [];
        }

        // Use createFlexCheckboxes helper
        const checkboxes = createFlexCheckboxes(
            flexContainer,
            dragBinding,
            (idx) => (checked) => {
                const bindings = bridge.getControlSurfacesBindings();
                bindings.drag_sel[idx].selected = checked;
                bridge.setControlSurfacesBindings(bindings);
                this.onUpdate();
            }
        );

        cell.appendChild(flexContainer.div0);
        return checkboxes;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getControlSurfacesBindings();

        // Update control surface selects
        updateSelectElement(this.cache.aileronSelect, bindings.aileron_sel);
        updateSelectElement(this.cache.rudderSelect, bindings.rudder_sel);
        updateSelectElement(this.cache.elevatorSelect, bindings.elevator_sel);
        updateSelectElement(this.cache.flapsSelect, bindings.flaps_sel);
        updateSelectElement(this.cache.slatsSelect, bindings.slats_sel);

        // Update drag inducer checkboxes
        if (bindings.drag_sel && Array.isArray(bindings.drag_sel)) {
            bindings.drag_sel.forEach((item: any, idx: number) => {
                if (idx < this.cache!.dragCheckboxes.length) {
                    this.cache!.dragCheckboxes[idx].checked = item.selected;
                    this.cache!.dragCheckboxes[idx].disabled = !item.enabled;
                }
            });
        }

        // Update stat values
        const stats = bridge.getControlSurfacesStats();
        updateStatsTable(this.cache.statsTables, stats, CONTROLS_STATS);
    }
}
