use itertools::{chain, Itertools};
use std::str::FromStr;

use crate::json::*;
use crate::lu;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

#[derive(Clone, PartialEq, Eq, Hash, Copy)]
pub enum WarningLevel {
    White,
    Yellow,
    Red,
}

#[derive(Clone, PartialEq, Eq, Hash)]
pub struct Warning {
    pub name: String,
    pub warning: String,
    pub level: WarningLevel,
}
fn merge_warnings(a: Vec<Warning>, b: Vec<Warning>) -> Vec<Warning> {
    let v: Vec<Warning> = chain!(a, b).unique().collect();
    v
}

#[derive(Clone, PartialEq, Eq, Hash)]
pub enum ERA {
    Himmilgard,
    Pioneer,
    WWI,
    Roaring20s,
    ComingStorm,
    WWII,
    LastHurrah,
}

impl ToString for ERA {
    fn to_string(&self) -> String {
        match self {
            ERA::Himmilgard => "Himmilgard",
            ERA::Pioneer => "Pioneer",
            ERA::WWI => "WWI",
            ERA::Roaring20s => "Roaring 20s",
            ERA::ComingStorm => "Coming Storm",
            ERA::WWII => "WWII",
            ERA::LastHurrah => "Last Hurrah",
        }
        .to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct ParseEraError;
impl FromStr for ERA {
    type Err = ParseEraError;

    fn from_str(v: &str) -> Result<Self, Self::Err> {
        match v {
            "Himmilgard" => Ok(ERA::Himmilgard),
            "Pioneer" => Ok(ERA::Pioneer),
            "WWI" => Ok(ERA::WWI),
            "Roaring 20s" => Ok(ERA::Roaring20s),
            "Coming Storm" => Ok(ERA::ComingStorm),
            "WWII" => Ok(ERA::WWII),
            "Last Hurrah" => Ok(ERA::LastHurrah),
            _ => Err(ParseEraError),
        }
    }
}

#[derive(Clone, PartialEq, Eq, Hash)]
pub struct Era {
    pub name: String,
    pub era: ERA,
}

fn merge_eras(a: Vec<Era>, b: Vec<Era>) -> Vec<Era> {
    let v: Vec<Era> = chain!(a, b).unique().collect();
    v
}

pub fn rtz(num: f64) -> f64 {
    if num > 0f64 {
        return (1.0e-6 + num).floor();
    } else {
        return (-1.0e-6 + num).ceil();
    }
}

#[derive(Clone)]
pub struct Stats {
    pub liftbleed: f64,
    pub wetmass: f64,
    pub mass: f64,
    pub drag: f64,
    pub control: f64,
    pub cost: f64,
    pub reqsections: f64,
    pub visibility: f64,
    pub flightstress: f64,
    pub escape: f64,
    pub pitchstab: f64,
    pub latstab: f64,
    pub cooling: f64,
    pub reliability: f64,
    pub power: f64,
    pub fuelconsumption: f64,
    pub maxstrain: f64,
    pub structure: f64,
    pub pitchboost: f64,
    pub pitchspeed: f64,
    pub wingarea: f64,
    pub toughness: f64,
    pub upkeep: f64,
    pub crashsafety: f64,
    pub bomb_mass: f64,
    pub fuel: f64,
    pub charge: f64,
    pub warnings: Vec<Warning>,
    pub eras: Vec<Era>,
}

impl Stats {
    pub fn new() -> Stats {
        Stats {
            liftbleed: 0.0,
            wetmass: 0.0,
            mass: 0.0,
            drag: 0.0,
            control: 0.0,
            cost: 0.0,
            reqsections: 0.0,
            visibility: 0.0,
            flightstress: 0.0,
            escape: 0.0,
            pitchstab: 0.0,
            latstab: 0.0,
            cooling: 0.0,
            reliability: 0.0,
            power: 0.0,
            fuelconsumption: 0.0,
            maxstrain: 0.0,
            structure: 0.0,
            pitchboost: 0.0,
            pitchspeed: 0.0,
            wingarea: 0.0,
            toughness: 0.0,
            upkeep: 0.0,
            crashsafety: 0.0,
            bomb_mass: 0.0,
            fuel: 0.0,
            charge: 0.0,
            warnings: Vec::new(),
            eras: Vec::new(),
        }
    }

    pub fn init(js: &serde_json::Value) -> Stats {
        Stats {
            liftbleed: jsnum(js, "liftbleed"),
            wetmass: jsnum(js, "wetmass"),
            mass: jsnum(js, "mass"),
            drag: jsnum(js, "drag"),
            control: jsnum(js, "control"),
            cost: jsnum(js, "cost"),
            reqsections: jsnum(js, "reqsections"),
            visibility: jsnum(js, "visibility"),
            flightstress: jsnum(js, "flightstress"),
            escape: jsnum(js, "escape"),
            pitchstab: jsnum(js, "pitchstab"),
            latstab: jsnum(js, "latstab"),
            cooling: jsnum(js, "cooling"),
            reliability: jsnum(js, "reliability"),
            power: jsnum(js, "power"),
            fuelconsumption: jsnum(js, "fuelconsumption"),
            maxstrain: jsnum(js, "maxstrain"),
            structure: jsnum(js, "structure"),
            pitchboost: jsnum(js, "pitchboost"),
            pitchspeed: jsnum(js, "pitchspeed"),
            wingarea: jsnum(js, "wingarea"),
            toughness: jsnum(js, "toughness"),
            upkeep: jsnum(js, "upkeep"),
            crashsafety: jsnum(js, "crashsafety"),
            bomb_mass: jsnum(js, "bomb_mass"),
            fuel: jsnum(js, "fuel"),
            charge: jsnum(js, "charge"),
            warnings: if let Some(w) = js.get("warning") {
                vec![Warning {
                    name: lu!(jsstr(js, "name")),
                    warning: lu!(vstr(w)),
                    level: WarningLevel::White,
                }]
            } else if let Some(ws) = js.get("warnings") {
                ws.as_array()
                    .unwrap()
                    .iter()
                    .map(|x| Warning {
                        name: lu!(jsstr(js, "name")),
                        warning: lu!(vstr(x)),
                        level: WarningLevel::White,
                    })
                    .collect()
            } else {
                Vec::new()
            },
            eras: if let Some(e) = js.get("era") {
                vec![Era {
                    name: lu!(jsstr(js, "name")),
                    era: ERA::from_str(&vstr(e)).unwrap(),
                }]
            } else if let Some(es) = js.get("eras") {
                es.as_array()
                    .unwrap()
                    .iter()
                    .map(|x| Era {
                        name: lu!(jsstr(js, "name")),
                        era: ERA::from_str(&vstr(x)).unwrap(),
                    })
                    .collect()
            } else {
                Vec::new()
            },
        }
    }

    pub fn add(self: &Stats, other: &Stats) -> Stats {
        Stats {
            liftbleed: self.liftbleed + other.liftbleed,
            wetmass: self.wetmass + other.wetmass,
            mass: self.mass + other.mass,
            drag: self.drag + other.drag,
            control: self.control + other.control,
            cost: self.cost + other.cost,
            reqsections: self.reqsections + other.reqsections,
            visibility: self.visibility + other.visibility,
            flightstress: self.flightstress + other.flightstress,
            escape: self.escape + other.escape,
            pitchstab: self.pitchstab + other.pitchstab,
            latstab: self.latstab + other.latstab,
            cooling: self.cooling + other.cooling,
            reliability: self.reliability + other.reliability,
            power: self.power + other.power,
            fuelconsumption: self.fuelconsumption + other.fuelconsumption,
            maxstrain: self.maxstrain + other.maxstrain,
            structure: self.structure + other.structure,
            pitchboost: self.pitchboost + other.pitchboost,
            pitchspeed: self.pitchspeed + other.pitchspeed,
            wingarea: self.wingarea + other.wingarea,
            toughness: self.toughness + other.toughness,
            upkeep: self.upkeep + other.upkeep,
            crashsafety: self.crashsafety + other.crashsafety,
            bomb_mass: self.bomb_mass + other.bomb_mass,
            fuel: self.fuel + other.fuel,
            charge: self.charge + other.charge,
            warnings: merge_warnings(self.warnings.clone(), other.warnings.clone()),
            eras: merge_eras(self.eras.clone(), other.eras.clone()),
        }
    }

    pub fn multiply(self: &Stats, value: f64) -> Stats {
        Stats {
            liftbleed: self.liftbleed * value,
            wetmass: self.wetmass * value,
            mass: self.mass * value,
            drag: self.drag * value,
            control: self.control * value,
            cost: self.cost * value,
            reqsections: self.reqsections * value,
            visibility: self.visibility * value,
            flightstress: self.flightstress * value,
            escape: self.escape * value,
            pitchstab: self.pitchstab * value,
            latstab: self.latstab * value,
            cooling: self.cooling * value,
            reliability: self.reliability * value,
            power: self.power * value,
            fuelconsumption: self.fuelconsumption * value,
            maxstrain: self.maxstrain * value,
            structure: self.structure * value,
            pitchboost: self.pitchboost * value,
            pitchspeed: self.pitchspeed * value,
            wingarea: self.wingarea * value,
            toughness: self.toughness * value,
            upkeep: self.upkeep * value,
            crashsafety: self.crashsafety * value,
            bomb_mass: self.bomb_mass * value,
            fuel: self.fuel * value,
            charge: self.charge * value,
            warnings: if value.abs() > 1.0e-6 {
                self.warnings.clone()
            } else {
                Vec::new()
            },
            eras: if value.abs() > 1.0e-6 {
                self.eras.clone()
            } else {
                Vec::new()
            },
        }
    }

    pub fn round(mut self: Stats) {
        self.liftbleed = rtz(self.liftbleed);
        self.wetmass = rtz(self.wetmass);
        self.mass = rtz(self.mass);
        self.drag = rtz(self.drag);
        self.control = rtz(self.control);
        self.cost = rtz(self.cost);
        self.reqsections = rtz(self.reqsections);
        self.visibility = rtz(self.visibility);
        self.flightstress = rtz(self.flightstress);
        self.escape = rtz(self.escape);
        self.pitchstab = rtz(self.pitchstab);
        self.latstab = rtz(self.latstab);
        self.cooling = rtz(self.cooling);
        self.reliability = rtz(self.reliability);
        self.power = rtz(self.power);
        self.fuelconsumption = rtz(self.fuelconsumption);
        self.maxstrain = rtz(self.maxstrain);
        self.structure = rtz(self.structure);
        self.wingarea = rtz(self.wingarea);
        self.toughness = rtz(self.toughness);
        self.upkeep = rtz(self.upkeep);
        self.crashsafety = rtz(self.crashsafety);
        self.bomb_mass = rtz(self.bomb_mass);
        self.fuel = rtz(self.fuel);
        self.charge = rtz(self.charge);
    }
}

impl Serializable for Stats {
    fn serialize(self: &Self, s: &mut Serializer) -> Result<(), Error> {
        s.push_num(self.liftbleed as i16)?;
        s.push_num(self.wetmass as i16)?;
        s.push_num(self.mass as i16)?;
        s.push_num(self.drag as i16)?;
        s.push_num(self.control as i16)?;
        s.push_num(self.cost as i16)?;
        s.push_num(self.reqsections as i16)?;
        s.push_num(self.visibility as i16)?;
        s.push_num(self.flightstress as i16)?;
        s.push_num(self.escape as i16)?;
        s.push_num(self.pitchstab as i16)?;
        s.push_num(self.latstab as i16)?;
        s.push_num(self.cooling as i16)?;
        s.push_num(self.reliability as i16)?;
        s.push_num(self.power as i16)?;
        s.push_num(self.fuelconsumption as i16)?;
        s.push_num(self.maxstrain as i16)?;
        s.push_num(self.structure as i16)?;
        s.push_float(self.pitchboost as f32)?;
        s.push_float(self.pitchspeed as f32)?;
        s.push_num(self.wingarea as i16)?;
        s.push_num(self.toughness as i16)?;
        s.push_num(self.upkeep as i16)?;
        s.push_num(self.crashsafety as i16)?;
        s.push_num(self.bomb_mass as i16)?;
        s.push_num(self.fuel as i16)?;
        s.push_num(self.charge as i16)?;
        s.push_num(self.warnings.len() as i16)?;
        for warn in &self.warnings {
            s.push_string(&warn.name)?;
            s.push_string(&warn.warning)?;
        }
        s.push_num(self.eras.len() as i16)?;
        for era in &self.eras {
            s.push_string(&era.name)?;
            s.push_string(&era.era.to_string())?;
        }
        Ok(())
    }

    fn deserialize(self: &mut Self, d: &mut Deserializer) -> Result<(), Error> {
        self.liftbleed = d.get_num()? as f64;
        self.wetmass = d.get_num()? as f64;
        self.mass = d.get_num()? as f64;
        self.drag = d.get_num()? as f64;
        self.control = d.get_num()? as f64;
        self.cost = d.get_num()? as f64;
        self.reqsections = d.get_num()? as f64;
        self.visibility = d.get_num()? as f64;
        self.flightstress = d.get_num()? as f64;
        self.escape = d.get_num()? as f64;
        self.pitchstab = d.get_num()? as f64;
        self.latstab = d.get_num()? as f64;
        self.cooling = d.get_num()? as f64;
        self.reliability = d.get_num()? as f64;
        self.power = d.get_num()? as f64;
        self.fuelconsumption = d.get_num()? as f64;
        self.maxstrain = d.get_num()? as f64;
        self.structure = d.get_num()? as f64;
        self.pitchboost = d.get_float()? as f64;
        self.pitchspeed = d.get_float()? as f64;
        self.wingarea = d.get_num()? as f64;
        self.toughness = d.get_num()? as f64;
        self.upkeep = d.get_num()? as f64;
        self.crashsafety = d.get_num()? as f64;
        self.bomb_mass = d.get_num()? as f64;
        self.fuel = d.get_num()? as f64;
        self.charge = d.get_num()? as f64;
        if d.version > 12.25 {
            let wcount = d.get_num()?;
            self.warnings = (0..wcount)
                .map(|_| -> Result<Warning, Error> {
                    Ok(Warning {
                        name: d.get_string()?,
                        warning: d.get_string()?,
                        level: WarningLevel::White,
                    })
                })
                .try_collect()?;
            let ecount = d.get_num()?;
            self.eras = (0..ecount)
                .map(|_| -> Result<Era, Error> {
                    Ok(Era {
                        name: d.get_string()?,
                        era: ERA::from_str(&(d.get_string()?)).unwrap(),
                    })
                })
                .try_collect()?;
        }

        Ok(())
    }
}

impl PartialEq for Stats {
    fn eq(&self, other: &Self) -> bool {
        self.liftbleed == other.liftbleed
            && self.wetmass == other.wetmass
            && self.mass == other.mass
            && self.drag == other.drag
            && self.control == other.control
            && self.cost == other.cost
            && self.reqsections == other.reqsections
            && self.visibility == other.visibility
            && self.flightstress == other.flightstress
            && self.escape == other.escape
            && self.pitchstab == other.pitchstab
            && self.latstab == other.latstab
            && self.cooling == other.cooling
            && self.reliability == other.reliability
            && self.power == other.power
            && self.fuelconsumption == other.fuelconsumption
            && self.maxstrain == other.maxstrain
            && self.structure == other.structure
            && self.pitchboost == other.pitchboost
            && self.pitchspeed == other.pitchspeed
            && self.wingarea == other.wingarea
            && self.toughness == other.toughness
            && self.upkeep == other.upkeep
            && self.crashsafety == other.crashsafety
            && self.bomb_mass == other.bomb_mass
            && self.fuel == other.fuel
            && self.charge == other.charge
    }
}

impl Eq for Stats {}
