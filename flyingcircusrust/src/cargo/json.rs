use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Cargo {
    /// Load cargo configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f32) {
        let space_sel = js["space_sel"].as_u64().unwrap_or(0) as usize;

        // Validate selection is within bounds
        if space_sel >= self.cargo_list.len() {
            self.space_sel = 0;
        } else {
            self.space_sel = space_sel;
        }
    }

    /// Save cargo configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "space_sel": self.space_sel,
        })
    }
}
