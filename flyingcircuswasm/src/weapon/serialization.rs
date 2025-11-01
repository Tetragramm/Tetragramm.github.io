use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Weapon {
    /// Serialize weapon configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_bool(self.fixed)?;
        s.push_bool(self.wing)?;
        s.push_bool(self.covered)?;
        s.push_bool(self.accessible)?;
        s.push_bool(self.free_accessible)?;
        s.push_num(self.synchronization as i16)?;
        s.push_num(self.w_count)?;

        Ok(())
    }

    /// Deserialize weapon configuration from binary format
    /// TypeScript: deserialize(d: Deserialize)
    ///
    /// Version compatibility:
    /// - v10.95+: no repeating flag
    /// - Before v10.95: repeating flag present
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.fixed = d.get_bool()?;
        self.wing = d.get_bool()?;
        self.covered = d.get_bool()?;
        self.accessible = d.get_bool()?;
        self.free_accessible = d.get_bool()?;
        let sync_val: i16 = d.get_num()?;
        self.synchronization = SynchronizationType::from(sync_val);
        self.w_count = d.get_num()?;

        // Repeating flag removed in version 10.95
        if d.version < 10.95 {
            self.repeating = d.get_bool()?;
        }

        Ok(())
    }
}
