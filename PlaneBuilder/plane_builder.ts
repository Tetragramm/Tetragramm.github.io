/// <reference path="./impl/Aircraft.ts" />
/// <reference path="./disp/Tools.ts" />
/// <reference path="./disp/Aircraft.ts" />
/// <reference path="./lz/lz-string.ts" />
/// <reference path="./string/index.ts" />
/// <reference path="./scroll/scroll.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var lang = sp.get("lang");

    var jsons = ['/Helicopter/strings.json', '/Helicopter/parts.json', '/Helicopter/engines.json', '/Helicopter/weapons.json'];
    // var jsons = ['/PlaneBuilder/strings.json', '/PlaneBuilder/parts.json', '/PlaneBuilder/engines.json', '/PlaneBuilder/weapons.json'];
    var proms = jsons.map(d => fetch(d));
    Promise.all(proms)
        .then(ps => Promise.all(ps.map(p => p.json())))
        .then(
            resp => {
                var string_JSON = resp[0];
                parts_JSON = resp[1];
                engine_JSON = resp[2];
                weapon_JSON = resp[3];
                //Strings bit
                local = new Localization(string_JSON);
                if (lang) {
                    local.SetLanguages(lang);
                } else if (window.localStorage.language) {
                    local.SetLanguages(window.localStorage.language);
                }

                //Parts bit
                let acft_data = window.localStorage.aircraft;

                //Engine bit
                var nameliststr = window.localStorage.getItem("engines_names");
                var namelist = [];
                if (nameliststr) {
                    namelist = JSON.parse(nameliststr);
                    for (let n of namelist) {
                        engine_list.set(n, new EngineList(n));
                    }
                }


                for (let el of engine_JSON["lists"]) {
                    if (!engine_list.has(el["name"]))
                        engine_list.set(el["name"], new EngineList(el["name"]));
                    if (el["name"] != "Custom") {
                        engine_list.get(el["name"]).fromJSON(el, true);
                        engine_list.get(el["name"]).SetConstant();
                    } else {
                        engine_list.get(el["name"]).fromJSON(el, false);
                    }
                }

                //Weapons bit
                aircraft_model = new Aircraft(parts_JSON, weapon_JSON, true);
                aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);

                var loaded = false;
                if (qp && !loaded) {
                    console.log("Used Query Parameter");
                    try {
                        var str = LZString.decompressFromEncodedURIComponent(qp);
                        var arr = _stringToArrayBuffer(str);
                        var des = new Deserialize(arr);
                        aircraft_model.deserialize(des);
                        loaded = true;
                    } catch (e) { console.log("Compressed Query Parameter Failed."); console.log(e); aircraft_model.Reset(); }
                }
                if (acft_data && !loaded) {
                    console.log("Used Saved Data");
                    try {
                        loaded = aircraft_model.fromJSON(JSON.parse(acft_data));
                    } catch { console.log("Saved Data Failed."); aircraft_model.Reset(); }
                }

                aircraft_model.CalculateStats();
                enable_anim = true;
            }
        );

    window.addEventListener("load", () => {
        scrollToFragment();
        setTimeout(() => { window.onscroll = SetScroll; }, 1000);
    });
}
window.addEventListener("DOMContentLoaded", init);

var hash = "";
function SetScroll(ev) {
    const IDs = ["Era", "Cockpit", "Passengers", "Engines", "Frames", "Tail", "Wings", "Rotors", "Stabilizers", "ControlSurfaces", "Reinforcements", "Weapons", "Load", "Landing_Gear", "Accessories", "Propeller", "Optimization", "Stats", "Flight"];
    var newhash = "";
    var off = window.pageYOffset;
    for (let id of IDs) {
        if (off > document.getElementById(id).offsetTop) {
            newhash = id;
        } else {
            break;
        }
    }
    if (hash != newhash) {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#" + newhash);
    }
}

var parts_JSON: JSON;
var engine_JSON: JSON;
var weapon_JSON: JSON;
var aircraft_model: Aircraft;
var aircraft_display: Aircraft_HTML;
var engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);
var local: Localization;
var enable_anim = false;