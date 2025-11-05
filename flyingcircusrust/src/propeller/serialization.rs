use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Propeller {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.idx_prop as i16)?;
        s.push_num(self.idx_upg as i16)?;
        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.idx_prop = d.get_num()? as usize;

        // Handle version compatibility for upgrade deserialization
        if d.version < 11.35 {
            // Old format: used a boolean for "use_variable"
            let use_variable = d.get_bool()?;
            self.idx_upg = if use_variable { 1 } else { 0 };

            // Special case: prop index 5 was moved to prop index 2 with upgrade 2
            if self.idx_prop == 5 {
                self.idx_upg = 2;
                self.idx_prop = 2;
            }
        } else {
            // New format: direct upgrade index
            self.idx_upg = d.get_num()? as usize;
        }

        // Validate indices
        if self.idx_prop >= self.prop_list.len() {
            self.idx_prop = 0;
        }
        if self.idx_upg >= self.upg_list.len() {
            self.idx_upg = 0;
        }

        Ok(())
    }
}
