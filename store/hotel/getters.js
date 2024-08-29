export default {
  getSearchHistory: (state) => {
    return state.searchHistory
  },
  getFilterHistory: (state) => {
    return state.filterHistory
  },
  cartCache: (state) => {
    return state.cartCache
  },
  searchCache: (state) => {
    return state.searchCache
  }
}
