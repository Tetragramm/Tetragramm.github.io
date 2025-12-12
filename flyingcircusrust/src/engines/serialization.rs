use super::Engines;
use crate::engine::Engine;
use crate::radiator::Radiator;
use crate::serialization::{Error, Serializable};

impl Serializable for Engines {
    fn deserialize(&mut self, d: &mut crate::serialization::Deserializer) -> Result<(), Error> {
        let elen = d.get_num()? as usize;

        self.engines.clear();
        for _ in 0..elen {
            let mut e = Engine::new(self.mounts.clone(), self.cowls.clone());
            e.deserialize(d)?;
            self.engines.push(e);
        }

        let rlen = d.get_num()? as usize;
        self.radiators.clear();
        for _ in 0..rlen {
            let mut r = Radiator::new(
                self.radiator_types.as_ref().clone(),
                self.radiator_mounts.as_ref().clone(),
                self.radiator_coolants.as_ref().clone(),
            );
            r.deserialize(d)?;
            self.radiators.push(r);
        }
        self.is_asymmetric = d.get_bool()?;
        Ok(())
    }

    fn serialize(&self, s: &mut crate::serialization::Serializer) -> Result<(), Error> {
        s.push_num(self.engines.len() as i16)?;
        for e in &self.engines {
            e.serialize(s)?;
        }

        s.push_num(self.radiators.len() as i16)?;
        for r in &self.radiators {
            r.serialize(s)?;
        }
        s.push_bool(self.is_asymmetric)?;
        Ok(())
    }
}
