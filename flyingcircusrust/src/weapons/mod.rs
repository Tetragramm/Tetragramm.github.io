use crate::{stats::Stats, weapon::WeaponType, weapon_system::WeaponSystem};
use std::rc::Rc;

// Sub-module declarations
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;
mod ui;
mod validation;

#[cfg(test)]
mod tests;

// Re-export public API

/// Weapons struct
/// Manages collections of WeaponSystem instances
/// Acts as the primary interface between aircraft and weapon systems
#[derive(Clone)]
pub struct Weapons {
    // Collection of weapon systems
    weapon_sets: Vec<WeaponSystem>,

    // Weapon definitions (passed in from outside)
    weapon_list: Rc<Vec<WeaponType>>,
    wl_permute: Rc<Vec<usize>>,

    // Weapon brace count (must be multiple of 3)
    brace_count: i16,

    // External configuration (set by Aircraft)
    pub cockpit_count: i16,
    pub has_tractor: bool,
    pub tractor_spinner_count: i16,
    pub tractor_arty_spinner_count: i16,
    pub has_pusher: bool,
    pub pusher_spinner_count: i16,
    pub pusher_arty_spinner_count: i16,
    pub cant_type: i16, // 0=none, 1=small, 2=large cantilever
    isheli: bool,
}
