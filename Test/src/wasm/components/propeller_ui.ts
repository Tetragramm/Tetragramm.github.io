/**
 * Propeller UI Component
 *
 * Displays the Propeller selection using UIBindings from Rust
 * Simple UI with propeller pitch and upgrade selects (no stats table)
 */

import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import { AIRCRAFT_TYPE } from './aircraft_type_ui';
import {
    createRulesLink,
    createCollapsibleSection,
    DualControl,
    dualSelect,
} from '../dom_utils';

export class PropellerUI extends BaseComponentUI {
    private controls: DualControl[] = [];
    private showPropeller: boolean;

    protected shouldUpdate(): boolean {
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const aircraftType = bridge.getAircraftType();

        // One definition per select; each yields a desktop node and a mobile node.
        const pitchCtl = dualSelect(
            localization.translate('Propeller Propeller Pitch'),
            () => bridge.getPropellerBindings().idx_prop,
            (selectedIndex) => {
                const updatedBindings = bridge.getPropellerBindings();
                updatedBindings.idx_prop.selected = selectedIndex;
                bridge.setPropellerBindings(updatedBindings);
                this.onUpdate();
            }
        );
        pitchCtl.desktop.id = 'propeller_pitch_wasm';

        const upgradeCtl = dualSelect(
            localization.translate('Propeller Propeller Upgrades'),
            () => bridge.getPropellerBindings().idx_upg,
            (selectedIndex) => {
                const updatedBindings = bridge.getPropellerBindings();
                updatedBindings.idx_upg.selected = selectedIndex;
                bridge.setPropellerBindings(updatedBindings);
                this.onUpdate();
            }
        );
        upgradeCtl.desktop.id = 'propeller_upgrade_wasm';
        this.controls = [pitchCtl, upgradeCtl];

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION (unchanged layout) ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Content container (h4 with spans matching original HTML structure)
        const contentDiv = document.createElement('h4');
        contentDiv.className = 'content';

        // Propeller Pitch span with label and select
        const pitchSpan = document.createElement('span');
        const pitchLabel = document.createElement('label');
        pitchLabel.htmlFor = 'propeller_pitch_wasm';
        pitchLabel.textContent = localization.translate('Propeller Propeller Pitch') + ': ';
        pitchSpan.appendChild(pitchLabel);
        pitchSpan.appendChild(pitchCtl.desktop);
        contentDiv.appendChild(pitchSpan);

        // Propeller Upgrade span with label and select
        const upgradeSpan = document.createElement('span');
        const upgradeLabel = document.createElement('label');
        upgradeLabel.htmlFor = 'propeller_upgrade_wasm';
        upgradeLabel.textContent = ' ' + localization.translate('Propeller Propeller Upgrades') + ' ';
        upgradeSpan.appendChild(upgradeLabel);
        upgradeSpan.appendChild(upgradeCtl.desktop);
        contentDiv.appendChild(upgradeSpan);

        desktopDiv.appendChild(contentDiv);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';
        mobileDiv.appendChild(pitchCtl.mobile);
        mobileDiv.appendChild(upgradeCtl.mobile);
        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Propeller Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
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
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;

        this.updateVisibility(bridge.getAircraftType());
        this.controls.forEach(c => c.update());
    }

    /**
     * Update visibility based on aircraft type
     */
    private updateVisibility(aircraftType: number): void {
        const typeNum = Number(aircraftType);
        this.showPropeller = typeNum !== AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = this.showPropeller ? '' : 'none';
        }
    }

    public isVisible(): boolean {
        return this.showPropeller;
    }
}
