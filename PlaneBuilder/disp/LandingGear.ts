/// <reference path="./Display.ts" />
/// <reference path="../impl/LandingGear.ts" />

class LandingGear_HTML extends Display {
    private gear: LandingGear;
    private sel: HTMLSelectElement;
    private retract: HTMLInputElement;
    private extras: HTMLInputElement[];

    //Display Stat Elements
    private d_drag: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_strc: HTMLTableCellElement;
    private d_crsh: HTMLTableCellElement;

    constructor(gear: LandingGear) {
        super();
        this.gear = gear;

        var tbl = document.getElementById("tbl_gear") as HTMLTableElement;
        var row = tbl.insertRow();
        this.InitGear(row.insertCell());
        this.InitExtras(row.insertCell());
        this.InitStats(row.insertCell());
    }

    private InitGear(cell: HTMLTableCellElement) {
        var lst = this.gear.GetGearList();
        var fs = CreateFlexSection(cell);
        this.sel = document.createElement("SELECT") as HTMLSelectElement;
        FlexSelect("Type", this.sel, fs);
        for (let i = 0; i < lst.length; i++) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lst[i].name;
            this.sel.add(opt);
        }
        this.sel.onchange = () => { this.gear.SetGear(this.sel.selectedIndex); };

        this.retract = document.createElement("INPUT") as HTMLInputElement;
        FlexCheckbox("Retractable", this.retract, fs);
        this.retract.onchange = () => { this.gear.SetRetract(this.retract.checked); };
    }

    private InitExtras(cell: HTMLTableCellElement) {
        this.extras = [];
        var lst = this.gear.GetExtraList();
        var fs = CreateFlexSection(cell);
        for (let i = 0; i < lst.length; i++) {
            let cbx = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(lst[i].name, cbx, fs);
            cbx.onchange = () => { this.gear.SetExtraSelected(i, cbx.checked); };
            this.extras.push(cbx);
        }
    }

    private InitStats(stat_cell: HTMLTableCellElement) {
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
        CreateTH(h2_row, "Crash Safety");
        CreateTH(h2_row, "");
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_crsh = c2_row.insertCell();
        c2_row.insertCell();
    }

    public UpdateDisplay() {
        this.sel.selectedIndex = this.gear.GetGear();
        var gcan = this.gear.CanGear();
        for (let i = 0; i < gcan.length; i++)
            this.sel.options[i].disabled = !gcan[i];

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