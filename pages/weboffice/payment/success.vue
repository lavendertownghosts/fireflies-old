<template>
  <div>
    <CartStatus
      type="success"
      :title="$t('weboffice.PaymentSuccessTitle')"
      :description="$t('weboffice.PaymentSuccessDescription')"
      :show-relevant-offers="false"
      :is-weboffice="true"
    />
  </div>
</template>

<script>
import CartStatus from '@/components/cart/CartStatus'

export default {
  name: 'WebofficePaymentSuccess',
  middleware: 'auth_needed',
  components: {
    CartStatus
  },
  mounted() {
    this.$store.dispatch('user/updateFees', { updateDashboard: true })
  }
}
</script>
