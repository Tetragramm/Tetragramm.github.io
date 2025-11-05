use super::Radiator;
use crate::part::{ElectricsMessage, Part};
use crate::stats::Stats;

impl Part for Radiator {
    fn part_stats(&mut self) -> Stats {
        self.verify_harden();

        let mut stats = Stats::new();
        stats.mass = 3.0;
        stats = stats.add(&self.type_list[self.idx_type].stats);
        stats = stats.add(&self.mount_list[self.idx_mount].stats);
        stats = stats.add(&self.coolant_list[self.idx_coolant].stats);

        stats.drag += (-1.0e-6
            + self.type_list[self.idx_type].dragpercool * (self.need_cool - stats.cooling))
            .ceil() as f32;

        if self.harden_cool {
            stats.cost += 2.0;
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}
