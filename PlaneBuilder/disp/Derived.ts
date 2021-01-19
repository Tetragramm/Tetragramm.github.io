class Derived_HTML {
    private tbl: HTMLTableElement;
    private name_inp: HTMLInputElement;
    private cost_cell: HTMLTableCellElement;
    private upkeep_cell: HTMLTableCellElement;
    private version_cell: HTMLTableCellElement;
    private full_row: HTMLTableRowElement;
    private bomb_row1: HTMLTableRowElement;
    private bomb_row2: HTMLTableRowElement;
    private ts_empty: HTMLTableCellElement;
    private ss_empty: HTMLTableCellElement;
    private hand_empty: HTMLTableCellElement;
    private boost_empty: HTMLTableCellElement;
    private roc_empty: HTMLTableCellElement;
    private ts_half: HTMLTableCellElement;
    private ss_half: HTMLTableCellElement;
    private hand_half: HTMLTableCellElement;
    private boost_half: HTMLTableCellElement;
    private roc_half: HTMLTableCellElement;
    private ts_full: HTMLTableCellElement;
    private ss_full: HTMLTableCellElement;
    private hand_full: HTMLTableCellElement;
    private boost_full: HTMLTableCellElement;
    private roc_full: HTMLTableCellElement;
    private ts_halfwB: HTMLTableCellElement;
    private ss_halfwB: HTMLTableCellElement;
    private hand_halfwB: HTMLTableCellElement;
    private boost_halfwB: HTMLTableCellElement;
    private roc_halfwB: HTMLTableCellElement;
    private ts_fullwB: HTMLTableCellElement;
    private ss_fullwB: HTMLTableCellElement;
    private hand_fullwB: HTMLTableCellElement;
    private boost_fullwB: HTMLTableCellElement;
    private roc_fullwB: HTMLTableCellElement;
    private vital_components: HTMLTableCellElement;
    private dropoff_cell: HTMLTableCellElement;
    private stability_cell: HTMLTableCellElement;
    private reliability_cell: HTMLTableCellElement;
    private flightstress_cell: HTMLTableCellElement;
    private overspeed_cell: HTMLTableCellElement;
    private eloss_cell: HTMLTableCellElement;
    private toughness_cell: HTMLTableCellElement;
    private visibility_cell: HTMLTableCellElement;
    private electric_cell: HTMLTableCellElement;
    private turnbleed_cell: HTMLTableCellElement;
    private mxstrain_cell: HTMLTableCellElement;
    private attack_cell: HTMLTableCellElement;
    private maxfuel_cell: HTMLTableCellElement;
    private landing_cell: HTMLTableCellElement;
    private escape_cell: HTMLTableCellElement;
    private communications_cell: HTMLTableCellElement;
    private crew_cell: HTMLTableCellElement;
    private maxalt_cell: HTMLTableCellElement;
    private crashsafety_cell: HTMLTableCellElement;
    private flammable_cell: HTMLTableCellElement;
    private weapon_head: HTMLTableHeaderCellElement;
    private weapon_cell: HTMLTableCellElement;
    private warning_head: HTMLTableHeaderCellElement;
    private warning_cell: HTMLTableCellElement;

    private show_bombs: boolean;

    constructor(tbl: HTMLTableElement) {
        var fragment = document.createDocumentFragment();
        var row0 = insertRow(fragment);
        var name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 2;
        this.name_inp = document.createElement("INPUT") as HTMLInputElement;
        this.name_inp.defaultValue = lu("Derived Aircraft Name");
        name_cell.appendChild(this.name_inp);

        CreateTH(row0, lu("Stat Cost"));
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
        CreateTH(row0, lu("Stat Upkeep"));
        // Aircraft Upkeep
        this.upkeep_cell = row0.insertCell();
        // Rules Version
        CreateTH(row0, lu("Derived Version #"));
        this.version_cell = row0.insertCell();

        var row1 = insertRow(fragment);
        CreateTH(row1, lu("Derived Mass Variations"));
        CreateTH(row1, lu("Derived Boost"));
        CreateTH(row1, lu("Derived Handling"));
        CreateTH(row1, lu("Derived Rate of Climb"));
        CreateTH(row1, lu("Derived Stall Speed"));
        CreateTH(row1, lu("Derived Top Speed"));
        CreateTH(row1, lu("Derived Vital Components")).colSpan = 2;


        this.bomb_row2 = insertRow(fragment);
        CreateTH(this.bomb_row2, lu("Derived Full Fuel with Bombs"));
        this.boost_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.roc_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.vital_components = this.bomb_row2.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;

        this.bomb_row1 = insertRow(fragment);
        CreateTH(this.bomb_row1, lu("Derived Half Fuel with Bombs"));
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.roc_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.ts_halfwB = this.bomb_row1.insertCell();

        this.full_row = insertRow(fragment);
        CreateTH(this.full_row, lu("Derived Full Fuel"));
        this.boost_full = this.full_row.insertCell();
        this.hand_full = this.full_row.insertCell();
        this.roc_full = this.full_row.insertCell();
        this.ss_full = this.full_row.insertCell();
        this.ts_full = this.full_row.insertCell();

        var half = insertRow(fragment);
        CreateTH(half, lu("Derived Half Fuel"));
        this.boost_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.roc_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.ts_half = half.insertCell();

        var empty = insertRow(fragment);
        CreateTH(empty, lu("Derived Empty Fuel"));
        this.boost_empty = empty.insertCell();
        this.hand_empty = empty.insertCell();
        this.roc_empty = empty.insertCell();
        this.ss_empty = empty.insertCell();
        this.ts_empty = empty.insertCell();

        var row7 = insertRow(fragment);
        CreateTH(row7, lu("Derived Propulsion")).colSpan = 2;
        CreateTH(row7, lu("Derived Aerodynamics")).colSpan = 2;
        CreateTH(row7, lu("Derived Survivability")).colSpan = 2;
        CreateTH(row7, lu("Derived Crew Members")).colSpan = 2;

        var row8 = insertRow(fragment);
        CreateTH(row8, lu("Derived Dropoff"));
        this.dropoff_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Stability"));
        this.stability_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Crash Safety"));
        this.crashsafety_cell = row8.insertCell();
        CreateTH(row8, lu("Derived Crew/Passengers"));
        this.crew_cell = row8.insertCell();

        var row9 = insertRow(fragment);
        CreateTH(row9, lu("Derived Overspeed"));
        this.overspeed_cell = row9.insertCell();
        CreateTH(row9, lu("Derived Energy Loss"));
        this.eloss_cell = row9.insertCell();
        CreateTH(row9, lu("Stat Toughness"));
        this.toughness_cell = row9.insertCell();
        CreateTH(row9, lu("Stat Visibility"));
        this.visibility_cell = row9.insertCell();

        var row10 = insertRow(fragment);
        CreateTH(row10, lu("Derived Fuel Uses"));
        this.maxfuel_cell = row10.insertCell();
        CreateTH(row10, lu("Derived Turn Bleed"));
        this.turnbleed_cell = row10.insertCell();
        CreateTH(row10, lu("Stat Max Strain"));
        this.mxstrain_cell = row10.insertCell();
        CreateTH(row10, lu("Derived Attack Modifier"));
        this.attack_cell = row10.insertCell();

        var row11 = insertRow(fragment);
        CreateTH(row11, lu("Stat Reliability"));
        this.reliability_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Landing Gear"));
        this.landing_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Communications"));
        this.communications_cell = row11.insertCell();
        CreateTH(row11, lu("Derived Escape"));
        this.escape_cell = row11.insertCell();

        var row12 = insertRow(fragment);
        CreateTH(row12, lu("Derived Ideal Engine Altitude"));
        this.maxalt_cell = row12.insertCell();
        CreateTH(row12, lu("Derived Is Flammable Question"));
        this.flammable_cell = row12.insertCell();
        CreateTH(row12, lu("Derived Electrics"));
        this.electric_cell = row12.insertCell();
        CreateTH(row12, lu("Stat Flight Stress"));
        this.flightstress_cell = row12.insertCell();

        this.weapon_head = CreateTH(insertRow(fragment), lu("Derived Weapon Systems"));
        this.weapon_head.colSpan = 8;
        this.weapon_cell = insertRow(fragment).insertCell();
        this.weapon_cell.colSpan = 8;

        this.warning_head = CreateTH(insertRow(fragment), lu("Derived Special Rules"));
        this.warning_head.colSpan = 8;
        this.warning_cell = insertRow(fragment).insertCell();
        this.warning_cell.colSpan = 8;
        tbl.appendChild(fragment);
        this.tbl = tbl;
    }

    public UpdateDisplay(acft: Aircraft, stats: Stats, derived: DerivedStats) {
        this.name_inp.value = acft.name;
        this.version_cell.textContent = acft.GetVersion();
        this.cost_cell.textContent = stats.cost.toString() + "þ ";
        if (acft.GetUsed().GetEnabled()) {
            this.cost_cell.textContent += " (" + Math.floor(1.0e-6 + stats.cost / 2).toString() + "þ " + lu("Price Word Used") + ")";
        }
        this.upkeep_cell.textContent = stats.upkeep.toString() + "þ";
        //Empty
        // this.ts_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedEmpty).toString();
        // this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        // this.hand_empty.textContent = derived.HandlingEmpty.toString();
        // this.boost_empty.textContent = derived.BoostEmpty.toString();
        // this.roc_empty.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull - derived.StallSpeedFull + derived.BoostFull).toString();
        this.ts_empty.textContent = (0).toString();
        this.ss_empty.textContent = derived.StallSpeedEmpty.toString();
        this.hand_empty.textContent = derived.HandlingEmpty.toString();
        this.boost_empty.textContent = (0).toString();
        this.roc_empty.textContent = (0).toString();
        //Half
        this.ts_half.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2).toString();
        this.ss_half.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFull) / 2).toString();
        this.hand_half.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFull) / 2).toString();
        this.boost_half.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFull) / 2).toString();
        this.roc_half.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2).toString();
        //Full
        this.ts_full.textContent = Math.floor(1.0e-6 + derived.MaxSpeedFull).toString();
        this.ss_full.textContent = derived.StallSpeedFull.toString();
        this.hand_full.textContent = derived.HandlingFull.toString();
        this.boost_full.textContent = derived.BoostFull.toString();
        this.roc_full.textContent = derived.RateOfClimbFull.toString();

        if (stats.bomb_mass > 0 || this.show_bombs) {
            this.bomb_row1.hidden = false;
            this.bomb_row2.hidden = false;
            this.bomb_row2.appendChild(this.vital_components);
            this.vital_components.rowSpan = 5;
            //Half
            this.ts_halfwB.textContent = Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2).toString();
            this.ss_halfwB.textContent = Math.floor(1.0e-6 + (derived.StallSpeedEmpty + derived.StallSpeedFullwBombs) / 2).toString();
            this.hand_halfwB.textContent = Math.floor(1.0e-6 + (derived.HandlingEmpty + derived.HandlingFullwBombs) / 2).toString();
            this.boost_halfwB.textContent = Math.floor(1.0e-6 + (derived.BoostEmpty + derived.BoostFullwBombs) / 2).toString();
            this.roc_halfwB.textContent = Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2).toString();
            //Full
            this.ts_fullwB.textContent = Math.floor(1.0e-6 + derived.MaxSpeedwBombs).toString();
            this.ss_fullwB.textContent = derived.StallSpeedFullwBombs.toString();
            this.hand_fullwB.textContent = derived.HandlingFullwBombs.toString();
            this.boost_fullwB.textContent = derived.BoostFullwBombs.toString();
            this.roc_fullwB.textContent = derived.RateOfClimbwBombs.toString();

        } else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
            this.full_row.appendChild(this.vital_components);
            this.vital_components.rowSpan = 3;
        }

        this.dropoff_cell.textContent = derived.Dropoff.toString();
        this.overspeed_cell.textContent = derived.Overspeed.toString();
        this.maxfuel_cell.textContent = (Math.floor(1.0e-6 + derived.FuelUses * 10) / 10).toString();
        if (acft.GetIsFlammable())
            this.flammable_cell.textContent = lu("Yes");
        else
            this.flammable_cell.textContent = lu("No");

        this.stability_cell.textContent = derived.Stabiilty.toString();
        this.eloss_cell.textContent = derived.EnergyLoss.toString();
        this.turnbleed_cell.textContent = derived.TurnBleed.toString();
        this.landing_cell.textContent = acft.GetGearName();
        this.maxalt_cell.textContent = acft.GetMinIAF().toString() + "-" + acft.GetMaxAltitude().toString();

        this.reliability_cell.textContent = this.Array2Str(acft.GetReliabilityList());
        this.toughness_cell.textContent = derived.Toughness.toString();
        this.mxstrain_cell.textContent = derived.MaxStrain.toString();
        this.escape_cell.textContent = this.Array2Str(acft.GetEscapeList());
        this.crashsafety_cell.textContent = stats.crashsafety.toString();

        this.crew_cell.textContent = acft.GetCockpits().GetNumberOfCockpits().toString() + "/" + (acft.GetPassengers().GetSeats() + acft.GetPassengers().GetBeds()).toString();
        this.flightstress_cell.textContent = this.Array2Str(acft.GetStressList());
        this.visibility_cell.textContent = this.Array2Str(acft.GetVisibilityList());
        this.attack_cell.textContent = this.Array2Str(acft.GetAttackList());
        this.communications_cell.textContent = acft.GetCommunicationName();
        var wm = acft.GetAccessories().GetWindmill();
        var bat = acft.GetAccessories().GetStorage();
        var electric_str = stats.charge.toString();
        if (wm > 0)
            electric_str += " + " + wm.toString() + lu("Derived Per 10 Speed");
        if (bat > 0)
            electric_str += " + " + bat + " " + lu("Derived Battery word storage");
        this.electric_cell.textContent = electric_str;

        var vital = "";
        var vlist = acft.VitalComponentList();
        for (let v of vlist) {
            vital += v + "<br/>";
        }
        this.vital_components.innerHTML = vital;

        var wlist = acft.GetWeapons().GetWeaponList();
        var dlist = acft.GetWeapons().GetDirectionList();
        var bombs = acft.GetMunitions().GetBombCount();
        var rockets = acft.GetMunitions().GetRocketCount();
        var internal = acft.GetMunitions().GetInternalBombCount();
        var weaphtml = "";
        if (bombs > 0) {
            var int_bomb = Math.min(bombs, internal);
            var ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                weaphtml += (int_bomb.toString() + lu(" Bomb Mass Internally."));
            if (ext_bomb > 0)
                weaphtml += (ext_bomb.toString() + lu(" Bomb Mass Externally."));
            if (int_bomb > 0) {
                var mib = Math.min(int_bomb, acft.GetMunitions().GetMaxBombSize());
                weaphtml += (lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            weaphtml += "<br/>";
        }
        if (rockets > 0) {
            var int_rock = Math.min(rockets, internal);
            var ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                weaphtml += (int_rock.toString() + lu(" Rocket Mass Internally."));
            if (ext_rock > 0)
                weaphtml += (ext_rock.toString() + lu(" Rocket Mass Externally."));
            weaphtml += "<br/>";
        }

        for (let w of acft.GetWeapons().GetWeaponSets()) {
            var ds = w.GetDirection();
            var dirs = [];
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    dirs.push(lu(dlist[i]));
            }
            let hits = w.GetHits();
            var tags = [lu("Weapon Tag Jam", w.GetJam())];
            if (w.GetReload() > 0) {
                tags.push(lu("Weapon Tag Reload", w.GetReload()));
            }
            if (w.GetFinalWeapon().rapid) {
                tags.push(lu("Weapon Tag Rapid Fire"));
            }
            if (w.GetFinalWeapon().shells) {
                tags.push(lu("Weapon Tag Shells"));
            }
            if (w.GetFinalWeapon().ap > 0) {
                tags.push(lu("Weapon Tag AP", w.GetFinalWeapon().ap));
            }

            if (w.GetProjectile() == ProjectileType.HEATRAY) {
                let chgs = w.GetHRCharges();
                weaphtml += lu("Weapon Description Heat Ray",
                    w.GetWeaponCount(),
                    this.WeaponName(acft, w),
                    StringFmt.Join(" ", dirs),
                    wlist[w.GetWeaponSelected()].damage,
                    StringFmt.Join("/", hits),
                    StringFmt.Join("/", chgs),
                    StringFmt.Join(", ", tags)
                );
            } else {
                weaphtml += lu("Weapon Description",
                    w.GetWeaponCount(),
                    this.WeaponName(acft, w),
                    StringFmt.Join(" ", dirs),
                    wlist[w.GetWeaponSelected()].damage,
                    StringFmt.Join("/", hits),
                    w.GetShots(),
                    StringFmt.Join(", ", tags)
                );
            }
            weaphtml += "<br\>";
        }
        this.weapon_cell.innerHTML = weaphtml;

        var warnhtml = "";
        for (let w of stats.warnings) {
            warnhtml += w.source + ":  " + w.warning + "<br/>";
        }
        this.warning_cell.innerHTML = warnhtml;
    }

    private WeaponName(acft: Aircraft, w: WeaponSystem): string {
        var wlist = acft.GetWeapons().GetWeaponList();
        var ds = w.GetDirection();
        var dircount = 0;
        for (let d of ds) {
            if (d)
                dircount++;
        }
        var name = "";
        if (dircount == 1 && w.GetFixed())
            name += lu("Fixed") + " ";
        else if (dircount <= 2)
            name += lu("Flexible") + " ";
        else
            name += lu("Turreted") + " ";

        if (w.GetAction() == ActionType.MECHANICAL) {
            name += lu("Weapon Tag Mechanical Action") + " ";
        } else if (w.GetAction() == ActionType.GAST) {
            name += lu("Weapon Tag Gast Principle") + " ";
        } else if (w.GetAction() == ActionType.ROTARY) {
            name += lu("Weapon Tag Rotary") + " ";
        }

        if (w.GetProjectile() == ProjectileType.HEATRAY) {
            name += lu("Weapon Tag Heat Ray") + " ";
        } else if (w.GetProjectile() == ProjectileType.GYROJETS) {
            name += lu("Weapon Tag Gyrojet") + " ";
        } else if (w.GetProjectile() == ProjectileType.PNEUMATIC) {
            name += lu("Weapon Tag Pneumatic") + " ";
        }

        name += wlist[w.GetWeaponSelected()].abrv;
        return name;
    }

    public GetName() {
        return this.name_inp.value;
    }
    public SetName(name: string) {
        console.log(name);
        this.name_inp.value = name;
    }

    public SetShowBombs(set: boolean) {
        this.show_bombs = set;
    }

    private Array2Str(arr: any[]) {
        var str = "";
        for (let i = 0; i < arr.length - 1; i++) {
            str += arr[i].toString() + ", ";
        }
        if (arr.length > 0)
            str += arr[arr.length - 1].toString();

        return str;
    }
}