import { Part, AIRCRAFT_TYPE, IsAnyOrnithopter, Controls_PS } from "./Part";
import { Stats, WARNING_COLOR } from "./Stats";
import { Serialize, Deserialize, BoolArr } from "./Serialize";
import { lu } from "./Localization";

export class ControlSurfaces extends Part {
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

    private span = 0;
    private is_cantilever = 0;
    private wing_area = 0;
    private mp = 0;
    private is_boom = false;
    private acft_type: AIRCRAFT_TYPE = AIRCRAFT_TYPE.AIRPLANE;
    private can_rudder: boolean;
    private can_elevator: boolean;

    constructor(js: Controls_PS) {
        super();
        this.aileron_sel = 0;
        this.aileron_list = [];
        for (const elem of js["ailerons"]) {
            this.aileron_list.push({ name: elem["name"], warping: elem["warping"], stats: new Stats(elem) });
        }

        this.rudder_sel = 0;
        this.rudder_list = [];
        for (const elem of js["rudders"]) {
            this.rudder_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.elevator_sel = 0;
        this.elevator_list = [];
        for (const elem of js["elevators"]) {
            this.elevator_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.flaps_sel = 0;
        this.flaps_list = [];
        for (const elem of js["flaps"]) {
            this.flaps_list.push({ name: elem["name"], costfactor: elem["costfactor"], stats: new Stats(elem) });
        }

        this.slats_sel = 0;
        this.slats_list = [];
        for (const elem of js["slats"]) {
            this.slats_list.push({ name: elem["name"], stats: new Stats(elem) });
        }

        this.drag_list = [];
        for (const elem of js["drag_inducers"]) {
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

    public fromJSON(js: JSON, json_version: number) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = BoolArr(js["drag_sel"], this.drag_sel.length);
    }

    public serialize(s: Serialize) {
        s.PushNum(this.aileron_sel);
        s.PushNum(this.rudder_sel);
        s.PushNum(this.elevator_sel);
        s.PushNum(this.flaps_sel);
        s.PushNum(this.slats_sel);
        s.PushBoolArr(this.drag_sel);
    }

    public deserialize(d: Deserialize) {
        this.aileron_sel = d.GetNum();
        this.rudder_sel = d.GetNum();
        this.elevator_sel = d.GetNum();
        this.flaps_sel = d.GetNum();
        this.slats_sel = d.GetNum();
        this.drag_sel = d.GetBoolArr(this.drag_sel.length);
    }

    public IsDefault() {
        return this.aileron_sel == 0
            && this.rudder_sel == 0
            && this.elevator_sel == 0
            && this.flaps_sel == 0
            && this.slats_sel == 0
            && this.drag_sel.reduce((p, c) => { return p || c; }, false) == false; // If all are false, then it's default
    }

    public GetAileronList() {
        return this.aileron_list;
    }

    public CanAileron() {
        const can = [];
        if (!IsAnyOrnithopter(this.acft_type)) {
            for (const a of this.aileron_list) {
                if (a.warping && this.wing_area == 0)
                    can.push(false)
                else
                    can.push(true);
            }
        } else { //Is Ornithopter
            for (const a of this.aileron_list) {
                can.push(a.warping);
            }
        }
        return can;
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

    public CanRudder() {
        return this.can_rudder;
    }

    public SetCanRudder(can: boolean) {
        this.can_rudder = can;
        if (!can)
            this.rudder_sel = 0;
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

    public CanElevator() {
        return this.can_elevator;
    }

    public SetCanElevator(can: boolean) {
        this.can_elevator = can;
        if (!can)
            this.elevator_sel = 0;
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
        if (this.flaps_list[this.flaps_sel].costfactor > 0)
            return Math.max(1, Math.floor(1.0e-6 + this.flaps_list[this.flaps_sel].costfactor * this.mp));
        else
            return 0;
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

    public SetNumCantilever(count: number) {
        this.is_cantilever = count;
    }

    public SetSpan(span: number) {
        this.span = span;
    }

    public SetWingArea(wa: number) {
        this.wing_area = wa;
    }

    public SetAcftType(acft_type: AIRCRAFT_TYPE) {
        this.acft_type = acft_type;
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER) {
            this.aileron_sel = 0;
            this.rudder_sel = 0;
            this.elevator_sel = 0;
            this.flaps_sel = 0;
            this.slats_sel = 0;
            for (let i = 0; i < this.drag_sel.length; i++)
                this.drag_sel[i] = false;
            this.span = 0;
            this.is_cantilever = 0;
            this.wing_area = 0;
        } else if (IsAnyOrnithopter(this.acft_type)) {
            const can = this.CanAileron();
            this.aileron_sel = can.findIndex((element) => { return element; })
            this.is_cantilever = 0;
        }
    }

    public SetBoomTail(has: boolean) {
        this.is_boom = has;
    }

    public SetIsVTail(is: boolean) {
        if (is) {
            this.rudder_sel = this.elevator_sel;
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();
        if (this.aileron_list[this.aileron_sel].warping && this.wing_area == 0) {
            this.aileron_sel = 0;
        }
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);

        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever) {
                stats.cost += 2 * this.is_cantilever;
                stats.era.push({ name: lu("Cantilever Wing Warping"), era: "Last Hurrah" });
            }
            if (this.is_boom) {
                stats.pitchstab -= 2;
                stats.latstab -= 2;
                stats.warnings.push({
                    source: lu("Wing Warping"),
                    warning: lu("Wing Warping Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
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

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
