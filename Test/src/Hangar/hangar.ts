import { runHangar } from "./hangar_core";
import { storagePrefix } from "../wasm/deployment";

window.addEventListener("DOMContentLoaded", () => runHangar(storagePrefix()));
