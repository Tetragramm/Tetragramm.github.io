use std::collections::HashMap;
use std::rc::Rc;

use ui_core::{UIBindings, Number};

use crate::cockpit::{Cockpit, CockpitOptions};
use crate::part::{merge_electrics, ElectricsMessage, Part};
use crate::serialization::{JSSerializable, Serializable};
use crate::stats::{Stats, Warning};
use crate::lu;

pub struct CockpitType {
    pub name: String,
    pub exposed: bool,
    pub stats: Stats,
}

pub struct UpgradeType {
    pub name: String,
    pub stats: Stats,
}

pub struct SafetyType {
    pub name: String,
    pub stats: Stats,
}

pub struct GunsightType {
    pub name: String,
    pub attack: i16,
    pub stats: Stats,
}

pub struct Cockpits {
    pub positions: Vec<Cockpit>,
    types: Rc<Vec<CockpitType>>,
    upgrades: Rc<Vec<UpgradeType>>,
    safety: Rc<Vec<SafetyType>>,
    gunsight: Rc<Vec<GunsightType>>,
}

impl Cockpits {
    pub fn new(
        types: Vec<CockpitType>,
        upgrades: Vec<UpgradeType>,
        safety: Vec<SafetyType>,
        gunsights: Vec<GunsightType>,
    ) -> Cockpits {
        Cockpits {
            positions: Vec::new(),
            types: Rc::new(types),
            upgrades: Rc::new(upgrades),
            safety: Rc::new(safety),
            gunsight: Rc::new(gunsights),
        }
    }

    /// Set the number of cockpits, resizing the positions vector
    /// Implements the same logic as TypeScript's SetNumberOfCockpits:
    /// - Validates input (minimum 1)
    /// - Removes excess cockpits if reducing
    /// - Adds new cockpits if increasing, copying configuration from last cockpit
    pub fn set_number_of_cockpits(&mut self, mut num: i16) {
        // Validate input: minimum 1
        if num < 1 {
            num = 1;
        }

        let num = num as usize;

        // Remove excess cockpits
        while self.positions.len() > num {
            self.positions.pop();
        }

        // Save the last cockpit's configuration to copy to new cockpits
        let last_config = if !self.positions.is_empty() {
            Some(self.positions.last().unwrap().to_json())
        } else {
            None
        };

        // Add new cockpits
        while self.positions.len() < num {
            let mut cp = Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight);
            cp.set_seat_index(self.positions.len());

            // If we have a saved configuration, copy it to the new cockpit
            if let Some(ref config) = last_config {
                cp.from_json(config, 1000.0); // Use high version number to enable all features
            }

            self.positions.push(cp);
        }
    }

    pub fn get_number_of_cockpits(&self) -> i16 {
        self.positions.len() as i16
    }
}

impl Part for Cockpits {
    fn part_stats(&mut self) -> Stats {
        let mut s = Stats::new();
        let mut warning_map: HashMap<Warning, Vec<usize>> = HashMap::new();
        for (idx, c) in self.positions.iter_mut().enumerate() {
            let mut cs: Stats = c.part_stats();
            for w in &cs.warnings {
                if let Some(v) = warning_map.get_mut(&w) {
                    v.push(idx + 1);
                } else {
                    warning_map.insert(w.clone(), vec![idx + 1]);
                }
            }
            cs.warnings.clear();
            s.add(&c.part_stats());
        }

        for (w, seats) in warning_map {
            s.warnings.push(Warning {
                name: lu!(
                    "Seats #{} {}",
                    seats
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<_>>()
                        .join(", "),
                    &w.name
                ),
                warning: w.warning.clone(),
                level: w.level,
            })
        }

        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0.0;
        //This needs special work for co-pilot controls
        //s.flightstress = 0;
        s.visibility = 0.0;
        s.crashsafety = 0.0;
        s
    }

    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        self.positions
            .iter()
            .map(|c| c.get_electrics())
            .fold(ElectricsMessage::new(), merge_electrics)
    }
}

impl Serializable for Cockpits {
    fn deserialize(
        &mut self,
        d: &mut crate::serialization::Deserializer,
    ) -> Result<(), crate::serialization::Error> {
        let num = d.get_num()? as usize;

        self.positions.clear();
        self.positions.resize_with(num, || {
            Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight)
        });

        for (idx, cp) in self.positions.iter_mut().enumerate() {
            cp.set_seat_index(idx);
            cp.deserialize(d);
        }
        Ok(())
    }

    fn serialize(
        &self,
        s: &mut crate::serialization::Serializer,
    ) -> Result<(), crate::serialization::Error> {
        s.push_num(self.positions.len() as i16)?;
        for c in &self.positions {
            c.serialize(s)?;
        }
        Ok(())
    }
}

impl JSSerializable for Cockpits {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        let arr = js.as_array().unwrap();

        self.positions.clear();
        self.positions.resize_with(arr.len(), || {
            Cockpit::new(&self.types, &self.upgrades, &self.safety, &self.gunsight)
        });

        for (idx, c_js) in arr.iter().enumerate() {
            let cp = &mut self.positions[idx];
            cp.set_seat_index(idx);
            cp.from_json(c_js, json_version);
        }
    }

    fn to_json(&self) -> serde_json::Value {
        serde_json::Value::Array(
            self.positions
                .iter()
                .map(|c: &Cockpit| c.to_json())
                .collect(),
        )
    }
}

/// UI options for the Cockpits container - contains options for each cockpit position
pub struct CockpitsOptions {
    pub num_cockpits: Number,
    pub positions: Vec<CockpitOptions>,
}

impl UIBindings for Cockpits {
    type OptionsType = CockpitsOptions;

    fn create_ui_options(&self) -> CockpitsOptions {
        CockpitsOptions {
            num_cockpits: Number {
                name: lu!("Number of Cockpits"),
                enabled: true,
                value: self.get_number_of_cockpits(),
            },
            positions: self
                .positions
                .iter()
                .map(|cockpit| cockpit.create_ui_options())
                .collect(),
        }
    }

    fn receive_ui_selections(&mut self, options: CockpitsOptions) {
        // Handle changes to the number of cockpits first
        if self.get_number_of_cockpits() != options.num_cockpits.value {
            self.set_number_of_cockpits(options.num_cockpits.value);
        }

        // Then update individual cockpit options
        // Note: positions may have changed size, so we only update those that exist in both
        for (cockpit, cockpit_options) in self.positions.iter_mut().zip(options.positions.into_iter()) {
            cockpit.receive_ui_selections(cockpit_options);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_set_number_of_cockpits() {
        let mut cockpits = Cockpits::new(vec![], vec![], vec![], vec![]);

        // Test setting to 1
        cockpits.set_number_of_cockpits(1);
        assert_eq!(cockpits.get_number_of_cockpits(), 1, "Should have 1 cockpit");
        assert_eq!(cockpits.positions.len(), 1);

        // Test increasing to 3
        cockpits.set_number_of_cockpits(3);
        assert_eq!(cockpits.get_number_of_cockpits(), 3, "Should have 3 cockpits");
        assert_eq!(cockpits.positions.len(), 3);

        // Verify seat indices are set correctly
        for (i, cp) in cockpits.positions.iter().enumerate() {
            // We can't directly access seat_index, but we can verify via serialization
            // or other indirect means. For now, just verify the count.
        }

        // Test reducing to 2
        cockpits.set_number_of_cockpits(2);
        assert_eq!(cockpits.get_number_of_cockpits(), 2, "Should have 2 cockpits");
        assert_eq!(cockpits.positions.len(), 2);

        // Test invalid input (< 1) should become 1
        cockpits.set_number_of_cockpits(0);
        assert_eq!(cockpits.get_number_of_cockpits(), 1, "Should enforce minimum of 1");

        cockpits.set_number_of_cockpits(-5);
        assert_eq!(cockpits.get_number_of_cockpits(), 1, "Should enforce minimum of 1");
    }

    #[test]
    fn test_cockpits_copy_configuration() {
        let types = vec![
            CockpitType {
                name: "Type A".to_string(),
                exposed: false,
                stats: Stats::new(),
            },
            CockpitType {
                name: "Type B".to_string(),
                exposed: true,
                stats: Stats::new(),
            },
        ];

        let mut cockpits = Cockpits::new(types, vec![], vec![], vec![]);

        // Start with 1 cockpit and configure it
        cockpits.set_number_of_cockpits(1);
        // Note: We can't easily set the cockpit configuration without making fields public
        // This test verifies the structure works, even if we can't fully test config copying

        // Add a second cockpit - it should copy configuration from the first
        cockpits.set_number_of_cockpits(2);
        assert_eq!(cockpits.positions.len(), 2);

        // Both should exist
        assert!(!cockpits.positions.is_empty());
    }
}
