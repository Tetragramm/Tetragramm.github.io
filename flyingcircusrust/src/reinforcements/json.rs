use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Reinforcements {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        // Deserialize external wood counts
        if let Some(arr) = js["ext_wood_count"].as_array() {
            self.ext_wood_count.clear();
            for val in arr {
                self.ext_wood_count.push(val.as_i64().unwrap_or(0) as i16);
            }
        }
        while self.ext_wood_count.len() < self.ext_wood_list.len() {
            self.ext_wood_count.push(0);
        }
        self.ext_wood_count.truncate(self.ext_wood_list.len());

        // Deserialize external steel counts
        if let Some(arr) = js["ext_steel_count"].as_array() {
            self.ext_steel_count.clear();
            for val in arr {
                self.ext_steel_count.push(val.as_i64().unwrap_or(0) as i16);
            }
        }
        while self.ext_steel_count.len() < self.ext_steel_list.len() {
            self.ext_steel_count.push(0);
        }
        self.ext_steel_count.truncate(self.ext_steel_list.len());

        // Deserialize cantilever counts
        if let Some(arr) = js["cant_count"].as_array() {
            self.cant_count.clear();
            for val in arr {
                self.cant_count.push(val.as_i64().unwrap_or(0) as i16);
            }
        }
        while self.cant_count.len() < self.cant_list.len() {
            self.cant_count.push(0);
        }
        self.cant_count.truncate(self.cant_list.len());

        // Deserialize wires flag
        self.wires = js["wires"].as_bool().unwrap_or(false);

        // Deserialize cabane selection
        self.cabane_sel = js["cabane_sel"].as_i64().unwrap_or(0) as usize;

        // Deserialize wing blades flag (with version check)
        if json_version > 10.25 {
            self.wing_blades = js["wing_blades"].as_bool().unwrap_or(false);
        } else {
            self.wing_blades = false;
        }

        // Version check for cantilever count scaling (version < 10.45)
        if json_version < 10.45 {
            if self.cant_count.len() > 0 {
                self.cant_count[0] *= 2;
            }
            if self.cant_count.len() > 1 {
                self.cant_count[1] *= 2;
            }
            if self.cant_count.len() > 2 {
                self.cant_count[2] *= 3;
            }
            if self.cant_count.len() > 3 {
                self.cant_count[3] *= 2;
            }
        }

        // Validate selections
        if self.cabane_sel as usize >= self.cabane_list.len() {
            self.cabane_sel = 0;
        }

        // Validate counts
        for i in 0..self.ext_wood_count.len() {
            if self.ext_wood_count[i] < 0 {
                self.ext_wood_count[i] = 0;
            }
        }
        for i in 0..self.ext_steel_count.len() {
            if self.ext_steel_count[i] < 0 {
                self.ext_steel_count[i] = 0;
            }
        }
        for i in 0..self.cant_count.len() {
            if self.cant_count[i] < 0 {
                self.cant_count[i] = 0;
            }
        }
    }

    fn to_json(&self) -> serde_json::Value {
        json!({
            "ext_wood_count": self.ext_wood_count,
            "ext_steel_count": self.ext_steel_count,
            "cant_count": self.cant_count,
            "wires": self.wires,
            "cabane_sel": self.cabane_sel,
            "wing_blades": self.wing_blades,
        })
    }
}
