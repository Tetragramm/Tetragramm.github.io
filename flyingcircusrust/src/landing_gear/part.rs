use super::*;
use crate::part::Part;

impl Part for LandingGear {
    fn part_stats(&mut self) -> Stats {
        // Validate configuration first
        self.verify_all();

        let mut stats = Stats::new();

        // Calculate temp mass including extras (for mass-dependent calculations)
        // Do this first so we can add the Zeppelin Hook mass to tempMass
        let mut temp_mass: f32 = self.loaded_mass;

        // Add extras first (they affect temp_mass for gear calculations)
        for i in 0..self.extra_list.len() {
            if self.extra_sel[i] {
                stats = stats.add(&self.extra_list[i].stats);
                temp_mass += self.extra_list[i].stats.mass;

                // Add mass per Loaded Mass Point (in 5kg increments)
                let lmp = (temp_mass / 5.0 + 1e-6).floor();
                stats.mass += (self.extra_list[i].mplmp * lmp + 1.0e-6).floor();
            }
        }

        // Add base gear stats
        stats = stats.add(&self.gear_list[self.gear_sel].stats);

        // Calculate parasitic drag (per Loaded Mass Point)
        let lmp = (temp_mass / 5.0 + 1e-6).floor();
        let mut pdrag = self.gear_list[self.gear_sel].dplmp * lmp;

        // Special case: Retractable gear with Boat Hull
        // Adds normal hull drag, plus mass and cost of normal retractable gear
        let gear_name = &self.gear_list[self.gear_sel].name;
        if gear_name == "Boat Hull" && self.retract {
            stats.drag += pdrag;
            // Use normal gear (index 0) drag instead
            pdrag = self.gear_list[0].dplmp * lmp;
        }

        // Gull wings affect gear drag (but not Boat Hulls, except when retracted)
        if gear_name != "Boat Hull" || self.retract {
            match self.gull_deck {
                1 => {
                    // Shoulder: -10% drag
                    pdrag -= (0.1 * pdrag + 1e-6).floor();
                }
                2 | 3 => {
                    // Mid or Low: -15% drag
                    pdrag -= (0.15 * pdrag + 1e-6).floor();
                }
                4 => {
                    // Gear: -25% drag
                    pdrag -= (0.25 * pdrag + 1e-6).floor();
                }
                _ => {
                    // No change
                }
            }
        }

        // Apply retract or add drag
        if self.retract {
            // Retractable gear: add mass and cost instead of drag
            stats.mass += (pdrag / 2.0 + 1e-6).floor();
            stats.cost += (pdrag / 2.0 + 1e-6).floor();
        } else {
            // Fixed gear: add drag
            stats.drag += pdrag;
        }

        // Add structure per Loaded Mass Point
        stats.structure += self.gear_list[self.gear_sel].splmp * lmp;

        stats.round();

        stats
    }

    /// Get electrics contribution (none for landing gear)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        crate::part::ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
