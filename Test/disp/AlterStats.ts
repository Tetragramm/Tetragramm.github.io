/// <reference path="./Display.ts" />
/// <reference path="../impl/AlterStats.ts" />

class AlterStats_HTML extends Display {
    private alter: AlterStats;
    private add_cell: HTMLTableCellElement;
    private edit_cell: HTMLTableCellElement;
    //Add Cell
    private add_list: { sel: HTMLSelectElement, qty: HTMLInputElement }[];
    //Edit Cell
    private name_inp: HTMLInputElement;
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
        let fs = CreateFlexSection(this.add_cell);

        let lbl_part = document.createElement("LABEL") as HTMLLabelElement;
        lbl_part.textContent = lu("Alter Select Part");
        fs.div1.appendChild(lbl_part);

        let lbl_qty = document.createElement("LABEL") as HTMLLabelElement;
        lbl_qty.textContent = lu("Alter Quantity");
        fs.div2.appendChild(lbl_qty);
    }

    private InitEditCell() {
        this.name_inp = document.createElement("INPUT") as HTMLInputElement;;
        this.drag = document.createElement("INPUT") as HTMLInputElement;;
        this.mass = document.createElement("INPUT") as HTMLInputElement;;
        this.wmas = document.createElement("INPUT") as HTMLInputElement;;
        this.bmas = document.createElement("INPUT") as HTMLInputElement;;
        this.cost = document.createElement("INPUT") as HTMLInputElement;;
        this.upkp = document.createElement("INPUT") as HTMLInputElement;;
        this.lfbd = document.createElement("INPUT") as HTMLInputElement;;
        this.area = document.createElement("INPUT") as HTMLInputElement;;
        this.ctrl = document.createElement("INPUT") as HTMLInputElement;;
        this.pstb = document.createElement("INPUT") as HTMLInputElement;;
        this.lstb = document.createElement("INPUT") as HTMLInputElement;;
        this.rstn = document.createElement("INPUT") as HTMLInputElement;;
        this.strc = document.createElement("INPUT") as HTMLInputElement;;
        this.tugh = document.createElement("INPUT") as HTMLInputElement;;
        this.powr = document.createElement("INPUT") as HTMLInputElement;;
        this.fcon = document.createElement("INPUT") as HTMLInputElement;;
        this.fuel = document.createElement("INPUT") as HTMLInputElement;;
        this.chrg = document.createElement("INPUT") as HTMLInputElement;;
        this.sfty = document.createElement("INPUT") as HTMLInputElement;;
        this.visi = document.createElement("INPUT") as HTMLInputElement;;
        this.escp = document.createElement("INPUT") as HTMLInputElement;;
        this.sprl = document.createElement("INPUT") as HTMLInputElement;;

        CreateText(lu("Alter Part Name"), this.name_inp, this.edit_cell);

        var fsabc7 = CreateFlexSection(this.edit_cell);
        var fsabc = CreateFlexSection(fsabc7.div1);
        var fsab = CreateFlexSection(fsabc.div1);
        var fs12 = CreateFlexSection(fsab.div1);
        var fs34 = CreateFlexSection(fsab.div2);
        var fs56 = CreateFlexSection(fsabc.div2);
        var fs1 = CreateFlexSection(fs12.div1);
        var fs2 = CreateFlexSection(fs12.div2);
        var fs3 = CreateFlexSection(fs34.div1);
        var fs4 = CreateFlexSection(fs34.div2);
        var fs5 = CreateFlexSection(fs56.div1);
        var fs6 = CreateFlexSection(fs56.div2);
        var fs7 = CreateFlexSection(fsabc7.div2);

        FlexInput("Drag", this.drag, fs1);
        FlexInput("Mass", this.mass, fs2);
        FlexInput("Wet Mass", this.wmas, fs3);
        FlexInput("Bomb Mass", this.bmas, fs4);
        FlexInput("Cost", this.cost, fs5);
        FlexInput("Upkeep", this.upkp, fs6);
        FlexInput("Lift Bleed", this.lfbd, fs7);

        FlexInput("Wing Area", this.area, fs1);
        FlexInput("Control", this.ctrl, fs2);
        FlexInput("Pitch Stability", this.pstb, fs3);
        FlexInput("Lateral Stability", this.lstb, fs4);
        FlexInput("Raw Strain", this.rstn, fs5);
        FlexInput("Structure", this.strc, fs6);
        FlexInput("Toughness", this.tugh, fs7);

        FlexInput("Power", this.powr, fs1);
        FlexInput("Fuel Consumption", this.fcon, fs2);
        FlexInput("Fuel", this.fuel, fs3);
        FlexInput("Charge", this.chrg, fs4);
        FlexInput("Crash Safety", this.sfty, fs5);
        FlexInput("Visibility", this.visi, fs6);
        FlexInput("Escape", this.escp, fs7);

        CreateText(lu("Alter Part Special Rules"), this.sprl, this.edit_cell, false);

        var span = document.createElement("SPAN") as HTMLSpanElement;
        this.sel = document.createElement("SELECT") as HTMLSelectElement;
        span.appendChild(this.sel);
        this.add = document.createElement("BTN") as HTMLButtonElement;
        CreateButton("Add Part", this.add, span, false);
        this.rem = document.createElement("BTN") as HTMLButtonElement;
        CreateButton("Remove Part", this.rem, span, false);

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
            stats.warnings.push({ source: this.name_inp.value, warning: this.sprl.value });
            this.alter.AddPart(this.name_inp.value, stats);
        };
        this.rem.onclick = () => { this.alter.RemovePart(this.name_inp.value); };
    }

    public UpdateDisplay() {

    }
}