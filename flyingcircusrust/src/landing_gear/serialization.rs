use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for LandingGear {
    /// Serialize landing gear configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Serialize gear selection
        s.push_num(self.gear_sel as i16)?;

        // Serialize retract flag
        s.push_bool(self.retract)?;

        // Serialize extra selections as bool array
        s.push_num(self.extra_sel.len() as i16)?;
        for &selected in &self.extra_sel {
            s.push_bool(selected)?;
        }

        Ok(())
    }

    /// Deserialize landing gear configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize gear selection
        self.gear_sel = d.get_num()? as usize;

        // Deserialize retract flag
        self.retract = d.get_bool()?;

        // Deserialize extra selections
        let count = d.get_num()?;
        self.extra_sel.clear();
        for _ in 0..count {
            self.extra_sel.push(d.get_bool()?);
        }

        // Ensure extra_sel length matches extra_list
        while self.extra_sel.len() < self.extra_list.len() {
            self.extra_sel.push(false);
        }
        self.extra_sel.truncate(self.extra_list.len());

        Ok(())
    }
}
