use super::*;
use crate::part::Part;

/// Helper function to create test ControlSurfaces with minimal data
fn create_test_control_surfaces() -> ControlSurfaces {
    let aileron_list = vec![
        AileronEntry {
            name: "Flap Ailerons".to_string(),
            warping: false,
            stats: Stats::new(),
        },
        AileronEntry {
            name: "Wing Warping".to_string(),
            warping: true,
            stats: Stats::new(),
        },
    ];

    let rudder_list = vec![
        RudderEntry {
            name: "Flap Rudder".to_string(),
            stats: Stats::new(),
        },
        RudderEntry {
            name: "Flying Rudder".to_string(),
            stats: Stats::new(),
        },
    ];

    let elevator_list = vec![
        ElevatorEntry {
            name: "Flap Elevator".to_string(),
            stats: Stats::new(),
        },
        ElevatorEntry {
            name: "Flying Elevator".to_string(),
            stats: Stats::new(),
        },
    ];

    let mut flaps_stats = Stats::new();
    flaps_stats.cost = 1.0;
    let flaps_list = vec![
        FlapsEntry {
            name: "None".to_string(),
            costfactor: 0.0,
            stats: Stats::new(),
        },
        FlapsEntry {
            name: "Basic Flaps".to_string(),
            costfactor: 0.333333,
            stats: flaps_stats,
        },
    ];

    let slats_list = vec![
        SlatsEntry {
            name: "None".to_string(),
            stats: Stats::new(),
        },
        SlatsEntry {
            name: "Fixed Slots".to_string(),
            stats: Stats::new(),
        },
    ];

    let drag_list = vec![
        DragInducerEntry {
            name: "Air Brake".to_string(),
            stats: Stats::new(),
        },
        DragInducerEntry {
            name: "Dive Brake".to_string(),
            stats: Stats::new(),
        },
    ];

    ControlSurfaces::new(
        aileron_list,
        rudder_list,
        elevator_list,
        flaps_list,
        slats_list,
        drag_list,
    )
}

#[test]
fn test_new_control_surfaces() {
    let cs = create_test_control_surfaces();

    assert!(cs.aileron_list.len() > 0);
    assert!(cs.rudder_list.len() > 0);
    assert!(cs.elevator_list.len() > 0);
    assert!(cs.flaps_list.len() > 0);
    assert!(cs.slats_list.len() > 0);
    assert!(cs.drag_list.len() > 0);

    assert_eq!(cs.aileron_sel, 0);
    assert_eq!(cs.rudder_sel, 0);
    assert_eq!(cs.elevator_sel, 0);
    assert_eq!(cs.flaps_sel, 0);
    assert_eq!(cs.slats_sel, 0);
    assert_eq!(cs.drag_sel.len(), cs.drag_list.len());
}

#[test]
fn test_is_default() {
    let cs = create_test_control_surfaces();
    assert!(cs.is_default());
}

#[test]
fn test_can_rudder() {
    let mut cs = create_test_control_surfaces();
    assert!(cs.can_rudder());

    cs.set_can_rudder(false);
    assert!(!cs.can_rudder());
    assert_eq!(cs.get_rudder(), 0);
}

#[test]
fn test_can_elevator() {
    let mut cs = create_test_control_surfaces();
    assert!(cs.can_elevator());

    cs.set_can_elevator(false);
    assert!(!cs.can_elevator());
    assert_eq!(cs.get_elevator(), 0);
}

#[test]
fn test_ornithopter_warping_only() {
    let mut cs = create_test_control_surfaces();
    cs.set_acft_type(AircraftType::OrnithopterBasic);

    let can = cs.can_aileron();
    // Find a warping aileron
    let warping_idx = cs
        .aileron_list
        .iter()
        .position(|a| a.warping)
        .expect("Should have a warping aileron");

    assert!(can[warping_idx]);

    // Non-warping ailerons should not be available for ornithopters
    let non_warping_idx = cs.aileron_list.iter().position(|a| !a.warping);

    if let Some(idx) = non_warping_idx {
        assert!(!can[idx]);
    }
}

#[test]
fn test_wing_warping_with_cantilever() {
    let mut cs = create_test_control_surfaces();

    // Find wing warping option
    let warping_idx = cs
        .aileron_list
        .iter()
        .position(|a| a.warping)
        .expect("Should have a warping aileron");

    cs.set_aileron(warping_idx as i16);
    cs.set_num_cantilever(2);
    cs.set_span(10);
    cs.set_wing_area(1); // Must have wing area to use warping

    let stats = cs.part_stats();

    // Should have reduced maxstrain and extra cost
    assert!(stats.cost >= 4.0); // 2 * 2 cantilever cost
}

#[test]
fn test_warping_without_wing_area() {
    let mut cs = create_test_control_surfaces();

    // Find wing warping option
    let warping_idx = cs
        .aileron_list
        .iter()
        .position(|a| a.warping)
        .expect("Should have a warping aileron");

    cs.set_aileron(warping_idx as i16);
    cs.set_wing_area(0); // No wing area

    // Can aileron should return false for warping when no wing area
    let can = cs.can_aileron();
    assert!(!can[warping_idx]);

    // part_stats should auto-fix to default
    let _ = cs.part_stats();
    assert_eq!(cs.get_aileron(), 0);
}

#[test]
fn test_flap_cost_calculation() {
    let mut cs = create_test_control_surfaces();

    // Find a flap option with cost factor
    let flap_idx = cs.flaps_list.iter().position(|f| f.costfactor > 0.0);

    if let Some(idx) = flap_idx {
        cs.set_flaps(idx as i16);

        let cost = cs.get_flap_cost(10);
        assert!(cost >= 1.0); // Should be at least 1
    }
}
