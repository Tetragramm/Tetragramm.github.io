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
        private bridge: AircraftBridge,
        containerId: string,
        private onUpdate?: () => void
    ) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container element '${containerId}' not found`);
        }
        this.container = container;

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

        if (!this.bridge.isInitialized()) {
            console.warn('[CockpitsUI] Bridge not initialized, skipping render');
            return;
        }

        // Get Cockpits bindings from Rust (includes localized strings)
        const cockpitsBindings = this.bridge.getCockpitsBindings();

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Number of cockpits control
        const numCockpitsRow = document.createElement('h4');
        const numCockpitsControl = this.renderer.renderNumber(
            cockpitsBindings.num_cockpits,
            (newValue) => {
                cockpitsBindings.num_cockpits.value = newValue;
                this.bridge.setCockpitsBindings(cockpitsBindings);
                // Re-render to show new cockpits
                this.render();
            },
            1,  // min
            20, // max
            1   // step
        );
        numCockpitsRow.appendChild(numCockpitsControl);
        contentDiv.appendChild(numCockpitsRow);

        // Render each cockpit position
        const table = document.createElement('table');
        table.style.width = '100%';
        table.id = 'table_cockpit';

        cockpitsBindings.positions.forEach((cockpitOptions, idx) => {
            const cockpitSection = this.renderCockpit(cockpitOptions, idx, cockpitsBindings);
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
        allBindings: CockpitsOptions
    ): HTMLElement {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.style.border = '1px solid #ccc';
        cell.style.padding = '10px';
        cell.style.marginBottom = '10px';

        // Cockpit header
        const header = document.createElement('h4');
        header.textContent = `${localization.translate('Seat #')} ${index + 1}`;
        header.style.marginTop = '0';
        cell.appendChild(header);

        // Cockpit type selection
        const typeLabel = document.createElement('strong');
        typeLabel.textContent = localization.translate('Cockpit Option') + ': ';
        cell.appendChild(typeLabel);

        const typeSelect = this.renderer.renderSelect(
            cockpitOptions.selected_type,
            (selectedIndex) => {
                cockpitOptions.selected_type.selected = selectedIndex;
                this.bridge.setCockpitsBindings(allBindings);
                // Re-render to update enabled states
                this.render();
            }
        );
        cell.appendChild(typeSelect);
        cell.appendChild(document.createElement('br'));
        cell.appendChild(document.createElement('br'));

        // Upgrades section
        if (cockpitOptions.selected_upgrades.length > 0) {
            const upgradesLabel = document.createElement('strong');
            upgradesLabel.textContent = localization.translate('Cockpit Upgrade') + ':';
            cell.appendChild(upgradesLabel);
            cell.appendChild(document.createElement('br'));

            const upgradesList = this.renderer.renderCheckList(
                cockpitOptions.selected_upgrades,
                (idx, checked) => {
                    cockpitOptions.selected_upgrades[idx].selected = checked;
                    this.bridge.setCockpitsBindings(allBindings);
                    // Re-render to update enabled states
                    this.render();
                }
            );
            cell.appendChild(upgradesList);
            cell.appendChild(document.createElement('br'));
        }

        // Safety options section
        if (cockpitOptions.selected_safety.length > 0) {
            const safetyLabel = document.createElement('strong');
            safetyLabel.textContent = localization.translate('Cockpit Safety Options') + ':';
            cell.appendChild(safetyLabel);
            cell.appendChild(document.createElement('br'));

            const safetyList = this.renderer.renderCheckList(
                cockpitOptions.selected_safety,
                (idx, checked) => {
                    cockpitOptions.selected_safety[idx].selected = checked;
                    this.bridge.setCockpitsBindings(allBindings);
                    // Re-render to update enabled states
                    this.render();
                }
            );
            cell.appendChild(safetyList);
            cell.appendChild(document.createElement('br'));
        }

        // Gunsights section
        if (cockpitOptions.selected_gunsights.length > 0) {
            const gunsightsLabel = document.createElement('strong');
            gunsightsLabel.textContent = localization.translate('Cockpit Gunsights') + ':';
            cell.appendChild(gunsightsLabel);
            cell.appendChild(document.createElement('br'));

            const gunsightsList = this.renderer.renderCheckList(
                cockpitOptions.selected_gunsights,
                (idx, checked) => {
                    cockpitOptions.selected_gunsights[idx].selected = checked;
                    this.bridge.setCockpitsBindings(allBindings);
                    // Re-render to update enabled states
                    this.render();
                }
            );
            cell.appendChild(gunsightsList);
            cell.appendChild(document.createElement('br'));
        }

        // Bombsight section
        const bombsightLabel = document.createElement('strong');
        bombsightLabel.textContent = localization.translate('Cockpit Bombsight') + ':';
        cell.appendChild(bombsightLabel);
        cell.appendChild(document.createElement('br'));

        const bombsightControl = this.renderer.renderNumber(
            cockpitOptions.bombsight,
            (newValue) => {
                cockpitOptions.bombsight.value = newValue;
                this.bridge.setCockpitsBindings(allBindings);
                // Re-render to update enabled states
                this.render();
            },
            0,   // min
            20,  // max
            1    // step
        );
        cell.appendChild(bombsightControl);

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
