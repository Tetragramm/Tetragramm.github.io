use super::Radiator;
use crate::serialization::{Error, Serializable};

impl Serializable for Radiator {
    fn deserialize(&mut self, d: &mut crate::serialization::Deserializer) -> Result<(), Error> {
        self.idx_type = d.get_num()? as usize;
        self.idx_mount = d.get_num()? as usize;
        self.idx_coolant = d.get_num()? as usize;
        if d.version > 10.85 {
            self.harden_cool = d.get_bool()?;
        }
        Ok(())
    }

    fn serialize(&self, s: &mut crate::serialization::Serializer) -> Result<(), Error> {
        s.push_num(self.idx_type as i16)?;
        s.push_num(self.idx_mount as i16)?;
        s.push_num(self.idx_coolant as i16)?;
        s.push_bool(self.harden_cool)?;
        Ok(())
    }
}
