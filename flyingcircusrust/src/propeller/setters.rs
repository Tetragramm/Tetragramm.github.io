use super::*;

impl Propeller {
    /// Set the propeller type index
    pub fn set_prop_index(&mut self, num: usize) {
        if num < self.prop_list.len() {
            self.idx_prop = num;
        }
    }

    /// Set the upgrade index
    pub fn set_upgrade_index(&mut self, num: usize) {
        if num < self.upg_list.len() {
            self.idx_upg = num;
        }
    }

    /// Set the engine types configuration
    pub fn set_engine_types(&mut self, engines: Vec<EngineInfo>) {
        self.engines = engines;
    }

    /// Set the aircraft type
    pub fn set_acft_type(&mut self, acft_type: AircraftType) {
        self.acft_type = acft_type;
    }
}
