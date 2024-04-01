import { Display } from "../../Test/src/disp/Display";
import { Era_HTML } from "../../Test/src/disp/Era";
import { Cockpits_HTML } from "../../Test/src/disp/Cockpits";
import { Passengers_HTML } from "../../Test/src/disp/Passengers";
import { Engines_HTML } from "../../Test/src/disp/Engines";
import { Frames_HTML } from "../../Test/src/disp/Frames";
import { Stabilizers_HTML } from "../../Test/src/disp/Stabilizers";
import { Reinforcement_HTML } from "../../Test/src/disp/Reinforcement";
import { Load_HTML } from "../../Test/src/disp/Load";
import { LandingGear_HTML } from "../../Test/src/disp/LandingGear";
import { Accessories_HTML } from "../../Test/src/disp/Accessories";
import { Optimization_HTML } from "../../Test/src/disp/Optimization";
import { Weapons_HTML, WeaponName, WeaponString, WeaponTags } from "../../Test/src/disp/Weapons";
import { Used_HTML } from "../../Test/src/disp/Used";
import { Rotor_HTML } from "../../Test/src/disp/Rotor";
import { AlterStats_HTML } from "../../Test/src/disp/AlterStats";
import { Cards, ENGINE_TEXT } from "../../Test/src/disp/Cards";
import { insertRow, CreateTH, BlinkIfChanged, BlinkBad, download, _arrayBufferToString, _stringToArrayBuffer, copyStringToClipboard } from "../../Test/src/disp/Tools";

import { Derived_Heli_HTML } from "./Derived_Heli";
import { Helicopter } from "./Helicopter";
import { AIRCRAFT_TYPE, HeliPartStorage } from "../../Test/src/impl/Part";
import { WeaponSystem } from "../../Test/src/impl/WeaponSystem";
import { Engine } from "../../Test/src/impl/Engine";
import { Radiator } from "../../Test/src/impl/Radiator";
import { Serialize } from "../../Test/src/impl/Serialize";
import { Stats } from "../../Test/src/impl/Stats";
import { DerivedStats } from "../../Test/src/impl/Aircraft";

import { lu } from "../../Test/src/impl/Localization";
import { StringFmt } from "../../Test/src/string";
import { LZString } from "../../Test/src/lz/lz-string";
import { GetEngineLists } from "../../Test/src/impl/EngineList";
import { SynchronizationType } from "../../Test/src/impl/Weapon";

export class Helicopter_HTML extends Display {
    private heli: Helicopter;
    private era: Era_HTML;
    private cockpits: Cockpits_HTML;
    private passengers: Passengers_HTML;
    private engines: Engines_HTML;
    private frames: Frames_HTML;
    private stabilizers: Stabilizers_HTML;
    private reinforcements: Reinforcement_HTML;
    private load: Load_HTML;
    private gear: LandingGear_HTML;
    private accessories: Accessories_HTML;
    private optimization: Optimization_HTML;
    private weapons: Weapons_HTML;
    private used: Used_HTML;
    private rotor: Rotor_HTML;
    private derived: Derived_Heli_HTML;
    private alter: AlterStats_HTML;

    private acft_type: HTMLSelectElement;

    //Stats Display
    private d_lift: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_wmas: HTMLTableCellElement;
    private d_bmas: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_upkp: HTMLTableCellElement;
    private d_cont: HTMLTableCellElement;
    private d_pstb: HTMLTableCellElement;
    private d_lstb: HTMLTableCellElement;
    private d_powr: HTMLTableCellElement;
    private d_fcom: HTMLTableCellElement;
    private d_fuel: HTMLTableCellElement;
    private d_pspd: HTMLTableCellElement;
    private d_pbst: HTMLTableCellElement;
    private d_wara: HTMLTableCellElement;
    private d_mstr: HTMLTableCellElement;
    private d_strc: HTMLTableCellElement;
    private d_tugh: HTMLTableCellElement;
    private d_chrg: HTMLTableCellElement;
    private d_crsh: HTMLTableCellElement;

    private cards: Cards;
    private parts_JSON: HeliPartStorage;


    constructor(js: HeliPartStorage, heli: Helicopter) {
        super();

        this.parts_JSON = js;
        this.heli = heli;
        this.era = new Era_HTML(this.heli.GetEra());
        this.cockpits = new Cockpits_HTML(heli.GetCockpits());
        this.passengers = new Passengers_HTML(heli.GetPassengers());
        this.engines = new Engines_HTML(heli.GetEngines());
        this.frames = new Frames_HTML(heli.GetFrames());
        this.stabilizers = new Stabilizers_HTML(heli.GetStabilizers());
        this.reinforcements = new Reinforcement_HTML(heli.GetReinforcements());
        this.load = new Load_HTML(heli.GetFuel(), heli.GetMunitions(), heli.GetCargoAndPassengers());
        this.gear = new LandingGear_HTML(heli.GetLandingGear());
        this.accessories = new Accessories_HTML(heli.GetAccessories());
        this.optimization = new Optimization_HTML(heli.GetOptimization());
        this.weapons = new Weapons_HTML(heli.GetWeapons());
        this.used = new Used_HTML(heli.GetUsed());
        this.rotor = new Rotor_HTML(heli.GetRotor());
        this.alter = new AlterStats_HTML(heli.GetAlter());

        (document.getElementById("lbl_acft_type") as HTMLLabelElement).textContent = lu("Aircraft Type Section Title");
        this.acft_type = document.getElementById("acft_type") as HTMLSelectElement;
        let idx = 0;
        for (let type in AIRCRAFT_TYPE) {
            if (isNaN(Number(type))) {
                let opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.text = lu(type);
                this.acft_type.add(opt);
            }
        }
        this.acft_type.selectedIndex = 1;
        this.acft_type.onchange = () => {
            this.acft_type.selectedIndex = 1;
        };

        (document.getElementById("lbl_stats") as HTMLLabelElement).textContent = lu("Aircraft Stats Section Title");
        var tbl = document.getElementById("tbl_stats") as HTMLTableElement;
        this.InitStats(tbl);

        (document.getElementById("lbl_derived") as HTMLLabelElement).textContent = lu("Aircraft Derived Section Title");
        var tbl2 = document.getElementById("tbl_derived") as HTMLTableElement;
        this.InitDerived(tbl2);

        this.heli.SetDisplayCallback(() => { this.UpdateDisplay(); });

        (document.getElementById("lbl_acft_save_top") as HTMLLabelElement).textContent = lu("Aircraft Button Save");
        (document.getElementById("lbl_acft_save_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Save");
        var save_button = document.getElementById("acft_save") as HTMLButtonElement;
        save_button.onclick = () => { this.SaveJSON(); };

        (document.getElementById("lbl_acft_load_top") as HTMLLabelElement).textContent = lu("Aircraft Button Load");
        (document.getElementById("lbl_acft_load_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Load");
        var load_button = document.getElementById("acft_load") as HTMLInputElement;
        load_button.multiple = false;
        load_button.accept = "application/JSON";
        load_button.onchange = (evt) => { this.LoadJSON(load_button); };

        var load_text_area = document.getElementById("acft_load_text") as HTMLInputElement;
        load_text_area.onchange = () => { this.LoadText(load_text_area); };
        var load_text_area2 = document.getElementById("acft_load_text2") as HTMLInputElement;
        load_text_area2.onchange = () => { this.LoadText(load_text_area2); };

        (document.getElementById("lbl_acft_save_link_top") as HTMLLabelElement).textContent = lu("Aircraft Button Copy As Link");
        (document.getElementById("lbl_acft_save_link_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Copy As Link");
        var link_button = document.getElementById("acft_save_link") as HTMLButtonElement;
        link_button.onclick = () => { this.SaveLink(); };


        this.cards = new Cards();
        (document.getElementById("lbl_acft_save_dash_top") as HTMLLabelElement).textContent = lu("Aircraft Button Save Dashboard");
        (document.getElementById("lbl_acft_save_dash_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Save Dashboard");
        var dash_button = document.getElementById("acft_save_dash") as HTMLButtonElement;
        dash_button.onclick = () => { this.SaveDash(); };


        (document.getElementById("lbl_acft_interactive_dash_top") as HTMLLabelElement).textContent = lu("Aircraft Button Interactive Dashboard");
        (document.getElementById("lbl_acft_interactive_dash_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Interactive Dashboard");
        var interactive_button = document.getElementById("acft_interactive_dash") as HTMLButtonElement;
        interactive_button.onclick = () => { this.SaveInteractive(); };

        (document.getElementById("lbl_acft_save_npc_top") as HTMLLabelElement).textContent = lu("Aircraft Button Save NPC");
        (document.getElementById("lbl_acft_save_npc_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Save NPC");
        var npc_button = document.getElementById("acft_save_npc");
        npc_button.onclick = () => { this.SaveNPC(); }

        (document.getElementById("lbl_acft_reset_top") as HTMLLabelElement).textContent = lu("Aircraft Button Default Aircraft");
        (document.getElementById("lbl_acft_reset_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Default Aircraft");
        var reset_button = document.getElementById("acft_reset") as HTMLButtonElement;
        reset_button.onclick = () => { this.heli.Reset(); this.derived.SetName(this.heli.name); this.heli.CalculateStats(); this.SetCollapse(); };

        (document.getElementById("lbl_acft_save_cat_top") as HTMLLabelElement).textContent = lu("Aircraft Button Save Catalog");
        (document.getElementById("lbl_acft_save_cat_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Save Catalog");
        var cat_button = document.getElementById("acft_save_cat");
        cat_button.onclick = () => { this.CatalogStats(); }
        this.SetCollapse();
    }

    private UpdateCard() {
        this.heli.name = this.derived.GetName();
        var stats = this.heli.GetStats();
        var derived = this.heli.GetDerivedStats();
        this.cards.name = this.heli.name;
        this.cards.acft_data.armour = this.heli.GetAccessories().GetEffectiveCoverage();
        this.cards.acft_data.crash = stats.crashsafety;
        this.cards.acft_data.dropoff = derived.Dropoff;
        this.cards.acft_data.empty_boost = derived.BoostEmpty;
        this.cards.acft_data.empty_hand = derived.HandlingEmpty;
        this.cards.acft_data.empty_climb = derived.RateOfClimbEmpty;
        this.cards.acft_data.empty_stall = derived.StallSpeedEmpty;
        this.cards.acft_data.empty_speed = Math.floor(1.0e-6 + derived.MaxSpeedEmpty);
        this.cards.acft_data.energy_loss = derived.EnergyLoss;
        this.cards.acft_data.escape = this.heli.GetCockpits().GetEscapeList()[0];
        this.cards.acft_data.fuel = derived.FuelUses;
        this.cards.acft_data.full_bomb_boost = derived.BoostFullwBombs;
        this.cards.acft_data.full_bomb_hand = derived.HandlingFullwBombs;
        this.cards.acft_data.full_bomb_climb = derived.RateOfClimbwBombs;
        this.cards.acft_data.full_bomb_stall = derived.StallSpeedFullwBombs;
        this.cards.acft_data.full_bomb_speed = derived.MaxSpeedwBombs;
        this.cards.acft_data.full_boost = derived.BoostFull;
        this.cards.acft_data.full_hand = derived.HandlingFull;
        this.cards.acft_data.full_climb = derived.RateOfClimbFull;
        this.cards.acft_data.full_stall = derived.StallSpeedFull;
        this.cards.acft_data.full_speed = Math.floor(1.0e-6 + derived.MaxSpeedFull);
        this.cards.acft_data.half_bomb_boost = Math.floor((derived.BoostFullwBombs + derived.BoostEmpty) / 2);
        this.cards.acft_data.half_bomb_hand = Math.floor((derived.HandlingFullwBombs + derived.HandlingEmpty) / 2);
        this.cards.acft_data.half_bomb_climb = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2);
        this.cards.acft_data.half_bomb_stall = Math.floor((derived.StallSpeedFullwBombs + derived.StallSpeedEmpty) / 2);
        this.cards.acft_data.half_bomb_speed = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2);
        this.cards.acft_data.half_boost = Math.floor((derived.BoostFull + derived.BoostEmpty) / 2);
        this.cards.acft_data.half_hand = Math.floor((derived.HandlingFull + derived.HandlingEmpty) / 2);
        this.cards.acft_data.half_climb = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2);
        this.cards.acft_data.half_stall = Math.floor((derived.StallSpeedFull + derived.StallSpeedEmpty) / 2);
        this.cards.acft_data.half_speed = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2);
        this.cards.acft_data.max_strain = derived.MaxStrain;
        var ordinance = [];
        var bombs = this.heli.GetMunitions().GetBombCount();
        var rockets = this.heli.GetMunitions().GetRocketCount();
        var internal = this.heli.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(lu(" Bomb Mass Internally.", int_bomb));
            if (ext_bomb > 0)
                ordinance.push(lu(" Bomb Mass Externally.", ext_bomb));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.heli.GetMunitions().GetMaxBombSize());
                ordinance.push(lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                ordinance.push(lu(" Rocket Mass Internally.", int_rock));
            if (ext_rock > 0)
                ordinance.push(lu(" Rocket Mass Externally.", ext_rock));
        }
        this.cards.acft_data.ordinance = ordinance;
        this.cards.acft_data.stability = derived.Stabiilty;
        this.cards.acft_data.stress = this.heli.GetCockpits().GetStressList()[0][0];
        this.cards.acft_data.toughness = derived.Toughness;
        this.cards.acft_data.turn_bleed = derived.TurnBleed;
        this.cards.acft_data.visibility = this.heli.GetCockpits().GetVisibilityList()[0];
        this.cards.acft_data.vital_parts = this.heli.VitalComponentList();
        this.cards.acft_data.warnings = stats.warnings;
    }

    private UpdateWeaponCard(w: WeaponSystem) {
        var wlist = this.heli.GetWeapons().GetWeaponList();
        var dlist = this.heli.GetWeapons().GetDirectionList();

        var name = WeaponName(w, wlist);
        if (w.IsPlural()) {
            name = w.GetWeaponCount().toString() + "x " + name;
        }

        var ds = w.GetDirection();
        var dtag = "";
        dtag += "[";
        for (let i = 0; i < dlist.length; i++) {
            if (ds[i])
                dtag += lu(dlist[i]) + " ";
        }
        dtag = dtag.substr(0, dtag.length - 1);
        dtag += "] ";

        var fweap = w.GetFinalWeapon();

        this.cards.weap_data.ammo = w.GetShots();
        this.cards.weap_data.ap = fweap.ap;
        this.cards.weap_data.hits = w.GetHits();

        if (wlist[w.GetWeaponSelected()].abrv == "PR") {
            this.cards.weap_data.damage = [5, 5, 5, 5];
        } else {
            this.cards.weap_data.damage = [
                fweap.damage * this.cards.weap_data.hits[0],
                fweap.damage * this.cards.weap_data.hits[1],
                fweap.damage * this.cards.weap_data.hits[2],
                fweap.damage * this.cards.weap_data.hits[3]];
        }

        this.cards.weap_data.jam = w.GetJam();
        this.cards.weap_data.tags = [dtag];
        this.cards.weap_data.type = name;
        this.cards.weap_data.abrv = fweap.abrv;
        this.cards.weap_data.reload = fweap.reload;

        this.cards.weap_data.tags.concat(WeaponTags(w))
    }

    private UpdateEngineCard(e: Engine) {
        var estats = e.GetCurrentStats();
        this.cards.eng_data.reliability = e.GetReliability();
        this.cards.eng_data.overspeed = e.GetOverspeed();
        this.cards.eng_data.altitude = estats.altitude;
        if (e.NeedCooling()) {
            this.cards.eng_data.radiator = e.GetRadiator();
        } else {
            this.cards.eng_data.radiator = -1;
        }
        this.cards.eng_data.notes = [];

        if (estats.pulsejet) {
            this.cards.eng_data.notes.push(lu("Pulsejet"));
            if (e.GetSelectedList() != "") {
                var inputs = GetEngineLists().get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.power > 0 && inputs.starter) {
                    this.cards.eng_data.notes.push(lu("Starter"));
                }
            }
        }
        else {

            if (e.IsRotary() && e.IsTractor()) {
                this.cards.eng_data.notes.push(lu("Turns Right"));
            } else if (e.IsRotary() && e.IsPusher()) {
                this.cards.eng_data.notes.push(lu("Turns Left"));
            }

            if (e.GetSelectedList() != "") {
                var inputs = GetEngineLists().get(e.GetSelectedList()).get_name(estats.name);

                this.cards.eng_data.min_IAF = inputs.min_IdealAlt;
                if (inputs.upgrades[1]) {
                    this.cards.eng_data.notes.push(lu("War Emergency Power"));
                } else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    this.cards.eng_data.notes.push(lu("War Emergency Power from altitudes 0-9"));
                }
            }
        }
    }

    private UpdateRadiatorCard(r: Radiator) {
        this.cards.rad_data.mount_type = lu(r.GetMountList()[r.GetMountIndex()].name);
        this.cards.rad_data.coolant_type = lu(r.GetCoolantList()[r.GetCoolantIndex()].name);
    }

    private LoadJSON(load_button: HTMLInputElement) {
        if (load_button.files.length == 0)
            return;
        var file = load_button.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            try {
                var str = JSON.parse(reader.result as string);
                var acft = new Helicopter(this.parts_JSON, false);
                if (acft.fromJSON(str)) {
                    str = JSON.parse(reader.result as string);
                    console.log(str);
                    this.heli.fromJSON(str);
                    this.derived.SetName(this.heli.name);
                    this.heli.CalculateStats();
                    this.SetCollapse();
                }

            } catch (e) {
                console.error(e, e.stack);
            }
        };
        reader.readAsText(file);
        load_button.value = "";
    }

    private Stress2Str(arr: any[]) {
        var str = "";
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + "), ";
            } else {
                str += arr[i][0].toString() + ", ";
            }
        }
        if (arr.length > 0) {
            var i = arr.length - 1;
            if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
                str += arr[i][0].toString() + "(" + arr[i][1].toString() + ")";
            } else {
                str += arr[i][0].toString();
            }
        }

        return str;
    }

    private CatalogStats() {
        this.heli.name = this.derived.GetName();
        const stats = this.heli.GetStats();
        const derived = this.heli.GetDerivedStats();

        var catalog_stats = "\\FCPlane[Nickname=\\FrameDefault{Not Set}, %Box Text = {}, Image = {},\n";
        catalog_stats += StringFmt.Format("Name={{0}}, Price={1}, Used={2}, Upkeep={3},\n", this.heli.name, stats.cost, Math.floor(1.0e-6 + stats.cost / 2), stats.upkeep);
        catalog_stats += "Stats = {\n";
        if (stats.bomb_mass > 0) {
            catalog_stats += StringFmt.Format("Full Load & {0} & {1} & {2} & {3} & {4} \\\\\n",
                derived.BoostFullwBombs,
                derived.HandlingFullwBombs,
                derived.RateOfClimbwBombs,
                derived.StallSpeedFullwBombs,
                derived.MaxSpeedwBombs);
            catalog_stats += "\\nicefrac{1}{2}" + StringFmt.Format(", Bombs & {0} & {1} & {2} & {3} & {4}\\\\\n",
                Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2),
                Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2),
                Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2),
                Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2),
                Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2));
        }
        catalog_stats += StringFmt.Format("Full Fuel & {0} & {1} & {2} & {3} & {4}\\\\\n",
            derived.BoostFull,
            derived.HandlingFull,
            derived.RateOfClimbFull,
            derived.StallSpeedFull,
            derived.MaxSpeedFull);
        catalog_stats += StringFmt.Format("Half Fuel & {0} & {1} & {2} & {3} & {4}\\\\\n",
            Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2),
            Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2),
            Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2),
            Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2),
            Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2));
        catalog_stats += StringFmt.Format("Empty & {0} & {1} & {2} & {3} & {4}\\\\\n",
            "-",
            derived.HandlingEmpty,
            "-",
            derived.StallSpeedEmpty,
            0);
        catalog_stats += "},\n";
        var vp = this.heli.VitalComponentList();
        var vp_map = new Map<string, number>();
        for (let str of vp) {
            str = str.replace(/Weapon Set #.*/g, "Guns").trim();
            str = str.replace(/#.*/g, "").trim();
            if (vp_map.has(str))
                vp_map.set(str, vp_map.get(str) + 1);
            else
                vp_map.set(str, 1);
        }
        vp = [];
        for (let str of vp_map.keys()) {
            if (vp_map.get(str) == 1)
                vp.push(str);
            else
                vp.push(str + " x" + vp_map.get(str).toString());
        }
        catalog_stats += "Vital Parts = {" + StringFmt.Join(", ", vp) + "},\n";
        var crew = [];
        for (let i = 0; i < this.heli.GetCockpits().GetNumberOfCockpits(); i++) {
            crew.push(lu(this.heli.GetCockpits().GetCockpit(i).GetName()));
        }
        catalog_stats += "Crew = {" + StringFmt.Join(", ", crew) + "},\n";
        catalog_stats += "Propulsion = {" + StringFmt.Format("Dropoff {0}, Reliability {1}, Overspeed {2}, Ideal Alt. {3}, Fuel {4}",
            derived.Dropoff,
            StringFmt.Join("/", this.heli.GetReliabilityList()),
            derived.Overspeed,
            this.heli.GetMinAltitude().toString() + "-" + this.heli.GetMaxAltitude().toString(),
            derived.FuelUses) + "},\n";


        catalog_stats += "Aerodynamics = {";
        if (stats.bomb_mass == 0) {
            catalog_stats += StringFmt.Format("Visibility {0}, Stability {1}, Energy Loss {2}, Turn Bleed {3}",
                StringFmt.Join("/", this.heli.GetVisibilityList()),
                derived.Stabiilty,
                derived.EnergyLoss,
                derived.TurnBleed);
        } else {
            catalog_stats += StringFmt.Format("Visibility {0}, Stability {1}, Energy Loss {2}, Turn Bleed {3} ({4})",
                StringFmt.Join("/", this.heli.GetVisibilityList()),
                derived.Stabiilty,
                derived.EnergyLoss,
                derived.TurnBleed,
                derived.TurnBleedwBombs);
        }
        catalog_stats += "},\nSurvivability = {";
        catalog_stats += StringFmt.Format("Toughness {0}, Max Strain {1}, Escape {2}, Crash Safety {3}, Flight Stress {4}",
            derived.Toughness,
            derived.MaxStrain,
            StringFmt.Join("/", this.heli.GetEscapeList()),
            StringFmt.Join("/", this.heli.GetCrashList()),
            this.Stress2Str(this.heli.GetStressList())) + "},\n";

        catalog_stats += "Armament = {";
        const wlist = this.heli.GetWeapons().GetWeaponList();
        const dlist = this.heli.GetWeapons().GetDirectionList();
        const bombs = this.heli.GetMunitions().GetBombCount();
        const rockets = this.heli.GetMunitions().GetRocketCount();
        var internal = this.heli.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            const int_bomb = Math.min(bombs, internal);
            const ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                catalog_stats += lu(" Bomb Mass Internally.", int_bomb);
            if (ext_bomb > 0)
                catalog_stats += lu(" Bomb Mass Externally.", ext_bomb);
            if (int_bomb > 0) {
                const mib = Math.min(int_bomb, this.heli.GetMunitions().GetMaxBombSize());
                catalog_stats += (lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            catalog_stats += "\\\\\n";
        }
        if (rockets > 0) {
            const int_rock = Math.min(rockets, internal);
            const ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                catalog_stats += lu(" Rocket Mass Internally.", int_rock);
            if (ext_rock > 0)
                catalog_stats += lu(" Rocket Mass Externally.", ext_rock);
            catalog_stats += "\\\\\n";
        }

        const wsets = this.heli.GetWeapons().GetWeaponSets();
        for (let wi = 0; wi < wsets.length; wi++) {
            const w = wsets[wi];
            let wstring = WeaponString(w, wlist, dlist);
            var synchstring = "fires";
            for (let weap of w.GetWeapons()) {
                if (weap.GetSynchronization() == SynchronizationType.INTERRUPT || weap.GetSynchronization() == SynchronizationType.SYNCH) {
                    synchstring = "✣ fires";
                }
            }
            wstring = wstring.replace("fires", synchstring)
            catalog_stats += wstring + "\\\\\n";
        }
        for (let w of stats.warnings) {
            catalog_stats += w.source + ":  " + w.warning + "\\\\\n";
        }

        catalog_stats += "},\nLink = {" + this.MakeLink() + "}\n]{\n\n\n}";

        catalog_stats = catalog_stats.replaceAll("#", "\\#");

        download(catalog_stats, this.heli.name + "_" + this.heli.GetVersion() + ".txt", "txt");
    }

    private LoadText(text_area: HTMLInputElement) {
        try {
            var str = JSON.parse(text_area.value);
            var acft = new Helicopter(this.parts_JSON, false);
            if (acft.fromJSON(str)) {
                this.heli.fromJSON(str);
                this.derived.SetName(this.heli.name);
                this.heli.CalculateStats();
                this.SetCollapse();
            }
        } catch {
            BlinkBad(text_area.parentElement);
        } finally {
            text_area.value = "";
        }
    }

    private SaveJSON() {
        this.heli.name = this.derived.GetName();
        download(JSON.stringify(this.heli.toJSON()), this.heli.name + "_" + this.heli.GetVersion() + ".json", "json");
    }

    public SetCollapse() {
        this.alter.SetCollapse();
        this.gear.SetCollapse();
        this.optimization.SetCollapse();
        this.passengers.SetCollapse();
        this.stabilizers.SetCollapse();
        this.used.SetCollapse();
    }

    private MakeLink() {
        this.heli.name = this.derived.GetName();
        var ser = new Serialize();
        this.heli.serialize(ser);
        var arr = ser.FinalArray();
        var str2 = _arrayBufferToString(arr);
        var txt2 = LZString.compressToEncodedURIComponent(str2);
        var link = (location.protocol + "//" + location.host + location.pathname + "?json=" + txt2);
        return link;
    }

    private SaveLink() {
        copyStringToClipboard(this.MakeLink());
    }

    private SaveDash() {
        this.UpdateCard();
        this.cards.SaveDash();
        var wsetlist = this.heli.GetWeapons().GetWeaponSets();
        for (let i = 0; i < wsetlist.length; i++) {
            this.UpdateWeaponCard(wsetlist[i]);
            this.cards.SaveWeapon(i);
        }
        for (let i = 0; i < this.heli.GetEngines().GetNumberOfEngines(); i++) {
            let e = this.heli.GetEngines().GetEngine(i);
            this.UpdateEngineCard(e);

            if (e.GetUsePushPull()) {
                var rely = this.cards.eng_data.reliability;
                var rely2 = rely.split('/');
                this.cards.eng_data.reliability = rely2[0].toString();
                this.cards.SaveEngine(i, ENGINE_TEXT.PULLER);
                this.cards.eng_data.reliability = rely2[0].toString();
                this.cards.SaveEngine(i, ENGINE_TEXT.PUSHER);
            } else {
                this.cards.SaveEngine(i);
            }
        }
        for (let i = 0; i < this.heli.GetEngines().GetNumberOfRadiators(); i++) {
            this.UpdateRadiatorCard(this.heli.GetEngines().GetRadiator(i));
            this.cards.SaveRadiator(i);
        }
    }

    private SaveInteractive() {
        const link = (location.protocol + "//" + location.host + "/InteractiveDash/index.html?json=" + btoa(this.InteractiveDash()));
        window.open(link, "_blank");
    }

    private InteractiveDash() {
        this.heli.name = this.derived.GetName();
        var stats = this.heli.GetStats();
        var derived = this.heli.GetDerivedStats();

        var str_vital = this.heli.VitalComponentList();
        var remove = false;
        while (str_vital.length > 10) {
            str_vital.pop();
            remove = true;
        }
        if (remove) {
            str_vital.pop();
            str_vital.push("And More. See Plane Builder for full list.");
        }
        while (str_vital.length < 10) {
            str_vital.push("");
        }
        var coverage = this.heli.GetAccessories().GetEffectiveCoverage();
        var armour_str = "";
        for (let r = 0; r < coverage.length; ++r) {
            let AP = r + 1;
            if (coverage[r] > 0) {
                if (armour_str != "")
                    armour_str += ", ";
                else
                    armour_str += lu("Armour") + " ";
                armour_str += AP.toString() + "/+" + (11 - coverage[r]).toString();
            }
        }

        var ordinance = [];
        var bombs = this.heli.GetMunitions().GetBombCount();
        var rockets = this.heli.GetMunitions().GetRocketCount();
        var internal = this.heli.GetMunitions().GetInternalBombCount();
        if (bombs > 0 || rockets > 0) {
            ordinance.push("Current load here.");
        }
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(lu(" Bomb Mass Internally.", int_bomb));
            if (ext_bomb > 0)
                ordinance.push(lu(" Bomb Mass Externally.", ext_bomb));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.heli.GetMunitions().GetMaxBombSize());
                ordinance.push(lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                ordinance.push(lu(" Rocket Mass Internally.", int_rock));
            if (ext_rock > 0)
                ordinance.push(lu(" Rocket Mass Externally.", ext_rock));
        }
        while (ordinance.length < 5) {
            ordinance.push("");
        }

        var warnings = "";
        for (let w of stats.warnings) {
            warnings += w.source + ": " + w.warning + "\n";
        }

        var planeState = {
            "altitude": 0,
            "airspeed": 0,
            "fuel": derived.FuelUses,
            "dropoff": derived.Dropoff,
            "visibility": this.heli.GetCockpits().GetCockpit(0).GetVisibility(),
            "energy_loss": derived.EnergyLoss,
            "turn_bleed": derived.TurnBleed,
            "stability": derived.Stabiilty,
            "stress": this.heli.GetCockpits().GetCockpit(0).GetFlightStress()[0],
            "plane_escape": this.heli.GetCockpits().GetCockpit(0).GetEscape(),
            "crash": this.heli.GetCockpits().GetCockpit(0).GetCrash(),
            "max_toughness": derived.Toughness,
            "current_toughness": derived.Toughness,
            "max_strain": derived.MaxStrain,
            "current_strain": derived.MaxStrain,
            "g_force": 0,
            "kills": 0,
            "full_load_boost": derived.BoostFullwBombs,
            "full_load_handling": derived.HandlingFullwBombs,
            "full_load_climb": derived.RateOfClimbwBombs,
            "full_load_stall": derived.StallSpeedFullwBombs,
            "full_load_speed": derived.MaxSpeedwBombs,
            "half_fuel_bombs_boost": Math.floor((derived.BoostFullwBombs + derived.BoostEmpty) / 2),
            "half_fuel_bombs_handling": Math.floor((derived.HandlingFullwBombs + derived.HandlingEmpty) / 2),
            "half_fuel_bombs_climb": Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2),
            "half_fuel_bombs_stall": Math.floor((derived.StallSpeedFullwBombs + derived.StallSpeedEmpty) / 2),
            "half_fuel_bombs_speed": Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2),
            "full_fuel_no_bombs_boost": derived.BoostFull,
            "full_fuel_no_bombs_handling": derived.HandlingFull,
            "full_fuel_no_bombs_climb": derived.RateOfClimbFull,
            "full_fuel_no_bombs_stall": derived.StallSpeedFull,
            "full_fuel_no_bombs_speed": Math.floor(1.0e-6 + derived.MaxSpeedFull),
            "half_fuel_no_bombs_boost": Math.floor((derived.BoostFull + derived.BoostEmpty) / 2),
            "half_fuel_no_bombs_handling": Math.floor((derived.HandlingFull + derived.HandlingEmpty) / 2),
            "half_fuel_no_bombs_climb": Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2),
            "half_fuel_no_bombs_stall": Math.floor((derived.StallSpeedFull + derived.StallSpeedEmpty) / 2),
            "half_fuel_no_bombs_speed": Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2),
            "empty_boost": 0,
            "empty_handling": derived.HandlingEmpty,
            "empty_climb": 0,
            "empty_stall": derived.StallSpeedEmpty,
            "empty_speed": 0,
            "vital_part_1": str_vital[0],
            "vital_part_2": str_vital[1],
            "vital_part_3": str_vital[2],
            "vital_part_4": str_vital[3],
            "vital_part_5": str_vital[4],
            "vital_part_6": str_vital[5],
            "vital_part_7": str_vital[6],
            "vital_part_8": str_vital[7],
            "vital_part_9": str_vital[8],
            "vital_part_10": str_vital[9],
            "armor": armour_str,
            "max_bomb_load": ordinance[0],
            "ordinance_1": ordinance[1],
            "ordinance_2": ordinance[2],
            "ordinance_3": ordinance[3],
            "ordinance_4": ordinance[4],
            "notes": warnings,
            "full_load_selected": true,
            "half_fuel_bombs_selected": false,
            "full_fuel_no_bombs_selected": false,
            "half_fuel_no_bombs_selected": false,
            "empty_selected": false,
            "engines": this.InteractiveEngines(),
            "weapons": this.InteractiveWeapons(),
        };

        return JSON.stringify(planeState);
    }

    private InteractiveEngines() {
        var engines = [];
        for (let i = 0; i < this.heli.GetEngines().GetNumberOfEngines(); i++) {
            let e = this.heli.GetEngines().GetEngine(i);
            let engine_state = {
                "rpm": 0,
                "wear": 0,
                "reliability": e.GetReliability(),
                "ideal_altitide": StringFmt.Format("{0}-{1}",e.GetMinAltitude(),e.GetMaxAltitude()),
                "overspeed": e.GetOverspeed(),
                "notes": "",
            };
            var estats = e.GetCurrentStats();
            var notes = [];
            if (estats.pulsejet) {
                notes.push(lu("Pulsejet"));
                var inputs = GetEngineLists().get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.power > 0 && inputs.starter) {
                    notes.push(lu("Starter"));
                }
            }
            else {

                if (e.IsRotary() && e.IsTractor()) {
                    notes.push(lu("Turns Right"));
                } else if (e.IsRotary() && e.IsPusher()) {
                    notes.push(lu("Turns Left"));
                }

                var inputs = GetEngineLists().get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.upgrades[1]) {
                    notes.push(lu("War Emergency Power"));
                } else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    notes.push(lu("War Emergency Power from altitudes 0-9"));
                }
            }
            engine_state.notes = StringFmt.Join(", ", notes);
            if (e.GetUsePushPull()) {
                var rely = engine_state.reliability;
                var rely2 = rely.split('/');
                engine_state.reliability = rely2[0].toString();
                engines.push(JSON.stringify(engine_state));
                engine_state.reliability = rely2[0].toString();
                engines.push(JSON.stringify(engine_state));
            } else {
                engines.push(JSON.stringify(engine_state));
            }
        }
        return engines;
    }

    private InteractiveWeapons() {
        var wstates = [];
        for (let w of this.heli.GetWeapons().GetWeaponSets()) {

            var wlist = this.heli.GetWeapons().GetWeaponList();
            var hits = w.GetHits();
            var damage = [];
            if (wlist[w.GetWeaponSelected()].abrv == "PR") {
                damage.push(5);
                damage.push(5);
                damage.push(5);
                damage.push(5);
            } else {
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[0]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[1]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[2]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[3]));
            }

            var fweap = w.GetFinalWeapon();
            var tags = [];
            let weaponState = {
                "type": WeaponName(w, wlist),
                "ammo": w.GetShots(),
                "ap": fweap.ap,
                "jam": w.GetJam(),
                "knife_hits": hits[0],
                "close_hits": hits[1],
                "long_hits": hits[2],
                "extreme_hits": hits[3],
                "knife_damage": damage[0],
                "close_damage": damage[1],
                "long_damage": damage[2],
                "extreme_damage": damage[3],
                "tags": "",
            };

            var dlist = this.heli.GetWeapons().GetDirectionList();

            if (w.IsPlural()) {
                weaponState.type = w.GetWeaponCount().toString() + "x " + weaponState.type;
            }

            var ds = w.GetDirection();
            var dtag = "";
            dtag += "[";
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    dtag += lu(dlist[i]) + " ";
            }
            dtag = dtag.substr(0, dtag.length - 1);
            dtag += "]";

            tags.push(dtag);
            tags.concat(WeaponTags(w));

            weaponState.tags = StringFmt.Join(", ", tags);

            wstates.push(JSON.stringify(weaponState));
        }
        return wstates;
    }

    private SaveNPC() {
        //update all the aircraft data we need.
        this.UpdateCard();

        //pick the lowest overspeed among all engines, treat that as the overspeed for the plane. 
        this.cards.lowest_overspeed = -1;
        for (let i = 0; i < this.heli.GetEngines().GetNumberOfEngines(); i++) {
            var engine = this.heli.GetEngines().GetEngine(i);
            if (engine.GetOverspeed() < this.cards.lowest_overspeed || this.cards.lowest_overspeed < 0) {
                this.cards.lowest_overspeed = engine.GetOverspeed();
            }
        }

        //append weapon data to card so we can use it. 
        this.cards.all_weapons = [];
        var wsetlist = this.heli.GetWeapons().GetWeaponSets();
        for (let i = 0; i < wsetlist.length; i++) {
            this.UpdateWeaponCard(wsetlist[i]);
            this.cards.all_weapons.push(Object.assign({}, this.cards.weap_data));
        }

        this.cards.SaveNPC();
    }

    private InitStats(tbl: HTMLTableElement) {
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Stat Lift Bleed"));
        CreateTH(row, lu("Stat Drag"));
        CreateTH(row, lu("Stat Mass"));
        CreateTH(row, lu("Stat Wet Mass"));
        CreateTH(row, lu("Stat Bomb Mass"));
        CreateTH(row, lu("Stat Cost"));
        CreateTH(row, lu("Stat Upkeep"));
        row = insertRow(fragment);
        this.d_lift = row.insertCell();
        this.d_drag = row.insertCell();
        this.d_mass = row.insertCell();
        this.d_wmas = row.insertCell();
        this.d_bmas = row.insertCell();
        this.d_cost = row.insertCell();
        this.d_upkp = row.insertCell();
        row = insertRow(fragment);
        CreateTH(row, lu("Stat Control"));
        CreateTH(row, lu("Stat Pitch Stability"));
        CreateTH(row, lu("Stat Lateral Stability"));
        CreateTH(row, lu("Stat Wing Area"));
        CreateTH(row, lu("Stat Raw Strain"));
        CreateTH(row, lu("Stat Structure"));
        CreateTH(row, lu("Stat Toughness"));
        row = insertRow(fragment);
        this.d_cont = row.insertCell();
        this.d_pstb = row.insertCell();
        this.d_lstb = row.insertCell();
        this.d_wara = row.insertCell();
        this.d_mstr = row.insertCell();
        this.d_strc = row.insertCell();
        this.d_tugh = row.insertCell();
        row = insertRow(fragment);
        CreateTH(row, lu("Stat Power"));
        CreateTH(row, lu("Stat Fuel Consumption"));
        CreateTH(row, lu("Stat Fuel"));
        CreateTH(row, lu("Stat Pitch Speed"));
        CreateTH(row, lu("Stat Pitch Boost"));
        CreateTH(row, lu("Stat Charge"));
        CreateTH(row, lu("Stat Crash Safety"));
        row = insertRow(fragment);
        this.d_powr = row.insertCell();
        this.d_fcom = row.insertCell();
        this.d_fuel = row.insertCell();
        this.d_pspd = row.insertCell();
        this.d_pbst = row.insertCell();
        this.d_chrg = row.insertCell();
        this.d_crsh = row.insertCell();
        tbl.appendChild(fragment);
    }

    private InitDerived(tbl: HTMLTableElement) {
        this.derived = new Derived_Heli_HTML(tbl);
    }

    private UpdateStats(stats: Stats) {

        var dragbreak = StringFmt.Format("{0} + {1} ({2}/5)", stats.drag, Math.floor(1.0e-6 + stats.mass / 5), (stats.drag + Math.floor(1.0e-6 + stats.mass / 5)) % 5);
        var massbreak = StringFmt.Format("{0} ({1}/5)", stats.mass, stats.mass % 5);

        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_drag, dragbreak);
        BlinkIfChanged(this.d_mass, massbreak);
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString(), false);
        BlinkIfChanged(this.d_bmas, stats.bomb_mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_upkp, stats.upkeep.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_powr, stats.power.toString(), true);
        BlinkIfChanged(this.d_fcom, stats.fuelconsumption.toString(), false);
        BlinkIfChanged(this.d_fuel, stats.fuel.toString(), true);
        BlinkIfChanged(this.d_pspd, (Math.round(stats.pitchspeed * 10) / 10).toString(), true);
        BlinkIfChanged(this.d_pbst, (Math.round(stats.pitchboost * 10) / 10).toString(), true);
        BlinkIfChanged(this.d_wara, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_chrg, stats.charge.toString(), true);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }

    private UpdateDerived(stats: Stats, derived_stats: DerivedStats) {
        if (this.derived.GetName() != lu("Derived Aircraft Name")) {
            this.heli.name = this.derived.GetName();
        }

        this.derived.UpdateDisplay(this.heli, stats, derived_stats);
    }

    public UpdateDisplay() {
        var stats = this.heli.GetStats();
        var derived_stats = this.heli.GetDerivedStats();

        let idx = this.heli.GetAircraftType();
        this.acft_type.selectedIndex = idx;
        this.era.UpdateDisplay();
        this.cockpits.UpdateDisplay();
        this.passengers.UpdateDisplay();
        this.engines.UpdateDisplay();
        this.frames.UpdateDisplay();
        this.stabilizers.UpdateDisplay();
        this.reinforcements.UpdateDisplay();
        this.load.UpdateDisplay();
        this.load.UpdateFuelUses(stats.fuel / stats.fuelconsumption);//Do the calculation here because it's int rounded in derived stats, also no leaky
        this.gear.UpdateDisplay();
        this.accessories.UpdateDisplay();
        this.optimization.UpdateDisplay();
        this.weapons.UpdateDisplay();
        this.used.UpdateDisplay();
        this.rotor.UpdateDisplay();
        this.rotor.UpdateMaxStrain(derived_stats.MaxStrain);
        this.alter.UpdateDisplay();

        this.UpdateStats(stats);
        this.UpdateDerived(stats, derived_stats);
    }
}