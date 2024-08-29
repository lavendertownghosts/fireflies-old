export default {
  showSnackbar(context, payload) {
    if (payload === 'Expired token') {
      context.commit('setSnackbar', false)
      return
    }

    context.commit('setSnackbar', payload)
    setTimeout(() => {
      context.commit('setSnackbar', false)
    }, 10000)
  },
  showPopup(context, payload) {
    context.commit('setPopup', payload)
  }
}
