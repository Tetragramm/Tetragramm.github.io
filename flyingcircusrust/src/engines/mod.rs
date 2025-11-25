use std::rc::Rc;

use crate::{
    engine::Engine,
    propeller::{DriveType, EngineInfo},
    radiator::{Radiator, RadiatorCoolantEntry, RadiatorEntry, RadiatorMountEntry},
    stats::Stats,
    types::AircraftType,
};

mod json;
mod part;
mod serialization;
mod ui;

pub struct MountEntry {
    pub name: String,
    pub stats: Stats,
    pub strain_factor: f32,
    pub drag_factor: f32,
    pub power_factor: f32,
    pub mount_type: MountType,
    pub require_extended_driveshafts: bool,
    pub require_tail: bool,
    pub helicopter: bool,
    pub turbine: bool,
    pub pushpull: bool,
}

#[derive(PartialEq, Eq)]
pub enum MountType {
    Fuselage,
    Pod,
    Wing,
}

pub struct CowlEntry {
    pub name: String,
    pub stats: Stats,
    pub drag_factor: f32,
    pub mass_per_drag: f32,
    pub for_air_cooled: bool,
    pub for_liquid_cooled: bool,
    pub for_rotary: bool,
}

#[derive(Default)]
pub struct SpinnerInfo {
    pub have: bool,
    pub spin_count: i16,
    pub arty_spin_count: i16,
}

pub struct Engines {
    pub engines: Vec<Engine>,
    pub radiators: Vec<Radiator>,
    pub is_asymmetric: bool,

    pub mounts: Rc<Vec<MountEntry>>,
    pub cowls: Rc<Vec<CowlEntry>>,
    pub radiator_types: Rc<Vec<RadiatorEntry>>,
    pub radiator_mounts: Rc<Vec<RadiatorMountEntry>>,
    pub radiator_coolants: Rc<Vec<RadiatorCoolantEntry>>,
}

impl Engines {
    pub fn new(
        mounts: Vec<MountEntry>,
        cowls: Vec<CowlEntry>,
        radiator_types: Vec<RadiatorEntry>,
        radiator_mounts: Vec<RadiatorMountEntry>,
        radiator_coolants: Vec<RadiatorCoolantEntry>,
    ) -> Engines {
        Engines {
            engines: Vec::new(),
            radiators: Vec::new(),
            is_asymmetric: false,
            mounts: Rc::new(mounts),
            cowls: Rc::new(cowls),
            radiator_types: Rc::new(radiator_types),
            radiator_mounts: Rc::new(radiator_mounts),
            radiator_coolants: Rc::new(radiator_coolants),
        }
    }

    // Helper methods to access engines and radiators for UI
    pub fn get_number_engines(&self) -> usize {
        let mut count = 0;
        for e in &self.engines {
            if !e.get_generator() {
                count += 1;
            }
        }
        count
    }

    pub fn get_engine(&self, index: usize) -> Option<&Engine> {
        self.engines.get(index)
    }

    pub fn get_engine_mut(&mut self, index: usize) -> Option<&mut Engine> {
        self.engines.get_mut(index)
    }

    pub fn get_radiator(&self, index: usize) -> Option<&Radiator> {
        self.radiators.get(index)
    }

    pub fn get_radiator_mut(&mut self, index: usize) -> Option<&mut Radiator> {
        self.radiators.get_mut(index)
    }

    pub fn set_asymmetric(&mut self, value: bool) {
        self.is_asymmetric = value;
    }

    pub fn get_asymmetric(&self) -> bool {
        self.is_asymmetric
    }

    pub fn has_pulsejet(&self) -> bool {
        for e in &self.engines {
            if e.get_is_pulsejet() {
                return true;
            }
        }
        false
    }

    pub fn has_turbine_no_prop(&self) -> bool {
        for e in &self.engines {
            if e.get_is_turbine() && e.get_num_propellers() == 0 {
                return true;
            }
        }
        false
    }

    pub fn has_diesel(&self) -> bool {
        for e in &self.engines {
            if e.is_diesel() {
                return true;
            }
        }
        false
    }

    /// Check if aircraft has multiple tractor nacelles
    /// TypeScript: GetHasTractorNacelles()
    /// Returns true if more than 1 engine is a tractor nacelle
    pub fn get_has_tractor_nacelles(&self) -> bool {
        let mut count = 0;
        for e in &self.engines {
            if e.get_is_tractor_nacelle() {
                count += 1;
            }
        }
        count > 1
    }

    /// Get minimum engine height across all engines
    /// TypeScript: GetEngineHeight()
    /// Returns the minimum height value for boat hull compatibility
    pub fn get_engine_height(&self) -> i16 {
        let mut min = 2;
        for e in &self.engines {
            min = min.min(e.get_engine_height());
        }
        min
    }

    /// Get engine types for propeller configuration
    /// TypeScript: GetEngineTypes()
    /// Returns: Vec<EngineInfo> with drive type and count/speed
    pub fn get_engine_types(&self) -> Vec<EngineInfo> {
        let mut lst = Vec::new();
        for en in &self.engines {
            if en.get_num_propellers() > 0 {
                lst.push(EngineInfo {
                    drive_type: DriveType::Propeller,
                    num: en.get_num_propellers() as f32,
                });
            } else if en.get_is_pulsejet() {
                lst.push(EngineInfo {
                    drive_type: DriveType::Pulsejet,
                    num: 0.0,
                });
            } else if en.get_is_turbine() {
                lst.push(EngineInfo {
                    drive_type: DriveType::Turbine,
                    num: en.etype_stats.stats.pitchspeed,
                });
            }
        }
        lst
    }

    /// Set internal mounting - for helicopters and ornithopters
    /// TypeScript: SetInternal(is: boolean)
    pub fn set_internal(&mut self, is: bool) {
        for e in &mut self.engines {
            e.set_internal(is);
        }
        if is {
            for r in &mut self.radiators {
                r.set_metal_area(0.0);
                r.set_parasol(false);
            }
        }
    }

    /// Set metal area from wings (for evaporation radiator type)
    /// TypeScript: SetMetalArea(num: number)
    pub fn set_metal_area(&mut self, metal_area: i16) {
        for r in &mut self.radiators {
            r.set_metal_area(metal_area as f32);
        }
    }

    /// Set whether aircraft has parasol wing (for high offset radiator mount)
    /// TypeScript: HaveParasol(has: boolean)
    pub fn have_parasol(&mut self, has_parasol: bool) {
        for r in &mut self.radiators {
            r.set_parasol(has_parasol);
        }
    }

    /// Get total number of propellers across all engines
    /// TypeScript: GetNumPropellers()
    pub fn get_num_propellers(&self) -> i16 {
        self.engines.iter().map(|e| e.get_num_propellers()).sum()
    }

    /// Get tractor spinner info aggregated from all engines
    /// TypeScript: GetTractorSpinner()
    /// Returns SpinnerInfo with aggregated counts
    pub fn get_tractor_spinner(&self) -> SpinnerInfo {
        let mut info = SpinnerInfo::default();
        for e in &self.engines {
            let (has, spinner) = e.get_tractor_spinner();
            if has {
                info.have = true;
                if spinner[0] {
                    info.spin_count += 1;
                }
                if spinner[1] {
                    info.arty_spin_count += 1;
                }
            }
        }
        info
    }

    /// Get pusher spinner info aggregated from all engines
    /// TypeScript: GetPusherSpinner()
    /// Returns SpinnerInfo with aggregated counts
    pub fn get_pusher_spinner(&self) -> SpinnerInfo {
        let mut info = SpinnerInfo::default();
        for e in &self.engines {
            let (has, spinner) = e.get_pusher_spinner();
            if has {
                info.have = true;
                if spinner[0] {
                    info.spin_count += 1;
                }
                if spinner[1] {
                    info.arty_spin_count += 1;
                }
            }
        }
        info
    }

    /// Get total number of radiators
    /// TypeScript: GetNumRadiators()
    /// Returns count of radiators currently configured
    pub fn get_num_radiators(&self) -> usize {
        self.radiators.len()
    }

    /// Set tail modifiers for all engines
    /// TypeScript: SetTailMods(forb: boolean, swr: boolean, canard: boolean)
    pub fn set_tail_mods(&mut self, farman_or_boom: bool, swept_v_outboard: bool, canard: bool) {
        for e in &mut self.engines {
            e.set_tail_mods(farman_or_boom, swept_v_outboard, canard);
        }
    }

    /// Check if any engine is a tractor-mounted rotary
    /// TypeScript: HasTractorRotary()
    /// Returns true if at least one engine is a tractor rotary
    pub fn has_tractor_rotary(&self) -> bool {
        for e in &self.engines {
            if e.is_tractor_rotary() {
                return true;
            }
        }
        false
    }

    /// Get total rumble from all engines
    /// TypeScript: GetRumble()
    /// Sums up rumble value from all engines
    pub fn get_rumble(&self) -> f32 {
        let mut rumble = 0.0;
        for e in &self.engines {
            rumble += e.get_rumble();
        }
        rumble
    }

    /// Get maximum rumble value from any single engine
    /// TypeScript: GetMaxRumble()
    /// Returns the highest rumble value among all engines
    pub fn get_max_rumble(&self) -> f32 {
        let mut max_rumble = 0.0;
        for e in &self.engines {
            let engine_rumble = e.get_rumble();
            if engine_rumble > max_rumble {
                max_rumble = engine_rumble;
            }
        }
        max_rumble
    }

    /// Get minimum overspeed across all engines
    /// TypeScript: GetOverspeed()
    /// Returns the most restrictive (minimum) overspeed among all engines
    /// This limits the aircraft's maximum safe speed to the weakest engine's capability
    pub fn get_overspeed(&self) -> i16 {
        let mut overspeed = 100;
        for e in &self.engines {
            overspeed = overspeed.min(e.get_overspeed());
        }
        overspeed
    }

    /// Update reliability for all engines based on aircraft stats
    /// TypeScript: UpdateReliability(stats: Stats)
    /// Passes aircraft reliability bonus to each engine's update_reliability method
    pub fn update_reliability(&mut self, aircraft_reliability: i16) {
        // Update each engine with the aircraft reliability bonus
        for engine in self.engines.iter_mut() {
            engine.update_reliability(aircraft_reliability);
        }
    }

    /// Get reliability list from all engines
    /// TypeScript: GetReliabilityList()
    /// Returns list of reliability strings from each engine
    pub fn get_reliability_list(&self) -> Vec<String> {
        self.engines.iter().map(|e| e.get_reliability()).collect()
    }

    /// Get minimum altitude across all engines
    /// TypeScript: GetMinAltitude()
    /// Returns the maximum of all engine minimum altitudes (most restrictive)
    pub fn get_min_altitude(&self) -> i16 {
        let mut m = 0;
        for e in &self.engines {
            m = m.max(e.get_min_altitude());
        }
        m
    }

    /// Get maximum altitude across all engines
    /// TypeScript: GetMaxAltitude()
    /// Returns the minimum of all engine maximum altitudes (most restrictive)
    pub fn get_max_altitude(&self) -> i16 {
        let mut m = 1000;
        for e in &self.engines {
            m = m.min(e.get_max_altitude());
        }
        m
    }

    /// Check if any radiator is flammable
    /// TypeScript: GetIsFlammable()
    pub fn get_is_flammable(&self) -> bool {
        self.radiators.iter().any(|r| r.get_is_flammable())
    }

    /// Set number of engines
    /// TypeScript: SetNumberOfEngines(num: number)
    /// Clamps to 0-20, removes or adds engines as needed
    /// New engines are clones of the last engine (if one exists)
    pub fn set_number_of_engines(&mut self, mut num: usize) {
        // Clamp to valid range
        num = num.min(20);

        // Remove excess engines
        while self.engines.len() > num {
            self.engines.pop();
        }

        // Add new engines if needed
        if self.engines.len() < num {
            // Clone the last engine (if one exists) to use as template
            while self.engines.len() < num {
                if let Some(last_engine) = self.engines.last() {
                    self.engines.push(last_engine.clone());
                } else {
                    let mut new_engine = Engine::new(self.mounts.clone(), self.cowls.clone());
                    // Update radiator count for new engine
                    new_engine.set_num_radiators(self.radiators.len() as i16);
                    self.engines.push(new_engine);
                };
            }
        }
    }

    pub fn needs_cooling(&self) -> bool {
        self.engines.iter().any(|e| e.need_cooling())
    }

    /// Set number of radiators
    /// TypeScript: SetNumberOfRadiators(num: number)
    /// Clamps to 0-20, removes or adds radiators as needed
    /// Updates all engines with new radiator count
    pub fn set_number_of_radiators(&mut self, mut num: usize) {
        // Clamp to valid range
        num = num.min(20);
        if !self.needs_cooling() {
            num = 0;
        }

        // Remove excess radiators
        while self.radiators.len() > num {
            self.radiators.pop();
        }

        // Add new radiators if needed
        while self.radiators.len() < num {
            self.radiators.push(Radiator::new(
                self.radiator_types.as_ref().clone(),
                self.radiator_mounts.as_ref().clone(),
                self.radiator_coolants.as_ref().clone(),
            ));
        }

        // Update all engines with new radiator count
        for engine in &mut self.engines {
            engine.set_num_radiators(self.radiators.len() as i16);
        }
    }

    pub fn verify_cooling(&mut self) {
        if self.needs_cooling() && self.radiators.len() == 0 {
            self.set_number_of_radiators(1);
        }
    }

    /// Set the aircraft type and update engines accordingly
    /// When switching to/from helicopter, engines' mount selection and type flags are updated
    pub fn set_aircraft_type(&mut self, aircraft_type: AircraftType) {
        // Update helicopter flag for all engines
        let is_helicopter = aircraft_type == AircraftType::Helicopter;
        for engine in &mut self.engines {
            engine.set_is_helicopter(is_helicopter);
        }
    }
}
