use super::*;
use crate::stats::Stats;

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_radiator() -> Radiator {
        let type_list = vec![
            RadiatorEntry {
                name: "Standard".to_string(),
                stats: Stats::new(),
                dragpercool: 1.0,
            },
            RadiatorEntry {
                name: "Evaporation".to_string(),
                stats: Stats::new(),
                dragpercool: 0.5,
            },
        ];

        let mount_list = vec![
            RadiatorMountEntry {
                name: "Standard Mount".to_string(),
                stats: Stats::new(),
            },
            RadiatorMountEntry {
                name: "High Offset".to_string(),
                stats: Stats::new(),
            },
        ];

        let coolant_list = vec![
            RadiatorCoolantEntry {
                name: "Water".to_string(),
                harden: false,
                flammable: false,
                stats: Stats::new(),
            },
            RadiatorCoolantEntry {
                name: "Glycol".to_string(),
                harden: true,
                flammable: false,
                stats: Stats::new(),
            },
            RadiatorCoolantEntry {
                name: "Oil".to_string(),
                harden: false,
                flammable: true,
                stats: Stats::new(),
            },
        ];

        Radiator::new(type_list, mount_list, coolant_list)
    }

    #[test]
    fn test_set_type_index() {
        let mut rad = create_test_radiator();

        // Valid index
        rad.set_type_index(0);
        assert_eq!(rad.idx_type, 0, "Should set to valid index");

        rad.set_type_index(1);
        assert_eq!(rad.idx_type, 1, "Should set to another valid index");

        // Invalid index (out of bounds) should not change
        let before = rad.idx_type;
        rad.set_type_index(99);
        assert_eq!(rad.idx_type, before, "Should not change on invalid index");
    }

    #[test]
    fn test_set_mount_index_with_validation() {
        let mut rad = create_test_radiator();

        // Try to set "High Offset" without parasol - should fail
        rad.has_parasol = false;
        rad.idx_mount = 0;
        rad.set_mount_index(1); // High Offset
        assert_eq!(
            rad.idx_mount, 0,
            "Should not allow High Offset without parasol"
        );

        // Enable parasol and try again - should succeed
        rad.has_parasol = true;
        rad.set_mount_index(1); // High Offset
        assert_eq!(rad.idx_mount, 1, "Should allow High Offset with parasol");

        // Standard mount should always work
        rad.has_parasol = false;
        rad.set_mount_index(0);
        assert_eq!(
            rad.idx_mount, 0,
            "Should allow Standard Mount without parasol"
        );
    }

    #[test]
    fn test_set_coolant_index() {
        let mut rad = create_test_radiator();

        // Valid indices
        rad.set_coolant_index(0);
        assert_eq!(rad.idx_coolant, 0, "Should set to water");

        rad.set_coolant_index(1);
        assert_eq!(rad.idx_coolant, 1, "Should set to glycol");

        rad.set_coolant_index(2);
        assert_eq!(rad.idx_coolant, 2, "Should set to oil");

        // Invalid index should not change
        let before = rad.idx_coolant;
        rad.set_coolant_index(99);
        assert_eq!(
            rad.idx_coolant, before,
            "Should not change on invalid index"
        );
    }

    #[test]
    fn test_set_harden() {
        let mut rad = create_test_radiator();

        // Test setting harden flag
        rad.set_harden(true);
        assert!(rad.harden_cool, "Should enable harden");

        rad.set_harden(false);
        assert!(!rad.harden_cool, "Should disable harden");
    }

    #[test]
    fn test_verify_harden_forces_true() {
        let mut rad = create_test_radiator();

        // Set to glycol (which requires harden)
        rad.idx_coolant = 1;
        rad.harden_cool = false;

        // verify_harden should force it to true
        rad.verify_harden();
        assert!(rad.harden_cool, "Should force harden for glycol");

        // Set to water (doesn't require harden)
        rad.idx_coolant = 0;
        rad.harden_cool = false;
        rad.verify_harden();
        assert!(!rad.harden_cool, "Should not force harden for water");
    }

    #[test]
    fn test_is_type_enabled_evaporation() {
        let mut rad = create_test_radiator();

        // Set up with 2 engines
        rad.engine_count = 2;
        rad.metal_area = 5.0; // Less than 2 * 5 = 10

        let enabled = rad.is_type_enabled();
        assert!(enabled[0], "Standard should always be enabled");
        assert!(
            !enabled[1],
            "Evaporation should not be enabled (insufficient metal area)"
        );

        // Increase metal area
        rad.metal_area = 15.0; // Greater than 2 * 5 = 10
        let enabled = rad.is_type_enabled();
        assert!(enabled[0], "Standard should still be enabled");
        assert!(enabled[1], "Evaporation should now be enabled");
    }

    #[test]
    fn test_is_mount_enabled_high_offset() {
        let mut rad = create_test_radiator();

        // Without parasol
        rad.has_parasol = false;
        let enabled = rad.is_mount_enabled();
        assert!(enabled[0], "Standard Mount should always be enabled");
        assert!(
            !enabled[1],
            "High Offset should not be enabled without parasol"
        );

        // With parasol
        rad.has_parasol = true;
        let enabled = rad.is_mount_enabled();
        assert!(enabled[0], "Standard Mount should still be enabled");
        assert!(enabled[1], "High Offset should be enabled with parasol");
    }

    #[test]
    fn test_get_is_flammable() {
        let mut rad = create_test_radiator();

        // Water is not flammable
        rad.idx_coolant = 0;
        assert!(!rad.get_is_flammable(), "Water should not be flammable");

        // Glycol is not flammable
        rad.idx_coolant = 1;
        assert!(!rad.get_is_flammable(), "Glycol should not be flammable");

        // Oil is flammable
        rad.idx_coolant = 2;
        assert!(rad.get_is_flammable(), "Oil should be flammable");
    }
}
