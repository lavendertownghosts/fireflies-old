import Vue from 'vue'
import initial from './initial'

export default {
  resetState(state, payload) {
    for (const f in state) {
      Vue.set(state, f, initial[f])
    }
  },
  setTravelAssistants(state, payload) {
    state.travelAssistants = payload
  }
}
