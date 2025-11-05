use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Optimization {
    /// Load optimization configuration from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f32) {
        self.free_dots = js["free_dots"].as_i64().unwrap_or(0) as i16;
        self.cost = js["cost"].as_i64().unwrap_or(0) as i16;
        self.bleed = js["bleed"].as_i64().unwrap_or(0) as i16;
        self.escape = js["escape"].as_i64().unwrap_or(0) as i16;
        self.mass = js["mass"].as_i64().unwrap_or(0) as i16;
        self.toughness = js["toughness"].as_i64().unwrap_or(0) as i16;
        self.maxstrain = js["maxstrain"].as_i64().unwrap_or(0) as i16;
        self.reliability = js["reliability"].as_i64().unwrap_or(0) as i16;
        self.drag = js["drag"].as_i64().unwrap_or(0) as i16;

        // Verify configuration after loading
        self.verify_all();
    }

    /// Save optimization configuration to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        json!({
            "free_dots": self.free_dots,
            "cost": self.cost,
            "bleed": self.bleed,
            "escape": self.escape,
            "mass": self.mass,
            "toughness": self.toughness,
            "maxstrain": self.maxstrain,
            "reliability": self.reliability,
            "drag": self.drag,
        })
    }
}
