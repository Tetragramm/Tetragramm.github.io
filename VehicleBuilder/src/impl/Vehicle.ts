import { WeaponMount } from "./Weapon";
import { WARNING_COLOR, PowerplantType, PowerplantSize, PropulsionType as LocomotionType, Stats, Volume } from "./Stats";
import { Loader, Crew } from "./Crew";
import { Accessories } from "./Accessories";
import { Deserialize, Serialize } from "./Serialize";
import { _arrayBufferToString } from "../disp/Tools";
import { LZString } from "../lz/lz-string";

export class Vehicle {
    public version = 1;
    public name = "Sample Vehicle";
    public nickname = "It Only Gets Worse.";
    private powerplant_idx: number = 2;
    private powerplant_size_idx: number = 1;
    private locomotion_idx: number = 3;
    private armour_front: number = 0;
    private armour_side: number = 0;
    private armour_rear: number = 0;
    private extra_fuel: number = 0;
    private extra_tiny: boolean = false;
    private enlarged_engine: number = 0;
    private propeller = false;
    private turret_hull = false;
    private DisplayCallback: (stat: Stats) => void;
    private crew: Crew[] = [
        new Crew("Driver", true, true, false, false, false, false, false, [], []),
        new Crew("Commander", true, true, false, false, false, false, false, [], [new WeaponMount(0, [true, false, false, false, false], [], false, 0, 0)]),
    ];
    private cargo = [0, 0, 0, 0];
    private accessories = new Accessories();


    public Serialize(s: Serialize) {
        s.PushString(this.version.toString());
        s.PushString(this.name);
        s.PushString(this.nickname);
        s.PushNum(this.powerplant_idx);
        s.PushNum(this.powerplant_size_idx);
        s.PushNum(this.locomotion_idx);
        s.PushNum(this.armour_front);
        s.PushNum(this.armour_side);
        s.PushNum(this.armour_rear);
        s.PushNum(this.extra_fuel);
        s.PushNum(this.enlarged_engine);
        s.PushBool(this.propeller);
        s.PushBool(this.turret_hull);
        s.PushNum(this.crew.length);
        for (let c of this.crew) {
            c.Serialize(s);
        }
        s.PushNum(this.cargo[0]);
        s.PushNum(this.cargo[1]);
        s.PushNum(this.cargo[2]);
        s.PushNum(this.cargo[3]);
        this.accessories.Serialize(s);
    }

    public Deserialize(d: Deserialize) {
        d.version = parseFloat(d.GetString());
        this.name = d.GetString();
        this.nickname = d.GetString();
        this.powerplant_idx = d.GetNum();
        this.powerplant_size_idx = d.GetNum();
        this.locomotion_idx = d.GetNum();
        this.armour_front = d.GetNum();
        this.armour_side = d.GetNum();
        this.armour_rear = d.GetNum();
        this.extra_fuel = d.GetNum();
        this.enlarged_engine = d.GetNum();
        this.propeller = d.GetBool();
        this.turret_hull = d.GetBool();
        let num_crew = d.GetNum();
        this.crew = [];
        for (let cidx = 0; cidx < num_crew; cidx++) {
            let c = new Crew("", false, false, false, false, false, false, false, [], []);
            c.Deserialize(d);
            this.crew.push(c);
        }
        this.cargo = [d.GetNum(), d.GetNum(), d.GetNum(), d.GetNum()];
        this.accessories.Deserialize(d);
    }

    public SetDisplayCallback(callback: (stat: Stats) => void) {
        this.DisplayCallback = callback;
    }

    private ValidateArmour() {
        if (PowerplantType[this.powerplant_idx].name == "Wind Powered" && this.SumArmour() != 0) {
            this.armour_front = 0;
            this.armour_side = 0;
            this.armour_rear = 0;
        }
        this.armour_front = Math.min(5, this.armour_front);
        this.armour_side = Math.min(5, this.armour_side);
        this.armour_rear = Math.min(5, this.armour_rear);
        while (this.SumArmour() > 10) {
            if (this.armour_rear != 0) {
                this.armour_rear--;
            } else if (this.armour_side != 0) {
                this.armour_side--;
            } else {
                this.armour_front--;
            }
        }
    }
    public SumArmour(): number {
        return this.armour_front + this.armour_side + this.armour_rear;
    }

    public SetCargo(s: number, m: number, l: number, h: number) {
        this.cargo = [s, m, l, h];
        this.CalculateStats();
    }

    public GetCargo() {
        let tiny = 0;
        if (this.extra_tiny) {
            tiny += 1;
        }
        return [tiny, ...this.cargo];
    }

    public SetPowerplant(idx: number) {
        if (PowerplantType[this.powerplant_idx].powerplants.length != PowerplantType[idx].powerplants.length) {
            this.powerplant_size_idx = Math.min(1, PowerplantType[idx].powerplants.length - 1);
        }
        this.powerplant_idx = idx;
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetPowerplantIdx(): number {
        return this.powerplant_idx;
    }
    public GetPowerplant() {
        return structuredClone(PowerplantType[this.powerplant_idx]);
    }
    public GetPowerplantList() {
        return PowerplantType;
    }
    public GetPowerplantSizeIdx(): number {
        return this.powerplant_size_idx;
    }
    public SetPowerplantSize(idx: number) {
        this.powerplant_size_idx = idx;
        this.CalculateStats();
    }
    public GetPowerplantSize() {
        return PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx];
    }
    public GetPowerplantSizeList() {
        return PowerplantType[this.powerplant_idx].powerplants;
    }
    public GetPropulsionList(): string[] {
        return LocomotionType;
    }
    public SetPropulsion(idx: number) {
        this.locomotion_idx = idx;
        this.CalculateStats();
    }
    public GetPropulsionIdx(): number {
        return this.locomotion_idx;
    }
    public GetPropulsion(): string {
        return LocomotionType[this.locomotion_idx];
    }
    public SetPropeller(has: boolean) {
        this.propeller = has;
        this.CalculateStats();
    }
    public CanPropeller() {
        switch (LocomotionType[this.locomotion_idx]) {
            case "Half-Track":
            case "Continuous Track":
            case "Crawler":
            case "Half-Walker":
            case "Walker":
                return false;
            case "Monowheel":
            case "Two-Wheeled":
            case "Three-Wheeled":
            case "Four-Wheeled":
            case "Six-Wheeled":
                if (this.GetVolume() > 4)
                    return false;
            case "Skids":
            case "Skis":
            case "Boat Hull":
            case "Amphibious":
            case "Cable Car":
            case "Sky-Line":
            case "Dorandisch Earthline":
                if (PowerplantType[this.powerplant_idx].name == "Wind Powered")
                    return false;
        }
        return true;
    }
    private ValidateLocomotion() {
        let volume = this.GetVolume();
        switch (LocomotionType[this.locomotion_idx]) {
            case "Monowheel":
            case "Two-Wheeled":
                return volume <= 1;
            case "Three-Wheeled":
            case "Four-Wheeled":
            case "Six-Wheeled":
            case "Half-Track":
            case "Continuous Track":
            case "Crawler":
            case "Half-Walker":
            case "Walker":
                return volume <= 8
            case "Skids":
            case "Skis":
                return volume <= 6;
            case "Boat Hull":
            case "Amphibious":
            case "Cable Car":
            case "Sky-Line":
            case "Dorandisch Earthline":
                return true;
            default:
                console.error("Unknonw Locomotion in ValidateLocomotion");
                return false;
        }
    }
    public SetArmourFront(amount: number) {
        amount = Math.floor(1.0e-6 + amount);
        amount = Math.max(0, amount);
        amount = Math.min(5, amount);
        this.armour_front = amount;
        while (this.SumArmour() > 10) {
            this.armour_front--;
        }
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetArmourFront(): number {
        return this.armour_front;
    }
    public SetArmourSide(amount: number) {
        amount = Math.floor(1.0e-6 + amount);
        amount = Math.max(0, amount);
        amount = Math.min(5, amount);
        this.armour_side = amount;
        while (this.SumArmour() > 10) {
            this.armour_side--;
        }
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetArmourSide(): number {
        return this.armour_side;
    }
    public SetArmourRear(amount: number) {
        amount = Math.floor(1.0e-6 + amount);
        amount = Math.max(0, amount);
        amount = Math.min(5, amount);
        this.armour_rear = amount;
        while (this.SumArmour() > 10) {
            this.armour_rear--;
        }
        this.ValidateArmour();
        this.CalculateStats();
    }
    public GetArmourRear(): number {
        return this.armour_rear;
    }
    public CanExtraFuel(): boolean {
        let fuel = this.GetPowerplantSize().fuel ?? 0;
        return (fuel > 0);
    }
    public SetExtraFuel(val: number) {
        val = Math.floor(1.0e-6 + val);
        val = Math.max(0, val);
        this.extra_fuel = val;
        this.CalculateStats();
    }
    public GetExtraFuel(): number {
        return this.extra_fuel;
    }
    public SetEnlargeEngine(count: number) {
        this.enlarged_engine = count;
        this.CalculateStats();
    }
    public GetEnlargedEngine(): number {
        return this.enlarged_engine;
    }

    public GetVolume(): number {
        let stat = new Stats();
        stat.volume += this.extra_fuel;

        let armour_list = [this.armour_front, this.armour_side, this.armour_rear];
        let is_enclosed = false;
        let cramped = 0;
        for (let idx = 0; idx < this.crew.length; idx++) {
            is_enclosed = is_enclosed || this.crew[idx].IsEnclosed();
            stat.add(this.crew[idx].CalcStats(armour_list));
            if (this.crew[idx].IsCramped())
                cramped += 0.25;
        }
        stat.volume += Math.ceil(-1.0e-6 + cramped);
        stat.volume = Math.ceil(-1.0e-6 + stat.volume);
        if (is_enclosed) {
            stat.volume += 1;
        }
        if (LocomotionType[this.locomotion_idx] == "Amphibious") {
            stat.volume += 1;
        }
        if (this.enlarged_engine > 0) {
            stat.volume += this.enlarged_engine;
        }
        stat.volume += this.cargo[0] * 1;
        stat.volume += this.cargo[1] * 2;
        stat.volume += this.cargo[2] * 4;
        stat.volume += this.cargo[3] * 8;
        stat.add(new Stats(PowerplantType[this.powerplant_idx]));
        return stat.volume;
    }

    public CalculateStats(): Stats {
        let armour_list = [this.armour_front, this.armour_side, this.armour_rear];
        if (!this.CanExtraFuel()) {
            this.extra_fuel = 0;
        }
        let stat = new Stats();
        stat.cost = 3;
        stat.torque = -1;
        stat.volume += this.extra_fuel;
        let is_enclosed = false;
        let cramped_volume = 0;
        for (let idx = 0; idx < this.crew.length; idx++) {
            is_enclosed = is_enclosed || this.crew[idx].IsEnclosed();
            stat.add(this.crew[idx].CalcStats(armour_list));
            if (this.crew[idx].IsCramped())
                cramped_volume += 0.25;
        }
        if (is_enclosed) {
            stat.volume += 1;
            if (this.SumArmour() > 0) {
                stat.stress += 1;
            }
        }
        this.extra_tiny = (stat.volume - Math.floor(stat.volume)) >= 0.45;
        stat.volume += cramped_volume;
        stat.volume = Math.ceil(stat.volume);

        //Loopholes
        stat.cost += this.GetLoopholes();


        if (!this.ValidateLocomotion()) {
            stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "Too much Volume for this locomotion type.", color: WARNING_COLOR.RED });
        }
        if (LocomotionType[this.locomotion_idx] == "Amphibious") {
            stat.volume += 1;
            stat.cost += 1;
            stat.warnings.push({ source: "Amphibious", warning: "Allows use on calm water at -1 Speed.", color: WARNING_COLOR.WHITE });
        }

        stat.volume += this.cargo[0] * 1;
        stat.volume += this.cargo[1] * 2;
        stat.volume += this.cargo[2] * 4;
        stat.volume += this.cargo[3] * 8;


        stat.add(new Stats(PowerplantType[this.powerplant_idx]));
        for (let text of PowerplantType[this.powerplant_idx].special) {
            stat.warnings.push({ source: PowerplantType[this.powerplant_idx].name, warning: text, color: WARNING_COLOR.WHITE });
        }


        let volMaxHP = stat.volume;
        if (this.enlarged_engine) {
            stat.volume += this.enlarged_engine;
            stat.reliability -= this.enlarged_engine;
            volMaxHP += 2 * this.enlarged_engine;
        }
        volMaxHP = Math.min(Volume.length - 1, volMaxHP);

        stat.handling += Volume[Math.min(Volume.length - 1, stat.volume)].handling;
        stat.speed += Volume[Math.min(Volume.length - 1, stat.volume)].speedmod;
        stat.integrity += Volume[Math.min(Volume.length - 1, stat.volume)].integrity;

        if (PowerplantSize[this.powerplant_size_idx].HP > Volume[volMaxHP].maxHP) {
            stat.warnings.push({ source: "Powerplant Size", warning: "Powerplant is too large for this vehicle. Add Volume, expand the engine compartment, or reduce the engine size.", color: WARNING_COLOR.RED });
        }

        stat.add(new Stats(PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx]));
        for (let text of PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx].special) {
            stat.warnings.push({ source: PowerplantType[this.powerplant_idx].powerplants[this.powerplant_size_idx].name, warning: text, color: WARNING_COLOR.WHITE });
        }
        stat.fuel *= (this.extra_fuel + 1);

        let armour_total = this.SumArmour();
        //Armour effects
        stat.cost += armour_total;
        stat.handling -= 2 * armour_total;
        stat.safety += Math.floor((Math.max(...armour_list) + Math.min(...armour_list)) / 2);
        armour_list.forEach((value) => {
            if (value >= 3) {
                stat.safety += 1;
                stat.speed -= 1;
                stat.torque -= 1;
            }
        });
        if (armour_total > 0) {
            stat.speed -= 1;
            stat.torque -= 1;
            stat.integrity += 2 + armour_total;
            if (armour_total >= 5) {
                stat.speed -= 1;
                stat.torque -= 1;
                if (armour_total >= 10) {
                    stat.speed -= 1;
                    stat.torque -= 1;
                }
            }
        }
        stat.reliability -= Math.floor(1.0e-6 + armour_total / 3.0);
        let ve = 0;
        if (armour_total >= 1) {
            ve -= 1;
            if (armour_total >= 4) {
                ve -= 1;
                if (armour_total >= 7) {
                    ve -= 1;
                    if (armour_total >= 10) {
                        ve -= 1;
                    }
                }
            }
        }
        for (let c of this.crew) {
            c.base_vis = ve;
            c.base_escape = ve + this.accessories.GetEscapeMod();
        }

        if (this.propeller && this.CanPropeller()) {
            stat.torque -= 2;
            stat.speed += 1;
            stat.reliability += 1;
            stat.stress += 1;
            stat.warnings.push({ source: "Propeller", warning: "Double Injury on a Crash.", color: WARNING_COLOR.WHITE });
        }

        if (this.turret_hull && this.CanTurretHull()) {
            stat.cost += 10;
            stat.warnings.push({
                source: "Turret Hull", warning: "Gains the Gyro-Stabilized rule, and does not take the Tank Battle! penalty for single-arc weapons.", color: WARNING_COLOR.WHITE
            });
        }

        switch (LocomotionType[this.locomotion_idx]) {
            case "Monowheel":
            case "Two-Wheeled":
                stat.speed += 1;
                stat.torque -= armour_total;
                stat.cost -= 1;
                break;
            case "Three-Wheeled":
            case "Four-Wheeled":
                if (stat.volume >= 6) {
                    stat.torque -= 1;
                }
                stat.torque -= Math.floor(armour_total / 3);
                break;
            case "Six-Wheeled":
                stat.handling -= 5;
                stat.torque -= Math.floor(armour_total / 5);
                break;
            case "Half-Track":
                stat.torque += 2;
                stat.speed -= 1;
                stat.cost += 1;
                break;
            case "Continuous Track":
                stat.torque += 4;
                stat.speed -= 2;
                stat.handling -= 5;
                if (Volume[Math.min(Volume.length - 1, stat.volume)].size == "Large") {
                    stat.torque += 1;
                } else if (Volume[Math.min(Volume.length - 1, stat.volume)].size == "Huge") {
                    stat.torque += 2;
                }
                stat.cost += 2;
                break;
            case "Crawler":
            case "Half-Walker":
                stat.speed -= 2;
                stat.handling -= 5;
                stat.walker_torque = 3;
                stat.speed = Math.min(stat.speed, 4);
                stat.cost += 2;
                stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "Gains the High Ground Pressure special rule.", color: WARNING_COLOR.WHITE });
                break;
            case "Walker":
                stat.speed -= 3;
                stat.reliability -= 1;
                stat.handling += 5;
                stat.upkeep += 1;
                stat.torque -= 1;
                stat.walker_torque = 5;
                stat.speed = Math.min(stat.speed, 3);
                stat.cost += 4;
                stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "Gains the High Ground Pressure & Standing Tall special rules.", color: WARNING_COLOR.WHITE });
                break;
            case "Skids":
            case "Skis":
                stat.speed -= 2;
                stat.torque -= 2;
                stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "+3 Speed bonus on Snow & Ice.", color: WARNING_COLOR.WHITE });
                break;
            case "Boat Hull":
                stat.speed = Math.min(stat.speed, 4);
                stat.cost += 1;
                stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "Limited to Water.", color: WARNING_COLOR.WHITE });
                break;
            case "Amphibious":
                //Note: Done earlier
                break;
            case "Cable Car":
            case "Sky-Line":
                stat.reliability += 4;
                stat.speed += 1;
                stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "Limited to cable lines.", color: WARNING_COLOR.WHITE });
                break;
            case "Dorandisch Earthline":
                stat.reliability += 6;
                stat.speed += 3;
                stat.warnings.push({ source: LocomotionType[this.locomotion_idx], warning: "Limited to ground rails.", color: WARNING_COLOR.WHITE });
                break;
        }
        stat = this.accessories.CalcStats(is_enclosed, stat);

        if (this.DisplayCallback) {
            this.DisplayCallback(stat);
        }

        let ser = new Serialize();
        this.Serialize(ser);
        const arr = ser.FinalArray();
        const str2 = _arrayBufferToString(arr);
        const txt2 = LZString.compressToEncodedURIComponent(str2);
        window.localStorage.setItem("tank", txt2);
        return stat;
    }
    public SetCrew(idx: number, crew: Crew) {
        if (idx == this.crew.length) {
            this.crew.push(crew);
        } else if (idx >= 0 && idx < this.crew.length) {
            crew.loaders = this.crew[idx].loaders;
            crew.weapon_mounts = this.crew[idx].weapon_mounts;
            this.crew[idx] = crew;
        } else {
            console.error("SetCrew index out of range.");
        }
        this.CalculateStats();
    }
    public DeleteCrew(idx: number) {
        this.crew.splice(idx, 1);
        this.CalculateStats();
    }
    public DuplicateCrew(idx: number) {
        let c = this.crew[idx];
        let dupls = [];
        for (let l of c.loaders) {
            dupls.push(new Loader(l.enclosed, l.coupla, l.sealed, l.loop_front, l.loop_left, l.loop_right, l.loop_back));
        }
        let dupws = [];
        for (let w of c.weapon_mounts) {
            dupws.push(new WeaponMount(w.main_idx, structuredClone(w.directions), structuredClone(w.secondary_idx), w.shield, w.gunsight, w.rocket_count));
        }
        let dup = new Crew(c.name_txt, c.enclosed, c.coupla, c.sealed, c.loop_front, c.loop_left, c.loop_right, c.loop_back, dupls, dupws);
        this.crew.splice(idx, 0, dup);
        this.CalculateStats();
    }
    public SetLoader(idx: number, ldr_idx: number, ldr: Loader) {
        if (idx >= this.crew.length) {
            console.error("SetLoader crew index out of range.");
        }
        let crew = this.crew[idx];
        if (ldr_idx >= crew.loaders.length) {
            console.error("SetLoader loader index out of range.");
        } else {
            crew.loaders[ldr_idx] = ldr;
        }
        this.CalculateStats();
    }
    public SetNumLoaders(idx: number, num: number) {
        if (idx >= this.crew.length) {
            console.error("SetNumLoaders crew index out of range.");
        }
        if (num <= 0) {
            this.crew[idx].loaders = [];
        } else {
            num = Math.min(num, this.crew[idx].GetNumLoaders());
            while (this.crew[idx].loaders.length > num) {
                this.crew[idx].loaders.pop();
            }
            while (this.crew[idx].loaders.length < num) {
                this.crew[idx].loaders.push(new Loader(false, false, false, false, false, false, false));
            }
        }
        this.CalculateStats();
    }
    public SetNumWeapons(idx: number, num: number) {
        if (idx >= this.crew.length) {
            console.error("SetNumWeapons crew index out of range.");
        }
        if (num <= 0) {
            this.crew[idx].weapon_mounts = [];
        } else {
            while (this.crew[idx].weapon_mounts.length > num) {
                this.crew[idx].weapon_mounts.pop();
            }
            while (this.crew[idx].weapon_mounts.length < num) {
                this.crew[idx].weapon_mounts.push(new WeaponMount(0, [true, false, false, false, false], [], false, 0, 1));
            }
        }
        this.CalculateStats();
    }
    public GetCrewList(): Crew[] {
        return this.crew;
    }
    public GetNumWeapons(): number {
        let num = 0;
        for (let c of this.crew) {
            num += c.weapon_mounts.length;
        }
        return num;
    }
    public SetWeapon(idx: number, mount: WeaponMount) {
        let midx = 0;
        for (let cidx = 0; cidx < this.crew.length; ++cidx) {
            for (let widx = 0; widx < this.crew[cidx].weapon_mounts.length; widx++) {
                if (idx == midx) {
                    this.crew[cidx].weapon_mounts[widx] = mount;
                    this.CalculateStats();
                    return;
                }
                midx++;
            }
        }
        console.error("Index not found");
    }
    private GetLoopholes(): number {
        let result = { f: 0, s: 0, b: 0 };
        for (let c of this.crew) {
            let r = c.GetLoopholes();
            result.f += r.f;
            result.s += r.l;
            result.s += r.r;
            result.b += r.b;
        }
        let cost = 0;
        while (result.f > 4) {
            result.f -= 4;
            cost += this.armour_front;
        }
        while (result.s > 4) {
            result.s -= 4;
            cost += this.armour_side;
        }
        while (result.b > 4) {
            result.b -= 4;
            cost += this.armour_rear;
        }
        let lh = [
            ...Array<number>(result.f).fill(this.armour_front),
            ...Array<number>(result.s).fill(this.armour_side),
            ...Array<number>(result.b).fill(this.armour_rear),
        ];
        lh.sort();
        while (lh.length > 0) {
            let gcost = lh.pop();
            if (lh.length > 0)
                lh.pop();
            if (lh.length > 0)
                lh.pop();
            if (lh.length > 0)
                lh.pop();
            cost += gcost;
        }

        return cost;
    }

    public GetAccessories(): Accessories {
        return this.accessories;
    }

    public CanTurretHull(): boolean {
        return LocomotionType[this.locomotion_idx] == "Walker";
    }

    public SetTurretHull(has: boolean) {
        this.turret_hull = has;
        this.CalculateStats();
    }

    public Reset() {
        this.name = "Sample Vehicle";
        this.nickname = "It Only Gets Worse.";
        this.powerplant_idx = 2;
        this.powerplant_size_idx = 1;
        this.locomotion_idx = 3;
        this.armour_front = 0;
        this.armour_side = 0;
        this.armour_rear = 0;
        this.extra_fuel = 0;
        this.extra_tiny = false;
        this.enlarged_engine = 0;
        this.propeller = false;
        this.turret_hull = false;
        this.crew = [
            new Crew("Driver", true, true, false, false, false, false, false, [], []),
            new Crew("Commander", true, true, false, false, false, false, false, [], [new WeaponMount(0, [true, false, false, false, false], [], false, 0, 0)]),
        ];
        this.cargo = [0, 0, 0, 0];
        this.accessories.Reset();
        this.CalculateStats();
    }
}