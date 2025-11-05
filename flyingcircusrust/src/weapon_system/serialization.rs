use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for WeaponSystem {
    /// Serialize weapon system to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.raw_weapon_type as i16)?;
        s.push_bool(self.fixed)?;
        s.push_bool_arr(&self.directions)?;
        s.push_num(self.ammo)?;
        s.push_num(self.weapons.len() as i16)?;
        for w in &self.weapons {
            w.serialize(s)?;
        }
        s.push_num(self.action_sel as i16)?;
        s.push_num(self.projectile_sel as i16)?;
        s.push_bool(self.repeating)?;
        s.push_num(self.seat)?;
        Ok(())
    }

    /// Deserialize weapon system from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.raw_weapon_type = d.get_num()? as usize;
        self.weapon_type = self.wl_permute[self.raw_weapon_type];
        self.fixed = d.get_bool()?;
        self.directions = d.get_bool_arr(self.directions.len())?;
        self.ammo = d.get_num()?;

        let wlen = d.get_num()? as usize;
        self.weapons = Vec::new();
        self.make_final_weapon();

        for _ in 0..wlen {
            let mut w = Weapon::new(
                self.final_weapon.clone(),
                self.action_sel,
                self.projectile_sel,
                self.fixed,
            );
            w.deserialize(d)?;
            self.weapons.push(w);
        }

        if d.version < 10.25 {
            self.action_sel = ActionType::Standard;
            self.projectile_sel = ProjectileType::Bullets;
        } else {
            let action_num = d.get_num()?;
            self.action_sel = match action_num {
                0 => ActionType::Standard,
                1 => ActionType::Mechanical,
                2 => ActionType::Gast,
                3 => ActionType::Rotary,
                _ => ActionType::Standard,
            };

            let proj_num = d.get_num()?;
            self.projectile_sel = match proj_num {
                0 => ProjectileType::Bullets,
                1 => ProjectileType::Heatray,
                2 => ProjectileType::Pneumatic,
                4 => ProjectileType::Gyrojets,
                _ => ProjectileType::Bullets,
            };
        }

        // Handle pneumatic/gyrojet enum reordering in version 11.75
        if d.version < 11.75 {
            if self.projectile_sel == ProjectileType::Pneumatic {
                self.projectile_sel = ProjectileType::Bullets;
            } else if self.projectile_sel == ProjectileType::Gyrojets {
                self.projectile_sel = ProjectileType::Pneumatic;
            }
        }

        // Repeating moved from Weapon to WeaponSystem in version 10.95
        if d.version < 10.95 {
            self.repeating = false;
            for w in &self.weapons {
                self.repeating = self.repeating || w.get_repeating();
            }
        } else {
            self.repeating = d.get_bool()?;
        }

        // Seat added in version 11.65
        if d.version > 11.65 {
            self.seat = d.get_num()?;
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

        Ok(())
    }
}
