use super::*;

impl Munitions {
    /// Set rocket count
    /// TypeScript: SetRocketCount(count: number)
    pub fn set_rocket_count(&mut self, mut count: i16) {
        // Validate and floor the count
        if count < 0 || count != count {
            // NaN check
            count = 0;
        }

        self.rocket_count = count;
        self.limit_mass();
    }

    /// Set bomb count
    /// TypeScript: SetBombCount(count: number)
    pub fn set_bomb_count(&mut self, mut count: i16) {
        // Validate and floor the count
        if count < 0 || count != count {
            // NaN check
            count = 0;
        }

        self.bomb_count = count;
        self.limit_mass();
    }

    /// Set internal bay count
    /// TypeScript: SetBayCount(count: number)
    pub fn set_bay_count(&mut self, mut count: i16) {
        // Validate and floor the count
        if count < 0 || count != count {
            // NaN check
            count = 0;
        }

        self.internal_bay_count = count;
    }

    /// Set internal bay 1
    /// TypeScript: SetInternalBay1(bay1: boolean)
    pub fn set_internal_bay_1(&mut self, bay1: bool) {
        self.set_use_bays(bay1, self.internal_bay_2);
    }

    /// Set internal bay 2
    /// TypeScript: SetInternalBay2(bay2: boolean)
    pub fn set_internal_bay_2(&mut self, bay2: bool) {
        self.set_use_bays(self.internal_bay_1, bay2);
    }

    /// Set bay upgrade usage
    /// TypeScript: SetUseBays(bay1: boolean, bay2: boolean)
    ///
    /// Note: bay2 requires bay1, so if bay2 is true but bay1 is false,
    /// this automatically enables bay1 and disables bay2
    pub fn set_use_bays(&mut self, mut bay1: bool, mut bay2: bool) {
        // Enforce dependency: bay2 requires bay1
        if !bay1 && bay2 {
            bay1 = true;
            bay2 = false;
        }

        self.internal_bay_1 = bay1;
        self.internal_bay_2 = bay2;
    }

    /// Set aircraft parameters for munitions limits
    /// TypeScript: SetAcftParameters(struct: number, maxbomb: number, gull_deck: number)
    ///
    /// struct: aircraft structure
    /// maxbomb: maximum bomb multiplier
    /// gull_deck: wing deck position (affects gull_factor)
    ///   - 0,1 (Parasol/Shoulder): 1.0
    ///   - 2,3 (Mid/Low): 1.1
    ///   - 4 (Gear): 1.2
    pub fn set_acft_parameters(&mut self, acft_struct: f64, maxbomb: f64, gull_deck: i16) {
        self.acft_struct = acft_struct;
        self.maxbomb = maxbomb;

        self.gull_factor = match gull_deck {
            2 | 3 => 1.1, // Mid or Low
            4 => 1.2,     // Gear
            _ => 1.0,     // Parasol, Shoulder, or default
        };

        self.limit_mass();
    }
}
