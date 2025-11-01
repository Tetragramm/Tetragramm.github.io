use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Weapon {
    /// Load weapon configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    ///
    /// Version compatibility:
    /// - v10.95+: no repeating flag
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.fixed = js["fixed"].as_bool().unwrap_or(false);
        self.wing = js["wing"].as_bool().unwrap_or(true);
        self.covered = js["covered"].as_bool().unwrap_or(false);
        self.accessible = js["accessible"].as_bool().unwrap_or(false);
        self.free_accessible = js["free_accessible"].as_bool().unwrap_or(false);

        let sync_val = js["synchronization"].as_i64().unwrap_or(-1) as i16;
        self.synchronization = SynchronizationType::from(sync_val);

        self.w_count = js["w_count"].as_i64().unwrap_or(1) as i16;

        // Repeating flag removed in version 10.95
        if json_version < 10.95 {
            self.repeating = js["repeating"].as_bool().unwrap_or(false);
        }
    }

    /// Save weapon configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "fixed": self.fixed,
            "wing": self.wing,
            "covered": self.covered,
            "accessible": self.accessible,
            "free_accessible": self.free_accessible,
            "synchronization": self.synchronization as i16,
            "w_count": self.w_count,
        })
    }
}
