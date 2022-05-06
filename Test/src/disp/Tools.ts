var internal_id = 0;

// Function to download data to a file
export function download(data, filename, type) {
    const file = new Blob([data], { type: type });
    const a = document.createElement("a"),

        url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

export function copyStringToClipboard(str) {
    // Create new element
    const el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}

export function GenerateID() {
    internal_id++;
    return "internal_id_" + internal_id.toString();
}

export type FlexSection = { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement };
export function CreateFlexSection(elem: HTMLElement): FlexSection {
    const fs = {
        div0: document.createElement("DIV"), div1: document.createElement("DIV"),
        div2: document.createElement("DIV")
    } as FlexSection;
    fs.div0.classList.add("flex-container-o");
    fs.div1.classList.add("flex-container-i");
    fs.div2.classList.add("flex-container-i");
    fs.div0.appendChild(fs.div1);
    fs.div0.appendChild(fs.div2);
    elem.appendChild(fs.div0);
    return fs;
}

export function CreateTH(row: HTMLElement, content: string) {
    const th = document.createElement("TH") as HTMLTableHeaderCellElement;
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}

export function CreateTD(row: HTMLElement, content: string) {
    const th = document.createElement("TD") as HTMLTableCellElement;
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}

export function CreateInput(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    const span = document.createElement("SPAN") as HTMLSpanElement;
    const txtSpan = document.createElement("LABEL") as HTMLLabelElement;
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    elem.setAttribute("type", "number");
    elem.min = "0";
    elem.step = "1";
    elem.valueAsNumber = 0;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}

export function FlexInput(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "number");
    inp.min = "0";
    inp.step = "1";
    inp.valueAsNumber = 0;

    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}

export function FlexText(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "text");
    inp.value = "Default";

    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}

export function FlexDisplay(txt: string, inp: HTMLLabelElement, fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;

    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}

export function FlexSelect(txt: string, sel: HTMLSelectElement, fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    sel.id = GenerateID();
    lbl.htmlFor = sel.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;

    lbl.classList.add("flex-item");
    sel.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(sel);
}

export function CreateCheckbox(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    const span = document.createElement("SPAN") as HTMLSpanElement;
    const txtSpan = document.createElement("LABEL") as HTMLLabelElement;
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    elem.setAttribute("type", "checkbox");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}

export function CreateSelect(txt: string, elem: HTMLSelectElement, table: HTMLElement, br = true) {
    const span = document.createElement("SPAN") as HTMLSpanElement;
    const txtSpan = document.createElement("LABEL") as HTMLLabelElement;
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}

export function CreateText(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    const span = document.createElement("SPAN") as HTMLSpanElement;
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    elem.id = GenerateID();
    lbl.htmlFor = elem.id;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    elem.setAttribute("type", "text");
    elem.value = "Default";
    span.appendChild(lbl);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}

export function CreateButton(txt: string, elem: HTMLButtonElement, table: HTMLElement, br = true) {
    const span = document.createElement("SPAN") as HTMLSpanElement;
    const txtSpan = document.createElement("LABEL") as HTMLLabelElement;
    elem.hidden = true;
    elem.id = GenerateID();
    elem.textContent = txt;
    txtSpan.htmlFor = elem.id;
    txtSpan.style.marginLeft = "0.25em";
    txtSpan.style.marginRight = "0.5em";
    txtSpan.textContent = txt;
    txtSpan.classList.add("lbl_action");
    txtSpan.classList.add("btn_th");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br) {
        table.appendChild(document.createElement("BR"));
        table.appendChild(document.createElement("BR"));
    }

}

export function FlexCheckbox(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.id = GenerateID();
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    inp.setAttribute("type", "checkbox");

    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);

    const lbl2 = document.createElement("LABEL") as HTMLLabelElement;
    const span = document.createElement("SPAN") as HTMLSpanElement;
    span.appendChild(lbl2);
    span.appendChild(inp);
    fs.div2.appendChild(span);
    return lbl;
}

export function FlexLabel(txt: string, div1: HTMLDivElement) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
    return lbl;
}

export function FlexLabels(txtL: string, txtR: string, fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txtL;
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);

    const lbl2 = document.createElement("LABEL") as HTMLLabelElement;
    lbl2.style.marginLeft = "0.25em";
    lbl2.style.marginRight = "0.5em";
    lbl2.textContent = txtR;
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
    return [lbl, lbl2];
}

export function FlexSpace(fs: FlexSection) {
    const lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.textContent = " ";
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    const lbl2 = document.createElement("LABEL") as HTMLLabelElement;
    lbl2.textContent = " ";
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}

export function insertRow(frag: DocumentFragment | HTMLElement) {
    const row = document.createElement("TR") as HTMLTableRowElement;
    frag.append(row);
    return row;
}

export function insertCell(frag: DocumentFragment | HTMLElement) {
    const cell = document.createElement("TD") as HTMLTableCellElement;
    frag.append(cell);
    return cell;
}

export function BlinkBad(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_b");
}

export function BlinkGood(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_g");
}

export function BlinkNeutral(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_n");
}

export function BlinkNone(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
}

var enable_anim = false;
export function SetAnimationEnabled(enable: boolean) {
    enable_anim = enable;
}

export function BlinkIfChanged(elem: HTMLElement, str: string, positive_good = null) {
    if (enable_anim) {
        if (elem.textContent != str) {
            if (positive_good == null) {
                BlinkNeutral(elem);
            } else {
                const positive = parseInt(elem.textContent) < parseInt(str);
                if (positive_good && positive || (!positive_good && !positive)) {
                    BlinkGood(elem);
                } else {
                    BlinkBad(elem);
                }
            }
        } else {
            BlinkNone(elem);
        }
    }
    elem.textContent = str;
}

export function _arrayBufferToString(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

export function _stringToArrayBuffer(str: string) {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes.buffer;
}

export const loadJSON = (path, callback) => {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', path, true);
    // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState === 4 && xobj.status === 200) {
            // Required use of an anonymous callback
            // as .open() will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

export const toggleCollapse = (id, active) => {
    var elem = document.getElementById(id) as HTMLElement;
    elem.classList.toggle("active", active);
    var content = elem.nextElementSibling as HTMLElement;
    content = content.nextElementSibling as HTMLElement;
    if (!active) {
        content.style.maxHeight = "0px";
    } else {
        content.style.maxHeight = "inherit";
    }
}