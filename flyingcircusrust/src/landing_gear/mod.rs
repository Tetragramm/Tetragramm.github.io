use crate::stats::Stats;
use std::iter::zip;
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

// Re-export public API

/// Gear type entry with stats and properties
#[derive(Clone)]
pub struct GearEntry {
    pub name: String,
    pub stats: Stats,
    pub dplmp: f32, // Drag per Loaded Mass Point
    pub splmp: f32, // Structure per Loaded Mass Point
    pub can_retract: bool,
}

/// Extra gear accessory entry (arresting hook, zeppelin hook, etc.)
#[derive(Clone)]
pub struct ExtraEntry {
    pub name: String,
    pub stats: Stats,
    pub mplmp: f32, // Mass per Loaded Mass Point
}

/// Main LandingGear struct
/// Manages landing gear type, retractable gear, and extra accessories
#[derive(Clone, UIBindings)]
pub struct LandingGear {
    // Reference lists of available gear types and extras (loaded from JSON)
    gear_list: Rc<Vec<GearEntry>>,
    extra_list: Rc<Vec<ExtraEntry>>,

    // Selected gear index
    #[ui(
        select,
        source = "gear_list",
        enabled_fn = "is_gear_enabled",
        set_fn = "set_gear"
    )]
    gear_sel: usize,

    // Retractable gear option
    #[ui(
        check,
        name = "Landing Gear Retractable",
        enabled_fn = "is_retract_enabled",
        set_fn = "set_retract"
    )]
    retract: bool,

    // Extra accessories selection (arresting hook, zeppelin hook, etc.)
    #[ui(
        check_list,
        source = "extra_list",
        enabled_fn = "is_extra_enabled",
        set_fn = "set_extra_selected"
    )]
    extra_sel: Vec<bool>,

    // External configuration (set by other modules)
    pub can_boat: bool,   // Can use boat hull (based on engine/wing height)
    pub gull_deck: i16,   // Gull wing deck position (0=none, 1=shoulder, 2=mid, 3=low, 4=gear)
    pub loaded_mass: f32, // Aircraft loaded mass (for calculations)
}
