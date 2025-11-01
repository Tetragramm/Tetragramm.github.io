use super::Stabilizers;

impl Stabilizers {
    /// Sets the horizontal stabilizer type
    pub fn set_hstab_type(&mut self, num: i16) {
        if num < 0 || num >= self.hstab_list.len() as i16 {
            return;
        }
        let num = num as usize;

        // Check if "The Wings" option can be used
        if self.hstab_list[num].name == "The Wings" && !(self.is_tandem || self.is_swept) {
            return;
        }

        // Handle V-tail transitions
        if self.hstab_list[num].is_vtail {
            self.set_vtail();
        } else if self.hstab_sel >= 0
            && (self.hstab_sel as usize) < self.hstab_list.len()
            && self.hstab_list[self.hstab_sel as usize].is_vtail
        {
            self.vstab_sel = 0;
            self.vstab_count = 1;
        }

        self.hstab_sel = num as i16;
        self.set_hstab_count(self.hstab_count);
    }

    /// Sets the horizontal stabilizer count
    pub fn set_hstab_count(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        num = (num as f64 + 1.0e-6).floor() as i16;
        self.hstab_count = num;

        if self.hstab_sel >= 0 && (self.hstab_sel as usize) < self.hstab_list.len() {
            let increment = self.hstab_list[self.hstab_sel as usize].increment;
            if increment != 0 {
                while (self.hstab_count % increment) != 0 {
                    self.hstab_count += 1;
                }
            } else {
                self.hstab_count = 0;
            }
        }
    }

    /// Sets the vertical stabilizer type
    pub fn set_vstab_type(&mut self, num: i16) {
        if num < 0 || num >= self.vstab_list.len() as i16 {
            return;
        }
        let num = num as usize;

        // Check if "Outboard" option can be used
        if self.vstab_list[num].name == "Outboard" && !self.can_v_outboard() {
            return;
        }

        // Handle V-tail transitions
        if self.vstab_list[num].is_vtail {
            self.set_vtail();
        } else if self.vstab_sel >= 0
            && (self.vstab_sel as usize) < self.vstab_list.len()
            && self.vstab_list[self.vstab_sel as usize].is_vtail
        {
            self.hstab_sel = 0;
            self.vstab_count = 1;
        }

        self.vstab_sel = num as i16;
        self.set_vstab_count(self.vstab_count);
    }

    /// Sets the vertical stabilizer count
    pub fn set_vstab_count(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        num = (num as f64 + 1.0e-6).floor() as i16;
        self.vstab_count = num;

        if self.vstab_sel >= 0 && (self.vstab_sel as usize) < self.vstab_list.len() {
            let increment = self.vstab_list[self.vstab_sel as usize].increment;
            if increment != 0 {
                while (self.vstab_count % increment) != 0 {
                    self.vstab_count += 1;
                }
            } else {
                self.vstab_count = 0;
            }
        }
    }

    /// Sets the engine count (affects control calculation)
    pub fn set_engine_count(&mut self, num: i16) {
        self.engine_count = num;
    }

    /// Sets whether the aircraft has a tandem wing configuration
    pub fn set_is_tandem(&mut self, is: bool) {
        self.is_tandem = is;
    }

    /// Sets whether the aircraft has swept wings
    pub fn set_is_swept(&mut self, is: bool) {
        self.is_swept = is;
    }

    /// Sets the lifting area (used in stability calculations)
    pub fn set_lifting_area(&mut self, num: f64) {
        self.lifting_area = num;
    }

    /// Sets whether the aircraft has a tail
    pub fn set_have_tail(&mut self, use_tail: bool) {
        self.have_tail = use_tail;
        if !use_tail {
            let hvalid = self.get_h_valid_list();
            if self.hstab_sel >= 0
                && (self.hstab_sel as usize) < hvalid.len()
                && !hvalid[self.hstab_sel as usize]
            {
                self.hstab_sel = 2;
            }
            let vvalid = self.get_v_valid_list();
            if self.vstab_sel >= 0
                && (self.vstab_sel as usize) < vvalid.len()
                && !vvalid[self.vstab_sel as usize]
            {
                if vvalid.len() > 1 && !vvalid[1] {
                    // If it was outboard, set it to canard so we can have outboard vstab
                    self.hstab_sel = 2;
                }
                self.vstab_sel = 1;
                if self.vstab_count % 2 != 0 {
                    self.vstab_count += 1;
                }
            }
        }
        if self.is_heli {
            if self.have_tail {
                self.hstab_sel = 0;
            } else {
                self.hstab_sel = 1;
            }
            self.hstab_count = 1;
        }
    }

    /// Sets whether this is a helicopter
    pub fn set_helicopter(&mut self, is: bool) {
        self.is_heli = is;
        if is {
            self.have_tail = true;
            self.is_tandem = false;
            self.is_swept = false;
            self.lifting_area = 0.0;
            self.engine_count = 0;
            self.hstab_sel = 0;
            self.hstab_count = 1;
            self.vstab_sel = 0;
            self.vstab_count = 1;
        }
    }

    /// Internal helper to set V-tail configuration
    pub(super) fn set_vtail(&mut self) {
        // Find and set V-tail for horizontal stabilizer
        for i in 0..self.hstab_list.len() {
            if self.hstab_list[i].is_vtail {
                self.hstab_sel = i as i16;
                break;
            }
        }
        // Find and set V-tail for vertical stabilizer
        for i in 0..self.vstab_list.len() {
            if self.vstab_list[i].is_vtail {
                self.vstab_sel = i as i16;
                break;
            }
        }
        self.hstab_count = 1;
        self.vstab_count = 0;
    }
}
