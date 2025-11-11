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
