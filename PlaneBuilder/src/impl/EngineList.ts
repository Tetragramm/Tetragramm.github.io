import { Deserialize } from "./Serialize.js";
import { EngineStats } from "./EngineStats.js";
import { EngineInputs } from "./EngineInputs.js";
import * as engine_JSON from "../engines.json";

export class EngineList {
  private list: EngineInputs[];
  public name: string;
  public constant = false;

  constructor(name: string) {
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

  public toJSON() {
    const ret = [];
    for (const li of this.list) {
      ret.push(li.toJSON());
    }
    return { name: this.name, engines: ret };
  }

  public fromJSON(js: any, force = false) {
    if (js["name"])
      this.name = js["name"];

    if (force) {
      this.list = [];
    }

    for (const elem of js["engines"]) {
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
    const stats = new EngineInputs();
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

  public get(i: number) {
    if (i < 0 || i >= this.length)
      return new EngineInputs();
    return this.list[i];
  }

  public get_name(n: string) {
    const i = this.find_name(n);
    return this.get(i);
  }

  public get_stats(i: number) {
    if (i < 0 || i >= this.length)
      return new EngineStats();
    return this.list[i].PartStats();
  }

  public get_stats_name(n: string) {
    const i = this.find_name(n);
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
    const idx = this.find(es);
    if (idx >= 0) {
      this.list.splice(idx, 1);
    }
    window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
  }

  public remove_name(name: string) {
    if (this.constant) {
      throw "Engine List is Constant";
    }
    const idx = this.find_name(name);
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

const engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);

//TODO: Make sure Global Variable sets.
export function SetEngineLists(nameliststr: string) {
  for (const el of engine_JSON["lists"]) {
    if (!engine_list.has(el["name"]))
      engine_list.set(el["name"], new EngineList(el["name"]));
    if (el["name"] != "Custom") {
      engine_list.get(el["name"]).fromJSON(el, true);
      engine_list.get(el["name"]).SetConstant();
    } else {
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

export function SearchAllEngineLists(n: string) {
  const engine_list = GetEngineLists();

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
