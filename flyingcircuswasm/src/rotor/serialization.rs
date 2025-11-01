use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Rotor {
    /// Serialize rotor configuration to binary format
    /// TypeScript: serialize(s: Serialize)
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.aircraft_type as i16)?;
        s.push_num(self.rotor_count as i16)?;
        s.push_num(self.rotor_span)?;
        s.push_num(self.cantilever_idx as i16)?;
        s.push_num(self.arrangement_sel as i16)?;
        s.push_bool(self.accessory)?;
        s.push_num(self.blade_idx as i16)?;
        s.push_num(self.rotor_thickness)?;
        Ok(())
    }

    /// Deserialize rotor configuration from binary format
    /// TypeScript: deserialise(d: Deserialize)
    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        self.aircraft_type = match d.get_num()? {
            0 => AircraftType::Airplane,
            1 => AircraftType::Helicopter,
            2 => AircraftType::Autogyro,
            3 => AircraftType::OrnithopterBuzzer,
            4 => AircraftType::OrnithopterFlutter,
            _ => AircraftType::Airplane,
        };

        self.rotor_count = d.get_num()? as usize;
        self.rotor_span = d.get_num()?;
        self.cantilever_idx = d.get_num()? as usize;

        // Version 12.35 added arrangement_sel
        if d.version < 12.35 {
            d.get_bool()?; // Skip old boolean field
            self.arrangement_sel = 0;
        } else {
            self.arrangement_sel = d.get_num()? as usize;
        }

        self.accessory = d.get_bool()?;

        // Version 11.55 added blade_idx
        if d.version > 11.55 {
            self.blade_idx = d.get_num()? as usize;
        } else {
            self.blade_idx = 0;
        }

        // Version 12.45 started properly tracking rotor_span
        if d.version < 12.45 {
            self.rotor_span = 0;
        }

        // Version 12.55 added rotor_thickness
        if d.version < 12.55 {
            self.rotor_thickness = 0;
        } else {
            self.rotor_thickness = d.get_num()?;
        }

        // Reset dry_mass_power (recalculated)
        self.dry_mass_power = -1.0;

        // Validate loaded state
        self.verify_all();

        Ok(())
    }
}
