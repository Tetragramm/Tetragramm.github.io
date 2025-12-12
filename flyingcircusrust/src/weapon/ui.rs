use super::*;
use serde::{Deserialize, Serialize};

/// UI options struct for Weapon
#[derive(Serialize, Deserialize)]
pub struct WeaponOptions {
    pub fixed: Check,
    pub wing: Check,
    pub covered: Check,
    pub accessible: Check,
    pub free_accessible: Check,
    pub synchronization: Select,
    pub w_count: Number,
}

impl UIBindings for Weapon {
    type OptionsType = WeaponOptions;

    fn create_ui_options(&self) -> Self::OptionsType {
        // Create synchronization options
        let sync_list = vec![
            t!("None"),
            t!("Interruptor Gear"),
            t!("Synchronization Gear"),
            t!("Spinner Gun"),
            t!("Deflector Plate"),
            t!("No Interference"),
        ];

        let can_synch = self.can_synchronization();
        let sync_options: Vec<SelectOpt> = sync_list
            .iter()
            .enumerate()
            .map(|(i, name)| SelectOpt {
                name: name.to_string(),
                enabled: can_synch[i],
            })
            .collect();

        WeaponOptions {
            fixed: Check {
                name: t!("Fixed").to_string(),
                enabled: self.is_fixed_enabled(),
                selected: self.fixed,
            },
            wing: Check {
                name: t!("Weapons Wing Mount").to_string(),
                enabled: self.can_wing(),
                selected: self.wing,
            },
            covered: Check {
                name: t!("Weapons Covered").to_string(),
                enabled: self.can_covered(),
                selected: self.covered,
            },
            accessible: Check {
                name: t!("Weapons Accessible").to_string(),
                enabled: self.is_accessible_enabled(),
                selected: self.accessible || self.free_accessible,
            },
            free_accessible: Check {
                name: t!("Weapons Free Accessible").to_string(),
                enabled: self.is_free_accessible_enabled(),
                selected: self.free_accessible,
            },
            synchronization: Select {
                enabled: !self.wing,
                selected: self.synchronization.to_ui_index(),
                options: sync_options,
            },
            w_count: Number {
                name: t!("Weapons # Weapons at Mount").to_string(),
                enabled: self.is_w_count_enabled(),
                value: self.w_count,
            },
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        self.set_fixed(options.fixed.selected);
        self.set_wing(options.wing.selected);
        self.set_covered(options.covered.selected);
        self.set_accessible(options.accessible.selected);
        self.set_free_accessible(options.free_accessible.selected);
        self.set_synchronization(options.synchronization.selected.into());
        self.set_count(options.w_count.value);
    }
}
