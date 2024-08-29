import actions from './general/actions'
import getters from './general/getters'
import mutations from './general/mutations'
import defaultState from './general/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
