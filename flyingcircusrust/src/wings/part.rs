use super::*;
use crate::part::{ElectricsMessage, Equipment, Part};
use crate::stats::{Era, Stats, ERA};

impl Part for Wings {
    /// Calculate stats contribution from wing configuration
    /// TypeScript: PartStats()
    /// This is the most complex PartStats implementation in the codebase
    fn part_stats(&mut self) -> Stats {
        // Auto-disable invalid configurations
        if !self.can_closed() {
            self.is_closed = false;
        }
        if !self.can_swept() {
            self.is_swept = false;
        }

        // Auto-fix invalid gull wings
        let wing_count = self.wing_list.len();
        for i in 0..wing_count {
            let deck = self.wing_list[i].deck;
            if !self.can_gull(deck) {
                self.wing_list[i].gull = false;
            }
        }

        let mut stats = Stats::new();
        let mut have_wing = false;
        let deck_count = self.deck_count_full();
        let mut have_mini_wing = false;
        let mut longest_span = self.rotor_span;
        let mut longest_drag: f32 = 0.0;
        let mut celluloid_count = 0;

        // Process each full wing
        for wing in &self.wing_list {
            longest_span = longest_span.max(wing.span);

            if !have_wing {
                // First wing
                have_wing = true;
            } else {
                // Additional wings add control difficulty and liftbleed
                stats.control += 3.0;
                stats.liftbleed += 5.0;
                stats.visibility -= 1.0;
            }

            let mut wing_stats = Stats::new();

            // Base stats from skin type
            wing_stats = wing_stats.add(
                &self.skin_list[wing.surface]
                    .stats
                    .multiply(wing.area as f32),
            );
            wing_stats.wingarea = wing.area as f32;

            // Wing structure stress
            wing_stats.maxstrain += 0.0_f32.min(-((2 * wing.span + wing.area - 10) as f32));

            // Buzzer ornithopters double wing stress
            if self.acft_type == AircraftType::OrnithopterBuzzer {
                wing_stats.maxstrain += 0.0_f32.min(-((2 * wing.span + wing.area - 10) as f32));
            }

            wing_stats.maxstrain *= self.skin_list[wing.surface].strainfactor;

            // Transparent wings (celluloid) add visibility (max 3)
            if self.skin_list[wing.surface].transparent && celluloid_count < 3 {
                wing_stats.visibility += 1.0;
                celluloid_count += 1;
            }

            // Calculate wing drag
            let wspan = wing.span as f32;
            let mut warea = wing.area as f32;

            // Gull wings have 10% more drag-generating area
            if wing.gull {
                warea = (1.1 * warea).floor();
            }

            let wdrag = (6.0 * warea * warea / (wspan * wspan)).max(1.0);
            wing_stats.drag = wing_stats.drag + wdrag;
            wing_stats.drag = (wing_stats.drag * self.skin_list[wing.surface].dragfactor).max(1.0);

            // Inline (tandem) wings get drag reduction
            if self.stagger_list[self.wing_stagger].inline && deck_count[wing.deck] > 1 {
                wing_stats.drag = (0.75 * wing_stats.drag).floor().max(1.0);
            }

            // Add deck-specific stats
            stats = stats.add(&self.deck_list[wing.deck].stats);

            // Dihedral/anhedral effects on stability
            wing_stats.latstab += (wing.dihedral - wing.anhedral) as f32;
            wing_stats.liftbleed += (wing.dihedral + wing.anhedral) as f32;

            // Track longest wing drag for sesquiplane bonus (before rounding)
            if longest_span == wing.span {
                longest_drag = wing_stats.drag;
            }

            // Treated paper wings have negative mass (handled separately)
            if wing_stats.mass < 0.0 {
                wing_stats.mass = 0.0;
            }

            wing_stats.round();

            stats = stats.add(&wing_stats);
        }

        // Process each mini wing
        for wing in &self.mini_wing_list {
            longest_span = longest_span.max(wing.span);

            stats.control += 1.0;

            if !have_mini_wing {
                have_mini_wing = true;
            } else {
                // Additional mini wings add liftbleed
                stats.liftbleed += 1.0;
            }

            // Base stats from skin type
            let mut wing_stats = self.skin_list[wing.surface]
                .stats
                .multiply(wing.area as f32);
            wing_stats.wingarea = wing.area as f32;

            // Wing structure stress
            wing_stats.maxstrain += 0.0_f32.min(-((2 * wing.span + wing.area - 10) as f32));
            wing_stats.maxstrain *= self.skin_list[wing.surface].strainfactor;

            // Calculate mini wing drag
            let wspan = wing.span as f32;
            let warea = wing.area as f32;
            wing_stats.drag = (6.0 * warea * warea / (wspan * wspan)).max(1.0) + wing_stats.drag;
            wing_stats.drag = (wing_stats.drag * self.skin_list[wing.surface].dragfactor).max(1.0);

            // Dihedral/anhedral effects
            wing_stats.latstab += (wing.dihedral - wing.anhedral) as f32;
            wing_stats.liftbleed += (wing.dihedral + wing.anhedral) as f32;

            // Treated paper (negative mass handled separately)
            if wing_stats.mass < 0.0 {
                wing_stats.mass = 0.0;
            }

            stats = stats.add(&wing_stats);
        }

        // Longest wing effects on control and stability
        stats.control += (8 - longest_span) as f32;
        stats.latstab += 0.0_f32.min((longest_span - 8) as f32);

        // Sesquiplane/monoplane drag bonus
        let sesp = self.get_is_sesquiplane();
        if (sesp.0 || self.get_monoplane()) && sesp.1 != -1 {
            let deck_idx = sesp.1 as usize;
            stats = stats.add(&self.long_list[deck_idx].stats);
            stats.drag -= ((1.0 - self.long_list[deck_idx].dragfactor) * longest_drag).floor();
        }

        // Sesquiplane bonuses
        if sesp.0 {
            stats.liftbleed -= 2.0;
            stats.control += 2.0;
        }

        // Inline wing shadowing (tandem configuration)
        if self.stagger_list[self.wing_stagger].inline {
            for count in &deck_count {
                if *count > 1 {
                    stats.liftbleed += ((*count - 1) * 3) as f32;
                }
            }
        }

        // Gull wing effects
        if self.has_polish_wing() {
            // Polish wing (gull parasol)
            stats.visibility += 1.0;
            stats.maxstrain += 10.0;
        }

        let inverted_gull_deck = self.has_inverted_gull();
        match inverted_gull_deck {
            1 => {
                // Shoulder - can't be gull (should be filtered out)
            }
            2 | 3 => {
                // Mid or Low - affects landing gear and bomb capacity (external)
            }
            4 => {
                // Gear deck gull wing
                stats.maxstrain += 10.0;
                stats.crashsafety += 1.0;
            }
            _ => {
                // No inverted gull
            }
        }

        if inverted_gull_deck > 0 || self.has_polish_wing() {
            stats.eras.push(Era {
                name: "Gull Wing".to_string(),
                era: ERA::ComingStorm,
            });
        }

        // Wing sweep effects
        if self.is_swept {
            stats.liftbleed += 5.0;
            stats.latstab -= 1.0;
        }

        // Closed wing effects (wing-warping alternative)
        if self.is_closed {
            let pairs = (self.wing_list.len() as f32 / 2.0).floor() as i16;
            stats.mass += pairs as f32;
            stats.control -= (5 * pairs) as f32;
            stats.maxstrain += (20 * pairs) as f32;
        }

        // Stagger effects (only for multiple wings)
        if self.wing_list.len() > 1 {
            stats = stats.add(&self.stagger_list[self.wing_stagger].stats);
        }

        stats
    }

    /// Get electrics contribution (solar panel wings)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> ElectricsMessage {
        let mut storage = 0;
        let mut equipment = Vec::new();

        let mut total_charge: f32 = 0.0;
        let mut source = String::new();

        // Sum charge from all wings with solar panels
        for wing in &self.wing_list {
            let skin = &self.skin_list[wing.surface];
            if skin.stats.charge != 0.0 {
                source = skin.name.clone();
                total_charge += skin.stats.charge * wing.area as f32;
                total_charge = total_charge.floor();
            }
        }

        if total_charge != 0.0 {
            equipment.push(Equipment {
                source,
                charge: total_charge.to_string(),
            });
        }

        ElectricsMessage { storage, equipment }
    }
}
