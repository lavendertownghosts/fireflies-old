<template>
  <div>
    <CartStatus
      type="pending"
      :title="$t('roundtrip.ReservationPendingTitle')"
      :description="$t('roundtrip.ReservationPendingDesc')"
      :show-relevant-offers="false"
    />
  </div>
</template>

<script>
import CartStatus from '@/components/cart/CartStatus'

export default {
  name: 'ReservationSuccess',
  components: {
    CartStatus
  },
  mounted() {
    this.$store.commit('round-trip/setCartCache', false)
    this.$store.dispatch('user/updateFees', { updateDashboard: true })
  }
}
</script>
