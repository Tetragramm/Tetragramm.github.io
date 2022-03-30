import { StringFmt } from "../string/index.js";
class Localization {
    constructor() {
        this.lang = "en";
    }
    LoadLanguages(lang) {
        this.languages = lang;
    }
    GetLanguages() {
        const lang = [];
        for (const elem of this.languages["languages"]) {
            lang.push(elem);
        }
        return lang;
    }
    SetCurrentLanguage(lang) {
        if (this.languages[lang]) {
            this.lang = lang;
        }
    }
    e(key) {
        if (this.languages[this.lang][key]) {
            return this.languages[this.lang][key];
        }
        else if (this.languages["en"][key]) {
            return this.languages["en"][key];
        }
        else {
            console.error("Failed to find " + key);
            return "!" + key + "!";
        }
    }
}
export var localization = new Localization();
export function lu(s, ...args) {
    return StringFmt.Format(localization.e(s), ...args);
}
