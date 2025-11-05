use super::Engines;
use serde::{Deserialize, Serialize};
use ui_core::*;

/// UI options struct for Engines container
#[derive(Serialize, Deserialize)]
pub struct EnginesOptions {
    pub is_asymmetric: Check,
    pub num_engines: usize,
    pub num_radiators: usize,
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
            num_engines: self.engines.len(),
            num_radiators: self.radiators.len(),
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        self.is_asymmetric = options.is_asymmetric.selected;
        // num_engines and num_radiators are read-only, so we don't update them
    }
}
