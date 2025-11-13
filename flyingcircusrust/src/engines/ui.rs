use super::Engines;
use serde::{Deserialize, Serialize};
use ui_core::*;

/// UI options struct for Engines container
#[derive(Serialize, Deserialize)]
pub struct EnginesOptions {
    pub is_asymmetric: Check,
    pub engines: Number,
    pub radiators: Number,
}

impl UIBindings for Engines {
    type OptionsType = EnginesOptions;

    fn create_ui_options(&self) -> Self::OptionsType {
        EnginesOptions {
            is_asymmetric: Check {
                name: t!("Engines Asymmetric Plane").to_string(),
                enabled: true,
                selected: self.is_asymmetric,
            },
            engines: Number {
                name: t!("Engines Num Engines").into(),
                enabled: true,
                value: self.engines.len() as i16,
            },
            radiators: Number {
                name: t!("Engines Num Radiators").into(),
                enabled: self.needs_cooling(),
                value: self.radiators.len() as i16,
            },
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        self.is_asymmetric = options.is_asymmetric.selected;
        self.set_number_of_engines(options.engines.value as usize);
        self.set_number_of_radiators(options.radiators.value as usize);
    }
}
