use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Wings {
    /// Load wings configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.wing_list.clear();
        self.mini_wing_list.clear();

        // Load wing list
        if let Some(wing_arr) = js["wing_list"].as_array() {
            for wing_json in wing_arr {
                let mut wing = WingType::new();
                wing.surface = wing_json["surface"].as_u64().unwrap_or(0) as usize;
                wing.area = wing_json["area"].as_i64().unwrap_or(3) as i16;
                wing.span = wing_json["span"].as_i64().unwrap_or(1) as i16;
                wing.dihedral = wing_json["dihedral"].as_i64().unwrap_or(0) as i16;
                wing.anhedral = wing_json["anhedral"].as_i64().unwrap_or(0) as i16;
                wing.deck = wing_json["deck"].as_u64().unwrap_or(0) as usize;

                // Version 11.15 added gull field
                if json_version > 11.15 {
                    wing.gull = wing_json["gull"].as_bool().unwrap_or(false);
                } else {
                    wing.gull = false; // Legacy: no gull wings
                }

                self.wing_list.push(wing);
            }
        }

        // Load mini wing list
        if let Some(mini_arr) = js["mini_wing_list"].as_array() {
            for wing_json in mini_arr {
                let mut wing = WingType::new();
                wing.surface = wing_json["surface"].as_u64().unwrap_or(0) as usize;
                wing.area = wing_json["area"].as_i64().unwrap_or(2) as i16;
                wing.span = wing_json["span"].as_i64().unwrap_or(1) as i16;
                wing.dihedral = wing_json["dihedral"].as_i64().unwrap_or(0) as i16;
                wing.anhedral = wing_json["anhedral"].as_i64().unwrap_or(0) as i16;
                wing.deck = wing_json["deck"].as_u64().unwrap_or(0) as usize;

                // Version 11.15 added gull field
                if json_version > 11.15 {
                    wing.gull = wing_json["gull"].as_bool().unwrap_or(false);
                } else {
                    wing.gull = false; // Legacy: no gull wings
                }

                self.mini_wing_list.push(wing);
            }
        }

        // Load global settings
        self.wing_stagger = js["wing_stagger"].as_u64().unwrap_or(0) as usize;
        self.is_swept = js["is_swept"].as_bool().unwrap_or(false);
        self.is_closed = js["is_closed"].as_bool().unwrap_or(false);

        // Run validation to ensure loaded state is valid
        self.verify_all();
    }

    /// Save wings configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        // Serialize wing list
        let wings_json: Vec<serde_json::Value> = self
            .wing_list
            .iter()
            .map(|w| {
                json!({
                    "surface": w.surface,
                    "area": w.area,
                    "span": w.span,
                    "dihedral": w.dihedral,
                    "anhedral": w.anhedral,
                    "gull": w.gull,
                    "deck": w.deck,
                })
            })
            .collect();

        // Serialize mini wing list
        let minis_json: Vec<serde_json::Value> = self
            .mini_wing_list
            .iter()
            .map(|w| {
                json!({
                    "surface": w.surface,
                    "area": w.area,
                    "span": w.span,
                    "dihedral": w.dihedral,
                    "anhedral": w.anhedral,
                    "gull": w.gull,
                    "deck": w.deck,
                })
            })
            .collect();

        json!({
            "wing_list": wings_json,
            "mini_wing_list": minis_json,
            "wing_stagger": self.wing_stagger,
            "is_swept": self.is_swept,
            "is_closed": self.is_closed,
        })
    }
}
