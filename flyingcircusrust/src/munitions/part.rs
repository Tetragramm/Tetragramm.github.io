use super::*;
use crate::part::{ElectricsMessage, Part};

impl Part for Munitions {
    /// Calculate stats contribution from munitions
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        let ext_bomb_count = self.get_external_mass();

        // Internal bays require fuselage sections
        stats.reqsections += self.internal_bay_count as f32;

        // Bay upgrades require additional sections
        if self.internal_bay_count > 0 {
            let count = stats.reqsections;
            if self.internal_bay_1 {
                stats.reqsections += count;
                if self.internal_bay_2 {
                    stats.reqsections += count;
                }
            }
        }

        // External munitions require racks
        // 1 mass/drag per 5 external munitions (rounded up)
        let rack_mass = ((ext_bomb_count as f32 / 5.0).ceil()) as f32;
        stats.mass += rack_mass;
        stats.drag += rack_mass;

        // Total bomb mass (bombs + rockets)
        stats.bomb_mass = (self.bomb_count + self.rocket_count) as f32;

        // Round up required sections
        stats.reqsections = stats.reqsections.ceil();

        // Because it is load, bomb_mass rounds up to the nearest 5
        let remainder = stats.bomb_mass % 5.0;
        if remainder > 0.0 {
            stats.bomb_mass += 5.0 - remainder;
        }

        stats
    }

    /// Get electrics contribution (none for munitions)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
