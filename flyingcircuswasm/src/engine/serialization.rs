use super::{Engine, EngineInputs, EngineRarity, EngineStats, TypedInputs};
use crate::serialization::{Error, Serializable};

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

impl Engine {
    fn old_deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<EngineInputs, Error> {
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

                let (compressor_type, compressor_count, min_ideal_alt, final_upgrades) =
                    if upgrades.len() == 6 {
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
