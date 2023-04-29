import { ethers } from "ethers";
import b32 from "./b32"
import js_utils from "./js_utils";

export default {
  async connect(contractAddress, contractAbi, onChanged) {
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
    let contract = new ethers.Contract(contractAddress, contractAbi, signer);
    return [signer, contract]
  },


  bytes32ToXchgAddressString(base32Address) {
    let xchgAddrHex = base32Address.toString().substring(2, 2 + 30 * 2);
    xchgAddrHex = xchgAddrHex.toUpperCase();
    let addrAsBytes = new ArrayBuffer(30);
    const typedArray1 = new Uint8Array(addrAsBytes);

    for (let i = 0; i < 30; i++) {
      let chex = xchgAddrHex.substring(i * 2, i * 2 + 2);
      let b = parseInt(chex, 16);
      typedArray1[i] = b;
    }

    let bs = js_utils.arrayBufferToBinaryString(typedArray1.buffer);

    let addrAsB32 = b32.encode32(bs).toLowerCase();

    return addrAsB32;
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

}
