use super::*;

impl Accessories {
    /// Set armour coverage at specific AP level
    pub fn set_armour_coverage(&mut self, idx: usize, mut count: i16) {
        if idx >= self.armour_coverage.len() {
            return;
        }

        if count < 0 {
            count = 0;
        }
        count = (count as f32 + 1.0e-6).floor() as i16;

        if idx != 1 {
            self.armour_coverage[idx] = count;
        } else {
            self.armour_coverage[idx] = count - self.skin_armour;
        }

        self.normalize_coverage();
    }

    /// Normalize armour coverage to respect limits
    fn normalize_coverage(&mut self) {
        let vital_adj = ((self.vital_parts - 8) / 2).max(0);
        let mut coverage = -8 + (-vital_adj).min(0);
        coverage += self.skin_armour;

        for i in (0..self.armour_coverage.len()).rev() {
            self.armour_coverage[i] = (coverage.abs()).min(self.armour_coverage[i]).max(0);
            coverage += self.armour_coverage[i];
        }
    }

    /// Set electrical equipment count for a specific type
    pub fn set_electrical_count(&mut self, idx: usize, mut count: i16) {
        if idx >= self.electrical_list.len() {
            return;
        }

        if count < 0 {
            count = 0;
        }
        count = (count as f32 + 1.0e-6).floor() as i16;
        count = count.min(50);

        self.electrical_count[idx] = count;
    }

    /// Set selected radio communication system
    pub fn set_radio_sel(&mut self, idx: usize) {
        if idx < self.radio_list.len() {
            self.radio_sel = idx;
        }
    }

    /// Set reconnaissance equipment count for a specific type
    pub fn set_recon_sel(&mut self, idx: usize, mut count: i16) {
        if idx >= self.recon_list.len() {
            return;
        }

        if count < 0 {
            count = 0;
        }

        self.recon_sel[idx] = count;
    }

    /// Set visibility equipment toggle
    pub fn set_visi_sel(&mut self, idx: usize, enabled: bool) {
        if idx >= self.visi_list.len() {
            return;
        }

        let can_use = self.can_visi();
        if !can_use[idx] && enabled {
            return; // Can't enable what's not allowed
        }

        self.visi_sel[idx] = enabled;
    }

    /// Set climate control equipment toggle
    pub fn set_clim_sel(&mut self, idx: usize, enabled: bool) {
        if idx >= self.climate_list.len() {
            return;
        }

        self.clim_sel[idx] = enabled;
    }

    /// Set selected autopilot system
    pub fn set_auto_sel(&mut self, idx: usize) {
        if idx < self.autopilot_list.len() {
            self.auto_sel = idx;
        }
    }

    /// Set selected control system
    pub fn set_cont_sel(&mut self, idx: usize) {
        if idx < self.control_list.len() {
            self.cont_sel = idx;
        }
    }

    /// Set skin armour value
    pub fn set_skin_armour(&mut self, value: i16) {
        self.skin_armour = value;
        self.normalize_coverage();
    }

    /// Set vital parts value and revalidate coverage
    pub fn set_vital_parts(&mut self, value: i16) {
        self.vital_parts = value;
        self.normalize_coverage();
    }

    /// Set whether aircraft has radiators (enables radiator-dependent items)
    pub fn set_has_radiator(&mut self, has_rad: bool) {
        self.has_radiator = has_rad;
    }

    /// Set which visibility items can be used
    pub fn set_can_cutouts(&mut self, can_wings: bool, can_frame: bool) {
        self.can_visi_wings = can_wings;
        self.can_visi_frame = can_frame;

        // Disable visibility items that are no longer allowed
        for i in 0..self.visi_list.len() {
            let name = &self.visi_list[i].name;
            if name == "Wing Cutouts" && !can_wings {
                self.visi_sel[i] = false;
            } else if name == "Hull Cutouts" && !can_frame {
                self.visi_sel[i] = false;
            }
        }
    }
}
