use super::*;
use crate::serialization::JSSerializable;
use serde_json::Value;

/// Helper to parse boolean array from JSON, padding to target length
fn bool_arr(js: &Value, tgt_length: usize) -> Vec<bool> {
    if let Some(arr) = js.as_array() {
        let mut result: Vec<bool> = arr.iter().map(|v| v.as_bool().unwrap_or(false)).collect();
        while result.len() < tgt_length {
            result.push(false);
        }
        result
    } else {
        vec![false; tgt_length]
    }
}

impl JSSerializable for WeaponSystem {
    /// Convert to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> Value {
        let wlist: Vec<Value> = self.weapons.iter().map(|w| w.to_json()).collect();

        serde_json::json!({
            "weapon_type": self.raw_weapon_type,
            "fixed": self.fixed,
            "directions": self.directions,
            "weapons": wlist,
            "ammo": self.ammo,
            "action": self.action_sel as i16,
            "projectile": self.projectile_sel as i16,
            "repeating": self.repeating,
            "seat": self.seat,
        })
    }

    /// Parse from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &Value, json_version: f32) {
        self.raw_weapon_type = js["weapon_type"].as_u64().unwrap_or(0) as usize;
        self.weapon_type = self.wl_permute[self.raw_weapon_type];
        self.fixed = js["fixed"].as_bool().unwrap_or(false);
        self.directions = bool_arr(&js["directions"], self.directions.len());
        self.weapons = Vec::new();

        self.ammo = js["ammo"].as_i64().unwrap_or(1) as i16;

        if json_version < 10.25 {
            self.action_sel = ActionType::Standard;
            self.projectile_sel = ProjectileType::Bullets;
        } else {
            let action_num = js["action"].as_i64().unwrap_or(0);
            self.action_sel = match action_num {
                0 => ActionType::Standard,
                1 => ActionType::Mechanical,
                2 => ActionType::Gast,
                3 => ActionType::Rotary,
                _ => ActionType::Standard,
            };

            let proj_num = js["projectile"].as_i64().unwrap_or(0);
            self.projectile_sel = match proj_num {
                0 => ProjectileType::Bullets,
                1 => ProjectileType::Heatray,
                2 => ProjectileType::Pneumatic,
                4 => ProjectileType::Gyrojets,
                _ => ProjectileType::Bullets,
            };
        }

        // Handle pneumatic/gyrojet enum reordering in version 11.75
        if json_version < 11.75 {
            if self.projectile_sel == ProjectileType::Pneumatic {
                self.projectile_sel = ProjectileType::Bullets;
            } else if self.projectile_sel == ProjectileType::Gyrojets {
                self.projectile_sel = ProjectileType::Pneumatic;
            }
        }

        self.make_final_weapon();

        // Parse weapons array
        if let Some(weapons_arr) = js["weapons"].as_array() {
            for elem in weapons_arr {
                let mut w = Weapon::new(
                    self.final_weapon.clone(),
                    self.action_sel,
                    self.projectile_sel,
                    self.fixed,
                );
                w.from_json(elem, json_version);
                self.weapons.push(w);
            }
        }

        // Repeating moved from Weapon to WeaponSystem in version 10.95
        if json_version < 10.95 {
            self.repeating = false;
            for w in &self.weapons {
                self.repeating = self.repeating || w.get_repeating();
            }
        } else {
            self.repeating = js["repeating"].as_bool().unwrap_or(false);
        }

        // Seat added in version 11.65
        if json_version > 11.65 {
            self.seat = js["seat"].as_i64().unwrap_or(0) as i16;
        } else {
            self.seat = 0;
        }

        // Update weapons with final weapon type
        self.make_final_weapon();
        for w in &mut self.weapons {
            w.set_weapon_type(
                self.final_weapon.clone(),
                self.action_sel,
                self.projectile_sel,
            );
        }
    }
}
