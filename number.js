
module.exports = class Num {
    static get(num) {
        return num >>> 0;
    }

    static xor(a, b) {
        return this.get(this.get(a) ^ this.get(b));
    }

    static and(a, b) {
        return this.get(this.get(a) & this.get(b));
    }

    static mul(a, b) {
        const high16 = ((a & 0xffff0000) >>> 0) * b;
        const low16 = (a & 0x0000ffff) * b;
        return this.get((high16 >>> 0) + (low16 >>> 0));
    }

    static or(a, b) {
        return this.get(this.get(a) | this.get(b));
    }

    static not(a) {
        return this.get(~this.get(a));
    }

    static shiftLeft(a, b) {
        return this.get(this.get(a) << b);
    }

    static shiftRight(a, b) {
        return this.get(a) >>> b;
    }

    static mod(a, b) {
        return this.get(this.get(a) % b);
    }
}