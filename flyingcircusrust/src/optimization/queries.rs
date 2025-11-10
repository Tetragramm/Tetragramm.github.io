use super::*;

impl Optimization {
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
