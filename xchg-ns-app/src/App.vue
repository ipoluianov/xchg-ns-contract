<script>
import { ethers } from "ethers";

export default {
  data() {
    return {
      connected: false,
      balance: 0,
    }
  },

  // `mounted` is a lifecycle hook which we will explain later
  mounted() {
    this.updateBalance();
  },
  methods: {
    async updateBalance() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner()

    console.log("qweqwe", await signer.getAddress())
    this.balance = await signer.getBalance();
    this.balance = ethers.utils.formatEther(this.balance)
    this.connected = true;
    // console.log("balance:", ethers.utils.formatEther(bal));
  }
  }

}
</script>

<template>
  <div class="wrapper">
    <div class="header">
      <div v-if="this.connected" class="widget">{{ this.balance }}</div>

      <div v-if="!this.connected" class="widget"><button class="connect-button" @click="this.updateBalance">DOIT</button></div>
    </div>
    <div class="content">
      CONTENT
    </div>
  </div>
</template>

<style scoped>

.header {
  background-color: #222222;
  color: #AAA;
  display: flex;
  flex-direction: row;
  align-items: end;
  flex-wrap: wrap;
  justify-content: space-between;
}

.widget {
  display: inline-block;
}
.content {
  background-color: #333333;
}

.wrapper {
  max-width: 500px;
  background-color: #222222;
  margin: 0 auto;
  padding: 10px;
}

.connect-button {
  background-color: #009900;
  border: 1px solid white;
}</style>
