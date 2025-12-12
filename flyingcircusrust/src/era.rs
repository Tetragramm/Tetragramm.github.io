use ui_core::*;
use ui_macro::*;

use crate::json::*;
use crate::part::{ElectricsMessage, Part};
use crate::serialization::{JSSerializable, Serializable};
use crate::stats::Stats;

pub struct EraEntry {
    pub name: String,
    pub maxbomb: f32,
    pub cant_lift: i32,
    pub stats: Stats,
}

#[derive(UIBindings)]
pub struct Era {
    vals: Vec<EraEntry>,
    #[ui(select, source = "vals")]
    pub selected_era: usize,
}

impl Era {
    pub fn new(vals: Vec<EraEntry>) -> Era {
        Era {
            vals,
            selected_era: 0,
        }
    }

    pub fn set_state(&mut self, era: usize) {
        self.selected_era = era;
    }

    pub fn get_cant_lift(&self) -> i16 {
        self.vals[self.selected_era].cant_lift as i16
    }

    /// Get maximum bomb load ratio for the currently selected era
    /// TypeScript: GetMaxBomb()
    /// Returns the maxbomb value (ratio) for calculating bomb capacity
    /// Values range from 0.1667 (Pioneer) to 0.5 (Last Hurrah)
    pub fn get_max_bomb(&self) -> f32 {
        self.vals[self.selected_era].maxbomb
    }

    /// Get the name of the currently selected era
    /// TypeScript: GetSelectedText()
    pub fn get_selected_text(&self) -> String {
        self.vals[self.selected_era].name.clone()
    }
}

impl Part for Era {
    fn part_stats(&mut self) -> Stats {
        self.vals[self.selected_era].stats.clone()
    }
    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        ElectricsMessage::new()
    }
}

impl Serializable for Era {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        self.selected_era = d.get_num()? as usize;
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.selected_era as i16)?;
        Ok(())
    }
}

impl JSSerializable for Era {
    fn to_json(&self) -> serde_json::Value {
        let mut map = serde_json::Map::new();
        map.insert("selected".to_string(), self.selected_era.into());

        serde_json::Value::Object(map)
    }

    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        self.selected_era = jsnum(js, "selected") as usize;
        if json_version < 10.35 {
            if self.selected_era > 2 {
                self.selected_era += 1;
            }
        }
    }
}
