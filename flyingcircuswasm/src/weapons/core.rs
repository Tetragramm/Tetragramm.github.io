use super::*;

impl Weapons {
    /// Create a new Weapons instance
    /// TypeScript: constructor()
    /// The weapon_list is assumed to be already sorted and permuted
    pub fn new(weapon_list: Vec<WeaponType>, wl_permute: Vec<usize>) -> Self {
        Weapons {
            weapon_sets: Vec::new(),
            weapon_list: Rc::new(weapon_list),
            wl_permute: Rc::new(wl_permute),
            brace_count: 0,
            cockpit_count: 1,
            has_tractor: false,
            tractor_spinner_count: 0,
            tractor_arty_spinner_count: 0,
            has_pusher: false,
            pusher_spinner_count: 0,
            pusher_arty_spinner_count: 0,
            cant_type: 0,
            isheli: false,
        }
    }
}
