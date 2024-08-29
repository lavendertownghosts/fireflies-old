<template>
  <div>
    <CartStatus
      type="error"
      :title="$t('hotel.ReservationFailedTitle')"
      :description="$t('hotel.ReservationFailedDesc')"
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
  }
}
</script>
