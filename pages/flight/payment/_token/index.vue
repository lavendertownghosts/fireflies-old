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
    <div
      class="text-black text-sm leading-20 mt-8 md:px-92 lg:px-216 xl:px-320 mx-auto"
    >
      {{ $t('general.PaymentProgressDescription') }}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import PaymentLoading from '@/components/PaymentLoading'

export default {
  name: 'FlightPaymentPage',
  middleware: 'auth_needed',
  components: {
    PaymentLoading
  },
  data() {
    return {
      result: false
    }
  },
  mounted() {
    this.$store.commit('flight/setCartCache', false)
  },
  methods: {
    ...mapActions('flight', ['paymentStatus']),
    paymentCompleted() {
      this.$router.replace(this.localePath('/flight/reservation-success'))
    },
    paymentPending() {
      this.$store.dispatch('user/updateFees', { updateDashboard: true })
      this.$router.replace(this.localePath('/flight/reservation-pending'))
    },
    paymentError() {
      this.$store.dispatch('user/updateFees', { updateDashboard: true })
      this.$router.replace(this.localePath('/flight/reservation-failed'))
    }
  }
}
</script>
