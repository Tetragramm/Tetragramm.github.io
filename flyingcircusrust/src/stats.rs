use itertools::{chain, Itertools};
use serde::{Deserialize, Serialize};
use std::fmt::Display;
use std::str::FromStr;

use serde_json::Map;

use crate::json::*;
use crate::serialization::{Deserializer, Error, JSSerializable, Serializable, Serializer};

#[derive(Clone, PartialEq, Eq, Hash, Copy, Debug, Serialize, Deserialize)]
pub enum WarningLevel {
    White,
    Yellow,
    Red,
}

#[derive(Clone, PartialEq, Eq, Hash, Debug, Serialize, Deserialize)]
pub struct Warning {
    pub name: String,
    pub warning: String,
    pub level: WarningLevel,
}
fn merge_warnings(a: Vec<Warning>, b: Vec<Warning>) -> Vec<Warning> {
    let v: Vec<Warning> = chain!(a, b).unique().collect();
    v
}

#[derive(Clone, PartialEq, Eq, Hash, Debug, Serialize, Deserialize)]
#[serde(try_from = "&str", into = "String")]
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
        String::from(self.clone())
    }
}

impl From<ERA> for String {
    fn from(era: ERA) -> String {
        match era {
            ERA::Himmilgard => t!("Himmilgard").to_string(),
            ERA::Pioneer => t!("Pioneer").to_string(),
            ERA::WWI => t!("WWI").to_string(),
            ERA::Roaring20s => t!("Roaring 20s").to_string(),
            ERA::ComingStorm => t!("Coming Storm").to_string(),
            ERA::WWII => t!("WWII").to_string(),
            ERA::LastHurrah => t!("Last Hurrah").to_string(),
        }
        .to_owned()
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct ParseEraError;
impl Display for ParseEraError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str("Failed to Parse Era.")
    }
}
impl TryFrom<&str> for ERA {
    type Error = ParseEraError;

    fn try_from(v: &str) -> Result<Self, ParseEraError> {
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
impl TryFrom<String> for ERA {
    type Error = ParseEraError;

    fn try_from(v: String) -> Result<Self, ParseEraError> {
        ERA::try_from(v.as_str())
    }
}

#[derive(Clone, PartialEq, Eq, Hash, Debug, Serialize, Deserialize)]
pub struct Era {
    pub name: String,
    pub era: ERA,
}

fn merge_eras(a: Vec<Era>, b: Vec<Era>) -> Vec<Era> {
    let v: Vec<Era> = chain!(a, b).unique().collect();
    v
}

pub fn rtz(num: f32) -> f32 {
    if num > 0f32 {
        return (1.0e-6 + num).floor();
    } else {
        return (-1.0e-6 + num).ceil();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Stats {
    pub liftbleed: f32,
    pub wetmass: f32,
    pub mass: f32,
    pub drag: f32,
    pub control: f32,
    pub cost: f32,
    pub reqsections: f32,
    pub visibility: f32,
    pub flightstress: f32,
    pub escape: f32,
    pub pitchstab: f32,
    pub latstab: f32,
    pub cooling: f32,
    pub reliability: f32,
    pub power: f32,
    pub fuelconsumption: f32,
    pub maxstrain: f32,
    pub structure: f32,
    pub pitchboost: f32,
    pub pitchspeed: f32,
    pub wingarea: f32,
    pub toughness: f32,
    pub upkeep: f32,
    pub crashsafety: f32,
    pub bomb_mass: f32,
    pub fuel: f32,
    pub charge: f32,
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
                    name: t!(jsstr(js, "name")).to_string(),
                    warning: t!(vstr(w)).to_string(),
                    level: WarningLevel::White,
                }]
            } else if let Some(ws) = js.get("warnings") {
                ws.as_array()
                    .unwrap()
                    .iter()
                    .map(|x| Warning {
                        name: t!(jsstr(js, "name")).to_string(),
                        warning: t!(vstr(x)).to_string(),
                        level: WarningLevel::White,
                    })
                    .collect()
            } else {
                Vec::new()
            },
            eras: if let Some(e) = js.get("era") {
                vec![Era {
                    name: t!(jsstr(js, "name")).to_string(),
                    era: ERA::try_from(vstr(e)).unwrap(),
                }]
            } else if let Some(es) = js.get("eras") {
                es.as_array()
                    .unwrap()
                    .iter()
                    .map(|x| Era {
                        name: t!(jsstr(js, "name")).to_string(),
                        era: ERA::try_from(vstr(x)).unwrap(),
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

    pub fn multiply(self: &Stats, value: f32) -> Stats {
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

    pub fn round(self: &mut Self) {
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
            s.push_string(&String::from(era.era.clone()))?;
        }
        Ok(())
    }

    fn deserialize(self: &mut Self, d: &mut Deserializer) -> Result<(), Error> {
        self.liftbleed = d.get_num()? as f32;
        self.wetmass = d.get_num()? as f32;
        self.mass = d.get_num()? as f32;
        self.drag = d.get_num()? as f32;
        self.control = d.get_num()? as f32;
        self.cost = d.get_num()? as f32;
        self.reqsections = d.get_num()? as f32;
        self.visibility = d.get_num()? as f32;
        self.flightstress = d.get_num()? as f32;
        self.escape = d.get_num()? as f32;
        self.pitchstab = d.get_num()? as f32;
        self.latstab = d.get_num()? as f32;
        self.cooling = d.get_num()? as f32;
        self.reliability = d.get_num()? as f32;
        self.power = d.get_num()? as f32;
        self.fuelconsumption = d.get_num()? as f32;
        self.maxstrain = d.get_num()? as f32;
        self.structure = d.get_num()? as f32;
        self.pitchboost = d.get_float()? as f32;
        self.pitchspeed = d.get_float()? as f32;
        self.wingarea = d.get_num()? as f32;
        self.toughness = d.get_num()? as f32;
        self.upkeep = d.get_num()? as f32;
        self.crashsafety = d.get_num()? as f32;
        self.bomb_mass = d.get_num()? as f32;
        self.fuel = d.get_num()? as f32;
        self.charge = d.get_num()? as f32;
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
                        era: ERA::try_from(d.get_string()?).unwrap(),
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

impl JSSerializable for Stats {
    fn from_json(&mut self, js: &serde_json::Value, _json_version: f32) {
        self.liftbleed = jsnum(js, "liftbleed");
        self.wetmass = jsnum(js, "wetmass");
        self.mass = jsnum(js, "mass");
        self.drag = jsnum(js, "drag");
        self.control = jsnum(js, "control");
        self.cost = jsnum(js, "cost");
        self.reqsections = jsnum(js, "reqsections");
        self.visibility = jsnum(js, "visibility");
        self.flightstress = jsnum(js, "flightstress");
        self.escape = jsnum(js, "escape");
        self.pitchstab = jsnum(js, "pitchstab");
        self.latstab = jsnum(js, "latstab");
        self.cooling = jsnum(js, "cooling");
        self.reliability = jsnum(js, "reliability");
        self.power = jsnum(js, "power");
        self.fuelconsumption = jsnum(js, "fuelconsumption");
        self.maxstrain = jsnum(js, "maxstrain");
        self.structure = jsnum(js, "structure");
        self.pitchboost = jsnum(js, "pitchboost");
        self.pitchspeed = jsnum(js, "pitchspeed");
        self.wingarea = jsnum(js, "wingarea");
        self.toughness = jsnum(js, "toughness");
        self.upkeep = jsnum(js, "upkeep");
        self.crashsafety = jsnum(js, "crashsafety");
        self.bomb_mass = jsnum(js, "bomb_mass");
        self.fuel = jsnum(js, "fuel");
        self.charge = jsnum(js, "charge");

        // Deserialize warnings
        if let Some(warnings_array) = js.get("warnings") {
            if let Some(arr) = warnings_array.as_array() {
                self.warnings = arr
                    .iter()
                    .map(|w| Warning {
                        name: jsstr(w, "source"),
                        warning: jsstr(w, "warning"),
                        level: match w.get("color").and_then(|c| c.as_i64()).unwrap_or(0) {
                            1 => WarningLevel::Yellow,
                            2 => WarningLevel::Red,
                            _ => WarningLevel::White,
                        },
                    })
                    .collect();
            }
        }

        // Deserialize eras
        if let Some(eras_array) = js.get("eras") {
            if let Some(arr) = eras_array.as_array() {
                self.eras = arr
                    .iter()
                    .filter_map(|e| {
                        let name = jsstr(e, "name");
                        let era_str = jsstr(e, "era");
                        ERA::try_from(era_str).ok().map(|era| Era { name, era })
                    })
                    .collect();
            }
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("liftbleed".to_string(), self.liftbleed.into());
        map.insert("wetmass".to_string(), self.wetmass.into());
        map.insert("mass".to_string(), self.mass.into());
        map.insert("drag".to_string(), self.drag.into());
        map.insert("control".to_string(), self.control.into());
        map.insert("cost".to_string(), self.cost.into());
        map.insert("reqsections".to_string(), self.reqsections.into());
        map.insert("visibility".to_string(), self.visibility.into());
        map.insert("flightstress".to_string(), self.flightstress.into());
        map.insert("escape".to_string(), self.escape.into());
        map.insert("pitchstab".to_string(), self.pitchstab.into());
        map.insert("latstab".to_string(), self.latstab.into());
        map.insert("cooling".to_string(), self.cooling.into());
        map.insert("reliability".to_string(), self.reliability.into());
        map.insert("power".to_string(), self.power.into());
        map.insert("fuelconsumption".to_string(), self.fuelconsumption.into());
        map.insert("maxstrain".to_string(), self.maxstrain.into());
        map.insert("structure".to_string(), self.structure.into());
        map.insert("pitchboost".to_string(), self.pitchboost.into());
        map.insert("pitchspeed".to_string(), self.pitchspeed.into());
        map.insert("wingarea".to_string(), self.wingarea.into());
        map.insert("toughness".to_string(), self.toughness.into());
        map.insert("upkeep".to_string(), self.upkeep.into());
        map.insert("crashsafety".to_string(), self.crashsafety.into());
        map.insert("bomb_mass".to_string(), self.bomb_mass.into());
        map.insert("fuel".to_string(), self.fuel.into());
        map.insert("charge".to_string(), self.charge.into());

        // Serialize warnings
        if !self.warnings.is_empty() {
            let warnings_array: Vec<serde_json::Value> = self
                .warnings
                .iter()
                .map(|w| {
                    let mut warning_map = Map::new();
                    warning_map.insert("source".to_string(), w.name.clone().into());
                    warning_map.insert("warning".to_string(), w.warning.clone().into());
                    warning_map.insert(
                        "color".to_string(),
                        (match w.level {
                            WarningLevel::White => 0,
                            WarningLevel::Yellow => 1,
                            WarningLevel::Red => 2,
                        })
                        .into(),
                    );
                    serde_json::Value::Object(warning_map)
                })
                .collect();
            map.insert("warnings".to_string(), warnings_array.into());
        }

        // Serialize eras
        if !self.eras.is_empty() {
            let eras_array: Vec<serde_json::Value> = self
                .eras
                .iter()
                .map(|e| {
                    let mut era_map = Map::new();
                    era_map.insert("name".to_string(), e.name.clone().into());
                    era_map.insert("era".to_string(), e.era.to_string().into());
                    serde_json::Value::Object(era_map)
                })
                .collect();
            map.insert("eras".to_string(), eras_array.into());
        }

        serde_json::Value::Object(map)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_warnings_eras_json_roundtrip() {
        // Create a Stats object with warnings and eras
        let mut stats = Stats::new();
        stats.mass = 10.0;
        stats.warnings = vec![
            Warning {
                name: "Test Warning 1".to_string(),
                warning: "This is a test warning".to_string(),
                level: WarningLevel::White,
            },
            Warning {
                name: "Test Warning 2".to_string(),
                warning: "This is a yellow warning".to_string(),
                level: WarningLevel::Yellow,
            },
            Warning {
                name: "Test Warning 3".to_string(),
                warning: "This is a red warning".to_string(),
                level: WarningLevel::Red,
            },
        ];
        stats.eras = vec![
            Era {
                name: "Test Part 1".to_string(),
                era: ERA::Pioneer,
            },
            Era {
                name: "Test Part 2".to_string(),
                era: ERA::WWI,
            },
        ];

        // Serialize to JSON
        let json = stats.to_json();

        // Deserialize from JSON
        let mut stats2 = Stats::new();
        stats2.from_json(&json, 12.7);

        // Verify the values match
        assert_eq!(stats.mass, stats2.mass);
        assert_eq!(stats.warnings.len(), stats2.warnings.len());
        assert_eq!(stats.eras.len(), stats2.eras.len());

        // Check warnings
        for (w1, w2) in stats.warnings.iter().zip(stats2.warnings.iter()) {
            assert_eq!(w1.name, w2.name);
            assert_eq!(w1.warning, w2.warning);
            assert_eq!(w1.level, w2.level);
        }

        // Check eras
        for (e1, e2) in stats.eras.iter().zip(stats2.eras.iter()) {
            assert_eq!(e1.name, e2.name);
            assert_eq!(e1.era, e2.era);
        }
    }
}
