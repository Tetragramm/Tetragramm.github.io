import { Part } from "./Part.js";
import { Stats, WARNING_COLOR } from "./Stats.js";
import { Serialize, Deserialize, BoolArr } from "./Serialize.js";
import { lu } from "./Localization.js";

export class Cockpit extends Part {
  private stats: Stats;
  private types: { name: string, exposed: boolean, stats: Stats }[];
  private upgrades: { name: string, stats: Stats }[];
  private safety: { name: string, stats: Stats }[];
  private gunsights: { name: string, attack: number, stats: Stats }[];
  private selected_type: number;
  private selected_upgrades: boolean[];
  private selected_safety: boolean[];
  private selected_gunsights: boolean[];
  private total_stress: number[];
  private total_escape: number;
  private total_visibility: number;
  private total_crash: number;
  private seat_index: number;
  private bombsight: number;
  private has_rotary: boolean;
  private is_armed: boolean;

  constructor(tl: { name: string, exposed: boolean, stats: Stats }[],
    ul: { name: string, stats: Stats }[],
    sl: { name: string, stats: Stats }[],
    gl: { name: string, attack: number, stats: Stats }[]
  ) {
    super();
    this.stats = new Stats();
    this.types = tl;
    this.upgrades = ul;
    this.safety = sl;
    this.gunsights = gl;
    this.selected_type = 0;
    this.selected_upgrades = [...Array(this.upgrades.length).fill(false)];
    this.selected_safety = [...Array(this.safety.length).fill(false)];
    this.selected_gunsights = [...Array(this.gunsights.length).fill(false)];
    this.total_stress = [0, 0];
    this.total_escape = 0;
    this.total_visibility = 0;
    this.seat_index = 0;
    this.bombsight = 0;
    this.is_armed = false;
  }

  public toJSON() {
    return {
      type: this.selected_type,
      upgrades: this.selected_upgrades,
      safety: this.selected_safety,
      sights: this.selected_gunsights,
      bombsight: this.bombsight,
    };
  }

  public fromJSON(js: JSON, json_version: number) {
    this.selected_type = js["type"];
    this.selected_upgrades = BoolArr(js["upgrades"], this.selected_upgrades.length);
    this.selected_safety = BoolArr(js["safety"], this.selected_safety.length);
    this.selected_gunsights = BoolArr(js["sights"], this.selected_gunsights.length);
    if (this.IsPrimary())
      this.selected_upgrades[0] = false;
    if (json_version > 10.35)
      this.bombsight = js["bombsight"];
  }

  public serialize(s: Serialize) {
    s.PushNum(this.selected_type);
    s.PushBoolArr(this.selected_upgrades);
    s.PushBoolArr(this.selected_safety);
    s.PushBoolArr(this.selected_gunsights);
    s.PushNum(this.bombsight);
  }

  public deserialize(d: Deserialize) {
    this.selected_type = d.GetNum();
    this.selected_upgrades = d.GetBoolArr(this.selected_upgrades.length);
    this.selected_safety = d.GetBoolArr(this.selected_safety.length);
    this.selected_gunsights = d.GetBoolArr(this.selected_gunsights.length);
    if (this.IsPrimary())
      this.selected_upgrades[0] = false;
    if (d.version > 10.35)
      this.bombsight = d.GetNum();
  }

  public GetTypeList() {
    return this.types;
  }

  public GetUpgradeList() {
    return this.upgrades;
  }

  public GetSafetyList() {
    return this.safety;
  }

  public GetGunsightList() {
    return this.gunsights;
  }

  public GetType() {
    return this.selected_type;
  }

  public SetType(index: number) {
    if (index >= this.types.length)
      throw "Selected type is not in range of actual types.";
    this.selected_type = index;
    this.CalculateStats();
  }

  public GetSelectedUpgrades() {
    return this.selected_upgrades;
  }

  public SetUpgrade(index: number, state: boolean) {
    if (index >= this.upgrades.length)
      throw "Selected type is not in range of actual upgrades.";
    this.selected_upgrades[index] = state;
    this.CalculateStats();
  }

  public GetSelectedSafety() {
    return this.selected_safety;
  }

  public CanSafety() {
    const lst = Array(this.safety.length).fill(true);
    lst[5] = !this.types[this.selected_type].exposed;
    return lst;
  }

  public SetSafety(index: number, state: boolean) {
    if (index >= this.safety.length)
      throw "Selected type is not in range of actual safties.";
    this.selected_safety[index] = state;
    this.CalculateStats();
  }

  public GetSelectedGunsights() {
    return this.selected_gunsights;
  }

  public SetGunsight(index: number, state: boolean) {
    if (index >= this.safety.length)
      throw "Selected type is not in range of actual gunsights.";
    this.selected_gunsights[index] = state;
    this.CalculateStats();
  }

  public GetVisibility() {
    if (this.types[this.selected_type].stats.visibility < -10)
      return -1 / 0;
    return this.total_visibility;
  }

  public GetFlightStress() {
    return this.total_stress;
  }

  public GetEscape() {
    return this.total_escape;
  }

  public GetCrash() {
    return this.total_crash;
  }

  public GetAttack() {
    var mx = 0;
    for (let i = 0; i < this.gunsights.length; i++) {
      if (this.selected_gunsights[i]) {
        mx = Math.max(mx, this.gunsights[i].attack);
      }
    }
    return mx;
  }

  public SetSeatIndex(idx: number) {
    this.seat_index = idx;
  }

  private IsPrimary() {
    return this.seat_index == 0;
  }

  public CanUpgrades() {
    const can = [...Array(this.upgrades.length).fill(true)];
    if (this.IsPrimary()) {
      can[0] = false;
    }
    return can;
  }

  private IsOpen() {
    return this.types[this.selected_type].name == "Open"
      || this.types[this.selected_type].name == "Windscreen";
  }

  public GetBombsightQuality() {
    return this.bombsight;
  }

  public SetBombsightQuality(num: number) {
    if (num != num)
      num = 0;
    if (num == this.bombsight - 1)
      num = this.bombsight - 3;
    if (num == this.bombsight + 1)
      num = this.bombsight + 3;
    if (num < 2)
      num = 0;
    if (num > 0)
      num = num - (num % 3) + 1;
    this.bombsight = num;
    this.CalculateStats();
  }

  public SetHasRotary(has: boolean) {
    this.has_rotary = has;
  }

  public IsElectrics() {
    return this.stats.charge != 0;
  }

  public IsCopilot() {
    return this.selected_upgrades[0];
  }

  public SetArmed(is: boolean) {
    this.is_armed = is;
  }

  public GetName() {
    if (this.IsPrimary()) {
      return "Crew Pilot";
    }
    if (this.bombsight > 0) {
      return "Crew Bombadier";
    }
    if (this.IsCopilot()) {
      return "Crew Co-Pilot";
    }
    if (this.is_armed) {
      return "Crew Gunner";
    }
    return "Crew Aircrew";
  }

  public PartStats(): Stats {
    let stats = new Stats();
    stats.reqsections = 1;

    stats = stats.Add(this.types[this.selected_type].stats);

    for (let i = 0; i < this.selected_upgrades.length; i++) {
      if (this.selected_upgrades[i])
        stats = stats.Add(this.upgrades[i].stats);
    }

    const can = this.CanSafety();
    for (let i = 0; i < this.selected_safety.length; i++) {
      if (!can[i])
        this.selected_safety[i] = false;

      if (this.selected_safety[i])
        stats = stats.Add(this.safety[i].stats);
    }

    for (let i = 0; i < this.selected_gunsights.length; i++) {
      if (this.selected_gunsights[i])
        stats = stats.Add(this.gunsights[i].stats);
    }

    if (this.bombsight > 0) {
      stats.cost += Math.floor(1.0e-6 + 2 + (this.bombsight - 4) / 3);
      stats.warnings.push({
        source: lu("Bombsight"),
        warning: lu("Bombsight Warning 1") + this.bombsight.toString() + lu("Bombsight Warning 2"),
        color: WARNING_COLOR.WHITE,
      });
      if (this.IsCopilot()) {
        stats.warnings.push({
          source: lu("Bombadier Controls"),
          warning: lu("Bombadier Controls Warning"),
          color: WARNING_COLOR.WHITE,
        });
      }
    }

    this.stats = stats.Clone();

    //Special stuff for co-pilot controls
    if (this.selected_upgrades[0]) {
      stats.flightstress = this.upgrades[0].stats.flightstress;
      this.stats.flightstress -= stats.flightstress;
    }
    else {
      stats.flightstress = 0;
    }

    return stats;
  }

  public CrewUpdate(escape: number, controlstress: number, rumblestress: number, copilots: number, visibility: number, crash: number) {
    this.total_escape = this.stats.escape + escape;
    let ncp_stress = this.stats.flightstress;
    let cp_stress = this.stats.flightstress;
    if (this.IsPrimary() || this.selected_upgrades[0]) {
      ncp_stress += controlstress;
      cp_stress += controlstress - copilots * 2;
    }
    ncp_stress = Math.max(0, ncp_stress);
    cp_stress = Math.max(0, cp_stress);
    ncp_stress += rumblestress;
    cp_stress += rumblestress;
    if (this.IsOpen() && this.has_rotary) { //Is open and has rotary
      ncp_stress += 1;
      cp_stress += 1;
    }
    ncp_stress = Math.max(0, ncp_stress);
    cp_stress = Math.max(0, cp_stress);
    this.total_stress = [ncp_stress, cp_stress];
    this.total_visibility = this.stats.visibility + visibility;
    this.total_crash = this.stats.crashsafety + crash;
  }

  public SetCalculateStats(callback: () => void) {
    this.CalculateStats = callback;
  }

  public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
    const battery_storage = 0;
    var equipment: { source: string, charge: string }[] = [];

    for (let i = 0; i < this.upgrades.length; i++) {
      if (this.selected_upgrades[i]) {
        const item = this.upgrades[i];
        equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
      }
    }

    for (let i = 0; i < this.safety.length; i++) {
      if (this.selected_safety[i]) {
        const item = this.safety[i];
        equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
      }
    }

    for (let i = 0; i < this.gunsights.length; i++) {
      if (this.selected_gunsights[i]) {
        const item = this.gunsights[i];
        equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
      }
    }

    return { storage: battery_storage, equipment: equipment };
  }
}
