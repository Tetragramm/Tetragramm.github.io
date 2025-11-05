use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Create test weapon type
fn create_test_weapon_type() -> WeaponType {
    WeaponType {
        name: "Test Machine Gun".to_string(),
        abrv: "TMG".to_string(),
        era: "WWI".to_string(),
        size: 2,
        stats: Stats {
            mass: 1.0,
            drag: 2.0,
            cost: 3.0,
            ..Stats::new()
        },
        damage: 2.0,
        hits: 3,
        ammo: 100,
        ap: 1,
        jam: "8".to_string(),
        reload: 1,
        rapid: false,
        synched: true,
        shells: false,
        can_action: true,
        can_projectile: false,
        deflection: 0,
    }
}

#[test]
fn test_weapon_new() {
    let weapon_type = create_test_weapon_type();
    let weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    assert!(!weapon.get_fixed());
    assert!(weapon.get_wing());
    assert!(!weapon.get_covered());
    assert_eq!(weapon.get_count(), 1);
    assert_eq!(weapon.get_synchronization(), SynchronizationType::Interrupt);
}

#[test]
fn test_weapon_new_fixed() {
    let weapon_type = create_test_weapon_type();
    let weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        true,
    );

    assert!(weapon.get_fixed());
    assert_eq!(weapon.get_synchronization(), SynchronizationType::None);
}

#[test]
fn test_set_fixed() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.set_fixed(true);
    assert!(weapon.get_fixed());

    weapon.set_fixed(false);
    assert!(!weapon.get_fixed());
    assert_eq!(weapon.get_synchronization(), SynchronizationType::None);
}

#[test]
fn test_set_wing() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.canwing = true;
    weapon.set_wing(true);
    assert!(weapon.get_wing());
    assert_eq!(weapon.get_synchronization(), SynchronizationType::None);
    assert!(!weapon.get_free_accessible());
}

#[test]
fn test_set_count() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.set_count_internal(4, false);
    assert_eq!(weapon.get_count(), 4);

    // Size constraint: 4 * 2 = 8 <= 16, so 4 is ok
    // But 9 * 2 = 18 > 16, so should be reduced
    weapon.set_count_internal(9, false);
    assert_eq!(weapon.get_count(), 8); // 8 * 2 = 16
}

#[test]
fn test_set_count_spinner_limits() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        true,
    );

    weapon.can_synchronize = true;
    weapon.can_spinner = true;
    weapon.set_synchronization(SynchronizationType::Spinner);
    weapon.set_count_internal(4, false);

    // Spinner forces count to 1
    assert_eq!(weapon.get_count(), 1);
}

#[test]
fn test_can_wing() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.canwing = false;
    assert!(!weapon.can_wing());

    weapon.canwing = true;
    assert!(weapon.can_wing());
}

#[test]
fn test_can_covered() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.wing = true;
    weapon.has_cantilever = true;
    assert!(weapon.can_covered());

    weapon.has_cantilever = false;
    assert!(!weapon.can_covered());
}

#[test]
fn test_set_accessible() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.set_accessible(true);
    assert!(weapon.get_accessible());

    // Free accessible overrides accessible
    weapon.free_accessible = true;
    weapon.set_accessible(true);
    assert!(!weapon.accessible); // Should be false when free_accessible is true
}

#[test]
fn test_set_free_accessible() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.can_free_accessible = true;
    weapon.wing = false;

    weapon.set_free_accessible(true);
    assert!(weapon.get_free_accessible());
    assert!(!weapon.accessible);
}

#[test]
fn test_can_synchronization() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        true,
    );

    weapon.can_synchronize = true;

    let can_sync = weapon.can_synchronization();
    assert_eq!(can_sync.len(), 6);
    // Fixed weapon with can_synchronize should allow some sync types
}

#[test]
fn test_get_jam() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    // Set synchronization to None for base jam test
    weapon.synchronization = SynchronizationType::None;

    // Base jam number is 8
    let (jam, _) = weapon.get_jam();
    assert_eq!(jam, 8);

    // Interrupt adds 1
    weapon.synchronization = SynchronizationType::Interrupt;
    let (jam, _) = weapon.get_jam();
    assert_eq!(jam, 9);

    // Repeating adds another 1
    weapon.repeating = true;
    let (jam, _) = weapon.get_jam();
    assert_eq!(jam, 10);
}

#[test]
fn test_part_stats_basic() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        true,
    );

    weapon.wing = true;
    weapon.covered = false;

    let stats = weapon.part_stats();

    // 1 weapon: mass 1, drag 2 (+ 1 for wing uncovered), cost 3
    assert_eq!(stats.mass, 1.0);
    assert_eq!(stats.drag, 3.0); // 2 + 1
    assert_eq!(stats.cost, 3.0);
}

#[test]
fn test_part_stats_covered() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        true,
    );

    weapon.wing = true;
    weapon.has_cantilever = true; // Required for covered wing weapons
    weapon.covered = true;

    let stats = weapon.part_stats();

    // Covered: cost += 1 (size 2), drag = 0
    assert_eq!(stats.mass, 1.0);
    assert_eq!(stats.drag, 0.0);
    assert_eq!(stats.cost, 4.0); // 3 + 1
}

#[test]
fn test_part_stats_synchronization() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        true,
    );

    weapon.can_synchronize = true;
    weapon.wing = false;
    weapon.synchronization = SynchronizationType::Interrupt;

    let stats = weapon.part_stats();

    // Interrupt adds 2 cost per weapon
    assert_eq!(stats.cost, 5.0); // 3 + 2
}

#[test]
fn test_serialization() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type.clone(),
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.set_count_internal(2, false);
    weapon.set_wing(true);
    weapon.set_covered(true);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    weapon.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut weapon2 = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );
    weapon2.deserialize(&mut deserializer).unwrap();

    assert_eq!(weapon2.get_fixed(), weapon.get_fixed());
    assert_eq!(weapon2.get_wing(), weapon.get_wing());
    assert_eq!(weapon2.get_covered(), weapon.get_covered());
    assert_eq!(weapon2.get_count(), weapon.get_count());
}

#[test]
fn test_json_serialization() {
    let weapon_type = create_test_weapon_type();
    let mut weapon = Weapon::new(
        weapon_type.clone(),
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    weapon.set_count_internal(2, false);
    weapon.set_wing(true);
    weapon.set_covered(true);

    // Serialize to JSON
    let json = weapon.to_json();

    // Deserialize from JSON
    let mut weapon2 = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );
    weapon2.from_json(&json, 12.0);

    assert_eq!(weapon2.get_fixed(), weapon.get_fixed());
    assert_eq!(weapon2.get_wing(), weapon.get_wing());
    assert_eq!(weapon2.get_covered(), weapon.get_covered());
    assert_eq!(weapon2.get_count(), weapon.get_count());
}

#[test]
fn test_get_electrics() {
    let weapon_type = create_test_weapon_type();
    let weapon = Weapon::new(
        weapon_type,
        ActionType::Standard,
        ProjectileType::Bullets,
        false,
    );

    let electrics = weapon.get_electrics();
    assert_eq!(electrics.storage, 0);
    assert_eq!(electrics.equipment.len(), 0);
}
