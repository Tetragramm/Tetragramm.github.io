use super::*;
use crate::engines::{CowlEntry, MountEntry, MountType};
use crate::serialization::JSSerializable;
use crate::stats::Stats;
use std::rc::Rc;

#[cfg(test)]
mod tests {
    use super::*;
    use crate::serialization::JSSerializable;

    #[test]
    fn test_engine_inputs_part_stats_propeller() {
        // Test propeller engine integration
        let json_str = r#"{
            "name": "Test Propeller",
            "engine_type": 0,
            "type": 5,
            "era_sel": 1,
            "displacement": 14.72,
            "compression": 5,
            "cyl_per_row": 9,
            "rows": 1,
            "RPM_boost": 0.78,
            "material_fudge": 0.9,
            "quality_fudge": 1.1,
            "compressor_type": 0,
            "compressor_count": 0,
            "min_IAF": 0,
            "upgrades": [false, false, false, false],
            "rarity": 1
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Test Propeller");
        assert_eq!(stats.stats.power, 14.0);
        assert!(stats.stats.mass > 0.0);
        assert!(!stats.pulsejet);
    }

    #[test]
    fn test_engine_inputs_part_stats_pulsejet() {
        // Test pulsejet engine integration
        let json_str = r#"{
            "name": "Test Pulsejet",
            "engine_type": 1,
            "type": 0,
            "era_sel": 1,
            "power": 10,
            "quality_cost": 1,
            "quality_rely": 1,
            "starter": false,
            "rarity": 1
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Pulsejet PV-10 (WWI)");
        assert_eq!(stats.stats.power, 10.0);
        assert!(stats.pulsejet);
        assert_eq!(stats.overspeed, 100);
        assert_eq!(stats.altitude, 29);
    }

    #[test]
    fn test_engine_inputs_part_stats_turbine() {
        // Test turbine engine integration
        let json_str = r#"{
            "name": "Test Turbojet",
            "engine_type": 2,
            "type": 0,
            "era_sel": 2,
            "flow_adjustment": 0,
            "diameter": 0.7,
            "compression_ratio": 5,
            "bypass_ratio": 0,
            "upgrades": [false, false, false, false],
            "rarity": 0
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Test Turbojet");
        assert_eq!(stats.stats.power, 110.0);
        assert!(!stats.pulsejet);
        assert_eq!(stats.overspeed, 100);
        assert_eq!(stats.altitude, 59);
    }

    #[test]
    fn test_engine_inputs_part_stats_electric() {
        // Test electric engine integration
        let json_str = r#"{
            "name": "Test Electric",
            "engine_type": 3,
            "power": 10,
            "era_sel": 1,
            "winding_sel": 1,
            "diameter": 0,
            "material_fudge": 2,
            "quality_fudge": 0.5
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let stats = inputs.part_stats();

        assert_eq!(stats.name, "Test Electric");
        assert_eq!(stats.stats.power, 10.0);
        assert!(!stats.pulsejet);
        assert_eq!(stats.altitude, 100);
        assert_eq!(stats.stats.fuelconsumption, 0.0);
        assert!(stats.stats.charge < 0.0); // Electric motors draw power
    }

    // Helper functions for setter tests
    fn create_test_mounts() -> Rc<Vec<MountEntry>> {
        use crate::engines::MountType;
        Rc::new(vec![
            MountEntry {
                name: "Tractor".to_string(),
                mount_type: MountType::Wing,
                stats: Stats::new(),
                strain_factor: 0.0,
                drag_factor: 0.0,
                power_factor: 1.0,
                require_extended_driveshafts: false,
                require_tail: false,
                helicopter: false,
                turbine: false,
                pushpull: false,
            },
            MountEntry {
                name: "Fuselage Push-Pull".to_string(),
                mount_type: MountType::Fuselage,
                stats: Stats::new(),
                strain_factor: 0.0,
                drag_factor: 0.0,
                power_factor: 1.0,
                require_extended_driveshafts: false,
                require_tail: false,
                helicopter: false,
                turbine: false,
                pushpull: true,
            },
        ])
    }

    fn create_test_cowls() -> Rc<Vec<CowlEntry>> {
        Rc::new(vec![
            CowlEntry {
                name: "No Cowling".to_string(),
                stats: Stats::new(),
                drag_factor: 1.0,
                mass_per_drag: 0.0,
                for_air_cooled: true,
                for_liquid_cooled: true,
                for_rotary: true,
            },
            CowlEntry {
                name: "Air Cowl".to_string(),
                stats: Stats::new(),
                drag_factor: 0.8,
                mass_per_drag: 0.5,
                for_air_cooled: true,
                for_liquid_cooled: false,
                for_rotary: false,
            },
        ])
    }

    #[test]
    fn test_set_cooling_validation() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Set cooling with cooling required
        engine.etype_stats.stats.cooling = 5.0;
        engine.set_cooling(3);
        assert_eq!(engine.cooling_count, 3, "Should accept valid cooling count");

        // Test minimum when cooling needed
        engine.set_cooling(0);
        assert_eq!(
            engine.cooling_count, 1,
            "Should enforce minimum of 1 when cooling needed"
        );

        // Test maximum enforcement
        engine.set_cooling(10);
        assert_eq!(
            engine.cooling_count, 5,
            "Should enforce maximum based on engine stats"
        );

        // Test with push-pull (doubles maximum)
        engine.is_push_pull = true;
        engine.set_cooling(8);
        assert_eq!(
            engine.cooling_count, 8,
            "Should allow higher cooling with push-pull"
        );

        engine.set_cooling(15);
        assert_eq!(
            engine.cooling_count, 10,
            "Should enforce doubled maximum with push-pull"
        );
    }

    #[test]
    fn test_set_gear_count_and_reliability() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Set valid gear count
        engine.set_gear_count(5);
        assert_eq!(engine.gear_count, 5, "Should set gear count");

        // Set reliability higher than count
        engine.set_gear_reliability(10);
        assert_eq!(
            engine.geared_reliability, 5,
            "Reliability should be capped at gear count"
        );

        // Reduce gear count, reliability should adjust
        engine.geared_reliability = 5;
        engine.set_gear_count(3);
        assert_eq!(
            engine.geared_reliability, 3,
            "Reliability should reduce when gear count reduces"
        );

        // Test negative input
        engine.set_gear_count(-5);
        assert_eq!(engine.gear_count, 0, "Should reject negative gear count");
    }

    #[test]
    fn test_set_torque_to_struct() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Enable without push-pull
        engine.set_torque_to_struct(true);
        assert!(
            !engine.torque_to_struct,
            "Should not enable without push-pull"
        );

        // Enable with push-pull
        engine.is_push_pull = true;
        engine.set_torque_to_struct(true);
        assert!(engine.torque_to_struct, "Should enable with push-pull");

        // Disable push-pull
        engine.is_push_pull = false;
        engine.set_torque_to_struct(true);
        assert!(
            !engine.torque_to_struct,
            "Should disable when push-pull disabled"
        );
    }

    #[test]
    fn test_set_use_push_pull() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());
        engine.cooling_count = 4;
        engine.mount_sel = 1; // Use push-pull capable mount

        // Enable push-pull
        engine.set_use_push_pull(true);
        assert!(engine.is_push_pull, "Should enable push-pull");
        assert_eq!(engine.cooling_count, 8, "Should double cooling count");

        // Disable push-pull
        engine.set_use_push_pull(false);
        assert!(!engine.is_push_pull, "Should disable push-pull");
        assert_eq!(engine.cooling_count, 4, "Should halve cooling count");
    }

    #[test]
    fn test_set_generator() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());
        engine.gear_count = 5;
        engine.geared_reliability = 3;
        engine.extended_ds = true;

        // Enable generator
        engine.set_generator(true);
        assert!(engine.is_generator, "Should enable generator");
        assert_eq!(engine.gear_count, 0, "Should reset gear count");
        assert_eq!(
            engine.geared_reliability, 0,
            "Should reset gear reliability"
        );
        assert!(!engine.extended_ds, "Should disable extended driveshafts");
        assert!(!engine.is_push_pull, "Should disable push-pull");
    }

    #[test]
    fn test_set_outboard_prop() {
        let mut engine = Engine::new(create_test_mounts(), create_test_cowls());

        // Try to enable without extended driveshaft
        engine.set_outboard_prop(true);
        assert!(
            !engine.outboard_prop,
            "Should not enable without extended driveshaft"
        );

        // Enable with extended driveshaft
        engine.extended_ds = true;
        engine.set_outboard_prop(true);
        assert!(
            engine.outboard_prop,
            "Should enable with extended driveshaft"
        );

        // Disable extended driveshaft
        engine.set_outboard_prop(true);
        engine.extended_ds = false;
        engine.set_outboard_prop(true);
        assert!(
            !engine.outboard_prop,
            "Should disable when extended driveshaft disabled"
        );
    }

    #[test]
    fn test_get_engine_height() {
        let mounts = create_test_mounts();
        let cowls = create_test_cowls();
        let mut engine = Engine::new(mounts, cowls);

        // Test generator height (should be 5)
        engine.is_generator = true;
        assert_eq!(
            engine.get_engine_height(),
            5,
            "Generator should have height 5"
        );

        // Test non-generator
        engine.is_generator = false;

        // Test pulsejet (should be 2)
        engine.mount_sel = 0;
        engine.etype_stats.pulsejet = true;
        assert_eq!(
            engine.get_engine_height(),
            2,
            "Pulsejet should have height 2"
        );
        engine.etype_stats.pulsejet = false;

        // Test internal (should be 2)
        engine.is_internal = true;
        assert_eq!(
            engine.get_engine_height(),
            2,
            "Internal engine should have height 2"
        );
        engine.is_internal = false;

        // Test outboard prop (should be 2)
        engine.outboard_prop = true;
        assert_eq!(
            engine.get_engine_height(),
            2,
            "Outboard prop should have height 2"
        );
        engine.outboard_prop = false;

        // Test default mount (Tractor in this case) - should return -1 or valid height
        engine.mount_sel = 0;
        let height = engine.get_engine_height();
        assert!(height >= -1, "Height should be -1 or higher");
    }
}
