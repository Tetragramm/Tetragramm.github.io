/**
 * Load UI Component
 *
 * Combined component for Fuel, Munitions, and Cargo
 * Matches the original TypeScript 4-column table layout
 */

import { addStats, AircraftBridge } from '../aircraft_bridge';
import { localization } from '../localization';
import { BaseComponentUI } from '../base_component_ui';
import {
    createRulesLink,
    createFlexSection,
    updateSelectElement,
    createFlexCheckbox,
    createFlexNumberInput,
    createFlexNumberInputs,
    createSelectElement,
    createCollapsibleSection,
    StatDisplayConfig,
    createStatsTable,
    updateStatsTable,
    createMobileOptionItem,
    createMobileSelect,
    createMobileNumberInput,
    createMobileCheckbox,
    createMobileStatsGrid,
    updateMobileStatsGrid
} from '../dom_utils';


// Load stats configuration
const LOAD_STATS: StatDisplayConfig[] = [
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'wetmass', label: 'Stat Wet Mass', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    { key: 'fuel', label: 'Stat Fuel', positiveIsGood: true },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: '', label: '', positiveIsGood: undefined },
    { key: 'fuel_uses', label: 'Derived Fuel Uses', positiveIsGood: true, isDerived: true },
    { key: '', label: '', positiveIsGood: undefined },
];

// Cache interface for type safety
interface LoadCache {
    // Fuel elements
    fuelInputs: HTMLInputElement[];
    sealCheckbox: HTMLInputElement;
    extinguisherCheckbox: HTMLInputElement;

    // Munitions elements
    bombsInput: HTMLInputElement;
    rocketsInput: HTMLInputElement;
    bayCountInput: HTMLInputElement;
    bay1Checkbox: HTMLInputElement;
    bay2Checkbox: HTMLInputElement;

    // Cargo element
    cargoSelect: HTMLSelectElement;

    // Stat cells
    statsTable: HTMLTableElement;
    mobileStatsGrid?: HTMLDivElement;

    // Mobile controls
    mobileFuelInputs?: HTMLInputElement[];
    mobileSealCheckbox?: HTMLInputElement;
    mobileExtinguisherCheckbox?: HTMLInputElement;
    mobileBombsInput?: HTMLInputElement;
    mobileRocketsInput?: HTMLInputElement;
    mobileBayCountInput?: HTMLInputElement;
    mobileBay1Checkbox?: HTMLInputElement;
    mobileBay2Checkbox?: HTMLInputElement;
    mobileCargoSelect?: HTMLSelectElement;
}

export class LoadUI extends BaseComponentUI {
    private cache: LoadCache = undefined;

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

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Get combined stats
        const fuelStats = bridge.getFuelStats();
        const munitionsStats = bridge.getMunitionsStats();
        const cargoStats = bridge.getCargoStats();
        const stats = addStats(fuelStats, munitionsStats, cargoStats);
        const derived = bridge.getDerivedStats();

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create main table with 4 columns: Fuel | Munitions | Cargo | Stats
        const mainTable = document.createElement('table');
        mainTable.style.width = '100%';
        mainTable.id = 'tbl_load';

        // Header row
        const headerRow = document.createElement('tr');
        const headers = [
            localization.translate('Load Fuel'),
            localization.translate('Load Munitions'),
            localization.translate('Load Cargo and Passengers'),
            localization.translate('Load Load Stats')
        ];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        mainTable.appendChild(headerRow);

        // Data row
        const dataRow = document.createElement('tr');

        // Fuel cell
        const fuelCell = document.createElement('td');
        const fuelCache = this.createFuelSection(fuelCell, fuelBindings, bridge);
        dataRow.appendChild(fuelCell);

        // Munitions cell
        const munitionsCell = document.createElement('td');
        const munitionsCache = this.createMunitionsSection(munitionsCell, munitionsBindings, bridge);
        dataRow.appendChild(munitionsCell);

        // Cargo cell
        const cargoCell = document.createElement('td');
        const cargoSelect = this.createCargoSection(cargoCell, cargoBindings, bridge);
        dataRow.appendChild(cargoCell);

        // Stats cell
        const statsCell = document.createElement('td');
        statsCell.className = "inner_table";
        const statsTable = createStatsTable(stats, LOAD_STATS, derived);
        statsCell.append(statsTable);
        dataRow.appendChild(statsCell);

        mainTable.appendChild(dataRow);
        desktopDiv.appendChild(mainTable);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Fuel section
        const fuelItem = createMobileOptionItem(
            localization.translate('Load Fuel'),
            mobileDiv
        );
        // Fuel tank inputs
        const mobileFuelInputs: HTMLInputElement[] = [];
        if (fuelBindings.tank_count && Array.isArray(fuelBindings.tank_count)) {
            fuelBindings.tank_count.forEach((tank: any, idx: number) => {
                const { input } = createMobileNumberInput(
                    tank,
                    fuelItem.content,
                    (value) => {
                        const updatedBindings = bridge.getFuelBindings();
                        updatedBindings.tank_count[idx].value = value;
                        bridge.setFuelBindings(updatedBindings);
                        this.onUpdate();
                    },
                    0
                );
                mobileFuelInputs.push(input);
            });
        }
        // Self-sealing checkbox
        let mobileSealCheckbox: HTMLInputElement | undefined;
        if (fuelBindings.self_sealing) {
            mobileSealCheckbox = createMobileCheckbox(
                fuelBindings.self_sealing,
                fuelItem.content,
                (checked) => {
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings.self_sealing.selected = checked;
                    bridge.setFuelBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }
        // Fire extinguisher checkbox
        let mobileExtinguisherCheckbox: HTMLInputElement | undefined;
        if (fuelBindings.fire_extinguisher) {
            mobileExtinguisherCheckbox = createMobileCheckbox(
                fuelBindings.fire_extinguisher,
                fuelItem.content,
                (checked) => {
                    const updatedBindings = bridge.getFuelBindings();
                    updatedBindings.fire_extinguisher.selected = checked;
                    bridge.setFuelBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Munitions section
        const munitionsItem = createMobileOptionItem(
            localization.translate('Load Munitions'),
            mobileDiv
        );
        let mobileBombsInput: HTMLInputElement | undefined;
        if (munitionsBindings.bomb_count) {
            const { input } = createMobileNumberInput(
                munitionsBindings.bomb_count,
                munitionsItem.content,
                (value) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.bomb_count.value = value;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                },
                0
            );
            mobileBombsInput = input;
        }
        let mobileRocketsInput: HTMLInputElement | undefined;
        if (munitionsBindings.rocket_count) {
            const { input } = createMobileNumberInput(
                munitionsBindings.rocket_count,
                munitionsItem.content,
                (value) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.rocket_count.value = value;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                },
                0
            );
            mobileRocketsInput = input;
        }
        let mobileBayCountInput: HTMLInputElement | undefined;
        if (munitionsBindings.internal_bay_count) {
            const { input } = createMobileNumberInput(
                munitionsBindings.internal_bay_count,
                munitionsItem.content,
                (value) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.internal_bay_count.value = value;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                },
                0
            );
            mobileBayCountInput = input;
        }
        let mobileBay1Checkbox: HTMLInputElement | undefined;
        if (munitionsBindings.internal_bay_1) {
            mobileBay1Checkbox = createMobileCheckbox(
                munitionsBindings.internal_bay_1,
                munitionsItem.content,
                (checked) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.internal_bay_1.selected = checked;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }
        let mobileBay2Checkbox: HTMLInputElement | undefined;
        if (munitionsBindings.internal_bay_2) {
            mobileBay2Checkbox = createMobileCheckbox(
                munitionsBindings.internal_bay_2,
                munitionsItem.content,
                (checked) => {
                    const updatedBindings = bridge.getMunitionsBindings();
                    updatedBindings.internal_bay_2.selected = checked;
                    bridge.setMunitionsBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Cargo section
        const cargoItem = createMobileOptionItem(
            localization.translate('Load Cargo and Passengers'),
            mobileDiv
        );
        let mobileCargoSelect: HTMLSelectElement | undefined;
        if (cargoBindings.space_sel) {
            mobileCargoSelect = createMobileSelect(
                cargoBindings.space_sel,
                cargoItem.content,
                (selectedIndex) => {
                    const updatedBindings = bridge.getCargoBindings();
                    updatedBindings.space_sel.selected = selectedIndex;
                    bridge.setCargoBindings(updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Stats grid
        const statsItem = createMobileOptionItem(
            localization.translate('Load Load Stats'),
            mobileDiv
        );
        const mobileStatsGrid = createMobileStatsGrid(stats, LOAD_STATS, derived);
        statsItem.content.appendChild(mobileStatsGrid);

        contentWrapper.appendChild(mobileDiv);

        // Cache elements
        this.cache = {
            ...fuelCache,
            ...munitionsCache,
            cargoSelect,
            statsTable,
            mobileStatsGrid,
            mobileFuelInputs,
            mobileSealCheckbox,
            mobileExtinguisherCheckbox,
            mobileBombsInput,
            mobileRocketsInput,
            mobileBayCountInput,
            mobileBay1Checkbox,
            mobileBay2Checkbox,
            mobileCargoSelect
        };

        // Create collapsible section with localized title
        const sectionTitle = localization.translate('Load Section Title');
        this.sectionElement = createCollapsibleSection(
            sectionTitle,
            contentWrapper,
            true // Initially open
        );

        // Add rules link using utility
        const rulesLine = createRulesLink('_Load');
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(this.sectionElement);

        console.log('[LoadUI] Full rebuild complete');
    }

    /**
     * Create fuel section with flex layout
     */
    private createFuelSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        fuelInputs: HTMLInputElement[];
        sealCheckbox: HTMLInputElement;
        extinguisherCheckbox: HTMLInputElement;
    } {
        const flexContainer = createFlexSection();

        // Explicitly handle tank_count (number array), self_sealing and fire_extinguisher (checkboxes)
        const tankCountBinding = bindings.tank_count;
        const sealBinding = bindings.self_sealing;
        const extinguisherBinding = bindings.fire_extinguisher;

        // Tank count inputs (array of number bindings)
        const fuelInputs = createFlexNumberInputs(
            flexContainer,
            tankCountBinding || [],
            (idx) => (value) => {
                const updatedBindings = bridge.getFuelBindings();
                updatedBindings.tank_count[idx].value = value;
                bridge.setFuelBindings(updatedBindings);
                this.onUpdate();
            }
        );

        // Self-sealing checkbox
        const sealCheckbox = sealBinding ? createFlexCheckbox(
            sealBinding,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getFuelBindings();
                updatedBindings.self_sealing.selected = checked;
                bridge.setFuelBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        // Fire extinguisher checkbox
        const extinguisherCheckbox = extinguisherBinding ? createFlexCheckbox(
            extinguisherBinding,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getFuelBindings();
                updatedBindings.fire_extinguisher.selected = checked;
                bridge.setFuelBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        cell.appendChild(flexContainer.div0);
        return { fuelInputs, sealCheckbox, extinguisherCheckbox };
    }

    /**
     * Create munitions section with flex layout
     */
    private createMunitionsSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): {
        bombsInput: HTMLInputElement;
        rocketsInput: HTMLInputElement;
        bayCountInput: HTMLInputElement;
        bay1Checkbox: HTMLInputElement;
        bay2Checkbox: HTMLInputElement;
    } {
        const flexContainer = createFlexSection();

        // Explicitly handle bomb_count, rocket_count, internal_bay_count (numbers)
        // and internal_bay_1, internal_bay_2 (checkboxes)
        const bombBinding = bindings.bomb_count;
        const rocketBinding = bindings.rocket_count;
        const bayCountBinding = bindings.internal_bay_count;
        const bay1Binding = bindings.internal_bay_1;
        const bay2Binding = bindings.internal_bay_2;

        // Bomb count input
        const bombsInput = bombBinding ? createFlexNumberInput(
            bombBinding,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.bomb_count.value = value;
                bridge.setMunitionsBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        // Rocket count input
        const rocketsInput = rocketBinding ? createFlexNumberInput(
            rocketBinding,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.rocket_count.value = value;
                bridge.setMunitionsBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        // Internal bay count input
        const bayCountInput = bayCountBinding ? createFlexNumberInput(
            bayCountBinding,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.internal_bay_count.value = value;
                bridge.setMunitionsBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        // Internal bay 1 checkbox
        const bay1Checkbox = bay1Binding ? createFlexCheckbox(
            bay1Binding,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.internal_bay_1.selected = checked;
                bridge.setMunitionsBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        // Internal bay 2 checkbox
        const bay2Checkbox = bay2Binding ? createFlexCheckbox(
            bay2Binding,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getMunitionsBindings();
                updatedBindings.internal_bay_2.selected = checked;
                bridge.setMunitionsBindings(updatedBindings);
                this.onUpdate();
            }
        ) : undefined;

        cell.appendChild(flexContainer.div0);
        return { bombsInput, rocketsInput, bayCountInput, bay1Checkbox, bay2Checkbox };
    }

    /**
     * Create cargo section with simple select
     */
    private createCargoSection(
        cell: HTMLTableCellElement,
        bindings: any,
        bridge: AircraftBridge
    ): HTMLSelectElement {
        // Explicitly handle space_sel (cargo space selector)
        const spaceBinding = bindings.space_sel;

        if (!spaceBinding) {
            return undefined;
        }

        // Create select element using helper
        const cargoSelect = createSelectElement(
            spaceBinding,
            (selectedIndex) => {
                const updatedBindings = bridge.getCargoBindings();
                updatedBindings.space_sel.selected = selectedIndex;
                bridge.setCargoBindings(updatedBindings);
                this.onUpdate();
            }
        );

        cell.appendChild(cargoSelect);
        return cargoSelect;
    }

    /**
     * Update values in existing DOM elements (fast path)
     */
    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge || !this.cache) return;

        const fuelBindings = bridge.getFuelBindings();
        const munitionsBindings = bridge.getMunitionsBindings();
        const cargoBindings = bridge.getCargoBindings();

        // Update fuel inputs (desktop)
        let fuelIdx = 0;
        for (const key in fuelBindings) {
            if (!fuelBindings.hasOwnProperty(key)) continue;
            const binding = fuelBindings[key];

            if (Array.isArray(binding)) {
                // number_list binding (e.g., tank_count)
                binding.forEach((item: any) => {
                    if (fuelIdx < this.cache!.fuelInputs.length) {
                        this.cache!.fuelInputs[fuelIdx].value = item.value.toString();
                        this.cache!.fuelInputs[fuelIdx].disabled = !item.enabled;
                        fuelIdx++;
                    }
                });
            } else if (binding && typeof binding === 'object' && 'value' in binding) {
                // Single number binding
                if (fuelIdx < this.cache!.fuelInputs.length) {
                    this.cache!.fuelInputs[fuelIdx].value = binding.value.toString();
                    this.cache!.fuelInputs[fuelIdx].disabled = !binding.enabled;
                    fuelIdx++;
                }
            }
        }

        // Update fuel inputs (mobile)
        if (fuelBindings.tank_count && Array.isArray(fuelBindings.tank_count) && this.cache.mobileFuelInputs) {
            fuelBindings.tank_count.forEach((item: any, idx: number) => {
                if (idx < this.cache!.mobileFuelInputs!.length) {
                    this.cache!.mobileFuelInputs![idx].value = item.value.toString();
                    this.cache!.mobileFuelInputs![idx].disabled = !item.enabled;
                }
            });
        }

        // Update seal checkbox (desktop)
        if (this.cache.sealCheckbox) {
            this.cache.sealCheckbox.checked = fuelBindings.self_sealing?.selected || false;
            this.cache.sealCheckbox.disabled = !fuelBindings.self_sealing?.enabled;
        }

        // Update seal checkbox (mobile)
        if (this.cache.mobileSealCheckbox && fuelBindings.self_sealing) {
            this.cache.mobileSealCheckbox.checked = fuelBindings.self_sealing.selected || false;
            this.cache.mobileSealCheckbox.disabled = !fuelBindings.self_sealing.enabled;
        }

        // Update extinguisher checkbox (desktop)
        if (this.cache.extinguisherCheckbox) {
            this.cache.extinguisherCheckbox.checked = fuelBindings.fire_extinguisher?.selected || false;
            this.cache.extinguisherCheckbox.disabled = !fuelBindings.fire_extinguisher?.enabled;
        }

        // Update extinguisher checkbox (mobile)
        if (this.cache.mobileExtinguisherCheckbox && fuelBindings.fire_extinguisher) {
            this.cache.mobileExtinguisherCheckbox.checked = fuelBindings.fire_extinguisher.selected || false;
            this.cache.mobileExtinguisherCheckbox.disabled = !fuelBindings.fire_extinguisher.enabled;
        }

        // Update munitions inputs (desktop)
        if (this.cache.bombsInput) {
            this.cache.bombsInput.value = munitionsBindings.bomb_count?.value?.toString() || '0';
            this.cache.bombsInput.disabled = !munitionsBindings.bomb_count?.enabled;
        }

        if (this.cache.rocketsInput) {
            this.cache.rocketsInput.value = munitionsBindings.rocket_count?.value?.toString() || '0';
            this.cache.rocketsInput.disabled = !munitionsBindings.rocket_count?.enabled;
        }

        if (this.cache.bayCountInput) {
            this.cache.bayCountInput.value = munitionsBindings.internal_bay_count?.value?.toString() || '0';
            this.cache.bayCountInput.disabled = !munitionsBindings.internal_bay_count?.enabled;
        }

        if (this.cache.bay1Checkbox) {
            this.cache.bay1Checkbox.checked = munitionsBindings.internal_bay_1?.selected || false;
            this.cache.bay1Checkbox.disabled = !munitionsBindings.internal_bay_1?.enabled;
        }

        if (this.cache.bay2Checkbox) {
            this.cache.bay2Checkbox.checked = munitionsBindings.internal_bay_2?.selected || false;
            this.cache.bay2Checkbox.disabled = !munitionsBindings.internal_bay_2?.enabled;
        }

        // Update munitions inputs (mobile)
        if (this.cache.mobileBombsInput && munitionsBindings.bomb_count) {
            this.cache.mobileBombsInput.value = munitionsBindings.bomb_count.value?.toString() || '0';
            this.cache.mobileBombsInput.disabled = !munitionsBindings.bomb_count.enabled;
        }

        if (this.cache.mobileRocketsInput && munitionsBindings.rocket_count) {
            this.cache.mobileRocketsInput.value = munitionsBindings.rocket_count.value?.toString() || '0';
            this.cache.mobileRocketsInput.disabled = !munitionsBindings.rocket_count.enabled;
        }

        if (this.cache.mobileBayCountInput && munitionsBindings.internal_bay_count) {
            this.cache.mobileBayCountInput.value = munitionsBindings.internal_bay_count.value?.toString() || '0';
            this.cache.mobileBayCountInput.disabled = !munitionsBindings.internal_bay_count.enabled;
        }

        if (this.cache.mobileBay1Checkbox && munitionsBindings.internal_bay_1) {
            this.cache.mobileBay1Checkbox.checked = munitionsBindings.internal_bay_1.selected || false;
            this.cache.mobileBay1Checkbox.disabled = !munitionsBindings.internal_bay_1.enabled;
        }

        if (this.cache.mobileBay2Checkbox && munitionsBindings.internal_bay_2) {
            this.cache.mobileBay2Checkbox.checked = munitionsBindings.internal_bay_2.selected || false;
            this.cache.mobileBay2Checkbox.disabled = !munitionsBindings.internal_bay_2.enabled;
        }

        // Update cargo select (desktop)
        if (this.cache.cargoSelect && cargoBindings.space_sel) {
            this.cache.cargoSelect.selectedIndex = cargoBindings.space_sel.selected;
            this.cache.cargoSelect.disabled = !cargoBindings.space_sel.enabled;
        }

        // Update cargo select (mobile)
        if (this.cache.mobileCargoSelect && cargoBindings.space_sel) {
            updateSelectElement(this.cache.mobileCargoSelect, cargoBindings.space_sel);
        }

        // Update stat values
        // Get all three component stats and combine them
        const fuelStats = bridge.getFuelStats();
        const munitionsStats = bridge.getMunitionsStats();
        const cargoStats = bridge.getCargoStats();
        const stats = addStats(fuelStats, munitionsStats, cargoStats);
        const derived = bridge.getDerivedStats();
        updateStatsTable(this.cache.statsTable, stats, LOAD_STATS, derived);

        // Update mobile stats grid
        if (this.cache.mobileStatsGrid) {
            updateMobileStatsGrid(this.cache.mobileStatsGrid, stats, LOAD_STATS, derived);
        }
    }
}
