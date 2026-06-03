/**
 * Aircraft Bridge - TypeScript wrapper for WASM Aircraft
 *
 * Provides a clean TypeScript API for interacting with the Rust Aircraft implementation
 */

import { localization } from './localization';
// Generated types for the WASM AircraftWasm class. Type-only import (erased at
// runtime); it is the source of truth for the auto-forwarded bridge methods.
import type { AircraftWasm } from '../../pkg/flyingcircuswasm';

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

// Methods the bridge implements itself (lifecycle, storage, and the handful of
// wasm calls it wraps with extra logic). Everything else on AircraftWasm is
// auto-forwarded, so these are excluded from the forwarded type below.
type BridgeOverrides =
    | 'free'
    | 'setStorageKey' | 'initialize' | 'isInitialized' | 'calculateStats'
    | 'setAutoSaveToLocalStorage' | 'isAutoSaveToLocalStorageEnabled'
    | 'loadEngineListsFromLocalStorage' | 'saveEngineListsToLocalStorage'
    | 'getAircraftName' | 'getPartsVersion' | 'resetAircraft' | 'fromJSON'
    | 'getWingDeck' | 'getWingsSesquiplane'
    | 'getWeaponSets' | 'getWeaponSetData'
    | 'getCockpitEscape' | 'getCockpitFlightStress' | 'getCockpitVisibility' | 'getCockpitCrash'
    | 'getVitalComponentList' | 'getEffectiveCoverage'
    | 'getEngineReliability' | 'getEngineOverspeed' | 'getEngineAltitude'
    | 'engineNeedsCooling' | 'getEngineRadiatorIndex' | 'getEngineNotes'
    | 'getEngineMinAltitude' | 'getEngineMaxAltitude'
    | 'getRadiatorMountType' | 'getRadiatorCoolantType';

// Declaration merge: give the dynamically-installed pass-through methods (every
// AircraftWasm instance method except BridgeOverrides) their generated types so
// callers compile without ~145 hand-written wrapper signatures.
export interface AircraftBridge extends Omit<AircraftWasm, BridgeOverrides> {}

/**
 * TypeScript bridge to Rust Aircraft WASM
 */
export class AircraftBridge {
    private wasm: AircraftWasm | null = null;
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
        this.attachWasm(new AircraftWasmClass());
    }

    /**
     * Adopt a WASM aircraft instance and install a pass-through forwarder for
     * every AircraftWasm instance method the bridge does not define itself.
     * This is what makes the ~145 simple get/set/getStats wrappers unnecessary.
     */
    private attachWasm(wasmObj: AircraftWasm): void {
        this.wasm = wasmObj;
        this.initialized = true;
        this.installForwarders();
    }

    private installForwarders(): void {
        if (!this.wasm) return;
        const proto = Object.getPrototypeOf(this.wasm);
        const self = this as any;
        for (const name of Object.getOwnPropertyNames(proto)) {
            if (name === 'constructor' || name === 'free' || name.startsWith('__')) continue;
            const desc = Object.getOwnPropertyDescriptor(proto, name);
            // Skip accessors (don't invoke wasm getters) and non-functions.
            if (!desc || typeof desc.value !== 'function') continue;
            // An explicit method on the bridge (lifecycle/override) always wins.
            if (typeof self[name] === 'function') continue;
            self[name] = (...args: any[]) => (this.wasm as any)[name](...args);
        }
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
     * Get wing deck at index
     */
    getWingDeck(index: number): number | null {
        this.ensureInitialized();
        const deck = this.wasm!.getWingDeck(index);
        return deck !== undefined ? deck : null;
    }

    /**
     * Get sesquiplane info
     */
    getWingsSesquiplane(): { is: boolean; deck: number; super_small: boolean } {
        this.ensureInitialized();
        return this.wasm!.getWingsSesquiplane();
    }

    // ========== Custom Parts (Alter) Methods ==========

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
     * Deserialize from json (static method)
     */
    static fromJSON(
        acft_json: string,
        AircraftWasmClass: any,
        storage: boolean = true,
        storageKey?: string,
    ): AircraftBridge {
        const bridge = new AircraftBridge();
        bridge.setAutoSaveToLocalStorage(storage);
        if (storageKey) bridge.setStorageKey(storageKey);
        bridge.attachWasm(AircraftWasmClass.fromJSON(acft_json));
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
        storageKey?: string,
    ): AircraftBridge {
        const bridge = new AircraftBridge();
        bridge.setAutoSaveToLocalStorage(storage);
        if (storageKey) bridge.setStorageKey(storageKey);
        bridge.attachWasm(wasmAircraft);
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
        storageKey?: string,
    ): AircraftBridge {
        const bridge = new AircraftBridge();
        bridge.setAutoSaveToLocalStorage(storage);
        if (storageKey) bridge.setStorageKey(storageKey);
        bridge.attachWasm(AircraftWasmClass.deserializeFromLZString(lzStr));
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
