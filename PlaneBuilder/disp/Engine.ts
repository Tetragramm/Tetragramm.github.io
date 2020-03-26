/// <reference path="./Display.ts" />
/// <reference path="../impl/Engine.ts" />

class Engine_HTML extends Display {
    private engine: Engine;
    private engine_list: EngineStats[];
    private e_select: HTMLSelectElement;
    private e_pwr: HTMLInputElement;
    private e_mass: HTMLInputElement;
    private e_drag: HTMLInputElement;
    private e_rely: HTMLInputElement;
    private e_cool: HTMLInputElement;
    private e_over: HTMLInputElement;
    private e_fuel: HTMLInputElement;
    private e_alti: HTMLInputElement;
    private e_torq: HTMLInputElement;
    private e_rumb: HTMLInputElement;
    private e_cost: HTMLInputElement;
    private e_oil: HTMLInputElement;
    private e_pulsejet: HTMLInputElement;
    //Cooling Elements
    private cool_cell: HTMLTableDataCellElement;
    private cool_select: HTMLSelectElement;
    private cool_count: HTMLInputElement;
    //Mounting Elements
    private mount_select: HTMLSelectElement;
    private pushpull_input: HTMLInputElement;
    private torque_input: HTMLInputElement;
    //Upgrade Elements
    private ds_input: HTMLInputElement;
    private gp_input: HTMLInputElement;
    private gpr_input: HTMLInputElement;
    //Cowl Elements
    private cowl_select: HTMLSelectElement;
    //Electrical Elements
    private alternator_input: HTMLInputElement;
    private generator_input: HTMLInputElement;

    //Display Stat Elements
    private d_powr: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;
    private d_rely: HTMLTableCellElement;
    private d_visi: HTMLTableCellElement;
    private d_over: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_alti: HTMLTableCellElement;
    private d_fuel: HTMLTableCellElement;
    private d_pstb: HTMLTableCellElement;
    private d_lstb: HTMLTableCellElement;
    private d_maxs: HTMLTableCellElement;
    private d_strc: HTMLTableCellElement;
    private d_fstr: HTMLTableCellElement;
    private d_sect: HTMLTableCellElement;
    private d_chrg: HTMLTableCellElement;

    constructor(eng: Engine, r: HTMLTableRowElement) {
        super();
        this.engine = eng;
        this.engine_list = eng.GetListOfEngines();
        var row = r;
        this.InitTypeSelect(row);

        var option_cell = row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE") as HTMLTableElement;
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
        var opt2_table = document.createElement("TABLE") as HTMLTableElement;
        opt2_table.className = "inner_table";
        CreateTH(opt2_table.insertRow(), "Cowls");
        var cowl_cell = opt2_table.insertRow().insertCell();
        option2_cell.appendChild(opt2_table);
        CreateTH(opt2_table.insertRow(), "Electrical");
        var elec_cell = opt2_table.insertRow().insertCell();



        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitCowlSelect(cowl_cell);
        this.InitElectricSelect(elec_cell);
        this.InitStatDisplay(row);
    }

    private InitTypeSelect(row: HTMLTableRowElement) {
        this.e_pwr = document.createElement("INPUT") as HTMLInputElement;
        this.e_mass = document.createElement("INPUT") as HTMLInputElement;
        this.e_drag = document.createElement("INPUT") as HTMLInputElement;
        this.e_rely = document.createElement("INPUT") as HTMLInputElement;
        this.e_cool = document.createElement("INPUT") as HTMLInputElement;
        this.e_over = document.createElement("INPUT") as HTMLInputElement;
        this.e_fuel = document.createElement("INPUT") as HTMLInputElement;
        this.e_alti = document.createElement("INPUT") as HTMLInputElement;
        this.e_torq = document.createElement("INPUT") as HTMLInputElement;
        this.e_rumb = document.createElement("INPUT") as HTMLInputElement;
        this.e_cost = document.createElement("INPUT") as HTMLInputElement;
        this.e_oil = document.createElement("INPUT") as HTMLInputElement;
        this.e_pulsejet = document.createElement("INPUT") as HTMLInputElement;
        this.cool_count = document.createElement("INPUT") as HTMLInputElement;
        this.cool_count.setAttribute("type", "number");

        var tcell = row.insertCell(0);
        //Set up the engine select box.
        this.e_select = document.createElement("SELECT") as HTMLSelectElement;
        this.e_select.required = true;
        tcell.appendChild(this.e_select);
        tcell.appendChild(document.createElement("BR"));
        for (let i = 0; i < this.engine_list.length; i++) {
            let eng = this.engine_list[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = eng.name;
            this.e_select.add(opt);
        }
        let opt = document.createElement("OPTION") as HTMLOptionElement;
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

    public UpdateEngine(en: Engine) {
        this.engine = en;
    }

    private InitMountSelect(mount_cell: HTMLTableCellElement) {
        var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
        txtSpan.innerHTML = "Engine Mounting Location";
        mount_cell.appendChild(txtSpan);
        mount_cell.appendChild(document.createElement("BR"));
        this.mount_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.engine.GetMountList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            opt.value = elem.pp_type;
            this.mount_select.add(opt);
        }
        this.mount_select.required = true;
        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        this.mount_select.onchange = () => { this.engine.SetMountIndex(this.mount_select.selectedIndex); };
        mount_cell.appendChild(this.mount_select);
        mount_cell.appendChild(document.createElement("BR"));

        this.pushpull_input = document.createElement("INPUT") as HTMLInputElement;
        this.torque_input = document.createElement("INPUT") as HTMLInputElement;
        var fs = CreateFlexSection(mount_cell);
        FlexCheckbox(" Push Pull", this.pushpull_input, fs);
        FlexCheckbox(" Torque To Structure", this.torque_input, fs);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }

    private InitUpgradeSelect(upg_cell: HTMLTableCellElement) {
        this.ds_input = document.createElement("INPUT") as HTMLInputElement;
        this.gp_input = document.createElement("INPUT") as HTMLInputElement;
        this.gpr_input = document.createElement("INPUT") as HTMLInputElement;
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox("Extended Driveshafts", this.ds_input, fs);
        FlexInput("Geared Propeller", this.gp_input, fs);
        FlexInput("Negate Reliability Penalty", this.gpr_input, fs);
        this.gp_input.onchange = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.onchange = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };

    }

    private InitElectricSelect(cell: HTMLTableCellElement){
        var fs = CreateFlexSection(cell);
        this.alternator_input = document.createElement("INPUT") as HTMLInputElement;
        this.generator_input = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Alternator", this.alternator_input, fs);
        FlexCheckbox("Generator", this.generator_input, fs);
        this.alternator_input.oninput = ()=>{ this.engine.SetAlternator(this.alternator_input.checked);};
        this.generator_input.oninput = ()=>{ this.engine.SetGenerator(this.generator_input.checked);};
    }

    private InitStatDisplay(row: HTMLTableRowElement) {
        var stat_cell = row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
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
        var h6_row = tbl_stat.insertRow();
        CreateTH(h6_row, "Charge");
        CreateTH(h6_row, "");
        CreateTH(h6_row, "");
        var c6_row = tbl_stat.insertRow();
        this.d_chrg = c6_row.insertCell();
        c6_row.insertCell();
        c6_row.insertCell();
    }

    private InitCowlSelect(cell: HTMLTableCellElement) {
        this.cowl_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.engine.GetCowlList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            this.cowl_select.add(opt);
        }
        this.cowl_select.required = true;
        this.cowl_select.selectedIndex = this.engine.GetMountIndex();
        this.cowl_select.onchange = () => { this.engine.SetCowl(this.cowl_select.selectedIndex); };
        cell.appendChild(this.cowl_select);
    }

    private InitCoolingSelect() {
        while (this.cool_cell.children.length > 0)
            this.cool_cell.removeChild(this.cool_cell.children[0]);

        if (this.e_oil.checked) {
            this.e_cool.valueAsNumber = 0;
            var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
            txtSpan.innerHTML = "Rotary Engines use Oil Tanks.<br/>+1 Mass, Oil Tank is a Vital Component.";
            this.cool_cell.appendChild(txtSpan);
        }
        else if (this.e_cool.valueAsNumber == 0) {
            var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
            txtSpan.innerHTML = "Air-Cooled Engine.<br/>All is well.";
            this.cool_cell.appendChild(txtSpan);
        }
        else {
            var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
            txtSpan.innerHTML = "    Select Radiator";
            if (!this.cool_select) {
                this.cool_select = document.createElement("SELECT") as HTMLSelectElement;
                this.cool_select.required = true;
            }
            var numrad = this.engine.GetNumRadiators();
            while (this.cool_select.options.length > 0) {
                this.cool_select.options.remove(0);
            }
            for (let i = 1; i < numrad + 1; i++) {
                let opt = document.createElement("OPTION") as HTMLOptionElement;
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
            var txtSpan2 = document.createElement("SPAN") as HTMLSpanElement;
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

    private SendCustomStats() {
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

    private SetInputDisable(b: boolean) {
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

    public UpdateDisplay() {
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
            for (let i = 0; i < this.mount_select.options.length; i++) {
                let opt = this.mount_select.options[i];
                if (opt.value == "fuselage") {
                    opt.disabled = true;
                }
            }
            this.cowl_select.disabled = true;
            this.alternator_input.disabled = true;
            this.generator_input.disabled = true;
        }
        else {
            this.mount_select.disabled = false;
            this.pushpull_input.disabled = false;
            this.ds_input.disabled = false;
            this.gp_input.disabled = false;
            this.gpr_input.disabled = false;
            for (let i = 0; i < this.mount_select.options.length; i++) {
                let opt = this.mount_select.options[i];
                opt.disabled = false;
            }
            this.cowl_select.disabled = false;
            this.alternator_input.disabled = false;
            this.generator_input.disabled = false;
        }

        this.cowl_select.selectedIndex = this.engine.GetCowl();
        var cowl_enable = this.engine.GetCowlEnabled();
        for (let i = 0; i < cowl_enable.length; i++) {
            this.cowl_select.options[i].disabled = !cowl_enable[i];
        }

        this.generator_input.checked = this.engine.GetGenerator();
        this.generator_input.disabled = !this.engine.GetGeneratorEnabled();
        this.alternator_input.checked = this.engine.GetAlternator();
        this.alternator_input.disabled = !this.engine.GetAlternatorEnabled();

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
        BlinkIfChanged(this.d_chrg, full_stats.charge.toString());
    }
}