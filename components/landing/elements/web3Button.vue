<template>
  <button
    class="mx-8 rounded-full px-8 py-9 bg-landingButtonBackground text-white"
    @click="handler"
  >
    {{ $t('general.Connect') }}
  </button>
</template>

<script>
import Web3 from 'web3'

export default {
  methods: {
    async handler() {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        const web3 = new Web3(window.ethereum)
        const account = web3.eth.accounts
        const walletAddress = account.givenProvider.selectedAddress
        this.address = walletAddress
      }
    }
  }
}
</script>
