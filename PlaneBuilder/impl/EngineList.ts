/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />

class EngineList {
    private list: EngineStats[];

    constructor() {
        this.list = [];
        var ejson = window.localStorage.engines;
        if (ejson != null)
            this.fromJSON(JSON.parse(ejson));
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

    public deserializeEngine(d: Deserialize) {
        let stats = new EngineStats();
        stats.deserialize(d);
        return this.push(stats);
    }

    public push(es: EngineStats) {
        for (let i = 0; i < this.length; i++) {
            let li = this.list[i];
            if (li.Equal(es))
                return i;
        }
        this.list.push(es.Clone());
        window.localStorage.engines = JSON.stringify(this.toJSON());
        this.list = this.list.sort((a, b) => { return ('' + a.name).localeCompare(b.name); });
        return this.find(es);
    }

    public get(i: number) {
        if (i < 0 || i >= this.length)
            return new EngineStats();
        return this.list[i];
    }

    public find(es: EngineStats) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }

    public remove(es: EngineStats) {
        var idx = this.find(es);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
    }

    get length(): number {
        return this.list.length;
    }
}