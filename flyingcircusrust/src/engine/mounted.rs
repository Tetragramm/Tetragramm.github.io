use super::Engine;

impl Engine {
    pub fn can_cowl(&self, num: usize) -> bool {
        if num >= self.cowl_list.len() {
            return false;
        }

        let cowl = &self.cowl_list[num];
        let is_valid = if self.get_is_pulsejet() || self.get_is_turbine() {
            // Only "no cowl" allowed (all three flags true)
            cowl.for_air_cooled && cowl.for_rotary && cowl.for_liquid_cooled
        } else if self.need_cooling() {
            cowl.for_liquid_cooled
        } else if self.is_rotary() {
            cowl.for_rotary
        } else {
            cowl.for_air_cooled
        };
        is_valid
    }
    pub fn verify_cowl(&mut self, num: usize) {
        let is_valid = self.can_cowl(num);

        if is_valid {
            self.cowl_sel = num;
        } else {
            // Find first valid cowl (usually index 0)
            for (i, c) in self.cowl_list.iter().enumerate() {
                let valid = if self.get_is_pulsejet() || self.get_is_turbine() {
                    c.for_air_cooled && c.for_rotary && c.for_liquid_cooled
                } else if self.need_cooling() {
                    c.for_liquid_cooled
                } else if self.is_rotary() {
                    c.for_rotary
                } else {
                    c.for_air_cooled
                };

                if valid {
                    self.cowl_sel = i;
                    break;
                }
            }
        }
    }

    pub fn is_cowl_opt_enabled(&self) -> Vec<bool> {
        (0..self.cowl_list.len())
            .map(|n| self.can_cowl(n))
            .collect()
    }

    /// Set cowl with validation
    /// TypeScript: SetCowl(num: number)
    pub fn set_cowl(&mut self, num: usize) {
        self.verify_cowl(num);
    }
}
