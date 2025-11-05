use super::*;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Warning, WarningLevel};

impl Part for Accessories {
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Process armour
        let eff_armour = self.effective_coverage();
        let mut armour_str = String::new();

        for i in 0..self.armour_coverage.len() {
            let ap = (i + 1) as f32;
            let count = self.armour_coverage[i] as f32;

            stats.mass += count * (2.0_f32).powf(ap - 1.0);
            stats.cost += ((count * ap / 3.0) + 1.0e-6).floor();
            stats.toughness += self.armour_coverage[i] as f32 * ap;

            if eff_armour[i] > 0 {
                if !armour_str.is_empty() {
                    armour_str.push_str(", ");
                }
                armour_str.push_str(&format!("{}/{}", ap as i16, 11 - eff_armour[i]));
                armour_str.push('+');
            }
        }

        if !armour_str.is_empty() {
            stats.warnings.push(Warning {
                name: t!("Armour").to_string(),
                warning: armour_str,
                level: WarningLevel::White,
            });
        }

        // Process electrical equipment
        for i in 0..self.electrical_count.len() {
            if self.electrical_count[i] > 0 && i < self.electrical_list.len() {
                let eq_stats = self.electrical_list[i]
                    .stats
                    .multiply(self.electrical_count[i] as f32);
                stats = stats.add(&eq_stats);
            }
        }

        // Add radio stats
        let radio_idx = self.radio_sel as usize;
        if radio_idx < self.radio_list.len() {
            stats = stats.add(&self.radio_list[radio_idx].stats);
        }

        // Process reconnaissance equipment
        for i in 0..self.recon_sel.len() {
            if self.recon_sel[i] > 0 && i < self.recon_list.len() {
                let recon_stats = self.recon_list[i].stats.multiply(self.recon_sel[i] as f32);
                stats = stats.add(&recon_stats);
            }
        }

        // Process visibility equipment
        for i in 0..self.visi_sel.len() {
            if self.visi_sel[i] && i < self.visi_list.len() {
                stats = stats.add(&self.visi_list[i].stats);
            }
        }

        // Process climate control
        for i in 0..self.clim_sel.len() {
            if self.clim_sel[i]
                && i < self.climate_list.len()
                && (!self.climate_list[i].req_radiator || self.has_radiator)
            {
                stats = stats.add(&self.climate_list[i].stats);
            }
        }

        // Add autopilot stats
        let auto_idx = self.auto_sel as usize;
        if auto_idx < self.autopilot_list.len() {
            stats = stats.add(&self.autopilot_list[auto_idx].stats);
        }

        // Add control system stats
        let cont_idx = self.cont_sel as usize;
        if cont_idx < self.control_list.len() {
            stats = stats.add(&self.control_list[cont_idx].stats);
        }

        stats.round();

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        let mut battery_storage: i32 = 0;
        let mut equipment = Vec::new();

        // Process electrical equipment
        for i in 0..self.electrical_count.len() {
            if self.electrical_count[i] > 0 && i < self.electrical_list.len() {
                let item = &self.electrical_list[i];
                let count = self.electrical_count[i];
                battery_storage += (count * item.storage) as i32;

                if item.cp10s > 0.0 {
                    equipment.push(crate::part::Equipment {
                        source: t!(&item.name).to_string(),
                        charge: format!("{:.0}", (count as f32 * item.cp10s).floor()),
                    });
                } else if item.stats.charge != 0.0 {
                    equipment.push(crate::part::Equipment {
                        source: t!(&item.name).to_string(),
                        charge: (count as f32 * item.stats.charge).to_string(),
                    });
                }
            }
        }

        // Process radio
        let radio_idx = self.radio_sel as usize;
        if radio_idx < self.radio_list.len() && self.radio_list[radio_idx].stats.charge != 0.0 {
            equipment.push(crate::part::Equipment {
                source: t!(&self.radio_list[radio_idx].name).to_string(),
                charge: self.radio_list[radio_idx].stats.charge.to_string(),
            });
        }

        // Process climate
        for i in 0..self.clim_sel.len() {
            if self.clim_sel[i]
                && i < self.climate_list.len()
                && self.climate_list[i].stats.charge != 0.0
            {
                equipment.push(crate::part::Equipment {
                    source: t!(&self.climate_list[i].name).to_string(),
                    charge: self.climate_list[i].stats.charge.to_string(),
                });
            }
        }

        // Process reconnaissance
        for i in 0..self.recon_sel.len() {
            if self.recon_sel[i] > 0 && i < self.recon_list.len() {
                let charge = self.recon_sel[i] as f32 * self.recon_list[i].stats.charge;
                if charge != 0.0 {
                    equipment.push(crate::part::Equipment {
                        source: t!(&self.recon_list[i].name).to_string(),
                        charge: charge.to_string(),
                    });
                }
            }
        }

        // Process visibility
        for i in 0..self.visi_sel.len() {
            if self.visi_sel[i] && i < self.visi_list.len() && self.visi_list[i].stats.charge != 0.0
            {
                equipment.push(crate::part::Equipment {
                    source: t!(&self.visi_list[i].name).to_string(),
                    charge: self.visi_list[i].stats.charge.to_string(),
                });
            }
        }

        // Process autopilot
        let auto_idx = self.auto_sel as usize;
        if auto_idx < self.autopilot_list.len() && self.autopilot_list[auto_idx].stats.charge != 0.0
        {
            equipment.push(crate::part::Equipment {
                source: t!(&self.autopilot_list[auto_idx].name).to_string(),
                charge: self.autopilot_list[auto_idx].stats.charge.to_string(),
            });
        }

        // Process control system
        let cont_idx = self.cont_sel as usize;
        if cont_idx < self.control_list.len() && self.control_list[cont_idx].stats.charge != 0.0 {
            equipment.push(crate::part::Equipment {
                source: t!(&self.control_list[cont_idx].name).to_string(),
                charge: self.control_list[cont_idx].stats.charge.to_string(),
            });
        }

        ElectricsMessage {
            storage: battery_storage,
            equipment,
        }
    }
}
