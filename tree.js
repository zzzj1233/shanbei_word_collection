const B32_CODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const B64_CODE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const CNT = [1, 2, 2, 2, 2, 2];

const {Base64} = require('./base64.js')
const Random = require('./random');
const Func = require('./func');

class Node {
    constructor() {
        this.char = '.';
        this.children = {};
    }

    getChar() {
        return this.char;
    }

    getChildren() {
        return this.children;
    }

    setChar(char) {
        this.char = char;
    }

    setChildren(k, v) {
        this.children[k] = v;
    }
}

class Tree {

    constructor() {
        this.random = new Random();
        this.sign = '';
        this.inter = {};
        this.head = new Node();
    }

    init(sign) {
        this.random.seed(sign);
        this.sign = sign;

        Func.loop(64, i => {
            this.addSymbol(B64_CODE[i], CNT[parseInt((i + 1) / 11, 10)]);
        });
        this.inter['='] = '=';
    }

    addSymbol(char, len) {
        let ptr = this.head;
        let symbol = '';

        Func.loop(len, () => {
            let innerChar = B32_CODE[this.random.generate(32)];
            while (
                innerChar in ptr.getChildren() &&
                ptr.getChildren()[innerChar].getChar() !== '.'
                ) {
                innerChar = B32_CODE[this.random.generate(32)];
            }

            symbol += innerChar;
            if (!(innerChar in ptr.getChildren())) {
                ptr.setChildren(innerChar, new Node());
            }

            ptr = ptr.getChildren()[innerChar];
        });

        ptr.setChar(char);
        this.inter[char] = symbol;
        return symbol;
    }

    decode(enc) {
        let dec = '';
        for (let i = 4; i < enc.length;) {
            if (enc[i] === '=') {
                dec += '=';
                i++;
                continue; // eslint-disable-line
            }
            let ptr = this.head;
            while (enc[i] in ptr.getChildren()) {
                ptr = ptr.getChildren()[enc[i]];
                i++;
            }
            dec += ptr.getChar();
        }

        return dec;
    }

}

const getIdx = c => {
    const x = c.charCodeAt();
    if (x >= 65) {
        return x - 65;
    }
    return x - 65 + 41;
};

const VERSION = 1;

const checkVersion = s => {
    const wi = getIdx(s[0]) * 32 + getIdx(s[1]);
    const x = getIdx(s[2]);
    const check = getIdx(s[3]);

    return VERSION >= (wi * x + check) % 32;
};

module.exports = function (sign) {
    if (!checkVersion(sign)) {
        return '';
    }

    const tree = new Tree()

    tree.init(sign.substr(0, 4))

    return JSON.parse(Base64.decode(tree.decode(sign)))['id']
}

