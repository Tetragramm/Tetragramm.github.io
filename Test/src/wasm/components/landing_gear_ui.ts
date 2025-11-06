/**
 * LandingGear UI Component
 *
 * Displays the LandingGear section using UIBindings from Rust
 * Matches the original TypeScript 3-column table layout
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class LandingGearUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;
    private typeSelect: HTMLSelectElement | null = null;
    private retractCheckbox: HTMLInputElement | null = null;
    private extrasCheckboxes: HTMLInputElement[] = [];
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
            throw new Error('Bridge not available during LandingGearUI construction');
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
     * Render the LandingGear UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[LandingGearUI] Bridge not initialized, skipping render');
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
        this.typeSelect = null;
        this.retractCheckbox = null;
        this.extrasCheckboxes = [];
        this.statCells.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[LandingGearUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getLandingGearBindings();

        // Create main table with 3 columns: Landing Gear | Extras | Stats
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'tbl_gear';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Landing Gear Landing Gear'),
            localization.translate('Landing Gear Extras'),
            localization.translate('Landing Gear Gear Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        this.mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Landing Gear cell (type select + retractable checkbox)
        const gearCell = document.createElement('td');
        this.createGearSection(gearCell, bindings, bridge);
        dataRow.appendChild(gearCell);

        // Extras cell (list of checkboxes)
        const extrasCell = document.createElement('td');
        this.createExtrasSection(extrasCell, bindings, bridge);
        dataRow.appendChild(extrasCell);

        // Stats cell
        const statsCell = document.createElement('td');
        this.createStatsSection(statsCell);
        dataRow.appendChild(statsCell);

        this.mainTable.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Landing Gear Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            this.mainTable,
            true // Initially open
        );

        // Add rules link
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Landing_Gear';
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

        console.log('[LandingGearUI] Full rebuild complete');
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
     * Create landing gear section (type select + retractable checkbox)
     */
    private createGearSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Find gear_type and retractable bindings
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'options' in binding && 'selected' in binding) {
                // Type select
                const label = document.createElement('label');
                label.textContent = 'Type';
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                flexContainer.div1.appendChild(label);

                this.typeSelect = document.createElement('select');
                this.typeSelect.className = 'flex-item';
                this.typeSelect.disabled = !binding.enabled;

                binding.options.forEach((opt: any, idx: number) => {
                    const option = document.createElement('option');
                    option.value = idx.toString();
                    option.textContent = opt.name;
                    option.disabled = !opt.enabled;
                    if (idx === binding.selected) {
                        option.selected = true;
                    }
                    this.typeSelect!.appendChild(option);
                });

                this.typeSelect.addEventListener('change', () => {
                    const updatedBindings = bridge.getLandingGearBindings();
                    updatedBindings[key].selected = parseInt(this.typeSelect!.value);
                    bridge.setLandingGearBindings(updatedBindings);
                    this.render();
                });

                flexContainer.div2.appendChild(this.typeSelect);
            } else if (binding && typeof binding === 'object' && 'selected' in binding && typeof binding.selected === 'boolean') {
                // Retractable checkbox
                const label = document.createElement('label');
                label.textContent = binding.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                flexContainer.div1.appendChild(label);

                const checkboxSpan = document.createElement('span');
                this.retractCheckbox = document.createElement('input');
                this.retractCheckbox.type = 'checkbox';
                this.retractCheckbox.className = 'flex-item';
                this.retractCheckbox.checked = binding.selected;
                this.retractCheckbox.disabled = !binding.enabled;
                this.retractCheckbox.addEventListener('change', () => {
                    const updatedBindings = bridge.getLandingGearBindings();
                    updatedBindings[key].selected = this.retractCheckbox!.checked;
                    bridge.setLandingGearBindings(updatedBindings);
                    this.render();
                });

                const emptyLabel = document.createElement('label');
                checkboxSpan.appendChild(emptyLabel);
                checkboxSpan.appendChild(this.retractCheckbox);
                flexContainer.div2.appendChild(checkboxSpan);
            }
        }

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create extras section (list of checkboxes)
     */
    private createExtrasSection(cell: HTMLTableCellElement, bindings: any, bridge: AircraftBridge): void {
        const flexContainer = this.createFlexSection();

        // Find all checkbox bindings for extras
        const extraKeys: string[] = [];
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'selected' in binding &&
                typeof binding.selected === 'boolean' && key !== 'retractable') {
                extraKeys.push(key);
            }
        }

        // Render extras checkboxes
        extraKeys.forEach((key, idx) => {
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
                const updatedBindings = bridge.getLandingGearBindings();
                updatedBindings[key].selected = checkbox.checked;
                bridge.setLandingGearBindings(updatedBindings);
                this.render();
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(checkbox);
            flexContainer.div2.appendChild(checkboxSpan);

            this.extrasCheckboxes.push(checkbox);
        });

        cell.appendChild(flexContainer.div0);
    }

    /**
     * Create stats section (inner table with 5 stats)
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

        // Row 2: Structure | Crash Safety | (empty)
        const header2 = statsTable.insertRow();
        const th2_1 = document.createElement('th');
        th2_1.textContent = localization.translate('Stat Structure');
        header2.appendChild(th2_1);
        const th2_2 = document.createElement('th');
        th2_2.textContent = localization.translate('Stat Crash Safety');
        header2.appendChild(th2_2);
        const th2_3 = document.createElement('th');
        th2_3.textContent = '';
        header2.appendChild(th2_3);

        const data2 = statsTable.insertRow();
        const td2_1 = data2.insertCell();
        td2_1.textContent = '0';
        this.statCells.set('structure', td2_1);
        const td2_2 = data2.insertCell();
        td2_2.textContent = '0';
        this.statCells.set('crashsafety', td2_2);
        data2.insertCell(); // empty cell

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

        const bindings = bridge.getLandingGearBindings();

        // Update type select
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && 'options' in binding && this.typeSelect) {
                this.typeSelect.selectedIndex = binding.selected;
                this.typeSelect.disabled = !binding.enabled;
                binding.options.forEach((opt: any, idx: number) => {
                    if (idx < this.typeSelect!.options.length) {
                        this.typeSelect!.options[idx].disabled = !opt.enabled;
                    }
                });
                break;
            }
        }

        // Update retractable checkbox
        if (this.retractCheckbox && bindings.retractable) {
            this.retractCheckbox.checked = bindings.retractable.selected;
            this.retractCheckbox.disabled = !bindings.retractable.enabled;
        }

        // Update extras checkboxes
        let extrasIdx = 0;
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;
            const binding = bindings[key];

            if (binding && typeof binding === 'object' && 'selected' in binding &&
                typeof binding.selected === 'boolean' && key !== 'retractable') {
                if (extrasIdx < this.extrasCheckboxes.length) {
                    this.extrasCheckboxes[extrasIdx].checked = binding.selected;
                    this.extrasCheckboxes[extrasIdx].disabled = !binding.enabled;
                    extrasIdx++;
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
        const stats = bridge.getLandingGearStats();

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
        this.typeSelect = null;
        this.retractCheckbox = null;
        this.extrasCheckboxes = [];
        this.statCells.clear();
    }
}
