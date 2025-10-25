use crate::{
    cockpits::{CockpitType, GunsightType, SafetyType, UpgradeType},
    engines::{Cowl, Mount, MountType, RadiatorCoolant, RadiatorMount, RadiatorType},
    era::EraVal,
    lu,
    stats::{Era, Stats, Warning, WarningLevel, ERA},
};

pub struct PartList {
    pub version: f64,
    pub era: Vec<EraVal>,

    pub cockpit_type: Vec<CockpitType>,
    pub cockpit_upgrades: Vec<UpgradeType>,
    pub cockpit_safety: Vec<SafetyType>,
    pub cockpit_gunsights: Vec<GunsightType>,

    pub engine_mounts: Vec<Mount>,
    pub engine_cowls: Vec<Cowl>,
    pub radiator_types: Vec<RadiatorType>,
    pub radiator_mounts: Vec<RadiatorMount>,
    pub radiator_coolants: Vec<RadiatorCoolant>,
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
                CockpitType {
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
                CockpitType {
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
                CockpitType {
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
                CockpitType {
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
                CockpitType {
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
                UpgradeType {
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
                UpgradeType {
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
                UpgradeType {
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
                UpgradeType {
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
                UpgradeType {
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
                UpgradeType {
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
                SafetyType {
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
                SafetyType {
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
                SafetyType {
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
                SafetyType {
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
                SafetyType {
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
                SafetyType {
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
                GunsightType {
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
                GunsightType {
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
                GunsightType {
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
                GunsightType {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Mount {
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
                Cowl {
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
                Cowl {
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
                Cowl {
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
                Cowl {
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
                Cowl {
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
                Cowl {
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
                Cowl {
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
                RadiatorType {
                    name: name.clone(),
                    drag_per_cool: 0.5,
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
                RadiatorType {
                    name: name.clone(),
                    drag_per_cool: 0.5,
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
                RadiatorType {
                    name: name.clone(),
                    drag_per_cool: 0.5,
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
                RadiatorType {
                    name: name.clone(),
                    drag_per_cool: 0.,
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
                RadiatorMount {
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
                RadiatorMount {
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
                RadiatorMount {
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
                RadiatorMount {
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: false,
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: true,
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: true,
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: false,
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: false,
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: false,
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
                RadiatorCoolant {
                    name: name.clone(),
                    hard: false,
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
    }
}
