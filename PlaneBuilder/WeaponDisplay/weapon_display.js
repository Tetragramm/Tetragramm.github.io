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

;// CONCATENATED MODULE: ./src/weapons.json
const weapons_namespaceObject = JSON.parse('{"A":[{"name":"Submachine Gun","abrv":"SMG","era":"WWI","cost":1,"mass":1,"drag":0,"damage":1,"hits":4,"ap":0,"ammo":10,"rapid":true,"manual":false,"synched":false,"shells":false,"jam":"0/1","reload":2,"size":1,"can_action":true,"can_projectile":true,"deflection":0,"warning":"SMG Warning"},{"name":"Scattergun","abrv":"SG","era":"Pioneer","cost":2,"mass":2,"drag":2,"damage":0.5,"hits":0,"ap":0,"ammo":8,"rapid":false,"manual":true,"synched":false,"shells":false,"jam":"0","reload":1,"warning":"Scattergun Warning","size":2,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Light Machine Gun","abrv":"LMG","era":"WWI","cost":2,"mass":2,"drag":1,"damage":2,"hits":4,"ap":1,"ammo":8,"rapid":true,"manual":false,"synched":false,"shells":false,"jam":"1/2","reload":2,"size":2,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Machine Gun","abrv":"MG","era":"WWI","cost":2,"mass":3,"drag":1,"damage":2,"hits":4,"ap":1,"ammo":10,"rapid":true,"manual":false,"synched":true,"shells":false,"jam":"1/2","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Balloon Gun","abrv":"BMG","era":"WWI","cost":3,"mass":3,"drag":1,"damage":2,"hits":4,"ap":0,"ammo":6,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"2/3","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":-2},{"name":"Enhanced Machine Gun","abrv":"EMG","era":"Coming Storm","cost":3,"mass":2,"drag":1,"damage":2,"hits":5,"ap":1,"ammo":8,"rapid":true,"manual":false,"synched":true,"shells":false,"jam":"0/0","reload":0,"size":2,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Enhanced Heavy Machine Gun","abrv":"EHMG","era":"Coming Storm","cost":5,"mass":3,"drag":2,"damage":4,"hits":5,"ap":2,"ammo":6,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"0/0","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Punt Gun","abrv":"PG","era":"Pioneer","cost":4,"mass":4,"drag":3,"damage":0.5,"hits":0,"ap":0,"ammo":5,"rapid":false,"manual":true,"synched":false,"shells":false,"jam":"0","reload":1,"warning":"Punt Gun Warning","size":8,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Light Repeating Cannon","abrv":"LRC","era":"WWI","cost":4,"mass":4,"drag":3,"damage":8,"hits":3,"ap":2,"ammo":6,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"2/5","reload":2,"size":8,"can_action":true,"can_projectile":true,"deflection":-3},{"name":"Heavy Cannon","abrv":"HC","era":"WWI","cost":6,"mass":5,"drag":2,"damage":16,"hits":1,"ap":2,"ammo":5,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":8,"can_action":true,"can_projectile":true,"deflection":-3},{"name":"Light Machine Cannon","abrv":"LMC","era":"Coming Storm","cost":8,"mass":4,"drag":3,"damage":8,"hits":4,"ap":4,"ammo":6,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"0/0","reload":0,"size":8,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Heavy Machine Cannon","abrv":"HMC","era":"WWII","cost":12,"mass":5,"drag":4,"damage":12,"hits":3,"ap":4,"ammo":5,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"0/0","reload":0,"size":8,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Fliergerflammenwerfer","abrv":"FFW","era":"WWI","cost":5,"mass":1,"drag":3,"damage":0.5,"hits":0,"ap":0,"ammo":0,"rapid":false,"manual":false,"synched":false,"shells":false,"jam":"0/0","reload":0,"warning":"Fliergerflammenwerfer Warning","size":8,"can_action":false,"can_projectile":false,"deflection":0},{"name":"Recoilless Cannon","abrv":"RC","era":"WWI","cost":5,"mass":8,"drag":3,"damage":30,"hits":1,"ap":3,"ammo":3,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":16,"can_action":true,"can_projectile":true,"deflection":-5},{"name":"Autocannon","abrv":"AC","era":"WWII","cost":15,"mass":8,"drag":5,"damage":24,"hits":2,"ap":5,"ammo":2,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"0/0","reload":0,"size":16,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Battle Cannon","abrv":"BC","era":"WWII","cost":15,"mass":40,"drag":8,"damage":24,"hits":2,"ap":5,"ammo":1,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":16,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Precision Rifle","abrv":"PR","era":"WWI","mass":1,"drag":1,"cost":2,"damage":5,"hits":10,"ap":2,"ammo":8,"rapid":false,"manual":true,"synched":false,"shells":true,"jam":"0","reload":1,"size":2,"can_action":false,"can_projectile":false,"warning":"Precision Rifle Warning","deflection":0},{"name":"Lightning Arc","abrv":"LA","era":"Himmilgard","cost":8,"mass":5,"drag":3,"damage":0,"hits":0,"ap":0,"ammo":0,"rapid":false,"manual":false,"synched":false,"shells":false,"jam":"0","reload":0,"size":16,"can_action":false,"can_projectile":false,"warning":"Lightning Arc Warning","deflection":0},{"name":"Harpoon Launcher","abrv":"HL","era":"Himmilgard","cost":3,"mass":3,"drag":2,"damage":4,"hits":1,"ap":1,"ammo":2,"rapid":false,"manual":false,"synched":false,"shells":false,"jam":0,"reload":1,"size":4,"can_action":false,"can_projectile":false,"warning":"Harpoon Launcher Warning","deflection":0},{"name":"Heavy Machine Gun","abrv":"HMG","era":"WWI","cost":4,"mass":4,"drag":2,"damage":4,"hits":4,"ap":2,"ammo":5,"rapid":true,"manual":false,"synched":true,"shells":true,"jam":"2/3","reload":0,"size":4,"can_action":true,"can_projectile":true,"deflection":0},{"name":"Heavy Repeating Cannon","abrv":"HRC","era":"WWI","cost":10,"mass":6,"drag":4,"damage":16,"hits":2,"ap":2,"ammo":5,"rapid":true,"manual":false,"synched":false,"shells":true,"jam":"4/6","reload":2,"size":16,"can_action":true,"can_projectile":true,"deflection":-3}]}');
;// CONCATENATED MODULE: ./src/WeaponDisplay/weapon_display.ts



const init = () => {
    const sp = new URLSearchParams(location.search);
    var lang = sp.get("lang");
    //Strings bit
    if (lang) {
        localization.SetCurrentLanguage(lang);
    }
    else if (window.localStorage.language) {
        localization.SetCurrentLanguage(window.localStorage.language);
    }
    var tbl = document.getElementById("table_weap");
    let weapon_list = [];
    for (let elem of weapons_namespaceObject.A) {
        var weap = {
            name: elem["name"],
            abrv: elem["abrv"],
            era: elem["era"],
            size: elem["size"],
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
            deflection: elem["deflection"],
            cost: elem["cost"],
            mass: elem["mass"],
            drag: elem["drag"],
            warn: elem["warning"],
        };
        weapon_list.push(weap);
    }
    var era2numHh = (era) => {
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
    var pred = (a, b) => {
        var cvt2num = (l, r) => {
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
    weapon_list = weapon_list.sort(pred);
    for (let weap of weapon_list) {
        var row = tbl.insertRow();
        CreateTD(row, weap.name);
        CreateTD(row, weap.abrv);
        CreateTD(row, weap.era);
        CreateTD(row, weap.cost);
        CreateTD(row, weap.mass);
        CreateTD(row, weap.drag);
        CreateTD(row, weap.hits);
        CreateTD(row, weap.damage);
        CreateTD(row, weap.ap);
        CreateTD(row, weap.ammo);
        CreateTD(row, weap.reload);
        CreateTD(row, weap.jam);
        switch (weap.size) {
            case 1:
                CreateTD(row, "Tiny");
                break;
            case 2:
                CreateTD(row, "Light");
                break;
            case 4:
                CreateTD(row, "Medium");
                break;
            case 8:
                CreateTD(row, "Heavy");
                break;
            case 16:
                CreateTD(row, "Artillery");
                break;
        }
        var tags = "";
        if (weap.rapid)
            tags += "Rapid-Fire ";
        if (weap.Manual)
            tags += "Manual ";
        if (weap.shells)
            tags += "Shell-Firing ";
        if (!(weap.synched))
            tags += "Open-Bolt ";
        CreateTD(row, tags);
        var deflection = (weap.deflection);
        if (deflection < 0)
            CreateTD(row, "Yes, " + deflection);
        else
            CreateTD(row, "No");
        if (weap.warn)
            CreateTD(row, lu(weap.warn));
        else
            CreateTD(row, "");
    }
    var last_row = tbl.insertRow();
    CreateTH(last_row, "Name");
    CreateTH(last_row, "Abbreviation");
    CreateTH(last_row, "Era");
    CreateTH(last_row, "Cost");
    CreateTH(last_row, "Mass");
    CreateTH(last_row, "Drag");
    CreateTH(last_row, "Hits");
    CreateTH(last_row, "Damage");
    CreateTH(last_row, "AP");
    CreateTH(last_row, "Ammo");
    CreateTH(last_row, "Reload");
    CreateTH(last_row, "Jam");
    CreateTH(last_row, "Size");
    CreateTH(last_row, "Tags");
    CreateTH(last_row, "Awkward");
    CreateTH(last_row, "Notes");
};
window.onload = init;

/******/ })()
;