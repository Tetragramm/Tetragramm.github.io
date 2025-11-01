use super::{Engine, EngineInputs, EngineRarity, EngineStats, TypedInputs};
use crate::json::{jsbool, jsnum, jsobj, jsstr};
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for EngineStats {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.name = jsstr(js, "name");
        self.overspeed = jsnum(js, "overspeed") as i16;
        self.altitude = jsnum(js, "altitude") as i16;
        self.torque = jsnum(js, "torque") as i16;
        self.rumble = jsnum(js, "rumble") as i16;
        self.oiltank = jsbool(js, "oiltank");
        self.pulsejet = jsbool(js, "pulsejet");
        self.stats.from_json(js, json_version);
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
                map.insert(
                    "material_fudge".to_string(),
                    (*material_fudge as f64).into(),
                );
                map.insert("quality_fudge".to_string(), (*quality_fudge as f64).into());
                map.insert("compressor_type".to_string(), (*compressor_type).into());
                map.insert("compressor_count".to_string(), (*compressor_count).into());
                map.insert("min_IAF".to_string(), (*min_ideal_alt).into());
                let upgrades_arr: Vec<serde_json::Value> =
                    upgrades.iter().map(|&b| b.into()).collect();
                map.insert(
                    "upgrades".to_string(),
                    serde_json::Value::Array(upgrades_arr),
                );
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
                map.insert(
                    "quality_rely".to_string(),
                    (*quality_reliability as f64).into(),
                );
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
                map.insert(
                    "flow_adjustment".to_string(),
                    (*flow_adjustment as f64).into(),
                );
                map.insert("diameter".to_string(), (*diameter as f64).into());
                map.insert(
                    "compression_ratio".to_string(),
                    (*compression_ratio as f64).into(),
                );
                map.insert("bypass_ratio".to_string(), (*bypass_ratio as f64).into());
                let upgrades_arr: Vec<serde_json::Value> =
                    upgrades.iter().map(|&b| b.into()).collect();
                map.insert(
                    "upgrades".to_string(),
                    serde_json::Value::Array(upgrades_arr),
                );
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

impl JSSerializable for Engine {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.etype_stats
            .from_json(jsobj(js, "selected_stats"), json_version);
        self.etype_inputs
            .from_json(jsobj(js, "selected_inputs"), json_version);

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
        map.insert(
            "pp_torque_to_struct".to_string(),
            self.torque_to_struct.into(),
        );
        map.insert("use_driveshafts".to_string(), self.extended_ds.into());
        map.insert("geared_propeller_ratio".to_string(), self.gear_count.into());
        map.insert(
            "geared_propeller_reliability".to_string(),
            self.geared_reliability.into(),
        );
        map.insert("cowl_sel".to_string(), self.cowl_sel.into());
        map.insert("is_generator".to_string(), self.is_generator.into());
        map.insert("has_alternator".to_string(), self.has_alternator.into());
        map.insert("intake_fan".to_string(), self.intake_fan.into());
        map.insert("outboard_prop".to_string(), self.outboard_prop.into());

        serde_json::Value::Object(map)
    }
}
