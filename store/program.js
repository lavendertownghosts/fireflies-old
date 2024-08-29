import actions from './program/actions'
import getters from './program/getters'
import mutations from './program/mutations'
import defaultState from './program/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
