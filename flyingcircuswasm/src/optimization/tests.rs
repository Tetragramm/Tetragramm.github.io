use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

#[test]
fn test_optimization_new() {
    let opt = Optimization::new();

    assert_eq!(opt.get_free_dots(), 0);
    assert_eq!(opt.get_cost(), 0);
    assert_eq!(opt.get_bleed(), 0);
    assert_eq!(opt.get_escape(), 0);
    assert_eq!(opt.get_mass(), 0);
    assert_eq!(opt.get_toughness(), 0);
    assert_eq!(opt.get_maxstrain(), 0);
    assert_eq!(opt.get_reliability(), 0);
    assert_eq!(opt.get_drag(), 0);
    assert!(opt.is_default());
}

#[test]
fn test_set_free_dots() {
    let mut opt = Optimization::new();

    opt.set_free_dots(10);
    assert_eq!(opt.get_free_dots(), 10);

    // Negative should be clamped to 0
    opt.set_free_dots(-5);
    assert_eq!(opt.get_free_dots(), 0);
}

#[test]
fn test_set_cost() {
    let mut opt = Optimization::new();
    opt.set_free_dots(5);

    opt.set_cost(2);
    assert_eq!(opt.get_cost(), 2);

    // Should clamp to [-3, 3]
    opt.set_cost(5);
    assert_eq!(opt.get_cost(), 3);

    opt.set_cost(-5);
    assert_eq!(opt.get_cost(), -3);
}

#[test]
fn test_get_unassigned_count() {
    let mut opt = Optimization::new();
    opt.set_free_dots(10);

    assert_eq!(opt.get_unassigned_count(), 10);

    opt.set_cost(2);
    assert_eq!(opt.get_unassigned_count(), 8);

    opt.set_mass(3);
    assert_eq!(opt.get_unassigned_count(), 5);

    opt.set_drag(3); // Drag clamped to [-3, 3]
    assert_eq!(opt.get_unassigned_count(), 2); // 10 - 2 - 3 - 3 = 2

    opt.set_reliability(2);
    assert_eq!(opt.get_unassigned_count(), 0); // 10 - 2 - 3 - 3 - 2 = 0
}

#[test]
fn test_reduce_dots() {
    let mut opt = Optimization::new();
    opt.set_free_dots(5);

    // Set allocations that exceed free dots
    opt.cost = 2;
    opt.mass = 2;
    opt.drag = 3;
    opt.reduce_dots();

    // Drag should be reduced first
    assert_eq!(opt.get_drag(), 1); // Reduced from 3 to 1
    assert_eq!(opt.get_mass(), 2);
    assert_eq!(opt.get_cost(), 2);
}

#[test]
fn test_reduce_dots_priority() {
    let mut opt = Optimization::new();
    opt.set_free_dots(0);

    // Set all to 1 (total 9, but only 0 available)
    opt.cost = 1;
    opt.bleed = 1;
    opt.escape = 1;
    opt.mass = 1;
    opt.toughness = 1;
    opt.maxstrain = 1;
    opt.reliability = 1;
    opt.drag = 1;
    opt.reduce_dots();

    // Priority order: drag, reliability, maxstrain, toughness, mass, escape, bleed, cost
    // All should be reduced to 0
    assert_eq!(opt.get_drag(), 0);
    assert_eq!(opt.get_reliability(), 0);
    assert_eq!(opt.get_maxstrain(), 0);
    assert_eq!(opt.get_toughness(), 0);
    assert_eq!(opt.get_mass(), 0);
    assert_eq!(opt.get_escape(), 0);
    assert_eq!(opt.get_bleed(), 0);
    assert_eq!(opt.get_cost(), 0);
}

#[test]
fn test_reduce_dots_partial() {
    let mut opt = Optimization::new();
    opt.set_free_dots(6);

    // Set allocations totaling 10 (over by 4)
    opt.cost = 1;
    opt.bleed = 1;
    opt.escape = 1;
    opt.mass = 1;
    opt.toughness = 1;
    opt.maxstrain = 1;
    opt.reliability = 1;
    opt.drag = 3;
    opt.reduce_dots();

    // Should reduce by 4: drag from 3 to 0, reliability from 1 to 0
    assert_eq!(opt.get_drag(), 0);
    assert_eq!(opt.get_reliability(), 0);
    assert_eq!(opt.get_maxstrain(), 1);
    assert_eq!(opt.get_toughness(), 1);
    assert_eq!(opt.get_mass(), 1);
    assert_eq!(opt.get_escape(), 1);
    assert_eq!(opt.get_bleed(), 1);
    assert_eq!(opt.get_cost(), 1);
}

#[test]
fn test_part_stats() {
    let mut opt = Optimization::new();
    opt.set_free_dots(10);

    // Set aircraft stats
    let mut acft_stats = Stats::new();
    acft_stats.cost = 100.0;
    acft_stats.mass = 50.0;
    acft_stats.drag = 20.0;
    acft_stats.toughness = 40.0;
    opt.set_acft_stats(&acft_stats);

    // Set optimizations
    opt.set_cost(2); // Should reduce cost by 20% (2 * 100 / 10)
    opt.set_bleed(1); // Should reduce bleed by 3
    opt.set_escape(1); // Should add 1 to escape and visibility
    opt.set_mass(1); // Should reduce mass by 10% (1 * 50 / 10)
    opt.set_toughness(2); // Should add 50% (2 * 40 / 4)
    opt.set_reliability(1); // Should add 2
    opt.set_drag(1); // Should reduce drag by 10% (1 * 20 / 10)

    let stats = opt.part_stats();

    assert_eq!(stats.cost, -20.0); // -(2 * 100 / 10)
    assert_eq!(stats.liftbleed, -3.0); // -(1 * 3)
    assert_eq!(stats.escape, 1.0);
    assert_eq!(stats.visibility, 1.0);
    assert_eq!(stats.mass, -5.0); // -(1 * 50 / 10)
    assert_eq!(stats.toughness, 20.0); // floor(2 * 40 / 4)
    assert_eq!(stats.reliability, 2.0); // 1 * 2
    assert_eq!(stats.drag, -2.0); // -(1 * 20 / 10)
}

#[test]
fn test_is_default() {
    let mut opt = Optimization::new();
    assert!(opt.is_default());

    opt.set_free_dots(1);
    assert!(!opt.is_default());

    opt.set_free_dots(0);
    assert!(opt.is_default());

    // With free_dots=0, setting cost=1 will be immediately reduced back to 0
    opt.set_cost(1);
    assert!(opt.is_default()); // Still default because cost was reduced to 0

    // Set free_dots first, then allocate
    opt.set_free_dots(5);
    opt.set_cost(1);
    assert!(!opt.is_default());
}

#[test]
fn test_serialization() {
    let mut opt = Optimization::new();
    opt.set_free_dots(10);
    opt.set_cost(2);
    opt.set_mass(1);
    opt.set_drag(3);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    opt.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut opt2 = Optimization::new();
    opt2.deserialize(&mut deserializer).unwrap();

    assert_eq!(opt2.get_free_dots(), opt.get_free_dots());
    assert_eq!(opt2.get_cost(), opt.get_cost());
    assert_eq!(opt2.get_mass(), opt.get_mass());
    assert_eq!(opt2.get_drag(), opt.get_drag());
}

#[test]
fn test_json_serialization() {
    let mut opt = Optimization::new();
    opt.set_free_dots(10);
    opt.set_cost(2);
    opt.set_bleed(1);
    opt.set_escape(1);
    opt.set_mass(1);
    opt.set_toughness(2);
    opt.set_reliability(1);
    opt.set_drag(1);

    // Serialize to JSON
    let json = opt.to_json();

    // Deserialize from JSON
    let mut opt2 = Optimization::new();
    opt2.from_json(&json, 12.0);

    assert_eq!(opt2.get_free_dots(), opt.get_free_dots());
    assert_eq!(opt2.get_cost(), opt.get_cost());
    assert_eq!(opt2.get_bleed(), opt.get_bleed());
    assert_eq!(opt2.get_escape(), opt.get_escape());
    assert_eq!(opt2.get_mass(), opt.get_mass());
    assert_eq!(opt2.get_toughness(), opt.get_toughness());
    assert_eq!(opt2.get_reliability(), opt.get_reliability());
    assert_eq!(opt2.get_drag(), opt.get_drag());
}

#[test]
fn test_verify_all() {
    let mut opt = Optimization::new();

    // Set invalid values
    opt.free_dots = -5;
    opt.cost = 10;
    opt.drag = -10;

    opt.verify_all();

    // Should be clamped to valid ranges
    assert_eq!(opt.get_free_dots(), 0);
    assert_eq!(opt.get_cost(), 3);
    assert_eq!(opt.get_drag(), -3);
}
