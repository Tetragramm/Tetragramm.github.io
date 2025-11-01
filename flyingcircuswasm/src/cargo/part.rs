use super::*;
use crate::part::{ElectricsMessage, Part};

impl Part for Cargo {
    /// Calculate stats contribution from cargo/passenger space
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        // Get stats from selected cargo space
        let mut stats = self.cargo_list[self.space_sel].stats.clone();

        // Add 3 mass per required section
        stats.bomb_mass += stats.reqsections * 3.0;

        // Round bomb_mass up to nearest 5 (because it is load)
        let remainder = stats.bomb_mass % 5.0;
        if remainder > 0.0 {
            stats.bomb_mass += 5.0 - remainder;
        }

        stats
    }

    /// Get electrics contribution (none for cargo)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
