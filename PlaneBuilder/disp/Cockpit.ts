/// <reference path="./Display.ts" />
/// <reference path="../impl/Cockpit.ts" />

class Cockpit_HTML extends Display {
    private row: HTMLTableRowElement;
    private cockpit: Cockpit;
    private sel_type: HTMLSelectElement;
    //Upgrade list
    private upg_chbxs: HTMLInputElement[];
    //Safety list
    private sft_chbxs: HTMLInputElement[];
    //Gunsight list
    private gun_chbxs: HTMLInputElement[];
    private bombsight: HTMLInputElement;
    //Display Stat Elements
    private d_mass: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_cont: HTMLTableCellElement;
    private d_rseq: HTMLTableCellElement;
    private d_crsh: HTMLTableCellElement;
    private d_strs: HTMLTableCellElement;
    private d_escp: HTMLTableCellElement;
    private d_visi: HTMLTableCellElement;

    constructor(r: HTMLTableRowElement, cp: Cockpit) {
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
        var tbl = document.createElement("TABLE") as HTMLTableElement;
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

        this.sel_type = document.createElement("SELECT") as HTMLSelectElement;

        // Visibility and Stress and Escape are cockpit local
        // Mark in table for CSS
        this.d_strs.className = "part_local";
        this.d_visi.className = "part_local";
        this.d_escp.className = "part_local";
        this.d_crsh.className = "part_local";

        //Add all the cockpit types to the select box
        for (let elem of cp.GetTypeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = elem.name;
            this.sel_type.add(opt);
        }
        option.appendChild(this.sel_type);

        var fs = CreateFlexSection(upgrades);
        //Add all the upgrades as checkboxes
        var upglst = cp.GetUpgradeList();
        var can = cp.CanUpgrades();
        for (let i = 0; i < upglst.length; i++) {
            let upg = document.createElement("INPUT") as HTMLInputElement;
            if (can[i]) {
                let elem = upglst[i];
                FlexCheckbox(elem.name, upg, fs);
                upg.onchange = () => { this.cockpit.SetUpgrade(i, upg.checked); };
            }
            this.upg_chbxs.push(upg);
        }

        var fs = CreateFlexSection(safety);
        //Add all the safties as checkboxes
        var sft_index = 0;
        for (let elem of cp.GetSafetyList()) {
            let sft = document.createElement("INPUT") as HTMLInputElement;
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
            let gun = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(elem.name, gun, fs);
            let local_index = gun_index;
            gun_index += 1;
            gun.onchange = () => { this.cockpit.SetGunsight(local_index, gun.checked); };
            this.gun_chbxs.push(gun);
        }
        this.bombsight = document.createElement("INPUT") as HTMLInputElement;
        FlexInput("Bombsight", this.bombsight, fs);
        this.bombsight.onchange = () => { this.cockpit.SetBombsightQuality(this.bombsight.valueAsNumber); };
        this.bombsight.min = "0";
        this.bombsight.max = "301";
        this.bombsight.step = "1";

        //Set the change event, add the box, and execute it.
        this.sel_type.onchange = () => { this.cockpit.SetType(this.sel_type.selectedIndex); };
    }

    public UpdateCockpit(cp: Cockpit) {
        this.cockpit = cp;
    }

    public UpdateDisplay() {
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
        this.bombsight.valueAsNumber = this.cockpit.GetBombsightQuality();
    }
}