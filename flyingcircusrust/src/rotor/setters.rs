use super::*;

impl Rotor {
    /// Set cantilever material index
    /// TypeScript: SetCantilever(num: number)
    pub fn set_cantilever(&mut self, idx: usize) {
        if idx < self.cantilever_list.len() {
            self.cantilever_idx = idx;
        }
    }

    /// Set rotor thickness (helicopter only, added in 12.55)
    /// TypeScript: SetRotorThickness(num: number)
    pub fn set_rotor_thickness(&mut self, thickness: i16) {
        self.rotor_thickness = thickness.max(0);
    }

    /// Set aircraft type - resets rotor configuration if changed
    /// TypeScript: SetType(new_type: AIRCRAFT_TYPE)
    pub fn set_type(&mut self, new_type: AircraftType) {
        if self.aircraft_type != new_type {
            self.accessory = false;
            self.cantilever_idx = 0;
            self.arrangement_sel = 0;
            self.rotor_count = 1;
            self.aircraft_type = new_type;
            self.rotor_span = 0;
        }
    }

    /// Set rotor count
    /// Enforces even numbers for 2+, rounds up to even if incrementing by 1
    /// TypeScript: SetRotorCount(num: number)
    pub fn set_rotor_count(&mut self, mut count: usize) {
        count = count.max(1);

        // Enforce even numbers for 2+
        if count >= 2 && count % 2 == 1 {
            // If incrementing by 1, round up to even
            if count == self.rotor_count + 1 {
                count += 1;
            } else {
                count -= 1;
            }
        }

        self.rotor_count = count;

        // Reset arrangement for single rotor
        if self.rotor_count < 2 {
            self.arrangement_sel = 0;
        }
    }

    /// Set rotor span (additional span beyond sizing)
    /// TypeScript: SetRotorSpan(num: number)
    pub fn set_rotor_span(&mut self, span: i16) {
        self.rotor_span = span;
    }

    /// Set blade count index
    /// TypeScript: SetBladeCount(idx: number)
    pub fn set_blade_count(&mut self, idx: usize) {
        if idx < self.blade_list.len() {
            self.blade_idx = idx;
        }
    }

    /// Set wing area (for autogyro sizing)
    /// TypeScript: SetWingArea(num: number)
    pub fn set_wing_area(&mut self, area: i16) {
        self.wing_area = area;
    }

    /// Set mass/power ratio (for helicopter sizing)
    /// TypeScript: SetMP(mp: number)
    pub fn set_mass_power(&mut self, mp: f32) {
        self.dry_mass_power = mp;
    }

    /// Set accessory rotor system
    /// TypeScript: SetAccessory(use: boolean)
    pub fn set_accessory(&mut self, use_accessory: bool) {
        self.accessory = use_accessory;
    }

    /// Set engine count (for accessory mass calculation)
    /// TypeScript: SetEngineCount(num: number)
    pub fn set_engine_count(&mut self, count: usize) {
        self.engine_count = count;
    }

    /// Set arrangement/stagger
    /// TypeScript: SetStagger(num: number)
    pub fn set_stagger(&mut self, idx: usize) {
        if idx < self.arrangement_list.len() {
            self.arrangement_sel = idx;
        }
    }
}
