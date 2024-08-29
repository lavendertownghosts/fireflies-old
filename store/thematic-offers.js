import actions from './thematic-offers/actions'
import getters from './thematic-offers/getters'
import mutations from './thematic-offers/mutations'
import defaultState from './thematic-offers/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
