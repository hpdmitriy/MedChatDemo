const crypto = require('crypto');
const config = require('config');
const xor = require('base64-xor');

class XorCripto {
  constructor(str, len) {
    this.str = str;
    this.salt = config.SALT;
    this.xorSalt = config.XOR_SALT;
    this.hashLength = len;
    this.decodedStr = null;
    this.encodedStr = null;
  }
  get inputString() {
    return `${this.str}`;
  }
  get decodeStr() {
    return this.decodedStr;
  }
  set decodeStr(str) {
    this.decodedStr = str
  }
  get encodeStr() {
    return this.encodedStr;
  }
  set encodeStr(str) {
    this.encodedStr = str;
  }
  get strLength() {
    return this.str.length;
  }
  get strSlice() {
    return this.str.slice(this.strLength - this.hashLength);
  };
  get strSliceHash() {
    return this.str.slice( - this.hashLength);
  };
  decode() {
    const hash = crypto.createHash('md5').update(`${this.strSlice}_${this.salt}`).digest("hex");
    if (hash === this.strSliceHash) {
      return false;
    }
    this.decodeStr = xor.decode(this.xorSalt,this.strSlice);
    return JSON.parse(this.decodeStr.match(/{[^}]+}/g)[0]);
  }
  encode() {
    const encStr = xor.encode(this.xorSalt, JSON.stringify(this.inputString));
    const hash = crypto.createHash('md5').update(`${encStr}_${this.salt}`).digest("hex");
    this.encodeStr = `${encStr}${hash}`;
    return this.encodeStr;
  }
}

module.exports = XorCripto;
