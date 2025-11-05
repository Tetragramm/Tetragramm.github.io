/// Shared type definitions used across multiple modules

/// Aircraft type enum matching TypeScript AIRCRAFT_TYPE
/// Used by aircraft, propeller, and other components
#[derive(PartialEq, Eq, Clone, Copy, Debug)]
pub enum AircraftType {
    Airplane = 0,
    Helicopter = 1,
    Autogyro = 2,
    OrnithopterBasic = 3,
    OrnithopterFlutter = 4,
    OrnithopterBuzzer = 5,
}

impl From<i16> for AircraftType {
    fn from(value: i16) -> Self {
        match value {
            0 => AircraftType::Airplane,
            1 => AircraftType::Helicopter,
            2 => AircraftType::Autogyro,
            3 => AircraftType::OrnithopterBasic,
            4 => AircraftType::OrnithopterFlutter,
            5 => AircraftType::OrnithopterBuzzer,
            _ => AircraftType::Airplane, // Default fallback
        }
    }
}

impl From<AircraftType> for i16 {
    fn from(value: AircraftType) -> Self {
        value as i16
    }
}

impl AircraftType {
    /// Check if the aircraft is any type of ornithopter
    pub fn is_any_ornithopter(&self) -> bool {
        matches!(
            self,
            AircraftType::OrnithopterBasic
                | AircraftType::OrnithopterFlutter
                | AircraftType::OrnithopterBuzzer
        )
    }
}

/// Derived stats calculated from base aircraft stats
/// TypeScript: DerivedStats type
/// These are performance and handling characteristics calculated from base stats
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct DerivedStats {
    pub dry_mp: i16,         // Dry Mass Points
    pub wet_mp: i16,         // Wet Mass Points
    pub wet_mp_w_bombs: i16, // Wet MP with bombs
    pub dp_empty: i16,       // Drag Points empty
    pub dp_full: i16,        // Drag Points full
    pub dp_w_bombs: i16,     // Drag Points with bombs
    pub max_speed_empty: i16,
    pub max_speed_full: i16,
    pub max_speed_w_bombs: i16,
    pub stall_speed_empty: i16,
    pub stall_speed_full: i16,
    pub stall_speed_full_w_bombs: i16,
    pub overspeed: f32,
    pub boost_empty: i16,
    pub boost_full: i16,
    pub boost_full_w_bombs: i16,
    pub dropoff: i16,
    pub stability: i16, // Note: TypeScript has typo "Stabiilty"
    pub handling_empty: i16,
    pub handling_full: i16,
    pub handling_full_w_bombs: i16,
    pub max_strain: i16,
    pub toughness: i16,
    pub structure: i16,
    pub energy_loss: i16,
    pub energy_loss_w_bombs: i16,
    pub turn_bleed: i16,
    pub turn_bleed_w_bombs: i16,
    pub fuel_uses: i16,
    pub control_stress: i16,
    pub rumble_stress: i16,
    pub rate_of_climb_full: i16,
    pub rate_of_climb_empty: i16,
    pub rate_of_climb_w_bombs: i16,
}
