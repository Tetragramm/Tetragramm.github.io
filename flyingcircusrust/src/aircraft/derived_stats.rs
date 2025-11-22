use super::*;
use crate::{
    part::Part,
    serialization::{Serializable, Serializer},
    types::DerivedStats,
    weapon_system::WeaponSystem,
};

/// Helper function to format stress list similar to TypeScript Stress2Str
/// Takes a list of (base_stress, reduction) tuples and formats them as strings
fn stress2str(arr: &[(i16, i16)]) -> String {
    if arr.is_empty() {
        return String::new();
    }

    let mut parts: Vec<String> = Vec::new();
    for &(base, reduction) in arr {
        if base != reduction {
            parts.push(format!("{}({})", base, reduction));
        } else {
            parts.push(format!("{}", base));
        }
    }
    parts.join(", ")
}

/// Format weapon name with mount type and modifiers
/// Similar to TypeScript WeaponName()
fn format_weapon_name(ws: &WeaponSystem, weapon_list: &[crate::weapon::WeaponType]) -> String {
    use crate::weapon::{ActionType, ProjectileType};

    let mut name = String::new();

    // Determine mount type based on direction count and fixed status
    let direction_count = ws.get_direction_count();
    if direction_count == 1 && ws.get_fixed() {
        name.push_str(&t!("Fixed").to_string());
        name.push(' ');
    } else if direction_count <= 2 {
        name.push_str(&t!("Flexible").to_string());
        name.push(' ');
    } else {
        name.push_str(&t!("Turreted").to_string());
        name.push(' ');
    }

    // Add action modifier
    match ws.get_action() {
        ActionType::Mechanical => {
            name.push_str(&t!("Weapon Tag Mechanical Action").to_string());
            name.push(' ');
        }
        ActionType::Gast => {
            name.push_str(&t!("Weapon Tag Gast Principle").to_string());
            name.push(' ');
        }
        ActionType::Rotary => {
            name.push_str(&t!("Weapon Tag Rotary").to_string());
            name.push(' ');
        }
        ActionType::Standard => {} // No modifier
    }

    // Add projectile modifier
    match ws.get_projectile() {
        ProjectileType::Heatray => {
            name.push_str(&t!("Weapon Tag Heat Ray").to_string());
            name.push(' ');
        }
        ProjectileType::Gyrojets => {
            name.push_str(&t!("Weapon Tag Gyrojet").to_string());
            name.push(' ');
        }
        ProjectileType::Pneumatic => {
            name.push_str(&t!("Weapon Tag Pneumatic").to_string());
            name.push(' ');
        }
        ProjectileType::Bullets => {} // No modifier
    }

    // Add weapon abbreviation (not full name)
    name.push_str(&weapon_list[ws.get_weapon_selected()].abrv);

    name
}

/// Format a weapon system for catalog display
/// Similar to TypeScript WeaponString()
fn format_weapon_string(
    ws: &WeaponSystem,
    weapon_list: &[crate::weapon::WeaponType],
    direction_list: &[&str],
) -> String {
    let seat = ws.get_seat() + 1; // Convert 0-indexed to 1-indexed
    let count = ws.get_weapon_count();
    let weapon_name = format_weapon_name(ws, weapon_list);

    // Get enabled directions
    let dirs = ws.get_direction();
    let mut direction_names = Vec::new();
    for (i, &enabled) in dirs.iter().enumerate() {
        if enabled && i < direction_list.len() {
            direction_names.push(t!(direction_list[i]).to_string());
        }
    }
    let directions_str = direction_names.join(" ");

    let damage = ws.get_damage();
    let hits = ws.get_hits();
    let hits_str = format!("{}/{}/{}/{}", hits[0], hits[1], hits[2], hits[3]);
    let ammunition = ws.get_shots();

    // Build tags
    let mut tags = Vec::new();

    // Jam tag
    let jam = ws.get_jam();
    tags.push(t!("Weapon Tag Jam", A = jam).to_string());

    // Reload tag
    let reload = ws.get_reload();
    tags.push(t!("Weapon Tag Reload", A = reload).to_string());

    // Rapid Fire tag
    if ws.get_final_weapon().rapid {
        tags.push(t!("Weapon Tag Rapid Fire").to_string());
    }

    // AP tag
    let ap = ws.get_final_weapon().ap;
    if ap > 0 {
        tags.push(t!("Weapon Tag AP", A = ap).to_string());
    }

    // Accessibility tag
    if ws.get_is_fully_accessible() {
        tags.push(t!("Weapon Tag Fully Accessible").to_string());
    } else if ws.get_is_partly_accessible() {
        tags.push(t!("Weapon Tag Partly Accessible").to_string());
    }

    let tags_str = tags.join(", ");

    let seatnum = t!("Seat #", A = seat).to_string();
    t!(
        "Weapon Description",
        A = seatnum,
        B = count,
        C = weapon_name,
        D = directions_str,
        E = damage,
        F = hits_str,
        G = ammunition,
        H = tags_str
    )
    .to_string()
}

impl Aircraft {
    /// Calculate derived stats from base stats
    /// TypeScript: GetDerivedStats()
    /// Returns performance characteristics like max speed, stall speed, handling, etc.
    pub fn get_derived_stats(&mut self) -> DerivedStats {
        let stats = &mut self.stats;

        // Calculate Mass Points
        let mut dry_mp = (stats.mass / 5.0).floor() as i16;
        dry_mp = dry_mp.max(1);
        let mut wet_mp = ((stats.mass + stats.wetmass) / 5.0).floor() as i16;
        wet_mp = wet_mp.max(1);
        let mut wet_mp_w_bombs =
            ((stats.mass + stats.wetmass + stats.bomb_mass) / 5.0).floor() as i16;
        wet_mp_w_bombs = wet_mp_w_bombs.max(1);

        // Calculate Drag Points
        let mut dp_empty = ((stats.drag + dry_mp as f32) / 5.0).floor() as i16;
        dp_empty = dp_empty.max(1);
        let dp_full = dp_empty; // Based on advice from Discord
        let mut dp_w_bombs =
            ((stats.drag as f32 + self.munitions.get_external_mass() as f32 + dry_mp as f32) / 5.0)
                .floor() as i16;
        dp_w_bombs = dp_w_bombs.max(1);

        // Calculate Max Speed values
        let mut max_speed_empty = (stats.pitchspeed
            * ((2000.0 * stats.power) / (dp_empty as f32 * 9.0)).sqrt())
        .floor() as i16;
        let mut max_speed_full = (stats.pitchspeed
            * ((2000.0 * stats.power) / (dp_full as f32 * 9.0)).sqrt())
        .floor() as i16;
        let mut max_speed_w_bombs = (stats.pitchspeed
            * ((2000.0 * stats.power) / (dp_w_bombs as f32 * 9.0)).sqrt())
        .floor() as i16;

        // Warnings for stat limits
        if stats.mass < 15.0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Stat Mass").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Stat Mass").to_string(),
                    warning: t!("Low Mass Warning").to_string(),
                    level: crate::stats::WarningLevel::Yellow, // WARNING_COLOR::YELLOW
                });
            }
        }

        if (stats.drag + dry_mp as f32) < 35.0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Stat Drag").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Stat Drag").to_string(),
                    warning: t!("Low Drag Warning").to_string(),
                    level: crate::stats::WarningLevel::Yellow, // WARNING_COLOR::YELLOW
                });
            }
        }

        // Calculate Stall Speeds
        let mut stall_speed_empty =
            (stats.liftbleed * dry_mp as f32 / stats.wingarea.max(1.0)).floor() as i16;
        stall_speed_empty = stall_speed_empty.max(1);

        let mut stall_speed_full =
            (stats.liftbleed * wet_mp as f32 / stats.wingarea.max(1.0)).floor() as i16;
        stall_speed_full = stall_speed_full.max(1);

        let mut stall_speed_full_w_bombs =
            (stats.liftbleed * wet_mp_w_bombs as f32 / stats.wingarea.max(1.0)).floor() as i16;
        stall_speed_full_w_bombs = stall_speed_full_w_bombs.max(1);

        let mut overspeed = self.engines.get_overspeed() as f32;

        // Calculate Boost values
        let boost_empty = (stats.power / dry_mp as f32).floor() as i16;
        let boost_full = (stats.power / wet_mp as f32).floor() as i16;
        let boost_full_w_bombs = (stats.power / wet_mp_w_bombs as f32).floor() as i16;

        if boost_full_w_bombs == 0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Derived Boost").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Derived Boost").to_string(),
                    warning: t!("Boost Warning").to_string(),
                    level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
                });
            }
        }

        let dropoff = (stats.pitchboost * max_speed_empty as f32).floor() as i16;

        // Apply used condition: Ragged (affects max speed)
        max_speed_empty =
            ((max_speed_empty as f32) * (1.0 - 0.1 * self.used.ragged as f32)).floor() as i16;
        max_speed_full =
            ((max_speed_full as f32) * (1.0 - 0.1 * self.used.ragged as f32)).floor() as i16;
        max_speed_w_bombs =
            ((max_speed_w_bombs as f32) * (1.0 - 0.1 * self.used.ragged as f32)).floor() as i16;

        // Calculate Stability
        let mut stability = stats.pitchstab as i16 + stats.latstab as i16;
        if stats.pitchstab > 0.0 && stats.latstab > 0.0 {
            stability += 2;
        } else if stats.pitchstab < 0.0 && stats.latstab < 0.0 {
            stability -= 2;
        }

        // Calculate Handling
        let mut handling_empty = (100.0 + stats.control - dry_mp as f32).floor() as i16;

        if stability > 10 || stability < -10 {
            handling_empty = i16::MIN;
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Derived Stability").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Derived Stability").to_string(),
                    warning: t!("Stability Warning").to_string(),
                    level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
                });
            }
        } else if stability == 10 {
            handling_empty -= 4;
        } else if stability > 6 {
            handling_empty -= 3;
        } else if stability > 3 {
            handling_empty -= 2;
        } else if stability > 0 {
            handling_empty -= 1;
        } else if stability == 0 {
            // No change
        } else if stability > -4 {
            handling_empty += 1;
        } else if stability > -7 {
            handling_empty += 2;
        } else if stability > -10 {
            handling_empty += 3;
        } else if stability == -10 {
            handling_empty += 4;
        }

        let mut handling_full = handling_empty + dry_mp - wet_mp;
        let mut handling_full_w_bombs = handling_empty + dry_mp - wet_mp_w_bombs;

        // Apply used condition: Sluggish
        handling_empty = (handling_empty as f32 - 5.0 * self.used.sluggish as f32).floor() as i16;
        handling_full = (handling_full as f32 - 5.0 * self.used.sluggish as f32).floor() as i16;
        handling_full_w_bombs =
            (handling_full_w_bombs as f32 - 5.0 * self.used.sluggish as f32).floor() as i16;

        // Calculate Max Strain
        let mut max_strain = (stats.maxstrain as i16 - dry_mp).min(stats.structure as i16);
        self.optimization.final_ms =
            (self.optimization.maxstrain as f32 * 1.5 * max_strain as f32 / 10.0).floor();
        max_strain += self.optimization.final_ms as i16;

        // Apply used condition: Fragile
        max_strain = ((max_strain as f32) * (1.0 - 0.2 * self.used.fragile as f32)).floor() as i16;

        if max_strain < 10
            && stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Stat Max Strain").to_string())
                .is_none()
        {
            stats.warnings.push(crate::stats::Warning {
                name: t!("Stat Max Strain").to_string(),
                warning: t!("Max Strain Warning").to_string(),
                level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
            });
        }

        // Calculate Toughness
        let mut toughness = stats.toughness as i16;
        // Apply used condition: Weak
        toughness = ((toughness as f32) * (1.0 - 0.5 * self.used.weak as f32)).floor() as i16;

        let structure = stats.structure as i16;

        // Calculate Energy Loss
        let mut energy_loss =
            ((-1.0e-6 + dp_empty as f32 / self.propeller.get_energy()).ceil()) as i16;
        let mut energy_loss_w_bombs = energy_loss + 1;
        energy_loss = energy_loss.min(10);
        energy_loss_w_bombs = energy_loss_w_bombs.min(10);

        // Calculate Turn Bleed
        let mut turn_bleed = (-1.0e-6
            + (1.0e-6 + (stall_speed_empty + stall_speed_full) as f32 / 2.0).floor()
                / self.propeller.get_turn())
        .ceil() as i16;

        if self.aircraft_type == AircraftType::Helicopter {
            turn_bleed =
                ((dry_mp as f32 / 2.0).floor() as i16 + self.rotor.get_rotor_bleed()).max(1);
            energy_loss = ((dp_empty as f32 / 7.0).floor() as i16).max(1);
            stall_speed_empty = 0;
            stall_speed_full = 0;
            stall_speed_full_w_bombs = 0;
            max_speed_empty = max_speed_empty.min(37);
            max_speed_full = max_speed_full.min(37);
            max_speed_w_bombs = max_speed_w_bombs.min(37);

            // Helicopter flight warning if boost is insufficient
            if boost_full_w_bombs < 2 {
                if stats
                    .warnings
                    .iter()
                    .find(|w| w.name == t!("Helicopter Flight").to_string())
                    .is_none()
                {
                    stats.warnings.push(crate::stats::Warning {
                        name: t!("Helicopter Flight").to_string(),
                        warning: t!("Helicopter Flight Warning").to_string(),
                        level: crate::stats::WarningLevel::White,
                    });
                }
            }
        }
        turn_bleed = turn_bleed.max(1);
        let mut turn_bleed_w_bombs = turn_bleed + 1;
        turn_bleed_w_bombs = turn_bleed_w_bombs.max(1);

        // Apply used condition: Hefty (affects stall speed)
        stall_speed_empty =
            ((stall_speed_empty as f32) * (1.0 + 0.2 * self.used.hefty as f32)).floor() as i16;
        stall_speed_empty = stall_speed_empty.max(1);

        stall_speed_full =
            ((stall_speed_full as f32) * (1.0 + 0.2 * self.used.hefty as f32)).floor() as i16;
        stall_speed_full = stall_speed_full.max(1);

        stall_speed_full_w_bombs = ((stall_speed_full_w_bombs as f32)
            * (1.0 + 0.2 * self.used.hefty as f32))
            .floor() as i16;
        stall_speed_full_w_bombs = stall_speed_full_w_bombs.max(1);

        // Check stall speed warnings
        if max_speed_w_bombs <= stall_speed_full_w_bombs || max_speed_full <= stall_speed_full {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Stall Speed").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Stall Speed").to_string(),
                    warning: t!("Stall Speed Warning").to_string(),
                    level: crate::stats::WarningLevel::Red, // WARNING_COLOR::RED
                });
            }
        }

        // Calculate Fuel Uses
        let mut fuel_uses = if stats.fuelconsumption != 0.0 {
            (stats.fuel / stats.fuelconsumption).floor() as i16
        } else {
            0
        };
        // Apply used condition: Leaky
        fuel_uses = ((fuel_uses as f32) * (1.0 - 0.2 * self.used.leaky as f32)).floor() as i16;

        if fuel_uses < 6 && stats.fuelconsumption != 0.0 {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Derived Fuel Uses").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Derived Fuel Uses").to_string(),
                    warning: t!("Fuel Uses Warning").to_string(),
                    level: crate::stats::WarningLevel::Yellow, // WARNING_COLOR::YELLOW
                });
            }
        }

        // Calculate Control Stress
        let mut control_stress = 1i16;
        if stability > 3 || stability < -3 {
            control_stress += 1;
        }

        control_stress +=
            ((dry_mp as f32 / 10.0).floor() as i16).min(self.accessories.max_mass_stress());
        let max_stress = self.accessories.max_total_stress();
        control_stress = control_stress.min(max_stress);

        // Calculate Rumble Stress
        let mut rumble_stress = 0i16;
        if self.engines.get_max_rumble() > 0.0 {
            rumble_stress = ((0.5 * self.engines.get_rumble()).max(1.0).floor()) as i16;
            rumble_stress = rumble_stress.min(3);
        }
        if max_stress == 0 {
            rumble_stress = 0;
        }

        // Calculate Rate of Climb
        let mut rate_of_climb_empty =
            (stats.power / dry_mp as f32) * (23.0 / stats.pitchspeed) / dp_empty as f32;
        if !rate_of_climb_empty.is_finite() {
            rate_of_climb_empty = 0.0;
        }
        let mut rate_of_climb_empty = rate_of_climb_empty.floor() as i16;
        rate_of_climb_empty = rate_of_climb_empty.max(1);

        let mut rate_of_climb_full = ((stats.power / wet_mp as f32) * (23.0 / stats.pitchspeed)
            / dp_full as f32)
            .floor() as i16;
        rate_of_climb_full = rate_of_climb_full.max(1);

        let mut rate_of_climb_w_bombs =
            ((stats.power / wet_mp_w_bombs as f32) * (23.0 / stats.pitchspeed) / dp_w_bombs as f32)
                .floor() as i16;
        rate_of_climb_w_bombs = rate_of_climb_w_bombs.max(1);

        // Handle Ornithopter special cases
        if self.aircraft_type.is_any_ornithopter() {
            handling_empty += 5;
            handling_full += 5;
            handling_full_w_bombs += 5;
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Ornithopter Stall").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Ornithopter Stall").to_string(),
                    warning: t!("Ornithopter Stall Warning").to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
            overspeed = max_strain as f32;
        }

        if self.aircraft_type == AircraftType::OrnithopterFlutter {
            handling_empty += 5;
            handling_full += 5;
            handling_full_w_bombs += 5;
            overspeed = f32::INFINITY;
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Ornithopter Flutterer Attack").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Ornithopter Flutterer Attack").to_string(),
                    warning: t!("Ornithopter Flutterer Attack Warning").to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
        }

        if self.aircraft_type == AircraftType::OrnithopterBuzzer {
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Ornithopter Buzzer Boost").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Ornithopter Buzzer Boost").to_string(),
                    warning: t!("Ornithopter Buzzer Boost Warning").to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
            if stats
                .warnings
                .iter()
                .find(|w| w.name == t!("Ornithopter Buzzer Stall").to_string())
                .is_none()
            {
                stats.warnings.push(crate::stats::Warning {
                    name: t!("Ornithopter Buzzer Stall").to_string(),
                    warning: t!("Ornithopter Buzzer Stall Warning").to_string(),
                    level: crate::stats::WarningLevel::White, // WARNING_COLOR::WHITE
                });
            }
        }

        DerivedStats {
            dry_mp,
            wet_mp,
            wet_mp_w_bombs,
            dp_empty,
            dp_full,
            dp_w_bombs,
            max_speed_empty,
            max_speed_full,
            max_speed_w_bombs,
            stall_speed_empty,
            stall_speed_full,
            stall_speed_full_w_bombs,
            overspeed,
            boost_empty,
            boost_full,
            boost_full_w_bombs,
            dropoff,
            stability,
            handling_empty,
            handling_full,
            handling_full_w_bombs,
            max_strain,
            toughness,
            structure,
            energy_loss,
            energy_loss_w_bombs,
            turn_bleed,
            turn_bleed_w_bombs,
            fuel_uses,
            control_stress,
            rumble_stress,
            rate_of_climb_full,
            rate_of_climb_empty,
            rate_of_climb_w_bombs,
        }
    }

    /// Generate catalog JSON for an aircraft
    /// Based on TypeScript: CatalogJSON() in Aircraft.ts (lines 526-687)
    /// Returns a serde_json::Value containing aircraft catalog information
    pub fn catalog_json(&mut self) -> serde_json::Value {
        use serde_json::json;
        use std::collections::HashMap;

        let stats = self.part_stats();
        let derived = self.get_derived_stats();

        // Build Stats array
        let mut stats_array = Vec::new();

        // Add "Full Load" stats if aircraft has bombs
        if stats.bomb_mass > 0.0 {
            stats_array.push(json!({
                "Name": "Full Load",
                "Boost": derived.boost_full_w_bombs,
                "Handling": derived.handling_full_w_bombs,
                "Climb": derived.rate_of_climb_w_bombs,
                "Stall": derived.stall_speed_full_w_bombs,
                "Speed": derived.max_speed_w_bombs
            }));

            stats_array.push(json!({
            "Name": "1/2, Bombs",
            "Boost": ((derived.boost_empty + derived.boost_full_w_bombs) as f32 / 2.0).floor() as i16,
            "Handling": ((derived.handling_empty + derived.handling_full_w_bombs) as f32 / 2.0).floor() as i16,
            "Climb": ((derived.rate_of_climb_empty + derived.rate_of_climb_w_bombs) as f32 / 2.0).floor() as i16,
            "Stall": ((derived.stall_speed_empty + derived.stall_speed_full_w_bombs) as f32 / 2.0).floor() as i16,
            "Speed": ((derived.max_speed_empty + derived.max_speed_w_bombs) as f32 / 2.0).floor() as i16
        }));
        }

        // Add "Full Fuel" stats
        stats_array.push(json!({
            "Name": "Full Fuel",
            "Boost": derived.boost_full,
            "Handling": derived.handling_full,
            "Climb": derived.rate_of_climb_full,
            "Stall": derived.stall_speed_full,
            "Speed": derived.max_speed_full
        }));

        // Add "Half Fuel" stats
        stats_array.push(json!({
        "Name": "Half Fuel",
        "Boost": ((derived.boost_empty + derived.boost_full) as f32 / 2.0).floor() as i16,
        "Handling": ((derived.handling_empty + derived.handling_full) as f32 / 2.0).floor() as i16,
        "Climb": ((derived.rate_of_climb_empty + derived.rate_of_climb_full) as f32 / 2.0).floor() as i16,
        "Stall": ((derived.stall_speed_empty + derived.stall_speed_full) as f32 / 2.0).floor() as i16,
        "Speed": ((derived.max_speed_empty + derived.max_speed_full) as f32 / 2.0).floor() as i16
    }));

        // Add "Empty" stats
        stats_array.push(json!({
            "Name": "Empty",
            "Boost": "-",
            "Handling": derived.handling_empty,
            "Climb": "-",
            "Stall": derived.stall_speed_empty,
            "Speed": 0
        }));

        // Process vital parts list
        // Use Vec to preserve insertion order (matches TypeScript behavior)
        let vp = self.vital_component_list();
        let mut vp_order = Vec::new(); // Track order of first appearance
        let mut vp_map: HashMap<String, i32> = HashMap::new();

        for mut component in vp {
            // Clean up weapon set names
            if component.contains("Weapon Set #") {
                component = component
                    .replace(
                        &component[component.find("Weapon Set #").unwrap()..],
                        "Guns",
                    )
                    .trim()
                    .to_string();
            }
            // Remove # and anything after it
            if let Some(pos) = component.find('#') {
                component = component[..pos].trim().to_string();
            }

            // Track order of first appearance
            if !vp_map.contains_key(&component) {
                vp_order.push(component.clone());
            }
            *vp_map.entry(component).or_insert(0) += 1;
        }

        // Build final list in order of first appearance
        let mut vital_parts = Vec::new();
        for component in vp_order {
            let count = vp_map[&component];
            if count == 1 {
                vital_parts.push(component);
            } else {
                vital_parts.push(format!("{} x{}", component, count));
            }
        }
        let vital_parts_str = vital_parts.join(", ");

        // Get crew list
        let mut crew = Vec::new();
        for i in 0..self.cockpits.positions.len() {
            // Note: Would need localization here, but skipping for now
            crew.push(t!(self.cockpits.positions[i].get_name()).to_string());
        }
        let crew_str = crew.join(", ");

        // Build propulsion string
        let reliability_str = self.engines.get_reliability_list().join("/");
        let min_alt = self.engines.get_min_altitude();
        let max_alt = self.engines.get_max_altitude();
        let propulsion = format!(
            "Dropoff {}, Reliability {}, Overspeed {}, Ideal Alt. {}-{}, Fuel {}",
            derived.dropoff,
            reliability_str,
            derived.overspeed as i16,
            min_alt,
            max_alt,
            derived.fuel_uses
        );

        // Build aerodynamics string
        let visibility_list: Vec<String> = self
            .cockpits
            .get_visibility_list()
            .iter()
            .map(|v| v.to_string())
            .collect();
        let visibility_str = visibility_list.join("/");

        let aerodynamics = if stats.bomb_mass == 0.0 {
            format!(
                "Visibility {}, Stability {}, Energy Loss {}, Turn Bleed {}",
                visibility_str, derived.stability, derived.energy_loss, derived.turn_bleed
            )
        } else {
            format!(
                "Visibility {}, Stability {}, Energy Loss {}, Turn Bleed {} ({})",
                visibility_str,
                derived.stability,
                derived.energy_loss,
                derived.turn_bleed,
                derived.turn_bleed_w_bombs
            )
        };

        // Build survivability string
        let escape_list: Vec<String> = self
            .cockpits
            .get_escape_list()
            .iter()
            .map(|e| e.to_string())
            .collect();
        let crash_list: Vec<String> = self
            .cockpits
            .get_crash_list()
            .iter()
            .map(|c| c.to_string())
            .collect();
        let stress_list = self.cockpits.get_stress_list();
        let stress_str = stress2str(&stress_list);

        let survivability = format!(
            "Toughness {}, Max Strain {}, Escape {}, Crash Safety {}, Flight Stress {}",
            derived.toughness,
            derived.max_strain,
            escape_list.join("/"),
            crash_list.join("/"),
            stress_str
        );

        // Build armament string (simplified - full implementation would need weapon systems)
        let mut armament = String::new();

        // Add bomb/rocket info if present
        let bombs = self.munitions.get_bomb_count();
        let rockets = self.munitions.get_rocket_count();
        let mut internal = self.munitions.get_internal_bomb_count();

        if bombs > 0 {
            let int_bomb = bombs.min(internal);
            let ext_bomb = (bombs - int_bomb).max(0);
            if int_bomb > 0 {
                armament.push_str(&t!("Bomb Mass Internally.", A = int_bomb).to_string());
            }
            if ext_bomb > 0 {
                armament.push_str(&t!("Bomb Mass Externally.", A = ext_bomb).to_string());
            }
            if int_bomb > 0 {
                armament.push_str(
                    &t!(
                        "Largest Internal Bomb",
                        A = int_bomb.min(self.munitions.get_max_bomb_size())
                    )
                    .to_string(),
                );
            }
            internal -= int_bomb;
            armament.push_str("\n");
        }

        if rockets > 0 {
            let int_rock = rockets.min(internal);
            let ext_rock = (rockets - int_rock).max(0);
            if int_rock > 0 {
                armament.push_str(&t!("Rocket Mass Internally.", A = int_rock).to_string());
            }
            if ext_rock > 0 {
                armament.push_str(&t!("Rocket Mass Externally.", A = ext_rock).to_string());
            }
        }

        // Add weapon system descriptions
        let direction_list = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
        let weapon_sets = self.weapons.get_weapon_sets();
        let weapon_list = self.weapons.get_weapon_list();
        for ws in weapon_sets {
            let weapon_str = format_weapon_string(ws, weapon_list, &direction_list);
            armament.push_str(&weapon_str);
            armament.push_str("\n");
        }

        // Add warnings
        for warning in &stats.warnings {
            armament.push_str(&format!("{}:  {}\n", warning.name, warning.warning));
        }

        // Generate Link (serialization URL)
        // Similar to TypeScript MakeLink() - serialize aircraft and compress to LZ-String
        let link = match self.serialize_to_link() {
            Ok(url) => url,
            Err(_) => String::new(), // Return empty string on error
        };

        // Build final output object
        json!({
            "Name": self.name,
            "Price": stats.cost as i16,
            "Used": (stats.cost / 2.0).floor() as i16,
            "Upkeep": stats.upkeep as i16,
            "Stats": stats_array,
            "Vital Parts": vital_parts_str,
            "Crew": crew_str,
            "Propulsion": propulsion,
            "Aerodynamics": aerodynamics,
            "Survivability": survivability,
            "Armament": armament,
            "Link": link
        })
    }

    /// Serialize the aircraft to a URL-safe LZ-String format
    /// TypeScript: MakeLink()
    /// Returns a URL with the compressed aircraft data
    fn serialize_to_link(&self) -> Result<String, crate::serialization::Error> {
        let mut serializer = Serializer::new();
        self.serialize(&mut serializer)?;
        let compressed = serializer.compress_to_lz_string()?;

        // Build the URL - using a placeholder domain for now
        // In the TypeScript code, this uses the actual deployment URL
        Ok(format!(
            "http://tetragramm.github.io/Test/index.html?json={}",
            compressed
        ))
    }
}
