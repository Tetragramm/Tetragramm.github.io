mod cockpit {
    use std::{iter::zip, rc::Rc};
    use serde_json::Map;
    use ui_core::*;
    use ui_macro::*;
    use crate::{
        cockpits::{CockpitType, GunsightType, SafetyType, UpgradeType},
        json::{jsboolarr, jsnum},
part::{ElectricsMessage, Equipment, Part},
        serialization::{JSSerializable, Serializable},
        stats::{rtz, Stats, Warning, WarningLevel},
    };
    pub struct Cockpit {
        types: Rc<Vec<CockpitType>>,
        upgrades: Rc<Vec<UpgradeType>>,
        safety: Rc<Vec<SafetyType>>,
        gunsights: Rc<Vec<GunsightType>>,
        #[ui(select, source = "types", enabled_fn, enabled_opt_fn = "is_type_enabled")]
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
        #[ui(number, name = "bombsight", enabled_fn, set_fn = "set_bombsight_quality")]
        bombsight: i16,
        has_rotary: bool,
        is_armed: bool,
    }
    #[automatically_derived]
    impl ::core::clone::Clone for Cockpit {
        #[inline]
        fn clone(&self) -> Cockpit {
            Cockpit {
                types: ::core::clone::Clone::clone(&self.types),
                upgrades: ::core::clone::Clone::clone(&self.upgrades),
                safety: ::core::clone::Clone::clone(&self.safety),
                gunsights: ::core::clone::Clone::clone(&self.gunsights),
                selected_type: ::core::clone::Clone::clone(&self.selected_type),
                selected_upgrades: ::core::clone::Clone::clone(&self.selected_upgrades),
                selected_safety: ::core::clone::Clone::clone(&self.selected_safety),
                selected_gunsights: ::core::clone::Clone::clone(
                    &self.selected_gunsights,
                ),
                this_stats: ::core::clone::Clone::clone(&self.this_stats),
                total_stress: ::core::clone::Clone::clone(&self.total_stress),
                total_escape: ::core::clone::Clone::clone(&self.total_escape),
                total_visibility: ::core::clone::Clone::clone(&self.total_visibility),
                seat_index: ::core::clone::Clone::clone(&self.seat_index),
                bombsight: ::core::clone::Clone::clone(&self.bombsight),
                has_rotary: ::core::clone::Clone::clone(&self.has_rotary),
                is_armed: ::core::clone::Clone::clone(&self.is_armed),
            }
        }
    }
    pub struct CockpitOptions {
        pub selected_type: Select,
        pub bombsight: Number,
        pub selected_upgrades: Vec<Check>,
        pub selected_safety: Vec<Check>,
        pub selected_gunsights: Vec<Check>,
    }
    impl UIBindings for Cockpit {
        type OptionsType = CockpitOptions;
        fn create_ui_options(&self) -> CockpitOptions {
            CockpitOptions {
                selected_type: Select {
                    enabled: self.is_selected_type_enabled(),
                    options: zip(self.types.iter(), self.is_type_enabled().iter())
                        .map(|(item, enab)| {
                            SelectOpt {
                                name: item.name.clone(),
                                enabled: *enab,
                            }
                        })
                        .collect(),
                    selected: self.selected_type,
                },
                bombsight: Number {
                    name: crate::localization::localization_lookup("bombsight"),
                    enabled: self.is_bombsight_enabled(),
                    value: self.bombsight,
                },
                selected_upgrades: zip(
                        zip(self.upgrades.iter(), self.selected_upgrades.iter()),
                        self.is_upgrade_enabled().iter(),
                    )
                    .map(|((item, selected), enabled)| Check {
                        name: item.name.clone(),
                        enabled: *enabled,
                        selected: *selected,
                    })
                    .collect(),
                selected_safety: zip(
                        zip(self.safety.iter(), self.selected_safety.iter()),
                        self.is_safety_enabled().iter(),
                    )
                    .map(|((item, selected), enabled)| Check {
                        name: item.name.clone(),
                        enabled: *enabled,
                        selected: *selected,
                    })
                    .collect(),
                selected_gunsights: zip(
                        zip(self.gunsights.iter(), self.selected_gunsights.iter()),
                        self.is_selected_gunsights_enabled().iter(),
                    )
                    .map(|((item, selected), enabled)| Check {
                        name: item.name.clone(),
                        enabled: *enabled,
                        selected: *selected,
                    })
                    .collect(),
            }
        }
        fn receive_ui_selections(&mut self, options: CockpitOptions) {
            use std::iter::zip;
            self.selected_type = options.selected_type.selected;
            if self.bombsight != options.bombsight.value {
                self.set_bombsight_quality(options.bombsight.value);
            }
            for (old_val, new_val) in zip(
                self.selected_upgrades.iter_mut(),
                options.selected_upgrades.iter().map(|c| c.selected),
            ) {
                *old_val = new_val;
            }
            for (old_val, new_val) in zip(
                self.selected_safety.iter_mut(),
                options.selected_safety.iter().map(|c| c.selected),
            ) {
                *old_val = new_val;
            }
            for (old_val, new_val) in zip(
                self.selected_gunsights.iter_mut(),
                options.selected_gunsights.iter().map(|c| c.selected),
            ) {
                *old_val = new_val;
            }
        }
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
                selected_upgrades: ::alloc::vec::from_elem(false, upgrades.len()),
                selected_safety: ::alloc::vec::from_elem(false, safety.len()),
                selected_gunsights: ::alloc::vec::from_elem(false, gunsights.len()),
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
        fn is_selected_type_enabled(&self) -> bool {
            true
        }
        fn is_type_enabled(&self) -> Vec<bool> {
            ::alloc::vec::from_elem(true, self.types.len())
        }
        fn is_upgrade_enabled(&self) -> Vec<bool> {
            let mut can = ::alloc::vec::from_elem(true, self.upgrades.len());
            if self.is_primary() {
                can[0] = false;
            }
            can
        }
        fn is_safety_enabled(&self) -> Vec<bool> {
            let mut lst = ::alloc::vec::from_elem(true, self.safety.len());
            if self.safety.len() > 5 {
                lst[5] = !self.types[self.selected_type].exposed;
            }
            lst
        }
        fn is_selected_gunsights_enabled(&self) -> Vec<bool> {
            ::alloc::vec::from_elem(true, self.gunsights.len())
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
            if num == self.bombsight - 1 {
                num = self.bombsight - 3;
            }
            if num == self.bombsight + 1 {
                num = self.bombsight + 3;
            }
            if num < 2 {
                num = 0;
            }
            if num > 0 {
                num = num - (num % 3) + 1;
            }
            self.bombsight = num;
        }
    }
    impl Part for Cockpit {
        fn part_stats(&mut self) -> Stats {
            let mut s = Stats::new();
            s.reqsections += 1.0;
            s = s.add(&self.types[self.selected_type].stats);
            let _ = zip(self.upgrades.iter(), &self.selected_upgrades)
                .map(|(val, sel)| {
                    if *sel {
                        s = s.add(&val.stats);
                    }
                });
            let _ = zip(self.safety.iter(), &self.selected_safety)
                .map(|(val, sel)| {
                    if *sel {
                        s = s.add(&val.stats);
                    }
                });
            let _ = zip(self.gunsights.iter(), &self.selected_gunsights)
                .map(|(val, sel)| {
                    if *sel {
                        s = s.add(&val.stats);
                    }
                });
            if self.bombsight > 0 {
                s.cost += rtz(1.0e-6 + 2.0 + (self.bombsight - 4) as f64 / 3.0);
                s.warnings
                    .push(Warning {
                        name: crate::localization::localization_lookup("Bombsight"),
                        warning: {
                            || -> ::std::result::Result<String, ::formatx::Error> {
                                let mut template = ::formatx::Template::new(
                                    crate::localization::localization_lookup(
                                        "Bombsight Warning",
                                    ),
                                )?;
                                template.replace_positional(self.bombsight);
                                template.text()
                            }()
                                .unwrap()
                        },
                        level: WarningLevel::White,
                    });
                if self.is_copilot() {
                    s.warnings
                        .push(Warning {
                            name: crate::localization::localization_lookup(
                                "Bombadier Controls",
                            ),
                            warning: crate::localization::localization_lookup(
                                "Bombadier Controls Warning",
                            ),
                            level: WarningLevel::White,
                        })
                }
            }
            self.this_stats = s.clone();
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
            let _ = zip(self.upgrades.iter(), &self.selected_upgrades)
                .map(|(val, sel)| {
                    if *sel {
                        equip.extend(format_equipment(&val.name, val.stats.charge));
                    }
                });
            let _ = zip(self.safety.iter(), &self.selected_safety)
                .map(|(val, sel)| {
                    if *sel {
                        equip.extend(format_equipment(&val.name, val.stats.charge));
                    }
                });
            let _ = zip(self.gunsights.iter(), &self.selected_gunsights)
                .map(|(val, sel)| {
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
            equip
                .push(Equipment {
                    source: crate::localization::localization_lookup(name),
                    charge: charge.to_string(),
                });
        } else if charge > 0.0 && charge < 1.0e-6 {
            equip
                .push(Equipment {
                    source: crate::localization::localization_lookup(name),
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
                    self
                        .selected_upgrades
                        .iter()
                        .map(|b| serde_json::Value::Bool(*b))
                        .collect(),
                ),
            );
            map.insert(
                "safety".to_string(),
                serde_json::Value::Array(
                    self
                        .selected_safety
                        .iter()
                        .map(|b| serde_json::Value::Bool(*b))
                        .collect(),
                ),
            );
            map.insert(
                "sights".to_string(),
                serde_json::Value::Array(
                    self
                        .selected_gunsights
                        .iter()
                        .map(|b| serde_json::Value::Bool(*b))
                        .collect(),
                ),
            );
            map.insert("bombsight".to_string(), self.bombsight.into());
            serde_json::Value::Object(map)
        }
    }
}
