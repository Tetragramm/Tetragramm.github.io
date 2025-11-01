use super::*;

impl LandingGear {
    /// Creates a new LandingGear instance with provided part lists
    ///
    /// # Arguments
    /// * `gear_list` - Available landing gear types
    /// * `extra_list` - Available extra accessories (hooks, etc.)
    pub fn new(gear_list: Vec<GearEntry>, extra_list: Vec<ExtraEntry>) -> Self {
        let extra_sel = vec![false; extra_list.len()];

        LandingGear {
            gear_list: Rc::new(gear_list),
            extra_list: Rc::new(extra_list),
            gear_sel: 0,
            retract: false,
            extra_sel,
            can_boat: false,
            gull_deck: 0,
            loaded_mass: 0.0,
        }
    }
}
