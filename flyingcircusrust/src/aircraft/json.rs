use super::*;
use crate::json::*;
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Aircraft {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f32) {
        // Deserialize name
        if let Some(name) = js.get("name") {
            self.name = vstr(name);
        }

        // Deserialize aircraft_type (added in version 11.05)
        if json_version > 11.05 {
            if let Some(acft_type) = js.get("aircraft_type") {
                self.aircraft_type = AircraftType::from(acft_type.as_i64().unwrap_or(0) as i16);
            }
        } else {
            self.aircraft_type = AircraftType::Airplane;
        }

        // Deserialize all sub-components
        if let Some(era_js) = js.get("era") {
            self.era.from_json(era_js, json_version);
        }

        if let Some(cockpits_js) = js.get("cockpits") {
            self.cockpits.from_json(cockpits_js, json_version);
        }

        if let Some(passengers_js) = js.get("passengers") {
            self.passengers.from_json(passengers_js, json_version);
        }

        if let Some(engines_js) = js.get("engines") {
            self.engines.from_json(engines_js, json_version);
        }

        if let Some(propeller_js) = js.get("propeller") {
            self.propeller.from_json(propeller_js, json_version);
        }

        if let Some(frames_js) = js.get("frames") {
            self.frames.from_json(frames_js, json_version);
        }

        if let Some(fuel_js) = js.get("fuel") {
            self.fuel.from_json(fuel_js, json_version);
        }

        if let Some(munitions_js) = js.get("munitions") {
            self.munitions.from_json(munitions_js, json_version);
        }

        if let Some(cargo_js) = js.get("cargo") {
            self.cargo.from_json(cargo_js, json_version);
        }

        if let Some(weapons_js) = js.get("weapons") {
            self.weapons.from_json(weapons_js, json_version);
        }

        if let Some(wings_js) = js.get("wings") {
            self.wings.from_json(wings_js, json_version);
        }

        if let Some(controlsurfaces_js) = js.get("controlsurfaces") {
            self.controlsurfaces
                .from_json(controlsurfaces_js, json_version);
        }

        if let Some(reinforcement_js) = js.get("reinforcements") {
            self.reinforcements
                .from_json(reinforcement_js, json_version);
        }

        if let Some(accessories_js) = js.get("accessories") {
            self.accessories.from_json(accessories_js, json_version);
        }

        if let Some(stabilizers_js) = js.get("stabilizers") {
            self.stabilizers.from_json(stabilizers_js, json_version);
        }

        if let Some(gear_js) = js.get("gear") {
            self.gear.from_json(gear_js, json_version);
        }

        if let Some(optimization_js) = js.get("optimization") {
            self.optimization.from_json(optimization_js, json_version);
        }

        if json_version > 10.65 {
            if let Some(used_js) = js.get("used") {
                self.used.from_json(used_js, json_version);
            }
        }

        if json_version > 11.05 {
            if let Some(rotor_js) = js.get("rotor") {
                self.rotor.from_json(rotor_js, json_version);
            }
        }

        if let Some(alter_js) = js.get("alter") {
            self.alter.from_json(alter_js, json_version);
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();

        // Add version
        map.insert("version".to_string(), "12.65".into());

        // Add name
        map.insert("name".to_string(), self.name.clone().into());

        // Add aircraft_type
        map.insert(
            "aircraft_type".to_string(),
            (self.aircraft_type as i16).into(),
        );

        // Add all sub-components
        map.insert("era".to_string(), self.era.to_json());
        map.insert("cockpits".to_string(), self.cockpits.to_json());
        map.insert("passengers".to_string(), self.passengers.to_json());
        map.insert("engines".to_string(), self.engines.to_json());
        map.insert("propeller".to_string(), self.propeller.to_json());
        map.insert("frames".to_string(), self.frames.to_json());
        map.insert("fuel".to_string(), self.fuel.to_json());
        map.insert("munitions".to_string(), self.munitions.to_json());
        map.insert(
            "controlsurfaces".to_string(),
            self.controlsurfaces.to_json(),
        );
        map.insert("reinforcements".to_string(), self.reinforcements.to_json());
        map.insert("accessories".to_string(), self.accessories.to_json());
        map.insert("stabilizers".to_string(), self.stabilizers.to_json());
        map.insert("cargo".to_string(), self.cargo.to_json());
        map.insert("weapons".to_string(), self.weapons.to_json());
        map.insert("wings".to_string(), self.wings.to_json());
        map.insert("rotor".to_string(), self.rotor.to_json());
        map.insert("gear".to_string(), self.gear.to_json());
        map.insert("optimization".to_string(), self.optimization.to_json());
        map.insert("alter".to_string(), self.alter.to_json());
        map.insert("used".to_string(), self.used.to_json());

        serde_json::Value::Object(map)
    }
}
