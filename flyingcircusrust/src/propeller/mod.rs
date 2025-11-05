use std::rc::Rc;

use ui_core::*;
use ui_macro::*;

use crate::stats::Stats;

// Sub-module declarations
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;

#[cfg(test)]
mod tests;

// Re-export public API

// Re-export AircraftType from shared types module
pub use crate::types::AircraftType;

/// Drive type enum matching TypeScript DRIVE_TYPE
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum DriveType {
    Propeller = 0,
    Turbine = 1,
    Pulsejet = 2,
}

impl From<i16> for DriveType {
    fn from(value: i16) -> Self {
        match value {
            0 => DriveType::Propeller,
            1 => DriveType::Turbine,
            2 => DriveType::Pulsejet,
            _ => DriveType::Propeller,
        }
    }
}

/// Represents an engine with its drive type and count
#[derive(Clone)]
pub struct EngineInfo {
    pub drive_type: DriveType,
    pub num: f32,
}

/// Propeller type entry with stats and performance characteristics
#[derive(Clone)]
pub struct PropellerEntry {
    pub name: String,
    pub stats: Stats,
    pub energy: f32,
    pub turn: f32,
}

/// Upgrade entry with stats and performance modifiers
#[derive(Clone)]
pub struct UpgradeEntry {
    pub name: String,
    pub stats: Stats,
    pub energy: f32,
    pub turn: f32,
}

/// Main Propeller struct with UIBindings
#[derive(Clone, UIBindings)]
pub struct Propeller {
    // Propeller and upgrade lists (loaded from JSON)
    prop_list: Rc<Vec<PropellerEntry>>,
    upg_list: Rc<Vec<UpgradeEntry>>,

    // Selected indices
    #[ui(select, source = "prop_list", enabled_fn, set_fn = "set_prop_index")]
    idx_prop: usize,

    #[ui(select, source = "upg_list", enabled_fn, set_fn = "set_upgrade_index")]
    idx_upg: usize,

    // Engine configuration
    engines: Vec<EngineInfo>,

    // Aircraft type
    acft_type: AircraftType,
}
