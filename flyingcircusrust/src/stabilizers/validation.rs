use super::Stabilizers;

impl Stabilizers {
    /// Validates and corrects the horizontal stabilizer selection
    pub fn verify_hstab(&mut self) {
        if self.hstab_sel < 0 || self.hstab_sel >= self.hstab_list.len() as i16 {
            self.hstab_sel = 0;
        }

        let hvalid = self.get_h_valid_list();
        if self.hstab_sel >= 0
            && (self.hstab_sel as usize) < hvalid.len()
            && !hvalid[self.hstab_sel as usize]
        {
            self.hstab_sel = 0;
            if self.hstab_sel >= 0
                && (self.hstab_sel as usize) < hvalid.len()
                && !hvalid[self.hstab_sel as usize]
            {
                self.hstab_sel = 0;
                self.hstab_count = 0;
            }
        }
    }

    /// Validates and corrects the vertical stabilizer selection
    pub fn verify_vstab(&mut self) {
        if self.vstab_sel < 0 || self.vstab_sel >= self.vstab_list.len() as i16 {
            self.vstab_sel = 0;
        }

        let vvalid = self.get_v_valid_list();
        if self.vstab_sel >= 0
            && (self.vstab_sel as usize) < vvalid.len()
            && !vvalid[self.vstab_sel as usize]
        {
            self.vstab_sel = 0;
            if self.vstab_sel >= 0
                && (self.vstab_sel as usize) < vvalid.len()
                && !vvalid[self.vstab_sel as usize]
            {
                self.vstab_sel = 0;
                self.vstab_count = 0;
            }
        }
    }

    /// Validates and corrects both horizontal and vertical stabilizers
    pub fn verify(&mut self) {
        self.verify_hstab();
        self.verify_vstab();
    }
}
