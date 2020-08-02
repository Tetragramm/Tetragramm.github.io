/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./Weapon.ts" />

class Weapons extends Part {
    private weapon_sets: WeaponSystem[];
    private weapon_list: {
        name: string, abrv: string, era: string, size: number, stats: Stats,
        damage: number, hits: number, ammo: number,
        ap: number, jam: string, reload: number,
        rapid: boolean, synched: boolean, shells: boolean,
        can_action: boolean, can_projectile: boolean
    }[];
    private direction_list: string[] = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
    private synchronization_list: string[] = ["None", "Interruptor Gear", "Synchronization Gear", "Spinner Gun", "Deflector Plate"];
    private action_list = [
        { name: "Standard Action" },
        { name: "Mechanical Action" },
        { name: "Gast Principle" },
    ];
    private projectile_list = [
        { name: "Bullets" },
        { name: "Heat Ray" },
        { name: "Gyrojets" },
        { name: "Pneumatic" },
    ];
    private brace_count: number;

    public cockpit_count: number;
    public has_tractor: boolean;
    public tractor_spinner_count: number;
    public tractor_arty_spinner_count: number;
    public has_pusher: boolean;
    public pusher_spinner_count: number;
    public pusher_arty_spinner_count: number;
    public cant_type: number;

    constructor(js: JSON) {
        super();

        this.weapon_list = [];
        for (let elem of js["weapons"]) {
            var weap = {
                name: elem["name"],
				abrv: elem["abrv"],
                era: elem["era"],
                size: elem["size"],
                stats: new Stats(elem),
                damage: elem["damage"],
                hits: elem["hits"],
                ammo: elem["ammo"],
                ap: elem["ap"],
                jam: elem["jam"],
                reload: elem["reload"],
                rapid: elem["rapid"],
                synched: elem["synched"],
                shells: elem["shells"],
                can_action: elem["can_action"],
                can_projectile: elem["can_projectile"],
            };
            this.weapon_list.push(weap);
        }

        this.weapon_sets = [];
        this.brace_count = 0;
    }

    public toJSON() {
        var lst = [];
        for (let ws of this.weapon_sets) {
            lst.push(ws.toJSON());
        }
        return {
            weapon_systems: lst,
            brace_count: this.brace_count,
        }
    }

    public fromJSON(js: JSON, json_version: number) {
        this.weapon_sets = [];
        var lst = js["weapon_systems"];
        for (let wsj of lst) {
            var ws = new WeaponSystem(this.weapon_list);
            ws.SetCalculateStats(this.CalculateStats);
            ws.fromJSON(wsj, json_version);
            this.weapon_sets.push(ws);
        }
        if (json_version > 10.35) {
            this.brace_count = js["brace_count"];
        }
    }

    public serialize(s: Serialize) {
        s.PushNum(this.weapon_sets.length);
        for (let ws of this.weapon_sets) {
            ws.serialize(s);
        }
        s.PushNum(this.brace_count);
    }

    public deserialize(d: Deserialize) {
        this.weapon_sets = [];
        var wlen = d.GetNum();
        for (let i = 0; i < wlen; i++) {
            var ws = new WeaponSystem(this.weapon_list);
            ws.SetCalculateStats(this.CalculateStats);
            ws.deserialize(d);
            this.weapon_sets.push(ws);
        }
        if (d.version > 10.35)
            this.brace_count = d.GetNum();
    }

    public GetWeaponList() {
        return this.weapon_list;
    }

    public GetDirectionList() {
        return this.direction_list;
    }

    public GetSynchronizationList() {
        return this.synchronization_list;
    }

    public SetWeaponSetCount(num: number) {
        if (num != num || num < 1)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapon_sets.length) {
            var w = new WeaponSystem(this.weapon_list);
            w.SetCalculateStats(this.CalculateStats);
            this.weapon_sets.push(w);
        }
        while (num < this.weapon_sets.length) {
            this.weapon_sets.pop();
        }
        this.CalculateStats();
    }

    public GetWeaponSets() {
        return this.weapon_sets;
    }

    private CountFreelyAccessible() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            var wlist = ws.GetWeapons();
            for (let w of wlist) {
                if (w.GetFreeAccessible())
                    count++;
            }
        }
        return count;
    }

    private CountTractorSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }

    private CountArtyTractorSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }

    private CountPusherSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }

    private CountArtyPusherSpinner() {
        var count = 0;
        for (let ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                var wlist = ws.GetWeapons();
                for (let w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }

    private RemoveOneFreelyAccessible() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            var wlist = this.weapon_sets[i].GetWeapons();
            for (let j = wlist.length - 1; j >= 0; j--) {
                if (wlist[j].GetFreeAccessible()) {
                    wlist[j].SetFreeAccessible(false);
                    return;
                }
            }
        }
    }

    private RemoveOneTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }

    private RemoveOneArtyTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }

    private RemoveOnePusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }

    private RemoveOneArtyPusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                var wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }

    public CanTractorSpinner() {
        return this.CountTractorSpinner() + this.CountArtyTractorSpinner() < this.tractor_spinner_count;
    }

    public CanArtyTractorSpinner() {
        return this.CountArtyTractorSpinner() < this.tractor_arty_spinner_count;
    }

    public CanPusherSpinner() {
        return this.CountPusherSpinner() + this.CountArtyTractorSpinner() < this.pusher_spinner_count;
    }

    public CanArtyPusherSpinner() {
        return this.CountArtyPusherSpinner() < this.pusher_arty_spinner_count;
    }

    public SetTractorInfo(info: { have: boolean, spin_count: number, arty_spin_count: number }) {
        this.has_tractor = info.have;
        this.tractor_spinner_count = info.spin_count;
        this.tractor_arty_spinner_count = info.arty_spin_count;
    }

    public SetPusherInfo(info: { have: boolean, spin_count: number, arty_spin_count: number }) {
        this.has_pusher = info.have;
        this.pusher_spinner_count = info.spin_count;
        this.pusher_arty_spinner_count = info.arty_spin_count;
    }

    public GetActionList() {
        return this.action_list;
    }

    public GetProjectileList() {
        return this.projectile_list;
    }

    public GetBraceCount() {
        return this.brace_count;
    }

    public SetBraceCount(num: number) {
        if (num < 0 || num != num)
            num = 0;
        num -= num % 3;
        this.brace_count = num;
        this.CalculateStats();
    }

    public SetHavePropeller(have: boolean) {
        for (let ws of this.weapon_sets) {
            ws.SetHavePropeller(have);
        }
    }

    public SetStickyGuns(num: number) {
        for (let ws of this.weapon_sets) {
            ws.SetStickyGuns(num);
        }
    }

    public SetCalculateStats(callback: () => void) {
        this.CalculateStats = callback;
        for (let set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }

    public PartStats() {
        var stats = new Stats();

        //Update Freely Accessible state.
        while (this.CountFreelyAccessible() > this.cockpit_count) {
            this.RemoveOneFreelyAccessible();
        }
        while (this.CountArtyTractorSpinner() > this.tractor_arty_spinner_count) {
            this.RemoveOneArtyTractorSpinner();
        }
        while (this.CountTractorSpinner() > this.tractor_spinner_count) {
            this.RemoveOneTractorSpinner();
        }
        while (this.CountArtyPusherSpinner() > this.pusher_arty_spinner_count) {
            this.RemoveOneArtyPusherSpinner();
        }
        while (this.CountPusherSpinner() > this.pusher_spinner_count) {
            this.RemoveOnePusherSpinner();
        }

        //Wing reinforcement. Do this so it gets included in parts display.
        var wing_size = [0, 0];
        if (this.cant_type == 0)
            wing_size = [2, 2];
        else if (this.cant_type == 1)
            wing_size = [4, 4];
        else
            wing_size = [8, 8];

        //Create list of every weapon size and a ref to the weapon
        var slist = [];
        for (let ws of this.weapon_sets) {
            for (let w of ws.GetWeapons()) {
                w.wing_reinforcement = false;
                var s = { s: 0, w: w };
                if (w.GetWing()) {
                    s.s = (w.GetCount() * this.weapon_list[ws.GetWeaponSelected()].size);
                    slist.push(s);
                }
            }
        }

        //Sort by size to we reinforce as few weapons as possible
        slist.sort(function (a, b) { return a.s - b.s; });
        for (let s of slist) {
            if (wing_size[0] > 0) {
                wing_size[0] -= s.s;
                if (wing_size[0] < 0) {
                    wing_size[1] -= s.s;
                    if (wing_size[1] < 0) {
                        s.w.wing_reinforcement = true;
                    }
                }
            } else {
                wing_size[1] -= s.s;
                if (wing_size[1] < 0) {
                    s.w.wing_reinforcement = true;
                }
            }
        }

        for (let ws of this.weapon_sets) {
            ws.SetCanFreelyAccessible(this.CountFreelyAccessible() < this.cockpit_count);
            ws.SetTractorPusher(this.has_tractor, this.CanTractorSpinner(), this.CanArtyTractorSpinner(),
                this.has_pusher, this.CanPusherSpinner(), this.CanArtyPusherSpinner());
            ws.has_cantilever = this.cant_type > 0;
            stats = stats.Add(ws.PartStats());
        }

        //Weapon braces cost 1/3.  Should always be multiple of 3
        stats.cost += this.brace_count / 3;
        return stats;
    }
}