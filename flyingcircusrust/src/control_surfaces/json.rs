use super::*;
use crate::serialization::JSSerializable;
use serde_json::{json, Value};

/// Helper function to ensure boolean array has the correct length
fn bool_arr(val: &Value, target_len: usize) -> Vec<bool> {
    let mut arr = if let Some(a) = val.as_array() {
        a.iter().map(|v| v.as_bool().unwrap_or(false)).collect()
    } else {
        Vec::new()
    };
    arr.resize(target_len, false);
    arr
}

impl JSSerializable for ControlSurfaces {
    fn to_json(&self) -> Value {
        json!({
            "aileron_sel": self.aileron_sel,
            "rudder_sel": self.rudder_sel,
            "elevator_sel": self.elevator_sel,
            "flaps_sel": self.flaps_sel,
            "slats_sel": self.slats_sel,
            "drag_sel": self.drag_sel,
        })
    }

    fn from_json(&mut self, json: &Value, _version: f32) {
        if let Some(val) = json.get("aileron_sel") {
            self.aileron_sel = val.as_i64().unwrap_or(0) as usize;
        }
        if let Some(val) = json.get("rudder_sel") {
            self.rudder_sel = val.as_i64().unwrap_or(0) as usize;
        }
        if let Some(val) = json.get("elevator_sel") {
            self.elevator_sel = val.as_i64().unwrap_or(0) as usize;
        }
        if let Some(val) = json.get("flaps_sel") {
            self.flaps_sel = val.as_i64().unwrap_or(0) as usize;
        }
        if let Some(val) = json.get("slats_sel") {
            self.slats_sel = val.as_i64().unwrap_or(0) as usize;
        }
        if let Some(val) = json.get("drag_sel") {
            self.drag_sel = bool_arr(val, self.drag_list.len());
        }
    }
}
