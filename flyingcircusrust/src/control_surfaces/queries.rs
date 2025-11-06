use super::*;

impl ControlSurfaces {
    /// Check which ailerons are available for the current aircraft configuration
    pub fn can_aileron(&self) -> Vec<bool> {
        let mut can = Vec::new();
        if !self.acft_type.is_any_ornithopter() {
            for a in self.aileron_list.iter() {
                // Warping requires wing area (can't use with cantilever wings)
                if a.warping && self.wing_area == 0 {
                    can.push(false);
                } else {
                    can.push(true);
                }
            }
        } else {
            // Ornithopters can only use warping ailerons
            for a in self.aileron_list.iter() {
                can.push(a.warping);
            }
        }
        can
    }

    /// Check if rudder is enabled
    pub fn can_rudder(&self) -> bool {
        self.can_rudder
    }

    /// Check if elevator is enabled
    pub fn can_elevator(&self) -> bool {
        self.can_elevator
    }

    /// Calculate flap cost based on MP (maneuver points)
    pub fn get_flap_cost(&self, dry_mp: i16) -> f32 {
        let idx = self.flaps_sel as usize;
        if idx < self.flaps_list.len() {
            let costfactor = self.flaps_list[idx].costfactor;
            if costfactor > 0.0 {
                (1.0e-6 + costfactor * dry_mp as f32).floor().max(1.0)
            } else {
                0.0
            }
        } else {
            0.0
        }
    }

    /// Check if control surfaces are in default state
    pub fn is_default(&self) -> bool {
        self.aileron_sel == 0
            && self.rudder_sel == 0
            && self.elevator_sel == 0
            && self.flaps_sel == 0
            && self.slats_sel == 0
            && !self.drag_sel.iter().any(|&x| x) // All false
    }
}
