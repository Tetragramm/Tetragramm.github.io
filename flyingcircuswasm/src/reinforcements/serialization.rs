use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Reinforcements {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Serialize external wood counts as array
        s.push_num_arr(&self.ext_wood_count)?;

        // Serialize external steel counts as array
        s.push_num_arr(&self.ext_steel_count)?;

        // Serialize cantilever counts as array
        s.push_num_arr(&self.cant_count)?;

        // Serialize wires flag
        s.push_bool(self.wires)?;

        // Serialize cabane selection
        s.push_num(self.cabane_sel)?;

        // Serialize wing blades flag (added in version 10.26+)
        s.push_bool(self.wing_blades)?;

        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize external wood counts
        self.ext_wood_count = d.get_num_arr(self.ext_wood_list.len())?;

        // Deserialize external steel counts
        self.ext_steel_count = d.get_num_arr(self.ext_steel_list.len())?;

        // Deserialize cantilever counts
        self.cant_count = d.get_num_arr(self.cant_list.len())?;

        // Deserialize wires flag
        self.wires = d.get_bool()?;

        // Deserialize cabane selection
        self.cabane_sel = d.get_num()?;

        // Deserialize wing blades flag (version check for backward compatibility)
        if d.version > 10.25 {
            self.wing_blades = d.get_bool()?;
        } else {
            self.wing_blades = false;
        }

        // Version check for cantilever count scaling (version < 10.45)
        if d.version < 10.45 {
            if self.cant_count.len() > 0 {
                self.cant_count[0] *= 2;
            }
            if self.cant_count.len() > 1 {
                self.cant_count[1] *= 2;
            }
            if self.cant_count.len() > 2 {
                self.cant_count[2] *= 3;
            }
            if self.cant_count.len() > 3 {
                self.cant_count[3] *= 2;
            }
        }

        Ok(())
    }
}
