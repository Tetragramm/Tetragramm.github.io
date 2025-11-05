use super::*;
use crate::serialization::JSSerializable;
use serde_json::json;

impl JSSerializable for Accessories {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        // Reset state
        self.vital_parts = 99;
        self.skin_armour = 0;

        // Deserialize armour coverage
        if let Some(arr) = js["armour_coverage"].as_array() {
            self.armour_coverage.clear();
            for val in arr {
                self.armour_coverage.push(val.as_i64().unwrap_or(0) as i16);
            }
        }
        while self.armour_coverage.len() < 8 {
            self.armour_coverage.push(0);
        }
        self.armour_coverage.truncate(8);

        // Deserialize electrical counts (with version check)
        if json_version < 11.85 {
            if let Some(arr) = js["electrical_count"].as_array() {
                let mut counts = Vec::new();
                for val in arr {
                    counts.push(val.as_i64().unwrap_or(0) as i16);
                }
                if counts.len() > 1 {
                    counts[0] += counts[1];
                    counts.remove(1);
                }
                self.electrical_count = counts;
            }
        } else {
            if let Some(arr) = js["electrical_count"].as_array() {
                self.electrical_count.clear();
                for val in arr {
                    self.electrical_count.push(val.as_i64().unwrap_or(0) as i16);
                }
            }
        }
        while self.electrical_count.len() < self.electrical_list.len() {
            self.electrical_count.push(0);
        }
        self.electrical_count.truncate(self.electrical_list.len());

        // Deserialize radio selection
        self.radio_sel = js["radio_sel"].as_i64().unwrap_or(0) as i16;

        // Deserialize recon selections (with version check)
        if json_version < 12.05 {
            if let Some(arr) = js["info_sel"].as_array() {
                let old_info: Vec<bool> = arr
                    .iter()
                    .take(2)
                    .map(|v| v.as_bool().unwrap_or(false))
                    .collect();
                self.recon_sel = vec![0; self.recon_list.len()];
                if old_info.get(0).copied().unwrap_or(false) && self.recon_sel.len() > 1 {
                    self.recon_sel[1] = 1;
                }
                if old_info.get(1).copied().unwrap_or(false) && self.recon_sel.len() > 0 {
                    self.recon_sel[0] = 1;
                }
            }
        } else {
            if let Some(arr) = js["recon_sel"].as_array() {
                self.recon_sel.clear();
                for val in arr {
                    self.recon_sel.push(val.as_i64().unwrap_or(0) as i16);
                }
            }
        }
        while self.recon_sel.len() < self.recon_list.len() {
            self.recon_sel.push(0);
        }
        self.recon_sel.truncate(self.recon_list.len());

        // Deserialize visibility toggles
        if let Some(arr) = js["visi_sel"].as_array() {
            self.visi_sel.clear();
            for val in arr {
                self.visi_sel.push(val.as_bool().unwrap_or(false));
            }
        }
        while self.visi_sel.len() < self.visi_list.len() {
            self.visi_sel.push(false);
        }
        self.visi_sel.truncate(self.visi_list.len());

        // Deserialize climate toggles (with version check)
        if let Some(arr) = js["clim_sel"].as_array() {
            self.clim_sel.clear();
            for val in arr {
                self.clim_sel.push(val.as_bool().unwrap_or(false));
            }
        }
        while self.clim_sel.len() < self.climate_list.len() {
            self.clim_sel.push(false);
        }
        self.clim_sel.truncate(self.climate_list.len());

        if json_version < 11.95 && self.clim_sel.len() > 2 {
            self.clim_sel.remove(2);
        }

        // Deserialize autopilot selection
        self.auto_sel = js["auto_sel"].as_i64().unwrap_or(0) as i16;

        // Deserialize control selection
        self.cont_sel = js["cont_sel"].as_i64().unwrap_or(0) as i16;
    }

    fn to_json(&self) -> serde_json::Value {
        json!({
            "v": 2,
            "armour_coverage": self.armour_coverage,
            "electrical_count": self.electrical_count,
            "radio_sel": self.radio_sel,
            "recon_sel": self.recon_sel,
            "visi_sel": self.visi_sel,
            "clim_sel": self.clim_sel,
            "auto_sel": self.auto_sel,
            "cont_sel": self.cont_sel,
        })
    }
}
