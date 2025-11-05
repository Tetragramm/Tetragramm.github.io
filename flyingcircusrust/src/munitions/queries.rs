use super::*;

impl Munitions {
    /// Get rocket count
    /// TypeScript: GetRocketCount()
    pub fn get_rocket_count(&self) -> i16 {
        self.rocket_count
    }

    /// Get bomb count
    /// TypeScript: GetBombCount()
    pub fn get_bomb_count(&self) -> i16 {
        self.bomb_count
    }

    /// Get internal bomb bay count
    /// TypeScript: GetBayCount()
    pub fn get_bay_count(&self) -> i16 {
        self.internal_bay_count
    }

    /// Get bay1 upgrade status
    /// TypeScript: GetBay1()
    pub fn get_bay1(&self) -> bool {
        self.internal_bay_1
    }

    /// Get bay2 upgrade status
    /// TypeScript: GetBay2()
    pub fn get_bay2(&self) -> bool {
        self.internal_bay_2
    }

    /// Calculate internal bomb capacity
    /// TypeScript: GetInternalBombCount()
    ///
    /// Base capacity is 10 * bay_count
    /// bay1 doubles it, bay2 doubles it again
    pub fn get_internal_bomb_count(&self) -> i16 {
        let mut ibc = 10 * self.internal_bay_count;

        if self.bomb_count > 0 && self.internal_bay_count > 0 {
            if self.internal_bay_1 {
                // Double internal count
                ibc *= 2;
                if self.internal_bay_2 {
                    // Double internal count again
                    ibc *= 2;
                }
            }
        }

        ibc
    }

    /// Calculate maximum bomb size that can fit in bays
    /// TypeScript: GetMaxBombSize()
    pub fn get_max_bomb_size(&self) -> i16 {
        let mut sz = 0;
        let ibc = self.get_internal_bomb_count();

        if self.bomb_count > 0 && self.internal_bay_count > 0 {
            if self.internal_bay_1 {
                if self.internal_bay_2 {
                    sz = ibc;
                } else {
                    sz = ibc / 2;
                }
            } else {
                sz = ibc / 4;
            }
        }

        sz
    }

    /// Get external munitions count (bombs + rockets that don't fit internally)
    /// TypeScript: GetExternalMass()
    pub fn get_external_mass(&self) -> i16 {
        let ext_bomb_count = self.bomb_count + self.rocket_count;
        (ext_bomb_count - self.get_internal_bomb_count()).max(0)
    }
}
