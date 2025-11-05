#[cfg(test)]
mod tests {
    use crate::part::Part;
    use crate::stats::Stats;
    use crate::weapon::WeaponType;
    use crate::weapons::Weapons;
    

    // Helper to create a test weapon list
    fn create_test_weapon_list() -> Vec<WeaponType> {
        vec![
            WeaponType {
                name: "Test MG".to_string(),
                abrv: "TMG".to_string(),
                era: "WWI".to_string(),
                size: 4,
                stats: Stats::new(),
                damage: 3.0,
                hits: 2,
                ammo: 100,
                ap: 0,
                jam: "4/5".to_string(),
                reload: 0,
                rapid: true,
                synched: true,
                shells: false,
                can_action: true,
                can_projectile: true,
                deflection: 0,
            },
            WeaponType {
                name: "Precision Rifle".to_string(),
                abrv: "PR".to_string(),
                era: "WWI".to_string(),
                size: 8,
                stats: Stats::new(),
                damage: 4.0,
                hits: 1,
                ammo: 10,
                ap: 1,
                jam: "0".to_string(),
                reload: 1,
                rapid: false,
                synched: false,
                shells: false,
                can_action: false,
                can_projectile: false,
                deflection: 0,
            },
        ]
    }

    fn create_test_permute() -> Vec<usize> {
        vec![0, 1]
    }

    #[test]
    fn test_weapons_new() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let w = Weapons::new(weapon_list, permute);

        assert_eq!(w.get_weapon_sets().len(), 0);
        assert_eq!(w.get_brace_count(), 0);
        assert_eq!(w.cockpit_count, 1);
    }

    #[test]
    fn test_set_weapon_set_count() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_weapon_set_count(3);
        assert_eq!(w.get_weapon_sets().len(), 3);

        w.set_weapon_set_count(1);
        assert_eq!(w.get_weapon_sets().len(), 1);
    }

    #[test]
    fn test_duplicate_set() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_weapon_set_count(2);
        w.duplicate_set(0);
        assert_eq!(w.get_weapon_sets().len(), 3);
    }

    #[test]
    fn test_remove_set() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_weapon_set_count(3);
        w.remove_set(1);
        assert_eq!(w.get_weapon_sets().len(), 2);
    }

    #[test]
    fn test_set_brace_count() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_brace_count(7);
        assert_eq!(w.get_brace_count(), 6); // Rounded to multiple of 3

        w.set_brace_count(9);
        assert_eq!(w.get_brace_count(), 9);
    }

    #[test]
    fn test_set_tractor_info() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_tractor_info(true, 2, 1);
        assert_eq!(w.has_tractor, true);
        assert_eq!(w.tractor_spinner_count, 2);
        assert_eq!(w.tractor_arty_spinner_count, 1);
    }

    #[test]
    fn test_set_pusher_info() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_pusher_info(true, 3, 2);
        assert_eq!(w.has_pusher, true);
        assert_eq!(w.pusher_spinner_count, 3);
        assert_eq!(w.pusher_arty_spinner_count, 2);
    }

    #[test]
    fn test_get_direction_list() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let w = Weapons::new(weapon_list, permute);

        let directions = w.get_direction_list();
        assert_eq!(directions.len(), 6);
    }

    #[test]
    fn test_get_synchronization_list() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let w = Weapons::new(weapon_list, permute);

        let syncs = w.get_synchronization_list();
        assert_eq!(syncs.len(), 6);
    }

    #[test]
    fn test_get_seat_list() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_number_of_cockpits(3);
        let seats = w.get_seat_list();
        assert_eq!(seats.len(), 3);
    }

    #[test]
    fn test_part_stats() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut w = Weapons::new(weapon_list, permute);

        w.set_weapon_set_count(1);
        let stats = w.part_stats();
        assert!(stats.mass >= 0.0);
        assert!(stats.cost >= 0.0);
    }
}
