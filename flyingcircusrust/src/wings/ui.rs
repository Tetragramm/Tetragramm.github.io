use serde::{Deserialize, Serialize};
use ui_core::{Check, Number, Select, SelectOpt, UIBindings};

use super::{WingType, Wings};
use rust_i18n::t;

/// UI options for a single full wing
#[derive(Serialize, Deserialize)]
pub struct FullWingOptions {
    pub idx: Number, // Wing index for identification
    pub deck: Select,
    pub skin: Select,
    pub area: Number,
    pub span: Number,
    pub gull: Check,
    pub dihedral: Number,
    pub anhedral: Number,
}

/// UI options for a single mini wing
#[derive(Serialize, Deserialize)]
pub struct MiniWingOptions {
    pub idx: Number, // Wing index for identification
    pub deck: Select,
    pub skin: Select,
    pub area: Number,
    pub span: Number,
}

/// Options for adding new wings (select dropdown with available decks)
#[derive(Serialize, Deserialize)]
pub struct AddWingOptions {
    pub deck: Select,  // Select which deck to add wing at
    pub can_add: bool, // Whether any deck is available
}

/// UI options for the entire Wings component
#[derive(Serialize, Deserialize)]
pub struct WingsOptions {
    // Global wing configuration
    pub stagger: Select,
    pub closed: Check,
    pub swept: Check,

    // Full wings (variable length)
    pub full_wings: Vec<FullWingOptions>,
    pub add_full_wing: AddWingOptions,

    // Mini wings (variable length)
    pub mini_wings: Vec<MiniWingOptions>,
    pub add_mini_wing: AddWingOptions,
}

impl UIBindings for Wings {
    type OptionsType = WingsOptions;

    fn create_ui_options(&self) -> WingsOptions {
        // Build stagger select options
        let stagger_options: Vec<SelectOpt> = self
            .get_stagger_list()
            .iter()
            .enumerate()
            .map(|(i, s)| SelectOpt {
                name: s.name.clone(),
                enabled: self.can_stagger()[i],
            })
            .collect();

        // Build full wings
        let full_wings: Vec<FullWingOptions> = self
            .get_wing_list()
            .iter()
            .enumerate()
            .map(|(i, wing)| self.create_full_wing_options(i, wing))
            .collect();

        // Build mini wings
        let mini_wings: Vec<MiniWingOptions> = self
            .get_mini_wing_list()
            .iter()
            .enumerate()
            .map(|(i, wing)| self.create_mini_wing_options(i, wing))
            .collect();

        // Build add full wing dropdown
        let add_full_wing = self.create_add_full_wing_options();

        // Build add mini wing dropdown
        let add_mini_wing = self.create_add_mini_wing_options();

        WingsOptions {
            stagger: Select {
                enabled: true,
                options: stagger_options,
                selected: if self.get_stagger() < 0 {
                    0
                } else {
                    self.get_stagger() as usize
                },
            },
            closed: Check {
                name: t!("Wings Closed Wing").to_string(),
                enabled: self.can_closed(),
                selected: self.get_closed(),
            },
            swept: Check {
                name: t!("Wings Swept Wing").to_string(),
                enabled: self.can_swept(),
                selected: self.get_swept(),
            },
            full_wings,
            add_full_wing,
            mini_wings,
            add_mini_wing,
        }
    }

    fn receive_ui_selections(&mut self, options: WingsOptions) {
        // Handle global settings
        if options.stagger.selected != self.get_stagger() as usize {
            self.set_stagger(options.stagger.selected);
        }

        if options.closed.selected != self.get_closed() {
            self.set_closed(options.closed.selected);
        }

        if options.swept.selected != self.get_swept() {
            self.set_swept(options.swept.selected);
        }

        // Handle full wings
        // Note: The number of wings might have changed, we only update existing ones
        for (i, wing_options) in options.full_wings.iter().enumerate() {
            if i < self.get_wing_list().len() {
                self.receive_full_wing_selections(i, wing_options);
            }
        }

        // Handle mini wings
        for (i, mini_wing_options) in options.mini_wings.iter().enumerate() {
            if i < self.get_mini_wing_list().len() {
                self.receive_mini_wing_selections(i, mini_wing_options);
            }
        }

        // Handle add wing selections
        // If deck.selected == 0, it's "No Wing" (do nothing)
        // Otherwise, add wing at deck (selected - 1)
        if options.add_full_wing.deck.selected > 0 {
            let deck = options.add_full_wing.deck.selected - 1;
            if deck < self.get_deck_list().len() && self.can_add_full_wing(deck) {
                let new_wing = WingType {
                    surface: 0,
                    area: 10,
                    span: 5,
                    gull: false,
                    dihedral: 0,
                    anhedral: 0,
                    deck,
                };
                self.set_full_wing(self.get_wing_list().len(), new_wing);
            }
        }

        if options.add_mini_wing.deck.selected > 0 {
            let deck = options.add_mini_wing.deck.selected - 1;
            if deck < self.get_deck_list().len() && self.can_add_mini_wing(deck) {
                let new_wing = WingType {
                    surface: 0,
                    area: 2,
                    span: 2,
                    gull: false,
                    dihedral: 0,
                    anhedral: 0,
                    deck,
                };
                self.set_mini_wing(self.get_mini_wing_list().len(), new_wing);
            }
        }
    }
}

impl Wings {
    /// Create UI options for a single full wing
    fn create_full_wing_options(&self, idx: usize, wing: &WingType) -> FullWingOptions {
        let deck_list = self.get_deck_list();

        // Build deck select options
        // First option is "No Wing" for removal
        let mut deck_options = vec![SelectOpt {
            name: t!("Wings No Wing").to_string(),
            enabled: true,
        }];

        // Add all deck options with availability checks
        for (i, deck_entry) in deck_list.iter().enumerate() {
            let enabled = if i == wing.deck {
                // Current deck is always enabled
                true
            } else {
                // Check if we can move to this deck
                self.can_move_full_wing(idx, i) || self.can_add_full_wing(i)
            };

            deck_options.push(SelectOpt {
                name: deck_entry.name.clone(),
                enabled,
            });
        }

        // Build skin select options
        let skin_options: Vec<SelectOpt> = self
            .get_skin_list()
            .iter()
            .map(|s| SelectOpt {
                name: s.name.clone(),
                enabled: true,
            })
            .collect();

        FullWingOptions {
            idx: Number {
                name: String::new(),
                enabled: true,
                value: idx as i16,
            },
            deck: Select {
                enabled: true,
                options: deck_options,
                selected: wing.deck + 1, // +1 because option 0 is "No Wing"
            },
            skin: Select {
                enabled: true,
                options: skin_options,
                selected: wing.surface,
            },
            area: Number {
                name: t!("Wings Area").to_string(),
                enabled: true,
                value: wing.area,
            },
            span: Number {
                name: t!("Wings Span").to_string(),
                enabled: true,
                value: wing.span,
            },
            gull: Check {
                name: t!("Wings Gull").to_string(),
                enabled: self.can_gull(wing.deck),
                selected: wing.gull,
            },
            dihedral: Number {
                name: t!("Wings Dihedral").to_string(),
                enabled: true,
                value: wing.dihedral,
            },
            anhedral: Number {
                name: t!("Wings Anhedral").to_string(),
                enabled: true,
                value: wing.anhedral,
            },
        }
    }

    /// Create UI options for a single mini wing
    fn create_mini_wing_options(&self, idx: usize, wing: &WingType) -> MiniWingOptions {
        let deck_list = self.get_deck_list();

        // Build deck select options
        let mut deck_options = vec![SelectOpt {
            name: t!("Wings No Wing").to_string(),
            enabled: true,
        }];

        for (i, deck_entry) in deck_list.iter().enumerate() {
            let enabled = if i == wing.deck {
                true
            } else {
                self.can_move_mini_wing(idx, i) || self.can_add_mini_wing(i)
            };

            deck_options.push(SelectOpt {
                name: deck_entry.name.clone(),
                enabled,
            });
        }

        // Build skin select options
        let skin_options: Vec<SelectOpt> = self
            .get_skin_list()
            .iter()
            .map(|s| SelectOpt {
                name: s.name.clone(),
                enabled: true,
            })
            .collect();

        MiniWingOptions {
            idx: Number {
                name: String::new(),
                enabled: true,
                value: idx as i16,
            },
            deck: Select {
                enabled: true,
                options: deck_options,
                selected: wing.deck + 1,
            },
            skin: Select {
                enabled: true,
                options: skin_options,
                selected: wing.surface,
            },
            area: Number {
                name: t!("Wings Area").to_string(),
                enabled: true,
                value: wing.area,
            },
            span: Number {
                name: t!("Wings Span").to_string(),
                enabled: true,
                value: wing.span,
            },
        }
    }

    /// Create "add full wing" dropdown options
    fn create_add_full_wing_options(&self) -> AddWingOptions {
        let deck_list = self.get_deck_list();

        // Build deck select options
        let mut deck_options = vec![SelectOpt {
            name: t!("Wings No Wing").to_string(),
            enabled: true,
        }];

        let mut can_add = false;

        for (i, deck_entry) in deck_list.iter().enumerate() {
            let enabled = self.can_add_full_wing(i);
            if enabled {
                can_add = true;
            }

            deck_options.push(SelectOpt {
                name: deck_entry.name.clone(),
                enabled,
            });
        }

        AddWingOptions {
            deck: Select {
                enabled: can_add,
                options: deck_options,
                selected: 0, // Default to "No Wing"
            },
            can_add,
        }
    }

    /// Create "add mini wing" dropdown options
    fn create_add_mini_wing_options(&self) -> AddWingOptions {
        let deck_list = self.get_deck_list();

        let mut deck_options = vec![SelectOpt {
            name: t!("Wings No Wing").to_string(),
            enabled: true,
        }];

        let mut can_add = false;

        for (i, deck_entry) in deck_list.iter().enumerate() {
            let enabled = self.can_add_mini_wing(i);
            if enabled {
                can_add = true;
            }

            deck_options.push(SelectOpt {
                name: deck_entry.name.clone(),
                enabled,
            });
        }

        AddWingOptions {
            deck: Select {
                enabled: can_add,
                options: deck_options,
                selected: 0,
            },
            can_add,
        }
    }

    /// Receive UI selections for a full wing
    fn receive_full_wing_selections(&mut self, idx: usize, options: &FullWingOptions) {
        let wing_list = self.get_wing_list();
        if idx >= wing_list.len() {
            return;
        }

        let current_wing = wing_list[idx];

        // Check if user selected "No Wing" (deck.selected == 0)
        if options.deck.selected == 0 {
            // Remove this wing by setting it with invalid deck
            // Actually, we need to remove it by index
            // But set_full_wing doesn't remove if deck is invalid
            // We need a different approach - just don't call set if deck is 0
            // Actually, looking at the TypeScript, they check if deck is -1 to remove
            // So we'll create a wing with a marker deck that's out of range
            // Actually, easier: just remove manually
            self.wing_list.remove(idx);
            // Update stagger if needed
            if self.wing_list.len() <= 1 {
                self.wing_stagger = 0;
            }
            return;
        }

        // Build updated wing
        let mut updated_wing = WingType {
            surface: options.skin.selected,
            area: options.area.value,
            span: options.span.value,
            gull: options.gull.selected,
            dihedral: options.dihedral.value,
            anhedral: options.anhedral.value,
            deck: options.deck.selected - 1, // -1 because option 0 is "No Wing"
        };

        // Check if anything changed
        let changed = current_wing.surface != updated_wing.surface
            || current_wing.area != updated_wing.area
            || current_wing.span != updated_wing.span
            || current_wing.gull != updated_wing.gull
            || current_wing.dihedral != updated_wing.dihedral
            || current_wing.anhedral != updated_wing.anhedral
            || current_wing.deck != updated_wing.deck;

        if changed {
            self.set_full_wing(idx, updated_wing);
        }
    }

    /// Receive UI selections for a mini wing
    fn receive_mini_wing_selections(&mut self, idx: usize, options: &MiniWingOptions) {
        let mini_wing_list = self.get_mini_wing_list();
        if idx >= mini_wing_list.len() {
            return;
        }

        let current_wing = mini_wing_list[idx];

        // Check if user selected "No Wing" (deck.selected == 0)
        if options.deck.selected == 0 {
            self.mini_wing_list.remove(idx);
            return;
        }

        // Build updated wing
        let updated_wing = WingType {
            surface: options.skin.selected,
            area: options.area.value,
            span: options.span.value,
            gull: false, // Mini wings don't have gull
            dihedral: 0, // Mini wings don't have dihedral
            anhedral: 0, // Mini wings don't have anhedral
            deck: options.deck.selected - 1,
        };

        let changed = current_wing.surface != updated_wing.surface
            || current_wing.area != updated_wing.area
            || current_wing.span != updated_wing.span
            || current_wing.deck != updated_wing.deck;

        if changed {
            self.set_mini_wing(idx, updated_wing);
        }
    }
}
