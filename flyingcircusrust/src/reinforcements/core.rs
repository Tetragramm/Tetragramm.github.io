use super::*;

impl Reinforcements {
    /// Creates a new Reinforcements instance with the provided lists
    pub fn new(
        ext_wood_list: Vec<ExternalWoodEntry>,
        ext_steel_list: Vec<ExternalSteelEntry>,
        cabane_list: Vec<CabaneEntry>,
        cant_list: Vec<CantileverEntry>,
    ) -> Self {
        let ext_wood_count = vec![0; ext_wood_list.len()];
        let ext_steel_count = vec![0; ext_steel_list.len()];
        let cant_count = vec![0; cant_list.len()];

        Reinforcements {
            ext_wood_list: Rc::new(ext_wood_list),
            ext_steel_list: Rc::new(ext_steel_list),
            cabane_list: Rc::new(cabane_list),
            cant_list: Rc::new(cant_list),
            ext_wood_count,
            ext_steel_count,
            cant_count,
            wires: false,
            cabane_sel: 0,
            wing_blades: false,
            is_staggered: false,
            is_tandem: false,
            is_monoplane: false,
            can_external: true,
            acft_structure: 0,
            cant_lift: 0,
            tension_sqp: false,
            limited_sqp: false,
            acft_type: AircraftType::Airplane,
        }
    }
}
