/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; typeof current == 'object' && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/string/index.ts
// MIT License
// Copyright(c) 2017 Sven Ulrich
// https://github.com/iwt-svenulrich/typescript-string-operations
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
class string_StringFmt {
    static IsNullOrWhiteSpace(value) {
        try {
            if (value == null || value == 'undefined') {
                return true;
            }
            return value.toString().replace(/\s/g, '').length < 1;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    static Join(delimiter, ...args) {
        try {
            const firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                let tempString = string_StringFmt.Empty;
                const count = 0;
                for (let i = 0; i < firstArg.length; i++) {
                    const current = firstArg[i];
                    if (i < firstArg.length - 1) {
                        tempString += current + delimiter;
                    }
                    else {
                        tempString += current;
                    }
                }
                return tempString;
            }
            else if (typeof firstArg === 'object') {
                let tempString = string_StringFmt.Empty;
                const objectArg = firstArg;
                const keys = Object.keys(firstArg); //get all Properties of the Object as Array
                keys.forEach(element => { tempString += objectArg[element] + delimiter; });
                tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                return tempString;
            }
            const stringArray = args;
            return string_StringFmt.join(delimiter, ...stringArray);
        }
        catch (e) {
            console.log(e);
            return string_StringFmt.Empty;
        }
    }
    static Format(format, ...args) {
        try {
            if (format.match(string_StringFmt.regexNumber)) {
                return string_StringFmt.format(string_StringFmt.regexNumber, format, args);
            }
            if (format.match(string_StringFmt.regexObject)) {
                return string_StringFmt.format(string_StringFmt.regexObject, format, args, true);
            }
            return format;
        }
        catch (e) {
            console.log(e);
            return string_StringFmt.Empty;
        }
    }
    static format(regex, format, args, parseByObject = false) {
        return format.replace(regex, function (match, x) {
            const s = match.split(':');
            if (s.length > 1) {
                x = s[0].replace('{', '');
                match = s[1].replace('}', ''); //U
            }
            let arg;
            if (parseByObject) {
                arg = args[0][x];
            }
            else {
                arg = args[x];
            }
            if (arg == null || arg == undefined || match.match(/{\d+}/)) {
                return arg;
            }
            arg = string_StringFmt.parsePattern(match, arg);
            return typeof arg != 'undefined' && arg != null ? arg : string_StringFmt.Empty;
        });
    }
    static parsePattern(match, arg) {
        switch (match) {
            case 'L': {
                arg = arg.toLocaleLowerCase();
                return arg;
            }
            case 'U': {
                arg = arg.toLocaleUpperCase();
                return arg;
            }
            case 'd': {
                if (typeof (arg) === 'string') {
                    return string_StringFmt.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return string_StringFmt.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            }
            case 's': {
                if (typeof (arg) === 'string') {
                    return string_StringFmt.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return string_StringFmt.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            }
            case 'n': { //Tausender Trennzeichen
                if (typeof (arg) !== "string")
                    arg = arg.toString();
                const replacedString = arg.replace(/,/g, '.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                    break;
                }
                const numberparts = replacedString.split(/[^0-9]+/g);
                let parts = numberparts;
                if (numberparts.length > 1) {
                    parts = [string_StringFmt.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                }
                const integer = parts[0];
                const mod = integer.length % 3;
                let output = (mod > 0 ? (integer.substring(0, mod)) : string_StringFmt.Empty);
                const firstGroup = output;
                const remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + string_StringFmt.Join('.', remainingGroups);
                arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                return arg;
            }
            case 'x': {
                return this.decimalToHexString(arg);
            }
            case 'X': {
                return this.decimalToHexString(arg, true);
            }
            default: {
                break;
            }
        }
        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !string_StringFmt.IsNullOrWhiteSpace(arg)) {
            return string_StringFmt.formatNumber(arg, match);
        }
        return arg;
    }
    static decimalToHexString(value, upperCase = false) {
        const parsed = parseFloat(value);
        const hexNumber = parsed.toString(16);
        return upperCase ? hexNumber.toLocaleUpperCase() : hexNumber;
    }
    static getDisplayDateFromString(input) {
        const splitted = input.split('-');
        if (splitted.length <= 1) {
            return input;
        }
        let day = splitted[splitted.length - 1];
        const month = splitted[splitted.length - 2];
        const year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];
        return `${day}.${month}.${year}`;
    }
    static getSortableDateFromString(input) {
        const splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1) {
            return input;
        }
        const times = splitted[splitted.length - 1].split(' ');
        let time = string_StringFmt.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }
        const year = splitted[splitted.length - 1].split(' ')[0];
        const month = splitted[splitted.length - 2];
        const day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`;
        if (!string_StringFmt.IsNullOrWhiteSpace(time) && time.length > 1) {
            result += `T${time}`;
        }
        else {
            result += "T00:00:00";
        }
        return result;
    }
    static formatNumber(input, formatTemplate) {
        const count = formatTemplate.length;
        const stringValue = input.toString();
        if (count <= stringValue.length) {
            return stringValue;
        }
        let remainingCount = count - stringValue.length;
        remainingCount += 1; //Array must have an extra entry
        return new Array(remainingCount).join('0') + stringValue;
    }
    static join(delimiter, ...args) {
        let temp = string_StringFmt.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && string_StringFmt.IsNullOrWhiteSpace(args[i]))
                || (typeof args[i] != "number" && typeof args[i] != "string")) {
                continue;
            }
            const arg = "" + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (string_StringFmt.IsNullOrWhiteSpace(args[i2])) {
                    continue;
                }
                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }
        return temp;
    }
}
string_StringFmt.regexNumber = /{(\d+(:\w*)?)}/g;
string_StringFmt.regexObject = /{(\w+(:\w*)?)}/g;
string_StringFmt.Empty = '';
class StringBuilder {
    constructor(value) {
        this.Values = [];
        if (!string_StringFmt.IsNullOrWhiteSpace(value)) {
            this.Values = new Array(value);
        }
    }
    ToString() {
        return this.Values.join('');
    }
    Append(value) {
        this.Values.push(value);
    }
    AppendLine(value) {
        this.Values.push('\r\n' + value);
    }
    AppendFormat(format, ...args) {
        this.Values.push(string_StringFmt.Format(format, ...args));
    }
    AppendLineFormat(format, ...args) {
        this.Values.push("\r\n" + string_StringFmt.Format(format, ...args));
    }
    Clear() {
        this.Values = [];
    }
}

;// CONCATENATED MODULE: ./src/strings.json
const strings_namespaceObject = JSON.parse('{"languages":["en"],"en":{"Language":"English","Pioneer":"Pioneer","WWI":"WWI","Roaring 20s":"Roaring 20s","Coming Storm":"Coming Storm","WWII":"WWII","Last Hurrah":"Last Hurrah","Open":"Open","Windscreen":"Windscreen","Sealed":"Sealed","Sealed Warning":"This crewmember cannot see outside.","Narrow Canopy":"Narrow Canopy","Bubble Canopy":"Bubble Canopy","Co-Pilot Controls":"Co-Pilot Controls","Co-Pilot Warning":"Maximum stress reduction of {0}.","Bombadier Controls":"Bombadier Controls","Bombadier Controls Warning":"This seat has controls.","Escape Hatch":"Escape Hatch","Ejection Seat":"Ejection Seat","Connectivity":"Connectivity","Oxygen Mask":"Oxygen Mask","Oxygen Mask Warning":"The pilot ignores the effects of high altitude and negates up to 2 G-Penalty.","Isolated":"Isolated","Isolated Warning":"Position takes double Injury when you Go Down.","Padding":"Padding","Injury Reduction Warning":"Negates 1 Injury for this position when you Go Down","Harness":"Harness","Fast Release System":"Fast Release System","Roll Bar":"Roll Bar","Flare Slot":"Flare Slot","Flare Slot Warning":"Allows flares to be fired out of a closed cockpit without opening the cockpit.","X1 Collimated Gunsight":"X1 Collimated Gunsight","Telescopic Gunsight":"Telescopic Gunsight","Illuminated Reflex Sight":"Illuminated Reflex Sight","Gyro Gunsight":"Gyro Gunsight","X1 Collimated Gunsight Warning":"+1 to Open Fire.","Telescopic Gunsight Warning":"+2 to Open Fire if you Drew a Bead.","Illuminated Reflex Sight Warning":"+2 to Open Fire.","Gyro Gunsight Warning":"+2 to Open Fire and additional +2 if you Draw a Bead.","Bombsight":"Bombsight","Bombsight Warning 1":"Subtract ","Bombsight Warning 2":" from your Altitude when rolling for bombing.","Pulsejets":"Pulsejets","Pulsejet Boost Warning":"Pulsejets double Boost when above dropoff speed, instead of below dropoff.","Turbine":"Turbine","Turbine Boost Warning":"Turbines ignore dropoff speed, providing constant Boost at all speeds.","Rotary":"Rotary","Rotary Right Warning":"+1 to Dogfight! when turning right.","Rotary Left Warning":"+1 to Dogfight! when turning left.","Tractor":"Tractor","Center-Mounted Tractor":"Center-Mounted Tractor","Rear-Mounted Pusher":"Rear-Mounted Pusher","Center-Mounted Pusher":"Center-Mounted Pusher","Pod":"Pod","Nacelle (Inside)":"Nacelle (Inside)","Nacelle (Offset)":"Nacelle (Offset)","Channel Tractor":"Channel Tractor","Fuselage Push-Pull":"Fuselage Push-Pull","Front Intake":"Front Intake","Wing Pod":"Wing Pod","Underwing Pod":"Underwing Pod","Forward Internal":"Forward Internal","Center Internal":"Center Internal","Rear Internal":"Rear Internal","Center Pod":"Center Pod","Rear Pod":"Rear Pod","Not Allowed":"Not Allowed","Panel":"Panel","Box":"Box","Intake":"Intake","Evaporation":"Evaporation","Evaporation Warning":"Attacks with a Crit rolls of 16+ will knock out the radiator, in addition to normal effects.","Low":"Low Radiator","Low Warning":"Force Cool Down when shot.","Inline":"Inline Radiator","High":"High Radiator","High Warning":"Bonus persists for 1 Cool Down after being shot. If the plane is an open cockpit, will spray the pilot with the radiator fluid!","High Offset":"High Offset Radiator","High Offset Warning":"Bonus persists for 1 Cool Down after being shot.","Water":"Water","Salt Water":"Salt Water","Mineral Oil":"Mineral Oil","Mineral Oil Warning":"Absorbs 1 Miss to Cool Down.","Castor Oil":"Castor Oil","Castor Oil Warning":"Absorbs 1 Miss to Cool Down. +2 Stress if leaking.","Glycol":"Glycol","Freon":"Freon","Freon Warning":"Take 1 Power Reduction while RPM is below 4.","Ammonia":"Ammonia","Ammonia Warning":"Take 1 Power Reduction while RPM is below 4. Causes 2 Injury when leaking.","No Cowling":"No Cowling","Basic Cowl":"Basic Cowl","Rotary Basic Cowl":"Rotary Basic Cowl","Closed Cowl":"Closed Cowl","Adjustable Slat Cowl":"Adjustable Slat Cowl","Foil Cowl":"Airfoil Cowl","Sealed Cowl":"Sealed Cowl","Radiator Fluid":"Radiator Fluid","Radiator Fluid Warning":"Radiator Fluid is Flammable.","Manually Variable Propeller":"Manually Variable Propeller","MVP_Warning":"Allows blade pitch to be adjusted on the ground without replacing it.","High Power":"High Power","Power":"Power","Default":"Default","Speed":"Speed","High Speed":"High Speed","Automatic Pitch":"Automatic Pitch","Manually Adjustable Pitch":"Manually Adjustable Pitch","Single Rotor":"Single Rotor","Coaxial":"Coaxial","Synchropter":"Synchropter","Transverse":"Transverse","Tandem Transverse":"Tandem Transverse","Wooden Spars":"Wooden Spars","Steel Spars":"Steel Spars","Aluminum Spars":"Aluminum Spars","Wooden Ribs":"Wooden Ribs","Steel Ribs":"Steel Ribs","Aluminum Ribs":"Aluminum Ribs","Titanium":"Titanium","Living Grove":"Living Grove","Living Grove Warning":"Free Repairs for Living Grove sections.","Naked":"Naked","Cloth Canvas":"Cloth Canvas","Transparent Celluloid":"Transparent Celluloid","Treated Paper":"Treated Paper","Tense Silk":"Tense Silk","Dragon Skin":"Dragon Skin","Molded Plywood":"Molded Plywood","Clinker Build":"Clinker Build","Glass Reinforced Plastic":"Glass Reinforced Plastic","Corrugated Duralumin":"Corrugated Duralumin","Steel Sheet":"Steel Sheet","Aluminum Sheet":"Aluminum Sheet","Tailless":"Tailless","Stubby":"Stubby","Standard":"Standard","Long":"Long","Wing Deck Parasol":"Parasol","Wing Deck Shoulder":"Shoulder","Wing Deck Mid":"Mid","Wing Deck Low":"Low","Wing Deck Gear":"Gear","Tense Silk Layers":"Tense Silk Layers","Plywood":"Plywood","Corrugated Steel":"Corrugated Steel","Thin Sheet Steel":"Thin Sheet Steel","Grand Eagle Feather":"Grand Eagle Feather","Solar Fiber":"Solar Fiber","Monoplane":"Monoplane","Tandem":"Tandem","Extreme Positive":"Extreme Positive","Positive":"Positive","Unstaggered":"Unstaggered","Negative":"Negative","Extreme Negative":"Extreme Negative","Tailplane":"Tailplane","The Wings":"The Wings","Canards":"Canards","Outboard":"Outboard","V-Tail":"V-Tail","T-Tail":"T-Tail","T-Tail Warning":"In the event of a spin/stall while above stall speed and under power, you are at a Disadvantage to recover.","Tailfin":"Tailfin","The Rotors":"The Rotors","Wing Warping":"Wing Warping","Cantilever Wing Warping":"Cantilever Wing Warping","Wing Warping Warning":"Wing Warping with a Boom Tail causes a stability penalty.","Flap Ailerons":"Flap Ailerons","Wing Warping Warning 2":"Get +1 to Dogfight! at below 15 speed.","Spoilerons":"Spoilerons","Spoilerons Warning":"When you roll Dogfight!, take +1, but then reduce your speed as if your Speed Factor was doubled.","None":"None","Flap Rudder":"Flap Rudder","Flying Rudder":"Flying Rudder","Flap Elevator":"Flap Elevator","Flying Elevator":"Flying Elevator","Basic Flaps":"Basic Flaps","Advanced Flaps":"Advanced Flaps","Control Flaps":"Control Flaps","Lift Dumpers":"Lift Dumpers","Lift Dumpers Warning":"Activate for +1 to Dogfight!, then immediately induce a stall.","Fixed Slots":"Fixed Slots","Automatic Slats":"Automatic Slats","Air Brake":"Air Brake","Air Brake Warning":"When deployed, immediately bleed of speed equal to Speed Factor and gain +1 to Dogfight!.","Dive Brake":"Dive Brake","Dive Brake Warning":"When deployed, steep dives trade altitude for speed at 1-2 instead of 1-3.","Drogue Chute":"Drogue Chute","Drogue Chute Warning":"Activate once per flight to: Give +3 to Go Down or take down a close pursuer.","Wing Blades":"Wing Blades","Wing Blades Warning":"Roll Dogfight! to use. 16+, enemy takes damage as per collision, user takes 1d10. 20+, user takes no damage. When used on a PC, use Evade Danger and Collision instead.","Parallel Struts":"Parallel Struts","N-Strut":"N-Strut","V-Strut":"V-Strut","I-Strut":"I-Strut","W-Strut":"W-Strut","Single Strut":"Single Strut","Star Strut":"Star Strut","Wing Truss":"Wing Truss","Wire Root":"Wire Root","Steel Parallel Struts":"Steel Parallel Struts","Steel N-Strut":"Steel N-Strut","Steel V-Strut":"Steel V-Strut","Steel I-Strut":"Steel I-Strut","Steel W-Strut":"Steel W-Strut","Steel Single Strut":"Steel Single Strut","Steel Star Strut":"Steel Star Strut","Steel Wing Truss":"Steel Wing Truss","Steel Wire Root":"Steel Wire Root","Birch":"Birch","Duralumin":"Duralumin","Steel":"Steel","Aluminium":"Aluminium","Whalebone":"Whalebone","Self-Sealing Gas Tank":"Self-Sealing Gas Tank","Self-Sealing Gas Tank Warning":"Fuel leak penalty will apply only to the next Fuel Check.","Remote Fire Extinguisher":"Remote Fire Extinguisher","Remote Fire Extinguisher Warning":"Spend to put out a fire.","Internal Fuselage Tank":"Internal Fuselage Tank","External Wing Tank":"External Wing Tank","Internal Wing Tank":"Internal Wing Tank","Microtank":"Microtank","Tiny":"Tiny Cargo","Small":"Small Cargo","Medium":"Medium Cargo","Large":"Large Cargo","Huge":"Huge Cargo","Retractable Gear + Boat Hull":"Retractable Gear + Boat Hull","Retractable ":"Retractable ","Landing Gear":"Landing Gear","Floats":"Floats","Hybrid Floats":"Hybrid Floats","Boat Hull":"Boat Hull","Landing Skid":"Landing Skid","Landing Skid Warning":"All landings are crash landings.","Zeppelin Hook":"Zeppelin Hook","Zeppelin Hook Warning":"Allows landing inside airships or large planes.","Carrier Hook":"Carrier Hook","Carrier Hook Warning":"Allows landing on carriers.","Underwing Skid":"Underwing Skid","Windmill":"Windmill","Windmill Warning":"Generates 1 charge per 10 speed.","Ram Air Scoop":"Ram Air Scoop","Battery":"Battery","Battery Warning":"Stores 5 charges each.","Battery (High Quality)":"Battery (High Quality)","Loud Yelling":"Loud Yelling","Intercom System":"Intercom System","Radio Receiver":"Radio Receiver","Radio Transmitter":"Radio Transmitter","Radio Transceiver":"Radio Transceiver","Whalebone Radio Receiver":"Whalebone Radio Receiver","Whalebone Radio Base Station":"Whalebone Radio Base Station","Radio Receiver (High Quality)":"Radio Receiver (High Quality)","Radio Transmitter (High Quality)":"Radio Transmitter (High Quality)","Radio Transceiver (High Quality)":"Radio Transceiver (High Quality)","Whalebone Radio Base Station (High Quality)":"Whalebone Radio Base Station (High Quality)","Small Reconnaissance Camera":"Small Recon Camera","Internal Small Reconnaissance Camera":"Internal Small Recon Camera","Small Reconnaissance Camera Warning":"Can take pictures from a height of 2 AF or lower.","Medium Reconnaissance Camera":"Medium Recon Camera","Internal Medium Reconnaissance Camera":"Internal Medium Recon Camera","Medium Reconnaissance Camera Warning":"Can take pictures from a height of 4 AF or lower.","Large Reconnaissance Camera":"Large Recon Camera","Internal Large Reconnaissance Camera":"Internal Large Recon Camera","Large Reconnaissance Camera Warning":"Can take pictures from any height.","Guncam":"Guncam","Guncam Warning":"Confirms your kills for you.","Wing Cutouts":"Wing Cutouts","Hull Cutouts":"Hull Cutouts","Searchlight":"Searchlight","Electric Heating":"Electric Heating","Radiator Loop":"Radiator Loop","Basic Fan":"Basic Fan","Basic Fan Warning":"Has a Basic Fan.","Air Conditioning":"Air Conditioning","Gyroscopic":"Gyroscopic Autopilot","Gyroscopic Warning":"Gives +4 to Empty Seat rolls.","Altitude Holding":"Altitude Holding","Altitude Holding Warning":"Allows the Empty Seat rule to be ignored.","Clockwork Programmable":"Clockwork Programmable","Clockwork Programmable Warning":"Can do anything but Dogfight!, fire weapons, drop bombs, or make landings. For Himmilgard only.","Programmable":"Programmable","Programmable Warning":"Can do anything but Dogfight!, fire weapons, drop bombs, or make landings.","Rattenhirn":"Rattenhirn","Rattenhirn Warning":"Fully automated. For robo-planes.","Control Rods":"Control Rods","Hydraulic-Assisted":"Hydraulic-Assisted","Fly by Wire":"Fly by Wire","Armour":"Armour","Forward":"Forward","Rearward":"Rearward","Up":"Up","Down":"Down","Left":"Left","Right":"Right","Interruptor Gear":"Interruptor Gear","Synchronization Gear":"Synchronization Gear","Spinner Gun":"Spinner Gun","Deflector Plate":"Deflector Plate","No Interference":"No Interference","Standard Action":"Standard Action","Mechanical Action":"Mechanical Action","Gast Principle":"Gast Principle","Rotary_Gun":"Rotary","Heat Ray":"Heat Ray","Gyrojets":"Gyrojets","Pneumatic":"Pneumatic","Himmilgard":"Himmilgard","Mechanical Action Warning":"For each RPM past the first, use +1 Ammo and roll +1d10. Keep the two highest.  Advantage/Disadvantage is +/- 1d10.  Take 1 Wear per 1 rolled.  Weapon unusable if engine dies.","Heat Ray Warning":"Roll Crits +Damage done. On Crit, choose one: start a fire, destroy a radiator/oil component and push Cool Down, or injure crew. Take -2 forward to Eyeball after firing.","Gyrojets Warning":"+1 Damage and +1 AP for each Range Band (actual, not adjusted by attacks) past Knife.","Pneumatic Warning 1":"Weapon \'jams\' after rapid fire as the compressor refills.","Pneumatic Warning 2":"Locked to \'Edged\' Ammo: On Ammo Crit, attack deals double damage. All-metal planes cannot suffer Ammo Crits.","Deflection Warning":"Take {0} to attack on a deflection shot.","Deflector Plate Warning":"Deflector Plates inflict 1 Wear every time you roll a natural 5 or less on the first Crit die.","No Interference Warning":"Some guns really don\'t shoot through a propeller.  Verify with the DM before selecting this.","Helicopter Flight":"Helicopter Flight","Helicopter Flight Warning":"A helicopter must have Boost 2 to boost or take off vertically, gaining 1 altitude.","Helicopter Landing":"Helicopter Landing","Helicopter Landing Warning":"A deliberately landed helicopter travelling at 0 speed never has to roll Go Down regardless of how rough the terrain is.","Helicopter Descent":"Helicopter Descent","Helicopter Descent Warning":"A helicopter can descend up to 5 altitude bands in one maneuver without gaining speed.","Helicopter Stall":"Helicopter Stall","Helicopter Stall Warning":"Travelling faster than 37 speed immediately suffers a Retreating Wing Stall.","Rotor Span Warning":"Undersized rotors cause the engine to work harder and reduce reliability.","Autogyro Stall":"Autogyro Stall","Autogyro Stall Warning":"An Autogyro cannot stall, it automatically trades Altitude for speed 1-1.  If it runs out of altitude before regaining control, it lands gently.  If the autogyro exceeds Max Speed or sustains negative Gs it suffers a more traditional stall.","Ornithopter Stall":"Ornithopter Flight","Ornithopter Stall Warning":"In the event that the engine stops, double your Stall Speed and halve your Handling.","Ornithopter Flutterer Attack":"Flutterer Attack","Ornithopter Flutterer Attack Warning":"Take a -3 Penalty to Open Fire when you Boost.","Ornithopter Buzzer Boost":"Buzzer Boost","Ornithopter Buzzer Boost Warning":"Can boost above top speed. Every time you boost, take +2 Energy Loss forward.","Ornithopter Buzzer Stall":"Buzzer Stall","Ornithopter Buzzer Stall Warning":"Can spend 1 RPM to avoid a Stall.  Spend 1 when you drop below Stall, and 1 every turn you start below Stall.","Rumble Warning":"Rumble requires a minimum structure of Rumble*10 to fly.","Stability Warning":"Stability must be between -10 and +10 to be flyable by a human.","Max Strain Warning":"A Max Strain of less than 10 means the plane falls apart on the ground.","Vital Part Controls":"Controls","Vital Part Aircrew":"Aircrew #{0}","Vital Part Fuel Tanks":"Fuel Tanks","Vital Part Engine":"Engine #{0}","Vital Part Oil Tank":"Oil Tank #{0}","Vital Part Oil Cooler":"Oil Cooler #{0}","Vital Part Oil Pan":"Oil Pan #{0}","Vital Part Engine Pusher":"Engine #{0} Pusher","Vital Part Oil Tank Pusher":"Oil Tank #{0} Pusher","Vital Part Oil Cooler Pusher":"Oil Cooler #{0} Pusher","Vital Part Oil Pan Pusher":"Oil Pan #{0} Pusher","Vital Part Engine Puller":"Engine #{0} Puller","Vital Part Oil Tank Puller":"Oil Tank #{0} Puller","Vital Part Oil Cooler Puller":"Oil Cooler #{0} Puller","Vital Part Oil Pan Puller":"Oil Pan #{0} Puller","Vital Part Radiator":"Radiator #{0}","Vital Part Electrics":"Electrics","Vital Part Weapon Set":"Weapon Set #{0}: {1}s","Vital Part Tail Rotor":"Tail Rotor","Vital Part Landing Gear":"Landing Gear","Catalog Engine":"Engine","Catalog Oil Tank":"Oil Tank","Catalog Oil Cooler":"Oil Cooler","Catalog Oil Pan":"Oil Pan","Catalog Radiator":"Radiator"," Bomb Mass Internally.":"{0} Bomb Mass Internally. "," Bomb Mass Externally.":"{0} Bomb Mass Externally. ","Largest Internal Bomb":"Largest internal bomb is {0} Mass. "," Rocket Mass Internally.":"{0} Rocket Mass Internally. "," Rocket Mass Externally.":"{0} Rocket Mass Externally. ","Pulsejet":"Pulsejet","Starter":"Starter","Turns Right":"Turns Right","Turns Left":"Turns Left","War Emergency Power":"War Emergency Power","War Emergency Power from altitudes 0-9":"War Emergency Power from altitudes 0-9","War Emergency Power Warning":"Take double RPM to exceed Max Speed when Boosting.","Altitude Throttle":"Altitude Throttle","Altitude Throttle Warning":"This engine has the WEP upgrade at Altitudes 0-9.","Fixed":"Fixed","Flexible":"Flexible","Turret":"Turret","Turreted":"Turreted","Weapon Tag: Deflector Plate":"Deflector Plate","Weapon Tag Mechanical Action":"Mechanical Action","Weapon Tag Gast Principle":"Gast Principle","Weapon Tag Rotary":"Rotary","Weapon Tag Heat Ray":"Heat Ray","Weapon Tag Gyrojet":"Gyrojet","Weapon Tag Pneumatic":"Pneumatic","Weapon Tag Reload":"Reload {0}","Weapon Tag Rapid Fire":"Rapid Fire","Weapon Tag Shells":"Shells","Weapon Tag AP":"AP {0}","Weapon Tag Jam":"Jam {0}","Weapon Tag Awkward":"Awkward {0}","Weapon Tag Fully Accessible":"Fully Accessible","Weapon Tag Partly Accessible":"Partly Accessible","Weapon Tag Inaccessible":"Inaccessible","Weapon Tag Manual":"Manual","Stat Lift Bleed":"Lift Bleed","Stat Drag":"Drag","Stat Mass":"Mass","Stat Wet Mass":"Wet Mass","Stat Bomb Mass":"Bomb Mass","Stat Cost":"Cost","Stat Upkeep":"Upkeep","Stat Control":"Control","Stat Pitch Stability":"Pitch Stability","Stat Lateral Stability":"Lateral Stability","Stat Wing Area":"Wing Area","Stat Raw Strain":"Raw Strain","Stat Structure":"Structure","Stat Toughness":"Toughness","Stat Power":"Power","Stat Fuel Consumption":"Fuel Consumption","Stat Fuel":"Fuel","Stat Pitch Speed":"Pitch Speed","Stat Pitch Boost":"Pitch Boost","Stat Charge":"Charge","Stat Crash Safety":"Crash Safety","Stat Max Strain":"Max Strain","Stat Visibility":"Visibility","Stat Reliability":"Reliability","Stat Flight Stress":"Flight Stress","Stat Required Sections":"Required Sections","Stat Escape":"Escape","Stat Altitude":"Altitude","Stat Overspeed":"Overspeed","Stat Cooling":"Cooling","Stat Torque":"Torque","Stat Rumble":"Rumble","Derived Aircraft Name":"Aircraft Name","Derived Era Report":"Era","Derived Mass Variations":"Mass Variations","Derived Boost":"Boost","Derived Handling":"Handling","Derived Rate of Climb":"Rate of Climb","Derived Stall Speed":"Stall Speed","Derived Top Speed":"Top Speed","Derived Vital Components":"Vital Components","Derived Full Fuel with Bombs":"Full Fuel with Bombs","Derived Half Fuel with Bombs":"Half Fuel with Bombs","Derived Full Fuel":"Full Fuel","Derived Half Fuel":"Half Fuel","Derived Empty Fuel":"Empty Fuel","Derived Propulsion":"Propulsion","Derived Aerodynamics":"Aerodynamics","Derived Survivability":"Survivability","Derived Crew Members":"Crew Members","Derived Dropoff":"Dropoff","Derived Stability":"Stability","Derived Crash Safety":"Crash Safety","Derived Crew/Passengers":"Crew/Passengers","Derived Overspeed":"Overspeed","Derived Energy Loss":"Energy Loss","Derived Fuel Uses":"Fuel Uses","Derived Turn Bleed":"Turn Bleed","Derived Turn Bleed wB":"Turn Bleed (with Bombs)","Derived Attack Modifier":"Attack Modifier","Derived Landing Gear":"Landing Gear","Derived Communications":"Communications","Derived Escape":"Escape","Derived Ideal Engine Altitude":"Ideal Altitude","Derived Is Flammable Question":"Flammable?","Derived Electrics":"Electrics","Derived Weapon Systems":"Weapon Systems","Derived Special Rules":"Special Rules","Derived Problematic Parts":"Out-of-Era Parts","Fuel Uses Warning":"This plane is very short on fuel. Consider 7 Fuel Uses as a good guideline for play, although special cases exist.","Stall Speed":"Stall Speed","Stall Speed Warning":"Stall Speed is higher than Max Speed.","Price Word Used":"Used","Yes":"Yes","No":"No","Derived Per 10 Speed":"/10 speed","Derived Battery":"Battery Storage","Weapon Description":"{0}: {1}x {2} fires [{3}] for {4} damage with {5} hits with {6} ammunition. [{7}]","Weapon Description Heat Ray":"{0}: {1}x {2} fires [{3}] for {4} damage with {5} hits with {6} charges. [{7}]","Submachine Gun":"Submachine Gun","SMG Warning":"-3 to all Attacks beyond Knife Range.","Scattergun":"Scattergun","Scattergun Warning":"Rather than roll Open Fire, you roll a d5 per hit shown in the builder. You do a number of Hits equal to, and Damage half of the roll results, and roll Crit dice like normal. Not affected by Masteries or Special Ammo.","Light Machine Gun":"Light Machine Gun","Machine Gun":"Machine Gun","Balloon Gun":"Balloon Gun","Enhanced Machine Gun":"Enhanced Machine Gun","Enhanced Heavy Machine Gun":"Enhanced Heavy Machine Gun","Punt Gun":"Punt Gun","Punt Gun Warning":"Rather than roll Open Fire, you roll a d10 per hit shown in the builder. You do a number of Hits equal to, and Damage half of the roll results, and roll Crit dice like normal. Not affected by Masteries or Special Ammo.","Light Repeating Cannon":"Light Repeating Cannon","Heavy Cannon":"Heavy Cannon","Light Machine Cannon":"Light Machine Cannon","Heavy Machine Cannon":"Heavy Machine Cannon","Fliergerflammenwerfer":"Fliergerflammenwerfer","Fliergerflammenwerfer Warning":"Rather than roll Open Fire, you roll a d10 per hit shown in the builder. You do a number of Hits equal to, and Damage half of the roll results, and roll Crit dice like normal. Not affected by Masteries or Special Ammo. Uses Fuel uses as Ammo. Incendiary. Max range is Knife. Crits always start fires.","Recoilless Cannon":"Recoilless Cannon","Autocannon":"Autocannon","Battle Cannon":"Battle Cannon","Precision Rifle":"Precision Rifle","Precision Rifle Warning":"Must be fired alone. Must Draw a Bead to fire. Never does more than 1 Hit worth of damage, but rolls Crits normally. Special Ammo: 1 Box per belt. Hits ammo adds or subtracts 5 Hits. Crit Ammo replaces normal Crits outright with the special effect.","Lightning Arc":"Lightning Arc","Lightning Arc Warning":"Uses 3 Charge to deal 1d10 damage to any aircraft within Close range.","Harpoon Launcher":"Harpoon Launcher","Harpoon Launcher Warning":"Max Range Close. Ignores range bands: hits on 16+. Prevents escape until the line is cut. Harpoons can be used as ziplines by boarders.","Heavy Machine Gun":"Heavy Machine Gun","Heavy Repeating Cannon":"Heavy Repeating Cannon","Accessories Section Title":"Additional Parts","Accessories Radio":"Radio","Accessories Autopilot":"Autopilot","Accessories Control Aids":"Control Aids","Accessories Armour Coverage":"Armour Coverage","Accessories Climate":"Climate","Accessories Visibility":"Visibility","Accessories Additional Part Stats":"Additional Part Stats","Accessories Information":"Information","Accessories Electrical":"Electrical","Accessories Control":"Control","Cards Too Many Warnings Warning":"And More!  See the Plane Builder for details.","Cards Gun String Reload":"{0} loads of {1} shots","Cards Gun String No Reload":"{0} shots","Cards Uses Radiator":"Uses Radiator #{0}","Cockpit Section Title":"Cockpits","Cockpit Num Cockpits":"Number of Cockpits:","Cockpit Bombsight":"Bombsight","Cockpit Option":"Option","Cockpit Upgrade":"Upgrade","Cockpit Safety Options":"Safety Options","Cockpit Gunsights":"Gunsights","Cockpit Cockpit Stats":"Cockpit Stats","Control Surfaces Section Title":"Control Surfaces","Control Surfaces Control Surfaces":"Control Surfaces","Control Surfaces Drag Inducers":"Drag Inducers","Control Surfaces Stats":"Control Surface Stats","Control Surfaces Ailerons":"Ailerons","Control Surfaces Rudders":"Rudders","Control Surfaces Elevators":"Elevators","Control Surfaces Flaps":"Flaps","Control Surfaces Slats":"Slats","Engines Section Title":"Engines","Engines Num Engines":"Number of Engines:","Engines Num Radiators":"Number of Radiators:","Engines Asymmetric Plane":"Asymmetric Plane:","Engines Engine Type":"Engine Type","Engines Options":"Options","Engines Options 2":"Options 2","Engines Engine Stats":"Engine Stats","Engine Cooling":"Cooling","Engine Mounting":"Mounting","Engine Upgrades":"Upgrades","Engine Cowls":"Cowls","Engine Electrical":"Electrical","Engine Mounting Location":"Engine Mounting Location","Engine Push Pull":"Push Pull","Engine Side-by-Side":"Side-by-Side","Engine Torque To Structure":"Torque To Structure","Engine Extended Driveshafts":"Extended Driveshafts","Engine Outboard Propeller":"Outboard Propeller","Engine Geared Propeller":"Geared Propeller","Engine Negate Reliability Penalty":"Negate Reliability Penalty","Engine Alternator":"Alternator","Engine Generator":"Generator","Engine Rotary Cooling":"Rotary Engines use Oil Tanks. \\n +1 Mass, Oil Tank is a Vital Component.","Engine Air-Cooled Engine.":"Air-Cooled Engine.","Engine Air Cooling Fan":"Air Cooling Fan","Engine Select Radiator":"Select Radiator","Engine Cooling Amount":"Cooling Amount","Radiators Radiator Type":"Radiator Type","Radiators Mounting":"Mounting","Radiators Coolant":"Coolant","Radiators Radiator Stats":"Radiator Stats","Radiators Harden Radiator":"Harden Radiator","Era Section Title":"Era","Era Option":"Option","Frames Frames and Covering":"Frames and Covering","Frames Frame Type":"Frame Type","Frames Skin Type":"Skin Type","Frames Frame Options":"Frame Options","Frames Frame Stats":"Frame Stats","Frames Flying Wing":"Flying Wing","Frames Geodesic":"Geodesic","Frames Monocoque":"Monocoque","Frames Internal Bracing":"Internal Bracing","Frames Lifting Body":"Lifting Body","Frames No Skin":"None","Frames Tail Section Title":"Tail","Frames Tail Type":"Tail Length:","Frames Tail Farman":"Farman Tail:","Frames Tail Boom":"Boom Tail:","Frames Tail Frame Type":"Tail Frame Type","Frames Tail Skin Type":"Tail Skin Type","Frames Tail Frame Options":"Tail Frame Options","Landing Gear Section Title":"Landing Gear","Landing Gear Landing Gear":"Landing Gear","Landing Gear Extras":"Extras","Landing Gear Gear Stats":"Gear Stats","Landing Gear Retractable":"Retractable","Load Section Title":"Load","Load Fuel":"Fuel","Load Munitions":"Munitions","Load Cargo and Passengers":"Cargo and Passengers","Load Load Stats":"Load Stats","Load Self-Sealing Gas Tank":"Self-Sealing Gas Tank","Load Remote Fire Extinguisher":"Remote Fire Extinguisher","Load Bombs":"Bombs","Load Rockets":"Rockets","Load Internal Bay Count":"Internal Bay Count","Load Widen Internal Bay 1":"Widen Internal Bay 1","Load Widen Internal Bay 2":"Widen Internal Bay 2","Load Cargo":"Cargo","Optimization Section Title":"Optimizations","Optimization Num Free Optimizations":"Number of Free Optimizations:","Optimization Negative":"Negative","Optimization Effect":"Effect","Optimization Positive":"Positive","Optimization Optimization Stats":"Optimization Stats","Optimization Cost":"Expense: +/- 10% Cost","Optimization Lift Bleed":"Lift Efficiency: +/- 3 Lift Bleed","Optimization Leg Room":"Leg Room: +/- 1 Escape, Visibility","Optimization Mass":"Mass: +/- 10% Mass","Optimization Toughness":"Redundancy: +/- 25% Toughness","Optimization Max Strain":"Support: +/- 15% Max Strain","Optimization Reliability":"Reliability: +/- 2 Reliability","Optimization Drag":"Streamlining: +/- 10% Drag","Passengers Section Title":"Passengers","Passengers Number of Seats":"Number of Seats","Passengers Number of Beds":"Number of 1st Class, Beds, or Stretchers","Passengers Upgrade":"Upgrade","Passengers Connectivity":"Connectivity","Passengers Count":"{0} cabin seats and {1} first class or stretcher seats.","Propeller Section Title":"Propeller","Propeller Propeller Pitch":"Propeller Pitch:","Propeller Propeller Upgrades:":"Propeller Upgrades:","Reinforcement Section Title":"Reinforcements","Reinforcement External Reinforcements":"External Reinforcements","Reinforcement Internal Reinforcements":"Cantilevers","Reinforcement Reinforcement Stats":"Reinforcement Stats","Reinforcement Wood":"Wood","Reinforcement Steel":"Steel","Reinforcement Cabane":"Cabane","Reinforcement Wires":"Wires","Reinforcement Wing Blades":"Wing Blades","Reinforcement Aircraft Max Strain":"Aircraft Max Strain","Rotor Section Title":"Rotors","Rotor Rotor":"Rotor","Rotor Material":"Material","Rotor Accessories":"Accessories","Rotor Stats":"Rotor Stats","Rotor Minimum Span":"Minimum Rotor Span","Rotor Span":"Rotor Span Modification","Rotor Rotor Material":"Rotor Material","Rotor Clutched Rotor":"Clutched Rotor","Rotor Area":"Rotor Area","Rotor Number of Rotors":"Number of Rotors","Rotor Ideal Rotor Span":"Ideal Rotor Span","Rotor Stagger":"Rotor Stagger","Rotor Motor Cross-link":"Motor Cross-link","Rotor Blade Count":"Blade Count","Aircraft Type Section Title":"Aircraft Type","AIRPLANE":"Fixed Wing","HELICOPTER":"Helicopter","AUTOGYRO":"Autogyro","ORNITHOPTER_BASIC":"Basic Ornithopter","ORNITHOPTER_FLUTTER":"Fluttering Ornithopter","ORNITHOPTER_BUZZER":"Buzzing Ornithopter","Stabilizers Section Title":"Stabilizers","Stabilizers Horizontal Stabilizers":"Horizontal Stabilizers","Stabilizers Vertical Stabilizers":"Vertical Stabilizers","Stabilizers Stabilizer Stats":"Stabilizer Stats","Stabilizers # of Stabilizers":"# of Stabilizers","Used Section Title":"Used Plane","Used Is Aircraft Used?":"Is Aircraft Used?","Used Effect":"Effect","Used Description":"Description","Used Penalties(+) <br/> Benefits(-)":"Penalties(+) <br/> Benefits(-)","Used Burnt Out":"Burnt Out","Used Burnt Out Description":"Engines are at -1 Reliability","Used Ragged":"Ragged","Used Ragged Description":"Reduce your Max Speed by 10%","Used Hefty":"Hefty","Used Hefty Description":"Increase your Stall Speeds by 20%","Used Sticky Guns":"Sticky Guns","Used Sticky Guns Description":"Increase the chance of guns jamming by 1","Used Weak":"Weak","Used Weak Description":"Cut the plane\'s Toughness in half","Used Fragile":"Fragile","Used Fragile Description":"Reduce your Max Strain by 20%","Used Leaky":"Leaky","Used Leaky Description":"Reduce your Fuel by 20%","Used Sluggish":"Sluggish","Used Sluggish Description":"Reduce your Handling by 5","Weapons Section Title":"Weapons","Weapons Number of Weapon Sets":"Number of Weapon Sets:","Weapons Number of Weapon Braces":"Number of Weapon Braces:","Weapons Weapon Set":"Weapon Set","Weapons Weapons":"Weapons","Weapons Weapon Stats":"Weapon Stats","Weapons Type":"Weapon Type","Weapons Number of Mounts":"Number of Mounts","Weapons Ammunition":"Ammunition","Weapons Action":"Action","Weapons Projectile":"Projectile","Weapons Belt Fed":"Belt Fed","Weapons Stat Mounting":"Mounting","Weapons Stat Jam":"Jam","Weapons Stat Hits":"Hits","Weapons Stat Damage":"Damage","Weapons Stat Shots":"Shots","Weapons Stat Charges":"Charges per Shot","Weapons Wing Mount":"Wing Mount","Weapons Accessible":"Accessible","Weapons Free Accessible":"Free Accessible","Weapons Covered":"Covered","Weapons # Weapons at Mount":"Weapons at Mount","Weapons Synchronization":"Synchronization","Weapons Mount":"Weapon Mount","Weapons Braces":"Weapon Braces","Weapons Braces Warning":"These mounts give an observer +1 to make a Personal Attack with a loose weapon they are carrying in their hands.","Wings Section Title":"Wings","Wings Wing Stagger":"Wing Stagger:","Wings Closed Wing":"Closed Wing:","Wings Swept Wing":"Swept Wings:","Wings Wing Type":"Wing Type","Wings Wing Options":"Wing Options","Wings Wing Stats":"Wing Stats","Wings Full Wings":"Full Wings","Wings Miniature Wings":"Miniature Wings","Wings Sesquiplane":"Sesquiplane","Wings No Wing":"None","Wings Area":"Area","Wings Span":"Span","Wings Gull":"Gull","Wings Dihedral":"Dihedral","Wings Anhedral":"Anhedral","Aircraft Button Save":"Save","Aircraft Button Load":"Load","Aircraft Button Copy As Link":"Copy As Link","Aircraft Button Save Dashboard":"Save Dashboard","Aircraft Button Interactive Dashboard":"Interactive Dashboard","Aircraft Button Save NPC":"Save NPC","Aircraft Button Save Catalog":"Save Catalog","Aircraft Button Default Aircraft":"Default Aircraft","Aircraft Stats Section Title":"Total Sum of Stats","Aircraft Derived Section Title":"Aircraft Derived Statistics","Seat #":"Seat #{0}","Seats #":"Seats # {0}","Seat Location":"Choose Seat","Radiators #":"Radiators # {0}","Crew Pilot":"Pilot","Crew Bombadier":"Bombadier","Crew Co-Pilot":"Co-Pilot","Crew Gunner":"Gunner","Crew Aircrew":"Aircrew","Diesel":"Diesel Engine","Diesel Warning":"Engine won\'t catch fire.","Cargo Tiny":"A small locker for personal stuff.","Cargo Small":"Will fit a trunk, barrel, or crate.","Cargo Medium":"Will fit a small vehicle like a motorcycle, car, or zeppelin engine.","Cargo Large":"Will fit a scout or fighter aircraft with the wings taken off.","Cargo Huge":"Will fit just about anything you can imagine.","Alter Select Part":"Select Part","Alter Quantity":"Quantity","Alter Part Name":"Part Name","Alter Part Special Rules":"Special Rules","Frame Count":"Frame Count","Frame Count Warning":"This plane appears to have unused frame sections.  Check to see if this is intentional.","Altitude Section Title":"Altitude Effects","Altitude Altitude":"Altitude","Rarity":"Rarity","Rarity Custom":"Custom","Rarity Common":"Common","Rarity Rare":"Rare","Rarity Legendary":"Legendary","Boost Warning":"Boost is 0 for some loads.  The plane cannot accelerate to take off.","Insufficient Charge":"Insufficient Charge","Insufficient Charge Warning":"This aircraft has electrical systems with nothing to power them.","Low Mass Warning":"This aircraft is very low mass. If it is a custom airplane, be careful not to make it overpowered.","Low Drag Warning":"This aircraft is very low drag. If it is a custom airplane, be careful not to make it overpowered."}}');
var src_strings_namespaceObject = /*#__PURE__*/__webpack_require__.t(strings_namespaceObject, 2);
;// CONCATENATED MODULE: ./src/impl/Localization.ts


class Localization {
    constructor() {
        this.lang = "en";
    }
    LoadLanguages(lang) {
        this.languages = lang; //comment
    }
    GetLanguages() {
        const lang = [];
        for (const elem of this.languages["languages"]) {
            lang.push(elem);
        }
        return lang;
    }
    SetCurrentLanguage(lang) {
        if (this.languages[lang]) {
            this.lang = lang;
        }
    }
    e(key) {
        if (this.languages[this.lang][key]) {
            return this.languages[this.lang][key];
        }
        else if (this.languages["en"][key]) {
            return this.languages["en"][key];
        }
        else {
            console.error("Failed to find " + key);
            return "!" + key + "!";
        }
    }
}
const localization = new Localization();
localization.LoadLanguages(src_strings_namespaceObject);
function Localization_lu(s, ...args) {
    return string_StringFmt.Format(localization.e(s), ...args);
}

;// CONCATENATED MODULE: ./src/impl/Stats.ts

var WARNING_COLOR;
(function (WARNING_COLOR) {
    WARNING_COLOR[WARNING_COLOR["WHITE"] = 0] = "WHITE";
    WARNING_COLOR[WARNING_COLOR["YELLOW"] = 1] = "YELLOW";
    WARNING_COLOR[WARNING_COLOR["RED"] = 2] = "RED";
})(WARNING_COLOR || (WARNING_COLOR = {}));
;
class Stats {
    constructor(js) {
        this.liftbleed = 0;
        this.wetmass = 0;
        this.mass = 0;
        this.drag = 0;
        this.control = 0;
        this.cost = 0;
        this.reqsections = 0;
        this.visibility = 0;
        this.flightstress = 0;
        this.escape = 0;
        this.pitchstab = 0;
        this.latstab = 0;
        this.cooling = 0;
        this.reliability = 0;
        this.power = 0;
        this.fuelconsumption = 0;
        this.maxstrain = 0;
        this.structure = 0;
        this.pitchspeed = 0;
        this.pitchboost = 0;
        this.wingarea = 0;
        this.toughness = 0;
        this.upkeep = 0;
        this.crashsafety = 0;
        this.bomb_mass = 0;
        this.fuel = 0;
        this.charge = 0;
        this.warnings = [];
        this.era = [];
        if (js) {
            this.fromJSON(js, 0);
        }
    }
    toJSON() {
        return {
            liftbleed: this.liftbleed,
            wetmass: this.wetmass,
            mass: this.mass,
            drag: this.drag,
            control: this.control,
            cost: this.cost,
            reqsections: this.reqsections,
            visibility: this.visibility,
            flightstress: this.flightstress,
            escape: this.escape,
            pitchstab: this.pitchstab,
            latstab: this.latstab,
            cooling: this.cooling,
            reliability: this.reliability,
            power: this.power,
            fuelconsumption: this.fuelconsumption,
            maxstrain: this.maxstrain,
            structure: this.structure,
            pitchboost: this.pitchboost,
            pitchspeed: this.pitchspeed,
            wingarea: this.wingarea,
            toughness: this.toughness,
            upkeep: this.upkeep,
            crashsafety: this.crashsafety,
            bomb_mass: this.bomb_mass,
            fuel: this.fuel,
            charge: this.charge,
            warnings: this.warnings,
            eras: this.era,
        };
    }
    fromJSON(js, json_version) {
        if (js["liftbleed"])
            this.liftbleed = js["liftbleed"];
        if (js["wetmass"])
            this.wetmass = js["wetmass"];
        if (js["mass"])
            this.mass = js["mass"];
        if (js["drag"])
            this.drag = js["drag"];
        if (js["control"])
            this.control = js["control"];
        if (js["cost"])
            this.cost = js["cost"];
        if (js["reqsections"])
            this.reqsections = js["reqsections"];
        if (js["visibility"])
            this.visibility = js["visibility"];
        if (js["flightstress"])
            this.flightstress = js["flightstress"];
        if (js["escape"])
            this.escape = js["escape"];
        if (js["pitchstab"])
            this.pitchstab = js["pitchstab"];
        if (js["latstab"])
            this.latstab = js["latstab"];
        if (js["cooling"])
            this.cooling = js["cooling"];
        if (js["reliability"])
            this.reliability = js["reliability"];
        if (js["power"])
            this.power = js["power"];
        if (js["fuelconsumption"])
            this.fuelconsumption = js["fuelconsumption"];
        if (js["maxstrain"])
            this.maxstrain = js["maxstrain"];
        if (js["structure"])
            this.structure = js["structure"];
        if (js["pitchspeed"])
            this.pitchspeed = js["pitchspeed"];
        if (js["pitchboost"])
            this.pitchboost = js["pitchboost"];
        if (js["wingarea"])
            this.wingarea = js["wingarea"];
        if (js["toughness"])
            this.toughness = js["toughness"];
        if (js["upkeep"])
            this.upkeep = js["upkeep"];
        if (js["crashsafety"])
            this.crashsafety = js["crashsafety"];
        if (js["bomb_mass"])
            this.bomb_mass = js["bomb_mass"];
        if (js["fuel"])
            this.fuel = js["fuel"];
        if (js["charge"])
            this.charge = js["charge"];
        if (js["warning"])
            this.warnings.push({
                source: Localization_lu(js["name"]),
                warning: Localization_lu(js["warning"]),
                color: WARNING_COLOR.WHITE,
            });
        if (js["warnings"]) {
            const warnings = js["warnings"];
            const newwarn = [];
            for (const w of warnings) {
                newwarn.push({
                    source: w["source"],
                    warning: w["warning"],
                });
            }
            this.warnings = this.MergeWarnings(newwarn);
        }
        if (js["era"]) {
            this.era.push({
                name: Localization_lu(js["name"]),
                era: Localization_lu(js["era"])
            });
        }
        if (js["eras"]) {
            const eras = js["eras"];
            const newera = [];
            for (const e of eras) {
                newera.push({
                    name: e["name"],
                    era: e["era"],
                });
            }
            this.era = this.MergeEra(newera);
        }
    }
    serialize(s) {
        s.PushNum(this.liftbleed);
        s.PushNum(this.wetmass);
        s.PushNum(this.mass);
        s.PushNum(this.drag);
        s.PushNum(this.control);
        s.PushNum(this.cost);
        s.PushNum(this.reqsections);
        s.PushNum(this.visibility);
        s.PushNum(this.flightstress);
        s.PushNum(this.escape);
        s.PushNum(this.pitchstab);
        s.PushNum(this.latstab);
        s.PushNum(this.cooling);
        s.PushNum(this.reliability);
        s.PushNum(this.power);
        s.PushNum(this.fuelconsumption);
        s.PushNum(this.maxstrain);
        s.PushNum(this.structure);
        s.PushFloat(this.pitchboost);
        s.PushFloat(this.pitchspeed);
        s.PushNum(this.wingarea);
        s.PushNum(this.toughness);
        s.PushNum(this.upkeep);
        s.PushNum(this.crashsafety);
        s.PushNum(this.bomb_mass);
        s.PushNum(this.fuel);
        s.PushNum(this.charge);
        s.PushNum(this.warnings.length);
        for (const warn of this.warnings) {
            s.PushString(warn.source);
            s.PushString(warn.warning);
        }
        s.PushNum(this.era.length);
        for (const e of this.era) {
            s.PushString(e.name);
            s.PushString(e.era);
        }
    }
    deserialize(d) {
        this.liftbleed = d.GetNum();
        this.wetmass = d.GetNum();
        this.mass = d.GetNum();
        this.drag = d.GetNum();
        this.control = d.GetNum();
        this.cost = d.GetNum();
        this.reqsections = d.GetNum();
        this.visibility = d.GetNum();
        this.flightstress = d.GetNum();
        this.escape = d.GetNum();
        this.pitchstab = d.GetNum();
        this.latstab = d.GetNum();
        this.cooling = d.GetNum();
        this.reliability = d.GetNum();
        this.power = d.GetNum();
        this.fuelconsumption = d.GetNum();
        this.maxstrain = d.GetNum();
        this.structure = d.GetNum();
        this.pitchboost = d.GetFloat();
        this.pitchspeed = d.GetFloat();
        this.wingarea = d.GetNum();
        this.toughness = d.GetNum();
        this.upkeep = d.GetNum();
        this.crashsafety = d.GetNum();
        this.bomb_mass = d.GetNum();
        this.fuel = d.GetNum();
        this.charge = d.GetNum();
        if (d.version > 12.25) {
            const wcount = d.GetNum();
            this.warnings = [];
            for (let i = 0; i < wcount; i++) {
                this.warnings.push({
                    source: d.GetString(),
                    warning: d.GetString(),
                    color: WARNING_COLOR.WHITE,
                });
            }
            const ecount = d.GetNum();
            this.era = [];
            for (let i = 0; i < ecount; i++) {
                this.era.push({ name: d.GetString(), era: d.GetString() });
            }
        }
    }
    Add(other) {
        const res = new Stats();
        res.liftbleed = this.liftbleed + other.liftbleed;
        res.wetmass = this.wetmass + other.wetmass;
        res.mass = this.mass + other.mass;
        res.drag = this.drag + other.drag;
        res.control = this.control + other.control;
        res.cost = this.cost + other.cost;
        res.reqsections = this.reqsections + other.reqsections;
        res.visibility = this.visibility + other.visibility;
        res.flightstress = this.flightstress + other.flightstress;
        res.escape = this.escape + other.escape;
        res.pitchstab = this.pitchstab + other.pitchstab;
        res.latstab = this.latstab + other.latstab;
        res.cooling = this.cooling + other.cooling;
        res.reliability = this.reliability + other.reliability;
        res.power = this.power + other.power;
        res.fuelconsumption = this.fuelconsumption + other.fuelconsumption;
        res.maxstrain = this.maxstrain + other.maxstrain;
        res.structure = this.structure + other.structure;
        res.pitchboost = this.pitchboost + other.pitchboost;
        res.pitchspeed = this.pitchspeed + other.pitchspeed;
        res.wingarea = this.wingarea + other.wingarea;
        res.toughness = this.toughness + other.toughness;
        res.upkeep = this.upkeep + other.upkeep;
        res.crashsafety = this.crashsafety + other.crashsafety;
        res.bomb_mass = this.bomb_mass + other.bomb_mass;
        res.fuel = this.fuel + other.fuel;
        res.charge = this.charge + other.charge;
        res.warnings = this.MergeWarnings(other.warnings);
        res.era = this.MergeEra(other.era);
        return res;
    }
    MergeWarnings(owarn) {
        const newList = [];
        for (const w2 of this.warnings) {
            newList.push({ source: w2.source, warning: w2.warning, color: w2.color, });
        }
        for (const w of owarn) {
            let dup = false;
            for (const w2 of this.warnings) {
                if (w.source == w2.source && w.warning == w2.warning)
                    dup = true;
            }
            if (!dup)
                newList.push({ source: w.source, warning: w.warning, color: w.color });
        }
        return newList;
    }
    MergeEra(oera) {
        const newList = [];
        for (const w2 of this.era) {
            newList.push({ name: w2.name, era: w2.era });
        }
        for (const w of oera) {
            let dup = false;
            for (const w2 of this.era) {
                if (w.name == w2.name && w.era == w2.era)
                    dup = true;
            }
            if (!dup)
                newList.push({ name: w.name, era: w.era });
        }
        return newList;
    }
    Multiply(other) {
        const res = this.Clone();
        res.liftbleed = this.liftbleed * other;
        res.wetmass = this.wetmass * other;
        res.mass = this.mass * other;
        res.drag = this.drag * other;
        res.control = this.control * other;
        res.cost = this.cost * other;
        res.reqsections = this.reqsections * other;
        res.visibility = this.visibility * other;
        res.flightstress = this.flightstress * other;
        res.escape = this.escape * other;
        res.pitchstab = this.pitchstab * other;
        res.latstab = this.latstab * other;
        res.cooling = this.cooling * other;
        res.reliability = this.reliability * other;
        res.power = this.power * other;
        res.fuelconsumption = this.fuelconsumption * other;
        res.maxstrain = this.maxstrain * other;
        res.structure = this.structure * other;
        //Pitch Speed and Pitch Boost don't get multiplied.
        res.wingarea = this.wingarea * other;
        res.toughness = this.toughness * other;
        res.upkeep = this.upkeep * other;
        res.crashsafety = this.crashsafety * other;
        res.bomb_mass = this.bomb_mass * other;
        res.fuel = this.fuel * other;
        res.charge = this.charge * other;
        if (Math.abs(other) > 1.0e-6) {
            res.warnings = this.warnings;
            res.era = this.era;
        }
        return res;
    }
    Equal(other) {
        return this.liftbleed == other.liftbleed
            && this.wetmass == other.wetmass
            && this.mass == other.mass
            && this.drag == other.drag
            && this.control == other.control
            && this.cost == other.cost
            && this.reqsections == other.reqsections
            && this.visibility == other.visibility
            && this.flightstress == other.flightstress
            && this.escape == other.escape
            && this.pitchstab == other.pitchstab
            && this.latstab == other.latstab
            && this.cooling == other.cooling
            && this.reliability == other.reliability
            && this.power == other.power
            && this.fuelconsumption == other.fuelconsumption
            && this.maxstrain == other.maxstrain
            && this.structure == other.structure
            && this.pitchspeed == other.pitchspeed
            && this.pitchboost == other.pitchboost
            && this.wingarea == other.wingarea
            && this.toughness == other.toughness
            && this.upkeep == other.upkeep
            && this.crashsafety == other.crashsafety
            && this.bomb_mass == other.bomb_mass
            && this.fuel == other.fuel
            && this.charge == other.charge;
    }
    rtz(num) {
        if (num > 0) {
            return Math.floor(1.0e-6 + num);
        }
        return Math.ceil(-1.0e-6 + num);
    }
    Round() {
        this.liftbleed = this.rtz(this.liftbleed);
        this.wetmass = this.rtz(this.wetmass);
        this.mass = this.rtz(this.mass);
        this.drag = this.rtz(this.drag);
        this.control = this.rtz(this.control);
        this.cost = this.rtz(this.cost);
        this.reqsections = this.rtz(this.reqsections);
        this.visibility = this.rtz(this.visibility);
        this.flightstress = this.rtz(this.flightstress);
        this.escape = this.rtz(this.escape);
        this.pitchstab = this.rtz(this.pitchstab);
        this.latstab = this.rtz(this.latstab);
        this.cooling = this.rtz(this.cooling);
        this.reliability = this.rtz(this.reliability);
        this.power = this.rtz(this.power);
        this.fuelconsumption = this.rtz(this.fuelconsumption);
        this.maxstrain = this.rtz(this.maxstrain);
        this.structure = this.rtz(this.structure);
        this.wingarea = this.rtz(this.wingarea);
        this.toughness = this.rtz(this.toughness);
        this.upkeep = this.rtz(this.upkeep);
        this.crashsafety = this.rtz(this.crashsafety);
        this.bomb_mass = this.rtz(this.bomb_mass);
        this.fuel = this.rtz(this.fuel);
        this.charge = this.rtz(this.charge);
    }
    Clone() {
        return this.Add(new Stats());
    }
}
const era2numHh = (era) => {
    switch (era) {
        case "Pioneer":
            return 0;
        case "WWI":
            return 1;
        case "Roaring 20s":
            return 2;
        case "Coming Storm":
            return 3;
        case "WWII":
            return 4;
        case "Last Hurrah":
            return 5;
        case "Himmilgard":
            return 6;
    }
};
const era2numHl = (era) => {
    switch (era) {
        case "Pioneer":
            return 0;
        case "WWI":
            return 1;
        case "Roaring 20s":
            return 2;
        case "Coming Storm":
            return 3;
        case "WWII":
            return 4;
        case "Last Hurrah":
            return 5;
        case "Himmilgard":
            return -1;
    }
};
const num2era = (era) => {
    switch (era) {
        case 0:
            return "Pioneer";
        case 1:
            return "WWI";
        case 2:
            return "Roaring 20s";
        case 3:
            return "Coming Storm";
        case 4:
            return "WWII";
        case 5:
            return "Last Hurrah";
        case 6:
        case -1:
            return "Himmilgard";
    }
};
const Stress2Str = (arr) => {
    var str = "";
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
            str += arr[i][0].toString() + "(" + arr[i][1].toString() + "), ";
        }
        else {
            str += arr[i][0].toString() + ", ";
        }
    }
    if (arr.length > 0) {
        const i = arr.length - 1;
        if (arr[i].length == 2 && arr[i][0] != arr[i][1]) {
            str += arr[i][0].toString() + "(" + arr[i][1].toString() + ")";
        }
        else {
            str += arr[i][0].toString();
        }
    }
    return str;
};

;// CONCATENATED MODULE: ./src/impl/Serialize.ts
class Serialize {
    constructor(arr) {
        this.array = new ArrayBuffer(51200);
        this.view = new DataView(this.array);
        this.offset = 0;
    }
    Check() {
        if (this.offset >= this.array.byteLength)
            throw "Serialization Way too long.";
    }
    PushNum(num) {
        this.view.setInt16(this.offset, num, false);
        this.offset += 2;
        this.Check();
    }
    PushBool(bool) {
        if (bool)
            this.view.setUint8(this.offset, 1);
        else
            this.view.setUint8(this.offset, 0);
        this.offset += 1;
        this.Check();
    }
    PushString(str) {
        this.PushNum(str.length);
        for (let i = 0; i < str.length; i++) {
            this.view.setUint8(this.offset, str.charCodeAt(i));
            this.offset++;
        }
        this.Check();
    }
    PushNumArr(nums) {
        this.PushNum(nums.length);
        for (const n of nums) {
            this.PushNum(n);
        }
        this.Check();
    }
    PushBoolArr(bools) {
        this.PushNum(bools.length);
        for (const b of bools) {
            this.PushBool(b);
        }
        this.Check();
    }
    PushFloat(flt) {
        this.view.setFloat32(this.offset, flt, false);
        this.offset += 4;
        this.Check();
    }
    FinalArray() {
        return this.array.slice(0, this.offset);
    }
}
class Deserialize {
    constructor(arr) {
        this.array = arr;
        this.view = new DataView(this.array);
        this.offset = 0;
        this.version = parseFloat(this.GetString());
        this.Reset();
    }
    Reset() {
        this.offset = 0;
    }
    Check() {
        if (this.offset >= this.array.byteLength)
            throw "Deserialization Failed";
    }
    GetNum() {
        this.Check();
        const num = this.view.getInt16(this.offset, false);
        this.offset += 2;
        return num;
    }
    GetBool() {
        this.Check();
        const bool = this.view.getUint8(this.offset);
        this.offset += 1;
        return bool > 0;
    }
    GetString() {
        this.Check();
        const len = this.GetNum();
        const arr = [];
        for (let i = 0; i < len; i++) {
            const char = this.view.getUint8(this.offset);
            arr.push(char);
            this.offset += 1;
        }
        return String.fromCharCode(...arr);
    }
    GetNumArr(tgt_length) {
        this.Check();
        const len = this.GetNum();
        const arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetNum());
        }
        while (arr.length < tgt_length) {
            arr.push(0);
        }
        return arr;
    }
    GetBoolArr(tgt_length) {
        this.Check();
        const len = this.GetNum();
        const arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetBool());
        }
        while (arr.length < tgt_length) {
            arr.push(false);
        }
        return arr;
    }
    GetFloat() {
        this.Check();
        const flt = this.view.getFloat32(this.offset, false);
        this.offset += 4;
        return flt;
    }
    CheckLastNum() {
        const num = this.view.getInt16(this.array.byteLength - 2, false);
        return num;
    }
}
function NumArr(arr, tgt_length) {
    while (arr.length < tgt_length) {
        arr.push(0);
    }
    return arr;
}
function BoolArr(arr, tgt_length) {
    while (arr.length < tgt_length) {
        arr.push(false);
    }
    return arr;
}

;// CONCATENATED MODULE: ./src/EngineBuilder/EngineBuilder.ts





var CompressorEnum;
(function (CompressorEnum) {
    CompressorEnum[CompressorEnum["NONE"] = 0] = "NONE";
    CompressorEnum[CompressorEnum["ALTITUDE_THROTTLE"] = 1] = "ALTITUDE_THROTTLE";
    CompressorEnum[CompressorEnum["SUPERCHARGER"] = 2] = "SUPERCHARGER";
    CompressorEnum[CompressorEnum["TURBOCHARGER"] = 3] = "TURBOCHARGER";
})(CompressorEnum || (CompressorEnum = {}));
class EngineBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", materials: 3, cost: 0.5, maxRPM: 30, powerdiv: 8, fuelfactor: 10 },
            { name: "WWI", materials: 2, cost: 1, maxRPM: 35, powerdiv: 7, fuelfactor: 8 },
            { name: "Roaring 20s", materials: 1.5, cost: 2, maxRPM: 40, powerdiv: 6.8, fuelfactor: 6 },
            { name: "Coming Storm", materials: 1.35, cost: 2.25, maxRPM: 45, powerdiv: 6.6, fuelfactor: 5 },
            { name: "WWII", materials: 1.25, cost: 2.5, maxRPM: 50, powerdiv: 6.5, fuelfactor: 4 },
            { name: "Last Hurrah", materials: 1, cost: 3, maxRPM: 50, powerdiv: 6.2, fuelfactor: 2 },
        ];
        this.CoolingTable = [
            { name: "Liquid Cooled", forcefactor: 1.2, RPMoff: 0, thrustfactor: 1, radiator: 1, massfactor: 1 },
            { name: "Air Cooled", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
            { name: "Rotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.5, radiator: 0, massfactor: 1 },
            { name: "Contrarotary", forcefactor: 1, RPMoff: 8, thrustfactor: 1.25, radiator: 0, massfactor: 1 },
            { name: "Semi-Radial", forcefactor: 0.8, RPMoff: 0, thrustfactor: 1, radiator: 0, massfactor: 1 },
            { name: "Liquid Radial", forcefactor: 1, RPMoff: 0, thrustfactor: 1, radiator: 2.5, massfactor: 1.3 },
        ];
        this.CompressorTable = [
            { name: "None" },
            { name: "Altitude Throttle" },
            { name: "Supercharger" },
            { name: "Turbocharger" },
        ];
        this.Upgrades = [
            { name: "Asperator Boost", powerfactor: 0.11, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: -1, costfactor: 3, reqsection: false },
            { name: "War Emergency Power", powerfactor: 0, fuelfactor: 0, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 5, reqsection: false },
            { name: "Fuel Injector", powerfactor: 0, fuelfactor: -0.1, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 2, reqsection: false },
            { name: "Diesel", powerfactor: -0.2, fuelfactor: -0.5, massfactor: 0, dragfactor: 0, idealalt: 0, costfactor: 0, reqsection: false },
        ];
        this.name = "Default Name";
        this.era_sel = 0;
        this.cool_sel = 0;
        this.upg_sel = [...Array(this.Upgrades.length).fill(false)];
        this.engine_displacement = 1;
        this.num_cyl_per_row = 2;
        this.num_rows = 2;
        this.compression_ratio = 2;
        this.rpm_boost = 1;
        this.material_fudge = 1;
        this.quality_fudge = 1;
        this.compressor_type = CompressorEnum.NONE;
        this.compressor_count = 0;
        this.min_IAF = 0;
        this.rarity = ENGINE_RARITY.CUSTOM;
    }
    CanUpgrade() {
        const can_upg = [...Array(this.Upgrades.length).fill(true)];
        can_upg[0] = false;
        if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE) {
            can_upg[0] = false;
            can_upg[1] = false;
            can_upg[2] = false;
        }
        return can_upg;
    }
    UpgradePower() {
        var power = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                power += this.Upgrades[i].powerfactor;
        }
        if (this.upg_sel[0]) {
            power *= 1 + this.Upgrades[0].powerfactor;
        }
        return power;
    }
    RPM() {
        const Era = this.EraTable[this.era_sel];
        const Cool = this.CoolingTable[this.cool_sel];
        return (Era.maxRPM - Cool.RPMoff) * (this.compression_ratio / 10);
    }
    GearedRPM() {
        const GearedRPM = this.RPM() * this.rpm_boost;
        return GearedRPM;
    }
    CalcPower() {
        const Era = this.EraTable[this.era_sel];
        const Cool = this.CoolingTable[this.cool_sel];
        //Calculate Force
        const EngineForce = this.engine_displacement * this.compression_ratio * Cool.forcefactor;
        const RawForce = EngineForce * this.UpgradePower();
        //Output Force
        const OutputForce = RawForce * (this.GearedRPM() / 10);
        return Math.floor(1.0e-6 + OutputForce / Era.powerdiv);
    }
    UpgradeMass() {
        var mass = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                mass += this.Upgrades[i].massfactor;
        }
        return mass;
    }
    CalcMass() {
        const Era = this.EraTable[this.era_sel];
        const Cool = this.CoolingTable[this.cool_sel];
        const CylMass = this.engine_displacement ** 2 * this.compression_ratio / 1000;
        const CrankMass = (this.engine_displacement * this.num_rows) / 10 + 1;
        const PistMass = this.engine_displacement / 5;
        const Mass = Math.floor(1.0e-6 + (CylMass + CrankMass + PistMass) * this.UpgradeMass() * this.material_fudge * Cool.massfactor);
        return Mass;
    }
    UpgradeDrag() {
        var drag = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                drag += this.Upgrades[i].dragfactor;
        }
        return drag;
    }
    CoolDrag() {
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 1;
            case "Air Cooled":
                return 1;
            case "Rotary":
                return this.GearedRPM() / 10;
            case "Contrarotary":
                return this.GearedRPM() / 8;
            case "Semi-Radial":
                return 1;
            case "Liquid Radial":
                return 1.2;
        }
        throw "Error in CoolDrag, no valid switch case.";
    }
    CalcDrag() {
        const RawDrag = 3 + (this.engine_displacement / this.num_rows) / 3;
        return Math.floor(1.0e-6 + RawDrag * this.CoolDrag() * this.UpgradeDrag());
    }
    // private CoolReliability() {
    //     switch (this.CoolingTable[this.cool_sel].name) {
    //         case "Liquid Cooled":
    //             return (this.num_rows / 2 + 5 * this.num_cyl_per_row) / 10;
    //         case "Air Cooled":
    //             return 1;
    //         case "Rotary":
    //             return 1;
    //         case "Contrarotary":
    //             return 1.1;
    //         case "Semi-Radial":
    //             return 0.8;
    //         case "Liquid Radial":
    //             return 1;
    //     }
    //     throw "Error in CoolReliability, no valid switch case.";
    // }
    CoolBurnout() {
        const EraBurnout = this.EraTable[this.era_sel].materials / 2;
        switch (this.CoolingTable[this.cool_sel].name) {
            case "Liquid Cooled":
                return 2;
            case "Air Cooled":
                return (2 + (this.num_rows ** 2)) * EraBurnout;
            case "Rotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Contrarotary":
                return (this.num_rows ** 2) / (this.GearedRPM() / 10);
            case "Semi-Radial":
                return (2 + (this.num_rows ** 2) / 2) * EraBurnout;
            case "Liquid Radial":
                return 0.5;
        }
        throw "Error in CoolBurnout, no valid switch case.";
    }
    MaterialModifier() {
        const EraBurnout = this.EraTable[this.era_sel].materials;
        const num_cyl = this.num_cyl_per_row * this.num_rows;
        const CylinderBurnout = this.engine_displacement / num_cyl * (this.compression_ratio ** 2) * EraBurnout;
        const GearingBurnout = this.rpm_boost * CylinderBurnout * this.CoolBurnout();
        return GearingBurnout * this.rpm_boost;
    }
    // private CalcReliability() {
    //     const Reliability = 6 - this.MaterialModifier() * this.CoolReliability() / 25;
    //     return Math.trunc(Reliability);
    // }
    IsRotary() {
        if (this.CoolingTable[this.cool_sel].name == "Rotary"
            || this.CoolingTable[this.cool_sel].name == "Contrarotary")
            return true;
        return false;
    }
    CalcCooling() {
        if (this.IsRotary())
            return 0;
        return Math.floor(1.0e-6 + this.MaterialModifier() / 20 * this.CoolingTable[this.cool_sel].radiator);
    }
    CalcOverspeed() {
        return Math.round(1.5 * this.RPM());
    }
    UpgradeFuel() {
        var fuel = 1;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                fuel += this.Upgrades[i].fuelfactor;
        }
        return fuel * this.EraTable[this.era_sel].fuelfactor;
    }
    CalcFuelConsumption() {
        const FuelConsumption = this.engine_displacement * this.RPM() / 100;
        return Math.floor(1.0e-6 + FuelConsumption * this.UpgradeFuel());
    }
    CalcAltitude() {
        var alt = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                alt += this.Upgrades[i].idealalt;
        }
        return (3 + alt) * 10 - 1;
    }
    CoolTorque() {
        if (this.CoolingTable[this.cool_sel].name == "Rotary") {
            return this.CalcMass();
        }
        else if (this.CoolingTable[this.cool_sel].name == "Contrarotary") {
            return Math.floor(1.0e-6 + this.CalcMass() / 2);
        }
        return 1;
    }
    CalcTorque() {
        return Math.floor(1.0e-6 + (this.CoolTorque() * this.GearedRPM() / 5) / 4);
    }
    UpgradeCost() {
        var cost = 0;
        for (let i = 0; i < this.upg_sel.length; i++) {
            if (this.upg_sel[i])
                cost += this.Upgrades[i].costfactor;
        }
        return cost;
    }
    CalcCost() {
        const Era = this.EraTable[this.era_sel];
        const Cool = this.CoolingTable[this.cool_sel];
        const Quality = Math.max(1, this.quality_fudge);
        const EngineForce = this.engine_displacement * this.compression_ratio / 10;
        const Cost = (this.UpgradeCost() + EngineForce);
        var PlusBSandEra = Quality * Era.cost * Cost;
        if (Cool.radiator > 0) {
            PlusBSandEra *= 1.4;
        }
        return Math.floor(1.0e-6 + PlusBSandEra);
    }
    VerifyValues() {
        this.engine_displacement = Math.max(0.01, this.engine_displacement);
        this.engine_displacement = Math.min(150, this.engine_displacement);
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.cool_sel = Math.max(0, Math.min(this.CoolingTable.length - 1, this.cool_sel));
        this.num_cyl_per_row = Math.floor(Math.max(1, this.num_cyl_per_row));
        this.num_rows = Math.floor(Math.max(1, this.num_rows));
        this.compression_ratio = Math.max(0.01, this.compression_ratio);
        this.compression_ratio = Math.min(25, this.compression_ratio);
        this.rpm_boost = Math.max(0.1, this.rpm_boost);
        this.rpm_boost = Math.min(2, this.rpm_boost);
        this.material_fudge = Math.max(0.1, this.material_fudge);
        this.material_fudge = Math.min(2.0, this.material_fudge);
        this.quality_fudge = Math.max(0.1, this.quality_fudge);
        this.quality_fudge = Math.min(2.0, this.quality_fudge);
        while ((this.material_fudge - 1) + (this.quality_fudge - 1) < -0.9) {
            this.material_fudge += 0.1;
            this.quality_fudge += 0.1;
        }
        this.min_IAF = 10 * Math.round(1.0e-6 + this.min_IAF / 10);
        this.compressor_count = Math.floor(1.0e-6 + this.compressor_count);
        this.compressor_count = Math.min(5, this.compressor_count);
        if (this.compressor_type == CompressorEnum.NONE) {
            this.compressor_count = 0;
            this.min_IAF = 0;
        }
        else if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE) {
            this.compressor_count = 1;
            this.min_IAF = 0;
            this.upg_sel[0] = false;
            this.upg_sel[1] = false;
            this.upg_sel[2] = false;
        }
        else {
            this.min_IAF = Math.max(0, this.min_IAF);
            this.compressor_count = Math.max(1, this.compressor_count);
        }
    }
    EngineStats() {
        const estats = new EngineStats();
        estats.name = this.name;
        this.VerifyValues();
        estats.stats.power = this.CalcPower();
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = Math.floor(1.0e-6 - 2 + this.era_sel + (this.quality_fudge + this.material_fudge - 2) * 10);
        estats.stats.cooling = this.CalcCooling();
        estats.oiltank = this.IsRotary();
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.altitude = this.CalcAltitude();
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;
        estats.stats.era.push({ name: this.name, era: Localization_lu(num2era(this.era_sel)) });
        switch (this.compressor_type) {
            case CompressorEnum.NONE: {
                break;
            }
            case CompressorEnum.ALTITUDE_THROTTLE: {
                estats.stats.cost += 3;
                estats.altitude = 49;
                estats.stats.warnings.push({
                    source: Localization_lu("Altitude Throttle"),
                    warning: Localization_lu("Altitude Throttle Warning"),
                    color: WARNING_COLOR.WHITE,
                });
                break;
            }
            case CompressorEnum.SUPERCHARGER: {
                estats.stats.power = Math.floor(1.0e-6 + 1.25 * estats.stats.power);
                estats.stats.fuelconsumption = Math.floor(1.0e-6 + 1.25 * estats.stats.fuelconsumption);
                estats.stats.mass = Math.floor(1.0e-6 + 1.2 * estats.stats.mass);
                estats.stats.drag += this.min_IAF / 10;
                estats.stats.cost += 1 + Math.floor(1.0e-6 + estats.stats.power / 50);
                const extra = this.compressor_count - 1;
                estats.altitude = 29 + 10 * 2 * extra;
                estats.stats.reliability -= extra;
                estats.stats.mass += extra;
                estats.stats.drag += extra;
                estats.stats.cost += 2 * extra;
                break;
            }
            case CompressorEnum.TURBOCHARGER: {
                estats.stats.power = Math.floor(1.0e-6 + 1.25 * estats.stats.power);
                estats.stats.mass = Math.floor(1.0e-6 + 1.2 * estats.stats.mass);
                estats.stats.drag += 2 * (this.min_IAF / 10);
                estats.stats.cost += 1 + Math.floor(1.0e-6 + estats.stats.power / 50);
                const extra = this.compressor_count - 1;
                estats.altitude = 49 + 10 * 2 * extra;
                estats.stats.reliability -= extra;
                estats.stats.mass += extra;
                estats.stats.drag += extra;
                estats.stats.cost += 2 * extra;
                estats.stats.reqsections += 1;
                break;
            }
        }
        if (this.compressor_type == CompressorEnum.ALTITUDE_THROTTLE || this.upg_sel[1]) {
            estats.stats.warnings.push({
                source: Localization_lu("War Emergency Power"),
                warning: Localization_lu("War Emergency Power Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        estats.stats.fuelconsumption = Math.max(1, estats.stats.fuelconsumption);
        estats.rarity = this.rarity;
        return estats;
    }
    EngineInputs() {
        const ei = new EngineInputs();
        ei.engine_type = ENGINE_TYPE.PROPELLER;
        ei.RPM_boost = this.rpm_boost;
        ei.compression = this.compression_ratio;
        ei.compressor_count = this.compressor_count;
        ei.compressor_type = this.compressor_type;
        ei.cyl_per_row = this.num_cyl_per_row;
        ei.displacement = this.engine_displacement;
        ei.era_sel = this.era_sel;
        ei.material_fudge = this.material_fudge;
        ei.min_IdealAlt = this.min_IAF;
        ei.name = this.name;
        ei.quality_fudge = this.quality_fudge;
        ei.rows = this.num_rows;
        ei.type = this.cool_sel;
        for (let i = 0; i < ei.upgrades.length; i++)
            ei.upgrades[i] = this.upg_sel[i];
        ei.rarity = this.rarity;
        return ei;
    }
    fromJSON(js) {
        this.engine_displacement = js["displacement"];
        this.compression_ratio = js["compression"];
        this.cool_sel = js["type"];
        this.num_cyl_per_row = js["cyl_per_row"];
        this.num_rows = js["rows"];
        this.rpm_boost = js["RPM_boost"];
        this.era_sel = js["era_sel"];
        this.material_fudge = js["material_fudge"];
        this.quality_fudge = js["quality_fudge"];
        this.compressor_type = js["compressor_type"];
        this.compressor_count = js["compressor_count"];
        this.min_IAF = js["min_IAF"];
        this.upg_sel = BoolArr(js["upgrades"], this.upg_sel.length);
        if (js["rarity"]) {
            this.rarity = js["rarity"];
        }
        else {
            this.rarity = ENGINE_RARITY.CUSTOM;
        }
        return this.EngineStats();
    }
}

;// CONCATENATED MODULE: ./src/EngineBuilder/PulsejetBuilder.ts




class PulsejetBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", cost: 1, drag: 10, mass: 10, fuel: 4, vibe: 2.5, material: 2 },
            { name: "WWI", cost: 0.75, drag: 25, mass: 24, fuel: 3, vibe: 3, material: 3 },
            { name: "Roaring 20s", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
            { name: "Coming Storm", cost: 0.5, drag: 30, mass: 50, fuel: 2, vibe: 4, material: 9 },
            { name: "WWII", cost: 0.25, drag: 40, mass: 100, fuel: 1, vibe: 5, material: 24 },
            { name: "Last Hurrah", cost: 0.1, drag: 50, mass: 150, fuel: 0.7, vibe: 6, material: 50 },
        ];
        this.ValveTable = [
            { name: "Valved", scale: 1, rumble: 1, designcost: 2, reliability: 1 },
            { name: "Valveless", scale: 1.1, rumble: 0.9, designcost: 1, reliability: 3 },
        ];
        this.desired_power = 1;
        this.valve_sel = 0;
        this.era_sel = 0;
        this.build_quality = 1;
        this.overall_quality = 1;
        this.starter = false;
        this.rarity = ENGINE_RARITY.CUSTOM;
    }
    TempMass() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];
        var StarterMass = 0;
        if (this.starter)
            StarterMass = 1;
        const Mass = (this.technical_power / Era.mass) * Valve.scale + StarterMass;
        return Mass;
    }
    CalcMass() {
        return Math.floor(1.0e-6 + this.TempMass()) + 1;
    }
    CalcDrag() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];
        const Drag = (this.technical_power / Era.drag) * Valve.scale + 1;
        return Math.floor(1.0e-6 + this.TempMass() + Drag + 1);
    }
    CalcReliability() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];
        const Reliability = this.technical_power / (Era.material * Valve.reliability * this.overall_quality) - 1;
        return Math.trunc(-Reliability);
    }
    CalcFuelConsumption() {
        const Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.technical_power * Era.fuel);
    }
    CalcRumble() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];
        return Math.floor(1.0e-6 + this.technical_power * Valve.rumble / (2 * Era.vibe));
    }
    CalcCost() {
        const Era = this.EraTable[this.era_sel];
        return Math.floor(1.0e-6 + this.TempMass() * this.build_quality * Era.cost) + 1;
    }
    VerifyValues() {
        this.desired_power = Math.max(1, Math.floor(this.desired_power));
        this.valve_sel = Math.max(0, Math.min(this.ValveTable.length - 1, this.valve_sel));
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.build_quality = Math.max(0.01, this.build_quality);
        this.overall_quality = Math.max(0.01, this.overall_quality);
        this.build_quality = Math.max(this.build_quality, this.overall_quality);
        this.overall_quality = this.build_quality;
    }
    DesignCost() {
        const Era = this.EraTable[this.era_sel];
        const Valve = this.ValveTable[this.valve_sel];
        var StarterCost = 0;
        if (this.starter)
            StarterCost = 3;
        const Cost = this.technical_power * Era.cost / Valve.designcost;
        return Math.floor(1.0e-6 + 1 + this.build_quality * (Cost + StarterCost));
    }
    EngineInputs() {
        const ei = new EngineInputs();
        var valved = "";
        if (this.valve_sel == 0)
            valved = "V";
        ei.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        ei.engine_type = ENGINE_TYPE.PULSEJET;
        ei.era_sel = this.era_sel;
        ei.type = this.valve_sel;
        ei.power = this.desired_power;
        ei.starter = this.starter;
        ei.quality_cost = this.build_quality;
        ei.quality_rely = this.overall_quality;
        ei.rarity = this.rarity;
        return ei;
    }
    EngineStats() {
        const estats = new EngineStats();
        this.VerifyValues();
        var valved = "";
        if (this.valve_sel == 0)
            valved = "V";
        estats.name = "Pulsejet P" + valved + "-" + this.desired_power.toString() + " (" + this.EraTable[this.era_sel].name + ")";
        estats.stats.power = this.desired_power;
        // this.technical_power = Math.floor(1.0e-6 + this.desired_power * 4 / 3);
        this.technical_power = this.desired_power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = this.CalcFuelConsumption();
        estats.rumble = this.CalcRumble();
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 29;
        estats.pulsejet = true;
        estats.stats.era.push({ name: estats.name, era: Localization_lu(num2era(this.era_sel)) });
        estats.rarity = this.rarity;
        return estats;
    }
}

;// CONCATENATED MODULE: ./src/EngineBuilder/TurboBuilder.ts




class TurboBuilder {
    constructor() {
        this.TypeTable = [
            { name: "Turbojet", efficiency: 0, massfactor: 0.8, costfactor: 1 },
            { name: "Turbofan", efficiency: 0, massfactor: 1., costfactor: 1 },
            { name: "Propfan", efficiency: -9, massfactor: 0.8, costfactor: 1 },
            { name: "Turboprop", efficiency: -3, massfactor: 0.8, costfactor: 1 },
        ];
        this.EraTable = [
            { name: "Gen 1 1945-1955", max_temp: 1100, efficiency: -2, costfactor: 0.5 },
            { name: "Gen 1.5 1955-1965", max_temp: 1100, efficiency: -1, costfactor: 0.6 },
            { name: "Gen 2 1965-1975", max_temp: 1400, efficiency: -1, costfactor: 0.7 },
            { name: "Gen 2.5 1975-1985", max_temp: 1400, efficiency: 0, costfactor: 0.8 },
            { name: "Gen 3 1985-1995", max_temp: 1800, efficiency: 0, costfactor: 0.9 },
            { name: "Gen 3.5 1995-2005", max_temp: 1800, efficiency: 1, costfactor: 1.0 },
            { name: "Gen 4 2005-2015", max_temp: 2000, efficiency: 1, costfactor: 1.1 },
            { name: "Gen 4.5 2015-2025", max_temp: 2000, efficiency: 2, costfactor: 1.2 },
            { name: "Gen 0 Himmilgard", max_temp: 800, efficiency: -10, costfactor: 0.5 },
        ];
        this.name = "Default";
        this.era_sel = 0;
        this.type_sel = 0;
        this.fuel_heat_value = 43020;
        this.flow_adjustment = 0;
        this.diameter = 0.89;
        this.compression_ratio = 3.5;
        this.bypass_ratio = 0;
        this.afterburner = false;
        this.rarity = ENGINE_RARITY.CUSTOM;
    }
    TempMass() {
        const Era = this.EraTable[this.era_sel];
        const Type = this.TypeTable[this.type_sel];
        const tmass = Math.log2(this.compression_ratio) * Math.PI * Math.pow(this.diameter / 2, 2) * 1.75 * 361.75 / (1 + this.bypass_ratio / 3) * Type.massfactor;
        return 0.75 * tmass;
    }
    CalcMass() {
        var tmass = this.TempMass();
        //Turbofan fit.  Using list from jet-engines.net and an excel curve to align them.
        if (this.type_sel == 1) {
            tmass = tmass * (0.4833 * Math.log(this.compression_ratio) - 0.3168);
        }
        var mass = tmass / 25 + 95.684 * this.flow_adjustment;
        //Turboprop fit.  Using list from jet-engines.net and an excel curve to align them.
        //Because turboprops have too much variation, some end up negative. So needs to be done here.
        if (this.type_sel == 2 || this.type_sel == 3) {
            const x = 0.5 - this.flow_adjustment;
            mass = Math.abs(mass) * (19.74 * Math.pow(x, 3) - 11.462 * x * x + 1.0666 * x + 0.4333);
        }
        return Math.max(1, Math.floor(1.0e-6 + mass));
    }
    CalcDrag() {
        const Era = this.EraTable[this.era_sel];
        const Type = this.TypeTable[this.type_sel];
        return Math.floor(1.0e-6 + 5 * Math.PI * Math.pow(this.diameter / 2.0, 2));
    }
    CalcReliability() {
        const Era = this.EraTable[this.era_sel];
        const Type = this.TypeTable[this.type_sel];
        const Reliability = -Math.log2(this.compression_ratio) - 20 * this.flow_adjustment;
        return Math.trunc(Reliability + 1);
    }
    CalcStages() {
        const Era = this.EraTable[this.era_sel];
        const Type = this.TypeTable[this.type_sel];
        const M = 0.0;
        const a0 = 340.3;
        const Pa = 108.9; //Ambient Pressure
        const Ta = 288.15; //Ambient Temp
        const Cp = 1.006; //Specific Heat at Constant Pressure
        const y = 1.4; //Specific Heat
        const fan_pressure_ratio = 1.6;
        const area = Math.PI * Math.pow(this.diameter / 2, 2);
        const net_efficiency = 0.8 + (Era.efficiency + Type.efficiency) / 20.0 + this.flow_adjustment;
        const P3 = Pa * this.compression_ratio;
        const T3 = Ta * Math.pow(P3 / Pa, (y - 1) / y);
        const Tr = 1 + (y - 1) / 2 * M * M;
        const Ty = Era.max_temp / Ta;
        const Tc = Math.pow(this.compression_ratio, 1 - 1 / y);
        const ST11 = a0 * (Math.sqrt((2 * Tr) / (y - 1) * (Ty / (Tr * Tc) - 1) * (Tc - 1) + Ty / (Tr * Tc) * M * M) - M) * net_efficiency / 1000;
        const Tcp = Math.pow(fan_pressure_ratio, 1 - 1 / y);
        const ST13 = a0 * (Math.sqrt(2 / (y - 1) * (Tr * Tcp - 1)) - M) * net_efficiency / 1000;
        const f = (Cp * Ta / this.fuel_heat_value) * (Era.max_temp / Ta - T3 / Ta);
        var ST = ST11 / (1 + this.bypass_ratio) + this.bypass_ratio * ST13 / (1 + this.bypass_ratio);
        var TSFC11 = f / ((1 + this.bypass_ratio) * ST) * 1000;
        const C2 = Pa * area * this.MFP(1) / ((1 + f));
        var mc2 = this.compression_ratio * C2 * Math.sqrt(1 / Era.max_temp) * net_efficiency;
        if (!isFinite(ST) || !isFinite(mc2) || !isFinite(TSFC11) || ST < 0 || mc2 < 0 || TSFC11 < 0) {
            ST = 0;
            mc2 = 0;
            TSFC11 = 0;
        }
        return { thrust: ST * mc2, fuel: TSFC11 * ST * mc2 };
    }
    MFP(M) {
        const R = 287.058 / 1000; //Gas Constant
        const y = 1.4; //Specific Heat
        return Math.sqrt(y / R) * M * Math.pow(1 + (y - 1) / 2 * M * M, (y + 1) / (2 * (y - 1)));
    }
    CalcCost() {
        const Era = this.EraTable[this.era_sel];
        const Type = this.TypeTable[this.type_sel];
        return Math.floor(1.0e-6 + this.TempMass() * 0.5 * (1 + this.flow_adjustment) * Era.costfactor * Type.costfactor) + 1;
    }
    VerifyValues() {
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.type_sel = Math.max(0, Math.min(this.TypeTable.length - 1, this.type_sel));
        this.flow_adjustment = Math.max(-0.5, Math.min(0.5, this.flow_adjustment));
        this.diameter = Math.max(0.1, this.diameter);
        this.compression_ratio = Math.max(1, this.compression_ratio);
        this.bypass_ratio = Math.max(0, this.bypass_ratio);
        this.bypass_ratio = Math.min(20, this.bypass_ratio);
        if (this.type_sel > 2) {
            this.afterburner = false;
        }
    }
    EngineInputs() {
        const ei = new EngineInputs();
        ei.name = this.name;
        ei.engine_type = ENGINE_TYPE.TURBOMACHINERY;
        ei.era_sel = this.era_sel;
        ei.type = this.type_sel;
        ei.flow_adjustment = this.flow_adjustment;
        ei.diameter = this.diameter;
        ei.compression_ratio = this.compression_ratio;
        ei.bypass_ratio = this.bypass_ratio;
        ei.upgrades[0] = this.afterburner;
        ei.rarity = this.rarity;
        return ei;
    }
    GetPitchSpeed() {
        if (this.bypass_ratio >= 8)
            return 1;
        if (this.bypass_ratio >= 3.5)
            return 1.1;
        if (this.bypass_ratio >= 1)
            return 1.2;
        return 1.3;
    }
    EngineStats() {
        const estats = new EngineStats();
        this.VerifyValues();
        const tf = this.CalcStages();
        this.kN = tf.thrust;
        this.tsfc = tf.fuel / tf.thrust;
        estats.name = this.name;
        estats.stats.power = Math.round(tf.thrust * 1000 / 89);
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.fuelconsumption = Math.round(10 * 20 * tf.fuel / 1000);
        estats.rumble = 0;
        estats.stats.cost = this.CalcCost();
        estats.overspeed = 100;
        estats.altitude = 59;
        if (this.era_sel == 8) {
            estats.stats.era.push({ name: estats.name, era: Localization_lu(num2era(-1)) });
        }
        else {
            estats.stats.era.push({ name: estats.name, era: Localization_lu(num2era(5)) });
        }
        estats.stats.pitchspeed = this.GetPitchSpeed();
        estats.rarity = this.rarity;
        return estats;
    }
}

;// CONCATENATED MODULE: ./src/EngineBuilder/ElectricBuilder.ts




class ElectricBuilder {
    constructor() {
        this.EraTable = [
            { name: "Pioneer", draw: 3, drawfactor: 2 / 5, massfactor: 2 / 5, reliability: -1, costfactor: 1 / 2.5, overspeed: 20, },
            { name: "WWI", draw: 1, drawfactor: 2 / 5, massfactor: 1 / 3, reliability: 0, costfactor: 1 / 2.25, overspeed: 25, },
            { name: "Roaring 20s", draw: 1, drawfactor: 2 / 7, massfactor: 2 / 7, reliability: 1, costfactor: 1 / 2, overspeed: 30, },
            { name: "Coming Storm", draw: 0, drawfactor: 2 / 7, massfactor: 1 / 4, reliability: 2, costfactor: 1 / 1.9, overspeed: 35, },
            { name: "WWII", draw: 0, drawfactor: 1 / 4, massfactor: 1 / 5, reliability: 3, costfactor: 1 / 1.8, overspeed: 40, },
            { name: "Last Hurrah", draw: 0, drawfactor: 1 / 5, massfactor: 1 / 6, reliability: 4, costfactor: 1 / 1.75, overspeed: 45, },
        ];
        this.Winding = [
            { name: "Aluminum", drawmod: 1.1, mass: -2, drag: 1, costfactor: 1, reliabilty: 0 },
            { name: "Copper", drawmod: 1, mass: 0, drag: 0, costfactor: 1, reliabilty: 0 },
            { name: "Silver", drawmod: 0.95, mass: 1, drag: 0, costfactor: 1.1, reliabilty: 0 },
            { name: "Electrum", drawmod: 0.9, mass: 2, drag: 0, costfactor: 1.3, reliabilty: 1 },
            { name: "Platinum", drawmod: 0.75, mass: 3, drag: 0, costfactor: 2, reliabilty: 2 },
            { name: "Screamer Sinew", drawmod: 0.9, mass: 0, drag: 1, costfactor: 1.75, reliabilty: 4 },
            { name: "Lightning Sprite Ephemera", drawmod: 0.5, mass: -2, drag: -2, costfactor: 2, reliabilty: -3 },
        ];
        this.name = "Default";
        this.era_sel = 0;
        this.winding_sel = 0;
        this.power = 1;
        this.chonk = 1;
        this.quality_fudge = 1;
    }
    EraMass() {
        const Era = this.EraTable[this.era_sel];
        const EraMass = Math.floor(1.0e-6 + Era.massfactor * this.power);
        return EraMass;
    }
    CalcMass() {
        const Winding = this.Winding[this.winding_sel];
        const Mass = Math.max(0, Math.floor(1.0e-6 + this.EraMass() + Winding.mass));
        return Mass;
    }
    CalcDrag() {
        const RawDrag = this.power / 10;
        const WindingDrag = this.Winding[this.winding_sel].drag;
        return Math.max(1, Math.floor(1.0e-6 + 1 + RawDrag + this.chonk + WindingDrag));
    }
    CalcOverspeed() {
        const ChonkSpeed = this.chonk / 2;
        const QualitySpeed = 7.5 * (this.quality_fudge - 1);
        return Math.ceil(-1.0e-6 + this.EraTable[this.era_sel].overspeed - ChonkSpeed + QualitySpeed);
    }
    CalcDraw() {
        const Era = this.EraTable[this.era_sel];
        const Winding = this.Winding[this.winding_sel];
        const era_draw = Era.draw + Math.ceil(-1.0e-6 + this.power * Era.drawfactor);
        return Math.ceil(-1.0e-6 + era_draw * Winding.drawmod);
    }
    CalcReliability() {
        const Era = this.EraTable[this.era_sel];
        const Winding = this.Winding[this.winding_sel];
        const power_rely = this.power / 10;
        const quality_rely = 5 * (this.quality_fudge - 1);
        return Math.trunc(1.0e-6 + Era.reliability + this.chonk - power_rely + quality_rely) + Winding.reliabilty;
    }
    CalcTorque() {
        const Torque = 1 + this.EraMass() / 10 + this.chonk / 4;
        return Math.max(1, Math.floor(1.0e-6 + Torque));
    }
    CalcCost() {
        const Era = this.EraTable[this.era_sel];
        const Winding = this.Winding[this.winding_sel];
        const era_cost = Era.costfactor * this.power;
        const base_cost = Math.ceil(-1.0e-6 + era_cost * Math.max(0.5, this.quality_fudge));
        return Math.ceil(-1.0e-6 + base_cost * Winding.costfactor);
    }
    VerifyValues() {
        this.era_sel = Math.max(0, Math.min(this.EraTable.length - 1, this.era_sel));
        this.winding_sel = Math.max(0, Math.min(this.Winding.length - 1, this.winding_sel));
        this.power = Math.max(1, this.power);
        this.power = Math.floor(1.0e-6 + this.power);
        this.chonk = Math.floor(1.0e-6 + this.chonk);
        this.chonk = Math.max(-10, this.chonk);
        this.chonk = Math.min(10.0, this.chonk);
        this.quality_fudge = Math.max(0.5, this.quality_fudge);
        this.quality_fudge = Math.min(2.0, this.quality_fudge);
    }
    EngineStats() {
        var estats = new EngineStats();
        estats.name = this.name;
        this.VerifyValues();
        estats.stats.power = this.power;
        estats.stats.mass = this.CalcMass();
        estats.stats.drag = this.CalcDrag();
        estats.stats.reliability = this.CalcReliability();
        estats.stats.cooling = 0;
        estats.oiltank = false;
        estats.overspeed = this.CalcOverspeed();
        estats.stats.fuelconsumption = 0;
        estats.stats.charge = -this.CalcDraw();
        estats.altitude = 100;
        estats.torque = this.CalcTorque();
        estats.stats.cost = this.CalcCost();
        estats.pulsejet = false;
        estats.rumble = 0;
        estats.stats.era.push({ name: this.name, era: Localization_lu(num2era(this.era_sel)) });
        return estats;
    }
    EngineInputs() {
        var ei = new EngineInputs();
        ei.engine_type = ENGINE_TYPE.ELECTRIC;
        ei.name = this.name;
        ei.power = this.power;
        ei.era_sel = this.era_sel;
        ei.winding_sel = this.winding_sel;
        ei.material_fudge = this.chonk;
        ei.quality_fudge = this.quality_fudge;
        return ei;
    }
}

;// CONCATENATED MODULE: ./src/impl/EngineInputs.ts





var ENGINE_TYPE;
(function (ENGINE_TYPE) {
    ENGINE_TYPE[ENGINE_TYPE["PROPELLER"] = 0] = "PROPELLER";
    ENGINE_TYPE[ENGINE_TYPE["PULSEJET"] = 1] = "PULSEJET";
    ENGINE_TYPE[ENGINE_TYPE["TURBOMACHINERY"] = 2] = "TURBOMACHINERY";
    ENGINE_TYPE[ENGINE_TYPE["ELECTRIC"] = 3] = "ELECTRIC";
})(ENGINE_TYPE || (ENGINE_TYPE = {}));
var ENGINE_RARITY;
(function (ENGINE_RARITY) {
    ENGINE_RARITY[ENGINE_RARITY["CUSTOM"] = 0] = "CUSTOM";
    ENGINE_RARITY[ENGINE_RARITY["COMMON"] = 1] = "COMMON";
    ENGINE_RARITY[ENGINE_RARITY["RARE"] = 2] = "RARE";
    ENGINE_RARITY[ENGINE_RARITY["LEGENDARY"] = 3] = "LEGENDARY";
})(ENGINE_RARITY || (ENGINE_RARITY = {}));
class EngineInputs {
    constructor(js) {
        this.name = "Default";
        this.engine_type = ENGINE_TYPE.PROPELLER;
        this.type = 0;
        this.era_sel = 0;
        this.rarity = ENGINE_RARITY.CUSTOM;
        this.displacement = 0;
        this.compression = 0;
        this.cyl_per_row = 0;
        this.rows = 0;
        this.RPM_boost = 0;
        this.material_fudge = 0;
        this.quality_fudge = 0;
        this.compressor_type = 0;
        this.compressor_count = 0;
        this.min_IdealAlt = 0;
        this.upgrades = [...Array(4).fill(false)];
        this.power = 0;
        this.quality_cost = 0;
        this.quality_rely = 0;
        this.starter = false;
        this.flow_adjustment = 0;
        this.diameter = 0;
        this.compression_ratio = 0;
        this.bypass_ratio = 0;
        this.winding_sel = 0;
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    type: this.type,
                    era_sel: this.era_sel,
                    displacement: this.displacement,
                    compression: this.compression,
                    cyl_per_row: this.cyl_per_row,
                    rows: this.rows,
                    RPM_boost: this.RPM_boost,
                    material_fudge: this.material_fudge,
                    quality_fudge: this.quality_fudge,
                    compressor_type: this.compressor_type,
                    compressor_count: this.compressor_count,
                    min_IAF: this.min_IdealAlt,
                    upgrades: this.upgrades,
                    rarity: this.rarity,
                };
            }
            case ENGINE_TYPE.PULSEJET: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    type: this.type,
                    era_sel: this.era_sel,
                    power: this.power,
                    quality_cost: this.quality_cost,
                    quality_rely: this.quality_rely,
                    starter: this.starter,
                    rarity: this.rarity,
                };
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    type: this.type,
                    era_sel: this.era_sel,
                    flow_adjustment: this.flow_adjustment,
                    diameter: this.diameter,
                    compression_ratio: this.compression_ratio,
                    bypass_ratio: this.bypass_ratio,
                    upgrades: this.upgrades,
                    rarity: this.rarity,
                };
            }
            case ENGINE_TYPE.ELECTRIC: {
                return {
                    name: this.name,
                    engine_type: this.engine_type,
                    power: this.power,
                    era_sel: this.era_sel,
                    winding_sel: this.winding_sel,
                    diameter: this.diameter,
                    material_fudge: this.material_fudge,
                    quality_fudge: this.quality_fudge,
                };
            }
            default:
                throw "EngineInputs.toJSON: Oh dear, you have a new engine type.";
        }
    }
    fromJSON(js) {
        this.name = js["name"];
        this.engine_type = js["engine_type"];
        this.type = js["type"];
        this.era_sel = js["era_sel"];
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                this.displacement = js["displacement"];
                this.compression = js["compression"];
                this.cyl_per_row = js["cyl_per_row"];
                this.rows = js["rows"];
                this.RPM_boost = js["RPM_boost"];
                this.material_fudge = js["material_fudge"];
                this.quality_fudge = js["quality_fudge"];
                this.compressor_type = js["compressor_type"];
                this.compressor_count = js["compressor_count"];
                this.min_IdealAlt = js["min_IAF"];
                this.upgrades = BoolArr(js["upgrades"], this.upgrades.length);
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                this.power = js["power"];
                this.quality_cost = js["quality_cost"];
                this.quality_rely = js["quality_rely"];
                this.starter = js["starter"];
                break;
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                this.flow_adjustment = js["flow_adjustment"];
                this.diameter = js["diameter"];
                this.compression_ratio = js["compression_ratio"];
                this.bypass_ratio = js["bypass_ratio"];
                this.upgrades = js["upgrades"];
                break;
            }
            case ENGINE_TYPE.ELECTRIC: {
                this.power = js["power"];
                this.winding_sel = js["winding_sel"];
                this.material_fudge = js["material_fudge"];
                this.quality_fudge = js["quality_fudge"];
                break;
            }
            default:
                throw "EngineInputs.fromJSON: Oh dear, you have a new engine type.";
        }
        if (js["rarity"]) {
            this.rarity = js["rarity"];
        }
        else {
            this.rarity = ENGINE_RARITY.CUSTOM;
        }
    }
    serialize(s) {
        s.PushString(this.name);
        s.PushNum(this.engine_type);
        s.PushNum(this.type);
        s.PushNum(this.era_sel);
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                s.PushFloat(this.displacement);
                s.PushFloat(this.compression);
                s.PushNum(this.cyl_per_row);
                s.PushNum(this.rows);
                s.PushFloat(this.RPM_boost);
                s.PushFloat(this.material_fudge);
                s.PushFloat(this.quality_fudge);
                s.PushNum(this.compressor_type);
                s.PushNum(this.compressor_count);
                s.PushNum(this.min_IdealAlt);
                s.PushBoolArr(this.upgrades);
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                s.PushNum(this.power);
                s.PushFloat(this.quality_cost);
                s.PushFloat(this.quality_rely);
                s.PushBool(this.starter);
                break;
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                s.PushFloat(this.flow_adjustment);
                s.PushFloat(this.diameter);
                s.PushFloat(this.compression_ratio);
                s.PushFloat(this.bypass_ratio);
                s.PushBoolArr(this.upgrades);
                break;
            }
            case ENGINE_TYPE.ELECTRIC: {
                s.PushNum(this.power);
                s.PushNum(this.winding_sel);
                s.PushNum(this.material_fudge);
                s.PushFloat(this.quality_fudge);
                break;
            }
            default:
                throw "EngineInputs.serialize: Oh dear, you have a new engine type.";
        }
        s.PushNum(this.rarity);
    }
    deserialize(d) {
        this.name = d.GetString();
        this.engine_type = d.GetNum();
        this.type = d.GetNum();
        this.era_sel = d.GetNum();
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                this.displacement = d.GetFloat();
                this.compression = d.GetFloat();
                this.cyl_per_row = d.GetNum();
                this.rows = d.GetNum();
                this.RPM_boost = d.GetFloat();
                this.material_fudge = d.GetFloat();
                this.quality_fudge = d.GetFloat();
                this.compressor_type = d.GetNum();
                this.compressor_count = d.GetNum();
                this.min_IdealAlt = d.GetNum();
                this.upgrades = d.GetBoolArr(this.upgrades.length);
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                this.power = d.GetNum();
                this.quality_cost = d.GetFloat();
                this.quality_rely = d.GetFloat();
                this.starter = d.GetBool();
                break;
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                this.flow_adjustment = d.GetFloat();
                this.diameter = d.GetFloat();
                this.compression_ratio = d.GetFloat();
                this.bypass_ratio = d.GetFloat();
                this.upgrades = d.GetBoolArr(this.upgrades.length);
                break;
            }
            case ENGINE_TYPE.ELECTRIC: {
                this.power = d.GetNum();
                this.winding_sel = d.GetNum();
                this.material_fudge = d.GetNum();
                this.quality_fudge = d.GetFloat();
                break;
            }
            default:
                throw "EngineInputs.deserialize: Oh dear, you have a new engine type.";
        }
        if (d.version > 12.35) {
            this.rarity = d.GetNum();
        }
        else {
            this.rarity = ENGINE_RARITY.CUSTOM;
        }
    }
    PartStats() {
        switch (this.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                const eb = new EngineBuilder();
                eb.name = this.name;
                eb.cool_sel = this.type;
                eb.era_sel = this.era_sel;
                eb.engine_displacement = this.displacement;
                eb.compression_ratio = this.compression;
                eb.num_cyl_per_row = this.cyl_per_row;
                eb.num_rows = this.rows;
                eb.rpm_boost = this.RPM_boost;
                eb.material_fudge = this.material_fudge;
                eb.quality_fudge = this.quality_fudge;
                eb.compressor_type = this.compressor_type;
                eb.compressor_count = this.compressor_count;
                eb.min_IAF = this.min_IdealAlt;
                eb.upg_sel = this.upgrades;
                eb.rarity = this.rarity;
                return eb.EngineStats();
            }
            case ENGINE_TYPE.PULSEJET: {
                const pb = new PulsejetBuilder();
                pb.valve_sel = this.type;
                pb.era_sel = this.era_sel;
                pb.desired_power = this.power;
                pb.build_quality = this.quality_cost;
                pb.overall_quality = this.quality_rely;
                pb.starter = this.starter;
                pb.rarity = this.rarity;
                const stats = pb.EngineStats();
                this.name = stats.name;
                return stats;
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                const tb = new TurboBuilder();
                tb.type_sel = this.type;
                tb.era_sel = this.era_sel;
                tb.flow_adjustment = this.flow_adjustment;
                tb.diameter = this.diameter;
                tb.compression_ratio = this.compression_ratio;
                tb.bypass_ratio = this.bypass_ratio;
                tb.afterburner = this.upgrades[0];
                tb.name = this.name;
                tb.rarity = this.rarity;
                return tb.EngineStats();
            }
            case ENGINE_TYPE.ELECTRIC: {
                const ecb = new ElectricBuilder();
                ecb.era_sel = this.era_sel;
                ecb.winding_sel = this.winding_sel;
                ecb.power = this.power;
                ecb.chonk = this.material_fudge;
                ecb.quality_fudge = this.quality_fudge;
                ecb.name = this.name;
                const stats = ecb.EngineStats();
                return stats;
            }
            default:
                throw "EngineInputs.PartStats: Oh dear, you have a new engine type.";
        }
    }
    Equal(other) {
        return this.name == other.name;
    }
    Clone() {
        const n = new EngineInputs();
        n.name = this.name;
        n.engine_type = this.engine_type;
        n.type = this.type;
        n.era_sel = this.era_sel;
        n.displacement = this.displacement;
        n.compression = this.compression;
        n.cyl_per_row = this.cyl_per_row;
        n.rows = this.rows;
        n.RPM_boost = this.RPM_boost;
        n.material_fudge = this.material_fudge;
        n.quality_fudge = this.quality_fudge;
        n.compressor_type = this.compressor_type;
        n.compressor_count = this.compressor_count;
        n.min_IdealAlt = this.min_IdealAlt;
        n.power = this.power;
        n.quality_cost = this.quality_cost;
        n.quality_rely = this.quality_rely;
        n.starter = this.starter;
        for (let i = 0; i < this.upgrades.length; i++) {
            n.upgrades[i] = this.upgrades[i];
        }
        n.flow_adjustment = this.flow_adjustment;
        n.diameter = this.diameter;
        n.compression_ratio = this.compression_ratio;
        n.bypass_ratio = this.bypass_ratio;
        n.winding_sel = this.winding_sel;
        n.rarity = this.rarity;
        return n;
    }
}

;// CONCATENATED MODULE: ./src/impl/EngineStats.ts


var DRIVE_TYPE;
(function (DRIVE_TYPE) {
    DRIVE_TYPE[DRIVE_TYPE["PROPELLER"] = 0] = "PROPELLER";
    DRIVE_TYPE[DRIVE_TYPE["TURBINE"] = 1] = "TURBINE";
    DRIVE_TYPE[DRIVE_TYPE["PULSEJET"] = 2] = "PULSEJET";
})(DRIVE_TYPE || (DRIVE_TYPE = {}));
;
class EngineStats {
    constructor(js) {
        this.name = "Default";
        this.overspeed = 0;
        this.altitude = 0;
        this.torque = 0;
        this.rumble = 0;
        this.oiltank = false;
        this.pulsejet = false;
        this.stats = new Stats();
        this.rarity = ENGINE_RARITY.CUSTOM;
        if (js) {
            this.fromJSON(js);
        }
    }
    toJSON() {
        return {
            name: this.name,
            overspeed: this.overspeed,
            altitude: this.altitude,
            torque: this.torque,
            rumble: this.rumble,
            oiltank: this.oiltank,
            pulsejet: this.pulsejet,
            rarity: this.rarity,
            ...this.stats.toJSON()
        };
    }
    fromJSON(js, json_version = 9999) {
        if (js["name"])
            this.name = js["name"];
        if (js["overspeed"])
            this.overspeed = js["overspeed"];
        if (js["altitude"])
            this.altitude = js["altitude"];
        if (js["torque"])
            this.torque = js["torque"];
        if (js["rumble"])
            this.rumble = js["rumble"];
        if (js["oiltank"])
            this.oiltank = js["oiltank"];
        if (js["pulsejet"])
            this.pulsejet = js["pulsejet"];
        if (js["rarity"])
            this.rarity = js["rarity"];
        this.stats = new Stats(js);
    }
    serialize(s) {
        s.PushString(this.name);
        s.PushNum(this.overspeed);
        s.PushNum(this.altitude);
        s.PushNum(this.torque);
        s.PushNum(this.rumble);
        s.PushBool(this.oiltank);
        s.PushBool(this.pulsejet);
        s.PushNum(this.rarity);
        this.stats.serialize(s);
    }
    deserialize(d) {
        this.name = d.GetString();
        this.overspeed = d.GetNum();
        this.altitude = d.GetNum();
        this.torque = d.GetNum();
        this.rumble = d.GetNum();
        this.oiltank = d.GetBool();
        this.pulsejet = d.GetBool();
        if (d.version > 12.35) {
            this.rarity = d.GetNum();
        }
        this.stats.deserialize(d);
    }
    Clone() {
        const c = new EngineStats();
        c.fromJSON(JSON.parse(JSON.stringify(this.toJSON())));
        return c;
    }
    Equal(other) {
        return this.stats.Equal(other.stats)
            && this.overspeed == other.overspeed
            && this.altitude == other.altitude
            && this.torque == other.torque
            && this.rumble == other.rumble
            && this.oiltank == other.oiltank
            && this.pulsejet == other.pulsejet
            && this.rarity == other.rarity;
    }
    Verify() {
        if (this.oiltank) {
            this.stats.cooling = 0;
        }
        this.PulseJetCheck();
    }
    PulseJetCheck() {
        if (this.pulsejet) {
            this.stats.cooling = 0;
            this.overspeed = 100;
            this.altitude = 3;
            this.torque = 0;
        }
        else {
            this.rumble = 0;
        }
    }
}

;// CONCATENATED MODULE: ./src/engines.json
const engines_namespaceObject = JSON.parse('{"l":[{"name":"Custom","engines":[{"name":"Bentley BR.1 150hp","engine_type":0,"type":2,"era_sel":1,"displacement":17.1,"compression":4.9,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Renault V8 70hp","engine_type":0,"type":0,"era_sel":1,"displacement":7,"compression":4,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1.4,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"Early-WWI","engines":[{"name":"Aeromarine K-6 100hp","engine_type":0,"type":0,"era_sel":1,"displacement":7.36,"compression":4.7,"cyl_per_row":1,"rows":6,"RPM_boost":1.1,"material_fudge":1.2,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Anzani 10 Cylinder 110hp","engine_type":0,"type":1,"era_sel":1,"displacement":12,"compression":4.85,"cyl_per_row":5,"rows":2,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Anzani 10 Cylinder 80hp","engine_type":0,"type":1,"era_sel":1,"displacement":8.27,"compression":4.85,"cyl_per_row":5,"rows":2,"RPM_boost":0.9,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Anzani 6 cylinder 60hp","engine_type":0,"type":1,"era_sel":1,"displacement":6.23,"compression":4.5,"cyl_per_row":3,"rows":2,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Argus As II 120hp","engine_type":0,"type":0,"era_sel":1,"displacement":10.353,"compression":5,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Austro-Daimler 6 120hp","engine_type":0,"type":0,"era_sel":1,"displacement":13.8,"compression":4.85,"cyl_per_row":1,"rows":6,"RPM_boost":0.65,"material_fudge":1.1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Benz Bz.III 150hp","engine_type":0,"type":0,"era_sel":1,"displacement":15.4,"compression":4.7,"cyl_per_row":1,"rows":6,"RPM_boost":0.75,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Clerget 7Z 95hp","engine_type":0,"type":2,"era_sel":1,"displacement":11.88,"compression":4.3,"cyl_per_row":7,"rows":1,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Clerget 9Bf 140hp","engine_type":0,"type":2,"era_sel":1,"displacement":17.46,"compression":4.85,"cyl_per_row":9,"rows":1,"RPM_boost":0.9,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome 14 Double Lambda 160hp","engine_type":0,"type":2,"era_sel":1,"displacement":23.8,"compression":3.87,"cyl_per_row":7,"rows":2,"RPM_boost":1.2,"material_fudge":0.8,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome 7 Lambda 70hp","engine_type":0,"type":2,"era_sel":1,"displacement":11.9,"compression":3.75,"cyl_per_row":7,"rows":1,"RPM_boost":1.1,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome 7 Lambda 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":11.9,"compression":3.87,"cyl_per_row":7,"rows":1,"RPM_boost":1.2,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome 7 Omega 50hp","engine_type":0,"type":2,"era_sel":0,"displacement":7.7,"compression":4,"cyl_per_row":7,"rows":1,"RPM_boost":1.49,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome monosoupape 9B 100hp","engine_type":0,"type":2,"era_sel":1,"displacement":16.28,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Le Rhone 9C 90hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.89,"compression":4.8,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1.1,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Mercedes D.II 120hp","engine_type":0,"type":0,"era_sel":1,"displacement":9.4,"compression":4.5,"cyl_per_row":1,"rows":6,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Mercedes D.III 150hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":4.3,"cyl_per_row":1,"rows":6,"RPM_boost":0.95,"material_fudge":0.9,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"RAF 1a 90hp","engine_type":0,"type":0,"era_sel":1,"displacement":9.88,"compression":4.3,"cyl_per_row":2,"rows":4,"RPM_boost":0.9,"material_fudge":1.3,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"U.I 100hp","engine_type":0,"type":2,"era_sel":1,"displacement":16.28,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"U.I 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":15.84,"compression":4.85,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"Late-WWI","engines":[{"name":"Bentley BR.2 230hp","engine_type":0,"type":2,"era_sel":1,"displacement":24.93,"compression":5.2,"cyl_per_row":9,"rows":1,"RPM_boost":0.9,"material_fudge":0.8,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Clerget 11EB 200hp","engine_type":0,"type":2,"era_sel":1,"displacement":21.49,"compression":5.1,"cyl_per_row":11,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Clerget 16X 420hp","engine_type":0,"type":0,"era_sel":1,"displacement":32.53333333,"compression":5,"cyl_per_row":4,"rows":4,"RPM_boost":0.87,"material_fudge":0.6,"quality_fudge":1.5,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hispano-Suiza 8F 300hp","engine_type":0,"type":0,"era_sel":1,"displacement":18.4,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":0.98,"material_fudge":0.7,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Mercedes D.IIIav 200hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":4.64,"cyl_per_row":1,"rows":6,"RPM_boost":1.05,"material_fudge":0.9,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Napier Lion II 480hp \'18","engine_type":0,"type":0,"era_sel":1,"displacement":24,"compression":5.8,"cyl_per_row":3,"rows":4,"RPM_boost":1,"material_fudge":0.9,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Pulsejet PV-15 (WWI)","engine_type":1,"type":0,"era_sel":1,"power":15,"quality_cost":1,"quality_rely":1,"starter":false},{"name":"Rolls-Royce Eagle III 250hp","engine_type":0,"type":0,"era_sel":1,"displacement":24,"compression":4.9,"cyl_per_row":2,"rows":6,"RPM_boost":0.75,"material_fudge":0.7,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Rolls-Royce Eagle VIII 360hp","engine_type":0,"type":0,"era_sel":1,"displacement":20,"compression":6,"cyl_per_row":2,"rows":6,"RPM_boost":0.85,"material_fudge":0.7,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Rolls-Royce Hawk 110hp","engine_type":0,"type":0,"era_sel":1,"displacement":7.41,"compression":5.1,"cyl_per_row":1,"rows":6,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Sunbeam Dyak 100hp","engine_type":0,"type":0,"era_sel":1,"displacement":8.800000002,"compression":5,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":0.9,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Ur.III 150hp","engine_type":0,"type":2,"era_sel":1,"displacement":17.6,"compression":5,"cyl_per_row":11,"rows":1,"RPM_boost":0.9,"material_fudge":1,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"Mid-WWI","engines":[{"name":"Argus As III 190hp","engine_type":0,"type":0,"era_sel":1,"displacement":15.9,"compression":5,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":0.6,"quality_fudge":1.5,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Austro-Daimler 6 200hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":5,"cyl_per_row":1,"rows":6,"RPM_boost":0.9,"material_fudge":0.9,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Beardmore 160hp","engine_type":0,"type":0,"era_sel":1,"displacement":16.635,"compression":4.5,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Bz.IV 200hp","engine_type":0,"type":0,"era_sel":1,"displacement":18.6,"compression":4.9,"cyl_per_row":1,"rows":6,"RPM_boost":0.75,"material_fudge":0.9,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Clerget 9B 130hp","engine_type":0,"type":2,"era_sel":1,"displacement":16.2,"compression":4.85,"cyl_per_row":9,"rows":1,"RPM_boost":0.9,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Cosmos Mercury","engine_type":0,"type":1,"era_sel":1,"displacement":19.6,"compression":5.3,"cyl_per_row":7,"rows":2,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":0.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Curtiss K-12 375hp","engine_type":0,"type":0,"era_sel":1,"displacement":18.77,"compression":5,"cyl_per_row":2,"rows":6,"RPM_boost":1.33,"material_fudge":0.8,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Curtiss OXX-6","engine_type":0,"type":0,"era_sel":1,"displacement":9.3,"compression":4.92,"cyl_per_row":2,"rows":4,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Fiat A.12 200hp","engine_type":0,"type":0,"era_sel":1,"displacement":21.6,"compression":4.5,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome 9B Monosoupape 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":15.84,"compression":4.85,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Gnome 9N Monosoupape 160hp","engine_type":0,"type":2,"era_sel":1,"displacement":15.84,"compression":5.1,"cyl_per_row":9,"rows":1,"RPM_boost":1.05,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hispano-Suiza 8Aa 150hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":4.8,"cyl_per_row":2,"rows":4,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hispano-Suiza 8Ab 180hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hispano-Suiza 8B 200hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hispano-Suiza 8Bc 220hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.2,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Le Rhone 9Ja 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":14.4,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Le Rhone 9Jb 130hp","engine_type":0,"type":2,"era_sel":1,"displacement":14.4,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Liberty L-12 400hp","engine_type":0,"type":0,"era_sel":2,"displacement":27,"compression":5.4,"cyl_per_row":2,"rows":6,"RPM_boost":0.64,"material_fudge":0.6,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Lorraine 12Da 400hp","engine_type":0,"type":0,"era_sel":1,"displacement":24.4,"compression":5,"cyl_per_row":2,"rows":6,"RPM_boost":1.1,"material_fudge":0.7,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Mercedes D.IIIa 170hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":4.5,"cyl_per_row":1,"rows":6,"RPM_boost":0.95,"material_fudge":0.9,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Mercedes D.IIIaü 180hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":4.64,"cyl_per_row":1,"rows":6,"RPM_boost":0.95,"material_fudge":0.9,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Mercedes D.IVa 250hp","engine_type":0,"type":0,"era_sel":1,"displacement":21.6,"compression":4.94,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Rolls-Royce Falcon III 290hp","engine_type":0,"type":0,"era_sel":1,"displacement":14.4,"compression":5.3,"cyl_per_row":2,"rows":6,"RPM_boost":1.2,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Rolls-Royce Hawk 80hp","engine_type":0,"type":0,"era_sel":1,"displacement":7.41,"compression":5.1,"cyl_per_row":1,"rows":6,"RPM_boost":0.75,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Sunbeam Arab 208hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.76,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1.2,"quality_fudge":0.9,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Sunbeam Maori II 260hp","engine_type":0,"type":0,"era_sel":1,"displacement":12.27,"compression":5.3,"cyl_per_row":2,"rows":6,"RPM_boost":1.3,"material_fudge":1.7,"quality_fudge":0.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Ur.II 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":14.4,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"Pre-WWI","engines":[{"name":"Mercedes E4F 70hp","engine_type":0,"type":0,"era_sel":1,"displacement":6.3,"compression":4,"cyl_per_row":1,"rows":4,"RPM_boost":1.2,"material_fudge":1.3,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"Coming Storm","engines":[{"name":"Allison V-1710-85 1200hp","engine_type":0,"type":0,"era_sel":3,"displacement":28,"compression":6.65,"cyl_per_row":2,"rows":6,"RPM_boost":0.9,"material_fudge":1,"quality_fudge":0.8,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Bristol Pegasus XVIII 835hp","engine_type":0,"type":1,"era_sel":2,"displacement":28.7,"compression":6.25,"cyl_per_row":9,"rows":1,"RPM_boost":0.95,"material_fudge":1.2,"quality_fudge":0.8,"compressor_type":2,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Daimler-Benz 601ARJ 1775hp","engine_type":0,"type":0,"era_sel":3,"displacement":33.93,"compression":6.9,"cyl_per_row":2,"rows":6,"RPM_boost":0.84,"material_fudge":0.6,"quality_fudge":0.7,"compressor_type":2,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,true,false]}]},{"name":"Roaring 20s","engines":[{"name":"Argus As 5 1500hp","engine_type":0,"type":0,"era_sel":2,"displacement":94.1,"compression":5.6,"cyl_per_row":6,"rows":4,"RPM_boost":0.638,"material_fudge":0.4,"quality_fudge":1.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Bréguet Quadrimoteur Type B H-32 970hp","engine_type":0,"type":0,"era_sel":2,"displacement":48.64,"compression":5,"cyl_per_row":4,"rows":8,"RPM_boost":1,"material_fudge":0.7,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Napier Lion II 480hp \'20","engine_type":0,"type":0,"era_sel":2,"displacement":24,"compression":5.8,"cyl_per_row":3,"rows":4,"RPM_boost":0.75,"material_fudge":0.9,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Napier Lion XI 580hp","engine_type":0,"type":0,"era_sel":2,"displacement":24,"compression":6,"cyl_per_row":4,"rows":3,"RPM_boost":1,"material_fudge":1.1,"quality_fudge":0.9,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"WWII","engines":[{"name":"Klimov M-105PF 1230hp","engine_type":0,"type":0,"era_sel":3,"displacement":35.101,"compression":7,"cyl_per_row":2,"rows":6,"RPM_boost":0.55,"material_fudge":0.6,"quality_fudge":1.4,"compressor_type":2,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Rolls Royce Merlin 46 930hp","engine_type":0,"type":0,"era_sel":3,"displacement":27,"compression":5.55,"cyl_per_row":2,"rows":6,"RPM_boost":0.98,"material_fudge":0.8,"quality_fudge":1,"compressor_type":2,"compressor_count":1,"min_IAF":30,"upgrades":[false,true,true,false]}]},{"name":"ACDQ","engines":[{"name":"2A-Series 4-Cylinder Inline","engine_type":0,"type":0,"era_sel":0,"displacement":16,"compression":4.5,"cyl_per_row":1,"rows":2,"RPM_boost":0.5,"material_fudge":0.8,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"F-Series 6-Cylinder Inline","engine_type":0,"type":0,"era_sel":0,"displacement":17,"compression":4.3,"cyl_per_row":1,"rows":6,"RPM_boost":1.07,"material_fudge":0.7,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"G-Series 9-Cylinder Rotary Engine","engine_type":0,"type":2,"era_sel":0,"displacement":16,"compression":4.7,"cyl_per_row":9,"rows":1,"RPM_boost":1.04,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hartmann H.IIc Straight-6 Engine","engine_type":0,"type":0,"era_sel":1,"displacement":12,"compression":4.7,"cyl_per_row":1,"rows":6,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Hornet R-3 Boxer 6-Cylinder","engine_type":0,"type":0,"era_sel":1,"displacement":10,"compression":5,"cyl_per_row":2,"rows":3,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Maclean-King Tiger MK.1 V-12 Engine","engine_type":0,"type":0,"era_sel":1,"displacement":17,"compression":5,"cyl_per_row":2,"rows":6,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Ogre-Z Beta V-6","engine_type":0,"type":0,"era_sel":0,"displacement":11,"compression":5,"cyl_per_row":1,"rows":6,"RPM_boost":1,"material_fudge":0.7,"quality_fudge":0.8,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"Pulsejet PV-12 (Pioneer)","engine_type":1,"type":0,"era_sel":0,"power":12,"quality_cost":1.1,"quality_rely":1.1,"starter":false},{"name":"Pulsejet PV-20 (Pioneer)","engine_type":1,"type":0,"era_sel":0,"power":20,"quality_cost":1.1,"quality_rely":1.1,"starter":false},{"name":"Pulsejet PV-8 (Pioneer)","engine_type":1,"type":0,"era_sel":0,"power":8,"quality_cost":1.1,"quality_rely":1.1,"starter":false},{"name":"Seguin Σ110 Sigma 7-Cylinder Rotary Engine","engine_type":0,"type":2,"era_sel":1,"displacement":14,"compression":4.5,"cyl_per_row":7,"rows":1,"RPM_boost":1.05,"material_fudge":1,"quality_fudge":1.5,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"SuperPegasus 7-Cylinder Rotary Engine","engine_type":0,"type":2,"era_sel":0,"displacement":13.5,"compression":5,"cyl_per_row":7,"rows":1,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},{"name":"TurboGoblin 8-Cylinder Semi-Radial","engine_type":0,"type":4,"era_sel":0,"displacement":13,"compression":5.5,"cyl_per_row":8,"rows":1,"RPM_boost":1,"material_fudge":0.9,"quality_fudge":0.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]}]},{"name":"Himmilgard Pulsejet","engines":[{"name":"Pulsejet PV-15 (WWI)","engine_type":1,"type":0,"era_sel":1,"power":15,"quality_cost":1,"quality_rely":1,"starter":false,"rarity":1}]},{"name":"Himmilgard Liquid Radial","engines":[{"name":"Einsort MM 140hp","engine_type":0,"type":5,"era_sel":1,"displacement":14.72,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":0.78,"material_fudge":0.9,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Einsort MR 150hp","engine_type":0,"type":5,"era_sel":1,"displacement":15.46,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":0.78,"material_fudge":0.9,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Gernsback Motor 0005","engine_type":0,"type":5,"era_sel":1,"displacement":12,"compression":6,"cyl_per_row":5,"rows":2,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3}]},{"name":"Himmilgard Liquid Cooled","engines":[{"name":"Bertha F1166 120hp","engine_type":0,"type":0,"era_sel":1,"displacement":9.4,"compression":4.5,"cyl_per_row":1,"rows":6,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Bertha F1466 170hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":4.64,"cyl_per_row":1,"rows":6,"RPM_boost":0.9,"material_fudge":0.9,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Bertha F1466 Über 180hp","engine_type":0,"type":0,"era_sel":1,"displacement":15,"compression":4.64,"cyl_per_row":1,"rows":6,"RPM_boost":0.95,"material_fudge":0.9,"quality_fudge":0.9,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Bertha F2000 250hp","engine_type":0,"type":0,"era_sel":1,"displacement":21.6,"compression":4.94,"cyl_per_row":1,"rows":6,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Brandt Krieger I 370hp","engine_type":0,"type":0,"era_sel":1,"displacement":18.77,"compression":5.5,"cyl_per_row":2,"rows":6,"RPM_boost":1.1,"material_fudge":0.7,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3},{"name":"Brandt Kurier XVI 180hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Fleischmann F10 250hp","engine_type":0,"type":0,"era_sel":1,"displacement":21.71,"compression":4.3,"cyl_per_row":1,"rows":6,"RPM_boost":1.05,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Fleischmann F10ü 300hp","engine_type":0,"type":0,"era_sel":1,"displacement":21.71,"compression":4.75,"cyl_per_row":1,"rows":6,"RPM_boost":1.05,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Fokker Fungizidherstellung Typ 247 160hp","engine_type":0,"type":0,"era_sel":1,"displacement":14.3,"compression":4.8,"cyl_per_row":1,"rows":6,"RPM_boost":0.85,"material_fudge":0.8,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Meier Ochs 2 160hp","engine_type":0,"type":0,"era_sel":1,"displacement":16.6,"compression":4.5,"cyl_per_row":1,"rows":6,"RPM_boost":0.84,"material_fudge":0.7,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Meier Windhund 70hp","engine_type":0,"type":0,"era_sel":1,"displacement":6.3,"compression":4,"cyl_per_row":1,"rows":4,"RPM_boost":1.2,"material_fudge":1.3,"quality_fudge":0.8,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Nationales Motorbüro Arbeiter XVII 170hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.7,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,true],"rarity":2},{"name":"Nationales Motorbüro D-1140 220hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.4,"compression":5.5,"cyl_per_row":2,"rows":6,"RPM_boost":1.1,"material_fudge":1.5,"quality_fudge":0.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Nationales Motorbüro D-760 150hp","engine_type":0,"type":0,"era_sel":1,"displacement":7.6,"compression":5.5,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1.5,"quality_fudge":0.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Nationales Motorbüro D-760tgl 180hp","engine_type":0,"type":0,"era_sel":1,"displacement":7.6,"compression":5.5,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1.5,"quality_fudge":0.4,"compressor_type":3,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Nationales Motorbüro D-840 160hp","engine_type":0,"type":0,"era_sel":1,"displacement":8.4,"compression":5.5,"cyl_per_row":2,"rows":4,"RPM_boost":1.05,"material_fudge":1.5,"quality_fudge":0.6,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Nationales Motorbüro Kurier XXI 210hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.7,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3},{"name":"SAM Kurier XII 150hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":4.8,"cyl_per_row":2,"rows":4,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"SAM Kurier XX 200hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"SAM Transporter I 300hp","engine_type":0,"type":0,"era_sel":1,"displacement":22.08,"compression":4.5,"cyl_per_row":2,"rows":6,"RPM_boost":1.15,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"SAM Transporter III 320hp","engine_type":0,"type":0,"era_sel":1,"displacement":22.08,"compression":4.5,"cyl_per_row":2,"rows":6,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":3,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"SAM Transporter V 350hp","engine_type":0,"type":0,"era_sel":1,"displacement":22.08,"compression":4.75,"cyl_per_row":2,"rows":6,"RPM_boost":1.2,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Schrankhut RD.300V 230hp","engine_type":0,"type":0,"era_sel":1,"displacement":18.4,"compression":6.4,"cyl_per_row":1,"rows":6,"RPM_boost":0.51,"material_fudge":0.7,"quality_fudge":1.3,"compressor_type":1,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3},{"name":"Wollsteinkraft Verteidiger C 250hp","engine_type":0,"type":0,"era_sel":1,"displacement":24,"compression":4.9,"cyl_per_row":2,"rows":6,"RPM_boost":0.75,"material_fudge":0.7,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Wollsteinkraft Verteidiger H 360hp","engine_type":0,"type":0,"era_sel":1,"displacement":20,"compression":6,"cyl_per_row":2,"rows":6,"RPM_boost":0.85,"material_fudge":0.7,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Wollsteinkraft Wagehals C 290hp","engine_type":0,"type":0,"era_sel":1,"displacement":14.4,"compression":5.3,"cyl_per_row":2,"rows":6,"RPM_boost":1.2,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Bertha F4398 490hp","engine_type":0,"type":0,"era_sel":1,"displacement":44.3,"compression":4.7,"cyl_per_row":3,"rows":6,"RPM_boost":0.85,"material_fudge":0.7,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Brandt Patriot 210hp","engine_type":0,"type":0,"era_sel":1,"displacement":17.5,"compression":5.65,"cyl_per_row":1,"rows":6,"RPM_boost":0.65,"material_fudge":0.7,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Brandt Turbolader-Patriot 260hp","engine_type":0,"type":0,"era_sel":1,"displacement":17.5,"compression":5.65,"cyl_per_row":1,"rows":6,"RPM_boost":0.65,"material_fudge":0.7,"quality_fudge":1.2,"compressor_type":3,"compressor_count":1,"min_IAF":30,"upgrades":[false,false,false,false],"rarity":2},{"name":"Meier Bär 400hp","engine_type":0,"type":0,"era_sel":1,"displacement":27,"compression":5.4,"cyl_per_row":2,"rows":6,"RPM_boost":0.86,"material_fudge":0.6,"quality_fudge":1.4,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3},{"name":"Meier Eisbär 500hp","engine_type":0,"type":0,"era_sel":1,"displacement":27,"compression":5.4,"cyl_per_row":2,"rows":6,"RPM_boost":0.86,"material_fudge":0.6,"quality_fudge":1.4,"compressor_type":3,"compressor_count":1,"min_IAF":30,"upgrades":[false,false,false,false],"rarity":3},{"name":"SAM Kurier XIII 180hp","engine_type":0,"type":0,"era_sel":1,"displacement":11.2,"compression":4.8,"cyl_per_row":2,"rows":4,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.1,"compressor_type":3,"compressor_count":1,"min_IAF":10,"upgrades":[false,false,false,false],"rarity":2},{"name":"SAM Transporter IV 320hp","engine_type":0,"type":0,"era_sel":1,"displacement":22.08,"compression":4.5,"cyl_per_row":2,"rows":6,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":3,"compressor_count":1,"min_IAF":20,"upgrades":[false,false,false,false],"rarity":2},{"name":"Sonnenmotor EGH3 220hp","engine_type":0,"type":0,"era_sel":0,"displacement":20,"compression":5,"cyl_per_row":2,"rows":4,"RPM_boost":1,"material_fudge":0.9,"quality_fudge":1,"compressor_type":2,"compressor_count":1,"min_IAF":50,"upgrades":[false,false,false,true],"rarity":3},{"name":"Wollsteinkraft Wagehals T 360hp","engine_type":0,"type":0,"era_sel":1,"displacement":14.4,"compression":5.3,"cyl_per_row":2,"rows":6,"RPM_boost":1.2,"material_fudge":1,"quality_fudge":1.1,"compressor_type":3,"compressor_count":2,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"SAM Kurier L 300hp","engine_type":0,"type":0,"era_sel":1,"displacement":18.4,"compression":5.3,"cyl_per_row":2,"rows":4,"RPM_boost":0.99,"material_fudge":0.8,"quality_fudge":1.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3},{"name":"Bertha F2080 220hp","engine_type":0,"type":0,"era_sel":1,"displacement":19.7,"compression":4.4,"cyl_per_row":1,"rows":8,"RPM_boost":1,"material_fudge":0.6,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Bertha F2080 Über 270hp","engine_type":0,"type":0,"era_sel":1,"displacement":19.7,"compression":4.8,"cyl_per_row":1,"rows":8,"RPM_boost":1,"material_fudge":0.6,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2}]},{"name":"Himmilgard Contrarotary","engines":[{"name":"Nationales Motorbüro R-1860 160hp","engine_type":0,"type":3,"era_sel":1,"displacement":18.6,"compression":6,"cyl_per_row":11,"rows":1,"RPM_boost":0.65,"material_fudge":1,"quality_fudge":1,"compressor_type":1,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Nationales Motorbüro R-1190 110hp","engine_type":0,"type":3,"era_sel":1,"displacement":11.9,"compression":6,"cyl_per_row":9,"rows":1,"RPM_boost":0.67,"material_fudge":1.2,"quality_fudge":1,"compressor_type":1,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2}]},{"name":"Himmilgard Air Cooled","engines":[{"name":"Braun UL 90hp","engine_type":0,"type":1,"era_sel":1,"displacement":8.8,"compression":4.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.2,"material_fudge":1.3,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Braun ULK 110hp","engine_type":0,"type":1,"era_sel":1,"displacement":8.8,"compression":4.3,"cyl_per_row":2,"rows":4,"RPM_boost":1.2,"material_fudge":1.2,"quality_fudge":1,"compressor_type":2,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Scholz Luchs X 110hp","engine_type":0,"type":1,"era_sel":1,"displacement":12.1,"compression":4.85,"cyl_per_row":5,"rows":2,"RPM_boost":0.8,"material_fudge":0.9,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Braun UX 150hp","engine_type":0,"type":1,"era_sel":1,"displacement":13.2,"compression":4.3,"cyl_per_row":2,"rows":6,"RPM_boost":1.23,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Scholz Luchs III 30hp","engine_type":0,"type":1,"era_sel":1,"displacement":3.1,"compression":4.5,"cyl_per_row":3,"rows":1,"RPM_boost":1,"material_fudge":1.1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Scholz Luchs VI 60hp","engine_type":0,"type":1,"era_sel":1,"displacement":6.23,"compression":4.5,"cyl_per_row":3,"rows":2,"RPM_boost":1,"material_fudge":1.1,"quality_fudge":0.9,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Breitbusch Libelle \'320hp\'","engine_type":0,"type":1,"era_sel":1,"displacement":22.78,"compression":4.42,"cyl_per_row":9,"rows":1,"RPM_boost":1.31,"material_fudge":1.1,"quality_fudge":0.3,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3}]},{"name":"Himmilgard Semi-Radial","engines":[{"name":"SLW Sigvird 180hp","engine_type":0,"type":4,"era_sel":1,"displacement":11,"compression":6,"cyl_per_row":4,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1.3,"compressor_type":2,"compressor_count":2,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3}]},{"name":"Himmilgard Rotary","engines":[{"name":"Modded Z12 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":15,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1,"compressor_type":1,"compressor_count":1,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"Robur Herausforderer 180hp","engine_type":0,"type":2,"era_sel":1,"displacement":18,"compression":5.5,"cyl_per_row":5,"rows":2,"RPM_boost":0.9,"material_fudge":1,"quality_fudge":1,"compressor_type":3,"compressor_count":1,"min_IAF":40,"upgrades":[false,false,true,true],"rarity":3},{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Rhona Motorbau Z11tgl 100hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":2,"compressor_count":1,"min_IAF":20,"upgrades":[false,false,false,false],"rarity":1},{"name":"Rhona Motorbau Z12 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":15,"compression":5,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Schreiber B.IX 130hp","engine_type":0,"type":2,"era_sel":1,"displacement":16.2,"compression":4.8,"cyl_per_row":9,"rows":1,"RPM_boost":0.95,"material_fudge":1,"quality_fudge":1.1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Schreiber G.IX 110hp","engine_type":0,"type":2,"era_sel":1,"displacement":15.84,"compression":4.85,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Schreiber O.VII 50hp","engine_type":0,"type":2,"era_sel":1,"displacement":8,"compression":4.85,"cyl_per_row":7,"rows":1,"RPM_boost":0.8,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Schreiber L.VII 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":11.9,"compression":3.87,"cyl_per_row":7,"rows":1,"RPM_boost":1.2,"material_fudge":0.8,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":1},{"name":"Schreiber TG.IX 130hp","engine_type":0,"type":2,"era_sel":1,"displacement":15.84,"compression":4.85,"cyl_per_row":9,"rows":1,"RPM_boost":0.8,"material_fudge":0.8,"quality_fudge":1,"compressor_type":2,"compressor_count":1,"min_IAF":20,"upgrades":[false,false,false,false],"rarity":1},{"name":"Schreiber T.IX 160hp","engine_type":0,"type":2,"era_sel":1,"displacement":16.2,"compression":4.8,"cyl_per_row":9,"rows":1,"RPM_boost":0.95,"material_fudge":1,"quality_fudge":1.1,"compressor_type":2,"compressor_count":1,"min_IAF":30,"upgrades":[false,false,false,false],"rarity":2},{"name":"W.O.1 150hp","engine_type":0,"type":2,"era_sel":1,"displacement":17.1,"compression":4.9,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":2},{"name":"W.O.3 230hp","engine_type":0,"type":2,"era_sel":1,"displacement":24.93,"compression":5.2,"cyl_per_row":9,"rows":1,"RPM_boost":0.9,"material_fudge":0.8,"quality_fudge":1.2,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false],"rarity":3}]}]}');
;// CONCATENATED MODULE: ./src/impl/EngineList.ts



class EngineList {
    constructor(name) {
        this.constant = false;
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
    toJSON() {
        const ret = [];
        for (const li of this.list) {
            ret.push(li.toJSON());
        }
        return { name: this.name, engines: ret };
    }
    fromJSON(js, force = false) {
        if (js["name"])
            this.name = js["name"];
        if (force) {
            this.list = [];
        }
        for (const elem of js["engines"]) {
            try {
                this.push(new EngineInputs(elem), force);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    deserializeEngine(d) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        const stats = new EngineInputs();
        stats.deserialize(d);
        return this.push(stats);
    }
    push(es, force = false) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        if (force) {
            this.remove(es);
        }
        else {
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
    get(i) {
        if (i < 0 || i >= this.length)
            return new EngineInputs();
        return this.list[i];
    }
    get_name(n) {
        const i = this.find_name(n);
        return this.get(i);
    }
    get_stats(i) {
        if (i < 0 || i >= this.length)
            return new EngineStats();
        return this.list[i].PartStats();
    }
    get_stats_name(n) {
        const i = this.find_name(n);
        return this.get_stats(i);
    }
    find(es) {
        for (let i = 0; i < this.length; i++) {
            if (es.Equal(this.list[i]))
                return i;
        }
        return -1;
    }
    find_name(n) {
        for (let i = 0; i < this.length; i++) {
            if (this.list[i].name == n)
                return i;
        }
        return -1;
    }
    remove(es) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        const idx = this.find(es);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }
    remove_name(name) {
        if (this.constant) {
            throw "Engine List is Constant";
        }
        const idx = this.find_name(name);
        if (idx >= 0) {
            this.list.splice(idx, 1);
        }
        window.localStorage.setItem("engines." + this.name, JSON.stringify(this.toJSON()));
    }
    get length() {
        return this.list.length;
    }
    SetConstant() {
        this.constant = true;
    }
}
const engine_list = new Map([["Custom", new EngineList("Custom")]]);
function SetEngineLists(nameliststr) {
    for (const el of engines_namespaceObject.l) {
        if (!engine_list.has(el["name"]))
            engine_list.set(el["name"], new EngineList(el["name"]));
        if (el["name"] != "Custom") {
            engine_list.get(el["name"]).fromJSON(el, true);
            engine_list.get(el["name"]).SetConstant();
            for (let idx = 0; idx < engine_list.get(el["name"]).length; idx++) {
                const e = engine_list.get(el["name"]).get(idx);
                engine_list.get("Custom").remove(e);
            }
        }
        else {
            engine_list.get(el["name"]).fromJSON(el, false);
        }
    }
    for (const name of JSON.parse(nameliststr)) {
        if (!engine_list.has(name))
            engine_list.set(name, new EngineList(name));
        if (name != "Custom") {
            for (let idx = 0; idx < engine_list.get(name).length; idx++) {
                const e = engine_list.get(name).get(idx);
                engine_list.get("Custom").remove(e);
            }
        }
    }
}
function GetEngineLists() {
    return engine_list;
}
function GetEngineJSON() {
    return engine_JSON;
}
function SearchAllEngineLists(n) {
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

;// CONCATENATED MODULE: ./src/impl/Part.ts

var AIRCRAFT_TYPE;
(function (AIRCRAFT_TYPE) {
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["AIRPLANE"] = 0] = "AIRPLANE";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["HELICOPTER"] = 1] = "HELICOPTER";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["AUTOGYRO"] = 2] = "AUTOGYRO";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER_BASIC"] = 3] = "ORNITHOPTER_BASIC";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER_FLUTTER"] = 4] = "ORNITHOPTER_FLUTTER";
    AIRCRAFT_TYPE[AIRCRAFT_TYPE["ORNITHOPTER_BUZZER"] = 5] = "ORNITHOPTER_BUZZER";
})(AIRCRAFT_TYPE || (AIRCRAFT_TYPE = {}));
function IsAnyOrnithopter(type) {
    return type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC
        || type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER
        || type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER;
}
class Part {
    FormatEquipment(equipment, name, charge) {
        if (Math.abs(charge) > 0.5) {
            equipment.push({
                source: Localization_lu(name),
                charge: charge.toString(),
            });
        }
        else if (charge > 0 && charge < 1.0e-6) {
            equipment.push({
                source: Localization_lu(name),
                charge: "-",
            });
        }
        return equipment;
    }
}
function MergeElectrics(a, b) {
    for (let bi = 0; bi < b.equipment.length; bi++) {
        let merge = false;
        for (let ai = 0; ai < a.equipment.length; ai++) {
            if (a.equipment[ai].source == b.equipment[bi].source && !isNaN(parseInt(a.equipment[ai].charge))) {
                a.equipment[ai].charge = (parseInt(a.equipment[ai].charge) + parseInt(b.equipment[bi].charge)).toString();
                merge = true;
                break;
            }
        }
        if (!merge) {
            a.equipment.push(b.equipment[bi]);
        }
    }
    return { storage: a.storage + b.storage, equipment: a.equipment };
}

;// CONCATENATED MODULE: ./src/impl/AlterStats.ts


class AlterStats extends Part {
    constructor() {
        super();
        let cp_json = JSON.parse(window.localStorage.getItem('CustomParts'));
        if (!cp_json) {
            cp_json = [];
            window.localStorage.setItem('CustomParts', JSON.stringify([]));
        }
        this.custom_parts = [];
        for (const elem of cp_json) {
            this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]), qty: 0 });
        }
    }
    toJSON() {
        const plist = [];
        const plist_save = [];
        for (const p of this.custom_parts) {
            plist_save.push({ name: p.name, stats: p.stats.toJSON(), qty: p.qty });
            if (p.qty > 0)
                plist.push({ name: p.name, stats: p.stats.toJSON(), qty: p.qty });
        }
        window.localStorage.setItem('CustomParts', JSON.stringify(plist_save));
        return {
            part_list: plist,
        };
    }
    fromJSON(js, json_version) {
        for (const p of this.custom_parts) {
            p.qty = 0;
        }
        for (const elem of js["part_list"]) {
            const idx = this.custom_parts.findIndex((value) => { return value.name == elem["name"]; });
            if (idx == -1) {
                this.custom_parts.push({ name: elem["name"], stats: new Stats(elem["stats"]), qty: elem["qty"] });
            }
            else {
                this.custom_parts[idx].qty = elem["qty"];
            }
        }
    }
    serialize(s) {
        const plist = [];
        for (const p of this.custom_parts) {
            if (p.qty > 0)
                plist.push({ name: p.name, stats: p.stats, qty: p.qty });
        }
        s.PushNum(plist.length);
        for (const p of plist) {
            s.PushString(p.name);
            p.stats.serialize(s);
            s.PushNum(p.qty);
        }
    }
    deserialize(d) {
        for (const p of this.custom_parts) {
            p.qty = 0;
        }
        const pcount = d.GetNum();
        for (let i = 0; i < pcount; i++) {
            const name = d.GetString();
            const stats = new Stats();
            stats.deserialize(d);
            const qty = d.GetNum();
            var idx = this.custom_parts.findIndex((value) => { return value.name == name; });
            if (idx == -1) {
                idx = this.custom_parts.length;
                this.custom_parts.push({ name: name, stats: stats, qty: qty });
            }
            else {
                this.custom_parts[idx].qty = qty;
            }
        }
    }
    ClearAll() {
        for (const p of this.custom_parts) {
            p.qty = 0;
        }
    }
    AddPart(name, stats) {
        var sumstats = 0;
        sumstats += Math.abs(stats.drag);
        sumstats += Math.abs(stats.mass);
        sumstats += Math.abs(stats.wetmass);
        sumstats += Math.abs(stats.bomb_mass);
        sumstats += Math.abs(stats.cost);
        sumstats += Math.abs(stats.upkeep);
        sumstats += Math.abs(stats.liftbleed);
        sumstats += Math.abs(stats.wingarea);
        sumstats += Math.abs(stats.control);
        sumstats += Math.abs(stats.pitchstab);
        sumstats += Math.abs(stats.latstab);
        sumstats += Math.abs(stats.maxstrain);
        sumstats += Math.abs(stats.structure);
        sumstats += Math.abs(stats.toughness);
        sumstats += Math.abs(stats.power);
        sumstats += Math.abs(stats.fuelconsumption);
        sumstats += Math.abs(stats.fuel);
        sumstats += Math.abs(stats.charge);
        sumstats += Math.abs(stats.crashsafety);
        sumstats += Math.abs(stats.visibility);
        sumstats += Math.abs(stats.escape);
        sumstats += Math.abs(stats.reliability);
        sumstats += Math.abs(stats.warnings.length);
        if (sumstats == 0) {
            return;
        }
        const idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts[idx].stats = stats;
        }
        else {
            this.custom_parts.push({ name: name, stats: stats, qty: 0 });
        }
        this.custom_parts.sort((a, b) => a.name.localeCompare(b.name));
        this.CalculateStats();
    }
    RemovePart(name) {
        const idx = this.custom_parts.findIndex((item) => { return item.name == name; });
        if (idx != -1) {
            this.custom_parts.splice(idx, 1);
        }
        this.CalculateStats();
    }
    GetParts() {
        return this.custom_parts;
    }
    SetUsedPart(idx, qty) {
        this.custom_parts[idx].qty = qty;
        this.CalculateStats();
    }
    PartStats() {
        var stats = new Stats();
        for (const part of this.custom_parts) {
            if (part.qty > 0) {
                let pstats = part.stats.Clone();
                pstats = pstats.Multiply(part.qty);
                stats = stats.Add(pstats);
            }
        }
        return stats;
    }
    GetElectrics() {
        const battery_storage = 0;
        var equipment = [];
        for (const part of this.custom_parts) {
            if (part.qty > 0) {
                equipment = this.FormatEquipment(equipment, part.name, part.stats.charge);
            }
        }
        return { storage: battery_storage, equipment: equipment };
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
}

;// CONCATENATED MODULE: ./src/impl/Era.ts


class Era extends Part {
    constructor(js) {
        super();
        this.selected = 0;
        this.vals = [];
        for (const elem of js["options"]) {
            const opt = {
                name: elem["name"], maxbomb: elem["maxbomb"],
                cant_lift: elem["cant_lift"], stats: new Stats(elem),
            };
            this.vals.push(opt);
        }
    }
    toJSON() {
        return {
            selected: this.selected
        };
    }
    fromJSON(js, json_version) {
        this.selected = js["selected"];
        if (json_version < 10.35) {
            if (this.selected > 2) {
                this.selected++;
            }
        }
    }
    serialize(s) {
        s.PushNum(this.selected);
    }
    deserialize(d) {
        this.selected = d.GetNum();
    }
    GetSelected() {
        return this.selected;
    }
    GetSelectedText() {
        return this.vals[this.selected].name;
    }
    SetSelected(index) {
        this.selected = index;
        this.CalculateStats();
    }
    GetEraOptions() {
        return this.vals;
    }
    GetLiftBleed() {
        return this.vals[this.selected].stats.liftbleed;
    }
    GetMaxBomb() {
        return this.vals[this.selected].maxbomb;
    }
    GetCantLift() {
        return this.vals[this.selected].cant_lift;
    }
    PartStats() {
        var s = new Stats();
        s = s.Add(this.vals[this.selected].stats);
        return s;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Cockpit.ts




class Cockpit extends Part {
    constructor(tl, ul, sl, gl) {
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
    toJSON() {
        return {
            type: this.selected_type,
            upgrades: this.selected_upgrades,
            safety: this.selected_safety,
            sights: this.selected_gunsights,
            bombsight: this.bombsight,
        };
    }
    fromJSON(js, json_version) {
        this.selected_type = js["type"];
        this.selected_upgrades = BoolArr(js["upgrades"], this.selected_upgrades.length);
        this.selected_safety = BoolArr(js["safety"], this.selected_safety.length);
        this.selected_gunsights = BoolArr(js["sights"], this.selected_gunsights.length);
        if (this.IsPrimary())
            this.selected_upgrades[0] = false;
        if (json_version > 10.35)
            this.bombsight = js["bombsight"];
    }
    serialize(s) {
        s.PushNum(this.selected_type);
        s.PushBoolArr(this.selected_upgrades);
        s.PushBoolArr(this.selected_safety);
        s.PushBoolArr(this.selected_gunsights);
        s.PushNum(this.bombsight);
    }
    deserialize(d) {
        this.selected_type = d.GetNum();
        this.selected_upgrades = d.GetBoolArr(this.selected_upgrades.length);
        this.selected_safety = d.GetBoolArr(this.selected_safety.length);
        this.selected_gunsights = d.GetBoolArr(this.selected_gunsights.length);
        if (this.IsPrimary())
            this.selected_upgrades[0] = false;
        if (d.version > 10.35)
            this.bombsight = d.GetNum();
    }
    GetTypeList() {
        return this.types;
    }
    GetUpgradeList() {
        return this.upgrades;
    }
    GetSafetyList() {
        return this.safety;
    }
    GetGunsightList() {
        return this.gunsights;
    }
    GetType() {
        return this.selected_type;
    }
    SetType(index) {
        if (index >= this.types.length)
            throw "Selected type is not in range of actual types.";
        this.selected_type = index;
        this.CalculateStats();
    }
    GetSelectedUpgrades() {
        return this.selected_upgrades;
    }
    SetUpgrade(index, state) {
        if (index >= this.upgrades.length)
            throw "Selected type is not in range of actual upgrades.";
        this.selected_upgrades[index] = state;
        this.CalculateStats();
    }
    GetSelectedSafety() {
        return this.selected_safety;
    }
    CanSafety() {
        const lst = Array(this.safety.length).fill(true);
        lst[5] = !this.types[this.selected_type].exposed;
        return lst;
    }
    SetSafety(index, state) {
        if (index >= this.safety.length)
            throw "Selected type is not in range of actual safties.";
        this.selected_safety[index] = state;
        this.CalculateStats();
    }
    GetSelectedGunsights() {
        return this.selected_gunsights;
    }
    SetGunsight(index, state) {
        if (index >= this.safety.length)
            throw "Selected type is not in range of actual gunsights.";
        this.selected_gunsights[index] = state;
        this.CalculateStats();
    }
    GetVisibility() {
        if (this.types[this.selected_type].stats.visibility < -10)
            return -1 / 0;
        return this.total_visibility;
    }
    GetFlightStress() {
        return this.total_stress;
    }
    GetEscape() {
        return this.total_escape;
    }
    GetCrash() {
        return this.total_crash;
    }
    GetAttack() {
        var mx = 0;
        for (let i = 0; i < this.gunsights.length; i++) {
            if (this.selected_gunsights[i]) {
                mx = Math.max(mx, this.gunsights[i].attack);
            }
        }
        return mx;
    }
    SetSeatIndex(idx) {
        this.seat_index = idx;
    }
    IsPrimary() {
        return this.seat_index == 0;
    }
    CanUpgrades() {
        const can = [...Array(this.upgrades.length).fill(true)];
        if (this.IsPrimary()) {
            can[0] = false;
        }
        return can;
    }
    IsOpen() {
        return this.types[this.selected_type].name == "Open"
            || this.types[this.selected_type].name == "Windscreen";
    }
    GetBombsightQuality() {
        return this.bombsight;
    }
    SetBombsightQuality(num) {
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
    SetHasRotary(has) {
        this.has_rotary = has;
    }
    IsElectrics() {
        return this.stats.charge != 0;
    }
    IsCopilot() {
        return this.selected_upgrades[0];
    }
    SetArmed(is) {
        this.is_armed = is;
    }
    GetName() {
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
    PartStats() {
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
                source: Localization_lu("Bombsight"),
                warning: Localization_lu("Bombsight Warning 1") + this.bombsight.toString() + Localization_lu("Bombsight Warning 2"),
                color: WARNING_COLOR.WHITE,
            });
            if (this.IsCopilot()) {
                stats.warnings.push({
                    source: Localization_lu("Bombadier Controls"),
                    warning: Localization_lu("Bombadier Controls Warning"),
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
    CrewUpdate(escape, controlstress, rumblestress, copilots, visibility, crash) {
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
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        const battery_storage = 0;
        var equipment = [];
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

;// CONCATENATED MODULE: ./src/impl/Cockpits.ts





class Cockpits extends Part {
    constructor(js) {
        super();
        this.positions = [];
        this.types = [];
        //Add all the cockpit types
        for (const elem of js["options"]) {
            let opt = { name: elem["name"], exposed: elem["exposed"], stats: new Stats(elem) };
            this.types.push(opt);
        }
        this.upgrades = [];
        //Add all the upgrades
        for (const elem of js["upgrades"]) {
            let upg = { name: elem["name"], stats: new Stats(elem) };
            this.upgrades.push(upg);
        }
        this.safety = [];
        //Add all the safety
        for (const elem of js["safety"]) {
            let sft = { name: elem["name"], stats: new Stats(elem) };
            this.safety.push(sft);
        }
        this.gunsights = [];
        //Add all the gunsights
        for (const elem of js["gunsights"]) {
            let gun = { name: elem["name"], attack: elem["attack"], stats: new Stats(elem) };
            this.gunsights.push(gun);
        }
    }
    toJSON() {
        const lst = [];
        for (const cp of this.positions) {
            lst.push(cp.toJSON());
        }
        return { positions: lst };
    }
    fromJSON(js, json_version) {
        this.positions = [];
        for (const elem of js["positions"]) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            cp.fromJSON(elem, json_version);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    serialize(s) {
        s.PushNum(this.positions.length);
        for (const cp of this.positions) {
            cp.serialize(s);
        }
    }
    deserialize(d) {
        const len = d.GetNum();
        this.positions = [];
        for (let i = 0; i < len; i++) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            cp.deserialize(d);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
    }
    GetAttackList() {
        const lst = [];
        for (const c of this.positions) {
            lst.push(c.GetAttack());
        }
        return lst;
    }
    GetVisibilityList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetVisibility());
        }
        return lst;
    }
    GetStressList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetFlightStress());
        }
        return lst;
    }
    GetEscapeList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetEscape());
        }
        return lst;
    }
    GetCrashList() {
        const lst = [];
        for (const p of this.positions) {
            lst.push(p.GetCrash());
        }
        return lst;
    }
    SetNumberOfCockpits(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        while (this.positions.length > num) {
            this.positions.pop();
        }
        var js = null;
        if (this.positions.length > 0) {
            js = JSON.stringify(this.positions[this.positions.length - 1].toJSON());
        }
        while (this.positions.length < num) {
            let cp = new Cockpit(this.types, this.upgrades, this.safety, this.gunsights);
            cp.SetSeatIndex(this.positions.length);
            if (js)
                cp.fromJSON(JSON.parse(js), 1000);
            cp.SetCalculateStats(this.CalculateStats);
            this.positions.push(cp);
        }
        this.CalculateStats();
    }
    GetNumberOfCockpits() {
        return this.positions.length;
    }
    GetCockpit(index) {
        return this.positions[index];
    }
    SetHasRotary(has) {
        for (const c of this.positions) {
            c.SetHasRotary(has);
        }
    }
    IsElectrics() {
        for (const c of this.positions) {
            if (c.IsElectrics())
                return true;
        }
        return false;
    }
    PartStats() {
        var s = new Stats();
        let warningmap = new Map();
        for (let i = 0; i < this.positions.length; i++) {
            let cp = this.positions[i];
            let cps = cp.PartStats();
            s = s.Add(cps);
            // We want to merge all the warnings for different seats so we don't end up with a pile of warnings.
            for (const w of cps.warnings) {
                let exist = warningmap.get(w.source);
                if (exist) {
                    exist.push(i + 1);
                    warningmap.set(w.source, exist);
                }
                else {
                    warningmap.set(w.source, [i + 1]);
                }
            }
        }
        for (const w of s.warnings) {
            w.source = Localization_lu("Seats #", string_StringFmt.Join(",", warningmap.get(w.source))) + " " + w.source;
        }
        //Local only stats don't get rolled up into the aircraft as a whole.
        s.escape = 0;
        //This needs special work for co-pilot controls
        //s.flightstress = 0;
        s.visibility = 0;
        s.crashsafety = 0;
        return s;
    }
    SetArmed(armed) {
        for (let i = 0; i < this.positions.length; i++) {
            this.positions[i].SetArmed(armed[i]);
        }
    }
    UpdateCrewStats(escape, controlstress, rumblestress, visibility, crash) {
        let copilots = 0;
        for (const cp of this.positions) {
            if (cp.IsCopilot()) {
                copilots += 1;
            }
        }
        for (const cp of this.positions) {
            cp.CrewUpdate(escape, controlstress, rumblestress, copilots, visibility, crash);
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        for (const c of this.positions) {
            value = MergeElectrics(value, c.GetElectrics());
        }
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Passengers.ts



class Passengers extends Part {
    constructor(js) {
        super();
        this.seats = 0;
        this.beds = 0;
        this.connected = false;
    }
    toJSON() {
        return {
            seats: this.seats,
            beds: this.beds,
            connected: this.connected
        };
    }
    fromJSON(js, json_version) {
        this.seats = js["seats"];
        this.beds = js["beds"];
        this.connected = js["connected"];
    }
    serialize(s) {
        s.PushNum(this.seats);
        s.PushNum(this.beds);
        s.PushBool(this.connected);
    }
    deserialize(d) {
        this.seats = d.GetNum();
        this.beds = d.GetNum();
        this.connected = d.GetBool();
    }
    GetSeats() {
        return this.seats;
    }
    SetSeats(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.seats = num;
        this.CalculateStats();
    }
    GetBeds() {
        return this.beds;
    }
    SetBeds(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.beds = num;
        this.CalculateStats();
    }
    PossibleConnection() {
        return (this.seats + this.beds) > 0;
    }
    GetConnected() {
        return this.connected;
    }
    SetConnected(sel) {
        this.connected = sel;
        this.CalculateStats();
    }
    PartStats() {
        const stats = new Stats();
        stats.reqsections = 2 * Math.ceil(-1.0e-6 + (this.seats + 2 * this.beds) / 5);
        if (this.seats + this.beds > 0 && this.connected) {
            stats.mass = 1;
        }
        stats.bomb_mass += this.seats + this.beds;
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        if (this.seats + this.beds > 0) {
            stats.warnings.push({
                source: Localization_lu("Passengers Section Title"),
                warning: Localization_lu("Passengers Count", this.seats, this.beds),
                color: WARNING_COLOR.WHITE,
            });
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Engine.ts




class Engine extends Part {
    constructor(ml, cl) {
        super();
        const engine_list = GetEngineLists();
        this.elist_idx = "Custom";
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(0);
        this.etype_inputs = engine_list.get(this.elist_idx).get(0);
        this.cooling_count = this.etype_stats.stats.cooling;
        this.radiator_index = -1;
        if (this.cooling_count > 0)
            this.radiator_index = 0;
        this.num_radiators = 0;
        this.mount_list = ml;
        this.mount_sel = 0;
        this.intake_fan = false;
        this.use_pp = false;
        this.torque_to_struct = false;
        this.cowl_list = cl;
        this.cowl_sel = 0;
        this.use_ds = false;
        this.outboard_prop = false;
        this.gp_count = 0;
        this.gpr_count = 0;
        this.total_reliability = 0;
        this.is_generator = false;
        this.has_alternator = false;
        if (engine_list.get(this.elist_idx).length <= 0)
            throw "No Engine Stats Found.  Should be at least one.";
    }
    toJSON() {
        return {
            selected_stats: this.etype_stats.toJSON(),
            selected_inputs: this.etype_inputs.toJSON(),
            cooling_count: this.cooling_count,
            radiator_index: this.radiator_index,
            selected_mount: this.mount_sel,
            use_pushpull: this.use_pp,
            pp_torque_to_struct: this.torque_to_struct,
            use_driveshafts: this.use_ds,
            geared_propeller_ratio: this.gp_count,
            geared_propeller_reliability: this.gpr_count,
            cowl_sel: this.cowl_sel,
            is_generator: this.is_generator,
            has_alternator: this.has_alternator,
            intake_fan: this.intake_fan,
            outboard_prop: this.outboard_prop,
        };
    }
    oldJSON(js, json_version) {
        const stats = js["selected_stats"];
        this.etype_stats.fromJSON(stats, json_version);
        this.etype_inputs = new EngineInputs();
        if (this.etype_stats.pulsejet && stats["input_pj"]) {
            this.etype_inputs = new EngineInputs();
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;
            const ipj = stats["input_pj"];
            this.etype_inputs.type = ipj["type"];
            this.etype_inputs.power = ipj["power"];
            this.etype_inputs.era_sel = ipj["era_sel"];
            this.etype_inputs.quality_cost = ipj["quality_cost"];
            this.etype_inputs.quality_rely = ipj["quality_rely"];
            this.etype_inputs.starter = ipj["starter"];
        }
        else if (stats["input_eb"]) {
            this.etype_inputs.name = this.etype_stats.name;
            this.etype_inputs.engine_type = ENGINE_TYPE.PROPELLER;
            const ieb = stats["input_eb"];
            this.etype_inputs.displacement = ieb["displacement"];
            this.etype_inputs.compression = ieb["compression"];
            this.etype_inputs.type = ieb["type"];
            this.etype_inputs.cyl_per_row = ieb["cyl_per_row"];
            this.etype_inputs.rows = ieb["rows"];
            this.etype_inputs.RPM_boost = ieb["RPM_boost"];
            this.etype_inputs.era_sel = ieb["era_sel"];
            this.etype_inputs.material_fudge = ieb["material_fudge"];
            this.etype_inputs.quality_fudge = ieb["quality_fudge"];
            this.etype_inputs.upgrades = ieb["upgrades"];
            if (this.etype_inputs.upgrades.length == 6) {
                this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
                if (this.etype_inputs.upgrades[0]) {
                    this.etype_inputs.compressor_type = 2;
                    this.etype_inputs.compressor_count = 1;
                }
                if (this.etype_inputs.upgrades[1]) {
                    this.etype_inputs.compressor_type = 3;
                    this.etype_inputs.compressor_count = 1;
                }
                this.etype_inputs.upgrades.splice(0, 2);
            }
            else {
                this.etype_inputs.compressor_type = ieb["compressor_type"];
                this.etype_inputs.compressor_count = ieb["compressor_count"];
                this.etype_inputs.min_IdealAlt = ieb["min_IAF"];
            }
        }
        else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }
        return this.etype_inputs;
    }
    fromJSON(js, json_version) {
        const engine_list = GetEngineLists();
        let elist_idx = "";
        if (json_version > 10.55) {
            this.etype_stats.fromJSON(js["selected_stats"], json_version);
            const e_inputs = new EngineInputs(js["selected_inputs"]);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        }
        else {
            const e_inputs = this.oldJSON(js, json_version);
            if (e_inputs.name != "Default") {
                elist_idx = SearchAllEngineLists(this.etype_stats.name);
                if (elist_idx == "") {
                    elist_idx = "Custom";
                    engine_list.get(elist_idx).push(e_inputs);
                }
                this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
                this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
            }
        }
        this.elist_idx = elist_idx;
        this.cooling_count = js["cooling_count"];
        this.radiator_index = js["radiator_index"];
        this.mount_sel = js["selected_mount"];
        this.use_pp = js["use_pushpull"];
        this.torque_to_struct = js["pp_torque_to_struct"];
        this.use_ds = js["use_driveshafts"];
        this.gp_count = js["geared_propeller_ratio"];
        this.gpr_count = js["geared_propeller_reliability"];
        this.cowl_sel = js["cowl_sel"];
        this.is_generator = js["is_generator"];
        this.has_alternator = js["has_alternator"];
        this.intake_fan = js["intake_fan"];
        if (json_version >= 12.15) {
            this.outboard_prop = js["outboard_prop"];
        }
        else {
            this.outboard_prop = false;
        }
    }
    serialize(s) {
        this.etype_stats.serialize(s);
        this.etype_inputs.serialize(s);
        s.PushNum(this.cooling_count);
        s.PushNum(this.radiator_index);
        s.PushNum(this.mount_sel);
        s.PushBool(this.use_pp);
        s.PushBool(this.torque_to_struct);
        s.PushBool(this.use_ds);
        s.PushNum(this.gp_count);
        s.PushNum(this.gpr_count);
        s.PushNum(this.cowl_sel);
        s.PushBool(this.is_generator);
        s.PushBool(this.has_alternator);
        s.PushBool(this.intake_fan);
        s.PushBool(this.outboard_prop);
    }
    oldDeserialize(d) {
        this.etype_stats.name = d.GetString();
        this.etype_stats.overspeed = d.GetNum();
        this.etype_stats.altitude = d.GetNum();
        this.etype_stats.torque = d.GetNum();
        this.etype_stats.rumble = d.GetNum();
        this.etype_stats.oiltank = d.GetBool();
        this.etype_stats.pulsejet = d.GetBool();
        this.etype_inputs = new EngineInputs();
        if (d.version > 10.45) {
            this.etype_inputs.name = this.etype_stats.name;
            if (this.etype_stats.pulsejet) {
                this.etype_inputs.engine_type = ENGINE_TYPE.PULSEJET;
                this.etype_inputs.power = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.quality_cost = d.GetNum();
                this.etype_inputs.quality_rely = d.GetNum();
                this.etype_inputs.starter = d.GetBool();
            }
            else {
                this.etype_inputs.displacement = d.GetNum();
                this.etype_inputs.compression = d.GetNum();
                this.etype_inputs.type = d.GetNum();
                this.etype_inputs.cyl_per_row = d.GetNum();
                this.etype_inputs.rows = d.GetNum();
                this.etype_inputs.RPM_boost = d.GetNum();
                this.etype_inputs.era_sel = d.GetNum();
                this.etype_inputs.material_fudge = d.GetNum();
                this.etype_inputs.quality_fudge = d.GetNum();
                this.etype_inputs.upgrades = d.GetBoolArr(0); //Put 0, because we don't have a minimum, and below checks the actual length to decide which version
                if (this.etype_inputs.upgrades.length == 6) {
                    this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
                    if (this.etype_inputs.upgrades[0]) {
                        this.etype_inputs.compressor_type = 2;
                        this.etype_inputs.compressor_count = 1;
                    }
                    if (this.etype_inputs.upgrades[1]) {
                        this.etype_inputs.compressor_type = 3;
                        this.etype_inputs.compressor_count = 1;
                    }
                    this.etype_inputs.upgrades.splice(0, 2);
                }
                else {
                    this.etype_inputs.compressor_type = d.GetNum();
                    this.etype_inputs.compressor_count = d.GetNum();
                    this.etype_inputs.min_IdealAlt = d.GetNum();
                }
            }
        }
        else {
            this.etype_stats.altitude = this.etype_stats.altitude * 10 - 1;
        }
        this.etype_stats.stats.deserialize(d);
        return this.etype_inputs;
    }
    deserialize(d) {
        const engine_list = GetEngineLists();
        var elist_idx = "";
        if (d.version > 10.55) {
            this.etype_stats.deserialize(d);
            const e_inputs = new EngineInputs();
            e_inputs.deserialize(d);
            elist_idx = SearchAllEngineLists(this.etype_stats.name);
            if (elist_idx == "") {
                elist_idx = "Custom";
                if (e_inputs.name != "Default") {
                    engine_list.get(elist_idx).push(e_inputs);
                }
            }
            this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
            this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
        }
        else {
            const e_inputs = this.oldDeserialize(d);
            if (e_inputs.name != "Default") {
                elist_idx = SearchAllEngineLists(this.etype_stats.name);
                if (elist_idx == "") {
                    elist_idx = "Custom";
                    engine_list.get(elist_idx).push(e_inputs);
                }
                this.etype_stats = engine_list.get(elist_idx).get_stats_name(this.etype_stats.name);
                this.etype_inputs = engine_list.get(elist_idx).get_name(this.etype_stats.name);
            }
        }
        this.cooling_count = d.GetNum();
        this.radiator_index = d.GetNum();
        this.mount_sel = d.GetNum();
        this.use_pp = d.GetBool();
        this.torque_to_struct = d.GetBool();
        this.use_ds = d.GetBool();
        this.gp_count = d.GetNum();
        this.gpr_count = d.GetNum();
        this.cowl_sel = d.GetNum();
        this.is_generator = d.GetBool();
        this.has_alternator = d.GetBool();
        this.intake_fan = d.GetBool();
        if (d.version >= 12.15) {
            this.outboard_prop = d.GetBool();
        }
        else {
            this.outboard_prop = false;
        }
        this.elist_idx = elist_idx;
    }
    GetMinAltitude() {
        return this.etype_inputs.min_IdealAlt;
    }
    GetMaxAltitude() {
        return this.GetMinAltitude() + this.etype_stats.altitude;
    }
    GetMinIAF() {
        return Math.floor(1.0e-6 + this.GetMinAltitude() / 10);
    }
    GetMaxIAF() {
        return Math.floor(1.0e-6 + this.GetMaxAltitude() / 10);
    }
    CanSelectIndex() {
        const elist_temp = GetEngineLists().get(this.elist_idx);
        const can = [...Array(elist_temp.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < elist_temp.length; i++) {
                if (elist_temp.get(i).engine_type == ENGINE_TYPE.PULSEJET
                    || (elist_temp.get(i).engine_type == ENGINE_TYPE.TURBOMACHINERY && (elist_temp.get(i).type == 1 || elist_temp.get(i).type == 2))) //If Turbofan or Turboprop
                    can[i] = false;
            }
        }
        return can;
    }
    SetSelectedIndex(num) {
        const engine_list = GetEngineLists();
        this.etype_stats = engine_list.get(this.elist_idx).get_stats(num);
        this.etype_inputs = engine_list.get(this.elist_idx).get(num);
        if (this.use_pp)
            this.cooling_count = 2 * this.etype_stats.stats.cooling;
        else
            this.cooling_count = this.etype_stats.stats.cooling;
        if (this.radiator_index < 0)
            this.radiator_index = 0;
        this.PulseJetCheck();
        this.VerifyCowl(this.cowl_sel);
        this.CalculateStats();
    }
    GetSelectedIndex() {
        return GetEngineLists().get(this.elist_idx).find_name(this.etype_stats.name);
    }
    GetCurrentStats() {
        return this.etype_stats.Clone();
    }
    NeedCooling() {
        return this.etype_stats.stats.cooling > 0;
    }
    WarnCoolingReliability() {
        return (this.cooling_count < this.etype_stats.stats.cooling);
    }
    SetCooling(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.cooling_count = num;
        if (this.NeedCooling()) {
            this.cooling_count = Math.max(1, this.cooling_count);
        }
        this.CalculateStats();
    }
    GetCooling() {
        return this.cooling_count;
    }
    GetMaxCooling() {
        if (this.use_pp)
            return 2 * this.etype_stats.stats.cooling;
        return this.etype_stats.stats.cooling;
    }
    SetNumRadiators(num) {
        this.num_radiators = num;
        if (this.radiator_index >= num)
            this.radiator_index = num - 1;
        if (this.radiator_index < 0 && num > 0)
            this.radiator_index = 0;
    }
    GetNumRadiators() {
        return this.num_radiators;
    }
    SetRadiator(num) {
        this.radiator_index = num;
        this.CalculateStats();
    }
    GetRadiator() {
        return this.radiator_index;
    }
    CanIntakeFan() {
        return this.IsAirCooled();
    }
    SetIntakeFan(use) {
        this.intake_fan = use;
        this.CalculateStats();
    }
    GetIntakeFan() {
        return this.intake_fan;
    }
    CanOutboardProp() {
        return this.use_ds && (this.IsTractor() || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull");
    }
    GetOutboardProp() {
        return this.outboard_prop;
    }
    SetOutboardProp(use) {
        if (use && this.use_ds) {
            this.outboard_prop = true;
        }
        else {
            this.outboard_prop = false;
        }
        this.CalculateStats();
    }
    SetSelectedList(n) {
        if (n != this.elist_idx) {
            this.elist_idx = n;
            this.SetSelectedIndex(0); //This calls CalculateStats
        }
    }
    GetSelectedList() {
        return this.elist_idx;
    }
    GetListOfEngines() {
        return GetEngineLists().get(this.elist_idx);
    }
    RequiresExtendedDriveshafts() {
        if (this.is_internal)
            return false;
        return this.mount_list[this.mount_sel].reqED;
    }
    SetTailMods(forb, swr, canard) {
        if (this.mount_list[this.mount_sel].reqTail && !(forb || swr) && !this.GetGenerator())
            this.use_ds = true;
        if (this.mount_list[this.mount_sel].reqED && !this.GetGenerator() && !(canard && (forb || swr)))
            this.use_ds = true;
    }
    CanMountIndex() {
        var can = [...Array(this.mount_list.length).fill(true)];
        if (this.is_internal) {
            for (let i = 0; i < can.length; ++i) {
                can[i] = this.mount_list[i].helicopter;
            }
        }
        else if (this.GetIsTurbine() && !this.GetIsTurboprop()) {
            for (let i = 0; i < can.length; ++i) {
                can[i] = this.mount_list[i].turbine;
            }
        }
        else if (this.is_generator) {
            can = [...Array(this.mount_list.length).fill(false)];
            can[0] = true;
        }
        else {
            if (this.use_pp) {
                for (let i = 0; i < can.length; ++i) {
                    if (this.mount_list[i].mount_type == "fuselage"
                        && this.mount_list[i].name != "Fuselage Push-Pull") {
                        can[i] = false;
                    }
                    if (this.mount_list[i].turbine) {
                        can[i] = false;
                    }
                }
            }
            else {
                for (let i = 0; i < can.length; ++i) {
                    if (this.mount_list[i].name == "Fuselage Push-Pull") {
                        can[i] = false;
                    }
                    if (this.mount_list[i].turbine) {
                        can[i] = false;
                    }
                }
            }
        }
        return can;
    }
    SetMountIndex(num) {
        if (num >= this.mount_list.length)
            throw "Index outside of mount_list range.";
        this.mount_sel = num;
        if (this.mount_list[this.mount_sel].reqED)
            this.SetUseExtendedDriveshaft(true);
        this.CalculateStats();
    }
    GetMountIndex() {
        if (this.GetIsPulsejet())
            return -1;
        return this.mount_sel;
    }
    CanUsePushPull() {
        return !(this.is_generator || this.GetIsJet() || this.is_internal || this.mount_list[this.mount_sel].helicopter);
    }
    SetUsePushPull(use) {
        this.use_pp = use;
        if (use) {
            this.cooling_count *= 2;
            if (this.mount_list[this.mount_sel].mount_type == "fuselage") {
                this.mount_sel = 8;
            }
        }
        else {
            this.cooling_count = Math.floor(1.0e-6 + this.cooling_count / 2);
            if (this.mount_list[this.mount_sel].name == "Fuselage Push-Pull") {
                this.mount_sel = 0;
            }
        }
        this.CalculateStats();
    }
    GetUsePushPull() {
        return this.use_pp;
    }
    GetMountList() {
        return this.mount_list;
    }
    CanUseExtendedDriveshaft() {
        return !((this.GetNumPropellers() == 0) || this.is_internal || this.GetGenerator() || this.mount_list[this.mount_sel].helicopter);
    }
    SetUseExtendedDriveshaft(use) {
        if (this.GetGenerator() || this.is_internal) {
            this.use_ds = false;
        }
        else {
            this.use_ds = use;
        }
        this.CalculateStats();
    }
    GetUseExtendedDriveshaft() {
        return this.use_ds;
    }
    CanUseGears() {
        return !((this.GetNumPropellers() == 0) || this.GetGenerator());
    }
    SetGearCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gp_count = num;
        this.SetGearReliability(this.gpr_count);
    }
    GetGearCount() {
        return this.gp_count;
    }
    SetGearReliability(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.gpr_count = Math.min(num, this.gp_count);
        this.CalculateStats();
    }
    GetGearReliability() {
        return this.gpr_count;
    }
    SetTorqueToStruct(use) {
        this.torque_to_struct = use;
        if (!this.use_pp)
            this.torque_to_struct = false;
        this.CalculateStats();
    }
    GetTorqueToStruct() {
        return this.torque_to_struct;
    }
    CanTorqueToStruct() {
        return this.use_pp && this.etype_stats.torque > 0 && this.mount_list[this.mount_sel].mount_type != "pod";
    }
    UpdateReliability(num) {
        this.total_reliability = this.etype_stats.stats.reliability;
        this.total_reliability -= (this.gp_count - this.gpr_count);
        this.total_reliability += this.cowl_list[this.cowl_sel].stats.reliability;
        if (this.NeedCooling()) {
            this.total_reliability -= (this.GetMaxCooling() - this.cooling_count);
        }
        if (this.GetIntakeFan()) {
            this.total_reliability += 6;
        }
        this.total_reliability += num;
    }
    GetReliability() {
        if (this.use_pp) {
            if (this.outboard_prop) {
                return this.total_reliability.toString() + '/' + (this.total_reliability - 2).toString();
            }
            return this.total_reliability.toString() + '/' + this.total_reliability.toString();
        }
        //else
        if (this.outboard_prop) {
            return (this.total_reliability - 2).toString();
        }
        return this.total_reliability.toString();
    }
    GetOverspeed() {
        if (this.is_generator)
            return 1000;
        return this.etype_stats.overspeed + Math.floor(1.0e-6 + this.gp_count * this.etype_stats.overspeed / 2);
    }
    GetIsPulsejet() {
        return this.etype_stats.pulsejet;
    }
    GetIsJet() {
        return this.GetIsPulsejet() || (this.GetIsTurbine() && !this.GetIsTurboprop());
    }
    PulseJetCheck() {
        if (this.GetIsPulsejet()) {
            this.use_pp = false;
            this.use_ds = false;
            this.gp_count = 0;
            this.gpr_count = 0;
            this.cooling_count = 0;
            this.has_alternator = false;
            this.is_generator = false;
            this.cowl_sel = 0;
            this.radiator_index = -1;
        }
    }
    GetIsTurbine() {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY;
    }
    GetIsTurboprop() {
        return this.etype_inputs.engine_type == ENGINE_TYPE.TURBOMACHINERY && this.etype_inputs.type == 3;
    }
    TurbineCheck() {
        if (this.GetIsTurbine()) {
            if (this.GetNumPropellers() == 0) {
                this.use_ds = false;
                this.gp_count = 0;
                this.gpr_count = 0;
            }
            this.cooling_count = 0;
            this.cowl_sel = 0;
            this.radiator_index = -1;
        }
    }
    GetNumPropellers() {
        if (!(this.GetIsPulsejet() || this.GetIsTurbine() || this.GetGenerator()) || this.GetIsTurboprop() || this.is_internal) {
            if (this.use_pp) {
                return 2;
            }
            return 1;
        }
        return 0;
    }
    GetIsTractorNacelle() {
        if (this.GetNumPropellers() > 0
            && !this.GetUsePushPull()
            && this.mount_list[this.mount_sel].powerfactor == 0.8
            && !this.is_internal)
            return true;
        return false;
    }
    IsLiquidCooled() {
        return this.NeedCooling();
    }
    IsRotary() {
        return this.etype_stats.oiltank;
    }
    IsContraRotary() {
        if (!this.GetIsPulsejet() && !this.GetIsTurbine()) {
            if (this.elist_idx != ""
                && this.etype_inputs.type == 3) {
                return true;
            }
        }
        return false;
    }
    IsAirCooled() {
        return !this.GetIsPulsejet() && !this.GetIsTurbine() && !this.IsLiquidCooled() && !this.IsRotary();
    }
    GetCowlList() {
        return this.cowl_list;
    }
    GetCowl() {
        return this.cowl_sel;
    }
    GetCowlEnabled() {
        const lst = [];
        for (const c of this.cowl_list) {
            if (this.GetIsPulsejet() || this.GetIsTurbine()) { //Pulsejets no cowl
                lst.push(c.air && c.rotary && c.liquid); //Only no cowl
            }
            else if (this.IsLiquidCooled()) {
                lst.push(c.liquid);
            }
            else if (this.IsRotary()) {
                lst.push(c.rotary);
            }
            else { //Means air cooled
                lst.push(c.air);
            }
        }
        return lst;
    }
    GetHasOilTank() {
        return this.etype_stats.oiltank;
    }
    GetHasOilCooler() {
        return this.etype_stats.stats.cooling > 0;
    }
    GetHasOilPan() {
        return this.IsAirCooled();
    }
    VerifyCowl(num) {
        const can = this.GetCowlEnabled();
        if (can[num])
            this.cowl_sel = num;
        if (!can[this.cowl_sel])
            this.cowl_sel = 0;
    }
    SetCowl(num) {
        this.VerifyCowl(num);
        this.CalculateStats();
    }
    GetGeneratorEnabled() {
        return !(this.GetIsPulsejet() || this.use_pp);
    }
    GetGenerator() {
        return this.is_generator;
    }
    SetGenerator(use) {
        if (this.GetGeneratorEnabled()) {
            this.is_generator = use;
        }
        else {
            this.is_generator = false;
        }
        if (this.is_generator) {
            this.gp_count = 0;
            this.gpr_count = 0;
            this.use_ds = false;
        }
        this.CalculateStats();
    }
    GetAlternatorEnabled() {
        return !this.GetIsPulsejet() && !this.is_generator && this.etype_inputs.engine_type != ENGINE_TYPE.ELECTRIC;
    }
    GetAlternator() {
        return this.has_alternator;
    }
    SetAlternator(use) {
        if (this.GetAlternatorEnabled()) {
            this.has_alternator = use;
        }
        else {
            this.has_alternator = false;
        }
        this.CalculateStats();
    }
    GetRumble() {
        return this.etype_stats.rumble;
    }
    IsTractor() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.mount_sel].name == "Tractor"
            || this.mount_list[this.mount_sel].name == "Center-Mounted Tractor"
            || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull";
    }
    GetTractorSpinner() {
        return {
            has: this.IsTractor() && !(this.outboard_prop && !this.use_pp),
            spinner: this.GetSpinner()
        };
    }
    IsPusher() {
        if (this.is_internal || this.GetGenerator())
            return false;
        return this.mount_list[this.mount_sel].name == "Rear-Mounted Pusher"
            || this.mount_list[this.mount_sel].name == "Center-Mounted Pusher"
            || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull";
    }
    GetPusherSpinner() {
        return {
            has: this.IsPusher() && !this.outboard_prop,
            spinner: this.GetSpinner()
        };
    }
    GetSpinner() {
        if (this.gp_count > 0 && !this.GetGenerator() && !this.outboard_prop) {
            if (this.use_ds &&
                (this.mount_list[this.mount_sel].name == "Center-Mounted Tractor"
                    || this.mount_list[this.mount_sel].name == "Center-Mounted Pusher"
                    || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull")) { //Uses Extended Driveshafts, can be arty, and rotary engine
                return [true, true];
            }
            else if (!this.etype_stats.oiltank) { //Not rotary, so room for gun but not arty.
                return [true, false];
            }
        }
        //No spinner weapons
        return [false, false];
    }
    IsElectrics() {
        return this.has_alternator || this.GetGenerator();
    }
    GetEngineHeight() {
        if (!this.GetGenerator()) {
            if (this.mount_list[this.mount_sel].name == "Pod" || this.etype_stats.pulsejet || this.is_internal || this.outboard_prop)
                return 2;
            else if (this.mount_list[this.mount_sel].name == "Nacelle (Offset)")
                return 1;
            else if (this.mount_list[this.mount_sel].name == "Nacelle (Inside)"
                || this.mount_list[this.mount_sel].name == "Channel Tractor"
                || this.mount_list[this.mount_sel].name == "Wing Pod")
                return 0;
            else
                return -1;
        }
        else {
            return 5;
        }
    }
    IsTractorRotary() {
        if (this.GetGenerator())
            return false;
        return this.IsRotary() &&
            (this.mount_list[this.mount_sel].name == "Tractor"
                || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull");
    }
    IsDiesel() {
        return this.etype_inputs.upgrades[3];
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    SetInternal(is) {
        this.is_internal = is;
        if (is) {
            this.use_ds = false;
        }
    }
    VerifyMount() {
        if (this.GetIsTurbine() && !this.GetIsTurboprop()) {
            while (!this.mount_list[this.mount_sel].turbine) {
                this.mount_sel++;
            }
        }
        else if (this.GetIsPulsejet()) {
            if (this.mount_list[this.mount_sel].mount_type == "fuselage") {
                for (let i = 0; i < this.mount_list.length; i++) {
                    this.mount_sel = i;
                    if (this.mount_list[this.mount_sel].mount_type != "fuselage")
                        break;
                }
            }
        }
        else if (this.is_internal) {
            if (!this.CanMountIndex()[this.mount_sel])
                this.mount_sel = 1;
        }
        else if (this.is_generator) {
            this.mount_sel = 0;
        }
        else {
            if (this.mount_list[this.mount_sel].turbine) {
                if (this.use_pp) {
                    this.mount_sel = 8;
                }
                else {
                    this.mount_sel = 0;
                }
            }
        }
    }
    VerifyCooling() {
        if (this.NeedCooling() && this.radiator_index < 0) {
            this.radiator_index = 0;
        }
        else if (!this.NeedCooling()) {
            this.radiator_index = -1;
        }
    }
    ElectricCheck() {
        if (this.etype_inputs.engine_type == ENGINE_TYPE.ELECTRIC) {
            this.has_alternator = false;
        }
    }
    PartStats() {
        this.VerifyMount();
        this.VerifyCooling();
        this.PulseJetCheck();
        this.TurbineCheck();
        this.ElectricCheck();
        if (!this.CanUseExtendedDriveshaft()) {
            this.use_ds = false;
        }
        if (!this.CanOutboardProp()) {
            this.outboard_prop = false;
        }
        let stats = new Stats;
        stats = stats.Add(this.etype_stats.stats);
        stats.upkeep = stats.power / 10;
        if (this.etype_stats.oiltank)
            stats.mass += 1;
        var torque = this.etype_stats.torque;
        if (this.mount_list[this.mount_sel].helicopter) {
            if (this.IsRotary())
                torque = Math.floor(1.0e-6 + torque / 2);
            else
                torque = 0;
        }
        if (this.torque_to_struct)
            stats.structure -= this.etype_stats.torque;
        else {
            if (this.mount_list[this.mount_sel].mount_type == "wing")
                stats.maxstrain -= this.etype_stats.torque;
            else if (this.mount_list[this.mount_sel].mount_type == "fuselage")
                stats.latstab -= this.etype_stats.torque;
        }
        //ContraRotary Engines need geared propellers to function.
        if (this.IsContraRotary()) {
            this.gp_count = Math.max(1, this.gp_count);
        }
        stats.cost += this.gp_count + this.gpr_count;
        if (this.gp_count > 0) {
            stats.era.push({ name: "Propeller Gearing", era: "WWI" });
        }
        if (this.gpr_count > 0) {
            stats.era.push({ name: "Reliable Gearing", era: "Roaring 20s" });
        }
        //Extended Driveshafts
        if (this.use_ds) {
            stats.mass += 1;
        }
        //Cowls modify engine stats directly, not mounting or upgrade.
        stats = stats.Add(this.cowl_list[this.cowl_sel].stats);
        stats.mass += Math.floor(1.0e-6 + stats.drag * this.cowl_list[this.cowl_sel].mpd);
        stats.drag = Math.floor(1.0e-6 + stats.drag * this.cowl_list[this.cowl_sel].ed);
        //Push-pull
        if (this.use_pp) {
            stats.power *= 2;
            stats.mass *= 2;
            stats.cooling *= 2;
            stats.fuelconsumption *= 2;
            stats.cost *= 2;
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.upkeep *= 2;
            stats.reqsections *= 2;
            stats.power = Math.floor(1.0e-6 + this.mount_list[this.mount_sel].powerfactor * stats.power);
        }
        //If there is a cowl, and it's a pusher (or push-pull), add the engineering cost
        if (this.cowl_sel != 0 &&
            (this.mount_list[this.mount_sel].name == "Rear-Mounted Pusher" ||
                this.mount_list[this.mount_sel].name == "Center-Mounted Pusher"
                || this.mount_list[this.mount_sel].name == "Fuselage Push-Pull")) {
            stats.cost += 2;
        }
        //Air Cooling Fan (only 1 / push-pull)
        if (this.IsAirCooled() && this.intake_fan) {
            stats.mass += 3;
            //Double Effect of Torque
            stats.latstab *= 2;
            stats.structure *= 2;
            stats.maxstrain *= 2;
            stats.cost += 4;
            stats.era.push({ name: "Air Cooling Fan", era: "WWII" });
        }
        else {
            this.intake_fan = false;
        }
        //Move here so it doesn't get affected by cowl.
        if (this.GetHasOilCooler()) {
            stats.drag += Math.floor(stats.power / 15);
        }
        // Mounting modifiers (only get applied once, even with push/pull)
        //No Mounting for pulse-jets, just bolted on
        if (!(this.GetIsPulsejet())) {
            stats = stats.Add(this.mount_list[this.mount_sel].stats);
            stats.maxstrain -= Math.floor(1.0e-6 + this.mount_list[this.mount_sel].strainfactor * this.etype_stats.stats.mass);
            stats.drag += Math.floor(1.0e-6 + this.mount_list[this.mount_sel].dragfactor * this.etype_stats.stats.mass);
        }
        // Power Generation
        if (this.is_generator) {
            stats.charge = Math.floor(1.0e-6 + 2 * stats.power / 10) + 2;
            stats.power = 0;
        }
        else if (this.has_alternator) {
            stats.charge = Math.floor(1.0e-6 + stats.power / 10) + 1;
            stats.mass += 1;
            stats.cost += 2;
        }
        if (this.outboard_prop) {
            stats.drag += 3;
            if (this.use_pp) {
                stats.escape += 2;
            }
        }
        stats.pitchspeed = 0;
        //Reliability is a part local issue.
        stats.reliability = 0;
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Radiator.ts


class Radiator extends Part {
    constructor(tl, ml, cl) {
        super();
        this.need_cool = 0;
        this.idx_type = 1;
        this.idx_mount = 1;
        this.idx_coolant = 0;
        this.metal_area = 0;
        this.engine_count = 0;
        this.type_list = tl;
        this.mount_list = ml;
        this.coolant_list = cl;
        this.harden_cool = false;
    }
    toJSON() {
        return {
            type: this.idx_type,
            mount: this.idx_mount,
            coolant: this.idx_coolant,
            harden_cool: this.harden_cool,
        };
    }
    fromJSON(js, json_version) {
        this.idx_type = js["type"];
        this.idx_mount = js["mount"];
        this.idx_coolant = js["coolant"];
        if (json_version > 10.85) {
            this.harden_cool = js["harden_cool"];
        }
    }
    serialize(s) {
        s.PushNum(this.idx_type);
        s.PushNum(this.idx_mount);
        s.PushNum(this.idx_coolant);
        s.PushBool(this.harden_cool);
    }
    derserialize(d) {
        this.idx_type = d.GetNum();
        this.idx_mount = d.GetNum();
        this.idx_coolant = d.GetNum();
        if (d.version > 10.85) {
            this.harden_cool = d.GetBool();
        }
    }
    GetTypeList() {
        return this.type_list;
    }
    GetMountList() {
        return this.mount_list;
    }
    GetCoolantList() {
        return this.coolant_list;
    }
    CanType() {
        const can = [...Array(this.type_list.length).fill(true)];
        for (let i = 0; i < this.type_list.length; i++) {
            if (this.type_list[i].name == "Evaporation" && this.metal_area < this.engine_count * 5)
                can[i] = false;
        }
        return can;
    }
    SetTypeIndex(num) {
        this.idx_type = num;
        this.CalculateStats();
    }
    GetTypeIndex() {
        return this.idx_type;
    }
    SetParasol(has) {
        this.has_parasol = has;
        if (!this.CanMount()[this.idx_mount])
            this.idx_mount = 0;
    }
    CanMount() {
        const can = [...Array(this.mount_list.length).fill(true)];
        for (let i = 0; i < this.mount_list.length; i++) {
            if (this.mount_list[i].name == "High Offset" && !this.has_parasol)
                can[i] = false;
        }
        return can;
    }
    SetMountIndex(num) {
        if (this.CanMount()[num]) {
            this.idx_mount = num;
            this.CalculateStats();
        }
    }
    GetMountIndex() {
        return this.idx_mount;
    }
    SetCoolantIndex(num) {
        this.idx_coolant = num;
        this.CalculateStats();
    }
    GetCoolantIndex() {
        return this.idx_coolant;
    }
    SetNeedCool(num, engnum) {
        this.need_cool = num;
        this.engine_count = engnum;
    }
    SetMetalArea(num) {
        this.metal_area = num;
        if (!this.CanType()[this.idx_type])
            this.idx_type = 0;
    }
    GetHarden() {
        return this.harden_cool;
    }
    SetHarden(use) {
        this.harden_cool = use;
        this.CalculateStats();
    }
    VerifyHarden() {
        if (this.coolant_list[this.idx_coolant].harden) {
            this.harden_cool = true;
        }
    }
    GetIsFlammable() {
        return this.coolant_list[this.idx_coolant].flammable;
    }
    PartStats() {
        this.VerifyHarden();
        var stats = new Stats();
        stats.mass = 3;
        stats = stats.Add(this.type_list[this.idx_type].stats);
        stats = stats.Add(this.mount_list[this.idx_mount].stats);
        stats = stats.Add(this.coolant_list[this.idx_coolant].stats);
        stats.drag += Math.ceil(-1.0e-6 + this.type_list[this.idx_type].dragpercool * (this.need_cool - stats.cooling));
        if (this.harden_cool) {
            stats.cost += 2;
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Engines.ts







class Engines extends Part {
    constructor(js) {
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
            this.r_type_list.push({ name: elem["name"], stats: new Stats(elem), dragpercool: elem["dragpercool"] });
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
    toJSON() {
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
    fromJSON(js, json_version) {
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
    serialize(s) {
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
    deserialize(d) {
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
    GetHasOilTank() {
        for (const e of this.engines) {
            if (e.GetCurrentStats().oiltank)
                return true;
        }
        return false;
    }
    GetReliabilityList() {
        var lst = [];
        for (const e of this.engines) {
            lst.push(e.GetReliability());
        }
        return lst;
    }
    GetMinIAF() {
        var m = 0;
        for (const e of this.engines) {
            m = Math.max(m, e.GetMinIAF());
        }
        return m;
    }
    GetMaxIAF() {
        var m = 100;
        for (const e of this.engines) {
            m = Math.min(m, e.GetMaxIAF());
        }
        return m;
    }
    GetMinAltitude() {
        var m = 0;
        for (const e of this.engines) {
            m = Math.max(m, e.GetMinAltitude());
        }
        return m;
    }
    GetMaxAltitude() {
        var m = 1000;
        for (const e of this.engines) {
            m = Math.min(m, e.GetMaxAltitude());
        }
        return m;
    }
    SetNumberOfEngines(num) {
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
    GetNumberOfEngines() {
        let count = 0;
        for (const e of this.engines) {
            if (!e.GetGenerator())
                count++;
        }
        return count;
    }
    GetNumberOfItems() {
        return this.engines.length;
    }
    GetEngine(num) {
        return this.engines[num];
    }
    GetRadiator(num) {
        return this.radiators[num];
    }
    SetNumberOfRadiators(num) {
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
    GetNumberOfRadiators() {
        if (this.radiators.length == 0 && this.NeedCooling())
            this.SetNumberOfRadiators(1);
        else if (this.radiators.length > 0 && !this.NeedCooling())
            this.SetNumberOfRadiators(0);
        return this.radiators.length;
    }
    NeedCooling() {
        let need = false;
        for (const elem of this.engines) {
            need = need || elem.NeedCooling();
        }
        return need;
    }
    UpdateReliability(stats) {
        for (const elem of this.engines) {
            let rad_stats = new Stats();
            if (elem.GetRadiator() < this.radiators.length && elem.GetRadiator() >= 0) {
                rad_stats = this.radiators[elem.GetRadiator()].PartStats();
            }
            elem.UpdateReliability(stats.reliability + rad_stats.reliability);
        }
    }
    SetAsymmetry(use) {
        this.is_asymmetric = use;
        this.CalculateStats();
    }
    GetAsymmetry() {
        return this.is_asymmetric;
    }
    GetNumPropellers() {
        var count = 0;
        for (const e of this.engines) {
            count += e.GetNumPropellers();
        }
        return count;
    }
    GetOverspeed() {
        let os = 100;
        for (const e of this.engines)
            os = Math.min(os, e.GetOverspeed());
        return os;
    }
    GetRumble() {
        var r = 0;
        for (const e of this.engines)
            r += e.GetRumble();
        return r;
    }
    GetMaxRumble() {
        var r = 0;
        for (const e of this.engines)
            r = Math.max(r, e.GetRumble());
        return r;
    }
    GetTractorSpinner() {
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
    GetPusherSpinner() {
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
    IsElectrics() {
        for (const e of this.engines) {
            if (e.IsElectrics())
                return true;
        }
        return false;
    }
    HaveParasol(has) {
        for (const r of this.radiators) {
            r.SetParasol(has);
        }
    }
    SetMetalArea(num) {
        for (const r of this.radiators) {
            r.SetMetalArea(num);
        }
    }
    SetTailMods(forb, swr, canard) {
        for (const e of this.engines)
            e.SetTailMods(forb, swr, canard);
    }
    GetEngineHeight() {
        var min = 2;
        for (const e of this.engines)
            min = Math.min(min, e.GetEngineHeight());
        return min;
    }
    HasTractorRotary() {
        for (const e of this.engines) {
            if (e.IsTractorRotary())
                return true;
        }
        return false;
    }
    SetInternal(is) {
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
    HasPulsejet() {
        for (const e of this.engines) {
            if (e.GetIsPulsejet())
                return true;
        }
        return false;
    }
    HasTurbineNoProp() {
        for (const e of this.engines) {
            if (e.GetIsTurbine() && e.GetNumPropellers() == 0)
                return true;
        }
        return false;
    }
    HasDiesel() {
        for (const e of this.engines) {
            if (e.IsDiesel())
                return true;
        }
        return false;
    }
    GetEngineTypes() {
        var lst = [];
        for (const en of this.engines) {
            if (en.GetNumPropellers() > 0) {
                lst.push({ type: DRIVE_TYPE.PROPELLER, num: en.GetNumPropellers() });
            }
            else if (en.GetIsPulsejet()) {
                lst.push({ type: DRIVE_TYPE.PULSEJET, num: 0 });
            }
            else if (en.GetIsTurbine()) {
                lst.push({ type: DRIVE_TYPE.TURBINE, num: en.GetCurrentStats().stats.pitchspeed });
            }
        }
        return lst;
    }
    GetIsFlammable() {
        for (const r of this.radiators) {
            if (r.GetIsFlammable())
                return true;
        }
        return false;
    }
    PartStats() {
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
                }
                else {
                    warningmap.set(w.source, [i + 1]);
                }
            }
        }
        for (const w of radstats.warnings) {
            w.source = Localization_lu("Radiators #", string_StringFmt.Join(",", warningmap.get(w.source))) + " " + w.source;
        }
        stats = stats.Add(radstats);
        //Asymmetric planes
        if (this.is_asymmetric)
            stats.latstab -= 3;
        if (this.HasPulsejet()) {
            stats.warnings.push({
                source: Localization_lu("Pulsejets"), warning: Localization_lu("Pulsejet Boost Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        if (this.HasTurbineNoProp()) {
            stats.warnings.push({
                source: Localization_lu("Turbine"), warning: Localization_lu("Turbine Boost Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        if (this.HasDiesel()) {
            stats.warnings.push({
                source: Localization_lu("Diesel"), warning: Localization_lu("Diesel Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        var rotationT = 0;
        for (const e of this.engines) {
            if (e.IsRotary()) {
                if (e.GetUsePushPull() && e.GetTorqueToStruct()) {
                    // No change to RotationT
                }
                else if (e.GetUsePushPull() && e.IsTractor()) {
                    rotationT += 2;
                }
                else if (e.IsTractor()) {
                    rotationT++;
                }
                else if (e.IsPusher()) {
                    rotationT--;
                }
            }
        }
        if (rotationT > 0) {
            stats.warnings.push({
                source: Localization_lu("Rotary"), warning: Localization_lu("Rotary Right Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        else if (rotationT < 0) {
            stats.warnings.push({
                source: Localization_lu("Rotary"), warning: Localization_lu("Rotary Left Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        //Part local, gets handled in UpdateReliability
        stats.reliability = 0;
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetHasTractorNacelles() {
        let has = 0;
        for (const en of this.engines) {
            if (en.GetIsTractorNacelle())
                has++;
        }
        return has > 1;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        for (let e = 0; e < this.engines.length; e++) {
            const s = this.engines[e].PartStats();
            if (s.charge != 0) {
                value.equipment.push({
                    source: Localization_lu("Vital Part Engine", e),
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

;// CONCATENATED MODULE: ./src/impl/Propeller.ts



class Propeller extends Part {
    constructor(json) {
        super();
        this.engines = [];
        this.idx_prop = 2;
        this.prop_list = [];
        for (const elem of json["props"]) {
            this.prop_list.push({
                name: elem["name"], stats: new Stats(elem),
                energy: elem["energy"], turn: elem["turn"],
            });
        }
        this.idx_upg = 0;
        this.upg_list = [];
        for (const elem of json["upgrades"]) {
            this.upg_list.push({
                name: elem["name"], stats: new Stats(elem),
                energy: elem["energy"], turn: elem["turn"],
            });
        }
    }
    toJSON() {
        return {
            type: this.idx_prop,
            upgrade: this.idx_upg
        };
    }
    fromJSON(js, json_version) {
        this.idx_prop = js["type"];
        if (json_version < 11.35) {
            this.idx_upg = 0;
            if (js["use_variable"])
                this.idx_upg = 1;
            if (this.idx_prop == 5) {
                this.idx_upg = 2;
                this.idx_prop = 2;
            }
        }
        else {
            this.idx_upg = js["upgrade"];
        }
    }
    serialize(s) {
        s.PushNum(this.idx_prop);
        s.PushNum(this.idx_upg);
    }
    deserialize(d) {
        this.idx_prop = d.GetNum();
        if (d.version < 11.35) {
            this.idx_upg = 0;
            if (d.GetBool())
                this.idx_upg = 1;
            if (this.idx_prop == 5) {
                this.idx_upg = 2;
                this.idx_prop = 2;
            }
        }
        else {
            this.idx_upg = d.GetNum();
        }
    }
    GetPropList() {
        return this.prop_list;
    }
    GetUpgradeList() {
        return this.upg_list;
    }
    SetPropIndex(num) {
        this.idx_prop = num;
        this.CalculateStats();
    }
    GetPropIndex() {
        return this.idx_prop;
    }
    SetUpgradeIndex(use) {
        this.idx_upg = use;
        this.CalculateStats();
    }
    GetUpgradeIndex() {
        return this.idx_upg;
    }
    SetEngineTypes(engines) {
        this.engines = engines;
    }
    GetNumPropellers() {
        var num_propellers = 0;
        for (const e of this.engines) {
            if (e.type == DRIVE_TYPE.PROPELLER) {
                num_propellers += e.num;
            }
        }
        return num_propellers;
    }
    GetEnergy() {
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER)
            return 2.5;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC)
            return 6;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER)
            return 8;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
            return 5;
        if (this.engines.length == 0)
            return 2.5;
        var E = 999;
        for (const e of this.engines) {
            switch (e.type) {
                case DRIVE_TYPE.PROPELLER:
                    E = Math.min(E, this.prop_list[this.idx_prop].energy + this.upg_list[this.idx_upg].energy);
                    break;
                case DRIVE_TYPE.PULSEJET:
                    E = Math.min(E, 5);
                    break;
                case DRIVE_TYPE.TURBINE:
                    E = Math.min(E, 9);
                    break;
                default:
                    throw "Not a known Engine Type.";
            }
        }
        return E;
    }
    GetTurn() {
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER)
            return 6;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC)
            return 7;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER)
            return 8;
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
            return 5;
        if (this.engines.length == 0)
            return 6;
        var T = 999;
        for (const e of this.engines) {
            switch (e.type) {
                case DRIVE_TYPE.PROPELLER:
                    T = Math.min(T, this.prop_list[this.idx_prop].turn + this.upg_list[this.idx_upg].turn);
                    break;
                case DRIVE_TYPE.PULSEJET:
                    T = Math.min(T, 7);
                    break;
                case DRIVE_TYPE.TURBINE:
                    T = Math.min(T, 4);
                    break;
                default:
                    throw "Not a known Engine Type.";
            }
        }
        return T;
    }
    SetAcftType(type) {
        this.acft_type = type;
    }
    PartStats() {
        var stats = new Stats();
        if (this.GetNumPropellers() != 0) {
            stats = stats.Add(this.prop_list[this.idx_prop].stats.Multiply(this.GetNumPropellers()));
            stats = stats.Add(this.upg_list[this.idx_upg].stats.Multiply(this.GetNumPropellers()));
        }
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        }
        else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            stats.pitchboost = 0.6;
            stats.pitchspeed = 0.8;
        }
        else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            stats.pitchboost = 0.8;
            stats.pitchspeed = 0.8;
        }
        else if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            stats.pitchboost = 1;
            stats.pitchspeed = 0.6;
        }
        else if (this.engines.length == 0) {
            //Default, no auto pitch
            stats.pitchboost = 0.6;
            stats.pitchspeed = 1;
        }
        else {
            stats.pitchboost = 999;
            stats.pitchspeed = 999;
            for (const e of this.engines) {
                switch (e.type) {
                    case DRIVE_TYPE.PROPELLER:
                        stats.pitchboost = Math.min(stats.pitchboost, this.prop_list[this.idx_prop].stats.pitchboost + this.upg_list[this.idx_upg].stats.pitchboost);
                        stats.pitchspeed = Math.min(stats.pitchspeed, this.prop_list[this.idx_prop].stats.pitchspeed + this.upg_list[this.idx_upg].stats.pitchspeed);
                        break;
                    case DRIVE_TYPE.PULSEJET:
                        stats.pitchboost = Math.min(stats.pitchboost, 0.6);
                        stats.pitchspeed = Math.min(stats.pitchspeed, 1);
                        break;
                    case DRIVE_TYPE.TURBINE:
                        stats.pitchboost = Math.min(stats.pitchboost, 0.2);
                        stats.pitchspeed = Math.min(stats.pitchspeed, e.num);
                        break;
                    default:
                        throw "Not a known Engine Type.";
                }
            }
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Frames.ts



class Frames extends Part {
    constructor(js) {
        super();
        this.frame_list = [];
        for (const elem of js["frames"]) {
            this.frame_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                basestruct: elem["basestructure"],
                basecost: elem["basecost"],
                geodesic: elem["geodesic"]
            });
        }
        this.sel_skin = 0;
        this.skin_list = [];
        for (const elem of js["skin"]) {
            this.skin_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                monocoque: elem["monocoque"],
                monocoque_structure: elem["monocoque_structure"],
                flammable: elem["flammable"],
                dragfactor: elem["dragfactor"],
                massfactor: elem["massfactor"],
            });
        }
        this.farman = false;
        this.boom = false;
        this.has_tractor_nacelles = false;
        this.sel_tail = 2;
        this.tail_list = [];
        for (const elem of js["tail"]) {
            this.tail_list.push({
                name: elem["name"],
                stats: new Stats(elem)
            });
        }
        this.flying_wing = false;
        this.is_tandem = false;
        this.section_list = [];
        this.tail_section_list = [];
        this.interal_bracing_count = 0;
        this.SetRequiredSections(1);
    }
    toJSON() {
        return {
            sections: this.section_list,
            tail_sections: this.tail_section_list,
            tail_index: this.sel_tail,
            use_farman: this.farman,
            use_boom: this.boom,
            flying_wing: this.flying_wing,
            sel_skin: this.sel_skin,
        };
    }
    fromJSON(js, json_version) {
        this.section_list = [];
        for (const elem of js["sections"]) {
            this.section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }
        this.tail_section_list = [];
        for (const elem of js["tail_sections"]) {
            this.tail_section_list.push({
                frame: elem["frame"], geodesic: elem["geodesic"],
                monocoque: elem["monocoque"], lifting_body: elem["lifting_body"],
                internal_bracing: elem["internal_bracing"]
            });
            if (json_version < 10.25)
                this.sel_skin = elem["skin"];
        }
        this.farman = js["use_farman"];
        this.boom = js["use_boom"];
        this.sel_tail = js["tail_index"];
        this.flying_wing = js["flying_wing"];
        if (json_version > 10.25)
            this.sel_skin = js["sel_skin"];
        this.interal_bracing_count = this.CountInternalBracing();
    }
    serialize(s) {
        s.PushNum(this.section_list.length);
        for (let i = 0; i < this.section_list.length; i++) {
            const sec = this.section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.tail_section_list.length);
        for (let i = 0; i < this.tail_section_list.length; i++) {
            const sec = this.tail_section_list[i];
            s.PushNum(sec.frame);
            s.PushBool(sec.geodesic);
            s.PushBool(sec.monocoque);
            s.PushBool(sec.lifting_body);
            s.PushBool(sec.internal_bracing);
        }
        s.PushNum(this.sel_tail);
        s.PushBool(this.farman);
        s.PushBool(this.boom);
        s.PushBool(this.flying_wing);
        s.PushNum(this.sel_skin);
    }
    deserialize(d) {
        const slen = d.GetNum();
        this.section_list = [];
        for (let i = 0; i < slen; i++) {
            let sec = {
                frame: 0, skin: 0, geodesic: false,
                monocoque: false, lifting_body: false, internal_bracing: false
            };
            sec.frame = d.GetNum();
            if (d.version < 10.25)
                this.sel_skin = d.GetNum();
            sec.geodesic = d.GetBool();
            sec.monocoque = d.GetBool();
            sec.lifting_body = d.GetBool();
            sec.internal_bracing = d.GetBool();
            this.section_list.push(sec);
        }
        const tlen = d.GetNum();
        this.tail_section_list = [];
        for (let i = 0; i < tlen; i++) {
            let sec = {
                frame: 0, skin: 0, geodesic: false,
                monocoque: false, lifting_body: false, internal_bracing: false
            };
            sec.frame = d.GetNum();
            if (d.version < 10.25)
                this.sel_skin = d.GetNum();
            sec.geodesic = d.GetBool();
            sec.monocoque = d.GetBool();
            sec.lifting_body = d.GetBool();
            sec.internal_bracing = d.GetBool();
            this.tail_section_list.push(sec);
        }
        this.sel_tail = d.GetNum();
        this.farman = d.GetBool();
        this.boom = d.GetBool();
        this.flying_wing = d.GetBool();
        if (d.version > 10.25)
            this.sel_skin = d.GetNum();
        this.interal_bracing_count = this.CountInternalBracing();
    }
    DuplicateSection(num, count = 1) {
        const sec = this.section_list[num];
        const new_section = {
            frame: sec.frame, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing) {
            if (this.CountSections() + this.tail_section_list.length == this.interal_bracing_count)
                return;
            this.interal_bracing_count += count;
        }
        for (let i = 0; i < count; i++) {
            this.section_list.splice(num, 0, new_section);
        }
        this.CalculateStats();
    }
    DuplicateTailSection(num, count = 1) {
        const sec = this.tail_section_list[num];
        const new_section = {
            frame: sec.frame, geodesic: sec.geodesic, monocoque: sec.monocoque,
            lifting_body: sec.lifting_body, internal_bracing: sec.internal_bracing
        };
        if (new_section.internal_bracing && this.CountSections() == this.interal_bracing_count) {
            return;
        }
        for (let i = 0; i < count; i++) {
            this.tail_section_list.splice(num, 0, new_section);
        }
        this.CalculateStats();
    }
    DeleteSection(num) {
        if (this.required_sections == this.CountSections()
            && !this.section_list[num].internal_bracing)
            return;
        if (this.section_list[num].internal_bracing)
            this.interal_bracing_count--;
        this.section_list.splice(num, 1);
        if (this.interal_bracing_count > this.CountSections() + this.tail_section_list.length) {
            for (let i = this.section_list.length - 1; i >= 0; i--) {
                if (this.section_list[i].internal_bracing) {
                    this.interal_bracing_count--;
                    this.section_list.splice(i, 1);
                    break;
                }
            }
        }
        this.CalculateStats();
    }
    SetRequiredSections(num) {
        this.required_sections = num;
        if (this.required_sections > this.CountSections()) {
            if (this.section_list.length == 0) {
                this.section_list.push({
                    frame: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            if (this.required_sections - this.CountSections() > 0) {
                for (let i = this.section_list.length - 1; i >= 0; i--) {
                    if (!this.section_list[i].internal_bracing) {
                        this.DuplicateSection(i, this.required_sections - this.CountSections());
                        return;
                    }
                }
            }
        }
    }
    SetRequiredTailSections(num) {
        if (num > this.tail_section_list.length) {
            if (this.tail_section_list.length == 0) {
                this.tail_section_list.push({
                    frame: 0, geodesic: false, monocoque: false,
                    lifting_body: false, internal_bracing: false
                });
            }
            if (num - this.tail_section_list.length > 0)
                this.DuplicateTailSection(this.tail_section_list.length - 1, num - this.tail_section_list.length);
        }
        while (num < this.tail_section_list.length) {
            this.tail_section_list.pop();
        }
        while (this.CountSections() + num < this.interal_bracing_count) {
            let idx = this.section_list.length - 1;
            for (; idx > 0; idx--) {
                if (this.section_list[idx].internal_bracing)
                    break;
            }
            this.DeleteSection(idx);
        }
        this.CalculateStats();
    }
    CountSections() {
        return this.section_list.length - this.interal_bracing_count;
    }
    GetNumFrames() {
        return this.CountSections() + this.tail_section_list.length;
    }
    CountInternalBracing() {
        var count = 0;
        for (const elem of this.section_list) {
            if (elem.internal_bracing)
                count++;
        }
        return count;
    }
    BaseType() {
        const hist = [...Array(this.frame_list.length).fill(0)];
        for (const elem of this.section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        for (const elem of this.tail_section_list) {
            if (!elem.internal_bracing)
                hist[elem.frame]++;
        }
        var max_index = 0;
        var max = 0;
        for (let i = hist.length - 1; i >= 0; i--) {
            if (hist[i] > max) {
                max = hist[i];
                max_index = i;
            }
        }
        return max_index;
    }
    GetFrameList() {
        return this.frame_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetSectionList() {
        return this.section_list;
    }
    SetFrame(num, type) {
        this.section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.section_list[num].geodesic = false;
        this.CalculateStats();
    }
    // public SetSkin(num: number, type: number) {
    //     this.section_list[num].skin = type;
    //     if (type != 0)
    //         this.section_list[num].internal_bracing = false;
    //     if (!this.skin_list[type].monocoque) {
    //         this.section_list[num].monocoque = false;
    //         this.section_list[num].lifting_body = false;
    //     }
    //     this.CalculateStats();
    // }
    SetGeodesic(num, use) {
        if (this.frame_list[this.section_list[num].frame].geodesic) {
            this.section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetMonocoque(num, use) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetLiftingBody(num, use) {
        if (this.skin_list[this.sel_skin].monocoque) {
            this.section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetInternalBracing(num, use) {
        //If we're setting it, it isn't already set, and we have the margin.
        if (use && !this.section_list[num].internal_bracing
            && this.PossibleInternalBracing(true)
            && this.CountSections() > this.required_sections) {
            this.section_list[num].internal_bracing = true;
            this.section_list[num].monocoque = false;
            this.section_list[num].lifting_body = false;
            this.CalculateStats();
        }
        else if (!use) { // If we're un-setting it.
            this.section_list[num].internal_bracing = false;
            this.CalculateStats();
        }
    }
    PossibleInternalBracing(convert_sec_to_brace = false) {
        var allowed = this.CountSections();
        if (!this.farman)
            allowed += this.tail_section_list.length;
        if (convert_sec_to_brace)
            allowed -= 1;
        return this.interal_bracing_count + 1 <= allowed;
    }
    PossibleGeodesic(num) {
        return this.frame_list[this.section_list[num].frame].geodesic && !this.section_list[num].monocoque;
    }
    PossibleMonocoque(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.section_list[num].internal_bracing && !this.section_list[num].lifting_body;
    }
    PossibleLiftingBody(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.section_list[num].internal_bracing && !this.section_list[num].monocoque;
    }
    PossibleTailGeodesic(num) {
        return this.frame_list[this.tail_section_list[num].frame].geodesic && !this.tail_section_list[num].monocoque;
    }
    PossibleTailMonocoque(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.farman && !this.tail_section_list[num].lifting_body;
    }
    PossibleTailLiftingBody(num) {
        return this.skin_list[this.sel_skin].monocoque && !this.farman && !this.tail_section_list[num].monocoque;
    }
    PossibleRemoveSections() {
        return this.CountSections() > this.required_sections;
    }
    GetFarmanOrBoom() {
        return this.farman || this.boom;
    }
    SectionStats(sec) {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic) {
            stats.structure *= 1.5;
            stats.cost *= 2;
            stats.era.push({ name: "Geodesic", era: "Coming Storm" });
        }
        if (sec.lifting_body) {
            stats.wingarea += 3;
        }
        //If it's internal, no skin.
        if (!sec.internal_bracing) {
            stats.drag += 4;
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[this.sel_skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[this.sel_skin].stats);
        }
        return stats;
    }
    TailSectionStats(sec) {
        var stats = new Stats();
        stats = stats.Add(this.frame_list[sec.frame].stats);
        if (sec.geodesic) {
            stats.structure *= 1.5;
            stats.cost *= 2;
            stats.era.push({ name: "Geodesic", era: "Coming Storm" });
        }
        if (sec.lifting_body) {
            stats.wingarea += 3;
        }
        stats.drag += 4;
        //If it's farman, no skin.
        if (!this.farman) {
            if (sec.monocoque) {
                stats.mass = 0;
                stats.cost += 1;
                stats.structure = this.skin_list[this.sel_skin].monocoque_structure;
            }
            stats = stats.Add(this.skin_list[this.sel_skin].stats);
        }
        return stats;
    }
    CountMainLiftingBody() {
        var count = 0;
        for (const s of this.section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }
    CountTailLiftingBody() {
        var count = 0;
        for (const s of this.tail_section_list) {
            if (s.lifting_body)
                count++;
        }
        return count;
    }
    CountLiftingBody() {
        return this.CountMainLiftingBody() + this.CountTailLiftingBody();
    }
    SetIsTandem(use) {
        if (this.is_tandem != use) {
            this.is_tandem = use;
            this.SetTailType(this.sel_tail);
        }
    }
    SetTailType(num) {
        if (this.tail_list[num].stats.reqsections == 0 && this.is_tandem)
            num++;
        this.sel_tail = num;
        this.SetRequiredTailSections(this.tail_list[num].stats.reqsections);
    }
    GetTailType() {
        return this.sel_tail;
    }
    GetTailList() {
        return this.tail_list;
    }
    GetTailSectionList() {
        return this.tail_section_list;
    }
    SetUseFarman(use) {
        this.farman = use;
        if (use && this.boom)
            this.boom = false;
        if (this.farman) {
            for (const sec of this.tail_section_list) {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
        this.CalculateStats();
    }
    GetUseFarman() {
        return this.farman;
    }
    SetUseBoom(use) {
        this.boom = use;
        if (use && this.farman)
            this.farman = false;
        this.CalculateStats();
    }
    GetUseBoom() {
        return this.boom;
    }
    SetTailFrame(num, type) {
        this.tail_section_list[num].frame = type;
        if (!this.frame_list[type].geodesic)
            this.tail_section_list[num].geodesic = false;
        this.CalculateStats();
    }
    // public SetTailSkin(num: number, type: number) {
    //     this.tail_section_list[num].skin = type;
    //     if (type != 0)
    //         this.tail_section_list[num].internal_bracing = false;
    //     if (!this.skin_list[type].monocoque) {
    //         this.tail_section_list[num].monocoque = false;
    //         this.tail_section_list[num].lifting_body = false;
    //     }
    //     this.CalculateStats();
    // }
    SetTailGeodesic(num, use) {
        if (this.frame_list[this.tail_section_list[num].frame].geodesic) {
            this.tail_section_list[num].geodesic = use;
            this.CalculateStats();
        }
    }
    SetTailMonocoque(num, use) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].monocoque = use;
            this.CalculateStats();
        }
    }
    SetTailLiftingBody(num, use) {
        if (this.skin_list[this.sel_skin].monocoque && !this.farman) {
            this.tail_section_list[num].lifting_body = use;
            this.CalculateStats();
        }
    }
    SetHasTractorNacelles(use) {
        this.has_tractor_nacelles = use;
    }
    GetHasTractorNacelles() {
        return this.has_tractor_nacelles;
    }
    CanFlyingWing() {
        for (const s of this.section_list) {
            if (s.lifting_body)
                return true;
        }
        for (const s of this.tail_section_list) {
            if (s.lifting_body)
                return true;
        }
        return false;
    }
    GetFlyingWing() {
        return this.flying_wing;
    }
    SetFlyingWing(use) {
        if (use && this.CanFlyingWing()) {
            this.flying_wing = true;
        }
        else {
            this.flying_wing = false;
        }
        this.CalculateStats();
    }
    GetIsTailless() {
        return this.tail_section_list.length == 0;
    }
    SetAllFrame(num) {
        for (const s of this.section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        for (const s of this.tail_section_list) {
            s.frame = num;
            if (!this.frame_list[num].geodesic)
                s.geodesic = false;
        }
        this.CalculateStats();
    }
    SetAllSkin(num) {
        this.sel_skin = num;
        for (const s of this.section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        for (const s of this.tail_section_list) {
            if (!s.internal_bracing) {
                if (!this.skin_list[num].monocoque) {
                    s.monocoque = false;
                    s.lifting_body = false;
                }
            }
        }
        this.CalculateStats();
    }
    GetArmor() {
        if (this.skin_list[this.sel_skin].name == "Dragon Skin")
            return 5;
        return 0;
    }
    GetIsFlammable() {
        if (this.skin_list[this.sel_skin].flammable)
            return true;
        return false;
    }
    GetSkin() {
        return this.sel_skin;
    }
    CanCutout() {
        let vcount = this.section_list.length * this.skin_list[this.sel_skin].stats.visibility;
        if (this.farman) {
            vcount += this.tail_section_list.length;
        }
        else {
            vcount += this.tail_section_list.length * this.skin_list[this.sel_skin].stats.visibility;
        }
        return vcount < 3;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        if (!this.CanFlyingWing())
            this.flying_wing = false;
        var stats = new Stats();
        const base_type = this.BaseType();
        stats.structure = this.frame_list[base_type].basestruct;
        stats.cost = this.frame_list[base_type].basecost;
        var is_clinker = this.skin_list[this.sel_skin].monocoque_structure < 0;
        for (const sec of this.section_list) {
            stats = stats.Add(this.SectionStats(sec));
            is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
        }
        var tail_stats = new Stats();
        for (const sec of this.tail_section_list) {
            tail_stats = tail_stats.Add(this.TailSectionStats(sec));
            if (!this.farman) {
                is_clinker = is_clinker && (sec.internal_bracing || sec.monocoque);
            }
        }
        if (is_clinker)
            stats.structure += 30;
        stats = stats.Add(this.tail_list[this.sel_tail].stats);
        if (this.boom) {
            tail_stats.maxstrain -= tail_stats.mass;
            if (!this.has_tractor_nacelles)
                tail_stats.drag = Math.floor(1.0e-6 + 1.5 * tail_stats.drag);
        }
        if (this.farman) {
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
            stats.visibility += this.tail_section_list.length;
            tail_stats.mass = Math.floor(1.0e-6 + 0.5 * tail_stats.mass);
            //Apply factors before tail_stats
            stats = stats.Add(tail_stats);
        }
        else {
            //Apply factors after tail_stats
            stats = stats.Add(tail_stats);
            //Skin factors
            stats.drag *= this.skin_list[this.sel_skin].dragfactor;
            stats.mass *= this.skin_list[this.sel_skin].massfactor;
        }
        //Lifting Body and Flying Wing
        const lb_count = this.CountLiftingBody();
        stats.cost += lb_count;
        if (this.flying_wing) {
            stats.liftbleed += 5;
        }
        else {
            stats.drag += lb_count;
        }
        if (this.PossibleRemoveSections() && this.CountMainLiftingBody() < this.CountSections()) {
            stats.warnings.push({
                source: Localization_lu("Frame Count"),
                warning: Localization_lu("Frame Count Warning"),
                color: WARNING_COLOR.YELLOW,
            });
        }
        stats.structure = Math.floor(1.0e-6 + stats.structure);
        stats.cost = Math.floor(1.0e-6 + stats.cost);
        stats.visibility = Math.min(stats.visibility, 3);
        stats.Round();
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Wings.ts



var WING_DECK;
(function (WING_DECK) {
    WING_DECK[WING_DECK["PARASOL"] = 0] = "PARASOL";
    WING_DECK[WING_DECK["SHOULDER"] = 1] = "SHOULDER";
    WING_DECK[WING_DECK["MID"] = 2] = "MID";
    WING_DECK[WING_DECK["LOW"] = 3] = "LOW";
    WING_DECK[WING_DECK["GEAR"] = 4] = "GEAR";
})(WING_DECK || (WING_DECK = {}));
;
class Wings extends Part {
    constructor(js) {
        super();
        this.skin_list = [];
        for (const elem of js["surface"]) {
            this.skin_list.push({
                name: elem["name"], flammable: elem["flammable"],
                stats: new Stats(elem), strainfactor: elem["strainfactor"],
                dragfactor: elem["dragfactor"], metal: elem["metal"],
                transparent: elem["transparent"],
            });
        }
        this.stagger_list = [];
        for (const elem of js["stagger"]) {
            this.stagger_list.push({
                name: elem["name"], inline: elem["inline"],
                wing_count: elem["wing_count"], hstab: elem["hstab"], stats: new Stats(elem),
            });
        }
        this.deck_list = [];
        for (const elem of js["decks"]) {
            this.deck_list.push({
                name: elem["name"], limited: elem["limited"], stats: new Stats(elem),
            });
        }
        this.long_list = [];
        for (const elem of js["largest"]) {
            this.long_list.push({ dragfactor: elem["dragfactor"], stats: new Stats(elem), });
        }
        this.wing_list = [];
        this.mini_wing_list = [];
        this.wing_stagger = Math.floor(1.0e-6 + this.stagger_list.length / 2);
        this.is_swept = false;
        this.is_closed = false;
        this.rotor_span = 0;
    }
    toJSON() {
        return {
            wing_list: this.wing_list,
            mini_wing_list: this.mini_wing_list,
            wing_stagger: this.wing_stagger,
            is_swept: this.is_swept,
            is_closed: this.is_closed
        };
    }
    fromJSON(js, json_version) {
        if (json_version > 11.15) {
            this.wing_list = js["wing_list"];
            this.mini_wing_list = js["mini_wing_list"];
        }
        else {
            const wl = js["wing_list"];
            this.wing_list = this.OldtoNew(wl);
            const mwl = js["mini_wing_list"];
            this.mini_wing_list = this.OldtoNew(mwl);
        }
        this.wing_stagger = js["wing_stagger"];
        this.is_swept = js["is_swept"];
        this.is_closed = js["is_closed"];
    }
    OldtoNew(wtl) {
        const list = [];
        for (const wt of wtl) {
            list.push({
                surface: wt.surface, area: wt.area, span: wt.span, anhedral: wt.anhedral,
                dihedral: wt.dihedral, gull: false, deck: wt.deck
            });
        }
        return list;
    }
    serialize(s) {
        s.PushNum(this.wing_list.length);
        for (let i = 0; i < this.wing_list.length; i++) {
            const w = this.wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
            s.PushBool(w.gull);
            s.PushNum(w.deck);
        }
        s.PushNum(this.mini_wing_list.length);
        for (let i = 0; i < this.mini_wing_list.length; i++) {
            const w = this.mini_wing_list[i];
            s.PushNum(w.surface);
            s.PushNum(w.area);
            s.PushNum(w.span);
            s.PushNum(w.dihedral);
            s.PushNum(w.anhedral);
            s.PushBool(w.gull);
            s.PushNum(w.deck);
        }
        s.PushNum(this.wing_stagger);
        s.PushBool(this.is_swept);
        s.PushBool(this.is_closed);
    }
    deserialize(d) {
        const wlen = d.GetNum();
        this.wing_list = [];
        for (let i = 0; i < wlen; i++) {
            const wing = { surface: 0, area: 0, span: 0, anhedral: 0, dihedral: 0, gull: false, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            if (d.version > 11.15) {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = d.GetBool();
            }
            else {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = false;
            }
            wing.deck = d.GetNum();
            this.wing_list.push(wing);
        }
        const mlen = d.GetNum();
        this.mini_wing_list = [];
        for (let i = 0; i < mlen; i++) {
            const wing = { surface: 0, area: 0, span: 0, anhedral: 0, dihedral: 0, gull: false, deck: 0 };
            wing.surface = d.GetNum();
            wing.area = d.GetNum();
            wing.span = d.GetNum();
            if (d.version > 11.15) {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = d.GetBool();
            }
            else {
                wing.dihedral = d.GetNum();
                wing.anhedral = d.GetNum();
                wing.gull = false;
            }
            wing.deck = d.GetNum();
            this.mini_wing_list.push(wing);
        }
        this.wing_stagger = d.GetNum();
        this.is_swept = d.GetBool();
        this.is_closed = d.GetBool();
    }
    SetRotorSpan(s) {
        this.rotor_span = s;
    }
    GetWingList() {
        return this.wing_list;
    }
    GetMiniWingList() {
        return this.mini_wing_list;
    }
    GetSkinList() {
        return this.skin_list;
    }
    GetStaggerList() {
        return this.stagger_list;
    }
    GetDeckList() {
        return this.deck_list;
    }
    DeckCountFull() {
        const count = [...Array(this.deck_list.length).fill(0)];
        for (const w of this.wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    DeckCountMini() {
        const count = [...Array(this.deck_list.length).fill(0)];
        for (const w of this.mini_wing_list) {
            count[w.deck]++;
        }
        return count;
    }
    CanStagger() {
        const can = [...Array(this.stagger_list.length).fill(false)];
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            if (this.wing_list.length > 1)
                can[1] = true;
            else
                can[0] = true;
        }
        else {
            if (this.wing_list.length > 1) {
                for (let i = 1; i < this.stagger_list.length; i++)
                    can[i] = true;
            }
            if (this.wing_list.length == 1) {
                can[0] = true;
            }
        }
        return can;
    }
    SetAcftType(type) {
        this.acft_type = type;
        if (type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            if (this.wing_list.length > 1)
                this.wing_stagger = 1;
            else
                this.wing_stagger = 0;
        }
    }
    SetStagger(index) {
        this.wing_stagger = index;
        while (this.stagger_list[index].wing_count < this.wing_list.length) {
            this.wing_list.pop();
        }
        if (!this.stagger_list[index].inline) {
            const count = this.DeckCountFull();
            for (let i = this.wing_list.length - 1; i >= 0; i--) {
                const w = this.wing_list[i];
                if (count[w.deck] > 1 && this.deck_list[w.deck].limited) {
                    count[w.deck]--;
                    this.wing_list.splice(i, 1);
                }
            }
        }
        this.CalculateStats();
    }
    GetStagger() {
        if (this.wing_list.length > 0) {
            return this.wing_stagger;
        }
        else {
            return -1;
        }
    }
    CanAddFullWing(deck) {
        if (deck >= this.deck_list.length)
            console.log("Deck out of Bounds");
        // if (this.wing_list.length >= this.stagger_list[this.wing_stagger].wing_count)
        //     return false;
        if (!this.stagger_list[this.wing_stagger].inline) { //If not tandem...
            //No shoulder with gull parasol
            if (deck == WING_DECK.SHOULDER && this.HasPolishWing())
                return false;
            //Limited numbers of each deck
            const full_count = this.DeckCountFull();
            if (full_count[deck] == WING_DECK.SHOULDER && this.deck_list[deck].limited)
                return false;
        }
        const mini_count = this.DeckCountMini();
        if (mini_count[deck] != 0)
            return false;
        return true;
    }
    CanAddMiniWing(deck) {
        const full_count = this.DeckCountFull();
        const mini_count = this.DeckCountMini();
        if (full_count[deck] != 0 || mini_count[deck] != 0)
            return false;
        return true;
    }
    CanMoveFullWing(idx, deck) {
        const w = this.wing_list[idx];
        this.wing_list.splice(idx, 1);
        const can = this.CanAddFullWing(deck);
        this.wing_list.splice(idx, 0, w);
        return can;
    }
    CanMoveMiniWing(idx, deck) {
        const w = this.mini_wing_list[idx];
        this.mini_wing_list.splice(idx, 1);
        const can = this.CanAddMiniWing(deck);
        this.mini_wing_list.splice(idx, 0, w);
        return can;
    }
    GetWingHeight() {
        let max = 0;
        for (const w of this.wing_list)
            max = Math.max(max, 4 - w.deck);
        return max;
    }
    CanClosed() {
        return this.wing_list.length > 1;
    }
    SetClosed(use) {
        if (this.wing_list.length > 0)
            this.is_closed = use;
        else
            this.is_closed = false;
        this.CalculateStats();
    }
    GetClosed() {
        return this.is_closed;
    }
    CanSwept() {
        return this.wing_list.length > 0;
    }
    SetSwept(use) {
        if (this.wing_list.length > 0)
            this.is_swept = use;
        else
            this.is_swept = false;
        this.CalculateStats();
    }
    GetSwept() {
        return this.is_swept;
    }
    GetTandem() {
        return this.stagger_list[this.wing_stagger].inline && this.wing_list.length > 1;
    }
    GetMonoplane() {
        return this.wing_list.length == 1;
    }
    GetStaggered() {
        return this.stagger_list[this.wing_stagger].stats.liftbleed != 0;
    }
    SetFullWing(idx, w) {
        if (this.wing_list.length != idx) {
            this.wing_list.splice(idx, 1);
        }
        if (w.area != w.area)
            w.area = 3;
        w.area = Math.floor(1.0e-6 + w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(1.0e-6 + w.span);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 3);
            w.span = Math.max(w.span, 1);
            if (this.CanAddFullWing(w.deck))
                this.wing_list.splice(idx, 0, w);
        }
        if (this.wing_list.length > 1 && this.wing_stagger == 0)
            this.wing_stagger = 4;
        else if (this.wing_list.length <= 1)
            this.wing_stagger = 0;
        w.dihedral = Math.min(w.dihedral, w.span - 1);
        w.anhedral = Math.min(w.anhedral, w.span - 1 - w.dihedral);
        this.CalculateStats();
    }
    SetMiniWing(idx, w) {
        if (this.mini_wing_list.length != idx)
            this.mini_wing_list.splice(idx, 1);
        if (w.area != w.area)
            w.area = 2;
        w.area = Math.floor(1.0e-6 + w.area);
        if (w.span != w.span)
            w.span = 1;
        w.span = Math.floor(1.0e-6 + w.span);
        if (w.deck >= 0) {
            w.area = Math.max(w.area, 1);
            w.area = Math.min(w.area, 2);
            w.span = Math.max(w.span, 1);
            if (this.CanAddMiniWing(w.deck))
                this.mini_wing_list.splice(idx, 0, w);
        }
        this.CalculateStats();
    }
    HasNonGullDeck(deck) {
        for (const w of this.wing_list) {
            if (w.deck == deck && !w.gull) //If we have shoulder...
                return true;
        }
        return false;
    }
    CanGull(deck) {
        if (deck == WING_DECK.PARASOL) {
            if (!this.GetTandem() && this.HasNonGullDeck(WING_DECK.SHOULDER))
                return false;
        }
        else if (deck == WING_DECK.SHOULDER) {
            return false;
        }
        else {
            if (!this.GetTandem() && this.HasNonGullDeck(deck - 1))
                return false;
        }
        return true;
    }
    IsFlammable() {
        for (const w of this.wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        for (const w of this.mini_wing_list) {
            if (this.skin_list[w.surface].flammable)
                return true;
        }
        return false;
    }
    NeedHStab() {
        return this.stagger_list[this.wing_stagger].hstab;
    }
    NeedTail() {
        return this.NeedHStab() || !this.is_swept;
    }
    GetSpan() {
        let longest_span = 0;
        for (const w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            const wspan = w.span;
            longest_span = Math.max(longest_span, wspan);
        }
        for (const w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            const wspan = w.span;
            longest_span = Math.max(longest_span, wspan);
        }
        return longest_span;
    }
    GetArea() {
        let area = 0;
        for (const w of this.wing_list) {
            area += w.area;
        }
        for (const w of this.mini_wing_list) {
            area += w.area;
        }
        return area;
    }
    GetParasol() {
        for (const w of this.wing_list) {
            if (w.deck == WING_DECK.PARASOL) {
                return true;
            }
        }
        for (const w of this.mini_wing_list) {
            if (w.deck == WING_DECK.PARASOL) {
                return true;
            }
        }
        return false;
    }
    GetMetalArea() {
        let area = 0;
        for (const w of this.wing_list) {
            if (this.skin_list[w.surface].metal)
                area += w.area;
        }
        for (const w of this.mini_wing_list) {
            if (this.skin_list[w.surface].metal)
                area += w.area;
        }
        return area;
    }
    GetWingDrag() {
        let drag = 0;
        const deck_count = this.DeckCountFull();
        let longest_span = 0;
        let longest_drag = 0;
        for (const w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            const wspan = w.span;
            let warea = w.area;
            longest_span = Math.max(longest_span, wspan);
            if (w.gull)
                warea = Math.floor(1.0e-6 + 1.1 * warea);
            let wdrag = Math.max(1, 6 * warea * warea / (wspan * wspan));
            wdrag = Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
            //Inline wings
            if (this.stagger_list[this.wing_stagger].inline && deck_count[w.deck] > 1) {
                wdrag = Math.floor(1.0e-6 + 0.75 * wdrag);
                wdrag = Math.max(1, wdrag);
            }
            wdrag = Math.floor(1.0e-6 + wdrag);
            if (longest_span == wspan)
                // @ts-ignore
                longest_drag = longest_drag;
            drag += wdrag;
        }
        for (const w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            const wspan = w.span;
            //Drag is modified by area, span
            let wdrag = Math.max(1, 6 * w.area * w.area / (wspan * wspan));
            wdrag = Math.max(1, wdrag * this.skin_list[w.surface].dragfactor);
            wdrag = Math.floor(1.0e-6 + wdrag);
            drag += wdrag;
        }
        //Sesquiplanes!
        const sesp = this.GetIsSesquiplane();
        if ((sesp.is || this.GetMonoplane()) && sesp.deck != -1) {
            drag -= Math.floor(1.0e-6 + (1 - this.long_list[sesp.deck].dragfactor) * longest_drag);
        }
        return drag;
    }
    GetIsFlammable() {
        for (const s of this.wing_list) {
            if (this.skin_list[s.surface].flammable)
                return true;
        }
        for (const s of this.mini_wing_list) {
            if (this.skin_list[s.surface].flammable)
                return true;
        }
        return false;
    }
    SetAircraftMass(plane_mass) {
        this.plane_mass = plane_mass;
    }
    GetPaperMass() {
        let paper = 0;
        for (const w of this.wing_list) {
            const wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.Round();
            if (wStats.mass < 0)
                paper += wStats.mass;
        }
        for (const w of this.mini_wing_list) {
            const wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.Round();
            if (wStats.mass < 0)
                paper += wStats.mass;
        }
        return Math.max(-Math.floor(1.0e-6 + 0.25 * this.plane_mass), paper);
    }
    GetIsSesquiplane() {
        let biggest_area = 0;
        let biggest_deck = -1;
        let biggest_span = 0;
        let smallest_area = 1e100;
        let smallest_span = 0;
        for (const w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            if (w.area > biggest_area) {
                biggest_area = w.area;
                biggest_deck = w.deck;
                biggest_span = w.span;
            }
            else if (w.area == biggest_area) {
                biggest_deck = -1;
            }
            if (smallest_area > w.area) {
                smallest_area = w.area;
                smallest_span = w.span;
            }
        }
        let is = biggest_area >= 2 * smallest_area;
        is = is && !this.GetMonoplane() && !this.GetTandem();
        if (is) {
            const ss = 0.75 * biggest_span >= smallest_span;
            return { is: is, deck: biggest_deck, super_small: ss };
        }
        return { is: false, deck: biggest_deck, super_small: false };
    }
    HasPolishWing() {
        for (const w of this.wing_list) {
            if (w.deck == WING_DECK.PARASOL && w.gull == true) {
                return true;
            }
        }
        return false;
    }
    HasInvertedGull() {
        let ret = -1;
        for (const w of this.wing_list) {
            if (w.gull && w.deck > WING_DECK.SHOULDER) {
                ret = Math.max(ret, w.deck);
            }
        }
        return ret;
    }
    CanCutout() {
        let vcount = 0;
        for (const w of this.wing_list) {
            if (this.skin_list[w.surface].transparent) {
                vcount += 1;
            }
        }
        return vcount < 3;
    }
    PartStats() {
        if (!this.CanClosed())
            this.is_closed = false;
        if (!this.CanSwept())
            this.is_swept = false;
        var stats = new Stats();
        let have_wing = false;
        const deck_count = this.DeckCountFull();
        let have_mini_wing = false;
        let longest_span = this.rotor_span;
        let longest_drag = 0;
        let celluloid_count = 0;
        for (const w of this.wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            longest_span = Math.max(longest_span, w.span);
            if (!have_wing) { //Is first wing
                have_wing = true;
            }
            else { //Is not first wing
                stats.control += 3;
                stats.liftbleed += 5;
                stats.visibility -= 1;
            }
            let wStats = new Stats();
            //Actual stats
            wStats = wStats.Add(this.skin_list[w.surface].stats.Multiply(w.area));
            wStats.wingarea = w.area;
            //Wings cannot generate positive max strain
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            //Buzzers double stress
            if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER)
                wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            if (this.skin_list[w.surface].transparent && celluloid_count < 3) {
                wStats.visibility += 1;
                celluloid_count += 1;
            }
            //Drag is modified by area, span, and the leading wing
            const wspan = w.span;
            //Gull Drag modifies wing area
            let warea = w.area;
            if (w.gull)
                warea = Math.floor(1.0e-6 + 1.1 * warea);
            const wdrag = Math.max(1, 6 * warea * warea / (wspan * wspan));
            wStats.drag = wStats.drag + wdrag;
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //Inline wings
            if (this.stagger_list[this.wing_stagger].inline && deck_count[w.deck] > 1) {
                wStats.drag = Math.floor(1.0e-6 + 0.75 * wStats.drag);
                wStats.drag = Math.max(1, wStats.drag);
            }
            //Deck Effects
            stats = stats.Add(this.deck_list[w.deck].stats);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            wStats.Round();
            //Save for Longest Wing Mid bonus later
            if (longest_span == w.span) {
                longest_drag = wStats.drag;
            }
            if (wStats.mass < 0) //Treated paper is applied later
                wStats.mass = 0;
            stats = stats.Add(wStats);
        }
        for (const w of this.mini_wing_list) {
            //Longest span is span - (1/2 liftbleed of anhedral and dihedral)
            longest_span = Math.max(longest_span, w.span);
            stats.control += 1;
            if (!have_mini_wing) { //Is first miniature wing
                have_mini_wing = true;
            }
            else { //Is not first miniature wing
                stats.liftbleed += 1;
            }
            //Actual stats
            const wStats = this.skin_list[w.surface].stats.Multiply(w.area);
            wStats.wingarea = w.area;
            wStats.maxstrain += Math.min(0, -(2 * w.span + w.area - 10));
            wStats.maxstrain *= this.skin_list[w.surface].strainfactor;
            //Drag is modified by area, span
            const wspan = w.span;
            wStats.drag = Math.max(1, wStats.drag + 6 * w.area * w.area / (wspan * wspan));
            wStats.drag = Math.max(1, wStats.drag * this.skin_list[w.surface].dragfactor);
            //stability from -hedral
            wStats.latstab += w.dihedral - w.anhedral;
            wStats.liftbleed += w.dihedral + w.anhedral;
            wStats.Round();
            if (wStats.mass < 0) //Treated paper is applied later
                wStats.mass = 0;
            stats = stats.Add(wStats);
        }
        //Longest wing effects
        stats.control += 8 - longest_span;
        stats.latstab += Math.min(0, longest_span - 8);
        //Sesquiplanes!
        const sesp = this.GetIsSesquiplane();
        if ((sesp.is || this.GetMonoplane()) && sesp.deck != -1) {
            stats = stats.Add(this.long_list[sesp.deck].stats);
            stats.drag -= Math.floor(1.0e-6 + (1 - this.long_list[sesp.deck].dragfactor) * longest_drag);
        }
        if (sesp.is) {
            stats.liftbleed -= 2;
            stats.control += 2;
        }
        //Inline Wing Shadowing
        if (this.stagger_list[this.wing_stagger].inline) {
            for (const count of deck_count) {
                if (count > 1) {
                    stats.liftbleed += (count - 1) * 3;
                }
            }
        }
        //Gull wing effects (wing bits, drag is already applied)
        if (this.HasPolishWing()) {
            stats.visibility += 1;
            stats.maxstrain += 10;
        }
        switch (this.HasInvertedGull()) {
            case 1: //Shoulder Wing
                //Can't be gull.
                break;
            case 2: //Mid wing
            case 3: //Low wing (same as Mid)
                //Only affects landing gear and bomb capacity
                break;
            case 4: //Gear wing
                stats.maxstrain += 10;
                stats.crashsafety += 1;
                //Also affects landing gear and bomb capacity
                break;
            default:
            //NOTHING...
        }
        if (this.HasInvertedGull() > 0 || this.HasPolishWing()) {
            stats.era.push({ name: "Gull Wing", era: "Coming Storm" });
        }
        //Wing Sweep effects
        if (this.is_swept) {
            stats.liftbleed += 5;
            stats.latstab--;
        }
        //Closed Wing effects
        if (this.is_closed) {
            const pairs = Math.floor(1.0e-6 + this.wing_list.length / 2.0);
            stats.mass += 1 * pairs;
            stats.control -= 5 * pairs;
            stats.maxstrain += 20 * pairs;
        }
        //Stagger effects, monoplane is nothing.
        if (this.wing_list.length > 1) {
            stats = stats.Add(this.stagger_list[this.wing_stagger].stats);
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        let total_charge = 0;
        let source = "";
        for (const wing of this.wing_list) {
            const skin = this.skin_list[wing.surface];
            if (skin.stats.charge != 0) {
                source = Localization_lu(skin.name);
                total_charge += skin.stats.charge * wing.area;
            }
        }
        total_charge = Math.floor(1.0e-6 + total_charge);
        if (total_charge != 0) {
            value.equipment.push({
                source: source,
                charge: total_charge.toString(),
            });
        }
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Stabilizers.ts


class Stabilizers extends Part {
    constructor(js) {
        super();
        this.have_tail = true;
        this.is_tandem = false;
        this.is_swept = false;
        this.is_heli = false;
        this.hstab_sel = 0;
        this.hstab_count = 1;
        this.hstab_list = [];
        for (const elem of js["hstab"]) {
            this.hstab_list.push({
                name: elem["name"],
                is_canard: elem["is_canard"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"],
                is_tail: elem["is_tail"]
            });
        }
        this.vstab_sel = 0;
        this.vstab_count = 1;
        this.vstab_list = [];
        for (const elem of js["vstab"]) {
            this.vstab_list.push({
                name: elem["name"],
                increment: elem["increment"],
                stats: new Stats(elem),
                dragfactor: elem["dragfactor"],
                is_vtail: elem["is_vtail"],
                is_tail: elem["is_tail"]
            });
        }
    }
    toJSON() {
        return {
            hstab_sel: this.hstab_sel,
            hstab_count: this.hstab_count,
            vstab_sel: this.vstab_sel,
            vstab_count: this.vstab_count,
        };
    }
    fromJSON(js, json_version) {
        this.hstab_sel = js["hstab_sel"];
        this.hstab_count = js["hstab_count"];
        this.vstab_sel = js["vstab_sel"];
        this.vstab_count = js["vstab_count"];
    }
    serialize(s) {
        s.PushNum(this.hstab_sel);
        s.PushNum(this.hstab_count);
        s.PushNum(this.vstab_sel);
        s.PushNum(this.vstab_count);
    }
    deserialize(d) {
        this.hstab_sel = d.GetNum();
        this.hstab_count = d.GetNum();
        this.vstab_sel = d.GetNum();
        this.vstab_count = d.GetNum();
    }
    GetHStabList() {
        return this.hstab_list;
    }
    GetVStabList() {
        return this.vstab_list;
    }
    GetHStabType() {
        return this.hstab_sel;
    }
    SetHStabType(num) {
        if (this.hstab_list[num].name == "The Wings" && !(this.is_tandem || this.is_swept))
            return;
        if (this.hstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.hstab_list[this.hstab_sel].is_vtail) {
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
        this.hstab_sel = num;
        this.SetHStabCount(this.hstab_count);
        this.CalculateStats();
    }
    GetHValidList() {
        var lst = [];
        if (this.is_heli) {
            lst = Array(this.hstab_list.length).fill(false);
            if (this.have_tail)
                lst[0] = true;
            else
                lst[1] = true;
        }
        else {
            for (const t of this.hstab_list) {
                if ((t.name == "The Wings" || t.name == "Outboard")
                    && !(this.is_tandem || this.is_swept))
                    lst.push(false);
                else if (t.is_tail && !this.have_tail)
                    lst.push(false);
                else
                    lst.push(true);
            }
        }
        return lst;
    }
    GetIsVTail() {
        return this.hstab_list[this.hstab_sel].is_vtail;
    }
    SetVTail() {
        for (let i = 0; i < this.hstab_list.length; i++) {
            if (this.hstab_list[i].is_vtail)
                this.hstab_sel = i;
        }
        for (let i = 0; i < this.vstab_list.length; i++) {
            if (this.vstab_list[i].is_vtail)
                this.vstab_sel = i;
        }
        this.hstab_count = 1;
        this.vstab_count = 0;
    }
    GetVStabType() {
        return this.vstab_sel;
    }
    SetVStabType(num) {
        if (this.vstab_list[num].name == "Outboard" && !this.CanVOutboard())
            return;
        if (this.vstab_list[num].is_vtail)
            this.SetVTail();
        else if (this.vstab_list[this.vstab_sel].is_vtail) {
            this.hstab_sel = 0;
            this.vstab_count = 1;
        }
        this.vstab_sel = num;
        this.SetVStabCount(this.vstab_count);
        this.CalculateStats();
    }
    GetVValidList() {
        var lst = [];
        if (this.is_heli) {
            lst = Array(this.vstab_list.length).fill(false);
            lst[0] = true;
        }
        else {
            for (const t of this.vstab_list) {
                if (t.name == "Outboard" && !this.CanVOutboard())
                    lst.push(false);
                else if (t.is_tail && !this.have_tail)
                    lst.push(false);
                else
                    lst.push(true);
            }
        }
        return lst;
    }
    GetHStabCount() {
        return this.hstab_count;
    }
    SetHStabCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.hstab_count = num;
        if (this.hstab_list[this.hstab_sel].increment != 0) {
            while ((this.hstab_count % this.hstab_list[this.hstab_sel].increment) != 0) {
                this.hstab_count++;
            }
        }
        else {
            this.hstab_count = 0;
        }
        this.CalculateStats();
    }
    GetHStabIncrement() {
        if (this.hstab_sel >= 0)
            return this.hstab_list[this.hstab_sel].increment;
        return 1;
    }
    GetVStabCount() {
        return this.vstab_count;
    }
    SetVStabCount(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        this.vstab_count = num;
        if (this.vstab_list[this.vstab_sel].increment != 0) {
            while ((this.vstab_count % this.vstab_list[this.vstab_sel].increment) != 0) {
                this.vstab_count++;
            }
        }
        else {
            this.vstab_count = 0;
        }
        this.CalculateStats();
    }
    GetVStabIncrement() {
        if (this.vstab_sel >= 0)
            return this.vstab_list[this.vstab_sel].increment;
        return 1;
    }
    SetEngineCount(num) {
        this.engine_count = num;
    }
    GetIsTandem() {
        return this.is_tandem;
    }
    SetIsTandem(is) {
        this.is_tandem = is;
    }
    SetIsSwept(is) {
        this.is_swept = is;
    }
    CanVOutboard() {
        return this.is_swept || this.is_tandem || (this.hstab_list[this.hstab_sel].is_canard && this.hstab_count > 0);
    }
    GetVOutboard() {
        return this.vstab_list[this.vstab_sel].name == "Outboard";
    }
    GetCanard() {
        return this.hstab_list[this.hstab_sel].is_canard;
    }
    SetLiftingArea(num) {
        this.lifting_area = num;
    }
    SetHaveTail(use) {
        this.have_tail = use;
        if (!use) {
            const hvalid = this.GetHValidList();
            if (!hvalid[this.hstab_sel]) {
                this.hstab_sel = 2;
            }
            const vvalid = this.GetVValidList();
            if (!vvalid[this.vstab_sel]) {
                if (!vvalid[1]) //If it was outboard, set it to canard so we can have outboard vstab.
                    this.hstab_sel = 2;
                this.vstab_sel = 1;
                if (this.vstab_count % 2 != 0)
                    this.vstab_count++;
            }
        }
        if (this.is_heli) {
            if (this.have_tail) {
                this.hstab_sel = 0;
            }
            else {
                this.hstab_sel = 1;
            }
            this.hstab_count = 1;
        }
    }
    SetHelicopter(is) {
        this.is_heli = is;
        if (is) {
            this.have_tail = true;
            this.is_tandem = false;
            this.is_swept = false;
            this.lifting_area = 0;
            this.engine_count = 0;
            this.hstab_sel = 0;
            this.hstab_count = 1;
            this.vstab_sel = 0;
            this.vstab_count = 1;
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        const hvalid = this.GetHValidList();
        if (!hvalid[this.hstab_sel]) {
            this.hstab_sel = 0;
            if (!hvalid[this.hstab_sel]) {
                this.hstab_sel = 0;
                this.hstab_count = 0;
            }
        }
        const vvalid = this.GetVValidList();
        if (!vvalid[this.vstab_sel]) {
            this.vstab_sel = 0;
            if (!vvalid[this.vstab_sel]) {
                this.vstab_sel = 0;
                this.vstab_count = 0;
            }
        }
        var stats = new Stats();
        //HSTAB
        if (this.hstab_count > 0) {
            stats = stats.Add(this.hstab_list[this.hstab_sel].stats);
            var drag = 0;
            if (this.is_heli) {
                drag = Math.floor(1.0e-6 + this.wing_drag / 8 * this.hstab_list[this.hstab_sel].dragfactor);
                stats.drag += Math.max(Math.ceil(1 * this.hstab_list[this.hstab_sel].dragfactor), drag);
            }
            else {
                drag = Math.floor(1.0e-6 + this.wing_drag / 4 * this.hstab_list[this.hstab_sel].dragfactor);
                stats.drag += Math.max(1, drag);
            }
        }
        else if (this.hstab_sel < 0 || this.hstab_list[this.hstab_sel].increment != 0) {
            stats.pitchstab -= Math.floor(1.0e-6 + this.lifting_area / 2);
            stats.liftbleed += 5;
        }
        //VSTAB
        if (this.vstab_count > 0) {
            stats = stats.Add(this.vstab_list[this.vstab_sel].stats);
            var drag = 0;
            if (this.is_heli) {
                drag = Math.floor(1.0e-6 + this.wing_drag / 16 * this.vstab_list[this.vstab_sel].dragfactor);
                stats.drag += Math.max(Math.ceil(1 * this.hstab_list[this.hstab_sel].dragfactor), drag);
            }
            else {
                drag = Math.floor(1.0e-6 + this.wing_drag / 8 * this.vstab_list[this.vstab_sel].dragfactor);
                stats.drag += Math.max(1, drag);
            }
        }
        else if (this.vstab_sel < 0 || (this.vstab_list[this.vstab_sel].increment != 0 || (this.vstab_list[this.vstab_sel].increment == 0 && this.hstab_count == 0))) {
            stats.latstab -= this.lifting_area;
        }
        //Additional stabilizers
        stats.drag += 2 * (Math.max(0, this.hstab_count - 1) + Math.max(0, this.vstab_count - 1));
        //Pairs of stabilizers
        if (this.vstab_sel >= 0 && this.vstab_list[this.vstab_sel].increment != 0) {
            var leftovers = Math.max(0, this.hstab_count - 1);
            const es_pairs = Math.min(this.engine_count - 1, this.vstab_count - 1);
            leftovers += Math.max(0, this.vstab_count - 1 - es_pairs);
            stats.control += 3 * es_pairs + leftovers;
        }
        else {
            const es_pairs = Math.max(0, Math.min(this.engine_count - 1, this.hstab_count - 1));
            leftovers = Math.max(0, this.hstab_count - 1 - es_pairs);
            stats.control += 3 * es_pairs + leftovers;
        }
        return stats;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/ControlSurfaces.ts




class ControlSurfaces extends Part {
    constructor(js) {
        super();
        this.span = 0;
        this.is_cantilever = 0;
        this.wing_area = 0;
        this.mp = 0;
        this.is_boom = false;
        this.acft_type = AIRCRAFT_TYPE.AIRPLANE;
        this.aileron_sel = 0;
        this.aileron_list = [];
        for (const elem of js["ailerons"]) {
            this.aileron_list.push({ name: elem["name"], warping: elem["warping"], stats: new Stats(elem) });
        }
        this.rudder_sel = 0;
        this.rudder_list = [];
        for (const elem of js["rudders"]) {
            this.rudder_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.elevator_sel = 0;
        this.elevator_list = [];
        for (const elem of js["elevators"]) {
            this.elevator_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.flaps_sel = 0;
        this.flaps_list = [];
        for (const elem of js["flaps"]) {
            this.flaps_list.push({ name: elem["name"], costfactor: elem["costfactor"], stats: new Stats(elem) });
        }
        this.slats_sel = 0;
        this.slats_list = [];
        for (const elem of js["slats"]) {
            this.slats_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_list = [];
        for (const elem of js["drag_inducers"]) {
            this.drag_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.drag_sel = [...Array(this.drag_list.length).fill(false)];
    }
    toJSON() {
        return {
            aileron_sel: this.aileron_sel,
            rudder_sel: this.rudder_sel,
            elevator_sel: this.elevator_sel,
            flaps_sel: this.flaps_sel,
            slats_sel: this.slats_sel,
            drag_sel: this.drag_sel,
        };
    }
    fromJSON(js, json_version) {
        this.aileron_sel = js["aileron_sel"];
        this.rudder_sel = js["rudder_sel"];
        this.elevator_sel = js["elevator_sel"];
        this.flaps_sel = js["flaps_sel"];
        this.slats_sel = js["slats_sel"];
        this.drag_sel = BoolArr(js["drag_sel"], this.drag_sel.length);
    }
    serialize(s) {
        s.PushNum(this.aileron_sel);
        s.PushNum(this.rudder_sel);
        s.PushNum(this.elevator_sel);
        s.PushNum(this.flaps_sel);
        s.PushNum(this.slats_sel);
        s.PushBoolArr(this.drag_sel);
    }
    deserialize(d) {
        this.aileron_sel = d.GetNum();
        this.rudder_sel = d.GetNum();
        this.elevator_sel = d.GetNum();
        this.flaps_sel = d.GetNum();
        this.slats_sel = d.GetNum();
        this.drag_sel = d.GetBoolArr(this.drag_sel.length);
    }
    GetAileronList() {
        return this.aileron_list;
    }
    CanAileron() {
        const can = [];
        if (!IsAnyOrnithopter(this.acft_type)) {
            for (const a of this.aileron_list) {
                if (a.warping && this.wing_area == 0)
                    can.push(false);
                else
                    can.push(true);
            }
        }
        else { //Is Ornithopter
            for (const a of this.aileron_list) {
                can.push(a.warping);
            }
        }
        return can;
    }
    GetAileron() {
        return this.aileron_sel;
    }
    SetAileron(num) {
        this.aileron_sel = num;
        this.CalculateStats();
    }
    GetRudderList() {
        return this.rudder_list;
    }
    CanRudder() {
        return this.can_rudder;
    }
    SetCanRudder(can) {
        this.can_rudder = can;
        if (!can)
            this.rudder_sel = 0;
    }
    GetRudder() {
        return this.rudder_sel;
    }
    SetRudder(num) {
        this.rudder_sel = num;
        this.CalculateStats();
    }
    GetElevatorList() {
        return this.elevator_list;
    }
    CanElevator() {
        return this.can_elevator;
    }
    SetCanElevator(can) {
        this.can_elevator = can;
        if (!can)
            this.elevator_sel = 0;
    }
    GetElevator() {
        return this.elevator_sel;
    }
    SetElevator(num) {
        this.elevator_sel = num;
        this.CalculateStats();
    }
    GetFlapsList() {
        return this.flaps_list;
    }
    GetFlaps() {
        return this.flaps_sel;
    }
    SetFlaps(num) {
        this.flaps_sel = num;
        this.CalculateStats();
    }
    GetFlapCost(mp) {
        if (mp)
            this.mp = mp;
        if (this.flaps_list[this.flaps_sel].costfactor > 0)
            return Math.max(1, Math.floor(1.0e-6 + this.flaps_list[this.flaps_sel].costfactor * this.mp));
        else
            return 0;
    }
    GetSlatsList() {
        return this.slats_list;
    }
    GetSlats() {
        return this.slats_sel;
    }
    SetSlats(num) {
        this.slats_sel = num;
        this.CalculateStats();
    }
    GetDragList() {
        return this.drag_list;
    }
    GetDrag() {
        return this.drag_sel;
    }
    SetDrag(num, use) {
        this.drag_sel[num] = use;
        this.CalculateStats();
    }
    SetNumCantilever(count) {
        this.is_cantilever = count;
    }
    SetSpan(span) {
        this.span = span;
    }
    SetWingArea(wa) {
        this.wing_area = wa;
    }
    SetAcftType(acft_type) {
        this.acft_type = acft_type;
        if (this.acft_type == AIRCRAFT_TYPE.HELICOPTER) {
            this.aileron_sel = 0;
            this.rudder_sel = 0;
            this.elevator_sel = 0;
            this.flaps_sel = 0;
            this.slats_sel = 0;
            for (let i = 0; i < this.drag_sel.length; i++)
                this.drag_sel[i] = false;
            this.span = 0;
            this.is_cantilever = 0;
            this.wing_area = 0;
        }
        else if (IsAnyOrnithopter(this.acft_type)) {
            const can = this.CanAileron();
            this.aileron_sel = can.findIndex((element) => { return element; });
            this.is_cantilever = 0;
        }
    }
    SetBoomTail(has) {
        this.is_boom = has;
    }
    SetIsVTail(is) {
        if (is) {
            this.rudder_sel = this.elevator_sel;
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        if (this.aileron_list[this.aileron_sel].warping && this.wing_area == 0) {
            this.aileron_sel = 0;
        }
        stats = stats.Add(this.aileron_list[this.aileron_sel].stats);
        if (this.aileron_list[this.aileron_sel].warping) {
            stats.maxstrain -= this.span;
            if (this.is_cantilever) {
                stats.cost += 2 * this.is_cantilever;
                stats.era.push({ name: Localization_lu("Cantilever Wing Warping"), era: "Last Hurrah" });
            }
            if (this.is_boom) {
                stats.pitchstab -= 2;
                stats.latstab -= 2;
                stats.warnings.push({
                    source: Localization_lu("Wing Warping"),
                    warning: Localization_lu("Wing Warping Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
        }
        stats = stats.Add(this.rudder_list[this.rudder_sel].stats);
        stats = stats.Add(this.elevator_list[this.elevator_sel].stats);
        stats = stats.Add(this.flaps_list[this.flaps_sel].stats);
        stats = stats.Add(this.slats_list[this.slats_sel].stats);
        for (let i = 0; i < this.drag_list.length; i++) {
            if (this.drag_sel[i])
                stats = stats.Add(this.drag_list[i].stats);
        }
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Reinforcement.ts




class Reinforcement extends Part {
    constructor(js) {
        super();
        this.ext_wood_list = [];
        for (const elem of js["external_wood"]) {
            this.ext_wood_list.push({
                name: elem["name"], tension: elem["tension"], config: elem["config"], first: elem["first"], small_sqp: elem["small_sqp"], ornith: elem["ornith"], stats: new Stats(elem)
            });
        }
        this.ext_wood_count = [...Array(this.ext_wood_list.length).fill(0)];
        this.ext_steel_list = [];
        for (const elem of js["external_steel"]) {
            this.ext_steel_list.push({ name: elem["name"], tension: elem["tension"], config: elem["config"], first: elem["first"], small_sqp: elem["small_sqp"], ornith: elem["ornith"], stats: new Stats(elem) });
        }
        this.ext_steel_count = [...Array(this.ext_steel_list.length).fill(0)];
        this.ext_cabane_list = [];
        for (const elem of js["cabane"]) {
            this.ext_cabane_list.push({ name: elem["name"], tension: elem["tension"], stats: new Stats(elem) });
        }
        this.cabane_sel = 0;
        this.cant_list = [];
        for (const elem of js["cantilever"]) {
            this.cant_list.push({ name: elem["name"], limited: elem["limited"], stats: new Stats(elem) });
        }
        this.cant_count = [...Array(this.cant_list.length).fill(0)];
        this.wires = false;
        this.wing_blades = false;
        this.is_staggered = false;
        this.is_tandem = false;
        this.is_monoplane = false;
        this.can_external = true;
        this.acft_structure = 0;
        this.cant_lift = 0;
        this.acft_type = AIRCRAFT_TYPE.AIRPLANE;
    }
    toJSON() {
        return {
            ext_wood_count: this.ext_wood_count,
            ext_steel_count: this.ext_steel_count,
            cant_count: this.cant_count,
            wires: this.wires,
            cabane_sel: this.cabane_sel,
            wing_blades: this.wing_blades,
        };
    }
    fromJSON(js, json_version) {
        this.ext_wood_count = NumArr(js["ext_wood_count"], this.ext_wood_count.length);
        this.ext_steel_count = NumArr(js["ext_steel_count"], this.ext_steel_count.length);
        this.cant_count = NumArr(js["cant_count"], this.cant_count.length);
        this.wires = js["wires"];
        this.cabane_sel = js["cabane_sel"];
        if (json_version > 10.25) {
            this.wing_blades = js["wing_blades"];
        }
        else {
            this.wing_blades = false;
        }
        if (json_version < 10.45) {
            this.cant_count[0] *= 2;
            this.cant_count[1] *= 2;
            this.cant_count[2] *= 3;
            this.cant_count[3] *= 2;
        }
    }
    serialize(s) {
        s.PushNumArr(this.ext_wood_count);
        s.PushNumArr(this.ext_steel_count);
        s.PushNumArr(this.cant_count);
        s.PushBool(this.wires);
        s.PushNum(this.cabane_sel);
        s.PushBool(this.wing_blades);
    }
    deserialize(d) {
        this.ext_wood_count = d.GetNumArr(this.ext_wood_count.length);
        this.ext_steel_count = d.GetNumArr(this.ext_steel_count.length);
        this.cant_count = d.GetNumArr(this.cant_count.length);
        this.wires = d.GetBool();
        this.cabane_sel = d.GetNum();
        if (d.version > 10.25) {
            this.wing_blades = d.GetBool();
        }
        else {
            this.wing_blades = false;
        }
        if (d.version < 10.45) {
            this.cant_count[0] *= 2;
            this.cant_count[1] *= 2;
            this.cant_count[2] *= 3;
            this.cant_count[3] *= 2;
        }
    }
    GetExternalList() {
        return this.ext_wood_list;
    }
    GetCantileverList() {
        return this.cant_list;
    }
    CanExternalWood() {
        const can = [...Array(this.ext_wood_list.length).fill(this.can_external)];
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
                can[i] = this.ext_wood_list[i].ornith;
            }
            else if (this.limited_sqp) {
                can[i] = this.ext_wood_list[i].small_sqp;
            }
            if (!this.wires && (this.ext_wood_list[i].name == "Wing Truss" || this.ext_wood_list[i].name == "Wire Root"))
                can[i] = false;
        }
        return can;
    }
    GetExternalWoodCount() {
        return this.ext_wood_count;
    }
    SetExternalWoodCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ext_wood_count[idx] = count;
        this.CalculateStats();
    }
    CanExternalSteel() {
        const can = [...Array(this.ext_steel_list.length).fill(this.can_external)];
        for (let i = 0; i < this.ext_steel_list.length; i++) {
            if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
                can[i] = this.ext_steel_list[i].ornith;
            }
            else if (this.limited_sqp) {
                can[i] = this.ext_steel_list[i].small_sqp;
            }
            if (!this.wires && (this.ext_steel_list[i].name == "Steel Wing Truss" || this.ext_steel_list[i].name == "Steel Wire Root"))
                can[i] = false;
        }
        return can;
    }
    GetExternalSteelCount() {
        return this.ext_steel_count;
    }
    SetExternalSteelCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ext_steel_count[idx] = count;
        this.CalculateStats();
    }
    GetCantileverCount() {
        return this.cant_count;
    }
    GetTotalCantilevers() {
        var sum = 0;
        for (let i = 0; i < this.cant_count.length; i++) {
            sum += this.cant_count[i];
        }
        return sum;
    }
    GetIsCantilever() {
        var count = 0;
        for (const c of this.cant_count)
            count += c;
        return count > 0;
    }
    SetCantileverCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.ImplSCC(idx, count);
        this.CalculateStats();
    }
    ImplSCC(idx, count) {
        var diff = count - this.cant_count[idx];
        if (this.cant_list[idx].limited && count > 0) {
            var total_structure = this.TotalStructure();
            for (let i = 0; i < this.cant_list.length; i++) {
                if (this.cant_list[i].limited) {
                    total_structure -= 5 * this.cant_count[i] * this.cant_list[i].stats.mass;
                }
            }
            diff = Math.min(diff, Math.floor(1.0e-6 + total_structure / (5 * this.cant_list[idx].stats.mass)));
        }
        this.cant_count[idx] += diff;
        return diff != 0;
    }
    GetWires() {
        return this.wires;
    }
    SetWires(use) {
        this.wires = use;
        this.CalculateStats();
    }
    SetStaggered(is) {
        this.is_staggered = is;
    }
    SetTandem(is) {
        this.is_tandem = is;
    }
    SetMonoplane(is) {
        this.is_monoplane = is;
    }
    SetCanUseExternal(has) {
        this.can_external = has;
    }
    SetAcftStructure(struct) {
        const oldstruct = this.acft_structure;
        this.acft_structure = struct;
        var recalc = false;
        if (oldstruct > this.acft_structure) {
            for (let i = this.cant_list.length - 1; i >= 0; i--)
                recalc = recalc || this.ImplSCC(i, this.cant_count[i]);
        }
        if (recalc)
            this.CalculateStats();
    }
    TotalStructure() {
        var struct_count = this.ext_cabane_list[this.cabane_sel].stats.structure;
        var first = false;
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            struct_count += this.ext_wood_count[i] * this.ext_wood_list[i].stats.structure;
            struct_count += this.ext_steel_count[i] * this.ext_steel_list[i].stats.structure;
            if (this.ext_wood_count[i] > 0 || this.ext_steel_count[i] > 0)
                first = true;
        }
        if (first)
            struct_count += 5;
        return this.acft_structure + struct_count;
    }
    GetCantileverType() {
        const wood_count = this.cant_count[0] + this.cant_count[4];
        const metal_count = this.cant_count[1] + this.cant_count[2] + this.cant_count[3];
        if (metal_count > 0)
            return 2;
        else if (wood_count > 0)
            return 1;
        else
            return 0;
    }
    GetCabaneList() {
        return this.ext_cabane_list;
    }
    GetCabane() {
        return this.cabane_sel;
    }
    SetCabane(num) {
        this.cabane_sel = num;
        this.CalculateStats();
    }
    SetCantLift(use) {
        this.cant_lift = use;
    }
    CanWingBlade() {
        for (const c of this.ext_wood_count) {
            if (c > 0)
                return false;
        }
        for (const c of this.ext_steel_count) {
            if (c > 0)
                return false;
        }
        return this.cabane_sel == 0 && this.cant_count[2] > 0;
    }
    GetWingBlade() {
        return this.wing_blades;
    }
    SetWingBlade(use) {
        this.wing_blades = use;
        this.CalculateStats();
    }
    SetAircraftType(type) {
        this.acft_type = type;
        if (type == AIRCRAFT_TYPE.HELICOPTER) {
            this.can_external = false;
            this.is_monoplane = false;
            this.is_tandem = false;
            this.is_staggered = false;
        }
        if (type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            this.can_external = false;
        }
        const can_wood = this.CanExternalWood();
        for (let i = 0; i < this.ext_wood_count.length; i++) {
            if (!can_wood[i])
                this.ext_wood_count[i] = 0;
        }
        const can_steel = this.CanExternalSteel();
        for (let i = 0; i < this.ext_steel_count.length; i++) {
            if (!can_steel[i])
                this.ext_steel_count[i] = 0;
        }
    }
    SetSesquiplane(sqp) {
        this.tension_sqp = sqp.is && sqp.super_small;
        this.limited_sqp = sqp.is && !sqp.super_small;
        if (this.limited_sqp) {
            for (let i = 0; i < this.ext_wood_list.length; i++) {
                if (!this.ext_wood_list[i].small_sqp)
                    this.ext_wood_count[i] = 0;
            }
            for (let i = 0; i < this.ext_steel_list.length; i++) {
                if (!this.ext_steel_list[i].small_sqp)
                    this.ext_steel_count[i] = 0;
            }
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        switch (this.acft_type) {
            case AIRCRAFT_TYPE.AIRPLANE:
            case AIRCRAFT_TYPE.AUTOGYRO:
            case AIRCRAFT_TYPE.ORNITHOPTER_BASIC:
                break;
            case AIRCRAFT_TYPE.HELICOPTER:
            case AIRCRAFT_TYPE.ORNITHOPTER_BUZZER:
            case AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER:
                this.cabane_sel = 0;
                break;
        }
        var tension_multiple = 1.0;
        if (this.is_monoplane)
            tension_multiple = 0.6;
        else if (this.is_tandem)
            tension_multiple = 0.8;
        else if (this.is_staggered)
            tension_multiple = 0.9;
        if (this.tension_sqp) {
            tension_multiple -= 0.15;
        }
        //Ornithopter multiple is less than any other option.
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            tension_multiple = 0.5;
        }
        if (!this.can_external) {
            for (let i = 0; i < this.ext_wood_count.length; i++) {
                this.ext_wood_count[i] = 0;
            }
            for (let i = 0; i < this.ext_steel_count.length; i++) {
                this.ext_steel_count[i] = 0;
            }
            this.cabane_sel = 0;
            this.wires = false;
        }
        var tension = 0;
        var strut_count = 0;
        var has_valid_first = false;
        //Wood Struts
        for (let i = 0; i < this.ext_wood_list.length; i++) {
            strut_count += this.ext_wood_count[i];
            if (this.ext_wood_count[i] > 0) {
                has_valid_first = has_valid_first || this.ext_wood_list[i].first;
                let ts = this.ext_wood_list[i].stats;
                ts = ts.Multiply(this.ext_wood_count[i]);
                stats = stats.Add(ts);
                if (this.ext_wood_list[i].config)
                    tension += tension_multiple * this.ext_wood_list[i].tension * this.ext_wood_count[i];
                else
                    tension += this.ext_wood_list[i].tension * this.ext_wood_count[i];
            }
        }
        //Steel Struts
        for (let i = 0; i < this.ext_steel_list.length; i++) {
            strut_count += this.ext_steel_count[i];
            if (this.ext_steel_count[i] > 0) {
                has_valid_first = has_valid_first || this.ext_wood_list[i].first;
                let ts = this.ext_steel_list[i].stats.Clone();
                ts = ts.Multiply(this.ext_steel_count[i]);
                stats = stats.Add(ts);
                if (this.ext_steel_list[i].config)
                    tension += tension_multiple * this.ext_steel_list[i].tension * this.ext_steel_count[i];
                else
                    tension += this.ext_steel_list[i].tension * this.ext_steel_count[i];
            }
        }
        //Reduce strain from regular struts by 50%
        //Does not affect Cabane, and tension is taken care off by multiplier.
        if (this.acft_type == AIRCRAFT_TYPE.ORNITHOPTER_BASIC) {
            stats.maxstrain = Math.floor(1.0e-6 + 0.5 * stats.maxstrain);
        }
        //First Strut Bonus
        if (has_valid_first) {
            stats.structure += 5;
            stats.maxstrain += 10;
            tension += 10;
        }
        //Cabane Strut
        const ts = this.ext_cabane_list[this.cabane_sel].stats.Clone();
        stats = stats.Add(ts);
        tension += tension_multiple * this.ext_cabane_list[this.cabane_sel].tension;
        if (this.cabane_sel > 0)
            strut_count += 1;
        if (this.wires) {
            stats.maxstrain += Math.floor(1.0e-6 + tension);
            stats.drag += 3 * strut_count;
        }
        var use_cant = false;
        var cant_strain = 0;
        for (let i = 0; i < this.cant_list.length; i++) {
            if (this.cant_count[i] > 0) {
                use_cant = true;
                let ts = this.cant_list[i].stats;
                ts = ts.Multiply(this.cant_count[i]);
                cant_strain += ts.maxstrain;
                stats = stats.Add(ts);
            }
        }
        //Wing Blades need Steel Cantilevers
        if (!this.CanWingBlade()) {
            this.wing_blades = false;
        } //So if we have them and are bladed...
        else if (this.wing_blades) {
            stats.mass *= 2;
            stats.warnings.push({
                source: Localization_lu("Wing Blades"),
                warning: Localization_lu("Wing Blades Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        if (use_cant) {
            stats.cost += 5;
            stats.liftbleed -= this.cant_lift;
        }
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Fuel.ts




class Fuel extends Part {
    constructor(js) {
        super();
        this.tank_stats = [];
        this.tank_count = [];
        for (const elem of js["tanks"]) {
            this.tank_stats.push({
                name: elem["name"], stats: new Stats(elem),
                internal: elem["internal"], cantilever: elem["cantilever"]
            });
            this.tank_count.push(0);
        }
        this.self_sealing = false;
        this.is_cantilever = false;
        this.wing_area = -1;
    }
    toJSON() {
        return {
            tank_count: this.tank_count,
            self_sealing: this.self_sealing,
            fire_extinguisher: this.fire_extinguisher,
        };
    }
    fromJSON(js, json_version) {
        this.tank_count = NumArr(js["tank_count"], this.tank_count.length);
        this.self_sealing = js["self_sealing"];
        this.fire_extinguisher = js["fire_extinguisher"];
        this.wing_area = -1;
    }
    serialize(s) {
        s.PushNumArr(this.tank_count);
        s.PushBool(this.self_sealing);
        s.PushBool(this.fire_extinguisher);
    }
    deserialize(d) {
        this.tank_count = d.GetNumArr(this.tank_count.length);
        this.self_sealing = d.GetBool();
        this.fire_extinguisher = d.GetBool();
        this.wing_area = -1;
    }
    GetTankList() {
        return this.tank_stats;
    }
    GetTankEnabled() {
        const lst = [];
        for (const e of this.tank_stats) {
            if (!this.is_cantilever && e.cantilever)
                lst.push(false);
            else
                lst.push(true);
        }
        return lst;
    }
    GetTankCount() {
        return this.tank_count;
    }
    SetTankCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.tank_count[idx] = count;
        this.VerifyOK();
        this.CalculateStats();
    }
    SetCantilever(is) {
        if (this.is_cantilever && !is) {
            this.is_cantilever = is;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.is_cantilever = is;
    }
    SetArea(num) {
        if (this.wing_area > num) {
            this.wing_area = num;
            if (this.VerifyOK())
                this.CalculateStats();
        }
        this.wing_area = num;
    }
    VerifyOK() {
        if (this.wing_area != -1) {
            //Count cantilever dependent tanks.
            var ccount = 0;
            for (let i = 0; i < this.tank_count.length; i++) {
                if (this.tank_stats[i].cantilever)
                    ccount += this.tank_count[i];
            }
            //How many can you have?
            var allowed = Math.floor(1.0e-6 + this.wing_area / 10);
            if (!this.is_cantilever)
                allowed = 0;
            //Do you have more than the allowed?
            var diff = ccount - allowed;
            const mod = diff > 0;
            //Loop over and reduce by one until you don't.
            while (diff > 0) {
                for (let i = this.tank_count.length - 1; i >= 0; i--) {
                    if (this.tank_stats[i].cantilever) {
                        this.tank_count[i]--;
                        diff--;
                        break;
                    }
                }
            }
            //Limit microtanks to 4
            for (let i = 0; i < this.tank_count.length; i++) {
                if (this.tank_stats[i].stats.wetmass == 0) {
                    this.tank_count[i] = Math.min(4, this.tank_count[i]);
                }
            }
            return mod;
        }
        return false;
    }
    GetSealingEnabled() {
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        return internal_count > 0;
    }
    GetSelfSealing() {
        return this.self_sealing;
    }
    SetSelfSealing(is) {
        this.self_sealing = is;
        this.CalculateStats();
    }
    GetExtinguisher() {
        return this.fire_extinguisher;
    }
    SetExtinguisher(is) {
        this.fire_extinguisher = is;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        var internal_count = 0;
        for (let i = 0; i < this.tank_count.length; i++) {
            let ts = this.tank_stats[i].stats.Clone();
            ts = ts.Multiply(this.tank_count[i]);
            stats = stats.Add(ts);
            if (this.tank_stats[i].internal)
                internal_count += this.tank_count[i];
        }
        stats.reqsections = Math.ceil(-1.0e-6 + stats.reqsections);
        if (this.self_sealing) {
            stats.mass += internal_count;
            stats.cost += 2 * internal_count;
            stats.era.push({ name: "Self-Sealing Gas Tank", era: "Roaring 20s" });
            stats.warnings.push({
                source: Localization_lu("Self-Sealing Gas Tank"),
                warning: Localization_lu("Self-Sealing Gas Tank Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        if (this.fire_extinguisher) {
            stats.mass += 2;
            stats.cost += 3;
            stats.era.push({ name: "Remote Fire Extinguisher", era: "WWII" });
            stats.warnings.push({
                source: Localization_lu("Remote Fire Extinguisher"),
                warning: Localization_lu("Remote Fire Extinguisher Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.wetmass % 5) > 0)
            stats.wetmass += 5 - (stats.wetmass % 5);
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Munitions.ts


class Munitions extends Part {
    constructor() {
        super();
        this.bomb_count = 0;
        this.rocket_count = 0;
        this.internal_bay_count = 0;
        this.internal_bay_1 = false;
        this.internal_bay_2 = false;
    }
    toJSON() {
        return {
            bomb_count: this.bomb_count,
            rocket_count: this.rocket_count,
            bay_count: this.internal_bay_count,
            bay1: this.internal_bay_1,
            bay2: this.internal_bay_2,
        };
    }
    fromJSON(js, json_version) {
        this.bomb_count = js["bomb_count"];
        this.internal_bay_count = js["bay_count"];
        this.internal_bay_1 = js["bay1"];
        this.internal_bay_2 = js["bay2"];
        if (json_version > 10.75) {
            this.rocket_count = js["rocket_count"];
        }
    }
    serialize(s) {
        s.PushNum(this.bomb_count);
        s.PushNum(this.internal_bay_count);
        s.PushBool(this.internal_bay_1);
        s.PushBool(this.internal_bay_2);
        s.PushNum(this.rocket_count);
    }
    deserialize(d) {
        this.bomb_count = d.GetNum();
        this.internal_bay_count = d.GetNum();
        this.internal_bay_1 = d.GetBool();
        this.internal_bay_2 = d.GetBool();
        if (d.version > 10.75) {
            this.rocket_count = d.GetNum();
        }
    }
    GetRocketCount() {
        return this.rocket_count;
    }
    GetBombCount() {
        return this.bomb_count;
    }
    GetInternalBombCount() {
        var ibc = 10 * this.internal_bay_count;
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                //Double Internal Count
                ibc *= 2;
                if (this.internal_bay_2) {
                    //Double Internal Count Again
                    ibc *= 2;
                }
            }
        }
        return ibc;
    }
    GetMaxBombSize() {
        var sz = 0;
        const ibc = this.GetInternalBombCount();
        if (this.bomb_count > 0 && this.internal_bay_count > 0) {
            if (this.internal_bay_1) {
                if (this.internal_bay_2) {
                    sz = Math.floor(1.0e-6 + ibc);
                }
                else {
                    sz = Math.floor(1.0e-6 + ibc / 2);
                }
            }
            else {
                sz = Math.floor(1.0e-6 + ibc / 4);
            }
        }
        return sz;
    }
    SetRocketCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.rocket_count = count;
        this.LimitMass();
        this.CalculateStats();
    }
    SetBombCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.bomb_count = count;
        this.LimitMass();
        this.CalculateStats();
    }
    GetBayCount() {
        return this.internal_bay_count;
    }
    GetBay1() {
        return this.internal_bay_1;
    }
    GetBay2() {
        return this.internal_bay_2;
    }
    SetBayCount(count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        this.internal_bay_count = count;
        this.CalculateStats();
    }
    SetUseBays(bay1, bay2) {
        this.internal_bay_1 = bay1;
        this.internal_bay_2 = bay2;
        if (!this.internal_bay_1 && this.internal_bay_2) {
            this.internal_bay_1 = true;
            this.internal_bay_2 = false;
        }
        this.CalculateStats();
    }
    LimitMass() {
        var reduce = false;
        const allowed_internal = Math.min(this.GetInternalBombCount(), Math.floor(1.0e-6 + 3 * this.acft_struct * this.maxbomb));
        var ib = 0;
        var ir = 0;
        var eb = 0;
        var er = 0;
        if (this.bomb_count > allowed_internal) {
            ib = allowed_internal;
        }
        else {
            ib = this.bomb_count;
        }
        if (this.rocket_count + ib > allowed_internal) {
            ir = allowed_internal - ib;
        }
        else {
            ir = this.rocket_count;
        }
        eb = this.bomb_count - ib;
        er = this.rocket_count - ir;
        const allowed_external = Math.floor(1.0e-6 + this.acft_struct * this.maxbomb - (ib + ir) / 3) * this.gull_factor;
        while (eb + er > allowed_external) {
            if (er > 0) {
                er--;
            }
            else {
                eb--;
            }
        }
        if (this.bomb_count > ib + eb) {
            reduce = true;
            this.bomb_count = ib + eb;
        }
        if (this.rocket_count > ir + er) {
            reduce = true;
            this.rocket_count = ir + er;
        }
        return reduce;
    }
    GetExternalMass() {
        const ext_bomb_count = this.bomb_count + this.rocket_count;
        return Math.max(0, ext_bomb_count - this.GetInternalBombCount());
    }
    SetAcftParameters(struct, maxbomb, gull_deck) {
        this.acft_struct = struct;
        this.maxbomb = maxbomb;
        switch (gull_deck) {
            //Parasol and Shoulder do nothing
            case 2: //Mid
            case 3: //Low
                this.gull_factor = 1.1;
                break;
            case 4: //Gear
                this.gull_factor = 1.2;
                break;
            default:
                this.gull_factor = 1;
        }
        if (this.LimitMass()) {
            this.CalculateStats();
        }
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        const stats = new Stats();
        const ext_bomb_count = this.GetExternalMass();
        stats.reqsections += this.internal_bay_count;
        if (this.internal_bay_count > 0) {
            const count = stats.reqsections;
            if (this.internal_bay_1) {
                stats.reqsections += count;
                if (this.internal_bay_2) {
                    stats.reqsections += count;
                }
            }
        }
        const rack_mass = Math.ceil(-1.0e-6 + ext_bomb_count / 5);
        stats.mass += rack_mass;
        stats.drag += rack_mass;
        stats.bomb_mass = this.bomb_count + this.rocket_count;
        stats.reqsections = Math.ceil(-1.0e-6 + stats.reqsections);
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/CargoAndPassengers.ts


class CargoAndPassengers extends Part {
    constructor(js) {
        super();
        this.cargo_list = [];
        for (const elem of js["spaces"]) {
            this.cargo_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cargo_sel = 0;
    }
    toJSON() {
        return {
            space_sel: this.cargo_sel,
        };
    }
    fromJSON(js, json_version) {
        this.cargo_sel = js["space_sel"];
    }
    serialize(s) {
        s.PushNum(this.cargo_sel);
    }
    deserialize(d) {
        this.cargo_sel = d.GetNum();
    }
    GetSpaceList() {
        return this.cargo_list;
    }
    GetSpace() {
        return this.cargo_sel;
    }
    SetSpace(num) {
        this.cargo_sel = num;
        this.CalculateStats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        stats = stats.Add(this.cargo_list[this.cargo_sel].stats);
        stats.bomb_mass += stats.reqsections * 3;
        //Because it is load, it rounds up to the nearest 5 mass.
        if ((stats.bomb_mass % 5) > 0)
            stats.bomb_mass += 5 - (stats.bomb_mass % 5);
        return stats;
    }
    GetElectrics() {
        const battery_storage = 0;
        const equipment = [];
        return { storage: battery_storage, equipment: equipment };
    }
}

;// CONCATENATED MODULE: ./src/impl/LandingGear.ts




class LandingGear extends Part {
    constructor(js) {
        super();
        this.gear_list = [];
        this.gear_sel = 0;
        this.retract = false;
        for (const elem of js["gear"]) {
            this.gear_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                DpLMP: elem["DpLMP"],
                SpLMP: elem["SpLMP"],
                can_retract: elem["can_retract"]
            });
        }
        this.extra_list = [];
        for (const elem of js["extras"]) {
            this.extra_list.push({
                name: elem["name"],
                stats: new Stats(elem),
                MpLMP: elem["MpLMP"]
            });
        }
        this.extra_sel = [...Array(this.extra_list.length).fill(false)];
    }
    toJSON() {
        return {
            gear_sel: this.gear_sel,
            retract: this.retract,
            extra_sel: this.extra_sel,
        };
    }
    fromJSON(js, json_version) {
        this.gear_sel = js["gear_sel"];
        this.retract = js["retract"];
        this.extra_sel = BoolArr(js["extra_sel"], this.extra_sel.length);
    }
    serialize(s) {
        s.PushNum(this.gear_sel);
        s.PushBool(this.retract);
        s.PushBoolArr(this.extra_sel);
    }
    deserialize(d) {
        this.gear_sel = d.GetNum();
        this.retract = d.GetBool();
        this.extra_sel = d.GetBoolArr(this.extra_sel.length);
    }
    GetGearName() {
        if (this.retract && this.gear_list[this.gear_sel].name == "Boat Hull") {
            return Localization_lu("Retractable Gear + Boat Hull");
        }
        if (this.retract)
            return Localization_lu("Retractable ") + Localization_lu(this.gear_list[this.gear_sel].name);
        else
            return Localization_lu(this.gear_list[this.gear_sel].name);
    }
    GetGearList() {
        return this.gear_list;
    }
    CanGear() {
        const count = [...Array(this.gear_list.length).fill(true)];
        for (let i = 0; i < this.gear_list.length; i++) {
            const g = this.gear_list[i];
            if (g.name == "Boat Hull" && !this.can_boat)
                count[i] = false;
        }
        return count;
    }
    GetGear() {
        return this.gear_sel;
    }
    SetGear(num) {
        if (this.CanGear()[num])
            this.gear_sel = num;
        this.CalculateStats();
    }
    CanRetract() {
        return this.gear_list[this.gear_sel].can_retract
            || this.gear_list[this.gear_sel].name == "Boat Hull";
    }
    GetRetract() {
        return this.retract;
    }
    SetRetract(is) {
        this.retract = is && this.CanRetract();
        this.CalculateStats();
    }
    GetExtraList() {
        return this.extra_list;
    }
    GetExtraSelected() {
        return this.extra_sel;
    }
    SetExtraSelected(idx, is) {
        this.extra_sel[idx] = is;
        this.CalculateStats();
    }
    SetLoadedMass(mass) {
        this.loadedMass = mass;
    }
    CanBoat(engine_height, wing_height) {
        if (engine_height == 2)
            this.can_boat = true;
        else if (engine_height == 1 && wing_height >= 3)
            this.can_boat = true;
        else if (engine_height == 0 && wing_height >= 4)
            this.can_boat = true;
        else
            this.can_boat = false;
    }
    SetGull(deck) {
        this.gull_deck = deck;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    IsVital() {
        return true;
    }
    PartStats() {
        var stats = new Stats();
        if (!this.CanGear()[this.gear_sel])
            this.gear_sel = 0;
        //Do this first, so we can add the Zepplin Hook to the mass
        //TODO: This is a hack, and it is terrible. Separate hook?
        var tempMass = this.loadedMass;
        for (let i = 0; i < this.extra_list.length; i++) {
            if (this.extra_sel[i]) {
                stats = stats.Add(this.extra_list[i].stats);
                tempMass += this.extra_list[i].stats.mass;
                stats.mass += Math.floor(1.0e-6 + this.extra_list[i].MpLMP * Math.floor(1.0e-6 + tempMass / 5));
            }
        }
        stats = stats.Add(this.gear_list[this.gear_sel].stats);
        var pdrag = this.gear_list[this.gear_sel].DpLMP * Math.floor(1.0e-6 + tempMass / 5);
        //Retractable gear with Boat Hull adds normal hull drag,
        // plus the mass and cost of normal retrctable gear
        if (this.gear_list[this.gear_sel].name == "Boat Hull" && this.retract) {
            stats.drag += pdrag;
            pdrag = this.gear_list[0].DpLMP * Math.floor(1.0e-6 + tempMass / 5);
        }
        //Gull wings don't affect Boat Hulls, but do affect the normal gear you get
        //if you put retract on your boat hull.  Since the hull is already applied,
        //we can just modify here.
        if (this.gear_list[this.gear_sel].name != "Boat Hull" || this.retract) {
            switch (this.gull_deck) {
                case 1: //Shoulder
                    pdrag -= Math.floor(1.0e-6 + 0.1 * pdrag);
                    break;
                case 2: //Mid
                case 3: //Low
                    pdrag -= Math.floor(1.0e-6 + 0.15 * pdrag);
                    break;
                case 4: //Gear
                    pdrag -= Math.floor(1.0e-6 + 0.25 * pdrag);
                    break;
                default:
                //No change
            }
        }
        if (this.retract) {
            stats.mass += Math.floor(1.0e-6 + pdrag / 2);
            stats.cost += Math.floor(1.0e-6 + pdrag / 2);
        }
        else {
            stats.drag += pdrag;
        }
        stats.structure += this.gear_list[this.gear_sel].SpLMP * Math.floor(1.0e-6 + tempMass / 5);
        stats.Round();
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Accessories.ts





class Accessories extends Part {
    constructor(js) {
        super();
        this.armour_coverage = [...Array(8).fill(0)];
        this.acft_rad = false;
        this.skin_armour = 0;
        this.vital_parts = 0;
        this.electric_list = [];
        for (const elem of js["electrical"]) {
            this.electric_list.push({
                name: elem["name"], stats: new Stats(elem),
                cp10s: elem["cp10s"], storage: elem["storage"],
            });
        }
        this.electrical_count = [...Array(this.electric_list.length).fill(0)];
        this.radio_list = [];
        this.radio_sel = 0;
        for (const elem of js["radios"]) {
            this.radio_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.recon_list = [];
        for (const elem of js["recon"]) {
            this.recon_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.recon_sel = Array(this.recon_list.length).fill(0);
        this.visi_list = [];
        for (const elem of js["visibility"]) {
            this.visi_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.visi_sel = [...Array(this.visi_list.length).fill(false)];
        this.can_visi = [...Array(this.visi_list.length).fill(true)];
        this.clim_list = [];
        for (const elem of js["climate"]) {
            this.clim_list.push({ name: elem["name"], stats: new Stats(elem), req_radiator: elem["req_radiator"] });
        }
        this.clim_sel = [...Array(this.clim_list.length).fill(false)];
        this.auto_list = [];
        this.auto_sel = 0;
        for (const elem of js["autopilots"]) {
            this.auto_list.push({ name: elem["name"], stats: new Stats(elem) });
        }
        this.cont_list = [];
        this.cont_sel = 0;
        for (const elem of js["control"]) {
            this.cont_list.push({ name: elem["name"], max_mass_stress: elem["max_mass_stress"], max_total_stress: elem["max_total_stress"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            v: 2,
            armour_coverage: this.armour_coverage,
            electrical_count: this.electrical_count,
            radio_sel: this.radio_sel,
            recon_sel: this.recon_sel,
            visi_sel: this.visi_sel,
            clim_sel: this.clim_sel,
            auto_sel: this.auto_sel,
            cont_sel: this.cont_sel,
        };
    }
    fromJSON(js, json_version) {
        if (js["v"] == 2) {
            this.armour_coverage = js["armour_coverage"];
        }
        this.skin_armour = 0;
        if (json_version < 11.85) {
            this.electrical_count = NumArr(js["electrical_count"], this.electrical_count.length + 1);
            this.electrical_count[0] += this.electrical_count[1];
            this.electrical_count.splice(1, 1);
        }
        else {
            this.electrical_count = NumArr(js["electrical_count"], this.electrical_count.length);
        }
        this.radio_sel = js["radio_sel"];
        if (json_version < 12.05) {
            const old_info = BoolArr(js["info_sel"], 2);
            this.recon_sel = Array(this.recon_list.length).fill(0);
            if (old_info[0])
                this.recon_sel[1] = 1;
            if (old_info[1])
                this.recon_sel[0] = 1;
        }
        else {
            this.recon_sel = NumArr(js["recon_sel"], this.recon_sel.length);
        }
        this.visi_sel = BoolArr(js["visi_sel"], this.visi_sel.length);
        this.clim_sel = BoolArr(js["clim_sel"], this.clim_sel.length);
        if (json_version < 11.95) {
            this.clim_sel.splice(2, 1);
        }
        this.auto_sel = js["auto_sel"];
        this.cont_sel = js["cont_sel"];
    }
    serialize(s) {
        s.PushNumArr(this.armour_coverage);
        s.PushNumArr(this.electrical_count);
        s.PushNum(this.radio_sel);
        s.PushNumArr(this.recon_sel);
        s.PushBoolArr(this.visi_sel);
        s.PushBoolArr(this.clim_sel);
        s.PushNum(this.auto_sel);
        s.PushNum(this.cont_sel);
    }
    deserialize(d) {
        this.armour_coverage = d.GetNumArr(this.armour_coverage.length);
        this.skin_armour = 0;
        if (d.version < 11.85) {
            this.electrical_count = d.GetNumArr(this.electrical_count.length + 1);
            this.electrical_count[0] += this.electrical_count[1];
            this.electrical_count.splice(1, 1);
        }
        else {
            this.electrical_count = d.GetNumArr(this.electrical_count.length);
        }
        this.radio_sel = d.GetNum();
        if (d.version < 12.05) {
            const old_info = d.GetBoolArr(2);
            this.recon_sel = Array(this.recon_list.length).fill(0);
            if (old_info[0])
                this.recon_sel[1] = 1;
            if (old_info[1])
                this.recon_sel[0] = 1;
        }
        else {
            this.recon_sel = d.GetNumArr(this.recon_sel.length);
        }
        this.visi_sel = d.GetBoolArr(this.visi_sel.length);
        this.clim_sel = d.GetBoolArr(this.clim_sel.length);
        if (d.version < 11.95) {
            this.clim_sel.splice(2, 1);
        }
        this.auto_sel = d.GetNum();
        this.cont_sel = d.GetNum();
    }
    GetCommunicationName() {
        return Localization_lu(this.radio_list[this.radio_sel].name);
    }
    GetArmourCoverageForDisplay() {
        var arr = [];
        for (let i = 0; i < this.armour_coverage.length; i++) {
            arr.push(this.armour_coverage[i]);
        }
        arr[1] += this.skin_armour;
        return arr;
    }
    GetEffectiveCoverage() {
        const arr = [];
        const vital_adj = Math.max(0, Math.floor((this.vital_parts - 8) / 2));
        for (let i = 0; i < this.armour_coverage.length; i++) {
            arr.push(Math.max(0, this.armour_coverage[i]));
        }
        arr[1] += this.skin_armour;
        let sum = 0;
        for (let r = this.armour_coverage.length - 1; r >= 0; r--) {
            sum += arr[r];
            arr[r] = sum - vital_adj;
        }
        return arr;
    }
    SetArmourCoverage(idx, num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        if (idx != 1)
            this.armour_coverage[idx] = num;
        else
            this.armour_coverage[idx] = num - this.skin_armour;
        this.NormalizeCoverage();
        this.CalculateStats();
    }
    NormalizeCoverage() {
        var coverage = -8 + Math.min(0, -Math.floor(1.0e-6 + (this.vital_parts - 8) / 2));
        coverage += this.skin_armour;
        for (let i = this.armour_coverage.length - 1; i >= 0; i--) {
            this.armour_coverage[i] = Math.max(0, Math.min(Math.abs(coverage), this.armour_coverage[i]));
            coverage += this.armour_coverage[i];
        }
    }
    GetElectricalList() {
        return this.electric_list;
    }
    GetElectricalCount() {
        return this.electrical_count;
    }
    SetElectricalCount(idx, count) {
        if (count != count || count < 0)
            count = 0;
        count = Math.floor(1.0e-6 + count);
        count = Math.min(count, 50);
        this.electrical_count[idx] = count;
        this.CalculateStats();
    }
    GetRadioList() {
        return this.radio_list;
    }
    GetRadioSel() {
        return this.radio_sel;
    }
    SetRadioSel(num) {
        this.radio_sel = num;
        this.CalculateStats();
    }
    GetReconList() {
        return this.recon_list;
    }
    GetReconSel() {
        return this.recon_sel;
    }
    SetReconSel(idx, num) {
        num = Math.trunc(num);
        if (num != num || num < 0)
            num = 0;
        this.recon_sel[idx] = num;
        this.CalculateStats();
    }
    GetVisibilityList() {
        return this.visi_list;
    }
    GetCanVisibility() {
        return this.can_visi;
    }
    GetVisibilitySel() {
        return this.visi_sel;
    }
    SetVisibilitySel(idx, use) {
        this.visi_sel[idx] = use;
        this.CalculateStats();
    }
    GetClimateList() {
        return this.clim_list;
    }
    GetClimateSel() {
        return this.clim_sel;
    }
    GetClimateEnable() {
        const can = [];
        for (const c of this.clim_list) {
            if (!this.acft_rad && c.req_radiator)
                can.push(false);
            else
                can.push(true);
        }
        return can;
    }
    SetClimateSel(idx, use) {
        this.clim_sel[idx] = use;
        this.CalculateStats();
    }
    GetAutopilotList() {
        return this.auto_list;
    }
    GetAutopilotSel() {
        return this.auto_sel;
    }
    SetAutopilotSel(num) {
        this.auto_sel = num;
        this.CalculateStats();
    }
    GetControlList() {
        return this.cont_list;
    }
    GetControlSel() {
        return this.cont_sel;
    }
    SetControlSel(num) {
        this.cont_sel = num;
        this.CalculateStats();
    }
    SetAcftRadiator(have) {
        this.acft_rad = have;
    }
    IsElectrics() {
        for (const e of this.electrical_count) {
            if (e > 0)
                return true;
        }
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && this.clim_list[i].stats.charge != 0)
                return true;
        }
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i] && this.visi_list[i].stats.charge != 0)
                return true;
        }
        if (this.radio_list[this.radio_sel].stats.charge != 0)
            return true;
        if (this.auto_list[this.auto_sel].stats.charge != 0)
            return true;
        return false;
    }
    SetSkinArmor(num) {
        this.skin_armour = num;
        //Would normalize Coverage, but Vital Parts is always called next.
    }
    SetVitalParts(num) {
        this.vital_parts = num;
        this.NormalizeCoverage();
    }
    GetMaxMassStress() {
        return this.cont_list[this.cont_sel].max_mass_stress;
    }
    GetMaxTotalStress() {
        return this.cont_list[this.cont_sel].max_total_stress;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetStorage() {
        return 5 * this.electrical_count[2]
            + 5 * this.electrical_count[3];
    }
    GetWindmill() {
        var production = 0;
        for (let i = 0; i < this.electrical_count.length; i++) {
            production += this.electric_list[i].cp10s * this.electrical_count[i];
        }
        return production;
    }
    SetCanCutouts(wing, frame) {
        for (let i = 0; i < this.visi_list.length; i++) {
            let can = true;
            switch (this.visi_list[i].name) {
                case "Wing Cutouts":
                    can = wing;
                    break;
                case "Hull Cutouts":
                    can = frame;
                    break;
            }
            this.can_visi[i] = can;
            if (!can)
                this.visi_sel[i] = false;
        }
    }
    PartStats() {
        var stats = new Stats();
        var armour_str = "";
        //Armour
        const eff_armour = this.GetEffectiveCoverage();
        for (let i = 0; i < this.armour_coverage.length; i++) {
            const AP = i + 1;
            var count = this.armour_coverage[i];
            stats.mass += count * Math.pow(2, AP - 1);
            stats.cost += Math.floor(1.0e-6 + count * AP / 3);
            stats.toughness += this.armour_coverage[i] * AP;
            if (eff_armour[i] > 0) {
                if (armour_str != "")
                    armour_str += ", ";
                armour_str += AP.toString() + "/" + (11 - eff_armour[i]).toString() + "+";
            }
        }
        if (armour_str != "") {
            stats.warnings.push({
                source: Localization_lu("Armour"), warning: armour_str,
                color: WARNING_COLOR.WHITE,
            });
        }
        //Electrical
        for (let i = 0; i < this.electrical_count.length; i++) {
            if (this.electrical_count[i] > 0) {
                let ts = this.electric_list[i].stats.Clone();
                ts = ts.Multiply(this.electrical_count[i]);
                stats = stats.Add(ts);
            }
        }
        stats = stats.Add(this.radio_list[this.radio_sel].stats);
        //Information
        for (let i = 0; i < this.recon_list.length; i++) {
            if (this.recon_sel[i] > 0) {
                let ts = this.recon_list[i].stats.Clone();
                ts = ts.Multiply(this.recon_sel[i]);
                stats = stats.Add(ts);
            }
        }
        //Visibility
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i])
                stats = stats.Add(this.visi_list[i].stats);
        }
        //Climate
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i] && (!this.clim_list[i].req_radiator || this.acft_rad))
                stats = stats.Add(this.clim_list[i].stats);
        }
        //Control
        stats = stats.Add(this.auto_list[this.auto_sel].stats);
        stats = stats.Add(this.cont_list[this.cont_sel].stats);
        stats.Round();
        return stats;
    }
    GetElectrics() {
        var battery_storage = 0;
        var equipment = [];
        for (let i = 0; i < this.electric_list.length; i++) {
            const item = this.electric_list[i];
            const count = this.electrical_count[i];
            if (count > 0) {
                battery_storage += item.storage * count;
                if (item.cp10s > 0) {
                    equipment.push({
                        source: Localization_lu(item.name),
                        charge: string_StringFmt.Format("{0}" + Localization_lu("Derived Per 10 Speed"), Math.floor(1.0e-6 + count * item.cp10s)),
                    });
                }
                else if (item.stats.charge != 0) {
                    equipment.push({
                        source: Localization_lu(item.name),
                        charge: (count * item.stats.charge).toString(),
                    });
                }
            }
        }
        const radio = this.radio_list[this.radio_sel];
        equipment = this.FormatEquipment(equipment, radio.name, radio.stats.charge);
        for (let i = 0; i < this.clim_list.length; i++) {
            if (this.clim_sel[i]) {
                const item = this.clim_list[i];
                equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
            }
        }
        for (let i = 0; i < this.recon_list.length; i++) {
            const item = this.recon_list[i];
            const count = this.recon_sel[i];
            if (count > 0) {
                equipment = this.FormatEquipment(equipment, item.name, count * item.stats.charge);
            }
        }
        for (let i = 0; i < this.visi_list.length; i++) {
            if (this.visi_sel[i]) {
                const item = this.visi_list[i];
                equipment = this.FormatEquipment(equipment, item.name, item.stats.charge);
            }
        }
        const autopilot = this.auto_list[this.auto_sel];
        equipment = this.FormatEquipment(equipment, autopilot.name, autopilot.stats.charge);
        const controls = this.cont_list[this.cont_sel];
        equipment = this.FormatEquipment(equipment, controls.name, controls.stats.charge);
        return { storage: battery_storage, equipment: equipment };
    }
}

;// CONCATENATED MODULE: ./src/impl/Optimization.ts


class Optimization extends Part {
    constructor() {
        super();
        this.free_dots = 0;
        this.cost = 0;
        this.bleed = 0;
        this.escape = 0;
        this.mass = 0;
        this.toughness = 0;
        this.maxstrain = 0;
        this.reliability = 0;
        this.drag = 0;
        this.acft_stats = new Stats;
    }
    toJSON() {
        return {
            free_dots: this.free_dots,
            cost: this.cost,
            bleed: this.bleed,
            escape: this.escape,
            mass: this.mass,
            toughness: this.toughness,
            maxstrain: this.maxstrain,
            reliability: this.reliability,
            drag: this.drag,
        };
    }
    fromJSON(js, json_version) {
        this.free_dots = js["free_dots"];
        this.cost = js["cost"];
        this.bleed = js["bleed"];
        this.escape = js["escape"];
        this.mass = js["mass"];
        this.toughness = js["toughness"];
        this.maxstrain = js["maxstrain"];
        this.reliability = js["reliability"];
        this.drag = js["drag"];
    }
    serialize(s) {
        s.PushNum(this.free_dots);
        s.PushNum(this.cost);
        s.PushNum(this.bleed);
        s.PushNum(this.escape);
        s.PushNum(this.mass);
        s.PushNum(this.toughness);
        s.PushNum(this.maxstrain);
        s.PushNum(this.reliability);
        s.PushNum(this.drag);
    }
    deserialize(d) {
        this.free_dots = d.GetNum();
        this.cost = d.GetNum();
        this.bleed = d.GetNum();
        this.escape = d.GetNum();
        this.mass = d.GetNum();
        this.toughness = d.GetNum();
        this.maxstrain = d.GetNum();
        this.reliability = d.GetNum();
        this.drag = d.GetNum();
    }
    GetUnassignedCount() {
        return this.free_dots - this.cost - this.bleed
            - this.escape - this.mass - this.toughness - this.maxstrain
            - this.reliability - this.drag;
    }
    ReduceDots() {
        var diff = -this.GetUnassignedCount();
        if (diff > 0) {
            let d = Math.min(diff, this.drag);
            d = Math.max(d, 0);
            this.drag -= d;
            diff -= d;
            d = Math.min(diff, this.reliability);
            d = Math.max(d, 0);
            this.reliability -= d;
            diff -= d;
            d = Math.min(diff, this.maxstrain);
            d = Math.max(d, 0);
            this.maxstrain -= d;
            diff -= d;
            d = Math.min(diff, this.toughness);
            d = Math.max(d, 0);
            this.toughness -= d;
            diff -= d;
            d = Math.min(diff, this.mass);
            d = Math.max(d, 0);
            this.mass -= d;
            diff -= d;
            d = Math.min(diff, this.escape);
            d = Math.max(d, 0);
            this.escape -= d;
            diff -= d;
            d = Math.min(diff, this.bleed);
            d = Math.max(d, 0);
            this.bleed -= d;
            diff -= d;
            d = Math.min(diff, this.cost);
            d = Math.max(d, 0);
            this.cost -= d;
            diff -= d;
        }
    }
    GetFreeDots() {
        return this.free_dots;
    }
    SetFreeDots(num) {
        if (num != num || num < 0)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, 0);
        this.free_dots = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetCost() {
        return this.cost;
    }
    SetCost(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.cost = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetBleed() {
        return this.bleed;
    }
    SetBleed(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.bleed = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetEscape() {
        return this.escape;
    }
    SetEscape(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.escape = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetMass() {
        return this.mass;
    }
    SetMass(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.mass = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetToughness() {
        return this.toughness;
    }
    SetToughness(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.toughness = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetMaxStrain() {
        return this.maxstrain;
    }
    SetMaxStrain(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.maxstrain = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetReliabiilty() {
        return this.reliability;
    }
    SetReliability(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.reliability = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    GetDrag() {
        return this.drag;
    }
    SetDrag(num) {
        if (num != num)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        num = Math.max(num, -3);
        num = Math.min(num, 3);
        this.drag = num;
        this.ReduceDots();
        this.CalculateStats();
    }
    SetAcftStats(stats) {
        this.acft_stats = stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        const stats = new Stats();
        stats.cost = Math.floor(1.0e-6 + -(this.cost * this.acft_stats.cost / 10));
        stats.liftbleed = Math.floor(1.0e-6 + -this.bleed * 3);
        stats.escape = this.escape;
        stats.visibility = this.escape;
        stats.mass = Math.floor(1.0e-6 + -(this.mass * this.acft_stats.mass / 10));
        stats.toughness = Math.floor(1.0e-6 + this.toughness * this.acft_stats.toughness / 4);
        //This Gets applied later, in derived stats.
        // stats.maxstrain = Math.floor(1.0e-6 + this.maxstrain * 1.5 * this.acft_stats.maxstrain / 10);
        stats.reliability = this.reliability * 2;
        stats.drag = Math.floor(1.0e-6 + -(this.drag * this.acft_stats.drag / 10));
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Weapon.ts



var SynchronizationType;
(function (SynchronizationType) {
    SynchronizationType[SynchronizationType["NONE"] = -1] = "NONE";
    SynchronizationType[SynchronizationType["INTERRUPT"] = 0] = "INTERRUPT";
    SynchronizationType[SynchronizationType["SYNCH"] = 1] = "SYNCH";
    SynchronizationType[SynchronizationType["SPINNER"] = 2] = "SPINNER";
    SynchronizationType[SynchronizationType["DEFLECT"] = 3] = "DEFLECT";
    SynchronizationType[SynchronizationType["NO_INTERFERENCE"] = 4] = "NO_INTERFERENCE";
    SynchronizationType[SynchronizationType["ENUM_MAX"] = 5] = "ENUM_MAX";
})(SynchronizationType || (SynchronizationType = {}));
var Weapon_ProjectileType;
(function (ProjectileType) {
    ProjectileType[ProjectileType["BULLETS"] = 0] = "BULLETS";
    ProjectileType[ProjectileType["HEATRAY"] = 1] = "HEATRAY";
    ProjectileType[ProjectileType["PNEUMATIC"] = 2] = "PNEUMATIC";
    ProjectileType[ProjectileType["ENUM_MAX"] = 3] = "ENUM_MAX";
    ProjectileType[ProjectileType["GYROJETS"] = 4] = "GYROJETS";
})(Weapon_ProjectileType || (Weapon_ProjectileType = {}));
var ActionType;
(function (ActionType) {
    ActionType[ActionType["STANDARD"] = 0] = "STANDARD";
    ActionType[ActionType["MECHANICAL"] = 1] = "MECHANICAL";
    ActionType[ActionType["GAST"] = 2] = "GAST";
    ActionType[ActionType["ROTARY"] = 3] = "ROTARY";
    ActionType[ActionType["ENUM_MAX"] = 4] = "ENUM_MAX";
})(ActionType || (ActionType = {}));
class Weapon extends Part {
    constructor(weapon_type, action, projectile, fixed = false) {
        super();
        this.weapon_type = weapon_type;
        this.fixed = fixed;
        this.wing = true;
        this.covered = false;
        this.accessible = false;
        this.free_accessible = false;
        if (fixed)
            this.synchronization = SynchronizationType.NONE;
        else
            this.synchronization = SynchronizationType.INTERRUPT;
        this.w_count = 1;
        this.repeating = false;
        this.wing_reinforcement = false;
    }
    toJSON() {
        return {
            fixed: this.fixed,
            wing: this.wing,
            covered: this.covered,
            accessible: this.accessible,
            free_accessible: this.free_accessible,
            synchronization: this.synchronization,
            w_count: this.w_count,
        };
    }
    fromJSON(js, json_version) {
        this.fixed = js["fixed"];
        this.wing = js["wing"];
        this.covered = js["covered"];
        this.accessible = js["accessible"];
        this.free_accessible = js["free_accessible"];
        this.synchronization = js["synchronization"];
        this.w_count = js["w_count"];
        if (json_version < 10.95)
            this.repeating = js["repeating"];
    }
    serialize(s) {
        s.PushBool(this.fixed);
        s.PushBool(this.wing);
        s.PushBool(this.covered);
        s.PushBool(this.accessible);
        s.PushBool(this.free_accessible);
        s.PushNum(this.synchronization);
        s.PushNum(this.w_count);
    }
    deserialize(d) {
        this.fixed = d.GetBool();
        this.wing = d.GetBool();
        this.covered = d.GetBool();
        this.accessible = d.GetBool();
        this.free_accessible = d.GetBool();
        this.synchronization = d.GetNum();
        this.w_count = d.GetNum();
        if (d.version < 10.95)
            this.repeating = d.GetBool();
    }
    SetWeaponType(weapon_type, action, projectile) {
        this.weapon_type = weapon_type;
        this.action = action;
        if (this.weapon_type.size == 16) {
            this.w_count = 1;
        }
        this.SetCount(this.w_count); //Triggers Calculate Stats
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
        if (use != this.fixed) {
            if (use) {
                this.fixed = true;
            }
            else {
                this.fixed = false;
                this.synchronization = SynchronizationType.NONE;
            }
            this.CalculateStats();
        }
    }
    SetCanWing(can) {
        this.canwing = can;
        if (this.wing && !can) {
            this.wing = false;
        }
    }
    GetWing() {
        return this.wing;
    }
    CanWing() {
        return this.weapon_type.size <= 16 && this.canwing;
    }
    SetWing(use) {
        if (use && this.CanWing()) {
            this.wing = true;
            this.free_accessible = false;
            this.synchronization = SynchronizationType.NONE;
        }
        else {
            this.wing = false;
        }
        this.CalculateStats();
    }
    CanCovered() {
        if (this.wing)
            return this.has_cantilever && !(this.weapon_type.size == 16 && !this.fixed);
        else
            return !(this.GetArty() && !this.fixed);
    }
    GetCovered() {
        return this.covered;
    }
    SetCovered(use) {
        this.covered = use;
        this.CalculateStats();
    }
    GetAccessible() {
        return this.accessible || this.free_accessible;
    }
    SetAccessible(use) {
        if (use && this.free_accessible)
            use = false;
        this.accessible = use;
        this.CalculateStats();
    }
    GetFreeAccessible() {
        return this.free_accessible;
    }
    SetFreeAccessible(use) {
        if (use && !this.wing && this.can_free_accessible) {
            this.free_accessible = true;
            this.accessible = false;
        }
        else {
            this.free_accessible = false;
        }
        this.CalculateStats();
    }
    CanSynchronization() {
        const lst = [];
        for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
            lst.push(this.CanSynch(i));
        }
        return lst;
    }
    CanSynch(num) {
        if (!this.fixed && !this.wing) {
            if (!this.can_synchronize) {
                if (num == SynchronizationType.NONE)
                    return true;
                else
                    return false;
            }
            if (num == SynchronizationType.NONE || num == SynchronizationType.DEFLECT || num == SynchronizationType.NO_INTERFERENCE) {
                return true;
            }
            else {
                return false;
            }
        }
        if (this.can_synchronize && num == SynchronizationType.NONE) {
            return false;
        }
        else if (!this.can_synchronize && num != SynchronizationType.NONE) {
            return false;
        }
        if (this.weapon_type.name == "Fliergerflammenwerfer" &&
            !(num == SynchronizationType.NONE || num == SynchronizationType.SPINNER || num == SynchronizationType.NO_INTERFERENCE)) {
            return false;
        }
        if (this.action == ActionType.MECHANICAL && !(num == SynchronizationType.NONE || num == SynchronizationType.SYNCH ||
            (num == SynchronizationType.SPINNER && this.CanSpinner())))
            return false;
        if (this.action == ActionType.GAST && num == SynchronizationType.SPINNER)
            return false;
        if ((num == SynchronizationType.INTERRUPT || num == SynchronizationType.SYNCH)
            && !this.weapon_type.synched) {
            return false;
        }
        else if (num == SynchronizationType.SPINNER && !this.CanSpinner()) {
            return false;
        }
        else if (num == SynchronizationType.DEFLECT && this.GetArty()) {
            return false;
        }
        return true;
    }
    GetSynchronization() {
        return this.synchronization;
    }
    SetSynchronization(use) {
        if (!this.CanSynch(use)) {
            this.synchronization = SynchronizationType.NONE;
        }
        else {
            this.synchronization = use;
        }
        if (this.synchronization == SynchronizationType.SPINNER)
            this.w_count = 1;
        this.CalculateStats();
    }
    GetCount() {
        return this.w_count;
    }
    SetCount(use) {
        if (use != use) {
            use = 1;
        }
        use = Math.max(1, use);
        if (this.synchronization == SynchronizationType.SPINNER)
            use = 1;
        if (this.weapon_type.name == "Precision Rifle")
            use = 1;
        while (use * this.weapon_type.size > 16) {
            use -= 1;
        }
        this.w_count = use;
        this.CalculateStats();
    }
    CanRepeating() {
        return !this.weapon_type.rapid || this.weapon_type.reload > 0;
    }
    GetRepeating() {
        return this.repeating;
    }
    SetRepeating(use) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else
            this.repeating = false;
        this.CalculateStats();
    }
    ResolveSynch() {
        const use = this.synchronization;
        this.synchronization = SynchronizationType.ENUM_MAX;
        if (!this.CanSynch(use)) {
            for (let i = -1; i < SynchronizationType.ENUM_MAX; i++) {
                if (this.CanSynch(i)) {
                    this.synchronization = i;
                    break;
                }
            }
            if (this.synchronization == SynchronizationType.ENUM_MAX) {
                //No valid synchronizations
                this.SetWing(true);
            }
        }
        else if (this.action == ActionType.MECHANICAL && use != SynchronizationType.SPINNER) {
            this.synchronization = SynchronizationType.SYNCH;
        }
        else {
            this.synchronization = use;
        }
        if (this.wing)
            this.synchronization = SynchronizationType.NONE;
        if (this.synchronization == SynchronizationType.SPINNER) {
            this.w_count = 1;
            this.covered = true;
        }
        if (this.IsLightningArc())
            this.synchronization = SynchronizationType.NO_INTERFERENCE;
    }
    GetArty() {
        return this.weapon_type.size == 16;
    }
    CanSpinner() {
        if (this.GetArty())
            return this.can_spinner && this.can_arty_spinner;
        else
            return this.can_spinner;
    }
    GetJam() {
        if (this.weapon_type.rapid) {
            const jams = this.weapon_type.jam.split('/');
            const out = [parseInt(jams[0]), parseInt(jams[1])];
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                out[0]++;
                out[1]++;
            }
            if (this.repeating) {
                out[0]++;
                out[1]++;
            }
            return out;
        }
        else {
            var ret = parseInt(this.weapon_type.jam);
            if (this.synchronization == SynchronizationType.INTERRUPT) {
                ret += 1;
            }
            if (this.repeating) {
                ret += 1;
            }
            return ret;
        }
    }
    IsLightningArc() {
        return this.weapon_type.name == "Lightning Arc";
    }
    SetTurret(is) {
        this.turret = is;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    PartStats() {
        var stats = new Stats();
        this.ResolveSynch();
        if (!this.CanCovered() && this.covered)
            this.covered = false;
        if (this.weapon_type.size == 16)
            this.covered = this.fixed;
        var size = 0;
        for (let i = 0; i < this.w_count; i++) {
            stats = stats.Add(this.weapon_type.stats);
            size += this.weapon_type.size;
        }
        //Covered Cost
        if (this.covered) {
            var cost = 0;
            if (this.weapon_type.size <= 1) {
                cost = 0;
            }
            else if (this.weapon_type.size <= 2) {
                cost = 1;
            }
            else if (this.weapon_type.size <= 4) {
                cost = 2;
            }
            else if (this.weapon_type.size <= 8) {
                cost = 5;
            }
            else if (this.weapon_type.size <= 16) {
                cost = 0;
            }
            cost *= this.w_count;
            if (!this.fixed)
                cost *= 2;
            if (this.synchronization != SynchronizationType.SPINNER) {
                stats.cost += cost;
            }
            stats.drag *= 0;
        }
        //If on the wing and uncovered add 1, if covered, drag is min 1.
        if (this.wing && !this.covered)
            stats.drag += this.w_count;
        //Arty size weapon turrets need a section
        //Arty weapons in the fuselage need a section
        if ((this.turret && size > 8) || this.weapon_type.size == 16)
            stats.reqsections += 1;
        //Accessible Cost
        if (this.accessible) {
            stats.cost += Math.max(1, Math.floor(1.0e-6 + this.w_count / 2));
        }
        //Turret size cost
        if (!this.fixed) {
            if (size <= 2) {
                //Nothing
            }
            else if (size <= 4) {
                stats.cost += 1;
            }
            else if (size <= 8) {
                stats.mass += 1;
                stats.cost += 3;
            }
            else if (size <= 16) {
                stats.mass += 2;
                stats.cost += 5;
            }
            else {
                throw "Weapon size screwup in Turret size cost.";
            }
        }
        //Synchronization == -1 is no synch.
        if (this.synchronization == SynchronizationType.INTERRUPT) {
            stats.cost += this.w_count * 2;
            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 2;
            }
            stats.era.push({ name: Localization_lu("Interruptor Gear"), era: Localization_lu("WWI") });
        }
        else if (this.synchronization == SynchronizationType.SYNCH && this.action != ActionType.MECHANICAL) {
            stats.cost += this.w_count * 3;
            if (this.weapon_type.name == "Light Machine Cannon") {
                stats.cost += this.w_count * 3;
            }
            stats.era.push({ name: Localization_lu("Synchronization Gear"), era: Localization_lu("Roaring 20s") });
            //synchronization == 2 is spinner and costs nothing.
        }
        else if (this.synchronization == SynchronizationType.DEFLECT) {
            stats.cost += 1;
            stats.warnings.push({
                source: Localization_lu(this.weapon_type.name),
                warning: Localization_lu("Deflector Plate Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        else if (this.synchronization == SynchronizationType.NO_INTERFERENCE && !this.IsLightningArc()) {
            stats.warnings.push({
                source: Localization_lu(this.weapon_type.name) + " " + Localization_lu("No Interference"),
                warning: Localization_lu("No Interference Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        if (this.wing_reinforcement)
            stats.mass += 2;
        stats.Round();
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/WeaponSystem.ts






class WeaponSystem extends Part {
    constructor(weapon_list, wl_permute) {
        super();
        this.weapon_list = weapon_list;
        this.wl_permute = wl_permute;
        this.directions = [...Array(6).fill(false)];
        this.directions[0] = true;
        this.fixed = true;
        this.ammo = 1;
        this.weapon_type = 0;
        this.raw_weapon_type = 0;
        this.weapons = [];
        this.action_sel = ActionType.STANDARD;
        this.projectile_sel = Weapon_ProjectileType.BULLETS;
        this.has_propeller = true;
        this.sticky_guns = 0;
        this.repeating = false;
        this.seat = 0;
        this.final_weapon = {
            name: "", abrv: "", era: "", size: 0, stats: new Stats(),
            damage: 0, hits: 0, ammo: 0,
            ap: 0, jam: "", reload: 0,
            rapid: false, synched: false, shells: false,
            can_action: false, can_projectile: false, deflection: 0,
        };
        this.MakeFinalWeapon();
        this.SWC(1);
    }
    toJSON() {
        const wlist = [];
        for (const w of this.weapons) {
            wlist.push(w.toJSON());
        }
        return {
            weapon_type: this.raw_weapon_type,
            fixed: this.fixed,
            directions: this.directions,
            weapons: wlist,
            ammo: this.ammo,
            action: this.action_sel,
            projectile: this.projectile_sel,
            repeating: this.repeating,
            seat: this.seat,
        };
    }
    fromJSON(js, json_version) {
        this.raw_weapon_type = js["weapon_type"];
        this.weapon_type = this.wl_permute[this.raw_weapon_type];
        this.fixed = js["fixed"];
        this.directions = BoolArr(js["directions"], this.directions.length);
        this.weapons = [];
        this.ammo = js["ammo"];
        if (this.ammo == null)
            this.ammo = 1;
        if (json_version < 10.25) {
            this.action_sel = ActionType.STANDARD;
            this.projectile_sel = Weapon_ProjectileType.BULLETS;
        }
        else {
            this.action_sel = js["action"];
            this.projectile_sel = js["projectile"];
        }
        if (json_version < 11.75) {
            if (this.projectile_sel == Weapon_ProjectileType.PNEUMATIC) {
                this.projectile_sel = Weapon_ProjectileType.BULLETS;
            }
            else if (this.projectile_sel == Weapon_ProjectileType.ENUM_MAX) {
                this.projectile_sel = Weapon_ProjectileType.PNEUMATIC;
            }
        }
        this.MakeFinalWeapon();
        for (const elem of js["weapons"]) {
            const w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.fromJSON(elem, json_version);
            this.weapons.push(w);
        }
        //Repeating has been moved from Weapon to WeaponSystem
        if (json_version < 10.95) {
            this.repeating = false;
            for (const w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        }
        else {
            this.repeating = js["repeating"];
        }
        if (json_version > 11.65) {
            this.seat = js["seat"];
        }
        else {
            this.seat = 0;
        }
        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }
    serialize(s) {
        s.PushNum(this.raw_weapon_type);
        s.PushBool(this.fixed);
        s.PushBoolArr(this.directions);
        s.PushNum(this.ammo);
        s.PushNum(this.weapons.length);
        for (const w of this.weapons) {
            w.serialize(s);
        }
        s.PushNum(this.action_sel);
        s.PushNum(this.projectile_sel);
        s.PushBool(this.repeating);
        s.PushNum(this.seat);
    }
    deserialize(d) {
        this.raw_weapon_type = d.GetNum();
        this.weapon_type = this.wl_permute[this.raw_weapon_type];
        this.fixed = d.GetBool();
        this.directions = d.GetBoolArr(this.directions.length);
        this.ammo = d.GetNum();
        const wlen = d.GetNum();
        this.weapons = [];
        this.MakeFinalWeapon();
        for (let i = 0; i < wlen; i++) {
            const w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            w.deserialize(d);
            this.weapons.push(w);
        }
        if (d.version < 10.25) {
            this.action_sel = ActionType.STANDARD;
            this.projectile_sel = Weapon_ProjectileType.BULLETS;
        }
        else {
            this.action_sel = d.GetNum();
            this.projectile_sel = d.GetNum();
        }
        if (d.version < 11.75) {
            if (this.projectile_sel == Weapon_ProjectileType.PNEUMATIC) {
                this.projectile_sel = Weapon_ProjectileType.BULLETS;
            }
            else if (this.projectile_sel == Weapon_ProjectileType.ENUM_MAX) {
                this.projectile_sel = Weapon_ProjectileType.PNEUMATIC;
            }
        }
        //Repeating has been moved from Weapon to WeaponSystem
        if (d.version < 10.95) {
            this.repeating = false;
            for (const w of this.weapons) {
                this.repeating = this.repeating || w.GetRepeating();
            }
        }
        else {
            this.repeating = d.GetBool();
        }
        if (d.version > 11.65) {
            this.seat = d.GetNum();
        }
        else {
            this.seat = 0;
        }
        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
    }
    GetWeaponSelected() {
        return this.weapon_type;
    }
    MakeFinalWeapon() {
        const num = this.weapon_type;
        this.final_weapon.can_action = this.weapon_list[num].can_action;
        this.final_weapon.can_projectile = this.weapon_list[num].can_projectile;
        this.final_weapon.ammo = this.weapon_list[num].ammo;
        this.final_weapon.ap = this.weapon_list[num].ap;
        this.final_weapon.damage = this.weapon_list[num].damage;
        this.final_weapon.era = this.weapon_list[num].era;
        this.final_weapon.name = this.weapon_list[num].name;
        this.final_weapon.abrv = this.weapon_list[num].abrv;
        this.final_weapon.reload = this.weapon_list[num].reload;
        this.final_weapon.shells = this.weapon_list[num].shells;
        this.final_weapon.size = this.weapon_list[num].size;
        this.final_weapon.stats = this.weapon_list[num].stats.Clone();
        this.final_weapon.deflection = this.weapon_list[num].deflection;
        this.final_weapon.jam = this.weapon_list[num].jam;
        this.final_weapon.stats.era = [];
        this.final_weapon.stats.era.push({ name: this.weapon_list[num].name, era: this.weapon_list[num].era });
        if (this.weapon_list[num].hits == 0) {
            if (this.action_sel == ActionType.MECHANICAL) {
                this.action_sel = ActionType.STANDARD;
            }
            if (this.projectile_sel == Weapon_ProjectileType.GYROJETS || this.projectile_sel == Weapon_ProjectileType.HEATRAY) {
                this.projectile_sel = Weapon_ProjectileType.BULLETS;
            }
        }
        if (this.action_sel == ActionType.STANDARD) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.synched = this.weapon_list[num].synched;
        }
        else if (this.action_sel == ActionType.MECHANICAL) {
            this.final_weapon.hits = this.weapon_list[num].hits;
            this.final_weapon.stats.warnings.push({
                source: Localization_lu("Mechanical Action"),
                warning: Localization_lu("Mechanical Action Warning"),
                color: WARNING_COLOR.WHITE,
            });
            this.final_weapon.jam = "0/0";
            this.final_weapon.rapid = true;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = true;
            this.final_weapon.stats.era.push({ name: Localization_lu("Mechanical Action"), era: Localization_lu("WWI") });
        }
        else if (this.action_sel == ActionType.GAST) {
            this.final_weapon.hits = 2 * this.weapon_list[num].hits;
            this.final_weapon.ammo = this.weapon_list[num].ammo / 2;
            this.final_weapon.rapid = this.weapon_list[num].rapid;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.synched = false;
            this.final_weapon.stats.era.push({ name: Localization_lu("Gast Principle"), era: Localization_lu("WWI") });
        }
        else if (this.action_sel == ActionType.ROTARY) {
            //rotary conversion
            //3x hits, awkward + 1(don't know if that's easy to do? Otherwise I may reconsider), can only rapid fire, weapon becomes open bolt but can fire down the spinner, +1 jam, +100 % mass, +100 % cost
            this.final_weapon.stats.mass += this.weapon_list[num].stats.mass;
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.size += this.weapon_list[num].size;
            this.final_weapon.size = Math.min(16, this.final_weapon.size);
            this.final_weapon.hits = 3 * this.weapon_list[num].hits;
            this.final_weapon.deflection -= 1;
            this.final_weapon.synched = false;
            const jams = this.final_weapon.jam.split('/');
            jams[0] = "9999";
            jams[1] = (parseInt(jams[1]) + 1).toString();
            this.final_weapon.jam = jams.join('/');
            this.final_weapon.stats.era.push({ name: Localization_lu("Rotary_Gun"), era: Localization_lu("WWI") });
        }
        if (this.repeating && this.final_weapon.reload != 0) {
            this.final_weapon.reload = 0;
            this.final_weapon.stats.cost += Math.max(1, Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost));
        }
        if ((this.action_sel == ActionType.GAST || this.action_sel == ActionType.MECHANICAL)
            && this.projectile_sel == Weapon_ProjectileType.HEATRAY) {
            this.projectile_sel = Weapon_ProjectileType.BULLETS;
        }
        if ((this.action_sel == ActionType.GAST || this.action_sel == ActionType.ROTARY)
            && this.projectile_sel == Weapon_ProjectileType.PNEUMATIC) {
            this.projectile_sel = Weapon_ProjectileType.BULLETS;
        }
        if (this.projectile_sel == Weapon_ProjectileType.HEATRAY) {
            this.final_weapon.stats.cost += this.weapon_list[num].stats.cost;
            this.final_weapon.shells = false;
            this.final_weapon.ammo = 0;
            this.final_weapon.deflection = 0;
            this.final_weapon.ap = Math.max(0, this.final_weapon.ap - 1);
            this.final_weapon.stats.warnings.push({
                source: Localization_lu("Heat Ray"),
                warning: Localization_lu("Heat Ray Warning"),
                color: WARNING_COLOR.WHITE,
            });
            this.final_weapon.stats.era.push({ name: Localization_lu("Heat Ray"), era: Localization_lu("Himmilgard") });
        }
        else if (this.projectile_sel == Weapon_ProjectileType.GYROJETS) {
            this.final_weapon.stats.cost += Math.max(1, Math.floor(1.0e-6 + 0.5 * this.weapon_list[num].stats.cost));
            this.final_weapon.shells = false;
            this.final_weapon.damage -= 1;
            this.final_weapon.stats.warnings.push({
                source: Localization_lu("Gyrojets"),
                warning: Localization_lu("Gyrojets Warning"),
                color: WARNING_COLOR.WHITE,
            });
            this.final_weapon.stats.era.push({ name: Localization_lu("Gyrojets"), era: Localization_lu("Roaring 20s") });
        }
        else if (this.projectile_sel == Weapon_ProjectileType.PNEUMATIC) {
            this.final_weapon.ammo *= 2;
            this.final_weapon.shells = false;
            if (this.final_weapon.rapid) {
                const jams = this.final_weapon.jam.split('/');
                jams[1] = "9999";
                this.final_weapon.jam = jams.join('/');
                this.final_weapon.stats.warnings.push({
                    source: Localization_lu("Pneumatic"),
                    warning: Localization_lu("Pneumatic Warning 1"),
                    color: WARNING_COLOR.WHITE,
                });
                this.final_weapon.stats.era.push({ name: Localization_lu("Pneumatic"), era: Localization_lu("Pioneer") });
            }
            if (this.final_weapon.hits > 0) {
                this.final_weapon.stats.warnings.push({
                    source: Localization_lu("Pneumatic"),
                    warning: Localization_lu("Pneumatic Warning 2"),
                    color: WARNING_COLOR.WHITE,
                });
            }
        }
        if (this.final_weapon.deflection != 0) {
            this.final_weapon.stats.warnings.push({
                source: Localization_lu(this.final_weapon.name),
                warning: Localization_lu("Deflection Warning", this.final_weapon.deflection),
                color: WARNING_COLOR.WHITE,
            });
        }
    }
    SetWeaponSelected(num) {
        const wasLA = this.IsLightningArc();
        this.weapon_type = num;
        this.raw_weapon_type = this.wl_permute.findIndex((value) => { return value == num; });
        if (this.weapon_list[num].size == 16) {
            while (this.weapons.length > 1) {
                this.weapons.pop();
            }
        }
        if (!this.weapon_list[num].can_action || !this.GetCanAction()[this.action_sel]) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.weapon_list[num].can_projectile || !this.GetCanProjectile()[this.projectile_sel]) {
            this.projectile_sel = Weapon_ProjectileType.BULLETS;
        }
        if (this.weapon_list[num].rapid) {
            this.repeating = false;
        }
        else if (!this.repeating && this.action_sel == ActionType.GAST) {
            this.action_sel = ActionType.STANDARD;
        }
        if (!this.CanRepeating()) {
            this.repeating = false;
        }
        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
        //Special Case for Lightning Arc
        if (this.IsLightningArc()) {
            this.SetFixed(true);
            this.directions[0] = true;
            for (let i = 1; i < this.directions.length; i++) {
                this.directions[i] = false;
            }
        }
        if (wasLA && !this.IsLightningArc()) {
            this.weapons[0].SetSynchronization(SynchronizationType.NONE);
        }
        this.CalculateStats();
    }
    CanRepeating() {
        return (!this.weapon_list[this.weapon_type].rapid || this.weapon_list[this.weapon_type].reload > 0)
            && this.weapon_list[this.weapon_type].ammo > 0
            && this.weapon_list[this.weapon_type].name != "Precision Rifle";
    }
    GetRepeating() {
        return this.repeating;
    }
    SetRepeating(use) {
        if (use && this.CanRepeating())
            this.repeating = true;
        else {
            this.repeating = false;
            if (!this.weapon_list[this.weapon_type].rapid && this.action_sel == ActionType.GAST)
                this.action_sel = ActionType.STANDARD;
        }
        this.MakeFinalWeapon();
        for (const w of this.weapons) {
            w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
        }
        this.CalculateStats();
    }
    GetFixed() {
        return this.fixed;
    }
    SetFixed(use) {
        //Special Case for Lightning Arc
        if (this.IsLightningArc()) {
            use = true;
        }
        if (this.fixed != use) {
            this.fixed = use;
            for (const w of this.weapons) {
                w.SetFixed(this.fixed);
            }
            if (use) {
                let good = false;
                for (let i = 0; i < this.directions.length; i++) {
                    if (this.directions[i] && good)
                        this.directions[i] = false;
                    else if (this.directions[i])
                        good = true;
                }
            }
        }
        this.CalculateStats();
    }
    CanDirection() {
        if (this.IsLightningArc()) {
            return [...Array(this.directions.length).fill(false)];
        }
        const directions = [...Array(this.directions.length).fill(true)];
        if (this.weapons[0].GetArty() && this.fixed && !this.weapons[0].GetWing()) {
            const is_spinner = this.weapons[0].GetSynchronization() == SynchronizationType.SPINNER;
            if (this.tractor && !(this.spinner_t || (is_spinner && this.directions[0])))
                directions[0] = false;
            if (this.pusher && !(this.spinner_p || (is_spinner && this.directions[1])))
                directions[1] = false;
            if (this.heli)
                directions[2] = false;
        }
        return directions;
    }
    GetDirection() {
        return this.directions;
    }
    SetDirection(num, use) {
        if (this.fixed && this.directions[num] && !use)
            use = true;
        if (this.fixed) {
            this.directions = [...Array(6).fill(false)];
            if (this.weapons[0].GetArty() && !this.weapons[0].GetWing()) {
                if (num == 0 && this.tractor && !this.spinner_t)
                    num = 1;
                if (num == 1 && this.pusher && !this.spinner_p)
                    num = 3;
                if (num == 2 && this.heli)
                    num = 3;
            }
        }
        this.directions[num] = use;
        this.CalculateStats();
    }
    GetMountingCount() {
        return this.weapons.length;
    }
    GetWeaponCount() {
        let count = 0;
        for (const w of this.weapons) {
            count += w.GetCount();
        }
        return count;
    }
    SWC(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapons.length) {
            const w = new Weapon(this.final_weapon, this.action_sel, this.projectile_sel, this.fixed);
            w.SetCalculateStats(this.CalculateStats);
            this.weapons.push(w);
        }
        while (num < this.weapons.length) {
            this.weapons.pop();
        }
    }
    SetMountingCount(num) {
        if (this.final_weapon.size == 16 || this.final_weapon.name == "Precision Rifle")
            num = 1;
        this.SWC(num);
        this.CalculateStats();
    }
    GetWeapons() {
        return this.weapons;
    }
    SetCanFreelyAccessible(use) {
        for (const w of this.weapons) {
            if (!w.GetWing())
                w.can_free_accessible = use;
            else
                w.can_free_accessible = false;
        }
    }
    SetTractorPusher(hasT, can_spinnerT, can_arty_spinnerT, hasP, can_spinnerP, can_arty_spinnerP, hasR) {
        this.tractor = hasT;
        this.pusher = hasP;
        this.heli = hasR;
        this.spinner_t = can_arty_spinnerT;
        this.spinner_p = can_arty_spinnerP;
        if (this.directions[0] && hasT) {
            for (const w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerT || w.GetSynchronization() == SynchronizationType.SPINNER;
                    w.can_arty_spinner = can_arty_spinnerT || w.GetSynchronization() == SynchronizationType.SPINNER;
                }
                else if (!w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
                else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        }
        else if (this.directions[1] && hasP) {
            for (const w of this.weapons) {
                if (w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = can_spinnerP || w.GetSynchronization() == SynchronizationType.SPINNER;
                    w.can_arty_spinner = can_arty_spinnerP || w.GetSynchronization() == SynchronizationType.SPINNER;
                }
                else if (!w.GetFixed() && !w.GetWing()) {
                    w.can_synchronize = true;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
                else {
                    w.can_synchronize = false;
                    w.can_spinner = false;
                    w.can_arty_spinner = false;
                }
            }
        }
        else if (this.directions[2] && this.heli) {
            for (const w of this.weapons) {
                w.can_synchronize = true;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        }
        else {
            for (const w of this.weapons) {
                w.can_synchronize = false;
                w.can_spinner = false;
                w.can_arty_spinner = false;
            }
        }
    }
    GetHits() {
        const hits = this.final_weapon.hits;
        if (hits != 0) {
            let centerline = 0;
            let wings = 0;
            for (const w of this.weapons) {
                if (w.GetWing() && (w.GetFixed() || this.GetDirectionCount() <= 2)) {
                    wings += w.GetCount() * hits;
                }
                else {
                    centerline += w.GetCount() * hits;
                }
            }
            return [
                centerline + wings,
                Math.floor(1.0e-6 + centerline * 0.75) + Math.floor(1.0e-6 + wings * 0.9),
                Math.floor(1.0e-6 + centerline * 0.5) + Math.floor(1.0e-6 + wings * 0.2),
                Math.floor(1.0e-6 + centerline * 0.25) + Math.floor(1.0e-6 + wings * 0.1)
            ];
        }
        else {
            if (this.IsLightningArc()) {
                return [0, 0, 0, 0];
            }
            else if (this.final_weapon.ammo == 0) { //Fliergerflammenwerfer
                let count = 0;
                for (const w of this.weapons) {
                    count += w.GetCount();
                }
                return [3 * count, 0, 0, 0];
            }
            else { //Scatterguns
                let count = 0;
                for (const w of this.weapons) {
                    count += w.GetCount();
                }
                if (this.action_sel == ActionType.GAST) {
                    count *= 2;
                }
                return [3 * count, 2 * count, 1 * count, 0];
            }
        }
    }
    GetDamage() {
        return this.final_weapon.damage;
    }
    GetAmmo() {
        return this.ammo;
    }
    GetJam() {
        if (this.final_weapon.rapid) {
            let jams = [0, 0];
            for (const w of this.weapons) {
                const t = w.GetJam();
                jams[0] = Math.max(jams[0], t[0] + this.sticky_guns);
                jams[1] = Math.max(jams[1], t[1] + this.sticky_guns);
            }
            return jams[0].toString() + "/" + jams[1].toString();
        }
        else {
            let jam = 0;
            for (const w of this.weapons) {
                jam = Math.max(jam, w.GetJam() + this.sticky_guns);
            }
            return jam.toString();
        }
    }
    IsPlural() {
        return this.weapons.length > 1 || this.weapons[0].GetCount() > 1;
    }
    SetAmmo(num) {
        if (num != num || num < 1)
            num = 1;
        num = Math.floor(1.0e-6 + num);
        this.ammo = num;
        this.CalculateStats();
    }
    SetHavePropeller(have) {
        if (this.has_propeller && !have && this.action_sel == ActionType.MECHANICAL) {
            this.has_propeller = have;
            this.SetAction(ActionType.STANDARD);
        }
        this.has_propeller = have;
    }
    SetCanWing(can) {
        for (const w of this.weapons) {
            w.SetCanWing(can);
        }
    }
    GetAction() {
        return this.action_sel;
    }
    GetCanAction() {
        return [true,
            this.has_propeller && this.weapon_list[this.weapon_type].can_action && this.weapon_list[this.weapon_type].hits > 0 && (this.repeating || this.weapon_list[this.weapon_type].rapid),
            this.weapon_list[this.weapon_type].can_action && (this.repeating || this.weapon_list[this.weapon_type].rapid),
            this.weapon_list[this.weapon_type].can_action && this.weapon_list[this.weapon_type].rapid,
        ];
    }
    SetAction(num) {
        if (this.final_weapon.can_action) {
            this.action_sel = num;
            this.MakeFinalWeapon();
            for (const w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }
        }
        else {
            this.action_sel = ActionType.STANDARD;
        }
        this.CalculateStats();
    }
    GetCanProjectile() {
        return [true,
            this.final_weapon.can_projectile && this.action_sel != ActionType.MECHANICAL && this.action_sel != ActionType.GAST && this.weapon_list[this.weapon_type].hits > 0,
            // this.final_weapon.can_projectile && this.weapon_list[this.weapon_type].hits > 0,
            this.final_weapon.can_projectile && this.action_sel != ActionType.ROTARY && this.action_sel != ActionType.GAST];
    }
    GetProjectile() {
        return this.projectile_sel;
    }
    SetProjectile(num) {
        if (this.final_weapon.can_projectile) {
            this.projectile_sel = num;
            this.MakeFinalWeapon();
            for (const w of this.weapons) {
                w.SetWeaponType(this.final_weapon, this.action_sel, this.projectile_sel);
            }
        }
        else {
            this.projectile_sel = Weapon_ProjectileType.BULLETS;
        }
        this.CalculateStats();
    }
    GetFinalWeapon() {
        return this.final_weapon;
    }
    SetStickyGuns(num) {
        this.sticky_guns = num;
    }
    GetHRCharges() {
        if (this.IsLightningArc()) { //Special Case for Lightning Gun
            return [3];
        }
        let count = 0;
        for (const w of this.weapons) {
            count += w.GetCount();
        }
        if (this.final_weapon.hits > 0) {
            //Calc charges / shot.
            let ammo = this.weapon_list[this.weapon_type].stats.cost;
            if (this.action_sel == ActionType.ROTARY)
                ammo *= 2;
            if (this.final_weapon.rapid)
                return [count * ammo, Math.max(count * ammo + 1, Math.floor(1.0e-6 + 1.5 * count * ammo))];
            else
                return [count * ammo];
        }
        else {
            if (this.final_weapon.name == "Scattergun") {
                //4 shot dice, d5, half damage
                if (!this.final_weapon.rapid)
                    return [Math.floor(1.0e-6 + 3 * 5 * 0.5 / 4)];
                else
                    return [Math.floor(1.0e-6 + 3 * 5 * 0.5 / 4), Math.floor(1.0e-6 + 5 * 5 * 0.5 / 4)];
            }
            else if (this.final_weapon.name == "Punt Gun") {
                //4 shot dice, d10, half damage
                if (!this.final_weapon.rapid)
                    return [Math.floor(1.0e-6 + 3 * 10 * 0.5 / 4)];
                else
                    return [Math.floor(1.0e-6 + 3 * 10 * 0.5 / 4), Math.floor(1.0e-6 + 5 * 10 * 0.5 / 4)];
            }
        }
    }
    GetShots() {
        return Math.max(1, Math.floor(1.0e-6 + this.final_weapon.ammo * this.ammo));
    }
    IsLightningArc() {
        return this.final_weapon.name == "Lightning Arc";
    }
    GetReload() {
        return this.final_weapon.reload;
    }
    GetWingWeight() {
        let sum = 0;
        for (const w of this.weapons) {
            if (w.GetWing()) {
                sum += w.PartStats().mass;
            }
        }
        return sum;
    }
    GetDirectionCount() {
        let count = 0;
        for (const d of this.directions) {
            if (d)
                count++;
        }
        return count;
    }
    SetSeat(num) {
        this.seat = num;
        this.CalculateStats();
    }
    GetSeat() {
        return this.seat;
    }
    GetIsFullyAccessible() {
        for (const w of this.weapons) {
            if (!w.GetAccessible())
                return false;
        }
        return true;
    }
    GetIsPartlyAccessible() {
        for (const w of this.weapons) {
            if (w.GetAccessible())
                return true;
        }
        return false;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
        for (const w of this.weapons) {
            w.SetCalculateStats(callback);
        }
    }
    PartStats() {
        var stats = new Stats();
        let dircount = 0;
        for (const d of this.directions)
            if (d)
                dircount++;
        let count = 0;
        for (const w of this.weapons) {
            w.has_cantilever = this.has_cantilever;
            w.SetTurret(this.GetDirectionCount() > 2);
            stats = stats.Add(w.PartStats());
            count += w.GetCount();
            if (!this.fixed) {
                //Turret direction costs
                if (dircount == 2)
                    stats.cost += 1;
                else if (dircount == 3 || dircount == 4)
                    stats.cost += 2;
                else if (dircount == 5)
                    stats.cost += 3;
                else if (dircount == 6)
                    stats.cost += 4;
                //Turret Size costs handled in Weapon.ts
            }
        }
        if (this.projectile_sel == Weapon_ProjectileType.HEATRAY || this.IsLightningArc()) {
            //Cant have extra ammo for heatray.
            this.ammo = 1;
        }
        //Ammunition Cost
        stats.mass += (this.ammo - 1) * count;
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/weapons.json
const weapons_namespaceObject = JSON.parse('{"A":[{"name":"Submachine Gun","abrv":"SMG","era":"WWI","cost":1,"mass":1,"drag":0,"damage":1,"hits":4,"ap":0,"ammo":10,"rapid":true,"manual":false,"synched":false,"shells":false,"jam":"0/1","reload":2,"size":1,"can_action":true,"can_projectile":true,"deflection":0,"warning":"SMG Warning"},{"name":"Scattergun","abrv":"SG","era":"Pioneer","cost":2,"mass":2,"drag":2,"damage":0.5,"hits":0,"ap":0,"ammo":8,"rapid":false,"manual":true,"synched":false,"shells":false,"jam":"0","reload":1,"warning":"Scattergun Warning","size":2,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Light Machine Gun","abrv":"LMG","era":"WWI","cost":2,"mass":2,"drag":1,"damage":2,"hits":4,"ap":1,"ammo":8,"rapid":true,"manual":false,"synched":false,"shells":false,"jam":"1/2","reload":2,"size":2,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Machine Gun","abrv":"MG","era":"WWI","cost":2,"mass":3,"drag":1,"damage":2,"hits":4,"ap":1,"ammo":10,"rapid":true,"manual":false,"synched":true,"shells":false,"jam":"1/2","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Balloon Gun","abrv":"BMG","era":"WWI","cost":3,"mass":3,"drag":1,"damage":2,"hits":4,"ap":0,"ammo":6,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"2/3","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":-2},{"name":"Enhanced Machine Gun","abrv":"EMG","era":"Coming Storm","cost":3,"mass":2,"drag":1,"damage":2,"hits":5,"ap":1,"ammo":8,"rapid":true,"manual":false,"synched":true,"shells":false,"jam":"0/0","reload":0,"size":2,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Enhanced Heavy Machine Gun","abrv":"EHMG","era":"Coming Storm","cost":5,"mass":3,"drag":2,"damage":4,"hits":5,"ap":2,"ammo":6,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"0/0","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Punt Gun","abrv":"PG","era":"Pioneer","cost":4,"mass":4,"drag":3,"damage":0.5,"hits":0,"ap":0,"ammo":5,"rapid":false,"manual":true,"synched":false,"shells":false,"jam":"0","reload":1,"warning":"Punt Gun Warning","size":8,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Light Repeating Cannon","abrv":"LRC","era":"WWI","cost":4,"mass":4,"drag":3,"damage":8,"hits":3,"ap":2,"ammo":6,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"2/5","reload":2,"size":8,"can_action":true,"can_projectile":true,"deflection":-3},{"name":"Heavy Cannon","abrv":"HC","era":"WWI","cost":6,"mass":5,"drag":2,"damage":16,"hits":1,"ap":2,"ammo":5,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":8,"can_action":true,"can_projectile":true,"deflection":-3},{"name":"Light Machine Cannon","abrv":"LMC","era":"Coming Storm","cost":8,"mass":4,"drag":3,"damage":8,"hits":4,"ap":4,"ammo":6,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"0/0","reload":0,"size":8,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Heavy Machine Cannon","abrv":"HMC","era":"WWII","cost":12,"mass":5,"drag":4,"damage":12,"hits":3,"ap":4,"ammo":5,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"0/0","reload":0,"size":8,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Fliergerflammenwerfer","abrv":"FFW","era":"WWI","cost":5,"mass":1,"drag":3,"damage":0.5,"hits":0,"ap":0,"ammo":0,"rapid":false,"manual":false,"synched":false,"shells":false,"jam":"0/0","reload":0,"warning":"Fliergerflammenwerfer Warning","size":8,"can_action":false,"can_projectile":false,"deflection":0},{"name":"Recoilless Cannon","abrv":"RC","era":"WWI","cost":5,"mass":8,"drag":3,"damage":30,"hits":1,"ap":3,"ammo":3,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":16,"can_action":true,"can_projectile":true,"deflection":-5},{"name":"Autocannon","abrv":"AC","era":"WWII","cost":15,"mass":8,"drag":5,"damage":24,"hits":2,"ap":5,"ammo":2,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"0/0","reload":0,"size":16,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Battle Cannon","abrv":"BC","era":"WWII","cost":15,"mass":40,"drag":8,"damage":24,"hits":2,"ap":5,"ammo":1,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":16,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Precision Rifle","abrv":"PR","era":"WWI","mass":1,"drag":1,"cost":2,"damage":5,"hits":10,"ap":2,"ammo":8,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":2,"can_action":false,"can_projectile":false,"warning":"Precision Rifle Warning","deflection":0},{"name":"Lightning Arc","abrv":"LA","era":"Himmilgard","cost":8,"mass":5,"drag":3,"damage":0,"hits":0,"ap":0,"ammo":0,"rapid":false,"manual":false,"synched":false,"shells":false,"jam":"0","reload":0,"size":16,"can_action":false,"can_projectile":false,"warning":"Lightning Arc Warning","deflection":0},{"name":"Harpoon Launcher","abrv":"HL","era":"Himmilgard","cost":3,"mass":3,"drag":2,"damage":4,"hits":1,"ap":1,"ammo":2,"rapid":false,"manual":false,"synched":false,"shells":false,"jam":0,"reload":1,"size":4,"can_action":false,"can_projectile":false,"warning":"Harpoon Launcher Warning","deflection":0},{"name":"Heavy Machine Gun","abrv":"HMG","era":"WWI","cost":4,"mass":4,"drag":2,"damage":4,"hits":4,"ap":2,"ammo":5,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"2/3","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Heavy Repeating Cannon","abrv":"HRC","era":"WWI","cost":10,"mass":6,"drag":4,"damage":16,"hits":2,"ap":2,"ammo":5,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"4/6","reload":2,"size":16,"can_action":true,"can_projectile":true,"deflection":-3}]}');
;// CONCATENATED MODULE: ./src/impl/Weapons.ts








class Weapons extends Part {
    constructor() {
        super();
        this.direction_list = ["Forward", "Rearward", "Up", "Down", "Left", "Right"];
        this.synchronization_list = ["None", "Interruptor Gear", "Synchronization Gear", "Spinner Gun", "Deflector Plate", "No Interference"];
        this.action_list = [
            { name: "Standard Action" },
            { name: "Mechanical Action" },
            { name: "Gast Principle" },
            { name: "Rotary_Gun" },
        ];
        this.projectile_list = [
            { name: "Standard" },
            { name: "Heat Ray" },
            // { name: "Gyrojets" },
            { name: "Pneumatic" },
        ];
        this.weapon_list = [];
        for (const elem of weapons_namespaceObject.A) {
            const weap = {
                name: elem["name"],
                abrv: elem["abrv"],
                era: elem["era"],
                size: elem["size"],
                stats: new Stats(elem),
                damage: elem["damage"],
                hits: elem["hits"],
                ammo: elem["ammo"],
                ap: elem["ap"],
                jam: elem["jam"].toString(),
                reload: elem["reload"],
                rapid: elem["rapid"],
                synched: elem["synched"],
                shells: elem["shells"],
                can_action: elem["can_action"],
                can_projectile: elem["can_projectile"],
                deflection: elem["deflection"],
            };
            this.weapon_list.push(weap);
        }
        const pred = (a, b) => {
            const cvt2num = (l, r) => {
                if (l < r)
                    return -1;
                if (r < l)
                    return 1;
                return 0;
            };
            if (a.size != b.size)
                return cvt2num(a.size, b.size);
            else if (a.era != b.era)
                return cvt2num(era2numHh(a.era), era2numHh(b.era));
            else if (a.damage != b.damage)
                return cvt2num(a.damage, b.damage);
            else
                return cvt2num(a.name, b.name);
        };
        this.wl_permute = Array.from(Array(this.weapon_list.length).keys())
            .sort((a, b) => { return pred(this.weapon_list[a], this.weapon_list[b]); });
        const p2 = [];
        for (let i = 0; i < this.wl_permute.length; i++) {
            p2.push(this.wl_permute.findIndex((value) => { return value == i; }));
        }
        this.wl_permute = p2;
        this.weapon_list = this.weapon_list.sort(pred);
        this.weapon_sets = [];
        this.brace_count = 0;
        this.isheli = false;
    }
    toJSON() {
        const lst = [];
        for (const ws of this.weapon_sets) {
            lst.push(ws.toJSON());
        }
        return {
            weapon_systems: lst,
            brace_count: this.brace_count,
        };
    }
    fromJSON(js, json_version) {
        this.weapon_sets = [];
        const lst = js["weapon_systems"];
        for (const wsj of lst) {
            const ws = new WeaponSystem(this.weapon_list, this.wl_permute);
            ws.SetCalculateStats(this.CalculateStats);
            ws.fromJSON(wsj, json_version);
            this.weapon_sets.push(ws);
        }
        if (json_version > 10.35) {
            this.brace_count = js["brace_count"];
        }
    }
    serialize(s) {
        s.PushNum(this.weapon_sets.length);
        for (const ws of this.weapon_sets) {
            ws.serialize(s);
        }
        s.PushNum(this.brace_count);
    }
    deserialize(d) {
        this.weapon_sets = [];
        const wlen = d.GetNum();
        for (let i = 0; i < wlen; i++) {
            const ws = new WeaponSystem(this.weapon_list, this.wl_permute);
            ws.SetCalculateStats(this.CalculateStats);
            ws.deserialize(d);
            this.weapon_sets.push(ws);
        }
        if (d.version > 10.35)
            this.brace_count = d.GetNum();
    }
    GetWeaponList() {
        return this.weapon_list;
    }
    GetDirectionList() {
        return this.direction_list;
    }
    GetSynchronizationList() {
        return this.synchronization_list;
    }
    SetWeaponSetCount(num) {
        if (num != num || num < 1)
            num = 0;
        num = Math.floor(1.0e-6 + num);
        while (num > this.weapon_sets.length) {
            const w = new WeaponSystem(this.weapon_list, this.wl_permute);
            w.SetCalculateStats(this.CalculateStats);
            this.weapon_sets.push(w);
        }
        while (num < this.weapon_sets.length) {
            this.weapon_sets.pop();
        }
        this.CalculateStats();
    }
    GetWeaponSets() {
        return this.weapon_sets;
    }
    CountTractorSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountArtyTractorSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[0]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountPusherSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CountArtyPusherSpinner() {
        var count = 0;
        for (const ws of this.weapon_sets) {
            if (ws.GetDirection()[1]) {
                const wlist = ws.GetWeapons();
                for (const w of wlist) {
                    if (w.GetArty() && w.GetSynchronization() == SynchronizationType.SPINNER)
                        count++;
                }
            }
        }
        return count;
    }
    CleanFreelyAccessible() {
        var has_fa = Array(this.cockpit_count).fill(false);
        for (const ws of this.weapon_sets) {
            const seat = ws.GetSeat();
            for (const w of ws.GetWeapons()) {
                if (w.GetFreeAccessible() && has_fa[seat]) {
                    w.SetFreeAccessible(false);
                }
                else if (w.GetFreeAccessible()) {
                    has_fa[seat] = true;
                }
            }
        }
        for (const ws of this.weapon_sets) {
            const seat = ws.GetSeat();
            for (const w of ws.GetWeapons()) {
                if ((has_fa[seat] && !w.GetFreeAccessible()) || w.GetWing()) {
                    w.can_free_accessible = false;
                }
                else {
                    w.can_free_accessible = true;
                }
            }
        }
    }
    RemoveOneTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }
    RemoveOneArtyTractorSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[0]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }
    RemoveOnePusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER) {
                        wlist[j].SetSynchronization(SynchronizationType.INTERRUPT);
                        return;
                    }
                }
            }
        }
    }
    RemoveOneArtyPusherSpinner() {
        for (let i = this.weapon_sets.length - 1; i >= 0; i--) {
            if (this.weapon_sets[i].GetDirection()[1]) {
                const wlist = this.weapon_sets[i].GetWeapons();
                for (let j = wlist.length - 1; j >= 0; j--) {
                    if (wlist[j].GetSynchronization() == SynchronizationType.SPINNER && wlist[j].GetArty()) {
                        this.weapon_sets[i].SetDirection(3, true);
                        return;
                    }
                }
            }
        }
    }
    CanTractorSpinner() {
        return this.CountTractorSpinner() + this.CountArtyTractorSpinner() < this.tractor_spinner_count;
    }
    CanArtyTractorSpinner() {
        return this.CountArtyTractorSpinner() < this.tractor_arty_spinner_count;
    }
    CanPusherSpinner() {
        return this.CountPusherSpinner() + this.CountArtyTractorSpinner() < this.pusher_spinner_count;
    }
    CanArtyPusherSpinner() {
        return this.CountArtyPusherSpinner() < this.pusher_arty_spinner_count;
    }
    SetTractorInfo(info) {
        this.has_tractor = info.have;
        this.tractor_spinner_count = info.spin_count;
        this.tractor_arty_spinner_count = info.arty_spin_count;
    }
    SetPusherInfo(info) {
        this.has_pusher = info.have;
        this.pusher_spinner_count = info.spin_count;
        this.pusher_arty_spinner_count = info.arty_spin_count;
    }
    GetActionList() {
        return this.action_list;
    }
    GetProjectileList() {
        return this.projectile_list;
    }
    GetBraceCount() {
        return this.brace_count;
    }
    SetBraceCount(num) {
        if (num < 0 || num != num)
            num = 0;
        num -= num % 3;
        this.brace_count = num;
        this.CalculateStats();
    }
    SetHavePropeller(have) {
        for (const ws of this.weapon_sets) {
            ws.SetHavePropeller(have);
        }
    }
    SetCanWing(can) {
        for (const ws of this.weapon_sets) {
            ws.SetCanWing(can);
        }
    }
    SetStickyGuns(num) {
        for (const ws of this.weapon_sets) {
            ws.SetStickyGuns(num);
        }
    }
    GetWingWeight() {
        var sum = 0;
        for (const w of this.weapon_sets) {
            sum += w.GetWingWeight();
        }
        return sum;
    }
    GetSeatList() {
        const lst = [];
        for (let i = 0; i < this.cockpit_count; i++) {
            lst.push(Localization_lu("Seat #", i + 1));
        }
        return lst;
    }
    GetArmedSeats() {
        const lst = Array(this.cockpit_count).fill(false);
        for (const ws of this.weapon_sets) {
            lst[ws.GetSeat()] = true;
        }
        return lst;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
        for (const set of this.weapon_sets)
            set.SetCalculateStats(callback);
    }
    SetNumberOfCockpits(num) {
        this.cockpit_count = num;
    }
    SetHeli(value) {
        this.isheli = value;
    }
    PartStats() {
        var stats = new Stats();
        //Update Freely Accessible state.
        // while (this.CountFreelyAccessible() > this.cockpit_count) {
        //     this.RemoveOneFreelyAccessible();
        // }
        this.CleanFreelyAccessible();
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
        var wing_size = 0;
        var max_wing_size = 0;
        if (this.cant_type == 0) {
            wing_size = 4;
            max_wing_size = 2;
        }
        else if (this.cant_type == 1) {
            wing_size = 8;
            max_wing_size = 4;
        }
        else {
            wing_size = 16;
            max_wing_size = 8;
        }
        //Create list of every weapon size and a ref to the weapon
        const slist = [];
        for (const ws of this.weapon_sets) {
            for (const w of ws.GetWeapons()) {
                w.wing_reinforcement = false;
                const s = { total: 0, count: 0, sz: 0, w: w };
                if (w.GetWing()) {
                    s.count = w.GetCount();
                    s.sz = this.weapon_list[ws.GetWeaponSelected()].size;
                    s.total = (s.count * s.sz);
                    slist.push(s);
                }
            }
        }
        //Sort by size to we reinforce as few weapons as possible
        slist.sort(function (a, b) { return a.total - b.total; });
        for (const s of slist) {
            if (wing_size >= 0) {
                if (max_wing_size < s.sz) {
                    s.w.wing_reinforcement = true;
                }
                else {
                    wing_size -= s.total;
                }
            }
            if (wing_size < 0) {
                s.w.wing_reinforcement = true;
            }
        }
        for (const ws of this.weapon_sets) {
            ws.SetTractorPusher(this.has_tractor, this.CanTractorSpinner(), this.CanArtyTractorSpinner(), this.has_pusher, this.CanPusherSpinner(), this.CanArtyPusherSpinner(), this.isheli);
            ws.has_cantilever = this.cant_type > 0;
            stats = stats.Add(ws.PartStats());
        }
        //Weapon braces cost 1/3.  Should always be multiple of 3
        stats.cost += this.brace_count / 3;
        if (this.brace_count > 0) {
            stats.warnings.push({
                source: Localization_lu("Weapons Braces"),
                warning: Localization_lu("Weapons Braces Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        //Wing-tip weight: -1 control for every 5 mass
        stats.control -= Math.floor(1.0e-6 + this.GetWingWeight() / 5);
        return stats;
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        for (let i = 0; i < this.weapon_sets.length; i++) {
            const set = this.weapon_sets[i];
            if (set.GetProjectile() == Weapon_ProjectileType.HEATRAY || set.IsLightningArc()) {
                const charges = set.GetHRCharges();
                //Negate the values for display
                for (let c = 0; c < charges.length; c++)
                    charges[c] *= -1;
                value.equipment.push({
                    source: Localization_lu("Vital Part Weapon Set", i + 1, set.GetFinalWeapon().abrv),
                    charge: string_StringFmt.Join('/', charges),
                });
            }
        }
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Used.ts


class Used extends Part {
    constructor() {
        super();
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
    }
    GetEnabled() {
        const total = Math.abs(this.burnt_out) +
            Math.abs(this.ragged) +
            Math.abs(this.hefty) +
            Math.abs(this.sticky_guns) +
            Math.abs(this.weak) +
            Math.abs(this.fragile) +
            Math.abs(this.leaky) +
            Math.abs(this.sluggish);
        return total != 0;
    }
    SetEnabled(use) {
        this.burnt_out = 0;
        this.ragged = 0;
        this.hefty = 0;
        this.sticky_guns = 0;
        this.weak = 0;
        this.fragile = 0;
        this.leaky = 0;
        this.sluggish = 0;
        this.CalculateStats();
    }
    toJSON() {
        return {
            enabled: true,
            burnt_out: this.burnt_out,
            ragged: this.ragged,
            hefty: this.hefty,
            sticky_guns: this.sticky_guns,
            weak: this.weak,
            fragile: this.fragile,
            leaky: this.leaky,
            sluggish: this.sluggish,
        };
    }
    fromJSON(js, json_version) {
        this.burnt_out = js["burnt_out"];
        this.ragged = js["ragged"];
        this.hefty = js["hefty"];
        this.sticky_guns = js["sticky_guns"];
        this.weak = js["weak"];
        this.fragile = js["fragile"];
        this.leaky = js["leaky"];
        this.sluggish = js["sluggish"];
    }
    serialize(s) {
        s.PushBool(true);
        s.PushNum(this.burnt_out);
        s.PushNum(this.ragged);
        s.PushNum(this.hefty);
        s.PushNum(this.sticky_guns);
        s.PushNum(this.weak);
        s.PushNum(this.fragile);
        s.PushNum(this.leaky);
        s.PushNum(this.sluggish);
    }
    deserialize(d) {
        d.GetBool();
        this.burnt_out = d.GetNum();
        this.ragged = d.GetNum();
        this.hefty = d.GetNum();
        this.sticky_guns = d.GetNum();
        this.weak = d.GetNum();
        this.fragile = d.GetNum();
        this.leaky = d.GetNum();
        this.sluggish = d.GetNum();
    }
    Normalize(num) {
        if (num != num) {
            num = 0;
        }
        num = Math.floor(1.0e-6 + num);
        num = Math.min(1, num);
        num = Math.max(-1, num);
        return num;
    }
    PartStats() {
        this.burnt_out = this.Normalize(this.burnt_out);
        this.ragged = this.Normalize(this.ragged);
        this.hefty = this.Normalize(this.hefty);
        this.sticky_guns = this.Normalize(this.sticky_guns);
        this.weak = this.Normalize(this.weak);
        this.fragile = this.Normalize(this.fragile);
        this.leaky = this.Normalize(this.leaky);
        this.sluggish = this.Normalize(this.sluggish);
        return new Stats();
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    TriggerCS() {
        this.burnt_out = this.Normalize(this.burnt_out);
        this.ragged = this.Normalize(this.ragged);
        this.hefty = this.Normalize(this.hefty);
        this.sticky_guns = this.Normalize(this.sticky_guns);
        this.weak = this.Normalize(this.weak);
        this.fragile = this.Normalize(this.fragile);
        this.leaky = this.Normalize(this.leaky);
        this.sluggish = this.Normalize(this.sluggish);
        this.CalculateStats();
    }
    GetElectrics() {
        const value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/impl/Rotor.ts



var ROTOR_BLADE_COUNT;
(function (ROTOR_BLADE_COUNT) {
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Two"] = 2] = "Two";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Three"] = 3] = "Three";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Four"] = 4] = "Four";
    ROTOR_BLADE_COUNT[ROTOR_BLADE_COUNT["Five"] = 5] = "Five";
})(ROTOR_BLADE_COUNT || (ROTOR_BLADE_COUNT = {}));
class Rotor extends Part {
    constructor(js) {
        super();
        this.type = AIRCRAFT_TYPE.AIRPLANE;
        this.rotor_count = 0;
        this.rotor_span = 0;
        this.wing_area = 0;
        this.stagger_sel = 0;
        this.dryMP = 0;
        this.sizing_span = 0;
        this.cant_idx = 0;
        this.accessory = false;
        this.blade_idx = 0;
        this.blade_list = [];
        for (const elem of js["blade_count"]) {
            this.blade_list.push({ name: elem["name"], rotor_bleed: elem["rotor_bleed"], sizing: elem["sizing"], stats: new Stats(elem) });
        }
        this.stagger_list = [];
        for (const elem of js["arrangement"]) {
            this.stagger_list.push({ name: elem["name"], count: elem["count"], powerfactor: elem["powerfactor"], blades: elem["blades"], stats: new Stats(elem) });
        }
    }
    toJSON() {
        return {
            type: this.type,
            rotor_count: this.rotor_count,
            rotor_span: this.rotor_span,
            rotor_mat: this.cant_idx,
            stagger_sel: this.stagger_sel,
            accessory: this.accessory,
            blade_idx: this.blade_idx,
        };
    }
    fromJSON(js, json_version) {
        this.type = js["type"];
        this.rotor_count = js["rotor_count"];
        this.rotor_span = js["rotor_span"];
        this.cant_idx = js["rotor_mat"];
        if (json_version < 12.35) {
            this.stagger_sel = 0;
        }
        else {
            this.stagger_sel = js["stagger_sel"];
        }
        this.accessory = js["accessory"];
        if (json_version > 11.55) {
            this.blade_idx = js["blade_idx"];
        }
        if (json_version < 12.45) {
            this.rotor_span = 0;
        }
    }
    serialize(s) {
        s.PushNum(this.type);
        s.PushNum(this.rotor_count);
        s.PushNum(this.rotor_span);
        s.PushNum(this.cant_idx);
        s.PushNum(this.stagger_sel);
        s.PushBool(this.accessory);
        s.PushNum(this.blade_idx);
    }
    deserialise(d) {
        this.type = d.GetNum();
        this.rotor_count = d.GetNum();
        this.rotor_span = d.GetNum();
        this.cant_idx = d.GetNum();
        if (d.version < 12.35) {
            d.GetBool();
            this.stagger_sel = 0;
        }
        else {
            this.stagger_sel = d.GetNum();
        }
        this.accessory = d.GetBool();
        if (d.version > 11.55) {
            this.blade_idx = d.GetNum();
        }
        if (d.version < 12.45) {
            this.rotor_span = 0;
        }
    }
    SetCantileverList(cant_list) {
        this.cant_list = cant_list;
    }
    GetCantileverList() {
        return this.cant_list;
    }
    SetCantilever(num) {
        this.cant_idx = num;
        this.CalculateStats();
    }
    GetCantilever() {
        return this.cant_idx;
    }
    SetType(new_type) {
        if (this.type != new_type) {
            this.accessory = false;
            this.cant_idx = 0;
            this.stagger_sel = 0;
            this.rotor_count = 1;
            this.type = new_type;
            this.rotor_span = 0;
        }
    }
    CanRotorCount() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }
    SetRotorCount(num) {
        if (num < 1)
            num = 1;
        if (num >= 2) {
            if (num % 2 == 1) {
                if (num == this.rotor_count + 1) {
                    num = num + 1;
                }
                else {
                    num = num - 1;
                }
            }
        }
        this.rotor_count = num;
        if (this.rotor_count < 2)
            this.stagger_sel = 0;
        this.CalculateStats();
    }
    GetRotorCount() {
        return this.rotor_count;
    }
    CanRotorSpan() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER;
    }
    SetRotorSpan(num) {
        this.rotor_span = Math.floor(1.0e-6 + num);
        this.CalculateStats();
    }
    GetRotorSpan() {
        return this.rotor_span;
    }
    CanTandem() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count > 1;
    }
    SetBladeCount(idx) {
        this.blade_idx = idx;
        this.CalculateStats();
    }
    SetWingArea(num) {
        this.wing_area = num;
    }
    GetSizingSpan() {
        return this.sizing_span;
    }
    SetMP(mp) {
        if (mp != this.dryMP) {
            this.dryMP = mp;
            this.CalculateStats();
        }
    }
    GetRotorStrain() {
        const area = this.GetRotorArea();
        return this.rotor_count * Math.max(1, 2 * (this.sizing_span + this.rotor_span) + area - 10);
    }
    GetRotorArea() {
        return (Math.PI / 9) * (this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span);
    }
    GetIdealRotorArea() {
        return (Math.PI / 9) * (this.sizing_span) * (this.sizing_span);
    }
    GetRotorDrag() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER || this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            const area = this.GetRotorArea();
            if (this.rotor_count == 1) {
                return Math.floor(1.0e-6 + 6 * area * area / ((this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span)));
            }
            else {
                return Math.floor(1.0e-6 + 0.75 * this.rotor_count * Math.floor(1.0e-6 + 6 * area * area / ((this.sizing_span + this.rotor_span) * (this.sizing_span + this.rotor_span))));
            }
        }
        return 0;
    }
    GetType() {
        return this.type;
    }
    GetAccessory() {
        return this.accessory;
    }
    SetAccessory(use) {
        this.accessory = use;
        this.CalculateStats();
    }
    SetEngineCount(num) {
        this.engine_count = num;
    }
    GetTailRotor() {
        return this.type == AIRCRAFT_TYPE.HELICOPTER && this.rotor_count < 2;
    }
    GetBladeList() {
        return this.blade_list;
    }
    GetRotorBleed() {
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            return this.blade_list[this.blade_idx].rotor_bleed;
        }
        return 0;
    }
    GetPowerFactor() {
        return this.stagger_list[this.stagger_sel].powerfactor;
    }
    GetBladeCountIdx() {
        return this.blade_idx;
    }
    GetStaggerList() {
        return this.stagger_list;
    }
    GetStagger() {
        return this.stagger_sel;
    }
    SetStagger(num) {
        if (num != this.stagger_sel) {
            this.stagger_sel = num;
            this.CalculateStats();
        }
    }
    CanStagger() {
        const can = [];
        for (let i = 0; i < this.stagger_list.length; i++) {
            if (this.rotor_count == 1 && this.stagger_list[i].count == 1) {
                can.push(true);
            }
            else if (this.rotor_count == 2 && this.stagger_list[i].count == 2) {
                can.push(true);
            }
            else if (this.rotor_count >= 2 && this.stagger_list[i].count == 3) {
                can.push(true);
            }
            else {
                can.push(false);
            }
        }
        return can;
    }
    VerifySizes() {
        if (this.type == AIRCRAFT_TYPE.AIRPLANE) {
            this.rotor_count = 0;
            this.rotor_span = 0;
            this.stagger_sel = 0;
        }
        else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor_count = 1;
            this.sizing_span = Math.ceil(-1.0e-6 + Math.sqrt((0.6 * this.wing_area) / (Math.PI / 8)));
            this.rotor_span = Math.max(this.rotor_span, 2 - this.sizing_span);
            this.stagger_sel = 0;
        }
        else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            this.rotor_count = Math.max(1, this.rotor_count);
            if (this.rotor_count > 1 && this.rotor_count % 2 == 1)
                this.rotor_count = this.rotor_count - 1;
            if (this.rotor_count == 1) {
                this.sizing_span = Math.ceil(-1.0e-6 + Math.pow(this.dryMP, 1 / 2.5) * 5 * this.blade_list[this.blade_idx].sizing);
            }
            else {
                this.sizing_span = Math.ceil(-1.0e-6 + Math.pow(this.dryMP, 1 / 2.5) * 4 * this.blade_list[this.blade_idx].sizing);
            }
            this.sizing_span = Math.min(100, this.sizing_span);
            this.rotor_span = Math.max(this.rotor_span, -Math.floor(1.0e-6 + this.sizing_span / 2));
        }
    }
    VerifyStagger() {
        if (this.rotor_count > 2 && this.stagger_list[this.stagger_sel].count <= 2) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 3) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
        else if (this.rotor_count == 2 && this.stagger_list[this.stagger_sel].count != 2) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 2) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
        else if (this.rotor_count == 1 && this.stagger_list[this.stagger_sel].count != 1) {
            for (let i = 0; i < this.stagger_list.length; i++) {
                if (this.stagger_list[i].count == 1) {
                    this.stagger_sel = i;
                    break;
                }
            }
        }
    }
    PartStats() {
        this.VerifySizes();
        this.VerifyStagger();
        var stats = new Stats();
        const area = this.GetRotorArea();
        stats.wingarea += Math.floor(1.0e-6 + area);
        stats.drag = this.GetRotorDrag();
        const strain = this.GetRotorStrain();
        var ts = this.cant_list[this.cant_idx].stats.Clone();
        const count = Math.ceil(-1.0e-6 + strain / ts.maxstrain);
        ts = ts.Multiply(count);
        ts.maxstrain = 0;
        ts.toughness = 0;
        stats = stats.Add(ts);
        stats = stats.Add(this.stagger_list[this.stagger_sel].stats.Clone());
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.reliability = 2 * Math.min(0, this.rotor_span);
            stats = stats.Add(this.blade_list[this.blade_idx].stats);
        }
        if (this.accessory) {
            if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
                stats.cost += 2;
                stats.mass += 2;
            }
            else if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
                stats.mass += this.rotor_count * this.engine_count;
            }
        }
        else {
            if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
                stats.mass += Math.max(this.rotor_count, this.engine_count);
            }
        }
        //Warnings
        if (this.type == AIRCRAFT_TYPE.HELICOPTER) {
            stats.warnings.push({
                source: Localization_lu("Helicopter Landing"),
                warning: Localization_lu("Helicopter Landing Warning"),
                color: WARNING_COLOR.WHITE,
            });
            stats.warnings.push({
                source: Localization_lu("Helicopter Descent"),
                warning: Localization_lu("Helicopter Descent Warning"),
                color: WARNING_COLOR.WHITE,
            });
            stats.warnings.push({
                source: Localization_lu("Helicopter Stall"),
                warning: Localization_lu("Helicopter Stall Warning"),
                color: WARNING_COLOR.WHITE,
            });
            if (stats.reliability < 0) {
                stats.warnings.push({
                    source: Localization_lu("Rotor Span"),
                    warning: Localization_lu("Rotor Span Warning"),
                    color: WARNING_COLOR.YELLOW,
                });
            }
        }
        else if (this.type == AIRCRAFT_TYPE.AUTOGYRO) {
            stats.warnings.push({
                source: Localization_lu("Autogyro Stall"),
                warning: Localization_lu("Autogyro Stall Warning"),
                color: WARNING_COLOR.WHITE,
            });
        }
        return stats;
    }
    SetCalculateStats(callback) {
        this.CalculateStats = callback;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        return value;
    }
}

;// CONCATENATED MODULE: ./src/disp/Weapons.ts





class Weapons_HTML extends (/* unused pure expression or super */ null && (Display)) {
    constructor(weap) {
        super();
        this.weap = weap;
        document.getElementById("lbl_weapons").textContent = lu("Weapons Section Title");
        document.getElementById("lbl_num_wsets").textContent = lu("Weapons Number of Weapon Sets");
        this.inp_w_count = document.getElementById("num_wsets");
        this.inp_w_count.onchange = () => { this.weap.SetWeaponSetCount(this.inp_w_count.valueAsNumber); };
        document.getElementById("lbl_num_wbraces").textContent = lu("Weapons Number of Weapon Braces");
        this.inp_w_brace = document.getElementById("num_wbraces");
        this.inp_w_brace.onchange = () => { this.weap.SetBraceCount(this.inp_w_brace.valueAsNumber); };
        this.tbl = document.getElementById("table_weapons");
        const row = this.tbl.insertRow();
        CreateTH(row, lu("Weapons Weapon Set"));
        CreateTH(row, lu("Weapons Weapons"));
        CreateTH(row, lu("Weapons Weapon Stats"));
        this.wrow = [];
    }
    CreateWSetRow() {
        const fragment = document.createDocumentFragment();
        const row = insertRow(fragment);
        const setcell = row.insertCell();
        const fs = CreateFlexSection(setcell);
        const type = {
            type: document.createElement("SELECT"),
            dirs: [],
            count: document.createElement("INPUT"),
            action: document.createElement("SELECT"),
            projectile: document.createElement("SELECT"),
            fixed: document.createElement("INPUT"),
            wcell: null,
            weaps: [],
            ammo: document.createElement("INPUT"),
            stats: { mass: null, drag: null, cost: null, sect: null, mounting: null, jams: null, hits: null, damg: null, shots: null, shots_header: null },
            repeating: document.createElement("INPUT"),
            seat: document.createElement("SELECT"),
        };
        const wlist = this.weap.GetWeaponList();
        for (const w of wlist) {
            const opt = document.createElement("OPTION");
            opt.text = lu(w.name) + " (" + lu(w.era) + ")";
            type.type.add(opt);
        }
        type.type.required = true;
        const slist = this.weap.GetSeatList();
        for (const s of slist) {
            const opt = document.createElement("OPTION");
            opt.text = s;
            type.seat.add(opt);
        }
        const alist = this.weap.GetActionList();
        for (const a of alist) {
            const opt = document.createElement("OPTION");
            opt.text = lu(a.name);
            type.action.add(opt);
        }
        type.action.required = true;
        const plist = this.weap.GetProjectileList();
        for (const p of plist) {
            const opt = document.createElement("OPTION");
            opt.text = lu(p.name);
            type.projectile.add(opt);
        }
        type.projectile.required = true;
        FlexSelect(lu("Weapons Type"), type.type, fs);
        FlexSelect(lu("Seat Location"), type.seat, fs);
        const lfs = CreateFlexSection(fs.div1);
        const rfs = CreateFlexSection(fs.div2);
        FlexInput(lu("Weapons Number of Mounts"), type.count, lfs);
        FlexInput(lu("Weapons Ammunition"), type.ammo, rfs);
        FlexSelect(lu("Weapons Action"), type.action, lfs);
        FlexSelect(lu("Weapons Projectile"), type.projectile, rfs);
        FlexCheckbox(lu("Weapons Belt Fed"), type.repeating, lfs);
        FlexSpace(rfs);
        FlexCheckbox(lu("Fixed"), type.fixed, lfs);
        FlexSpace(rfs);
        const dirlist = this.weap.GetDirectionList();
        for (let i = 0; i < dirlist.length; i += 2) {
            const dl = lu(dirlist[i]);
            var cbx = document.createElement("INPUT");
            FlexCheckbox(dl, cbx, lfs);
            type.dirs.push(cbx);
            const dr = lu(dirlist[i + 1]);
            cbx = document.createElement("INPUT");
            FlexCheckbox(dr, cbx, rfs);
            type.dirs.push(cbx);
        }
        type.wcell = row.insertCell();
        const statcell = row.insertCell();
        statcell.classList.toggle("inner_table");
        const stable = document.createElement("TABLE");
        stable.classList.toggle("inner_table");
        statcell.appendChild(stable);
        const h1_row = stable.insertRow();
        CreateTH(h1_row, lu("Stat Mass"));
        CreateTH(h1_row, lu("Stat Drag"));
        CreateTH(h1_row, lu("Stat Cost"));
        const c1_row = stable.insertRow();
        type.stats.mass = c1_row.insertCell();
        type.stats.drag = c1_row.insertCell();
        type.stats.cost = c1_row.insertCell();
        const h2_row = stable.insertRow();
        CreateTH(h2_row, lu("Stat Required Sections"));
        CreateTH(h2_row, lu("Weapons Stat Mounting"));
        CreateTH(h2_row, lu("Weapons Stat Jam"));
        const c2_row = stable.insertRow();
        type.stats.sect = c2_row.insertCell();
        type.stats.mounting = c2_row.insertCell();
        type.stats.jams = c2_row.insertCell();
        const h3_row = stable.insertRow();
        CreateTH(h3_row, lu("Weapons Stat Hits"));
        CreateTH(h3_row, lu("Weapons Stat Damage"));
        type.stats.shots_header = CreateTH(h3_row, lu("Weapons Stat Shots"));
        const c3_row = stable.insertRow();
        type.stats.hits = c3_row.insertCell();
        type.stats.damg = c3_row.insertCell();
        type.stats.shots = c3_row.insertCell();
        this.tbl.appendChild(fragment);
        return type;
    }
    CreateWRow(wcell) {
        const w = {
            span: document.createElement("SPAN"),
            wing: document.createElement("INPUT"),
            covered: document.createElement("INPUT"),
            accessible: document.createElement("INPUT"),
            free_access: document.createElement("INPUT"),
            synch: document.createElement("SELECT"),
            count: document.createElement("INPUT"),
        };
        CreateCheckbox(lu("Weapons Wing Mount"), w.wing, w.span, false);
        CreateCheckbox(lu("Weapons Accessible"), w.accessible, w.span, false);
        CreateCheckbox(lu("Weapons Free Accessible"), w.free_access, w.span, false);
        CreateCheckbox(lu("Weapons Covered"), w.covered, w.span, true);
        CreateInput(lu("Weapons # Weapons at Mount"), w.count, w.span, false);
        CreateSelect(lu("Weapons Synchronization"), w.synch, w.span, false);
        w.span.appendChild(document.createElement("HR"));
        const slist = this.weap.GetSynchronizationList();
        for (const s of slist) {
            const opt = document.createElement("OPTION");
            opt.text = lu(s);
            w.synch.add(opt);
        }
        wcell.appendChild(w.span);
        return w;
    }
    UpdateWSet(set, disp) {
        disp.type.selectedIndex = set.GetWeaponSelected();
        disp.type.onchange = () => { set.SetWeaponSelected(disp.type.selectedIndex); };
        const slist = this.weap.GetSeatList();
        if (disp.seat.options.length != slist.length) {
            while (disp.seat.options.length > 0) {
                disp.seat.options.remove(disp.seat.options.length - 1);
            }
            for (const s of slist) {
                const opt = document.createElement("OPTION");
                opt.text = s;
                disp.seat.add(opt);
            }
        }
        disp.seat.selectedIndex = set.GetSeat();
        disp.seat.onchange = () => { set.SetSeat(disp.seat.selectedIndex); };
        disp.count.valueAsNumber = set.GetMountingCount();
        disp.count.onchange = () => { set.SetMountingCount(disp.count.valueAsNumber); };
        disp.action.selectedIndex = set.GetAction();
        const can_act = set.GetCanAction();
        for (let i = 0; i < can_act.length; i++) {
            disp.action.options[i].disabled = !can_act[i];
        }
        disp.action.onchange = () => { set.SetAction(disp.action.selectedIndex); };
        disp.projectile.selectedIndex = set.GetProjectile();
        const can_proj = set.GetCanProjectile();
        for (let i = 0; i < can_proj.length; i++) {
            disp.projectile.options[i].disabled = !can_proj[i];
        }
        disp.projectile.onchange = () => { set.SetProjectile(disp.projectile.selectedIndex); };
        disp.repeating.checked = set.GetRepeating();
        disp.repeating.onchange = () => { set.SetRepeating(disp.repeating.checked); };
        disp.repeating.disabled = !set.CanRepeating();
        disp.fixed.checked = set.GetFixed();
        disp.fixed.onchange = () => { set.SetFixed(disp.fixed.checked); };
        const dirlist = set.GetDirection();
        const candir = set.CanDirection();
        for (let i = 0; i < dirlist.length; i++) {
            disp.dirs[i].checked = dirlist[i];
            disp.dirs[i].onchange = () => { set.SetDirection(i, disp.dirs[i].checked); };
            disp.dirs[i].disabled = !candir[i];
        }
        disp.ammo.valueAsNumber = set.GetAmmo();
        disp.ammo.onchange = () => { set.SetAmmo(disp.ammo.valueAsNumber); };
        const wlist = set.GetWeapons();
        while (disp.weaps.length < wlist.length) {
            disp.weaps.push(this.CreateWRow(disp.wcell));
        }
        while (disp.weaps.length > wlist.length) {
            const w = disp.weaps.pop();
            disp.wcell.removeChild(w.span);
        }
        for (let i = 0; i < wlist.length; i++) {
            disp.weaps[i].wing.checked = wlist[i].GetWing();
            disp.weaps[i].wing.onchange = () => { wlist[i].SetWing(disp.weaps[i].wing.checked); };
            disp.weaps[i].wing.disabled = !wlist[i].CanWing();
            disp.weaps[i].covered.checked = wlist[i].GetCovered();
            disp.weaps[i].covered.onchange = () => { wlist[i].SetCovered(disp.weaps[i].covered.checked); };
            disp.weaps[i].covered.disabled = !wlist[i].CanCovered();
            disp.weaps[i].accessible.checked = wlist[i].GetAccessible();
            disp.weaps[i].accessible.onchange = () => { wlist[i].SetAccessible(disp.weaps[i].accessible.checked); };
            disp.weaps[i].free_access.checked = wlist[i].GetFreeAccessible();
            disp.weaps[i].free_access.onchange = () => { wlist[i].SetFreeAccessible(disp.weaps[i].free_access.checked); };
            disp.weaps[i].free_access.disabled = !(wlist[i].can_free_accessible || wlist[i].GetFreeAccessible());
            disp.weaps[i].count.valueAsNumber = wlist[i].GetCount();
            disp.weaps[i].count.onchange = () => { wlist[i].SetCount(disp.weaps[i].count.valueAsNumber); };
            disp.weaps[i].synch.selectedIndex = wlist[i].GetSynchronization() + 1;
            disp.weaps[i].synch.onchange = () => { wlist[i].SetSynchronization(disp.weaps[i].synch.selectedIndex - 1); };
            disp.weaps[i].synch.disabled = !wlist[i].can_synchronize;
            const can = wlist[i].CanSynchronization();
            for (let j = 0; j < can.length; j++) {
                disp.weaps[i].synch.options[j].disabled = !can[j];
            }
        }
        const stats = set.PartStats();
        BlinkIfChanged(disp.stats.mass, stats.mass.toString(), false);
        BlinkIfChanged(disp.stats.drag, stats.drag.toString(), false);
        BlinkIfChanged(disp.stats.cost, stats.cost.toString(), false);
        BlinkIfChanged(disp.stats.sect, stats.reqsections.toString(), false);
        const h = set.GetHits();
        const hits = h[0].toString() + "/"
            + h[1].toString() + "/"
            + h[2].toString() + "/"
            + h[3].toString();
        if (set.GetFixed())
            BlinkIfChanged(disp.stats.mounting, lu("Fixed"));
        else if (set.GetDirectionCount() <= 2)
            BlinkIfChanged(disp.stats.mounting, lu("Flexible"));
        else
            BlinkIfChanged(disp.stats.mounting, lu("Turret"));
        BlinkIfChanged(disp.stats.jams, set.GetJam());
        BlinkIfChanged(disp.stats.hits, hits);
        BlinkIfChanged(disp.stats.damg, set.GetDamage().toString());
        if (set.GetProjectile() == ProjectileType.HEATRAY || set.IsLightningArc()) { //Heat Rays or lightning guns
            const chgs = set.GetHRCharges();
            disp.stats.shots_header.textContent = lu("Weapons Stat Charges");
            BlinkIfChanged(disp.stats.shots, StringFmt.Join("/", chgs));
        }
        else {
            disp.stats.shots_header.textContent = lu("Weapons Stat Shots");
            BlinkIfChanged(disp.stats.shots, set.GetShots().toString());
        }
    }
    UpdateWSets() {
        const wsets = this.weap.GetWeaponSets();
        if (wsets.length == 0)
            this.tbl.style.display = "none";
        else
            this.tbl.style.display = "";
        this.inp_w_count.valueAsNumber = wsets.length;
        while (wsets.length > this.wrow.length) {
            this.wrow.push(this.CreateWSetRow());
        }
        while (wsets.length < this.wrow.length) {
            this.tbl.deleteRow(this.wrow.length);
            this.wrow.pop();
        }
        for (let i = 0; i < wsets.length; i++) {
            this.UpdateWSet(wsets[i], this.wrow[i]);
        }
    }
    UpdateDisplay() {
        this.UpdateWSets();
        this.inp_w_count.valueAsNumber = this.weap.GetWeaponSets().length;
        this.inp_w_brace.valueAsNumber = this.weap.GetBraceCount();
    }
}
function WeaponName(w, wlist) {
    const ds = w.GetDirection();
    let dircount = 0;
    for (const d of ds) {
        if (d)
            dircount++;
    }
    let name = "";
    if (dircount == 1 && w.GetFixed())
        name += Localization_lu("Fixed") + " ";
    else if (dircount <= 2)
        name += Localization_lu("Flexible") + " ";
    else
        name += Localization_lu("Turreted") + " ";
    if (w.GetAction() == ActionType.MECHANICAL) {
        name += Localization_lu("Weapon Tag Mechanical Action") + " ";
    }
    else if (w.GetAction() == ActionType.GAST) {
        name += Localization_lu("Weapon Tag Gast Principle") + " ";
    }
    else if (w.GetAction() == ActionType.ROTARY) {
        name += Localization_lu("Weapon Tag Rotary") + " ";
    }
    if (w.GetProjectile() == Weapon_ProjectileType.HEATRAY) {
        name += Localization_lu("Weapon Tag Heat Ray") + " ";
    }
    else if (w.GetProjectile() == Weapon_ProjectileType.GYROJETS) {
        name += Localization_lu("Weapon Tag Gyrojet") + " ";
    }
    else if (w.GetProjectile() == Weapon_ProjectileType.PNEUMATIC) {
        name += Localization_lu("Weapon Tag Pneumatic") + " ";
    }
    name += wlist[w.GetWeaponSelected()].abrv;
    return name;
}
function WeaponTags(w) {
    const tags = [Localization_lu("Weapon Tag Jam", w.GetJam())];
    const fweap = w.GetFinalWeapon();
    if (w.GetReload() > 0) {
        if (w.GetReload() == 1) {
            tags.push(Localization_lu("Weapon Tag Manual"));
        }
        else {
            tags.push(Localization_lu("Weapon Tag Reload", w.GetReload()));
        }
    }
    if (fweap.rapid) {
        tags.push(Localization_lu("Weapon Tag Rapid Fire"));
    }
    if (fweap.shells) {
        tags.push(Localization_lu("Weapon Tag Shells"));
    }
    if (fweap.ap > 0) {
        tags.push(Localization_lu("Weapon Tag AP", fweap.ap));
    }
    if (w.GetIsFullyAccessible()) {
        tags.push(Localization_lu("Weapon Tag Fully Accessible"));
    }
    else if (w.GetIsPartlyAccessible()) {
        tags.push(Localization_lu("Weapon Tag Partly Accessible"));
    }
    else {
        tags.push(Localization_lu("Weapon Tag Inaccessible"));
    }
    if (fweap.deflection) {
        tags.push(Localization_lu("Weapon Tag Awkward", fweap.deflection));
    }
    return tags;
}
function WeaponString(w, wlist, dlist) {
    var wstring = "";
    const ds = w.GetDirection();
    const dirs = [];
    for (let i = 0; i < dlist.length; i++) {
        if (ds[i])
            dirs.push(Localization_lu(dlist[i]));
    }
    const hits = w.GetHits();
    const tags = WeaponTags(w);
    if (w.GetProjectile() == Weapon_ProjectileType.HEATRAY) {
        const chgs = w.GetHRCharges();
        wstring += Localization_lu("Weapon Description Heat Ray", Localization_lu("Seat #", w.GetSeat() + 1), w.GetWeaponCount(), WeaponName(w, wlist), string_StringFmt.Join(" ", dirs), wlist[w.GetWeaponSelected()].damage, string_StringFmt.Join("/", hits), string_StringFmt.Join("/", chgs), string_StringFmt.Join(", ", tags));
    }
    else {
        wstring += Localization_lu("Weapon Description", Localization_lu("Seat #", w.GetSeat() + 1), w.GetWeaponCount(), WeaponName(w, wlist), string_StringFmt.Join(" ", dirs), wlist[w.GetWeaponSelected()].damage, string_StringFmt.Join("/", hits), w.GetShots(), string_StringFmt.Join(", ", tags));
    }
    return wstring;
}

;// CONCATENATED MODULE: ./src/impl/Aircraft.ts


























class Aircraft {
    constructor(js, storage) {
        this.use_storage = false;
        this.reset_json = String.raw `{"version":"11.3","name":"Basic Biplane","aircraft_type":0,"era":{"selected":1},"cockpits":{"positions":[{"type":0,"upgrades":[false,false,false,false,false,false],"safety":[false,false,false,false,false],"sights":[false,false,false,false],"bombsight":0}]},"passengers":{"seats":0,"beds":0,"connected":false},"engines":{"engines":[{"selected_stats":{"name":"Rhona Motorbau Z11 80hp","overspeed":18,"altitude":29,"torque":2,"rumble":0,"oiltank":true,"pulsejet":false,"liftbleed":0,"wetmass":0,"mass":4,"drag":8,"control":0,"cost":4,"reqsections":0,"visibility":0,"flightstress":0,"escape":0,"pitchstab":0,"latstab":0,"cooling":0,"reliability":-1,"power":8,"fuelconsumption":10,"maxstrain":0,"structure":0,"pitchboost":0,"pitchspeed":0,"wingarea":0,"toughness":0,"upkeep":0,"crashsafety":0,"bomb_mass":0,"fuel":0,"charge":0},"selected_inputs":{"name":"Rhona Motorbau Z11 80hp","engine_type":0,"type":2,"era_sel":1,"displacement":10.9,"compression":4.5,"cyl_per_row":9,"rows":1,"RPM_boost":1,"material_fudge":1,"quality_fudge":1,"compressor_type":0,"compressor_count":0,"min_IAF":0,"upgrades":[false,false,false,false]},"cooling_count":0,"radiator_index":-1,"selected_mount":0,"use_pushpull":false,"pp_torque_to_struct":false,"use_driveshafts":false,"geared_propeller_ratio":0,"geared_propeller_reliability":0,"cowl_sel":2,"is_generator":false,"has_alternator":false,"intake_fan":false}],"radiators":[],"is_asymmetric":false},"propeller":{"type":2,"use_variable":false},"frames":{"sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_sections":[{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false},{"frame":0,"geodesic":false,"monocoque":false,"lifting_body":false,"internal_bracing":false}],"tail_index":2,"use_farman":false,"use_boom":false,"flying_wing":false,"sel_skin":1},"wings":{"wing_list":[{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":0},{"surface":0,"area":8,"span":8,"anhedral":0,"dihedral":0,"gull":false,"deck":3}],"mini_wing_list":[],"wing_stagger":4,"is_swept":false,"is_closed":false},"stabilizers":{"hstab_sel":0,"hstab_count":1,"vstab_sel":0,"vstab_count":1},"controlsurfaces":{"aileron_sel":0,"rudder_sel":0,"elevator_sel":0,"flaps_sel":0,"slats_sel":0,"drag_sel":[false,false,false]},"reinforcements":{"ext_wood_count":[1,0,0,0,0,0,0,0,0],"ext_steel_count":[0,0,0,0,0,0,0,0,0],"cant_count":[0,0,0,0,0],"wires":true,"cabane_sel":1,"wing_blades":false},"fuel":{"tank_count":[1,0,0,0],"self_sealing":false,"fire_extinguisher":false},"munitions":{"bomb_count":0,"rocket_count":0,"bay_count":0,"bay1":false,"bay2":false},"cargo":{"space_sel":0},"gear":{"gear_sel":0,"retract":false,"extra_sel":[false,false,false]},"accessories":{"v":2,"armour_coverage":[0,0,0,0,0,0,0,0],"electrical_count":[0,0,0],"radio_sel":0,"info_sel":[false,false],"visi_sel":[false,false,false],"clim_sel":[false,false,false,false],"auto_sel":0,"cont_sel":0},"optimization":{"free_dots":0,"cost":0,"bleed":0,"escape":0,"mass":0,"toughness":0,"maxstrain":0,"reliability":0,"drag":0},"weapons":{"weapon_systems":[{"weapon_type":3,"fixed":true,"directions":[true,false,false,false,false,false],"weapons":[{"fixed":true,"wing":false,"covered":false,"accessible":false,"free_accessible":true,"synchronization":0,"w_count":1}],"ammo":1,"action":0,"projectile":0,"repeating":false}],"brace_count":0},"used":{"enabled":false,"burnt_out":0,"ragged":0,"hefty":0,"sticky_guns":0,"weak":0,"fragile":0,"leaky":0,"sluggish":0},"rotor":{"type":0,"rotor_count":0,"rotor_span":0,"rotor_mat":0,"is_tandem":false,"accessory":false}}`;
        this.freeze_calculation = true;
        this.stats = new Stats();
        this.name = "Prototype Aircraft";
        this.version = js["version"];
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
        this.weapons = new Weapons();
        this.used = new Used();
        this.rotor = new Rotor(js["rotor"]);
        this.alter = new AlterStats();
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
        this.rotor.SetCalculateStats(() => { this.CalculateStats(); });
        this.alter.SetCalculateStats(() => { this.CalculateStats(); });
        this.rotor.SetCantileverList(this.reinforcements.GetCantileverList());
        this.cockpits.SetNumberOfCockpits(1);
        this.engines.SetNumberOfEngines(1);
        this.frames.SetTailType(1);
        this.use_storage = storage;
        this.updated_stats = false;
        this.freeze_calculation = false;
        this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
        this.Reset();
    }
    InteractiveDash() {
        // this.name = this.derived.GetName();
        const stats = this.GetStats();
        const derived = this.GetDerivedStats();
        const str_vital = this.VitalComponentList();
        var remove = false;
        while (str_vital.length > 10) {
            str_vital.pop();
            remove = true;
        }
        if (remove) {
            str_vital.pop();
            str_vital.push("And More. See Plane Builder for full list.");
        }
        while (str_vital.length < 10) {
            str_vital.push("");
        }
        const coverage = this.GetAccessories().GetEffectiveCoverage();
        var armour_str = "";
        for (let r = 0; r < coverage.length; ++r) {
            const AP = r + 1;
            if (coverage[r] > 0) {
                if (armour_str != "")
                    armour_str += ", ";
                else
                    armour_str += Localization_lu("Armour") + " ";
                armour_str += AP.toString() + "/+" + (11 - coverage[r]).toString();
            }
        }
        const ordinance = [];
        const bombs = this.GetMunitions().GetBombCount();
        const rockets = this.GetMunitions().GetRocketCount();
        var internal = this.GetMunitions().GetInternalBombCount();
        if (bombs > 0 || rockets > 0) {
            ordinance.push("Current load here.");
        }
        if (bombs > 0) {
            const int_bomb = Math.min(bombs, internal);
            const ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                ordinance.push(Localization_lu(" Bomb Mass Internally.", int_bomb));
            if (ext_bomb > 0)
                ordinance.push(Localization_lu(" Bomb Mass Externally.", ext_bomb));
            if (int_bomb > 0) {
                const mib = Math.min(int_bomb, this.GetMunitions().GetMaxBombSize());
                ordinance.push(Localization_lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
        }
        if (rockets > 0) {
            const int_rock = Math.min(rockets, internal);
            const ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                ordinance.push(Localization_lu(" Rocket Mass Internally.", int_rock));
            if (ext_rock > 0)
                ordinance.push(Localization_lu(" Rocket Mass Externally.", ext_rock));
        }
        while (ordinance.length < 5) {
            ordinance.push("");
        }
        let warnings = "";
        for (const w of stats.warnings) {
            warnings += w.source + ": " + w.warning + "\n";
        }
        const planeState = {
            "altitude": 0,
            "airspeed": 0,
            "fuel": derived.FuelUses,
            "dropoff": derived.Dropoff,
            "visibility": this.GetCockpits().GetCockpit(0).GetVisibility(),
            "energy_loss": derived.EnergyLoss,
            "turn_bleed": derived.TurnBleed,
            "stability": derived.Stabiilty,
            "stress": this.GetCockpits().GetCockpit(0).GetFlightStress()[0],
            "plane_escape": this.GetCockpits().GetCockpit(0).GetEscape(),
            "crash": this.GetCockpits().GetCockpit(0).GetCrash(),
            "max_toughness": derived.Toughness,
            "current_toughness": derived.Toughness,
            "max_strain": derived.MaxStrain,
            "current_strain": derived.MaxStrain,
            "g_force": 0,
            "kills": 0,
            "full_load_boost": derived.BoostFullwBombs,
            "full_load_handling": derived.HandlingFullwBombs,
            "full_load_climb": derived.RateOfClimbwBombs,
            "full_load_stall": derived.StallSpeedFullwBombs,
            "full_load_speed": derived.MaxSpeedwBombs,
            "half_fuel_bombs_boost": Math.floor((derived.BoostFullwBombs + derived.BoostEmpty) / 2),
            "half_fuel_bombs_handling": Math.floor((derived.HandlingFullwBombs + derived.HandlingEmpty) / 2),
            "half_fuel_bombs_climb": Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbwBombs) / 2),
            "half_fuel_bombs_stall": Math.floor((derived.StallSpeedFullwBombs + derived.StallSpeedEmpty) / 2),
            "half_fuel_bombs_speed": Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedwBombs) / 2),
            "full_fuel_no_bombs_boost": derived.BoostFull,
            "full_fuel_no_bombs_handling": derived.HandlingFull,
            "full_fuel_no_bombs_climb": derived.RateOfClimbFull,
            "full_fuel_no_bombs_stall": derived.StallSpeedFull,
            "full_fuel_no_bombs_speed": Math.floor(1.0e-6 + derived.MaxSpeedFull),
            "half_fuel_no_bombs_boost": Math.floor((derived.BoostFull + derived.BoostEmpty) / 2),
            "half_fuel_no_bombs_handling": Math.floor((derived.HandlingFull + derived.HandlingEmpty) / 2),
            "half_fuel_no_bombs_climb": Math.floor(1.0e-6 + (derived.RateOfClimbEmpty + derived.RateOfClimbFull) / 2),
            "half_fuel_no_bombs_stall": Math.floor((derived.StallSpeedFull + derived.StallSpeedEmpty) / 2),
            "half_fuel_no_bombs_speed": Math.floor(1.0e-6 + (derived.MaxSpeedEmpty + derived.MaxSpeedFull) / 2),
            "empty_boost": 0,
            "empty_handling": derived.HandlingEmpty,
            "empty_climb": 0,
            "empty_stall": derived.StallSpeedEmpty,
            "empty_speed": 0,
            "vital_part_1": str_vital[0],
            "vital_part_2": str_vital[1],
            "vital_part_3": str_vital[2],
            "vital_part_4": str_vital[3],
            "vital_part_5": str_vital[4],
            "vital_part_6": str_vital[5],
            "vital_part_7": str_vital[6],
            "vital_part_8": str_vital[7],
            "vital_part_9": str_vital[8],
            "vital_part_10": str_vital[9],
            "armor": armour_str,
            "max_bomb_load": ordinance[0],
            "ordinance_1": ordinance[1],
            "ordinance_2": ordinance[2],
            "ordinance_3": ordinance[3],
            "ordinance_4": ordinance[4],
            "notes": warnings,
            "full_load_selected": true,
            "half_fuel_bombs_selected": false,
            "full_fuel_no_bombs_selected": false,
            "half_fuel_no_bombs_selected": false,
            "empty_selected": false,
            "engines": this.InteractiveEngines(),
            "weapons": this.InteractiveWeapons(),
        };
        return JSON.stringify(planeState);
    }
    InteractiveEngines() {
        const engines = [];
        for (let i = 0; i < this.GetEngines().GetNumberOfEngines(); i++) {
            const e = this.GetEngines().GetEngine(i);
            const engine_state = {
                "rpm": 0,
                "wear": 0,
                "reliability": e.GetReliability(),
                "ideal_altitide": e.GetMaxAltitude(),
                "overspeed": e.GetOverspeed(),
                "notes": "",
            };
            const estats = e.GetCurrentStats();
            const notes = [];
            if (estats.pulsejet) {
                notes.push(Localization_lu("Pulsejet"));
                const inputs = GetEngineLists().get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.power > 0 && inputs.starter) {
                    notes.push(Localization_lu("Starter"));
                }
            }
            else {
                if (e.IsRotary() && e.IsTractor()) {
                    notes.push(Localization_lu("Turns Right"));
                }
                else if (e.IsRotary() && e.IsPusher()) {
                    notes.push(Localization_lu("Turns Left"));
                }
                const engine_list = GetEngineLists();
                const inputs = engine_list.get(e.GetSelectedList()).get_name(estats.name);
                if (inputs.upgrades[1]) {
                    notes.push(Localization_lu("War Emergency Power"));
                }
                else if (inputs.compressor_count > 0 && inputs.compressor_type == 1) {
                    notes.push(Localization_lu("War Emergency Power from altitudes 0-9"));
                }
            }
            engine_state.notes = string_StringFmt.Join(", ", notes);
            if (e.GetUsePushPull()) {
                const rely = engine_state.reliability;
                const rely2 = rely.split('/');
                engine_state.reliability = rely2[0].toString();
                engines.push(JSON.stringify(engine_state));
                engine_state.reliability = rely2[0].toString();
                engines.push(JSON.stringify(engine_state));
            }
            else {
                engines.push(JSON.stringify(engine_state));
            }
        }
        return engines;
    }
    InteractiveWeapons() {
        const wstates = [];
        for (const w of this.GetWeapons().GetWeaponSets()) {
            const wlist = this.GetWeapons().GetWeaponList();
            const hits = w.GetHits();
            const damage = [];
            if (wlist[w.GetWeaponSelected()].abrv == "PR") {
                damage.push(5);
                damage.push(5);
                damage.push(5);
                damage.push(5);
            }
            else {
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[0]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[1]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[2]));
                damage.push(Math.floor(1.0e-6 + wlist[w.GetWeaponSelected()].damage * hits[3]));
            }
            const fweap = w.GetFinalWeapon();
            const tags = [];
            const weaponState = {
                "type": WeaponName(w, wlist),
                "ammo": w.GetShots(),
                "ap": fweap.ap,
                "jam": w.GetJam(),
                "knife_hits": hits[0],
                "close_hits": hits[1],
                "long_hits": hits[2],
                "extreme_hits": hits[3],
                "knife_damage": damage[0],
                "close_damage": damage[1],
                "long_damage": damage[2],
                "extreme_damage": damage[3],
                "tags": "",
            };
            const dlist = this.GetWeapons().GetDirectionList();
            if (w.IsPlural()) {
                weaponState.type = w.GetWeaponCount().toString() + "x " + weaponState.type;
            }
            const ds = w.GetDirection();
            var dtag = "";
            dtag += "[";
            for (let i = 0; i < dlist.length; i++) {
                if (ds[i])
                    dtag += Localization_lu(dlist[i]) + " ";
            }
            dtag = dtag.substr(0, dtag.length - 1);
            dtag += "]";
            tags.push(dtag);
            tags.concat(WeaponTags(w));
            weaponState.tags = string_StringFmt.Join(", ", tags);
            wstates.push(JSON.stringify(weaponState));
        }
        return wstates;
    }
    toJSON() {
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
            rotor: this.rotor.toJSON(),
            alter: this.alter.toJSON(),
        };
    }
    fromJSON(js, disp = true) {
        this.freeze_calculation = true;
        if (disp) {
            console.log(js);
            console.log(js["version"]);
        }
        const json_version = parseFloat(js["version"]);
        this.name = js["name"];
        if (json_version > 11.05) {
            this.aircraft_type = js["aircraft_type"];
            this.rotor.SetType(js["aircraft_type"]);
        }
        else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
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
        if (json_version > 11.05) {
            this.rotor.fromJSON(js["rotor"], json_version);
        }
        if (json_version > 12.25) {
            this.alter.fromJSON(js["alter"], json_version);
        }
        else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
        return true;
    }
    serialize(s) {
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
        this.rotor.serialize(s);
        s.PushNum(this.aircraft_type);
        this.alter.serialize(s);
    }
    deserialize(d) {
        this.freeze_calculation = true;
        d.version = parseFloat(d.GetString());
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
        if (d.version > 11.05) {
            this.rotor.deserialise(d);
            this.aircraft_type = d.GetNum();
            this.rotor.SetType(this.aircraft_type);
        }
        else {
            this.aircraft_type = AIRCRAFT_TYPE.AIRPLANE;
            this.rotor.SetType(AIRCRAFT_TYPE.AIRPLANE);
        }
        if (d.version > 12.25) {
            this.alter.deserialize(d);
        }
        else {
            this.alter.ClearAll();
        }
        this.freeze_calculation = false;
    }
    SetType(type) {
        this.aircraft_type = type;
        this.rotor.SetType(type);
        this.CalculateStats();
    }
    SetDisplayCallback(callback) {
        this.DisplayCallback = callback;
    }
    CalculateStats() {
        if (this.freeze_calculation) {
            return;
        }
        this.updated_stats = false;
        let stats = new Stats();
        stats = stats.Add(this.era.PartStats());
        stats = stats.Add(this.cockpits.PartStats());
        stats = stats.Add(this.passengers.PartStats());
        this.engines.SetTailMods(this.frames.GetFarmanOrBoom(), this.wings.GetSwept() && this.stabilizers.GetVOutboard(), this.stabilizers.GetCanard());
        this.engines.SetInternal(this.aircraft_type == AIRCRAFT_TYPE.HELICOPTER || IsAnyOrnithopter(this.aircraft_type));
        this.engines.SetMetalArea(this.wings.GetMetalArea());
        this.engines.HaveParasol(this.wings.GetParasol());
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
        this.weapons.cant_type = this.reinforcements.GetCantileverType();
        this.weapons.SetHavePropeller(this.engines.GetNumPropellers() > 0);
        this.weapons.SetCanWing(!IsAnyOrnithopter(this.aircraft_type));
        stats = stats.Add(this.weapons.PartStats());
        //Cargo makes sections
        stats = stats.Add(this.cargo.PartStats());
        //If there are wings...
        this.wings.SetAcftType(this.aircraft_type);
        if (this.aircraft_type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.wings.SetRotorSpan(this.rotor.GetRotorSpan());
        }
        else {
            this.wings.SetRotorSpan(0);
        }
        stats = stats.Add(this.wings.PartStats());
        this.rotor.SetWingArea(stats.wingarea);
        //If there is a rotor...
        if (this.aircraft_type == AIRCRAFT_TYPE.AUTOGYRO) {
            this.rotor.SetEngineCount(this.engines.GetNumberOfEngines());
            stats = stats.Add(this.rotor.PartStats());
        }
        this.controlsurfaces.SetWingArea(stats.wingarea);
        this.controlsurfaces.SetBoomTail(this.frames.GetUseBoom());
        this.controlsurfaces.SetSpan(this.wings.GetSpan());
        this.controlsurfaces.SetAcftType(this.aircraft_type);
        this.controlsurfaces.SetCanElevator(this.stabilizers.GetHStabCount() > 0);
        this.controlsurfaces.SetCanRudder(this.stabilizers.GetVStabCount() > 0);
        this.controlsurfaces.SetIsVTail(this.stabilizers.GetIsVTail());
        if (this.aircraft_type == AIRCRAFT_TYPE.AIRPLANE) {
            this.controlsurfaces.SetNumCantilever(this.reinforcements.GetTotalCantilevers());
        }
        else {
            this.controlsurfaces.SetNumCantilever(0);
        }
        stats = stats.Add(this.controlsurfaces.PartStats());
        this.reinforcements.SetMonoplane(this.wings.GetMonoplane());
        this.reinforcements.SetTandem(this.wings.GetTandem());
        this.reinforcements.SetStaggered(this.wings.GetStaggered());
        this.reinforcements.SetCanUseExternal(this.wings.GetArea() > 0);
        this.reinforcements.SetSesquiplane(this.wings.GetIsSesquiplane());
        this.reinforcements.SetAircraftType(this.aircraft_type);
        this.reinforcements.SetCantLift(this.era.GetCantLift());
        stats = stats.Add(this.reinforcements.PartStats());
        if (this.rotor.GetTailRotor()) {
            stats.power = Math.floor(1.0e-6 + 0.9 * stats.power);
        }
        this.accessories.SetAcftRadiator(this.engines.GetNumberOfRadiators() > 0);
        this.accessories.SetSkinArmor(this.frames.GetArmor());
        this.accessories.SetVitalParts(this.VitalComponentList().length);
        this.accessories.SetCanCutouts(this.wings.CanCutout(), this.frames.CanCutout());
        stats = stats.Add(this.accessories.PartStats());
        //You know what, frames go last, because lots of things make sections.
        this.frames.SetRequiredSections(stats.reqsections);
        this.frames.SetHasTractorNacelles(this.engines.GetHasTractorNacelles());
        this.frames.SetIsTandem(this.wings.GetTandem());
        stats = stats.Add(this.frames.PartStats());
        //Depends on Lifting area.
        this.stabilizers.SetEngineCount(this.engines.GetNumberOfEngines());
        this.stabilizers.SetIsTandem(this.wings.GetTandem());
        this.stabilizers.SetIsSwept(this.wings.GetSwept());
        this.stabilizers.SetHaveTail(!this.frames.GetIsTailless());
        this.stabilizers.SetHelicopter(false);
        this.stabilizers.SetLiftingArea(stats.wingarea);
        this.stabilizers.wing_drag = this.wings.GetWingDrag() + this.rotor.GetRotorDrag();
        stats = stats.Add(this.stabilizers.PartStats());
        //Treated Paper needs to apply near to last
        this.wings.SetAircraftMass(stats.mass);
        stats.mass += this.wings.GetPaperMass();
        //Because treated paper brings mass down.
        stats.mass = Math.max(1, stats.mass);
        //Gear go last, because they need total mass.
        this.gear.SetGull(this.wings.HasInvertedGull());
        this.gear.SetLoadedMass(stats.mass + stats.wetmass);
        this.gear.CanBoat(this.engines.GetEngineHeight(), this.wings.GetWingHeight());
        stats = stats.Add(this.gear.PartStats());
        //Add toughness here so it gets optimized properly.
        stats.toughness += Math.floor(1.0e-6 + stats.structure / 5);
        this.optimization.SetAcftStats(stats);
        stats = stats.Add(this.optimization.PartStats());
        //Has flight stress from open cockpit + tractor rotary.
        this.cockpits.SetHasRotary(this.engines.HasTractorRotary());
        stats = stats.Add(this.alter.PartStats());
        //Have to round after optimizations, because otherwise it's wrong.
        stats.Round();
        if (!this.updated_stats) {
            this.updated_stats = true;
            this.stats = stats;
            const derived = this.GetDerivedStats();
            //Because flaps have cost per MP
            this.stats.cost += this.controlsurfaces.GetFlapCost(derived.DryMP);
            //Used: burnt_out
            stats.reliability -= this.used.burnt_out;
            //Used: sticky_guns  (Just needs to happen before display)
            this.weapons.SetStickyGuns(this.used.sticky_guns);
            //Update Part Local stuff
            this.cockpits.SetArmed(this.weapons.GetArmedSeats());
            this.cockpits.UpdateCrewStats(this.stats.escape, derived.ControlStress, derived.RumbleStress, this.stats.visibility, this.stats.crashsafety);
            //Check Flight Stress for warnings
            let stress_reduction = 0;
            for (const s of this.cockpits.GetStressList()) {
                stress_reduction = Math.max(stress_reduction, s[0] - s[1]);
            }
            if (stress_reduction != 0 && this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Co-Pilot Controls"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Co-Pilot Controls"),
                    warning: Localization_lu("Co-Pilot Warning", stress_reduction),
                    color: WARNING_COLOR.WHITE,
                });
            }
            if (IsAnyOrnithopter(this.aircraft_type)) {
                stats.upkeep += 1;
            }
            if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
                stats.reliability -= 2;
            }
            this.engines.UpdateReliability(stats);
            //Not really part local, but only affects number limits.
            this.reinforcements.SetAcftStructure(stats.structure);
            this.fuel.SetArea(this.wings.GetArea());
            this.fuel.SetCantilever(this.reinforcements.GetIsCantilever());
            this.munitions.SetAcftParameters(stats.structure, this.era.GetMaxBomb(), this.wings.HasInvertedGull());
            //Airplanes always cost 1
            this.stats.cost = Math.max(1, this.stats.cost);
            //Always have at least 1 liftbleed
            this.stats.liftbleed = Math.max(1, this.stats.liftbleed);
            if (this.engines.GetRumble() * 10 > stats.structure) {
                this.stats.power = 0;
                this.stats.warnings.push({
                    source: Localization_lu("Stat Rumble"),
                    warning: Localization_lu("Rumble Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
            if (this.DisplayCallback && !this.freeze_calculation)
                this.DisplayCallback();
            if (this.use_storage)
                window.localStorage.setItem("aircraft", JSON.stringify(this));
        }
    }
    GetDerivedStats() {
        let DryMP = Math.floor(1.0e-6 + this.stats.mass / 5);
        DryMP = Math.max(DryMP, 1);
        let WetMP = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass) / 5);
        WetMP = Math.max(WetMP, 1);
        let WetMPwBombs = Math.floor(1.0e-6 + (this.stats.mass + this.stats.wetmass + this.stats.bomb_mass) / 5);
        WetMPwBombs = Math.max(WetMPwBombs, 1);
        let DPEmpty = Math.floor(1.0e-6 + (this.stats.drag + DryMP) / 5);
        DPEmpty = Math.max(DPEmpty, 1);
        const DPFull = DPEmpty; //Based on advice from Discord.
        let DPwBombs = Math.floor(1.0e-6 + (this.stats.drag + this.munitions.GetExternalMass() + DryMP) / 5);
        DPwBombs = Math.max(DPwBombs, 1);
        let MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPEmpty * 9))));
        let MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPFull * 9))));
        let MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (DPwBombs * 9))));
        // Supersonic Tests
        // const MaxSpeedEmpty = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPEmpty * 9))));
        // const MaxSpeedFull = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPFull * 9))));
        // const MaxSpeedwBombs = Math.floor(1.0e-6 + this.stats.pitchspeed * (Math.sqrt((2000 * this.stats.power) / (0.5 * DPwBombs * 9))));
        //Warnings for limits.
        if (this.stats.mass < 15) {
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Stat Mass"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Stat Mass"), warning: Localization_lu("Low Mass Warning"),
                    color: WARNING_COLOR.YELLOW,
                });
            }
        }
        if ((this.stats.drag + DryMP) < 35) {
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Stat Drag"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Stat Drag"), warning: Localization_lu("Low Drag Warning"),
                    color: WARNING_COLOR.YELLOW,
                });
            }
        }
        let StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * DryMP / Math.max(1, this.stats.wingarea)));
        let StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + this.stats.liftbleed * WetMP / Math.max(1, this.stats.wingarea)));
        let StallSpeedFullwBombs = Math.max(Math.floor(1.0e-6 + this.stats.liftbleed * WetMPwBombs / Math.max(1, this.stats.wingarea)));
        var Overspeed = this.engines.GetOverspeed();
        const BoostEmpty = Math.floor(1.0e-6 + this.stats.power / DryMP);
        const BoostFull = Math.floor(1.0e-6 + this.stats.power / WetMP);
        const BoostFullwBombs = Math.floor(1.0e-6 + this.stats.power / WetMPwBombs);
        if (BoostFullwBombs == 0) {
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Derived Boost"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Derived Boost"), warning: Localization_lu("Boost Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
        }
        const Dropoff = Math.floor(1.0e-6 + this.stats.pitchboost * MaxSpeedEmpty);
        //Used: Ragged
        // Comes after Dropoff so Used only affects the one number, not multiple.
        MaxSpeedEmpty = Math.floor(1.0e-6 + MaxSpeedEmpty * (1 - 0.1 * this.used.ragged));
        MaxSpeedFull = Math.floor(1.0e-6 + MaxSpeedFull * (1 - 0.1 * this.used.ragged));
        MaxSpeedwBombs = Math.floor(1.0e-6 + MaxSpeedwBombs * (1 - 0.1 * this.used.ragged));
        let Stability = this.stats.pitchstab + this.stats.latstab;
        if (this.stats.pitchstab > 0 && this.stats.latstab > 0)
            Stability += 2;
        else if (this.stats.pitchstab < 0 && this.stats.latstab < 0)
            Stability -= 2;
        let HandlingEmpty = 100 + this.stats.control - DryMP;
        if (Stability > 10 || Stability < -10) {
            HandlingEmpty = -1 / 0;
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Derived Stability"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Derived Stability"), warning: Localization_lu("Stability Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
        }
        else if (Stability == 10)
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
        let HandlingFull = HandlingEmpty + DryMP - WetMP;
        let HandlingFullwBombs = HandlingEmpty + DryMP - WetMPwBombs;
        //Used: Sluggish
        HandlingEmpty = Math.floor(1.0e-6 + HandlingEmpty - 5 * this.used.sluggish);
        HandlingFull = Math.floor(1.0e-6 + HandlingFull - 5 * this.used.sluggish);
        HandlingFullwBombs = Math.floor(1.0e-6 + HandlingFullwBombs - 5 * this.used.sluggish);
        let MaxStrain = Math.min(this.stats.maxstrain - DryMP, this.stats.structure);
        //And store the results so they can be displayed
        this.optimization.final_ms = Math.floor(1.0e-6 + this.optimization.GetMaxStrain() * 1.5 * MaxStrain / 10);
        MaxStrain += this.optimization.final_ms;
        //Used: Fragile
        MaxStrain = Math.floor(1.0e-6 + MaxStrain * (1 - 0.2 * this.used.fragile));
        if (MaxStrain < 10 && this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Stat Max Strain"); }) == -1) {
            this.stats.warnings.push({
                source: Localization_lu("Stat Max Strain"), warning: Localization_lu("Max Strain Warning"),
                color: WARNING_COLOR.RED,
            });
        }
        let Toughness = this.stats.toughness;
        //Used: Weak
        Toughness = Math.floor(1.0e-6 + Toughness * (1 - 0.5 * this.used.weak));
        const Structure = this.stats.structure;
        let EnergyLoss = Math.ceil(-1.0e-6 + DPEmpty / this.propeller.GetEnergy());
        let EnergyLosswBombs = EnergyLoss + 1;
        EnergyLoss = Math.min(EnergyLoss, 10);
        EnergyLosswBombs = Math.min(EnergyLosswBombs, 10);
        let TurnBleed = Math.ceil(-1.0e-6 + Math.floor(1.0e-6 + (StallSpeedEmpty + StallSpeedFull) / 2) / this.propeller.GetTurn());
        if (this.aircraft_type == AIRCRAFT_TYPE.HELICOPTER) {
            TurnBleed = Math.max(1, Math.floor(1.0e-6 + DryMP / 2)) + this.rotor.GetRotorBleed();
            EnergyLoss = Math.max(1, Math.floor(1.0e-6 + DPEmpty / 7));
            StallSpeedEmpty = 0;
            StallSpeedFull = 0;
            StallSpeedFullwBombs = 0;
            MaxSpeedEmpty = Math.min(37, MaxSpeedEmpty);
            MaxSpeedFull = Math.min(37, MaxSpeedFull);
            MaxSpeedwBombs = Math.min(37, MaxSpeedwBombs);
        }
        TurnBleed = Math.max(TurnBleed, 1);
        let TurnBleedwBombs = TurnBleed + 1;
        TurnBleedwBombs = Math.max(TurnBleedwBombs, 1);
        //Used: Hefty
        // Comes after Turnbleed so Used only affects the one number, not multiple.
        StallSpeedEmpty = Math.max(1, Math.floor(1.0e-6 + StallSpeedEmpty * (1 + 0.2 * this.used.hefty)));
        StallSpeedFull = Math.max(1, Math.floor(1.0e-6 + StallSpeedFull * (1 + 0.2 * this.used.hefty)));
        StallSpeedFullwBombs = Math.max(1, Math.floor(1.0e-6 + StallSpeedFullwBombs * (1 + 0.2 * this.used.hefty)));
        if (MaxSpeedwBombs <= StallSpeedFullwBombs || MaxSpeedFull <= StallSpeedFull) {
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Stall Speed"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Stall Speed"), warning: Localization_lu("Stall Speed Warning"),
                    color: WARNING_COLOR.RED,
                });
            }
        }
        let FuelUses = Math.floor(1.0e-6 + this.stats.fuel / this.stats.fuelconsumption);
        //Used: Leaky
        FuelUses = Math.floor(1.0e-6 + FuelUses * (1 - 0.2 * this.used.leaky));
        if (!isFinite(FuelUses)) {
            FuelUses = 0;
        }
        if (FuelUses < 6) {
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Derived Fuel Uses"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Derived Fuel Uses"), warning: Localization_lu("Fuel Uses Warning"),
                    color: WARNING_COLOR.YELLOW,
                });
            }
        }
        let ControlStress = 1;
        if (Stability > 3 || Stability < -3)
            ControlStress++;
        //Flight Stress from Rumble.
        let RumbleStress = 0;
        ControlStress += Math.min(this.accessories.GetMaxMassStress(), Math.floor(1.0e-6 + DryMP / 10));
        const MaxStress = this.accessories.GetMaxTotalStress();
        ControlStress = Math.min(MaxStress, ControlStress);
        if (this.engines.GetMaxRumble() > 0) {
            RumbleStress += Math.max(1, this.engines.GetMaxRumble());
            RumbleStress = Math.floor(1.0e-6 + RumbleStress);
        }
        if (MaxStress == 0) {
            RumbleStress = 0;
        }
        let RateOfClimbEmpty = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / DryMP) * (23.0 / this.stats.pitchspeed) / DPEmpty));
        let RateOfClimbFull = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMP) * (23.0 / this.stats.pitchspeed) / DPFull));
        let RateOfClimbwBombs = Math.max(1, Math.floor(1.0e-6 + (this.stats.power / WetMPwBombs) * (23.0 / this.stats.pitchspeed) / DPwBombs));
        if (!isFinite(RateOfClimbEmpty)) {
            RateOfClimbEmpty = 0;
            RateOfClimbFull = 0;
            RateOfClimbwBombs = 0;
        }
        //Ornithopter Stuff
        if (IsAnyOrnithopter(this.aircraft_type)) {
            HandlingEmpty += 5;
            HandlingFull += 5;
            HandlingFullwBombs += 5;
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Ornithopter Stall"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Ornithopter Stall"), warning: Localization_lu("Ornithopter Stall Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
            Overspeed = MaxStrain;
        }
        if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER_FLUTTER) {
            HandlingEmpty += 5;
            HandlingFull += 5;
            HandlingFullwBombs += 5;
            Overspeed = Infinity;
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Ornithopter Flutterer Attack"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Ornithopter Flutterer Attack"), warning: Localization_lu("Ornithopter Flutterer Attack Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
        }
        if (this.aircraft_type == AIRCRAFT_TYPE.ORNITHOPTER_BUZZER) {
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Ornithopter Buzzer Boost"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Ornithopter Buzzer Boost"), warning: Localization_lu("Ornithopter Buzzer Boost Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
            if (this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Ornithopter Buzzer Stall"); }) == -1) {
                this.stats.warnings.push({
                    source: Localization_lu("Ornithopter Buzzer Stall"), warning: Localization_lu("Ornithopter Buzzer Stall Warning"),
                    color: WARNING_COLOR.WHITE,
                });
            }
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
        };
    }
    VitalComponentList() {
        const derived = this.GetDerivedStats();
        const vital = [];
        vital.push(Localization_lu("Vital Part Controls"));
        for (let i = 0; i < this.GetCockpits().GetNumberOfCockpits(); i++) {
            vital.push(Localization_lu("Seat #", i + 1) + ": " + Localization_lu(this.GetCockpits().GetCockpit(i).GetName()));
        }
        if (derived.FuelUses > 0) {
            vital.push(Localization_lu("Vital Part Fuel Tanks"));
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfEngines(); i++) {
            if (this.GetEngines().GetEngine(i).GetUsePushPull()) {
                vital.push(Localization_lu("Vital Part Engine Pusher", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(Localization_lu("Vital Part Oil Tank Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(Localization_lu("Vital Part Oil Cooler Pusher", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(Localization_lu("Vital Part Oil Pan Pusher", i + 1));
                }
                vital.push(Localization_lu("Vital Part Engine Puller", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(Localization_lu("Vital Part Oil Tank Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(Localization_lu("Vital Part Oil Cooler Puller", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(Localization_lu("Vital Part Oil Pan Puller", i + 1));
                }
            }
            else {
                vital.push(Localization_lu("Vital Part Engine", i + 1));
                if (this.GetEngines().GetEngine(i).GetHasOilTank()) {
                    vital.push(Localization_lu("Vital Part Oil Tank", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilCooler()) {
                    vital.push(Localization_lu("Vital Part Oil Cooler", i + 1));
                }
                if (this.GetEngines().GetEngine(i).GetHasOilPan()) {
                    vital.push(Localization_lu("Vital Part Oil Pan", i + 1));
                }
            }
        }
        for (let i = 0; i < this.GetEngines().GetNumberOfRadiators(); i++) {
            vital.push(Localization_lu("Vital Part Radiator", i + 1));
        }
        if (this.IsElectrics()) {
            vital.push(Localization_lu("Vital Part Electrics"));
        }
        const wlist = this.GetWeapons().GetWeaponList();
        for (let i = 0; i < this.GetWeapons().GetWeaponSets().length; i++) {
            vital.push(Localization_lu("Vital Part Weapon Set", i + 1, wlist[this.GetWeapons().GetWeaponSets()[i].GetWeaponSelected()].abrv));
        }
        if (this.GetLandingGear().IsVital()) {
            vital.push(Localization_lu("Vital Part Landing Gear"));
        }
        if (this.rotor.GetTailRotor()) {
            vital.push(Localization_lu("Vital Part Tail Rotor"));
        }
        return vital;
    }
    SetStorage(use) {
        this.use_storage = use;
    }
    Reset() {
        this.fromJSON(JSON.parse(this.reset_json), false);
    }
    GetVersion() {
        return this.version;
    }
    GetCommunicationName() {
        return this.accessories.GetCommunicationName();
    }
    GetAttackList() {
        return this.cockpits.GetAttackList();
    }
    GetVisibilityList() {
        return this.cockpits.GetVisibilityList();
    }
    GetStressList() {
        return this.cockpits.GetStressList();
    }
    GetEscapeList() {
        return this.cockpits.GetEscapeList();
    }
    GetCrashList() {
        return this.cockpits.GetCrashList();
    }
    GetReliabilityList() {
        return this.engines.GetReliabilityList();
    }
    GetMinIAF() {
        return this.engines.GetMinIAF();
    }
    GetMaxIAF() {
        return this.engines.GetMaxIAF();
    }
    GetMinAltitude() {
        return this.engines.GetMinAltitude();
    }
    GetMaxAltitude() {
        return this.engines.GetMaxAltitude();
    }
    GetGearName() {
        return this.gear.GetGearName();
    }
    GetIsFlammable() {
        return this.frames.GetIsFlammable() || this.wings.GetIsFlammable() || this.engines.GetIsFlammable();
    }
    GetAircraftType() {
        return this.aircraft_type;
    }
    GetEra() {
        return this.era;
    }
    GetCockpits() {
        return this.cockpits;
    }
    GetPassengers() {
        return this.passengers;
    }
    GetEngines() {
        return this.engines;
    }
    GetPropeller() {
        return this.propeller;
    }
    GetFrames() {
        return this.frames;
    }
    GetWings() {
        return this.wings;
    }
    GetStabilizers() {
        return this.stabilizers;
    }
    GetControlSurfaces() {
        return this.controlsurfaces;
    }
    GetReinforcements() {
        return this.reinforcements;
    }
    GetFuel() {
        return this.fuel;
    }
    GetMunitions() {
        return this.munitions;
    }
    GetCargoAndPassengers() {
        return this.cargo;
    }
    GetLandingGear() {
        return this.gear;
    }
    GetAccessories() {
        return this.accessories;
    }
    GetOptimization() {
        return this.optimization;
    }
    GetStats() {
        return this.stats;
    }
    GetWeapons() {
        return this.weapons;
    }
    IsElectrics() {
        return this.engines.IsElectrics() || this.accessories.IsElectrics() || this.cockpits.IsElectrics();
    }
    GetUsed() {
        return this.used;
    }
    GetRotor() {
        return this.rotor;
    }
    GetAlter() {
        return this.alter;
    }
    GetElectrics() {
        let value = { storage: 0, equipment: [] };
        value = MergeElectrics(value, this.accessories.GetElectrics());
        value = MergeElectrics(value, this.wings.GetElectrics());
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
            let ac = parseInt(a.charge);
            if (a.charge == "-")
                ac = 0;
            let bc = parseInt(b.charge);
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
        let have_generation = false;
        //Add + symbols
        for (const eq of value.equipment) {
            const chg = parseInt(eq.charge);
            if (!isNaN(chg) && chg > 0) {
                eq.charge = "+" + eq.charge;
                have_generation = true;
            }
        }
        if (value.equipment.length > 0
            && value.storage <= 0
            && !have_generation
            && this.stats.warnings.findIndex((value) => { return value.source == Localization_lu("Insufficient Charge"); }) == -1) {
            this.stats.warnings.push({
                source: Localization_lu("Insufficient Charge"), warning: Localization_lu("Insufficient Charge Warning"),
                color: WARNING_COLOR.RED,
            });
        }
        return value;
    }
}

;// CONCATENATED MODULE: ./src/disp/Tools.ts
var internal_id = 0;
// Function to download data to a file
function download(data, filename, type) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}
function copyStringToClipboard(str) {
    // Create new element
    const el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}
function GenerateID() {
    internal_id++;
    return "internal_id_" + internal_id.toString();
}
function Tools_CreateFlexSection(elem) {
    const fs = {
        div0: document.createElement("DIV"), div1: document.createElement("DIV"),
        div2: document.createElement("DIV")
    };
    fs.div0.classList.add("flex-container-o");
    fs.div1.classList.add("flex-container-i");
    fs.div2.classList.add("flex-container-i");
    fs.div0.appendChild(fs.div1);
    fs.div0.appendChild(fs.div2);
    elem.appendChild(fs.div0);
    return fs;
}
function Tools_CreateTH(row, content) {
    const th = document.createElement("TH");
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}
function CreateTD(row, content) {
    const th = document.createElement("TD");
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}
function Tools_CreateInput(txt, elem, table, br = true) {
    const span = document.createElement("SPAN");
    const txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    elem.setAttribute("type", "number");
    elem.min = "0";
    elem.step = "1";
    elem.valueAsNumber = 0;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function Tools_FlexInput(txt, inp, fs) {
    const lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "number");
    inp.min = "0";
    inp.step = "1";
    inp.valueAsNumber = 0;
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexText(txt, inp, fs) {
    const lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "text");
    inp.value = "Default";
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function FlexDisplay(txt, inp, fs) {
    const lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}
function Tools_FlexSelect(txt, sel, fs) {
    const lbl = document.createElement("LABEL");
    sel.id = GenerateID();
    lbl.htmlFor = sel.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    sel.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(sel);
}
function Tools_CreateCheckbox(txt, elem, table, br = true) {
    const span = document.createElement("SPAN");
    const txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    elem.setAttribute("type", "checkbox");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function Tools_CreateSelect(txt, elem, table, br = true) {
    const span = document.createElement("SPAN");
    const txtSpan = document.createElement("LABEL");
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateText(txt, elem, table, br = true) {
    const span = document.createElement("SPAN");
    const lbl = document.createElement("LABEL");
    elem.id = GenerateID();
    lbl.htmlFor = elem.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    elem.setAttribute("type", "text");
    elem.value = "Default";
    span.appendChild(lbl);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}
function CreateButton(txt, elem, table, br = true) {
    const span = document.createElement("SPAN");
    const txtSpan = document.createElement("LABEL");
    elem.hidden = true;
    elem.id = GenerateID();
    elem.textContent = txt;
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    txtSpan.classList.add("lbl_action");
    txtSpan.classList.add("btn_th");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br) {
        table.appendChild(document.createElement("BR"));
        table.appendChild(document.createElement("BR"));
    }
}
function Tools_FlexCheckbox(txt, inp, fs) {
    const lbl = document.createElement("LABEL");
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.id = GenerateID();
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "checkbox");
    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    const lbl2 = document.createElement("LABEL");
    const span = document.createElement("SPAN");
    span.appendChild(lbl2);
    span.appendChild(inp);
    fs.div2.appendChild(span);
    return lbl;
}
function FlexLabel(txt, div1) {
    const lbl = document.createElement("LABEL");
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
    return lbl;
}
function FlexLabels(txtL, txtR, fs) {
    const lbl = document.createElement("LABEL");
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txtL;
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    const lbl2 = document.createElement("LABEL");
    lbl2.style.marginLeft = "0.25em";
    lbl2.style.marginRight = "0.5em";
    lbl2.textContent = txtR;
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
    return [lbl, lbl2];
}
function Tools_FlexSpace(fs) {
    const lbl = document.createElement("LABEL");
    lbl.textContent = " ";
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    const lbl2 = document.createElement("LABEL");
    lbl2.textContent = " ";
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}
function Tools_insertRow(frag) {
    const row = document.createElement("TR");
    frag.append(row);
    return row;
}
function insertCell(frag) {
    const cell = document.createElement("TD");
    frag.append(cell);
    return cell;
}
function BlinkBad(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_b");
}
function BlinkGood(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_g");
}
function BlinkNeutral(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_n");
}
function BlinkNone(elem) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
}
var enable_anim = false;
function SetAnimationEnabled(enable) {
    enable_anim = enable;
}
function Tools_BlinkIfChanged(elem, str, positive_good = null) {
    if (enable_anim) {
        if (elem.textContent != str) {
            if (positive_good == null) {
                BlinkNeutral(elem);
            }
            else {
                const positive = parseInt(elem.textContent) < parseInt(str);
                if (positive_good && positive || (!positive_good && !positive)) {
                    BlinkGood(elem);
                }
                else {
                    BlinkBad(elem);
                }
            }
        }
        else {
            BlinkNone(elem);
        }
    }
    elem.textContent = str;
}
function _arrayBufferToString(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
function _stringToArrayBuffer(str) {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes.buffer;
}
const loadJSON = (path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
};

;// CONCATENATED MODULE: ./src/disp/Derived.ts






class Derived_HTML {
    constructor(tbl) {
        const fragment = document.createDocumentFragment();
        const row0 = Tools_insertRow(fragment);
        const name_cell = row0.insertCell();
        // Aircraft Name
        name_cell.colSpan = 2;
        this.name_inp = document.createElement("INPUT");
        this.name_inp.defaultValue = Localization_lu("Derived Aircraft Name");
        name_cell.appendChild(this.name_inp);
        Tools_CreateTH(row0, Localization_lu("Stat Cost"));
        // Aircraft Cost
        this.cost_cell = row0.insertCell();
        Tools_CreateTH(row0, Localization_lu("Stat Upkeep"));
        // Aircraft Upkeep
        this.upkeep_cell = row0.insertCell();
        // Rules Version
        Tools_CreateTH(row0, Localization_lu("Derived Era Report"));
        this.version_cell = row0.insertCell();
        const row1 = Tools_insertRow(fragment);
        Tools_CreateTH(row1, Localization_lu("Derived Mass Variations"));
        Tools_CreateTH(row1, Localization_lu("Derived Boost"));
        Tools_CreateTH(row1, Localization_lu("Derived Handling"));
        Tools_CreateTH(row1, Localization_lu("Derived Rate of Climb"));
        Tools_CreateTH(row1, Localization_lu("Derived Stall Speed"));
        Tools_CreateTH(row1, Localization_lu("Derived Top Speed"));
        Tools_CreateTH(row1, Localization_lu("Derived Vital Components")).colSpan = 2;
        this.bomb_row2 = Tools_insertRow(fragment);
        Tools_CreateTH(this.bomb_row2, Localization_lu("Derived Full Fuel with Bombs"));
        this.boost_fullwB = this.bomb_row2.insertCell();
        this.hand_fullwB = this.bomb_row2.insertCell();
        this.roc_fullwB = this.bomb_row2.insertCell();
        this.ss_fullwB = this.bomb_row2.insertCell();
        this.ts_fullwB = this.bomb_row2.insertCell();
        this.vital_components = this.bomb_row2.insertCell();
        this.vital_components.rowSpan = 3;
        this.vital_components.colSpan = 3;
        this.bomb_row1 = Tools_insertRow(fragment);
        Tools_CreateTH(this.bomb_row1, Localization_lu("Derived Half Fuel with Bombs"));
        this.boost_halfwB = this.bomb_row1.insertCell();
        this.hand_halfwB = this.bomb_row1.insertCell();
        this.roc_halfwB = this.bomb_row1.insertCell();
        this.ss_halfwB = this.bomb_row1.insertCell();
        this.ts_halfwB = this.bomb_row1.insertCell();
        this.full_row = Tools_insertRow(fragment);
        Tools_CreateTH(this.full_row, Localization_lu("Derived Full Fuel"));
        this.boost_full = this.full_row.insertCell();
        this.hand_full = this.full_row.insertCell();
        this.roc_full = this.full_row.insertCell();
        this.ss_full = this.full_row.insertCell();
        this.ts_full = this.full_row.insertCell();
        const half = Tools_insertRow(fragment);
        Tools_CreateTH(half, Localization_lu("Derived Half Fuel"));
        this.boost_half = half.insertCell();
        this.hand_half = half.insertCell();
        this.roc_half = half.insertCell();
        this.ss_half = half.insertCell();
        this.ts_half = half.insertCell();
        const empty = Tools_insertRow(fragment);
        Tools_CreateTH(empty, Localization_lu("Derived Empty Fuel"));
        this.boost_empty = empty.insertCell();
        this.hand_empty = empty.insertCell();
        this.roc_empty = empty.insertCell();
        this.ss_empty = empty.insertCell();
        this.ts_empty = empty.insertCell();
        const row7 = Tools_insertRow(fragment);
        Tools_CreateTH(row7, Localization_lu("Derived Propulsion")).colSpan = 2;
        Tools_CreateTH(row7, Localization_lu("Derived Aerodynamics")).colSpan = 2;
        Tools_CreateTH(row7, Localization_lu("Derived Survivability")).colSpan = 2;
        Tools_CreateTH(row7, Localization_lu("Derived Crew Members")).colSpan = 2;
        const row8 = Tools_insertRow(fragment);
        Tools_CreateTH(row8, Localization_lu("Derived Dropoff"));
        this.dropoff_cell = row8.insertCell();
        Tools_CreateTH(row8, Localization_lu("Derived Stability"));
        this.stability_cell = row8.insertCell();
        Tools_CreateTH(row8, Localization_lu("Derived Crash Safety"));
        this.crashsafety_cell = row8.insertCell();
        Tools_CreateTH(row8, Localization_lu("Derived Crew/Passengers"));
        this.crew_cell = row8.insertCell();
        const row9 = Tools_insertRow(fragment);
        Tools_CreateTH(row9, Localization_lu("Derived Overspeed"));
        this.overspeed_cell = row9.insertCell();
        Tools_CreateTH(row9, Localization_lu("Derived Energy Loss"));
        this.eloss_cell = row9.insertCell();
        Tools_CreateTH(row9, Localization_lu("Stat Toughness"));
        this.toughness_cell = row9.insertCell();
        Tools_CreateTH(row9, Localization_lu("Stat Visibility"));
        this.visibility_cell = row9.insertCell();
        const row10 = Tools_insertRow(fragment);
        Tools_CreateTH(row10, Localization_lu("Derived Fuel Uses"));
        this.maxfuel_cell = row10.insertCell();
        this.turnbleed_label = Tools_CreateTH(row10, Localization_lu("Derived Turn Bleed"));
        this.turnbleed_cell = row10.insertCell();
        Tools_CreateTH(row10, Localization_lu("Stat Max Strain"));
        this.mxstrain_cell = row10.insertCell();
        Tools_CreateTH(row10, Localization_lu("Derived Attack Modifier"));
        this.attack_cell = row10.insertCell();
        const row11 = Tools_insertRow(fragment);
        Tools_CreateTH(row11, Localization_lu("Stat Reliability"));
        this.reliability_cell = row11.insertCell();
        Tools_CreateTH(row11, Localization_lu("Derived Landing Gear"));
        this.landing_cell = row11.insertCell();
        Tools_CreateTH(row11, Localization_lu("Derived Communications"));
        this.communications_cell = row11.insertCell();
        Tools_CreateTH(row11, Localization_lu("Derived Escape"));
        this.escape_cell = row11.insertCell();
        const row12 = Tools_insertRow(fragment);
        Tools_CreateTH(row12, Localization_lu("Derived Ideal Engine Altitude"));
        this.maxalt_cell = row12.insertCell();
        Tools_CreateTH(row12, Localization_lu("Derived Is Flammable Question"));
        this.flammable_cell = row12.insertCell();
        this.desc_cell = row12.insertCell();
        this.desc_cell.colSpan = 2;
        Tools_CreateTH(row12, Localization_lu("Stat Flight Stress"));
        this.flightstress_cell = row12.insertCell();
        const head_row = Tools_insertRow(fragment);
        const body_row = Tools_insertRow(fragment);
        this.weapon_head = Tools_CreateTH(head_row, Localization_lu("Derived Weapon Systems"));
        this.weapon_head.colSpan = 6;
        this.weapon_cell = body_row.insertCell();
        this.weapon_cell.colSpan = 6;
        this.warning_head = Tools_CreateTH(Tools_insertRow(fragment), Localization_lu("Derived Special Rules"));
        this.warning_head.colSpan = 6;
        this.warning_cell = Tools_insertRow(fragment).insertCell();
        this.warning_cell.colSpan = 6;
        const electric_head = Tools_CreateTH(head_row, Localization_lu("Derived Electrics"));
        electric_head.colSpan = 2;
        this.electric_cell = body_row.insertCell();
        this.electric_cell.colSpan = 2;
        this.electric_cell.rowSpan = 3;
        tbl.appendChild(fragment);
        this.tbl = tbl;
    }
    UpdateDisplay(acft, stats, derived) {
        this.name_inp.value = acft.name;
        while (this.version_cell.children.length > 0) {
            this.version_cell.removeChild(this.version_cell.children[0]);
        }
        this.version_cell.className = "tooltip";
        const era_t_div = document.createElement("DIV");
        era_t_div.className = "tooltiptext";
        let div_text = document.createElement("P");
        div_text.textContent = Localization_lu("Derived Problematic Parts");
        era_t_div.appendChild(div_text);
        const plane_era = era2numHl(acft.GetEra().GetSelectedText());
        var era_break = 0;
        for (let part of stats.era) {
            const part_era = era2numHl(part.era);
            if (part_era > plane_era) {
                era_break += part_era - plane_era;
                let part_text = document.createElement("P");
                part_text.textContent = part.name + ": " + part.era;
                era_t_div.appendChild(part_text);
            }
        }
        if (era_break == 0) {
            let part_text = document.createElement("P");
            part_text.textContent = Localization_lu("None");
            era_t_div.appendChild(part_text);
        }
        const era_p_elem = document.createElement("P");
        era_p_elem.textContent = Localization_lu(acft.GetEra().GetSelectedText());
        if (era_break == 0)
            era_p_elem.className = "green";
        else if (era_break > 2)
            era_p_elem.className = "red";
        else
            era_p_elem.className = "yellow";
        this.version_cell.appendChild(era_p_elem);
        this.version_cell.appendChild(era_t_div);
        this.cost_cell.textContent = stats.cost.toString() + "þ ";
        if (acft.GetUsed().GetEnabled()) {
            this.cost_cell.textContent += " (" + Math.floor(1.0e-6 + stats.cost / 2).toString() + "þ " + Localization_lu("Price Word Used") + ")";
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
            //Turn Bleed
            this.turnbleed_label.textContent = Localization_lu("Derived Turn Bleed wB");
            this.turnbleed_cell.textContent = string_StringFmt.Format("{0} ({1})", derived.TurnBleed, derived.TurnBleedwBombs);
        }
        else {
            this.bomb_row1.hidden = true;
            this.bomb_row2.hidden = true;
            this.full_row.appendChild(this.vital_components);
            this.vital_components.rowSpan = 3;
            //Turn Bleed
            this.turnbleed_label.textContent = Localization_lu("Derived Turn Bleed");
            this.turnbleed_cell.textContent = string_StringFmt.Format("{0}", derived.TurnBleed);
        }
        this.dropoff_cell.textContent = derived.Dropoff.toString();
        this.overspeed_cell.textContent = derived.Overspeed.toString();
        this.maxfuel_cell.textContent = (Math.floor(1.0e-6 + derived.FuelUses * 10) / 10).toString();
        if (acft.GetIsFlammable())
            this.flammable_cell.textContent = Localization_lu("Yes");
        else
            this.flammable_cell.textContent = Localization_lu("No");
        this.stability_cell.textContent = derived.Stabiilty.toString();
        this.eloss_cell.textContent = derived.EnergyLoss.toString();
        //Turn bleed done in bomb mass section because affected by it.
        this.landing_cell.textContent = acft.GetGearName();
        this.maxalt_cell.textContent = acft.GetMinAltitude().toString() + "-" + acft.GetMaxAltitude().toString();
        this.reliability_cell.textContent = string_StringFmt.Join(", ", acft.GetReliabilityList());
        this.toughness_cell.textContent = derived.Toughness.toString();
        this.mxstrain_cell.textContent = derived.MaxStrain.toString();
        this.escape_cell.textContent = string_StringFmt.Join(", ", acft.GetEscapeList());
        this.crashsafety_cell.textContent = stats.crashsafety.toString();
        this.crew_cell.textContent = acft.GetCockpits().GetNumberOfCockpits().toString() + "/" + (acft.GetPassengers().GetSeats() + acft.GetPassengers().GetBeds()).toString();
        this.flightstress_cell.textContent = Stress2Str(acft.GetStressList());
        this.visibility_cell.textContent = string_StringFmt.Join(", ", acft.GetVisibilityList());
        this.attack_cell.textContent = string_StringFmt.Join(", ", acft.GetAttackList());
        this.communications_cell.textContent = acft.GetCommunicationName();
        while (this.electric_cell.childElementCount > 0) {
            this.electric_cell.removeChild(this.electric_cell.firstChild);
        }
        const electrics = acft.GetElectrics();
        const elec_fs = Tools_CreateFlexSection(this.electric_cell);
        if (electrics.storage > 0) {
            FlexLabels(Localization_lu("Derived Battery"), electrics.storage.toString(), elec_fs);
        }
        for (let equip of electrics.equipment) {
            FlexLabels(equip.source, equip.charge, elec_fs);
        }
        var vital = "";
        const vlist = acft.VitalComponentList();
        for (let v of vlist) {
            vital += v + "<br/>";
        }
        this.vital_components.innerHTML = vital;
        const wlist = acft.GetWeapons().GetWeaponList();
        const dlist = acft.GetWeapons().GetDirectionList();
        const bombs = acft.GetMunitions().GetBombCount();
        const rockets = acft.GetMunitions().GetRocketCount();
        var internal = acft.GetMunitions().GetInternalBombCount();
        var weaphtml = "";
        if (bombs > 0) {
            const int_bomb = Math.min(bombs, internal);
            const ext_bomb = Math.max(0, bombs - int_bomb);
            if (int_bomb > 0)
                weaphtml += Localization_lu(" Bomb Mass Internally.", int_bomb);
            if (ext_bomb > 0)
                weaphtml += Localization_lu(" Bomb Mass Externally.", ext_bomb);
            if (int_bomb > 0) {
                const mib = Math.min(int_bomb, acft.GetMunitions().GetMaxBombSize());
                weaphtml += (Localization_lu("Largest Internal Bomb", mib.toString()));
            }
            internal -= int_bomb;
            weaphtml += "<br/>";
        }
        if (rockets > 0) {
            const int_rock = Math.min(rockets, internal);
            const ext_rock = Math.max(0, rockets - int_rock);
            if (int_rock > 0)
                weaphtml += Localization_lu(" Rocket Mass Internally.", int_rock);
            if (ext_rock > 0)
                weaphtml += Localization_lu(" Rocket Mass Externally.", ext_rock);
            weaphtml += "<br/>";
        }
        for (let w of acft.GetWeapons().GetWeaponSets()) {
            weaphtml += WeaponString(w, wlist, dlist);
            weaphtml += "<br\>";
        }
        this.weapon_cell.innerHTML = weaphtml;
        stats.warnings.sort((a, b) => { return a.color - b.color; });
        var warnhtml = "";
        for (let w of stats.warnings) {
            switch (w.color) {
                case WARNING_COLOR.RED:
                    warnhtml += "<div style=\"color:#FF0000;\">";
                    break;
                case WARNING_COLOR.YELLOW:
                    warnhtml += "<div style=\"color:#FFFF00;\">";
                    break;
                case WARNING_COLOR.WHITE:
                default:
                    warnhtml += "<div style=\"color:var(--inp_txt_color);;\">";
                    break;
            }
            warnhtml += w.source + ":  " + w.warning + "</div>";
        }
        this.warning_cell.innerHTML = warnhtml;
        var description = "";
        const num_wings = acft.GetWings().GetWingList().length;
        if (num_wings == 1) {
            const deck = acft.GetWings().GetWingList()[0].deck;
            if (deck < WING_DECK.MID) {
                description += "High-Wing Monoplane ";
            }
            else if (deck == WING_DECK.MID) {
                description += "Mid-Wing Monoplane ";
            }
            else {
                description += "Low-Wing Monoplane ";
            }
        }
        else {
            const is_sesqui = acft.GetWings().GetIsSesquiplane().is;
            if (is_sesqui) {
                if (num_wings == 2)
                    description += "Sesquiplane ";
                else
                    description += "Sesqui-" + this.prefix(num_wings);
            }
            else if (acft.GetWings().GetTandem()) {
                if (num_wings == 2 && acft.GetWings().GetClosed())
                    description += "Annular Monoplane ";
                else
                    description += "Tandem " + this.prefix(num_wings);
            }
            else {
                description += this.prefix(num_wings);
            }
        }
        if (acft.GetFrames().GetFlyingWing()) {
            description += "Flying Wing ";
        }
        else if (acft.GetFrames().CanFlyingWing()) {
            description += "Lifting Body ";
        }
        else if (num_wings == 0) {
            description += "Falling Rock ";
        }
        this.desc_cell.textContent = description;
    }
    prefix(num_wings) {
        switch (num_wings) {
            case 0:
                return "";
            case 1:
                return "Monoplane ";
            case 2:
                return "Biplane ";
            case 3:
                return "Triplane ";
            case 4:
                return "Quadruplane ";
            case 5:
                return "Pentaplane ";
            case 6:
                return "Hexaplane ";
            case 7:
                return "Heptaplane ";
            case 8:
                return "Octoplane ";
            case 9:
                return "Nonaplane ";
            case 10:
                return "Decaplane ";
            case 11:
                return "Undecaplane ";
            case 12:
                return "Duodecaplane ";
            case 13:
                return "Tredecaplane ";
            case 14:
                return "Quattuordecaplane ";
            case 15:
                return "Quindecaplane ";
            case 16:
                return "Sexdecaplane ";
            case 17:
                return "Septendecaplane ";
            case 18:
                return "Octodecaplane ";
            case 19:
                return "Novendecaplane ";
            case 20:
                return "Vigintiplane ";
            default:
                return "Window Blinds ";
        }
    }
    GetName() {
        return this.name_inp.value;
    }
    SetName(name) {
        this.name_inp.value = name;
    }
    SetShowBombs(set) {
        this.show_bombs = set;
    }
}

;// CONCATENATED MODULE: ./src/lz/lz-string.ts
// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/lz-string/testing.html
//
// LZ-based compression algorithm, version 1.4.4
var LZString = (function () {
    // private property
    var f = String.fromCharCode;
    var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
    var baseReverseDic = {};
    function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
            baseReverseDic[alphabet] = {};
            for (let i = 0; i < alphabet.length; i++) {
                baseReverseDic[alphabet][alphabet.charAt(i)] = i;
            }
        }
        return baseReverseDic[alphabet][character];
    }
    var LZString = {
        compressToBase64: function (input) {
            if (input == null)
                return "";
            var res = LZString._compress(input, 6, function (a) { return keyStrBase64.charAt(a); });
            switch (res.length % 4) { // To produce valid Base64
                default: // When could this happen ?
                case 0: return res;
                case 1: return res + "===";
                case 2: return res + "==";
                case 3: return res + "=";
            }
        },
        decompressFromBase64: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrBase64, input.charAt(index)); });
        },
        compressToUTF16: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 15, function (a) { return f(a + 32); }) + " ";
        },
        decompressFromUTF16: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 16384, function (index) { return compressed.charCodeAt(index) - 32; });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function (uncompressed) {
            var compressed = LZString.compress(uncompressed);
            var buf = new Uint8Array(compressed.length * 2); // 2 bytes per character
            for (let i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
                var current_value = compressed.charCodeAt(i);
                buf[i * 2] = current_value >>> 8;
                buf[i * 2 + 1] = current_value % 256;
            }
            return buf;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function (compressed) {
            if (compressed === null || compressed === undefined) {
                return LZString.decompress(compressed);
            }
            else {
                var buf = new Array(compressed.length / 2); // 2 bytes per character
                for (let i = 0, TotalLen = buf.length; i < TotalLen; i++) {
                    buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
                }
                var result = [];
                buf.forEach(function (c) {
                    result.push(f(c));
                });
                return LZString.decompress(result.join(''));
            }
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            return LZString._compress(input, 6, function (a) { return keyStrUriSafe.charAt(a); });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function (input) {
            if (input == null)
                return "";
            if (input == "")
                return null;
            input = input.replace(/ /g, "+");
            return LZString._decompress(input.length, 32, function (index) { return getBaseValue(keyStrUriSafe, input.charAt(index)); });
        },
        compress: function (uncompressed) {
            return LZString._compress(uncompressed, 16, function (a) { return f(a); });
        },
        _compress: function (uncompressed, bitsPerChar, getCharFromInt) {
            if (uncompressed == null)
                return "";
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, // Compensate for the first entry which should not count
            context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
            for (ii = 0; ii < uncompressed.length; ii += 1) {
                context_c = uncompressed.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc;
                }
                else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = (context_data_val << 1) | value;
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = (context_data_val << 1) | (value & 1);
                                if (context_data_position == bitsPerChar - 1) {
                                    context_data_position = 0;
                                    context_data.push(getCharFromInt(context_data_val));
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn == 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    }
                    else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }
            // Output the code for w.
            if (context_w !== "") {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = (context_data_val << 1) | value;
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = (context_data_val << 1) | (value & 1);
                            if (context_data_position == bitsPerChar - 1) {
                                context_data_position = 0;
                                context_data.push(getCharFromInt(context_data_val));
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn == 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = (context_data_val << 1) | (value & 1);
                        if (context_data_position == bitsPerChar - 1) {
                            context_data_position = 0;
                            context_data.push(getCharFromInt(context_data_val));
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
            }
            // Mark the end of the stream
            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = (context_data_val << 1) | (value & 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
            // Flush the last char
            while (true) {
                context_data_val = (context_data_val << 1);
                if (context_data_position == bitsPerChar - 1) {
                    context_data.push(getCharFromInt(context_data_val));
                    break;
                }
                else
                    context_data_position++;
            }
            return context_data.join('');
        },
        decompress: function (compressed) {
            if (compressed == null)
                return "";
            if (compressed == "")
                return null;
            return LZString._decompress(compressed.length, 32768, function (index) { return compressed.charCodeAt(index); });
        },
        _decompress: function (length, resetValue, getNextValue) {
            var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
            for (i = 0; i < 3; i += 1) {
                dictionary[i] = i;
            }
            bits = 0;
            maxpower = Math.pow(2, 2);
            power = 1;
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch (next = bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position == 0) {
                            data.position = resetValue;
                            data.val = getNextValue(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = c;
            result.push(c);
            while (true) {
                if (data.index > length) {
                    return "";
                }
                bits = 0;
                maxpower = Math.pow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position == 0) {
                        data.position = resetValue;
                        data.val = getNextValue(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position == 0) {
                                data.position = resetValue;
                                data.val = getNextValue(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result.join('');
                }
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
                if (dictionary[c]) {
                    entry = dictionary[c];
                }
                else {
                    if (c === dictSize) {
                        entry = w + w.charAt(0);
                    }
                    else {
                        return null;
                    }
                }
                result.push(entry);
                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;
                w = entry;
                if (enlargeIn == 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
            }
        }
    };
    return LZString;
})();

;// CONCATENATED MODULE: ./src/JSON2CSV/json2csv.ts
/**
*
* CSVJSON.json2csv(data, options)
*
* Converts JSON to CSV
*
* Available options:
*  - separator: Character which acts as separator. For CSV use a comma (,).
*               For TSV use a tab (\t).
*  - flatten: Boolean indicating whether to flatten nested arrays or not.
*             Optional. Default false.
*  - output_csvjson_variant: Boolean indicating whether to output objects and
*             arrays as is as per the CSVJSON format variant. Default is false.
*
* The MIT License (MIT)
*
* Copyright (c) 2014 Martin Drapeau
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
class JSON2CSV {
    constructor() {
        this.errorMissingSeparator = 'Missing separator option.';
        this.errorEmpty = 'JSON is empty.';
        this.errorEmptyHeader = 'Could not detect header. Ensure first row contains your column headers.';
        this.errorNotAnArray = 'Your JSON must be an array or an object.';
        this.errorItemNotAnObject = 'Item in array is not an object: {0}';
    }
    flattenArray(array, ancestors = []) {
        function combineKeys(a, b) {
            let result = a.slice(0);
            if (!Array.isArray(b))
                return result;
            for (let i = 0; i < b.length; i++)
                if (result.indexOf(b[i]) === -1)
                    result.push(b[i]);
            return result;
        }
        function extend(target, source) {
            target = target || {};
            for (let prop in source) {
                if (typeof source[prop] === 'object') {
                    target[prop] = extend(target[prop], source[prop]);
                }
                else {
                    target[prop] = source[prop];
                }
            }
            return target;
        }
        var rows = [];
        for (let i = 0; i < array.length; i++) {
            let o = array[i];
            let row = {};
            let orows = {};
            let count = 1;
            if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
                throw this.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
            let keys = this.getKeys(o);
            for (let k = 0; k < keys.length; k++) {
                let value = o[keys[k]], keyChain = combineKeys(ancestors, [keys[k]]), key = keyChain.join('.');
                if (Array.isArray(value)) {
                    orows[key] = this.flattenArray(value, keyChain);
                    count += orows[key].length;
                }
                else {
                    row[key] = value;
                }
            }
            if (count == 1) {
                rows.push(row);
            }
            else {
                let keys = this.getKeys(orows);
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    for (let r = 0; r < orows[key].length; r++) {
                        rows.push(extend(extend({}, row), orows[key][r]));
                    }
                }
            }
        }
        return rows;
    }
    isObject(o) {
        return o && typeof o == 'object';
    }
    getKeys(o) {
        if (!this.isObject(o))
            return [];
        return Object.keys(o);
    }
    convert(data, options) {
        options || (options = {});
        if (!this.isObject(data))
            throw this.errorNotAnArray;
        if (!Array.isArray(data))
            data = [data];
        var separator = options.separator || ',';
        if (!separator)
            throw this.errorMissingSeparator;
        var flatten = options.flatten || false;
        if (flatten)
            data = this.flattenArray(data);
        var allKeys = [];
        var allRows = [];
        for (let i = 0; i < data.length; i++) {
            let o = data[i];
            let row = {};
            if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
                throw this.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
            let keys = this.getKeys(o);
            for (let k = 0; k < keys.length; k++) {
                let key = keys[k];
                if (allKeys.indexOf(key) === -1)
                    allKeys.push(key);
                let value = o[key];
                if (value === undefined && value === null)
                    continue;
                if (typeof value == 'string') {
                    row[key] = '"' + value.replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"';
                    if (options.output_csvjson_variant)
                        row[key] = row[key].replace(/\n/g, '\\n');
                }
                else {
                    row[key] = JSON.stringify(value);
                    if (!options.output_csvjson_variant && (this.isObject(value) || Array.isArray(value)))
                        row[key] = '"' + row[key].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
                }
            }
            allRows.push(row);
        }
        var keyValues = [];
        for (let i = 0; i < allKeys.length; i++) {
            keyValues.push('"' + allKeys[i].replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"');
        }
        var csv = keyValues.join(separator) + '\n';
        for (let r = 0; r < allRows.length; r++) {
            let row = allRows[r];
            let rowArray = [];
            for (let k = 0; k < allKeys.length; k++) {
                let key = allKeys[k];
                rowArray.push(row[key] || (options.output_csvjson_variant ? 'null' : ''));
            }
            csv += rowArray.join(separator) + (r < allRows.length - 1 ? '\n' : '');
        }
        return csv;
    }
}

;// CONCATENATED MODULE: ./src/parts.json
const parts_namespaceObject = JSON.parse('{"version":"12.5","era":{"options":[{"name":"Pioneer","liftbleed":30,"maxbomb":0.166666666666,"cost":-2,"cant_lift":4,"pitchstab":0},{"name":"WWI","liftbleed":25,"maxbomb":0.2,"cant_lift":3,"pitchstab":0,"cost":0},{"name":"Roaring 20s","liftbleed":22,"maxbomb":0.25,"cost":5,"cant_lift":1,"pitchstab":0},{"name":"Coming Storm","liftbleed":22,"maxbomb":0.333333333333,"cost":10,"cant_lift":0,"pitchstab":2},{"name":"WWII","liftbleed":20,"maxbomb":0.333333333333,"cost":15,"cant_lift":0,"pitchstab":2},{"name":"Last Hurrah","liftbleed":18,"maxbomb":0.5,"cost":20,"cant_lift":0,"pitchstab":2}]},"cockpit":{"options":[{"name":"Open","era":"Pioneer","mass":1,"drag":3,"control":0,"escape":2,"cost":0,"flightstress":0,"visibility":1,"exposed":true,"warning":""},{"name":"Windscreen","era":"Pioneer","mass":2,"drag":1,"control":0,"escape":2,"cost":1,"flightstress":0,"visibility":1,"exposed":true,"warning":""},{"name":"Sealed","era":"Pioneer","mass":2,"drag":0,"control":0,"escape":-3,"cost":1,"flightstress":-1,"visibility":-99,"warning":"Sealed Warning","exposed":false},{"name":"Narrow Canopy","era":"WWI","mass":3,"drag":0,"control":0,"escape":0,"cost":3,"flightstress":-1,"visibility":-1,"exposed":false,"warning":""},{"name":"Bubble Canopy","era":"WWII","mass":3,"drag":-3,"control":0,"escape":0,"cost":8,"flightstress":-1,"visibility":0,"exposed":false,"warning":""}],"upgrades":[{"name":"Co-Pilot Controls","era":"Pioneer","mass":0,"drag":0,"control":0,"escape":0,"cost":1,"flightstress":-2,"visibility":0,"warning":"","charge":0},{"name":"Escape Hatch","era":"Pioneer","mass":1,"drag":0,"control":0,"escape":3,"cost":2,"flightstress":0,"visibility":0,"warning":"","charge":0},{"name":"Ejection Seat","era":"Last Hurrah","mass":2,"drag":0,"control":0,"escape":5,"cost":4,"flightstress":0,"visibility":0,"warning":"","charge":0},{"name":"Connectivity","era":"Pioneer","mass":1,"drag":0,"control":0,"escape":0,"cost":0,"flightstress":0,"visibility":0,"warning":"","charge":0},{"name":"Oxygen Mask","era":"WWI","warning":"Oxygen Mask Warning","mass":0,"drag":0,"control":0,"escape":0,"charge":-1,"cost":2,"flightstress":0,"visibility":0},{"name":"Isolated","era":"Pioneer","mass":1,"drag":5,"control":0,"escape":-2,"cost":1,"flightstress":1,"visibility":2,"warning":"Isolated Warning","charge":0}],"safety":[{"name":"Padding","era":"Pioneer","cost":1,"warning":"Injury Reduction Warning","charge":0,"escape":0,"visibility":0,"mass":0},{"name":"Harness","era":"Pioneer","escape":-1,"cost":1,"warning":"Injury Reduction Warning","charge":0,"visibility":0,"mass":0},{"name":"Fast Release System","era":"Coming Storm","escape":2,"cost":1,"warning":"","charge":0,"visibility":0,"mass":0},{"name":"Roll Bar","era":"WWI","mass":2,"warning":"Injury Reduction Warning","charge":0,"escape":0,"visibility":0,"cost":0},{"name":"Flare Slot","era":"Roaring 20s","cost":1,"warning":"Flare Slot Warning","charge":0,"escape":0,"visibility":0,"mass":0},{"name":"Basic Fan","era":"Pioneer","charge":1e-9,"visibility":-1,"warning":"Basic Fan Warning","escape":0,"mass":0,"cost":0}],"gunsights":[{"name":"X1 Collimated Gunsight","era":"WWI","visibility":-1,"attack":1,"cost":2,"warning":"X1 Collimated Gunsight Warning","charge":0},{"name":"Telescopic Gunsight","era":"WWI","visibility":-1,"attack":0,"cost":3,"warning":"Telescopic Gunsight Warning","charge":0},{"name":"Illuminated Reflex Sight","era":"WWI","visibility":-1,"attack":2,"charge":1e-9,"cost":6,"warning":"Illuminated Reflex Sight Warning"},{"name":"Gyro Gunsight","era":"WWII","visibility":-1,"attack":2,"charge":1e-9,"cost":12,"warning":"Gyro Gunsight Warning"}]},"passengers":{},"engines":{"mounts":[{"name":"Tractor","era":"Pioneer","drag":0,"reqsections":1,"pitchstab":0,"visibility":0,"liftbleed":0,"strainfactor":0,"dragfactor":0,"location":"fuselage","powerfactor":1,"helicopter":false,"pushpull":false,"turbine":false,"reqTail":false,"escape":0,"reqED":false},{"name":"Center-Mounted Tractor","era":"Pioneer","drag":0,"reqsections":1,"pitchstab":-2,"visibility":1,"liftbleed":0,"strainfactor":0,"dragfactor":0,"location":"fuselage","reqED":true,"powerfactor":1,"helicopter":false,"pushpull":false,"turbine":false,"reqTail":false,"escape":0},{"name":"Rear-Mounted Pusher","era":"Pioneer","drag":0,"reqsections":1,"pitchstab":-4,"visibility":2,"liftbleed":0,"strainfactor":0,"dragfactor":0,"escape":-2,"location":"fuselage","powerfactor":1,"helicopter":false,"pushpull":false,"turbine":false,"reqTail":false,"reqED":false},{"name":"Center-Mounted Pusher","era":"Pioneer","drag":0,"reqsections":1,"pitchstab":-2,"visibility":2,"liftbleed":0,"strainfactor":0,"dragfactor":0,"escape":-2,"location":"fuselage","reqTail":true,"powerfactor":1,"helicopter":false,"pushpull":false,"turbine":false,"reqED":false},{"name":"Pod","era":"Pioneer","drag":5,"reqsections":1,"pitchstab":0,"visibility":-2,"liftbleed":0,"strainfactor":0,"dragfactor":0,"location":"pod","powerfactor":0.9,"helicopter":false,"pushpull":true,"turbine":false,"reqTail":false,"escape":0,"reqED":false},{"name":"Nacelle (Inside)","era":"Pioneer","drag":0,"reqsections":0,"pitchstab":0,"visibility":0,"liftbleed":1,"strainfactor":0.5,"dragfactor":0,"location":"wing","powerfactor":0.8,"helicopter":false,"pushpull":true,"turbine":false,"reqTail":false,"escape":0,"reqED":false},{"name":"Nacelle (Offset)","era":"Pioneer","drag":0,"reqsections":0,"pitchstab":0,"visibility":0,"liftbleed":0,"strainfactor":0,"dragfactor":1,"location":"wing","powerfactor":0.8,"helicopter":false,"pushpull":true,"turbine":false,"reqTail":false,"escape":0,"reqED":false},{"name":"Channel Tractor","era":"Pioneer","drag":0,"reqsections":0,"pitchstab":0,"visibility":0,"liftbleed":-1,"strainfactor":1,"dragfactor":0,"location":"wing","powerfactor":0.9,"helicopter":false,"pushpull":true,"turbine":false,"reqTail":false,"escape":0,"reqED":false},{"name":"Fuselage Push-Pull","era":"Pioneer","reqsections":2,"pitchstab":-2,"escape":-2,"strainfactor":0,"dragfactor":0,"location":"fuselage","powerfactor":0.9,"helicopter":false,"pushpull":true,"turbine":false,"reqTail":false,"liftbleed":0,"visibility":0,"drag":0,"reqED":false},{"name":"Front Intake","era":"Pioneer","strainfactor":0,"dragfactor":0,"location":"fuselage","powerfactor":1,"helicopter":false,"pushpull":false,"turbine":true,"reqTail":false,"liftbleed":0,"escape":0,"visibility":0,"reqsections":0,"drag":0,"pitchstab":0,"reqED":false},{"name":"Wing Pod","era":"Pioneer","liftbleed":1,"strainfactor":0.5,"dragfactor":0,"location":"wing","powerfactor":1,"helicopter":false,"pushpull":false,"turbine":true,"reqTail":false,"escape":0,"visibility":0,"reqsections":0,"drag":0,"pitchstab":0,"reqED":false},{"name":"Underwing Pod","era":"Pioneer","drag":3,"visibility":-1,"strainfactor":0,"dragfactor":0,"location":"wing","powerfactor":1,"helicopter":false,"pushpull":false,"turbine":true,"reqTail":false,"liftbleed":0,"escape":0,"reqsections":0,"pitchstab":0,"reqED":false}],"radiator-type":[{"name":"Panel","era":"Pioneer","drag":0,"mass":0,"cost":0,"cooling":0,"dragpercool":0.5,"warning":""},{"name":"Box","era":"Pioneer","drag":2,"mass":-1,"cost":0,"cooling":0,"dragpercool":0.5,"warning":""},{"name":"Intake","era":"Roaring 20s","drag":0,"mass":0,"cost":3,"cooling":2,"dragpercool":0.5,"warning":""},{"name":"Evaporation","era":"Coming Storm","warning":"Evaporation Warning","drag":0,"mass":0,"cost":0,"cooling":0,"dragpercool":0}],"radiator-mount":[{"name":"Low","era":"Pioneer","warning":"Low Warning","reliability":1,"drag":0,"latstab":0},{"name":"Inline","era":"Pioneer","reliability":0,"drag":0,"latstab":0,"warning":""},{"name":"High","era":"Pioneer","warning":"High Warning","reliability":0,"drag":1,"latstab":0},{"name":"High Offset","era":"WWI","warning":"High Offset Warning","reliability":0,"drag":1,"latstab":-1}],"radiator-coolant":[{"name":"Water","era":"Pioneer","cost":0,"harden":false,"reliability":0,"flammable":false,"warning":""},{"name":"Salt Water","era":"Pioneer","cost":1,"harden":true,"reliability":1,"flammable":false,"warning":""},{"name":"Mineral Oil","era":"Pioneer","warning":"Mineral Oil Warning","cost":1,"harden":true,"reliability":0,"flammable":true},{"name":"Castor Oil","era":"Pioneer","warning":"Castor Oil Warning","cost":0,"harden":false,"reliability":0,"flammable":true},{"name":"Glycol","era":"Roaring 20s","reliability":2,"harden":false,"cost":2,"flammable":false,"warning":""},{"name":"Freon","era":"Coming Storm","warning":"Freon Warning","reliability":4,"harden":false,"cost":3,"flammable":false},{"name":"Ammonia","era":"Pioneer","warning":"Ammonia Warning","reliability":4,"harden":false,"cost":2,"flammable":false}],"cowling":[{"name":"No Cowling","era":"Pioneer","ed":1,"mpd":0,"air":true,"liquid":true,"rotary":true,"reliability":0,"mass":0,"cost":0},{"name":"Basic Cowl","era":"Pioneer","mass":1,"cost":1,"ed":0.8,"mpd":0,"air":true,"liquid":false,"rotary":false,"reliability":0},{"name":"Rotary Basic Cowl","era":"Pioneer","mass":1,"cost":1,"ed":0.4,"mpd":0,"air":false,"liquid":false,"rotary":true,"reliability":0},{"name":"Closed Cowl","era":"WWI","mass":1,"cost":1,"reliability":-1,"ed":0.3,"mpd":0,"air":false,"liquid":false,"rotary":true},{"name":"Adjustable Slat Cowl","era":"Coming Storm","mass":2,"reliability":2,"cost":2,"ed":0.5,"mpd":0,"air":true,"liquid":false,"rotary":true},{"name":"Foil Cowl","era":"Roaring 20s","mass":2,"reliability":3,"cost":3,"ed":0.4,"mpd":0,"air":true,"liquid":false,"rotary":true},{"name":"Sealed Cowl","era":"Pioneer","cost":1,"ed":0.5,"mpd":0.333333333333,"air":false,"liquid":true,"rotary":false,"reliability":0,"mass":0}]},"propellers":{"props":[{"name":"High Power","era":"Pioneer","pitchspeed":0.8,"pitchboost":0.9,"cost":0,"energy":1.5,"turn":8},{"name":"Power","era":"Pioneer","pitchspeed":0.9,"pitchboost":0.8,"cost":0,"energy":2,"turn":7},{"name":"Default","era":"Pioneer","pitchspeed":1,"pitchboost":0.6,"cost":0,"energy":3,"turn":6},{"name":"Speed","era":"Pioneer","pitchspeed":1.1,"pitchboost":0.4,"cost":0,"energy":4,"turn":5},{"name":"High Speed","era":"Pioneer","pitchspeed":1.2,"pitchboost":0.3,"cost":0,"energy":4.5,"turn":4}],"upgrades":[{"name":"None","era":"Pioneer","energy":0,"turn":0,"warning":"","pitchboost":0,"mass":0,"pitchspeed":0,"cost":0},{"name":"Manually Adjustable Pitch","era":"Pioneer","energy":0,"turn":0,"cost":2,"warning":"MVP_Warning","pitchboost":0,"mass":0,"pitchspeed":0},{"name":"Automatic Pitch","era":"Roaring 20s","pitchspeed":0.1,"pitchboost":0.1,"energy":0.5,"turn":1,"mass":1,"cost":8,"warning":""}]},"frames":{"frames":[{"name":"Wooden Spars","era":"Pioneer","basestructure":15,"basecost":0,"mass":1,"structure":2,"cost":0,"geodesic":false,"warning":""},{"name":"Steel Spars","era":"Pioneer","basestructure":25,"basecost":1,"mass":1,"structure":5,"cost":1,"geodesic":false,"warning":""},{"name":"Aluminum Spars","era":"WWI","basestructure":20,"basecost":2,"mass":0.5,"structure":4,"cost":2,"geodesic":false,"warning":""},{"name":"Wooden Ribs","era":"WWI","basestructure":30,"basecost":1,"mass":2,"structure":5,"cost":0.5,"geodesic":true,"warning":""},{"name":"Steel Ribs","era":"Roaring 20s","basestructure":60,"basecost":2,"mass":3,"structure":12,"cost":2,"geodesic":true,"warning":""},{"name":"Aluminum Ribs","era":"Roaring 20s","basestructure":50,"basecost":3,"mass":2,"structure":8,"cost":3,"geodesic":true,"warning":""},{"name":"Titanium","era":"Last Hurrah","basestructure":0,"basecost":0,"mass":1,"structure":10,"cost":8,"geodesic":false,"warning":""},{"name":"Living Grove","era":"Pioneer","basestructure":30,"basecost":8,"mass":2,"structure":4,"cost":0,"geodesic":true,"warning":"Living Grove Warning"}],"skin":[{"name":"Naked","era":"Pioneer","dragfactor":1,"massfactor":0.6,"visibility":1,"flammable":false,"monocoque":false,"monocoque_structure":0,"toughness":0,"cost":0},{"name":"Cloth Canvas","era":"Pioneer","dragfactor":0.5,"massfactor":1,"flammable":false,"monocoque":false,"monocoque_structure":0,"toughness":0,"visibility":0,"cost":0},{"name":"Transparent Celluloid","era":"Pioneer","dragfactor":0.6,"massfactor":1,"visibility":1,"cost":1,"flammable":true,"monocoque":false,"monocoque_structure":0,"toughness":0},{"name":"Treated Paper","era":"Pioneer","dragfactor":0.5,"massfactor":0.75,"flammable":true,"monocoque":false,"monocoque_structure":0,"toughness":0,"visibility":0,"cost":0},{"name":"Tense Silk","era":"Pioneer","dragfactor":0.5,"massfactor":1,"toughness":1,"cost":1,"flammable":false,"monocoque":false,"monocoque_structure":0,"visibility":0},{"name":"Dragon Skin","era":"Himmilgard","dragfactor":0.5,"massfactor":1,"cost":4,"flammable":false,"monocoque":false,"monocoque_structure":0,"toughness":0,"visibility":0},{"name":"Molded Plywood","era":"Pioneer","dragfactor":0.4,"massfactor":1,"cost":0.5,"flammable":false,"monocoque":true,"monocoque_structure":3,"toughness":0,"visibility":0},{"name":"Clinker Build","era":"Pioneer","dragfactor":0.5,"massfactor":1,"cost":0,"flammable":false,"monocoque":true,"monocoque_structure":-3,"toughness":0,"visibility":0},{"name":"Glass Reinforced Plastic","era":"Last Hurrah","dragfactor":0.3,"massfactor":1,"cost":1,"flammable":false,"monocoque":true,"monocoque_structure":0,"toughness":0,"visibility":0},{"name":"Corrugated Duralumin","era":"WWI","dragfactor":0.5,"massfactor":1,"toughness":3,"cost":1,"flammable":false,"monocoque":true,"monocoque_structure":10,"visibility":0},{"name":"Steel Sheet","era":"Roaring 20s","dragfactor":0.35,"massfactor":1,"cost":1.5,"toughness":3,"flammable":false,"monocoque":true,"monocoque_structure":8,"visibility":0},{"name":"Aluminum Sheet","era":"Roaring 20s","dragfactor":0.35,"massfactor":0.75,"cost":2,"toughness":2,"flammable":false,"monocoque":true,"monocoque_structure":6,"visibility":0}],"tail":[{"name":"Tailless","era":"Pioneer","reqsections":0,"pitchstab":-4,"visibility":3},{"name":"Stubby","era":"Pioneer","reqsections":1,"pitchstab":-3,"visibility":0},{"name":"Standard","era":"Pioneer","reqsections":2,"pitchstab":0,"visibility":0},{"name":"Long","era":"Pioneer","reqsections":3,"pitchstab":3,"visibility":0}]},"wings":{"decks":[{"name":"Wing Deck Parasol","era":"Pioneer","pitchstab":3,"maxstrain":-10,"liftbleed":-2,"visibility":-1,"limited":false,"crashsafety":0},{"name":"Wing Deck Shoulder","era":"Pioneer","pitchstab":2,"liftbleed":-1,"visibility":-1,"limited":true,"crashsafety":0,"maxstrain":0},{"name":"Wing Deck Mid","era":"Pioneer","limited":true,"liftbleed":0,"visibility":0,"pitchstab":0,"crashsafety":0,"maxstrain":0},{"name":"Wing Deck Low","era":"Pioneer","pitchstab":-2,"crashsafety":-1,"liftbleed":-1,"limited":true,"visibility":0,"maxstrain":0},{"name":"Wing Deck Gear","era":"Pioneer","pitchstab":-3,"maxstrain":-10,"crashsafety":-1,"liftbleed":-2,"limited":false,"visibility":0}],"largest":[{"name":"Wing Deck Parasol","era":"Pioneer","latstab":1,"control":-1,"dragfactor":1},{"name":"Wing Deck Shoulder","era":"Pioneer","control":-1,"dragfactor":1,"latstab":0},{"name":"Wing Deck Mid","era":"Pioneer","dragfactor":0.9,"latstab":0,"control":0},{"name":"Wing Deck Low","era":"Pioneer","latstab":-1,"control":2,"dragfactor":1},{"name":"Wing Deck Gear","era":"Pioneer","latstab":-1,"control":3,"dragfactor":1}],"surface":[{"name":"Cloth Canvas","era":"Pioneer","flammable":false,"strainfactor":1,"dragfactor":1,"metal":false,"transparent":false,"charge":0,"toughness":0,"control":0,"mass":0,"cost":0},{"name":"Treated Paper","era":"Pioneer","flammable":true,"strainfactor":1,"dragfactor":1,"mass":-0.25,"metal":false,"transparent":false,"charge":0,"toughness":0,"control":0,"cost":0},{"name":"Tense Silk Layers","era":"Pioneer","flammable":false,"strainfactor":0.9,"dragfactor":1,"cost":0.2,"metal":false,"transparent":false,"charge":0,"toughness":0,"control":0,"mass":0},{"name":"Plywood","era":"Pioneer","flammable":false,"strainfactor":0.9,"dragfactor":1,"mass":0.2,"cost":0.1,"metal":false,"transparent":false,"charge":0,"toughness":0,"control":0},{"name":"Aluminum Sheet","era":"Roaring 20s","flammable":false,"strainfactor":1,"dragfactor":0.8,"cost":0.3,"metal":true,"transparent":false,"charge":0,"toughness":0,"control":0,"mass":0},{"name":"Corrugated Duralumin","era":"Pioneer","flammable":false,"strainfactor":0.6,"dragfactor":1,"mass":0.25,"cost":0.2,"metal":true,"transparent":false,"charge":0,"toughness":0,"control":0},{"name":"Thin Sheet Steel","era":"Roaring 20s","flammable":false,"strainfactor":0.6,"dragfactor":0.9,"mass":0.2,"cost":0.3,"metal":true,"transparent":false,"charge":0,"toughness":0,"control":0},{"name":"Grand Eagle Feather","era":"Himmilgard","flammable":false,"strainfactor":1,"dragfactor":1,"control":0.2,"cost":0.6,"metal":false,"transparent":false,"charge":0,"toughness":0,"mass":0},{"name":"Solar Fiber","era":"Himmilgard","flammable":false,"strainfactor":1,"dragfactor":1,"charge":0.2,"cost":0.4,"metal":false,"transparent":false,"toughness":0,"control":0,"mass":0},{"name":"Dragon Skin","era":"Himmilgard","flammable":false,"strainfactor":0.4,"dragfactor":1,"cost":0.8,"metal":true,"transparent":false,"charge":0,"toughness":0,"control":0,"mass":0},{"name":"Transparent Celluloid","era":"Pioneer","flammable":true,"strainfactor":1,"dragfactor":1,"toughness":-0.1,"cost":0.1,"metal":false,"transparent":true,"charge":0,"control":0,"mass":0}],"stagger":[{"name":"Monoplane","era":"Pioneer","inline":false,"wing_count":1,"hstab":true,"pitchstab":0,"liftbleed":0},{"name":"Tandem","era":"Pioneer","inline":true,"wing_count":20,"hstab":false,"pitchstab":4,"liftbleed":0},{"name":"Extreme Positive","era":"Pioneer","inline":false,"wing_count":20,"hstab":true,"pitchstab":2,"liftbleed":-2},{"name":"Positive","era":"Pioneer","inline":false,"wing_count":20,"hstab":true,"pitchstab":1,"liftbleed":-1},{"name":"Unstaggered","era":"Pioneer","inline":false,"wing_count":20,"hstab":true,"pitchstab":0,"liftbleed":0},{"name":"Negative","era":"Pioneer","inline":false,"wing_count":20,"hstab":true,"pitchstab":-1,"liftbleed":-1},{"name":"Extreme Negative","era":"Pioneer","inline":false,"wing_count":20,"hstab":true,"pitchstab":-2,"liftbleed":-2}]},"stabilizers":{"hstab":[{"name":"Tailplane","era":"Pioneer","dragfactor":1,"is_canard":false,"increment":1,"is_vtail":false,"is_tail":true,"warning":"","liftbleed":0,"latstab":0,"pitchstab":0,"cost":0},{"name":"The Wings","era":"Pioneer","dragfactor":0,"is_canard":false,"increment":0,"is_vtail":false,"is_tail":false,"warning":"","liftbleed":0,"latstab":0,"pitchstab":0,"cost":0},{"name":"Canards","era":"Pioneer","pitchstab":-3,"dragfactor":0.5,"is_canard":true,"increment":1,"is_vtail":false,"is_tail":true,"warning":"","liftbleed":0,"latstab":0,"cost":0},{"name":"Outboard","era":"Pioneer","latstab":1,"dragfactor":1,"is_canard":false,"increment":2,"is_vtail":false,"is_tail":false,"warning":"","liftbleed":0,"pitchstab":0,"cost":0},{"name":"V-Tail","era":"Coming Storm","latstab":2,"pitchstab":2,"cost":5,"dragfactor":0.8,"is_canard":false,"increment":1,"is_vtail":true,"is_tail":true,"warning":"","liftbleed":0},{"name":"T-Tail","era":"WWII","liftbleed":-2,"dragfactor":0.5,"is_canard":false,"increment":1,"is_vtail":false,"is_tail":true,"warning":"T-Tail Warning","latstab":0,"pitchstab":0,"cost":0}],"vstab":[{"name":"Tailfin","era":"Pioneer","dragfactor":1,"increment":1,"is_vtail":false,"is_tail":true,"control":0},{"name":"Outboard","era":"Pioneer","dragfactor":1,"control":1,"increment":2,"is_vtail":false,"is_tail":false},{"name":"V-Tail","era":"Coming Storm","dragfactor":0,"increment":0,"is_vtail":true,"is_tail":true,"control":0}]},"controls":{"ailerons":[{"name":"Flap Ailerons","era":"Pioneer","warping":false,"warning":"","cost":0,"control":0,"drag":0,"crashsafety":0},{"name":"Wing Warping","era":"Pioneer","drag":-1,"warping":true,"warning":"Wing Warping Warning 2","cost":0,"control":0,"crashsafety":0},{"name":"Spoilerons","era":"WWII","cost":2,"warping":false,"warning":"Spoilerons Warning","control":0,"drag":0,"crashsafety":0},{"name":"None","era":"Pioneer","warping":false,"control":-15,"crashsafety":-1,"cost":-2,"warning":"","drag":0}],"rudders":[{"name":"Flap Rudder","era":"Pioneer","latstab":0,"control":0},{"name":"Flying Rudder","era":"Pioneer","latstab":-1,"control":3}],"elevators":[{"name":"Flap Elevator","era":"Pioneer","pitchstab":0,"control":0},{"name":"Flying Elevator","era":"Pioneer","pitchstab":-1,"control":2}],"flaps":[{"name":"None","era":"Pioneer","costfactor":0,"control":0,"warning":"","liftbleed":0,"crashsafety":0},{"name":"Basic Flaps","era":"WWI","liftbleed":-3,"control":-3,"costfactor":0.333333333333,"warning":"","crashsafety":0},{"name":"Advanced Flaps","era":"Coming Storm","liftbleed":-5,"costfactor":0.666666666666,"control":0,"warning":"","crashsafety":0},{"name":"Control Flaps","era":"WWII","liftbleed":-5,"control":3,"costfactor":1,"warning":"","crashsafety":0},{"name":"Lift Dumpers","era":"Last Hurrah","crashsafety":2,"costfactor":1,"warning":"Lift Dumpers Warning","control":0,"liftbleed":0}],"slats":[{"name":"None","era":"Pioneer","control":0,"drag":0,"liftbleed":0,"cost":0},{"name":"Fixed Slots","era":"Roaring 20s","drag":5,"liftbleed":-3,"cost":1,"control":0},{"name":"Automatic Slats","era":"WWII","liftbleed":-1,"control":3,"cost":4,"drag":0}],"drag_inducers":[{"name":"Air Brake","era":"WWII","mass":1,"cost":3,"warning":"Air Brake Warning"},{"name":"Dive Brake","era":"Pioneer","mass":2,"cost":4,"warning":"Dive Brake Warning"},{"name":"Drogue Chute","era":"Last Hurrah","cost":3,"warning":"Drogue Chute Warning","mass":0}]},"reinforcement":{"external_wood":[{"name":"Parallel Struts","era":"Pioneer","drag":2,"mass":1,"structure":5,"maxstrain":5,"tension":30,"cost":1,"config":true,"first":true,"small_sqp":false,"ornith":false},{"name":"N-Strut","era":"Pioneer","drag":2,"mass":1,"structure":6,"maxstrain":8,"tension":20,"cost":1,"config":true,"first":true,"small_sqp":false,"ornith":false},{"name":"V-Strut","era":"Pioneer","drag":1,"mass":1,"structure":-5,"maxstrain":5,"tension":30,"cost":1,"config":true,"first":true,"small_sqp":true,"ornith":false},{"name":"I-Strut","era":"WWI","drag":1,"mass":1,"maxstrain":20,"tension":15,"cost":2,"config":true,"first":true,"small_sqp":false,"ornith":false,"structure":0},{"name":"W-Strut","era":"WWI","drag":3,"mass":1,"maxstrain":35,"tension":0,"cost":2,"config":true,"first":true,"small_sqp":true,"ornith":false,"structure":0},{"name":"Single Strut","era":"Pioneer","drag":1,"mass":1,"maxstrain":10,"tension":0,"cost":1,"config":true,"first":true,"small_sqp":true,"ornith":false,"structure":0},{"name":"Star Strut","era":"WWI","drag":8,"mass":2,"structure":10,"maxstrain":30,"tension":0,"cost":2,"config":true,"first":true,"small_sqp":false,"ornith":false},{"name":"Wing Truss","era":"Pioneer","drag":4,"tension":40,"cost":1,"config":false,"first":true,"small_sqp":true,"ornith":true,"structure":0,"mass":0,"maxstrain":0},{"name":"Wire Root","era":"Pioneer","tension":10,"config":true,"first":false,"small_sqp":true,"ornith":true,"structure":0,"mass":0,"drag":0,"cost":0,"maxstrain":0}],"external_steel":[{"name":"Steel Parallel Struts","era":"Pioneer","drag":2,"mass":1,"structure":10,"maxstrain":10,"tension":15,"cost":2,"config":true,"first":true,"small_sqp":false,"ornith":false},{"name":"Steel N-Strut","era":"Pioneer","drag":2,"mass":1,"structure":12,"maxstrain":13,"tension":10,"cost":2,"config":true,"first":true,"small_sqp":false,"ornith":false},{"name":"Steel V-Strut","era":"Pioneer","drag":1,"mass":1,"structure":0,"maxstrain":10,"tension":15,"cost":2,"config":true,"first":true,"small_sqp":true,"ornith":false},{"name":"Steel I-Strut","era":"WWI","drag":1,"mass":1,"maxstrain":25,"tension":7,"cost":4,"config":true,"first":true,"small_sqp":false,"ornith":false,"structure":0},{"name":"Steel W-Strut","era":"WWI","drag":3,"mass":1,"maxstrain":40,"tension":0,"cost":4,"config":true,"first":true,"small_sqp":true,"ornith":false,"structure":0},{"name":"Steel Single Strut","era":"Pioneer","drag":1,"mass":1,"maxstrain":15,"tension":0,"cost":2,"config":true,"first":true,"small_sqp":true,"ornith":false,"structure":0},{"name":"Steel Star Strut","era":"WWI","drag":6,"mass":2,"structure":20,"maxstrain":35,"tension":0,"cost":4,"config":true,"first":true,"small_sqp":false,"ornith":false},{"name":"Steel Wing Truss","era":"Pioneer","drag":4,"maxstrain":5,"tension":20,"cost":2,"config":false,"first":true,"small_sqp":true,"ornith":true,"structure":0,"mass":0},{"name":"Steel Wire Root","era":"Pioneer","tension":10,"config":true,"first":false,"small_sqp":true,"ornith":true,"structure":0,"mass":0,"drag":0,"cost":0,"maxstrain":0}],"cabane":[{"name":"None","era":"Pioneer","tension":0,"structure":0,"config":false,"drag":0,"mass":0,"cost":0,"maxstrain":0},{"name":"Parallel Struts","era":"Pioneer","drag":0,"mass":1,"structure":5,"maxstrain":5,"tension":15,"cost":1,"config":true},{"name":"Steel Parallel Struts","era":"Pioneer","drag":0,"mass":1,"structure":10,"maxstrain":10,"tension":7,"cost":2,"config":true},{"name":"N-Strut","era":"Pioneer","drag":0,"mass":1,"structure":6,"maxstrain":8,"tension":10,"cost":1,"config":true},{"name":"Steel N-Strut","era":"Pioneer","drag":0,"mass":1,"structure":12,"maxstrain":13,"tension":5,"cost":2,"config":true},{"name":"V-Strut","era":"Pioneer","drag":0,"mass":1,"structure":-5,"maxstrain":5,"tension":15,"cost":1,"config":true},{"name":"Steel V-Strut","era":"Pioneer","drag":0,"mass":1,"structure":0,"maxstrain":10,"tension":7,"cost":2,"config":true},{"name":"I-Strut","era":"WWI","drag":0,"mass":1,"maxstrain":20,"tension":7,"cost":2,"config":true,"structure":0},{"name":"Steel I-Strut","era":"WWI","drag":0,"mass":1,"maxstrain":25,"tension":3,"cost":4,"config":true,"structure":0},{"name":"W-Strut","era":"WWI","drag":1,"mass":1,"maxstrain":35,"tension":0,"cost":2,"config":true,"structure":0},{"name":"Steel W-Strut","era":"WWI","drag":1,"mass":1,"maxstrain":40,"tension":0,"cost":4,"config":true,"structure":0},{"name":"Single Strut","era":"Pioneer","drag":0,"mass":1,"maxstrain":10,"tension":0,"cost":1,"config":true,"structure":0},{"name":"Steel Single Strut","era":"Pioneer","drag":0,"mass":1,"maxstrain":15,"tension":0,"cost":2,"config":true,"structure":0},{"name":"Star Strut","era":"WWI","drag":6,"mass":2,"structure":10,"maxstrain":30,"tension":0,"cost":2,"config":true},{"name":"Steel Star Strut","era":"WWI","drag":4,"mass":2,"structure":20,"maxstrain":35,"tension":0,"cost":4,"config":true}],"cantilever":[{"name":"Birch","era":"WWI","mass":1,"maxstrain":10,"toughness":2,"cost":1,"limited":true,"liftbleed":0},{"name":"Duralumin","era":"WWI","mass":1,"maxstrain":15,"toughness":3,"cost":2,"limited":true,"liftbleed":0},{"name":"Steel","era":"WWI","mass":1,"maxstrain":20,"toughness":5,"cost":3,"limited":true,"liftbleed":0},{"name":"Aluminium","era":"Roaring 20s","mass":1,"maxstrain":25,"toughness":3,"cost":4,"limited":true,"liftbleed":0},{"name":"Whalebone","era":"Himmilgard","mass":1,"liftbleed":-3,"maxstrain":5,"cost":8,"limited":true,"toughness":0}]},"fuel":{"tanks":[{"name":"Internal Fuselage Tank","era":"Pioneer","mass":1,"wetmass":5,"fuel":125,"reqsections":0.5,"internal":true,"cantilever":false,"control":0,"drag":0},{"name":"External Wing Tank","era":"Pioneer","mass":1,"wetmass":5,"fuel":125,"drag":3,"control":-1,"internal":false,"cantilever":false,"reqsections":0},{"name":"Internal Wing Tank","era":"Pioneer","mass":1,"wetmass":5,"fuel":125,"control":-1,"internal":true,"cantilever":true,"reqsections":0,"drag":0},{"name":"Microtank","era":"Pioneer","mass":1,"wetmass":0,"fuel":25,"internal":true,"cantilever":false,"reqsections":0,"control":0,"drag":0}]},"cargo":{"spaces":[{"name":"None","era":"Pioneer","reqsections":0,"mass":0,"warning":""},{"name":"Tiny","era":"Pioneer","mass":1,"warning":"Cargo Tiny","reqsections":0},{"name":"Small","era":"Pioneer","reqsections":1,"warning":"Cargo Small","mass":0},{"name":"Medium","era":"Pioneer","reqsections":3,"warning":"Cargo Medium","mass":0},{"name":"Large","era":"Pioneer","reqsections":5,"warning":"Cargo Large","mass":0},{"name":"Huge","era":"Pioneer","reqsections":10,"warning":"Cargo Huge","mass":0}]},"landing_gear":{"gear":[{"name":"Landing Gear","era":"Pioneer","DpLMP":1,"SpLMP":0,"can_retract":true,"mass":0,"warning":""},{"name":"Floats","era":"Pioneer","DpLMP":1.5,"SpLMP":0,"can_retract":true,"mass":0,"warning":""},{"name":"Hybrid Floats","era":"Pioneer","DpLMP":2,"SpLMP":0,"can_retract":true,"mass":0,"warning":""},{"name":"Boat Hull","era":"Pioneer","mass":5,"DpLMP":1,"SpLMP":1,"can_retract":false,"warning":""},{"name":"Landing Skid","era":"Pioneer","DpLMP":0,"SpLMP":0,"can_retract":false,"warning":"Landing Skid Warning","mass":0}],"extras":[{"name":"Zeppelin Hook","era":"Pioneer","mass":1,"MpLMP":0,"warning":"Zeppelin Hook Warning","drag":0,"crashsafety":0},{"name":"Carrier Hook","era":"Pioneer","MpLMP":0.5,"warning":"Carrier Hook Warning","mass":0,"drag":0,"crashsafety":0},{"name":"Underwing Skid","era":"Pioneer","MpLMP":0,"drag":3,"crashsafety":2,"mass":0,"warning":""}]},"accessories":{"electrical":[{"name":"Windmill","era":"Pioneer","drag":1,"cost":1,"cp10s":1,"storage":0,"mass":0},{"name":"Battery","era":"Pioneer","mass":1,"cost":2,"cp10s":0,"storage":5,"drag":0},{"name":"Battery (High Quality)","era":"Roaring 20s","mass":0,"cost":4,"cp10s":0,"storage":5,"drag":0}],"radios":[{"name":"Loud Yelling","era":"Pioneer","mass":0,"drag":0,"charge":0,"cost":0},{"name":"Intercom System","era":"Pioneer","charge":1e-9,"cost":1,"mass":0,"drag":0},{"name":"Radio Receiver","era":"Pioneer","mass":2,"drag":2,"charge":1e-9,"cost":3},{"name":"Radio Transmitter","era":"WWI","mass":3,"drag":3,"charge":-1,"cost":3},{"name":"Radio Transceiver","era":"WWI","mass":5,"drag":3,"charge":-1,"cost":3},{"name":"Whalebone Radio Receiver","era":"Himmilgard","charge":1e-9,"cost":5,"mass":0,"drag":0},{"name":"Whalebone Radio Base Station","era":"Himmilgard","mass":6,"drag":1,"charge":-1,"cost":12},{"name":"Radio Receiver (High Quality)","era":"Roaring 20s","mass":1,"drag":2,"charge":1e-9,"cost":6},{"name":"Radio Transmitter (High Quality)","era":"Roaring 20s","mass":2,"drag":3,"charge":-1,"cost":6},{"name":"Radio Transceiver (High Quality)","era":"Roaring 20s","mass":4,"drag":3,"charge":-1,"cost":6},{"name":"Whalebone Radio Base Station (High Quality)","era":"Himmilgard","mass":5,"drag":1,"charge":-1,"cost":24}],"recon":[{"name":"Guncam","era":"Pioneer","cost":1,"warning":"Guncam Warning","reqsections":0,"mass":0,"drag":0},{"name":"Small Reconnaissance Camera","era":"Pioneer","mass":1,"drag":1,"cost":2,"warning":"Small Reconnaissance Camera Warning","reqsections":0},{"name":"Medium Reconnaissance Camera","era":"Pioneer","mass":2,"drag":2,"cost":2,"warning":"Medium Reconnaissance Camera Warning","reqsections":0},{"name":"Large Reconnaissance Camera","era":"Pioneer","mass":3,"drag":3,"cost":2,"warning":"Large Reconnaissance Camera Warning","reqsections":0},{"name":"Internal Small Reconnaissance Camera","era":"Pioneer","mass":1,"cost":4,"warning":"Small Reconnaissance Camera Warning","reqsections":0,"drag":0},{"name":"Internal Medium Reconnaissance Camera","era":"Pioneer","mass":2,"cost":2,"reqsections":1,"warning":"Medium Reconnaissance Camera Warning","drag":0},{"name":"Internal Large Reconnaissance Camera","era":"Pioneer","mass":3,"cost":2,"reqsections":1,"warning":"Large Reconnaissance Camera Warning","drag":0}],"visibility":[{"name":"Wing Cutouts","era":"Pioneer","visibility":1,"liftbleed":1,"charge":0,"structure":0,"cost":0},{"name":"Hull Cutouts","era":"Pioneer","visibility":1,"structure":-5,"charge":0,"liftbleed":0,"cost":0},{"name":"Searchlight","era":"Pioneer","charge":1e-9,"cost":1,"liftbleed":0,"structure":0,"visibility":0}],"climate":[{"name":"Electric Heating","era":"Pioneer","charge":-1,"cost":1,"req_radiator":false},{"name":"Radiator Loop","era":"Pioneer","cost":1,"req_radiator":true,"charge":0},{"name":"Air Conditioning","era":"Pioneer","charge":-2,"cost":4,"req_radiator":false}],"autopilots":[{"name":"None","era":"Pioneer","mass":0,"warning":"","charge":0,"cost":0},{"name":"Gyroscopic","era":"WWI","cost":3,"warning":"Gyroscopic Warning","mass":0,"charge":0},{"name":"Altitude Holding","era":"Coming Storm","mass":1,"cost":5,"warning":"Altitude Holding Warning","charge":0},{"name":"Clockwork Programmable","era":"Himmilgard","mass":1,"cost":6,"warning":"Clockwork Programmable Warning","charge":0},{"name":"Programmable","era":"WWII","mass":1,"charge":-2,"cost":6,"warning":"Programmable Warning"},{"name":"Rattenhirn","era":"Himmilgard","mass":3,"charge":-3,"cost":25,"warning":"Rattenhirn Warning"}],"control":[{"name":"None","era":"Pioneer","max_mass_stress":1000,"max_total_stress":1000,"mass":0,"cost":0},{"name":"Control Rods","era":"WWI","mass":1,"cost":2,"max_mass_stress":1,"max_total_stress":1000},{"name":"Hydraulic-Assisted","era":"WWII","mass":3,"cost":5,"max_mass_stress":0,"max_total_stress":1000},{"name":"Fly by Wire","era":"Last Hurrah","mass":3,"cost":10,"max_mass_stress":0,"max_total_stress":0}]},"rotor":{"blade_count":[{"name":"Two","sizing":1.05,"flightstress":1,"rotor_bleed":0,"cost":0},{"name":"Three","sizing":1,"cost":2,"rotor_bleed":1,"flightstress":0},{"name":"Four","sizing":0.95,"cost":4,"rotor_bleed":2,"flightstress":0},{"name":"Five","sizing":0.9,"cost":6,"rotor_bleed":3,"flightstress":0}],"arrangement":[{"name":"Single Rotor","count":1,"powerfactor":1,"blades":0,"reliability":0,"latstab":0,"pitchstab":0,"cost":0},{"name":"Coaxial","count":2,"cost":2,"reliability":-1,"powerfactor":1,"blades":0,"latstab":0,"pitchstab":0},{"name":"Synchropter","count":2,"cost":-2,"powerfactor":0.95,"blades":0,"reliability":0,"latstab":0,"pitchstab":0},{"name":"Tandem","count":2,"pitchstab":4,"powerfactor":1,"blades":0,"reliability":0,"latstab":0,"cost":0},{"name":"Transverse","count":2,"latstab":4,"powerfactor":1,"blades":0,"reliability":0,"pitchstab":0,"cost":0},{"name":"Tandem Transverse","count":3,"pitchstab":4,"latstab":4,"powerfactor":1,"blades":0,"reliability":0,"cost":0}]}}');
var src_parts_namespaceObject = /*#__PURE__*/__webpack_require__.t(parts_namespaceObject, 2);
;// CONCATENATED MODULE: ./src/Hangar/hangar.ts











const init = () => {
    const sp = new URLSearchParams(location.search);
    var lang = sp.get("lang");
    if (lang) {
        localization.SetCurrentLanguage(lang);
    }
    else if (window.localStorage.language) {
        localization.SetCurrentLanguage(window.localStorage.language);
    }
    //Engine bit
    var nameliststr = window.localStorage.getItem("engines_names");
    SetEngineLists(nameliststr);
    InitHTML();
    InitStats();
    LoadFromHangar(0);
};
window.addEventListener("DOMContentLoaded", init);
var acft_builder;
var stats_builder;
var acft_hangar;
var stats_hangar;
var name_builder;
var select_hangar;
var select_acft;
var chosen_hangar;
function InitHTML() {
    chosen_hangar = "Default";
    select_hangar = document.createElement("SELECT");
    select_hangar.onchange = () => {
        chosen_hangar = select_hangar.options[select_hangar.selectedIndex].text;
        RefreshAcftSelect(LoadAcftList());
    };
    RefreshHangarSelect(LoadHangarList());
    select_acft = document.createElement("SELECT");
    select_acft.onchange = () => { LoadFromHangar(select_acft.selectedIndex); };
    RefreshAcftSelect(LoadAcftList());
    name_builder = document.createElement("INPUT");
    var load_btn = document.getElementById("btn_load");
    load_btn.onclick = () => {
        acft_builder.fromJSON(JSON.parse(JSON.stringify(acft_hangar.toJSON())));
        acft_builder.CalculateStats();
        stats_builder.UpdateDisplay(acft_builder, acft_builder.GetStats(), acft_builder.GetDerivedStats());
        window.localStorage.setItem("aircraft", JSON.stringify(acft_builder.toJSON()));
        RefreshDisplay();
        BlinkNeutral(load_btn.parentElement);
    };
    var save_btn = document.getElementById("btn_save");
    save_btn.onclick = () => {
        acft_builder.name = name_builder.value;
        AddToHangar(acft_builder);
        BlinkNeutral(save_btn.parentElement);
    };
    var json_btn = document.getElementById("btn_json");
    json_btn.multiple = false;
    json_btn.accept = "application/JSON";
    json_btn.onchange = (evt) => {
        LoadJSON(json_btn);
        BlinkNeutral(json_btn.parentElement);
    };
    var remove_btn = document.getElementById("btn_remove");
    remove_btn.onclick = () => {
        RemoveFromHangar(acft_hangar.name);
        BlinkNeutral(remove_btn.parentElement);
    };
    var hangar_save = document.getElementById("btn_save_h");
    hangar_save.onclick = () => {
        download(JSON.stringify(LoadAcftList()), chosen_hangar + ".json", "json");
        BlinkNeutral(hangar_save.parentElement);
    };
    var hangar_load = document.getElementById("btn_json_h");
    hangar_load.setAttribute("type", "file");
    hangar_load.multiple = false;
    hangar_load.accept = "application/JSON";
    hangar_load.onchange = (evt) => {
        if (hangar_load.files.length == 0)
            return;
        BlinkNeutral(hangar_load.parentElement);
        var file = hangar_load.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            try {
                var name = file.name.substr(0, file.name.length - 5);
                name = name.trim();
                name = name.replace(/\s+/g, ' ');
                var acft_list;
                acft_list = JSON.parse(reader.result);
                if (acft_list.names.length != acft_list.acft.length) {
                    throw "Bad";
                }
                AddHangar(name);
                window.localStorage.setItem("hangar." + name, reader.result);
                chosen_hangar = name;
                RefreshHangarSelect(LoadHangarList());
                RefreshAcftSelect(LoadAcftList());
            }
            catch {
                BlinkBad(hangar_load.parentElement);
            }
        };
        reader.readAsText(file);
        hangar_load.value = "";
    };
    var list_create = document.getElementById("lbl_create_list");
    var list_input = document.getElementById("btn_create_list");
    list_create.onclick = () => {
        var n = list_input.value;
        n = n.trim();
        n = n.replace(/\s+/g, ' ');
        if (n != "") {
            select_hangar.selectedIndex = AddHangar(n);
            chosen_hangar = n;
            RefreshAcftSelect(LoadAcftList());
            BlinkNeutral(list_create.parentElement);
        }
        list_input.value = "";
    };
    var list_delete = document.getElementById("btn_delete_list");
    list_delete.onclick = () => {
        RemoveHangar(chosen_hangar);
        BlinkNeutral(list_delete.parentElement);
    };
    var to_csv = document.getElementById("btn_to_csv");
    to_csv.onclick = () => {
        var acft_list = LoadAcftList();
        var DerivedStats = [];
        var curr_acft = JSON.stringify(acft_hangar.toJSON());
        for (let acft of acft_list.acft) {
            try {
                var str = LZString.decompressFromEncodedURIComponent(acft);
                var arr = _stringToArrayBuffer(str);
                var des = new Deserialize(arr);
                acft_hangar.deserialize(des);
                acft_hangar.CalculateStats();
            }
            catch (e) {
                console.log("Compressed Query Parameter Failed.");
                console.log(e);
                acft_hangar.Reset();
            }
            let stats = acft_hangar.GetStats();
            let dstats = acft_hangar.GetDerivedStats();
            let entries = Object.entries(dstats);
            entries.splice(0, 0, ["name", acft_hangar.name]);
            entries.splice(1, 0, ["cost", stats.cost]);
            entries.splice(2, 0, ["upkeep", stats.upkeep]);
            entries.splice(3, 0, ["bomb_mass", stats.bomb_mass]);
            entries.splice(4, 0, ["escape", string_StringFmt.Join("/", acft_hangar.GetEscapeList())]);
            entries.splice(5, 0, ["crash", string_StringFmt.Join("/", acft_hangar.GetCrashList())]);
            entries.splice(6, 0, ["stress", Stress2Str(acft_hangar.GetStressList())]);
            let dstatsn = Object.fromEntries(entries);
            DerivedStats.push(dstatsn);
        }
        acft_hangar.fromJSON(JSON.parse(curr_acft));
        var json2csv = new JSON2CSV();
        download(json2csv.convert(DerivedStats, { separator: ',', flatten: true, output_csvjson_variant: false }), chosen_hangar + ".csv", "csv");
    };
}
function InitStats() {
    let acft_data = window.localStorage.getItem("aircraft");
    acft_builder = new Aircraft(src_parts_namespaceObject, false);
    if (acft_data) {
        console.log("Used Saved Data");
        try {
            acft_builder.fromJSON(JSON.parse(acft_data));
            acft_builder.CalculateStats();
        }
        catch {
            console.log("Saved Data Failed.");
            acft_builder.Reset();
        }
    }
    stats_builder = new Derived_HTML(document.getElementById("table_builder"));
    stats_builder.SetShowBombs(true);
    stats_builder.UpdateDisplay(acft_builder, acft_builder.GetStats(), acft_builder.GetDerivedStats());
    acft_hangar = new Aircraft(src_parts_namespaceObject, false);
    stats_hangar = new Derived_HTML(document.getElementById("table_hangar"));
    stats_hangar.SetShowBombs(true);
}
function LoadHangarList() {
    var hangar_list;
    if (!window.localStorage.getItem("hangar_names")) {
        window.localStorage.setItem("hangar_names", JSON.stringify(["Default"]));
    }
    hangar_list = JSON.parse(window.localStorage.getItem("hangar_names"));
    if (hangar_list.length == 0) {
        window.localStorage.setItem("hangar_names", JSON.stringify(["Default"]));
        hangar_list = JSON.parse(window.localStorage.getItem("hangar_names"));
    }
    return hangar_list;
}
function LoadAcftList() {
    var acft_list;
    if (window.localStorage.getItem("hangar." + chosen_hangar)) {
        acft_list = JSON.parse(window.localStorage.getItem("hangar." + chosen_hangar));
    }
    else {
        acft_list = {
            names: ["Basic Biplane"],
            acft: ["AAEAjGB0DMwLACECGBnAlgYwAQLQBwBskA7AU2AEBLgaAwGhmgUEZpFY+oHQAlACwD2xJFgCyAgC4CATgCMkAVywAtCFgAcABj55gAJGABcYACAaVVuwAQDdpw4B-h8BsAoex8+9BwsZJnySqpgGtq6NGYUAIKQAGaxAAIACQwAkJQA-AABNNm5OfZ2jE6eZhxlAMCeHmXVtdS1NjYeTRxVbKwW1J7tNOld1WmDnCweVBbsA8OsvS7TtnUMs0XzY8AVVLRT1BRde6sHDEA"]
        };
        window.localStorage.setItem("hangar." + chosen_hangar, JSON.stringify(acft_list));
    }
    return acft_list;
}
function LoadFromHangar(idx) {
    var acft_list = LoadAcftList();
    try {
        var str = LZString.decompressFromEncodedURIComponent(acft_list.acft[idx]);
        var arr = _stringToArrayBuffer(str);
        var des = new Deserialize(arr);
        acft_hangar.deserialize(des);
        acft_hangar.CalculateStats();
    }
    catch (e) {
        console.log("Compressed Query Parameter Failed.");
        console.log(e);
        acft_hangar.Reset();
    }
    stats_hangar.UpdateDisplay(acft_hangar, acft_hangar.GetStats(), acft_hangar.GetDerivedStats());
    select_acft.selectedIndex = idx;
    RefreshDisplay();
}
function AddHangar(hangar) {
    var hangar_list = LoadHangarList();
    var idx = hangar_list.findIndex(n => n == hangar);
    if (idx == -1) {
        hangar_list.push(hangar);
        idx = hangar_list.length - 1;
        SaveHangarList(hangar_list);
    }
    return idx;
}
function AddToHangar(acft) {
    var s = new Serialize();
    acft.serialize(s);
    var arr = s.FinalArray();
    var str2 = _arrayBufferToString(arr);
    var data = LZString.compressToEncodedURIComponent(str2);
    var acft_list = LoadAcftList();
    var idx = acft_list.names.findIndex(n => n == acft.name);
    if (idx == -1) {
        acft_list.names.push(acft.name);
        acft_list.acft.push(data);
        idx = acft_list.names.length - 1;
    }
    else {
        acft_list.acft[idx] = data;
    }
    SaveAcftList(acft_list);
    return idx;
}
function RemoveHangar(name) {
    var hangar_list = LoadHangarList();
    var idx = hangar_list.findIndex(n => n == name);
    if (idx != -1) {
        hangar_list.splice(idx, 1);
        window.localStorage.removeItem("hangar." + name);
    }
    SaveHangarList(hangar_list);
    chosen_hangar = "Default";
    RefreshHangarSelect(LoadHangarList());
    RefreshAcftSelect(LoadAcftList());
    LoadFromHangar(0);
}
function RemoveFromHangar(name) {
    var acft_list = LoadAcftList();
    var idx = acft_list.names.findIndex(n => n == name);
    if (idx != -1) {
        acft_list.names.splice(idx, 1);
        acft_list.acft.splice(idx, 1);
    }
    SaveAcftList(acft_list);
    LoadFromHangar(Math.min(acft_list.names.length - 1, idx));
}
function SaveAcftList(acft_list) {
    window.localStorage.setItem("hangar." + chosen_hangar, JSON.stringify(acft_list));
    RefreshAcftSelect(acft_list);
}
function SaveHangarList(hangar_list) {
    window.localStorage.setItem("hangar_names", JSON.stringify(hangar_list));
    RefreshHangarSelect(hangar_list);
}
function RefreshAcftSelect(acft_list) {
    while (select_acft.lastChild) {
        select_acft.removeChild(select_acft.lastChild);
    }
    for (let i = 0; i < acft_list.names.length; i++) {
        let opt = document.createElement("OPTION");
        opt.text = acft_list.names[i];
        select_acft.add(opt);
    }
}
function RefreshHangarSelect(hangar_list) {
    while (select_hangar.lastChild) {
        select_hangar.removeChild(select_hangar.lastChild);
    }
    var idx = 0;
    for (let i = 0; i < hangar_list.length; i++) {
        let opt = document.createElement("OPTION");
        opt.text = hangar_list[i];
        select_hangar.add(opt);
        if (hangar_list[i] == chosen_hangar)
            idx = i;
    }
    select_hangar.selectedIndex = idx;
}
function LoadJSON(input) {
    if (input.files.length == 0)
        return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onloadend = () => {
        try {
            var str = JSON.parse(reader.result);
            var acft = new Aircraft(src_parts_namespaceObject, false);
            if (acft.fromJSON(str)) {
                var idx = AddToHangar(acft);
                LoadFromHangar(idx);
            }
        }
        catch (e) {
            console.error(e, e.stack);
        }
    };
    reader.readAsText(file);
    input.value = "";
}
function RefreshDisplay() {
    var tbl1 = document.getElementById("table_builder");
    var tbl2 = document.getElementById("table_hangar");
    var tbl3 = document.getElementById("table_comp");
    MergeTables(tbl1, tbl2, tbl3);
}
function MergeTables(tbl1, tbl2, tbl3) {
    while (tbl3.lastChild) {
        tbl3.removeChild(tbl3.lastChild);
    }
    console.log(acft_builder.GetStats());
    for (let r = 0; r < tbl1.children.length; r++) {
        var row1 = tbl1.children[r];
        var row2 = tbl2.children[r];
        var row3 = tbl3.insertRow();
        for (let c = 0; c < Math.max(row1.children.length, row2.children.length); c++) {
            if (r == 0 && c == 0) {
                var cell = row3.insertCell();
                cell.colSpan = 2;
                cell.appendChild(name_builder);
                name_builder.value = acft_builder.name;
                var hr = document.createElement("HR");
                hr.className = "dashed";
                cell.appendChild(hr);
                cell.appendChild(select_hangar);
                cell.appendChild(document.createElement("BR"));
                cell.appendChild(select_acft);
                continue;
            }
            var cell1 = row1.children[c];
            var cell2 = row2.children[c];
            if (cell1.nodeName == "TH") {
                row3.appendChild(cell1.cloneNode(true));
            }
            else {
                var clone = cell1.cloneNode(true);
                clone.innerHTML += "<hr class=\"dashed\">" + cell2.innerHTML;
                row3.appendChild(clone);
            }
        }
    }
}

/******/ })()
;