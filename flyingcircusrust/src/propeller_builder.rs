use crate::{
    engine::{EngineInputs, EngineRarity, EngineStats, TypedInputs},
    stats::{rtz, Era, Warning, WarningLevel, ERA},
};

#[derive(Clone, Copy, PartialEq, Eq)]
pub enum CompressorType {
    None = 0,
    AltitudeThrottle = 1,
    Supercharger = 2,
    Turbocharger = 3,
}

impl From<i16> for CompressorType {
    fn from(value: i16) -> Self {
        match value {
            0 => CompressorType::None,
            1 => CompressorType::AltitudeThrottle,
            2 => CompressorType::Supercharger,
            3 => CompressorType::Turbocharger,
            _ => CompressorType::None,
        }
    }
}

struct EraData {
    materials: f32,
    cost: f32,
    max_rpm: f32,
    power_div: f32,
    fuel_factor: f32,
}

const ERA_TABLE: [EraData; 6] = [
    EraData {
        materials: 3.0,
        cost: 0.5,
        max_rpm: 30.0,
        power_div: 8.0,
        fuel_factor: 10.0,
    },
    EraData {
        materials: 2.0,
        cost: 1.0,
        max_rpm: 35.0,
        power_div: 7.0,
        fuel_factor: 8.0,
    },
    EraData {
        materials: 1.5,
        cost: 2.0,
        max_rpm: 40.0,
        power_div: 6.8,
        fuel_factor: 6.0,
    },
    EraData {
        materials: 1.35,
        cost: 2.25,
        max_rpm: 45.0,
        power_div: 6.6,
        fuel_factor: 5.0,
    },
    EraData {
        materials: 1.25,
        cost: 2.5,
        max_rpm: 50.0,
        power_div: 6.5,
        fuel_factor: 4.0,
    },
    EraData {
        materials: 1.0,
        cost: 3.0,
        max_rpm: 50.0,
        power_div: 6.2,
        fuel_factor: 2.0,
    },
];

pub struct CoolingData {
    pub name: &'static str,
    force_factor: f32,
    rpm_off: f32,
    radiator: f32,
    mass_factor: f32,
}

pub const COOLING_TABLE: [CoolingData; 6] = [
    CoolingData {
        name: "Liquid Cooled",
        force_factor: 1.2,
        rpm_off: 0.0,
        radiator: 1.0,
        mass_factor: 1.0,
    },
    CoolingData {
        name: "Air Cooled",
        force_factor: 1.0,
        rpm_off: 0.0,
        radiator: 0.0,
        mass_factor: 1.0,
    },
    CoolingData {
        name: "Rotary",
        force_factor: 1.0,
        rpm_off: 8.0,
        radiator: 0.0,
        mass_factor: 1.0,
    },
    CoolingData {
        name: "Contrarotary",
        force_factor: 1.0,
        rpm_off: 8.0,
        radiator: 0.0,
        mass_factor: 1.0,
    },
    CoolingData {
        name: "Semi-Radial",
        force_factor: 0.8,
        rpm_off: 0.0,
        radiator: 0.0,
        mass_factor: 1.0,
    },
    CoolingData {
        name: "Liquid Radial",
        force_factor: 1.0,
        rpm_off: 0.0,
        radiator: 2.5,
        mass_factor: 1.3,
    },
];

pub struct UpgradeData {
    pub name: &'static str,
    power_factor: f32,
    fuel_factor: f32,
    mass_factor: f32,
    drag_factor: f32,
    ideal_alt: i16,
    cost_factor: f32,
}

pub const UPGRADES: [UpgradeData; 4] = [
    UpgradeData {
        name: "Asperator Boost",
        power_factor: 0.11,
        fuel_factor: 0.0,
        mass_factor: 0.0,
        drag_factor: 0.0,
        ideal_alt: -1,
        cost_factor: 3.0,
    },
    UpgradeData {
        name: "War Emergency Power",
        power_factor: 0.0,
        fuel_factor: 0.0,
        mass_factor: 0.0,
        drag_factor: 0.0,
        ideal_alt: 0,
        cost_factor: 5.0,
    },
    UpgradeData {
        name: "Fuel Injector",
        power_factor: 0.0,
        fuel_factor: -0.1,
        mass_factor: 0.0,
        drag_factor: 0.0,
        ideal_alt: 0,
        cost_factor: 2.0,
    },
    UpgradeData {
        name: "Diesel",
        power_factor: -0.2,
        fuel_factor: -0.5,
        mass_factor: 0.0,
        drag_factor: 0.0,
        ideal_alt: 0,
        cost_factor: 0.0,
    },
];

pub struct PropellerBuilder {
    name: String,
    era_sel: usize,
    cool_sel: usize,
    compressor_type: CompressorType,
    compressor_count: i16,
    min_iaf: i16,
    upg_sel: Vec<bool>,
    engine_displacement: f32,
    num_cyl_per_row: i16,
    num_rows: i16,
    compression_ratio: f32,
    rpm_boost: f32,
    material_fudge: f32,
    quality_fudge: f32,
    rarity: EngineRarity,
}

impl PropellerBuilder {
    pub fn new() -> PropellerBuilder {
        PropellerBuilder {
            name: "Default Name".to_string(),
            era_sel: 0,
            cool_sel: 0,
            upg_sel: vec![false; 4],
            engine_displacement: 1.0,
            num_cyl_per_row: 2,
            num_rows: 2,
            compression_ratio: 2.0,
            rpm_boost: 1.0,
            material_fudge: 1.0,
            quality_fudge: 1.0,
            compressor_type: CompressorType::None,
            compressor_count: 0,
            min_iaf: 0,
            rarity: EngineRarity::CUSTOM,
        }
    }

    /// Load from EngineInputs
    pub fn from_inputs(inputs: &EngineInputs) -> PropellerBuilder {
        let mut builder = PropellerBuilder::new();
        builder.name = inputs.name.clone();
        builder.era_sel = inputs.era_sel as usize;
        builder.rarity = inputs.rarity.clone();

        if let TypedInputs::Propeller {
            displacement,
            compression,
            cyl_per_row,
            rows,
            rpm_boost,
            material_fudge,
            quality_fudge,
            compressor_type,
            compressor_count,
            min_ideal_alt,
            upgrades,
        } = &inputs.inputs
        {
            builder.engine_displacement = *displacement;
            builder.compression_ratio = *compression;
            builder.cool_sel = inputs.etype as usize;
            builder.num_cyl_per_row = *cyl_per_row;
            builder.num_rows = *rows;
            builder.rpm_boost = *rpm_boost;
            builder.material_fudge = *material_fudge;
            builder.quality_fudge = *quality_fudge;
            builder.compressor_type = CompressorType::from(*compressor_type);
            builder.compressor_count = *compressor_count;
            builder.min_iaf = *min_ideal_alt;
            builder.upg_sel = upgrades.clone();
        }

        builder
    }

    /// Check which upgrades can be enabled
    pub fn can_upgrade(&self) -> Vec<bool> {
        let mut can_upg = vec![true; UPGRADES.len()];
        can_upg[0] = false; // Asperator Boost disabled by default?

        if self.compressor_type == CompressorType::AltitudeThrottle {
            can_upg[0] = false;
            can_upg[1] = false;
            can_upg[2] = false;
        }

        can_upg
    }

    /// Calculate upgrade power multiplier
    fn upgrade_power(&self) -> f32 {
        let mut power = 1.0;
        for i in 0..self.upg_sel.len() {
            if self.upg_sel[i] {
                power += UPGRADES[i].power_factor;
            }
        }
        // Asperator Boost applies multiplicatively as well
        if self.upg_sel[0] {
            power *= 1.0 + UPGRADES[0].power_factor;
        }
        power
    }

    /// Base RPM calculation
    fn rpm(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let cool = &COOLING_TABLE[self.cool_sel];
        (era.max_rpm - cool.rpm_off) * (self.compression_ratio / 10.0)
    }

    /// Geared RPM
    pub fn geared_rpm(&self) -> f32 {
        self.rpm() * self.rpm_boost
    }

    /// Calculate power
    fn calc_power(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let cool = &COOLING_TABLE[self.cool_sel];

        // Calculate force
        let engine_force = self.engine_displacement * self.compression_ratio * cool.force_factor;
        let raw_force = engine_force * self.upgrade_power();

        // Output force
        let output_force = raw_force * (self.geared_rpm() / 10.0);
        rtz((1.0e-6 + output_force / era.power_div) as f32) as f32
    }

    /// Calculate upgrade mass modifier
    fn upgrade_mass(&self) -> f32 {
        let mut mass = 1.0;
        for i in 0..self.upg_sel.len() {
            if self.upg_sel[i] {
                mass += UPGRADES[i].mass_factor;
            }
        }
        mass
    }

    /// Calculate mass
    fn calc_mass(&self) -> f32 {
        let cool = &COOLING_TABLE[self.cool_sel];

        let cyl_mass = self.engine_displacement.powi(2) * self.compression_ratio / 1000.0;
        let crank_mass = (self.engine_displacement * self.num_rows as f32) / 10.0 + 1.0;
        let pist_mass = self.engine_displacement / 5.0;

        rtz((1.0e-6
            + (cyl_mass + crank_mass + pist_mass)
                * self.upgrade_mass()
                * self.material_fudge
                * cool.mass_factor) as f32) as f32
    }

    /// Calculate upgrade drag modifier
    fn upgrade_drag(&self) -> f32 {
        let mut drag = 1.0;
        for i in 0..self.upg_sel.len() {
            if self.upg_sel[i] {
                drag += UPGRADES[i].drag_factor;
            }
        }
        drag
    }

    /// Calculate cooling-specific drag
    fn cool_drag(&self) -> f32 {
        let cool = &COOLING_TABLE[self.cool_sel];
        match cool.name {
            "Liquid Cooled" => 1.0,
            "Air Cooled" => 1.0,
            "Rotary" => self.geared_rpm() / 10.0,
            "Contrarotary" => self.geared_rpm() / 8.0,
            "Semi-Radial" => 1.0,
            "Liquid Radial" => 1.2,
            _ => 1.0,
        }
    }

    /// Calculate drag
    fn calc_drag(&self) -> f32 {
        let raw_drag = 3.0 + (self.engine_displacement / self.num_rows as f32) / 3.0;
        rtz((1.0e-6 + raw_drag * self.cool_drag() * self.upgrade_drag()) as f32) as f32
    }

    /// Calculate cooling-specific burnout factor
    fn cool_burnout(&self) -> f32 {
        let era_burnout = ERA_TABLE[self.era_sel].materials / 2.0;
        let cool = &COOLING_TABLE[self.cool_sel];

        match cool.name {
            "Liquid Cooled" => 2.0,
            "Air Cooled" => (2.0 + (self.num_rows as f32).powi(2)) * era_burnout,
            "Rotary" => (self.num_rows as f32).powi(2) / (self.geared_rpm() / 10.0),
            "Contrarotary" => (self.num_rows as f32).powi(2) / (self.geared_rpm() / 10.0),
            "Semi-Radial" => (2.0 + (self.num_rows as f32).powi(2) / 2.0) * era_burnout,
            "Liquid Radial" => 0.5,
            _ => 1.0,
        }
    }

    /// Calculate material modifier
    fn material_modifier(&self) -> f32 {
        let era_burnout = ERA_TABLE[self.era_sel].materials;
        let num_cyl = self.num_cyl_per_row as f32 * self.num_rows as f32;
        let cylinder_burnout =
            self.engine_displacement / num_cyl * self.compression_ratio.powi(2) * era_burnout;
        let gearing_burnout = self.rpm_boost * cylinder_burnout * self.cool_burnout();
        gearing_burnout * self.rpm_boost
    }

    /// Check if rotary engine
    fn is_rotary(&self) -> bool {
        let cool = &COOLING_TABLE[self.cool_sel];
        cool.name == "Rotary" || cool.name == "Contrarotary"
    }

    /// Calculate cooling requirement
    fn calc_cooling(&self) -> f32 {
        if self.is_rotary() {
            return 0.0;
        }

        let cool = &COOLING_TABLE[self.cool_sel];
        rtz((1.0e-6 + self.material_modifier() / 20.0 * cool.radiator) as f32) as f32
    }

    /// Calculate overspeed
    fn calc_overspeed(&self) -> i16 {
        (1.5 * self.rpm()).round() as i16
    }

    /// Calculate upgrade fuel modifier
    fn upgrade_fuel(&self) -> f32 {
        let mut fuel = 1.0;
        for i in 0..self.upg_sel.len() {
            if self.upg_sel[i] {
                fuel += UPGRADES[i].fuel_factor;
            }
        }
        fuel * ERA_TABLE[self.era_sel].fuel_factor
    }

    /// Calculate fuel consumption
    fn calc_fuel_consumption(&self) -> f32 {
        let fuel_consumption = self.engine_displacement * self.rpm() / 100.0;
        rtz((1.0e-6 + fuel_consumption * self.upgrade_fuel()) as f32) as f32
    }

    /// Calculate altitude range
    fn calc_altitude(&self) -> i16 {
        let mut alt = 0;
        for i in 0..self.upg_sel.len() {
            if self.upg_sel[i] {
                alt += UPGRADES[i].ideal_alt;
            }
        }
        (3 + alt) * 10 - 1
    }

    /// Calculate cooling-specific torque
    fn cool_torque(&self) -> f32 {
        let cool = &COOLING_TABLE[self.cool_sel];
        if cool.name == "Rotary" {
            self.calc_mass()
        } else if cool.name == "Contrarotary" {
            rtz((1.0e-6 + self.calc_mass() / 2.0) as f32) as f32
        } else {
            1.0
        }
    }

    /// Calculate torque
    fn calc_torque(&self) -> i16 {
        rtz((1.0e-6 + (self.cool_torque() * self.geared_rpm() / 5.0) / 4.0) as f32) as i16
    }

    /// Calculate upgrade cost modifier
    fn upgrade_cost(&self) -> f32 {
        let mut cost = 0.0;
        for i in 0..self.upg_sel.len() {
            if self.upg_sel[i] {
                cost += UPGRADES[i].cost_factor;
            }
        }
        cost
    }

    /// Calculate cost
    fn calc_cost(&self) -> f32 {
        let era = &ERA_TABLE[self.era_sel];
        let cool = &COOLING_TABLE[self.cool_sel];

        let quality = self.quality_fudge.max(1.0);

        let engine_force = self.engine_displacement * self.compression_ratio / 10.0;
        let cost = self.upgrade_cost() + engine_force;
        let mut plus_bs_and_era = quality * era.cost * cost;

        if cool.radiator > 0.0 {
            plus_bs_and_era *= 1.4;
        }

        rtz((1.0e-6 + plus_bs_and_era) as f32) as f32
    }

    /// Verify and clamp all values to valid ranges
    fn verify_values(&mut self) {
        self.engine_displacement = self.engine_displacement.max(0.01).min(150.0);
        self.era_sel = self.era_sel.min(ERA_TABLE.len() - 1);
        self.cool_sel = self.cool_sel.min(COOLING_TABLE.len() - 1);
        self.num_cyl_per_row = self.num_cyl_per_row.max(1);
        self.num_rows = self.num_rows.max(1);
        self.compression_ratio = self.compression_ratio.max(0.01).min(25.0);
        self.rpm_boost = self.rpm_boost.max(0.1).min(2.0);
        self.material_fudge = self.material_fudge.max(0.1).min(2.0);
        self.quality_fudge = self.quality_fudge.max(0.1).min(2.0);

        // Ensure material + quality fudge don't go too low
        while (self.material_fudge - 1.0) + (self.quality_fudge - 1.0) < -0.9 {
            self.material_fudge += 0.1;
            self.quality_fudge += 0.1;
        }

        // Round min_iaf to nearest 10
        self.min_iaf = 10 * ((1.0e-6 + self.min_iaf as f32 / 10.0) as i16);
        self.compressor_count = self.compressor_count.max(0).min(5);

        // Compressor-specific constraints
        match self.compressor_type {
            CompressorType::None => {
                self.compressor_count = 0;
                self.min_iaf = 0;
            }
            CompressorType::AltitudeThrottle => {
                self.compressor_count = 1;
                self.min_iaf = 0;
                self.upg_sel[0] = false;
                self.upg_sel[1] = false;
                self.upg_sel[2] = false;
            }
            CompressorType::Supercharger | CompressorType::Turbocharger => {
                self.min_iaf = self.min_iaf.max(0);
                self.compressor_count = self.compressor_count.max(1);
            }
        }
    }

    /// Build EngineStats from current configuration
    pub fn build(&mut self) -> EngineStats {
        self.verify_values();

        let mut estats = EngineStats::new();
        estats.name = self.name.clone();

        estats.stats.power = self.calc_power() as f32;
        estats.stats.mass = self.calc_mass() as f32;
        estats.stats.drag = self.calc_drag() as f32;
        estats.stats.reliability = (1.0e-6 - 2.0
            + self.era_sel as f32
            + (self.quality_fudge + self.material_fudge - 2.0) as f32 * 10.0)
            .floor();
        estats.stats.cooling = self.calc_cooling() as f32;
        estats.oiltank = self.is_rotary();
        estats.overspeed = self.calc_overspeed();
        estats.stats.fuelconsumption = self.calc_fuel_consumption() as f32;
        estats.altitude = self.calc_altitude();
        estats.torque = self.calc_torque();
        estats.stats.cost = self.calc_cost() as f32;
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

        // Apply compressor modifications
        match self.compressor_type {
            CompressorType::None => {}
            CompressorType::AltitudeThrottle => {
                estats.stats.cost += 3.0;
                estats.altitude = 49;
                estats.stats.warnings.push(Warning {
                    name: t!("Altitude Throttle").to_string(),
                    warning: t!("Altitude Throttle Warning").to_string(),
                    level: WarningLevel::White,
                });
            }
            CompressorType::Supercharger => {
                estats.stats.power = rtz(1.0e-6 + 1.25 * estats.stats.power) as f32;
                estats.stats.fuelconsumption =
                    rtz(1.0e-6 + 1.25 * estats.stats.fuelconsumption) as f32;
                estats.stats.mass = rtz(1.0e-6 + 1.2 * estats.stats.mass) as f32;
                estats.stats.drag += (self.min_iaf / 10) as f32;
                estats.stats.cost += 1.0 + rtz(1.0e-6 + estats.stats.power / 50.0) as f32;

                let extra = self.compressor_count - 1;
                estats.altitude = 29 + 10 * 2 * extra;
                estats.stats.reliability -= extra as f32;
                estats.stats.mass += extra as f32;
                estats.stats.drag += extra as f32;
                estats.stats.cost += (2 * extra) as f32;
            }
            CompressorType::Turbocharger => {
                estats.stats.power = rtz(1.0e-6 + 1.25 * estats.stats.power) as f32;
                estats.stats.mass = rtz(1.0e-6 + 1.2 * estats.stats.mass) as f32;
                estats.stats.drag += (2 * (self.min_iaf / 10)) as f32;
                estats.stats.cost += 1.0 + rtz(1.0e-6 + estats.stats.power / 50.0) as f32;

                let extra = self.compressor_count - 1;
                estats.altitude = 49 + 10 * 2 * extra;
                estats.stats.reliability -= extra as f32;
                estats.stats.mass += extra as f32;
                estats.stats.drag += extra as f32;
                estats.stats.cost += (2 * extra) as f32;
                estats.stats.reqsections += 1.0;
            }
        }

        // Add War Emergency Power warning
        if self.compressor_type == CompressorType::AltitudeThrottle || self.upg_sel[1] {
            estats.stats.warnings.push(Warning {
                name: t!("War Emergency Power").to_string(),
                warning: t!("War Emergency Power Warning").to_string(),
                level: WarningLevel::White,
            });
        }

        estats.stats.fuelconsumption = estats.stats.fuelconsumption.max(1.0);
        estats.rarity = self.rarity.clone();
        estats.es1 = self.geared_rpm();

        estats
    }
}
