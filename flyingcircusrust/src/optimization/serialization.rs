use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Optimization {
    /// Serialize optimization configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.free_dots)?;
        s.push_num(self.cost)?;
        s.push_num(self.bleed)?;
        s.push_num(self.escape)?;
        s.push_num(self.mass)?;
        s.push_num(self.toughness)?;
        s.push_num(self.maxstrain)?;
        s.push_num(self.reliability)?;
        s.push_num(self.drag)?;
        Ok(())
    }

    /// Deserialize optimization configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.free_dots = d.get_num()?;
        self.cost = d.get_num()?;
        self.bleed = d.get_num()?;
        self.escape = d.get_num()?;
        self.mass = d.get_num()?;
        self.toughness = d.get_num()?;
        self.maxstrain = d.get_num()?;
        self.reliability = d.get_num()?;
        self.drag = d.get_num()?;

        // Verify configuration after deserialization
        self.verify_all();

        Ok(())
    }
}
