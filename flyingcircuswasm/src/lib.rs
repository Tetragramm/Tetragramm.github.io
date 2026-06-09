use flyingcircusrust::aircraft::Aircraft;
use flyingcircusrust::electric_builder::WINDING_TABLE;
use flyingcircusrust::part::Part;
use flyingcircusrust::propeller_builder::{COOLING_TABLE, UPGRADES};
use flyingcircusrust::pulsejet_builder::VALVE_TABLE;
use flyingcircusrust::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use flyingcircusrust::turbo_builder::{ERA_TABLE, TYPE_TABLE};
use flyingcircusrust::{translate, UIBindings};
use serde::Serialize;
use wasm_bindgen::prelude::*;

// Set up panic hook for better error messages in console
#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

#[derive(Serialize)]
struct CockpitDerived {
    flight_stress_norm: i16,
    flight_stress_cp: i16,
    pos_escape: i16,
    pos_visibility: f64,
}

/// Sealed cockpits use i16::MIN as a stand-in for negative infinity visibility.
/// Convert that sentinel to an actual -Infinity for display (matching the
/// original TypeScript, which returned -1/0). Any other value passes through.
fn visibility_for_display(v: i16) -> f64 {
    if v == i16::MIN {
        f64::NEG_INFINITY
    } else {
        v as f64
    }
}

/// Localization API for managing translations
///
/// This is a pass-through wrapper for the localization functions in flyingcircusrust
#[wasm_bindgen]
pub struct Localization;

#[wasm_bindgen]
impl Localization {
    /// Get list of available languages
    #[wasm_bindgen(js_name = getAvailableLanguages)]
    pub fn get_available_languages() -> Vec<String> {
        flyingcircusrust::get_available_languages()
    }

    /// Set the current locale
    #[wasm_bindgen(js_name = setLocale)]
    pub fn set_locale(locale: &str) {
        flyingcircusrust::set_locale(locale);
    }

    /// Get current locale
    #[wasm_bindgen(js_name = getLocale)]
    pub fn get_locale() -> String {
        flyingcircusrust::get_locale()
    }

    /// Translate a single key
    #[wasm_bindgen(js_name = translate)]
    pub fn translate(key: &str) -> String {
        flyingcircusrust::translate(key)
    }

    /// Translate a key with one parameter substitution
    /// The translation string should contain %{A} which will be replaced with the value
    #[wasm_bindgen(js_name = translateWithParam)]
    pub fn translate_with_param(key: &str, value: &str) -> String {
        flyingcircusrust::translate_with_param(key, value)
    }

    /// Translate a key with two parameter substitution
    /// The translation string should contain %{A} and %{B} which will be replaced with the value
    #[wasm_bindgen(js_name = translateWithParams)]
    pub fn translate_with_params(key: &str, value: &str, value2: &str) -> String {
        flyingcircusrust::translate_with_params(key, value, value2)
    }
}

/// Main Aircraft wrapper for WASM
#[wasm_bindgen]
pub struct AircraftWasm {
    inner: Aircraft,
}

// ============================================================================
// Part UI binding boilerplate
//
// Almost every part exposes the same trio across the WASM boundary:
//   get<Part>Bindings  -> serialize create_ui_options()
//   set<Part>Bindings  -> receive_ui_selections(); recalc aircraft stats
//   get<Part>Stats     -> serialize part_stats()
//
// These macros generate that trio (or just the getter/setter for parts whose
// stats are reported per sub-element) so adding a part is a single line instead
// of three hand-written, identical wasm-bindgen methods. The generated JS names
// are spelled out as string literals to keep the JS API contract explicit.
// ============================================================================

macro_rules! part_ui {
    ($field:ident,
     $get:ident   = $get_js:literal,
     $set:ident   = $set_js:literal,
     $stats:ident = $stats_js:literal) => {
        #[wasm_bindgen]
        impl AircraftWasm {
            #[wasm_bindgen(js_name = $get_js)]
            pub fn $get(&self) -> JsValue {
                serde_wasm_bindgen::to_value(&self.inner.$field.create_ui_options()).unwrap()
            }

            #[wasm_bindgen(js_name = $set_js)]
            pub fn $set(&mut self, js_options: JsValue) {
                if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
                    self.inner.$field.receive_ui_selections(options);
                    self.inner.part_stats();
                }
            }

            #[wasm_bindgen(js_name = $stats_js)]
            pub fn $stats(&mut self) -> JsValue {
                serde_wasm_bindgen::to_value(&self.inner.$field.part_stats()).unwrap()
            }
        }
    };
}

macro_rules! part_ui_bindings_only {
    ($field:ident,
     $get:ident = $get_js:literal,
     $set:ident = $set_js:literal) => {
        #[wasm_bindgen]
        impl AircraftWasm {
            #[wasm_bindgen(js_name = $get_js)]
            pub fn $get(&self) -> JsValue {
                serde_wasm_bindgen::to_value(&self.inner.$field.create_ui_options()).unwrap()
            }

            #[wasm_bindgen(js_name = $set_js)]
            pub fn $set(&mut self, js_options: JsValue) {
                if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
                    self.inner.$field.receive_ui_selections(options);
                    self.inner.part_stats();
                }
            }
        }
    };
}

part_ui!(era,             get_era_bindings             = "getEraBindings",             set_era_bindings             = "setEraBindings",             get_era_stats             = "getEraStats");
part_ui!(propeller,       get_propeller_bindings       = "getPropellerBindings",       set_propeller_bindings       = "setPropellerBindings",       get_propeller_stats       = "getPropellerStats");
part_ui!(passengers,      get_passengers_bindings      = "getPassengersBindings",      set_passengers_bindings      = "setPassengersBindings",      get_passengers_stats      = "getPassengersStats");
part_ui!(fuel,            get_fuel_bindings            = "getFuelBindings",            set_fuel_bindings            = "setFuelBindings",            get_fuel_stats            = "getFuelStats");
part_ui!(accessories,     get_accessories_bindings     = "getAccessoriesBindings",     set_accessories_bindings     = "setAccessoriesBindings",     get_accessories_stats     = "getAccessoriesStats");
part_ui!(cargo,           get_cargo_bindings           = "getCargoBindings",           set_cargo_bindings           = "setCargoBindings",           get_cargo_stats           = "getCargoStats");
part_ui!(controlsurfaces, get_control_surfaces_bindings = "getControlSurfacesBindings", set_control_surfaces_bindings = "setControlSurfacesBindings", get_control_surfaces_stats = "getControlSurfacesStats");
part_ui!(gear,            get_landing_gear_bindings    = "getLandingGearBindings",     set_landing_gear_bindings    = "setLandingGearBindings",     get_landing_gear_stats    = "getLandingGearStats");
part_ui!(munitions,       get_munitions_bindings       = "getMunitionsBindings",       set_munitions_bindings       = "setMunitionsBindings",       get_munitions_stats       = "getMunitionsStats");
part_ui!(optimization,    get_optimization_bindings    = "getOptimizationBindings",    set_optimization_bindings    = "setOptimizationBindings",    get_optimization_stats    = "getOptimizationStats");
part_ui!(used,            get_used_bindings            = "getUsedBindings",            set_used_bindings            = "setUsedBindings",            get_used_stats            = "getUsedStats");
part_ui!(weapons,         get_weapons_bindings         = "getWeaponsBindings",         set_weapons_bindings         = "setWeaponsBindings",         get_weapons_stats         = "getWeaponsStats");
part_ui!(reinforcements,  get_reinforcements_bindings  = "getReinforcementsBindings",  set_reinforcements_bindings  = "setReinforcementsBindings",  get_reinforcements_stats  = "getReinforcementsStats");
part_ui!(stabilizers,     get_stabilizers_bindings     = "getStabilizersBindings",     set_stabilizers_bindings     = "setStabilizersBindings",     get_stabilizers_stats     = "getStabilizersStats");
part_ui!(frames,          get_frames_bindings          = "getFramesBindings",          set_frames_bindings          = "setFramesBindings",          get_frames_stats          = "getFramesStats");
part_ui!(wings,           get_wings_bindings           = "getWingsBindings",           set_wings_bindings           = "setWingsBindings",           get_wings_stats           = "getWingsStats");
part_ui!(rotor,           get_rotor_bindings           = "getRotorBindings",           set_rotor_bindings           = "setRotorBindings",           get_rotor_stats           = "getRotorStats");
part_ui!(engines,         get_engines_bindings         = "getEnginesBindings",         set_engines_bindings         = "setEnginesBindings",         get_engines_stats         = "getEnginesStats");
part_ui_bindings_only!(cockpits, get_cockpits_bindings = "getCockpitsBindings", set_cockpits_bindings = "setCockpitsBindings");

#[wasm_bindgen]
impl AircraftWasm {
    /// Create a new aircraft
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<AircraftWasm, JsValue> {
        Ok(AircraftWasm {
            inner: Aircraft::new(),
        })
    }

    /// Get aircraft name
    #[wasm_bindgen(js_name = getName)]
    pub fn get_name(&self) -> String {
        self.inner.name.clone()
    }

    /// Set aircraft name
    #[wasm_bindgen(js_name = setName)]
    pub fn set_name(&mut self, name: String) {
        self.inner.name = name;
    }

    /// Get flap cost based on dry MP (for display purposes)
    #[wasm_bindgen(js_name = getControlSurfacesFlapCost)]
    pub fn get_control_surfaces_flap_cost(&self, dry_mp: i16) -> f32 {
        self.inner.controlsurfaces.get_flap_cost(dry_mp)
    }

    /// Get bomb count
    #[wasm_bindgen(js_name = getBombCount)]
    pub fn get_bomb_count(&self) -> i16 {
        self.inner.munitions.get_bomb_count()
    }

    /// Get rocket count
    #[wasm_bindgen(js_name = getRocketCount)]
    pub fn get_rocket_count(&self) -> i16 {
        self.inner.munitions.get_rocket_count()
    }

    /// Get internal bomb storage count
    #[wasm_bindgen(js_name = getInternalBombCount)]
    pub fn get_internal_bomb_count(&self) -> i16 {
        self.inner.munitions.get_internal_bomb_count()
    }

    /// Get maximum bomb size
    #[wasm_bindgen(js_name = getMaxBombSize)]
    pub fn get_max_bomb_size(&self) -> i16 {
        self.inner.munitions.get_max_bomb_size()
    }

    /// Get number of available optimizations
    #[wasm_bindgen(js_name=getOptimizationAvailable)]
    pub fn get_optimization_available(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.optimization.get_unassigned_count()).unwrap()
    }

    /// Duplicate a weapon set at the given index
    #[wasm_bindgen(js_name = duplicateWeaponSet)]
    pub fn duplicate_weapon_set(&mut self, idx: usize) {
        self.inner.weapons.duplicate_set(idx);
        self.inner.part_stats();
    }

    /// Remove a weapon set at the given index
    #[wasm_bindgen(js_name = removeWeaponSet)]
    pub fn remove_weapon_set(&mut self, idx: usize) {
        self.inner.weapons.remove_set(idx);
        self.inner.part_stats();
    }

    /// Get number of weapon sets
    #[wasm_bindgen(js_name = getWeaponSetsCount)]
    pub fn get_weapon_sets_count(&self) -> usize {
        self.inner.weapons.get_weapon_sets().len()
    }

    /// Get WeaponSystem UI bindings for a specific weapon system
    #[wasm_bindgen(js_name = getWeaponSystemBindings)]
    pub fn get_weapon_system_bindings(&self, index: usize) -> JsValue {
        let sets = self.inner.weapons.get_weapon_sets();
        if index < sets.len() {
            let options = sets[index].create_ui_options();
            serde_wasm_bindgen::to_value(&options).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Update WeaponSystem from UI bindings
    #[wasm_bindgen(js_name = setWeaponSystemBindings)]
    pub fn set_weapon_system_bindings(&mut self, index: usize, js_options: JsValue) {
        let sets = self.inner.weapons.get_weapon_sets_mut();
        if index < sets.len() {
            if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
                sets[index].receive_ui_selections(options);
                self.inner.part_stats();
            }
        }
    }

    /// Get stats for a specific weapon system
    #[wasm_bindgen(js_name = getWeaponSystemStats)]
    pub fn get_weapon_system_stats(&mut self, index: usize) -> JsValue {
        let sets = self.inner.weapons.get_weapon_sets_mut();
        if index < sets.len() {
            let stats = sets[index].part_stats();
            serde_wasm_bindgen::to_value(&stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get WeaponSystem derived stats for display
    #[wasm_bindgen(js_name = getWeaponSystemDerivedStats)]
    pub fn get_weapon_system_derived_stats(&self, index: usize) -> JsValue {
        let sets = self.inner.weapons.get_weapon_sets();
        if index < sets.len() {
            let derived_stats = sets[index].get_derived_stats();
            serde_wasm_bindgen::to_value(&derived_stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get WeaponSystem display information for derived stats UI
    #[wasm_bindgen(js_name = getWeaponSystemDisplayInfo)]
    pub fn get_weapon_system_display_info(&self, index: usize) -> JsValue {
        let sets = self.inner.weapons.get_weapon_sets();
        if index < sets.len() {
            let direction_list = self.inner.weapons.get_direction_list();
            let display_info = sets[index].get_display_info(&direction_list);
            serde_wasm_bindgen::to_value(&display_info).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get Weapon UI bindings for a specific weapon in a weapon system
    #[wasm_bindgen(js_name = getWeaponBindings)]
    pub fn get_weapon_bindings(&self, system_index: usize, weapon_index: usize) -> JsValue {
        let sets = self.inner.weapons.get_weapon_sets();
        if system_index < sets.len() {
            let weapons = sets[system_index].get_weapons();
            if weapon_index < weapons.len() {
                let options = weapons[weapon_index].create_ui_options();
                serde_wasm_bindgen::to_value(&options).unwrap()
            } else {
                JsValue::NULL
            }
        } else {
            JsValue::NULL
        }
    }

    /// Update Weapon from UI bindings
    #[wasm_bindgen(js_name = setWeaponBindings)]
    pub fn set_weapon_bindings(
        &mut self,
        system_index: usize,
        weapon_index: usize,
        js_options: JsValue,
    ) {
        let sets = self.inner.weapons.get_weapon_sets_mut();
        if system_index < sets.len() {
            let weapons = sets[system_index].get_weapons_mut();
            if weapon_index < weapons.len() {
                if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
                    weapons[weapon_index].receive_ui_selections(options);
                    self.inner.part_stats();
                }
            }
        }
    }

    /// Get stats for a specific weapon
    #[wasm_bindgen(js_name = getWeaponStats)]
    pub fn get_weapon_stats(&mut self, system_index: usize, weapon_index: usize) -> JsValue {
        let sets = self.inner.weapons.get_weapon_sets_mut();
        if system_index < sets.len() {
            let weapons = sets[system_index].get_weapons_mut();
            if weapon_index < weapons.len() {
                let stats = weapons[weapon_index].part_stats();
                serde_wasm_bindgen::to_value(&stats).unwrap()
            } else {
                JsValue::NULL
            }
        } else {
            JsValue::NULL
        }
    }

    /// Get Frames Flammability
    #[wasm_bindgen(js_name = getFramesFlammable)]
    pub fn get_frames_flammable(&self) -> JsValue {
        let is_flammable = self.inner.frames.get_is_flammable();
        serde_wasm_bindgen::to_value(&is_flammable).unwrap()
    }

    /// Duplicate a section at the given index
    #[wasm_bindgen(js_name = duplicateSection)]
    pub fn duplicate_section(&mut self, index: usize) {
        self.inner.frames.duplicate_section(index, 1);
        self.inner.part_stats();
    }

    /// Delete a section at the given index
    #[wasm_bindgen(js_name = deleteSection)]
    pub fn delete_section(&mut self, index: usize) {
        self.inner.frames.delete_section(index);
        self.inner.part_stats();
    }

    /// Get current aircraft type
    #[wasm_bindgen(js_name = getAircraftType)]
    pub fn get_aircraft_type(&self) -> i16 {
        self.inner.aircraft_type as i16
    }

    /// Set aircraft type (0=Airplane, 1=Helicopter, 2=Autogyro, 3=OrnithopterBasic, 4=OrnithopterFlutter, 5=OrnithopterBuzzer)
    #[wasm_bindgen(js_name = setAircraftType)]
    pub fn set_aircraft_type(&mut self, acft_type: i16) {
        use flyingcircusrust::types::AircraftType;
        self.inner.aircraft_type = AircraftType::from(acft_type);
        self.inner.rotor.set_type(self.inner.aircraft_type);
        self.inner.part_stats();
    }

    /// Get aircraft type names for UI dropdown
    #[wasm_bindgen(js_name = getAircraftTypeNames)]
    pub fn get_aircraft_type_names(&self) -> JsValue {
        let names: Vec<String> = vec![
            translate("AIRPLANE"),
            translate("HELICOPTER"),
            translate("AUTOGYRO"),
            translate("ORNITHOPTER_BASIC"),
            translate("ORNITHOPTER_FLUTTER"),
            translate("ORNITHOPTER_BUZZER"),
        ];
        serde_wasm_bindgen::to_value(&names).unwrap()
    }

    /// Get Radiator UI bindings for a specific radiator
    #[wasm_bindgen(js_name = getRadiatorBindings)]
    pub fn get_radiator_bindings(&self, index: usize) -> JsValue {
        if index < self.inner.engines.radiators.len() {
            let options = self.inner.engines.radiators[index].create_ui_options();
            serde_wasm_bindgen::to_value(&options).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Update Radiator from UI bindings
    #[wasm_bindgen(js_name = setRadiatorBindings)]
    pub fn set_radiator_bindings(&mut self, index: usize, js_options: JsValue) {
        if index < self.inner.engines.radiators.len() {
            if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
                self.inner.engines.radiators[index].receive_ui_selections(options);
                self.inner.part_stats();
            }
        }
    }

    /// Get stats for a specific radiator
    #[wasm_bindgen(js_name = getRadiatorStats)]
    pub fn get_radiator_stats(&mut self, index: usize) -> JsValue {
        if index < self.inner.engines.radiators.len() {
            let stats = self.inner.engines.radiators[index].part_stats();
            serde_wasm_bindgen::to_value(&stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get Engine UI bindings for a specific engine
    #[wasm_bindgen(js_name = getEngineBindings)]
    pub fn get_engine_bindings(&self, index: usize) -> JsValue {
        if index < self.inner.engines.engines.len() {
            let options = self.inner.engines.engines[index].create_ui_options();
            serde_wasm_bindgen::to_value(&options).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Update Engine from UI bindings
    #[wasm_bindgen(js_name = setEngineBindings)]
    pub fn set_engine_bindings(&mut self, index: usize, js_options: JsValue) {
        if index < self.inner.engines.engines.len() {
            if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
                self.inner.engines.engines[index].receive_ui_selections(options);
                self.inner.part_stats();
            }
        }
    }

    /// Get stats for a specific engine
    #[wasm_bindgen(js_name = getEngineStats)]
    pub fn get_engine_stats(&mut self, index: usize) -> JsValue {
        if index < self.inner.engines.engines.len() {
            let stats = self.inner.engines.engines[index].part_stats();
            serde_wasm_bindgen::to_value(&stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get full EngineStats for a specific engine (includes rarity, overspeed, altitude, etc.)
    #[wasm_bindgen(js_name = getEngineFullStats)]
    pub fn get_engine_full_stats(&self, index: usize) -> JsValue {
        if index < self.inner.engines.engines.len() {
            let engine_stats = self.inner.engines.engines[index].get_engine_stats();
            serde_wasm_bindgen::to_value(engine_stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get derived stats for a specific engine (calculated values like reliability)
    #[wasm_bindgen(js_name = getEngineDerivedStats)]
    pub fn get_engine_derived_stats(&self, index: usize) -> JsValue {
        if index < self.inner.engines.engines.len() {
            let derived_stats = self.inner.engines.engines[index].get_derived_stats();
            serde_wasm_bindgen::to_value(&derived_stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get all available engine list names
    #[wasm_bindgen(js_name = getEngineNamesOfLists)]
    pub fn get_engine_list_names(&self) -> JsValue {
        use flyingcircusrust::engine::Engine;
        let names = Engine::get_available_lists();
        serde_wasm_bindgen::to_value(&names).unwrap()
    }

    /// Get all engine names in a specific list
    #[wasm_bindgen(js_name = getEngineNamesInList)]
    pub fn get_engine_names_in_list(&self, list_name: &str) -> JsValue {
        use flyingcircusrust::engine::Engine;
        let names = Engine::get_engines_in_list(list_name);
        serde_wasm_bindgen::to_value(&names).unwrap()
    }

    /// Add an engine to a specific list
    /// Creates the list if it doesn't exist
    #[wasm_bindgen(js_name = addEngineToList)]
    pub fn add_engine_to_list(&self, list_name: &str, engine_data: JsValue) -> Result<(), JsValue> {
        use flyingcircusrust::engine_list;

        let engine: flyingcircusrust::engine::EngineInputs =
            serde_wasm_bindgen::from_value(engine_data).map_err(|e| {
                JsValue::from_str(&format!("Failed to deserialize engine: {:?}", e))
            })?;

        engine_list::add_engine_to_list(list_name, engine)
            .map_err(|e| JsValue::from_str(e.as_str()))?;

        Ok(())
    }

    /// Get all engines in a specific list with full data
    #[wasm_bindgen(js_name = getEnginesInList)]
    pub fn get_engines_in_list(&self, list_name: &str) -> JsValue {
        use flyingcircusrust::engine_list;

        let engines = engine_list::get_engines_in_list(list_name);
        serde_wasm_bindgen::to_value(&engines).unwrap()
    }

    /// Clear all engines from a non-constant list
    #[wasm_bindgen(js_name = clearEngineList)]
    pub fn clear_engine_list(&self, list_name: &str) -> Result<(), JsValue> {
        use flyingcircusrust::engine_list;

        engine_list::clear_list(list_name).map_err(|e| JsValue::from_str(e.as_str()))?;

        Ok(())
    }
}

/// Calculate engine stats from EngineInputs
/// This is a standalone function that can be used by the engine builder UI
/// without needing to add the engine to the aircraft.
/// Accepts EngineInputs as JSON and returns EngineStats as JSON.
#[wasm_bindgen(js_name = calculateEngineStats)]
pub fn calculate_engine_stats(engine_data: JsValue) -> Result<JsValue, JsValue> {
    let engine: flyingcircusrust::engine::EngineInputs =
        serde_wasm_bindgen::from_value(engine_data)
            .map_err(|e| JsValue::from_str(&format!("Failed to deserialize engine: {:?}", e)))?;

    let stats = engine.part_stats();

    Ok(serde_wasm_bindgen::to_value(&stats).unwrap())
}

// ============================================================================
// Engine Builder Helper Functions (Module-level, static)
// ============================================================================

/// Get propeller engine era names
#[wasm_bindgen(js_name = getTurbineEras)]
pub fn get_turbine_eras() -> JsValue {
    let eras: Vec<String> = ERA_TABLE.iter().map(|e| e.name.to_string()).collect();
    serde_wasm_bindgen::to_value(&eras).unwrap()
}

#[wasm_bindgen(js_name = getPropellerEras)]
pub fn get_propeller_eras() -> JsValue {
    let eras: Vec<String> = ERA_TABLE.iter().map(|s| translate(s.name)).collect();
    serde_wasm_bindgen::to_value(&eras).unwrap()
}

/// Get propeller cooling type names
#[wasm_bindgen(js_name = getPropellerCoolingTypes)]
pub fn get_propeller_cooling_types() -> JsValue {
    let types: Vec<String> = COOLING_TABLE.iter().map(|s| translate(s.name)).collect();
    serde_wasm_bindgen::to_value(&types).unwrap()
}

/// Get propeller compressor type names
#[wasm_bindgen(js_name = getPropellerCompressorTypes)]
pub fn get_propeller_compressor_types() -> JsValue {
    let types: Vec<String> = vec!["None", "Altitude Throttle", "Supercharger", "Turbocharger"]
        .iter()
        .map(|s| translate(s))
        .collect();
    serde_wasm_bindgen::to_value(&types).unwrap()
}

/// Get propeller upgrade names
#[wasm_bindgen(js_name = getPropellerUpgrades)]
pub fn get_propeller_upgrades() -> JsValue {
    let upgrades: Vec<String> = UPGRADES[1..].iter().map(|s| translate(s.name)).collect();
    serde_wasm_bindgen::to_value(&upgrades).unwrap()
}

/// Get pulsejet valve type names
#[wasm_bindgen(js_name = getPulsejetValveTypes)]
pub fn get_pulsejet_valve_types() -> JsValue {
    let types: Vec<String> = VALVE_TABLE.iter().map(|s| translate(s.name)).collect();
    serde_wasm_bindgen::to_value(&types).unwrap()
}

/// Get turbine type names
#[wasm_bindgen(js_name = getTurbineTypes)]
pub fn get_turbine_types() -> JsValue {
    let types: Vec<String> = TYPE_TABLE.iter().map(|s| translate(s.name)).collect();
    serde_wasm_bindgen::to_value(&types).unwrap()
}

/// Get electric motor winding names
#[wasm_bindgen(js_name = getElectricWindings)]
pub fn get_electric_windings() -> JsValue {
    let windings: Vec<String> = WINDING_TABLE.iter().map(|s| translate(s.name)).collect();
    serde_wasm_bindgen::to_value(&windings).unwrap()
}

// Back to AircraftWasm implementation
#[wasm_bindgen]
impl AircraftWasm {
    /// Get the selected engine list name for a specific engine
    #[wasm_bindgen(js_name = getEngineSelectedList)]
    pub fn get_engine_selected_list(&self, index: usize) -> String {
        if index < self.inner.engines.engines.len() {
            self.inner.engines.engines[index]
                .get_selected_list()
                .to_string()
        } else {
            String::new()
        }
    }

    /// Get the selected engine name for a specific engine
    #[wasm_bindgen(js_name = getEngineSelectedName)]
    pub fn get_engine_selected_name(&self, index: usize) -> String {
        if index < self.inner.engines.engines.len() {
            self.inner.engines.engines[index]
                .get_selected_engine_name()
                .to_string()
        } else {
            String::new()
        }
    }

    /// Set the selected engine list for a specific engine
    #[wasm_bindgen(js_name = setEngineSelectedList)]
    pub fn set_engine_selected_list(&mut self, index: usize, list_name: &str) {
        if index < self.inner.engines.engines.len() {
            self.inner.engines.engines[index].set_selected_list(list_name);
            self.inner.part_stats();
        }
    }

    /// Set the selected engine by index within its current list
    #[wasm_bindgen(js_name = setEngineSelectedIndex)]
    pub fn set_engine_selected_index(&mut self, index: usize, engine_index: usize) {
        if index < self.inner.engines.engines.len() {
            self.inner.engines.engines[index].set_selected_index(engine_index);
            self.inner.part_stats();
        }
    }

    /// Set the number of engines
    #[wasm_bindgen(js_name = setNumberOfEngines)]
    pub fn set_number_of_engines(&mut self, num: usize) {
        self.inner.engines.set_number_of_engines(num);
        self.inner.part_stats();
    }

    /// Set the number of radiators
    #[wasm_bindgen(js_name = setNumberOfRadiators)]
    pub fn set_number_of_radiators(&mut self, num: usize) {
        self.inner.engines.set_number_of_radiators(num);
        self.inner.part_stats();
    }

    /// Get the number of engines
    #[wasm_bindgen(js_name = getNumberOfEngines)]
    pub fn get_number_of_engines(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.engines.get_number_engines()).unwrap()
    }

    /// Get the number of radiators
    #[wasm_bindgen(js_name = getNumberOfRadiators)]
    pub fn get_number_of_radiators(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.engines.get_num_radiators()).unwrap()
    }

    /// Get Radiator flammability
    #[wasm_bindgen(js_name = getRadiatorFlammable)]
    pub fn get_radiator_flammable(&self, index: usize) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.engines.radiators[index].get_is_flammable())
            .unwrap()
    }

    /// Calculate all aircraft statistics
    #[wasm_bindgen(js_name = calculateStats)]
    pub fn calculate_stats(&mut self) {
        self.inner.part_stats();
    }

    /// Get derived stats (performance characteristics)
    #[wasm_bindgen(js_name = getDerivedStats)]
    pub fn get_derived_stats(&mut self) -> JsValue {
        let stats = self.inner.get_derived_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get base stats
    #[wasm_bindgen(js_name = getStats)]
    pub fn get_stats(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.stats).unwrap()
    }

    /// Check if used modifiers are at default (no damage/wear)
    #[wasm_bindgen(js_name = getUsedIsDefault)]
    pub fn get_used_is_default(&self) -> bool {
        self.inner.get_used_is_default()
    }

    /// Check if control surfaces are at default configuration
    #[wasm_bindgen(js_name = getControlSurfacesIsDefault)]
    pub fn get_control_surfaces_is_default(&self) -> bool {
        self.inner.get_control_surfaces_is_default()
    }

    /// Check if landing gear is at default configuration
    #[wasm_bindgen(js_name = getLandingGearIsDefault)]
    pub fn get_landing_gear_is_default(&self) -> bool {
        self.inner.get_landing_gear_is_default()
    }

    /// Check if optimization is at default configuration
    #[wasm_bindgen(js_name = getOptimizationIsDefault)]
    pub fn get_optimization_is_default(&self) -> bool {
        self.inner.get_optimization_is_default()
    }

    /// Check if stabilizers are at default configuration
    #[wasm_bindgen(js_name = getStabilizersIsDefault)]
    pub fn get_stabilizers_is_default(&self) -> bool {
        self.inner.get_stabilizers_is_default()
    }

    /// Check if alter (custom parts) are at default configuration
    #[wasm_bindgen(js_name = getAlterIsDefault)]
    pub fn get_alter_is_default(&self) -> bool {
        self.inner.get_alter_is_default()
    }

    /// Check if passengers are at default configuration
    #[wasm_bindgen(js_name = getPassengersIsDefault)]
    pub fn get_passengers_is_default(&self) -> bool {
        self.inner.get_passengers_is_default()
    }

    /// Get the name of the currently selected era
    #[wasm_bindgen(js_name = getEraText)]
    pub fn get_era_text(&self) -> String {
        self.inner.get_era_text()
    }

    /// Check if aircraft has flammable components
    #[wasm_bindgen(js_name = getIsFlammable)]
    pub fn get_is_flammable(&self) -> bool {
        self.inner.get_is_flammable()
    }

    /// Get landing gear type name
    #[wasm_bindgen(js_name = getGearName)]
    pub fn get_gear_name(&self) -> String {
        self.inner.get_gear_name()
    }

    /// Get minimum operational altitude
    #[wasm_bindgen(js_name = getMinAltitude)]
    pub fn get_min_altitude(&self) -> i16 {
        self.inner.get_min_altitude()
    }

    /// Get maximum operational altitude
    #[wasm_bindgen(js_name = getMaxAltitude)]
    pub fn get_max_altitude(&self) -> i16 {
        self.inner.get_max_altitude()
    }

    /// Get reliability strings from all engines
    #[wasm_bindgen(js_name = getReliabilityList)]
    pub fn get_reliability_list(&self) -> Vec<String> {
        self.inner.get_reliability_list()
    }

    /// Get escape values from all cockpit positions
    #[wasm_bindgen(js_name = getEscapeList)]
    pub fn get_escape_list(&self) -> Vec<i16> {
        self.inner.get_escape_list()
    }

    /// Get crash safety values from all cockpit positions
    #[wasm_bindgen(js_name = getCrashList)]
    pub fn get_crash_list(&self) -> Vec<i16> {
        self.inner.get_crash_list()
    }

    /// Get flight stress values from all cockpit positions
    #[wasm_bindgen(js_name = getStressList)]
    pub fn get_stress_list(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.get_stress_list()).unwrap()
    }

    /// Get visibility values from all cockpit positions
    #[wasm_bindgen(js_name = getVisibilityList)]
    pub fn get_visibility_list(&self) -> Vec<f64> {
        self.inner
            .get_visibility_list()
            .into_iter()
            .map(visibility_for_display)
            .collect()
    }

    /// Get attack modifier values from all cockpit positions
    #[wasm_bindgen(js_name = getAttackList)]
    pub fn get_attack_list(&self) -> Vec<i16> {
        self.inner.get_attack_list()
    }

    /// Get communication system name
    #[wasm_bindgen(js_name = getCommunicationName)]
    pub fn get_communication_name(&self) -> String {
        self.inner.get_communication_name()
    }

    /// Get number of cockpit positions
    #[wasm_bindgen(js_name = getCockpitsCount)]
    pub fn get_cockpits_count(&self) -> i16 {
        self.inner.get_cockpits_count()
    }

    /// Get total passenger capacity (seats + beds)
    #[wasm_bindgen(js_name = getPassengersCount)]
    pub fn get_passengers_count(&self) -> i16 {
        self.inner.get_passengers_count()
    }

    /// Get electrical systems data
    #[wasm_bindgen(js_name = getElectrics)]
    pub fn get_electrics(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.get_electrics()).unwrap()
    }

    /// Get number of wings
    #[wasm_bindgen(js_name = getWingCount)]
    pub fn get_wing_count(&self) -> usize {
        self.inner.wings.get_wing_list().len()
    }

    /// Get wing deck at index
    #[wasm_bindgen(js_name = getWingDeck)]
    pub fn get_wing_deck(&self, index: usize) -> Option<usize> {
        self.inner.wings.get_wing_list().get(index).map(|w| w.deck)
    }

    /// Check if wings are in tandem configuration
    #[wasm_bindgen(js_name = getWingsTandem)]
    pub fn get_wings_tandem(&self) -> bool {
        self.inner.wings.get_tandem()
    }

    /// Check if wings are closed
    #[wasm_bindgen(js_name = getWingsClosed)]
    pub fn get_wings_closed(&self) -> bool {
        self.inner.wings.get_closed()
    }

    /// Get sesquiplane info: (is_sesquiplane, biggest_deck, super_small)
    #[wasm_bindgen(js_name = getWingsSesquiplane)]
    pub fn get_wings_sesquiplane(&self) -> JsValue {
        let (is_sesqui, deck, super_small) = self.inner.wings.get_is_sesquiplane();
        serde_wasm_bindgen::to_value(&serde_json::json!({
            "is": is_sesqui,
            "deck": deck,
            "super_small": super_small
        }))
        .unwrap()
    }

    /// Check if frames are flying wing
    #[wasm_bindgen(js_name = getFramesFlyingWing)]
    pub fn get_frames_flying_wing(&self) -> bool {
        self.inner.frames.get_flying_wing()
    }

    /// Check if frames can be flying wing (lifting body)
    #[wasm_bindgen(js_name = getFramesCanFlyingWing)]
    pub fn get_frames_can_flying_wing(&self) -> bool {
        self.inner.frames.can_flying_wing()
    }

    /// Get list of vital component names
    #[wasm_bindgen(js_name = vitalComponentList)]
    pub fn vital_component_list(&self) -> Vec<String> {
        self.inner.vital_component_list()
    }

    // ========== Custom Parts (Alter) Methods ==========

    /// Get list of all custom parts
    #[wasm_bindgen(js_name = getCustomParts)]
    pub fn get_custom_parts(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.alter.get_parts()).unwrap()
    }

    /// Add or update a custom part
    #[wasm_bindgen(js_name = addCustomPart)]
    pub fn add_custom_part(&mut self, name: String, stats_js: JsValue) {
        if let Ok(stats) = serde_wasm_bindgen::from_value(stats_js) {
            self.inner.alter.add_part(name, stats);
            self.inner.part_stats();
        }
    }

    /// Remove a custom part by name
    #[wasm_bindgen(js_name = removeCustomPart)]
    pub fn remove_custom_part(&mut self, name: String) {
        self.inner.alter.remove_part(&name);
        self.inner.part_stats();
    }

    /// Set quantity for a custom part by index
    #[wasm_bindgen(js_name = setCustomPartQty)]
    pub fn set_custom_part_qty(&mut self, idx: usize, qty: i16) {
        self.inner.alter.set_used_part(idx, qty);
        self.inner.part_stats();
    }

    /// Check if custom parts are in default state (all quantities zero)
    #[wasm_bindgen(js_name = isCustomPartsDefault)]
    pub fn is_custom_parts_default(&self) -> bool {
        self.inner.alter.is_default()
    }

    /// Get custom parts stats
    #[wasm_bindgen(js_name = getCustomPartsStats)]
    pub fn get_custom_parts_stats(&mut self) -> JsValue {
        let stats = self.inner.alter.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Serialize to JSON string (for saved data)
    #[wasm_bindgen(js_name = toJSON)]
    pub fn serialize_to_json(&self) -> Result<String, JsValue> {
        Ok(self.inner.to_json().to_string())
    }

    /// Deserialize from JSON string (for saved data)
    #[wasm_bindgen(js_name = fromJSON)]
    pub fn deserialize_from_json(&mut self, js_str: String) {
        let json: serde_json::Value = serde_json::from_str(js_str.as_str()).unwrap();
        let ver = json["version"].as_str().unwrap().parse::<f32>().unwrap();
        let mut aircraft = Aircraft::new();
        aircraft.from_json(&json, ver);
        self.inner = aircraft;
        let _ = self.inner.part_stats();
    }

    /// Serialize to LZ-compressed string (for URLs)
    #[wasm_bindgen(js_name = serializeToLZString)]
    pub fn serialize_to_lz_string(&self) -> Result<String, JsValue> {
        let mut s = Serializer::new();
        self.inner
            .serialize(&mut s)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        s.compress_to_lz_string()
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
    }

    /// Deserialize from LZ-compressed string (for URLs)
    #[wasm_bindgen(js_name = deserializeFromLZString)]
    pub fn deserialize_from_lz_string(lz_str: &str) -> Result<AircraftWasm, JsValue> {
        let mut d = Deserializer::from_lz_string(lz_str)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        let mut aircraft = Aircraft::new();
        aircraft
            .deserialize(&mut d)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        Ok(AircraftWasm { inner: aircraft })
    }

    /// Serialize to LZ-compressed string in the Helicopter format (no wings / control surfaces).
    /// Pair with deserializeHeliFromLZString so helicopter URLs round-trip correctly.
    #[wasm_bindgen(js_name = serializeHeliToLZString)]
    pub fn serialize_heli_to_lz_string(&self) -> Result<String, JsValue> {
        let mut s = Serializer::new();
        self.inner
            .serialize_heli(&mut s)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        s.compress_to_lz_string()
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
    }

    /// Deserialize from LZ-compressed string saved by the old TypeScript Helicopter builder.
    /// That format omits wings and control surfaces; use this for old helicopter bookmark URLs.
    #[wasm_bindgen(js_name = deserializeHeliFromLZString)]
    pub fn deserialize_heli_from_lz_string(lz_str: &str) -> Result<AircraftWasm, JsValue> {
        let mut d = Deserializer::from_lz_string(lz_str)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        let mut aircraft = Aircraft::new();
        aircraft
            .deserialize_heli(&mut d)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        Ok(AircraftWasm { inner: aircraft })
    }

    #[wasm_bindgen(js_name = reset)]
    pub fn reset_aircraft(&mut self) {
        use flyingcircusrust::types::AircraftType;
        if self.inner.aircraft_type == AircraftType::Helicopter {
            let lz_str= "AAEAjATAdA7MAIAhAhgZwJYGMAEAJApgDZYD2ADgC74BOwAgPcEwGBNsvtsic+MAoAZUwALavnQAjGtgAqUAJIANbGABsABmFlgAZGABcUEwbAAQJwAQwALBsAkL0dN4wPk-fuGgkWMnS5SioaWsAAwADq4fKuQqLiUtSyCspqmtpM5nQAggCBAJkAWQACeYXADnQA-KgAzDWVAAFMlQAxADMAs2aMAHhG7ObAAP9DwAAwHu7ck5ODHnOcJowOM5wrq2wAoBvcSxv9oexW+4eOAOAbp0xX+7wMoQzMe8b0S3QjjI7Pkwzf7IcmIA";
            let mut d = Deserializer::from_lz_string(lz_str).unwrap();
            self.inner.deserialize_heli(&mut d).unwrap();
        } else {
            let lz_str = "AAEAjATAdA7MCwAhAhgZwJYGMAEj0AcAbZAOwFNgBAK4WgMFsfqcZBfZoHQAlACwHsSybAFl+AF34AnAEbIArtgBaYMNgAcABl75gAJGABcYACBa1GkzYAIVhw4B-h8FsAoex8-ngPAUNES0nKKKmpaOsAAwADq0QCSPnyCwmKSsgrKqhraurRmlACCUABmxQACAAmMAJBUAPwAAbSNzU32bEwWTp5mHL1RXvb9PZ2mjLa2HhPskXaj3p6zNZaDy6ssAKCe1BZsFuszTJMHSxwA4CdMpwf21JHUdPuMO-uvHk83B0A";
            let mut d = Deserializer::from_lz_string(lz_str).unwrap();
            self.inner.deserialize(&mut d).unwrap();
        };
        let _ = self.inner.part_stats();
    }

    /// Get stats for a specific cockpit
    #[wasm_bindgen(js_name = getCockpitStats)]
    pub fn get_cockpit_stats(&mut self, index: usize) -> JsValue {
        if index < self.inner.cockpits.positions.len() {
            let stats = self.inner.cockpits.positions[index].part_stats();
            serde_wasm_bindgen::to_value(&stats).unwrap()
        } else {
            JsValue::NULL
        }
    }

    /// Get derived stats for a specific cockpit (flight stress, escape, visibility)
    #[wasm_bindgen(js_name = getCockpitDerivedStats)]
    pub fn get_cockpit_derived_stats(&self, index: usize) -> JsValue {
        if index < self.inner.cockpits.positions.len() {
            let cockpit = &self.inner.cockpits.positions[index];
            let flight_stress = cockpit.get_flight_stress();
            let escape = cockpit.get_escape();
            let visibility = cockpit.get_visibility();

            let result = CockpitDerived {
                flight_stress_norm: flight_stress.0,
                flight_stress_cp: flight_stress.1,
                pos_escape: escape,
                pos_visibility: visibility_for_display(visibility),
            };
            serde_wasm_bindgen::to_value(&result).unwrap()
        } else {
            JsValue::NULL
        }
    }
}
