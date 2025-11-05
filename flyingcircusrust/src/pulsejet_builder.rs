use crate::{
    engine::{EngineInputs, EngineRarity, EngineStats, TypedInputs},
    stats::{rtz, Era, ERA},
};

struct EraData {
    name: &'static str,
    cost: f32,
    drag: f32,
    mass: f32,
    fuel: f32,
    vibe: f32,
    material: f32,
}

const ERA_TABLE: [EraData; 6] = [
    EraData {
        name: "Pioneer",
        cost: 5.0,
        drag: 10.0,
        mass: 10.0,
        fuel: 4.0,
        vibe: 2.5,
        material: 2.0,
    },
    EraData {
        name: "WWI",
        cost: 3.5,
        drag: 25.0,
        mass: 24.0,
        fuel: 3.0,
        vibe: 3.0,
        material: 3.0,
    },
    EraData {
        name: "Roaring 20s",
        cost: 2.5,
        drag: 30.0,
        mass: 50.0,
        fuel: 2.0,
        vibe: 4.0,
        material: 9.0,
    },
    EraData {
        name: "Coming Storm",
        cost: 2.5,
        drag: 30.0,
        mass: 50.0,
        fuel: 2.0,
        vibe: 4.0,
        material: 9.0,
    },
    EraData {
        name: "WWII",
        cost: 1.75,
        drag: 40.0,
        mass: 100.0,
        fuel: 1.0,
        vibe: 5.0,
        material: 24.0,
    },
    EraData {
        name: "Last Hurrah",
        cost: 1.5,
        drag: 50.0,
        mass: 150.0,
        fuel: 0.7,
        vibe: 6.0,
        material: 50.0,
    },
];

struct ValveData {
    name: &'static str,
    scale: f32,
    rumble: f32,
    design_cost: f32,
    reliability: f32,
}

const VALVE_TABLE: [ValveData; 2] = [
    ValveData {
        name: "Valved",
        scale: 1.0,
        rumble: 1.0,
        design_cost: 2.0,
        reliability: 1.0,
    },
    ValveData {
        name: "Valveless",
        scale: 1.1,
        rumble: 0.9,
        design_cost: 1.0,
        reliability: 3.0,
    },
];

pub struct PulsejetBuilder {
    desired_power: i16,
    valve_sel: usize,
    era_sel: usize,
    build_quality: f32,
    overall_quality: f32,
    starter: bool,
    technical_power: f32,
    rarity: EngineRarity,
}

impl PulsejetBuilder {
    pub fn new() -> PulsejetBuilder {
        PulsejetBuilder {
            desired_power: 1,
            valve_sel: 0,
            era_sel: 0,
            build_quality: 1.0,
            overall_quality: 1.0,
            starter: false,
            technical_power: 0.0,
            rarity: EngineRarity::CUSTOM,
        }
    }

    /// Load from EngineInputs
    pub fn from_inputs(inputs: &EngineInputs) -> PulsejetBuilder {
        let mut builder = PulsejetBuilder::new();
        builder.era_sel = inputs.era_sel as usize;
        builder.rarity = inputs.rarity.clone();

        if let TypedInputs::Pulsejet {
            power,
            quality_cost,
            quality_reliability,
            starter,
        } = &inputs.inputs
        {
            builder.desired_power = *power;
            builder.valve_sel = inputs.etype as usize;
            builder.build_quality = *quality_cost;
            builder.overall_quality = *quality_reliability;
            builder.starter = *starter;
        }

        builder
    }

    /// Calculate temporary mass (used in multiple calculations)
    fn temp_mass(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let valve = &VALVE_TABLE[self.valve_sel];

        let starter_mass = if self.starter { 1.0 } else { 0.0 };

        (self.technical_power / era.mass) * valve.scale + starter_mass
    }

    /// Calculate mass
    fn calc_mass(&self) -> f32 {
        rtz((1.0e-6 + self.temp_mass()) as f32) as f32 + 1.0
    }

    /// Calculate drag
    fn calc_drag(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let valve = &VALVE_TABLE[self.valve_sel];

        let drag = (self.technical_power / era.drag) * valve.scale + 1.0;
        rtz((1.0e-6 + self.temp_mass() + drag + 1.0) as f32) as f32
    }

    /// Calculate reliability
    fn calc_reliability(&self) -> i16 {
        let era = &ERA_TABLE[self.era_sel];
        let valve = &VALVE_TABLE[self.valve_sel];

        let reliability = self.desired_power as f32
            / (era.material * valve.reliability * self.overall_quality)
            - 1.0;
        (-reliability).trunc() as i16
    }

    /// Calculate fuel consumption
    fn calc_fuel_consumption(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        rtz((1.0e-6 + 1.1 * self.technical_power * era.fuel) as f32) as f32
    }

    /// Calculate rumble
    fn calc_rumble(&self) -> i16 {
        let era = &ERA_TABLE[self.era_sel];
        let valve = &VALVE_TABLE[self.valve_sel];

        rtz((1.0e-6 + self.technical_power * valve.rumble / (2.0 * era.vibe)) as f32) as i16
    }

    /// Calculate cost
    fn calc_cost(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];

        rtz((1.0e-6 + self.temp_mass() * self.build_quality * era.cost) as f32) as f32
            + 1.0
            + self.calc_rumble() as f32
    }

    /// Verify and clamp values
    fn verify_values(&mut self) {
        self.desired_power = self.desired_power.max(1);
        self.valve_sel = self.valve_sel.min(VALVE_TABLE.len() - 1);
        self.era_sel = self.era_sel.min(ERA_TABLE.len() - 1);
        self.build_quality = self.build_quality.max(0.01);
        self.overall_quality = self.overall_quality.max(0.01);
        self.build_quality = self.build_quality.max(self.overall_quality);
        self.overall_quality = self.build_quality;
    }

    /// Calculate design cost (for custom engines)
    pub fn design_cost(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let valve = &VALVE_TABLE[self.valve_sel];

        let starter_cost = if self.starter { 3.0 } else { 0.0 };

        let cost = self.technical_power * era.cost / valve.design_cost;
        rtz((1.0e-6 + 1.0 + self.build_quality * (cost + starter_cost)) as f32) as f32
    }

    /// Generate engine name
    fn generate_name(&self) -> String {
        let valved = if self.valve_sel == 0 { "V" } else { "" };
        format!(
            "Pulsejet P{}-{} ({})",
            valved, self.desired_power, ERA_TABLE[self.era_sel].name
        )
    }

    /// Build EngineStats from current configuration
    pub fn build(&mut self) -> EngineStats {
        self.verify_values();

        let mut estats = EngineStats::new();
        estats.name = self.generate_name();
        estats.stats.power = self.desired_power as f32;

        // Technical power is 4/3 of desired power
        self.technical_power = rtz((1.0e-6 + self.desired_power as f32 * 4.0 / 3.0) as f32) as f32;

        estats.stats.mass = self.calc_mass() as f32;
        estats.stats.drag = self.calc_drag() as f32;
        estats.stats.reliability = self.calc_reliability() as f32;
        estats.stats.fuelconsumption = self.calc_fuel_consumption() as f32;
        estats.rumble = self.calc_rumble();
        estats.stats.cost = self.calc_cost() as f32;
        estats.overspeed = 100;
        estats.altitude = 29;
        estats.pulsejet = true;

        estats.stats.eras.push(Era {
            name: estats.name.clone(),
            era: match self.era_sel {
                0 => ERA::Pioneer,
                1 => ERA::WWI,
                2 => ERA::Roaring20s,
                3 => ERA::ComingStorm,
                4 => ERA::WWII,
                5 => ERA::LastHurrah,
                _ => ERA::Pioneer,
            },
        });

        estats.rarity = self.rarity.clone();

        // Add rumble to mass and mass to drag (from TypeScript lines 152-153)
        estats.stats.mass += estats.rumble as f32;
        estats.stats.drag += estats.stats.mass;

        estats
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::serialization::JSSerializable;

    #[test]
    fn test_pulsejet_basic() {
        // Test a basic pulsejet configuration
        let json_str = r#"{
            "name": "Pulsejet PV-20 (WWI)",
            "engine_type": 1,
            "type": 0,
            "era_sel": 1,
            "power": 20,
            "quality_cost": 1.0,
            "quality_rely": 1.0,
            "starter": false
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let mut builder = PulsejetBuilder::from_inputs(&inputs);
        let stats = builder.build();

        // Verify it's a pulsejet
        assert!(stats.pulsejet);
        assert_eq!(stats.stats.power, 20.0);
        assert_eq!(stats.overspeed, 100);
        assert_eq!(stats.altitude, 29);

        // Basic sanity checks
        assert!(stats.stats.mass > 0.0);
        assert!(stats.stats.drag > 0.0);
        assert!(stats.stats.fuelconsumption > 0.0);
        assert!(stats.rumble > 0);
    }

    #[test]
    fn test_pulsejet_valveless() {
        // Test valveless pulsejet (type 1)
        let json_str = r#"{
            "name": "Pulsejet P-30 (WWII)",
            "engine_type": 1,
            "type": 1,
            "era_sel": 4,
            "power": 30,
            "quality_cost": 1.0,
            "quality_rely": 1.0,
            "starter": true
        }"#;

        let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
        let mut inputs = EngineInputs::new();
        inputs.from_json(&json, 100.0);

        let mut builder = PulsejetBuilder::from_inputs(&inputs);
        let stats = builder.build();

        assert!(stats.pulsejet);
        assert_eq!(stats.stats.power, 30.0);

        // Valveless should have different characteristics than valved
        // (testing the valve type affects calculations)
        assert!(stats.stats.mass > 0.0);
    }

    #[test]
    fn test_himmilgard_pulsejet_calculations() {
        // Test specific pulsejets from the Himmilgard Pulsejet CSV
        // CSV format: name, power, mass, drag, cooling, reliability, fuelconsumption, overspeed, cost, rarity
        let test_cases = vec![
            // Pulsejet PV-5 (WWI)
            (
                r#"{
                    "name": "Pulsejet PV-5 (WWI)",
                    "engine_type": 1,
                    "type": 0,
                    "era_sel": 1,
                    "power": 5,
                    "quality_cost": 1,
                    "quality_rely": 1,
                    "starter": false,
                    "rarity": 1
                }"#,
                (5.0, 2.0, 4.0, 0.0, 0.0, 19.0, 100, 2.0),
            ),
            // Pulsejet PV-10 (WWI)
            (
                r#"{
                    "name": "Pulsejet PV-10 (WWI)",
                    "engine_type": 1,
                    "type": 0,
                    "era_sel": 1,
                    "power": 10,
                    "quality_cost": 1,
                    "quality_rely": 1,
                    "starter": false,
                    "rarity": 1
                }"#,
                (10.0, 3.0, 6.0, 0.0, -2.0, 42.0, 100, 4.0),
            ),
            // Pulsejet PV-15 (WWI)
            (
                r#"{
                    "name": "Pulsejet PV-15 (WWI)",
                    "engine_type": 1,
                    "type": 0,
                    "era_sel": 1,
                    "power": 15,
                    "quality_cost": 1,
                    "quality_rely": 1,
                    "starter": false,
                    "rarity": 1
                }"#,
                (15.0, 4.0, 7.0, 0.0, -4.0, 66.0, 100, 6.0),
            ),
        ];

        for (
            json_str,
            (
                exp_power,
                exp_mass,
                exp_drag,
                exp_cooling,
                exp_reliability,
                exp_fuel,
                exp_overspeed,
                exp_cost,
            ),
        ) in test_cases
        {
            let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
            let mut inputs = EngineInputs::new();
            inputs.from_json(&json, 100.0);

            let mut builder = PulsejetBuilder::from_inputs(&inputs);
            let stats = builder.build();

            // Extract engine name for error messages
            let engine_name = &stats.name;

            // Verify pulsejet-specific properties
            assert!(stats.pulsejet, "{}: Should be a pulsejet", engine_name);
            assert_eq!(stats.altitude, 29, "{}: Altitude mismatch", engine_name);

            // Compare stats (exact match with CSV)
            assert_eq!(
                stats.stats.power, exp_power,
                "{}: Power mismatch",
                engine_name
            );
            assert_eq!(stats.stats.mass, exp_mass, "{}: Mass mismatch", engine_name);
            assert_eq!(stats.stats.drag, exp_drag, "{}: Drag mismatch", engine_name);
            assert_eq!(
                stats.stats.cooling, exp_cooling,
                "{}: Cooling mismatch",
                engine_name
            );
            assert_eq!(
                stats.stats.reliability, exp_reliability,
                "{}: Reliability mismatch",
                engine_name
            );
            assert_eq!(
                stats.stats.fuelconsumption, exp_fuel,
                "{}: Fuel consumption mismatch",
                engine_name
            );
            assert_eq!(
                stats.overspeed, exp_overspeed,
                "{}: Overspeed mismatch",
                engine_name
            );
            assert_eq!(stats.stats.cost, exp_cost, "{}: Cost mismatch", engine_name);
        }
    }
}
