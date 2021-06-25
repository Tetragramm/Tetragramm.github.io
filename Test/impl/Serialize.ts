class Serialize {
    private array: ArrayBuffer;
    private view: DataView;
    private offset: number;

    public constructor(arr?: ArrayBuffer) {
        this.array = new ArrayBuffer(51200);
        this.view = new DataView(this.array);
        this.offset = 0;
    }

    private Check() {
        if (this.offset >= this.array.byteLength)
            throw "Serialization Way too long.";
    }

    public PushNum(num: number) {
        this.view.setInt16(this.offset, num, false);
        this.offset += 2;
        this.Check();
    }

    public PushBool(bool: boolean) {
        if (bool)
            this.view.setUint8(this.offset, 1);
        else
            this.view.setUint8(this.offset, 0);
        this.offset += 1;
        this.Check();
    }

    public PushString(str: string) {
        this.PushNum(str.length);
        for (let i = 0; i < str.length; i++) {
            this.view.setUint8(this.offset, str.charCodeAt(i));
            this.offset++;
        }
        this.Check();
    }

    public PushNumArr(nums: number[]) {
        this.PushNum(nums.length);
        for (let n of nums) {
            this.PushNum(n);
        }
        this.Check();
    }

    public PushBoolArr(bools: boolean[]) {
        this.PushNum(bools.length);
        for (let b of bools) {
            this.PushBool(b);
        }
        this.Check();
    }

    public PushFloat(flt: number) {
        this.view.setFloat32(this.offset, flt, false);
        this.offset += 4;
        this.Check();
    }

    public FinalArray() {
        return this.array.slice(0, this.offset);
    }
}

class Deserialize {
    private array: ArrayBuffer;
    private view: DataView;
    private offset: number;
    public version: number;

    public constructor(arr: ArrayBuffer) {
        this.array = arr;
        this.view = new DataView(this.array);
        this.offset = 0;
    }

    private Check() {
        if (this.offset >= this.array.byteLength)
            throw "Deserialization Failed";
    }

    public GetNum() {
        this.Check();
        var num = this.view.getInt16(this.offset, false);
        this.offset += 2;
        return num;
    }

    public GetBool() {
        this.Check();
        var bool = this.view.getUint8(this.offset);
        this.offset += 1;
        return bool > 0;
    }

    public GetString() {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            var char = this.view.getUint8(this.offset);
            arr.push(char);
            this.offset += 1;
        }
        return String.fromCharCode(...arr);
    }

    public GetNumArr(tgt_length: number) {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetNum());
        }
        while (arr.length < tgt_length) {
            arr.push(0);
        }
        return arr;
    }

    public GetBoolArr(tgt_length: number) {
        this.Check();
        var len = this.GetNum();
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(this.GetBool());
        }
        while (arr.length < tgt_length) {
            arr.push(false);
        }
        return arr;
    }

    public GetFloat() {
        this.Check();
        var flt = this.view.getFloat32(this.offset, false);
        this.offset += 4;
        return flt;
    }
}

function NumArr(arr: number[], tgt_length: number) {
    while (arr.length < tgt_length) {
        arr.push(0);
    }
    return arr;
}

function BoolArr(arr: boolean[], tgt_length: number) {
    while (arr.length < tgt_length) {
        arr.push(false);
    }
    return arr;
}