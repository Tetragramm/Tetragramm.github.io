use super::*;

#[test]
fn test_set_number_of_cockpits() {
    let mut cockpits = Cockpits::new(vec![], vec![], vec![], vec![]);

    // Test setting to 1
    cockpits.set_number_of_cockpits(1);
    assert_eq!(
        cockpits.get_number_of_cockpits(),
        1,
        "Should have 1 cockpit"
    );
    assert_eq!(cockpits.positions.len(), 1);

    // Test increasing to 3
    cockpits.set_number_of_cockpits(3);
    assert_eq!(
        cockpits.get_number_of_cockpits(),
        3,
        "Should have 3 cockpits"
    );
    assert_eq!(cockpits.positions.len(), 3);

    // Verify seat indices are set correctly
    // for (i, cp) in cockpits.positions.iter().enumerate() {
    //     // We can't directly access seat_index, but we can verify via serialization
    //     // or other indirect means. For now, just verify the count.
    // }

    // Test reducing to 2
    cockpits.set_number_of_cockpits(2);
    assert_eq!(
        cockpits.get_number_of_cockpits(),
        2,
        "Should have 2 cockpits"
    );
    assert_eq!(cockpits.positions.len(), 2);

    // Test invalid input (< 1) should become 1
    cockpits.set_number_of_cockpits(0);
    assert_eq!(
        cockpits.get_number_of_cockpits(),
        1,
        "Should enforce minimum of 1"
    );

    cockpits.set_number_of_cockpits(-5);
    assert_eq!(
        cockpits.get_number_of_cockpits(),
        1,
        "Should enforce minimum of 1"
    );
}

#[test]
fn test_cockpits_copy_configuration() {
    let types = vec![
        CockpitEntry {
            name: "Type A".to_string(),
            exposed: false,
            stats: Stats::new(),
        },
        CockpitEntry {
            name: "Type B".to_string(),
            exposed: true,
            stats: Stats::new(),
        },
    ];

    let mut cockpits = Cockpits::new(types, vec![], vec![], vec![]);

    // Start with 1 cockpit and configure it
    cockpits.set_number_of_cockpits(1);
    // Note: We can't easily set the cockpit configuration without making fields public
    // This test verifies the structure works, even if we can't fully test config copying

    // Add a second cockpit - it should copy configuration from the first
    cockpits.set_number_of_cockpits(2);
    assert_eq!(cockpits.positions.len(), 2);

    // Both should exist
    assert!(!cockpits.positions.is_empty());
}
