use super::Cockpit;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Cockpit {
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.selected_type = d.get_num()? as usize;
        self.selected_upgrades = d.get_bool_arr(self.upgrades.len())?;
        self.selected_safety = d.get_bool_arr(self.safety.len())?;
        self.selected_gunsights = d.get_bool_arr(self.gunsights.len())?;
        if self.is_primary() {
            self.selected_upgrades[0] = false;
        }
        if d.version > 10.35 {
            self.bombsight = d.get_num()?;
        }
        Ok(())
    }

    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.selected_type as i16)?;
        s.push_bool_arr(&self.selected_upgrades)?;
        s.push_bool_arr(&self.selected_safety)?;
        s.push_bool_arr(&self.selected_gunsights)?;
        s.push_num(self.bombsight)?;
        Ok(())
    }
}
