use crate::{aircraft::AircraftType, stats::Stats};
use std::iter::zip;
use std::rc::Rc;
use ui_core::*;
use ui_macro::UIBindings;

// Submodules
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;
mod validation;

#[cfg(test)]
mod tests;

// Re-export struct methods

/// External wood strut option
#[derive(Debug, Clone)]
pub struct ExternalWoodEntry {
    pub name: String,
    pub tension: i16,
    pub config: bool,
    pub first: bool,
    pub small_sqp: bool,
    pub ornith: bool,
    pub stats: Stats,
}

/// External steel strut option
#[derive(Debug, Clone)]
pub struct ExternalSteelEntry {
    pub name: String,
    pub tension: i16,
    pub config: bool,
    pub first: bool,
    pub small_sqp: bool,
    pub ornith: bool,
    pub stats: Stats,
}

/// Cabane strut option
#[derive(Debug, Clone)]
pub struct CabaneEntry {
    pub name: String,
    pub tension: i16,
    pub stats: Stats,
}

/// Cantilever bracing option
#[derive(Debug, Clone)]
pub struct CantileverEntry {
    pub name: String,
    pub limited: bool,
    pub stats: Stats,
}

/// Aircraft reinforcements system - external struts, cables, and cantilever bracing
#[derive(UIBindings)]
pub struct Reinforcements {
    // Lists of available options (shared, immutable)
    pub(super) ext_wood_list: Rc<Vec<ExternalWoodEntry>>,
    pub(super) ext_steel_list: Rc<Vec<ExternalSteelEntry>>,
    pub(super) cabane_list: Rc<Vec<CabaneEntry>>,
    pub(super) cant_list: Rc<Vec<CantileverEntry>>,

    // Selection counts for external struts
    #[ui(
        number_list,
        source = "ext_wood_list",
        set_fn = "set_ext_wood_count",
        enabled_fn = "is_ext_wood_enabled"
    )]
    pub(super) ext_wood_count: Vec<i16>,

    #[ui(
        number_list,
        source = "ext_steel_list",
        set_fn = "set_ext_steel_count",
        enabled_fn = "is_ext_steel_enabled"
    )]
    pub(super) ext_steel_count: Vec<i16>,

    // Cantilever configuration
    #[ui(
        number_list,
        source = "cant_list",
        set_fn = "set_cant_count",
        enabled_fn = "is_cant_enabled"
    )]
    pub(super) cant_count: Vec<i16>,

    // Cable and strut configuration
    #[ui(
        check,
        name = "wires",
        set_fn = "set_wires",
        enabled_fn = "is_wires_enabled"
    )]
    pub(super) wires: bool,

    #[ui(
        select,
        source = "cabane_list",
        set_fn = "set_cabane",
        enabled_fn = "is_cabane_enabled"
    )]
    pub(super) cabane_sel: usize,

    #[ui(
        check,
        name = "wing_blades",
        set_fn = "set_wing_blades",
        enabled_fn = "is_wing_blades_enabled"
    )]
    pub(super) wing_blades: bool,

    // Aircraft state (not serialized, updated from parent)
    pub(super) is_staggered: bool,
    pub(super) is_tandem: bool,
    pub(super) is_monoplane: bool,
    pub(super) can_external: bool,
    pub(super) acft_structure: i16,
    pub(super) cant_lift: i16,
    pub(super) tension_sqp: bool,
    pub(super) limited_sqp: bool,
    pub(super) acft_type: AircraftType,
}
