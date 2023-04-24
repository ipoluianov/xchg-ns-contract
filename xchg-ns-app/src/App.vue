<script>
import RegisterDomain from "./components/RegisterDomain.vue"
import constractDescription from "../src/components/XchgNsAbi.json"
import DomainsList from "./components/DomainsList.vue";
import Wallet from "./components/Wallet.vue"
import Header from "./components/Header.vue"

export default {
  data() {
    return {
      connected: false,
      updateCounter: 0,
      abi: "",
      domains: [],
      dialog: '',
      parentDomainForReg: "",
    }
  },
  computed: {
  },
  components: {
    RegisterDomain,
    DomainsList,
    Wallet,
    Header,
  },

  // `mounted` is a lifecycle hook which we will explain later
  mounted() {
    this.abi = constractDescription.abi;
  },
  methods: {
    async resetState() {
      this.connected = false;
      this.domains = [];
      this.dialog = '';
    },
    registerDomain() {
      this.registerSubdomain("xchg")
    },
    mainForm() {
      this.dialog = ''
    },
    registered() {
      this.updateDomains();
      this.dialog = ''
    },
    onConnected(signer, contract) {
      this.connected = true;
      this.signer = signer;
      this.contract = contract;
      this.updateDomains();
    },
    onDisconnected() {
      this.connected = false;
      this.resetState();
    },
    updateDomains() {
      if (this.$refs.domainsList == null || this.$refs.domainsList === undefined) {
        return;
      }
      this.$refs.domainsList.updateDomains();
    },
    registerSubdomain(parentDomain) {
      this.parentDomainForReg = parentDomain
      this.dialog = 'reg'
    },
  }

}
</script>

<template>
  <div class="wrapper">
    <Header></Header>
    <Wallet @connected="this.onConnected" @disconnected="this.onDisconnected"/>
    <div v-if="this.dialog == 'reg'">
      <RegisterDomain @on-register="this.registered" @cancel="this.mainForm" :parent-domain=this.parentDomainForReg />
    </div>
    <div class="content" v-if="this.connected && this.dialog == ''">
      <div class="buttons">
        <button class="add-button" @click="this.registerDomain">Register new domain</button>
        <button class="refresh-button" @click="this.updateDomains">Refresh</button>
      </div>
      <DomainsList ref="domainsList" @register-subdomain="this.registerSubdomain"/>
    </div>
  </div>
</template>

<style scoped>
.add-button {
  font-size: 14pt;
  background-color: #2C873A;
  color: #FFFFFF;
  border: 0px solid #FFFFFF;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
}

.refresh-button {
  font-size: 14pt;
  background-color: #555555;
  color: #FFFFFF;
  border: 0px solid #FFFFFF;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  cursor: pointer;
}

.hr {
    min-height: 5px;
    border-top: 1px solid #888888;
}

.buttons {
  background-color: #111111;
  color: #AAA;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
}

</style>
