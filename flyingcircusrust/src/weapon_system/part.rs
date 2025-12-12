use super::*;
use crate::part::{ElectricsMessage, Part};

impl Part for WeaponSystem {
    /// Calculate and return weapon system stats contribution
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();
        let dircount = self.get_direction_count();

        // Force ammo to 1 for heatray and lightning arc
        if self.projectile_sel == ProjectileType::Heatray || self.is_lightning_arc() {
            self.ammo = 1;
        }

        // Aggregate stats from all weapons
        let mut count = 0;
        for w in &mut self.weapons {
            w.has_cantilever = self.has_cantilever;
            w.set_turret(dircount > 2);
            stats = stats.add(&w.part_stats());
            count += w.get_count();

            // Turret direction costs (if not fixed)
            if !self.fixed {
                if dircount == 2 {
                    stats.cost += 1.0;
                } else if dircount == 3 || dircount == 4 {
                    stats.cost += 2.0;
                } else if dircount == 5 {
                    stats.cost += 3.0;
                } else if dircount == 6 {
                    stats.cost += 4.0;
                }
            }
        }

        // Ammunition cost
        stats.mass += ((self.ammo - 1) * count) as f32;

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}
