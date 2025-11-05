use super::*;

impl Optimization {
    /// Set number of free optimization dots
    /// TypeScript: SetFreeDots(num)
    pub fn set_free_dots(&mut self, mut num: i16) {
        // Clamp to valid range
        num = num.max(0);
        num = (num as f32 + 1e-6).floor() as i16;
        self.free_dots = num;
        self.reduce_dots();
    }

    /// Set cost optimization allocation (-3 to +3)
    /// TypeScript: SetCost(num)
    pub fn set_cost(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.cost = num;
        self.reduce_dots();
    }

    /// Set bleed optimization allocation (-3 to +3)
    /// TypeScript: SetBleed(num)
    pub fn set_bleed(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.bleed = num;
        self.reduce_dots();
    }

    /// Set escape optimization allocation (-3 to +3)
    /// TypeScript: SetEscape(num)
    pub fn set_escape(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.escape = num;
        self.reduce_dots();
    }

    /// Set mass optimization allocation (-3 to +3)
    /// TypeScript: SetMass(num)
    pub fn set_mass(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.mass = num;
        self.reduce_dots();
    }

    /// Set toughness optimization allocation (-3 to +3)
    /// TypeScript: SetToughness(num)
    pub fn set_toughness(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.toughness = num;
        self.reduce_dots();
    }

    /// Set maxstrain optimization allocation (-3 to +3)
    /// TypeScript: SetMaxStrain(num)
    pub fn set_maxstrain(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.maxstrain = num;
        self.reduce_dots();
    }

    /// Set reliability optimization allocation (-3 to +3)
    /// TypeScript: SetReliability(num)
    pub fn set_reliability(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.reliability = num;
        self.reduce_dots();
    }

    /// Set drag optimization allocation (-3 to +3)
    /// TypeScript: SetDrag(num)
    pub fn set_drag(&mut self, mut num: i16) {
        num = (num as f32 + 1e-6).floor() as i16;
        num = num.max(-3).min(3);
        self.drag = num;
        self.reduce_dots();
    }

    /// Set aircraft stats (used for optimization calculations)
    /// TypeScript: SetAcftStats(stats)
    pub fn set_acft_stats(&mut self, stats: &Stats) {
        self.acft_stats = stats.clone();
    }
}
