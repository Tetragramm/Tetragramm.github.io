use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Helper to create test horizontal stabilizer entries
fn create_test_hstab_list() -> Vec<HStabEntry> {
    vec![
        HStabEntry {
            name: "Tailplane".to_string(),
            is_canard: false,
            increment: 1,
            stats: Stats::new(),
            dragfactor: 1.0,
            is_vtail: false,
            is_tail: true,
        },
        HStabEntry {
            name: "The Wings".to_string(),
            is_canard: false,
            increment: 0,
            stats: Stats::new(),
            dragfactor: 0.0,
            is_vtail: false,
            is_tail: false,
        },
        HStabEntry {
            name: "Canards".to_string(),
            is_canard: true,
            increment: 1,
            stats: Stats {
                pitchstab: -3.0,
                ..Stats::new()
            },
            dragfactor: 0.5,
            is_vtail: false,
            is_tail: false,
        },
        HStabEntry {
            name: "Outboard".to_string(),
            is_canard: false,
            increment: 2,
            stats: Stats {
                latstab: 1.0,
                ..Stats::new()
            },
            dragfactor: 1.0,
            is_vtail: false,
            is_tail: false,
        },
        HStabEntry {
            name: "V-Tail".to_string(),
            is_canard: false,
            increment: 1,
            stats: Stats {
                latstab: 2.0,
                pitchstab: 2.0,
                cost: 5.0,
                ..Stats::new()
            },
            dragfactor: 0.8,
            is_vtail: true,
            is_tail: true,
        },
    ]
}

/// Helper to create test vertical stabilizer entries
fn create_test_vstab_list() -> Vec<VStabEntry> {
    vec![
        VStabEntry {
            name: "Tailfin".to_string(),
            increment: 1,
            stats: Stats::new(),
            dragfactor: 1.0,
            is_vtail: false,
            is_tail: true,
        },
        VStabEntry {
            name: "Outboard".to_string(),
            increment: 2,
            stats: Stats {
                control: 1.0,
                ..Stats::new()
            },
            dragfactor: 1.0,
            is_vtail: false,
            is_tail: false,
        },
        VStabEntry {
            name: "V-Tail".to_string(),
            increment: 0,
            stats: Stats::new(),
            dragfactor: 0.0,
            is_vtail: true,
            is_tail: true,
        },
    ]
}

#[test]
fn test_new_stabilizers() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let stab = Stabilizers::new(hstab_list, vstab_list);

    assert_eq!(stab.get_hstab_type(), 0);
    assert_eq!(stab.get_hstab_count(), 1);
    assert_eq!(stab.get_vstab_type(), 0);
    assert_eq!(stab.get_vstab_count(), 1);
    assert_eq!(stab.have_tail, true);
    assert_eq!(stab.is_tandem, false);
    assert_eq!(stab.is_swept, false);
    assert_eq!(stab.is_heli, false);
}

#[test]
fn test_set_hstab_type() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_hstab_type(2); // Canards
    assert_eq!(stab.get_hstab_type(), 2);
    assert!(stab.get_canard());
}

#[test]
fn test_set_hstab_count() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_hstab_count(3);
    assert_eq!(stab.get_hstab_count(), 3);

    // Test increment constraint (Outboard has increment=2)
    stab.set_hstab_type(3); // Outboard
    stab.set_hstab_count(3);
    assert_eq!(stab.get_hstab_count(), 4); // Should round up to next multiple of 2
}

#[test]
fn test_set_vstab_type() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    // Enable swept wings to allow outboard vstabs
    stab.set_is_swept(true);
    stab.set_vstab_type(1); // Outboard
    assert_eq!(stab.get_vstab_type(), 1);
}

#[test]
fn test_set_vstab_count() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_vstab_count(2);
    assert_eq!(stab.get_vstab_count(), 2);

    // Test increment constraint (Outboard has increment=2)
    // Enable swept wings to allow outboard vstabs
    stab.set_is_swept(true);
    stab.set_vstab_type(1); // Outboard
    stab.set_vstab_count(3);
    assert_eq!(stab.get_vstab_count(), 4); // Should round up to next multiple of 2
}

#[test]
fn test_vtail_configuration() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_hstab_type(4); // V-Tail
    assert!(stab.get_is_vtail());
    assert_eq!(stab.get_hstab_type(), 4);
    assert_eq!(stab.get_vstab_type(), 2); // Should auto-select V-tail vstab
    assert_eq!(stab.get_vstab_count(), 0); // V-tail vstab has count 0
}

#[test]
fn test_can_v_outboard() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    // Initially can't use outboard
    assert!(!stab.can_v_outboard());

    // Enable with swept wings
    stab.set_is_swept(true);
    assert!(stab.can_v_outboard());

    // Enable with tandem
    stab.set_is_swept(false);
    stab.set_is_tandem(true);
    assert!(stab.can_v_outboard());

    // Enable with canard
    stab.set_is_tandem(false);
    stab.set_hstab_type(2); // Canards
    stab.set_hstab_count(1);
    assert!(stab.can_v_outboard());
}

#[test]
fn test_have_tail() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_have_tail(false);
    assert!(!stab.have_tail);

    // Should auto-adjust to valid selection
    let hvalid = stab.get_h_valid_list();
    assert!(hvalid[stab.get_hstab_type() as usize]);

    let vvalid = stab.get_v_valid_list();
    assert!(vvalid[stab.get_vstab_type() as usize]);
}

#[test]
fn test_helicopter_mode() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_helicopter(true);
    assert!(stab.is_heli);
    assert_eq!(stab.get_hstab_type(), 0);
    assert_eq!(stab.get_hstab_count(), 1);
    assert_eq!(stab.get_vstab_type(), 0);
    assert_eq!(stab.get_vstab_count(), 1);

    // In heli mode, only certain options are valid
    let hvalid = stab.get_h_valid_list();
    assert!(hvalid[0]);
    assert!(!hvalid[1]); // Other options should be invalid
}

#[test]
fn test_part_stats_basic() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.wing_drag = 10.0;
    let stats = stab.part_stats();

    // With default configuration (Tailplane + Tailfin), should have some drag
    assert!(stats.drag > 0.0);
}

#[test]
fn test_part_stats_multiple_stabilizers() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    stab.set_hstab_count(2);
    stab.set_vstab_count(2);
    stab.wing_drag = 10.0;

    let stats = stab.part_stats();

    // Additional stabilizers should add drag (2 * (1 + 1) = 4)
    assert!(stats.drag >= 4.0);
}

#[test]
fn test_part_stats_no_hstab() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    // Use Tailplane (increment=1) but set count to 0 to test the penalty
    stab.set_hstab_type(0); // Tailplane (increment != 0)
    stab.set_hstab_count(0); // No stabilizers
    stab.lifting_area = 20.0;

    let stats = stab.part_stats();

    // No hstab should penalize pitch stability
    assert!(stats.pitchstab < 0.0);
    assert!(stats.liftbleed > 0.0);
}

#[test]
fn test_serialization() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list.clone(), vstab_list.clone());

    stab.set_hstab_type(2);
    stab.set_hstab_count(3);
    stab.set_vstab_type(1);
    stab.set_vstab_count(2);

    // Serialize
    let mut serializer = Serializer::new();
    stab.serialize(&mut serializer).unwrap();
    let data = serializer.into_inner();

    // Deserialize
    let mut stab2 = Stabilizers::new(hstab_list, vstab_list);
    let mut deserializer = Deserializer::new(&data).unwrap();
    stab2.deserialize(&mut deserializer).unwrap();

    assert_eq!(stab2.get_hstab_type(), 2);
    assert_eq!(stab2.get_hstab_count(), 3);
    assert_eq!(stab2.get_vstab_type(), 1);
    assert_eq!(stab2.get_vstab_count(), 2);
}

#[test]
fn test_json_serialization() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list.clone(), vstab_list.clone());

    stab.set_hstab_type(2);
    stab.set_hstab_count(3);
    stab.set_vstab_type(1);
    stab.set_vstab_count(2);

    // To JSON
    let json = stab.to_json();

    // From JSON
    let mut stab2 = Stabilizers::new(hstab_list, vstab_list);
    stab2.from_json(&json, 12.7);

    assert_eq!(stab2.get_hstab_type(), 2);
    assert_eq!(stab2.get_hstab_count(), 3);
    assert_eq!(stab2.get_vstab_type(), 1);
    assert_eq!(stab2.get_vstab_count(), 2);
}

#[test]
fn test_is_default() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    assert!(stab.is_default());

    stab.set_hstab_count(2);
    assert!(!stab.is_default());
}

#[test]
fn test_validation() {
    let hstab_list = create_test_hstab_list();
    let vstab_list = create_test_vstab_list();
    let mut stab = Stabilizers::new(hstab_list, vstab_list);

    // Set invalid indices
    stab.hstab_sel = 100;
    stab.vstab_sel = 100;

    stab.verify();

    assert_eq!(stab.get_hstab_type(), 0);
    assert_eq!(stab.get_vstab_type(), 0);
}
