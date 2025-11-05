/**
 * Cockpits UI Component
 *
 * Displays the Cockpits section using UIBindings from Rust
 * Handles multiple cockpit positions with types, upgrades, safety, and gunsights
 */

import { AircraftBridge, CockpitsOptions, CockpitOptions } from '../aircraft_bridge';
import { BindingRenderer, NumberBinding, CheckBinding, StatDisplayConfig } from '../binding_renderer';
import { localization } from '../localization';

// Cockpit stats configuration
const COCKPIT_STATS: StatDisplayConfig[] = [
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'control', label: 'Stat Control', positiveIsGood: true },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    { key: '', label: '', positiveIsGood: undefined }, // Empty cell for layout
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false, isDerived: true },
    { key: 'escape', label: 'Stat Escape', positiveIsGood: true, isDerived: true },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true, isDerived: true }
];

export class CockpitsUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

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
            throw new Error('Bridge not available during CockpitsUI construction');
        }

        // Create renderer with stats update callback
        this.renderer = new BindingRenderer(bridge, () => {
            if (this.onUpdate) {
                this.onUpdate();
            }
        });

        // Listen for locale changes and re-render
        localization.onLocaleChange(() => this.render());

        this.render();
    }

    /**
     * Render the Cockpits UI
     */
    render(): void {
        // Clear existing content
        this.container.innerHTML = '';

        // Get current bridge (may be new after language change)
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[CockpitsUI] Bridge not initialized, skipping render');
            return;
        }

        // Get Cockpits bindings from Rust (includes localized strings)
        const cockpitsBindings = bridge.getCockpitsBindings();

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Number of cockpits control (simple row above table)
        const controlDiv = document.createElement('div');
        controlDiv.style.marginBottom = '10px';
        const numCockpitsLabel = document.createElement('span');
        numCockpitsLabel.textContent = cockpitsBindings.num_cockpits.name + ': ';
        numCockpitsLabel.style.marginRight = '10px';
        const numCockpitsInput = document.createElement('input');
        numCockpitsInput.type = 'number';
        numCockpitsInput.value = cockpitsBindings.num_cockpits.value.toString();
        numCockpitsInput.disabled = !cockpitsBindings.num_cockpits.enabled;
        numCockpitsInput.min = '1';
        numCockpitsInput.max = '20';
        numCockpitsInput.step = '1';
        numCockpitsInput.addEventListener('change', () => {
            const newValue = parseFloat(numCockpitsInput.value);
            if (!isNaN(newValue)) {
                cockpitsBindings.num_cockpits.value = newValue;
                bridge.setCockpitsBindings(cockpitsBindings);
                this.render();
            }
        });
        controlDiv.appendChild(numCockpitsLabel);
        controlDiv.appendChild(numCockpitsInput);
        contentDiv.appendChild(controlDiv);

        // Create main table for cockpits
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_cockpit';

        // Create header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Cockpit Option'),
            localization.translate('Cockpit Upgrade'),
            localization.translate('Cockpit Safety Options'),
            localization.translate('Cockpit Gunsights'),
            localization.translate('Cockpit Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            th.style.textAlign = 'center';
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Render each cockpit position as a table row
        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            const cockpitRow = this.renderCockpitRow(cockpitOptions, idx, cockpitsBindings, bridge);
            table.appendChild(cockpitRow);
        });

        contentDiv.appendChild(table);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Cockpit Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link (h4)
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Crew';
        const rulesText = document.createElement('u');
        rulesText.textContent = 'Rules';
        rulesLink.appendChild(rulesText);
        rulesLine.appendChild(document.createTextNode('('));
        rulesLine.appendChild(rulesLink);
        rulesLine.appendChild(document.createTextNode(')'));
        rulesLine.appendChild(document.createElement('br'));

        // Insert rules link before content
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[CockpitsUI] Rendered with locale:', localization.getCurrentLocale());
    }

    /**
     * Render a single cockpit as a table row with columns
     */
    private renderCockpitRow(
        cockpitOptions: CockpitOptions,
        index: number,
        allBindings: CockpitsOptions,
        bridge: AircraftBridge
    ): HTMLTableRowElement {
        const row = document.createElement('tr');

        // Column 1: Option (select box with no label)
        const optionCell = document.createElement('td');
        const typeSelect = document.createElement('select');
        cockpitOptions.selected_type.options.forEach((opt, idx) => {
            const option = document.createElement('option');
            option.text = opt.name;
            option.disabled = !opt.enabled;
            typeSelect.add(option);
        });
        typeSelect.selectedIndex = cockpitOptions.selected_type.selected;
        typeSelect.disabled = !cockpitOptions.selected_type.enabled;
        typeSelect.addEventListener('change', () => {
            cockpitOptions.selected_type.selected = typeSelect.selectedIndex;
            bridge.setCockpitsBindings(allBindings);
            this.render();
        });
        optionCell.appendChild(typeSelect);
        row.appendChild(optionCell);

        // Column 2: Upgrades (flex layout)
        const upgradesCell = document.createElement('td');
        const upgradesFlex = this.createFlexContainer();
        cockpitOptions.selected_upgrades.forEach((upgrade, idx) => {
            this.addFlexCheckbox(upgrade.name, upgrade.selected, upgrade.enabled, upgradesFlex, (checked) => {
                cockpitOptions.selected_upgrades[idx].selected = checked;
                bridge.setCockpitsBindings(allBindings);
                this.render();
            });
        });
        upgradesCell.appendChild(upgradesFlex);
        row.appendChild(upgradesCell);

        // Column 3: Safety Options (flex layout)
        const safetyCell = document.createElement('td');
        const safetyFlex = this.createFlexContainer();
        cockpitOptions.selected_safety.forEach((safety, idx) => {
            this.addFlexCheckbox(safety.name, safety.selected, safety.enabled, safetyFlex, (checked) => {
                cockpitOptions.selected_safety[idx].selected = checked;
                bridge.setCockpitsBindings(allBindings);
                this.render();
            });
        });
        safetyCell.appendChild(safetyFlex);
        row.appendChild(safetyCell);

        // Column 4: Gunsights + Bombsight (flex layout)
        const gunsightsCell = document.createElement('td');
        const gunsightsFlex = this.createFlexContainer();
        cockpitOptions.selected_gunsights.forEach((gunsight, idx) => {
            this.addFlexCheckbox(gunsight.name, gunsight.selected, gunsight.enabled, gunsightsFlex, (checked) => {
                cockpitOptions.selected_gunsights[idx].selected = checked;
                bridge.setCockpitsBindings(allBindings);
                this.render();
            });
        });
        // Add bombsight as number input
        this.addFlexNumberInput(cockpitOptions.bombsight.name, cockpitOptions.bombsight.value,
            cockpitOptions.bombsight.enabled, gunsightsFlex, (value) => {
                cockpitOptions.bombsight.value = value;
                bridge.setCockpitsBindings(allBindings);
                this.render();
            }, 0, 20, 1);
        gunsightsCell.appendChild(gunsightsFlex);
        row.appendChild(gunsightsCell);

        // Column 5: Stats (using stats renderer)
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        const stats = bridge.getCockpitStats(index);
        const derivedStats = bridge.getCockpitDerivedStats(index);
        const statsTable = this.renderer.renderStatsTable(stats, COCKPIT_STATS, derivedStats);
        statsCell.appendChild(statsTable);
        row.appendChild(statsCell);

        return row;
    }

    /**
     * Create a flex container similar to the original TypeScript implementation
     */
    private createFlexContainer(): HTMLElement {
        const outer = document.createElement('div');
        outer.className = 'flex-container-o';
        const left = document.createElement('div');
        left.className = 'flex-container-i';
        const right = document.createElement('div');
        right.className = 'flex-container-i';
        outer.appendChild(left);
        outer.appendChild(right);
        return outer;
    }

    /**
     * Add a checkbox with label to a flex container
     */
    private addFlexCheckbox(
        label: string,
        checked: boolean,
        enabled: boolean,
        flexContainer: HTMLElement,
        onChange: (checked: boolean) => void
    ): void {
        const left = flexContainer.children[0] as HTMLElement;
        const right = flexContainer.children[1] as HTMLElement;

        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.className = 'flex-item';
        labelElem.style.marginLeft = '0.25em';
        labelElem.style.marginRight = '0.5em';
        left.appendChild(labelElem);

        const span = document.createElement('span');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.disabled = !enabled;
        checkbox.className = 'flex-item';
        checkbox.addEventListener('change', () => onChange(checkbox.checked));
        span.appendChild(checkbox);
        right.appendChild(span);
    }

    /**
     * Add a number input with label to a flex container
     */
    private addFlexNumberInput(
        label: string,
        value: number,
        enabled: boolean,
        flexContainer: HTMLElement,
        onChange: (value: number) => void,
        min?: number,
        max?: number,
        step?: number
    ): void {
        const left = flexContainer.children[0] as HTMLElement;
        const right = flexContainer.children[1] as HTMLElement;

        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.className = 'flex-item';
        labelElem.style.marginLeft = '0.25em';
        labelElem.style.marginRight = '0.5em';
        left.appendChild(labelElem);

        const span = document.createElement('span');
        const input = document.createElement('input');
        input.type = 'number';
        input.value = value.toString();
        input.disabled = !enabled;
        input.className = 'flex-item';
        if (min !== undefined) input.min = min.toString();
        if (max !== undefined) input.max = max.toString();
        if (step !== undefined) input.step = step.toString();
        input.addEventListener('change', () => {
            const newValue = parseFloat(input.value);
            if (!isNaN(newValue)) onChange(newValue);
        });
        span.appendChild(input);
        right.appendChild(span);
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
    }
}
