import { StringFmt } from "../string/index";
import strings_JSON from "../strings.json";

class Localization {
  private languages: JSON;
  private lang = "en";
  constructor(js: Record<string, unknown>) {
    this.languages = js;
  }

  public GetLanguages() {
    const lang = [];
    for (const elem of this.languages["languages"]) {
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
      console.error("Failed to find " + key);
      return "!" + key + "!";
    }
  }
}



export function lu(s: string, ...args: any[]): string {
  const local = new Localization(strings_JSON);
  return StringFmt.Format(local.e(s), ...args);
}
