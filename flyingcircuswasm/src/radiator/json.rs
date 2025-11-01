use super::Radiator;
use crate::json::{jsbool, jsnum};
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Radiator {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.idx_type = jsnum(js, "type") as usize;
        self.idx_mount = jsnum(js, "mount") as usize;
        self.idx_coolant = jsnum(js, "coolant") as usize;
        if json_version > 10.85 {
            self.harden_cool = jsbool(js, "harden_cool");
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("type".to_string(), self.idx_type.into());
        map.insert("mount".to_string(), self.idx_mount.into());
        map.insert("coolant".to_string(), self.idx_coolant.into());
        map.insert("harden_cool".to_string(), self.harden_cool.into());

        serde_json::Value::Object(map)
    }
}
