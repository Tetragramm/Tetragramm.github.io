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

// Re-export public API

/// Main Munitions struct
/// Manages bombs, rockets, and internal bomb bays
#[derive(Clone, UIBindings)]
pub struct Munitions {
    // Munitions counts
    #[ui(number, name = "Load Bombs", set_fn = "set_bomb_count")]
    bomb_count: i16,

    #[ui(number, name = "Load Rockets", set_fn = "set_rocket_count")]
    rocket_count: i16,

    #[ui(number, name = "Load Internal Bay Count", set_fn = "set_bay_count")]
    internal_bay_count: i16,

    // Bay upgrades (bay1 doubles capacity, bay2 doubles it again)
    // Note: bay2 requires bay1 (validation enforced by setters)
    #[ui(
        check,
        name = "Load Widen Internal Bay 1",
        set_fn = "set_internal_bay_1"
    )]
    internal_bay_1: bool,

    #[ui(
        check,
        name = "Load Widen Internal Bay 2",
        set_fn = "set_internal_bay_2"
    )]
    internal_bay_2: bool,

    // Aircraft parameters (set externally)
    acft_struct: f32,
    maxbomb: f32,
    gull_factor: f32,
}
