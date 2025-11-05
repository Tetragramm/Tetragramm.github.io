use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Fuel {
    /// Load fuel configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f32) {
        // Load tank counts
        if let Some(arr) = js["tank_count"].as_array() {
            self.tank_count.clear();
            for val in arr {
                self.tank_count.push(val.as_i64().unwrap_or(0) as i16);
            }
        }

        // Ensure tank_count matches tank_list length
        while self.tank_count.len() < self.tank_list.len() {
            self.tank_count.push(0);
        }
        self.tank_count.truncate(self.tank_list.len());

        // Load boolean flags
        self.self_sealing = js["self_sealing"].as_bool().unwrap_or(false);
        self.fire_extinguisher = js["fire_extinguisher"].as_bool().unwrap_or(false);

        // Reset wing area to trigger recalculation
        self.wing_area = -1.0;
    }

    /// Save fuel configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "tank_count": self.tank_count,
            "self_sealing": self.self_sealing,
            "fire_extinguisher": self.fire_extinguisher,
        })
    }
}
