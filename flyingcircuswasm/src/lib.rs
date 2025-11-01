use wasm_bindgen::prelude::*;

mod accessories;
mod aircraft;
mod alter;
mod cargo;
mod cockpit;
mod cockpits;
mod control_surfaces;
mod electric_builder;
mod engine;
mod engine_list;
mod engines;
mod era;
mod frames;
mod fuel;
mod json;
mod landing_gear;
mod localization;
mod munitions;
mod optimization;
mod part;
mod part_list;
mod passengers;
mod propeller;
mod propeller_builder;
mod pulsejet_builder;
mod radiator;
mod reinforcements;
mod rotor;
mod serialization;
mod stabilizers;
mod stats;
mod turbo_builder;
mod types;
mod used;
mod utils;
mod weapon;
mod weapon_list;
mod weapon_system;
mod weapons;
mod wings;

#[wasm_bindgen]
pub fn update_state(_: &str) -> bool {
    true
}

#[cfg(test)]
mod tests {

    use crate::{
        aircraft::{Aircraft, AircraftType},
        json::vstr,
        part::Part,
        serialization::JSSerializable,
        stats::Stats,
    };

    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;

    #[test]
    fn test_basic_biplane() {
        let test_json: serde_json::Value = serde_json::from_str(r#"{"version":"12.7","name":"Basic Biplane","aircraft_type":0,"era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Rhona Motorbau Z11 80hp","overspeed":18,"altitude":29,"torque":2,"rumble":0,"oiltank":true,"pulsejet":false,"rarity":1,"liftbleed":0,"wetmass":0,"mass":4,"drag":8,"control":0,"cost":4,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":-1,"power":8,"fuelconsumption":10,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0,"warnings":[],"eras":[{"name":"Rhona Motorbau Z11 80hp","era":"WWI"}]},"selected_inputs":{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},"cooling_count":0,"radiator_index":-1,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":2,"is_generator":false,"has_alternator":false,"intake_fan":false,"outboard_prop":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":2,"upgrade":0},"frames":{"sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"wings":{"wing_list":[{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":0},{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[1,0,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":1,"wing_blades":false},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"recon_sel":[0,0,0,0,0,0,0],"visi_sel":[false,false,false],"clim_sel":[false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":0,"w_count":1}],"ammo":1,"action":0,"projectile":0,"repeating":false,"seat":0}],"brace_count":0},"used":{"enabled":true,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0},"rotor":{"type":0,"rotor_count":0,"rotor_span":0,"rotor_mat":0,"stagger_sel":0,"accessory":false,"blade_idx":0,"rotor_thickness":0},"alter":{"part_list":[]}}"#).unwrap();

        let ver = test_json.get("version").unwrap();
        let ver = vstr(ver);
        let ver = ver.parse::<f64>().unwrap();
        assert_eq!(12.7, ver);

        let mut acft = Aircraft::new();
        acft.from_json(&test_json, 12.7);
        assert_eq!("Basic Biplane", acft.name);
        assert_eq!(AircraftType::Airplane, acft.aircraft_type);

        let cockpit_stats_json: serde_json::Value = serde_json::from_str(
            r#"{"mass": 1, "drag": 3, "reqsections": 1, "eras": [{"name": "Open","era": "Pioneer"}]}"#,
        ).unwrap();
        let mut cockpit_stats = Stats::new();
        cockpit_stats.from_json(&cockpit_stats_json, 12.7);
        assert_eq!(cockpit_stats, acft.cockpits.part_stats());

        let engines_stats_json: serde_json::Value = serde_json::from_str(
            r#"{
                "mass": 6,
                "drag": 3,
                "cost": 5,
                "reqsections": 1,
                "latstab": -2,
                "power": 8,
                "fuelconsumption": 10,
                "warnings": [
                    {
                    "source": "Rotary",
                    "warning": "+1 to Dogfight! when turning right.",
                    "color": 0
                    }
                ],
                "eras": [
                    {
                    "name": "Rhona Motorbau Z11 80hp",
                    "era": "WWI"
                    },
                    {
                    "name": "Rotary Basic Cowl",
                    "era": "Pioneer"
                    },
                    {
                    "name": "Tractor",
                    "era": "Pioneer"
                    }
                ]
                }"#,
        )
        .unwrap();
        let mut engine_stats = Stats::new();
        engine_stats.from_json(&engines_stats_json, 12.7);
        assert_eq!(engine_stats, acft.engines.part_stats());

        let propeller_stats_json: serde_json::Value = serde_json::from_str(
            r#"{
                "pitchboost": 0.6,
                "pitchspeed": 1
                }"#,
        )
        .unwrap();
        let mut propeller_stats = Stats::new();
        propeller_stats.from_json(&propeller_stats_json, 12.7);
        assert_eq!(propeller_stats, acft.propeller.part_stats());

        let fuel_stats_json: serde_json::Value = serde_json::from_str(
            r#"{
            "wetmass": 5,
            "mass": 1,
            "reqsections": 1,
            "fuel": 125,
            "eras": [
                {
                "name": "Internal Fuselage Tank",
                "era": "Pioneer"
                },
                {
                "name": "External Wing Tank",
                "era": "Pioneer"
                },
                {
                "name": "Internal Wing Tank",
                "era": "Pioneer"
                },
                {
                "name": "Microtank",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut fuel_stats = Stats::new();
        fuel_stats.from_json(&fuel_stats_json, 12.7);
        assert_eq!(fuel_stats, acft.fuel.part_stats());

        assert_eq!(Stats::new(), acft.munitions.part_stats());

        let weap_stats_json: serde_json::Value = serde_json::from_str(
            r#"
        {
            "mass": 3,
            "drag": 1,
            "cost": 2,
            "eras": [
                {
                "name": "Machine Gun",
                "era": "WWI"
                }
            ]
            }
        "#,
        )
        .unwrap();
        let mut weap_stats = Stats::new();
        weap_stats.from_json(&weap_stats_json, 12.7);
        assert_eq!(weap_stats, acft.weapons.part_stats());

        assert_eq!(Stats::new(), acft.cargo.part_stats());

        let wing_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
                "liftbleed": 2,
                "drag": 12,
                "control": 3,
                "visibility": -2,
                "pitchstab": 1,
                "maxstrain": -38,
                "wingarea": 16,
                "crashsafety": -1,
                "eras": [
                    {
                    "name": "Parasol",
                    "era": "Pioneer"
                    },
                    {
                    "name": "Cloth Canvas",
                    "era": "Pioneer"
                    },
                    {
                    "name": "Low",
                    "era": "Pioneer"
                    },
                    {
                    "name": "Unstaggered",
                    "era": "Pioneer"
                    }
                ]
            }"#,
        )
        .unwrap();
        let mut wing_stats = Stats::new();
        wing_stats.from_json(&wing_stats_json, 12.7);
        assert_eq!(wing_stats, acft.wings.part_stats());

        let controls_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "eras": [
                {
                "name": "Flap Ailerons",
                "era": "Pioneer"
                },
                {
                "name": "Flap Rudder",
                "era": "Pioneer"
                },
                {
                "name": "Flap Elevator",
                "era": "Pioneer"
                },
                {
                "name": "None",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut controls_stats = Stats::new();
        controls_stats.from_json(&controls_stats_json, 12.7);
        assert_eq!(controls_stats, acft.controlsurfaces.part_stats());

        let reinforcement_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "mass": 2,
            "drag": 8,
            "cost": 2,
            "maxstrain": 75,
            "structure": 15,
            "eras": [
                {
                "name": "Parallel Struts",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut reinforcement_stats = Stats::new();
        reinforcement_stats.from_json(&reinforcement_stats_json, 12.7);
        assert_eq!(reinforcement_stats, acft.reinforcements.part_stats());

        let accessories_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "eras": [
                {
                "name": "Loud Yelling",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut accessories_stats = Stats::new();
        accessories_stats.from_json(&accessories_stats_json, 12.7);
        assert_eq!(accessories_stats, acft.accessories.part_stats());

        let frames_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "mass": 5,
            "drag": 10,
            "reqsections": 2,
            "structure": 25,
            "warnings": [
                {
                "source": "Frame Count",
                "warning": "This plane appears to have unused frame sections.  Check to see if this is intentional.",
                "color": 1
                }
            ],
            "eras": [
                {
                "name": "Wooden Spars",
                "era": "Pioneer"
                },
                {
                "name": "Cloth Canvas",
                "era": "Pioneer"
                },
                {
                "name": "Standard",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut frames_stats = Stats::new();
        frames_stats.from_json(&frames_stats_json, 12.7);
        assert_eq!(frames_stats, acft.frames.part_stats());

        let stab_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "drag": 4,
            "eras": [
                {
                "name": "Tailplane",
                "era": "Pioneer"
                },
                {
                "name": "Tailfin",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut stab_stats = Stats::new();
        stab_stats.from_json(&stab_stats_json, 12.7);
        acft.stabilizers.lifting_area = 16.;
        acft.stabilizers.wing_drag = 12.;
        acft.stabilizers.have_tail = true;
        assert_eq!(stab_stats, acft.stabilizers.part_stats());

        let gear_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "drag": 4,
            "eras": [
                {
                "name": "Landing Gear",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut gear_stats = Stats::new();
        gear_stats.from_json(&gear_stats_json, 12.7);
        acft.gear.set_loaded_mass(23.);
        assert_eq!(gear_stats, acft.gear.part_stats());
    }

    #[test]
    fn test_basic_biplane_final() {
        let test_json: serde_json::Value = serde_json::from_str(r#"{"version":"12.7","name":"Basic Biplane","aircraft_type":0,"era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Rhona Motorbau Z11 80hp","overspeed":18,"altitude":29,"torque":2,"rumble":0,"oiltank":true,"pulsejet":false,"rarity":1,"liftbleed":0,"wetmass":0,"mass":4,"drag":8,"control":0,"cost":4,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":-1,"power":8,"fuelconsumption":10,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0,"warnings":[],"eras":[{"name":"Rhona Motorbau Z11 80hp","era":"WWI"}]},"selected_inputs":{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},"cooling_count":0,"radiator_index":-1,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":2,"is_generator":false,"has_alternator":false,"intake_fan":false,"outboard_prop":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":2,"upgrade":0},"frames":{"sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"wings":{"wing_list":[{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":0},{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[1,0,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":1,"wing_blades":false},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"recon_sel":[0,0,0,0,0,0,0],"visi_sel":[false,false,false],"clim_sel":[false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":0,"w_count":1}],"ammo":1,"action":0,"projectile":0,"repeating":false,"seat":0}],"brace_count":0},"used":{"enabled":true,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0},"rotor":{"type":0,"rotor_count":0,"rotor_span":0,"rotor_mat":0,"stagger_sel":0,"accessory":false,"blade_idx":0,"rotor_thickness":0},"alter":{"part_list":[]}}"#).unwrap();

        let ver = test_json.get("version").unwrap();
        let ver = vstr(ver);
        let ver = ver.parse::<f64>().unwrap();
        assert_eq!(12.7, ver);

        let mut acft = Aircraft::new();
        acft.from_json(&test_json, 12.7);
        assert_eq!("Basic Biplane", acft.name);
        assert_eq!(AircraftType::Airplane, acft.aircraft_type);

        let final_stats_json: serde_json::Value = serde_json::from_str(
            r#"
            {
            "liftbleed": 27,
            "wetmass": 5,
            "mass": 18,
            "drag": 45,
            "control": 3,
            "cost": 11,
            "reqsections": 5,
            "visibility": -2,
            "pitchstab": 1,
            "latstab": -2,
            "cooling": 0,
            "power": 8,
            "fuelconsumption": 10,
            "maxstrain": 37,
            "structure": 40,
            "pitchboost": 0.6,
            "pitchspeed": 1,
            "wingarea": 16,
            "toughness": 8,
            "crashsafety": -1,
            "fuel": 125,
            "warnings": [
                {
                "source": "Rotary",
                "warning": "+1 to Dogfight! when turning right.",
                "color": 0
                }
            ],
            "eras": [
                {
                "name": "Open",
                "era": "Pioneer"
                },
                {
                "name": "Rhona Motorbau Z11 80hp",
                "era": "WWI"
                },
                {
                "name": "Rotary Basic Cowl",
                "era": "Pioneer"
                },
                {
                "name": "Tractor",
                "era": "Pioneer"
                },
                {
                "name": "Default",
                "era": "Pioneer"
                },
                {
                "name": "None",
                "era": "Pioneer"
                },
                {
                "name": "Internal Fuselage Tank",
                "era": "Pioneer"
                },
                {
                "name": "External Wing Tank",
                "era": "Pioneer"
                },
                {
                "name": "Internal Wing Tank",
                "era": "Pioneer"
                },
                {
                "name": "Microtank",
                "era": "Pioneer"
                },
                {
                "name": "Machine Gun",
                "era": "WWI"
                },
                {
                "name": "Interruptor Gear",
                "era": "WWI"
                },
                {
                "name": "Parasol",
                "era": "Pioneer"
                },
                {
                "name": "Cloth Canvas",
                "era": "Pioneer"
                },
                {
                "name": "Low",
                "era": "Pioneer"
                },
                {
                "name": "Unstaggered",
                "era": "Pioneer"
                },
                {
                "name": "Flap Ailerons",
                "era": "Pioneer"
                },
                {
                "name": "Flap Rudder",
                "era": "Pioneer"
                },
                {
                "name": "Flap Elevator",
                "era": "Pioneer"
                },
                {
                "name": "Parallel Struts",
                "era": "Pioneer"
                },
                {
                "name": "Loud Yelling",
                "era": "Pioneer"
                },
                {
                "name": "Wooden Spars",
                "era": "Pioneer"
                },
                {
                "name": "Standard",
                "era": "Pioneer"
                },
                {
                "name": "Tailplane",
                "era": "Pioneer"
                },
                {
                "name": "Tailfin",
                "era": "Pioneer"
                },
                {
                "name": "Landing Gear",
                "era": "Pioneer"
                }
            ]
            }"#,
        )
        .unwrap();
        let mut final_stats = Stats::new();
        final_stats.from_json(&final_stats_json, 12.7);
        assert_eq!(final_stats, acft.part_stats());
    }
}
