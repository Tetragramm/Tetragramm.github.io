use super::*;

impl Weapon {
    /// Get fixed status
    /// TypeScript: GetFixed()
    pub fn get_fixed(&self) -> bool {
        self.fixed
    }

    /// Get wing mounting status
    /// TypeScript: GetWing()
    pub fn get_wing(&self) -> bool {
        self.wing
    }

    /// Check if weapon can be wing-mounted
    /// TypeScript: CanWing()
    pub fn can_wing(&self) -> bool {
        self.weapon_type.size <= 16 && self.canwing
    }

    /// Check if weapon can be covered
    /// TypeScript: CanCovered()
    pub fn can_covered(&self) -> bool {
        if self.wing {
            self.has_cantilever && !(self.weapon_type.size == 16 && !self.fixed)
        } else {
            !(self.get_arty() && !self.fixed)
        }
    }

    /// Get covered status
    /// TypeScript: GetCovered()
    pub fn get_covered(&self) -> bool {
        self.covered
    }

    /// Get accessible status (includes free_accessible)
    /// TypeScript: GetAccessible()
    pub fn get_accessible(&self) -> bool {
        self.accessible || self.free_accessible
    }

    /// Get free accessible status
    /// TypeScript: GetFreeAccessible()
    pub fn get_free_accessible(&self) -> bool {
        self.free_accessible
    }

    /// Get available synchronization options
    /// TypeScript: CanSynchronization()
    pub fn can_synchronization(&self) -> Vec<bool> {
        let mut lst = Vec::new();
        // Include SynchronizationType::None (-1) through max
        lst.push(self.can_synch(SynchronizationType::None));
        lst.push(self.can_synch(SynchronizationType::Interrupt));
        lst.push(self.can_synch(SynchronizationType::Synch));
        lst.push(self.can_synch(SynchronizationType::Spinner));
        lst.push(self.can_synch(SynchronizationType::Deflect));
        lst.push(self.can_synch(SynchronizationType::NoInterference));
        lst
    }

    /// Check if specific synchronization type is allowed
    /// TypeScript: CanSynch(num: number)
    pub(super) fn can_synch(&self, sync_type: SynchronizationType) -> bool {
        // Turret/flexible mount logic
        if !self.fixed && !self.wing {
            if !self.can_synchronize {
                return sync_type == SynchronizationType::None;
            }

            if sync_type == SynchronizationType::None
                || sync_type == SynchronizationType::Deflect
                || sync_type == SynchronizationType::NoInterference
            {
                if (sync_type == SynchronizationType::None
                    || sync_type == SynchronizationType::Deflect)
                    && self.get_arty()
                {
                    return false;
                }
                return true;
            } else {
                return false;
            }
        }

        // Fixed/wing mount logic
        if self.can_synchronize && sync_type == SynchronizationType::None {
            return false;
        } else if !self.can_synchronize && sync_type != SynchronizationType::None {
            return false;
        }

        // Flamethrower special case
        if self.weapon_type.name == "Fliergerflammenwerfer"
            && !(sync_type == SynchronizationType::None
                || sync_type == SynchronizationType::Spinner
                || sync_type == SynchronizationType::NoInterference)
        {
            return false;
        }

        // Mechanical action constraints
        if self.action == ActionType::Mechanical
            && !(sync_type == SynchronizationType::None
                || sync_type == SynchronizationType::Synch
                || (sync_type == SynchronizationType::Spinner && self.can_spinner()))
        {
            return false;
        }

        // Gast action can't use spinner
        if self.action == ActionType::Gast && sync_type == SynchronizationType::Spinner {
            return false;
        }

        // Weapon-specific sync constraints
        if (sync_type == SynchronizationType::Interrupt || sync_type == SynchronizationType::Synch)
            && !self.weapon_type.synched
        {
            return false;
        } else if sync_type == SynchronizationType::Spinner && !self.can_spinner() {
            return false;
        } else if sync_type == SynchronizationType::Deflect && self.get_arty() {
            return false;
        }

        true
    }

    /// Get current synchronization type
    /// TypeScript: GetSynchronization()
    pub fn get_synchronization(&self) -> SynchronizationType {
        self.synchronization
    }

    /// Get weapon count
    /// TypeScript: GetCount()
    pub fn get_count(&self) -> i16 {
        self.w_count
    }

    /// Check if repeating is allowed
    /// TypeScript: CanRepeating()
    pub fn can_repeating(&self) -> bool {
        !self.weapon_type.rapid || self.weapon_type.reload > 0
    }

    /// Get repeating status
    /// TypeScript: GetRepeating()
    pub fn get_repeating(&self) -> bool {
        self.repeating
    }

    /// Check if weapon is artillery size (size 16)
    /// TypeScript: GetArty()
    pub fn get_arty(&self) -> bool {
        self.weapon_type.size == 16
    }

    /// Check if spinner synchronization is allowed
    /// TypeScript: CanSpinner()
    pub fn can_spinner(&self) -> bool {
        if self.get_arty() {
            self.can_spinner && self.can_arty_spinner
        } else {
            self.can_spinner
        }
    }

    /// Get jam number (modified by synchronization and repeating)
    /// TypeScript: GetJam()
    pub fn get_jam(&self) -> (i16, i16) {
        if self.weapon_type.rapid {
            // Parse "X/Y" format
            let parts: Vec<&str> = self.weapon_type.jam.split('/').collect();
            let mut out = [
                parts.get(0).and_then(|s| s.parse().ok()).unwrap_or(0),
                parts.get(1).and_then(|s| s.parse().ok()).unwrap_or(0),
            ];

            if self.synchronization == SynchronizationType::Interrupt {
                out[0] += 1;
                out[1] += 1;
            }
            if self.repeating {
                out[0] += 1;
                out[1] += 1;
            }

            (out[0], out[1])
        } else {
            // Single number
            let mut ret = self.weapon_type.jam.parse().unwrap_or(0);

            if self.synchronization == SynchronizationType::Interrupt {
                ret += 1;
            }
            if self.repeating {
                ret += 1;
            }

            (ret, 0)
        }
    }

    /// Check if weapon is Lightning Arc
    pub(super) fn is_lightning_arc(&self) -> bool {
        self.weapon_type.name == "Lightning Arc"
    }

    // UIBindings enabled functions (always enabled)

    /// Check if fixed can be changed (always true)
    pub fn is_fixed_enabled(&self) -> bool {
        true
    }

    /// Check if accessible can be changed (always true)
    pub fn is_accessible_enabled(&self) -> bool {
        true
    }

    /// Check if free_accessible can be changed (always true)
    pub fn is_free_accessible_enabled(&self) -> bool {
        true
    }

    /// Check if w_count can be changed (always true)
    pub fn is_w_count_enabled(&self) -> bool {
        true
    }
}
