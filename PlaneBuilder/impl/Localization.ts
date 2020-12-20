
class Localization {
    private languages: JSON;
    private lang = "en";
    constructor(js: JSON) {
        this.languages = js;
    }

    public GetLanguages() {
        var lang = [];
        for (let elem of this.languages["languages"]) {
            lang.push(elem);
        }
        return lang;
    }

    public SetLanguages(lang: string) {
        if (this.languages[lang]) {
            this.lang = lang;
        }
    }

    public e(key: string) {
        if (this.languages[this.lang][key]) {
            return this.languages[this.lang][key];
        } else if (this.languages["en"][key]) {
            return this.languages["en"][key];
        } else {
            console.log("Failed to find " + key);
            return "!" + key + "!";
        }
    }
}