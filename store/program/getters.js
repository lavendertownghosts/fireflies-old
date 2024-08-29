export default {
  getSearchHistory: (state) => {
    return state.searchHistory
  },
  getFilterHistory: (state) => {
    console.log(state.programFilterHistory)
    return state.programFilterHistory
  },
  cartCache: (state) => {
    return state.cartCache
  }
}
