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

    //Alter Stats
    // private a_lift: HTMLInputElement;
    // private a_drag: HTMLInputElement;
    // private a_mass: HTMLInputElement;
    // private a_wmas: HTMLInputElement;
    // private a_bmas: HTMLInputElement;
    // private a_cost: HTMLInputElement;
    // private a_upkp: HTMLInputElement;
    // private a_cont: HTMLInputElement;
    // private a_pstb: HTMLInputElement;
    // private a_lstb: HTMLInputElement;
    // private a_powr: HTMLInputElement;
    // private a_fcom: HTMLInputElement;
    // private a_fuel: HTMLInputElement;
    // private a_pspd: HTMLInputElement;
    // private a_pbst: HTMLInputElement;
    // private a_wara: HTMLInputElement;
    // private a_mstr: HTMLInputElement;
    // private a_strc: HTMLInputElement;
    // private a_tugh: HTMLInputElement;
    // private a_chrg: HTMLInputElement;
    // private a_crsh: HTMLInputElement;

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

    //Final Display
    private name_inp: HTMLInputElement;
    private cost_cell: HTMLTableCellElement;
    private upkeep_cell: HTMLTableCellElement;
    private version_cell: HTMLTableCellElement;
    private full_row: HTMLTableRowElement;
    private bomb_row1: HTMLTableRowElement;
    private bomb_row2: HTMLTableRowElement;
    private ts_empty: HTMLTableCellElement;
    private ss_empty: HTMLTableCellElement;
    private hand_empty: HTMLTableCellElement;
    private boost_empty: HTMLTableCellElement;
    private roc_empty: HTMLTableCellElement;
    private ts_half: HTMLTableCellElement;
    private ss_half: HTMLTableCellElement;
    private hand_half: HTMLTableCellElement;
    private boost_half: HTMLTableCellElement;
    private roc_half: HTMLTableCellElement;
    private ts_full: HTMLTableCellElement;
    private ss_full: HTMLTableCellElement;
    private hand_full: HTMLTableCellElement;
    private boost_full: HTMLTableCellElement;
    private roc_full: HTMLTableCellElement;
    private ts_halfwB: HTMLTableCellElement;
    private ss_halfwB: HTMLTableCellElement;
    private hand_halfwB: HTMLTableCellElement;
    private boost_halfwB: HTMLTableCellElement;
    private roc_halfwB: HTMLTableCellElement;
    private ts_fullwB: HTMLTableCellElement;
    private ss_fullwB: HTMLTableCellElement;
    private hand_fullwB: HTMLTableCellElement;
    private boost_fullwB: HTMLTableCellElement;
    private roc_fullwB: HTMLTableCellElement;
    private vital_components: HTMLTableCellElement;
    private dropoff_cell: HTMLTableCellElement;
    private stability_cell: HTMLTableCellElement;
    private reliability_cell: HTMLTableCellElement;
    private flightstress_cell: HTMLTableCellElement;
    private overspeed_cell: HTMLTableCellElement;
    private eloss_cell: HTMLTableCellElement;
    private toughness_cell: HTMLTableCellElement;
    private visibility_cell: HTMLTableCellElement;
    private electric_cell: HTMLTableCellElement;
    private turnbleed_cell: HTMLTableCellElement;
    private mxstrain_cell: HTMLTableCellElement;
    private attack_cell: HTMLTableCellElement;
    private maxfuel_cell: HTMLTableCellElement;
    private landing_cell: HTMLTableCellElement;
    private escape_cell: HTMLTableCellElement;
    private communications_cell: HTMLTableCellElement;
    private crew_cell: HTMLTableCellElement;
    private maxalt_cell: HTMLTableCellElement;
    private crashsafety_cell: HTMLTableCellElement;
    private flammable_cell: HTMLTableCellElement;
    private weapon_head: HTMLTableHeaderCellElement;
    private weapon_cell: HTMLTableCellElement;
    private warning_head: HTMLTableHeaderCellElement;
    private warning_cell: HTMLTableCellElement;

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
        this.reinforcements = new Reinforcement_HTML(aircraft.GetReinforcements());
        this.load = new Load_HTML(aircraft.GetFuel(), aircraft.GetMunitions(), aircraft.GetCargoAndPassengers());
        this.gear = new LandingGear_HTML(aircraft.GetLandingGear());
        this.accessories = new Accessories_HTML(aircraft.GetAccessories());
        this.optimization = new Optimization_HTML(aircraft.GetOptimization());
        this.weapons = new Weapons_HTML(aircraft.GetWeapons());
        this.used = new Used_HTML(aircraft.GetUsed());

        // var tbla = document.getElementById("tbl_alter") as HTMLTableElement;
        // this.InitAlter(tbla);

        var tbl = document.getElementById("tbl_stats") as HTMLTableElement;
        this.InitStats(tbl);

        var tbl2 = document.getElementById("tbl_derived") as HTMLTableElement;
        this.InitDerived(tbl2);

        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });

        var save_button = document.getElementById("acft_save") as HTMLButtonElement;
        save_button.onclick = () => {
            download(JSON.stringify(this.acft.toJSON()), this.acft.name + "_" + this.acft.GetVersion() + ".json", "json");
        };

        var load_button = document.getElementById("acft_load") as HTMLInputElement;
        load_button.multiple = false;
        load_button.accept = "application/JSON";
        load_button.onchange = (evt) => {
            if (load_button.files.length == 0)
                return;
            var file = load_button.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                try {
                    var str = JSON.parse(reader.result as string);
                    var acft = new Aircraft(parts_JSON, weapon_json, false);
                    if (acft.fromJSON(str)) {
                        str = JSON.parse(reader.result as string);
                        console.log(str);
                        this.acft.fromJSON(str);
                        this.acft.CalculateStats();
                    }

                } catch (e) {
                    console.error(e, e.stack);
                }
            };
            reader.readAsText(file);
            load_button.value = "";
        };

        var load_text_area = document.getElementById("acft_load_text") as HTMLInputElement;
        load_text_area.onchange = () => {
            try {
                var str = JSON.parse(load_text_area.value);
                var acft = new Aircraft(parts_JSON, weapon_json, false);
                if (acft.fromJSON(str)) {
                    this.acft.fromJSON(str);
                    this.acft.CalculateStats();
                }
            } catch {
                BlinkBad(load_text_area.parentElement);
            } finally {
                load_text_area.value = "";
            }
        };
        var load_text_area2 = document.getElementById("acft_load_text2") as HTMLInputElement;
        load_text_area2.onchange = () => {
            try {
                var str = JSON.parse(load_text_area2.value);
                var acft = new Aircraft(parts_JSON, weapon_json, false);
                if (acft.fromJSON(str)) {
                    this.acft.fromJSON(str);
                    this.acft.CalculateStats();
                }
            } catch {
                BlinkBad(load_text_area2.parentElement);
            } finally {
                load_text_area2.value = "";
            }
        };

        var link_button = document.getElementById("acft_save_link") as HTMLButtonElement;
        link_button.onclick = () => {
            // var str = JSON.stringify(this.acft.toJSON());
            // var txt = LZString.compressToEncodedURIComponent(str);
            var ser = new Serialize();
            aircraft_model.serialize(ser);
            var arr = ser.FinalArray();
            var str2 = _arrayBufferToString(arr);
            var txt2 = LZString.compressToEncodedURIComponent(str2);
            var link = (location.protocol + "//" + location.host + location.pathname + "?json=" + txt2);
            copyStringToClipboard(link);
        };


        this.cards = new Cards();
        var dash_button = document.getElementById("acft_save_dash") as HTMLButtonElement;
        dash_button.onclick = () => {
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
        };

        var npc_button = document.getElementById("acft_save_npc");
        npc_button.onclick = () => {
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

        var reset_button = document.getElementById("acft_reset") as HTMLButtonElement;
        reset_button.onclick = () => { aircraft_model.Reset(); aircraft_model.CalculateStats(); };
    }

    private UpdateCard() {
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
        var bombs = aircraft_model.GetMunitions().GetBombCount();
        var rockets = aircraft_model.GetMunitions().GetRocketCount();
        var internal = aircraft_model.GetMunitions().GetInternalBombCount();
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(int_bomb.toString() + " Bomb Mass Internally.");
            if (ext_bomb > 0)
                ordinance.push(ext_bomb.toString() + " Bomb Mass Externally.");
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, aircraft_model.GetMunitions().GetMaxBombSize());
                ordinance.push("Largest internal bomb is " + mib.toString() + " Mass.");
            }
            internal -= int_bomb;
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                ordinance.push(int_rock.toString() + " Rocket Mass Internally.");
            if (ext_rock > 0)
                ordinance.push(ext_rock.toString() + " Rocket Mass Externally.");
        }
        this.cards.acft_data.ordinance = ordinance;
        this.cards.acft_data.stability = derived.Stabiilty;
        this.cards.acft_data.stress = this.acft.GetCockpits().GetStressList()[0];
        this.cards.acft_data.toughness = derived.Toughness;
        this.cards.acft_data.turn_bleed = derived.TurnBleed;
        this.cards.acft_data.visibility = this.acft.GetCockpits().GetVisibilityList()[0];
        this.cards.acft_data.vital_parts = this.acft.VitalComponentList();
        this.cards.acft_data.warnings = stats.warnings;
    }

    private UpdateWeaponCard(w: WeaponSystem) {
        var dlist = aircraft_model.GetWeapons().GetDirectionList();

        var name = this.WeaponName(w);
        if (w.IsPlural()) {
            name += "s";
        }

        var ds = w.GetDirection();
        var dtag = "";
        dtag += "[";
        for (let i = 0; i < dlist.length; i++) {
            if (ds[i])
                dtag += dlist[i] + " ";
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
            this.cards.weap_data.tags.push("Rapid Fire");
        }
        if (fweap.shells) {
            this.cards.weap_data.tags.push("Shells");
        }
        var deflector = false;
        for (let iw of w.GetWeapons()) {
            if (iw.GetSynchronization() == SynchronizationType.DEFLECT)
                deflector = true;
        }
        if (deflector) {
            this.cards.weap_data.tags.push("Deflector Plate");
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
            this.cards.eng_data.notes.push("Pulsejet");
            if (e.GetSelectedList() != "") {
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.power > 0 && inputs.starter) {
                    this.cards.eng_data.notes.push("Starter");
                }
            }
        }
        else {

            if (e.IsRotary() && e.IsTractor()) {
                this.cards.eng_data.notes.push("Turns Right");
            } else if (e.IsRotary() && e.IsPusher()) {
                this.cards.eng_data.notes.push("Turns Left");
            }

            if (e.GetSelectedList() != "") {
                var inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);

                this.cards.eng_data.min_IAF = inputs.min_IAF;
                if (inputs.upgrades[1]) {
                    this.cards.eng_data.notes.push("WEP");
                } else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    this.cards.eng_data.notes.push("WEP from altitudes 0-10");
                }
            }
        }

    }

    private UpdateRadiatorCard(r: Radiator) {
        this.cards.rad_data.mount_type = r.GetMountList()[r.GetMountIndex()].name;
        this.cards.rad_data.coolant_type = r.GetCoolantList()[r.GetCoolantIndex()].name;
    }

    private WeaponName(w: WeaponSystem): string {
        var wlist = aircraft_model.GetWeapons().GetWeaponList();
        var ds = w.GetDirection();
        var dircount = 0;
        for (let d of ds) {
            if (d)
                dircount++;
        }
        var name = "";
        if (dircount == 1 && w.GetFixed())
            name += "Fixed ";
        else if (dircount <= 2)
            name += "Flexible ";
        else
            name += "Turreted ";

        if (w.GetAction() == 1) {
            name += "Mechanical Action ";
        } else if (w.GetAction() == 2) {
            name += "Gast Principle ";
        }

        if (w.GetProjectile() == 1) {
            name += "Heat Ray ";
        } else if (w.GetProjectile() == 2) {
            name += "Gyrojet ";
        } else if (w.GetProjectile() == 3) {
            name += "Pneumatic ";
        }

        name += wlist[w.GetWeaponSelected()].abrv;
        return name;
    }

    // private InitAlter(tbl: HTMLTableElement) {
    //     var row = tbl.insertRow();
    //     CreateTH(row, "Lift Bleed");
    //     CreateTH(row, "Drag");
    //     CreateTH(row, "Mass");
    //     CreateTH(row, "Wet Mass");
    //     CreateTH(row, "Bomb Mass");
    //     CreateTH(row, "Cost");
    //     CreateTH(row, "Upkeep");
    //     row = tbl.insertRow();
    //     this.a_lift = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_drag = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_mass = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_wmas = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_bmas = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_cost = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_upkp = document.createElement("INPUT") as HTMLInputElement;
    //     row.insertCell().appendChild(this.a_lift);
    //     row.insertCell().appendChild(this.a_drag);
    //     row.insertCell().appendChild(this.a_mass);
    //     row.insertCell().appendChild(this.a_wmas);
    //     row.insertCell().appendChild(this.a_bmas);
    //     row.insertCell().appendChild(this.a_cost);
    //     row.insertCell().appendChild(this.a_upkp);
    //     this.a_lift.setAttribute("type", "number");
    //     this.a_drag.setAttribute("type", "number");
    //     this.a_mass.setAttribute("type", "number");
    //     this.a_wmas.setAttribute("type", "number");
    //     this.a_bmas.setAttribute("type", "number");
    //     this.a_cost.setAttribute("type", "number");
    //     this.a_upkp.setAttribute("type", "number");
    //     this.a_lift.valueAsNumber = 0;
    //     this.a_drag.valueAsNumber = 0;
    //     this.a_mass.valueAsNumber = 0;
    //     this.a_wmas.valueAsNumber = 0;
    //     this.a_bmas.valueAsNumber = 0;
    //     this.a_cost.valueAsNumber = 0;
    //     this.a_upkp.valueAsNumber = 0;
    //     this.a_lift.onchange = () => { aircraft_model.GetAlter().stats.liftbleed = this.a_lift.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_drag.onchange = () => { aircraft_model.GetAlter().stats.drag = this.a_drag.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_mass.onchange = () => { aircraft_model.GetAlter().stats.mass = this.a_mass.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_wmas.onchange = () => { aircraft_model.GetAlter().stats.wetmass = this.a_wmas.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_bmas.onchange = () => { aircraft_model.GetAlter().stats.bomb_mass = this.a_bmas.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_cost.onchange = () => { aircraft_model.GetAlter().stats.cost = this.a_cost.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_upkp.onchange = () => { aircraft_model.GetAlter().stats.upkeep = this.a_upkp.valueAsNumber; aircraft_model.CalculateStats(); };
    //     row = tbl.insertRow();
    //     CreateTH(row, "Control");
    //     CreateTH(row, "Pitch Stability");
    //     CreateTH(row, "Lateral Stability");
    //     CreateTH(row, "Wing Area");
    //     CreateTH(row, "Raw Strain");
    //     CreateTH(row, "Structure");
    //     CreateTH(row, "Toughness");
    //     row = tbl.insertRow();
    //     this.a_cont = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_pstb = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_lstb = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_wara = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_mstr = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_strc = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_tugh = document.createElement("INPUT") as HTMLInputElement;
    //     row.insertCell().appendChild(this.a_cont);
    //     row.insertCell().appendChild(this.a_pstb);
    //     row.insertCell().appendChild(this.a_lstb);
    //     row.insertCell().appendChild(this.a_wara);
    //     row.insertCell().appendChild(this.a_mstr);
    //     row.insertCell().appendChild(this.a_strc);
    //     row.insertCell().appendChild(this.a_tugh);
    //     this.a_cont.setAttribute("type", "number");
    //     this.a_pstb.setAttribute("type", "number");
    //     this.a_lstb.setAttribute("type", "number");
    //     this.a_wara.setAttribute("type", "number");
    //     this.a_mstr.setAttribute("type", "number");
    //     this.a_strc.setAttribute("type", "number");
    //     this.a_tugh.setAttribute("type", "number");
    //     this.a_cont.valueAsNumber = 0;
    //     this.a_pstb.valueAsNumber = 0;
    //     this.a_lstb.valueAsNumber = 0;
    //     this.a_wara.valueAsNumber = 0;
    //     this.a_mstr.valueAsNumber = 0;
    //     this.a_strc.valueAsNumber = 0;
    //     this.a_tugh.valueAsNumber = 0;
    //     this.a_cont.onchange = () => { aircraft_model.GetAlter().stats.control = this.a_cont.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_pstb.onchange = () => { aircraft_model.GetAlter().stats.pitchstab = this.a_pstb.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_lstb.onchange = () => { aircraft_model.GetAlter().stats.latstab = this.a_lstb.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_wara.onchange = () => { aircraft_model.GetAlter().stats.wingarea = this.a_wara.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_mstr.onchange = () => { aircraft_model.GetAlter().stats.maxstrain = this.a_mstr.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_strc.onchange = () => { aircraft_model.GetAlter().stats.structure = this.a_strc.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_tugh.onchange = () => { aircraft_model.GetAlter().stats.toughness = this.a_tugh.valueAsNumber; aircraft_model.CalculateStats(); };
    //     row = tbl.insertRow();
    //     CreateTH(row, "Power");
    //     CreateTH(row, "Fuel Consumption");
    //     CreateTH(row, "Fuel");
    //     CreateTH(row, "Pitch Speed");
    //     CreateTH(row, "Pitch Boost");
    //     CreateTH(row, "Charge");
    //     CreateTH(row, "Crash Safety");
    //     row = tbl.insertRow();
    //     this.a_powr = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_fcom = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_fuel = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_pspd = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_pbst = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_chrg = document.createElement("INPUT") as HTMLInputElement;
    //     this.a_crsh = document.createElement("INPUT") as HTMLInputElement;
    //     row.insertCell().appendChild(this.a_powr);
    //     row.insertCell().appendChild(this.a_fcom);
    //     row.insertCell().appendChild(this.a_fuel);
    //     row.insertCell().appendChild(this.a_pspd);
    //     row.insertCell().appendChild(this.a_pbst);
    //     row.insertCell().appendChild(this.a_chrg);
    //     row.insertCell().appendChild(this.a_crsh);
    //     this.a_powr.setAttribute("type", "number");
    //     this.a_fcom.setAttribute("type", "number");
    //     this.a_fuel.setAttribute("type", "number");
    //     this.a_pspd.setAttribute("type", "number");
    //     this.a_pbst.setAttribute("type", "number");
    //     this.a_chrg.setAttribute("type", "number");
    //     this.a_crsh.setAttribute("type", "number");
    //     this.a_powr.valueAsNumber = 0;
    //     this.a_fcom.valueAsNumber = 0;
    //     this.a_fuel.valueAsNumber = 0;
    //     this.a_pspd.valueAsNumber = 0;
    //     this.a_pbst.valueAsNumber = 0;
    //     this.a_chrg.valueAsNumber = 0;
    //     this.a_crsh.valueAsNumber = 0;
    //     this.a_powr.onchange = () => { aircraft_model.GetAlter().stats.power = this.a_powr.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_fcom.onchange = () => { aircraft_model.GetAlter().stats.fuelconsumption = this.a_fcom.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_fuel.onchange = () => { aircraft_model.GetAlter().stats.fuel = this.a_fuel.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_pspd.onchange = () => { aircraft_model.GetAlter().stats.pitchspeed = this.a_pspd.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_pbst.onchange = () => { aircraft_model.GetAlter().stats.pitchboost = this.a_pbst.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_chrg.onchange = () => { aircraft_model.GetAlter().stats.charge = this.a_chrg.valueAsNumber; aircraft_model.CalculateStats(); };
    //     this.a_crsh.onchange = () => { aircraft_model.GetAlter().stats.crashsafety = this.a_crsh.valueAsNumber; aircraft_model.CalculateStats(); };
    // }

    private InitStats(tbl: HTMLTableElement) {
        var row = tbl.insertRow();
        CreateTH(row, "Lift Bleed");
        CreateTH(row, "Drag");
        CreateTH(row, "Mass");
        CreateTH(row, "Wet Mass");
        CreateTH(row, "Bomb Mass");
        CreateTH(row, "Cost");
        CreateTH(row, "Upkeep");
        row = tbl.insertRow();
        this.d_lift = row.insertCell();
        this.d_drag = row.insertCell();
        this.d_mass = row.insertCell();
        this.d_wmas = row.insertCell();
        this.d_bmas = row.insertCell();
        this.d_cost = row.insertCell();
        this.d_upkp = row.insertCell();
        row = tbl.insertRow();
        CreateTH(row, "Control");
        CreateTH(row, "Pitch Stability");
        CreateTH(row, "Lateral Stability");
        CreateTH(row, "Wing Area");
        CreateTH(row, "Raw Strain");
        CreateTH(row, "Structure");
        CreateTH(row, "Toughness");
        row = tbl.insertRow();
        this.d_cont = row.insertCell();
        this.d_pstb = row.insertCell();
        this.d_lstb = row.insertCell();
        this.d_wara = row.insertCell();
        this.d_mstr = row.insertCell();
        this.d_strc = row.insertCell();
        this.d_tugh = row.insertCell();
        row = tbl.insertRow();
        CreateTH(row, "Power");
        CreateTH(row, "Fuel Consumption");
        CreateTH(row, "Fuel");
        CreateTH(row, "Pitch Speed");
        CreateTH(row, "Pitch Boost");
        CreateTH(row, "Charge");
        CreateTH(row, "Crash Safety");
        row = tbl.insertRow();
        this.d_powr = row.insertCell();
        this.d_fcom = row.insertCell();
        this.d_fuel = row.insertCell();
        this.d_pspd = row.insertCell();
        this.d_pbst = row.insertCell();
        this.d_chrg = row.insertCell();
        this.d_crsh = row.insertCell();
    }

    private InitDerived(tbl: HTMLTableElement) {
        var row0 = tbl.insertRow();
        var name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 2;
        this.name_inp = document.createElement("INPUT") as HTMLInputElement;
        this.name_inp.defaultValue = "Aircraft Name";
        this.name_inp.onchange = () => { this.acft.name = this.name_inp.value; };
        name_cell.appendChild(this.name_inp);

        CreateTH(row0, "Cost");
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
        CreateTH(row0, "Upkeep");
        // Aircraft Upkeep
        this.upkeep_cell = row0.insertCell();
        // Rules Version
        CreateTH(row0, "Version #");
        this.version_cell = row0.insertCell();

        var row1 = tbl.insertRow();
        CreateTH(row1, "Mass Variations");
        CreateTH(row1, "Boost");
        CreateTH(row1, "Handling");
        CreateTH(row1, "Rate of Climb");
        CreateTH(row1, "Stall Speed");
        CreateTH(row1, "Top Speed");
        CreateTH(row1, "Vital Components").colSpan = 2;


        this.bomb_row2 = tbl.insertRow();
        CreateTH(this.bomb_row2, "Full Fuel with Bombs");
        this.boost_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.roc_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.vital_components = this.bomb_row2.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;

        this.bomb_row1 = tbl.insertRow();
        CreateTH(this.bomb_row1, "Half Fuel with Bombs");
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.roc_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.ts_halfwB = this.bomb_row1.insertCell();

        this.full_row = tbl.insertRow();
        CreateTH(this.full_row, "Full Fuel");
        this.boost_full = this.full_row.insertCell();
        this.hand_full = this.full_row.insertCell();
        this.roc_full = this.full_row.insertCell();
        this.ss_full = this.full_row.insertCell();
        this.ts_full = this.full_row.insertCell();

        var half = tbl.insertRow();
        CreateTH(half, "Half Fuel");
        this.boost_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.roc_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.ts_half = half.insertCell();

        var empty = tbl.insertRow();
        CreateTH(empty, "Empty Fuel");
        this.boost_empty = empty.insertCell();
        this.hand_empty = empty.insertCell();
        this.roc_empty = empty.insertCell();
        this.ss_empty = empty.insertCell();
        this.ts_empty = empty.insertCell();

        var row7 = tbl.insertRow();
        CreateTH(row7, "Propulsion").colSpan = 2;
        CreateTH(row7, "Aerodynamics").colSpan = 2;
        CreateTH(row7, "Survivability").colSpan = 2;
        CreateTH(row7, "Crew Members").colSpan = 2;

        var row8 = tbl.insertRow();
        CreateTH(row8, "Dropoff");
        this.dropoff_cell = row8.insertCell();
        CreateTH(row8, "Stability");
        this.stability_cell = row8.insertCell();
        CreateTH(row8, "Crash Safety");
        this.crashsafety_cell = row8.insertCell();
        CreateTH(row8, "Crew/Passengers");
        this.crew_cell = row8.insertCell();

        var row9 = tbl.insertRow();
        CreateTH(row9, "Overspeed");
        this.overspeed_cell = row9.insertCell();
        CreateTH(row9, "Energy Loss");
        this.eloss_cell = row9.insertCell();
        CreateTH(row9, "Toughness");
        this.toughness_cell = row9.insertCell();
        CreateTH(row9, "Visibility");
        this.visibility_cell = row9.insertCell();

        var row10 = tbl.insertRow();
        CreateTH(row10, "Fuel Uses");
        this.maxfuel_cell = row10.insertCell();
        CreateTH(row10, "Turn Bleed");
        this.turnbleed_cell = row10.insertCell();
        CreateTH(row10, "Max Strain");
        this.mxstrain_cell = row10.insertCell();
        CreateTH(row10, "Attack Modifier");
        this.attack_cell = row10.insertCell();

        var row11 = tbl.insertRow();
        CreateTH(row11, "Reliability");
        this.reliability_cell = row11.insertCell();
        CreateTH(row11, "Landing Gear");
        this.landing_cell = row11.insertCell();
        CreateTH(row11, "Communications");
        this.communications_cell = row11.insertCell();
        CreateTH(row11, "Escape");
        this.escape_cell = row11.insertCell();

        var row12 = tbl.insertRow();
        CreateTH(row12, "Ideal Altitude");
        this.maxalt_cell = row12.insertCell();
        CreateTH(row12, "Flammable?");
        this.flammable_cell = row12.insertCell();
        CreateTH(row12, "Electrics");
        this.electric_cell = row12.insertCell();
        CreateTH(row12, "Flight Stress");
        this.flightstress_cell = row12.insertCell();

        this.weapon_head = CreateTH(tbl.insertRow(), "Weapon Systems");
        this.weapon_head.colSpan = 8;
        this.weapon_cell = tbl.insertRow().insertCell();
        this.weapon_cell.colSpan = 8;

        this.warning_head = CreateTH(tbl.insertRow(), "Special Rules");
        this.warning_head.colSpan = 8;
        this.warning_cell = tbl.insertRow().insertCell();
        this.warning_cell.colSpan = 8;
    }

    private UpdateStats() {

        var stats = this.acft.GetStats();
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
        BlinkIfChanged(this.d_pspd, stats.pitchspeed.toString(), true);
        BlinkIfChanged(this.d_pbst, stats.pitchboost.toString(), true);
        BlinkIfChanged(this.d_wara, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_chrg, stats.charge.toString(), true);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
    }

    private UpdateDerived() {
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        this.name_inp.value = this.acft.name;
        this.version_cell.textContent = this.acft.GetVersion();
        this.cost_cell.textContent = stats.cost.toString() + "þ ";
        if (this.acft.GetUsed().GetEnabled()) {
            this.cost_cell.textContent += " (" + Math.floor(1.0e-6 + stats.cost / 2).toString() + "þ Used)";
        }
        this.upkeep_cell.textContent = stats.upkeep.toString() + "þ";
        //Empty
        // this.ts_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedEmpty).toString();
        // this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        // this.hand_empty.textContent = derived.HandlingEmpty.toString();
        // this.boost_empty.textContent = derived.BoostEmpty.toString();
        // this.roc_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull - derived.StallSpeedFull + derived.BoostFull).toString();
        this.ts_empty.textContent = (0).toString();
        this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        this.hand_empty.textContent = derived.HandlingEmpty.toString();
        this.boost_empty.textContent = (0).toString();
        this.roc_empty.textContent = (0).toString();
        //Half
        this.ts_half.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.roc_half.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2).toString();
        //Full
        this.ts_full.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull).toString();
        this.ss_full.textContent = derived.StallSpeedFull.toString();
        this.hand_full.textContent = derived.HandlingFull.toString();
        this.boost_full.textContent = derived.BoostFull.toString();
        this.roc_full.textContent = derived.RateOfClimbFull.toString();

        if (stats.bomb_mass > 0) {
            this.bomb_row1.hidden = false;
            this.bomb_row2.hidden = false;
            this.bomb_row2.appendChild(this.vital_components);
            this.vital_components.rowSpan = 5;
            //Half
            this.ts_halfwB.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.roc_halfwB.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2).toString();
            //Full
            this.ts_fullwB.textContent = Math.floor(1.0e-6 + derived.MaxSpeedwBombs).toString();
            this.ss_fullwB.textContent = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.textContent = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.textContent = derived.BoostFullwBombs.toString();
            this.roc_fullwB.textContent = derived.RateOfClimbwBombs.toString();

        } else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
            this.full_row.appendChild(this.vital_components);
            this.vital_components.rowSpan = 3;
        }

        this.dropoff_cell.textContent = derived.Dropoff.toString();
        this.overspeed_cell.textContent = derived.Overspeed.toString();
        this.maxfuel_cell.textContent = (Math.round(derived.FuelUses * 10) / 10).toString();
        if (this.acft.GetIsFlammable())
            this.flammable_cell.textContent = "Yes";
        else
            this.flammable_cell.textContent = "No";

        this.stability_cell.textContent = derived.Stabiilty.toString();
        this.eloss_cell.textContent = derived.EnergyLoss.toString();
        this.turnbleed_cell.textContent = derived.TurnBleed.toString();
        this.landing_cell.textContent = this.acft.GetGearName();
        this.maxalt_cell.textContent = this.acft.GetMinIAF().toString() + "-" + this.acft.GetMaxAltitude().toString();

        this.reliability_cell.textContent = this.acft.GetReliabilityList().toString();
        this.toughness_cell.textContent = derived.Toughness.toString();
        this.mxstrain_cell.textContent = derived.MaxStrain.toString();
        this.escape_cell.textContent = this.acft.GetEscapeList().toString();
        this.crashsafety_cell.textContent = this.acft.GetCrashList().toString();

        this.crew_cell.textContent = aircraft_model.GetCockpits().GetNumberOfCockpits().toString() + "/" + (aircraft_model.GetPassengers().GetSeats() + aircraft_model.GetPassengers().GetBeds()).toString();
        this.flightstress_cell.textContent = this.acft.GetStressList().toString();
        this.visibility_cell.textContent = this.acft.GetVisibilityList().toString();
        this.attack_cell.textContent = this.acft.GetAttackList().toString();
        this.communications_cell.textContent = this.acft.GetCommunicationName();
        var wm = this.acft.GetAccessories().GetWindmill();
        var bat = this.acft.GetAccessories().GetStorage();
        var electric_str = stats.charge.toString();
        if (wm > 0)
            electric_str += " + " + wm.toString() + "/10 speed";
        if (bat > 0)
            electric_str += " + " + bat + " storage";
        this.electric_cell.textContent = electric_str;

        var vital = "";
        var vlist = this.acft.VitalComponentList();
        for (let v of vlist) {
            vital += v + "<br/>";
        }
        this.vital_components.innerHTML = vital;

        var wlist = aircraft_model.GetWeapons().GetWeaponList();
        var dlist = aircraft_model.GetWeapons().GetDirectionList();
        var bombs = aircraft_model.GetMunitions().GetBombCount();
        var rockets = aircraft_model.GetMunitions().GetRocketCount();
        var internal = aircraft_model.GetMunitions().GetInternalBombCount();
        var weaphtml = "";
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                weaphtml += (int_bomb.toString() + " Bomb Mass Internally. ");
            if (ext_bomb > 0)
                weaphtml += (ext_bomb.toString() + " Bomb Mass Externally. ");
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, aircraft_model.GetMunitions().GetMaxBombSize());
                weaphtml += ("Largest internal bomb is " + mib.toString() + " Mass.");
            }
            internal -= int_bomb;
            weaphtml += "<br/>";
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                weaphtml += (int_rock.toString() + " Rocket Mass Internally. ");
            if (ext_rock > 0)
                weaphtml += (ext_rock.toString() + " Rocket Mass Externally. ");
            weaphtml += "<br/>";
        }

        for (let w of aircraft_model.GetWeapons().GetWeaponSets()) {
            var ds = w.GetDirection();
            var dircount = 0;
            for (let d of ds) {
                if (d)
                    dircount++;
            }
            weaphtml += this.WeaponName(w);
            if (w.IsPlural()) {
                weaphtml += "s";
                weaphtml += " fire ";
            }
            else {
                weaphtml += " fires ";
            }
            weaphtml += "[";
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    weaphtml += dlist[i] + " ";
            }
            weaphtml = weaphtml.substr(0, weaphtml.length - 1);
            weaphtml += "] ";
            let h = w.GetHits();
            weaphtml += "for " + wlist[w.GetWeaponSelected()].damage + " damage with " + h[0].toString() + "\\"
                + h[1].toString() + "\\"
                + h[2].toString() + "\\"
                + h[3].toString() + " hits with ";
            if (w.GetProjectile() == ProjectileType.HEATRAY) {
                let chgs = w.GetHRCharges();
                if (chgs.length == 1)
                    weaphtml += chgs[0].toString() + " charges. ";
                else
                    weaphtml += chgs[0].toString() + "/" + chgs[1].toString() + " charges. ";
            } else {
                weaphtml += w.GetShots() + " ammunition. ";
            }
            if (w.GetFinalWeapon().rapid || w.GetFinalWeapon().shells || w.GetFinalWeapon().ap > 0) {
                weaphtml += "["
                weaphtml += " Jam " + w.GetJam();
                if (w.GetReload() > 0) {
                    weaphtml += ", ";
                    weaphtml += "Reload " + w.GetReload().toString();
                }
                if (w.GetFinalWeapon().rapid) {
                    weaphtml += ", ";
                    weaphtml += "Rapid Fire";
                }
                if (w.GetFinalWeapon().shells) {
                    weaphtml += ", ";
                    weaphtml += "Shells";
                }
                if (w.GetFinalWeapon().ap > 0) {
                    weaphtml += ", ";
                    weaphtml += "AP " + w.GetFinalWeapon().ap.toString();
                }
                weaphtml += " ]";
            }
            weaphtml += "<br\>";
        }
        this.weapon_cell.innerHTML = weaphtml;

        var warnhtml = "";
        for (let w of stats.warnings) {
            warnhtml += w.source + ":  " + w.warning + "<br/>";
        }
        this.warning_cell.innerHTML = warnhtml;
    }

    public UpdateDisplay() {
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
        this.load.UpdateDisplay();
        this.gear.UpdateDisplay();
        this.accessories.UpdateDisplay();
        this.optimization.UpdateDisplay();
        this.weapons.UpdateDisplay();
        this.used.UpdateDisplay();

        this.UpdateStats();
        this.UpdateDerived();
    }
}