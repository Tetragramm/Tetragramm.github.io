import { StringFmt } from "../string/index";

class Localization {
  private languages: JSON;
  private lang = "en";
  constructor() {
  }

  public LoadLanguages(lang: JSON) {
    this.languages = lang;
  }

  public GetLanguages() {
    const lang = [];
    for (const elem of this.languages["languages"]) {
      lang.push(elem);
    }
    return lang;
  }

  public SetCurrentLanguage(lang: string) {
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
      console.error("Failed to find " + key);
      return "!" + key + "!";
    }
  }
}


export var localization = new Localization();

export function lu(s: string, ...args: any[]): string {
  return StringFmt.Format(localization.e(s), ...args);
}
