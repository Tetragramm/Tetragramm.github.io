//TODO: Add electrics as critical component
//TODO: Manually Variable Propeller Special Rule
//TODO: Weapons
//TODO: Handle attack bonus
//TODO: High Offset Radiator requires Parasol wing
//TODO: Evaporator Radiator requires Metal wing
//TODO: Center Pusher requires tail or extended driveshafts

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
    var ihash = window.location.hash;
    location.hash = "";
    loadJSON('/PlaneBuilder/parts.json', (part_resp) => {

        // Parse JSON string into object
        let acft_data = window.localStorage.aircraft;
        parts_JSON = JSON.parse(part_resp);

        loadJSON('/PlaneBuilder/engines.json', (engine_resp) => {
            engine_json = JSON.parse(engine_resp);
            aircraft_model = new Aircraft(parts_JSON, engine_json, true);
            aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);

            if (acft_data)
                aircraft_model.fromJSON(JSON.parse(acft_data));
            
            location.hash = ihash;
            window.onscroll = SetScroll;
        });
    });
}
window.onload = init;

var hash = "";
function SetScroll(ev){
    var newhash = "";
    var off = window.pageYOffset;
    if(off > document.getElementById("Era").offsetTop){
        newhash = "Era";
        if(off > document.getElementById("Cockpit").offsetTop){
            newhash = "Cockpit";
            if(off > document.getElementById("Passengers").offsetTop){
                newhash = "Passengers";
                if(off > document.getElementById("Engines").offsetTop){
                    newhash = "Engines";
                    if(off > document.getElementById("Propeller").offsetTop){
                        newhash = "Propeller";
                        if(off > document.getElementById("Frames").offsetTop){
                            newhash = "Frames";
                            if(off > document.getElementById("Tail").offsetTop){
                                newhash = "Tail";
                                if(off > document.getElementById("Wings").offsetTop){
                                    newhash = "Wings";
                                    if(off > document.getElementById("Stabilizers").offsetTop){
                                        newhash = "Stabilizers";
                                        if(off > document.getElementById("ControlSurfaces").offsetTop){
                                            newhash = "ControlSurfaces";
                                            if(off > document.getElementById("Reinforcements").offsetTop){
                                                newhash = "Reinforcements";
                                                if(off > document.getElementById("Load").offsetTop){
                                                    newhash = "Load";
                                                    if(off > document.getElementById("Landing_Gear").offsetTop){
                                                        newhash = "Landing_Gear";
                                                        if(off > document.getElementById("Accessories").offsetTop){
                                                            newhash = "Accessories";
                                                            if(off > document.getElementById("Optimization").offsetTop){
                                                                newhash = "Optimization";
                                                                if(off > document.getElementById("Stats").offsetTop){
                                                                    newhash = "Stats";
                                                                    if(off > document.getElementById("Flight").offsetTop){
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
    if(hash != newhash)
    {
        hash = newhash;
        window.history.replaceState(null, null, "index.html#"+newhash);
    }
}

var parts_JSON: JSON;
var engine_json: JSON;
var aircraft_model: Aircraft;
var aircraft_display: Aircraft_HTML;
