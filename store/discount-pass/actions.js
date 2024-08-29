export default {
  getExcluiveOfferList(context, params, options) {
    return this.$api.$post('user/exclusive-offers-list', params, options)
  },
  getExcluiveOffer(context, params, options) {
    return this.$api.$post('user/exclusive-offer', params, options)
  }
}
