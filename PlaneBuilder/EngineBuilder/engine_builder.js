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
class StringFmt {
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
                let tempString = StringFmt.Empty;
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
                let tempString = StringFmt.Empty;
                const objectArg = firstArg;
                const keys = Object.keys(firstArg); //get all Properties of the Object as Array
                keys.forEach(element => { tempString += objectArg[element] + delimiter; });
                tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                return tempString;
            }
            const stringArray = args;
            return StringFmt.join(delimiter, ...stringArray);
        }
        catch (e) {
            console.log(e);
            return StringFmt.Empty;
        }
    }
    static Format(format, ...args) {
        try {
            if (format.match(StringFmt.regexNumber)) {
                return StringFmt.format(StringFmt.regexNumber, format, args);
            }
            if (format.match(StringFmt.regexObject)) {
                return StringFmt.format(StringFmt.regexObject, format, args, true);
            }
            return format;
        }
        catch (e) {
            console.log(e);
            return StringFmt.Empty;
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
            arg = StringFmt.parsePattern(match, arg);
            return typeof arg != 'undefined' && arg != null ? arg : StringFmt.Empty;
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
                    return StringFmt.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return StringFmt.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            }
            case 's': {
                if (typeof (arg) === 'string') {
                    return StringFmt.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return StringFmt.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
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
                    parts = [StringFmt.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                }
                const integer = parts[0];
                const mod = integer.length % 3;
                let output = (mod > 0 ? (integer.substring(0, mod)) : StringFmt.Empty);
                const firstGroup = output;
                const remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + StringFmt.Join('.', remainingGroups);
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
        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !StringFmt.IsNullOrWhiteSpace(arg)) {
            return StringFmt.formatNumber(arg, match);
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
        let time = StringFmt.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }
        const year = splitted[splitted.length - 1].split(' ')[0];
        const month = splitted[splitted.length - 2];
        const day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`;
        if (!StringFmt.IsNullOrWhiteSpace(time) && time.length > 1) {
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
        let temp = StringFmt.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && StringFmt.IsNullOrWhiteSpace(args[i]))
                || (typeof args[i] != "number" && typeof args[i] != "string")) {
                continue;
            }
            const arg = "" + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (StringFmt.IsNullOrWhiteSpace(args[i2])) {
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
StringFmt.regexNumber = /{(\d+(:\w*)?)}/g;
StringFmt.regexObject = /{(\w+(:\w*)?)}/g;
StringFmt.Empty = '';
class StringBuilder {
    constructor(value) {
        this.Values = [];
        if (!StringFmt.IsNullOrWhiteSpace(value)) {
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
        this.Values.push(StringFmt.Format(format, ...args));
    }
    AppendLineFormat(format, ...args) {
        this.Values.push("\r\n" + StringFmt.Format(format, ...args));
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
function lu(s, ...args) {
    return StringFmt.Format(localization.e(s), ...args);
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
                source: lu(js["name"]),
                warning: lu(js["warning"]),
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
                name: lu(js["name"]),
                era: lu(js["era"])
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
        estats.stats.era.push({ name: this.name, era: lu(num2era(this.era_sel)) });
        switch (this.compressor_type) {
            case CompressorEnum.NONE: {
                break;
            }
            case CompressorEnum.ALTITUDE_THROTTLE: {
                estats.stats.cost += 3;
                estats.altitude = 49;
                estats.stats.warnings.push({
                    source: lu("Altitude Throttle"),
                    warning: lu("Altitude Throttle Warning"),
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
                source: lu("War Emergency Power"),
                warning: lu("War Emergency Power Warning"),
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
        estats.stats.era.push({ name: estats.name, era: lu(num2era(this.era_sel)) });
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
            estats.stats.era.push({ name: estats.name, era: lu(num2era(-1)) });
        }
        else {
            estats.stats.era.push({ name: estats.name, era: lu(num2era(5)) });
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
        estats.stats.era.push({ name: this.name, era: lu(num2era(this.era_sel)) });
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
function CreateFlexSection(elem) {
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
function CreateTH(row, content) {
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
function CreateInput(txt, elem, table, br = true) {
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
function FlexInput(txt, inp, fs) {
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
function FlexSelect(txt, sel, fs) {
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
function CreateCheckbox(txt, elem, table, br = true) {
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
function CreateSelect(txt, elem, table, br = true) {
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
function FlexCheckbox(txt, inp, fs) {
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
function FlexSpace(fs) {
    const lbl = document.createElement("LABEL");
    lbl.textContent = " ";
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    const lbl2 = document.createElement("LABEL");
    lbl2.textContent = " ";
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}
function insertRow(frag) {
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
function BlinkIfChanged(elem, str, positive_good = null) {
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

;// CONCATENATED MODULE: ./src/EngineBuilder/engine_builder.ts














const init = () => {
    const sp = new URLSearchParams(location.search);
    const ep = sp.get("engine");
    const lang = sp.get("lang");
    if (lang) {
        localization.SetCurrentLanguage(lang);
    }
    else if (window.localStorage.language) {
        localization.SetCurrentLanguage(window.localStorage.language);
    }
    //Engine Bit
    const nameliststr = window.localStorage.getItem("engines_names");
    SetEngineLists(nameliststr);
    ebuild = new EngineBuilder_HTML();
    ebuild.UpdateList();
    if (ep != null) {
        try {
            const str = LZString.decompressFromEncodedURIComponent(ep);
            const arr = _stringToArrayBuffer(str);
            const des = new Deserialize(arr);
            const num = GetEngineLists().get("Custom").deserializeEngine(des);
            ebuild.SelectEngine(num);
        }
        catch {
            console.log("Compressed Engine Parameter Failed.");
        }
    }
    SetAnimationEnabled(true);
};
window.onload = init;
var ebuild;
class EngineBuilder_HTML {
    constructor() {
        this.enginebuilder = new EngineBuilder();
        this.pulsejetbuilder = new PulsejetBuilder();
        this.turbobuilder = new TurboBuilder();
        this.electricbuilder = new ElectricBuilder();
        const etbl = document.getElementById("table_engine");
        const erow = etbl.insertRow();
        this.InitEngineInputs(erow.insertCell());
        this.InitEngineUpgrades(erow.insertCell());
        this.InitEngineOutputs(erow.insertCell());
        this.UpdateEngine();
        const ptbl = document.getElementById("table_pulsejet");
        const prow = ptbl.insertRow();
        this.InitPulsejetInputs(prow.insertCell());
        this.InitPulsejetOutputs(prow.insertCell());
        this.UpdatePulsejet();
        const ttbl = document.getElementById("table_turbox");
        const trow = ttbl.insertRow();
        this.InitTurboXInputs(trow.insertCell());
        this.td_desc = trow.insertCell();
        this.InitTurboXOutputs(trow.insertCell());
        this.UpdateTurboX();
        const eltbl = document.getElementById("table_electric");
        const elrow = eltbl.insertRow();
        this.InitElectricInputs(elrow.insertCell());
        this.InitElectricOutputs(elrow.insertCell());
        this.UpdateElectric();
        const mtbl = document.getElementById("table_manual");
        const mrow = mtbl.insertRow();
        this.InitManual(mrow.insertCell());
        this.InitListManagement(mrow.insertCell());
    }
    InitEngineInputs(cell) {
        this.e_name = document.createElement("INPUT");
        this.e_sera = document.createElement("SELECT");
        this.e_cool = document.createElement("SELECT");
        this.e_disp = document.createElement("INPUT");
        this.e_cmpr = document.createElement("INPUT");
        this.e_ncyl = document.createElement("INPUT");
        this.e_nrow = document.createElement("INPUT");
        this.e_rpmb = document.createElement("INPUT");
        this.e_mfdg = document.createElement("INPUT");
        this.e_qfdg = document.createElement("INPUT");
        for (let e of this.enginebuilder.EraTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.e_sera.add(opt);
        }
        for (let c of this.enginebuilder.CoolingTable) {
            let opt = document.createElement("OPTION");
            opt.text = c.name;
            this.e_cool.add(opt);
        }
        const fs = CreateFlexSection(cell);
        FlexText("Name", this.e_name, fs);
        FlexSelect("Era", this.e_sera, fs);
        FlexSelect("Engine Type", this.e_cool, fs);
        FlexInput("Engine Displacement (L)", this.e_disp, fs);
        FlexInput("Compression Ratio (N:1)", this.e_cmpr, fs);
        FlexInput("Cylinders per Row", this.e_ncyl, fs);
        FlexInput("Number of Rows", this.e_nrow, fs);
        FlexInput("RPM Boost", this.e_rpmb, fs);
        FlexInput("Material Fudge Factor", this.e_mfdg, fs);
        FlexInput("Quality Fudge Factor", this.e_qfdg, fs);
        this.e_disp.min = "0.01";
        this.e_disp.step = "0.01";
        this.e_cmpr.min = "0.01";
        this.e_cmpr.step = "0.01";
        this.e_ncyl.min = "1";
        this.e_nrow.min = "1";
        this.e_rpmb.min = "0.01";
        this.e_rpmb.step = "0.01";
        this.e_rpmb.max = "2000";
        this.e_mfdg.min = "0.1";
        this.e_mfdg.step = "0.1";
        this.e_mfdg.max = "1.9";
        this.e_qfdg.step = "0.1";
        this.e_qfdg.min = "0.1";
        this.e_qfdg.max = "1.9";
        this.e_name.onchange = () => { this.enginebuilder.name = this.e_name.value; this.UpdateEngine(); };
        this.e_sera.onchange = () => { this.enginebuilder.era_sel = this.e_sera.selectedIndex; this.UpdateEngine(); };
        this.e_cool.onchange = () => { this.enginebuilder.cool_sel = this.e_cool.selectedIndex; this.UpdateEngine(); };
        this.e_disp.onchange = () => { this.enginebuilder.engine_displacement = this.e_disp.valueAsNumber; this.UpdateEngine(); };
        this.e_cmpr.onchange = () => { this.enginebuilder.compression_ratio = this.e_cmpr.valueAsNumber; this.UpdateEngine(); };
        this.e_ncyl.onchange = () => { this.enginebuilder.num_cyl_per_row = this.e_ncyl.valueAsNumber; this.UpdateEngine(); };
        this.e_nrow.onchange = () => { this.enginebuilder.num_rows = this.e_nrow.valueAsNumber; this.UpdateEngine(); };
        this.e_rpmb.onchange = () => { this.enginebuilder.rpm_boost = this.e_rpmb.valueAsNumber; this.UpdateEngine(); };
        this.e_mfdg.onchange = () => { this.enginebuilder.material_fudge = this.e_mfdg.valueAsNumber; this.UpdateEngine(); };
        this.e_qfdg.onchange = () => { this.enginebuilder.quality_fudge = this.e_qfdg.valueAsNumber; this.UpdateEngine(); };
    }
    InitEngineUpgrades(cell) {
        const fs = CreateFlexSection(cell);
        this.e_ctyp = document.createElement("SELECT");
        for (let e of this.enginebuilder.CompressorTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.e_ctyp.add(opt);
        }
        this.e_ccnt = document.createElement("INPUT");
        this.e_mIA = document.createElement("INPUT");
        this.e_ctyp.onchange = () => { this.enginebuilder.compressor_type = this.e_ctyp.selectedIndex; this.UpdateEngine(); };
        this.e_ccnt.onchange = () => { this.enginebuilder.compressor_count = this.e_ccnt.valueAsNumber; this.UpdateEngine(); };
        this.e_mIA.onchange = () => { this.enginebuilder.min_IAF = this.e_mIA.valueAsNumber; this.UpdateEngine(); };
        FlexSelect("Compressor Type", this.e_ctyp, fs);
        FlexInput("Compressor Count", this.e_ccnt, fs);
        FlexInput("Minimum Ideal Altitude", this.e_mIA, fs);
        this.e_ccnt.min = "0";
        this.e_ccnt.step = "1";
        this.e_mIA.min = "0";
        this.e_mIA.step = "10";
        this.e_upgs = [];
        //NOTE: Asperator Boot depricated, so start from 1.
        for (let i = 1; i < this.enginebuilder.Upgrades.length; i++) {
            let u = this.enginebuilder.Upgrades[i];
            let inp = document.createElement("INPUT");
            inp.onchange = () => { this.enginebuilder.upg_sel[i] = this.e_upgs[i - 1].checked; this.UpdateEngine(); };
            FlexCheckbox(u.name, inp, fs);
            this.e_upgs.push(inp);
        }
    }
    InitEngineOutputs(cell) {
        this.ed_name = document.createElement("LABEL");
        this.ed_powr = document.createElement("LABEL");
        this.ed_mass = document.createElement("LABEL");
        this.ed_drag = document.createElement("LABEL");
        this.ed_rely = document.createElement("LABEL");
        this.ed_cool = document.createElement("LABEL");
        this.ed_ospd = document.createElement("LABEL");
        this.ed_fuel = document.createElement("LABEL");
        this.ed_malt = document.createElement("LABEL");
        this.ed_torq = document.createElement("LABEL");
        this.ed_cost = document.createElement("LABEL");
        this.ed_oilt = document.createElement("LABEL");
        this.ed_grpm = document.createElement("LABEL");
        const fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.ed_name, fs);
        FlexDisplay("Power", this.ed_powr, fs);
        FlexDisplay("Mass", this.ed_mass, fs);
        FlexDisplay("Drag", this.ed_drag, fs);
        FlexDisplay("Reliability", this.ed_rely, fs);
        FlexDisplay("Required Cooling", this.ed_cool, fs);
        FlexDisplay("Overspeed", this.ed_ospd, fs);
        FlexDisplay("Fuel Consumption", this.ed_fuel, fs);
        FlexDisplay("Altitude", this.ed_malt, fs);
        FlexDisplay("Torque", this.ed_torq, fs);
        FlexDisplay("Cost", this.ed_cost, fs);
        FlexDisplay("Oil Tank", this.ed_oilt, fs);
        FlexDisplay("Geared RPM", this.ed_grpm, fs);
    }
    UpdateEngine() {
        //Update and enfoce values before updating displayed values.
        const estats = this.enginebuilder.EngineStats();
        this.e_name.value = this.enginebuilder.name;
        this.e_sera.selectedIndex = this.enginebuilder.era_sel;
        this.e_cool.selectedIndex = this.enginebuilder.cool_sel;
        this.e_disp.valueAsNumber = this.enginebuilder.engine_displacement;
        this.e_ncyl.valueAsNumber = this.enginebuilder.num_cyl_per_row;
        this.e_nrow.valueAsNumber = this.enginebuilder.num_rows;
        this.e_cmpr.valueAsNumber = this.enginebuilder.compression_ratio;
        this.e_rpmb.valueAsNumber = this.enginebuilder.rpm_boost;
        this.e_mfdg.valueAsNumber = this.enginebuilder.material_fudge;
        this.e_qfdg.valueAsNumber = this.enginebuilder.quality_fudge;
        for (let i = 0; i < this.e_upgs.length; i++) {
            this.e_upgs[i].checked = this.enginebuilder.upg_sel[i + 1];
        }
        this.e_ctyp.selectedIndex = this.enginebuilder.compressor_type;
        this.e_ccnt.valueAsNumber = this.enginebuilder.compressor_count;
        this.e_mIA.valueAsNumber = this.enginebuilder.min_IAF;
        const can_upg = this.enginebuilder.CanUpgrade();
        for (let i = 0; i < this.e_upgs.length; i++) {
            this.e_upgs[i].disabled = !can_upg[i + 1]; //NOTE: Asperator Boot depricated, so start from 1.
        }
        BlinkIfChanged(this.ed_name, estats.name);
        BlinkIfChanged(this.ed_powr, estats.stats.power.toString(), true);
        BlinkIfChanged(this.ed_mass, estats.stats.mass.toString(), false);
        BlinkIfChanged(this.ed_drag, estats.stats.drag.toString(), false);
        BlinkIfChanged(this.ed_rely, estats.stats.reliability.toString(), true);
        BlinkIfChanged(this.ed_cool, estats.stats.cooling.toString(), false);
        BlinkIfChanged(this.ed_ospd, estats.overspeed.toString(), true);
        BlinkIfChanged(this.ed_fuel, estats.stats.fuelconsumption.toString(), false);
        const b = this.enginebuilder.min_IAF;
        const t = this.enginebuilder.min_IAF + estats.altitude;
        BlinkIfChanged(this.ed_malt, b.toString() + "-" + t.toString());
        BlinkIfChanged(this.ed_torq, estats.torque.toString(), false);
        BlinkIfChanged(this.ed_cost, estats.stats.cost.toString(), false);
        if (estats.oiltank)
            BlinkIfChanged(this.ed_oilt, "Yes");
        else
            BlinkIfChanged(this.ed_oilt, "No");
        BlinkIfChanged(this.ed_grpm, (Math.round(100 * this.enginebuilder.GearedRPM()) / 100).toString());
    }
    InitPulsejetInputs(cell) {
        this.p_powr = document.createElement("INPUT");
        this.p_type = document.createElement("SELECT");
        this.p_sera = document.createElement("SELECT");
        this.p_bqul = document.createElement("INPUT");
        this.p_strt = document.createElement("INPUT");
        for (let v of this.pulsejetbuilder.ValveTable) {
            let opt = document.createElement("OPTION");
            opt.text = v.name;
            this.p_type.add(opt);
        }
        for (let e of this.pulsejetbuilder.EraTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.p_sera.add(opt);
        }
        const fs = CreateFlexSection(cell);
        FlexInput("Desired Power", this.p_powr, fs);
        FlexSelect("Engine Type", this.p_type, fs);
        FlexSelect("Era", this.p_sera, fs);
        FlexInput("Quality", this.p_bqul, fs);
        FlexCheckbox("Starter", this.p_strt, fs);
        this.p_bqul.step = "0.1";
        this.p_bqul.min = "0";
        this.p_powr.onchange = () => { this.pulsejetbuilder.desired_power = this.p_powr.valueAsNumber; this.UpdatePulsejet(); };
        this.p_type.onchange = () => { this.pulsejetbuilder.valve_sel = this.p_type.selectedIndex; this.UpdatePulsejet(); };
        this.p_sera.onchange = () => { this.pulsejetbuilder.era_sel = this.p_sera.selectedIndex; this.UpdatePulsejet(); };
        this.p_bqul.onchange = () => { this.pulsejetbuilder.build_quality = this.p_bqul.valueAsNumber; this.pulsejetbuilder.overall_quality = this.p_bqul.valueAsNumber; this.UpdatePulsejet(); };
        this.p_strt.onchange = () => { this.pulsejetbuilder.starter = this.p_strt.checked; this.UpdatePulsejet(); };
    }
    InitPulsejetOutputs(cell) {
        this.pd_name = document.createElement("LABEL");
        this.pd_powr = document.createElement("LABEL");
        this.pd_mass = document.createElement("LABEL");
        this.pd_drag = document.createElement("LABEL");
        this.pd_rely = document.createElement("LABEL");
        this.pd_fuel = document.createElement("LABEL");
        this.pd_rumb = document.createElement("LABEL");
        this.pd_cost = document.createElement("LABEL");
        this.pd_malt = document.createElement("LABEL");
        this.pd_dcst = document.createElement("LABEL");
        const fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.pd_name, fs);
        FlexDisplay("Power", this.pd_powr, fs);
        FlexDisplay("Mass", this.pd_mass, fs);
        FlexDisplay("Drag", this.pd_drag, fs);
        FlexDisplay("Reliability", this.pd_rely, fs);
        FlexDisplay("Fuel Consumption", this.pd_fuel, fs);
        FlexDisplay("Rumble", this.pd_rumb, fs);
        FlexDisplay("Cost", this.pd_cost, fs);
        FlexDisplay("Altitude", this.pd_malt, fs);
        FlexDisplay("Design Cost", this.pd_dcst, fs);
    }
    UpdatePulsejet() {
        this.p_powr.valueAsNumber = this.pulsejetbuilder.desired_power;
        this.p_type.selectedIndex = this.pulsejetbuilder.valve_sel;
        this.p_sera.selectedIndex = this.pulsejetbuilder.era_sel;
        this.p_bqul.valueAsNumber = this.pulsejetbuilder.build_quality;
        this.p_strt.checked = this.pulsejetbuilder.starter;
        const estats = this.pulsejetbuilder.EngineStats();
        BlinkIfChanged(this.pd_name, estats.name);
        BlinkIfChanged(this.pd_powr, estats.stats.power.toString());
        BlinkIfChanged(this.pd_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.pd_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.pd_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.pd_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.pd_rumb, estats.rumble.toString());
        BlinkIfChanged(this.pd_cost, estats.stats.cost.toString());
        BlinkIfChanged(this.pd_malt, estats.altitude.toString());
        BlinkIfChanged(this.pd_dcst, this.pulsejetbuilder.DesignCost().toString());
    }
    InitTurboXInputs(cell) {
        this.t_name = document.createElement("INPUT");
        this.t_era = document.createElement("SELECT");
        this.t_type = document.createElement("SELECT");
        this.t_effi = document.createElement("INPUT");
        this.t_diam = document.createElement("INPUT");
        this.t_comp = document.createElement("INPUT");
        this.t_bypr = document.createElement("INPUT");
        this.t_aftb = document.createElement("INPUT");
        const fs = CreateFlexSection(cell);
        FlexText("Name", this.t_name, fs);
        FlexSelect("Era", this.t_era, fs);
        FlexSelect("Type", this.t_type, fs);
        FlexInput("Engine Diameter (m)", this.t_diam, fs);
        FlexInput("Overall Pressure Ratio", this.t_comp, fs);
        FlexInput("Bypass Ratio", this.t_bypr, fs);
        FlexInput("Mass Flow Adjustment", this.t_effi, fs);
        FlexCheckbox("Afterburner", this.t_aftb, fs);
        this.t_effi.step = "0.05";
        this.t_effi.min = "-0.5";
        this.t_effi.max = "0.5";
        this.t_diam.step = "0.01";
        this.t_comp.step = "0.01";
        this.t_bypr.step = "0.1";
        for (let e of this.turbobuilder.EraTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.t_era.add(opt);
        }
        for (let t of this.turbobuilder.TypeTable) {
            let opt = document.createElement("OPTION");
            opt.text = t.name;
            this.t_type.add(opt);
        }
        this.t_name.onchange = () => { this.turbobuilder.name = this.t_name.value; this.UpdateTurboX(); };
        this.t_era.onchange = () => { this.turbobuilder.era_sel = this.t_era.selectedIndex; this.UpdateTurboX(); };
        this.t_type.onchange = () => { this.turbobuilder.type_sel = this.t_type.selectedIndex; this.UpdateTurboX(); };
        this.t_effi.onchange = () => { this.turbobuilder.flow_adjustment = this.t_effi.valueAsNumber; this.UpdateTurboX(); };
        this.t_diam.onchange = () => { this.turbobuilder.diameter = this.t_diam.valueAsNumber; this.UpdateTurboX(); };
        this.t_comp.onchange = () => { this.turbobuilder.compression_ratio = this.t_comp.valueAsNumber; this.UpdateTurboX(); };
        this.t_bypr.onchange = () => { this.turbobuilder.bypass_ratio = this.t_bypr.valueAsNumber; this.UpdateTurboX(); };
        this.t_aftb.onchange = () => { this.turbobuilder.afterburner = this.t_aftb.checked; this.UpdateTurboX(); };
    }
    InitTurboXOutputs(cell) {
        this.td_name = document.createElement("LABEL");
        this.td_powr = document.createElement("LABEL");
        this.td_mass = document.createElement("LABEL");
        this.td_drag = document.createElement("LABEL");
        this.td_rely = document.createElement("LABEL");
        this.td_fuel = document.createElement("LABEL");
        this.td_cost = document.createElement("LABEL");
        this.td_malt = document.createElement("LABEL");
        const fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.td_name, fs);
        FlexDisplay("Power", this.td_powr, fs);
        FlexDisplay("Mass", this.td_mass, fs);
        FlexDisplay("Drag", this.td_drag, fs);
        FlexDisplay("Reliability", this.td_rely, fs);
        FlexDisplay("Fuel Consumption", this.td_fuel, fs);
        FlexDisplay("Cost", this.td_cost, fs);
        FlexDisplay("Altitude", this.td_malt, fs);
        this.td_desc.classList.add("disp_cell");
    }
    UpdateTurboX() {
        this.t_name.value = this.turbobuilder.name;
        this.t_era.selectedIndex = this.turbobuilder.era_sel;
        this.t_type.selectedIndex = this.turbobuilder.type_sel;
        this.t_effi.valueAsNumber = this.turbobuilder.flow_adjustment;
        this.t_diam.valueAsNumber = this.turbobuilder.diameter;
        this.t_comp.valueAsNumber = this.turbobuilder.compression_ratio;
        this.t_bypr.valueAsNumber = this.turbobuilder.bypass_ratio;
        this.t_aftb.checked = this.turbobuilder.afterburner;
        if (this.turbobuilder.type_sel == 0 || this.turbobuilder.type_sel == 3) {
            this.t_bypr.disabled = true;
        }
        else {
            this.t_bypr.disabled = false;
        }
        const estats = this.turbobuilder.EngineStats();
        BlinkIfChanged(this.td_name, estats.name);
        BlinkIfChanged(this.td_powr, estats.stats.power.toString());
        BlinkIfChanged(this.td_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.td_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.td_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.td_fuel, estats.stats.fuelconsumption.toString());
        BlinkIfChanged(this.td_cost, estats.stats.cost.toString());
        BlinkIfChanged(this.td_malt, estats.altitude.toString());
        switch (this.turbobuilder.type_sel) {
            case 0:
                this.td_desc.innerHTML = StringFmt.Format(`Engine Parameters:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = {0} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = {1} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake) and OPR. Then
                    adjust the mass flow rate until the Thrust is just below the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.<br/>
                    `, Math.trunc(this.turbobuilder.kN * 100) / 100, Math.trunc(this.turbobuilder.tsfc * 100) / 100);
                break;
            case 1:
                this.td_desc.innerHTML = StringFmt.Format(`Engine Parameters:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = {0} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = {1} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.
                    `, Math.trunc(this.turbobuilder.kN * 100) / 100, Math.trunc(this.turbobuilder.tsfc * 100) / 100);
                break;
            case 2:
                this.td_desc.innerHTML = StringFmt.Format(`Engine Parameters:<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Thrust = {0} kN<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;Fuel Consumption = {1} g/(kN*s)<br/>
                    <br/>
                    For a real engine, set the era, total diameter of the largest fan, Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Thrust is just below
                    the rated takeoff thrust.<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.
                    `, Math.trunc(this.turbobuilder.kN * 100) / 100, Math.trunc(this.turbobuilder.tsfc * 100) / 100);
                break;
            case 3:
                this.td_desc.innerHTML = StringFmt.Format(`For a real engine, set the era, total engine diameter (not intake), Bypass
                    Ratio and OPR. Then adjust the mass flow rate until the Power is just below
                    the rated takeoff power (in effective shp if available, shp if not). Note
                    that Power = 10*hp<br/>
                    <br/>
                    For a fictional engine, it is not suggested to adjust the mass flow rate.
                    `);
                break;
        }
    }
    InitElectricInputs(cell) {
        this.el_name = document.createElement("INPUT");
        this.el_era = document.createElement("SELECT");
        this.el_wind = document.createElement("SELECT");
        this.el_powi = document.createElement("INPUT");
        this.el_size = document.createElement("INPUT");
        this.el_qual = document.createElement("INPUT");
        const fs = CreateFlexSection(cell);
        FlexText("Name", this.el_name, fs);
        FlexSelect("Era", this.el_era, fs);
        FlexSelect("Winding", this.el_wind, fs);
        FlexInput("Desired Power", this.el_powi, fs);
        FlexInput("Chonk", this.el_size, fs);
        FlexInput("Quality", this.el_qual, fs);
        this.el_qual.step = "0.05";
        this.el_qual.min = "0.5";
        this.el_qual.max = "2";
        for (let e of this.electricbuilder.EraTable) {
            let opt = document.createElement("OPTION");
            opt.text = e.name;
            this.el_era.add(opt);
        }
        for (let t of this.electricbuilder.Winding) {
            let opt = document.createElement("OPTION");
            opt.text = t.name;
            this.el_wind.add(opt);
        }
        this.el_name.onchange = () => { this.electricbuilder.name = this.el_name.value; this.UpdateElectric(); };
        this.el_era.onchange = () => { this.electricbuilder.era_sel = this.el_era.selectedIndex; this.UpdateElectric(); };
        this.el_wind.onchange = () => { this.electricbuilder.winding_sel = this.el_wind.selectedIndex; this.UpdateElectric(); };
        this.el_powi.onchange = () => { this.electricbuilder.power = this.el_powi.valueAsNumber; this.UpdateElectric(); };
        this.el_size.onchange = () => { this.electricbuilder.chonk = this.el_size.valueAsNumber; this.UpdateElectric(); };
        this.el_qual.onchange = () => { this.electricbuilder.quality_fudge = this.el_qual.valueAsNumber; this.UpdateElectric(); };
    }
    InitElectricOutputs(cell) {
        this.eld_name = document.createElement("LABEL");
        this.eld_powr = document.createElement("LABEL");
        this.eld_mass = document.createElement("LABEL");
        this.eld_drag = document.createElement("LABEL");
        this.eld_rely = document.createElement("LABEL");
        this.eld_draw = document.createElement("LABEL");
        this.eld_over = document.createElement("LABEL");
        this.eld_cost = document.createElement("LABEL");
        const fs = CreateFlexSection(cell);
        FlexDisplay("Name", this.eld_name, fs);
        FlexDisplay("Power", this.eld_powr, fs);
        FlexDisplay("Mass", this.eld_mass, fs);
        FlexDisplay("Drag", this.eld_drag, fs);
        FlexDisplay("Reliability", this.eld_rely, fs);
        FlexDisplay("Charge Draw", this.eld_draw, fs);
        FlexDisplay("Overspeed", this.eld_over, fs);
        FlexDisplay("Cost", this.eld_cost, fs);
    }
    UpdateElectric() {
        this.el_name.value = this.electricbuilder.name;
        this.el_era.selectedIndex = this.electricbuilder.era_sel;
        this.el_wind.selectedIndex = this.electricbuilder.winding_sel;
        this.el_powi.valueAsNumber = this.electricbuilder.power;
        this.el_size.valueAsNumber = this.electricbuilder.chonk;
        this.el_qual.valueAsNumber = this.electricbuilder.quality_fudge;
        const estats = this.electricbuilder.EngineStats();
        BlinkIfChanged(this.eld_name, estats.name);
        BlinkIfChanged(this.eld_powr, estats.stats.power.toString());
        BlinkIfChanged(this.eld_mass, estats.stats.mass.toString());
        BlinkIfChanged(this.eld_drag, estats.stats.drag.toString());
        BlinkIfChanged(this.eld_rely, estats.stats.reliability.toString());
        BlinkIfChanged(this.eld_draw, estats.stats.charge.toString());
        BlinkIfChanged(this.eld_over, estats.overspeed.toString());
        BlinkIfChanged(this.eld_cost, estats.stats.cost.toString());
    }
    InitManual(cell) {
        this.m_name = document.createElement("INPUT");
        this.m_pwr = document.createElement("INPUT");
        this.m_mass = document.createElement("INPUT");
        this.m_drag = document.createElement("INPUT");
        this.m_rely = document.createElement("INPUT");
        this.m_cool = document.createElement("INPUT");
        this.m_over = document.createElement("INPUT");
        this.m_fuel = document.createElement("INPUT");
        this.m_alti = document.createElement("INPUT");
        this.m_torq = document.createElement("INPUT");
        this.m_rumb = document.createElement("INPUT");
        this.m_cost = document.createElement("INPUT");
        this.m_oil = document.createElement("INPUT");
        this.m_pulsejet = document.createElement("INPUT");
        this.m_turbo = document.createElement("INPUT");
        this.m_name.disabled = true;
        this.m_pwr.disabled = true;
        this.m_mass.disabled = true;
        this.m_drag.disabled = true;
        this.m_rely.disabled = true;
        this.m_cool.disabled = true;
        this.m_over.disabled = true;
        this.m_fuel.disabled = true;
        this.m_alti.disabled = true;
        this.m_torq.disabled = true;
        this.m_rumb.disabled = true;
        this.m_cost.disabled = true;
        this.m_oil.disabled = true;
        this.m_pulsejet.disabled = true;
        this.m_turbo.disabled = true;
        const fs = CreateFlexSection(cell);
        //Set up the individual stat input boxes
        FlexText("Name", this.m_name, fs);
        FlexInput("Power", this.m_pwr, fs);
        FlexInput("Mass", this.m_mass, fs);
        FlexInput("Drag", this.m_drag, fs);
        FlexInput("Reliability", this.m_rely, fs);
        FlexInput("Cooling", this.m_cool, fs);
        FlexInput("Overspeed", this.m_over, fs);
        FlexInput("Fuel Consumption", this.m_fuel, fs);
        FlexInput("Altitude", this.m_alti, fs);
        FlexInput("Torque", this.m_torq, fs);
        FlexInput("Rumble", this.m_rumb, fs);
        FlexInput("Cost", this.m_cost, fs);
        FlexCheckbox("Oil Tank", this.m_oil, fs);
        FlexCheckbox("Pulsejet", this.m_pulsejet, fs);
        FlexCheckbox("Turbocharger", this.m_turbo, fs);
        const trigger = () => { this.UpdateManual(); };
        this.m_name.onchange = trigger;
        this.m_pwr.onchange = trigger;
        this.m_mass.onchange = trigger;
        this.m_drag.onchange = trigger;
        this.m_rely.onchange = trigger;
        this.m_cool.onchange = trigger;
        this.m_over.onchange = trigger;
        this.m_fuel.onchange = trigger;
        this.m_alti.onchange = trigger;
        this.m_torq.onchange = trigger;
        this.m_rumb.onchange = trigger;
        this.m_cost.onchange = trigger;
        this.m_oil.onchange = trigger;
        this.m_pulsejet.onchange = trigger;
        this.m_turbo.onchange = trigger;
    }
    InitListManagement(cell) {
        const engine_list = GetEngineLists();
        this.list_idx = "Custom";
        this.m_list_select = document.createElement("SELECT");
        this.m_select = document.createElement("SELECT");
        this.m_delete = document.createElement("BUTTON");
        this.m_add_eb = document.createElement("BUTTON");
        this.m_add_pj = document.createElement("BUTTON");
        this.m_add_tb = document.createElement("BUTTON");
        this.m_add_el = document.createElement("BUTTON");
        this.m_save_csv = document.createElement("BUTTON");
        this.m_save = document.createElement("BUTTON");
        this.m_load = document.createElement("INPUT");
        this.m_list_create = document.createElement("BUTTON");
        this.m_list_input = document.createElement("INPUT");
        this.m_list_delete = document.createElement("BUTTON");
        this.m_list_select.onchange = () => { this.list_idx = this.m_list_select.options[this.m_list_select.selectedIndex].text; this.UpdateList(); };
        this.m_select.onchange = () => { this.SetValues(engine_list.get(this.list_idx).get(this.m_select.selectedIndex)); this.m_select.selectedIndex = -1; };
        this.m_delete.onclick = () => {
            if (!engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).remove_name(this.UpdateManual().name);
                this.list_idx = "Custom";
                this.UpdateList();
                BlinkGood(this.m_delete.parentElement);
            }
            else {
                BlinkBad(this.m_delete.parentElement);
            }
        };
        this.m_add_eb.onclick = () => {
            const inputs = this.enginebuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_eb.parentElement);
            }
            else {
                BlinkBad(this.m_add_eb.parentElement);
            }
        };
        this.m_add_pj.onclick = () => {
            const inputs = this.pulsejetbuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_pj.parentElement);
            }
            else {
                BlinkBad(this.m_add_pj.parentElement);
            }
        };
        this.m_add_tb.onclick = () => {
            const inputs = this.turbobuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_tb.parentElement);
            }
            else {
                BlinkBad(this.m_add_tb.parentElement);
            }
        };
        this.m_add_el.onclick = () => {
            const inputs = this.electricbuilder.EngineInputs();
            if (inputs.name != "Default" && !engine_list.get(this.list_idx).constant) {
                engine_list.get(this.list_idx).push(inputs);
                this.UpdateList();
                BlinkGood(this.m_add_el.parentElement);
            }
            else {
                BlinkBad(this.m_add_el.parentElement);
            }
        };
        this.m_save.onclick = () => { download(JSON.stringify(engine_list.get(this.list_idx).toJSON()), this.list_idx + ".json", "json"); };
        this.m_load.setAttribute("type", "file");
        this.m_load.multiple = false;
        this.m_load.accept = "application/JSON";
        this.m_load.onchange = (evt) => {
            if (this.m_load.files.length == 0)
                return;
            const file = this.m_load.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    const str = JSON.parse(reader.result);
                    const newelist = new EngineList(str["name"]);
                    newelist.fromJSON(str);
                    if (engine_list.has(newelist.name) && engine_list.get(newelist.name).constant) {
                        BlinkBad(this.m_load.parentElement);
                    }
                    else {
                        engine_list.set(newelist.name, newelist);
                        this.UpdateList();
                        BlinkGood(this.m_load.parentElement);
                    }
                }
                catch { }
            };
            reader.readAsText(file);
            this.m_load.value = "";
        };
        this.m_list_create.onclick = () => {
            let nlist = this.m_list_input.value;
            nlist = nlist.trim();
            nlist = nlist.replace(/\s+/g, ' ');
            if (nlist != "") {
                if (engine_list.has(nlist) && engine_list.get(nlist).constant) {
                    BlinkBad(this.m_list_create.parentElement);
                }
                else {
                    engine_list.set(nlist, new EngineList(nlist));
                    this.UpdateList();
                    BlinkGood(this.m_list_create.parentElement);
                }
            }
            else {
                BlinkBad(this.m_list_create.parentElement);
            }
        };
        this.m_list_delete.onclick = () => {
            if (this.list_idx != "" && this.list_idx != "Custom") {
                if (engine_list.get(this.list_idx).constant) {
                    BlinkBad(this.m_list_delete.parentElement);
                }
                else {
                    engine_list.delete(this.list_idx);
                    window.localStorage.removeItem("engines." + this.list_idx);
                    let namelist = JSON.parse(window.localStorage.getItem("engines_names"));
                    var idx = -1;
                    for (let i = 0; i < namelist.length; i++) {
                        if (namelist[i] == this.list_idx)
                            idx = i;
                    }
                    if (idx != -1)
                        namelist.splice(idx, 1);
                    window.localStorage.setItem("engines_names", JSON.stringify(namelist));
                    this.list_idx = "Custom";
                    this.UpdateList();
                    BlinkGood(this.m_list_delete.parentElement);
                }
            }
        };
        this.m_save_csv.onclick = () => {
            let output = [];
            let list = engine_list.get(this.list_idx);
            for (let i = 0; i < list.length; i++) {
                let estats = list.get_stats(i);
                output.push({
                    name: estats.name,
                    power: estats.stats.power,
                    mass: estats.stats.mass,
                    drag: estats.stats.drag,
                    cooling: estats.stats.cooling,
                    reliability: estats.stats.reliability,
                    fuelconsumption: estats.stats.fuelconsumption,
                    overspeed: estats.overspeed,
                    cost: estats.stats.cost,
                });
            }
            const json2csv = new JSON2CSV();
            download(json2csv.convert(output, { separator: ',', flatten: true, output_csvjson_variant: false }), this.list_idx + ".csv", "csv");
        };
        CreateSelect("Lists", this.m_list_select, cell);
        CreateSelect("Engines", this.m_select, cell);
        cell.appendChild(document.createElement("BR"));
        CreateButton("Save Engine List", this.m_save, cell);
        CreateButton("Load Engine List", this.m_load, cell);
        CreateButton("Add From Engine Builder", this.m_add_eb, cell);
        CreateButton("Add From Pulsejet Builder", this.m_add_pj, cell);
        CreateButton("Add From Turbine Builder", this.m_add_tb, cell);
        // CreateButton("Add From Electric Builder", this.m_add_el, cell);
        CreateButton("Delete Engine", this.m_delete, cell);
        const span = document.createElement("SPAN");
        const txtSpan = document.createElement("LABEL");
        this.m_list_create.hidden = true;
        this.m_list_create.id = GenerateID();
        txtSpan.htmlFor = this.m_list_create.id;
        txtSpan.innerHTML = "<b>&nbsp;" + "Create List" + "&nbsp;&nbsp;</b>";
        txtSpan.classList.add("lbl_action");
        txtSpan.classList.add("btn_th");
        span.appendChild(txtSpan);
        span.appendChild(this.m_list_create);
        span.appendChild(this.m_list_input);
        cell.appendChild(span);
        cell.appendChild(document.createElement("BR"));
        cell.appendChild(document.createElement("BR"));
        CreateButton("Delete List", this.m_list_delete, cell);
        CreateButton("Save Engine List as CSV", this.m_save_csv, cell);
        this.UpdateList();
    }
    UpdateList() {
        const engine_list = GetEngineLists();
        var l_idx = this.m_list_select.selectedIndex;
        while (this.m_list_select.options.length > 0) {
            this.m_list_select.options.remove(this.m_list_select.options.length - 1);
        }
        for (let key of engine_list.keys()) {
            let opt = document.createElement("OPTION");
            opt.text = key;
            this.m_list_select.add(opt);
            if (key == this.list_idx)
                l_idx = this.m_list_select.options.length - 1;
        }
        this.m_list_select.selectedIndex = l_idx;
        var idx = this.m_select.selectedIndex;
        while (this.m_select.options.length > 0) {
            this.m_select.options.remove(this.m_select.options.length - 1);
        }
        for (let i = 0; i < engine_list.get(this.list_idx).length; i++) {
            let opt = document.createElement("OPTION");
            opt.text = engine_list.get(this.list_idx).get(i).name;
            this.m_select.add(opt);
        }
        if (idx >= engine_list.get(this.list_idx).length) {
            idx = engine_list.get(this.list_idx).length - 1;
        }
        this.m_select.selectedIndex = idx;
    }
    UpdateManual() {
        const e_stats = new EngineStats();
        e_stats.name = this.m_name.value;
        e_stats.stats.power = this.m_pwr.valueAsNumber;
        e_stats.stats.mass = this.m_mass.valueAsNumber;
        e_stats.stats.drag = this.m_drag.valueAsNumber;
        e_stats.stats.reliability = this.m_rely.valueAsNumber;
        e_stats.stats.cooling = this.m_cool.valueAsNumber;
        e_stats.overspeed = this.m_over.valueAsNumber;
        e_stats.stats.fuelconsumption = this.m_fuel.valueAsNumber;
        e_stats.altitude = this.m_alti.valueAsNumber;
        e_stats.torque = this.m_torq.valueAsNumber;
        e_stats.rumble = this.m_rumb.valueAsNumber;
        e_stats.stats.cost = this.m_cost.valueAsNumber;
        e_stats.oiltank = this.m_oil.checked;
        e_stats.pulsejet = this.m_pulsejet.checked;
        if (this.m_turbo.checked)
            e_stats.stats.reqsections = 1;
        e_stats.Verify();
        return e_stats;
    }
    SetValues(e_input) {
        const e_stats = e_input.PartStats();
        switch (e_input.engine_type) {
            case ENGINE_TYPE.PROPELLER: {
                this.enginebuilder.name = e_input.name;
                this.enginebuilder.era_sel = e_input.era_sel;
                this.enginebuilder.cool_sel = e_input.type;
                this.enginebuilder.engine_displacement = e_input.displacement;
                this.enginebuilder.compression_ratio = e_input.compression;
                this.enginebuilder.num_cyl_per_row = e_input.cyl_per_row;
                this.enginebuilder.num_rows = e_input.rows;
                this.enginebuilder.rpm_boost = e_input.RPM_boost;
                this.enginebuilder.material_fudge = e_input.material_fudge;
                this.enginebuilder.quality_fudge = e_input.quality_fudge;
                for (let i = 0; i < this.enginebuilder.upg_sel.length; i++) {
                    this.enginebuilder.upg_sel[i] = e_input.upgrades[i];
                }
                this.enginebuilder.compressor_type = e_input.compressor_type;
                this.enginebuilder.compressor_count = e_input.compressor_count;
                this.enginebuilder.min_IAF = e_input.min_IdealAlt;
                this.UpdateEngine();
                break;
            }
            case ENGINE_TYPE.PULSEJET: {
                this.pulsejetbuilder.era_sel = e_input.era_sel;
                this.pulsejetbuilder.valve_sel = e_input.type;
                this.pulsejetbuilder.desired_power = e_input.power;
                this.pulsejetbuilder.build_quality = e_input.quality_cost;
                this.pulsejetbuilder.overall_quality = e_input.quality_rely;
                this.pulsejetbuilder.starter = e_input.starter;
                this.UpdatePulsejet();
                break;
            }
            case ENGINE_TYPE.TURBOMACHINERY: {
                this.turbobuilder.name = e_input.name;
                this.turbobuilder.era_sel = e_input.era_sel;
                this.turbobuilder.type_sel = e_input.type;
                this.turbobuilder.diameter = e_input.diameter;
                this.turbobuilder.compression_ratio = e_input.compression_ratio;
                this.turbobuilder.bypass_ratio = e_input.bypass_ratio;
                this.turbobuilder.flow_adjustment = e_input.flow_adjustment;
                this.turbobuilder.afterburner = e_input.upgrades[0];
                this.UpdateTurboX();
                break;
            }
            case ENGINE_TYPE.ELECTRIC: {
                this.electricbuilder.name = e_input.name;
                this.electricbuilder.era_sel = e_input.era_sel;
                this.electricbuilder.winding_sel = e_input.winding_sel;
                this.electricbuilder.power = e_input.power;
                this.electricbuilder.chonk = e_input.material_fudge;
                this.electricbuilder.quality_fudge = e_input.quality_fudge;
                this.UpdateElectric();
                break;
            }
            default:
                throw "engine_builder.SetValues New Engine Type";
        }
        this.m_name.value = e_stats.name;
        this.m_pwr.valueAsNumber = e_stats.stats.power;
        this.m_mass.valueAsNumber = e_stats.stats.mass;
        this.m_drag.valueAsNumber = e_stats.stats.drag;
        this.m_rely.valueAsNumber = e_stats.stats.reliability;
        this.m_cool.valueAsNumber = e_stats.stats.cooling;
        this.m_over.valueAsNumber = e_stats.overspeed;
        this.m_fuel.valueAsNumber = e_stats.stats.fuelconsumption;
        this.m_alti.valueAsNumber = e_stats.altitude;
        this.m_torq.valueAsNumber = e_stats.torque;
        this.m_rumb.valueAsNumber = e_stats.rumble;
        this.m_cost.valueAsNumber = e_stats.stats.cost;
        this.m_oil.checked = e_stats.oiltank;
        this.m_pulsejet.checked = e_stats.pulsejet;
        this.m_turbo.checked = e_stats.stats.reqsections > 0;
    }
    SelectEngine(num) {
        this.SetValues(GetEngineLists().get(this.list_idx).get(num));
    }
}

/******/ })()
;