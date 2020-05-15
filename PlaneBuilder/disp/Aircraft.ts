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
    private bomb_row1: HTMLTableRowElement;
    private bomb_row2: HTMLTableRowElement;
    private ts_empty: HTMLTableCellElement;
    private ss_empty: HTMLTableCellElement;
    private hand_empty: HTMLTableCellElement;
    private boost_empty: HTMLTableCellElement;
    private ts_half: HTMLTableCellElement;
    private ss_half: HTMLTableCellElement;
    private hand_half: HTMLTableCellElement;
    private boost_half: HTMLTableCellElement;
    private ts_full: HTMLTableCellElement;
    private ss_full: HTMLTableCellElement;
    private hand_full: HTMLTableCellElement;
    private boost_full: HTMLTableCellElement;
    private ts_halfwB: HTMLTableCellElement;
    private ss_halfwB: HTMLTableCellElement;
    private hand_halfwB: HTMLTableCellElement;
    private boost_halfwB: HTMLTableCellElement;
    private ts_fullwB: HTMLTableCellElement;
    private ss_fullwB: HTMLTableCellElement;
    private hand_fullwB: HTMLTableCellElement;
    private boost_fullwB: HTMLTableCellElement;
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

    private copy_text: string;

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

        // var tbla = document.getElementById("tbl_alter") as HTMLTableElement;
        // this.InitAlter(tbla);

        var tbl = document.getElementById("tbl_stats") as HTMLTableElement;
        this.InitStats(tbl);

        var tbl2 = document.getElementById("tbl_derived") as HTMLTableElement;
        this.InitDerived(tbl2);

        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });
        this.UpdateDisplay();

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

        var copy_button = document.getElementById("stats_copy") as HTMLButtonElement;
        copy_button.onclick = () => { copyStringToClipboard(this.copy_text); };

        var save_text_button = document.getElementById("acft_save_text") as HTMLButtonElement;
        save_text_button.onclick = () => { copyStringToClipboard(JSON.stringify(this.acft.toJSON())); };

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
                Blink(load_text_area.parentElement);
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
                Blink(load_text_area2.parentElement);
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
        };

        var reset_button = document.getElementById("acft_reset") as HTMLButtonElement;
        reset_button.onclick = () => { aircraft_model.Reset(); };
    }

    private UpdateCard() {
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        this.cards.name = this.acft.name;
        this.cards.acft_data.armour = this.acft.GetAccessories().GetArmourCoverage();
        this.cards.acft_data.crash = stats.crashsafety;
        this.cards.acft_data.dropoff = derived.Dropoff;
        this.cards.acft_data.empty_boost = derived.BoostEmpty;
        this.cards.acft_data.empty_hand = derived.HandlingEmpty;
        this.cards.acft_data.empty_stall = derived.StallSpeedEmpty;
        this.cards.acft_data.energy_loss = derived.EnergyLoss;
        this.cards.acft_data.escape = this.acft.GetCockpits().GetEscapeList()[0];
        this.cards.acft_data.fuel = derived.FuelUses;
        this.cards.acft_data.full_bomb_boost = derived.BoostFullwBombs;
        this.cards.acft_data.full_bomb_hand = derived.HandlingFullwBombs;
        this.cards.acft_data.full_bomb_stall = derived.StallSpeedFullwBombs;
        this.cards.acft_data.full_boost = derived.BoostFull;
        this.cards.acft_data.full_hand = derived.HandlingFull;
        this.cards.acft_data.full_stall = derived.StallSpeedFull;
        this.cards.acft_data.half_bomb_boost = Math.floor((derived.BoostFullwBombs + derived.BoostEmpty) / 2);
        this.cards.acft_data.half_bomb_hand = Math.floor((derived.HandlingFullwBombs + derived.HandlingEmpty) / 2);
        this.cards.acft_data.half_bomb_stall = Math.floor((derived.StallSpeedFullwBombs + derived.StallSpeedEmpty) / 2);
        this.cards.acft_data.half_boost = Math.floor((derived.BoostFull + derived.BoostEmpty) / 2);
        this.cards.acft_data.half_hand = Math.floor((derived.HandlingFull + derived.HandlingEmpty) / 2);
        this.cards.acft_data.half_stall = Math.floor((derived.StallSpeedFull + derived.StallSpeedEmpty) / 2);
        this.cards.acft_data.max_speed = derived.MaxSpeedEmpty;
        this.cards.acft_data.max_strain = derived.MaxStrain;
        var ordinance = [];
        if (aircraft_model.GetMunitions().GetBombCount() > 0) {
            var internal = Math.min(aircraft_model.GetMunitions().GetBombCount(), aircraft_model.GetMunitions().GetInternalBombCount());
            var external = aircraft_model.GetMunitions().GetBombCount() - internal;
            if (internal > 0)
                ordinance.push(internal.toString() + " Mass Internally");
            if (external > 0)
                ordinance.push(external.toString() + " Mass Externally");
            if (aircraft_model.GetMunitions().GetMaxBombSize() > 0) {
                ordinance.push("Largest internal bomb is " + aircraft_model.GetMunitions().GetMaxBombSize().toString() + " Mass");
            }
        }
        this.cards.acft_data.ordinance = ordinance;
        this.cards.acft_data.stability = derived.Stabiilty;
        this.cards.acft_data.stress = this.acft.GetCockpits().GetStressList()[0];
        this.cards.acft_data.toughness = derived.Toughness;
        this.cards.acft_data.turn_bleed = derived.TurnBleed;
        this.cards.acft_data.visibility = this.acft.GetCockpits().GetVisibilityList()[0];
        this.cards.acft_data.vital_parts = this.VitalComponentList();
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

        this.cards.weap_data.ammo_base = fweap.ammo;
        this.cards.weap_data.ammo_mult = w.GetAmmo();
        this.cards.weap_data.ap = fweap.ap;
        this.cards.weap_data.damage = fweap.damage;
        this.cards.weap_data.hits = w.GetHits();
        this.cards.weap_data.jam = w.GetJam();
        this.cards.weap_data.tags = [dtag];
        this.cards.weap_data.type = name;
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

    private VitalComponentList(): string[] {
        var derived = this.acft.GetDerivedStats();
        var vital = [];
        vital.push("Controls");
        for (let i = 0; i < this.acft.GetCockpits().GetNumberOfCockpits(); i++) {
            vital.push("Aircrew #" + (i + 1).toString());
        }
        if (derived.FuelUses > 0) {
            vital.push("Fuel Tanks");
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            if (this.acft.GetEngines().GetEngine(i).GetUsePushPull()) {
                vital.push("Engine #" + (i + 1).toString() + " Pusher");
                if (this.acft.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push("Oil Tank #" + (i + 1).toString() + " Pusher");
                }
                if (this.acft.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push("Oil Cooler #" + (i + 1).toString() + " Pusher");
                }
                vital.push("Engine #" + (i + 1).toString() + " Puller");
                if (this.acft.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push("Oil Tank #" + (i + 1).toString() + " Puller");
                }
                if (this.acft.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push("Oil Cooler #" + (i + 1).toString() + " Puller");
                }
            }
            else {
                vital.push("Engine #" + (i + 1).toString());
                if (this.acft.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push("Oil Tank #" + (i + 1).toString());
                }
                if (this.acft.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push("Oil Cooler #" + (i + 1).toString());
                }
            }
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfRadiators(); i++) {
            vital.push("Radiator #" + (i + 1).toString());
        }
        if (this.acft.IsElectrics()) {
            vital.push("Electrics");
        }
        for (let i = 0; i < aircraft_model.GetWeapons().GetWeaponSets().length; i++) {
            vital.push("Weapon Set #" + (i + 1).toString());
        }
        return vital;
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

        name += wlist[w.GetWeaponSelected()].name;
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
        CreateTH(row1, "Top Speed");
        CreateTH(row1, "Stall Speed");
        CreateTH(row1, "Handling");
        CreateTH(row1, "Boost");
        CreateTH(row1, "Vital Components").colSpan = 3;

        var full = tbl.insertRow();
        CreateTH(full, "Full Mass");
        this.ts_full = full.insertCell();
        this.ss_full = full.insertCell();
        this.hand_full = full.insertCell();
        this.boost_full = full.insertCell();
        this.vital_components = full.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;

        var half = tbl.insertRow();
        CreateTH(half, "Half Mass");
        this.ts_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.boost_half = half.insertCell();

        var empty = tbl.insertRow();
        CreateTH(empty, "Empty Mass");
        this.ts_empty = empty.insertCell();
        this.ss_empty = empty.insertCell();
        this.hand_empty = empty.insertCell();
        this.boost_empty = empty.insertCell();

        this.bomb_row2 = tbl.insertRow();
        CreateTH(this.bomb_row2, "Full Mass with Bombs");
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.boost_fullwB = this.bomb_row2.insertCell();

        this.bomb_row1 = tbl.insertRow();
        CreateTH(this.bomb_row1, "Half Mass with Bombs");
        this.ts_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.boost_halfwB = this.bomb_row1.insertCell();

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
        CreateTH(row9, "Visibiilty");
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
        CreateTH(row12, "Flight Ceiling");
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
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString());
        BlinkIfChanged(this.d_bmas, stats.bomb_mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_upkp, stats.upkeep.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_powr, stats.power.toString());
        BlinkIfChanged(this.d_fcom, stats.fuelconsumption.toString());
        BlinkIfChanged(this.d_fuel, stats.fuel.toString());
        BlinkIfChanged(this.d_pspd, stats.pitchspeed.toString());
        BlinkIfChanged(this.d_pbst, stats.pitchboost.toString());
        BlinkIfChanged(this.d_wara, stats.wingarea.toString());
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_chrg, stats.charge.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }

    private UpdateDerived() {
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        this.name_inp.value = this.acft.name;
        this.copy_text = this.acft.name + "\n";
        this.version_cell.innerText = this.acft.GetVersion();
        this.copy_text += "Version " + this.acft.GetVersion() + "\n";
        this.cost_cell.innerText = stats.cost.toString() + "þ";
        this.copy_text += "Cost " + stats.cost.toString() + "þ\n";
        this.upkeep_cell.innerText = stats.upkeep.toString() + "þ";
        this.copy_text += "Upkeep " + stats.upkeep.toString() + "þ\n";
        this.copy_text += "\n";
        this.copy_text += "Mass\t\t\tTop Speed\tStall Speed\tHandling\tBoost\n";
        //Empty
        this.ts_empty.innerText = Math.floor(1.0e-6 + derived.MaxSpeedEmpty).toString();
        this.ss_empty.innerText = derived.StallSpeedEmpty.toString();
        this.hand_empty.innerText = derived.HandlingEmpty.toString();
        this.boost_empty.innerText = derived.BoostEmpty.toString();
        this.copy_text += "Empty Mass\t\t"
            + this.ts_empty.innerText + "\t\t"
            + this.ss_empty.innerText + "\t\t"
            + this.hand_empty.innerText + "\t\t"
            + this.boost_empty.innerText + "\n";
        //Half
        this.ts_half.innerText = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.innerText = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.innerText = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.innerText = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.copy_text += "Half Mass\t\t"
            + this.ts_half.innerText + "\t\t"
            + this.ss_half.innerText + "\t\t"
            + this.hand_half.innerText + "\t\t"
            + this.boost_half.innerText + "\n";
        //Full
        this.ts_full.innerText = Math.floor(1.0e-6 + derived.MaxSpeedFull).toString();
        this.ss_full.innerText = derived.StallSpeedFull.toString();
        this.hand_full.innerText = derived.HandlingFull.toString();
        this.boost_full.innerText = derived.BoostFull.toString();
        this.copy_text += "Full Mass\t\t"
            + this.ts_full.innerText + "\t\t"
            + this.ss_full.innerText + "\t\t"
            + this.hand_full.innerText + "\t\t"
            + this.boost_full.innerText + "\n";
        this.copy_text += "\n";

        if (stats.bomb_mass > 0) {
            this.bomb_row1.hidden = false;
            this.bomb_row2.hidden = false;
            this.vital_components.rowSpan = 5;
            //Half
            this.ts_halfwB.innerText = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.innerText = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.innerText = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.innerText = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.copy_text += "Half Mass with Bombs\t"
                + this.ts_halfwB.innerText + "\t\t"
                + this.ss_halfwB.innerText + "\t\t"
                + this.hand_halfwB.innerText + "\t\t"
                + this.boost_halfwB.innerText + "\n";
            //Full
            this.ts_fullwB.innerText = Math.floor(1.0e-6 + derived.MaxSpeedwBombs).toString();
            this.ss_fullwB.innerText = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.innerText = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.innerText = derived.BoostFullwBombs.toString();
            this.copy_text += "Full Mass with Bombs\t"
                + this.ts_fullwB.innerText + "\t\t"
                + this.ss_fullwB.innerText + "\t\t"
                + this.hand_fullwB.innerText + "\t\t"
                + this.boost_fullwB.innerText + "\n";
            this.copy_text += "\n";

        } else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
            this.vital_components.rowSpan = 3;
        }

        this.dropoff_cell.innerText = derived.Dropoff.toString();
        this.overspeed_cell.innerText = derived.Overspeed.toString();
        this.maxfuel_cell.innerText = (Math.round(derived.FuelUses * 10) / 10).toString();
        if (this.acft.GetIsFlammable())
            this.flammable_cell.innerText = "Yes";
        else
            this.flammable_cell.innerText = "No";
        this.copy_text += "Propulsion\n\t"
            + "Dropoff\t" + this.dropoff_cell.innerText + "\n\t"
            + "Overspeed\t" + this.overspeed_cell.innerText + "\n\t"
            + "Fuel Uses\t" + this.maxfuel_cell.innerText + "\n\t"
            + "Flight Ceiling\t" + this.maxalt_cell.innerText + "\n";
        this.copy_text += "\n";

        this.stability_cell.innerText = derived.Stabiilty.toString();
        this.eloss_cell.innerText = derived.EnergyLoss.toString();
        this.turnbleed_cell.innerText = derived.TurnBleed.toString();
        this.landing_cell.innerText = this.acft.GetGearName();
        this.maxalt_cell.innerText = (Math.floor(1.0e-6 + this.acft.GetMaxAltitude() * 10 - 1 + derived.MaxSpeedEmpty - derived.StallSpeedEmpty)).toString();

        this.copy_text += "Aerodynamics\n\t"
            + "Stability\t" + this.stability_cell.innerText + "\n\t"
            + "Energy Loss\t" + this.eloss_cell.innerText + "\n\t"
            + "Turn Bleed\t" + this.turnbleed_cell.innerText + "\n\t"
            + "Landing Gear\t" + this.landing_cell.innerText + "\n"
        this.copy_text += "\n";

        this.reliability_cell.innerText = this.acft.GetReliabilityList().toString();
        this.toughness_cell.innerText = derived.Toughness.toString();
        this.mxstrain_cell.innerText = derived.MaxStrain.toString();
        this.escape_cell.innerText = this.acft.GetEscapeList().toString();
        this.crashsafety_cell.innerText = this.acft.GetCrashList().toString();
        this.copy_text += "Survivability\n\t"
            + "Reliability\t" + this.reliability_cell.innerText + "\n\t"
            + "Toughness\t" + this.toughness_cell.innerText + "\n\t"
            + "Max Strain\t" + this.mxstrain_cell.innerText + "\n\t"
            + "Escape\t" + this.escape_cell.innerText + "\n\t"
            + "Crash Safety\t" + this.crashsafety_cell.innerText + "\n";
        this.copy_text += "\n";

        this.crew_cell.innerText = aircraft_model.GetCockpits().GetNumberOfCockpits().toString() + "/" + (aircraft_model.GetPassengers().GetSeats() + aircraft_model.GetPassengers().GetBeds()).toString();
        this.flightstress_cell.innerText = this.acft.GetStressList().toString();
        this.visibility_cell.innerText = this.acft.GetVisibilityList().toString();
        this.attack_cell.innerText = this.acft.GetAttackList().toString();
        this.communications_cell.innerText = this.acft.GetCommunicationName();
        this.electric_cell.innerText = stats.charge.toString(); //TODO Windmill
        this.copy_text += "Ergonomics\n\t"
            + "Flight Stress\t" + this.flightstress_cell.innerText + "\n\t"
            + "Visibility\t" + this.visibility_cell.innerText + "\n\t"
            + "Attack Modifier\t" + this.attack_cell.innerText + "\n\t"
            + "Communications\t" + this.communications_cell.innerText + "\n\t"
            + "Electrics\t" + this.electric_cell.innerText + "\n";
        this.copy_text += "\n";

        var vital = "Controls";
        this.copy_text += "Vital Components\n\tControls\n\t";
        var vlist = this.VitalComponentList();
        for (let v of vlist) {
            vital += "<br/>" + v;
            this.copy_text += v + "\n\t";
        }
        this.vital_components.innerHTML = vital;
        this.copy_text += "\n";

        if (aircraft_model.GetWeapons().GetWeaponSets().length > 0) {
            this.copy_text += "Weapons\n\t";
        }

        var wlist = aircraft_model.GetWeapons().GetWeaponList();
        var dlist = aircraft_model.GetWeapons().GetDirectionList();
        var alist = aircraft_model.GetWeapons().GetActionList();
        var plist = aircraft_model.GetWeapons().GetProjectileList();
        this.weapon_cell.innerHTML = "";
        if (aircraft_model.GetMunitions().GetBombCount() > 0) {
            var weaphtml = aircraft_model.GetMunitions().GetBombCount().toString() + " Mass of bombs or rockets.";
            if (aircraft_model.GetMunitions().GetMaxBombSize() > 0) {
                weaphtml += " Largest internal bomb allowed is " + aircraft_model.GetMunitions().GetMaxBombSize() + " Mass.";
            }
            this.weapon_cell.innerHTML = weaphtml + "<br/>";
            this.copy_text += weaphtml + "\n\t";
        }

        for (let w of aircraft_model.GetWeapons().GetWeaponSets()) {
            var ds = w.GetDirection();
            var dircount = 0;
            for (let d of ds) {
                if (d)
                    dircount++;
            }
            var weaphtml = "";
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
                + h[3].toString() + " hits with "
                + w.GetFinalWeapon().ammo * w.GetAmmo() + " ammunition. ";//TODO
            if (w.GetFinalWeapon().rapid || w.GetFinalWeapon().shells || w.GetFinalWeapon().ap > 0) {
                weaphtml += "["
                weaphtml += " Jam " + w.GetJam();
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
            this.copy_text += weaphtml + "\n\t";
            weaphtml += "<br\>";
            this.weapon_cell.innerHTML += weaphtml;
        }
        this.copy_text += "\n";

        if (stats.warnings.length > 0) {
            this.copy_text += "Special Rules\n\t";
        }
        var warnhtml = "";
        for (let w of stats.warnings) {
            warnhtml += w.source + ":  " + w.warning + "<br/>";
            this.copy_text += w.source + ":  " + w.warning + "\n\t";
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

        this.UpdateStats();
        this.UpdateDerived();
    }
}