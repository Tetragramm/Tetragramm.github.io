use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Munitions {
    /// Load munitions configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    ///
    /// Version compatibility:
    /// - v10.75+: rockets supported
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        self.bomb_count = js["bomb_count"].as_i64().unwrap_or(0) as i16;
        self.internal_bay_count = js["bay_count"].as_i64().unwrap_or(0) as i16;
        self.internal_bay_1 = js["bay1"].as_bool().unwrap_or(false);
        self.internal_bay_2 = js["bay2"].as_bool().unwrap_or(false);

        // Rockets added in version 10.75
        if json_version > 10.75 {
            self.rocket_count = js["rocket_count"].as_i64().unwrap_or(0) as i16;
        } else {
            self.rocket_count = 0;
        }
    }

    /// Save munitions configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "bomb_count": self.bomb_count,
            "rocket_count": self.rocket_count,
            "bay_count": self.internal_bay_count,
            "bay1": self.internal_bay_1,
            "bay2": self.internal_bay_2,
        })
    }
}
