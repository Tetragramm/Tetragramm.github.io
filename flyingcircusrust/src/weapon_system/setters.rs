use super::*;

impl WeaponSystem {
    /// Set selected weapon type
    /// TypeScript: SetWeaponSelected(num: number)
    pub fn set_weapon_selected(&mut self, num: usize) {
        let was_la = self.is_lightning_arc();
        self.weapon_type = num;
        self.raw_weapon_type = self.wl_permute.iter().position(|&v| v == num).unwrap_or(0);

        // Size 16 weapons limited to 1
        if self.weapon_list[num].size == 16 {
            while self.weapons.len() > 1 {
                self.weapons.pop();
            }
        }

        // Validate action/projectile selections
        let wt = &self.weapon_list[num];
        if !wt.can_action || !self.get_can_action()[self.action_sel as usize] {
            self.action_sel = ActionType::Standard;
        }
        if !wt.can_projectile || !self.get_can_projectile()[self.projectile_sel as usize] {
            self.projectile_sel = ProjectileType::Bullets;
        }

        // Handle rapid fire and repeating
        if wt.rapid {
            self.repeating = false;
        } else if !self.repeating && self.action_sel == ActionType::Gast {
            self.action_sel = ActionType::Standard;
        }
        if !self.can_repeating() {
            self.repeating = false;
        }

        self.make_final_weapon();

        // Update all weapon instances
        for w in &mut self.weapons {
            w.set_weapon_type(
                self.final_weapon.clone(),
                self.action_sel,
                self.projectile_sel,
            );
        }

        // Special Case for Lightning Arc
        if self.is_lightning_arc() {
            self.set_fixed(true);
            self.directions[0] = true;
            for i in 1..self.directions.len() {
                self.directions[i] = false;
            }
        }
        if was_la && !self.is_lightning_arc() && !self.weapons.is_empty() {
            self.weapons[0].set_synchronization(SynchronizationType::None);
        }

        // Ensure correct number of mounts
        let count = self.weapons.len();
        self.set_mounting_count(count);
    }

    /// Set repeating option
    /// TypeScript: SetRepeating(use: boolean)
    pub fn set_repeating(&mut self, use_repeating: bool) {
        if use_repeating && self.can_repeating() {
            self.repeating = true;
        } else {
            self.repeating = false;
            let wt = &self.weapon_list[self.weapon_type];
            if !wt.rapid && self.action_sel == ActionType::Gast {
                self.action_sel = ActionType::Standard;
            }
        }

        self.make_final_weapon();
        for w in &mut self.weapons {
            w.set_weapon_type(
                self.final_weapon.clone(),
                self.action_sel,
                self.projectile_sel,
            );
        }
    }

    /// Set fixed mounting
    /// TypeScript: SetFixed(use: boolean)
    pub fn set_fixed(&mut self, mut use_fixed: bool) {
        // Special Case for Lightning Arc
        if self.is_lightning_arc() {
            use_fixed = true;
        }

        if self.fixed != use_fixed {
            self.fixed = use_fixed;
            for w in &mut self.weapons {
                w.set_fixed(self.fixed);
            }

            if use_fixed {
                // Only one direction allowed when fixed
                let mut good = false;
                for i in 0..self.directions.len() {
                    if self.directions[i] && good {
                        self.directions[i] = false;
                    } else if self.directions[i] {
                        good = true;
                    }
                }
            }
        }
    }

    /// Set direction
    /// TypeScript: SetDirection(num: number, use: boolean)
    pub fn set_direction(&mut self, num: usize, mut use_dir: bool) {
        if self.fixed && self.directions[num] && !use_dir {
            use_dir = true; // Can't disable the only direction
        }

        let mut adjusted_num = num;
        if self.fixed {
            self.directions = vec![false; 6];
            if !self.weapons.is_empty() && self.weapons[0].get_arty() && !self.weapons[0].get_wing()
            {
                if adjusted_num == 2 && self.heli {
                    adjusted_num = 3;
                }
            }
        }
        self.directions[adjusted_num] = use_dir;
    }

    /// Set number of weapon mounts (internal version)
    /// TypeScript: SWC(num: number)
    fn set_weapon_count_internal(&mut self, mut num: usize) {
        if num < 1 {
            num = 1;
        }

        while num > self.weapons.len() {
            let w = Weapon::new(
                self.final_weapon.clone(),
                self.action_sel,
                self.projectile_sel,
                self.fixed,
            );
            self.weapons.push(w);
        }
        while num < self.weapons.len() {
            self.weapons.pop();
        }
    }

    /// Set number of weapon mounts
    /// TypeScript: SetMountingCount(num: number)
    pub fn set_mounting_count(&mut self, mut num: usize) {
        if self.final_weapon.size == 16 || self.final_weapon.name == "Precision Rifle" {
            num = 1;
        }
        self.set_weapon_count_internal(num);
    }

    /// Set whether weapons can be freely accessible
    /// TypeScript: SetCanFreelyAccessible(use: boolean)
    pub fn set_can_freely_accessible(&mut self, use_accessible: bool) {
        for w in &mut self.weapons {
            if !w.get_wing() {
                w.can_free_accessible = use_accessible;
            } else {
                w.can_free_accessible = false;
            }
        }
    }

    /// Set tractor/pusher configuration
    /// TypeScript: SetTractorPusher(...)
    #[allow(clippy::too_many_arguments)]
    pub fn set_tractor_pusher(
        &mut self,
        has_t: bool,
        can_spinner_t: bool,
        can_arty_spinner_t: bool,
        has_p: bool,
        can_spinner_p: bool,
        can_arty_spinner_p: bool,
        has_r: bool,
    ) {
        self.tractor = has_t;
        self.pusher = has_p;
        self.heli = has_r;
        self.spinner_t = can_arty_spinner_t;
        self.spinner_p = can_arty_spinner_p;

        // Update synchronization capabilities
        if self.directions[0] && has_t {
            for w in &mut self.weapons {
                if w.get_fixed() && !w.get_wing() {
                    w.can_synchronize = true;
                    println!(
                        "{} {}",
                        can_spinner_t,
                        w.get_synchronization() == SynchronizationType::Spinner
                    );
                    w.can_spinner =
                        can_spinner_t || w.get_synchronization() == SynchronizationType::Spinner;
                    w.can_arty_spinner = can_arty_spinner_t
                        || w.get_synchronization() == SynchronizationType::Spinner;
                } else if !w.get_fixed() && !w.get_wing() {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                } else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        } else if self.directions[1] && has_p {
            for w in &mut self.weapons {
                if w.get_fixed() && !w.get_wing() {
                    w.can_synchronize = true;
                    w.can_spinner =
                        can_spinner_p || w.get_synchronization() == SynchronizationType::Spinner;
                    w.can_arty_spinner = can_arty_spinner_p
                        || w.get_synchronization() == SynchronizationType::Spinner;
                } else if !w.get_fixed() && !w.get_wing() {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                } else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        } else if self.directions[2] && self.heli {
            for w in &mut self.weapons {
                w.can_synchronize = true;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        } else {
            for w in &mut self.weapons {
                w.can_synchronize = false;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        }
    }

    /// Set ammunition count
    /// TypeScript: SetAmmo(num: number)
    pub fn set_ammo(&mut self, mut num: i16) {
        if num < 1 {
            num = 1;
        }
        self.ammo = num;
    }

    /// Set whether aircraft has propeller
    /// TypeScript: SetHavePropeller(have: boolean)
    pub fn set_have_propeller(&mut self, have: bool) {
        if self.has_propeller && !have && self.action_sel == ActionType::Mechanical {
            self.has_propeller = have;
            self.set_action(ActionType::Standard);
        }
        self.has_propeller = have;
    }

    /// Set whether weapons can be wing-mounted
    /// TypeScript: SetCanWing(can: boolean)
    pub fn set_can_wing(&mut self, can: bool) {
        for w in &mut self.weapons {
            w.set_can_wing(can);
        }
    }

    /// Set action type
    /// TypeScript: SetAction(num: number)
    pub fn set_action(&mut self, num: ActionType) {
        if self.final_weapon.can_action {
            self.action_sel = num;
            self.make_final_weapon();
            for w in &mut self.weapons {
                w.set_weapon_type(
                    self.final_weapon.clone(),
                    self.action_sel,
                    self.projectile_sel,
                );
            }
        } else {
            self.action_sel = ActionType::Standard;
        }
    }

    /// Set projectile type
    /// TypeScript: SetProjectile(num: number)
    pub fn set_projectile(&mut self, num: ProjectileType) {
        if self.final_weapon.can_projectile {
            self.projectile_sel = num;
            self.make_final_weapon();
            for w in &mut self.weapons {
                w.set_weapon_type(
                    self.final_weapon.clone(),
                    self.action_sel,
                    self.projectile_sel,
                );
            }
        } else {
            self.projectile_sel = ProjectileType::Bullets;
        }
    }

    /// Set sticky guns penalty
    /// TypeScript: SetStickyGuns(num: number)
    pub fn set_sticky_guns(&mut self, num: i16) {
        self.sticky_guns = num;
    }

    /// Set seat assignment
    /// TypeScript: SetSeat(num: number)
    pub fn set_seat(&mut self, num: i16) {
        self.seat = num;
    }
}
