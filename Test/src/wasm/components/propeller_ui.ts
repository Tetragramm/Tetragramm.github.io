/**
 * Propeller UI Component
 *
 * Displays the Propeller selection using UIBindings from Rust
 * Simple UI with propeller pitch and upgrade selects
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BindingRenderer } from '../binding_renderer';
import { createCollapsibleSection } from '../dom_utils';
import { localization } from '../localization';

export class PropellerUI {
    private container: HTMLElement;
    private renderer: BindingRenderer;
    private sectionElement: HTMLElement | null = null;

    // Cache DOM elements to avoid recreating
    private pitchSelect: HTMLSelectElement | null = null;
    private upgradeSelect: HTMLSelectElement | null = null;

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
            throw new Error('Bridge not available during PropellerUI construction');
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
     * Render the Propeller UI - intelligently updates or rebuilds
     */
    render(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[PropellerUI] Bridge not initialized, skipping render');
            return;
        }

        // If we have cached elements, just update values. Otherwise rebuild.
        if (this.pitchSelect && this.upgradeSelect) {
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
        this.pitchSelect = null;
        this.upgradeSelect = null;

        // Clear existing content
        this.container.innerHTML = '';

        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized()) {
            console.warn('[PropellerUI] Bridge not initialized, skipping rebuild');
            return;
        }

        const propellerBindings = bridge.getPropellerBindings();

        // Create content container (h4 with spans matching original HTML structure)
        const contentDiv = document.createElement('h4');
        contentDiv.className = 'content';

        // Propeller Pitch span with label and select
        const pitchSpan = document.createElement('span');
        const pitchLabel = document.createElement('label');
        pitchLabel.htmlFor = 'propeller_pitch_wasm';
        pitchLabel.textContent = localization.translate('Propeller Propeller Pitch') + ': ';
        pitchSpan.appendChild(pitchLabel);

        this.pitchSelect = this.renderer.renderSelect(
            propellerBindings.idx_prop,
            (selectedIndex) => {
                const bindings = bridge.getPropellerBindings();
                bindings.idx_prop.selected = selectedIndex;
                bridge.setPropellerBindings(bindings);
                this.render();
                console.log(`[PropellerUI] Pitch changed to index ${selectedIndex}`);
            }
        ) as HTMLSelectElement;
        this.pitchSelect.id = 'propeller_pitch_wasm';
        pitchSpan.appendChild(this.pitchSelect);
        contentDiv.appendChild(pitchSpan);

        // Propeller Upgrade span with label and select
        const upgradeSpan = document.createElement('span');
        const upgradeLabel = document.createElement('label');
        upgradeLabel.htmlFor = 'propeller_upgrade_wasm';
        upgradeLabel.textContent = ' ' + localization.translate('Propeller Propeller Upgrades:') + ' ';
        upgradeSpan.appendChild(upgradeLabel);

        this.upgradeSelect = this.renderer.renderSelect(
            propellerBindings.idx_upg,
            (selectedIndex) => {
                const bindings = bridge.getPropellerBindings();
                bindings.idx_upg.selected = selectedIndex;
                bridge.setPropellerBindings(bindings);
                this.render();
                console.log(`[PropellerUI] Upgrade changed to index ${selectedIndex}`);
            }
        ) as HTMLSelectElement;
        this.upgradeSelect.id = 'propeller_upgrade_wasm';
        upgradeSpan.appendChild(this.upgradeSelect);
        contentDiv.appendChild(upgradeSpan);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Propeller Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link (h4)
        const rulesLine = document.createElement('h4');
        const rulesSpan = document.createElement('span');
        rulesSpan.textContent = '(';
        const rulesLink = document.createElement('a');
        rulesLink.href = './Rules/Rules.htm#_Propeller';
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

        console.log('[PropellerUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    private updateValues(): void {
        const bridge = this.getBridge();
        if (!bridge || !bridge.isInitialized() || !this.pitchSelect || !this.upgradeSelect) {
            return;
        }

        const propellerBindings = bridge.getPropellerBindings();

        // Update pitch select
        this.pitchSelect.selectedIndex = propellerBindings.idx_prop.selected;
        this.pitchSelect.disabled = !propellerBindings.idx_prop.enabled;

        // Update options' enabled state
        propellerBindings.idx_prop.options.forEach((opt: any, idx: number) => {
            if (idx < this.pitchSelect!.options.length) {
                this.pitchSelect!.options[idx].disabled = !opt.enabled;
            }
        });

        // Update upgrade select
        this.upgradeSelect.selectedIndex = propellerBindings.idx_upg.selected;
        this.upgradeSelect.disabled = !propellerBindings.idx_upg.enabled;

        // Update options' enabled state
        propellerBindings.idx_upg.options.forEach((opt: any, idx: number) => {
            if (idx < this.upgradeSelect!.options.length) {
                this.upgradeSelect!.options[idx].disabled = !opt.enabled;
            }
        });
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
