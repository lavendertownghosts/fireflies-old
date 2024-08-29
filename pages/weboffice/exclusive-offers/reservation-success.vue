<template>
  <div>
    <CartStatus
      type="success"
      :title="$t('hotel.ReservationSuccessTitle')"
      :description="$t('hotel.ReservationSuccessDesc')"
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
  mounted() {},
  methods: {}
}
</script>
