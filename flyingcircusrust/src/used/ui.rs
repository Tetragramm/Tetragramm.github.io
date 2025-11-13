use super::Used;
use serde::Serialize;
use ui_core::*;

#[derive(Serialize)]
pub struct UsedUIOptions {
    pub burnt_out: NumberInput,
    pub ragged: NumberInput,
    pub hefty: NumberInput,
    pub sticky_guns: NumberInput,
    pub weak: NumberInput,
    pub fragile: NumberInput,
    pub leaky: NumberInput,
    pub sluggish: NumberInput,
}

impl UIBindings for Used {
    type OptionsType = UsedUIOptions;

    fn create_ui_options(&self) -> Self::OptionsType {
        UsedUIOptions {
            burnt_out: NumberInput {
                name: "Used Burnt Out".to_string(),
                value: self.burnt_out,
                enabled: true,
            },
            ragged: NumberInput {
                name: "Used Ragged".to_string(),
                value: self.ragged,
                enabled: true,
            },
            hefty: NumberInput {
                name: "Used Hefty".to_string(),
                value: self.hefty,
                enabled: true,
            },
            sticky_guns: NumberInput {
                name: "Used Sticky Guns".to_string(),
                value: self.sticky_guns,
                enabled: true,
            },
            weak: NumberInput {
                name: "Used Weak".to_string(),
                value: self.weak,
                enabled: true,
            },
            fragile: NumberInput {
                name: "Used Fragile".to_string(),
                value: self.fragile,
                enabled: true,
            },
            leaky: NumberInput {
                name: "Used Leaky".to_string(),
                value: self.leaky,
                enabled: true,
            },
            sluggish: NumberInput {
                name: "Used Sluggish".to_string(),
                value: self.sluggish,
                enabled: true,
            },
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        self.burnt_out = options.burnt_out.value;
        self.ragged = options.ragged.value;
        self.hefty = options.hefty.value;
        self.sticky_guns = options.sticky_guns.value;
        self.weak = options.weak.value;
        self.fragile = options.fragile.value;
        self.leaky = options.leaky.value;
        self.sluggish = options.sluggish.value;
        self.trigger_cs();
    }
}
