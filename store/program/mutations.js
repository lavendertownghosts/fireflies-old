import Vue from 'vue'
import initial from './initial'

export default {
  resetState(state, payload) {
    for (const f in state) {
      Vue.set(state, f, initial[f])
    }
  },
  setCartCache(state, payload) {
    state.cartCache = payload
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
    if (state.programFilterHistory.length > 0) {
      state.programFilterHistory = state.programFilterHistory.filter(
        (object) => {
          return JSON.stringify(payload) !== JSON.stringify(object)
        }
      )
    }

    state.programFilterHistory.push(payload)
    if (state.programFilterHistory.length > 3) {
      state.programFilterHistory.shift()
    }
  }
}
