use crate::{
    stats::Stats,
    weapon::{ActionType, ProjectileType, SynchronizationType, Weapon, WeaponType},
};
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

/// WeaponSystem struct
/// Manages a collection of weapons with shared configuration
/// Handles weapon selection, action/projectile types, and mounting configuration
#[derive(Clone)]
pub struct WeaponSystem {
    // Weapon type selection
    weapon_list: Rc<Vec<WeaponType>>,
    wl_permute: Rc<Vec<usize>>,
    weapon_type: usize,
    raw_weapon_type: usize,

    // Calculated final weapon (includes action/projectile modifications)
    final_weapon: WeaponType,

    // Weapon instances
    weapons: Vec<Weapon>,

    // Mounting configuration
    fixed: bool,
    directions: Vec<bool>, // 6 directions: forward, aft, up, down, left, right

    // Ammunition and modifications
    ammo: i16,
    action_sel: ActionType,
    projectile_sel: ProjectileType,
    repeating: bool,
    seat: i16,

    // External configuration (set by Aircraft)
    tractor: bool,
    pusher: bool,
    heli: bool,
    spinner_t: bool,
    spinner_p: bool,
    pub has_cantilever: bool,
    has_propeller: bool,
    sticky_guns: i16,
}
