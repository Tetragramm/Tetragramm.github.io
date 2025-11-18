/**
 * Engine Builder Application
 *
 * Main coordinator for the engine builder UI components
 */

import { AircraftBridge } from '../aircraft_bridge';
import { PropellerBuilderUI } from './propeller_builder_ui';
import { PulsejetBuilderUI } from './pulsejet_builder_ui';
import { TurboBuilderUI } from './turbo_builder_ui';
import { ElectricBuilderUI } from './electric_builder_ui';
import { EngineListManagerUI } from './engine_list_manager_ui';
import { EngineInputs } from '../types/engine_inputs';
import { localization } from '../localization';

/**
 * Main Engine Builder Application
 */
export class EngineBuilderApp {
    private bridge: AircraftBridge;
    private wasmModule: any;

    private propellerBuilder: PropellerBuilderUI | null = null;
    private pulsejetBuilder: PulsejetBuilderUI | null = null;
    private turboBuilder: TurboBuilderUI | null = null;
    private electricBuilder: ElectricBuilderUI | null = null;
    private listManager: EngineListManagerUI | null = null;

    constructor(wasmModule: any) {
        this.wasmModule = wasmModule;
    }

    /**
     * Initialize the application
     */
    async initialize(): Promise<void> {
        try {
            console.log('[EngineBuilderApp] Starting initialization...');

            // Initialize localization with WASM backend
            localization.initializeWasm(this.wasmModule.Localization);

            // Set locale from URL parameter or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const langParam = urlParams.get('lang');
            if (langParam) {
                localization.setLocale(langParam);
                console.log(`[EngineBuilderApp] Locale set from URL: ${langParam}`);
            } else if (localStorage.getItem('language')) {
                localization.setLocale(localStorage.getItem('language')!);
            }

            // Create a minimal AircraftBridge for engine list management
            // We don't need a full aircraft, just the engine list functionality
            this.bridge = await AircraftBridge.deserializeFromLZString(
                "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A",
                async () => { /* Already initialized */ },
                this.wasmModule.AircraftWasm
            );

            // Load engine lists from localStorage
            this.bridge.loadEngineListsFromLocalStorage();

            // Create builder UIs
            this.propellerBuilder = new PropellerBuilderUI('engine_builder_propeller', this.wasmModule);
            console.log('[EngineBuilderApp] Propeller builder created');

            this.pulsejetBuilder = new PulsejetBuilderUI('engine_builder_pulsejet', this.wasmModule);
            console.log('[EngineBuilderApp] Pulsejet builder created');

            this.turboBuilder = new TurboBuilderUI('engine_builder_turbine', this.wasmModule);
            console.log('[EngineBuilderApp] Turbine builder created');

            this.electricBuilder = new ElectricBuilderUI('engine_builder_electric', this.wasmModule);
            console.log('[EngineBuilderApp] Electric builder created');

            // Create list manager
            this.listManager = new EngineListManagerUI('engine_builder_list_manager', this.bridge);
            console.log('[EngineBuilderApp] List manager created');

            // Wire up callbacks
            this.listManager.registerPropellerGetter(() => this.propellerBuilder!.getEngineInputs());
            this.listManager.registerPulsejetGetter(() => this.pulsejetBuilder!.getEngineInputs());
            this.listManager.registerTurbineGetter(() => this.turboBuilder!.getEngineInputs());
            this.listManager.registerElectricGetter(() => this.electricBuilder!.getEngineInputs());

            this.listManager.registerEngineSelectedCallback((engine: EngineInputs) => {
                this.loadEngineIntoBuilder(engine);
            });


            console.log('[EngineBuilderApp] Initialization complete!');
        } catch (error) {
            console.error('[EngineBuilderApp] Failed to initialize:', error);
        }
    }

    /**
     * Load an engine configuration into the appropriate builder
     */
    private loadEngineIntoBuilder(engine: EngineInputs): void {
        if ('Propeller' in engine.inputs) {
            if (this.propellerBuilder) {
                this.propellerBuilder.setEngineInputs(engine);
            }
        } else if ('Pulsejet' in engine.inputs) {
            if (this.pulsejetBuilder) {
                this.pulsejetBuilder.setEngineInputs(engine);
            }
        } else if ('Turbine' in engine.inputs) {
            if (this.turboBuilder) {
                this.turboBuilder.setEngineInputs(engine);
            }
        } else if ('Electric' in engine.inputs) {
            if (this.electricBuilder) {
                this.electricBuilder.setEngineInputs(engine);
            }
        } else {
            console.error('Unknown engine type:', engine.inputs);
        }
    }
}

/**
 * Initialize the engine builder app when WASM loads
 */
async function initApp(): Promise<void> {
    try {
        // Dynamically import WASM module
        const wasmModule = await import('../../../pkg/flyingcircuswasm');

        // Initialize WASM
        await wasmModule.init_panic_hook();
        console.log('[EngineBuilderApp] WASM loaded');

        // Create and initialize app
        const app = new EngineBuilderApp({
            AircraftWasm: wasmModule.AircraftWasm,
            Localization: wasmModule.Localization
        });

        await app.initialize();
    } catch (error) {
        console.error('[EngineBuilderApp] Failed to load WASM:', error);
        alert('Failed to load engine builder. Please refresh the page.');
    }
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
