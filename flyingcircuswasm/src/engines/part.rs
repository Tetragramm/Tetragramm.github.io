use super::Engines;
use crate::lu;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Era, Stats, Warning, WarningLevel, ERA};
use std::collections::HashMap;

impl Part for Engines {
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Track cooling needs for each radiator
        let mut need_cool: Vec<(f64, usize)> = vec![(0.0, 0); self.radiators.len()];
        let mut ecost = 0.0;
        let mut pitchspeedmin: f64 = 100.0;

        // Track first pulsejet
        let mut first_pulsejet = false;
        let mut final_visibility_mod: f64 = 2.0;

        // Process each engine
        for engine in &mut self.engines {
            // Set first pulsejet flag
            if !first_pulsejet && engine.get_is_pulsejet() {
                first_pulsejet = true;
                engine.set_first_pulsejet(true);
            } else {
                engine.set_first_pulsejet(false);
            }

            let enstats = engine.part_stats();
            final_visibility_mod = final_visibility_mod.min(enstats.visibility);
            stats = stats.add(&enstats);

            // Track cooling needs
            if engine.need_cooling() {
                let rad_idx = engine.radiator_index as usize;
                if rad_idx < need_cool.len() {
                    need_cool[rad_idx].0 += engine.etype_stats.stats.cooling;
                    need_cool[rad_idx].1 += 1;
                }
            }

            ecost += engine.etype_stats.stats.cost;

            if enstats.pitchspeed > 0.0 {
                pitchspeedmin = pitchspeedmin.min(enstats.pitchspeed);
            }
        }

        stats.visibility = final_visibility_mod;

        if pitchspeedmin < 100.0 {
            stats.pitchspeed = pitchspeedmin;
        }

        // Upkeep calc only uses engine costs
        stats.upkeep = (1.0e-6 + stats.upkeep.min(ecost)).floor();

        // Include radiators
        let mut radstats = Stats::new();
        let mut warningmap: HashMap<String, Vec<usize>> = HashMap::new();

        for i in 0..self.radiators.len() {
            let rad = &mut self.radiators[i];
            rad.set_need_cool(need_cool[i].0, need_cool[i].1);

            let rstats = rad.part_stats();
            radstats = radstats.add(&rstats);

            // Merge warnings for different radiators
            for w in &rstats.warnings {
                warningmap
                    .entry(w.name.clone())
                    .or_insert_with(Vec::new)
                    .push(i + 1);
            }
        }

        // Update radiator warning sources with radiator numbers
        for w in &mut radstats.warnings {
            if let Some(rad_nums) = warningmap.get(&w.name) {
                let rad_str = rad_nums
                    .iter()
                    .map(|n| n.to_string())
                    .collect::<Vec<_>>()
                    .join(",");
                w.name = format!("{} {}", lu!("Radiators #", rad_str), w.name);
            }
        }

        stats = stats.add(&radstats);

        // Asymmetric planes
        if self.is_asymmetric {
            stats.latstab -= 3.0;
        }

        // Add warnings for special engine types
        if self.has_pulsejet() {
            stats.warnings.push(Warning {
                name: lu!("Pulsejets"),
                warning: lu!("Pulsejet Boost Warning"),
                level: WarningLevel::White,
            });
        }

        if self.has_turbine_no_prop() {
            stats.warnings.push(Warning {
                name: lu!("Turbine"),
                warning: lu!("Turbine Boost Warning"),
                level: WarningLevel::White,
            });
        }

        if self.has_diesel() {
            stats.warnings.push(Warning {
                name: lu!("Diesel"),
                warning: lu!("Diesel Warning"),
                level: WarningLevel::White,
            });
        }

        // Calculate rotary torque direction
        let mut rotation_t = 0;
        for e in &self.engines {
            if e.is_rotary() {
                if e.is_push_pull && e.torque_to_struct {
                    // No change to rotation_t
                } else if e.is_push_pull && e.is_tractor() {
                    rotation_t += 2;
                } else if e.is_tractor() {
                    rotation_t += 1;
                } else if e.is_pusher() {
                    rotation_t -= 1;
                }
            }
        }

        if rotation_t > 0 {
            stats.warnings.push(Warning {
                name: lu!("Rotary"),
                warning: lu!("Rotary Right Warning"),
                level: WarningLevel::White,
            });
        } else if rotation_t < 0 {
            stats.warnings.push(Warning {
                name: lu!("Rotary"),
                warning: lu!("Rotary Left Warning"),
                level: WarningLevel::White,
            });
        }

        // Part local, gets handled in UpdateReliability
        stats.reliability = 0.0;

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
