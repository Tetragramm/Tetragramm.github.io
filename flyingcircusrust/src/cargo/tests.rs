use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Create test cargo space list
fn create_test_cargo_list() -> Vec<CargoSpace> {
    vec![
        CargoSpace {
            name: "None".to_string(),
            stats: Stats {
                reqsections: 0.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
        CargoSpace {
            name: "Tiny".to_string(),
            stats: Stats {
                mass: 1.0,
                reqsections: 0.0,
                ..Stats::new()
            },
        },
        CargoSpace {
            name: "Small".to_string(),
            stats: Stats {
                reqsections: 1.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
        CargoSpace {
            name: "Medium".to_string(),
            stats: Stats {
                reqsections: 3.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
        CargoSpace {
            name: "Large".to_string(),
            stats: Stats {
                reqsections: 5.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
        CargoSpace {
            name: "Huge".to_string(),
            stats: Stats {
                reqsections: 10.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
    ]
}

#[test]
fn test_cargo_new() {
    let cargo_list = create_test_cargo_list();
    let cargo = Cargo::new(cargo_list);

    assert_eq!(cargo.get_space(), 0);
    assert_eq!(cargo.get_space_list().len(), 6);
    assert!(cargo.is_space_enabled());
}

#[test]
fn test_set_space() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    cargo.set_space(2);
    assert_eq!(cargo.get_space(), 2);

    cargo.set_space(4);
    assert_eq!(cargo.get_space(), 4);

    // Test out of bounds - should reset to 0
    cargo.set_space(10);
    assert_eq!(cargo.get_space(), 0);
}

#[test]
fn test_part_stats_none() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    // Select "None" (index 0)
    cargo.set_space(0);

    let stats = cargo.part_stats();
    assert_eq!(stats.reqsections, 0.0);
    assert_eq!(stats.mass, 0.0);
    assert_eq!(stats.bomb_mass, 0.0);
}

#[test]
fn test_part_stats_tiny() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    // Select "Tiny" (index 1) - has 1 mass, 0 reqsections
    cargo.set_space(1);

    let stats = cargo.part_stats();
    assert_eq!(stats.reqsections, 0.0);
    assert_eq!(stats.mass, 1.0);
    // bomb_mass = 0 + (0 * 3) = 0, rounds to 0
    assert_eq!(stats.bomb_mass, 0.0);
}

#[test]
fn test_part_stats_small() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    // Select "Small" (index 2) - has 0 mass, 1 reqsection
    cargo.set_space(2);

    let stats = cargo.part_stats();
    assert_eq!(stats.reqsections, 1.0);
    assert_eq!(stats.mass, 0.0);
    // bomb_mass = 0 + (1 * 3) = 3, rounds up to 5
    assert_eq!(stats.bomb_mass, 5.0);
}

#[test]
fn test_part_stats_medium() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    // Select "Medium" (index 3) - has 0 mass, 3 reqsections
    cargo.set_space(3);

    let stats = cargo.part_stats();
    assert_eq!(stats.reqsections, 3.0);
    assert_eq!(stats.mass, 0.0);
    // bomb_mass = 0 + (3 * 3) = 9, rounds up to 10
    assert_eq!(stats.bomb_mass, 10.0);
}

#[test]
fn test_part_stats_large() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    // Select "Large" (index 4) - has 0 mass, 5 reqsections
    cargo.set_space(4);

    let stats = cargo.part_stats();
    assert_eq!(stats.reqsections, 5.0);
    assert_eq!(stats.mass, 0.0);
    // bomb_mass = 0 + (5 * 3) = 15, already multiple of 5
    assert_eq!(stats.bomb_mass, 15.0);
}

#[test]
fn test_part_stats_huge() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list);

    // Select "Huge" (index 5) - has 0 mass, 10 reqsections
    cargo.set_space(5);

    let stats = cargo.part_stats();
    assert_eq!(stats.reqsections, 10.0);
    assert_eq!(stats.mass, 0.0);
    // bomb_mass = 0 + (10 * 3) = 30, already multiple of 5
    assert_eq!(stats.bomb_mass, 30.0);
}

#[test]
fn test_bomb_mass_rounding() {
    // Create custom cargo with reqsections that don't result in multiple of 5
    let custom_list = vec![
        CargoSpace {
            name: "Custom1".to_string(),
            stats: Stats {
                reqsections: 2.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
        CargoSpace {
            name: "Custom2".to_string(),
            stats: Stats {
                reqsections: 4.0,
                mass: 0.0,
                ..Stats::new()
            },
        },
    ];
    let mut cargo = Cargo::new(custom_list);

    // reqsections = 2, bomb_mass = 2 * 3 = 6, rounds up to 10
    cargo.set_space(0);
    let stats = cargo.part_stats();
    assert_eq!(stats.bomb_mass, 10.0);

    // reqsections = 4, bomb_mass = 4 * 3 = 12, rounds up to 15
    cargo.set_space(1);
    let stats = cargo.part_stats();
    assert_eq!(stats.bomb_mass, 15.0);
}

#[test]
fn test_serialization() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list.clone());

    cargo.set_space(3);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    cargo.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut cargo2 = Cargo::new(cargo_list);
    cargo2.deserialize(&mut deserializer).unwrap();

    assert_eq!(cargo2.get_space(), cargo.get_space());
}

#[test]
fn test_serialization_bounds_check() {
    let cargo_list = create_test_cargo_list();
    let cargo = Cargo::new(cargo_list.clone());

    // Create serializer with out-of-bounds index
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    serializer.push_num(99).unwrap(); // Out of bounds

    // Deserialize should clamp to 0
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut cargo2 = Cargo::new(cargo_list);
    cargo2.deserialize(&mut deserializer).unwrap();

    assert_eq!(cargo2.get_space(), 0);
}

#[test]
fn test_json_serialization() {
    let cargo_list = create_test_cargo_list();
    let mut cargo = Cargo::new(cargo_list.clone());

    cargo.set_space(4);

    // Serialize to JSON
    let json = cargo.to_json();

    // Deserialize from JSON
    let mut cargo2 = Cargo::new(cargo_list);
    cargo2.from_json(&json, 12.0);

    assert_eq!(cargo2.get_space(), cargo.get_space());
}

#[test]
fn test_json_bounds_check() {
    let cargo_list = create_test_cargo_list();
    let cargo_list_clone = cargo_list.clone();
    let mut cargo = Cargo::new(cargo_list);

    // Create JSON with out-of-bounds index
    let json = serde_json::json!({
        "space_sel": 99
    });

    // Deserialize should clamp to 0
    cargo.from_json(&json, 12.0);
    assert_eq!(cargo.get_space(), 0);

    // Test with missing field (should default to 0)
    let mut cargo2 = Cargo::new(cargo_list_clone);
    let json2 = serde_json::json!({});
    cargo2.from_json(&json2, 12.0);
    assert_eq!(cargo2.get_space(), 0);
}

#[test]
fn test_get_electrics() {
    let cargo_list = create_test_cargo_list();
    let cargo = Cargo::new(cargo_list);

    let electrics = cargo.get_electrics();
    assert_eq!(electrics.storage, 0);
    assert_eq!(electrics.equipment.len(), 0);
}
