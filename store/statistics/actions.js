export default {
  getStatistics() {
    return this.$api.$get('statistics')
  },
  getStatisticLocations(context, params, options) {
    return this.$api.$post('statistics/locations', params, options)
  }
}
