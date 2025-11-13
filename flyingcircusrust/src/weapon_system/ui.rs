use super::*;
use serde::{Deserialize, Serialize};
use ui_core::*;

/// UI options struct for WeaponSystem
#[derive(Serialize, Deserialize)]
pub struct WeaponSystemOptions {
    pub weapon_type: Select,
    pub directions: Vec<Check>,
    pub mounting_count: Number,
    pub ammo: Number,
    pub action_sel: Select,
    pub projectile_sel: Select,
    pub fixed: Check,
    pub repeating: Check,
    pub seat: Select,
}

impl UIBindings for WeaponSystem {
    type OptionsType = WeaponSystemOptions;

    fn create_ui_options(&self) -> Self::OptionsType {
        // Create weapon type options
        let weapon_options: Vec<SelectOpt> = self
            .weapon_list
            .iter()
            .enumerate()
            .map(|(i, wt)| SelectOpt {
                name: format!("{} ({})", t!(wt.name.as_str()), t!(wt.era.as_str())),
                enabled: true,
            })
            .collect();

        // Create direction checkboxes
        let direction_names = vec![
            t!("Forward"),
            t!("Rearward"),
            t!("Up"),
            t!("Down"),
            t!("Left"),
            t!("Right"),
        ];
        let can_direction = self.can_direction();
        let directions: Vec<Check> = self
            .directions
            .iter()
            .enumerate()
            .map(|(i, &selected)| Check {
                name: direction_names[i].to_string(),
                enabled: can_direction[i],
                selected,
            })
            .collect();

        // Create action type options
        let action_options = vec![
            SelectOpt {
                name: t!("Standard Action").to_string(),
                enabled: true,
            },
            SelectOpt {
                name: t!("Mechanical Action").to_string(),
                enabled: self.get_can_action()[1],
            },
            SelectOpt {
                name: t!("Gast Principle").to_string(),
                enabled: self.get_can_action()[2],
            },
        ];

        // Create projectile type options
        let projectile_options = vec![
            SelectOpt {
                name: t!("Standard").to_string(),
                enabled: true,
            },
            SelectOpt {
                name: t!("Heat Ray").to_string(),
                enabled: self.get_can_projectile()[1],
            },
            SelectOpt {
                name: t!("Pneumatic").to_string(),
                enabled: self.get_can_projectile()[2],
            },
        ];

        // Create seat options (from parent Weapons cockpit_count)
        let seat_options: Vec<SelectOpt> = (0..self.cockpit_count)
            .map(|i| SelectOpt {
                name: t!("Seat #", A = i + 1).to_string(),
                enabled: true,
            })
            .collect();

        WeaponSystemOptions {
            weapon_type: Select {
                enabled: true,
                selected: self.weapon_type,
                options: weapon_options,
            },
            directions,
            mounting_count: Number {
                name: t!("Weapons Number of Mounts").to_string(),
                enabled: true,
                value: self.weapons.len() as i16,
            },
            ammo: Number {
                name: t!("Weapons Ammunition").to_string(),
                enabled: true,
                value: self.ammo,
            },
            action_sel: Select {
                enabled: true,
                selected: self.action_sel as usize,
                options: action_options,
            },
            projectile_sel: Select {
                enabled: true,
                selected: self.projectile_sel as usize,
                options: projectile_options,
            },
            fixed: Check {
                name: t!("Fixed").to_string(),
                enabled: true,
                selected: self.fixed,
            },
            repeating: Check {
                name: t!("Weapons Belt Fed").to_string(),
                enabled: self.can_repeating(),
                selected: self.repeating,
            },
            seat: Select {
                enabled: true,
                selected: self.seat as usize,
                options: seat_options,
            },
        }
    }

    fn receive_ui_selections(&mut self, options: Self::OptionsType) {
        // Update weapon type
        self.set_weapon_selected(options.weapon_type.selected as usize);

        // Update directions
        for (i, check) in options.directions.iter().enumerate() {
            if i < self.directions.len() {
                self.directions[i] = check.selected;
            }
        }

        // Update mounting count
        self.set_mounting_count(options.mounting_count.value as usize);

        // Update ammo
        self.set_ammo(options.ammo.value);

        // Update action
        self.set_action(options.action_sel.selected.into());

        // Update projectile
        self.set_projectile(options.projectile_sel.selected.into());

        // Update fixed
        self.set_fixed(options.fixed.selected);

        // Update repeating
        self.set_repeating(options.repeating.selected);

        // Update seat
        self.set_seat(options.seat.selected as i16);

        // Recalculate
        self.make_final_weapon();
    }
}
