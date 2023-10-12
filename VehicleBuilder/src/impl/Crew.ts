import { StringFmt } from "../string";
import { Deserialize, Serialize } from "./Serialize";
import { Stats } from "./Stats";
import { WeaponMount } from "./Weapon";

export const CrewType: { name: string }[] = [
    { name: "None" },//0
    { name: "Driver" },//1
    { name: "Commander" },//2
    { name: "Gunner" },//3
    { name: "Gun Crew" },//4
    { name: "Mechanic" },//5
    { name: "Passenger" },//6
    { name: "Passenger (Cramped)" },//7
    { name: "Stretcher" },
];

export class Loader {
    public enclosed: boolean;
    public coupla: boolean;
    public sealed: boolean;
    public loop_front: boolean;
    public loop_left: boolean;
    public loop_right: boolean;
    public loop_back: boolean;
    constructor(enc: boolean, coup: boolean, seal: boolean, front: boolean, left: boolean, right: boolean, rear: boolean) {
        this.enclosed = enc;
        this.coupla = coup;
        this.sealed = seal;
        this.loop_front = front;
        this.loop_left = left;
        this.loop_right = right;
        this.loop_back = rear;
    }

    public Serialize(s: Serialize) {
        s.PushBool(this.enclosed);
        s.PushBool(this.coupla);
        s.PushBool(this.sealed);
        s.PushBool(this.loop_front);
        s.PushBool(this.loop_left);
        s.PushBool(this.loop_right);
        s.PushBool(this.loop_back);
    }

    public Deserialize(d: Deserialize) {
        this.enclosed = d.GetBool();
        this.coupla = d.GetBool();
        this.sealed = d.GetBool();
        this.loop_front = d.GetBool();
        this.loop_left = d.GetBool();
        this.loop_right = d.GetBool();
        this.loop_back = d.GetBool();
    }
};

export class Crew {
    public name_txt: string;
    public enclosed: boolean;
    public coupla: boolean;
    public sealed: boolean;
    public loop_front: boolean;
    public loop_left: boolean;
    public loop_right: boolean;
    public loop_back: boolean;
    public loaders: Loader[];
    public weapon_mounts: WeaponMount[];
    public base_vis: number;
    public base_escape: number;
    constructor(disp: string, enc: boolean, coup: boolean, seal: boolean, lf: boolean, ll: boolean, lr: boolean, lb: boolean, ldrs: Loader[], weaps: WeaponMount[]) {
        this.name_txt = disp;
        this.enclosed = enc;
        this.coupla = coup;
        this.sealed = seal;
        this.loop_front = lf;
        this.loop_left = ll;
        this.loop_right = lr;
        this.loop_back = lb;
        this.loaders = ldrs;
        this.weapon_mounts = weaps;
    }

    public Serialize(s: Serialize) {
        s.PushString(this.name_txt);
        s.PushBool(this.enclosed);
        s.PushBool(this.coupla);
        s.PushBool(this.sealed);
        s.PushBool(this.loop_front);
        s.PushBool(this.loop_left);
        s.PushBool(this.loop_right);
        s.PushBool(this.loop_back);
        s.PushNum(this.loaders.length);
        for (let l of this.loaders) {
            l.Serialize(s);
        }
        s.PushNum(this.weapon_mounts.length);
        for (let w of this.weapon_mounts) {
            w.Serialize(s);
        }
    }

    public Deserialize(d: Deserialize) {
        this.name_txt = d.GetString();
        this.enclosed = d.GetBool();
        this.coupla = d.GetBool();
        this.sealed = d.GetBool();
        this.loop_front = d.GetBool();
        this.loop_left = d.GetBool();
        this.loop_right = d.GetBool();
        this.loop_back = d.GetBool();
        let num_l = d.GetNum();
        this.loaders = [];
        for (let idx = 0; idx < num_l; idx++) {
            let l = new Loader(false, false, false, false, false, false, false);
            l.Deserialize(d);
            this.loaders.push(l);
        }
        let num_w = d.GetNum();
        this.weapon_mounts = [];
        for (let idx = 0; idx < num_w; idx++) {
            let w = new WeaponMount(0, [], [], false, 0, 0);
            w.Deserialize(d);
            this.weapon_mounts.push(w);
        }
    }

    public IsEnclosed(): boolean {
        let is = false;
        is = is || this.enclosed;
        for (let idx = 0; idx < this.loaders.length; idx++) {
            is = is || this.loaders[idx].enclosed;
        }
        return is;
    }

    public GetVisibility(l: number | undefined = undefined) {
        let seat;
        if (l == undefined) {
            seat = this;
        } else {
            seat = this.loaders[l];
        }
        if (seat.sealed)
            return undefined;
        if (seat.enclosed) {
            if (seat.coupla) {
                return this.base_vis + 1;
            }
            return this.base_vis
        }
        return undefined;
    }
    public GetNumLoaders() {
        let num = 0;
        for (let w of this.weapon_mounts) {
            num += w.GetNumLoaders();
        }
        return num;
    }
    public GetEscape(l: number | undefined = undefined) {
        let seat;
        if (l == undefined) {
            seat = this;
        } else {
            seat = this.loaders[l];
        }
        if (seat.enclosed) {
            if (seat.coupla) {
                return this.base_escape + 1;
            }
            return this.base_escape
        }
        return undefined;
    }

    public GetLoopholes(): { f: number, l: number, r: number, b: number } {
        let result = { f: 0, l: 0, r: 0, b: 0 };
        for (let seat of [this, ...this.loaders]) {
            if (seat.loop_front)
                result.f += 1;
            if (seat.loop_left)
                result.l += 1;
            if (seat.loop_right)
                result.r += 1;
            if (seat.loop_back)
                result.b += 1;
        }
        return result;
    }

    public IsCramped(): boolean {
        return this.name_txt == CrewType[7].name;
    }

    public WeaponString(): string {
        let str = [];
        for (let w of this.weapon_mounts) {
            str.push(w.WeaponString());
        }
        return StringFmt.Join(", ", str);
    }

    public CalcStats(armour: number[]): Stats {
        while (this.loaders.length > this.GetNumLoaders()) {
            this.loaders.pop();
        }
        if (armour[0] + armour[1] + armour[2] == 0) {
            this.coupla = false;
            for (let l of this.loaders) {
                l.coupla = false;
            }
        }

        let stat = new Stats();
        if (this.name_txt == CrewType[7].name) {
            stat.volume += 0;
        } else if (this.name_txt == CrewType[8].name) {
            stat.volume += 1;
        } else {
            stat.volume += 0.5;
        }

        if (this.enclosed && this.coupla)
            stat.cost += 1;

        for (let idx = 0; idx < this.loaders.length; idx++) {
            stat.volume += 0.5;
            if (this.loaders[idx].enclosed && this.loaders[idx].coupla)
                stat.cost += 1;
        }

        for (let w of this.weapon_mounts) {
            stat.add(w.CalcStats(this.enclosed, armour));
        }
        return stat;
    }
}