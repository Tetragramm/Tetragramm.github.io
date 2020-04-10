/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class ControlSurfaces extends Part {
    private aileron_list: { name: string, warping: boolean, stats: Stats }[];
    private aileron_sel: number;
    private rudder_list: { name: string, stats: Stats }[];
    private rudder_sel: number;
    private elevator_list: { name: string, stats: Stats }[];
    private elevator_sel: number;
    private flaps_list: { name: string, costfactor: number, stats: Stats }[];
    private flaps_sel: number;
    private slats_list: { name: string, stats: Stats }[];
    private slats_sel: number;
    private drag_list: { name: string, stats: Stats }[];
    private drag_sel: boolean[];

    private span: number = 0;
    private is_cantilever: boolean = false;
    private wing_area: number = 0;
    private mp: number = 0;

    constructor(js: JSON) {
        super();
        this.aileron_sel = 0;
        this.aileron_list = [];
        for (let elem of js["ailerons"]) {
            this.aileron_list.push({ name: elem["name"], warping: elem["warping"], stats: new Stats(elem) });
        }

        this.rudder_sel = 0;
        this.rudder_list = [];
        for (let elem of js["rudders"]) {
            this.rudder_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.elevator_sel = 0;
        this.elevator_list = [];
        for (let elem of js["elevators"]) {
            this.elevator_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.flaps_sel = 0;
        this.flaps_list = [];
        for (let elem of js["flaps"]) {
            this.flaps_list.push({ name: elem["name"], costfactor: elem["costfactor"], stats: new Stats(elem) });
        }

        this.slats_sel = 0;
        this.slats_list = [];
        for (let elem of js["slats"]) {
            this.slats_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.drag_list = [];
        for (let elem of js["drag_inducers"]) {
            this.drag_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_sel = [...Array(this.drag_list.length).fill(false)];
    }

    public toJSON() {
        return {
            aileron_sel: this.aileron_sel,
            rudder_sel: this.rudder_sel,
            elevator_sel: this.elevator_sel,
            flaps_sel: this.flaps_sel,
            slats_sel: this.slats_sel,
            drag_sel: this.drag_sel,
        };
    }

    public fromJSON(js: JSON) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = js["drag_sel"];
    }

    public GetAileronList() {
        return this.aileron_list;
    }

    public GetAileron() {
        return this.aileron_sel;
    }

    public SetAileron(num: number) {
        this.aileron_sel = num;
        this.CalculateStats();
    }

    public GetRudderList() {
        return this.rudder_list;
    }

    public GetRudder() {
        return this.rudder_sel;
    }

    public SetRudder(num: number) {
        this.rudder_sel = num;
        this.CalculateStats();
    }

    public GetElevatorList() {
        return this.elevator_list;
    }

    public GetElevator() {
        return this.elevator_sel;
    }

    public SetElevator(num: number) {
        this.elevator_sel = num;
        this.CalculateStats();
    }

    public GetFlapsList() {
        return this.flaps_list;
    }

    public GetFlaps() {
        return this.flaps_sel;
    }

    public SetFlaps(num: number) {
        this.flaps_sel = num;
        this.CalculateStats();
    }

    public GetFlapCost(mp?: number) {
        if (mp)
            this.mp = mp;
        return Math.floor(this.flaps_list[this.flaps_sel].costfactor * this.mp);
    }

    public GetSlatsList() {
        return this.slats_list;
    }

    public GetSlats() {
        return this.slats_sel;
    }

    public SetSlats(num: number) {
        this.slats_sel = num;
        this.CalculateStats();
    }

    public GetDragList() {
        return this.drag_list;
    }

    public GetDrag() {
        return this.drag_sel;
    }

    public SetDrag(num: number, use: boolean) {
        this.drag_sel[num] = use;
        this.CalculateStats();
    }

    public SetIsCantilever(use: boolean) {
        this.is_cantilever = use;
    }

    public SetSpan(span: number) {
        this.span = span;
    }

    public SetWingArea(wa: number) {
        this.wing_area = wa;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);

        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever)
                stats.cost += 2 * this.wing_area;
        }

        stats = stats.Add(this.rudder_list[this.rudder_sel].stats);
        stats = stats.Add(this.elevator_list[this.elevator_sel].stats);
        stats = stats.Add(this.flaps_list[this.flaps_sel].stats);
        stats = stats.Add(this.slats_list[this.slats_sel].stats);
        for (let i = 0; i < this.drag_list.length; i++) {
            if (this.drag_sel[i])
                stats = stats.Add(this.drag_list[i].stats);
        }
        return stats;
    }
}