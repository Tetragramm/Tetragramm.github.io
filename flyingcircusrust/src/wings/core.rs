use super::*;

impl Wings {
    /// Creates a new Wings instance with provided reference lists
    pub fn new(
        skin_list: Vec<SurfaceEntry>,
        stagger_list: Vec<StaggerEntry>,
        deck_list: Vec<DeckEntry>,
        long_list: Vec<LongestWingEntry>,
    ) -> Wings {
        // Default stagger is monoplane (middle of list)
        let wing_stagger = stagger_list.len() / 2;

        Wings {
            skin_list: Rc::new(skin_list),
            stagger_list: Rc::new(stagger_list),
            deck_list: Rc::new(deck_list),
            long_list: Rc::new(long_list),
            wing_list: Vec::new(),
            mini_wing_list: Vec::new(),
            wing_stagger,
            is_swept: false,
            is_closed: false,
            plane_mass: 0.0,
            acft_type: AircraftType::Airplane,
            rotor_span: 0,
        }
    }
}
