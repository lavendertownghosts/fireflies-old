<template>
  <div>
    <div
      class="flex flex-col w-full lg:py-16 md:border border-grey-light rounded lg:px-16 lg:items-center lg:flex-row lg:border-0 lg:bg-grey-light lg:bg-opacity-50"
    >
      <div class="text-black mr-16 hidden lg:block">
        <i class="far fa-clock fa-2x"></i>
      </div>
      <div
        :class="active ? 'text-white bg-black' : 'text-black'"
        class="flex-row px-16 py-12 rounded-t hidden md:flex lg:hidden"
        @click="active = !active"
      >
        <div class="flex-grow">
          <i class="far fa-clock"></i>
          {{ $t('weboffice.ProductExpirations') }}
        </div>
        <div class="flex items-center">
          <i
            :class="[active ? 'fa-chevron-up' : 'fa-chevron-down']"
            class="w-16 fal"
          ></i>
        </div>
      </div>
      <div
        :class="!active ? 'flex md:hidden lg:flex' : 'flex'"
        class="flex-col text-black w-full p-16 lg:p-0"
      >
        <div
          class="flex flex-row flex-wrap items-center md:flex-col md:items-start lg:flex-row lg:flex-wrap lg:items-center mb-5"
        >
          <div
            class="text-sm leading-14 w-full sm:w-1/2 md:w-full lg:w-1/2 pr-10"
          >
            {{ $t('weboffice.WebofficeExpirationDate') }}:
          </div>
          <div class="flex w-full sm:w-1/2 md:w-full lg:w-1/2 items-center">
            <div
              v-if="
                getFees !== false &&
                  calcRemainingTime(getFees.entry.expirationDate) === false
              "
              class="flex"
            >
              <nuxt-link
                :to="localePath('/weboffice/membership-upgrade')"
                :class="
                  getFees.entry.expirationDate ===
                  format(new Date(), 'yyyy-MM-dd')
                    ? 'link'
                    : 'link-danger'
                "
              >
                {{
                  getFees.entry.expirationDate ===
                  format(new Date(), 'yyyy-MM-dd')
                    ? $t('weboffice.BuyFFProduct')
                    : $t('weboffice.ExpiredPurchase')
                }}...
              </nuxt-link>
            </div>
            <div v-else class="flex">
              {{
                getFees !== false &&
                  calcRemainingTime(getFees.entry.expirationDate)
              }}
            </div>
          </div>
        </div>
        <div
          class="flex flex-row flex-wrap items-center md:flex-col md:items-start lg:flex-row lg:flex-wrap lg:items-center mb-5"
        >
          <div
            class="text-sm leading-14 w-full sm:w-1/2 md:w-full lg:w-1/2 pr-10"
          >
            {{ $t('weboffice.PortalExpirationDate') }}:
          </div>
          <div class="w-full sm:w-1/2 md:w-full lg:w-1/2">
            <div
              v-if="
                getFees !== false &&
                  calcRemainingTime(getFees.portal.expirationDate) === false
              "
            >
              <nuxt-link
                :to="localePath('/weboffice/membership-upgrade')"
                :class="
                  getFees.portal.expirationDate ===
                  format(new Date(), 'yyyy-MM-dd')
                    ? 'link'
                    : 'link-danger'
                "
              >
                {{
                  getFees.portal.expirationDate ===
                  format(new Date(), 'yyyy-MM-dd')
                    ? $t('weboffice.BuyFFProduct')
                    : $t('weboffice.ExpiredPurchase')
                }}...
              </nuxt-link>
            </div>
            <div v-else>
              {{
                getFees !== false &&
                  calcRemainingTime(getFees.portal.expirationDate)
              }}
            </div>
          </div>
        </div>
        <div
          v-show="!isCis"
          class="flex flex-row flex-wrap items-center md:flex-col md:items-start lg:flex-row lg:flex-wrap lg:items-center mb-5"
        >
          <div
            class="text-sm leading-14 w-full sm:w-1/2 md:w-full lg:w-1/2 pr-10"
          >
            {{ getPackageUserPackageName }}
            <span class="lowercase">{{
              $t('weboffice.PackageExpirationDate')
            }}</span
            >:
          </div>
          <div class="w-full sm:w-1/2 md:w-full lg:w-1/2">
            <div
              v-if="
                getFees !== false &&
                  calcRemainingTime(getFees.package.expirationDate) === false
              "
            >
              <nuxt-link
                :to="localePath('/weboffice/membership-upgrade')"
                :class="
                  getFees.package.expirationDate ===
                  format(new Date(), 'yyyy-MM-dd')
                    ? 'link'
                    : 'link-danger'
                "
              >
                {{
                  getFees.package.expirationDate ===
                  format(new Date(), 'yyyy-MM-dd')
                    ? $t('weboffice.BuyFFProduct')
                    : $t('weboffice.ExpiredPurchase')
                }}...
              </nuxt-link>
            </div>
            <div v-else>
              {{
                getFees !== false &&
                  calcRemainingTime(getFees.package.expirationDate)
              }}
            </div>
          </div>
        </div>
        <div
          v-if="passivePowerBonus.user_not_in_line !== true"
          class="flex flex-row flex-wrap items-center md:flex-col md:items-start lg:flex-row lg:flex-wrap lg:items-center mb-5"
        >
          <div
            class="text-sm leading-14 w-full sm:w-1/2 md:w-full lg:w-1/2 pr-10"
          >
            {{ $t('weboffice.PassivePowerlineBonusRemainingTime') }}
          </div>
          <div class="w-full sm:w-1/2 md:w-full lg:w-1/2">
            <div v-if="passivePowerBonus !== false">
              {{
                calcRemainingTime(
                  passivePowerBonus.pplb_counter !== undefined
                    ? passivePowerBonus.pplb_counter !== ''
                      ? passivePowerBonus.pplb_counter
                      : passivePowerBonus.pplb_startdate_plus182
                    : passivePowerBonus.pplb_startdate_plus182
                )
              }}
            </div>
          </div>
        </div>

        <div
          v-if="passivePowerBonus.user_not_in_line !== true"
          class="flex flex-row flex-wrap items-center md:flex-col md:items-start lg:flex-row lg:flex-wrap lg:items-center mb-5"
        >
          <div
            class="text-sm leading-14 w-full sm:w-1/2 md:w-full lg:w-1/2 pr-10"
          >
            {{ $t('weboffice.PassivePowerlineBonusAllBonusAvg') }}
          </div>
          <div class="w-full sm:w-1/2 md:w-full lg:w-1/2">
            <div v-if="passivePowerBonus !== false">
              {{
                passivePowerBonus.average !== undefined
                  ? passivePowerBonus.average
                  : 0 | formatNumber('0,0', { thousandsSeparator: ' ' })
              }}
              EUR /
              {{ $t('weboffice.PassivePerPerson') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { format } from 'date-fns'
import { calcRemainingTime } from '@/includes/utils'

export default {
  name: 'WebofficeFeesBox',
  data() {
    return {
      active: false,
      passivePowerBonus: false
    }
  },
  computed: {
    ...mapGetters('user', ['getFees', 'isCis']),
    getPackageUserPackageName() {
      if (this.getFees !== false && this.getFees.package !== undefined) {
        return (
          this.getFees.package.permission.charAt(0).toUpperCase() +
          this.getFees.package.permission.slice(1).toLowerCase()
        )
      }
      return ''
    }
  },
  mounted() {
    this.getDetails()
  },
  methods: {
    calcRemainingTime,
    format,
    async getDetails() {
      this.passivePowerBonus = await this.$store.dispatch(
        'user/getPassivePowerlineBonusData'
      )
    }
  }
}
</script>
