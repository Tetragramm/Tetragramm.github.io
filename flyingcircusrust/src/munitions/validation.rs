use super::*;

impl Munitions {
    /// Limit munitions mass based on aircraft structure and configuration
    /// TypeScript: LimitMass()
    ///
    /// Returns true if modifications were made
    ///
    /// Enforces two limits:
    /// 1. Internal: min(internal_capacity, 3 * struct * maxbomb)
    /// 2. External: (struct * maxbomb - internal/3) * gull_factor
    pub(super) fn limit_mass(&mut self) -> bool {
        let mut reduce = false;

        let allowed_internal = self
            .get_internal_bomb_count()
            .min((3.0 * self.acft_struct * self.maxbomb) as i16);

        let mut ib = 0; // internal bombs
        let mut ir = 0; // internal rockets
        let mut eb; // external bombs
        let mut er; // external rockets

        // Fit bombs internally first
        if self.bomb_count > allowed_internal {
            ib = allowed_internal;
        } else {
            ib = self.bomb_count;
        }

        // Fit rockets internally
        if self.rocket_count + ib > allowed_internal {
            ir = allowed_internal - ib;
        } else {
            ir = self.rocket_count;
        }

        eb = self.bomb_count - ib;
        er = self.rocket_count - ir;

        // Calculate external capacity
        let allowed_external =
            ((self.acft_struct * self.maxbomb - (ib + ir) as f32 / 3.0) * self.gull_factor) as i16;

        // Reduce external munitions if over limit
        while eb + er > allowed_external {
            if er > 0 {
                er -= 1;
            } else {
                eb -= 1;
            }
        }

        let ibeb = (ib + eb).max(0);
        if self.bomb_count > ibeb {
            reduce = true;
            self.bomb_count = ibeb;
        }

        let irer = (ir + er).max(0);
        if self.rocket_count > irer {
            reduce = true;
            self.rocket_count = irer;
        }

        reduce
    }
}
