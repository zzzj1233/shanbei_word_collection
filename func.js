
module.exports = class Func {
    static loop(cnt, func) {
        'v'
            .repeat(cnt)
            .split('')
            .map((_, idx) => func(idx));
    }
}