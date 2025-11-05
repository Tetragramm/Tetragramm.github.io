use super::{HStabEntry, Stabilizers, VStabEntry};
use std::rc::Rc;

impl Stabilizers {
    /// Creates a new Stabilizers instance with the provided part lists
    pub fn new(hstab_list: Vec<HStabEntry>, vstab_list: Vec<VStabEntry>) -> Self {
        Stabilizers {
            have_tail: true,
            is_tandem: false,
            is_swept: false,
            is_heli: false,
            lifting_area: 0.0,
            engine_count: 0,
            wing_drag: 0.0,

            hstab_list: Rc::new(hstab_list),
            vstab_list: Rc::new(vstab_list),

            hstab_sel: 0,
            hstab_count: 1,
            vstab_sel: 0,
            vstab_count: 1,
        }
    }
}
