
// MIT License

// Copyright(c) 2020 David Császár
// https://github.com/Scrivito/scroll-to-fragment

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files(the "Software"), to deal
//   in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and / or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


interface Options {
  getElement?: (fragmentId: string) => Element | undefined;
  scrollIntoView?: (element: Element) => void;
}

function scrollToFragment(options: Options = {}) {
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
  if (unlistenHistory) unlistenHistory();
  unlistenHistory = undefined;
  documentObserver = undefined;
}

function startObserving() {
  stopObserving();
  if (!getLocation().hash) return;

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

function addStopListener(eventName: string) {
  document.addEventListener(eventName, stopObserving);
}

function removeStopListener(eventName: string) {
  document.removeEventListener(eventName, stopObserving);
}

function handleDocumentClick(event: Event) {
  if (event.defaultPrevented) return;

  const anchor = closestAIncludingSelf(event.target as HTMLElement);
  if (!anchor || !anchor.hash) return;
  if (anchor.pathname === getLocation().pathname) throttle(startObserving);
}

function closestAIncludingSelf(element?: HTMLElement) {
  let target = element;
  while (target && target.nodeName !== "A") target = target.parentElement;
  return target as HTMLAnchorElement | void;
}

function handleDomMutation() {
  throttle(adjustScrollPosition);
}

function adjustScrollPosition() {
  const hash = getLocation().hash;
  if (!hash) return;

  const fragmentId = decodeURIComponent(hash.substring(1));
  console.log("fragmentID = " + fragmentId);
  const element = getElement.call(null, fragmentId);
  if (element) scrollIntoView.call(null, element);
}

function getLocation() {
  return location;
}

function getElementById(id: string) {
  return document.getElementById(id);
}

function defaultScrollIntoView(element: Element) {
  element.scrollIntoView();
}

function throttle(callback: () => void) {
  cancelAnimationFrame(throttleRequestId);
  throttleRequestId = requestAnimationFrame(callback);
}

let getElement: Options["getElement"];
let scrollIntoView: Options["scrollIntoView"];

let unlistenHistory: () => void | undefined;
let documentObserver: MutationObserver | undefined;
let observeTimeout: number | undefined;
let throttleRequestId: number | undefined;

const OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  childList: true,
  subtree: true,
};

const OBSERVE_TIMEOUT_MS = 10000;
const STOP_EVENTS = ["selectstart", "touchend", "wheel"];
