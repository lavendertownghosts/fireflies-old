import Vue from 'vue'
import initial from './initial'

export default {
  resetState(state, payload) {
    for (const f in state) {
      Vue.set(state, f, initial[f])
    }
  },
  pushFilterHistory(state, payload) {
    if (state.filterHistory.length > 0) {
      state.filterHistory = state.filterHistory.filter((object) => {
        return JSON.stringify(payload) !== JSON.stringify(object)
      })
    }
    state.filterHistory.push(payload)

    if (state.filterHistory.length > 3) {
      state.filterHistory.shift()
    }
  },
  setCartCache(state, payload) {
    state.cartCache = payload
  }
}
