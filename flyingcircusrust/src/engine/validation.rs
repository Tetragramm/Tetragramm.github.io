use super::Engine;

impl Engine {
    /// Check if the currently selected mount is valid for current engine configuration
    pub fn is_mount_valid(&self, idx: usize) -> bool {
        if idx >= self.mount_list.len() {
            return false;
        }

        let mount = &self.mount_list[idx];

        // Turbine (non-turboprop) engines require turbine mounts
        if self.get_is_turbine() && !self.get_is_turboprop() {
            return mount.turbine && (mount.helicopter == self.is_helicopter_aircraft);
        }

        // Pulsejet engines have specific mount requirements
        if self.get_is_pulsejet() {
            if self.is_helicopter_aircraft {
                // Pulsejets on helicopters use "Not Allowed" mount (typically mount 17)
                return idx == 17;
            } else {
                // Pulsejets on aircraft use mount 4 (fuselage)
                return idx == 4;
            }
        }

        // Generators always use mount 0
        if self.is_generator {
            return idx == 0;
        }

        if idx == 8 {
            return self.is_push_pull;
        }

        if self.is_push_pull {
            return mount.pushpull;
        }

        // Normal propeller aircraft: non-turbine, non-helicopter mounts (0-7)
        !mount.turbine && (mount.helicopter == self.is_helicopter_aircraft)
    }

    /// Verify and correct the mount selection if needed
    /// If current mount is invalid, switches to first valid mount
    pub fn verify_mount(&mut self) {
        // Check if current mount is valid
        if !self.is_mount_valid(self.mount_sel) {
            // Find first valid mount
            for idx in 0..self.mount_list.len() {
                if self.is_mount_valid(idx) {
                    self.mount_sel = idx;
                    return;
                }
            }
            // Fallback to mount 0 if no valid mount found (shouldn't happen)
            self.mount_sel = 0;
        }
    }

    pub fn verify_cooling(&mut self) {
        if self.need_cooling() {
            self.cooling_count = self.cooling_count.max(1);
            if self.radiator_index < 0 {
                self.radiator_index = 0;
            }
        } else {
            self.cooling_count = 0;
            self.radiator_index = -1;
        }
    }

    pub fn pulsejet_check(&mut self) {
        if self.get_is_pulsejet() {
            self.is_push_pull = false;
            self.extended_ds = false;
            self.gear_count = 0;
            self.geared_reliability = 0;
            self.cooling_count = 0;
            self.has_alternator = false;
            self.is_generator = false;
            self.cowl_sel = 0;
            self.radiator_index = -1;
        }
    }

    pub fn turbine_check(&mut self) {
        if self.get_is_turbine() {
            if self.get_num_propellers() == 0 {
                self.extended_ds = false;
                self.gear_count = 0;
                self.geared_reliability = 0;
            }
            self.cooling_count = 0;
            self.cowl_sel = 0;
            self.radiator_index = -1;
        }
    }

    pub fn electric_check(&mut self) {
        if self.get_is_electric() {
            self.has_alternator = false;
        }
    }
}
