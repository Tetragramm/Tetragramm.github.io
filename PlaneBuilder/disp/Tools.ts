var internal_id = 0;

// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
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
}

function copyStringToClipboard(str) {
    // Create new element
    var el = document.createElement('textarea');
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

function GenerateID() {
    internal_id++;
    return "internal_id_" + internal_id.toString();
}

type FlexSection = { div0: HTMLDivElement, div1: HTMLDivElement, div2: HTMLDivElement };
function CreateFlexSection(elem: HTMLElement): FlexSection {
    var fs = {
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

function CreateTH(row: HTMLElement, content: string) {
    var th = document.createElement("TH") as HTMLTableHeaderCellElement;
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}

function CreateTD(row: HTMLElement, content: string) {
    var th = document.createElement("TD") as HTMLTableCellElement;
    th.innerHTML = content;
    row.appendChild(th);
    return th;
}

function CreateInput(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
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

function FlexInput(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
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

function FlexText(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
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

function FlexDisplay(txt: string, inp: HTMLLabelElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
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

function FlexSelect(txt: string, sel: HTMLSelectElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
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

function CreateCheckbox(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
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

function CreateSelect(txt: string, elem: HTMLSelectElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
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

function CreateText(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
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

function CreateButton(txt: string, elem: HTMLButtonElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
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

function FlexCheckbox(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
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

    var lbl2 = document.createElement("LABEL") as HTMLLabelElement;
    var span = document.createElement("SPAN") as HTMLSpanElement;
    span.appendChild(lbl2);
    span.appendChild(inp);
    fs.div2.appendChild(span);
}

function FlexLabel(txt: string, div1: HTMLDivElement) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txt;
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
}

function FlexLabels(txtL: string, txtR: string, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.style.marginLeft = "0.25em";
    lbl.style.marginRight = "0.5em";
    lbl.textContent = txtL;
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);

    var lbl2 = document.createElement("LABEL") as HTMLLabelElement;
    lbl2.style.marginLeft = "0.25em";
    lbl2.style.marginRight = "0.5em";
    lbl2.textContent = txtR;
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}

function FlexSpace(fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.textContent = " ";
    lbl.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    var lbl2 = document.createElement("LABEL") as HTMLLabelElement;
    lbl2.textContent = " ";
    lbl2.classList.add("flex-item");
    fs.div2.appendChild(lbl2);
}

function insertRow(frag: DocumentFragment | HTMLElement) {
    var row = document.createElement("TR") as HTMLTableRowElement;
    frag.append(row);
    return row;
}

function insertCell(frag: DocumentFragment | HTMLElement) {
    var cell = document.createElement("TD") as HTMLTableCellElement;
    frag.append(cell);
    return cell;
}

function BlinkBad(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_b");
}

function BlinkGood(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_g");
}

function BlinkNeutral(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
    elem.offsetHeight;
    elem.classList.toggle("changed_n");
}

function BlinkNone(elem: HTMLElement) {
    elem.classList.toggle("changed_b", false);
    elem.classList.toggle("changed_g", false);
    elem.classList.toggle("changed_n", false);
}

function BlinkIfChanged(elem: HTMLElement, str: string, positive_good = null) {
    if (enable_anim) {
        if (elem.textContent != str) {
            if (positive_good == null) {
                BlinkNeutral(elem);
            } else {
                var positive = parseInt(elem.textContent) < parseInt(str);
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

function _arrayBufferToString(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

function _stringToArrayBuffer(str: string) {
    var bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes.buffer;
}

const loadJSON = (path, callback) => {
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