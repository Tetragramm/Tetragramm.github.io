use std::rc::Rc;

use serde::Serialize;
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

#[derive(Clone, Serialize, PartialEq, Debug)]
pub enum EngineRarity {
    CUSTOM,
    COMMON,
    RARE,
    LEGENDARY,
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

    #[ui(number, name = "cooling_count", set_fn = "set_cooling")]
    cooling_count: i16,

    #[ui(
        number,
        name = "radiator_index",
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
        enabled_fn = "is_torque_to_struct_enabled",
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
