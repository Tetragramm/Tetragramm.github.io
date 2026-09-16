/**
 * Accessories UI Component
 *
 * Displays the Accessories section using UIBindings from Rust
 * Includes armour, electrical, radio, reconnaissance, visibility, climate, autopilot, and control systems
 */

import { AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createFlexNumberInputs,
    createSelectElement,
    createCollapsibleSection,
    StatDisplayConfig,
    createMobileOptionItem,
    createMobileSelect,
    createMobileNumberInput,
    Updatable,
    dualStats,
    dualCheckboxInto,
    dualNumberInto,
} from '../dom_utils';

// Accessories stats configuration
const ACCESSORIES_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
    { key: 'liftbleed', label: 'Stat Lift Bleed', positiveIsGood: false },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: true },
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
];

export class AccessoriesUI extends BaseComponentUI {
    private controls: Updatable[] = [];

    // Retained cache for the parts that do not fit a dual* helper:
    //  - armour uses a custom nested L/R flex desktop layout
    //  - radio/autopilot/control selects use a plain label+select desktop layout
    //    (not the flex layout dualSelectInto would emit), while sharing a mobile
    //    option item with neighbouring controls.
    private armourInputs: HTMLInputElement[] = [];
    private mobileArmourInputs: HTMLInputElement[] = [];
    private radioSelect?: HTMLSelectElement;
    private mobileRadioSelect?: HTMLSelectElement;
    private autopilotSelect?: HTMLSelectElement;
    private mobileAutopilotSelect?: HTMLSelectElement;
    private controlSelect?: HTMLSelectElement;
    private mobileControlSelect?: HTMLSelectElement;

    protected shouldUpdate(): boolean {
        return (this.controls?.length ?? 0) > 0;
    }

    protected clearCache(): void {
        this.controls = [];
        this.armourInputs = [];
        this.mobileArmourInputs = [];
        this.radioSelect = undefined;
        this.mobileRadioSelect = undefined;
        this.autopilotSelect = undefined;
        this.mobileAutopilotSelect = undefined;
        this.controlSelect = undefined;
        this.mobileControlSelect = undefined;
    }

    /**
     * Full rebuild of the UI structure (used on first render or locale change)
     */
    protected rebuildFull(): void {
        this.clearCache();
        this.container.innerHTML = '';

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getAccessoriesBindings();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 2 rows: first row has 4 cells, second row has 3 cells
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_accessories';

        // Row 1 - Header
        const headerRow1 = document.createElement('tr');
        [
            localization.translate('Accessories Climate'),
            localization.translate('Accessories Armour Coverage'),
            localization.translate('Accessories Visibility'),
            localization.translate('Accessories Additional Part Stats')
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow1.appendChild(th);
        });
        mainTable.appendChild(headerRow1);

        // Row 1 - Data
        const dataRow1 = document.createElement('tr');

        // Climate cell (shared flex; controls filled in below)
        const climateCell = document.createElement('td');
        const climFlex = createFlexSection();
        climateCell.appendChild(climFlex.div0);
        dataRow1.appendChild(climateCell);

        // Armour cell (custom nested L/R flex; not a dual* helper)
        const armourCell = document.createElement('td');
        this.createArmourSection(armourCell, bindings, bridge);
        dataRow1.appendChild(armourCell);

        // Visibility cell (shared flex; controls filled in below)
        const visibilityCell = document.createElement('td');
        const visiFlex = createFlexSection();
        visibilityCell.appendChild(visiFlex.div0);
        dataRow1.appendChild(visibilityCell);

        // Stats cell
        const statsCtl = dualStats(
            localization.translate('Accessories Additional Part Stats'),
            () => bridge.getAccessoriesStats(),
            ACCESSORIES_STATS
        );
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        statsCell.rowSpan = 3;
        statsCell.append(statsCtl.desktop);
        dataRow1.appendChild(statsCell);

        mainTable.appendChild(dataRow1);

        // Row 2 - Header
        const headerRow2 = document.createElement('tr');
        [
            localization.translate('Accessories Information'),
            localization.translate('Accessories Electrical'),
            localization.translate('Accessories Control')
        ].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow2.appendChild(th);
        });
        mainTable.appendChild(headerRow2);

        // Row 2 - Data
        const dataRow2 = document.createElement('tr');

        // Information cell (reconnaissance; shared flex)
        const infoCell = document.createElement('td');
        const reconFlex = createFlexSection();
        infoCell.appendChild(reconFlex.div0);
        dataRow2.appendChild(infoCell);

        // Electrical cell (radio select [custom] + electrical equipment counts flex)
        const electricalCell = document.createElement('td');
        const elecFlex = this.createElectricalSection(electricalCell, bindings, bridge);
        dataRow2.appendChild(electricalCell);

        // Control cell (autopilot + control system selects; custom)
        const controlCell = document.createElement('td');
        this.createControlSection(controlCell, bindings, bridge);
        dataRow2.appendChild(controlCell);

        mainTable.appendChild(dataRow2);

        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Climate Section: desktop shares climFlex; mobile shares one item.
        const climateItem = createMobileOptionItem(
            localization.translate('Accessories Climate'),
            mobileDiv
        );
        if (bindings.clim_sel && Array.isArray(bindings.clim_sel)) {
            bindings.clim_sel.forEach((_b: any, idx: number) => {
                this.controls.push(dualCheckboxInto(
                    climFlex,
                    climateItem.content,
                    () => bridge.getAccessoriesBindings().clim_sel[idx],
                    (checked) => {
                        const updatedBindings = bridge.getAccessoriesBindings();
                        updatedBindings.clim_sel[idx].selected = checked;
                        bridge.setAccessoriesBindings(updatedBindings);
                        this.onUpdate();
                    }
                ));
            });
        }

        // Armour Coverage Section (custom; mobile item one number input each)
        const armourItem = createMobileOptionItem(
            localization.translate('Accessories Armour Coverage'),
            mobileDiv
        );
        if (bindings.armour_coverage && Array.isArray(bindings.armour_coverage)) {
            for (let i = 0; i < bindings.armour_coverage.length; i++) {
                const binding = bindings.armour_coverage[i];
                const idx = i;
                const { input } = createMobileNumberInput(
                    binding,
                    armourItem.content,
                    (value: number) => {
                        const updatedBindings = bridge.getAccessoriesBindings();
                        updatedBindings.armour_coverage[idx].value = value;
                        bridge.setAccessoriesBindings(updatedBindings);
                        this.onUpdate();
                    },
                    0,
                    99,
                    1
                );
                this.mobileArmourInputs.push(input);
            }
        }

        // Visibility Section: desktop shares visiFlex; mobile shares one item.
        const visiItem = createMobileOptionItem(
            localization.translate('Accessories Visibility'),
            mobileDiv
        );
        if (bindings.visi_sel && Array.isArray(bindings.visi_sel)) {
            bindings.visi_sel.forEach((_b: any, idx: number) => {
                this.controls.push(dualCheckboxInto(
                    visiFlex,
                    visiItem.content,
                    () => bridge.getAccessoriesBindings().visi_sel[idx],
                    (checked) => {
                        const updatedBindings = bridge.getAccessoriesBindings();
                        updatedBindings.visi_sel[idx].selected = checked;
                        bridge.setAccessoriesBindings(updatedBindings);
                        this.onUpdate();
                    }
                ));
            });
        }

        // Information (Reconnaissance) Section: desktop shares reconFlex; mobile one item.
        const infoItem = createMobileOptionItem(
            localization.translate('Accessories Information'),
            mobileDiv
        );
        if (bindings.recon_sel && Array.isArray(bindings.recon_sel)) {
            bindings.recon_sel.forEach((_b: any, idx: number) => {
                this.controls.push(dualNumberInto(
                    reconFlex,
                    infoItem.content,
                    () => bridge.getAccessoriesBindings().recon_sel[idx],
                    (value) => {
                        const updatedBindings = bridge.getAccessoriesBindings();
                        updatedBindings.recon_sel[idx].value = value;
                        bridge.setAccessoriesBindings(updatedBindings);
                        this.onUpdate();
                    },
                    { min: 0, max: 99, step: 1 }
                ));
            });
        }

        // Electrical Section
        const electricalItem = createMobileOptionItem(
            localization.translate('Accessories Electrical'),
            mobileDiv
        );
        // Radio select (custom desktop layout; mobile select into shared item)
        if (bindings.radio_sel) {
            const radioBinding = {
                name: localization.translate('Accessories Radio'),
                options: bindings.radio_sel.options,
                selected: bindings.radio_sel.selected,
                enabled: bindings.radio_sel.enabled
            };
            this.mobileRadioSelect = createMobileSelect(
                radioBinding,
                electricalItem.content,
                (selectedIndex) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.radio_sel.selected = selectedIndex;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }
        // Electrical equipment counts: desktop shares elecFlex; mobile shares item.
        if (bindings.electrical_count && Array.isArray(bindings.electrical_count)) {
            bindings.electrical_count.forEach((_b: any, idx: number) => {
                this.controls.push(dualNumberInto(
                    elecFlex,
                    electricalItem.content,
                    () => bridge.getAccessoriesBindings().electrical_count[idx],
                    (value) => {
                        const updatedBindings = bridge.getAccessoriesBindings();
                        updatedBindings.electrical_count[idx].value = value;
                        bridge.setAccessoriesBindings(updatedBindings);
                        this.onUpdate();
                    },
                    { min: 0, max: 99, step: 1 }
                ));
            });
        }

        // Control Section
        const controlItem = createMobileOptionItem(
            localization.translate('Accessories Control'),
            mobileDiv
        );
        // Autopilot select (custom desktop layout; mobile select into shared item)
        if (bindings.auto_sel) {
            const autopilotBinding = {
                name: localization.translate('Accessories Autopilot'),
                options: bindings.auto_sel.options,
                selected: bindings.auto_sel.selected,
                enabled: bindings.auto_sel.enabled
            };
            this.mobileAutopilotSelect = createMobileSelect(
                autopilotBinding,
                controlItem.content,
                (selectedIndex) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.auto_sel.selected = selectedIndex;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }
        // Control system select (custom desktop layout; mobile select into shared item)
        if (bindings.cont_sel) {
            const controlBinding = {
                name: localization.translate('Accessories Control System'),
                options: bindings.cont_sel.options,
                selected: bindings.cont_sel.selected,
                enabled: bindings.cont_sel.enabled
            };
            this.mobileControlSelect = createMobileSelect(
                controlBinding,
                controlItem.content,
                (selectedIndex) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.cont_sel.selected = selectedIndex;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Mobile stats: dualStats already built a .mobile-option-item with the
        // "Accessories Additional Part Stats" title and the grid inside.
        mobileDiv.appendChild(statsCtl.mobile);

        contentWrapper.appendChild(mobileDiv);

        this.controls.push(statsCtl);

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Accessories Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Accessories');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);
    }

    /**
     * Create armour coverage section (8 number inputs for AP levels)
     * Custom nested L/R flex desktop layout — not reproducible by dualNumberInto.
     */
    private createArmourSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): void {
        const flexContainer = createFlexSection();
        const flexContainerL = createFlexSection();
        const flexContainerR = createFlexSection();
        flexContainer.div1.appendChild(flexContainerL.div0);
        flexContainer.div2.appendChild(flexContainerR.div0);

        const armourBinding = bindings.armour_coverage;
        const armourInputsL = armourBinding && Array.isArray(armourBinding)
            ? createFlexNumberInputs(
                flexContainerL,
                armourBinding.slice(0, 4),
                (idx) => (value) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.armour_coverage[idx].value = value;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];
        const armourInputsR = armourBinding && Array.isArray(armourBinding)
            ? createFlexNumberInputs(
                flexContainerR,
                armourBinding.slice(4, 9),
                (idx) => (value) => {
                    const updatedBindings = bridge.getAccessoriesBindings();
                    updatedBindings.armour_coverage[idx + 4].value = value;
                    bridge.setAccessoriesBindings(updatedBindings);
                    this.onUpdate();
                }
            )
            : [];

        cell.appendChild(flexContainer.div0);
        this.armourInputs = armourInputsL.concat(armourInputsR);
    }

    /**
     * Create electrical section desktop side (radio select + electrical flex).
     * The radio select uses a plain label+select layout (not flex), so it stays
     * custom; the returned flex holds the electrical equipment number inputs which
     * are filled via dualNumberInto in rebuildFull.
     */
    private createElectricalSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): ReturnType<typeof createFlexSection> {
        const flexContainer = createFlexSection();

        // Radio select
        const radioBinding = bindings.radio_sel;
        const radioSelect = radioBinding ? createSelectElement(
            radioBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getAccessoriesBindings();
                updatedBindings.radio_sel.selected = selectedIndex;
                bridge.setAccessoriesBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (radioSelect) {
            const radioLabel = document.createElement('label');
            radioLabel.textContent = localization.translate('Accessories Radio');
            radioLabel.style.marginRight = '10px';
            cell.appendChild(radioLabel);
            cell.appendChild(radioSelect);
            cell.appendChild(document.createElement('br'));
        }
        this.radioSelect = radioSelect;

        cell.appendChild(flexContainer.div0);
        return flexContainer;
    }

    /**
     * Create control section (autopilot and control system selects).
     * Plain label+select desktop layout — stays custom.
     */
    private createControlSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): void {
        // Autopilot select
        const autopilotBinding = bindings.auto_sel;
        const autopilotSelect = autopilotBinding ? createSelectElement(
            autopilotBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getAccessoriesBindings();
                updatedBindings.auto_sel.selected = selectedIndex;
                bridge.setAccessoriesBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (autopilotSelect) {
            const autopilotLabel = document.createElement('label');
            autopilotLabel.textContent = localization.translate('Accessories Autopilot');
            autopilotLabel.style.marginRight = '10px';
            cell.appendChild(autopilotLabel);
            cell.appendChild(autopilotSelect);
            cell.appendChild(document.createElement('br'));
        }
        this.autopilotSelect = autopilotSelect;

        // Control system select
        const controlBinding = bindings.cont_sel;
        const controlSelect = controlBinding ? createSelectElement(
            controlBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getAccessoriesBindings();
                updatedBindings.cont_sel.selected = selectedIndex;
                bridge.setAccessoriesBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        if (controlSelect) {
            const controlLabel = document.createElement('label');
            controlLabel.textContent = localization.translate('Accessories Control System');
            controlLabel.style.marginRight = '10px';
            cell.appendChild(controlLabel);
            cell.appendChild(controlSelect);
            cell.appendChild(document.createElement('br'));
        }
        this.controlSelect = controlSelect;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.controls?.length) return;

        const bindings = bridge.getAccessoriesBindings();

        // Armour inputs (desktop) — custom layout, not in this.controls.
        if (bindings.armour_coverage && Array.isArray(bindings.armour_coverage)) {
            bindings.armour_coverage.forEach((item: any, idx: number) => {
                if (idx < this.armourInputs.length) {
                    this.armourInputs[idx].value = item.value.toString();
                    this.armourInputs[idx].disabled = !item.enabled;
                }
                if (idx < this.mobileArmourInputs.length) {
                    this.mobileArmourInputs[idx].value = item.value.toString();
                    this.mobileArmourInputs[idx].disabled = !item.enabled;
                }
            });
        }

        // Radio select (desktop + mobile) — custom layout.
        if (this.radioSelect && bindings.radio_sel) {
            updateSelectElement(this.radioSelect, bindings.radio_sel);
        }
        if (this.mobileRadioSelect && bindings.radio_sel) {
            updateSelectElement(this.mobileRadioSelect, bindings.radio_sel);
        }

        // Autopilot select (desktop + mobile) — custom layout.
        if (this.autopilotSelect && bindings.auto_sel) {
            updateSelectElement(this.autopilotSelect, bindings.auto_sel);
        }
        if (this.mobileAutopilotSelect && bindings.auto_sel) {
            updateSelectElement(this.mobileAutopilotSelect, bindings.auto_sel);
        }

        // Control select (desktop + mobile) — custom layout.
        if (this.controlSelect && bindings.cont_sel) {
            updateSelectElement(this.controlSelect, bindings.cont_sel);
        }
        if (this.mobileControlSelect && bindings.cont_sel) {
            updateSelectElement(this.mobileControlSelect, bindings.cont_sel);
        }

        // Dual controls: climate, visibility, recon, electrical numbers, stats.
        this.controls.forEach(c => c.update());
    }
}
