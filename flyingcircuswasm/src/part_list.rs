use crate::{
    accessories::{
        AutopilotEntry, ClimateEntry, ControlEntry, ElectricalEntry, RadioEntry, ReconEntry,
        VisibilityEntry,
    },
    cargo::CargoSpace,
    cockpits::{CockpitEntry, CockpitUpgradeEntry, GunsightEntry, SafetyEntry},
    control_surfaces::{
        AileronEntry, DragInducerEntry, ElevatorEntry, FlapsEntry, RudderEntry, SlatsEntry,
    },
    engines::{CowlEntry, MountEntry, MountType},
    era::EraVal,
    frames::{FrameEntry, SkinEntry, TailEntry},
    fuel::TankEntry,
    landing_gear::{ExtraEntry, GearEntry},
    lu,
    propeller::{PropellerEntry, UpgradeEntry},
    radiator::{RadiatorCoolantEntry, RadiatorEntry, RadiatorMountEntry},
    reinforcements::{CabaneEntry, CantileverEntry, ExternalSteelEntry, ExternalWoodEntry},
    rotor::{ArrangementEntry, BladeEntry},
    stabilizers::{HStabEntry, VStabEntry},
    stats::{Era, Stats, Warning, WarningLevel, ERA},
    wings::{DeckEntry, LongestWingEntry, StaggerEntry, SurfaceEntry},
};

pub struct PartList {
    pub version: f64,
    pub era: Vec<EraVal>,

    pub cockpit_type: Vec<CockpitEntry>,
    pub cockpit_upgrades: Vec<CockpitUpgradeEntry>,
    pub cockpit_safety: Vec<SafetyEntry>,
    pub cockpit_gunsights: Vec<GunsightEntry>,

    pub engine_mounts: Vec<MountEntry>,
    pub engine_cowls: Vec<CowlEntry>,
    pub radiator_types: Vec<RadiatorEntry>,
    pub radiator_mounts: Vec<RadiatorMountEntry>,
    pub radiator_coolants: Vec<RadiatorCoolantEntry>,
    pub propeller_props: Vec<PropellerEntry>,
    pub propeller_upgrades: Vec<UpgradeEntry>,
    pub frame_frames: Vec<FrameEntry>,
    pub frame_skin: Vec<SkinEntry>,
    pub frame_tail: Vec<TailEntry>,
    pub fuel_tanks: Vec<TankEntry>,
    pub cargo_space: Vec<CargoSpace>,
    pub landing_gear_types: Vec<GearEntry>,
    pub landing_gear_extras: Vec<ExtraEntry>,
    pub wing_decks: Vec<DeckEntry>,
    pub wing_largest: Vec<LongestWingEntry>,
    pub wing_surface: Vec<SurfaceEntry>,
    pub wing_stagger: Vec<StaggerEntry>,
    pub rotor_blades: Vec<BladeEntry>,
    pub rotor_arrangement: Vec<ArrangementEntry>,
    pub control_ailerons: Vec<AileronEntry>,
    pub control_rudders: Vec<RudderEntry>,
    pub control_elevators: Vec<ElevatorEntry>,
    pub control_flaps: Vec<FlapsEntry>,
    pub control_slats: Vec<SlatsEntry>,
    pub control_drag: Vec<DragInducerEntry>,
    pub reinforcement_wood: Vec<ExternalWoodEntry>,
    pub reinforcement_steel: Vec<ExternalSteelEntry>,
    pub reinforcement_cabane: Vec<CabaneEntry>,
    pub reinforcement_cantilever: Vec<CantileverEntry>,

    pub accessories_electrical: Vec<ElectricalEntry>,
    pub accessories_radios: Vec<RadioEntry>,
    pub accessories_recon: Vec<ReconEntry>,
    pub accessories_visibility: Vec<VisibilityEntry>,
    pub accessories_climate: Vec<ClimateEntry>,
    pub accessories_autopilots: Vec<AutopilotEntry>,
    pub accessories_control: Vec<ControlEntry>,

    pub stabilizers_hstab: Vec<HStabEntry>,
    pub stabilizers_vstab: Vec<VStabEntry>,
}

pub fn get_part_list() -> PartList {
    PartList {
        version: 12.7,
        era: vec![
            EraVal {
                name: lu!("Pioneer"),
                maxbomb: 0.166666666666,
                cant_lift: 4,
                stats: Stats {
                    cost: -2.,
                    liftbleed: 30.,
                    ..Stats::new()
                },
            },
            EraVal {
                name: lu!("WWI"),
                maxbomb: 0.2,
                cant_lift: 3,
                stats: Stats {
                    liftbleed: 25.,
                    ..Stats::new()
                },
            },
            EraVal {
                name: lu!("Roaring 20s"),
                maxbomb: 0.25,
                cant_lift: 1,
                stats: Stats {
                    cost: 5.,
                    liftbleed: 22.,
                    ..Stats::new()
                },
            },
            EraVal {
                name: lu!("Coming Storm"),
                maxbomb: 0.333333333333,
                cant_lift: 0,
                stats: Stats {
                    cost: 10.,
                    liftbleed: 22.,
                    pitchstab: 2.,
                    ..Stats::new()
                },
            },
            EraVal {
                name: lu!("WWII"),
                maxbomb: 0.333333333333,
                cant_lift: 0,
                stats: Stats {
                    cost: 15.,
                    liftbleed: 20.,
                    pitchstab: 2.,
                    ..Stats::new()
                },
            },
            EraVal {
                name: lu!("Last Hurrah"),
                maxbomb: 0.5,
                cant_lift: 0,
                stats: Stats {
                    cost: 20.,
                    liftbleed: 18.,
                    pitchstab: 2.,
                    ..Stats::new()
                },
            },
        ],
        cockpit_type: vec![
            {
                let name = lu!("Open");
                CockpitEntry {
                    name: name.clone(),
                    exposed: true,
                    stats: Stats {
                        mass: 1.,
                        drag: 3.,
                        escape: 2.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Windscreen");
                CockpitEntry {
                    name: name.clone(),
                    exposed: true,
                    stats: Stats {
                        mass: 2.,
                        drag: 1.,
                        escape: 2.,
                        cost: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Sealed");
                CockpitEntry {
                    name: name.clone(),
                    exposed: false,
                    stats: Stats {
                        mass: 2.,
                        escape: -3.,
                        cost: 1.,
                        flightstress: -1.,
                        visibility: -99.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Sealed Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Narrow Canopy");
                CockpitEntry {
                    name: name.clone(),
                    exposed: false,
                    stats: Stats {
                        mass: 3.,
                        cost: 3.,
                        flightstress: -1.,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Bubble Canopy");
                CockpitEntry {
                    name: name.clone(),
                    exposed: false,
                    stats: Stats {
                        mass: 3.,
                        drag: -3.,
                        cost: 8.,
                        flightstress: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_upgrades: vec![
            {
                let name = lu!("Co-Pilot Controls");
                CockpitUpgradeEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        flightstress: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Escape Hatch");
                CockpitUpgradeEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        escape: 3.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Escape Hatch");
                CockpitUpgradeEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        escape: 5.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Connectivity");
                CockpitUpgradeEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Connectivity Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Oxygen Mask");
                CockpitUpgradeEntry {
                    name: name.clone(),
                    stats: Stats {
                        charge: -1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Oxygen Mask Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Isolated");
                CockpitUpgradeEntry {
                    name: name.clone(),
                    stats: Stats {
                        charge: -1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Isolated Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_safety: vec![
            {
                let name = lu!("Padding");
                SafetyEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Injury Reduction Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Harness");
                SafetyEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        escape: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Injury Reduction Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Fast Release System");
                SafetyEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Roll Bar");
                SafetyEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Injury Reduction Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Flare Slot");
                SafetyEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Flare Slot Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Basic Fan");
                SafetyEntry {
                    name: name.clone(),
                    stats: Stats {
                        charge: 1e-9,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Basic Fan Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_gunsights: vec![
            {
                let name = lu!("X1 Collimated Gunsight");
                GunsightEntry {
                    name: name.clone(),
                    attack: 1,
                    stats: Stats {
                        visibility: -1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("X1 Collimated Gunsight Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Telescopic Gunsight");
                GunsightEntry {
                    name: name.clone(),
                    attack: 0,
                    stats: Stats {
                        visibility: -1.,
                        cost: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Telescopic Gunsight Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Illuminated Reflex Sight");
                GunsightEntry {
                    name: name.clone(),
                    attack: 2,
                    stats: Stats {
                        visibility: -1.,
                        cost: 6.,
                        charge: 1e-9,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Illuminated Reflex Sight Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Gyro Gunsight");
                GunsightEntry {
                    name: name.clone(),
                    attack: 2,
                    stats: Stats {
                        visibility: -1.,
                        cost: 12.,
                        charge: 1e-9,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Gyro Gunsight Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        engine_mounts: vec![
            {
                let name = lu!("Tractor");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Fuselage,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: false,
                    stats: Stats {
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Center-Mounted Tractor");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Fuselage,
                    require_extended_driveshafts: true,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: false,
                    stats: Stats {
                        reqsections: 1.,
                        visibility: 1.,
                        pitchstab: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Rear-Mounted Pusher");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Fuselage,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: false,
                    stats: Stats {
                        reqsections: 1.,
                        visibility: 2.,
                        escape: -2.,
                        pitchstab: -4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Center-Mounted Pusher");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Fuselage,
                    require_extended_driveshafts: false,
                    require_tail: true,
                    helicopter: false,
                    turbine: false,
                    pushpull: false,
                    stats: Stats {
                        reqsections: 1.,
                        visibility: 2.,
                        escape: -2.,
                        pitchstab: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Pod");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 0.9,
                    mount_type: MountType::Pod,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: true,
                    stats: Stats {
                        drag: 5.,
                        reqsections: 1.,
                        visibility: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Nacelle (Inside)");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.5,
                    drag_factor: 0.,
                    power_factor: 0.8,
                    mount_type: MountType::Wing,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: true,
                    stats: Stats {
                        liftbleed: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Nacelle (Offset)");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 1.,
                    power_factor: 0.8,
                    mount_type: MountType::Wing,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Channel Tractor");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 1.,
                    drag_factor: 0.,
                    power_factor: 0.9,
                    mount_type: MountType::Wing,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: true,
                    stats: Stats {
                        liftbleed: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Fuselage Push-Pull");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 0.9,
                    mount_type: MountType::Fuselage,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: false,
                    pushpull: true,
                    stats: Stats {
                        reqsections: 2.,
                        escape: -2.,
                        pitchstab: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Front Intake");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Fuselage,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: true,
                    pushpull: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Pod");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.5,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Wing,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: true,
                    pushpull: false,
                    stats: Stats {
                        liftbleed: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Underwing Pod");
                MountEntry {
                    name: name.clone(),
                    strain_factor: 0.,
                    drag_factor: 0.,
                    power_factor: 1.,
                    mount_type: MountType::Wing,
                    require_extended_driveshafts: false,
                    require_tail: false,
                    helicopter: false,
                    turbine: true,
                    pushpull: false,
                    stats: Stats {
                        drag: 3.,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        engine_cowls: vec![
            {
                let name = lu!("No Cowling");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 1.,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: true,
                    for_rotary: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Basic Cowl");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 0.8,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: false,
                    for_rotary: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Rotary Basic Cowl");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 0.4,
                    mass_per_drag: 0.,
                    for_air_cooled: false,
                    for_liquid_cooled: false,
                    for_rotary: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Closed Cowl");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 0.3,
                    mass_per_drag: 0.,
                    for_air_cooled: false,
                    for_liquid_cooled: false,
                    for_rotary: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        reliability: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Adjustable Slat Cowl");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 0.5,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: false,
                    for_rotary: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 2.,
                        reliability: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Foil Cowl");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 0.4,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: false,
                    for_rotary: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 3.,
                        reliability: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Sealed Cowl");
                CowlEntry {
                    name: name.clone(),
                    drag_factor: 0.5,
                    mass_per_drag: 0.333333333333,
                    for_air_cooled: false,
                    for_liquid_cooled: true,
                    for_rotary: false,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_types: vec![
            {
                let name = lu!("Panel");
                RadiatorEntry {
                    name: name.clone(),
                    dragpercool: 0.5,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Box");
                RadiatorEntry {
                    name: name.clone(),
                    dragpercool: 0.5,
                    stats: Stats {
                        mass: -1.,
                        drag: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Intake");
                RadiatorEntry {
                    name: name.clone(),
                    dragpercool: 0.5,
                    stats: Stats {
                        cost: 3.,
                        cooling: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Evaporation");
                RadiatorEntry {
                    name: name.clone(),
                    dragpercool: 0.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Evaporation Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_mounts: vec![
            {
                let name = lu!("Low");
                RadiatorMountEntry {
                    name: name.clone(),
                    stats: Stats {
                        reliability: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Low Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Inline");
                RadiatorMountEntry {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("High");
                RadiatorMountEntry {
                    name: name.clone(),
                    stats: Stats {
                        drag: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("High Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("High Offset");
                RadiatorMountEntry {
                    name: name.clone(),
                    stats: Stats {
                        drag: 1.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("High Offset Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_coolants: vec![
            {
                let name = lu!("Water");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Salt Water");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: true,
                    flammable: false,
                    stats: Stats {
                        cost: 1.,
                        reliability: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Mineral Oil");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: true,
                    flammable: true,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Mineral Oil Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Castor Oil");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: false,
                    flammable: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Castor Oil Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Glycol");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 2.,
                        reliability: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Freon");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 3.,
                        reliability: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Freon Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Ammonia");
                RadiatorCoolantEntry {
                    name: name.clone(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 2.,
                        reliability: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Ammonia Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        propeller_props: vec![
            {
                let name = lu!("High Power");
                PropellerEntry {
                    name: name.clone(),
                    energy: 1.5,
                    turn: 8.0,
                    stats: Stats {
                        pitchboost: 0.9,
                        pitchspeed: 0.8,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Power");
                PropellerEntry {
                    name: name.clone(),
                    energy: 2.0,
                    turn: 7.0,
                    stats: Stats {
                        pitchboost: 0.8,
                        pitchspeed: 0.9,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Default");
                PropellerEntry {
                    name: name.clone(),
                    energy: 3.0,
                    turn: 6.0,
                    stats: Stats {
                        pitchboost: 0.6,
                        pitchspeed: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Speed");
                PropellerEntry {
                    name: name.clone(),
                    energy: 4.0,
                    turn: 5.0,
                    stats: Stats {
                        pitchboost: 0.4,
                        pitchspeed: 1.1,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("High Speed");
                PropellerEntry {
                    name: name.clone(),
                    energy: 4.5,
                    turn: 4.0,
                    stats: Stats {
                        pitchboost: 0.3,
                        pitchspeed: 1.2,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        propeller_upgrades: vec![
            {
                let name = lu!("None");
                UpgradeEntry {
                    name: name.clone(),
                    energy: 0.0,
                    turn: 0.0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Manually Adjustable Pitch");
                UpgradeEntry {
                    name: name.clone(),
                    energy: 0.0,
                    turn: 0.0,
                    stats: Stats {
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("MVP_Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Automatic Pitch");
                UpgradeEntry {
                    name: name.clone(),
                    energy: 0.5,
                    turn: 1.0,
                    stats: Stats {
                        mass: 1.,
                        cost: 8.,
                        pitchboost: 0.1,
                        pitchspeed: 0.1,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_frames: vec![
            {
                let name = lu!("Wooden Spars");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 15,
                    basecost: 0,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        structure: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Spars");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 25,
                    basecost: 1,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Aluminum Spars");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 20,
                    basecost: 2,
                    geodesic: false,
                    stats: Stats {
                        mass: 0.5,
                        cost: 2.,
                        structure: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wooden Ribs");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 30,
                    basecost: 1,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 0.5,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Ribs");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 60,
                    basecost: 2,
                    geodesic: true,
                    stats: Stats {
                        mass: 3.,
                        cost: 2.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Aluminum Ribs");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 50,
                    basecost: 3,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 3.,
                        structure: 8.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Titanium");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 0,
                    basecost: 0,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 8.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Living Grove");
                FrameEntry {
                    name: name.clone(),
                    basestruct: 30,
                    basecost: 8,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        structure: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Living Grove Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_skin: vec![
            {
                let name = lu!("Naked");
                SkinEntry {
                    name: name.clone(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 1.,
                    massfactor: 0.6,
                    stats: Stats {
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Cloth Canvas");
                SkinEntry {
                    name: name.clone(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Transparent Celluloid");
                SkinEntry {
                    name: name.clone(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: true,
                    dragfactor: 0.6,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Treated Paper");
                SkinEntry {
                    name: name.clone(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: true,
                    dragfactor: 0.5,
                    massfactor: 0.75,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Tense Silk");
                SkinEntry {
                    name: name.clone(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        toughness: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Dragon Skin");
                SkinEntry {
                    name: name.clone(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Molded Plywood");
                SkinEntry {
                    name: name.clone(),
                    monocoque: true,
                    monocoque_structure: 3,
                    flammable: false,
                    dragfactor: 0.4,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 0.5,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Clinker Build");
                SkinEntry {
                    name: name.clone(),
                    monocoque: true,
                    monocoque_structure: -3,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Glass Reinforced Plastic");
                SkinEntry {
                    name: name.clone(),
                    monocoque: true,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.3,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Corrugated Duralumin");
                SkinEntry {
                    name: name.clone(),
                    monocoque: true,
                    monocoque_structure: 10,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Sheet");
                SkinEntry {
                    name: name.clone(),
                    monocoque: true,
                    monocoque_structure: 8,
                    flammable: false,
                    dragfactor: 0.35,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.5,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Aluminum Sheet");
                SkinEntry {
                    name: name.clone(),
                    monocoque: true,
                    monocoque_structure: 6,
                    flammable: false,
                    dragfactor: 0.35,
                    massfactor: 0.75,
                    stats: Stats {
                        cost: 2.,
                        toughness: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_tail: vec![
            {
                let name = lu!("Tailless");
                TailEntry {
                    name: name.clone(),
                    stats: Stats {
                        visibility: 3.,
                        pitchstab: -4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Stubby");
                TailEntry {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 1.,
                        pitchstab: -3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Standard");
                TailEntry {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Long");
                TailEntry {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 3.,
                        pitchstab: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        fuel_tanks: vec![
            {
                let name = lu!("Internal Fuselage Tank");
                TankEntry {
                    name: name.clone(),
                    internal: true,
                    cantilever: false,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        reqsections: 0.5,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("External Wing Tank");
                TankEntry {
                    name: name.clone(),
                    internal: false,
                    cantilever: false,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        drag: 3.,
                        control: -1.,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Internal Wing Tank");
                TankEntry {
                    name: name.clone(),
                    internal: true,
                    cantilever: true,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        control: -1.,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Microtank");
                TankEntry {
                    name: name.clone(),
                    internal: true,
                    cantilever: false,
                    stats: Stats {
                        mass: 1.,
                        fuel: 25.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cargo_space: vec![
            {
                let name = lu!("None");
                CargoSpace {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Tiny");
                CargoSpace {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Cargo Tiny"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Small");
                CargoSpace {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Cargo Small"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Medium");
                CargoSpace {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Cargo Medium"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Large");
                CargoSpace {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Cargo Large"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Huge");
                CargoSpace {
                    name: name.clone(),
                    stats: Stats {
                        reqsections: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Cargo Huge"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_decks: vec![
            {
                let name = lu!("Wing Deck Parasol");
                DeckEntry {
                    name: name.clone(),
                    limited: false,
                    stats: Stats {
                        liftbleed: -2.,
                        visibility: -1.,
                        pitchstab: 3.,
                        maxstrain: -10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Shoulder");
                DeckEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -1.,
                        visibility: -1.,
                        pitchstab: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Mid");
                DeckEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Low");
                DeckEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: -2.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Gear");
                DeckEntry {
                    name: name.clone(),
                    limited: false,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: -3.,
                        maxstrain: -10.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_largest: vec![
            {
                let name = lu!("Wing Deck Parasol");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: -1.,
                        latstab: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Shoulder");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Mid");
                LongestWingEntry {
                    dragfactor: 0.9,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Low");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: 2.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Deck Gear");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: 3.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_surface: vec![
            {
                let name = lu!("Cloth Canvas");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Treated Paper");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: true,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        mass: -0.25,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Tense Silk Layers");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 0.9,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        cost: 0.2,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Plywood");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 0.9,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        mass: 0.2,
                        cost: 0.1,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Aluminum Sheet");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 0.8,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        cost: 0.3,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Corrugated Duralumin");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 0.6,
                    dragfactor: 1.0,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        mass: 0.25,
                        cost: 0.2,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Thin Sheet Steel");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 0.6,
                    dragfactor: 0.9,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        mass: 0.2,
                        cost: 0.3,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Grand Eagle Feather");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        control: 0.2,
                        cost: 0.6,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Solar Fiber");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        cost: 0.4,
                        charge: 0.2,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Dragon Skin");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: false,
                    strainfactor: 0.4,
                    dragfactor: 1.0,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        cost: 0.8,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Transparent Celluloid");
                SurfaceEntry {
                    name: name.clone(),
                    flammable: true,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: true,
                    stats: Stats {
                        cost: 0.1,
                        toughness: -0.1,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_stagger: vec![
            {
                let name = lu!("Monoplane");
                StaggerEntry {
                    name: name.clone(),
                    inline: false,
                    wing_count: 1,
                    hstab: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Tandem");
                StaggerEntry {
                    name: name.clone(),
                    inline: true,
                    wing_count: 20,
                    hstab: false,
                    stats: Stats {
                        pitchstab: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Extreme Positive");
                StaggerEntry {
                    name: name.clone(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Positive");
                StaggerEntry {
                    name: name.clone(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Unstaggered");
                StaggerEntry {
                    name: name.clone(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Negative");
                StaggerEntry {
                    name: name.clone(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Extreme Negative");
                StaggerEntry {
                    name: name.clone(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        rotor_blades: vec![
            {
                let name = lu!("Two");
                BladeEntry {
                    name: name.clone(),
                    sizing: 1.05,
                    rotor_bleed: 0,
                    stats: Stats {
                        flightstress: 1.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Three");
                BladeEntry {
                    name: name.clone(),
                    sizing: 1.0,
                    rotor_bleed: 1,
                    stats: Stats {
                        cost: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Four");
                BladeEntry {
                    name: name.clone(),
                    sizing: 0.95,
                    rotor_bleed: 2,
                    stats: Stats {
                        cost: 4.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Five");
                BladeEntry {
                    name: name.clone(),
                    sizing: 0.9,
                    rotor_bleed: 3,
                    stats: Stats {
                        cost: 6.,
                        ..Stats::new()
                    },
                }
            },
        ],
        rotor_arrangement: vec![
            {
                let name = lu!("Single Rotor");
                ArrangementEntry {
                    name: name.clone(),
                    count: 1,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats { ..Stats::new() },
                }
            },
            {
                let name = lu!("Coaxial");
                ArrangementEntry {
                    name: name.clone(),
                    count: 2,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats {
                        cost: 2.,
                        reliability: -1.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Synchropter");
                ArrangementEntry {
                    name: name.clone(),
                    count: 2,
                    powerfactor: 0.95,
                    blades: 0,
                    stats: Stats {
                        cost: -2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Tandem");
                ArrangementEntry {
                    name: name.clone(),
                    count: 2,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats {
                        pitchstab: 4.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Transverse");
                ArrangementEntry {
                    name: name.clone(),
                    count: 2,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats {
                        latstab: 4.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Tandem Transverse");
                ArrangementEntry {
                    name: name.clone(),
                    count: 3,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats {
                        pitchstab: 4.,
                        latstab: 4.,
                        ..Stats::new()
                    },
                }
            },
        ],
        control_ailerons: vec![
            {
                let name = lu!("Flap Ailerons");
                AileronEntry {
                    name: name.clone(),
                    warping: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Warping");
                AileronEntry {
                    name: name.clone(),
                    warping: true,
                    stats: Stats {
                        drag: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Wing Warping Warning 2"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Spoilerons");
                AileronEntry {
                    name: name.clone(),
                    warping: false,
                    stats: Stats {
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Spoilerons Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("None");
                AileronEntry {
                    name: name.clone(),
                    warping: false,
                    stats: Stats {
                        control: -15.,
                        cost: -2.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_rudders: vec![
            {
                let name = lu!("Flap Rudder");
                RudderEntry {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Flying Rudder");
                RudderEntry {
                    name: name.clone(),
                    stats: Stats {
                        control: 3.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_elevators: vec![
            {
                let name = lu!("Flap Elevator");
                ElevatorEntry {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Flying Elevator");
                ElevatorEntry {
                    name: name.clone(),
                    stats: Stats {
                        control: 2.,
                        pitchstab: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_flaps: vec![
            {
                let name = lu!("None");
                FlapsEntry {
                    name: name.clone(),
                    costfactor: 0.0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Basic Flaps");
                FlapsEntry {
                    name: name.clone(),
                    costfactor: 0.333333333333,
                    stats: Stats {
                        liftbleed: -3.,
                        control: -3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Advanced Flaps");
                FlapsEntry {
                    name: name.clone(),
                    costfactor: 0.666666666666,
                    stats: Stats {
                        liftbleed: -5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Control Flaps");
                FlapsEntry {
                    name: name.clone(),
                    costfactor: 1.0,
                    stats: Stats {
                        liftbleed: -5.,
                        control: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Lift Dumpers");
                FlapsEntry {
                    name: name.clone(),
                    costfactor: 1.0,
                    stats: Stats {
                        crashsafety: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::LastHurrah,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Lift Dumpers Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_slats: vec![
            {
                let name = lu!("None");
                SlatsEntry {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Fixed Slots");
                SlatsEntry {
                    name: name.clone(),
                    stats: Stats {
                        liftbleed: -3.,
                        drag: 5.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Automatic Slats");
                SlatsEntry {
                    name: name.clone(),
                    stats: Stats {
                        liftbleed: -1.,
                        control: 3.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_drag: vec![
            {
                let name = lu!("Air Brake");
                DragInducerEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        cost: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Air Brake Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Dive Brake");
                DragInducerEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Dive Brake Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Drogue Chute");
                DragInducerEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::LastHurrah,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Drogue Chute Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_wood: vec![
            {
                let name = lu!("Parallel Struts");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 30,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("N-Strut");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 20,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 1.,
                        maxstrain: 8.,
                        structure: 6.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("V-Strut");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 30,
                    config: true,
                    first: true,
                    small_sqp: true,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("I-Strut");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 15,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        maxstrain: 20.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("W-Strut");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 0,
                    config: true,
                    first: true,
                    small_sqp: true,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 3.,
                        cost: 2.,
                        maxstrain: 35.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Single Strut");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 0,
                    config: true,
                    first: true,
                    small_sqp: true,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Star Strut");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 0,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 2.,
                        drag: 8.,
                        cost: 2.,
                        maxstrain: 30.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wing Truss");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 40,
                    config: false,
                    first: true,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        drag: 4.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Wire Root");
                ExternalWoodEntry {
                    name: name.clone(),
                    tension: 10,
                    config: true,
                    first: false,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_steel: vec![
            {
                let name = lu!("Steel Parallel Struts");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 15,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 2.,
                        maxstrain: 10.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel N-Strut");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 10,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 2.,
                        maxstrain: 13.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel V-Strut");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 15,
                    config: true,
                    first: true,
                    small_sqp: true,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel I-Strut");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 7,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel W-Strut");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 0,
                    config: true,
                    first: true,
                    small_sqp: true,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 3.,
                        cost: 4.,
                        maxstrain: 40.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Single Strut");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 0,
                    config: true,
                    first: true,
                    small_sqp: true,
                    ornith: false,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Star Strut");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 0,
                    config: true,
                    first: true,
                    small_sqp: false,
                    ornith: false,
                    stats: Stats {
                        mass: 2.,
                        drag: 6.,
                        cost: 4.,
                        maxstrain: 35.,
                        structure: 20.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Wing Truss");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 20,
                    config: false,
                    first: true,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        drag: 4.,
                        cost: 2.,
                        maxstrain: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Wire Root");
                ExternalSteelEntry {
                    name: name.clone(),
                    tension: 10,
                    config: true,
                    first: false,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_cabane: vec![
            {
                let name = lu!("None");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Parallel Struts");
                CabaneEntry {
                    name: name.clone(),
                    tension: 15,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Parallel Struts");
                CabaneEntry {
                    name: name.clone(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("N-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 10,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 8.,
                        structure: 6.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel N-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 5,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 13.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("V-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 15,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel V-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("I-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 20.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel I-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 3,
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("W-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        maxstrain: 35.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel W-Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 4.,
                        maxstrain: 40.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Single Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Single Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Star Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        mass: 2.,
                        drag: 6.,
                        cost: 2.,
                        maxstrain: 30.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel Star Strut");
                CabaneEntry {
                    name: name.clone(),
                    tension: 0,
                    stats: Stats {
                        mass: 2.,
                        drag: 4.,
                        cost: 4.,
                        maxstrain: 35.,
                        structure: 20.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_cantilever: vec![
            {
                let name = lu!("Birch");
                CantileverEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        toughness: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Duralumin");
                CantileverEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Steel");
                CantileverEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 3.,
                        maxstrain: 20.,
                        toughness: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Aluminium");
                CantileverEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Whalebone");
                CantileverEntry {
                    name: name.clone(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -3.,
                        mass: 1.,
                        cost: 8.,
                        maxstrain: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_electrical: vec![
            {
                let name = lu!("Windmill");
                ElectricalEntry {
                    name: name.clone(),
                    cp10s: 1.,
                    storage: 0,
                    stats: Stats {
                        drag: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Battery");
                ElectricalEntry {
                    name: name.clone(),
                    cp10s: 0.,
                    storage: 5,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Battery (High Quality)");
                ElectricalEntry {
                    name: name.clone(),
                    cp10s: 0.,
                    storage: 5,
                    stats: Stats {
                        cost: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_radios: vec![
            {
                let name = lu!("Loud Yelling");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Intercom System");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radio Receiver");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        drag: 2.,
                        cost: 3.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radio Transmitter");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 3.,
                        drag: 3.,
                        cost: 3.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radio Transceiver");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 5.,
                        drag: 3.,
                        cost: 3.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Whalebone Radio Receiver");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 5.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Whalebone Radio Base Station");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 6.,
                        drag: 1.,
                        cost: 12.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radio Receiver (High Quality)");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 6.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radio Transmitter (High Quality)");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        drag: 3.,
                        cost: 6.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radio Transceiver (High Quality)");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 4.,
                        drag: 3.,
                        cost: 6.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Whalebone Radio Base Station (High Quality)");
                RadioEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 5.,
                        drag: 1.,
                        cost: 24.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_recon: vec![
            {
                let name = lu!("Guncam");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Guncam Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Small Reconnaissance Camera");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Small Reconnaissance Camera Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Medium Reconnaissance Camera");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        drag: 2.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Medium Reconnaissance Camera Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Large Reconnaissance Camera");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 3.,
                        drag: 3.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Large Reconnaissance Camera Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Internal Small Reconnaissance Camera");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Small Reconnaissance Camera Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Internal Medium Reconnaissance Camera");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 2.,
                        cost: 2.,
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Medium Reconnaissance Camera Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Internal Large Reconnaissance Camera");
                ReconEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 3.,
                        cost: 2.,
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Large Reconnaissance Camera Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_visibility: vec![
            {
                let name = lu!("Wing Cutouts");
                VisibilityEntry {
                    name: name.clone(),
                    stats: Stats {
                        liftbleed: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Hull Cutouts");
                VisibilityEntry {
                    name: name.clone(),
                    stats: Stats {
                        visibility: 1.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Searchlight");
                VisibilityEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_climate: vec![
            {
                let name = lu!("Electric Heating");
                ClimateEntry {
                    name: name.clone(),
                    req_radiator: false,
                    stats: Stats {
                        cost: 1.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Radiator Loop");
                ClimateEntry {
                    name: name.clone(),
                    req_radiator: true,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Air Conditioning");
                ClimateEntry {
                    name: name.clone(),
                    req_radiator: false,
                    stats: Stats {
                        cost: 4.,
                        charge: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_autopilots: vec![
            {
                let name = lu!("None");
                AutopilotEntry {
                    name: name.clone(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Gyroscopic");
                AutopilotEntry {
                    name: name.clone(),
                    stats: Stats {
                        cost: 3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Gyroscopic Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Altitude Holding");
                AutopilotEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        cost: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Altitude Holding Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Clockwork Programmable");
                AutopilotEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        cost: 6.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Clockwork Programmable Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Programmable");
                AutopilotEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 1.,
                        cost: 6.,
                        charge: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Programmable Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Rattenhirn");
                AutopilotEntry {
                    name: name.clone(),
                    stats: Stats {
                        mass: 3.,
                        cost: 25.,
                        charge: -3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Himmilgard,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Rattenhirn Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_control: vec![
            {
                let name = lu!("None");
                ControlEntry {
                    name: name.clone(),
                    max_mass_stress: 1000,
                    max_total_stress: 1000,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Control Rods");
                ControlEntry {
                    name: name.clone(),
                    max_mass_stress: 1,
                    max_total_stress: 1000,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Hydraulic-Assisted");
                ControlEntry {
                    name: name.clone(),
                    max_mass_stress: 0,
                    max_total_stress: 1000,
                    stats: Stats {
                        mass: 3.,
                        cost: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Fly by Wire");
                ControlEntry {
                    name: name.clone(),
                    max_mass_stress: 0,
                    max_total_stress: 0,
                    stats: Stats {
                        mass: 3.,
                        cost: 10.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        stabilizers_hstab: vec![
            {
                let name = lu!("Tailplane");
                HStabEntry {
                    name: name.clone(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("The Wings");
                HStabEntry {
                    name: name.clone(),
                    is_canard: false,
                    increment: 0,
                    dragfactor: 0.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Canards");
                HStabEntry {
                    name: name.clone(),
                    is_canard: true,
                    increment: 1,
                    dragfactor: 0.5,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        pitchstab: -3.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Outboard");
                HStabEntry {
                    name: name.clone(),
                    is_canard: false,
                    increment: 2,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        latstab: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("V-Tail");
                HStabEntry {
                    name: name.clone(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 0.8,
                    is_vtail: true,
                    is_tail: true,
                    stats: Stats {
                        cost: 5.,
                        pitchstab: 2.,
                        latstab: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("T-Tail");
                HStabEntry {
                    name: name.clone(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 0.5,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        liftbleed: -2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("T-Tail Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        stabilizers_vstab: vec![
            {
                let name = lu!("Tailfin");
                VStabEntry {
                    name: name.clone(),
                    increment: 1,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Outboard");
                VStabEntry {
                    name: name.clone(),
                    increment: 2,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        control: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("V-Tail");
                VStabEntry {
                    name: name.clone(),
                    increment: 0,
                    dragfactor: 0.,
                    is_vtail: true,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        landing_gear_types: vec![
            {
                let name = lu!("Landing Gear");
                GearEntry {
                    name: name.clone(),
                    dplmp: 1.,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Floats");
                GearEntry {
                    name: name.clone(),
                    dplmp: 1.5,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Hybrid Floats");
                GearEntry {
                    name: name.clone(),
                    dplmp: 2.,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Boat Hull");
                GearEntry {
                    name: name.clone(),
                    dplmp: 1.,
                    splmp: 1.,
                    can_retract: false,
                    stats: Stats {
                        mass: 5.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Landing Skid");
                GearEntry {
                    name: name.clone(),
                    dplmp: 0.,
                    splmp: 0.,
                    can_retract: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Landing Skid Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        landing_gear_extras: vec![
            {
                let name = lu!("Zeppelin Hook");
                ExtraEntry {
                    name: name.clone(),
                    mplmp: 0.,
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Zeppelin Hook Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Carrier Hook");
                ExtraEntry {
                    name: name.clone(),
                    mplmp: 0.5,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.clone(),
                            warning: lu!("Carrier Hook Warning"),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = lu!("Underwing Skid");
                ExtraEntry {
                    name: name.clone(),
                    mplmp: 0.,
                    stats: Stats {
                        drag: 3.,
                        crashsafety: 2.,
                        eras: vec![Era {
                            name: name.clone(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
    }
}
