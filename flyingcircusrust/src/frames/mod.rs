use crate::stats::Stats;
use std::rc::Rc;

// Sub-module declarations
mod core;
mod json;
mod part;
mod queries;
mod serialization;
mod setters;
mod ui;

#[cfg(test)]
mod tests;

// Re-export public API

/// Frame type entry with stats and properties
#[derive(Clone)]
pub struct FrameEntry {
    pub name: String,
    pub stats: Stats,
    pub basestruct: i16,
    pub basecost: i16,
    pub geodesic: bool,
}

/// Skin type entry with stats and properties
#[derive(Clone)]
pub struct SkinEntry {
    pub name: String,
    pub stats: Stats,
    pub monocoque: bool,
    pub monocoque_structure: i16,
    pub flammable: bool,
    pub dragfactor: f32,
    pub massfactor: f32,
}

/// Tail type entry with stats
#[derive(Clone)]
pub struct TailEntry {
    pub name: String,
    pub stats: Stats,
}

/// Section configuration for fuselage frames
#[derive(Clone, Debug, PartialEq)]
pub struct Section {
    pub frame: usize,
    pub geodesic: bool,
    pub monocoque: bool,
    pub lifting_body: bool,
    pub internal_bracing: bool,
}

/// Main Frames struct
pub struct Frames {
    // Reference lists (loaded from JSON)
    frame_list: Rc<Vec<FrameEntry>>,
    skin_list: Rc<Vec<SkinEntry>>,
    tail_list: Rc<Vec<TailEntry>>,

    // Section arrays
    section_list: Vec<Section>,
    tail_section_list: Vec<Section>,

    // Configuration
    required_sections: usize,
    internal_bracing_count: usize,
    sel_skin: usize,
    sel_tail: usize,
    farman: bool,
    boom: bool,
    has_tractor_nacelles: bool,
    flying_wing: bool,
    is_tandem: bool,
}

impl Frames {
    /// Create a default section
    fn default_section() -> Section {
        Section {
            frame: 0,
            geodesic: false,
            monocoque: false,
            lifting_body: false,
            internal_bracing: false,
        }
    }
}
