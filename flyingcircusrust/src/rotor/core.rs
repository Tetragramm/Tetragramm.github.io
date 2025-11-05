use super::*;

impl Rotor {
    /// Creates a new Rotor instance with provided reference lists
    pub fn new(blade_list: Vec<BladeEntry>, arrangement_list: Vec<ArrangementEntry>) -> Rotor {
        // Create default cantilever list (will be set by reinforcements module)
        let default_cant = vec![CantileverEntry {
            name: "Wood".to_string(),
            limited: false,
            stats: Stats::new(),
        }];

        Rotor {
            blade_list: Rc::new(blade_list),
            arrangement_list: Rc::new(arrangement_list),
            cantilever_list: Rc::new(default_cant),
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
