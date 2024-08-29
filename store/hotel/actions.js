export default {
  getHotelNameSearchResult(context, params, options) {
    return this.$api.$post('hotel/text', params, options)
  },
  initHotelSearch(context, params, options) {
    return this.$api.$post('hotel/search', params, options)
  },
  getHotelSearch(context, params, options) {
    return this.$api.$post('hotel/results/page', params, options)
  },
  getHotelMap(context, params, options) {
    return this.$api.$post('hotel/results/map', params, options)
  },
  getHotelFilters(context, params, options) {
    return this.$api.$post('hotel/filters', params, options)
  },
  getHotelStaticDetails(context, params, options) {
    return this.$api.$post('hotel/details/static', params, options)
  },
  getHotelLiveDetails(context, params, options) {
    return this.$api.$post('hotel/details/live', params, options)
  },
  addToCart(context, params, options) {
    return this.$api.$post('hotel/cart', params, options)
  },
  payCart(context, params, options) {
    return this.$api.$post('hotel/pay', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('hotel/payment-status', params, options)
  },
  getHotelHandlingFee(context, params, options) {
    return this.$api.$post('hotel/handling-fee', params, options)
  }
}
