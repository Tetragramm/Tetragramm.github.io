use std::{iter::zip, rc::Rc};

use ui_core::*;
use ui_macro::*;

use crate::{
    cockpits::{CockpitEntry, CockpitUpgradeEntry, GunsightEntry, SafetyEntry},
    part::{ElectricsMessage, Equipment, Part},
    stats::{rtz, Stats, Warning, WarningLevel},
};

mod json;
mod serialization;

#[cfg(test)]
mod tests;

#[derive(Clone, UIBindings)]
pub struct Cockpit {
    types: Rc<Vec<CockpitEntry>>,
    upgrades: Rc<Vec<CockpitUpgradeEntry>>,
    safety: Rc<Vec<SafetyEntry>>,
    gunsights: Rc<Vec<GunsightEntry>>,

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
    total_crash: i16,
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
        types: &Rc<Vec<CockpitEntry>>,
        upgrades: &Rc<Vec<CockpitUpgradeEntry>>,
        safety: &Rc<Vec<SafetyEntry>>,
        gunsights: &Rc<Vec<GunsightEntry>>,
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
            total_crash: 0,
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

    pub fn is_copilot(&self) -> bool {
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

    pub fn set_has_rotary(&mut self, has: bool) {
        self.has_rotary = has;
    }

    /// Set whether this crew member is armed
    /// TypeScript: SetArmed(is: boolean)
    pub fn set_armed(&mut self, is_armed: bool) {
        self.is_armed = is_armed;
    }

    /// Update crew stress calculations based on aircraft conditions
    /// TypeScript: CrewUpdate(escape, controlstress, rumblestress, copilots, visibility, crash)
    /// Calculates two stress values: for non-copilot pilots and for copilot pilots
    pub fn crew_update(
        &mut self,
        escape: i16,
        controlstress: i16,
        rumblestress: i16,
        copilots: i16,
        visibility: i16,
        crash: i16,
    ) {
        self.total_escape = self.this_stats.escape as i16 + escape;

        // Calculate stress for non-copilot configuration
        let mut ncp_stress = self.this_stats.flightstress as i16;
        // Calculate stress for copilot configuration
        let mut cp_stress = self.this_stats.flightstress as i16;

        // Primary pilots or copilots get control stress penalty
        if self.is_primary() || self.is_copilot() {
            ncp_stress += controlstress;
            cp_stress += controlstress - copilots * 2;
        }

        // Clamp to minimum of 0
        ncp_stress = ncp_stress.max(0);
        cp_stress = cp_stress.max(0);

        // Add rumble stress
        ncp_stress += rumblestress;
        cp_stress += rumblestress;

        // Open cockpit with rotary engine adds stress
        if self.types[self.selected_type].exposed && self.has_rotary {
            ncp_stress += 1;
            cp_stress += 1;
        }

        // Clamp to minimum of 0 again
        ncp_stress = ncp_stress.max(0);
        cp_stress = cp_stress.max(0);

        self.total_stress = (ncp_stress, cp_stress);
        self.total_visibility = self.this_stats.visibility as i16 + visibility;
        self.total_crash = self.this_stats.crashsafety as i16 + crash;
    }

    /// Get the flight stress values for this cockpit
    /// TypeScript: GetFlightStress()
    /// Returns a tuple of (non_copilot_stress, copilot_stress)
    pub fn get_flight_stress(&self) -> (i16, i16) {
        self.total_stress
    }

    /// Get the visibility value for this cockpit
    /// TypeScript: GetVisibility()
    pub fn get_visibility(&self) -> i16 {
        // If visibility is less than -10, return -infinity (but we'll use i16::MIN)
        if self.types[self.selected_type].stats.visibility < -10.0 {
            return i16::MIN;
        }
        self.total_visibility
    }

    /// Get the escape value for this cockpit
    /// TypeScript: GetEscape()
    pub fn get_escape(&self) -> i16 {
        self.total_escape
    }

    /// Get the crash safety value for this cockpit
    /// TypeScript: GetCrash()
    pub fn get_crash(&self) -> i16 {
        self.total_crash
    }

    pub fn get_name(&self) -> String {
        if self.is_primary() {
            return "Crew Pilot".to_string();
        }
        if self.bombsight > 0 {
            return "Crew Bombadier".to_string();
        }
        if self.is_copilot() {
            return "Crew Co-Pilot".to_string();
        }
        if self.is_armed {
            return "Crew Gunner".to_string();
        }
        return "Crew Aircrew".to_string();
    }

    //TODO: On set, check CanSafety
}

impl Part for Cockpit {
    fn part_stats(&mut self) -> Stats {
        let mut s = Stats::new();
        s.reqsections += 1.0;
        s = s.add(&self.types[self.selected_type].stats);

        for (val, sel) in zip(self.upgrades.iter(), &self.selected_upgrades) {
            if *sel {
                s = s.add(&val.stats);
            }
        }
        for (val, sel) in zip(self.safety.iter(), &self.selected_safety) {
            if *sel {
                s = s.add(&val.stats);
            }
        }
        for (val, sel) in zip(self.gunsights.iter(), &self.selected_gunsights) {
            if *sel {
                s = s.add(&val.stats);
            }
        }

        if self.bombsight > 0 {
            s.cost += rtz(1.0e-6 + 2.0 + (self.bombsight - 4) as f64 / 3.0);
            s.warnings.push(Warning {
                name: t!("Bombsight").to_string(),
                warning: t!("Bombsight Warning", A = self.bombsight).to_string(),
                level: WarningLevel::White,
            });

            if self.is_copilot() {
                s.warnings.push(Warning {
                    name: t!("Bombadier Controls").to_string(),
                    warning: t!("Bombadier Controls Warning").to_string(),
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
        for (val, sel) in zip(self.upgrades.iter(), &self.selected_upgrades) {
            if *sel {
                equip.extend(format_equipment(&val.name, val.stats.charge));
            }
        }
        for (val, sel) in zip(self.safety.iter(), &self.selected_safety) {
            if *sel {
                equip.extend(format_equipment(&val.name, val.stats.charge));
            }
        }
        for (val, sel) in zip(self.gunsights.iter(), &self.selected_gunsights) {
            if *sel {
                equip.extend(format_equipment(&val.name, val.stats.charge));
            }
        }

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
            source: t!(name.as_str()).to_string(),
            charge: charge.to_string(),
        });
    } else if charge > 0.0 && charge < 1.0e-6 {
        equip.push(Equipment {
            source: t!(name.as_str()).to_string(),
            charge: "-".to_string(),
        });
    }
    equip
}
