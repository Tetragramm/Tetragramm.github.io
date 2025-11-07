use super::Stabilizers;

impl Stabilizers {
    /// Gets the horizontal stabilizer type index
    pub fn get_hstab_type(&self) -> usize {
        self.hstab_sel
    }

    /// Gets the horizontal stabilizer count
    pub fn get_hstab_count(&self) -> i16 {
        self.hstab_count
    }

    /// Gets the vertical stabilizer type index
    pub fn get_vstab_type(&self) -> usize {
        self.vstab_sel
    }

    /// Gets the vertical stabilizer count
    pub fn get_vstab_count(&self) -> i16 {
        self.vstab_count
    }

    /// Gets the horizontal stabilizer increment value
    pub fn get_hstab_increment(&self) -> i16 {
        if self.hstab_sel < self.hstab_list.len() {
            self.hstab_list[self.hstab_sel].increment
        } else {
            1
        }
    }

    /// Gets the vertical stabilizer increment value
    pub fn get_vstab_increment(&self) -> i16 {
        if self.vstab_sel < self.vstab_list.len() {
            self.vstab_list[self.vstab_sel].increment
        } else {
            1
        }
    }

    /// Returns whether the current horizontal stabilizer is a V-tail
    pub fn get_is_vtail(&self) -> bool {
        if self.hstab_sel < self.hstab_list.len() {
            self.hstab_list[self.hstab_sel].is_vtail
        } else {
            false
        }
    }

    /// Returns whether outboard vertical stabilizers can be used
    pub fn can_v_outboard(&self) -> bool {
        self.is_swept
            || self.is_tandem
            || (self.hstab_sel < self.hstab_list.len()
                && self.hstab_list[self.hstab_sel].is_canard
                && self.hstab_count > 0)
    }

    /// Returns whether the current vertical stabilizer is outboard
    pub fn get_v_outboard(&self) -> bool {
        if self.vstab_sel < self.vstab_list.len() {
            self.vstab_list[self.vstab_sel].name == "Outboard"
        } else {
            false
        }
    }

    /// Returns whether the current horizontal stabilizer is a canard
    pub fn get_canard(&self) -> bool {
        if self.hstab_sel < self.hstab_list.len() {
            self.hstab_list[self.hstab_sel].is_canard
        } else {
            false
        }
    }

    /// Returns whether this is in tandem configuration
    pub fn get_is_tandem(&self) -> bool {
        self.is_tandem
    }

    /// Returns list of valid horizontal stabilizer options
    pub fn get_h_valid_list(&self) -> Vec<bool> {
        let mut lst = Vec::new();
        if self.is_heli {
            lst = vec![false; self.hstab_list.len()];
            if self.have_tail && !lst.is_empty() {
                lst[0] = true;
            } else if lst.len() > 1 {
                lst[1] = true;
            }
        } else {
            for t in self.hstab_list.iter() {
                if (t.name == "The Wings" || t.name == "Outboard")
                    && !(self.is_tandem || self.is_swept)
                {
                    lst.push(false);
                } else if t.is_tail && !self.have_tail {
                    lst.push(false);
                } else {
                    lst.push(true);
                }
            }
        }
        lst
    }

    /// Returns list of valid vertical stabilizer options
    pub fn get_v_valid_list(&self) -> Vec<bool> {
        let mut lst = Vec::new();
        if self.is_heli {
            lst = vec![false; self.vstab_list.len()];
            if !lst.is_empty() {
                lst[0] = true;
            }
        } else {
            for t in self.vstab_list.iter() {
                if t.name == "Outboard" && !self.can_v_outboard() {
                    lst.push(false);
                } else if t.is_tail && !self.have_tail {
                    lst.push(false);
                } else {
                    lst.push(true);
                }
            }
        }
        lst
    }

    /// UI enabled function for horizontal stabilizer selection
    pub fn is_hstab_enabled(&self) -> bool {
        true
    }

    /// UI enabled function for horizontal stabilizer count
    pub fn is_hstab_count_enabled(&self) -> bool {
        true
    }

    /// UI enabled function for vertical stabilizer selection
    pub fn is_vstab_enabled(&self) -> bool {
        true
    }

    /// UI enabled function for vertical stabilizer count
    pub fn is_vstab_count_enabled(&self) -> bool {
        true
    }

    /// Check if this is in default configuration
    pub fn is_default(&self) -> bool {
        self.hstab_sel == 0 && self.hstab_count == 1 && self.vstab_sel == 0 && self.vstab_count == 1
    }
}
