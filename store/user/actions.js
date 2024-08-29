export default {
  postLogin(context, params, options) {
    return this.$api.$post('user/login', params, options)
  },
  postLogout(context, params, options) {
    return this.$api.$post('user/logout', params, options)
  },
  postDeleteRegistration(context, params, options) {
    return this.$api.$get('user/delete-registration', params, options)
  },
  connexAvailable(context, params, options) {
    return this.$api.$get('user/connex-available', params, options)
  },
  getUserCountry(context, params, options) {
    return this.$api.$post('user/user-country', params, options)
  },
  getUserCountryAllowed(context, params, options) {
    return this.$api.$post('user/user-country-allowed', params, options)
  },
  postResetPassword(context, params, options) {
    return this.$api.$post('user/reset-password', params, options)
  },
  guestChangePassword(context, params, options) {
    return this.$api.$post('user/change-password-guest', params, options)
  },
  getRegistrationToken(context, params, options) {
    return this.$api.$post('user/registration-token', params, options)
  },
  getPersonalData() {
    return this.$api.$get('user/props')
  },
  getCountries() {
    return this.$api.$get('user/countries')
  },
  getTravelCard(context, params, options) {
    return this.$api.$post('user/tc', params, options)
  },
  getFees() {
    return this.$api.$get('user/fees')
  },
  getBusinessData(context, params, options) {
    return this.$api.$post('user/business-data', params, options)
  },
  getComissionData() {
    return this.$api.$get('user/comission-data')
  },
  getRevolutEditable() {
    return this.$api.$get('user/revolut-editable')
  },
  activities() {
    return this.$api.$get('user/activities')
  },
  saveRevolut(context, params, options) {
    return this.$api.$post('user/revolut-save', params, options)
  },
  saveCrosscard(context, params, options) {
    return this.$api.$post('user/crosscard-save', params, options)
  },
  saveNumberCrosscard(context, params, options) {
    return this.$api.$post('user/crosscard-number-save', params, options)
  },
  getReservations(context, params, options) {
    return this.$api.$post('user/reservations', params, options)
  },
  reservationCancel(context, params, options) {
    return this.$api.$post('user/reservation-cancel', params, options)
  },
  reservationCarrentCancel(context, params, options) {
    return this.$api.$post('car-rental/cancel', params, options)
  },
  getVouchers() {
    return this.$api.$get('user/vouchers')
  },
  getVouchersAvailable() {
    return this.$api.$get('user/vouchers-available')
  },
  getCoupons() {
    return this.$api.$get('user/coupons')
  },
  getCredits() {
    return this.$api.$get('user/credits')
  },
  getBestPriceOptions() {
    return this.$api.$get('user/bpo')
  },
  getMembershipUpgrade(context, params, options) {
    return this.$api.$post('user/membership-upgrade', params, options)
  },
  getLoyaltyStepProduct(context, params, options) {
    return this.$api.$post('user/loyalty-step-product', params, options)
  },
  payLoyaltyStepProduct(context, params, options) {
    return this.$api.$post('user/pay-loyalty-step-product', params, options)
  },
  changeLoyaltyStepProductAutoship(context, params, options) {
    return this.$api.$post(
      'user/change-loyalty-step-product-autoship',
      params,
      options
    )
  },
  payLoyaltyCyclePosition(context, params, options) {
    return this.$api.$post('user/pay-loyalty-cycle-position', params, options)
  },
  getLoyaltyCycleGroup(context, params, options) {
    return this.$api.$post('user/loyalty-cycle-group', params, options)
  },
  getVipCycleGroup(context, params, options) {
    return this.$api.$post('user/vip-cycle-group', params, options)
  },
  getVipCycleQualification(context, params, options) {
    return this.$api.$post('user/vip-cycle-qualification', params, options)
  },
  payVipCyclePosition(context, params, options) {
    return this.$api.$post('user/pay-vip-cycle-position', params, options)
  },
  getVIPBonusQNameSearchResult(context, params, options) {
    return this.$api.$post('user/vip-qualification-namesearch', params, options)
  },
  getVIPBonusGroupNameSearchResult(context, params, options) {
    return this.$api.$post('user/vip-bonus-group-namesearch', params, options)
  },
  getStepProduct() {
    return this.$api.$get('user/step-product')
  },
  getVIPStepProduct(context, params, options) {
    return this.$api.$post('user/vip-step-product', params, options)
  },
  setVIPStepProductNeedAutoship(context, params, options) {
    return this.$api.$post(
      'user/vip-step-product-need-autoship',
      params,
      options
    )
  },
  payStepFFVIPProductCart(context, params, options) {
    return this.$api.$post('user/pay-step-vip-product', params, options)
  },
  getMembershipProducts() {
    return this.$api.$get('user/membership-products')
  },
  getPowerLine(context, params, options) {
    return this.$api.$post('user/power-line', params, options)
  },
  getNewsletter() {
    return this.$api.$get('user/newsletter')
  },
  getNewsletterContent(context, params, options) {
    return this.$api.$post('user/newslettercontent', params, options)
  },
  saveNewsletterOption(context, params, options) {
    return this.$api.$post('user/newsletter', params, options)
  },
  getInvites(context, params, options) {
    return this.$api.$post('user/invites', params, options)
  },
  getSentInvites() {
    return this.$api.$get('user/sent-invites')
  },
  getDirectTravelContest(context, options) {
    return this.$api.$get('user/directtravelcontest', options)
  },
  getDirectPreviousContests(context, options) {
    return this.$api.$get('user/directpreviouscontests', options)
  },
  getPreviousContests(context, options) {
    return this.$api.$get('user/previouscontests', options)
  },
  getCommissionPayment(context, params, options) {
    return this.$api.$post('user/commission-payment', params, options)
  },
  getDistribution(context, params, options) {
    return this.$api.$post('user/distribution', params, options)
  },
  getDownloads(context, params, options) {
    return this.$api.$post('user/downloads', params, options)
  },
  getLearningCorner(context, params, options) {
    return this.$api.$post('user/learning-corner', params, options)
  },
  getTravelContest(context, options) {
    return this.$api.$get('user/travelcontest', options)
  },
  getLeaderDepthBonus(context, options) {
    return this.$api.$get('user/leaderdepthbonus', options)
  },
  getCapitalBonus(context, params, options) {
    return this.$api.$post('user/capitalbonus', params, options)
  },
  getCapitalBonusNameSearchResult(context, params, options) {
    return this.$api.$post('user/capital-bonus-name-filter', params, options)
  },
  getStartCapitalShareBonus(context, options) {
    return this.$api.$get('user/startcapitalsharebonus', options)
  },
  getRegistrationTimeline() {
    return this.$api.$get('user/registration-timeline')
  },
  getRegistrationTimelineFilter(context, params, options) {
    return this.$api.$post('user/registration-timeline-filter', params, options)
  },
  getRegistrationTimelineUser(context, params, options) {
    return this.$api.$post('user/registration-timeline-user', params, options)
  },
  getGroupData(context, options) {
    return this.$api.$get('user/groupdata', options)
  },
  searchUserForTransmission(context, params, options) {
    return this.$api.$post('user/search-user-for-transmission', params, options)
  },
  doUserTransmission(context, params, options) {
    return this.$api.$post('user/do-user-transmission', params, options)
  },
  getCommissionStatistics(context, options) {
    return this.$api.$get('user/commission-statistics', options)
  },
  getTurnoverStatistics(context, params, options) {
    return this.$api.$post('user/turnover-statistics', params, options)
  },
  getPhasicPurchaseStatistics(context, params, options) {
    return this.$api.$post('user/phasic-purchase-statistics', params, options)
  },
  getDeductedItems(context, options) {
    return this.$api.$get('user/deducteditems', options)
  },
  getLeaderDistribution(context, params, options) {
    return this.$api.$post('user/leader-distribution', params, options)
  },
  getCurrentPoints(context, params, options) {
    if (params.showType !== undefined) {
      if (params.showType === 101) {
        return this.$api.$post('user/qualification-points', params, options)
      }
    }
    return this.$api.$post('user/current-points', params, options)
  },
  getPaymentPoints(context, params, options) {
    return this.$api.$post('user/payment-points', params, options)
  },
  getNewUserCounter(context, params, options) {
    return this.$api.$post('user/new-user-counter', params, options)
  },
  getUserList(context, params, options) {
    return this.$api.$post('user/user-list', params, options)
  },
  getUserGroupList(context, params, options) {
    return this.$api.$post('user/user-group-list', params, options)
  },
  getUserGroupNameSearch(context, params, options) {
    return this.$api.$post('user/user-group-namesearch', params, options)
  },
  getUserLine(context, params, options) {
    return this.$api.$post('user/user-line', params, options)
  },
  getDashboard(context, options) {
    return this.$api.$get('user/dashboard', options)
  },
  invoiceDownload(context, params, options) {
    return this.$api.$post('user/invoice-download', params, options)
  },
  acceptVoucher(context, params, options) {
    return this.$api.$post('user/accept-voucher', params, options)
  },
  exchangeVoucher(context, params, options) {
    return this.$api.$post('user/exchange-voucher', params, options)
  },
  validateVoucher(context, params, options) {
    return this.$api.$post('user/validate-voucher', params, options)
  },
  giveVoucher(context, params, options) {
    return this.$api.$post('user/give-voucher', params, options)
  },
  giveCoupon(context, params, options) {
    return this.$api.$post('user/give-coupon', params, options)
  },
  acceptCoupon(context, params, options) {
    return this.$api.$post('user/accept-coupon', params, options)
  },
  exchangeCoupon(context, params, options) {
    return this.$api.$post('user/exchange-coupon', params, options)
  },
  exchangeBPO(context, params, options) {
    return this.$api.$post('user/exchange-bpo', params, options)
  },
  searchUserForBPO(context, params, options) {
    return this.$api.$post('user/search-users-for-bpo', params, options)
  },
  recallBPO(context, params, options) {
    return this.$api.$post('user/recall-bpo', params, options)
  },
  sendInvitation(context, params, options) {
    return this.$api.$post('user/send-invitation', params, options)
  },
  changePassword(context, params, options) {
    return this.$api.$post('user/change-password', params, options)
  },
  postRegistration(context, params, options) {
    return this.$api.$post('user/registration', params, options)
  },
  postPersonalData(context, params, options) {
    return this.$api.$post('user/props', params, options)
  },
  postBillingData(context, params, options) {
    return this.$api.$post('user/billing-props', params, options)
  },
  getTurnoverStatisticDetails(context, params, options) {
    return this.$api.$post('user/turnover-statistic', params, options)
  },
  getBPOTransmissionUsersNameSearchResult(context, params, options) {
    return this.$api.$post('user/search-users-for-bpo', params, options)
  },
  postBPOTransmission(context, params, options) {
    return this.$api.$post('user/bpo-transmission', params, options)
  },
  getLoyaltyCyclePosition() {
    return this.$api.$get('user/loyalty-cycle-position')
  },
  getLoyaltyCycleUserPosition(context, params, options) {
    return this.$api.$post('user/loyalty-cycle-user-position', params, options)
  },
  loyaltyCycleSignPlacement(context, params, options) {
    return this.$api.$post('user/loyalty-cycle-sign-placement', params, options)
  },
  postLoyaltyPlacementUser(context, params, options) {
    return this.$api.$post('user/loyalty-placement-user', params, options)
  },
  changeLoyaltyAutoReBuy(context, params, options) {
    return this.$api.$post('user/change-loyalty-auto-rebuy', params, options)
  },
  postLoyaltyWaitingPlacement(context, params, options) {
    return this.$api.$post('user/loyalty-waiting-placement', params, options)
  },
  postLoyaltyCycleView(context, params, options) {
    return this.$api.$post('user/loyalty-cycle-view', params, options)
  },
  postLoyaltyDistributorNamesearch(context, params, options) {
    return this.$api.$post(
      'user/loyalty-distributor-namesearch',
      params,
      options
    )
  },
  getVIPCyclePosition(context, params, options) {
    return this.$api.$post('user/vip-cycle-position', params, options)
  },
  postVIPCycleView(context, params, options) {
    return this.$api.$post('user/vip-cycle-view', params, options)
  },
  postVIPDistributorNamesearch(context, params, options) {
    return this.$api.$post('user/vip-distributor-namesearch', params, options)
  },
  postVIPCycleAutoBuy(context, params, options) {
    return this.$api.$post('user/vip-cycle-auto-buy', params, options)
  },
  postVIPCyclePlacementUser(context, params, options) {
    return this.$api.$post(
      'user/vip-cycle-position-placement-user',
      params,
      options
    )
  },
  getVIPCycleBonusArchive(context, params, options) {
    return this.$api.$post('user/vip-cycle-bonus-archive', params, options)
  },
  getLoyaltyCycleBonusArchive(context, params, options) {
    return this.$api.$post('user/loyalty-cycle-bonus-archive', params, options)
  },
  addToFFCart(context, params, options) {
    return this.$api.$post('user/ff-product-cart', params, options)
  },
  getFFCart() {
    return this.$api.$get('user/ff-product-cart')
  },
  removeToFFCart(context, params, options) {
    return this.$api.$post('user/remove-ff-product-cart', params, options)
  },
  payFFCart(context, params, options) {
    return this.$api.$post('user/pay-ff-product-cart', params, options)
  },
  payConnexFFCart(context, params, options) {
    return this.$api.$post('user/pay-connex-product-cart', params, options)
  },
  payArrivaFFCart(context, params, options) {
    return this.$api.$post('user/pay-arriva-product-cart', params, options)
  },
  payTicketFFCart(context, params, options) {
    return this.$api.$post('user/pay-ticket-product-cart', params, options)
  },
  payVIPStep(context, params, options) {
    return this.$api.$post('user/pay-vip-step', params, options)
  },
  paymentStatus(context, params, options) {
    return this.$api.$post('user/payment-status', params, options)
  },
  exclusivePaymentStatus(context, params, options) {
    return this.$api.$post(
      'user/exclusive-offers-payment-status',
      params,
      options
    )
  },
  payStepFFProductCart(context, params, options) {
    return this.$api.$post('user/pay-step-ff-product-cart', params, options)
  },
  getWebOfficeMenu() {
    return this.$api.$get('user/weboffice-menu')
  },
  getVipLeaderBonus() {
    return this.$api.$get('user/vip-leader-bonus')
  },
  getVipLeaderBonusMedium() {
    return this.$api.$get('user/vip-leader-bonus-medium')
  },
  async updateFees(context, params) {
    let res
    try {
      res = await context.dispatch('getFees')
    } catch (e) {
      console.log(e)
    }
    if (res) {
      context.commit('setFees', res)
    }
    if (params && params.updateDashboard !== undefined) {
      if (params.updateDashboard) {
        try {
          context.dispatch('updateDashboard')
        } catch (e) {
          console.log(e)
        }
      }
    }
  },
  searchUserLoyaltyBonus(context, params, options) {
    return this.$api.$post('user/search-user-loyalty-bonus', params, options)
  },
  updateDashboard() {
    return this.$api.$get('user/update-dashboard')
  },
  acceptADF(context, params, options) {
    return this.$api.$post('user/accept-adf', params, options)
  },
  postimpersonationToken(context, params, options) {
    return this.$api.$post('user/impersonation-token', params, options)
  },
  exlusiveOfferFormSend(context, params, options) {
    return this.$api.$post('user/exclusive-sendform', params, options)
  },
  exlusiveOfferNameSearch(context, params, options) {
    return this.$api.$post('user/exclusive-namesearch', params, options)
  },
  exclusiveFormcheck(context, params, options) {
    return this.$api.$post('user/exclusive-formcheck', params, options)
  },
  exclusiveOffers(context, params, options) {
    return this.$api.$post('user/exclusive-offers', params, options)
  },
  exclusiveCart(context, params, options) {
    return this.$api.$post('user/exclusive-offer-cart', params, options)
  },
  exclusiveMenuCheck(context, params, options) {
    return this.$api.$post(
      'user/exclusive-offers-menu-enabled',
      params,
      options
    )
  },
  exclusivePay(context, params, options) {
    return this.$api.$post('user/exclusive-offers-pay', params, options)
  },
  esclusivePaymentStatus(context, params, options) {
    return this.$api.$post(
      'user/exclusive-offers-payment-status',
      params,
      options
    )
  },
  setLangPayload(context, params, options) {
    return this.$api.$post('user/payload-setlang', params, options)
  },
  setLang(context, params, options) {
    return this.$api.$post('user/setlang', params, options)
  },
  reSendLeadMail(context, params, options) {
    return this.$api.$post('user/resend-lead', params, options)
  },
  reSendRegMail(context, params, options) {
    return this.$api.$post('user/resend-registration', params, options)
  },
  getDiscountPassList(context, params, options) {
    return this.$api.$post('user/discount-pass-list', params, options)
  },
  getPassivePowerlineBonusData(context, params, options) {
    return this.$api.$post('user/passive-powerline-data', params, options)
  },
  paymentCallback(context, params, options) {
    return this.$api.$post('user/payment-callback', params, options)
  }
}
