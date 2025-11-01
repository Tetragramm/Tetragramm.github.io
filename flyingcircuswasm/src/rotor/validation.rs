use super::*;

impl Rotor {
    /// Verify and auto-calculate rotor sizes based on aircraft type
    /// TypeScript: VerifySizes()
    pub(super) fn verify_sizes(&mut self) {
        match self.aircraft_type {
            AircraftType::Airplane => {
                // Airplanes have no rotors
                self.rotor_count = 0;
                self.rotor_span = 0;
                self.arrangement_sel = 0;
            }
            AircraftType::Autogyro => {
                // Autogyros always have 1 rotor
                self.rotor_count = 1;
                self.arrangement_sel = 0;

                // Auto-size based on wing area: sizing_span = sqrt((0.6 * wing_area) / (PI / 8))
                if self.wing_area > 0 {
                    self.sizing_span =
                        ((0.6 * self.wing_area as f64) / (std::f64::consts::PI / 8.0))
                            .sqrt()
                            .ceil() as i16;
                } else {
                    self.sizing_span = 10; // Default
                }

                // Ensure rotor_span is at least enough to reach span 2
                self.rotor_span = self.rotor_span.max(2 - self.sizing_span);
            }
            AircraftType::Helicopter => {
                // Ensure at least 1 rotor
                self.rotor_count = self.rotor_count.max(1);

                // Enforce even numbers for 2+
                if self.rotor_count > 1 && self.rotor_count % 2 == 1 {
                    self.rotor_count -= 1;
                }

                // Auto-size based on mass/power if set
                if self.dry_mass_power > 0.0 {
                    let blade_sizing = self.blade_list[self.blade_idx].sizing;

                    if self.rotor_count == 1 {
                        // Single rotor: sizing = MP^(1/2.5) * 5 * blade_sizing
                        self.sizing_span = (self.dry_mass_power.powf(1.0 / 2.5) * 5.0 * blade_sizing)
                            .ceil() as i16;
                    } else {
                        // Multiple rotors: sizing = MP^(1/2.5) * 4 * blade_sizing
                        self.sizing_span = (self.dry_mass_power.powf(1.0 / 2.5) * 4.0 * blade_sizing)
                            .ceil() as i16;
                    }

                    // Cap at 100
                    self.sizing_span = self.sizing_span.min(100);

                    // Ensure rotor_span is at least -sizing_span/2
                    self.rotor_span = self.rotor_span.max(-(self.sizing_span as f64 / 2.0).floor() as i16);
                } else {
                    // Default sizing if MP not set
                    self.sizing_span = 10;
                }
            }
            _ => {
                // Other types (ornithopters, etc.) have no rotors
                self.rotor_count = 0;
                self.rotor_span = 0;
                self.arrangement_sel = 0;
            }
        }
    }

    /// Verify arrangement matches rotor count
    /// TypeScript: VerifyStagger()
    pub(super) fn verify_stagger(&mut self) {
        let current_count = self.arrangement_list[self.arrangement_sel].count;

        // Check if current arrangement is valid
        let is_valid = if self.rotor_count > 2 {
            current_count == 3
        } else if self.rotor_count == 2 {
            current_count == 2
        } else {
            current_count == 1
        };

        if !is_valid {
            // Find appropriate arrangement
            let target_count = if self.rotor_count > 2 {
                3
            } else if self.rotor_count == 2 {
                2
            } else {
                1
            };

            for (i, arr) in self.arrangement_list.iter().enumerate() {
                if arr.count == target_count {
                    self.arrangement_sel = i;
                    break;
                }
            }
        }
    }

    /// Run all validation checks
    pub(super) fn verify_all(&mut self) {
        self.verify_sizes();
        self.verify_stagger();
    }
}
