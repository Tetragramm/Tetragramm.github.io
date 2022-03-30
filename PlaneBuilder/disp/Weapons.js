import { ProjectileType, ActionType } from "../impl/Weapons.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateCheckbox, CreateFlexSection, CreateInput, CreateSelect, CreateTH, BlinkIfChanged, FlexCheckbox, FlexInput, FlexSelect, FlexSpace } from "./Tools.js";
import { StringFmt } from "../string/index.js";
import { Display } from "./Display.js";
export class Weapons_HTML extends Display {
    constructor(weap) {
        super();
        this.weap = weap;
        document.getElementById("lbl_weapons").textContent = lu("Weapons Section Title");
        document.getElementById("lbl_num_wsets").textContent = lu("Weapons Number of Weapon Sets");
        this.inp_w_count = document.getElementById("num_wsets");
        this.inp_w_count.onchange = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };
        document.getElementById("lbl_num_wbraces").textContent = lu("Weapons Number of Weapon Braces");
        this.inp_w_brace = document.getElementById("num_wbraces");
        this.inp_w_brace.onchange = () => { this.weap.SetBraceCount(this.inp_w_brace.valueAsNumber); };
        this.tbl = document.getElementById("table_weapons");
        var row = this.tbl.insertRow();
        CreateTH(row, lu("Weapons Weapon Set"));
        CreateTH(row, lu("Weapons Weapons"));
        CreateTH(row, lu("Weapons Weapon Stats"));
        this.wrow = [];
    }
    CreateWSetRow() {
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        var setcell = row.insertCell();
        var fs = CreateFlexSection(setcell);
        var type = {
            type: document.createElement("SELECT"),
            dirs: [],
            count: document.createElement("INPUT"),
            action: document.createElement("SELECT"),
            projectile: document.createElement("SELECT"),
            fixed: document.createElement("INPUT"),
            wcell: null,
            weaps: [],
            ammo: document.createElement("INPUT"),
            stats: { mass: null, drag: null, cost: null, sect: null, mounting: null, jams: null, hits: null, damg: null, shots: null, shots_header: null },
            repeating: document.createElement("INPUT"),
            seat: document.createElement("SELECT"),
        };
        var wlist = this.weap.GetWeaponList();
        for (let w of wlist) {
            let opt = document.createElement("OPTION");
            opt.text = lu(w.name) + " (" + lu(w.era) + ")";
            type.type.add(opt);
        }
        type.type.required = true;
        var slist = this.weap.GetSeatList();
        for (let s of slist) {
            let opt = document.createElement("OPTION");
            opt.text = s;
            type.seat.add(opt);
        }
        var alist = this.weap.GetActionList();
        for (let a of alist) {
            let opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            type.action.add(opt);
        }
        type.action.required = true;
        var plist = this.weap.GetProjectileList();
        for (let p of plist) {
            let opt = document.createElement("OPTION");
            opt.text = lu(p.name);
            type.projectile.add(opt);
        }
        type.projectile.required = true;
        FlexSelect(lu("Weapons Type"), type.type, fs);
        FlexSelect(lu("Seat Location"), type.seat, fs);
        var lfs = CreateFlexSection(fs.div1);
        var rfs = CreateFlexSection(fs.div2);
        FlexInput(lu("Weapons Number of Mounts"), type.count, lfs);
        FlexInput(lu("Weapons Ammunition"), type.ammo, rfs);
        FlexSelect(lu("Weapons Action"), type.action, lfs);
        FlexSelect(lu("Weapons Projectile"), type.projectile, rfs);
        FlexCheckbox(lu("Weapons Belt Fed"), type.repeating, lfs);
        FlexSpace(rfs);
        FlexCheckbox(lu("Fixed"), type.fixed, lfs);
        FlexSpace(rfs);
        var dirlist = this.weap.GetDirectionList();
        for (let i = 0; i < dirlist.length; i += 2) {
            var dl = lu(dirlist[i]);
            var cbx = document.createElement("INPUT");
            FlexCheckbox(dl, cbx, lfs);
            type.dirs.push(cbx);
            var dr = lu(dirlist[i + 1]);
            cbx = document.createElement("INPUT");
            FlexCheckbox(dr, cbx, rfs);
            type.dirs.push(cbx);
        }
        type.wcell = row.insertCell();
        var statcell = row.insertCell();
        statcell.classList.toggle("inner_table");
        var stable = document.createElement("TABLE");
        stable.classList.toggle("inner_table");
        statcell.appendChild(stable);
        var h1_row = stable.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        type.stats.cost = c1_row.insertCell();
        var h2_row = stable.insertRow();
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, lu("Weapons Stat Mounting"));
        CreateTH(h2_row, lu("Weapons Stat Jam"));
        var c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.mounting = c2_row.insertCell();
        type.stats.jams = c2_row.insertCell();
        var h3_row = stable.insertRow();
        CreateTH(h3_row, lu("Weapons Stat Hits"));
        CreateTH(h3_row, lu("Weapons Stat Damage"));
        type.stats.shots_header = CreateTH(h3_row, lu("Weapons Stat Shots"));
        var c3_row = stable.insertRow();
        type.stats.hits = c3_row.insertCell();
        type.stats.damg = c3_row.insertCell();
        type.stats.shots = c3_row.insertCell();
        this.tbl.appendChild(fragment);
        return type;
    }
    CreateWRow(wcell) {
        var w = {
            span: document.createElement("SPAN"),
            wing: document.createElement("INPUT"),
            covered: document.createElement("INPUT"),
            accessible: document.createElement("INPUT"),
            free_access: document.createElement("INPUT"),
            synch: document.createElement("SELECT"),
            count: document.createElement("INPUT"),
        };
        CreateCheckbox(lu("Weapons Wing Mount"), w.wing, w.span, false);
        CreateCheckbox(lu("Weapons Accessible"), w.accessible, w.span, false);
        CreateCheckbox(lu("Weapons Free Accessible"), w.free_access, w.span, false);
        CreateCheckbox(lu("Weapons Covered"), w.covered, w.span, true);
        CreateInput(lu("Weapons # Weapons at Mount"), w.count, w.span, false);
        CreateSelect(lu("Weapons Synchronization"), w.synch, w.span, false);
        w.span.appendChild(document.createElement("HR"));
        var slist = this.weap.GetSynchronizationList();
        for (let s of slist) {
            var opt = document.createElement("OPTION");
            opt.text = lu(s);
            w.synch.add(opt);
        }
        wcell.appendChild(w.span);
        return w;
    }
    UpdateWSet(set, disp) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.onchange = () => { set.SetWeaponSelected(disp.type.selectedIndex); };
        var slist = this.weap.GetSeatList();
        if (disp.seat.options.length != slist.length) {
            while (disp.seat.options.length > 0) {
                disp.seat.options.remove(disp.seat.options.length - 1);
            }
            for (let s of slist) {
                let opt = document.createElement("OPTION");
                opt.text = s;
                disp.seat.add(opt);
            }
        }
        disp.seat.selectedIndex = set.GetSeat();
        disp.seat.onchange = () => { set.SetSeat(disp.seat.selectedIndex); };
        disp.count.valueAsNumber = set.GetMountingCount();
        disp.count.onchange = () => { set.SetMountingCount(disp.count.valueAsNumber); };
        disp.action.selectedIndex = set.GetAction();
        var can_act = set.GetCanAction();
        for (let i = 0; i < can_act.length; i++) {
            disp.action.options[i].disabled = !can_act[i];
        }
        disp.action.onchange = () => { set.SetAction(disp.action.selectedIndex); };
        disp.projectile.selectedIndex = set.GetProjectile();
        var can_proj = set.GetCanProjectile();
        for (let i = 0; i < can_proj.length; i++) {
            disp.projectile.options[i].disabled = !can_proj[i];
        }
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
        var hits = h[0].toString() + "/"
            + h[1].toString() + "/"
            + h[2].toString() + "/"
            + h[3].toString();
        if (set.GetFixed())
            BlinkIfChanged(disp.stats.mounting, lu("Fixed"));
        else if (set.GetDirectionCount() <= 2)
            BlinkIfChanged(disp.stats.mounting, lu("Flexible"));
        else
            BlinkIfChanged(disp.stats.mounting, lu("Turret"));
        BlinkIfChanged(disp.stats.jams, set.GetJam());
        BlinkIfChanged(disp.stats.hits, hits);
        BlinkIfChanged(disp.stats.damg, set.GetDamage().toString());
        if (set.GetProjectile() == ProjectileType.HEATRAY || set.IsLightningArc()) { //Heat Rays or lightning guns
            let chgs = set.GetHRCharges();
            disp.stats.shots_header.textContent = lu("Weapons Stat Charges");
            BlinkIfChanged(disp.stats.shots, StringFmt.Join("/", chgs));
        }
        else {
            disp.stats.shots_header.textContent = lu("Weapons Stat Shots");
            BlinkIfChanged(disp.stats.shots, set.GetShots().toString());
        }
    }
    UpdateWSets() {
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
    UpdateDisplay() {
        this.UpdateWSets();
        this.inp_w_count.valueAsNumber = this.weap.GetWeaponSets().length;
        this.inp_w_brace.valueAsNumber = this.weap.GetBraceCount();
    }
}
export function WeaponName(w, wlist) {
    var ds = w.GetDirection();
    var dircount = 0;
    for (let d of ds) {
        if (d)
            dircount++;
    }
    var name = "";
    if (dircount == 1 && w.GetFixed())
        name += lu("Fixed") + " ";
    else if (dircount <= 2)
        name += lu("Flexible") + " ";
    else
        name += lu("Turreted") + " ";
    if (w.GetAction() == ActionType.MECHANICAL) {
        name += lu("Weapon Tag Mechanical Action") + " ";
    }
    else if (w.GetAction() == ActionType.GAST) {
        name += lu("Weapon Tag Gast Principle") + " ";
    }
    else if (w.GetAction() == ActionType.ROTARY) {
        name += lu("Weapon Tag Rotary") + " ";
    }
    if (w.GetProjectile() == ProjectileType.HEATRAY) {
        name += lu("Weapon Tag Heat Ray") + " ";
    }
    else if (w.GetProjectile() == ProjectileType.GYROJETS) {
        name += lu("Weapon Tag Gyrojet") + " ";
    }
    else if (w.GetProjectile() == ProjectileType.PNEUMATIC) {
        name += lu("Weapon Tag Pneumatic") + " ";
    }
    name += wlist[w.GetWeaponSelected()].abrv;
    return name;
}
export function WeaponTags(w) {
    var tags = [lu("Weapon Tag Jam", w.GetJam())];
    let fweap = w.GetFinalWeapon();
    if (w.GetReload() > 0) {
        if (w.GetReload() == 1) {
            tags.push(lu("Weapon Tag Manual"));
        }
        else {
            tags.push(lu("Weapon Tag Reload", w.GetReload()));
        }
    }
    if (fweap.rapid) {
        tags.push(lu("Weapon Tag Rapid Fire"));
    }
    if (fweap.shells) {
        tags.push(lu("Weapon Tag Shells"));
    }
    if (fweap.ap > 0) {
        tags.push(lu("Weapon Tag AP", fweap.ap));
    }
    if (w.GetIsFullyAccessible()) {
        tags.push(lu("Weapon Tag Fully Accessible"));
    }
    else if (w.GetIsPartlyAccessible()) {
        tags.push(lu("Weapon Tag Partly Accessible"));
    }
    else {
        tags.push(lu("Weapon Tag Inaccessible"));
    }
    if (fweap.deflection) {
        tags.push(lu("Weapon Tag Awkward", fweap.deflection));
    }
    return tags;
}
export function WeaponString(w, wlist, dlist) {
    var wstring = "";
    var ds = w.GetDirection();
    var dirs = [];
    for (let i = 0; i < dlist.length; i++) {
        if (ds[i])
            dirs.push(lu(dlist[i]));
    }
    let hits = w.GetHits();
    let tags = WeaponTags(w);
    if (w.GetProjectile() == ProjectileType.HEATRAY) {
        let chgs = w.GetHRCharges();
        wstring += lu("Weapon Description Heat Ray", lu("Seat #", w.GetSeat() + 1), w.GetWeaponCount(), WeaponName(w, wlist), StringFmt.Join(" ", dirs), wlist[w.GetWeaponSelected()].damage, StringFmt.Join("/", hits), StringFmt.Join("/", chgs), StringFmt.Join(", ", tags));
    }
    else {
        wstring += lu("Weapon Description", lu("Seat #", w.GetSeat() + 1), w.GetWeaponCount(), WeaponName(w, wlist), StringFmt.Join(" ", dirs), wlist[w.GetWeaponSelected()].damage, StringFmt.Join("/", hits), w.GetShots(), StringFmt.Join(", ", tags));
    }
    return wstring;
}
