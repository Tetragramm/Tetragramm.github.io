import { AircraftBridge } from '../aircraft_bridge';
import { BaseComponentUI } from '../base_component_ui';
import { localization } from '../localization';
import {
    createCollapsibleSection, createFlexCheckbox, createFlexLabel, createFlexNumberInput,
    createFlexSection, createFlexSelect, createRulesLink, createSelectElement, updateSelectElement,
    createStatsTable, updateStatsTable, StatDisplayConfig,
    createMobileOptionItem, createMobileNumberInput, createMobileCheckbox, createMobileSelect,
    createMobileStatsGrid, updateMobileStatsGrid
} from '../dom_utils';

// Mobile cache interfaces
interface MobileEngineCache {
    engineIndex: number;
    listSelect: HTMLSelectElement;
    typeSelect: HTMLSelectElement;
    rarityValue: HTMLSpanElement;
    baseStatsGrid: HTMLDivElement;
    coolingContent: HTMLDivElement;
    coolingType: 'rotary' | 'air' | 'liquid';
    radiatorSelect?: HTMLSelectElement;
    coolingCountInput?: HTMLInputElement;
    intakeFanCheckbox?: HTMLInputElement;
    mountSelect?: HTMLSelectElement;
    pushPullCheckbox?: HTMLInputElement;
    torqueCheckbox?: HTMLInputElement;
    driveshaftCheckbox?: HTMLInputElement;
    outboardCheckbox?: HTMLInputElement;
    gearCountInput?: HTMLInputElement;
    gearReliabilityInput?: HTMLInputElement;
    cowlSelect?: HTMLSelectElement;
    alternatorCheckbox?: HTMLInputElement;
    generatorCheckbox?: HTMLInputElement;
    statsGrid: HTMLDivElement;
}

interface MobileRadiatorCache {
    radiatorIndex: number;
    typeSelect: HTMLSelectElement;
    mountSelect: HTMLSelectElement;
    coolantSelect: HTMLSelectElement;
    hardenCheckbox?: HTMLInputElement;
    statsGrid: HTMLDivElement;
}

// Engine stats configuration for stats table
const ENGINE_STATS: StatDisplayConfig[] = [
    // Row 1
    { key: 'power', label: 'Stat Power', positiveIsGood: true },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    // Row 2
    { key: 'reliability', label: 'Stat Reliability', positiveIsGood: true, isDerived: true },
    { key: 'visibility', label: 'Stat Visibility', positiveIsGood: false },
    { key: 'overspeed', label: 'Stat Overspeed', positiveIsGood: true, isDerived: false },
    // Row 3
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'altitude', label: 'Stat Altitude', isDerived: false },
    { key: 'fuelconsumption', label: 'Stat Fuel Consumption', positiveIsGood: false },
    // Row 4
    { key: 'pitchstab', label: 'Stat Pitch Stability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'maxstrain', label: 'Stat Max Strain', positiveIsGood: true },
    // Row 5
    { key: 'structure', label: 'Stat Structure', positiveIsGood: true },
    { key: 'flightstress', label: 'Stat Flight Stress', positiveIsGood: false },
    { key: 'reqsections', label: 'Stat Required Sections', positiveIsGood: false },
    // Row 6
    { key: 'charge', label: 'Stat Charge', positiveIsGood: true },
    { key: '', label: '' }, // Empty cell
    { key: '', label: '' }  // Empty cell
];

const BASE_STATS: StatDisplayConfig[] = [
    { key: 'rarity', label: 'Rarity', isDerived: false },
    { key: 'power', label: 'Stat Power', positiveIsGood: true },
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    { key: 'reliability', label: 'Stat Reliability', positiveIsGood: true },
    { key: 'cooling', label: 'Stat Cooling', positiveIsGood: false },
    { key: 'overspeed', label: 'Stat Overspeed', positiveIsGood: true, isDerived: false },
    { key: 'fuelconsumption', label: 'Stat Fuel Consumption', positiveIsGood: false },
    { key: 'altitude', label: 'Stat Altitude', positiveIsGood: true, isDerived: false },
    { key: 'torque', label: 'Stat Torque', positiveIsGood: false, isDerived: false },
    { key: 'rumble', label: 'Stat Rumble', positiveIsGood: false, isDerived: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
];

/**
 * Engines UI Component
 * Handles both Engines container and individual Engine/Radiator UI
 */
export class EnginesUI extends BaseComponentUI {
    // Container elements
    private enginesSection: HTMLElement;
    private asymmetricCheckbox: HTMLInputElement;
    private numEnginesInput: HTMLInputElement;
    private numRadiatorsInput: HTMLInputElement;

    // Individual engine/radiator containers
    private enginesContainer: HTMLDivElement;
    private radiatorsContainer: HTMLDivElement;
    private radiatorsTable: HTMLTableElement;

    // Mobile containers
    private mobileEnginesContainer: HTMLDivElement;
    private mobileRadiatorsContainer: HTMLDivElement;

    // Mobile navigation state
    private mobileNumEnginesInput: HTMLInputElement;
    private mobileNumRadiatorsInput: HTMLInputElement;
    private mobileAsymmetricCheckbox: HTMLInputElement;
    private mobileSelectedEngine: number;
    private mobileSelectedRadiator: number;
    private mobileEngineContent: HTMLDivElement;
    private mobileEngineNavLabel: HTMLSpanElement;
    private mobileRadiatorContent: HTMLDivElement;
    private mobileRadiatorNavLabel: HTMLSpanElement;

    // Mobile caches
    private mobileEngineCache: MobileEngineCache | undefined;
    private mobileRadiatorCache: MobileRadiatorCache | undefined;

    // Cached engine/radiator UIs (will be cleared when counts change)
    private engineUIs: EngineUI[];
    private radiatorUIs: RadiatorUI[];
    private cachedEngineCount: number;
    private cachedRadiatorCount: number;

    constructor(
        getBridge: () => AircraftBridge,
        containerId: string,
        onUpdate?: () => void
    ) {
        super(getBridge, containerId, onUpdate);
    }

    protected shouldUpdate(): boolean {
        // Can update if we have cached elements; count changes are handled
        // incrementally in updateValues via rebuildRadiators/rebuildEngines
        return this.enginesSection !== undefined;
    }

    protected clearCache(): void {
        this.enginesSection = undefined;
        this.asymmetricCheckbox = undefined;
        this.numEnginesInput = undefined;
        this.numRadiatorsInput = undefined;
        this.enginesContainer = undefined;
        this.radiatorsContainer = undefined;
        this.radiatorsTable = undefined;
        this.mobileEnginesContainer = undefined;
        this.mobileRadiatorsContainer = undefined;
        this.mobileEngineContent = undefined;
        this.mobileEngineNavLabel = undefined;
        this.mobileRadiatorContent = undefined;
        this.mobileRadiatorNavLabel = undefined;
        this.mobileSelectedEngine = 0;
        this.mobileSelectedRadiator = 0;
        this.mobileEngineCache = undefined;
        this.mobileRadiatorCache = undefined;
        this.engineUIs = [];
        this.radiatorUIs = [];
        this.cachedEngineCount = 0;
        this.cachedRadiatorCount = 0;
        this.mobileNumEnginesInput = undefined;
        this.mobileNumRadiatorsInput = undefined;
        this.mobileAsymmetricCheckbox = undefined;
    }

    protected rebuildFull(): void {
        this.clearCache();

        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getEnginesBindings();

        this.container.innerHTML = '';

        // Create wrapper for both desktop and mobile content
        const contentWrapper = document.createElement('div');

        // === DESKTOP VERSION ===
        const desktopDiv = document.createElement('div');
        desktopDiv.className = 'desktop-only';

        // Create collapsible section for Engines
        const sectionDiv = document.createElement('div');

        // Create global controls table
        const controlsSpan = document.createElement('span');
        sectionDiv.appendChild(controlsSpan);

        // Number of engines 
        this.numEnginesInput = createFlexNumberInput(bindings.engines,
            { div1: controlsSpan, div2: controlsSpan },
            (value) => {
                const bindings = bridge.getEnginesBindings()
                bindings.engines.value = value;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            }, '0', '20', '1');

        // Number of radiators 
        this.numRadiatorsInput = createFlexNumberInput(bindings.radiators,
            { div1: controlsSpan, div2: controlsSpan },
            (value) => {
                const bindings = bridge.getEnginesBindings()
                bindings.radiators.value = value;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            }, '0', '20', '1');

        // Asymmetric checkbox
        this.asymmetricCheckbox = createFlexCheckbox({ name: localization.translate("Engines Asymmetric Plane"), value: false, enabled: true },
            { div1: controlsSpan, div2: controlsSpan },
            () => {
                const bindings = this.getBridge().getEnginesBindings();
                bindings.is_asymmetric.selected = this.asymmetricCheckbox!.checked;
                this.getBridge().setEnginesBindings(bindings);
                this.onUpdate();
            });

        // Container for individual engines
        this.enginesContainer = document.createElement('div');
        sectionDiv.appendChild(this.enginesContainer);

        // Container for individual radiators
        this.radiatorsContainer = document.createElement('div');
        sectionDiv.appendChild(this.radiatorsContainer);

        desktopDiv.appendChild(sectionDiv);
        contentWrapper.appendChild(desktopDiv);

        // === MOBILE VERSION ===
        const mobileDiv = document.createElement('div');
        mobileDiv.className = 'mobile-only mobile-option-group';

        // Global controls
        const controlsItem = createMobileOptionItem(
            '',
            mobileDiv
        );

        // Number of engines
        this.mobileNumEnginesInput = createMobileNumberInput(
            bindings.engines,
            controlsItem.content,
            (value) => {
                const bindings = bridge.getEnginesBindings();
                bindings.engines.value = value;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            },
            0, 20, 1
        ).input;

        // Number of radiators
        this.mobileNumRadiatorsInput = createMobileNumberInput(
            bindings.radiators,
            controlsItem.content,
            (value) => {
                const bindings = bridge.getEnginesBindings();
                bindings.radiators.value = value;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            },
            0, 20, 1
        ).input;

        // Asymmetric checkbox
        this.mobileAsymmetricCheckbox = createMobileCheckbox(
            { name: localization.translate("Engines Asymmetric Plane"), selected: bindings.is_asymmetric.selected, enabled: bindings.is_asymmetric.enabled },
            controlsItem.content,
            (checked) => {
                const bindings = bridge.getEnginesBindings();
                bindings.is_asymmetric.selected = checked;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            }
        );

        // Container for mobile engines
        this.mobileEnginesContainer = document.createElement('div');
        mobileDiv.appendChild(this.mobileEnginesContainer);

        // Container for mobile radiators
        this.mobileRadiatorsContainer = document.createElement('div');
        mobileDiv.appendChild(this.mobileRadiatorsContainer);


        contentWrapper.appendChild(mobileDiv);

        // Create the collapsible section with the content wrapper
        const section = createCollapsibleSection(
            localization.translate('Engines Section Title'),
            contentWrapper,
            true
        );

        this.sectionElement = section;
        this.enginesSection = section;

        // Add rules link using utility function
        const rulesLine = document.createElement('span');
        rulesLine.appendChild(createRulesLink('_Engines', 'Engine Rules').firstChild);
        rulesLine.appendChild(createRulesLink('_Engines_Upgrades', 'Upgrade Rules').firstChild);
        rulesLine.appendChild(createRulesLink('_Cooling_(Air)', 'Cooling Rules').firstChild);

        // Add Engine Builder link (desktop)
        const engineBuilderSpan = document.createElement('span');
        const engineBuilderLink = document.createElement('a');
        engineBuilderLink.href = './engine.html';
        const engineBuilderText = document.createElement('u');
        engineBuilderText.textContent = 'Engine Builder';
        engineBuilderLink.appendChild(engineBuilderText);
        engineBuilderSpan.appendChild(engineBuilderLink);
        rulesLine.appendChild(engineBuilderSpan);

        rulesLine.appendChild(document.createElement('br'));
        this.sectionElement.insertBefore(
            rulesLine,
            this.sectionElement.children[1]
        );

        this.container.appendChild(section);

        // Initial update
        this.updateValues();
    }

    protected updateValues(): void {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return;

        const bindings = bridge.getEnginesBindings();

        // Update container-level controls
        if (this.asymmetricCheckbox) {
            this.asymmetricCheckbox.checked = bindings.is_asymmetric.selected;
            this.asymmetricCheckbox.disabled = !bindings.is_asymmetric.enabled;
        }

        if (this.numEnginesInput) {
            this.numEnginesInput.value = bindings.engines.value;
        }

        if (this.numRadiatorsInput) {
            this.numRadiatorsInput.value = bindings.radiators.value;
        }

        // Check if engine/radiator counts changed
        const engineCountChanged = bindings.engines.value !== this.cachedEngineCount;
        const radiatorCountChanged = bindings.radiators.value !== this.cachedRadiatorCount;

        // Rebuild engine UIs if count changed
        if (engineCountChanged) {
            this.cachedEngineCount = bindings.engines.value;
            this.rebuildEngines();
            this.rebuildMobileEngines();
        } else {
            // Just update existing engine UIs
            this.engineUIs.forEach(engineUI => engineUI.update());
            this.updateMobileEngineContent();
        }

        // Rebuild radiator UIs if count changed
        if (radiatorCountChanged) {
            this.cachedRadiatorCount = bindings.radiators.value;
            this.rebuildRadiators();
            this.rebuildMobileRadiators();
        } else {
            // Just update existing radiator UIs
            this.radiatorUIs.forEach(radiatorUI => radiatorUI.update());
            this.updateMobileRadiatorContent();
        }

        if (this.mobileAsymmetricCheckbox) {
            this.mobileAsymmetricCheckbox.checked = bindings.is_asymmetric.selected;
            this.mobileAsymmetricCheckbox.disabled = !bindings.is_asymmetric.enabled;
        }

        if (this.mobileNumEnginesInput) {
            this.mobileNumEnginesInput.value = bindings.engines.value;
            this.mobileNumEnginesInput.disabled = !bindings.engines.enabled;
        }

        if (this.mobileNumRadiatorsInput) {
            this.mobileNumRadiatorsInput.value = bindings.radiators.value;
            this.mobileNumRadiatorsInput.disabled = !bindings.radiators.enabled;
        }
    }

    private rebuildMobileEngines(): void {
        if (!this.mobileEnginesContainer) return;
        this.mobileEnginesContainer.innerHTML = '';
        this.mobileEngineCache = undefined; // Clear cache when rebuilding

        const bridge = this.getBridge();
        const bindings = bridge.getEnginesBindings();
        const engineCount = bindings.engines.value;

        if (engineCount === 0) return;

        // Ensure selected engine is within bounds
        if (this.mobileSelectedEngine >= engineCount) {
            this.mobileSelectedEngine = 0;
        }

        // Create navigation header
        const navDiv = document.createElement('div');
        navDiv.className = 'mobile-nav-header';
        navDiv.style.marginBottom = '0.5rem';
        navDiv.style.padding = '0.5rem';
        navDiv.style.backgroundColor = 'rgba(56, 56, 56, 0.3)';
        navDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem 1rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedEngine > 0) {
                this.mobileSelectedEngine--;
                this.updateMobileEngineContent();
            }
        };
        navDiv.appendChild(prevBtn);

        // Engine label
        this.mobileEngineNavLabel = document.createElement('span');
        this.mobileEngineNavLabel.className = 'mobile-option-title';
        this.mobileEngineNavLabel.textContent = `${localization.translate('Engines Engine')} ${this.mobileSelectedEngine + 1} / ${engineCount}`;
        navDiv.appendChild(this.mobileEngineNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem 1rem 1rem';
        nextBtn.onclick = () => {
            if (this.mobileSelectedEngine < engineCount - 1) {
                this.mobileSelectedEngine++;
                this.updateMobileEngineContent();
            }
        };
        navDiv.appendChild(nextBtn);

        this.mobileEnginesContainer.appendChild(navDiv);

        // Content container for the selected engine
        this.mobileEngineContent = document.createElement('div');
        this.mobileEnginesContainer.appendChild(this.mobileEngineContent);

        // Build content for the currently selected engine
        this.updateMobileEngineContent();
    }

    private updateMobileEngineContent(): void {
        if (!this.mobileEngineContent) return;

        const bridge = this.getBridge();
        const bindings = bridge.getEnginesBindings();
        const engineCount = bindings.engines.value;
        const idx = this.mobileSelectedEngine;

        // Update nav label
        if (this.mobileEngineNavLabel) {
            this.mobileEngineNavLabel.textContent = `${localization.translate('Engines Engine')} ${idx + 1} / ${engineCount}`;
        }

        if (idx >= engineCount) return;

        // Determine current cooling type for cache validation
        const fullStats = bridge.getEngineFullStats(idx);
        const currentCoolingType = this.determineCoolingType(fullStats);

        // Check if cache is valid
        if (this.mobileEngineCache &&
            this.mobileEngineCache.engineIndex === idx &&
            this.mobileEngineCache.coolingType === currentCoolingType) {
            // Update existing cache values
            this.updateMobileEngineCacheValues(bridge, idx);
        } else {
            // Rebuild content and create new cache
            this.buildMobileEngineContent(bridge, idx);
        }
    }

    private determineCoolingType(fullStats: any): 'rotary' | 'air' | 'liquid' {
        if (fullStats.oiltank) return 'rotary';
        const cooling = fullStats.stats.cooling || 0;
        return cooling === 0 ? 'air' : 'liquid';
    }

    private buildMobileEngineContent(bridge: AircraftBridge, idx: number): void {
        this.mobileEngineContent.innerHTML = '';

        const fullStats = bridge.getEngineFullStats(idx);
        const coolingType = this.determineCoolingType(fullStats);

        // Engine Selection section
        const selectionItem = createMobileOptionItem(
            localization.translate('Engines Engine Type'),
            this.mobileEngineContent
        );

        // Engine list selection
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(idx);

        const listSelect = createMobileSelect(
            {
                name: localization.translate('Engine List'),
                options: allLists.map(o => ({ name: o, enabled: true })),
                selected: allLists.indexOf(selectedList),
                enabled: true
            },
            selectionItem.content,
            (selected) => {
                bridge.setEngineSelectedList(idx, allLists[selected]);
                this.onUpdate();
            }
        );

        // Engine type selection
        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngine = bridge.getEngineSelectedName(idx);

        const typeSelect = createMobileSelect(
            {
                name: localization.translate('Engine Type'),
                options: enginesInList.map(o => ({ name: o, enabled: true })),
                selected: enginesInList.indexOf(selectedEngine),
                enabled: true
            },
            selectionItem.content,
            (selected) => {
                bridge.setEngineSelectedIndex(idx, selected);
                this.onUpdate();
            }
        );

        // Engine base stats display
        const baseStatsGrid = createMobileStatsGrid(fullStats.stats, BASE_STATS, fullStats);
        const rarityValue = baseStatsGrid.children[0].children[1] as HTMLDivElement;
        rarityValue.className = 'mobile-stat-value ' + this.getRarityClass(fullStats.rarity);
        rarityValue.textContent = this.getRarityText(fullStats.rarity);


        selectionItem.content.appendChild(baseStatsGrid);

        // Get engine bindings for options
        const engineBindings = bridge.getEngineBindings(idx);

        // Cooling section
        const coolingItem = createMobileOptionItem(
            localization.translate('Engine Cooling'),
            this.mobileEngineContent
        );
        const coolingElements = this.buildMobileCoolingSectionWithCache(coolingItem.content, engineBindings, fullStats, idx);

        // Mounting section
        const mountingItem = createMobileOptionItem(
            localization.translate('Engine Mounting'),
            this.mobileEngineContent
        );
        const mountingElements = this.buildMobileMountingSectionWithCache(mountingItem.content, engineBindings, idx);

        // Upgrades section
        const upgradesItem = createMobileOptionItem(
            localization.translate('Engine Upgrades'),
            this.mobileEngineContent
        );
        const upgradesElements = this.buildMobileUpgradesSectionWithCache(upgradesItem.content, engineBindings, idx);

        // Cowl & Electrical section
        const cowlItem = createMobileOptionItem(
            localization.translate('Engine Cowls') + ' & ' + localization.translate('Engine Electrical'),
            this.mobileEngineContent
        );
        const cowlElements = this.buildMobileCowlElectricalSectionWithCache(cowlItem.content, engineBindings, idx);

        // Full Stats section
        const statsItem = createMobileOptionItem(
            localization.translate('Engines Engine Stats'),
            this.mobileEngineContent
        );
        const engineStats = bridge.getEngineStats(idx);
        const derivedStats = bridge.getEngineDerivedStats(idx);
        const statsGrid = createMobileStatsGrid(engineStats, ENGINE_STATS, derivedStats);
        statsItem.content.appendChild(statsGrid);

        // Store cache
        this.mobileEngineCache = {
            engineIndex: idx,
            listSelect,
            typeSelect,
            rarityValue,
            baseStatsGrid,
            coolingContent: coolingItem.content as HTMLDivElement,
            coolingType,
            ...coolingElements,
            ...mountingElements,
            ...upgradesElements,
            ...cowlElements,
            statsGrid
        };
    }

    private updateMobileEngineCacheValues(bridge: AircraftBridge, idx: number): void {
        if (!this.mobileEngineCache) return;

        const cache = this.mobileEngineCache;
        const fullStats = bridge.getEngineFullStats(idx);
        const engineBindings = bridge.getEngineBindings(idx);

        // Update list select
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(idx);
        cache.listSelect.innerHTML = '';
        allLists.forEach((list, i) => {
            const opt = document.createElement('option');
            opt.value = i.toString();
            opt.textContent = list;
            cache.listSelect.appendChild(opt);
        });
        cache.listSelect.selectedIndex = allLists.indexOf(selectedList);

        // Update type select
        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngine = bridge.getEngineSelectedName(idx);
        cache.typeSelect.innerHTML = '';
        enginesInList.forEach((eng, i) => {
            const opt = document.createElement('option');
            opt.value = i.toString();
            opt.textContent = eng;
            cache.typeSelect.appendChild(opt);
        });
        cache.typeSelect.selectedIndex = enginesInList.indexOf(selectedEngine);

        // Update base stats grid
        updateMobileStatsGrid(cache.baseStatsGrid, fullStats.stats, BASE_STATS, fullStats);
        cache.rarityValue.className = 'mobile-stat-value ' + this.getRarityClass(fullStats.rarity);
        cache.rarityValue.textContent = this.getRarityText(fullStats.rarity);

        // Update cooling section elements based on type
        if (cache.coolingType === 'liquid') {
            if (cache.radiatorSelect) {
                const radiatorCount = bridge.getNumberOfRadiators();
                cache.radiatorSelect.innerHTML = '';
                for (let i = 0; i < radiatorCount; i++) {
                    const opt = document.createElement('option');
                    opt.value = i.toString();
                    opt.textContent = localization.translateWithParam('Vital Part Radiator', i + 1);
                    cache.radiatorSelect.appendChild(opt);
                }
                cache.radiatorSelect.selectedIndex = engineBindings.radiator_index?.value || 0;
            }
            if (cache.coolingCountInput && engineBindings.cooling_count) {
                cache.coolingCountInput.value = engineBindings.cooling_count.value.toString();
                cache.coolingCountInput.disabled = !engineBindings.cooling_count.enabled;
            }
        } else if (cache.coolingType === 'air' && cache.intakeFanCheckbox && engineBindings.intake_fan) {
            cache.intakeFanCheckbox.checked = engineBindings.intake_fan.selected;
            cache.intakeFanCheckbox.disabled = !engineBindings.intake_fan.enabled;
        }

        // Update mounting section
        if (cache.mountSelect) {
            cache.mountSelect.innerHTML = '';
            engineBindings.mount_sel.options.forEach((opt: any, i: number) => {
                const option = document.createElement('option');
                option.value = i.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                cache.mountSelect.appendChild(option);
            });
            cache.mountSelect.selectedIndex = engineBindings.mount_sel.selected;
            cache.mountSelect.disabled = !engineBindings.mount_sel.enabled;
        }
        if (cache.pushPullCheckbox && engineBindings.is_push_pull) {
            cache.pushPullCheckbox.checked = engineBindings.is_push_pull.selected;
            cache.pushPullCheckbox.disabled = !engineBindings.is_push_pull.enabled;
        }
        if (cache.torqueCheckbox && engineBindings.torque_to_struct) {
            cache.torqueCheckbox.checked = engineBindings.torque_to_struct.selected;
            cache.torqueCheckbox.disabled = !engineBindings.torque_to_struct.enabled;
        }

        // Update upgrades section
        if (cache.driveshaftCheckbox && engineBindings.extended_ds) {
            cache.driveshaftCheckbox.checked = engineBindings.extended_ds.selected;
            cache.driveshaftCheckbox.disabled = !engineBindings.extended_ds.enabled;
        }
        if (cache.outboardCheckbox && engineBindings.outboard_prop) {
            cache.outboardCheckbox.checked = engineBindings.outboard_prop.selected;
            cache.outboardCheckbox.disabled = !engineBindings.outboard_prop.enabled;
        }
        if (cache.gearCountInput && engineBindings.gear_count) {
            cache.gearCountInput.value = engineBindings.gear_count.value.toString();
            cache.gearCountInput.disabled = !engineBindings.gear_count.enabled;
        }
        if (cache.gearReliabilityInput && engineBindings.geared_reliability) {
            cache.gearReliabilityInput.value = engineBindings.geared_reliability.value.toString();
            cache.gearReliabilityInput.disabled = !engineBindings.geared_reliability.enabled;
        }

        // Update cowl & electrical section
        if (cache.cowlSelect) {
            cache.cowlSelect.innerHTML = '';
            engineBindings.cowl_sel.options.forEach((opt: any, i: number) => {
                const option = document.createElement('option');
                option.value = i.toString();
                option.textContent = opt.name;
                option.disabled = !opt.enabled;
                cache.cowlSelect.appendChild(option);
            });
            cache.cowlSelect.selectedIndex = engineBindings.cowl_sel.selected;
            cache.cowlSelect.disabled = !engineBindings.cowl_sel.enabled;
        }
        if (cache.alternatorCheckbox && engineBindings.has_alternator) {
            cache.alternatorCheckbox.checked = engineBindings.has_alternator.selected;
            cache.alternatorCheckbox.disabled = !engineBindings.has_alternator.enabled;
        }
        if (cache.generatorCheckbox && engineBindings.is_generator) {
            cache.generatorCheckbox.checked = engineBindings.is_generator.selected;
            cache.generatorCheckbox.disabled = !engineBindings.is_generator.enabled;
        }

        // Update stats grid
        const engineStats = bridge.getEngineStats(idx);
        const derivedStats = bridge.getEngineDerivedStats(idx);
        updateMobileStatsGrid(cache.statsGrid, engineStats, ENGINE_STATS, derivedStats);
    }

    private buildMobileCoolingSectionWithCache(container: HTMLElement, bindings: any, fullStats: any, idx: number): Partial<MobileEngineCache> {
        const bridge = this.getBridge();
        const cooling = fullStats.stats.cooling || 0;
        const result: Partial<MobileEngineCache> = {};

        if (fullStats.oiltank) {
            // Rotary engine
            const span = document.createElement('div');
            span.style.whiteSpace = 'pre-line';
            span.textContent = localization.translate('Engine Rotary Cooling');
            container.appendChild(span);
        } else if (cooling === 0) {
            // Air-cooled engine
            const span = document.createElement('div');
            span.textContent = localization.translate('Engine Air-Cooled Engine.');
            container.appendChild(span);

            // Intake fan checkbox (for turbines)
            if (bindings.intake_fan && bindings.intake_fan.enabled) {
                result.intakeFanCheckbox = createMobileCheckbox(
                    bindings.intake_fan,
                    container,
                    (checked) => {
                        const updatedBindings = bridge.getEngineBindings(idx);
                        updatedBindings.intake_fan.selected = checked;
                        bridge.setEngineBindings(idx, updatedBindings);
                        this.onUpdate();
                    }
                );
            }
        } else {
            // Liquid-cooled engine
            const radiatorCount = bridge.getNumberOfRadiators();
            if (radiatorCount > 0) {
                result.radiatorSelect = createMobileSelect(
                    {
                        name: localization.translate('Engine Select Radiator'),
                        options: Array.from({ length: radiatorCount }, (_, i) => ({
                            name: localization.translateWithParam('Vital Part Radiator', i + 1),
                            enabled: true
                        })),
                        selected: bindings.radiator_index?.value || 0,
                        enabled: true
                    },
                    container,
                    (selected) => {
                        const updatedBindings = bridge.getEngineBindings(idx);
                        updatedBindings.radiator_index.value = selected;
                        bridge.setEngineBindings(idx, updatedBindings);
                        this.onUpdate();
                    }
                );
            }

            // Cooling count
            if (bindings.cooling_count) {
                const { input } = createMobileNumberInput(
                    bindings.cooling_count,
                    container,
                    (value) => {
                        const updatedBindings = bridge.getEngineBindings(idx);
                        updatedBindings.cooling_count.value = value;
                        bridge.setEngineBindings(idx, updatedBindings);
                        this.onUpdate();
                    },
                    0, 99, 1
                );
                result.coolingCountInput = input;
            }
        }

        return result;
    }

    private buildMobileMountingSectionWithCache(container: HTMLElement, bindings: any, idx: number): Partial<MobileEngineCache> {
        const bridge = this.getBridge();
        const result: Partial<MobileEngineCache> = {};

        // Mounting location
        result.mountSelect = createMobileSelect(
            {
                name: localization.translate('Engine Mounting Location'),
                options: bindings.mount_sel.options,
                selected: bindings.mount_sel.selected,
                enabled: bindings.mount_sel.enabled
            },
            container,
            (selected) => {
                const updatedBindings = bridge.getEngineBindings(idx);
                updatedBindings.mount_sel.selected = selected;
                bridge.setEngineBindings(idx, updatedBindings);
                this.onUpdate();
            }
        );

        // Push-pull checkbox
        if (bindings.is_push_pull) {
            result.pushPullCheckbox = createMobileCheckbox(
                bindings.is_push_pull,
                container,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.is_push_pull.selected = checked;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Torque to structure checkbox
        if (bindings.torque_to_struct) {
            result.torqueCheckbox = createMobileCheckbox(
                bindings.torque_to_struct,
                container,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.torque_to_struct.selected = checked;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        return result;
    }

    private buildMobileUpgradesSectionWithCache(container: HTMLElement, bindings: any, idx: number): Partial<MobileEngineCache> {
        const bridge = this.getBridge();
        const result: Partial<MobileEngineCache> = {};

        // Extended driveshafts
        if (bindings.extended_ds) {
            result.driveshaftCheckbox = createMobileCheckbox(
                bindings.extended_ds,
                container,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.extended_ds.selected = checked;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Outboard propeller
        if (bindings.outboard_prop) {
            result.outboardCheckbox = createMobileCheckbox(
                bindings.outboard_prop,
                container,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.outboard_prop.selected = checked;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Geared propeller count
        if (bindings.gear_count) {
            const { input } = createMobileNumberInput(
                bindings.gear_count,
                container,
                (value) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.gear_count.value = value;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                },
                0, 10, 1
            );
            result.gearCountInput = input;
        }

        // Geared propeller reliability
        if (bindings.geared_reliability) {
            const { input } = createMobileNumberInput(
                bindings.geared_reliability,
                container,
                (value) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.geared_reliability.value = value;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                },
                0, 10, 1
            );
            result.gearReliabilityInput = input;
        }

        return result;
    }

    private buildMobileCowlElectricalSectionWithCache(container: HTMLElement, bindings: any, idx: number): Partial<MobileEngineCache> {
        const bridge = this.getBridge();
        const result: Partial<MobileEngineCache> = {};

        // Cowl select
        result.cowlSelect = createMobileSelect(
            {
                name: localization.translate('Engine Cowls'),
                options: bindings.cowl_sel.options,
                selected: bindings.cowl_sel.selected,
                enabled: bindings.cowl_sel.enabled
            },
            container,
            (selected) => {
                const updatedBindings = bridge.getEngineBindings(idx);
                updatedBindings.cowl_sel.selected = selected;
                bridge.setEngineBindings(idx, updatedBindings);
                this.onUpdate();
            }
        );

        // Alternator checkbox
        if (bindings.has_alternator) {
            result.alternatorCheckbox = createMobileCheckbox(
                bindings.has_alternator,
                container,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.has_alternator.selected = checked;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Generator checkbox
        if (bindings.is_generator) {
            result.generatorCheckbox = createMobileCheckbox(
                bindings.is_generator,
                container,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(idx);
                    updatedBindings.is_generator.selected = checked;
                    bridge.setEngineBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        return result;
    }

    private getRarityText(rarity: any): string {
        switch (rarity) {
            case 'CUSTOM':
            case 0:
                return localization.translate('Rarity Custom');
            case 'COMMON':
            case 1:
                return localization.translate('Rarity Common');
            case 'RARE':
            case 2:
                return localization.translate('Rarity Rare');
            case 'LEGENDARY':
            case 3:
                return localization.translate('Rarity Legendary');
            default:
                return localization.translate('Rarity Custom');
        }
    }

    private getRarityClass(rarity: any): string {
        switch (rarity) {
            case 'CUSTOM':
            case 0:
                return 'ER_Custom';
            case 'COMMON':
            case 1:
                return '';
            case 'RARE':
            case 2:
                return 'ER_Rare';
            case 'LEGENDARY':
            case 3:
                return 'ER_Legendary';
            default:
                return 'ER_Custom';
        }
    }

    private rebuildMobileRadiators(): void {
        if (!this.mobileRadiatorsContainer) return;
        this.mobileRadiatorsContainer.innerHTML = '';

        const bridge = this.getBridge();
        const bindings = bridge.getEnginesBindings();
        const radiatorCount = bindings.radiators.value;

        if (radiatorCount === 0) {
            this.mobileRadiatorCache = undefined;
            return;
        }

        // Ensure selected radiator is within bounds
        const oldSelected = this.mobileSelectedRadiator;
        if (this.mobileSelectedRadiator >= radiatorCount) {
            this.mobileSelectedRadiator = 0;
        }
        // Clear cache if the selected radiator changed
        if (this.mobileSelectedRadiator !== oldSelected) {
            this.mobileRadiatorCache = undefined;
        }

        // Create navigation header
        const navDiv = document.createElement('div');
        navDiv.className = 'mobile-nav-header';
        navDiv.style.marginBottom = '0.5rem';
        navDiv.style.marginTop = '1rem';
        navDiv.style.padding = '0.5rem';
        navDiv.style.backgroundColor = 'rgba(56, 56, 56, 0.3)';
        navDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem 1rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedRadiator > 0) {
                this.mobileSelectedRadiator--;
                this.updateMobileRadiatorContent();
            }
        };
        navDiv.appendChild(prevBtn);

        // Radiator label
        this.mobileRadiatorNavLabel = document.createElement('span');
        this.mobileRadiatorNavLabel.className = 'mobile-option-title';
        this.mobileRadiatorNavLabel.textContent = `${localization.translate('Radiators Radiator')} ${this.mobileSelectedRadiator + 1} / ${radiatorCount}`;
        navDiv.appendChild(this.mobileRadiatorNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem 1rem 1rem';
        nextBtn.onclick = () => {
            if (this.mobileSelectedRadiator < radiatorCount - 1) {
                this.mobileSelectedRadiator++;
                this.updateMobileRadiatorContent();
            }
        };
        navDiv.appendChild(nextBtn);

        this.mobileRadiatorsContainer.appendChild(navDiv);

        // Reuse existing content container if cache is still valid, otherwise create new
        if (this.mobileRadiatorCache && this.mobileRadiatorContent) {
            this.mobileRadiatorsContainer.appendChild(this.mobileRadiatorContent);
        } else {
            this.mobileRadiatorContent = document.createElement('div');
            this.mobileRadiatorsContainer.appendChild(this.mobileRadiatorContent);
        }

        // Update content for the currently selected radiator (triggers blink if cache exists)
        this.updateMobileRadiatorContent();
    }

    private updateMobileRadiatorContent(): void {
        if (!this.mobileRadiatorContent) return;

        const bridge = this.getBridge();
        const bindings = bridge.getEnginesBindings();
        const radiatorCount = bindings.radiators.value;
        const idx = this.mobileSelectedRadiator;

        // Update nav label
        if (this.mobileRadiatorNavLabel) {
            this.mobileRadiatorNavLabel.textContent = `${localization.translate('Radiators Radiator')} ${idx + 1} / ${radiatorCount}`;
        }

        if (idx >= radiatorCount) return;

        // Check if cache is valid for this radiator
        if (this.mobileRadiatorCache && this.mobileRadiatorCache.radiatorIndex === idx) {
            // Update existing cache values
            this.updateMobileRadiatorCacheValues(bridge, idx);
        } else {
            // Rebuild content and create new cache
            this.buildMobileRadiatorContent(bridge, idx);
        }
    }

    private buildMobileRadiatorContent(bridge: AircraftBridge, idx: number): void {
        this.mobileRadiatorContent.innerHTML = '';

        const radiatorBindings = bridge.getRadiatorBindings(idx);

        // Radiator Type section
        const typeItem = createMobileOptionItem(
            localization.translate('Radiators Radiator Type'),
            this.mobileRadiatorContent
        );
        const typeSelect = createMobileSelect(
            {
                name: '',
                options: radiatorBindings.idx_type.options,
                selected: radiatorBindings.idx_type.selected,
                enabled: radiatorBindings.idx_type.enabled
            },
            typeItem.content,
            (selected) => {
                const updatedBindings = bridge.getRadiatorBindings(idx);
                updatedBindings.idx_type.selected = selected;
                bridge.setRadiatorBindings(idx, updatedBindings);
                this.onUpdate();
            }
        );

        // Mounting section
        const mountItem = createMobileOptionItem(
            localization.translate('Radiators Mounting'),
            this.mobileRadiatorContent
        );
        const mountSelect = createMobileSelect(
            {
                name: '',
                options: radiatorBindings.idx_mount.options,
                selected: radiatorBindings.idx_mount.selected,
                enabled: radiatorBindings.idx_mount.enabled
            },
            mountItem.content,
            (selected) => {
                const updatedBindings = bridge.getRadiatorBindings(idx);
                updatedBindings.idx_mount.selected = selected;
                bridge.setRadiatorBindings(idx, updatedBindings);
                this.onUpdate();
            }
        );

        // Coolant section
        const coolantItem = createMobileOptionItem(
            localization.translate('Radiators Coolant'),
            this.mobileRadiatorContent
        );
        const coolantSelect = createMobileSelect(
            {
                name: '',
                options: radiatorBindings.idx_coolant.options,
                selected: radiatorBindings.idx_coolant.selected,
                enabled: radiatorBindings.idx_coolant.enabled
            },
            coolantItem.content,
            (selected) => {
                const updatedBindings = bridge.getRadiatorBindings(idx);
                updatedBindings.idx_coolant.selected = selected;
                bridge.setRadiatorBindings(idx, updatedBindings);
                this.onUpdate();
            }
        );

        // Harden checkbox (if available)
        let hardenCheckbox: HTMLInputElement | undefined;
        if (radiatorBindings.harden_cool) {
            hardenCheckbox = createMobileCheckbox(
                radiatorBindings.harden_cool,
                coolantItem.content,
                (checked) => {
                    const updatedBindings = bridge.getRadiatorBindings(idx);
                    if (updatedBindings.harden_cool) {
                        updatedBindings.harden_cool.selected = checked;
                    }
                    bridge.setRadiatorBindings(idx, updatedBindings);
                    this.onUpdate();
                }
            );
        }

        // Stats section
        const statsItem = createMobileOptionItem(
            localization.translate('Radiators Radiator Stats'),
            this.mobileRadiatorContent
        );
        const stats = bridge.getRadiatorStats(idx);
        const derived = { flammable: bridge.getRadiatorFlammable(idx) };
        const statsGrid = createMobileStatsGrid(stats, RADIATOR_STATS, derived);
        statsItem.content.appendChild(statsGrid);

        // Store cache
        this.mobileRadiatorCache = {
            radiatorIndex: idx,
            typeSelect,
            mountSelect,
            coolantSelect,
            hardenCheckbox,
            statsGrid
        };
    }

    private updateMobileRadiatorCacheValues(bridge: AircraftBridge, idx: number): void {
        if (!this.mobileRadiatorCache) return;

        const cache = this.mobileRadiatorCache;
        const radiatorBindings = bridge.getRadiatorBindings(idx);

        // Update type select
        cache.typeSelect.innerHTML = '';
        radiatorBindings.idx_type.options.forEach((opt: any, i: number) => {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = opt.name;
            option.disabled = !opt.enabled;
            cache.typeSelect.appendChild(option);
        });
        cache.typeSelect.selectedIndex = radiatorBindings.idx_type.selected;
        cache.typeSelect.disabled = !radiatorBindings.idx_type.enabled;

        // Update mount select
        cache.mountSelect.innerHTML = '';
        radiatorBindings.idx_mount.options.forEach((opt: any, i: number) => {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = opt.name;
            option.disabled = !opt.enabled;
            cache.mountSelect.appendChild(option);
        });
        cache.mountSelect.selectedIndex = radiatorBindings.idx_mount.selected;
        cache.mountSelect.disabled = !radiatorBindings.idx_mount.enabled;

        // Update coolant select
        cache.coolantSelect.innerHTML = '';
        radiatorBindings.idx_coolant.options.forEach((opt: any, i: number) => {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = opt.name;
            option.disabled = !opt.enabled;
            cache.coolantSelect.appendChild(option);
        });
        cache.coolantSelect.selectedIndex = radiatorBindings.idx_coolant.selected;
        cache.coolantSelect.disabled = !radiatorBindings.idx_coolant.enabled;

        // Update harden checkbox if it exists
        if (cache.hardenCheckbox && radiatorBindings.harden_cool) {
            cache.hardenCheckbox.checked = radiatorBindings.harden_cool.selected;
            cache.hardenCheckbox.disabled = !radiatorBindings.harden_cool.enabled;
        }

        // Update stats grid
        const stats = bridge.getRadiatorStats(idx);
        const derived = { flammable: bridge.getRadiatorFlammable(idx) };
        updateMobileStatsGrid(cache.statsGrid, stats, RADIATOR_STATS, derived);
    }

    private rebuildEngines(): void {
        if (!this.enginesContainer) return;

        // Clear existing engine UIs
        this.engineUIs = [];
        this.enginesContainer.innerHTML = '';

        const bindings = this.getBridge().getEnginesBindings();

        // Create a table for all engines
        const enginesTable = document.createElement('table');
        enginesTable.className = 'part_table';
        this.enginesContainer.appendChild(enginesTable);

        // Create header row
        const headerRow = enginesTable.insertRow();
        const headerCell = document.createElement('th');
        headerCell.textContent = localization.translate('Engines Engine Type');
        headerRow.appendChild(headerCell);
        const headerCell2 = document.createElement('th');
        headerCell2.textContent = localization.translate('Engines Options');
        headerRow.appendChild(headerCell2);
        const headerCell3 = document.createElement('th');
        headerCell3.textContent = localization.translate('Engines Options 2');
        headerRow.appendChild(headerCell3);
        const headerCell4 = document.createElement('th');
        headerCell4.textContent = localization.translate('Engines Engine Stats');
        headerRow.appendChild(headerCell4);

        // Create each engine
        for (let i = 0; i < bindings.engines.value; i++) {
            const engineRow = enginesTable.insertRow();
            const engineUI = new EngineUI(this.getBridge, i, engineRow, this.onUpdate);
            this.engineUIs.push(engineUI);
        }
    }

    private rebuildRadiators(): void {
        if (!this.radiatorsContainer) return;

        const bindings = this.getBridge().getEnginesBindings();
        const newCount = bindings.radiators.value;
        const oldCount = this.radiatorUIs.length;

        if (newCount === 0) {
            // Remove everything
            this.radiatorUIs = [];
            this.radiatorsContainer.innerHTML = '';
            this.radiatorsTable = undefined;
            return;
        }

        // Create table with headers if it doesn't exist yet
        if (!this.radiatorsTable) {
            const radiatorsTable = document.createElement('table');
            radiatorsTable.className = 'part_table';
            this.radiatorsContainer.appendChild(radiatorsTable);

            const headerRow = radiatorsTable.insertRow();
            const headerCell = document.createElement('th');
            headerCell.textContent = localization.translate('Radiators Radiator Type');
            headerRow.appendChild(headerCell);
            const headerCell2 = document.createElement('th');
            headerCell2.textContent = localization.translate('Radiators Mounting');
            headerRow.appendChild(headerCell2);
            const headerCell3 = document.createElement('th');
            headerCell3.textContent = localization.translate('Radiators Coolant');
            headerRow.appendChild(headerCell3);
            const headerCell4 = document.createElement('th');
            headerCell4.textContent = localization.translate('Radiators Radiator Stats');
            headerRow.appendChild(headerCell4);

            this.radiatorsTable = radiatorsTable;
        }

        // Remove excess radiator rows if count decreased
        while (this.radiatorUIs.length > newCount) {
            this.radiatorUIs.pop();
            this.radiatorsTable.deleteRow(this.radiatorsTable.rows.length - 1);
        }

        // Add new radiator rows if count increased
        while (this.radiatorUIs.length < newCount) {
            const radiatorRow = this.radiatorsTable.insertRow();
            const radiatorUI = new RadiatorUI(this.getBridge, this.radiatorUIs.length, radiatorRow, this.onUpdate);
            this.radiatorUIs.push(radiatorUI);
        }

        // Update all remaining radiator UIs so blink animations fire
        this.radiatorUIs.forEach(radiatorUI => radiatorUI.update());
    }
}

// Cache interface for type safety
interface EngineCache {
    listSelect: HTMLSelectElement;
    engineSelect: HTMLSelectElement;
    rarityLabel: HTMLSpanElement;
    statLabels: HTMLSpanElement[];

    // Cooling section (conditional elements based on engine type)
    coolingCell: HTMLTableCellElement;

    // Mounting section
    mountSelect?: HTMLSelectElement;
    pushPullCheckbox?: HTMLInputElement;
    torqueCheckbox?: HTMLInputElement;

    // Upgrades section
    driveshaftCheckbox?: HTMLInputElement;
    outboardCheckbox?: HTMLInputElement;
    gearCountInput?: HTMLInputElement;
    gearReliabilityInput?: HTMLInputElement;

    // Cowl & Electrical section
    cowlSelect?: HTMLSelectElement;
    alternatorCheckbox?: HTMLInputElement;
    generatorCheckbox?: HTMLInputElement;

    // Stats display table
    statsTable?: HTMLTableElement;
}

/**
 * Individual Engine UI
 * Handles UI for a single engine
 */
class EngineUI {
    private getBridge: () => AircraftBridge;
    private index: number;
    private row: HTMLTableRowElement;
    private cache: EngineCache;
    private onUpdate: () => void;

    constructor(getBridge: () => AircraftBridge, index: number, row: HTMLTableRowElement, onUpdateFunc?: () => void) {
        this.getBridge = getBridge;
        this.index = index;
        this.row = row;
        this.buildUI();
        this.onUpdate = onUpdateFunc;
    }

    private buildUI(): void {
        const bridge = this.getBridge();
        if (!bridge) return;

        // First cell: Engine Type Selection and Stats Display
        const typeCell = this.row.insertCell();


        // Engine list selection
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(this.index);
        const listSelect = createSelectElement(
            {
                name: localization.translate('Engine List'),
                options: allLists.map((o) => { return { name: o, enabled: true } }),
                selected: allLists.indexOf(selectedList),
                enabled: true
            },
            (selected) => {
                bridge.setEngineSelectedList(this.index, listSelect.options[selected].text);
                this.onUpdate();
            });
        typeCell.appendChild(listSelect);
        typeCell.appendChild(document.createElement('br'));

        // Engine selection within list

        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngineName = bridge.getEngineSelectedName(this.index);
        const engineSelect = createSelectElement(
            {
                name: localization.translate('Engine Type'),
                options: enginesInList.map((o) => { return { name: o, enabled: true } }),
                selected: enginesInList.indexOf(selectedEngineName),
                enabled: true
            },
            () => {
                bridge.setEngineSelectedIndex(this.index, engineSelect.selectedIndex);
                this.onUpdate();
            });
        typeCell.appendChild(engineSelect);
        typeCell.appendChild(document.createElement('br'));

        // Get full engine stats (includes rarity, overspeed, altitude, torque, rumble)
        const fullStats = bridge.getEngineFullStats(this.index);
        const flex = createFlexSection();
        // Display rarity with coloring
        const rarityLabel = createFlexLabel({ name: localization.translate('Rarity'), value: this.getRarityText(fullStats.rarity) },
            flex);
        rarityLabel.className = this.getRarityClass(fullStats.rarity);
        const PowerLabel = createFlexLabel({ name: localization.translate('Stat Power'), value: fullStats.stats.power }, flex);
        const MassLabel = createFlexLabel({ name: localization.translate('Stat Mass'), value: fullStats.stats.mass }, flex);
        const DragLabel = createFlexLabel({ name: localization.translate('Stat Drag'), value: fullStats.stats.drag }, flex);
        const ReliabilityLabel = createFlexLabel({ name: localization.translate('Stat Reliability'), value: fullStats.stats.reliability }, flex);
        const CoolingLabel = createFlexLabel({ name: localization.translate('Stat Cooling'), value: fullStats.stats.cooling }, flex);
        const OverspeedLabel = createFlexLabel({ name: localization.translate('Stat Overspeed'), value: fullStats.overspeed }, flex);
        const FuelLabel = createFlexLabel({ name: localization.translate('Stat Fuel Consumption'), value: fullStats.stats.fuelconsumption }, flex);
        const AltitudeLabel = createFlexLabel({ name: localization.translate('Stat Altitude'), value: fullStats.altitude }, flex);
        const TorqueLabel = createFlexLabel({ name: localization.translate('Stat Torque'), value: fullStats.torque }, flex);
        const RumbleLabel = createFlexLabel({ name: localization.translate('Stat Rumble'), value: fullStats.rumble }, flex);
        const CostLabel = createFlexLabel({ name: localization.translate('Stat Cost'), value: fullStats.stats.cost }, flex);
        typeCell.appendChild(flex.div0);

        // Second cell: Options (Cooling, Mounting, Upgrades)
        const optionsCell = this.row.insertCell();
        optionsCell.className = 'inner_table';

        const optionsTable = document.createElement('table');
        optionsTable.className = 'inner_table';
        optionsCell.appendChild(optionsTable);

        // Get engine bindings
        const bindings = bridge.getEngineBindings(this.index);

        // Cooling Section Header
        const coolingHeaderRow = optionsTable.insertRow();
        const coolingHeader = document.createElement('th');
        coolingHeader.textContent = localization.translate('Engine Cooling');
        coolingHeaderRow.appendChild(coolingHeader);

        // Cooling Section Content
        const coolingRow = optionsTable.insertRow();
        const coolingCell = coolingRow.insertCell();
        const coolingElements = this.buildCoolingSection(coolingCell, bindings, fullStats);

        // Mounting Section Header
        const mountingHeaderRow = optionsTable.insertRow();
        const mountingHeader = document.createElement('th');
        mountingHeader.textContent = localization.translate('Engine Mounting');
        mountingHeaderRow.appendChild(mountingHeader);

        // Mounting Section Content
        const mountingRow = optionsTable.insertRow();
        const mountingCell = mountingRow.insertCell();
        const mountingElements = this.buildMountingSection(mountingCell, bindings);

        // Upgrades Section Header
        const upgradesHeaderRow = optionsTable.insertRow();
        const upgradesHeader = document.createElement('th');
        upgradesHeader.textContent = localization.translate('Engine Upgrades');
        upgradesHeaderRow.appendChild(upgradesHeader);

        // Upgrades Section Content
        const upgradesRow = optionsTable.insertRow();
        const upgradesCell = upgradesRow.insertCell();
        const upgradesElements = this.buildUpgradesSection(upgradesCell, bindings);

        // Third cell: Cowl & Electrical
        const cowlElectricalCell = this.row.insertCell();
        cowlElectricalCell.className = 'inner_table';

        const cowlElectricalTable = document.createElement('table');
        cowlElectricalTable.className = 'inner_table';
        cowlElectricalCell.appendChild(cowlElectricalTable);

        // Cowl Section Header
        const cowlHeaderRow = cowlElectricalTable.insertRow();
        const cowlHeader = document.createElement('th');
        cowlHeader.textContent = localization.translate('Engine Cowls');
        cowlHeaderRow.appendChild(cowlHeader);

        // Cowl Section Content
        const cowlRow = cowlElectricalTable.insertRow();
        const cowlCell = cowlRow.insertCell();
        const cowlElements = this.buildCowlSection(cowlCell, bindings);

        // Electrical Section Header
        const electricalHeaderRow = cowlElectricalTable.insertRow();
        const electricalHeader = document.createElement('th');
        electricalHeader.textContent = localization.translate('Engine Electrical');
        electricalHeaderRow.appendChild(electricalHeader);

        // Electrical Section Content
        const electricalRow = cowlElectricalTable.insertRow();
        const electricalCell = electricalRow.insertCell();
        const electricalElements = this.buildElectricalSection(electricalCell, bindings);

        // Fourth cell: Stats Display Table
        const statsTableCell = this.row.insertCell();
        statsTableCell.className = 'inner_table';
        const statsTable = this.buildStatsTable(statsTableCell, bindings);

        this.cache = {
            listSelect,
            engineSelect,
            rarityLabel,
            statLabels: [PowerLabel, MassLabel, DragLabel,
                ReliabilityLabel, CoolingLabel, OverspeedLabel,
                FuelLabel, AltitudeLabel, TorqueLabel,
                RumbleLabel, CostLabel],
            coolingCell,
            ...mountingElements,
            ...upgradesElements,
            ...cowlElements,
            ...electricalElements,
            statsTable
        }
    }

    private buildCoolingSection(cell: HTMLTableCellElement, bindings: any, fullStats: any): {} {
        const bridge = this.getBridge();

        // Check engine type to determine cooling display
        const cooling = fullStats.stats.cooling || 0;

        if (fullStats.oiltank) {
            // Rotary engine
            const span = document.createElement('span');
            span.style = "white-space: pre-line";
            span.textContent = localization.translate('Engine Rotary Cooling');
            cell.appendChild(span);
        } else if (cooling === 0) {
            // Air-cooled engine
            const span = document.createElement('span');
            span.textContent = localization.translate('Engine Air-Cooled Engine.');
            cell.appendChild(span);

            // Add intake fan checkbox (for turbines)
            const flexContainer = createFlexSection();
            const intakeFanCheckbox = createFlexCheckbox(
                bindings.intake_fan,
                flexContainer,
                (checked) => {
                    const updatedBindings = bridge.getEngineBindings(this.index);
                    updatedBindings.intake_fan.selected = checked;
                    bridge.setEngineBindings(this.index, updatedBindings);
                    this.onUpdate();
                }
            );
            cell.appendChild(flexContainer.div0);
        } else {
            // Liquid-cooled engine - show radiator select and cooling count
            const flexContainer = createFlexSection();

            // Radiator select dropdown
            const radiatorSelect = createFlexSelect(
                {
                    name: localization.translate("Engine Select Radiator"),
                    selected: bindings.radiator_index?.value || 0,
                    enabled: true,
                    options: Array.from({ length: bridge.getNumberOfRadiators() }, (e, i) => {
                        return {
                            name: localization.translateWithParam("Vital Part Radiator", i + 1),
                            enabled: true
                        }
                    })
                },
                flexContainer,
                (selectedIndex) => {
                    const updatedBindings = bridge.getEngineBindings(this.index);
                    updatedBindings.radiator_index.value = selectedIndex;
                    bridge.setEngineBindings(this.index, updatedBindings);
                    this.onUpdate();
                }
            );

            // Cooling count input
            const coolingInput = createFlexNumberInput(
                bindings.cooling_count,
                flexContainer,
                (value) => {
                    const updatedBindings = bridge.getEngineBindings(this.index);
                    updatedBindings.cooling_count.value = value;
                    bridge.setEngineBindings(this.index, updatedBindings);
                    this.onUpdate();
                }
            );

            cell.appendChild(flexContainer.div0);
        }

        // Return empty object since we rebuild cooling section on update
        return {};
    }

    private buildMountingSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();

        // Mounting location select
        const mountLabel = document.createElement('span');
        mountLabel.textContent = localization.translate('Engine Mounting Location');
        cell.appendChild(mountLabel);
        cell.appendChild(document.createElement('br'));

        const mountSelect = createSelectElement(
            bindings.mount_sel,
            () => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.mount_sel.selected = mountSelect.selectedIndex;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );
        cell.appendChild(mountSelect);
        cell.appendChild(document.createElement('br'));

        // Push-pull and torque-to-struct checkboxes
        const flexContainer = createFlexSection();

        const pushPullCheckbox = createFlexCheckbox(
            bindings.is_push_pull,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.is_push_pull.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        const torqueCheckbox = createFlexCheckbox(
            bindings.torque_to_struct,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.torque_to_struct.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        cell.appendChild(flexContainer.div0);

        return {
            mountSelect,
            pushPullCheckbox,
            torqueCheckbox
        };
    }

    private buildUpgradesSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();
        const flexContainer = createFlexSection();

        // Extended driveshafts checkbox
        const driveshaftCheckbox = createFlexCheckbox(
            bindings.extended_ds,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.extended_ds.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        // Outboard propeller checkbox
        const outboardCheckbox = createFlexCheckbox(
            bindings.outboard_prop,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.outboard_prop.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        // Geared propeller count input
        const gearCountInput = createFlexNumberInput(
            bindings.gear_count,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.gear_count.value = value;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        // Geared propeller reliability input
        const gearReliabilityInput = createFlexNumberInput(
            bindings.geared_reliability,
            flexContainer,
            (value) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.geared_reliability.value = value;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        cell.appendChild(flexContainer.div0);

        return {
            driveshaftCheckbox,
            outboardCheckbox,
            gearCountInput,
            gearReliabilityInput
        };
    }

    private buildCowlSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();

        // Cowl select dropdown
        const cowlSelect = createSelectElement(
            bindings.cowl_sel,
            () => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.cowl_sel.selected = cowlSelect.selectedIndex;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );
        cell.appendChild(cowlSelect);

        return {
            cowlSelect
        };
    }

    private buildElectricalSection(cell: HTMLTableCellElement, bindings: any) {
        const bridge = this.getBridge();
        const flexContainer = createFlexSection();

        // Alternator checkbox
        const alternatorCheckbox = createFlexCheckbox(
            bindings.has_alternator,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.has_alternator.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        // Generator checkbox
        const generatorCheckbox = createFlexCheckbox(
            bindings.is_generator,
            flexContainer,
            (checked) => {
                const updatedBindings = bridge.getEngineBindings(this.index);
                updatedBindings.is_generator.selected = checked;
                bridge.setEngineBindings(this.index, updatedBindings);
                this.onUpdate();
            }
        );

        cell.appendChild(flexContainer.div0);

        return {
            alternatorCheckbox,
            generatorCheckbox
        };
    }

    private buildStatsTable(cell: HTMLTableCellElement, bindings: any): HTMLTableElement {
        const bridge = this.getBridge();
        const engineStats = bridge.getEngineStats(this.index);
        const derivedStats = bridge.getEngineDerivedStats(this.index);
        const statsTable = createStatsTable(engineStats, ENGINE_STATS, derivedStats);
        cell.appendChild(statsTable);
        return statsTable;
    }

    private getRarityText(rarity: any): string {
        // Rarity enum: CUSTOM = 0, COMMON = 1, RARE = 2, LEGENDARY = 3
        switch (rarity) {
            case 'CUSTOM':
            case 0:
                return localization.translate('Rarity Custom');
            case 'COMMON':
            case 1:
                return localization.translate('Rarity Common');
            case 'RARE':
            case 2:
                return localization.translate('Rarity Rare');
            case 'LEGENDARY':
            case 3:
                return localization.translate('Rarity Legendary');
            default:
                return localization.translate('Rarity Custom');
        }
    }

    private getRarityClass(rarity: any): string {
        // Return CSS class for rarity coloring
        switch (rarity) {
            case 'CUSTOM':
            case 0:
                return 'ER_Custom';
            case 'COMMON':
            case 1:
                return '';
            case 'RARE':
            case 2:
                return 'ER_Rare';
            case 'LEGENDARY':
            case 3:
                return 'ER_Legendary';
            default:
                return 'ER_Custom';
        }
    }

    update(): void {
        const bridge = this.getBridge();
        const bindings = bridge.getEngineBindings(this.index);
        const fullStats = bridge.getEngineFullStats(this.index);

        // Update engine list/type selects
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(this.index);
        const enginesInList = bridge.getEngineNamesInList(selectedList);
        const selectedEngineName = bridge.getEngineSelectedName(this.index);
        updateSelectElement(this.cache.listSelect,
            {
                name: localization.translate('Engine List'),
                options: allLists.map((o) => { return { name: o, enabled: true } }),
                selected: allLists.indexOf(selectedList),
                enabled: true
            });
        updateSelectElement(this.cache.engineSelect,
            {
                name: localization.translate('Engine Type'),
                options: enginesInList.map((o) => { return { name: o, enabled: true } }),
                selected: enginesInList.indexOf(selectedEngineName),
                enabled: true
            });

        // Update rarity and stats
        this.cache.rarityLabel.textContent = this.getRarityText(fullStats.rarity);
        this.cache.rarityLabel.className = this.getRarityClass(fullStats.rarity);
        const stats = [
            fullStats.stats.power,
            fullStats.stats.mass,
            fullStats.stats.drag,
            fullStats.stats.reliability,
            fullStats.stats.cooling,
            fullStats.overspeed,
            fullStats.stats.fuelconsumption,
            fullStats.altitude,
            fullStats.torque,
            fullStats.rumble,
            fullStats.stats.cost,
        ]
        for (let i = 0; i < this.cache.statLabels.length; i++) {
            this.cache.statLabels[i].innerText = stats[i].toString();
        }

        // Rebuild cooling section (conditional content based on engine type)
        this.cache.coolingCell.innerHTML = '';
        this.buildCoolingSection(this.cache.coolingCell, bindings, fullStats);

        // Update mounting section
        if (this.cache.mountSelect) {
            updateSelectElement(this.cache.mountSelect, bindings.mount_sel);
        }
        if (this.cache.pushPullCheckbox) {
            this.cache.pushPullCheckbox.checked = bindings.is_push_pull.selected;
            this.cache.pushPullCheckbox.disabled = !bindings.is_push_pull.enabled;
        }
        if (this.cache.torqueCheckbox) {
            this.cache.torqueCheckbox.checked = bindings.torque_to_struct.selected;
            this.cache.torqueCheckbox.disabled = !bindings.torque_to_struct.enabled;
        }

        // Update upgrades section
        if (this.cache.driveshaftCheckbox) {
            this.cache.driveshaftCheckbox.checked = bindings.extended_ds.selected;
            this.cache.driveshaftCheckbox.disabled = !bindings.extended_ds.enabled;
        }
        if (this.cache.outboardCheckbox) {
            this.cache.outboardCheckbox.checked = bindings.outboard_prop.selected;
            this.cache.outboardCheckbox.disabled = !bindings.outboard_prop.enabled;
        }
        if (this.cache.gearCountInput) {
            this.cache.gearCountInput.value = bindings.gear_count.value.toString();
            this.cache.gearCountInput.disabled = !bindings.gear_count.enabled;
        }
        if (this.cache.gearReliabilityInput) {
            this.cache.gearReliabilityInput.value = bindings.geared_reliability.value.toString();
            this.cache.gearReliabilityInput.disabled = !bindings.geared_reliability.enabled;
        }

        // Update cowl & electrical section
        if (this.cache.cowlSelect) {
            updateSelectElement(this.cache.cowlSelect, bindings.cowl_sel);
        }
        if (this.cache.alternatorCheckbox) {
            this.cache.alternatorCheckbox.checked = bindings.has_alternator.selected;
            this.cache.alternatorCheckbox.disabled = !bindings.has_alternator.enabled;
        }
        if (this.cache.generatorCheckbox) {
            this.cache.generatorCheckbox.checked = bindings.is_generator.selected;
            this.cache.generatorCheckbox.disabled = !bindings.is_generator.enabled;
        }

        // Update stats table
        if (this.cache.statsTable) {
            const engineStats = bridge.getEngineStats(this.index);
            const derivedStats = bridge.getEngineDerivedStats(this.index);
            updateStatsTable(this.cache.statsTable, engineStats, ENGINE_STATS, derivedStats);
        }
    }
}

// Radiator stats configuration for stats table
const RADIATOR_STATS: StatDisplayConfig[] = [
    // Row 1
    { key: 'mass', label: 'Stat Mass', positiveIsGood: false },
    { key: 'cost', label: 'Stat Cost', positiveIsGood: false },
    { key: 'drag', label: 'Stat Drag', positiveIsGood: false },
    // Row 2
    { key: 'reliability', label: 'Stat Reliability', positiveIsGood: true },
    { key: 'latstab', label: 'Stat Lateral Stability', positiveIsGood: true },
    { key: 'flammable', label: 'Derived Is Flammable Question', isDerived: false },
];

// Cache for radiator row elements
interface RadiatorCache {
    typeSelect: HTMLSelectElement;
    mountSelect: HTMLSelectElement;
    coolantCell: HTMLTableCellElement;
    coolantSelect: HTMLSelectElement;
    hardenCheckbox?: HTMLInputElement;
    statsTable: HTMLTableElement;
}

/**
 * Individual Radiator UI
 * Handles UI for a single radiator
 */
class RadiatorUI {
    private getBridge: () => AircraftBridge;
    private index: number;
    private row: HTMLTableRowElement;
    private onUpdate?: () => void;
    private cache: RadiatorCache;

    constructor(getBridge: () => AircraftBridge, index: number, row: HTMLTableRowElement, onUpdateFunc?: () => void) {
        this.getBridge = getBridge;
        this.index = index;
        this.row = row;
        this.onUpdate = onUpdateFunc;
        this.buildUI();
    }

    private buildUI(): void {
        // Create radiator UI
        const bindings = this.getBridge().getRadiatorBindings(this.index);

        // Type select cell
        const typeCell = this.row.insertCell();
        const typeSelect = createSelectElement(bindings.idx_type, (selected) => {
            const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
            updatedBindings.idx_type.selected = selected;
            this.getBridge().setRadiatorBindings(this.index, updatedBindings);
            this.onUpdate();
        });
        typeCell.appendChild(typeSelect);

        // Mount select cell
        const mountCell = this.row.insertCell();
        const mountSelect = createSelectElement(bindings.idx_mount, (selected) => {
            const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
            updatedBindings.idx_mount.selected = selected;
            this.getBridge().setRadiatorBindings(this.index, updatedBindings);
            this.onUpdate();
        });
        mountCell.appendChild(mountSelect);

        // Coolant select cell
        const coolantCell = this.row.insertCell();
        const coolantSelect = createSelectElement(bindings.idx_coolant, (selected) => {
            const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
            updatedBindings.idx_coolant.selected = selected;
            this.getBridge().setRadiatorBindings(this.index, updatedBindings);
            this.onUpdate();
        });
        coolantCell.appendChild(coolantSelect);

        // Harden checkbox (if coolant has it)
        let hardenCheckbox: HTMLInputElement;
        if (bindings.harden_cool) {
            coolantCell.appendChild(document.createElement('br'));
            hardenCheckbox = createFlexCheckbox(bindings.harden_cool, { div1: coolantCell, div2: coolantCell }, (checked) => {
                const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
                if (updatedBindings.harden_cool) {
                    updatedBindings.harden_cool.selected = checked;
                }
                this.getBridge().setRadiatorBindings(this.index, updatedBindings);
                this.onUpdate();
            });
        }

        // Stats cell
        const statCell = this.row.insertCell();
        const stats = this.getBridge().getRadiatorStats(this.index);
        const derived = { flammable: this.getBridge().getRadiatorFlammable(this.index) };
        statCell.className = 'inner_table';
        const statsTable = createStatsTable(stats, RADIATOR_STATS, derived, 6);
        statCell.appendChild(statsTable);

        // Cache elements
        this.cache = {
            typeSelect,
            mountSelect,
            coolantCell,
            coolantSelect,
            hardenCheckbox,
            statsTable
        };
    }

    update(): void {
        const bindings = this.getBridge().getRadiatorBindings(this.index);

        // Update type select
        updateSelectElement(this.cache.typeSelect, bindings.idx_type);

        // Update mount select
        updateSelectElement(this.cache.mountSelect, bindings.idx_mount);

        // Update coolant select
        updateSelectElement(this.cache.coolantSelect, bindings.idx_coolant);

        // Handle harden checkbox - rebuild coolant cell if presence changes
        const hasHardenNow = bindings.harden_cool !== undefined;
        const hadHardenBefore = this.cache.hardenCheckbox !== undefined;

        if (hasHardenNow !== hadHardenBefore) {
            // Need to rebuild coolant cell
            this.cache.coolantCell.innerHTML = '';
            this.cache.coolantCell.appendChild(this.cache.coolantSelect);

            if (hasHardenNow) {
                this.cache.coolantCell.appendChild(document.createElement('br'));
                this.cache.hardenCheckbox = createFlexCheckbox(bindings.harden_cool!, { div1: this.cache.coolantCell, div2: this.cache.coolantCell }, (checked) => {
                    const updatedBindings = this.getBridge().getRadiatorBindings(this.index);
                    if (updatedBindings.harden_cool) {
                        updatedBindings.harden_cool.selected = checked;
                    }
                    this.getBridge().setRadiatorBindings(this.index, updatedBindings);
                    this.onUpdate();
                });
            } else {
                this.cache.hardenCheckbox = undefined;
            }
        } else if (hasHardenNow && this.cache.hardenCheckbox) {
            // Update existing checkbox
            this.cache.hardenCheckbox.checked = bindings.harden_cool!.selected;
            this.cache.hardenCheckbox.disabled = !bindings.harden_cool!.enabled;
        }

        // Update stats table
        const stats = this.getBridge().getRadiatorStats(this.index);
        const derived = { flammable: this.getBridge().getRadiatorFlammable(this.index) };
        updateStatsTable(this.cache.statsTable, stats, RADIATOR_STATS, derived, 6);
    }
}
