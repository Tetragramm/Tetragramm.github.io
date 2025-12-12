use super::*;

impl Wings {
    /// Verify and fix stagger configuration
    /// Called after deserialization to ensure valid state
    pub(super) fn verify_stagger(&mut self) {
        // Ensure stagger index is valid
        if self.wing_stagger >= self.stagger_list.len() {
            self.wing_stagger = 0;
        }

        // Remove excess wings if stagger can't support them
        while self.wing_list.len() > self.stagger_list[self.wing_stagger].wing_count {
            self.wing_list.pop();
        }

        // Adjust stagger for wing count
        if self.wing_list.len() > 1 && self.wing_stagger == 0 {
            self.wing_stagger = 4; // Default biplane stagger
        } else if self.wing_list.len() <= 1 {
            self.wing_stagger = 0; // Monoplane
        }
    }

    /// Verify and fix wing configurations
    /// Remove wings that violate deck restrictions
    pub(super) fn verify_wings(&mut self) {
        // For non-inline staggers, enforce limited deck rules
        if !self.stagger_list[self.wing_stagger].inline {
            let count = self.deck_count_full();

            // Remove duplicate wings from limited decks
            for i in (0..self.wing_list.len()).rev() {
                let wing = &self.wing_list[i];
                if count[wing.deck] > 1 && self.deck_list[wing.deck].limited {
                    self.wing_list.remove(i);
                }
            }
        }

        // Verify no mini/full wing conflicts
        let full_decks = self.deck_count_full();

        for i in (0..self.mini_wing_list.len()).rev() {
            let deck = self.mini_wing_list[i].deck;
            if full_decks[deck] > 0 {
                self.mini_wing_list.remove(i);
            }
        }
    }

    /// Verify and fix gull wing configurations
    /// Remove invalid gull settings
    pub(super) fn verify_gull_wings(&mut self) {
        let wing_count = self.wing_list.len();
        for i in 0..wing_count {
            let deck = self.wing_list[i].deck;
            if self.wing_list[i].gull && !self.can_gull(deck) {
                self.wing_list[i].gull = false;
            }
        }
    }

    /// Verify closed wings setting
    pub(super) fn verify_closed(&mut self) {
        if !self.can_closed() {
            self.is_closed = false;
        }
    }

    /// Verify swept wings setting
    pub(super) fn verify_swept(&mut self) {
        if !self.can_swept() {
            self.is_swept = false;
        }
    }

    /// Run all validation checks
    /// Called after deserialization or major changes
    pub(super) fn verify_all(&mut self) {
        self.verify_stagger();
        self.verify_wings();
        self.verify_gull_wings();
        self.verify_closed();
        self.verify_swept();
    }
}
