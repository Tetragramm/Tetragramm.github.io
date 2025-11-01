use super::Used;
use crate::json::jsnum;
use crate::serialization::JSSerializable;

impl JSSerializable for Used {
    /// Serialize Used to JSON
    /// TypeScript: toJSON()
    fn to_json(&self) -> serde_json::Value {
        serde_json::json!({
            "enabled": true,
            "burnt_out": self.burnt_out,
            "ragged": self.ragged,
            "hefty": self.hefty,
            "sticky_guns": self.sticky_guns,
            "weak": self.weak,
            "fragile": self.fragile,
            "leaky": self.leaky,
            "sluggish": self.sluggish,
        })
    }

    /// Deserialize Used from JSON
    /// TypeScript: fromJSON(js: JSON, json_version: number)
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f64) {
        self.burnt_out = jsnum(js, "burnt_out") as i16;
        self.ragged = jsnum(js, "ragged") as i16;
        self.hefty = jsnum(js, "hefty") as i16;
        self.sticky_guns = jsnum(js, "sticky_guns") as i16;
        self.weak = jsnum(js, "weak") as i16;
        self.fragile = jsnum(js, "fragile") as i16;
        self.leaky = jsnum(js, "leaky") as i16;
        self.sluggish = jsnum(js, "sluggish") as i16;
    }
}
