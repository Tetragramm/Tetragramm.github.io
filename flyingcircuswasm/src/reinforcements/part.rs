use super::*;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Warning, WarningLevel};

impl Part for Reinforcements {
    fn part_stats(&mut self) -> Stats {
        // Apply resolution for aircraft type and configuration first
        self.resolve_for_aircraft_type();

        let mut stats = Stats::new();

        // Handle aircraft type restrictions
        match self.acft_type {
            AircraftType::Helicopter
            | AircraftType::OrnithopterBuzzer
            | AircraftType::OrnithopterFlutter => {
                self.cabane_sel = 0;
            }
            _ => {}
        }

        // Calculate tension multiplier based on wing configuration
        let mut tension_multiple = 1.0;
        if self.is_monoplane {
            tension_multiple = 0.6;
        } else if self.is_tandem {
            tension_multiple = 0.8;
        } else if self.is_staggered {
            tension_multiple = 0.9;
        }

        // Adjust for sesquiplane configuration
        if self.tension_sqp {
            tension_multiple -= 0.15;
        }

        // Ornithopter has special tension multiple
        if self.acft_type == AircraftType::OrnithopterBasic {
            tension_multiple = 0.5;
        }

        // Clear external reinforcements if not allowed
        if !self.can_external {
            for count in &mut self.ext_wood_count {
                *count = 0;
            }
            for count in &mut self.ext_steel_count {
                *count = 0;
            }
            self.cabane_sel = 0;
            self.wires = false;
        }

        let mut tension: f64 = 0.0;
        let mut strut_count = 0;
        let mut has_valid_first = false;

        // Process external wood struts
        for i in 0..self.ext_wood_count.len() {
            strut_count += self.ext_wood_count[i];
            if self.ext_wood_count[i] > 0 {
                has_valid_first = has_valid_first || self.ext_wood_list[i].first;
                stats = stats.add(
                    &self.ext_wood_list[i]
                        .stats
                        .multiply(self.ext_wood_count[i] as f64),
                );

                // Apply tension multiple for config struts
                let t = if self.ext_wood_list[i].config {
                    tension_multiple * self.ext_wood_list[i].tension as f64
                } else {
                    self.ext_wood_list[i].tension as f64
                };
                tension += t * self.ext_wood_count[i] as f64;
            }
        }

        // Process external steel struts
        for i in 0..self.ext_steel_count.len() {
            strut_count += self.ext_steel_count[i];
            if self.ext_steel_count[i] > 0 {
                has_valid_first = has_valid_first || self.ext_steel_list[i].first;
                stats = stats.add(
                    &self.ext_steel_list[i]
                        .stats
                        .multiply(self.ext_steel_count[i] as f64),
                );

                // Apply tension multiple for config struts
                let t = if self.ext_steel_list[i].config {
                    tension_multiple * self.ext_steel_list[i].tension as f64
                } else {
                    self.ext_steel_list[i].tension as f64
                };
                tension += t * self.ext_steel_count[i] as f64;
            }
        }

        // Reduce strain for ornithopters
        if self.acft_type == AircraftType::OrnithopterBasic {
            stats.maxstrain *= 0.5;
        }

        // First strut bonus
        if has_valid_first {
            stats.structure += 5.0;
            stats.maxstrain += 10.0;
            tension += 10.0;
        }

        // Cabane strut contribution
        let cabane_idx = self.cabane_sel as usize;
        if cabane_idx < self.cabane_list.len() {
            stats = stats.add(&self.cabane_list[cabane_idx].stats);
            tension += tension_multiple * self.cabane_list[cabane_idx].tension as f64;

            if self.cabane_sel > 0 {
                strut_count += 1;
            }
        }

        // Wires add strain and drag
        if self.wires {
            stats.maxstrain += tension;
            stats.drag += 3.0 * strut_count as f64;
        }

        // Process cantilever struts
        let mut use_cant = false;
        for i in 0..self.cant_list.len() {
            if self.cant_count[i] > 0 {
                use_cant = true;
                stats = stats.add(&self.cant_list[i].stats.multiply(self.cant_count[i] as f64));
            }
        }

        // Wing blades configuration
        if !self.can_use_wing_blades() {
            self.wing_blades = false;
        } else if self.wing_blades {
            stats.mass *= 2.0;
            stats.warnings.push(Warning {
                name: t!("Wing Blades").to_string(),
                warning: t!("Wing Blades Warning").to_string(),
                level: WarningLevel::White,
            });
        }

        // Cantilever effects on aircraft
        if use_cant {
            stats.cost += 5.0;
            stats.liftbleed -= self.cant_lift as f64;
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        // Reinforcements don't contribute to electrics
        ElectricsMessage::new()
    }
}
