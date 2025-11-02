use super::*;

impl LandingGear {
    /// Get the list of available gear types
    pub fn get_gear_list(&self) -> &Rc<Vec<GearEntry>> {
        &self.gear_list
    }

    /// Get the currently selected gear index
    pub fn get_gear(&self) -> usize {
        self.gear_sel
    }

    /// Get the localized name of the currently selected gear
    pub fn get_gear_name(&self) -> String {
        let gear_name = &self.gear_list[self.gear_sel].name;

        if self.retract && gear_name == "Boat Hull" {
            t!("Retractable Gear + Boat Hull").to_string()
        } else if self.retract {
            format!("{} {}", t!("Retractable"), t!(gear_name.as_str()))
        } else {
            t!(gear_name.as_str()).to_string()
        }
    }

    /// Check if gear selection is enabled (always true for UI)
    pub fn is_gear_enabled(&self) -> bool {
        true
    }

    /// Check which gear types can be used based on configuration
    /// Returns a vector of booleans indicating if each gear type is available
    pub fn can_gear(&self) -> Vec<bool> {
        self.gear_list
            .iter()
            .map(|g| {
                // Boat Hull requires can_boat flag
                if g.name == "Boat Hull" {
                    self.can_boat
                } else {
                    true
                }
            })
            .collect()
    }

    /// Check if retractable gear is enabled
    pub fn is_retract_enabled(&self) -> bool {
        self.can_retract()
    }

    /// Check if current gear can be retracted
    pub fn can_retract(&self) -> bool {
        let gear_name = &self.gear_list[self.gear_sel].name;
        self.gear_list[self.gear_sel].can_retract || gear_name == "Boat Hull"
    }

    /// Get the retract state
    pub fn get_retract(&self) -> bool {
        self.retract
    }

    /// Get the list of available extras
    pub fn get_extra_list(&self) -> &Rc<Vec<ExtraEntry>> {
        &self.extra_list
    }

    /// Get the extra selection array
    pub fn get_extra_selected(&self) -> &Vec<bool> {
        &self.extra_sel
    }

    /// Check if extra selection is enabled (always true for UI)
    pub fn is_extra_enabled(&self) -> bool {
        true
    }

    /// Check if this is a default configuration
    pub fn is_default(&self) -> bool {
        self.gear_sel == 0 && !self.retract && !self.extra_sel.iter().any(|&x| x)
    }
}
