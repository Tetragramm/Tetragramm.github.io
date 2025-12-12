use crate::{
    stats::{Era, Stats, Warning, WarningLevel, ERA},
    weapon::WeaponType,
};

pub fn get_weapon_list() -> (Vec<WeaponType>, Vec<usize>) {
    let mut wlist = vec![
        {
            let name = t!("Submachine Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "SMG".to_string(),
                era: "WWI".to_string(),
                size: 1,
                damage: 1.,
                hits: 4,
                ammo: 10,
                ap: 0,
                jam: "0/1".to_string(),
                reload: 2,
                rapid: true,
                synched: false,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 1.,
                    cost: 1.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    warnings: vec![Warning {
                        name: name.clone(),
                        warning: t!("SMG Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Scattergun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "SG".to_string(),
                era: "Pioneer".to_string(),
                size: 2,
                damage: 0.5,
                hits: 0,
                ammo: 8,
                ap: 0,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
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
                        warning: t!("Scattergun Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Light Machine Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "LMG".to_string(),
                era: "WWI".to_string(),
                size: 2,
                damage: 2.,
                hits: 4,
                ammo: 8,
                ap: 1,
                jam: "1/2".to_string(),
                reload: 2,
                rapid: true,
                synched: false,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 2.,
                    drag: 1.,
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
            let name = t!("Machine Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "MG".to_string(),
                era: "WWI".to_string(),
                size: 4,
                damage: 2.,
                hits: 4,
                ammo: 10,
                ap: 1,
                jam: "1/2".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 3.,
                    drag: 1.,
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
            let name = t!("Balloon Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "BMG".to_string(),
                era: "WWI".to_string(),
                size: 4,
                damage: 2.,
                hits: 4,
                ammo: 6,
                ap: 0,
                jam: "2/3".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: -2,
                stats: Stats {
                    mass: 3.,
                    drag: 1.,
                    cost: 3.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Enhanced Machine Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "EMG".to_string(),
                era: "Coming Storm".to_string(),
                size: 2,
                damage: 2.,
                hits: 5,
                ammo: 8,
                ap: 1,
                jam: "0/0".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 2.,
                    drag: 1.,
                    cost: 3.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::ComingStorm,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Enhanced Heavy Machine Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "EHMG".to_string(),
                era: "Coming Storm".to_string(),
                size: 4,
                damage: 4.,
                hits: 5,
                ammo: 6,
                ap: 2,
                jam: "0/0".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 3.,
                    drag: 2.,
                    cost: 5.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::ComingStorm,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Punt Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "PG".to_string(),
                era: "Pioneer".to_string(),
                size: 8,
                damage: 0.5,
                hits: 0,
                ammo: 5,
                ap: 0,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 4.,
                    drag: 3.,
                    cost: 4.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::Pioneer,
                    }],
                    warnings: vec![Warning {
                        name: name.clone(),
                        warning: t!("Punt Gun Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Light Repeating Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "LRC".to_string(),
                era: "WWI".to_string(),
                size: 8,
                damage: 8.,
                hits: 3,
                ammo: 6,
                ap: 2,
                jam: "2/5".to_string(),
                reload: 2,
                rapid: true,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: -3,
                stats: Stats {
                    mass: 4.,
                    drag: 3.,
                    cost: 4.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Heavy Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "HC".to_string(),
                era: "WWI".to_string(),
                size: 8,
                damage: 16.,
                hits: 1,
                ammo: 5,
                ap: 2,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: -3,
                stats: Stats {
                    mass: 5.,
                    drag: 2.,
                    cost: 6.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Light Machine Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "LMC".to_string(),
                era: "Coming Storm".to_string(),
                size: 8,
                damage: 8.,
                hits: 4,
                ammo: 6,
                ap: 4,
                jam: "0/0".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 4.,
                    drag: 3.,
                    cost: 8.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::ComingStorm,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Heavy Machine Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "HMC".to_string(),
                era: "WWII".to_string(),
                size: 8,
                damage: 12.,
                hits: 3,
                ammo: 5,
                ap: 4,
                jam: "0/0".to_string(),
                reload: 0,
                rapid: true,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 5.,
                    drag: 4.,
                    cost: 12.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWII,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Fliergerflammenwerfer").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "FFW".to_string(),
                era: "WWI".to_string(),
                size: 8,
                damage: 0.5,
                hits: 0,
                ammo: 0,
                ap: 0,
                jam: "0/0".to_string(),
                reload: 0,
                rapid: false,
                synched: false,
                shells: false,
                can_action: false,
                can_projectile: false,
                deflection: 0,
                stats: Stats {
                    mass: 1.,
                    drag: 3.,
                    cost: 5.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    warnings: vec![Warning {
                        name: name.clone(),
                        warning: t!("Fliergerflammenwerfer Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Recoilless Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "RC".to_string(),
                era: "WWI".to_string(),
                size: 16,
                damage: 30.,
                hits: 1,
                ammo: 3,
                ap: 3,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: -5,
                stats: Stats {
                    mass: 8.,
                    drag: 3.,
                    cost: 5.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Autocannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "AC".to_string(),
                era: "WWII".to_string(),
                size: 16,
                damage: 24.,
                hits: 2,
                ammo: 2,
                ap: 5,
                jam: "0/0".to_string(),
                reload: 0,
                rapid: true,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 8.,
                    drag: 5.,
                    cost: 15.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWII,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Battle Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "BC".to_string(),
                era: "WWII".to_string(),
                size: 16,
                damage: 24.,
                hits: 2,
                ammo: 1,
                ap: 5,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 40.,
                    drag: 8.,
                    cost: 15.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWII,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Precision Rifle").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "PR".to_string(),
                era: "WWI".to_string(),
                size: 2,
                damage: 5.,
                hits: 10,
                ammo: 8,
                ap: 2,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: true,
                can_action: false,
                can_projectile: false,
                deflection: 0,
                stats: Stats {
                    mass: 1.,
                    drag: 1.,
                    cost: 2.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    warnings: vec![Warning {
                        name: name.clone(),
                        warning: t!("Precision Rifle Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Lightning Arc").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "LA".to_string(),
                era: "Himmilgard".to_string(),
                size: 16,
                damage: 0.,
                hits: 0,
                ammo: 0,
                ap: 0,
                jam: "0".to_string(),
                reload: 0,
                rapid: false,
                synched: false,
                shells: false,
                can_action: false,
                can_projectile: false,
                deflection: 0,
                stats: Stats {
                    mass: 5.,
                    drag: 3.,
                    cost: 8.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::Himmilgard,
                    }],
                    warnings: vec![Warning {
                        name: name.clone(),
                        warning: t!("Lightning Arc Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Harpoon Launcher").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "HL".to_string(),
                era: "Himmilgard".to_string(),
                size: 4,
                damage: 4.,
                hits: 1,
                ammo: 2,
                ap: 1,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: false,
                can_action: false,
                can_projectile: false,
                deflection: 0,
                stats: Stats {
                    mass: 3.,
                    drag: 2.,
                    cost: 3.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::Himmilgard,
                    }],
                    warnings: vec![Warning {
                        name: name.clone(),
                        warning: t!("Harpoon Launcher Warning").to_string(),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Heavy Machine Gun").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "HMG".to_string(),
                era: "WWI".to_string(),
                size: 4,
                damage: 4.,
                hits: 4,
                ammo: 5,
                ap: 2,
                jam: "2/3".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: 0,
                stats: Stats {
                    mass: 4.,
                    drag: 2.,
                    cost: 4.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = t!("Heavy Repeating Cannon").to_string();
            WeaponType {
                name: name.clone(),
                abrv: "HRC".to_string(),
                era: "WWI".to_string(),
                size: 16,
                damage: 16.,
                hits: 2,
                ammo: 5,
                ap: 2,
                jam: "4/6".to_string(),
                reload: 2,
                rapid: true,
                synched: false,
                shells: true,
                can_action: true,
                can_projectile: true,
                deflection: -3,
                stats: Stats {
                    mass: 6.,
                    drag: 4.,
                    cost: 10.,
                    eras: vec![Era {
                        name: name.clone(),
                        era: ERA::WWI,
                    }],
                    ..Stats::new()
                },
            }
        },
    ];

    // Create permutation array and sort weapon list
    let permute = create_weapon_permutation(&mut wlist);

    (wlist, permute)
}

/// Convert era string to a numeric value for sorting
fn era_to_num(era: &str) -> i32 {
    match era {
        "Pioneer" => 0,
        "WWI" => 1,
        "Roaring 20s" => 2,
        "Coming Storm" => 3,
        "WWII" => 4,
        "Last Hurrah" => 5,
        "Himmilgard" => 6,
        _ => 999, // Unknown eras sort to the end
    }
}

/// Comparison function for weapon sorting
fn compare_weapons(wa: &WeaponType, wb: &WeaponType) -> std::cmp::Ordering {
    // Compare by size first
    if wa.size != wb.size {
        return wa.size.cmp(&wb.size);
    }

    // Then by era
    let era_a = era_to_num(&wa.era);
    let era_b = era_to_num(&wb.era);
    if era_a != era_b {
        return era_a.cmp(&era_b);
    }

    // Then by damage (using partial_cmp for f32)
    if (wa.damage - wb.damage).abs() > 1e-10 {
        return wa
            .damage
            .partial_cmp(&wb.damage)
            .unwrap_or(std::cmp::Ordering::Equal);
    }

    // Finally by name
    wa.name.cmp(&wb.name)
}

/// Create permutation array that sorts weapons by size, era, damage, then name
/// This also sorts the weapon list in place
fn create_weapon_permutation(wlist: &mut Vec<WeaponType>) -> Vec<usize> {
    // Create array of indices [0, 1, 2, ..., n-1]
    let mut indices: Vec<usize> = (0..wlist.len()).collect();

    // Sort indices based on weapon comparison
    indices.sort_by(|&a, &b| compare_weapons(&wlist[a], &wlist[b]));

    // Create inverse permutation
    // For each position i in the original list, find where i appears in the sorted indices
    let mut inverse_permute = vec![0; wlist.len()];
    for (new_pos, &old_pos) in indices.iter().enumerate() {
        inverse_permute[old_pos] = new_pos;
    }

    // Sort the weapon list itself
    wlist.sort_by(compare_weapons);

    inverse_permute
}
