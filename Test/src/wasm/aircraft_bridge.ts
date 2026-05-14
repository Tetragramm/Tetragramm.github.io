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

export interface RotorOptions {
    aircraft_type: number;
    sizing_span: NumberBinding;
    rotor_span: NumberBinding;
    cantilever: SelectBinding;
    accessory: CheckBinding;
    rotor_area: number;
    // Helicopter-only
    rotor_count: NumberBinding;
    stagger: SelectBinding;
    blade_count: SelectBinding;
    rotor_thickness: NumberBinding;
    can_rotor_count: boolean;
    can_tandem: boolean;
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

// Mirrors the Rust AircraftType enum in flyingcircusrust/src/types.rs.
// Returned by AircraftBridge.getAircraftType() / accepted by setAircraftType().
export enum AircraftType {
    Airplane = 0,
    Helicopter = 1,
    Autogyro = 2,
    OrnithopterBasic = 3,
    OrnithopterFlutter = 4,
    OrnithopterBuzzer = 5,
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
    getControlSurfacesFlapCost(dryMp: number): number;
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
    getWeaponSystemDisplayInfo(index: number): any;
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
    getRotorBindings(): any;
    setRotorBindings(bindings: any): void;
    getRotorStats(): Stats;
    getAircraftType(): number;
    setAircraftType(type: number): void;
    getAircraftTypeNames(): string[];
    getCockpitsBindings(): any;
    setCockpitsBindings(bindings: any): void;
    getCockpitStats(index: number): any;
    getCockpitDerivedStats(index: number): any;
    calculateStats(): void;
    getDerivedStats(): DerivedStats;
    getStats(): any;
    calculateEngineStats(engineData: any): any;
    reset();
    fromJSON(jsonStr: string);

    // Aircraft query methods
    getUsedIsDefault(): boolean;
    getControlSurfacesIsDefault(): boolean;
    getLandingGearIsDefault(): boolean;
    getOptimizationIsDefault(): boolean;
    getStabilizersIsDefault(): boolean;
    getAlterIsDefault(): boolean;
    getPassengersIsDefault(): boolean;
    getEraText(): string;
    getIsFlammable(): boolean;
    getGearName(): string;
    getMinAltitude(): number;
    getMaxAltitude(): number;
    getReliabilityList(): string[];
    getEscapeList(): number[];
    getCrashList(): number[];
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

    // Custom Parts (Alter) methods
    getCustomParts(): any[];
    addCustomPart(name: string, stats: any): void;
    removeCustomPart(name: string): void;
    setCustomPartQty(index: number, qty: number): void;
    isCustomPartsDefault(): boolean;
    getCustomPartsStats(): Stats;

    serialize(): Uint8Array;
    serializeToLZString(): string;
    serializeHeliToLZString(): string;
    toJSON(): string;

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

    // Engine list management methods
    addEngineToList(listName: string, engineData: any): void;
    getEnginesInList(listName: string): any[];
    clearEngineList(listName: string): void;
}

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
    private autoSaveToLocalStorage: boolean = true;
    private storageKey: string = 'test.aircraft';

    /** Override the localStorage key used for auto-save and manual save. */
    setStorageKey(key: string): void {
        this.storageKey = key;
    }

    /**
     * Create a fresh aircraft instance. Caller is responsible for having loaded
     * the WASM module first (see WasmApplication.loadWasmModule).
     */
    initialize(AircraftWasmClass: any): void {
        this.wasm = new AircraftWasmClass();
        this.initialized = true;
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
     * Get flap cost based on dry MP (for display purposes)
     */
    getControlSurfacesFlapCost(dryMp: number): number {
        this.ensureInitialized();
        return this.wasm!.getControlSurfacesFlapCost(dryMp);
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
     * Get Rotor UI bindings (includes localized strings from Rust)
     */
    getRotorBindings(): any {
        this.ensureInitialized();
        return this.wasm!.getRotorBindings();
    }

    /**
     * Update Rotor from UI bindings
     * Automatically recalculates stats
     */
    setRotorBindings(bindings: any): void {
        this.ensureInitialized();
        this.wasm!.setRotorBindings(bindings);
    }

    /**
     * Get stats for Rotor
     */
    getRotorStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getRotorStats();
    }

    /**
     * Get current aircraft type (0=Airplane, 1=Helicopter, 2=Autogyro, 3-5=Ornithopters)
     */
    getAircraftType(): number {
        this.ensureInitialized();
        return this.wasm!.getAircraftType();
    }

    /**
     * Set aircraft type
     * Automatically recalculates stats
     */
    setAircraftType(type: number): void {
        this.ensureInitialized();
        this.wasm!.setAircraftType(type);
    }

    /**
     * Get localized aircraft type names for UI dropdown
     */
    getAircraftTypeNames(): string[] {
        this.ensureInitialized();
        return this.wasm!.getAircraftTypeNames();
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
     * Add an engine to a specific list
     * Creates the list if it doesn't exist
     */
    addEngineToList(listName: string, engineData: any): void {
        this.ensureInitialized();
        this.wasm!.addEngineToList(listName, engineData);
    }

    /**
     * Get all engines in a specific list with full data
     */
    getEnginesInList(listName: string): any[] {
        this.ensureInitialized();
        return this.wasm!.getEnginesInList(listName);
    }

    /**
     * Clear all engines from a non-constant list
     */
    clearEngineList(listName: string): void {
        this.ensureInitialized();
        this.wasm!.clearEngineList(listName);
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
     * Calculate engine stats from EngineInputs JSON (standalone calculation)
     */
    calculateEngineStats(engineData: any): any {
        this.ensureInitialized();
        return this.wasm!.calculateEngineStats(engineData);
    }

    /**
     * Check if used modifiers are at default (no damage/wear)
     */
    getUsedIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getUsedIsDefault();
    }

    /**
     * Check if control surfaces are at default configuration
     */
    getControlSurfacesIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getControlSurfacesIsDefault();
    }

    /**
     * Check if landing gear is at default configuration
     */
    getLandingGearIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getLandingGearIsDefault();
    }

    /**
     * Check if optimization is at default configuration
     */
    getOptimizationIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getOptimizationIsDefault();
    }

    /**
     * Check if stabilizers are at default configuration
     */
    getStabilizersIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getStabilizersIsDefault();
    }

    /**
     * Check if alter (custom parts) are at default configuration
     */
    getAlterIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getAlterIsDefault();
    }

    /**
     * Check if passengers are at default configuration
     */
    getPassengersIsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.getPassengersIsDefault();
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
     * Get crash safety values from all cockpit positions
     */
    getCrashList(): number[] {
        this.ensureInitialized();
        return this.wasm!.getCrashList();
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

    // ========== Custom Parts (Alter) Methods ==========

    /**
     * Get list of all custom parts
     */
    getCustomParts(): any[] {
        this.ensureInitialized();
        return this.wasm!.getCustomParts();
    }

    /**
     * Add or update a custom part
     */
    addCustomPart(name: string, stats: any): void {
        this.ensureInitialized();
        this.wasm!.addCustomPart(name, stats);
    }

    /**
     * Remove a custom part by name
     */
    removeCustomPart(name: string): void {
        this.ensureInitialized();
        this.wasm!.removeCustomPart(name);
    }

    /**
     * Set quantity for a custom part by index
     */
    setCustomPartQty(index: number, qty: number): void {
        this.ensureInitialized();
        this.wasm!.setCustomPartQty(index, qty);
    }

    /**
     * Check if custom parts are in default state (all quantities zero)
     */
    isCustomPartsDefault(): boolean {
        this.ensureInitialized();
        return this.wasm!.isCustomPartsDefault();
    }

    /**
     * Get custom parts stats
     */
    getCustomPartsStats(): Stats {
        this.ensureInitialized();
        return this.wasm!.getCustomPartsStats();
    }

    /**
     * Calculate all aircraft statistics
     * Optionally saves to localStorage if autoSaveToLocalStorage is enabled
     */
    calculateStats(): void {
        this.ensureInitialized();
        this.wasm!.calculateStats();
        if (this.autoSaveToLocalStorage) {
            localStorage.setItem(this.storageKey, this.wasm!.toJSON());
            console.log("Saved JSON");
            console.trace();
        }
    }

    /**
     * Enable or disable automatic saving to localStorage when calculateStats() is called
     */
    setAutoSaveToLocalStorage(enabled: boolean): void {
        this.autoSaveToLocalStorage = enabled;
    }

    /**
     * Check if auto-save to localStorage is enabled
     */
    isAutoSaveToLocalStorageEnabled(): boolean {
        return this.autoSaveToLocalStorage;
    }

    /**
     * Serialize to LZ-compressed string (for URLs)
     */
    serializeToLZString(): string {
        this.ensureInitialized();
        return this.wasm!.serializeToLZString();
    }

    /**
     * Serialize to LZ-compressed string in the Helicopter format (no wings / control surfaces).
     * Pair with AircraftWasm.deserializeHeliFromLZString.
     */
    serializeHeliToLZString(): string {
        this.ensureInitialized();
        return this.wasm!.serializeHeliToLZString();
    }

    toJSON(): string {
        this.ensureInitialized();
        return this.wasm!.toJSON();
    }

    /**
     * Deserialize from json (static method)
     */
    static fromJSON(
        acft_json: string,
        AircraftWasmClass: any,
        storage: boolean = true,
    ): AircraftBridge {
        const bridge = new AircraftBridge();
        bridge.setAutoSaveToLocalStorage(storage);
        bridge.wasm = AircraftWasmClass.fromJSON(acft_json);
        bridge.initialized = true;
        bridge.loadEngineListsFromLocalStorage();
        bridge.calculateStats();
        bridge.saveEngineListsToLocalStorage();
        return bridge;
    }

    /**
     * Create a bridge from an already-created WASM aircraft object.
     * Use when the caller controls which WASM factory function is used
     * (e.g. deserializeHeliFromLZString for old helicopter saves).
     */
    static fromWasmObject(
        wasmAircraft: any,
        storage: boolean = true,
    ): AircraftBridge {
        const bridge = new AircraftBridge();
        bridge.setAutoSaveToLocalStorage(storage);
        bridge.wasm = wasmAircraft;
        bridge.initialized = true;
        bridge.loadEngineListsFromLocalStorage();
        bridge.calculateStats();
        bridge.saveEngineListsToLocalStorage();
        return bridge;
    }

    /**
     * Deserialize from LZ-compressed string (static method)
     */
    static deserializeFromLZString(
        lzStr: string,
        AircraftWasmClass: any,
        storage: boolean = true,
    ): AircraftBridge {
        const bridge = new AircraftBridge();
        bridge.setAutoSaveToLocalStorage(storage);
        bridge.wasm = AircraftWasmClass.deserializeFromLZString(lzStr);
        bridge.initialized = true;
        bridge.loadEngineListsFromLocalStorage();
        bridge.calculateStats();
        bridge.saveEngineListsToLocalStorage();
        return bridge;
    }

    /**
     * Load custom engine lists from localStorage
     * Called after creating a new AircraftBridge
     */
    loadEngineListsFromLocalStorage(): void {
        this.ensureInitialized();

        try {
            // Read the list of engine list names
            const engineNamesJson = localStorage.getItem('test.engines_names');
            if (!engineNamesJson) {
                console.log('[AircraftBridge] No custom engine lists found in localStorage');
                return;
            }

            const engineListNames: string[] = JSON.parse(engineNamesJson);
            console.log(`[AircraftBridge] Loading ${engineListNames.length} custom engine lists from localStorage`);

            // For each list name, load the engines
            for (const listName of engineListNames) {
                const enginesJson = localStorage.getItem(`test.engines.${listName}`);
                if (enginesJson) {
                    try {
                        const engines = JSON.parse(enginesJson).engines;
                        console.log(`[AircraftBridge] Loading ${engines.length} engines into list "${listName}"`);

                        // Add each engine to the list
                        for (const engine of engines) {
                            this.addEngineToList(listName, engine);
                        }
                    } catch (e) {
                        console.error(`[AircraftBridge] Failed to load engine list "${listName}":`, e);
                    }
                }
            }
        } catch (e) {
            console.error('[AircraftBridge] Failed to load engine lists from localStorage:', e);
        }
        // {"name":"Custom","engines":[{"name":"Bentley BR.1 150hp","engine_type":0,"type":2,"era_sel":1,"displacement":17.1,"compression":4.9,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":0},{"name":"Renault V8 70hp","engine_type":0,"type":0,"era_sel":1,"displacement":7,"compression":4,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1.4,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":0}]}
    }

    /**
     * Save custom engine lists to localStorage
     * Called after deserializing an aircraft
     */
    saveEngineListsToLocalStorage(): void {
        this.ensureInitialized();

        try {
            // Get all engine list names
            const allListNames = this.getEngineNamesOfLists();

            // Filter out the built-in constant lists (we only want to save custom lists)
            // Built-in lists typically include things like manufacturers
            // For now, we'll save all lists. If needed, we can filter later.
            const customListNames: string[] = [];

            for (const listName of allListNames) {
                const engines = this.getEnginesInList(listName);
                const list = { name: listName, engines: engines };

                // Only save non-empty lists
                if (engines && engines.length > 0) {
                    customListNames.push(listName);
                    localStorage.setItem(`test.engines.${listName}`, JSON.stringify(list));
                    console.log(`[AircraftBridge] Saved ${engines.length} engines to list "${listName}"`);
                }
            }

            // Save the list of custom list names
            localStorage.setItem('test.engines_names', JSON.stringify(customListNames));
            console.log(`[AircraftBridge] Saved ${customListNames.length} custom engine list names`);
        } catch (e) {
            console.error('[AircraftBridge] Failed to save engine lists to localStorage:', e);
        }
    }

    /**
     * Additional helper methods for Aircraft Actions (buttons)
     */

    getAircraftName(): string {
        this.ensureInitialized();
        return this.wasm!.getName();
    }

    getPartsVersion(): string {
        this.ensureInitialized();
        // Parts version is stored in the parts JSON, typically as a number like 20.3
        // For now, return a placeholder - this would need to be exposed from Rust
        return "v1.0";
    }

    resetAircraft(): void {
        this.ensureInitialized();
        // Reset to default aircraft - this would need to be exposed from Rust
        // For now, create a new aircraft and replace
        this.wasm!.reset();
    }

    fromJSON(json: any): boolean {
        this.ensureInitialized();
        try {
            const jsonStr = typeof json === 'string' ? json : JSON.stringify(json);
            this.wasm!.fromJSON(jsonStr);
            return true;
        } catch (e) {
            console.error('Failed to load aircraft from JSON:', e);
            return false;
        }
    }

    getWeaponSets(): number {
        this.ensureInitialized();
        return this.wasm!.getWeaponSetsCount();
    }

    getWeaponSetData(index: number): any {
        this.ensureInitialized();
        const derivedStats = this.wasm!.getWeaponSystemDerivedStats(index);

        // Parse the display info (it's a formatted string)
        // Format includes name, shots, hits, damage, etc.
        return {
            name: derivedStats.name || '',
            abrv: derivedStats.abrv || '',
            shots: derivedStats.shots || 0,
            ap: derivedStats.ap || 0,
            jam: derivedStats.jam || '',
            hits: derivedStats.hits || [0, 0, 0, 0],
            damage: derivedStats.damage || [0, 0, 0, 0],
            tags: derivedStats.tags || [],
            reload: derivedStats.reload || 0,
            gyrojet: derivedStats.gyrojet || false,
        };
    }

    getCockpitEscape(index: number): number {
        this.ensureInitialized();
        const escapeList = this.wasm!.getEscapeList();
        return escapeList[index] || 0;
    }

    getCockpitFlightStress(index: number): [number, number] {
        this.ensureInitialized();
        const stressList = this.wasm!.getStressList();
        return stressList[index] || [0, 0];
    }

    getCockpitVisibility(index: number): number {
        this.ensureInitialized();
        const visibilityList = this.wasm!.getVisibilityList();
        return visibilityList[index] || 0;
    }

    getCockpitCrash(index: number): number {
        this.ensureInitialized();
        // Crash safety is part of cockpit stats
        const stats = this.wasm!.getCockpitStats(index);
        return stats.crashsafety || 0;
    }

    getVitalComponentList(): string[] {
        this.ensureInitialized();
        return this.wasm!.vitalComponentList();
    }

    getEffectiveCoverage(): number[] {
        this.ensureInitialized();
        // This requires exposing from Rust - return empty array for now
        // Would need to be implemented in the WASM bindings
        return [];
    }

    getEngineReliability(index: number): string {
        this.ensureInitialized();
        const reliabilityList = this.wasm!.getReliabilityList();
        return reliabilityList[index] || '0';
    }

    getEngineOverspeed(index: number): number {
        this.ensureInitialized();
        const fullStats = this.wasm!.getEngineFullStats(index);
        return fullStats.overspeed || 0;
    }

    getEngineAltitude(index: number): number {
        this.ensureInitialized();
        const fullStats = this.wasm!.getEngineFullStats(index);
        return fullStats.altitude || 0;
    }

    engineNeedsCooling(index: number): boolean {
        this.ensureInitialized();
        const stats = this.wasm!.getEngineStats(index);
        return (stats.cooling || 0) > 0;
    }

    getEngineRadiatorIndex(index: number): number {
        this.ensureInitialized();
        const bindings = this.wasm!.getEngineBindings(index);
        return bindings.radiator_index?.value || 0;
    }

    getEngineNotes(index: number): string[] {
        this.ensureInitialized();
        const fullStats = this.wasm!.getEngineFullStats(index);
        const notes: string[] = [];

        // Check if it's a pulsejet
        if (fullStats.stats?.pulsejet) {
            notes.push('Pulsejet');
        }

        // Check for rotary engine direction
        if (fullStats.oiltank) {
            // This is a rotary
            const bindings = this.wasm!.getEngineBindings(index);
            if (bindings.mount_sel?.selected === 0) { // Tractor
                notes.push('Turns Right');
            } else if (bindings.mount_sel?.selected === 1) { // Pusher
                notes.push('Turns Left');
            }
        }

        return notes;
    }

    getEngineMinAltitude(index: number): number {
        this.ensureInitialized();
        const minAlt = this.wasm!.getMinAltitude();
        return minAlt;
    }

    getEngineMaxAltitude(index: number): number {
        this.ensureInitialized();
        const maxAlt = this.wasm!.getMaxAltitude();
        return maxAlt;
    }

    getRadiatorMountType(index: number): string {
        this.ensureInitialized();
        const bindings = this.wasm!.getRadiatorBindings(index);
        const mountOptions = bindings.idx_mount?.options || [];
        const selectedMount = bindings.idx_mount?.selected || 0;
        return mountOptions[selectedMount]?.name || '';
    }

    getRadiatorCoolantType(index: number): string {
        this.ensureInitialized();
        const bindings = this.wasm!.getRadiatorBindings(index);
        const coolantOptions = bindings.idx_coolant?.options || [];
        const selectedCoolant = bindings.idx_coolant?.selected || 0;
        return coolantOptions[selectedCoolant]?.name || '';
    }
}
