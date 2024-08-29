export default {
  isLoggedIn: (state) => {
    return state.token !== null
  },
  isExclusiveEnabled: (state) => {
    return state.exclusiveEnabled !== null ? state.exclusiveEnabled : true
  },
  getCountryList: (state) => {
    return state.countryList
  },
  getSessionGUID: (state) => {
    return state.sessionGUID
  },
  getSessionTime: (state) => {
    return state.sessionStamp
  },
  getUserId: (state) => {
    return state.userId
  },
  getGeoLoc: (state) => {
    return state.geolocation
  },
  getAllowedGeo: (state) => {
    return state.allowedgeo
  },
  getAllowedPV: (state) => {
    return state.allowedpv
  },
  getLang: (state) => {
    return state.lang
  },
  isCis: (state) => {
    return state.isCis
  },
  getFees: (state) => {
    return state.fees
  },
  getPowerline: (state) => {
    return state.powerline
  },
  getWebOfficeMenu: (state) => {
    return state.webOfficeMenu
  },
  isLoyaltyAllowed: (state) => {
    const allowedCountries = ['HU', 'RO', 'SK', 'CZ', 'GB']
    if (state.geolocation !== '') {
      return allowedCountries.includes(state.geolocation)
    }

    return false
  },
  isDistributor: (state) => {
    if (state.fees !== false) {
      const entryDate = new Date(state.fees.entry.expirationDate)
      // @todo: hozzá kell adni 90 napot
      entryDate.setDate(entryDate.getDate())
      if (entryDate > new Date()) {
        return true
      }
    }
    return false
  },
  isPremiumUser: (state) => {
    return state.isPremiumUser
  }
}
