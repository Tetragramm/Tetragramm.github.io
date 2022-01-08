/// <reference path="../Test/impl/Part.ts" />
/// <reference path="../Test/impl/Localization.ts" />
/// <reference path="../Test/impl/Stats.ts" />
/// <reference path="../Test/impl/EngineList.ts"/>
/// <reference path="../Test/impl/Era.ts" />
/// <reference path="../Test/impl/Cockpits.ts" />
/// <reference path="../Test/impl/Passengers.ts" />
/// <reference path="../Test/impl/Engines.ts" />
/// <reference path="../Test/impl/Propeller.ts" />
/// <reference path="../Test/impl/Frames.ts" />
/// <reference path="../Test/impl/Wings.ts" />
/// <reference path="../Test/impl/Stabilizers.ts" />
/// <reference path="../Test/impl/ControlSurfaces.ts" />
/// <reference path="../Test/impl/Reinforcement.ts" />
/// <reference path="../Test/impl/Fuel.ts" />
/// <reference path="../Test/impl/Munitions.ts" />
/// <reference path="../Test/impl/CargoAndPassengers.ts" />
/// <reference path="../Test/impl/LandingGear.ts" />
/// <reference path="../Test/impl/Accessories.ts" />
/// <reference path="../Test/impl/Optimization.ts" />
/// <reference path="../Test/impl/Weapons.ts" />
/// <reference path="../Test/impl/Used.ts" />
/// <reference path="../Test/impl/Rotor.ts" />


class Helicopter {
    private use_storage: boolean = false;
    private version: string;
    public name: string;
    private stats: Stats;
    private updated_stats: boolean;
    private freeze_calculation: boolean;
    private DisplayCallback: () => void;
    private aircraft_type: AIRCRAFT_TYPE;
    private era: Era;
    private cockpits: Cockpits;
    private passengers: Passengers;
    private engines: Engines;
    private propeller: Propeller;
    private frames: Frames;
    private stabilizers: Stabilizers;
    private reinforcements: Reinforcement;
    private fuel: Fuel;
    private munitions: Munitions;
    private cargo: CargoAndPassengers;
    private gear: LandingGear;
    private accessories: Accessories;
    private optimization: Optimization;
    private weapons: Weapons;
    private used: Used;
    private rotor: Rotor;
    private alter: AlterStats;

    private reset_json = String.raw`{"version":"12.3","name":"Basic Helicopter","aircraft_type":1,"era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Schreiber B.IX 130hp","overspeed":19,"altitude":29,"torque":4,"rumble":0,"oiltank":true,"pulsejet":false,"liftbleed":0,"wetmass":0,"mass":7,"drag":10,"control":0,"cost":8,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":0,"power":13,"fuelconsumption":16,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0,"warnings":[],"eras":[{"name":"Schreiber B.IX 130hp","era":"WWI"}]},"selected_inputs":{"name":"Schreiber B.IX 130hp","engine_type":0,"type":2,"era_sel":1,"displacement":16.2,"compression":4.8,"cyl_per_row":9,"rows":1,"RPM_boost":0.95,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},"cooling_count":0,"radiator_index":-1,"selected_mount":1,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":true,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":0,"is_generator":false,"has_alternator":false,"intake_fan":false,"outboard_prop":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":0,"upgrade":0},"frames":{"sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"reinforcements":{"ext_wood_count":[],"ext_steel_count":[],"cant_count":[0,0,0,0,0],"wires":false,"cabane_sel":0,"wing_blades":false},"fuel":{"tank_count":[1,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":4,"retract":false,"extra_sel":[false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"recon_sel":[0,0,0,0,0,0,0],"visi_sel":[false,false],"clim_sel":[false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":-1,"w_count":1}],"ammo":1,"action":0,"projectile":0,"repeating":false,"seat":0}],"brace_count":0},"used":{"enabled":true,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0},"rotor":{"type":1,"rotor_count":1,"rotor_span":10,"rotor_mat":0,"stagger_sel":0,"accessory":false,"blade_idx":0},"alter":{"part_list":[]}}`;

    constructor(js: JSON, weapon_json: JSON, storage: boolean) {
        this.freeze_calculation = true;
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers(js["cargo"]);
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(weapon_json);
        this.used = new Used();
        this.rotor = new Rotor(js["rotor"]);
        this.alter = new AlterStats();

        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.stabilizers.SetCalculateStats(() => { this.CalculateStats(); });
        this.reinforcements.SetCalculateStats(() => { this.CalculateStats(); });
        this.fuel.SetCalculateStats(() => { this.CalculateStats(); });
        this.munitions.SetCalculateStats(() => { this.CalculateStats(); });
        this.cargo.SetCalculateStats(() => { this.CalculateStats(); });
        this.gear.SetCalculateStats(() => { this.CalculateStats(); });
        this.accessories.SetCalculateStats(() => { this.CalculateStats(); });
        this.optimization.SetCalculateStats(() => { this.CalculateStats(); });
        this.weapons.SetCalculateStats(() => { this.CalculateStats(); });
        this.used.SetCalculateStats(() => { this.CalculateStats(); });
        this.rotor.SetCalculateStats(() => { this.CalculateStats(); });
        this.alter.SetCalculateStats(() => { this.CalculateStats(); });

        this.rotor.SetCantileverList(this.reinforcements.GetCantileverList());
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);

        this.use_storage = storage;
        this.updated_stats = false;
        this.freeze_calculation = false;
        this.aircraft_type = AIRCRAFT_TYPE.HELICOPTER;
        this.Reset();
    }

    public toJSON() {
        return {
            version: this.version,
            name: this.name,
            aircraft_type: this.aircraft_type,
            era: this.era.toJSON(),
            cockpits: this.cockpits.toJSON(),
            passengers: this.passengers.toJSON(),
            engines: this.engines.toJSON(),
            propeller: this.propeller.toJSON(),
            frames: this.frames.toJSON(),
            stabilizers: this.stabilizers.toJSON(),
            reinforcements: this.reinforcements.toJSON(),
            fuel: this.fuel.toJSON(),
            munitions: this.munitions.toJSON(),
            cargo: this.cargo.toJSON(),
            gear: this.gear.toJSON(),
            accessories: this.accessories.toJSON(),
            optimization: this.optimization.toJSON(),
            weapons: this.weapons.toJSON(),
            used: this.used.toJSON(),
            rotor: this.rotor.toJSON(),
            alter: this.alter.toJSON(),
        };
    }

    public fromJSON(js: JSON, disp: boolean = true) {
        this.freeze_calculation = true;
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
        var json_version = parseFloat(js["version"]);
        this.name = js["name"];
        if (json_version > 11.05) {
            this.aircraft_type = js["aircraft_type"];
            if (this.aircraft_type != AIRCRAFT_TYPE.HELICOPTER) {
                return false;
            }
            this.rotor.SetType(js["aircraft_type"]);
        } else {
            return false;
        }
        this.era.fromJSON(js["era"], json_version);
        this.cockpits.fromJSON(js["cockpits"], json_version);
        this.passengers.fromJSON(js["passengers"], json_version);
        this.engines.fromJSON(js["engines"], json_version);
        this.propeller.fromJSON(js["propeller"], json_version);
        this.frames.fromJSON(js["frames"], json_version);
        this.stabilizers.fromJSON(js["stabilizers"], json_version);
        this.reinforcements.fromJSON(js["reinforcements"], json_version);
        this.fuel.fromJSON(js["fuel"], json_version);
        this.munitions.fromJSON(js["munitions"], json_version);
        this.cargo.fromJSON(js["cargo"], json_version);
        this.gear.fromJSON(js["gear"], json_version);
        this.accessories.fromJSON(js["accessories"], json_version);
        this.optimization.fromJSON(js["optimization"], json_version);
        this.weapons.fromJSON(js["weapons"], json_version);
        if (json_version > 10.65) {
            this.used.fromJSON(js["used"], json_version);
        }
        if (json_version > 11.05) {
            this.rotor.fromJSON(js["rotor"], json_version);
        }
        if (json_version > 12.25) {
            this.alter.fromJSON(js["alter"], json_version);
        } else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
        return true;
    }

    public serialize(s: Serialize) {
        s.PushString(this.version);
        s.PushString(this.name);
        this.era.serialize(s);
        this.cockpits.serialize(s);
        this.passengers.serialize(s);
        this.engines.serialize(s);
        this.propeller.serialize(s);
        this.frames.serialize(s);
        this.stabilizers.serialize(s);
        this.reinforcements.serialize(s);
        this.fuel.serialize(s);
        this.munitions.serialize(s);
        this.cargo.serialize(s);
        this.gear.serialize(s);
        this.accessories.serialize(s);
        this.optimization.serialize(s);
        this.weapons.serialize(s);
        this.used.serialize(s);
        this.rotor.serialize(s);
        s.PushNum(this.aircraft_type);
        this.alter.serialize(s);
    }

    public deserialize(d: Deserialize) {
        this.freeze_calculation = true;
        d.version = parseFloat(d.GetString());
        console.log(d.version);
        this.name = d.GetString();
        this.era.deserialize(d);
        this.cockpits.deserialize(d);
        this.passengers.deserialize(d);
        this.engines.deserialize(d);
        this.propeller.deserialize(d);
        this.frames.deserialize(d);
        this.stabilizers.deserialize(d);
        this.reinforcements.deserialize(d);
        this.fuel.deserialize(d);
        this.munitions.deserialize(d);
        this.cargo.deserialize(d);
        this.gear.deserialize(d);
        this.accessories.deserialize(d);
        this.optimization.deserialize(d);
        this.weapons.deserialize(d);
        if (d.version > 10.65) {
            this.used.deserialize(d);
        }
        if (d.version > 11.05) {
            this.rotor.deserialise(d);
            this.aircraft_type = d.GetNum();
            this.rotor.SetType(this.aircraft_type);
        } else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
        if (d.version > 12.25) {
            this.alter.deserialize(d);
        } else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
    }

    public SetType(type: AIRCRAFT_TYPE) {
        this.aircraft_type = type;
        this.rotor.SetType(type);

        this.CalculateStats();
    }

    public SetDisplayCallback(callback: () => void) {
        this.DisplayCallback = callback;
    }

    public CalculateStats() {
        if (this.freeze_calculation) {
            return;
        }
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());

        this.engines.SetTailMods(false, false, false);
        this.engines.SetInternal(false);
        this.engines.SetMetalArea(0);
        this.engines.HaveParasol(false);
        stats = stats.Add(this.engines.PartStats());

        this.propeller.SetEngineTypes(this.engines.GetEngineTypes());
        this.propeller.SetAcftType(this.aircraft_type);
        stats = stats.Add(this.propeller.PartStats());

        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        //Weapons go here, because they make sections.
        this.weapons.SetNumberOfCockpits(this.cockpits.GetNumberOfCockpits());
        this.weapons.SetTractorInfo(this.engines.GetTractorSpinner());
        this.weapons.SetPusherInfo(this.engines.GetPusherSpinner());
        this.weapons.SetHeli(true);
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        this.weapons.SetHavePropeller(this.engines.GetNumPropellers() > 0);
        this.weapons.SetCanWing(false);
        stats = stats.Add(this.weapons.PartStats());
        //Cargo makes sections
        stats = stats.Add(this.cargo.PartStats());

        this.rotor.SetType(this.aircraft_type);
        this.rotor.SetWingArea(stats.wingarea);
        //If there is a rotor...
        this.rotor.SetEngineCount(this.engines.GetNumberOfEngines());
        stats = stats.Add(this.rotor.PartStats());

        this.reinforcements.SetMonoplane(false);
        this.reinforcements.SetTandem(false);
        this.reinforcements.SetStaggered(false);
        this.reinforcements.SetCanUseExternal(false);
        this.reinforcements.SetSesquiplane({ is: false, deck: 0, super_small: false });
        this.reinforcements.SetAircraftType(this.aircraft_type);
        this.reinforcements.SetCantLift(this.era.GetCantLift());
        stats = stats.Add(this.reinforcements.PartStats());

        if (this.rotor.GetTailRotor()) {
            stats.power = Math.floor(1.0e-6 + 0.9 * stats.power);
        }

        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        this.accessories.SetSkinArmor(this.frames.GetArmor());
        this.accessories.SetVitalParts(this.VitalComponentList().length);
        this.accessories.SetCanCutouts(false, this.frames.CanCutout());
        stats = stats.Add(this.accessories.PartStats());

        //You know what, frames go last, because lots of things make sections.
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.frames.SetIsTandem(this.rotor.GetTailRotor());
        stats = stats.Add(this.frames.PartStats());

        //Depends on Lifting area.
        this.stabilizers.SetHelicopter(true);
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(false);
        this.stabilizers.SetIsSwept(false);
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetLiftingArea(this.rotor.GetRotorArea());
        this.stabilizers.wing_drag = this.rotor.GetRotorDrag();
        stats = stats.Add(this.stabilizers.PartStats());

        stats.mass = Math.max(1, stats.mass);

        //Gear go last, because they need total mass.
        this.gear.SetGull(0);
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), 2);
        stats = stats.Add(this.gear.PartStats());

        //Add toughness here so it gets optimized properly.
        stats.toughness += Math.floor(1.0e-6 + stats.structure / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());

        //Has flight stress from open cockpit + tractor rotary.
        this.cockpits.SetHasRotary(this.engines.HasTractorRotary());

        stats = stats.Add(this.alter.PartStats());

        //Rotor Power Factor
        stats.power = Math.floor(1.0e-6 + this.rotor.GetPowerFactor() * stats.power);

        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();

        this.rotor.SetMP(Math.floor(1.0e-6 + stats.mass / 5));

        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;

            var derived = this.GetDerivedStats();

            //Used: burnt_out
            stats.reliability -= this.used.burnt_out;

            //Used: sticky_guns  (Just needs to happen before display)
            this.weapons.SetStickyGuns(this.used.sticky_guns);

            //Update Part Local stuff
            this.cockpits.SetArmed(this.weapons.GetArmedSeats());
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.ControlStress, derived.RumbleStress, this.stats.visibility, this.stats.crashsafety);
            //Check Flight Stress for warnings
            let stress_reduction = 0;
            for (let s of this.cockpits.GetStressList()) {
                stress_reduction = Math.max(stress_reduction, s[0] - s[1]);
            }
            if (stress_reduction != 0 && this.stats.warnings.findIndex((value) => { return value.source == lu("Co-Pilot Controls") }) == -1) {
                this.stats.warnings.push({
                    source: lu("Co-Pilot Controls"),
                    warning: lu("Co-Pilot Warning", stress_reduction)
                });
            }

            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(0);
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftParameters(stats.structure, this.era.GetMaxBomb(), 0);

            //Airplanes always cost 1
            this.stats.cost = Math.max(1, this.stats.cost);
            //Always have at least 1 liftbleed
            this.stats.liftbleed = Math.max(1, this.stats.liftbleed);

            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: lu("Stat Rumble"),
                    warning: lu("Rumble Warning")
                });
            }

            if (this.DisplayCallback && !this.freeze_calculation)
                this.DisplayCallback();

            if (this.use_storage)
                window.localStorage.setItem("test.helicopter", JSON.stringify(this));
        }
    }

    public GetDerivedStats(): DerivedStats {
        var DryMP = Math.floor(1.0e-6 + this.stats.mass / 5);
        DryMP = Math.max(DryMP, 1);
        var WetMP = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass) / 5);
        WetMP = Math.max(WetMP, 1);
        var WetMPwBombs = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        WetMPwBombs = Math.max(WetMPwBombs, 1);
        var DPEmpty = Math.floor(1.0e-6 + (this.stats.drag + DryMP) / 5);
        DPEmpty = Math.max(DPEmpty, 1);
        var DPFull = DPEmpty; //Based on advice from Discord.
        var DPwBombs = Math.floor(1.0e-6 + (this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        DPwBombs = Math.max(DPwBombs, 1);
        var MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9))));
        var MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9))));
        var MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9))));
        // Supersonic Tests
        // var MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPEmpty * 9))));
        // var MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPFull * 9))));
        // var MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPwBombs * 9))));

        var StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea)));
        var StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea)));
        var StallSpeedFullwBombs = Math.max(Math.floor(1.0e-6 + this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea)));

        var Overspeed = this.engines.GetOverspeed();
        var BoostEmpty = Math.floor(1.0e-6 + this.stats.power / DryMP);
        var BoostFull = Math.floor(1.0e-6 + this.stats.power / WetMP);
        var BoostFullwBombs = Math.floor(1.0e-6 + this.stats.power / WetMPwBombs);
        var Dropoff = Math.floor(1.0e-6 + this.stats.pitchboost * MaxSpeedEmpty);

        if (BoostFullwBombs < 2) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Helicopter Flight") }) == -1) {
                this.stats.warnings.push({
                    source: lu("Helicopter Flight"),
                    warning: lu("Helicopter Flight Warning")
                });
            }
        }

        //Used: Ragged
        // Comes after Dropoff so Used only affects the one number, not multiple.
        MaxSpeedEmpty = Math.floor(1.0e-6 + MaxSpeedEmpty * (1 - 0.1 * this.used.ragged));
        MaxSpeedFull = Math.floor(1.0e-6 + MaxSpeedFull * (1 - 0.1 * this.used.ragged));
        MaxSpeedwBombs = Math.floor(1.0e-6 + MaxSpeedwBombs * (1 - 0.1 * this.used.ragged));

        var Stability = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stability += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stability -= 2;

        var HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stability > 10 || Stability < -10) {
            HandlingEmpty = -1 / 0;
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Stability") }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Stability"), warning: lu("Stability Warning")
                });
            }
        } else if (Stability == 10)
            HandlingEmpty -= 4;
        else if (Stability > 6)
            HandlingEmpty -= 3;
        else if (Stability > 3)
            HandlingEmpty -= 2;
        else if (Stability > 0)
            HandlingEmpty -= 1;
        else if (Stability == 0)
            HandlingEmpty += 0;
        else if (Stability > -4)
            HandlingEmpty += 1;
        else if (Stability > -7)
            HandlingEmpty += 2;
        else if (Stability > -10)
            HandlingEmpty += 3;
        else if (Stability == -10)
            HandlingEmpty += 4;

        var HandlingFull = HandlingEmpty + DryMP - WetMP;
        var HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;

        //Used: Sluggish
        HandlingEmpty = Math.floor(1.0e-6 + HandlingEmpty - 5 * this.used.sluggish);
        HandlingFull = Math.floor(1.0e-6 + HandlingFull - 5 * this.used.sluggish);
        HandlingFullwBombs = Math.floor(1.0e-6 + HandlingFullwBombs - 5 * this.used.sluggish);

        var MaxStrain = 1 / 0;
        MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        //And store the results so they can be displayed
        this.optimization.final_ms = Math.floor(1.0e-6 + this.optimization.GetMaxStrain() * 1.5 * MaxStrain / 10);
        MaxStrain += this.optimization.final_ms;
        //Used: Fragile
        MaxStrain = Math.floor(1.0e-6 + MaxStrain * (1 - 0.2 * this.used.fragile));
        if (MaxStrain < 10 && this.stats.warnings.findIndex((value) => { return value.source == lu("Stat Max Strain") }) == -1) {
            this.stats.warnings.push({
                source: lu("Stat Max Strain"), warning: lu("Max Strain Warning")
            });
        }

        var Toughness = this.stats.toughness;
        //Used: Weak
        Toughness = Math.floor(1.0e-6 + Toughness * (1 - 0.5 * this.used.weak));
        var Structure = this.stats.structure;
        var EnergyLoss = Math.max(1, Math.floor(1.0e-6 + DPEmpty / 7));
        var EnergyLosswBombs = EnergyLoss + 1;
        EnergyLoss = Math.min(EnergyLoss, 10);
        EnergyLosswBombs = Math.min(EnergyLosswBombs, 10);
        var TurnBleed = Math.floor(1.0e-6 + DryMP / 2) + this.rotor.GetRotorBleed();

        StallSpeedEmpty = 0;
        StallSpeedFull = 0;
        StallSpeedFullwBombs = 0;

        TurnBleed = Math.max(TurnBleed, 1);
        var TurnBleedwBombs = TurnBleed + 1;
        TurnBleedwBombs = Math.max(TurnBleedwBombs, 1);

        //Used: Hefty
        // Comes after Turnbleed so Used only affects the one number, not multiple.
        StallSpeedEmpty = Math.floor(1.0e-6 + StallSpeedEmpty * (1 + 0.2 * this.used.hefty));
        StallSpeedFull = Math.floor(1.0e-6 + StallSpeedFull * (1 + 0.2 * this.used.hefty));
        StallSpeedFullwBombs = Math.floor(1.0e-6 + StallSpeedFullwBombs * (1 + 0.2 * this.used.hefty));

        if (MaxSpeedwBombs <= StallSpeedFullwBombs || MaxSpeedFull <= StallSpeedFull) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Stall Speed") }) == -1) {
                this.stats.warnings.push({
                    source: lu("Stall Speed"), warning: lu("Stall Speed Warning")
                });
            }
        }

        var FuelUses = Math.floor(1.0e-6 + this.stats.fuel / this.stats.fuelconsumption);
        //Used: Leaky
        FuelUses = Math.floor(1.0e-6 + FuelUses * (1 - 0.2 * this.used.leaky));
        if (!isFinite(FuelUses)) {
            FuelUses = 0;
        }
        if (FuelUses < 6) {
            if (this.stats.warnings.findIndex((value) => { return value.source == lu("Derived Fuel Uses") }) == -1) {
                this.stats.warnings.push({
                    source: lu("Derived Fuel Uses"), warning: lu("Fuel Uses Warning")
                });
            }
        }

        var ControlStress = 1;
        if (Stability > 3 || Stability < -3)
            ControlStress++;
        //Flight Stress from Rumble.
        var RumbleStress = 0;
        ControlStress += Math.min(this.accessories.GetMaxMassStress(), Math.floor(1.0e-6 + DryMP / 10));
        var MaxStress = this.accessories.GetMaxTotalStress();
        ControlStress = Math.min(MaxStress, ControlStress);

        if (this.engines.GetMaxRumble() > 0) {
            RumbleStress += Math.max(1, this.engines.GetMaxRumble());
            RumbleStress = Math.floor(1.0e-6 + RumbleStress);
        }
        if (MaxStress == 0) {
            RumbleStress = 0;
        }


        var RateOfClimbEmpty = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / DryMP) * (23.0 / this.stats.pitchspeed) / DPEmpty));
        var RateOfClimbFull = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMP) * (23.0 / this.stats.pitchspeed) / DPFull));
        var RateOfClimbwBombs = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMPwBombs) * (23.0 / this.stats.pitchspeed) / DPwBombs));
        if (!isFinite(RateOfClimbEmpty)) {
            RateOfClimbEmpty = 0;
            RateOfClimbFull = 0;
            RateOfClimbwBombs = 0;
        }

        return {
            DryMP: DryMP,
            WetMP: WetMP,
            WetMPwBombs: WetMPwBombs,
            DPEmpty: DPEmpty,
            DPFull: DPFull,
            DPwBombs: DPwBombs,
            MaxSpeedEmpty: MaxSpeedEmpty,
            MaxSpeedFull: MaxSpeedFull,
            MaxSpeedwBombs: MaxSpeedwBombs,
            StallSpeedEmpty: StallSpeedEmpty,
            StallSpeedFull: StallSpeedFull,
            StallSpeedFullwBombs: StallSpeedFullwBombs,
            Overspeed: Overspeed,
            BoostEmpty: BoostEmpty,
            BoostFull: BoostFull,
            BoostFullwBombs: BoostFullwBombs,
            Dropoff: Dropoff,
            Stabiilty: Stability,
            HandlingEmpty: HandlingEmpty,
            HandlingFull: HandlingFull,
            HandlingFullwBombs: HandlingFullwBombs,
            MaxStrain: MaxStrain,
            Toughness: Toughness,
            Structure: Structure,
            EnergyLoss: EnergyLoss,
            EnergyLosswBombs: EnergyLosswBombs,
            TurnBleed: TurnBleed,
            TurnBleedwBombs: TurnBleedwBombs,
            FuelUses: FuelUses,
            ControlStress: ControlStress,
            RumbleStress: RumbleStress,
            RateOfClimbFull: RateOfClimbFull,
            RateOfClimbEmpty: RateOfClimbEmpty,
            RateOfClimbwBombs: RateOfClimbwBombs,
        }
    }

    public VitalComponentList(): string[] {
        var derived = this.GetDerivedStats();
        var vital = [];
        vital.push(lu("Vital Part Controls"));
        for (let i = 0; i < this.GetCockpits().GetNumberOfCockpits(); i++) {
            vital.push(lu("Seat #", i + 1) + ": " + lu(this.GetCockpits().GetCockpit(i).GetName()));
        }
        if (derived.FuelUses > 0) {
            vital.push(lu("Vital Part Fuel Tanks"));
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfEngines(); i++) {
            if (this.GetEngines().GetEngine(i).GetUsePushPull()) {
                vital.push(lu("Vital Part Engine Pusher", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan Pusher", i + 1));
                }
                vital.push(lu("Vital Part Engine Puller", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan Puller", i + 1));
                }
            }
            else {
                vital.push(lu("Vital Part Engine", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(lu("Vital Part Oil Tank", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(lu("Vital Part Oil Cooler", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(lu("Vital Part Oil Pan", i + 1));
                }
            }
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfRadiators(); i++) {
            vital.push(lu("Vital Part Radiator", i + 1));
        }
        if (this.IsElectrics()) {
            vital.push(lu("Vital Part Electrics"));
        }
        var wlist = this.GetWeapons().GetWeaponList();
        for (let i = 0; i < this.GetWeapons().GetWeaponSets().length; i++) {
            vital.push(lu("Vital Part Weapon Set", i + 1, wlist[this.GetWeapons().GetWeaponSets()[i].GetWeaponSelected()].abrv));
        }
        if (this.GetLandingGear().IsVital()) {
            vital.push(lu("Vital Part Landing Gear"));
        }
        if (this.rotor.GetTailRotor()) {
            vital.push(lu("Vital Part Tail Rotor"));
        }
        return vital;
    }

    public SetStorage(use: boolean) {
        this.use_storage = use;
    }

    public Reset() {
        this.fromJSON(JSON.parse(this.reset_json), false);
    }

    public GetVersion() {
        return this.version;
    }

    public GetCommunicationName() {
        return this.accessories.GetCommunicationName();
    }

    public GetAttackList() {
        return this.cockpits.GetAttackList();
    }

    public GetVisibilityList() {
        return this.cockpits.GetVisibilityList();
    }

    public GetStressList() {
        return this.cockpits.GetStressList();
    }

    public GetEscapeList() {
        return this.cockpits.GetEscapeList();
    }

    public GetCrashList() {
        return this.cockpits.GetCrashList();
    }

    public GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }

    public GetMinIAF() {
        return this.engines.GetMinIAF();
    }

    public GetMaxIAF() {
        return this.engines.GetMaxIAF();
    }

    public GetMinAltitude() {
        return this.engines.GetMinAltitude();
    }

    public GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }

    public GetGearName() {
        return this.gear.GetGearName();
    }

    public GetIsFlammable() {
        return this.frames.GetIsFlammable() || this.engines.GetIsFlammable();
    }

    public GetAircraftType() {
        return this.aircraft_type;
    }

    public GetEra(): Era {
        return this.era;
    }
    public GetCockpits(): Cockpits {
        return this.cockpits;
    }
    public GetPassengers(): Passengers {
        return this.passengers;
    }
    public GetEngines(): Engines {
        return this.engines;
    }
    public GetPropeller(): Propeller {
        return this.propeller;
    }
    public GetFrames(): Frames {
        return this.frames;
    }
    public GetStabilizers(): Stabilizers {
        return this.stabilizers;
    }
    public GetReinforcements(): Reinforcement {
        return this.reinforcements;
    }
    public GetFuel(): Fuel {
        return this.fuel;
    }
    public GetMunitions(): Munitions {
        return this.munitions;
    }
    public GetCargoAndPassengers(): CargoAndPassengers {
        return this.cargo;
    }
    public GetLandingGear(): LandingGear {
        return this.gear;
    }
    public GetAccessories(): Accessories {
        return this.accessories;
    }
    public GetOptimization(): Optimization {
        return this.optimization;
    }
    public GetStats() {
        return this.stats;
    }
    public GetWeapons() {
        return this.weapons;
    }
    public IsElectrics() {
        return this.engines.IsElectrics() || this.accessories.IsElectrics() || this.cockpits.IsElectrics();
    }
    public GetUsed() {
        return this.used;
    }
    public GetRotor() {
        return this.rotor;
    }
    public GetAlter() {
        return this.alter;
    }
    public GetElectrics(): { storage: number, equipment: { source: string, charge: string }[] } {
        let value: { storage: number, equipment: { source: string, charge: string }[] } = { storage: 0, equipment: [] };
        value = MergeElectrics(value, this.accessories.GetElectrics());
        value = MergeElectrics(value, this.cockpits.GetElectrics());
        value = MergeElectrics(value, this.alter.GetElectrics());

        value = MergeElectrics(value, this.cargo.GetElectrics());
        value = MergeElectrics(value, this.era.GetElectrics());
        value = MergeElectrics(value, this.frames.GetElectrics());
        value = MergeElectrics(value, this.fuel.GetElectrics());
        value = MergeElectrics(value, this.gear.GetElectrics());
        value = MergeElectrics(value, this.munitions.GetElectrics());
        value = MergeElectrics(value, this.optimization.GetElectrics());
        value = MergeElectrics(value, this.passengers.GetElectrics());
        value = MergeElectrics(value, this.reinforcements.GetElectrics());
        value = MergeElectrics(value, this.rotor.GetElectrics());
        value = MergeElectrics(value, this.stabilizers.GetElectrics());
        value = MergeElectrics(value, this.used.GetElectrics());

        value.equipment = value.equipment.sort((a, b) => {
            var ac = parseInt(a.charge);
            if (a.charge == "-")
                ac = 0;
            var bc = parseInt(b.charge);
            if (b.charge == "-")
                bc = 0;
            if (isNaN(ac) && isNaN(bc))
                return 0;
            if (isNaN(ac))
                return -1;
            if (isNaN(bc))
                return 1;
            return bc - ac;
        });

        value = MergeElectrics(this.engines.GetElectrics(), value);
        value = MergeElectrics(value, this.weapons.GetElectrics());

        //Add + symbols
        for (let eq of value.equipment) {
            let chg = parseInt(eq.charge);
            if (!isNaN(chg) && chg > 0) {
                eq.charge = "+" + eq.charge;
            }
        }

        return value;
    }
}