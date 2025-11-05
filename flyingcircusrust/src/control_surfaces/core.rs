use super::*;

impl ControlSurfaces {
    /// Creates a new ControlSurfaces instance with the provided lists
    pub fn new(
        aileron_list: Vec<AileronEntry>,
        rudder_list: Vec<RudderEntry>,
        elevator_list: Vec<ElevatorEntry>,
        flaps_list: Vec<FlapsEntry>,
        slats_list: Vec<SlatsEntry>,
        drag_list: Vec<DragInducerEntry>,
    ) -> Self {
        let drag_count = drag_list.len();

        ControlSurfaces {
            aileron_list: Rc::new(aileron_list),
            rudder_list: Rc::new(rudder_list),
            elevator_list: Rc::new(elevator_list),
            flaps_list: Rc::new(flaps_list),
            slats_list: Rc::new(slats_list),
            drag_list: Rc::new(drag_list),
            aileron_sel: 0,
            rudder_sel: 0,
            elevator_sel: 0,
            flaps_sel: 0,
            slats_sel: 0,
            drag_sel: vec![false; drag_count],
            span: 0,
            num_cantilever: 0,
            wing_area: 0,
            is_boom: false,
            acft_type: AircraftType::Airplane,
            can_rudder: true,
            can_elevator: true,
        }
    }
}
