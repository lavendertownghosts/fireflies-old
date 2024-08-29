import actions from './user/actions'
import getters from './user/getters'
import mutations from './user/mutations'
import defaultState from './user/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
