//TODO: Wing selection is screwy. Workaround: Set all to None and try again.
//TODO: Stabilizers doesn't disable "The Wings" when not tandem.
//TODO: Copy JSON to clipboard
//TODO: Paste JSON to page
//TODO: Connect links to Rules page
//TODO: Engine as Generator
//TODO: Add electrics as critical component
//TODO: Manually Variable Propeller Special Rule
//TODO: Weapons
//TODO: Handle attack bonus
//TODO: High Offset Radiator requires Parasol wing
//TODO: Evaporator Radiator requires Metal wing
//TODO: Center Pusher requires tail or extended driveshafts
const loadJSON = (path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback 
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};
const init = () => {
    loadJSON('/PlaneBuilder/parts.json', (response) => {
        // Parse JSON string into object
        let acft_data = window.localStorage.aircraft;
        let parts_JSON = JSON.parse(response);
        loadJSON('/PlaneBuilder/engines.json', (response2) => {
            engine_json = JSON.parse(response2);
            aircraft_model = new Aircraft(parts_JSON, true);
            aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);
            if (acft_data)
                aircraft_model.fromJSON(JSON.parse(acft_data));
        });
    });
};
window.onload = init;
var engine_json;
var aircraft_model;
var aircraft_display;
var internal_id = 0;
// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"), url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}
function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
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
function GenerateID() {
    internal_id++;
    return "internal_id_" + internal_id.toString();
}
function CreateFlexSection(elem) {
    var fs = {
        div0: document.createElement("DIV"), div1: document.createElement("DIV"),
        div2: document.createElement("DIV")
    };
    fs.div0.classList.add("flex-container");
    fs.div1.classList.add("flex-container");
    fs.div2.classList.add("flex-container");
    fs.div0.appendChild(fs.div1);
    fs.div0.appendChild(fs.div2);
    elem.appendChild(fs.div0);
    return fs;
}
function CreateTH(row, content) {
    var th = document.createElement("TH");
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}
function CreateInput(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "number");
    elem.min = "0";
    elem.step = "1";
    elem.valueAsNumber = 0;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function FlexInput(txt, inp, fs) {
    var lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "number");
    inp.min = "0";
    inp.step = "1";
    inp.valueAsNumber = 0;
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexSelect(txt, sel, fs) {
    var lbl = document.createElement("LABEL");
    sel.id = GenerateID();
    lbl.htmlFor = sel.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    lbl.classList.add("flex-item");
    sel.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(sel);
}
function CreateSpace(elem) {
    var span = document.createElement("SPAN");
    span.innerHTML = "&nbsp;";
    elem.appendChild(span);
}
function CreateCheckbox(txt, elem, table, br = true) {
    var span = document.createElement("SPAN");
    var txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "checkbox");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function FlexCheckbox(txt, inp, fs) {
    var lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "checkbox");
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexLabel(txt, div1) {
    var lbl = document.createElement("LABEL");
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
}
function Blink(elem) {
    elem.classList.toggle("changed", false);
    elem.offsetHeight;
    elem.classList.toggle("changed");
}
function BlinkIfChanged(elem, str) {
    if (elem.innerText != str) {
        Blink(elem);
    }
    elem.innerText = str;
}
//Handles Mass, Drag, Control, Escape, Flight Stress, Visibility
function Effects2String(input) {
    if (!(input instanceof Stats))
        var stats = new Stats(input);
    else
        var stats = input;
    function n2s(num) {
        let str = "";
        if (Math.sign(num) > 0) {
            str += "+";
        }
        str += num.toString();
        return str;
    }
    function print(num, txt) {
        let res = "";
        if (num != 0)
            res += n2s(num) + txt;
        return res;
    }
    var ret = "";
    ret += print(stats.liftbleed, " Lift Bleed ");
    ret += print(stats.mass, " Mass ");
    ret += print(stats.drag, " Drag ");
    ret += print(stats.control, " Control ");
    ret += print(stats.reqsections, " Required Sections ");
    ret += print(stats.visibility, " Visibility ");
    ret += print(stats.flightstress, " Flight Stress ");
    ret += print(stats.escape, " Escape ");
    ret += print(stats.pitchstab, " Pitch Stability ");
    ret += print(stats.latstab, " Lateral Stabiilty ");
    ret += print(stats.cooling, " Cooling ");
    ret += print(stats.reliability, " Reliability ");
    ret += print(stats.power, " Power ");
    ret += print(stats.fuelconsumption, " Fuel Consumption ");
    ret += print(stats.maxstrain, " Max Strain ");
    ret += print(stats.structure, " Structure ");
    ret += print(stats.wingarea, " Wing Area ");
    ret += print(stats.toughness, " Toughness ");
    if (ret.length > 0)
        ret += "<br/>";
    return ret;
}
class Stats {
    constructor(js) {
        this.liftbleed = 0;
        this.wetmass = 0;
        this.mass = 0;
        this.drag = 0;
        this.control = 0;
        this.cost = 0;
        this.reqsections = 0;
        this.visibility = 0;
        this.flightstress = 0;
        this.escape = 0;
        this.pitchstab = 0;
        this.latstab = 0;
        this.cooling = 0;
        this.reliability = 0;
        this.power = 0;
        this.fuelconsumption = 0;
        this.maxstrain = 0;
        this.structure = 0;
        this.pitchspeed = 0;
        this.pitchboost = 0;
        this.wingarea = 0;
        this.toughness = 0;
        this.upkeep = 0;
        this.crashsafety = 0;
        this.bomb_mass = 0;
        this.fuel = 0;
        this.charge = 0;
        this.warnings = [];
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return {
            liftbleed: this.liftbleed,
            wetmass: this.wetmass,
            mass: this.mass,
            drag: this.drag,
            control: this.control,
            cost: this.cost,
            reqsections: this.reqsections,
            visibility: this.visibility,
            flightstress: this.flightstress,
            escape: this.escape,
            pitchstab: this.pitchstab,
            latstab: this.latstab,
            cooling: this.cooling,
            reliability: this.reliability,
            power: this.power,
            fuelconsumption: this.fuelconsumption,
            maxstrain: this.maxstrain,
            structure: this.structure,
            pitchboost: this.pitchboost,
            pitchspeed: this.pitchspeed,
            wingarea: this.wingarea,
            toughness: this.toughness,
            upkeep: this.upkeep,
            crashsafety: this.crashsafety,
            bomb_mass: this.bomb_mass,
            fuel: this.fuel,
            charge: this.charge,
        };
    }
    fromJSON(js) {
        if (js["liftbleed"])
            this.liftbleed = js["liftbleed"];
        if (js["wetmass"])
            this.wetmass = js["wetmass"];
        if (js["mass"])
            this.mass = js["mass"];
        if (js["drag"])
            this.drag = js["drag"];
        if (js["control"])
            this.control = js["control"];
        if (js["cost"])
            this.cost = js["cost"];
        if (js["reqsections"])
            this.reqsections = js["reqsections"];
        if (js["visibility"])
            this.visibility = js["visibility"];
        if (js["flightstress"])
            this.flightstress = js["flightstress"];
        if (js["escape"])
            this.escape = js["escape"];
        if (js["pitchstab"])
            this.pitchstab = js["pitchstab"];
        if (js["latstab"])
            this.latstab = js["latstab"];
        if (js["cooling"])
            this.cooling = js["cooling"];
        if (js["reliability"])
            this.reliability = js["reliability"];
        if (js["power"])
            this.power = js["power"];
        if (js["fuelconsumption"])
            this.fuelconsumption = js["fuelconsumption"];
        if (js["maxstrain"])
            this.maxstrain = js["maxstrain"];
        if (js["structure"])
            this.structure = js["structure"];
        if (js["pitchspeed"])
            this.pitchspeed = js["pitchspeed"];
        if (js["pitchboost"])
            this.pitchboost = js["pitchboost"];
        if (js["wingarea"])
            this.wingarea = js["wingarea"];
        if (js["toughness"])
            this.toughness = js["toughness"];
        if (js["upkeep"])
            this.upkeep = js["upkeep"];
        if (js["crashsafety"])
            this.crashsafety = js["crashsafety"];
        if (js["bomb_mass"])
            this.bomb_mass = js["bomb_mass"];
        if (js["fuel"])
            this.fuel = js["fuel"];
        if (js["charge"])
            this.charge = js["charge"];
        if (js["warning"])
            this.warnings.push({ source: js["name"], warning: js["warning"] });
    }
    Add(other) {
        var res = new Stats();
        res.liftbleed = this.liftbleed + other.liftbleed;
        res.wetmass = this.wetmass + other.wetmass;
        res.mass = this.mass + other.mass;
        res.drag = this.drag + other.drag;
        res.control = this.control + other.control;
        res.cost = this.cost + other.cost;
        res.reqsections = this.reqsections + other.reqsections;
        res.visibility = this.visibility + other.visibility;
        res.flightstress = this.flightstress + other.flightstress;
        res.escape = this.escape + other.escape;
        res.pitchstab = this.pitchstab + other.pitchstab;
        res.latstab = this.latstab + other.latstab;
        res.cooling = this.cooling + other.cooling;
        res.reliability = this.reliability + other.reliability;
        res.power = this.power + other.power;
        res.fuelconsumption = this.fuelconsumption + other.fuelconsumption;
        res.maxstrain = this.maxstrain + other.maxstrain;
        res.structure = this.structure + other.structure;
        res.pitchboost = this.pitchboost + other.pitchboost;
        res.pitchspeed = this.pitchspeed + other.pitchspeed;
        res.wingarea = this.wingarea + other.wingarea;
        res.toughness = this.toughness + other.toughness;
        res.upkeep = this.upkeep + other.upkeep;
        res.crashsafety = this.crashsafety + other.crashsafety;
        res.bomb_mass = this.bomb_mass + other.bomb_mass;
        res.fuel = this.fuel + other.fuel;
        res.charge = this.charge + other.charge;
        res.warnings = this.MergeWarnings(other.warnings);
        return res;
    }
    MergeWarnings(owarn) {
        var newList = [];
        for (let w2 of this.warnings) {
            newList.push(w2);
        }
        for (let w of owarn) {
            let dup = false;
            for (let w2 of this.warnings) {
                if (w.source == w2.source && w.warning == w2.warning)
                    dup = true;
            }
            if (!dup)
                newList.push(w);
        }
        return newList;
    }
    Multiply(other) {
        var res = new Stats();
        res.liftbleed = this.liftbleed * other;
        res.wetmass = this.wetmass * other;
        res.mass = this.mass * other;
        res.drag = this.drag * other;
        res.control = this.control * other;
        res.cost = this.cost * other;
        res.reqsections = this.reqsections * other;
        res.visibility = this.visibility * other;
        res.flightstress = this.flightstress * other;
        res.escape = this.escape * other;
        res.pitchstab = this.pitchstab * other;
        res.latstab = this.latstab * other;
        res.cooling = this.cooling * other;
        res.reliability = this.reliability * other;
        res.power = this.power * other;
        res.fuelconsumption = this.fuelconsumption * other;
        res.maxstrain = this.maxstrain * other;
        res.structure = this.structure * other;
        res.pitchboost = this.pitchboost * other;
        res.pitchspeed = this.pitchspeed * other;
        res.wingarea = this.wingarea * other;
        res.toughness = this.toughness * other;
        res.upkeep = this.upkeep * other;
        res.crashsafety = this.crashsafety * other;
        res.bomb_mass = this.bomb_mass * other;
        res.fuel = this.fuel * other;
        res.charge = this.charge * other;
        if (other != 0)
            res.warnings = this.warnings;
        return res;
    }
    Equal(other) {
        return this.liftbleed == other.liftbleed
            && this.wetmass == other.wetmass
            && this.mass == other.mass
            && this.drag == other.drag
            && this.control == other.control
            && this.cost == other.cost
            && this.reqsections == other.reqsections
            && this.visibility == other.visibility
            && this.flightstress == other.flightstress
            && this.escape == other.escape
            && this.pitchstab == other.pitchstab
            && this.latstab == other.latstab
            && this.cooling == other.cooling
            && this.reliability == other.reliability
            && this.power == other.power
            && this.fuelconsumption == other.fuelconsumption
            && this.maxstrain == other.maxstrain
            && this.structure == other.structure
            && this.pitchspeed == other.pitchspeed
            && this.pitchboost == other.pitchboost
            && this.wingarea == other.wingarea
            && this.toughness == other.toughness
            && this.upkeep == other.upkeep
            && this.crashsafety == other.crashsafety
            && this.bomb_mass == other.bomb_mass
            && this.fuel == other.fuel
            && this.charge == other.charge;
    }
    Round() {
        this.liftbleed = Math.floor(this.liftbleed);
        this.wetmass = Math.floor(this.wetmass);
        this.mass = Math.floor(this.mass);
        this.drag = Math.floor(this.drag);
        this.control = Math.floor(this.control);
        this.cost = Math.floor(this.cost);
        this.reqsections = Math.floor(this.reqsections);
        this.visibility = Math.floor(this.visibility);
        this.flightstress = Math.floor(this.flightstress);
        this.escape = Math.floor(this.escape);
        this.pitchstab = Math.floor(this.pitchstab);
        this.latstab = Math.floor(this.latstab);
        this.cooling = Math.floor(this.cooling);
        this.reliability = Math.floor(this.reliability);
        this.power = Math.floor(this.power);
        this.fuelconsumption = Math.floor(this.fuelconsumption);
        this.maxstrain = Math.floor(this.maxstrain);
        this.structure = Math.floor(this.structure);
        this.pitchspeed = Math.floor(this.pitchspeed);
        this.pitchboost = Math.floor(this.pitchboost);
        this.wingarea = Math.floor(this.wingarea);
        this.toughness = Math.floor(this.toughness);
        this.upkeep = Math.floor(this.upkeep);
        this.crashsafety = Math.floor(this.crashsafety);
        this.bomb_mass = Math.floor(this.bomb_mass);
        this.fuel = Math.floor(this.fuel);
        this.charge = Math.floor(this.charge);
    }
    Clone() {
        return this.Add(new Stats());
    }
}
class Part {
}
class Display {
}
class Aircraft_HTML extends Display {
    constructor(js, aircraft) {
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
        var tbl = document.getElementById("tbl_stats");
        this.InitStats(tbl);
        var tbl2 = document.getElementById("tbl_derived");
        this.InitDerived(tbl2);
        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });
        this.UpdateDisplay();
        var save_button = document.getElementById("acft_save");
        save_button.onclick = () => {
            download(JSON.stringify(this.acft.toJSON()), this.acft.name + "_" + this.acft.GetVersion() + ".json", "json");
        };
        var load_button = document.getElementById("acft_load");
        load_button.multiple = false;
        load_button.accept = "application/JSON";
        load_button.onchange = (evt) => {
            if (load_button.files.length == 0)
                return;
            var file = load_button.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                var str = reader.result;
                this.acft.fromJSON(JSON.parse(str));
            };
            reader.readAsText(file);
            load_button.value = "";
        };
        var copy_button = document.getElementById("stats_copy");
        copy_button.onclick = () => { copyStringToClipboard(this.copy_text); };
    }
    InitStats(tbl) {
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
        CreateTH(row, "Max Strain");
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
    InitDerived(tbl) {
        var row0 = tbl.insertRow();
        var name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 5;
        this.name_inp = document.createElement("INPUT");
        this.name_inp.defaultValue = "Aircraft Name";
        this.name_inp.onchange = () => { this.acft.name = this.name_inp.value; };
        name_cell.appendChild(this.name_inp);
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
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
        var half = tbl.insertRow();
        CreateTH(half, "Empty Mass");
        this.ts_empty = half.insertCell();
        this.ss_empty = half.insertCell();
        this.hand_empty = half.insertCell();
        this.boost_empty = half.insertCell();
        this.vital_components = half.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;
        var half = tbl.insertRow();
        CreateTH(half, "Half Mass");
        this.ts_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.boost_half = half.insertCell();
        var full = tbl.insertRow();
        CreateTH(full, "Full Mass");
        this.ts_full = full.insertCell();
        this.ss_full = full.insertCell();
        this.hand_full = full.insertCell();
        this.boost_full = full.insertCell();
        this.bomb_row1 = tbl.insertRow();
        CreateTH(this.bomb_row1, "Half Mass with Bombs");
        this.ts_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.bomb_row2 = tbl.insertRow();
        CreateTH(this.bomb_row2, "Full Mass with Bombs");
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.boost_fullwB = this.bomb_row2.insertCell();
        var row7 = tbl.insertRow();
        CreateTH(row7, "Propulsion").colSpan = 2;
        CreateTH(row7, "Aerodynamics").colSpan = 2;
        CreateTH(row7, "Survivability").colSpan = 2;
        CreateTH(row7, "Propulsion").colSpan = 2;
        var row8 = tbl.insertRow();
        CreateTH(row8, "Dropoff");
        this.dropoff_cell = row8.insertCell();
        CreateTH(row8, "Stability");
        this.stability_cell = row8.insertCell();
        CreateTH(row8, "Reliability");
        this.reliability_cell = row8.insertCell();
        CreateTH(row8, "Flight Stress");
        this.flightstress_cell = row8.insertCell();
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
        CreateTH(row11, "Cruise Range");
        this.cruiserange_cell = row11.insertCell();
        CreateTH(row11, "Landing Gear");
        this.landing_cell = row11.insertCell();
        CreateTH(row11, "Escape");
        this.escape_cell = row11.insertCell();
        CreateTH(row11, "Communications");
        this.communications_cell = row11.insertCell();
        var row12 = tbl.insertRow();
        CreateTH(row12, "Cruise Range with Bombs");
        this.cruiserangewbomb_cell = row12.insertCell();
        CreateTH(row12, "Flight Ceiling");
        this.maxalt_cell = row12.insertCell();
        CreateTH(row12, "Crash Safety");
        this.crashsafety_cell = row12.insertCell();
        CreateTH(row12, "Electrics");
        this.electric_cell = row12.insertCell();
        CreateTH(tbl.insertRow(), "Special Rules").colSpan = 8;
        this.warning_cell = tbl.insertRow().insertCell();
        this.warning_cell.colSpan = 8;
    }
    UpdateStats() {
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
    UpdateDerived() {
        var stats = this.acft.GetStats();
        var derived = this.acft.GetDerivedStats();
        if (this.acft.name)
            this.name_inp.value = this.acft.name;
        this.copy_text = this.acft.name + "\n";
        this.version_cell.innerText = this.acft.GetVersion();
        this.copy_text += "Version " + this.acft.GetVersion() + "\n";
        this.cost_cell.innerText = stats.cost.toString() + "þ";
        this.copy_text += "Cost " + stats.cost.toString() + "þ\n";
        this.copy_text += "\n";
        this.copy_text += "Mass\t\t\tTop Speed\tStall Speed\tHandling\tBoost\n";
        //Empty
        this.ts_empty.innerText = Math.floor(derived.MaxSpeedEmpty).toString();
        this.ss_empty.innerText = derived.StallSpeedEmpty.toString();
        this.hand_empty.innerText = derived.HandlingEmpty.toString();
        this.boost_empty.innerText = derived.BoostEmpty.toString();
        this.copy_text += "Empty Mass\t\t"
            + this.ts_empty.innerText + "\t\t"
            + this.ss_empty.innerText + "\t\t"
            + this.hand_empty.innerText + "\t\t"
            + this.boost_empty.innerText + "\n";
        //Half
        this.ts_half.innerText = Math.floor((derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.innerText = Math.floor((derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.innerText = Math.floor((derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.innerText = Math.floor((derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.copy_text += "Half Mass\t\t"
            + this.ts_half.innerText + "\t\t"
            + this.ss_half.innerText + "\t\t"
            + this.hand_half.innerText + "\t\t"
            + this.boost_half.innerText + "\n";
        //Full
        this.ts_full.innerText = Math.floor(derived.MaxSpeedFull).toString();
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
            //Half
            this.ts_halfwB.innerText = Math.floor((derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.innerText = Math.floor((derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.innerText = Math.floor((derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.innerText = Math.floor((derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.copy_text += "Half Mass with Bombs\t"
                + this.ts_halfwB.innerText + "\t\t"
                + this.ss_halfwB.innerText + "\t\t"
                + this.hand_halfwB.innerText + "\t\t"
                + this.boost_halfwB.innerText + "\n";
            //Full
            this.ts_fullwB.innerText = derived.MaxSpeedwBombs.toString();
            this.ss_fullwB.innerText = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.innerText = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.innerText = derived.BoostFullwBombs.toString();
            this.copy_text += "Full Mass with Bombs\t"
                + this.ts_fullwB.innerText + "\t\t"
                + this.ss_fullwB.innerText + "\t\t"
                + this.hand_fullwB.innerText + "\t\t"
                + this.boost_fullwB.innerText + "\n";
            this.copy_text += "\n";
        }
        else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
        }
        this.dropoff_cell.innerText = derived.Dropoff.toString();
        this.overspeed_cell.innerText = derived.Overspeed.toString();
        this.maxfuel_cell.innerText = (Math.round(derived.FuelUses * 10) / 10).toString();
        this.cruiserange_cell.innerText = Math.round(derived.CruiseRange).toString();
        this.cruiserangewbomb_cell.innerText = Math.round(derived.CruiseRangewBombs).toString();
        this.copy_text += "Propulsion\n\t"
            + "Dropoff\t" + this.dropoff_cell.innerText + "\n\t"
            + "Overspeed\t" + this.overspeed_cell.innerText + "\n\t"
            + "Fuel Uses\t" + this.maxfuel_cell.innerText + "\n\t"
            + "Cruise Range\t" + this.cruiserange_cell.innerText + "\n\t"
            + "Cruise Range with Bombs\t" + this.cruiserangewbomb_cell.innerText + "\n";
        this.copy_text += "\n";
        this.stability_cell.innerText = derived.Stabiilty.toString();
        this.eloss_cell.innerText = derived.EnergyLoss.toString();
        this.turnbleed_cell.innerText = derived.TurnBleed.toString();
        this.landing_cell.innerText = this.acft.GetGearName();
        this.maxalt_cell.innerText = this.acft.GetMaxAltitude().toString();
        this.copy_text += "Aerodynamics\n\t"
            + "Stability\t" + this.stability_cell.innerText + "\n\t"
            + "Energy Loss\t" + this.eloss_cell.innerText + "\n\t"
            + "Turn Bleed\t" + this.turnbleed_cell.innerText + "\n\t"
            + "Landing Gear\t" + this.landing_cell.innerText + "\n\t"
            + "Flight Ceiling\t" + this.maxalt_cell.innerText + "\n";
        this.copy_text += "\n";
        this.reliability_cell.innerText = this.acft.GetReliabilityList().toString();
        this.toughness_cell.innerText = derived.Toughness.toString();
        this.mxstrain_cell.innerText = derived.MaxStrain.toString();
        this.escape_cell.innerText = this.acft.GetEscapeList().toString();
        this.crashsafety_cell.innerText = stats.crashsafety.toString();
        this.copy_text += "Survivability\n\t"
            + "Reliability\t" + this.reliability_cell.innerText + "\n\t"
            + "Toughness\t" + this.toughness_cell.innerText + "\n\t"
            + "Max Strain\t" + this.mxstrain_cell.innerText + "\n\t"
            + "Escape\t" + this.escape_cell.innerText + "\n\t"
            + "Crash Safety\t" + this.crashsafety_cell.innerText + "\n";
        this.copy_text += "\n";
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
        if (derived.FuelUses > 0) {
            vital += "<br/>Fuel Tanks";
            this.copy_text += "Fuel Tanks\n\t";
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfEngines(); i++) {
            vital += "<br/>Engine #" + (i + 1).toString();
            this.copy_text += "Engine #" + (i + 1).toString() + "\n\t";
        }
        for (let i = 0; i < this.acft.GetEngines().GetNumberOfRadiators(); i++) {
            vital += "<br/>Radiator #" + (i + 1).toString();
            this.copy_text += "Radiator #" + (i + 1).toString() + "\n\t";
        }
        if (this.acft.GetEngines().GetHasOilTank()) {
            vital += "<br/>Oil Tank";
            this.copy_text += "Oil Tank\n\t";
        }
        this.vital_components.innerHTML = vital;
        this.copy_text += "\n";
        if (stats.warnings.length > 0)
            this.copy_text += "Special Rules\n\t";
        var warnhtml = "";
        for (let w of stats.warnings) {
            warnhtml += w.source + ":  " + w.warning + "<br/>";
            this.copy_text += w.source + ":  " + w.warning + "\n\t";
        }
        this.warning_cell.innerHTML = warnhtml;
    }
    UpdateDisplay() {
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
        this.UpdateStats();
        this.UpdateDerived();
    }
}
class Aircraft {
    constructor(js, storage) {
        this.use_storage = false;
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers();
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.wings.SetCalculateStats(() => { this.CalculateStats(); });
        this.stabilizers.SetCalculateStats(() => { this.CalculateStats(); });
        this.controlsurfaces.SetCalculateStats(() => { this.CalculateStats(); });
        this.reinforcements.SetCalculateStats(() => { this.CalculateStats(); });
        this.fuel.SetCalculateStats(() => { this.CalculateStats(); });
        this.munitions.SetCalculateStats(() => { this.CalculateStats(); });
        this.cargo.SetCalculateStats(() => { this.CalculateStats(); });
        this.gear.SetCalculateStats(() => { this.CalculateStats(); });
        this.accessories.SetCalculateStats(() => { this.CalculateStats(); });
        this.optimization.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
    }
    toJSON() {
        return {
            version: this.version,
            name: this.name,
            era: this.era.toJSON(),
            cockpits: this.cockpits.toJSON(),
            passengers: this.passengers.toJSON(),
            engines: this.engines.toJSON(),
            propeller: this.propeller.toJSON(),
            frames: this.frames.toJSON(),
            wings: this.wings.toJSON(),
            stabilizers: this.stabilizers.toJSON(),
            controlsurfaces: this.controlsurfaces.toJSON(),
            reinforcements: this.reinforcements.toJSON(),
            fuel: this.fuel.toJSON(),
            munitions: this.munitions.toJSON(),
            cargo: this.cargo.toJSON(),
            gear: this.gear.toJSON(),
            accessories: this.accessories.toJSON(),
            optimization: this.optimization.toJSON(),
        };
    }
    fromJSON(js) {
        console.log(js);
        console.log(js["version"]);
        if (this.version == js["version"]) {
            this.name = js["name"];
            this.era.fromJSON(js["era"]);
            this.cockpits.fromJSON(js["cockpits"]);
            this.passengers.fromJSON(js["passengers"]);
            this.engines.fromJSON(js["engines"]);
            this.propeller.fromJSON(js["propeller"]);
            this.frames.fromJSON(js["frames"]);
            this.wings.fromJSON(js["wings"]);
            this.stabilizers.fromJSON(js["stabilizers"]);
            this.controlsurfaces.fromJSON(js["controlsurfaces"]);
            this.reinforcements.fromJSON(js["reinforcements"]);
            this.fuel.fromJSON(js["fuel"]);
            this.munitions.fromJSON(js["munitions"]);
            this.cargo.fromJSON(js["cargo"]);
            this.gear.fromJSON(js["gear"]);
            this.accessories.fromJSON(js["accessories"]);
            this.optimization.fromJSON(js["optimization"]);
            this.CalculateStats();
        }
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());
        stats = stats.Add(this.engines.PartStats());
        this.propeller.SetHavePropeller(this.engines.GetHavePropeller());
        stats = stats.Add(this.propeller.PartStats());
        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        stats = stats.Add(this.frames.PartStats());
        this.wings.SetNumFrames(this.frames.GetNumFrames());
        stats = stats.Add(this.wings.PartStats());
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetWingArea(stats.wingarea);
        stats = stats.Add(this.stabilizers.PartStats());
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        stats = stats.Add(this.controlsurfaces.PartStats());
        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        stats = stats.Add(this.reinforcements.PartStats());
        this.cargo.SetSeats(this.passengers.GetBeds() + this.passengers.GetSeats());
        stats = stats.Add(this.cargo.PartStats());
        this.accessories.SetAcftPower(stats.power);
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        stats = stats.Add(this.accessories.PartStats());
        //Gear go last, because they need total mass.
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        stats = stats.Add(this.gear.PartStats());
        stats.toughness += Math.floor(Math.max(0, (stats.structure - stats.maxstrain) / 2) + stats.maxstrain / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;
            var derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);
            //Update Part Local stuff
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.FlightStress, this.stats.visibility);
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftStructure(stats.structure);
            if (this.DisplayCallback)
                this.DisplayCallback();
            if (this.use_storage)
                window.localStorage.aircraft = JSON.stringify(this);
        }
    }
    GetDerivedStats() {
        var DryMP = Math.floor(this.stats.mass / 5);
        var WetMP = Math.floor((this.stats.mass + this.stats.wetmass) / 5);
        var WetMPwBombs = Math.floor((this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        var DPEmpty = Math.floor((this.stats.drag + DryMP) / 5);
        var DPFull = Math.floor((this.stats.drag + WetMP) / 5);
        var DPwBombs = Math.floor((this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        var MaxSpeedEmpty = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9)));
        var MaxSpeedFull = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9)));
        var MaxSpeedwBombs = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9)));
        var StallSpeedEmpty = Math.floor(this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea));
        var StallSpeedFull = Math.floor(this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea));
        var StallSpeedFullwBombs = Math.floor(this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea));
        var Overspeed = this.engines.GetOverspeed();
        var BoostEmpty = Math.floor(this.stats.power / DryMP);
        var BoostFull = Math.floor(this.stats.power / WetMP);
        var BoostFullwBombs = Math.floor(this.stats.power / WetMPwBombs);
        var Dropoff = Math.floor(this.stats.pitchboost * MaxSpeedEmpty);
        var Stabiilty = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stabiilty += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stabiilty -= 2;
        var HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stabiilty > 10)
            HandlingEmpty = -99999;
        else if (Stabiilty == 10)
            HandlingEmpty -= 4;
        else if (Stabiilty > 6)
            HandlingEmpty -= 3;
        else if (Stabiilty > 3)
            HandlingEmpty -= 2;
        else if (Stabiilty > 0)
            HandlingEmpty -= 1;
        else if (Stabiilty == 0)
            HandlingEmpty += 0;
        else if (Stabiilty > -4)
            HandlingEmpty += 1;
        else if (Stabiilty > -7)
            HandlingEmpty += 2;
        else if (Stabiilty > -10)
            HandlingEmpty += 3;
        else if (Stabiilty == -10)
            HandlingEmpty += 4;
        else
            HandlingEmpty = -99999;
        var HandlingFull = HandlingEmpty + DryMP - WetMP;
        var HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;
        var ElevatorsEmpty = Math.max(1, Math.floor(HandlingEmpty / 10));
        var ElevatorsFull = Math.max(1, Math.floor(HandlingFull / 10));
        var ElevatorsFullwBombs = Math.max(1, Math.floor(HandlingFullwBombs / 10));
        var MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        var Toughness = this.stats.toughness;
        var Structure = this.stats.structure;
        var EnergyLoss = Math.ceil(DPEmpty / 6);
        var EnergyLosswBombs = EnergyLoss + 1;
        var TurnBleed = Math.ceil((StallSpeedEmpty + StallSpeedFull) / 12);
        var TurnBleedwBombs = TurnBleed + 1;
        var FuelUses = this.stats.fuel / this.stats.fuelconsumption;
        var CruiseRange = FuelUses / 3 * (MaxSpeedFull + MaxSpeedEmpty) / 2 * 10 * 0.7;
        var CruiseRangewBombs = FuelUses / 3 * MaxSpeedwBombs * 10 * 0.7;
        var FlightStress = this.stats.flightstress;
        if (Stabiilty > 3 || Stabiilty < -3)
            FlightStress++;
        FlightStress += Math.floor(DryMP / 10);
        return {
            DryMP: DryMP,
            WetMP: WetMP,
            WetMPwBombs: WetMPwBombs,
            DPEmpty: DPEmpty,
            DPFull: DPFull,
            DPwBombs: DPwBombs,
            MaxSpeedEmpty: MaxSpeedEmpty,
            MaxSpeedFull: MaxSpeedFull,
            MaxSpeedwBombs: MaxSpeedwBombs,
            StallSpeedEmpty: StallSpeedEmpty,
            StallSpeedFull: StallSpeedFull,
            StallSpeedFullwBombs: StallSpeedFullwBombs,
            Overspeed: Overspeed,
            BoostEmpty: BoostEmpty,
            BoostFull: BoostFull,
            BoostFullwBombs: BoostFullwBombs,
            Dropoff: Dropoff,
            Stabiilty: Stabiilty,
            HandlingEmpty: HandlingEmpty,
            HandlingFull: HandlingFull,
            HandlingFullwBombs: HandlingFullwBombs,
            ElevatorsEmpty: ElevatorsEmpty,
            ElevatorsFull: ElevatorsFull,
            ElevatorsFullwBombs: ElevatorsFullwBombs,
            MaxStrain: MaxStrain,
            Toughness: Toughness,
            Structure: Structure,
            EnergyLoss: EnergyLoss,
            EnergyLosswBombs: EnergyLosswBombs,
            TurnBleed: TurnBleed,
            TurnBleedwBombs: TurnBleedwBombs,
            FuelUses: FuelUses,
            CruiseRange: CruiseRange,
            CruiseRangewBombs: CruiseRangewBombs,
            FlightStress: FlightStress,
        };
    }
    GetVersion() {
        return this.version;
    }
    GetCommunicationName() {
        return this.accessories.GetCommunicationName();
    }
    GetAttackList() {
        return this.cockpits.GetAttackList();
    }
    GetVisibilityList() {
        return this.cockpits.GetVisibilityList();
    }
    GetStressList() {
        return this.cockpits.GetStressList();
    }
    GetEscapeList() {
        return this.cockpits.GetEscapeList();
    }
    GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }
    GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }
    GetGearName() {
        return this.gear.GetGearName();
    }
    GetEra() {
        return this.era;
    }
    GetCockpits() {
        return this.cockpits;
    }
    GetPassengers() {
        return this.passengers;
    }
    GetEngines() {
        return this.engines;
    }
    GetPropeller() {
        return this.propeller;
    }
    GetFrames() {
        return this.frames;
    }
    GetWings() {
        return this.wings;
    }
    GetStabilizers() {
        return this.stabilizers;
    }
    GetControlSurfaces() {
        return this.controlsurfaces;
    }
    GetReinforcements() {
        return this.reinforcements;
    }
    GetFuel() {
        return this.fuel;
    }
    GetMunitions() {
        return this.munitions;
    }
    GetCargoAndPassengers() {
        return this.cargo;
    }
    GetLandingGear() {
        return this.gear;
    }
    GetAccessories() {
        return this.accessories;
    }
    GetOptimization() {
        return this.optimization;
    }
    GetStats() {
        return this.stats;
    }
}
class Era_HTML extends Display {
    constructor(m) {
        super();
        this.model = m;
        //Get used elements
        this.select = document.getElementById("select_era");
        this.bleed = document.getElementById("liftbleed_era");
        this.select.required = true;
        //When selection changes, change value and RecalculateTotals
        this.select.onchange = () => {
            this.model.SetSelected(this.select.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.select.add(opt);
        }
    }
    UpdateDisplay() {
        this.select.selectedIndex = this.model.GetSelected();
        BlinkIfChanged(this.bleed, this.model.GetLiftBleed().toString());
    }
}
class Era extends Part {
    constructor(js) {
        super();
        this.selected = 0;
        this.vals = [];
        for (let elem of js["options"]) {
            var opt = { name: elem["name"], value: parseInt(elem["liftbleed"]) };
            this.vals.push(opt);
        }
    }
    toJSON() {
        return {
            selected: this.selected
        };
    }
    fromJSON(js) {
        this.selected = js["selected"];
    }
    GetSelected() {
        return this.selected;
    }
    SetSelected(index) {
        this.selected = index;
        this.CalculateStats();
    }
    GetEraOptions() {
        return this.vals;
    }
    GetLiftBleed() {
        return this.vals[this.selected].value;
    }
    PartStats() {
        var s = new Stats();
        s.liftbleed = this.GetLiftBleed();
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Cockpits_HTML extends Display {
    constructor(cockpits) {
        super();
        this.cockpits = cockpits;
        this.tbl = document.getElementById("table_cockpit");
        this.counter = document.getElementById("num_cockpits");
        this.positions = [];
        this.counter.onchange = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
    }
    CounterChange() {
        while (this.positions.length > this.counter.valueAsNumber) {
            this.RemoveCockpit();
        }
        while (this.positions.length < this.counter.valueAsNumber) {
            this.AddCockpit(this.positions.length);
        }
    }
    AddCockpit(num) {
        var row = this.tbl.insertRow();
        var cp = new Cockpit_HTML(row, this.cockpits.GetCockpit(num));
        this.positions.push(cp);
    }
    RemoveCockpit() {
        this.positions.pop();
        this.tbl.deleteRow(this.tbl.rows.length - 1);
    }
    UpdateDisplay() {
        this.counter.valueAsNumber = this.cockpits.GetNumberOfCockpits();
        this.CounterChange();
        for (let i = 0; i < this.positions.length; i++) {
            let pos = this.positions[i];
            pos.UpdateCockpit(this.cockpits.GetCockpit(i));
            pos.UpdateDisplay();
        }
    }
}
class Cockpits extends Part {
    constructor(js) {
        super();
        this.positions = [];
        this.types = [];
        //Add all the cockpit types
        for (let elem of js["options"]) {
            let opt = { name: elem["name"], stats: new Stats(elem) };
            this.types.push(opt);
        }
        this.upgrades = [];
        //Add all the upgrades
        for (let elem of js["upgrades"]) {
            let upg = { name: elem["name"], stats: new Stats(elem) };
            this.upgrades.push(upg);
        }
        this.safety = [];
        //Add all the safety
        for (let elem of js["safety"]) {
            let sft = { name: elem["name"], stats: new Stats(elem) };
            this.safety.push(sft);
        }
        this.gunsights = [];
        //Add all the gunsights
        for (let elem of js["gunsights"]) {
            let gun = { name: elem["name"], stats: new Stats(elem) };
            this.gunsights.push(gun);
        }
    }
    toJSON() {
        var lst = [];
        for (let cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }
    fromJSON(js) {
        this.positions = [];
        for (let elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.fromJSON(elem);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    GetAttackList() {
        //TODO: Attack
        var lst = [];
        for (let c of this.positions) {
            lst.push(0);
        }
        return lst;
    }
    GetVisibilityList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetVisibility());
        }
        return lst;
    }
    GetStressList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetFlightStress());
        }
        return lst;
    }
    GetEscapeList() {
        var lst = [];
        for (let p of this.positions) {
            lst.push(p.GetEscape());
        }
        return lst;
    }
    SetNumberOfCockpits(num) {
        if (num != num)
            num = 1;
        num = Math.floor(num);
        while (this.positions.length > num) {
            this.positions.pop();
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
        this.CalculateStats();
    }
    GetNumberOfCockpits() {
        return this.positions.length;
    }
    GetCockpit(index) {
        return this.positions[index];
    }
    PartStats() {
        var s = new Stats();
        for (let cp of this.positions) {
            s = s.Add(cp.PartStats());
        }
        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0;
        s.flightstress = 0;
        s.visibility = 0;
        return s;
    }
    UpdateCrewStats(escape, flightstress, visibility) {
        for (let cp of this.positions) {
            cp.CrewUpdate(escape, flightstress, visibility);
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Cockpit_HTML extends Display {
    constructor(r, cp) {
        super();
        this.row = r;
        this.cockpit = cp;
        this.upg_chbxs = [];
        this.sft_chbxs = [];
        this.gun_chbxs = [];
        var option = this.row.insertCell();
        var upgrades = this.row.insertCell();
        var safety = this.row.insertCell();
        var gunsights = this.row.insertCell();
        var stat_cell = this.row.insertCell();
        var tbl = document.createElement("TABLE");
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Crash Safety");
        var c2_row = tbl.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_rseq = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, "Flight Stress");
        CreateTH(h3_row, "Escape");
        CreateTH(h3_row, "Visibility");
        var c3_row = tbl.insertRow();
        this.d_strs = c3_row.insertCell();
        this.d_escp = c3_row.insertCell();
        this.d_visi = c3_row.insertCell();
        stat_cell.appendChild(tbl);
        stat_cell.className = "inner_table";
        tbl.className = "inner_table";
        this.sel_type = document.createElement("SELECT");
        // Visibility and Stress and Escape are cockpit local
        // Mark in table for CSS
        this.d_strs.className = "part_local";
        this.d_visi.className = "part_local";
        this.d_escp.className = "part_local";
        //Add all the cockpit types to the select box
        for (let elem of cp.GetTypeList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.sel_type.add(opt);
        }
        option.appendChild(this.sel_type);
        var fs = CreateFlexSection(upgrades);
        //Add all the upgrades as checkboxes
        var upg_index = 0;
        for (let elem of cp.GetUpgradeList()) {
            let upg = document.createElement("INPUT");
            FlexCheckbox(elem.name, upg, fs);
            let local_index = upg_index;
            upg_index += 1;
            upg.onchange = () => { this.cockpit.SetUpgrade(local_index, upg.checked); };
            this.upg_chbxs.push(upg);
        }
        var fs = CreateFlexSection(safety);
        //Add all the safties as checkboxes
        var sft_index = 0;
        for (let elem of cp.GetSafetyList()) {
            let sft = document.createElement("INPUT");
            FlexCheckbox(elem.name, sft, fs);
            let local_index = sft_index;
            sft_index += 1;
            sft.onchange = () => { this.cockpit.SetSafety(local_index, sft.checked); };
            this.sft_chbxs.push(sft);
        }
        var fs = CreateFlexSection(gunsights);
        //Add all the safties as checkboxes
        var gun_index = 0;
        for (let elem of cp.GetGunsightList()) {
            let gun = document.createElement("INPUT");
            FlexCheckbox(elem.name, gun, fs);
            let local_index = gun_index;
            gun_index += 1;
            gun.onchange = () => { this.cockpit.SetGunsight(local_index, gun.checked); };
            this.gun_chbxs.push(gun);
        }
        //Set the change event, add the box, and execute it.
        this.sel_type.onchange = () => { this.cockpit.SetType(this.sel_type.selectedIndex); };
    }
    UpdateCockpit(cp) {
        this.cockpit = cp;
    }
    UpdateDisplay() {
        let stats = this.cockpit.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_rseq, stats.reqsections.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
        BlinkIfChanged(this.d_strs, this.cockpit.GetFlightStress().toString());
        BlinkIfChanged(this.d_escp, this.cockpit.GetEscape().toString());
        BlinkIfChanged(this.d_visi, this.cockpit.GetVisibility().toString());
        this.sel_type.selectedIndex = this.cockpit.GetType();
        var upgs = this.cockpit.GetSelectedUpgrades();
        for (let i = 0; i < this.upg_chbxs.length; i++) {
            this.upg_chbxs[i].checked = upgs[i];
        }
        var sfty = this.cockpit.GetSelectedSafety();
        for (let i = 0; i < this.sft_chbxs.length; i++) {
            this.sft_chbxs[i].checked = sfty[i];
        }
        var guns = this.cockpit.GetSelectedGunsights();
        for (let i = 0; i < this.gun_chbxs.length; i++) {
            this.gun_chbxs[i].checked = guns[i];
        }
    }
}
class Cockpit extends Part {
    constructor(tl, ul, sl, gl) {
        super();
        this.stats = new Stats();
        this.types = tl;
        this.upgrades = ul;
        this.safety = sl;
        this.gunsights = gl;
        this.selected_type = 0;
        this.selected_upgrades = [...Array(this.upgrades.length).fill(false)];
        this.selected_safety = [...Array(this.safety.length).fill(false)];
        this.selected_gunsights = [...Array(this.gunsights.length).fill(false)];
        this.total_stress = 0;
        this.total_escape = 0;
        this.total_visibility = 0;
    }
    toJSON() {
        return {
            type: this.selected_type,
            upgrades: this.selected_upgrades,
            safety: this.selected_safety,
        };
    }
    fromJSON(js) {
        this.selected_type = js["type"];
        this.selected_upgrades = js["upgrades"];
        this.selected_safety = js["safety"];
    }
    GetTypeList() {
        return this.types;
    }
    GetUpgradeList() {
        return this.upgrades;
    }
    GetSafetyList() {
        return this.safety;
    }
    GetGunsightList() {
        return this.gunsights;
    }
    GetType() {
        return this.selected_type;
    }
    SetType(index) {
        if (index >= this.types.length)
            throw "Selected type is not in range of actual types.";
        this.selected_type = index;
        this.CalculateStats();
    }
    GetSelectedUpgrades() {
        return this.selected_upgrades;
    }
    SetUpgrade(index, state) {
        if (index >= this.upgrades.length)
            throw "Selected type is not in range of actual upgrades.";
        this.selected_upgrades[index] = state;
        this.CalculateStats();
    }
    GetSelectedSafety() {
        return this.selected_safety;
    }
    SetSafety(index, state) {
        if (index >= this.safety.length)
            throw "Selected type is not in range of actual safties.";
        this.selected_safety[index] = state;
        this.CalculateStats();
    }
    GetSelectedGunsights() {
        return this.selected_gunsights;
    }
    SetGunsight(index, state) {
        if (index >= this.safety.length)
            throw "Selected type is not in range of actual gunsights.";
        this.selected_gunsights[index] = state;
        this.CalculateStats();
    }
    GetVisibility() {
        return this.total_visibility;
    }
    GetFlightStress() {
        return this.total_stress;
    }
    GetEscape() {
        return this.total_escape;
    }
    PartStats() {
        this.stats = new Stats();
        this.stats.reqsections = 1;
        this.stats = this.stats.Add(this.types[this.selected_type].stats);
        for (let i = 0; i < this.selected_upgrades.length; i++) {
            if (this.selected_upgrades[i])
                this.stats = this.stats.Add(this.upgrades[i].stats);
        }
        for (let i = 0; i < this.selected_safety.length; i++) {
            if (this.selected_safety[i])
                this.stats = this.stats.Add(this.safety[i].stats);
        }
        for (let i = 0; i < this.selected_gunsights.length; i++) {
            if (this.selected_gunsights[i])
                this.stats = this.stats.Add(this.gunsights[i].stats);
        }
        var stats = new Stats();
        stats = stats.Add(this.stats);
        return stats;
    }
    CrewUpdate(escape, flightstress, visibility) {
        this.total_escape = this.stats.escape + escape;
        this.total_stress = this.stats.flightstress + flightstress;
        this.total_stress = Math.max(0, this.total_stress);
        this.total_visibility = this.stats.visibility + visibility;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Passengers_HTML extends Display {
    constructor(pass) {
        super();
        this.pass = pass;
        this.nseats = document.getElementById("num_seats");
        this.nbeds = document.getElementById("num_beds");
        this.mass = document.getElementById("passenger_mass");
        this.reqseq = document.getElementById("passenger_req_seq");
        var upg_cell = document.getElementById("passenger_upg");
        this.connect = document.createElement("INPUT");
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox("Connectivity", this.connect, fs);
        this.connect.disabled = true;
        this.nseats.onchange = () => {
            this.pass.SetSeats(this.nseats.valueAsNumber);
        };
        this.nbeds.onchange = () => {
            this.pass.SetBeds(this.nbeds.valueAsNumber);
        };
        this.connect.onchange = () => {
            this.pass.SetConnected(this.connect.checked);
        };
    }
    UpdateDisplay() {
        var stats = this.pass.PartStats();
        this.nseats.valueAsNumber = this.pass.GetSeats();
        this.nbeds.valueAsNumber = this.pass.GetBeds();
        this.connect.checked = this.pass.GetConnected();
        this.connect.disabled = !this.pass.PossibleConnection();
        BlinkIfChanged(this.mass, stats.mass.toString());
        BlinkIfChanged(this.reqseq, stats.reqsections.toString());
    }
}
class Passengers extends Part {
    constructor(js) {
        super();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }
    toJSON() {
        return {
            seats: this.seats,
            beds: this.beds,
            connected: this.connected
        };
    }
    fromJSON(js) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }
    GetSeats() {
        return this.seats;
    }
    SetSeats(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.seats = num;
        this.CalculateStats();
    }
    GetBeds() {
        return this.beds;
    }
    SetBeds(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.beds = num;
        this.CalculateStats();
    }
    PossibleConnection() {
        return (this.seats + this.beds) > 0;
    }
    GetConnected() {
        return this.connected;
    }
    SetConnected(sel) {
        this.connected = sel;
        this.CalculateStats();
    }
    PartStats() {
        var s = new Stats();
        s.reqsections = 2 * Math.ceil((this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            s.mass = 1;
        }
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class EngineStats {
    constructor(js) {
        this.name = "";
        this.overspeed = 0;
        this.altitude = 0;
        this.torque = 0;
        this.rumble = 0;
        this.oiltank = false;
        this.pulsejet = false;
        this.stats = new Stats();
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return Object.assign({ name: this.name, overspeed: this.overspeed, altitude: this.altitude, torque: this.torque, rumble: this.rumble, oiltank: this.oiltank, pulsejet: this.pulsejet }, this.stats.toJSON());
    }
    fromJSON(js) {
        this.name = js["name"];
        this.overspeed = js["overspeed"];
        this.altitude = js["altitude"];
        this.torque = js["torque"];
        this.rumble = js["rumble"];
        this.oiltank = js["oiltank"];
        this.pulsejet = js["pulsejet"];
        this.stats = new Stats(js);
    }
    Add(other) {
        let res = new EngineStats();
        res.stats = this.stats.Add(other.stats);
        res.name = this.name;
        res.overspeed = this.overspeed + other.overspeed;
        res.altitude = this.altitude + other.altitude;
        res.torque = this.torque + other.torque;
        res.rumble = this.rumble + other.rumble;
        res.oiltank = this.oiltank || other.oiltank;
        res.pulsejet = this.pulsejet || other.pulsejet;
        return res;
    }
    Clone() {
        return this.Add(new EngineStats());
    }
    Equal(other) {
        return this.stats.Equal(other.stats)
            && this.overspeed == other.overspeed
            && this.altitude == other.altitude
            && this.torque == other.torque
            && this.rumble == other.rumble
            && this.oiltank == other.oiltank
            && this.pulsejet == other.pulsejet;
    }
}
class Engines_HTML extends Display {
    constructor(eng) {
        super();
        this.eng = eng;
        this.engines = [];
        this.radiators = [];
        this.tbl = document.getElementById("table_engine");
        this.tblR = document.getElementById("table_radiator");
        this.num_engines = document.getElementById("num_engines");
        this.num_engines.onchange = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfEngines();
        this.num_radiators = document.getElementById("num_radiators");
        this.num_radiators.onchange = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();
        this.is_asymmetric = document.getElementById("asymmetric");
        this.is_asymmetric.oninput = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }
    UpdateDisplay() {
        var num = this.eng.GetNumberOfEngines();
        if (num == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.num_engines.valueAsNumber = num;
        while (this.engines.length > num) {
            this.engines.pop();
            this.tbl.deleteRow(this.engines.length + 1);
        }
        while (this.engines.length < num) {
            let tst = this.eng.GetEngine(this.engines.length);
            let en = new Engine_HTML(tst, this.tbl.insertRow());
            this.engines.push(en);
        }
        for (let i = 0; i < num; i++) {
            this.engines[i].UpdateEngine(this.eng.GetEngine(i));
        }
        var rad = this.eng.GetNumberOfRadiators();
        this.num_radiators.valueAsNumber = rad;
        if (rad == 0) {
            this.tblR.style.display = "none";
            this.num_radiators.disabled = true;
        }
        else {
            this.tblR.style.display = "";
            this.num_radiators.disabled = false;
        }
        while (this.radiators.length > rad) {
            this.radiators.pop();
            this.tblR.deleteRow(this.radiators.length + 1);
        }
        while (this.radiators.length < rad) {
            let en = new Radiator_HTML(this.tblR.insertRow(), this.eng.GetRadiator(this.radiators.length));
            this.radiators.push(en);
        }
        for (let i = 0; i < rad; i++) {
            this.radiators[i].UpdateRadiator(this.eng.GetRadiator(i));
        }
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
        for (let elem of this.engines) {
            elem.UpdateDisplay();
        }
        for (let elem of this.radiators) {
            elem.UpdateDisplay();
        }
    }
}
class Engines extends Part {
    constructor(js) {
        super();
        this.engines = [];
        this.engine_stats = [];
        this.radiators = [];
        for (let elem of engine_json["engines"]) {
            this.engine_stats.push(new EngineStats(elem));
        }
        this.mount_list = [];
        for (let elem of js["mounts"]) {
            let mount = { name: elem["name"], stats: new Stats(elem), strainfactor: elem["strainfactor"], dragfactor: elem["dragfactor"], pp_type: elem["push-pull"], reqED: false, reqTail: false };
            if (elem["reqED"])
                mount.reqED = true;
            if (elem["reqTail"])
                mount.reqTail = true;
            this.mount_list.push(mount);
        }
        this.pp_list = [];
        for (let elem of js["push-pull"]) {
            this.pp_list[elem["type"]] = { name: elem["name"], powerfactor: elem["powerfactor"] };
        }
        this.is_asymmetric = false;
        this.r_type_list = [];
        for (let elem of js["radiator-type"]) {
            this.r_type_list.push({ name: elem["name"], stats: new Stats(elem), dragpercool: parseFloat(elem["dragpercool"]) });
        }
        this.r_mount_list = [];
        for (let elem of js["radiator-mount"]) {
            this.r_mount_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.r_coolant_list = [];
        for (let elem of js["radiator-coolant"]) {
            this.r_coolant_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cowl_list = [];
        for (let elem of js["cowling"]) {
            this.cowl_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                ed: elem["ed"],
                mpd: elem["mpd"],
                air: elem["air"],
                liquid: elem["liquid"],
                rotary: elem["rotary"],
            });
        }
    }
    toJSON() {
        var eng = [];
        for (let en of this.engines) {
            eng.push(en.toJSON());
        }
        var rad = [];
        for (let rd of this.radiators) {
            rad.push(rd.toJSON());
        }
        return {
            engines: eng,
            radiators: rad,
            is_asymmetric: this.is_asymmetric
        };
    }
    fromJSON(js) {
        this.radiators = [];
        for (let elem of js["radiators"]) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.fromJSON(elem);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        this.engines = [];
        for (let elem of js["engines"]) {
            let eng = new Engine(this.engine_stats, this.mount_list, this.pp_list, this.cowl_list);
            eng.fromJSON(elem);
            eng.SetCalculateStats(this.CalculateStats);
            this.engines.push(eng);
            eng.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.is_asymmetric = js["is_asymmetric"];
    }
    GetHasOilTank() {
        for (let e of this.engines) {
            if (e.GetCurrentStats().oiltank)
                return true;
        }
        return false;
    }
    GetReliabilityList() {
        var lst = [];
        for (let e of this.engines) {
            lst.push(e.GetReliability());
        }
        return lst;
    }
    GetMaxAltitude() {
        var m = 100;
        for (let e of this.engines) {
            m = Math.min(m, e.GetMaxAltitude());
        }
        return m;
    }
    SetNumberOfEngines(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.min(20, num);
        while (this.engines.length > num) {
            this.engines.pop();
        }
        while (this.engines.length < num) {
            let en = new Engine(this.engine_stats, this.mount_list, this.pp_list, this.cowl_list);
            en.SetCalculateStats(this.CalculateStats);
            this.engines.push(en);
            en.SetNumRadiators(this.GetNumberOfRadiators());
        }
        this.CalculateStats();
    }
    GetNumberOfEngines() {
        return this.engines.length;
    }
    GetEngine(num) {
        return this.engines[num];
    }
    GetRadiator(num) {
        return this.radiators[num];
    }
    SetNumberOfRadiators(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        while (this.radiators.length > num) {
            this.radiators.pop();
        }
        while (this.radiators.length < num) {
            let rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
            rad.SetCalculateStats(this.CalculateStats);
            this.radiators.push(rad);
        }
        for (let en of this.engines) {
            en.SetNumRadiators(num);
        }
        this.CalculateStats();
    }
    GetNumberOfRadiators() {
        if (this.radiators.length == 0 && this.NeedCooling())
            this.SetNumberOfRadiators(1);
        else if (this.radiators.length > 0 && !this.NeedCooling())
            this.SetNumberOfRadiators(0);
        return this.radiators.length;
    }
    NeedCooling() {
        var need = false;
        for (let elem of this.engines) {
            need = need || elem.NeedCooling();
        }
        return need;
    }
    UpdateReliability(stats) {
        for (let elem of this.engines) {
            let rad_stats = new Stats();
            if (elem.GetRadiator() < this.radiators.length && elem.GetRadiator() >= 0) {
                rad_stats = this.radiators[elem.GetRadiator()].PartStats();
            }
            elem.UpdateReliability(stats.reliability + rad_stats.reliability);
        }
    }
    SetAsymmetry(use) {
        this.is_asymmetric = use;
        this.CalculateStats();
    }
    GetAsymmetry() {
        return this.is_asymmetric;
    }
    GetHavePropeller() {
        for (let e of this.engines) {
            if (e.GetHavePropeller())
                return true;
        }
        return false;
    }
    GetOverspeed() {
        var os = 100;
        for (let e of this.engines)
            os = Math.min(os, e.GetOverspeed());
        return os;
    }
    PartStats() {
        var stats = new Stats;
        var needCool = [...Array(this.radiators.length).fill(0)];
        //Engine stuff
        for (let en of this.engines) {
            stats = stats.Add(en.PartStats());
            if (en.NeedCooling())
                needCool[en.GetRadiator()] += en.GetCooling();
        }
        //Upkeep calc only uses engine costs
        stats.upkeep = Math.floor(Math.min(stats.power / 10, stats.cost));
        //Include radiaators
        for (let i = 0; i < this.radiators.length; i++) {
            let rad = this.radiators[i];
            rad.SetNeedCool(needCool[i]);
            stats = stats.Add(rad.PartStats());
        }
        //Asymmetric planes
        if (this.is_asymmetric)
            stats.latstab -= 3;
        //Part local, gets handled in UpdateReliability
        stats.reliability = 0;
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetHasTractorNacelles() {
        let has = 0;
        for (let en of this.engines) {
            if (en.GetIsTractorNacelle())
                has++;
        }
        return has > 1;
    }
}
class Engine extends Part {
    constructor(el, ml, ppl, cl) {
        super();
        this.engine_list = el;
        this.selected_index = 0;
        this.etype_stats = this.engine_list[0].Clone();
        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;
        this.mount_list = ml;
        this.selected_mount = 0;
        this.mount_stats = this.mount_list[0].stats;
        this.pp_list = ppl;
        this.use_pp = false;
        this.torque_to_struct = false;
        this.cowl_list = cl;
        this.cowl_sel = 0;
        this.gp_count = 0;
        this.gpr_count = 0;
        this.total_reliability = 0;
        if (el.length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.selected_mount,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count,
            cowl_sel: this.cowl_sel,
        };
    }
    fromJSON(js) {
        this.etype_stats.fromJSON(js["selected_stats"]);
        this.cooling_count = js["cooling_count"];
        this.radiator_index = js["radiator_index"];
        this.selected_mount = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.cowl_sel = js["cowl_sel"];
        this.selected_index = -1;
        for (let i = 0; i < this.engine_list.length; i++) {
            if (this.etype_stats.Equal(this.engine_list[i])) {
                this.selected_index = i;
                break;
            }
        }
    }
    GetMaxAltitude() {
        return this.etype_stats.altitude;
    }
    SetSelectedIndex(num) {
        this.selected_index = num;
        this.etype_stats = this.engine_list[this.selected_index].Clone();
        if (num >= this.engine_list.length)
            throw "Index is out of range of engine_list.";
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.cooling_count = this.etype_stats.stats.cooling;
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return this.selected_index;
    }
    SetCustomStats(stats) {
        this.selected_index = -1;
        this.etype_stats = stats;
        this.PulseJetCheck();
        this.cooling_count = Math.min(this.cooling_count, this.etype_stats.stats.cooling);
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }
    GetCurrentStats() {
        let stats = new EngineStats();
        stats = stats.Add(this.etype_stats);
        return stats;
    }
    NeedCooling() {
        return this.cooling_count > 0;
    }
    WarnCoolingReliability() {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }
    SetCooling(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.cooling_count = num;
        this.CalculateStats();
    }
    GetCooling() {
        return this.cooling_count;
    }
    SetNumRadiators(num) {
        this.num_radiators = num;
        if (this.radiator_index >= num)
            this.radiator_index = num - 1;
        if (this.radiator_index < 0 && num > 0)
            this.radiator_index = 0;
    }
    GetNumRadiators() {
        return this.num_radiators;
    }
    SetRadiator(num) {
        this.radiator_index = num;
        this.CalculateStats();
    }
    GetRadiator() {
        return this.radiator_index;
    }
    GetListOfEngines() {
        return this.engine_list;
    }
    RequiresExtendedDriveshafts() {
        return this.mount_list[this.selected_mount].reqED;
    }
    RequiresTailMod() {
        if (this.use_ds)
            return false;
        return this.mount_list[this.selected_mount].reqTail;
    }
    SetMountIndex(num) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.selected_mount = num;
        this.mount_stats = this.mount_list[num].stats;
        if (this.mount_list[this.selected_mount].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }
    GetMountIndex() {
        if (this.GetIsPulsejet())
            return -1;
        return this.selected_mount;
    }
    SetUsePushPull(use) {
        this.use_pp = use;
        this.CalculateStats();
    }
    GetUsePushPull() {
        return this.use_pp;
    }
    GetMountList() {
        return this.mount_list;
    }
    SetUseExtendedDriveshaft(use) {
        this.use_ds = use || this.RequiresExtendedDriveshafts();
        this.CalculateStats();
    }
    GetUseExtendedDriveshaft() {
        return this.use_ds;
    }
    SetGearCount(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.gpr_count = Math.min(num, this.gp_count);
        this.CalculateStats();
    }
    GetGearReliability() {
        return this.gpr_count;
    }
    SetTorqueToStruct(use) {
        this.torque_to_struct = use;
        if (!this.use_pp)
            this.torque_to_struct = false;
        this.CalculateStats();
    }
    GetTorqueToStruct() {
        return this.torque_to_struct;
    }
    CanTorqueToStruct() {
        return this.use_pp && this.etype_stats.torque > 0 && this.mount_list[this.selected_mount].pp_type == "wing";
    }
    UpdateReliability(num) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.gp_count - this.gpr_count);
        if (this.NeedCooling()) {
            this.total_reliability -= (this.etype_stats.stats.cooling - this.cooling_count);
        }
        this.total_reliability += num;
    }
    GetReliability() {
        return this.total_reliability;
    }
    GetOverspeed() {
        return this.etype_stats.overspeed + Math.floor(this.gp_count * this.etype_stats.overspeed / 2);
    }
    GetIsPulsejet() {
        return this.etype_stats.pulsejet;
    }
    PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.etype_stats.stats.cooling = 0;
            this.etype_stats.overspeed = 100;
            this.etype_stats.altitude = 100;
            this.etype_stats.torque = 0;
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            if (this.mount_list[this.selected_mount].pp_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.selected_mount = i;
                    if (this.mount_list[this.selected_mount].pp_type != "fuselage")
                        break;
                }
            }
        }
        else {
            this.etype_stats.rumble = 0;
        }
    }
    GetHavePropeller() {
        return !this.GetIsPulsejet(); //TODO: Charge and Generators
    }
    GetIsTractorNacelle() {
        if (!this.GetIsPulsejet()
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].pp_type == "wing")
            return true;
        return false;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetCowlList() {
        return this.cowl_list;
    }
    GetCowl() {
        return this.cowl_sel;
    }
    GetCowlEnabled() {
        let lst = [];
        for (let c of this.cowl_list) {
            if (this.GetIsPulsejet()) { //Pulsejets no cowl
                lst.push(c.air && c.rotary && c.liquid); //Only no cowl
                console.log("Is Pulsejet");
            }
            else if (this.NeedCooling()) { //Means air cooled
                lst.push(c.liquid);
                console.log("Is Liquid");
            }
            else if (this.etype_stats.oiltank) { //Means rotary
                lst.push(c.rotary);
                console.log("Is Rotary");
            }
            else { //Means liquid
                lst.push(c.air);
                console.log("Is Air");
            }
        }
        return lst;
    }
    VerifyCowl(num) {
        var can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        else if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }
    SetCowl(num) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }
    PartStats() {
        let stats = new Stats;
        if (this.selected_index > 0)
            stats = stats.Add(this.etype_stats.stats);
        else
            stats = stats.Add(this.etype_stats.stats);
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        if (this.mount_list[this.selected_mount].pp_type == "fuselage")
            stats.latstab -= this.etype_stats.torque;
        else if (this.mount_list[this.selected_mount].pp_type == "wing") {
            if (this.torque_to_struct)
                stats.structure -= this.etype_stats.torque;
            else
                stats.maxstrain -= this.etype_stats.torque;
        }
        stats.structure -= this.etype_stats.rumble;
        stats.flightstress += this.etype_stats.rumble;
        //Push-pull
        if (this.use_pp) {
            var pp_type = this.mount_list[this.selected_mount].pp_type;
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.power = Math.floor(this.pp_list[pp_type].powerfactor * stats.power);
        }
        //Cowls modify engine stats directly, not mounting or upgrade.
        stats = stats.Add(this.cowl_list[this.cowl_sel].stats);
        stats.mass += Math.floor(stats.mass * this.cowl_list[this.cowl_sel].mpd);
        stats.drag = Math.floor(stats.drag * this.cowl_list[this.cowl_sel].ed);
        if (this.cowl_sel != 0 && this.mount_list[this.selected_mount].reqTail)
            stats.cost += 2;
        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!this.etype_stats.pulsejet) {
            stats = stats.Add(this.mount_stats);
            stats.maxstrain -= Math.floor(this.mount_list[this.selected_mount].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(this.mount_list[this.selected_mount].dragfactor * this.etype_stats.stats.mass);
        }
        //Upgrades
        if (this.use_ds) {
            stats.mass += Math.floor(stats.power / 10);
            stats.cost += 2 * Math.floor(stats.power / 10);
        }
        stats.cost += this.gp_count + this.gpr_count;
        //Reliability is a part local issue.
        stats.reliability = 0;
        return stats;
    }
}
class Engine_HTML extends Display {
    constructor(eng, r) {
        super();
        this.engine = eng;
        this.engine_list = eng.GetListOfEngines();
        var row = r;
        this.InitTypeSelect(row);
        var option_cell = row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE");
        opt_table.className = "inner_table";
        CreateTH(opt_table.insertRow(), "Cooling");
        this.cool_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), "Mounting");
        var mount_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), "Upgrades");
        var upg_cell = opt_table.insertRow().insertCell();
        option_cell.appendChild(opt_table);
        var option2_cell = row.insertCell();
        option2_cell.className = "inner_table";
        var opt2_table = document.createElement("TABLE");
        opt2_table.className = "inner_table";
        CreateTH(opt2_table.insertRow(), "Cowls");
        var cowl_cell = opt2_table.insertRow().insertCell();
        option2_cell.appendChild(opt2_table);
        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitCowlSelect(cowl_cell);
        this.InitStatDisplay(row);
    }
    InitTypeSelect(row) {
        this.e_pwr = document.createElement("INPUT");
        this.e_mass = document.createElement("INPUT");
        this.e_drag = document.createElement("INPUT");
        this.e_rely = document.createElement("INPUT");
        this.e_cool = document.createElement("INPUT");
        this.e_over = document.createElement("INPUT");
        this.e_fuel = document.createElement("INPUT");
        this.e_alti = document.createElement("INPUT");
        this.e_torq = document.createElement("INPUT");
        this.e_rumb = document.createElement("INPUT");
        this.e_cost = document.createElement("INPUT");
        this.e_oil = document.createElement("INPUT");
        this.e_pulsejet = document.createElement("INPUT");
        this.cool_count = document.createElement("INPUT");
        this.cool_count.setAttribute("type", "number");
        var tcell = row.insertCell(0);
        //Set up the engine select box.
        this.e_select = document.createElement("SELECT");
        this.e_select.required = true;
        tcell.appendChild(this.e_select);
        tcell.appendChild(document.createElement("BR"));
        for (let i = 0; i < this.engine_list.length; i++) {
            let eng = this.engine_list[i];
            let opt = document.createElement("OPTION");
            opt.text = eng.name;
            this.e_select.add(opt);
        }
        let opt = document.createElement("OPTION");
        opt.text = "Custom";
        opt.value = (-1).toString();
        this.e_select.add(opt);
        var fs = CreateFlexSection(tcell);
        //Set up the individual stat input boxes
        FlexInput("Power", this.e_pwr, fs);
        FlexInput("Mass", this.e_mass, fs);
        FlexInput("Drag", this.e_drag, fs);
        FlexInput("Reliability", this.e_rely, fs);
        FlexInput("Cooling", this.e_cool, fs);
        FlexInput("Overspeed", this.e_over, fs);
        FlexInput("Fuel Consumption", this.e_fuel, fs);
        FlexInput("Altitude", this.e_alti, fs);
        FlexInput("Torque", this.e_torq, fs);
        FlexInput("Rumble", this.e_rumb, fs);
        FlexInput("Cost", this.e_cost, fs);
        FlexCheckbox("Oil Tank", this.e_oil, fs);
        FlexCheckbox("Pulsejet", this.e_pulsejet, fs);
        //Event Listeners for engine stats
        this.e_select.onchange = () => {
            if (this.e_select.selectedIndex == this.engine_list.length) {
                this.SetInputDisable(false);
                this.SendCustomStats();
            }
            else {
                this.SetInputDisable(true);
                this.engine.SetSelectedIndex(this.e_select.selectedIndex);
            }
        };
        var trigger = () => { this.SendCustomStats(); };
        this.e_pwr.onchange = trigger;
        this.e_mass.onchange = trigger;
        this.e_drag.onchange = trigger;
        this.e_rely.onchange = trigger;
        this.e_cool.onchange = trigger;
        this.e_over.onchange = trigger;
        this.e_fuel.onchange = trigger;
        this.e_alti.onchange = trigger;
        this.e_torq.onchange = trigger;
        this.e_rumb.onchange = trigger;
        this.e_cost.onchange = trigger;
        this.e_oil.onchange = trigger;
        this.e_pulsejet.onchange = trigger;
    }
    UpdateEngine(en) {
        this.engine = en;
    }
    InitMountSelect(mount_cell) {
        var txtSpan = document.createElement("SPAN");
        txtSpan.innerHTML = "Engine Mounting Location";
        mount_cell.appendChild(txtSpan);
        mount_cell.appendChild(document.createElement("BR"));
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.engine.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            opt.value = elem.pp_type;
            this.mount_select.add(opt);
        }
        this.mount_select.required = true;
        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        this.mount_select.onchange = () => { this.engine.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        mount_cell.appendChild(document.createElement("BR"));
        this.pushpull_input = document.createElement("INPUT");
        this.torque_input = document.createElement("INPUT");
        var fs = CreateFlexSection(mount_cell);
        FlexCheckbox(" Push Pull", this.pushpull_input, fs);
        FlexCheckbox(" Torque To Structure", this.torque_input, fs);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }
    InitUpgradeSelect(upg_cell) {
        this.ds_input = document.createElement("INPUT");
        this.gp_input = document.createElement("INPUT");
        this.gpr_input = document.createElement("INPUT");
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox("Extended Driveshafts", this.ds_input, fs);
        FlexInput("Geared Propeller", this.gp_input, fs);
        FlexInput("Negate Reliability Penalty", this.gpr_input, fs);
        this.gp_input.onchange = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.onchange = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };
    }
    InitStatDisplay(row) {
        var stat_cell = row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Power");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_powr = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Reliability");
        CreateTH(h2_row, "Visibility");
        CreateTH(h2_row, "Overspeed");
        var c2_row = tbl_stat.insertRow();
        this.d_rely = c2_row.insertCell();
        this.d_rely.className = "part_local";
        this.d_visi = c2_row.insertCell();
        this.d_over = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Cost");
        CreateTH(h3_row, "Altitude");
        CreateTH(h3_row, "Fuel Consumption");
        var c3_row = tbl_stat.insertRow();
        this.d_cost = c3_row.insertCell();
        this.d_alti = c3_row.insertCell();
        this.d_fuel = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Pitch Stab");
        CreateTH(h4_row, "Lateral Stab");
        CreateTH(h4_row, "Max Strain");
        var c4_row = tbl_stat.insertRow();
        this.d_pstb = c4_row.insertCell();
        this.d_lstb = c4_row.insertCell();
        this.d_maxs = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, "Structure");
        CreateTH(h5_row, "Flight Stress");
        CreateTH(h5_row, "Frame Sections");
        var c5_row = tbl_stat.insertRow();
        this.d_strc = c5_row.insertCell();
        this.d_fstr = c5_row.insertCell();
        this.d_sect = c5_row.insertCell();
    }
    InitCowlSelect(cell) {
        this.cowl_select = document.createElement("SELECT");
        for (let elem of this.engine.GetCowlList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.cowl_select.add(opt);
        }
        this.cowl_select.required = true;
        this.cowl_select.selectedIndex = this.engine.GetMountIndex();
        this.cowl_select.onchange = () => { this.engine.SetCowl(this.cowl_select.selectedIndex); };
        cell.appendChild(this.cowl_select);
    }
    InitCoolingSelect() {
        while (this.cool_cell.children.length > 0)
            this.cool_cell.removeChild(this.cool_cell.children[0]);
        if (this.e_oil.checked) {
            this.e_cool.valueAsNumber = 0;
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "Rotary Engines use Oil Tanks.<br/>+1 Mass, Oil Tank is a Vital Component.";
            this.cool_cell.appendChild(txtSpan);
        }
        else if (this.e_cool.valueAsNumber == 0) {
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "Air-Cooled Engine.<br/>All is well.";
            this.cool_cell.appendChild(txtSpan);
        }
        else {
            var txtSpan = document.createElement("SPAN");
            txtSpan.innerHTML = "    Select Radiator";
            if (!this.cool_select) {
                this.cool_select = document.createElement("SELECT");
                this.cool_select.required = true;
            }
            var numrad = this.engine.GetNumRadiators();
            while (this.cool_select.options.length > 0) {
                this.cool_select.options.remove(0);
            }
            for (let i = 1; i < numrad + 1; i++) {
                let opt = document.createElement("OPTION");
                opt.innerText = "Radiator #" + i.toString();
                this.cool_select.add(opt);
            }
            this.cool_select.onchange = () => {
                this.engine.SetRadiator(this.cool_select.selectedIndex);
            };
            this.cool_select.selectedIndex = this.engine.GetRadiator();
            this.cool_cell.appendChild(this.cool_select);
            this.cool_cell.appendChild(txtSpan);
            this.cool_cell.appendChild(document.createElement("BR"));
            var txtSpan2 = document.createElement("SPAN");
            txtSpan2.innerHTML = "    Cooling Amount";
            this.cool_count.min = "0";
            this.cool_count.valueAsNumber = this.engine.GetCooling();
            this.cool_count.max = this.engine.GetCurrentStats().stats.cooling.toString();
            if (this.cool_count.valueAsNumber > this.e_cool.valueAsNumber) {
                this.cool_count.valueAsNumber = this.e_cool.valueAsNumber;
            }
            this.cool_count.onchange = () => { this.engine.SetCooling(this.cool_count.valueAsNumber); };
            this.cool_cell.appendChild(this.cool_count);
            this.cool_cell.appendChild(txtSpan2);
        }
    }
    SendCustomStats() {
        var e_stats = new EngineStats();
        e_stats.stats.power = this.e_pwr.valueAsNumber;
        e_stats.stats.mass = this.e_mass.valueAsNumber;
        e_stats.stats.drag = this.e_drag.valueAsNumber;
        e_stats.stats.reliability = this.e_rely.valueAsNumber;
        e_stats.stats.cooling = this.e_cool.valueAsNumber;
        e_stats.overspeed = this.e_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.e_fuel.valueAsNumber;
        e_stats.altitude = this.e_alti.valueAsNumber;
        e_stats.torque = this.e_torq.valueAsNumber;
        e_stats.rumble = this.e_rumb.valueAsNumber;
        e_stats.stats.cost = this.e_cost.valueAsNumber;
        e_stats.oiltank = this.e_oil.checked;
        e_stats.pulsejet = this.e_pulsejet.checked;
        this.engine.SetCustomStats(e_stats);
    }
    SetInputDisable(b) {
        this.e_pwr.disabled = b;
        this.e_mass.disabled = b;
        this.e_drag.disabled = b;
        this.e_rely.disabled = b;
        this.e_cool.disabled = b;
        this.e_over.disabled = b;
        this.e_fuel.disabled = b;
        this.e_alti.disabled = b;
        this.e_torq.disabled = b;
        this.e_rumb.disabled = b;
        this.e_cost.disabled = b;
        this.e_oil.disabled = b;
        this.e_pulsejet.disabled = b;
    }
    UpdateDisplay() {
        var idx = this.engine.GetSelectedIndex();
        if (idx < 0)
            idx = this.engine_list.length;
        this.e_select.selectedIndex = idx;
        if (this.e_select.selectedIndex == this.engine_list.length) {
            this.SetInputDisable(false);
        }
        else {
            this.SetInputDisable(true);
        }
        var e_stats = this.engine.GetCurrentStats();
        this.e_pwr.valueAsNumber = e_stats.stats.power;
        this.e_mass.valueAsNumber = e_stats.stats.mass;
        this.e_drag.valueAsNumber = e_stats.stats.drag;
        this.e_rely.valueAsNumber = e_stats.stats.reliability;
        this.e_cool.valueAsNumber = e_stats.stats.cooling;
        this.e_over.valueAsNumber = e_stats.overspeed;
        this.e_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.e_alti.valueAsNumber = e_stats.altitude;
        this.e_torq.valueAsNumber = e_stats.torque;
        this.e_rumb.valueAsNumber = e_stats.rumble;
        this.e_cost.valueAsNumber = e_stats.stats.cost;
        this.e_oil.checked = e_stats.oiltank;
        this.e_pulsejet.checked = e_stats.pulsejet;
        this.InitCoolingSelect();
        if (this.mount_select.selectedIndex != this.engine.GetMountIndex()) {
            this.mount_select.selectedIndex = this.engine.GetMountIndex();
        }
        if (this.pushpull_input.checked != this.engine.GetUsePushPull()) {
            this.pushpull_input.checked = this.engine.GetUsePushPull();
        }
        if (this.torque_input.checked != this.engine.GetTorqueToStruct()) {
            this.torque_input.checked = this.engine.GetTorqueToStruct();
        }
        if (this.torque_input.checked != this.engine.GetTorqueToStruct()) {
            this.torque_input.checked = this.engine.GetTorqueToStruct();
        }
        this.torque_input.disabled = !this.engine.CanTorqueToStruct();
        if (this.ds_input.checked != this.engine.GetUseExtendedDriveshaft()) {
            this.ds_input.checked = this.engine.GetUseExtendedDriveshaft();
        }
        if (this.gp_input.valueAsNumber != this.engine.GetGearCount()) {
            this.gp_input.valueAsNumber = this.engine.GetGearCount();
        }
        if (this.gpr_input.valueAsNumber != this.engine.GetGearReliability()) {
            this.gpr_input.valueAsNumber = this.engine.GetGearReliability();
        }
        if (e_stats.pulsejet) {
            this.mount_select.disabled = true;
            this.mount_select.selectedIndex = -1;
            this.pushpull_input.disabled = true;
            this.ds_input.disabled = true;
            this.gp_input.disabled = true;
            this.gpr_input.disabled = true;
            for (let opt of this.mount_select.options) {
                if (opt.value == "fuselage") {
                    opt.disabled = true;
                }
            }
            this.cowl_select.disabled = true;
        }
        else {
            this.mount_select.disabled = false;
            this.pushpull_input.disabled = false;
            this.ds_input.disabled = false;
            this.gp_input.disabled = false;
            this.gpr_input.disabled = false;
            for (let opt of this.mount_select.options) {
                opt.disabled = false;
            }
            this.cowl_select.disabled = false;
        }
        this.cowl_select.selectedIndex = this.engine.GetCowl();
        var cowl_enable = this.engine.GetCowlEnabled();
        for (let i = 0; i < cowl_enable.length; i++) {
            this.cowl_select.options[i].disabled = !cowl_enable[i];
        }
        var full_stats = this.engine.PartStats();
        BlinkIfChanged(this.d_powr, full_stats.power.toString());
        BlinkIfChanged(this.d_mass, full_stats.mass.toString());
        BlinkIfChanged(this.d_drag, full_stats.drag.toString());
        BlinkIfChanged(this.d_rely, this.engine.GetReliability().toString());
        BlinkIfChanged(this.d_visi, full_stats.visibility.toString());
        BlinkIfChanged(this.d_over, this.engine.GetOverspeed().toString());
        BlinkIfChanged(this.d_cost, full_stats.cost.toString());
        BlinkIfChanged(this.d_alti, e_stats.altitude.toString());
        BlinkIfChanged(this.d_fuel, full_stats.fuelconsumption.toString());
        BlinkIfChanged(this.d_pstb, full_stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, full_stats.latstab.toString());
        BlinkIfChanged(this.d_maxs, full_stats.maxstrain.toString());
        BlinkIfChanged(this.d_strc, full_stats.structure.toString());
        BlinkIfChanged(this.d_fstr, full_stats.flightstress.toString());
        BlinkIfChanged(this.d_sect, full_stats.reqsections.toString());
    }
}
class Radiator extends Part {
    constructor(tl, ml, cl) {
        super();
        this.need_cool = 0;
        this.idx_type = 0;
        this.idx_mount = 0;
        this.idx_coolant = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
    }
    toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant
        };
    }
    fromJSON(js) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
    }
    GetTypeList() {
        return this.type_list;
    }
    GetMountList() {
        return this.mount_list;
    }
    GetCoolantList() {
        return this.coolant_list;
    }
    SetTypeIndex(num) {
        this.idx_type = num;
        this.CalculateStats();
    }
    GetTypeIndex() {
        return this.idx_type;
    }
    SetMountIndex(num) {
        this.idx_mount = num;
        this.CalculateStats();
    }
    GetMountIndex() {
        return this.idx_mount;
    }
    SetCoolantIndex(num) {
        this.idx_coolant = num;
        this.CalculateStats();
    }
    GetCoolantIndex() {
        return this.idx_coolant;
    }
    SetNeedCool(num) {
        this.need_cool = num;
    }
    PartStats() {
        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);
        stats.drag += Math.ceil(this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Radiator_HTML extends Display {
    constructor(row, rad) {
        super();
        this.radiator = rad;
        var type_cell = row.insertCell();
        //Radiator Type
        this.type_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetTypeList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.type_select.add(opt);
        }
        this.type_select.onchange = () => { this.radiator.SetTypeIndex(this.type_select.selectedIndex); };
        type_cell.appendChild(this.type_select);
        var mount_cell = row.insertCell();
        //Radiator Mounting
        this.mount_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetMountList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.mount_select.add(opt);
        }
        this.mount_select.onchange = () => { this.radiator.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        var cool_cell = row.insertCell();
        //Special Coolant
        this.coolant_select = document.createElement("SELECT");
        for (let elem of this.radiator.GetCoolantList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.coolant_select.add(opt);
        }
        this.coolant_select.onchange = () => { this.radiator.SetCoolantIndex(this.coolant_select.selectedIndex); };
        cool_cell.appendChild(this.coolant_select);
        var stats_cell = row.insertCell();
        var tbl = document.createElement("TABLE");
        stats_cell.className = "inner_table";
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Reliability");
        CreateTH(h1_row, "Lateral Stab");
        var c1_row = tbl.insertRow();
        this.c_mass = c1_row.insertCell();
        this.c_cost = c1_row.insertCell();
        this.c_drag = c1_row.insertCell();
        this.c_rely = c1_row.insertCell();
        this.c_lstb = c1_row.insertCell();
        stats_cell.appendChild(tbl);
    }
    UpdateRadiator(rad) {
        this.radiator = rad;
    }
    UpdateDisplay() {
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        var stats = this.radiator.PartStats();
        BlinkIfChanged(this.c_mass, stats.mass.toString());
        BlinkIfChanged(this.c_cost, stats.cost.toString());
        BlinkIfChanged(this.c_drag, stats.drag.toString());
        BlinkIfChanged(this.c_rely, stats.reliability.toString());
        BlinkIfChanged(this.c_lstb, stats.latstab.toString());
    }
}
class Propeller extends Part {
    constructor(json) {
        super();
        this.idx_prop = 2;
        this.use_variable = false;
        this.have_propellers = true;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({ name: elem["name"], stats: new Stats(elem), automatic: elem["automatic"] });
        }
    }
    toJSON() {
        return {
            type: this.idx_prop,
            use_variable: this.use_variable
        };
    }
    fromJSON(js) {
        this.idx_prop = js["type"];
        this.use_variable = js["use_variable"];
    }
    GetPropList() {
        return this.prop_list;
    }
    SetPropIndex(num) {
        this.idx_prop = num;
        if (this.prop_list[num].automatic)
            this.use_variable = false;
        this.CalculateStats();
    }
    GetPropIndex() {
        return this.idx_prop;
    }
    SetVariable(use) {
        if (!this.prop_list[this.idx_prop].automatic)
            this.use_variable = use;
        else
            this.use_variable = false;
        this.CalculateStats();
    }
    GetVariable() {
        return this.use_variable;
    }
    CanBeVariable() {
        return !this.prop_list[this.idx_prop].automatic;
    }
    SetHavePropeller(have) {
        this.have_propellers = have;
    }
    GetHavePropeller() {
        return this.have_propellers;
    }
    PartStats() {
        var stats = new Stats();
        if (this.have_propellers) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats);
            if (this.use_variable)
                stats.cost += 2;
        }
        else {
            stats.pitchboost = 1;
            stats.pitchspeed = 1;
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Propeller_HTML extends Display {
    constructor(prop) {
        super();
        this.prop = prop;
        this.select_prop = document.getElementById("propeller_pitch");
        for (let elem of prop.GetPropList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.select_prop.add(opt);
        }
        this.select_prop.onchange = () => { this.prop.SetPropIndex(this.select_prop.selectedIndex); };
        this.input_variable = document.getElementById("propeller_variable");
        this.input_variable.onchange = () => { this.prop.SetVariable(this.input_variable.checked); };
    }
    UpdateDisplay() {
        this.input_variable.checked = this.prop.GetVariable();
        this.input_variable.disabled = !this.prop.CanBeVariable();
        this.select_prop.selectedIndex = this.prop.GetPropIndex();
        this.select_prop.disabled = false;
        if (!this.prop.GetHavePropeller()) {
            this.input_variable.disabled = true;
            this.select_prop.disabled = true;
            this.select_prop.selectedIndex = -1;
        }
    }
}
class Frames extends Part {
    constructor(js) {
        super();
        this.frame_list = [];
        for (let elem of js["frames"]) {
            this.frame_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                basestruct: elem["basestructure"],
                basecost: elem["basecost"],
                geodesic: elem["geodesic"]
            });
        }
        this.skin_list = [];
        for (let elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"]
            });
        }
        this.farman = false;
        this.boom = false;
        this.has_tractor_nacelles = false;
        this.sel_tail = 1;
        this.tail_list = [];
        for (let elem of js["tail"]) {
            this.tail_list.push({
                name: elem["name"],
                stats: new Stats(elem)
            });
        }
        this.section_list = [];
        this.tail_section_list = [];
        this.SetRequiredSections(1);
    }
    toJSON() {
        return {
            sections: this.section_list,
            tail_sections: this.tail_section_list,
            tail_index: this.sel_tail,
            use_farman: this.farman,
            use_boom: this.boom
        };
    }
    fromJSON(js) {
        this.section_list = [];
        for (let elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.tail_section_list = [];
        for (let elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
    }
    DuplicateSection(num) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() + this.tail_section_list.length == this.CountInternalBracing()) {
            return;
        }
        this.section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }
    DuplicateTailSection(num) {
        var sec = this.tail_section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.CountInternalBracing()) {
            return;
        }
        this.tail_section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }
    DeleteSection(num) {
        if (this.required_sections == this.CountSections()
            && !this.section_list[num].internal_bracing)
            return;
        this.section_list.splice(num, 1);
        this.CalculateStats();
    }
    SetRequiredSections(num) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (!this.section_list[i].internal_bracing) {
                    while (this.required_sections > this.CountSections()) {
                        this.DuplicateSection(i);
                    }
                    return;
                }
            }
        }
    }
    SetRequiredTailSections(num) {
        if (num > this.tail_section_list.length) {
            if (this.tail_section_list.length == 0) {
                this.tail_section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            while (num > this.tail_section_list.length) {
                this.DuplicateTailSection(this.tail_section_list.length - 1);
            }
        }
        while (num < this.tail_section_list.length) {
            this.tail_section_list.pop();
        }
        while (this.CountSections() + num < this.CountInternalBracing()) {
            let idx = this.section_list.length - 1;
            for (; idx > 0; idx--) {
                if (this.section_list[idx].internal_bracing)
                    break;
            }
            this.DeleteSection(idx);
        }
        this.CalculateStats();
    }
    CountSections() {
        var count = 0;
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                count++;
        }
        return count;
    }
    GetNumFrames() {
        return this.CountSections() + this.tail_section_list.length;
    }
    CountInternalBracing() {
        var count = 0;
        for (let elem of this.section_list) {
            if (elem.internal_bracing)
                count++;
        }
        return count;
    }
    BaseType() {
        var hist = [...Array(this.frame_list.length).fill(0)];
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        var max_index = 0;
        var max = 0;
        for (let i = hist.length - 1; i > 0; i--) {
            if (hist[i] > max) {
                max = hist[i];
                max_index = i;
            }
        }
        return max_index;
    }
    GetFrameList() {
        return this.frame_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetSectionList() {
        return this.section_list;
    }
    SetFrame(num, type) {
        this.section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    SetSkin(num, type) {
        this.section_list[num].skin = type;
        if (type != 0)
            this.section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }
    SetGeodesic(num, use) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetMonocoque(num, use) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetLiftingBody(num, use) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetInternalBracing(num, use) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing()
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].skin = 0;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        }
        else if (!use) { // If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }
    PossibleInternalBracing() {
        return this.CountInternalBracing() < this.CountSections() + this.tail_section_list.length;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.section_list[num].skin].monocoque;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }
    PossibleTailMonocoque(num) {
        return this.skin_list[this.tail_section_list[num].skin].monocoque;
    }
    PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }
    GetFarmanOrBoom() {
        return this.farman || this.boom;
    }
    SectionStats(sec) {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic)
            stats.structure *= 1.5;
        if (sec.lifting_body) {
            stats.drag += 2;
            stats.wingarea += 2;
        }
        //If it's internal, no skin.
        if (sec.internal_bracing)
            stats.mass -= 1;
        else {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[sec.skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[sec.skin].stats);
        }
        return stats;
    }
    SetTailType(num) {
        this.sel_tail = num;
        this.SetRequiredTailSections(this.tail_list[num].stats.reqsections);
    }
    GetTailType() {
        return this.sel_tail;
    }
    GetTailList() {
        return this.tail_list;
    }
    GetTailSectionList() {
        return this.tail_section_list;
    }
    SetUseFarman(use) {
        this.farman = use;
        if (use && this.boom)
            this.boom = false;
        if (this.farman) {
            for (let sec of this.tail_section_list) {
                sec.skin = 0;
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
        this.CalculateStats();
    }
    GetUseFarman() {
        return this.farman;
    }
    SetUseBoom(use) {
        this.boom = use;
        if (use && this.farman)
            this.farman = false;
        this.CalculateStats();
    }
    GetUseBoom() {
        return this.boom;
    }
    SetTailFrame(num, type) {
        this.tail_section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    SetTailSkin(num, type) {
        this.tail_section_list[num].skin = type;
        if (type != 0)
            this.tail_section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.tail_section_list[num].monocoque = false;
            this.tail_section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }
    SetTailGeodesic(num, use) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetTailMonocoque(num, use) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetTailLiftingBody(num, use) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    SetHasTractorNacelles(use) {
        this.has_tractor_nacelles = true;
    }
    GetHasTractorNacelles() {
        return this.has_tractor_nacelles;
    }
    PartStats() {
        var stats = new Stats();
        var base_type = this.BaseType();
        stats.structure = this.frame_list[base_type].basestruct;
        stats.cost = this.frame_list[base_type].basecost;
        var is_clinker = false;
        for (let sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }
        var tail_stats = new Stats();
        for (let sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }
        if (is_clinker)
            stats.structure += 30;
        stats = stats.Add(this.tail_list[this.sel_tail].stats);
        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.5 * tail_stats.drag);
        }
        stats = stats.Add(tail_stats);
        stats.structure = Math.floor(stats.structure);
        stats.cost = Math.floor(stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);
        return stats;
    }
}
class Frames_HTML extends Display {
    constructor(frames) {
        super();
        this.frames = frames;
        var table = document.getElementById("table_frames");
        var row = table.insertRow();
        this.c_frame = row.insertCell();
        this.c_skin = row.insertCell();
        this.c_options = row.insertCell();
        this.c_stats = row.insertCell();
        this.c_stats.className = "inner_table";
        this.c_stats.rowSpan = 0;
        var tbl = document.createElement("TABLE");
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Toughness");
        CreateTH(h2_row, "Visibility");
        var c2_row = tbl.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, "Wing Area");
        CreateTH(h3_row, "Flammable");
        CreateTH(h3_row, "Pitch Stability");
        var c3_row = tbl.insertRow();
        this.d_area = c3_row.insertCell();
        this.d_flammable = c3_row.insertCell();
        this.d_pstb = c3_row.insertCell();
        var h4_row = tbl.insertRow();
        CreateTH(h4_row, "Max Strain");
        CreateTH(h4_row, "");
        CreateTH(h4_row, "");
        var c4_row = tbl.insertRow();
        this.d_strn = c4_row.insertCell();
        c4_row.insertCell();
        c4_row.insertCell();
        this.c_stats.appendChild(tbl);
        var row3 = table.insertRow();
        CreateTH(row3, "Tail Frame Type");
        CreateTH(row3, "Tail Skin Type");
        CreateTH(row3, "Tail Frame Options");
        var row4 = table.insertRow();
        this.t_frame = row4.insertCell();
        this.t_skin = row4.insertCell();
        this.t_options = row4.insertCell();
        this.t_select = document.getElementById("tail_type");
        this.t_farman = document.getElementById("tail_farman");
        this.t_boom = document.getElementById("tail_boom");
        for (let elem of this.frames.GetTailList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.t_select.add(opt);
        }
        this.t_select.onchange = () => { this.frames.SetTailType(this.t_select.selectedIndex); };
        this.t_farman.onchange = () => { this.frames.SetUseFarman(this.t_farman.checked); };
        this.t_boom.onchange = () => { this.frames.SetUseBoom(this.t_boom.checked); };
    }
    UpdateDisplay() {
        while (this.c_frame.children.length > 0)
            this.c_frame.removeChild(this.c_frame.children[0]);
        while (this.c_skin.children.length > 0)
            this.c_skin.removeChild(this.c_skin.children[0]);
        while (this.c_options.children.length > 0)
            this.c_options.removeChild(this.c_options.children[0]);
        while (this.t_frame.children.length > 0)
            this.t_frame.removeChild(this.t_frame.children[0]);
        while (this.t_skin.children.length > 0)
            this.t_skin.removeChild(this.t_skin.children[0]);
        while (this.t_options.children.length > 0)
            this.t_options.removeChild(this.t_options.children[0]);
        var section_list = this.frames.GetSectionList();
        var tail_section_list = this.frames.GetTailSectionList();
        var skin_list = this.frames.GetSkinList();
        var is_flammable = false;
        for (let i = 0; i < section_list.length; i++) {
            let sec = section_list[i];
            this.UpdateSection(i, sec);
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        this.t_select.selectedIndex = this.frames.GetTailType();
        this.t_farman.disabled = this.frames.GetUseBoom();
        this.t_boom.disabled = this.frames.GetUseFarman();
        for (let i = 0; i < tail_section_list.length; i++) {
            let sec = tail_section_list[i];
            this.UpdateTailSection(i, sec);
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        if (is_flammable)
            BlinkIfChanged(this.d_flammable, "Yes");
        else
            BlinkIfChanged(this.d_flammable, "No");
        var stats = this.frames.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_area, stats.wingarea.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_strn, stats.maxstrain.toString());
    }
    UpdateSection(i, sec) {
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var type_span = document.createElement("SPAN");
        var rem_button = document.createElement("BUTTON");
        rem_button.textContent = "-";
        rem_button.onclick = () => { this.frames.DeleteSection(i); };
        rem_button.disabled = !sec.internal_bracing && !this.frames.PossibleRemoveSections();
        var add_button = document.createElement("BUTTON");
        add_button.textContent = "+";
        add_button.disabled = sec.internal_bracing && !this.frames.PossibleInternalBracing();
        add_button.onclick = () => { this.frames.DuplicateSection(i); };
        var frame_select = document.createElement("SELECT");
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = ft.name;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
            frame_select.add(opt);
        }
        frame_select.onchange = () => { this.frames.SetFrame(i, frame_select.selectedIndex); };
        frame_select.selectedIndex = sec.frame;
        type_span.appendChild(rem_button);
        type_span.appendChild(add_button);
        type_span.appendChild(frame_select);
        this.c_frame.appendChild(type_span);
        this.c_frame.appendChild(document.createElement("BR"));
        var skin_select = document.createElement("SELECT");
        for (let st of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = st.name;
            if (sec.monocoque && !st.monocoque)
                opt.disabled = true;
            skin_select.add(opt);
        }
        if (sec.internal_bracing)
            skin_select.disabled = true;
        skin_select.onchange = () => { this.frames.SetSkin(i, skin_select.selectedIndex); };
        skin_select.selectedIndex = sec.skin;
        this.c_skin.appendChild(skin_select);
        this.c_skin.appendChild(document.createElement("BR"));
        var opt_span = document.createElement("SPAN");
        var geo_input = document.createElement("INPUT");
        CreateCheckbox("Geodesic", geo_input, opt_span, false);
        geo_input.checked = sec.geodesic;
        geo_input.disabled = !this.frames.PossibleGeodesic(i);
        geo_input.onchange = () => { this.frames.SetGeodesic(i, geo_input.checked); };
        var mono_input = document.createElement("INPUT");
        CreateCheckbox("Monocoque", mono_input, opt_span, false);
        mono_input.checked = sec.monocoque;
        mono_input.disabled = !this.frames.PossibleMonocoque(i);
        mono_input.onchange = () => { this.frames.SetMonocoque(i, mono_input.checked); };
        var int_input = document.createElement("INPUT");
        CreateCheckbox("Internal Bracing", int_input, opt_span, false);
        int_input.checked = sec.internal_bracing;
        if (!sec.internal_bracing && (!this.frames.PossibleInternalBracing() || !this.frames.PossibleRemoveSections()))
            int_input.disabled = true;
        int_input.onchange = () => { this.frames.SetInternalBracing(i, int_input.checked); };
        var lb_input = document.createElement("INPUT");
        CreateCheckbox("Lifting Body", lb_input, opt_span, false);
        lb_input.checked = sec.lifting_body;
        lb_input.disabled = !this.frames.PossibleMonocoque(i);
        lb_input.onchange = () => { this.frames.SetLiftingBody(i, lb_input.checked); };
        this.c_options.appendChild(opt_span);
        this.c_options.appendChild(document.createElement("BR"));
    }
    UpdateTailSection(i, sec) {
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var frame_select = document.createElement("SELECT");
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION");
            opt.text = ft.name;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (ft.basestruct != 0)
                frame_select.add(opt);
        }
        frame_select.onchange = () => { this.frames.SetTailFrame(i, frame_select.selectedIndex); };
        frame_select.selectedIndex = sec.frame;
        this.t_frame.appendChild(frame_select);
        this.t_frame.appendChild(document.createElement("BR"));
        var skin_select = document.createElement("SELECT");
        for (let st of skin_list) {
            let opt = document.createElement("OPTION");
            opt.text = st.name;
            if (sec.monocoque && !st.monocoque)
                opt.disabled = true;
            skin_select.add(opt);
        }
        if (this.frames.GetUseFarman()) {
            skin_select.disabled = true;
        }
        skin_select.onchange = () => { this.frames.SetTailSkin(i, skin_select.selectedIndex); };
        skin_select.selectedIndex = sec.skin;
        this.t_skin.appendChild(skin_select);
        this.t_skin.appendChild(document.createElement("BR"));
        var opt_span = document.createElement("SPAN");
        var geo_input = document.createElement("INPUT");
        CreateCheckbox("Geodesic", geo_input, opt_span, false);
        geo_input.checked = sec.geodesic;
        geo_input.disabled = !this.frames.PossibleTailGeodesic(i);
        geo_input.onchange = () => { this.frames.SetTailGeodesic(i, geo_input.checked); };
        var mono_input = document.createElement("INPUT");
        CreateCheckbox("Monocoque", mono_input, opt_span, false);
        mono_input.checked = sec.monocoque;
        mono_input.disabled = !this.frames.PossibleTailMonocoque(i);
        mono_input.onchange = () => { this.frames.SetTailMonocoque(i, mono_input.checked); };
        var lb_input = document.createElement("INPUT");
        CreateCheckbox("Lifting Body", lb_input, opt_span, false);
        lb_input.checked = sec.lifting_body;
        lb_input.disabled = !this.frames.PossibleTailMonocoque(i);
        lb_input.onchange = () => { this.frames.SetTailLiftingBody(i, lb_input.checked); };
        this.t_options.appendChild(opt_span);
        this.t_options.appendChild(document.createElement("BR"));
    }
}
class Wings extends Part {
    constructor(js) {
        super();
        this.skin_list = [];
        for (let elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"],
                dragfactor: elem["dragfactor"]
            });
        }
        this.stagger_list = [];
        for (let elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], inline: elem["inline"],
                wing_count: elem["wing_count"], hstab: elem["hstab"], stats: new Stats(elem)
            });
        }
        this.deck_list = [];
        for (let elem of js["decks"]) {
            this.deck_list.push({
                name: elem["name"], limited: elem["limited"], stats: new Stats(elem)
            });
        }
        this.wing_list = [];
        this.mini_wing_list = [];
        this.wing_stagger = Math.floor(this.stagger_list.length / 2);
        this.is_swept = false;
        this.is_closed = false;
    }
    toJSON() {
        return {
            wing_list: this.wing_list,
            mini_wing_list: this.mini_wing_list,
            wing_stagger: this.wing_stagger,
            is_swept: this.is_swept,
            is_closed: this.is_closed
        };
    }
    fromJSON(js) {
        this.wing_list = js["wing_list"];
        this.mini_wing_list = js["mini_wing_list"];
        this.wing_stagger = js["wing_stagger"];
        this.is_swept = js["is_swept"];
        this.is_closed = js["is_closed"];
    }
    GetWingList() {
        return this.wing_list;
    }
    GetMiniWingList() {
        return this.mini_wing_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetStaggerList() {
        return this.stagger_list;
    }
    GetDeckList() {
        return this.deck_list;
    }
    DeckCountFull() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    DeckCountMini() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.mini_wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    SetStagger(index) {
        this.wing_stagger = index;
        while (this.stagger_list[index].wing_count < this.wing_list.length) {
            this.wing_list.pop();
        }
        if (!this.stagger_list[index].inline) {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        else {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] == 1 && this.wing_list.length > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        this.CalculateStats();
    }
    GetStagger() {
        return this.wing_stagger;
    }
    CanAddFullWing(deck) {
        if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
            return false;
        var full_count = this.DeckCountFull();
        if (this.stagger_list[this.wing_stagger].inline) {
            if (full_count[deck] == 2)
                return false;
            if (full_count[deck] == 0 && this.wing_list.length > 0)
                return false;
        }
        else if (full_count[deck] == 1 && this.deck_list[deck].limited)
            return false;
        var mini_count = this.DeckCountMini();
        if (mini_count[deck] != 0)
            return false;
        return true;
    }
    CanAddMiniWing(deck) {
        var full_count = this.DeckCountFull();
        var mini_count = this.DeckCountMini();
        if (full_count[deck] != 0 || mini_count[deck] != 0)
            return false;
        return true;
    }
    CanMoveFullWing(idx, deck) {
        var w = this.wing_list[idx];
        this.wing_list.splice(idx, 1);
        var can = this.CanAddFullWing(deck);
        this.wing_list.splice(idx, 0, w);
        return can;
    }
    CanMoveMiniWing(idx, deck) {
        var w = this.mini_wing_list[idx];
        this.mini_wing_list.splice(idx, 1);
        var can = this.CanAddMiniWing(deck);
        this.mini_wing_list.splice(idx, 0, w);
        return can;
    }
    CanClosed() {
        return this.wing_list.length > 1 && !this.stagger_list[this.wing_stagger].inline;
    }
    SetClosed(use) {
        this.is_closed = use;
        this.CalculateStats();
    }
    GetClosed() {
        return this.is_closed;
    }
    SetSwept(use) {
        this.is_swept = use;
        this.CalculateStats();
    }
    GetSwept() {
        return this.is_swept;
    }
    GetTandem() {
        return this.stagger_list[this.wing_stagger].wing_count == 2;
    }
    GetMonoplane() {
        return this.wing_list.length == 1;
    }
    GetStaggered() {
        return this.stagger_list[this.wing_stagger].stats.liftbleed != 0;
    }
    SetFullWing(idx, w) {
        if (this.wing_list.length != idx)
            this.wing_list.splice(idx, 1);
        if (w.area != w.area)
            w.area = 3;
        w.area = Math.floor(w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(w.span);
        if (w.dihedral != w.dihedral)
            w.dihedral = 0;
        w.dihedral = Math.floor(w.dihedral);
        if (w.anhedral != w.anhedral)
            w.anhedral = 0;
        w.anhedral = Math.floor(w.anhedral);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 3);
            w.span = Math.max(w.span, 1);
            while (w.anhedral + w.dihedral > w.span - 1) {
                if (w.anhedral > w.dihedral) {
                    w.anhedral--;
                }
                else {
                    w.dihedral--;
                }
            }
            if (this.CanAddFullWing(w.deck))
                this.wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    SetMiniWing(idx, w) {
        if (this.mini_wing_list.length != idx)
            this.mini_wing_list.splice(idx, 1);
        if (w.area != w.area)
            w.area = 2;
        w.area = Math.floor(w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(w.span);
        if (w.dihedral != w.dihedral)
            w.dihedral = 0;
        w.dihedral = Math.floor(w.dihedral);
        if (w.anhedral != w.anhedral)
            w.anhedral = 0;
        w.anhedral = Math.floor(w.anhedral);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 1);
            w.area = Math.min(w.area, 2);
            w.span = Math.max(w.span, 1);
            w.dihedral = 0;
            w.anhedral = 0;
            if (this.CanAddMiniWing(w.deck))
                this.mini_wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    IsFlammable() {
        for (let w of this.wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        for (let w of this.mini_wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        return false;
    }
    SetNumFrames(num) {
        this.num_frames = num;
    }
    NeedHStab() {
        return this.stagger_list[this.wing_stagger].hstab;
    }
    NeedTail() {
        return this.NeedHStab() || !this.is_swept;
    }
    GetSpan() {
        var longest_span = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        return longest_span;
    }
    GetArea() {
        var area = 0;
        for (let w of this.wing_list) {
            area += w.area;
        }
        for (let w of this.mini_wing_list) {
            area += w.area;
        }
        return area;
    }
    PartStats() {
        var stats = new Stats();
        var deck_count = this.DeckCountFull();
        var have_wing = false;
        var have_mini_wing = false;
        var longest_span = 0;
        let drag_reduction = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (!have_wing) { //Is first wing
                have_wing = true;
            }
            else { //Is not first wing
                stats.control += 3;
                stats.liftbleed += 5;
                stats.visibility -= 1;
            }
            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.wingarea = w.area;
            wStats.maxstrain -= 2 * w.span + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + 2 * w.area - w.span - drag_reduction);
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            //If tandem, set leading wing drag reduction
            if (this.stagger_list[this.wing_stagger].inline && drag_reduction == 0)
                drag_reduction = Math.floor(w.area / 2);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (!have_mini_wing) { //Is first miniature wing
                have_mini_wing = true;
            }
            else { //Is not first miniature wing
                stats.control += 1;
                stats.liftbleed += 1;
            }
            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.maxstrain -= 2 * wspan + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + w.area - wspan);
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            wStats.Round();
            stats = stats.Add(wStats);
        }
        for (let i = 0; i < deck_count.length; i++) {
            if (deck_count[i] > 0)
                stats = stats.Add(this.deck_list[i].stats);
        }
        //Longest wing effects
        stats.control += 8 - longest_span;
        stats.latstab += Math.min(0, longest_span - 8);
        stats.latstab += Math.floor(longest_span / this.num_frames);
        //Wing Sweep effects
        if (this.is_swept) {
            stats.liftbleed += 5;
            stats.latstab--;
        }
        //Closed Wing effects
        if (this.is_closed) {
            stats.mass += 1;
            stats.control -= 5;
            stats.maxstrain += 20;
        }
        //Stagger effects, monoplane is nothing.
        if (this.wing_list.length > 1) {
            stats = stats.Add(this.stagger_list[this.wing_stagger].stats);
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Wings_HTML extends Display {
    constructor(w) {
        super();
        this.wings = w;
        this.fw_list = [];
        this.mw_list = [];
        this.stagger = document.getElementById("wing_stagger");
        this.closed = document.getElementById("wing_closed");
        this.swept = document.getElementById("wing_swept");
        for (let s of w.GetStaggerList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            this.stagger.append(opt);
        }
        this.stagger.onchange = () => { this.wings.SetStagger(this.stagger.selectedIndex); };
        this.closed.onchange = () => { this.wings.SetClosed(this.closed.checked); };
        this.swept.onchange = () => { this.wings.SetSwept(this.swept.checked); };
        var tbl = document.getElementById("wing_table");
        var full_row = tbl.insertRow();
        var mini_row = tbl.insertRow();
        var full_type = document.createElement("TH");
        full_type.textContent = "Full Wings";
        full_row.appendChild(full_type);
        var mini_type = document.createElement("TH");
        mini_type.textContent = "Miniature Wings";
        mini_row.appendChild(mini_type);
        this.full_cell = full_row.insertCell();
        this.mini_cell = mini_row.insertCell();
        var stat_cell = full_row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Wing Area");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_area = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Max Strain");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, "Lift Bleed");
        var c3_row = tbl_stat.insertRow();
        this.d_maxs = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_lift = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Cost");
        CreateTH(h4_row, "Charge");
        CreateTH(h4_row, "Flammable");
        var c4_row = tbl_stat.insertRow();
        this.d_cost = c4_row.insertCell();
        this.d_chrg = c4_row.insertCell();
        this.d_flam = c4_row.insertCell();
    }
    UpdateDisplay() {
        this.stagger.selectedIndex = this.wings.GetStagger();
        this.closed.checked = this.wings.GetClosed();
        this.closed.disabled = !this.wings.CanClosed();
        this.swept.checked = this.wings.GetSwept();
        if (this.fw_add)
            this.full_cell.removeChild(this.fw_add);
        if (this.mw_add)
            this.mini_cell.removeChild(this.mw_add);
        var wl = this.wings.GetWingList();
        for (let i = 0; i < wl.length; i++) {
            if (this.fw_list.length == i)
                this.AddFullWing();
            this.UpdateFullWing(this.fw_list[i], i, wl[i]);
        }
        while (this.fw_list.length > wl.length) {
            this.PopFullWing();
        }
        var mwl = this.wings.GetMiniWingList();
        for (let i = 0; i < mwl.length; i++) {
            if (this.mw_list.length == i)
                this.AddMiniWing();
            this.UpdateMiniWing(this.mw_list[i], i, mwl[i]);
        }
        while (this.mw_list.length > mwl.length) {
            this.PopMiniWing();
        }
        this.CreateFWAdd(wl.length);
        this.CreateMWAdd(mwl.length);
        var stats = this.wings.PartStats();
        BlinkIfChanged(this.d_area, stats.wingarea.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_chrg, "0"); //stats.charge.toString(); //TODO: Charge
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        if (this.wings.IsFlammable())
            BlinkIfChanged(this.d_flam, "Yes");
        else
            BlinkIfChanged(this.d_flam, "No");
    }
    AddFullWing() {
        var wing = {
            span: document.createElement("SPAN"),
            deck: document.createElement("SELECT"),
            skin: document.createElement("SELECT"),
            area: document.createElement("INPUT"),
            wspan: document.createElement("INPUT"),
            dihedral: document.createElement("INPUT"),
            anhedral: document.createElement("INPUT"),
            br: document.createElement("BR")
        };
        wing.span.appendChild(wing.deck);
        CreateSpace(wing.span);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            wing.deck.append(opt);
        }
        wing.span.appendChild(wing.skin);
        CreateSpace(wing.span);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            wing.skin.append(opt);
        }
        CreateInput(" Area ", wing.area, wing.span, false);
        wing.area.min = "3";
        CreateInput(" Span ", wing.wspan, wing.span, false);
        wing.wspan.min = "1";
        CreateInput(" Dihedral ", wing.dihedral, wing.span, false);
        wing.dihedral.min = "0";
        CreateInput(" Anhedral ", wing.anhedral, wing.span, false);
        wing.anhedral.min = "0";
        this.full_cell.appendChild(wing.span);
        this.full_cell.appendChild(wing.br);
        this.fw_list.push(wing);
    }
    PopFullWing() {
        var wing = this.fw_list.pop();
        this.full_cell.removeChild(wing.span);
        this.full_cell.removeChild(wing.br);
    }
    UpdateFullWing(ht, idx, wing) {
        for (let i = 0; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != i && !this.wings.CanAddFullWing(i) && !this.wings.CanMoveFullWing(idx, i))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.oninput = () => {
            let w = Object.assign({}, wing);
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetFullWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.oninput = () => {
            let w = Object.assign({}, wing);
            w.surface = ht.skin.selectedIndex;
            this.wings.SetFullWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;
        ht.area.onchange = () => {
            let w = Object.assign({}, wing);
            w.area = ht.area.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;
        ht.wspan.onchange = () => {
            let w = Object.assign({}, wing);
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;
        ht.dihedral.onchange = () => {
            let w = Object.assign({}, wing);
            w.dihedral = ht.dihedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.dihedral.max = (wing.span - wing.anhedral - 1).toString();
        ht.dihedral.valueAsNumber = wing.dihedral;
        ht.anhedral.onchange = () => {
            let w = Object.assign({}, wing);
            w.anhedral = ht.anhedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.anhedral.max = (wing.span - wing.dihedral - 1).toString();
        ht.anhedral.valueAsNumber = wing.anhedral;
    }
    AddMiniWing() {
        var wing = {
            span: document.createElement("SPAN"),
            deck: document.createElement("SELECT"),
            skin: document.createElement("SELECT"),
            area: document.createElement("INPUT"),
            wspan: document.createElement("INPUT"),
            dihedral: undefined,
            anhedral: undefined,
            br: document.createElement("BR")
        };
        wing.span.appendChild(wing.deck);
        CreateSpace(wing.span);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            wing.deck.append(opt);
        }
        wing.span.appendChild(wing.skin);
        CreateSpace(wing.span);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION");
            opt.textContent = s.name;
            wing.skin.append(opt);
        }
        CreateInput(" Area ", wing.area, wing.span, false);
        wing.area.min = "1";
        wing.area.max = "2";
        CreateInput(" Span ", wing.wspan, wing.span, false);
        wing.wspan.min = "1";
        this.mini_cell.appendChild(wing.span);
        this.mini_cell.appendChild(wing.br);
        this.mw_list.push(wing);
    }
    UpdateMiniWing(ht, idx, wing) {
        for (let i = 0; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != i && !this.wings.CanAddMiniWing(i) && !this.wings.CanMoveMiniWing(idx, i))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.oninput = () => {
            let w = Object.assign({}, wing);
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetMiniWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;
        ht.skin.oninput = () => {
            let w = Object.assign({}, wing);
            w.surface = ht.skin.selectedIndex;
            this.wings.SetMiniWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;
        ht.area.onchange = () => {
            let w = Object.assign({}, wing);
            w.area = ht.area.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;
        ht.wspan.onchange = () => {
            let w = Object.assign({}, wing);
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;
    }
    PopMiniWing() {
        var wing = this.mw_list.pop();
        this.mini_cell.removeChild(wing.span);
        this.mini_cell.removeChild(wing.br);
    }
    CreateFWAdd(idx) {
        this.fw_add = document.createElement("SELECT");
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        this.fw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (!this.wings.CanAddFullWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            this.fw_add.append(opt);
        }
        this.fw_add.oninput = () => {
            let w = { surface: 0, area: 10, span: 5, dihedral: 0, anhedral: 0, deck: this.fw_add.selectedIndex - 1 };
            this.wings.SetFullWing(idx, w);
        };
        this.fw_add.selectedIndex = 0;
        this.fw_add.disabled = !can;
        this.full_cell.appendChild(this.fw_add);
    }
    CreateMWAdd(idx) {
        this.mw_add = document.createElement("SELECT");
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION");
        none_opt.textContent = "None";
        this.mw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION");
            opt.textContent = d.name;
            if (!this.wings.CanAddMiniWing(i)) {
                opt.disabled = true;
            }
            else {
                can = true;
            }
            this.mw_add.append(opt);
        }
        this.mw_add.oninput = () => {
            let w = { surface: 0, area: 2, span: 2, dihedral: 0, anhedral: 0, deck: this.mw_add.selectedIndex - 1 };
            this.wings.SetMiniWing(idx, w);
        };
        this.mw_add.selectedIndex = 0;
        this.mw_add.disabled = !can;
        this.mini_cell.appendChild(this.mw_add);
    }
}
class Stabilizers extends Part {
    constructor(js) {
        super();
        this.have_tail = false;
        this.is_tandem = false;
        this.is_swept = false;
        this.hstab_sel = 0;
        this.hstab_count = 1;
        this.hstab_list = [];
        for (let elem of js["hstab"]) {
            this.hstab_list.push({
                name: elem["name"],
                is_canard: elem["is_canard"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"]
            });
        }
        this.vstab_sel = 0;
        this.vstab_count = 1;
        this.vstab_list = [];
        for (let elem of js["vstab"]) {
            this.vstab_list.push({
                name: elem["name"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"]
            });
        }
    }
    toJSON() {
        return {
            hstab_sel: this.hstab_sel,
            hstab_count: this.hstab_count,
            vstab_sel: this.vstab_sel,
            vstab_count: this.vstab_count,
        };
    }
    fromJSON(js) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
    }
    GetHStabList() {
        return this.hstab_list;
    }
    GetVStabList() {
        return this.vstab_list;
    }
    GetHStabType() {
        return this.hstab_sel;
    }
    SetHStabType(num) {
        if (this.hstab_list[num].name == "The Wings" && !(this.is_tandem || this.is_swept))
            return;
        if (this.hstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.hstab_list[this.hstab_sel].is_vtail) {
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
        this.hstab_sel = num;
        this.SetHStabCount(this.hstab_count);
        this.CalculateStats();
    }
    GetHValidList() {
        var lst = [];
        for (let t of this.hstab_list) {
            if (t.name == "The Wings" && !(this.is_tandem || this.is_swept))
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    SetVTail() {
        for (let i = 0; i < this.hstab_list.length; i++) {
            if (this.hstab_list[i].is_vtail)
                this.hstab_sel = i;
        }
        for (let i = 0; i < this.vstab_list.length; i++) {
            if (this.vstab_list[i].is_vtail)
                this.vstab_sel = i;
        }
        this.hstab_count = 1;
        this.vstab_count = 0;
    }
    GetVStabType() {
        return this.vstab_sel;
    }
    SetVStabType(num) {
        if (this.vstab_list[num].name == "Outboard" && !this.GetVOutboard())
            return;
        if (this.vstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.vstab_list[this.vstab_sel].is_vtail) {
            this.hstab_sel = 0;
        }
        this.vstab_sel = num;
        this.SetVStabCount(this.vstab_count);
        this.CalculateStats();
    }
    GetVValidList() {
        var lst = [];
        for (let t of this.vstab_list) {
            if (t.name == "Outboard" && !this.GetVOutboard())
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    GetHStabCount() {
        return this.hstab_count;
    }
    SetHStabCount(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.hstab_count = num;
        if (this.hstab_list[this.hstab_sel].increment != 0) {
            while ((this.hstab_count % this.hstab_list[this.hstab_sel].increment) != 0) {
                this.hstab_count++;
            }
        }
        else {
            this.hstab_count = 0;
        }
        this.CalculateStats();
    }
    GetHStabIncrement() {
        return this.hstab_list[this.hstab_sel].increment;
    }
    GetVStabCount() {
        return this.vstab_count;
    }
    SetVStabCount(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.vstab_count = num;
        if (this.vstab_list[this.vstab_sel].increment != 0) {
            while ((this.vstab_count % this.vstab_list[this.vstab_sel].increment) != 0) {
                this.vstab_count++;
            }
        }
        else {
            this.vstab_count = 0;
        }
        this.CalculateStats();
    }
    GetVStabIncrement() {
        return this.vstab_list[this.vstab_sel].increment;
    }
    SetEngineCount(num) {
        this.engine_count = num;
    }
    GetIsTandem() {
        return this.is_tandem;
    }
    SetIsTandem(is) {
        this.is_tandem = is;
    }
    SetIsSwept(is) {
        this.is_swept = is;
    }
    GetVOutboard() {
        return this.is_swept || this.is_tandem || this.hstab_list[this.hstab_sel].is_canard;
    }
    SetWingArea(num) {
        this.wing_area = num;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        //HSTAB
        if (this.hstab_count > 0) {
            stats = stats.Add(this.hstab_list[this.hstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 5 * this.hstab_list[this.hstab_sel].dragfactor);
        }
        else if (this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(this.wing_area / 2);
            stats.liftbleed += 5;
        }
        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            stats.drag += Math.floor(this.wing_area / 10 * this.vstab_list[this.vstab_sel].dragfactor);
        }
        else if (this.vstab_list[this.vstab_sel].increment != 0) {
            stats.latstab -= this.wing_area;
        }
        //Additional stabilizers
        stats.drag += 2 * (Math.max(0, this.hstab_count - 1) + Math.max(0, this.vstab_count - 1));
        //Pairs of stabilizers
        var pairs = 0;
        if (this.vstab_list[this.vstab_sel].is_vtail) //V-Tail
            pairs = this.hstab_count;
        else
            pairs = Math.min(this.hstab_count, this.vstab_count);
        var leftovers = Math.max(this.hstab_count, this.vstab_count) - pairs;
        var es_pairs = Math.min(this.engine_count, pairs);
        leftovers += 2 * (pairs - es_pairs);
        stats.control += 3 * es_pairs + leftovers;
        return stats;
    }
}
class Stabilizers_HTML extends Display {
    constructor(s) {
        super();
        this.stab = s;
        var tbl = document.getElementById("stab_table");
        var row = tbl.insertRow();
        var hcell = row.insertCell();
        var vcell = row.insertCell();
        this.h_type = document.createElement("SELECT");
        this.h_count = document.createElement("INPUT");
        hcell.appendChild(this.h_type);
        hcell.append(document.createElement("BR"));
        CreateInput(" Stabilizers", this.h_count, hcell);
        this.h_count.min = "0";
        this.h_count.max = "20";
        this.h_count.onchange = () => { this.stab.SetHStabCount(this.h_count.valueAsNumber); };
        this.h_type.onchange = () => { this.stab.SetHStabType(this.h_type.selectedIndex); };
        for (let elem of s.GetHStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.h_type.add(opt);
        }
        this.v_type = document.createElement("SELECT");
        this.v_count = document.createElement("INPUT");
        vcell.appendChild(this.v_type);
        vcell.appendChild(document.createElement("BR"));
        CreateInput(" Stabilizers", this.v_count, vcell);
        this.v_count.min = "0";
        this.v_count.max = "20";
        this.v_count.onchange = () => { this.stab.SetVStabCount(this.v_count.valueAsNumber); };
        this.v_type.onchange = () => { this.stab.SetVStabType(this.v_type.selectedIndex); };
        for (let elem of s.GetVStabList()) {
            let opt = document.createElement("OPTION");
            opt.text = elem.name;
            this.v_type.add(opt);
        }
        var stat_cell = row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Control");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_cont = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        CreateTH(h2_row, "Lift Bleed");
        var c2_row = tbl_stat.insertRow();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
    }
    UpdateDisplay() {
        this.h_type.selectedIndex = this.stab.GetHStabType();
        this.v_type.selectedIndex = this.stab.GetVStabType();
        var valid = this.stab.GetHValidList();
        for (let i = 0; i < valid.length; i++) {
            this.h_type.options[i].disabled = !valid[i];
        }
        valid = this.stab.GetVValidList();
        for (let i = 0; i < valid.length; i++) {
            this.v_type.options[i].disabled = !valid[i];
        }
        this.h_count.valueAsNumber = this.stab.GetHStabCount();
        this.h_count.step = this.stab.GetHStabIncrement().toString();
        this.v_count.valueAsNumber = this.stab.GetVStabCount();
        this.v_count.step = this.stab.GetVStabIncrement().toString();
        var stats = this.stab.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
    }
}
class ControlSurfaces extends Part {
    constructor(js) {
        super();
        this.span = 0;
        this.is_cantilever = false;
        this.wing_area = 0;
        this.mp = 0;
        this.aileron_sel = 0;
        this.aileron_list = [];
        for (let elem of js["ailerons"]) {
            this.aileron_list.push({ name: elem["name"], warping: elem["warping"], stats: new Stats(elem) });
        }
        this.rudder_sel = 0;
        this.rudder_list = [];
        for (let elem of js["rudders"]) {
            this.rudder_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.elevator_sel = 0;
        this.elevator_list = [];
        for (let elem of js["elevators"]) {
            this.elevator_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.flaps_sel = 0;
        this.flaps_list = [];
        for (let elem of js["flaps"]) {
            this.flaps_list.push({ name: elem["name"], costfactor: elem["costfactor"], stats: new Stats(elem) });
        }
        this.slats_sel = 0;
        this.slats_list = [];
        for (let elem of js["slats"]) {
            this.slats_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_list = [];
        for (let elem of js["drag_inducers"]) {
            this.drag_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_sel = [...Array(this.drag_list.length).fill(false)];
    }
    toJSON() {
        return {
            aileron_sel: this.aileron_sel,
            rudder_sel: this.rudder_sel,
            elevator_sel: this.elevator_sel,
            flaps_sel: this.flaps_sel,
            slats_sel: this.slats_sel,
            drag_sel: this.drag_sel,
        };
    }
    fromJSON(js) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = js["drag_sel"];
    }
    GetAileronList() {
        return this.aileron_list;
    }
    GetAileron() {
        return this.aileron_sel;
    }
    SetAileron(num) {
        this.aileron_sel = num;
        this.CalculateStats();
    }
    GetRudderList() {
        return this.rudder_list;
    }
    GetRudder() {
        return this.rudder_sel;
    }
    SetRudder(num) {
        this.rudder_sel = num;
        this.CalculateStats();
    }
    GetElevatorList() {
        return this.elevator_list;
    }
    GetElevator() {
        return this.elevator_sel;
    }
    SetElevator(num) {
        this.elevator_sel = num;
        this.CalculateStats();
    }
    GetFlapsList() {
        return this.flaps_list;
    }
    GetFlaps() {
        return this.flaps_sel;
    }
    SetFlaps(num) {
        this.flaps_sel = num;
        this.CalculateStats();
    }
    GetFlapCost(mp) {
        if (mp)
            this.mp = mp;
        return Math.floor(this.flaps_list[this.flaps_sel].costfactor * this.mp);
    }
    GetSlatsList() {
        return this.slats_list;
    }
    GetSlats() {
        return this.slats_sel;
    }
    SetSlats(num) {
        this.slats_sel = num;
        this.CalculateStats();
    }
    GetDragList() {
        return this.drag_list;
    }
    GetDrag() {
        return this.drag_sel;
    }
    SetDrag(num, use) {
        this.drag_sel[num] = use;
        this.CalculateStats();
    }
    SetIsCantilever(use) {
        this.is_cantilever = use;
    }
    SetSpan(span) {
        this.span = span;
    }
    SetWingArea(wa) {
        this.wing_area = wa;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);
        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever)
                stats.cost += 2 * this.wing_area;
        }
        stats = stats.Add(this.rudder_list[this.rudder_sel].stats);
        stats = stats.Add(this.elevator_list[this.elevator_sel].stats);
        stats = stats.Add(this.flaps_list[this.flaps_sel].stats);
        stats = stats.Add(this.slats_list[this.slats_sel].stats);
        for (let i = 0; i < this.drag_list.length; i++) {
            if (this.drag_sel[i])
                stats = stats.Add(this.drag_list[i].stats);
        }
        return stats;
    }
}
class ControlSurfaces_HTML extends Display {
    constructor(cs) {
        super();
        this.cs = cs;
        var tbl = document.getElementById("tbl_control_surfaces");
        var row = tbl.insertRow();
        var cs_cell = row.insertCell();
        this.aileron_select = document.createElement("SELECT");
        for (let a of cs.GetAileronList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.aileron_select.add(opt);
        }
        this.aileron_select.onchange = () => { this.cs.SetAileron(this.aileron_select.selectedIndex); };
        this.rudder_select = document.createElement("SELECT");
        for (let a of cs.GetRudderList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.rudder_select.add(opt);
        }
        this.rudder_select.onchange = () => { this.cs.SetRudder(this.rudder_select.selectedIndex); };
        this.elevator_select = document.createElement("SELECT");
        for (let a of cs.GetElevatorList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.elevator_select.add(opt);
        }
        this.elevator_select.onchange = () => { this.cs.SetElevator(this.elevator_select.selectedIndex); };
        this.flaps_select = document.createElement("SELECT");
        for (let a of cs.GetFlapsList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.flaps_select.add(opt);
        }
        this.flaps_select.onchange = () => { this.cs.SetFlaps(this.flaps_select.selectedIndex); };
        this.slats_select = document.createElement("SELECT");
        for (let a of cs.GetSlatsList()) {
            let opt = document.createElement("OPTION");
            opt.text = a.name;
            this.slats_select.add(opt);
        }
        this.slats_select.onchange = () => { this.cs.SetSlats(this.slats_select.selectedIndex); };
        var fs = CreateFlexSection(cs_cell);
        FlexSelect("Ailerons", this.aileron_select, fs);
        FlexSelect("Rudders", this.rudder_select, fs);
        FlexSelect("Elevators", this.elevator_select, fs);
        FlexSelect("Flaps", this.flaps_select, fs);
        FlexSelect("Slats", this.slats_select, fs);
        var drag_cell = row.insertCell();
        var fs2 = CreateFlexSection(drag_cell);
        this.drag_chbx = [];
        var dlist = cs.GetDragList();
        for (let i = 0; i < dlist.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(dlist[i].name, cbx, fs2);
            cbx.onchange = () => { this.cs.SetDrag(i, cbx.checked); };
            this.drag_chbx.push(cbx);
        }
        this.InitStatDisplay(row.insertCell());
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Lift Bleed");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, " ");
        var c3_row = tbl_stat.insertRow();
        this.d_lift = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_none = c3_row.insertCell();
    }
    UpdateDisplay() {
        this.aileron_select.selectedIndex = this.cs.GetAileron();
        this.rudder_select.selectedIndex = this.cs.GetRudder();
        this.elevator_select.selectedIndex = this.cs.GetElevator();
        this.flaps_select.selectedIndex = this.cs.GetFlaps();
        this.slats_select.selectedIndex = this.cs.GetSlats();
        var drag = this.cs.GetDrag();
        for (let i = 0; i < this.drag_chbx.length; i++) {
            this.drag_chbx[i].checked = drag[i];
        }
        var stats = this.cs.PartStats();
        var cost = stats.cost + this.cs.GetFlapCost();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, cost.toString());
        BlinkIfChanged(this.d_cont, stats.control.toString());
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString());
        BlinkIfChanged(this.d_lstb, stats.latstab.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }
}
class Reinforcement extends Part {
    constructor(js) {
        super();
        this.ext_list = [];
        for (let elem of js["external"]) {
            this.ext_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], stats: new Stats(elem) });
        }
        this.ext_wood_count = [...Array(this.ext_list.length).fill(0)];
        this.ext_steel_count = [...Array(this.ext_list.length).fill(0)];
        this.cant_list = [];
        for (let elem of js["cantilever"]) {
            this.cant_list.push({ name: elem["name"], limited: elem["limited"], stats: new Stats(elem) });
        }
        this.cant_count = [...Array(this.cant_list.length).fill(0)];
        this.wires = false;
        this.is_staggered = false;
        this.is_tandem = false;
        this.is_monoplane = false;
        this.acft_structure = 0;
    }
    toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
        };
    }
    fromJSON(js) {
        this.ext_wood_count = js["ext_wood_count"];
        this.ext_steel_count = js["ext_steel_count"];
        this.cant_count = js["cant_count"];
        this.wires = js["wires"];
    }
    GetExternalList() {
        return this.ext_list;
    }
    GetCantileverList() {
        return this.cant_list;
    }
    GetExternalWoodCount() {
        return this.ext_wood_count;
    }
    SetExternalWoodCount(idx, count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }
    GetExternalSteelCount() {
        return this.ext_steel_count;
    }
    SetExternalSteelCount(idx, count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.ext_steel_count[idx] = count;
        this.CalculateStats();
    }
    GetCantileverCount() {
        return this.cant_count;
    }
    GetIsCantilever() {
        var count = 0;
        for (let c of this.cant_count)
            count += c;
        return count > 0;
    }
    SetCantileverCount(idx, count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }
    ImplSCC(idx, count) {
        var diff = count - this.cant_count[idx];
        if (this.cant_list[idx].limited && this.cant_count[idx] > 0) {
            var total_structure = this.TotalStructure();
            for (let i = 0; i < this.cant_list.length; i++) {
                if (this.cant_list[i].limited) {
                    total_structure -= 5 * this.cant_count[i] * this.cant_list[i].stats.mass;
                }
            }
            diff = Math.min(diff, Math.floor(total_structure / (5 * this.cant_list[idx].stats.mass)));
        }
        this.cant_count[idx] += diff;
        return diff != 0;
    }
    GetWires() {
        return this.wires;
    }
    SetWires(use) {
        this.wires = use;
        this.CalculateStats();
    }
    SetStaggered(is) {
        this.is_staggered = is;
    }
    SetTandem(is) {
        this.is_tandem = is;
    }
    SetMonoplane(is) {
        this.is_monoplane = is;
    }
    SetAcftStructure(struct) {
        var oldstruct = this.acft_structure;
        this.acft_structure = struct;
        var recalc = false;
        if (oldstruct > this.acft_structure) {
            for (let i = this.cant_list.length - 1; i >= 0; i--)
                recalc = recalc || this.ImplSCC(i, this.cant_count[i]);
        }
        if (recalc)
            this.CalculateStats();
    }
    TotalStructure() {
        var struct_count = 0;
        for (let i = 0; i < this.ext_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * 2 * this.ext_list[i].stats.structure;
        }
        return this.acft_structure + struct_count;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var tension_multiple = 1.0;
        if (this.is_monoplane)
            tension_multiple = 0.6;
        else if (this.is_tandem)
            tension_multiple = 0.8;
        else if (this.is_staggered)
            tension_multiple = 0.9;
        var tension = 0;
        var strut_count = 0;
        //Wood Struts
        for (let i = 0; i < this.ext_list.length; i++) {
            strut_count += this.ext_wood_count[i];
            if (this.ext_wood_count[i] > 0) {
                let ts = this.ext_list[i].stats;
                ts = ts.Multiply(this.ext_wood_count[i]);
                stats = stats.Add(ts);
                if (this.ext_list[i].config)
                    tension += tension_multiple * this.ext_list[i].tension * this.ext_wood_count[i];
                else
                    tension += this.ext_list[i].tension * this.ext_wood_count[i];
            }
        }
        //Steel Struts
        for (let i = 0; i < this.ext_list.length; i++) {
            strut_count += this.ext_steel_count[i];
            if (this.ext_steel_count[i] > 0) {
                let ts = this.ext_list[i].stats.Clone();
                ts.structure *= 2;
                ts.cost *= 2;
                ts.maxstrain += 5;
                ts = ts.Multiply(this.ext_steel_count[i]);
                stats = stats.Add(ts);
                if (this.ext_list[i].config)
                    tension += tension_multiple * this.ext_list[i].tension / 2.0 * this.ext_steel_count[i];
                else
                    tension += this.ext_list[i].tension / 2.0 * this.ext_steel_count[i];
            }
        }
        if (this.wires) {
            stats.maxstrain += Math.floor(tension);
            stats.drag += 3 * strut_count;
        }
        var use_cant = false;
        for (let i = 0; i < this.cant_list.length; i++) {
            if (this.cant_count[i] > 0) {
                use_cant = true;
                let ts = this.cant_list[i].stats;
                ts = ts.Multiply(this.cant_count[i]);
                stats = stats.Add(ts);
            }
        }
        if (use_cant)
            stats.cost += 5;
        return stats;
    }
}
class Reinforcement_HTML extends Display {
    constructor(rf) {
        super();
        this.rf = rf;
        this.ext_wood_inp = [];
        this.ext_steel_inp = [];
        this.cant_inp = [];
        var tbl = document.getElementById("tbl_reinforcements");
        var row = tbl.insertRow();
        this.InitExternal(row.insertCell());
        this.InitInternal(row.insertCell());
        this.InitStatDisplay(row.insertCell());
    }
    InitExternal(cell) {
        var fs = CreateFlexSection(cell);
        var div3 = document.createElement("DIV");
        var div4 = document.createElement("DIV");
        var div5 = document.createElement("DIV");
        div3.classList.add("flex-container");
        div4.classList.add("flex-container");
        div5.classList.add("flex-container");
        fs.div0.appendChild(div3);
        fs.div0.appendChild(div4);
        fs.div0.appendChild(div5);
        var fs_wood = { div0: fs.div0, div1: fs.div2, div2: div3 };
        var fs_steel = { div0: fs.div0, div1: div4, div2: div5 };
        var lst = this.rf.GetExternalList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let w_inp = document.createElement("INPUT");
            let s_inp = document.createElement("INPUT");
            FlexLabel(elem.name, fs.div1);
            FlexInput("Wood", w_inp, fs_wood);
            FlexInput("Steel", s_inp, fs_steel);
            w_inp.min = "0";
            s_inp.min = "0";
            w_inp.onchange = () => { this.rf.SetExternalWoodCount(i, w_inp.valueAsNumber); };
            s_inp.onchange = () => { this.rf.SetExternalSteelCount(i, s_inp.valueAsNumber); };
            this.ext_wood_inp.push(w_inp);
            this.ext_steel_inp.push(s_inp);
        }
        this.wires = document.createElement("INPUT");
        FlexCheckbox("Wires", this.wires, fs);
        this.wires.onchange = () => { this.rf.SetWires(this.wires.checked); };
        FlexLabel("", div3);
        FlexLabel("", div4);
        FlexLabel("", div5);
    }
    InitInternal(cell) {
        var fs = CreateFlexSection(cell);
        var lst = this.rf.GetCantileverList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let inp = document.createElement("INPUT");
            FlexInput(elem.name, inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.rf.SetCantileverCount(i, inp.valueAsNumber); };
            this.cant_inp.push(inp);
        }
    }
    InitStatDisplay(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Max Strain");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_maxs = c2_row.insertCell();
        this.d_none = c2_row.insertCell();
    }
    UpdateDisplay() {
        this.wires.checked = this.rf.GetWires();
        var w_count = this.rf.GetExternalWoodCount();
        for (let i = 0; i < w_count.length; i++) {
            this.ext_wood_inp[i].valueAsNumber = w_count[i];
        }
        var s_count = this.rf.GetExternalSteelCount();
        for (let i = 0; i < s_count.length; i++) {
            this.ext_steel_inp[i].valueAsNumber = s_count[i];
        }
        var c_count = this.rf.GetCantileverCount();
        for (let i = 0; i < c_count.length; i++) {
            this.cant_inp[i].valueAsNumber = c_count[i];
        }
        var stats = this.rf.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString());
    }
}
class Fuel extends Part {
    constructor(js) {
        super();
        this.tank_stats = [];
        this.tank_count = [];
        for (let elem of js["tanks"]) {
            this.tank_stats.push({
                name: elem["name"], stats: new Stats(elem),
                internal: elem["internal"], cantilever: elem["cantilever"]
            });
            this.tank_count.push(0);
        }
        this.self_sealing = false;
        this.is_cantilever = false;
        this.wing_area = 0;
    }
    toJSON() {
        return {
            tank_count: this.tank_count,
            self_sealing: this.self_sealing,
            fire_extinguisher: this.fire_extinguisher,
        };
    }
    fromJSON(js) {
        this.tank_count = js["tank_count"];
        this.self_sealing = js["self_sealing"];
        this.fire_extinguisher = js["fire_extinguisher"];
    }
    GetTankList() {
        return this.tank_stats;
    }
    GetTankEnabled() {
        var lst = [];
        for (let e of this.tank_stats) {
            if (!this.is_cantilever && e.cantilever)
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    GetTankCount() {
        return this.tank_count;
    }
    SetTankCount(idx, count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.tank_count[idx] = count;
        this.VerifyOK();
        this.CalculateStats();
    }
    SetCantilever(is) {
        if (this.is_cantilever && !is) {
            this.is_cantilever = is;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.is_cantilever = is;
    }
    SetArea(num) {
        if (this.wing_area > num) {
            this.wing_area = num;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.wing_area = num;
    }
    VerifyOK() {
        //Count cantilever dependent tanks.
        var ccount = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            if (this.tank_stats[i].cantilever)
                ccount += this.tank_count[i];
        }
        //How many can you have?
        var allowed = Math.floor(this.wing_area / 10);
        if (!this.is_cantilever)
            allowed = 0;
        //Do you have more than the allowed?
        var diff = ccount - allowed;
        var mod = diff > 0;
        //Loop over and reduce by one until you don't.
        while (diff > 0) {
            for (let i = this.tank_count.length - 1; i >= 0; i--) {
                if (this.tank_stats[i].cantilever) {
                    this.tank_count[i]--;
                    diff--;
                    break;
                }
            }
        }
        return mod;
    }
    GetSealingEnabled() {
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        return internal_count > 0;
    }
    GetSelfSealing() {
        return this.self_sealing;
    }
    SetSelfSealing(is) {
        this.self_sealing = is;
        this.CalculateStats();
    }
    GetExtinguisher() {
        return this.fire_extinguisher;
    }
    SetExtinguisher(is) {
        this.fire_extinguisher = is;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            let ts = this.tank_stats[i].stats.Clone();
            ts = ts.Multiply(this.tank_count[i]);
            stats = stats.Add(ts);
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        stats.reqsections = Math.ceil(stats.reqsections);
        if (this.self_sealing) {
            stats.mass += internal_count;
            stats.cost += 2 * internal_count;
            stats.warnings.push({ source: "Self-Sealing Gas Tank", warning: "Fuel leak penalty will apply only to the next Fuel Check." });
        }
        if (this.fire_extinguisher) {
            stats.mass += 2;
            stats.cost += 3;
            stats.warnings.push({ source: "Remote Fire Extinguisher", warning: "Spend to put out a fire." });
        }
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        return stats;
    }
}
class Munitions extends Part {
    constructor() {
        super();
        this.bomb_count = 0;
        this.rocket_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }
    toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        };
    }
    fromJSON(js) {
        this.bomb_count = js["bomb_count"];
        this.rocket_count = js["rocket_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
    }
    GetBombCount() {
        return this.bomb_count;
    }
    SetBombCount(count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.bomb_count = count;
        this.LimitMass(true);
        this.CalculateStats();
    }
    GetRocketCount() {
        return this.rocket_count;
    }
    SetRocketCount(count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.rocket_count = count;
        this.LimitMass(false);
        this.CalculateStats();
    }
    GetBay1() {
        return this.internal_bay_1;
    }
    GetBay2() {
        return this.internal_bay_2;
    }
    SetUseBays(bay1, bay2) {
        this.internal_bay_1 = bay1;
        this.internal_bay_2 = bay2;
        if (!this.internal_bay_1 && this.internal_bay_2) {
            this.internal_bay_1 = true;
            this.internal_bay_2 = false;
        }
        this.CalculateStats();
    }
    LimitMass(bomb) {
        var reduce = false;
        while (this.bomb_count + this.rocket_count > this.acft_struct / 5) {
            reduce = true;
            if ((bomb && this.bomb_count > 0)
                || (!bomb && this.rocket_count == 0)) {
                this.bomb_count--;
            }
            else {
                this.rocket_count--;
            }
        }
        return reduce;
    }
    GetExternalMass() {
        var ext_bomb_count = this.bomb_count;
        if (this.internal_bay_1) {
            ext_bomb_count = Math.floor(ext_bomb_count / 2);
            if (this.internal_bay_2) {
                ext_bomb_count = 0;
            }
        }
        var ext_mass = ext_bomb_count + this.rocket_count;
        return ext_mass;
    }
    SetAcftStructure(num) {
        this.acft_struct = num;
        if (this.LimitMass(false)) {
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        // stats.wetmass += this.bomb_count;
        // stats.wetmass += this.rocket_count;
        var ext_bomb_count = this.bomb_count;
        if (this.internal_bay_1) {
            stats.reqsections++;
            ext_bomb_count = Math.floor(ext_bomb_count / 2);
            if (this.internal_bay_2) {
                stats.reqsections++;
                ext_bomb_count = 0;
            }
        }
        var ext_mass = ext_bomb_count + this.rocket_count;
        var rack_mass = Math.ceil(ext_mass / 5);
        stats.mass += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;
        stats.reqsections = Math.ceil(stats.reqsections);
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
}
class CargoAndPassengers extends Part {
    constructor() {
        super();
        this.mass = 0;
        this.pass = 0;
    }
    toJSON() {
        return {
            mass: this.mass,
            pass: this.pass,
        };
    }
    fromJSON(js) {
        this.mass = js["mass"];
        this.pass = js["pass"];
    }
    GetMass() {
        return this.mass;
    }
    SetMass(count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.mass = count;
        this.CalculateStats();
    }
    GetPassengers() {
        return this.pass;
    }
    SetPassengers(count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.pass = count;
        this.CalculateStats();
    }
    SetSeats(count) {
        this.seats = count;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats.wetmass += Math.max(this.pass, this.seats);
        //Can be placed in cargo space, if uncomfortably. Takes 3 mass.
        if (this.pass > this.seats) {
            stats.wetmass += 3 * (this.pass - this.seats);
        }
        else {
            //Cargo can be placed in half seats.
            var emptyseat = this.seats - this.pass;
            if (this.mass - emptyseat > 0)
                stats.wetmass += this.mass - emptyseat;
        }
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        return stats;
    }
}
class Load_HTML extends Display {
    constructor(fuel, boom, cargo) {
        super();
        this.fuel = fuel;
        this.boom = boom;
        this.cargo = cargo;
        this.fuel_list = [];
        var tbl = document.getElementById("tbl_load");
        var row = tbl.insertRow();
        this.InitFuel(row.insertCell());
        this.InitMunitions(row.insertCell());
        this.InitCargoAndPassengers(row.insertCell());
        this.InitStats(row.insertCell());
    }
    InitFuel(cell) {
        var lst = this.fuel.GetTankList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lst[i].name, inp, fs);
            inp.onchange = () => { this.fuel.SetTankCount(i, inp.valueAsNumber); };
            this.fuel_list.push(inp);
        }
        this.seal = document.createElement("INPUT");
        FlexCheckbox("Self-Sealing Gas Tank", this.seal, fs);
        this.seal.onchange = () => { this.fuel.SetSelfSealing(this.seal.checked); };
        this.extinguish = document.createElement("INPUT");
        FlexCheckbox("Remote Fire Extinguisher", this.extinguish, fs);
        this.extinguish.onchange = () => { this.fuel.SetExtinguisher(this.extinguish.checked); };
    }
    InitMunitions(cell) {
        var fs = CreateFlexSection(cell);
        this.bombs = document.createElement("INPUT");
        FlexInput("Bombs", this.bombs, fs);
        this.bombs.onchange = () => { this.boom.SetBombCount(this.bombs.valueAsNumber); };
        this.rockets = document.createElement("INPUT");
        FlexInput("Rockets", this.rockets, fs);
        this.rockets.onchange = () => { this.boom.SetRocketCount(this.rockets.valueAsNumber); };
        this.bay1 = document.createElement("INPUT");
        FlexCheckbox("Internal Bay 1", this.bay1, fs);
        this.bay1.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
        this.bay2 = document.createElement("INPUT");
        FlexCheckbox("Internal Bay 2", this.bay2, fs);
        this.bay2.onchange = () => { this.boom.SetUseBays(this.bay1.checked, this.bay2.checked); };
    }
    InitCargoAndPassengers(cell) {
        var fs = CreateFlexSection(cell);
        this.carg = document.createElement("INPUT");
        FlexInput("Cargo", this.carg, fs);
        this.carg.onchange = () => { this.cargo.SetMass(this.carg.valueAsNumber); };
        this.pass = document.createElement("INPUT");
        FlexInput("Passengers", this.pass, fs);
        this.pass.onchange = () => { this.cargo.SetPassengers(this.pass.valueAsNumber); };
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Wet Mass");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_wmas = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Fuel");
        CreateTH(h2_row, "Cost");
        var c2_row = tbl_stat.insertRow();
        this.d_rsec = c2_row.insertCell();
        this.d_fuel = c2_row.insertCell();
        this.d_cost = c2_row.insertCell();
    }
    UpdateDisplay() {
        var fl = this.fuel.GetTankCount();
        var fe = this.fuel.GetTankEnabled();
        for (let i = 0; i < fl.length; i++) {
            this.fuel_list[i].valueAsNumber = fl[i];
            this.fuel_list[i].disabled = !fe[i];
        }
        this.seal.checked = this.fuel.GetSelfSealing();
        this.seal.disabled = !this.fuel.GetSealingEnabled();
        this.extinguish.checked = this.fuel.GetExtinguisher();
        this.bombs.valueAsNumber = this.boom.GetBombCount();
        this.rockets.valueAsNumber = this.boom.GetRocketCount();
        this.bay1.checked = this.boom.GetBay1();
        this.bay2.checked = this.boom.GetBay2();
        if (this.boom.GetBombCount() > 0) {
            this.bay1.disabled = false;
            if (this.bay1.checked)
                this.bay2.disabled = false;
            else
                this.bay2.disabled = true;
        }
        else {
            this.bay1.disabled = true;
            this.bay2.disabled = true;
        }
        this.carg.valueAsNumber = this.cargo.GetMass();
        this.pass.valueAsNumber = this.cargo.GetPassengers();
        var stats = new Stats();
        stats = stats.Add(this.fuel.PartStats());
        stats = stats.Add(this.boom.PartStats());
        stats = stats.Add(this.cargo.PartStats());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_wmas, stats.wetmass.toString());
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString());
        BlinkIfChanged(this.d_fuel, stats.fuel.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
    }
}
class LandingGear extends Part {
    constructor(js) {
        super();
        this.gear_list = [];
        this.gear_sel = 0;
        this.retract = false;
        for (let elem of js["gear"]) {
            this.gear_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                DpLMP: elem["DpLMP"],
                SpLMP: elem["SpLMP"],
                can_retract: elem["can_retract"]
            });
        }
        this.extra_list = [];
        for (let elem of js["extras"]) {
            this.extra_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                MpLMP: elem["MpLMP"]
            });
        }
        this.extra_sel = [...Array(this.extra_list.length).fill(false)];
    }
    toJSON() {
        return {
            gear_sel: this.gear_sel,
            retract: this.retract,
            extra_sel: this.extra_sel,
        };
    }
    fromJSON(js) {
        this.gear_sel = js["gear_sel"];
        this.retract = js["retract"];
        this.extra_sel = js["extra_sel"];
    }
    GetGearName() {
        if (this.retract)
            return "Retractable " + this.gear_list[this.gear_sel].name;
        else
            return this.gear_list[this.gear_sel].name;
    }
    GetGearList() {
        return this.gear_list;
    }
    GetGear() {
        return this.gear_sel;
    }
    SetGear(num) {
        this.gear_sel = num;
        this.CalculateStats();
    }
    CanRetract() {
        return this.gear_list[this.gear_sel].can_retract;
    }
    GetRetract() {
        return this.retract;
    }
    SetRetract(is) {
        this.retract = is && this.CanRetract();
        this.CalculateStats();
    }
    GetExtraList() {
        return this.extra_list;
    }
    GetExtraSelected() {
        return this.extra_sel;
    }
    SetExtraSelected(idx, is) {
        this.extra_sel[idx] = is;
        this.CalculateStats();
    }
    SetLoadedMass(mass) {
        this.loadedMP = Math.floor(mass / 5);
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.gear_list[this.gear_sel].stats);
        var pdrag = this.gear_list[this.gear_sel].DpLMP * this.loadedMP;
        if (this.retract) {
            stats.mass += Math.floor(pdrag / 2);
            stats.cost += Math.floor(pdrag / 2);
        }
        else {
            stats.drag += pdrag;
        }
        stats.structure += this.gear_list[this.gear_sel].SpLMP * this.loadedMP;
        for (let i = 0; i < this.extra_list.length; i++) {
            if (this.extra_sel[i]) {
                stats = stats.Add(this.extra_list[i].stats);
                stats.mass += this.extra_list[i].MpLMP * this.loadedMP;
            }
        }
        return stats;
    }
}
class LandingGear_HTML extends Display {
    constructor(gear) {
        super();
        this.gear = gear;
        var tbl = document.getElementById("tbl_gear");
        var row = tbl.insertRow();
        this.InitGear(row.insertCell());
        this.InitExtras(row.insertCell());
        this.InitStats(row.insertCell());
    }
    InitGear(cell) {
        var lst = this.gear.GetGearList();
        var fs = CreateFlexSection(cell);
        this.sel = document.createElement("SELECT");
        FlexSelect("Type", this.sel, fs);
        for (let i = 0; i < lst.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lst[i].name;
            this.sel.add(opt);
        }
        this.sel.onchange = () => { this.gear.SetGear(this.sel.selectedIndex); };
        this.retract = document.createElement("INPUT");
        FlexCheckbox("Retractable", this.retract, fs);
        this.retract.onchange = () => { this.gear.SetRetract(this.retract.checked); };
    }
    InitExtras(cell) {
        this.extras = [];
        var lst = this.gear.GetExtraList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let cbx = document.createElement("INPUT");
            FlexCheckbox(lst[i].name, cbx, fs);
            cbx.onchange = () => { this.gear.SetExtraSelected(i, cbx.checked); };
            this.extras.push(cbx);
        }
    }
    InitStats(stat_cell) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Crash Safety");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        c2_row.insertCell();
    }
    UpdateDisplay() {
        this.sel.selectedIndex = this.gear.GetGear();
        this.retract.checked = this.gear.GetRetract();
        this.retract.disabled = !this.gear.CanRetract();
        var lst = this.gear.GetExtraSelected();
        for (let i = 0; i < lst.length; i++) {
            this.extras[i].checked = lst[i];
        }
        var stats = this.gear.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString());
    }
}
class Accessories extends Part {
    constructor(js) {
        super();
        this.armour_coverage = 0;
        this.armour_AP = 0;
        this.acft_power = 0;
        this.electric_list = [];
        for (let elem of js["electrical"]) {
            this.electric_list.push({
                name: elem["name"], stats: new Stats(elem),
                cp10p: elem["cp10p"]
            });
        }
        this.electrical_count = [...Array(this.electric_list.length).fill(0)];
        this.radio_list = [];
        this.radio_sel = 0;
        for (let elem of js["radios"]) {
            this.radio_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.info_list = [];
        for (let elem of js["information"]) {
            this.info_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.info_sel = [...Array(this.info_list.length).fill(false)];
        this.visi_list = [];
        for (let elem of js["visibility"]) {
            this.visi_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.visi_sel = [...Array(this.visi_list.length).fill(false)];
        this.clim_list = [];
        for (let elem of js["climate"]) {
            this.clim_list.push({ name: elem["name"], stats: new Stats(elem), req_radiator: elem["req_radiator"] });
        }
        this.clim_sel = [...Array(this.clim_list.length).fill(false)];
        this.auto_list = [];
        this.auto_sel = 0;
        for (let elem of js["autopilots"]) {
            this.auto_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cont_list = [];
        this.cont_sel = 0;
        for (let elem of js["control"]) {
            this.cont_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            armour_coverage: this.armour_coverage,
            armour_AP: this.armour_AP,
            electrical_count: this.electrical_count,
            radio_sel: this.radio_sel,
            info_sel: this.info_sel,
            visi_sel: this.visi_sel,
            clim_sel: this.clim_sel,
            auto_sel: this.auto_sel,
            cont_sel: this.cont_sel,
        };
    }
    fromJSON(js) {
        this.armour_coverage = js["armour_coverage"];
        this.armour_AP = js["armour_AP"];
        this.electrical_count = js["electrical_count"];
        this.radio_sel = js["radio_sel"];
        this.info_sel = js["info_sel"];
        this.visi_sel = js["visi_sel"];
        this.clim_sel = js["clim_sel"];
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }
    GetCommunicationName() {
        return this.radio_list[this.radio_sel].name;
    }
    GetArmourCoverage() {
        return this.armour_coverage;
    }
    SetArmourCoverage(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.armour_coverage = num;
        this.CalculateStats();
    }
    GetArmourAP() {
        return this.armour_AP;
    }
    SetArmourAP(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        this.armour_AP = num;
        this.CalculateStats();
    }
    GetElectricalList() {
        return this.electric_list;
    }
    GetElectricalCount() {
        return this.electrical_count;
    }
    SetElectricalCount(idx, count) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        count = Math.min(count, 5);
        this.electrical_count[idx] = count;
        this.CalculateStats();
    }
    GetRadioList() {
        return this.radio_list;
    }
    GetRadioSel() {
        return this.radio_sel;
    }
    SetRadioSel(num) {
        this.radio_sel = num;
        this.CalculateStats();
    }
    GetInfoList() {
        return this.info_list;
    }
    GetInfoSel() {
        return this.info_sel;
    }
    SetInfoSel(idx, use) {
        this.info_sel[idx] = use;
        this.CalculateStats();
    }
    GetVisibilityList() {
        return this.visi_list;
    }
    GetVisibilitySel() {
        return this.visi_sel;
    }
    SetVisibilitySel(idx, use) {
        this.visi_sel[idx] = use;
        this.CalculateStats();
    }
    GetClimateList() {
        return this.clim_list;
    }
    GetClimateSel() {
        return this.clim_sel;
    }
    GetClimateEnable() {
        var can = [];
        for (let c of this.clim_list) {
            if (!this.acft_rad && c.req_radiator)
                can.push(false);
            else
                can.push(true);
        }
        return can;
    }
    SetClimateSel(idx, use) {
        this.clim_sel[idx] = use;
        this.CalculateStats();
    }
    GetAutopilotList() {
        return this.auto_list;
    }
    GetAutopilotSel() {
        return this.auto_sel;
    }
    SetAutopilotSel(num) {
        this.auto_sel = num;
        this.CalculateStats();
    }
    GetControlList() {
        return this.cont_list;
    }
    GetControlSel() {
        return this.cont_sel;
    }
    SetControlSel(num) {
        this.cont_sel = num;
        this.CalculateStats();
    }
    SetAcftPower(pwr) {
        this.acft_power = pwr;
    }
    SetAcftRadiator(have) {
        this.acft_rad = have;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        //Armour
        stats.mass += this.armour_coverage * this.armour_AP;
        stats.cost += Math.floor(this.armour_coverage * this.armour_AP / 3);
        stats.toughness += this.armour_coverage * this.armour_AP;
        //Electrical
        for (let i = 0; i < this.electrical_count.length; i++) {
            let ts = this.electric_list[i].stats.Clone();
            ts = ts.Multiply(this.electrical_count[i]);
            stats = stats.Add(ts);
            stats.charge += Math.floor(this.electrical_count[i] * this.electric_list[i].cp10p * this.acft_power / 10);
        }
        stats = stats.Add(this.radio_list[this.radio_sel].stats);
        //Information
        for (let i = 0; i < this.info_list.length; i++) {
            if (this.info_sel[i])
                stats = stats.Add(this.info_list[i].stats);
        }
        //Visibility
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i])
                stats = stats.Add(this.visi_list[i].stats);
        }
        //Climate
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && (!this.clim_list[i].req_radiator || this.acft_rad))
                stats = stats.Add(this.clim_list[i].stats);
        }
        //Control
        stats = stats.Add(this.auto_list[this.auto_sel].stats);
        stats = stats.Add(this.cont_list[this.cont_sel].stats);
        return stats;
    }
}
class Accessories_HTML extends Display {
    constructor(acc) {
        super();
        this.acc = acc;
        var tbl = document.getElementById("tbl_accessories");
        var row = tbl.insertRow(1);
        this.InitArmour(row.insertCell());
        this.InitElectrical(row.insertCell());
        this.InitInformation(row.insertCell());
        this.InitStats(row.insertCell());
        row = tbl.insertRow();
        this.InitVisibility(row.insertCell());
        this.InitClimate(row.insertCell());
        this.InitControl(row.insertCell());
    }
    InitArmour(cell) {
        var fs = CreateFlexSection(cell);
        this.a_coverage = document.createElement("INPUT");
        FlexInput("Coverage", this.a_coverage, fs);
        this.a_coverage.onchange = () => { this.acc.SetArmourCoverage(this.a_coverage.valueAsNumber); };
        this.a_AP = document.createElement("INPUT");
        FlexInput("AP", this.a_AP, fs);
        this.a_AP.onchange = () => { this.acc.SetArmourAP(this.a_AP.valueAsNumber); };
    }
    InitElectrical(cell) {
        var fs = CreateFlexSection(cell);
        this.radio = document.createElement("SELECT");
        FlexSelect("Radio", this.radio, fs);
        var rlist = this.acc.GetRadioList();
        for (let i = 0; i < rlist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = rlist[i].name;
            this.radio.add(opt);
        }
        this.radio.onchange = () => { this.acc.SetRadioSel(this.radio.selectedIndex); };
        this.elect = [];
        var elist = this.acc.GetElectricalList();
        for (let i = 0; i < elist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(elist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetElectricalCount(i, inp.valueAsNumber); };
            this.elect.push(inp);
        }
    }
    InitInformation(cell) {
        var fs = CreateFlexSection(cell);
        var ilist = this.acc.GetInfoList();
        this.info = [];
        for (let i = 0; i < ilist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(ilist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetInfoSel(i, inp.checked); };
            this.info.push(inp);
        }
    }
    InitVisibility(cell) {
        var fs = CreateFlexSection(cell);
        var vlist = this.acc.GetVisibilityList();
        this.visi = [];
        for (let i = 0; i < vlist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(vlist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetVisibilitySel(i, inp.checked); };
            this.visi.push(inp);
        }
    }
    InitClimate(cell) {
        var fs = CreateFlexSection(cell);
        var clist = this.acc.GetClimateList();
        this.clim = [];
        for (let i = 0; i < clist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(clist[i].name, inp, fs);
            inp.onchange = () => { this.acc.SetClimateSel(i, inp.checked); };
            this.clim.push(inp);
        }
    }
    InitControl(cell) {
        var fs = CreateFlexSection(cell);
        this.auto = document.createElement("SELECT");
        var alist = this.acc.GetAutopilotList();
        FlexSelect("Autopilot", this.auto, fs);
        for (let i = 0; i < alist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = alist[i].name;
            this.auto.add(opt);
        }
        this.auto.onchange = () => { this.acc.SetAutopilotSel(this.auto.selectedIndex); };
        var clist = this.acc.GetControlList();
        this.cont = document.createElement("SELECT");
        FlexSelect("Control Aids", this.cont, fs);
        for (let i = 0; i < clist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = clist[i].name;
            this.cont.add(opt);
        }
        this.cont.onchange = () => { this.acc.SetControlSel(this.cont.selectedIndex); };
    }
    InitStats(stat_cell) {
        stat_cell.rowSpan = 3;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Cost");
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Structure");
        CreateTH(h2_row, "Charge");
        CreateTH(h2_row, "Lift Bleed");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_chgh = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Visibility");
        CreateTH(h3_row, "Flight Stress");
        CreateTH(h3_row, "");
        var c3_row = tbl_stat.insertRow();
        this.d_visi = c3_row.insertCell();
        this.d_strs = c3_row.insertCell();
        c3_row.insertCell();
    }
    UpdateDisplay() {
        this.a_coverage.valueAsNumber = this.acc.GetArmourCoverage();
        this.a_AP.valueAsNumber = this.acc.GetArmourAP();
        this.radio.selectedIndex = this.acc.GetRadioSel();
        var elist = this.acc.GetElectricalCount();
        for (let i = 0; i < elist.length; i++) {
            this.elect[i].valueAsNumber = elist[i];
        }
        var ilist = this.acc.GetInfoSel();
        for (let i = 0; i < ilist.length; i++) {
            this.info[i].checked = ilist[i];
        }
        var vlist = this.acc.GetVisibilitySel();
        for (let i = 0; i < vlist.length; i++) {
            this.visi[i].checked = vlist[i];
        }
        var clist = this.acc.GetClimateSel();
        var cenab = this.acc.GetClimateEnable();
        for (let i = 0; i < vlist.length; i++) {
            this.clim[i].checked = clist[i];
            this.clim[i].disabled = !cenab[i];
        }
        this.auto.selectedIndex = this.acc.GetAutopilotSel();
        this.cont.selectedIndex = this.acc.GetControlSel();
        var stats = this.acc.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_strc, stats.structure.toString());
        BlinkIfChanged(this.d_chgh, stats.charge.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_strs, stats.flightstress.toString());
    }
}
class Optimization extends Part {
    constructor() {
        super();
        this.free_dots = 0;
        this.cost = 0;
        this.bleed = 0;
        this.escape = 0;
        this.mass = 0;
        this.toughness = 0;
        this.maxstrain = 0;
        this.reliability = 0;
        this.drag = 0;
        this.acft_stats = new Stats;
    }
    toJSON() {
        return {
            free_dots: this.free_dots,
            cost: this.cost,
            bleed: this.bleed,
            escape: this.escape,
            mass: this.mass,
            toughness: this.toughness,
            maxstrain: this.maxstrain,
            reliability: this.reliability,
            drag: this.drag,
        };
    }
    fromJSON(js) {
        this.free_dots = js["free_dots"];
        this.cost = js["cost"];
        this.bleed = js["bleed"];
        this.escape = js["escape"];
        this.mass = js["mass"];
        this.toughness = js["toughness"];
        this.maxstrain = js["maxstrain"];
        this.reliability = js["reliability"];
        this.drag = js["drag"];
    }
    GetUnassignedCount() {
        return this.free_dots - this.cost - this.bleed
            - this.escape - this.mass - this.toughness - this.maxstrain
            - this.reliability - this.drag;
    }
    ReduceDots() {
        var diff = -this.GetUnassignedCount();
        if (diff > 0) {
            let d = Math.min(diff, this.drag);
            d = Math.max(d, 0);
            this.drag -= d;
            diff -= d;
            d = Math.min(diff, this.reliability);
            d = Math.max(d, 0);
            this.reliability -= d;
            diff -= d;
            d = Math.min(diff, this.maxstrain);
            d = Math.max(d, 0);
            this.maxstrain -= d;
            diff -= d;
            d = Math.min(diff, this.toughness);
            d = Math.max(d, 0);
            this.toughness -= d;
            diff -= d;
            d = Math.min(diff, this.mass);
            d = Math.max(d, 0);
            this.mass -= d;
            diff -= d;
            d = Math.min(diff, this.escape);
            d = Math.max(d, 0);
            this.escape -= d;
            diff -= d;
            d = Math.min(diff, this.bleed);
            d = Math.max(d, 0);
            this.bleed -= d;
            diff -= d;
            d = Math.min(diff, this.cost);
            d = Math.max(d, 0);
            this.cost -= d;
            diff -= d;
        }
    }
    GetFreeDots() {
        return this.free_dots;
    }
    SetFreeDots(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, 0);
        this.free_dots = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetCost() {
        return this.cost;
    }
    SetCost(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.cost = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetBleed() {
        return this.bleed;
    }
    SetBleed(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.bleed = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetEscape() {
        return this.escape;
    }
    SetEscape(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.escape = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetMass() {
        return this.mass;
    }
    SetMass(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.mass = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetToughness() {
        return this.toughness;
    }
    SetToughness(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.toughness = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetMaxStrain() {
        return this.maxstrain;
    }
    SetMaxStrain(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.maxstrain = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetReliabiilty() {
        return this.reliability;
    }
    SetReliability(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.reliability = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetDrag() {
        return this.drag;
    }
    SetDrag(num) {
        if (num != num)
            num = 0;
        num = Math.floor(num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.drag = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    SetAcftStats(stats) {
        this.acft_stats = stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats.cost = -Math.floor(this.cost * this.acft_stats.cost / 10);
        stats.liftbleed = -this.bleed * 2;
        stats.escape = this.escape;
        stats.visibility = this.escape;
        stats.mass = -Math.floor(this.mass * this.acft_stats.mass / 20);
        stats.toughness = Math.floor(this.toughness * this.acft_stats.toughness / 5);
        stats.maxstrain = Math.floor(this.maxstrain * this.acft_stats.maxstrain / 10);
        stats.reliability = this.reliability * 2;
        stats.drag = -Math.floor(this.drag * this.acft_stats.drag / 20);
        var dot_cost = Math.abs(this.cost) + Math.abs(this.bleed)
            + Math.abs(this.escape) + Math.abs(this.mass)
            + Math.abs(this.toughness) + Math.abs(this.maxstrain)
            + Math.abs(this.reliability) + Math.abs(this.drag) - this.free_dots;
        stats.cost += Math.max(0, dot_cost);
        return stats;
    }
}
class Optimization_HTML extends Display {
    constructor(opt) {
        super();
        this.opt = opt;
        this.free_inp = document.getElementById("num_opt");
        this.free_inp.onchange = () => { this.opt.SetFreeDots(this.free_inp.valueAsNumber); };
        var tbl = document.getElementById("tbl_optimization");
        var row1 = tbl.insertRow();
        this.cost_cbx = this.InitRow(row1, "Expense: +/- 10% Cost", (num) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(tbl.insertRow(), "Lift Efficienty: +/- 2 Lift Bleed", (num) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(tbl.insertRow(), "Leg Room: +/- 1 Escape, Visibility", (num) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(tbl.insertRow(), "Mass: +/- 5% Mass", (num) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(tbl.insertRow(), "Redundancy: +/- 20% Toughness ", (num) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(tbl.insertRow(), "Support: +/- 10% Max Strain", (num) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(tbl.insertRow(), "Reliability: +/- 2 Reliability", (num) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(tbl.insertRow(), "Streamlining: +/- 5% Drag", (num) => this.opt.SetDrag(num));
        this.InitStatDisplay(row1.insertCell());
    }
    InitRow(row, txt, call) {
        var cbxs = [];
        for (let i = 0; i < 6; i++) {
            cbxs.push(document.createElement("INPUT"));
            cbxs[i].setAttribute("type", "checkbox");
            if (i < 3)
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 3);
                    else
                        call(i - 2);
                };
            else
                cbxs[i].onchange = () => {
                    if (cbxs[i].checked)
                        call(i - 2);
                    else
                        call(i - 3);
                };
        }
        var ncell = row.insertCell();
        var ecell = row.insertCell();
        var pcell = row.insertCell();
        ncell.appendChild(cbxs[0]);
        ncell.appendChild(cbxs[1]);
        ncell.appendChild(cbxs[2]);
        ecell.innerHTML = txt;
        pcell.appendChild(cbxs[3]);
        pcell.appendChild(cbxs[4]);
        pcell.appendChild(cbxs[5]);
        return cbxs;
    }
    InitStatDisplay(stat_cell) {
        stat_cell.rowSpan = 0;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Cost");
        CreateTH(h1_row, "Lift Bleed");
        CreateTH(h1_row, "Escape");
        var c1_row = tbl_stat.insertRow();
        this.d_cost = c1_row.insertCell();
        this.d_lift = c1_row.insertCell();
        this.d_escp = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Visibility");
        CreateTH(h2_row, "Mass");
        CreateTH(h2_row, "Toughness");
        var c2_row = tbl_stat.insertRow();
        this.d_visi = c2_row.insertCell();
        this.d_mass = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Max Strain");
        CreateTH(h3_row, "Reliability");
        CreateTH(h3_row, "Drag");
        var c3_row = tbl_stat.insertRow();
        this.d_mstr = c3_row.insertCell();
        this.d_reli = c3_row.insertCell();
        this.d_drag = c3_row.insertCell();
    }
    UpdateChecked(num, lst) {
        for (let i = 0; i < lst.length; i++)
            lst[i].checked = false;
        if (num < 0) {
            lst[2].checked = true;
            if (num < -1) {
                lst[1].checked = true;
                if (num < -2)
                    lst[0].checked = true;
            }
        }
        else if (num > 0) {
            lst[3].checked = true;
            if (num > 1) {
                lst[4].checked = true;
                if (num > 2)
                    lst[5].checked = true;
            }
        }
    }
    UpdateEnabled(num, lst) {
        var free = 0;
        for (let i = 3; i < lst.length; i++) {
            if (!lst[i].checked)
                free++;
            lst[i].disabled = free > num;
        }
    }
    UpdateDisplay() {
        this.free_inp.valueAsNumber = this.opt.GetFreeDots();
        //Update Checked
        this.UpdateChecked(this.opt.GetCost(), this.cost_cbx);
        this.UpdateChecked(this.opt.GetBleed(), this.bleed_cbx);
        this.UpdateChecked(this.opt.GetEscape(), this.escape_cbx);
        this.UpdateChecked(this.opt.GetMass(), this.mass_cbx);
        this.UpdateChecked(this.opt.GetToughness(), this.toughness_cbx);
        this.UpdateChecked(this.opt.GetMaxStrain(), this.maxstrain_cbx);
        this.UpdateChecked(this.opt.GetReliabiilty(), this.reliability_cbx);
        this.UpdateChecked(this.opt.GetDrag(), this.drag_cbx);
        //Update Enabled
        var can_dot = this.opt.GetUnassignedCount();
        this.UpdateEnabled(can_dot, this.cost_cbx);
        this.UpdateEnabled(can_dot, this.bleed_cbx);
        this.UpdateEnabled(can_dot, this.escape_cbx);
        this.UpdateEnabled(can_dot, this.mass_cbx);
        this.UpdateEnabled(can_dot, this.toughness_cbx);
        this.UpdateEnabled(can_dot, this.maxstrain_cbx);
        this.UpdateEnabled(can_dot, this.reliability_cbx);
        this.UpdateEnabled(can_dot, this.drag_cbx);
        //Update Stats
        var stats = this.opt.PartStats();
        BlinkIfChanged(this.d_cost, stats.cost.toString());
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString());
        BlinkIfChanged(this.d_escp, stats.escape.toString());
        BlinkIfChanged(this.d_visi, stats.visibility.toString());
        BlinkIfChanged(this.d_mass, stats.mass.toString());
        BlinkIfChanged(this.d_tugh, stats.toughness.toString());
        BlinkIfChanged(this.d_mstr, stats.maxstrain.toString());
        BlinkIfChanged(this.d_reli, stats.reliability.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
    }
}
