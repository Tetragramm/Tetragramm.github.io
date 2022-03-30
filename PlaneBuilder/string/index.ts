
// MIT License

// Copyright(c) 2017 Sven Ulrich
// https://github.com/iwt-svenulrich/typescript-string-operations

// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files(the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

export class StringFmt {
    private static readonly regexNumber = /{(\d+(:\w*)?)}/g;
    private static readonly regexObject = /{(\w+(:\w*)?)}/g;

    public static Empty = '';

    public static IsNullOrWhiteSpace(value: string): boolean {
        try {
            if (value == null || value == 'undefined') {
                return true;
            }

            return value.toString().replace(/\s/g, '').length < 1;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }

    public static Join(delimiter: string, ...args: (string | Record<string, unknown> | Array<any>)[]): string {
        try {
            const firstArg = args[0];
            if (Array.isArray(firstArg) || firstArg instanceof Array) {
                let tempString = StringFmt.Empty;
                const count = 0;

                for (let i = 0; i < firstArg.length; i++) {
                    const current = firstArg[i];
                    if (i < firstArg.length - 1) {
                        tempString += current + delimiter;
                    }
                    else {
                        tempString += current;
                    }
                }

                return tempString;
            }
            else if (typeof firstArg === 'object') {
                let tempString = StringFmt.Empty;
                const objectArg = firstArg;
                const keys = Object.keys(firstArg); //get all Properties of the Object as Array
                keys.forEach(element => { tempString += (<any>objectArg)[element] + delimiter; });
                tempString = tempString.slice(0, tempString.length - delimiter.length); //remove last delimiter
                return tempString;
            }

            const stringArray = <string[]>args;

            return StringFmt.join(delimiter, ...stringArray);
        }
        catch (e) {
            console.log(e);
            return StringFmt.Empty;
        }
    }

    public static Format(format: string, ...args: any[]): string {
        try {
            if (format.match(StringFmt.regexNumber)) {
                return StringFmt.format(StringFmt.regexNumber, format, args);
            }

            if (format.match(StringFmt.regexObject)) {
                return StringFmt.format(StringFmt.regexObject, format, args, true);
            }

            return format;
        }
        catch (e) {
            console.log(e);
            return StringFmt.Empty;
        }
    }

    private static format(regex: any, format: string, args: any, parseByObject = false): string {
        return format.replace(regex, function (match, x) { //0
            const s = match.split(':');
            if (s.length > 1) {
                x = s[0].replace('{', '');
                match = s[1].replace('}', ''); //U
            }

            let arg;
            if (parseByObject) {
                arg = args[0][x];
            }
            else {
                arg = args[x];
            }

            if (arg == null || arg == undefined || match.match(/{\d+}/)) {
                return arg;
            }

            arg = StringFmt.parsePattern(match, arg);
            return typeof arg != 'undefined' && arg != null ? arg : StringFmt.Empty;
        });
    }

    private static parsePattern(match: 'L' | 'U' | 'd' | 's' | 'n' | 'x' | 'X' | string, arg: string | Date | number | any): string {
        switch (match) {
            case 'L': {
                arg = arg.toLocaleLowerCase();
                return arg;
            }
            case 'U': {
                arg = arg.toLocaleUpperCase();
                return arg;
            }
            case 'd': {
                if (typeof (arg) === 'string') {
                    return StringFmt.getDisplayDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return StringFmt.Format('{0:00}.{1:00}.{2:0000}', arg.getDate(), arg.getMonth(), arg.getFullYear());
                }
                break;
            }
            case 's': {
                if (typeof (arg) === 'string') {
                    return StringFmt.getSortableDateFromString(arg);
                }
                else if (arg instanceof Date) {
                    return StringFmt.Format('{0:0000}-{1:00}-{2:00}', arg.getFullYear(), arg.getMonth(), arg.getDate());
                }
                break;
            }
            case 'n': {//Tausender Trennzeichen
                if (typeof (arg) !== "string")
                    arg = arg.toString();
                const replacedString = arg.replace(/,/g, '.');
                if (isNaN(parseFloat(replacedString)) || replacedString.length <= 3) {
                    break;
                }

                const numberparts = replacedString.split(/[^0-9]+/g);
                let parts = numberparts;

                if (numberparts.length > 1) {
                    parts = [StringFmt.join('', ...(numberparts.splice(0, numberparts.length - 1))), numberparts[numberparts.length - 1]];
                }

                const integer = parts[0];

                const mod = integer.length % 3;
                let output = (mod > 0 ? (integer.substring(0, mod)) : StringFmt.Empty);
                const firstGroup = output;
                const remainingGroups = integer.substring(mod).match(/.{3}/g);
                output = output + '.' + StringFmt.Join('.', remainingGroups);
                arg = output + (parts.length > 1 ? ',' + parts[1] : '');
                return arg;
            }
            case 'x': {
                return this.decimalToHexString(arg);
            }
            case 'X': {
                return this.decimalToHexString(arg, true)
            }
            default: {
                break;
            }
        }

        if ((typeof (arg) === 'number' || !isNaN(arg)) && !isNaN(+match) && !StringFmt.IsNullOrWhiteSpace(arg)) {
            return StringFmt.formatNumber(arg, match);
        }

        return arg;
    }

    private static decimalToHexString(value: string, upperCase = false) {
        const parsed = parseFloat(value as string);
        const hexNumber = parsed.toString(16);
        return upperCase ? hexNumber.toLocaleUpperCase() : hexNumber;
    }

    private static getDisplayDateFromString(input: string): string {
        const splitted: string[] = input.split('-');

        if (splitted.length <= 1) {
            return input;
        }

        var day = splitted[splitted.length - 1];
        const month = splitted[splitted.length - 2];
        const year = splitted[splitted.length - 3];
        day = day.split('T')[0];
        day = day.split(' ')[0];

        return `${day}.${month}.${year}`;
    }

    private static getSortableDateFromString(input: string): string {
        const splitted = input.replace(',', '').split('.');
        if (splitted.length <= 1) {
            return input;
        }

        const times = splitted[splitted.length - 1].split(' ');
        let time = StringFmt.Empty;
        if (times.length > 1) {
            time = times[times.length - 1];
        }

        const year = splitted[splitted.length - 1].split(' ')[0];
        const month = splitted[splitted.length - 2];
        const day = splitted[splitted.length - 3];
        let result = `${year}-${month}-${day}`

        if (!StringFmt.IsNullOrWhiteSpace(time) && time.length > 1) {
            result += `T${time}`;
        }
        else {
            result += "T00:00:00";
        }

        return result;
    }

    private static formatNumber(input: number, formatTemplate: string): string {
        const count = formatTemplate.length;
        const stringValue = input.toString();
        if (count <= stringValue.length) {
            return stringValue;
        }

        let remainingCount = count - stringValue.length;
        remainingCount += 1; //Array must have an extra entry

        return new Array(remainingCount).join('0') + stringValue;
    }

    private static join(delimiter: string, ...args: string[]): string {
        let temp = StringFmt.Empty;
        for (let i = 0; i < args.length; i++) {
            if ((typeof args[i] == 'string' && StringFmt.IsNullOrWhiteSpace(args[i]))
                || (typeof args[i] != "number" && typeof args[i] != "string")) {
                continue;
            }

            const arg = "" + args[i];
            temp += arg;
            for (let i2 = i + 1; i2 < args.length; i2++) {
                if (StringFmt.IsNullOrWhiteSpace(args[i2])) {
                    continue;
                }

                temp += delimiter;
                i = i2 - 1;
                break;
            }
        }

        return temp;
    }
}

class StringBuilder {
    public Values: string[];

    constructor(value?: string) {
        this.Values = [];

        if (!StringFmt.IsNullOrWhiteSpace(value)) {
            this.Values = new Array(value);
        }
    }

    public ToString() {
        return this.Values.join('');
    }

    public Append(value: string) {
        this.Values.push(value);
    }

    public AppendLine(value: string) {
        this.Values.push('\r\n' + value);
    }

    public AppendFormat(format: string, ...args: any[]) {
        this.Values.push(StringFmt.Format(format, ...args));
    }

    public AppendLineFormat(format: string, ...args: any[]) {
        this.Values.push("\r\n" + StringFmt.Format(format, ...args));
    }

    public Clear() {
        this.Values = [];
    }
}
