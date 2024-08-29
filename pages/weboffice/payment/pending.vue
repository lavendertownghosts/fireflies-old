<template>
  <div>
    <CartStatus
      type="pending"
      :title="$t('weboffice.PaymentPendingTitle')"
      :description="$t('weboffice.PaymentPendingDescription')"
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
  }
}
</script>
