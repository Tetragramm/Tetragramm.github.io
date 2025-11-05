use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SelectOpt {
    pub name: String,
    pub enabled: bool,
}

#[derive(Serialize, Deserialize)]
pub struct Select {
    pub enabled: bool,
    pub options: Vec<SelectOpt>,
    pub selected: usize,
}

#[derive(Serialize, Deserialize)]
pub struct Number {
    pub name: String,
    pub enabled: bool,
    pub value: i16,
}

#[derive(Serialize, Deserialize)]
pub struct Check {
    pub name: String,
    pub enabled: bool,
    pub selected: bool,
}

pub trait UIBindings {
    type OptionsType;
    fn create_ui_options(&self) -> Self::OptionsType;
    fn receive_ui_selections(&mut self, options: Self::OptionsType);
}
