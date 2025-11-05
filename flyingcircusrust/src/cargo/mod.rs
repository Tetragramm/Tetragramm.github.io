use crate::stats::Stats;
use std::rc::Rc;
use ui_core::*;
use ui_macro::UIBindings;

// Sub-module declarations
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;

#[cfg(test)]
mod tests;

// Re-export public API

/// Cargo space entry with stats
#[derive(Clone)]
pub struct CargoSpace {
    pub name: String,
    pub stats: Stats,
}

/// Main Cargo struct
/// Manages cargo/passenger space selection
#[derive(Clone, UIBindings)]
pub struct Cargo {
    // Reference list of available cargo spaces (loaded from JSON)
    cargo_list: Rc<Vec<CargoSpace>>,

    // Selected cargo space index
    #[ui(
        select,
        source = "cargo_list",
        name = "space_sel",
        set_fn = "set_space"
    )]
    space_sel: usize,
}
