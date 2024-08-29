export default {
  getSnackbar: (state) => {
    return state.snackbar
  },
  getPopup: (state) => {
    return state.popup
  },
  getMainActiveService: (state) => {
    return state.mainActiveService
  },
  getUsernameCache: (state) => {
    return state.usernameCache
  },
  getCurrency: (state) => {
    return state.currency
  }
}
