/// <reference path="./Stats.ts" />
/// <reference path="./EngineStats.ts" />

class EngineList {
    private list: EngineInputs[];
    public name: string;
    public constant = false;

    constructor(name: string) {
        this.name = name;
        this.list = [];
        var ejson = window.localStorage.getItem("engines." + this.name);
        if (ejson != null)
            this.fromJSON(JSON.parse(ejson));

        var nameliststr = window.localStorage.getItem("engines_names");
        var namelist = [];
        if (nameliststr) {
            namelist = JSON.parse(nameliststr);
        }
        var hasname = false;
        for (let e of namelist) {
            if (e == name) {
                hasname = true;
                break;
            }
        }
        if (!hasname)
            namelist.push(name);
        window.localStorage.setItem("engines_names", JSON.stringify(namelist));
    }

    public toJSON() {
        var ret = [];
        for (let li of this.list) {
            ret.push(li.toJSON());
        }
        return { name: this.name, engines: ret };
    }

    public fromJSON(js: JSON, force = false) {
        if (js["name"])
            this.name = js["name"];

        if (force) {
            this.list = [];
        }

        for (let elem of js["engines"]) {
            try {
                this.push(new EngineInputs(elem), force);
            } catch (e) {
                console.error(e);
            }
        }
    }

    public deserializeEngine(d: Deserialize) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        let stats = new EngineInputs();
        stats.deserialize(d);
        return this.push(stats);
    }

    public push(es: EngineInputs, force = false) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        if (force) {
            this.remove(es);
        } else {
            for (let i = 0; i < this.length; i++) {
                let li = this.list[i];
                if (li.Equal(es)) {
                    return i;
                }
            }
        }
        this.list.push(es.Clone());
        this.list = this.list.sort((a, b) => { return ('' + a.name).localeCompare(b.name); });
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
        return this.find(es);
    }

    public get(i: number) {
        if (i < 0 || i >= this.length)
            return new EngineInputs();
        return this.list[i];
    }

    public get_name(n: string) {
        var i = this.find_name(n);
        return this.get(i);
    }

    public get_stats(i: number) {
        if (i < 0 || i >= this.length)
            return new EngineStats();
        return this.list[i].PartStats();
    }

    public get_stats_name(n: string) {
        var i = this.find_name(n);
        return this.get_stats(i);
    }

    public find(es: EngineInputs) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }

    public find_name(n: string) {
        for (let i = 0; i < this.length; i++) {
            if (this.list[i].name == n)
                return i;
        }
        return -1;
    }

    public remove(es: EngineInputs) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        var idx = this.find(es);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }

    public remove_name(name: string) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        var idx = this.find_name(name);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }

    get length(): number {
        return this.list.length;
    }

    public SetConstant() {
        this.constant = true;
    }
}

function SearchAllEngineLists(n: string) {
    for (let key of engine_list.keys()) {
        if (key != "Custom") {
            let elist = engine_list.get(key);
            let idx = elist.find_name(n);
            if (idx >= 0) {
                return key;
            }
        }
    }
    let idx = engine_list.get("Custom").find_name(n);
    if (idx >= 0) {
        return "Custom";
    }
    return "";
}