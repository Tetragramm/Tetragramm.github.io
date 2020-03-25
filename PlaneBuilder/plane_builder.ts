//TODO: Copy JSON to clipboard
//TODO: Paste JSON to page
//TODO: Connect links to Rules page
//TODO: Engine as Generator
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
    loadJSON('/PlaneBuilder/parts.json', (response) => {

        // Parse JSON string into object
        let acft_data = window.localStorage.aircraft;
        let parts_JSON = JSON.parse(response);

        loadJSON('/PlaneBuilder/engines.json', (response2) => {
            engine_json = JSON.parse(response2);
            aircraft_model = new Aircraft(parts_JSON, engine_json, true);
            aircraft_display = new Aircraft_HTML(parts_JSON, aircraft_model);

            if (acft_data)
                aircraft_model.fromJSON(JSON.parse(acft_data));
        });
    });
}
window.onload = init;

var engine_json: JSON;
var aircraft_model: Aircraft;
var aircraft_display: Aircraft_HTML;
