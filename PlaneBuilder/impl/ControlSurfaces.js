import { Part, AIRCRAFT_TYPE, IsAnyOrnithopter } from "./Part.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
import { BoolArr } from "./Serialize.js";
import { lu } from "./Localization.js";
export class ControlSurfaces extends Part {
    constructor(js) {
        super();
        this.span = 0;
        this.is_cantilever = 0;
        this.wing_area = 0;
        this.mp = 0;
        this.is_boom = false;
        this.acft_type = AIRCRAFT_TYPE.AIRPLANE;
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
    toJSON() {
        return {
            aileron_sel: this.aileron_sel,
            rudder_sel: this.rudder_sel,
            elevator_sel: this.elevator_sel,
            flaps_sel: this.flaps_sel,
            slats_sel: this.slats_sel,
            drag_sel: this.drag_sel,
        };
    }
    fromJSON(js, json_version) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = BoolArr(js["drag_sel"], this.drag_sel.length);
    }
    serialize(s) {
        s.PushNum(this.aileron_sel);
        s.PushNum(this.rudder_sel);
        s.PushNum(this.elevator_sel);
        s.PushNum(this.flaps_sel);
        s.PushNum(this.slats_sel);
        s.PushBoolArr(this.drag_sel);
    }
    deserialize(d) {
        this.aileron_sel = d.GetNum();
        this.rudder_sel = d.GetNum();
        this.elevator_sel = d.GetNum();
        this.flaps_sel = d.GetNum();
        this.slats_sel = d.GetNum();
        this.drag_sel = d.GetBoolArr(this.drag_sel.length);
    }
    GetAileronList() {
        return this.aileron_list;
    }
    CanAileron() {
        const can = [];
        if (!IsAnyOrnithopter(this.acft_type)) {
            for (const a of this.aileron_list) {
                if (a.warping && this.wing_area == 0)
                    can.push(false);
                else
                    can.push(true);
            }
        }
        else { //Is Ornithopter
            for (const a of this.aileron_list) {
                can.push(a.warping);
            }
        }
        return can;
    }
    GetAileron() {
        return this.aileron_sel;
    }
    SetAileron(num) {
        this.aileron_sel = num;
        this.CalculateStats();
    }
    GetRudderList() {
        return this.rudder_list;
    }
    CanRudder() {
        return this.can_rudder;
    }
    SetCanRudder(can) {
        this.can_rudder = can;
        if (!can)
            this.rudder_sel = 0;
    }
    GetRudder() {
        return this.rudder_sel;
    }
    SetRudder(num) {
        this.rudder_sel = num;
        this.CalculateStats();
    }
    GetElevatorList() {
        return this.elevator_list;
    }
    CanElevator() {
        return this.can_elevator;
    }
    SetCanElevator(can) {
        this.can_elevator = can;
        if (!can)
            this.elevator_sel = 0;
    }
    GetElevator() {
        return this.elevator_sel;
    }
    SetElevator(num) {
        this.elevator_sel = num;
        this.CalculateStats();
    }
    GetFlapsList() {
        return this.flaps_list;
    }
    GetFlaps() {
        return this.flaps_sel;
    }
    SetFlaps(num) {
        this.flaps_sel = num;
        this.CalculateStats();
    }
    GetFlapCost(mp) {
        if (mp)
            this.mp = mp;
        if (this.flaps_list[this.flaps_sel].costfactor > 0)
            return Math.max(1, Math.floor(1.0e-6 + this.flaps_list[this.flaps_sel].costfactor * this.mp));
        else
            return 0;
    }
    GetSlatsList() {
        return this.slats_list;
    }
    GetSlats() {
        return this.slats_sel;
    }
    SetSlats(num) {
        this.slats_sel = num;
        this.CalculateStats();
    }
    GetDragList() {
        return this.drag_list;
    }
    GetDrag() {
        return this.drag_sel;
    }
    SetDrag(num, use) {
        this.drag_sel[num] = use;
        this.CalculateStats();
    }
    SetNumCantilever(count) {
        this.is_cantilever = count;
    }
    SetSpan(span) {
        this.span = span;
    }
    SetWingArea(wa) {
        this.wing_area = wa;
    }
    SetAcftType(acft_type) {
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
        }
        else if (IsAnyOrnithopter(this.acft_type)) {
            const can = this.CanAileron();
            this.aileron_sel = can.findIndex((element) => { return element; });
            this.is_cantilever = 0;
        }
    }
    SetBoomTail(has) {
        this.is_boom = has;
    }
    SetIsVTail(is) {
        if (is) {
            this.rudder_sel = this.elevator_sel;
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
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
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
