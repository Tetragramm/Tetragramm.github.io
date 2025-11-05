use super::Engine;

impl Engine {
    pub fn verify_mount(&mut self) {
        if self.get_is_turbine() && !self.get_is_turboprop() {
            while self.mount_sel < self.mount_list.len() && !self.mount_list[self.mount_sel].turbine
            {
                self.mount_sel += 1;
            }
        } else if self.get_is_pulsejet() {
            if self.mount_list[self.mount_sel].mount_type == crate::engines::MountType::Fuselage {
                for i in 0..self.mount_list.len() {
                    if !matches!(
                        self.mount_list[i].mount_type,
                        crate::engines::MountType::Fuselage
                    ) {
                        self.mount_sel = i;
                        break;
                    }
                }
            }
        } else if self.is_generator {
            self.mount_sel = 0;
        } else {
            if self.mount_list[self.mount_sel].turbine {
                if self.is_push_pull {
                    self.mount_sel = 8;
                } else {
                    self.mount_sel = 0;
                }
            }
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
