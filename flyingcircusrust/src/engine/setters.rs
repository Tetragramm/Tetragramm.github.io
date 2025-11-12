use crate::engines::MountType;

use super::Engine;

impl Engine {
    pub fn set_cooling(&mut self, mut num: i16) {
        // Validate input
        if num < 0 {
            num = 0;
        }

        self.cooling_count = num;

        // Enforce minimum if cooling is needed
        if self.need_cooling() {
            self.cooling_count = self.cooling_count.max(1);
        }

        // Enforce maximum
        let max_cooling = if self.is_push_pull {
            2 * self.etype_stats.stats.cooling as i16
        } else {
            self.etype_stats.stats.cooling as i16
        };
        self.cooling_count = self.cooling_count.min(max_cooling);
    }

    /// Set gear count with validation
    /// TypeScript: SetGearCount(num: number)
    pub fn set_gear_count(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        self.gear_count = num;
        // Adjust reliability to not exceed count
        self.set_gear_reliability(self.geared_reliability);
    }

    /// Set gear reliability with validation
    /// TypeScript: SetGearReliability(num: number)
    pub fn set_gear_reliability(&mut self, mut num: i16) {
        if num < 0 {
            num = 0;
        }
        // Reliability cannot exceed gear count
        self.geared_reliability = num.min(self.gear_count);
    }

    /// Set torque to struct with validation
    /// TypeScript: SetTorqueToStruct(use: boolean)
    pub fn set_torque_to_struct(&mut self, use_it: bool) {
        self.torque_to_struct = use_it;
        // Only works with push-pull
        if !self.is_push_pull {
            self.torque_to_struct = false;
        }
    }

    /// Set use push-pull with validation
    /// TypeScript: SetUsePushPull(use: boolean)
    pub fn set_use_push_pull(&mut self, use_it: bool) {
        self.is_push_pull = use_it;

        if use_it {
            // Validate mount supports push-pull
            if !self.can_use_push_pull() {
                self.is_push_pull = false;
                return;
            }

            // When enabling push-pull, double cooling if already set
            if self.cooling_count > 0 {
                self.cooling_count *= 2;
            }
            if self.mount_list[self.mount_sel].mount_type == MountType::Fuselage {
                self.mount_sel = 8;
            }
        } else {
            // When disabling push-pull, halve cooling
            if self.cooling_count > 0 {
                self.cooling_count =
                    (1.0e-6 + (self.cooling_count as f32 + 1.) / 2.).floor() as i16;
            }
            if self.mount_list[self.mount_sel].name == t!("Fuselage Push-Pull") {
                self.mount_sel = 0;
            }
        }
    }

    /// Set use extended driveshaft with validation
    /// TypeScript: SetUseExtendedDriveshaft(use: boolean)
    pub fn set_use_extended_driveshaft(&mut self, use_it: bool) {
        if !self.can_use_extended_driveshaft() {
            self.extended_ds = false;
        } else {
            self.extended_ds = use_it;
        }
    }

    /// Set generator with validation
    /// TypeScript: SetGenerator(use: boolean)
    pub fn set_generator(&mut self, use_it: bool) {
        self.is_generator = use_it;

        if use_it {
            // Reset incompatible settings
            self.gear_count = 0;
            self.geared_reliability = 0;
            self.extended_ds = false;
            self.is_push_pull = false;
        }
    }

    /// Set alternator with validation
    /// TypeScript: SetAlternator(use: boolean)
    pub fn set_alternator(&mut self, use_it: bool) {
        self.has_alternator = use_it;

        // Electric engines can't have alternators
        if use_it && self.get_is_electric() {
            self.has_alternator = false;
        }
    }

    /// Set intake fan with validation
    /// TypeScript: SetIntakeFan(use: boolean)
    pub fn set_intake_fan(&mut self, use_it: bool) {
        self.intake_fan = use_it;

        // Only turbines can have intake fans
        if use_it && !self.get_is_turbine() {
            self.intake_fan = false;
        }
    }

    /// Set outboard prop with validation
    /// TypeScript: SetOutboardProp(use: boolean)
    pub fn set_outboard_prop(&mut self, use_it: bool) {
        if use_it && self.extended_ds {
            self.outboard_prop = true;
        } else {
            self.outboard_prop = false;
        }
    }

    /// Set mount index with validation
    /// TypeScript: SetMountIndex(num: number)
    pub fn set_mount_index(&mut self, num: usize) {
        if num < self.mount_list.len() {
            self.mount_sel = num;
        }
    }

    /// Set radiator with validation
    /// TypeScript: SetRadiator(num: number)
    pub fn set_radiator(&mut self, num: i16) {
        if num >= -1 && num < self.num_radiators as i16 {
            self.radiator_index = num;
        }
    }

    /// Set first pulsejet flag
    /// TypeScript: SetFirstPulsejet(first: boolean)
    pub fn set_first_pulsejet(&mut self, first: bool) {
        self.is_first_pulsejet = first;
    }

    /// Set internal flag - for helicopters and ornithopters
    /// TypeScript: SetInternal(is: boolean)
    pub fn set_internal(&mut self, is: bool) {
        self.is_internal = is;
        if is {
            self.extended_ds = false;
        }
    }

    /// Set tail modifiers - adjusts extended driveshaft based on tail configuration
    /// TypeScript: SetTailMods(forb: boolean, swr: boolean, canard: boolean)
    pub fn set_tail_mods(&mut self, farman_or_boom: bool, swept_v_outboard: bool, canard: bool) {
        // If mount requires tail and doesn't have farman/boom or swept wing with v-tail outboard
        if self.mount_list[self.mount_sel].require_tail
            && !(farman_or_boom || swept_v_outboard)
            && !self.is_generator
        {
            self.extended_ds = true;
        }
        // If mount requires extended driveshaft and it's not a canard with farman/boom or swept
        if self.mount_list[self.mount_sel].require_extended_driveshafts
            && !self.is_generator
            && !(canard && (farman_or_boom || swept_v_outboard))
        {
            self.extended_ds = true;
        }
    }

    pub fn set_num_radiators(&mut self, num: i16) {
        self.num_radiators = num;
    }

    /// Set the selected engine list and engine
    /// TypeScript: SetSelectedList(list_name: string) + SetSelectedIndex(index: number)
    pub fn set_selected_engine(&mut self, list_name: &str, engine_name: &str) {
        // Get the engine from the specified list
        if let Some(engine_inputs) = crate::engine_list::get_engine(list_name, engine_name) {
            self.elist_key = list_name.to_string();
            self.etype_inputs = engine_inputs.clone();
            self.etype_stats = engine_inputs.part_stats();
        }
    }

    /// Set the selected engine list
    /// TypeScript: SetSelectedList(list_name: string)
    pub fn set_selected_list(&mut self, list_name: &str) {
        // When changing lists, select the first engine in the new list
        let engines = crate::engine_list::get_engine_names_in_list(list_name);
        if let Some(first_engine) = engines.first() {
            self.set_selected_engine(list_name, first_engine);
        }
    }

    /// Set the selected engine by index within the current list
    /// TypeScript: SetSelectedIndex(index: number)
    pub fn set_selected_index(&mut self, index: usize) {
        let engines = crate::engine_list::get_engine_names_in_list(&self.elist_key);
        if let Some(engine_name) = engines.get(index) {
            let key = self.elist_key.clone();
            self.set_selected_engine(key.as_str(), engine_name);
        }
    }
}
