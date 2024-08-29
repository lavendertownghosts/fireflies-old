export default {
  getNewsList(context, params, options) {
    return this.$api.$post('news/getlist', params, options)
  },
  getSingleNews(context, params, options) {
    return this.$api.$post('news/getsingle', params, options)
  },
  getConditionPage(context, params, options) {
    return this.$api.$post('news/conditions', params, options)
  },
  getNewsEnabled(context, params, options) {
    return this.$api.$post('news/newsEnabled', params, options)
  }
}
