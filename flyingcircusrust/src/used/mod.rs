use crate::part::ElectricsMessage;
use crate::part::Part;
use crate::stats::Stats;

mod json;
mod serialization;
mod ui;

/// Aircraft condition modifiers (damage, wear, maintenance state)
/// Each modifier is normalized to range [-1, 1] where:
/// - Positive values represent penalties (damage/wear)
/// - Negative values represent benefits (improvements/repairs)
#[derive(Clone, Debug)]
pub struct Used {
    /// Engine burnt out condition
    pub burnt_out: i16,
    /// Airframe ragged/worn condition (affects max speed)
    pub ragged: i16,
    /// Aircraft heavy condition (affects stall speed)
    pub hefty: i16,
    /// Weapons jam frequently
    pub sticky_guns: i16,
    /// Structural weakness (affects toughness)
    pub weak: i16,
    /// Structural fragility (affects max strain)
    pub fragile: i16,
    /// Fuel/fluid leaks (affects fuel uses)
    pub leaky: i16,
    /// Poor performance/responsiveness (affects handling)
    pub sluggish: i16,
}

impl Used {
    /// Create a new Used struct with all modifiers set to 0 (default/no damage)
    pub fn new() -> Used {
        Used {
            burnt_out: 0,
            ragged: 0,
            hefty: 0,
            sticky_guns: 0,
            weak: 0,
            fragile: 0,
            leaky: 0,
            sluggish: 0,
        }
    }

    /// Check if all modifiers are at default (0) values
    /// TypeScript: IsDefault()
    pub fn is_default(&self) -> bool {
        self.burnt_out.abs()
            + self.ragged.abs()
            + self.hefty.abs()
            + self.sticky_guns.abs()
            + self.weak.abs()
            + self.fragile.abs()
            + self.leaky.abs()
            + self.sluggish.abs()
            == 0
    }

    /// Reset all modifiers to 0 (default state)
    /// TypeScript: SetEnabled(use: boolean) - when use is false
    pub fn clear_all(&mut self) {
        self.burnt_out = 0;
        self.ragged = 0;
        self.hefty = 0;
        self.sticky_guns = 0;
        self.weak = 0;
        self.fragile = 0;
        self.leaky = 0;
        self.sluggish = 0;
    }

    /// Normalize a value to [-1, 1] range
    /// Handles NaN, clamps to min/max, and floors floating point
    /// TypeScript: Normalize(num: number)
    fn normalize(num: i16) -> i16 {
        // Clamp to [-1, 1]
        num.max(-1).min(1)
    }

    /// Trigger normalization of all values
    /// TypeScript: TriggerCS()
    pub fn trigger_cs(&mut self) {
        self.burnt_out = Self::normalize(self.burnt_out);
        self.ragged = Self::normalize(self.ragged);
        self.hefty = Self::normalize(self.hefty);
        self.sticky_guns = Self::normalize(self.sticky_guns);
        self.weak = Self::normalize(self.weak);
        self.fragile = Self::normalize(self.fragile);
        self.leaky = Self::normalize(self.leaky);
        self.sluggish = Self::normalize(self.sluggish);
    }
}

impl Default for Used {
    fn default() -> Self {
        Self::new()
    }
}

impl Part for Used {
    fn part_stats(&mut self) -> Stats {
        // Normalize all values
        self.trigger_cs();
        // Used doesn't contribute any base stats
        Stats::new()
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}
