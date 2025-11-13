use crate::{
    accessories::Accessories, alter::Alter, cargo::Cargo, cockpits::Cockpits,
    control_surfaces::ControlSurfaces, engines::Engines, era::Era, frames::Frames, fuel::Fuel,
    landing_gear::LandingGear, munitions::Munitions, optimization::Optimization, part::Part,
    part_list::get_part_list, passengers::Passengers, propeller::Propeller,
    reinforcements::Reinforcements, rotor::Rotor, stabilizers::Stabilizers, stats::Stats,
    used::Used, weapon_list::get_weapon_list, weapons::Weapons, wings::Wings,
};

// Sub-module declarations
mod derived_stats;
mod json;
mod part;
mod queries;
mod serialization;

#[cfg(test)]
mod tests;

// Re-export AircraftType from shared types module
pub use crate::types::AircraftType;

/// Main Aircraft struct
pub struct Aircraft {
    pub version: String,
    pub name: String,
    pub stats: Stats,
    pub aircraft_type: AircraftType,
    pub alter: Alter,
    pub era: Era,
    pub cockpits: Cockpits,
    pub passengers: Passengers,
    pub engines: Engines,
    pub propeller: Propeller,
    pub frames: Frames,
    pub fuel: Fuel,
    pub munitions: Munitions,
    pub cargo: Cargo,
    pub weapons: Weapons,
    pub wings: Wings,
    pub rotor: Rotor,
    pub controlsurfaces: ControlSurfaces,
    pub reinforcements: Reinforcements,
    pub accessories: Accessories,
    pub stabilizers: Stabilizers,
    pub gear: LandingGear,
    pub optimization: Optimization,
    pub used: Used,
}

impl Aircraft {
    pub fn new() -> Aircraft {
        let part_list = get_part_list();
        let (wlist, wl_permute) = get_weapon_list();
        Aircraft {
            version: part_list.version,
            name: "Prototype Aircraft".to_string(),
            stats: Stats::new(),
            aircraft_type: AircraftType::Airplane,
            alter: Alter::new(Vec::new()), //TODO: local storage?
            era: Era::new(part_list.era),
            cockpits: Cockpits::new(
                part_list.cockpit_type,
                part_list.cockpit_upgrades,
                part_list.cockpit_safety,
                part_list.cockpit_gunsights,
            ),
            passengers: Passengers::new(),
            engines: Engines::new(
                part_list.engine_mounts,
                part_list.engine_cowls,
                part_list.radiator_types,
                part_list.radiator_mounts,
                part_list.radiator_coolants,
            ),
            propeller: Propeller::new(part_list.propeller_props, part_list.propeller_upgrades),
            frames: Frames::new(
                part_list.frame_frames,
                part_list.frame_skin,
                part_list.frame_tail,
            ),
            fuel: Fuel::new(part_list.fuel_tanks),
            munitions: Munitions::new(),
            cargo: Cargo::new(part_list.cargo_space),
            weapons: Weapons::new(wlist, wl_permute),
            wings: Wings::new(
                part_list.wing_surface,
                part_list.wing_stagger,
                part_list.wing_decks,
                part_list.wing_largest,
            ),
            rotor: Rotor::new(part_list.rotor_blades, part_list.rotor_arrangement),
            controlsurfaces: ControlSurfaces::new(
                part_list.control_ailerons,
                part_list.control_rudders,
                part_list.control_elevators,
                part_list.control_flaps,
                part_list.control_slats,
                part_list.control_drag,
            ),
            reinforcements: Reinforcements::new(
                part_list.reinforcement_wood,
                part_list.reinforcement_steel,
                part_list.reinforcement_cabane,
                part_list.reinforcement_cantilever,
            ),
            accessories: Accessories::new(
                part_list.accessories_electrical,
                part_list.accessories_radios,
                part_list.accessories_recon,
                part_list.accessories_visibility,
                part_list.accessories_climate,
                part_list.accessories_autopilots,
                part_list.accessories_control,
            ),
            stabilizers: Stabilizers::new(part_list.stabilizers_hstab, part_list.stabilizers_vstab),
            gear: LandingGear::new(part_list.landing_gear_types, part_list.landing_gear_extras),
            optimization: Optimization::new(),
            used: Used::new(),
        }
    }

    pub fn is_ornithopter(&self) -> bool {
        matches!(
            self.aircraft_type,
            AircraftType::OrnithopterBasic
                | AircraftType::OrnithopterBuzzer
                | AircraftType::OrnithopterFlutter
        )
    }

    /// Get list of vital component names for this aircraft
    /// Based on TypeScript: VitalComponentList()
    /// Returns a vector of strings representing all vital aircraft components
    pub fn vital_component_list(&self) -> Vec<String> {
        let mut vital = Vec::new();

        // Always include controls as first entry
        vital.push(t!("Vital Part Controls").to_string());

        // Add cockpit seats
        for i in 0..self.cockpits.positions.len() {
            vital.push(t!("Seat #", A = i + 1).to_string());
        }

        // Add fuel tanks if aircraft uses fuel
        if self.stats.fuel > 0.0 {
            vital.push(t!("Vital Part Fuel Tanks").to_string());
        }

        // Add engines and related components
        for i in 0..self.engines.engines.len() {
            let engine = &self.engines.engines[i];
            if engine.is_push_pull {
                vital.push(t!("Vital Part Engine Pusher", A = i + 1).to_string());
                if engine.etype_stats.oiltank {
                    vital.push(t!("Vital Part Oil Tank Pusher", A = i + 1).to_string());
                }
                if engine.get_has_oil_cooler() {
                    vital.push(t!("Vital Part Oil Cooler Pusher", A = i + 1).to_string());
                }
                if engine.get_has_oil_pan() {
                    vital.push(t!("Vital Part Oil Pan Pusher", A = i + 1).to_string());
                }
                vital.push(t!("Vital Part Engine Puller", A = i + 1).to_string());
                if engine.etype_stats.oiltank {
                    vital.push(t!("Vital Part Oil Tank Puller", A = i + 1).to_string());
                }
                if engine.get_has_oil_cooler() {
                    vital.push(t!("Vital Part Oil Cooler Puller", A = i + 1).to_string());
                }
                if engine.get_has_oil_pan() {
                    vital.push(t!("Vital Part Oil Pan Puller", A = i + 1).to_string());
                }
            } else {
                vital.push(t!("Vital Part Engine", A = i + 1).to_string());
                if engine.etype_stats.oiltank {
                    vital.push(t!("Vital Part Oil Tank", A = i + 1).to_string());
                }
                if engine.get_has_oil_cooler() {
                    vital.push(t!("Vital Part Oil Cooler", A = i + 1).to_string());
                }
                if engine.get_has_oil_pan() {
                    vital.push(t!("Vital Part Oil Pan", A = i + 1).to_string());
                }
            }
        }

        // Add radiators
        for i in 0..self.engines.radiators.len() {
            vital.push(t!("Vital Part Radiator", A = i + 1).to_string());
        }

        // Add electrics if present
        if self.is_electrics() {
            vital.push(t!("Vital Part Electrics").to_string());
        }

        // Add weapon sets
        let weapon_list = self.weapons.get_weapon_list();
        for i in 0..self.weapons.get_weapon_sets().len() {
            let ws = &self.weapons.get_weapon_sets()[i];
            let weapon_abrv = &weapon_list[ws.get_weapon_selected()].abrv;
            vital.push(t!("Vital Part Weapon Set", A = i + 1, B = weapon_abrv).to_string());
        }

        // Add landing gear if vital
        if self.gear.is_vital() {
            vital.push(t!("Vital Part Landing Gear").to_string());
        }

        // Add tail rotor for helicopters
        if self.rotor.get_tail_rotor() {
            vital.push(t!("Vital Part Tail Rotor").to_string());
        }

        vital
    }

    /// Check if aircraft has any electrical systems
    /// TypeScript: IsElectrics()
    /// Returns true if engines, accessories, or cockpits have electrical equipment
    pub fn is_electrics(&self) -> bool {
        let em = self.get_electrics();
        em.storage > 0 || !em.equipment.is_empty()
    }
}
