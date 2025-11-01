use super::*;

impl Wings {
    /// Set/update/remove a full wing at the given index
    /// Pass wing.deck = -1 to remove
    /// TypeScript: SetFullWing(idx: number, w: WingType)
    pub fn set_full_wing(&mut self, idx: usize, mut wing: WingType) {
        // If not adding at end, remove existing wing at index
        if self.wing_list.len() != idx && idx < self.wing_list.len() {
            self.wing_list.remove(idx);
        }

        // Validate and fix area/span (NaN handling in TS becomes explicit checks)
        if wing.area < 0 {
            wing.area = 3;
        }
        wing.area = wing.area.max(3);

        if wing.span < 0 {
            wing.span = 1;
        }
        wing.span = wing.span.max(1);

        // Only add if deck is valid (deck >= 0 in TS, we use usize so always valid)
        if wing.deck < self.deck_list.len() {
            // Check if we can add at this deck
            if self.can_add_full_wing(wing.deck) {
                // Validate dihedral/anhedral constraints
                wing.dihedral = wing.dihedral.max(0).min(wing.span - 1);
                wing.anhedral = wing.anhedral.max(0).min(wing.span - 1 - wing.dihedral);

                self.wing_list.insert(idx.min(self.wing_list.len()), wing);
            }
        }

        // Auto-adjust stagger based on wing count
        if self.wing_list.len() > 1 && self.wing_stagger == 0 {
            // Multiple wings but on monoplane - switch to default biplane stagger
            self.wing_stagger = 4; // Unstaggered biplane
        } else if self.wing_list.len() <= 1 {
            // Back to monoplane
            self.wing_stagger = 0;
        }
    }

    /// Set/update/remove a mini wing at the given index
    /// TypeScript: SetMiniWing(idx: number, w: WingType)
    pub fn set_mini_wing(&mut self, idx: usize, mut wing: WingType) {
        // If not adding at end, remove existing mini wing at index
        if self.mini_wing_list.len() != idx && idx < self.mini_wing_list.len() {
            self.mini_wing_list.remove(idx);
        }

        // Validate and fix area/span
        if wing.area < 0 {
            wing.area = 2;
        }
        wing.area = wing.area.max(1).min(2); // Mini wings limited to 1-2 area

        if wing.span < 0 {
            wing.span = 1;
        }
        wing.span = wing.span.max(1);

        // Only add if deck is valid
        if wing.deck < self.deck_list.len() {
            if self.can_add_mini_wing(wing.deck) {
                self.mini_wing_list
                    .insert(idx.min(self.mini_wing_list.len()), wing);
            }
        }
    }

    /// Set the stagger configuration
    /// TypeScript: SetStagger(index: number)
    pub fn set_stagger(&mut self, index: usize) {
        if index >= self.stagger_list.len() {
            return;
        }

        self.wing_stagger = index;

        // Remove wings that exceed max for this stagger
        while self.stagger_list[index].wing_count < self.wing_list.len() {
            self.wing_list.pop();
        }

        // For non-inline (non-tandem) staggers, remove duplicate limited decks
        if !self.stagger_list[index].inline {
            let count = self.deck_count_full();

            // Iterate backwards to safely remove
            for i in (0..self.wing_list.len()).rev() {
                let wing = &self.wing_list[i];
                if count[wing.deck] > 1 && self.deck_list[wing.deck].limited {
                    self.wing_list.remove(i);
                }
            }
        }
    }

    /// Set whether wings are swept
    /// TypeScript: SetSwept(use: boolean)
    pub fn set_swept(&mut self, use_swept: bool) {
        if !self.wing_list.is_empty() {
            self.is_swept = use_swept;
        } else {
            self.is_swept = false;
        }
    }

    /// Set whether wings are closed
    /// TypeScript: SetClosed(use: boolean)
    pub fn set_closed(&mut self, use_closed: bool) {
        if self.wing_list.len() > 1 {
            self.is_closed = use_closed;
        } else {
            self.is_closed = false;
        }
    }

    /// Set aircraft type (affects stagger rules for ornithopters)
    /// TypeScript: SetAcftType(type: AIRCRAFT_TYPE)
    pub fn set_aircraft_type(&mut self, acft_type: AircraftType) {
        self.acft_type = acft_type;

        if acft_type == AircraftType::OrnithopterFlutter {
            // Flutter ornithopters have special stagger rules
            if self.wing_list.len() > 1 {
                self.wing_stagger = 1;
            } else {
                self.wing_stagger = 0;
            }
        }
    }

    /// Set aircraft mass (for paper wing mass limit calculation)
    /// TypeScript: SetAircraftMass(plane_mass: number)
    pub fn set_aircraft_mass(&mut self, mass: f64) {
        self.plane_mass = mass;
    }

    /// Set rotor span (for helicopters - affects longest span calculation)
    /// TypeScript: SetRotorSpan(s: number)
    pub fn set_rotor_span(&mut self, span: i16) {
        self.rotor_span = span;
    }
}
