use super::Engine;
use crate::part::{ElectricsMessage, Part};
use crate::stats::Stats;

impl Part for Engine {
    fn part_stats(&mut self) -> Stats {
        // Verify various settings (from TypeScript lines 993-1006)
        self.verify_mount();
        self.verify_cooling();
        self.pulsejet_check();
        self.turbine_check();
        self.electric_check();

        if !self.can_use_push_pull() {
            self.is_push_pull = false;
        }
        if !self.can_use_extended_driveshaft() {
            self.extended_ds = false;
        }
        if !self.can_outboard_prop() {
            self.outboard_prop = false;
        }

        let mut stats = Stats::new();
        stats = stats.add(&self.etype_stats.stats);

        // Upkeep calculation (line 1010-1013)
        stats.upkeep = stats.power / 10.0;
        if self.get_is_pulsejet() {
            stats.upkeep += 1.0;
        }

        // Oil tank (line 1015-1016)
        if self.etype_stats.oiltank {
            stats.mass += 1.0;
        }

        // Torque handling (lines 1018-1034)
        // Note: torque variable was in TypeScript but not actually used
        if self.torque_to_struct {
            stats.structure -= self.etype_stats.torque as f32;
        } else {
            match self.mount_list[self.mount_sel].mount_type {
                crate::engines::MountType::Wing => {
                    stats.maxstrain -= self.etype_stats.torque as f32;
                }
                crate::engines::MountType::Fuselage => {
                    stats.latstab -= self.etype_stats.torque as f32;
                }
                _ => {}
            }
        }

        // ContraRotary engines need geared propellers (lines 1037-1039)
        if self.is_contra_rotary() {
            self.gear_count = self.gear_count.max(1);
        }

        // Geared propellers (lines 1040-1046)
        stats.cost += self.gear_count as f32 + self.geared_reliability as f32;
        if self.gear_count > 0 {
            stats.eras.push(crate::stats::Era {
                name: "Propeller Gearing".to_string(),
                era: crate::stats::ERA::WWI,
            });
        }
        if self.geared_reliability > 0 {
            stats.eras.push(crate::stats::Era {
                name: "Reliable Gearing".to_string(),
                era: crate::stats::ERA::Roaring20s,
            });
        }

        // Extended Driveshafts (lines 1049-1051)
        if self.extended_ds {
            stats.mass += 1.0;
        }

        // Cowls modify engine stats directly (lines 1053-1056)
        stats = stats.add(&self.cowl_list[self.cowl_sel].stats);
        stats.mass += (1.0e-6 + stats.drag * self.cowl_list[self.cowl_sel].mass_per_drag).floor();
        stats.drag = (1.0e-6 + stats.drag * self.cowl_list[self.cowl_sel].drag_factor).floor();

        // Push-pull (lines 1059-1072)
        if self.is_push_pull {
            stats.power *= 2.0;
            stats.mass *= 2.0;
            stats.cooling *= 2.0;
            stats.fuelconsumption *= 2.0;
            stats.cost *= 2.0;
            stats.latstab *= 2.0;
            stats.structure *= 2.0;
            stats.maxstrain *= 2.0;
            stats.upkeep *= 2.0;
            stats.reqsections *= 2.0;
            stats.charge *= 2.0;
            stats.power =
                (1.0e-6 + self.mount_list[self.mount_sel].power_factor * stats.power).floor();
        }

        // Cowl engineering cost for pushers (lines 1075-1083)
        let cowl_name = &self.cowl_list[self.cowl_sel].name;
        let mount_name = &self.mount_list[self.mount_sel].name;
        if cowl_name != "No Cowling" && cowl_name != "Sealed Cowl" {
            if mount_name == "Rear-Mounted Pusher"
                || mount_name == "Center-Mounted Pusher"
                || mount_name == "Center-Mounted Tractor"
                || mount_name == "Fuselage Push-Pull"
            {
                stats.cost += 2.0;
            }
        }

        // Air Cooling Fan (lines 1086-1097)
        if self.is_air_cooled() && self.intake_fan {
            stats.mass += 3.0;
            // Double effect of torque
            stats.latstab *= 2.0;
            stats.structure *= 2.0;
            stats.maxstrain *= 2.0;
            stats.cost += 4.0;
            stats.eras.push(crate::stats::Era {
                name: "Air Cooling Fan".to_string(),
                era: crate::stats::ERA::WWII,
            });
        } else {
            self.intake_fan = false;
        }

        // Oil cooler drag (lines 1100-1102)
        if self.etype_stats.stats.cooling > 0.0 {
            stats.drag += (stats.power / 15.0).floor();
        }

        // Mounting modifiers (lines 1106-1110)
        if !self.get_is_pulsejet() {
            stats = stats.add(&self.mount_list[self.mount_sel].stats);
            stats.maxstrain -= (1.0e-6
                + self.mount_list[self.mount_sel].strain_factor * self.etype_stats.stats.mass)
                .floor();
            stats.drag += (1.0e-6
                + self.mount_list[self.mount_sel].drag_factor * self.etype_stats.stats.mass)
                .floor();
        }

        // Power Generation (lines 1113-1125)
        if self.is_generator {
            stats.charge = (1.0e-6 + 2.0 * stats.power / 10.0).floor() + 2.0;
            stats.power = 0.0;
            stats.visibility = 2.0;
        } else if self.has_alternator {
            stats.charge = (1.0e-6 + stats.power / 10.0).floor() + 1.0;
            stats.mass += 1.0;
            stats.cost += 2.0;
            if self.is_push_pull && mount_name == "Fuselage Push-Pull" {
                stats.mass += 1.0;
                stats.cost += 2.0;
            }
        }

        // Outboard prop (lines 1127-1132)
        if self.outboard_prop {
            stats.drag += 3.0;
            if self.is_push_pull {
                stats.escape += 2.0;
            }
        }

        // First pulsejet cost (lines 1134-1136)
        if self.is_first_pulsejet {
            stats.cost += 5.0;
        }

        // Pitch speed and reliability are part-local (lines 1139-1141)
        stats.pitchspeed = 0.0;
        stats.reliability = 0.0;

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}
