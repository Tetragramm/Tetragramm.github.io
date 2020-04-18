/// <reference path="./Part.ts" />
/// <reference path="./Stats.ts" />
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

class Aircraft {
    private use_storage: boolean = false;
    private version: string;
    public name: string;
    private stats: Stats;
    private updated_stats: boolean;
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

    private reset_json = String.raw`{"version":"9.4","name":"Beginner","era":{"selected":0},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false]}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Hornet R - 3 Boxer 6 - Cylinder","overspeed":26,"altitude":3,"torque":0,"rumble":0,"oiltank":false,"pulsejet":false,"spinner":false,"liftbleed":0,"wetmass":0,"mass":6,"drag":4,"control":0,"cost":6,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":8,"reliability":-1,"power":15,"fuelconsumption":14,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0},"cooling_count":8,"radiator_index":0,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":0,"is_generator":false,"has_alternator":false}],"radiators":[{"type":0,"mount":0,"coolant":0}],"is_asymmetric":false},"propeller":{"type":2,"use_variable":false},"frames":{"sections":[{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"skin":1,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false},"wings":{"wing_list":[{"surface":0,"area":5,"span":10,"dihedral":0,"anhedral":0,"deck":0},{"surface":0,"area":5,"span":10,"dihedral":0,"anhedral":0,"deck":3}],"mini_wing_list":[],"wing_stagger":5,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[3,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay1":false,"bay2":false},"cargo":{"mass":0,"pass":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"info_sel":[false,false],"visi_sel":[false,false,false],"clim_sel":[false,false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"state":"BETA3","weapon_systems":[]}}`;

    constructor(js: JSON, engine_json: JSON, weapon_json: JSON, storage: boolean) {
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js['version'];
        this.era = new Era(js["era"]);
        this.cockpits = new Cockpits(js["cockpit"]);
        this.passengers = new Passengers(js["passengers"]);
        this.engines = new Engines(js["engines"], engine_json);
        this.propeller = new Propeller(js["propellers"]);
        this.frames = new Frames(js["frames"]);
        this.wings = new Wings(js["wings"]);
        this.stabilizers = new Stabilizers(js["stabilizers"]);
        this.controlsurfaces = new ControlSurfaces(js["controls"]);
        this.reinforcements = new Reinforcement(js["reinforcement"]);
        this.fuel = new Fuel(js["fuel"]);
        this.munitions = new Munitions();
        this.cargo = new CargoAndPassengers();
        this.gear = new LandingGear(js["landing_gear"]);
        this.accessories = new Accessories(js["accessories"]);
        this.optimization = new Optimization();
        this.weapons = new Weapons(weapon_json);

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

        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);

        this.use_storage = storage;
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
        };
    }

    public fromJSON(js: JSON, disp: boolean = true) {
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
        if (this.version == js["version"]) {
            this.name = js["name"];
            this.era.fromJSON(js["era"]);
            this.cockpits.fromJSON(js["cockpits"]);
            this.passengers.fromJSON(js["passengers"]);
            this.engines.fromJSON(js["engines"]);
            this.propeller.fromJSON(js["propeller"]);
            this.frames.fromJSON(js["frames"]);
            this.wings.fromJSON(js["wings"]);
            this.stabilizers.fromJSON(js["stabilizers"]);
            this.controlsurfaces.fromJSON(js["controlsurfaces"]);
            this.reinforcements.fromJSON(js["reinforcements"]);
            this.fuel.fromJSON(js["fuel"]);
            this.munitions.fromJSON(js["munitions"]);
            this.cargo.fromJSON(js["cargo"]);
            this.gear.fromJSON(js["gear"]);
            this.accessories.fromJSON(js["accessories"]);
            this.optimization.fromJSON(js["optimization"]);
            this.weapons.fromJSON(js["weapons"]);
            this.CalculateStats();
            return true;
        }
        return false;
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
        var tractor = this.engines.GetTractor();
        this.weapons.has_tractor = tractor.have;
        this.weapons.tractor_spinner_count = tractor.spin_count;
        var pusher = this.engines.GetPusher();
        this.weapons.has_pusher = pusher.have;
        this.weapons.pusher_spinner_count = pusher.spin_count;
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        stats = stats.Add(this.weapons.PartStats());

        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        stats = stats.Add(this.frames.PartStats());

        this.wings.SetNumFrames(this.frames.GetNumFrames());
        stats = stats.Add(this.wings.PartStats());

        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetWingArea(stats.wingarea);

        stats = stats.Add(this.stabilizers.PartStats());

        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        stats = stats.Add(this.controlsurfaces.PartStats());

        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        stats = stats.Add(this.reinforcements.PartStats());

        this.cargo.SetSeats(this.passengers.GetBeds() + this.passengers.GetSeats());
        stats = stats.Add(this.cargo.PartStats());

        this.accessories.SetAcftPower(stats.power);
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        stats = stats.Add(this.accessories.PartStats());

        //Gear go last, because they need total mass.
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), this.wings.GetWingHeight());
        stats = stats.Add(this.gear.PartStats());

        stats.toughness += Math.floor(Math.max(0, (stats.structure - stats.maxstrain) / 2) + stats.maxstrain / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();

        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;

            var derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);

            //Update Part Local stuff
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.FlightStress, this.stats.visibility);
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftStructure(stats.structure);

            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: "Rumble",
                    warning: "Rumble requires a minimum structure of Rumble*10 to fly."
                });
            }

            if (this.DisplayCallback)
                this.DisplayCallback();

            if (this.use_storage)
                window.localStorage.aircraft = JSON.stringify(this);
        }
    }

    public GetDerivedStats() {
        var DryMP = Math.floor(this.stats.mass / 5);
        DryMP = Math.max(DryMP, 1);
        var WetMP = Math.floor((this.stats.mass + this.stats.wetmass) / 5);
        WetMP = Math.max(WetMP, 1);
        var WetMPwBombs = Math.floor((this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        WetMPwBombs = Math.max(WetMPwBombs, 1);
        // var span = this.wings.GetSpan();
        // var DPEmpty = Math.floor((this.stats.drag + DryMP * DryMP / (span * span)) / 5);
        var DPEmpty = Math.floor((this.stats.drag + DryMP) / 5);
        DPEmpty = Math.max(DPEmpty, 1);
        var DPFull = Math.floor((this.stats.drag + WetMP) / 5);
        DPFull = Math.max(DPFull, 1);
        DPFull = DPEmpty; //Based on advice from Discord.
        var DPwBombs = Math.floor((this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        DPwBombs = Math.max(DPwBombs, 1);
        var MaxSpeedEmpty = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9)));
        var MaxSpeedFull = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9)));
        var MaxSpeedwBombs = this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9)));
        var StallSpeedEmpty = Math.floor(this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea));
        var StallSpeedFull = Math.floor(this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea));
        var StallSpeedFullwBombs = Math.floor(this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea));
        var Overspeed = this.engines.GetOverspeed();
        var BoostEmpty = Math.floor(this.stats.power / DryMP);
        var BoostFull = Math.floor(this.stats.power / WetMP);
        var BoostFullwBombs = Math.floor(this.stats.power / WetMPwBombs);
        var Dropoff = Math.floor(this.stats.pitchboost * MaxSpeedEmpty);

        var Stabiilty = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stabiilty += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stabiilty -= 2;

        var HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stabiilty > 10)
            HandlingEmpty = -99999;
        else if (Stabiilty == 10)
            HandlingEmpty -= 4;
        else if (Stabiilty > 6)
            HandlingEmpty -= 3;
        else if (Stabiilty > 3)
            HandlingEmpty -= 2;
        else if (Stabiilty > 0)
            HandlingEmpty -= 1;
        else if (Stabiilty == 0)
            HandlingEmpty += 0;
        else if (Stabiilty > -4)
            HandlingEmpty += 1;
        else if (Stabiilty > -7)
            HandlingEmpty += 2;
        else if (Stabiilty > -10)
            HandlingEmpty += 3;
        else if (Stabiilty == -10)
            HandlingEmpty += 4;
        else
            HandlingEmpty = -99999;

        var HandlingFull = HandlingEmpty + DryMP - WetMP;
        var HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;

        var ElevatorsEmpty = Math.max(1, Math.floor(HandlingEmpty / 10));
        var ElevatorsFull = Math.max(1, Math.floor(HandlingFull / 10));
        var ElevatorsFullwBombs = Math.max(1, Math.floor(HandlingFullwBombs / 10));

        var MaxStrain = 1 / 0;
        if (this.wings.GetWingList().length > 0 || this.wings.GetMiniWingList().length > 0)
            MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);

        var Toughness = this.stats.toughness;
        var Structure = this.stats.structure;
        var EnergyLoss = Math.ceil(DPEmpty / 6);
        var EnergyLosswBombs = EnergyLoss + 1;
        var TurnBleed = Math.ceil((StallSpeedEmpty + StallSpeedFull) / 12);
        var TurnBleedwBombs = TurnBleed + 1;
        var FuelUses = this.stats.fuel / this.stats.fuelconsumption;
        var CruiseRange = FuelUses / 3 * (MaxSpeedFull + MaxSpeedEmpty) / 2 * 10 * 0.7;
        var CruiseRangewBombs = FuelUses / 3 * MaxSpeedwBombs * 10 * 0.7;

        var FlightStress = this.stats.flightstress;
        if (Stabiilty > 3 || Stabiilty < -3)
            FlightStress++;
        FlightStress += Math.floor(DryMP / 10);

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
            Stabiilty: Stabiilty,
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
        }
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

    public GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }

    public GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }

    public GetGearName() {
        return this.gear.GetGearName();
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
}