/// <reference path="../disp/Tools.ts" />
/// <reference path="../impl/EngineStats.ts" />
/// <reference path="../impl/EngineList.ts" />
/// <reference path="../lz/lz-string.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var ep = sp.get("engine");

    elist = new EngineList();
    ebuild = new EngineBuilder_HTML();

    loadJSON('/PlaneBuilder/engines.json', (engine_resp) => {
        var engine_json = JSON.parse(engine_resp);
        elist.fromJSON(engine_json);
    });

    if (ep != null) {
        try {
            var str = LZString.decompressFromEncodedURIComponent(ep);
            var arr = _stringToArrayBuffer(str);
            var des = new Deserialize(arr);
            var num = elist.deserializeEngine(des);
            ebuild.SelectEngine(num);
        } catch { console.log("Compressed Engine Parameter Failed."); }
    }
}
window.onload = init;

var ebuild: EngineBuilder_HTML;
var elist: EngineList;

class EngineBuilder_HTML {
    private pulsejetbuilder: PulsejetBuilder;
    private enginebuilder: EngineBuilder;

    //Engine Inputs
    private e_name: HTMLInputElement;
    private e_sera: HTMLSelectElement;
    private e_cool: HTMLSelectElement;
    private e_disp: HTMLInputElement;
    private e_ncyl: HTMLInputElement;
    private e_nrow: HTMLInputElement;
    private e_cmpr: HTMLInputElement;
    private e_rpmb: HTMLInputElement;
    private e_mfdg: HTMLInputElement;
    private e_qfdg: HTMLInputElement;
    private e_upgs: HTMLInputElement[];
    //Engine Outputs
    private ed_name: HTMLLabelElement;
    private ed_powr: HTMLLabelElement;
    private ed_mass: HTMLLabelElement;
    private ed_drag: HTMLLabelElement;
    private ed_rely: HTMLLabelElement;
    private ed_cool: HTMLLabelElement;
    private ed_ospd: HTMLLabelElement;
    private ed_fuel: HTMLLabelElement;
    private ed_malt: HTMLLabelElement;
    private ed_torq: HTMLLabelElement;
    private ed_cost: HTMLLabelElement;
    private ed_oilt: HTMLLabelElement;

    //Pulsejet Inputs
    private p_powr: HTMLInputElement;
    private p_type: HTMLSelectElement;
    private p_sera: HTMLSelectElement;
    private p_bqul: HTMLInputElement;
    private p_oqul: HTMLInputElement;
    private p_strt: HTMLInputElement;
    //Pulsejet Outputs
    private pd_name: HTMLLabelElement;
    private pd_powr: HTMLLabelElement;
    private pd_mass: HTMLLabelElement;
    private pd_drag: HTMLLabelElement;
    private pd_rely: HTMLLabelElement;
    private pd_fuel: HTMLLabelElement;
    private pd_rumb: HTMLLabelElement;
    private pd_cost: HTMLLabelElement;
    private pd_malt: HTMLLabelElement;
    private pd_dcst: HTMLLabelElement;

    //Manual Inputs
    private m_name: HTMLInputElement;
    private m_pwr: HTMLInputElement;
    private m_mass: HTMLInputElement;
    private m_drag: HTMLInputElement;
    private m_rely: HTMLInputElement;
    private m_cool: HTMLInputElement;
    private m_over: HTMLInputElement;
    private m_fuel: HTMLInputElement;
    private m_alti: HTMLInputElement;
    private m_torq: HTMLInputElement;
    private m_rumb: HTMLInputElement;
    private m_cost: HTMLInputElement;
    private m_oil: HTMLInputElement;
    private m_pulsejet: HTMLInputElement;
    private m_turbo: HTMLInputElement;

    //List Modification
    private m_select: HTMLSelectElement;
    private m_add: HTMLButtonElement;
    private m_delete: HTMLButtonElement;
    private m_add_eb: HTMLButtonElement;
    private m_add_pj: HTMLButtonElement;
    private m_save: HTMLButtonElement;
    private m_load: HTMLInputElement;
    private m_copy: HTMLButtonElement;

    constructor() {
        this.enginebuilder = new EngineBuilder();
        this.pulsejetbuilder = new PulsejetBuilder();

        var etbl = document.getElementById("table_engine") as HTMLTableElement;
        var erow = etbl.insertRow();
        this.InitEngineInputs(erow.insertCell());
        this.InitEngineUpgrades(erow.insertCell());
        this.InitEngineOutputs(erow.insertCell());
        this.UpdateEngine();

        var ptbl = document.getElementById("table_pulsejet") as HTMLTableElement;
        var prow = ptbl.insertRow();
        this.InitPulsejetInputs(prow.insertCell());
        this.InitPulsejetOutputs(prow.insertCell());
        this.UpdatePulsejet();

        var mtbl = document.getElementById("table_manual") as HTMLTableElement;
        var mrow = mtbl.insertRow();
        this.InitManual(mrow.insertCell());
        this.InitListManagement(mrow.insertCell());
    }

    private InitEngineInputs(cell: HTMLTableCellElement) {
        this.e_name = document.createElement("INPUT") as HTMLInputElement;
        this.e_sera = document.createElement("SELECT") as HTMLSelectElement;
        this.e_cool = document.createElement("SELECT") as HTMLSelectElement;
        this.e_disp = document.createElement("INPUT") as HTMLInputElement;
        this.e_cmpr = document.createElement("INPUT") as HTMLInputElement;
        this.e_ncyl = document.createElement("INPUT") as HTMLInputElement;
        this.e_nrow = document.createElement("INPUT") as HTMLInputElement;
        this.e_rpmb = document.createElement("INPUT") as HTMLInputElement;
        this.e_mfdg = document.createElement("INPUT") as HTMLInputElement;
        this.e_qfdg = document.createElement("INPUT") as HTMLInputElement;
        for (let e of this.enginebuilder.EraTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = e.name;
            this.e_sera.add(opt);
        }
        for (let c of this.enginebuilder.CoolingTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = c.name;
            this.e_cool.add(opt);
        }

        var fs = CreateFlexSection(cell);
        FlexText("Name", this.e_name, fs);
        FlexSelect("Era", this.e_sera, fs);
        FlexSelect("Engine Type", this.e_cool, fs);
        FlexInput("Engine Displacement (L)", this.e_disp, fs);
        FlexInput("Compression Ratio (N:1)", this.e_cmpr, fs);
        FlexInput("Cylinders per Row", this.e_ncyl, fs);
        FlexInput("Number of Rows", this.e_nrow, fs);
        FlexInput("RPM Boost", this.e_rpmb, fs);
        FlexInput("Material Fudge Factor", this.e_mfdg, fs);
        FlexInput("Quality Fudge Factor", this.e_qfdg, fs);

        this.e_disp.step = "0.01";
        this.e_cmpr.step = "0.01";
        this.e_rpmb.step = "0.01";
        this.e_rpmb.min = "0.5";
        this.e_rpmb.max = "1.5";
        this.e_mfdg.step = "0.01";
        this.e_mfdg.min = "0.01";
        this.e_mfdg.max = "99999";
        this.e_qfdg.step = "0.01";
        this.e_qfdg.min = "0.01";
        this.e_qfdg.max = "99999";

        this.e_name.onchange = () => { this.enginebuilder.name = this.e_name.value; this.UpdateEngine(); };
        this.e_sera.onchange = () => { this.enginebuilder.era_sel = this.e_sera.selectedIndex; this.UpdateEngine(); };
        this.e_cool.onchange = () => { this.enginebuilder.cool_sel = this.e_cool.selectedIndex; this.UpdateEngine(); };
        this.e_disp.onchange = () => { this.enginebuilder.engine_displacement = this.e_disp.valueAsNumber; this.UpdateEngine(); };
        this.e_cmpr.onchange = () => { this.enginebuilder.compression_ratio = this.e_cmpr.valueAsNumber; this.UpdateEngine(); };
        this.e_ncyl.onchange = () => { this.enginebuilder.num_cyl_per_row = this.e_ncyl.valueAsNumber; this.UpdateEngine(); };
        this.e_nrow.onchange = () => { this.enginebuilder.num_rows = this.e_nrow.valueAsNumber; this.UpdateEngine(); };
        this.e_rpmb.onchange = () => { this.enginebuilder.rpm_boost = this.e_rpmb.valueAsNumber; this.UpdateEngine(); };
        this.e_mfdg.onchange = () => { this.enginebuilder.material_fudge = this.e_mfdg.valueAsNumber; this.UpdateEngine(); };
        this.e_qfdg.onchange = () => { this.enginebuilder.quality_fudge = this.e_qfdg.valueAsNumber; this.UpdateEngine(); };
    }

    private InitEngineUpgrades(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);
        this.e_upgs = [];
        for (let i = 0; i < this.enginebuilder.Upgrades.length; i++) {
            let u = this.enginebuilder.Upgrades[i];
            let inp = document.createElement("INPUT") as HTMLInputElement;
            inp.onchange = () => { this.enginebuilder.upg_sel[i] = this.e_upgs[i].checked; this.UpdateEngine(); };
            FlexCheckbox(u.name, inp, fs);
            this.e_upgs.push(inp);
        }
    }

    private InitEngineOutputs(cell: HTMLTableCellElement) {
        this.ed_name = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_powr = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_mass = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_drag = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_rely = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_cool = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_ospd = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_fuel = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_malt = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_torq = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_cost = document.createElement("LABEL") as HTMLLabelElement;
        this.ed_oilt = document.createElement("LABEL") as HTMLLabelElement;
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.ed_name, fs);
        FlexDisplay("Power", this.ed_powr, fs);
        FlexDisplay("Mass", this.ed_mass, fs);
        FlexDisplay("Drag", this.ed_drag, fs);
        FlexDisplay("Reliability", this.ed_rely, fs);
        FlexDisplay("Required Cooling", this.ed_cool, fs);
        FlexDisplay("Overspeed", this.ed_ospd, fs);
        FlexDisplay("Fuel Consumption", this.ed_fuel, fs);
        FlexDisplay("Altitude", this.ed_malt, fs);
        FlexDisplay("Torque", this.ed_torq, fs);
        FlexDisplay("Cost", this.ed_cost, fs);
        FlexDisplay("Oil Tank", this.ed_oilt, fs);
    }

    private UpdateEngine() {
        this.e_name.value = this.enginebuilder.name;
        this.e_sera.selectedIndex = this.enginebuilder.era_sel;
        this.e_cool.selectedIndex = this.enginebuilder.cool_sel;
        this.e_disp.valueAsNumber = this.enginebuilder.engine_displacement;
        this.e_ncyl.valueAsNumber = this.enginebuilder.num_cyl_per_row;
        this.e_nrow.valueAsNumber = this.enginebuilder.num_rows;
        this.e_cmpr.valueAsNumber = this.enginebuilder.compression_ratio;
        this.e_rpmb.valueAsNumber = this.enginebuilder.rpm_boost;
        this.e_mfdg.valueAsNumber = this.enginebuilder.material_fudge;
        this.e_qfdg.valueAsNumber = this.enginebuilder.quality_fudge;
        for (let i = 0; i < this.e_upgs.length; i++) {
            this.e_upgs[i].checked = this.enginebuilder.upg_sel[i];
        }

        var estats = this.enginebuilder.EngineStats();
        BlinkIfChanged(this.ed_name, estats.name);
        BlinkIfChanged(this.ed_powr, estats.stats.power.toString());
        BlinkIfChanged(this.ed_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.ed_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.ed_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.ed_cool, estats.stats.cooling.toString());
        BlinkIfChanged(this.ed_ospd, estats.overspeed.toString());
        BlinkIfChanged(this.ed_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.ed_malt, estats.altitude.toString());
        BlinkIfChanged(this.ed_torq, estats.torque.toString());
        BlinkIfChanged(this.ed_cost, estats.stats.cost.toString());
        if (estats.oiltank)
            BlinkIfChanged(this.ed_oilt, "Yes");
        else
            BlinkIfChanged(this.ed_oilt, "No");


    }

    private InitPulsejetInputs(cell: HTMLTableCellElement) {
        this.p_powr = document.createElement("INPUT") as HTMLInputElement;
        this.p_type = document.createElement("SELECT") as HTMLSelectElement;
        this.p_sera = document.createElement("SELECT") as HTMLSelectElement;
        this.p_bqul = document.createElement("INPUT") as HTMLInputElement;
        this.p_oqul = document.createElement("INPUT") as HTMLInputElement;
        this.p_strt = document.createElement("INPUT") as HTMLInputElement;
        for (let v of this.pulsejetbuilder.ValveTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = v.name;
            this.p_type.add(opt);
        }
        for (let e of this.pulsejetbuilder.EraTable) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = e.name;
            this.p_sera.add(opt);
        }

        var fs = CreateFlexSection(cell);
        FlexInput("Desired Power", this.p_powr, fs);
        FlexSelect("Engine Type", this.p_type, fs);
        FlexSelect("Era", this.p_sera, fs);
        FlexInput("Quality (Cost)", this.p_bqul, fs);
        FlexInput("Quality (Reliability)", this.p_oqul, fs);
        FlexCheckbox("Starter", this.p_strt, fs);

        this.p_bqul.step = "1";
        this.p_bqul.min = "0";
        this.p_oqul.step = "0.1";
        this.p_oqul.min = "0.1";

        this.p_powr.onchange = () => { this.pulsejetbuilder.desired_power = this.p_powr.valueAsNumber; this.UpdatePulsejet(); };
        this.p_type.onchange = () => { this.pulsejetbuilder.valve_sel = this.p_type.selectedIndex; this.UpdatePulsejet(); };
        this.p_sera.onchange = () => { this.pulsejetbuilder.era_sel = this.p_sera.selectedIndex; this.UpdatePulsejet(); };
        this.p_bqul.onchange = () => { this.pulsejetbuilder.build_quality = this.p_bqul.valueAsNumber; this.UpdatePulsejet(); };
        this.p_oqul.onchange = () => { this.pulsejetbuilder.overall_quality = this.p_oqul.valueAsNumber; this.UpdatePulsejet(); };
        this.p_strt.onchange = () => { this.pulsejetbuilder.starter = this.p_strt.checked; this.UpdatePulsejet(); };
    }

    private InitPulsejetOutputs(cell: HTMLTableCellElement) {
        this.pd_name = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_powr = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_mass = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_drag = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_rely = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_fuel = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_rumb = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_cost = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_malt = document.createElement("LABEL") as HTMLLabelElement;
        this.pd_dcst = document.createElement("LABEL") as HTMLLabelElement;
        var fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.pd_name, fs);
        FlexDisplay("Power", this.pd_powr, fs);
        FlexDisplay("Mass", this.pd_mass, fs);
        FlexDisplay("Drag", this.pd_drag, fs);
        FlexDisplay("Reliability", this.pd_rely, fs);
        FlexDisplay("Fuel Consumption", this.pd_fuel, fs);
        FlexDisplay("Rumble", this.pd_rumb, fs);
        FlexDisplay("Cost", this.pd_cost, fs);
        FlexDisplay("Altitude", this.pd_malt, fs);
        FlexDisplay("Design Cost", this.pd_dcst, fs);
    }

    private UpdatePulsejet() {
        this.p_powr.valueAsNumber = this.pulsejetbuilder.desired_power;
        this.p_type.selectedIndex = this.pulsejetbuilder.valve_sel;
        this.p_sera.selectedIndex = this.pulsejetbuilder.era_sel;
        this.p_bqul.valueAsNumber = this.pulsejetbuilder.build_quality;
        this.p_oqul.valueAsNumber = this.pulsejetbuilder.overall_quality;
        this.p_strt.checked = this.pulsejetbuilder.starter;

        var estats = this.pulsejetbuilder.EngineStats();
        BlinkIfChanged(this.pd_name, estats.name);
        BlinkIfChanged(this.pd_powr, estats.stats.power.toString());
        BlinkIfChanged(this.pd_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.pd_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.pd_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.pd_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.pd_rumb, estats.rumble.toString());
        BlinkIfChanged(this.pd_cost, estats.stats.cost.toString());
        BlinkIfChanged(this.pd_malt, estats.altitude.toString());
        BlinkIfChanged(this.pd_dcst, this.pulsejetbuilder.DesignCost().toString());
    }

    private InitManual(cell: HTMLTableCellElement) {
        this.m_name = document.createElement("INPUT") as HTMLInputElement;
        this.m_pwr = document.createElement("INPUT") as HTMLInputElement;
        this.m_mass = document.createElement("INPUT") as HTMLInputElement;
        this.m_drag = document.createElement("INPUT") as HTMLInputElement;
        this.m_rely = document.createElement("INPUT") as HTMLInputElement;
        this.m_cool = document.createElement("INPUT") as HTMLInputElement;
        this.m_over = document.createElement("INPUT") as HTMLInputElement;
        this.m_fuel = document.createElement("INPUT") as HTMLInputElement;
        this.m_alti = document.createElement("INPUT") as HTMLInputElement;
        this.m_torq = document.createElement("INPUT") as HTMLInputElement;
        this.m_rumb = document.createElement("INPUT") as HTMLInputElement;
        this.m_cost = document.createElement("INPUT") as HTMLInputElement;
        this.m_oil = document.createElement("INPUT") as HTMLInputElement;
        this.m_pulsejet = document.createElement("INPUT") as HTMLInputElement;
        this.m_turbo = document.createElement("INPUT") as HTMLInputElement;

        var fs = CreateFlexSection(cell);
        //Set up the individual stat input boxes
        FlexText("Name", this.m_name, fs);
        FlexInput("Power", this.m_pwr, fs);
        FlexInput("Mass", this.m_mass, fs);
        FlexInput("Drag", this.m_drag, fs);
        FlexInput("Reliability", this.m_rely, fs);
        FlexInput("Cooling", this.m_cool, fs);
        FlexInput("Overspeed", this.m_over, fs);
        FlexInput("Fuel Consumption", this.m_fuel, fs);
        FlexInput("Altitude", this.m_alti, fs);
        FlexInput("Torque", this.m_torq, fs);
        FlexInput("Rumble", this.m_rumb, fs);
        FlexInput("Cost", this.m_cost, fs);
        FlexCheckbox("Oil Tank", this.m_oil, fs);
        FlexCheckbox("Pulsejet", this.m_pulsejet, fs);
        FlexCheckbox("Turbocharger", this.m_turbo, fs);

        var trigger = () => { this.UpdateManual(); };
        this.m_name.onchange = trigger;
        this.m_pwr.onchange = trigger;
        this.m_mass.onchange = trigger;
        this.m_drag.onchange = trigger;
        this.m_rely.onchange = trigger;
        this.m_cool.onchange = trigger;
        this.m_over.onchange = trigger;
        this.m_fuel.onchange = trigger;
        this.m_alti.onchange = trigger;
        this.m_torq.onchange = trigger;
        this.m_rumb.onchange = trigger;
        this.m_cost.onchange = trigger;
        this.m_oil.onchange = trigger;
        this.m_pulsejet.onchange = trigger;
        this.m_turbo.onchange = trigger;
    }

    private InitListManagement(cell: HTMLTableCellElement) {
        this.m_select = document.createElement("SELECT") as HTMLSelectElement;
        this.m_add = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_delete = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_add_eb = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_add_pj = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_copy = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_save = document.createElement("BUTTON") as HTMLButtonElement;
        this.m_load = document.createElement("INPUT") as HTMLInputElement;

        this.m_select.onchange = () => { this.SetValues(elist.get(this.m_select.selectedIndex)); this.m_select.selectedIndex = -1; };
        this.m_delete.onclick = () => { elist.remove(this.UpdateManual()); this.UpdateList(); }
        this.m_add.onclick = () => { elist.push(this.UpdateManual()); this.UpdateList(); }
        this.m_add_eb.onclick = () => { elist.push(this.enginebuilder.EngineStats()); this.UpdateList(); }
        this.m_add_pj.onclick = () => { elist.push(this.pulsejetbuilder.EngineStats()); this.UpdateList(); }
        this.m_save.onclick = () => { download(JSON.stringify(elist.toJSON()), "EngineList.json", "json"); }
        this.m_load.setAttribute("type", "file");
        this.m_load.multiple = false;
        this.m_load.accept = "application/JSON";
        this.m_load.onchange = (evt) => {
            if (this.m_load.files.length == 0)
                return;
            var file = this.m_load.files[0];
            var reader = new FileReader();
            reader.onloadend = () => {
                try {
                    var str = JSON.parse(reader.result as string);
                    elist.fromJSON(str);
                    this.UpdateList();
                } catch { }
            };
            reader.readAsText(file);
            this.m_load.value = "";
        };

        this.m_copy.onclick = () => {
            var ser = new Serialize();
            this.UpdateManual().serialize(ser);
            var arr = ser.FinalArray();
            var str2 = _arrayBufferToString(arr);
            var txt2 = LZString.compressToEncodedURIComponent(str2);
            var link = (location.origin + "/PlaneBuilder/index.html?engine=" + txt2);
            copyStringToClipboard(link);
        };

        CreateSelect("Engines", this.m_select, cell);
        cell.appendChild(document.createElement("BR"));
        CreateButton("Copy Single Engine", this.m_copy, cell);
        CreateButton("Save Engine List", this.m_save, cell);
        CreateButton("Load Engine List", this.m_load, cell);
        CreateButton("Add From Engine Builder", this.m_add_eb, cell);
        CreateButton("Add From Pulsejet Builder", this.m_add_pj, cell);
        CreateButton("Add From Manual Input", this.m_add, cell);
        CreateButton("Delete Engine", this.m_delete, cell);
        this.UpdateList();
    }

    private UpdateList() {
        var idx = this.m_select.selectedIndex;
        while (this.m_select.options.length > 0) {
            this.m_select.options.remove(0);
        }
        for (let i = 0; i < elist.length; i++) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elist.get(i).name;
            this.m_select.add(opt);
        }
        if (idx >= elist.length) {
            idx = elist.length - 1;
        }
        this.m_select.selectedIndex = idx;
    }

    private UpdateManual() {
        var e_stats = new EngineStats();
        e_stats.name = this.m_name.value;
        e_stats.stats.power = this.m_pwr.valueAsNumber;
        e_stats.stats.mass = this.m_mass.valueAsNumber;
        e_stats.stats.drag = this.m_drag.valueAsNumber;
        e_stats.stats.reliability = this.m_rely.valueAsNumber;
        e_stats.stats.cooling = this.m_cool.valueAsNumber;
        e_stats.overspeed = this.m_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.m_fuel.valueAsNumber;
        e_stats.altitude = this.m_alti.valueAsNumber;
        e_stats.torque = this.m_torq.valueAsNumber;
        e_stats.rumble = this.m_rumb.valueAsNumber;
        e_stats.stats.cost = this.m_cost.valueAsNumber;
        e_stats.oiltank = this.m_oil.checked;
        e_stats.pulsejet = this.m_pulsejet.checked;
        if (this.m_turbo.checked)
            e_stats.stats.reqsections = 1;
        e_stats.Verify();
        this.SetValues(e_stats);
        return e_stats;
    }

    private SetValues(e_stats: EngineStats) {
        e_stats.Verify();
        this.m_name.value = e_stats.name;
        this.m_pwr.valueAsNumber = e_stats.stats.power;
        this.m_mass.valueAsNumber = e_stats.stats.mass;
        this.m_drag.valueAsNumber = e_stats.stats.drag;
        this.m_rely.valueAsNumber = e_stats.stats.reliability;
        this.m_cool.valueAsNumber = e_stats.stats.cooling;
        this.m_over.valueAsNumber = e_stats.overspeed;
        this.m_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.m_alti.valueAsNumber = e_stats.altitude;
        this.m_torq.valueAsNumber = e_stats.torque;
        this.m_rumb.valueAsNumber = e_stats.rumble;
        this.m_cost.valueAsNumber = e_stats.stats.cost;
        this.m_oil.checked = e_stats.oiltank;
        this.m_pulsejet.checked = e_stats.pulsejet;
        this.m_turbo.checked = e_stats.stats.reqsections > 0;
    }

    public SelectEngine(num: number) {
        this.SetValues(elist.get(num));
    }
}

class EngineBuilder {
    readonly EraTable: { name: string, materials: number, cost: number, maxRPM: number, powerdiv: number, fuelfactor: number }[] = [
        { name: "Pioneer", materials: 3, cost: 0.5, maxRPM: 30, powerdiv: 8, fuelfactor: 10 },
        { name: "WWI", materials: 2, cost: 1, maxRPM: 35, powerdiv: 7, fuelfactor: 8 },
        { name: "Interbellum", materials: 1.5, cost: 2, maxRPM: 40, powerdiv: 6, fuelfactor: 6 },
        { name: "WWII", materials: 1.25, cost: 2.5, maxRPM: 45, powerdiv: 5, fuelfactor: 4 },
        { name: "Last Hurrah", materials: 1, cost: 3, maxRPM: 50, powerdiv: 4, fuelfactor: 2 },
    ];
    readonly CoolingTable: { name: string, forcefactor: number, RPMoff: number, thrustfactor: number, radiator: number, massfactor: number }[] = [
        { name: "Liquid Cooled", forcefactor: 1.2, RPMoff: 0, thrustfactor: 1, radiator: 1, massfactor: 1 },
        { name: "Air Cooled", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
        { name: "Rotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.5, radiator: 0, massfactor: 1 },
        { name: "Contrarotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.25, radiator: 0, massfactor: 1 },
        { name: "Semi-Radial", forcefactor: 0.8, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
        { name: "Liquid Radial", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 2.5, massfactor: 1.3 },
    ];
    readonly Upgrades: { name: string, powerfactor: number, fuelfactor: number, massfactor: number, dragfactor: number, idealalt: number, costfactor: number, reqsection: boolean }[] = [
        { name: "Supercharger", powerfactor: 0.1, fuelfactor: 0.25, massfactor: 0.2, dragfactor: 0.5, idealalt: 3, costfactor: 6, reqsection: false },
        { name: "Turbocharger", powerfactor: 0.25, fuelfactor: 0, massfactor: 0.5, dragfactor: 0.5, idealalt: 4, costfactor: 8, reqsection: true },
        { name: "Asperator Boost", powerfactor: 0.11, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: -1, costfactor: 3, reqsection: false },
        { name: "War Emergency Power", powerfactor: 0, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 5, reqsection: false },
        { name: "Fuel Injector", powerfactor: 0, fuelfactor: -0.1, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 2, reqsection: false },
        { name: "Diesel", powerfactor: -0.2, fuelfactor: -0.5, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 0, reqsection: false },
    ];


    public name: string;
    public era_sel: number;
    public cool_sel: number;
    public upg_sel: boolean[];
    public engine_displacement: number;
    public num_cyl_per_row: number;
    public num_rows: number;
    public compression_ratio: number;
    public rpm_boost: number;
    public material_fudge: number;
    public quality_fudge: number;


    constructor() {
        this.name = "Default Name";
        this.era_sel = 0;
        this.cool_sel = 0;
        this.upg_sel = [...Array(this.Upgrades.length).fill(false)];
        this.engine_displacement = 1;
        this.num_cyl_per_row = 2;
        this.num_rows = 2;
        this.compression_ratio = 2;
        this.rpm_boost = 1;
        this.material_fudge = 1;
        this.quality_fudge = 1;
    }

    private UpgradePower() {
        var power = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                power += this.Upgrades[i].powerfactor;
        }
        if (this.upg_sel[0]) {
            power *= 1 + this.Upgrades[0].powerfactor;
        }
        return power;
    }

    private RPM() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];
        return (Era.maxRPM - Cool.RPMoff) * (this.compression_ratio / 10);
    }

    private GearedRPM() {
        var GearedRPM = this.RPM() * this.rpm_boost;
        return GearedRPM;
    }

    private CalcPower() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];

        //Calculate Force
        var EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        var RawForce = EngineForce * this.UpgradePower();
        //Output Force
        var OutputForce = RawForce * (this.GearedRPM() / 10);
        return Math.floor(1.0e-6 + OutputForce / Era.powerdiv);
    }

    private UpgradeMass() {
        var mass = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                mass += this.Upgrades[i].massfactor;
        }
        return mass;
    }

    private CalcMass() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];

        var CylMass = this.engine_displacement ** 2 * this.compression_ratio / 1000;
        var CrankMass = (this.engine_displacement * this.num_rows) / 10 + 1;
        var PistMass = this.engine_displacement / 5;

        var Mass = Math.floor(1.0e-6 + (CylMass + CrankMass + PistMass) * this.UpgradeMass() * this.material_fudge * Cool.massfactor);
        return Mass;
    }

    private UpgradeDrag() {
        var drag = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                drag += this.Upgrades[i].dragfactor;
        }
        return drag;
    }

    private CoolDrag() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 1;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return this.GearedRPM() / 10;
            case "Contrarotary":
                return this.GearedRPM() / 8;
            case "Semi-Radial":
                return 1;
            case "Liquid Radial":
                return 1.2;
        }
        throw "Error in CoolDrag, no valid switch case.";
    }

    private CalcDrag() {
        var RawDrag = 3 + (this.engine_displacement / this.num_rows) / 3;
        return Math.floor(1.0e-6 + RawDrag * this.CoolDrag() * this.UpgradeDrag());
    }

    private CoolReliability() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return (this.num_rows / 2 + 5 * this.num_cyl_per_row) / 10;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return 1;
            case "Contrarotary":
                return 1.1;
            case "Semi-Radial":
                return 0.8;
            case "Liquid Radial":
                return 1;
        }
        throw "Error in CoolReliability, no valid switch case.";
    }

    private CoolBurnout() {
        var EraBurnout = this.EraTable[this.era_sel].materials / 2;
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 2;
            case "Air Cooled":
                return (2 + (this.num_rows ** 2)) * EraBurnout;
            case "Rotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Contrarotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Semi-Radial":
                return (2 + (this.num_rows ** 2) / 2) * EraBurnout;
            case "Liquid Radial":
                return 0.5;
        }
        throw "Error in CoolBurnout, no valid switch case.";
    }

    private MaterialModifier() {
        var EraBurnout = this.EraTable[this.era_sel].materials;
        var num_cyl = this.num_cyl_per_row * this.num_rows;
        var CylinderBurnout = this.engine_displacement / num_cyl * (this.compression_ratio ** 2) * EraBurnout;
        var GearingBurnout = this.rpm_boost * CylinderBurnout * this.CoolBurnout();
        return GearingBurnout * this.rpm_boost / (this.material_fudge + this.quality_fudge - 1);
    }

    private CalcReliability() {
        var Reliability = 6 - this.MaterialModifier() * this.CoolReliability() / 25;
        return Math.trunc(Reliability);
    }

    private IsRotary() {
        if (this.CoolingTable[this.cool_sel].name == "Rotary"
            || this.CoolingTable[this.cool_sel].name == "Contrarotary")
            return true;
        return false;
    }

    private CalcCooling() {
        if (this.IsRotary())
            return 0;

        return Math.floor(1.0e-6 + this.MaterialModifier() / 20 * this.CoolingTable[this.cool_sel].radiator);
    }

    private CalcOverspeed() {
        return Math.round(1.5 * this.RPM())
    }

    private UpgradeFuel() {
        var fuel = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                fuel += this.Upgrades[i].fuelfactor;
        }
        return fuel * this.EraTable[this.era_sel].fuelfactor;
    }

    private CalcFuelConsumption() {
        var FuelConsumption = this.engine_displacement * this.RPM() / 100;
        return Math.floor(1.0e-6 + FuelConsumption * this.UpgradeFuel());
    }

    private CalcAltitude() {
        var alt = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                alt += this.Upgrades[i].idealalt;
        }
        return 3 + alt;
    }

    private CoolTorque() {
        if (this.IsRotary()) {
            return this.CalcMass();
        }
        return 1;
    }

    private CalcTorque() {
        return Math.floor(1.0e-6 + (this.CoolTorque() * this.GearedRPM() / 5) / 4);
    }

    private UpgradeCost() {
        var cost = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                cost += this.Upgrades[i].costfactor;
        }
        return cost;
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];
        var Cool = this.CoolingTable[this.cool_sel];

        var EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        var CylinderForce = EngineForce / (this.num_rows * this.num_cyl_per_row);
        var Cost = this.UpgradeCost() + (CylinderForce / 10 * (this.num_cyl_per_row + (this.num_rows * 1.3)));

        return Math.floor(1.0e-6 + this.quality_fudge * Era.cost * Cost);
    }

    public EngineStats() {
        var estats = new EngineStats();
        estats.name = this.name;

        estats.stats.power = this.CalcPower();
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.cooling = this.CalcCooling();
        estats.oiltank = this.IsRotary();
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.altitude = this.CalcAltitude();
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;
        return estats;
    }
}

class PulsejetBuilder {
    public desired_power: number;
    public valve_sel: number;
    public era_sel: number;
    public build_quality: number;
    public overall_quality: number;
    public starter: boolean;

    readonly EraTable: { name: string, cost: number, drag: number, mass: number, fuel: number, vibe: number, material: number }[] = [
        { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
        { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
        { name: "Interbellum", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
        { name: "WWII", cost: 0.25, drag: 40, mass: 100, fuel: 1, vibe: 5, material: 24 },
        { name: "Last Hurrah", cost: 0.1, drag: 50, mass: 150, fuel: 0.7, vibe: 6, material: 50 },
    ];
    readonly ValveTable: { name: string, scale: number, rumble: number, designcost: number, reliability: number }[] = [
        { name: "Valved", scale: 1, rumble: 1, designcost: 2, reliability: 1 },
        { name: "Valveless", scale: 1.1, rumble: 0.9, designcost: 1, reliability: 3 },
    ];

    constructor() {
        this.desired_power = 1;
        this.valve_sel = 0;
        this.era_sel = 0;
        this.build_quality = 1;
        this.overall_quality = 1;
        this.starter = false;
    }

    private TempMass() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var StarterMass = 0;
        if (this.starter)
            StarterMass = 1;

        var Mass = (this.desired_power / Era.mass) * Valve.scale + StarterMass;
        return Mass;
    }

    private CalcMass() {
        return Math.floor(1.0e-6 + this.TempMass()) + 1;
    }

    private CalcDrag() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var Drag = (this.desired_power / Era.drag) * Valve.scale + 1;
        return Math.floor(1.0e-6 + this.TempMass() + Drag + 1);
    }

    private CalcReliability() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var Reliability = this.desired_power / (Era.material * Valve.reliability * this.overall_quality) - 1;
        return Math.trunc(-Reliability);
    }

    private CalcFuelConsumption() {
        var Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.desired_power * Era.fuel);
    }

    private CalcRumble() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        return Math.floor(1.0e-6 + this.desired_power * Valve.rumble / (2 * Era.vibe));
    }

    private CalcCost() {
        var Era = this.EraTable[this.era_sel];

        return Math.floor(1.0e-6 + this.TempMass() * this.build_quality * Era.cost) + 1;
    }

    public DesignCost() {
        var Era = this.EraTable[this.era_sel];
        var Valve = this.ValveTable[this.valve_sel];

        var StarterCost = 0;
        if (this.starter)
            StarterCost = 3;

        var Cost = this.desired_power * Era.cost / Valve.designcost;
        return Math.floor(1.0e-6 + 1 + this.build_quality * (Cost + StarterCost));
    }

    public EngineStats() {
        var estats = new EngineStats();

        var valved = "";
        if (this.valve_sel == 0)
            valved = "V";

        estats.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        estats.stats.power = this.desired_power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.rumble = this.CalcRumble();
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 3;
        estats.pulsejet = true;
        return estats;
    }
}