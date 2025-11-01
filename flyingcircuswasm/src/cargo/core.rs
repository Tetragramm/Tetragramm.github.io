use super::*;

impl Cargo {
    /// Creates a new Cargo instance with provided cargo space list
    pub fn new(cargo_list: Vec<CargoSpace>) -> Cargo {
        Cargo {
            cargo_list: Rc::new(cargo_list),
            space_sel: 0,
        }
    }
}
