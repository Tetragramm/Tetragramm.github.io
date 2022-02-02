/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Frames extends Part {
    private frame_list: {
        name: string, stats: Stats,
        basestruct: number, basecost: number,
        geodesic: boolean
    }[];
    private skin_list: {
        name: string, stats: Stats,
        monocoque: boolean, monocoque_structure: number,
        flammable: boolean, dragfactor: number, massfactor: number,
    }[];
    private section_list: {
        frame: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }[];
    private required_sections: number;

    private sel_skin: number;
    private tail_list: { name: string, stats: Stats }[];
    private sel_tail: number;
    private farman: boolean;
    private boom: boolean;
    private has_tractor_nacelles: boolean;
    private tail_section_list: {
        frame: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }[];

    private flying_wing: boolean;
    private is_tandem: boolean;

    constructor(js: JSON) {
        super();
        this.frame_list = [];
        for (let elem of js["frames"]) {
            this.frame_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                basestruct: elem["basestructure"],
                basecost: elem["basecost"],
                geodesic: elem["geodesic"]
            });
        }

        this.sel_skin = 0;
        this.skin_list = [];
        for (let elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"],
                dragfactor: elem["dragfactor"],
                massfactor: elem["massfactor"],
            });
        }

        this.farman = false;
        this.boom = false;
        this.has_tractor_nacelles = false;
        this.sel_tail = 2;
        this.tail_list = [];
        for (let elem of js["tail"]) {
            this.tail_list.push({
                name: elem["name"],
                stats: new Stats(elem)
            });
        }

        this.flying_wing = false;
        this.is_tandem = false;

        this.section_list = [];
        this.tail_section_list = [];
        this.SetRequiredSections(1);
    }

    public toJSON() {
        return {
            sections: this.section_list,
            tail_sections: this.tail_section_list,
            tail_index: this.sel_tail,
            use_farman: this.farman,
            use_boom: this.boom,
            flying_wing: this.flying_wing,
            sel_skin: this.sel_skin,
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.section_list = [];
        for (let elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }
        this.tail_section_list = [];
        for (let elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }

        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
        this.flying_wing = js["flying_wing"];
        if (json_version > 10.25)
            this.sel_skin = js["sel_skin"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.section_list.length);
        for (let i = 0; i < this.section_list.length; i++) {
            var sec = this.section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.tail_section_list.length);
        for (let i = 0; i < this.tail_section_list.length; i++) {
            var sec = this.tail_section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.sel_tail);
        s.PushBool(this.farman);
        s.PushBool(this.boom);
        s.PushBool(this.flying_wing);
        s.PushNum(this.sel_skin);
    }

    public deserialize(d: Deserialize) {
        var slen = d.GetNum();
        this.section_list = [];
        for (let i = 0; i < slen; i++) {
            let sec = {
                frame: 0, skin: 0, geodesic: false,
                monocoque: false, lifting_body: false, internal_bracing: false
            };
            sec.frame = d.GetNum();
            if (d.version < 10.25)
                this.sel_skin = d.GetNum();
            sec.geodesic = d.GetBool();
            sec.monocoque = d.GetBool();
            sec.lifting_body = d.GetBool();
            sec.internal_bracing = d.GetBool();
            this.section_list.push(sec);
        }
        var tlen = d.GetNum();
        this.tail_section_list = [];
        for (let i = 0; i < tlen; i++) {
            let sec = {
                frame: 0, skin: 0, geodesic: false,
                monocoque: false, lifting_body: false, internal_bracing: false
            };
            sec.frame = d.GetNum();
            if (d.version < 10.25)
                this.sel_skin = d.GetNum();
            sec.geodesic = d.GetBool();
            sec.monocoque = d.GetBool();
            sec.lifting_body = d.GetBool();
            sec.internal_bracing = d.GetBool();
            this.tail_section_list.push(sec);
        }
        this.sel_tail = d.GetNum();
        this.farman = d.GetBool();
        this.boom = d.GetBool();
        this.flying_wing = d.GetBool();
        if (d.version > 10.25)
            this.sel_skin = d.GetNum();
    }

    public DuplicateSection(num: number, count: number = 1) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() + this.tail_section_list.length == this.CountInternalBracing()) {
            return;
        }
        for (let i = 0; i < count; i++) {
            this.section_list.splice(num, 0, new_section);
        }
        this.CalculateStats();
    }

    private DuplicateTailSection(num: number, count: number = 1) {
        var sec = this.tail_section_list[num];
        var new_section = {
            frame: sec.frame, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.CountInternalBracing()) {
            return;
        }
        for (let i = 0; i < count; i++) {
            this.tail_section_list.splice(num, 0, new_section);
        }
        this.CalculateStats();
    }

    public DeleteSection(num: number) {
        if (this.required_sections == this.CountSections()
            && !this.section_list[num].internal_bracing)
            return;
        this.section_list.splice(num, 1);
        if (this.CountInternalBracing() > this.CountSections() + this.tail_section_list.length) {
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (this.section_list[i].internal_bracing) {
                    this.section_list.splice(i, 1);
                    break;
                }
            }
        }
        this.CalculateStats();
    }

    public SetRequiredSections(num: number) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            if (this.required_sections - this.CountSections() > 0) {
                for (let i = this.section_list.length - 1; i >= 0; i--) {
                    if (!this.section_list[i].internal_bracing) {
                        this.DuplicateSection(i, this.required_sections - this.CountSections());
                        return;
                    }
                }
            }
        }
    }

    public SetRequiredTailSections(num: number) {
        if (num > this.tail_section_list.length) {
            if (this.tail_section_list.length == 0) {
                this.tail_section_list.push({
                    frame: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            if (num - this.tail_section_list.length > 0)
                this.DuplicateTailSection(this.tail_section_list.length - 1, num - this.tail_section_list.length);
        }

        while (num < this.tail_section_list.length) {
            this.tail_section_list.pop();
        }

        while (this.CountSections() + num < this.CountInternalBracing()) {
            let idx = this.section_list.length - 1;
            for (; idx > 0; idx--) {
                if (this.section_list[idx].internal_bracing)
                    break;
            }
            this.DeleteSection(idx);
        }
        this.CalculateStats();
    }

    private CountSections() {
        var count = 0;
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                count++;
        }
        return count;
    }

    public GetNumFrames() {
        return this.CountSections() + this.tail_section_list.length;
    }

    private CountInternalBracing() {
        var count = 0;
        for (let elem of this.section_list) {
            if (elem.internal_bracing)
                count++;
        }
        return count;
    }

    private BaseType() {
        var hist = [...Array(this.frame_list.length).fill(0)];
        for (let elem of this.section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        for (let elem of this.tail_section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        var max_index = 0;
        var max = 0;
        for (let i = hist.length - 1; i >= 0; i--) {
            if (hist[i] > max) {
                max = hist[i];
                max_index = i;
            }
        }
        return max_index;
    }

    public GetFrameList() {
        return this.frame_list;
    }

    public GetSkinList() {
        return this.skin_list;
    }

    public GetSectionList() {
        return this.section_list;
    }

    public SetFrame(num: number, type: number) {
        this.section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }

    // public SetSkin(num: number, type: number) {
    //     this.section_list[num].skin = type;
    //     if (type != 0)
    //         this.section_list[num].internal_bracing = false;
    //     if (!this.skin_list[type].monocoque) {
    //         this.section_list[num].monocoque = false;
    //         this.section_list[num].lifting_body = false;
    //     }
    //     this.CalculateStats();
    // }

    public SetGeodesic(num: number, use: boolean) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }

    public SetMonocoque(num: number, use: boolean) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }

    public SetLiftingBody(num: number, use: boolean) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }

    public SetInternalBracing(num: number, use: boolean) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing(true)
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        } else if (!use) {// If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }

    public PossibleInternalBracing(convert_sec_to_brace: boolean = false) {
        var allowed = this.CountSections();
        if (!this.farman)
            allowed += this.tail_section_list.length;
        if (convert_sec_to_brace)
            allowed -= 1;
        return this.CountInternalBracing() + 1 <= allowed;
    }

    public PossibleGeodesic(num: number) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }

    public PossibleMonocoque(num: number) {
        return this.skin_list[this.sel_skin].monocoque && !this.section_list[num].internal_bracing;
    }

    public PossibleTailGeodesic(num: number) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }

    public PossibleTailMonocoque(num: number) {
        return this.skin_list[this.sel_skin].monocoque && !this.farman;
    }

    public PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }

    public GetFarmanOrBoom() {
        return this.farman || this.boom;
    }

    private SectionStats(sec: {
        frame: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }): Stats {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic) {
            stats.structure *= 1.5;
            stats.cost *= 2;
            stats.era.push({ name: "Geodesic", era: "Coming Storm" });
        }
        if (sec.lifting_body) {
            stats.wingarea += 3;
        }
        //If it's internal, no skin.
        if (!sec.internal_bracing) {
            stats.drag += 4;
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[this.sel_skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[this.sel_skin].stats);
        }
        return stats;
    }

    private TailSectionStats(sec: {
        frame: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }): Stats {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic) {
            stats.structure *= 1.5;
            stats.cost *= 2;
            stats.era.push({ name: "Geodesic", era: "Coming Storm" });
        }
        if (sec.lifting_body) {
            stats.wingarea += 3;
        }
        stats.drag += 4;
        //If it's farman, no skin.
        if (!this.farman) {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[this.sel_skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[this.sel_skin].stats);
        }
        return stats;
    }

    private CountMainLiftingBody() {
        var count = 0;
        for (let s of this.section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }

    private CountTailLiftingBody() {
        var count = 0;
        for (let s of this.tail_section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }

    private CountLiftingBody() {
        return this.CountMainLiftingBody() + this.CountTailLiftingBody();
    }

    public SetIsTandem(use: boolean) {
        if (this.is_tandem != use) {
            this.is_tandem = use;
            this.SetTailType(this.sel_tail);
        }
    }

    public SetTailType(num: number) {
        if (this.tail_list[num].stats.reqsections == 0 && this.is_tandem)
            num++;
        this.sel_tail = num;
        this.SetRequiredTailSections(this.tail_list[num].stats.reqsections);
    }

    public GetTailType() {
        return this.sel_tail;
    }

    public GetTailList() {
        return this.tail_list;
    }

    public GetTailSectionList() {
        return this.tail_section_list;
    }

    public SetUseFarman(use: boolean) {
        this.farman = use;
        if (use && this.boom)
            this.boom = false;
        if (this.farman) {
            for (let sec of this.tail_section_list) {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
        this.CalculateStats();
    }

    public GetUseFarman() {
        return this.farman;
    }

    public SetUseBoom(use: boolean) {
        this.boom = use;
        if (use && this.farman)
            this.farman = false;
        this.CalculateStats();
    }

    public GetUseBoom() {
        return this.boom;
    }

    public SetTailFrame(num: number, type: number) {
        this.tail_section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.tail_section_list[num].geodesic = false;
        this.CalculateStats();
    }

    // public SetTailSkin(num: number, type: number) {
    //     this.tail_section_list[num].skin = type;
    //     if (type != 0)
    //         this.tail_section_list[num].internal_bracing = false;
    //     if (!this.skin_list[type].monocoque) {
    //         this.tail_section_list[num].monocoque = false;
    //         this.tail_section_list[num].lifting_body = false;
    //     }
    //     this.CalculateStats();
    // }

    public SetTailGeodesic(num: number, use: boolean) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }

    public SetTailMonocoque(num: number, use: boolean) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }

    public SetTailLiftingBody(num: number, use: boolean) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }

    public SetHasTractorNacelles(use: boolean) {
        this.has_tractor_nacelles = use;
    }

    public GetHasTractorNacelles() {
        return this.has_tractor_nacelles;
    }

    public CanFlyingWing() {
        for (let s of this.section_list) {
            if (s.lifting_body)
                return true;
        }
        for (let s of this.tail_section_list) {
            if (s.lifting_body)
                return true;
        }
        return false;
    }

    public GetFlyingWing() {
        return this.flying_wing;
    }

    public SetFlyingWing(use: boolean) {
        if (use && this.CanFlyingWing()) {
            this.flying_wing = true;
        } else {
            this.flying_wing = false;
        }
        this.CalculateStats();
    }

    public GetIsTailless() {
        return this.tail_section_list.length == 0;
    }

    public SetAllFrame(num: number) {
        for (let s of this.section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        for (let s of this.tail_section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        this.CalculateStats();
    }

    public SetAllSkin(num: number) {
        this.sel_skin = num;
        for (let s of this.section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        for (let s of this.tail_section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        this.CalculateStats();
    }

    public GetArmor() {
        if (this.skin_list[this.sel_skin].name == "Dragon Skin")
            return 5;
        return 0;
    }

    public GetIsFlammable() {
        if (this.skin_list[this.sel_skin].flammable)
            return true;
        return false;
    }

    public GetSkin() {
        return this.sel_skin;
    }

    public CanCutout(): boolean {
        let vcount = this.section_list.length * this.skin_list[this.sel_skin].stats.visibility;
        if (this.farman) {
            vcount += this.tail_section_list.length;
        } else {
            vcount += this.tail_section_list.length * this.skin_list[this.sel_skin].stats.visibility;
        }
        return vcount < 3;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        if (!this.CanFlyingWing())
            this.flying_wing = false;

        var stats = new Stats();
        var base_type = this.BaseType();
        stats.structure = this.frame_list[base_type].basestruct;
        stats.cost = this.frame_list[base_type].basecost;

        var is_clinker = this.skin_list[this.sel_skin].monocoque_structure < 0;

        for (let sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
        }

        var tail_stats = new Stats();
        for (let sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.TailSectionStats(sec));
            if (!this.farman) {
                is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
            }
        }

        if (is_clinker)
            stats.structure += 30;

        stats = stats.Add(this.tail_list[this.sel_tail].stats);

        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (!this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.0e-6 + 1.5 * tail_stats.drag);
        }

        if (this.farman) {
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
            stats.visibility += this.tail_section_list.length;
            tail_stats.mass = Math.floor(1.0e-6 + 0.5 * tail_stats.mass);
            //Apply factors before tail_stats
            stats = stats.Add(tail_stats);
        } else {
            //Apply factors after tail_stats
            stats = stats.Add(tail_stats);
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
        }

        //Lifting Body and Flying Wing
        var lb_count = this.CountLiftingBody();
        stats.cost += lb_count;
        if (this.flying_wing) {
            stats.liftbleed += 5;
        }
        else {
            stats.drag += lb_count;
        }

        if (this.PossibleRemoveSections() && this.CountMainLiftingBody() < this.CountSections()) {
            stats.warnings.push({
                source: lu("Frame Count"),
                warning: lu("Frame Count Warning"),
                color: WARNING_COLOR.YELLOW,
            });
        }

        stats.structure = Math.floor(1.0e-6 + stats.structure);
        stats.cost = Math.floor(1.0e-6 + stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);

        stats.Round();

        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}