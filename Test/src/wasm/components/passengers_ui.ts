/**
 * Passengers UI Component
 *
 * Displays the Passengers section using UIBindings from Rust
 * Matches the original TypeScript layout with table structure
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class PassengersUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private mainTable: HTMLTableElement | null = null;
    private seatsInput: HTMLInputElement | null = null;
    private bedsInput: HTMLInputElement | null = null;
    private connectCheckbox: HTMLInputElement | null = null;
    private massCell: HTMLTableCellElement | null = null;
    private reqsectionsCell: HTMLTableCellElement | null = null;

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
            throw new Error('Bridge not available during PassengersUI construction');
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
     * Render the Passengers UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[PassengersUI] Bridge not initialized, skipping render');
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
        this.seatsInput = null;
        this.bedsInput = null;
        this.connectCheckbox = null;
        this.massCell = null;
        this.reqsectionsCell = null;

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[PassengersUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getPassengersBindings();

        // Create main table matching original layout
        this.mainTable = document.createElement('table');
        this.mainTable.style.width = '100%';
        this.mainTable.id = 'table_passengers';

        // Header row: Number of Seats | Number of Beds | Upgrade | Mass | Required Sections
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Passengers Number of Seats'),
            localization.translate('Passengers Number of Beds'),
            localization.translate('Passengers Upgrade'),
            localization.translate('Stat Mass'),
            localization.translate('Stat Required Sections')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        this.mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Seats input cell
        const seatsCell = document.createElement('td');
        this.seatsInput = document.createElement('input');
        this.seatsInput.type = 'number';
        this.seatsInput.min = '0';
        this.seatsInput.value = bindings.seats.value.toString();
        this.seatsInput.disabled = !bindings.seats.enabled;
        this.seatsInput.addEventListener('change', () => {
            const updatedBindings = bridge.getPassengersBindings();
            updatedBindings.seats.value = parseInt(this.seatsInput!.value) || 0;
            bridge.setPassengersBindings(updatedBindings);
            this.render();
            console.log(`[PassengersUI] Seats changed to ${this.seatsInput!.value}`);
        });
        seatsCell.appendChild(this.seatsInput);
        dataRow.appendChild(seatsCell);

        // Beds input cell
        const bedsCell = document.createElement('td');
        this.bedsInput = document.createElement('input');
        this.bedsInput.type = 'number';
        this.bedsInput.min = '0';
        this.bedsInput.value = bindings.beds.value.toString();
        this.bedsInput.disabled = !bindings.beds.enabled;
        this.bedsInput.addEventListener('change', () => {
            const updatedBindings = bridge.getPassengersBindings();
            updatedBindings.beds.value = parseInt(this.bedsInput!.value) || 0;
            bridge.setPassengersBindings(updatedBindings);
            this.render();
            console.log(`[PassengersUI] Beds changed to ${this.bedsInput!.value}`);
        });
        bedsCell.appendChild(this.bedsInput);
        dataRow.appendChild(bedsCell);

        // Upgrade cell with flex section for connectivity checkbox
        const upgradeCell = document.createElement('td');
        const flexContainer = this.createFlexSection();

        // Create checkbox in flex layout
        const connectLabel = document.createElement('label');
        connectLabel.textContent = localization.translate('Passengers Connectivity');
        connectLabel.className = 'flex-item';
        connectLabel.style.marginLeft = '0.25em';
        connectLabel.style.marginRight = '0.5em';
        flexContainer.div1.appendChild(connectLabel);

        const checkboxSpan = document.createElement('span');
        this.connectCheckbox = document.createElement('input');
        this.connectCheckbox.type = 'checkbox';
        this.connectCheckbox.checked = bindings.connected.selected;
        this.connectCheckbox.disabled = !bindings.connected.enabled;
        this.connectCheckbox.addEventListener('change', () => {
            const updatedBindings = bridge.getPassengersBindings();
            updatedBindings.connected.selected = this.connectCheckbox!.checked;
            bridge.setPassengersBindings(updatedBindings);
            this.render();
            console.log(`[PassengersUI] Connectivity changed to ${this.connectCheckbox!.checked}`);
        });

        const emptyLabel = document.createElement('label');
        checkboxSpan.appendChild(emptyLabel);
        checkboxSpan.appendChild(this.connectCheckbox);
        flexContainer.div2.appendChild(checkboxSpan);

        upgradeCell.appendChild(flexContainer.div0);
        dataRow.appendChild(upgradeCell);

        // Mass stat cell
        this.massCell = document.createElement('td');
        this.massCell.textContent = '0';
        dataRow.appendChild(this.massCell);

        // Required sections stat cell
        this.reqsectionsCell = document.createElement('td');
        this.reqsectionsCell.textContent = '0';
        dataRow.appendChild(this.reqsectionsCell);

        this.mainTable.appendChild(dataRow);

        // Update stat values
        this.updateStatValues(bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Passengers Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            this.mainTable,
            true // Initially open
        );

        // Add rules link (h4)
        const rulesLine = document.createElement('h4');
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Passengers';
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

        console.log('[PassengersUI] Full rebuild complete');
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
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            return;
        }

        const bindings = bridge.getPassengersBindings();

        // Update input values
        if (this.seatsInput) {
            this.seatsInput.value = bindings.seats.value.toString();
            this.seatsInput.disabled = !bindings.seats.enabled;
        }

        if (this.bedsInput) {
            this.bedsInput.value = bindings.beds.value.toString();
            this.bedsInput.disabled = !bindings.beds.enabled;
        }

        if (this.connectCheckbox) {
            this.connectCheckbox.checked = bindings.connected.selected;
            this.connectCheckbox.disabled = !bindings.connected.enabled;
        }

        // Update stat values
        this.updateStatValues(bridge);
    }

    /**
     * Update stat cell values with blink effect
     */
    private updateStatValues(bridge: AircraftBridge): void {
        const stats = bridge.getPassengersStats();

        if (this.massCell) {
            this.blinkIfChanged(this.massCell, stats.mass?.toString() || '0', false);
        }

        if (this.reqsectionsCell) {
            this.blinkIfChanged(this.reqsectionsCell, stats.reqsections?.toString() || '0', false);
        }
    }

    /**
     * Blink animation when stat changes (matching original BlinkIfChanged)
     * For now, just update the text. Animation could be added later.
     */
    private blinkIfChanged(elem: HTMLTableCellElement, str: string, positiveGood: boolean | null): void {
        // TODO: Add blink animation classes if needed
        // For now, just update the text
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
        this.seatsInput = null;
        this.bedsInput = null;
        this.connectCheckbox = null;
        this.massCell = null;
        this.reqsectionsCell = null;
    }
}
