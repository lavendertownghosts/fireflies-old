<template>
  <div>
    <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
      <div class="bg-primary-gradient h-1"></div>
      <div class="flex flex-wrap pt-8 pb-10 px-16">
        <div
          :class="isCis ? 'w-1/4' : 'w-1/3'"
          class="text-center"
          @click="showWebOfficeMenuModal(true)"
        >
          <div class="text-primary text-base mb-8">
            <i class="far fa-bars"></i>
          </div>
          <div class="flex text-primary text-xs leading-12 justify-center">
            <div class="flex w-1/2">
              {{ $t('weboffice.WebofficeMenu') }}
            </div>
          </div>
        </div>
        <div
          :class="isCis ? 'w-1/4' : 'w-1/3'"
          class="text-center"
          @click="showWebOfficeFeesModal(true)"
        >
          <div class="text-primary text-base mb-8">
            <i class="far fa-clock"></i>
          </div>
          <div class="flex text-primary text-xs leading-12 justify-center">
            <div class="flex w-1/2">
              {{ $t('weboffice.ProductExpirations') }}
            </div>
          </div>
        </div>
        <div
          v-show="isCis"
          :class="isCis ? 'w-1/4' : 'w-1/3'"
          class="text-center"
          @click="showWebOfficeCreditBalanceModal(true)"
        >
          <div class="text-primary text-base mb-8">
            <i class="fal fa-copyright"></i>
          </div>
          <div class="flex text-primary text-xs leading-12 justify-center">
            <div class="flex w-1/2">
              {{ $t('weboffice.CreditBalance') }}
            </div>
          </div>
        </div>
        <div
          :class="isCis ? 'w-1/4' : 'w-1/3'"
          class="text-center"
          @click="showWebOfficeTravelBalanceModal(true)"
        >
          <div class="text-primary text-base mb-8">
            <i class="far fa-wallet"></i>
          </div>
          <div class="flex text-primary text-xs leading-12 justify-center">
            <div class="flex w-1/2">
              {{ $t('weboffice.TravelCard') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <DefaultModal v-show="webOfficeMenuModalActive" :is-full-page="true">
      <div slot="header">
        <div class="flex w-full text-black py-20 px-16">
          <div class="flex items-center">
            <i
              class="fa fa-chevron-left text-primary cursor-pointer mr-16"
              @click="showWebOfficeMenuModal(false)"
            ></i>
          </div>
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('weboffice.WebofficeMenu') }}
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full"></div>
      </div>
      <div slot="body">
        <div class="flex flex-wrap mt-64">
          <WebofficeMenu class="w-full" />
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <DefaultModal v-show="webOfficeFeesModalActive" :is-full-page="true">
      <div slot="header">
        <div class="flex w-full text-black py-20 px-16">
          <div class="flex items-center">
            <i
              class="fa fa-chevron-left text-primary cursor-pointer mr-16"
              @click="showWebOfficeFeesModal(false)"
            ></i>
          </div>
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('weboffice.ProductExpirations') }}
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full"></div>
      </div>
      <div slot="body">
        <div class="flex flex-wrap mt-64">
          <WebofficeFeesBox class="w-full mt-10" />
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <DefaultModal
      v-show="webOfficeTravelBalanceModalActive"
      :is-full-page="true"
    >
      <div slot="header">
        <div class="flex w-full text-black py-20 px-16">
          <div class="flex items-center">
            <i
              class="fa fa-chevron-left text-primary cursor-pointer mr-16"
              @click="showWebOfficeTravelBalanceModal(false)"
            ></i>
          </div>
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('weboffice.TravelCard') }}
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full"></div>
      </div>
      <div slot="body">
        <div class="flex flex-wrap mt-64">
          <WebofficeTravelBalance
            :show-details-link="false"
            class="w-full mt-10"
          />
          <div
            class="text-sm leading-14 mt-8 px-16 cursor-pointer link"
            @click="goToTravelBalanceDetails"
          >
            {{ $t('general.Details') }}
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <DefaultModal
      v-show="webOfficeCreditBalanceModalActive"
      :is-full-page="true"
    >
      <div slot="header">
        <div class="flex w-full text-black py-20 px-16">
          <div class="flex items-center">
            <i
              class="fa fa-chevron-left text-primary cursor-pointer mr-16"
              @click="showWebOfficeCreditBalanceModal(false)"
            ></i>
          </div>
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('weboffice.CreditBalance') }}
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full"></div>
      </div>
      <div slot="body">
        <div class="flex flex-wrap mt-64">
          <WebofficeCreditBalance
            :show-details-link="false"
            class="w-full mt-10"
          />
          <div
            class="text-sm leading-14 mt-8 px-16 cursor-pointer link"
            @click="goToCreditBalanceDetails"
          >
            {{ $t('general.Details') }}
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DefaultModal from '@/components/modal/DefaultModal'
import WebofficeMenu from '@/components/weboffice/WebofficeMenu'
import WebofficeFeesBox from '@/components/weboffice/WebofficeFeesBox'
import WebofficeTravelBalance from '@/components/weboffice/WebofficeTravelBalance'
import WebofficeCreditBalance from '~/components/weboffice/WebofficeCreditBalance'
export default {
  name: 'WebofficeFooterMenu',
  components: {
    WebofficeCreditBalance,
    WebofficeTravelBalance,
    WebofficeFeesBox,
    WebofficeMenu,
    DefaultModal
  },
  data() {
    return {
      webOfficeMenuModalActive: false,
      webOfficeFeesModalActive: false,
      webOfficeTravelBalanceModalActive: false,
      webOfficeCreditBalanceModalActive: false
    }
  },
  computed: {
    ...mapGetters('user', ['isCis'])
  },
  watch: {
    $route() {
      this.webOfficeMenuModalActive = false
    }
  },
  methods: {
    showWebOfficeMenuModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.webOfficeMenuModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.webOfficeMenuModalActive = false
      }
    },
    showWebOfficeFeesModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.webOfficeFeesModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.webOfficeFeesModalActive = false
      }
    },
    showWebOfficeTravelBalanceModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.webOfficeTravelBalanceModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.webOfficeTravelBalanceModalActive = false
      }
    },
    showWebOfficeCreditBalanceModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.webOfficeCreditBalanceModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.webOfficeCreditBalanceModalActive = false
      }
    },
    goToTravelBalanceDetails() {
      this.showWebOfficeTravelBalanceModal(false)
      this.$router.push(this.localePath('/weboffice/travel-card'))
    },
    goToCreditBalanceDetails() {
      this.showWebOfficeTravelBalanceModal(false)
      this.$router.push(this.localePath('/weboffice/credit'))
    }
  }
}
</script>
