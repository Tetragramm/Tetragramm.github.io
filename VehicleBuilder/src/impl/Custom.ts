import { Deserialize, Serialize } from "./Serialize";
import { Stats, WARNING_COLOR } from "./Stats";
import { Weapon } from "./Weapon";

export class Custom {
    private weapons: Weapon[] = [];
    private parts: { name: string, stats: Stats }[] = [];

    public Serialize(s: Serialize) {
        s.PushNum(this.weapons.length);
        for (let w of this.weapons) {
            w.Serialize(s);
        }
        s.PushNum(this.parts.length);
        for (let p of this.parts) {
            s.PushString(p.name);
            p.stats.Serialize(s);
        }
    }

    public Deserialize(d: Deserialize) {
        let wlen = d.GetNum();
        this.weapons = [];
        for (let widx = 0; widx < wlen; widx++) {
            this.weapons.push(new Weapon({ name: "", abbr: "", cost: 0 }));
            this.weapons[widx].Deserialize(d);
        }
        let plen = d.GetNum();
        this.parts = [];
        for (let pidx = 0; pidx < plen; pidx++) {
            this.parts.push({ name: d.GetString(), stats: new Stats() });
            this.parts[pidx].stats.Deserialize(d);
        }
    }

    public SetWeapon(idx: number, name: string, cost: number, loader: boolean, heavy: number, artillery: boolean) {
        if (artillery) {
            heavy = Math.max(1, Math.floor(1.0e-6 + heavy));
            loader = true;
        }
        cost = Math.floor(1.0e-6 + cost);
        if (idx >= 0 && idx < this.weapons.length) {
            this.weapons[idx] = new Weapon({ name: name, abbr: name, cost: cost, loader: loader, heavy: heavy, artillery: artillery });
        } else {
            console.error("Custom SetWeapon index out of range");
        }
    }

    public RemoveWeapon() {
        this.weapons.pop();
    }

    public AddWeapon() {
        this.weapons.push(new Weapon({ name: "Default", abbr: "Default", cost: 0 }));
    }

    public GetWeapons(): Weapon[] {
        return this.weapons;
    }

    public SetPart(idx: number, name: string, stats: Stats) {
        if (idx >= 0 && idx < this.parts.length) {
            this.parts[idx] = { name: name, stats: stats };
        } else {
            console.error("Custom SetPart index out of range");
        }
    }

    public RemovePart() {
        this.parts.pop();
    }

    public AddPart() {
        this.parts.push({ name: "Default", stats: new Stats({ warnings: [{ source: "Default", warning: "No Special Rules", color: WARNING_COLOR.YELLOW }] }) });
    }

    public GetParts(): { name: string, stats: Stats }[] {
        return this.parts;
    }

    public Reset() {
        this.parts = [];
        this.weapons = [];
    }

}