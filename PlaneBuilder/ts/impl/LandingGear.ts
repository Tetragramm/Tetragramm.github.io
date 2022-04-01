import { Part } from "./Part";
import { Stats } from "./Stats";
import { Serialize, Deserialize, BoolArr } from "./Serialize";
import { lu } from "./Localization";

export class LandingGear extends Part {
    private gear_list: { name: string, stats: Stats, DpLMP: number, SpLMP: number, can_retract: boolean }[];
    private gear_sel: number;
    private retract: boolean;
    private extra_list: { name: string, stats: Stats, MpLMP: number }[];
    private extra_sel: boolean[];
    private loadedMass: number;
    public can_boat: boolean;
    private gull_deck: number;

    constructor(js: JSON) {
        super();

        this.gear_list = [];
        this.gear_sel = 0;
        this.retract = false;
        for (const elem of js["gear"]) {
            this.gear_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                DpLMP: elem["DpLMP"],
                SpLMP: elem["SpLMP"],
                can_retract: elem["can_retract"]
            });
        }

        this.extra_list = [];
        for (const elem of js["extras"]) {
            this.extra_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                MpLMP: elem["MpLMP"]
            });
        }
        this.extra_sel = [...Array(this.extra_list.length).fill(false)];
    }

    public toJSON() {
        return {
            gear_sel: this.gear_sel,
            retract: this.retract,
            extra_sel: this.extra_sel,
        };
    }

    public fromJSON(js: JSON, json_version: number) {
        this.gear_sel = js["gear_sel"];
        this.retract = js["retract"];
        this.extra_sel = BoolArr(js["extra_sel"], this.extra_sel.length);
    }

    public serialize(s: Serialize) {
        s.PushNum(this.gear_sel);
        s.PushBool(this.retract);
        s.PushBoolArr(this.extra_sel);
    }

    public deserialize(d: Deserialize) {
        this.gear_sel = d.GetNum();
        this.retract = d.GetBool();
        this.extra_sel = d.GetBoolArr(this.extra_sel.length);
    }

    public GetGearName() {
        if (this.retract && this.gear_list[this.gear_sel].name == "Boat Hull") {
            return lu("Retractable Gear + Boat Hull");
        }
        if (this.retract)
            return lu("Retractable ") + lu(this.gear_list[this.gear_sel].name);
        else
            return lu(this.gear_list[this.gear_sel].name);
    }

    public GetGearList() {
        return this.gear_list;
    }

    public CanGear() {
        const count = [...Array(this.gear_list.length).fill(true)];
        for (let i = 0; i < this.gear_list.length; i++) {
            const g = this.gear_list[i];
            if (g.name == "Boat Hull" && !this.can_boat)
                count[i] = false;
        }
        return count;
    }

    public GetGear() {
        return this.gear_sel;
    }

    public SetGear(num: number) {
        if (this.CanGear()[num])
            this.gear_sel = num;
        this.CalculateStats();
    }

    public CanRetract() {
        return this.gear_list[this.gear_sel].can_retract
            || this.gear_list[this.gear_sel].name == "Boat Hull";
    }

    public GetRetract() {
        return this.retract;
    }

    public SetRetract(is: boolean) {
        this.retract = is && this.CanRetract();
        this.CalculateStats();
    }

    public GetExtraList() {
        return this.extra_list;
    }

    public GetExtraSelected() {
        return this.extra_sel;
    }

    public SetExtraSelected(idx: number, is: boolean) {
        this.extra_sel[idx] = is;
        this.CalculateStats();
    }

    public SetLoadedMass(mass: number) {
        this.loadedMass = mass;
    }

    public CanBoat(engine_height: number, wing_height: number) {
        if (engine_height == 2)
            this.can_boat = true;
        else if (engine_height == 1 && wing_height >= 3)
            this.can_boat = true;
        else if (engine_height == 0 && wing_height >= 4)
            this.can_boat = true;
        else
            this.can_boat = false;
    }

    public SetGull(deck: number) {
        this.gull_deck = deck;
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public IsVital() {
        return true;
    }

    public PartStats() {
        var stats = new Stats();
        if (!this.CanGear()[this.gear_sel])
            this.gear_sel = 0;

        //Do this first, so we can add the Zepplin Hook to the mass
        //TODO: This is a hack, and it is terrible. Separate hook?
        var tempMass = this.loadedMass;
        for (let i = 0; i < this.extra_list.length; i++) {
            if (this.extra_sel[i]) {
                stats = stats.Add(this.extra_list[i].stats);
                tempMass += this.extra_list[i].stats.mass;
                stats.mass += Math.floor(1.0e-6 + this.extra_list[i].MpLMP * Math.floor(1.0e-6 + tempMass / 5));
            }
        }

        stats = stats.Add(this.gear_list[this.gear_sel].stats);
        var pdrag = this.gear_list[this.gear_sel].DpLMP * Math.floor(1.0e-6 + tempMass / 5);

        //Retractable gear with Boat Hull adds normal hull drag,
        // plus the mass and cost of normal retrctable gear
        if (this.gear_list[this.gear_sel].name == "Boat Hull" && this.retract) {
            stats.drag += pdrag;
            pdrag = this.gear_list[0].DpLMP * Math.floor(1.0e-6 + tempMass / 5);
        }

        //Gull wings don't affect Boat Hulls, but do affect the normal gear you get
        //if you put retract on your boat hull.  Since the hull is already applied,
        //we can just modify here.
        if (this.gear_list[this.gear_sel].name != "Boat Hull" || this.retract) {
            switch (this.gull_deck) {
                case 1: //Shoulder
                    pdrag -= Math.floor(1.0e-6 + 0.1 * pdrag);
                    break;
                case 2: //Mid
                case 3: //Low
                    pdrag -= Math.floor(1.0e-6 + 0.15 * pdrag);
                    break;
                case 4: //Gear
                    pdrag -= Math.floor(1.0e-6 + 0.25 * pdrag);
                    break;
                default:
                //No change
            }
        }

        if (this.retract) {
            stats.mass += Math.floor(1.0e-6 + pdrag / 2);
            stats.cost += Math.floor(1.0e-6 + pdrag / 2);
        } else {
            stats.drag += pdrag;
        }
        stats.structure += this.gear_list[this.gear_sel].SpLMP * Math.floor(1.0e-6 + tempMass / 5);

        stats.Round();

        return stats;
    }

    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
