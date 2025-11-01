use super::*;

impl Propeller {
    /// Get the list of propeller types
    pub fn get_prop_list(&self) -> &Rc<Vec<PropellerEntry>> {
        &self.prop_list
    }

    /// Get the list of upgrades
    pub fn get_upgrade_list(&self) -> &Rc<Vec<UpgradeEntry>> {
        &self.upg_list
    }

    /// Get the selected propeller index
    pub fn get_prop_index(&self) -> usize {
        self.idx_prop
    }

    /// Get the selected upgrade index
    pub fn get_upgrade_index(&self) -> usize {
        self.idx_upg
    }

    /// Count the number of propeller-driven engines
    pub fn get_num_propellers(&self) -> i16 {
        let mut num_propellers = 0;
        for e in &self.engines {
            if e.drive_type == DriveType::Propeller {
                num_propellers += e.num;
            }
        }
        num_propellers
    }

    /// Calculate energy value based on aircraft type and engines
    pub fn get_energy(&self) -> f64 {
        match self.acft_type {
            AircraftType::Helicopter => return 2.5,
            AircraftType::OrnithopterBasic => return 6.0,
            AircraftType::OrnithopterFlutter => return 8.0,
            AircraftType::OrnithopterBuzzer => return 5.0,
            _ => {}
        }

        if self.engines.is_empty() {
            return 2.5;
        }

        let mut e: f64 = 999.0;
        for engine in &self.engines {
            match engine.drive_type {
                DriveType::Propeller => {
                    e = e.min(
                        self.prop_list[self.idx_prop].energy + self.upg_list[self.idx_upg].energy,
                    );
                }
                DriveType::Pulsejet => {
                    e = e.min(5.0);
                }
                DriveType::Turbine => {
                    e = e.min(9.0);
                }
            }
        }
        e
    }

    /// Calculate turn value based on aircraft type and engines
    pub fn get_turn(&self) -> f64 {
        match self.acft_type {
            AircraftType::Helicopter => return 6.0,
            AircraftType::OrnithopterBasic => return 7.0,
            AircraftType::OrnithopterFlutter => return 8.0,
            AircraftType::OrnithopterBuzzer => return 5.0,
            _ => {}
        }

        if self.engines.is_empty() {
            return 6.0;
        }

        let mut t: f64 = 999.0;
        for engine in &self.engines {
            match engine.drive_type {
                DriveType::Propeller => {
                    t = t
                        .min(self.prop_list[self.idx_prop].turn + self.upg_list[self.idx_upg].turn);
                }
                DriveType::Pulsejet => {
                    t = t.min(2.5);
                }
                DriveType::Turbine => {
                    t = t.min(4.0);
                }
            }
        }
        t
    }

    /// UI enabled function for propeller selection
    pub fn is_idx_prop_enabled(&self) -> bool {
        true
    }

    /// UI enabled function for upgrade selection
    pub fn is_idx_upg_enabled(&self) -> bool {
        true
    }
}
