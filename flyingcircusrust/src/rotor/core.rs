use super::*;

impl Rotor {
    /// Creates a new Rotor instance with provided reference lists
    pub fn new(
        blade_list: Vec<BladeEntry>,
        arrangement_list: Vec<ArrangementEntry>,
        cantilever_list: Vec<CantileverEntry>,
    ) -> Rotor {
        Rotor {
            blade_list: Rc::new(blade_list),
            arrangement_list: Rc::new(arrangement_list),
            cantilever_list: Rc::new(cantilever_list),
            aircraft_type: AircraftType::Airplane,
            rotor_count: 0,
            rotor_span: 0,
            rotor_thickness: 0,
            blade_idx: 0,
            arrangement_sel: 0,
            cantilever_idx: 0,
            wing_area: 0,
            dry_mass_power: -1.0,
            sizing_span: 0,
            engine_count: 0,
            accessory: false,
        }
    }
}
