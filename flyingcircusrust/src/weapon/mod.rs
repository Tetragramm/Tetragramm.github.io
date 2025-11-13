use crate::stats::Stats;
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

#[cfg(test)]
mod tests;

// Re-export public API

/// Synchronization type for weapons firing through propeller arc
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum SynchronizationType {
    None = -1,
    Interrupt = 0,
    Synch = 1,
    Spinner = 2,
    Deflect = 3,
    NoInterference = 4,
}

impl From<i16> for SynchronizationType {
    fn from(v: i16) -> Self {
        match v {
            -1 => SynchronizationType::None,
            0 => SynchronizationType::Interrupt,
            1 => SynchronizationType::Synch,
            2 => SynchronizationType::Spinner,
            3 => SynchronizationType::Deflect,
            4 => SynchronizationType::NoInterference,
            _ => SynchronizationType::None,
        }
    }
}

/// Projectile type for weapons
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum ProjectileType {
    Bullets = 0,
    Heatray = 1,
    Pneumatic = 2,
    Gyrojets = 4,
}

impl From<i16> for ProjectileType {
    fn from(v: i16) -> Self {
        match v {
            1 => ProjectileType::Heatray,
            2 => ProjectileType::Pneumatic,
            4 => ProjectileType::Gyrojets,
            _ => ProjectileType::Bullets,
        }
    }
}

/// Action type for weapons
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum ActionType {
    Standard = 0,
    Mechanical = 1,
    Gast = 2,
    Rotary = 3,
}

impl From<i16> for ActionType {
    fn from(v: i16) -> Self {
        match v {
            1 => ActionType::Mechanical,
            2 => ActionType::Gast,
            3 => ActionType::Rotary,
            _ => ActionType::Standard,
        }
    }
}

/// Weapon type entry with stats and properties
#[derive(Clone)]
pub struct WeaponType {
    pub name: String,
    pub abrv: String,
    pub era: String,
    pub size: i16,
    pub stats: Stats,
    pub damage: f32,
    pub hits: i16,
    pub ammo: i16,
    pub ap: i16,
    pub jam: String,
    pub reload: i16,
    pub rapid: bool,
    pub synched: bool,
    pub shells: bool,
    pub can_action: bool,
    pub can_projectile: bool,
    pub deflection: i16,
}

/// Main Weapon struct
/// Represents a single weapon mount with configuration
#[derive(Clone, UIBindings)]
pub struct Weapon {
    // Weapon type reference
    weapon_type: Rc<WeaponType>,
    action: ActionType,
    projectile: ProjectileType,

    // Mounting configuration
    #[ui(check, name = "fixed", enabled_fn, set_fn = "set_fixed")]
    fixed: bool,

    #[ui(check, name = "wing", enabled_fn = "can_wing", set_fn = "set_wing")]
    wing: bool,

    #[ui(
        check,
        name = "covered",
        enabled_fn = "can_covered",
        set_fn = "set_covered"
    )]
    covered: bool,

    #[ui(check, name = "accessible", enabled_fn, set_fn = "set_accessible")]
    accessible: bool,

    #[ui(
        check,
        name = "free_accessible",
        enabled_fn,
        set_fn = "set_free_accessible"
    )]
    free_accessible: bool,

    // Synchronization doesn't use UIBindings - handled manually
    synchronization: SynchronizationType,

    #[ui(number, name = "w_count", enabled_fn, set_fn = "set_count")]
    w_count: i16,

    repeating: bool,

    // External configuration (set by parent WeaponSystem)
    pub can_free_accessible: bool,
    pub can_synchronize: bool,
    pub can_spinner: bool,
    pub can_arty_spinner: bool,
    pub wing_reinforcement: bool,
    pub has_cantilever: bool,

    // State flags
    turret: bool,
    canwing: bool,
}
