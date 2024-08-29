export default {
  postSave(context, params, options) {
    return this.$api.$post('travel-assistant', params, options)
  },
  getDetails(context, params) {
    return this.$api.$get('travel-assistant/' + params.id)
  },
  delete(context, params) {
    return this.$api.$delete('travel-assistant/' + params.id)
  },
  getAll(context, params) {
    return this.$api.$get('travel-assistant')
  },
  undo(context, params, options) {
    return this.$api.$post('travel-assistant/undo', params, options)
  },
  deleteService(context, params) {
    return this.$api.$delete(
      'travel-assistant-service/' +
        params.travelAssistantId +
        '/' +
        params.serviceType
    )
  },
  postServiceSave(context, params, options) {
    return this.$api.$post('travel-assistant-service', params, options)
  },
  update(context, params, options) {
    return this.$api.$post('travel-assistant/update', params, options)
  }
}
