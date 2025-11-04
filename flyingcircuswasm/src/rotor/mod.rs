use crate::{aircraft::AircraftType, stats::Stats};
use std::rc::Rc;

// Sub-module declarations
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;
mod validation;

#[cfg(test)]
mod tests;

// Re-export public API
pub use core::*;
pub use queries::*;
pub use setters::*;

/// Blade count entry with sizing and stats
#[derive(Clone)]
pub struct BladeEntry {
    pub name: String,
    pub sizing: f64,      // Sizing factor for rotor calculations
    pub rotor_bleed: i16, // Helicopter-specific bleed
    pub stats: Stats,
}

/// Rotor arrangement/stagger entry
#[derive(Clone)]
pub struct ArrangementEntry {
    pub name: String,
    pub count: usize,     // Number of rotors (1, 2, or 3)
    pub powerfactor: f64, // Power multiplication factor
    pub blades: i16,      // Additional blade effects
    pub stats: Stats,
}

/// Cantilever material entry (shared with reinforcements)
#[derive(Clone)]
pub struct CantileverEntry {
    pub name: String,
    pub limited: bool,
    pub stats: Stats,
}

/// Main Rotor struct
/// Manages helicopter/autogyro rotor configuration
pub struct Rotor {
    // Reference lists (loaded from JSON)
    blade_list: Rc<Vec<BladeEntry>>,
    arrangement_list: Rc<Vec<ArrangementEntry>>,

    // Cantilever list (set by reinforcements module)
    cantilever_list: Rc<Vec<CantileverEntry>>,

    // Aircraft type and rotor configuration
    aircraft_type: AircraftType,
    rotor_count: usize,
    rotor_span: i16,      // Additional span beyond sizing_span
    rotor_thickness: i16, // Helicopter rotor thickness (12.55+)

    // Selection indices
    blade_idx: usize,
    arrangement_sel: usize,
    cantilever_idx: usize,

    // External state (set by Aircraft)
    wing_area: i16,
    dry_mass_power: f64, // dryMP - used for auto-sizing
    sizing_span: i16,    // Calculated sizing span
    engine_count: usize,

    // Configuration
    accessory: bool, // Accessory rotor system
}
