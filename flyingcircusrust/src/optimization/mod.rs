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

/// Main Optimization struct
/// Manages aircraft optimization using "free dots" that can be allocated
/// to improve various stats (cost, mass, drag, etc.)
#[derive(Clone, UIBindings)]
pub struct Optimization {
    // Number of free optimization dots available
    #[ui(number, name = "free_dots", set_fn = "set_free_dots")]
    free_dots: i16,

    // Optimization allocations (each can be -3 to +3)
    #[ui(number, name = "cost", set_fn = "set_cost")]
    cost: i16,

    #[ui(number, name = "bleed", set_fn = "set_bleed")]
    bleed: i16,

    #[ui(number, name = "escape", set_fn = "set_escape")]
    escape: i16,

    #[ui(number, name = "mass", set_fn = "set_mass")]
    mass: i16,

    #[ui(number, name = "toughness", set_fn = "set_toughness")]
    toughness: i16,

    #[ui(number, name = "maxstrain", set_fn = "set_maxstrain")]
    pub maxstrain: i16,

    #[ui(number, name = "reliability", set_fn = "set_reliability")]
    reliability: i16,

    #[ui(number, name = "drag", set_fn = "set_drag")]
    drag: i16,

    // Aircraft stats (set externally, used for calculations)
    acft_stats: Stats,

    // Final max strain value (calculated in derived stats)
    pub final_ms: f32,
}
