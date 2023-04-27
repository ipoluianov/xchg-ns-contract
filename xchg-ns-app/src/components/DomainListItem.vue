<script>
import { Buffer } from "buffer"
import wallet from "./wallet"
import b32 from "./b32"
import bytes32 from "./bytes32"

export default {
    props: ['domain'],
    emits: ['registerSubdomain'],
    computed: {
        fullDomainName() {
            return bytes32.bytes32ToString(this.domain.fullName.toString());
        },
        xchgAddressString() {
            return wallet.bytes32ToXchgAddressString(this.domain.xchgAddress);
        }
    },
    methods: {
        registerSubdomain() {
            this.$emit('registerSubdomain', bytes32.bytes32ToString(this.domain.fullName.toString()));
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
