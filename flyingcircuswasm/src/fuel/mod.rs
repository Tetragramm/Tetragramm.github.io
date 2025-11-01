use crate::{lu, stats::Stats};
use std::rc::Rc;
use ui_core::*;
use ui_macro::UIBindings;

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

/// Tank type entry with stats and properties
#[derive(Clone)]
pub struct TankEntry {
    pub name: String,
    pub stats: Stats,
    pub internal: bool,
    pub cantilever: bool,
}

/// Main Fuel struct
/// Manages fuel tanks, self-sealing, and fire extinguisher options
#[derive(Clone, UIBindings)]
pub struct Fuel {
    // Reference list of available tank types (loaded from JSON)
    tank_list: Rc<Vec<TankEntry>>,

    // Tank counts for each type
    #[ui(array, source = "tank_list", enabled_fn, set_fn = "set_tank_count")]
    tank_count: Vec<i16>,

    // Self-sealing fuel tanks (adds mass and cost)
    #[ui(
        check,
        name = "self_sealing",
        enabled_fn = "get_sealing_enabled",
        set_fn = "set_self_sealing"
    )]
    self_sealing: bool,

    // Fire extinguisher system
    #[ui(check, name = "fire_extinguisher", set_fn = "set_extinguisher")]
    fire_extinguisher: bool,

    // Wing configuration (set externally by wings)
    is_cantilever: bool,
    wing_area: f64,
}
