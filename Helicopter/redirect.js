const init = () => {
    window.history.replaceState(null, null, "/PlaneBuilder/engine.html" + location.search);
    window.history.go();
};
window.addEventListener("DOMContentLoaded", init);