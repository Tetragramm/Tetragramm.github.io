use super::*;

impl Fuel {
    /// Verify tank configuration and enforce constraints
    /// TypeScript: VerifyOK()
    ///
    /// Returns true if modifications were made
    ///
    /// Enforces:
    /// - Cantilever tanks limited to wing_area / 10 (if cantilever wings)
    /// - Microtanks (wetmass == 0) limited to 4 total
    pub(super) fn verify_ok(&mut self) -> bool {
        if self.wing_area < 0.0 {
            return false;
        }

        let mut modified = false;

        // Count cantilever dependent tanks
        let ccount = self.count_cantilever_tanks();

        // How many cantilever tanks are allowed?
        let mut allowed = (self.wing_area / 10.0).floor() as i16;
        if !self.is_cantilever {
            allowed = 0;
        }

        // Do you have more than allowed?
        let mut diff = ccount - allowed;
        if diff > 0 {
            modified = true;
        }

        // Loop over and reduce by one until you don't exceed limit
        while diff > 0 {
            // Iterate backwards through tank types
            for i in (0..self.tank_count.len()).rev() {
                if self.tank_list[i].cantilever && self.tank_count[i] > 0 {
                    self.tank_count[i] -= 1;
                    diff -= 1;
                    break;
                }
            }
        }

        // Limit microtanks to 4
        for i in 0..self.tank_count.len() {
            if self.tank_list[i].stats.wetmass == 0.0 {
                if self.tank_count[i] > 4 {
                    self.tank_count[i] = 4;
                    modified = true;
                }
            }
        }

        modified
    }
}
