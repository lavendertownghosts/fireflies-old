import actions from './travel-assistant/actions'
import getters from './travel-assistant/getters'
import mutations from './travel-assistant/mutations'
import defaultState from './travel-assistant/initial'

export default {
  namespaced: true,
  state: () => {
    return defaultState
  },
  actions,
  mutations,
  getters
}
