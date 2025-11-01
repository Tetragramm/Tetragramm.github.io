use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Rotor {
    /// Load rotor configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        // Parse aircraft type
        self.aircraft_type = match js["type"].as_u64().unwrap_or(0) {
            0 => AircraftType::Airplane,
            1 => AircraftType::Helicopter,
            2 => AircraftType::Autogyro,
            3 => AircraftType::OrnithopterBuzzer,
            4 => AircraftType::OrnithopterFlutter,
            _ => AircraftType::Airplane,
        };

        self.rotor_count = js["rotor_count"].as_u64().unwrap_or(0) as usize;
        self.rotor_span = js["rotor_span"].as_i64().unwrap_or(0) as i16;
        self.cantilever_idx = js["rotor_mat"].as_u64().unwrap_or(0) as usize;

        // Version 12.35 added stagger_sel
        if json_version < 12.35 {
            self.arrangement_sel = 0;
        } else {
            self.arrangement_sel = js["stagger_sel"].as_u64().unwrap_or(0) as usize;
        }

        self.accessory = js["accessory"].as_bool().unwrap_or(false);

        // Version 11.55 added blade_idx
        if json_version > 11.55 {
            self.blade_idx = js["blade_idx"].as_u64().unwrap_or(0) as usize;
        } else {
            self.blade_idx = 0;
        }

        // Version 12.45 started properly tracking rotor_span
        if json_version < 12.45 {
            self.rotor_span = 0;
        }

        // Version 12.55 added rotor_thickness
        if json_version < 12.55 {
            self.rotor_thickness = 0;
        } else {
            self.rotor_thickness = js["rotor_thickness"].as_i64().unwrap_or(0) as i16;
        }

        // Reset dry_mass_power (recalculated)
        self.dry_mass_power = -1.0;

        // Validate loaded state
        self.verify_all();
    }

    /// Save rotor configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "type": self.aircraft_type as u8,
            "rotor_count": self.rotor_count,
            "rotor_span": self.rotor_span,
            "rotor_mat": self.cantilever_idx,
            "stagger_sel": self.arrangement_sel,
            "accessory": self.accessory,
            "blade_idx": self.blade_idx,
            "rotor_thickness": self.rotor_thickness,
        })
    }
}
