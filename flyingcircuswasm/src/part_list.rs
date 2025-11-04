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
    era::EraEntry,
    frames::{FrameEntry, SkinEntry, TailEntry},
    fuel::TankEntry,
    landing_gear::{ExtraEntry, GearEntry},
    propeller::{PropellerEntry, UpgradeEntry},
    radiator::{RadiatorCoolantEntry, RadiatorEntry, RadiatorMountEntry},
    reinforcements::{CabaneEntry, CantileverEntry, ExternalSteelEntry, ExternalWoodEntry},
    rotor::{ArrangementEntry, BladeEntry},
    stabilizers::{HStabEntry, VStabEntry},
    stats::{Era, Stats, Warning, WarningLevel, ERA},
    wings::{DeckEntry, LongestWingEntry, StaggerEntry, SurfaceEntry},
};
use rust_i18n::t;

pub struct PartList {
    pub version: String,
    pub era: Vec<EraEntry>,

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
        version: "12.7".to_string(),
        era: vec![
            {
                let name = t!("Pioneer");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.166666666666,
                    cant_lift: 4,
                    stats: Stats {
                        liftbleed: 30.,
                        cost: -2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("WWI");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.2,
                    cant_lift: 3,
                    stats: Stats {
                        liftbleed: 25.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Roaring 20s");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.25,
                    cant_lift: 1,
                    stats: Stats {
                        liftbleed: 22.,
                        cost: 5.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Coming Storm");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.333333333333,
                    cant_lift: 0,
                    stats: Stats {
                        liftbleed: 22.,
                        cost: 10.,
                        pitchstab: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("WWII");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.333333333333,
                    cant_lift: 0,
                    stats: Stats {
                        liftbleed: 20.,
                        cost: 15.,
                        pitchstab: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Last Hurrah");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.5,
                    cant_lift: 0,
                    stats: Stats {
                        liftbleed: 18.,
                        cost: 20.,
                        pitchstab: 2.,
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_type: vec![
            {
                let name = t!("Open");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: true,
                    stats: Stats {
                        mass: 1.,
                        drag: 3.,
                        visibility: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Windscreen");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: true,
                    stats: Stats {
                        mass: 2.,
                        drag: 1.,
                        cost: 1.,
                        visibility: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Sealed");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: false,
                    stats: Stats {
                        mass: 2.,
                        cost: 1.,
                        visibility: -99.,
                        flightstress: -1.,
                        escape: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Sealed Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Narrow Canopy");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: false,
                    stats: Stats {
                        mass: 3.,
                        cost: 3.,
                        visibility: -1.,
                        flightstress: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Bubble Canopy");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: false,
                    stats: Stats {
                        mass: 3.,
                        drag: -3.,
                        cost: 8.,
                        flightstress: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_upgrades: vec![
            {
                let name = t!("Co-Pilot Controls");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        flightstress: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Escape Hatch");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        escape: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Ejection Seat");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        cost: 4.,
                        escape: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Connectivity");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Connectivity Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Oxygen Mask");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 2.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Oxygen Mask Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Isolated");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        drag: 5.,
                        cost: 1.,
                        visibility: 2.,
                        flightstress: 1.,
                        escape: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Isolated Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_safety: vec![
            {
                let name = t!("Padding");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Injury Reduction Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Harness");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        escape: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Injury Reduction Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fast Release System");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Roll Bar");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Injury Reduction Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Flare Slot");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Flare Slot Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Basic Fan");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        visibility: -1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Basic Fan Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_gunsights: vec![
            {
                let name = t!("X1 Collimated Gunsight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 1,
                    stats: Stats {
                        cost: 2.,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("X1 Collimated Gunsight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Telescopic Gunsight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 0,
                    stats: Stats {
                        cost: 3.,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Telescopic Gunsight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Illuminated Reflex Sight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 2,
                    stats: Stats {
                        cost: 6.,
                        visibility: -1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Illuminated Reflex Sight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Gyro Gunsight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 2,
                    stats: Stats {
                        cost: 12.,
                        visibility: -1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Gyro Gunsight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        engine_mounts: vec![
            {
                let name = t!("Tractor");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Center-Mounted Tractor");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Rear-Mounted Pusher");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Center-Mounted Pusher");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Pod");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Nacelle (Inside)");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Nacelle (Offset)");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Channel Tractor");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fuselage Push-Pull");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Front Intake");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Pod");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Underwing Pod");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        engine_cowls: vec![
            {
                let name = t!("No Cowling");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 1.,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: true,
                    for_rotary: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Basic Cowl");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 0.8,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: false,
                    for_rotary: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Rotary Basic Cowl");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 0.4,
                    mass_per_drag: 0.,
                    for_air_cooled: false,
                    for_liquid_cooled: false,
                    for_rotary: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Closed Cowl");
                CowlEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Adjustable Slat Cowl");
                CowlEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Foil Cowl");
                CowlEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Sealed Cowl");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 0.5,
                    mass_per_drag: 0.333333333333,
                    for_air_cooled: false,
                    for_liquid_cooled: true,
                    for_rotary: false,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_types: vec![
            {
                let name = t!("Panel");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.5,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Box");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.5,
                    stats: Stats {
                        mass: -1.,
                        drag: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Intake");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.5,
                    stats: Stats {
                        cost: 3.,
                        cooling: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Evaporation");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Evaporation Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_mounts: vec![
            {
                let name = t!("Low");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reliability: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Low Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Inline");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("High");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        drag: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("High Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("High Offset");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        drag: 1.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("High Offset Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_coolants: vec![
            {
                let name = t!("Water");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Salt Water");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: true,
                    flammable: false,
                    stats: Stats {
                        cost: 1.,
                        reliability: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Mineral Oil");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: true,
                    flammable: true,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Mineral Oil Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Castor Oil");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Castor Oil Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Glycol");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 2.,
                        reliability: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Freon");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 3.,
                        reliability: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Freon Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Ammonia");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 2.,
                        reliability: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Ammonia Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        propeller_props: vec![
            {
                let name = t!("High Power");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 1.5,
                    turn: 8.0,
                    stats: Stats {
                        pitchboost: 0.9,
                        pitchspeed: 0.8,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Power");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 2.0,
                    turn: 7.0,
                    stats: Stats {
                        pitchboost: 0.8,
                        pitchspeed: 0.9,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Default");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 3.0,
                    turn: 6.0,
                    stats: Stats {
                        pitchboost: 0.6,
                        pitchspeed: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Speed");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 4.0,
                    turn: 5.0,
                    stats: Stats {
                        pitchboost: 0.4,
                        pitchspeed: 1.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("High Speed");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 4.5,
                    turn: 4.0,
                    stats: Stats {
                        pitchboost: 0.3,
                        pitchspeed: 1.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        propeller_upgrades: vec![
            {
                let name = t!("None");
                UpgradeEntry {
                    name: name.to_string(),
                    energy: 0.0,
                    turn: 0.0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Manually Adjustable Pitch");
                UpgradeEntry {
                    name: name.to_string(),
                    energy: 0.0,
                    turn: 0.0,
                    stats: Stats {
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("MVP_Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Automatic Pitch");
                UpgradeEntry {
                    name: name.to_string(),
                    energy: 0.5,
                    turn: 1.0,
                    stats: Stats {
                        mass: 1.,
                        cost: 8.,
                        pitchboost: 0.1,
                        pitchspeed: 0.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_frames: vec![
            {
                let name = t!("Wooden Spars");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 15,
                    basecost: 0,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        structure: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Spars");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 25,
                    basecost: 1,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Spars");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 20,
                    basecost: 2,
                    geodesic: false,
                    stats: Stats {
                        mass: 0.5,
                        cost: 2.,
                        structure: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wooden Ribs");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 30,
                    basecost: 1,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 0.5,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Ribs");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 60,
                    basecost: 2,
                    geodesic: true,
                    stats: Stats {
                        mass: 3.,
                        cost: 2.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Ribs");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 50,
                    basecost: 3,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 3.,
                        structure: 8.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Titanium");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 0,
                    basecost: 0,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 8.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Living Grove");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 30,
                    basecost: 8,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        structure: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Living Grove Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_skin: vec![
            {
                let name = t!("Naked");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 1.,
                    massfactor: 0.6,
                    stats: Stats {
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Cloth Canvas");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Transparent Celluloid");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: true,
                    dragfactor: 0.6,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Treated Paper");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: true,
                    dragfactor: 0.5,
                    massfactor: 0.75,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tense Silk");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        toughness: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Dragon Skin");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Molded Plywood");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 3,
                    flammable: false,
                    dragfactor: 0.4,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 0.5,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Clinker Build");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: -3,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Glass Reinforced Plastic");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.3,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Corrugated Duralumin");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 10,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Sheet");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 8,
                    flammable: false,
                    dragfactor: 0.35,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.5,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Sheet");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 6,
                    flammable: false,
                    dragfactor: 0.35,
                    massfactor: 0.75,
                    stats: Stats {
                        cost: 2.,
                        toughness: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_tail: vec![
            {
                let name = t!("Tailless");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        visibility: 3.,
                        pitchstab: -4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Stubby");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 1.,
                        pitchstab: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Standard");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Long");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 3.,
                        pitchstab: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        fuel_tanks: vec![
            {
                let name = t!("Internal Fuselage Tank");
                TankEntry {
                    name: name.to_string(),
                    internal: true,
                    cantilever: false,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        reqsections: 0.5,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("External Wing Tank");
                TankEntry {
                    name: name.to_string(),
                    internal: false,
                    cantilever: false,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        drag: 3.,
                        control: -1.,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Wing Tank");
                TankEntry {
                    name: name.to_string(),
                    internal: true,
                    cantilever: true,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        control: -1.,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Microtank");
                TankEntry {
                    name: name.to_string(),
                    internal: true,
                    cantilever: false,
                    stats: Stats {
                        mass: 1.,
                        fuel: 25.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cargo_space: vec![
            {
                let name = t!("None");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tiny");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Tiny").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Small");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Small").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Medium");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Medium").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Large");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Large").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Huge");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Huge").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_decks: vec![
            {
                let name = t!("Wing Deck Parasol");
                DeckEntry {
                    name: name.to_string(),
                    limited: false,
                    stats: Stats {
                        liftbleed: -2.,
                        visibility: -1.,
                        pitchstab: 3.,
                        maxstrain: -10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Shoulder");
                DeckEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -1.,
                        visibility: -1.,
                        pitchstab: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Mid");
                DeckEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Low");
                DeckEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: -2.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Gear");
                DeckEntry {
                    name: name.to_string(),
                    limited: false,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: -3.,
                        maxstrain: -10.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_largest: vec![
            {
                let name = t!("Wing Deck Parasol");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: -1.,
                        latstab: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Shoulder");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Mid");
                LongestWingEntry {
                    dragfactor: 0.9,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Low");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: 2.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Gear");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: 3.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_surface: vec![
            {
                let name = t!("Cloth Canvas");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Treated Paper");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: true,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        mass: -0.25,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tense Silk Layers");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.9,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        cost: 0.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Plywood");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.9,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        mass: 0.2,
                        cost: 0.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Sheet");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 0.8,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        cost: 0.3,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Corrugated Duralumin");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.6,
                    dragfactor: 1.0,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        mass: 0.25,
                        cost: 0.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Thin Sheet Steel");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.6,
                    dragfactor: 0.9,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        mass: 0.2,
                        cost: 0.3,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Grand Eagle Feather");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        control: 0.2,
                        cost: 0.6,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Solar Fiber");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        cost: 0.4,
                        charge: 0.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Dragon Skin");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.4,
                    dragfactor: 1.0,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        cost: 0.8,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Transparent Celluloid");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: true,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: true,
                    stats: Stats {
                        cost: 0.1,
                        toughness: -0.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_stagger: vec![
            {
                let name = t!("Monoplane");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 1,
                    hstab: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tandem");
                StaggerEntry {
                    name: name.to_string(),
                    inline: true,
                    wing_count: 20,
                    hstab: false,
                    stats: Stats {
                        pitchstab: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Extreme Positive");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Positive");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Unstaggered");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Negative");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Extreme Negative");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        rotor_blades: vec![
            {
                let name = t!("Two");
                BladeEntry {
                    name: name.to_string(),
                    sizing: 1.05,
                    rotor_bleed: 0,
                    stats: Stats {
                        flightstress: 1.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Three");
                BladeEntry {
                    name: name.to_string(),
                    sizing: 1.0,
                    rotor_bleed: 1,
                    stats: Stats {
                        cost: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Four");
                BladeEntry {
                    name: name.to_string(),
                    sizing: 0.95,
                    rotor_bleed: 2,
                    stats: Stats {
                        cost: 4.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Five");
                BladeEntry {
                    name: name.to_string(),
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
                let name = t!("Single Rotor");
                ArrangementEntry {
                    name: name.to_string(),
                    count: 1,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats { ..Stats::new() },
                }
            },
            {
                let name = t!("Coaxial");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Synchropter");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Tandem");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Transverse");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Tandem Transverse");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Flap Ailerons");
                AileronEntry {
                    name: name.to_string(),
                    warping: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Warping");
                AileronEntry {
                    name: name.to_string(),
                    warping: true,
                    stats: Stats {
                        drag: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Wing Warping Warning 2").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Spoilerons");
                AileronEntry {
                    name: name.to_string(),
                    warping: false,
                    stats: Stats {
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Spoilerons Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("None");
                AileronEntry {
                    name: name.to_string(),
                    warping: false,
                    stats: Stats {
                        control: -15.,
                        cost: -2.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_rudders: vec![
            {
                let name = t!("Flap Rudder");
                RudderEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Flying Rudder");
                RudderEntry {
                    name: name.to_string(),
                    stats: Stats {
                        control: 3.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_elevators: vec![
            {
                let name = t!("Flap Elevator");
                ElevatorEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Flying Elevator");
                ElevatorEntry {
                    name: name.to_string(),
                    stats: Stats {
                        control: 2.,
                        pitchstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_flaps: vec![
            {
                let name = t!("None");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 0.0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Basic Flaps");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 0.333333333333,
                    stats: Stats {
                        liftbleed: -3.,
                        control: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Advanced Flaps");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 0.666666666666,
                    stats: Stats {
                        liftbleed: -5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Control Flaps");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 1.0,
                    stats: Stats {
                        liftbleed: -5.,
                        control: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Lift Dumpers");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 1.0,
                    stats: Stats {
                        crashsafety: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Lift Dumpers Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_slats: vec![
            {
                let name = t!("None");
                SlatsEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fixed Slots");
                SlatsEntry {
                    name: name.to_string(),
                    stats: Stats {
                        liftbleed: -3.,
                        drag: 5.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Automatic Slats");
                SlatsEntry {
                    name: name.to_string(),
                    stats: Stats {
                        liftbleed: -1.,
                        control: 3.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_drag: vec![
            {
                let name = t!("Air Brake");
                DragInducerEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Air Brake Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Dive Brake");
                DragInducerEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Dive Brake Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Drogue Chute");
                DragInducerEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Drogue Chute Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_wood: vec![
            {
                let name = t!("Parallel Struts");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("N-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("I-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("W-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Single Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Star Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Truss");
                ExternalWoodEntry {
                    name: name.to_string(),
                    tension: 40,
                    config: false,
                    first: true,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        drag: 4.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wire Root");
                ExternalWoodEntry {
                    name: name.to_string(),
                    tension: 10,
                    config: true,
                    first: false,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_steel: vec![
            {
                let name = t!("Steel Parallel Struts");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel N-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel V-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel I-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel W-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Single Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Star Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Wing Truss");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Wire Root");
                ExternalSteelEntry {
                    name: name.to_string(),
                    tension: 10,
                    config: true,
                    first: false,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_cabane: vec![
            {
                let name = t!("None");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Parallel Struts");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 15,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Parallel Struts");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("N-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 10,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 8.,
                        structure: 6.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel N-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 5,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 13.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 15,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel V-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("I-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 20.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel I-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 3,
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("W-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        maxstrain: 35.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel W-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 4.,
                        maxstrain: 40.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Single Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Single Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Star Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 2.,
                        drag: 6.,
                        cost: 2.,
                        maxstrain: 30.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Star Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 2.,
                        drag: 4.,
                        cost: 4.,
                        maxstrain: 35.,
                        structure: 20.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_cantilever: vec![
            {
                let name = t!("Birch");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        toughness: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Duralumin");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 3.,
                        maxstrain: 20.,
                        toughness: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminium");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -3.,
                        mass: 1.,
                        cost: 8.,
                        maxstrain: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_electrical: vec![
            {
                let name = t!("Windmill");
                ElectricalEntry {
                    name: name.to_string(),
                    cp10s: 1.,
                    storage: 0,
                    stats: Stats {
                        drag: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Battery");
                ElectricalEntry {
                    name: name.to_string(),
                    cp10s: 0.,
                    storage: 5,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Battery (High Quality)");
                ElectricalEntry {
                    name: name.to_string(),
                    cp10s: 0.,
                    storage: 5,
                    stats: Stats {
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_radios: vec![
            {
                let name = t!("Loud Yelling");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Intercom System");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Receiver");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        drag: 2.,
                        cost: 3.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transmitter");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        drag: 3.,
                        cost: 3.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transceiver");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 5.,
                        drag: 3.,
                        cost: 3.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone Radio Receiver");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 5.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone Radio Base Station");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 6.,
                        drag: 1.,
                        cost: 12.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Receiver (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 6.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transmitter (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        drag: 3.,
                        cost: 6.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transceiver (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 4.,
                        drag: 3.,
                        cost: 6.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone Radio Base Station (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 5.,
                        drag: 1.,
                        cost: 24.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_recon: vec![
            {
                let name = t!("Guncam");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Guncam Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Small Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Small Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Medium Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        drag: 2.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Medium Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Large Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        drag: 3.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Large Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Small Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Small Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Medium Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        cost: 2.,
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Medium Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Large Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        cost: 2.,
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Large Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_visibility: vec![
            {
                let name = t!("Wing Cutouts");
                VisibilityEntry {
                    name: name.to_string(),
                    stats: Stats {
                        liftbleed: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Hull Cutouts");
                VisibilityEntry {
                    name: name.to_string(),
                    stats: Stats {
                        visibility: 1.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Searchlight");
                VisibilityEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_climate: vec![
            {
                let name = t!("Electric Heating");
                ClimateEntry {
                    name: name.to_string(),
                    req_radiator: false,
                    stats: Stats {
                        cost: 1.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radiator Loop");
                ClimateEntry {
                    name: name.to_string(),
                    req_radiator: true,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Air Conditioning");
                ClimateEntry {
                    name: name.to_string(),
                    req_radiator: false,
                    stats: Stats {
                        cost: 4.,
                        charge: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_autopilots: vec![
            {
                let name = t!("None");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Gyroscopic");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Gyroscopic Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Altitude Holding");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Altitude Holding Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Clockwork Programmable");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 6.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Clockwork Programmable Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Programmable");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 6.,
                        charge: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Programmable Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Rattenhirn");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        cost: 25.,
                        charge: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Rattenhirn Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_control: vec![
            {
                let name = t!("None");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 1000,
                    max_total_stress: 1000,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Control Rods");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 1,
                    max_total_stress: 1000,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Hydraulic-Assisted");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 0,
                    max_total_stress: 1000,
                    stats: Stats {
                        mass: 3.,
                        cost: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fly by Wire");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 0,
                    max_total_stress: 0,
                    stats: Stats {
                        mass: 3.,
                        cost: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        stabilizers_hstab: vec![
            {
                let name = t!("Tailplane");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("The Wings");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 0,
                    dragfactor: 0.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Canards");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: true,
                    increment: 1,
                    dragfactor: 0.5,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        pitchstab: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Outboard");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 2,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        latstab: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Tail");
                HStabEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("T-Tail");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 0.5,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        liftbleed: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("T-Tail Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        stabilizers_vstab: vec![
            {
                let name = t!("Tailfin");
                VStabEntry {
                    name: name.to_string(),
                    increment: 1,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Outboard");
                VStabEntry {
                    name: name.to_string(),
                    increment: 2,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        control: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Tail");
                VStabEntry {
                    name: name.to_string(),
                    increment: 0,
                    dragfactor: 0.,
                    is_vtail: true,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        landing_gear_types: vec![
            {
                let name = t!("Landing Gear");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 1.,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Floats");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 1.5,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Hybrid Floats");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 2.,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Boat Hull");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 1.,
                    splmp: 1.,
                    can_retract: false,
                    stats: Stats {
                        mass: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Landing Skid");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 0.,
                    splmp: 0.,
                    can_retract: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Landing Skid Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        landing_gear_extras: vec![
            {
                let name = t!("Zeppelin Hook");
                ExtraEntry {
                    name: name.to_string(),
                    mplmp: 0.,
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Zeppelin Hook Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Carrier Hook");
                ExtraEntry {
                    name: name.to_string(),
                    mplmp: 0.5,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Carrier Hook Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Underwing Skid");
                ExtraEntry {
                    name: name.to_string(),
                    mplmp: 0.,
                    stats: Stats {
                        drag: 3.,
                        crashsafety: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        dummy_vec: vec![],
    }
}

pub fn get_part_list2() -> PartList {
    PartList {
        version: "12.7".to_string(),
        era: vec![
            {
                let name = t!("Pioneer");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.166666666666,
                    cant_lift: 4,
                    stats: Stats {
                        liftbleed: 30.,
                        cost: -2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("WWI");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.2,
                    cant_lift: 3,
                    stats: Stats {
                        liftbleed: 25.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Roaring 20s");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.25,
                    cant_lift: 1,
                    stats: Stats {
                        liftbleed: 22.,
                        cost: 5.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Coming Storm");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.333333333333,
                    cant_lift: 0,
                    stats: Stats {
                        liftbleed: 22.,
                        cost: 10.,
                        pitchstab: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("WWII");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.333333333333,
                    cant_lift: 0,
                    stats: Stats {
                        liftbleed: 20.,
                        cost: 15.,
                        pitchstab: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Last Hurrah");
                EraEntry {
                    name: name.to_string(),
                    maxbomb: 0.5,
                    cant_lift: 0,
                    stats: Stats {
                        liftbleed: 18.,
                        cost: 20.,
                        pitchstab: 2.,
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_type: vec![
            {
                let name = t!("Open");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: true,
                    stats: Stats {
                        mass: 1.,
                        drag: 3.,
                        visibility: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Windscreen");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: true,
                    stats: Stats {
                        mass: 2.,
                        drag: 1.,
                        cost: 1.,
                        visibility: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Sealed");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: false,
                    stats: Stats {
                        mass: 2.,
                        cost: 1.,
                        visibility: -99.,
                        flightstress: -1.,
                        escape: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Sealed Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Narrow Canopy");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: false,
                    stats: Stats {
                        mass: 3.,
                        cost: 3.,
                        visibility: -1.,
                        flightstress: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Bubble Canopy");
                CockpitEntry {
                    name: name.to_string(),
                    exposed: false,
                    stats: Stats {
                        mass: 3.,
                        drag: -3.,
                        cost: 8.,
                        flightstress: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_upgrades: vec![
            {
                let name = t!("Co-Pilot Controls");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        flightstress: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Escape Hatch");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        escape: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Ejection Seat");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        cost: 4.,
                        escape: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Connectivity");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Connectivity Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Oxygen Mask");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 2.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Oxygen Mask Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Isolated");
                CockpitUpgradeEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        drag: 5.,
                        cost: 1.,
                        visibility: 2.,
                        flightstress: 1.,
                        escape: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Isolated Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_safety: vec![
            {
                let name = t!("Padding");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Injury Reduction Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Harness");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        escape: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Injury Reduction Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fast Release System");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        escape: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Roll Bar");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Injury Reduction Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Flare Slot");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Flare Slot Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Basic Fan");
                SafetyEntry {
                    name: name.to_string(),
                    stats: Stats {
                        visibility: -1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Basic Fan Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cockpit_gunsights: vec![
            {
                let name = t!("X1 Collimated Gunsight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 1,
                    stats: Stats {
                        cost: 2.,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("X1 Collimated Gunsight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Telescopic Gunsight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 0,
                    stats: Stats {
                        cost: 3.,
                        visibility: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Telescopic Gunsight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Illuminated Reflex Sight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 2,
                    stats: Stats {
                        cost: 6.,
                        visibility: -1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Illuminated Reflex Sight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Gyro Gunsight");
                GunsightEntry {
                    name: name.to_string(),
                    attack: 2,
                    stats: Stats {
                        cost: 12.,
                        visibility: -1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Gyro Gunsight Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        engine_mounts: vec![
            {
                let name = t!("Tractor");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Center-Mounted Tractor");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Rear-Mounted Pusher");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Center-Mounted Pusher");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Pod");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Nacelle (Inside)");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Nacelle (Offset)");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Channel Tractor");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fuselage Push-Pull");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Front Intake");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Pod");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Underwing Pod");
                MountEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        engine_cowls: vec![
            {
                let name = t!("No Cowling");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 1.,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: true,
                    for_rotary: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Basic Cowl");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 0.8,
                    mass_per_drag: 0.,
                    for_air_cooled: true,
                    for_liquid_cooled: false,
                    for_rotary: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Rotary Basic Cowl");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 0.4,
                    mass_per_drag: 0.,
                    for_air_cooled: false,
                    for_liquid_cooled: false,
                    for_rotary: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Closed Cowl");
                CowlEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Adjustable Slat Cowl");
                CowlEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Foil Cowl");
                CowlEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Sealed Cowl");
                CowlEntry {
                    name: name.to_string(),
                    drag_factor: 0.5,
                    mass_per_drag: 0.333333333333,
                    for_air_cooled: false,
                    for_liquid_cooled: true,
                    for_rotary: false,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_types: vec![
            {
                let name = t!("Panel");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.5,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Box");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.5,
                    stats: Stats {
                        mass: -1.,
                        drag: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Intake");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.5,
                    stats: Stats {
                        cost: 3.,
                        cooling: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Evaporation");
                RadiatorEntry {
                    name: name.to_string(),
                    dragpercool: 0.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Evaporation Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_mounts: vec![
            {
                let name = t!("Low");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reliability: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Low Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Inline");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("High");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        drag: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("High Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("High Offset");
                RadiatorMountEntry {
                    name: name.to_string(),
                    stats: Stats {
                        drag: 1.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("High Offset Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        radiator_coolants: vec![
            {
                let name = t!("Water");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Salt Water");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: true,
                    flammable: false,
                    stats: Stats {
                        cost: 1.,
                        reliability: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Mineral Oil");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: true,
                    flammable: true,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Mineral Oil Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Castor Oil");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Castor Oil Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Glycol");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 2.,
                        reliability: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Freon");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 3.,
                        reliability: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Freon Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Ammonia");
                RadiatorCoolantEntry {
                    name: name.to_string(),
                    harden: false,
                    flammable: false,
                    stats: Stats {
                        cost: 2.,
                        reliability: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Ammonia Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        propeller_props: vec![
            {
                let name = t!("High Power");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 1.5,
                    turn: 8.0,
                    stats: Stats {
                        pitchboost: 0.9,
                        pitchspeed: 0.8,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Power");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 2.0,
                    turn: 7.0,
                    stats: Stats {
                        pitchboost: 0.8,
                        pitchspeed: 0.9,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Default");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 3.0,
                    turn: 6.0,
                    stats: Stats {
                        pitchboost: 0.6,
                        pitchspeed: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Speed");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 4.0,
                    turn: 5.0,
                    stats: Stats {
                        pitchboost: 0.4,
                        pitchspeed: 1.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("High Speed");
                PropellerEntry {
                    name: name.to_string(),
                    energy: 4.5,
                    turn: 4.0,
                    stats: Stats {
                        pitchboost: 0.3,
                        pitchspeed: 1.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        propeller_upgrades: vec![
            {
                let name = t!("None");
                UpgradeEntry {
                    name: name.to_string(),
                    energy: 0.0,
                    turn: 0.0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Manually Adjustable Pitch");
                UpgradeEntry {
                    name: name.to_string(),
                    energy: 0.0,
                    turn: 0.0,
                    stats: Stats {
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("MVP_Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Automatic Pitch");
                UpgradeEntry {
                    name: name.to_string(),
                    energy: 0.5,
                    turn: 1.0,
                    stats: Stats {
                        mass: 1.,
                        cost: 8.,
                        pitchboost: 0.1,
                        pitchspeed: 0.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_frames: vec![
            {
                let name = t!("Wooden Spars");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 15,
                    basecost: 0,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        structure: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Spars");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 25,
                    basecost: 1,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Spars");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 20,
                    basecost: 2,
                    geodesic: false,
                    stats: Stats {
                        mass: 0.5,
                        cost: 2.,
                        structure: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wooden Ribs");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 30,
                    basecost: 1,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 0.5,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Ribs");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 60,
                    basecost: 2,
                    geodesic: true,
                    stats: Stats {
                        mass: 3.,
                        cost: 2.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Ribs");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 50,
                    basecost: 3,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        cost: 3.,
                        structure: 8.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Titanium");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 0,
                    basecost: 0,
                    geodesic: false,
                    stats: Stats {
                        mass: 1.,
                        cost: 8.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Living Grove");
                FrameEntry {
                    name: name.to_string(),
                    basestruct: 30,
                    basecost: 8,
                    geodesic: true,
                    stats: Stats {
                        mass: 2.,
                        structure: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Living Grove Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_skin: vec![
            {
                let name = t!("Naked");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 1.,
                    massfactor: 0.6,
                    stats: Stats {
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Cloth Canvas");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Transparent Celluloid");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: true,
                    dragfactor: 0.6,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Treated Paper");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: true,
                    dragfactor: 0.5,
                    massfactor: 0.75,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tense Silk");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        toughness: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Dragon Skin");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: false,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Molded Plywood");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 3,
                    flammable: false,
                    dragfactor: 0.4,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 0.5,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Clinker Build");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: -3,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Glass Reinforced Plastic");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 0,
                    flammable: false,
                    dragfactor: 0.3,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Corrugated Duralumin");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 10,
                    flammable: false,
                    dragfactor: 0.5,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Sheet");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 8,
                    flammable: false,
                    dragfactor: 0.35,
                    massfactor: 1.,
                    stats: Stats {
                        cost: 1.5,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Sheet");
                SkinEntry {
                    name: name.to_string(),
                    monocoque: true,
                    monocoque_structure: 6,
                    flammable: false,
                    dragfactor: 0.35,
                    massfactor: 0.75,
                    stats: Stats {
                        cost: 2.,
                        toughness: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        frame_tail: vec![
            {
                let name = t!("Tailless");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        visibility: 3.,
                        pitchstab: -4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Stubby");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 1.,
                        pitchstab: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Standard");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Long");
                TailEntry {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 3.,
                        pitchstab: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        fuel_tanks: vec![
            {
                let name = t!("Internal Fuselage Tank");
                TankEntry {
                    name: name.to_string(),
                    internal: true,
                    cantilever: false,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        reqsections: 0.5,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("External Wing Tank");
                TankEntry {
                    name: name.to_string(),
                    internal: false,
                    cantilever: false,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        drag: 3.,
                        control: -1.,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Wing Tank");
                TankEntry {
                    name: name.to_string(),
                    internal: true,
                    cantilever: true,
                    stats: Stats {
                        wetmass: 5.,
                        mass: 1.,
                        control: -1.,
                        fuel: 125.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Microtank");
                TankEntry {
                    name: name.to_string(),
                    internal: true,
                    cantilever: false,
                    stats: Stats {
                        mass: 1.,
                        fuel: 25.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        cargo_space: vec![
            {
                let name = t!("None");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tiny");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Tiny").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Small");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Small").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Medium");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Medium").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Large");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Large").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Huge");
                CargoSpace {
                    name: name.to_string(),
                    stats: Stats {
                        reqsections: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Cargo Huge").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_decks: vec![
            {
                let name = t!("Wing Deck Parasol");
                DeckEntry {
                    name: name.to_string(),
                    limited: false,
                    stats: Stats {
                        liftbleed: -2.,
                        visibility: -1.,
                        pitchstab: 3.,
                        maxstrain: -10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Shoulder");
                DeckEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -1.,
                        visibility: -1.,
                        pitchstab: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Mid");
                DeckEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Low");
                DeckEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: -2.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Gear");
                DeckEntry {
                    name: name.to_string(),
                    limited: false,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: -3.,
                        maxstrain: -10.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_largest: vec![
            {
                let name = t!("Wing Deck Parasol");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: -1.,
                        latstab: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Shoulder");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Mid");
                LongestWingEntry {
                    dragfactor: 0.9,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Low");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: 2.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Deck Gear");
                LongestWingEntry {
                    dragfactor: 1.,
                    stats: Stats {
                        control: 3.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_surface: vec![
            {
                let name = t!("Cloth Canvas");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Treated Paper");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: true,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        mass: -0.25,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tense Silk Layers");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.9,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        cost: 0.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Plywood");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.9,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        mass: 0.2,
                        cost: 0.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminum Sheet");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 0.8,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        cost: 0.3,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Corrugated Duralumin");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.6,
                    dragfactor: 1.0,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        mass: 0.25,
                        cost: 0.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Thin Sheet Steel");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.6,
                    dragfactor: 0.9,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        mass: 0.2,
                        cost: 0.3,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Grand Eagle Feather");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        control: 0.2,
                        cost: 0.6,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Solar Fiber");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: false,
                    stats: Stats {
                        cost: 0.4,
                        charge: 0.2,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Dragon Skin");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: false,
                    strainfactor: 0.4,
                    dragfactor: 1.0,
                    metal: true,
                    transparent: false,
                    stats: Stats {
                        cost: 0.8,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Transparent Celluloid");
                SurfaceEntry {
                    name: name.to_string(),
                    flammable: true,
                    strainfactor: 1.0,
                    dragfactor: 1.0,
                    metal: false,
                    transparent: true,
                    stats: Stats {
                        cost: 0.1,
                        toughness: -0.1,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        wing_stagger: vec![
            {
                let name = t!("Monoplane");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 1,
                    hstab: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Tandem");
                StaggerEntry {
                    name: name.to_string(),
                    inline: true,
                    wing_count: 20,
                    hstab: false,
                    stats: Stats {
                        pitchstab: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Extreme Positive");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Positive");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Unstaggered");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Negative");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -1.,
                        pitchstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Extreme Negative");
                StaggerEntry {
                    name: name.to_string(),
                    inline: false,
                    wing_count: 20,
                    hstab: true,
                    stats: Stats {
                        liftbleed: -2.,
                        pitchstab: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        rotor_blades: vec![
            {
                let name = t!("Two");
                BladeEntry {
                    name: name.to_string(),
                    sizing: 1.05,
                    rotor_bleed: 0,
                    stats: Stats {
                        flightstress: 1.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Three");
                BladeEntry {
                    name: name.to_string(),
                    sizing: 1.0,
                    rotor_bleed: 1,
                    stats: Stats {
                        cost: 2.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Four");
                BladeEntry {
                    name: name.to_string(),
                    sizing: 0.95,
                    rotor_bleed: 2,
                    stats: Stats {
                        cost: 4.,
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Five");
                BladeEntry {
                    name: name.to_string(),
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
                let name = t!("Single Rotor");
                ArrangementEntry {
                    name: name.to_string(),
                    count: 1,
                    powerfactor: 1.,
                    blades: 0,
                    stats: Stats { ..Stats::new() },
                }
            },
            {
                let name = t!("Coaxial");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Synchropter");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Tandem");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Transverse");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Tandem Transverse");
                ArrangementEntry {
                    name: name.to_string(),
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
                let name = t!("Flap Ailerons");
                AileronEntry {
                    name: name.to_string(),
                    warping: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Warping");
                AileronEntry {
                    name: name.to_string(),
                    warping: true,
                    stats: Stats {
                        drag: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Wing Warping Warning 2").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Spoilerons");
                AileronEntry {
                    name: name.to_string(),
                    warping: false,
                    stats: Stats {
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Spoilerons Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("None");
                AileronEntry {
                    name: name.to_string(),
                    warping: false,
                    stats: Stats {
                        control: -15.,
                        cost: -2.,
                        crashsafety: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_rudders: vec![
            {
                let name = t!("Flap Rudder");
                RudderEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Flying Rudder");
                RudderEntry {
                    name: name.to_string(),
                    stats: Stats {
                        control: 3.,
                        latstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_elevators: vec![
            {
                let name = t!("Flap Elevator");
                ElevatorEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Flying Elevator");
                ElevatorEntry {
                    name: name.to_string(),
                    stats: Stats {
                        control: 2.,
                        pitchstab: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_flaps: vec![
            {
                let name = t!("None");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 0.0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Basic Flaps");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 0.333333333333,
                    stats: Stats {
                        liftbleed: -3.,
                        control: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Advanced Flaps");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 0.666666666666,
                    stats: Stats {
                        liftbleed: -5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Control Flaps");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 1.0,
                    stats: Stats {
                        liftbleed: -5.,
                        control: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Lift Dumpers");
                FlapsEntry {
                    name: name.to_string(),
                    costfactor: 1.0,
                    stats: Stats {
                        crashsafety: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Lift Dumpers Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_slats: vec![
            {
                let name = t!("None");
                SlatsEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fixed Slots");
                SlatsEntry {
                    name: name.to_string(),
                    stats: Stats {
                        liftbleed: -3.,
                        drag: 5.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Automatic Slats");
                SlatsEntry {
                    name: name.to_string(),
                    stats: Stats {
                        liftbleed: -1.,
                        control: 3.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        control_drag: vec![
            {
                let name = t!("Air Brake");
                DragInducerEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Air Brake Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Dive Brake");
                DragInducerEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Dive Brake Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Drogue Chute");
                DragInducerEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Drogue Chute Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_wood: vec![
            {
                let name = t!("Parallel Struts");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("N-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("I-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("W-Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Single Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Star Strut");
                ExternalWoodEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wing Truss");
                ExternalWoodEntry {
                    name: name.to_string(),
                    tension: 40,
                    config: false,
                    first: true,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        drag: 4.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Wire Root");
                ExternalWoodEntry {
                    name: name.to_string(),
                    tension: 10,
                    config: true,
                    first: false,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_steel: vec![
            {
                let name = t!("Steel Parallel Struts");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel N-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel V-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel I-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel W-Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Single Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Star Strut");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Wing Truss");
                ExternalSteelEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Wire Root");
                ExternalSteelEntry {
                    name: name.to_string(),
                    tension: 10,
                    config: true,
                    first: false,
                    small_sqp: true,
                    ornith: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_cabane: vec![
            {
                let name = t!("None");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Parallel Struts");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 15,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Parallel Struts");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("N-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 10,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 8.,
                        structure: 6.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel N-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 5,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 13.,
                        structure: 12.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 15,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 5.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel V-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("I-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 7,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 20.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel I-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 3,
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("W-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        maxstrain: 35.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel W-Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 4.,
                        maxstrain: 40.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Single Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Single Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Star Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 2.,
                        drag: 6.,
                        cost: 2.,
                        maxstrain: 30.,
                        structure: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel Star Strut");
                CabaneEntry {
                    name: name.to_string(),
                    tension: 0,
                    stats: Stats {
                        mass: 2.,
                        drag: 4.,
                        cost: 4.,
                        maxstrain: 35.,
                        structure: 20.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        reinforcement_cantilever: vec![
            {
                let name = t!("Birch");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 1.,
                        maxstrain: 10.,
                        toughness: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Duralumin");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        maxstrain: 15.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Steel");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 3.,
                        maxstrain: 20.,
                        toughness: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Aluminium");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        maxstrain: 25.,
                        toughness: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone");
                CantileverEntry {
                    name: name.to_string(),
                    limited: true,
                    stats: Stats {
                        liftbleed: -3.,
                        mass: 1.,
                        cost: 8.,
                        maxstrain: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_electrical: vec![
            {
                let name = t!("Windmill");
                ElectricalEntry {
                    name: name.to_string(),
                    cp10s: 1.,
                    storage: 0,
                    stats: Stats {
                        drag: 1.,
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Battery");
                ElectricalEntry {
                    name: name.to_string(),
                    cp10s: 0.,
                    storage: 5,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Battery (High Quality)");
                ElectricalEntry {
                    name: name.to_string(),
                    cp10s: 0.,
                    storage: 5,
                    stats: Stats {
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_radios: vec![
            {
                let name = t!("Loud Yelling");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Intercom System");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Receiver");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        drag: 2.,
                        cost: 3.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transmitter");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        drag: 3.,
                        cost: 3.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transceiver");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 5.,
                        drag: 3.,
                        cost: 3.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone Radio Receiver");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 5.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone Radio Base Station");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 6.,
                        drag: 1.,
                        cost: 12.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Receiver (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        drag: 2.,
                        cost: 6.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transmitter (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        drag: 3.,
                        cost: 6.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radio Transceiver (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 4.,
                        drag: 3.,
                        cost: 6.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Roaring20s,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Whalebone Radio Base Station (High Quality)");
                RadioEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 5.,
                        drag: 1.,
                        cost: 24.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_recon: vec![
            {
                let name = t!("Guncam");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Guncam Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Small Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        drag: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Small Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Medium Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        drag: 2.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Medium Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Large Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        drag: 3.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Large Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Small Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 4.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Small Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Medium Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 2.,
                        cost: 2.,
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Medium Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Internal Large Reconnaissance Camera");
                ReconEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        cost: 2.,
                        reqsections: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Large Reconnaissance Camera Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_visibility: vec![
            {
                let name = t!("Wing Cutouts");
                VisibilityEntry {
                    name: name.to_string(),
                    stats: Stats {
                        liftbleed: 1.,
                        visibility: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Hull Cutouts");
                VisibilityEntry {
                    name: name.to_string(),
                    stats: Stats {
                        visibility: 1.,
                        structure: -5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Searchlight");
                VisibilityEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 1.,
                        charge: 0.000000001,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_climate: vec![
            {
                let name = t!("Electric Heating");
                ClimateEntry {
                    name: name.to_string(),
                    req_radiator: false,
                    stats: Stats {
                        cost: 1.,
                        charge: -1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Radiator Loop");
                ClimateEntry {
                    name: name.to_string(),
                    req_radiator: true,
                    stats: Stats {
                        cost: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Air Conditioning");
                ClimateEntry {
                    name: name.to_string(),
                    req_radiator: false,
                    stats: Stats {
                        cost: 4.,
                        charge: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_autopilots: vec![
            {
                let name = t!("None");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Gyroscopic");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        cost: 3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Gyroscopic Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Altitude Holding");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Altitude Holding Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Clockwork Programmable");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 6.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Clockwork Programmable Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Programmable");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 1.,
                        cost: 6.,
                        charge: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Programmable Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Rattenhirn");
                AutopilotEntry {
                    name: name.to_string(),
                    stats: Stats {
                        mass: 3.,
                        cost: 25.,
                        charge: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Himmilgard,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Rattenhirn Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        accessories_control: vec![
            {
                let name = t!("None");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 1000,
                    max_total_stress: 1000,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Control Rods");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 1,
                    max_total_stress: 1000,
                    stats: Stats {
                        mass: 1.,
                        cost: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWI,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Hydraulic-Assisted");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 0,
                    max_total_stress: 1000,
                    stats: Stats {
                        mass: 3.,
                        cost: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Fly by Wire");
                ControlEntry {
                    name: name.to_string(),
                    max_mass_stress: 0,
                    max_total_stress: 0,
                    stats: Stats {
                        mass: 3.,
                        cost: 10.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::LastHurrah,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        stabilizers_hstab: vec![
            {
                let name = t!("Tailplane");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("The Wings");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 0,
                    dragfactor: 0.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Canards");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: true,
                    increment: 1,
                    dragfactor: 0.5,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        pitchstab: -3.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Outboard");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 2,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        latstab: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Tail");
                HStabEntry {
                    name: name.to_string(),
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
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("T-Tail");
                HStabEntry {
                    name: name.to_string(),
                    is_canard: false,
                    increment: 1,
                    dragfactor: 0.5,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        liftbleed: -2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::WWII,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("T-Tail Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        stabilizers_vstab: vec![
            {
                let name = t!("Tailfin");
                VStabEntry {
                    name: name.to_string(),
                    increment: 1,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Outboard");
                VStabEntry {
                    name: name.to_string(),
                    increment: 2,
                    dragfactor: 1.,
                    is_vtail: false,
                    is_tail: false,
                    stats: Stats {
                        control: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("V-Tail");
                VStabEntry {
                    name: name.to_string(),
                    increment: 0,
                    dragfactor: 0.,
                    is_vtail: true,
                    is_tail: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::ComingStorm,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        landing_gear_types: vec![
            {
                let name = t!("Landing Gear");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 1.,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Floats");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 1.5,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Hybrid Floats");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 2.,
                    splmp: 0.,
                    can_retract: true,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Boat Hull");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 1.,
                    splmp: 1.,
                    can_retract: false,
                    stats: Stats {
                        mass: 5.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Landing Skid");
                GearEntry {
                    name: name.to_string(),
                    dplmp: 0.,
                    splmp: 0.,
                    can_retract: false,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Landing Skid Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
        landing_gear_extras: vec![
            {
                let name = t!("Zeppelin Hook");
                ExtraEntry {
                    name: name.to_string(),
                    mplmp: 0.,
                    stats: Stats {
                        mass: 1.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Zeppelin Hook Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Carrier Hook");
                ExtraEntry {
                    name: name.to_string(),
                    mplmp: 0.5,
                    stats: Stats {
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        warnings: vec![Warning {
                            name: name.to_string(),
                            warning: t!("Carrier Hook Warning").to_string(),
                            level: WarningLevel::White,
                        }],
                        ..Stats::new()
                    },
                }
            },
            {
                let name = t!("Underwing Skid");
                ExtraEntry {
                    name: name.to_string(),
                    mplmp: 0.,
                    stats: Stats {
                        drag: 3.,
                        crashsafety: 2.,
                        eras: vec![Era {
                            name: name.to_string(),
                            era: ERA::Pioneer,
                        }],
                        ..Stats::new()
                    },
                }
            },
        ],
    }
}
