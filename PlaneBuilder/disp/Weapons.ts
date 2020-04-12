/// <reference path="./Display.ts" />
/// <reference path="../impl/Weapons.ts" />

type WType = {};
type WStatType = { mass: HTMLTableCellElement, drag: HTMLTableCellElement, cost: HTMLTableCellElement, damg: HTMLTableCellElement };
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
            stats: { mass: null, drag: null, cost: null, damg: null },
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
        var c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        var h2_row = stable.insertRow();
        CreateTH(h2_row, "Cost");
        CreateTH(h2_row, "Damage");
        var c2_row = stable.insertRow();
        type.stats.cost = c2_row.insertCell();
        type.stats.damg = c2_row.insertCell();

        return type;
    }

    private UpdateWSet(set: WeaponSystem, disp: WSetType) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.oninput = () => { set.SetWeaponSelected(disp.type.selectedIndex); };

        disp.count.valueAsNumber = set.GetWeaponCount();
        disp.count.oninput = () => { set.SetWeaponCount(disp.count.valueAsNumber); };

        disp.fixed.checked = set.GetFixed();
        disp.fixed.oninput = () => { set.SetFixed(disp.fixed.checked); };

        var dirlist = set.GetDirection();
        for (let i = 0; i < dirlist.length; i++) {
            disp.dirs[i].checked = dirlist[i];
            disp.dirs[i].oninput = () => { set.SetDirection(i, disp.dirs[i].checked); };
        }

        var stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString());
        BlinkIfChanged(disp.stats.drag, stats.drag.toString());
        BlinkIfChanged(disp.stats.cost, stats.cost.toString());
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