use serde::{Deserialize, Serialize};
use ui_core::{Check, Number, Select, SelectOpt, UIBindings};

use super::Rotor;
use crate::types::AircraftType;
use rust_i18n::t;

/// UI options for Rotor component
/// Handles both Autogyro and Helicopter rotor configurations
#[derive(Serialize, Deserialize)]
pub struct RotorOptions {
    // Common fields
    pub aircraft_type: i16,  // Current aircraft type (for display logic)
    pub sizing_span: Number, // Read-only: calculated sizing span
    pub rotor_span: Number,  // Additional span adjustment
    pub cantilever: Select,  // Material selection
    pub accessory: Check,    // Clutch (autogyro) or Cross-link (helicopter)
    pub rotor_area: f32,     // Read-only: calculated rotor area

    // Helicopter-only fields
    pub rotor_count: Number,     // Number of rotors (helicopter only)
    pub stagger: Select,         // Arrangement/stagger (helicopter only)
    pub blade_count: Select,     // Blade count (helicopter only)
    pub rotor_thickness: Number, // Rotor thickness (helicopter only)
    pub can_rotor_count: bool,   // Whether rotor count can be modified
    pub can_tandem: bool,        // Whether tandem config is possible
}

impl UIBindings for Rotor {
    type OptionsType = RotorOptions;

    fn create_ui_options(&self) -> RotorOptions {
        // Build cantilever material select options
        let cantilever_options: Vec<SelectOpt> = self
            .get_cantilever_list()
            .iter()
            .map(|c| SelectOpt {
                name: t!(&c.name).to_string(),
                enabled: true,
            })
            .collect();

        // Build stagger/arrangement select options
        let can_stagger = self.can_stagger();
        let stagger_options: Vec<SelectOpt> = self
            .get_stagger_list()
            .iter()
            .enumerate()
            .map(|(i, s)| SelectOpt {
                name: t!(&s.name).to_string(),
                enabled: can_stagger.get(i).copied().unwrap_or(false),
            })
            .collect();

        // Build blade count select options
        let blade_options: Vec<SelectOpt> = self
            .get_blade_list()
            .iter()
            .map(|b| SelectOpt {
                name: b.name.clone(),
                enabled: true,
            })
            .collect();

        // Determine accessory label based on aircraft type
        let accessory_name = if self.get_type() == AircraftType::Helicopter {
            t!("Rotor Motor Cross-link").to_string()
        } else {
            t!("Rotor Clutched Rotor").to_string()
        };

        RotorOptions {
            aircraft_type: self.get_type() as i16,
            sizing_span: Number {
                name: t!("Rotor Minimum Span").to_string(),
                enabled: false, // Read-only
                value: self.get_sizing_span(),
            },
            rotor_span: Number {
                name: t!("Rotor Span").to_string(),
                enabled: true,
                value: self.get_rotor_span(),
            },
            cantilever: Select {
                enabled: true,
                options: cantilever_options,
                selected: self.get_cantilever(),
            },
            accessory: Check {
                name: accessory_name,
                enabled: true,
                selected: self.get_accessory(),
            },
            rotor_area: self.get_rotor_area().floor(),

            // Helicopter-only
            rotor_count: Number {
                name: t!("Rotor Number of Rotors").to_string(),
                enabled: self.can_rotor_count(),
                value: self.get_rotor_count() as i16,
            },
            stagger: Select {
                enabled: self.can_tandem(),
                options: stagger_options,
                selected: self.get_stagger(),
            },
            blade_count: Select {
                enabled: self.get_type() == AircraftType::Helicopter,
                options: blade_options,
                selected: self.get_blade_count_idx(),
            },
            rotor_thickness: Number {
                name: t!("Rotor Thickness").to_string(),
                enabled: self.get_type() == AircraftType::Helicopter,
                value: self.get_rotor_thickness(),
            },
            can_rotor_count: self.can_rotor_count(),
            can_tandem: self.can_tandem(),
        }
    }

    fn receive_ui_selections(&mut self, options: RotorOptions) {
        // Update rotor span
        if options.rotor_span.value != self.get_rotor_span() {
            self.set_rotor_span(options.rotor_span.value);
        }

        // Update cantilever material
        if options.cantilever.selected != self.get_cantilever() {
            self.set_cantilever(options.cantilever.selected);
        }

        // Update accessory
        if options.accessory.selected != self.get_accessory() {
            self.set_accessory(options.accessory.selected);
        }

        // Helicopter-specific updates
        if self.get_type() == AircraftType::Helicopter {
            // Update rotor count
            if options.rotor_count.value as usize != self.get_rotor_count() {
                self.set_rotor_count(options.rotor_count.value as usize);
            }

            // Update stagger/arrangement
            if options.stagger.selected != self.get_stagger() {
                self.set_stagger(options.stagger.selected);
            }

            // Update blade count
            if options.blade_count.selected != self.get_blade_count_idx() {
                self.set_blade_count(options.blade_count.selected);
            }

            // Update rotor thickness
            if options.rotor_thickness.value != self.get_rotor_thickness() {
                self.set_rotor_thickness(options.rotor_thickness.value);
            }
        }
    }
}
