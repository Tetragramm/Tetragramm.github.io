/**
 * ControlSurfaces UI Component
 *
 * Displays the ControlSurfaces section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class ControlSurfacesUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;
    private aileronSelect: HTMLSelectElement | null = null;
    private rudderSelect: HTMLSelectElement | null = null;
    private elevatorSelect: HTMLSelectElement | null = null;
    private flapsSelect: HTMLSelectElement | null = null;
    private slatsSelect: HTMLSelectElement | null = null;
    private dragCheckboxes: HTMLInputElement[] = [];
    private statCells: Map<string, HTMLTableCellElement> = new Map();

    constructor(
        private getBridge: () => AircraftBridge | null,
        containerId: string,
        private onUpdate?: () => void
    ) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element '${containerId}' not found`);
        }
        this.container = container;

        // Get the initial bridge for renderer
        const bridge = this.getBridge();
        if (!bridge) {
            throw new Error('Bridge not available during ControlSurfacesUI construction');
        }

        // Create renderer with stats update callback
        this.renderer = new BindingRenderer(bridge, () => {
            if (this.onUpdate) {
                this.onUpdate();
            }
        });

        // Listen for locale changes and do full rebuild (text changes)
        localization.onLocaleChange(() => this.rebuildFull());

        this.render();
    }

    /**
     * Render the ControlSurfaces UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[ControlSurfacesUI] Bridge not initialized, skipping render');
            return;
        }

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.mainTable) {
            this.updateValues();
        } else {
            this.rebuildFull();
        }
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    private rebuildFull(): void {
        // Clear cache
        this.mainTable = null;
        this.aileronSelect = null;
        this.rudderSelect = null;
        this.elevatorSelect = null;
        this.flapsSelect = null;
        this.slatsSelect = null;
        this.dragCheckboxes = [];
        this.statCells.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[ControlSurfacesUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getControlSurfacesBindings();

        // Create main table with 3 columns: Control Surfaces | Drag Inducers | Stats
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'tbl_control_surfaces';

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
        this.mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Control surfaces cell (5 selects in flex section)
        const csCell = document.createElement('td');
        this.createControlSurfacesSection(csCell, bindings, bridge);
        dataRow.appendChild(csCell);

        // Drag inducers cell (checkboxes in flex section)
        const dragCell = document.createElement('td');
        this.createDragInducersSection(dragCell, bindings, bridge);
        dataRow.appendChild(dragCell);

        // Stats cell
        const statsCell = document.createElement('td');
        this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        this.mainTable.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Control Surfaces Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            this.mainTable,
            true // Initially open
        );

        // Add rules link
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Control_Surfaces';
        const rulesText = document.createElement('u');
        rulesText.textContent = 'Rules';
        rulesLink.appendChild(rulesText);
        rulesLine.appendChild(document.createTextNode('('));
        rulesLine.appendChild(rulesLink);
        rulesLine.appendChild(document.createTextNode(')'));

        // Insert rules link before content
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[ControlSurfacesUI] Full rebuild complete');
    }

    /**
     * Create flex section matching original Tools.ts CreateFlexSection
     */
    private createFlexSection(): { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement } {
        const div0 = document.createElement('div');
        div0.className = 'flex-container-o';

        const div1 = document.createElement('div');
        div1.className = 'flex-container-i';

        const div2 = document.createElement('div');
        div2.className = 'flex-container-i';

        div0.appendChild(div1);
        div0.appendChild(div2);

        return { div0, div1, div2 };
    }

    /**
     * Create control surfaces section (5 selects in flex layout)
     */
    private createControlSurfacesSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Expected order: ailerons, rudders, elevators, flaps, slats
        const surfaces = ['ailerons', 'rudders', 'elevators', 'flaps', 'slats'];
        const labels = [
            'Control Surfaces Ailerons',
            'Control Surfaces Rudders',
            'Control Surfaces Elevators',
            'Control Surfaces Flaps',
            'Control Surfaces Slats'
        ];

        surfaces.forEach((surfaceKey, idx) => {
            const binding = bindings[surfaceKey];
            if (!binding || !binding.options) return;

            // Create label
            const label = document.createElement('label');
            label.textContent = localization.translate(labels[idx]);
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            // Create select
            const select = document.createElement('select');
            select.className = 'flex-item';
            select.disabled = !binding.enabled;

            binding.options.forEach((opt: any, optIdx: number) => {
                const option = document.createElement('option');
                option.value = optIdx.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                if (optIdx === binding.selected) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            select.addEventListener('change', () => {
                const updatedBindings = bridge.getControlSurfacesBindings();
                updatedBindings[surfaceKey].selected = parseInt(select.value);
                bridge.setControlSurfacesBindings(updatedBindings);
                this.render();
            });

            flexContainer.div2.appendChild(select);

            // Store references
            if (surfaceKey === 'ailerons') this.aileronSelect = select;
            else if (surfaceKey === 'rudders') this.rudderSelect = select;
            else if (surfaceKey === 'elevators') this.elevatorSelect = select;
            else if (surfaceKey === 'flaps') this.flapsSelect = select;
            else if (surfaceKey === 'slats') this.slatsSelect = select;
        });

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create drag inducers section (checkboxes in flex layout)
     */
    private createDragInducersSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Find all drag inducer checkboxes (check bindings)
        const dragKeys: string[] = [];
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'selected' in binding &&
                typeof binding.selected === 'boolean' && !['ailerons', 'rudders', 'elevators', 'flaps', 'slats'].includes(key)) {
                dragKeys.push(key);
            }
        }

        // Render drag inducer checkboxes
        dragKeys.forEach(key => {
            const binding = bindings[key];

            const label = document.createElement('label');
            label.textContent = binding.name;
            label.className = 'flex-item';
            label.style.marginLeft = '0.25em';
            label.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(label);

            const checkboxSpan = document.createElement('span');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'flex-item';
            checkbox.checked = binding.selected;
            checkbox.disabled = !binding.enabled;
            checkbox.addEventListener('change', () => {
                const updatedBindings = bridge.getControlSurfacesBindings();
                updatedBindings[key].selected = checkbox.checked;
                bridge.setControlSurfacesBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(checkbox);
            flexContainer.div2.appendChild(checkboxSpan);

            this.dragCheckboxes.push(checkbox);
        });

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create stats section (inner table with 8 stats)
     */
    private createStatsSection(cell: HTMLTableCellElement): void {
        cell.className = 'inner_table';
        const statsTable = document.createElement('table');
        statsTable.className = 'inner_table';

        // Row 1: Drag | Mass | Cost
        const header1 = statsTable.insertRow();
        ['Stat Drag', 'Stat Mass', 'Stat Cost'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header1.appendChild(th);
        });

        const data1 = statsTable.insertRow();
        ['drag', 'mass', 'cost'].forEach(key => {
            const td = data1.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 2: Control | Pitch Stability | Lateral Stability
        const header2 = statsTable.insertRow();
        ['Stat Control', 'Stat Pitch Stability', 'Stat Lateral Stability'].forEach(key => {
            const th = document.createElement('th');
            th.textContent = localization.translate(key);
            header2.appendChild(th);
        });

        const data2 = statsTable.insertRow();
        ['control', 'pitchstab', 'latstab'].forEach(key => {
            const td = data2.insertCell();
            td.textContent = '0';
            this.statCells.set(key, td);
        });

        // Row 3: Lift Bleed | Crash Safety | (empty)
        const header3 = statsTable.insertRow();
        const th3_1 = document.createElement('th');
        th3_1.textContent = localization.translate('Stat Lift Bleed');
        header3.appendChild(th3_1);
        const th3_2 = document.createElement('th');
        th3_2.textContent = localization.translate('Stat Crash Safety');
        header3.appendChild(th3_2);
        const th3_3 = document.createElement('th');
        th3_3.textContent = ' ';
        header3.appendChild(th3_3);

        const data3 = statsTable.insertRow();
        const td3_1 = data3.insertCell();
        td3_1.textContent = '0';
        this.statCells.set('liftbleed', td3_1);
        const td3_2 = data3.insertCell();
        td3_2.textContent = '0';
        this.statCells.set('crashsafety', td3_2);
        data3.insertCell(); // empty cell

        cell.appendChild(statsTable);
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            return;
        }

        const bindings = bridge.getControlSurfacesBindings();

        // Update control surface selects
        if (this.aileronSelect && bindings.ailerons) {
            this.aileronSelect.selectedIndex = bindings.ailerons.selected;
            this.aileronSelect.disabled = !bindings.ailerons.enabled;
            bindings.ailerons.options.forEach((opt: any, idx: number) => {
                if (idx < this.aileronSelect!.options.length) {
                    this.aileronSelect!.options[idx].disabled = !opt.enabled;
                }
            });
        }

        if (this.rudderSelect && bindings.rudders) {
            this.rudderSelect.selectedIndex = bindings.rudders.selected;
            this.rudderSelect.disabled = !bindings.rudders.enabled;
        }

        if (this.elevatorSelect && bindings.elevators) {
            this.elevatorSelect.selectedIndex = bindings.elevators.selected;
            this.elevatorSelect.disabled = !bindings.elevators.enabled;
        }

        if (this.flapsSelect && bindings.flaps) {
            this.flapsSelect.selectedIndex = bindings.flaps.selected;
            this.flapsSelect.disabled = !bindings.flaps.enabled;
        }

        if (this.slatsSelect && bindings.slats) {
            this.slatsSelect.selectedIndex = bindings.slats.selected;
            this.slatsSelect.disabled = !bindings.slats.enabled;
        }

        // Update drag inducer checkboxes
        let dragIdx = 0;
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'selected' in binding &&
                typeof binding.selected === 'boolean' && !['ailerons', 'rudders', 'elevators', 'flaps', 'slats'].includes(key)) {
                if (dragIdx < this.dragCheckboxes.length) {
                    this.dragCheckboxes[dragIdx].checked = binding.selected;
                    this.dragCheckboxes[dragIdx].disabled = !binding.enabled;
                    dragIdx++;
                }
            }
        }

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values
     */
    private updateStatValues(bridge: AircraftBridge): void {
        const stats = bridge.getControlSurfacesStats();

        for (const [key, cell] of this.statCells) {
            const value = stats[key];
            this.blinkIfChanged(cell, value?.toString() || '0', false);
        }
    }

    /**
     * Blink animation when stat changes
     */
    private blinkIfChanged(elem: HTMLTableCellElement, str: string, positiveGood: boolean | null): void {
        if (elem.textContent !== str) {
            elem.textContent = str;
        }
    }

    /**
     * Update the UI (e.g., when data changes externally)
     */
    update(): void {
        this.render();
    }

    /**
     * Destroy the component and clean up listeners
     */
    destroy(): void {
        this.container.innerHTML = '';
        this.mainTable = null;
        this.aileronSelect = null;
        this.rudderSelect = null;
        this.elevatorSelect = null;
        this.flapsSelect = null;
        this.slatsSelect = null;
        this.dragCheckboxes = [];
        this.statCells.clear();
    }
}
