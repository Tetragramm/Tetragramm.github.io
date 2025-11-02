use std::collections::HashMap;
use std::rc::Rc;

use crate::cockpit::Cockpit;
use crate::part::{merge_electrics, ElectricsMessage, Part};
use crate::stats::{Stats, Warning};

mod json;
mod serialization;
mod ui;

#[cfg(test)]
mod tests;

pub use ui::CockpitsOptions;

pub struct CockpitEntry {
    pub name: String,
    pub exposed: bool,
    pub stats: Stats,
}

pub struct CockpitUpgradeEntry {
    pub name: String,
    pub stats: Stats,
}

pub struct SafetyEntry {
    pub name: String,
    pub stats: Stats,
}

pub struct GunsightEntry {
    pub name: String,
    pub attack: i16,
    pub stats: Stats,
}

pub struct Cockpits {
    pub positions: Vec<Cockpit>,
    types: Rc<Vec<CockpitEntry>>,
    upgrades: Rc<Vec<CockpitUpgradeEntry>>,
    safety: Rc<Vec<SafetyEntry>>,
    gunsight: Rc<Vec<GunsightEntry>>,
}

impl Cockpits {
    pub fn new(
        types: Vec<CockpitEntry>,
        upgrades: Vec<CockpitUpgradeEntry>,
        safety: Vec<SafetyEntry>,
        gunsights: Vec<GunsightEntry>,
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
        use crate::serialization::JSSerializable;

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

    pub fn set_has_rotary(&mut self, has: bool) {
        for mut c in self.positions.iter_mut() {
            c.set_has_rotary(has);
        }
    }

    /// Set armed status for cockpit crew members
    /// TypeScript: SetArmed(armed: boolean[])
    /// Takes a boolean array and applies armed status to corresponding cockpit positions
    pub fn set_armed(&mut self, armed: &[bool]) {
        for (i, c) in self.positions.iter_mut().enumerate() {
            if i < armed.len() {
                c.set_armed(armed[i]);
            }
        }
    }

    /// Update crew stress calculations based on aircraft conditions
    /// TypeScript: UpdateCrewStats(escape, controlstress, rumblestress, visibility, crash)
    /// First counts copilots, then updates stress for all crew members
    pub fn update_crew_stats(
        &mut self,
        escape: i16,
        controlstress: i16,
        rumblestress: i16,
        visibility: i16,
        crash: i16,
    ) {
        // Count copilots across all positions
        let copilots = self.positions.iter().filter(|cp| cp.is_copilot()).count() as i16;

        // Update each cockpit with crew stress calculations
        for c in self.positions.iter_mut() {
            c.crew_update(
                escape,
                controlstress,
                rumblestress,
                copilots,
                visibility,
                crash,
            );
        }
    }

    /// Get flight stress values from all cockpit positions
    /// TypeScript: GetStressList()
    /// Returns a vector of (non_copilot_stress, copilot_stress) tuples from all cockpits
    pub fn get_stress_list(&self) -> Vec<(i16, i16)> {
        self.positions
            .iter()
            .map(|p| p.get_flight_stress())
            .collect()
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
            s = s.add(&cs);
        }

        for (w, seats) in warning_map {
            s.warnings.push(Warning {
                name: format!(
                    "Seats #{} {}",
                    seats
                        .iter()
                        .map(|x| x.to_string())
                        .collect::<Vec<_>>()
                        .join(", "),
                    &w.name
                )
                .to_string(),
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
