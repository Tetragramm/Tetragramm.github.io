/**
 * Engine Builder Application
 *
 * Main coordinator for the engine builder UI components
 */

import { AircraftBridge } from '../aircraft_bridge';
import { DEFAULT_AIRPLANE_LZ } from '../default_aircraft';
import { PropellerBuilderUI } from './propeller_builder_ui';
import { PulsejetBuilderUI } from './pulsejet_builder_ui';
import { TurboBuilderUI } from './turbo_builder_ui';
import { ElectricBuilderUI } from './electric_builder_ui';
import { EngineListManagerUI } from './engine_list_manager_ui';
import { EngineInputs } from '../types/engine_inputs';
import { localization } from '../localization';
import { MobileNavigation, MobileSectionConfig } from '../components/mobile_nav';

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
    private mobileNav: MobileNavigation | null = null;
    private currentVisibleSection: string = 'Engines';

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
            this.bridge = AircraftBridge.deserializeFromLZString(
                DEFAULT_AIRPLANE_LZ,
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

            // Setup mobile navigation
            this.setupMobileNavigation();

            console.log('[EngineBuilderApp] Initialization complete!');
        } catch (error) {
            console.error('[EngineBuilderApp] Failed to initialize:', error);
        }
    }

    /**
     * Load an engine configuration into the appropriate builder
     */
    private loadEngineIntoBuilder(engine: EngineInputs): void {
        let sectionIndex = -1;

        if ('Propeller' in engine.inputs) {
            if (this.propellerBuilder) {
                this.propellerBuilder.setEngineInputs(engine);
                sectionIndex = 0; // Engines
            }
        } else if ('Pulsejet' in engine.inputs) {
            if (this.pulsejetBuilder) {
                this.pulsejetBuilder.setEngineInputs(engine);
                sectionIndex = 1; // Pulsejets
            }
        } else if ('Turbine' in engine.inputs) {
            if (this.turboBuilder) {
                this.turboBuilder.setEngineInputs(engine);
                sectionIndex = 2; // Turbojets/Turbofans
            }
        } else if ('Electric' in engine.inputs) {
            if (this.electricBuilder) {
                this.electricBuilder.setEngineInputs(engine);
                sectionIndex = 3; // Electric
            }
        } else {
            console.error('Unknown engine type:', engine.inputs);
        }

        // Navigate to the appropriate section on mobile
        if (sectionIndex >= 0 && this.mobileNav && window.innerWidth <= 768) {
            this.mobileNav.showSection(sectionIndex);
        }
    }

    /**
     * Setup mobile navigation for switching between builders
     */
    private setupMobileNavigation(): void {
        const navContainer = document.getElementById('mobile_nav_container');
        if (!navContainer) {
            console.warn('[EngineBuilderApp] Mobile nav container not found');
            return;
        }

        this.mobileNav = new MobileNavigation('mobile_nav_container');

        const sections: MobileSectionConfig[] = [
            { id: 'Engines', labelKey: 'Propeller Builder' },
            { id: 'Pulsejets', labelKey: 'Pulsejet Builder' },
            { id: 'Turbojets/Turbofans', labelKey: 'Turbine Builder' },
            { id: 'Electric', labelKey: 'Electric Builder' }
        ];

        this.mobileNav.setSections(sections);

        // Override showSection to track visible section and update button visibility
        const originalShowSection = this.mobileNav.showSection.bind(this.mobileNav);
        this.mobileNav.showSection = (index: number) => {
            originalShowSection(index);
            if (index >= 0 && index < sections.length) {
                this.currentVisibleSection = sections[index].id;
                this.updateAddFromButtonVisibility();
            }
        };

        // Ensure the first section is shown on mobile
        this.mobileNav.showSection(0);

        // Initial button visibility update
        this.updateAddFromButtonVisibility();

        // Update button visibility on resize
        window.addEventListener('resize', () => {
            this.updateAddFromButtonVisibility();
        });
    }

    /**
     * Update the visibility of "Add From" buttons based on current visible section
     */
    private updateAddFromButtonVisibility(): void {
        if (this.listManager) {
            this.listManager.setButtonVisibility(
                this.currentVisibleSection === 'Engines',
                this.currentVisibleSection === 'Pulsejets',
                this.currentVisibleSection === 'Turbojets/Turbofans',
                this.currentVisibleSection === 'Electric'
            );
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
    // DOM is still loading, wait for DOMContentLoaded
    window.addEventListener("DOMContentLoaded", initApp);
} else {
    // DOM is already loaded (common with ES modules)
    initApp();
}
