use super::*;

impl Reinforcements {
    /// Set external wood strut count for a specific type
    pub fn set_ext_wood_count(&mut self, idx: usize, mut count: i16) {
        if idx >= self.ext_wood_list.len() {
            return;
        }

        if count < 0 {
            count = 0;
        }

        self.ext_wood_count[idx] = count;
    }

    /// Set external steel strut count for a specific type
    pub fn set_ext_steel_count(&mut self, idx: usize, mut count: i16) {
        if idx >= self.ext_steel_list.len() {
            return;
        }

        if count < 0 {
            count = 0;
        }

        self.ext_steel_count[idx] = count;
    }

    /// Set cantilever count for a specific type with structure limit enforcement
    pub fn set_cant_count(&mut self, idx: usize, mut count: i16) {
        if idx >= self.cant_list.len() {
            return;
        }

        if count < 0 {
            count = 0;
        }

        // Apply structure limits for limited cantilevers
        if self.cant_list[idx].limited && count > 0 {
            let available = self.available_structure();
            let cant_mass = self.cant_list[idx].stats.mass;

            if cant_mass > 0.0 {
                let diff = count - self.cant_count[idx];
                let max_diff = (available as f32 / (5.0 * cant_mass)) as i16;
                count = self.cant_count[idx] + diff.min(max_diff).max(0);
            }
        }

        self.cant_count[idx] = count;
    }

    /// Set whether wires are enabled
    pub fn set_wires(&mut self, enabled: bool) {
        self.wires = enabled;
    }

    /// Set selected cabane strut type
    pub fn set_cabane(&mut self, idx: usize) {
        if idx < self.cabane_list.len() {
            self.cabane_sel = idx;
        }
    }

    /// Set whether wing blades are enabled
    pub fn set_wing_blades(&mut self, enabled: bool) {
        if enabled && !self.can_use_wing_blades() {
            return;
        }
        self.wing_blades = enabled;
    }

    // Internal state setters (called by Aircraft)

    /// Set whether the wing configuration is staggered
    pub fn set_staggered(&mut self, is_staggered: bool) {
        self.is_staggered = is_staggered;
    }

    /// Set whether the wing configuration is tandem
    pub fn set_tandem(&mut self, is_tandem: bool) {
        self.is_tandem = is_tandem;
    }

    /// Set whether the aircraft is a monoplane
    pub fn set_monoplane(&mut self, is_monoplane: bool) {
        self.is_monoplane = is_monoplane;
    }

    /// Set whether external reinforcements are allowed
    pub fn set_can_external(&mut self, can_external: bool) {
        self.can_external = can_external;

        if !can_external {
            // Clear external struts if no longer allowed
            for count in &mut self.ext_wood_count {
                *count = 0;
            }
            for count in &mut self.ext_steel_count {
                *count = 0;
            }
            self.cabane_sel = 0;
            self.wires = false;
        }
    }

    /// Set the aircraft's base structure value
    pub fn set_acft_structure(&mut self, struct_val: i16) {
        let old_struct = self.acft_structure;
        self.acft_structure = struct_val;

        // If structure decreased, revalidate cantilever limits
        if old_struct > self.acft_structure {
            self.verify_cant_limits();
        }
    }

    /// Set the cantilever lift reduction value
    pub fn set_cant_lift(&mut self, lift: i16) {
        self.cant_lift = lift;
    }

    /// Set the aircraft type and apply constraints
    pub fn set_aircraft_type(&mut self, acft_type: AircraftType) {
        self.acft_type = acft_type;
        self.resolve_for_aircraft_type();
    }

    /// Set sesquiplane configuration
    pub fn set_sesquiplane(&mut self, is_sesquiplane: bool, is_small_sesquiplane: bool) {
        self.resolve_for_sesquiplane(is_sesquiplane, is_small_sesquiplane);
    }
}
