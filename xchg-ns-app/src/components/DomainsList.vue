
<script>
import DomainListItem from "./DomainListItem.vue"
import wallet from "./lib/wallet"
import XchgNs from "./contract/XchgNs.json"
import XchgNsAddress from "./contract/XchgNsAddress.json"

export default {
  mounted() {
    this.updateDomains();
  },
  components: {
    DomainListItem,
  },
  data() {
    return {
      domains: [],
    };
  },
  emits: ['registerSubdomain'],
  methods: {
    registerSubdomain(parentDomain) {
      this.$emit('registerSubdomain', parentDomain);
    },
    async updateDomains() {
      [this.signer, this.contract] = await wallet.connect(XchgNsAddress.address, XchgNs.abi, () => {
        this.resetState();
      });

      this.domains = [];
      const count = await this.contract.myDomains();
      console.log("Count:", count.toNumber());
      for (let i = 0; i < count; i++) {
        const domain = await this.contract.getMyDomainInfo(i);
        if (domain === undefined) {
          return "0x00";
        }
        //console.log("domain", i, " = ", this.bytes32ToString(domain.fullName.toString()));
        this.domains.push(domain);
      }

    },
  }
}
</script>

<template>
  <div class="main" v-for="domain in domains">
    <div>
      <DomainListItem :domain=domain @registerSubdomain="this.registerSubdomain" />
    </div>
  </div>
</template>

<style scoped>
.main {
  padding: 6px;
}
</style>
