/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />

class Munitions extends Part {
    private bomb_count: number;
    private rocket_count: number;
    private internal_bay_count: number;
    private internal_bay_1: boolean;
    private internal_bay_2: boolean;
    private acft_struct: number;
    private maxbomb: number;
    private gull_factor: number;

    constructor() {
        super();

        this.bomb_count = 0;
        this.rocket_count = 0;
        this.internal_bay_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }

    public toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay_count: this.internal_bay_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.bomb_count = js["bomb_count"];
        this.internal_bay_count = js["bay_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
        if (json_version > 10.75) {
            this.rocket_count = js["rocket_count"];
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.bomb_count);
        s.PushNum(this.internal_bay_count);
        s.PushBool(this.internal_bay_1);
        s.PushBool(this.internal_bay_2);
        s.PushNum(this.rocket_count);
    }

    public deserialize(d: Deserialize) {
        this.bomb_count = d.GetNum();
        this.internal_bay_count = d.GetNum();
        this.internal_bay_1 = d.GetBool();
        this.internal_bay_2 = d.GetBool();
        if (d.version > 10.75) {
            this.rocket_count = d.GetNum();
        }
    }

    public GetRocketCount() {
        return this.rocket_count;
    }

    public GetBombCount() {
        return this.bomb_count;
    }

    public GetInternalBombCount() {
        var ibc = 10 * this.internal_bay_count;
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                //Double Internal Count
                ibc *= 2;
                if (this.internal_bay_2) {
                    //Double Internal Count Again
                    ibc *= 2;
                }
            }
        }
        return ibc;
    }

    public GetMaxBombSize() {
        var sz = 0;
        var ibc = this.GetInternalBombCount();
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                if (this.internal_bay_2) {
                    sz = Math.floor(1.0e-6 + ibc);
                }
                else {
                    sz = Math.floor(1.0e-6 + ibc / 2);
                }
            }
            else {
                sz = Math.floor(1.0e-6 + ibc / 4);
            }
        }
        return sz;
    }

    public SetRocketCount(count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.rocket_count = count;
        this.LimitMass();
        this.CalculateStats();
    }

    public SetBombCount(count: number) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.bomb_count = count;
        this.LimitMass();
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
        count = Math.floor(1.0e-6 + count);
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

    private LimitMass() {
        var reduce = false;
        var allowed_internal = Math.floor(1.0e-6 + 3 * this.acft_struct * this.maxbomb);
        if (this.bomb_count > allowed_internal) {
            this.rocket_count = 0;
            reduce = true;
            this.bomb_count = allowed_internal;
        }
        var internal_bombs = Math.min(this.GetInternalBombCount(), this.bomb_count);
        var allowed_external = Math.floor(1.0e-6 + this.acft_struct * this.maxbomb - internal_bombs / 3) * this.gull_factor;
        console.log([this.acft_struct, this.maxbomb, this.gull_factor, internal_bombs, this.bomb_count, this.rocket_count]);
        while (this.bomb_count + this.rocket_count > internal_bombs + allowed_external) {
            reduce = true;
            if (this.rocket_count > 0) {
                this.rocket_count--;
            } else {
                this.bomb_count--;
            }
        }
        return reduce;
    }

    public GetExternalMass() {
        var ext_bomb_count = this.bomb_count + this.rocket_count;
        return Math.max(0, ext_bomb_count - this.GetInternalBombCount());
    }

    public SetAcftParameters(struct: number, maxbomb: number, gull_deck: number) {
        this.acft_struct = struct;
        this.maxbomb = maxbomb;
        switch (gull_deck) {
            //Parasol and Shoulder do nothing
            case 2: //Mid
            case 3: //Low
                this.gull_factor = 1.1;
                break;
            case 4: //Gear
                this.gull_factor = 1.2;
                break;
            default:
                this.gull_factor = 1;
        }
        if (this.LimitMass()) {
            this.CalculateStats();
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
    }

    public PartStats() {
        var stats = new Stats();

        var ext_bomb_count = this.GetExternalMass();
        stats.reqsections += this.internal_bay_count;

        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            var count = stats.reqsections;
            if (this.internal_bay_1) {
                stats.reqsections += count;
                if (this.internal_bay_2) {
                    stats.reqsections += count;
                }
            }
        }


        var rack_mass = Math.ceil(-1.0e-6 + ext_bomb_count / 5);
        stats.mass += rack_mass;
        stats.drag += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;

        stats.reqsections = Math.ceil(-1.0e-6 + stats.reqsections);

        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);

        return stats;
    }
}