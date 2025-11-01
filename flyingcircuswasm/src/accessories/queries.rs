use super::*;

impl Accessories {
    /// Get electrical equipment list
    pub fn electrical_list(&self) -> &Rc<Vec<ElectricalEntry>> {
        &self.electrical_list
    }

    /// Get radio list
    pub fn radio_list(&self) -> &Rc<Vec<RadioEntry>> {
        &self.radio_list
    }

    /// Get reconnaissance list
    pub fn recon_list(&self) -> &Rc<Vec<ReconEntry>> {
        &self.recon_list
    }

    /// Get visibility list
    pub fn visi_list(&self) -> &Rc<Vec<VisibilityEntry>> {
        &self.visi_list
    }

    /// Get climate control list
    pub fn climate_list(&self) -> &Rc<Vec<ClimateEntry>> {
        &self.climate_list
    }

    /// Get autopilot list
    pub fn autopilot_list(&self) -> &Rc<Vec<AutopilotEntry>> {
        &self.autopilot_list
    }

    /// Get control system list
    pub fn control_list(&self) -> &Rc<Vec<ControlEntry>> {
        &self.control_list
    }

    /// Get armour coverage array
    pub fn armour_coverage(&self) -> &Vec<i16> {
        &self.armour_coverage
    }

    /// Get armour coverage for display (includes skin armour)
    pub fn armour_coverage_for_display(&self) -> Vec<i16> {
        let mut arr = self.armour_coverage.clone();
        if arr.len() > 1 {
            arr[1] += self.skin_armour;
        }
        arr
    }

    /// Get effective coverage (cumulative with vital parts adjustment)
    pub fn effective_coverage(&self) -> Vec<i16> {
        let mut arr = self.armour_coverage_for_display();
        let vital_adj = ((self.vital_parts - 8) / 2).max(0);

        // Make cumulative from back to front
        let mut sum = 0;
        for i in (0..arr.len()).rev() {
            sum += arr[i];
            arr[i] = (sum - vital_adj).max(0);
        }
        arr
    }

    /// Get electrical equipment counts
    pub fn electrical_count(&self) -> &Vec<i16> {
        &self.electrical_count
    }

    /// Get selected radio index
    pub fn radio_sel(&self) -> i16 {
        self.radio_sel
    }

    /// Get radio communication name
    pub fn communication_name(&self) -> String {
        let idx = self.radio_sel as usize;
        if idx < self.radio_list.len() {
            self.radio_list[idx].name.clone()
        } else {
            String::new()
        }
    }

    /// Get reconnaissance selection counts
    pub fn recon_sel(&self) -> &Vec<i16> {
        &self.recon_sel
    }

    /// Get visibility equipment toggles
    pub fn visi_sel(&self) -> &Vec<bool> {
        &self.visi_sel
    }

    /// Get which visibility items can be used
    pub fn can_visi(&self) -> Vec<bool> {
        let mut can_use = vec![true; self.visi_list.len()];
        for i in 0..self.visi_list.len() {
            let name = &self.visi_list[i].name;
            if name == "Wing Cutouts" {
                can_use[i] = self.can_visi_wings;
            } else if name == "Hull Cutouts" {
                can_use[i] = self.can_visi_frame;
            }
            if !can_use[i] {
                // Disable if not allowed
            }
        }
        can_use
    }

    /// Get climate control selection
    pub fn clim_sel(&self) -> &Vec<bool> {
        &self.clim_sel
    }

    /// Get which climate items can be enabled
    pub fn climate_enabled(&self) -> Vec<bool> {
        self.climate_list
            .iter()
            .map(|item| !item.req_radiator || self.has_radiator)
            .collect()
    }

    /// Get selected autopilot index
    pub fn auto_sel(&self) -> i16 {
        self.auto_sel
    }

    /// Get selected control system index
    pub fn cont_sel(&self) -> i16 {
        self.cont_sel
    }

    /// Get max mass stress from selected control system
    pub fn max_mass_stress(&self) -> i16 {
        let idx = self.cont_sel as usize;
        if idx < self.control_list.len() {
            self.control_list[idx].max_mass_stress
        } else {
            0
        }
    }

    /// Get max total stress from selected control system
    pub fn max_total_stress(&self) -> i16 {
        let idx = self.cont_sel as usize;
        if idx < self.control_list.len() {
            self.control_list[idx].max_total_stress
        } else {
            0
        }
    }

    /// Check if any electrical items are in use
    pub fn has_electrics(&self) -> bool {
        // Check electrical equipment
        if self.electrical_count.iter().any(|&c| c > 0) {
            return true;
        }

        // Check climate with charge
        for i in 0..self.clim_sel.len() {
            if self.clim_sel[i] && self.climate_list[i].stats.charge != 0.0 {
                return true;
            }
        }

        // Check visibility with charge
        for i in 0..self.visi_sel.len() {
            if self.visi_sel[i] && self.visi_list[i].stats.charge != 0.0 {
                return true;
            }
        }

        // Check radio
        let radio_idx = self.radio_sel as usize;
        if radio_idx < self.radio_list.len() && self.radio_list[radio_idx].stats.charge != 0.0 {
            return true;
        }

        // Check autopilot
        let auto_idx = self.auto_sel as usize;
        if auto_idx < self.autopilot_list.len() && self.autopilot_list[auto_idx].stats.charge != 0.0 {
            return true;
        }

        false
    }

    /// Get battery storage capacity
    pub fn get_storage(&self) -> i16 {
        let mut storage = 0;
        for i in 0..self.electrical_count.len() {
            if i < self.electrical_list.len() {
                storage += self.electrical_count[i] * self.electrical_list[i].storage;
            }
        }
        storage
    }

    /// Get windmill power generation
    pub fn get_windmill(&self) -> f64 {
        let mut production = 0.0;
        for i in 0..self.electrical_count.len() {
            if i < self.electrical_list.len() {
                production += self.electrical_list[i].cp10s * self.electrical_count[i] as f64;
            }
        }
        production
    }
}
