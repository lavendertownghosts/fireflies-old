<template>
  <div
    class="w-full flex flex-col justify-center z-30 overflow-hidden px-16 text-center"
  >
    <PaymentLoading
      :status-call="paymentStatus"
      :token="$route.params.token"
      @completed="paymentCompleted"
      @error="paymentError"
      @pending="paymentPending"
    />
    <div class="text-primary text-lg leading-24 mt-32 font-bold">
      {{ $t('general.PaymentProgressTitle') }}
    </div>
    <div class="text-black text-sm leading-20 mt-8 md:px-92 lg:px-60 mx-auto">
      {{ $t('general.PaymentProgressDescription') }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PaymentLoading from '@/components/PaymentLoading'

export default {
  name: 'WebofficePaymentPage',
  middleware: 'auth_needed',
  components: {
    PaymentLoading
  },
  data() {
    return {
      result: false
    }
  },
  methods: {
    ...mapActions('user', ['paymentStatus']),
    paymentCompleted() {
      this.$router.replace(this.localePath('/weboffice/payment/success'))
    },
    paymentPending() {
      this.$router.replace(this.localePath('/weboffice/payment/pending'))
    },
    paymentError() {
      this.$router.replace(this.localePath('/weboffice/payment/failed'))
    }
  }
}
</script>
