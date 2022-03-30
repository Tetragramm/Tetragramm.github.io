import { Part } from "./Part.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
import { lu } from "./Localization.js";
export class Frames extends Part {
    constructor(js) {
        super();
        this.frame_list = [];
        for (const elem of js["frames"]) {
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
        for (const elem of js["skin"]) {
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
        for (const elem of js["tail"]) {
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
    toJSON() {
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
    fromJSON(js, json_version) {
        this.section_list = [];
        for (const elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }
        this.tail_section_list = [];
        for (const elem of js["tail_sections"]) {
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
    serialize(s) {
        s.PushNum(this.section_list.length);
        for (let i = 0; i < this.section_list.length; i++) {
            const sec = this.section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.tail_section_list.length);
        for (let i = 0; i < this.tail_section_list.length; i++) {
            const sec = this.tail_section_list[i];
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
    deserialize(d) {
        const slen = d.GetNum();
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
        const tlen = d.GetNum();
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
    DuplicateSection(num, count = 1) {
        const sec = this.section_list[num];
        const new_section = {
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
    DuplicateTailSection(num, count = 1) {
        const sec = this.tail_section_list[num];
        const new_section = {
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
    DeleteSection(num) {
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
    SetRequiredSections(num) {
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
    SetRequiredTailSections(num) {
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
    CountSections() {
        let count = 0;
        for (const elem of this.section_list) {
            if (!elem.internal_bracing)
                count++;
        }
        return count;
    }
    GetNumFrames() {
        return this.CountSections() + this.tail_section_list.length;
    }
    CountInternalBracing() {
        var count = 0;
        for (const elem of this.section_list) {
            if (elem.internal_bracing)
                count++;
        }
        return count;
    }
    BaseType() {
        const hist = [...Array(this.frame_list.length).fill(0)];
        for (const elem of this.section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        for (const elem of this.tail_section_list) {
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
    GetFrameList() {
        return this.frame_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetSectionList() {
        return this.section_list;
    }
    SetFrame(num, type) {
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
    SetGeodesic(num, use) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetMonocoque(num, use) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetLiftingBody(num, use) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetInternalBracing(num, use) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing(true)
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        }
        else if (!use) { // If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }
    PossibleInternalBracing(convert_sec_to_brace = false) {
        var allowed = this.CountSections();
        if (!this.farman)
            allowed += this.tail_section_list.length;
        if (convert_sec_to_brace)
            allowed -= 1;
        return this.CountInternalBracing() + 1 <= allowed;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.section_list[num].internal_bracing && !this.section_list[num].lifting_body;
    }
    PossibleLiftingBody(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.section_list[num].internal_bracing && !this.section_list[num].monocoque;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }
    PossibleTailMonocoque(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.farman && !this.tail_section_list[num].lifting_body;
    }
    PossibleTailLiftingBody(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.farman && !this.tail_section_list[num].monocoque;
    }
    PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }
    GetFarmanOrBoom() {
        return this.farman || this.boom;
    }
    SectionStats(sec) {
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
    TailSectionStats(sec) {
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
    CountMainLiftingBody() {
        var count = 0;
        for (const s of this.section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }
    CountTailLiftingBody() {
        var count = 0;
        for (const s of this.tail_section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }
    CountLiftingBody() {
        return this.CountMainLiftingBody() + this.CountTailLiftingBody();
    }
    SetIsTandem(use) {
        if (this.is_tandem != use) {
            this.is_tandem = use;
            this.SetTailType(this.sel_tail);
        }
    }
    SetTailType(num) {
        if (this.tail_list[num].stats.reqsections == 0 && this.is_tandem)
            num++;
        this.sel_tail = num;
        this.SetRequiredTailSections(this.tail_list[num].stats.reqsections);
    }
    GetTailType() {
        return this.sel_tail;
    }
    GetTailList() {
        return this.tail_list;
    }
    GetTailSectionList() {
        return this.tail_section_list;
    }
    SetUseFarman(use) {
        this.farman = use;
        if (use && this.boom)
            this.boom = false;
        if (this.farman) {
            for (const sec of this.tail_section_list) {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
        this.CalculateStats();
    }
    GetUseFarman() {
        return this.farman;
    }
    SetUseBoom(use) {
        this.boom = use;
        if (use && this.farman)
            this.farman = false;
        this.CalculateStats();
    }
    GetUseBoom() {
        return this.boom;
    }
    SetTailFrame(num, type) {
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
    SetTailGeodesic(num, use) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetTailMonocoque(num, use) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetTailLiftingBody(num, use) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetHasTractorNacelles(use) {
        this.has_tractor_nacelles = use;
    }
    GetHasTractorNacelles() {
        return this.has_tractor_nacelles;
    }
    CanFlyingWing() {
        for (const s of this.section_list) {
            if (s.lifting_body)
                return true;
        }
        for (const s of this.tail_section_list) {
            if (s.lifting_body)
                return true;
        }
        return false;
    }
    GetFlyingWing() {
        return this.flying_wing;
    }
    SetFlyingWing(use) {
        if (use && this.CanFlyingWing()) {
            this.flying_wing = true;
        }
        else {
            this.flying_wing = false;
        }
        this.CalculateStats();
    }
    GetIsTailless() {
        return this.tail_section_list.length == 0;
    }
    SetAllFrame(num) {
        for (const s of this.section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        for (const s of this.tail_section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        this.CalculateStats();
    }
    SetAllSkin(num) {
        this.sel_skin = num;
        for (const s of this.section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        for (const s of this.tail_section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        this.CalculateStats();
    }
    GetArmor() {
        if (this.skin_list[this.sel_skin].name == "Dragon Skin")
            return 5;
        return 0;
    }
    GetIsFlammable() {
        if (this.skin_list[this.sel_skin].flammable)
            return true;
        return false;
    }
    GetSkin() {
        return this.sel_skin;
    }
    CanCutout() {
        let vcount = this.section_list.length * this.skin_list[this.sel_skin].stats.visibility;
        if (this.farman) {
            vcount += this.tail_section_list.length;
        }
        else {
            vcount += this.tail_section_list.length * this.skin_list[this.sel_skin].stats.visibility;
        }
        return vcount < 3;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        if (!this.CanFlyingWing())
            this.flying_wing = false;
        var stats = new Stats();
        const base_type = this.BaseType();
        stats.structure = this.frame_list[base_type].basestruct;
        stats.cost = this.frame_list[base_type].basecost;
        var is_clinker = this.skin_list[this.sel_skin].monocoque_structure < 0;
        for (const sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
        }
        var tail_stats = new Stats();
        for (const sec of this.tail_section_list) {
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
        }
        else {
            //Apply factors after tail_stats
            stats = stats.Add(tail_stats);
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
        }
        //Lifting Body and Flying Wing
        const lb_count = this.CountLiftingBody();
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
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
