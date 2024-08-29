<template>
  <div>
    <CartStatus
      type="success"
      :title="$t('flight.ReservationSuccessTitle')"
      :description="$t('flight.ReservationSuccessDesc')"
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
    this.$store.commit('flight/setCartCache', false)
    this.$store.dispatch('user/updateFees', { updateDashboard: true })
  }
}
</script>
