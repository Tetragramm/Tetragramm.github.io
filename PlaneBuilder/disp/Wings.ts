/// <reference path="./Display.ts" />
/// <reference path="../impl/Wings.ts" />

type WingHTMLType = {
    span: HTMLSpanElement,
    deck: HTMLSelectElement, skin: HTMLSelectElement,
    area: HTMLInputElement, wspan: HTMLInputElement,
    dihedral: HTMLInputElement, anhedral: HTMLInputElement,
    br: HTMLBRElement
};
class Wings_HTML extends Display {
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
    private d_chrg: HTMLTableCellElement;
    private d_crsh: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_flam: HTMLTableCellElement;

    constructor(w: Wings) {
        super();
        this.wings = w;
        this.fw_list = [];
        this.mw_list = [];

        this.stagger = document.getElementById("wing_stagger") as HTMLSelectElement;
        this.closed = document.getElementById("wing_closed") as HTMLInputElement;
        this.swept = document.getElementById("wing_swept") as HTMLInputElement;

        for (let s of w.GetStaggerList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = s.name;
            this.stagger.append(opt);
        }

        this.stagger.onchange = () => { this.wings.SetStagger(this.stagger.selectedIndex); };
        this.closed.onchange = () => { this.wings.SetClosed(this.closed.checked); };
        this.swept.onchange = () => { this.wings.SetSwept(this.swept.checked); };

        var tbl = document.getElementById("wing_table") as HTMLTableElement;
        var full_row = tbl.insertRow();
        var mini_row = tbl.insertRow();
        var full_type = document.createElement("TH") as HTMLTableHeaderCellElement;
        full_type.textContent = "Full Wings";
        full_row.appendChild(full_type);
        var mini_type = document.createElement("TH") as HTMLTableHeaderCellElement;
        mini_type.textContent = "Miniature Wings";
        mini_row.appendChild(mini_type);

        this.full_cell = full_row.insertCell();
        this.mini_cell = mini_row.insertCell();
        var stat_cell = full_row.insertCell();
        stat_cell.rowSpan = 0;
        this.InitStatDisplay(stat_cell);
    }

    private InitStatDisplay(stat_cell: HTMLTableCellElement) {
        stat_cell.className = "inner_table";
        var tbl_stat = document.createElement("TABLE") as HTMLTableElement;
        tbl_stat.className = "inner_table";
        stat_cell.appendChild(tbl_stat);
        var h1_row = tbl_stat.insertRow();
        CreateTH(h1_row, "Wing Area");
        CreateTH(h1_row, "Mass");
        CreateTH(h1_row, "Drag");
        var c1_row = tbl_stat.insertRow();
        this.d_area = c1_row.insertCell();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        var h2_row = tbl_stat.insertRow();
        CreateTH(h2_row, "Control");
        CreateTH(h2_row, "Pitch Stability");
        CreateTH(h2_row, "Lateral Stability");
        var c2_row = tbl_stat.insertRow();
        this.d_cont = c2_row.insertCell();
        this.d_pstb = c2_row.insertCell();
        this.d_lstb = c2_row.insertCell();
        var h3_row = tbl_stat.insertRow();
        CreateTH(h3_row, "Raw Strain");
        CreateTH(h3_row, "Crash Safety");
        CreateTH(h3_row, "Lift Bleed");
        var c3_row = tbl_stat.insertRow();
        this.d_maxs = c3_row.insertCell();
        this.d_crsh = c3_row.insertCell();
        this.d_lift = c3_row.insertCell();
        var h4_row = tbl_stat.insertRow();
        CreateTH(h4_row, "Cost");
        CreateTH(h4_row, "Charge");
        CreateTH(h4_row, "Flammable");
        var c4_row = tbl_stat.insertRow();
        this.d_cost = c4_row.insertCell();
        this.d_chrg = c4_row.insertCell();
        this.d_flam = c4_row.insertCell();
    }

    public UpdateDisplay() {
        var cans = this.wings.CanStagger();
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

        var wl = this.wings.GetWingList();
        for (let i = 0; i < wl.length; i++) {
            if (this.fw_list.length == i)
                this.AddFullWing();
            this.UpdateFullWing(this.fw_list[i], i, wl[i]);
        }
        while (this.fw_list.length > wl.length) {
            this.PopFullWing();
        }

        var mwl = this.wings.GetMiniWingList();
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

        var stats = this.wings.PartStats();
        BlinkIfChanged(this.d_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cont, stats.control.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_lstb, stats.latstab.toString(), true);
        BlinkIfChanged(this.d_maxs, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        BlinkIfChanged(this.d_chrg, "0", true);//stats.charge.toString(); //TODO: Charge
        BlinkIfChanged(this.d_crsh, stats.crashsafety.toString(), true);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        if (this.wings.IsFlammable())
            BlinkIfChanged(this.d_flam, "Yes");
        else
            BlinkIfChanged(this.d_flam, "No");
    }

    private AddFullWing() {
        var wing = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            deck: document.createElement("SELECT") as HTMLSelectElement,
            skin: document.createElement("SELECT") as HTMLSelectElement,
            area: document.createElement("INPUT") as HTMLInputElement,
            wspan: document.createElement("INPUT") as HTMLInputElement,
            dihedral: document.createElement("INPUT") as HTMLInputElement,
            anhedral: document.createElement("INPUT") as HTMLInputElement,
            br: document.createElement("BR") as HTMLBRElement
        }
        wing.span.appendChild(wing.deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = "None";
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = d.name;
            wing.deck.append(opt);
        }

        wing.span.appendChild(wing.skin);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = s.name;
            wing.skin.append(opt);
        }

        CreateInput(" Area ", wing.area, wing.span, false);
        wing.area.min = "3";

        CreateInput(" Span ", wing.wspan, wing.span, false);
        wing.wspan.min = "1";

        CreateInput(" Dihedral ", wing.dihedral, wing.span, false);
        wing.dihedral.min = "0";

        CreateInput(" Anhedral ", wing.anhedral, wing.span, false);
        wing.anhedral.min = "0";

        this.full_cell.appendChild(wing.span);
        this.full_cell.appendChild(wing.br);
        this.fw_list.push(wing);
    }

    private PopFullWing() {
        var wing = this.fw_list.pop();
        this.full_cell.removeChild(wing.span);
        this.full_cell.removeChild(wing.br);
    }

    private UpdateFullWing(ht: WingHTMLType, idx: number, wing: WingType) {
        for (let i = 1; i < ht.deck.options.length; i++) {
            let opt = ht.deck.options[i];
            if (wing.deck != i && !this.wings.CanAddFullWing(i - 1) && !this.wings.CanMoveFullWing(idx, i - 1))
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
        var wing = {
            span: document.createElement("SPAN") as HTMLSpanElement,
            deck: document.createElement("SELECT") as HTMLSelectElement,
            skin: document.createElement("SELECT") as HTMLSelectElement,
            area: document.createElement("INPUT") as HTMLInputElement,
            wspan: document.createElement("INPUT") as HTMLInputElement,
            dihedral: undefined,
            anhedral: undefined,
            br: document.createElement("BR") as HTMLBRElement
        }
        wing.span.appendChild(wing.deck);
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = "None";
        wing.deck.append(none_opt);
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = d.name;
            wing.deck.append(opt);
        }

        wing.span.appendChild(wing.skin);
        var slist = this.wings.GetSkinList();
        for (let s of this.wings.GetSkinList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = s.name;
            wing.skin.append(opt);
        }

        CreateInput(" Area ", wing.area, wing.span, false);
        wing.area.min = "1";
        wing.area.max = "2";

        CreateInput(" Span ", wing.wspan, wing.span, false);
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
        var wing = this.mw_list.pop();
        this.mini_cell.removeChild(wing.span);
        this.mini_cell.removeChild(wing.br);
    }

    private CreateFWAdd(idx: number) {
        this.fw_add = document.createElement("SELECT") as HTMLSelectElement;
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = "None";
        this.fw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = d.name;
            if (!this.wings.CanAddFullWing(i)) {
                opt.disabled = true;
            } else {
                can = true;
            }
            this.fw_add.append(opt);
        }
        this.fw_add.onchange = () => {
            let w = { surface: 0, area: 10, span: 5, dihedral: 0, anhedral: 0, deck: this.fw_add.selectedIndex - 1 };
            this.wings.SetFullWing(idx, w);
        };
        this.fw_add.selectedIndex = 0;
        this.fw_add.disabled = !can;
        this.full_cell.appendChild(this.fw_add);
    }

    private CreateMWAdd(idx: number) {
        this.mw_add = document.createElement("SELECT") as HTMLSelectElement;
        var dlist = this.wings.GetDeckList();
        var none_opt = document.createElement("OPTION") as HTMLOptionElement;
        none_opt.textContent = "None";
        this.mw_add.append(none_opt);
        var can = false;
        for (let i = 0; i < dlist.length; i++) {
            let d = dlist[i];
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.textContent = d.name;
            if (!this.wings.CanAddMiniWing(i)) {
                opt.disabled = true;
            } else {
                can = true;
            }
            this.mw_add.append(opt);
        }
        this.mw_add.onchange = () => {
            let w = { surface: 0, area: 2, span: 2, dihedral: 0, anhedral: 0, deck: this.mw_add.selectedIndex - 1 };
            this.wings.SetMiniWing(idx, w);
        };
        this.mw_add.selectedIndex = 0;
        this.mw_add.disabled = !can;
        this.mini_cell.appendChild(this.mw_add);
    }

}