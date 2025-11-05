use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};

#[test]
fn test_munitions_new() {
    let munitions = Munitions::new();

    assert_eq!(munitions.get_bomb_count(), 0);
    assert_eq!(munitions.get_rocket_count(), 0);
    assert_eq!(munitions.get_bay_count(), 0);
    assert!(!munitions.get_bay1());
    assert!(!munitions.get_bay2());
}

#[test]
fn test_set_bomb_count() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow bombs
    munitions.set_acft_parameters(10.0, 1.0, 0);

    munitions.set_bomb_count(10);
    assert_eq!(munitions.get_bomb_count(), 10);

    // Test negative clamping
    munitions.set_bomb_count(-5);
    assert_eq!(munitions.get_bomb_count(), 0);
}

#[test]
fn test_set_rocket_count() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow rockets
    munitions.set_acft_parameters(10.0, 1.0, 0);

    munitions.set_rocket_count(8);
    assert_eq!(munitions.get_rocket_count(), 8);

    // Test negative clamping
    munitions.set_rocket_count(-3);
    assert_eq!(munitions.get_rocket_count(), 0);
}

#[test]
fn test_set_bay_count() {
    let mut munitions = Munitions::new();

    munitions.set_bay_count(2);
    assert_eq!(munitions.get_bay_count(), 2);

    // Test negative clamping
    munitions.set_bay_count(-1);
    assert_eq!(munitions.get_bay_count(), 0);
}

#[test]
fn test_set_use_bays() {
    let mut munitions = Munitions::new();

    // Enable bay1
    munitions.set_use_bays(true, false);
    assert!(munitions.get_bay1());
    assert!(!munitions.get_bay2());

    // Enable both
    munitions.set_use_bays(true, true);
    assert!(munitions.get_bay1());
    assert!(munitions.get_bay2());

    // Try to enable bay2 without bay1 (should auto-enable bay1 and disable bay2)
    munitions.set_use_bays(false, true);
    assert!(munitions.get_bay1());
    assert!(!munitions.get_bay2());
}

#[test]
fn test_set_individual_bays() {
    let mut munitions = Munitions::new();

    // Enable bay1 using individual setter
    munitions.set_internal_bay_1(true);
    assert!(munitions.get_bay1());
    assert!(!munitions.get_bay2());

    // Enable bay2 using individual setter (should work since bay1 is enabled)
    munitions.set_internal_bay_2(true);
    assert!(munitions.get_bay1());
    assert!(munitions.get_bay2());

    // Disable bay1 using individual setter when bay2 is enabled
    // (validation will auto-enable bay1 and disable bay2 due to dependency)
    munitions.set_internal_bay_1(false);
    assert!(munitions.get_bay1());
    assert!(!munitions.get_bay2());

    // Now disable bay2 explicitly first, then disable bay1
    munitions.set_internal_bay_2(false);
    munitions.set_internal_bay_1(false);
    assert!(!munitions.get_bay1());
    assert!(!munitions.get_bay2());

    // Try to enable bay2 when bay1 is disabled (should auto-enable bay1 and disable bay2)
    munitions.set_internal_bay_2(true);
    assert!(munitions.get_bay1());
    assert!(!munitions.get_bay2());
}

#[test]
fn test_get_internal_bomb_count() {
    let mut munitions = Munitions::new();

    // No bays
    assert_eq!(munitions.get_internal_bomb_count(), 0);

    // Set aircraft parameters to allow bombs
    munitions.set_acft_parameters(50.0, 1.0, 0);

    // 2 bays, no upgrades
    munitions.set_bay_count(2);
    munitions.set_bomb_count(1); // Need at least 1 bomb
    assert_eq!(munitions.get_internal_bomb_count(), 20); // 2 * 10

    // With bay1 (doubles)
    munitions.set_use_bays(true, false);
    assert_eq!(munitions.get_internal_bomb_count(), 40); // 20 * 2

    // With bay1 and bay2 (doubles again)
    munitions.set_use_bays(true, true);
    assert_eq!(munitions.get_internal_bomb_count(), 80); // 40 * 2
}

#[test]
fn test_get_max_bomb_size() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow bombs
    munitions.set_acft_parameters(50.0, 1.0, 0);

    munitions.set_bay_count(2);
    munitions.set_bomb_count(1);

    // No upgrades: ibc / 4
    assert_eq!(munitions.get_max_bomb_size(), 5); // 20 / 4

    // Bay1 only: ibc / 2
    munitions.set_use_bays(true, false);
    assert_eq!(munitions.get_max_bomb_size(), 20); // 40 / 2

    // Bay1 and Bay2: full ibc
    munitions.set_use_bays(true, true);
    assert_eq!(munitions.get_max_bomb_size(), 80); // 80
}

#[test]
fn test_get_external_mass() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow munitions
    munitions.set_acft_parameters(20.0, 1.0, 0);

    munitions.set_bay_count(1);
    munitions.set_bomb_count(15);
    munitions.set_rocket_count(5);

    // Total: 20, Internal capacity: 10, External: 10
    assert_eq!(munitions.get_external_mass(), 10);

    // With bay1, internal capacity doubles to 20
    munitions.set_use_bays(true, false);
    assert_eq!(munitions.get_external_mass(), 0);
}

#[test]
fn test_limit_mass_internal() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters: struct=10, maxbomb=1, gull=0
    munitions.set_acft_parameters(10.0, 1.0, 0);

    munitions.set_bay_count(5); // Internal capacity: 50
    munitions.set_bomb_count(100); // Try to add 100 bombs

    // Max internal: min(50, 3*10*1) = min(50, 30) = 30
    // Max external: (10*1 - 30/3) * 1 = 0
    // So total should be limited to 30
    assert_eq!(munitions.get_bomb_count(), 30);
}

#[test]
fn test_limit_mass_external_with_gull_factor() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters with gull deck
    munitions.set_acft_parameters(10.0, 1.0, 4); // gull_factor = 1.2

    munitions.set_bomb_count(10);

    // Internal: 0, External allowed: (10*1 - 0) * 1.2 = 12
    assert_eq!(munitions.get_bomb_count(), 10);

    munitions.set_bomb_count(15);
    assert_eq!(munitions.get_bomb_count(), 12); // Limited by gull factor
}

#[test]
fn test_part_stats() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow munitions
    munitions.set_acft_parameters(15.0, 1.0, 0);

    munitions.set_bomb_count(10);
    munitions.set_rocket_count(5);

    let stats = munitions.part_stats();

    // External mass: 15 (no internal bays)
    // Rack mass: ceil(15 / 5) = 3
    assert_eq!(stats.mass, 3.0);
    assert_eq!(stats.drag, 3.0);
    assert_eq!(stats.bomb_mass, 15.0);
}

#[test]
fn test_part_stats_with_bays() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow munitions
    munitions.set_acft_parameters(50.0, 1.0, 0);

    munitions.set_bay_count(2);
    munitions.set_use_bays(true, false);
    munitions.set_bomb_count(10);

    let stats = munitions.part_stats();

    // Required sections: 2 (base) + 2 (bay1 doubles) = 4
    assert_eq!(stats.reqsections, 4.0);

    // All bombs fit internally (capacity 40), so no external racks
    assert_eq!(stats.mass, 0.0);
    assert_eq!(stats.drag, 0.0);
    assert_eq!(stats.bomb_mass, 10.0);
}

#[test]
fn test_part_stats_bomb_mass_rounding() {
    let mut munitions = Munitions::new();

    // Set aircraft parameters to allow munitions
    munitions.set_acft_parameters(10.0, 1.0, 0);

    munitions.set_bomb_count(7); // Not a multiple of 5

    let stats = munitions.part_stats();

    // Should round up to 10
    assert_eq!(stats.bomb_mass, 10.0);
}

#[test]
fn test_serialization() {
    let mut munitions = Munitions::new();

    munitions.set_bomb_count(10);
    munitions.set_rocket_count(5);
    munitions.set_bay_count(2);
    munitions.set_use_bays(true, false);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    munitions.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut munitions2 = Munitions::new();
    munitions2.deserialize(&mut deserializer).unwrap();

    assert_eq!(munitions2.get_bomb_count(), munitions.get_bomb_count());
    assert_eq!(munitions2.get_rocket_count(), munitions.get_rocket_count());
    assert_eq!(munitions2.get_bay_count(), munitions.get_bay_count());
    assert_eq!(munitions2.get_bay1(), munitions.get_bay1());
    assert_eq!(munitions2.get_bay2(), munitions.get_bay2());
}

#[test]
fn test_serialization_old_version() {
    let mut munitions = Munitions::new();

    // Serialize with old version (no rockets)
    let mut serializer = Serializer::new();
    serializer.push_string("10.5").unwrap();
    serializer.push_num(10i16).unwrap(); // bomb_count
    serializer.push_num(2i16).unwrap(); // bay_count
    serializer.push_bool(true).unwrap(); // bay1
    serializer.push_bool(false).unwrap(); // bay2

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    munitions.deserialize(&mut deserializer).unwrap();

    assert_eq!(munitions.get_bomb_count(), 10);
    assert_eq!(munitions.get_rocket_count(), 0); // Should default to 0
    assert_eq!(munitions.get_bay_count(), 2);
    assert!(munitions.get_bay1());
    assert!(!munitions.get_bay2());
}

#[test]
fn test_json_serialization() {
    let mut munitions = Munitions::new();

    munitions.set_bomb_count(10);
    munitions.set_rocket_count(5);
    munitions.set_bay_count(2);
    munitions.set_use_bays(true, true);

    // Serialize to JSON
    let json = munitions.to_json();

    // Deserialize from JSON
    let mut munitions2 = Munitions::new();
    munitions2.from_json(&json, 12.0);

    assert_eq!(munitions2.get_bomb_count(), munitions.get_bomb_count());
    assert_eq!(munitions2.get_rocket_count(), munitions.get_rocket_count());
    assert_eq!(munitions2.get_bay_count(), munitions.get_bay_count());
    assert_eq!(munitions2.get_bay1(), munitions.get_bay1());
    assert_eq!(munitions2.get_bay2(), munitions.get_bay2());
}

#[test]
fn test_json_old_version() {
    let mut munitions = Munitions::new();

    let json = serde_json::json!({
        "bomb_count": 10,
        "bay_count": 2,
        "bay1": true,
        "bay2": false,
    });

    // Load with old version (no rockets)
    munitions.from_json(&json, 10.5);

    assert_eq!(munitions.get_bomb_count(), 10);
    assert_eq!(munitions.get_rocket_count(), 0); // Should default to 0
    assert_eq!(munitions.get_bay_count(), 2);
}

#[test]
fn test_get_electrics() {
    let munitions = Munitions::new();

    let electrics = munitions.get_electrics();
    assert_eq!(electrics.storage, 0);
    assert_eq!(electrics.equipment.len(), 0);
}
