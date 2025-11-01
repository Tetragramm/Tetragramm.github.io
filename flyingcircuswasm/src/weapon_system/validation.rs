use super::*;
use crate::stats::{Era, Warning, WarningLevel, ERA};

impl WeaponSystem {
    /// Calculate final weapon stats based on action and projectile types
    /// TypeScript: MakeFinalWeapon()
    pub(super) fn make_final_weapon(&mut self) {
        let num = self.weapon_type;
        let wt = &self.weapon_list[num];

        // Clone base weapon stats
        self.final_weapon = wt.clone();
        self.final_weapon.stats.eras = vec![];
        self.final_weapon.stats.eras.push(Era {
            name: wt.name.clone(),
            era: string_to_era(&wt.era),
        });

        // Validate action/projectile for weapons without hits
        if wt.hits == 0 {
            if self.action_sel == ActionType::Mechanical {
                self.action_sel = ActionType::Standard;
            }
            if self.projectile_sel == ProjectileType::Gyrojets
                || self.projectile_sel == ProjectileType::Heatray
            {
                self.projectile_sel = ProjectileType::Bullets;
            }
        }

        // Apply action modifications
        match self.action_sel {
            ActionType::Standard => {
                self.final_weapon.hits = wt.hits;
                self.final_weapon.rapid = wt.rapid;
                self.final_weapon.synched = wt.synched;
            }
            ActionType::Mechanical => {
                self.final_weapon.hits = wt.hits;
                self.final_weapon.stats.warnings.push(Warning {
                    name: lu!("Mechanical Action"),
                    warning: lu!("Mechanical Action Warning"),
                    level: WarningLevel::White,
                });
                self.final_weapon.jam = "0/0".to_string();
                self.final_weapon.rapid = true;
                self.final_weapon.stats.cost += wt.stats.cost;
                self.final_weapon.synched = true;
                self.final_weapon.stats.eras.push(Era {
                    name: lu!("Mechanical Action"),
                    era: ERA::WWI,
                });
            }
            ActionType::Gast => {
                self.final_weapon.hits = 2 * wt.hits;
                self.final_weapon.ammo = wt.ammo / 2;
                self.final_weapon.rapid = wt.rapid;
                self.final_weapon.stats.cost += wt.stats.cost;
                self.final_weapon.synched = false;
                self.final_weapon.stats.eras.push(Era {
                    name: lu!("Gast Principle"),
                    era: ERA::WWI,
                });
            }
            ActionType::Rotary => {
                // rotary conversion: 3x hits, awkward +1, can only rapid fire,
                // weapon becomes open bolt but can fire down the spinner,
                // +1 jam, +100% mass, +100% cost
                self.final_weapon.stats.mass += wt.stats.mass;
                self.final_weapon.stats.cost += wt.stats.cost;
                self.final_weapon.size += wt.size;
                self.final_weapon.size = self.final_weapon.size.min(16);
                self.final_weapon.hits = 3 * wt.hits;
                self.final_weapon.deflection -= 1;
                self.final_weapon.synched = false;

                let jams: Vec<&str> = self.final_weapon.jam.split('/').collect();
                let jam1 = if jams.len() > 1 {
                    jams[1].parse::<i16>().unwrap_or(0) + 1
                } else {
                    1
                };
                self.final_weapon.jam = format!("9999/{}", jam1);
                self.final_weapon.stats.eras.push(Era {
                    name: lu!("Rotary_Gun"),
                    era: ERA::WWI,
                });
            }
        }

        // Apply repeating modification
        if self.repeating && self.final_weapon.reload != 0 {
            self.final_weapon.reload = 0;
            self.final_weapon.stats.cost += ((0.5 * wt.stats.cost) as f64).max(1.0);
        }

        // Validate projectile for certain actions
        if (self.action_sel == ActionType::Gast || self.action_sel == ActionType::Mechanical)
            && self.projectile_sel == ProjectileType::Heatray
        {
            self.projectile_sel = ProjectileType::Bullets;
        }

        if (self.action_sel == ActionType::Gast
            || self.action_sel == ActionType::Rotary
            || self.action_sel == ActionType::Mechanical)
            && self.projectile_sel == ProjectileType::Pneumatic
        {
            self.projectile_sel = ProjectileType::Bullets;
        }

        // Apply projectile modifications
        match self.projectile_sel {
            ProjectileType::Heatray => {
                self.final_weapon.stats.cost += wt.stats.cost;
                self.final_weapon.shells = false;
                self.final_weapon.ammo = 0;
                self.final_weapon.deflection = 0;
                self.final_weapon.ap = (self.final_weapon.ap - 1).max(0);
                self.final_weapon.stats.warnings.push(Warning {
                    name: lu!("Heat Ray"),
                    warning: lu!("Heat Ray Warning"),
                    level: WarningLevel::White,
                });
                self.final_weapon.stats.eras.push(Era {
                    name: lu!("Heat Ray"),
                    era: ERA::Himmilgard,
                });
            }
            ProjectileType::Gyrojets => {
                self.final_weapon.stats.cost += ((0.5 * wt.stats.cost) as f64).max(1.0);
                self.final_weapon.shells = false;
                self.final_weapon.damage -= 1.;
                self.final_weapon.stats.warnings.push(Warning {
                    name: lu!("Gyrojets"),
                    warning: lu!("Gyrojets Warning"),
                    level: WarningLevel::White,
                });
                self.final_weapon.stats.eras.push(Era {
                    name: lu!("Gyrojets"),
                    era: ERA::Roaring20s,
                });
            }
            ProjectileType::Pneumatic => {
                self.final_weapon.ammo *= 2;
                self.final_weapon.shells = false;
                if self.final_weapon.rapid {
                    let jams: Vec<&str> = self.final_weapon.jam.split('/').collect();
                    let jam0 = if !jams.is_empty() {
                        jams[0].parse::<i16>().unwrap_or(0)
                    } else {
                        0
                    };
                    self.final_weapon.jam = format!("{}/9999", jam0);
                    self.final_weapon.stats.warnings.push(Warning {
                        name: lu!("Pneumatic"),
                        warning: lu!("Pneumatic Warning 1"),
                        level: WarningLevel::White,
                    });
                    self.final_weapon.stats.eras.push(Era {
                        name: lu!("Pneumatic"),
                        era: ERA::Pioneer,
                    });
                }
                if self.final_weapon.hits > 0 {
                    self.final_weapon.stats.warnings.push(Warning {
                        name: lu!("Pneumatic"),
                        warning: lu!("Pneumatic Warning 2"),
                        level: WarningLevel::White,
                    });
                }
            }
            ProjectileType::Bullets => {
                // No modifications for standard bullets
            }
        }

        // Add deflection warning if applicable
        if self.final_weapon.deflection != 0 {
            self.final_weapon.stats.warnings.push(Warning {
                name: self.final_weapon.name.clone(),
                warning: format!(
                    "{}{}",
                    lu!("Deflection Warning"),
                    self.final_weapon.deflection
                ),
                level: WarningLevel::White,
            });
        }
    }
}

/// Helper to convert string era to ERA enum
fn string_to_era(s: &str) -> ERA {
    match s {
        "Himmilgard" => ERA::Himmilgard,
        "Pioneer" => ERA::Pioneer,
        "WWI" => ERA::WWI,
        "Roaring 20s" | "Roaring20s" => ERA::Roaring20s,
        "Coming Storm" | "ComingStorm" => ERA::ComingStorm,
        "WWII" => ERA::WWII,
        "Last Hurrah" | "LastHurrah" => ERA::LastHurrah,
        _ => ERA::Pioneer, // Default
    }
}
