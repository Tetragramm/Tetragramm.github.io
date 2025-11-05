use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Create test tank list
fn create_test_tank_list() -> Vec<TankEntry> {
    vec![
        TankEntry {
            name: "Internal Tank".to_string(),
            stats: Stats {
                mass: 2.0,
                cost: 1.0,
                wetmass: 10.0,
                reqsections: 0.5,
                ..Stats::new()
            },
            internal: true,
            cantilever: false,
        },
        TankEntry {
            name: "External Tank".to_string(),
            stats: Stats {
                mass: 3.0,
                cost: 2.0,
                drag: 4.0,
                wetmass: 15.0,
                ..Stats::new()
            },
            internal: false,
            cantilever: false,
        },
        TankEntry {
            name: "Wing Tank".to_string(),
            stats: Stats {
                mass: 1.5,
                cost: 1.5,
                wetmass: 12.0,
                ..Stats::new()
            },
            internal: false,
            cantilever: true,
        },
        TankEntry {
            name: "Microtank".to_string(),
            stats: Stats {
                mass: 0.5,
                cost: 0.5,
                wetmass: 0.0,
                ..Stats::new()
            },
            internal: false,
            cantilever: false,
        },
    ]
}

#[test]
fn test_fuel_new() {
    let tank_list = create_test_tank_list();
    let fuel = Fuel::new(tank_list);

    assert_eq!(fuel.tank_count.len(), 4);
    assert_eq!(fuel.get_tank_count(), &[0, 0, 0, 0]);
    assert!(!fuel.get_self_sealing());
    assert!(!fuel.get_extinguisher());
}

#[test]
fn test_set_tank_count() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    fuel.set_tank_count(0, 2);
    assert_eq!(fuel.get_tank_count()[0], 2);

    fuel.set_tank_count(1, 3);
    assert_eq!(fuel.get_tank_count()[1], 3);

    // Test bounds
    fuel.set_tank_count(10, 5); // Out of bounds, should be ignored
    assert_eq!(fuel.get_tank_count().len(), 4);
}

#[test]
fn test_sealing_enabled() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    // No internal tanks, sealing disabled
    assert!(!fuel.get_sealing_enabled());

    // Add internal tank, sealing enabled
    fuel.set_tank_count(0, 1);
    assert!(fuel.get_sealing_enabled());

    // Remove internal tank, sealing disabled
    fuel.set_tank_count(0, 0);
    assert!(!fuel.get_sealing_enabled());
}

#[test]
fn test_cantilever_tank_limits() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    // Set cantilever wings with 30 wing area (allows 3 wing tanks)
    fuel.set_cantilever(true);
    fuel.set_area(30.0);

    // Add 3 wing tanks (should be allowed)
    fuel.set_tank_count(2, 3);
    assert_eq!(fuel.get_tank_count()[2], 3);

    // Try to add 5 wing tanks (should be limited to 3)
    fuel.set_tank_count(2, 5);
    assert_eq!(fuel.get_tank_count()[2], 3);

    // Disable cantilever (should remove wing tanks)
    fuel.set_cantilever(false);
    assert_eq!(fuel.get_tank_count()[2], 0);
}

#[test]
fn test_microtank_limit() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    fuel.set_area(100.0); // Set area to allow verification

    // Try to add 10 microtanks (should be limited to 4)
    fuel.set_tank_count(3, 10);
    assert_eq!(fuel.get_tank_count()[3], 4);
}

#[test]
fn test_get_tank_enabled() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    // Without cantilever, wing tanks disabled
    let enabled = fuel.get_tank_enabled();
    assert_eq!(enabled, vec![true, true, false, true]);

    // With cantilever, all tanks enabled
    fuel.set_cantilever(true);
    let enabled = fuel.get_tank_enabled();
    assert_eq!(enabled, vec![true, true, true, true]);
}

#[test]
fn test_part_stats() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    // Add 2 internal tanks
    fuel.set_tank_count(0, 2);

    let stats = fuel.part_stats();
    assert_eq!(stats.mass, 4.0); // 2 * 2.0
    assert_eq!(stats.cost, 2.0); // 2 * 1.0
    assert_eq!(stats.wetmass, 20.0); // 2 * 10.0
    assert_eq!(stats.reqsections, 1.0); // ceil(2 * 0.5)
}

#[test]
fn test_part_stats_with_self_sealing() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    // Add 2 internal tanks
    fuel.set_tank_count(0, 2);
    fuel.set_self_sealing(true);

    let stats = fuel.part_stats();
    assert_eq!(stats.mass, 6.0); // 4.0 + 2 (1 per internal tank)
    assert_eq!(stats.cost, 6.0); // 2.0 + 4 (2 per internal tank)
}

#[test]
fn test_part_stats_with_extinguisher() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    fuel.set_extinguisher(true);

    let stats = fuel.part_stats();
    assert_eq!(stats.mass, 2.0);
    assert_eq!(stats.cost, 3.0);
}

#[test]
fn test_wetmass_rounding() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list);

    // Add 1 internal tank (wetmass = 10)
    fuel.set_tank_count(0, 1);

    let stats = fuel.part_stats();
    assert_eq!(stats.wetmass, 10.0); // Already multiple of 5

    // Create tank with non-multiple of 5 wetmass
    let custom_list = vec![TankEntry {
        name: "Custom".to_string(),
        stats: Stats {
            wetmass: 12.0,
            ..Stats::new()
        },
        internal: false,
        cantilever: false,
    }];
    let mut fuel2 = Fuel::new(custom_list);
    fuel2.set_tank_count(0, 1);
    let stats2 = fuel2.part_stats();
    assert_eq!(stats2.wetmass, 15.0); // Rounded up from 12 to 15
}

#[test]
fn test_serialization() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list.clone());

    fuel.set_tank_count(0, 2);
    fuel.set_tank_count(1, 3);
    fuel.set_self_sealing(true);
    fuel.set_extinguisher(true);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    fuel.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut fuel2 = Fuel::new(tank_list);
    fuel2.deserialize(&mut deserializer).unwrap();

    assert_eq!(fuel2.get_tank_count(), fuel.get_tank_count());
    assert_eq!(fuel2.get_self_sealing(), fuel.get_self_sealing());
    assert_eq!(fuel2.get_extinguisher(), fuel.get_extinguisher());
}

#[test]
fn test_json_serialization() {
    let tank_list = create_test_tank_list();
    let mut fuel = Fuel::new(tank_list.clone());

    fuel.set_tank_count(0, 2);
    fuel.set_tank_count(1, 3);
    fuel.set_self_sealing(true);
    fuel.set_extinguisher(false);

    // Serialize to JSON
    let json = fuel.to_json();

    // Deserialize from JSON
    let mut fuel2 = Fuel::new(tank_list);
    fuel2.from_json(&json, 12.0);

    assert_eq!(fuel2.get_tank_count(), fuel.get_tank_count());
    assert_eq!(fuel2.get_self_sealing(), fuel.get_self_sealing());
    assert_eq!(fuel2.get_extinguisher(), fuel.get_extinguisher());
}

#[test]
fn test_get_electrics() {
    let tank_list = create_test_tank_list();
    let fuel = Fuel::new(tank_list);

    let electrics = fuel.get_electrics();
    assert_eq!(electrics.storage, 0);
    assert_eq!(electrics.equipment.len(), 0);
}
