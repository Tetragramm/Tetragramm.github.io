use super::{Alter, CustomPart};

impl Alter {
    /// Internal: Calculate sum of absolute values of all stats
    /// Used to determine if a part has meaningful modifications
    pub(super) fn sum_stats_magnitude(&self, stats: &super::Stats) -> f32 {
        stats.drag.abs()
            + stats.mass.abs()
            + stats.wetmass.abs()
            + stats.bomb_mass.abs()
            + stats.cost.abs()
            + stats.upkeep.abs()
            + stats.liftbleed.abs()
            + stats.wingarea.abs()
            + stats.control.abs()
            + stats.pitchstab.abs()
            + stats.latstab.abs()
            + stats.maxstrain.abs()
            + stats.structure.abs()
            + stats.toughness.abs()
            + stats.power.abs()
            + stats.fuelconsumption.abs()
            + stats.fuel.abs()
            + stats.charge.abs()
            + stats.crashsafety.abs()
            + stats.visibility.abs()
            + stats.escape.abs()
            + stats.reliability.abs()
            + stats.warnings.len() as f32
    }
}
