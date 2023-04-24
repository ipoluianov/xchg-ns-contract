<template>
    <div class="header">
        <div v-if="this.connected" class="widget">{{ this.shortAddress }}</div>
        <div v-if="!this.connected" class="widget">Use MetaMask Wallet</div>
        <div v-if="!this.connected" class="widget"><button class="connect-button" @click="this.connectWallet">CONNECT
                WALLET</button></div>
    </div>
    <div class="header" v-if="this.connected">
        <div class="widget">{{ this.balance }} {{ this.balanceCurrency }}</div>
        <div class="widget"><button class="disconnect-button" @click="this.disconnectWallet">DISCONNECT</button></div>
    </div>
</template>

<script>
import wallet from "./wallet"
import { ethers } from "ethers";
import { Buffer } from "buffer"

export default {
    data() {
        return {
            connected: false,
            balance: 0,
            balanceCurrency: "",
            selectedAddress: null,
        };
    },
    computed: {
        shortAddress() {
            return this.selectedAddress.toUpperCase();
            return wallet.shortAddress(this.selectedAddress);
        },
    },
    emits: ["connected", "disconnected"],
    methods: {
        async connectWallet() {
            [this.signer, this.contract] = await wallet.connect(() => {
                this.resetState();
            });
            this.selectedAddress = await this.signer.getAddress();
            this.updateBalance();
            this.$emit("connected", this.signer, this.contract);
        },
        disconnectWallet() {
            this.resetState();
            this.$emit("disconnected");
        },
        async resetState() {
            this.connected = false;
            this.selectedAddress = null;
            this.balance = 0;
            this.errorText = "";
            this.domains = [];
            this.dialog = '';
        },

        async updateBalance() {
            if (this.signer == null) {
                console.log("no signer");
                this.resetState();
                return;
            }
            console.log("get-balance");
            this.balance = await this.signer.getBalance();
            this.balance = wallet.truncate(ethers.utils.formatEther(this.balance), 5)
            this.connected = true;
            this.signer.provider.getNetwork().then(network => {
                const chainId = network.chainId;
                let currencyCode = wallet.getCurrencyCode(chainId);
                this.balanceCurrency = currencyCode;
            });
        },

    }
}
</script>

<style scoped>
.connect-button {
    background-color: #009900;
    border: 1px solid #00BB00;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    border-radius: 3px;
    color: #FFFFFF;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14pt;
    font-weight: 600;
}

.disconnect-button {
    background-color: #444444;
    border: 1px solid #888888;
    padding: 5px;
    margin: 5px;
    cursor: pointer;
    border-radius: 3px;
    color: #FFFFFF;
    font-family: 'Courier New', Courier, monospace;
    font-size: 10pt;
    font-weight: 600;
}

.hr {
    min-height: 5px;
    border-top: 1px solid #888888;

}
</style>