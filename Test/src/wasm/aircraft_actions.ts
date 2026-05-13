/**
 * Aircraft Actions Component
 * Handles top-level aircraft actions: Save, Load, Copy As Link, Dashboard, Interactive, NPC, Default
 */

import { AircraftBridge } from './aircraft_bridge';
import { Cards } from './components/cards';
import { localization } from './localization';

export class AircraftActions {
    private bridge: AircraftBridge;
    private cards: Cards;
    private onUpdate: () => void;
    private serializeLZ: () => string;

    constructor(bridge: AircraftBridge, onUpdate: () => void, serializeLZ?: () => string) {
        this.bridge = bridge;
        this.onUpdate = onUpdate;
        this.serializeLZ = serializeLZ ?? (() => this.bridge.serializeToLZString());
        this.cards = new Cards();
        this.setupButtons();
    }

    public setupButtons(): void {
        // Save buttons (top and bottom)
        const saveBtn = document.getElementById('acft_save') as HTMLButtonElement;
        if (saveBtn) {
            saveBtn.onclick = () => this.saveJSON();
        }

        // Load button
        const loadBtn = document.getElementById('acft_load') as HTMLInputElement;
        if (loadBtn) {
            loadBtn.multiple = false;
            loadBtn.accept = 'application/JSON';
            loadBtn.onchange = () => this.loadJSON(loadBtn);
        }

        // Load text areas
        const loadText1 = document.getElementById('acft_load_text') as HTMLInputElement;
        if (loadText1) {
            loadText1.onchange = () => this.loadText(loadText1);
        }
        const loadText2 = document.getElementById('acft_load_text2') as HTMLInputElement;
        if (loadText2) {
            loadText2.onchange = () => this.loadText(loadText2);
        }

        // Copy As Link button
        const linkBtn = document.getElementById('acft_save_link') as HTMLButtonElement;
        if (linkBtn) {
            linkBtn.onclick = () => this.saveLink();
        }

        // Save Dashboard button
        const dashBtn = document.getElementById('acft_save_dash') as HTMLButtonElement;
        if (dashBtn) {
            dashBtn.onclick = () => this.saveDash();
        }

        // Interactive Dashboard button
        const interactiveBtn = document.getElementById('acft_interactive_dash') as HTMLButtonElement;
        if (interactiveBtn) {
            interactiveBtn.onclick = () => this.saveInteractive();
        }

        // Save NPC button
        const npcBtn = document.getElementById('acft_save_npc') as HTMLButtonElement;
        if (npcBtn) {
            npcBtn.onclick = () => this.saveNPC();
        }

        // Default Aircraft button
        const resetBtn = document.getElementById('acft_reset') as HTMLButtonElement;
        if (resetBtn) {
            resetBtn.onclick = () => this.resetAircraft();
        }

        //Set Labels
        [{ id: "lbl_acft_save_", key: "Btn Save" },
        { id: "lbl_acft_load_", key: "Btn Load" },
        { id: "lbl_acft_save_link_", key: "Btn Copy As Link" },
        { id: "lbl_acft_save_dash_", key: "Btn Save Dashboard" },
        { id: "lbl_acft_interactive_dash_", key: "Btn Interactive Dashboard" },
        { id: "lbl_acft_save_npc_", key: "Btn Save NPC" },
        { id: "lbl_acft_reset_", key: "Btn Default Aircraft" }].forEach(value => {
            document.getElementById(value.id + "top").textContent = localization.translate(value.key);
            document.getElementById(value.id + "bot").textContent = localization.translate(value.key);
        });
    }

    /**
     * Save aircraft to JSON file
     */
    private saveJSON(): void {
        const json = this.bridge.toJSON();
        const name = this.bridge.getAircraftName();
        const version = JSON.parse(json).version;
        this.download(json, `${name}_${version}.json`, 'json');
    }

    /**
     * Load aircraft from JSON file
     */
    private loadJSON(loadButton: HTMLInputElement): void {
        if (loadButton.files.length === 0) return;

        const file = loadButton.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            try {
                const json = JSON.parse(reader.result as string);
                if (this.bridge.fromJSON(json)) {
                    // Success - aircraft loaded
                    this.onUpdate();
                    console.log('Aircraft loaded successfully');
                }
            } catch (e) {
                console.error('Failed to load aircraft:', e);
            }
        };
        reader.readAsText(file);
        loadButton.value = '';
    }

    /**
     * Load aircraft from text input
     */
    private loadText(textArea: HTMLInputElement): void {
        try {
            const json = JSON.parse(textArea.value);
            if (this.bridge.fromJSON(json)) {
                this.onUpdate();
                console.log('Aircraft loaded from text');
            }
        } catch (e) {
            console.error('Failed to parse aircraft JSON:', e);
        } finally {
            textArea.value = '';
        }
    }

    /**
     * Copy aircraft as compressed link to clipboard
     */
    private saveLink(): void {
        const compressed = this.serializeLZ();
        const link = `${location.protocol}//${location.host}${location.pathname}?json=${compressed}`;
        this.copyStringToClipboard(link);
    }

    /**
     * Save dashboard cards as images
     */
    private saveDash(): void {
        this.updateCard();
        this.cards.SaveDash();

        // Save weapon cards
        const weaponSets = this.bridge.getWeaponSets();
        for (let i = 0; i < weaponSets; i++) {
            this.updateWeaponCard(i);
            this.cards.SaveWeapon(i);
        }

        // Save engine cards
        const numEngines = this.bridge.getNumberOfEngines();
        for (let i = 0; i < numEngines; i++) {
            this.updateEngineCard(i);
            this.cards.SaveEngine(i);
        }

        // Save radiator cards
        const numRadiators = this.bridge.getNumberOfRadiators();
        for (let i = 0; i < numRadiators; i++) {
            this.updateRadiatorCard(i);
            this.cards.SaveRadiator(i);
        }
    }

    /**
     * Open interactive dashboard in new window
     */
    private saveInteractive(): void {
        const data = this.buildInteractiveDash();
        const link = `${location.protocol}//${location.host}/InteractiveDash/index.html?json=${btoa(data)}`;
        window.open(link, '_blank');
    }

    /**
     * Save NPC card
     */
    private saveNPC(): void {
        this.updateCard();

        // Find lowest overspeed among all engines
        this.cards.lowest_overspeed = -1;
        const numEngines = this.bridge.getNumberOfEngines();
        for (let i = 0; i < numEngines; i++) {
            const overspeed = this.bridge.getEngineOverspeed(i);
            if (overspeed < this.cards.lowest_overspeed || this.cards.lowest_overspeed < 0) {
                this.cards.lowest_overspeed = overspeed;
            }
        }

        // Collect all weapon data
        this.cards.all_weapons = [];
        const weaponSets = this.bridge.getWeaponSets();
        for (let i = 0; i < weaponSets; i++) {
            this.updateWeaponCard(i);
            this.cards.all_weapons.push(Object.assign({}, this.cards.weap_data));
        }

        this.cards.SaveNPC();
    }

    /**
     * Reset aircraft to default state
     */
    private resetAircraft(): void {
        this.bridge.resetAircraft();
        this.onUpdate();
    }

    /**
     * Update main aircraft card data
     */
    private updateCard(): void {
        const stats = this.bridge.getStats();
        const derived = this.bridge.getDerivedStats();

        this.cards.name = this.bridge.getAircraftName();
        this.cards.acft_data.crash = stats.crashsafety;
        this.cards.acft_data.dropoff = derived.dropoff;
        this.cards.acft_data.empty_boost = derived.boost_empty;
        this.cards.acft_data.empty_hand = derived.handling_empty;
        this.cards.acft_data.empty_climb = derived.rate_of_climb_empty;
        this.cards.acft_data.empty_stall = derived.stall_speed_empty;
        this.cards.acft_data.empty_speed = derived.max_speed_empty;
        this.cards.acft_data.energy_loss = derived.energy_loss;
        this.cards.acft_data.escape = this.bridge.getCockpitEscape(0);
        this.cards.acft_data.fuel = derived.fuel_uses;
        this.cards.acft_data.full_bomb_boost = derived.boost_full_w_bombs;
        this.cards.acft_data.full_bomb_hand = derived.handling_full_w_bombs;
        this.cards.acft_data.full_bomb_climb = derived.rate_of_climb_w_bombs;
        this.cards.acft_data.full_bomb_stall = derived.stall_speed_full_w_bombs;
        this.cards.acft_data.full_bomb_speed = derived.max_speed_w_bombs;
        this.cards.acft_data.full_boost = derived.boost_full;
        this.cards.acft_data.full_hand = derived.handling_full;
        this.cards.acft_data.full_climb = derived.rate_of_climb_full;
        this.cards.acft_data.full_stall = derived.stall_speed_full;
        this.cards.acft_data.full_speed = derived.max_speed_full;
        this.cards.acft_data.half_bomb_boost = Math.floor((derived.boost_full_w_bombs + derived.boost_empty) / 2);
        this.cards.acft_data.half_bomb_hand = Math.floor((derived.handling_full_w_bombs + derived.handling_empty) / 2);
        this.cards.acft_data.half_bomb_climb = Math.floor(1.0e-6 + (derived.rate_of_climb_w_bombs + derived.rate_of_climb_empty) / 2);
        this.cards.acft_data.half_bomb_stall = Math.floor((derived.stall_speed_full_w_bombs + derived.stall_speed_empty) / 2);
        this.cards.acft_data.half_bomb_speed = Math.floor(1.0e-6 + (derived.max_speed_w_bombs + derived.max_speed_empty) / 2);
        this.cards.acft_data.half_boost = Math.floor((derived.boost_full + derived.boost_empty) / 2);
        this.cards.acft_data.half_hand = Math.floor((derived.handling_full + derived.handling_empty) / 2);
        this.cards.acft_data.half_climb = Math.floor(1.0e-6 + (derived.rate_of_climb_full + derived.rate_of_climb_empty) / 2);
        this.cards.acft_data.half_stall = Math.floor((derived.stall_speed_full + derived.stall_speed_empty) / 2);
        this.cards.acft_data.half_speed = Math.floor(1.0e-6 + (derived.max_speed_full + derived.max_speed_empty) / 2);
        this.cards.acft_data.max_strain = derived.max_strain;

        // Ordinance
        const ordinance = [];
        const bombs = this.bridge.getBombCount();
        const rockets = this.bridge.getRocketCount();
        let internal = this.bridge.getInternalBombCount();

        if (bombs > 0) {
            const int_bomb = Math.min(bombs, internal);
            const ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0) {
                ordinance.push(localization.translateWithParam('Bomb Mass Internally.', int_bomb));
            }
            if (ext_bomb > 0) {
                ordinance.push(localization.translateWithParam('Bomb Mass Externally.', ext_bomb));
            }
            if (int_bomb > 0) {
                const maxBombSize = this.bridge.getMaxBombSize();
                const mib = Math.min(int_bomb, maxBombSize);
                ordinance.push(localization.translateWithParam('Largest Internal Bomb', mib.toString()));
            }
            internal -= int_bomb;
        }

        if (rockets > 0) {
            const int_rock = Math.min(rockets, internal);
            const ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0) {
                ordinance.push(localization.translateWithParam('Rocket Mass Internally.', int_rock));
            }
            if (ext_rock > 0) {
                ordinance.push(localization.translateWithParam('Rocket Mass Externally.', ext_rock));
            }
        }

        this.cards.acft_data.ordinance = ordinance;
        this.cards.acft_data.stability = derived.stability;
        this.cards.acft_data.stress = this.bridge.getCockpitFlightStress(0)[0];
        this.cards.acft_data.toughness = derived.toughness;
        this.cards.acft_data.turn_bleed = derived.turn_bleed;
        this.cards.acft_data.visibility = this.bridge.getCockpitVisibility(0);
        this.cards.acft_data.vital_parts = this.bridge.getVitalComponentList();
        this.cards.acft_data.armour = this.bridge.getEffectiveCoverage();
        this.cards.acft_data.warnings = stats.warnings;
    }

    /**
     * Update weapon card data
     */
    private updateWeaponCard(index: number): void {
        const weaponData = this.bridge.getWeaponSetData(index);

        this.cards.weap_data.type = weaponData.name;
        this.cards.weap_data.abrv = weaponData.abrv;
        this.cards.weap_data.ammo = weaponData.shots;
        this.cards.weap_data.ap = weaponData.ap;
        this.cards.weap_data.jam = weaponData.jam;
        this.cards.weap_data.hits = weaponData.hits;
        this.cards.weap_data.damage = weaponData.damage;
        this.cards.weap_data.tags = weaponData.tags;
        this.cards.weap_data.reload = weaponData.reload;
        this.cards.weap_data.gyrojet = weaponData.gyrojet || false;
    }

    /**
     * Update engine card data
     */
    private updateEngineCard(index: number): void {
        this.cards.eng_data.reliability = this.bridge.getEngineReliability(index);
        this.cards.eng_data.overspeed = this.bridge.getEngineOverspeed(index);
        this.cards.eng_data.altitude = this.bridge.getEngineAltitude(index);

        if (this.bridge.engineNeedsCooling(index)) {
            this.cards.eng_data.radiator = this.bridge.getEngineRadiatorIndex(index);
        } else {
            this.cards.eng_data.radiator = -1;
        }

        this.cards.eng_data.notes = this.bridge.getEngineNotes(index);
        this.cards.eng_data.min_IAF = this.bridge.getEngineMinAltitude(index);
    }

    /**
     * Update radiator card data
     */
    private updateRadiatorCard(index: number): void {
        const mountType = this.bridge.getRadiatorMountType(index);
        const coolantType = this.bridge.getRadiatorCoolantType(index);

        this.cards.rad_data.mount_type = localization.translate(mountType);
        this.cards.rad_data.coolant_type = localization.translate(coolantType);
    }

    /**
     * Build interactive dashboard JSON data
     */
    private buildInteractiveDash(): string {
        const stats = this.bridge.getStats();
        const derived = this.bridge.getDerivedStats();

        // Get vital parts (limit to 10)
        const vitalParts = this.bridge.getVitalComponentList();
        let remove = false;
        while (vitalParts.length > 10) {
            vitalParts.pop();
            remove = true;
        }
        if (remove) {
            vitalParts.pop();
            vitalParts.push('And More. See Plane Builder for full list.');
        }
        while (vitalParts.length < 10) {
            vitalParts.push('');
        }

        // Build armour string
        const coverage = this.bridge.getEffectiveCoverage();
        let armourStr = '';
        for (let r = 0; r < coverage.length; r++) {
            const AP = r + 1;
            if (coverage[r] > 0) {
                if (armourStr !== '') {
                    armourStr += ', ';
                } else {
                    armourStr += localization.translate('Armour') + ' ';
                }
                armourStr += `${AP}/+${11 - coverage[r]}`;
            }
        }

        // Build ordinance list
        const ordinance = [];
        const bombs = this.bridge.getBombCount();
        const rockets = this.bridge.getRocketCount();
        let internal = this.bridge.getInternalBombCount();

        if (bombs > 0 || rockets > 0) {
            ordinance.push('Current load here.');
        }

        if (bombs > 0) {
            const int_bomb = Math.min(bombs, internal);
            const ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0) {
                ordinance.push(localization.translateWithParam('Bomb Mass Internally.', int_bomb));
            }
            if (ext_bomb > 0) {
                ordinance.push(localization.translateWithParam('Bomb Mass Externally.', ext_bomb));
            }
            if (int_bomb > 0) {
                const maxBombSize = this.bridge.getMaxBombSize();
                const mib = Math.min(int_bomb, maxBombSize);
                ordinance.push(localization.translateWithParam('Largest Internal Bomb', mib.toString()));
            }
            internal -= int_bomb;
        }

        if (rockets > 0) {
            const int_rock = Math.min(rockets, internal);
            const ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0) {
                ordinance.push(localization.translateWithParam('Rocket Mass Internally.', int_rock));
            }
            if (ext_rock > 0) {
                ordinance.push(localization.translateWithParam('Rocket Mass Externally.', ext_rock));
            }
        }

        while (ordinance.length < 5) {
            ordinance.push('');
        }

        // Build warnings string
        let warnings = '';
        for (const w of stats.warnings) {
            warnings += `${w.source}: ${w.warning}\n`;
        }

        const planeState = {
            altitude: 0,
            airspeed: 0,
            fuel: derived.fuel_uses,
            dropoff: derived.dp_empty,
            visibility: this.bridge.getCockpitVisibility(0),
            energy_loss: derived.energy_loss,
            turn_bleed: derived.turn_bleed,
            stability: derived.stability,
            stress: this.bridge.getCockpitFlightStress(0)[0],
            plane_escape: this.bridge.getCockpitEscape(0),
            crash: this.bridge.getCockpitCrash(0),
            max_toughness: derived.toughness,
            current_toughness: derived.toughness,
            max_strain: derived.max_strain,
            current_strain: derived.max_strain,
            g_force: 0,
            kills: 0,
            full_load_boost: derived.boost_full_w_bombs,
            full_load_handling: derived.handling_full_w_bombs,
            full_load_climb: derived.rate_of_climb_w_bombs,
            full_load_stall: derived.stall_speed_full_w_bombs,
            full_load_speed: derived.max_speed_w_bombs,
            half_fuel_bombs_boost: Math.floor((derived.boost_full_w_bombs + derived.boost_empty) / 2),
            half_fuel_bombs_handling: Math.floor((derived.handling_full_w_bombs + derived.handling_empty) / 2),
            half_fuel_bombs_climb: Math.floor(1.0e-6 + (derived.rate_of_climb_w_bombs + derived.rate_of_climb_empty) / 2),
            half_fuel_bombs_stall: Math.floor((derived.stall_speed_full_w_bombs + derived.stall_speed_empty) / 2),
            half_fuel_bombs_speed: Math.floor(1.0e-6 + (derived.max_speed_w_bombs + derived.max_speed_empty) / 2),
            full_fuel_no_bombs_boost: derived.boost_full,
            full_fuel_no_bombs_handling: derived.handling_full,
            full_fuel_no_bombs_climb: derived.rate_of_climb_full,
            full_fuel_no_bombs_stall: derived.stall_speed_full,
            full_fuel_no_bombs_speed: derived.max_speed_full,
            half_fuel_no_bombs_boost: Math.floor((derived.boost_full + derived.boost_empty) / 2),
            half_fuel_no_bombs_handling: Math.floor((derived.handling_full + derived.handling_empty) / 2),
            half_fuel_no_bombs_climb: Math.floor(1.0e-6 + (derived.rate_of_climb_full + derived.rate_of_climb_empty) / 2),
            half_fuel_no_bombs_stall: Math.floor((derived.stall_speed_full + derived.stall_speed_empty) / 2),
            half_fuel_no_bombs_speed: Math.floor(1.0e-6 + (derived.max_speed_full + derived.max_speed_empty) / 2),
            empty_boost: 0,
            empty_handling: derived.handling_empty,
            empty_climb: 0,
            empty_stall: derived.stall_speed_empty,
            empty_speed: 0,
            vital_part_1: vitalParts[0],
            vital_part_2: vitalParts[1],
            vital_part_3: vitalParts[2],
            vital_part_4: vitalParts[3],
            vital_part_5: vitalParts[4],
            vital_part_6: vitalParts[5],
            vital_part_7: vitalParts[6],
            vital_part_8: vitalParts[7],
            vital_part_9: vitalParts[8],
            vital_part_10: vitalParts[9],
            armor: armourStr,
            max_bomb_load: ordinance[0],
            ordinance_1: ordinance[1],
            ordinance_2: ordinance[2],
            ordinance_3: ordinance[3],
            ordinance_4: ordinance[4],
            notes: warnings,
            full_load_selected: true,
            half_fuel_bombs_selected: false,
            full_fuel_no_bombs_selected: false,
            half_fuel_no_bombs_selected: false,
            empty_selected: false,
            engines: this.buildInteractiveEngines(),
            weapons: this.buildInteractiveWeapons(),
        };

        return JSON.stringify(planeState);
    }

    /**
     * Build interactive engine data
     */
    private buildInteractiveEngines(): string[] {
        const engines = [];
        const numEngines = this.bridge.getNumberOfEngines();

        for (let i = 0; i < numEngines; i++) {
            const reliability = this.bridge.getEngineReliability(i);
            const minAlt = this.bridge.getEngineMinAltitude(i);
            const maxAlt = this.bridge.getEngineMaxAltitude(i);
            const overspeed = this.bridge.getEngineOverspeed(i);
            const notes = this.bridge.getEngineNotes(i);

            const engineState = {
                rpm: 0,
                wear: 0,
                reliability: reliability,
                ideal_altitide: `${minAlt}-${maxAlt}`,
                overspeed: overspeed,
                notes: notes.join(', '),
            };

            engines.push(JSON.stringify(engineState));
        }

        return engines;
    }

    /**
     * Build interactive weapon data
     */
    private buildInteractiveWeapons(): string[] {
        const weapons = [];
        const weaponSets = this.bridge.getWeaponSets();

        for (let i = 0; i < weaponSets; i++) {
            const weaponData = this.bridge.getWeaponSetData(i);

            const weaponState = {
                type: weaponData.name,
                ammo: weaponData.shots,
                ap: weaponData.ap,
                jam: weaponData.jam,
                knife_hits: weaponData.hits[0],
                close_hits: weaponData.hits[1],
                long_hits: weaponData.hits[2],
                extreme_hits: weaponData.hits[3],
                knife_damage: weaponData.damage[0],
                close_damage: weaponData.damage[1],
                long_damage: weaponData.damage[2],
                extreme_damage: weaponData.damage[3],
                tags: weaponData.tags.join(', '),
            };

            weapons.push(JSON.stringify(weaponState));
        }

        return weapons;
    }

    // Function to download data to a file
    private download(data, filename, type) {
        const file = new Blob([data], { type: type });
        const a = document.createElement("a"),

            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    private copyStringToClipboard(str) {
        // Create new element
        const el = document.createElement('textarea');
        // Set value (string to be copied)
        el.value = str;
        // Set non-editable to avoid focus and move outside of view
        el.setAttribute('readonly', '');
        el.style.position = "absolute";
        el.style.left = "-9999px";
        document.body.appendChild(el);
        // Select text inside element
        el.select();
        // Copy text to clipboard
        document.execCommand('copy');
        // Remove temporary element
        document.body.removeChild(el);
    }
}
