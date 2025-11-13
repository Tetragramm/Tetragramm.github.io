use super::*;
use crate::weapon::SynchronizationType;

impl Weapons {
    /// Get the weapon list
    /// TypeScript: GetWeaponList()
    pub fn get_weapon_list(&self) -> &Vec<WeaponType> {
        &self.weapon_list
    }

    /// Get direction names
    /// TypeScript: GetDirectionList()
    pub fn get_direction_list(&self) -> Vec<String> {
        vec![
            t!("Forward").to_string(),
            t!("Rearward").to_string(),
            t!("Up").to_string(),
            t!("Down").to_string(),
            t!("Left").to_string(),
            t!("Right").to_string(),
        ]
    }

    /// Get synchronization type names
    /// TypeScript: GetSynchronizationList()
    pub fn get_synchronization_list(&self) -> Vec<String> {
        vec![
            t!("None").to_string(),
            t!("Interruptor Gear").to_string(),
            t!("Synchronization Gear").to_string(),
            t!("Spinner Gun").to_string(),
            t!("Deflector Plate").to_string(),
            t!("No Interference").to_string(),
        ]
    }

    /// Get action type names
    /// TypeScript: GetActionList()
    pub fn get_action_list(&self) -> Vec<String> {
        vec![
            t!("Standard Action").to_string(),
            t!("Mechanical Action").to_string(),
            t!("Gast Principle").to_string(),
            t!("Rotary_Gun").to_string(),
        ]
    }

    /// Get projectile type names
    /// TypeScript: GetProjectileList()
    pub fn get_projectile_list(&self) -> Vec<String> {
        vec![
            t!("Standard").to_string(),
            t!("Heat Ray").to_string(),
            t!("Pneumatic").to_string(),
        ]
    }

    /// Get weapon systems
    /// TypeScript: GetWeaponSets()
    pub fn get_weapon_sets(&self) -> &Vec<WeaponSystem> {
        &self.weapon_sets
    }

    /// Get mutable weapon systems
    pub fn get_weapon_sets_mut(&mut self) -> &mut Vec<WeaponSystem> {
        &mut self.weapon_sets
    }

    /// Get brace count
    /// TypeScript: GetBraceCount()
    pub fn get_brace_count(&self) -> i16 {
        self.brace_count
    }

    /// Get seat list
    /// TypeScript: GetSeatList()
    pub fn get_seat_list(&self) -> Vec<String> {
        (0..self.cockpit_count)
            .map(|i| t!("Seat #", A = i + 1).to_string())
            .collect()
    }

    /// Get which seats have weapons
    /// TypeScript: GetArmedSeats()
    pub fn get_armed_seats(&self) -> Vec<bool> {
        let mut lst = vec![false; self.cockpit_count as usize];
        for ws in &self.weapon_sets {
            let seat = ws.get_seat() as usize;
            if seat < ws.cockpit_count as usize {
                lst[seat] = true;
            }
        }
        lst
    }

    /// Check if tractor spinner is available
    /// TypeScript: CanTractorSpinner()
    pub fn can_tractor_spinner(&self) -> bool {
        self.count_tractor_spinner() + self.count_arty_tractor_spinner()
            < self.tractor_spinner_count
    }

    /// Check if arty tractor spinner is available
    /// TypeScript: CanArtyTractorSpinner()
    pub fn can_arty_tractor_spinner(&self) -> bool {
        self.count_arty_tractor_spinner() < self.tractor_arty_spinner_count
    }

    /// Check if pusher spinner is available
    /// TypeScript: CanPusherSpinner()
    pub fn can_pusher_spinner(&self) -> bool {
        self.count_pusher_spinner() + self.count_arty_pusher_spinner() < self.pusher_spinner_count
    }

    /// Check if arty pusher spinner is available
    /// TypeScript: CanArtyPusherSpinner()
    pub fn can_arty_pusher_spinner(&self) -> bool {
        self.count_arty_pusher_spinner() < self.pusher_arty_spinner_count
    }

    /// Count tractor spinners
    /// TypeScript: CountTractorSpinner()
    pub(super) fn count_tractor_spinner(&self) -> i16 {
        let mut count = 0;
        for ws in &self.weapon_sets {
            if ws.get_direction()[0] {
                for w in ws.get_weapons() {
                    if w.get_synchronization() == SynchronizationType::Spinner {
                        count += 1;
                    }
                }
            }
        }
        count
    }

    /// Count arty tractor spinners
    /// TypeScript: CountArtyTractorSpinner()
    pub(super) fn count_arty_tractor_spinner(&self) -> i16 {
        let mut count = 0;
        for ws in &self.weapon_sets {
            if ws.get_direction()[0] {
                for w in ws.get_weapons() {
                    if w.get_arty() && w.get_synchronization() == SynchronizationType::Spinner {
                        count += 1;
                    }
                }
            }
        }
        count
    }

    /// Count pusher spinners
    /// TypeScript: CountPusherSpinner()
    pub(super) fn count_pusher_spinner(&self) -> i16 {
        let mut count = 0;
        for ws in &self.weapon_sets {
            if ws.get_direction()[1] {
                for w in ws.get_weapons() {
                    if w.get_synchronization() == SynchronizationType::Spinner {
                        count += 1;
                    }
                }
            }
        }
        count
    }

    /// Count arty pusher spinners
    /// TypeScript: CountArtyPusherSpinner()
    pub(super) fn count_arty_pusher_spinner(&self) -> i16 {
        let mut count = 0;
        for ws in &self.weapon_sets {
            if ws.get_direction()[1] {
                for w in ws.get_weapons() {
                    if w.get_arty() && w.get_synchronization() == SynchronizationType::Spinner {
                        count += 1;
                    }
                }
            }
        }
        count
    }

    /// Get total wing weight
    /// TypeScript: GetWingWeight()
    pub(super) fn get_wing_weight(&mut self) -> f32 {
        let mut sum = 0.0;
        for w in &mut self.weapon_sets {
            sum += w.get_wing_weight();
        }
        sum
    }
}
