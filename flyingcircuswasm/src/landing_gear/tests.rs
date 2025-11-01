use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Create test gear list
fn create_test_gear_list() -> Vec<GearEntry> {
    vec![
        GearEntry {
            name: "Normal Gear".to_string(),
            stats: Stats {
                mass: 1.0,
                cost: 1.0,
                ..Stats::new()
            },
            dplmp: 2.0, // 2 drag per LMP
            splmp: 1.0, // 1 structure per LMP
            can_retract: true,
        },
        GearEntry {
            name: "Skis".to_string(),
            stats: Stats {
                mass: 2.0,
                cost: 1.5,
                ..Stats::new()
            },
            dplmp: 3.0,
            splmp: 1.5,
            can_retract: false,
        },
        GearEntry {
            name: "Boat Hull".to_string(),
            stats: Stats {
                mass: 5.0,
                cost: 5.0,
                drag: 2.0,
                ..Stats::new()
            },
            dplmp: 4.0,
            splmp: 2.0,
            can_retract: false, // Special case: can still be retracted
        },
    ]
}

/// Create test extra list
fn create_test_extra_list() -> Vec<ExtraEntry> {
    vec![
        ExtraEntry {
            name: "Arresting Hook".to_string(),
            stats: Stats {
                mass: 2.0,
                cost: 2.0,
                ..Stats::new()
            },
            mplmp: 0.5, // 0.5 mass per LMP
        },
        ExtraEntry {
            name: "Zeppelin Hook".to_string(),
            stats: Stats {
                mass: 1.0,
                cost: 3.0,
                ..Stats::new()
            },
            mplmp: 0.25,
        },
    ]
}

#[test]
fn test_landing_gear_new() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let gear = LandingGear::new(gear_list, extra_list);

    assert_eq!(gear.get_gear(), 0);
    assert!(!gear.get_retract());
    assert_eq!(gear.get_extra_selected().len(), 2);
    assert!(!gear.get_extra_selected()[0]);
    assert!(!gear.get_extra_selected()[1]);
    assert!(!gear.can_boat);
    assert_eq!(gear.gull_deck, 0);
}

#[test]
fn test_set_gear() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    gear.set_gear(1);
    assert_eq!(gear.get_gear(), 1);

    // Out of bounds should be ignored
    gear.set_gear(10);
    assert_eq!(gear.get_gear(), 1);
}

#[test]
fn test_can_gear_boat_hull() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    // Boat Hull not allowed initially
    let can_use = gear.can_gear();
    assert!(can_use[0]); // Normal gear
    assert!(can_use[1]); // Skis
    assert!(!can_use[2]); // Boat Hull

    // Enable boat hull
    gear.set_can_boat(2, 0); // High engine
    let can_use = gear.can_gear();
    assert!(can_use[2]); // Boat Hull now allowed

    // Try to select boat hull (should work now)
    gear.set_gear(2);
    assert_eq!(gear.get_gear(), 2);
}

#[test]
fn test_retract() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    // Normal gear can retract
    assert!(gear.can_retract());
    gear.set_retract(true);
    assert!(gear.get_retract());

    // Skis cannot retract
    gear.set_gear(1);
    assert!(!gear.can_retract());
    assert!(!gear.get_retract()); // Should auto-disable

    // Boat Hull special case: can retract
    gear.can_boat = true;
    gear.set_gear(2);
    assert!(gear.can_retract());
    gear.set_retract(true);
    assert!(gear.get_retract());
}

#[test]
fn test_extra_selection() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    gear.set_extra_selected(0, true);
    assert!(gear.get_extra_selected()[0]);
    assert!(!gear.get_extra_selected()[1]);

    gear.set_extra_selected(1, true);
    assert!(gear.get_extra_selected()[0]);
    assert!(gear.get_extra_selected()[1]);

    gear.set_extra_selected(0, false);
    assert!(!gear.get_extra_selected()[0]);
    assert!(gear.get_extra_selected()[1]);
}

#[test]
fn test_gear_name() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    // Normal gear
    assert!(gear.get_gear_name().contains("Normal Gear"));

    // Retractable normal gear
    gear.set_retract(true);
    let name = gear.get_gear_name();
    assert!(name.contains("Retractable"));

    // Boat Hull with retract
    gear.can_boat = true;
    gear.set_gear(2);
    gear.set_retract(true);
    let name = gear.get_gear_name();
    assert!(name.contains("Boat Hull"));
}

#[test]
fn test_part_stats_basic() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    // Set loaded mass to 50kg (10 LMP)
    gear.set_loaded_mass(50.0);

    let stats = gear.part_stats();
    assert_eq!(stats.mass, 1.0); // Base gear mass
    assert_eq!(stats.cost, 1.0); // Base gear cost
    assert_eq!(stats.drag, 20.0); // 2.0 dplmp * 10 LMP
    assert_eq!(stats.structure, 10.0); // 1.0 splmp * 10 LMP
}

#[test]
fn test_part_stats_retract() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    gear.set_loaded_mass(50.0); // 10 LMP
    gear.set_retract(true);

    let stats = gear.part_stats();
    assert_eq!(stats.mass, 11.0); // 1 + 20/2 (pdrag/2)
    assert_eq!(stats.cost, 11.0); // 1 + 20/2
    assert_eq!(stats.drag, 0.0); // No drag when retracted
    assert_eq!(stats.structure, 10.0);
}

#[test]
fn test_part_stats_with_extra() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    gear.set_loaded_mass(50.0); // 10 LMP
    gear.set_extra_selected(0, true); // Arresting Hook

    let stats = gear.part_stats();
    // Base mass + hook mass + hook mplmp effect
    // temp_mass = 50 + 2 = 52, new LMP = 10
    assert_eq!(stats.mass, 1.0 + 2.0 + 5.0); // base + hook + (0.5 * 10)
}

#[test]
fn test_part_stats_gull_wing_reduction() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    gear.set_loaded_mass(50.0); // 10 LMP, pdrag = 20

    // Test shoulder gull (-10%)
    gear.set_gull_deck(1);
    let stats = gear.part_stats();
    assert_eq!(stats.drag, 18.0); // 20 - floor(0.1 * 20) = 20 - 2

    // Test mid gull (-15%)
    gear.set_gull_deck(2);
    let stats = gear.part_stats();
    assert_eq!(stats.drag, 17.0); // 20 - floor(0.15 * 20) = 20 - 3

    // Test gear gull (-25%)
    gear.set_gull_deck(4);
    let stats = gear.part_stats();
    assert_eq!(stats.drag, 15.0); // 20 - floor(0.25 * 20) = 20 - 5
}

#[test]
fn test_part_stats_boat_hull_retract() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    gear.can_boat = true;
    gear.set_gear(2); // Boat Hull
    gear.set_loaded_mass(50.0); // 10 LMP

    // Without retract: adds boat hull drag (40) + base drag (2)
    let stats = gear.part_stats();
    assert_eq!(stats.drag, 42.0); // base 2 + (4.0 * 10)

    // With retract: adds boat hull drag, plus retract mass/cost from normal gear
    gear.set_retract(true);
    let stats = gear.part_stats();
    assert_eq!(stats.drag, 42.0); // Boat hull drag remains
    // Normal gear: 2.0 dplmp * 10 = 20, divided by 2 = 10
    assert_eq!(stats.mass, 15.0); // 5 (boat hull) + 10 (retract)
    assert_eq!(stats.cost, 15.0); // 5 (boat hull) + 10 (retract)
}

#[test]
fn test_is_default() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    assert!(gear.is_default());

    gear.set_gear(1);
    assert!(!gear.is_default());

    gear.set_gear(0);
    assert!(gear.is_default());

    gear.set_retract(true);
    assert!(!gear.is_default());

    gear.set_retract(false);
    gear.set_extra_selected(0, true);
    assert!(!gear.is_default());
}

#[test]
fn test_serialization() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list.clone(), extra_list.clone());

    gear.set_gear(1);
    gear.set_extra_selected(0, true);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    gear.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut gear2 = LandingGear::new(gear_list, extra_list);
    gear2.deserialize(&mut deserializer).unwrap();

    assert_eq!(gear2.get_gear(), gear.get_gear());
    assert_eq!(gear2.get_retract(), gear.get_retract());
    assert_eq!(gear2.get_extra_selected(), gear.get_extra_selected());
}

#[test]
fn test_json_serialization() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list.clone(), extra_list.clone());

    gear.set_gear(1);
    gear.set_retract(false);
    gear.set_extra_selected(1, true);

    // Serialize to JSON
    let json = gear.to_json();

    // Deserialize from JSON
    let mut gear2 = LandingGear::new(gear_list, extra_list);
    gear2.from_json(&json, 12.0);

    assert_eq!(gear2.get_gear(), gear.get_gear());
    assert_eq!(gear2.get_retract(), gear.get_retract());
    assert_eq!(gear2.get_extra_selected(), gear.get_extra_selected());
}

#[test]
fn test_verify_gear() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    // Set invalid gear index
    gear.gear_sel = 10;
    gear.verify_gear();
    assert_eq!(gear.get_gear(), 0);

    // Select boat hull without permission
    gear.gear_sel = 2;
    gear.can_boat = false;
    gear.verify_gear();
    assert_eq!(gear.get_gear(), 0);
}

#[test]
fn test_set_can_boat_logic() {
    let gear_list = create_test_gear_list();
    let extra_list = create_test_extra_list();
    let mut gear = LandingGear::new(gear_list, extra_list);

    // Engine height 2: always can boat
    gear.set_can_boat(2, 0);
    assert!(gear.can_boat);

    // Engine height 1, wing height 2: can boat
    gear.set_can_boat(1, 2);
    assert!(gear.can_boat);

    // Engine height 1, wing height 1: cannot boat
    gear.set_can_boat(1, 1);
    assert!(!gear.can_boat);

    // Engine height 0, wing height 3: can boat
    gear.set_can_boat(0, 3);
    assert!(gear.can_boat);

    // Engine height 0, wing height 2: cannot boat
    gear.set_can_boat(0, 2);
    assert!(!gear.can_boat);
}
