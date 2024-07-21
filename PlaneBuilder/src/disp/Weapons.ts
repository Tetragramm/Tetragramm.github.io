import { WeaponSystem } from "../impl/WeaponSystem";
import { Stats } from "../impl/Stats";
import { insertRow, CreateCheckbox, CreateFlexSection, CreateInput, CreateSelect, CreateTH, BlinkIfChanged, FlexCheckbox, FlexInput, FlexSelect, FlexSpace, CreateTD } from "./Tools";
import { StringFmt } from "../string/index";
import { Display } from "./Display";
import { ActionType, ProjectileType } from "../impl/Weapon";
import { Weapons } from "../impl/Weapons";
import { lu } from "../impl/Localization";

type WType = {
    span: HTMLSpanElement, wing: HTMLInputElement, covered: HTMLInputElement,
    accessible: HTMLInputElement, free_access: HTMLInputElement, synch: HTMLSelectElement,
    count: HTMLInputElement,
};
type WStatType = {
    mass: HTMLTableCellElement, drag: HTMLTableCellElement, cost: HTMLTableCellElement,
    sect: HTMLTableCellElement, mounting: HTMLTableCellElement, jams: HTMLTableCellElement,
    hits: HTMLTableCellElement, damg: HTMLTableCellElement, shots: HTMLTableCellElement,
    shots_header: HTMLTableHeaderCellElement,
};
type WSetType = {
    plus: HTMLButtonElement, minus: HTMLButtonElement,
    type: HTMLSelectElement, dirs: HTMLInputElement[],
    count: HTMLInputElement, action: HTMLSelectElement,
    projectile: HTMLSelectElement, fixed: HTMLInputElement,
    wcell: HTMLTableCellElement, ammo: HTMLInputElement,
    weaps: WType[], stats: WStatType, repeating: HTMLInputElement,
    seat: HTMLSelectElement,
};
export class Weapons_HTML extends Display {
    private weap: Weapons;

    private tbl: HTMLTableElement;
    private inp_w_count: HTMLInputElement;
    private wrow: WSetType[];
    private inp_w_brace: HTMLInputElement;

    constructor(weap: Weapons) {
        super();
        this.weap = weap;

        (document.getElementById("lbl_weapons") as HTMLLabelElement).textContent = lu("Weapons Section Title");

        (document.getElementById("lbl_num_wsets") as HTMLLabelElement).textContent = lu("Weapons Number of Weapon Sets");
        this.inp_w_count = document.getElementById("num_wsets") as HTMLInputElement;
        this.inp_w_count.onchange = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };

        (document.getElementById("lbl_num_wbraces") as HTMLLabelElement).textContent = lu("Weapons Number of Weapon Braces");
        this.inp_w_brace = document.getElementById("num_wbraces") as HTMLInputElement;
        this.inp_w_brace.onchange = () => { this.weap.SetBraceCount(this.inp_w_brace.valueAsNumber); };

        this.tbl = document.getElementById("table_weapons") as HTMLTableElement;
        this.wrow = [];
    }

    private CreateWSetRow() {
        const fragment = document.createDocumentFragment();
        const rowh = this.tbl.insertRow();
        const fheader = CreateTD(rowh, "");
        const span = document.createElement("SPAN") as HTMLSpanElement;
        CreateTH(rowh, lu("Weapons Weapons"));
        CreateTH(rowh, lu("Weapons Weapon Stats"));
        const row = insertRow(fragment);
        const setcell = row.insertCell();

        const type = {
            plus: document.createElement("BUTTON") as HTMLButtonElement,
            minus: document.createElement("BUTTON") as HTMLButtonElement,
            type: document.createElement("SELECT") as HTMLSelectElement,
            dirs: [],
            count: document.createElement("INPUT") as HTMLInputElement,
            action: document.createElement("SELECT") as HTMLSelectElement,
            projectile: document.createElement("SELECT") as HTMLSelectElement,
            fixed: document.createElement("INPUT") as HTMLInputElement,
            wcell: null,
            weaps: [],
            ammo: document.createElement("INPUT") as HTMLInputElement,
            stats: { mass: null, drag: null, cost: null, sect: null, mounting: null, jams: null, hits: null, damg: null, shots: null, shots_header: null },
            repeating: document.createElement("INPUT") as HTMLInputElement,
            seat: document.createElement("SELECT") as HTMLSelectElement,
        };

        const wlist = this.weap.GetWeaponList();
        for (const w of wlist) {
            const opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(w.name) + " (" + lu(w.era) + ")";
            type.type.add(opt);
        }
        type.type.required = true;

        const slist = this.weap.GetSeatList();
        for (const s of slist) {
            const opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = s;
            type.seat.add(opt);
        }

        const alist = this.weap.GetActionList();
        for (const a of alist) {
            const opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(a.name);
            type.action.add(opt);
        }
        type.action.required = true;

        const plist = this.weap.GetProjectileList();
        for (const p of plist) {
            const opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(p.name);
            type.projectile.add(opt);
        }
        type.projectile.required = true;

        type.plus.textContent = "+";
        type.minus.textContent = "-";
        const fs = CreateFlexSection(setcell);
        span.appendChild(type.minus);
        span.appendChild(type.plus);
        const th = CreateTH(span, lu("Weapons Weapon Set"));
        th.style.border = "none";
        th.style.width = "100%";
        th.style.padding = "0";
        span.style.display = "inline-flex";
        span.style.width = "100%";
        fheader.appendChild(span);
        FlexSelect(lu("Weapons Type"), type.type, fs);
        FlexSelect(lu("Seat Location"), type.seat, fs);

        const lfs = CreateFlexSection(fs.div1);
        const rfs = CreateFlexSection(fs.div2);
        FlexInput(lu("Weapons Number of Mounts"), type.count, lfs);
        FlexInput(lu("Weapons Ammunition"), type.ammo, rfs);
        FlexSelect(lu("Weapons Action"), type.action, lfs);
        FlexSelect(lu("Weapons Projectile"), type.projectile, rfs);
        FlexCheckbox(lu("Weapons Belt Fed"), type.repeating, lfs);
        FlexSpace(rfs);
        FlexCheckbox(lu("Fixed"), type.fixed, lfs);
        FlexSpace(rfs);

        const dirlist = this.weap.GetDirectionList();
        for (let i = 0; i < dirlist.length; i += 2) {
            const dl = lu(dirlist[i]);
            var cbx = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(dl, cbx, lfs);
            type.dirs.push(cbx);
            const dr = lu(dirlist[i + 1]);
            cbx = document.createElement("INPUT") as HTMLInputElement;
            FlexCheckbox(dr, cbx, rfs);
            type.dirs.push(cbx);
        }

        type.wcell = row.insertCell();
        const statcell = row.insertCell();
        statcell.classList.toggle("inner_table");
        const stable = document.createElement("TABLE") as HTMLTableElement;
        stable.classList.toggle("inner_table");
        statcell.appendChild(stable);
        const h1_row = stable.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        const c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        type.stats.cost = c1_row.insertCell();
        const h2_row = stable.insertRow();
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, lu("Weapons Stat Mounting"));
        CreateTH(h2_row, lu("Weapons Stat Jam"));
        const c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.mounting = c2_row.insertCell();
        type.stats.jams = c2_row.insertCell();
        const h3_row = stable.insertRow();
        CreateTH(h3_row, lu("Weapons Stat Hits"));
        CreateTH(h3_row, lu("Weapons Stat Damage"));
        type.stats.shots_header = CreateTH(h3_row, lu("Weapons Stat Shots"));
        const c3_row = stable.insertRow();
        type.stats.hits = c3_row.insertCell();
        type.stats.damg = c3_row.insertCell();
        type.stats.shots = c3_row.insertCell();

        this.tbl.appendChild(fragment);
        return type;
    }

    private CreateWRow(wcell: HTMLTableCellElement) {
        const w = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            wing: document.createElement("INPUT") as HTMLInputElement,
            covered: document.createElement("INPUT") as HTMLInputElement,
            accessible: document.createElement("INPUT") as HTMLInputElement,
            free_access: document.createElement("INPUT") as HTMLInputElement,
            synch: document.createElement("SELECT") as HTMLSelectElement,
            count: document.createElement("INPUT") as HTMLInputElement,
        };
        CreateCheckbox(lu("Weapons Wing Mount"), w.wing, w.span, false);
        CreateCheckbox(lu("Weapons Accessible"), w.accessible, w.span, false);
        CreateCheckbox(lu("Weapons Free Accessible"), w.free_access, w.span, false);
        CreateCheckbox(lu("Weapons Covered"), w.covered, w.span, true);
        CreateInput(lu("Weapons # Weapons at Mount"), w.count, w.span, false);
        CreateSelect(lu("Weapons Synchronization"), w.synch, w.span, false);
        w.span.appendChild(document.createElement("HR"));

        const slist = this.weap.GetSynchronizationList();
        for (const s of slist) {
            const opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(s);
            w.synch.add(opt);
        }

        wcell.appendChild(w.span);
        return w;
    }

    private UpdateWSet(set: WeaponSystem, disp: WSetType) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.onchange = () => { set.SetWeaponSelected(disp.type.selectedIndex); };

        const slist = this.weap.GetSeatList();
        if (disp.seat.options.length != slist.length) {
            while (disp.seat.options.length > 0) {
                disp.seat.options.remove(disp.seat.options.length - 1);
            }
            for (const s of slist) {
                const opt = document.createElement("OPTION") as HTMLOptionElement;
                opt.text = s;
                disp.seat.add(opt);
            }
        }
        disp.seat.selectedIndex = set.GetSeat();
        disp.seat.onchange = () => { set.SetSeat(disp.seat.selectedIndex); };

        disp.count.valueAsNumber = set.GetMountingCount();
        disp.count.onchange = () => { set.SetMountingCount(disp.count.valueAsNumber); };

        disp.action.selectedIndex = set.GetAction();
        const can_act = set.GetCanAction();
        can_act[3] = false;
        for (let i = 0; i < can_act.length; i++) {
            disp.action.options[i].disabled = !can_act[i];
        }
        disp.action.onchange = () => { set.SetAction(disp.action.selectedIndex); };

        disp.projectile.selectedIndex = set.GetProjectile();
        const can_proj = set.GetCanProjectile();
        for (let i = 0; i < can_proj.length; i++) {
            disp.projectile.options[i].disabled = !can_proj[i];
        }
        disp.projectile.onchange = () => { set.SetProjectile(disp.projectile.selectedIndex); };

        disp.repeating.checked = set.GetRepeating();
        disp.repeating.onchange = () => { set.SetRepeating(disp.repeating.checked); };
        disp.repeating.disabled = !set.CanRepeating();

        disp.fixed.checked = set.GetFixed();
        disp.fixed.onchange = () => { set.SetFixed(disp.fixed.checked); };

        const dirlist = set.GetDirection();
        const candir = set.CanDirection();
        for (let i = 0; i < dirlist.length; i++) {
            disp.dirs[i].checked = dirlist[i];
            disp.dirs[i].onchange = () => { set.SetDirection(i, disp.dirs[i].checked); };
            disp.dirs[i].disabled = !candir[i];
        }
        disp.ammo.valueAsNumber = set.GetAmmo();
        disp.ammo.onchange = () => { set.SetAmmo(disp.ammo.valueAsNumber); };

        const wlist = set.GetWeapons();
        while (disp.weaps.length < wlist.length) {
            disp.weaps.push(this.CreateWRow(disp.wcell));
        }
        while (disp.weaps.length > wlist.length) {
            const w = disp.weaps.pop();
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
            const can = wlist[i].CanSynchronization();
            for (let j = 0; j < can.length; j++) {
                disp.weaps[i].synch.options[j].disabled = !can[j];
            }
        }

        const stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString(), false);
        BlinkIfChanged(disp.stats.drag, stats.drag.toString(), false);
        BlinkIfChanged(disp.stats.cost, stats.cost.toString(), false);
        BlinkIfChanged(disp.stats.sect, stats.reqsections.toString(), false);

        const h = set.GetHits();
        const hits = h[0].toString() + "/"
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
            const chgs = set.GetHRCharges();
            disp.stats.shots_header.textContent = lu("Weapons Stat Charges");
            BlinkIfChanged(disp.stats.shots, StringFmt.Join("/", chgs));
        } else {
            disp.stats.shots_header.textContent = lu("Weapons Stat Shots");
            BlinkIfChanged(disp.stats.shots, set.GetShots().toString());
        }
    }

    private UpdateWSets() {
        const wsets = this.weap.GetWeaponSets();
        if (wsets.length == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";

        this.inp_w_count.valueAsNumber = wsets.length;
        while (wsets.length > this.wrow.length) {
            this.wrow.push(this.CreateWSetRow());
        }
        while (wsets.length < this.wrow.length) {
            this.tbl.deleteRow(2 * this.wrow.length - 1);
            this.tbl.deleteRow(2 * this.wrow.length - 2);
            this.wrow.pop();
        }
        for (let i = 0; i < wsets.length; i++) {
            this.wrow[i].plus.onclick = () => {
                this.weap.DuplicateSet(i);
            };
            this.wrow[i].minus.onclick = () => {
                this.weap.RemoveSet(i);
            };
            this.UpdateWSet(wsets[i], this.wrow[i]);
        }
    }

    public UpdateDisplay() {
        this.UpdateWSets();
        this.inp_w_count.valueAsNumber = this.weap.GetWeaponSets().length;
        this.inp_w_brace.valueAsNumber = this.weap.GetBraceCount();
    }
}

export function WeaponName(w: WeaponSystem, wlist: {
    name: string,
    abrv: string, era: string,
    size: number, stats: Stats,
    damage: number, hits: number,
    ammo: number, ap: number,
    jam: string, reload: number,
    rapid: boolean, synched: boolean,
    shells: boolean, can_action: boolean,
    can_projectile: boolean, deflection: number,
}[]): string {
    const ds = w.GetDirection();
    let dircount = 0;
    for (const d of ds) {
        if (d)
            dircount++;
    }
    let name = "";
    if (dircount == 1 && w.GetFixed())
        name += lu("Fixed") + " ";
    else if (dircount <= 2)
        name += lu("Flexible") + " ";
    else
        name += lu("Turreted") + " ";

    if (w.GetAction() == ActionType.MECHANICAL) {
        name += lu("Weapon Tag Mechanical Action") + " ";
    } else if (w.GetAction() == ActionType.GAST) {
        name += lu("Weapon Tag Gast Principle") + " ";
    } else if (w.GetAction() == ActionType.ROTARY) {
        name += lu("Weapon Tag Rotary") + " ";
    }

    if (w.GetProjectile() == ProjectileType.HEATRAY) {
        name += lu("Weapon Tag Heat Ray") + " ";
    } else if (w.GetProjectile() == ProjectileType.GYROJETS) {
        name += lu("Weapon Tag Gyrojet") + " ";
    } else if (w.GetProjectile() == ProjectileType.PNEUMATIC) {
        name += lu("Weapon Tag Pneumatic") + " ";
    }

    name += wlist[w.GetWeaponSelected()].abrv;
    return name;
}

export function WeaponTags(w: WeaponSystem) {
    const tags = [lu("Weapon Tag Jam", w.GetJam())];
    const fweap = w.GetFinalWeapon();

    if (w.GetReload() > 0) {
        if (w.GetReload() == 1) {
            tags.push(lu("Weapon Tag Manual"));
        } else {
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
    } else if (w.GetIsPartlyAccessible()) {
        tags.push(lu("Weapon Tag Partly Accessible"));
    } else {
        tags.push(lu("Weapon Tag Inaccessible"));
    }

    if (fweap.deflection) {
        tags.push(lu("Weapon Tag Awkward", fweap.deflection));
    }
    return tags;
}

export function WeaponString(w: WeaponSystem,
    wlist: {
        name: string,
        abrv: string, era: string,
        size: number, stats: Stats,
        damage: number, hits: number,
        ammo: number, ap: number,
        jam: string, reload: number,
        rapid: boolean, synched: boolean,
        shells: boolean, can_action: boolean,
        can_projectile: boolean, deflection: number,
    }[],
    dlist: string[]) {

    var wstring = "";
    const ds = w.GetDirection();
    const dirs = [];
    for (let i = 0; i < dlist.length; i++) {
        if (ds[i])
            dirs.push(lu(dlist[i]));
    }
    const hits = w.GetHits();
    const tags = WeaponTags(w);

    if (w.GetProjectile() == ProjectileType.HEATRAY) {
        const chgs = w.GetHRCharges();
        wstring += lu("Weapon Description Heat Ray",
            lu("Seat #", w.GetSeat() + 1),
            w.GetWeaponCount(),
            WeaponName(w, wlist),
            StringFmt.Join(" ", dirs),
            wlist[w.GetWeaponSelected()].damage,
            StringFmt.Join("/", hits),
            StringFmt.Join("/", chgs),
            StringFmt.Join(", ", tags)
        );
    } else {
        wstring += lu("Weapon Description",
            lu("Seat #", w.GetSeat() + 1),
            w.GetWeaponCount(),
            WeaponName(w, wlist),
            StringFmt.Join(" ", dirs),
            wlist[w.GetWeaponSelected()].damage,
            StringFmt.Join("/", hits),
            w.GetShots(),
            StringFmt.Join(", ", tags)
        );
    }

    return wstring;
}
