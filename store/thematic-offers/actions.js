export default {
  getThematicList(context, params, options) {
    return this.$api.$post('thematic/thematiclist', params, options)
  },
  getOffer(context, params, options) {
    return this.$api.$post('thematic/offer', params, options)
  },
  getOfferList(context, params, options) {
    return this.$api.$post('thematic/offerlist', params, options)
  },
  getOfferFilters(context, params, options) {
    if (params.filters === false) {
      params.filters = {}
    }
    return this.$api.$post('thematic/offerfilters', params, options)
  },
  getMultiList(context, params, options) {
    return this.$api.$post('thematic/multilist', params, options)
  },
  payCart(context, params, options) {
    return this.$api.$post('thematic/pay', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('thematic/payment-status', params, options)
  }
}
