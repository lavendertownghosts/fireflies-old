<template>
  <div>
    <CartStatus
      type="error"
      :title="$t('weboffice.PaymentFailedTitle')"
      :description="$t('weboffice.PaymentFailedDescription')"
      :show-relevant-offers="false"
      :is-weboffice="true"
    />
  </div>
</template>

<script>
import CartStatus from '@/components/cart/CartStatus'

export default {
  name: 'WebofficePaymentFailed',
  middleware: 'auth_needed',
  components: {
    CartStatus
  }
}
</script>
