import actions from './flight/actions'
import getters from './flight/getters'
import mutations from './flight/mutations'
import defaultState from './flight/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
