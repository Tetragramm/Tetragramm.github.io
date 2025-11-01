use super::*;

impl ControlSurfaces {
    /// Get the list of aileron options
    pub fn get_aileron_list(&self) -> &[AileronEntry] {
        &self.aileron_list
    }

    /// Get the currently selected aileron index
    pub fn get_aileron(&self) -> i16 {
        self.aileron_sel
    }

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

    /// Get the list of rudder options
    pub fn get_rudder_list(&self) -> &[RudderEntry] {
        &self.rudder_list
    }

    /// Get the currently selected rudder index
    pub fn get_rudder(&self) -> i16 {
        self.rudder_sel
    }

    /// Check if rudder is enabled
    pub fn can_rudder(&self) -> bool {
        self.can_rudder
    }

    /// Get the list of elevator options
    pub fn get_elevator_list(&self) -> &[ElevatorEntry] {
        &self.elevator_list
    }

    /// Get the currently selected elevator index
    pub fn get_elevator(&self) -> i16 {
        self.elevator_sel
    }

    /// Check if elevator is enabled
    pub fn can_elevator(&self) -> bool {
        self.can_elevator
    }

    /// Get the list of flaps options
    pub fn get_flaps_list(&self) -> &[FlapsEntry] {
        &self.flaps_list
    }

    /// Get the currently selected flaps index
    pub fn get_flaps(&self) -> i16 {
        self.flaps_sel
    }

    /// Calculate flap cost based on MP (maneuver points)
    pub fn get_flap_cost(&self, dry_mp: i16) -> f64 {
        let idx = self.flaps_sel as usize;
        if idx < self.flaps_list.len() {
            let costfactor = self.flaps_list[idx].costfactor;
            if costfactor > 0.0 {
                (1.0e-6 + costfactor * dry_mp as f64).floor().max(1.0)
            } else {
                0.0
            }
        } else {
            0.0
        }
    }

    /// Get the list of slats options
    pub fn get_slats_list(&self) -> &[SlatsEntry] {
        &self.slats_list
    }

    /// Get the currently selected slats index
    pub fn get_slats(&self) -> i16 {
        self.slats_sel
    }

    /// Get the list of drag inducer options
    pub fn get_drag_list(&self) -> &[DragInducerEntry] {
        &self.drag_list
    }

    /// Get the drag inducer selection array
    pub fn get_drag(&self) -> &[bool] {
        &self.drag_sel
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

    // UIBindings required enabled_fn methods

    /// Check if aileron control is enabled
    pub fn is_aileron_enabled(&self) -> bool {
        self.acft_type != AircraftType::Helicopter
    }

    /// Check if rudder control is enabled
    pub fn is_rudder_enabled(&self) -> bool {
        self.can_rudder && self.acft_type != AircraftType::Helicopter
    }

    /// Check if elevator control is enabled
    pub fn is_elevator_enabled(&self) -> bool {
        self.can_elevator && self.acft_type != AircraftType::Helicopter
    }

    /// Check if flaps control is enabled
    pub fn is_flaps_enabled(&self) -> bool {
        self.acft_type != AircraftType::Helicopter
    }

    /// Check if slats control is enabled
    pub fn is_slats_enabled(&self) -> bool {
        self.acft_type != AircraftType::Helicopter
    }

    /// Check if drag inducer control is enabled
    pub fn is_drag_enabled(&self) -> bool {
        self.acft_type != AircraftType::Helicopter
    }
}
