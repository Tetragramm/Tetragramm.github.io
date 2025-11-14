use crate::stats::Stats;
use serde::{Deserialize, Serialize};

mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;

/// A custom part definition: name, stats contribution, and quantity used
#[derive(Clone, Serialize, Deserialize)]
pub struct CustomPart {
    pub name: String,
    pub stats: Stats,
    pub qty: i16,
}

/// AlterStats module for managing custom/altered aircraft parts
/// Unlike the TypeScript version, this doesn't use localStorage.
/// Instead, custom parts are provided via the constructor and returned separately.
pub struct Alter {
    /// List of all defined custom parts
    pub custom_parts: Vec<CustomPart>,
}

impl Alter {
    /// Create a new Alter with custom parts
    /// TypeScript: constructor with localStorage loading
    /// Rust: explicit constructor accepting part list
    pub fn new(custom_parts: Vec<CustomPart>) -> Alter {
        Alter { custom_parts }
    }

    /// Returns the list of custom parts for external storage/management
    /// This allows the UI/storage layer to manage persistence
    pub fn get_custom_parts_list(&self) -> Vec<CustomPart> {
        self.custom_parts.clone()
    }
}
