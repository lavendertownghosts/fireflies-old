import actions from './hotel/actions'
import getters from './hotel/getters'
import mutations from './hotel/mutations'
import defaultState from './hotel/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
