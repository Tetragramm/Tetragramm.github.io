use crate::disp::{Select, SelectOpt};
use crate::json::*;
use crate::part::{ElectricsMessage, Part};
use crate::serialization::{JSSerializable, Serializable};
use crate::stats::Stats;

pub struct EraVal {
    pub name: String,
    pub maxbomb: f64,
    pub cant_lift: i32,
    pub stats: Stats,
}

pub struct Era {
    vals: Vec<EraVal>,
    pub selected_era: usize,
}

pub struct EraOptions {
    selected_era: Select,
}

impl Era {
    pub fn new(vals: Vec<EraVal>) -> Era {
        Era {
            vals,
            selected_era: 0,
        }
    }

    pub fn get_options(&self) -> EraOptions {
        EraOptions {
            selected_era: Select {
                enabled: true,
                options: self
                    .vals
                    .iter()
                    .map(|x| SelectOpt {
                        name: x.name.clone(),
                        enabled: true,
                    })
                    .collect(),
                selected: self.selected_era,
            },
        }
    }

    pub fn set_state(&mut self, era: usize) {
        self.selected_era = era;
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
        serde_json::to_value(self.selected_era).unwrap()
    }

    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.selected_era = jsnum(js, "selected") as usize;
        if json_version < 10.35 {
            if self.selected_era > 2 {
                self.selected_era += 1;
            }
        }
    }
}
