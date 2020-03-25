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
    fs.div0.classList.add("flex-container");
    fs.div1.classList.add("flex-container");
    fs.div2.classList.add("flex-container");
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

function CreateInput(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
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
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "number");
    inp.min = "0";
    inp.step = "1";
    inp.valueAsNumber = 0;

    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}

function FlexSelect(txt: string, sel: HTMLSelectElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    sel.id = GenerateID();
    lbl.htmlFor = sel.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";

    lbl.classList.add("flex-item");
    sel.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(sel);
}

function CreateSpace(elem: HTMLElement) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    span.innerHTML = "&nbsp;";
    elem.appendChild(span);
}

function CreateCheckbox(txt: string, elem: HTMLInputElement, table: HTMLElement, br = true) {
    var span = document.createElement("SPAN") as HTMLSpanElement;
    var txtSpan = document.createElement("LABEL") as HTMLLabelElement;
    elem.id = GenerateID();
    txtSpan.htmlFor = elem.id;
    txtSpan.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    elem.setAttribute("type", "checkbox");
    span.appendChild(txtSpan);
    span.appendChild(elem);
    table.appendChild(span);
    if (br)
        table.appendChild(document.createElement("BR"));
}

function FlexCheckbox(txt: string, inp: HTMLInputElement, fs: FlexSection) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    inp.id = GenerateID();
    lbl.htmlFor = inp.id;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    inp.setAttribute("type", "checkbox");

    lbl.classList.add("flex-item");
    inp.classList.add("flex-item");
    fs.div1.appendChild(lbl);
    fs.div2.appendChild(inp);
}

function FlexLabel(txt: string, div1: HTMLDivElement) {
    var lbl = document.createElement("LABEL") as HTMLLabelElement;
    lbl.innerHTML = "&nbsp;" + txt + "&nbsp;&nbsp;";
    lbl.classList.add("flex-item");
    div1.appendChild(lbl);
}

function Blink(elem: HTMLElement) {
    elem.classList.toggle("changed", false);
    elem.offsetHeight;
    elem.classList.toggle("changed");
}

function BlinkIfChanged(elem: HTMLElement, str: string) {
    if (elem.innerText != str) {
        Blink(elem);
    }
    elem.innerText = str;
}