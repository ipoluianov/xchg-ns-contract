export default {
  stringToBytes32(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      let code = str.charCodeAt(i);
      let codeHex = code.toString(16);
      if (codeHex.length < 2) {
        codeHex = '0' + codeHex;
      }
      result += codeHex;
    }
    if (result.length > 64) {
      throw "str is too big";
    }
    while (result.length < 64) result += "0";
    return "0x" + result;
  },

  bytes32ToString(b32) {
    if (b32.length != 64 + 2) {
      throw "wrong bytes32";
    }
    let result = "";
    for (let i = 2; i < b32.length; i += 2) {
      let ss = b32.substring(i, i + 2);
      let code = parseInt(ss, 16);
      if (code == 0) {
        break;
      }
      result += String.fromCharCode(code);
    }
    return result;
  },

}