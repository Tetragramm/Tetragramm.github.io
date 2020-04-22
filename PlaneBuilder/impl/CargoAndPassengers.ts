/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class CargoAndPassengers extends Part {
    private cargo_list: { name: string, stats: Stats }[];
    private cargo_sel: number;

    constructor(js: JSON) {
        super();
        this.cargo_list = [];
        for (let elem of js["spaces"]) {
            this.cargo_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cargo_sel = 0;
    }

    public toJSON() {
        return {
            space_sel: this.cargo_sel,
        }
    }

    public fromJSON(js: JSON) {
        this.cargo_sel = js["space_sel"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.cargo_sel);
    }

    public deserialize(d: Deserialize) {
        this.cargo_sel = d.GetNum();
    }

    public GetSpaceList() {
        return this.cargo_list;
    }

    public GetSpace() {
        return this.cargo_sel;
    }

    public SetSpace(num: number) {
        this.cargo_sel = num;
        this.CalculateStats();
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.cargo_list[this.cargo_sel].stats);

        stats.wetmass += stats.reqsections * 3;

        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);

        return stats;
    }
}