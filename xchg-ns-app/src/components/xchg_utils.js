import b32 from "./b32"
import js_utils from "./js_utils";

export default {
    // input: xchg address
    // output: bytes32
    xchgAddressToBinary(addr) {
        if (addr.length != 49) {
          throw "wrong xchg address";
        }
        const toHexString = (bytes) => {
          let res = "";
          var uint8View = new Uint8Array(bytes);
          console.log("bbb", uint8View);
          for (let i = 0; i < uint8View.length; i++) {
            let ch = (uint8View[i] & 0xff).toString(16);
            if (ch.length < 2) {
              ch = "0" + ch;
            }
            res += ch
    
          }
          return res;
        };
        addr = addr.substring(1);
        let addrAsBytes = b32.decode32(addr)
        let b321 = toHexString(js_utils.binaryStringToArrayBuffer(addrAsBytes));
        console.log("-------b32", b321, b321.length, "]");
        while (b321.length < 64) b321 += "0";
        return "0x" + b321;
      },
    
}
