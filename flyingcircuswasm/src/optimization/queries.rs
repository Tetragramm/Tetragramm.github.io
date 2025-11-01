use super::*;

impl Optimization {
    /// Get number of free optimization dots
    pub fn get_free_dots(&self) -> i16 {
        self.free_dots
    }

    /// Check if free dots control is enabled (always true)
    pub fn is_free_dots_enabled(&self) -> bool {
        true
    }

    /// Get cost optimization allocation
    pub fn get_cost(&self) -> i16 {
        self.cost
    }

    /// Check if cost control is enabled (always true)
    pub fn is_cost_enabled(&self) -> bool {
        true
    }

    /// Get bleed optimization allocation
    pub fn get_bleed(&self) -> i16 {
        self.bleed
    }

    /// Check if bleed control is enabled (always true)
    pub fn is_bleed_enabled(&self) -> bool {
        true
    }

    /// Get escape optimization allocation
    pub fn get_escape(&self) -> i16 {
        self.escape
    }

    /// Check if escape control is enabled (always true)
    pub fn is_escape_enabled(&self) -> bool {
        true
    }

    /// Get mass optimization allocation
    pub fn get_mass(&self) -> i16 {
        self.mass
    }

    /// Check if mass control is enabled (always true)
    pub fn is_mass_enabled(&self) -> bool {
        true
    }

    /// Get toughness optimization allocation
    pub fn get_toughness(&self) -> i16 {
        self.toughness
    }

    /// Check if toughness control is enabled (always true)
    pub fn is_toughness_enabled(&self) -> bool {
        true
    }

    /// Get maxstrain optimization allocation
    pub fn get_maxstrain(&self) -> i16 {
        self.maxstrain
    }

    /// Check if maxstrain control is enabled (always true)
    pub fn is_maxstrain_enabled(&self) -> bool {
        true
    }

    /// Get reliability optimization allocation
    /// TypeScript: GetReliabiilty() [sic - note typo in original]
    pub fn get_reliability(&self) -> i16 {
        self.reliability
    }

    /// Check if reliability control is enabled (always true)
    pub fn is_reliability_enabled(&self) -> bool {
        true
    }

    /// Get drag optimization allocation
    pub fn get_drag(&self) -> i16 {
        self.drag
    }

    /// Check if drag control is enabled (always true)
    pub fn is_drag_enabled(&self) -> bool {
        true
    }

    /// Get number of unassigned dots
    /// TypeScript: GetUnassignedCount()
    pub fn get_unassigned_count(&self) -> i16 {
        self.free_dots
            - self.cost
            - self.bleed
            - self.escape
            - self.mass
            - self.toughness
            - self.maxstrain
            - self.reliability
            - self.drag
    }

    /// Check if this is a default configuration
    /// TypeScript: IsDefault()
    pub fn is_default(&self) -> bool {
        self.free_dots == 0
            && self.cost == 0
            && self.bleed == 0
            && self.escape == 0
            && self.mass == 0
            && self.toughness == 0
            && self.maxstrain == 0
            && self.reliability == 0
            && self.drag == 0
    }
}
