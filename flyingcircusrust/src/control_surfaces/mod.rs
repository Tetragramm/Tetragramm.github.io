use crate::{aircraft::AircraftType, stats::Stats};
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

#[cfg(test)]
mod tests;

// Re-export struct methods

/// Aileron option with warping flag
#[derive(Debug, Clone)]
pub struct AileronEntry {
    pub name: String,
    pub warping: bool,
    pub stats: Stats,
}

/// Rudder option
#[derive(Debug, Clone)]
pub struct RudderEntry {
    pub name: String,
    pub stats: Stats,
}

/// Elevator option
#[derive(Debug, Clone)]
pub struct ElevatorEntry {
    pub name: String,
    pub stats: Stats,
}

/// Flaps option with cost factor
#[derive(Debug, Clone)]
pub struct FlapsEntry {
    pub name: String,
    pub costfactor: f32,
    pub stats: Stats,
}

/// Slats option
#[derive(Debug, Clone)]
pub struct SlatsEntry {
    pub name: String,
    pub stats: Stats,
}

/// Drag inducer option
#[derive(Debug, Clone)]
pub struct DragInducerEntry {
    pub name: String,
    pub stats: Stats,
}

/// Control surfaces for aircraft - ailerons, rudders, elevators, flaps, slats, and drag inducers
#[derive(UIBindings)]
pub struct ControlSurfaces {
    // Lists of available options (shared, immutable)
    pub(super) aileron_list: Rc<Vec<AileronEntry>>,
    pub(super) rudder_list: Rc<Vec<RudderEntry>>,
    pub(super) elevator_list: Rc<Vec<ElevatorEntry>>,
    pub(super) flaps_list: Rc<Vec<FlapsEntry>>,
    pub(super) slats_list: Rc<Vec<SlatsEntry>>,
    pub(super) drag_list: Rc<Vec<DragInducerEntry>>,

    // Selected indices
    #[ui(
        number,
        name = "aileron_sel",
        set_fn = "set_aileron",
        enabled_fn = "is_aileron_enabled"
    )]
    pub(super) aileron_sel: i16,

    #[ui(
        number,
        name = "rudder_sel",
        set_fn = "set_rudder",
        enabled_fn = "is_rudder_enabled"
    )]
    pub(super) rudder_sel: i16,

    #[ui(
        number,
        name = "elevator_sel",
        set_fn = "set_elevator",
        enabled_fn = "is_elevator_enabled"
    )]
    pub(super) elevator_sel: i16,

    #[ui(
        number,
        name = "flaps_sel",
        set_fn = "set_flaps",
        enabled_fn = "is_flaps_enabled"
    )]
    pub(super) flaps_sel: i16,

    #[ui(
        number,
        name = "slats_sel",
        set_fn = "set_slats",
        enabled_fn = "is_slats_enabled"
    )]
    pub(super) slats_sel: i16,

    #[ui(
        array,
        source = "drag_list",
        name = "drag_sel",
        set_fn = "set_drag",
        enabled_fn = "is_drag_enabled"
    )]
    pub(super) drag_sel: Vec<bool>,

    // Aircraft state (not serialized, updated from parent)
    pub(super) span: i16,
    pub(super) num_cantilever: i16,
    pub(super) wing_area: i16,
    pub(super) is_boom: bool,
    pub(super) acft_type: AircraftType,
    pub(super) can_rudder: bool,
    pub(super) can_elevator: bool,
}
