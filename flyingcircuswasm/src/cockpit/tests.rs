use super::Cockpit;
use std::rc::Rc;

#[test]
fn test_set_bombsight_quality() {
    let types = Rc::new(vec![]);
    let upgrades = Rc::new(vec![]);
    let safety = Rc::new(vec![]);
    let gunsights = Rc::new(vec![]);
    let mut cockpit = Cockpit::new(&types, &upgrades, &safety, &gunsights);

    // Test setting to 0
    cockpit.bombsight = 0;
    cockpit.set_bombsight_quality(0);
    assert_eq!(cockpit.bombsight, 0, "0 should stay 0");

    // Test values below 2 become 0 when not adjacent
    cockpit.bombsight = 10; // Set to a non-adjacent value first
    cockpit.set_bombsight_quality(1);
    assert_eq!(cockpit.bombsight, 0, "1 should become 0 when not adjacent");

    // Test normalization to multiples of 3 plus 1 (when not adjacent)
    cockpit.bombsight = 0; // Reset to non-adjacent
    cockpit.set_bombsight_quality(4);
    assert_eq!(cockpit.bombsight, 4, "4 should stay 4 (4 = 3*1 + 1)");

    // Test normalization: num - (num % 3) + 1
    // Valid values are 1, 4, 7, 10, 13, ... (multiples of 3 plus 1)
    cockpit.bombsight = 10; // Set to non-adjacent first
    cockpit.set_bombsight_quality(5);
    assert_eq!(cockpit.bombsight, 4, "5 normalizes to 4 (5 - 2 + 1)");

    cockpit.bombsight = 10;
    cockpit.set_bombsight_quality(6);
    assert_eq!(cockpit.bombsight, 7, "6 normalizes to 7 (6 - 0 + 1)");

    cockpit.bombsight = 10;
    cockpit.set_bombsight_quality(7);
    assert_eq!(cockpit.bombsight, 7, "7 stays 7 (7 = 3*2 + 1)");

    cockpit.bombsight = 10;
    cockpit.set_bombsight_quality(8);
    assert_eq!(cockpit.bombsight, 7, "8 normalizes to 7 (8 - 1 + 1)");

    cockpit.bombsight = 10;
    cockpit.set_bombsight_quality(9);
    assert_eq!(cockpit.bombsight, 7, "9 normalizes to 7 (9 - 2 + 1)");

    cockpit.bombsight = 10;
    cockpit.set_bombsight_quality(10);
    assert_eq!(cockpit.bombsight, 10, "10 stays 10 (10 - 0 + 1)");

    // Test incrementing by 1 (arrow key) jumps by 3
    cockpit.bombsight = 4;
    cockpit.set_bombsight_quality(5); // Detected as +1
    assert_eq!(cockpit.bombsight, 7, "4+1 should jump to 7");

    // Test decrementing by 1 (arrow key) jumps by 3
    cockpit.bombsight = 7;
    cockpit.set_bombsight_quality(6); // Detected as -1
    assert_eq!(cockpit.bombsight, 4, "7-1 should jump to 4");

    // Test decrementing from 4 to 3 jumps to 1, which becomes 0
    cockpit.bombsight = 4;
    cockpit.set_bombsight_quality(3); // Detected as -1
    assert_eq!(cockpit.bombsight, 0, "4-1 jumps to 1, which becomes 0");

    // Test incrementing from 0 by 1 jumps to 3, normalizes to 4
    cockpit.bombsight = 0;
    cockpit.set_bombsight_quality(1); // Detected as +1
    assert_eq!(cockpit.bombsight, 4, "0+1 jumps to 3, normalizes to 4");
}
