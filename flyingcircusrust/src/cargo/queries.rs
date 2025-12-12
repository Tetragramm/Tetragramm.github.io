use super::*;

impl Cargo {
    /// Get the list of available cargo spaces
    /// TypeScript: GetSpaceList()
    pub fn get_space_list(&self) -> Rc<Vec<CargoSpace>> {
        self.cargo_list.clone()
    }

    /// Get current selected cargo space index
    /// TypeScript: GetSpace()
    pub fn get_space(&self) -> usize {
        self.space_sel
    }

    /// Check if space selection is enabled (always true)
    /// Required for UIBindings
    pub fn is_space_enabled(&self) -> bool {
        true
    }
}
