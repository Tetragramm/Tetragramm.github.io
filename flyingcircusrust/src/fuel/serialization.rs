use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Fuel {
    /// Serialize fuel configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Serialize tank counts as array
        s.push_num(self.tank_count.len() as i16)?;
        for count in &self.tank_count {
            s.push_num(*count)?;
        }

        // Serialize boolean flags
        s.push_bool(self.self_sealing)?;
        s.push_bool(self.fire_extinguisher)?;

        Ok(())
    }

    /// Deserialize fuel configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize tank counts
        let count = d.get_num()?;
        self.tank_count.clear();
        for _ in 0..count {
            self.tank_count.push(d.get_num()?);
        }

        // Ensure tank_count matches tank_list length
        while self.tank_count.len() < self.tank_list.len() {
            self.tank_count.push(0);
        }
        self.tank_count.truncate(self.tank_list.len());

        // Deserialize boolean flags
        self.self_sealing = d.get_bool()?;
        self.fire_extinguisher = d.get_bool()?;

        // Reset wing area to trigger recalculation
        self.wing_area = -1.0;

        Ok(())
    }
}
