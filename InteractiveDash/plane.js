define(['ko', 'engine', 'weapon'], function(ko, engineConstructor, weaponConstructor) {

	return function (planeState) {
		var that = {};

		that.altitude = ko.observable(planeState ? planeState.altitude : 0);
		that.airspeed = ko.observable(planeState ? planeState.airspeed : 0);
		that.fuel = ko.observable(planeState ? planeState.fuel : 0);
		that.dropoff = ko.observable(planeState ? planeState.dropoff : 0);
		that.visibility = ko.observable(planeState ? planeState.visibility : 0);
		that.energy_loss = ko.observable(planeState ? planeState.energy_loss : 0);
		that.turn_bleed = ko.observable(planeState ? planeState.turn_bleed : 0);
		that.stability = ko.observable(planeState ? planeState.stability : 0);
		that.stress = ko.observable(planeState ? planeState.stress : 0);
		that.plane_escape = ko.observable(planeState ? planeState.plane_escape : 0); //'escape' is a javascript reserved word, so we can't call this just 'escape'
		that.crash = ko.observable(planeState ? planeState.crash : 0);
		that.max_toughness = ko.observable(planeState ? planeState.max_toughness : 0);
		that.current_toughness = ko.observable(planeState ? planeState.current_toughness : 0);
		that.max_strain = ko.observable(planeState ? planeState.max_strain : 0);
		that.current_strain = ko.observable(planeState ? planeState.current_strain : 0);
		that.g_force = ko.observable(planeState ? planeState.g_force : 0);
		that.kills = ko.observable(planeState ? planeState.kills : 0);

		that.full_load_boost = ko.observable(planeState ? planeState.full_load_boost : 0);
		that.full_load_handling = ko.observable(planeState ? planeState.full_load_handling : 0);
		that.full_load_climb = ko.observable(planeState ? planeState.full_load_climb : 0);
		that.full_load_stall = ko.observable(planeState ? planeState.full_load_stall : 0);
		that.full_load_speed = ko.observable(planeState ? planeState.full_load_speed : 0);

		that.half_fuel_bombs_boost = ko.observable(planeState ? planeState.half_fuel_bombs_boost : 0);
		that.half_fuel_bombs_handling = ko.observable(planeState ? planeState.half_fuel_bombs_handling : 0);
		that.half_fuel_bombs_climb = ko.observable(planeState ? planeState.half_fuel_bombs_climb : 0);
		that.half_fuel_bombs_stall = ko.observable(planeState ? planeState.half_fuel_bombs_stall : 0);
		that.half_fuel_bombs_speed = ko.observable(planeState ? planeState.half_fuel_bombs_speed : 0);

		that.full_fuel_no_bombs_boost = ko.observable(planeState ? planeState.full_fuel_no_bombs_boost : 0);
		that.full_fuel_no_bombs_handling = ko.observable(planeState ? planeState.full_fuel_no_bombs_handling : 0);
		that.full_fuel_no_bombs_climb = ko.observable(planeState ? planeState.full_fuel_no_bombs_climb : 0);
		that.full_fuel_no_bombs_stall = ko.observable(planeState ? planeState.full_fuel_no_bombs_stall : 0);
		that.full_fuel_no_bombs_speed = ko.observable(planeState ? planeState.full_fuel_no_bombs_speed : 0);

		that.half_fuel_no_bombs_boost = ko.observable(planeState ? planeState.half_fuel_no_bombs_boost : 0);
		that.half_fuel_no_bombs_handling = ko.observable(planeState ? planeState.half_fuel_no_bombs_handling : 0);
		that.half_fuel_no_bombs_climb = ko.observable(planeState ? planeState.half_fuel_no_bombs_climb : 0);
		that.half_fuel_no_bombs_stall = ko.observable(planeState ? planeState.half_fuel_no_bombs_stall : 0);
		that.half_fuel_no_bombs_speed = ko.observable(planeState ? planeState.half_fuel_no_bombs_speed : 0);

		that.empty_boost = ko.observable(planeState ? planeState.empty_boost : 0);
		that.empty_handling = ko.observable(planeState ? planeState.empty_handling : 0);
		that.empty_climb = ko.observable(planeState ? planeState.empty_climb : 0);
		that.empty_stall = ko.observable(planeState ? planeState.empty_stall : 0);
		that.empty_speed = ko.observable(planeState ? planeState.empty_speed : 0);

		that.vital_part_1 = ko.observable(planeState ? planeState.vital_part_1 : 0);
		that.vital_part_2 = ko.observable(planeState ? planeState.vital_part_2 : 0);
		that.vital_part_3 = ko.observable(planeState ? planeState.vital_part_3 : 0);
		that.vital_part_4 = ko.observable(planeState ? planeState.vital_part_4 : 0);
		that.vital_part_5 = ko.observable(planeState ? planeState.vital_part_5 : 0);
		that.vital_part_6 = ko.observable(planeState ? planeState.vital_part_6 : 0);
		that.vital_part_7 = ko.observable(planeState ? planeState.vital_part_7 : 0);
		that.vital_part_8 = ko.observable(planeState ? planeState.vital_part_8 : 0);
		that.vital_part_9 = ko.observable(planeState ? planeState.vital_part_9 : 0);
		that.vital_part_10 = ko.observable(planeState ? planeState.vital_part_10 : 0);

		that.armor = ko.observable(planeState ? planeState.armor : 0);
		that.max_bomb_load = ko.observable(planeState ? planeState.max_bomb_load : 0);

		that.ordinance_1 = ko.observable(planeState ? planeState.ordinance_1 : 0);
		that.ordinance_2 = ko.observable(planeState ? planeState.ordinance_2 : 0);
		that.ordinance_3 = ko.observable(planeState ? planeState.ordinance_3 : 0);
		that.ordinance_4 = ko.observable(planeState ? planeState.ordinance_4 : 0);

		that.notes = ko.observable(planeState ? planeState.notes : 0);

		// tracks what load level is currently selected
		that.full_load_selected = ko.observable(planeState ? planeState.full_load_selected : false);
		that.half_fuel_bombs_selected =  ko.observable(planeState ? planeState.half_fuel_bombs_selected : false);
		that.full_fuel_no_bombs_selected =  ko.observable(planeState ? planeState.full_fuel_no_bombs_selected : true);
		that.half_fuel_no_bombs_selected =  ko.observable(planeState ? planeState.half_fuel_no_bombs_selected : false);
		that.empty_selected =  ko.observable(planeState ? planeState.empty_selected : false);


		that.engines = ko.observableArray();
		if (planeState && planeState.engines) {
			planeState.engines.forEach((engineState) => { that.engines.push(engineConstructor(JSON.parse(engineState))); });
		}

		that.weapons = ko.observableArray();
		if (planeState && planeState.weapons) {
			planeState.weapons.forEach((weaponState) => { that.weapons.push(weaponConstructor(JSON.parse(weaponState))); });
		}

		const plane_loads = [that.full_load_selected, that.half_fuel_bombs_selected, that.full_fuel_no_bombs_selected, that.half_fuel_no_bombs_selected, that.empty_selected];

		var toJSON = function() {

			var planeState = {
				"altitude": that.altitude(),
				"airspeed": that.airspeed(),
				"fuel": that.fuel(),
				"dropoff": that.dropoff(),
				"visibility": that.visibility(),
				"energy_loss": that.energy_loss(),
				"turn_bleed": that.turn_bleed(),
				"stability": that.stability(),
				"stress": that.stress(),
				"plane_escape": that.plane_escape(),
				"crash": that.crash(),
				"max_toughness": that.max_toughness(),
				"current_toughness": that.current_toughness(),
				"max_strain": that.max_strain(),
				"current_strain": that.current_strain(),
				"g_force": that.g_force(),
				"kills": that.kills(),
				"full_load_boost": that.full_load_boost(),
				"full_load_handling": that.full_load_handling(),
				"full_load_climb": that.full_load_climb(),
				"full_load_stall": that.full_load_stall(),
				"full_load_speed": that.full_load_speed(),
				"half_fuel_bombs_boost": that.half_fuel_bombs_boost(),
				"half_fuel_bombs_handling": that.half_fuel_bombs_handling(),
				"half_fuel_bombs_climb": that.half_fuel_bombs_climb(),
				"half_fuel_bombs_stall": that.half_fuel_bombs_stall(),
				"half_fuel_bombs_speed": that.half_fuel_bombs_speed(),
				"full_fuel_no_bombs_boost": that.full_fuel_no_bombs_boost(),
				"full_fuel_no_bombs_handling": that.full_fuel_no_bombs_handling(),
				"full_fuel_no_bombs_climb": that.full_fuel_no_bombs_climb(),
				"full_fuel_no_bombs_stall": that.full_fuel_no_bombs_stall(),
				"full_fuel_no_bombs_speed": that.full_fuel_no_bombs_speed(),
				"half_fuel_no_bombs_boost": that.half_fuel_no_bombs_boost(),
				"half_fuel_no_bombs_handling": that.half_fuel_no_bombs_handling(),
				"half_fuel_no_bombs_climb": that.half_fuel_no_bombs_climb(),
				"half_fuel_no_bombs_stall": that.half_fuel_no_bombs_stall(),
				"half_fuel_no_bombs_speed": that.half_fuel_no_bombs_speed(),
				"empty_boost": that.empty_boost(),
				"empty_handling": that.empty_handling(),
				"empty_climb": that.empty_climb(),
				"empty_stall": that.empty_stall(),
				"empty_speed": that.empty_speed(),
				"vital_part_1": that.vital_part_1(),
				"vital_part_2": that.vital_part_2(),
				"vital_part_3": that.vital_part_3(),
				"vital_part_4": that.vital_part_4(),
				"vital_part_5": that.vital_part_5(),
				"vital_part_6": that.vital_part_6(),
				"vital_part_7": that.vital_part_7(),
				"vital_part_8": that.vital_part_8(),
				"vital_part_9": that.vital_part_9(),
				"vital_part_10": that.vital_part_10(),
				"armor": that.armor(),
				"max_bomb_load": that.max_bomb_load(),
				"ordinance_1": that.ordinance_1(),
				"ordinance_2": that.ordinance_2(),
				"ordinance_3": that.ordinance_3(),
				"ordinance_4": that.ordinance_4(),
				"notes": that.notes(),
				"full_load_selected": that.full_load_selected(),
				"half_fuel_bombs_selected": that.half_fuel_bombs_selected(),
				"full_fuel_no_bombs_selected": that.full_fuel_no_bombs_selected(),
				"half_fuel_no_bombs_selected": that.half_fuel_no_bombs_selected(),
				"empty_selected": that.empty_selected(),
				"engines": [],
				"weapons": []
			};

			that.engines().forEach((engine) => { planeState.engines.push(engine.toJSON()) });
			that.weapons().forEach((weapon) => { planeState.weapons.push(weapon.toJSON()) });

			return JSON.stringify(planeState);
		};

		that.addEngine = function() {
			that.engines.push(engineConstructor());
			that.persistState();
			console.log("a");
		};

		that.addWeapon = function() {
			that.weapons.push(weaponConstructor());
			that.persistState();
			console.log("a");
		};

		that.removeEngine = function(engine) {
			that.engines.remove(engine);
			that.persistState();
			console.log("a");
		};

		that.removeWeapon = function(weapon) {
			that.weapons.remove(weapon);
			that.persistState();
			console.log("a");
		};

		that.persistState = function() {
			window.localStorage.setItem("planeState", toJSON());
			return true; //tells knockout to continue processing this event
		};

		/* Event handler for when the user clicks on a plane load level */
		that.selectLoad = function(load) {
			plane_loads.forEach((item) => {item(false)}); // clear the previously selected load
			that[load + '_selected'](true);
			that.persistState();
		};

		var selectedLoad = function() {
			if (that.full_load_selected()) {
				return "full_load";
			} else if (that.half_fuel_bombs_selected()) {
				return "half_fuel_bombs";
			} else if (that.full_fuel_no_bombs_selected()) {
				return "full_fuel_no_bombs";
			} else if (that.half_fuel_no_bombs_selected()) {
				return "half_fuel_no_bombs";
			} else {
				return "empty";
			}
		};

		that.currentBoost = ko.pureComputed(function() {
			return that[selectedLoad() + "_boost"]();
		});

		that.currentHandling = ko.pureComputed(function() {
			return that[selectedLoad() + "_handling"]();
		});

		that.currentClimb = ko.pureComputed(function() {
			return that[selectedLoad() + "_climb"]();
		});

		that.currentStall = ko.pureComputed(function() {
			return that[selectedLoad() + "_stall"]();
		});

		that.currentMaxSpeed = ko.pureComputed(function() {
			return that[selectedLoad() + "_speed"]();
		});

		that.speedFactor = ko.pureComputed(function() {
			return Math.floor(that.airspeed()/10) ;
		});

		that.overstrain = ko.pureComputed(function() {
			return Math.floor(that.max_strain()/10) ;
		});

		/* Planes can have multiple engines, and each engine can have
		   a different Overspeed.  Build a comma seperated string of 
		   the overspeeds of all of the engines on this plane.
		*/
		that.overspeed = ko.pureComputed(function() {
			var text = "";

			const engines = that.engines();

			for (var i=0;i<engines.length;i++) {
				const engine = engines[i];

				if (text.length > 0) {
					text += ", ";
				}

				text += engine.overspeed();
			}

			return text;
		});

		that.selectAltitude = function(altitude) {

			if (altitude.length == 2) {
				that.altitude(parseInt(altitude) + (that.altitude() % 10));
			} else {
				that.altitude((Math.floor(that.altitude() / 10) * 10) + parseInt(altitude));
			}

			that.persistState();
		};

		that.selectAirspeed = function(airspeed) {

			if (airspeed.length == 2) {
				that.airspeed(parseInt(airspeed) + (that.airspeed() % 10));
			} else {
				that.airspeed((Math.floor(that.airspeed() / 10) * 10) + parseInt(airspeed));
			}

			that.persistState();
		};		

		/* The short hand on the altimeter is thousands of feet, 
		   a.k.a., the tens digit of the planes altitude
		*/
		that.altimeterShortHandRotation = ko.pureComputed(function() {
			return Math.floor(that.altitude()/10) * 36;
		});

		/* The short hand on the altimeter is hundreds of feet, 
		   a.k.a., the singles digit of the planes altitude
		*/
		that.altimeterLongHandRotation = ko.pureComputed(function() {
			return Math.floor(that.altitude() % 10) * 36;
		});

		/* The short hand on the airspeed dial is the tens digit 
		   of the planes airspeed
		*/
		that.airspeedShortHandRotation = ko.pureComputed(function() {
			return Math.floor(that.airspeed()/10) * 36;
		});

		/* The short hand on the airspeed dial is the singled digit 
		   of the planes airspeed
		*/
		that.airspeedLongHandRotation = ko.pureComputed(function() {
			return Math.floor(that.airspeed() % 10) * 36;
		});		

		return that;
	};
});