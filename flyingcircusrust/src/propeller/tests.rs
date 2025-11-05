use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};

/// Create test propeller list for testing
fn create_test_prop_list() -> Vec<PropellerEntry> {
    vec![
        PropellerEntry {
            name: "Fixed Pitch".to_string(),
            stats: Stats::new(),
            energy: 2.5,
            turn: 6.0,
        },
        PropellerEntry {
            name: "Two Position".to_string(),
            stats: Stats::new(),
            energy: 3.0,
            turn: 6.5,
        },
        PropellerEntry {
            name: "Variable Pitch".to_string(),
            stats: Stats::new(),
            energy: 3.5,
            turn: 7.0,
        },
    ]
}

/// Create test upgrade list for testing
fn create_test_upg_list() -> Vec<UpgradeEntry> {
    vec![
        UpgradeEntry {
            name: "None".to_string(),
            stats: Stats::new(),
            energy: 0.0,
            turn: 0.0,
        },
        UpgradeEntry {
            name: "Upgrade 1".to_string(),
            stats: Stats::new(),
            energy: 0.5,
            turn: 0.5,
        },
        UpgradeEntry {
            name: "Upgrade 2".to_string(),
            stats: Stats::new(),
            energy: 1.0,
            turn: 1.0,
        },
    ]
}

#[test]
fn test_propeller_new() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let propeller = Propeller::new(prop_list, upg_list);

    assert_eq!(propeller.get_prop_index(), 2);
    assert_eq!(propeller.get_upgrade_index(), 0);
}

#[test]
fn test_set_prop_index() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    propeller.set_prop_index(1);
    assert_eq!(propeller.get_prop_index(), 1);

    // Test out of bounds
    propeller.set_prop_index(99);
    assert_eq!(propeller.get_prop_index(), 1); // Should not change
}

#[test]
fn test_set_upgrade_index() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    propeller.set_upgrade_index(1);
    assert_eq!(propeller.get_upgrade_index(), 1);

    // Test out of bounds
    propeller.set_upgrade_index(99);
    assert_eq!(propeller.get_upgrade_index(), 1); // Should not change
}

#[test]
fn test_get_num_propellers() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    // No engines
    assert_eq!(propeller.get_num_propellers(), 0);

    // Add propeller engines
    propeller.set_engine_types(vec![
        EngineInfo {
            drive_type: DriveType::Propeller,
            num: 2.,
        },
        EngineInfo {
            drive_type: DriveType::Propeller,
            num: 1.,
        },
    ]);
    assert_eq!(propeller.get_num_propellers(), 3);

    // Mixed engine types
    propeller.set_engine_types(vec![
        EngineInfo {
            drive_type: DriveType::Propeller,
            num: 2.,
        },
        EngineInfo {
            drive_type: DriveType::Turbine,
            num: 1.,
        },
    ]);
    assert_eq!(propeller.get_num_propellers(), 2);
}

#[test]
fn test_get_energy() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    // Helicopter
    propeller.set_acft_type(AircraftType::Helicopter);
    assert_eq!(propeller.get_energy(), 2.5);

    // Ornithopter Basic
    propeller.set_acft_type(AircraftType::OrnithopterBasic);
    assert_eq!(propeller.get_energy(), 6.0);

    // Default airplane with propeller engines
    propeller.set_acft_type(AircraftType::Airplane);
    propeller.set_prop_index(2); // Variable Pitch: 3.5
    propeller.set_upgrade_index(0); // None: 0.0
    propeller.set_engine_types(vec![EngineInfo {
        drive_type: DriveType::Propeller,
        num: 1.,
    }]);
    assert_eq!(propeller.get_energy(), 3.5);

    // With upgrade
    propeller.set_upgrade_index(1); // Upgrade 1: +0.5
    assert_eq!(propeller.get_energy(), 4.0);
}

#[test]
fn test_get_turn() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    // Helicopter
    propeller.set_acft_type(AircraftType::Helicopter);
    assert_eq!(propeller.get_turn(), 6.0);

    // Default airplane with propeller engines
    propeller.set_acft_type(AircraftType::Airplane);
    propeller.set_prop_index(2); // Variable Pitch: 7.0
    propeller.set_upgrade_index(0); // None: 0.0
    propeller.set_engine_types(vec![EngineInfo {
        drive_type: DriveType::Propeller,
        num: 1.,
    }]);
    assert_eq!(propeller.get_turn(), 7.0);
}

#[test]
fn test_serialization() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    propeller.set_prop_index(1);
    propeller.set_upgrade_index(2);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap(); // version > 11.35
    propeller.serialize(&mut serializer).unwrap();

    // Deserialize
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller2 = Propeller::new(prop_list, upg_list);
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip the version string
    propeller2.deserialize(&mut deserializer).unwrap();

    assert_eq!(propeller2.get_prop_index(), 1);
    assert_eq!(propeller2.get_upgrade_index(), 2);
}

#[test]
fn test_serialization_old_version() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();

    // Create old-format serialized data
    let mut serializer = Serializer::new();
    serializer.push_string("11.0").unwrap(); // version < 11.35
    serializer.push_num(2i16).unwrap(); // prop index
    serializer.push_bool(true).unwrap(); // use_variable = true

    // Deserialize with old version
    let mut propeller = Propeller::new(prop_list, upg_list);
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip the version string
    propeller.deserialize(&mut deserializer).unwrap();

    assert_eq!(propeller.get_prop_index(), 2);
    assert_eq!(propeller.get_upgrade_index(), 1); // use_variable = true -> idx 1
}

#[test]
fn test_json_serialization() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    propeller.set_prop_index(1);
    propeller.set_upgrade_index(2);

    // To JSON
    let json = propeller.to_json();
    assert_eq!(json["type"].as_i64().unwrap(), 1);
    assert_eq!(json["upgrade"].as_i64().unwrap(), 2);

    // From JSON
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller2 = Propeller::new(prop_list, upg_list);
    propeller2.from_json(&json, 12.0);
    assert_eq!(propeller2.get_prop_index(), 1);
    assert_eq!(propeller2.get_upgrade_index(), 2);
}

#[test]
fn test_part_stats() {
    let prop_list = create_test_prop_list();
    let upg_list = create_test_upg_list();
    let mut propeller = Propeller::new(prop_list, upg_list);

    // Set up propeller engines
    propeller.set_engine_types(vec![EngineInfo {
        drive_type: DriveType::Propeller,
        num: 2.,
    }]);

    let stats = propeller.part_stats();
    // Should have stats multiplied by number of propellers (2)
    // This is a basic test - actual stat values would depend on prop_list data
    assert!(stats.mass >= 0.0);
}
