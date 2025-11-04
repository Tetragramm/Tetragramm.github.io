use super::*;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{Stats, Warning, WarningLevel};

impl Part for Rotor {
    /// Calculate stats contribution from rotor configuration
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        // Run validation to ensure sizes are correct
        self.verify_all();

        let mut stats = Stats::new();

        // Add rotor area to wing area
        let area = self.get_rotor_area();
        stats.wingarea += area.floor();

        // Add rotor drag
        stats.drag = self.get_rotor_drag() as f64;

        // Calculate cantilever requirements based on strain
        let strain = self.get_rotor_strain();
        let mut cant_stats = self.cantilever_list[self.cantilever_idx].stats.clone();

        // Calculate number of cantilever sections needed
        let count = if cant_stats.maxstrain != 0.0 {
            (strain / cant_stats.maxstrain).ceil()
        } else {
            1.0
        };

        cant_stats = cant_stats.multiply(count);
        cant_stats.maxstrain = 0.0; // Don't add cantilever maxstrain to total
        cant_stats.toughness = 0.0; // Don't add cantilever toughness
        stats = stats.add(&cant_stats);

        // Add arrangement stats
        stats = stats.add(&self.arrangement_list[self.arrangement_sel].stats);

        // Helicopter-specific stats
        if self.aircraft_type == AircraftType::Helicopter {
            // Reliability penalty for negative rotor span
            stats.reliability = 2.0 * (0.0_f64.min(self.rotor_span as f64));

            // Add blade count stats
            stats = stats.add(&self.blade_list[self.blade_idx].stats);

            // Rotor thickness effects
            stats.power -= self.rotor_thickness as f64;
            stats.maxstrain += 10.0 * self.rotor_thickness as f64;
        }

        // Accessory mass
        if self.accessory {
            if self.aircraft_type == AircraftType::Autogyro {
                stats.cost += 2.0;
                stats.mass += 2.0;
            } else if self.aircraft_type == AircraftType::Helicopter {
                stats.mass += (self.rotor_count * self.engine_count) as f64;
            }
        } else if self.aircraft_type == AircraftType::Helicopter {
            stats.mass += self.rotor_count.max(self.engine_count) as f64;
        }

        // Add warnings
        if self.aircraft_type == AircraftType::Helicopter {
            stats.warnings.push(Warning {
                name: "Helicopter Landing".to_string(),
                warning: "Helicopters may immediately land without a landing check.".to_string(),
                level: WarningLevel::White,
            });

            stats.warnings.push(Warning {
                name: "Helicopter Descent".to_string(),
                warning: "Helicopters may descend without a Handling check.".to_string(),
                level: WarningLevel::White,
            });

            stats.warnings.push(Warning {
                name: "Helicopter Stall".to_string(),
                warning: "Helicopters may not Stall or lose Boost.".to_string(),
                level: WarningLevel::White,
            });

            // Warning for negative rotor span
            if stats.reliability < 0.0 {
                stats.warnings.push(Warning {
                    name: "Rotor Span".to_string(),
                    warning: "Negative rotor span reduces reliability.".to_string(),
                    level: WarningLevel::Yellow,
                });
            }
        } else if self.aircraft_type == AircraftType::Autogyro {
            stats.warnings.push(Warning {
                name: "Autogyro Stall".to_string(),
                warning: "Autogyros may not Stall.".to_string(),
                level: WarningLevel::White,
            });
        }

        stats
    }

    /// Get electrics contribution (none for rotor)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
