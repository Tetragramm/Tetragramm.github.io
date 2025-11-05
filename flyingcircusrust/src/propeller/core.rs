use std::rc::Rc;

use super::*;

impl Propeller {
    /// Creates a new Propeller instance with provided lists
    pub fn new(prop_list: Vec<PropellerEntry>, upg_list: Vec<UpgradeEntry>) -> Propeller {
        Propeller {
            prop_list: Rc::new(prop_list),
            upg_list: Rc::new(upg_list),
            idx_prop: 2, // Default propeller index (matches TypeScript default)
            idx_upg: 0,  // Default upgrade index
            engines: Vec::new(),
            acft_type: AircraftType::Airplane,
        }
    }
}
