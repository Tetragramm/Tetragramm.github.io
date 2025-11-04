use crate::stats::Stats;
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

/// Main Munitions struct
/// Manages bombs, rockets, and internal bomb bays
#[derive(Clone, UIBindings)]
pub struct Munitions {
    // Munitions counts
    #[ui(number, name = "bomb_count", set_fn = "set_bomb_count")]
    bomb_count: i16,

    #[ui(number, name = "rocket_count", set_fn = "set_rocket_count")]
    rocket_count: i16,

    #[ui(number, name = "bay_count", set_fn = "set_bay_count")]
    internal_bay_count: i16,

    // Bay upgrades (bay1 doubles capacity, bay2 doubles it again)
    // Note: bay2 requires bay1 (validation enforced by setters)
    #[ui(check, name = "bay1", set_fn = "set_internal_bay_1")]
    internal_bay_1: bool,

    #[ui(check, name = "bay2", set_fn = "set_internal_bay_2")]
    internal_bay_2: bool,

    // Aircraft parameters (set externally)
    acft_struct: f64,
    maxbomb: f64,
    gull_factor: f64,
}
