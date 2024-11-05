/**
 * Created by dingyuxuan on 2018/3/15.
 */
const Func = require('./func');
const Num = require('./number');

const MIN_LOOP = 8;
const PRE_LOOP = 8;

const BAY_SH0 = 1;
const BAY_SH1 = 10;
const BAY_SH8 = 8;
const BAY_MASK = 0x7fffffff;

module.exports = class Random {
    constructor() {
        this.status = [];
        this.mat1 = 0;
        this.mat2 = 0;
        this.tmat = 0;
    }

    seed(seeds) {
        Func.loop(4, idx => {
            if (seeds.length > idx) {
                this.status[idx] = Num.get(seeds.charAt(idx).charCodeAt());
            } else {
                this.status[idx] = Num.get(110);
            }
        });

        [, this.mat1, this.mat2, this.tmat] = this.status;

        this.init();
    }

    init() {
        Func.loop(MIN_LOOP - 1, idx => {
            this.status[(idx + 1) & 3] = Num.xor(
                this.status[(idx + 1) & 3],
                idx +
                1 +
                Num.mul(
                    1812433253,
                    Num.xor(this.status[idx & 3], Num.shiftRight(this.status[idx & 3], 30)),
                ),
            );
        });

        if (
            (this.status[0] & BAY_MASK) === 0 &&
            this.status[1] === 0 &&
            this.status[2] === 0 &&
            this.status[3] === 0
        ) {
            this.status[0] = 66;
            this.status[1] = 65;
            this.status[2] = 89;
            this.status[3] = 83;
        }

        Func.loop(PRE_LOOP, () => this.nextState());
    }

    nextState() {
        let x;
        let y;

        [, , , y] = this.status;
        x = Num.xor(Num.and(this.status[0], BAY_MASK), Num.xor(this.status[1], this.status[2]));
        x = Num.xor(x, Num.shiftLeft(x, BAY_SH0));
        y = Num.xor(y, Num.xor(Num.shiftRight(y, BAY_SH0), x));
        [, this.status[0], this.status[1]] = this.status;
        this.status[2] = Num.xor(x, Num.shiftLeft(y, BAY_SH1));
        this.status[3] = y;
        this.status[1] = Num.xor(this.status[1], Num.and(-Num.and(y, 1), this.mat1));
        this.status[2] = Num.xor(this.status[2], Num.and(-Num.and(y, 1), this.mat2));
    }

    generate(max) {
        this.nextState();

        let t0;

        [, , , t0] = this.status;
        const t1 = Num.xor(this.status[0], Num.shiftRight(this.status[2], BAY_SH8));
        t0 = Num.xor(t0, t1);
        t0 = Num.xor(Num.and(-Num.and(t1, 1), this.tmat), t0);

        return t0 % max;
    }
}
