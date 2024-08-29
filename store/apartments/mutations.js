import Vue from 'vue'
import initial from './initial'

export default {
  setCartCache(state, payload) {
    state.cartCache = payload
  },
  setPaymentType(state, paymentType) {
    state.paymentType = paymentType
  },

  resetState(state, payload) {
    for (const f in state) {
      Vue.set(state, f, initial[f])
    }
  },
  pushSearchHistory(state, payload) {
    if (state.searchHistory.length > 0) {
      state.searchHistory = state.searchHistory.filter((object) => {
        return JSON.stringify(payload) !== JSON.stringify(object)
      })
    }
    state.searchHistory.unshift(payload)

    if (state.searchHistory.length > 3) {
      state.searchHistory.pop()
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
  setSearchCache(state, payload) {
    state.searchCache = { ...state.searchCache, ...payload }
  },
  clearSearchCache(state, payload) {
    delete state.searchCache[payload]
  }
}
