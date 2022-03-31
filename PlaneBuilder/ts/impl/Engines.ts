import { Part, MergeElectrics } from "./Part.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
import { Serialize, Deserialize } from "./Serialize.js";
import { lu } from "./Localization.js";
import { Engine } from "./Engine.js";
import { DRIVE_TYPE } from "./EngineStats.js";
import { Radiator } from "./Radiator.js";
import { StringFmt } from "../string/index.js";

export class Engines extends Part {
  private engines: Engine[];
  private mount_list: { name: string, stats: Stats, strainfactor: number, dragfactor: number, mount_type: string, powerfactor: number, reqED: boolean, reqTail: boolean, helicopter: boolean, turbine: boolean, }[];
  private radiators: Radiator[];
  private is_asymmetric: boolean;
  private r_type_list: { name: string, stats: Stats, dragpercool: number }[];
  private r_mount_list: { name: string, stats: Stats }[];
  private r_coolant_list: { name: string, harden: boolean, flammable: boolean, stats: Stats }[];
  private cowl_list: { name: string, stats: Stats, ed: number, mpd: number, air: boolean, liquid: boolean, rotary: boolean }[]

  constructor(js: JSON) {
    super();
    this.engines = [];
    this.radiators = [];

    this.mount_list = [];
    for (const elem of js["mounts"]) {
      const mount = { name: elem["name"], stats: new Stats(elem), strainfactor: elem["strainfactor"], dragfactor: elem["dragfactor"], mount_type: elem["location"], powerfactor: elem["powerfactor"], reqED: false, reqTail: false, helicopter: elem["helicopter"], turbine: elem["turbine"], };
      if (elem["reqED"])
        mount.reqED = true;
      if (elem["reqTail"])
        mount.reqTail = true;
      this.mount_list.push(mount);
    }

    this.is_asymmetric = false;

    this.r_type_list = [];
    for (const elem of js["radiator-type"]) {
      this.r_type_list.push({ name: elem["name"], stats: new Stats(elem), dragpercool: parseFloat(elem["dragpercool"]) });
    }
    this.r_mount_list = [];
    for (const elem of js["radiator-mount"]) {
      this.r_mount_list.push({ name: elem["name"], stats: new Stats(elem) });
    }
    this.r_coolant_list = [];
    for (const elem of js["radiator-coolant"]) {
      this.r_coolant_list.push({ name: elem["name"], harden: elem["harden"], flammable: elem["flammable"], stats: new Stats(elem) });
    }
    this.cowl_list = [];
    for (const elem of js["cowling"]) {
      this.cowl_list.push({
        name: elem["name"],
        stats: new Stats(elem),
        ed: elem["ed"],
        mpd: elem["mpd"],
        air: elem["air"],
        liquid: elem["liquid"],
        rotary: elem["rotary"],
      });
    }
  }

  public toJSON() {
    const eng = [];
    for (const en of this.engines) {
      eng.push(en.toJSON());
    }

    const rad = [];
    for (const rd of this.radiators) {
      rad.push(rd.toJSON());
    }
    return {
      engines: eng,
      radiators: rad,
      is_asymmetric: this.is_asymmetric
    };
  }

  public fromJSON(js: JSON, json_version: number) {
    this.radiators = [];
    for (const elem of js["radiators"]) {
      const rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
      rad.fromJSON(elem, json_version);
      rad.SetCalculateStats(this.CalculateStats);
      this.radiators.push(rad);
    }

    this.engines = [];
    for (const elem of js["engines"]) {
      const eng = new Engine(this.mount_list, this.cowl_list);
      eng.fromJSON(elem, json_version);
      eng.SetCalculateStats(this.CalculateStats);
      this.engines.push(eng);
      eng.SetNumRadiators(this.GetNumberOfRadiators());
    }

    this.is_asymmetric = js["is_asymmetric"];
  }

  public serialize(s: Serialize) {
    s.PushNum(this.engines.length);
    for (const en of this.engines) {
      en.serialize(s);
    }

    s.PushNum(this.radiators.length);
    for (const rd of this.radiators) {
      rd.serialize(s);
    }
    s.PushBool(this.is_asymmetric);
  }

  public deserialize(d: Deserialize) {
    const elen = d.GetNum();
    this.engines = [];
    for (let i = 0; i < elen; i++) {
      const eng = new Engine(this.mount_list, this.cowl_list);
      eng.deserialize(d);
      eng.SetCalculateStats(this.CalculateStats);
      this.engines.push(eng);
    }

    const rlen = d.GetNum();
    this.radiators = [];
    for (let i = 0; i < rlen; i++) {
      const rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
      rad.derserialize(d);
      rad.SetCalculateStats(this.CalculateStats);
      this.radiators.push(rad);
    }

    this.is_asymmetric = d.GetBool();

    for (const en of this.engines) {
      en.SetNumRadiators(this.GetNumberOfRadiators());
    }
  }

  public GetHasOilTank() {
    for (const e of this.engines) {
      if (e.GetCurrentStats().oiltank)
        return true;
    }
    return false;
  }

  public GetReliabilityList() {
    var lst = [];
    for (const e of this.engines) {
      lst.push(e.GetReliability());
    }
    return lst;
  }

  public GetMinIAF() {
    var m = 0;
    for (const e of this.engines) {
      m = Math.max(m, e.GetMinIAF());
    }
    return m;
  }

  public GetMaxIAF() {
    var m = 100;
    for (const e of this.engines) {
      m = Math.min(m, e.GetMaxIAF());
    }
    return m;
  }

  public GetMinAltitude() {
    var m = 0;
    for (const e of this.engines) {
      m = Math.max(m, e.GetMinAltitude());
    }
    return m;
  }

  public GetMaxAltitude() {
    var m = 1000;
    for (const e of this.engines) {
      m = Math.min(m, e.GetMaxAltitude());
    }
    return m;
  }

  public SetNumberOfEngines(num: number) {
    if (num != num || num < 0)
      num = 0;
    num = Math.floor(1.0e-6 + num);
    num = Math.min(20, num);
    while (this.engines.length > num) {
      this.engines.pop();
    }
    var js = null;
    if (this.engines.length > 0) {
      js = JSON.stringify(this.engines[this.engines.length - 1].toJSON());
    }
    while (this.engines.length < num) {
      const en = new Engine(this.mount_list, this.cowl_list);
      en.SetCalculateStats(this.CalculateStats);
      if (js)
        en.fromJSON(JSON.parse(js), 1000);
      this.engines.push(en);
      en.SetNumRadiators(this.GetNumberOfRadiators());
    }
    this.CalculateStats();
  }

  public GetNumberOfEngines(): number {
    let count = 0;
    for (const e of this.engines) {
      if (!e.GetGenerator())
        count++;
    }
    return count;
  }

  public GetNumberOfItems(): number {
    return this.engines.length;
  }

  public GetEngine(num: number): Engine {
    return this.engines[num];
  }

  public GetRadiator(num: number): Radiator {
    return this.radiators[num];
  }

  public SetNumberOfRadiators(num: number) {
    if (num != num || num < 0)
      num = 0;
    num = Math.floor(1.0e-6 + num);
    while (this.radiators.length > num) {
      this.radiators.pop();
    }
    while (this.radiators.length < num) {
      const rad = new Radiator(this.r_type_list, this.r_mount_list, this.r_coolant_list);
      rad.SetCalculateStats(this.CalculateStats);
      this.radiators.push(rad);
    }
    for (const en of this.engines) {
      en.SetNumRadiators(num);
    }
    this.CalculateStats();
  }

  public GetNumberOfRadiators(): number {
    if (this.radiators.length == 0 && this.NeedCooling())
      this.SetNumberOfRadiators(1);
    else if (this.radiators.length > 0 && !this.NeedCooling())
      this.SetNumberOfRadiators(0);

    return this.radiators.length;
  }

  private NeedCooling(): boolean {
    let need = false;
    for (const elem of this.engines) {
      need = need || elem.NeedCooling();
    }
    return need;
  }

  public UpdateReliability(stats: Stats) {
    for (const elem of this.engines) {
      let rad_stats = new Stats();
      if (elem.GetRadiator() < this.radiators.length && elem.GetRadiator() >= 0) {
        rad_stats = this.radiators[elem.GetRadiator()].PartStats();
      }
      elem.UpdateReliability(stats.reliability + rad_stats.reliability);
    }
  }

  public SetAsymmetry(use: boolean) {
    this.is_asymmetric = use;
    this.CalculateStats();
  }

  public GetAsymmetry(): boolean {
    return this.is_asymmetric;
  }

  public GetNumPropellers() {
    var count = 0;
    for (const e of this.engines) {
      count += e.GetNumPropellers();
    }
    return count;
  }

  public GetOverspeed() {
    let os = 100;
    for (const e of this.engines)
      os = Math.min(os, e.GetOverspeed());
    return os;
  }

  public GetRumble() {
    var r = 0;
    for (const e of this.engines)
      r += e.GetRumble();
    return r;
  }

  public GetMaxRumble() {
    var r = 0;
    for (const e of this.engines)
      r = Math.max(r, e.GetRumble());
    return r;
  }

  public GetTractorSpinner() {
    const ret = { have: false, spin_count: 0, arty_spin_count: 0 };
    for (const e of this.engines) {
      const t = e.GetTractorSpinner();
      if (t.has) {
        ret.have = true;
        if (t.spinner[0])
          ret.spin_count++;
        if (t.spinner[1])
          ret.arty_spin_count++;
      }
    }
    return ret;
  }

  public GetPusherSpinner() {
    const ret = { have: false, spin_count: 0, arty_spin_count: 0 };
    for (const e of this.engines) {
      const t = e.GetPusherSpinner();
      if (t.has) {
        ret.have = true;
        if (t.spinner[0])
          ret.spin_count++;
        if (t.spinner[1])
          ret.arty_spin_count++;
      }
    }
    return ret;
  }

  public IsElectrics() {
    for (const e of this.engines) {
      if (e.IsElectrics())
        return true;
    }
    return false;
  }

  public HaveParasol(has: boolean) {
    for (const r of this.radiators) {
      r.SetParasol(has);
    }
  }

  public SetMetalArea(num: number) {
    for (const r of this.radiators) {
      r.SetMetalArea(num);
    }
  }

  public SetTailMods(forb: boolean, swr: boolean, canard: boolean) {
    for (const e of this.engines)
      e.SetTailMods(forb, swr, canard);
  }

  public GetEngineHeight() {
    var min = 2;
    for (const e of this.engines)
      min = Math.min(min, e.GetEngineHeight());
    return min;
  }

  public HasTractorRotary() {
    for (const e of this.engines) {
      if (e.IsTractorRotary())
        return true;
    }
    return false;
  }

  public SetInternal(is: boolean) {
    for (const e of this.engines) {
      e.SetInternal(is);
    }
    if (is) {
      for (const r of this.radiators) {
        r.SetMetalArea(0);
        r.SetParasol(false);
      }
    }
  }

  public HasPulsejet() {
    for (const e of this.engines) {
      if (e.GetIsPulsejet())
        return true;
    }
    return false;
  }

  public HasTurbineNoProp() {
    for (const e of this.engines) {
      if (e.GetIsTurbine() && e.GetNumPropellers() == 0)
        return true;
    }
    return false;
  }

  public HasDiesel() {
    for (const e of this.engines) {
      if (e.IsDiesel())
        return true;
    }
    return false;
  }

  public GetEngineTypes() {
    var lst = [];
    for (const en of this.engines) {
      if (en.GetNumPropellers() > 0) {
        lst.push({ type: DRIVE_TYPE.PROPELLER, num: en.GetNumPropellers() });
      } else if (en.GetIsPulsejet()) {
        lst.push({ type: DRIVE_TYPE.PULSEJET, num: 0 });
      } else if (en.GetIsTurbine()) {
        lst.push({ type: DRIVE_TYPE.TURBINE, num: en.GetCurrentStats().stats.pitchspeed });
      }
    }
    return lst;
  }

  public GetIsFlammable(): boolean {
    for (const r of this.radiators) {
      if (r.GetIsFlammable())
        return true;
    }
    return false;
  }

  public PartStats(): Stats {
    var stats = new Stats();
    const needCool = new Array(this.GetNumberOfRadiators()).fill(null).map(() => ({ cool: 0, count: 0 }));
    var ecost = 0;
    var pitchspeedmin = 100;
    //Engine stuff
    for (const en of this.engines) {
      const enstats = en.PartStats();
      stats = stats.Add(enstats);
      if (en.NeedCooling()) {
        needCool[en.GetRadiator()].cool += en.GetCooling();
        needCool[en.GetRadiator()].count += 1;
      }
      ecost += en.GetCurrentStats().stats.cost;
      if (enstats.pitchspeed > 0) {
        pitchspeedmin = Math.min(pitchspeedmin, enstats.pitchspeed);
      }
    }

    if (pitchspeedmin < 100)
      stats.pitchspeed = pitchspeedmin;

    //Upkeep calc only uses engine costs
    stats.upkeep = Math.floor(1.0e-6 + Math.min(stats.upkeep, ecost));

    //Include radiaators
    let radstats = new Stats();
    const warningmap = new Map();
    for (let i = 0; i < this.radiators.length; i++) {
      const rad = this.radiators[i];
      rad.SetNeedCool(needCool[i].cool, needCool[i].count);

      const rstats = rad.PartStats();
      radstats = radstats.Add(rstats);

      // We want to merge all the warnings for different radiators so we don't end up with a pile of warnings.
      for (const w of rstats.warnings) {
        const exist = warningmap.get(w.source);
        if (exist) {
          exist.push(i + 1);
          warningmap.set(w.source, exist);
        } else {
          warningmap.set(w.source, [i + 1]);
        }
      }
    }

    for (const w of radstats.warnings) {
      w.source = lu("Radiators #", StringFmt.Join(",", warningmap.get(w.source))) + " " + w.source;
    }
    stats = stats.Add(radstats);

    //Asymmetric planes
    if (this.is_asymmetric)
      stats.latstab -= 3;

    if (this.HasPulsejet()) {
      stats.warnings.push({
        source: lu("Pulsejets"), warning: lu("Pulsejet Boost Warning"),
        color: WARNING_COLOR.WHITE,
      });
    }
    if (this.HasTurbineNoProp()) {
      stats.warnings.push({
        source: lu("Turbine"), warning: lu("Turbine Boost Warning"),
        color: WARNING_COLOR.WHITE,
      });
    }
    if (this.HasDiesel()) {
      stats.warnings.push({
        source: lu("Diesel"), warning: lu("Diesel Warning"),
        color: WARNING_COLOR.WHITE,
      });
    }

    var rotationT = 0;
    for (const e of this.engines) {
      if (e.IsRotary()) {
        if (e.GetUsePushPull() && e.GetTorqueToStruct()) {
          // No change to RotationT
        } else if (e.GetUsePushPull() && e.IsTractor()) {
          rotationT += 2;
        } else if (e.IsTractor()) {
          rotationT++;
        } else if (e.IsPusher()) {
          rotationT--;
        }
      }
    }
    if (rotationT > 0) {
      stats.warnings.push({
        source: lu("Rotary"), warning: lu("Rotary Right Warning"),
        color: WARNING_COLOR.WHITE,
      });
    } else if (rotationT < 0) {
      stats.warnings.push({
        source: lu("Rotary"), warning: lu("Rotary Left Warning"),
        color: WARNING_COLOR.WHITE,
      });
    }

    //Part local, gets handled in UpdateReliability
    stats.reliability = 0;

    return stats;
  }

  public SetCalculateStats(callback: () => void) {
    this.CalculateStats = callback;
  }

  public GetHasTractorNacelles() {
    let has = 0;
    for (const en of this.engines) {
      if (en.GetIsTractorNacelle())
        has++;
    }
    return has > 1;
  }

  public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
    let value = { storage: 0, equipment: [] };

    for (let e = 0; e < this.engines.length; e++) {
      const s = this.engines[e].PartStats();
      if (s.charge != 0) {
        value.equipment.push({
          source: lu("Vital Part Engine", e),
          charge: s.charge.toString(),
        });
      }
    }
    for (const r of this.radiators) {
      value = MergeElectrics(value, r.GetElectrics());
    }

    return value;
  }
}
