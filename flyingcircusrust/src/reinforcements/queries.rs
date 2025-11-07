use super::*;

impl Reinforcements {
    /// Get list of external wood struts
    pub fn ext_wood_list(&self) -> &Rc<Vec<ExternalWoodEntry>> {
        &self.ext_wood_list
    }

    /// Get list of external steel struts
    pub fn ext_steel_list(&self) -> &Rc<Vec<ExternalSteelEntry>> {
        &self.ext_steel_list
    }

    /// Get list of cantilever options
    pub fn cant_list(&self) -> &Rc<Vec<CantileverEntry>> {
        &self.cant_list
    }

    /// Get list of cabane strut options
    pub fn cabane_list(&self) -> &Rc<Vec<CabaneEntry>> {
        &self.cabane_list
    }

    /// Get external wood strut counts
    pub fn ext_wood_count(&self) -> &Vec<i16> {
        &self.ext_wood_count
    }

    /// Get external steel strut counts
    pub fn ext_steel_count(&self) -> &Vec<i16> {
        &self.ext_steel_count
    }

    /// Get cantilever counts
    pub fn cant_count(&self) -> &Vec<i16> {
        &self.cant_count
    }

    /// Get total cantilever count
    pub fn total_cantilevers(&self) -> i16 {
        self.cant_count.iter().sum()
    }

    /// Check if any cantilevers are installed
    pub fn has_cantilevers(&self) -> bool {
        self.total_cantilevers() > 0
    }

    /// Get whether wing blades are enabled
    pub fn wing_blades(&self) -> bool {
        self.wing_blades
    }

    /// Get cantilever type: 0=none, 1=wood, 2=metal
    pub fn cant_type(&self) -> i16 {
        let wood_count = self.cant_count.get(0).copied().unwrap_or(0)
            + self.cant_count.get(4).copied().unwrap_or(0);
        let metal_count = self.cant_count.get(1).copied().unwrap_or(0)
            + self.cant_count.get(2).copied().unwrap_or(0)
            + self.cant_count.get(3).copied().unwrap_or(0);

        if metal_count > 0 {
            2
        } else if wood_count > 0 {
            1
        } else {
            0
        }
    }

    /// Check which external wood struts can be used
    pub fn can_use_ext_wood(&self) -> Vec<bool> {
        let mut can_use = vec![self.can_external; self.ext_wood_list.len()];

        for i in 0..self.ext_wood_list.len() {
            if self.acft_type == AircraftType::OrnithopterFlutter {
                can_use[i] = self.ext_wood_list[i].ornith;
            } else if self.limited_sqp {
                can_use[i] = self.ext_wood_list[i].small_sqp;
            }

            // Check wire requirement for wing truss
            if !self.wires {
                let name = &self.ext_wood_list[i].name;
                if name == "Wing Truss" || name == "Wire Root" {
                    can_use[i] = false;
                }
            }
        }

        can_use
    }

    /// Check which external steel struts can be used
    pub fn can_use_ext_steel(&self) -> Vec<bool> {
        let mut can_use = vec![self.can_external; self.ext_steel_list.len()];

        for i in 0..self.ext_steel_list.len() {
            if self.acft_type == AircraftType::OrnithopterFlutter {
                can_use[i] = self.ext_steel_list[i].ornith;
            } else if self.limited_sqp {
                can_use[i] = self.ext_steel_list[i].small_sqp;
            }

            // Check wire requirement for steel wing truss
            if !self.wires {
                let name = &self.ext_steel_list[i].name;
                if name == "Steel Wing Truss" || name == "Steel Wire Root" {
                    can_use[i] = false;
                }
            }
        }

        can_use
    }

    /// Check if wing blades are allowed (requires steel cantilever, no external struts, no cabane)
    pub fn can_use_wing_blades(&self) -> bool {
        // No external wood struts
        if self.ext_wood_count.iter().any(|&c| c > 0) {
            return false;
        }

        // No external steel struts
        if self.ext_steel_count.iter().any(|&c| c > 0) {
            return false;
        }

        // No cabane (sel == 0) and has steel cantilevers (index 2)
        self.cabane_sel == 0 && self.cant_count.get(2).copied().unwrap_or(0) > 0
    }

    // UIBindings requirement: enabled_fn for each array source
    pub fn is_ext_wood_enabled(&self) -> Vec<bool> {
        self.can_use_ext_wood()
    }

    pub fn is_ext_steel_enabled(&self) -> Vec<bool> {
        self.can_use_ext_steel()
    }

    pub fn is_cant_enabled(&self) -> Vec<bool> {
        vec![true; self.cant_list.len()]
    }

    pub fn is_wires_enabled(&self) -> bool {
        true
    }

    pub fn is_cabane_enabled(&self) -> bool {
        self.can_external
    }

    pub fn is_wing_blades_enabled(&self) -> bool {
        self.can_use_wing_blades()
    }
}
