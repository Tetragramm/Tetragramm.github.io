/**
 * Helicopter WASM Initialization
 *
 * Handles initialization of the WASM module for the Helicopter builder
 * Similar to Test/src/wasm_init.ts but configured for helicopters only
 */

import { localization } from '../../../Test/src/wasm/localization';
import { AircraftBridge } from '../../../Test/src/wasm/aircraft_bridge';
import { AircraftActions } from '../../../Test/src/wasm/aircraft_actions';
import { LanguageSelector } from '../../../Test/src/wasm/components/language_selector';
import { EraUI } from '../../../Test/src/wasm/components/era_ui';
import { CockpitsUI } from '../../../Test/src/wasm/components/cockpits_ui';
import { PropellerUI } from '../../../Test/src/wasm/components/propeller_ui';
import { PassengersUI } from '../../../Test/src/wasm/components/passengers_ui';
import { LoadUI } from '../../../Test/src/wasm/components/load_ui';
import { AccessoriesUI } from '../../../Test/src/wasm/components/accessories_ui';
import { LandingGearUI } from '../../../Test/src/wasm/components/landing_gear_ui';
import { OptimizationUI } from '../../../Test/src/wasm/components/optimization_ui';
import { UsedUI } from '../../../Test/src/wasm/components/used_ui';
import { ReinforcementsUI } from '../../../Test/src/wasm/components/reinforcements_ui';
import { StabilizersUI } from '../../../Test/src/wasm/components/stabilizers_ui';
import { FramesUI } from '../../../Test/src/wasm/components/frames_ui';
import { EnginesUI } from '../../../Test/src/wasm/components/engines_ui';
import { WeaponsUI } from '../../../Test/src/wasm/components/weapons_ui';
import { TotalStatsUI } from '../../../Test/src/wasm/components/total_stats_ui';
import { DerivedStatsUI } from '../../../Test/src/wasm/components/derived_stats_ui';
import { CustomPartsUI } from '../../../Test/src/wasm/components/custom_parts_ui';
import { AltitudeUI } from '../../../Test/src/wasm/components/altitude_ui';
import { RotorUI } from '../../../Test/src/wasm/components/rotor_ui';

// Type for the WASM module
type WasmModule = any;

// Helicopter aircraft type constant
const AIRCRAFT_TYPE_HELICOPTER = 1;

// Default helicopter aircraft JSON (serialized LZString)
// This is the Basic Helicopter from the old TypeScript implementation
const DEFAULT_HELICOPTER_LZ = "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl-AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B_h8FsAoex8_ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO_uvHk83B0A";

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
    private landingGearUI: LandingGearUI | null = null;
    private optimizationUI: OptimizationUI | null = null;
    private usedUI: UsedUI | null = null;
    private reinforcementsUI: ReinforcementsUI | null = null;
    private stabilizersUI: StabilizersUI | null = null;
    private framesUI: FramesUI | null = null;
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
     * Initialize the Helicopter WASM application
     */
    async initialize(): Promise<void> {
        try {
            console.log('[HelicopterApp] Starting WASM initialization...');

            // Dynamically import the WASM module
            this.wasmModule = await this.loadWasmModule();

            if (!this.wasmModule) {
                console.warn('[HelicopterApp] WASM module not available, using fallback mode');
                return;
            }

            // Initialize WASM
            const initWasm = this.wasmModule.default || this.wasmModule.init;
            if (typeof initWasm !== 'function') {
                throw new Error('WASM init function not found.');
            }
            await initWasm();
            console.log('[HelicopterApp] WASM binary loaded');

            // Initialize localization with WASM backend
            localization.initializeWasm(this.wasmModule.Localization);
            console.log('[HelicopterApp] Localization initialized');

            // Register for language change events
            localization.onLocaleChange((locale) => this.onLanguageChange(locale));

            // Set locale from URL parameter or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            if (langParam) {
                localization.setLocale(langParam);
                console.log(`[HelicopterApp] Locale set from URL: ${langParam}`);
            }

            // Load helicopter aircraft
            let loaded = false;
            let jsonParam = urlParams.get('json');

            // Try loading from URL parameter
            if (jsonParam) {
                try {
                    const loadedBridge = await AircraftBridge.deserializeFromLZString(
                        jsonParam,
                        async () => { /* Already initialized */ },
                        this.wasmModule.AircraftWasm
                    );
                    // Verify it's a helicopter
                    if (loadedBridge.getAircraftType() === AIRCRAFT_TYPE_HELICOPTER) {
                        this.bridge = loadedBridge;
                        loaded = true;
                        console.log('[HelicopterApp] Loaded helicopter from URL');
                    } else {
                        console.warn('[HelicopterApp] URL aircraft is not a helicopter, ignoring');
                    }
                } catch (e) {
                    console.error('[HelicopterApp] Failed to load aircraft from URL:', e);
                }
            }

            // Try loading from localStorage
            if (!loaded) {
                console.log("Trying saved data...");
                try {
                    let acft_data = window.localStorage.getItem("helicopter.aircraft");
                    if (acft_data) {
                        const loadedBridge = new AircraftBridge();
                        await loadedBridge.initialize(async () => { /* Already initialized */ }, this.wasmModule.AircraftWasm);
                        loadedBridge.fromJSON(acft_data);
                        // Verify it's a helicopter
                        if (loadedBridge.getAircraftType() === AIRCRAFT_TYPE_HELICOPTER) {
                            this.bridge = loadedBridge;
                            console.log('[HelicopterApp] Loaded helicopter from saved data');
                            loaded = true;
                        }
                    }
                } catch (e) {
                    console.log("Saved Data Failed. " + e);
                }
            }

            // Load default helicopter
            if (!loaded) {
                try {
                    this.bridge = await AircraftBridge.deserializeFromLZString(
                        DEFAULT_HELICOPTER_LZ,
                        async () => { /* Already initialized */ },
                        this.wasmModule.AircraftWasm
                    );
                    // Ensure it's set to helicopter type
                    this.bridge.setAircraftType(AIRCRAFT_TYPE_HELICOPTER);
                    loaded = true;
                    console.log('[HelicopterApp] Loaded default helicopter');
                } catch (e) {
                    console.log("Failed to load Basic Helicopter. " + e);
                }
            }

            if (loaded) {
                console.log('[HelicopterApp] Aircraft bridge initialized');
            } else {
                console.error("[Error] Major error, no helicopter load worked.");
                return;
            }

            // Load custom engine lists from localStorage
            this.bridge.loadEngineListsFromLocalStorage();

            // Create aircraft actions (buttons)
            // Note: Uses 'test.aircraft' storage key (shared with aircraft builder for now)
            this.actions = new AircraftActions(this.bridge, () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Aircraft actions initialized');

            // Create language selector
            this.languageSelector = new LanguageSelector('language_selector_container');
            console.log('[HelicopterApp] Language selector created');

            // Create Era UI component
            this.eraUI = new EraUI(() => this.bridge, 'Era', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Era UI created');

            // Create Cockpits UI component
            this.cockpitsUI = new CockpitsUI(() => this.bridge, 'Cockpit', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Cockpits UI created');

            // Create Propeller UI component
            this.propellerUI = new PropellerUI(() => this.bridge, 'Propeller', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Propeller UI created');

            // Create Passengers UI component
            this.passengersUI = new PassengersUI(() => this.bridge, 'Passengers', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Passengers UI created');

            // Create Load UI component
            this.loadUI = new LoadUI(() => this.bridge, 'Load', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Load UI created');

            // Create Accessories UI component
            this.accessoriesUI = new AccessoriesUI(() => this.bridge, 'Accessories', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Accessories UI created');

            // Create LandingGear UI component
            this.landingGearUI = new LandingGearUI(() => this.bridge, 'Landing_Gear', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] LandingGear UI created');

            // Create Optimization UI component
            this.optimizationUI = new OptimizationUI(() => this.bridge, 'Optimization', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Optimization UI created');

            // Create Used Part UI component
            this.usedUI = new UsedUI(() => this.bridge, 'Used Planes', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Used UI created');

            // Create Reinforcements UI component
            this.reinforcementsUI = new ReinforcementsUI(() => this.bridge, 'Reinforcements', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Reinforcements UI created');

            // Create Stabilizers UI component
            this.stabilizersUI = new StabilizersUI(() => this.bridge, 'Stabilizers', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Stabilizers UI created');

            // Create Frames UI component
            this.framesUI = new FramesUI(() => this.bridge, 'Frames', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Frames UI created');

            // Create Rotor UI component (always visible for helicopters)
            this.rotorUI = new RotorUI(() => this.bridge, 'Rotors', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Rotor UI created');

            // Create Engines UI component
            this.enginesUI = new EnginesUI(() => this.bridge, 'Engines', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Engines UI created');

            // Create Weapons UI component
            this.weaponsUI = new WeaponsUI(() => this.bridge, 'Weapons', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Weapons UI created');

            // Create Total Stats UI component
            this.totalStatsUI = new TotalStatsUI(() => this.bridge, 'Stats', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Total Stats UI created');

            // Create Derived Stats UI component
            this.derivedStatsUI = new DerivedStatsUI(() => this.bridge, 'Flight', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Derived Stats UI created');

            // Create Custom Parts UI component
            this.customPartsUI = new CustomPartsUI(() => this.bridge, 'CustomParts', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Custom Parts UI created');

            // Create Altitude UI component
            this.altitudeUI = new AltitudeUI(() => this.bridge, 'Altitude', () => {
                this.onStatsUpdate();
            });
            console.log('[HelicopterApp] Altitude UI created');

            this.initialized = true;
            console.log('[HelicopterApp] Initialization complete!');
        } catch (error) {
            console.error('[HelicopterApp] Failed to initialize WASM:', error);
            console.log('[HelicopterApp] Continuing with TypeScript-only mode');
        }
    }

    /**
     * Load the WASM module
     */
    private async loadWasmModule(): Promise<WasmModule | null> {
        try {
            // Import from Test's pkg directory (shared WASM)
            const wasmModule = await import('../../../Test/pkg/flyingcircuswasm');

            return {
                default: wasmModule.init_panic_hook,
                init: wasmModule.init_panic_hook,
                AircraftWasm: wasmModule.AircraftWasm,
                Localization: wasmModule.Localization
            };
        } catch (e) {
            console.warn('[HelicopterApp] WASM module not found:', e);
            return null;
        }
    }

    /**
     * Called when language changes
     */
    private async onLanguageChange(locale: string): Promise<void> {
        if (!this.bridge || !this.wasmModule) {
            console.warn('[HelicopterApp] Cannot reconstruct aircraft: bridge or module not initialized');
            return;
        }

        try {
            console.log(`[HelicopterApp] Language changed to ${locale}, reconstructing aircraft...`);

            const serialized = this.bridge.serializeToLZString();
            console.log('[HelicopterApp] Aircraft serialized');

            const newBridge = await AircraftBridge.deserializeFromLZString(
                serialized,
                async () => { /* Already initialized */ },
                this.wasmModule.AircraftWasm
            );

            this.bridge = newBridge;
            console.log('[HelicopterApp] Aircraft reconstructed with new language');

            this.bridge.loadEngineListsFromLocalStorage();
            this.render(true);
        } catch (error) {
            console.error('[HelicopterApp] Failed to reconstruct aircraft on language change:', error);
        }
    }

    private render(forceFull: boolean = false): void {
        this.eraUI?.render(forceFull);
        this.framesUI?.render(forceFull);
        this.rotorUI?.render(forceFull);  // Always render rotor for helicopters
        this.enginesUI?.render(forceFull);
        this.weaponsUI?.render(forceFull);
        this.cockpitsUI?.render(forceFull);
        this.propellerUI?.render(forceFull);
        this.stabilizersUI?.render(forceFull);
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
        console.log('[HelicopterApp] Stats updated:', derivedStats);

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
export const helicopterApp = new HelicopterWasmApplication();
