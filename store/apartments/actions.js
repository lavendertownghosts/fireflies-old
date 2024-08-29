export default {
  // V1
  getCountries(context, params, options) {
    return this.$api.$post('apartments/countries', params, options)
  },
  getFilters(context, params, options) {
    return this.$api.$post('apartments/filters', params, options)
  },
  getList(context, params, options) {
    return this.$api.$post('apartments/list', params, options)
  },
  getDetails(context, params, options) {
    return this.$api.$post('apartments/details', params, options)
  },

  // V2
  getV2List(context, params, options) {
    return this.$api.$post('apartments/v2/list', params, options)
  },
  getV2Details(context, params, options) {
    return this.$api.$post('apartments/v2/details', params, options)
  },
  addToV2Cart(context, params, options) {
    console.log('asdasd')
    return this.$api.$post('apartments/v2/cart', params, options)
  },
  payV2HotelCart(context, params, options) {
    return this.$api.$post('apartments/v2/pay', params, options)
  },
  paymentStatusV2(context, params, options) {
    return this.$api.$post('apartments/v2/payment-status', params, options)
  },

  // CONDOS
  getHotelNameSearchResult(context, params, options) {
    return this.$api.$post('apartments/text', params, options)
  },
  initHotelSearch(context, params, options) {
    return this.$api.$post('apartments/search', params, options)
  },
  getHotelSearch(context, params, options) {
    return this.$api.$post('apartments/results', params, options)
  },
  getHotelSearchAll(context, params, options) {
    return this.$api.$post('apartments/results_all', params, options)
  },
  getHotelFilters(context, params, options) {
    return this.$api.$post('apartments/getfilters', params, options)
  },
  getHotelStaticDetails(context, params, options) {
    return this.$api.$post('apartments/details/static', params, options)
  },
  getHotelLiveDetails(context, params, options) {
    return this.$api.$post('apartments/details/live', params, options)
  },
  addToCart(context, params, options) {
    return this.$api.$post('apartments/hotelcart', params, options)
  },
  payHotelCart(context, params, options) {
    return this.$api.$post('apartments/hotelpay', params, options)
  },
  paymentStatusHotel(context, params, options) {
    return this.$api.$post('apartments/hotel-payment-status', params, options)
  }
}
