/**
 * WASM Initialization for Helicopter Builder
 *
 * Similar to Test/src/wasm_init.ts but specifically for helicopters:
 * - Uses localStorage key "helicopter.aircraft"
 * - Sets aircraft type to Helicopter (1) on new aircraft
 */

import { localization } from '../../Test/src/wasm/localization';
import { AircraftBridge } from '../../Test/src/wasm/aircraft_bridge';
import { AircraftActions } from '../../Test/src/wasm/aircraft_actions';
import { LanguageSelector } from '../../Test/src/wasm/components/language_selector';
import { EraUI } from '../../Test/src/wasm/components/era_ui';
import { CockpitsUI } from '../../Test/src/wasm/components/cockpits_ui';
import { PropellerUI } from '../../Test/src/wasm/components/propeller_ui';
import { PassengersUI } from '../../Test/src/wasm/components/passengers_ui';
import { LoadUI } from '../../Test/src/wasm/components/load_ui';
import { AccessoriesUI } from '../../Test/src/wasm/components/accessories_ui';
import { ControlSurfacesUI } from '../../Test/src/wasm/components/control_surfaces_ui';
import { LandingGearUI } from '../../Test/src/wasm/components/landing_gear_ui';
import { OptimizationUI } from '../../Test/src/wasm/components/optimization_ui';
import { UsedUI } from '../../Test/src/wasm/components/used_ui';
import { ReinforcementsUI } from '../../Test/src/wasm/components/reinforcements_ui';
import { StabilizersUI } from '../../Test/src/wasm/components/stabilizers_ui';
import { FramesUI } from '../../Test/src/wasm/components/frames_ui';
import { WingsUI } from '../../Test/src/wasm/components/wings_ui';
import { EnginesUI } from '../../Test/src/wasm/components/engines_ui';
import { WeaponsUI } from '../../Test/src/wasm/components/weapons_ui';
import { TotalStatsUI } from '../../Test/src/wasm/components/total_stats_ui';
import { DerivedStatsUI } from '../../Test/src/wasm/components/derived_stats_ui';
import { CustomPartsUI } from '../../Test/src/wasm/components/custom_parts_ui';
import { AltitudeUI } from '../../Test/src/wasm/components/altitude_ui';
import { RotorUI } from '../../Test/src/wasm/components/rotor_ui';

// Aircraft type constants
const AIRCRAFT_TYPE = {
    AIRPLANE: 0,
    HELICOPTER: 1,
    AUTOGYRO: 2,
    ORNITHOPTER_BASIC: 3,
    ORNITHOPTER_FLUTTER: 4,
    ORNITHOPTER_BUZZER: 5
};

// LocalStorage key for helicopter builder
const STORAGE_KEY = "helicopter.aircraft";

// Type for the WASM module
type WasmModule = any;

export class HelicopterWasmApplication {
    private bridge: AircraftBridge | null = null;
    private actions: AircraftActions | null = null;
    private languageSelector: LanguageSelector | null = null;
    private eraUI: EraUI | null = null;
    private cockpitsUI: CockpitsUI | null = null;
    private propellerUI: PropellerUI | null = null;
    private passengersUI: PassengersUI | null = null;
    private loadUI: LoadUI | null = null;
    private accessoriesUI: AccessoriesUI | null = null;
    private controlSurfacesUI: ControlSurfacesUI | null = null;
    private landingGearUI: LandingGearUI | null = null;
    private optimizationUI: OptimizationUI | null = null;
    private usedUI: UsedUI | null = null;
    private reinforcementsUI: ReinforcementsUI | null = null;
    private stabilizersUI: StabilizersUI | null = null;
    private framesUI: FramesUI | null = null;
    private wingsUI: WingsUI | null = null;
    private enginesUI: EnginesUI | null = null;
    private weaponsUI: WeaponsUI | null = null;
    private totalStatsUI: TotalStatsUI | null = null;
    private derivedStatsUI: DerivedStatsUI | null = null;
    private customPartsUI: CustomPartsUI | null = null;
    private altitudeUI: AltitudeUI | null = null;
    private rotorUI: RotorUI | null = null;
    private initialized: boolean = false;
    private wasmModule: WasmModule | null = null;

    /**
     * Initialize the WASM application for Helicopter
     */
    async initialize(): Promise<void> {
        try {
            console.log('[HelicopterWasmApp] Starting WASM initialization...');

            // Dynamically import the WASM module
            this.wasmModule = await this.loadWasmModule();

            if (!this.wasmModule) {
                console.warn('[HelicopterWasmApp] WASM module not available, using fallback mode');
                return;
            }

            // Initialize WASM
            const initWasm = this.wasmModule.default || this.wasmModule.init;
            if (typeof initWasm !== 'function') {
                throw new Error('WASM init function not found.');
            }
            await initWasm();
            console.log('[HelicopterWasmApp] WASM binary loaded');

            // Initialize localization with WASM backend
            localization.initializeWasm(this.wasmModule.Localization);
            console.log('[HelicopterWasmApp] Localization initialized');

            // Register for language change events
            localization.onLocaleChange((locale) => this.onLanguageChange(locale));

            // Set locale from URL parameter
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            if (langParam) {
                localization.setLocale(langParam);
                console.log(`[HelicopterWasmApp] Locale set from URL: ${langParam}`);
            }

            // Create aircraft bridge
            let loaded = false;
            let jsonParam = urlParams.get('json');

            // Try loading from URL
            if (jsonParam) {
                try {
                    const loadedBridge = await AircraftBridge.deserializeFromLZString(
                        jsonParam,
                        async () => { },
                        this.wasmModule.AircraftWasm
                    );
                    this.bridge = loadedBridge;
                    // Ensure helicopter type is set
                    this.bridge.setAircraftType(AIRCRAFT_TYPE.HELICOPTER);
                    loaded = true;
                    console.log('[HelicopterWasmApp] Loaded helicopter from URL');
                } catch (e) {
                    console.error('[HelicopterWasmApp] Failed to load from URL:', e);
                }
            }

            // Try loading from localStorage
            if (!loaded) {
                try {
                    let acft_data = window.localStorage.getItem(STORAGE_KEY);
                    if (acft_data) {
                        const loadedBridge = new AircraftBridge();
                        await loadedBridge.initialize(async () => { }, this.wasmModule.AircraftWasm);
                        loadedBridge.fromJSON(acft_data);
                        // Ensure helicopter type is set
                        loadedBridge.setAircraftType(AIRCRAFT_TYPE.HELICOPTER);
                        this.bridge = loadedBridge;
                        console.log('[HelicopterWasmApp] Loaded helicopter from saved data');
                        loaded = true;
                    }
                } catch (e) {
                    console.log("Saved Data Failed. " + e);
                }
            }

            // Create new helicopter if nothing loaded
            if (!loaded) {
                try {
                    // Create a fresh aircraft bridge
                    const newBridge = new AircraftBridge();
                    await newBridge.initialize(async () => { }, this.wasmModule.AircraftWasm);
                    // Set to helicopter type
                    newBridge.setAircraftType(AIRCRAFT_TYPE.HELICOPTER);
                    this.bridge = newBridge;
                    console.log('[HelicopterWasmApp] Created new helicopter');
                    loaded = true;
                } catch (e) {
                    console.error("Failed to create new helicopter. " + e);
                }
            }

            if (loaded) {
                console.log('[HelicopterWasmApp] Aircraft bridge initialized');
            } else {
                console.error("[Error] Major error, no helicopter load worked.");
            }

            // Load custom engine lists from localStorage
            this.bridge.loadEngineListsFromLocalStorage();

            // Create aircraft actions
            this.actions = new AircraftActions(this.bridge, () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterWasmApp] Aircraft actions initialized');

            // Create language selector
            this.languageSelector = new LanguageSelector('language_selector_container');
            console.log('[HelicopterWasmApp] Language selector created');

            // Create UI components (same as plane builder, but components will hide/show based on helicopter type)
            this.eraUI = new EraUI(() => this.bridge, 'Era', () => {
                this.onStatsUpdate();
            });

            // Note: No AircraftTypeUI for helicopter - type is fixed

            this.cockpitsUI = new CockpitsUI(() => this.bridge, 'Cockpit', () => {
                this.onStatsUpdate();
            });

            this.propellerUI = new PropellerUI(() => this.bridge, 'Propeller', () => {
                this.onStatsUpdate();
            });

            this.passengersUI = new PassengersUI(() => this.bridge, 'Passengers', () => {
                this.onStatsUpdate();
            });

            this.loadUI = new LoadUI(() => this.bridge, 'Load', () => {
                this.onStatsUpdate();
            });

            this.accessoriesUI = new AccessoriesUI(() => this.bridge, 'Accessories', () => {
                this.onStatsUpdate();
            });

            this.controlSurfacesUI = new ControlSurfacesUI(() => this.bridge, 'ControlSurfaces', () => {
                this.onStatsUpdate();
            });

            this.landingGearUI = new LandingGearUI(() => this.bridge, 'Landing_Gear', () => {
                this.onStatsUpdate();
            });

            this.optimizationUI = new OptimizationUI(() => this.bridge, 'Optimization', () => {
                this.onStatsUpdate();
            });

            this.usedUI = new UsedUI(() => this.bridge, 'Used Planes', () => {
                this.onStatsUpdate();
            });

            this.reinforcementsUI = new ReinforcementsUI(() => this.bridge, 'Reinforcements', () => {
                this.onStatsUpdate();
            });

            this.stabilizersUI = new StabilizersUI(() => this.bridge, 'Stabilizers', () => {
                this.onStatsUpdate();
            });

            this.framesUI = new FramesUI(() => this.bridge, 'Frames', () => {
                this.onStatsUpdate();
            });

            this.wingsUI = new WingsUI(() => this.bridge, 'Wings', () => {
                this.onStatsUpdate();
            });

            this.rotorUI = new RotorUI(() => this.bridge, 'Rotors', () => {
                this.onStatsUpdate();
            });

            this.enginesUI = new EnginesUI(() => this.bridge, 'Engines', () => {
                this.onStatsUpdate();
            });

            this.weaponsUI = new WeaponsUI(() => this.bridge, 'Weapons', () => {
                this.onStatsUpdate();
            });

            this.totalStatsUI = new TotalStatsUI(() => this.bridge, 'Stats', () => {
                this.onStatsUpdate();
            });

            this.derivedStatsUI = new DerivedStatsUI(() => this.bridge, 'Flight', () => {
                this.onStatsUpdate();
            });

            this.customPartsUI = new CustomPartsUI(() => this.bridge, 'CustomParts', () => {
                this.onStatsUpdate();
            });

            this.altitudeUI = new AltitudeUI(() => this.bridge, 'Altitude', () => {
                this.onStatsUpdate();
            });

            this.initialized = true;
            console.log('[HelicopterWasmApp] Initialization complete!');
        } catch (error) {
            console.error('[HelicopterWasmApp] Failed to initialize WASM:', error);
        }
    }

    /**
     * Load the WASM module
     */
    private async loadWasmModule(): Promise<WasmModule | null> {
        try {
            // Import from Test/pkg which contains the WASM build
            const wasmModule = await import('../../Test/pkg/flyingcircuswasm');
            return {
                default: wasmModule.init_panic_hook,
                init: wasmModule.init_panic_hook,
                AircraftWasm: wasmModule.AircraftWasm,
                Localization: wasmModule.Localization
            };
        } catch (e) {
            console.warn('[HelicopterWasmApp] WASM module not found:', e);
            return null;
        }
    }

    /**
     * Called when language changes
     */
    private async onLanguageChange(locale: string): Promise<void> {
        if (!this.bridge || !this.wasmModule) {
            return;
        }

        try {
            console.log(`[HelicopterWasmApp] Language changed to ${locale}, reconstructing...`);

            const serialized = this.bridge.serializeToLZString();
            const newBridge = await AircraftBridge.deserializeFromLZString(
                serialized,
                async () => { },
                this.wasmModule.AircraftWasm
            );

            // Ensure helicopter type is maintained
            newBridge.setAircraftType(AIRCRAFT_TYPE.HELICOPTER);
            this.bridge = newBridge;
            this.bridge.loadEngineListsFromLocalStorage();

            this.render(true);
        } catch (error) {
            console.error('[HelicopterWasmApp] Failed to reconstruct on language change:', error);
        }
    }

    private render(forceFull: boolean = false): void {
        this.eraUI?.render(forceFull);
        this.framesUI?.render(forceFull);
        this.wingsUI?.render(forceFull);
        this.rotorUI?.render(forceFull);
        this.enginesUI?.render(forceFull);
        this.weaponsUI?.render(forceFull);
        this.cockpitsUI?.render(forceFull);
        this.propellerUI?.render(forceFull);
        this.stabilizersUI?.render(forceFull);
        this.controlSurfacesUI?.render(forceFull);
        this.reinforcementsUI?.render(forceFull);
        this.loadUI?.render(forceFull);
        this.landingGearUI?.render(forceFull);
        this.accessoriesUI?.render(forceFull);
        this.optimizationUI?.render(forceFull);
        this.usedUI?.render(forceFull);
        this.totalStatsUI?.render(forceFull);
        this.derivedStatsUI?.render(forceFull);
        this.passengersUI?.render(forceFull);
        this.customPartsUI?.render(forceFull);
        this.altitudeUI?.render(forceFull);
    }

    /**
     * Called when stats need to be updated
     */
    private onStatsUpdate(): void {
        if (!this.bridge) return;

        this.bridge.calculateStats();
        const derivedStats = this.bridge.getDerivedStats();
        console.log('[HelicopterWasmApp] Stats updated:', derivedStats);

        // Autosave to localStorage
        try {
            const json = this.bridge.toJSON();
            window.localStorage.setItem(STORAGE_KEY, json);
        } catch (e) {
            console.warn('[HelicopterWasmApp] Failed to autosave:', e);
        }

        this.render();
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getBridge(): AircraftBridge | null {
        return this.bridge;
    }
}

/**
 * Global Helicopter WASM application instance
 */
export const helicopterWasmApp = new HelicopterWasmApplication();
