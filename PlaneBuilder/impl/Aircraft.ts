/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
/// <reference path="./EngineList.ts"/>
/// <reference path="./Era.ts" />
/// <reference path="./Cockpits.ts" />
/// <reference path="./Passengers.ts" />
/// <reference path="./Engines.ts" />
/// <reference path="./Propeller.ts" />
/// <reference path="./Frames.ts" />
/// <reference path="./Wings.ts" />
/// <reference path="./Stabilizers.ts" />
/// <reference path="./ControlSurfaces.ts" />
/// <reference path="./Reinforcement.ts" />
/// <reference path="./Fuel.ts" />
/// <reference path="./Munitions.ts" />
/// <reference path="./CargoAndPassengers.ts" />
/// <reference path="./LandingGear.ts" />
/// <reference path="./Accessories.ts" />
/// <reference path="./Optimization.ts" />
/// <reference path="./Weapons.ts" />
/// <reference path="./Used.ts" />

class Aircraft {
    private use_storage: boolean = false;
    private version: string;
    public name: string;
    private stats: Stats;
    private updated_stats: boolean;
    private freeze_display: boolean;
    private DisplayCallback: () => void;
    private era: Era;
    private cockpits: Cockpits;
    private passengers: Passengers;
    private engines: Engines;
    private propeller: Propeller;
    private frames: Frames;
    private wings: Wings;
    private stabilizers: Stabilizers;
    private controlsurfaces: ControlSurfaces;
    private reinforcements: Reinforcement;
    private fuel: Fuel;
    private munitions: Munitions;
    private cargo: CargoAndPassengers;
    private gear: LandingGear;
    private accessories: Accessories;
    private optimization: Optimization;
    private weapons: Weapons;
    private used: Used;
    // private alter: AlterStats;

    private reset_json = String.raw`{"version":"10.8","name":"Basic Biplane","era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Rhona Motorbau Z11 80hp","overspeed":18,"altitude":29,"torque":2,"rumble":0,"oiltank":true,"pulsejet":false,"liftbleed":0,"wetmass":0,"mass":4,"drag":8,"control":0,"cost":4,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":-1,"power":8,"fuelconsumption":10,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0},"selected_inputs":{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.890000343322754,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},"cooling_count":0,"radiator_index":-1,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":2,"is_generator":false,"has_alternator":false,"intake_fan":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":2,"use_variable":false},"frames":{"sections":[{"frame":0,"skin":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"skin":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"wings":{"wing_list":[{"surface":0,"area":8,"span":8,"dihedral":0,"anhedral":0,"deck":0},{"surface":0,"area":8,"span":8,"dihedral":0,"anhedral":0,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[1,0,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":1,"wing_blades":false},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"info_sel":[false,false],"visi_sel":[false,false,false],"clim_sel":[false,false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":0,"w_count":1,"repeating":false}],"ammo":1,"action":0,"projectile":0}],"brace_count":0},"used":{"enabled":false,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0}}`;

    constructor(js: JSON, weapon_json: JSON, storage: boolean) {
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"]);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers(js["cargo"]);
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(weapon_json);
        this.used = new Used();
        // this.alter = new AlterStats();

        this.era.SetCalculateStats(() => { this.CalculateStats(); });
        this.cockpits.SetCalculateStats(() => { this.CalculateStats(); });
        this.passengers.SetCalculateStats(() => { this.CalculateStats(); });
        this.engines.SetCalculateStats(() => { this.CalculateStats(); });
        this.propeller.SetCalculateStats(() => { this.CalculateStats(); });
        this.frames.SetCalculateStats(() => { this.CalculateStats(); });
        this.wings.SetCalculateStats(() => { this.CalculateStats(); });
        this.stabilizers.SetCalculateStats(() => { this.CalculateStats(); });
        this.controlsurfaces.SetCalculateStats(() => { this.CalculateStats(); });
        this.reinforcements.SetCalculateStats(() => { this.CalculateStats(); });
        this.fuel.SetCalculateStats(() => { this.CalculateStats(); });
        this.munitions.SetCalculateStats(() => { this.CalculateStats(); });
        this.cargo.SetCalculateStats(() => { this.CalculateStats(); });
        this.gear.SetCalculateStats(() => { this.CalculateStats(); });
        this.accessories.SetCalculateStats(() => { this.CalculateStats(); });
        this.optimization.SetCalculateStats(() => { this.CalculateStats(); });
        this.weapons.SetCalculateStats(() => { this.CalculateStats(); });
        this.used.SetCalculateStats(() => { this.CalculateStats(); });
        // this.alter.SetCalculateStats(() => { this.CalculateStats(); });

        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);

        this.use_storage = storage;
        this.updated_stats = false;
        this.freeze_display = false;
        this.Reset();
    }

    public toJSON() {
        return {
            version: this.version,
            name: this.name,
            era: this.era.toJSON(),
            cockpits: this.cockpits.toJSON(),
            passengers: this.passengers.toJSON(),
            engines: this.engines.toJSON(),
            propeller: this.propeller.toJSON(),
            frames: this.frames.toJSON(),
            wings: this.wings.toJSON(),
            stabilizers: this.stabilizers.toJSON(),
            controlsurfaces: this.controlsurfaces.toJSON(),
            reinforcements: this.reinforcements.toJSON(),
            fuel: this.fuel.toJSON(),
            munitions: this.munitions.toJSON(),
            cargo: this.cargo.toJSON(),
            gear: this.gear.toJSON(),
            accessories: this.accessories.toJSON(),
            optimization: this.optimization.toJSON(),
            weapons: this.weapons.toJSON(),
            used: this.used.toJSON(),
        };
    }

    public fromJSON(js: JSON, disp: boolean = true) {
        this.freeze_display = true;
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
        var json_version = parseFloat(js["version"]);
        this.name = js["name"];
        this.era.fromJSON(js["era"], json_version);
        this.cockpits.fromJSON(js["cockpits"], json_version);
        this.passengers.fromJSON(js["passengers"], json_version);
        this.engines.fromJSON(js["engines"], json_version);
        this.propeller.fromJSON(js["propeller"], json_version);
        this.frames.fromJSON(js["frames"], json_version);
        this.wings.fromJSON(js["wings"], json_version);
        this.stabilizers.fromJSON(js["stabilizers"], json_version);
        this.controlsurfaces.fromJSON(js["controlsurfaces"], json_version);
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
        this.freeze_display = false;
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
        this.wings.serialize(s);
        this.stabilizers.serialize(s);
        this.controlsurfaces.serialize(s);
        this.reinforcements.serialize(s);
        this.fuel.serialize(s);
        this.munitions.serialize(s);
        this.cargo.serialize(s);
        this.gear.serialize(s);
        this.accessories.serialize(s);
        this.optimization.serialize(s);
        this.weapons.serialize(s);
        this.used.serialize(s);
    }

    public deserialize(d: Deserialize) {
        this.freeze_display = true;
        d.version = parseFloat(d.GetString());
        console.log(d.version);
        this.name = d.GetString();
        this.era.deserialize(d);
        this.cockpits.deserialize(d);
        this.passengers.deserialize(d);
        this.engines.deserialize(d);
        this.propeller.deserialize(d);
        this.frames.deserialize(d);
        this.wings.deserialize(d);
        this.stabilizers.deserialize(d);
        this.controlsurfaces.deserialize(d);
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
        this.freeze_display = false;
    }

    public SetDisplayCallback(callback: () => void) {
        this.DisplayCallback = callback;
    }

    public CalculateStats() {
        this.updated_stats = false;
        var stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());

        this.engines.SetTailMods(this.frames.GetFarmanOrBoom(), this.wings.GetSwept() && this.stabilizers.GetVOutboard());
        this.engines.SetMetalArea(this.wings.GetMetalArea());
        this.engines.HaveParasol(this.wings.GetParasol());
        stats = stats.Add(this.engines.PartStats());

        this.propeller.SetHavePropeller(this.engines.GetHavePropeller());
        stats = stats.Add(this.propeller.PartStats());

        //Fuel goes here, because it makes sections.
        stats = stats.Add(this.fuel.PartStats());
        //Munitions goes here, because it makes sections.
        stats = stats.Add(this.munitions.PartStats());
        //Weapons go here, because they make sections.
        this.weapons.cockpit_count = this.cockpits.GetNumberOfCockpits();
        this.weapons.SetTractorInfo(this.engines.GetTractor());
        this.weapons.SetPusherInfo(this.engines.GetPusher());
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        this.weapons.SetHavePropeller(this.engines.GetHavePropeller());
        stats = stats.Add(this.weapons.PartStats());
        //Cargo makes sections
        stats = stats.Add(this.cargo.PartStats());

        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.frames.SetIsTandem(this.wings.GetTandem());
        stats = stats.Add(this.frames.PartStats());

        this.wings.SetNumFrames(this.frames.GetNumFrames());
        stats = stats.Add(this.wings.PartStats());

        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetWingArea(stats.wingarea);
        this.stabilizers.wing_drag = this.wings.GetWingDrag();
        stats = stats.Add(this.stabilizers.PartStats());

        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        stats = stats.Add(this.controlsurfaces.PartStats());

        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        this.reinforcements.SetCantLift(this.era.GetCantLift());
        this.reinforcements.SetHasWing(this.wings.GetArea() > 0);
        stats = stats.Add(this.reinforcements.PartStats());

        this.accessories.SetAcftPower(stats.power);
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        this.accessories.SetSkinArmor(this.frames.GetArmor());
        this.accessories.SetVitalParts(this.VitalComponentList().length);
        stats = stats.Add(this.accessories.PartStats());

        //Because treated paper brings mass down.
        stats.mass = Math.max(1, stats.mass);

        //Gear go last, because they need total mass.
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), this.wings.GetWingHeight());
        stats = stats.Add(this.gear.PartStats());

        //Add toughness here so it gets optimized properly.
        stats.toughness += Math.floor(1.0e-6 + stats.structure / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());

        //Has flight stress from open cockpit + tractor rotary.
        if (this.cockpits.HasOpen() && this.engines.HasTractorRotary())
            stats.flightstress++;

        // stats = stats.Add(this.alter.PartStats());

        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();

        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;

            var derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);

            //Used: burnt_out
            stats.reliability -= this.used.burnt_out;

            //Used: sticky_guns  (Just needs to happen before display)
            this.weapons.SetStickyGuns(this.used.sticky_guns);

            //Update Part Local stuff
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.FlightStress, this.stats.visibility, this.stats.crashsafety);
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftStructure(stats.structure, this.era.GetMaxBomb());

            //Airplanes always cost 1
            this.stats.cost = Math.max(1, this.stats.cost);
            //Always have at least 1 liftbleed
            this.stats.liftbleed = Math.max(1, this.stats.liftbleed);

            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: "Rumble",
                    warning: "Rumble requires a minimum structure of Rumble*10 to fly."
                });
            }

            if (this.DisplayCallback && !this.freeze_display)
                this.DisplayCallback();

            if (this.use_storage)
                window.localStorage.aircraft = JSON.stringify(this);
        }
    }

    public GetDerivedStats() {
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
        var MaxSpeedEmpty = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9)));
        var MaxSpeedFull = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9)));
        var MaxSpeedwBombs = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9)));

        //Used: Ragged
        MaxSpeedEmpty = Math.floor(1.0e-6 + MaxSpeedEmpty * Math.pow(0.9, this.used.ragged));
        MaxSpeedFull = Math.floor(1.0e-6 + MaxSpeedFull * Math.pow(0.9, this.used.ragged));
        MaxSpeedwBombs = Math.floor(1.0e-6 + MaxSpeedwBombs * Math.pow(0.9, this.used.ragged));

        var StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea)));
        var StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea)));
        var StallSpeedFullwBombs = Math.max(Math.floor(1.0e-6 + this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea)));

        //Used: Hefty
        StallSpeedEmpty = Math.floor(1.0e-6 + StallSpeedEmpty * Math.pow(1.2, this.used.hefty));
        StallSpeedFull = Math.floor(1.0e-6 + StallSpeedFull * Math.pow(1.2, this.used.hefty));
        StallSpeedFullwBombs = Math.floor(1.0e-6 + StallSpeedFullwBombs * Math.pow(1.2, this.used.hefty));

        var Overspeed = this.engines.GetOverspeed();
        var BoostEmpty = Math.floor(1.0e-6 + this.stats.power / DryMP);
        var BoostFull = Math.floor(1.0e-6 + this.stats.power / WetMP);
        var BoostFullwBombs = Math.floor(1.0e-6 + this.stats.power / WetMPwBombs);
        var Dropoff = Math.floor(1.0e-6 + this.stats.pitchboost * MaxSpeedEmpty);

        var Stability = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stability += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stability -= 2;

        var HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stability > 10 || Stability < -10) {
            HandlingEmpty = -1 / 0;
            if (this.stats.warnings.findIndex((value) => { return value.source == "Stability" }) == -1) {
                this.stats.warnings.push({ source: "Stability", warning: "Stability must be between -10 and +10 to be flyable by a human." });
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
        HandlingEmpty = Math.floor(1.0e-6 + HandlingEmpty * Math.pow(0.95, this.used.sluggish));
        HandlingFull = Math.floor(1.0e-6 + HandlingFull * Math.pow(0.95, this.used.sluggish));
        HandlingFullwBombs = Math.floor(1.0e-6 + HandlingFullwBombs * Math.pow(0.95, this.used.sluggish));

        var ElevatorsEmpty = Math.max(1, Math.floor(1.0e-6 + HandlingEmpty / 10));
        var ElevatorsFull = Math.max(1, Math.floor(1.0e-6 + HandlingFull / 10));
        var ElevatorsFullwBombs = Math.max(1, Math.floor(1.0e-6 + HandlingFullwBombs / 10));

        var MaxStrain = 1 / 0;
        if (this.wings.GetWingList().length > 0 || this.wings.GetMiniWingList().length > 0) {
            MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        } else {
            MaxStrain = Math.min(this.stats.structure + this.stats.maxstrain, this.stats.structure);
        }
        //And store the results so they can be displayed
        this.optimization.final_ms = Math.floor(1.0e-6 + this.optimization.GetMaxStrain() * 1.5 * MaxStrain / 10);
        MaxStrain += this.optimization.final_ms;
        //Used: Fragile
        MaxStrain = Math.floor(1.0e-6 + MaxStrain * Math.pow(0.8, this.used.fragile));
        if (MaxStrain < 10 && this.stats.warnings.findIndex((value) => { return value.source == "Max Strain" }) == -1) {
            this.stats.warnings.push({ source: "Max Strain", warning: "A Max Strain of less than 10 means the plane falls apart on the ground." });
        }

        var Toughness = this.stats.toughness;
        //Used: Weak
        Toughness = Toughness * Math.pow(0.5, this.used.weak);
        var Structure = this.stats.structure;
        var EnergyLoss = Math.ceil(-1.0e-6 + DPEmpty / this.propeller.GetEnergy());
        var EnergyLosswBombs = EnergyLoss + 1;
        EnergyLoss = Math.min(EnergyLoss, 10);
        EnergyLosswBombs = Math.min(EnergyLosswBombs, 10);
        var TurnBleed = Math.ceil(-1.0e-6 + Math.floor(1.0e-6 + (StallSpeedEmpty + StallSpeedFull) / 2) / this.propeller.GetTurn());
        var TurnBleedwBombs = TurnBleed + 1;
        TurnBleed = Math.max(TurnBleed, 1);
        TurnBleedwBombs = Math.max(TurnBleedwBombs, 1);
        var FuelUses = this.stats.fuel / this.stats.fuelconsumption;
        //Used: Leaky
        FuelUses = FuelUses * Math.pow(0.8, this.used.leaky);
        var CruiseRange = FuelUses / 3 * (MaxSpeedFull + MaxSpeedEmpty) / 2 * 10 * 0.7;
        var CruiseRangewBombs = FuelUses / 3 * MaxSpeedwBombs * 10 * 0.7;

        var FlightStress = 1 + this.stats.flightstress;
        if (Stability > 3 || Stability < -3)
            FlightStress++;
        //Flight Stress from Rumble.
        if (this.engines.GetMaxRumble() > 0) {
            FlightStress += Math.max(1, this.engines.GetMaxRumble());
            FlightStress = Math.floor(1.0e-6 + FlightStress);
        }
        FlightStress += Math.min(this.accessories.GetMaxMassStress(), Math.floor(1.0e-6 + DryMP / 10));
        FlightStress = Math.min(this.accessories.GetMaxTotalStress(), FlightStress);

        var RateOfClimbFull = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMP) * (23.0 / this.stats.pitchspeed) / DPFull));
        var RateOfClimbEmpty = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / DryMP) * (23.0 / this.stats.pitchspeed) / DPEmpty));
        var RateOfClimbwBombs = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMPwBombs) * (23.0 / this.stats.pitchspeed) / DPwBombs));

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
            ElevatorsEmpty: ElevatorsEmpty,
            ElevatorsFull: ElevatorsFull,
            ElevatorsFullwBombs: ElevatorsFullwBombs,
            MaxStrain: MaxStrain,
            Toughness: Toughness,
            Structure: Structure,
            EnergyLoss: EnergyLoss,
            EnergyLosswBombs: EnergyLosswBombs,
            TurnBleed: TurnBleed,
            TurnBleedwBombs: TurnBleedwBombs,
            FuelUses: FuelUses,
            CruiseRange: CruiseRange,
            CruiseRangewBombs: CruiseRangewBombs,
            FlightStress: FlightStress,
            RateOfClimbFull: RateOfClimbFull,
            RateOfClimbEmpty: RateOfClimbEmpty,
            RateOfClimbwBombs: RateOfClimbwBombs,
        }
    }

    public VitalComponentList(): string[] {
        var derived = this.GetDerivedStats();
        var vital = [];
        vital.push("Controls");
        for (let i = 0; i < this.GetCockpits().GetNumberOfCockpits(); i++) {
            vital.push("Aircrew #" + (i + 1).toString());
        }
        if (derived.FuelUses > 0) {
            vital.push("Fuel Tanks");
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfEngines(); i++) {
            if (this.GetEngines().GetEngine(i).GetUsePushPull()) {
                vital.push("Engine #" + (i + 1).toString() + " Pusher");
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push("Oil Tank #" + (i + 1).toString() + " Pusher");
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push("Oil Cooler #" + (i + 1).toString() + " Pusher");
                }
                vital.push("Engine #" + (i + 1).toString() + " Puller");
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push("Oil Tank #" + (i + 1).toString() + " Puller");
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push("Oil Cooler #" + (i + 1).toString() + " Puller");
                }
            }
            else {
                vital.push("Engine #" + (i + 1).toString());
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push("Oil Tank #" + (i + 1).toString());
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push("Oil Cooler #" + (i + 1).toString());
                }
            }
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfRadiators(); i++) {
            vital.push("Radiator #" + (i + 1).toString());
        }
        if (this.IsElectrics()) {
            vital.push("Electrics");
        }
        for (let i = 0; i < this.GetWeapons().GetWeaponSets().length; i++) {
            vital.push("Weapon Set #" + (i + 1).toString());
        }
        if (this.GetLandingGear().IsVital()) {
            vital.push("Landing Gear");
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

    public GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }

    public GetGearName() {
        return this.gear.GetGearName();
    }

    public GetIsFlammable() {
        return this.frames.GetIsFlammable() || this.wings.GetIsFlammable();
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
    public GetWings(): Wings {
        return this.wings;
    }
    public GetStabilizers(): Stabilizers {
        return this.stabilizers;
    }
    public GetControlSurfaces(): ControlSurfaces {
        return this.controlsurfaces;
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
        return this.engines.IsElectrics() || this.accessories.IsElectrics();
    }
    public GetUsed() {
        return this.used;
    }
    // public GetAlter() {
    //     return this.alter;
    // }
}