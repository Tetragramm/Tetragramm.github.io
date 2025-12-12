use super::*;

impl Fuel {
    /// Get the list of available tank types
    /// TypeScript: GetTankList()
    pub fn get_tank_list(&self) -> Rc<Vec<TankEntry>> {
        self.tank_list.clone()
    }

    /// Get which tanks are enabled based on cantilever wing status
    /// TypeScript: GetTankEnabled()
    /// Returns array of booleans indicating if each tank type is available
    pub fn get_tank_enabled(&self) -> Vec<bool> {
        self.tank_list
            .iter()
            .map(|tank| {
                // Cantilever tanks are only available with cantilever wings
                if !self.is_cantilever && tank.cantilever {
                    false
                } else {
                    true
                }
            })
            .collect()
    }

    /// Get current tank counts
    /// TypeScript: GetTankCount()
    pub fn get_tank_count(&self) -> &[i16] {
        &self.tank_count
    }

    /// Check if self-sealing is enabled (requires internal tanks)
    /// TypeScript: GetSealingEnabled()
    pub fn get_sealing_enabled(&self) -> bool {
        let internal_count: i16 = self
            .tank_list
            .iter()
            .zip(&self.tank_count)
            .filter(|(tank, _)| tank.internal)
            .map(|(_, count)| count)
            .sum();

        internal_count > 0
    }

    /// Get self-sealing status
    /// TypeScript: GetSelfSealing()
    pub fn get_self_sealing(&self) -> bool {
        self.self_sealing
    }

    /// Get fire extinguisher status
    /// TypeScript: GetExtinguisher()
    pub fn get_extinguisher(&self) -> bool {
        self.fire_extinguisher
    }

    /// Count cantilever tanks
    pub(super) fn count_cantilever_tanks(&self) -> i16 {
        self.tank_list
            .iter()
            .zip(&self.tank_count)
            .filter(|(tank, _)| tank.cantilever)
            .map(|(_, count)| count)
            .sum()
    }
}
