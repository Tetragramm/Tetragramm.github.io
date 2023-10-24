import { StringFmt } from "../string";
import { Deserialize, Serialize } from "./Serialize";
import { Stats, WARNING_COLOR } from "./Stats";

export class Weapon {
    public name: string;
    public abbr: string;
    public cost: number;
    public loader: boolean;
    public heavy: number;
    public artillery: boolean;

    constructor(js: { name: string, abbr: string, cost: number, loader?: boolean, heavy?: number, artillery?: boolean }) {
        this.name = js.name;
        this.abbr = js.abbr;
        this.cost = js.cost;
        this.loader = js.loader ?? false;
        this.heavy = js.heavy ?? 0;
        this.artillery = js.artillery ?? false;
        if (this.artillery) {
            this.loader = true;
        }
    }

    public Serialize(s: Serialize) {
        s.PushString(this.name);
        s.PushString(this.abbr);
        s.PushNum(this.cost);
        s.PushBool(this.loader);
        s.PushNum(this.heavy);
        s.PushBool(this.artillery);
    }

    public Deserialize(d: Deserialize) {
        this.name = d.GetString();
        this.abbr = d.GetString();
        this.cost = d.GetNum();
        this.loader = d.GetBool();
        this.heavy = d.GetNum();
        this.artillery = d.GetBool();
    }
}

export var BaseWeaponList: Weapon[] = [
    new Weapon({ name: "None", abbr: undefined, cost: undefined, loader: false }),
    new Weapon({ name: "Searchlight", abbr: "SL", cost: 1 }),
    new Weapon({ name: "Trench Gun", abbr: "TG", cost: 2 }),
    new Weapon({ name: "Aircraft Shotgun", abbr: "ASG", cost: 2 }),
    new Weapon({ name: "Converted Autorifle", abbr: "CAR", cost: 1 }),
    new Weapon({ name: "Machine Carbine", abbr: "MC", cost: 5 }),
    new Weapon({ name: "Heavy Submachine Gun", abbr: "HSG", cost: 2, loader: true }),
    new Weapon({ name: "Firing Port Weapon", abbr: "FPW", cost: 2 }),
    new Weapon({ name: "Landflammenwerfer", abbr: "LFW", cost: 3 }),
    new Weapon({ name: "Static Gun", abbr: "Static Gun", cost: 4 }),
    new Weapon({ name: "Light Machine Gun", abbr: "LMG", cost: 2, loader: true }),
    new Weapon({ name: "Water-Cooled Machine Gun", abbr: "WMG", cost: 3, loader: true, heavy: 2 }),
    new Weapon({ name: "Automatic Rifle", abbr: "AR", cost: 3, loader: true }),
    new Weapon({ name: "Hailstorm Shotgun", abbr: "HSS", cost: 4, loader: true, heavy: 3 }),
    new Weapon({ name: "Rotary Machine Gun", abbr: "RMG", cost: 5, loader: true, heavy: 2 }),
    new Weapon({ name: "PuF Machine Gun", abbr: "PMG", cost: 5, loader: true, heavy: 3 }),
    new Weapon({ name: "Anti-Tank Rifle", abbr: "ATR", cost: 4, loader: false }),
    new Weapon({ name: "Coilgun Rifle", abbr: "Coilgun Rifle", cost: 10, loader: false }),
    new Weapon({ name: "Trench Mortar", abbr: "TM", cost: 1, loader: true }),
    new Weapon({ name: "Repeater Cannon", abbr: "RPC", cost: 6, loader: true, heavy: 3 }),
    new Weapon({ name: "Infantry Support Cannon", abbr: "ISC", cost: 6, heavy: 2, artillery: true }),
    new Weapon({ name: "Recoilless Cannon", abbr: "RRC", cost: 5, loader: true, heavy: 2 }),
    new Weapon({ name: "Pom-Pom Gun", abbr: "POM", cost: 10, artillery: true, heavy: 3 }),
    new Weapon({ name: "Flak Cannon", abbr: "FLAK", cost: 5, artillery: true, heavy: 3 }),
    new Weapon({ name: "Field Cannon", abbr: "FC", cost: 8, artillery: true, heavy: 3 }),
    new Weapon({ name: "Heavy Field Cannon", abbr: "HFC", cost: 15, artillery: true, heavy: 5 }),
    new Weapon({ name: "Rocket Artillery Rail", abbr: "RAR", cost: 2, artillery: true, heavy: 0.5 }),
    new Weapon({ name: "Assault Howitzer", abbr: "AH", cost: 8, artillery: true, heavy: 4 }),
    new Weapon({ name: "Company Mortar", abbr: "Company Mortar", cost: 3, artillery: true, heavy: 3 }),
    new Weapon({ name: "Light Howitzer", abbr: "Light Howitzer", cost: 8, artillery: true, heavy: 4 }),
    new Weapon({ name: "Medium Howitzer", abbr: "Medium Howitzer", cost: 12, artillery: true, heavy: 5 }),
    new Weapon({ name: "Siege Cannon", abbr: "Siege Cannon", cost: 16, artillery: true, heavy: 6 }),
]

var WeaponList: Weapon[] = [...BaseWeaponList];

export function SetWeaponList(w: Weapon[]) {
    WeaponList = [...BaseWeaponList, ...w];
}

export function GetWeaponList(): Weapon[] {
    return WeaponList;
}

export var GunsightList: string[] = [
    "None",
    "Lead Gunsight",
    "Binocular Gunsight",
];

export class WeaponMount {
    public main_idx: number;
    public directions: boolean[];
    public secondary_idx: number[];
    public shield: boolean;
    public gunsight: number;
    public rocket_count: number;

    // wrow.f.checked = witm.directions[0];
    // wrow.r.checked = witm.directions[1];
    // wrow.b.checked = witm.directions[2];
    // wrow.l.checked = witm.directions[3];
    // wrow.u.checked = witm.directions[4];

    constructor(m: number, dir: boolean[], sec: number[], sh: boolean, gs: number, rc: number) {
        this.main_idx = m;
        this.directions = dir;
        this.secondary_idx = sec;
        this.shield = sh;
        this.secondary_idx = this.secondary_idx.filter((value) => { return value > 0 });
        if (this.main_idx == 0 && this.secondary_idx.length > 0) {
            this.main_idx = this.secondary_idx[0]
            this.secondary_idx.splice(0, 1);
        }
        this.gunsight = gs;
        this.rocket_count = rc;
    }

    public Serialize(s: Serialize) {
        s.PushNum(this.main_idx);
        s.PushBoolArr(this.directions);
        s.PushNumArr(this.secondary_idx);
        s.PushBool(this.shield);
        s.PushNum(this.gunsight);
        s.PushNum(this.rocket_count);
    }

    public Deserialize(d: Deserialize) {
        this.main_idx = d.GetNum();
        this.directions = d.GetBoolArr(5);
        this.secondary_idx = d.GetNumArr(0);
        this.shield = d.GetBool();
        this.gunsight = d.GetNum();
        this.rocket_count = d.GetNum();
    }

    public GetNumLoaders() {
        this.main_idx = Math.min(WeaponList.length - 1, this.main_idx);
        let count = 0;
        if (WeaponList[this.main_idx].loader)
            count++;
        for (let sec of this.secondary_idx) {
            if (WeaponList[sec].loader)
                count++;
        }
        return count;
    }

    public CalcStats(closed: boolean, armour: number[]): Stats {

        this.main_idx = Math.min(WeaponList.length - 1, this.main_idx);
        for (let sidx = 0; sidx < this.secondary_idx.length; sidx++) {
            this.secondary_idx[sidx] = Math.min(WeaponList.length - 1, this.secondary_idx[sidx]);
        }

        let stat = new Stats();
        if (this.main_idx > 0) {
            stat.add(this.WeapStats(this.main_idx));
            if (WeaponList[this.main_idx].artillery && WeaponList[this.main_idx].abbr != "ISC") {
                if (closed)
                    stat.cost += this.ArtyDirCost(this.main_idx, armour);
                else
                    stat.cost += this.ArtyDirCost(this.main_idx, [0, 0, 0]);
            } else {
                stat.cost += this.NonArtyDirCost();
            }
            for (let sidx of this.secondary_idx) {
                stat.add(this.WeapStats(sidx));
                stat.cost += 3;
                if (WeaponList[sidx].artillery && WeaponList[sidx].abbr != "ISC") {
                    if (closed)
                        stat.cost += this.ArtyDirCost(sidx, armour);
                    else
                        stat.cost += this.ArtyDirCost(sidx, [0, 0, 0]);
                } else {
                    stat.cost += this.NonArtyDirCost();
                }
            }
            if (this.shield)
                stat.cost += 3;
            if (this.gunsight == 1) {
                stat.cost += 5;
                stat.warnings.push({ source: GunsightList[this.gunsight], warning: "When Stationary, reduces Deflection Shot attack penalty by 2 for this weapon mount. Cannot give a bonus.", color: WARNING_COLOR.WHITE });
            } else if (this.gunsight == 2) {
                stat.cost += 5;
                stat.warnings.push({ source: GunsightList[this.gunsight], warning: "When Stationary, reduces Range Band attack penalty by 2 for this weapon mount. Cannot give a bonus.", color: WARNING_COLOR.WHITE });
            }
        }
        return stat;
    }

    private ArtyDirCost(idx: number, armour: number[]): number {
        let cost = this.ArmourCost(armour);
        let horiz = this.directions.slice(0, 4);
        let sum = 0;
        horiz.map((sum = 0, n => { if (n) { sum += 1; } }));
        cost += Math.max(sum - 1, 0);
        if (this.directions[4] && WeaponList[idx].abbr != "FLAK")
            cost += 3 + armour[1];
        return cost;
    }

    private NonArtyDirCost(): number {
        let horiz = this.directions.slice(0, 4);
        let sum = 0;
        horiz.map((sum = 0, n => { if (n) { sum += 1; } }));
        let cost = 0;
        if (sum > 1) {
            cost += 1;
        }
        if (this.directions[4])
            cost += 1;
        return cost;
    }

    private WeapStats(idx: number): Stats {
        let stat = new Stats();
        let w = WeaponList[idx];
        stat.cost += w.cost;
        if (w.artillery && w.abbr != "ISC" && w.abbr != "RAR") {
            stat.volume = Math.ceil(w.heavy / 2.0);
            stat.integrity -= 3;
        } else if (w.abbr == "RAR") {
            stat.cost += (this.rocket_count - 1) * w.cost; //One is already applied
            stat.volume = Math.ceil(w.heavy * this.rocket_count / 2.0);
            stat.cost += 2;
            stat.integrity -= 3;
        }
        return stat;
    }

    public IsArty(): boolean {
        this.main_idx = Math.min(WeaponList.length - 1, this.main_idx);
        if (WeaponList[this.main_idx].artillery && WeaponList[this.main_idx].abbr != "ISC")
            return true;
        for (let sidx of this.secondary_idx) {
            if (WeaponList[sidx].artillery && WeaponList[sidx].abbr != "ISC")
                return true;
        }
        return false;
    }

    private ArmourCost(armour: number[]): number {
        let cost = [0];
        if (this.directions[0])
            cost.push(armour[0]);
        if (this.directions[1])
            cost.push(armour[1]);
        if (this.directions[3])
            cost.push(armour[1]);
        if (this.directions[2])
            cost.push(armour[2]);
        cost.sort();
        cost.pop();
        let sum = 0;
        cost.map((sum = 0, n => sum += n));
        return sum;
    }

    public WeaponString(): String {
        this.main_idx = Math.min(WeaponList.length - 1, this.main_idx);
        if (this.main_idx == 0)
            return "";

        let wcount = Array(WeaponList.length).fill(0);
        wcount[this.main_idx]++;
        for (let s of this.secondary_idx) {
            wcount[s]++;
        }
        let wstr;
        if (WeaponList[this.main_idx].abbr == "RAR") {
            wstr = StringFmt.Format("{0}x {1}", this.rocket_count, WeaponList[this.main_idx].abbr);
        } else {
            if (wcount[this.main_idx] == 1)
                wstr = WeaponList[this.main_idx].abbr;
            else
                wstr = StringFmt.Format("{0}x {1}", wcount[this.main_idx], WeaponList[this.main_idx].abbr);
        }
        wcount[this.main_idx] = 0;
        let wcoax = false;
        for (let widx = wcount.length - 1; widx > 0; widx--) {
            if (wcount[widx] > 0) {
                wstr += " +Co-Ax ";
                if (wcount[widx] == 1)
                    wstr += WeaponList[widx].abbr;
                else
                    wstr += StringFmt.Format("{0}x {1}", wcount[widx], WeaponList[widx].abbr);
            }
        }
        let directions = [];
        if (this.directions[0] && this.directions[1] && this.directions[2] && this.directions[3]) {
            directions.push("All Horizontal");
        } else {
            if (this.directions[0])
                directions.push("Fore");
            if (this.directions[1])
                directions.push("Right");
            if (this.directions[2])
                directions.push("Rear");
            if (this.directions[3])
                directions.push("Left");
        }
        if (this.directions[4]) {
            directions.push("Up");
        }

        let accessories = [];
        if (this.shield)
            accessories.push("Gun Shield");
        if (this.gunsight != 0)
            accessories.push(GunsightList[this.gunsight]);

        let temp = [StringFmt.Format("{0} ({1})", wstr, StringFmt.Join(", ", directions)), StringFmt.Join(", ", accessories)];
        temp = temp.filter((value) => { return value.length != 0; });
        return StringFmt.Join(", ", temp);
    }
}