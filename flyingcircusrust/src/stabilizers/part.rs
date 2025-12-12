use super::Stabilizers;
use crate::{
    part::{ElectricsMessage, Part},
    stats::Stats,
};

impl Part for Stabilizers {
    /// Calculates the stats contribution from stabilizers
    /// This is called by the Part trait implementation
    fn part_stats(&mut self) -> Stats {
        // Validate configuration before calculating
        self.verify();

        let mut stats = Stats::new();

        // HSTAB (Horizontal Stabilizer)
        if self.hstab_count > 0 && (self.hstab_sel as usize) < self.hstab_list.len() {
            let hstab = &self.hstab_list[self.hstab_sel];
            stats = stats.add(&hstab.stats);

            let drag = if self.is_heli {
                let calculated_drag =
                    (self.wing_drag / 8.0 * hstab.dragfactor + 1.0e-6).floor() as i16;
                let min_drag = (1.0 * hstab.dragfactor).ceil() as i16;
                calculated_drag.max(min_drag)
            } else {
                let calculated_drag =
                    (self.wing_drag / 4.0 * hstab.dragfactor + 1.0e-6).floor() as i16;
                calculated_drag.max(1)
            };
            stats.drag += drag as f32;
        } else if self.hstab_sel < self.hstab_list.len() {
            let hstab = &self.hstab_list[self.hstab_sel];
            if hstab.increment != 0 {
                stats.pitchstab -= (self.lifting_area / 2.0 + 1.0e-6).floor();
                stats.liftbleed += 5.0;
            }
        }

        // VSTAB (Vertical Stabilizer)
        if self.vstab_count > 0 && (self.vstab_sel as usize) < self.vstab_list.len() {
            let vstab = &self.vstab_list[self.vstab_sel];
            stats = stats.add(&vstab.stats);

            let drag = if self.is_heli {
                let calculated_drag =
                    (self.wing_drag / 16.0 * vstab.dragfactor + 1.0e-6).floor() as i16;
                let min_drag = if self.hstab_sel < self.hstab_list.len() {
                    (1.0 * self.hstab_list[self.hstab_sel].dragfactor).ceil() as i16
                } else {
                    1
                };
                calculated_drag.max(min_drag)
            } else {
                let calculated_drag =
                    (self.wing_drag / 8.0 * vstab.dragfactor + 1.0e-6).floor() as i16;
                calculated_drag.max(1)
            };
            stats.drag += drag as f32;
        } else if self.vstab_sel < self.vstab_list.len() {
            let vstab = &self.vstab_list[self.vstab_sel];
            if vstab.increment != 0 || (vstab.increment == 0 && self.hstab_count == 0) {
                stats.latstab -= self.lifting_area.floor();
            }
        }

        // Additional stabilizers (beyond the first one)
        stats.drag += (2 * ((self.hstab_count - 1).max(0) + (self.vstab_count - 1).max(0))) as f32;

        // Pairs of stabilizers (control bonus)
        if self.vstab_list[self.vstab_sel].increment != 0 {
            let mut leftovers = (self.hstab_count - 1).max(0);
            let es_pairs = (self.engine_count - 1).min(self.vstab_count - 1);
            leftovers += (self.vstab_count - 1 - es_pairs).max(0);
            stats.control += (3 * es_pairs + leftovers) as f32;
        } else {
            let es_pairs = (self.engine_count - 1).min(self.hstab_count - 1).max(0);
            let leftovers = (self.hstab_count - 1 - es_pairs).max(0);
            stats.control += (3 * es_pairs + leftovers) as f32;
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}
