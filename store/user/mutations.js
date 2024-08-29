import Vue from 'vue'
import initial from '~/store/user/initial'

export default {
  resetState(state, payload) {
    for (const f in state) {
      if (f !== 'sessionGUID' && f !== 'sessionStamp') {
        Vue.set(state, f, initial[f])
      }
    }
  },
  resetSessionTime(state) {
    state.sessionStamp = new Date()
  },
  setToken(state, payload) {
    state.token = payload
  },
  setSessionGUID(state, value) {
    state.sessionGUID = value
  },
  setExclusiveEnabled(state, payload) {
    state.exclusiveEnabled = payload
  },
  setUserId(state, payload) {
    state.userId = payload
  },
  setLang(state, payload) {
    state.lang = payload
  },
  setGeoLoc(state, data) {
    state.geolocation = data
  },
  setAllowedGeo(state, data) {
    state.allowedgeo = data
  },
  setAllowedPV(state, data) {
    state.allowedpv = data
  },
  setPowerLine(state, data) {
    state.powerline = data
  },
  setIsCis(state, payload) {
    state.isCis = payload
  },
  setFees(state, payload) {
    state.fees = payload
  },
  setWebOfficeMenu(state, payload) {
    state.webOfficeMenu = payload
  },
  setPremiumUser(state, payload) {
    state.isPremiumUser = payload
  },
  setCountryList(state, payload) {
    state.countryList = payload
  }
}
