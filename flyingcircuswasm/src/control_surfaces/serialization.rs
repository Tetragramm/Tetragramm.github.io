use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for ControlSurfaces {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.aileron_sel)?;
        s.push_num(self.rudder_sel)?;
        s.push_num(self.elevator_sel)?;
        s.push_num(self.flaps_sel)?;
        s.push_num(self.slats_sel)?;
        s.push_bool_arr(&self.drag_sel)?;
        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.aileron_sel = d.get_num()?;
        self.rudder_sel = d.get_num()?;
        self.elevator_sel = d.get_num()?;
        self.flaps_sel = d.get_num()?;
        self.slats_sel = d.get_num()?;
        self.drag_sel = d.get_bool_arr(self.drag_list.len())?;

        Ok(())
    }
}
