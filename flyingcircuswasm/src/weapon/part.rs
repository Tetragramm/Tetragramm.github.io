use super::*;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Era, Warning, WarningLevel, ERA};

impl Part for Weapon {
    /// Calculate stats contribution from weapon
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Resolve synchronization based on current configuration
        self.resolve_synch();

        // Auto-fix covered status
        if !self.can_covered() && self.covered {
            self.covered = false;
        }
        if self.weapon_type.size == 16 {
            self.covered = self.fixed;
        }

        // Sum stats from all weapons
        let mut size = 0;
        for _ in 0..self.w_count {
            stats = stats.add(&self.weapon_type.stats);
            size += self.weapon_type.size;
        }

        // Covered cost
        if self.covered {
            let mut cost: f64 = if self.weapon_type.size <= 1 {
                0.0
            } else if self.weapon_type.size <= 2 {
                1.0
            } else if self.weapon_type.size <= 4 {
                2.0
            } else if self.weapon_type.size <= 8 {
                5.0
            } else if self.weapon_type.size <= 16 {
                0.0
            } else {
                0.0
            };

            cost *= self.w_count as f64;
            if !self.fixed {
                cost *= 2.0;
            }

            if self.synchronization != SynchronizationType::Spinner {
                stats.cost += cost;
            }

            // Covered weapons have no drag
            stats.drag = 0.0;
        }

        // Wing-mounted uncovered weapons add drag
        if self.wing && !self.covered {
            stats.drag += self.w_count as f64;
        }

        // Artillery size weapon turrets or fuselage mounts need a section
        if (self.turret && size > 8) || self.weapon_type.size == 16 {
            stats.reqsections += 1.0;
        }

        // Accessible cost
        if self.accessible {
            stats.cost += ((self.w_count as f64 / 2.0).floor()).max(1.0);
        }

        // Turret size cost (for flexible mounts)
        if !self.fixed {
            if size <= 2 {
                // Nothing
            } else if size <= 4 {
                stats.cost += 1.0;
            } else if size <= 8 {
                stats.mass += 1.0;
                stats.cost += 3.0;
            } else if size <= 16 {
                stats.mass += 2.0;
                stats.cost += 5.0;
            }
        }

        // Synchronization costs and eras
        match self.synchronization {
            SynchronizationType::Interrupt => {
                stats.cost += (self.w_count * 2) as f64;

                if self.weapon_type.name == "Light Machine Cannon" {
                    stats.cost += (self.w_count * 2) as f64;
                }

                stats.eras.push(Era {
                    name: t!("Interruptor Gear").to_string(),
                    era: ERA::WWI,
                });
            }
            SynchronizationType::Synch => {
                if self.action != ActionType::Mechanical {
                    stats.cost += (self.w_count * 3) as f64;

                    if self.weapon_type.name == "Light Machine Cannon" {
                        stats.cost += (self.w_count * 3) as f64;
                    }
                    stats.eras.push(Era {
                        name: t!("Synchronization Gear").to_string(),
                        era: ERA::Roaring20s,
                    });
                }
            }
            SynchronizationType::Spinner => {
                // Spinner costs nothing
            }
            SynchronizationType::Deflect => {
                stats.cost += 1.0;
                stats.warnings.push(Warning {
                    name: t!(&self.weapon_type.name).to_string(),
                    warning: t!("Deflector Plate Warning").to_string(),
                    level: WarningLevel::White,
                });
            }
            SynchronizationType::NoInterference => {
                if !self.is_lightning_arc() {
                    stats.warnings.push(Warning {
                        name: format!("{} {}", t!(&self.weapon_type.name), t!("No Interference"))
                            .to_string()
                            .to_string(),
                        warning: t!("No Interference Warning").to_string(),
                        level: WarningLevel::Yellow,
                    });
                }
            }
            SynchronizationType::None => {
                // No synchronization, no cost
            }
        }

        // Wing reinforcement
        if self.wing_reinforcement {
            stats.mass += 2.0;
        }

        stats
    }

    /// Get electrics contribution (none for weapons)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
