/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />

class EngineList {
    private list: EngineStats[];

    constructor() {
        this.list = [];
    }

    public toJSON() {
        var ret = [];
        for (let li of this.list) {
            ret.push(li.toJSON());
        }
        return { engines: ret };
    }

    public fromJSON(js: JSON) {
        for (let elem of js["engines"]) {
            this.push(new EngineStats(elem));
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.list.length);
        for (let li of this.list) {
            li.serialize(s);
        }
    }

    public deserialize(d: Deserialize) {
        var len = d.GetNum();
        for (let i = 0; i < len; i++) {
            let stats = new EngineStats();
            stats.deserialize(d);
            this.push(stats);
        }
    }

    public push(es: EngineStats) {
        for (let li of this.list) {
            if (li.Equal(es))
                return;
        }
        this.list.push(es.Clone());
    }

    public get(i: number) {
        return this.list[i];
    }

    public find(es: EngineStats) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }

    get length(): number {
        return this.list.length;
    }
}