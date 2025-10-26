use std::rc::Rc;

use serde_json::Map;
use ui_core::*;

use crate::{
    engine::Engine,
    json::{jsarr_opt, jsbool},
    lu,
    part::{ElectricsMessage, Part},
    radiator::{Radiator, RadiatorCoolant, RadiatorMount, RadiatorType},
    serialization::{JSSerializable, Serializable},
    stats::Stats,
};

pub struct Mount {
    pub name: String,
    pub stats: Stats,
    pub strain_factor: f64,
    pub drag_factor: f64,
    pub power_factor: f64,
    pub mount_type: MountType,
    pub require_extended_driveshafts: bool,
    pub require_tail: bool,
    pub helicopter: bool,
    pub turbine: bool,
    pub pushpull: bool,
}

#[derive(PartialEq, Eq)]
pub enum MountType {
    Fuselage,
    Pod,
    Wing,
}

pub struct Cowl {
    pub name: String,
    pub stats: Stats,
    pub drag_factor: f64,
    pub mass_per_drag: f64,
    pub for_air_cooled: bool,
    pub for_liquid_cooled: bool,
    pub for_rotary: bool,
}

// UI Options struct for Engines
pub struct EnginesOptions {
    pub is_asymmetric: Check,
    pub num_engines: usize,
    pub num_radiators: usize,
}

pub struct Engines {
    pub engines: Vec<Engine>,
    pub radiators: Vec<Radiator>,
    pub is_asymmetric: bool,

    pub mounts: Rc<Vec<Mount>>,
    pub cowls: Rc<Vec<Cowl>>,
    pub radiator_types: Rc<Vec<RadiatorType>>,
    pub radiator_mounts: Rc<Vec<RadiatorMount>>,
    pub radiator_coolants: Rc<Vec<RadiatorCoolant>>,
}

impl Engines {
    pub fn new(
        mounts: Vec<Mount>,
        cowls: Vec<Cowl>,
        radiator_types: Vec<RadiatorType>,
        radiator_mounts: Vec<RadiatorMount>,
        radiator_coolants: Vec<RadiatorCoolant>,
    ) -> Engines {
        Engines {
            engines: Vec::new(),
            radiators: Vec::new(),
            is_asymmetric: false,
            mounts: Rc::new(mounts),
            cowls: Rc::new(cowls),
            radiator_types: Rc::new(radiator_types),
            radiator_mounts: Rc::new(radiator_mounts),
            radiator_coolants: Rc::new(radiator_coolants),
        }
    }
}

impl Serializable for Engines {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        let elen = d.get_num()? as usize;

        self.engines.clear();
        for _ in 0..elen {
            let mut e = Engine::new(self.mounts.clone(), self.cowls.clone());
            e.deserialize(d)?;
            self.engines.push(e);
        }

        let rlen = d.get_num()? as usize;
        self.radiators.clear();
        for _ in 0..rlen {
            let mut r = Radiator::new(
                self.radiator_types.as_ref().clone(),
                self.radiator_mounts.as_ref().clone(),
                self.radiator_coolants.as_ref().clone(),
            );
            r.deserialize(d)?;
            self.radiators.push(r);
        }
        self.is_asymmetric = d.get_bool()?;
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.engines.len() as i16)?;
        for e in &self.engines {
            e.serialize(s)?;
        }

        s.push_num(self.radiators.len() as i16)?;
        for r in &self.radiators {
            r.serialize(s)?;
        }
        s.push_bool(self.is_asymmetric)?;
        Ok(())
    }
}

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

        let engines_arr: Vec<serde_json::Value> = self.engines.iter().map(|e| e.to_json()).collect();
        map.insert("engines".to_string(), serde_json::Value::Array(engines_arr));

        let radiators_arr: Vec<serde_json::Value> = self.radiators.iter().map(|r| r.to_json()).collect();
        map.insert("radiators".to_string(), serde_json::Value::Array(radiators_arr));

        map.insert("is_asymmetric".to_string(), self.is_asymmetric.into());

        serde_json::Value::Object(map)
    }
}

impl UIBindings for Engines {
    type OptionsType = EnginesOptions;

    fn create_ui_options(&self) -> Self::OptionsType {
        EnginesOptions {
            is_asymmetric: Check {
                name: lu!("is_asymmetric"),
                enabled: true,
                selected: self.is_asymmetric,
            },
            num_engines: self.engines.len(),
            num_radiators: self.radiators.len(),
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        self.is_asymmetric = options.is_asymmetric.selected;
        // num_engines and num_radiators are read-only, so we don't update them
    }
}

impl Part for Engines {
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // TODO: Implement full PartStats logic from TypeScript
        // This is a stub implementation
        for engine in &mut self.engines {
            stats = stats.add(&engine.part_stats());
        }

        for radiator in &mut self.radiators {
            stats = stats.add(&radiator.part_stats());
        }

        if self.is_asymmetric {
            stats.latstab -= 3.0;
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        let mut msg = ElectricsMessage::new();

        for engine in self.engines.iter() {
            let e_msg = engine.get_electrics();
            msg.storage += e_msg.storage;
            msg.equipment.extend(e_msg.equipment);
        }

        for radiator in &self.radiators {
            let r_msg = radiator.get_electrics();
            msg.storage += r_msg.storage;
            msg.equipment.extend(r_msg.equipment);
        }

        msg
    }
}

impl Engines {
    // Helper methods to access engines and radiators for UI
    pub fn get_engine(&self, index: usize) -> Option<&Engine> {
        self.engines.get(index)
    }

    pub fn get_engine_mut(&mut self, index: usize) -> Option<&mut Engine> {
        self.engines.get_mut(index)
    }

    pub fn get_radiator(&self, index: usize) -> Option<&Radiator> {
        self.radiators.get(index)
    }

    pub fn get_radiator_mut(&mut self, index: usize) -> Option<&mut Radiator> {
        self.radiators.get_mut(index)
    }

    pub fn set_asymmetric(&mut self, value: bool) {
        self.is_asymmetric = value;
    }

    pub fn get_asymmetric(&self) -> bool {
        self.is_asymmetric
    }
}
