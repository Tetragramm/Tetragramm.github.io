use crate::{
    engine::{EngineInputs, EngineRarity, EngineStats, TypedInputs},
    stats::{rtz, Era, ERA},
};

struct TypeData {
    name: &'static str,
    efficiency: f32,
    mass_factor: f32,
    cost_factor: f32,
}

const TYPE_TABLE: [TypeData; 4] = [
    TypeData {
        name: "Turbojet",
        efficiency: 0.0,
        mass_factor: 0.8,
        cost_factor: 1.0,
    },
    TypeData {
        name: "Turbofan",
        efficiency: 0.0,
        mass_factor: 1.0,
        cost_factor: 1.0,
    },
    TypeData {
        name: "Propfan",
        efficiency: -9.0,
        mass_factor: 0.8,
        cost_factor: 1.0,
    },
    TypeData {
        name: "Turboprop",
        efficiency: -3.0,
        mass_factor: 0.8,
        cost_factor: 1.0,
    },
];

struct EraData {
    name: &'static str,
    max_temp: f32,
    efficiency: f32,
    cost_factor: f32,
}

const ERA_TABLE: [EraData; 9] = [
    EraData {
        name: "Gen 1 1945-1955",
        max_temp: 1100.0,
        efficiency: -2.0,
        cost_factor: 0.5,
    },
    EraData {
        name: "Gen 1.5 1955-1965",
        max_temp: 1100.0,
        efficiency: -1.0,
        cost_factor: 0.6,
    },
    EraData {
        name: "Gen 2 1965-1975",
        max_temp: 1400.0,
        efficiency: -1.0,
        cost_factor: 0.7,
    },
    EraData {
        name: "Gen 2.5 1975-1985",
        max_temp: 1400.0,
        efficiency: 0.0,
        cost_factor: 0.8,
    },
    EraData {
        name: "Gen 3 1985-1995",
        max_temp: 1800.0,
        efficiency: 0.0,
        cost_factor: 0.9,
    },
    EraData {
        name: "Gen 3.5 1995-2005",
        max_temp: 1800.0,
        efficiency: 1.0,
        cost_factor: 1.0,
    },
    EraData {
        name: "Gen 4 2005-2015",
        max_temp: 2000.0,
        efficiency: 1.0,
        cost_factor: 1.1,
    },
    EraData {
        name: "Gen 4.5 2015-2025",
        max_temp: 2000.0,
        efficiency: 2.0,
        cost_factor: 1.2,
    },
    EraData {
        name: "Gen 0 Himmilgard",
        max_temp: 800.0,
        efficiency: -10.0,
        cost_factor: 0.5,
    },
];

pub struct TurboBuilder {
    name: String,
    era_sel: usize,
    type_sel: usize,
    fuel_heat_value: f32,
    flow_adjustment: f32,
    diameter: f32,
    compression_ratio: f32,
    bypass_ratio: f32,
    afterburner: bool,
    rarity: EngineRarity,
    kn: f32,
    tsfc: f32,
}

impl TurboBuilder {
    pub fn new() -> TurboBuilder {
        TurboBuilder {
            name: "Default".to_string(),
            era_sel: 0,
            type_sel: 0,
            fuel_heat_value: 43020.0,
            flow_adjustment: 0.0,
            diameter: 0.89,
            compression_ratio: 3.5,
            bypass_ratio: 0.0,
            afterburner: false,
            rarity: EngineRarity::CUSTOM,
            kn: 0.0,
            tsfc: 0.0,
        }
    }

    /// Load from EngineInputs
    pub fn from_inputs(inputs: &EngineInputs) -> TurboBuilder {
        let mut builder = TurboBuilder::new();
        builder.name = inputs.name.clone();
        builder.era_sel = inputs.era_sel as usize;
        builder.rarity = inputs.rarity.clone();

        if let TypedInputs::Turbine {
            flow_adjustment,
            diameter,
            compression_ratio,
            bypass_ratio,
            upgrades,
        } = &inputs.inputs
        {
            builder.type_sel = inputs.etype as usize;
            builder.flow_adjustment = *flow_adjustment as f32;
            builder.diameter = *diameter as f32;
            builder.compression_ratio = *compression_ratio as f32;
            builder.bypass_ratio = *bypass_ratio as f32;
            builder.afterburner = upgrades.get(0).copied().unwrap_or(false);
        }

        builder
    }

    /// Calculate temporary mass (used in mass and cost calculations)
    fn temp_mass(&self) -> f32 {
        let type_data = &TYPE_TABLE[self.type_sel];

        let tmass = (self.compression_ratio.log2())
            * std::f32::consts::PI
            * (self.diameter / 2.0).powi(2)
            * 1.75
            * 361.75
            / (1.0 + self.bypass_ratio / 3.0)
            * type_data.mass_factor;

        0.75 * tmass
    }

    /// Calculate mass
    fn calc_mass(&self) -> f32 {
        let mut tmass = self.temp_mass();

        // Turbofan fit (using list from jet-engines.net and an excel curve)
        if self.type_sel == 1 {
            tmass = tmass * (0.4833 * self.compression_ratio.ln() - 0.3168);
        }

        let mut mass = tmass / 25.0 + 95.684 * self.flow_adjustment;

        // Turboprop fit
        if self.type_sel == 2 || self.type_sel == 3 {
            let x = 0.5 - self.flow_adjustment;
            mass = mass.abs() * (19.74 * x.powi(3) - 11.462 * x * x + 1.0666 * x + 0.4333);
        }

        rtz((1.0e-6 + mass).max(1.0))
    }

    /// Calculate drag
    fn calc_drag(&self) -> f32 {
        rtz(1.0e-6 + 5.0 * std::f32::consts::PI * (self.diameter / 2.0).powi(2))
    }

    /// Calculate reliability
    fn calc_reliability(&self) -> i16 {
        let reliability = -self.compression_ratio.log2() - 20.0 * self.flow_adjustment;
        (reliability + 1.0).trunc() as i16
    }

    /// Mass Flow Parameter helper function
    fn mfp(&self, m: f32) -> f32 {
        const R: f32 = 287.058 / 1000.0; // Gas Constant
        const Y: f32 = 1.4; // Specific Heat

        (Y / R).sqrt() * m * (1.0 + (Y - 1.0) / 2.0 * m * m).powf((Y + 1.0) / (2.0 * (Y - 1.0)))
    }

    /// Calculate stages (thrust and fuel consumption)
    fn calc_stages(&self) -> (f32, f32) {
        let era = &ERA_TABLE[self.era_sel];

        const M: f32 = 0.0;
        const A0: f32 = 340.3;
        const PA: f32 = 108.9; // Ambient Pressure
        const TA: f32 = 288.15; // Ambient Temp
        const CP: f32 = 1.006; // Specific Heat at Constant Pressure
        const Y: f32 = 1.4; // Specific Heat
        const FAN_PRESSURE_RATIO: f32 = 1.6;

        let area = std::f32::consts::PI * (self.diameter / 2.0).powi(2);
        let net_efficiency = 0.8
            + (era.efficiency + TYPE_TABLE[self.type_sel].efficiency) / 20.0
            + self.flow_adjustment;

        let p3 = PA * self.compression_ratio;
        let t3 = TA * (p3 / PA).powf((Y - 1.0) / Y);

        let tr = 1.0 + (Y - 1.0) / 2.0 * M * M;
        let ty = era.max_temp / TA;
        let tc = self.compression_ratio.powf(1.0 - 1.0 / Y);
        let st11 = A0
            * (((2.0 * tr) / (Y - 1.0) * (ty / (tr * tc) - 1.0) * (tc - 1.0)
                + ty / (tr * tc) * M * M)
                .sqrt()
                - M)
            * net_efficiency
            / 1000.0;
        let tcp = FAN_PRESSURE_RATIO.powf(1.0 - 1.0 / Y);
        let st13 = A0 * ((2.0 / (Y - 1.0) * (tr * tcp - 1.0)).sqrt() - M) * net_efficiency / 1000.0;
        let f = (CP * TA / self.fuel_heat_value) * (era.max_temp / TA - t3 / TA);
        let st =
            st11 / (1.0 + self.bypass_ratio) + self.bypass_ratio * st13 / (1.0 + self.bypass_ratio);
        let tsfc11 = f / ((1.0 + self.bypass_ratio) * st) * 1000.0;

        let c2 = PA * area * self.mfp(1.0) / (1.0 + f);
        let mc2 = self.compression_ratio * c2 * (1.0 / era.max_temp).sqrt() * net_efficiency;

        // Check for invalid values
        if !st.is_finite()
            || !mc2.is_finite()
            || !tsfc11.is_finite()
            || st < 0.0
            || mc2 < 0.0
            || tsfc11 < 0.0
        {
            return (0.0, 0.0);
        }

        let thrust = st * mc2;
        let fuel = tsfc11 * st * mc2;

        (thrust, fuel)
    }

    /// Calculate cost
    fn calc_cost(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let type_data = &TYPE_TABLE[self.type_sel];

        rtz(1.0e-6
            + self.temp_mass()
                * 0.5
                * (1.0 + self.flow_adjustment)
                * era.cost_factor
                * type_data.cost_factor)
            + 1.0
    }

    /// Get pitch speed based on bypass ratio
    fn get_pitch_speed(&self) -> f32 {
        if self.bypass_ratio >= 8.0 {
            1.0
        } else if self.bypass_ratio >= 3.5 {
            1.1
        } else if self.bypass_ratio >= 1.0 {
            1.2
        } else {
            1.3
        }
    }

    /// Verify and clamp values
    fn verify_values(&mut self) {
        self.era_sel = self.era_sel.min(ERA_TABLE.len() - 1);
        self.type_sel = self.type_sel.min(TYPE_TABLE.len() - 1);
        self.flow_adjustment = self.flow_adjustment.max(-0.5).min(0.5);
        self.diameter = self.diameter.max(0.1);
        self.compression_ratio = self.compression_ratio.max(1.0);
        self.bypass_ratio = self.bypass_ratio.max(0.0).min(20.0);

        // Disable afterburner for turboprop/propfan
        if self.type_sel > 2 {
            self.afterburner = false;
        }
    }

    /// Build EngineStats from current configuration
    pub fn build(&mut self) -> EngineStats {
        self.verify_values();

        let (thrust, fuel) = self.calc_stages();
        self.kn = thrust;
        self.tsfc = if thrust > 0.0 { fuel / thrust } else { 0.0 };

        let mut estats = EngineStats::new();
        estats.name = self.name.clone();
        estats.stats.power = (thrust * 1000.0 / 89.0).round();
        estats.stats.mass = self.calc_mass();
        estats.stats.drag = self.calc_drag();
        estats.stats.reliability = self.calc_reliability() as f32;
        estats.stats.fuelconsumption = (10.0 * 20.0 * fuel / 1000.0).round();
        estats.rumble = 0;
        estats.stats.cost = self.calc_cost();
        estats.overspeed = 100;
        estats.altitude = 59;

        // Set era
        estats.stats.eras.push(Era {
            name: estats.name.clone(),
            era: if self.era_sel == 8 {
                ERA::Himmilgard // Gen 0 Himmilgard
            } else {
                ERA::LastHurrah // Modern jets
            },
        });

        estats.stats.pitchspeed = self.get_pitch_speed();
        estats.rarity = self.rarity.clone();
        estats.pulsejet = false;
        estats.es1 = self.kn;
        estats.es2 = self.tsfc;

        estats
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::serialization::JSSerializable;

    #[test]
    fn test_himmilgard_turbojet() {
        // Test data from Himmilgard Turbojet.json and .csv
        // CSV format: name, power, mass, drag, cooling, reliability, fuelconsumption, overspeed, cost, rarity
        let test_cases = vec![
            // G0 - Gen 0 Himmilgard Turbofan
            (
                r#"{
                    "name": "G0",
                    "engine_type": 2,
                    "type": 1,
                    "era_sel": 8,
                    "flow_adjustment": -0.1,
                    "diameter": 0.5,
                    "compression_ratio": 3,
                    "bypass_ratio": 0.2,
                    "upgrades": [true, false, false, false],
                    "rarity": 0
                }"#,
                (2.0, 1.0, 0.0, 0.0, 1.0, 3.0, 100, 32.0),
            ),
            // G2 - Gen 2 Turbojet
            (
                r#"{
                    "name": "G2",
                    "engine_type": 2,
                    "type": 0,
                    "era_sel": 2,
                    "flow_adjustment": 0,
                    "diameter": 0.7,
                    "compression_ratio": 5,
                    "bypass_ratio": 0,
                    "upgrades": [false, false, false, false],
                    "rarity": 0
                }"#,
                (110.0, 13.0, 1.0, 0.0, -1.0, 69.0, 100, 119.0),
            ),
            // G4 - Gen 4 Turbojet
            (
                r#"{
                    "name": "G4",
                    "engine_type": 2,
                    "type": 0,
                    "era_sel": 6,
                    "flow_adjustment": 0.1,
                    "diameter": 1,
                    "compression_ratio": 8,
                    "bypass_ratio": 0,
                    "upgrades": [false, false, false, false],
                    "rarity": 0
                }"#,
                (660.0, 45.0, 3.0, 0.0, -4.0, 371.0, 100, 542.0),
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

            let mut builder = TurboBuilder::from_inputs(&inputs);
            let stats = builder.build();

            // Extract engine name for error messages
            let engine_name = &stats.name;

            // Verify turbojet-specific properties
            assert!(!stats.pulsejet, "{}: Should not be a pulsejet", engine_name);
            assert_eq!(stats.altitude, 59, "{}: Altitude mismatch", engine_name);
            assert_eq!(stats.overspeed, 100, "{}: Overspeed mismatch", engine_name);

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
