use super::{Engine, TypedInputs};

impl Engine {
    pub fn need_cooling(&self) -> bool {
        self.etype_stats.stats.cooling > 0.0
    }

    pub fn get_is_pulsejet(&self) -> bool {
        self.etype_stats.pulsejet
    }

    pub fn get_is_turbine(&self) -> bool {
        matches!(self.etype_inputs.inputs, TypedInputs::Turbine { .. })
    }

    pub fn get_is_turboprop(&self) -> bool {
        if let TypedInputs::Turbine { .. } = self.etype_inputs.inputs {
            self.etype_inputs.etype == 3
        } else {
            false
        }
    }

    pub fn get_is_electric(&self) -> bool {
        matches!(self.etype_inputs.inputs, TypedInputs::Electric { .. })
    }

    pub fn get_num_propellers(&self) -> i16 {
        if !(self.get_is_pulsejet() || self.get_is_turbine() || self.is_generator)
            || self.get_is_turboprop()
            || self.is_internal
        {
            if self.is_push_pull {
                return 2;
            }
            return 1;
        }
        0
    }

    pub fn is_rotary(&self) -> bool {
        self.etype_stats.oiltank
    }

    pub fn is_contra_rotary(&self) -> bool {
        if !self.get_is_pulsejet() && !self.get_is_turbine() {
            if !self.elist_key.is_empty() && self.etype_inputs.etype == 3 {
                return true;
            }
        }
        false
    }

    pub fn is_air_cooled(&self) -> bool {
        !self.get_is_pulsejet()
            && !self.get_is_turbine()
            && !self.need_cooling()
            && !self.is_rotary()
    }

    pub fn is_tractor(&self) -> bool {
        if self.is_internal || self.is_generator {
            return false;
        }
        let mount_name = &self.mount_list[self.mount_sel].name;
        mount_name == "Tractor"
            || mount_name == "Center-Mounted Tractor"
            || mount_name == "Fuselage Push-Pull"
    }

    pub fn is_pusher(&self) -> bool {
        if self.is_internal || self.is_generator {
            return false;
        }
        let mount_name = &self.mount_list[self.mount_sel].name;
        mount_name == "Pusher"
            || mount_name == "Center-Mounted Pusher"
            || mount_name == "Fuselage Push-Pull"
    }

    pub fn can_use_push_pull(&self) -> bool {
        self.mount_list[self.mount_sel].pushpull
    }

    pub fn can_use_extended_driveshaft(&self) -> bool {
        !((self.get_num_propellers() == 0)
            || self.is_internal
            || self.is_generator
            || self.mount_list[self.mount_sel].helicopter)
    }

    pub fn can_outboard_prop(&self) -> bool {
        self.extended_ds && self.is_push_pull
    }

    pub fn is_diesel(&self) -> bool {
        if let TypedInputs::Propeller { upgrades, .. } = &self.etype_inputs.inputs {
            upgrades.len() > 3 && upgrades[3]
        } else {
            false
        }
    }

    /// Check if this engine is a tractor nacelle
    /// A tractor nacelle is:
    /// - Has propellers (num_propellers > 0)
    /// - Not push-pull configuration
    /// - Mounted with power_factor == 0.8
    /// - Not internal
    pub fn get_is_tractor_nacelle(&self) -> bool {
        self.get_num_propellers() > 0
            && !self.is_push_pull
            && self.mount_list[self.mount_sel].power_factor == 0.8
            && !self.is_internal
    }

    // UI enabled check methods
    pub fn is_radiator_enabled(&self) -> bool {
        self.need_cooling()
    }

    pub fn is_mount_select_enabled(&self) -> bool {
        true
    }

    pub fn is_pushpull_enabled(&self) -> bool {
        self.can_use_push_pull()
    }

    pub fn is_torque_to_struct_enabled(&self) -> bool {
        self.is_push_pull
    }

    pub fn is_intake_fan_enabled(&self) -> bool {
        self.get_is_turbine()
    }

    pub fn is_extended_ds_enabled(&self) -> bool {
        self.mount_list[self.mount_sel].require_extended_driveshafts
    }

    pub fn is_outboard_prop_enabled(&self) -> bool {
        self.extended_ds
    }

    pub fn is_gears_enabled(&self) -> bool {
        self.get_num_propellers() > 0
    }

    pub fn is_cowl_enabled(&self) -> bool {
        true
    }

    pub fn is_generator_enabled(&self) -> bool {
        !self.get_is_pulsejet() && !self.get_is_turbine()
    }

    pub fn get_generator(&self) -> bool {
        self.is_generator
    }

    pub fn is_alternator_enabled(&self) -> bool {
        !self.get_is_electric()
    }

    pub fn radiator_list(&self) -> Vec<String> {
        (0..self.num_radiators)
            .map(|i| format!("Radiator {}", i + 1))
            .collect()
    }

    /// Get spinner configuration [can_use_gun, can_use_arty]
    /// TypeScript: GetSpinner()
    /// Returns array indicating if spinner can mount guns and/or artillery
    fn get_spinner(&self) -> [bool; 2] {
        if self.gear_count > 0 && !self.is_generator {
            let mount_name = &self.mount_list[self.mount_sel].name;
            if self.extended_ds
                && (mount_name == "Center-Mounted Tractor"
                    || mount_name == "Center-Mounted Pusher"
                    || mount_name == "Fuselage Push-Pull")
            {
                // Uses extended driveshafts, can mount both gun and arty
                return [true, true];
            } else if !self.etype_stats.oiltank {
                // Not rotary, room for gun but not arty
                return [true, false];
            }
        }
        // No spinner weapons
        [false, false]
    }

    /// Get tractor spinner info
    /// TypeScript: GetTractorSpinner()
    /// Returns { has: boolean, spinner: [boolean, boolean] }
    pub fn get_tractor_spinner(&self) -> (bool, [bool; 2]) {
        let has = self.is_tractor() && !(self.outboard_prop && !self.is_push_pull);
        let spinner = self.get_spinner();
        (has, spinner)
    }

    /// Get pusher spinner info
    /// TypeScript: GetPusherSpinner()
    /// Returns { has: boolean, spinner: [boolean, boolean] }
    pub fn get_pusher_spinner(&self) -> (bool, [bool; 2]) {
        let has = self.is_pusher() && !self.outboard_prop;
        let spinner = self.get_spinner();
        (has, spinner)
    }

    /// Get engine height for boat hull compatibility
    /// TypeScript: GetEngineHeight()
    /// Returns height value: -1 (lowest/nose), 0 (low), 1 (mid), 2 (high), 5 (generator/no prop)
    pub fn get_engine_height(&self) -> i16 {
        if !self.is_generator {
            let mount_name = &self.mount_list[self.mount_sel].name;

            if mount_name == "Pod"
                || self.get_is_pulsejet()
                || self.is_internal
                || self.outboard_prop
            {
                2
            } else if mount_name == "Nacelle (Offset)" {
                1
            } else if mount_name == "Nacelle (Inside)"
                || mount_name == "Channel Tractor"
                || mount_name == "Wing Pod"
            {
                0
            } else {
                -1
            }
        } else {
            5
        }
    }

    /// Check if this is a tractor-mounted rotary engine
    /// TypeScript: IsTractorRotary()
    /// A tractor rotary is: rotary engine + tractor mount (excluding generators)
    pub fn is_tractor_rotary(&self) -> bool {
        if self.is_generator {
            return false;
        }
        self.is_rotary()
            && (self.mount_list[self.mount_sel].name == "Tractor"
                || self.mount_list[self.mount_sel].name == "Fuselage Push-Pull")
    }

    /// Get engine rumble value
    /// TypeScript: GetRumble()
    /// Returns the rumble rating of this engine
    pub fn get_rumble(&self) -> f64 {
        self.etype_stats.rumble as f64
    }

    /// Get engine overspeed value
    /// TypeScript: GetOverspeed()
    /// Returns the overspeed capability of this engine, accounting for geared propellers
    /// Generators return 1000 (effectively unlimited overspeed)
    /// Normal engines: base_overspeed + floor(geared_propeller_count * base_overspeed / 2)
    pub fn get_overspeed(&self) -> i16 {
        if self.is_generator {
            return 1000;
        }
        self.etype_stats.overspeed
            + ((1.0e-6 + self.gear_count as f64 * self.etype_stats.overspeed as f64 / 2.0).floor()
                as i16)
    }

    /// Update engine reliability based on aircraft and radiator stats
    /// TypeScript: UpdateReliability(num: number)
    /// Calculates total_reliability accounting for engine type, geared propellers, cowling,
    /// cooling efficiency, intake fan, and aircraft/radiator bonuses
    pub fn update_reliability(&mut self, bonus_reliability: i16) {
        self.total_reliability = self.etype_stats.stats.reliability as i16;

        // Subtract net geared propeller penalty
        let geared_penalty = self.gear_count; // gear_count is total geared propellers
        self.total_reliability -= geared_penalty;

        // Add cowling reliability bonus
        self.total_reliability += self.cowl_list[self.cowl_sel].stats.reliability as i16;

        // Subtract cooling deficit if engine needs cooling
        if self.need_cooling() {
            let max_cool = if self.is_push_pull {
                2 * self.etype_stats.stats.cooling as i16
            } else {
                self.etype_stats.stats.cooling as i16
            };
            let cooling_deficit = max_cool - self.cooling_count;
            self.total_reliability -= cooling_deficit;
        }

        // Add intake fan bonus (if turbine with intake fan upgrade)
        if self.intake_fan {
            self.total_reliability += 6;
        }

        // Add aircraft and radiator bonus
        self.total_reliability += bonus_reliability;
    }

    /// Get engine reliability as a string
    /// TypeScript: GetReliability()
    /// Returns reliability value, potentially with dual values for push-pull or outboard props
    pub fn get_reliability(&self) -> String {
        if self.is_push_pull {
            if self.outboard_prop {
                format!("{}/{}", self.total_reliability, self.total_reliability - 2)
            } else {
                format!("{}/{}", self.total_reliability, self.total_reliability)
            }
        } else {
            if self.outboard_prop {
                format!("{}", self.total_reliability - 2)
            } else {
                format!("{}", self.total_reliability)
            }
        }
    }

    /// Get minimum altitude for this engine
    /// TypeScript: GetMinAltitude()
    pub fn get_min_altitude(&self) -> i16 {
        // Get min_ideal_alt from TypedInputs if it's a propeller engine
        if let TypedInputs::Propeller { min_ideal_alt, .. } = &self.etype_inputs.inputs {
            *min_ideal_alt
        } else {
            0
        }
    }

    /// Get maximum altitude for this engine
    /// TypeScript: GetMaxAltitude()
    pub fn get_max_altitude(&self) -> i16 {
        self.get_min_altitude() + self.etype_stats.altitude
    }

    /// Check if this engine has an oil cooler
    /// TypeScript: GetHasOilCooler()
    /// Returns true if engine requires cooling (liquid-cooled)
    pub fn get_has_oil_cooler(&self) -> bool {
        self.etype_stats.stats.cooling > 0.0
    }

    /// Check if this engine has an oil pan
    /// TypeScript: GetHasOilPan()
    /// Returns true if engine is air-cooled (has oil pan)
    pub fn get_has_oil_pan(&self) -> bool {
        self.is_air_cooled()
    }
}
