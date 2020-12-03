/// <reference path="./Display.ts" />
/// <reference path="../impl/Reinforcement.ts" />

class Reinforcement_HTML extends Display {
    private rf: Reinforcement;
    private ext_wood_inp: HTMLInputElement[];
    private ext_steel_inp: HTMLInputElement[];
    private wires: HTMLInputElement;
    private cabane: HTMLSelectElement;
    private cant_inp: HTMLInputElement[];
    private wing_blades: HTMLInputElement;

    //Display Stat Elements
    private d_drag: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_strc: HTMLTableCellElement;
    private d_maxs: HTMLTableCellElement;
    private d_amax: HTMLTableCellElement;


    constructor(rf: Reinforcement) {
        super();
        this.rf = rf;
        this.ext_wood_inp = [];
        this.ext_steel_inp = [];
        this.cant_inp = [];

        var tbl = document.getElementById("tbl_reinforcements") as HTMLTableElement;
        var row = tbl.insertRow();
        this.InitExternal(row.insertCell());
        this.InitInternal(row.insertCell());
        this.InitStatDisplay(row.insertCell());
    }

    private InitExternal(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);
        var fsr = CreateFlexSection(fs.div2);
        var fs_wood = CreateFlexSection(fsr.div1);
        var fs_steel = CreateFlexSection(fsr.div2);
        var lst = this.rf.GetExternalList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let w_inp = document.createElement("INPUT") as HTMLInputElement;
            let s_inp = document.createElement("INPUT") as HTMLInputElement;
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
        this.cabane = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect("Cabane", this.cabane, fs)
        for (let o of this.rf.GetCabaneList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = o.name;
            this.cabane.add(opt);
        }
        this.cabane.onchange = () => { this.rf.SetCabane(this.cabane.selectedIndex); };
        this.cabane.selectedIndex = 0;

        this.wires = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Wires", this.wires, fs);
        this.wires.onchange = () => { this.rf.SetWires(this.wires.checked); };
    }

    private InitInternal(cell: HTMLTableCellElement) {
        var fs = CreateFlexSection(cell);
        var lst = this.rf.GetCantileverList();
        for (let i = 0; i < lst.length; i++) {
            let elem = lst[i];
            let inp = document.createElement("INPUT") as HTMLInputElement;
            FlexInput(elem.name, inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.rf.SetCantileverCount(i, inp.valueAsNumber); };
            this.cant_inp.push(inp);
        }
        this.wing_blades = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Wing Blades", this.wing_blades, fs);
        this.wing_blades.onchange = () => { this.rf.SetWingBlade(this.wing_blades.checked); };
    }

    private InitStatDisplay(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
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
        CreateTH(h2_row, "Raw Strain");
        CreateTH(h2_row, "Aircraft Max Strain");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_maxs = c2_row.insertCell();
        this.d_amax = c2_row.insertCell();
    }

    public UpdateDisplay() {

        this.cabane.selectedIndex = this.rf.GetCabane();
        this.wires.checked = this.rf.GetWires();

        var w_count = this.rf.GetExternalWoodCount();
        var w_can = this.rf.CanExternalWood();
        for (let i = 0; i < w_count.length; i++) {
            this.ext_wood_inp[i].valueAsNumber = w_count[i];
            this.ext_wood_inp[i].disabled = !w_can[i];
        }

        var s_count = this.rf.GetExternalSteelCount();
        var s_can = this.rf.CanExternalWood();
        for (let i = 0; i < s_count.length; i++) {
            this.ext_steel_inp[i].valueAsNumber = s_count[i];
            this.ext_steel_inp[i].disabled = !s_can[i];
        }

        var c_count = this.rf.GetCantileverCount();
        for (let i = 0; i < c_count.length; i++) {
            this.cant_inp[i].valueAsNumber = c_count[i];
        }

        this.wing_blades.disabled = !this.rf.CanWingBlade();
        this.wing_blades.checked = this.rf.GetWingBlade();

        var stats = this.rf.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString(), true);
        var derivedMS = aircraft_model.GetDerivedStats().MaxStrain;
        BlinkIfChanged(this.d_amax, derivedMS.toString(), true);
    }
}