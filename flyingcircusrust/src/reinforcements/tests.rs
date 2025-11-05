use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};

/// Create test external wood list
fn create_test_ext_wood_list() -> Vec<ExternalWoodEntry> {
    vec![
        ExternalWoodEntry {
            name: "Parallel Struts".to_string(),
            tension: 30,
            config: true,
            first: true,
            small_sqp: false,
            ornith: false,
            stats: Stats::new(),
        },
        ExternalWoodEntry {
            name: "N-Strut".to_string(),
            tension: 20,
            config: true,
            first: true,
            small_sqp: false,
            ornith: false,
            stats: Stats::new(),
        },
    ]
}

/// Create test external steel list
fn create_test_ext_steel_list() -> Vec<ExternalSteelEntry> {
    vec![ExternalSteelEntry {
        name: "Steel Parallel Struts".to_string(),
        tension: 15,
        config: true,
        first: true,
        small_sqp: false,
        ornith: false,
        stats: Stats::new(),
    }]
}

/// Create test cabane list
fn create_test_cabane_list() -> Vec<CabaneEntry> {
    vec![
        CabaneEntry {
            name: "None".to_string(),
            tension: 0,
            stats: Stats::new(),
        },
        CabaneEntry {
            name: "Parallel Struts".to_string(),
            tension: 15,
            stats: Stats::new(),
        },
    ]
}

/// Create test cantilever list
fn create_test_cant_list() -> Vec<CantileverEntry> {
    vec![
        CantileverEntry {
            name: "Birch".to_string(),
            limited: true,
            stats: Stats::new(),
        },
        CantileverEntry {
            name: "Duralumin".to_string(),
            limited: true,
            stats: Stats::new(),
        },
        CantileverEntry {
            name: "Steel".to_string(),
            limited: true,
            stats: Stats::new(),
        },
        CantileverEntry {
            name: "Aluminium".to_string(),
            limited: true,
            stats: Stats::new(),
        },
        CantileverEntry {
            name: "Whalebone".to_string(),
            limited: true,
            stats: Stats::new(),
        },
    ]
}

#[test]
fn test_reinforcements_new() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    assert_eq!(reinf.ext_wood_count().len(), 2);
    assert_eq!(reinf.ext_steel_count().len(), 1);
    assert_eq!(reinf.cant_count().len(), 5);
    assert_eq!(reinf.cabane_sel(), 0);
    assert!(!reinf.wires());
    assert!(!reinf.wing_blades());
}

#[test]
fn test_set_ext_wood_count() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    reinf.set_ext_wood_count(0, 5);
    assert_eq!(reinf.ext_wood_count()[0], 5);

    // Test negative value
    reinf.set_ext_wood_count(0, -1);
    assert_eq!(reinf.ext_wood_count()[0], 0);
}

#[test]
fn test_set_cant_count() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    reinf.set_cant_count(0, 3);
    assert_eq!(reinf.cant_count()[0], 3);

    // Test negative value
    reinf.set_cant_count(0, -5);
    assert_eq!(reinf.cant_count()[0], 0);
}

#[test]
fn test_set_wires() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    assert!(!reinf.wires());
    reinf.set_wires(true);
    assert!(reinf.wires());
}

#[test]
fn test_set_cabane() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    reinf.set_cabane(1);
    assert_eq!(reinf.cabane_sel(), 1);

    // Test out of bounds
    reinf.set_cabane(99);
    assert_eq!(reinf.cabane_sel(), 1); // Should not change
}

#[test]
fn test_total_cantilevers() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    assert_eq!(reinf.total_cantilevers(), 0);

    reinf.set_cant_count(0, 2);
    assert_eq!(reinf.total_cantilevers(), 2);

    reinf.set_cant_count(1, 3);
    assert_eq!(reinf.total_cantilevers(), 5);
}

#[test]
fn test_can_use_wing_blades() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    // Can't use wing blades without steel cantilevers
    assert!(!reinf.can_use_wing_blades());

    // Add steel cantilevers (index 2)
    reinf.set_cant_count(2, 1);
    assert!(reinf.can_use_wing_blades());

    // Can't use if external struts are present
    reinf.set_ext_wood_count(0, 1);
    assert!(!reinf.can_use_wing_blades());
}

#[test]
fn test_set_aircraft_type() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);

    reinf.set_cabane(1);
    reinf.set_aircraft_type(AircraftType::Helicopter);

    // Cabane should be cleared for helicopter
    assert_eq!(reinf.cabane_sel(), 0);
}

#[test]
fn test_serialization() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf1 = Reinforcements::new(ext_wood, ext_steel, cabane, cant);
    reinf1.set_ext_wood_count(0, 2);
    reinf1.set_cabane(1);
    reinf1.set_wires(true);

    // Serialize
    let mut serializer = Serializer::new();
    let result = reinf1.serialize(&mut serializer);
    assert!(result.is_ok());

    let data = serializer.into_inner();

    // Deserialize
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf2 = Reinforcements::new(ext_wood, ext_steel, cabane, cant);
    let mut deserializer = Deserializer::new(&data).unwrap();
    deserializer.version = 12.7;
    let result = reinf2.deserialize(&mut deserializer);
    assert!(result.is_ok());

    assert_eq!(reinf2.ext_wood_count()[0], 2);
    assert_eq!(reinf2.cabane_sel(), 1);
    assert!(reinf2.wires());
}

#[test]
fn test_json_serialization() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf1 = Reinforcements::new(ext_wood, ext_steel, cabane, cant);
    reinf1.set_ext_wood_count(0, 3);
    reinf1.set_cabane(1);
    reinf1.set_wires(true);

    // Serialize to JSON
    let json = reinf1.to_json();

    // Deserialize from JSON
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf2 = Reinforcements::new(ext_wood, ext_steel, cabane, cant);
    reinf2.from_json(&json, 12.7);

    assert_eq!(reinf2.ext_wood_count()[0], 3);
    assert_eq!(reinf2.cabane_sel(), 1);
    assert!(reinf2.wires());
}

#[test]
fn test_part_stats() {
    let ext_wood = create_test_ext_wood_list();
    let ext_steel = create_test_ext_steel_list();
    let cabane = create_test_cabane_list();
    let cant = create_test_cant_list();

    let mut reinf = Reinforcements::new(ext_wood, ext_steel, cabane, cant);
    let stats = reinf.part_stats();

    // Default configuration should have minimal stats
    assert_eq!(stats.mass, 0.0);
    assert_eq!(stats.drag, 0.0);
}
