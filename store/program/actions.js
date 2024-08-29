export default {
  getProgramNameSearchResult(context, params, options) {
    return this.$api.$post('program/text', params, options)
  },
  initProgramSearch(context, params, options) {
    return this.$api.$post('program/search', params, options)
  },
  getProgramSearch(context, params, options) {
    return this.$api.$post('program/results', params, options)
  },
  getProgramDetails(context, params, options) {
    return this.$api.$post('program/details', params, options)
  },
  getTicketDetails(context, params, options) {
    return this.$api.$post('program/ticket-details', params, options)
  },
  getProgramFilters(context, params, options) {
    return this.$api.$post('program/filters', params, options)
  },
  addToCart(context, params, options) {
    return this.$api.$post('program/cart', params, options)
  },
  payCart(context, params, options) {
    return this.$api.$post('program/pay', params, options)
  },
  cancel(context, params, options) {
    return this.$api.$post('program/cancel', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('program/payment-status', params, options)
  }
}
