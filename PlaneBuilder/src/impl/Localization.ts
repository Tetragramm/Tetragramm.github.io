import { StringFmt } from "../string/index";
import * as string_JSON from "../strings.json";

class Localization {
  private languages: any;
  private lang = "en";

  public LoadLanguages(lang: any) {
    this.languages = lang; //comment
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

export const localization = new Localization();
localization.LoadLanguages(string_JSON);

export function lu(s: string, ...args: any[]): string {
  return StringFmt.Format(localization.e(s), ...args);
}
