use super::Cockpits;
use crate::cockpit::Cockpit;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Cockpits {
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        let num = d.get_num()? as usize;

        self.positions.clear();
        self.positions.resize_with(num, || {
            Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight)
        });

        for (idx, cp) in self.positions.iter_mut().enumerate() {
            cp.set_seat_index(idx);
            cp.deserialize(d)?;
        }
        Ok(())
    }

    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.positions.len() as i16)?;
        for c in &self.positions {
            c.serialize(s)?;
        }
        Ok(())
    }
}
