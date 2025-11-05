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
            const upgradesRow = document.createElement('tr');
            const upgradesLabelCell = document.createElement('td');
            upgradesLabelCell.style.textAlign = 'left';
            upgradesLabelCell.style.paddingRight = '10px';
            upgradesLabelCell.style.verticalAlign = 'top';
            const upgradesLabel = document.createElement('strong');
            upgradesLabel.textContent = localization.translate('Cockpit Upgrade') + ':';
            upgradesLabelCell.appendChild(upgradesLabel);

            const upgradesInputCell = document.createElement('td');
            upgradesInputCell.style.textAlign = 'right';
            upgradesInputCell.style.verticalAlign = 'top';
            const upgradesList = this.renderer.renderCheckList(
                cockpitOptions.selected_upgrades,
                (idx, checked) => {
                    cockpitOptions.selected_upgrades[idx].selected = checked;
                    bridge.setCockpitsBindings(allBindings);
                    // Re-render to update enabled states
                    this.render();
                }
            );
            upgradesInputCell.appendChild(upgradesList);

            upgradesRow.appendChild(upgradesLabelCell);
            upgradesRow.appendChild(upgradesInputCell);
            innerTable.appendChild(upgradesRow);
        }

        // Safety options section
        if (cockpitOptions.selected_safety.length > 0) {
            const safetyRow = document.createElement('tr');
            const safetyLabelCell = document.createElement('td');
            safetyLabelCell.style.textAlign = 'left';
            safetyLabelCell.style.paddingRight = '10px';
            safetyLabelCell.style.verticalAlign = 'top';
            const safetyLabel = document.createElement('strong');
            safetyLabel.textContent = localization.translate('Cockpit Safety Options') + ':';
            safetyLabelCell.appendChild(safetyLabel);

            const safetyInputCell = document.createElement('td');
            safetyInputCell.style.textAlign = 'right';
            safetyInputCell.style.verticalAlign = 'top';
            const safetyList = this.renderer.renderCheckList(
                cockpitOptions.selected_safety,
                (idx, checked) => {
                    cockpitOptions.selected_safety[idx].selected = checked;
                    bridge.setCockpitsBindings(allBindings);
                    // Re-render to update enabled states
                    this.render();
                }
            );
            safetyInputCell.appendChild(safetyList);

            safetyRow.appendChild(safetyLabelCell);
            safetyRow.appendChild(safetyInputCell);
            innerTable.appendChild(safetyRow);
        }

        // Gunsights section
        if (cockpitOptions.selected_gunsights.length > 0) {
            const gunsightsRow = document.createElement('tr');
            const gunsightsLabelCell = document.createElement('td');
            gunsightsLabelCell.style.textAlign = 'left';
            gunsightsLabelCell.style.paddingRight = '10px';
            gunsightsLabelCell.style.verticalAlign = 'top';
            const gunsightsLabel = document.createElement('strong');
            gunsightsLabel.textContent = localization.translate('Cockpit Gunsights') + ':';
            gunsightsLabelCell.appendChild(gunsightsLabel);

            const gunsightsInputCell = document.createElement('td');
            gunsightsInputCell.style.textAlign = 'right';
            gunsightsInputCell.style.verticalAlign = 'top';
            const gunsightsList = this.renderer.renderCheckList(
                cockpitOptions.selected_gunsights,
                (idx, checked) => {
                    cockpitOptions.selected_gunsights[idx].selected = checked;
                    bridge.setCockpitsBindings(allBindings);
                    // Re-render to update enabled states
                    this.render();
                }
            );
            gunsightsInputCell.appendChild(gunsightsList);

            gunsightsRow.appendChild(gunsightsLabelCell);
            gunsightsRow.appendChild(gunsightsInputCell);
            innerTable.appendChild(gunsightsRow);
        }

        // Bombsight section
        const bombsightRow = document.createElement('tr');
        const bombsightLabelCell = document.createElement('td');
        bombsightLabelCell.style.textAlign = 'left';
        bombsightLabelCell.style.paddingRight = '10px';
        bombsightLabelCell.style.verticalAlign = 'middle';
        const bombsightLabel = document.createElement('strong');
        bombsightLabel.textContent = localization.translate('Cockpit Bombsight') + ':';
        bombsightLabelCell.appendChild(bombsightLabel);

        const bombsightInputCell = document.createElement('td');
        bombsightInputCell.style.textAlign = 'right';
        bombsightInputCell.style.verticalAlign = 'middle';
        const bombsightControl = this.renderer.renderNumber(
            cockpitOptions.bombsight,
            (newValue) => {
                cockpitOptions.bombsight.value = newValue;
                bridge.setCockpitsBindings(allBindings);
                // Re-render to update enabled states
                this.render();
            },
            0,   // min
            20,  // max
            1    // step
        );
        bombsightInputCell.appendChild(bombsightControl);

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
