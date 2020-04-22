/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Munitions extends Part {
    private bomb_count: number;
    private internal_bay_count: number;
    private internal_bay_1: boolean;
    private internal_bay_2: boolean;
    private acft_struct: number;
    private maxbomb: number;

    constructor() {
        super();

        this.bomb_count = 0;
        this.internal_bay_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }

    public toJSON() {
        return {
            bomb_count: this.bomb_count,
            bay_count: this.internal_bay_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        }
    }

    public fromJSON(js: JSON) {
        this.bomb_count = js["bomb_count"];
        this.internal_bay_count = js["bay_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
    }

    public serialize(s: Serialize) {
        s.PushNum(this.bomb_count);
        s.PushNum(this.internal_bay_count);
        s.PushBool(this.internal_bay_1);
        s.PushBool(this.internal_bay_2);
    }

    public deserialize(d: Deserialize) {
        this.bomb_count = d.GetNum();
        this.internal_bay_count = d.GetNum();
        this.internal_bay_1 = d.GetBool();
        this.internal_bay_2 = d.GetBool();
    }

    public GetBombCount() {
        return this.bomb_count;
    }

    public GetMaxBombSize() {
        var sz = 0;
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                if (this.internal_bay_2) {
                    sz = Math.floor(10 * this.internal_bay_count);
                }
                else {
                    sz = Math.floor(10 * this.internal_bay_count / 2);
                }
            }
            else {
                sz = Math.floor(10 * this.internal_bay_count / 4);
            }
        }
        return sz;
    }

    public SetBombCount(count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.bomb_count = count;
        this.LimitMass(true);
        this.CalculateStats();
    }

    public GetBayCount() {
        return this.internal_bay_count;
    }

    public GetBay1() {
        return this.internal_bay_1;
    }

    public GetBay2() {
        return this.internal_bay_2;
    }

    public SetBayCount(count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(count);
        this.internal_bay_count = count;
        this.CalculateStats();
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
        while (this.bomb_count > this.acft_struct * this.maxbomb) {
            reduce = true;
            this.bomb_count--;
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

        var ext_mass = ext_bomb_count;
        return ext_mass;
    }

    public SetAcftStructure(num: number, maxbomb: number) {
        this.acft_struct = num;
        this.maxbomb = maxbomb;
        if (this.LimitMass(false)) {
            this.CalculateStats();
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        var ext_bomb_count = this.bomb_count - 10 * this.internal_bay_count;
        ext_bomb_count = Math.max(0, ext_bomb_count);
        stats.reqsections += this.internal_bay_count;

        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                stats.reqsections++;
                if (this.internal_bay_2) {
                    stats.reqsections++;
                }
            }
        }

        var rack_mass = Math.ceil(ext_bomb_count / 5);
        stats.mass += rack_mass;
        stats.bomb_mass = this.bomb_count;

        stats.reqsections = Math.ceil(stats.reqsections);

        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);

        return stats;
    }
}