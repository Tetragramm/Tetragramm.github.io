import { Cockpit } from "../impl/Cockpit";
import { lu } from "../impl/Localization";
import { insertCell, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexInput } from "./Tools";
import { StringFmt } from "../string/index";
import { Display } from "./Display";

export class Cockpit_HTML extends Display {
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

        const fragment = document.createDocumentFragment();
        const option = insertCell(fragment);
        const upgrades = insertCell(fragment);
        const safety = insertCell(fragment);
        const gunsights = insertCell(fragment);
        const stat_cell = insertCell(fragment);
        const tbl = document.createElement("TABLE") as HTMLTableElement;
        const h1_row = tbl.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        const c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        const h2_row = tbl.insertRow();
        CreateTH(h2_row, lu("Stat Control"));
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, "");
        const c2_row = tbl.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_rseq = c2_row.insertCell();
        c2_row.insertCell();
        const h3_row = tbl.insertRow();
        CreateTH(h3_row, lu("Stat Flight Stress"));
        CreateTH(h3_row, lu("Stat Escape"));
        CreateTH(h3_row, lu("Stat Visibility"));
        const c3_row = tbl.insertRow();
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

        //Add all the cockpit types to the select box
        for (let elem of cp.GetTypeList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.sel_type.add(opt);
        }
        option.appendChild(this.sel_type);

        var fs = CreateFlexSection(upgrades);
        //Add all the upgrades as checkboxes
        const upglst = cp.GetUpgradeList();
        const can = cp.CanUpgrades();
        for (let i = 0; i < upglst.length; i++) {
            let upg = document.createElement("INPUT") as HTMLInputElement;
            if (can[i]) {
                FlexCheckbox(lu(upglst[i].name), upg, fs);
                upg.onchange = () => { this.cockpit.SetUpgrade(i, upg.checked); };
            }
            this.upg_chbxs.push(upg);
        }

        fs = CreateFlexSection(safety);
        //Add all the safties as checkboxes
        var sft_index = 0;
        for (let elem of cp.GetSafetyList()) {
            let sft = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(lu(elem.name), sft, fs);
            let local_index = sft_index;
            sft_index += 1;
            sft.onchange = () => { this.cockpit.SetSafety(local_index, sft.checked); };
            this.sft_chbxs.push(sft);
        }

        fs = CreateFlexSection(gunsights);
        //Add all the safties as checkboxes
        var gun_index = 0;
        for (let elem of cp.GetGunsightList()) {
            let gun = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(lu(elem.name), gun, fs);
            let local_index = gun_index;
            gun_index += 1;
            gun.onchange = () => { this.cockpit.SetGunsight(local_index, gun.checked); };
            this.gun_chbxs.push(gun);
        }
        this.bombsight = document.createElement("INPUT") as HTMLInputElement;
        FlexInput(lu("Cockpit Bombsight"), this.bombsight, fs);
        this.bombsight.onchange = () => { this.cockpit.SetBombsightQuality(this.bombsight.valueAsNumber); };
        this.bombsight.min = "0";
        this.bombsight.max = "301";
        this.bombsight.step = "1";

        //Set the change event, add the box, and execute it.
        this.sel_type.onchange = () => { this.cockpit.SetType(this.sel_type.selectedIndex); };

        this.row.appendChild(fragment);
    }

    public UpdateCockpit(cp: Cockpit) {
        this.cockpit = cp;
    }

    public UpdateDisplay() {
        let stats = this.cockpit.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_rseq, stats.reqsections.toString(), false);
        const fs = this.cockpit.GetFlightStress();
        if (fs[0] != fs[1]) {
            BlinkIfChanged(this.d_strs, StringFmt.Format("{0}", fs[0]));
        } else {
            BlinkIfChanged(this.d_strs, StringFmt.Format("{0}", fs[0]));
        }
        BlinkIfChanged(this.d_escp, this.cockpit.GetEscape().toString(), true);
        BlinkIfChanged(this.d_visi, this.cockpit.GetVisibility().toString(), true);

        this.sel_type.selectedIndex = this.cockpit.GetType();

        const upgs = this.cockpit.GetSelectedUpgrades();
        for (let i = 0; i < this.upg_chbxs.length; i++) {
            this.upg_chbxs[i].checked = upgs[i];
        }

        const sfty = this.cockpit.GetSelectedSafety();
        let can = this.cockpit.CanSafety();
        for (let i = 0; i < this.sft_chbxs.length; i++) {
            this.sft_chbxs[i].checked = sfty[i];
            this.sft_chbxs[i].disabled = !can[i];
        }

        const guns = this.cockpit.GetSelectedGunsights();
        for (let i = 0; i < this.gun_chbxs.length; i++) {
            this.gun_chbxs[i].checked = guns[i];
        }
        this.bombsight.valueAsNumber = this.cockpit.GetBombsightQuality();
    }
}