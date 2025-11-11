use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

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
