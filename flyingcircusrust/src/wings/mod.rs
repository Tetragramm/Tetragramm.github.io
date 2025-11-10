use crate::{aircraft::AircraftType, stats::Stats};
use std::rc::Rc;

// Sub-module declarations
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;
mod ui;
mod validation;

#[cfg(test)]
mod tests;

// Re-export public API

/// Wing deck positions (height)
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum WingDeck {
    Parasol = 0,
    Shoulder = 1,
    Mid = 2,
    Low = 3,
    Gear = 4,
}

/// Individual wing configuration
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct WingType {
    pub surface: usize, // Index into skin_list
    pub area: i16,
    pub span: i16,
    pub dihedral: i16,
    pub anhedral: i16,
    pub gull: bool,
    pub deck: usize, // Index into deck_list (WingDeck enum value)
}

impl WingType {
    /// Create a new default wing
    pub fn new() -> WingType {
        WingType {
            surface: 0,
            area: 3,
            span: 1,
            dihedral: 0,
            anhedral: 0,
            gull: false,
            deck: 0,
        }
    }
}

/// Wing skin/surface material entry
#[derive(Clone)]
pub struct SurfaceEntry {
    pub name: String,
    pub stats: Stats,
    pub flammable: bool,
    pub strainfactor: f32,
    pub dragfactor: f32,
    pub metal: bool,
    pub transparent: bool,
}

/// Stagger configuration entry (monoplane, biplane, tandem, etc.)
#[derive(Clone)]
pub struct StaggerEntry {
    pub name: String,
    pub stats: Stats,
    pub inline: bool,      // Tandem wings (wings one behind the other)
    pub wing_count: usize, // Maximum wings for this configuration
    pub hstab: bool,       // Requires horizontal stabilizer
}

/// Deck (wing height) entry
#[derive(Clone)]
pub struct DeckEntry {
    pub name: String,
    pub stats: Stats,
    pub limited: bool, // Only 1 wing allowed at this deck if true
}

/// Longest wing bonus entry
#[derive(Clone)]
pub struct LongestWingEntry {
    pub stats: Stats,
    pub dragfactor: f32,
}

/// Main Wings struct
/// Manages wing configuration for aircraft
/// NO UIBindings - complex dynamic arrays require manual handling
pub struct Wings {
    // Reference lists (loaded from parts.json)
    skin_list: Rc<Vec<SurfaceEntry>>,
    stagger_list: Rc<Vec<StaggerEntry>>,
    deck_list: Rc<Vec<DeckEntry>>,
    long_list: Rc<Vec<LongestWingEntry>>,

    // Wing configurations (dynamic arrays of WingType)
    wing_list: Vec<WingType>,
    mini_wing_list: Vec<WingType>,

    // Global wing settings
    wing_stagger: usize,
    is_swept: bool,
    is_closed: bool,

    // External state (set by Aircraft)
    plane_mass: f32,
    acft_type: AircraftType,
    rotor_span: i16,
}
