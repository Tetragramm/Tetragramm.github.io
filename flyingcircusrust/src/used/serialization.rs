use super::Used;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Used {
    /// Serialize Used to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_bool(true)?; // enabled flag
        s.push_num(self.burnt_out)?;
        s.push_num(self.ragged)?;
        s.push_num(self.hefty)?;
        s.push_num(self.sticky_guns)?;
        s.push_num(self.weak)?;
        s.push_num(self.fragile)?;
        s.push_num(self.leaky)?;
        s.push_num(self.sluggish)?;
        Ok(())
    }

    /// Deserialize Used from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        let _enabled = d.get_bool()?; // Read enabled flag but don't use it
        self.burnt_out = d.get_num()?;
        self.ragged = d.get_num()?;
        self.hefty = d.get_num()?;
        self.sticky_guns = d.get_num()?;
        self.weak = d.get_num()?;
        self.fragile = d.get_num()?;
        self.leaky = d.get_num()?;
        self.sluggish = d.get_num()?;
        Ok(())
    }
}
