use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Munitions {
    /// Serialize munitions configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.bomb_count)?;
        s.push_num(self.internal_bay_count)?;
        s.push_bool(self.internal_bay_1)?;
        s.push_bool(self.internal_bay_2)?;
        s.push_num(self.rocket_count)?;

        Ok(())
    }

    /// Deserialize munitions configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    ///
    /// Version compatibility:
    /// - v10.75+: rockets supported
    /// - Before v10.75: no rockets
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.bomb_count = d.get_num()?;
        self.internal_bay_count = d.get_num()?;
        self.internal_bay_1 = d.get_bool()?;
        self.internal_bay_2 = d.get_bool()?;

        // Rockets added in version 10.75
        if d.version > 10.75 {
            self.rocket_count = d.get_num()?;
        } else {
            self.rocket_count = 0;
        }

        Ok(())
    }
}
