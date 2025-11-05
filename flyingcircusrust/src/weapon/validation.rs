use super::*;

impl Weapon {
    /// Resolve and validate synchronization configuration
    /// TypeScript: ResolveSynch()
    ///
    /// Called during stats calculation to ensure synchronization
    /// is valid for current configuration
    pub(super) fn resolve_synch(&mut self) {
        let use_sync = self.synchronization;

        // Check if current sync is still valid
        if !self.can_synch(use_sync) {
            // Find first valid synchronization
            if self.can_synch(SynchronizationType::None) {
                self.synchronization = SynchronizationType::None;
            } else if self.can_synch(SynchronizationType::Interrupt) {
                self.synchronization = SynchronizationType::Interrupt;
            } else if self.can_synch(SynchronizationType::Synch) {
                self.synchronization = SynchronizationType::Synch;
            } else if self.can_synch(SynchronizationType::Spinner) {
                self.synchronization = SynchronizationType::Spinner;
            } else if self.can_synch(SynchronizationType::Deflect) {
                self.synchronization = SynchronizationType::Deflect;
            } else if self.can_synch(SynchronizationType::NoInterference) {
                self.synchronization = SynchronizationType::NoInterference;
            } else {
                // No valid synchronizations, force wing mount
                self.wing = true;
                self.synchronization = SynchronizationType::None;
            }
        } else if self.action == ActionType::Mechanical && use_sync != SynchronizationType::Spinner
        {
            self.synchronization = SynchronizationType::Synch;
        } else {
            self.synchronization = use_sync;
        }

        // Wing-mounted weapons don't use synchronization
        if self.wing {
            self.synchronization = SynchronizationType::None;
        }

        // Spinner forces certain settings
        if self.synchronization == SynchronizationType::Spinner {
            self.w_count = 1;
            self.covered = true;
        }

        // Lightning Arc always uses no interference
        if self.is_lightning_arc() {
            self.synchronization = SynchronizationType::NoInterference;
        }
    }
}
