use std::collections::HashMap;
use std::rc::Rc;

use crate::cockpit::Cockpit;
use crate::part::{merge_electrics, ElectricsMessage, Part};
use crate::serialization::{JSSerializable, Serializable};
use crate::stats::{Stats, Warning};
use crate::utils::transform;
use crate::{json::*, lu};

pub struct CockpitType {
    pub name: String,
    pub exposed: bool,
    pub stats: Stats,
}

pub struct UpgradeType {
    pub name: String,
    pub stats: Stats,
}

pub struct SafetyType {
    pub name: String,
    pub stats: Stats,
}

pub struct GunsightType {
    pub name: String,
    pub attack: i16,
    pub stats: Stats,
}

pub struct Cockpits {
    pub positions: Vec<Cockpit>,
    types: Rc<Vec<CockpitType>>,
    upgrades: Rc<Vec<UpgradeType>>,
    safety: Rc<Vec<SafetyType>>,
    gunsight: Rc<Vec<GunsightType>>,
}

impl Cockpits {
    pub fn new(
        types: Vec<CockpitType>,
        upgrades: Vec<UpgradeType>,
        safety: Vec<SafetyType>,
        gunsights: Vec<GunsightType>,
    ) -> Cockpits {
        Cockpits {
            positions: Vec::new(),
            types: Rc::new(types),
            upgrades: Rc::new(upgrades),
            safety: Rc::new(safety),
            gunsight: Rc::new(gunsights),
        }
    }
}

impl Part for Cockpits {
    fn part_stats(&mut self) -> Stats {
        let mut s = Stats::new();
        let mut warning_map: HashMap<Warning, Vec<usize>> = HashMap::new();
        for (idx, c) in self.positions.iter_mut().enumerate() {
            let mut cs: Stats = c.part_stats();
            for w in &cs.warnings {
                if let Some(v) = warning_map.get_mut(&w) {
                    v.push(idx + 1);
                } else {
                    warning_map.insert(w.clone(), vec![idx + 1]);
                }
            }
            cs.warnings.clear();
            s.add(&c.part_stats());
        }

        for (w, seats) in warning_map {
            s.warnings.push(Warning {
                name: lu!(
                    "Seats #{} {}",
                    seats
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<_>>()
                        .join(", "),
                    &w.name
                ),
                warning: w.warning.clone(),
                level: w.level,
            })
        }

        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0.0;
        //This needs special work for co-pilot controls
        //s.flightstress = 0;
        s.visibility = 0.0;
        s.crashsafety = 0.0;
        s
    }

    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        self.positions
            .iter()
            .map(|c| c.get_electrics())
            .fold(ElectricsMessage::new(), merge_electrics)
    }
}

impl Serializable for Cockpits {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        let num = d.get_num()? as usize;

        self.positions.clear();
        self.positions.resize_with(num, || {
            Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight)
        });

        for (idx, cp) in self.positions.iter_mut().enumerate() {
            cp.set_seat_index(idx);
            cp.deserialize(d);
        }
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.positions.len() as i16)?;
        for c in &self.positions {
            c.serialize(s)?;
        }
        Ok(())
    }
}

impl JSSerializable for Cockpits {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        let arr = js.as_array().unwrap();

        self.positions.clear();
        self.positions.resize_with(arr.len(), || {
            Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight)
        });

        for (idx, c_js) in arr.iter().enumerate() {
            let cp = &mut self.positions[idx];
            cp.set_seat_index(idx);
            cp.from_json(c_js, json_version);
        }
    }

    fn to_json(&self) -> serde_json::Value {
        serde_json::Value::Array(
            self.positions
                .iter()
                .map(|c: &Cockpit| c.to_json())
                .collect(),
        )
    }
}
