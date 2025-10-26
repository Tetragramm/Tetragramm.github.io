use std::rc::Rc;

use serde_json::Map;
use ui_core::*;
use ui_macro::*;

use crate::{
    engines::{Cowl, Mount},
    json::{jsbool, jsnum, jsobj, jsstr},
    lu,
    part::{ElectricsMessage, Part},
    serialization::{Error, JSSerializable, Serializable},
    stats::Stats,
};

#[derive(Clone)]
pub enum EngineRarity {
    CUSTOM,
    COMMON,
    RARE,
    LEGENDARY,
}

#[derive(Clone)]
pub struct EngineStats {
    pub name: String,
    pub overspeed: i16,
    pub altitude: i16,
    pub torque: i16,
    pub rumble: i16,
    pub oiltank: bool,
    pub pulsejet: bool,
    pub stats: Stats,
    pub rarity: EngineRarity,
}

impl EngineStats {
    pub fn new() -> EngineStats {
        EngineStats {
            name: String::new(),
            overspeed: 0,
            altitude: 0,
            torque: 0,
            rumble: 0,
            oiltank: false,
            pulsejet: false,
            stats: Stats::new(),
            rarity: EngineRarity::CUSTOM,
        }
    }
}

impl Serializable for EngineStats {
    fn deserialize(&mut self, d: &mut crate::serialization::Deserializer) -> Result<(), Error> {
        self.name = d.get_string()?;
        self.overspeed = d.get_num()?;
        self.altitude = d.get_num()?;
        self.torque = d.get_num()?;
        self.rumble = d.get_num()?;
        self.oiltank = d.get_bool()?;
        self.pulsejet = d.get_bool()?;
        self.stats.deserialize(d)?;
        if d.version > 12.35 {
            self.rarity = match d.get_num()? {
                0 => EngineRarity::CUSTOM,
                1 => EngineRarity::COMMON,
                2 => EngineRarity::RARE,
                3 => EngineRarity::LEGENDARY,
                v => return Err(Error::BadValue(v)),
            };
        } else {
            self.rarity = EngineRarity::CUSTOM;
        }
        Ok(())
    }

    fn serialize(&self, s: &mut crate::serialization::Serializer) -> Result<(), Error> {
        s.push_string(&self.name)?;
        s.push_num(self.overspeed)?;
        s.push_num(self.altitude)?;
        s.push_num(self.torque)?;
        s.push_num(self.rumble)?;
        s.push_bool(self.oiltank)?;
        s.push_bool(self.pulsejet)?;
        self.stats.serialize(s)?;
        let rarity_val = match self.rarity {
            EngineRarity::CUSTOM => 0,
            EngineRarity::COMMON => 1,
            EngineRarity::RARE => 2,
            EngineRarity::LEGENDARY => 3,
        };
        s.push_num(rarity_val)?;
        Ok(())
    }
}

impl JSSerializable for EngineStats {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.name = jsstr(js, "name");
        self.overspeed = jsnum(js, "overspeed") as i16;
        self.altitude = jsnum(js, "altitude") as i16;
        self.torque = jsnum(js, "torque") as i16;
        self.rumble = jsnum(js, "rumble") as i16;
        self.oiltank = jsbool(js, "oiltank");
        self.pulsejet = jsbool(js, "pulsejet");
        self.stats.from_json(jsobj(js, "stats"), json_version);
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("name".to_string(), self.name.clone().into());
        map.insert("overspeed".to_string(), self.overspeed.into());
        map.insert("altitude".to_string(), self.altitude.into());
        map.insert("torque".to_string(), self.torque.into());
        map.insert("rumble".to_string(), self.rumble.into());
        map.insert("oiltank".to_string(), self.oiltank.into());
        map.insert("pulsejet".to_string(), self.pulsejet.into());
        map.insert("stats".to_string(), self.stats.to_json());
        serde_json::Value::Object(map)
    }
}

#[derive(Clone)]
pub enum TypedInputs {
    Propeller {
        displacement: f32,
        compression: f32,
        cyl_per_row: i16,
        rows: i16,
        rpm_boost: f32,
        material_fudge: f32,
        quality_fudge: f32,
        compressor_type: i16,
        compressor_count: i16,
        min_ideal_alt: i16,
        upgrades: Vec<bool>,
    },
    Pulsejet {
        power: i16,
        quality_cost: f32,
        quality_reliability: f32,
        starter: bool,
    },
    Turbine {
        flow_adjustment: f32,
        diameter: f32,
        compression_ratio: f32,
        bypass_ratio: f32,
        upgrades: Vec<bool>,
    },
    Electric {
        power: i16,
        winding_sel: i16,
        chonk: i16,
        quality_fudge: f32,
    },
}

#[derive(Clone)]
pub struct EngineInputs {
    pub name: String,
    pub etype: i16,
    pub era_sel: i16,
    pub rarity: EngineRarity,
    pub inputs: TypedInputs,
}

impl PartialEq for EngineInputs {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name
            && self.etype == other.etype
            && self.era_sel == other.era_sel
    }
}

impl EngineInputs {
    pub fn new() -> EngineInputs {
        EngineInputs {
            name: "Default".to_string(),
            etype: 0,
            era_sel: 0,
            rarity: EngineRarity::CUSTOM,
            inputs: TypedInputs::Propeller {
                displacement: 0.0,
                compression: 5.0,
                cyl_per_row: 1,
                rows: 1,
                rpm_boost: 1.0,
                material_fudge: 1.0,
                quality_fudge: 1.0,
                compressor_type: 0,
                compressor_count: 0,
                min_ideal_alt: 0,
                upgrades: vec![false; 4],
            },
        }
    }

    /// Generate EngineStats from EngineInputs using the appropriate builder
    pub fn part_stats(&self) -> EngineStats {
        use crate::electric_builder::ElectricBuilder;
        use crate::propeller_builder::PropellerBuilder;
        use crate::pulsejet_builder::PulsejetBuilder;
        use crate::turbo_builder::TurboBuilder;

        match &self.inputs {
            TypedInputs::Propeller { .. } => {
                let mut builder = PropellerBuilder::from_inputs(self);
                builder.build()
            }
            TypedInputs::Pulsejet { .. } => {
                let mut builder = PulsejetBuilder::from_inputs(self);
                builder.build()
            }
            TypedInputs::Turbine { .. } => {
                let mut builder = TurboBuilder::from_inputs(self);
                builder.build()
            }
            TypedInputs::Electric { .. } => {
                let mut builder = ElectricBuilder::from_inputs(self);
                builder.build()
            }
        }
    }
}

impl Serializable for EngineInputs {
    fn deserialize(&mut self, d: &mut crate::serialization::Deserializer) -> Result<(), Error> {
        self.name = d.get_string()?;
        let engine_type = d.get_num()?;
        self.etype = d.get_num()?;
        self.era_sel = d.get_num()?;
        self.inputs = match engine_type {
            0 => TypedInputs::Propeller {
                displacement: d.get_float()?,
                compression: d.get_float()?,
                cyl_per_row: d.get_num()?,
                rows: d.get_num()?,
                rpm_boost: d.get_float()?,
                material_fudge: d.get_float()?,
                quality_fudge: d.get_float()?,
                compressor_type: d.get_num()?,
                compressor_count: d.get_num()?,
                min_ideal_alt: d.get_num()?,
                upgrades: d.get_bool_arr(4)?,
            },
            1 => TypedInputs::Pulsejet {
                power: d.get_num()?,
                quality_cost: d.get_float()?,
                quality_reliability: d.get_float()?,
                starter: d.get_bool()?,
            },
            2 => TypedInputs::Turbine {
                flow_adjustment: d.get_float()?,
                diameter: d.get_float()?,
                compression_ratio: d.get_float()?,
                bypass_ratio: d.get_float()?,
                upgrades: d.get_bool_arr(4)?,
            },
            3 => TypedInputs::Electric {
                power: d.get_num()?,
                winding_sel: d.get_num()?,
                chonk: d.get_num()?,
                quality_fudge: d.get_float()?,
            },
            v => return Err(Error::BadValue(v)),
        };
        if d.version > 12.35 {
            self.rarity = match d.get_num()? {
                0 => EngineRarity::CUSTOM,
                1 => EngineRarity::COMMON,
                2 => EngineRarity::RARE,
                3 => EngineRarity::LEGENDARY,
                v => return Err(Error::BadValue(v)),
            };
        } else {
            self.rarity = EngineRarity::CUSTOM;
        }
        Ok(())
    }

    fn serialize(&self, s: &mut crate::serialization::Serializer) -> Result<(), Error> {
        s.push_string(&self.name)?;
        // Push engine_type based on inputs variant
        match &self.inputs {
            TypedInputs::Propeller { .. } => s.push_num(0)?,
            TypedInputs::Pulsejet { .. } => s.push_num(1)?,
            TypedInputs::Turbine { .. } => s.push_num(2)?,
            TypedInputs::Electric { .. } => s.push_num(3)?,
        }
        s.push_num(self.etype)?;
        s.push_num(self.era_sel)?;

        match &self.inputs {
            TypedInputs::Propeller {
                displacement,
                compression,
                cyl_per_row,
                rows,
                rpm_boost,
                material_fudge,
                quality_fudge,
                compressor_type,
                compressor_count,
                min_ideal_alt,
                upgrades,
            } => {
                s.push_float(*displacement)?;
                s.push_float(*compression)?;
                s.push_num(*cyl_per_row)?;
                s.push_num(*rows)?;
                s.push_float(*rpm_boost)?;
                s.push_float(*material_fudge)?;
                s.push_float(*quality_fudge)?;
                s.push_num(*compressor_type)?;
                s.push_num(*compressor_count)?;
                s.push_num(*min_ideal_alt)?;
                s.push_bool_arr(upgrades)?;
            }
            TypedInputs::Pulsejet {
                power,
                quality_cost,
                quality_reliability,
                starter,
            } => {
                s.push_num(*power)?;
                s.push_float(*quality_cost)?;
                s.push_float(*quality_reliability)?;
                s.push_bool(*starter)?;
            }
            TypedInputs::Turbine {
                flow_adjustment,
                diameter,
                compression_ratio,
                bypass_ratio,
                upgrades,
            } => {
                s.push_float(*flow_adjustment)?;
                s.push_float(*diameter)?;
                s.push_float(*compression_ratio)?;
                s.push_float(*bypass_ratio)?;
                s.push_bool_arr(upgrades)?;
            }
            TypedInputs::Electric {
                power,
                winding_sel,
                chonk,
                quality_fudge,
            } => {
                s.push_num(*power)?;
                s.push_num(*winding_sel)?;
                s.push_num(*chonk)?;
                s.push_float(*quality_fudge)?;
            }
        }

        let rarity_val = match self.rarity {
            EngineRarity::CUSTOM => 0,
            EngineRarity::COMMON => 1,
            EngineRarity::RARE => 2,
            EngineRarity::LEGENDARY => 3,
        };
        s.push_num(rarity_val)?;
        Ok(())
    }
}

impl JSSerializable for EngineInputs {
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f64) {
        self.name = jsstr(js, "name");
        let engine_type = jsnum(js, "engine_type") as i16;
        self.etype = jsnum(js, "type") as i16;
        self.era_sel = jsnum(js, "era_sel") as i16;

        // Deserialize rarity if present
        if let Some(rarity_val) = js.get("rarity") {
            self.rarity = match rarity_val.as_i64().unwrap_or(0) {
                0 => EngineRarity::CUSTOM,
                1 => EngineRarity::COMMON,
                2 => EngineRarity::RARE,
                3 => EngineRarity::LEGENDARY,
                _ => EngineRarity::CUSTOM,
            };
        }

        // Deserialize type-specific inputs
        match engine_type {
            0 => {
                // PROPELLER
                self.inputs = TypedInputs::Propeller {
                    displacement: jsnum(js, "displacement") as f32,
                    compression: jsnum(js, "compression") as f32,
                    cyl_per_row: jsnum(js, "cyl_per_row") as i16,
                    rows: jsnum(js, "rows") as i16,
                    rpm_boost: jsnum(js, "RPM_boost") as f32,
                    material_fudge: jsnum(js, "material_fudge") as f32,
                    quality_fudge: jsnum(js, "quality_fudge") as f32,
                    compressor_type: jsnum(js, "compressor_type") as i16,
                    compressor_count: jsnum(js, "compressor_count") as i16,
                    min_ideal_alt: jsnum(js, "min_IAF") as i16,
                    upgrades: crate::json::jsboolarr(js, "upgrades"),
                };
            }
            1 => {
                // PULSEJET
                self.inputs = TypedInputs::Pulsejet {
                    power: jsnum(js, "power") as i16,
                    quality_cost: jsnum(js, "quality_cost") as f32,
                    quality_reliability: jsnum(js, "quality_rely") as f32,
                    starter: crate::json::jsbool(js, "starter"),
                };
            }
            2 => {
                // TURBOMACHINERY
                self.inputs = TypedInputs::Turbine {
                    flow_adjustment: jsnum(js, "flow_adjustment") as f32,
                    diameter: jsnum(js, "diameter") as f32,
                    compression_ratio: jsnum(js, "compression_ratio") as f32,
                    bypass_ratio: jsnum(js, "bypass_ratio") as f32,
                    upgrades: crate::json::jsboolarr(js, "upgrades"),
                };
            }
            3 => {
                // ELECTRIC
                self.inputs = TypedInputs::Electric {
                    power: jsnum(js, "power") as i16,
                    winding_sel: jsnum(js, "winding_sel") as i16,
                    chonk: jsnum(js, "material_fudge") as i16,
                    quality_fudge: jsnum(js, "quality_fudge") as f32,
                };
            }
            _ => {
                // Default to Propeller
                self.inputs = TypedInputs::Propeller {
                    displacement: 0.0,
                    compression: 5.0,
                    cyl_per_row: 1,
                    rows: 1,
                    rpm_boost: 1.0,
                    material_fudge: 1.0,
                    quality_fudge: 1.0,
                    compressor_type: 0,
                    compressor_count: 0,
                    min_ideal_alt: 0,
                    upgrades: vec![false; 4],
                };
            }
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("name".to_string(), self.name.clone().into());
        map.insert("type".to_string(), self.etype.into());
        map.insert("era_sel".to_string(), self.era_sel.into());

        let rarity_val = match self.rarity {
            EngineRarity::CUSTOM => 0,
            EngineRarity::COMMON => 1,
            EngineRarity::RARE => 2,
            EngineRarity::LEGENDARY => 3,
        };
        map.insert("rarity".to_string(), rarity_val.into());

        match &self.inputs {
            TypedInputs::Propeller {
                displacement,
                compression,
                cyl_per_row,
                rows,
                rpm_boost,
                material_fudge,
                quality_fudge,
                compressor_type,
                compressor_count,
                min_ideal_alt,
                upgrades,
            } => {
                map.insert("engine_type".to_string(), 0.into());
                map.insert("displacement".to_string(), (*displacement as f64).into());
                map.insert("compression".to_string(), (*compression as f64).into());
                map.insert("cyl_per_row".to_string(), (*cyl_per_row).into());
                map.insert("rows".to_string(), (*rows).into());
                map.insert("RPM_boost".to_string(), (*rpm_boost as f64).into());
                map.insert("material_fudge".to_string(), (*material_fudge as f64).into());
                map.insert("quality_fudge".to_string(), (*quality_fudge as f64).into());
                map.insert("compressor_type".to_string(), (*compressor_type).into());
                map.insert("compressor_count".to_string(), (*compressor_count).into());
                map.insert("min_IAF".to_string(), (*min_ideal_alt).into());
                let upgrades_arr: Vec<serde_json::Value> = upgrades.iter().map(|&b| b.into()).collect();
                map.insert("upgrades".to_string(), serde_json::Value::Array(upgrades_arr));
            }
            TypedInputs::Pulsejet {
                power,
                quality_cost,
                quality_reliability,
                starter,
            } => {
                map.insert("engine_type".to_string(), 1.into());
                map.insert("power".to_string(), (*power).into());
                map.insert("quality_cost".to_string(), (*quality_cost as f64).into());
                map.insert("quality_rely".to_string(), (*quality_reliability as f64).into());
                map.insert("starter".to_string(), (*starter).into());
            }
            TypedInputs::Turbine {
                flow_adjustment,
                diameter,
                compression_ratio,
                bypass_ratio,
                upgrades,
            } => {
                map.insert("engine_type".to_string(), 2.into());
                map.insert("flow_adjustment".to_string(), (*flow_adjustment as f64).into());
                map.insert("diameter".to_string(), (*diameter as f64).into());
                map.insert("compression_ratio".to_string(), (*compression_ratio as f64).into());
                map.insert("bypass_ratio".to_string(), (*bypass_ratio as f64).into());
                let upgrades_arr: Vec<serde_json::Value> = upgrades.iter().map(|&b| b.into()).collect();
                map.insert("upgrades".to_string(), serde_json::Value::Array(upgrades_arr));
            }
            TypedInputs::Electric {
                power,
                winding_sel,
                chonk,
                quality_fudge,
            } => {
                map.insert("engine_type".to_string(), 3.into());
                map.insert("power".to_string(), (*power).into());
                map.insert("winding_sel".to_string(), (*winding_sel).into());
                map.insert("diameter".to_string(), (*chonk).into());
                map.insert("quality_fudge".to_string(), (*quality_fudge as f64).into());
            }
        }

        serde_json::Value::Object(map)
    }
}

#[derive(UIBindings)]
pub struct Engine {
    elist_key: String,
    etype_stats: EngineStats,
    etype_inputs: EngineInputs,

    #[ui(number, name = "cooling_count", set_fn = "set_cooling")]
    cooling_count: i16,

    #[ui(number, name = "radiator_index", enabled_fn = "is_radiator_enabled", set_fn = "set_radiator")]
    radiator_index: i16,

    num_radiators: i16,

    mount_list: Rc<Vec<Mount>>,

    #[ui(select, source = "mount_list", enabled_fn = "is_mount_select_enabled", set_fn = "set_mount_index")]
    mount_sel: usize,

    #[ui(check, name = "use_pushpull", enabled_fn = "is_pushpull_enabled", set_fn = "set_use_push_pull")]
    is_push_pull: bool,

    #[ui(check, name = "pp_torque_to_struct", enabled_fn = "is_torque_to_struct_enabled", set_fn = "set_torque_to_struct")]
    torque_to_struct: bool,

    #[ui(check, name = "intake_fan", enabled_fn = "is_intake_fan_enabled", set_fn = "set_intake_fan")]
    intake_fan: bool,

    #[ui(check, name = "use_driveshafts", enabled_fn = "is_extended_ds_enabled", set_fn = "set_use_extended_driveshaft")]
    extended_ds: bool,

    #[ui(check, name = "outboard_prop", enabled_fn = "is_outboard_prop_enabled", set_fn = "set_outboard_prop")]
    outboard_prop: bool,

    #[ui(number, name = "geared_propeller_ratio", enabled_fn = "is_gears_enabled", set_fn = "set_gear_count")]
    gear_count: i16,

    #[ui(number, name = "geared_propeller_reliability", enabled_fn = "is_gears_enabled", set_fn = "set_gear_reliability")]
    geared_reliability: i16,

    cowl_list: Rc<Vec<Cowl>>,

    #[ui(select, source = "cowl_list", enabled_fn = "is_cowl_enabled", set_fn = "set_cowl")]
    cowl_sel: usize,

    #[ui(check, name = "is_generator", enabled_fn = "is_generator_enabled", set_fn = "set_generator")]
    is_generator: bool,

    #[ui(check, name = "has_alternator", enabled_fn = "is_alternator_enabled", set_fn = "set_alternator")]
    has_alternator: bool,

    is_internal: bool,

    total_reliability: i16,
    is_first_pulsejet: bool,
}

impl Engine {
    pub fn new(mount_list: Rc<Vec<Mount>>, cowl_list: Rc<Vec<Cowl>>) -> Engine {
        // Initialize engine lists on first use
        crate::engine_list::init_engine_lists();

        let etype_inputs = EngineInputs::new();
        let etype_stats = EngineStats::new();
        let cooling_count = etype_stats.stats.cooling as i16;

        Engine {
            elist_key: "Custom".to_string(),
            etype_stats,
            etype_inputs,
            cooling_count,
            radiator_index: if cooling_count > 0 { 0 } else { -1 },
            num_radiators: 0,
            mount_list,
            mount_sel: 0,
            intake_fan: false,
            is_push_pull: false,
            torque_to_struct: false,
            cowl_list,
            cowl_sel: 0,
            extended_ds: false,
            outboard_prop: false,
            gear_count: 0,
            geared_reliability: 0,
            total_reliability: 0,
            is_generator: false,
            has_alternator: false,
            is_first_pulsejet: false,
            is_internal: false,
        }
    }

    // Helper methods from TypeScript

    fn need_cooling(&self) -> bool {
        self.etype_stats.stats.cooling > 0.0
    }

    fn get_is_pulsejet(&self) -> bool {
        self.etype_stats.pulsejet
    }

    fn get_is_turbine(&self) -> bool {
        matches!(self.etype_inputs.inputs, TypedInputs::Turbine { .. })
    }

    fn get_is_turboprop(&self) -> bool {
        if let TypedInputs::Turbine { .. } = self.etype_inputs.inputs {
            self.etype_inputs.etype == 3
        } else {
            false
        }
    }

    fn get_is_electric(&self) -> bool {
        matches!(self.etype_inputs.inputs, TypedInputs::Electric { .. })
    }

    fn get_num_propellers(&self) -> i16 {
        if !(self.get_is_pulsejet() || self.get_is_turbine() || self.is_generator) || self.get_is_turboprop() || self.is_internal {
            if self.is_push_pull {
                return 2;
            }
            return 1;
        }
        0
    }

    fn is_rotary(&self) -> bool {
        self.etype_stats.oiltank
    }

    fn is_contra_rotary(&self) -> bool {
        if !self.get_is_pulsejet() && !self.get_is_turbine() {
            if !self.elist_key.is_empty() && self.etype_inputs.etype == 3 {
                return true;
            }
        }
        false
    }

    fn is_air_cooled(&self) -> bool {
        !self.get_is_pulsejet() && !self.get_is_turbine() && !self.need_cooling() && !self.is_rotary()
    }

    fn is_tractor(&self) -> bool {
        if self.is_internal || self.is_generator {
            return false;
        }
        let mount_name = &self.mount_list[self.mount_sel].name;
        mount_name == "Tractor" || mount_name == "Center-Mounted Tractor" || mount_name == "Fuselage Push-Pull"
    }

    fn is_pusher(&self) -> bool {
        if self.is_internal || self.is_generator {
            return false;
        }
        let mount_name = &self.mount_list[self.mount_sel].name;
        mount_name == "Rear-Mounted Pusher" || mount_name == "Center-Mounted Pusher" || mount_name == "Fuselage Push-Pull"
    }

    fn can_use_push_pull(&self) -> bool {
        !(self.is_generator || self.get_is_pulsejet() || self.get_is_turbine() || self.is_internal || self.mount_list[self.mount_sel].helicopter)
    }

    fn can_use_extended_driveshaft(&self) -> bool {
        !(self.get_num_propellers() == 0 || self.is_internal || self.is_generator || self.mount_list[self.mount_sel].helicopter)
    }

    fn can_outboard_prop(&self) -> bool {
        self.extended_ds && (self.is_tractor() || self.mount_list[self.mount_sel].name == "Fuselage Push-Pull")
    }

    fn verify_mount(&mut self) {
        if self.get_is_turbine() && !self.get_is_turboprop() {
            while self.mount_sel < self.mount_list.len() && !self.mount_list[self.mount_sel].turbine {
                self.mount_sel += 1;
            }
        } else if self.get_is_pulsejet() {
            if self.mount_list[self.mount_sel].mount_type == crate::engines::MountType::Fuselage {
                for i in 0..self.mount_list.len() {
                    if !matches!(self.mount_list[i].mount_type, crate::engines::MountType::Fuselage) {
                        self.mount_sel = i;
                        break;
                    }
                }
            }
        } else if self.is_generator {
            self.mount_sel = 0;
        } else {
            if self.mount_list[self.mount_sel].turbine {
                if self.is_push_pull {
                    self.mount_sel = 8;
                } else {
                    self.mount_sel = 0;
                }
            }
        }
    }

    fn verify_cooling(&mut self) {
        if self.need_cooling() {
            self.cooling_count = self.cooling_count.max(1);
            if self.radiator_index < 0 {
                self.radiator_index = 0;
            }
        } else {
            self.cooling_count = 0;
            self.radiator_index = -1;
        }
    }

    fn pulsejet_check(&mut self) {
        if self.get_is_pulsejet() {
            self.is_push_pull = false;
            self.extended_ds = false;
            self.gear_count = 0;
            self.geared_reliability = 0;
            self.cooling_count = 0;
            self.has_alternator = false;
            self.is_generator = false;
            self.cowl_sel = 0;
            self.radiator_index = -1;
        }
    }

    fn turbine_check(&mut self) {
        if self.get_is_turbine() {
            if self.get_num_propellers() == 0 {
                self.extended_ds = false;
                self.gear_count = 0;
                self.geared_reliability = 0;
            }
            self.cooling_count = 0;
            self.cowl_sel = 0;
            self.radiator_index = -1;
        }
    }

    fn electric_check(&mut self) {
        if self.get_is_electric() {
            self.has_alternator = false;
        }
    }

    fn is_diesel(&self) -> bool {
        if let TypedInputs::Propeller { upgrades, .. } = &self.etype_inputs.inputs {
            upgrades.len() > 3 && upgrades[3]
        } else {
            false
        }
    }

    // UI enabled condition methods

    fn is_radiator_enabled(&self) -> bool {
        self.need_cooling() && self.num_radiators > 0
    }

    fn is_mount_select_enabled(&self) -> bool {
        !self.is_generator
    }

    fn is_pushpull_enabled(&self) -> bool {
        self.can_use_push_pull()
    }

    fn is_torque_to_struct_enabled(&self) -> bool {
        self.is_push_pull && self.mount_list[self.mount_sel].name == "Fuselage Push-Pull"
    }

    fn is_intake_fan_enabled(&self) -> bool {
        self.is_air_cooled()
    }

    fn is_extended_ds_enabled(&self) -> bool {
        self.can_use_extended_driveshaft()
    }

    fn is_outboard_prop_enabled(&self) -> bool {
        self.can_outboard_prop()
    }

    fn is_gears_enabled(&self) -> bool {
        self.get_num_propellers() > 0 && !self.is_internal
    }

    fn is_cowl_enabled(&self) -> bool {
        !self.get_is_pulsejet() && !self.get_is_turbine() && !self.is_internal
    }

    fn is_generator_enabled(&self) -> bool {
        !self.get_is_pulsejet() && !self.get_is_turbine()
    }

    fn is_alternator_enabled(&self) -> bool {
        !self.is_generator && !self.get_is_electric()
    }

    // UI source list method
    fn radiator_list(&self) -> Vec<String> {
        (0..self.num_radiators)
            .map(|i| format!("Radiator {}", i + 1))
            .collect()
    }

    // Setter functions with verification (for UIBindings)

    /// Set cooling count with validation
    /// TypeScript: SetCooling(num: number)
    fn set_cooling(&mut self, mut num: i16) {
        // Validate input
        if num < 0 {
            num = 0;
        }

        self.cooling_count = num;

        // Enforce minimum if cooling is needed
        if self.need_cooling() {
            self.cooling_count = self.cooling_count.max(1);
        }

        // Enforce maximum
        let max_cooling = if self.is_push_pull {
            2 * self.etype_stats.stats.cooling as i16
        } else {
            self.etype_stats.stats.cooling as i16
        };
        self.cooling_count = self.cooling_count.min(max_cooling);
    }

    /// Set gear count with validation
    /// TypeScript: SetGearCount(num: number)
    fn set_gear_count(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        self.gear_count = num;
        // Adjust reliability to not exceed count
        self.set_gear_reliability(self.geared_reliability);
    }

    /// Set gear reliability with validation
    /// TypeScript: SetGearReliability(num: number)
    fn set_gear_reliability(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        // Reliability cannot exceed gear count
        self.geared_reliability = num.min(self.gear_count);
    }

    /// Set torque to struct with validation
    /// TypeScript: SetTorqueToStruct(use: boolean)
    fn set_torque_to_struct(&mut self, use_it: bool) {
        self.torque_to_struct = use_it;
        // Only works with push-pull
        if !self.is_push_pull {
            self.torque_to_struct = false;
        }
    }

    /// Set push-pull configuration
    /// TypeScript: SetUsePushPull(use: boolean)
    fn set_use_push_pull(&mut self, use_it: bool) {
        if !use_it && self.is_push_pull {
            // Turning off push-pull
            self.cooling_count = (self.cooling_count as f64 / 2.0).floor() as i16;
            // If current mount is push-pull specific, reset to default
            if self.mount_list[self.mount_sel].name == "Fuselage Push-Pull" {
                self.mount_sel = 0;
            }
        } else if use_it && !self.is_push_pull {
            // Turning on push-pull
            self.cooling_count *= 2;
            // If fuselage mount, switch to push-pull specific
            if self.mount_list[self.mount_sel].mount_type == crate::engines::MountType::Fuselage {
                // Find push-pull mount (index 8 in TypeScript)
                for (i, mount) in self.mount_list.iter().enumerate() {
                    if mount.name == "Fuselage Push-Pull" {
                        self.mount_sel = i;
                        break;
                    }
                }
            }
        }
        self.is_push_pull = use_it;
    }

    /// Set extended driveshaft with validation
    /// TypeScript: SetUseExtendedDriveshaft(use: boolean)
    fn set_use_extended_driveshaft(&mut self, use_it: bool) {
        if self.is_generator || self.is_internal {
            self.extended_ds = false;
        } else {
            self.extended_ds = use_it;
        }
    }

    /// Set generator mode
    /// TypeScript: SetGenerator(use: boolean)
    fn set_generator(&mut self, use_it: bool) {
        if !self.get_is_pulsejet() && !self.is_push_pull && !self.get_is_electric() {
            self.is_generator = use_it;
        } else {
            self.is_generator = false;
        }

        // When enabling generator, disable incompatible options
        if self.is_generator {
            self.gear_count = 0;
            self.geared_reliability = 0;
            self.extended_ds = false;
            self.is_push_pull = false;
        }
    }

    /// Set alternator with validation
    /// TypeScript: SetAlternator(use: boolean)
    fn set_alternator(&mut self, use_it: bool) {
        if !self.get_is_pulsejet() && !self.is_generator && !self.get_is_electric() {
            self.has_alternator = use_it;
        } else {
            self.has_alternator = false;
        }
    }

    /// Set intake fan with validation
    /// TypeScript: SetIntakeFan(use: boolean)
    fn set_intake_fan(&mut self, use_it: bool) {
        if self.is_air_cooled() {
            self.intake_fan = use_it;
        } else {
            self.intake_fan = false;
        }
    }

    /// Set outboard prop with validation
    /// TypeScript: SetOutboardProp(use: boolean)
    fn set_outboard_prop(&mut self, use_it: bool) {
        if use_it && self.extended_ds {
            self.outboard_prop = true;
        } else {
            self.outboard_prop = false;
        }
    }

    /// Set mount index with validation
    /// TypeScript: SetMountIndex(num: number)
    fn set_mount_index(&mut self, num: usize) {
        if num >= self.mount_list.len() {
            return; // Invalid index
        }
        self.mount_sel = num;

        // If mount requires extended driveshaft, enable it
        if self.mount_list[self.mount_sel].require_extended_driveshafts {
            self.set_use_extended_driveshaft(true);
        }
    }

    /// Set radiator index
    /// TypeScript: SetRadiator(num: number)
    fn set_radiator(&mut self, num: i16) {
        self.radiator_index = num;
    }

    /// Verify cowl selection is valid
    fn verify_cowl(&mut self, num: usize) {
        if num >= self.cowl_list.len() {
            return;
        }

        let cowl = &self.cowl_list[num];
        let is_valid = if self.get_is_pulsejet() || self.get_is_turbine() {
            // Only "no cowl" allowed (all three flags true)
            cowl.for_air_cooled && cowl.for_rotary && cowl.for_liquid_cooled
        } else if self.need_cooling() {
            cowl.for_liquid_cooled
        } else if self.is_rotary() {
            cowl.for_rotary
        } else {
            cowl.for_air_cooled
        };

        if is_valid {
            self.cowl_sel = num;
        } else {
            // Find first valid cowl (usually index 0)
            for (i, c) in self.cowl_list.iter().enumerate() {
                let valid = if self.get_is_pulsejet() || self.get_is_turbine() {
                    c.for_air_cooled && c.for_rotary && c.for_liquid_cooled
                } else if self.need_cooling() {
                    c.for_liquid_cooled
                } else if self.is_rotary() {
                    c.for_rotary
                } else {
                    c.for_air_cooled
                };

                if valid {
                    self.cowl_sel = i;
                    break;
                }
            }
        }
    }

    /// Set cowl with validation
    /// TypeScript: SetCowl(num: number)
    fn set_cowl(&mut self, num: usize) {
        self.verify_cowl(num);
    }
}

impl Engine {
    /// Old deserialization for versions <= 10.55
    fn old_deserialize(&mut self, d: &mut crate::serialization::Deserializer) -> Result<EngineInputs, Error> {
        // Deserialize EngineStats fields
        self.etype_stats.name = d.get_string()?;
        self.etype_stats.overspeed = d.get_num()?;
        self.etype_stats.altitude = d.get_num()?;
        self.etype_stats.torque = d.get_num()?;
        self.etype_stats.rumble = d.get_num()?;
        self.etype_stats.oiltank = d.get_bool()?;
        self.etype_stats.pulsejet = d.get_bool()?;

        // Create new EngineInputs
        let mut inputs = EngineInputs::new();

        if d.version > 10.45 {
            inputs.name = self.etype_stats.name.clone();

            if self.etype_stats.pulsejet {
                // Pulsejet engine
                let power = d.get_num()?;
                let etype = d.get_num()?;
                let era_sel = d.get_num()?;
                let quality_cost = d.get_num()? as f32;
                let quality_rely = d.get_num()? as f32;
                let starter = d.get_bool()?;

                inputs.etype = etype;
                inputs.era_sel = era_sel;
                inputs.inputs = TypedInputs::Pulsejet {
                    power,
                    quality_cost,
                    quality_reliability: quality_rely,
                    starter,
                };
            } else {
                // Propeller engine
                let displacement = d.get_float()?;
                let compression = d.get_float()?;
                let etype = d.get_num()?;
                let cyl_per_row = d.get_num()?;
                let rows = d.get_num()?;
                let rpm_boost = d.get_float()?;
                let era_sel = d.get_num()?;
                let material_fudge = d.get_float()?;
                let quality_fudge = d.get_float()?;
                let upgrades = d.get_bool_arr(0)?; // Use 0 to get actual length

                inputs.etype = etype;
                inputs.era_sel = era_sel;

                let (compressor_type, compressor_count, min_ideal_alt, final_upgrades) = if upgrades.len() == 6 {
                    // Old version with 6 upgrades
                    self.etype_stats.altitude = self.etype_stats.altitude * 10 - 1;

                    let mut comp_type = 0;
                    let mut comp_count = 0;

                    if upgrades[0] {
                        comp_type = 2;
                        comp_count = 1;
                    }
                    if upgrades[1] {
                        comp_type = 3;
                        comp_count = 1;
                    }

                    // Remove first 2 elements and keep last 4
                    let final_upg = upgrades[2..].to_vec();
                    (comp_type, comp_count, 0, final_upg)
                } else {
                    // Newer version with separate compressor fields
                    let comp_type = d.get_num()?;
                    let comp_count = d.get_num()?;
                    let min_iaf = d.get_num()?;
                    (comp_type, comp_count, min_iaf, upgrades)
                };

                inputs.inputs = TypedInputs::Propeller {
                    displacement,
                    compression,
                    cyl_per_row,
                    rows,
                    rpm_boost,
                    material_fudge,
                    quality_fudge,
                    compressor_type,
                    compressor_count,
                    min_ideal_alt,
                    upgrades: final_upgrades,
                };
            }
        } else {
            // Very old version (< 10.45)
            self.etype_stats.altitude = self.etype_stats.altitude * 10 - 1;
        }

        // Deserialize stats
        self.etype_stats.stats.deserialize(d)?;

        Ok(inputs)
    }
}

impl Serializable for Engine {
    fn deserialize(&mut self, d: &mut crate::serialization::Deserializer) -> Result<(), Error> {
        if d.version > 10.55 {
            self.etype_stats.deserialize(d)?;
            self.etype_inputs.deserialize(d)?;

            // Find the engine list key
            let list_key = crate::engine_list::search_all_engine_lists(&self.etype_stats.name);
            if !list_key.is_empty() {
                self.elist_key = list_key;
            } else {
                // Not found in any list, add to Custom
                self.elist_key = "Custom".to_string();
                if self.etype_inputs.name != "Default" {
                    let _ = crate::engine_list::add_custom_engine(self.etype_inputs.clone());
                }
            }
        } else {
            // Old deserialization (version <= 10.55)
            let e_inputs = self.old_deserialize(d)?;

            if e_inputs.name != "Default" {
                let list_key = crate::engine_list::search_all_engine_lists(&self.etype_stats.name);
                if !list_key.is_empty() {
                    self.elist_key = list_key;
                } else {
                    let _ = crate::engine_list::add_custom_engine(e_inputs.clone());
                    self.elist_key = "Custom".to_string();
                }
            }

            self.etype_inputs = e_inputs;
        }

        self.cooling_count = d.get_num()?;
        self.radiator_index = d.get_num()?;
        self.mount_sel = d.get_num()? as usize;
        self.is_push_pull = d.get_bool()?;
        self.torque_to_struct = d.get_bool()?;
        self.extended_ds = d.get_bool()?;
        self.gear_count = d.get_num()?;
        self.geared_reliability = d.get_num()?;
        self.cowl_sel = d.get_num()? as usize;
        self.is_generator = d.get_bool()?;
        self.has_alternator = d.get_bool()?;
        self.intake_fan = d.get_bool()?;
        if d.version >= 12.15 {
            self.outboard_prop = d.get_bool()?;
        } else {
            self.outboard_prop = false;
        }

        Ok(())
    }

    fn serialize(&self, s: &mut crate::serialization::Serializer) -> Result<(), Error> {
        self.etype_stats.serialize(s)?;
        self.etype_inputs.serialize(s)?;
        s.push_num(self.cooling_count)?;
        s.push_num(self.radiator_index)?;
        s.push_num(self.mount_sel as i16)?;
        s.push_bool(self.is_push_pull)?;
        s.push_bool(self.torque_to_struct)?;
        s.push_bool(self.extended_ds)?;
        s.push_num(self.gear_count)?;
        s.push_num(self.geared_reliability)?;
        s.push_num(self.cowl_sel as i16)?;
        s.push_bool(self.is_generator)?;
        s.push_bool(self.has_alternator)?;
        s.push_bool(self.intake_fan)?;
        s.push_bool(self.outboard_prop)?;
        Ok(())
    }
}

impl JSSerializable for Engine {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.etype_stats.from_json(jsobj(js, "selected_stats"), json_version);
        self.etype_inputs.from_json(jsobj(js, "selected_inputs"), json_version);

        self.cooling_count = jsnum(js, "cooling_count") as i16;
        self.radiator_index = jsnum(js, "radiator_index") as i16;
        self.mount_sel = jsnum(js, "selected_mount") as usize;
        self.is_push_pull = jsbool(js, "use_pushpull");
        self.torque_to_struct = jsbool(js, "pp_torque_to_struct");
        self.extended_ds = jsbool(js, "use_driveshafts");
        self.gear_count = jsnum(js, "geared_propeller_ratio") as i16;
        self.geared_reliability = jsnum(js, "geared_propeller_reliability") as i16;
        self.cowl_sel = jsnum(js, "cowl_sel") as usize;
        self.is_generator = jsbool(js, "is_generator");
        self.has_alternator = jsbool(js, "has_alternator");
        self.intake_fan = jsbool(js, "intake_fan");

        if json_version >= 12.15 {
            self.outboard_prop = jsbool(js, "outboard_prop");
        } else {
            self.outboard_prop = false;
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("selected_stats".to_string(), self.etype_stats.to_json());
        map.insert("selected_inputs".to_string(), self.etype_inputs.to_json());
        map.insert("cooling_count".to_string(), self.cooling_count.into());
        map.insert("radiator_index".to_string(), self.radiator_index.into());
        map.insert("selected_mount".to_string(), self.mount_sel.into());
        map.insert("use_pushpull".to_string(), self.is_push_pull.into());
        map.insert("pp_torque_to_struct".to_string(), self.torque_to_struct.into());
        map.insert("use_driveshafts".to_string(), self.extended_ds.into());
        map.insert("geared_propeller_ratio".to_string(), self.gear_count.into());
        map.insert("geared_propeller_reliability".to_string(), self.geared_reliability.into());
        map.insert("cowl_sel".to_string(), self.cowl_sel.into());
        map.insert("is_generator".to_string(), self.is_generator.into());
        map.insert("has_alternator".to_string(), self.has_alternator.into());
        map.insert("intake_fan".to_string(), self.intake_fan.into());
        map.insert("outboard_prop".to_string(), self.outboard_prop.into());

        serde_json::Value::Object(map)
    }
}

impl Part for Engine {
    fn part_stats(&mut self) -> Stats {
        // Verify various settings (from TypeScript lines 993-1006)
        self.verify_mount();
        self.verify_cooling();
        self.pulsejet_check();
        self.turbine_check();
        self.electric_check();

        if !self.can_use_push_pull() {
            self.is_push_pull = false;
        }
        if !self.can_use_extended_driveshaft() {
            self.extended_ds = false;
        }
        if !self.can_outboard_prop() {
            self.outboard_prop = false;
        }

        let mut stats = Stats::new();
        stats = stats.add(&self.etype_stats.stats);

        // Upkeep calculation (line 1010-1013)
        stats.upkeep = stats.power / 10.0;
        if self.get_is_pulsejet() {
            stats.upkeep += 1.0;
        }

        // Oil tank (line 1015-1016)
        if self.etype_stats.oiltank {
            stats.mass += 1.0;
        }

        // Torque handling (lines 1018-1034)
        // Note: torque variable was in TypeScript but not actually used
        if self.torque_to_struct {
            stats.structure -= self.etype_stats.torque as f64;
        } else {
            match self.mount_list[self.mount_sel].mount_type {
                crate::engines::MountType::Wing => {
                    stats.maxstrain -= self.etype_stats.torque as f64;
                }
                crate::engines::MountType::Fuselage => {
                    stats.latstab -= self.etype_stats.torque as f64;
                }
                _ => {}
            }
        }

        // ContraRotary engines need geared propellers (lines 1037-1039)
        if self.is_contra_rotary() {
            self.gear_count = self.gear_count.max(1);
        }

        // Geared propellers (lines 1040-1046)
        stats.cost += self.gear_count as f64 + self.geared_reliability as f64;
        if self.gear_count > 0 {
            stats.eras.push(crate::stats::Era {
                name: "Propeller Gearing".to_string(),
                era: crate::stats::ERA::WWI,
            });
        }
        if self.geared_reliability > 0 {
            stats.eras.push(crate::stats::Era {
                name: "Reliable Gearing".to_string(),
                era: crate::stats::ERA::Roaring20s,
            });
        }

        // Extended Driveshafts (lines 1049-1051)
        if self.extended_ds {
            stats.mass += 1.0;
        }

        // Cowls modify engine stats directly (lines 1053-1056)
        stats = stats.add(&self.cowl_list[self.cowl_sel].stats);
        stats.mass += (1.0e-6 + stats.drag * self.cowl_list[self.cowl_sel].mass_per_drag).floor();
        stats.drag = (1.0e-6 + stats.drag * self.cowl_list[self.cowl_sel].drag_factor).floor();

        // Push-pull (lines 1059-1072)
        if self.is_push_pull {
            stats.power *= 2.0;
            stats.mass *= 2.0;
            stats.cooling *= 2.0;
            stats.fuelconsumption *= 2.0;
            stats.cost *= 2.0;
            stats.latstab *= 2.0;
            stats.structure *= 2.0;
            stats.maxstrain *= 2.0;
            stats.upkeep *= 2.0;
            stats.reqsections *= 2.0;
            stats.charge *= 2.0;
            stats.power = (1.0e-6 + self.mount_list[self.mount_sel].power_factor * stats.power).floor();
        }

        // Cowl engineering cost for pushers (lines 1075-1083)
        let cowl_name = &self.cowl_list[self.cowl_sel].name;
        let mount_name = &self.mount_list[self.mount_sel].name;
        if cowl_name != "No Cowling" && cowl_name != "Sealed Cowl" {
            if mount_name == "Rear-Mounted Pusher"
                || mount_name == "Center-Mounted Pusher"
                || mount_name == "Center-Mounted Tractor"
                || mount_name == "Fuselage Push-Pull"
            {
                stats.cost += 2.0;
            }
        }

        // Air Cooling Fan (lines 1086-1097)
        if self.is_air_cooled() && self.intake_fan {
            stats.mass += 3.0;
            // Double effect of torque
            stats.latstab *= 2.0;
            stats.structure *= 2.0;
            stats.maxstrain *= 2.0;
            stats.cost += 4.0;
            stats.eras.push(crate::stats::Era {
                name: "Air Cooling Fan".to_string(),
                era: crate::stats::ERA::WWII,
            });
        } else {
            self.intake_fan = false;
        }

        // Oil cooler drag (lines 1100-1102)
        if self.etype_stats.stats.cooling > 0.0 {
            stats.drag += (stats.power / 15.0).floor();
        }

        // Mounting modifiers (lines 1106-1110)
        if !self.get_is_pulsejet() {
            stats = stats.add(&self.mount_list[self.mount_sel].stats);
            stats.maxstrain -= (1.0e-6 + self.mount_list[self.mount_sel].strain_factor * self.etype_stats.stats.mass).floor();
            stats.drag += (1.0e-6 + self.mount_list[self.mount_sel].drag_factor * self.etype_stats.stats.mass).floor();
        }

        // Power Generation (lines 1113-1125)
        if self.is_generator {
            stats.charge = (1.0e-6 + 2.0 * stats.power / 10.0).floor() + 2.0;
            stats.power = 0.0;
            stats.visibility = 2.0;
        } else if self.has_alternator {
            stats.charge = (1.0e-6 + stats.power / 10.0).floor() + 1.0;
            stats.mass += 1.0;
            stats.cost += 2.0;
            if self.is_push_pull && mount_name == "Fuselage Push-Pull" {
                stats.mass += 1.0;
                stats.cost += 2.0;
            }
        }

        // Outboard prop (lines 1127-1132)
        if self.outboard_prop {
            stats.drag += 3.0;
            if self.is_push_pull {
                stats.escape += 2.0;
            }
        }

        // First pulsejet cost (lines 1134-1136)
        if self.is_first_pulsejet {
            stats.cost += 5.0;
        }

        // Pitch speed and reliability are part-local (lines 1139-1141)
        stats.pitchspeed = 0.0;
        stats.reliability = 0.0;

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::serialization::JSSerializable;

    #[test]
    fn test_engine_inputs_part_stats_propeller() {
        // Test propeller engine integration
        let json_str = r#"{
            "name": "Test Propeller",
            "engine_type": 0,
            "type": 5,
            "era_sel": 1,
            "displacement": 14.72,
            "compression": 5,
            "cyl_per_row": 9,
            "rows": 1,
            "RPM_boost": 0.78,
            "material_fudge": 0.9,
            "quality_fudge": 1.1,
            "compressor_type": 0,
            "compressor_count": 0,
            "min_IAF": 0,
            "upgrades": [false, false, false, false],
            "rarity": 1
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Test Propeller");
        assert_eq!(stats.stats.power, 14.0);
        assert!(stats.stats.mass > 0.0);
        assert!(!stats.pulsejet);
    }

    #[test]
    fn test_engine_inputs_part_stats_pulsejet() {
        // Test pulsejet engine integration
        let json_str = r#"{
            "name": "Test Pulsejet",
            "engine_type": 1,
            "type": 0,
            "era_sel": 1,
            "power": 10,
            "quality_cost": 1,
            "quality_rely": 1,
            "starter": false,
            "rarity": 1
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Pulsejet PV-10 (WWI)");
        assert_eq!(stats.stats.power, 10.0);
        assert!(stats.pulsejet);
        assert_eq!(stats.overspeed, 100);
        assert_eq!(stats.altitude, 29);
    }

    #[test]
    fn test_engine_inputs_part_stats_turbine() {
        // Test turbine engine integration
        let json_str = r#"{
            "name": "Test Turbojet",
            "engine_type": 2,
            "type": 0,
            "era_sel": 2,
            "flow_adjustment": 0,
            "diameter": 0.7,
            "compression_ratio": 5,
            "bypass_ratio": 0,
            "upgrades": [false, false, false, false],
            "rarity": 0
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Test Turbojet");
        assert_eq!(stats.stats.power, 110.0);
        assert!(!stats.pulsejet);
        assert_eq!(stats.overspeed, 100);
        assert_eq!(stats.altitude, 59);
    }

    #[test]
    fn test_engine_inputs_part_stats_electric() {
        // Test electric engine integration
        let json_str = r#"{
            "name": "Test Electric",
            "engine_type": 3,
            "power": 10,
            "era_sel": 1,
            "winding_sel": 1,
            "diameter": 0,
            "material_fudge": 2,
            "quality_fudge": 0.5
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Test Electric");
        assert_eq!(stats.stats.power, 10.0);
        assert!(!stats.pulsejet);
        assert_eq!(stats.altitude, 100);
        assert_eq!(stats.stats.fuelconsumption, 0.0);
        assert!(stats.stats.charge < 0.0); // Electric motors draw power
    }

    // Helper functions for setter tests
    fn create_test_mounts() -> Rc<Vec<Mount>> {
        use crate::engines::MountType;
        Rc::new(vec![
            Mount {
                name: "Tractor".to_string(),
                mount_type: MountType::Wing,
                stats: Stats::new(),
                strain_factor: 0.0,
                drag_factor: 0.0,
                power_factor: 1.0,
                require_extended_driveshafts: false,
                require_tail: false,
                helicopter: false,
                turbine: false,
                pushpull: false,
            },
            Mount {
                name: "Fuselage Push-Pull".to_string(),
                mount_type: MountType::Fuselage,
                stats: Stats::new(),
                strain_factor: 0.0,
                drag_factor: 0.0,
                power_factor: 1.0,
                require_extended_driveshafts: false,
                require_tail: false,
                helicopter: false,
                turbine: false,
                pushpull: true,
            },
        ])
    }

    fn create_test_cowls() -> Rc<Vec<Cowl>> {
        Rc::new(vec![
            Cowl {
                name: "No Cowling".to_string(),
                stats: Stats::new(),
                drag_factor: 1.0,
                mass_per_drag: 0.0,
                for_air_cooled: true,
                for_liquid_cooled: true,
                for_rotary: true,
            },
            Cowl {
                name: "Air Cowl".to_string(),
                stats: Stats::new(),
                drag_factor: 0.8,
                mass_per_drag: 0.5,
                for_air_cooled: true,
                for_liquid_cooled: false,
                for_rotary: false,
            },
        ])
    }

    #[test]
    fn test_set_cooling_validation() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Set cooling with cooling required
        engine.etype_stats.stats.cooling = 5.0;
        engine.set_cooling(3);
        assert_eq!(engine.cooling_count, 3, "Should accept valid cooling count");

        // Test minimum when cooling needed
        engine.set_cooling(0);
        assert_eq!(engine.cooling_count, 1, "Should enforce minimum of 1 when cooling needed");

        // Test maximum enforcement
        engine.set_cooling(10);
        assert_eq!(engine.cooling_count, 5, "Should enforce maximum based on engine stats");

        // Test with push-pull (doubles maximum)
        engine.is_push_pull = true;
        engine.set_cooling(8);
        assert_eq!(engine.cooling_count, 8, "Should allow higher cooling with push-pull");

        engine.set_cooling(15);
        assert_eq!(engine.cooling_count, 10, "Should enforce doubled maximum with push-pull");
    }

    #[test]
    fn test_set_gear_count_and_reliability() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Set valid gear count
        engine.set_gear_count(5);
        assert_eq!(engine.gear_count, 5, "Should set gear count");

        // Set reliability higher than count
        engine.set_gear_reliability(10);
        assert_eq!(engine.geared_reliability, 5, "Reliability should be capped at gear count");

        // Reduce gear count, reliability should adjust
        engine.geared_reliability = 5;
        engine.set_gear_count(3);
        assert_eq!(engine.geared_reliability, 3, "Reliability should reduce when gear count reduces");

        // Test negative input
        engine.set_gear_count(-5);
        assert_eq!(engine.gear_count, 0, "Should reject negative gear count");
    }

    #[test]
    fn test_set_torque_to_struct() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Enable without push-pull
        engine.set_torque_to_struct(true);
        assert!(!engine.torque_to_struct, "Should not enable without push-pull");

        // Enable with push-pull
        engine.is_push_pull = true;
        engine.set_torque_to_struct(true);
        assert!(engine.torque_to_struct, "Should enable with push-pull");

        // Disable push-pull
        engine.is_push_pull = false;
        engine.set_torque_to_struct(true);
        assert!(!engine.torque_to_struct, "Should disable when push-pull disabled");
    }

    #[test]
    fn test_set_use_push_pull() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());
        engine.cooling_count = 4;
        engine.mount_sel = 0;

        // Enable push-pull
        engine.set_use_push_pull(true);
        assert!(engine.is_push_pull, "Should enable push-pull");
        assert_eq!(engine.cooling_count, 8, "Should double cooling count");

        // Disable push-pull
        engine.set_use_push_pull(false);
        assert!(!engine.is_push_pull, "Should disable push-pull");
        assert_eq!(engine.cooling_count, 4, "Should halve cooling count");
    }

    #[test]
    fn test_set_generator() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());
        engine.gear_count = 5;
        engine.geared_reliability = 3;
        engine.extended_ds = true;

        // Enable generator
        engine.set_generator(true);
        assert!(engine.is_generator, "Should enable generator");
        assert_eq!(engine.gear_count, 0, "Should reset gear count");
        assert_eq!(engine.geared_reliability, 0, "Should reset gear reliability");
        assert!(!engine.extended_ds, "Should disable extended driveshafts");
        assert!(!engine.is_push_pull, "Should disable push-pull");
    }

    #[test]
    fn test_set_outboard_prop() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Try to enable without extended driveshaft
        engine.set_outboard_prop(true);
        assert!(!engine.outboard_prop, "Should not enable without extended driveshaft");

        // Enable with extended driveshaft
        engine.extended_ds = true;
        engine.set_outboard_prop(true);
        assert!(engine.outboard_prop, "Should enable with extended driveshaft");

        // Disable extended driveshaft
        engine.set_outboard_prop(true);
        engine.extended_ds = false;
        engine.set_outboard_prop(true);
        assert!(!engine.outboard_prop, "Should disable when extended driveshaft disabled");
    }
}
