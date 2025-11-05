use super::*;
use crate::serialization::JSSerializable;
use serde_json::Value;

impl JSSerializable for Weapons {
    /// Convert to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> Value {
        let lst: Vec<Value> = self.weapon_sets.iter().map(|ws| ws.to_json()).collect();

        serde_json::json!({
            "weapon_systems": lst,
            "brace_count": self.brace_count,
        })
    }

    /// Parse from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &Value, json_version: f32) {
        self.weapon_sets = Vec::new();

        if let Some(lst) = js["weapon_systems"].as_array() {
            for wsj in lst {
                let mut ws = WeaponSystem::new(self.weapon_list.clone(), self.wl_permute.clone());
                ws.from_json(wsj, json_version);
                self.weapon_sets.push(ws);
            }
        }

        if json_version > 10.35 {
            self.brace_count = js["brace_count"].as_i64().unwrap_or(0) as i16;
        } else {
            self.brace_count = 0;
        }
    }
}
