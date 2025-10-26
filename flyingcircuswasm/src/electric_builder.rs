use crate::{
    engine::{EngineInputs, EngineRarity, EngineStats, TypedInputs},
    stats::{rtz, Era, ERA},
};

struct EraData {
    name: &'static str,
    draw: i16,
    draw_factor: f64,
    mass_factor: f64,
    reliability: i16,
    cost_factor: f64,
    overspeed: i16,
}

const ERA_TABLE: [EraData; 6] = [
    EraData { name: "Pioneer", draw: 3, draw_factor: 2.0 / 5.0, mass_factor: 2.0 / 5.0, reliability: -1, cost_factor: 1.0 / 2.5, overspeed: 20 },
    EraData { name: "WWI", draw: 1, draw_factor: 2.0 / 5.0, mass_factor: 1.0 / 3.0, reliability: 0, cost_factor: 1.0 / 2.25, overspeed: 25 },
    EraData { name: "Roaring 20s", draw: 1, draw_factor: 2.0 / 7.0, mass_factor: 2.0 / 7.0, reliability: 1, cost_factor: 1.0 / 2.0, overspeed: 30 },
    EraData { name: "Coming Storm", draw: 0, draw_factor: 2.0 / 7.0, mass_factor: 1.0 / 4.0, reliability: 2, cost_factor: 1.0 / 1.9, overspeed: 35 },
    EraData { name: "WWII", draw: 0, draw_factor: 1.0 / 4.0, mass_factor: 1.0 / 5.0, reliability: 3, cost_factor: 1.0 / 1.8, overspeed: 40 },
    EraData { name: "Last Hurrah", draw: 0, draw_factor: 1.0 / 5.0, mass_factor: 1.0 / 6.0, reliability: 4, cost_factor: 1.0 / 1.75, overspeed: 45 },
];

struct WindingData {
    name: &'static str,
    draw_mod: f64,
    mass: i16,
    drag: i16,
    cost_factor: f64,
    reliability: i16,
}

const WINDING_TABLE: [WindingData; 7] = [
    WindingData { name: "Aluminum", draw_mod: 1.1, mass: -2, drag: 1, cost_factor: 1.0, reliability: 0 },
    WindingData { name: "Copper", draw_mod: 1.0, mass: 0, drag: 0, cost_factor: 1.0, reliability: 0 },
    WindingData { name: "Silver", draw_mod: 0.95, mass: 1, drag: 0, cost_factor: 1.1, reliability: 0 },
    WindingData { name: "Electrum", draw_mod: 0.9, mass: 2, drag: 0, cost_factor: 1.3, reliability: 1 },
    WindingData { name: "Platinum", draw_mod: 0.75, mass: 3, drag: 0, cost_factor: 2.0, reliability: 2 },
    WindingData { name: "Screamer Sinew", draw_mod: 0.9, mass: 0, drag: 1, cost_factor: 1.75, reliability: 4 },
    WindingData { name: "Lightning Sprite Ephemera", draw_mod: 0.5, mass: -2, drag: -2, cost_factor: 2.0, reliability: -3 },
];

pub struct ElectricBuilder {
    name: String,
    era_sel: usize,
    winding_sel: usize,
    power: i16,
    chonk: i16,
    quality_fudge: f64,
    rarity: EngineRarity,
}

impl ElectricBuilder {
    pub fn new() -> ElectricBuilder {
        ElectricBuilder {
            name: "Default".to_string(),
            era_sel: 0,
            winding_sel: 0,
            power: 1,
            chonk: 1,
            quality_fudge: 1.0,
            rarity: EngineRarity::CUSTOM,
        }
    }

    /// Load from EngineInputs
    pub fn from_inputs(inputs: &EngineInputs) -> ElectricBuilder {
        let mut builder = ElectricBuilder::new();
        builder.name = inputs.name.clone();
        builder.era_sel = inputs.era_sel as usize;
        builder.rarity = inputs.rarity.clone();

        if let TypedInputs::Electric {
            power,
            winding_sel,
            chonk,
            quality_fudge,
        } = &inputs.inputs
        {
            builder.power = *power;
            builder.winding_sel = *winding_sel as usize;
            builder.chonk = *chonk;
            builder.quality_fudge = *quality_fudge as f64;
        }

        builder
    }

    /// Calculate era-based mass
    fn era_mass(&self) -> f64 {
        let era = &ERA_TABLE[self.era_sel];
        rtz(1.0e-6 + era.mass_factor * self.power as f64)
    }

    /// Calculate mass
    fn calc_mass(&self) -> f64 {
        let winding = &WINDING_TABLE[self.winding_sel];
        (rtz(1.0e-6 + self.era_mass() + winding.mass as f64).max(0.0))
    }

    /// Calculate drag
    fn calc_drag(&self) -> f64 {
        let raw_drag = self.power as f64 / 10.0;
        let winding_drag = WINDING_TABLE[self.winding_sel].drag as f64;

        rtz(1.0e-6 + 1.0 + raw_drag + self.chonk as f64 + winding_drag).max(1.0)
    }

    /// Calculate overspeed
    fn calc_overspeed(&self) -> i16 {
        let chonk_speed = self.chonk as f64 / 2.0;
        let quality_speed = 7.5 * (self.quality_fudge - 1.0);
        (ERA_TABLE[self.era_sel].overspeed as f64 - chonk_speed + quality_speed - 1.0e-6).ceil() as i16
    }

    /// Calculate electrical draw
    fn calc_draw(&self) -> i16 {
        let era = &ERA_TABLE[self.era_sel];
        let winding = &WINDING_TABLE[self.winding_sel];

        let era_draw = era.draw as f64 + (self.power as f64 * era.draw_factor - 1.0e-6).ceil();
        (era_draw * winding.draw_mod - 1.0e-6).ceil() as i16
    }

    /// Calculate reliability
    fn calc_reliability(&self) -> i16 {
        let era = &ERA_TABLE[self.era_sel];
        let winding = &WINDING_TABLE[self.winding_sel];

        let power_rely = self.power as f64 / 10.0;
        let quality_rely = 5.0 * (self.quality_fudge - 1.0);

        (1.0e-6 + era.reliability as f64 + self.chonk as f64 - power_rely + quality_rely).trunc() as i16
            + winding.reliability
    }

    /// Calculate torque
    fn calc_torque(&self) -> i16 {
        let torque = 1.0 + self.era_mass() / 10.0 + self.chonk as f64 / 4.0;
        rtz(1.0e-6 + torque).max(1.0) as i16
    }

    /// Calculate cost
    fn calc_cost(&self) -> f64 {
        let era = &ERA_TABLE[self.era_sel];
        let winding = &WINDING_TABLE[self.winding_sel];

        let era_cost = era.cost_factor * self.power as f64;
        let base_cost = (era_cost * self.quality_fudge.max(0.5) - 1.0e-6).ceil();
        (base_cost * winding.cost_factor - 1.0e-6).ceil()
    }

    /// Verify and clamp values
    fn verify_values(&mut self) {
        self.era_sel = self.era_sel.min(ERA_TABLE.len() - 1);
        self.winding_sel = self.winding_sel.min(WINDING_TABLE.len() - 1);
        self.power = rtz(1.0e-6 + self.power as f64).max(1.0) as i16;
        self.chonk = rtz(1.0e-6 + self.chonk as f64).max(-10.0).min(10.0) as i16;
        self.quality_fudge = self.quality_fudge.max(0.5).min(2.0);
    }

    /// Build EngineStats from current configuration
    pub fn build(&mut self) -> EngineStats {
        self.verify_values();

        let mut estats = EngineStats::new();
        estats.name = self.name.clone();
        estats.stats.power = self.power as f64;
        estats.stats.mass = self.calc_mass();
        estats.stats.drag = self.calc_drag();
        estats.stats.reliability = self.calc_reliability() as f64;
        estats.stats.cooling = 0.0;
        estats.oiltank = false;
        estats.overspeed = self.calc_overspeed();
        estats.stats.fuelconsumption = 0.0;
        estats.stats.charge = -self.calc_draw() as f64;
        estats.altitude = 100;
        estats.torque = self.calc_torque();
        estats.stats.cost = self.calc_cost();
        estats.pulsejet = false;
        estats.rumble = 0;

        estats.stats.eras.push(Era {
            name: self.name.clone(),
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

        estats
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::serialization::JSSerializable;

    #[test]
    fn test_himmilgard_electric() {
        // Test data from Himmilgard Electric.json and .csv
        // CSV format: name, power, mass, drag, cooling, reliability, fuelconsumption, overspeed, cost, rarity
        let test_cases = vec![
            // E1 - Pioneer, Aluminum winding
            (
                r#"{
                    "name": "E1",
                    "engine_type": 3,
                    "power": 1,
                    "era_sel": 0,
                    "winding_sel": 0,
                    "diameter": 0,
                    "material_fudge": 1,
                    "quality_fudge": 1
                }"#,
                (1.0, 0.0, 3.0, 0.0, 0.0, 0.0, 20, 1.0),
            ),
            // E2 - WWI, Copper winding
            (
                r#"{
                    "name": "E2",
                    "engine_type": 3,
                    "power": 10,
                    "era_sel": 1,
                    "winding_sel": 1,
                    "diameter": 0,
                    "material_fudge": 2,
                    "quality_fudge": 0.5
                }"#,
                (10.0, 3.0, 4.0, 0.0, -1.0, 0.0, 21, 3.0),
            ),
        ];

        for (json_str, (exp_power, exp_mass, exp_drag, exp_cooling, exp_reliability, exp_fuel, exp_overspeed, exp_cost)) in test_cases {
            let json: serde_json::Value = serde_json::from_str(json_str).unwrap();
            let mut inputs = EngineInputs::new();
            inputs.from_json(&json, 100.0);

            let mut builder = ElectricBuilder::from_inputs(&inputs);
            let stats = builder.build();

            // Extract engine name for error messages
            let engine_name = &stats.name;

            // Verify electric-specific properties
            assert!(!stats.pulsejet, "{}: Should not be a pulsejet", engine_name);
            assert_eq!(stats.altitude, 100, "{}: Altitude mismatch", engine_name);
            assert_eq!(stats.rumble, 0, "{}: Rumble should be 0", engine_name);
            assert!(!stats.oiltank, "{}: Should not have oil tank", engine_name);

            // Compare stats (exact match with CSV)
            assert_eq!(
                stats.stats.power, exp_power,
                "{}: Power mismatch",
                engine_name
            );
            assert_eq!(
                stats.stats.mass, exp_mass,
                "{}: Mass mismatch",
                engine_name
            );
            assert_eq!(
                stats.stats.drag, exp_drag,
                "{}: Drag mismatch",
                engine_name
            );
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
            assert_eq!(
                stats.stats.cost, exp_cost,
                "{}: Cost mismatch",
                engine_name
            );
        }
    }
}
