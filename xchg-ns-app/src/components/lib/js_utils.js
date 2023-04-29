export default {
    binaryStringToArrayBuffer(binaryString) {
        var len = binaryString.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
      },
    
      truncate(str, maxDecimalDigits) {
        if (str.includes('.')) {
          const parts = str.split('.');
          return parts[0] + '.' + parts[1].slice(0, maxDecimalDigits);
        }
        return str;
      },
      arrayBufferToBinaryString(arrayBuffer) {
        var binaryString = "";
        var bytes = new Uint8Array(arrayBuffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
          binaryString += String.fromCharCode(bytes[i]);
        }
        return binaryString;
      },
    
}