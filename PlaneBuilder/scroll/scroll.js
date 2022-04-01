// MIT License
export function scrollToFragment(options = {}) {
    unmount();
    getElement = options.getElement || getElementById;
    scrollIntoView = options.scrollIntoView || defaultScrollIntoView;
    mount();
}
function mount() {
    documentObserver = new MutationObserver(handleDomMutation);
    addEventListener("click", handleDocumentClick);
    unlistenHistory = undefined;
    startObserving();
}
function unmount() {
    stopObserving();
    removeEventListener("click", handleDocumentClick);
    if (unlistenHistory)
        unlistenHistory();
    unlistenHistory = undefined;
    documentObserver = undefined;
}
function startObserving() {
    stopObserving();
    if (!getLocation().hash)
        return;
    STOP_EVENTS.forEach(addStopListener);
    documentObserver?.observe(document, OBSERVER_CONFIG);
    adjustScrollPosition();
    observeTimeout = setTimeout(stopObserving, OBSERVE_TIMEOUT_MS);
}
function stopObserving() {
    clearTimeout(observeTimeout);
    cancelAnimationFrame(throttleRequestId);
    documentObserver?.disconnect();
    STOP_EVENTS.forEach(removeStopListener);
}
function addStopListener(eventName) {
    document.addEventListener(eventName, stopObserving);
}
function removeStopListener(eventName) {
    document.removeEventListener(eventName, stopObserving);
}
function handleDocumentClick(event) {
    if (event.defaultPrevented)
        return;
    const anchor = closestAIncludingSelf(event.target);
    if (!anchor || !anchor.hash)
        return;
    if (anchor.pathname === getLocation().pathname)
        throttle(startObserving);
}
function closestAIncludingSelf(element) {
    let target = element;
    while (target && target.nodeName !== "A")
        target = target.parentElement;
    return target;
}
function handleDomMutation() {
    throttle(adjustScrollPosition);
}
function adjustScrollPosition() {
    const hash = getLocation().hash;
    if (!hash)
        return;
    const fragmentId = decodeURIComponent(hash.substring(1));
    const element = getElement.call(null, fragmentId);
    if (element)
        scrollIntoView.call(null, element);
}
function getLocation() {
    return location;
}
function getElementById(id) {
    return document.getElementById(id);
}
function defaultScrollIntoView(element) {
    element.scrollIntoView();
}
function throttle(callback) {
    cancelAnimationFrame(throttleRequestId);
    throttleRequestId = requestAnimationFrame(callback);
}
let getElement;
let scrollIntoView;
let unlistenHistory;
let documentObserver;
let observeTimeout;
let throttleRequestId;
const OBSERVER_CONFIG = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
};
const OBSERVE_TIMEOUT_MS = 10000;
const STOP_EVENTS = ["selectstart", "touchend", "wheel"];
