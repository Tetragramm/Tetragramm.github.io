use std::{io::Chain, iter::zip, rc::Rc};

use serde_json::Map;

use ui_core::*;
use ui_macro::*;

use crate::{
    cockpits::{CockpitType, GunsightType, SafetyType, UpgradeType},
    disp::*,
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
    #[ui(number, name = "bombsight", enabled_fn)]
    bombsight: i16,
    has_rotary: bool,
    is_armed: bool,
}

// pub struct CockpitOptions {
//     selected_type: Select,
//     upgrades: Vec<Check>,
//     safety: Vec<Check>,
//     gunsights: Vec<Check>,
//     bombsight: Number,
// }

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

    pub fn get_options(&self) -> CockpitOptions {
        CockpitOptions {
            selected_type: Select {
                enabled: true,
                options: self
                    .types
                    .iter()
                    .map(|t| SelectOpt {
                        name: t.name.clone(),
                        enabled: true,
                    })
                    .collect(),
                selected: self.selected_type,
            },
            upgrades: zip(self.upgrades.iter(), self.selected_upgrades.iter())
                .map(|(u, sel)| Check {
                    name: u.name.clone(),
                    enabled: true,
                    selected: *sel,
                })
                .collect(),
            safety: zip(self.safety.iter(), self.selected_safety.iter())
                .map(|(s, sel)| Check {
                    name: s.name.clone(),
                    enabled: true,
                    selected: *sel,
                })
                .collect(),
            gunsights: zip(self.gunsights.iter(), self.selected_gunsights.iter())
                .map(|(g, sel)| Check {
                    name: g.name.clone(),
                    enabled: true,
                    selected: *sel,
                })
                .collect(),
            bombsight: Number {
                name: lu!("Cockpit Bombsight"),
                enabled: true,
                value: self.bombsight,
            },
        }
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
