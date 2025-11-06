use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for ControlSurfaces {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.aileron_sel as i16)?;
        s.push_num(self.rudder_sel as i16)?;
        s.push_num(self.elevator_sel as i16)?;
        s.push_num(self.flaps_sel as i16)?;
        s.push_num(self.slats_sel as i16)?;
        s.push_bool_arr(&self.drag_sel)?;
        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.aileron_sel = d.get_num()? as usize;
        self.rudder_sel = d.get_num()? as usize;
        self.elevator_sel = d.get_num()? as usize;
        self.flaps_sel = d.get_num()? as usize;
        self.slats_sel = d.get_num()? as usize;
        self.drag_sel = d.get_bool_arr(self.drag_list.len())?;

        Ok(())
    }
}
