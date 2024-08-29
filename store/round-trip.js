import actions from './round-trip/actions'
import getters from './round-trip/getters'
import mutations from './round-trip/mutations'
import defaultState from './round-trip/initial'

export default {
  namespace: true,
  state: () => {
    return defaultState
  },
  actions,
  getters,
  mutations
}
