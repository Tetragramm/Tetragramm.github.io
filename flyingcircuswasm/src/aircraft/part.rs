use super::*;
use crate::part::{merge_electrics, ElectricsMessage, Part};

impl Part for Aircraft {
    fn part_stats(&mut self) -> Stats {
        let mut match_stats = Stats::new();
        let mut fixed_point = false;
        while !fixed_point {
            let mut s = Stats::new();
            s = s.add(&self.era.part_stats());
            s = s.add(&self.cockpits.part_stats());
            s = s.add(&self.passengers.part_stats());

            self.engines.set_tail_mods(
                self.frames.get_farman_or_boom(),
                self.wings.get_swept() && self.stabilizers.get_v_outboard(),
                self.stabilizers.get_canard(),
            );
            self.engines.set_internal(
                self.aircraft_type == AircraftType::Helicopter || self.is_ornithopter(),
            );
            self.engines.set_metal_area(self.wings.get_metal_area());
            self.engines.have_parasol(self.wings.get_parasol());
            s = s.add(&self.engines.part_stats());

            self.propeller
                .set_engine_types(self.engines.get_engine_types());
            self.propeller.set_acft_type(self.aircraft_type);
            s = s.add(&self.propeller.part_stats());

            //Fuel goes here, because it makes sections.
            s = s.add(&self.fuel.part_stats());
            //Mutionions go here, because it makes sections.
            s = s.add(&self.munitions.part_stats());

            self.weapons
                .set_number_of_cockpits(self.cockpits.get_number_of_cockpits());

            let tractor_info = self.engines.get_tractor_spinner();
            self.weapons.set_tractor_info(
                tractor_info.have,
                tractor_info.spin_count,
                tractor_info.arty_spin_count,
            );

            let pusher_info = self.engines.get_pusher_spinner();
            self.weapons.set_pusher_info(
                pusher_info.have,
                pusher_info.spin_count,
                pusher_info.arty_spin_count,
            );

            self.weapons.cant_type = self.reinforcements.cant_type();
            self.weapons
                .set_have_propeller(self.engines.get_num_propellers() > 0);
            self.weapons.set_can_wing(!self.is_ornithopter());
            s = s.add(&self.weapons.part_stats());

            //Cargo makes sections
            s = s.add(&self.cargo.part_stats());

            self.wings.set_aircraft_type(self.aircraft_type);
            if self.aircraft_type == AircraftType::Autogyro {
                self.wings.set_rotor_span(self.rotor.get_rotor_span());
            } else {
                self.wings.set_rotor_span(0);
            }
            s = s.add(&self.wings.part_stats());

            self.rotor.set_wing_area(s.wingarea as i16);
            if self.aircraft_type == AircraftType::Autogyro {
                self.rotor
                    .set_engine_count(self.engines.get_number_engines());
                s = s.add(&self.rotor.part_stats());
            }

            self.controlsurfaces.set_wing_area(s.wingarea as i16);
            self.controlsurfaces
                .set_boom_tail(self.frames.get_use_boom());
            self.controlsurfaces.set_span(self.wings.get_span());
            self.controlsurfaces.set_acft_type(self.aircraft_type);
            self.controlsurfaces
                .set_can_elevator(self.stabilizers.get_hstab_count() > 0);
            self.controlsurfaces
                .set_can_rudder(self.stabilizers.get_vstab_count() > 0);
            self.controlsurfaces
                .set_is_vtail(self.stabilizers.get_is_vtail());
            if self.aircraft_type == AircraftType::Airplane {
                // self.controlsurfaces.set_num_cantilever();
            } else {
                self.controlsurfaces.set_num_cantilever(0);
            }
            s = s.add(&self.controlsurfaces.part_stats());

            self.reinforcements
                .set_monoplane(self.wings.get_monoplane());
            self.reinforcements.set_tandem(self.wings.get_tandem());
            self.reinforcements
                .set_staggered(self.wings.get_staggered());
            self.reinforcements
                .set_can_external(self.wings.get_area() > 0);
            let (is_sesqui, _, is_small_sesqui) = self.wings.get_is_sesquiplane();
            self.reinforcements
                .set_sesquiplane(is_sesqui, is_small_sesqui);
            self.reinforcements.set_aircraft_type(self.aircraft_type);
            self.reinforcements.set_cant_lift(self.era.get_cant_lift());
            s = s.add(&self.reinforcements.part_stats());

            if self.rotor.get_tail_rotor() {
                s.power = (1.0e-6 + 0.9 * s.power).floor()
            }

            self.accessories
                .set_has_radiator(self.engines.get_num_radiators() > 0);
            self.accessories.set_skin_armour(self.frames.get_armor());
            self.accessories
                .set_can_cutouts(self.wings.can_cutout(), self.frames.can_cutout());
            s = s.add(&self.accessories.part_stats());

            //You know what, frames go last, because lots of things make sections.
            self.frames.set_required_sections(s.reqsections as usize);
            self.frames
                .set_has_tractor_nacelles(self.engines.get_has_tractor_nacelles());
            self.frames.set_is_tandem(self.wings.get_tandem());
            s = s.add(&self.frames.part_stats());

            self.stabilizers
                .set_engine_count(self.engines.get_number_engines() as i16);
            self.stabilizers.set_is_tandem(self.wings.get_tandem());
            self.stabilizers.set_is_swept(self.wings.get_swept());
            self.stabilizers
                .set_have_tail(!self.frames.get_is_tailless());
            self.stabilizers.set_helicopter(false);
            self.stabilizers.set_lifting_area(s.wingarea);
            self.stabilizers.wing_drag =
                (self.wings.get_wing_drag() + self.rotor.get_rotor_drag()) as f64;
            s = s.add(&self.stabilizers.part_stats());

            //Treated Paper needs to apply near to last
            self.wings.set_aircraft_mass(s.mass);
            s.mass += self.wings.get_paper_mass();
            //because treated paper brings mass down.
            s.mass = s.mass.max(1.0);

            self.gear.set_gull_deck(self.wings.has_inverted_gull());
            self.gear.set_loaded_mass(s.mass + s.wetmass);
            self.gear.set_can_boat(
                self.engines.get_engine_height(),
                self.wings.get_wing_height(),
            );
            s = s.add(&self.gear.part_stats());

            //Add toughness here so it gets optimized properly.
            s.toughness += (1.0e-6 + s.structure / 5.0).floor();
            self.optimization.set_acft_stats(&s);
            s = s.add(&self.optimization.part_stats());

            //Has flight stress from open cockpit + tractor rotary.
            self.cockpits
                .set_has_rotary(self.engines.has_tractor_rotary());

            s = s.add(&self.alter.part_stats());

            s.round();
            if s == match_stats {
                fixed_point = true;
            } else {
                match_stats = s;
            }
        }

        self.stats = match_stats;
        let derived = self.get_derived_stats();

        //Because flaps have cost per MP
        self.stats.cost += self.controlsurfaces.get_flap_cost(derived.dry_mp);

        //Used: burnt_out
        self.stats.reliability -= self.used.burnt_out as f64;

        //Used: sticky_guns  (Just needs to happen before display)
        self.weapons.set_sticky_guns(self.used.sticky_guns);

        //Update Part Local stuff
        self.cockpits.set_armed(&self.weapons.get_armed_seats());
        self.cockpits.update_crew_stats(
            self.stats.escape as i16,
            derived.control_stress,
            derived.rumble_stress,
            self.stats.visibility as i16,
            self.stats.crashsafety as i16,
        );

        //Check Flight Stress for warnings
        let mut stress_reduction = 0;
        for s in self.cockpits.get_stress_list() {
            stress_reduction = stress_reduction.max(s.0 - s.1);
        }
        if stress_reduction != 0
            && self
                .stats
                .warnings
                .iter()
                .find(|w| w.name == "Co-Pilot Controls")
                .is_none()
        {
            self.stats.warnings.push(crate::stats::Warning {
                name: t!("Co-Pilot Controls").to_string(),
                warning: t!("Co-Pilot Warning", A = stress_reduction).to_string(),
                level: crate::stats::WarningLevel::White, // WARNING_COLOR::YELLOW
            });
        }

        if self.is_ornithopter() {
            self.stats.upkeep += 1.0;
        }

        if self.aircraft_type == AircraftType::OrnithopterBuzzer {
            self.stats.reliability -= 2.0;
        }

        self.engines
            .update_reliability(self.stats.reliability as i16);

        //Not really part local, but only affects number limits.
        self.reinforcements
            .set_acft_structure(self.stats.structure as i16);
        self.fuel.set_area(self.wings.get_area() as f64);
        self.fuel
            .set_cantilever(self.reinforcements.has_cantilevers());
        self.accessories
            .set_vital_parts(self.vital_component_list().len() as i16);
        self.munitions.set_acft_parameters(
            self.stats.structure,
            self.era.get_max_bomb(),
            self.wings.has_inverted_gull(),
        );

        self.stats.clone()
    }

    fn get_electrics(&self) -> ElectricsMessage {
        let mut em = ElectricsMessage::new();
        em = merge_electrics(em, self.alter.get_electrics());
        em = merge_electrics(em, self.era.get_electrics());
        em = merge_electrics(em, self.cockpits.get_electrics());
        em = merge_electrics(em, self.passengers.get_electrics());
        em = merge_electrics(em, self.engines.get_electrics());
        em = merge_electrics(em, self.propeller.get_electrics());
        em = merge_electrics(em, self.frames.get_electrics());
        em = merge_electrics(em, self.munitions.get_electrics());
        em = merge_electrics(em, self.weapons.get_electrics());
        em = merge_electrics(em, self.wings.get_electrics());
        em = merge_electrics(em, self.controlsurfaces.get_electrics());
        em = merge_electrics(em, self.reinforcements.get_electrics());
        em = merge_electrics(em, self.accessories.get_electrics());
        em = merge_electrics(em, self.stabilizers.get_electrics());
        em = merge_electrics(em, self.gear.get_electrics());
        em
    }
}
