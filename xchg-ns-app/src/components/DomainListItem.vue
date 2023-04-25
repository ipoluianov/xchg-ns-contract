<script>
import { Buffer } from "buffer"
import wallet from "./wallet"
export default {
    props: ['domain'],
    emits: ['registerSubdomain'],
    computed: {
        fullDomainName() {
            return wallet.bytes32ToString(this.domain.fullName.toString());
        },
        xchgAddressString() {
            let xchgAddrHex = this.domain.xchgAddress.toString().substring(2, 2 + 30 * 2);
            xchgAddrHex = xchgAddrHex.toUpperCase();
            console.log("xchgAddrHex", xchgAddrHex)
            let addrAsBytes = new ArrayBuffer(30);
            const typedArray1 = new Uint8Array(addrAsBytes);

            for (let i = 0; i < 30; i++) {
                let chex = xchgAddrHex.substring(i * 2, i * 2 + 2);
                let b = parseInt(chex, 16);
                typedArray1[i] = b;
            }

            let bs = wallet.arrayBufferToBinaryString(typedArray1.buffer);

            let addrAsB32 = wallet.base32().encode32(bs).toLowerCase();
            
            return addrAsB32;
        }
    },
    methods: {
        registerSubdomain() {
            this.$emit('registerSubdomain', wallet.bytes32ToString(this.domain.fullName.toString()));
        }
    }
}
</script>

<template>
    <div class="item">
        <div class="subitem">
            <div class="domain_name">{{ this.fullDomainName }} </div>
        </div>
        <div class="subitem">
            <div class="xchg_addr">{{ this.xchgAddressString }}</div>
        </div>
        <div class="subitem">
            <div></div>
            <div><button class="button_register_subdomain" @click="this.registerSubdomain">Register sundomain</button></div>
        </div>
    </div>
    
</template>

<style>
.item {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    border-bottom: 1px solid white;
    padding-top: 5px;
}

.subitem {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
}

.domain_name {
    font-size: 16pt;
    color: white;
}

.xchg_addr {
    font-size: 11pt;
    color: #777777;
}

.button_register_subdomain {
    cursor: pointer;
}
</style>
