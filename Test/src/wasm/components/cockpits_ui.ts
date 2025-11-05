/**
 * Cockpits UI Component
 *
 * Displays the Cockpits section using UIBindings from Rust
 * Handles multiple cockpit positions with types, upgrades, safety, and gunsights
 */

import { AircraftBridge, CockpitsOptions, CockpitOptions } from '../aircraft_bridge';
import { BindingRenderer, NumberBinding, CheckBinding } from '../binding_renderer';
import { localization } from '../localization';

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

        // Number of cockpits control (using table layout for consistency)
        const controlTable = document.createElement('table');
        controlTable.style.width = 'auto';
        controlTable.style.borderCollapse = 'collapse';
        controlTable.style.marginBottom = '10px';

        const numCockpitsRow = document.createElement('tr');
        const numCockpitsLabelCell = document.createElement('td');
        numCockpitsLabelCell.style.textAlign = 'left';
        numCockpitsLabelCell.style.paddingRight = '10px';
        numCockpitsLabelCell.style.verticalAlign = 'middle';

        const numCockpitsInputCell = document.createElement('td');
        numCockpitsInputCell.style.textAlign = 'right';
        numCockpitsInputCell.style.verticalAlign = 'middle';
        const numCockpitsControl = this.renderer.renderNumber(
            cockpitsBindings.num_cockpits,
            (newValue) => {
                cockpitsBindings.num_cockpits.value = newValue;
                bridge.setCockpitsBindings(cockpitsBindings);
                // Re-render to show new cockpits
                this.render();
            },
            1,  // min
            20, // max
            1   // step
        );
        numCockpitsInputCell.appendChild(numCockpitsControl);

        numCockpitsRow.appendChild(numCockpitsLabelCell);
        numCockpitsRow.appendChild(numCockpitsInputCell);
        controlTable.appendChild(numCockpitsRow);
        contentDiv.appendChild(controlTable);

        // Render each cockpit position
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_cockpit';

        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            const cockpitSection = this.renderCockpit(cockpitOptions, idx, cockpitsBindings, bridge);
            table.appendChild(cockpitSection);
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
     * Render a single cockpit
     */
    private renderCockpit(
        cockpitOptions: CockpitOptions,
        index: number,
        allBindings: CockpitsOptions,
        bridge: AircraftBridge
    ): HTMLElement {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '10px';
        cell.style.marginBottom = '10px';

        // Cockpit header
        const header = document.createElement('h4');
        header.textContent = localization.translateWithParam('Seat #', index + 1);
        header.style.marginTop = '0';
        cell.appendChild(header);

        // Create inner table for aligned layout
        const innerTable = document.createElement('table');
        innerTable.style.width = 'auto'; // Only as wide as needed
        innerTable.style.borderCollapse = 'collapse';

        // Cockpit type selection
        const typeRow = document.createElement('tr');
        const typeLabelCell = document.createElement('td');
        typeLabelCell.style.textAlign = 'left';
        typeLabelCell.style.paddingRight = '10px';
        typeLabelCell.style.verticalAlign = 'middle';
        const typeLabel = document.createElement('strong');
        typeLabel.textContent = localization.translate('Cockpit Option') + ':';
        typeLabelCell.appendChild(typeLabel);

        const typeInputCell = document.createElement('td');
        typeInputCell.style.textAlign = 'right';
        typeInputCell.style.verticalAlign = 'middle';
        const typeSelect = this.renderer.renderSelect(
            cockpitOptions.selected_type,
            (selectedIndex) => {
                cockpitOptions.selected_type.selected = selectedIndex;
                bridge.setCockpitsBindings(allBindings);
                // Re-render to update enabled states
                this.render();
            }
        );
        typeInputCell.appendChild(typeSelect);

        typeRow.appendChild(typeLabelCell);
        typeRow.appendChild(typeInputCell);
        innerTable.appendChild(typeRow);

        // Upgrades section
        if (cockpitOptions.selected_upgrades.length > 0) {
            // Section header
            const upgradesHeaderRow = document.createElement('tr');
            const upgradesHeader = document.createElement('th');
            upgradesHeader.colSpan = 2;
            upgradesHeader.style.textAlign = 'center';
            upgradesHeader.style.textDecoration = 'underline';
            upgradesHeader.textContent = localization.translate('Cockpit Upgrade');
            upgradesHeaderRow.appendChild(upgradesHeader);
            innerTable.appendChild(upgradesHeaderRow);

            // Individual upgrade rows
            cockpitOptions.selected_upgrades.forEach((upgrade, idx) => {
                const upgradeRow = document.createElement('tr');

                const labelCell = document.createElement('td');
                labelCell.style.textAlign = 'left';
                labelCell.style.paddingRight = '10px';
                labelCell.style.verticalAlign = 'middle';
                labelCell.textContent = upgrade.name + ':';

                const inputCell = document.createElement('td');
                inputCell.style.textAlign = 'right';
                inputCell.style.verticalAlign = 'middle';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = upgrade.selected;
                checkbox.disabled = !upgrade.enabled;
                checkbox.addEventListener('change', () => {
                    cockpitOptions.selected_upgrades[idx].selected = checkbox.checked;
                    bridge.setCockpitsBindings(allBindings);
                    this.render();
                });
                inputCell.appendChild(checkbox);

                upgradeRow.appendChild(labelCell);
                upgradeRow.appendChild(inputCell);
                innerTable.appendChild(upgradeRow);
            });
        }

        // Safety options section
        if (cockpitOptions.selected_safety.length > 0) {
            // Section header
            const safetyHeaderRow = document.createElement('tr');
            const safetyHeader = document.createElement('th');
            safetyHeader.colSpan = 2;
            safetyHeader.style.textAlign = 'center';
            safetyHeader.style.textDecoration = 'underline';
            safetyHeader.textContent = localization.translate('Cockpit Safety Options');
            safetyHeaderRow.appendChild(safetyHeader);
            innerTable.appendChild(safetyHeaderRow);

            // Individual safety rows
            cockpitOptions.selected_safety.forEach((safety, idx) => {
                const safetyRow = document.createElement('tr');

                const labelCell = document.createElement('td');
                labelCell.style.textAlign = 'left';
                labelCell.style.paddingRight = '10px';
                labelCell.style.verticalAlign = 'middle';
                labelCell.textContent = safety.name + ':';

                const inputCell = document.createElement('td');
                inputCell.style.textAlign = 'right';
                inputCell.style.verticalAlign = 'middle';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = safety.selected;
                checkbox.disabled = !safety.enabled;
                checkbox.addEventListener('change', () => {
                    cockpitOptions.selected_safety[idx].selected = checkbox.checked;
                    bridge.setCockpitsBindings(allBindings);
                    this.render();
                });
                inputCell.appendChild(checkbox);

                safetyRow.appendChild(labelCell);
                safetyRow.appendChild(inputCell);
                innerTable.appendChild(safetyRow);
            });
        }

        // Gunsights section
        if (cockpitOptions.selected_gunsights.length > 0) {
            // Section header
            const gunsightsHeaderRow = document.createElement('tr');
            const gunsightsHeader = document.createElement('th');
            gunsightsHeader.colSpan = 2;
            gunsightsHeader.style.textAlign = 'center';
            gunsightsHeader.style.textDecoration = 'underline';
            gunsightsHeader.textContent = localization.translate('Cockpit Gunsights');
            gunsightsHeaderRow.appendChild(gunsightsHeader);
            innerTable.appendChild(gunsightsHeaderRow);

            // Individual gunsight rows
            cockpitOptions.selected_gunsights.forEach((gunsight, idx) => {
                const gunsightRow = document.createElement('tr');

                const labelCell = document.createElement('td');
                labelCell.style.textAlign = 'left';
                labelCell.style.paddingRight = '10px';
                labelCell.style.verticalAlign = 'middle';
                labelCell.textContent = gunsight.name + ':';

                const inputCell = document.createElement('td');
                inputCell.style.textAlign = 'right';
                inputCell.style.verticalAlign = 'middle';
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = gunsight.selected;
                checkbox.disabled = !gunsight.enabled;
                checkbox.addEventListener('change', () => {
                    cockpitOptions.selected_gunsights[idx].selected = checkbox.checked;
                    bridge.setCockpitsBindings(allBindings);
                    this.render();
                });
                inputCell.appendChild(checkbox);

                gunsightRow.appendChild(labelCell);
                gunsightRow.appendChild(inputCell);
                innerTable.appendChild(gunsightRow);
            });
        }

        // Bombsight section
        const bombsightHeaderRow = document.createElement('tr');
        const bombsightHeader = document.createElement('th');
        bombsightHeader.colSpan = 2;
        bombsightHeader.style.textAlign = 'center';
        bombsightHeader.style.textDecoration = 'underline';
        bombsightHeader.textContent = localization.translate('Cockpit Bombsight');
        bombsightHeaderRow.appendChild(bombsightHeader);
        innerTable.appendChild(bombsightHeaderRow);

        const bombsightRow = document.createElement('tr');
        const bombsightLabelCell = document.createElement('td');
        bombsightLabelCell.style.textAlign = 'left';
        bombsightLabelCell.style.paddingRight = '10px';
        bombsightLabelCell.style.verticalAlign = 'middle';
        bombsightLabelCell.textContent = cockpitOptions.bombsight.name + ':';

        const bombsightInputCell = document.createElement('td');
        bombsightInputCell.style.textAlign = 'right';
        bombsightInputCell.style.verticalAlign = 'middle';
        const bombsightInput = document.createElement('input');
        bombsightInput.type = 'number';
        bombsightInput.value = cockpitOptions.bombsight.value.toString();
        bombsightInput.disabled = !cockpitOptions.bombsight.enabled;
        bombsightInput.min = '0';
        bombsightInput.max = '20';
        bombsightInput.step = '1';
        bombsightInput.addEventListener('change', () => {
            const newValue = parseFloat(bombsightInput.value);
            if (!isNaN(newValue)) {
                cockpitOptions.bombsight.value = newValue;
                bridge.setCockpitsBindings(allBindings);
                this.render();
            }
        });
        bombsightInputCell.appendChild(bombsightInput);

        bombsightRow.appendChild(bombsightLabelCell);
        bombsightRow.appendChild(bombsightInputCell);
        innerTable.appendChild(bombsightRow);

        // Add the inner table to the cell
        cell.appendChild(innerTable);

        row.appendChild(cell);
        return row;
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
