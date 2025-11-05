use super::*;

impl Weapons {
    /// Set number of weapon sets
    /// TypeScript: SetWeaponSetCount(num: number)
    pub fn set_weapon_set_count(&mut self, mut num: usize) {
        if num < 1 {
            num = 0;
        }

        while num > self.weapon_sets.len() {
            let ws = WeaponSystem::new(self.weapon_list.clone(), self.wl_permute.clone());
            self.weapon_sets.push(ws);
        }
        while num < self.weapon_sets.len() {
            self.weapon_sets.pop();
        }
    }

    /// Duplicate a weapon set at index
    /// TypeScript: DuplicateSet(idx: number)
    pub fn duplicate_set(&mut self, idx: usize) {
        if idx < self.weapon_sets.len() {
            let ws = self.weapon_sets[idx].clone();
            self.weapon_sets.insert(idx, ws);
        }
    }

    /// Remove a weapon set at index
    /// TypeScript: RemoveSet(idx: number)
    pub fn remove_set(&mut self, idx: usize) {
        if idx < self.weapon_sets.len() {
            self.weapon_sets.remove(idx);
        }
    }

    /// Set brace count (must be multiple of 3)
    /// TypeScript: SetBraceCount(num: number)
    pub fn set_brace_count(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        // Round down to nearest multiple of 3
        num -= num % 3;
        self.brace_count = num;
    }

    /// Set tractor information
    /// TypeScript: SetTractorInfo(info: {have, spin_count, arty_spin_count})
    pub fn set_tractor_info(&mut self, have: bool, spin_count: i16, arty_spin_count: i16) {
        self.has_tractor = have;
        self.tractor_spinner_count = spin_count;
        self.tractor_arty_spinner_count = arty_spin_count;
    }

    /// Set pusher information
    /// TypeScript: SetPusherInfo(info: {have, spin_count, arty_spin_count})
    pub fn set_pusher_info(&mut self, have: bool, spin_count: i16, arty_spin_count: i16) {
        self.has_pusher = have;
        self.pusher_spinner_count = spin_count;
        self.pusher_arty_spinner_count = arty_spin_count;
    }

    /// Set whether aircraft has propeller
    /// TypeScript: SetHavePropeller(have: boolean)
    pub fn set_have_propeller(&mut self, have: bool) {
        for ws in &mut self.weapon_sets {
            ws.set_have_propeller(have);
        }
    }

    /// Set whether weapons can be wing-mounted
    /// TypeScript: SetCanWing(can: boolean)
    pub fn set_can_wing(&mut self, can: bool) {
        for ws in &mut self.weapon_sets {
            ws.set_can_wing(can);
        }
    }

    /// Set sticky guns penalty
    /// TypeScript: SetStickyGuns(num: number)
    pub fn set_sticky_guns(&mut self, num: i16) {
        for ws in &mut self.weapon_sets {
            ws.set_sticky_guns(num);
        }
    }

    /// Set number of cockpits
    /// TypeScript: SetNumberOfCockpits(num: number)
    pub fn set_number_of_cockpits(&mut self, num: i16) {
        self.cockpit_count = num;
    }

    /// Set helicopter mode
    /// TypeScript: SetHeli(value: boolean)
    pub fn set_heli(&mut self, value: bool) {
        self.isheli = value;
    }
}
