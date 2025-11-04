use super::*;
use crate::{
    part_list,
    serialization::{Deserializer, Error, Serializable, Serializer},
};

impl Serializable for Aircraft {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Note: Version string should be written separately by the caller
        // before calling serialize(). Deserializer::new() will read it.

        // Serialize name and all sub-components
        s.push_string(&self.version)?;
        s.push_string(&self.name)?;

        self.era.serialize(s)?;
        self.cockpits.serialize(s)?;
        self.passengers.serialize(s)?;
        self.engines.serialize(s)?;
        self.propeller.serialize(s)?;
        self.frames.serialize(s)?;
        self.wings.serialize(s)?;
        self.stabilizers.serialize(s)?;
        self.controlsurfaces.serialize(s)?;
        self.reinforcements.serialize(s)?;
        self.fuel.serialize(s)?;
        self.munitions.serialize(s)?;
        self.cargo.serialize(s)?;
        self.gear.serialize(s)?;
        self.accessories.serialize(s)?;
        self.optimization.serialize(s)?;
        self.weapons.serialize(s)?;
        self.used.serialize(s)?;
        self.rotor.serialize(s)?;

        // Serialize aircraft type (added in version 11.05)
        s.push_num(self.aircraft_type as i16)?;
        self.alter.serialize(s)?;

        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize version string (already read by Deserializer::new())
        // The version is accessible via d.version
        let _ = d.get_string()?;
        // Deserialize name
        self.name = d.get_string()?;
        // Deserialize all sub-components
        self.era.deserialize(d)?;
        self.cockpits.deserialize(d)?;
        self.passengers.deserialize(d)?;
        self.engines.deserialize(d)?;
        self.propeller.deserialize(d)?;
        self.frames.deserialize(d)?;
        self.wings.deserialize(d)?;
        self.stabilizers.deserialize(d)?;
        self.controlsurfaces.deserialize(d)?;
        self.reinforcements.deserialize(d)?;
        self.fuel.deserialize(d)?;
        self.munitions.deserialize(d)?;
        self.cargo.deserialize(d)?;
        self.gear.deserialize(d)?;
        self.accessories.deserialize(d)?;
        self.optimization.deserialize(d)?;
        self.weapons.deserialize(d)?;

        if d.version > 10.65 {
            self.used.deserialize(d)?;
        }
        // Deserialize aircraft type (added in version 11.05)
        // Check if there's more data to read
        if d.version > 11.05 && d.get_remaining() > 0 {
            self.rotor.deserialize(d)?;
            let acft_type_val = d.get_num()?;
            self.aircraft_type = AircraftType::from(acft_type_val);
        } else {
            self.aircraft_type = AircraftType::Airplane;
        }
        self.rotor.set_type(self.aircraft_type);
        if d.version > 12.25 {
            self.alter.deserialize(d)?;
        } else {
            self.alter.clear_all();
        }

        Ok(())
    }
}
