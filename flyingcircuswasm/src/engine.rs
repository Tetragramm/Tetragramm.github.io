// use std::{collections::HashMap, rc::Rc};

// use itertools::Itertools;

// use crate::{
//     engines::{Cowl, Mount},
//     serialization::{Error, Serializable},
//     stats::Stats,
// };

// #[derive(Clone)]
// pub enum EngineRarity {
//     CUSTOM,
//     COMMON,
//     RARE,
//     LEGENDARY,
// }

// #[derive(Clone)]
// pub struct EngineStats {
//     name: String,
//     overspeed: i16,
//     altitude: i16,
//     torque: i16,
//     rumble: i16,
//     oiltank: bool,
//     pulsejet: bool,
//     stats: Stats,
//     rarity: EngineRarity,
// }

// #[derive(Clone)]
// pub enum TypedInputs {
//     Propeller {
//         displacement: f32,
//         compression: f32,
//         cyl_per_row: i16,
//         rows: i16,
//         rpm_boost: f32,
//         material_fudge: f32,
//         quality_fudge: f32,
//         compressor_type: i16,
//         compressor_count: i16,
//         min_ideal_alt: i16,
//         upgrades: Vec<bool>,
//     },
//     Pulsejet {
//         power: i16,
//         quality_cost: f32,
//         quality_reliablity: f32,
//         starter: bool,
//     },
//     Turbine {
//         flow_adjustment: f32,
//         diameter: f32,
//         compression_ratio: f32,
//         bypass_ration: f32,
//         upgrades: Vec<bool>,
//     },
//     Electric {
//         power: i16,
//         winding_sel: i16,
//         chonk: i16,
//         quality_fudge: f32,
//     },
// }

// #[derive(Clone)]
// pub struct EngineInputs {
//     name: String,
//     etype: i16,
//     era_sel: i16,
//     rarity: EngineRarity,

//     inputs: TypedInputs,
// }

// impl Serializable for EngineInputs {
//     fn deserialize(
//         &mut self,
//         d: &mut crate::serialization::Deserializer,
//     ) -> Result<(), crate::serialization::Error> {
//         self.name = d.get_string()?;
//         let engine_type = d.get_num()?;
//         self.etype = d.get_num()?;
//         self.era_sel = d.get_num()?;
//         self.inputs = match (engine_type) {
//             0 => TypedInputs::Propeller {
//                 displacement: d.get_float()?,
//                 compression: d.get_float()?,
//                 cyl_per_row: d.get_num()?,
//                 rows: d.get_num()?,
//                 rpm_boost: d.get_float()?,
//                 material_fudge: d.get_float()?,
//                 quality_fudge: d.get_float()?,
//                 compressor_type: d.get_num()?,
//                 compressor_count: d.get_num()?,
//                 min_ideal_alt: d.get_num()?,
//                 upgrades: d.get_bool_arr(4)?,
//             },
//             1 => TypedInputs::Pulsejet {
//                 power: d.get_num()?,
//                 quality_cost: d.get_float()?,
//                 quality_reliablity: d.get_float()?,
//                 starter: d.get_bool()?,
//             },
//             2 => TypedInputs::Turbine {
//                 flow_adjustment: d.get_float()?,
//                 diameter: d.get_float()?,
//                 compression_ratio: d.get_float()?,
//                 bypass_ration: d.get_float()?,
//                 upgrades: d.get_bool_arr(4)?,
//             },
//             3 => TypedInputs::Electric {
//                 power: d.get_num()?,
//                 winding_sel: d.get_num()?,
//                 chonk: d.get_num()?,
//                 quality_fudge: d.get_float()?,
//             },
//             v => {
//                 return Err(crate::serialization::Error::BadValue(v));
//             }
//         };
//         if d.version > 12.35 {
//             self.rarity = match d.get_num()? {
//                 0 => EngineRarity::CUSTOM,
//                 1 => EngineRarity::COMMON,
//                 2 => EngineRarity::RARE,
//                 3 => EngineRarity::LEGENDARY,
//                 v => {
//                     return Err(crate::serialization::Error::BadValue(v));
//                 }
//             }
//         } else {
//             self.rarity = EngineRarity::CUSTOM;
//         }
//         Ok(())
//     }

//     fn serialize(
//         &self,
//         s: &mut crate::serialization::Serializer,
//     ) -> Result<(), crate::serialization::Error> {
//     }
// }

// pub struct Engine {
//     elist_key: String,
//     etype_stats: EngineStats,
//     etype_inputs: EngineInputs,

//     cooling_count: i16,
//     radiator_index: i16,
//     num_radiators: i16,

//     mount_list: Rc<Vec<Mount>>,
//     mount_sel: usize,

//     is_push_pull: bool,
//     torque_to_struct: bool,

//     intake_fan: bool,
//     extended_ds: bool,
//     outboard_prop: bool,
//     gear_count: i16,
//     geared_reliability: i16,

//     cowl_list: Rc<Vec<Cowl>>,
//     cowl_sel: usize,

//     is_generator: bool,
//     has_alternator: bool,
//     is_internal: bool,

//     total_reliability: i16,
//     is_first_pulsejet: bool,
// }

// static mut ENGINE_LIST: HashMap<String, Vec<EngineInputs>> = HashMap::new();

// fn search_all_engine_lists(name: &str) -> Option<String> {
//     for (key, list) in ENGINE_LIST {
//         if list.iter().map(|f| f.name.clone()).contains(name) {
//             return Some(key);
//         }
//     }
//     None
// }

// fn add_custom_engine(inputs: EngineInputs) {
//     unsafe {
//         ENGINE_LIST.get_mut("Custom").unwrap().push(inputs);
//     }
// }

// fn get_engine(list: &str, name: &str) -> EngineInputs {
//     ENGINE_LIST[list]
//         .iter()
//         .find(|e| e.name == name)
//         .unwrap()
//         .clone()
// }

// impl Engine {
//     pub fn new(mount_list: Rc<Vec<Mount>>, cowl_list: Rc<Vec<Cowl>>) -> Engine {
//         let elist_key = "Himmilgard Rotary";
//         let etype_inputs = ENGINE_LIST.get(elist_key)[0];
//         let etype_stats = etype_inputs.get_stats();
//         let cooling_count = etype_stats.stats.cooling;
//         Engine {
//             elist_key: elist_key.to_string(),
//             etype_stats,
//             etype_inputs,
//             cooling_count,
//             radiator_index: if cooling_count > 0 { 0 } else { -1 },
//             num_radiators: 0,
//             mount_list,
//             mount_sel: 0,
//             intake_fan: false,
//             is_push_pull: false,
//             torque_to_struct: false,
//             cowl_list,
//             cowl_sel: 0,
//             extended_ds: false,
//             outboard_prop: false,
//             gear_count: 0,
//             geared_reliability: 0,
//             total_reliability: 0,
//             is_generator: false,
//             has_alternator: false,
//             is_first_pulsejet: false,
//             is_internal: true,
//         }
//     }

//     fn oldDeserialize(
//         &mut self,
//         d: &mut crate::serialization::Deserializer,
//     ) -> Result<(), crate::serialization::Error> {
//         self.etype_stats.name = d.get_string()?;
//         //TODO: Resume
//         Ok(())
//     }
// }

// impl Serializable for Engine {
//     fn deserialize(
//         &mut self,
//         d: &mut crate::serialization::Deserializer,
//     ) -> Result<(), crate::serialization::Error> {
//         let mut elist_key = "";
//         if d.version > 10.55 {
//             self.etype_stats.deserialize(d)?;
//             self.etype_inputs.deserialize(d)?;
//             match search_all_engine_lists(&self.etype_stats.name) {
//                 Some(v) => elist_key = &v,
//                 None => {
//                     elist_key = "Custom";
//                     if self.etype_inputs.name != "Default" {
//                         add_custom_engine(self.etype_inputs);
//                     }
//                 }
//             }
//         } else {
//             self.oldDeserialize(d)?;
//             let e_inputs = self.etype_inputs;
//             if e_inputs.name != "Default" {
//                 match search_all_engine_lists(&self.etype_stats.name) {
//                     Some(v) => elist_key = &v,
//                     None => {
//                         add_custom_engine(e_inputs);
//                         elist_key = "Custom";
//                     }
//                 }
//             }
//         }
//         self.etype_inputs = get_engine(elist_key, &self.etype_stats.name);
//         self.etype_stats = self.etype_inputs.get_stats();

//         self.cooling_count = d.get_num()?;
//         self.radiator_index = d.get_num()?;
//         self.mount_sel = d.get_num()? as usize;
//         self.is_push_pull = d.get_bool()?;
//         self.torque_to_struct = d.get_bool()?;
//         self.extended_ds = d.get_bool()?;
//         self.gear_count = d.get_num()?;
//         self.geared_reliability = d.get_num()?;
//         self.cowl_sel = d.get_num()? as usize;
//         self.is_generator = d.get_bool()?;
//         self.has_alternator = d.get_bool()?;
//         self.intake_fan = d.get_bool()?;
//         if d.version > 12.15 {
//             self.outboard_prop = d.get_bool()?;
//         } else {
//             self.outboard_prop = false;
//         }

//         self.elist_key = elist_key.to_string();

//         Ok(())
//     }

//     fn serialize(
//         &self,
//         s: &mut crate::serialization::Serializer,
//     ) -> Result<(), crate::serialization::Error> {
//         self.etype_stats.serialize(s)?;
//         self.etype_inputs.serialize(s)?;
//         s.push_num(self.cooling_count)?;
//         s.push_num(self.radiator_index)?;
//         s.push_num(self.mount_sel as i16)?;
//         s.push_bool(self.is_push_pull)?;
//         s.push_bool(self.torque_to_struct)?;
//         s.push_bool(self.extended_ds)?;
//         s.push_num(self.gear_count)?;
//         s.push_num(self.geared_reliability)?;
//         s.push_num(self.cowl_sel as i16)?;
//         s.push_bool(self.is_generator)?;
//         s.push_bool(self.has_alternator)?;
//         s.push_bool(self.intake_fan)?;
//         s.push_bool(self.outboard_prop)?;
//         Ok(())
//     }
// }
