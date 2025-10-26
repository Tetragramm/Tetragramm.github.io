use std::{iter::zip, rc::Rc};

use serde_json::Map;

use ui_core::*;
use ui_macro::*;

use crate::{
    cockpits::{CockpitType, GunsightType, SafetyType, UpgradeType},
    json::{jsboolarr, jsnum},
    lu,
    part::{ElectricsMessage, Equipment, Part},
    serialization::{JSSerializable, Serializable},
    stats::{rtz, Stats, Warning, WarningLevel},
};

#[derive(Clone, UIBindings)]
pub struct Cockpit {
    types: Rc<Vec<CockpitType>>,
    upgrades: Rc<Vec<UpgradeType>>,
    safety: Rc<Vec<SafetyType>>,
    gunsights: Rc<Vec<GunsightType>>,

    #[ui(
        select,
        source = "types",
        enabled_fn,
        enabled_opt_fn = "is_type_enabled"
    )]
    selected_type: usize,
    #[ui(check_list, source = "upgrades", enabled_fn = "is_upgrade_enabled")]
    selected_upgrades: Vec<bool>,
    #[ui(check_list, source = "safety", enabled_fn = "is_safety_enabled")]
    selected_safety: Vec<bool>,
    #[ui(check_list, source = "gunsights", enabled_fn)]
    selected_gunsights: Vec<bool>,

    this_stats: Stats,
    total_stress: (i16, i16),
    total_escape: i16,
    total_visibility: i16,
    seat_index: usize,
    #[ui(
        number,
        name = "bombsight",
        enabled_fn,
        set_fn = "set_bombsight_quality"
    )]
    bombsight: i16,
    has_rotary: bool,
    is_armed: bool,
}

impl Cockpit {
    pub fn new(
        types: &Rc<Vec<CockpitType>>,
        upgrades: &Rc<Vec<UpgradeType>>,
        safety: &Rc<Vec<SafetyType>>,
        gunsights: &Rc<Vec<GunsightType>>,
    ) -> Cockpit {
        Cockpit {
            types: types.clone(),
            upgrades: upgrades.clone(),
            safety: safety.clone(),
            gunsights: gunsights.clone(),
            selected_type: 0,
            selected_upgrades: vec![false; upgrades.len()],
            selected_safety: vec![false; safety.len()],
            selected_gunsights: vec![false; gunsights.len()],
            this_stats: Stats::new(),
            total_stress: (0, 0),
            total_escape: 0,
            total_visibility: 0,
            seat_index: 0,
            bombsight: 0,
            has_rotary: false,
            is_armed: false,
        }
    }

    fn is_primary(&self) -> bool {
        self.seat_index == 0
    }

    pub fn set_seat_index(&mut self, idx: usize) {
        self.seat_index = idx;
    }

    fn is_copilot(&self) -> bool {
        self.selected_upgrades[0]
    }

    // Enabled functions for UI bindings
    fn is_selected_type_enabled(&self) -> bool {
        true
    }

    fn is_type_enabled(&self) -> Vec<bool> {
        vec![true; self.types.len()]
    }

    fn is_upgrade_enabled(&self) -> Vec<bool> {
        // From TypeScript CanUpgrades(): can[0] = false if IsPrimary()
        let mut can = vec![true; self.upgrades.len()];
        if self.is_primary() {
            can[0] = false;
        }
        can
    }

    fn is_safety_enabled(&self) -> Vec<bool> {
        // From TypeScript CanSafety(): lst[5] = !this.types[this.selected_type].exposed
        let mut lst = vec![true; self.safety.len()];
        if self.safety.len() > 5 {
            lst[5] = !self.types[self.selected_type].exposed;
        }
        lst
    }

    fn is_selected_gunsights_enabled(&self) -> Vec<bool> {
        vec![true; self.gunsights.len()]
    }

    fn is_bombsight_enabled(&self) -> bool {
        true
    }

    /// Setter for bombsight quality with validation
    /// This implements the same logic as TypeScript's SetBombsightQuality:
    /// - Clicking up/down by 1 jumps by 3 instead
    /// - Values below 2 become 0
    /// - Values are normalized to multiples of 3 plus 1 (1, 4, 7, 10, etc.)
    fn set_bombsight_quality(&mut self, mut num: i16) {
        // Check if incrementing or decrementing by 1, jump by 3 instead
        if num == self.bombsight - 1 {
            num = self.bombsight - 3;
        }
        if num == self.bombsight + 1 {
            num = self.bombsight + 3;
        }
        // If less than 2, set to 0
        if num < 2 {
            num = 0;
        }
        // If greater than 0, normalize to multiples of 3 plus 1
        if num > 0 {
            num = num - (num % 3) + 1;
        }
        self.bombsight = num;
    }

    //TODO: On set, check CanSafety
}

impl Part for Cockpit {
    fn part_stats(&mut self) -> Stats {
        let mut s = Stats::new();
        s.reqsections += 1.0;
        s = s.add(&self.types[self.selected_type].stats);

        let _ = zip(self.upgrades.iter(), &self.selected_upgrades).map(|(val, sel)| {
            if *sel {
                s = s.add(&val.stats);
            }
        });
        let _ = zip(self.safety.iter(), &self.selected_safety).map(|(val, sel)| {
            if *sel {
                s = s.add(&val.stats);
            }
        });
        let _ = zip(self.gunsights.iter(), &self.selected_gunsights).map(|(val, sel)| {
            if *sel {
                s = s.add(&val.stats);
            }
        });

        if self.bombsight > 0 {
            s.cost += rtz(1.0e-6 + 2.0 + (self.bombsight - 4) as f64 / 3.0);
            s.warnings.push(Warning {
                name: lu!("Bombsight"),
                warning: lu!("Bombsight Warning", self.bombsight),
                level: WarningLevel::White,
            });

            if self.is_copilot() {
                s.warnings.push(Warning {
                    name: lu!("Bombadier Controls"),
                    warning: lu!("Bombadier Controls Warning"),
                    level: WarningLevel::White,
                })
            }
        }

        self.this_stats = s.clone();

        // Special stuff for co-pilot controls
        if self.is_copilot() {
            s.flightstress = self.upgrades[0].stats.flightstress;
            self.this_stats.flightstress -= s.flightstress;
        } else {
            s.flightstress = 0.0;
        }

        s
    }

    fn get_electrics(&self) -> ElectricsMessage {
        let mut equip: Vec<Equipment> = Vec::new();
        let _ = zip(self.upgrades.iter(), &self.selected_upgrades).map(|(val, sel)| {
            if *sel {
                equip.extend(format_equipment(&val.name, val.stats.charge));
            }
        });
        let _ = zip(self.safety.iter(), &self.selected_safety).map(|(val, sel)| {
            if *sel {
                equip.extend(format_equipment(&val.name, val.stats.charge));
            }
        });
        let _ = zip(self.gunsights.iter(), &self.selected_gunsights).map(|(val, sel)| {
            if *sel {
                equip.extend(format_equipment(&val.name, val.stats.charge));
            }
        });

        ElectricsMessage {
            storage: 0,
            equipment: equip,
        }
    }
}

fn format_equipment(name: &String, charge: f64) -> Vec<Equipment> {
    let mut equip: Vec<Equipment> = Vec::new();
    if charge.abs() > 0.5 {
        equip.push(Equipment {
            source: lu!(name),
            charge: charge.to_string(),
        });
    } else if charge > 0.0 && charge < 1.0e-6 {
        equip.push(Equipment {
            source: lu!(name),
            charge: "-".to_string(),
        });
    }
    equip
}

impl Serializable for Cockpit {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        self.selected_type = d.get_num()? as usize;
        self.selected_upgrades = d.get_bool_arr(self.upgrades.len())?;
        self.selected_safety = d.get_bool_arr(self.safety.len())?;
        self.selected_gunsights = d.get_bool_arr(self.gunsights.len())?;
        if self.is_primary() {
            self.selected_upgrades[0] = false;
        }
        if d.version > 10.35 {
            self.bombsight = d.get_num()?;
        }
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.selected_type as i16)?;
        s.push_bool_arr(&self.selected_upgrades)?;
        s.push_bool_arr(&self.selected_safety)?;
        s.push_bool_arr(&self.selected_gunsights)?;
        s.push_num(self.bombsight)?;
        Ok(())
    }
}

impl JSSerializable for Cockpit {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.selected_type = jsnum(js, "type") as usize;
        self.selected_upgrades = jsboolarr(js, "upgrades");
        self.selected_safety = jsboolarr(js, "safety");
        self.selected_gunsights = jsboolarr(js, "sights");
        if self.is_primary() {
            self.selected_upgrades[0] = false;
        }
        if json_version > 10.35 {
            self.bombsight = jsnum(js, "bombsight") as i16;
        }
    }
    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("type".to_string(), self.selected_type.into());
        map.insert(
            "upgrades".to_string(),
            serde_json::Value::Array(
                self.selected_upgrades
                    .iter()
                    .map(|b| serde_json::Value::Bool(*b))
                    .collect(),
            ),
        );
        map.insert(
            "safety".to_string(),
            serde_json::Value::Array(
                self.selected_safety
                    .iter()
                    .map(|b| serde_json::Value::Bool(*b))
                    .collect(),
            ),
        );
        map.insert(
            "sights".to_string(),
            serde_json::Value::Array(
                self.selected_gunsights
                    .iter()
                    .map(|b| serde_json::Value::Bool(*b))
                    .collect(),
            ),
        );
        map.insert("bombsight".to_string(), self.bombsight.into());

        serde_json::Value::Object(map)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_set_bombsight_quality() {
        let types = Rc::new(vec![]);
        let upgrades = Rc::new(vec![]);
        let safety = Rc::new(vec![]);
        let gunsights = Rc::new(vec![]);
        let mut cockpit = Cockpit::new(&types, &upgrades, &safety, &gunsights);

        // Test setting to 0
        cockpit.bombsight = 0;
        cockpit.set_bombsight_quality(0);
        assert_eq!(cockpit.bombsight, 0, "0 should stay 0");

        // Test values below 2 become 0 when not adjacent
        cockpit.bombsight = 10; // Set to a non-adjacent value first
        cockpit.set_bombsight_quality(1);
        assert_eq!(cockpit.bombsight, 0, "1 should become 0 when not adjacent");

        // Test normalization to multiples of 3 plus 1 (when not adjacent)
        cockpit.bombsight = 0; // Reset to non-adjacent
        cockpit.set_bombsight_quality(4);
        assert_eq!(cockpit.bombsight, 4, "4 should stay 4 (4 = 3*1 + 1)");

        // Test normalization: num - (num % 3) + 1
        // Valid values are 1, 4, 7, 10, 13, ... (multiples of 3 plus 1)
        cockpit.bombsight = 10; // Set to non-adjacent first
        cockpit.set_bombsight_quality(5);
        assert_eq!(cockpit.bombsight, 4, "5 normalizes to 4 (5 - 2 + 1)");

        cockpit.bombsight = 10;
        cockpit.set_bombsight_quality(6);
        assert_eq!(cockpit.bombsight, 7, "6 normalizes to 7 (6 - 0 + 1)");

        cockpit.bombsight = 10;
        cockpit.set_bombsight_quality(7);
        assert_eq!(cockpit.bombsight, 7, "7 stays 7 (7 = 3*2 + 1)");

        cockpit.bombsight = 10;
        cockpit.set_bombsight_quality(8);
        assert_eq!(cockpit.bombsight, 7, "8 normalizes to 7 (8 - 1 + 1)");

        cockpit.bombsight = 10;
        cockpit.set_bombsight_quality(9);
        assert_eq!(cockpit.bombsight, 7, "9 normalizes to 7 (9 - 2 + 1)");

        cockpit.bombsight = 10;
        cockpit.set_bombsight_quality(10);
        assert_eq!(cockpit.bombsight, 10, "10 stays 10 (10 - 0 + 1)");

        // Test incrementing by 1 (arrow key) jumps by 3
        cockpit.bombsight = 4;
        cockpit.set_bombsight_quality(5); // Detected as +1
        assert_eq!(cockpit.bombsight, 7, "4+1 should jump to 7");

        // Test decrementing by 1 (arrow key) jumps by 3
        cockpit.bombsight = 7;
        cockpit.set_bombsight_quality(6); // Detected as -1
        assert_eq!(cockpit.bombsight, 4, "7-1 should jump to 4");

        // Test decrementing from 4 to 3 jumps to 1, which becomes 0
        cockpit.bombsight = 4;
        cockpit.set_bombsight_quality(3); // Detected as -1
        assert_eq!(cockpit.bombsight, 0, "4-1 jumps to 1, which becomes 0");

        // Test incrementing from 0 by 1 jumps to 3, normalizes to 4
        cockpit.bombsight = 0;
        cockpit.set_bombsight_quality(1); // Detected as +1
        assert_eq!(cockpit.bombsight, 4, "0+1 jumps to 3, normalizes to 4");
    }
}
