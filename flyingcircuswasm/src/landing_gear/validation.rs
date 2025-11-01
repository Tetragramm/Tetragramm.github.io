use super::*;

impl LandingGear {
    /// Verify and fix gear selection if invalid
    pub fn verify_gear(&mut self) {
        // Ensure gear selection is within bounds
        if self.gear_sel >= self.gear_list.len() {
            self.gear_sel = 0;
        }

        // Check if selected gear is allowed
        let can_use = self.can_gear();
        if !can_use[self.gear_sel] {
            self.gear_sel = 0;
        }

        // Verify retract is valid for current gear
        if !self.can_retract() {
            self.retract = false;
        }
    }

    /// Verify and fix extra selections if invalid
    pub fn verify_extras(&mut self) {
        // Ensure extra_sel length matches extra_list
        if self.extra_sel.len() != self.extra_list.len() {
            self.extra_sel.resize(self.extra_list.len(), false);
        }
    }

    /// Verify all landing gear configuration
    pub fn verify_all(&mut self) {
        self.verify_gear();
        self.verify_extras();
    }
}
