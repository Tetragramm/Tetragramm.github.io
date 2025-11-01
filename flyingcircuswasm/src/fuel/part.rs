use super::*;
use crate::localization::localization_lookup as lu;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Era, Warning, WarningLevel, ERA};

impl Part for Fuel {
    /// Calculate stats contribution from fuel system
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();
        let mut internal_count = 0;

        // Sum stats from all tanks
        for i in 0..self.tank_count.len() {
            let count = self.tank_count[i];
            if count > 0 {
                let mut tank_stats = self.tank_list[i].stats.clone();
                // Multiply stats by count
                tank_stats.mass *= count as f64;
                tank_stats.cost *= count as f64;
                tank_stats.drag *= count as f64;
                tank_stats.wetmass *= count as f64;
                tank_stats.reqsections *= count as f64;

                stats = stats.add(&tank_stats);

                if self.tank_list[i].internal {
                    internal_count += count;
                }
            }
        }

        // Round up required sections
        stats.reqsections = stats.reqsections.ceil();

        // Self-sealing adds mass and cost per internal tank
        if self.self_sealing {
            stats.mass += internal_count as f64;
            stats.cost += 2.0 * internal_count as f64;
            stats.eras.push(Era {
                name: lu("Self-Sealing Gas Tank"),
                era: ERA::Roaring20s,
            });
            stats.warnings.push(Warning {
                name: lu("Self-Sealing Gas Tank"),
                warning: lu("Self-Sealing Gas Tank Warning"),
                level: WarningLevel::White,
            });
        }

        // Fire extinguisher adds fixed mass and cost
        if self.fire_extinguisher {
            stats.mass += 2.0;
            stats.cost += 3.0;
            stats.eras.push(Era {
                name: lu("Remote Fire Extinguisher"),
                era: ERA::WWII,
            });
            stats.warnings.push(Warning {
                name: lu("Remote Fire Extinguisher"),
                warning: lu("Remote Fire Extinguisher Warning"),
                level: WarningLevel::White,
            });
        }

        // Because it is load, wetmass rounds up to the nearest 5
        let remainder = stats.wetmass % 5.0;
        if remainder > 0.0 {
            stats.wetmass += 5.0 - remainder;
        }

        stats
    }

    /// Get electrics contribution (none for fuel)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
