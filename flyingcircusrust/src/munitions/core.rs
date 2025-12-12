use super::*;

impl Munitions {
    /// Creates a new Munitions instance
    pub fn new() -> Munitions {
        Munitions {
            bomb_count: 0,
            rocket_count: 0,
            internal_bay_count: 0,
            internal_bay_1: false,
            internal_bay_2: false,
            acft_struct: 0.0,
            maxbomb: 0.0,
            gull_factor: 1.0,
        }
    }
}
