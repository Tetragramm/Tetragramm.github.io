use super::*;

impl Weapon {
    /// Creates a new Weapon instance
    /// TypeScript: constructor(weapon_type: WeaponType, action: ActionType, projectile: ProjectileType, fixed = false)
    pub fn new(
        weapon_type: WeaponType,
        action: ActionType,
        projectile: ProjectileType,
        fixed: bool,
    ) -> Weapon {
        let synchronization = if fixed {
            SynchronizationType::None
        } else {
            SynchronizationType::Interrupt
        };

        Weapon {
            weapon_type: Rc::new(weapon_type),
            action,
            projectile,
            fixed,
            wing: true,
            covered: false,
            accessible: false,
            free_accessible: false,
            synchronization,
            w_count: 1,
            repeating: false,
            can_free_accessible: false,
            can_synchronize: false,
            can_spinner: false,
            can_arty_spinner: false,
            wing_reinforcement: false,
            has_cantilever: false,
            turret: false,
            canwing: false,
        }
    }
}
