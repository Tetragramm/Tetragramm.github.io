use std::{iter::zip, rc::Rc};

use serde_json::Map;

use ui_core::*;
use ui_macro::*;

use crate::{
    json::{jsbool, jsnum},
    lu,
    part::{ElectricsMessage, Part},
    serialization::{JSSerializable, Serializable},
    stats::{rtz, Stats},
};

#[derive(Clone)]
pub struct RadiatorType {
    pub name: String,
    pub stats: Stats,
    pub dragpercool: f64,
}

#[derive(Clone)]
pub struct RadiatorMount {
    pub name: String,
    pub stats: Stats,
}

#[derive(Clone)]
pub struct RadiatorCoolant {
    pub name: String,
    pub harden: bool,
    pub flammable: bool,
    pub stats: Stats,
}

#[derive(UIBindings)]
pub struct Radiator {
    type_list: Rc<Vec<RadiatorType>>,
    #[ui(select, source = "type_list", enabled_opt_fn = "is_type_enabled", set_fn = "set_type_index")]
    idx_type: usize,

    mount_list: Rc<Vec<RadiatorMount>>,
    #[ui(select, source = "mount_list", enabled_opt_fn = "is_mount_enabled", set_fn = "set_mount_index")]
    idx_mount: usize,

    coolant_list: Rc<Vec<RadiatorCoolant>>,
    #[ui(select, source = "coolant_list", set_fn = "set_coolant_index")]
    idx_coolant: usize,

    #[ui(check, name = "harden_cool", set_fn = "set_harden")]
    harden_cool: bool,

    need_cool: f64,
    engine_count: usize,
    has_parasol: bool,
    metal_area: f64,
}

impl Radiator {
    pub fn new(
        type_list: Vec<RadiatorType>,
        mount_list: Vec<RadiatorMount>,
        coolant_list: Vec<RadiatorCoolant>,
    ) -> Radiator {
        Radiator {
            type_list: Rc::new(type_list),
            idx_type: 1,
            mount_list: Rc::new(mount_list),
            idx_mount: 1,
            coolant_list: Rc::new(coolant_list),
            idx_coolant: 0,
            harden_cool: false,
            need_cool: 0.0,
            engine_count: 0,
            has_parasol: false,
            metal_area: 0.0,
        }
    }

    pub fn set_parasol(&mut self, has: bool) {
        self.has_parasol = has;
        let can_mount = self.is_mount_enabled();
        if !can_mount[self.idx_mount] {
            self.idx_mount = 0;
        }
    }

    pub fn set_need_cool(&mut self, num: f64, engnum: usize) {
        self.need_cool = num;
        self.engine_count = engnum;
    }

    pub fn set_metal_area(&mut self, num: f64) {
        self.metal_area = num;
        let can_type = self.is_type_enabled();
        if !can_type[self.idx_type] {
            self.idx_type = 0;
        }
    }

    pub fn get_is_flammable(&self) -> bool {
        self.coolant_list[self.idx_coolant].flammable
    }

    /// From TypeScript CanType(): Evaporation requires metal_area >= engine_count * 5
    fn is_type_enabled(&self) -> Vec<bool> {
        self.type_list
            .iter()
            .map(|t| {
                if t.name == "Evaporation" {
                    self.metal_area >= (self.engine_count * 5) as f64
                } else {
                    true
                }
            })
            .collect()
    }

    /// From TypeScript CanMount(): High Offset requires parasol
    fn is_mount_enabled(&self) -> Vec<bool> {
        self.mount_list
            .iter()
            .map(|m| {
                if m.name == "High Offset" {
                    self.has_parasol
                } else {
                    true
                }
            })
            .collect()
    }

    /// From TypeScript VerifyHarden(): Force harden if coolant requires it
    fn verify_harden(&mut self) {
        if self.coolant_list[self.idx_coolant].harden {
            self.harden_cool = true;
        }
    }

    // Setter functions with verification (for UIBindings)

    /// Set type index
    /// TypeScript: SetTypeIndex(num: number)
    fn set_type_index(&mut self, num: usize) {
        if num < self.type_list.len() {
            self.idx_type = num;
        }
    }

    /// Set mount index with validation
    /// TypeScript: SetMountIndex(num: number)
    fn set_mount_index(&mut self, num: usize) {
        if num < self.mount_list.len() {
            let can_mount = self.is_mount_enabled();
            if can_mount[num] {
                self.idx_mount = num;
            }
        }
    }

    /// Set coolant index
    /// TypeScript: SetCoolantIndex(num: number)
    fn set_coolant_index(&mut self, num: usize) {
        if num < self.coolant_list.len() {
            self.idx_coolant = num;
        }
    }

    /// Set harden coolant flag
    /// TypeScript: SetHarden(use: boolean)
    fn set_harden(&mut self, use_it: bool) {
        self.harden_cool = use_it;
    }
}

impl Part for Radiator {
    fn part_stats(&mut self) -> Stats {
        self.verify_harden();

        let mut stats = Stats::new();
        stats.mass = 3.0;
        stats = stats.add(&self.type_list[self.idx_type].stats);
        stats = stats.add(&self.mount_list[self.idx_mount].stats);
        stats = stats.add(&self.coolant_list[self.idx_coolant].stats);

        stats.drag += rtz(
            -1.0e-6
                + self.type_list[self.idx_type].dragpercool * (self.need_cool - stats.cooling),
        ) as f64;

        if self.harden_cool {
            stats.cost += 2.0;
        }

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}

impl Serializable for Radiator {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        self.idx_type = d.get_num()? as usize;
        self.idx_mount = d.get_num()? as usize;
        self.idx_coolant = d.get_num()? as usize;
        if d.version > 10.85 {
            self.harden_cool = d.get_bool()?;
        }
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.idx_type as i16)?;
        s.push_num(self.idx_mount as i16)?;
        s.push_num(self.idx_coolant as i16)?;
        s.push_bool(self.harden_cool)?;
        Ok(())
    }
}

impl JSSerializable for Radiator {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.idx_type = jsnum(js, "type") as usize;
        self.idx_mount = jsnum(js, "mount") as usize;
        self.idx_coolant = jsnum(js, "coolant") as usize;
        if json_version > 10.85 {
            self.harden_cool = jsbool(js, "harden_cool");
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("type".to_string(), self.idx_type.into());
        map.insert("mount".to_string(), self.idx_mount.into());
        map.insert("coolant".to_string(), self.idx_coolant.into());
        map.insert("harden_cool".to_string(), self.harden_cool.into());

        serde_json::Value::Object(map)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn create_test_radiator() -> Radiator {
        let type_list = vec![
            RadiatorType {
                name: "Standard".to_string(),
                stats: Stats::new(),
                dragpercool: 1.0,
            },
            RadiatorType {
                name: "Evaporation".to_string(),
                stats: Stats::new(),
                dragpercool: 0.5,
            },
        ];

        let mount_list = vec![
            RadiatorMount {
                name: "Standard Mount".to_string(),
                stats: Stats::new(),
            },
            RadiatorMount {
                name: "High Offset".to_string(),
                stats: Stats::new(),
            },
        ];

        let coolant_list = vec![
            RadiatorCoolant {
                name: "Water".to_string(),
                harden: false,
                flammable: false,
                stats: Stats::new(),
            },
            RadiatorCoolant {
                name: "Glycol".to_string(),
                harden: true,
                flammable: false,
                stats: Stats::new(),
            },
            RadiatorCoolant {
                name: "Oil".to_string(),
                harden: false,
                flammable: true,
                stats: Stats::new(),
            },
        ];

        Radiator::new(type_list, mount_list, coolant_list)
    }

    #[test]
    fn test_set_type_index() {
        let mut rad = create_test_radiator();

        // Valid index
        rad.set_type_index(0);
        assert_eq!(rad.idx_type, 0, "Should set to valid index");

        rad.set_type_index(1);
        assert_eq!(rad.idx_type, 1, "Should set to another valid index");

        // Invalid index (out of bounds) should not change
        let before = rad.idx_type;
        rad.set_type_index(99);
        assert_eq!(rad.idx_type, before, "Should not change on invalid index");
    }

    #[test]
    fn test_set_mount_index_with_validation() {
        let mut rad = create_test_radiator();

        // Try to set "High Offset" without parasol - should fail
        rad.has_parasol = false;
        rad.idx_mount = 0;
        rad.set_mount_index(1); // High Offset
        assert_eq!(rad.idx_mount, 0, "Should not allow High Offset without parasol");

        // Enable parasol and try again - should succeed
        rad.has_parasol = true;
        rad.set_mount_index(1); // High Offset
        assert_eq!(rad.idx_mount, 1, "Should allow High Offset with parasol");

        // Standard mount should always work
        rad.has_parasol = false;
        rad.set_mount_index(0);
        assert_eq!(rad.idx_mount, 0, "Should allow Standard Mount without parasol");
    }

    #[test]
    fn test_set_coolant_index() {
        let mut rad = create_test_radiator();

        // Valid indices
        rad.set_coolant_index(0);
        assert_eq!(rad.idx_coolant, 0, "Should set to water");

        rad.set_coolant_index(1);
        assert_eq!(rad.idx_coolant, 1, "Should set to glycol");

        rad.set_coolant_index(2);
        assert_eq!(rad.idx_coolant, 2, "Should set to oil");

        // Invalid index should not change
        let before = rad.idx_coolant;
        rad.set_coolant_index(99);
        assert_eq!(rad.idx_coolant, before, "Should not change on invalid index");
    }

    #[test]
    fn test_set_harden() {
        let mut rad = create_test_radiator();

        // Test setting harden flag
        rad.set_harden(true);
        assert!(rad.harden_cool, "Should enable harden");

        rad.set_harden(false);
        assert!(!rad.harden_cool, "Should disable harden");
    }

    #[test]
    fn test_verify_harden_forces_true() {
        let mut rad = create_test_radiator();

        // Set to glycol (which requires harden)
        rad.idx_coolant = 1;
        rad.harden_cool = false;

        // verify_harden should force it to true
        rad.verify_harden();
        assert!(rad.harden_cool, "Should force harden for glycol");

        // Set to water (doesn't require harden)
        rad.idx_coolant = 0;
        rad.harden_cool = false;
        rad.verify_harden();
        assert!(!rad.harden_cool, "Should not force harden for water");
    }

    #[test]
    fn test_is_type_enabled_evaporation() {
        let mut rad = create_test_radiator();

        // Set up with 2 engines
        rad.engine_count = 2;
        rad.metal_area = 5.0; // Less than 2 * 5 = 10

        let enabled = rad.is_type_enabled();
        assert!(enabled[0], "Standard should always be enabled");
        assert!(!enabled[1], "Evaporation should not be enabled (insufficient metal area)");

        // Increase metal area
        rad.metal_area = 15.0; // Greater than 2 * 5 = 10
        let enabled = rad.is_type_enabled();
        assert!(enabled[0], "Standard should still be enabled");
        assert!(enabled[1], "Evaporation should now be enabled");
    }

    #[test]
    fn test_is_mount_enabled_high_offset() {
        let mut rad = create_test_radiator();

        // Without parasol
        rad.has_parasol = false;
        let enabled = rad.is_mount_enabled();
        assert!(enabled[0], "Standard Mount should always be enabled");
        assert!(!enabled[1], "High Offset should not be enabled without parasol");

        // With parasol
        rad.has_parasol = true;
        let enabled = rad.is_mount_enabled();
        assert!(enabled[0], "Standard Mount should still be enabled");
        assert!(enabled[1], "High Offset should be enabled with parasol");
    }

    #[test]
    fn test_get_is_flammable() {
        let mut rad = create_test_radiator();

        // Water is not flammable
        rad.idx_coolant = 0;
        assert!(!rad.get_is_flammable(), "Water should not be flammable");

        // Glycol is not flammable
        rad.idx_coolant = 1;
        assert!(!rad.get_is_flammable(), "Glycol should not be flammable");

        // Oil is flammable
        rad.idx_coolant = 2;
        assert!(rad.get_is_flammable(), "Oil should be flammable");
    }
}
