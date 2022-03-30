import { Frames } from "../impl/Frames";
import { lu } from "../impl/Localization";
import { insertRow, CreateCheckbox, CreateTH, BlinkIfChanged } from "./Tools";

export class Frames_HTML extends Display {
    private frames: Frames;
    private c_frame: HTMLTableCellElement;
    private c_skin: HTMLTableCellElement;
    private c_options: HTMLTableCellElement;
    private c_stats: HTMLTableCellElement;

    private all_frame: HTMLSelectElement;
    private all_skin: HTMLSelectElement;

    private t_frame: HTMLTableCellElement;
    private t_skin: HTMLTableCellElement;
    private t_options: HTMLTableCellElement;

    private t_select: HTMLSelectElement;
    private t_farman: HTMLInputElement;
    private t_boom: HTMLInputElement;
    private t_fwing: HTMLInputElement;

    private c_sec: {
        fspan: HTMLSpanElement,
        rem: HTMLButtonElement, add: HTMLButtonElement, fsel: HTMLSelectElement,
        sspan: HTMLSpanElement, ssel: HTMLLabelElement,
        ospan: HTMLSpanElement, geo: HTMLInputElement,
        mono: HTMLInputElement, int: HTMLInputElement, lb: HTMLInputElement
    }[];
    private t_sec: {
        fspan: HTMLSpanElement, fsel: HTMLSelectElement,
        sspan: HTMLSpanElement, ssel: HTMLLabelElement,
        ospan: HTMLSpanElement,
        geo: HTMLInputElement, mono: HTMLInputElement, lb: HTMLInputElement
    }[];

    //Display Stat Elements
    private d_mass: HTMLTableCellElement;
    private d_drag: HTMLTableCellElement;
    private d_cost: HTMLTableCellElement;
    private d_strc: HTMLTableCellElement;
    private d_tugh: HTMLTableCellElement;
    private d_visi: HTMLTableCellElement;
    private d_area: HTMLTableCellElement;
    private d_flammable: HTMLTableCellElement;
    private d_pstb: HTMLTableCellElement;
    private d_strn: HTMLTableCellElement;
    private d_lift: HTMLTableCellElement;

    //Updates faster?
    private table: HTMLTableElement;

    constructor(frames: Frames) {
        super();
        this.c_sec = [];
        this.t_sec = [];
        this.frames = frames;

        //Translate Section title
        (document.getElementById("lbl_frames") as HTMLLabelElement).textContent = lu("Frames Frames and Covering");

        this.table = document.getElementById("table_frames") as HTMLTableElement;
        var fragment = document.createDocumentFragment();
        var row = insertRow(fragment);
        this.all_frame = document.createElement("SELECT") as HTMLSelectElement;
        this.all_skin = document.createElement("SELECT") as HTMLSelectElement;
        CreateTH(row, lu("Frames Frame Type")).append(document.createElement("BR"), this.all_frame);
        CreateTH(row, lu("Frames Skin Type")).append(document.createElement("BR"), this.all_skin);
        CreateTH(row, lu("Frames Frame Options"));
        CreateTH(row, lu("Frames Frame Stats"));
        row = insertRow(fragment);
        this.c_frame = row.insertCell();
        this.c_skin = row.insertCell();
        this.c_options = row.insertCell();
        this.c_stats = row.insertCell();

        this.c_stats.className = "inner_table";
        this.c_stats.rowSpan = 0;
        var tbl = document.createElement("TABLE") as HTMLTableElement;
        tbl.className = "inner_table";
        var h1_row = tbl.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        var c1_row = tbl.insertRow();
        this.d_mass = c1_row.insertCell();
        this.d_drag = c1_row.insertCell();
        this.d_cost = c1_row.insertCell();
        var h2_row = tbl.insertRow();
        CreateTH(h2_row, lu("Stat Structure"));
        CreateTH(h2_row, lu("Stat Toughness"));
        CreateTH(h2_row, lu("Stat Visibility"));
        var c2_row = tbl.insertRow();
        this.d_strc = c2_row.insertCell();
        this.d_tugh = c2_row.insertCell();
        this.d_visi = c2_row.insertCell();
        var h3_row = tbl.insertRow();
        CreateTH(h3_row, lu("Stat Wing Area"));
        CreateTH(h3_row, lu("Derived Is Flammable Question"));
        CreateTH(h3_row, lu("Stat Pitch Stability"));
        var c3_row = tbl.insertRow();
        this.d_area = c3_row.insertCell();
        this.d_flammable = c3_row.insertCell();
        this.d_pstb = c3_row.insertCell();
        var h4_row = tbl.insertRow();
        CreateTH(h4_row, lu("Stat Raw Strain"));
        CreateTH(h4_row, lu("Stat Lift Bleed"));
        CreateTH(h4_row, "");
        var c4_row = tbl.insertRow();
        this.d_strn = c4_row.insertCell();
        this.d_lift = c4_row.insertCell();
        c4_row.insertCell();


        this.c_stats.appendChild(tbl);

        var row3 = insertRow(fragment);
        CreateTH(row3, lu("Frames Tail Frame Type"));
        CreateTH(row3, lu("Frames Tail Skin Type"));
        CreateTH(row3, lu("Frames Tail Frame Options"));

        var row4 = insertRow(fragment);
        this.t_frame = row4.insertCell();
        this.t_skin = row4.insertCell();
        this.t_options = row4.insertCell();

        (document.getElementById("lbl_tail") as HTMLLabelElement).textContent = lu("Frames Tail Section Title");

        (document.getElementById("lbl_tail_type") as HTMLLabelElement).textContent = lu("Frames Tail Type");
        this.t_select = document.getElementById("tail_type") as HTMLSelectElement;
        (document.getElementById("lbl_tail_farman") as HTMLLabelElement).textContent = lu("Frames Tail Farman");
        this.t_farman = document.getElementById("tail_farman") as HTMLInputElement;
        (document.getElementById("lbl_tail_boom") as HTMLLabelElement).textContent = lu("Frames Tail Boom");
        this.t_boom = document.getElementById("tail_boom") as HTMLInputElement;
        (document.getElementById("lbl_flying_wing") as HTMLLabelElement).textContent = lu("Frames Flying Wing")
        this.t_fwing = document.getElementById("flying_wing") as HTMLInputElement;

        var spar_list = this.frames.GetFrameList();
        for (let spar of spar_list) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(spar.name);
            if (spar.basestruct <= 0) {
                opt.disabled = true;
            }
            this.all_frame.add(opt);
        }
        this.all_frame.onchange = () => { this.frames.SetAllFrame(this.all_frame.selectedIndex); };
        var skin_list = this.frames.GetSkinList();
        for (let skin of skin_list) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(skin.name);
            this.all_skin.add(opt);
        }
        this.all_skin.onchange = () => { this.frames.SetAllSkin(this.all_skin.selectedIndex); };


        for (let elem of this.frames.GetTailList()) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(elem.name);
            this.t_select.add(opt);
        }

        this.t_select.onchange = () => { this.frames.SetTailType(this.t_select.selectedIndex); };
        this.t_farman.onchange = () => { this.frames.SetUseFarman(this.t_farman.checked); };
        this.t_boom.onchange = () => { this.frames.SetUseBoom(this.t_boom.checked); };
        this.t_fwing.onchange = () => { this.frames.SetFlyingWing(this.t_fwing.checked); };

        this.table.appendChild(fragment);
    }

    public UpdateDisplay() {
        var fragment = document.createDocumentFragment();
        while (this.table.children.length) {
            fragment.append(this.table.children[0]);
        }
        var section_list = this.frames.GetSectionList();
        var tail_section_list = this.frames.GetTailSectionList();

        while (section_list.length > this.c_sec.length) {
            let i = this.c_sec.length;
            this.CreateSection(i, section_list[i]);
        }
        while (section_list.length < this.c_sec.length) {
            this.RemoveSection();
        }

        while (tail_section_list.length > this.t_sec.length) {
            let i = this.t_sec.length;
            this.CreateTailSection(i, tail_section_list[i]);
        }
        while (tail_section_list.length < this.t_sec.length) {
            this.RemoveTailSection();
        }

        var skin_list = this.frames.GetSkinList();
        var is_flammable = skin_list[this.frames.GetSkin()].flammable;
        for (let i = 0; i < section_list.length; i++) {
            let sec = section_list[i];
            this.UpdateSection(i, sec);
        }

        this.t_select.selectedIndex = this.frames.GetTailType();
        this.t_farman.disabled = this.frames.GetUseBoom() || this.frames.GetIsTailless();
        this.t_farman.checked = this.frames.GetUseFarman();
        this.t_boom.disabled = this.frames.GetUseFarman() || this.frames.GetIsTailless();
        this.t_boom.checked = this.frames.GetUseBoom();
        this.t_fwing.disabled = !this.frames.CanFlyingWing();
        this.t_fwing.checked = this.frames.GetFlyingWing();
        this.all_frame.selectedIndex = -1;
        this.all_skin.selectedIndex = this.frames.GetSkin();

        for (let i = 0; i < tail_section_list.length; i++) {
            let sec = tail_section_list[i];
            this.UpdateTailSection(i, sec);
        }

        if (is_flammable)
            BlinkIfChanged(this.d_flammable, lu("Yes"));
        else
            BlinkIfChanged(this.d_flammable, lu("No"));

        var stats = this.frames.PartStats();
        BlinkIfChanged(this.d_mass, stats.mass.toString(), false);
        BlinkIfChanged(this.d_drag, stats.drag.toString(), false);
        BlinkIfChanged(this.d_cost, stats.cost.toString(), false);
        BlinkIfChanged(this.d_strc, stats.structure.toString(), true);
        BlinkIfChanged(this.d_tugh, stats.toughness.toString(), true);
        BlinkIfChanged(this.d_visi, stats.visibility.toString(), true);
        BlinkIfChanged(this.d_area, stats.wingarea.toString(), true);
        BlinkIfChanged(this.d_pstb, stats.pitchstab.toString(), true);
        BlinkIfChanged(this.d_strn, stats.maxstrain.toString(), true);
        BlinkIfChanged(this.d_lift, stats.liftbleed.toString(), false);
        this.table.appendChild(fragment);
    }

    private CreateSection(i: number, sec: {
        frame: number, geodesic: boolean,
        monocoque: boolean, lifting_body: boolean, internal_bracing: boolean,
    }) {
        var fsec = {
            fspan: document.createElement("SPAN") as HTMLSpanElement,
            rem: document.createElement("BUTTON") as HTMLButtonElement,
            add: document.createElement("BUTTON") as HTMLButtonElement,
            fsel: document.createElement("SELECT") as HTMLSelectElement,
            sspan: document.createElement("SPAN") as HTMLSpanElement,
            ssel: document.createElement("LABEL") as HTMLLabelElement,
            ospan: document.createElement("SPAN") as HTMLSpanElement,
            geo: document.createElement("INPUT") as HTMLInputElement,
            mono: document.createElement("INPUT") as HTMLInputElement,
            int: document.createElement("INPUT") as HTMLInputElement,
            lb: document.createElement("INPUT") as HTMLInputElement,
        };
        fsec.rem.textContent = "-";
        fsec.rem.onclick = () => { this.frames.DeleteSection(i); };
        fsec.add.textContent = "+";
        fsec.add.onclick = () => { this.frames.DuplicateSection(i); };

        var frame_list = this.frames.GetFrameList();
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(ft.name);
            fsec.fsel.add(opt);
        }
        fsec.fsel.onchange = () => { this.frames.SetFrame(i, fsec.fsel.selectedIndex); };

        fsec.fspan.appendChild(fsec.rem);
        fsec.fspan.appendChild(fsec.add);
        fsec.fspan.appendChild(fsec.fsel);
        fsec.fspan.appendChild(document.createElement("BR"));
        this.c_frame.appendChild(fsec.fspan);

        fsec.sspan.appendChild(fsec.ssel);
        fsec.sspan.appendChild(document.createElement("BR"));
        this.c_skin.appendChild(fsec.sspan);

        CreateCheckbox(lu("Frames Geodesic"), fsec.geo, fsec.ospan, false);
        fsec.geo.onchange = () => { this.frames.SetGeodesic(i, fsec.geo.checked); };
        CreateCheckbox(lu("Frames Monocoque"), fsec.mono, fsec.ospan, false);
        fsec.mono.onchange = () => { this.frames.SetMonocoque(i, fsec.mono.checked); };
        CreateCheckbox(lu("Frames Internal Bracing"), fsec.int, fsec.ospan, false);
        fsec.int.onchange = () => { this.frames.SetInternalBracing(i, fsec.int.checked); };
        CreateCheckbox(lu("Frames Lifting Body"), fsec.lb, fsec.ospan, true);
        fsec.lb.onchange = () => { this.frames.SetLiftingBody(i, fsec.lb.checked); };
        this.c_options.appendChild(fsec.ospan);

        this.c_sec.push(fsec);
        this.UpdateSection(i, sec);
    }

    private RemoveSection() {
        var sec = this.c_sec.pop();
        this.c_frame.removeChild(sec.fspan);
        this.c_skin.removeChild(sec.sspan);
        this.c_options.removeChild(sec.ospan);
    }

    private UpdateSection(i: number, sec: {
        frame: number, geodesic: boolean,
        monocoque: boolean, lifting_body: boolean, internal_bracing: boolean,
    }) {
        var fsec = this.c_sec[i];

        fsec.rem.disabled = !sec.internal_bracing && !this.frames.PossibleRemoveSections();
        fsec.add.disabled = sec.internal_bracing && !this.frames.PossibleInternalBracing();

        var frame_list = this.frames.GetFrameList();
        for (let j = 0; j < frame_list.length; j++) {
            let ft = frame_list[j];
            let opt = fsec.fsel.options[j];
            opt.text = lu(ft.name);
            opt.disabled = false;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
        }

        fsec.fsel.selectedIndex = sec.frame;

        if (sec.internal_bracing) {
            fsec.ssel.textContent = lu("Frames No Skin");
        } else {
            var skin_list = this.frames.GetSkinList();
            fsec.ssel.textContent = lu(skin_list[this.frames.GetSkin()].name);
        }

        fsec.geo.checked = sec.geodesic;
        fsec.geo.disabled = !this.frames.PossibleGeodesic(i);

        fsec.mono.checked = sec.monocoque;
        fsec.mono.disabled = !this.frames.PossibleMonocoque(i);

        fsec.int.checked = sec.internal_bracing;
        if (!sec.internal_bracing && (!this.frames.PossibleInternalBracing(true) || !this.frames.PossibleRemoveSections()))
            fsec.int.disabled = true;
        else
            fsec.int.disabled = false;

        fsec.lb.checked = sec.lifting_body;
        fsec.lb.disabled = !this.frames.PossibleLiftingBody(i);
    }

    private CreateTailSection(i: number, sec: {
        frame: number, geodesic: boolean,
        monocoque: boolean, lifting_body: boolean, internal_bracing: boolean,
    }) {
        var tsec = {
            fspan: document.createElement("SPAN") as HTMLSpanElement,
            fsel: document.createElement("SELECT") as HTMLSelectElement,
            sspan: document.createElement("SPAN") as HTMLSpanElement,
            ssel: document.createElement("LABEL") as HTMLLabelElement,
            ospan: document.createElement("SPAN") as HTMLSpanElement,
            geo: document.createElement("INPUT") as HTMLInputElement,
            mono: document.createElement("INPUT") as HTMLInputElement,
            lb: document.createElement("INPUT") as HTMLInputElement,
        };

        var frame_list = this.frames.GetFrameList();
        for (let ft of frame_list) {
            let opt = document.createElement("OPTION") as HTMLOptionElement;
            opt.text = lu(ft.name);
            tsec.fsel.add(opt);
        }
        tsec.fsel.onchange = () => { this.frames.SetTailFrame(i, tsec.fsel.selectedIndex); };

        tsec.fspan.appendChild(tsec.fsel);
        tsec.fspan.appendChild(document.createElement("BR"));
        this.t_frame.appendChild(tsec.fspan);

        tsec.sspan.appendChild(tsec.ssel);
        tsec.sspan.appendChild(document.createElement("BR"));
        this.t_skin.appendChild(tsec.sspan);

        CreateCheckbox(lu("Frames Geodesic"), tsec.geo, tsec.ospan, false);
        tsec.geo.onchange = () => { this.frames.SetTailGeodesic(i, tsec.geo.checked); };
        CreateCheckbox(lu("Frames Monocoque"), tsec.mono, tsec.ospan, false);
        tsec.mono.onchange = () => { this.frames.SetTailMonocoque(i, tsec.mono.checked); };
        CreateCheckbox(lu("Frames Lifting Body"), tsec.lb, tsec.ospan, true);
        tsec.lb.onchange = () => { this.frames.SetTailLiftingBody(i, tsec.lb.checked); };
        this.t_options.appendChild(tsec.ospan);

        this.t_sec.push(tsec);
        this.UpdateTailSection(i, sec);
    }

    private RemoveTailSection() {
        var sec = this.t_sec.pop();
        this.t_frame.removeChild(sec.fspan);
        this.t_skin.removeChild(sec.sspan);
        this.t_options.removeChild(sec.ospan);
    }

    private UpdateTailSection(i: number, sec: {
        frame: number, geodesic: boolean,
        monocoque: boolean, lifting_body: boolean, internal_bracing: boolean,
    }) {
        var tsec = this.t_sec[i];

        var frame_list = this.frames.GetFrameList();
        for (let j = 0; j < frame_list.length; j++) {
            let ft = frame_list[j];
            let opt = tsec.fsel.options[j];
            opt.text = lu(ft.name);
            opt.disabled = false;
            if (sec.geodesic && !ft.geodesic)
                opt.disabled = true;
            if (!sec.internal_bracing && ft.basestruct == 0)
                opt.disabled = true;
        }

        tsec.fsel.selectedIndex = sec.frame;

        var skin_list = this.frames.GetSkinList();
        var idx = this.frames.GetSkin();
        if (this.frames.GetUseFarman())
            idx = 0;
        tsec.ssel.textContent = lu(skin_list[idx].name);

        tsec.geo.checked = sec.geodesic;
        tsec.geo.disabled = !this.frames.PossibleTailGeodesic(i);

        tsec.mono.checked = sec.monocoque;
        tsec.mono.disabled = !this.frames.PossibleTailMonocoque(i);

        tsec.lb.checked = sec.lifting_body;
        tsec.lb.disabled = !this.frames.PossibleTailLiftingBody(i);
    }
}