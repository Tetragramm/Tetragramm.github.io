use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Wings {
    /// Serialize wings configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Serialize full wing list
        s.push_num(self.wing_list.len() as i16)?;
        for wing in &self.wing_list {
            s.push_num(wing.surface as i16)?;
            s.push_num(wing.area)?;
            s.push_num(wing.span)?;
            s.push_num(wing.dihedral)?;
            s.push_num(wing.anhedral)?;
            s.push_bool(wing.gull)?;
            s.push_num(wing.deck as i16)?;
        }

        // Serialize mini wing list
        s.push_num(self.mini_wing_list.len() as i16)?;
        for wing in &self.mini_wing_list {
            s.push_num(wing.surface as i16)?;
            s.push_num(wing.area)?;
            s.push_num(wing.span)?;
            s.push_num(wing.dihedral)?;
            s.push_num(wing.anhedral)?;
            s.push_bool(wing.gull)?;
            s.push_num(wing.deck as i16)?;
        }

        // Serialize global settings
        s.push_num(self.wing_stagger as i16)?;
        s.push_bool(self.is_swept)?;
        s.push_bool(self.is_closed)?;

        Ok(())
    }

    /// Deserialize wings configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize full wing list
        let wing_count = d.get_num()? as usize;
        self.wing_list.clear();

        for _ in 0..wing_count {
            let mut wing = WingType::new();
            wing.surface = d.get_num()? as usize;
            wing.area = d.get_num()?;
            wing.span = d.get_num()?;

            // Version 11.15 added gull field
            if d.version > 11.15 {
                wing.dihedral = d.get_num()?;
                wing.anhedral = d.get_num()?;
                wing.gull = d.get_bool()?;
            } else {
                wing.dihedral = d.get_num()?;
                wing.anhedral = d.get_num()?;
                wing.gull = false; // Legacy: no gull wings
            }

            wing.deck = d.get_num()? as usize;
            self.wing_list.push(wing);
        }

        // Deserialize mini wing list
        let mini_count = d.get_num()? as usize;
        self.mini_wing_list.clear();

        for _ in 0..mini_count {
            let mut wing = WingType::new();
            wing.surface = d.get_num()? as usize;
            wing.area = d.get_num()?;
            wing.span = d.get_num()?;

            // Version 11.15 added gull field
            if d.version > 11.15 {
                wing.dihedral = d.get_num()?;
                wing.anhedral = d.get_num()?;
                wing.gull = d.get_bool()?;
            } else {
                wing.dihedral = d.get_num()?;
                wing.anhedral = d.get_num()?;
                wing.gull = false; // Legacy: no gull wings
            }

            wing.deck = d.get_num()? as usize;
            self.mini_wing_list.push(wing);
        }

        // Deserialize global settings
        self.wing_stagger = d.get_num()? as usize;
        self.is_swept = d.get_bool()?;
        self.is_closed = d.get_bool()?;

        // Run validation to ensure loaded state is valid
        self.verify_all();

        Ok(())
    }
}
