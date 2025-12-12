use super::*;
use std::f32::consts::PI;

impl Rotor {
    /// Get the blade count list
    /// TypeScript: GetBladeList()
    pub fn get_blade_list(&self) -> Rc<Vec<BladeEntry>> {
        self.blade_list.clone()
    }

    /// Get current blade count index
    /// TypeScript: GetBladeCountIdx()
    pub fn get_blade_count_idx(&self) -> usize {
        self.blade_idx
    }

    /// Get the arrangement/stagger list
    /// TypeScript: GetStaggerList()
    pub fn get_stagger_list(&self) -> Rc<Vec<ArrangementEntry>> {
        self.arrangement_list.clone()
    }

    /// Get current arrangement selection
    /// TypeScript: GetStagger()
    pub fn get_stagger(&self) -> usize {
        self.arrangement_sel
    }

    /// Get cantilever material list
    /// TypeScript: GetCantileverList()
    pub fn get_cantilever_list(&self) -> Rc<Vec<CantileverEntry>> {
        self.cantilever_list.clone()
    }

    /// Get current cantilever material index
    /// TypeScript: GetCantilever()
    pub fn get_cantilever(&self) -> usize {
        self.cantilever_idx
    }

    /// Get aircraft type
    /// TypeScript: GetType()
    pub fn get_type(&self) -> AircraftType {
        self.aircraft_type
    }

    /// Get rotor count
    /// TypeScript: GetRotorCount()
    pub fn get_rotor_count(&self) -> usize {
        self.rotor_count
    }

    /// Check if rotor count can be modified (helicopters only)
    /// TypeScript: CanRotorCount()
    pub fn can_rotor_count(&self) -> bool {
        self.aircraft_type == AircraftType::Helicopter
    }

    /// Get rotor span (additional span beyond sizing)
    /// TypeScript: GetRotorSpan()
    pub fn get_rotor_span(&self) -> i16 {
        self.rotor_span
    }

    /// Check if rotor span can be modified (helicopters only)
    /// TypeScript: CanRotorSpan()
    pub fn can_rotor_span(&self) -> bool {
        self.aircraft_type == AircraftType::Helicopter
    }

    /// Get rotor thickness (helicopter only)
    /// TypeScript: GetRotorThickness()
    pub fn get_rotor_thickness(&self) -> i16 {
        self.rotor_thickness
    }

    /// Get accessory status
    /// TypeScript: GetAccessory()
    pub fn get_accessory(&self) -> bool {
        self.accessory
    }

    /// Get sizing span (calculated based on mass/power)
    /// TypeScript: GetSizingSpan()
    pub fn get_sizing_span(&self) -> i16 {
        self.sizing_span
    }

    /// Check if aircraft has tail rotor (single rotor helicopter)
    /// TypeScript: GetTailRotor()
    pub fn get_tail_rotor(&self) -> bool {
        self.aircraft_type == AircraftType::Helicopter && self.rotor_count < 2
    }

    /// Check if tandem configuration is possible (2+ rotor helicopter)
    /// TypeScript: CanTandem()
    pub fn can_tandem(&self) -> bool {
        self.aircraft_type == AircraftType::Helicopter && self.rotor_count > 1
    }

    /// Get which arrangements are valid for current rotor count
    /// TypeScript: CanStagger()
    pub fn can_stagger(&self) -> Vec<bool> {
        self.arrangement_list
            .iter()
            .map(|arr| {
                if self.rotor_count == 1 && arr.count == 1 {
                    true
                } else if self.rotor_count == 2 && arr.count == 2 {
                    true
                } else if self.rotor_count >= 2 && arr.count == 3 {
                    true
                } else {
                    false
                }
            })
            .collect()
    }

    /// Get rotor bleed for helicopters
    /// TypeScript: GetRotorBleed()
    pub fn get_rotor_bleed(&self) -> i16 {
        if self.aircraft_type == AircraftType::Helicopter {
            self.blade_list[self.blade_idx].rotor_bleed
        } else {
            0
        }
    }

    /// Get power factor from arrangement
    /// TypeScript: GetPowerFactor()
    pub fn get_power_factor(&self) -> f32 {
        self.arrangement_list[self.arrangement_sel].powerfactor
    }

    /// Calculate rotor area
    /// TypeScript: GetRotorArea()
    pub fn get_rotor_area(&self) -> f32 {
        let total_span = (self.sizing_span + self.rotor_span) as f32;
        (PI / 9.0) * total_span * total_span
    }

    /// Calculate ideal rotor area (without additional span)
    /// TypeScript: GetIdealRotorArea()
    pub fn get_ideal_rotor_area(&self) -> f32 {
        let span = self.sizing_span as f32;
        (PI / 9.0) * span * span
    }

    /// Calculate rotor drag
    /// TypeScript: GetRotorDrag()
    pub fn get_rotor_drag(&self) -> i16 {
        if self.aircraft_type == AircraftType::Helicopter
            || self.aircraft_type == AircraftType::Autogyro
        {
            let area = self.get_rotor_area();
            let total_span = (self.sizing_span + self.rotor_span) as f32;

            if self.rotor_count == 1 {
                (6.0 * area * area / (total_span * total_span)).floor() as i16
            } else {
                let single_drag = (6.0 * area * area / (total_span * total_span)).floor();
                (0.75 * self.rotor_count as f32 * single_drag).floor() as i16
            }
        } else {
            0
        }
    }

    /// Calculate rotor strain for cantilever calculations
    /// TypeScript: GetRotorStrain()
    pub(super) fn get_rotor_strain(&self) -> f32 {
        let area = self.get_rotor_area().floor();
        let span_sum = (self.sizing_span + self.rotor_span) as f32;
        let base_strain = (2.0 * span_sum + area - 10.0).max(1.0);
        self.rotor_count as f32 * base_strain
    }
}
