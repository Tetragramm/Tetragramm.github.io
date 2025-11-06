/**
 * Fuel UI Component
 *
 * Displays the Fuel section using UIBindings from Rust
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { localization } from '../localization';

export class FuelUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private cachedElements: Map<string, HTMLElement> = new Map();

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
            throw new Error('Bridge not available during FuelUI construction');
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
     * Render the Fuel UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[FuelUI] Bridge not initialized, skipping render');
            return;
        }

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.cachedElements.size > 0) {
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
        this.cachedElements.clear();

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[FuelUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const bindings = bridge.getFuelBindings();

        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

        // Render UI bindings dynamically
        this.renderBindings(contentDiv, bindings, bridge);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Load Section Title');
        this.sectionElement = this.renderer.createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link (h4)
        const rulesLine = document.createElement('h4');
        const rulesSpan = document.createElement('span');
        rulesSpan.textContent = '(';
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Fuel';
        const rulesText = document.createElement('u');
        rulesText.textContent = 'Rules';
        rulesLink.appendChild(rulesText);
        rulesSpan.appendChild(rulesLink);
        rulesSpan.appendChild(document.createTextNode(')'));
        rulesLine.appendChild(rulesSpan);
        rulesLine.appendChild(document.createElement('br'));

        // Insert rules link before content
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[FuelUI] Full rebuild complete');
    }

    /**
     * Render UI bindings dynamically based on their structure
     */
    private renderBindings(container: HTMLElement, bindings: any, bridge: AircraftBridge): void {
        // Iterate through all properties in bindings
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;

            const binding = bindings[key];

            // Handle different binding types
            if (binding && typeof binding === 'object') {
                if ('options' in binding && 'selected' in binding) {
                    // This is a Select binding
                    const selectElement = this.renderer.renderSelect(
                        binding,
                        (selectedIndex) => {
                            const updatedBindings = bridge.getFuelBindings();
                            updatedBindings[key].selected = selectedIndex;
                            bridge.setFuelBindings(updatedBindings);
                            this.render();
                        }
                    ) as HTMLSelectElement;

                    const label = document.createElement('label');
                    label.textContent = binding.name || key;
                    label.style.marginRight = '10px';

                    const span = document.createElement('span');
                    span.appendChild(label);
                    span.appendChild(selectElement);
                    container.appendChild(span);
                    container.appendChild(document.createElement('br'));

                    this.cachedElements.set(`select_${key}`, selectElement);
                } else if ('selected' in binding && 'enabled' in binding && typeof binding.selected === 'boolean') {
                    // This is a Check binding
                    const checkElement = this.renderer.renderCheck(
                        binding,
                        (checked) => {
                            const updatedBindings = bridge.getFuelBindings();
                            updatedBindings[key].selected = checked;
                            bridge.setFuelBindings(updatedBindings);
                            this.render();
                        }
                    );

                    container.appendChild(checkElement);
                    container.appendChild(document.createElement('br'));

                    const checkbox = checkElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
                    if (checkbox) {
                        this.cachedElements.set(`check_${key}`, checkbox);
                    }
                } else if ('value' in binding && 'enabled' in binding && typeof binding.value === 'number') {
                    // This is a Number binding
                    const numberElement = this.renderer.renderNumber(
                        binding,
                        (value) => {
                            const updatedBindings = bridge.getFuelBindings();
                            updatedBindings[key].value = value;
                            bridge.setFuelBindings(updatedBindings);
                            this.render();
                        }
                    );

                    container.appendChild(numberElement);
                    container.appendChild(document.createElement('br'));

                    const input = numberElement.querySelector('input[type="number"]') as HTMLInputElement;
                    if (input) {
                        this.cachedElements.set(`number_${key}`, input);
                    }
                }
            }
        }
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            return;
        }

        const bindings = bridge.getFuelBindings();

        // Update all cached elements
        for (const key in bindings) {
            if (!bindings.hasOwnProperty(key)) continue;

            const binding = bindings[key];

            // Update based on element type
            const selectKey = `select_${key}`;
            const checkKey = `check_${key}`;
            const numberKey = `number_${key}`;

            if (this.cachedElements.has(selectKey)) {
                const select = this.cachedElements.get(selectKey) as HTMLSelectElement;
                select.selectedIndex = binding.selected;
                select.disabled = !binding.enabled;
            } else if (this.cachedElements.has(checkKey)) {
                const check = this.cachedElements.get(checkKey) as HTMLInputElement;
                check.checked = binding.selected;
                check.disabled = !binding.enabled;
            } else if (this.cachedElements.has(numberKey)) {
                const number = this.cachedElements.get(numberKey) as HTMLInputElement;
                number.value = binding.value.toString();
                number.disabled = !binding.enabled;
            }
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
        this.cachedElements.clear();
    }
}
