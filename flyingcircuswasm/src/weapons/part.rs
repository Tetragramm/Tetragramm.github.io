use super::*;
use crate::part::{ElectricsMessage, Equipment, Part};
use crate::stats::{Warning, WarningLevel};
use crate::weapon::ProjectileType;

impl Part for Weapons {
    /// Calculate and return weapons stats contribution
    /// TypeScript: PartStats()
    fn part_stats(&mut self) -> Stats {
        let mut stats = Stats::new();

        // Clean up freely accessible weapons
        self.clean_freely_accessible();

        // Remove excess spinners
        while self.count_arty_tractor_spinner() > self.tractor_arty_spinner_count {
            self.remove_one_arty_tractor_spinner();
        }
        while self.count_tractor_spinner() > self.tractor_spinner_count {
            self.remove_one_tractor_spinner();
        }
        while self.count_arty_pusher_spinner() > self.pusher_arty_spinner_count {
            self.remove_one_arty_pusher_spinner();
        }
        while self.count_pusher_spinner() > self.pusher_spinner_count {
            self.remove_one_pusher_spinner();
        }

        // Calculate wing reinforcement limits
        let (wing_size, max_wing_size) = match self.cant_type {
            0 => (4, 2),
            1 => (8, 4),
            _ => (16, 8),
        };

        // Create list of every weapon size and a ref to the weapon
        struct WeaponSize {
            total: i16,
            count: i16,
            sz: i16,
            ws_idx: usize,
            w_idx: usize,
        }

        let mut slist: Vec<WeaponSize> = Vec::new();

        // Clear all wing reinforcement flags first
        for ws in &mut self.weapon_sets {
            for w in ws.get_weapons_mut() {
                w.wing_reinforcement = false;
            }
        }

        // Build list of wing-mounted weapons
        for (ws_idx, ws) in self.weapon_sets.iter().enumerate() {
            for (w_idx, w) in ws.get_weapons().iter().enumerate() {
                if w.get_wing() {
                    let count = w.get_count();
                    let sz = self.weapon_list[ws.get_weapon_selected()].size;
                    let total = count * sz;
                    slist.push(WeaponSize {
                        total,
                        count,
                        sz,
                        ws_idx,
                        w_idx,
                    });
                }
            }
        }

        // Sort by size to reinforce as few weapons as possible
        slist.sort_by(|a, b| a.total.cmp(&b.total));

        let mut wing_size_remaining = wing_size;
        for s in &slist {
            if wing_size_remaining >= 0 {
                if max_wing_size < s.sz {
                    self.weapon_sets[s.ws_idx].get_weapons_mut()[s.w_idx].wing_reinforcement = true;
                } else {
                    wing_size_remaining -= s.total;
                }
            }
            if wing_size_remaining < 0 {
                self.weapon_sets[s.ws_idx].get_weapons_mut()[s.w_idx].wing_reinforcement = true;
            }
        }

        // Pre-calculate spinner availability (to avoid borrow checker issues)
        let can_tractor_spinner = self.can_tractor_spinner();
        let can_arty_tractor_spinner = self.can_arty_tractor_spinner();
        let can_pusher_spinner = self.can_pusher_spinner();
        let can_arty_pusher_spinner = self.can_arty_pusher_spinner();
        let has_cantilever = self.cant_type > 0;

        // Aggregate stats from all weapon systems
        for ws in &mut self.weapon_sets {
            ws.set_tractor_pusher(
                self.has_tractor,
                can_tractor_spinner,
                can_arty_tractor_spinner,
                self.has_pusher,
                can_pusher_spinner,
                can_arty_pusher_spinner,
                self.isheli,
            );
            ws.has_cantilever = has_cantilever;
            stats = stats.add(&ws.part_stats());
        }

        // Weapon braces cost 1/3 (should always be multiple of 3)
        stats.cost += (self.brace_count as f64) / 3.0;
        if self.brace_count > 0 {
            stats.warnings.push(Warning {
                name: t!("Weapons Braces").to_string(),
                warning: t!("Weapons Braces Warning").to_string(),
                level: WarningLevel::White,
            });
        }

        // Wing-tip weight: -1 control for every 5 mass
        stats.control -= (1.0e-6 + self.get_wing_weight() / 5.0).floor();

        stats
    }

    fn get_electrics(&self) -> ElectricsMessage {
        let mut msg = ElectricsMessage::new();

        for (i, set) in self.weapon_sets.iter().enumerate() {
            if set.get_projectile() == ProjectileType::Heatray || set.is_lightning_arc() {
                let charges = set.get_hr_charges();
                // Negate the values for display
                let charge_str = charges
                    .iter()
                    .map(|c| (-c).to_string())
                    .collect::<Vec<String>>()
                    .join("/");

                msg.equipment.push(Equipment {
                    source: format!(
                        "{} {} {}",
                        t!("Vital Part Weapon Set").to_string(),
                        i + 1,
                        set.get_final_weapon().name
                    ),
                    charge: charge_str,
                });
            }
        }

        msg
    }
}
