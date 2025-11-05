use super::*;

impl WeaponSystem {
    /// Create a new WeaponSystem
    /// TypeScript: constructor(weapon_list, wl_permute)
    pub fn new(weapon_list: Rc<Vec<WeaponType>>, wl_permute: Rc<Vec<usize>>) -> Self {
        let mut directions = vec![false; 6];
        directions[0] = true; // Default to forward

        let final_weapon = weapon_list[0].clone();

        let mut ws = WeaponSystem {
            weapon_list,
            wl_permute,
            weapon_type: 0,
            raw_weapon_type: 0,
            final_weapon,
            weapons: Vec::new(),
            fixed: true,
            directions,
            ammo: 1,
            action_sel: ActionType::Standard,
            projectile_sel: ProjectileType::Bullets,
            repeating: false,
            seat: 0,
            tractor: false,
            pusher: false,
            heli: false,
            spinner_t: false,
            spinner_p: false,
            has_cantilever: false,
            has_propeller: true,
            sticky_guns: 0,
        };

        // Initialize with one weapon
        ws.make_final_weapon();
        ws.set_mounting_count(1);

        ws
    }
}
