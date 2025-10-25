use std::sync::atomic::AtomicPtr;

use crate::{
    cockpits::Cockpits,
    engines::Engines,
    era::Era,
    part::{merge_electrics, ElectricsMessage, Part},
    part_list::get_part_list,
    passengers::Passengers,
    stats::Stats,
};

#[derive(PartialEq)]
enum AircraftType {
    Airplane,
    Helicopter,
    Autogyro,
    OrnithopterBasic,
    OrnithopterFlutter,
    OrnithopterBuzzer,
}

pub struct Aircraft {
    name: String,
    stats: Stats,
    aircraft_type: AircraftType,
    era: Era,
    cockpits: Cockpits,
    passengers: Passengers,
    // engines: Engines,
}

impl Aircraft {
    pub fn new() -> Aircraft {
        let part_list = get_part_list();
        Aircraft {
            name: "Prototype Aircraft".to_string(),
            stats: Stats::new(),
            aircraft_type: AircraftType::Airplane,
            era: Era::new(part_list.era),
            cockpits: Cockpits::new(
                part_list.cockpit_type,
                part_list.cockpit_upgrades,
                part_list.cockpit_safety,
                part_list.cockpit_gunsights,
            ),
            passengers: Passengers::new(),
            // engines: Engines::new(
            //     part_list.engine_mounts,
            //     part_list.engine_cowls,
            //     part_list.radiator_types,
            //     part_list.radiator_mounts,
            //     part_list.radiator_coolants,
            // ),
        }
    }

    fn is_ornithopter(&self) -> bool {
        match self.aircraft_type {
            AircraftType::OrnithopterBasic
            | AircraftType::OrnithopterBuzzer
            | AircraftType::OrnithopterFlutter => true,
            AircraftType::Airplane | AircraftType::Autogyro | AircraftType::Helicopter => false,
        }
    }
}

impl Part for Aircraft {
    fn part_stats(&mut self) -> Stats {
        let mut s = Stats::new();
        s = s.add(&self.era.part_stats());
        s = s.add(&self.cockpits.part_stats());
        s = s.add(&self.passengers.part_stats());

        // self.engines.set_tail_mods();
        // self.engines
        //     .set_internal(self.aircraft_type == AircraftType::Helicopter || self.is_ornithopter());
        // self.engines.set_metal_area();
        // self.engines.have_parasol();
        // s = s.add(&self.engines.part_stats());

        s
    }

    fn get_electrics(&self) -> crate::part::ElectricsMessage {
        let mut em = ElectricsMessage::new();
        em = merge_electrics(em, self.era.get_electrics());
        em = merge_electrics(em, self.cockpits.get_electrics());
        em = merge_electrics(em, self.passengers.get_electrics());
        em
    }
}
