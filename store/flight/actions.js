export default {
  getFlightNameSearchResult(context, params, options) {
    return this.$api.$post('flight/text', params, options)
  },
  initFlightSearch(context, params, options) {
    return this.$api.$post('flight/search', params, options)
  },
  getFlightSearch(context, params, options) {
    return this.$api.$post('flight/results', params, options)
  },
  getFlightFilter(context, params, options) {
    return this.$api.$post('flight/filters', params, options)
  },
  getFlightCalendar(context, params, options) {
    return this.$api.$post('flight/calendar', params, options)
  },
  getFlightDetails(context, params, options) {
    return this.$api.$post('flight/details', params, options)
  },
  postFlightCart(context, params, options) {
    return this.$api.$post('flight/cart', params, options)
  },
  postFlightCartAcceptPrice(context, params, options) {
    return this.$api.$post('flight/cart-accept-price', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('flight/payment-status', params, options)
  },
  getFlightHandlingFee(context, params, options) {
    return this.$api.$post('flight/handling-fee', params, options)
  },
  paymentSuccess(context, params, options) {
    return this.$api.$post('flight/payment-success', params, options)
  }
}
