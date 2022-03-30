import { EngineStats } from "./EngineStats.js";
import { EngineInputs } from "./EngineInputs.js";
export class EngineList {
    constructor(name) {
        this.constant = false;
        this.name = name;
        this.list = [];
        const ejson = window.localStorage.getItem("engines." + this.name);
        if (ejson != null)
            this.fromJSON(JSON.parse(ejson));
        const nameliststr = window.localStorage.getItem("engines_names");
        let namelist = [];
        if (nameliststr) {
            namelist = JSON.parse(nameliststr);
        }
        let hasname = false;
        for (const e of namelist) {
            if (e == name) {
                hasname = true;
                break;
            }
        }
        if (!hasname)
            namelist.push(name);
        window.localStorage.setItem("engines_names", JSON.stringify(namelist));
    }
    toJSON() {
        const ret = [];
        for (const li of this.list) {
            ret.push(li.toJSON());
        }
        return { name: this.name, engines: ret };
    }
    fromJSON(js, force = false) {
        if (js["name"])
            this.name = js["name"];
        if (force) {
            this.list = [];
        }
        for (const elem of js["engines"]) {
            try {
                this.push(new EngineInputs(elem), force);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    deserializeEngine(d) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        const stats = new EngineInputs();
        stats.deserialize(d);
        return this.push(stats);
    }
    push(es, force = false) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        if (force) {
            this.remove(es);
        }
        else {
            for (let i = 0; i < this.length; i++) {
                const li = this.list[i];
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
    get(i) {
        if (i < 0 || i >= this.length)
            return new EngineInputs();
        return this.list[i];
    }
    get_name(n) {
        const i = this.find_name(n);
        return this.get(i);
    }
    get_stats(i) {
        if (i < 0 || i >= this.length)
            return new EngineStats();
        return this.list[i].PartStats();
    }
    get_stats_name(n) {
        const i = this.find_name(n);
        return this.get_stats(i);
    }
    find(es) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }
    find_name(n) {
        for (let i = 0; i < this.length; i++) {
            if (this.list[i].name == n)
                return i;
        }
        return -1;
    }
    remove(es) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        const idx = this.find(es);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }
    remove_name(name) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        const idx = this.find_name(name);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }
    get length() {
        return this.list.length;
    }
    SetConstant() {
        this.constant = true;
    }
}
var engine_JSON;
var engine_list = new Map([["Custom", new EngineList("Custom")]]);
//TODO: Make sure Global Variable sets.
export function SetEngineLists(el, nameliststr) {
    engine_JSON = el;
    var namelist = [];
    if (nameliststr) {
        namelist = JSON.parse(nameliststr);
        for (let n of namelist) {
            n = n.trim();
            n = n.replace(/\s+/g, ' ');
            if (n != "") {
                engine_list.set(n, new EngineList(n));
            }
        }
    }
    for (let el of engine_JSON["lists"]) {
        if (!engine_list.has(el["name"]))
            engine_list.set(el["name"], new EngineList(el["name"]));
        if (el["name"] != "Custom") {
            engine_list.get(el["name"]).fromJSON(el, true);
            engine_list.get(el["name"]).SetConstant();
        }
        else {
            engine_list.get(el["name"]).fromJSON(el, false);
        }
    }
}
export function GetEngineLists() {
    return engine_list;
}
export function GetEngineJSON() {
    return engine_JSON;
}
export function SearchAllEngineLists(n) {
    const engine_list = new Map([["Custom", new EngineList("Custom")]]);
    for (const el of engine_JSON["lists"]) {
        if (!engine_list.has(el["name"]))
            engine_list.set(el["name"], new EngineList(el["name"]));
        if (el["name"] != "Custom") {
            engine_list.get(el["name"]).fromJSON(el, true);
            engine_list.get(el["name"]).SetConstant();
        }
        else {
            engine_list.get(el["name"]).fromJSON(el, false);
        }
    }
    for (const key of engine_list.keys()) {
        if (key != "Custom") {
            const elist = engine_list.get(key);
            const idx = elist.find_name(n);
            if (idx >= 0) {
                return key;
            }
        }
    }
    const idx = engine_list.get("Custom").find_name(n);
    if (idx >= 0) {
        return "Custom";
    }
    return "";
}
