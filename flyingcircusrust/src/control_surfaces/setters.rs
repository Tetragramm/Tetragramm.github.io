use super::*;

impl ControlSurfaces {
    /// Set aileron selection (UIBindings compatible - single parameter)
    pub fn set_aileron(&mut self, sel: i16) {
        if sel >= 0 && (sel as usize) < self.aileron_list.len() {
            self.aileron_sel = sel;
        }
    }

    /// Set rudder selection (UIBindings compatible - single parameter)
    pub fn set_rudder(&mut self, sel: i16) {
        if sel >= 0 && (sel as usize) < self.rudder_list.len() {
            self.rudder_sel = sel;
        }
    }

    /// Set elevator selection (UIBindings compatible - single parameter)
    pub fn set_elevator(&mut self, sel: i16) {
        if sel >= 0 && (sel as usize) < self.elevator_list.len() {
            self.elevator_sel = sel;
        }
    }

    /// Set flaps selection (UIBindings compatible - single parameter)
    pub fn set_flaps(&mut self, sel: i16) {
        if sel >= 0 && (sel as usize) < self.flaps_list.len() {
            self.flaps_sel = sel;
        }
    }

    /// Set slats selection (UIBindings compatible - single parameter)
    pub fn set_slats(&mut self, sel: i16) {
        if sel >= 0 && (sel as usize) < self.slats_list.len() {
            self.slats_sel = sel;
        }
    }

    /// Set drag inducer selection for specific index
    /// Note: UIBindings array handling - this is called for each element
    pub fn set_drag(&mut self, index: i16, value: bool) {
        if index >= 0 && (index as usize) < self.drag_sel.len() {
            self.drag_sel[index as usize] = value;
        }
    }

    /// Set whether rudder is available
    pub fn set_can_rudder(&mut self, can: bool) {
        self.can_rudder = can;
        if !can {
            self.rudder_sel = 0;
        }
    }

    /// Set whether elevator is available
    pub fn set_can_elevator(&mut self, can: bool) {
        self.can_elevator = can;
        if !can {
            self.elevator_sel = 0;
        }
    }

    /// Set number of cantilever wings
    pub fn set_num_cantilever(&mut self, count: i16) {
        self.num_cantilever = count;
    }

    /// Set wing span
    pub fn set_span(&mut self, span: i16) {
        self.span = span;
    }

    /// Set wing area
    pub fn set_wing_area(&mut self, area: i16) {
        self.wing_area = area;
    }

    /// Set whether aircraft has boom tail
    pub fn set_boom_tail(&mut self, has_boom: bool) {
        self.is_boom = has_boom;
    }

    /// Set aircraft type and adjust control surfaces accordingly
    pub fn set_acft_type(&mut self, acft_type: AircraftType) {
        self.acft_type = acft_type;

        if acft_type == AircraftType::Helicopter {
            // Helicopters don't have any of these control surfaces
            self.aileron_sel = 0;
            self.rudder_sel = 0;
            self.elevator_sel = 0;
            self.flaps_sel = 0;
            self.slats_sel = 0;
            for i in 0..self.drag_sel.len() {
                self.drag_sel[i] = false;
            }
            self.span = 0;
            self.num_cantilever = 0;
            self.wing_area = 0;
        } else if acft_type.is_any_ornithopter() {
            // Ornithopters can only use warping ailerons
            let can = self.can_aileron();
            if let Some(index) = can.iter().position(|&x| x) {
                self.aileron_sel = index as i16;
            }
            self.num_cantilever = 0;
        }
    }

    /// Set V-tail configuration (synchronizes rudder and elevator)
    pub fn set_is_vtail(&mut self, is_vtail: bool) {
        if is_vtail {
            self.rudder_sel = self.elevator_sel;
        }
    }
}
