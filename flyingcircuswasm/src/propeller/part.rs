use super::*;
use crate::part::{ElectricsMessage, Part};

impl Part for Propeller {
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Only add propeller stats if there are propeller-driven engines
        let num_propellers = self.get_num_propellers();
        if num_propellers != 0 {
            // Add base propeller stats multiplied by number of propellers
            stats = stats.add(
                &self.prop_list[self.idx_prop]
                    .stats
                    .multiply(num_propellers as f64),
            );
            // Add upgrade stats multiplied by number of propellers
            stats = stats.add(
                &self.upg_list[self.idx_upg]
                    .stats
                    .multiply(num_propellers as f64),
            );
        }

        // Calculate pitchboost and pitchspeed based on aircraft type and engines
        match self.acft_type {
            AircraftType::Helicopter => {
                stats.pitchboost = 0.6;
                stats.pitchspeed = 1.0;
            }
            AircraftType::OrnithopterBasic => {
                stats.pitchboost = 0.6;
                stats.pitchspeed = 0.8;
            }
            AircraftType::OrnithopterFlutter => {
                stats.pitchboost = 0.8;
                stats.pitchspeed = 0.8;
            }
            AircraftType::OrnithopterBuzzer => {
                stats.pitchboost = 1.0;
                stats.pitchspeed = 0.6;
            }
            _ => {
                if self.engines.is_empty() {
                    // Default: no auto pitch
                    stats.pitchboost = 0.6;
                    stats.pitchspeed = 1.0;
                } else {
                    // Calculate minimum pitch values across all engines
                    stats.pitchboost = 999.0;
                    stats.pitchspeed = 999.0;

                    for e in &self.engines {
                        match e.drive_type {
                            DriveType::Propeller => {
                                stats.pitchboost = stats.pitchboost.min(
                                    self.prop_list[self.idx_prop].stats.pitchboost
                                        + self.upg_list[self.idx_upg].stats.pitchboost,
                                );
                                stats.pitchspeed = stats.pitchspeed.min(
                                    self.prop_list[self.idx_prop].stats.pitchspeed
                                        + self.upg_list[self.idx_upg].stats.pitchspeed,
                                );
                            }
                            DriveType::Pulsejet => {
                                stats.pitchboost = stats.pitchboost.min(0.6);
                                stats.pitchspeed = stats.pitchspeed.min(1.3);
                            }
                            DriveType::Turbine => {
                                stats.pitchboost = stats.pitchboost.min(0.2);
                                stats.pitchspeed = stats.pitchspeed.min(e.num as f64);
                            }
                        }
                    }
                }
            }
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        // Propellers don't contribute to electrics
        ElectricsMessage::new()
    }
}
