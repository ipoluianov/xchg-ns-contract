import { ethers } from "ethers";
import constractDescription from "../components/XchgNsAbi.json"
import { Buffer} from "buffer"

export default {
    async connect(onChanged) {
        console.log("CONNECT");
        if (window.ethereum === undefined) {
            console.log("MetaMask not found")
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        window.ethereum.on("accountsChanged", ([networkId]) => {
            onChanged();
        });
        window.ethereum.on("chainChanged", ([networkId]) => {
            onChanged();
        });

        let signer = await provider.getSigner();
        let contract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", constractDescription.abi, signer);
        return [signer, contract]
    },

    stringToBytes32(str) {
        var result = Buffer.from(str, 'utf-8').toString('hex');
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
      let addrAsBytes = this.base32().decode32(addr)
      let b321 = toHexString(this.binaryStringToArrayBuffer(addrAsBytes));
      console.log("-------b32", b321, b321.length, "]");
      while (b321.length < 64) b321 += "0";
      return "0x" + b321;
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

    getCurrencyCode(chainId) {
        switch (chainId) {
          case 1:
            return 'ETH';
          case 3:
            return 'ETH'; // Ropsten Testnet
          case 4:
            return 'ETH'; // Rinkeby Testnet
          case 5:
            return 'ETH'; // Goerli Testnet
          case 42:
            return 'ETH'; // Kovan Testnet
          case 56:
            return 'BNB'; // Binance Smart Chain Mainnet
          case 97:
            return 'BNB'; // Binance Smart Chain Testnet
          default:
            return '---';
        }
      },
      shortAddress(addr) {
        if (addr.length < 40) {
          return addr;
        }
        return addr.substring(0, 5) + "..." + addr.substring(addr.length - 4);
      },
      base32() {
        return {
            base32a: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
            base32pad: "=",
            encode32(s) {
                var a = this.base32a;
                var pad = this.base32pad;
                var len = s.length;
                var o = "";
                var w, c, r = 0, sh = 0; // word, character, remainder, shift
                for (var i = 0; i < len; i += 5) {
                    // mask top 5 bits
                    c = s.charCodeAt(i);
                    w = 0xf8 & c;
                    o += a.charAt(w >> 3);
                    r = 0x07 & c;
                    sh = 2;
    
                    if ((i + 1) < len) {
                        c = s.charCodeAt(i + 1);
                        // mask top 2 bits
                        w = 0xc0 & c;
                        o += a.charAt((r << 2) + (w >> 6));
                        o += a.charAt((0x3e & c) >> 1);
                        r = c & 0x01;
                        sh = 4;
                    }
    
                    if ((i + 2) < len) {
                        c = s.charCodeAt(i + 2);
                        // mask top 4 bits
                        w = 0xf0 & c;
                        o += a.charAt((r << 4) + (w >> 4));
                        r = 0x0f & c;
                        sh = 1;
                    }
    
                    if ((i + 3) < len) {
                        c = s.charCodeAt(i + 3);
                        // mask top 1 bit
                        w = 0x80 & c;
                        o += a.charAt((r << 1) + (w >> 7));
                        o += a.charAt((0x7c & c) >> 2);
                        r = 0x03 & c;
                        sh = 3;
                    }
    
                    if ((i + 4) < len) {
                        c = s.charCodeAt(i + 4);
                        // mask top 3 bits
                        w = 0xe0 & c;
                        o += a.charAt((r << 3) + (w >> 5));
                        o += a.charAt(0x1f & c);
                        r = 0;
                        sh = 0;
                    }
                }
                // Encode the final character.
                if (sh != 0) { o += a.charAt(r << sh); }
                // Calculate length of pad by getting the 
                // number of words to reach an 8th octet.
                var padlen = 8 - (o.length % 8);
                // modulus 
                if (padlen == 8) { return o; }
                if (padlen == 1) { return o + pad; }
                if (padlen == 3) { return o + pad + pad + pad; }
                if (padlen == 4) { return o + pad + pad + pad + pad; }
                if (padlen == 6) { return o + pad + pad + pad + pad + pad + pad; }
                console.log('there was some kind of error');
                console.log('padlen:' + padlen + ' ,r:' + r + ' ,sh:' + sh + ', w:' + w);
            },
            decode32(s) {
                var len = s.length;
                var apad = this.base32a + this.base32pad;
                var v, x, r = 0, bits = 0, c, o = '';
    
                s = s.toUpperCase();
    
                for (var i = 0; i < len; i += 1) {
                    v = apad.indexOf(s.charAt(i));
                    if (v >= 0 && v < 32) {
                        x = (x << 5) | v;
                        bits += 5;
                        if (bits >= 8) {
                            c = (x >> (bits - 8)) & 0xff;
                            o = o + String.fromCharCode(c);
                            bits -= 8;
                        }
                    }
                }
                // remaining bits are < 8
                if (bits > 0) {
                    c = ((x << (8 - bits)) & 0xff) >> (8 - bits);
                    // Don't append a null terminator.
                    // See the comment at the top about why this sucks.
                    if (c !== 0) {
                        o = o + String.fromCharCode(c);
                    }
                }
                return o;
            },
        }
    }
}
