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
    escape: number;
    visibility: number;
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
    setName(name: string): void;
    getEraBindings(): any;
    setEraBindings(bindings: any): void;
    getEraStats(): Stats;
    getPropellerBindings(): any;
    setPropellerBindings(bindings: any): void;
    getPropellerStats(): Stats;
    getCockpitsBindings(): any;
    setCockpitsBindings(bindings: any): void;
    getCockpitStats(index: number): any;
    getCockpitDerivedStats(index: number): any;
    calculateStats(): void;
    getDerivedStats(): DerivedStats;
    getStats(): any;
    serialize(): Uint8Array;
    serializeToLZString(): string;
}

// Interface for initialization function
export type WasmInit = () => Promise<void>;

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
        return bridge;
    }
}
