/// <reference path="./impl/Aircraft.ts" />
/// <reference path="./disp/Tools.ts" />
/// <reference path="./disp/Aircraft.ts" />

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
}

const init = () => {
    const sp = new URLSearchParams(location.search);
    var qp = sp.get("json");
    var ihash = window.location.hash;
    location.hash = "";
    loadJSON('/PlaneBuilder/parts.json', (part_resp) => {

        // Parse JSON string into object
        let acft_data = window.localStorage.aircraft;
        parts_JSON = JSON.parse(part_resp);

        loadJSON('/PlaneBuilder/engines.json', (engine_resp) => {
            engine_json = JSON.parse(engine_resp);
            loadJSON('/PlaneBuilder/weapons.json', (weapon_resp) => {
                weapon_json = JSON.parse(weapon_resp);
                aircraft_model = new Aircraft(parts_JSON, engine_json, weapon_json, true);
                aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);

                var loaded = false;
                if (qp && !loaded) {
                    console.log("Used Query Parameter");
                    try {
                        var str = LZString.decompressFromEncodedURIComponent(qp);
                        var arr = _stringToArrayBuffer(str);
                        var des = new Deserialize(arr);
                        aircraft_model.deserialize(des);
                        aircraft_model.CalculateStats();
                        loaded = true;
                    } catch { console.log("Compressed Query Parameter Failed."); aircraft_model.Reset(); }
                }
                if (acft_data && !loaded) {
                    console.log("Used Saved Data");
                    try {
                        loaded = aircraft_model.fromJSON(JSON.parse(acft_data));
                        aircraft_model.CalculateStats();
                    } catch { console.log("Saved Data Failed."); aircraft_model.Reset(); }
                }

                aircraft_model.CalculateStats();

                location.hash = ihash;
                window.onscroll = SetScroll;
            });
        });
    });
}
window.onload = init;

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
                    if (off > document.getElementById("Propeller").offsetTop) {
                        newhash = "Propeller";
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

function _arrayBufferToString(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

function _stringToArrayBuffer(str: string) {
    var bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes.buffer;
}

var parts_JSON: JSON;
var engine_json: JSON;
var weapon_json: JSON;
var aircraft_model: Aircraft;
var aircraft_display: Aircraft_HTML;
