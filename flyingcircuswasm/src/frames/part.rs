use super::*;
use crate::part::{ElectricsMessage, Part};
use crate::stats::{rtz, Warning, WarningLevel, ERA};

impl Frames {
    /// Calculate stats for a single section
    fn section_stats(&self, sec: &Section) -> Stats {
        let mut stats = Stats::new();

        // Add frame stats
        stats = stats.add(&self.frame_list[sec.frame].stats);

        // Geodesic modifications
        if sec.geodesic {
            stats.structure *= 1.5;
            stats.cost *= 2.0;
            stats.eras.push(crate::stats::Era {
                name: t!("Geodesic").to_string(),
                era: ERA::ComingStorm,
            });
        }

        // Lifting body adds wing area
        if sec.lifting_body {
            stats.wingarea += 3.0;
        }

        // Internal bracing sections have no skin
        if !sec.internal_bracing {
            stats.drag += 4.0;

            // Monocoque modifications
            if sec.monocoque {
                stats.mass = 0.0;
                stats.cost += 1.0;
                stats.structure = self.skin_list[self.sel_skin].monocoque_structure as f64;
            }

            // Add skin stats
            stats = stats.add(&self.skin_list[self.sel_skin].stats);
        }

        stats
    }

    /// Calculate stats for a single tail section
    fn tail_section_stats(&self, sec: &Section) -> Stats {
        let mut stats = Stats::new();

        // Add frame stats
        stats = stats.add(&self.frame_list[sec.frame].stats);

        // Geodesic modifications
        if sec.geodesic {
            stats.structure *= 1.5;
            stats.cost *= 2.0;
            stats.eras.push(crate::stats::Era {
                name: t!("Geodesic").to_string(),
                era: ERA::ComingStorm,
            });
        }

        // Lifting body adds wing area
        if sec.lifting_body {
            stats.wingarea += 3.0;
        }

        // Tail sections always have drag
        stats.drag += 4.0;

        // Farman tails have no skin
        if !self.farman {
            // Monocoque modifications
            if sec.monocoque {
                stats.mass = 0.0;
                stats.cost += 1.0;
                stats.structure = self.skin_list[self.sel_skin].monocoque_structure as f64;
            }

            // Add skin stats
            stats = stats.add(&self.skin_list[self.sel_skin].stats);
        }

        stats
    }
}

impl Part for Frames {
    fn part_stats(&mut self) -> Stats {
        // Disable flying wing if not possible
        if !self.can_flying_wing() {
            self.flying_wing = false;
        }

        let mut stats = Stats::new();

        // Set base structure and cost from most common frame type
        let base_type = self.base_type();
        stats.structure = self.frame_list[base_type].basestruct as f64;
        stats.cost = self.frame_list[base_type].basecost as f64;

        // Check if all sections are clinker-built (all internal bracing or monocoque)
        let mut is_clinker = self.skin_list[self.sel_skin].monocoque_structure < 0;

        // Add main section stats
        for sec in &self.section_list {
            stats = stats.add(&self.section_stats(sec));
            is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
        }

        // Calculate tail stats separately for boom tail handling
        let mut tail_stats = Stats::new();
        for sec in &self.tail_section_list {
            tail_stats = tail_stats.add(&self.tail_section_stats(sec));
            if !self.farman {
                is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
            }
        }

        // Add clinker bonus
        if is_clinker {
            stats.structure += 30.0;
        }

        // Add tail type stats
        stats = stats.add(&self.tail_list[self.sel_tail].stats);

        // Boom tail modifications
        if self.boom {
            tail_stats.maxstrain -= tail_stats.mass;
            if !self.has_tractor_nacelles {
                tail_stats.drag = rtz(1.0e-6 + 1.5 * tail_stats.drag);
            }
        }

        // Apply skin factors and merge tail stats
        if self.farman {
            // For farman: apply skin factors first, then add tail
            stats.drag *= self.skin_list[self.sel_skin].dragfactor;
            stats.mass *= self.skin_list[self.sel_skin].massfactor;
            stats.visibility += self.tail_section_list.len() as f64;
            tail_stats.mass = rtz(1.0e-6 + 0.5 * tail_stats.mass);
            stats = stats.add(&tail_stats);
        } else {
            // For normal: add tail first, then apply skin factors
            stats = stats.add(&tail_stats);
            stats.drag *= self.skin_list[self.sel_skin].dragfactor;
            stats.mass *= self.skin_list[self.sel_skin].massfactor;
        }

        // Lifting body and flying wing
        let lb_count = self.count_lifting_body();
        stats.cost += lb_count as f64;

        if self.flying_wing {
            stats.liftbleed += 5.0;
        } else {
            stats.drag += lb_count as f64;
        }

        // Warning if not enough lifting body sections
        if self.possible_remove_sections() && self.count_main_lifting_body() < self.count_sections()
        {
            stats.warnings.push(Warning {
                name: t!("Frame Count").to_string(),
                warning: t!("Frame Count Warning").to_string(),
                level: WarningLevel::Yellow,
            });
        }

        // Round values
        stats.structure = rtz(stats.structure);
        stats.cost = rtz(stats.cost);
        stats.visibility = stats.visibility.min(3.0);

        stats.round();

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        ElectricsMessage::new()
    }
}
