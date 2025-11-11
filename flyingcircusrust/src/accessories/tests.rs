use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};

/// Create test electrical list
fn create_test_electrical() -> Vec<ElectricalEntry> {
    vec![
        ElectricalEntry {
            name: "Windmill".to_string(),
            cp10s: 1.0,
            storage: 0,
            stats: Stats::new(),
        },
        ElectricalEntry {
            name: "Battery".to_string(),
            cp10s: 0.0,
            storage: 5,
            stats: Stats::new(),
        },
    ]
}

/// Create test radio list
fn create_test_radios() -> Vec<RadioEntry> {
    vec![
        RadioEntry {
            name: "Loud Yelling".to_string(),
            stats: Stats::new(),
        },
        RadioEntry {
            name: "Radio Receiver".to_string(),
            stats: Stats::new(),
        },
    ]
}

/// Create test recon list
fn create_test_recon() -> Vec<ReconEntry> {
    vec![
        ReconEntry {
            name: "Guncam".to_string(),
            stats: Stats::new(),
        },
        ReconEntry {
            name: "Camera".to_string(),
            stats: Stats::new(),
        },
    ]
}

/// Create test visibility list
fn create_test_visi() -> Vec<VisibilityEntry> {
    vec![
        VisibilityEntry {
            name: "Wing Cutouts".to_string(),
            stats: Stats::new(),
        },
        VisibilityEntry {
            name: "Searchlight".to_string(),
            stats: Stats::new(),
        },
    ]
}

/// Create test climate list
fn create_test_climate() -> Vec<ClimateEntry> {
    vec![
        ClimateEntry {
            name: "Electric Heating".to_string(),
            req_radiator: false,
            stats: Stats::new(),
        },
        ClimateEntry {
            name: "Radiator Loop".to_string(),
            req_radiator: true,
            stats: Stats::new(),
        },
    ]
}

/// Create test autopilot list
fn create_test_autopilots() -> Vec<AutopilotEntry> {
    vec![
        AutopilotEntry {
            name: "None".to_string(),
            stats: Stats::new(),
        },
        AutopilotEntry {
            name: "Gyroscopic".to_string(),
            stats: Stats::new(),
        },
    ]
}

/// Create test control list
fn create_test_control() -> Vec<ControlEntry> {
    vec![
        ControlEntry {
            name: "None".to_string(),
            max_mass_stress: 1000,
            max_total_stress: 1000,
            stats: Stats::new(),
        },
        ControlEntry {
            name: "Control Rods".to_string(),
            max_mass_stress: 1500,
            max_total_stress: 1500,
            stats: Stats::new(),
        },
    ]
}

#[test]
fn test_set_electrical_count() {
    let mut acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    acc.set_electrical_count(0, 3);
    assert_eq!(acc.electrical_count()[0], 3);

    // Test negative value
    acc.set_electrical_count(0, -1);
    assert_eq!(acc.electrical_count()[0], 0);

    // Test max cap (50)
    acc.set_electrical_count(0, 100);
    assert_eq!(acc.electrical_count()[0], 50);
}

#[test]
fn test_set_armour_coverage() {
    let mut acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    acc.set_armour_coverage(0, 5);
    assert_eq!(acc.armour_coverage()[0], 5);

    // Test negative
    acc.set_armour_coverage(0, -1);
    assert_eq!(acc.armour_coverage()[0], 0);
}

#[test]
fn test_communication_name() {
    let acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    let name = acc.communication_name();
    assert_eq!(name, "Loud Yelling");
}

#[test]
fn test_get_storage() {
    let mut acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    acc.set_electrical_count(1, 2);
    assert_eq!(acc.get_storage(), 10); // 2 * 5
}

#[test]
fn test_get_windmill() {
    let mut acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    acc.set_electrical_count(0, 3);
    assert_eq!(acc.get_windmill(), 3.0); // 3 * 1.0
}

#[test]
fn test_has_electrics() {
    let mut acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    assert!(!acc.has_electrics()); // No electrical items yet

    acc.set_electrical_count(0, 1);
    assert!(acc.has_electrics()); // Has windmill
}

#[test]
fn test_max_stress() {
    let acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    assert_eq!(acc.max_mass_stress(), 1000);
    assert_eq!(acc.max_total_stress(), 1000);
}

#[test]
fn test_part_stats() {
    let mut acc = Accessories::new(
        create_test_electrical(),
        create_test_radios(),
        create_test_recon(),
        create_test_visi(),
        create_test_climate(),
        create_test_autopilots(),
        create_test_control(),
    );

    let stats = acc.part_stats();
    // Default config should have minimal stats (only radio and control)
    assert!(stats.mass >= 0.0);
}
