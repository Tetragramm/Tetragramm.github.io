use super::*;
use crate::aircraft::AircraftType;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Create test reference lists
fn create_test_lists() -> (Vec<BladeEntry>, Vec<ArrangementEntry>) {
    let blade_list = vec![
        BladeEntry {
            name: "Two".to_string(),
            sizing: 1.05,
            rotor_bleed: 0,
            stats: Stats {
                flightstress: 1.0,
                ..Stats::new()
            },
        },
        BladeEntry {
            name: "Three".to_string(),
            sizing: 1.0,
            rotor_bleed: 1,
            stats: Stats {
                cost: 2.0,
                ..Stats::new()
            },
        },
        BladeEntry {
            name: "Four".to_string(),
            sizing: 0.95,
            rotor_bleed: 2,
            stats: Stats {
                cost: 4.0,
                ..Stats::new()
            },
        },
    ];

    let arrangement_list = vec![
        ArrangementEntry {
            name: "Single Rotor".to_string(),
            count: 1,
            powerfactor: 1.0,
            blades: 0,
            stats: Stats::new(),
        },
        ArrangementEntry {
            name: "Coaxial".to_string(),
            count: 2,
            powerfactor: 1.0,
            blades: 0,
            stats: Stats {
                cost: 2.0,
                reliability: -1.0,
                ..Stats::new()
            },
        },
        ArrangementEntry {
            name: "Tandem".to_string(),
            count: 2,
            powerfactor: 1.0,
            blades: 0,
            stats: Stats {
                pitchstab: 4.0,
                ..Stats::new()
            },
        },
        ArrangementEntry {
            name: "Tandem Transverse".to_string(),
            count: 3,
            powerfactor: 1.0,
            blades: 0,
            stats: Stats {
                pitchstab: 4.0,
                latstab: 4.0,
                ..Stats::new()
            },
        },
    ];

    (blade_list, arrangement_list)
}

#[test]
fn test_rotor_new() {
    let (blade_list, arrangement_list) = create_test_lists();
    let rotor = Rotor::new(blade_list, arrangement_list);

    assert_eq!(rotor.get_type(), AircraftType::Airplane);
    assert_eq!(rotor.get_rotor_count(), 0);
    assert_eq!(rotor.get_rotor_span(), 0);
    assert_eq!(rotor.get_blade_count_idx(), 0);
    assert_eq!(rotor.get_stagger(), 0);
    assert!(!rotor.get_accessory());
}

#[test]
fn test_set_type_helicopter() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);

    assert_eq!(rotor.get_type(), AircraftType::Helicopter);
    assert_eq!(rotor.get_rotor_count(), 1); // Reset to 1 on type change
    assert!(rotor.can_rotor_count());
    assert!(rotor.can_rotor_span());
}

#[test]
fn test_rotor_count_even_enforcement() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);

    // Try to set odd number >= 2
    rotor.set_rotor_count(3);
    // Should round to even (down to 2 since not incrementing by 1)
    assert_eq!(rotor.get_rotor_count(), 2);

    // Increment from 2 to 3 should round up to 4
    rotor.set_rotor_count(2);
    rotor.set_rotor_count(3);
    assert_eq!(rotor.get_rotor_count(), 4);

    // 1 is allowed
    rotor.set_rotor_count(1);
    assert_eq!(rotor.get_rotor_count(), 1);
}

#[test]
fn test_can_tandem() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);

    rotor.set_rotor_count(1);
    assert!(!rotor.can_tandem());

    rotor.set_rotor_count(2);
    assert!(rotor.can_tandem());
}

#[test]
fn test_tail_rotor() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);

    rotor.set_rotor_count(1);
    assert!(rotor.get_tail_rotor());

    rotor.set_rotor_count(2);
    assert!(!rotor.get_tail_rotor());
}

#[test]
fn test_can_stagger() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);

    rotor.set_rotor_count(1);
    let can = rotor.can_stagger();
    assert!(can[0]); // Single Rotor (count=1)
    assert!(!can[1]); // Coaxial (count=2)

    rotor.set_rotor_count(2);
    let can = rotor.can_stagger();
    assert!(!can[0]); // Single Rotor (count=1)
    assert!(can[1]); // Coaxial (count=2)
    assert!(can[2]); // Tandem (count=2)

    rotor.set_rotor_count(4);
    let can = rotor.can_stagger();
    assert!(can[3]); // Tandem Transverse (count=3)
}

#[test]
fn test_helicopter_sizing() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);
    rotor.set_rotor_count(1);
    rotor.set_mass_power(100.0);

    let stats = rotor.part_stats();

    // Should auto-size based on mass/power
    assert!(rotor.get_sizing_span() > 0);
    assert!(stats.wingarea > 0.0);
}

#[test]
fn test_autogyro_sizing() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Autogyro);
    rotor.set_wing_area(20);

    let stats = rotor.part_stats();

    // Should auto-size based on wing area
    assert_eq!(rotor.get_rotor_count(), 1); // Always 1 for autogyro
    assert!(rotor.get_sizing_span() > 0);
    assert!(stats.wingarea > 0.0);
}

#[test]
fn test_rotor_area_calculation() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    rotor.set_type(AircraftType::Helicopter);
    rotor.set_mass_power(100.0);

    rotor.part_stats(); // Trigger sizing

    let area = rotor.get_rotor_area();
    let ideal_area = rotor.get_ideal_rotor_area();

    // Area should be based on (sizing_span + rotor_span)^2 * PI/9
    assert!(area > 0.0);
    assert!(ideal_area > 0.0);
}

#[test]
fn test_serialization() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list.clone(), arrangement_list.clone());

    rotor.set_type(AircraftType::Helicopter);
    rotor.set_rotor_count(2);
    rotor.set_rotor_span(5);
    rotor.set_blade_count(1);
    rotor.set_accessory(true);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.7").unwrap();
    rotor.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut rotor2 = Rotor::new(blade_list, arrangement_list);
    rotor2.deserialize(&mut deserializer).unwrap();

    assert_eq!(rotor2.get_type(), AircraftType::Helicopter);
    assert_eq!(rotor2.get_rotor_count(), 2);
    assert_eq!(rotor2.get_rotor_span(), 5);
    assert_eq!(rotor2.get_blade_count_idx(), 1);
    assert_eq!(rotor2.get_accessory(), true);
}

#[test]
fn test_json_serialization() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list.clone(), arrangement_list.clone());

    rotor.set_type(AircraftType::Helicopter);
    rotor.set_rotor_count(2);
    rotor.set_rotor_thickness(3);
    rotor.set_stagger(1); // Coaxial

    // Serialize to JSON
    let json = rotor.to_json();

    // Deserialize from JSON
    let mut rotor2 = Rotor::new(blade_list, arrangement_list);
    rotor2.from_json(&json, 12.7);

    assert_eq!(rotor2.get_type(), AircraftType::Helicopter);
    assert_eq!(rotor2.get_rotor_count(), 2);
    assert_eq!(rotor2.get_rotor_thickness(), 3);
    assert_eq!(rotor2.get_stagger(), 1);
}

#[test]
fn test_version_migration() {
    let (blade_list, arrangement_list) = create_test_lists();
    let mut rotor = Rotor::new(blade_list, arrangement_list);

    // Simulate old version JSON (before 12.35 - no stagger_sel)
    let old_json = serde_json::json!({
        "type": 1,
        "rotor_count": 2,
        "rotor_span": 0,
        "rotor_mat": 0,
        "accessory": false,
        "blade_idx": 1,
        "rotor_thickness": 0
    });

    rotor.from_json(&old_json, 12.0); // Old version

    assert_eq!(rotor.get_type(), AircraftType::Helicopter);
    assert_eq!(rotor.get_stagger(), 1); // verify_stagger fixes to Coaxial (count==2)
}

#[test]
fn test_get_electrics() {
    let (blade_list, arrangement_list) = create_test_lists();
    let rotor = Rotor::new(blade_list, arrangement_list);

    let electrics = rotor.get_electrics();
    assert_eq!(electrics.storage, 0);
    assert_eq!(electrics.equipment.len(), 0);
}
