use super::{Alter, CustomPart};
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Alter {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Count parts with qty > 0
        let mut plist = Vec::new();
        for p in &self.custom_parts {
            if p.qty > 0 {
                plist.push(p);
            }
        }

        s.push_num(plist.len() as i16)?;
        for p in plist {
            s.push_string(&p.name)?;
            p.stats.serialize(s)?;
            s.push_num(p.qty)?;
        }

        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Reset all quantities
        for p in &mut self.custom_parts {
            p.qty = 0;
        }

        let pcount = d.get_num()? as usize;
        for _ in 0..pcount {
            let name = d.get_string()?;
            let mut stats = crate::stats::Stats::new();
            stats.deserialize(d)?;
            let qty = d.get_num()?;

            // Find existing part or add new
            let idx = self.custom_parts.iter().position(|p| p.name == name);
            if let Some(idx) = idx {
                self.custom_parts[idx].qty = qty;
                self.custom_parts[idx].stats = stats;
            } else {
                self.custom_parts.push(CustomPart { name, stats, qty });
            }
        }

        Ok(())
    }
}
