import actions from './statistics/actions'
import getters from './statistics/getters'
import mutations from './statistics/mutations'
import defaultState from './statistics/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
