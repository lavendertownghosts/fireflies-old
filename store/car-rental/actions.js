export default {
  getCarRentalNameSearchResult(context, params, options) {
    return this.$api.$post('car-rental/text', params, options)
  },
  initCarRentalSearch(context, params, options) {
    return this.$api.$post('car-rental/search', params, options)
  },
  getCarRentalSearch(context, params, options) {
    return this.$api.$post('car-rental/results', params, options)
  },
  getCarRentalFilter(context, params, options) {
    return this.$api.$post('car-rental/filters', params, options)
  },
  getCarRentalDetails(context, params, options) {
    return this.$api.$post('car-rental/details', params, options)
  },
  getHandlingFee(context, params, options) {
    return this.$api.$post('car-rental/handling-fee', params, options)
  },
  cart(context, params, options) {
    return this.$api.$post('car-rental/cart', params, options)
  },
  payCart(context, params, options) {
    return this.$api.$post('car-rental/pay', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('car-rental/payment-status', params, options)
  },
  getCountries(context, params, options) {
    return this.$api.$post('car-rental/countries', params, options)
  }
}
