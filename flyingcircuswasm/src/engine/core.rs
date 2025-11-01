use super::Engine;
use crate::engines::{CowlEntry, MountEntry};
use std::rc::Rc;

impl Engine {
    pub fn new(mount_list: Rc<Vec<MountEntry>>, cowl_list: Rc<Vec<CowlEntry>>) -> Engine {
        // Initialize engine lists on first use
        crate::engine_list::init_engine_lists();

        let etype_inputs = super::EngineInputs::new();
        let etype_stats = super::EngineStats::new();
        let cooling_count = etype_stats.stats.cooling as i16;

        Engine {
            elist_key: "Custom".to_string(),
            etype_stats,
            etype_inputs,
            cooling_count,
            radiator_index: if cooling_count > 0 { 0 } else { -1 },
            num_radiators: 0,
            mount_list,
            mount_sel: 0,
            intake_fan: false,
            is_push_pull: false,
            torque_to_struct: false,
            cowl_list,
            cowl_sel: 0,
            extended_ds: false,
            outboard_prop: false,
            gear_count: 0,
            geared_reliability: 0,
            total_reliability: 0,
            is_generator: false,
            has_alternator: false,
            is_first_pulsejet: false,
            is_internal: false,
        }
    }
}
