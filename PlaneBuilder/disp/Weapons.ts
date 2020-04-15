/// <reference path="./Display.ts" />
/// <reference path="../impl/Weapons.ts" />

type WType = { span: HTMLSpanElement, wing: HTMLInputElement, covered: HTMLInputElement, accessible: HTMLInputElement, free_access: HTMLInputElement, synch: HTMLSelectElement, pair: HTMLInputElement };
type WStatType = { mass: HTMLTableCellElement, drag: HTMLTableCellElement, cost: HTMLTableCellElement, sect: HTMLTableCellElement, hits: HTMLTableCellElement, damg: HTMLTableCellElement };
type WSetType = { type: HTMLSelectElement, dirs: HTMLInputElement[], count: HTMLInputElement, fixed: HTMLInputElement, wcell: HTMLTableCellElement, weaps: WType[], stats: WStatType };
class Weapons_HTML extends Display {
    private weap: Weapons;

    private tbl: HTMLTableElement;
    private inp_w_count: HTMLInputElement;
    private wrow: WSetType[];

    constructor(weap: Weapons) {
        super();
        this.weap = weap;

        this.inp_w_count = document.getElementById("num_wsets") as HTMLInputElement;
        this.inp_w_count.oninput = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };

        this.tbl = document.getElementById("table_weapons") as HTMLTableElement;
        this.wrow = [];
    }

    private CreateWSetRow() {
        var row = this.tbl.insertRow(this.wrow.length + 1);
        var setcell = row.insertCell();
        var fs = CreateFlexSection(setcell);

        var type = {
            type: document.createElement("SELECT") as HTMLSelectElement,
            dirs: [],
            count: document.createElement("INPUT") as HTMLInputElement,
            fixed: document.createElement("INPUT") as HTMLInputElement,
            wcell: null,
            weaps: [],
            stats: { mass: null, drag: null, cost: null, sect: null, hits: null, damg: null },
        };

        var wlist = this.weap.GetWeaponList();
        for (let w of wlist) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = w.name + " (" + w.era + ")";
            type.type.add(opt);
        }
        type.type.required = true;

        FlexSelect("Type", type.type, fs);

        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        FlexInput("Number", type.count, lfs);
        FlexCheckbox("Fixed", type.fixed, rfs);

        var dirlist = this.weap.GetDirectionList();
        for (let i = 0; i < dirlist.length; i += 2) {
            var dl = dirlist[i];
            var cbx = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(dl, cbx, lfs);
            type.dirs.push(cbx);
            var dr = dirlist[i + 1];
            cbx = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(dr, cbx, rfs);
            type.dirs.push(cbx);
        }

        type.wcell = row.insertCell();
        var statcell = row.insertCell();
        var stable = document.createElement("TABLE") as HTMLTableElement;
        statcell.appendChild(stable);
        var h1_row = stable.insertRow();
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        CreateTH(h1_row, "Cost");
        var c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        type.stats.cost = c1_row.insertCell();
        var h2_row = stable.insertRow();
        CreateTH(h2_row, "Required Sections");
        CreateTH(h2_row, "Hits");
        CreateTH(h2_row, "Damage");
        var c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.hits = c2_row.insertCell();
        type.stats.damg = c2_row.insertCell();

        return type;
    }

    private CreateWRow(wcell: HTMLTableCellElement) {
        var w = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            wing: document.createElement("INPUT") as HTMLInputElement,
            covered: document.createElement("INPUT") as HTMLInputElement,
            accessible: document.createElement("INPUT") as HTMLInputElement,
            free_access: document.createElement("INPUT") as HTMLInputElement,
            synch: document.createElement("SELECT") as HTMLSelectElement,
            pair: document.createElement("INPUT") as HTMLInputElement,
        };
        CreateCheckbox("Wing Mount", w.wing, w.span, false);
        CreateCheckbox("Covered", w.covered, w.span, false);
        CreateCheckbox("Accessible", w.accessible, w.span, false);
        CreateCheckbox("Free Accessible", w.free_access, w.span, false);
        CreateCheckbox("Paired", w.pair, w.span, false);
        CreateSelect("Synchronization", w.synch, w.span, true);

        var slist = this.weap.GetSynchronizationList();
        for (let s of slist) {
            var opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = s;
            w.synch.add(opt);
        }

        wcell.appendChild(w.span);
        return w;
    }

    private UpdateWSet(set: WeaponSystem, disp: WSetType) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.oninput = () => { set.SetWeaponSelected(disp.type.selectedIndex); };

        disp.count.valueAsNumber = set.GetWeaponCount();
        disp.count.oninput = () => { set.SetWeaponCount(disp.count.valueAsNumber); };

        disp.fixed.checked = set.GetFixed();
        disp.fixed.oninput = () => { set.SetFixed(disp.fixed.checked); };

        var dirlist = set.GetDirection();
        var candir = set.CanDirection();
        for (let i = 0; i < dirlist.length; i++) {
            disp.dirs[i].checked = dirlist[i];
            disp.dirs[i].oninput = () => { set.SetDirection(i, disp.dirs[i].checked); };
            disp.dirs[i].disabled = !candir[i];
        }

        var wlist = set.GetWeapons();
        while (disp.weaps.length < wlist.length) {
            disp.weaps.push(this.CreateWRow(disp.wcell));
        }
        while (disp.weaps.length > wlist.length) {
            var w = disp.weaps.pop();
            disp.wcell.removeChild(w.span);
        }
        for (let i = 0; i < wlist.length; i++) {
            disp.weaps[i].wing.checked = wlist[i].GetWing();
            disp.weaps[i].wing.oninput = () => { wlist[i].SetWing(disp.weaps[i].wing.checked); };
            disp.weaps[i].wing.disabled = !wlist[i].CanWing();
            disp.weaps[i].covered.checked = wlist[i].GetCovered();
            disp.weaps[i].covered.oninput = () => { wlist[i].SetCovered(disp.weaps[i].covered.checked); };
            disp.weaps[i].accessible.checked = wlist[i].GetAccessible();
            disp.weaps[i].accessible.oninput = () => { wlist[i].SetAccessible(disp.weaps[i].accessible.checked); };
            disp.weaps[i].free_access.checked = wlist[i].GetFreeAccessible();
            disp.weaps[i].free_access.oninput = () => { wlist[i].SetFreeAccessible(disp.weaps[i].free_access.checked); };
            disp.weaps[i].free_access.disabled = !(wlist[i].can_free_accessible || wlist[i].GetFreeAccessible());
            disp.weaps[i].pair.checked = wlist[i].GetPair();
            disp.weaps[i].pair.oninput = () => { wlist[i].SetPair(disp.weaps[i].pair.checked); };
            disp.weaps[i].pair.disabled = !wlist[i].CanPair();
            disp.weaps[i].synch.selectedIndex = wlist[i].GetSynchronization() + 1;
            disp.weaps[i].synch.oninput = () => { wlist[i].SetSynchronization(disp.weaps[i].synch.selectedIndex - 1); };
            disp.weaps[i].synch.disabled = !wlist[i].can_synchronize;
            disp.weaps[i].synch.options[SynchronizationType.SPINNER + 1].disabled = !wlist[i].can_spinner;
        }


        var stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString());
        BlinkIfChanged(disp.stats.drag, stats.drag.toString());
        BlinkIfChanged(disp.stats.cost, stats.cost.toString());
        BlinkIfChanged(disp.stats.sect, stats.reqsections.toString());
        BlinkIfChanged(disp.stats.hits, "NYI");
        BlinkIfChanged(disp.stats.damg, "NYI");
    }

    private UpdateWSets() {
        var wsets = this.weap.GetWeaponSets();

        this.inp_w_count.valueAsNumber = wsets.length;
        while (wsets.length > this.wrow.length) {
            this.wrow.push(this.CreateWSetRow());
        }
        while (wsets.length < this.wrow.length) {
            this.tbl.deleteRow(this.wrow.length);
            this.wrow.pop();
        }
        for (let i = 0; i < wsets.length; i++) {
            this.UpdateWSet(wsets[i], this.wrow[i]);
        }
    }

    public UpdateDisplay() {
        this.UpdateWSets();
    }
}