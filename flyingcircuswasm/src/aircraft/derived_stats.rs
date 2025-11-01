use super::*;
use crate::types::DerivedStats;

impl Aircraft {
    /// Calculate derived stats from base stats
    /// TypeScript: GetDerivedStats()
    /// Returns performance characteristics like max speed, stall speed, handling, etc.
    pub fn get_derived_stats(&mut self) -> DerivedStats {
        let mut stats = &mut self.stats;

        // Calculate Mass Points
        let mut dry_mp = (stats.mass / 5.0).floor() as i16;
        dry_mp = dry_mp.max(1);
        let mut wet_mp = ((stats.mass + stats.wetmass) / 5.0).floor() as i16;
        wet_mp = wet_mp.max(1);
        let mut wet_mp_w_bombs =
            ((stats.mass + stats.wetmass + stats.bomb_mass) / 5.0).floor() as i16;
        wet_mp_w_bombs = wet_mp_w_bombs.max(1);

        // Calculate Drag Points
        let mut dp_empty = ((stats.drag + dry_mp as f64) / 5.0).floor() as i16;
        dp_empty = dp_empty.max(1);
        let dp_full = dp_empty; // Based on advice from Discord
        let mut dp_w_bombs =
            ((stats.drag as f64 + self.munitions.get_external_mass() as f64 + dry_mp as f64) / 5.0)
                .floor() as i16;
        dp_w_bombs = dp_w_bombs.max(1);

        // Calculate Max Speed values
        let mut max_speed_empty = (stats.pitchspeed
            * ((2000.0 * stats.power) / (dp_empty as f64 * 9.0)).sqrt())
        .floor() as i16;
        let mut max_speed_full = (stats.pitchspeed
            * ((2000.0 * stats.power) / (dp_full as f64 * 9.0)).sqrt())
        .floor() as i16;
        let mut max_speed_w_bombs = (stats.pitchspeed
            * ((2000.0 * stats.power) / (dp_w_bombs as f64 * 9.0)).sqrt())
        .floor() as i16;

        // Warnings for stat limits
        if stats.mass < 15.0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Stat Mass")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Stat Mass".to_string(),
                    warning: "Low Mass Warning".to_string(),
                    level: crate::stats::WarningLevel::Yellow, // WARNING_COLOR::YELLOW
                });
            }
        }

        if (stats.drag + dry_mp as f64) < 35.0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Stat Drag")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Stat Drag".to_string(),
                    warning: "Low Drag Warning".to_string(),
                    level: crate::stats::WarningLevel::Yellow, // WARNING_COLOR::YELLOW
                });
            }
        }

        // Calculate Stall Speeds
        let mut stall_speed_empty =
            (stats.liftbleed * dry_mp as f64 / stats.wingarea.max(1.0)).floor() as i16;
        stall_speed_empty = stall_speed_empty.max(1);

        let mut stall_speed_full =
            (stats.liftbleed * wet_mp as f64 / stats.wingarea.max(1.0)).floor() as i16;
        stall_speed_full = stall_speed_full.max(1);

        let mut stall_speed_full_w_bombs =
            (stats.liftbleed * wet_mp_w_bombs as f64 / stats.wingarea.max(1.0)).floor() as i16;
        stall_speed_full_w_bombs = stall_speed_full_w_bombs.max(1);

        let mut overspeed = self.engines.get_overspeed() as f64;

        // Calculate Boost values
        let boost_empty = (stats.power / dry_mp as f64).floor() as i16;
        let boost_full = (stats.power / wet_mp as f64).floor() as i16;
        let boost_full_w_bombs = (stats.power / wet_mp_w_bombs as f64).floor() as i16;

        if boost_full_w_bombs == 0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Derived Boost")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Derived Boost".to_string(),
                    warning: "Boost Warning".to_string(),
                    level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
                });
            }
        }

        let dropoff = (stats.pitchboost * max_speed_empty as f64).floor() as i16;

        // Apply used condition: Ragged (affects max speed)
        max_speed_empty =
            ((max_speed_empty as f64) * (1.0 - 0.1 * self.used.ragged as f64)).floor() as i16;
        max_speed_full =
            ((max_speed_full as f64) * (1.0 - 0.1 * self.used.ragged as f64)).floor() as i16;
        max_speed_w_bombs =
            ((max_speed_w_bombs as f64) * (1.0 - 0.1 * self.used.ragged as f64)).floor() as i16;

        // Calculate Stability
        let mut stability = stats.pitchstab as i16 + stats.latstab as i16;
        if stats.pitchstab > 0.0 && stats.latstab > 0.0 {
            stability += 2;
        } else if stats.pitchstab < 0.0 && stats.latstab < 0.0 {
            stability -= 2;
        }

        // Calculate Handling
        let mut handling_empty = (100.0 + stats.control - dry_mp as f64).floor() as i16;

        if stability > 10 || stability < -10 {
            handling_empty = i16::MIN;
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Derived Stability")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Derived Stability".to_string(),
                    warning: "Stability Warning".to_string(),
                    level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
                });
            }
        } else if stability == 10 {
            handling_empty -= 4;
        } else if stability > 6 {
            handling_empty -= 3;
        } else if stability > 3 {
            handling_empty -= 2;
        } else if stability > 0 {
            handling_empty -= 1;
        } else if stability == 0 {
            // No change
        } else if stability > -4 {
            handling_empty += 1;
        } else if stability > -7 {
            handling_empty += 2;
        } else if stability > -10 {
            handling_empty += 3;
        } else if stability == -10 {
            handling_empty += 4;
        }

        let mut handling_full = handling_empty + dry_mp - wet_mp;
        let mut handling_full_w_bombs = handling_empty + dry_mp - wet_mp_w_bombs;

        // Apply used condition: Sluggish
        handling_empty = (handling_empty as f64 - 5.0 * self.used.sluggish as f64).floor() as i16;
        handling_full = (handling_full as f64 - 5.0 * self.used.sluggish as f64).floor() as i16;
        handling_full_w_bombs =
            (handling_full_w_bombs as f64 - 5.0 * self.used.sluggish as f64).floor() as i16;

        // Calculate Max Strain
        let mut max_strain = (stats.maxstrain as i16 - dry_mp).min(stats.structure as i16);
        self.optimization.final_ms =
            (self.optimization.get_maxstrain() as f64 * 1.5 * max_strain as f64 / 10.0).floor();
        max_strain += self.optimization.final_ms as i16;

        // Apply used condition: Fragile
        max_strain = ((max_strain as f64) * (1.0 - 0.2 * self.used.fragile as f64)).floor() as i16;

        if max_strain < 10
            && stats
                .warnings
                .iter()
                .find(|w| w.name == "Stat Max Strain")
                .is_none()
        {
            stats.warnings.push(crate::stats::Warning {
                name: "Stat Max Strain".to_string(),
                warning: "Max Strain Warning".to_string(),
                level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
            });
        }

        // Calculate Toughness
        let mut toughness = stats.toughness as i16;
        // Apply used condition: Weak
        toughness = ((toughness as f64) * (1.0 - 0.5 * self.used.weak as f64)).floor() as i16;

        let structure = stats.structure as i16;

        // Calculate Energy Loss
        let mut energy_loss =
            ((-1.0e-6 + dp_empty as f64 / self.propeller.get_energy()).ceil()) as i16;
        let mut energy_loss_w_bombs = energy_loss + 1;
        energy_loss = energy_loss.min(10);
        energy_loss_w_bombs = energy_loss_w_bombs.min(10);

        // Calculate Turn Bleed
        let mut turn_bleed = (-1.0e-6
            + (1.0e-6 + (stall_speed_empty - stall_speed_full) as f64 / 2.0).floor()
                / self.propeller.get_turn())
        .ceil() as i16;

        if self.aircraft_type == AircraftType::Helicopter {
            turn_bleed =
                ((dry_mp as f64 / 2.0).floor() as i16 + self.rotor.get_rotor_bleed()).max(1);
            energy_loss = ((dp_empty as f64 / 7.0).floor() as i16).max(1);
            stall_speed_empty = 0;
            stall_speed_full = 0;
            stall_speed_full_w_bombs = 0;
            max_speed_empty = max_speed_empty.min(37);
            max_speed_full = max_speed_full.min(37);
            max_speed_w_bombs = max_speed_w_bombs.min(37);
        }
        turn_bleed = turn_bleed.max(1);
        let mut turn_bleed_w_bombs = turn_bleed + 1;
        turn_bleed_w_bombs = turn_bleed_w_bombs.max(1);

        // Apply used condition: Hefty (affects stall speed)
        stall_speed_empty =
            ((stall_speed_empty as f64) * (1.0 + 0.2 * self.used.hefty as f64)).floor() as i16;
        stall_speed_empty = stall_speed_empty.max(1);

        stall_speed_full =
            ((stall_speed_full as f64) * (1.0 + 0.2 * self.used.hefty as f64)).floor() as i16;
        stall_speed_full = stall_speed_full.max(1);

        stall_speed_full_w_bombs = ((stall_speed_full_w_bombs as f64)
            * (1.0 + 0.2 * self.used.hefty as f64))
            .floor() as i16;
        stall_speed_full_w_bombs = stall_speed_full_w_bombs.max(1);

        // Check stall speed warnings
        if max_speed_w_bombs <= stall_speed_full_w_bombs || max_speed_full <= stall_speed_full {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Stall Speed")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Stall Speed".to_string(),
                    warning: "Stall Speed Warning".to_string(),
                    level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
                });
            }
        }

        // Calculate Fuel Uses
        let mut fuel_uses = if stats.fuelconsumption != 0.0 {
            (stats.fuel / stats.fuelconsumption).floor() as i16
        } else {
            0
        };
        // Apply used condition: Leaky
        fuel_uses = ((fuel_uses as f64) * (1.0 - 0.2 * self.used.leaky as f64)).floor() as i16;

        if fuel_uses < 6 && stats.fuelconsumption != 0.0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Derived Fuel Uses")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Derived Fuel Uses".to_string(),
                    warning: "Fuel Uses Warning".to_string(),
                    level: crate::stats::WarningLevel::Yellow, // WARNING_COLOR::YELLOW
                });
            }
        }

        // Calculate Control Stress
        let mut control_stress = 1i16;
        if stability > 3 || stability < -3 {
            control_stress += 1;
        }

        control_stress +=
            ((dry_mp as f64 / 10.0).floor() as i16).min(self.accessories.max_mass_stress());
        let max_stress = self.accessories.max_total_stress();
        control_stress = control_stress.min(max_stress);

        // Calculate Rumble Stress
        let mut rumble_stress = 0i16;
        if self.engines.get_max_rumble() > 0.0 {
            rumble_stress = ((0.5 * self.engines.get_rumble()).max(1.0).floor()) as i16;
            rumble_stress = rumble_stress.min(3);
        }
        if max_stress == 0 {
            rumble_stress = 0;
        }

        // Calculate Rate of Climb
        let mut rate_of_climb_empty =
            ((stats.power / dry_mp as f64) * (23.0 / stats.pitchspeed) / dp_empty as f64);
        if !rate_of_climb_empty.is_finite() {
            rate_of_climb_empty = 0.0;
        }
        let mut rate_of_climb_empty = rate_of_climb_empty.floor() as i16;
        rate_of_climb_empty = rate_of_climb_empty.max(1);

        let mut rate_of_climb_full = ((stats.power / wet_mp as f64) * (23.0 / stats.pitchspeed)
            / dp_full as f64)
            .floor() as i16;
        rate_of_climb_full = rate_of_climb_full.max(1);

        let mut rate_of_climb_w_bombs =
            ((stats.power / wet_mp_w_bombs as f64) * (23.0 / stats.pitchspeed) / dp_w_bombs as f64)
                .floor() as i16;
        rate_of_climb_w_bombs = rate_of_climb_w_bombs.max(1);

        // Handle Ornithopter special cases
        if self.aircraft_type.is_any_ornithopter() {
            handling_empty += 5;
            handling_full += 5;
            handling_full_w_bombs += 5;
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Ornithopter Stall")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Ornithopter Stall".to_string(),
                    warning: "Ornithopter Stall Warning".to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
            overspeed = max_strain as f64;
        }

        if self.aircraft_type == AircraftType::OrnithopterFlutter {
            handling_empty += 5;
            handling_full += 5;
            handling_full_w_bombs += 5;
            overspeed = f64::INFINITY;
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Ornithopter Flutterer Attack")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Ornithopter Flutterer Attack".to_string(),
                    warning: "Ornithopter Flutterer Attack Warning".to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
        }

        if self.aircraft_type == AircraftType::OrnithopterBuzzer {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Ornithopter Buzzer Boost")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Ornithopter Buzzer Boost".to_string(),
                    warning: "Ornithopter Buzzer Boost Warning".to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
            if stats
                .warnings
                .iter()
                .find(|w| w.name == "Ornithopter Buzzer Stall")
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: "Ornithopter Buzzer Stall".to_string(),
                    warning: "Ornithopter Buzzer Stall Warning".to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
        }

        DerivedStats {
            dry_mp,
            wet_mp,
            wet_mp_w_bombs,
            dp_empty,
            dp_full,
            dp_w_bombs,
            max_speed_empty,
            max_speed_full,
            max_speed_w_bombs,
            stall_speed_empty,
            stall_speed_full,
            stall_speed_full_w_bombs,
            overspeed,
            boost_empty,
            boost_full,
            boost_full_w_bombs,
            dropoff,
            stability,
            handling_empty,
            handling_full,
            handling_full_w_bombs,
            max_strain,
            toughness,
            structure,
            energy_loss,
            energy_loss_w_bombs,
            turn_bleed,
            turn_bleed_w_bombs,
            fuel_uses,
            control_stress,
            rumble_stress,
            rate_of_climb_full,
            rate_of_climb_empty,
            rate_of_climb_w_bombs,
        }
    }
}
