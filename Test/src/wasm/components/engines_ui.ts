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

/**
 * Engines UI Component
 * Handles both Engines container and individual Engine/Radiator UI
 */
export class EnginesUI extends BaseComponentUI {
    // Container elements
    private enginesSection: HTMLElement | undefined;
    private asymmetricCheckbox: HTMLInputElement | undefined;
    private numEnginesInput: HTMLInputElement | undefined;
    private numRadiatorsInput: HTMLInputElement | undefined;

    // Individual engine/radiator containers
    private enginesContainer: HTMLDivElement | undefined;
    private radiatorsContainer: HTMLDivElement | undefined;

    // Mobile containers
    private mobileEnginesContainer: HTMLDivElement | undefined;
    private mobileRadiatorsContainer: HTMLDivElement | undefined;

    // Mobile navigation state
    private mobileSelectedEngine: number = 0;
    private mobileSelectedRadiator: number = 0;
    private mobileEngineContent: HTMLDivElement | undefined;
    private mobileEngineNavLabel: HTMLSpanElement | undefined;
    private mobileRadiatorContent: HTMLDivElement | undefined;
    private mobileRadiatorNavLabel: HTMLSpanElement | undefined;

    // Cached engine/radiator UIs (will be cleared when counts change)
    private engineUIs: EngineUI[] = [];
    private radiatorUIs: RadiatorUI[] = [];
    private cachedEngineCount: number = 0;
    private cachedRadiatorCount: number = 0;

    constructor(
        getBridge: () => AircraftBridge | null,
        containerId: string,
        onUpdate?: () => void
    ) {
        super(getBridge, containerId, onUpdate);
    }

    protected shouldUpdate(): boolean {
        const bridge = this.getBridgeIfInitialized();
        if (!bridge) return false;

        const bindings = bridge.getEnginesBindings();
        const engineCountChanged = bindings.engines.value !== this.cachedEngineCount;
        const radiatorCountChanged = bindings.radiators.value !== this.cachedRadiatorCount;

        // If counts changed, need full rebuild
        if (engineCountChanged || radiatorCountChanged) return false;

        // Otherwise, can update if we have cached elements
        return this.enginesSection !== undefined;
    }

    protected clearCache(): void {
        this.enginesSection = undefined;
        this.asymmetricCheckbox = undefined;
        this.numEnginesInput = undefined;
        this.numRadiatorsInput = undefined;
        this.enginesContainer = undefined;
        this.radiatorsContainer = undefined;
        this.mobileEnginesContainer = undefined;
        this.mobileRadiatorsContainer = undefined;
        this.mobileEngineContent = undefined;
        this.mobileEngineNavLabel = undefined;
        this.mobileRadiatorContent = undefined;
        this.mobileRadiatorNavLabel = undefined;
        this.mobileSelectedEngine = 0;
        this.mobileSelectedRadiator = 0;
        this.engineUIs = [];
        this.radiatorUIs = [];
        this.cachedEngineCount = 0;
        this.cachedRadiatorCount = 0;
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
            localization.translate('Engines Settings'),
            mobileDiv
        );

        // Number of engines
        createMobileNumberInput(
            bindings.engines,
            controlsItem.content,
            (value) => {
                const bindings = bridge.getEnginesBindings();
                bindings.engines.value = value;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            },
            0, 20, 1
        );

        // Number of radiators
        createMobileNumberInput(
            bindings.radiators,
            controlsItem.content,
            (value) => {
                const bindings = bridge.getEnginesBindings();
                bindings.radiators.value = value;
                bridge.setEnginesBindings(bindings);
                this.onUpdate();
            },
            0, 20, 1
        );

        // Asymmetric checkbox
        createMobileCheckbox(
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

        // Engine Builder link
        const mobileBuilderDiv = document.createElement('div');
        mobileBuilderDiv.style.marginTop = '10px';
        mobileBuilderDiv.style.textAlign = 'center';
        const mobileBuilderLink = document.createElement('a');
        mobileBuilderLink.href = './engine.html';
        const mobileBuilderText = document.createElement('u');
        mobileBuilderText.textContent = 'Engine Builder';
        mobileBuilderLink.appendChild(mobileBuilderText);
        mobileBuilderDiv.appendChild(mobileBuilderLink);
        mobileDiv.appendChild(mobileBuilderDiv);

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
        engineBuilderSpan.className = 'desktop-only';
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
        }

        // Rebuild radiator UIs if count changed
        if (radiatorCountChanged) {
            this.cachedRadiatorCount = bindings.radiators.value;
            this.rebuildRadiators();
            this.rebuildMobileRadiators();
        } else {
            // Just update existing radiator UIs
            this.radiatorUIs.forEach(radiatorUI => radiatorUI.update());
        }
    }

    private rebuildMobileEngines(): void {
        if (!this.mobileEnginesContainer) return;
        this.mobileEnginesContainer.innerHTML = '';

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
        navDiv.style.display = 'flex';
        navDiv.style.alignItems = 'center';
        navDiv.style.justifyContent = 'space-between';
        navDiv.style.marginBottom = '0.5rem';
        navDiv.style.padding = '0.5rem';
        navDiv.style.backgroundColor = 'var(--card-bg, #f5f5f5)';
        navDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedEngine > 0) {
                this.mobileSelectedEngine--;
                this.updateMobileEngineContent();
            }
        };
        navDiv.appendChild(prevBtn);

        // Engine label
        this.mobileEngineNavLabel = document.createElement('span');
        this.mobileEngineNavLabel.style.fontWeight = 'bold';
        this.mobileEngineNavLabel.textContent = `${localization.translate('Engines Engine')} ${this.mobileSelectedEngine + 1} / ${engineCount}`;
        navDiv.appendChild(this.mobileEngineNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem';
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
        this.mobileEngineContent.innerHTML = '';

        const bridge = this.getBridge();
        const bindings = bridge.getEnginesBindings();
        const engineCount = bindings.engines.value;
        const idx = this.mobileSelectedEngine;

        // Update nav label
        if (this.mobileEngineNavLabel) {
            this.mobileEngineNavLabel.textContent = `${localization.translate('Engines Engine')} ${idx + 1} / ${engineCount}`;
        }

        if (idx >= engineCount) return;

        // Engine Selection section
        const selectionItem = createMobileOptionItem(
            localization.translate('Engines Engine Type'),
            this.mobileEngineContent
        );

        // Engine list selection
        const allLists = bridge.getEngineNamesOfLists();
        const selectedList = bridge.getEngineSelectedList(idx);

        createMobileSelect(
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

        createMobileSelect(
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
        const fullStats = bridge.getEngineFullStats(idx);
        const baseStatsDiv = document.createElement('div');
        baseStatsDiv.style.fontSize = '0.85em';
        baseStatsDiv.style.marginTop = '0.5rem';
        baseStatsDiv.style.padding = '0.5rem';
        baseStatsDiv.style.backgroundColor = 'var(--card-bg, #f0f0f0)';
        baseStatsDiv.style.borderRadius = '4px';

        // Rarity
        const raritySpan = document.createElement('div');
        raritySpan.innerHTML = `<strong>${localization.translate('Rarity')}:</strong> <span class="${this.getRarityClass(fullStats.rarity)}">${this.getRarityText(fullStats.rarity)}</span>`;
        baseStatsDiv.appendChild(raritySpan);

        // Key engine stats in a grid
        const statsGrid = document.createElement('div');
        statsGrid.style.display = 'grid';
        statsGrid.style.gridTemplateColumns = '1fr 1fr';
        statsGrid.style.gap = '0.25rem';
        statsGrid.style.marginTop = '0.25rem';

        const baseStats = [
            { label: localization.translate('Stat Power'), value: fullStats.stats.power },
            { label: localization.translate('Stat Mass'), value: fullStats.stats.mass },
            { label: localization.translate('Stat Drag'), value: fullStats.stats.drag },
            { label: localization.translate('Stat Reliability'), value: fullStats.stats.reliability },
            { label: localization.translate('Stat Cooling'), value: fullStats.stats.cooling },
            { label: localization.translate('Stat Overspeed'), value: fullStats.overspeed },
            { label: localization.translate('Stat Fuel Consumption'), value: fullStats.stats.fuelconsumption },
            { label: localization.translate('Stat Altitude'), value: fullStats.altitude },
            { label: localization.translate('Stat Torque'), value: fullStats.torque },
            { label: localization.translate('Stat Rumble'), value: fullStats.rumble },
            { label: localization.translate('Stat Cost'), value: fullStats.stats.cost },
        ];
        baseStats.forEach(stat => {
            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.justifyContent = 'space-between';
            row.innerHTML = `<span>${stat.label}:</span><span>${stat.value}</span>`;
            statsGrid.appendChild(row);
        });
        baseStatsDiv.appendChild(statsGrid);
        selectionItem.content.appendChild(baseStatsDiv);

        // Get engine bindings for options
        const engineBindings = bridge.getEngineBindings(idx);

        // Cooling section
        const coolingItem = createMobileOptionItem(
            localization.translate('Engine Cooling'),
            this.mobileEngineContent
        );
        this.buildMobileCoolingSection(coolingItem.content, engineBindings, fullStats, idx);

        // Mounting section
        const mountingItem = createMobileOptionItem(
            localization.translate('Engine Mounting'),
            this.mobileEngineContent
        );
        this.buildMobileMountingSection(mountingItem.content, engineBindings, idx);

        // Upgrades section
        const upgradesItem = createMobileOptionItem(
            localization.translate('Engine Upgrades'),
            this.mobileEngineContent
        );
        this.buildMobileUpgradesSection(upgradesItem.content, engineBindings, idx);

        // Cowl & Electrical section
        const cowlItem = createMobileOptionItem(
            localization.translate('Engine Cowls') + ' & ' + localization.translate('Engine Electrical'),
            this.mobileEngineContent
        );
        this.buildMobileCowlElectricalSection(cowlItem.content, engineBindings, idx);

        // Full Stats section
        const statsItem = createMobileOptionItem(
            localization.translate('Engines Engine Stats'),
            this.mobileEngineContent
        );
        const engineStats = bridge.getEngineStats(idx);
        const derivedStats = bridge.getEngineDerivedStats(idx);
        const mobileStatsGrid = createMobileStatsGrid(engineStats, ENGINE_STATS, derivedStats);
        statsItem.content.appendChild(mobileStatsGrid);
    }

    private buildMobileCoolingSection(container: HTMLElement, bindings: any, fullStats: any, idx: number): void {
        const bridge = this.getBridge();
        const cooling = fullStats.stats.cooling || 0;

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
                createMobileCheckbox(
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
                createMobileSelect(
                    {
                        name: localization.translate('Engine Select Radiator'),
                        options: Array.from({ length: radiatorCount }, (_, i) => ({
                            name: localization.translateWithParam('Vital Part Radiator', i + 1),
                            enabled: true
                        })),
                        selected: bindings.radiator_index?.selected || 0,
                        enabled: true
                    },
                    container,
                    (selected) => {
                        const updatedBindings = bridge.getEngineBindings(idx);
                        updatedBindings.radiator_index.selected = selected;
                        bridge.setEngineBindings(idx, updatedBindings);
                        this.onUpdate();
                    }
                );
            }

            // Cooling count
            if (bindings.cooling_count) {
                createMobileNumberInput(
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
            }
        }
    }

    private buildMobileMountingSection(container: HTMLElement, bindings: any, idx: number): void {
        const bridge = this.getBridge();

        // Mounting location
        createMobileSelect(
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
            createMobileCheckbox(
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
            createMobileCheckbox(
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
    }

    private buildMobileUpgradesSection(container: HTMLElement, bindings: any, idx: number): void {
        const bridge = this.getBridge();

        // Extended driveshafts
        if (bindings.extended_ds) {
            createMobileCheckbox(
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
            createMobileCheckbox(
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
            createMobileNumberInput(
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
        }

        // Geared propeller reliability
        if (bindings.geared_reliability) {
            createMobileNumberInput(
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
        }
    }

    private buildMobileCowlElectricalSection(container: HTMLElement, bindings: any, idx: number): void {
        const bridge = this.getBridge();

        // Cowl select
        createMobileSelect(
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
            createMobileCheckbox(
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
            createMobileCheckbox(
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

        if (radiatorCount === 0) return;

        // Ensure selected radiator is within bounds
        if (this.mobileSelectedRadiator >= radiatorCount) {
            this.mobileSelectedRadiator = 0;
        }

        // Create navigation header
        const navDiv = document.createElement('div');
        navDiv.className = 'mobile-nav-header';
        navDiv.style.display = 'flex';
        navDiv.style.alignItems = 'center';
        navDiv.style.justifyContent = 'space-between';
        navDiv.style.marginBottom = '0.5rem';
        navDiv.style.marginTop = '1rem';
        navDiv.style.padding = '0.5rem';
        navDiv.style.backgroundColor = 'var(--card-bg, #f5f5f5)';
        navDiv.style.borderRadius = '4px';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'mobile-number-btn';
        prevBtn.textContent = '◀';
        prevBtn.style.padding = '0.5rem 1rem';
        prevBtn.onclick = () => {
            if (this.mobileSelectedRadiator > 0) {
                this.mobileSelectedRadiator--;
                this.updateMobileRadiatorContent();
            }
        };
        navDiv.appendChild(prevBtn);

        // Radiator label
        this.mobileRadiatorNavLabel = document.createElement('span');
        this.mobileRadiatorNavLabel.style.fontWeight = 'bold';
        this.mobileRadiatorNavLabel.textContent = `${localization.translate('Radiators Radiator')} ${this.mobileSelectedRadiator + 1} / ${radiatorCount}`;
        navDiv.appendChild(this.mobileRadiatorNavLabel);

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'mobile-number-btn';
        nextBtn.textContent = '▶';
        nextBtn.style.padding = '0.5rem 1rem';
        nextBtn.onclick = () => {
            if (this.mobileSelectedRadiator < radiatorCount - 1) {
                this.mobileSelectedRadiator++;
                this.updateMobileRadiatorContent();
            }
        };
        navDiv.appendChild(nextBtn);

        this.mobileRadiatorsContainer.appendChild(navDiv);

        // Content container for the selected radiator
        this.mobileRadiatorContent = document.createElement('div');
        this.mobileRadiatorsContainer.appendChild(this.mobileRadiatorContent);

        // Build content for the currently selected radiator
        this.updateMobileRadiatorContent();
    }

    private updateMobileRadiatorContent(): void {
        if (!this.mobileRadiatorContent) return;
        this.mobileRadiatorContent.innerHTML = '';

        const bridge = this.getBridge();
        const bindings = bridge.getEnginesBindings();
        const radiatorCount = bindings.radiators.value;
        const idx = this.mobileSelectedRadiator;

        // Update nav label
        if (this.mobileRadiatorNavLabel) {
            this.mobileRadiatorNavLabel.textContent = `${localization.translate('Radiators Radiator')} ${idx + 1} / ${radiatorCount}`;
        }

        if (idx >= radiatorCount) return;

        const radiatorBindings = bridge.getRadiatorBindings(idx);

        // Radiator Type section
        const typeItem = createMobileOptionItem(
            localization.translate('Radiators Radiator Type'),
            this.mobileRadiatorContent
        );
        createMobileSelect(
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
        createMobileSelect(
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
        createMobileSelect(
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
        if (radiatorBindings.harden_cool) {
            createMobileCheckbox(
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
        const mobileStatsGrid = createMobileStatsGrid(stats, RADIATOR_STATS, derived);
        statsItem.content.appendChild(mobileStatsGrid);
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

        // Clear existing radiator UIs
        this.radiatorUIs = [];
        this.radiatorsContainer.innerHTML = '';

        const bindings = this.getBridge().getEnginesBindings();

        if (bindings.radiators.value === 0) return;

        // Create a table for all radiators
        const radiatorsTable = document.createElement('table');
        radiatorsTable.className = 'part_table';
        this.radiatorsContainer.appendChild(radiatorsTable);

        // Create header row
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

        // Create each radiator
        for (let i = 0; i < bindings.radiators.value; i++) {
            const radiatorRow = radiatorsTable.insertRow();
            const radiatorUI = new RadiatorUI(this.getBridge, i, radiatorRow, this.onUpdate);
            this.radiatorUIs.push(radiatorUI);
        }
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
                    value: bindings.radiator_index,
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
                    updatedBindings.radiator_index.selected = selectedIndex;
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
        let hardenCheckbox: HTMLInputElement | undefined;
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
