import { Wings, WingType } from "../impl/Wings.js";
import { lu } from "../impl/Localization.js";
import { insertRow, CreateCheckbox, CreateInput, CreateTH, BlinkIfChanged } from "./Tools.js";
import { Display } from "./Display.js";

type WingHTMLType = {
    span: HTMLSpanElement,
    deck: HTMLSelectElement, skin: HTMLSelectElement,
    area: HTMLInputElement, wspan: HTMLInputElement,
    gull: HTMLInputElement, dihedral: HTMLInputElement,
    anhedral: HTMLInputElement, br: HTMLBRElement
};
export class Wings_HTML extends Display {
    private wings: Wings;
    private stagger: HTMLSelectElement;
    private closed: HTMLInputElement;
    private swept: HTMLInputElement;
    private full_cell: HTMLTableCellElement;
    private mini_cell: HTMLTableCellElement;

    private fw_list: WingHTMLType[];
    private mw_list: WingHTMLType[];
    private fw_add: HTMLSelectElement;
    private mw_add: HTMLSelectElement;

    //Display Stat Elements
    private d_area: HTMLTableCellElement;
    private d_mass: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;
    private d_cont: HTMLTableCellElement;
    private d_pstb: HTMLTableCellElement;
    private d_lstb: HTMLTableCellElement;
    private d_maxs: HTMLTableCellElement;
    private d_lift: HTMLTableCellElement;
    private d_sesq: HTMLTableCellElement;
    private d_crsh: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_visi: HTMLTableCellElement;
    private d_flam: HTMLTableCellElement;
    private d_chrg: HTMLTableCellElement;

    constructor(w: Wings) {
        super();
        this.wings = w;
        this.fw_list = [];
        this.mw_list = [];

        (document.getElementById("lbl_wings") as HTMLLabelElement).textContent = lu("Wings Section Title");

        (document.getElementById("lbl_wing_stagger") as HTMLLabelElement).textContent = lu("Wings Wing Stagger");
        this.stagger = document.getElementById("wing_stagger") as HTMLSelectElement;
        (document.getElementById("lbl_wing_closed") as HTMLLabelElement).textContent = lu("Wings Closed Wing");
        this.closed = document.getElementById("wing_closed") as HTMLInputElement;
        (document.getElementById("lbl_wing_swept") as HTMLLabelElement).textContent = lu("Wings Swept Wing");
        this.swept = document.getElementById("wing_swept") as HTMLInputElement;

        for (let s of w.GetStaggerList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(s.name);
            this.stagger.append(opt);
        }

        this.stagger.onchange = () => { this.wings.SetStagger(this.stagger.selectedIndex); };
        this.closed.onchange = () => { this.wings.SetClosed(this.closed.checked); };
        this.swept.onchange = () => { this.wings.SetSwept(this.swept.checked); };

        const tbl = document.getElementById("wing_table") as HTMLTableElement;
        const fragment = document.createDocumentFragment();
        const row = insertRow(fragment);
        CreateTH(row, lu("Wings Wing Type"));
        CreateTH(row, lu("Wings Wing Options"));
        CreateTH(row, lu("Wings Wing Stats"));

        const full_row = insertRow(fragment);
        CreateTH(full_row, lu("Wings Full Wings"));
        const mini_row = insertRow(fragment);
        CreateTH(mini_row, lu("Wings Miniature Wings"));

        this.full_cell = full_row.insertCell();
        this.mini_cell = mini_row.insertCell();
        const stat_cell = full_row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
        tbl.appendChild(fragment);
    }

    private InitStatDisplay(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        const tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        const h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, lu("Stat Wing Area"));
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        const c1_row = tbl_stat.insertRow();
        this.d_area = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        const h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, lu("Stat Control"));
        CreateTH(h2_row, lu("Stat Pitch Stability"));
        CreateTH(h2_row, lu("Stat Lateral Stability"));
        const c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        const h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, lu("Stat Raw Strain"));
        CreateTH(h3_row, lu("Stat Crash Safety"));
        CreateTH(h3_row, lu("Stat Lift Bleed"));
        const c3_row = tbl_stat.insertRow();
        this.d_maxs = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_lift = c3_row.insertCell();
        const h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, lu("Stat Cost"));
        CreateTH(h4_row, lu("Stat Visibility"));
        CreateTH(h4_row, lu("Stat Charge"));
        const c4_row = tbl_stat.insertRow();
        this.d_cost = c4_row.insertCell();
        this.d_visi = c4_row.insertCell();
        this.d_chrg = c4_row.insertCell();
        const h5_row = tbl_stat.insertRow();
        CreateTH(h5_row, "");
        CreateTH(h5_row, lu("Wings Sesquiplane"));
        CreateTH(h5_row, lu("Derived Is Flammable Question"));
        const c5_row = tbl_stat.insertRow();
        c5_row.insertCell();
        this.d_sesq = c5_row.insertCell();
        this.d_flam = c5_row.insertCell();
    }

    public UpdateDisplay() {
        const cans = this.wings.CanStagger();
        for (let i = 0; i < cans.length; i++) {
            this.stagger.options[i].disabled = !cans[i];
        }
        this.stagger.selectedIndex = this.wings.GetStagger();
        this.closed.checked = this.wings.GetClosed();
        this.closed.disabled = !this.wings.CanClosed();
        this.swept.checked = this.wings.GetSwept();
        this.swept.disabled = !this.wings.CanSwept();

        if (this.fw_add)
            this.full_cell.removeChild(this.fw_add);
        if (this.mw_add)
            this.mini_cell.removeChild(this.mw_add);

        const wl = this.wings.GetWingList();
        for (let i = 0; i < wl.length; i++) {
            if (this.fw_list.length == i)
                this.AddFullWing();
            this.UpdateFullWing(this.fw_list[i], i, wl[i]);
        }
        while (this.fw_list.length > wl.length) {
            this.PopFullWing();
        }

        const mwl = this.wings.GetMiniWingList();
        for (let i = 0; i < mwl.length; i++) {
            if (this.mw_list.length == i)
                this.AddMiniWing();
            this.UpdateMiniWing(this.mw_list[i], i, mwl[i]);
        }
        while (this.mw_list.length > mwl.length) {
            this.PopMiniWing();
        }

        this.CreateFWAdd(wl.length);
        this.CreateMWAdd(mwl.length);

        const stats = this.wings.PartStats();
        BlinkIfChanged(this.d_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_mass, (stats.mass + this.wings.GetPaperMass()).toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_chrg, stats.charge.toString(), true);
        if (this.wings.GetIsSesquiplane().is)
            BlinkIfChanged(this.d_sesq, lu("Yes"));
        else
            BlinkIfChanged(this.d_sesq, lu("No"));

        if (this.wings.IsFlammable())
            BlinkIfChanged(this.d_flam, lu("Yes"));
        else
            BlinkIfChanged(this.d_flam, lu("No"));
    }

    private AddFullWing() {
        const wing = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            deck: document.createElement("SELECT") as HTMLSelectElement,
            skin: document.createElement("SELECT") as HTMLSelectElement,
            area: document.createElement("INPUT") as HTMLInputElement,
            wspan: document.createElement("INPUT") as HTMLInputElement,
            gull: document.createElement("INPUT") as HTMLInputElement,
            dihedral: document.createElement("INPUT") as HTMLInputElement,
            anhedral: document.createElement("INPUT") as HTMLInputElement,
            br: document.createElement("BR") as HTMLBRElement
        }
        wing.span.appendChild(wing.deck);
        const dlist = this.wings.GetDeckList();
        const none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = lu("Wings No Wing");
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(d.name);
            wing.deck.append(opt);
        }

        wing.span.appendChild(wing.skin);
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(s.name);
            wing.skin.append(opt);
        }

        CreateInput(lu("Wings Area"), wing.area, wing.span, false);
        wing.area.min = "3";

        CreateInput(lu("Wings Span"), wing.wspan, wing.span, false);
        wing.wspan.min = "1";

        CreateCheckbox(lu("Wings Gull"), wing.gull, wing.span, false);

        CreateInput(lu("Wings Dihedral"), wing.dihedral, wing.span, false);
        wing.dihedral.min = "0";

        CreateInput(lu("Wings Anhedral"), wing.anhedral, wing.span, false);
        wing.anhedral.min = "0";

        this.full_cell.appendChild(wing.span);
        this.full_cell.appendChild(wing.br);
        this.fw_list.push(wing);
    }

    private PopFullWing() {
        const wing = this.fw_list.pop();
        this.full_cell.removeChild(wing.span);
        this.full_cell.removeChild(wing.br);
    }

    private UpdateFullWing(ht: WingHTMLType, idx: number, wing: WingType) {
        for (let i = 1; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != (i - 1) && !this.wings.CanAddFullWing(i - 1) && !this.wings.CanMoveFullWing(idx, i - 1))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.onchange = () => {
            let w = { ...wing };
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetFullWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;

        ht.skin.onchange = () => {
            let w = { ...wing };
            w.surface = ht.skin.selectedIndex;
            this.wings.SetFullWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;

        ht.area.onchange = () => {
            let w = { ...wing };
            w.area = ht.area.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;

        ht.wspan.onchange = () => {
            let w = { ...wing };
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;

        ht.gull.onchange = () => {
            let w = { ...wing };
            w.gull = ht.gull.checked;
            this.wings.SetFullWing(idx, w);
        };
        ht.gull.checked = wing.gull;
        ht.gull.disabled = !this.wings.CanGull(wing.deck);

        ht.dihedral.onchange = () => {
            let w = { ...wing };
            w.dihedral = ht.dihedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.dihedral.max = (wing.span - wing.anhedral - 1).toString();
        ht.dihedral.valueAsNumber = wing.dihedral;

        ht.anhedral.onchange = () => {
            let w = { ...wing };
            w.anhedral = ht.anhedral.valueAsNumber;
            this.wings.SetFullWing(idx, w);
        };
        ht.anhedral.max = (wing.span - wing.dihedral - 1).toString();
        ht.anhedral.valueAsNumber = wing.anhedral;
    }

    private AddMiniWing() {
        const wing = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            deck: document.createElement("SELECT") as HTMLSelectElement,
            skin: document.createElement("SELECT") as HTMLSelectElement,
            area: document.createElement("INPUT") as HTMLInputElement,
            wspan: document.createElement("INPUT") as HTMLInputElement,
            gull: undefined,
            dihedral: undefined,
            anhedral: undefined,
            br: document.createElement("BR") as HTMLBRElement
        }
        wing.span.appendChild(wing.deck);
        const dlist = this.wings.GetDeckList();
        const none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = lu("Wings No Wing");
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(d.name);
            wing.deck.append(opt);
        }

        wing.span.appendChild(wing.skin);
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(s.name);
            wing.skin.append(opt);
        }

        CreateInput(lu("Wings Area"), wing.area, wing.span, false);
        wing.area.min = "1";
        wing.area.max = "2";

        CreateInput(lu("Wings Span"), wing.wspan, wing.span, false);
        wing.wspan.min = "1";

        this.mini_cell.appendChild(wing.span);
        this.mini_cell.appendChild(wing.br);
        this.mw_list.push(wing);
    }

    private UpdateMiniWing(ht: WingHTMLType, idx: number, wing: WingType) {
        for (let i = 1; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != i && !this.wings.CanAddMiniWing(i - 1) && !this.wings.CanMoveMiniWing(idx, i - 1))
                opt.disabled = true;
            else
                opt.disabled = false;
        }
        ht.deck.onchange = () => {
            let w = { ...wing };
            w.deck = ht.deck.selectedIndex - 1;
            this.wings.SetMiniWing(idx, w);
        };
        ht.deck.selectedIndex = wing.deck + 1;

        ht.skin.onchange = () => {
            let w = { ...wing };
            w.surface = ht.skin.selectedIndex;
            this.wings.SetMiniWing(idx, w);
        };
        ht.skin.selectedIndex = wing.surface;

        ht.area.onchange = () => {
            let w = { ...wing };
            w.area = ht.area.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.area.valueAsNumber = wing.area;

        ht.wspan.onchange = () => {
            let w = { ...wing };
            w.span = ht.wspan.valueAsNumber;
            this.wings.SetMiniWing(idx, w);
        };
        ht.wspan.valueAsNumber = wing.span;
    }

    private PopMiniWing() {
        const wing = this.mw_list.pop();
        this.mini_cell.removeChild(wing.span);
        this.mini_cell.removeChild(wing.br);
    }

    private CreateFWAdd(idx: number) {
        this.fw_add = document.createElement("SELECT") as HTMLSelectElement;
        const dlist = this.wings.GetDeckList();
        const none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = lu("Wings No Wing");
        this.fw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(d.name);
            if (!this.wings.CanAddFullWing(i)) {
                opt.disabled = true;
            } else {
                can = true;
            }
            this.fw_add.append(opt);
        }
        this.fw_add.onchange = () => {
            let w = { surface: 0, area: 10, span: 5, gull: false, dihedral: 0, anhedral: 0, deck: this.fw_add.selectedIndex - 1 };
            this.wings.SetFullWing(idx, w);
        };
        this.fw_add.selectedIndex = 0;
        this.fw_add.disabled = !can;
        this.full_cell.appendChild(this.fw_add);
    }

    private CreateMWAdd(idx: number) {
        this.mw_add = document.createElement("SELECT") as HTMLSelectElement;
        const dlist = this.wings.GetDeckList();
        const none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = lu("Wings No Wing");
        this.mw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = lu(d.name);
            if (!this.wings.CanAddMiniWing(i)) {
                opt.disabled = true;
            } else {
                can = true;
            }
            this.mw_add.append(opt);
        }
        this.mw_add.onchange = () => {
            let w = { surface: 0, area: 2, span: 2, gull: false, dihedral: 0, anhedral: 0, deck: this.mw_add.selectedIndex - 1 };
            this.wings.SetMiniWing(idx, w);
        };
        this.mw_add.selectedIndex = 0;
        this.mw_add.disabled = !can;
        this.mini_cell.appendChild(this.mw_add);
    }

}