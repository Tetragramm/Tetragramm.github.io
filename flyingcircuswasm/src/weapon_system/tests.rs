#[cfg(test)]
mod tests {
    use crate::part::Part;
    use crate::stats::Stats;
    use crate::weapon::{ActionType, ProjectileType, WeaponType};
    use crate::weapon_system::WeaponSystem;
    use std::rc::Rc;

    // Helper to create a test weapon list
    fn create_test_weapon_list() -> Rc<Vec<WeaponType>> {
        Rc::new(vec![
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
        ])
    }

    fn create_test_permute() -> Rc<Vec<usize>> {
        Rc::new(vec![0, 1])
    }

    #[test]
    fn test_weapon_system_new() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let ws = WeaponSystem::new(weapon_list, permute);

        assert_eq!(ws.get_weapon_selected(), 0);
        assert_eq!(ws.get_mounting_count(), 1);
        assert_eq!(ws.get_fixed(), true);
        assert_eq!(ws.get_ammo(), 1);
        assert_eq!(ws.get_repeating(), false);
    }

    #[test]
    fn test_set_weapon_selected() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        ws.set_weapon_selected(1);
        assert_eq!(ws.get_weapon_selected(), 1);
        assert_eq!(ws.get_final_weapon().name, "Precision Rifle");
        assert_eq!(ws.get_mounting_count(), 1); // Precision Rifle limited to 1
    }

    #[test]
    fn test_set_repeating() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        // Can't repeat rapid fire weapons
        assert_eq!(ws.can_repeating(), false);
        ws.set_repeating(true);
        assert_eq!(ws.get_repeating(), false);

        // Switch to precision rifle (can repeat)
        ws.set_weapon_selected(1);
        assert_eq!(ws.can_repeating(), false); // Still false due to "Precision Rifle" name check
    }

    #[test]
    fn test_set_fixed() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        assert_eq!(ws.get_fixed(), true);
        ws.set_fixed(false);
        assert_eq!(ws.get_fixed(), false);
    }

    #[test]
    fn test_set_direction() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        // Fixed mount, only one direction allowed
        assert_eq!(ws.get_direction()[0], true);
        ws.set_direction(1, true);
        assert_eq!(ws.get_direction()[1], true);
        assert_eq!(ws.get_direction()[0], false);

        // Turret mount, multiple directions allowed
        ws.set_fixed(false);
        ws.set_direction(2, true);
        assert_eq!(ws.get_direction()[1], true);
        assert_eq!(ws.get_direction()[2], true);
    }

    #[test]
    fn test_set_mounting_count() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        ws.set_mounting_count(3);
        assert_eq!(ws.get_mounting_count(), 3);
        assert_eq!(ws.get_weapons().len(), 3);

        ws.set_mounting_count(1);
        assert_eq!(ws.get_mounting_count(), 1);
        assert_eq!(ws.get_weapons().len(), 1);
    }

    #[test]
    fn test_set_ammo() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        ws.set_ammo(5);
        assert_eq!(ws.get_ammo(), 5);

        // Test minimum value
        ws.set_ammo(-1);
        assert_eq!(ws.get_ammo(), 1);
    }

    #[test]
    fn test_set_action() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        ws.set_action(ActionType::Gast);
        assert_eq!(ws.get_action(), ActionType::Gast);
        assert_eq!(ws.get_final_weapon().hits, 4); // 2x base hits

        ws.set_action(ActionType::Rotary);
        assert_eq!(ws.get_action(), ActionType::Rotary);
        assert_eq!(ws.get_final_weapon().hits, 6); // 3x base hits
    }

    #[test]
    fn test_set_projectile() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        ws.set_projectile(ProjectileType::Gyrojets);
        assert_eq!(ws.get_projectile(), ProjectileType::Gyrojets);
        assert_eq!(ws.get_final_weapon().damage, 2.0); // Reduced by 1
    }

    #[test]
    fn test_get_hits() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let ws = WeaponSystem::new(weapon_list, permute);

        let hits = ws.get_hits();
        // Wing-mounted weapons (default): 1 weapon * 2 hits
        assert_eq!(hits[0], 2); // Point blank: 2 hits
        assert_eq!(hits[1], 1); // Close: 90% of 2 = 1.8 -> 1
        assert_eq!(hits[2], 0); // Long: 20% of 2 = 0.4 -> 0
        assert_eq!(hits[3], 0); // Extreme: 10% of 2 = 0.2 -> 0
    }

    #[test]
    fn test_part_stats() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        let stats = ws.part_stats();
        assert!(stats.mass >= 0.0);
        assert!(stats.cost >= 0.0);
    }

    #[test]
    fn test_get_direction_count() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        assert_eq!(ws.get_direction_count(), 1);

        ws.set_fixed(false);
        ws.set_direction(1, true);
        assert_eq!(ws.get_direction_count(), 2);

        ws.set_direction(2, true);
        assert_eq!(ws.get_direction_count(), 3);
    }

    #[test]
    fn test_is_plural() {
        let weapon_list = create_test_weapon_list();
        let permute = create_test_permute();
        let mut ws = WeaponSystem::new(weapon_list, permute);

        assert_eq!(ws.is_plural(), false);

        ws.set_mounting_count(2);
        assert_eq!(ws.is_plural(), true);
    }
}
