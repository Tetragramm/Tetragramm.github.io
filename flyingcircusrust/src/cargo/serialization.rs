use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Cargo {
    /// Serialize cargo configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.space_sel as i16)?;
        Ok(())
    }

    /// Deserialize cargo configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        let space_sel = d.get_num()? as usize;

        // Validate selection is within bounds
        if space_sel >= self.cargo_list.len() {
            self.space_sel = 0;
        } else {
            self.space_sel = space_sel;
        }

        Ok(())
    }
}
