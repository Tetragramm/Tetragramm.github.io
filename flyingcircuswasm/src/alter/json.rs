use super::{Alter, CustomPart};
use crate::json::vstr;
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Alter {
    fn from_json(&mut self, json: &serde_json::Value, _version: f64) {
        // Reset all quantities first
        for p in &mut self.custom_parts {
            p.qty = 0;
        }

        // Load part_list from JSON
        if let Some(part_list) = json.get("part_list") {
            if let Some(parts) = part_list.as_array() {
                for part_json in parts {
                    let name = part_json
                        .get("name")
                        .map(|v| vstr(v))
                        .unwrap_or_default();
                    let qty = part_json
                        .get("qty")
                        .and_then(|v| v.as_i64())
                        .unwrap_or(0) as i16;

                    // Find existing part or add new
                    let idx = self.custom_parts.iter().position(|p| p.name == name);
                    if let Some(idx) = idx {
                        self.custom_parts[idx].qty = qty;
                        // Update stats from JSON
                        if let Some(stats_json) = part_json.get("stats") {
                            self.custom_parts[idx].stats.from_json(stats_json, _version);
                        }
                    } else {
                        let mut stats = crate::stats::Stats::new();
                        if let Some(stats_json) = part_json.get("stats") {
                            stats.from_json(stats_json, _version);
                        }
                        self.custom_parts.push(CustomPart {
                            name,
                            stats,
                            qty,
                        });
                    }
                }
            }
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut part_list = Vec::new();

        // Only include parts with qty > 0 in serialization
        for p in &self.custom_parts {
            if p.qty > 0 {
                let mut part_obj = Map::new();
                part_obj.insert("name".to_string(), p.name.clone().into());
                part_obj.insert("stats".to_string(), p.stats.to_json());
                part_obj.insert("qty".to_string(), p.qty.into());
                part_list.push(serde_json::Value::Object(part_obj));
            }
        }

        let mut result = Map::new();
        result.insert("part_list".to_string(), part_list.into());
        serde_json::Value::Object(result)
    }
}
