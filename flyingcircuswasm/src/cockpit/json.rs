use super::Cockpit;
use crate::json::{jsboolarr, jsnum};
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Cockpit {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.selected_type = jsnum(js, "type") as usize;
        self.selected_upgrades = jsboolarr(js, "upgrades");
        self.selected_safety = jsboolarr(js, "safety");
        self.selected_gunsights = jsboolarr(js, "sights");
        if self.is_primary() {
            self.selected_upgrades[0] = false;
        }
        if json_version > 10.35 {
            self.bombsight = jsnum(js, "bombsight") as i16;
        }
    }
    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("type".to_string(), self.selected_type.into());
        map.insert(
            "upgrades".to_string(),
            serde_json::Value::Array(
                self.selected_upgrades
                    .iter()
                    .map(|b| serde_json::Value::Bool(*b))
                    .collect(),
            ),
        );
        map.insert(
            "safety".to_string(),
            serde_json::Value::Array(
                self.selected_safety
                    .iter()
                    .map(|b| serde_json::Value::Bool(*b))
                    .collect(),
            ),
        );
        map.insert(
            "sights".to_string(),
            serde_json::Value::Array(
                self.selected_gunsights
                    .iter()
                    .map(|b| serde_json::Value::Bool(*b))
                    .collect(),
            ),
        );
        map.insert("bombsight".to_string(), self.bombsight.into());

        serde_json::Value::Object(map)
    }
}
