/**
*
* CSVJSON.json2csv(data, options)
*
* Converts JSON to CSV
*
* Available options:
*  - separator: Character which acts as separator. For CSV use a comma (,).
*               For TSV use a tab (\t).
*  - flatten: Boolean indicating whether to flatten nested arrays or not.
*             Optional. Default false.
*  - output_csvjson_variant: Boolean indicating whether to output objects and
*             arrays as is as per the CSVJSON format variant. Default is false.
*
* The MIT License (MIT)
*
* Copyright (c) 2014 Martin Drapeau
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
*/
export class JSON2CSV {
    constructor() {
        this.errorMissingSeparator = 'Missing separator option.';
        this.errorEmpty = 'JSON is empty.';
        this.errorEmptyHeader = 'Could not detect header. Ensure first row contains your column headers.';
        this.errorNotAnArray = 'Your JSON must be an array or an object.';
        this.errorItemNotAnObject = 'Item in array is not an object: {0}';
    }
    flattenArray(array, ancestors = []) {
        function combineKeys(a, b) {
            let result = a.slice(0);
            if (!Array.isArray(b))
                return result;
            for (let i = 0; i < b.length; i++)
                if (result.indexOf(b[i]) === -1)
                    result.push(b[i]);
            return result;
        }
        function extend(target, source) {
            target = target || {};
            for (let prop in source) {
                if (typeof source[prop] === 'object') {
                    target[prop] = extend(target[prop], source[prop]);
                }
                else {
                    target[prop] = source[prop];
                }
            }
            return target;
        }
        var rows = [];
        for (let i = 0; i < array.length; i++) {
            let o = array[i];
            let row = {};
            let orows = {};
            let count = 1;
            if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
                throw this.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
            let keys = this.getKeys(o);
            for (let k = 0; k < keys.length; k++) {
                let value = o[keys[k]], keyChain = combineKeys(ancestors, [keys[k]]), key = keyChain.join('.');
                if (Array.isArray(value)) {
                    orows[key] = this.flattenArray(value, keyChain);
                    count += orows[key].length;
                }
                else {
                    row[key] = value;
                }
            }
            if (count == 1) {
                rows.push(row);
            }
            else {
                let keys = this.getKeys(orows);
                for (let k = 0; k < keys.length; k++) {
                    let key = keys[k];
                    for (let r = 0; r < orows[key].length; r++) {
                        rows.push(extend(extend({}, row), orows[key][r]));
                    }
                }
            }
        }
        return rows;
    }
    isObject(o) {
        return o && typeof o == 'object';
    }
    getKeys(o) {
        if (!this.isObject(o))
            return [];
        return Object.keys(o);
    }
    convert(data, options) {
        options || (options = {});
        if (!this.isObject(data))
            throw this.errorNotAnArray;
        if (!Array.isArray(data))
            data = [data];
        var separator = options.separator || ',';
        if (!separator)
            throw this.errorMissingSeparator;
        var flatten = options.flatten || false;
        if (flatten)
            data = this.flattenArray(data);
        var allKeys = [];
        var allRows = [];
        for (let i = 0; i < data.length; i++) {
            let o = data[i];
            let row = {};
            if (o !== undefined && o !== null && (!this.isObject(o) || Array.isArray(o)))
                throw this.errorItemNotAnObject.replace('{0}', JSON.stringify(o));
            let keys = this.getKeys(o);
            for (let k = 0; k < keys.length; k++) {
                let key = keys[k];
                if (allKeys.indexOf(key) === -1)
                    allKeys.push(key);
                let value = o[key];
                if (value === undefined && value === null)
                    continue;
                if (typeof value == 'string') {
                    row[key] = '"' + value.replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"';
                    if (options.output_csvjson_variant)
                        row[key] = row[key].replace(/\n/g, '\\n');
                }
                else {
                    row[key] = JSON.stringify(value);
                    if (!options.output_csvjson_variant && (this.isObject(value) || Array.isArray(value)))
                        row[key] = '"' + row[key].replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
                }
            }
            allRows.push(row);
        }
        var keyValues = [];
        for (let i = 0; i < allKeys.length; i++) {
            keyValues.push('"' + allKeys[i].replace(/"/g, options.output_csvjson_variant ? '\\"' : '""') + '"');
        }
        var csv = keyValues.join(separator) + '\n';
        for (let r = 0; r < allRows.length; r++) {
            let row = allRows[r];
            let rowArray = [];
            for (let k = 0; k < allKeys.length; k++) {
                let key = allKeys[k];
                rowArray.push(row[key] || (options.output_csvjson_variant ? 'null' : ''));
            }
            csv += rowArray.join(separator) + (r < allRows.length - 1 ? '\n' : '');
        }
        return csv;
    }
}
