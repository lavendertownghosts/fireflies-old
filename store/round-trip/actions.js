export default {
  getRoundTripNameSearchResult(context, params, options) {
    return this.$api.$post('round-trip/text', params, options)
  },
  initRoundTripSearch(context, params, options) {
    return this.$api.$post('round-trip/search', params, options)
  },
  getRoundTripSearch(context, params, options) {
    return this.$api.$post('round-trip/results', params, options)
  },
  getRoundTripFilter(context, params, options) {
    return this.$api.$post('round-trip/filters', params, options)
  },
  getRoundTripDetails(context, params, options) {
    return this.$api.$post('round-trip/details', params, options)
  },
  getRoundTripOffers(context, params, options) {
    return this.$api.$post('round-trip/offers', params, options)
  },
  addToCart(context, params, options) {
    return this.$api.$post('round-trip/cart', params, options)
  },
  payCart(context, params, options) {
    return this.$api.$post('round-trip/pay', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('round-trip/payment-status', params, options)
  },
  getHandlingFee(context, params, options) {
    return this.$api.$post('round-trip/handling-fee', params, options)
  }
}
