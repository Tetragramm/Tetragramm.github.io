/// <reference path="./Display.ts" />
/// <reference path="../impl/Optimization.ts" />

class Optimization_HTML extends Display {
    private opt: Optimization;
    private free_inp: HTMLInputElement;
    private cost_cbx: HTMLInputElement[];
    private bleed_cbx: HTMLInputElement[];
    private escape_cbx: HTMLInputElement[];
    private mass_cbx: HTMLInputElement[];
    private toughness_cbx: HTMLInputElement[];
    private maxstrain_cbx: HTMLInputElement[];
    private reliability_cbx: HTMLInputElement[];
    private drag_cbx: HTMLInputElement[];

    //Display Stat Elements
    private d_cost: HTMLTableCellElement;
    private d_lift: HTMLTableCellElement;
    private d_escp: HTMLTableCellElement;
    private d_visi: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_tugh: HTMLTableCellElement;
    private d_mstr: HTMLTableCellElement;
    private d_reli: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;

    constructor(opt: Optimization) {
        super();
        this.opt = opt;

        this.free_inp = document.getElementById("num_opt") as HTMLInputElement;
        this.free_inp.onchange = () => { this.opt.SetFreeDots(this.free_inp.valueAsNumber); };
        var tbl = document.getElementById("tbl_optimization") as HTMLTableElement;
        var row1 = tbl.insertRow();
        this.cost_cbx = this.InitRow(row1, "Expense: +/- 10% Cost", (num: number) => this.opt.SetCost(num));
        this.bleed_cbx = this.InitRow(tbl.insertRow(), "Lift Efficienty: +/- 3 Lift Bleed", (num: number) => this.opt.SetBleed(num));
        this.escape_cbx = this.InitRow(tbl.insertRow(), "Leg Room: +/- 1 Escape, Visibility", (num: number) => this.opt.SetEscape(num));
        this.mass_cbx = this.InitRow(tbl.insertRow(), "Mass: +/- 10% Mass", (num: number) => this.opt.SetMass(num));
        this.toughness_cbx = this.InitRow(tbl.insertRow(), "Redundancy: +/- 25% Toughness ", (num: number) => this.opt.SetToughness(num));
        this.maxstrain_cbx = this.InitRow(tbl.insertRow(), "Support: +/- 15% Max Strain", (num: number) => this.opt.SetMaxStrain(num));
        this.reliability_cbx = this.InitRow(tbl.insertRow(), "Reliability: +/- 2 Reliability", (num: number) => this.opt.SetReliability(num));
        this.drag_cbx = this.InitRow(tbl.insertRow(), "Streamlining: +/- 10% Drag", (num: number) => this.opt.SetDrag(num));
        this.InitStatDisplay(row1.insertCell());
    }

    private InitRow(row: HTMLTableRowElement, txt: string, call: (num: number) => void) {
        var cbxs = [];
        for (let i = 0; i < 6; i++) {
            cbxs.push(document.createElement("INPUT") as HTMLInputElement);
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
        ecell.textContent = txt;
        pcell.appendChild(cbxs[3]);
        pcell.appendChild(cbxs[4]);
        pcell.appendChild(cbxs[5]);
        return cbxs;
    }

    private InitStatDisplay(stat_cell: HTMLTableCellElement) {
        stat_cell.rowSpan = 0;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
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

    private UpdateChecked(num: number, lst: HTMLInputElement[]) {
        for (let i = 0; i < lst.length; i++)
            lst[i].checked = false;
        if (num < 0) {
            lst[2].checked = true;
            if (num < -1) {
                lst[1].checked = true;
                if (num < -2)
                    lst[0].checked = true;
            }
        } else if (num > 0) {
            lst[3].checked = true;
            if (num > 1) {
                lst[4].checked = true;
                if (num > 2)
                    lst[5].checked = true;
            }
        }
    }

    private UpdateEnabled(num: number, lst: HTMLInputElement[]) {
        var free = 0;
        for (let i = 3; i < lst.length; i++) {
            if (!lst[i].checked)
                free++;
            lst[i].disabled = free > num;
        }
    }

    public UpdateDisplay() {
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
        BlinkIfChanged(this.d_mstr, this.opt.final_ms.toString());
        BlinkIfChanged(this.d_reli, stats.reliability.toString());
        BlinkIfChanged(this.d_drag, stats.drag.toString());
    }
}