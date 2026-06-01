/**
 * WASM Initialization
 *
 * Handles initialization of the WASM module, localization, and WASM-powered components
 * This is separate from the main plane_builder.ts to allow gradual migration
 */

import { localization } from './wasm/localization';
import { AircraftBridge, AircraftType } from './wasm/aircraft_bridge';
import { DEFAULT_AIRPLANE_LZ } from './wasm/default_aircraft';
import { AircraftActions } from './wasm/aircraft_actions';
import { LanguageSelector } from './wasm/components/language_selector';
import { MobileNavigation, MobileSectionConfig } from './wasm/components/mobile_nav';
import { EraUI } from './wasm/components/era_ui';
import { CockpitsUI } from './wasm/components/cockpits_ui';
import { PropellerUI } from './wasm/components/propeller_ui';
import { PassengersUI } from './wasm/components/passengers_ui';
import { LoadUI } from './wasm/components/load_ui';
import { AccessoriesUI } from './wasm/components/accessories_ui';
import { ControlSurfacesUI } from './wasm/components/control_surfaces_ui';
import { LandingGearUI } from './wasm/components/landing_gear_ui';
import { OptimizationUI } from './wasm/components/optimization_ui';
import { UsedUI } from './wasm/components/used_ui';
import { ReinforcementsUI } from './wasm/components/reinforcements_ui';
import { StabilizersUI } from './wasm/components/stabilizers_ui';
import { FramesUI } from './wasm/components/frames_ui';
import { WingsUI } from './wasm/components/wings_ui';
import { EnginesUI } from './wasm/components/engines_ui';
import { WeaponsUI } from './wasm/components/weapons_ui';
import { TotalStatsUI } from './wasm/components/total_stats_ui';
import { DerivedStatsUI } from './wasm/components/derived_stats_ui';
import { CustomPartsUI } from './wasm/components/custom_parts_ui';
import { AltitudeUI } from './wasm/components/altitude_ui';
import { RotorUI } from './wasm/components/rotor_ui';
import { AircraftTypeUI } from './wasm/components/aircraft_type_ui';

type WasmModule = typeof import('../pkg/flyingcircuswasm');

export interface WasmApplicationConfig {
    /** localStorage key for saving/loading the active aircraft. Default: 'test.aircraft' */
    storageKey?: string;
    /** If true, include Helicopter in the Aircraft Type selector. Default: false */
    includeHelicopter?: boolean;
    /** LZ string to use as the default aircraft when no saved data exists. */
    defaultAircraftLZ?: string;
    /** Mobile-nav section IDs to hide on this page (e.g. Wings/Propeller on Helicopter). */
    hiddenMobileSections?: Set<string>;
}

export class WasmApplication {
    // Bridge starts null and is assigned exactly once during loadAircraft().
    private bridge: AircraftBridge | null = null;
    private wasmModule: WasmModule | null = null;
    private initialized: boolean = false;
    protected config: WasmApplicationConfig;

    // UI components — all assigned in buildUI() after the bridge is loaded, so
    // we use definite-assignment rather than nullable fields to keep render()
    // and the per-component callbacks free of `?.` noise.
    private actions!: AircraftActions;
    private languageSelector!: LanguageSelector;
    private mobileNav!: MobileNavigation;
    private eraUI!: EraUI;
    private aircraftTypeUI!: AircraftTypeUI;
    private cockpitsUI!: CockpitsUI;
    private propellerUI!: PropellerUI;
    private passengersUI!: PassengersUI;
    private loadUI!: LoadUI;
    private accessoriesUI!: AccessoriesUI;
    private controlSurfacesUI!: ControlSurfacesUI;
    private landingGearUI!: LandingGearUI;
    private optimizationUI!: OptimizationUI;
    private usedUI!: UsedUI;
    private reinforcementsUI!: ReinforcementsUI;
    private stabilizersUI!: StabilizersUI;
    private framesUI!: FramesUI;
    private wingsUI!: WingsUI;
    private enginesUI!: EnginesUI;
    private weaponsUI!: WeaponsUI;
    private totalStatsUI!: TotalStatsUI;
    private derivedStatsUI!: DerivedStatsUI;
    private customPartsUI!: CustomPartsUI;
    private altitudeUI!: AltitudeUI;
    private rotorUI!: RotorUI;

    constructor(config: WasmApplicationConfig = {}) {
        this.config = config;
    }

    async initialize(): Promise<void> {
        try {
            console.log('[WasmApp] Starting WASM initialization...');
            const urlParams = new URLSearchParams(window.location.search);

            if (!(await this.bootstrapWasm(urlParams))) return;

            this.bridge = await this.loadAircraft(urlParams);
            if (this.bridge) {
                console.log('[WasmApp] Aircraft bridge initialized');
                if (this.config.storageKey) {
                    this.bridge.setStorageKey(this.config.storageKey);
                }
                if (this.redirectIfWrongPage(urlParams.get('json'))) return;
                // Page-type matches the loaded aircraft — safe to enable autosave
                // and persist the initial state under the correct storage key.
                this.bridge.setAutoSaveToLocalStorage(true);
                this.bridge.calculateStats();
            } else {
                console.error("[Error] Major error, no aircraft load worked.");
                return;
            }

            this.buildUI();
            this.applyInitialCollapseState();
            this.initialized = true;
            console.log('[WasmApp] Initialization complete!');
        } catch (error) {
            console.error('[WasmApp] Failed to initialize WASM:', error);
            console.log('[WasmApp] Continuing with TypeScript-only mode');
        }
    }

    /**
     * Load and start the WASM module, wire up localization, apply any URL-driven
     * locale override. Returns false if WASM is unavailable (page degrades silently).
     */
    private async bootstrapWasm(urlParams: URLSearchParams): Promise<boolean> {
        // wasm-pack bundler-target glue starts the WASM at import time, so all
        // we need to do is install the panic hook once it's loaded.
        this.wasmModule = await this.loadWasmModule();
        if (!this.wasmModule) {
            console.warn('[WasmApp] WASM module not available, using fallback mode');
            return false;
        }
        this.wasmModule.init_panic_hook();
        console.log('[WasmApp] WASM binary loaded');

        localization.initializeWasm(this.wasmModule.Localization);
        console.log('[WasmApp] Localization initialized');
        localization.onLocaleChange((locale) => this.onLanguageChange(locale));

        const langParam = urlParams.get('lang');
        if (langParam) {
            localization.setLocale(langParam);
            console.log(`[WasmApp] Locale set from URL: ${langParam}`);
        }
        return true;
    }

    /**
     * Try in order: ?json= URL param → localStorage → page-default LZ.
     * Returns the loaded bridge, or null if every strategy failed.
     */
    private async loadAircraft(urlParams: URLSearchParams): Promise<AircraftBridge | null> {
        const AircraftWasm = this.wasmModule!.AircraftWasm;

        const jsonParam = urlParams.get('json');
        if (jsonParam) {
            try {
                // storage=false: defer save until after redirectIfWrongPage so a
                // mis-typed share-link can't pollute this page's storage key.
                const bridge = await this.deserializeFromLZ(jsonParam, AircraftWasm, false);
                if (bridge) {
                    console.log('[WasmApp] Loaded aircraft from URL');
                    return bridge;
                }
            } catch (e) {
                console.error('[WasmApp] Failed to load aircraft from URL:', e);
            }
        }

        try {
            const storageKey = this.config.storageKey ?? 'test.aircraft';
            const acft_data = window.localStorage.getItem(storageKey);
            const bridge = new AircraftBridge();
            bridge.initialize(AircraftWasm);
            bridge.setAutoSaveToLocalStorage(false);
            if (bridge.fromJSON(acft_data)) {
                console.log('[WasmApp] Loaded aircraft from saved data');
                return bridge;
            }
            console.log('[WasmApp] Failed to load aircraft from saved data');
        } catch (e) {
            console.log("Saved Data Failed. " + e);
        }

        const defaultLZ = this.config.defaultAircraftLZ ?? DEFAULT_AIRPLANE_LZ;
        try {
            const bridge = await this.deserializeFromLZ(defaultLZ, AircraftWasm, false);
            if (bridge) return bridge;
        } catch (e) {
            console.log("Failed to load default aircraft. " + e);
        }
        return null;
    }

    /**
     * Construct every UI component, the actions panel, the language selector, and
     * the mobile-nav. The bridge must already be loaded before this runs.
     */
    private buildUI(): void {
        const getBridge = () => this.bridge;
        const onUpdate = () => this.onStatsUpdate();

        this.eraUI = new EraUI(getBridge, 'Era', onUpdate);
        // Aircraft Type UI — always show all types including Helicopter so the
        // user can switch pages from either builder.
        this.aircraftTypeUI = new AircraftTypeUI(getBridge, 'Type', () => {
            if (this.redirectIfWrongPage(null)) return;
            this.onStatsUpdate();
        }, true);
        this.cockpitsUI = new CockpitsUI(getBridge, 'Cockpit', onUpdate);
        this.propellerUI = new PropellerUI(getBridge, 'Propeller', onUpdate);
        this.passengersUI = new PassengersUI(getBridge, 'Passengers', onUpdate);
        this.loadUI = new LoadUI(getBridge, 'Load', onUpdate);
        this.accessoriesUI = new AccessoriesUI(getBridge, 'Accessories', onUpdate);
        this.controlSurfacesUI = new ControlSurfacesUI(getBridge, 'ControlSurfaces', onUpdate);
        this.landingGearUI = new LandingGearUI(getBridge, 'Landing_Gear', onUpdate);
        this.optimizationUI = new OptimizationUI(getBridge, 'Optimization', onUpdate);
        this.usedUI = new UsedUI(getBridge, 'Used Planes', onUpdate);
        this.reinforcementsUI = new ReinforcementsUI(getBridge, 'Reinforcements', onUpdate);
        this.stabilizersUI = new StabilizersUI(getBridge, 'Stabilizers', onUpdate);
        this.framesUI = new FramesUI(getBridge, 'Frames', onUpdate);
        this.wingsUI = new WingsUI(getBridge, 'Wings', onUpdate);
        this.rotorUI = new RotorUI(getBridge, 'Rotors', onUpdate);
        this.enginesUI = new EnginesUI(getBridge, 'Engines', onUpdate);
        this.weaponsUI = new WeaponsUI(getBridge, 'Weapons', onUpdate);
        this.totalStatsUI = new TotalStatsUI(getBridge, 'Stats', onUpdate);
        this.derivedStatsUI = new DerivedStatsUI(getBridge, 'Flight', onUpdate);
        this.customPartsUI = new CustomPartsUI(getBridge, 'CustomParts', onUpdate);
        this.altitudeUI = new AltitudeUI(getBridge, 'Altitude', onUpdate);

        this.actions = new AircraftActions(
            this.bridge!,
            () => {
                this.onStatsUpdate();
                this.applyInitialCollapseState();
            },
            () => this.serializeLZ(),
            () => this.serializeForRedirect(),
        );
        this.languageSelector = new LanguageSelector('language_selector_container');
        this.mobileNav = new MobileNavigation('mobile_nav_container');
        this.mobileNav.setSections(this.getMobileSections());
    }

    /**
     * Serialize the current aircraft to an LZ string for URL sharing / language reload.
     * Subclasses can override to use a format-specific serializer (e.g. serializeHeliToLZString).
     */
    protected serializeLZ(): string {
        return this.bridge!.serializeToLZString();
    }

    /**
     * Deserialize an aircraft from an LZ string. Returns null on failure so callers
     * can try a fallback. Subclasses override for format-specific behavior.
     */
    protected async deserializeFromLZ(
        lzStr: string,
        AircraftWasmClass: any,
        storage: boolean = true,
    ): Promise<AircraftBridge | null> {
        return AircraftBridge.deserializeFromLZString(lzStr, AircraftWasmClass, storage, this.config.storageKey);
    }

    /**
     * Serialize the just-loaded aircraft into an LZ string suitable for handing
     * off to whichever builder matches its type, then call redirectIfWrongPage.
     *
     * Returns true if a redirect was initiated. Used by AircraftActions after
     * Load / Default so the target page receives the loaded data via ?json=
     * rather than its own (now stale) localStorage. Autosave is suspended
     * during the calculateStats here so a mis-typed Load doesn't pollute this
     * page's storage with the wrong aircraft format.
     */
    private serializeForRedirect(): boolean {
        if (!this.bridge) return false;
        const prevAutoSave = this.bridge.isAutoSaveToLocalStorageEnabled();
        this.bridge.setAutoSaveToLocalStorage(false);
        // calculateStats materializes the wasm-side state that fromJSON / reset
        // just installed, so the serialized output reflects the new aircraft.
        this.bridge.calculateStats();
        const isHelicopter = this.bridge.getAircraftType() === AircraftType.Helicopter;
        const lzStr = isHelicopter
            ? this.bridge.serializeHeliToLZString()
            : this.bridge.serializeToLZString();
        this.bridge.setAutoSaveToLocalStorage(prevAutoSave);
        return this.redirectIfWrongPage(lzStr);
    }

    /**
     * If the loaded aircraft's type doesn't match the current builder page,
     * redirect to the correct page. Returns true if a redirect was initiated
     * (caller should bail out).
     *
     * jsonParam: if set, reuse it verbatim in the redirect URL (preserves the
     * original share-link bytes). If null (e.g. type-change in the UI), redirect
     * with a clean URL — the target page will load whatever it has in its own
     * localStorage. Cross-format serialization round-trips don't work cleanly,
     * so we don't try.
     */
    private redirectIfWrongPage(jsonParam: string | null): boolean {
        if (!this.bridge) return false;
        const onHelicopterPage = window.location.href.includes('/Helicopter/');
        const isHelicopter = this.bridge.getAircraftType() === AircraftType.Helicopter;
        if (isHelicopter === onHelicopterPage) return false;

        const [fromHtml, toHtml, fromDir, toDir] = onHelicopterPage
            ? ['/Helicopter/index.html', '/Test/index.html', '/Helicopter/', '/Test/']
            : ['/Test/index.html', '/Helicopter/index.html', '/Test/', '/Helicopter/'];
        let targetUrl = window.location.href
            .replace(fromHtml, toHtml)
            .replace(fromDir, toDir)
            .split('?')[0]
            .split('#')[0];
        if (jsonParam) {
            targetUrl += '?json=' + encodeURIComponent(jsonParam);
        }
        console.log('[WasmApp] Aircraft type does not match page — redirecting to', targetUrl);
        window.location.replace(targetUrl);
        return true;
    }

    private async loadWasmModule(): Promise<WasmModule | null> {
        try {
            return await import('../pkg/flyingcircuswasm');
        } catch (e) {
            console.warn('[WasmApp] WASM module not found (not yet built):', e);
            return null;
        }
    }

    /**
     * Locale change handler. The aircraft has to be deserialized again because
     * UIBindings carry already-translated strings baked in by Rust.
     */
    private async onLanguageChange(locale: string): Promise<void> {
        if (!this.bridge || !this.wasmModule) {
            console.warn('[WasmApp] Cannot reconstruct aircraft: bridge or module not initialized');
            return;
        }
        try {
            console.log(`[WasmApp] Language changed to ${locale}, reconstructing aircraft...`);
            const serialized = this.serializeLZ();
            const newBridge = await this.deserializeFromLZ(serialized, this.wasmModule.AircraftWasm);
            if (newBridge) this.bridge = newBridge;
            this.render(true);
        } catch (error) {
            console.error('[WasmApp] Failed to reconstruct aircraft on language change:', error);
        }
        this.actions.setupButtons();
    }

    private render(forceFull: boolean = false): void {
        this.eraUI.render(forceFull);
        this.aircraftTypeUI.render(forceFull);
        this.framesUI.render(forceFull);
        this.wingsUI.render(forceFull);
        this.rotorUI.render(forceFull);
        this.enginesUI.render(forceFull);
        this.weaponsUI.render(forceFull);
        this.cockpitsUI.render(forceFull);
        this.propellerUI.render(forceFull);
        this.stabilizersUI.render(forceFull);
        this.controlSurfacesUI.render(forceFull);
        this.reinforcementsUI.render(forceFull);
        this.loadUI.render(forceFull);
        this.landingGearUI.render(forceFull);
        this.accessoriesUI.render(forceFull);
        this.optimizationUI.render(forceFull);
        this.usedUI.render(forceFull);
        this.totalStatsUI.render(forceFull);
        this.derivedStatsUI.render(forceFull);
        this.passengersUI.render(forceFull);
        this.customPartsUI.render(forceFull);
        this.altitudeUI.render(forceFull);
    }

    private onStatsUpdate(): void {
        if (!this.bridge) return;
        this.bridge.calculateStats();
        this.render();
    }

    private applyInitialCollapseState(): void {
        this.controlSurfacesUI.applyInitialCollapseState();
        this.landingGearUI.applyInitialCollapseState();
        this.optimizationUI.applyInitialCollapseState();
        this.stabilizersUI.applyInitialCollapseState();
        this.usedUI.applyInitialCollapseState();
        this.customPartsUI.applyInitialCollapseState();
        this.passengersUI.applyInitialCollapseState();
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getBridge(): AircraftBridge | null {
        return this.bridge;
    }

    private getMobileSections(): MobileSectionConfig[] {
        const sections: MobileSectionConfig[] = [
            { id: 'Intro', labelKey: 'Intro Section Title' },
            { id: 'Type', labelKey: 'Aircraft Type Section Title' },
            { id: 'Era', labelKey: 'Era Section Title' },
            { id: 'Cockpit', labelKey: 'Cockpit Section Title' },
            { id: 'Passengers', labelKey: 'Passengers Section Title' },
            { id: 'Engines', labelKey: 'Engines Section Title' },
            { id: 'Frames', labelKey: 'Frames Frames and Covering' },
            { id: 'Wings', labelKey: 'Wings Section Title', isVisible: () => this.wingsUI.isVisible() },
            { id: 'Rotors', labelKey: 'Rotor Section Title', isVisible: () => this.rotorUI.isVisible() },
            { id: 'Stabilizers', labelKey: 'Stabilizers Section Title' },
            { id: 'ControlSurfaces', labelKey: 'Control Surfaces Section Title', isVisible: () => this.controlSurfacesUI.isVisible() },
            { id: 'Reinforcements', labelKey: 'Reinforcement Section Title', isVisible: () => this.reinforcementsUI.isVisible() },
            { id: 'Weapons', labelKey: 'Weapons Section Title' },
            { id: 'Load', labelKey: 'Load Section Title' },
            { id: 'Landing_Gear', labelKey: 'Landing Gear Section Title' },
            { id: 'Accessories', labelKey: 'Accessories Section Title' },
            { id: 'Propeller', labelKey: 'Propeller Section Title', isVisible: () => this.propellerUI.isVisible() },
            { id: 'Optimization', labelKey: 'Optimization Section Title' },
            { id: 'Used Planes', labelKey: 'Used Section Title' },
            { id: 'CustomParts', labelKey: 'Alter Section Title' },
            { id: 'Stats', labelKey: 'Aircraft Stats Section Title' },
            { id: 'Flight', labelKey: 'Aircraft Derived Section Title' },
            { id: 'Altitude', labelKey: 'Altitude Section Title' },
        ];
        const hidden = this.config.hiddenMobileSections;
        return hidden ? sections.filter(s => !hidden.has(s.id)) : sections;
    }
}

