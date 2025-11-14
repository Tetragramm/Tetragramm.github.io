use flyingcircusrust::aircraft::Aircraft;
use flyingcircusrust::part::Part;
use flyingcircusrust::serialization::{Deserializer, Serializable, Serializer};
use flyingcircusrust::types::DerivedStats;
use flyingcircusrust::UIBindings;
use rust_i18n::t;
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
    pos_visibility: i16,
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
}

/// Main Aircraft wrapper for WASM
#[wasm_bindgen]
pub struct AircraftWasm {
    inner: Aircraft,
}

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

    /// Get Era UI bindings (includes localized strings)
    #[wasm_bindgen(js_name = getEraBindings)]
    pub fn get_era_bindings(&self) -> JsValue {
        let options = self.inner.era.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Era from UI bindings
    #[wasm_bindgen(js_name = setEraBindings)]
    pub fn set_era_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.era.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for the selected era
    #[wasm_bindgen(js_name = getEraStats)]
    pub fn get_era_stats(&mut self) -> JsValue {
        let stats = self.inner.era.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Propeller UI bindings (includes localized strings)
    #[wasm_bindgen(js_name = getPropellerBindings)]
    pub fn get_propeller_bindings(&self) -> JsValue {
        let options = self.inner.propeller.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Propeller from UI bindings
    #[wasm_bindgen(js_name = setPropellerBindings)]
    pub fn set_propeller_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.propeller.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for the selected propeller
    #[wasm_bindgen(js_name = getPropellerStats)]
    pub fn get_propeller_stats(&mut self) -> JsValue {
        let stats = self.inner.propeller.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Passengers UI bindings
    #[wasm_bindgen(js_name = getPassengersBindings)]
    pub fn get_passengers_bindings(&self) -> JsValue {
        let options = self.inner.passengers.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Passengers from UI bindings
    #[wasm_bindgen(js_name = setPassengersBindings)]
    pub fn set_passengers_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.passengers.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for passengers
    #[wasm_bindgen(js_name = getPassengersStats)]
    pub fn get_passengers_stats(&mut self) -> JsValue {
        let stats = self.inner.passengers.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Fuel UI bindings
    #[wasm_bindgen(js_name = getFuelBindings)]
    pub fn get_fuel_bindings(&self) -> JsValue {
        let options = self.inner.fuel.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Fuel from UI bindings
    #[wasm_bindgen(js_name = setFuelBindings)]
    pub fn set_fuel_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.fuel.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for fuel
    #[wasm_bindgen(js_name = getFuelStats)]
    pub fn get_fuel_stats(&mut self) -> JsValue {
        let stats = self.inner.fuel.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Accessories UI bindings
    #[wasm_bindgen(js_name = getAccessoriesBindings)]
    pub fn get_accessories_bindings(&self) -> JsValue {
        let options = self.inner.accessories.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Accessories from UI bindings
    #[wasm_bindgen(js_name = setAccessoriesBindings)]
    pub fn set_accessories_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.accessories.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for accessories
    #[wasm_bindgen(js_name = getAccessoriesStats)]
    pub fn get_accessories_stats(&mut self) -> JsValue {
        let stats = self.inner.accessories.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Cargo UI bindings
    #[wasm_bindgen(js_name = getCargoBindings)]
    pub fn get_cargo_bindings(&self) -> JsValue {
        let options = self.inner.cargo.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Cargo from UI bindings
    #[wasm_bindgen(js_name = setCargoBindings)]
    pub fn set_cargo_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.cargo.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for cargo
    #[wasm_bindgen(js_name = getCargoStats)]
    pub fn get_cargo_stats(&mut self) -> JsValue {
        let stats = self.inner.cargo.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get ControlSurfaces UI bindings
    #[wasm_bindgen(js_name = getControlSurfacesBindings)]
    pub fn get_control_surfaces_bindings(&self) -> JsValue {
        let options = self.inner.controlsurfaces.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update ControlSurfaces from UI bindings
    #[wasm_bindgen(js_name = setControlSurfacesBindings)]
    pub fn set_control_surfaces_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.controlsurfaces.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for control surfaces
    #[wasm_bindgen(js_name = getControlSurfacesStats)]
    pub fn get_control_surfaces_stats(&mut self) -> JsValue {
        let stats = self.inner.controlsurfaces.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get LandingGear UI bindings
    #[wasm_bindgen(js_name = getLandingGearBindings)]
    pub fn get_landing_gear_bindings(&self) -> JsValue {
        let options = self.inner.gear.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update LandingGear from UI bindings
    #[wasm_bindgen(js_name = setLandingGearBindings)]
    pub fn set_landing_gear_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.gear.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for landing gear
    #[wasm_bindgen(js_name = getLandingGearStats)]
    pub fn get_landing_gear_stats(&mut self) -> JsValue {
        let stats = self.inner.gear.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Munitions UI bindings
    #[wasm_bindgen(js_name = getMunitionsBindings)]
    pub fn get_munitions_bindings(&self) -> JsValue {
        let options = self.inner.munitions.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Munitions from UI bindings
    #[wasm_bindgen(js_name = setMunitionsBindings)]
    pub fn set_munitions_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.munitions.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for munitions
    #[wasm_bindgen(js_name = getMunitionsStats)]
    pub fn get_munitions_stats(&mut self) -> JsValue {
        let stats = self.inner.munitions.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
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

    /// Get Optimization UI bindings
    #[wasm_bindgen(js_name = getOptimizationBindings)]
    pub fn get_optimization_bindings(&self) -> JsValue {
        let options = self.inner.optimization.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Optimization from UI bindings
    #[wasm_bindgen(js_name = setOptimizationBindings)]
    pub fn set_optimization_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.optimization.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for optimization
    #[wasm_bindgen(js_name = getOptimizationStats)]
    pub fn get_optimization_stats(&mut self) -> JsValue {
        let stats = self.inner.optimization.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get number of available optimizations
    #[wasm_bindgen(js_name=getOptimizationAvailable)]
    pub fn get_optimization_available(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.optimization.get_unassigned_count()).unwrap()
    }

    /// Get Used Part UI bindings
    #[wasm_bindgen(js_name = getUsedBindings)]
    pub fn get_used_bindings(&self) -> JsValue {
        let options = self.inner.used.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Used Part from UI bindings
    #[wasm_bindgen(js_name = setUsedBindings)]
    pub fn set_used_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.used.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for used part
    #[wasm_bindgen(js_name = getUsedStats)]
    pub fn get_used_stats(&mut self) -> JsValue {
        let stats = self.inner.used.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Weapons UI bindings (container with weapon system count and brace count)
    #[wasm_bindgen(js_name = getWeaponsBindings)]
    pub fn get_weapons_bindings(&self) -> JsValue {
        let options = self.inner.weapons.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Weapons from UI bindings
    #[wasm_bindgen(js_name = setWeaponsBindings)]
    pub fn set_weapons_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.weapons.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for weapons
    #[wasm_bindgen(js_name = getWeaponsStats)]
    pub fn get_weapons_stats(&mut self) -> JsValue {
        let stats = self.inner.weapons.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
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

    /// Get Reinforcements UI bindings
    #[wasm_bindgen(js_name = getReinforcementsBindings)]
    pub fn get_reinforcements_bindings(&self) -> JsValue {
        let options = self.inner.reinforcements.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Reinforcements from UI bindings
    #[wasm_bindgen(js_name = setReinforcementsBindings)]
    pub fn set_reinforcements_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.reinforcements.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for reinforcements
    #[wasm_bindgen(js_name = getReinforcementsStats)]
    pub fn get_reinforcements_stats(&mut self) -> JsValue {
        let stats = self.inner.reinforcements.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Stabilizers UI bindings
    #[wasm_bindgen(js_name = getStabilizersBindings)]
    pub fn get_stabilizers_bindings(&self) -> JsValue {
        let options = self.inner.stabilizers.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Stabilizers from UI bindings
    #[wasm_bindgen(js_name = setStabilizersBindings)]
    pub fn set_stabilizers_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.stabilizers.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for stabilizers
    #[wasm_bindgen(js_name = getStabilizersStats)]
    pub fn get_stabilizers_stats(&mut self) -> JsValue {
        let stats = self.inner.stabilizers.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Frames Flammability
    #[wasm_bindgen(js_name = getFramesFlammable)]
    pub fn get_frames_flammable(&self) -> JsValue {
        let is_flammable = self.inner.frames.get_is_flammable();
        serde_wasm_bindgen::to_value(&is_flammable).unwrap()
    }

    /// Get Frames UI bindings
    #[wasm_bindgen(js_name = getFramesBindings)]
    pub fn get_frames_bindings(&self) -> JsValue {
        let options = self.inner.frames.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Frames from UI bindings
    #[wasm_bindgen(js_name = setFramesBindings)]
    pub fn set_frames_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.frames.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for frames
    #[wasm_bindgen(js_name = getFramesStats)]
    pub fn get_frames_stats(&mut self) -> JsValue {
        let stats = self.inner.frames.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
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

    /// Get Wings UI bindings
    #[wasm_bindgen(js_name = getWingsBindings)]
    pub fn get_wings_bindings(&self) -> JsValue {
        let options = self.inner.wings.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Wings from UI bindings
    #[wasm_bindgen(js_name = setWingsBindings)]
    pub fn set_wings_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.wings.receive_ui_selections(options);
            self.inner.part_stats();
        }
    }

    /// Get stats for wings
    #[wasm_bindgen(js_name = getWingsStats)]
    pub fn get_wings_stats(&mut self) -> JsValue {
        let stats = self.inner.wings.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get Engines UI bindings (container with asymmetric flag and counts)
    #[wasm_bindgen(js_name = getEnginesBindings)]
    pub fn get_engines_bindings(&self) -> JsValue {
        let options = self.inner.engines.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Engines from UI bindings
    #[wasm_bindgen(js_name = setEnginesBindings)]
    pub fn set_engines_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.engines.receive_ui_selections(options);
            self.inner.part_stats();
        }
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

    /// Get stats for a all engines
    #[wasm_bindgen(js_name = getEnginesStats)]
    pub fn get_engines_stats(&mut self) -> JsValue {
        let stats = self.inner.engines.part_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
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

    /// Get flight stress values from all cockpit positions
    #[wasm_bindgen(js_name = getStressList)]
    pub fn get_stress_list(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.get_stress_list()).unwrap()
    }

    /// Get visibility values from all cockpit positions
    #[wasm_bindgen(js_name = getVisibilityList)]
    pub fn get_visibility_list(&self) -> Vec<i16> {
        self.inner.get_visibility_list()
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

    /// Get list of vital component names
    #[wasm_bindgen(js_name = vitalComponentList)]
    pub fn vital_component_list(&self) -> Vec<String> {
        self.inner.vital_component_list()
    }

    /// Serialize aircraft to bytes
    #[wasm_bindgen(js_name = serialize)]
    pub fn serialize(&self) -> String {
        let mut s = Serializer::new();
        self.inner.serialize(&mut s).unwrap();
        s.compress_to_lz_string().unwrap()
    }

    /// Deserialize aircraft from bytes
    #[wasm_bindgen(js_name = deserialize)]
    pub fn deserialize(data: &str) -> Result<AircraftWasm, JsValue> {
        let mut d = Deserializer::from_lz_string(data)
            .map_err(|_| JsValue::from_str("Failed to Deserialize"))?;
        let mut aircraft = Aircraft::new();
        aircraft
            .deserialize(&mut d)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        Ok(AircraftWasm { inner: aircraft })
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

    /// Get Cockpits UI bindings (includes localized strings)
    #[wasm_bindgen(js_name = getCockpitsBindings)]
    pub fn get_cockpits_bindings(&self) -> JsValue {
        let options = self.inner.cockpits.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Cockpits from UI bindings
    #[wasm_bindgen(js_name = setCockpitsBindings)]
    pub fn set_cockpits_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.cockpits.receive_ui_selections(options);
            self.inner.part_stats();
        }
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
                pos_visibility: visibility,
            };
            serde_wasm_bindgen::to_value(&result).unwrap()
        } else {
            JsValue::NULL
        }
    }
}
