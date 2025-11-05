use crate::stats::Stats;
use std::rc::Rc;
use ui_core::*;
use ui_macro::UIBindings;

/// Entry for horizontal stabilizer types
#[derive(Clone, Debug)]
pub struct HStabEntry {
    pub name: String,
    pub is_canard: bool,
    pub increment: i16,
    pub stats: Stats,
    pub dragfactor: f32,
    pub is_vtail: bool,
    pub is_tail: bool,
}

/// Entry for vertical stabilizer types
#[derive(Clone, Debug)]
pub struct VStabEntry {
    pub name: String,
    pub increment: i16,
    pub stats: Stats,
    pub dragfactor: f32,
    pub is_vtail: bool,
    pub is_tail: bool,
}

/// Stabilizers module - handles horizontal and vertical stabilizers
#[derive(Clone, UIBindings)]
pub struct Stabilizers {
    // External state (set by other modules)
    pub have_tail: bool,
    pub is_tandem: bool,
    pub is_swept: bool,
    pub is_heli: bool,
    pub lifting_area: f32,
    pub engine_count: i16,
    pub wing_drag: f32,

    // Part lists
    pub hstab_list: Rc<Vec<HStabEntry>>,
    pub vstab_list: Rc<Vec<VStabEntry>>,

    // Horizontal stabilizer configuration
    #[ui(
        number,
        name = "hstab_sel",
        set_fn = "set_hstab_type",
        enabled_fn = "is_hstab_enabled"
    )]
    hstab_sel: i16,

    #[ui(
        number,
        name = "hstab_count",
        set_fn = "set_hstab_count",
        enabled_fn = "is_hstab_count_enabled"
    )]
    hstab_count: i16,

    // Vertical stabilizer configuration
    #[ui(
        number,
        name = "vstab_sel",
        set_fn = "set_vstab_type",
        enabled_fn = "is_vstab_enabled"
    )]
    vstab_sel: i16,

    #[ui(
        number,
        name = "vstab_count",
        set_fn = "set_vstab_count",
        enabled_fn = "is_vstab_count_enabled"
    )]
    vstab_count: i16,
}

// Module organization
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;
mod validation;

#[cfg(test)]
mod tests;
