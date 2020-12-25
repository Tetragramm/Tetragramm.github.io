/// <reference path="./impl/Aircraft.ts" />
/// <reference path="./disp/Tools.ts" />
/// <reference path="./disp/Aircraft.ts" />
/// <reference path="./lz/lz-string.ts" />
/// <reference path="./string/index.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var ep = sp.get("engine");
    var lang = sp.get("lang");
    var ihash = window.location.hash;
    location.hash = "";

    var jsons = ['/Helicopter/strings.json', '/Helicopter/parts.json', '/Helicopter/engines.json', '/Helicopter/weapons.json'];
    var proms = jsons.map(d => fetch(d));
    Promise.all(proms)
        .then(ps => Promise.all(ps.map(p => p.json())))
        .then(
            resp => {
                var string_JSON = resp[0];
                var parts_JSON = resp[1];
                var engine_JSON = resp[2];
                var weapon_JSON = resp[3];
                //Strings bit
                local = new Localization(string_JSON);
                if (lang) {
                    local.SetLanguages(lang);
                } else if (window.localStorage.getItem("language")) {
                    local.SetLanguages(window.localStorage.getItem("language"));
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
                    engine_list.get(el["name"]).fromJSON(el, false);//TODO: Overwrite defaults
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
            }
        );

    window.onscroll = SetScroll;
    window.onload = () => {
        console.log("onload " + document.getElementById("Flight").offsetTop);
        location.hash = ihash;
        setTimeout(() => {
            // location.hash = ihash;
            console.log("Timeout " + document.getElementById("Flight").offsetTop);
        }, 500);
    };
}
init();

var hash = "";
function SetScroll(ev) {
    var newhash = "";
    var off = window.pageYOffset;
    if (off > document.getElementById("Era").offsetTop) {
        newhash = "Era";
        if (off > document.getElementById("Cockpit").offsetTop) {
            newhash = "Cockpit";
            if (off > document.getElementById("Passengers").offsetTop) {
                newhash = "Passengers";
                if (off > document.getElementById("Engines").offsetTop) {
                    newhash = "Engines";
                    if (off > document.getElementById("Frames").offsetTop) {
                        newhash = "Frames";
                        if (off > document.getElementById("Tail").offsetTop) {
                            newhash = "Tail";
                            if (off > document.getElementById("Wings").offsetTop) {
                                newhash = "Wings";
                                if (off > document.getElementById("Stabilizers").offsetTop) {
                                    newhash = "Stabilizers";
                                    if (off > document.getElementById("ControlSurfaces").offsetTop) {
                                        newhash = "ControlSurfaces";
                                        if (off > document.getElementById("Reinforcements").offsetTop) {
                                            newhash = "Reinforcements";
                                            if (off > document.getElementById("Load").offsetTop) {
                                                newhash = "Load";
                                                if (off > document.getElementById("Landing_Gear").offsetTop) {
                                                    newhash = "Landing_Gear";
                                                    if (off > document.getElementById("Accessories").offsetTop) {
                                                        newhash = "Accessories";
                                                        if (off > document.getElementById("Propeller").offsetTop) {
                                                            newhash = "Propeller";
                                                            if (off > document.getElementById("Optimization").offsetTop) {
                                                                newhash = "Optimization";
                                                                if (off > document.getElementById("Stats").offsetTop) {
                                                                    newhash = "Stats";
                                                                    if (off > document.getElementById("Flight").offsetTop) {
                                                                        newhash = "Flight";
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if (hash != newhash) {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#" + newhash);
    }
}

var parts_JSON: JSON;
var engine_json: JSON;
var weapon_json: JSON;
var aircraft_model: Aircraft;
var aircraft_display: Aircraft_HTML;
var engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);
var local: Localization;

function lu(s: string, ...args: any[]): string {
    return StringFmt.Format(local.e(s), ...args);
}