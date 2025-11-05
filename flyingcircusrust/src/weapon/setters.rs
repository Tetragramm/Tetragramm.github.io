use super::*;

impl Weapon {
    /// Set weapon type, action, and projectile
    /// TypeScript: SetWeaponType(weapon_type: WeaponType, action: ActionType, projectile: ProjectileType)
    pub fn set_weapon_type(
        &mut self,
        weapon_type: WeaponType,
        action: ActionType,
        projectile: ProjectileType,
    ) {
        self.weapon_type = Rc::new(weapon_type);
        self.action = action;
        self.projectile = projectile;

        // Size 16 weapons limited to 1
        if self.weapon_type.size == 16 {
            self.w_count = 1;
        }
        self.set_count_internal(self.w_count, false);
    }

    /// Set fixed mounting
    /// TypeScript: SetFixed(use: boolean)
    pub fn set_fixed(&mut self, use_fixed: bool) {
        if use_fixed != self.fixed {
            if use_fixed {
                self.fixed = true;
            } else {
                self.fixed = false;
                self.synchronization = SynchronizationType::None;
            }
        }
    }

    /// Set whether wing mounting is allowed
    /// TypeScript: SetCanWing(can: boolean)
    pub fn set_can_wing(&mut self, can: bool) {
        self.canwing = can;
        if self.wing && !can {
            self.wing = false;
        }
    }

    /// Set wing mounting
    /// TypeScript: SetWing(use: boolean)
    pub fn set_wing(&mut self, use_wing: bool) {
        if use_wing && self.can_wing() {
            self.wing = true;
            self.free_accessible = false;
            self.synchronization = SynchronizationType::None;
        } else {
            self.wing = false;
        }
    }

    /// Set covered status
    /// TypeScript: SetCovered(use: boolean)
    pub fn set_covered(&mut self, use_covered: bool) {
        self.covered = use_covered;
    }

    /// Set accessible status
    /// TypeScript: SetAccessible(use: boolean)
    pub fn set_accessible(&mut self, mut use_accessible: bool) {
        if use_accessible && self.free_accessible {
            use_accessible = false;
        }
        self.accessible = use_accessible;
    }

    /// Set free accessible status
    /// TypeScript: SetFreeAccessible(use: boolean)
    pub fn set_free_accessible(&mut self, use_free_accessible: bool) {
        if use_free_accessible && !self.wing && self.can_free_accessible {
            self.free_accessible = true;
            self.accessible = false;
        } else {
            self.free_accessible = false;
        }
    }

    /// Set synchronization type
    /// TypeScript: SetSynchronization(use: number)
    pub fn set_synchronization(&mut self, sync_type: SynchronizationType) {
        if !self.can_synch(sync_type) {
            self.synchronization = SynchronizationType::None;
        } else {
            self.synchronization = sync_type;
        }

        if self.synchronization == SynchronizationType::Spinner {
            self.w_count = 1;
        }
    }

    /// Set weapon count (UI version - single parameter)
    pub fn set_count(&mut self, count: i16) {
        self.set_count_internal(count, true);
    }

    /// Set weapon count (internal version with calc_stats parameter)
    /// TypeScript: SetCount(use: number, calc_stats: boolean = true)
    pub fn set_count_internal(&mut self, mut count: i16, _calc_stats: bool) {
        // Validate count (NaN check in TypeScript)
        if count < 1 {
            count = 1;
        }
        count = count.max(1);

        // Spinner synchronization forces count to 1
        if self.synchronization == SynchronizationType::Spinner {
            count = 1;
        }

        // Precision Rifle limited to 1
        if self.weapon_type.name == "Precision Rifle" {
            count = 1;
        }

        // Size constraint: total size can't exceed 16
        while count * self.weapon_type.size > 16 {
            count -= 1;
        }

        self.w_count = count;
    }

    /// Set repeating status
    /// TypeScript: SetRepeating(use: boolean)
    pub fn set_repeating(&mut self, use_repeating: bool) {
        if use_repeating && self.can_repeating() {
            self.repeating = true;
        } else {
            self.repeating = false;
        }
    }

    /// Set turret status (external configuration)
    /// TypeScript: SetTurret(is: boolean)
    pub fn set_turret(&mut self, is_turret: bool) {
        self.turret = is_turret;
    }
}
