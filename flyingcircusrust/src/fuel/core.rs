use super::*;

impl Fuel {
    /// Creates a new Fuel instance with provided tank list
    pub fn new(tank_list: Vec<TankEntry>) -> Fuel {
        let tank_count = vec![0; tank_list.len()];

        Fuel {
            tank_list: Rc::new(tank_list),
            tank_count,
            self_sealing: false,
            fire_extinguisher: false,
            is_cantilever: false,
            wing_area: -1.0,
        }
    }
}
