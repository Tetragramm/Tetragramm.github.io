use crate::{
    engine::{EngineInputs, EngineRarity, EngineStats, TypedInputs},
    stats::{rtz, Era, ERA},
};

struct EraData {
    draw: i16,
    draw_factor: f32,
    mass_factor: f32,
    reliability: i16,
    cost_factor: f32,
    overspeed: i16,
}

const ERA_TABLE: [EraData; 6] = [
    EraData {
        draw: 3,
        draw_factor: 2.0 / 5.0,
        mass_factor: 2.0 / 5.0,
        reliability: -1,
        cost_factor: 1.0 / 2.5,
        overspeed: 20,
    },
    EraData {
        draw: 1,
        draw_factor: 2.0 / 5.0,
        mass_factor: 1.0 / 3.0,
        reliability: 0,
        cost_factor: 1.0 / 2.25,
        overspeed: 25,
    },
    EraData {
        draw: 1,
        draw_factor: 2.0 / 7.0,
        mass_factor: 2.0 / 7.0,
        reliability: 1,
        cost_factor: 1.0 / 2.0,
        overspeed: 30,
    },
    EraData {
        draw: 0,
        draw_factor: 2.0 / 7.0,
        mass_factor: 1.0 / 4.0,
        reliability: 2,
        cost_factor: 1.0 / 1.9,
        overspeed: 35,
    },
    EraData {
        draw: 0,
        draw_factor: 1.0 / 4.0,
        mass_factor: 1.0 / 5.0,
        reliability: 3,
        cost_factor: 1.0 / 1.8,
        overspeed: 40,
    },
    EraData {
        draw: 0,
        draw_factor: 1.0 / 5.0,
        mass_factor: 1.0 / 6.0,
        reliability: 4,
        cost_factor: 1.0 / 1.75,
        overspeed: 45,
    },
];

pub struct WindingData {
    pub name: &'static str,
    draw_mod: f32,
    mass: i16,
    drag: i16,
    cost_factor: f32,
    reliability: i16,
}

pub const WINDING_TABLE: [WindingData; 7] = [
    WindingData {
        name: "Aluminum",
        draw_mod: 1.1,
        mass: -2,
        drag: 1,
        cost_factor: 1.0,
        reliability: 0,
    },
    WindingData {
        name: "Copper",
        draw_mod: 1.0,
        mass: 0,
        drag: 0,
        cost_factor: 1.0,
        reliability: 0,
    },
    WindingData {
        name: "Silver",
        draw_mod: 0.95,
        mass: 1,
        drag: 0,
        cost_factor: 1.1,
        reliability: 0,
    },
    WindingData {
        name: "Electrum",
        draw_mod: 0.9,
        mass: 2,
        drag: 0,
        cost_factor: 1.3,
        reliability: 1,
    },
    WindingData {
        name: "Platinum",
        draw_mod: 0.75,
        mass: 3,
        drag: 0,
        cost_factor: 2.0,
        reliability: 2,
    },
    WindingData {
        name: "Screamer Sinew",
        draw_mod: 0.9,
        mass: 0,
        drag: 1,
        cost_factor: 1.75,
        reliability: 4,
    },
    WindingData {
        name: "Lightning Sprite Ephemera",
        draw_mod: 0.5,
        mass: -2,
        drag: -2,
        cost_factor: 2.0,
        reliability: -3,
    },
];

pub struct ElectricBuilder {
    name: String,
    era_sel: usize,
    winding_sel: usize,
    power: i16,
    chonk: i16,
    quality_fudge: f32,
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
            builder.quality_fudge = *quality_fudge as f32;
        }

        builder
    }

    /// Calculate era-based mass
    fn era_mass(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        rtz(1.0e-6 + era.mass_factor * self.power as f32)
    }

    /// Calculate mass
    fn calc_mass(&self) -> f32 {
        let winding = &WINDING_TABLE[self.winding_sel];
        rtz(1.0e-6 + self.era_mass() + winding.mass as f32).max(0.0)
    }

    /// Calculate drag
    fn calc_drag(&self) -> f32 {
        let raw_drag = self.power as f32 / 10.0;
        let winding_drag = WINDING_TABLE[self.winding_sel].drag as f32;

        rtz(1.0e-6 + 1.0 + raw_drag + self.chonk as f32 + winding_drag).max(1.0)
    }

    /// Calculate overspeed
    fn calc_overspeed(&self) -> i16 {
        let chonk_speed = self.chonk as f32 / 2.0;
        let quality_speed = 7.5 * (self.quality_fudge - 1.0);
        (ERA_TABLE[self.era_sel].overspeed as f32 - chonk_speed + quality_speed - 1.0e-6).ceil()
            as i16
    }

    /// Calculate electrical draw
    fn calc_draw(&self) -> i16 {
        let era = &ERA_TABLE[self.era_sel];
        let winding = &WINDING_TABLE[self.winding_sel];

        let era_draw = era.draw as f32 + (self.power as f32 * era.draw_factor - 1.0e-6).ceil();
        (era_draw * winding.draw_mod - 1.0e-6).ceil() as i16
    }

    /// Calculate reliability
    fn calc_reliability(&self) -> i16 {
        let era = &ERA_TABLE[self.era_sel];
        let winding = &WINDING_TABLE[self.winding_sel];

        let power_rely = self.power as f32 / 10.0;
        let quality_rely = 5.0 * (self.quality_fudge - 1.0);

        (1.0e-6 + era.reliability as f32 + self.chonk as f32 - power_rely + quality_rely).trunc()
            as i16
            + winding.reliability
    }

    /// Calculate torque
    fn calc_torque(&self) -> i16 {
        let torque = 1.0 + self.era_mass() / 10.0 + self.chonk as f32 / 4.0;
        rtz(1.0e-6 + torque).max(1.0) as i16
    }

    /// Calculate cost
    fn calc_cost(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let winding = &WINDING_TABLE[self.winding_sel];

        let era_cost = era.cost_factor * self.power as f32;
        let base_cost = (era_cost * self.quality_fudge.max(0.5) - 1.0e-6).ceil();
        (base_cost * winding.cost_factor - 1.0e-6).ceil()
    }

    /// Verify and clamp values
    fn verify_values(&mut self) {
        self.era_sel = self.era_sel.min(ERA_TABLE.len() - 1);
        self.winding_sel = self.winding_sel.min(WINDING_TABLE.len() - 1);
        self.power = rtz(1.0e-6 + self.power as f32).max(1.0) as i16;
        self.chonk = rtz(1.0e-6 + self.chonk as f32).max(-10.0).min(10.0) as i16;
        self.quality_fudge = self.quality_fudge.max(0.5).min(2.0);
    }

    /// Build EngineStats from current configuration
    pub fn build(&mut self) -> EngineStats {
        self.verify_values();

        let mut estats = EngineStats::new();
        estats.name = self.name.clone();
        estats.stats.power = self.power as f32;
        estats.stats.mass = self.calc_mass();
        estats.stats.drag = self.calc_drag();
        estats.stats.reliability = self.calc_reliability() as f32;
        estats.stats.cooling = 0.0;
        estats.oiltank = false;
        estats.overspeed = self.calc_overspeed();
        estats.stats.fuelconsumption = 0.0;
        estats.stats.charge = -self.calc_draw() as f32;
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
