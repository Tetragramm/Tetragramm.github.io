use super::*;

impl Fuel {
    /// Set tank count for a specific tank type
    /// TypeScript: SetTankCount(idx: number, count: number)
    pub fn set_tank_count(&mut self, idx: usize, mut count: i16) {
        if idx >= self.tank_count.len() {
            return;
        }

        // Validate count
        if count < 0 || count != count {
            // NaN check
            count = 0;
        }

        self.tank_count[idx] = count;
        self.verify_ok();
    }

    /// Set cantilever wing status (affects tank availability)
    /// TypeScript: SetCantilever(is: boolean)
    pub fn set_cantilever(&mut self, is: bool) {
        // If disabling cantilever, verify tanks first
        if self.is_cantilever && !is {
            self.is_cantilever = is;
            self.verify_ok();
        }
        self.is_cantilever = is;
    }

    /// Set wing area (affects cantilever tank limits)
    /// TypeScript: SetArea(num: number)
    pub fn set_area(&mut self, num: f64) {
        // If reducing area, verify tanks first
        if self.wing_area > num {
            self.wing_area = num;
            self.verify_ok();
        }
        self.wing_area = num;
    }

    /// Set self-sealing fuel tanks
    /// TypeScript: SetSelfSealing(is: boolean)
    pub fn set_self_sealing(&mut self, is: bool) {
        self.self_sealing = is;
    }

    /// Set fire extinguisher system
    /// TypeScript: SetExtinguisher(is: boolean)
    pub fn set_extinguisher(&mut self, is: bool) {
        self.fire_extinguisher = is;
    }
}
