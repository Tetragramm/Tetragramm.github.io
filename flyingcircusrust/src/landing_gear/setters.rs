use super::*;

impl LandingGear {
    /// Set the selected gear type
    pub fn set_gear(&mut self, index: usize) {
        // Only set if valid and allowed
        if index < self.gear_list.len() && self.can_gear()[index] {
            self.gear_sel = index;
        }
        // Validate retract after gear change
        if !self.can_retract() {
            self.retract = false;
        }
    }

    /// Set retractable gear option
    pub fn set_retract(&mut self, is_retract: bool) {
        self.retract = is_retract && self.can_retract();
    }

    /// Set extra accessory selection
    pub fn set_extra_selected(&mut self, index: usize, selected: bool) {
        if index < self.extra_sel.len() {
            self.extra_sel[index] = selected;
        }
    }

    /// Set loaded mass (called by aircraft stats calculation)
    pub fn set_loaded_mass(&mut self, mass: f32) {
        self.loaded_mass = mass;
    }

    /// Set gull wing deck position (0=none, 1=shoulder, 2=mid, 3=low, 4=gear)
    pub fn set_gull_deck(&mut self, deck: i16) {
        self.gull_deck = deck;
    }

    /// Determine if boat hull can be used based on engine and wing height
    /// Called by aircraft to set the can_boat flag
    pub fn set_can_boat(&mut self, engine_height: i16, wing_height: i16) {
        self.can_boat = if engine_height == 2 {
            true
        } else if engine_height == 1 && wing_height >= 2 {
            true
        } else if engine_height == 0 && wing_height >= 3 {
            true
        } else {
            false
        };
    }
}
