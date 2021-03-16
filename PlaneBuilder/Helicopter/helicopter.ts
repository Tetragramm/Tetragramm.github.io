// /// <reference path="../impl/Aircraft.ts" />
// /// <reference path="../disp/Tools.ts" />
/// <reference path="../disp/Aircraft.ts" />
/// <reference path="../lz/lz-string.ts" />
// /// <reference path="../string/index.ts" />
// /// <reference path="../scroll/scroll.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var lang = sp.get("lang");

    if (qp) {
        try {
            var str = LZString.decompressFromEncodedURIComponent(qp);
            var arr = _stringToArrayBuffer(str);
            var des = new Deserialize(arr);
            if (des.version < 11.95) {
                //Redirect
            }
            else {
                //Check for acft_type
            }
        } catch (e) { console.log("Compressed Query Parameter Failed."); console.log(e); }
    }

    window.history.replaceState(null, null, "/PlaneBuilder/index.html" + location.search);
    window.history.go();
}
window.addEventListener("DOMContentLoaded", init);

// var hash = "";
// function SetScroll(ev) {
//     const IDs = ["Era", "Cockpit", "Passengers", "Engines", "Frames", "Tail", "Wings", "Rotors", "Stabilizers", "ControlSurfaces", "Reinforcements", "Weapons", "Load", "Landing_Gear", "Accessories", "Propeller", "Optimization", "Stats", "Flight"];
//     var newhash = "";
//     var off = window.pageYOffset;
//     for (let id of IDs) {
//         if (off > document.getElementById(id).offsetTop) {
//             newhash = id;
//         } else {
//             break;
//         }
//     }
//     if (hash != newhash) {
//         hash = newhash;
//         window.history.replaceState(null, null, "index.html#" + newhash);
//     }
// }

var parts_JSON: JSON;
var engine_JSON: JSON;
var weapon_JSON: JSON;
var aircraft_model: Aircraft;
var aircraft_display: Aircraft_HTML;
var engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);
var local: Localization;
var enable_anim = false;