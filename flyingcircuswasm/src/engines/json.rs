use super::Engines;
use crate::engine::Engine;
use crate::json::{jsarr_opt, jsbool};
use crate::radiator::Radiator;
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Engines {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        // Deserialize radiators first
        self.radiators.clear();
        if let Some(rads) = jsarr_opt(js, "radiators") {
            for rad_json in rads {
                let mut rad = Radiator::new(
                    self.radiator_types.as_ref().clone(),
                    self.radiator_mounts.as_ref().clone(),
                    self.radiator_coolants.as_ref().clone(),
                );
                rad.from_json(rad_json, json_version);
                self.radiators.push(rad);
            }
        }

        // Deserialize engines
        self.engines.clear();
        if let Some(engs) = jsarr_opt(js, "engines") {
            for eng_json in engs {
                let mut eng = Engine::new(self.mounts.clone(), self.cowls.clone());
                eng.from_json(eng_json, json_version);
                self.engines.push(eng);
            }
        }

        self.is_asymmetric = jsbool(js, "is_asymmetric");
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();

        let engines_arr: Vec<serde_json::Value> =
            self.engines.iter().map(|e| e.to_json()).collect();
        map.insert("engines".to_string(), serde_json::Value::Array(engines_arr));

        let radiators_arr: Vec<serde_json::Value> =
            self.radiators.iter().map(|r| r.to_json()).collect();
        map.insert(
            "radiators".to_string(),
            serde_json::Value::Array(radiators_arr),
        );

        map.insert("is_asymmetric".to_string(), self.is_asymmetric.into());

        serde_json::Value::Object(map)
    }
}
