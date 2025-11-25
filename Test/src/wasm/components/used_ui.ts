/**
 * Used Part UI Component
 *
 * Handles aircraft condition modifiers (damage, wear, maintenance state)
 * Each modifier ranges from -1 to 1 where:
 * - Positive values represent penalties (damage/wear)
 * - Negative values represent benefits (improvements/repairs)
 */

import { AircraftBridge } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import { createCollapsibleSection, createFlexNumberInput, createFlexSection } from '../dom_utils';

/**
 * Used Part UI Component
 */
export class UsedUI extends BaseComponentUI {
    // Cache for inputs
    private burntOutInput: HTMLInputElement | undefined;
    private raggedInput: HTMLInputElement | undefined;
    private heftyInput: HTMLInputElement | undefined;
    private stickyGunsInput: HTMLInputElement | undefined;
    private weakInput: HTMLInputElement | undefined;
    private fragileInput: HTMLInputElement | undefined;
    private leakyInput: HTMLInputElement | undefined;
    private sluggishInput: HTMLInputElement | undefined;

    protected shouldUpdate(): boolean {
        // Can always update if we have cached elements
        return this.burntOutInput !== undefined;
    }

    protected clearCache(): void {
        this.burntOutInput = undefined;
        this.raggedInput = undefined;
        this.heftyInput = undefined;
        this.stickyGunsInput = undefined;
        this.weakInput = undefined;
        this.fragileInput = undefined;
        this.leakyInput = undefined;
        this.sluggishInput = undefined;
    }

    /**
     * Full rebuild of the UI structure
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getUsedBindings();

        // Create main content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';

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

        // Helper to create a row
        const createRow = (
            effectKey: string,
            descriptionKey: string,
            binding: any,
            updateCallback: (value: number) => void
        ): HTMLInputElement => {
            const row = table.insertRow();
            row.insertCell().textContent = localization.translate(effectKey);
            row.insertCell().textContent = localization.translate(descriptionKey);

            const inputCell = row.insertCell();
            const flex = createFlexSection();
            inputCell.appendChild(flex.div0);

            binding.name = ''
            const input = createFlexNumberInput(
                binding,
                flex,
                updateCallback,
                '-1',
                '1',
                '1'
            );

            return input;
        };

        // Create rows for each used condition
        this.burntOutInput = createRow(
            'Used Burnt Out',
            'Used Burnt Out Description',
            bindings.burnt_out,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.burnt_out.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.raggedInput = createRow(
            'Used Ragged',
            'Used Ragged Description',
            bindings.ragged,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.ragged.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.heftyInput = createRow(
            'Used Hefty',
            'Used Hefty Description',
            bindings.hefty,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.hefty.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.stickyGunsInput = createRow(
            'Used Sticky Guns',
            'Used Sticky Guns Description',
            bindings.sticky_guns,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.sticky_guns.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.weakInput = createRow(
            'Used Weak',
            'Used Weak Description',
            bindings.weak,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.weak.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.fragileInput = createRow(
            'Used Fragile',
            'Used Fragile Description',
            bindings.fragile,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.fragile.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.leakyInput = createRow(
            'Used Leaky',
            'Used Leaky Description',
            bindings.leaky,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.leaky.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        this.sluggishInput = createRow(
            'Used Sluggish',
            'Used Sluggish Description',
            bindings.sluggish,
            (value) => {
                const newBindings = bridge.getUsedBindings();
                newBindings.sluggish.value = value;
                bridge.setUsedBindings(newBindings);
                this.onUpdate?.();
            }
        );

        contentDiv.appendChild(table);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Used Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentDiv,
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
        if (!bridge) return;

        const bindings = bridge.getUsedBindings();

        // Update all inputs
        if (this.burntOutInput) {
            this.burntOutInput.value = bindings.burnt_out.value.toString();
            this.burntOutInput.disabled = !bindings.burnt_out.enabled;
        }
        if (this.raggedInput) {
            this.raggedInput.value = bindings.ragged.value.toString();
            this.raggedInput.disabled = !bindings.ragged.enabled;
        }
        if (this.heftyInput) {
            this.heftyInput.value = bindings.hefty.value.toString();
            this.heftyInput.disabled = !bindings.hefty.enabled;
        }
        if (this.stickyGunsInput) {
            this.stickyGunsInput.value = bindings.sticky_guns.value.toString();
            this.stickyGunsInput.disabled = !bindings.sticky_guns.enabled;
        }
        if (this.weakInput) {
            this.weakInput.value = bindings.weak.value.toString();
            this.weakInput.disabled = !bindings.weak.enabled;
        }
        if (this.fragileInput) {
            this.fragileInput.value = bindings.fragile.value.toString();
            this.fragileInput.disabled = !bindings.fragile.enabled;
        }
        if (this.leakyInput) {
            this.leakyInput.value = bindings.leaky.value.toString();
            this.leakyInput.disabled = !bindings.leaky.enabled;
        }
        if (this.sluggishInput) {
            this.sluggishInput.value = bindings.sluggish.value.toString();
            this.sluggishInput.disabled = !bindings.sluggish.enabled;
        }
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
