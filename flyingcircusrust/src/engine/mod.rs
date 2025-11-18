use serde::{Deserialize, Deserializer, Serialize};
use std::iter::zip;
use std::rc::Rc;
use ui_core::*;
use ui_macro::*;

use crate::{
    engines::{CowlEntry, MountEntry},
    stats::Stats,
};

mod json;
mod part;
mod serialization;

mod core;
mod mounted;
mod queries;
mod setters;
mod validation;

#[cfg(test)]
mod tests;

// Custom deserializer for EngineRarity to handle both old numeric format and new string format
fn deserialize_engine_rarity(value: serde_json::Value) -> Result<EngineRarity, String> {
    match value {
        // Handle numeric format (old TypeScript format)
        serde_json::Value::Number(n) => {
            if let Some(i) = n.as_i64() {
                match i {
                    0 => Ok(EngineRarity::CUSTOM),
                    1 => Ok(EngineRarity::COMMON),
                    2 => Ok(EngineRarity::RARE),
                    3 => Ok(EngineRarity::LEGENDARY),
                    _ => Err(format!("invalid rarity number: {}", i)),
                }
            } else if let Some(f) = n.as_f64() {
                // Handle floating point numbers (convert to int)
                match f as i64 {
                    0 => Ok(EngineRarity::CUSTOM),
                    1 => Ok(EngineRarity::COMMON),
                    2 => Ok(EngineRarity::RARE),
                    3 => Ok(EngineRarity::LEGENDARY),
                    _ => Err(format!("invalid rarity number: {}", f)),
                }
            } else {
                Err("invalid rarity number".to_string())
            }
        }
        // Handle string format (new Rust format)
        serde_json::Value::String(s) => match s.as_str() {
            "CUSTOM" => Ok(EngineRarity::CUSTOM),
            "COMMON" => Ok(EngineRarity::COMMON),
            "RARE" => Ok(EngineRarity::RARE),
            "LEGENDARY" => Ok(EngineRarity::LEGENDARY),
            _ => Err(format!("invalid rarity string: {}", s)),
        },
        _ => Err("expected number or string for rarity".to_string()),
    }
}

#[derive(Clone, Serialize, PartialEq, Debug)]
pub enum EngineRarity {
    CUSTOM,
    COMMON,
    RARE,
    LEGENDARY,
}

impl<'de> Deserialize<'de> for EngineRarity {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        use serde::de::Error;
        let value = serde_json::Value::deserialize(deserializer)?;
        match deserialize_engine_rarity(value) {
            Ok(v) => Ok(v),
            Err(msg) => Err(D::Error::custom(msg)),
        }
    }
}

#[derive(Clone, Serialize, PartialEq, Debug)]
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
    pub es1: f32,
    pub es2: f32,
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
            es1: 0.0,
            es2: 0.0,
        }
    }
}

#[derive(Clone, Serialize, Deserialize)]
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

#[derive(Clone, Serialize)]
pub struct EngineInputs {
    pub name: String,
    pub etype: i16,
    pub era_sel: i16,
    pub rarity: EngineRarity,
    pub inputs: TypedInputs,
}

// Custom deserializer for EngineInputs to handle both old TypeScript format (flat)
// and new Rust format (nested)
impl<'de> Deserialize<'de> for EngineInputs {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        use serde::de::Error;
        use serde_json::Value;

        let value = Value::deserialize(deserializer)?;

        // Try to extract common fields
        let name = value
            .get("name")
            .and_then(|v| v.as_str())
            .ok_or_else(|| D::Error::missing_field("name"))?
            .to_string();

        let era_sel = value
            .get("era_sel")
            .and_then(|v| v.as_i64())
            .ok_or_else(|| D::Error::missing_field("era_sel"))? as i16;

        let rarity = if let Some(r) = value.get("rarity") {
            deserialize_engine_rarity(r.clone()).map_err(|_| D::Error::custom("invalid rarity"))?
        } else {
            EngineRarity::CUSTOM
        };

        // Check if this is new format (has "etype" and "inputs") or old format (has "engine_type" and flat fields)
        let (etype, inputs) = if let Some(etype_val) = value.get("etype") {
            // New format
            let etype = etype_val
                .as_i64()
                .ok_or_else(|| D::Error::custom("etype must be a number"))?
                as i16;

            let inputs = value
                .get("inputs")
                .ok_or_else(|| D::Error::missing_field("inputs"))?
                .clone();

            let typed_inputs: TypedInputs = serde_json::from_value(inputs)
                .map_err(|e| D::Error::custom(format!("failed to deserialize inputs: {}", e)))?;

            (etype, typed_inputs)
        } else {
            // Old flat format
            let etype = value
                .get("engine_type")
                .or_else(|| value.get("type"))
                .and_then(|v| v.as_i64())
                .ok_or_else(|| D::Error::missing_field("engine_type"))?
                as i16;

            // Based on etype, construct the appropriate TypedInputs variant
            let typed_inputs = match etype {
                0 => {
                    // Propeller
                    TypedInputs::Propeller {
                        displacement: value
                            .get("displacement")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(0.0) as f32,
                        compression: value
                            .get("compression")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(5.0) as f32,
                        cyl_per_row: value
                            .get("cyl_per_row")
                            .and_then(|v| v.as_i64())
                            .unwrap_or(1) as i16,
                        rows: value.get("rows").and_then(|v| v.as_i64()).unwrap_or(1) as i16,
                        rpm_boost: value
                            .get("RPM_boost")
                            .or_else(|| value.get("rpm_boost"))
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        material_fudge: value
                            .get("material_fudge")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        quality_fudge: value
                            .get("quality_fudge")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        compressor_type: value
                            .get("compressor_type")
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0) as i16,
                        compressor_count: value
                            .get("compressor_count")
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0) as i16,
                        min_ideal_alt: value
                            .get("min_IAF")
                            .or_else(|| value.get("min_ideal_alt"))
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0) as i16,
                        upgrades: value
                            .get("upgrades")
                            .and_then(|v| serde_json::from_value(v.clone()).ok())
                            .unwrap_or_else(|| vec![false; 4]),
                    }
                }
                1 => {
                    // Pulsejet
                    TypedInputs::Pulsejet {
                        power: value.get("power").and_then(|v| v.as_i64()).unwrap_or(0) as i16,
                        quality_cost: value
                            .get("quality_cost")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        quality_reliability: value
                            .get("quality_reliability")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        starter: value
                            .get("starter")
                            .and_then(|v| v.as_bool())
                            .unwrap_or(false),
                    }
                }
                2 => {
                    // Turbine
                    TypedInputs::Turbine {
                        flow_adjustment: value
                            .get("flow_adjustment")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        diameter: value
                            .get("diameter")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        compression_ratio: value
                            .get("compression_ratio")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                        bypass_ratio: value
                            .get("bypass_ratio")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(0.0) as f32,
                        upgrades: value
                            .get("upgrades")
                            .and_then(|v| serde_json::from_value(v.clone()).ok())
                            .unwrap_or_else(|| vec![false; 4]),
                    }
                }
                3 => {
                    // Electric
                    TypedInputs::Electric {
                        power: value.get("power").and_then(|v| v.as_i64()).unwrap_or(0) as i16,
                        winding_sel: value
                            .get("winding_sel")
                            .and_then(|v| v.as_i64())
                            .unwrap_or(0) as i16,
                        chonk: value.get("chonk").and_then(|v| v.as_i64()).unwrap_or(0) as i16,
                        quality_fudge: value
                            .get("quality_fudge")
                            .and_then(|v| v.as_f64())
                            .unwrap_or(1.0) as f32,
                    }
                }
                _ => {
                    return Err(D::Error::custom(format!("invalid engine type: {}", etype)));
                }
            };

            (etype, typed_inputs)
        };

        Ok(EngineInputs {
            name,
            etype,
            era_sel,
            rarity,
            inputs,
        })
    }
}

impl PartialEq for EngineInputs {
    fn eq(&self, other: &Self) -> bool {
        self.name == other.name && self.etype == other.etype && self.era_sel == other.era_sel
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

#[derive(UIBindings, Clone)]
pub struct Engine {
    elist_key: String,
    pub etype_stats: EngineStats,
    etype_inputs: EngineInputs,

    #[ui(number, name = "Engine Cooling Amount", set_fn = "set_cooling")]
    cooling_count: i16,

    #[ui(
        number,
        name = "Engine Select Radiator",
        enabled_fn = "is_radiator_enabled",
        set_fn = "set_radiator"
    )]
    pub radiator_index: i16,

    num_radiators: i16,

    mount_list: Rc<Vec<MountEntry>>,

    #[ui(
        select,
        source = "mount_list",
        enabled_fn = "is_mount_select_enabled",
        enabled_opt_fn = "is_mount_opt_enabled",
        set_fn = "set_mount_index"
    )]
    mount_sel: usize,

    #[ui(
        check,
        name = "Engine Push Pull",
        enabled_fn = "is_pushpull_enabled",
        set_fn = "set_use_push_pull"
    )]
    pub is_push_pull: bool,

    #[ui(
        check,
        name = "Engine Torque To Structure",
        enabled_fn = "can_torque_to_struct",
        set_fn = "set_torque_to_struct"
    )]
    pub torque_to_struct: bool,

    #[ui(
        check,
        name = "Engine Air Cooling Fan",
        enabled_fn = "is_intake_fan_enabled",
        set_fn = "set_intake_fan"
    )]
    intake_fan: bool,

    #[ui(
        check,
        name = "Engine Extended Driveshafts",
        enabled_fn = "is_extended_ds_enabled",
        set_fn = "set_use_extended_driveshaft"
    )]
    extended_ds: bool,

    #[ui(
        check,
        name = "Engine Outboard Propeller",
        enabled_fn = "is_outboard_prop_enabled",
        set_fn = "set_outboard_prop"
    )]
    outboard_prop: bool,

    #[ui(
        number,
        name = "Engine Geared Propeller",
        enabled_fn = "is_gears_enabled",
        set_fn = "set_gear_count"
    )]
    gear_count: i16,

    #[ui(
        number,
        name = "Engine Negate Reliability Penalty",
        enabled_fn = "is_gears_enabled",
        set_fn = "set_gear_reliability"
    )]
    geared_reliability: i16,

    cowl_list: Rc<Vec<CowlEntry>>,

    #[ui(
        select,
        source = "cowl_list",
        enabled_fn = "is_cowl_enabled",
        enabled_opt_fn = "is_cowl_opt_enabled",
        set_fn = "set_cowl"
    )]
    cowl_sel: usize,

    #[ui(
        check,
        name = "Engine Generator",
        enabled_fn = "is_generator_enabled",
        set_fn = "set_generator"
    )]
    is_generator: bool,

    #[ui(
        check,
        name = "Engine Alternator",
        enabled_fn = "is_alternator_enabled",
        set_fn = "set_alternator"
    )]
    has_alternator: bool,

    is_internal: bool,

    total_reliability: i16,
    is_first_pulsejet: bool,
}
