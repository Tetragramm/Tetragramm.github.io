/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

type WingType = {
    surface: number, area: number, span: number,
    dihedral: number, anhedral: number, deck: number
};
class Wings extends Part {
    //Possible selections
    private wing_list: WingType[];
    private mini_wing_list: WingType[];
    private stagger_list: {
        name: string, inline: boolean,
        wing_count: number, hstab: boolean, stats: Stats
    }[];
    private skin_list: {
        name: string, flammable: boolean,
        stats: Stats, strainfactor: number,
        dragfactor: number, metal: boolean
    }[];
    private deck_list: {
        name: string, limited: boolean,
        stats: Stats
    }[];
    //Actual selections
    private wing_stagger: number;
    private is_swept: boolean;
    private is_closed: boolean;
    private num_frames: number;

    constructor(js: JSON) {
        super();

        this.skin_list = [];
        for (let elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"],
                dragfactor: elem["dragfactor"], metal: elem["metal"]
            });
        }

        this.stagger_list = [];
        for (let elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], inline: elem["inline"],
                wing_count: elem["wing_count"], hstab: elem["hstab"], stats: new Stats(elem)
            });
        }

        this.deck_list = [];
        for (let elem of js["decks"]) {
            this.deck_list.push({
                name: elem["name"], limited: elem["limited"], stats: new Stats(elem)
            });
        }

        this.wing_list = [];
        this.mini_wing_list = [];

        this.wing_stagger = Math.floor(this.stagger_list.length / 2);
        this.is_swept = false;
        this.is_closed = false;
    }

    public toJSON() {
        return {
            wing_list: this.wing_list,
            mini_wing_list: this.mini_wing_list,
            wing_stagger: this.wing_stagger,
            is_swept: this.is_swept,
            is_closed: this.is_closed
        };
    }

    public fromJSON(js: JSON) {
        this.wing_list = js["wing_list"];
        this.mini_wing_list = js["mini_wing_list"];
        this.wing_stagger = js["wing_stagger"];
        this.is_swept = js["is_swept"];
        this.is_closed = js["is_closed"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.wing_list.length);
        for (let i = 0; i < this.wing_list.length; i++) {
            var w = this.wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
            s.PushNum(w.deck);
        }
        s.PushNum(this.mini_wing_list.length);
        for (let i = 0; i < this.mini_wing_list.length; i++) {
            var w = this.mini_wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
            s.PushNum(w.deck);
        }
        s.PushNum(this.wing_stagger);
        s.PushBool(this.is_swept);
        s.PushBool(this.is_closed);
    }

    public deserialize(d: Deserialize) {
        var wlen = d.GetNum();
        this.wing_list = [];
        for (let i = 0; i < wlen; i++) {
            let wing = { surface: 0, area: 0, span: 0, dihedral: 0, anhedral: 0, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            wing.dihedral = d.GetNum();
            wing.anhedral = d.GetNum();
            wing.deck = d.GetNum();
            this.wing_list.push(wing);
        }
        var mlen = d.GetNum();
        this.mini_wing_list = [];
        for (let i = 0; i < mlen; i++) {
            let wing = { surface: 0, area: 0, span: 0, dihedral: 0, anhedral: 0, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            wing.dihedral = d.GetNum();
            wing.anhedral = d.GetNum();
            wing.deck = d.GetNum();
            this.mini_wing_list.push(wing);
        }
        this.wing_stagger = d.GetNum();
        this.is_swept = d.GetBool();
        this.is_closed = d.GetBool();
    }

    public GetWingList() {
        return this.wing_list;
    }

    public GetMiniWingList() {
        return this.mini_wing_list;
    }

    public GetSkinList() {
        return this.skin_list;
    }

    public GetStaggerList() {
        return this.stagger_list;
    }

    public GetDeckList() {
        return this.deck_list;
    }

    private DeckCountFull() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.wing_list) {
            count[w.deck]++;
        }
        return count;
    }

    private DeckCountMini() {
        var count = [...Array(this.deck_list.length).fill(0)];
        for (let w of this.mini_wing_list) {
            count[w.deck]++;
        }
        return count;
    }

    public SetStagger(index: number) {
        this.wing_stagger = index;
        while (this.stagger_list[index].wing_count < this.wing_list.length) {
            this.wing_list.pop();
        }
        if (!this.stagger_list[index].inline) {
            var count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                let w = this.wing_list[i];
                if (count[w.deck] > 1) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }

        this.CalculateStats();
    }

    public GetStagger() {
        return this.wing_stagger;
    }

    public CanAddFullWing(deck: number) {
        if (deck >= this.deck_list.length)
            console.log("Deck out of Bounds");
        if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
            return false;

        var full_count = this.DeckCountFull();
        if (!this.stagger_list[this.wing_stagger].inline && full_count[deck] == 1 && this.deck_list[deck].limited)
            return false

        var mini_count = this.DeckCountMini();
        if (mini_count[deck] != 0)
            return false;

        return true;
    }

    public CanAddMiniWing(deck: number) {
        var full_count = this.DeckCountFull();
        var mini_count = this.DeckCountMini();
        if (full_count[deck] != 0 || mini_count[deck] != 0)
            return false;
        return true;
    }

    public CanMoveFullWing(idx: number, deck: number) {
        var w = this.wing_list[idx];
        this.wing_list.splice(idx, 1);
        var can = this.CanAddFullWing(deck);
        this.wing_list.splice(idx, 0, w);
        return can;
    }

    public CanMoveMiniWing(idx: number, deck: number) {
        var w = this.mini_wing_list[idx];
        this.mini_wing_list.splice(idx, 1);
        var can = this.CanAddMiniWing(deck);
        this.mini_wing_list.splice(idx, 0, w);
        return can;
    }

    public GetWingHeight() {
        var max = 0;
        for (let w of this.wing_list)
            max = Math.max(max, 4 - w.deck);
        return max;
    }

    public CanClosed() {
        return this.wing_list.length > 1 && !this.stagger_list[this.wing_stagger].inline;
    }

    public SetClosed(use: boolean) {
        if (this.wing_list.length > 0)
            this.is_closed = use;
        else
            this.is_closed = false;

        this.CalculateStats();
    }

    public GetClosed() {
        return this.is_closed;
    }

    public CanSwept() {
        return this.wing_list.length > 0;
    }

    public SetSwept(use: boolean) {
        if (this.wing_list.length > 0)
            this.is_swept = use;
        else
            this.is_swept = false;

        this.CalculateStats();
    }

    public GetSwept() {
        return this.is_swept;
    }

    public GetTandem() {
        return this.stagger_list[this.wing_stagger].inline;
    }

    public GetMonoplane() {
        return this.wing_list.length == 1;
    }

    public GetStaggered() {
        return this.stagger_list[this.wing_stagger].stats.liftbleed != 0;
    }

    public SetFullWing(idx: number, w: WingType) {
        if (this.wing_list.length != idx)
            this.wing_list.splice(idx, 1);

        if (w.area != w.area)
            w.area = 3;
        w.area = Math.floor(w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(w.span);
        if (w.dihedral != w.dihedral)
            w.dihedral = 0;
        w.dihedral = Math.floor(w.dihedral);
        if (w.anhedral != w.anhedral)
            w.anhedral = 0;
        w.anhedral = Math.floor(w.anhedral);

        if (w.deck >= 0) {
            w.area = Math.max(w.area, 3);
            w.span = Math.max(w.span, 1);
            while (w.anhedral + w.dihedral > w.span - 1) {
                if (w.anhedral > w.dihedral) {
                    w.anhedral--;
                } else {
                    w.dihedral--;
                }
            }

            if (this.CanAddFullWing(w.deck))
                this.wing_list.splice(idx, 0, w);
        }

        this.CalculateStats();
    }

    public SetMiniWing(idx: number, w: WingType) {
        if (this.mini_wing_list.length != idx)
            this.mini_wing_list.splice(idx, 1);

        if (w.area != w.area)
            w.area = 2;
        w.area = Math.floor(w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(w.span);
        if (w.dihedral != w.dihedral)
            w.dihedral = 0;
        w.dihedral = Math.floor(w.dihedral);
        if (w.anhedral != w.anhedral)
            w.anhedral = 0;
        w.anhedral = Math.floor(w.anhedral);

        if (w.deck >= 0) {
            w.area = Math.max(w.area, 1);
            w.area = Math.min(w.area, 2);
            w.span = Math.max(w.span, 1);
            w.dihedral = 0;
            w.anhedral = 0;

            if (this.CanAddMiniWing(w.deck))
                this.mini_wing_list.splice(idx, 0, w);
        }

        this.CalculateStats();
    }

    public IsFlammable() {
        for (let w of this.wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        for (let w of this.mini_wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        return false;
    }

    public SetNumFrames(num: number) {
        this.num_frames = num;
    }

    public NeedHStab() {
        return this.stagger_list[this.wing_stagger].hstab;
    }

    public NeedTail() {
        return this.NeedHStab() || !this.is_swept;
    }

    public GetSpan() {
        var longest_span = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);
        }
        return longest_span;
    }

    public GetArea() {
        var area = 0;
        for (let w of this.wing_list) {
            area += w.area;
        }
        for (let w of this.mini_wing_list) {
            area += w.area;
        }
        return area;
    }

    public GetParasol() {
        for (let w of this.wing_list) {
            if (w.deck == 0) {
                return true;
            }
        }
        for (let w of this.mini_wing_list) {
            if (w.deck == 0) {
                return true;
            }
        }
        return false;
    }

    public GetMetalArea() {
        var area = 0;
        for (let w of this.wing_list) {
            if (this.skin_list[w.surface].metal)
                area += w.area;
        }
        for (let w of this.mini_wing_list) {
            if (this.skin_list[w.surface].metal)
                area += w.area;
        }
        return area;
    }

    public GetWingDrag() {
        var drag = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;

            var wdrag = Math.max(1, 10 * w.area * w.area / (wspan * wspan));
            drag += Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span;

            //Drag is modified by area, span
            var wdrag = Math.max(1, 10 * w.area * w.area / (wspan * wspan));
            drag += Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
        }
        return drag;
    }

    public PartStats() {
        if (!this.CanClosed())
            this.is_closed = false;
        if (!this.CanSwept())
            this.is_swept = false;

        var stats = new Stats();

        var have_wing = false;
        var deck_count = this.DeckCountFull();
        var have_mini_wing = false;
        var longest_span = 0;
        for (let w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);

            if (!have_wing) { //Is first wing
                have_wing = true;
            }
            else { //Is not first wing
                stats.control += 3;
                stats.liftbleed += 5;
                stats.visibility -= 1;
            }

            var wStats = new Stats();

            //Actual stats
            wStats = wStats.Add(this.skin_list[w.surface].stats.Multiply(w.area));
            wStats.wingarea = w.area;
            //Wings cannot generate positive max strain
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span, and the leading wing
            wStats.drag = Math.max(1, wStats.drag + 10 * w.area * w.area / (w.span * w.span));
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);

            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;

            //Inline wings
            if (deck_count[w.deck] > 1) {
                wStats.drag = Math.floor(0.75 * wStats.drag);
            }

            wStats.Round();
            stats = stats.Add(wStats);
        }
        for (let w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            let wspan = w.span - Math.ceil((w.anhedral + w.dihedral) / 2.0);
            longest_span = Math.max(longest_span, wspan);

            if (!have_mini_wing) { //Is first miniature wing
                have_mini_wing = true;
            }
            else {//Is not first miniature wing
                stats.control += 1;
                stats.liftbleed += 1;
            }

            //Actual stats
            var wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span
            wStats.drag = Math.max(1, wStats.drag + 10 * w.area * w.area / (w.span * w.span));
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);

            wStats.Round();
            stats = stats.Add(wStats);
        }

        //Deck Stats
        for (let i = 0; i < this.deck_list.length; i++) {
            if (deck_count[i] > 0)
                stats = stats.Add(this.deck_list[i].stats);
        }

        //Longest wing effects
        stats.control += 8 - longest_span;
        stats.latstab += Math.min(0, longest_span - 8);
        stats.latstab += Math.max(0, Math.floor(longest_span / this.num_frames) - 1);

        //Wing Sweep effects
        if (this.is_swept) {
            stats.liftbleed += 5;
            stats.latstab--;
        }

        //Closed Wing effects
        if (this.is_closed) {
            stats.mass += 1;
            stats.control -= 5;
            stats.maxstrain += 20;
        }

        //Stagger effects, monoplane is nothing.
        if (this.wing_list.length > 1) {
            stats = stats.Add(this.stagger_list[this.wing_stagger].stats);
        }

        return stats;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }
}