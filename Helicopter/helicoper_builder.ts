/// <reference path="./Helicopter.ts" />
/// <reference path="./Helicopter_HTML.ts" />
/// <reference path="../Test/disp/Tools.ts" />
/// <reference path="../Test/lz/lz-string.ts" />
/// <reference path="../Test/string/index.ts" />
/// <reference path="../Test/scroll/scroll.ts" />

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var lang = sp.get("lang");

    var jsons = ['/Test/strings.json', '/Helicopter/parts.json', '/Test/engines.json', '/Test/weapons.json'];
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
                let acft_data = window.localStorage.getItem("test.helicopter");

                //Engine bit
                var nameliststr = window.localStorage.getItem("test.engines_names");
                var namelist = [];
                if (nameliststr) {
                    namelist = JSON.parse(nameliststr);
                    for (let n of namelist) {
                        n = n.trim();
                        n = n.replace(/\s+/g, ' ');
                        if (n != "") {
                            engine_list.set(n, new EngineList(n));
                        }
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
                helicopter_model = new Helicopter(parts_JSON, weapon_JSON, true);
                helicopter_display = new Helicopter_HTML(parts_JSON, helicopter_model);

                var loaded = false;
                if (qp && !loaded) {
                    console.log("Used Query Parameter");
                    try {
                        var str = LZString.decompressFromEncodedURIComponent(qp);
                        var arr = _stringToArrayBuffer(str);
                        var des = new Deserialize(arr);
                        helicopter_model.deserialize(des);
                        loaded = true;
                    } catch (e) { console.log("Compressed Query Parameter Failed."); console.log(e); helicopter_model.Reset(); }
                }
                if (acft_data && !loaded) {
                    console.log("Used Saved Data");
                    try {
                        loaded = helicopter_model.fromJSON(JSON.parse(acft_data));
                    } catch { console.log("Saved Data Failed."); helicopter_model.Reset(); }
                }

                helicopter_model.CalculateStats();
                enable_anim = true;
            }
        );

    window.addEventListener("load", () => {
        scrollToFragment();
        setTimeout(() => { window.onscroll = debounce(SetScroll, 250); }, 1000);
    });

    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            var active = this.classList.toggle("active");
            var content = this.nextElementSibling;
            content = content.nextElementSibling;
            if (!active) {
                content.style.maxHeight = "0px";
            } else {
                content.style.maxHeight = "inherit";
            }
        });
    }
}
window.addEventListener("DOMContentLoaded", init);

function debounce(callback, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(callback, delay);
    }
}

var hash = "";
function SetScroll(ev) {
    const IDs = ["Era", "Cockpit", "Passengers", "Engines", "Frames", "Tail", "Wings", "Rotors", "Stabilizers", "ControlSurfaces", "Reinforcements", "Weapons", "Load", "Landing_Gear", "Accessories", "Optimization", "Stats", "Flight"];
    var newhash = "";
    var off = window.pageYOffset;
    for (let id of IDs) {
        if (document.getElementById(id).offsetTop != 0) {
            if (off > document.getElementById(id).offsetTop) {
                newhash = id;
            } else {
                break;
            }
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
var helicopter_model: Helicopter;
var helicopter_display: Helicopter_HTML;
var engine_list = new Map<string, EngineList>([["Custom", new EngineList("Custom")]]);
var local: Localization;
var enable_anim = false;