use super::Stabilizers;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Stabilizers {
    fn from_json(&mut self, json: &serde_json::Value, _version: f64) {
        if let Some(val) = json["hstab_sel"].as_i64() {
            self.hstab_sel = val as i16;
        }
        if let Some(val) = json["hstab_count"].as_i64() {
            self.hstab_count = val as i16;
        }
        if let Some(val) = json["vstab_sel"].as_i64() {
            self.vstab_sel = val as i16;
        }
        if let Some(val) = json["vstab_count"].as_i64() {
            self.vstab_count = val as i16;
        }
    }

    fn to_json(&self) -> serde_json::Value {
        json!({
            "hstab_sel": self.hstab_sel,
            "hstab_count": self.hstab_count,
            "vstab_sel": self.vstab_sel,
            "vstab_count": self.vstab_count,
        })
    }
}
