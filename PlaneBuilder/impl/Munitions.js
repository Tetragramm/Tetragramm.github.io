import { Part } from "./Part.js";
import { Stats } from "./Stats.js";
export class Munitions extends Part {
    constructor() {
        super();
        this.bomb_count = 0;
        this.rocket_count = 0;
        this.internal_bay_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }
    toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay_count: this.internal_bay_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        };
    }
    fromJSON(js, json_version) {
        this.bomb_count = js["bomb_count"];
        this.internal_bay_count = js["bay_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
        if (json_version > 10.75) {
            this.rocket_count = js["rocket_count"];
        }
    }
    serialize(s) {
        s.PushNum(this.bomb_count);
        s.PushNum(this.internal_bay_count);
        s.PushBool(this.internal_bay_1);
        s.PushBool(this.internal_bay_2);
        s.PushNum(this.rocket_count);
    }
    deserialize(d) {
        this.bomb_count = d.GetNum();
        this.internal_bay_count = d.GetNum();
        this.internal_bay_1 = d.GetBool();
        this.internal_bay_2 = d.GetBool();
        if (d.version > 10.75) {
            this.rocket_count = d.GetNum();
        }
    }
    GetRocketCount() {
        return this.rocket_count;
    }
    GetBombCount() {
        return this.bomb_count;
    }
    GetInternalBombCount() {
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
    GetMaxBombSize() {
        var sz = 0;
        const ibc = this.GetInternalBombCount();
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
    SetRocketCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.rocket_count = count;
        this.LimitMass();
        this.CalculateStats();
    }
    SetBombCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.bomb_count = count;
        this.LimitMass();
        this.CalculateStats();
    }
    GetBayCount() {
        return this.internal_bay_count;
    }
    GetBay1() {
        return this.internal_bay_1;
    }
    GetBay2() {
        return this.internal_bay_2;
    }
    SetBayCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.internal_bay_count = count;
        this.CalculateStats();
    }
    SetUseBays(bay1, bay2) {
        this.internal_bay_1 = bay1;
        this.internal_bay_2 = bay2;
        if (!this.internal_bay_1 && this.internal_bay_2) {
            this.internal_bay_1 = true;
            this.internal_bay_2 = false;
        }
        this.CalculateStats();
    }
    LimitMass() {
        var reduce = false;
        const allowed_internal = Math.min(this.GetInternalBombCount(), Math.floor(1.0e-6 + 3 * this.acft_struct * this.maxbomb));
        var ib = 0;
        var ir = 0;
        var eb = 0;
        var er = 0;
        if (this.bomb_count > allowed_internal) {
            ib = allowed_internal;
        }
        else {
            ib = this.bomb_count;
        }
        if (this.rocket_count + ib > allowed_internal) {
            ir = allowed_internal - ib;
        }
        else {
            ir = this.rocket_count;
        }
        eb = this.bomb_count - ib;
        er = this.rocket_count - ir;
        const allowed_external = Math.floor(1.0e-6 + this.acft_struct * this.maxbomb - (ib + ir) / 3) * this.gull_factor;
        while (eb + er > allowed_external) {
            if (er > 0) {
                er--;
            }
            else {
                eb--;
            }
        }
        if (this.bomb_count > ib + eb) {
            reduce = true;
            this.bomb_count = ib + eb;
        }
        if (this.rocket_count > ir + er) {
            reduce = true;
            this.rocket_count = ir + er;
        }
        return reduce;
    }
    GetExternalMass() {
        const ext_bomb_count = this.bomb_count + this.rocket_count;
        return Math.max(0, ext_bomb_count - this.GetInternalBombCount());
    }
    SetAcftParameters(struct, maxbomb, gull_deck) {
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        const stats = new Stats();
        const ext_bomb_count = this.GetExternalMass();
        stats.reqsections += this.internal_bay_count;
        if (this.internal_bay_count > 0) {
            const count = stats.reqsections;
            if (this.internal_bay_1) {
                stats.reqsections += count;
                if (this.internal_bay_2) {
                    stats.reqsections += count;
                }
            }
        }
        const rack_mass = Math.ceil(-1.0e-6 + ext_bomb_count / 5);
        stats.mass += rack_mass;
        stats.drag += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;
        stats.reqsections = Math.ceil(-1.0e-6 + stats.reqsections);
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}
