use super::{Alter, CustomPart};

impl Alter {
    /// Clear all custom parts (set quantities to 0)
    /// TypeScript: ClearAll()
    pub fn clear_all(&mut self) {
        for p in &mut self.custom_parts {
            p.qty = 0;
        }
    }

    /// Add or update a custom part
    /// TypeScript: AddPart(name: string, stats: Stats)
    pub fn add_part(&mut self, name: String, stats: super::Stats) {
        // Check if part has meaningful stats
        if self.sum_stats_magnitude(&stats) == 0.0 {
            return;
        }

        // Find existing part or add new one
        let idx = self.custom_parts.iter().position(|p| p.name == name);
        if let Some(idx) = idx {
            self.custom_parts[idx].stats = stats;
        } else {
            self.custom_parts.push(CustomPart {
                name,
                stats,
                qty: 0,
            });
        }

        // Keep list sorted by name
        self.custom_parts.sort_by(|a, b| a.name.cmp(&b.name));
    }

    /// Remove a custom part by name
    /// TypeScript: RemovePart(name: string)
    pub fn remove_part(&mut self, name: &str) {
        if let Some(idx) = self.custom_parts.iter().position(|p| p.name == name) {
            self.custom_parts.remove(idx);
        }
    }

    /// Set the quantity used for a custom part by index
    /// TypeScript: SetUsedPart(idx: number, qty: number)
    pub fn set_used_part(&mut self, idx: usize, qty: i16) {
        if let Some(part) = self.custom_parts.get_mut(idx) {
            part.qty = qty;
        }
    }

    /// Update custom parts from a list, resetting quantities first
    /// TypeScript: fromJSON behavior
    pub(super) fn update_from_list(&mut self, parts: Vec<super::CustomPart>) {
        // Reset all quantities
        for p in &mut self.custom_parts {
            p.qty = 0;
        }

        // Update from provided list
        for incoming_part in parts {
            let idx = self
                .custom_parts
                .iter()
                .position(|p| p.name == incoming_part.name);
            if let Some(idx) = idx {
                self.custom_parts[idx].qty = incoming_part.qty;
                self.custom_parts[idx].stats = incoming_part.stats;
            } else {
                self.custom_parts.push(incoming_part);
            }
        }
    }
}
