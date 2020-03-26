// export { Frames };

// import { Part } from "./Part";
// import { Stats } from "./Stats";
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
        flammable: boolean;
    }[];
    private section_list: {
        frame: number, skin: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }[];
    private required_sections: number;

    private tail_list: { name: string, stats: Stats }[];
    private sel_tail: number;
    private farman: boolean;
    private boom: boolean;
    private has_tractor_nacelles: boolean;
    private tail_section_list: {
        frame: number, skin: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }[];

    private flying_wing: boolean;

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

        this.skin_list = [];
        for (let elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"]
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
        };
    }

    public fromJSON(js: JSON) {
        this.section_list = [];
        for (let elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }
        this.tail_section_list = [];
        for (let elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], skin: elem["skin"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
        }

        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
        this.flying_wing = js["flying_wing"];
    }

    public DuplicateSection(num: number) {
        var sec = this.section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() + this.tail_section_list.length == this.CountInternalBracing()) {
            return;
        }
        this.section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }

    private DuplicateTailSection(num: number) {
        var sec = this.tail_section_list[num];
        var new_section = {
            frame: sec.frame, skin: sec.skin, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.CountInternalBracing()) {
            return;
        }
        this.tail_section_list.splice(num, 0, new_section);
        this.CalculateStats();
    }

    public DeleteSection(num: number) {
        if (this.required_sections == this.CountSections()
            && !this.section_list[num].internal_bracing)
            return;
        this.section_list.splice(num, 1);
        this.CalculateStats();
    }

    public SetRequiredSections(num: number) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (!this.section_list[i].internal_bracing) {
                    while (this.required_sections > this.CountSections()) {
                        this.DuplicateSection(i);
                    }
                    return;
                }
            }
        }
    }

    public SetRequiredTailSections(num: number) {
        if (num > this.tail_section_list.length) {
            if (this.tail_section_list.length == 0) {
                this.tail_section_list.push({
                    frame: 0, skin: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            while (num > this.tail_section_list.length) {
                this.DuplicateTailSection(this.tail_section_list.length - 1);
            }
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
        var max_index = 0;
        var max = 0;
        for (let i = hist.length - 1; i > 0; i--) {
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

    public SetSkin(num: number, type: number) {
        this.section_list[num].skin = type;
        if (type != 0)
            this.section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }

    public SetGeodesic(num: number, use: boolean) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }

    public SetMonocoque(num: number, use: boolean) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }

    public SetLiftingBody(num: number, use: boolean) {
        if (this.skin_list[this.section_list[num].skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }

    public SetInternalBracing(num: number, use: boolean) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing()
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].skin = 0;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        } else if (!use) {// If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }

    public PossibleInternalBracing() {
        return this.CountInternalBracing() < this.CountSections() + this.tail_section_list.length;
    }

    public PossibleGeodesic(num: number) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }

    public PossibleMonocoque(num: number) {
        return this.skin_list[this.section_list[num].skin].monocoque;
    }

    public PossibleTailGeodesic(num: number) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }

    public PossibleTailMonocoque(num: number) {
        return this.skin_list[this.tail_section_list[num].skin].monocoque;
    }

    public PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }

    public GetFarmanOrBoom() {
        return this.farman || this.boom;
    }

    private SectionStats(sec: {
        frame: number, skin: number, geodesic: boolean, monocoque: boolean,
        lifting_body: boolean, internal_bracing: boolean
    }): Stats {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic)
            stats.structure *= 1.5;
        if (sec.lifting_body) {
            stats.drag += 1;
            stats.wingarea += 3;
        }
        //If it's internal, no skin.
        if (sec.internal_bracing)
            stats.mass -= 1;
        else {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[sec.skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[sec.skin].stats);
        }
        return stats;
    }

    public SetTailType(num: number) {
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
                sec.skin = 0;
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
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }

    public SetTailSkin(num: number, type: number) {
        this.tail_section_list[num].skin = type;
        if (type != 0)
            this.tail_section_list[num].internal_bracing = false;
        if (!this.skin_list[type].monocoque) {
            this.tail_section_list[num].monocoque = false;
            this.tail_section_list[num].lifting_body = false;
        }
        this.CalculateStats();
    }

    public SetTailGeodesic(num: number, use: boolean) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }

    public SetTailMonocoque(num: number, use: boolean) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }

    public SetTailLiftingBody(num: number, use: boolean) {
        if (this.skin_list[this.tail_section_list[num].skin].monocoque) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }

    public SetHasTractorNacelles(use: boolean) {
        this.has_tractor_nacelles = true;
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

    public GetIsTailless(){
        return this.tail_section_list.length == 0;
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

        var is_clinker = false;

        for (let sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }

        var tail_stats = new Stats();
        for (let sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.SectionStats(sec));
            var clinker = this.skin_list[sec.skin].monocoque_structure < 0 && sec.monocoque;
            is_clinker = is_clinker || clinker;
        }

        if (is_clinker)
            stats.structure += 30;

        if (this.flying_wing) {
            stats.liftbleed += 5;
            stats.drag = 0;
            tail_stats.drag = 0;
        }

        stats = stats.Add(this.tail_list[this.sel_tail].stats);

        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.5 * tail_stats.drag);
        }

        stats = stats.Add(tail_stats);

        stats.structure = Math.floor(stats.structure);
        stats.cost = Math.floor(stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);

        return stats;
    }
}