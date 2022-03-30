import { lu } from "../impl/Localization.js";
import { insertRow, CreateFlexSection, CreateTH, BlinkIfChanged, FlexCheckbox, FlexInput, FlexSelect } from "./Tools.js";
import { Display } from "./Display.js";
export class Accessories_HTML extends Display {
    constructor(acc) {
        super();
        this.acc = acc;
        document.getElementById("lbl_accessories").textContent = lu("Accessories Section Title");
        var tbl = document.getElementById("tbl_accessories");
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        CreateTH(row, lu("Accessories Climate"));
        CreateTH(row, lu("Accessories Armour Coverage"));
        CreateTH(row, lu("Accessories Visibility"));
        CreateTH(row, lu("Accessories Additional Part Stats"));
        row = insertRow(fragment);
        this.InitClimate(row.insertCell());
        this.InitArmour(row.insertCell());
        this.InitVisibility(row.insertCell());
        this.InitStats(row.insertCell());
        row = insertRow(fragment);
        CreateTH(row, lu("Accessories Information"));
        CreateTH(row, lu("Accessories Electrical"));
        CreateTH(row, lu("Accessories Control"));
        row = insertRow(fragment);
        this.InitInformation(row.insertCell());
        this.InitElectrical(row.insertCell());
        this.InitControl(row.insertCell());
        tbl.appendChild(fragment);
    }
    InitArmour(cell) {
        var fs = CreateFlexSection(cell);
        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        this.a_AP = [];
        var len = this.acc.GetArmourCoverage().length;
        for (let i = 0; i < len; i++)
            this.a_AP.push(document.createElement("INPUT"));
        for (let i = 0; i < len / 2; i++) {
            let AP = i + 1;
            FlexInput("Thickness " + AP.toString(), this.a_AP[i], lfs);
            this.a_AP[i].onchange = () => { this.acc.SetArmourCoverage(i, this.a_AP[i].valueAsNumber); };
            let j = i + len / 2;
            AP = j + 1;
            FlexInput("Thickness " + AP.toString(), this.a_AP[j], rfs);
            this.a_AP[j].onchange = () => { this.acc.SetArmourCoverage(j, this.a_AP[j].valueAsNumber); };
        }
    }
    InitElectrical(cell) {
        var fs = CreateFlexSection(cell);
        this.radio = document.createElement("SELECT");
        FlexSelect(lu("Accessories Radio"), this.radio, fs);
        var rlist = this.acc.GetRadioList();
        for (let i = 0; i < rlist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(rlist[i].name);
            this.radio.add(opt);
        }
        this.radio.onchange = () => { this.acc.SetRadioSel(this.radio.selectedIndex); };
        this.elect = [];
        var elist = this.acc.GetElectricalList();
        for (let i = 0; i < elist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lu(elist[i].name), inp, fs);
            inp.onchange = () => { this.acc.SetElectricalCount(i, inp.valueAsNumber); };
            this.elect.push(inp);
        }
    }
    InitInformation(cell) {
        var fs = CreateFlexSection(cell);
        var rlist = this.acc.GetReconList();
        this.recon = [];
        for (let i = 0; i < rlist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexInput(lu(rlist[i].name), inp, fs);
            inp.min = "0";
            inp.onchange = () => { this.acc.SetReconSel(i, inp.valueAsNumber); };
            this.recon.push(inp);
        }
    }
    InitVisibility(cell) {
        var fs = CreateFlexSection(cell);
        var vlist = this.acc.GetVisibilityList();
        this.visi = [];
        for (let i = 0; i < vlist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(lu(vlist[i].name), inp, fs);
            inp.onchange = () => { this.acc.SetVisibilitySel(i, inp.checked); };
            this.visi.push(inp);
        }
    }
    InitClimate(cell) {
        var fs = CreateFlexSection(cell);
        var clist = this.acc.GetClimateList();
        this.clim = [];
        for (let i = 0; i < clist.length; i++) {
            let inp = document.createElement("INPUT");
            FlexCheckbox(lu(clist[i].name), inp, fs);
            inp.onchange = () => { this.acc.SetClimateSel(i, inp.checked); };
            this.clim.push(inp);
        }
    }
    InitControl(cell) {
        var fs = CreateFlexSection(cell);
        this.auto = document.createElement("SELECT");
        var alist = this.acc.GetAutopilotList();
        FlexSelect(lu("Accessories Autopilot"), this.auto, fs);
        for (let i = 0; i < alist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(alist[i].name);
            this.auto.add(opt);
        }
        this.auto.onchange = () => { this.acc.SetAutopilotSel(this.auto.selectedIndex); };
        var clist = this.acc.GetControlList();
        this.cont = document.createElement("SELECT");
        FlexSelect(lu("Accessories Control Aids"), this.cont, fs);
        for (let i = 0; i < clist.length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = lu(clist[i].name);
            this.cont.add(opt);
        }
        this.cont.onchange = () => { this.acc.SetControlSel(this.cont.selectedIndex); };
    }
    InitStats(stat_cell) {
        stat_cell.rowSpan = 3;
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE");
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl_stat.insertRow();
        this.d_drag = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Charge"));
        CreateTH(h2_row, lu("Stat Lift Bleed"));
        var c2_row = tbl_stat.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_chgh = c2_row.insertCell();
        this.d_lift = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Visibility"));
        CreateTH(h3_row, lu("Stat Flight Stress"));
        CreateTH(h3_row, lu("Stat Required Sections"));
        var c3_row = tbl_stat.insertRow();
        this.d_visi = c3_row.insertCell();
        this.d_strs = c3_row.insertCell();
        this.d_rsec = c3_row.insertCell();
    }
    UpdateDisplay() {
        var AP = this.acc.GetArmourCoverage();
        for (let i = 0; i < AP.length; i++) {
            this.a_AP[i].valueAsNumber = AP[i];
        }
        this.radio.selectedIndex = this.acc.GetRadioSel();
        var elist = this.acc.GetElectricalCount();
        for (let i = 0; i < elist.length; i++) {
            this.elect[i].valueAsNumber = elist[i];
        }
        var rlist = this.acc.GetReconSel();
        for (let i = 0; i < rlist.length; i++) {
            this.recon[i].valueAsNumber = rlist[i];
        }
        var vlist = this.acc.GetVisibilitySel();
        var cvlist = this.acc.GetCanVisibility();
        for (let i = 0; i < vlist.length; i++) {
            this.visi[i].checked = vlist[i];
            this.visi[i].disabled = !cvlist[i];
        }
        var clist = this.acc.GetClimateSel();
        var cenab = this.acc.GetClimateEnable();
        for (let i = 0; i < vlist.length; i++) {
            this.clim[i].checked = clist[i];
            this.clim[i].disabled = !cenab[i];
        }
        this.auto.selectedIndex = this.acc.GetAutopilotSel();
        this.cont.selectedIndex = this.acc.GetControlSel();
        var stats = this.acc.PartStats();
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_chgh, stats.charge.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_strs, stats.flightstress.toString(), false);
        BlinkIfChanged(this.d_rsec, stats.reqsections.toString(), false);
    }
}
