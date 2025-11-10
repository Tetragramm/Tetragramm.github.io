use serde_json::Map;

use ui_core::*;
use ui_macro::*;

use crate::{
    json::{jsbool, jsnum},
    part::{ElectricsMessage, Part},
    serialization::{JSSerializable, Serializable},
    stats::{Stats, Warning},
};
use rust_i18n::t;

#[derive(UIBindings)]
pub struct Passengers {
    #[ui(number, name = "seats")]
    seats: i16,
    #[ui(number, name = "beds")]
    beds: i16,
    #[ui(
        check,
        name = "Passengers Connectivity",
        enabled_fn = "is_connected_enabled"
    )]
    connected: bool,
}

impl Passengers {
    pub fn new() -> Passengers {
        Passengers {
            seats: 0,
            beds: 0,
            connected: false,
        }
    }

    /// From TypeScript PossibleConnection(): enabled when seats + beds > 0
    fn is_connected_enabled(&self) -> bool {
        self.seats + self.beds > 0
    }
}

impl Part for Passengers {
    fn part_stats(&mut self) -> crate::stats::Stats {
        let mut s = Stats::new();
        s.reqsections = 2.0 * (-1.0e-6 + (self.seats + 2 * self.beds) as f32 / 5.0).ceil();
        if self.seats + self.beds > 0 && self.connected {
            s.mass = 1.;
            s.warnings.push(Warning {
                name: t!("Passengers Section Title").to_string(),
                warning: t!("Passenger Connectivity Warning").to_string(),
                level: crate::stats::WarningLevel::White,
            });
        }
        s.bomb_mass = (self.seats + self.beds) as f32;
        //Because it is load it rounds up to the nearest 5 mass
        if s.bomb_mass as i16 % 5 > 0 {
            s.bomb_mass += (5 - (s.bomb_mass as i16 % 5)) as f32;
        }

        if self.seats + self.beds > 0 {
            s.warnings.push(Warning {
                name: t!("Passengers Section Title").to_string(),
                warning: t!("Passengers Count", A = self.seats, B = self.beds).to_string(),
                level: crate::stats::WarningLevel::White,
            });
        }

        s
    }

    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        ElectricsMessage::new()
    }
}

impl Serializable for Passengers {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        self.seats = d.get_num()?;
        self.beds = d.get_num()?;
        self.connected = d.get_bool()?;
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.seats)?;
        s.push_num(self.beds)?;
        s.push_bool(self.connected)?;
        Ok(())
    }
}

impl JSSerializable for Passengers {
    fn from_json(&mut self, js: &serde_json::Value, _: f32) {
        self.seats = jsnum(js, "seats") as i16;
        self.beds = jsnum(js, "beds") as i16;
        self.connected = jsbool(js, "connected");
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("seats".to_string(), self.seats.into());
        map.insert("beds".to_string(), self.beds.into());
        map.insert("connected".to_string(), self.connected.into());

        serde_json::Value::Object(map)
    }
}
