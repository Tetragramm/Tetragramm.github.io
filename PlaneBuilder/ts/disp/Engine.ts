import { Engine, } from "../impl/Engine.js";
import { ENGINE_RARITY } from "../impl/EngineInputs.js";
import { GetEngineLists } from "../impl/EngineList.js";
import { lu } from "../impl/Localization.js";
import { CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexDisplay, FlexInput, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";

export class Engine_HTML extends Display {
    private engine: Engine;
    private e_list_select: HTMLSelectElement;
    private e_select: HTMLSelectElement;
    private e_pwr: HTMLLabelElement;
    private e_mass: HTMLLabelElement;
    private e_drag: HTMLLabelElement;
    private e_rely: HTMLLabelElement;
    private e_cool: HTMLLabelElement;
    private e_over: HTMLLabelElement;
    private e_fuel: HTMLLabelElement;
    private e_alti: HTMLLabelElement;
    private e_torq: HTMLLabelElement;
    private e_rumb: HTMLLabelElement;
    private e_cost: HTMLLabelElement;
    private e_rarity: HTMLLabelElement;
    //Cooling Elements
    private cool_cell: HTMLTableDataCellElement;
    private cool_select: HTMLSelectElement;
    private cool_count: HTMLInputElement;
    private intake_fan: HTMLInputElement;
    //Mounting Elements
    private mount_select: HTMLSelectElement;
    private pushpull_label: HTMLLabelElement;
    private pushpull_input: HTMLInputElement;
    private torque_input: HTMLInputElement;
    //Upgrade Elements
    private ds_input: HTMLInputElement;
    private op_input: HTMLInputElement;
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
        var row = r;
        this.InitTypeSelect(row);

        var option_cell = row.insertCell();
        option_cell.className = "inner_table";
        var opt_table = document.createElement("TABLE") as HTMLTableElement;
        opt_table.className = "inner_table";
        CreateTH(opt_table.insertRow(), lu("Engine Cooling"));
        this.cool_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), lu("Engine Mounting"));
        var mount_cell = opt_table.insertRow().insertCell();
        CreateTH(opt_table.insertRow(), lu("Engine Upgrades"));
        var upg_cell = opt_table.insertRow().insertCell();
        option_cell.appendChild(opt_table);

        var option2_cell = row.insertCell();
        option2_cell.className = "inner_table";
        var opt2_table = document.createElement("TABLE") as HTMLTableElement;
        opt2_table.className = "inner_table";
        CreateTH(opt2_table.insertRow(), lu("Engine Cowls"));
        var cowl_cell = opt2_table.insertRow().insertCell();
        option2_cell.appendChild(opt2_table);
        CreateTH(opt2_table.insertRow(), lu("Engine Electrical"));
        var elec_cell = opt2_table.insertRow().insertCell();



        this.InitMountSelect(mount_cell);
        this.InitUpgradeSelect(upg_cell);
        this.InitCowlSelect(cowl_cell);
        this.InitElectricSelect(elec_cell);
        this.InitStatDisplay(row);
        this.intake_fan = document.createElement("INPUT") as HTMLInputElement;
        this.intake_fan.onchange = () => { this.engine.SetIntakeFan(this.intake_fan.checked); };
    }

    private InitTypeSelect(row: HTMLTableRowElement) {
        this.e_rarity = document.createElement("LABEL") as HTMLLabelElement;
        this.e_pwr = document.createElement("LABEL") as HTMLLabelElement;
        this.e_mass = document.createElement("LABEL") as HTMLLabelElement;
        this.e_drag = document.createElement("LABEL") as HTMLLabelElement;
        this.e_rely = document.createElement("LABEL") as HTMLLabelElement;
        this.e_cool = document.createElement("LABEL") as HTMLLabelElement;
        this.e_over = document.createElement("LABEL") as HTMLLabelElement;
        this.e_fuel = document.createElement("LABEL") as HTMLLabelElement;
        this.e_alti = document.createElement("LABEL") as HTMLLabelElement;
        this.e_torq = document.createElement("LABEL") as HTMLLabelElement;
        this.e_rumb = document.createElement("LABEL") as HTMLLabelElement;
        this.e_cost = document.createElement("LABEL") as HTMLLabelElement;
        this.cool_count = document.createElement("INPUT") as HTMLInputElement;
        this.cool_count.setAttribute("type", "number");

        var tcell = row.insertCell(0);
        //Set up the engine list select box.
        this.e_list_select = document.createElement("SELECT") as HTMLSelectElement;
        this.e_list_select.required = true;
        tcell.appendChild(this.e_list_select);
        tcell.appendChild(document.createElement("BR"));
        for (let key of GetEngineLists().keys()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = key;
            this.e_list_select.add(opt);
        }

        //Set up the engine select box.
        this.e_select = document.createElement("SELECT") as HTMLSelectElement;
        this.e_select.required = true;
        tcell.appendChild(this.e_select);
        tcell.appendChild(document.createElement("BR"));
        const engine_list = GetEngineLists();
        for (let i = 0; i < engine_list.get("Custom").length; i++) {
            let eng = engine_list.get("Custom").get(i);
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = eng.name;
            this.e_select.add(opt);
        }

        var fs = CreateFlexSection(tcell);
        //Set up the individual stat input boxes
        FlexDisplay(lu("Rarity"), this.e_rarity, fs);
        FlexDisplay(lu("Stat Power"), this.e_pwr, fs);
        FlexDisplay(lu("Stat Mass"), this.e_mass, fs);
        FlexDisplay(lu("Stat Drag"), this.e_drag, fs);
        FlexDisplay(lu("Stat Reliability"), this.e_rely, fs);
        FlexDisplay(lu("Stat Cooling"), this.e_cool, fs);
        FlexDisplay(lu("Stat Overspeed"), this.e_over, fs);
        FlexDisplay(lu("Stat Fuel Consumption"), this.e_fuel, fs);
        FlexDisplay(lu("Stat Altitude"), this.e_alti, fs);
        FlexDisplay(lu("Stat Torque"), this.e_torq, fs);
        FlexDisplay(lu("Stat Rumble"), this.e_rumb, fs);
        FlexDisplay(lu("Stat Cost"), this.e_cost, fs);

        //Event Listeners for engine stats
        this.e_list_select.onchange = () => {
            this.engine.SetSelectedList(
                this.e_list_select.options[this.e_list_select.selectedIndex].text);
        }
        this.e_select.onchange = () => {
            this.engine.SetSelectedIndex(this.e_select.selectedIndex);
        };
    }

    public UpdateEngine(en: Engine) {
        this.engine = en;
    }

    private InitMountSelect(mount_cell: HTMLTableCellElement) {
        var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
        txtSpan.textContent = lu("Engine Mounting Location");
        mount_cell.appendChild(txtSpan);
        mount_cell.appendChild(document.createElement("BR"));
        this.mount_select = document.createElement("SELECT") as HTMLSelectElement;
        for (let elem of this.engine.GetMountList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
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
        this.pushpull_label = FlexCheckbox(" " + lu("Engine Push Pull"), this.pushpull_input, fs);
        FlexCheckbox(" " + lu("Engine Torque To Structure"), this.torque_input, fs);
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.torque_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.onchange = () => { this.engine.SetUsePushPull(this.pushpull_input.checked); };
        this.torque_input.onchange = () => { this.engine.SetTorqueToStruct(this.torque_input.checked); };
    }

    private InitUpgradeSelect(upg_cell: HTMLTableCellElement) {
        this.ds_input = document.createElement("INPUT") as HTMLInputElement;
        this.op_input = document.createElement("INPUT") as HTMLInputElement;
        this.gp_input = document.createElement("INPUT") as HTMLInputElement;
        this.gpr_input = document.createElement("INPUT") as HTMLInputElement;
        var fs = CreateFlexSection(upg_cell);
        FlexCheckbox(lu("Engine Extended Driveshafts"), this.ds_input, fs);
        FlexCheckbox(lu("Engine Outboard Propeller"), this.op_input, fs);
        FlexInput(lu("Engine Geared Propeller"), this.gp_input, fs);
        FlexInput(lu("Engine Negate Reliability Penalty"), this.gpr_input, fs);
        this.gp_input.onchange = () => { this.engine.SetGearCount(this.gp_input.valueAsNumber); };
        this.gpr_input.onchange = () => { this.engine.SetGearReliability(this.gpr_input.valueAsNumber); };
        this.ds_input.onchange = () => { this.engine.SetUseExtendedDriveshaft(this.ds_input.checked); };
        this.op_input.onchange = () => { this.engine.SetOutboardProp(this.op_input.checked); };

    }

    private InitElectricSelect(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);
        this.alternator_input = document.createElement("INPUT") as HTMLInputElement;
        this.generator_input = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox(lu("Engine Alternator"), this.alternator_input, fs);
        FlexCheckbox(lu("Engine Generator"), this.generator_input, fs);
        this.alternator_input.onchange = () => { this.engine.SetAlternator(this.alternator_input.checked); };
        this.generator_input.onchange = () => { this.engine.SetGenerator(this.generator_input.checked); };
    }

    private InitStatDisplay(row: HTMLTableRowElement) {
        var stat_cell = row.insertCell();
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Power"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        var c1_row = tbl_stat.insertRow();
        this.d_powr = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Reliability"));
        CreateTH(h2_row, lu("Stat Visibility"));
        CreateTH(h2_row, lu("Stat Overspeed"));
        var c2_row = tbl_stat.insertRow();
        this.d_rely = c2_row.insertCell();
        this.d_rely.className = "part_local";
        this.d_visi = c2_row.insertCell();
        this.d_over = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Cost"));
        CreateTH(h3_row, lu("Stat Altitude"));
        CreateTH(h3_row, lu("Stat Fuel Consumption"));
        var c3_row = tbl_stat.insertRow();
        this.d_cost = c3_row.insertCell();
        this.d_alti = c3_row.insertCell();
        this.d_fuel = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, lu("Stat Pitch Stability"));
        CreateTH(h4_row, lu("Stat Lateral Stability"));
        CreateTH(h4_row, lu("Stat Raw Strain"));
        var c4_row = tbl_stat.insertRow();
        this.d_pstb = c4_row.insertCell();
        this.d_lstb = c4_row.insertCell();
        this.d_maxs = c4_row.insertCell();
        var h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, lu("Stat Structure"));
        CreateTH(h5_row, lu("Stat Flight Stress"));
        CreateTH(h5_row, lu("Stat Required Sections"));
        var c5_row = tbl_stat.insertRow();
        this.d_strc = c5_row.insertCell();
        this.d_fstr = c5_row.insertCell();
        this.d_sect = c5_row.insertCell();
        var h6_row = tbl_stat.insertRow();
        CreateTH(h6_row, lu("Stat Charge"));
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
            opt.text = lu(elem.name);
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

        if (this.engine.IsRotary()) {
            this.e_cool.textContent = "0";
            var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
            txtSpan.innerText = lu("Engine Rotary Cooling");
            this.cool_cell.appendChild(txtSpan);
        }
        else if (this.e_cool.textContent == "0") {
            var txtSpan = document.createElement("SPAN") as HTMLSpanElement;
            txtSpan.textContent = lu("Engine Air-Cooled Engine.");
            this.cool_cell.appendChild(txtSpan);
            var fs = CreateFlexSection(this.cool_cell);
            FlexCheckbox(lu("Engine Air Cooling Fan"), this.intake_fan, fs);
            this.intake_fan.disabled = !this.engine.CanIntakeFan();
        }
        else {
            if (!this.cool_select) {
                this.cool_select = document.createElement("SELECT") as HTMLSelectElement;
                this.cool_select.required = true;
            }

            var fs = CreateFlexSection(this.cool_cell);
            FlexSelect(lu("Engine Select Radiator"), this.cool_select, fs);
            FlexInput(lu("Engine Cooling Amount"), this.cool_count, fs);

            var numrad = this.engine.GetNumRadiators();
            while (this.cool_select.options.length > 0) {
                this.cool_select.options.remove(this.cool_select.options.length - 1);
            }
            for (let i = 1; i < numrad + 1; i++) {
                let opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.textContent = lu("Vital Part Radiator", i);
                this.cool_select.add(opt);
            }
            this.cool_select.onchange = () => {
                this.engine.SetRadiator(this.cool_select.selectedIndex);
            };
            this.cool_select.selectedIndex = this.engine.GetRadiator();
            this.cool_count.min = "0";
            this.cool_count.max = this.engine.GetMaxCooling().toString();
            this.cool_count.valueAsNumber = this.engine.GetCooling();
            this.cool_count.onchange = () => { this.engine.SetCooling(this.cool_count.valueAsNumber); };
        }
    }

    public UpdateDisplay() {
        while (this.e_list_select.options.length > 0) {
            this.e_list_select.options.remove(this.e_list_select.options.length - 1);
        }
        while (this.e_select.options.length > 0) {
            this.e_select.options.remove(this.e_select.options.length - 1);
        }
        var list_idx = this.engine.GetSelectedList();
        if (list_idx != "") {

            var found_list = false;
            var sel_list = 0;
            var engine_list = GetEngineLists();
            for (let key of engine_list.keys()) {
                let opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.text = key;
                this.e_list_select.add(opt);
                if (key != list_idx && !found_list) {
                    sel_list -= 1;
                } else {
                    sel_list = Math.abs(sel_list);
                    found_list = true;
                }
            }
            this.e_list_select.selectedIndex = sel_list;

            var can_idx = this.engine.CanSelectIndex();
            for (let i = 0; i < engine_list.get(list_idx).length; i++) {
                let eng = engine_list.get(list_idx).get(i);
                let opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.text = eng.name;
                opt.disabled = !can_idx[i];
                this.e_select.add(opt);
            }
            this.e_select.selectedIndex = this.engine.GetSelectedIndex();
        } else {
            for (let key of engine_list.keys()) {
                let opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.text = key;
                this.e_list_select.add(opt);
            }
            this.e_list_select.selectedIndex = -1;
            let eng = this.engine.GetCurrentStats();
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = eng.name;
            this.e_select.add(opt);
            this.e_select.selectedIndex = 0;
        }
        var e_stats = this.engine.GetCurrentStats();
        switch (e_stats.rarity) {
            case ENGINE_RARITY.CUSTOM:
                this.e_rarity.textContent = lu("Rarity Custom");
                this.e_rarity.className = "ER_Custom";
                break;
            case ENGINE_RARITY.COMMON:
                this.e_rarity.textContent = lu("Rarity Common");
                this.e_rarity.className = "";
                break;
            case ENGINE_RARITY.RARE:
                this.e_rarity.textContent = lu("Rarity Rare");
                this.e_rarity.className = "ER_Rare";
                break;
            case ENGINE_RARITY.LEGENDARY:
                this.e_rarity.textContent = lu("Rarity Legendary");
                this.e_rarity.className = "ER_Legendary";
                break;
        }

        var b = this.engine.GetMinAltitude();
        var t = this.engine.GetMaxAltitude();
        this.e_pwr.textContent = e_stats.stats.power.toString();
        this.e_mass.textContent = e_stats.stats.mass.toString();
        this.e_drag.textContent = e_stats.stats.drag.toString();
        this.e_rely.textContent = e_stats.stats.reliability.toString();
        this.e_cool.textContent = e_stats.stats.cooling.toString();
        this.e_over.textContent = e_stats.overspeed.toString();
        this.e_fuel.textContent = e_stats.stats.fuelconsumption.toString();
        this.e_alti.textContent = b.toString() + "-" + t.toString();
        this.e_torq.textContent = e_stats.torque.toString();
        this.e_rumb.textContent = e_stats.rumble.toString();
        this.e_cost.textContent = e_stats.stats.cost.toString();
        this.InitCoolingSelect();
        this.intake_fan.checked = this.engine.GetIntakeFan();

        this.mount_select.selectedIndex = this.engine.GetMountIndex();
        if (this.engine.GetIsTurbine()) {
            this.pushpull_label.textContent = " " + lu("Engine Side-by-Side");
        } else {
            this.pushpull_label.textContent = " " + lu("Engine Push Pull");
        }
        this.pushpull_input.checked = this.engine.GetUsePushPull();
        this.pushpull_input.disabled = !this.engine.CanUsePushPull();
        this.torque_input.checked = this.engine.GetTorqueToStruct();
        this.torque_input.checked = this.engine.GetTorqueToStruct();
        this.torque_input.disabled = !this.engine.CanTorqueToStruct();
        this.ds_input.checked = this.engine.GetUseExtendedDriveshaft();
        this.ds_input.disabled = !this.engine.CanUseExtendedDriveshaft();
        this.op_input.checked = this.engine.GetOutboardProp();
        this.op_input.disabled = !this.engine.CanOutboardProp();
        this.gp_input.valueAsNumber = this.engine.GetGearCount();
        this.gp_input.disabled = !this.engine.CanUseGears();
        this.gpr_input.valueAsNumber = this.engine.GetGearReliability();
        this.gpr_input.disabled = !this.engine.CanUseGears();

        if (e_stats.pulsejet) {
            this.mount_select.disabled = true;
            this.mount_select.selectedIndex = -1;
            for (let i = 0; i < this.mount_select.options.length; i++) {
                if (this.mount_select.options[i].value == "fuselage") {
                    this.mount_select.options[i].disabled = true;
                }
            }
            this.cowl_select.disabled = true;
            this.alternator_input.disabled = true;
            this.generator_input.disabled = true;
        }
        else {
            this.mount_select.disabled = false;
            var can_mount = this.engine.CanMountIndex();
            for (let i = 0; i < this.mount_select.options.length; i++) {
                this.mount_select.options[i].disabled = !can_mount[i];
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
        BlinkIfChanged(this.d_powr, full_stats.power.toString(), true);
        BlinkIfChanged(this.d_mass, full_stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, full_stats.drag.toString(), false);
        BlinkIfChanged(this.d_rely, this.engine.GetReliability().toString(), true);
        BlinkIfChanged(this.d_visi, full_stats.visibility.toString(), true);
        BlinkIfChanged(this.d_over, this.engine.GetOverspeed().toString(), true);
        BlinkIfChanged(this.d_cost, full_stats.cost.toString(), false);
        BlinkIfChanged(this.d_alti, b.toString() + "-" + t.toString());
        BlinkIfChanged(this.d_fuel, full_stats.fuelconsumption.toString(), false);
        BlinkIfChanged(this.d_pstb, full_stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, full_stats.latstab.toString(), true);
        BlinkIfChanged(this.d_maxs, full_stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_strc, full_stats.structure.toString(), true);
        BlinkIfChanged(this.d_fstr, full_stats.flightstress.toString(), false);
        BlinkIfChanged(this.d_sect, full_stats.reqsections.toString(), false);
        BlinkIfChanged(this.d_chrg, full_stats.charge.toString(), true);
    }
}