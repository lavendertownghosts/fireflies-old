<template>
  <div>
    <CartStatus
      type="pending"
      :title="$t('hotel.ReservationPendingTitle')"
      :description="$t('hotel.ReservationPendingDesc')"
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
  }
}
</script>
