/**
 * Used Part UI Component
 *
 * Handles aircraft condition modifiers (damage, wear, maintenance state)
 * Each modifier ranges from -1 to 1 where:
 * - Positive values represent penalties (damage/wear)
 * - Negative values represent benefits (improvements/repairs)
 */

import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import {
    createCollapsibleSection,
    DualControl,
    dualNumber,
} from '../dom_utils';

// One definition per condition row: localization keys + which binding field it maps to.
const USED_ROWS: {
    effectKey: string;
    descriptionKey: string;
    field: string;
}[] = [
    { effectKey: 'Used Burnt Out', descriptionKey: 'Used Burnt Out Description', field: 'burnt_out' },
    { effectKey: 'Used Ragged', descriptionKey: 'Used Ragged Description', field: 'ragged' },
    { effectKey: 'Used Hefty', descriptionKey: 'Used Hefty Description', field: 'hefty' },
    { effectKey: 'Used Sticky Guns', descriptionKey: 'Used Sticky Guns Description', field: 'sticky_guns' },
    { effectKey: 'Used Weak', descriptionKey: 'Used Weak Description', field: 'weak' },
    { effectKey: 'Used Fragile', descriptionKey: 'Used Fragile Description', field: 'fragile' },
    { effectKey: 'Used Leaky', descriptionKey: 'Used Leaky Description', field: 'leaky' },
    { effectKey: 'Used Sluggish', descriptionKey: 'Used Sluggish Description', field: 'sluggish' },
];

/**
 * Used Part UI Component
 */
export class UsedUI extends BaseComponentUI {
    // Dual controls (desktop + mobile) built in rebuildFull, refreshed in updateValues.
    private controls: DualControl[] = [];

    protected shouldUpdate(): boolean {
        // Null-safe: BaseComponentUI's constructor triggers the first render()
        // (hence shouldUpdate) before this subclass's field initializer runs.
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only content';

        // Create table
        const table = document.createElement('table');
        table.style.width = '100%';

        // Header row
        const headerRow = table.insertRow();
        const headers = [
            localization.translate('Used Effect'),
            localization.translate('Used Description'),
            localization.translate('Used Penalties(+) <br/> Benefits(-)')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.innerHTML = headerText; // Using innerHTML to support <br/>
            headerRow.appendChild(th);
        });

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Build one dual control per condition. Each yields a desktop flex node
        // (placed in the table's input cell, exactly where createFlexNumberInput
        // output used to go) and a mobile option item (appended to the group).
        USED_ROWS.forEach(({ effectKey, descriptionKey, field }) => {
            const ctl = dualNumber(
                localization.translate(effectKey),
                () => bridge.getUsedBindings()[field],
                (value) => {
                    const newBindings = bridge.getUsedBindings();
                    newBindings[field].value = value;
                    bridge.setUsedBindings(newBindings);
                    this.onUpdate?.();
                },
                { min: -1, max: 1, step: 1, desktopLabel: '' } // column labelled by table header
            );

            // --- Desktop: effect / description / input flex cell ---
            const row = table.insertRow();
            row.insertCell().textContent = localization.translate(effectKey);
            row.insertCell().textContent = localization.translate(descriptionKey);
            row.insertCell().appendChild(ctl.desktop);

            // --- Mobile: inject the description subtitle into the option content,
            // matching the original createMobileRow output (desc span then input). ---
            const content = ctl.mobile.querySelector('.mobile-option-content');
            if (content) {
                const descSpan = document.createElement('span');
                descSpan.className = 'mobile-description';
                descSpan.style.fontSize = '0.85em';
                descSpan.style.color = 'var(--inp_txt_color)';
                descSpan.style.opacity = '0.8';
                descSpan.style.flexGrow = '1';
                descSpan.textContent = localization.translate(descriptionKey);
                content.insertBefore(descSpan, content.firstChild);
            }
            mobileDiv.appendChild(ctl.mobile);

            this.controls.push(ctl);
        });

        desktopDiv.appendChild(table);
        contentWrapper.appendChild(desktopDiv);

        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Used Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        this.container.appendChild(this.sectionElement);

        console.log('[UsedUI] Full rebuild complete');
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;
        this.controls.forEach(c => c.update());
    }

    /**
     * Apply initial collapse state based on whether used modifiers are at default
     */
    applyInitialCollapseState(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const isDefault = bridge.getUsedIsDefault();
        this.setCollapsed(isDefault);
    }
}
