// export { Munitions };

// import { Part } from "./Part";
// import { Stats } from "./Stats";
/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Munitions extends Part {
    private bomb_count: number;
    private rocket_count: number;
    private internal_bay_1: boolean;
    private internal_bay_2: boolean;
    private acft_struct: number;

    constructor() {
        super();

        this.bomb_count = 0;
        this.rocket_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }

    public toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        }
    }

    public fromJSON(js: JSON) {
        this.bomb_count = js["bomb_count"];
        this.rocket_count = js["rocket_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
    }

    public GetBombCount() {
        return this.bomb_count;
    }

    public SetBombCount(count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.bomb_count = count;
        this.LimitMass(true);
        this.CalculateStats();
    }

    public GetRocketCount() {
        return this.rocket_count;
    }

    public SetRocketCount(count: number) {
        if (count != count)
            count = 0;
        count = Math.floor(count);
        this.rocket_count = count;
        this.LimitMass(false);
        this.CalculateStats();
    }

    public GetBay1() {
        return this.internal_bay_1;
    }

    public GetBay2() {
        return this.internal_bay_2;
    }

    public SetUseBays(bay1: boolean, bay2: boolean) {
        this.internal_bay_1 = bay1;
        this.internal_bay_2 = bay2;
        if (!this.internal_bay_1 && this.internal_bay_2) {
            this.internal_bay_1 = true;
            this.internal_bay_2 = false;
        }
        this.CalculateStats();
    }

    private LimitMass(bomb: boolean) {
        var reduce = false;
        while (this.bomb_count + this.rocket_count > this.acft_struct / 5) {
            reduce = true;
            if ((bomb && this.bomb_count > 0)
                || (!bomb && this.rocket_count == 0)) {
                this.bomb_count--;
            }
            else {
                this.rocket_count--;
            }
        }
        return reduce;
    }

    public GetExternalMass() {
        var ext_bomb_count = this.bomb_count;
        if (this.internal_bay_1) {
            ext_bomb_count = Math.floor(ext_bomb_count / 2);
            if (this.internal_bay_2) {
                ext_bomb_count = 0;
            }
        }

        var ext_mass = ext_bomb_count + this.rocket_count;
        return ext_mass;
    }

    public SetAcftStructure(num: number) {
        this.acft_struct = num;
        if (this.LimitMass(false)) {
            this.CalculateStats();
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();
        // stats.wetmass += this.bomb_count;
        // stats.wetmass += this.rocket_count;

        var ext_bomb_count = this.bomb_count;
        if (this.internal_bay_1) {
            stats.reqsections++;
            ext_bomb_count = Math.floor(ext_bomb_count / 2);
            if (this.internal_bay_2) {
                stats.reqsections++;
                ext_bomb_count = 0;
            }
        }

        var ext_mass = ext_bomb_count + this.rocket_count;
        var rack_mass = Math.ceil(ext_mass / 5);
        stats.mass += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;

        stats.reqsections = Math.ceil(stats.reqsections);

        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);

        return stats;
    }
}