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
import { MobileSectionConfig } from '../../Test/src/wasm/components/mobile_nav';

const HELICOPTER_DEFAULT_LZ =
    "AAEAjATAdA7MAIAhAhgZwJYGMAEAJApgDZYD2ADgC74BOwAgPcEwGBNsvtsic+MAoAZUwALavnQAjGtgAqUAJIANbGABsABmFlgAZGABcUEwbAAQJwAQwALBsAkL0dN4wPk-fuGgkWMnS5SioaWsAAwADq4fKuQqLiUtSyCspqmtpM5nQAggCBAJkAWQACeYXADnQA-KgAzDWVAAFMlQAxADMAs2aMAHhG7ObAAP9DwAAwHu7ck5ODHnOcJowOM5wrq2wAoBvcSxv9oexW+4eOAOAbp0xX+7wMoQzMe8b0S3QjjI7Pkwzf7IcmIA";

const HIDDEN_MOBILE_SECTIONS = new Set([
    'Wings',
    'ControlSurfaces',
    'Reinforcements',
    'Propeller',
]);

const HELICOPTER_CONFIG: WasmApplicationConfig = {
    storageKey: 'helicopter.aircraft',
    includeHelicopter: true,
    defaultAircraftLZ: HELICOPTER_DEFAULT_LZ,
};

export class HelicopterApplication extends WasmApplication {
    constructor() {
        super(HELICOPTER_CONFIG);
    }

    protected getMobileSections(): MobileSectionConfig[] {
        return super.getMobileSections().filter(s => !HIDDEN_MOBILE_SECTIONS.has(s.id));
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
        AircraftWasmClass: any
    ): Promise<AircraftBridge | null> {
        // Attempt 1: heli format (current Copy As Link output + old TS saves)
        try {
            const wasmObj = AircraftWasmClass.deserializeHeliFromLZString(lzStr);
            const bridge = await AircraftBridge.fromWasmObject(
                wasmObj,
                async () => { },
                AircraftWasmClass
            );
            console.log('[HelicopterApp] Loaded aircraft with heli deserialize');
            return bridge;
        } catch (_e) {
            console.log('[HelicopterApp] Heli deserialize failed, trying standard format');
        }

        // Attempt 2: standard Rust format (older Copy As Link output)
        try {
            const bridge = await AircraftBridge.deserializeFromLZString(
                lzStr,
                async () => { },
                AircraftWasmClass
            );
            console.log('[HelicopterApp] Loaded aircraft with standard deserialize');
            return bridge;
        } catch (e) {
            console.error('[HelicopterApp] Both deserialize attempts failed:', e);
            return null;
        }
    }
}

export const wasmApp = new HelicopterApplication();
