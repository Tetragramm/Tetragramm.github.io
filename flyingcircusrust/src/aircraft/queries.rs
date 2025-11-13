/// Query methods for Aircraft that forward to sub-components
/// These methods provide a unified interface for accessing aircraft data
use super::*;
use crate::part::{merge_electrics, ElectricsMessage};

impl Aircraft {
    /// Check if used modifiers are at default (no damage/wear)
    /// TypeScript: GetUsed().IsDefault()
    pub fn get_used_is_default(&self) -> bool {
        self.used.is_default()
    }

    /// Get the name of the currently selected era
    /// TypeScript: GetEra().GetSelectedText()
    pub fn get_era_text(&self) -> String {
        self.era.get_selected_text()
    }

    /// Check if aircraft has flammable components
    /// TypeScript: GetIsFlammable()
    /// Returns true if frames, wings, or engines are flammable
    pub fn get_is_flammable(&self) -> bool {
        self.frames.get_is_flammable()
            || self.wings.is_flammable()
            || self.engines.get_is_flammable()
    }

    /// Get landing gear type name
    /// TypeScript: GetGearName()
    pub fn get_gear_name(&self) -> String {
        self.gear.get_gear_name()
    }

    /// Get minimum operational altitude
    /// TypeScript: GetMinAltitude()
    /// Returns the maximum of all engine minimum altitudes (most restrictive)
    pub fn get_min_altitude(&self) -> i16 {
        self.engines.get_min_altitude()
    }

    /// Get maximum operational altitude
    /// TypeScript: GetMaxAltitude()
    /// Returns the minimum of all engine maximum altitudes (most restrictive)
    pub fn get_max_altitude(&self) -> i16 {
        self.engines.get_max_altitude()
    }

    /// Get reliability strings from all engines
    /// TypeScript: GetReliabilityList()
    pub fn get_reliability_list(&self) -> Vec<String> {
        self.engines.get_reliability_list()
    }

    /// Get escape values from all cockpit positions
    /// TypeScript: GetEscapeList()
    pub fn get_escape_list(&self) -> Vec<i16> {
        self.cockpits.get_escape_list()
    }

    /// Get flight stress values from all cockpit positions
    /// TypeScript: GetStressList()
    /// Returns a vector of (non_copilot_stress, copilot_stress) tuples
    pub fn get_stress_list(&self) -> Vec<(i16, i16)> {
        self.cockpits.get_stress_list()
    }

    /// Get visibility values from all cockpit positions
    /// TypeScript: GetVisibilityList()
    pub fn get_visibility_list(&self) -> Vec<i16> {
        self.cockpits.get_visibility_list()
    }

    /// Get attack modifier values from all cockpit positions
    /// TypeScript: GetAttackList()
    pub fn get_attack_list(&self) -> Vec<i16> {
        self.cockpits.get_attack_list()
    }

    /// Get communication system name
    /// TypeScript: GetCommunicationName()
    pub fn get_communication_name(&self) -> String {
        self.accessories.communication_name()
    }

    /// Get number of cockpit positions
    /// TypeScript: GetCockpits().GetNumberOfCockpits()
    pub fn get_cockpits_count(&self) -> i16 {
        self.cockpits.get_number_of_cockpits()
    }

    /// Get total passenger capacity (seats + beds)
    /// TypeScript: GetPassengers().GetSeats() + GetPassengers().GetBeds()
    pub fn get_passengers_count(&self) -> i16 {
        self.passengers.get_seats() + self.passengers.get_beds()
    }

    /// Get electrical systems data
    /// TypeScript: GetElectrics()
    /// Returns aggregated electrics from all parts via the Part trait
    pub fn get_electrics(&self) -> ElectricsMessage {
        let mut em = ElectricsMessage::new();

        // Aggregate electrics from all parts (same order as TypeScript)
        em = merge_electrics(em, self.accessories.get_electrics());
        em = merge_electrics(em, self.wings.get_electrics());
        em = merge_electrics(em, self.cockpits.get_electrics());
        em = merge_electrics(em, self.alter.get_electrics());
        em = merge_electrics(em, self.cargo.get_electrics());
        em = merge_electrics(em, self.era.get_electrics());
        em = merge_electrics(em, self.frames.get_electrics());
        em = merge_electrics(em, self.fuel.get_electrics());
        em = merge_electrics(em, self.gear.get_electrics());
        em = merge_electrics(em, self.munitions.get_electrics());
        em = merge_electrics(em, self.optimization.get_electrics());
        em = merge_electrics(em, self.passengers.get_electrics());
        em = merge_electrics(em, self.reinforcements.get_electrics());
        em = merge_electrics(em, self.rotor.get_electrics());
        em = merge_electrics(em, self.stabilizers.get_electrics());
        em = merge_electrics(em, self.used.get_electrics());
        em = merge_electrics(em, self.controlsurfaces.get_electrics());
        em = merge_electrics(em, self.propeller.get_electrics());
        // Engines and weapons are special - they go near the end
        em = merge_electrics(em, self.engines.get_electrics());
        em = merge_electrics(em, self.weapons.get_electrics());

        em
    }
}
