import actions from './car-rental/actions'
import getters from './car-rental/getters'
import mutations from './car-rental/mutations'
import defaultState from './car-rental/initial'

export default {
  namespace: true,
  state: () => {
    return defaultState
  },
  actions,
  getters,
  mutations
}
