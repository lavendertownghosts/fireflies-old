<template>
  <div>
    <LoadingAnimation color="#00ADB5" />
  </div>
</template>

<script>
import LoadingAnimation from '@/components/micro/LoadingAnimation'

export default {
  name: 'PaymentLoading',
  components: {
    LoadingAnimation
  },
  props: {
    token: {
      type: String,
      required: true
    },
    statusCall: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      statusCounter: 0,
      statusLimit: 50,
      results: false,
      timeoutID: 0
    }
  },
  mounted() {
    this.statusCounter = 0
    this.statusStartInterval()
  },
  methods: {
    async statusStartInterval(params) {
      let hasError = false
      let res
      try {
        this.statusCounter++
        res = await this.statusCall({
          token: this.token,
          lang: this.$i18n.locale
        })
      } catch (e) {
        console.log(e)
        hasError = true
        this.$emit('error', e)
      }

      this.results = res

      if (
        res !== undefined &&
        res.OrderStatePaymentStatus !== undefined &&
        res.OrderStatePaymentStatus === 'SUCCESSFUL' &&
        res.OrderStateStatus === 'FINISHED' &&
        (res.reservationState === undefined ||
          res.reservationState === 'CONFIRMED')
      ) {
        this.$store.dispatch('user/updateFees', { updateDashboard: true })
        this.$emit('completed', res)
      } else if (
        res !== undefined &&
        res.OrderStatePaymentStatus !== undefined &&
        res.OrderStatePaymentStatus === 'SUCCESSFUL' &&
        res.OrderStateStatus === 'FINISHED' &&
        res.reservationState === 'PENDING'
      ) {
        this.$store.dispatch('user/updateFees', { updateDashboard: true })
        this.$emit('pending', res)
      } else if (
        (res !== undefined &&
          res.OrderStatePaymentStatus !== undefined &&
          ((res.OrderStatePaymentStatus === 'SUCCESSFUL' &&
            res.OrderStateStatus === 'FINISHED' &&
            res.reservationState === 'CANCELLED') ||
            (res.OrderStatePaymentStatus === 'FAILED' &&
              res.OrderStateStatus === 'FINISHED'))) ||
        this.statusCounter > this.statusLimit
      ) {
        this.$store.dispatch('user/updateFees', { updateDashboard: true })
        this.$emit('error', res)
      } else if (
        res !== undefined &&
        res.OrderStatePaymentStatus !== undefined &&
        res.OrderStatePaymentStatus === 'SUCCESSFUL' &&
        res.OrderStateStatus === 'FORCE_PENDING'
      ) {
        this.$store.dispatch('user/updateFees', { updateDashboard: true })
        this.$emit('pending', res)
      } else if (!hasError) {
        await this.timeout(2000)
        this.statusStartInterval()
      }
    },
    timeout(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms))
    }
  }
}
</script>
