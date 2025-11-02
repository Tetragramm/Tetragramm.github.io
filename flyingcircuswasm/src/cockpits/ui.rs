use ui_core::{Number, UIBindings};

use super::Cockpits;
use crate::cockpit::CockpitOptions;

/// UI options for the Cockpits container - contains options for each cockpit position
pub struct CockpitsOptions {
    pub num_cockpits: Number,
    pub positions: Vec<CockpitOptions>,
}

impl UIBindings for Cockpits {
    type OptionsType = CockpitsOptions;

    fn create_ui_options(&self) -> CockpitsOptions {
        CockpitsOptions {
            num_cockpits: Number {
                name: t!("Number of Cockpits").to_string(),
                enabled: true,
                value: self.get_number_of_cockpits(),
            },
            positions: self
                .positions
                .iter()
                .map(|cockpit| cockpit.create_ui_options())
                .collect(),
        }
    }

    fn receive_ui_selections(&mut self, options: CockpitsOptions) {
        // Handle changes to the number of cockpits first
        if self.get_number_of_cockpits() != options.num_cockpits.value {
            self.set_number_of_cockpits(options.num_cockpits.value);
        }

        // Then update individual cockpit options
        // Note: positions may have changed size, so we only update those that exist in both
        for (cockpit, cockpit_options) in
            self.positions.iter_mut().zip(options.positions.into_iter())
        {
            cockpit.receive_ui_selections(cockpit_options);
        }
    }
}
