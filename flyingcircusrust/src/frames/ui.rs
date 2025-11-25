use serde::{Deserialize, Serialize};
use ui_core::{Check, Number, Select, SelectOpt, UIBindings};

use super::{Frames, Section};
use rust_i18n::t;

/// UI options for a single frame section
#[derive(Serialize, Deserialize)]
pub struct SectionOptions {
    pub idx: Number, // Section index for identification
    pub frame: Select,
    pub geodesic: Check,
    pub monocoque: Check,
    pub lifting_body: Check,
    pub internal_bracing: Check,
    // Utility flags for add/remove buttons
    pub can_add: bool,
    pub can_remove: bool,
}

/// UI options for a single tail section
#[derive(Serialize, Deserialize)]
pub struct TailSectionOptions {
    pub idx: Number, // Section index for identification
    pub frame: Select,
    pub geodesic: Check,
    pub monocoque: Check,
    pub lifting_body: Check,
    // No internal_bracing for tail sections
}

/// UI options for the entire Frames component
#[derive(Serialize, Deserialize)]
pub struct FramesOptions {
    // "Apply to all" selects
    pub all_frame: Select,
    pub all_skin: Select,

    // Cockpit/fuselage sections (variable length)
    pub sections: Vec<SectionOptions>,

    // Tail configuration
    pub tail_type: Select,
    pub farman: Check,
    pub boom: Check,
    pub flying_wing: Check,

    // Tail sections (variable length, based on tail_type)
    pub tail_sections: Vec<TailSectionOptions>,
}

impl UIBindings for Frames {
    type OptionsType = FramesOptions;

    fn create_ui_options(&self) -> FramesOptions {
        // Build all_frame select options
        let frame_options: Vec<SelectOpt> = self
            .get_frame_list()
            .iter()
            .map(|f| SelectOpt {
                name: t!(&f.name).to_string(),
                enabled: f.basestruct > 0, // Disable frames with no base structure
            })
            .collect();

        // Build all_skin select options
        let skin_options: Vec<SelectOpt> = self
            .get_skin_list()
            .iter()
            .map(|s| SelectOpt {
                name: t!(&s.name).to_string(),
                enabled: true,
            })
            .collect();

        // Build sections
        let sections: Vec<SectionOptions> = self
            .get_section_list()
            .iter()
            .enumerate()
            .map(|(i, sec)| self.create_section_options(i, sec))
            .collect();

        // Build tail_type select options
        let tail_options: Vec<SelectOpt> = self
            .get_tail_list()
            .iter()
            .map(|t| SelectOpt {
                name: t!(&t.name).to_string(),
                enabled: true,
            })
            .collect();

        // Build tail sections
        let tail_sections: Vec<TailSectionOptions> = self
            .get_tail_section_list()
            .iter()
            .enumerate()
            .map(|(i, sec)| self.create_tail_section_options(i, sec))
            .collect();

        FramesOptions {
            all_frame: Select {
                enabled: true,
                options: frame_options,
                selected: 0, // No default selection for "all" - will be -1 in UI
            },
            all_skin: Select {
                enabled: true,
                options: skin_options,
                selected: self.get_skin(),
            },
            sections,
            tail_type: Select {
                enabled: true,
                options: tail_options,
                selected: self.get_tail_type(),
            },
            farman: Check {
                name: t!("Frames Tail Farman").to_string(),
                enabled: !self.get_use_boom() && !self.get_is_tailless(),
                selected: self.get_use_farman(),
            },
            boom: Check {
                name: t!("Frames Tail Boom").to_string(),
                enabled: !self.get_use_farman() && !self.get_is_tailless(),
                selected: self.get_use_boom(),
            },
            flying_wing: Check {
                name: t!("Frames Flying Wing").to_string(),
                enabled: self.can_flying_wing(),
                selected: self.get_flying_wing(),
            },
            tail_sections,
        }
    }

    fn receive_ui_selections(&mut self, options: FramesOptions) {
        // Handle "apply to all" selections

        if options.all_skin.selected != self.get_skin() {
            self.set_all_skin(options.all_skin.selected);
        }

        // Handle tail configuration
        if options.tail_type.selected != self.get_tail_type() {
            self.set_tail_type(options.tail_type.selected);
        }

        if options.farman.selected != self.get_use_farman() {
            self.set_use_farman(options.farman.selected);
        }

        if options.boom.selected != self.get_use_boom() {
            self.set_use_boom(options.boom.selected);
        }

        if options.flying_wing.selected != self.get_flying_wing() {
            self.set_flying_wing(options.flying_wing.selected);
        }

        // Handle cockpit sections
        // Note: The number of sections might have changed, we only update existing ones
        for (i, sec_options) in options.sections.iter().enumerate() {
            if i < self.get_section_list().len() {
                self.receive_section_selections(i, sec_options);
            }
        }

        // Handle tail sections
        for (i, tail_sec_options) in options.tail_sections.iter().enumerate() {
            if i < self.get_tail_section_list().len() {
                self.receive_tail_section_selections(i, tail_sec_options);
            }
        }

        // Note: In UI, all_frame will be -1 (no selection) unless user explicitly changes it
        // We only apply if the selection changes from the previous call
        // This goes last because it overrides each individual frame skin selection.
        if options.all_frame.selected < options.all_frame.options.len() {
            self.set_all_frame(options.all_frame.selected);
        }
    }
}

impl Frames {
    /// Create UI options for a single cockpit section
    fn create_section_options(&self, idx: usize, sec: &Section) -> SectionOptions {
        let frame_list = self.get_frame_list();
        let frame_options: Vec<SelectOpt> = frame_list
            .iter()
            .map(|f| {
                let mut enabled = true;
                // Disable if geodesic is checked but frame doesn't support it
                if sec.geodesic && !f.geodesic {
                    enabled = false;
                }
                // Disable if not internal bracing and frame has no base structure
                if !sec.internal_bracing && f.basestruct == 0 {
                    enabled = false;
                }
                SelectOpt {
                    name: t!(&f.name).to_string(),
                    enabled,
                }
            })
            .collect();

        SectionOptions {
            idx: Number {
                name: String::new(),
                enabled: true,
                value: idx as i16,
            },
            frame: Select {
                enabled: true,
                options: frame_options,
                selected: sec.frame,
            },
            geodesic: Check {
                name: t!("Frames Geodesic").to_string(),
                enabled: self.possible_geodesic(idx),
                selected: sec.geodesic,
            },
            monocoque: Check {
                name: t!("Frames Monocoque").to_string(),
                enabled: self.possible_monocoque(idx),
                selected: sec.monocoque,
            },
            internal_bracing: Check {
                name: t!("Frames Internal Bracing").to_string(),
                enabled: if !sec.internal_bracing {
                    self.possible_internal_bracing(true) && self.possible_remove_sections()
                } else {
                    true
                },
                selected: sec.internal_bracing,
            },
            lifting_body: Check {
                name: t!("Frames Lifting Body").to_string(),
                enabled: self.possible_lifting_body(idx),
                selected: sec.lifting_body,
            },
            can_add: if sec.internal_bracing {
                self.possible_internal_bracing(false)
            } else {
                true
            },
            can_remove: if sec.internal_bracing {
                true
            } else {
                self.possible_remove_sections()
            },
        }
    }

    /// Create UI options for a single tail section
    fn create_tail_section_options(&self, idx: usize, sec: &Section) -> TailSectionOptions {
        let frame_list = self.get_frame_list();
        let frame_options: Vec<SelectOpt> = frame_list
            .iter()
            .map(|f| {
                let mut enabled = true;
                // Disable if geodesic is checked but frame doesn't support it
                if sec.geodesic && !f.geodesic {
                    enabled = false;
                }
                // Disable if frame has no base structure
                if !sec.internal_bracing && f.basestruct == 0 {
                    enabled = false;
                }
                SelectOpt {
                    name: t!(&f.name).to_string(),
                    enabled,
                }
            })
            .collect();

        TailSectionOptions {
            idx: Number {
                name: String::new(),
                enabled: true,
                value: idx as i16,
            },
            frame: Select {
                enabled: true,
                options: frame_options,
                selected: sec.frame,
            },
            geodesic: Check {
                name: t!("Frames Geodesic").to_string(),
                enabled: self.possible_tail_geodesic(idx),
                selected: sec.geodesic,
            },
            monocoque: Check {
                name: t!("Frames Monocoque").to_string(),
                enabled: self.possible_tail_monocoque(idx),
                selected: sec.monocoque,
            },
            lifting_body: Check {
                name: t!("Frames Lifting Body").to_string(),
                enabled: self.possible_tail_lifting_body(idx),
                selected: sec.lifting_body,
            },
        }
    }

    /// Receive UI selections for a cockpit section
    fn receive_section_selections(&mut self, idx: usize, options: &SectionOptions) {
        let sec_list = self.get_section_list();
        if idx >= sec_list.len() {
            return;
        }

        // Extract all current values before dropping the immutable borrow
        let current_frame = sec_list[idx].frame;
        let current_geodesic = sec_list[idx].geodesic;
        let current_monocoque = sec_list[idx].monocoque;
        let current_internal_bracing = sec_list[idx].internal_bracing;
        let current_lifting_body = sec_list[idx].lifting_body;
        let _ = sec_list; // Explicitly drop the immutable borrow

        // Update frame type
        if options.frame.selected != current_frame {
            self.set_frame(idx, options.frame.selected);
        }

        // Update flags
        if options.geodesic.selected != current_geodesic {
            self.set_geodesic(idx, options.geodesic.selected);
        }

        if options.monocoque.selected != current_monocoque {
            self.set_monocoque(idx, options.monocoque.selected);
        }

        if options.internal_bracing.selected != current_internal_bracing {
            self.set_internal_bracing(idx, options.internal_bracing.selected);
        }

        if options.lifting_body.selected != current_lifting_body {
            self.set_lifting_body(idx, options.lifting_body.selected);
        }
    }

    /// Receive UI selections for a tail section
    fn receive_tail_section_selections(&mut self, idx: usize, options: &TailSectionOptions) {
        let tail_sec_list = self.get_tail_section_list();
        if idx >= tail_sec_list.len() {
            return;
        }

        // Extract all current values before dropping the immutable borrow
        let current_frame = tail_sec_list[idx].frame;
        let current_geodesic = tail_sec_list[idx].geodesic;
        let current_monocoque = tail_sec_list[idx].monocoque;
        let current_lifting_body = tail_sec_list[idx].lifting_body;
        let _ = tail_sec_list; // Explicitly drop the immutable borrow

        // Update frame type
        if options.frame.selected != current_frame {
            self.set_tail_frame(idx, options.frame.selected);
        }

        // Update flags
        if options.geodesic.selected != current_geodesic {
            self.set_tail_geodesic(idx, options.geodesic.selected);
        }

        if options.monocoque.selected != current_monocoque {
            self.set_tail_monocoque(idx, options.monocoque.selected);
        }

        if options.lifting_body.selected != current_lifting_body {
            self.set_tail_lifting_body(idx, options.lifting_body.selected);
        }
    }
}
