<template>
  <div>
    <CartStatus
      type="error"
      :title="$t('roundtrip.ReservationFailedTitle')"
      :description="$t('roundtrip.ReservationFailedDesc')"
      :show-relevant-offers="false"
    />
  </div>
</template>

<script>
import CartStatus from '@/components/cart/CartStatus'

export default {
  name: 'ReservationFailed',
  components: {
    CartStatus
  },
  mounted() {
    this.$store.commit('round-trip/setCartCache', false)
    this.$store.dispatch('user/updateFees', { updateDashboard: true })
  }
}
</script>
