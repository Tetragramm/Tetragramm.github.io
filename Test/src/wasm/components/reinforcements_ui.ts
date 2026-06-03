/**
 * Reinforcements UI Component
 *
 * Displays the Reinforcements section using UIBindings from Rust
 * Includes external reinforcements (wood/steel, cabane, wires) and internal (cantilever, wing blades)
 */

import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createSelectElement,
    createCollapsibleSection,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileNumberInput,
    createMobileSelect,
    createMobileCheckbox,
    updateResponsiveGridColumnWidth,
    Updatable,
    dualNumberInto,
    dualStats,
} from '../dom_utils';
import { AIRCRAFT_TYPE } from './aircraft_type_ui';

// Reinforcements stats configuration
const REINFORCEMENTS_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Raw Strain', positiveIsGood: true },
    { key: 'max_strain', label: 'Reinforcement Aircraft Max Strain', positiveIsGood: true, isDerived: true },
];

export class ReinforcementsUI extends BaseComponentUI {
    private controls: Updatable[] = [];
    private showReinforcements: boolean;

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

        const bindings = bridge.getReinforcementsBindings();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 3 columns: External | Internal | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_reinforcements';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Reinforcement External Reinforcements'),
            localization.translate('Reinforcement Internal Reinforcements'),
            localization.translate('Reinforcement Reinforcement Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // === MOBILE VERSION (built alongside desktop so each control is made once) ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // External Reinforcements: desktop cell + mobile item
        const externalCell = document.createElement('td');
        const extItem = createMobileOptionItem(
            localization.translate('Reinforcement External Reinforcements'),
            mobileDiv
        );
        const gridDiv = this.buildExternalSection(externalCell, extItem.content, bindings, bridge);
        dataRow.appendChild(externalCell);

        // Internal Reinforcements: desktop cell + mobile item
        const internalCell = document.createElement('td');
        const intItem = createMobileOptionItem(
            localization.translate('Reinforcement Internal Reinforcements'),
            mobileDiv
        );
        this.buildInternalSection(internalCell, intItem.content, bindings, bridge);
        dataRow.appendChild(internalCell);

        // Stats cell + mobile item (dualStats builds desktop table + mobile grid once)
        const statsCtl = dualStats(
            localization.translate('Reinforcement Reinforcement Stats'),
            () => bridge.getReinforcementsStats(),
            REINFORCEMENTS_STATS,
            () => bridge.getDerivedStats()
        );
        const statsCell = document.createElement('td');
        statsCell.className = 'inner_table';
        statsCell.appendChild(statsCtl.desktop);
        dataRow.appendChild(statsCell);
        mobileDiv.appendChild(statsCtl.mobile);
        this.controls.push(statsCtl);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);
        contentWrapper.appendChild(mobileDiv);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Reinforcement Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Reinforcements');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        // Set initial visibility based on aircraft type
        this.updateVisibility(bridge.getAircraftType());

        requestAnimationFrame(() => {
            updateResponsiveGridColumnWidth(gridDiv);
        });
    }

    /**
     * Build the external reinforcements (wood/steel counts, cabane, wires) into
     * both the desktop table cell and the mobile option content. Each control is
     * created once with a single shared handler, pushed into this.controls.
     *
     * The wood/steel inputs, cabane select, and wires checkbox keep their original
     * custom desktop layouts (see notes below) — the dom_utils dual* helpers cannot
     * reproduce them byte-for-byte — but the change handlers are no longer duplicated
     * because mobile and desktop share one closure per control.
     *
     * @returns the mobile responsive grid div (for post-layout column sizing)
     */
    private buildExternalSection(
        cell: HTMLTableCellElement,
        mobileContent: HTMLElement,
        bindings: any,
        bridge: any
    ): HTMLDivElement {
        // --- Desktop scaffolding ---
        const mainFlex = createFlexSection();

        // Nested flex containers for wood/steel columns
        const fsrDiv = document.createElement('div');
        fsrDiv.className = 'flex-container-o';
        const fsr1 = document.createElement('div');
        fsr1.className = 'flex-container-i';
        const fsr2 = document.createElement('div');
        fsr2.className = 'flex-container-i';
        fsrDiv.appendChild(fsr1);
        fsrDiv.appendChild(fsr2);
        mainFlex.div2.appendChild(fsrDiv);

        const fsWood = createFlexSection();
        const fsSteel = createFlexSection();
        fsr1.appendChild(fsWood.div0);
        fsr2.appendChild(fsSteel.div0);

        // --- Mobile scaffolding ---
        const gridDiv = document.createElement('div');
        gridDiv.className = 'mobile-responsive-grid';
        gridDiv.style.gap = '0em';
        gridDiv.style.columnGap = '-1rem';
        mobileContent.appendChild(gridDiv);

        // External wood/steel reinforcements (number_list bindings).
        // UNCONVERTED: desktop splits wood and steel into two separate nested flex
        // sections (fsWood / fsSteel) with a shared row label on mainFlex.div1, and
        // mobile uses a responsive grid with per-row labels. No dual* helper mirrors
        // this split-column / grid layout, so these stay on the raw builders — but
        // each row's wood and steel inputs now share one handler across both views.
        const extWoodBinding = bindings.ext_wood_count;
        const extSteelBinding = bindings.ext_steel_count;

        if (extWoodBinding && Array.isArray(extWoodBinding) && extSteelBinding && Array.isArray(extSteelBinding)) {
            for (let i = 0; i < extWoodBinding.length; i++) {
                const woodItem = extWoodBinding[i];
                const steelItem = extSteelBinding[i];
                const woodIndex = i; // Capture for closures
                const steelIndex = i;

                const onWoodChange = (value: number) => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.ext_wood_count[woodIndex].value = value;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                };
                const onSteelChange = (value: number) => {
                    const updatedBindings = bridge.getReinforcementsBindings();
                    updatedBindings.ext_steel_count[steelIndex].value = value;
                    bridge.setReinforcementsBindings(updatedBindings);
                    this.onUpdate();
                };

                // --- Desktop: row label + wood input (fsWood) + steel input (fsSteel) ---
                const label = document.createElement('label');
                label.textContent = woodItem.name;
                label.className = 'flex-item';
                label.style.marginLeft = '0.25em';
                label.style.marginRight = '0.5em';
                mainFlex.div1.appendChild(label);

                const woodLabel = document.createElement('label');
                woodLabel.textContent = localization.translate('Reinforcement Wood');
                woodLabel.className = 'flex-item';
                woodLabel.style.marginLeft = '0.25em';
                woodLabel.style.marginRight = '0.5em';
                fsWood.div1.appendChild(woodLabel);

                const woodInput = document.createElement('input');
                woodInput.type = 'number';
                woodInput.min = '0';
                woodInput.className = 'flex-item';
                woodInput.value = woodItem.value.toString();
                woodInput.disabled = !woodItem.enabled;
                woodInput.addEventListener('change', () => {
                    onWoodChange(parseInt(woodInput.value) || 0);
                });
                fsWood.div2.appendChild(woodInput);

                const steelLabel = document.createElement('label');
                steelLabel.textContent = localization.translate('Reinforcement Steel');
                steelLabel.className = 'flex-item';
                steelLabel.style.marginLeft = '0.25em';
                steelLabel.style.marginRight = '0.5em';
                fsSteel.div1.appendChild(steelLabel);

                const steelInput = document.createElement('input');
                steelInput.type = 'number';
                steelInput.min = '0';
                steelInput.className = 'flex-item';
                steelInput.value = steelItem.value.toString();
                steelInput.disabled = !steelItem.enabled;
                steelInput.addEventListener('change', () => {
                    onSteelChange(parseInt(steelInput.value) || 0);
                });
                fsSteel.div2.appendChild(steelInput);

                // --- Mobile: row label + wood input + steel input in the grid ---
                const rowDiv = document.createElement('div');
                const rowLabel = document.createElement('strong');
                rowLabel.textContent = woodItem.name;
                rowDiv.style.gridColumnStart = '1';
                rowDiv.appendChild(rowLabel);
                gridDiv.appendChild(rowDiv);

                const { input: mobileWoodInput } = createMobileNumberInput(
                    { ...woodItem, name: localization.translate('Reinforcement Wood') },
                    gridDiv,
                    onWoodChange,
                    0,
                    99,
                    1
                );

                const { input: mobileSteelInput } = createMobileNumberInput(
                    { ...steelItem, name: localization.translate('Reinforcement Steel') },
                    gridDiv,
                    onSteelChange,
                    0,
                    99,
                    1
                );

                // One Updatable refreshing both desktop and mobile for this row.
                this.controls.push({
                    update: () => {
                        const b = bridge.getReinforcementsBindings();
                        const w = b.ext_wood_count[woodIndex];
                        const s = b.ext_steel_count[steelIndex];
                        woodInput.value = w.value.toString();
                        woodInput.disabled = !w.enabled;
                        mobileWoodInput.value = w.value.toString();
                        mobileWoodInput.disabled = !w.enabled;
                        steelInput.value = s.value.toString();
                        steelInput.disabled = !s.enabled;
                        mobileSteelInput.value = s.value.toString();
                        mobileSteelInput.disabled = !s.enabled;
                    }
                });
            }
        }

        // Cabane select.
        // UNCONVERTED: the original desktop select is built with createSelectElement
        // (no id / no label htmlFor), unlike dualSelectInto's createFlexSelect which
        // adds both. Converting would change the desktop attributes, so it stays
        // custom — but desktop and mobile share one onChange handler.
        const cabaneBinding = bindings.cabane_sel;
        if (cabaneBinding) {
            const onCabaneChange = (selectedIndex: number) => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.cabane_sel.selected = selectedIndex;
                bridge.setReinforcementsBindings(updatedBindings);
                this.onUpdate();
            };

            const cabaneLabel = document.createElement('label');
            cabaneLabel.textContent = localization.translate('Reinforcement Cabane');
            cabaneLabel.className = 'flex-item';
            cabaneLabel.style.marginLeft = '0.25em';
            cabaneLabel.style.marginRight = '0.5em';
            mainFlex.div1.appendChild(cabaneLabel);

            const cabaneSelect = createSelectElement(cabaneBinding, onCabaneChange);
            cabaneSelect.className = 'flex-item';
            mainFlex.div2.appendChild(cabaneSelect);

            const mobileCabaneSelect = createMobileSelect(
                { ...cabaneBinding, name: localization.translate('Reinforcement Cabane') },
                mobileContent,
                onCabaneChange
            );
            mobileCabaneSelect.style.gridColumnStart = '1';

            this.controls.push({
                update: () => {
                    const b = bridge.getReinforcementsBindings();
                    if (b.cabane_sel) {
                        updateSelectElement(cabaneSelect, b.cabane_sel);
                        updateSelectElement(mobileCabaneSelect, b.cabane_sel);
                    }
                }
            });
        }

        // Wires checkbox.
        // UNCONVERTED: desktop uses a custom span.flex-item wrapping an empty label
        // and a bare checkbox (no id / no flex-item class on the input), which does
        // not match dualCheckboxInto's createFlexCheckbox. Kept custom; the mobile
        // checkbox and the handler are shared with desktop.
        const wiresBinding = bindings.wires;
        if (wiresBinding) {
            const onWiresChange = (checked: boolean) => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.wires.selected = checked;
                bridge.setReinforcementsBindings(updatedBindings);
                this.onUpdate();
            };

            const wiresLabel = document.createElement('label');
            wiresLabel.textContent = localization.translate('Reinforcement Wires');
            wiresLabel.className = 'flex-item';
            wiresLabel.style.marginLeft = '0.25em';
            wiresLabel.style.marginRight = '0.5em';
            mainFlex.div1.appendChild(wiresLabel);

            const checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'flex-item';

            const wiresCheckbox = document.createElement('input');
            wiresCheckbox.type = 'checkbox';
            wiresCheckbox.checked = wiresBinding.selected;
            wiresCheckbox.disabled = !wiresBinding.enabled;
            wiresCheckbox.addEventListener('change', () => {
                onWiresChange(wiresCheckbox.checked);
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(wiresCheckbox);
            mainFlex.div2.appendChild(checkboxSpan);

            const mobileWiresCheckbox = createMobileCheckbox(
                { ...wiresBinding, name: localization.translate('Reinforcement Wires') },
                mobileContent,
                onWiresChange
            );

            this.controls.push({
                update: () => {
                    const b = bridge.getReinforcementsBindings();
                    if (b.wires) {
                        wiresCheckbox.checked = b.wires.selected;
                        wiresCheckbox.disabled = !b.wires.enabled;
                        mobileWiresCheckbox.checked = b.wires.selected;
                        mobileWiresCheckbox.disabled = !b.wires.enabled;
                    }
                }
            });
        }

        cell.appendChild(mainFlex.div0);

        return gridDiv;
    }

    /**
     * Build the internal reinforcements (cantilever counts, wing blades) into both
     * the desktop table cell and the mobile option content. Each control is created
     * once with a single shared handler, pushed into this.controls.
     */
    private buildInternalSection(
        cell: HTMLTableCellElement,
        mobileContent: HTMLElement,
        bindings: any,
        bridge: any
    ): void {
        const flexContainer = createFlexSection();

        // Cantilever reinforcements (number_list binding).
        // CONVERTED: standard flex number input on desktop + standard mobile number
        // input, one per index, via dualNumberInto (byte-identical to the original
        // createFlexNumberInputs / createMobileNumberInput pair).
        const cantBinding = bindings.cant_count;
        if (cantBinding && Array.isArray(cantBinding)) {
            cantBinding.forEach((_item: any, idx: number) => {
                this.controls.push(dualNumberInto(
                    flexContainer,
                    mobileContent,
                    () => bridge.getReinforcementsBindings().cant_count[idx],
                    (value) => {
                        const updatedBindings = bridge.getReinforcementsBindings();
                        updatedBindings.cant_count[idx].value = value;
                        bridge.setReinforcementsBindings(updatedBindings);
                        this.onUpdate();
                    },
                    { min: 0, max: 99, step: 1 }
                ));
            });
        }

        // Wing blades checkbox.
        // UNCONVERTED: same custom empty-label span desktop layout as the wires
        // checkbox above, which dualCheckboxInto cannot reproduce. Kept custom; the
        // mobile checkbox and the handler are shared with desktop.
        const wingBladesBinding = bindings.wing_blades;
        if (wingBladesBinding) {
            const onWingBladesChange = (checked: boolean) => {
                const updatedBindings = bridge.getReinforcementsBindings();
                updatedBindings.wing_blades.selected = checked;
                bridge.setReinforcementsBindings(updatedBindings);
                this.onUpdate();
            };

            const wingLabel = document.createElement('label');
            wingLabel.textContent = localization.translate('Reinforcement Wing Blades');
            wingLabel.className = 'flex-item';
            wingLabel.style.marginLeft = '0.25em';
            wingLabel.style.marginRight = '0.5em';
            flexContainer.div1.appendChild(wingLabel);

            const checkboxSpan = document.createElement('span');
            checkboxSpan.className = 'flex-item';

            const wingBladesCheckbox = document.createElement('input');
            wingBladesCheckbox.type = 'checkbox';
            wingBladesCheckbox.checked = wingBladesBinding.selected;
            wingBladesCheckbox.disabled = !wingBladesBinding.enabled;
            wingBladesCheckbox.addEventListener('change', () => {
                onWingBladesChange(wingBladesCheckbox.checked);
            });

            const emptyLabel = document.createElement('label');
            checkboxSpan.appendChild(emptyLabel);
            checkboxSpan.appendChild(wingBladesCheckbox);
            flexContainer.div2.appendChild(checkboxSpan);

            const mobileWingBladesCheckbox = createMobileCheckbox(
                { ...wingBladesBinding, name: localization.translate('Reinforcement Wing Blades') },
                mobileContent,
                onWingBladesChange
            );

            this.controls.push({
                update: () => {
                    const b = bridge.getReinforcementsBindings();
                    if (b.wing_blades) {
                        wingBladesCheckbox.checked = b.wing_blades.selected;
                        wingBladesCheckbox.disabled = !b.wing_blades.enabled;
                        mobileWingBladesCheckbox.checked = b.wing_blades.selected;
                        mobileWingBladesCheckbox.disabled = !b.wing_blades.enabled;
                    }
                }
            });
        }

        cell.appendChild(flexContainer.div0);
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
         * Update visibility based on aircraft type
         */
    private updateVisibility(aircraftType: number): void {
        const typeNum = Number(aircraftType);
        this.showReinforcements = typeNum !== AIRCRAFT_TYPE.HELICOPTER;

        if (this.sectionElement) {
            this.sectionElement.style.display = this.showReinforcements ? '' : 'none';
        }
    }

    public isVisible(): boolean {
        return this.showReinforcements;
    }
}
