use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};

#[test]
fn test_aircraft_new() {
    let aircraft = Aircraft::new();

    assert_eq!(aircraft.name, "Prototype Aircraft");
    assert_eq!(aircraft.aircraft_type, AircraftType::Airplane);
}

#[test]
fn test_is_ornithopter() {
    let mut aircraft = Aircraft::new();

    // Test non-ornithopters
    aircraft.aircraft_type = AircraftType::Airplane;
    assert!(!aircraft.is_ornithopter());

    aircraft.aircraft_type = AircraftType::Helicopter;
    assert!(!aircraft.is_ornithopter());

    aircraft.aircraft_type = AircraftType::Autogyro;
    assert!(!aircraft.is_ornithopter());

    // Test ornithopters
    aircraft.aircraft_type = AircraftType::OrnithopterBasic;
    assert!(aircraft.is_ornithopter());

    aircraft.aircraft_type = AircraftType::OrnithopterFlutter;
    assert!(aircraft.is_ornithopter());

    aircraft.aircraft_type = AircraftType::OrnithopterBuzzer;
    assert!(aircraft.is_ornithopter());
}

#[test]
fn test_aircraft_type_conversion() {
    assert_eq!(AircraftType::from(0), AircraftType::Airplane);
    assert_eq!(AircraftType::from(1), AircraftType::Helicopter);
    assert_eq!(AircraftType::from(2), AircraftType::Autogyro);
    assert_eq!(AircraftType::from(3), AircraftType::OrnithopterBasic);
    assert_eq!(AircraftType::from(4), AircraftType::OrnithopterFlutter);
    assert_eq!(AircraftType::from(5), AircraftType::OrnithopterBuzzer);

    // Test default case
    assert_eq!(AircraftType::from(99), AircraftType::Airplane);

    // Test reverse conversion
    assert_eq!(i16::from(AircraftType::Airplane), 0);
    assert_eq!(i16::from(AircraftType::Helicopter), 1);
    assert_eq!(i16::from(AircraftType::Autogyro), 2);
}

#[test]
#[ignore] // TODO: Binary serialization needs more work with complex sub-components
fn test_serialization() {
    let mut aircraft = Aircraft::new();
    aircraft.name = "Test Plane".to_string();
    aircraft.aircraft_type = AircraftType::Helicopter;

    // Serialize (version string must be written first)
    let mut serializer = Serializer::new();
    serializer.push_string("12.7").unwrap(); // Write version first
    aircraft.serialize(&mut serializer).unwrap();

    // Deserialize
    let mut aircraft2 = Aircraft::new();
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    aircraft2.deserialize(&mut deserializer).unwrap();

    assert_eq!(aircraft2.name, "Test Plane");
    assert_eq!(aircraft2.aircraft_type, AircraftType::Helicopter);
}

#[test]
#[ignore] // TODO: Binary serialization needs more work with complex sub-components
fn test_serialization_old_version() {
    // Note: In real usage, the serialization format is more complex
    // For now, we just test that the version check works correctly
    // by using a modified deserializer version

    let mut aircraft = Aircraft::new();
    aircraft.name = "Old Plane".to_string();

    // Serialize with current format
    let mut serializer = Serializer::new();
    serializer.push_string("11.0").unwrap(); // Old version
    serializer.push_string(&aircraft.name).unwrap();
    aircraft.era.serialize(&mut serializer).unwrap();
    aircraft.cockpits.serialize(&mut serializer).unwrap();
    aircraft.passengers.serialize(&mut serializer).unwrap();
    aircraft.engines.serialize(&mut serializer).unwrap();
    // No aircraft_type in old version

    // Deserialize with old version
    let mut aircraft2 = Aircraft::new();
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    // Version should be 11.0 now
    assert!(deserializer.version < 11.05);
    aircraft2.deserialize(&mut deserializer).unwrap();

    assert_eq!(aircraft2.name, "Old Plane");
    assert_eq!(aircraft2.aircraft_type, AircraftType::Airplane); // Default for old version
}

#[test]
fn test_json_serialization() {
    let mut aircraft = Aircraft::new();
    aircraft.name = "JSON Test Plane".to_string();
    aircraft.aircraft_type = AircraftType::OrnithopterBasic;

    // To JSON
    let json = aircraft.to_json();
    assert_eq!(json["name"].as_str().unwrap(), "JSON Test Plane");
    assert_eq!(json["version"].as_str().unwrap(), "12.7");
    assert_eq!(json["aircraft_type"].as_i64().unwrap(), 3);

    // From JSON
    let mut aircraft2 = Aircraft::new();
    aircraft2.from_json(&json, 12.7);
    assert_eq!(aircraft2.name, "JSON Test Plane");
    assert_eq!(aircraft2.aircraft_type, AircraftType::OrnithopterBasic);
}

#[test]
fn test_json_old_version() {
    use serde_json::json;

    // Create JSON without aircraft_type (version 11.0)
    let json = json!({
        "version": "11.0",
        "name": "Old JSON Plane",
        "era": {"selected": 1},
        "cockpits": {"positions": []},
        "passengers": {"seats": 0, "beds": 0, "connected": false},
        "engines": {"engines": [], "radiators": [], "is_asymmetric": false}
    });

    let mut aircraft = Aircraft::new();
    aircraft.from_json(&json, 11.0);

    assert_eq!(aircraft.name, "Old JSON Plane");
    assert_eq!(aircraft.aircraft_type, AircraftType::Airplane); // Default for old version
}

#[test]
fn test_get_electrics() {
    let aircraft = Aircraft::new();
    let electrics = aircraft.get_electrics();

    // Basic test - should return a valid ElectricsMessage
    assert_eq!(electrics.storage, 0);
}
