use super::*;
use crate::json::*;
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Propeller {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        self.idx_prop = js["type"].as_i64().unwrap_or(2) as usize;

        // Handle version compatibility for upgrade deserialization
        if json_version < 11.35 {
            // Old format: used a boolean for "use_variable"
            self.idx_upg = 0;
            if let Some(use_var) = js.get("use_variable") {
                if use_var.as_bool().unwrap_or(false) {
                    self.idx_upg = 1;
                }
            }

            // Special case: prop type 5 was moved to prop type 2 with upgrade 2
            if self.idx_prop == 5 {
                self.idx_upg = 2;
                self.idx_prop = 2;
            }
        } else {
            // New format: direct upgrade index
            self.idx_upg = js["upgrade"].as_i64().unwrap_or(0) as usize;
        }

        // Validate indices
        if self.idx_prop >= self.prop_list.len() {
            self.idx_prop = 0;
        }
        if self.idx_upg >= self.upg_list.len() {
            self.idx_upg = 0;
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("type".to_string(), (self.idx_prop as i64).into());
        map.insert("upgrade".to_string(), (self.idx_upg as i64).into());
        serde_json::Value::Object(map)
    }
}
