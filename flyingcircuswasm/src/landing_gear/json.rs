use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for LandingGear {
    /// Load landing gear configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f64) {
        // Load gear selection
        self.gear_sel = js["gear_sel"].as_i64().unwrap_or(0) as usize;

        // Load retract flag
        self.retract = js["retract"].as_bool().unwrap_or(false);

        // Load extra selections
        if let Some(arr) = js["extra_sel"].as_array() {
            self.extra_sel.clear();
            for val in arr {
                self.extra_sel.push(val.as_bool().unwrap_or(false));
            }
        }

        // Ensure extra_sel length matches extra_list
        while self.extra_sel.len() < self.extra_list.len() {
            self.extra_sel.push(false);
        }
        self.extra_sel.truncate(self.extra_list.len());

        // Verify configuration after loading
        self.verify_all();
    }

    /// Save landing gear configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "gear_sel": self.gear_sel,
            "retract": self.retract,
            "extra_sel": self.extra_sel,
        })
    }
}
