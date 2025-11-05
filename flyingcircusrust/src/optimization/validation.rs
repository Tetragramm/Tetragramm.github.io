use super::*;

impl Optimization {
    /// Reduce allocated dots if they exceed free dots
    /// TypeScript: ReduceDots()
    ///
    /// Reduces allocations in priority order (drag first, cost last)
    /// until the total doesn't exceed free_dots
    pub(super) fn reduce_dots(&mut self) {
        let mut diff = -self.get_unassigned_count();
        if diff > 0 {
            // Reduce drag
            let d = diff.min(self.drag).max(0);
            self.drag -= d;
            diff -= d;

            // Reduce reliability
            let d = diff.min(self.reliability).max(0);
            self.reliability -= d;
            diff -= d;

            // Reduce maxstrain
            let d = diff.min(self.maxstrain).max(0);
            self.maxstrain -= d;
            diff -= d;

            // Reduce toughness
            let d = diff.min(self.toughness).max(0);
            self.toughness -= d;
            diff -= d;

            // Reduce mass
            let d = diff.min(self.mass).max(0);
            self.mass -= d;
            diff -= d;

            // Reduce escape
            let d = diff.min(self.escape).max(0);
            self.escape -= d;
            diff -= d;

            // Reduce bleed
            let d = diff.min(self.bleed).max(0);
            self.bleed -= d;
            diff -= d;

            // Reduce cost (last resort)
            let d = diff.min(self.cost).max(0);
            self.cost -= d;
        }
    }

    /// Verify all optimization values are valid
    pub fn verify_all(&mut self) {
        // Ensure all values are within bounds
        self.free_dots = self.free_dots.max(0);
        self.cost = self.cost.max(-3).min(3);
        self.bleed = self.bleed.max(-3).min(3);
        self.escape = self.escape.max(-3).min(3);
        self.mass = self.mass.max(-3).min(3);
        self.toughness = self.toughness.max(-3).min(3);
        self.maxstrain = self.maxstrain.max(-3).min(3);
        self.reliability = self.reliability.max(-3).min(3);
        self.drag = self.drag.max(-3).min(3);

        // Reduce if over-allocated
        self.reduce_dots();
    }
}
