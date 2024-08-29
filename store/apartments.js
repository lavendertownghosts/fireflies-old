import actions from './apartments/actions'
import getters from './apartments/getters'
import mutations from './apartments/mutations'
import defaultState from './apartments/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
