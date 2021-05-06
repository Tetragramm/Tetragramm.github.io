/// <reference path="./Display.ts" />
/// <reference path="./Era.ts" />
/// <reference path="./Cockpits.ts" />
/// <reference path="./Passengers.ts" />
/// <reference path="./Engines.ts" />
/// <reference path="./Propeller.ts" />
/// <reference path="./Frames.ts" />
/// <reference path="./Wings.ts" />
/// <reference path="./Stabilizers.ts" />
/// <reference path="./ControlSurfaces.ts" />
/// <reference path="./Reinforcement.ts" />
/// <reference path="./Load.ts" />
/// <reference path="./LandingGear.ts" />
/// <reference path="./Accessories.ts" />
/// <reference path="./Optimization.ts" />
/// <reference path="./Weapons.ts" />
/// <reference path="./Derived.ts" />
/// <reference path="../impl/Aircraft.ts" />
/// <reference path="./Cards.ts"/>

class Aircraft_HTML extends Display {
    private acft: Aircraft;
    private era: Era_HTML;
    private cockpits: Cockpits_HTML;
    private passengers: Passengers_HTML;
    private engines: Engines_HTML;
    private propeller: Propeller_HTML;
    private frames: Frames_HTML;
    private wings: Wings_HTML;
    private stabilizers: Stabilizers_HTML;
    private controlsurfaces: ControlSurfaces_HTML;
    private reinforcements: Reinforcement_HTML;
    private load: Load_HTML;
    private gear: LandingGear_HTML;
    private accessories: Accessories_HTML;
    private optimization: Optimization_HTML;
    private weapons: Weapons_HTML;
    private used: Used_HTML;
    private rotor: Rotor_HTML;
    private derived: Derived_HTML;

    private acft_type: HTMLSelectElement;

    //Alter Stats
    private a_lift: HTMLInputElement;
    private a_drag: HTMLInputElement;
    private a_mass: HTMLInputElement;
    private a_wmas: HTMLInputElement;
    private a_bmas: HTMLInputElement;
    private a_cost: HTMLInputElement;
    private a_upkp: HTMLInputElement;
    private a_cont: HTMLInputElement;
    private a_pstb: HTMLInputElement;
    private a_lstb: HTMLInputElement;
    private a_powr: HTMLInputElement;
    private a_fcom: HTMLInputElement;
    private a_fuel: HTMLInputElement;
    private a_pspd: HTMLInputElement;
    private a_pbst: HTMLInputElement;
    private a_wara: HTMLInputElement;
    private a_mstr: HTMLInputElement;
    private a_strc: HTMLInputElement;
    private a_tugh: HTMLInputElement;
    private a_chrg: HTMLInputElement;
    private a_crsh: HTMLInputElement;

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


    constructor(js: JSON, aircraft: Aircraft) {
        super();

        this.acft = aircraft;
        this.era = new Era_HTML(this.acft.GetEra());
        this.cockpits = new Cockpits_HTML(aircraft.GetCockpits());
        this.passengers = new Passengers_HTML(aircraft.GetPassengers());
        this.engines = new Engines_HTML(aircraft.GetEngines());
        this.propeller = new Propeller_HTML(aircraft.GetPropeller());
        this.frames = new Frames_HTML(aircraft.GetFrames());
        this.wings = new Wings_HTML(aircraft.GetWings());
        this.stabilizers = new Stabilizers_HTML(aircraft.GetStabilizers());
        this.controlsurfaces = new ControlSurfaces_HTML(aircraft.GetControlSurfaces());
        this.reinforcements = new Reinforcement_HTML(aircraft, aircraft.GetReinforcements());
        this.load = new Load_HTML(aircraft.GetFuel(), aircraft.GetMunitions(), aircraft.GetCargoAndPassengers());
        this.gear = new LandingGear_HTML(aircraft.GetLandingGear());
        this.accessories = new Accessories_HTML(aircraft.GetAccessories());
        this.optimization = new Optimization_HTML(aircraft.GetOptimization());
        this.weapons = new Weapons_HTML(aircraft.GetWeapons());
        this.used = new Used_HTML(aircraft.GetUsed());
        this.rotor = new Rotor_HTML(aircraft.GetRotor());

        var tbla = document.getElementById("tbl_alter") as HTMLTableElement;
        this.InitAlter(tbla);

        (document.getElementById("lbl_acft_type") as HTMLLabelElement).textContent = lu("Aircraft Type Section Title");
        this.acft_type = document.getElementById("acft_type") as HTMLSelectElement;
        for (let type in AIRCRAFT_TYPE) {
            if (isNaN(Number(type))) {
                let opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.text = lu(type);
                this.acft_type.add(opt);
            }
        }
        this.acft_type.onchange = () => { this.acft.SetType(this.acft_type.selectedIndex); };

        (document.getElementById("lbl_stats") as HTMLLabelElement).textContent = lu("Aircraft Stats Section Title");
        var tbl = document.getElementById("tbl_stats") as HTMLTableElement;
        this.InitStats(tbl);

        (document.getElementById("lbl_derived") as HTMLLabelElement).textContent = lu("Aircraft Derived Section Title");
        var tbl2 = document.getElementById("tbl_derived") as HTMLTableElement;
        this.InitDerived(tbl2);

        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });

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
        reset_button.onclick = () => { this.acft.Reset(); this.derived.SetName(this.acft.name); this.acft.CalculateStats(); };

        (document.getElementById("lbl_acft_save_cat_top") as HTMLLabelElement).textContent = lu("Aircraft Button Save Catalog");
        (document.getElementById("lbl_acft_save_cat_bot") as HTMLLabelElement).textContent = lu("Aircraft Button Save Catalog");
        var cat_button = document.getElementById("acft_save_cat");
        cat_button.onclick = () => { this.CatalogStats(); }
    }

    private UpdateCard() {
        this.acft.name = this.derived.GetName();
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        this.cards.name = this.acft.name;
        this.cards.acft_data.armour = this.acft.GetAccessories().GetEffectiveCoverage();
        this.cards.acft_data.crash = stats.crashsafety;
        this.cards.acft_data.dropoff = derived.Dropoff;
        this.cards.acft_data.empty_boost = derived.BoostEmpty;
        this.cards.acft_data.empty_hand = derived.HandlingEmpty;
        this.cards.acft_data.empty_climb = derived.RateOfClimbEmpty;
        this.cards.acft_data.empty_stall = derived.StallSpeedEmpty;
        this.cards.acft_data.empty_speed = Math.floor(1.0e-6 + derived.MaxSpeedEmpty);
        this.cards.acft_data.energy_loss = derived.EnergyLoss;
        this.cards.acft_data.escape = this.acft.GetCockpits().GetEscapeList()[0];
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
        var bombs = this.acft.GetMunitions().GetBombCount();
        var rockets = this.acft.GetMunitions().GetRocketCount();
        var internal = this.acft.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(lu(" Bomb Mass Internally.", int_bomb));
            if (ext_bomb > 0)
                ordinance.push(lu(" Bomb Mass Externally.", ext_bomb));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.acft.GetMunitions().GetMaxBombSize());
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
        this.cards.acft_data.stress = this.acft.GetCockpits().GetStressList()[0][0];
        this.cards.acft_data.toughness = derived.Toughness;
        this.cards.acft_data.turn_bleed = derived.TurnBleed;
        this.cards.acft_data.visibility = this.acft.GetCockpits().GetVisibilityList()[0];
        this.cards.acft_data.vital_parts = this.acft.VitalComponentList();
        this.cards.acft_data.warnings = stats.warnings;
    }

    private UpdateWeaponCard(w: WeaponSystem) {
        var dlist = this.acft.GetWeapons().GetDirectionList();

        var name = this.WeaponName(w);
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
        this.cards.weap_data.damage = fweap.damage;
        this.cards.weap_data.hits = w.GetHits();
        this.cards.weap_data.jam = w.GetJam();
        this.cards.weap_data.tags = [dtag];
        this.cards.weap_data.type = name;
        this.cards.weap_data.abrv = fweap.abrv;
        this.cards.weap_data.reload = fweap.reload;

        if (fweap.rapid) {
            this.cards.weap_data.tags.push(lu("Weapon Tag Rapid Fire"));
        }
        if (fweap.shells) {
            this.cards.weap_data.tags.push(lu("Weapon Tag Shells"));
        }
        if (fweap.deflection) {
            this.cards.weap_data.tags.push(lu("Weapon Tag Awkward", fweap.deflection));
        }
        var deflector = false;
        for (let iw of w.GetWeapons()) {
            if (iw.GetSynchronization() == SynchronizationType.DEFLECT)
                deflector = true;
        }
        if (deflector) {
            this.cards.weap_data.tags.push(lu("Weapon Tag: Deflector Plate"));
        }
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
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
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
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);

                this.cards.eng_data.min_IAF = inputs.min_IAF;
                if (inputs.upgrades[1]) {
                    this.cards.eng_data.notes.push(lu("War Emergency Power"));
                } else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    this.cards.eng_data.notes.push(lu("War Emergency Power from altitudes 0-10"));
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
                var acft = new Aircraft(parts_JSON, weapon_JSON, false);
                if (acft.fromJSON(str)) {
                    str = JSON.parse(reader.result as string);
                    console.log(str);
                    this.acft.fromJSON(str);
                    this.derived.SetName(this.acft.name);
                    this.acft.CalculateStats();
                }

            } catch (e) {
                console.error(e, e.stack);
            }
        };
        reader.readAsText(file);
        load_button.value = "";
    }

    private CatalogStats() {
        this.acft.name = this.derived.GetName();
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        var catalog_stats = "";
        catalog_stats += this.acft.name + "\n";
        catalog_stats += StringFmt.Format("{0}þ New, {1}þ Used\n", stats.cost, Math.floor(1.0e-6 + stats.cost / 2));
        catalog_stats += StringFmt.Format("{0}þ Upkeep\n\n", stats.upkeep);
        if (stats.bomb_mass > 0) {
            catalog_stats += StringFmt.Format("Full Load\t{0}\t{1}\t{2}\t{3}\t{4}\n",
                derived.BoostFullwBombs,
                derived.HandlingFullwBombs,
                derived.RateOfClimbwBombs,
                derived.StallSpeedFullwBombs,
                derived.MaxSpeedwBombs);
            catalog_stats += StringFmt.Format("½, Bombs\t{0}\t{1}\t{2}\t{3}\t{4}\n",
                Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2),
                Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2),
                Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2),
                Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2),
                Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2));
        }
        catalog_stats += StringFmt.Format("Full Fuel\t{0}\t{1}\t{2}\t{3}\t{4}\n",
            derived.BoostFull,
            derived.HandlingFull,
            derived.RateOfClimbFull,
            derived.StallSpeedFull,
            derived.MaxSpeedFull);
        catalog_stats += StringFmt.Format("Half Fuel\t{0}\t{1}\t{2}\t{3}\t{4}\n",
            Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2),
            Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2),
            Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2),
            Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2),
            Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2));
        catalog_stats += StringFmt.Format("Empty\t\t{0}\t{1}\t{2}\t{3}\t{4}\n",
            "-",
            derived.HandlingEmpty,
            "-",
            derived.StallSpeedEmpty,
            derived.MaxSpeedEmpty);
        catalog_stats += "\nVital Parts\n";
        catalog_stats += StringFmt.Join(", ", this.acft.VitalComponentList());
        catalog_stats += "\n\n";
        catalog_stats += StringFmt.Format("Dropoff {0}, Reliability {1}, Overspeed {2}, Ideal Alt. {3}, Fuel {4}\n\n",
            derived.Dropoff,
            StringFmt.Join("/", this.acft.GetReliabilityList()),
            derived.Overspeed,
            this.acft.GetMinIAF().toString() + "-" + this.acft.GetMaxAltitude().toString(),
            derived.FuelUses);
        if (derived.TurnBleed == derived.TurnBleedwBombs) {
            catalog_stats += StringFmt.Format("Visibility {0}, Stability {1}, Energy Loss {2}, Turn Bleed {3}\n\n",
                StringFmt.Join("/", this.acft.GetVisibilityList()),
                derived.Stabiilty,
                derived.EnergyLoss,
                derived.TurnBleed);
        } else {
            catalog_stats += StringFmt.Format("Visibility {0}, Stability {1}, Energy Loss {2}, Turn Bleed {3} ({4})\n\n",
                StringFmt.Join("/", this.acft.GetVisibilityList()),
                derived.Stabiilty,
                derived.EnergyLoss,
                derived.TurnBleed,
                derived.TurnBleedwBombs);
        }
        catalog_stats += StringFmt.Format("Toughness {0}, Max Strain {1}, Escape {2}, Crash Safety {3}, Flight Stress {4}\n\n",
            derived.Toughness,
            derived.MaxStrain,
            StringFmt.Join("/", this.acft.GetEscapeList()),
            StringFmt.Join("/", this.acft.GetCrashList()),
            StringFmt.Join("/", this.acft.GetStressList()));

        var wlist = this.acft.GetWeapons().GetWeaponList();
        var dlist = this.acft.GetWeapons().GetDirectionList();
        var bombs = this.acft.GetMunitions().GetBombCount();
        var rockets = this.acft.GetMunitions().GetRocketCount();
        var internal = this.acft.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                catalog_stats += (int_bomb.toString() + lu(" Bomb Mass Internally."));
            if (ext_bomb > 0)
                catalog_stats += (ext_bomb.toString() + lu(" Bomb Mass Externally."));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, this.acft.GetMunitions().GetMaxBombSize());
                catalog_stats += (lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            catalog_stats += "\n";
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                catalog_stats += (int_rock.toString() + lu(" Rocket Mass Internally."));
            if (ext_rock > 0)
                catalog_stats += (ext_rock.toString() + lu(" Rocket Mass Externally."));
            catalog_stats += "\n";
        }

        var wsets = this.acft.GetWeapons().GetWeaponSets();
        for (let wi = 0; wi < wsets.length; wi++) {
            var w = wsets[wi];
            var ds = w.GetDirection();
            var dirs = [];
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    dirs.push(lu(dlist[i]));
            }

            var acces = "";
            if (w.GetWeapons()[0].GetAccessible()) {
                acces = "Accessible";
            }
            catalog_stats += StringFmt.Format("#{0}: {1}x {2} {4} [{3}]\n",
                wi + 1,
                w.GetWeaponCount(),
                this.WeaponName(w),
                StringFmt.Join("/", dirs),
                acces);
        }
        for (let w of stats.warnings) {
            catalog_stats += w.source + ":  " + w.warning + "\n";
        }
        download(catalog_stats, this.acft.name + "_" + this.acft.GetVersion() + ".txt", "txt");
    }

    private LoadText(text_area: HTMLInputElement) {
        try {
            var str = JSON.parse(text_area.value);
            var acft = new Aircraft(parts_JSON, weapon_JSON, false);
            if (acft.fromJSON(str)) {
                this.acft.fromJSON(str);
                this.derived.SetName(this.acft.name);
                this.acft.CalculateStats();
            }
        } catch {
            BlinkBad(text_area.parentElement);
        } finally {
            text_area.value = "";
        }
    }

    private SaveJSON() {
        this.acft.name = this.derived.GetName();
        download(JSON.stringify(this.acft.toJSON()), this.acft.name + "_" + this.acft.GetVersion() + ".json", "json");
    }

    private SaveLink() {
        this.acft.name = this.derived.GetName();
        var ser = new Serialize();
        this.acft.serialize(ser);
        var arr = ser.FinalArray();
        var str2 = _arrayBufferToString(arr);
        var txt2 = LZString.compressToEncodedURIComponent(str2);
        var link = (location.protocol + "//" + location.host + location.pathname + "?json=" + txt2);
        copyStringToClipboard(link);
    }

    private SaveDash() {
        this.UpdateCard();
        this.cards.SaveDash();
        var wsetlist = this.acft.GetWeapons().GetWeaponSets();
        for (let i = 0; i < wsetlist.length; i++) {
            this.UpdateWeaponCard(wsetlist[i]);
            this.cards.SaveWeapon(i)
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            this.UpdateEngineCard(this.acft.GetEngines().GetEngine(i));
            this.cards.SaveEngine(i);
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfRadiators(); i++) {
            this.UpdateRadiatorCard(this.acft.GetEngines().GetRadiator(i));
            this.cards.SaveRadiator(i);
        }
    }

    private SaveInteractive() {
        var link = ("https://dpierkowski.github.io/flying-circus/index.html?json=" + btoa(this.InteractiveDash()));
        window.open(link, "_blank");
    }

    private InteractiveDash() {
        this.acft.name = this.derived.GetName();
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();

        var str_vital = this.acft.VitalComponentList();
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
        var coverage = this.acft.GetAccessories().GetEffectiveCoverage();
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
        var bombs = this.acft.GetMunitions().GetBombCount();
        var rockets = this.acft.GetMunitions().GetRocketCount();
        var internal = this.acft.GetMunitions().GetInternalBombCount();
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
                var mib = Math.min(int_bomb, this.acft.GetMunitions().GetMaxBombSize());
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
            "visibility": this.acft.GetCockpits().GetCockpit(0).GetVisibility(),
            "energy_loss": derived.EnergyLoss,
            "turn_bleed": derived.TurnBleed,
            "stability": derived.Stabiilty,
            "stress": this.acft.GetCockpits().GetCockpit(0).GetFlightStress()[0],
            "plane_escape": this.acft.GetCockpits().GetCockpit(0).GetEscape(),
            "crash": this.acft.GetCockpits().GetCockpit(0).GetCrash(),
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
            "empty_boost": derived.BoostEmpty,
            "empty_handling": derived.HandlingEmpty,
            "empty_climb": derived.RateOfClimbEmpty,
            "empty_stall": derived.StallSpeedEmpty,
            "empty_speed": Math.floor(1.0e-6 + derived.MaxSpeedEmpty),
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
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            let e = this.acft.GetEngines().GetEngine(i);
            let engine_state = {
                "rpm": 0,
                "wear": 0,
                "reliability": e.GetReliability(),
                "ideal_altitide": e.GetMaxAltitude(),
                "overspeed": e.GetOverspeed(),
                "notes": "",
            };
            var estats = e.GetCurrentStats();
            var notes = [];
            if (estats.pulsejet) {
                notes.push(lu("Pulsejet"));
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
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

                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.upgrades[1]) {
                    notes.push(lu("War Emergency Power"));
                } else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    notes.push(lu("War Emergency Power from altitudes 0-10"));
                }
            }
            engine_state.notes = StringFmt.Join(", ", notes);
            engines.push(JSON.stringify(engine_state));
        }
        return engines;
    }

    private InteractiveWeapons() {
        var wstates = [];
        for (let w of this.acft.GetWeapons().GetWeaponSets()) {

            var fweap = w.GetFinalWeapon();
            var tags = [];
            let weaponState = {
                "type": this.WeaponName(w),
                "ammo": w.GetShots(),
                "ap": fweap.ap,
                "jam": w.GetJam(),
                "knife_hits": w.GetHits()[0],
                "close_hits": w.GetHits()[1],
                "long_hits": w.GetHits()[2],
                "extreme_hits": w.GetHits()[3],
                "knife_damage": Math.floor(1.0e-6 + w.GetHits()[0] * fweap.damage),
                "close_damage": Math.floor(1.0e-6 + w.GetHits()[1] * fweap.damage),
                "long_damage": Math.floor(1.0e-6 + w.GetHits()[2] * fweap.damage),
                "extreme_damage": Math.floor(1.0e-6 + w.GetHits()[3] * fweap.damage),
                "tags": "",
            };

            var dlist = this.acft.GetWeapons().GetDirectionList();

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

            if (fweap.rapid) {
                tags.push(lu("Weapon Tag Rapid Fire"));
            }
            if (fweap.shells) {
                tags.push(lu("Weapon Tag Shells"));
            }
            if (fweap.deflection) {
                tags.push(lu("Weapon Tag Awkward", fweap.deflection));
            }
            var deflector = false;
            for (let iw of w.GetWeapons()) {
                if (iw.GetSynchronization() == SynchronizationType.DEFLECT)
                    deflector = true;
            }
            if (deflector) {
                tags.push(lu("Weapon Tag: Deflector Plate"));
            }
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
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            var engine = this.acft.GetEngines().GetEngine(i);
            if (engine.GetOverspeed() < this.cards.lowest_overspeed || this.cards.lowest_overspeed < 0) {
                this.cards.lowest_overspeed = engine.GetOverspeed();
            }
        }

        //append weapon data to card so we can use it. 
        this.cards.all_weapons = [];
        var wsetlist = this.acft.GetWeapons().GetWeaponSets();
        for (let i = 0; i < wsetlist.length; i++) {
            this.UpdateWeaponCard(wsetlist[i]);
            this.cards.all_weapons.push(Object.assign({}, this.cards.weap_data));
        }

        this.cards.SaveNPC();
    }

    private WeaponName(w: WeaponSystem): string {
        var wlist = this.acft.GetWeapons().GetWeaponList();
        var ds = w.GetDirection();
        var dircount = 0;
        for (let d of ds) {
            if (d)
                dircount++;
        }
        var name = "";
        if (dircount == 1 && w.GetFixed())
            name += lu("Fixed") + " ";
        else if (dircount <= 2)
            name += lu("Flexible") + " ";
        else
            name += lu("Turreted") + " ";

        if (w.GetAction() == ActionType.MECHANICAL) {
            name += lu("Weapon Tag Mechanical Action") + " ";
        } else if (w.GetAction() == ActionType.GAST) {
            name += lu("Weapon Tag Gast Principle") + " ";
        } else if (w.GetAction() == ActionType.ROTARY) {
            name += lu("Weapon Tag Rotary") + " ";
        }

        if (w.GetProjectile() == ProjectileType.HEATRAY) {
            name += lu("Weapon Tag Heat Ray") + " ";
        } else if (w.GetProjectile() == ProjectileType.GYROJETS) {
            name += lu("Weapon Tag Gyrojet") + " ";
        } else if (w.GetProjectile() == ProjectileType.PNEUMATIC) {
            name += lu("Weapon Tag Pneumatic") + " ";
        }

        name += wlist[w.GetWeaponSelected()].abrv;
        return name;
    }

    private InitAlter(tbl: HTMLTableElement) {
        var row = tbl.insertRow();
        CreateTH(row, "Lift Bleed");
        CreateTH(row, "Drag");
        CreateTH(row, "Mass");
        CreateTH(row, "Wet Mass");
        CreateTH(row, "Bomb Mass");
        CreateTH(row, "Cost");
        CreateTH(row, "Upkeep");
        row = tbl.insertRow();
        this.a_lift = document.createElement("INPUT") as HTMLInputElement;
        this.a_drag = document.createElement("INPUT") as HTMLInputElement;
        this.a_mass = document.createElement("INPUT") as HTMLInputElement;
        this.a_wmas = document.createElement("INPUT") as HTMLInputElement;
        this.a_bmas = document.createElement("INPUT") as HTMLInputElement;
        this.a_cost = document.createElement("INPUT") as HTMLInputElement;
        this.a_upkp = document.createElement("INPUT") as HTMLInputElement;
        row.insertCell().appendChild(this.a_lift);
        row.insertCell().appendChild(this.a_drag);
        row.insertCell().appendChild(this.a_mass);
        row.insertCell().appendChild(this.a_wmas);
        row.insertCell().appendChild(this.a_bmas);
        row.insertCell().appendChild(this.a_cost);
        row.insertCell().appendChild(this.a_upkp);
        this.a_lift.setAttribute("type", "number");
        this.a_drag.setAttribute("type", "number");
        this.a_mass.setAttribute("type", "number");
        this.a_wmas.setAttribute("type", "number");
        this.a_bmas.setAttribute("type", "number");
        this.a_cost.setAttribute("type", "number");
        this.a_upkp.setAttribute("type", "number");
        this.a_lift.valueAsNumber = 0;
        this.a_drag.valueAsNumber = 0;
        this.a_mass.valueAsNumber = 0;
        this.a_wmas.valueAsNumber = 0;
        this.a_bmas.valueAsNumber = 0;
        this.a_cost.valueAsNumber = 0;
        this.a_upkp.valueAsNumber = 0;
        this.a_lift.onchange = () => { this.acft.GetAlter().stats.liftbleed = this.a_lift.valueAsNumber; this.acft.CalculateStats(); };
        this.a_drag.onchange = () => { this.acft.GetAlter().stats.drag = this.a_drag.valueAsNumber; this.acft.CalculateStats(); };
        this.a_mass.onchange = () => { this.acft.GetAlter().stats.mass = this.a_mass.valueAsNumber; this.acft.CalculateStats(); };
        this.a_wmas.onchange = () => { this.acft.GetAlter().stats.wetmass = this.a_wmas.valueAsNumber; this.acft.CalculateStats(); };
        this.a_bmas.onchange = () => { this.acft.GetAlter().stats.bomb_mass = this.a_bmas.valueAsNumber; this.acft.CalculateStats(); };
        this.a_cost.onchange = () => { this.acft.GetAlter().stats.cost = this.a_cost.valueAsNumber; this.acft.CalculateStats(); };
        this.a_upkp.onchange = () => { this.acft.GetAlter().stats.upkeep = this.a_upkp.valueAsNumber; this.acft.CalculateStats(); };
        row = tbl.insertRow();
        CreateTH(row, "Control");
        CreateTH(row, "Pitch Stability");
        CreateTH(row, "Lateral Stability");
        CreateTH(row, "Wing Area");
        CreateTH(row, "Raw Strain");
        CreateTH(row, "Structure");
        CreateTH(row, "Toughness");
        row = tbl.insertRow();
        this.a_cont = document.createElement("INPUT") as HTMLInputElement;
        this.a_pstb = document.createElement("INPUT") as HTMLInputElement;
        this.a_lstb = document.createElement("INPUT") as HTMLInputElement;
        this.a_wara = document.createElement("INPUT") as HTMLInputElement;
        this.a_mstr = document.createElement("INPUT") as HTMLInputElement;
        this.a_strc = document.createElement("INPUT") as HTMLInputElement;
        this.a_tugh = document.createElement("INPUT") as HTMLInputElement;
        row.insertCell().appendChild(this.a_cont);
        row.insertCell().appendChild(this.a_pstb);
        row.insertCell().appendChild(this.a_lstb);
        row.insertCell().appendChild(this.a_wara);
        row.insertCell().appendChild(this.a_mstr);
        row.insertCell().appendChild(this.a_strc);
        row.insertCell().appendChild(this.a_tugh);
        this.a_cont.setAttribute("type", "number");
        this.a_pstb.setAttribute("type", "number");
        this.a_lstb.setAttribute("type", "number");
        this.a_wara.setAttribute("type", "number");
        this.a_mstr.setAttribute("type", "number");
        this.a_strc.setAttribute("type", "number");
        this.a_tugh.setAttribute("type", "number");
        this.a_cont.valueAsNumber = 0;
        this.a_pstb.valueAsNumber = 0;
        this.a_lstb.valueAsNumber = 0;
        this.a_wara.valueAsNumber = 0;
        this.a_mstr.valueAsNumber = 0;
        this.a_strc.valueAsNumber = 0;
        this.a_tugh.valueAsNumber = 0;
        this.a_cont.onchange = () => { this.acft.GetAlter().stats.control = this.a_cont.valueAsNumber; this.acft.CalculateStats(); };
        this.a_pstb.onchange = () => { this.acft.GetAlter().stats.pitchstab = this.a_pstb.valueAsNumber; this.acft.CalculateStats(); };
        this.a_lstb.onchange = () => { this.acft.GetAlter().stats.latstab = this.a_lstb.valueAsNumber; this.acft.CalculateStats(); };
        this.a_wara.onchange = () => { this.acft.GetAlter().stats.wingarea = this.a_wara.valueAsNumber; this.acft.CalculateStats(); };
        this.a_mstr.onchange = () => { this.acft.GetAlter().stats.maxstrain = this.a_mstr.valueAsNumber; this.acft.CalculateStats(); };
        this.a_strc.onchange = () => { this.acft.GetAlter().stats.structure = this.a_strc.valueAsNumber; this.acft.CalculateStats(); };
        this.a_tugh.onchange = () => { this.acft.GetAlter().stats.toughness = this.a_tugh.valueAsNumber; this.acft.CalculateStats(); };
        row = tbl.insertRow();
        CreateTH(row, "Power");
        CreateTH(row, "Fuel Consumption");
        CreateTH(row, "Fuel");
        CreateTH(row, "Pitch Speed");
        CreateTH(row, "Pitch Boost");
        CreateTH(row, "Charge");
        CreateTH(row, "Crash Safety");
        row = tbl.insertRow();
        this.a_powr = document.createElement("INPUT") as HTMLInputElement;
        this.a_fcom = document.createElement("INPUT") as HTMLInputElement;
        this.a_fuel = document.createElement("INPUT") as HTMLInputElement;
        this.a_pspd = document.createElement("INPUT") as HTMLInputElement;
        this.a_pbst = document.createElement("INPUT") as HTMLInputElement;
        this.a_chrg = document.createElement("INPUT") as HTMLInputElement;
        this.a_crsh = document.createElement("INPUT") as HTMLInputElement;
        row.insertCell().appendChild(this.a_powr);
        row.insertCell().appendChild(this.a_fcom);
        row.insertCell().appendChild(this.a_fuel);
        row.insertCell().appendChild(this.a_pspd);
        row.insertCell().appendChild(this.a_pbst);
        row.insertCell().appendChild(this.a_chrg);
        row.insertCell().appendChild(this.a_crsh);
        this.a_powr.setAttribute("type", "number");
        this.a_fcom.setAttribute("type", "number");
        this.a_fuel.setAttribute("type", "number");
        this.a_pspd.setAttribute("type", "number");
        this.a_pbst.setAttribute("type", "number");
        this.a_chrg.setAttribute("type", "number");
        this.a_crsh.setAttribute("type", "number");
        this.a_powr.valueAsNumber = 0;
        this.a_fcom.valueAsNumber = 0;
        this.a_fuel.valueAsNumber = 0;
        this.a_pspd.valueAsNumber = 0;
        this.a_pbst.valueAsNumber = 0;
        this.a_chrg.valueAsNumber = 0;
        this.a_crsh.valueAsNumber = 0;
        this.a_powr.onchange = () => { this.acft.GetAlter().stats.power = this.a_powr.valueAsNumber; this.acft.CalculateStats(); };
        this.a_fcom.onchange = () => { this.acft.GetAlter().stats.fuelconsumption = this.a_fcom.valueAsNumber; this.acft.CalculateStats(); };
        this.a_fuel.onchange = () => { this.acft.GetAlter().stats.fuel = this.a_fuel.valueAsNumber; this.acft.CalculateStats(); };
        this.a_pspd.onchange = () => { this.acft.GetAlter().stats.pitchspeed = this.a_pspd.valueAsNumber; this.acft.CalculateStats(); };
        this.a_pbst.onchange = () => { this.acft.GetAlter().stats.pitchboost = this.a_pbst.valueAsNumber; this.acft.CalculateStats(); };
        this.a_chrg.onchange = () => { this.acft.GetAlter().stats.charge = this.a_chrg.valueAsNumber; this.acft.CalculateStats(); };
        this.a_crsh.onchange = () => { this.acft.GetAlter().stats.crashsafety = this.a_crsh.valueAsNumber; this.acft.CalculateStats(); };
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
        this.derived = new Derived_HTML(tbl);
    }

    private UpdateStats(stats: Stats) {

        var dragbreak = stats.drag.toString() + " ("
            + ((stats.drag + Math.floor(1.0e-6 + stats.mass / 5)) % 5)
            + "/5)";
        var massbreak = stats.mass.toString() + " ("
            + (stats.mass % 5).toString()
            + "/5)";

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
            this.acft.name = this.derived.GetName();
        }

        this.derived.UpdateDisplay(this.acft, stats, derived_stats);
    }

    public UpdateDisplay() {
        var stats = this.acft.GetStats();
        var derived_stats = this.acft.GetDerivedStats();

        this.acft_type.selectedIndex = this.acft.GetAircraftType();
        this.era.UpdateDisplay();
        this.cockpits.UpdateDisplay();
        this.passengers.UpdateDisplay();
        this.engines.UpdateDisplay();
        this.propeller.UpdateDisplay();
        this.frames.UpdateDisplay();
        this.wings.UpdateDisplay();
        this.stabilizers.UpdateDisplay();
        this.controlsurfaces.UpdateDisplay();
        this.reinforcements.UpdateDisplay();
        this.reinforcements.UpdateMaxStrain(derived_stats.MaxStrain);
        this.load.UpdateDisplay();
        this.load.UpdateFuelUses(stats.fuel / stats.fuelconsumption);//Do the calculation here because it's int rounded in derived stats, also no leaky
        this.gear.UpdateDisplay();
        this.accessories.UpdateDisplay();
        this.optimization.UpdateDisplay();
        this.weapons.UpdateDisplay();
        this.used.UpdateDisplay();
        this.rotor.UpdateDisplay();

        this.UpdateStats(stats);
        this.UpdateDerived(stats, derived_stats);
    }
}