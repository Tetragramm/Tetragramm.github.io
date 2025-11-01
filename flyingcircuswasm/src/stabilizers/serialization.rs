use super::Stabilizers;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Stabilizers {
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.hstab_sel = d.get_num()?;
        self.hstab_count = d.get_num()?;
        self.vstab_sel = d.get_num()?;
        self.vstab_count = d.get_num()?;

        // Validate after deserialization
        self.verify();

        Ok(())
    }

    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.hstab_sel)?;
        s.push_num(self.hstab_count)?;
        s.push_num(self.vstab_sel)?;
        s.push_num(self.vstab_count)?;
        Ok(())
    }
}
