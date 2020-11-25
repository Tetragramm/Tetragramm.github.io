/// <reference path="./Display.ts" />
/// <reference path="../impl/Weapons.ts" />

type WType = {
    span: HTMLSpanElement, wing: HTMLInputElement, covered: HTMLInputElement,
    accessible: HTMLInputElement, free_access: HTMLInputElement, synch: HTMLSelectElement,
    count: HTMLInputElement,
};
type WStatType = {
    mass: HTMLTableCellElement, drag: HTMLTableCellElement, cost: HTMLTableCellElement,
    sect: HTMLTableCellElement, none: HTMLTableCellElement, jams: HTMLTableCellElement,
    hits: HTMLTableCellElement, damg: HTMLTableCellElement, shots: HTMLTableCellElement,
};
type WSetType = {
    type: HTMLSelectElement, dirs: HTMLInputElement[],
    count: HTMLInputElement, action: HTMLSelectElement,
    projectile: HTMLSelectElement, fixed: HTMLInputElement,
    wcell: HTMLTableCellElement, ammo: HTMLInputElement,
    weaps: WType[], stats: WStatType, repeating: HTMLInputElement
};
class Weapons_HTML extends Display {
    private weap: Weapons;

    private tbl: HTMLTableElement;
    private inp_w_count: HTMLInputElement;
    private wrow: WSetType[];
    private inp_w_brace: HTMLInputElement;

    constructor(weap: Weapons) {
        super();
        this.weap = weap;

        this.inp_w_count = document.getElementById("num_wsets") as HTMLInputElement;
        this.inp_w_count.onchange = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };

        this.inp_w_brace = document.getElementById("num_wbraces") as HTMLInputElement;
        this.inp_w_brace.onchange = () => { this.weap.SetBraceCount(this.inp_w_brace.valueAsNumber); };

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
            action: document.createElement("SELECT") as HTMLSelectElement,
            projectile: document.createElement("SELECT") as HTMLSelectElement,
            fixed: document.createElement("INPUT") as HTMLInputElement,
            wcell: null,
            weaps: [],
            ammo: document.createElement("INPUT") as HTMLInputElement,
            stats: { mass: null, drag: null, cost: null, sect: null, none: null, jams: null, hits: null, damg: null, shots: null },
            repeating: document.createElement("INPUT") as HTMLInputElement,
        };

        var wlist = this.weap.GetWeaponList();
        for (let w of wlist) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = w.name + " (" + w.era + ")";
            type.type.add(opt);
        }
        type.type.required = true;

        var alist = this.weap.GetActionList();
        for (let a of alist) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = a.name;
            type.action.add(opt);
        }
        type.action.required = true;

        var plist = this.weap.GetProjectileList();
        for (let p of plist) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = p.name;
            type.projectile.add(opt);
        }
        type.projectile.required = true;

        FlexSelect("Type", type.type, fs);

        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        FlexInput("Number of Mounts", type.count, lfs);
        FlexInput("Ammunition", type.ammo, rfs);
        FlexSelect("Action", type.action, lfs);
        FlexSelect("Projectile", type.projectile, rfs);
        FlexCheckbox("Belt Fed", type.repeating, lfs);
        FlexSpace(rfs);
        FlexCheckbox("Fixed", type.fixed, lfs);
        FlexSpace(rfs);

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
        statcell.classList.toggle("inner_table");
        var stable = document.createElement("TABLE") as HTMLTableElement;
        stable.classList.toggle("inner_table");
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
        CreateTH(h2_row, "");
        CreateTH(h2_row, "Jam");
        var c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.none = c2_row.insertCell();
        type.stats.jams = c2_row.insertCell();
        var h3_row = stable.insertRow();
        CreateTH(h3_row, "Hits");
        CreateTH(h3_row, "Damage");
        CreateTH(h3_row, "Shots");
        var c3_row = stable.insertRow();
        type.stats.hits = c3_row.insertCell();
        type.stats.damg = c3_row.insertCell();
        type.stats.shots = c3_row.insertCell();

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
            count: document.createElement("INPUT") as HTMLInputElement,
        };
        CreateCheckbox("Wing Mount", w.wing, w.span, false);
        CreateCheckbox("Accessible", w.accessible, w.span, false);
        CreateCheckbox("Free Accessible", w.free_access, w.span, false);
        CreateCheckbox("Covered", w.covered, w.span, true);
        CreateInput("Weapons at Mount", w.count, w.span, false);
        CreateSelect("Synchronization", w.synch, w.span, false);
        w.span.appendChild(document.createElement("HR"));

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
        disp.type.onchange = () => { set.SetWeaponSelected(disp.type.selectedIndex); };

        disp.count.valueAsNumber = set.GetWeaponCount();
        disp.count.onchange = () => { set.SetWeaponCount(disp.count.valueAsNumber); };

        disp.action.selectedIndex = set.GetAction();
        var can_act = set.GetCanAction();
        for (let i = 0; i < can_act.length; i++) {
            disp.action.options[i].disabled = !can_act[i];
        }
        disp.action.onchange = () => { set.SetAction(disp.action.selectedIndex); };

        disp.projectile.selectedIndex = set.GetProjectile();
        disp.projectile.disabled = !set.GetCanProjectile();
        disp.projectile.onchange = () => { set.SetProjectile(disp.projectile.selectedIndex); };

        disp.repeating.checked = set.GetRepeating();
        disp.repeating.onchange = () => { set.SetRepeating(disp.repeating.checked); };
        disp.repeating.disabled = !set.CanRepeating();

        disp.fixed.checked = set.GetFixed();
        disp.fixed.onchange = () => { set.SetFixed(disp.fixed.checked); };

        var dirlist = set.GetDirection();
        var candir = set.CanDirection();
        for (let i = 0; i < dirlist.length; i++) {
            disp.dirs[i].checked = dirlist[i];
            disp.dirs[i].onchange = () => { set.SetDirection(i, disp.dirs[i].checked); };
            disp.dirs[i].disabled = !candir[i];
        }
        disp.ammo.valueAsNumber = set.GetAmmo();
        disp.ammo.onchange = () => { set.SetAmmo(disp.ammo.valueAsNumber); };

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
            disp.weaps[i].wing.onchange = () => { wlist[i].SetWing(disp.weaps[i].wing.checked); };
            disp.weaps[i].wing.disabled = !wlist[i].CanWing();
            disp.weaps[i].covered.checked = wlist[i].GetCovered();
            disp.weaps[i].covered.onchange = () => { wlist[i].SetCovered(disp.weaps[i].covered.checked); };
            disp.weaps[i].covered.disabled = !wlist[i].CanCovered();
            disp.weaps[i].accessible.checked = wlist[i].GetAccessible();
            disp.weaps[i].accessible.onchange = () => { wlist[i].SetAccessible(disp.weaps[i].accessible.checked); };
            disp.weaps[i].free_access.checked = wlist[i].GetFreeAccessible();
            disp.weaps[i].free_access.onchange = () => { wlist[i].SetFreeAccessible(disp.weaps[i].free_access.checked); };
            disp.weaps[i].free_access.disabled = !(wlist[i].can_free_accessible || wlist[i].GetFreeAccessible());
            disp.weaps[i].count.valueAsNumber = wlist[i].GetCount();
            disp.weaps[i].count.onchange = () => { wlist[i].SetCount(disp.weaps[i].count.valueAsNumber); };
            disp.weaps[i].synch.selectedIndex = wlist[i].GetSynchronization() + 1;
            disp.weaps[i].synch.onchange = () => { wlist[i].SetSynchronization(disp.weaps[i].synch.selectedIndex - 1); };
            disp.weaps[i].synch.disabled = !wlist[i].can_synchronize;
            var can = wlist[i].CanSynchronization();
            for (let j = 0; j < can.length; j++) {
                disp.weaps[i].synch.options[j].disabled = !can[j];
            }
        }

        var stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString(), false);
        BlinkIfChanged(disp.stats.drag, stats.drag.toString(), false);
        BlinkIfChanged(disp.stats.cost, stats.cost.toString(), false);
        BlinkIfChanged(disp.stats.sect, stats.reqsections.toString(), false);

        var h = set.GetHits();
        var hits = h[0].toString() + "\\"
            + h[1].toString() + "\\"
            + h[2].toString() + "\\"
            + h[3].toString();

        BlinkIfChanged(disp.stats.jams, set.GetJam());
        BlinkIfChanged(disp.stats.hits, hits);
        BlinkIfChanged(disp.stats.damg, set.GetDamage().toString());
        BlinkIfChanged(disp.stats.shots, set.GetShots().toString());
    }

    private UpdateWSets() {
        var wsets = this.weap.GetWeaponSets();
        if (wsets.length == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";

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
        this.inp_w_count.valueAsNumber = this.weap.GetWeaponSets().length;
        this.inp_w_brace.valueAsNumber = this.weap.GetBraceCount();
    }
}