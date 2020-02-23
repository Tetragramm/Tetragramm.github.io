//TODO: Warnings
//TODO: Engine as Generator
//TODO: Weapons
//TODO: Radiator requries Parasol wing
//TODO: Torque is Structure or Strain
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
    loadJSON('/parts.json', (response) => {
        // Parse JSON string into object
        let actual_JSON = JSON.parse(response);
        aircraft_model = new Aircraft(actual_JSON);
        aircraft_display = new Aircraft_HTML(actual_JSON, aircraft_model);
        aircraft_model.CalculateStats();
    });
};
window.onload = init;
var aircraft_model;
var aircraft_display;
// When the user clicks on div, open the popup
const RulesPopup = (e) => {
    var children = e.children;
    for (let c of children) {
        if (c.className.includes("rulestext")) {
            c.classList.toggle("show");
            break;
        }
    }
};
//Works like Python string formatting.
function format(fmt, ...args) {
    if (!fmt.match(/^(?:(?:(?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{[0-9]+\}))+$/)) {
        throw new Error('invalid format string.');
    }
    return fmt.replace(/((?:[^{}]|(?:\{\{)|(?:\}\}))+)|(?:\{([0-9]+)\})/g, (m, str, index) => {
        if (str) {
            return str.replace(/(?:{{)|(?:}})/g, m => m[0]);
        }
        else {
            if (index >= args.length) {
                throw new Error('argument index is out of range in format');
            }
            return args[index];
        }
    });
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
        if (js) {
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
        }
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
        return res;
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
        return res;
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
        this.era = new Era_HTML(js["era"], this.acft.GetEra());
        this.cockpits = new Cockpits_HTML(js["cockpit"], aircraft.GetCockpits());
        this.passengers = new Passengers_HTML(js["passengers"], aircraft.GetPassengers());
        this.engines = new Engines_HTML(js["engines"], aircraft.GetEngines());
        this.propeller = new Propeller_HTML(js["propellers"], aircraft.GetPropeller());
        this.frames = new Frames_HTML(js["frames"], aircraft.GetFrames());
        // this.engines.Initialize();
        this.acft.SetDisplayCallback(() => { this.UpdateDisplay(); });
        this.UpdateDisplay();
    }
    UpdateDisplay() {
        this.era.UpdateDisplay();
        this.cockpits.UpdateDisplay();
        this.passengers.UpdateDisplay();
        this.engines.UpdateDisplay();
        this.propeller.UpdateDisplay();
        this.frames.UpdateDisplay();
    }
}
class Aircraft {
    constructor(js) {
        this.stats = new Stats();
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.wings.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetNumberOfCockpits(1);
        this.frames.SetTailType(1);
        this.wings.SetNumberOfWings(4);
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        this.stats = new Stats();
        this.stats = this.stats.Add(this.era.PartStats());
        this.stats = this.stats.Add(this.cockpits.PartStats());
        this.stats = this.stats.Add(this.passengers.PartStats());
        this.stats = this.stats.Add(this.engines.PartStats());
        this.stats = this.stats.Add(this.propeller.PartStats());
        this.stats = this.stats.Add(this.wings.PartStats());
        this.frames.SetRequiredSections(this.stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.stats = this.stats.Add(this.frames.PartStats());
        //Update Part Local stuff
        this.cockpits.UpdateCrewStats(this.stats);
        this.engines.UpdateReliability(this.stats);
        if (this.DisplayCallback)
            this.DisplayCallback();
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
}
class Era_HTML extends Display {
    constructor(js, m) {
        super();
        this.model = m;
        this.PopulateRules(js);
        //Get used elements
        var sel = document.getElementById("select_era");
        this.bleed = document.getElementById("liftbleed_era");
        sel.required = true;
        //When selection changes, change value and RecalculateTotals
        sel.onchange = () => {
            this.model.SetSelected(sel.selectedIndex);
        };
        //For each element create an option,
        //    add it to the select
        for (let elem of this.model.GetEraOptions()) {
            var opt = document.createElement("OPTION");
            opt.text = elem.name;
            sel.add(opt);
        }
        sel.onchange(new Event("Origin"));
    }
    PopulateRules(js) {
        //Format the rules and set the tooltip.
        var tooltip = document.getElementById("rules_era");
        var era_table = "";
        for (let elem of this.model.GetEraOptions()) {
            era_table += "<tr><td>" + elem.name + "</td><td>" + elem.value;
            +"</td></tr>";
        }
        tooltip.innerHTML = format(js["rules"], era_table);
    }
    UpdateDisplay() {
        this.bleed.innerHTML = this.model.GetLiftBleed().toString();
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
    constructor(js, cockpits) {
        super();
        this.json = js;
        this.cockpits = cockpits;
        this.tbl = document.getElementById("table_cockpit");
        this.counter = document.getElementById("num_cockpits");
        this.positions = [];
        this.PopulateRules(js);
        this.counter.oninput = (e) => {
            this.cockpits.SetNumberOfCockpits(this.counter.valueAsNumber);
        };
    }
    PopulateRules(js) {
        var tooltip = document.getElementById("rules_cockpit");
        //For each element add it to the rules table
        var cockpit_table = "";
        for (let elem of js["options"]) {
            cockpit_table += "<tr><td>" + elem["name"] + "</td><td>" + elem["description"] + "</td>";
            cockpit_table += "<td>" + Effects2String(elem) + "</td>";
            cockpit_table += "<td>" + elem["cost"] + "</td>";
            cockpit_table += "</tr>";
        }
        // Also the upgrades, in their own table
        var upgrade_table = "";
        for (let elem of js["upgrades"]) {
            upgrade_table += "<tr><td>" + elem["name"] + "</td><td>" + elem["description"] + "</td>";
            upgrade_table += "<td>" + Effects2String(elem) + "</td>";
            upgrade_table += "<td>" + elem["cost"] + "</td>";
            upgrade_table += "</tr>";
        }
        //Format and set the rules tooltip
        tooltip.innerHTML = format(js["rules"], cockpit_table, upgrade_table);
    }
    CounterChange() {
        while (this.tbl.rows.length - 1 > this.counter.valueAsNumber) {
            this.RemoveCockpit(this.tbl.rows.length - 1);
        }
        while (this.tbl.rows.length - 1 < this.counter.valueAsNumber) {
            this.AddCockpit(this.tbl.rows.length);
        }
    }
    AddCockpit(num) {
        var row = this.tbl.insertRow(num);
        var cp = new Cockpit_HTML(this.json, row, this.cockpits.GetCockpit(num - 1));
        this.positions.push(cp);
    }
    RemoveCockpit(num) {
        this.positions.pop();
        this.tbl.deleteRow(num);
        aircraft_model.CalculateStats();
    }
    UpdateDisplay() {
        this.counter.valueAsNumber = this.cockpits.GetNumberOfCockpits();
        this.CounterChange();
        for (let pos of this.positions) {
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
    }
    SetNumberOfCockpits(num) {
        while (this.positions.length > num) {
            this.positions.pop();
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades);
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
    UpdateCrewStats(stats) {
        for (let cp of this.positions) {
            cp.CrewUpdate(stats);
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Cockpit_HTML extends Display {
    constructor(js, r, cp) {
        super();
        this.row = r;
        this.cockpit = cp;
        var option = this.row.insertCell(0);
        var upgrades = this.row.insertCell(1);
        var stat_cell = this.row.insertCell(2);
        var tbl = document.createElement("TABLE");
        var h1_row = tbl.insertRow();
        this.CreateTH(h1_row, "Mass");
        this.CreateTH(h1_row, "Drag");
        this.CreateTH(h1_row, "Cost");
        this.CreateTH(h1_row, "Control");
        var c1_row = tbl.insertRow();
        this.mass_cell = c1_row.insertCell();
        this.drag_cell = c1_row.insertCell();
        this.cost_cell = c1_row.insertCell();
        this.control_cell = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        this.CreateTH(h2_row, "Flight Stress");
        this.CreateTH(h2_row, "Escape");
        this.CreateTH(h2_row, "Visibility");
        this.CreateTH(h2_row, "Required Sections");
        var c2_row = tbl.insertRow();
        this.stress_cell = c2_row.insertCell();
        this.escape_cell = c2_row.insertCell();
        this.visibility_cell = c2_row.insertCell();
        this.section_cell = c2_row.insertCell();
        stat_cell.appendChild(tbl);
        stat_cell.className = "inner_table";
        tbl.className = "inner_table";
        var select = document.createElement("SELECT");
        // Visibility and Stress and Escape are cockpit local
        // Mark in table for CSS
        this.stress_cell.className = "part_local";
        this.visibility_cell.className = "part_local";
        this.escape_cell.className = "part_local";
        //Add all the cockpit types to the select box
        for (let elem of js["options"]) {
            let opt = document.createElement("OPTION");
            opt.text = elem["name"];
            select.add(opt);
        }
        option.appendChild(select);
        //Add all the upgrades as checkboxes
        var upg_index = 0;
        for (let elem of js["upgrades"]) {
            let span = document.createElement("SPAN");
            let txt = document.createElement("SPAN");
            txt.innerHTML = elem["name"];
            let upg = document.createElement("INPUT");
            upg.setAttribute("type", "checkbox");
            upg.checked = false;
            let local_index = upg_index;
            upg_index += 1;
            upg.onchange = () => { this.cockpit.SetUpgrade(local_index, upg.checked); };
            span.appendChild(upg);
            span.appendChild(txt);
            upgrades.appendChild(span);
            upgrades.appendChild(document.createElement("BR"));
        }
        //Set the change event, add the box, and execute it.
        select.onchange = () => { this.cockpit.SetType(select.selectedIndex); };
        this.cockpit.SetType(select.selectedIndex);
    }
    CreateTH(row, content) {
        var th = document.createElement("TH");
        th.innerHTML = content;
        row.appendChild(th);
    }
    UpdateDisplay() {
        let stats = this.cockpit.PartStats();
        this.mass_cell.innerHTML = stats.mass.toString();
        this.drag_cell.innerHTML = stats.drag.toString();
        this.cost_cell.innerHTML = stats.cost.toString();
        this.control_cell.innerHTML = stats.control.toString();
        this.stress_cell.innerHTML = this.cockpit.GetFlightStress().toString();
        this.escape_cell.innerHTML = this.cockpit.GetEscape().toString();
        this.visibility_cell.innerHTML = this.cockpit.GetVisibility().toString();
        this.section_cell.innerHTML = stats.reqsections.toString();
    }
}
class Cockpit extends Part {
    constructor(tl, ul) {
        super();
        this.stats = new Stats();
        this.types = tl;
        this.upgrades = ul;
        this.selected_upgrades = [];
        this.total_stress = 0;
        this.total_escape = 0;
        this.total_visibility = 0;
        this.selected_type = 0;
    }
    SetType(index) {
        if (index >= this.types.length)
            throw "Selected type is not in range of actual types.";
        this.selected_type = index;
        this.CalculateStats();
    }
    SetUpgrade(index, state) {
        if (index >= this.upgrades.length)
            throw "Selected type is not in range of actual upgrades.";
        this.selected_upgrades[index] = state;
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
        var stats = new Stats();
        stats = stats.Add(this.stats);
        return stats;
    }
    CrewUpdate(stats) {
        this.total_escape = this.stats.escape + stats.escape;
        this.total_stress = this.stats.flightstress + stats.flightstress;
        this.total_visibility = this.stats.visibility + stats.visibility;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Passengers_HTML extends Display {
    constructor(js, pass) {
        super();
        this.json = js;
        this.pass = pass;
        this.PopulateRules();
        var nseats = document.getElementById("num_seats");
        var nbeds = document.getElementById("num_beds");
        this.connect = document.getElementById("passenger_connectivity");
        this.mass = document.getElementById("passenger_mass");
        this.reqseq = document.getElementById("passenger_req_seq");
        nseats.value = "0";
        nbeds.value = "0";
        this.connect.disabled = true;
        nseats.oninput = () => {
            this.pass.SetSeats(nseats.valueAsNumber);
            this.EnableConnection(nseats.valueAsNumber + nbeds.valueAsNumber);
        };
        nbeds.oninput = () => {
            this.pass.SetBeds(nbeds.valueAsNumber);
            this.EnableConnection(nseats.valueAsNumber + nbeds.valueAsNumber);
        };
        this.connect.oninput = () => {
            this.pass.SetConnected(this.connect.checked);
        };
    }
    EnableConnection(num) {
        this.connect.disabled = (num == 0);
    }
    UpdateDisplay() {
        var stats = this.pass.PartStats();
        this.mass.innerHTML = stats.mass.toString();
        this.reqseq.innerHTML = stats.reqsections.toString();
    }
    PopulateRules() {
        //Format the rules and set the tooltip.
        var tooltip = document.getElementById("rules_passengers");
        tooltip.innerHTML = format(this.json["rules"]);
    }
}
class Passengers extends Part {
    constructor(js) {
        super();
        this.json = js;
        this.stats = new Stats();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }
    SetSeats(num) {
        this.seats = num;
        this.CalculateStats();
    }
    SetBeds(num) {
        this.beds = num;
        this.CalculateStats();
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
class EngineStats extends Stats {
    constructor(js) {
        super(js);
        this.name = "";
        this.reliability = 0;
        this.cooling = 0;
        this.overspeed = 0;
        this.altitude = 0;
        this.torque = 0;
        this.rumble = 0;
        this.oiltank = false;
        this.pulsejet = false;
        if (js) {
            this.name = js["name"];
            this.reliability = js["reliability"];
            this.cooling = js["cooling"];
            this.overspeed = js["overspeed"];
            this.altitude = js["altitude"];
            this.torque = js["torque"];
            this.rumble = js["rumble"];
            this.oiltank = js["oiltank"];
            this.pulsejet = js["pulsejet"];
        }
    }
    Add(other) {
        let res = super.Add(other);
        res.name = this.name;
        res.reliability = this.reliability + other.reliability;
        res.cooling = this.cooling + other.cooling;
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
}
class Engines_HTML extends Display {
    constructor(js, eng) {
        super();
        this.eng = eng;
        this.engines = [];
        this.radiators = [];
        this.PopulateRules(js);
        this.tbl = document.getElementById("table_engine");
        this.tblR = document.getElementById("table_radiator");
        this.num_engines = document.getElementById("num_engines");
        this.num_engines.oninput = () => { this.eng.SetNumberOfEngines(this.num_engines.valueAsNumber); };
        this.num_engines.valueAsNumber = this.eng.GetNumberOfEngines();
        this.num_radiators = document.getElementById("num_radiators");
        this.num_radiators.oninput = () => { this.eng.SetNumberOfRadiators(this.num_radiators.valueAsNumber); };
        this.num_radiators.valueAsNumber = this.eng.GetNumberOfRadiators();
        this.is_asymmetric = document.getElementById("asymmetric");
        this.is_asymmetric.oninput = () => { this.eng.SetAsymmetry(this.is_asymmetric.checked); };
        this.is_asymmetric.checked = this.eng.GetAsymmetry();
    }
    PopulateRules(js) {
        //Get used elements
        var rules_e = document.getElementById("rules_engine");
        var rules_u = document.getElementById("rules_engine_upgrades");
        var rules_c = document.getElementById("rules_engine_cooling");
        var enginesHTML = "";
        for (let elem of js["mounts"]) {
            enginesHTML += "<tr><td>" + elem["name"] + "</td><td>";
            if (elem["reqsections"])
                enginesHTML += "Yes";
            else
                enginesHTML += "No";
            enginesHTML += "</td><td>" + Effects2String(elem) + elem["description"] + "</td></tr>";
        }
        var pushpullHTML = "";
        for (let elem of js["push-pull"]) {
            pushpullHTML += "<tr><td>" + elem["name"] + "</td><td>";
            pushpullHTML += Effects2String(elem) + elem["description"] + "</td></tr>";
        }
        var radiatorTypeHTML = "";
        for (let elem of js["radiator-type"]) {
            radiatorTypeHTML += "<tr><td>" + elem["name"] + "</td><td>";
            radiatorTypeHTML += Effects2String(elem) + elem["description"] + "</td><td>" + elem["cost"] + "</td></tr>";
        }
        var radiatorMountHTML = "";
        for (let elem of js["radiator-mount"]) {
            radiatorMountHTML += "<tr><td>" + elem["name"] + "</td><td>";
            radiatorMountHTML += Effects2String(elem) + elem["description"] + "</td></tr>";
        }
        var radiatorCoolantHTML = "";
        for (let elem of js["radiator-coolant"]) {
            radiatorCoolantHTML += "<tr><td>" + elem["name"] + "</td><td>";
            radiatorCoolantHTML += Effects2String(elem) + elem["description"] + "</td><td>" + elem["cost"] + "</td></tr>";
        }
        rules_e.innerHTML = format(js["rules"], enginesHTML, pushpullHTML);
        rules_u.innerHTML = format(js["rules_upgrades"]);
        rules_c.innerHTML = format(js["rules_cooling"], radiatorTypeHTML, radiatorMountHTML, radiatorCoolantHTML);
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
            let en = new Engine_HTML(this.eng.GetEngine(this.engines.length), this.tbl.insertRow());
            this.engines.push(en);
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
        loadJSON('/engines.json', (response) => {
            // Parse JSON string into object
            let actual_JSON = JSON.parse(response);
            for (let elem of actual_JSON["engines"]) {
                this.engine_stats.push(new EngineStats(elem));
            }
            this.SetNumberOfEngines(1);
            this.SetNumberOfRadiators(1);
        });
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
    }
    SetNumberOfEngines(num) {
        while (this.engines.length > num) {
            this.engines.pop();
        }
        while (this.engines.length < num) {
            let en = new Engine(this.engine_stats, this.mount_list, this.pp_list);
            en.SetCalculateStats(this.CalculateStats);
            this.engines.push(en);
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
            if (elem.GetRadiator() < this.radiators.length) {
                let rad_stats = this.radiators[elem.GetRadiator()].PartStats();
                elem.UpdateReliability(stats.reliability + rad_stats.reliability);
            }
        }
    }
    SetAsymmetry(use) {
        this.is_asymmetric = use;
        this.CalculateStats();
    }
    GetAsymmetry() {
        return this.is_asymmetric;
    }
    PartStats() {
        var stats = new Stats;
        var needCool = [...Array(this.radiators.length).fill(0)];
        for (let en of this.engines) {
            stats = stats.Add(en.PartStats());
            if (en.NeedCooling())
                needCool[en.GetRadiator()] += en.GetCooling();
        }
        for (let i = 0; i < this.radiators.length; i++) {
            let rad = this.radiators[i];
            rad.SetNeedCool(needCool[i]);
            stats = stats.Add(rad.PartStats());
        }
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
    constructor(el, ml, ppl) {
        super();
        this.engine_list = el;
        this.selected_index = 0;
        this.etype_stats = this.engine_list[0];
        this.cooling_count = this.etype_stats.cooling;
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
        this.gp_count = 0;
        this.gpr_count = 0;
        if (el.length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    SetSelectedIndex(num) {
        this.selected_index = num;
        this.etype_stats = this.engine_list[this.selected_index];
        if (num >= this.engine_list.length)
            throw "Index is out of range of engine_list.";
        this.PulseJetCheck();
        this.cooling_count = this.etype_stats.cooling;
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return this.selected_index;
    }
    SetCustomStats(stats) {
        this.selected_index = -1;
        this.etype_stats = stats;
        this.PulseJetCheck();
        this.cooling_count = Math.min(this.cooling_count, this.etype_stats.cooling);
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
        return (this.cooling_count < this.etype_stats.cooling);
    }
    SetCooling(num) {
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
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
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
    PartStats() {
        let stats = new Stats;
        if (this.selected_index > 0)
            stats = stats.Add(this.etype_stats);
        else
            stats = stats.Add(this.etype_stats);
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        if (this.mount_list[this.selected_mount].pp_type == "fuselage")
            stats.latstab -= this.etype_stats.torque;
        else if (this.mount_list[this.selected_mount].pp_type == "wing") {
            if (this.torque_to_struct)
                stats.structure -= this.etype_stats.torque;
            else
                stats.maxstrain += this.etype_stats.torque;
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
        // Mounting modifiers (only get applied once, even with push/pull)
        stats = stats.Add(this.mount_stats);
        stats.maxstrain += Math.floor(this.mount_list[this.selected_mount].strainfactor * this.etype_stats.mass);
        stats.drag += Math.floor(this.mount_list[this.selected_mount].dragfactor * this.etype_stats.mass);
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
    UpdateReliability(num) {
        this.total_reliability = this.etype_stats.reliability;
        this.total_reliability -= (this.etype_stats.cooling - this.cooling_count);
        this.total_reliability -= (this.gp_count - this.gpr_count);
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
            this.etype_stats.cooling = 0;
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetIsTractorNacelle() {
        if (!this.GetIsPulsejet()
            && !this.GetUsePushPull()
            && this.mount_list[this.selected_mount].pp_type == "wing")
            return true;
        return false;
    }
}
class Engine_HTML extends Display {
    constructor(eng, r) {
        super();
        this.engine = eng;
        this.engine_list = eng.GetListOfEngines();
        this.row = r;
        this.InitTypeSelect();
        var option_cell = this.row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE");
        opt_table.className = "inner_table";
        this.CreateTH(opt_table.insertRow(), "Cooling");
        this.cool_cell = opt_table.insertRow().insertCell();
        this.CreateTH(opt_table.insertRow(), "Mounting");
        var mount_cell = opt_table.insertRow().insertCell();
        this.CreateTH(opt_table.insertRow(), "Upgrades");
        var upg_cell = opt_table.insertRow().insertCell();
        option_cell.appendChild(opt_table);
        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitStatDisplay();
    }
    InitTypeSelect() {
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
        var tcell = this.row.insertCell(0);
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
        //Set up the individual stat input boxes
        this.CreateInput("  Power", this.e_pwr, tcell);
        this.CreateInput("  Mass", this.e_mass, tcell);
        this.CreateInput("  Drag", this.e_drag, tcell);
        this.CreateInput("  Reliability", this.e_rely, tcell);
        this.CreateInput("  Cooling", this.e_cool, tcell);
        this.CreateInput("  Overspeed", this.e_over, tcell);
        this.CreateInput("  Fuel Consumption", this.e_fuel, tcell);
        this.CreateInput("  Altitude", this.e_alti, tcell);
        this.CreateInput("  Torque", this.e_torq, tcell);
        this.CreateInput("  Rumble", this.e_rumb, tcell);
        this.CreateInput("  Cost", this.e_cost, tcell);
        this.CreateCheckbox(" Oil Tank", this.e_oil, tcell);
        this.CreateCheckbox(" Pulsejet", this.e_pulsejet, tcell);
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
        this.e_pwr.oninput = trigger;
        this.e_mass.oninput = trigger;
        this.e_drag.oninput = trigger;
        this.e_rely.oninput = trigger;
        this.e_cool.oninput = trigger;
        this.e_over.oninput = trigger;
        this.e_fuel.oninput = trigger;
        this.e_alti.oninput = trigger;
        this.e_torq.oninput = trigger;
        this.e_rumb.oninput = trigger;
        this.e_cost.oninput = trigger;
        this.e_oil.onchange = trigger;
        this.e_pulsejet.onchange = trigger;
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
        this.CreateCheckbox(" Push Pull", this.pushpull_input, mount_cell);
        this.CreateCheckbox(" Torque To Structure", this.torque_input, mount_cell);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }
    InitUpgradeSelect(upg_cell) {
        this.ds_input = document.createElement("INPUT");
        this.gp_input = document.createElement("INPUT");
        this.gpr_input = document.createElement("INPUT");
        this.CreateCheckbox("   Extended Driveshafts", this.ds_input, upg_cell);
        this.CreateInput("  Geared Propeller", this.gp_input, upg_cell);
        this.CreateInput("  Negate Reliability Penalty", this.gpr_input, upg_cell);
        this.gp_input.oninput = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.oninput = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };
    }
    InitStatDisplay() {
        var stat_cell = this.row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        this.CreateTH(h1_row, "Power");
        this.CreateTH(h1_row, "Mass");
        this.CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_powr = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        this.CreateTH(h2_row, "Reliability");
        this.CreateTH(h2_row, "Visibility");
        this.CreateTH(h2_row, "Overspeed");
        var c2_row = tbl_stat.insertRow();
        this.d_rely = c2_row.insertCell();
        this.d_rely.className = "part_local";
        this.d_visi = c2_row.insertCell();
        this.d_over = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        this.CreateTH(h3_row, "Cost");
        this.CreateTH(h3_row, "Altitude");
        this.CreateTH(h3_row, "Fuel Consumption");
        var c3_row = tbl_stat.insertRow();
        this.d_cost = c3_row.insertCell();
        this.d_alti = c3_row.insertCell();
        this.d_fuel = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        this.CreateTH(h4_row, "Pitch Stab");
        this.CreateTH(h4_row, "Lateral Stab");
        this.CreateTH(h4_row, "Max Strain");
        var c4_row = tbl_stat.insertRow();
        this.d_pstb = c4_row.insertCell();
        this.d_lstb = c4_row.insertCell();
        this.d_maxs = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        this.CreateTH(h5_row, "Structure");
        this.CreateTH(h5_row, "Flight Stress");
        this.CreateTH(h5_row, "Frame Sections");
        var c5_row = tbl_stat.insertRow();
        this.d_strc = c5_row.insertCell();
        this.d_fstr = c5_row.insertCell();
        this.d_sect = c5_row.insertCell();
    }
    CreateTH(row, content) {
        var th = document.createElement("TH");
        th.innerHTML = content;
        row.appendChild(th);
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
            this.cool_count.max = this.engine.GetCurrentStats().cooling.toString();
            if (this.cool_count.valueAsNumber > this.e_cool.valueAsNumber) {
                this.cool_count.valueAsNumber = this.e_cool.valueAsNumber;
            }
            this.cool_count.oninput = () => { this.engine.SetCooling(this.cool_count.valueAsNumber); };
            this.cool_cell.appendChild(this.cool_count);
            this.cool_cell.appendChild(txtSpan2);
        }
    }
    CreateInput(txt, elem, table) {
        var span = document.createElement("SPAN");
        var txtSpan = document.createElement("SPAN");
        txtSpan.innerHTML = txt;
        elem.setAttribute("type", "number");
        elem.min = (0).toString();
        elem.valueAsNumber = 0;
        span.appendChild(elem);
        span.appendChild(txtSpan);
        table.appendChild(span);
        table.appendChild(document.createElement("BR"));
    }
    CreateCheckbox(txt, elem, table) {
        var span = document.createElement("SPAN");
        var txtSpan = document.createElement("SPAN");
        txtSpan.innerHTML = txt;
        elem.setAttribute("type", "checkbox");
        span.appendChild(elem);
        span.appendChild(txtSpan);
        table.appendChild(span);
        table.appendChild(document.createElement("BR"));
    }
    SendCustomStats() {
        var stats = new EngineStats();
        stats.power = this.e_pwr.valueAsNumber;
        stats.mass = this.e_mass.valueAsNumber;
        stats.drag = this.e_drag.valueAsNumber;
        stats.reliability = this.e_rely.valueAsNumber;
        stats.cooling = this.e_cool.valueAsNumber;
        stats.overspeed = this.e_over.valueAsNumber;
        stats.fuelconsumption = this.e_fuel.valueAsNumber;
        stats.altitude = this.e_alti.valueAsNumber;
        stats.torque = this.e_torq.valueAsNumber;
        stats.rumble = this.e_rumb.valueAsNumber;
        stats.cost = this.e_cost.valueAsNumber;
        stats.oiltank = this.e_oil.checked;
        stats.pulsejet = this.e_pulsejet.checked;
        this.engine.SetCustomStats(stats);
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
        var stats = this.engine.GetCurrentStats();
        this.e_pwr.valueAsNumber = stats.power;
        this.e_mass.valueAsNumber = stats.mass;
        this.e_drag.valueAsNumber = stats.drag;
        this.e_rely.valueAsNumber = stats.reliability;
        this.e_cool.valueAsNumber = stats.cooling;
        this.e_over.valueAsNumber = stats.overspeed;
        this.e_fuel.valueAsNumber = stats.fuelconsumption;
        this.e_alti.valueAsNumber = stats.altitude;
        this.e_torq.valueAsNumber = stats.torque;
        this.e_rumb.valueAsNumber = stats.rumble;
        this.e_cost.valueAsNumber = stats.cost;
        this.e_oil.checked = stats.oiltank;
        this.e_pulsejet.checked = stats.pulsejet;
        this.InitCoolingSelect();
        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetTorqueToStruct();
        this.torque_input.disabled = !this.engine.CanTorqueToStruct();
        this.ds_input.checked = this.engine.GetUseExtendedDriveshaft();
        this.gp_input.valueAsNumber = this.engine.GetGearCount();
        this.gpr_input.valueAsNumber = this.engine.GetGearReliability();
        if (stats.pulsejet) {
            this.pushpull_input.disabled = true;
            this.ds_input.disabled = true;
            this.gp_input.disabled = true;
            this.gpr_input.disabled = true;
            for (let opt of this.mount_select.options) {
                if (opt.value == "fuselage") {
                    opt.disabled = true;
                }
            }
        }
        else {
            this.pushpull_input.disabled = false;
            this.ds_input.disabled = false;
            this.gp_input.disabled = false;
            this.gpr_input.disabled = false;
            for (let opt of this.mount_select.options) {
                opt.disabled = false;
            }
        }
        var full_stats = this.engine.PartStats();
        this.d_powr.innerHTML = full_stats.power.toString();
        this.d_mass.innerHTML = full_stats.mass.toString();
        this.d_drag.innerHTML = full_stats.drag.toString();
        this.d_rely.innerHTML = this.engine.GetReliability().toString();
        this.d_visi.innerHTML = full_stats.visibility.toString();
        this.d_over.innerHTML = this.engine.GetOverspeed().toString();
        this.d_cost.innerHTML = full_stats.cost.toString();
        this.d_alti.innerHTML = stats.altitude.toString();
        this.d_fuel.innerHTML = full_stats.fuelconsumption.toString();
        this.d_pstb.innerHTML = full_stats.pitchstab.toString();
        this.d_lstb.innerHTML = full_stats.latstab.toString();
        this.d_maxs.innerHTML = full_stats.maxstrain.toString();
        this.d_strc.innerHTML = full_stats.structure.toString();
        this.d_fstr.innerHTML = full_stats.flightstress.toString();
        this.d_sect.innerHTML = full_stats.reqsections.toString();
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
        this.CreateTH(h1_row, "Mass");
        this.CreateTH(h1_row, "Cost");
        this.CreateTH(h1_row, "Drag");
        this.CreateTH(h1_row, "Reliability");
        this.CreateTH(h1_row, "Lateral Stab");
        var c1_row = tbl.insertRow();
        this.c_mass = c1_row.insertCell();
        this.c_cost = c1_row.insertCell();
        this.c_drag = c1_row.insertCell();
        this.c_rely = c1_row.insertCell();
        this.c_lstb = c1_row.insertCell();
        stats_cell.appendChild(tbl);
    }
    CreateTH(row, content) {
        var th = document.createElement("TH");
        th.innerHTML = content;
        row.appendChild(th);
    }
    UpdateDisplay() {
        this.type_select.selectedIndex = this.radiator.GetTypeIndex();
        this.mount_select.selectedIndex = this.radiator.GetMountIndex();
        this.coolant_select.selectedIndex = this.radiator.GetCoolantIndex();
        var stats = this.radiator.PartStats();
        this.c_mass.innerHTML = stats.mass.toString();
        this.c_cost.innerHTML = stats.cost.toString();
        this.c_drag.innerHTML = stats.drag.toString();
        this.c_rely.innerHTML = stats.reliability.toString();
        this.c_lstb.innerHTML = stats.latstab.toString();
    }
}
class Propeller extends Part {
    constructor(json) {
        super();
        this.idx_prop = 2;
        this.use_variable = false;
        this.prop_list = [];
        for (let elem of json["props"]) {
            this.prop_list.push({ name: elem["name"], stats: new Stats(elem), automatic: elem["automatic"] });
        }
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
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.prop_list[this.idx_prop].stats);
        if (this.use_variable)
            stats.cost += 2;
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Propeller_HTML extends Display {
    constructor(js, prop) {
        super();
        this.prop = prop;
        this.PopulateRules(js);
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
    PopulateRules(js) {
        //Get used elements
        var rules = document.getElementById("rules_propeller");
        var propellerHTML = "";
        for (let elem of js["props"]) {
            propellerHTML += "<tr><td>" + elem["name"] + "</td><td>";
            propellerHTML += elem["pitchspeed"] + "</td><td>" + elem["pitchboost"] + "</td></tr>";
        }
        rules.innerHTML = format(js["rules"], propellerHTML);
    }
    UpdateDisplay() {
        this.input_variable.checked = this.prop.GetVariable();
        this.input_variable.disabled = !this.prop.CanBeVariable();
        this.select_prop.selectedIndex = this.prop.GetPropIndex();
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
    DuplicateSection(num) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.CountInternalBracing()) {
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
            console.log("Setting Bracing");
            console.log(this.CountSections());
            console.log(this.required_sections);
            console.log(this.CountInternalBracing());
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
        else {
            console.log("Not Setting Bracing");
            console.log(this.CountSections());
            console.log(this.required_sections);
            console.log(this.CountInternalBracing());
        }
    }
    PossibleInternalBracing() {
        return this.CountInternalBracing() < this.CountSections() + this.tail_section_list.length;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.section_list[num].skin].monocoque;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic;
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
            tail_stats.maxstrain += tail_stats.mass;
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
    constructor(js, frames) {
        super();
        this.frames = frames;
        this.PopulateRules(js);
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
        this.CreateTH(h1_row, "Mass");
        this.CreateTH(h1_row, "Drag");
        this.CreateTH(h1_row, "Cost");
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        this.CreateTH(h2_row, "Structure");
        this.CreateTH(h2_row, "Toughness");
        this.CreateTH(h2_row, "Visibility");
        var c2_row = tbl.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        this.CreateTH(h3_row, "Wing Area");
        this.CreateTH(h3_row, "Flammable");
        this.CreateTH(h3_row, "Pitch Stability");
        var c3_row = tbl.insertRow();
        this.d_area = c3_row.insertCell();
        this.d_flammable = c3_row.insertCell();
        this.d_pitchstab = c3_row.insertCell();
        var h4_row = tbl.insertRow();
        this.CreateTH(h4_row, "Max Strain");
        this.CreateTH(h4_row, "");
        this.CreateTH(h4_row, "");
        var c4_row = tbl.insertRow();
        this.d_strain = c4_row.insertCell();
        c4_row.insertCell();
        c4_row.insertCell();
        this.c_stats.appendChild(tbl);
        var row3 = table.insertRow();
        this.CreateTH(row3, "Tail Frame Type");
        this.CreateTH(row3, "Tail Skin Type");
        this.CreateTH(row3, "Tail Frame Options");
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
    CreateTH(row, content) {
        var th = document.createElement("TH");
        th.innerHTML = content;
        row.appendChild(th);
    }
    PopulateRules(js) {
        var tooltip = document.getElementById("rules_frames");
        var frame_table = "";
        for (let elem of this.frames.GetFrameList()) {
            frame_table += "<tr><td>";
            frame_table += elem.name + "</td><td>+" + elem.basestruct + " Structure</td><td>";
            frame_table += elem.basecost + "</td><td>" + Effects2String(elem.stats) + "</td><td>";
            frame_table += elem.stats.cost + "</td><td>";
            if (elem.geodesic)
                frame_table += "Yes";
            else
                frame_table += "No";
            frame_table += "</td></tr>";
        }
        var skin_table = "";
        for (let elem of this.frames.GetSkinList()) {
            skin_table += "<tr><td>";
            skin_table += elem.name + "</td><td>" + Effects2String(elem.stats) + "</td><td>";
            skin_table += elem.stats.cost + "</td><td>";
            if (elem.monocoque)
                skin_table += elem.monocoque_structure;
            else
                skin_table += "-";
            skin_table += "</td></tr>";
        }
        tooltip.innerHTML = format(js["rules"], frame_table, skin_table);
        var tooltip_tail = document.getElementById("rules_tail_frames");
        var tail_table = "";
        for (let elem of this.frames.GetTailList()) {
            tail_table += "<tr><td>" + elem.name + "</td><td>" + Effects2String(elem.stats) + "</td></tr>";
        }
        tooltip_tail.innerHTML = format(js["rules-tail"], tail_table);
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
        var frame_list = this.frames.GetFrameList();
        var skin_list = this.frames.GetSkinList();
        var is_flammable = false;
        for (let i = 0; i < section_list.length; i++) {
            let sec = section_list[i];
            let type_span = document.createElement("SPAN");
            let rem_button = document.createElement("BUTTON");
            rem_button.textContent = "-";
            rem_button.onclick = () => { this.frames.DeleteSection(i); };
            rem_button.disabled = !sec.internal_bracing && !this.frames.PossibleRemoveSections();
            let add_button = document.createElement("BUTTON");
            add_button.textContent = "+";
            add_button.disabled = sec.internal_bracing && !this.frames.PossibleInternalBracing();
            add_button.onclick = () => { this.frames.DuplicateSection(i); };
            let frame_select = document.createElement("SELECT");
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
            let skin_select = document.createElement("SELECT");
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
            let opt_span = document.createElement("SPAN");
            let geo_input = document.createElement("INPUT");
            geo_input.setAttribute("type", "checkbox");
            geo_input.checked = sec.geodesic;
            geo_input.disabled = !this.frames.PossibleGeodesic(i);
            geo_input.onchange = () => { this.frames.SetGeodesic(i, geo_input.checked); };
            let geo_span = document.createElement("SPAN");
            geo_span.innerText = "  Geodesic    ";
            opt_span.appendChild(geo_input);
            opt_span.appendChild(geo_span);
            let mono_input = document.createElement("INPUT");
            mono_input.setAttribute("type", "checkbox");
            mono_input.checked = sec.monocoque;
            mono_input.disabled = !this.frames.PossibleMonocoque(i);
            mono_input.onchange = () => { this.frames.SetMonocoque(i, mono_input.checked); };
            let mono_span = document.createElement("SPAN");
            mono_span.innerText = "  Monocoque    ";
            opt_span.appendChild(mono_input);
            opt_span.appendChild(mono_span);
            let int_input = document.createElement("INPUT");
            int_input.setAttribute("type", "checkbox");
            int_input.checked = sec.internal_bracing;
            if (!sec.internal_bracing && !this.frames.PossibleInternalBracing())
                int_input.disabled = true;
            int_input.onchange = () => { this.frames.SetInternalBracing(i, int_input.checked); };
            let int_span = document.createElement("SPAN");
            int_span.innerText = "  Internal Bracing    ";
            opt_span.appendChild(int_input);
            opt_span.appendChild(int_span);
            let lb_input = document.createElement("INPUT");
            lb_input.setAttribute("type", "checkbox");
            lb_input.checked = sec.lifting_body;
            lb_input.disabled = !this.frames.PossibleMonocoque(i);
            lb_input.onchange = () => { this.frames.SetLiftingBody(i, lb_input.checked); };
            let lb_span = document.createElement("SPAN");
            lb_span.innerText = "  Lifting Body    ";
            opt_span.appendChild(lb_input);
            opt_span.appendChild(lb_span);
            this.c_options.appendChild(opt_span);
            this.c_options.appendChild(document.createElement("BR"));
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        this.t_select.selectedIndex = this.frames.GetTailType();
        this.t_farman.disabled = this.frames.GetUseBoom();
        this.t_boom.disabled = this.frames.GetUseFarman();
        for (let i = 0; i < tail_section_list.length; i++) {
            let sec = tail_section_list[i];
            let frame_select = document.createElement("SELECT");
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
            let skin_select = document.createElement("SELECT");
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
            let opt_span = document.createElement("SPAN");
            let geo_input = document.createElement("INPUT");
            geo_input.setAttribute("type", "checkbox");
            geo_input.checked = sec.geodesic;
            geo_input.disabled = !this.frames.PossibleTailGeodesic(i);
            geo_input.onchange = () => { this.frames.SetTailGeodesic(i, geo_input.checked); };
            let geo_span = document.createElement("SPAN");
            geo_span.innerText = "  Geodesic    ";
            opt_span.appendChild(geo_input);
            opt_span.appendChild(geo_span);
            let mono_input = document.createElement("INPUT");
            mono_input.setAttribute("type", "checkbox");
            mono_input.checked = sec.monocoque;
            mono_input.disabled = !this.frames.PossibleTailMonocoque(i);
            mono_input.onchange = () => { this.frames.SetTailMonocoque(i, mono_input.checked); };
            let mono_span = document.createElement("SPAN");
            mono_span.innerText = "  Monocoque    ";
            opt_span.appendChild(mono_input);
            opt_span.appendChild(mono_span);
            let lb_input = document.createElement("INPUT");
            lb_input.setAttribute("type", "checkbox");
            lb_input.checked = sec.lifting_body;
            lb_input.disabled = !this.frames.PossibleTailMonocoque(i);
            lb_input.onchange = () => { this.frames.SetTailLiftingBody(i, lb_input.checked); };
            let lb_span = document.createElement("SPAN");
            lb_span.innerText = "  Lifting Body    ";
            opt_span.appendChild(lb_input);
            opt_span.appendChild(lb_span);
            this.t_options.appendChild(opt_span);
            this.t_options.appendChild(document.createElement("BR"));
            //Flammable check
            is_flammable = is_flammable || skin_list[sec.skin].flammable;
        }
        if (is_flammable)
            this.d_flammable.innerText = "Yes";
        else
            this.d_flammable.innerText = "No";
        var stats = this.frames.PartStats();
        this.d_mass.innerHTML = stats.mass.toString();
        this.d_drag.innerHTML = stats.drag.toString();
        this.d_cost.innerHTML = stats.cost.toString();
        this.d_strc.innerHTML = stats.structure.toString();
        this.d_tugh.innerHTML = stats.toughness.toString();
        this.d_visi.innerHTML = stats.visibility.toString();
        this.d_area.innerHTML = stats.wingarea.toString();
        this.d_pitchstab.innerHTML = stats.pitchstab.toString();
        this.d_strain.innerHTML = stats.maxstrain.toString();
    }
}
class Wings extends Part {
    constructor(js) {
        super();
        this.deck_list = [];
        for (let elem of js["decks"]) {
            this.deck_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.skin_list = [];
        for (let elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"]
            });
        }
        this.stagger_list = [];
        for (let elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], sizereq: elem["sizereq"],
                hstab: elem["hstab"], stats: new Stats(elem)
            });
        }
        this.wing_stagger = Math.floor(this.stagger_list.length / 2);
        this.wing_list = [];
    }
    SetNumberOfWings(num) {
        while (this.wing_list.length < num)
            this.AddWing();
        while (this.wing_list.length > num)
            this.RemoveWing();
        this.CalculateStats();
    }
    AddWing() {
        this.wing_list.push({
            deck: 0, surface: 0, area: 10, span: 5,
            dihedral: 0, anhedral: 0, primary_dihedral: false,
            swept: false, lead_wing: true
        });
    }
    RemoveWing() {
        this.wing_list.pop();
    }
    GetDeckList(deck) {
        return this.wing_list.filter((element) => { return element.deck == deck; });
    }
    CountLeadWing(list) {
        var count = 0;
        for (let elem of list) {
            if (elem.lead_wing)
                count++;
        }
        return count;
    }
    EnforceLeadWing() {
        for (let i = 0; i < this.deck_list.length; i++) {
            let deck_array = this.GetDeckList(i);
            if (deck_array.length > 0) {
                let count = this.CountLeadWing(deck_array);
                if (count == 0)
                    deck_array[0].lead_wing = true;
                else if (count == 1)
                    continue;
                else {
                    for (let j = deck_array.length - 1; j > 0; j--) {
                        if (deck_array[j].lead_wing) {
                            deck_array[j].lead_wing = false;
                            count--;
                            if (count == 1)
                                break;
                        } //If is extra leading wing.
                    } //for backward on wings
                } //else has extra
            } //If we have wings
        } //For each deck
    }
    GetLeadWing(deck) {
        return this.wing_list.filter((elem) => { return elem.lead_wing && elem.deck == deck; })[0];
    }
    PartStats() {
        this.EnforceLeadWing();
        var stats = new Stats();
        var have_wing = false;
        var have_mini_wing = false;
        var longest_span = 0;
        var use_deck = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
            if (w.area > 2) { //Is not miniature wing
                if (!have_wing) { //Is first wing
                    have_wing = true;
                }
                else { //Is not first wing
                    stats.control += 3;
                    stats.liftbleed += 3;
                    stats.visibility -= 1;
                }
                use_deck[w.deck]++;
            }
            else { //Is miniature wing
                if (!have_mini_wing) { //Is first miniature wing
                    have_mini_wing = true;
                    stats.control += 1;
                }
                else { //Is not first miniature wing
                    stats.control += 1;
                    stats.liftbleed += 1;
                }
            }
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.maxstrain += 2 * wspan + w.area - 10;
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            wStats.drag = Math.max(1, wStats.drag + w.area - wspan);
            if (w.swept) {
                wStats.liftbleed += 5;
                wStats.latstab--;
            }
        }
        return new Stats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}
class Wings_HTML extends Display {
    constructor(js, w) {
        super();
        this.wings = w;
    }
    UpdateDisplay() {
    }
}
