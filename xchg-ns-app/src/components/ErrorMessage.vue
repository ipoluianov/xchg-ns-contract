<script>
export default {
    data() {
        return {
            showFull: false,
        };
    },
    props: ['error'],
    computed: {

        hasErrors() {
            if (this.error === undefined || this.error == null) {
                return false;
            }
            let text = this.error.toString();
            if (text.length == 0)
                return false; 
            return true;
        },

        shortText() {
            if (this.error === undefined || this.error == null) {
                return "";
            }
            let text = this.error.toString();

            if (text.includes("domain already exists")) {
                text = "Domain already exists";
            }
            if (text.includes("invalid domain name")) {
                text = "invalid domain name";
            }
            if (text.toLowerCase().includes("reject")) {
                text = "Action rejected";
            }

            return text
        }
    }
}
</script>


<template>
    <div class="shortErrorText">{{ this.shortText }}</div>
    <div v-if="this.hasErrors && !this.showFull"><button @click="this.showFull = true">SHOW FULL TEXT</button></div>
    <div v-if="this.hasErrors && this.showFull"><button @click="this.showFull = false">HIDE FULL TEXT</button></div>
    <div v-if="this.showFull">{{ this.error }}</div>
</template>

<style>
.shortErrorText {
    color: red;
}
</style>