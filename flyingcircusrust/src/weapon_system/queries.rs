use super::*;
use crate::part::Part;

#[derive(serde::Serialize)]
pub struct WeaponSystemDerivedStats {
    pub hits: String,  // "X/Y/Z/W" format
    pub damage: i16,
    pub shots: i16,
    pub jam: String,
    pub hr_charges: String,  // For heat rays, "/" separated
    pub mounting: String,  // "Fixed", "Flexible", or "Turret"
    pub is_heat_ray: bool,  // True if projectile is heat ray or Lightning Arc
}

impl WeaponSystem {
    /// Get selected weapon type index
    /// TypeScript: GetWeaponSelected()
    pub fn get_weapon_selected(&self) -> usize {
        self.weapon_type
    }

    /// Check if repeating is allowed for current weapon
    /// TypeScript: CanRepeating()
    pub fn can_repeating(&self) -> bool {
        let wt = &self.weapon_list[self.weapon_type];
        (!wt.rapid || wt.reload > 0) && wt.ammo > 0 && wt.name != "Precision Rifle"
    }

    /// Get repeating status
    /// TypeScript: GetRepeating()
    pub fn get_repeating(&self) -> bool {
        self.repeating
    }

    /// Get fixed mounting status
    /// TypeScript: GetFixed()
    pub fn get_fixed(&self) -> bool {
        self.fixed
    }

    /// Get available direction options
    /// TypeScript: CanDirection()
    pub fn can_direction(&self) -> Vec<bool> {
        if self.is_lightning_arc() {
            return vec![false; self.directions.len()];
        }

        let mut directions = vec![true; self.directions.len()];
        if !self.weapons.is_empty()
            && self.weapons[0].get_arty()
            && self.fixed
            && !self.weapons[0].get_wing()
        {
            if self.heli {
                directions[2] = false;
            }
        }
        directions
    }

    /// Get current direction settings
    /// TypeScript: GetDirection()
    pub fn get_direction(&self) -> &Vec<bool> {
        &self.directions
    }

    /// Get number of weapon mounts
    /// TypeScript: GetMountingCount()
    pub fn get_mounting_count(&self) -> usize {
        self.weapons.len()
    }

    /// Get total weapon count (sum of all weapon counts)
    /// TypeScript: GetWeaponCount()
    pub fn get_weapon_count(&self) -> i16 {
        self.weapons.iter().map(|w| w.get_count()).sum()
    }

    /// Get weapon instances
    /// TypeScript: GetWeapons()
    pub fn get_weapons(&self) -> &Vec<Weapon> {
        &self.weapons
    }

    /// Get mutable weapon instances
    pub fn get_weapons_mut(&mut self) -> &mut Vec<Weapon> {
        &mut self.weapons
    }

    /// Get current action type
    /// TypeScript: GetAction()
    pub fn get_action(&self) -> ActionType {
        self.action_sel
    }

    /// Get available action types
    /// TypeScript: GetCanAction()
    pub fn get_can_action(&self) -> Vec<bool> {
        let wt = &self.weapon_list[self.weapon_type];
        vec![
            true, // Standard always available
            self.has_propeller && wt.can_action && wt.hits > 0 && (self.repeating || wt.rapid),
            wt.can_action && (self.repeating || wt.rapid),
            wt.can_action && wt.rapid,
        ]
    }

    /// Get current projectile type
    /// TypeScript: GetProjectile()
    pub fn get_projectile(&self) -> ProjectileType {
        self.projectile_sel
    }

    /// Get available projectile types
    /// TypeScript: GetCanProjectile()
    pub fn get_can_projectile(&self) -> Vec<bool> {
        let wt = &self.weapon_list[self.weapon_type];
        vec![
            true, // Bullets always available
            self.final_weapon.can_projectile
                && self.action_sel != ActionType::Mechanical
                && self.action_sel != ActionType::Gast
                && wt.hits > 0,
            self.final_weapon.can_projectile
                && self.action_sel != ActionType::Rotary
                && self.action_sel != ActionType::Gast
                && self.action_sel != ActionType::Mechanical,
        ]
    }

    /// Get final calculated weapon type
    /// TypeScript: GetFinalWeapon()
    pub fn get_final_weapon(&self) -> &WeaponType {
        &self.final_weapon
    }

    /// Get weapon damage
    /// TypeScript: GetDamage()
    pub fn get_damage(&self) -> i16 {
        (1.0e-6 + self.final_weapon.damage).floor() as i16
    }

    /// Get ammunition count
    /// TypeScript: GetAmmo()
    pub fn get_ammo(&self) -> i16 {
        self.ammo
    }

    /// Check if weapon type is plural
    /// TypeScript: IsPlural()
    pub fn is_plural(&self) -> bool {
        self.weapons.len() > 1 || (!self.weapons.is_empty() && self.weapons[0].get_count() > 1)
    }

    /// Get total shots available
    /// TypeScript: GetShots()
    pub fn get_shots(&self) -> i16 {
        1.max((self.final_weapon.ammo * self.ammo) as i16)
    }

    /// Check if weapon is Lightning Arc
    /// TypeScript: IsLightningArc()
    pub fn is_lightning_arc(&self) -> bool {
        self.final_weapon.name == "Lightning Arc"
    }

    /// Get reload time
    /// TypeScript: GetReload()
    pub fn get_reload(&self) -> i16 {
        self.final_weapon.reload
    }

    /// Get total wing-mounted weapon weight
    /// TypeScript: GetWingWeight()
    pub fn get_wing_weight(&mut self) -> f32 {
        self.weapons
            .iter_mut()
            .filter(|w| w.get_wing())
            .map(|w| w.part_stats().mass)
            .sum()
    }

    /// Get number of enabled directions
    /// TypeScript: GetDirectionCount()
    pub fn get_direction_count(&self) -> usize {
        self.directions.iter().filter(|&&d| d).count()
    }

    /// Get seat assignment
    /// TypeScript: GetSeat()
    pub fn get_seat(&self) -> i16 {
        self.seat
    }

    /// Check if all weapons are accessible
    /// TypeScript: GetIsFullyAccessible()
    pub fn get_is_fully_accessible(&self) -> bool {
        self.weapons.iter().all(|w| w.get_accessible())
    }

    /// Check if any weapons are accessible
    /// TypeScript: GetIsPartlyAccessible()
    pub fn get_is_partly_accessible(&self) -> bool {
        self.weapons.iter().any(|w| w.get_accessible())
    }

    /// Get hits at various ranges
    /// TypeScript: GetHits()
    /// Returns [point blank, close, long, extreme]
    pub fn get_hits(&self) -> [i16; 4] {
        let hits = self.final_weapon.hits;
        if hits != 0 {
            let mut centerline = 0;
            let mut wings = 0;
            for w in &self.weapons {
                if w.get_wing() && (w.get_fixed() || self.get_direction_count() <= 2) {
                    wings += w.get_count() * hits;
                } else {
                    centerline += w.get_count() * hits;
                }
            }
            [
                centerline + wings,
                ((1.0e-6 + centerline as f32 * 0.75).floor() as i16)
                    + ((1.0e-6 + wings as f32 * 0.9).floor() as i16),
                ((1.0e-6 + centerline as f32 * 0.5).floor() as i16)
                    + ((1.0e-6 + wings as f32 * 0.2).floor() as i16),
                ((1.0e-6 + centerline as f32 * 0.25).floor() as i16)
                    + ((1.0e-6 + wings as f32 * 0.1).floor() as i16),
            ]
        } else {
            if self.is_lightning_arc() {
                [0, 0, 0, 0]
            } else if self.final_weapon.ammo == 0 {
                // Fliergerflammenwerfer
                let count: i16 = self.weapons.iter().map(|w| w.get_count()).sum();
                [3 * count, 0, 0, 0]
            } else {
                // Scatterguns
                let mut count: i16 = self.weapons.iter().map(|w| w.get_count()).sum();
                if self.action_sel == ActionType::Gast {
                    count *= 2;
                }
                [3 * count, 2 * count, 1 * count, 0]
            }
        }
    }

    /// Get jam numbers
    /// TypeScript: GetJam()
    pub fn get_jam(&self) -> String {
        if self.final_weapon.rapid {
            let mut jams = [0i16, 0i16];
            for w in &self.weapons {
                let t = w.get_jam();
                jams[0] = jams[0].max(t.0 + self.sticky_guns);
                jams[1] = jams[1].max(t.1 + self.sticky_guns);
            }
            format!("{}/{}", jams[0], jams[1])
        } else {
            let mut jam = 0i16;
            for w in &self.weapons {
                let t = w.get_jam();
                jam = jam.max(t.0 + self.sticky_guns);
            }
            format!("{}", jam)
        }
    }

    /// Get heat ray charges per shot
    /// TypeScript: GetHRCharges()
    pub fn get_hr_charges(&self) -> Vec<i16> {
        if self.is_lightning_arc() {
            return vec![3];
        }

        let count: i16 = self.weapons.iter().map(|w| w.get_count()).sum();
        let wt = &self.weapon_list[self.weapon_type];

        if self.final_weapon.hits > 0 {
            // Calc charges/shot
            let mut ammo = wt.stats.cost as i16;
            if self.action_sel == ActionType::Rotary {
                ammo *= 2;
            }

            if self.final_weapon.rapid {
                vec![
                    count * ammo,
                    (count * ammo + 1).max((1.5 * count as f32 * ammo as f32) as i16),
                ]
            } else {
                vec![count * ammo]
            }
        } else {
            if self.final_weapon.name == "Scattergun" {
                // 4 shot dice, d5, half damage
                if !self.final_weapon.rapid {
                    vec![(3.0 * 5.0 * 0.5 / 4.0) as i16]
                } else {
                    vec![
                        (3.0 * 5.0 * 0.5 / 4.0) as i16,
                        (5.0 * 5.0 * 0.5 / 4.0) as i16,
                    ]
                }
            } else if self.final_weapon.name == "Punt Gun" {
                // 4 shot dice, d10, half damage
                if !self.final_weapon.rapid {
                    vec![(3.0 * 10.0 * 0.5 / 4.0) as i16]
                } else {
                    vec![
                        (3.0 * 10.0 * 0.5 / 4.0) as i16,
                        (5.0 * 10.0 * 0.5 / 4.0) as i16,
                    ]
                }
            } else {
                vec![]
            }
        }
    }

    /// Get derived stats for display
    /// Returns formatted strings for hits, damage, shots, jam, and mounting type
    pub fn get_derived_stats(&self) -> WeaponSystemDerivedStats {
        let hits = self.get_hits();
        let hits_str = format!("{}/{}/{}/{}", hits[0], hits[1], hits[2], hits[3]);

        let damage = self.get_damage();
        let shots = self.get_shots();
        let jam = self.get_jam();

        let hr_charges_vec = self.get_hr_charges();
        let hr_charges = hr_charges_vec
            .iter()
            .map(|c| c.to_string())
            .collect::<Vec<_>>()
            .join("/");

        let mounting = if self.get_fixed() {
            "Fixed".to_string()
        } else if self.get_direction_count() <= 2 {
            "Flexible".to_string()
        } else {
            "Turret".to_string()
        };

        let is_heat_ray = self.get_projectile() == ProjectileType::Heatray || self.is_lightning_arc();

        WeaponSystemDerivedStats {
            hits: hits_str,
            damage,
            shots,
            jam,
            hr_charges,
            mounting,
            is_heat_ray,
        }
    }
}
