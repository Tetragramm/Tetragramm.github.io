use super::*;
use crate::part::Part;
use crate::serialization::{Deserializer, JSSerializable, Serializable, Serializer};
use crate::stats::Stats;

/// Create test reference lists
fn create_test_lists() -> (
    Vec<SurfaceEntry>,
    Vec<StaggerEntry>,
    Vec<DeckEntry>,
    Vec<LongestWingEntry>,
) {
    let skin_list = vec![
        SurfaceEntry {
            name: "Cloth Canvas".to_string(),
            stats: Stats::new(),
            flammable: false,
            strainfactor: 1.0,
            dragfactor: 1.0,
            metal: false,
            transparent: false,
        },
        SurfaceEntry {
            name: "Treated Paper".to_string(),
            stats: Stats {
                mass: -0.25,
                ..Stats::new()
            },
            flammable: true,
            strainfactor: 1.0,
            dragfactor: 1.0,
            metal: false,
            transparent: false,
        },
        SurfaceEntry {
            name: "Celluloid".to_string(),
            stats: Stats::new(),
            flammable: false,
            strainfactor: 1.0,
            dragfactor: 1.0,
            metal: false,
            transparent: true,
        },
    ];

    let stagger_list = vec![
        StaggerEntry {
            name: "Monoplane".to_string(),
            stats: Stats::new(),
            inline: false,
            wing_count: 1,
            hstab: true,
        },
        StaggerEntry {
            name: "Tandem".to_string(),
            stats: Stats {
                pitchstab: 4.0,
                ..Stats::new()
            },
            inline: true,
            wing_count: 20,
            hstab: false,
        },
        StaggerEntry {
            name: "Extreme Positive".to_string(),
            stats: Stats {
                pitchstab: 2.0,
                liftbleed: -2.0,
                ..Stats::new()
            },
            inline: false,
            wing_count: 20,
            hstab: true,
        },
        StaggerEntry {
            name: "Positive".to_string(),
            stats: Stats {
                pitchstab: 1.0,
                liftbleed: -1.0,
                ..Stats::new()
            },
            inline: false,
            wing_count: 20,
            hstab: true,
        },
        StaggerEntry {
            name: "Unstaggered".to_string(),
            stats: Stats::new(),
            inline: false,
            wing_count: 20,
            hstab: true,
        },
    ];

    let deck_list = vec![
        DeckEntry {
            name: "Parasol".to_string(),
            stats: Stats {
                pitchstab: 3.0,
                maxstrain: -10.0,
                liftbleed: -2.0,
                visibility: -1.0,
                ..Stats::new()
            },
            limited: false,
        },
        DeckEntry {
            name: "Shoulder".to_string(),
            stats: Stats {
                pitchstab: 2.0,
                liftbleed: -1.0,
                visibility: -1.0,
                ..Stats::new()
            },
            limited: true, // Only 1 wing allowed
        },
        DeckEntry {
            name: "Mid".to_string(),
            stats: Stats::new(),
            limited: true, // Only 1 wing allowed
        },
        DeckEntry {
            name: "Low".to_string(),
            stats: Stats {
                pitchstab: -2.0,
                crashsafety: -1.0,
                liftbleed: -1.0,
                ..Stats::new()
            },
            limited: true, // Only 1 wing allowed
        },
        DeckEntry {
            name: "Gear".to_string(),
            stats: Stats {
                pitchstab: -3.0,
                maxstrain: -10.0,
                crashsafety: -1.0,
                liftbleed: -2.0,
                ..Stats::new()
            },
            limited: false,
        },
    ];

    let long_list = vec![
        LongestWingEntry {
            stats: Stats {
                latstab: 1.0,
                control: -1.0,
                ..Stats::new()
            },
            dragfactor: 1.0,
        },
        LongestWingEntry {
            stats: Stats {
                control: -1.0,
                ..Stats::new()
            },
            dragfactor: 1.0,
        },
        LongestWingEntry {
            stats: Stats::new(),
            dragfactor: 0.9, // Mid deck gets drag reduction
        },
        LongestWingEntry {
            stats: Stats {
                latstab: -1.0,
                control: 2.0,
                ..Stats::new()
            },
            dragfactor: 1.0,
        },
        LongestWingEntry {
            stats: Stats {
                latstab: -1.0,
                control: 3.0,
                ..Stats::new()
            },
            dragfactor: 1.0,
        },
    ];

    (skin_list, stagger_list, deck_list, long_list)
}

#[test]
fn test_wings_new() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    assert_eq!(wings.get_wing_list().len(), 0);
    assert_eq!(wings.get_mini_wing_list().len(), 0);
    assert_eq!(wings.get_stagger(), -1); // No wings = -1
    assert!(!wings.get_swept());
    assert!(!wings.get_closed());
}

#[test]
fn test_add_full_wing() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    let wing = WingType {
        surface: 0,
        area: 8,
        span: 8,
        dihedral: 0,
        anhedral: 0,
        gull: false,
        deck: WingDeck::Mid as usize,
    };

    wings.set_full_wing(0, wing);

    assert_eq!(wings.get_wing_list().len(), 1);
    assert_eq!(wings.get_wing_list()[0].area, 8);
    assert_eq!(wings.get_stagger(), 0); // Auto-set to monoplane
}

#[test]
fn test_biplane_auto_stagger() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // Add first wing
    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Parasol as usize,
        },
    );

    // Add second wing - should auto-switch to biplane stagger
    wings.set_full_wing(
        1,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Low as usize,
        },
    );

    assert_eq!(wings.get_wing_list().len(), 2);
    assert_eq!(wings.get_stagger(), 4); // Unstaggered biplane
}

#[test]
fn test_limited_deck_restriction() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // Shoulder deck is limited (only 1 wing allowed)
    let shoulder_deck = WingDeck::Shoulder as usize;

    // Add first wing at shoulder
    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: shoulder_deck,
        },
    );

    // Try to add second wing at shoulder - should be rejected
    assert!(!wings.can_add_full_wing(shoulder_deck));
}

#[test]
fn test_mini_full_wing_conflict() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // Add full wing at Mid deck
    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Mid as usize,
        },
    );

    // Try to add mini wing at same deck - should be rejected
    assert!(!wings.can_add_mini_wing(WingDeck::Mid as usize));
}

#[test]
fn test_gull_wing_restrictions() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // Shoulder can never be gull
    assert!(!wings.can_gull(WingDeck::Shoulder as usize));

    // Parasol can be gull
    assert!(wings.can_gull(WingDeck::Parasol as usize));
}

#[test]
fn test_sesquiplane_detection() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // Add big wing
    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 10,
            span: 10,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Parasol as usize,
        },
    );

    // Add small wing (half size)
    wings.set_full_wing(
        1,
        WingType {
            surface: 0,
            area: 5,
            span: 5,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Low as usize,
        },
    );

    let (is_sesqui, deck, _) = wings.get_is_sesquiplane();
    assert!(is_sesqui);
    assert_eq!(deck, WingDeck::Parasol as i16);
}

#[test]
fn test_swept_closed_validation() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // No wings - can't be swept or closed
    assert!(!wings.can_swept());
    assert!(!wings.can_closed());

    // Add one wing
    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Mid as usize,
        },
    );

    // Can sweep with 1 wing
    assert!(wings.can_swept());
    // Can't close with only 1 wing
    assert!(!wings.can_closed());

    // Add second wing
    wings.set_full_wing(
        1,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Low as usize,
        },
    );

    // Now can both sweep and close
    assert!(wings.can_swept());
    assert!(wings.can_closed());
}

#[test]
fn test_part_stats_monoplane() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Mid as usize,
        },
    );

    let stats = wings.part_stats();

    // Monoplane should have wing area
    assert_eq!(stats.wingarea, 8.0);

    // Should have drag from wings
    assert!(stats.drag > 0.0);

    // Should include monoplane Mid deck bonus (drag reduction)
    // Mid deck dragfactor is 0.9 in our test data
}

#[test]
fn test_serialization() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(
        skin_list.clone(),
        stagger_list.clone(),
        deck_list.clone(),
        long_list.clone(),
    );

    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 8,
            span: 8,
            dihedral: 1,
            anhedral: 0,
            gull: false,
            deck: WingDeck::Mid as usize,
        },
    );
    wings.set_swept(true);

    // Serialize
    let mut serializer = Serializer::new();
    serializer.push_string("12.0").unwrap();
    wings.serialize(&mut serializer).unwrap();

    // Deserialize
    let buffer = serializer.into_inner();
    let mut deserializer = Deserializer::new(&buffer).unwrap();
    deserializer.get_string().unwrap(); // Skip version
    let mut wings2 = Wings::new(skin_list, stagger_list, deck_list, long_list);
    wings2.deserialize(&mut deserializer).unwrap();

    assert_eq!(wings2.get_wing_list().len(), 1);
    assert_eq!(wings2.get_wing_list()[0].area, 8);
    assert_eq!(wings2.get_wing_list()[0].dihedral, 1);
    assert_eq!(wings2.get_swept(), true);
}

#[test]
fn test_json_serialization() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(
        skin_list.clone(),
        stagger_list.clone(),
        deck_list.clone(),
        long_list.clone(),
    );

    wings.set_full_wing(
        0,
        WingType {
            surface: 0,
            area: 10,
            span: 10,
            dihedral: 2,
            anhedral: 1,
            gull: true,
            deck: WingDeck::Parasol as usize,
        },
    );
    wings.set_closed(true);

    // Serialize to JSON
    let json = wings.to_json();

    // Deserialize from JSON
    let mut wings2 = Wings::new(skin_list, stagger_list, deck_list, long_list);
    wings2.from_json(&json, 12.0);

    assert_eq!(wings2.get_wing_list().len(), 1);
    assert_eq!(wings2.get_wing_list()[0].area, 10);
    assert_eq!(wings2.get_wing_list()[0].gull, true);
    assert_eq!(wings2.get_wing_list()[0].dihedral, 2);
    assert_eq!(wings2.get_wing_list()[0].anhedral, 1);
    // Closed should be disabled for single wing
    assert_eq!(wings2.get_closed(), false);
}

#[test]
fn test_version_migration_gull() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let mut wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    // Simulate old version JSON (before 11.15 - no gull field)
    let old_json = serde_json::json!({
        "wing_list": [
            {
                "surface": 0,
                "area": 8,
                "span": 8,
                "dihedral": 0,
                "anhedral": 0,
                "deck": 0
            }
        ],
        "mini_wing_list": [],
        "wing_stagger": 0,
        "is_swept": false,
        "is_closed": false
    });

    wings.from_json(&old_json, 11.0); // Old version

    assert_eq!(wings.get_wing_list().len(), 1);
    assert_eq!(wings.get_wing_list()[0].gull, false); // Should default to false
}

#[test]
fn test_get_electrics() {
    let (skin_list, stagger_list, deck_list, long_list) = create_test_lists();
    let wings = Wings::new(skin_list, stagger_list, deck_list, long_list);

    let electrics = wings.get_electrics();
    assert_eq!(electrics.storage, 0);
    assert_eq!(electrics.equipment.len(), 0); // No solar panel wings in test data
}
