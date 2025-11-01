use super::*;
use crate::weapon::SynchronizationType;

impl Weapons {
    /// Clean up freely accessible weapons (only one per seat)
    /// TypeScript: CleanFreelyAccessible()
    pub(super) fn clean_freely_accessible(&mut self) {
        let mut has_fa = vec![false; self.cockpit_count as usize];

        // First pass: identify which seats already have freely accessible weapons
        for ws in &mut self.weapon_sets {
            let seat = ws.get_seat() as usize;
            if seat < self.cockpit_count as usize {
                for w in ws.get_weapons_mut() {
                    if w.get_free_accessible() && has_fa[seat] {
                        w.set_free_accessible(false);
                    } else if w.get_free_accessible() {
                        has_fa[seat] = true;
                    }
                }
            }
        }

        // Second pass: update can_free_accessible flags
        for ws in &mut self.weapon_sets {
            let seat = ws.get_seat() as usize;
            if seat < self.cockpit_count as usize {
                for w in ws.get_weapons_mut() {
                    if (has_fa[seat] && !w.get_free_accessible()) || w.get_wing() {
                        w.can_free_accessible = false;
                    } else {
                        w.can_free_accessible = true;
                    }
                }
            }
        }
    }

    /// Remove one tractor spinner (from the end)
    /// TypeScript: RemoveOneTractorSpinner()
    pub(super) fn remove_one_tractor_spinner(&mut self) {
        for i in (0..self.weapon_sets.len()).rev() {
            if self.weapon_sets[i].get_direction()[0] {
                let wlist = self.weapon_sets[i].get_weapons_mut();
                for j in (0..wlist.len()).rev() {
                    if wlist[j].get_synchronization() == SynchronizationType::Spinner {
                        wlist[j].set_synchronization(SynchronizationType::Interrupt);
                        return;
                    }
                }
            }
        }
    }

    /// Remove one arty tractor spinner (from the end)
    /// TypeScript: RemoveOneArtyTractorSpinner()
    pub(super) fn remove_one_arty_tractor_spinner(&mut self) {
        for i in (0..self.weapon_sets.len()).rev() {
            if self.weapon_sets[i].get_direction()[0] {
                let wlist = self.weapon_sets[i].get_weapons_mut();
                for j in (0..wlist.len()).rev() {
                    if wlist[j].get_synchronization() == SynchronizationType::Spinner
                        && wlist[j].get_arty()
                    {
                        wlist[j].set_synchronization(SynchronizationType::NoInterference);
                        return;
                    }
                }
            }
        }
    }

    /// Remove one pusher spinner (from the end)
    /// TypeScript: RemoveOnePusherSpinner()
    pub(super) fn remove_one_pusher_spinner(&mut self) {
        for i in (0..self.weapon_sets.len()).rev() {
            if self.weapon_sets[i].get_direction()[1] {
                let wlist = self.weapon_sets[i].get_weapons_mut();
                for j in (0..wlist.len()).rev() {
                    if wlist[j].get_synchronization() == SynchronizationType::Spinner {
                        wlist[j].set_synchronization(SynchronizationType::Interrupt);
                        return;
                    }
                }
            }
        }
    }

    /// Remove one arty pusher spinner (from the end)
    /// TypeScript: RemoveOneArtyPusherSpinner()
    pub(super) fn remove_one_arty_pusher_spinner(&mut self) {
        for i in (0..self.weapon_sets.len()).rev() {
            if self.weapon_sets[i].get_direction()[1] {
                let wlist = self.weapon_sets[i].get_weapons_mut();
                for j in (0..wlist.len()).rev() {
                    if wlist[j].get_synchronization() == SynchronizationType::Spinner
                        && wlist[j].get_arty()
                    {
                        wlist[j].set_synchronization(SynchronizationType::NoInterference);
                        return;
                    }
                }
            }
        }
    }
}
