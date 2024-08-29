<template>
  <div class="h-full flex items-center">
    <LoadingAnimation color="#00ADB5" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import LoadingAnimation from '@/components/micro/LoadingAnimation'

export default {
  components: {
    LoadingAnimation
  },
  async mounted() {
    let res = false
    try {
      res = await this.postimpersonationToken({
        token: this.$route.query.token,
        lang: this.$i18n.locale
      })
    } catch (e) {
      let body = await e.response
      if (body && e.response !== undefined) {
        body = await e.response.json()
        if (body.messages !== undefined) {
          console.log(body.messages)
          this.$store.dispatch('general/showSnackbar', {
            message: this.$t('general.LoginInvalid')
          })
          this.$router.replace(this.localePath('/'))
        }
      }
    }

    if (res) {
      this.$store.commit('user/setWebOfficeMenu', false)
      this.$store.commit('user/setUserId', res.user_id)
      this.$store.commit('user/setIsCis', res.is_cis)
      this.$store.commit('user/setPowerLine', res.powerline)
      this.$store.commit('user/setFees', res.fees)
      this.$store.commit('user/setAllowedGeo', res.user_geo_allowed)
      this.$store.commit('user/setAllowedPV', res.user_pv_allowed)
      this.$store.commit('user/setPremiumUser', res.premiumuser)

      // Exclusive offer engedélyezés
      this.exclusiveEnabled = await this.$store.dispatch(
        'user/exclusiveMenuCheck'
      )

      this.exclusiveEnabled = true

      this.$store.commit('user/setExclusiveEnabled', this.exclusiveEnabled)

      // Exclusive offer emlékeztető
      const exclusiveOffers = await this.$store.dispatch(
        'user/exclusiveOffers',
        { discount_pass: true }
      )

      if (this.exclusiveEnabled) {
        if (exclusiveOffers.offersList !== undefined) {
          if (exclusiveOffers.offersList.length > 0) {
            this.$store.dispatch('general/showPopup', {
              title: this.$t('exclusive_offers.DCLoginPopupTitle') + ' PREMIUM',
              message: this.$t('exclusive_offers.DCLoginPopupMessage'),
              acceptText: this.$t('exclusive_offers.DCLoginPopupButtonText'),
              url: '/weboffice/discount-pass'
            })
          } else {
            // Exclusive offer emlékeztető
            const exclusiveOffers = await this.$store.dispatch(
              'user/exclusiveOffers'
            )

            if (this.exclusiveEnabled) {
              if (exclusiveOffers.offersList !== undefined) {
                if (exclusiveOffers.offersList.length > 0) {
                  this.$store.dispatch('general/showPopup', {
                    title: this.$t('exclusive_offers.LoginPopupTitle'),
                    message: this.$t('exclusive_offers.LoginPopupMessage'),
                    acceptText: this.$t(
                      'exclusive_offers.LoginPopupButtonText'
                    ),
                    url: '/weboffice/exclusive-offers'
                  })
                }
              }
            }
          }
        }
      }

      this.$store.dispatch('general/showSnackbar', {
        message: this.$t('general.LoginSuccessful')
      })
      this.$router.replace(this.localePath('/weboffice'))
    }
  },
  methods: {
    ...mapActions('user', ['postimpersonationToken'])
  }
}
</script>
