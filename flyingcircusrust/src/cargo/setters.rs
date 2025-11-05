use super::*;

impl Cargo {
    /// Set the selected cargo space
    /// TypeScript: SetSpace(num: number)
    pub fn set_space(&mut self, num: usize) {
        if num >= self.cargo_list.len() {
            self.space_sel = 0;
        } else {
            self.space_sel = num;
        }
    }
}
