requirejs.config({
    paths: {
        ko: 'knockout-3.5.1',
        jquery: 'jquery-2.1.4.min'
    }
});

requirejs(['plane', 'ko', 'jquery'], function (modelConstructor, ko, $) {
    var sp = new URLSearchParams(location.search);
    var link_state = sp.get("json");
    if(link_state){
        window.localStorage.setItem("planeState", atob(link_state));
        sp.delete("json");
        window.history.replaceState(null, null, "index.html");
    }
        
    const planeState = JSON.parse(window.localStorage.getItem("planeState"));
    var model = modelConstructor(planeState);

    ko.applyBindings(model);
});