use super::*;

impl Optimization {
    /// Creates a new Optimization instance with default values
    pub fn new() -> Self {
        Optimization {
            free_dots: 0,
            cost: 0,
            bleed: 0,
            escape: 0,
            mass: 0,
            toughness: 0,
            maxstrain: 0,
            reliability: 0,
            drag: 0,
            acft_stats: Stats::new(),
            final_ms: 0.0,
        }
    }
}
