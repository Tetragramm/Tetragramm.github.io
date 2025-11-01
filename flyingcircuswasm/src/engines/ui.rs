use super::Engines;
use crate::lu;
use ui_core::*;

/// UI options struct for Engines container
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
                name: lu!("is_asymmetric"),
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
