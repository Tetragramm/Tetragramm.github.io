use super::*;
use crate::localization::localization_lookup as lu;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Era, Warning, WarningLevel};

impl Part for ControlSurfaces {
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Validate aileron selection (auto-fix invalid state)
        let ail_idx = self.aileron_sel as usize;
        if ail_idx < self.aileron_list.len() {
            if self.aileron_list[ail_idx].warping && self.wing_area == 0 {
                self.aileron_sel = 0;
            }
        } else {
            self.aileron_sel = 0;
        }

        // Add aileron stats
        let ail_idx = self.aileron_sel as usize;
        if ail_idx < self.aileron_list.len() {
            stats = stats.add(&self.aileron_list[ail_idx].stats);

            // Handle wing warping special effects
            if self.aileron_list[ail_idx].warping {
                // Warping reduces maxstrain by span
                stats.maxstrain -= self.span as f64;

                // Cantilever wing warping
                if self.num_cantilever > 0 {
                    stats.cost += 2.0 * self.num_cantilever as f64;
                    stats.eras.push(Era {
                        name: lu("Cantilever Wing Warping"),
                        era: crate::stats::ERA::LastHurrah,
                    });
                }

                // Boom tail with warping has stability issues
                if self.is_boom {
                    stats.pitchstab -= 2.0;
                    stats.latstab -= 2.0;
                    stats.warnings.push(Warning {
                        name: lu("Wing Warping"),
                        warning: lu("Wing Warping Warning"),
                        level: WarningLevel::White,
                    });
                }
            }
        }

        // Add rudder stats
        let rud_idx = self.rudder_sel as usize;
        if rud_idx < self.rudder_list.len() {
            stats = stats.add(&self.rudder_list[rud_idx].stats);
        }

        // Add elevator stats
        let elev_idx = self.elevator_sel as usize;
        if elev_idx < self.elevator_list.len() {
            stats = stats.add(&self.elevator_list[elev_idx].stats);
        }

        // Add flaps stats
        let flaps_idx = self.flaps_sel as usize;
        if flaps_idx < self.flaps_list.len() {
            stats = stats.add(&self.flaps_list[flaps_idx].stats);
        }

        // Add slats stats
        let slats_idx = self.slats_sel as usize;
        if slats_idx < self.slats_list.len() {
            stats = stats.add(&self.slats_list[slats_idx].stats);
        }

        // Add selected drag inducers
        for i in 0..self.drag_list.len() {
            if i < self.drag_sel.len() && self.drag_sel[i] {
                stats = stats.add(&self.drag_list[i].stats);
            }
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        // Control surfaces don't use electrical systems
        ElectricsMessage::new()
    }
}
