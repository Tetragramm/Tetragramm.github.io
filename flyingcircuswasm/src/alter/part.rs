use super::Alter;
use crate::part::{ElectricsMessage, Equipment, Part};
use crate::stats::Stats;

impl Part for Alter {
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();
        for part in &self.custom_parts {
            if part.qty > 0 {
                let mut pstats = part.stats.clone();
                pstats = pstats.multiply(part.qty as f64);
                stats = stats.add(&pstats);
            }
        }
        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        let mut em = ElectricsMessage::new();

        for part in &self.custom_parts {
            if part.qty > 0 && part.stats.charge != 0.0 {
                let charge = (part.stats.charge * part.qty as f64).to_string();
                em.equipment.push(Equipment {
                    source: part.name.clone(),
                    charge,
                });
            }
        }

        em
    }
}
