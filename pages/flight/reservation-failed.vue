<template>
  <div>
    <CartStatus
      type="error"
      :title="$t('flight.ReservationFailedTitle')"
      :description="$t('flight.ReservationFailedDesc')"
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
    this.$store.commit('flight/setCartCache', false)
    this.$store.dispatch('user/updateFees', { updateDashboard: true })
  }
}
</script>
