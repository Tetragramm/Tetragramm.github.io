use super::Weapons;
use serde::{Deserialize, Serialize};
use ui_core::*;

/// UI options struct for Weapons container
#[derive(Serialize, Deserialize)]
pub struct WeaponsOptions {
    pub num_weapon_systems: Number,
    pub brace_count: Number,
}

impl UIBindings for Weapons {
    type OptionsType = WeaponsOptions;

    fn create_ui_options(&self) -> Self::OptionsType {
        WeaponsOptions {
            num_weapon_systems: Number {
                name: t!("Weapons Number of Weapon Sets").to_string(),
                enabled: true,
                value: self.weapon_sets.len() as i16,
            },
            brace_count: Number {
                name: t!("Weapons Number of Weapon Braces").to_string(),
                enabled: true,
                value: self.brace_count,
            },
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        self.set_weapon_set_count(options.num_weapon_systems.value as usize);
        self.set_brace_count(options.brace_count.value);
    }
}
