import actions from './news/actions'
import getters from './news/getters'
import mutations from './news/mutations'
import defaultState from './news/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
