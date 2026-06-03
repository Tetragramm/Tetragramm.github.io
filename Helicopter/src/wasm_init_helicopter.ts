/**
 * Helicopter WASM Initialization
 *
 * Extends WasmApplication for the Helicopter page:
 *  - Uses 'helicopter.aircraft' localStorage key
 *  - Shows only Helicopter in the Aircraft Type selector
 *  - Handles both old TypeScript Helicopter saves (no wings/controlsurfaces in
 *    the binary stream) and new Rust saves via a try-then-fallback strategy
 */

import { WasmApplication, WasmApplicationConfig } from '../../Test/src/wasm_init';
import { AircraftBridge } from '../../Test/src/wasm/aircraft_bridge';
import { DEFAULT_HELICOPTER_LZ } from '../../Test/src/wasm/default_aircraft';

const HELICOPTER_CONFIG: WasmApplicationConfig = {
    storageKey: 'helicopter.aircraft',
    includeHelicopter: true,
    defaultAircraftLZ: DEFAULT_HELICOPTER_LZ,
    hiddenMobileSections: new Set(['Wings', 'ControlSurfaces', 'Reinforcements', 'Propeller']),
    // The Helicopter pages live in a sibling directory; Rules pages and the Engine
    // Builder physically live under Test/, so point shared-asset links there.
    assetBasePath: '../Test/',
};

export class HelicopterApplication extends WasmApplication {
    constructor() {
        super(HELICOPTER_CONFIG);
    }

    /**
     * Serialize using the Helicopter format (no wings / control surfaces) so that
     * URLs produced on this page can always be loaded by deserializeHeliFromLZString.
     */
    protected serializeLZ(): string {
        return this.getBridge()!.serializeHeliToLZString();
    }

    /**
     * Copy As Link on the Helicopter page emits the heli format
     * (serializeHeliToLZString), so try that first. Fall back to the standard
     * format for backwards compat with older saves.
     */
    protected async deserializeFromLZ(
        lzStr: string,
        AircraftWasmClass: any,
        storage: boolean = true,
    ): Promise<AircraftBridge | null> {
        const storageKey = HELICOPTER_CONFIG.storageKey;
        try {
            const wasmObj = AircraftWasmClass.deserializeHeliFromLZString(lzStr);
            const bridge = AircraftBridge.fromWasmObject(wasmObj, storage, storageKey);
            console.log('[HelicopterApp] Loaded aircraft with heli deserialize');
            return bridge;
        } catch (_e) {
            console.log('[HelicopterApp] Heli deserialize failed, trying standard format');
        }

        try {
            const bridge = AircraftBridge.deserializeFromLZString(lzStr, AircraftWasmClass, storage, storageKey);
            console.log('[HelicopterApp] Loaded aircraft with standard deserialize');
            return bridge;
        } catch (e) {
            console.error('[HelicopterApp] Both deserialize attempts failed:', e);
            return null;
        }
    }
}

