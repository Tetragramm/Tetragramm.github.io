/// <reference path="./Display.ts" />
/// <reference path="../impl/AlterStats.ts" />

class AlterStats_HTML extends Display {
    private alter: AlterStats;
    private add_cell: HTMLTableCellElement;
    private add_fs: FlexSection;
    private edit_cell: HTMLTableCellElement;
    //Add Cell
    private add_list: { lbl: HTMLLabelElement, qty: HTMLInputElement }[];

    //Edit Cell
    private name: HTMLInputElement;
    private drag: HTMLInputElement;
    private mass: HTMLInputElement;
    private wmas: HTMLInputElement;
    private bmas: HTMLInputElement;
    private cost: HTMLInputElement;
    private upkp: HTMLInputElement;
    private lfbd: HTMLInputElement;

    private area: HTMLInputElement;
    private ctrl: HTMLInputElement;
    private pstb: HTMLInputElement;
    private lstb: HTMLInputElement;
    private rstn: HTMLInputElement;
    private strc: HTMLInputElement;
    private tugh: HTMLInputElement;

    private powr: HTMLInputElement;
    private fcon: HTMLInputElement;
    private fuel: HTMLInputElement;
    private chrg: HTMLInputElement;
    private sfty: HTMLInputElement;
    private visi: HTMLInputElement;
    private escp: HTMLInputElement;
    private rely: HTMLInputElement;

    private sprl: HTMLInputElement;

    private sel: HTMLSelectElement;
    private add: HTMLButtonElement;
    private rem: HTMLButtonElement;


    constructor(alter: AlterStats) {
        super();
        this.alter = alter;

        let tbl = window.getElementById("alter_table") as HTMLTableElement;
        let row = tbl.insertRow();
        this.add_cell = row.insertCell();
        this.edit_cell = row.insertCell();
        this.InitAddCell();
        this.InitEditCell();
    }

    private InitAddCell() {
        this.add_list = [];
        this.add_fs = CreateFlexSection(this.add_cell);

        let lbl_part = document.createElement("LABEL") as HTMLLabelElement;
        lbl_part.textContent = lu("Alter Select Part");
        this.add_fs.div1.appendChild(lbl_part);

        let lbl_qty = document.createElement("LABEL") as HTMLLabelElement;
        lbl_qty.textContent = lu("Alter Quantity");
        this.add_fs.div2.appendChild(lbl_qty);

        lbl_part.style.marginLeft = "0.25em";
        lbl_part.style.marginRight = "0.5em";

        lbl_qty.style.marginLeft = "0.25em";
        lbl_qty.style.marginRight = "0.5em";
    }

    private InitEditCell() {
        this.name = document.createElement("INPUT") as HTMLInputElement;
        this.drag = document.createElement("INPUT") as HTMLInputElement;
        this.mass = document.createElement("INPUT") as HTMLInputElement;
        this.wmas = document.createElement("INPUT") as HTMLInputElement;
        this.bmas = document.createElement("INPUT") as HTMLInputElement;
        this.cost = document.createElement("INPUT") as HTMLInputElement;
        this.upkp = document.createElement("INPUT") as HTMLInputElement;
        this.lfbd = document.createElement("INPUT") as HTMLInputElement;
        this.area = document.createElement("INPUT") as HTMLInputElement;
        this.ctrl = document.createElement("INPUT") as HTMLInputElement;
        this.pstb = document.createElement("INPUT") as HTMLInputElement;
        this.lstb = document.createElement("INPUT") as HTMLInputElement;
        this.rstn = document.createElement("INPUT") as HTMLInputElement;
        this.strc = document.createElement("INPUT") as HTMLInputElement;
        this.tugh = document.createElement("INPUT") as HTMLInputElement;
        this.powr = document.createElement("INPUT") as HTMLInputElement;
        this.fcon = document.createElement("INPUT") as HTMLInputElement;
        this.fuel = document.createElement("INPUT") as HTMLInputElement;
        this.chrg = document.createElement("INPUT") as HTMLInputElement;
        this.sfty = document.createElement("INPUT") as HTMLInputElement;
        this.visi = document.createElement("INPUT") as HTMLInputElement;
        this.escp = document.createElement("INPUT") as HTMLInputElement;
        this.rely = document.createElement("INPUT") as HTMLInputElement;
        this.sprl = document.createElement("INPUT") as HTMLInputElement;

        var fsabc = CreateFlexSection(this.edit_cell);
        var fsab = CreateFlexSection(fsabc.div1);
        FlexText(lu("Alter Part Name"), this.name, fsab);

        var fs1 = CreateFlexSection(fsab.div1);
        var fs2 = CreateFlexSection(fsab.div2);
        var fs3 = CreateFlexSection(fsabc.div2);

        FlexInput("Cost", this.cost, fs3);

        FlexInput("Mass", this.mass, fs1);
        FlexInput("Wet Mass", this.wmas, fs2);
        FlexInput("Bomb Mass", this.bmas, fs3);

        FlexInput("Drag", this.drag, fs1);
        FlexInput("Lift Bleed", this.lfbd, fs2);
        FlexInput("Wing Area", this.area, fs3);

        FlexInput("Control", this.ctrl, fs1);
        FlexInput("Pitch Stability", this.pstb, fs2);
        FlexInput("Lateral Stability", this.lstb, fs3);

        FlexInput("Raw Strain", this.rstn, fs1);
        FlexInput("Structure", this.strc, fs2);
        FlexInput("Toughness", this.tugh, fs3);

        FlexInput("Power", this.powr, fs1);
        FlexInput("Fuel Consumption", this.fcon, fs2);
        FlexInput("Fuel", this.fuel, fs3);

        FlexInput("Visibility", this.visi, fs1);
        FlexInput("Crash Safety", this.sfty, fs2);
        FlexInput("Escape", this.escp, fs3);

        FlexInput("Charge", this.chrg, fs1);
        FlexInput("Upkeep", this.upkp, fs2);
        FlexInput("Reliability", this.rely, fs3);

        CreateText(lu("Alter Part Special Rules"), this.sprl, this.edit_cell, false);
        this.drag.min = "";
        this.mass.min = "";
        this.wmas.min = "";
        this.bmas.min = "";
        this.cost.min = "";
        this.upkp.min = "";
        this.lfbd.min = "";
        this.area.min = "";
        this.ctrl.min = "";
        this.pstb.min = "";
        this.lstb.min = "";
        this.rstn.min = "";
        this.strc.min = "";
        this.tugh.min = "";
        this.powr.min = "";
        this.fcon.min = "";
        this.fuel.min = "";
        this.chrg.min = "";
        this.sfty.min = "";
        this.visi.min = "";
        this.escp.min = "";
        this.rely.min = "";
        this.sprl.size = 47;

        var span = document.createElement("SPAN") as HTMLSpanElement;
        this.sel = document.createElement("SELECT") as HTMLSelectElement;
        span.appendChild(this.sel);
        this.sel.selectedIndex = -1;
        this.add = document.createElement("BUTTON") as HTMLButtonElement;
        CreateButton("Add Part", this.add, span, false);
        this.rem = document.createElement("BUTTON") as HTMLButtonElement;
        CreateButton("Remove Part", this.rem, span, false);

        this.edit_cell.appendChild(document.createElement("BR"));
        this.edit_cell.appendChild(span);

        this.add.onclick = () => {
            let stats = new Stats();
            stats.drag = this.drag.valueAsNumber;
            stats.mass = this.mass.valueAsNumber;
            stats.wetmass = this.wmas.valueAsNumber;
            stats.bomb_mass = this.bmas.valueAsNumber;
            stats.cost = this.cost.valueAsNumber;
            stats.upkeep = this.upkp.valueAsNumber;
            stats.liftbleed = this.lfbd.valueAsNumber;
            stats.wingarea = this.area.valueAsNumber;
            stats.control = this.ctrl.valueAsNumber;
            stats.pitchstab = this.pstb.valueAsNumber;
            stats.latstab = this.lstb.valueAsNumber;
            stats.maxstrain = this.rstn.valueAsNumber;
            stats.structure = this.strc.valueAsNumber;
            stats.toughness = this.tugh.valueAsNumber;
            stats.power = this.powr.valueAsNumber;
            stats.fuelconsumption = this.fcon.valueAsNumber;
            stats.fuel = this.fuel.valueAsNumber;
            stats.charge = this.chrg.valueAsNumber;
            stats.crashsafety = this.sfty.valueAsNumber;
            stats.visibility = this.visi.valueAsNumber;
            stats.escape = this.escp.valueAsNumber;
            stats.reliability = this.rely.valueAsNumber;
            this.sprl.value = this.sprl.value.trim();
            if (this.sprl.value.length > 0) {
                stats.warnings.push({ source: this.name.value, warning: this.sprl.value });
            }
            this.alter.AddPart(this.name.value, stats);
            this.UpdateSelect();
            this.sel.selectedIndex = -1;
        };
        this.rem.onclick = () => {
            this.alter.RemovePart(this.name.value);
            this.ResetInputs();
            this.UpdateSelect();
            this.sel.selectedIndex = -1;
        };

        this.sel.onchange = () => {
            let part = this.alter.GetParts()[this.sel.selectedIndex];
            this.name.value = part.name;
            this.drag.valueAsNumber = part.stats.drag;
            this.mass.valueAsNumber = part.stats.mass;
            this.wmas.valueAsNumber = part.stats.wetmass;
            this.bmas.valueAsNumber = part.stats.bomb_mass;
            this.cost.valueAsNumber = part.stats.cost;
            this.upkp.valueAsNumber = part.stats.upkeep;
            this.lfbd.valueAsNumber = part.stats.liftbleed;
            this.area.valueAsNumber = part.stats.wingarea;
            this.ctrl.valueAsNumber = part.stats.control;
            this.pstb.valueAsNumber = part.stats.pitchstab;
            this.lstb.valueAsNumber = part.stats.latstab;
            this.rstn.valueAsNumber = part.stats.maxstrain;
            this.strc.valueAsNumber = part.stats.structure;
            this.tugh.valueAsNumber = part.stats.toughness;
            this.powr.valueAsNumber = part.stats.power;
            this.fcon.valueAsNumber = part.stats.fuelconsumption;
            this.fuel.valueAsNumber = part.stats.fuel;
            this.chrg.valueAsNumber = part.stats.charge;
            this.sfty.valueAsNumber = part.stats.crashsafety;
            this.visi.valueAsNumber = part.stats.visibility;
            this.escp.valueAsNumber = part.stats.escape;
            this.rely.valueAsNumber = part.stats.reliability;
            var text = [];
            for (let warn of part.stats.warnings) {
                text.push(warn.warning);
            }
            this.sprl.value = StringFmt.Join("   ", text);
            this.sel.selectedIndex = -1;
        }
        this.ResetInputs();
        this.UpdateSelect();
    }

    private ResetInputs() {
        this.name.value = "Default";
        this.drag.valueAsNumber = 0;
        this.mass.valueAsNumber = 0;
        this.wmas.valueAsNumber = 0;
        this.bmas.valueAsNumber = 0;
        this.cost.valueAsNumber = 0;
        this.upkp.valueAsNumber = 0;
        this.lfbd.valueAsNumber = 0;
        this.area.valueAsNumber = 0;
        this.ctrl.valueAsNumber = 0;
        this.pstb.valueAsNumber = 0;
        this.lstb.valueAsNumber = 0;
        this.rstn.valueAsNumber = 0;
        this.strc.valueAsNumber = 0;
        this.tugh.valueAsNumber = 0;
        this.powr.valueAsNumber = 0;
        this.fcon.valueAsNumber = 0;
        this.fuel.valueAsNumber = 0;
        this.chrg.valueAsNumber = 0;
        this.sfty.valueAsNumber = 0;
        this.visi.valueAsNumber = 0;
        this.escp.valueAsNumber = 0;
        this.rely.valueAsNumber = 0;
        this.sprl.value = "";
    }

    private UpdateSelect() {
        while (this.sel.options.length) {
            this.sel.remove(this.sel.options.length - 1);
        }
        var all_parts = this.alter.GetParts();
        for (let p of all_parts) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = p.name;
            this.sel.add(opt);
        }
    }

    public UpdateDisplay() {
        this.UpdateSelect();
        var plist = this.alter.GetParts();
        for (let i = 0; i < plist.length; i++) {
            if (this.add_list.length <= i) {
                let item = {
                    lbl: document.createElement("LABEL") as HTMLLabelElement,
                    qty: document.createElement("INPUT") as HTMLInputElement
                };
                item.lbl.style.marginLeft = "0.25em";
                item.lbl.style.marginRight = "0.5em";
                item.qty.type = "number";
                item.qty.min = "0";
                item.qty.step = "1";
                item.qty.valueAsNumber = 0;
                item.qty.onchange = () => { this.alter.SetUsedPart(i, item.qty.valueAsNumber); };
                this.add_fs.div1.appendChild(item.lbl);
                this.add_fs.div2.appendChild(item.qty);
                this.add_list.push(item);
            }
            this.add_list[i].lbl.textContent = plist[i].name;
            this.add_list[i].qty.valueAsNumber = plist[i].qty;
        }
        while (this.add_list.length > plist.length) {
            this.add_list[this.add_list.length - 1].lbl.remove();
            this.add_list[this.add_list.length - 1].qty.remove();
            this.add_list.pop();
        }
    }
}