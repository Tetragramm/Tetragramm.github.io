// use std::rc::Rc;

// use crate::{
//     engine::Engine,
//     json::{jsarr, jsbool, jsnum, jsstr},
//     radiator::Radiator,
//     serialization::Serializable,
//     stats::Stats,
//     utils::transform,
// };

// pub struct Mount {
//     pub name: String,
//     pub stats: Stats,
//     pub strain_factor: f64,
//     pub drag_factor: f64,
//     pub power_factor: f64,
//     pub mount_type: MountType,
//     pub require_extended_driveshafts: bool,
//     pub require_tail: bool,
//     pub helicopter: bool,
//     pub turbine: bool,
//     pub pushpull: bool,
// }

// pub enum MountType {
//     Fuselage,
//     Pod,
//     Wing,
// }

// pub struct Cowl {
//     pub name: String,
//     pub stats: Stats,
//     pub drag_factor: f64,
//     pub mass_per_drag: f64,
//     pub for_air_cooled: bool,
//     pub for_liquid_cooled: bool,
//     pub for_rotary: bool,
// }

// pub struct RadiatorType {
//     pub name: String,
//     pub stats: Stats,
//     pub drag_per_cool: f64,
// }

// pub struct RadiatorMount {
//     pub name: String,
//     pub stats: Stats,
// }

// pub struct RadiatorCoolant {
//     pub name: String,
//     pub stats: Stats,
//     pub hard: bool,
//     pub flammable: bool,
// }

// pub struct Engines {
//     pub engines: Vec<Engine>,
//     pub radiators: Vec<Radiator>,
//     pub is_asymmetric: bool,

//     pub mounts: Rc<Vec<Mount>>,
//     pub cowls: Rc<Vec<Cowl>>,
//     pub radiator_types: Rc<Vec<RadiatorType>>,
//     pub radiator_mounts: Rc<Vec<RadiatorMount>>,
//     pub radiator_coolants: Rc<Vec<RadiatorCoolant>>,
// }

// impl Engines {
//     pub fn new(
//         mounts: Vec<Mount>,
//         cowls: Vec<Cowl>,
//         radiator_types: Vec<RadiatorType>,
//         radiator_mounts: Vec<RadiatorMount>,
//         radiator_coolants: Vec<RadiatorCoolant>,
//     ) -> Engines {
//         Engines {
//             engines: Vec::new(),
//             radiators: Vec::new(),
//             is_asymmetric: false,
//             mounts: Rc::new(mounts),
//             cowls: Rc::new(cowls),
//             radiator_types: Rc::new(radiator_types),
//             radiator_mounts: Rc::new(radiator_mounts),
//             radiator_coolants: Rc::new(radiator_coolants),
//         }
//     }
// }

// impl Serializable for Engines {
//     fn deserialize(
//         &mut self,
//         d: &mut crate::serialization::Deserializer,
//     ) -> Result<(), crate::serialization::Error> {
//         let elen = d.get_num()?;

//         self.engines
//             .resize_with(elen as usize, || Engine::new(self.mounts, self.cowls));
//         for e in self.engines {
//             e.deserialize(d)?;
//         }

//         let rlen = d.get_num()?;
//         self.radiators.resize_with(rlen as usize, || {
//             Radiator::new(
//                 &self.radiator_types,
//                 &self.radiator_mounts,
//                 &self.radiator_coolants,
//             )
//         });
//         for r in self.radiators {
//             r.deserilaize(d)?;
//         }
//         self.is_asymmetric = d.get_bool()?;
//         Ok(())
//     }

//     fn serialize(
//         &self,
//         s: &mut crate::serialization::Serializer,
//     ) -> Result<(), crate::serialization::Error> {
//         s.push_num(self.engines.len() as i16)?;
//         for e in self.engines {
//             e.serialize(s)?;
//         }

//         s.push_num(self.radiators.len() as i16)?;
//         for r in self.radiators {
//             r.serialize(s)?;
//         }
//         s.push_bool(self.is_asymmetric);
//         Ok(())
//     }
// }
