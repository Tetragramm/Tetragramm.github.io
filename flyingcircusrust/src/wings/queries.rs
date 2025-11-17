use super::*;

impl Wings {
    /// Get the list of wing configurations
    /// TypeScript: GetWingList()
    pub fn get_wing_list(&self) -> &Vec<WingType> {
        &self.wing_list
    }

    /// Get the list of mini wing configurations
    /// TypeScript: GetMiniWingList()
    pub fn get_mini_wing_list(&self) -> &Vec<WingType> {
        &self.mini_wing_list
    }

    /// Get the list of available skin types
    /// TypeScript: GetSkinList()
    pub fn get_skin_list(&self) -> Rc<Vec<SurfaceEntry>> {
        self.skin_list.clone()
    }

    /// Get the list of stagger configurations
    /// TypeScript: GetStaggerList()
    pub fn get_stagger_list(&self) -> Rc<Vec<StaggerEntry>> {
        self.stagger_list.clone()
    }

    /// Get the list of deck types
    /// TypeScript: GetDeckList()
    pub fn get_deck_list(&self) -> Rc<Vec<DeckEntry>> {
        self.deck_list.clone()
    }

    /// Get current stagger index (-1 if no wings)
    /// TypeScript: GetStagger()
    pub fn get_stagger(&self) -> i16 {
        if self.wing_list.is_empty() {
            -1
        } else {
            self.wing_stagger as i16
        }
    }

    /// Get whether wings are swept
    /// TypeScript: GetSwept()
    pub fn get_swept(&self) -> bool {
        self.is_swept
    }

    /// Get whether wings are closed (wing-warping replacement)
    /// TypeScript: GetClosed()
    pub fn get_closed(&self) -> bool {
        self.is_closed
    }

    /// Check if this is a monoplane
    /// TypeScript: GetMonoplane()
    pub fn get_monoplane(&self) -> bool {
        self.wing_list.len() == 1
    }

    /// Check if this is a tandem configuration (wings inline, one behind the other)
    /// TypeScript: GetTandem()
    pub fn get_tandem(&self) -> bool {
        self.stagger_list[self.wing_stagger].inline && self.wing_list.len() > 1
    }

    /// Check if wings are staggered (biplane with vertical offset)
    /// TypeScript: GetStaggered()
    pub fn get_staggered(&self) -> bool {
        self.stagger_list[self.wing_stagger].stats.liftbleed != 0.0
    }

    /// Get which stagger configurations are valid for current wing count
    /// TypeScript: CanStagger()
    pub fn can_stagger(&self) -> Vec<bool> {
        let mut can = vec![false; self.stagger_list.len()];

        if self.acft_type == AircraftType::OrnithopterFlutter {
            // Flutter ornithopters have special rules
            if self.wing_list.len() > 1 {
                can[1] = true; // Must use specific stagger
            } else {
                can[0] = true;
            }
        } else {
            // Multiple wings can use any multi-wing stagger
            if self.wing_list.len() > 1 {
                for i in 1..self.stagger_list.len() {
                    can[i] = true;
                }
            }
            // Single wing can only use monoplane
            if self.wing_list.len() == 1 {
                can[0] = true;
            }
        }

        can
    }

    /// Check if we can add a full wing at the given deck
    /// TypeScript: CanAddFullWing(deck: number)
    pub fn can_add_full_wing(&self, deck: usize) -> bool {
        if deck >= self.deck_list.len() {
            return false;
        }

        // Non-tandem wings have additional restrictions
        if !self.stagger_list[self.wing_stagger].inline {
            // No shoulder with gull parasol (Polish wing restriction)
            if deck == WingDeck::Shoulder as usize && self.has_polish_wing() {
                return false;
            }

            // Limited decks can only have 1 wing
            let full_count = self.deck_count_full();
            if full_count[deck] > 0 && self.deck_list[deck].limited {
                return false;
            }
        }

        // Can't have mini and full wing on same deck
        let mini_count = self.deck_count_mini();
        if mini_count[deck] > 0 {
            return false;
        }

        true
    }

    /// Check if we can add a mini wing at the given deck
    /// TypeScript: CanAddMiniWing(deck: number)
    pub fn can_add_mini_wing(&self, deck: usize) -> bool {
        if deck >= self.deck_list.len() {
            return false;
        }

        let full_count = self.deck_count_full();
        let mini_count = self.deck_count_mini();

        // Can't have any wings (full or mini) already at this deck
        full_count[deck] == 0 && mini_count[deck] == 0
    }

    /// Check if we can move a full wing to the given deck
    /// TypeScript: CanMoveFullWing(idx: number, deck: number)
    pub fn can_move_full_wing(&self, idx: usize, deck: usize) -> bool {
        if idx >= self.wing_list.len() {
            return false;
        }

        // Temporarily remove wing and check if we can add at new deck
        let wing = self.wing_list[idx];
        let mut temp_list = self.wing_list.clone();
        temp_list.remove(idx);

        // Create temporary Wings to check validity
        let temp_wings = Wings {
            wing_list: temp_list,
            mini_wing_list: self.mini_wing_list.clone(),
            skin_list: self.skin_list.clone(),
            stagger_list: self.stagger_list.clone(),
            deck_list: self.deck_list.clone(),
            long_list: self.long_list.clone(),
            wing_stagger: self.wing_stagger,
            is_swept: self.is_swept,
            is_closed: self.is_closed,
            plane_mass: self.plane_mass,
            acft_type: self.acft_type,
            rotor_span: self.rotor_span,
        };

        temp_wings.can_add_full_wing(deck)
    }

    /// Check if we can move a mini wing to the given deck
    /// TypeScript: CanMoveMiniWing(idx: number, deck: number)
    pub fn can_move_mini_wing(&self, idx: usize, deck: usize) -> bool {
        if idx >= self.mini_wing_list.len() {
            return false;
        }

        let mut temp_list = self.mini_wing_list.clone();
        temp_list.remove(idx);

        let temp_wings = Wings {
            wing_list: self.wing_list.clone(),
            mini_wing_list: temp_list,
            skin_list: self.skin_list.clone(),
            stagger_list: self.stagger_list.clone(),
            deck_list: self.deck_list.clone(),
            long_list: self.long_list.clone(),
            wing_stagger: self.wing_stagger,
            is_swept: self.is_swept,
            is_closed: self.is_closed,
            plane_mass: self.plane_mass,
            acft_type: self.acft_type,
            rotor_span: self.rotor_span,
        };

        temp_wings.can_add_mini_wing(deck)
    }

    /// Check if a wing at the given deck can be gull
    /// TypeScript: CanGull(deck: number)
    pub fn can_gull(&self, deck: usize) -> bool {
        let deck_parasol = WingDeck::Parasol as usize;
        let deck_shoulder = WingDeck::Shoulder as usize;

        if deck == deck_parasol {
            // Parasol can't be gull if there's non-gull shoulder (and not tandem)
            if !self.get_tandem() && self.has_non_gull_deck(deck_shoulder) {
                return false;
            }
        } else if deck == deck_shoulder {
            // Shoulder can never be gull
            return false;
        } else {
            // Other decks can't be gull if deck above has non-gull (and not tandem)
            if !self.get_tandem() && self.has_non_gull_deck(deck - 1) {
                return false;
            }
        }

        true
    }

    /// Check if closed wings are possible (requires 2+ wings)
    /// TypeScript: CanClosed()
    pub fn can_closed(&self) -> bool {
        self.wing_list.len() > 1
    }

    /// Check if swept wings are possible (requires 1+ wings)
    /// TypeScript: CanSwept()
    pub fn can_swept(&self) -> bool {
        !self.wing_list.is_empty()
    }

    /// Check if celluloid cutout is possible (< 3 transparent wings)
    /// TypeScript: CanCutout()
    pub fn can_cutout(&self) -> bool {
        let mut transparent_count = 0;
        for wing in &self.wing_list {
            if self.skin_list[wing.surface].transparent {
                transparent_count += 1;
            }
        }
        transparent_count < 3
    }

    /// Get the maximum wing height (0 = gear level, 4 = parasol)
    /// TypeScript: GetWingHeight()
    pub fn get_wing_height(&self) -> i16 {
        let mut max_height = 0;
        for wing in &self.wing_list {
            max_height = max_height.max(4 - wing.deck as i16);
        }
        max_height
    }

    /// Get the longest wing span
    /// TypeScript: GetSpan()
    pub fn get_span(&self) -> i16 {
        let mut longest_span = 0;

        for wing in &self.wing_list {
            longest_span = longest_span.max(wing.span);
        }

        for wing in &self.mini_wing_list {
            longest_span = longest_span.max(wing.span);
        }

        longest_span
    }

    /// Get total wing area
    /// TypeScript: GetArea()
    pub fn get_area(&self) -> i16 {
        let mut area = 0;

        for wing in &self.wing_list {
            area += wing.area;
        }

        for wing in &self.mini_wing_list {
            area += wing.area;
        }

        area
    }

    /// Check if any wing is at parasol height
    /// TypeScript: GetParasol()
    pub fn get_parasol(&self) -> bool {
        let deck_parasol = WingDeck::Parasol as usize;

        for wing in &self.wing_list {
            if wing.deck == deck_parasol {
                return true;
            }
        }

        for wing in &self.mini_wing_list {
            if wing.deck == deck_parasol {
                return true;
            }
        }

        false
    }

    /// Get total area of metal wings
    /// TypeScript: GetMetalArea()
    pub fn get_metal_area(&self) -> i16 {
        let mut area = 0;

        for wing in &self.wing_list {
            if self.skin_list[wing.surface].metal {
                area += wing.area;
            }
        }

        for wing in &self.mini_wing_list {
            if self.skin_list[wing.surface].metal {
                area += wing.area;
            }
        }

        area
    }

    /// Calculate wing drag (used in PartStats but exposed for testing)
    /// TypeScript: GetWingDrag()
    pub fn get_wing_drag(&self) -> i16 {
        let mut drag: i16 = 0;
        let deck_count = self.deck_count_full();
        let mut longest_span = 0;
        let mut longest_drag = 0.;

        for wing in &self.wing_list {
            let wspan = wing.span;
            longest_span = longest_span.max(wspan);

            let mut warea = wing.area as f32;
            if wing.gull {
                warea = ((1.1 * warea).floor()).max(warea);
            }

            let mut wdrag: f32 = (6.0 * warea * warea / (wspan * wspan) as f32).max(1.0);
            wdrag = ((wdrag * self.skin_list[wing.surface].dragfactor).floor()).max(1.0);

            // Inline wings get drag reduction
            if self.stagger_list[self.wing_stagger].inline && deck_count[wing.deck] > 1 {
                wdrag = ((0.75 * wdrag).floor()).max(1.0);
            }

            if longest_span == wspan {
                longest_drag = wdrag;
            }

            drag += wdrag as i16;
        }

        for wing in &self.mini_wing_list {
            let wspan = wing.span;
            let mut wdrag = (6 * wing.area * wing.area / (wspan * wspan)).max(1);
            wdrag =
                ((wdrag as f32 * self.skin_list[wing.surface].dragfactor).floor() as i16).max(1);
            drag += wdrag;
        }

        // Sesquiplane/monoplane bonus
        let sesp = self.get_is_sesquiplane();
        if (sesp.0 || self.get_monoplane()) && sesp.1 != -1 {
            drag -=
                ((1.0 - self.long_list[sesp.1 as usize].dragfactor) * longest_drag).floor() as i16;
        }

        drag
    }

    /// Check if any wing uses flammable material
    /// TypeScript: IsFlammable() / GetIsFlammable()
    pub fn is_flammable(&self) -> bool {
        for wing in &self.wing_list {
            if self.skin_list[wing.surface].flammable {
                return true;
            }
        }

        for wing in &self.mini_wing_list {
            if self.skin_list[wing.surface].flammable {
                return true;
            }
        }

        false
    }

    /// Get the mass reduction from treated paper (negative mass wings)
    /// TypeScript: GetPaperMass()
    pub fn get_paper_mass(&self) -> f32 {
        let mut paper: f32 = 0.0;

        for wing in &self.wing_list {
            let wing_stats = self.skin_list[wing.surface]
                .stats
                .multiply(wing.area as f32);
            if wing_stats.mass < 0.0 {
                paper += wing_stats.mass;
            }
        }

        for wing in &self.mini_wing_list {
            let wing_stats = self.skin_list[wing.surface]
                .stats
                .multiply(wing.area as f32);
            if wing_stats.mass < 0.0 {
                paper += wing_stats.mass;
            }
        }

        // Limited to 25% of aircraft mass
        paper.max(-(0.25 * self.plane_mass).floor())
    }

    /// Check if this is a sesquiplane and get details
    /// Returns: (is_sesquiplane, biggest_deck, super_small)
    /// TypeScript: GetIsSesquiplane()
    pub fn get_is_sesquiplane(&self) -> (bool, i16, bool) {
        // If no wings, can't be a sesquiplane
        if self.wing_list.is_empty() {
            return (false, -1, false);
        }

        let mut biggest_area = 0;
        let mut biggest_deck = -1;
        let mut biggest_span = 0;
        let mut smallest_area = i16::MAX;
        let mut smallest_span = 0;

        for wing in &self.wing_list {
            if wing.area > biggest_area {
                biggest_area = wing.area;
                biggest_deck = wing.deck as i16;
                biggest_span = wing.span;
            } else if wing.area == biggest_area {
                biggest_deck = -1; // Multiple wings same size, can't determine
            }

            if wing.area < smallest_area {
                smallest_area = wing.area;
                smallest_span = wing.span;
            }
        }

        let mut is_sesqui = biggest_area >= 2 * smallest_area;
        is_sesqui = is_sesqui && !self.get_monoplane() && !self.get_tandem();

        if is_sesqui {
            let super_small = (0.75 * biggest_span as f32).floor() as i16 >= smallest_span;
            (true, biggest_deck, super_small)
        } else {
            (false, biggest_deck, false)
        }
    }

    /// Check if there's an inverted gull wing (gull at mid/low/gear deck)
    /// Returns the highest deck with inverted gull, or -1
    /// TypeScript: HasInvertedGull()
    pub fn has_inverted_gull(&self) -> i16 {
        let deck_shoulder = WingDeck::Shoulder as usize;
        let mut ret = -1;

        for wing in &self.wing_list {
            if wing.gull && wing.deck > deck_shoulder {
                ret = ret.max(wing.deck as i16);
            }
        }

        ret
    }

    /// Check if needs horizontal stabilizer (based on stagger config)
    /// TypeScript: NeedHStab()
    pub fn need_hstab(&self) -> bool {
        self.stagger_list[self.wing_stagger].hstab
    }

    /// Check if needs tail (hstab or not swept)
    /// TypeScript: NeedTail()
    pub fn need_tail(&self) -> bool {
        self.need_hstab() || !self.is_swept
    }

    // Helper methods (pub(super) for use within module)

    /// Count wings at each deck position (full wings only)
    /// TypeScript: DeckCountFull()
    pub(super) fn deck_count_full(&self) -> Vec<usize> {
        let mut count = vec![0; self.deck_list.len()];
        for wing in &self.wing_list {
            count[wing.deck] += 1;
        }
        count
    }

    /// Count wings at each deck position (mini wings only)
    /// TypeScript: DeckCountMini()
    pub(super) fn deck_count_mini(&self) -> Vec<usize> {
        let mut count = vec![0; self.deck_list.len()];
        for wing in &self.mini_wing_list {
            count[wing.deck] += 1;
        }
        count
    }

    /// Check if there's a non-gull wing at the given deck
    /// TypeScript: HasNonGullDeck(deck: number)
    pub(super) fn has_non_gull_deck(&self, deck: usize) -> bool {
        for wing in &self.wing_list {
            if wing.deck == deck && !wing.gull {
                return true;
            }
        }
        false
    }

    /// Check if there's a Polish wing (gull parasol wing)
    /// TypeScript: HasPolishWing()
    pub(super) fn has_polish_wing(&self) -> bool {
        let deck_parasol = WingDeck::Parasol as usize;
        for wing in &self.wing_list {
            if wing.deck == deck_parasol && wing.gull {
                return true;
            }
        }
        false
    }
}
