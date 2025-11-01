use super::*;
use crate::part::Part;

impl Part for Optimization {
    /// Calculate stats contribution from optimization
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Cost optimization: reduces cost by 10% of aircraft cost per dot
        stats.cost = (-(self.cost as f64 * self.acft_stats.cost / 10.0) + 1e-6).floor();

        // Bleed optimization: reduces liftbleed by 3 per dot
        stats.liftbleed = (-(self.bleed as f64) * 3.0 + 1e-6).floor();

        // Escape optimization: improves escape and visibility
        stats.escape = self.escape as f64;
        stats.visibility = self.escape as f64;

        // Mass optimization: reduces mass by 10% of aircraft mass per dot
        stats.mass = (-(self.mass as f64 * self.acft_stats.mass / 10.0) + 1e-6).floor();

        // Toughness optimization: increases toughness by 25% of aircraft toughness per dot
        stats.toughness = ((self.toughness as f64 * self.acft_stats.toughness / 4.0) + 1e-6).floor();

        // Maxstrain optimization gets applied later in derived stats
        // stats.maxstrain = ((self.maxstrain as f64 * 1.5 * self.acft_stats.maxstrain / 10.0) + 1e-6).floor();

        // Reliability optimization: +2 per dot
        stats.reliability = self.reliability as f64 * 2.0;

        // Drag optimization: reduces drag by 10% of aircraft drag per dot
        stats.drag = (-(self.drag as f64 * self.acft_stats.drag / 10.0) + 1e-6).floor();

        stats
    }

    /// Get electrics contribution (none for optimization)
    /// TypeScript: GetElectrics()
    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        crate::part::ElectricsMessage {
            storage: 0,
            equipment: Vec::new(),
        }
    }
}
