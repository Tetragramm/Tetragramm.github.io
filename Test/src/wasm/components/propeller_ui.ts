/**
 * Propeller UI Component
 *
 * Displays the Propeller selection using UIBindings from Rust
 * Simple UI with propeller pitch and upgrade selects (no stats table)
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { AIRCRAFT_TYPE } from './aircraft_type_ui';
import {
    createRulesLink,
    createSelectElement,
    updateSelectElement,
    createCollapsibleSection
} from '../dom_utils';

// Cache interface for type safety
interface PropellerCache {
    pitchSelect: HTMLSelectElement;
    upgradeSelect: HTMLSelectElement;
}

export class PropellerUI extends BaseComponentUI {
    private cache: PropellerCache = undefined;

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

        const bindings = bridge.getPropellerBindings();
        const aircraftType = bridge.getAircraftType();

        // Create content container (h4 with spans matching original HTML structure)
        const contentDiv = document.createElement('h4');
        contentDiv.className = 'content';

        // Propeller Pitch span with label and select
        const pitchSpan = document.createElement('span');
        const pitchLabel = document.createElement('label');
        pitchLabel.htmlFor = 'propeller_pitch_wasm';
        pitchLabel.textContent = localization.translate('Propeller Propeller Pitch') + ': ';
        pitchSpan.appendChild(pitchLabel);

        const pitchSelect = createSelectElement(
            bindings.idx_prop,
            (selectedIndex) => {
                const updatedBindings = bridge.getPropellerBindings();
                updatedBindings.idx_prop.selected = selectedIndex;
                bridge.setPropellerBindings(updatedBindings);
                this.onUpdate();
            }
        );
        pitchSelect.id = 'propeller_pitch_wasm';
        pitchSpan.appendChild(pitchSelect);
        contentDiv.appendChild(pitchSpan);

        // Propeller Upgrade span with label and select
        const upgradeSpan = document.createElement('span');
        const upgradeLabel = document.createElement('label');
        upgradeLabel.htmlFor = 'propeller_upgrade_wasm';
        upgradeLabel.textContent = ' ' + localization.translate('Propeller Propeller Upgrades:') + ' ';
        upgradeSpan.appendChild(upgradeLabel);

        const upgradeSelect = createSelectElement(
            bindings.idx_upg,
            (selectedIndex) => {
                const updatedBindings = bridge.getPropellerBindings();
                updatedBindings.idx_upg.selected = selectedIndex;
                bridge.setPropellerBindings(updatedBindings);
                this.onUpdate();
            }
        );
        upgradeSelect.id = 'propeller_upgrade_wasm';
        upgradeSpan.appendChild(upgradeSelect);
        contentDiv.appendChild(upgradeSpan);

        // Cache elements
        this.cache = {
            pitchSelect,
            upgradeSelect
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Propeller Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Propeller');
        rulesLine.appendChild(document.createElement('br')); // Add line break after rules link
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        // Set initial visibility based on aircraft type
        this.updateVisibility(aircraftType);

        console.log('[PropellerUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const bindings = bridge.getPropellerBindings();
        const aircraftType = bridge.getAircraftType();

        // Update visibility first
        this.updateVisibility(aircraftType);

        // Update pitch select
        if (this.cache.pitchSelect && bindings.idx_prop) {
            updateSelectElement(this.cache.pitchSelect, bindings.idx_prop);
        }

        // Update upgrade select
        if (this.cache.upgradeSelect && bindings.idx_upg) {
            updateSelectElement(this.cache.upgradeSelect, bindings.idx_upg);
        }
    }

    /**
     * Update visibility based on aircraft type
     */
    private updateVisibility(aircraftType: number): void {
        const typeNum = Number(aircraftType);
        const showPropeller = typeNum !== AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = showPropeller ? '' : 'none';
        }
    }
}
