use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Weapons {
    /// Serialize weapons to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.weapon_sets.len() as i16)?;
        for ws in &self.weapon_sets {
            ws.serialize(s)?;
        }
        s.push_num(self.brace_count)?;
        Ok(())
    }

    /// Deserialize weapons from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.weapon_sets = Vec::new();

        let wlen = d.get_num()? as usize;
        for _ in 0..wlen {
            let mut ws = WeaponSystem::new(self.weapon_list.clone(), self.wl_permute.clone());
            ws.deserialize(d)?;
            self.weapon_sets.push(ws);
        }

        if d.version > 10.35 {
            self.brace_count = d.get_num()?;
        } else {
            self.brace_count = 0;
        }

        Ok(())
    }
}
