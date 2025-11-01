use super::*;

impl Reinforcements {
    /// Verify cabane selection is valid
    pub fn verify_cabane(&mut self) {
        if self.cabane_sel < 0 || self.cabane_sel as usize >= self.cabane_list.len() {
            self.cabane_sel = 0;
        }
    }

    /// Verify all strut counts are valid and within bounds
    pub fn verify_struts(&mut self) {
        // Verify and clamp external wood counts
        for i in 0..self.ext_wood_count.len() {
            if self.ext_wood_count[i] < 0 {
                self.ext_wood_count[i] = 0;
            }
        }

        // Verify and clamp external steel counts
        for i in 0..self.ext_steel_count.len() {
            if self.ext_steel_count[i] < 0 {
                self.ext_steel_count[i] = 0;
            }
        }

        // Verify and clamp cantilever counts
        for i in 0..self.cant_count.len() {
            if self.cant_count[i] < 0 {
                self.cant_count[i] = 0;
            }
        }
    }

    /// Verify cantilever count respects structure limits
    pub fn verify_cant_limits(&mut self) {
        for i in 0..self.cant_list.len() {
            if self.cant_list[i].limited && self.cant_count[i] > 0 {
                let available_structure = self.available_structure();
                let cant_mass = self.cant_list[i].stats.mass;

                if cant_mass > 0.0 {
                    let max_allowed = (available_structure as f64 / (5.0 * cant_mass)) as i16;
                    if self.cant_count[i] > max_allowed {
                        self.cant_count[i] = max_allowed;
                    }
                }
            }
        }
    }

    /// Calculate available structure for limited cantilevers
    pub(super) fn available_structure(&self) -> i16 {
        let mut total: f64 = self.acft_structure as f64;
        total += self.cabane_list[self.cabane_sel as usize].stats.structure;

        // Add external wood strut structure
        for i in 0..self.ext_wood_count.len() {
            total += self.ext_wood_count[i] as f64 * self.ext_wood_list[i].stats.structure;
            if i < self.ext_steel_count.len() {
                total += self.ext_steel_count[i] as f64 * self.ext_steel_list[i].stats.structure;
            }
        }

        // Add structure bonus if any external struts exist
        let has_external = self.ext_wood_count.iter().any(|&c| c > 0)
            || self.ext_steel_count.iter().any(|&c| c > 0);
        if has_external {
            total += 5.0;
        }

        // Subtract existing limited cantilevers
        for i in 0..self.cant_list.len() {
            if self.cant_list[i].limited {
                total -= 5.0 * self.cant_count[i] as f64 * self.cant_list[i].stats.mass;
            }
        }

        total as i16
    }

    /// Auto-fix configuration for aircraft type constraints
    pub fn resolve_for_aircraft_type(&mut self) {
        match self.acft_type {
            AircraftType::Helicopter
            | AircraftType::OrnithopterBuzzer
            | AircraftType::OrnithopterFlutter => {
                self.cabane_sel = 0;
            }
            _ => {}
        }

        // Remove incompatible external struts
        let can_wood = self.can_use_ext_wood();
        for i in 0..self.ext_wood_count.len() {
            if !can_wood[i] {
                self.ext_wood_count[i] = 0;
            }
        }

        let can_steel = self.can_use_ext_steel();
        for i in 0..self.ext_steel_count.len() {
            if !can_steel[i] {
                self.ext_steel_count[i] = 0;
            }
        }

        // Disable wing blades if no longer allowed
        if !self.can_use_wing_blades() {
            self.wing_blades = false;
        }
    }

    /// Auto-fix for sesquiplane configuration
    pub fn resolve_for_sesquiplane(&mut self, is_sesquiplane: bool, is_small_sesquiplane: bool) {
        self.tension_sqp = is_sesquiplane && is_small_sesquiplane;
        self.limited_sqp = is_sesquiplane && !is_small_sesquiplane;

        if self.limited_sqp {
            // Remove incompatible struts for small sesquiplanes
            for i in 0..self.ext_wood_list.len() {
                if !self.ext_wood_list[i].small_sqp {
                    self.ext_wood_count[i] = 0;
                }
            }

            for i in 0..self.ext_steel_list.len() {
                if !self.ext_steel_list[i].small_sqp {
                    self.ext_steel_count[i] = 0;
                }
            }
        }
    }
}
