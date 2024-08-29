import Vue from 'vue'
import initial from './initial'

export default {
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
  notFoundFilterHistory(state, payload) {
    if (state.filterHistory.length > 0) {
      const last = state.filterHistory[state.filterHistory.length - 1]
      if (payload.filters !== undefined && payload.filters.length > 0) {
        payload.filters.forEach((element) => {
          if (element.category === 'text') {
            last.forEach((lastElement) => {
              if (
                lastElement.category === 'text' &&
                lastElement.filter === element.filter
              ) {
                state.filterHistory.pop()
              }
            })
          }
        })
      }
    }
  },
  setCartCache(state, payload) {
    state.cartCache = payload
  },
  setSearchCache(state, payload) {
    state.searchCache = { ...state.searchCache, ...payload }
  },
  clearSearchCache(state, payload) {
    delete state.searchCache[payload]
  }
}
