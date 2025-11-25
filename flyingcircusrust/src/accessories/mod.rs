use crate::stats::Stats;
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

#[cfg(test)]
mod tests;

// Re-export struct methods

/// Electrical equipment (batteries, windmills, etc.)
#[derive(Debug, Clone)]
pub struct ElectricalEntry {
    pub name: String,
    pub cp10s: f32,
    pub storage: i16,
    pub stats: Stats,
}

/// Radio communication system
#[derive(Debug, Clone)]
pub struct RadioEntry {
    pub name: String,
    pub stats: Stats,
}

/// Reconnaissance/camera equipment
#[derive(Debug, Clone)]
pub struct ReconEntry {
    pub name: String,
    pub stats: Stats,
}

/// Visibility enhancement equipment
#[derive(Debug, Clone)]
pub struct VisibilityEntry {
    pub name: String,
    pub stats: Stats,
}

/// Climate control equipment
#[derive(Debug, Clone)]
pub struct ClimateEntry {
    pub name: String,
    pub req_radiator: bool,
    pub stats: Stats,
}

/// Autopilot system
#[derive(Debug, Clone)]
pub struct AutopilotEntry {
    pub name: String,
    pub stats: Stats,
}

/// Control system with stress limits
#[derive(Debug, Clone)]
pub struct ControlEntry {
    pub name: String,
    pub max_mass_stress: i16,
    pub max_total_stress: i16,
    pub stats: Stats,
}

/// Armour name
#[derive(Debug, Clone)]
pub struct ArmourEntry {
    pub name: String,
}

/// Aircraft accessories system - armour, electrical, communications, visibility
#[derive(UIBindings)]
pub struct Accessories {
    // Lists of available options (shared, immutable)
    pub(super) electrical_list: Rc<Vec<ElectricalEntry>>,
    pub(super) radio_list: Rc<Vec<RadioEntry>>,
    pub(super) recon_list: Rc<Vec<ReconEntry>>,
    pub(super) visi_list: Rc<Vec<VisibilityEntry>>,
    pub(super) climate_list: Rc<Vec<ClimateEntry>>,
    pub(super) autopilot_list: Rc<Vec<AutopilotEntry>>,
    pub(super) control_list: Rc<Vec<ControlEntry>>,

    armour_list: Vec<ArmourEntry>,

    // Armour coverage array (8 positions for different AP levels)
    #[ui(number_list, source = "armour_list", set_fn = "set_armour_coverage")]
    pub(super) armour_coverage: Vec<i16>,

    // Electrical equipment counts
    #[ui(
        number_list,
        source = "electrical_list",
        set_fn = "set_electrical_count"
    )]
    pub(super) electrical_count: Vec<i16>,

    // Radio selection
    #[ui(select, source = "radio_list", set_fn = "set_radio_sel")]
    pub(super) radio_sel: usize,

    // Reconnaissance equipment counts
    #[ui(number_list, source = "recon_list", set_fn = "set_recon_sel")]
    pub(super) recon_sel: Vec<i16>,

    // Visibility equipment toggles
    #[ui(
        check_list,
        source = "visi_list",
        set_fn = "set_visi_sel",
        enabled_fn = "can_visi"
    )]
    pub(super) visi_sel: Vec<bool>,

    // Climate control toggles
    #[ui(check_list, source = "climate_list", set_fn = "set_clim_sel")]
    pub(super) clim_sel: Vec<bool>,

    // Autopilot selection
    #[ui(select, source = "autopilot_list", set_fn = "set_auto_sel")]
    pub(super) auto_sel: usize,

    // Control system selection
    #[ui(select, source = "control_list", set_fn = "set_cont_sel")]
    pub(super) cont_sel: usize,

    // Aircraft state (not serialized, updated from parent)
    pub(super) has_radiator: bool,
    pub(super) can_visi_wings: bool,
    pub(super) can_visi_frame: bool,
    pub(super) skin_armour: i16,
    pub(super) vital_parts: i16,
}
