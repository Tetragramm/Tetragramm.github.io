/**
 * Aircraft Bridge - TypeScript wrapper for WASM Aircraft
 *
 * Provides a clean TypeScript API for interacting with the Rust Aircraft implementation
 */

import { localization } from './localization';

// Type definitions for WASM bindings (will match generated types once WASM is built)
export interface SelectOption {
    name: string;
    enabled: boolean;
}

export interface SelectBinding {
    enabled: boolean;
    options: SelectOption[];
    selected: number;
}

export interface EraOptions {
    selected_era: SelectBinding;
}

// Binding types used by UIBindings
export interface CheckBinding {
    name: string;
    enabled: boolean;
    selected: boolean;
}

export interface NumberBinding {
    name: string;
    enabled: boolean;
    value: number;
}

export interface CockpitOptions {
    selected_type: SelectBinding;
    selected_upgrades: CheckBinding[];
    selected_safety: CheckBinding[];
    selected_gunsights: CheckBinding[];
    bombsight: NumberBinding;
}

export interface CockpitsOptions {
    num_cockpits: NumberBinding;
    positions: CockpitOptions[];
}

export interface Stats {
    mass: number;
    drag: number;
    cost: number;
    control: number;
    reqsections: number;
    flightstress: number;
    escape: number;
    visibility: number;
    [key: string]: any; // Allow other stat properties
}

export interface CockpitDerivedStats {
    flight_stress_norm: number;
    flight_stress_cp: number;
    pos_escape: number;
    pos_visibility: number;
}

export interface DerivedStats {
    dry_mp: number;
    wet_mp: number;
    wet_mp_w_bombs: number;
    dp_empty: number;
    dp_full: number;
    dp_w_bombs: number;
    max_speed_empty: number;
    max_speed_full: number;
    max_speed_w_bombs: number;
    stall_speed_empty: number;
    stall_speed_full: number;
    stall_speed_full_w_bombs: number;
    overspeed: number;
    boost_empty: number;
    boost_full: number;
    boost_full_w_bombs: number;
    dropoff: number;
    stability: number;
    handling_empty: number;
    handling_full: number;
    handling_full_w_bombs: number;
    max_strain: number;
    toughness: number;
    structure: number;
    energy_loss: number;
    energy_loss_w_bombs: number;
    turn_bleed: number;
    turn_bleed_w_bombs: number;
    fuel_uses: number;
    control_stress: number;
    rumble_stress: number;
    rate_of_climb_full: number;
    rate_of_climb_empty: number;
    rate_of_climb_w_bombs: number;
}

// Interface for the WASM AircraftWasm class
export interface AircraftWasmAPI {
    getName(): string;
    setName(name: string): void; fueluses
    getEraBindings(): any;
    setEraBindings(bindings: any): void;
    getEraStats(): Stats;
    getPropellerBindings(): any;
    setPropellerBindings(bindings: any): void;
    getPropellerStats(): Stats;
    getPassengersBindings(): any;
    setPassengersBindings(bindings: any): void;
    getPassengersStats(): Stats;
    getFuelBindings(): any;
    setFuelBindings(bindings: any): void;
    getFuelStats(): Stats;
    getAccessoriesBindings(): any;
    setAccessoriesBindings(bindings: any): void;
    getAccessoriesStats(): Stats;
    getCargoBindings(): any;
    setCargoBindings(bindings: any): void;
    getCargoStats(): Stats;
    getControlSurfacesBindings(): any;
    setControlSurfacesBindings(bindings: any): void;
    getControlSurfacesStats(): Stats;
    getLandingGearBindings(): any;
    setLandingGearBindings(bindings: any): void;
    getLandingGearStats(): Stats;
    getMunitionsBindings(): any;
    setMunitionsBindings(bindings: any): void;
    getMunitionsStats(): Stats;
    getBombCount(): number;
    getRocketCount(): number;
    getInternalBombCount(): number;
    getMaxBombSize(): number;
    getOptimizationBindings(): any;
    setOptimizationBindings(bindings: any): void;
    getOptimizationStats(): Stats;
    getOptimizationAvailable(): number;
    getUsedBindings(): any;
    setUsedBindings(bindings: any): void;
    getUsedStats(): Stats;
    getWeaponsBindings(): any;
    setWeaponsBindings(bindings: any): void;
    getWeaponsStats(): Stats;
    getWeaponSetsCount(): number;
    duplicateWeaponSet(index: number): void;
    removeWeaponSet(index: number): void;
    getWeaponSystemBindings(index: number): any;
    setWeaponSystemBindings(index: number, bindings: any): void;
    getWeaponSystemStats(index: number): Stats;
    getWeaponSystemDerivedStats(index: number): any;
    getWeaponSystemDisplayInfo(index: number): string;
    getWeaponBindings(systemIndex: number, weaponIndex: number): any;
    setWeaponBindings(systemIndex: number, weaponIndex: number, bindings: any): void;
    getWeaponStats(systemIndex: number, weaponIndex: number): Stats;
    getReinforcementsBindings(): any;
    setReinforcementsBindings(bindings: any): void;
    getReinforcementsStats(): Stats;
    getStabilizersBindings(): any;
    setStabilizersBindings(bindings: any): void;
    getStabilizersStats(): Stats;
    getFramesFlammable(): boolean;
    getFramesBindings(): any;
    setFramesBindings(bindings: any): void;
    getFramesStats(): Stats;
    duplicateSection(index: number): void;
    deleteSection(index: number): void;
    getWingsBindings(): any;
    setWingsBindings(bindings: any): void;
    getWingsStats(): Stats;
    getCockpitsBindings(): any;
    setCockpitsBindings(bindings: any): void;
    getCockpitStats(index: number): any;
    getCockpitDerivedStats(index: number): any;
    calculateStats(): void;
    getDerivedStats(): DerivedStats;
    getStats(): any;

    // Aircraft query methods
    getUsedIsDefault(): boolean;
    getEraText(): string;
    getIsFlammable(): boolean;
    getGearName(): string;
    getMinAltitude(): number;
    getMaxAltitude(): number;
    getReliabilityList(): string[];
    getEscapeList(): number[];
    getStressList(): Array<[number, number]>;
    getVisibilityList(): number[];
    getAttackList(): number[];
    getCommunicationName(): string;
    getCockpitsCount(): number;
    getPassengersCount(): number;
    getElectrics(): any;
    getWingCount(): number;
    getWingDeck(index: number): number | null;
    getWingsTandem(): boolean;
    getWingsClosed(): boolean;
    getWingsSesquiplane(): { is: boolean; deck: number; super_small: boolean };
    getFramesFlyingWing(): boolean;
    getFramesCanFlyingWing(): boolean;
    vitalComponentList(): string[];

    serialize(): Uint8Array;
    serializeToLZString(): string;

    setNumberOfEngines(count: number): void;
    getNumberOfEngines(): number;

    getEnginesStats(): any;
    getEnginesBindings(): any;
    setEnginesBindings(bindings: any): void;

    getEngineStats(index: number): any;
    getEngineBindings(index: number): any;
    setEngineBindings(index: number, bindings: any): void;

    setNumberOfRadiators(count: number): void;
    getNumberOfRadiators(): number;
    getRadiatorFlammable(index: number): boolean;
    getRadiatorStats(index: number): any;
    getRadiatorBindings(index: number): any;
    setRadiatorBindings(index: number, bindings: any): void;

    // Engine selection methods
    getEngineFullStats(index: number): any;
    getEngineDerivedStats(index: number): any;
    getEngineNamesOfLists(): string[];
    getEngineNamesInList(listName: string): string[];
    getEngineSelectedList(index: number): string;
    getEngineSelectedName(index: number): string;
    setEngineSelectedList(index: number, listName: string): void;
    setEngineSelectedIndex(index: number, engineIndex: number): void;
}

// Interface for initialization function
export type WasmInit = () => Promise<void>;

/**
 * Adds together an arbitrary number of stats objects
 * Verifies that any extra properties are numbers before adding
 *
 * @param stats - Variable number of Stats objects
 * @returns A new Stats object with all properties summed
 * @throws Error if any extra property is not a number
 *
 * @example
 * const total = addStats(stat1, stat2, stat3);
 */
export function addStats(...statsList: Stats[]): Stats {
    if (statsList.length === 0) {
        return {
            mass: 0,
            drag: 0,
            cost: 0,
            control: 0,
            reqsections: 0,
            flightstress: 0,
            escape: 0,
            visibility: 0,
        };
    }

    // Get all unique property keys from all stats objects
    const allKeys = new Set<string>();
    for (const stat of statsList) {
        Object.keys(stat).forEach(key => allKeys.add(key));
    }

    // Sum up all numeric properties
    const result: Stats = {
        mass: 0,
        drag: 0,
        cost: 0,
        control: 0,
        reqsections: 0,
        flightstress: 0,
        escape: 0,
        visibility: 0,
    };

    for (const key of allKeys) {
        let sum = 0;
        let isExtraProperty = !result.hasOwnProperty(key);

        for (const stat of statsList) {
            const value = stat[key];

            // Only sum properties that exist in this object
            if (value !== undefined && value !== null) {
                // Verify extra properties are numbers
                if (isExtraProperty && typeof value !== 'number') {
                    continue;
                }
                if (typeof value === 'number') {
                    sum += value;
                }
            }
        }

        if (typeof result[key] === 'number' || isExtraProperty) {
            (result as any)[key] = sum;
        }
    }

    return result;
}

/**
 * TypeScript bridge to Rust Aircraft WASM
 */
export class AircraftBridge {
    private wasm: AircraftWasmAPI | null = null;
    private initialized: boolean = false;

    /**
     * Initialize the WASM module and create aircraft
     */
    async initialize(wasmInit: WasmInit, AircraftWasmClass: any): Promise<void> {
        // Initialize WASM module
        await wasmInit();

        // Create aircraft instance
        this.wasm = new AircraftWasmClass();
        this.initialized = true;

        console.log('[AircraftBridge] Initialized successfully');
    }

    /**
     * Check if bridge is initialized
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Ensure WASM is initialized, throw if not
     */
    private ensureInitialized(): void {
        if (!this.wasm || !this.initialized) {
            throw new Error('AircraftBridge not initialized. Call initialize() first.');
        }
    }

    /**
     * Get aircraft name
     */
    getName(): string {
        this.ensureInitialized();
        return this.wasm!.getName();
    }

    /**
     * Set aircraft name
     */
    setName(name: string): void {
        this.ensureInitialized();
        this.wasm!.setName(name);
    }

    /**
     * Get Era UI bindings (includes localized strings from Rust)
     */
    getEraBindings(): EraOptions {
        this.ensureInitialized();
        return this.wasm!.getEraBindings();
    }

    /**
     * Update Era from UI bindings
     * Automatically recalculates stats
     */
    setEraBindings(bindings: EraOptions): void {
        this.ensureInitialized();
        this.wasm!.setEraBindings(bindings);
    }

    /**
     * Get stats for the selected era
     */
    getEraStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getEraStats();
    }

    /**
     * Get Propeller UI bindings (includes localized strings from Rust)
     */
    getPropellerBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getPropellerBindings();
    }

    /**
     * Update Propeller from UI bindings
     * Automatically recalculates stats
     */
    setPropellerBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setPropellerBindings(bindings);
    }

    /**
     * Get stats for the selected propeller
     */
    getPropellerStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getPropellerStats();
    }

    /**
     * Get Passengers UI bindings (includes localized strings from Rust)
     */
    getPassengersBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getPassengersBindings();
    }

    /**
     * Update Passengers from UI bindings
     * Automatically recalculates stats
     */
    setPassengersBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setPassengersBindings(bindings);
    }

    /**
     * Get stats for Passengers
     */
    getPassengersStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getPassengersStats();
    }

    /**
     * Get Fuel UI bindings (includes localized strings from Rust)
     */
    getFuelBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getFuelBindings();
    }

    /**
     * Update Fuel from UI bindings
     * Automatically recalculates stats
     */
    setFuelBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setFuelBindings(bindings);
    }

    /**
     * Get stats for Fuel
     */
    getFuelStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getFuelStats();
    }

    /**
     * Get Accessories UI bindings (includes localized strings from Rust)
     */
    getAccessoriesBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getAccessoriesBindings();
    }

    /**
     * Update Accessories from UI bindings
     * Automatically recalculates stats
     */
    setAccessoriesBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setAccessoriesBindings(bindings);
    }

    /**
     * Get stats for Accessories
     */
    getAccessoriesStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getAccessoriesStats();
    }

    /**
     * Get Cargo UI bindings (includes localized strings from Rust)
     */
    getCargoBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getCargoBindings();
    }

    /**
     * Update Cargo from UI bindings
     * Automatically recalculates stats
     */
    setCargoBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setCargoBindings(bindings);
    }

    /**
     * Get stats for Cargo
     */
    getCargoStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getCargoStats();
    }

    /**
     * Get ControlSurfaces UI bindings (includes localized strings from Rust)
     */
    getControlSurfacesBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getControlSurfacesBindings();
    }

    /**
     * Update ControlSurfaces from UI bindings
     * Automatically recalculates stats
     */
    setControlSurfacesBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setControlSurfacesBindings(bindings);
    }

    /**
     * Get stats for ControlSurfaces
     */
    getControlSurfacesStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getControlSurfacesStats();
    }

    /**
     * Get LandingGear UI bindings (includes localized strings from Rust)
     */
    getLandingGearBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getLandingGearBindings();
    }

    /**
     * Update LandingGear from UI bindings
     * Automatically recalculates stats
     */
    setLandingGearBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setLandingGearBindings(bindings);
    }

    /**
     * Get stats for LandingGear
     */
    getLandingGearStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getLandingGearStats();
    }

    /**
     * Get Munitions UI bindings (includes localized strings from Rust)
     */
    getMunitionsBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getMunitionsBindings();
    }

    /**
     * Update Munitions from UI bindings
     * Automatically recalculates stats
     */
    setMunitionsBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setMunitionsBindings(bindings);
    }

    /**
     * Get stats for Munitions
     */
    getMunitionsStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getMunitionsStats();
    }

    /**
     * Get bomb count
     */
    getBombCount(): number {
        this.ensureInitialized();
        return this.wasm!.getBombCount();
    }

    /**
     * Get rocket count
     */
    getRocketCount(): number {
        this.ensureInitialized();
        return this.wasm!.getRocketCount();
    }

    /**
     * Get internal bomb storage count
     */
    getInternalBombCount(): number {
        this.ensureInitialized();
        return this.wasm!.getInternalBombCount();
    }

    /**
     * Get maximum bomb size
     */
    getMaxBombSize(): number {
        this.ensureInitialized();
        return this.wasm!.getMaxBombSize();
    }

    /**
     * Get Optimization UI bindings (includes localized strings from Rust)
     */
    getOptimizationBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getOptimizationBindings();
    }

    /**
     * Update Optimization from UI bindings
     * Automatically recalculates stats
     */
    setOptimizationBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setOptimizationBindings(bindings);
    }

    /**
     * Get stats for Optimization
     */
    getOptimizationStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getOptimizationStats();
    }

    getOptimizationAvailable(): number {
        this.ensureInitialized();
        return this.wasm!.getOptimizationAvailable();
    }

    /**
     * Get Used Part UI bindings (includes localized strings from Rust)
     */
    getUsedBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getUsedBindings();
    }

    /**
     * Update Used Part from UI bindings
     * Automatically recalculates stats
     */
    setUsedBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setUsedBindings(bindings);
    }

    /**
     * Get stats for Used Part
     */
    getUsedStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getUsedStats();
    }

    /**
     * Get Weapons UI bindings (includes localized strings from Rust)
     */
    getWeaponsBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getWeaponsBindings();
    }

    /**
     * Update Weapons from UI bindings
     * Automatically recalculates stats
     */
    setWeaponsBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setWeaponsBindings(bindings);
    }

    /**
     * Get stats for Weapons
     */
    getWeaponsStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getWeaponsStats();
    }

    /**
     * Get number of weapon sets
     */
    getWeaponSetsCount(): number {
        this.ensureInitialized();
        return this.wasm!.getWeaponSetsCount();
    }

    /**
     * Duplicate a weapon set at the given index
     */
    duplicateWeaponSet(index: number): void {
        this.ensureInitialized();
        this.wasm!.duplicateWeaponSet(index);
    }

    /**
     * Remove a weapon set at the given index
     */
    removeWeaponSet(index: number): void {
        this.ensureInitialized();
        this.wasm!.removeWeaponSet(index);
    }

    /**
     * Get WeaponSystem UI bindings for a specific weapon system
     */
    getWeaponSystemBindings(index: number): any {
        this.ensureInitialized();
        return this.wasm!.getWeaponSystemBindings(index);
    }

    /**
     * Update WeaponSystem from UI bindings
     * Automatically recalculates stats
     */
    setWeaponSystemBindings(index: number, bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setWeaponSystemBindings(index, bindings);
    }

    /**
     * Get stats for a specific weapon system
     */
    getWeaponSystemStats(index: number): Stats {
        this.ensureInitialized();
        return this.wasm!.getWeaponSystemStats(index);
    }

    /**
     * Get derived stats for a specific weapon system (hits, damage, jam, etc.)
     */
    getWeaponSystemDerivedStats(index: number): any {
        this.ensureInitialized();
        return this.wasm!.getWeaponSystemDerivedStats(index);
    }

    /**
     * Get display information for a specific weapon system (for derived stats UI)
     */
    getWeaponSystemDisplayInfo(index: number): string {
        this.ensureInitialized();
        return this.wasm!.getWeaponSystemDisplayInfo(index);
    }

    /**
     * Get Weapon UI bindings for a specific weapon in a weapon system
     */
    getWeaponBindings(systemIndex: number, weaponIndex: number): any {
        this.ensureInitialized();
        return this.wasm!.getWeaponBindings(systemIndex, weaponIndex);
    }

    /**
     * Update Weapon from UI bindings
     * Automatically recalculates stats
     */
    setWeaponBindings(systemIndex: number, weaponIndex: number, bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setWeaponBindings(systemIndex, weaponIndex, bindings);
    }

    /**
     * Get stats for a specific weapon
     */
    getWeaponStats(systemIndex: number, weaponIndex: number): Stats {
        this.ensureInitialized();
        return this.wasm!.getWeaponStats(systemIndex, weaponIndex);
    }

    /**
     * Get Reinforcements UI bindings (includes localized strings from Rust)
     */
    getReinforcementsBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getReinforcementsBindings();
    }

    /**
     * Update Reinforcements from UI bindings
     * Automatically recalculates stats
     */
    setReinforcementsBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setReinforcementsBindings(bindings);
    }

    /**
     * Get stats for Reinforcements
     */
    getReinforcementsStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getReinforcementsStats();
    }

    /**
     * Get Stabilizers UI bindings (includes localized strings from Rust)
     */
    getStabilizersBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getStabilizersBindings();
    }

    /**
     * Update Stabilizers from UI bindings
     * Automatically recalculates stats
     */
    setStabilizersBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setStabilizersBindings(bindings);
    }

    /**
     * Get stats for Stabilizers
     */
    getStabilizersStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getStabilizersStats();
    }

    getFramesFlammable(): boolean {
        this.ensureInitialized();
        return this.wasm!.getFramesFlammable();
    }

    /**
     * Get Frames UI bindings (includes localized strings from Rust)
     */
    getFramesBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getFramesBindings();
    }

    /**
     * Update Frames from UI bindings
     * Automatically recalculates stats
     */
    setFramesBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setFramesBindings(bindings);
    }

    /**
     * Get stats for Frames
     */
    getFramesStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getFramesStats();
    }

    /**
     * Duplicate a cockpit section at the given index
     */
    duplicateSection(index: number): void {
        this.ensureInitialized();
        this.wasm!.duplicateSection(index);
    }

    /**
     * Delete a cockpit section at the given index
     */
    deleteSection(index: number): void {
        this.ensureInitialized();
        this.wasm!.deleteSection(index);
    }

    /**
     * Get Wings UI bindings (includes localized strings from Rust)
     */
    getWingsBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getWingsBindings();
    }

    /**
     * Update Wings from UI bindings
     * Automatically recalculates stats
     */
    setWingsBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setWingsBindings(bindings);
    }

    /**
     * Get stats for Wings
     */
    getWingsStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getWingsStats();
    }

    /**
     * Get Engines UI bindings (includes localized strings from Rust)
     */
    getEnginesBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getEnginesBindings();
    }

    /**
     * Update Engines from UI bindings
     * Automatically recalculates stats
     */
    setEnginesBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setEnginesBindings(bindings);
    }

    /**
     * Get stats for Engines container
     */
    getEnginesStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getEnginesStats();
    }

    /**
     * Get UI bindings for a specific engine
     */
    getEngineBindings(index: number): any {
        this.ensureInitialized();
        return this.wasm!.getEngineBindings(index);
    }

    /**
     * Update a specific engine from UI bindings
     * Automatically recalculates stats
     */
    setEngineBindings(index: number, bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setEngineBindings(index, bindings);
    }

    /**
     * Get stats for a specific engine
     */
    getEngineStats(index: number): Stats {
        this.ensureInitialized();
        return this.wasm!.getEngineStats(index);
    }

    /**
     * Get derived stats for a specific engine (calculated values like reliability)
     */
    getEngineDerivedStats(index: number): any {
        this.ensureInitialized();
        return this.wasm!.getEngineDerivedStats(index);
    }

    /**
     * Get UI bindings for a specific radiator
     */
    getRadiatorBindings(index: number): any {
        this.ensureInitialized();
        return this.wasm!.getRadiatorBindings(index);
    }

    /**
     * Update a specific radiator from UI bindings
     * Automatically recalculates stats
     */
    setRadiatorBindings(index: number, bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setRadiatorBindings(index, bindings);
    }

    /**
     * Get stats for a specific radiator
     */
    getRadiatorStats(index: number): Stats {
        this.ensureInitialized();
        return this.wasm!.getRadiatorStats(index);
    }

    /**
     * Set the number of engines
     * Automatically recalculates stats
     */
    setNumberOfEngines(num: number): void {
        this.ensureInitialized();
        this.wasm!.setNumberOfEngines(num);
    }

    /**
     * Get the number of engines
     */
    getNumberOfEngines(): number {
        this.ensureInitialized();
        return this.wasm!.getNumberOfEngines();
    }

    /**
     * Set the number of radiators
     * Automatically recalculates stats
     */
    setNumberOfRadiators(num: number): void {
        this.ensureInitialized();
        this.wasm!.setNumberOfRadiators(num);
    }

    /**
     * Get the number of radiators
     */
    getNumberOfRadiators(): number {
        this.ensureInitialized();
        return this.wasm!.getNumberOfRadiators();
    }

    /**
     * Get the radiator flammability
     */
    getRadiatorFlammable(index: number): boolean {
        this.ensureInitialized();
        return this.wasm!.getRadiatorFlammable(index);
    }

    /**
     * Get full EngineStats for a specific engine (includes rarity, overspeed, altitude, torque, rumble)
     */
    getEngineFullStats(index: number): any {
        this.ensureInitialized();
        return this.wasm!.getEngineFullStats(index);
    }

    /**
     * Get all available engine list names (static method, doesn't need bridge initialized)
     */
    getEngineNamesOfLists(): string[] {
        this.ensureInitialized();
        return this.wasm!.getEngineNamesOfLists();
    }

    /**
     * Get all engine names in a specific list (static method)
     */
    getEngineNamesInList(listName: string): string[] {
        this.ensureInitialized();
        return this.wasm!.getEngineNamesInList(listName);
    }

    /**
     * Get the selected engine list name for a specific engine
     */
    getEngineSelectedList(index: number): string {
        this.ensureInitialized();
        return this.wasm!.getEngineSelectedList(index);
    }

    /**
     * Get the selected engine name for a specific engine
     */
    getEngineSelectedName(index: number): string {
        this.ensureInitialized();
        return this.wasm!.getEngineSelectedName(index);
    }

    /**
     * Set the selected engine list for a specific engine
     * Automatically selects the first engine in the new list
     * Recalculates stats
     */
    setEngineSelectedList(index: number, listName: string): void {
        this.ensureInitialized();
        this.wasm!.setEngineSelectedList(index, listName);
    }

    /**
     * Set the selected engine by index within its current list
     * Recalculates stats
     */
    setEngineSelectedIndex(index: number, engineIndex: number): void {
        this.ensureInitialized();
        this.wasm!.setEngineSelectedIndex(index, engineIndex);
    }

    /**
     * Get Cockpits UI bindings (includes localized strings from Rust)
     */
    getCockpitsBindings(): CockpitsOptions {
        this.ensureInitialized();
        return this.wasm!.getCockpitsBindings();
    }

    /**
     * Update Cockpits from UI bindings
     * Automatically recalculates stats
     */
    setCockpitsBindings(bindings: CockpitsOptions): void {
        this.ensureInitialized();
        this.wasm!.setCockpitsBindings(bindings);
    }

    /**
     * Get stats for a specific cockpit
     */
    getCockpitStats(index: number): Stats {
        this.ensureInitialized();
        return this.wasm!.getCockpitStats(index);
    }

    /**
     * Get derived stats for a specific cockpit (flight stress, escape, visibility)
     */
    getCockpitDerivedStats(index: number): CockpitDerivedStats {
        this.ensureInitialized();
        return this.wasm!.getCockpitDerivedStats(index);
    }

    /**
     * Get derived stats (performance characteristics)
     */
    getDerivedStats(): DerivedStats {
        this.ensureInitialized();
        return this.wasm!.getDerivedStats();
    }

    /**
     * Get base stats
     */
    getStats(): any {
        this.ensureInitialized();
        return this.wasm!.getStats();
    }

    /**
     * Check if used modifiers are at default (no damage/wear)
     */
    getUsedIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getUsedIsDefault();
    }

    /**
     * Get the name of the currently selected era
     */
    getEraText(): string {
        this.ensureInitialized();
        return this.wasm!.getEraText();
    }

    /**
     * Check if aircraft has flammable components
     */
    getIsFlammable(): boolean {
        this.ensureInitialized();
        return this.wasm!.getIsFlammable();
    }

    /**
     * Get landing gear type name
     */
    getGearName(): string {
        this.ensureInitialized();
        return this.wasm!.getGearName();
    }

    /**
     * Get minimum operational altitude
     */
    getMinAltitude(): number {
        this.ensureInitialized();
        return this.wasm!.getMinAltitude();
    }

    /**
     * Get maximum operational altitude
     */
    getMaxAltitude(): number {
        this.ensureInitialized();
        return this.wasm!.getMaxAltitude();
    }

    /**
     * Get reliability strings from all engines
     */
    getReliabilityList(): string[] {
        this.ensureInitialized();
        return this.wasm!.getReliabilityList();
    }

    /**
     * Get escape values from all cockpit positions
     */
    getEscapeList(): number[] {
        this.ensureInitialized();
        return this.wasm!.getEscapeList();
    }

    /**
     * Get flight stress values from all cockpit positions
     * Returns array of [non_copilot_stress, copilot_stress] tuples
     */
    getStressList(): Array<[number, number]> {
        this.ensureInitialized();
        return this.wasm!.getStressList();
    }

    /**
     * Get visibility values from all cockpit positions
     */
    getVisibilityList(): number[] {
        this.ensureInitialized();
        return this.wasm!.getVisibilityList();
    }

    /**
     * Get attack modifier values from all cockpit positions
     */
    getAttackList(): number[] {
        this.ensureInitialized();
        return this.wasm!.getAttackList();
    }

    /**
     * Get communication system name
     */
    getCommunicationName(): string {
        this.ensureInitialized();
        return this.wasm!.getCommunicationName();
    }

    /**
     * Get number of cockpit positions
     */
    getCockpitsCount(): number {
        this.ensureInitialized();
        return this.wasm!.getCockpitsCount();
    }

    /**
     * Get total passenger capacity (seats + beds)
     */
    getPassengersCount(): number {
        this.ensureInitialized();
        return this.wasm!.getPassengersCount();
    }

    /**
     * Get electrical systems data
     */
    getElectrics(): any {
        this.ensureInitialized();
        return this.wasm!.getElectrics();
    }

    /**
     * Get number of wings
     */
    getWingCount(): number {
        this.ensureInitialized();
        return this.wasm!.getWingCount();
    }

    /**
     * Get wing deck at index
     */
    getWingDeck(index: number): number | null {
        this.ensureInitialized();
        const deck = this.wasm!.getWingDeck(index);
        return deck !== undefined ? deck : null;
    }

    /**
     * Check if wings are in tandem configuration
     */
    getWingsTandem(): boolean {
        this.ensureInitialized();
        return this.wasm!.getWingsTandem();
    }

    /**
     * Check if wings are closed
     */
    getWingsClosed(): boolean {
        this.ensureInitialized();
        return this.wasm!.getWingsClosed();
    }

    /**
     * Get sesquiplane info
     */
    getWingsSesquiplane(): { is: boolean; deck: number; super_small: boolean } {
        this.ensureInitialized();
        return this.wasm!.getWingsSesquiplane();
    }

    /**
     * Check if frames are flying wing
     */
    getFramesFlyingWing(): boolean {
        this.ensureInitialized();
        return this.wasm!.getFramesFlyingWing();
    }

    /**
     * Check if frames can be flying wing (lifting body)
     */
    getFramesCanFlyingWing(): boolean {
        this.ensureInitialized();
        return this.wasm!.getFramesCanFlyingWing();
    }

    /**
     * Get list of vital component names
     */
    vitalComponentList(): string[] {
        this.ensureInitialized();
        return this.wasm!.vitalComponentList();
    }

    /**
     * Calculate all aircraft statistics
     */
    calculateStats(): void {
        this.ensureInitialized();
        this.wasm!.calculateStats();
    }

    /**
     * Serialize aircraft to bytes
     */
    serialize(): Uint8Array {
        this.ensureInitialized();
        return this.wasm!.serialize();
    }

    /**
     * Serialize to LZ-compressed string (for URLs)
     */
    serializeToLZString(): string {
        this.ensureInitialized();
        return this.wasm!.serializeToLZString();
    }

    /**
     * Deserialize from bytes (static method)
     */
    static async deserialize(
        data: Uint8Array,
        wasmInit: WasmInit,
        AircraftWasmClass: any
    ): Promise<AircraftBridge> {
        await wasmInit();
        const bridge = new AircraftBridge();
        bridge.wasm = AircraftWasmClass.deserialize(data);
        bridge.initialized = true;
        bridge.calculateStats();
        return bridge;
    }

    /**
     * Deserialize from LZ-compressed string (static method)
     */
    static async deserializeFromLZString(
        lzStr: string,
        wasmInit: WasmInit,
        AircraftWasmClass: any
    ): Promise<AircraftBridge> {
        await wasmInit();
        const bridge = new AircraftBridge();
        bridge.wasm = AircraftWasmClass.deserializeFromLZString(lzStr);
        bridge.initialized = true;
        bridge.calculateStats();
        return bridge;
    }
}
