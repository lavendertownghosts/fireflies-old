import Vue from 'vue'
import initial from './initial'

export default {
  resetState(state, payload) {
    for (const f in state) {
      Vue.set(state, f, initial[f])
    }
  },
  setSnackbar(state, payload) {
    if (String(payload) !== 'Expired token') {
      state.snackbar = payload
    } else {
      state.snackbar = false
    }
  },
  setPopup(state, payload) {
    state.popup = payload
  },
  /* ITT LEHET MEGADNI A SZOLGÁLTATÁSOKAT */
  setMainActiveService(state, payload) {
    if (
      [
        'hotel',
        'flight',
        'roundTrip',
        'apartments',
        'carRental',
        'program',
        'cruise'
      ].includes(payload)
    ) {
      state.mainActiveService = payload
    }
  },
  setUsernameCache(state, payload) {
    state.usernameCache = payload
  },
  setCurrency(state, payload) {
    state.currency = payload
  }
}
