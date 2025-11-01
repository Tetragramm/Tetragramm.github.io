use crate::{
    lu,
    stats::{Era, Stats, Warning, WarningLevel, ERA},
    weapon::WeaponType,
};

pub fn get_weapon_list() -> (Vec<WeaponType>, Vec<usize>) {
    let mut wlist = vec![
        {
            let name = lu!("Submachine Gun");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("SMG Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Scattergun");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("Scattergun Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Light Machine Gun");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Machine Gun");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Balloon Gun");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Enhanced Machine Gun");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Enhanced Heavy Machine Gun");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Punt Gun");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("Punt Gun Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Light Repeating Cannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Heavy Cannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Light Machine Cannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Heavy Machine Cannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Fliergerflammenwerfer");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("Fliergerflammenwerfer Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Recoilless Cannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Autocannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Battle Cannon");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Precision Rifle");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("Precision Rifle Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Lightning Arc");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("Lightning Arc Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Harpoon Launcher");
            WeaponType {
                name: name.clone(),
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
                        warning: lu!("Harpoon Launcher Warning"),
                        level: WarningLevel::White,
                    }],
                    ..Stats::new()
                },
            }
        },
        {
            let name = lu!("Heavy Machine Gun");
            WeaponType {
                name: name.clone(),
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
            let name = lu!("Heavy Repeating Cannon");
            WeaponType {
                name: name.clone(),
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

    // Then by damage (using partial_cmp for f64)
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
