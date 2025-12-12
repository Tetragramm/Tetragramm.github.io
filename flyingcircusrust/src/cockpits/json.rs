use serde_json::Map;

use super::Cockpits;
use crate::cockpit::Cockpit;
use crate::json::jsarr;
use crate::serialization::JSSerializable;

impl JSSerializable for Cockpits {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        let arr = jsarr(js, "positions");

        self.positions.clear();
        self.positions.resize_with(arr.len(), || {
            Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight)
        });

        for (idx, c_js) in arr.iter().enumerate() {
            let cp = &mut self.positions[idx];
            cp.set_seat_index(idx);
            cp.from_json(c_js, json_version);
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();

        // Add version
        map.insert(
            "positions".to_string(),
            serde_json::Value::Array(
                self.positions
                    .iter()
                    .map(|c: &Cockpit| c.to_json())
                    .collect(),
            ),
        );
        serde_json::Value::Object(map)
    }
}
