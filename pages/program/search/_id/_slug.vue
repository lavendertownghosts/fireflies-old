<template>
  <div>
    <!-- Header -->
    <div class="bg-primary-gradient">
      <div
        class="flex flex-row items-center px-16 py-24 lg:py-16 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
      >
        <div class="hidden md:block md:flex-initial md:mr-16">
          <img
            src="~assets/images/white-turq/travel-services/program/program-60.svg"
            class="w-60 h-60"
          />
        </div>

        <div class="flex-grow leading-32 md:leading-24">
          <div class="flex flex-wrap">
            <div class="flex-initial mr-4">{{ program.name }}</div>
          </div>
        </div>

        <div
          class="hidden lg:flex flex-row flex-initial bg-white-lighter-opaque text-white text-sm rounded"
        >
          <div class="flex-grow p-16 leading-14 font-normal w-320">
            <div>
              <span class="font-bold">
                {{ program.request.fromDate }} - {{ program.request.toDate }}
              </span>
            </div>
            <div class="mt-4">{{ program.guests }}</div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="program.extra !== undefined"
      class="flex flex-col sm:flex sm:flex-row sm:flex-wrap px-16 xl:px-40 max-w-screen-xl mx-auto mt-24 mb-12"
    >
      <div
        v-for="(item, index) in program.extra"
        :key="index"
        :class="index !== program.extra.length - 1 ? 'sm:mr-24' : ''"
        :title="item.title"
        class="text-black text-sm leading-14 mb-12 sm:w-auto cursor-pointer"
      >
        <i :class="item.class" class="mr-4 w-18"></i>{{ item.name }}
      </div>
    </div>
    <div class="flex flex-wrap lg:px-16 xl:px-40 max-w-screen-xl mx-auto">
      <!-- Program details -->
      <div class="w-full lg:w-1/2 lg:pr-8">
        <GalleryBox
          :images="program.images"
          class="flex md:px-16 pt-16 lg:px-0 w-full"
        />
        <div id="google_translate_element" class="lg:ml-0 mt-15 ml-15"></div>
        <span>
          <script type="text/javascript">
            //<![CDATA[
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                {
                  pageLanguage: 'en',
                  autoDisplay: false,
                  layout:
                    google.translate.TranslateElement.InlineLayout.HORIZONTAL
                },
                'google_translate_element'
              )
            }
            //]]>
          </script>
          <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        </span>
        <div
          v-if="program.important_info && program.important_info.length > 0"
          class="mt-20 bg-primary-opaque p-10 border border-primary rounded-sm"
        >
          <div
            class="flex flex-row w-full text-black font-bold items-center leading-16 translate"
          >
            <span>
              {{ $t('program.ImportantInfo') }}
            </span>
          </div>
          <div
            class="text-sm leading-20 text-black mt-8"
            v-html="program.important_info"
          ></div>
        </div>
        <div class="flex flex-col max-w-screen-xl mx-16 lg:px-0">
          <div
            class="flex flex-row w-full text-black font-bold items-center leading-16 mt-20"
          >
            <span>
              {{ $t('program.Overview') }}
            </span>
          </div>
          <div
            class="text-sm leading-20 text-black mt-8"
            v-html="program.overview"
          ></div>
          <div
            v-if="program.featureGroups && program.featureGroups.length > 0"
            class="flex flex-row w-full text-black font-bold items-center leading-16 mt-20"
          >
            <span class="mb-8">
              {{ $t('program.featureGroup') }}
            </span>
          </div>
          <div
            v-for="(feature, index) in program.featureGroups"
            :key="index"
            class="mt-2"
          >
            <div class="text-sm leading-20 text-black">
              {{ feature.type }}
            </div>
            <div
              v-if="feature.included && feature.included.length > 0"
              class="text-sm leading-20 text-black pl-8"
            >
              {{ $t('program.featureGroupIncluded') }} : {{ feature.included }}
            </div>
            <div
              v-if="feature.excluded && feature.excluded.length > 0"
              class="text-sm leading-20 text-black pl-8"
            >
              {{ $t('program.featureGroupExcluded') }} : {{ feature.excluded }}
            </div>
          </div>
          <div
            v-if="program.services && program.services.length > 0"
            class="flex flex-row w-full text-black font-bold items-center leading-16 mt-20"
          >
            <span>
              {{ $t('program.programServices') }}
            </span>
          </div>
          <div
            class="text-sm leading-20 text-black mt-8"
            v-html="program.services"
          ></div>
          <div
            class="mt-20 flex flex-row w-full text-black font-bold items-center leading-16"
          >
            <span>
              {{ $t('program.DepartureReturn') }}
            </span>
          </div>
          <div class="text-sm leading-20 text-black mt-1 md:mb-56">
            <div class="mt-5">{{ $t('program.MeetingPointsTitle') }}:</div>
            <div class="ml-8">
              <div
                v-for="(start_point, index) in program.start_points"
                :key="index"
                class="pb-5"
              >
                <div v-show="start_point.meetingPoint !== undefined">
                  <div v-html="formatStartPointText(start_point, index)"></div>
                  <div v-if="start_point.meetingPoint.description">
                    <b>Description:</b>
                    {{ start_point.meetingPoint.description }}
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5">{{ $t('program.EndPointsTitle') }}:</div>
            <div class="ml-8">
              <div
                v-for="(end_point, index) in program.end_points"
                :key="index"
              >
                <div v-html="formatEndPointText(end_point)"></div>
                <div v-if="end_point.description">
                  <b>Description:</b>
                  <div v-html="end_point.description"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobil kereső sáv -->
          <div class="w-full md:px-16 lg:hidden">
            <div
              id="search-module"
              class="flex flex-wrap bg-primary-gradient px-16 text-white text-sm mt-40 md:rounded md:mb-16"
            >
              <div class="flex-grow py-16">
                <div class="font-bold leading-14">
                  {{ program.request.fromDate }} - {{ program.request.toDate }}
                </div>
                <div class="mt-4 leading-14">{{ program.guests }}</div>
              </div>
              <div class="flex items-center py-12">
                <div
                  class="pb-9 bg-danger px-13 pt-10 rounded cursor-pointer"
                  @click="showProgramSearchFormModal(true)"
                >
                  <i class="fas fa-search text-sm text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Offers -->
      <div class="w-full lg:w-1/2 lg:pl-8">
        <SkeletonOffersWrapper v-show="searchInProgress" :request="request" />
        <div
          v-show="!searchInProgress"
          class="flex flex-wrap px-16 lg:px-0 mx-auto mt-16"
        >
          <div
            v-for="(offers, datekey) in program.offers"
            :key="datekey"
            class="w-full"
          >
            <div class="text-lg leading-24 text-black mt-16">
              {{ datekey }}
            </div>
            <div class="h-1 w-full bg-grey-light mt-16"></div>
            <ProgramOfferBox
              v-for="(offer, index) in offers"
              :key="index"
              :is-best-price="index === 0"
              :currency="currency"
              :price="Number(offer.price[currency])"
              :date-from="offer.date_from"
              :date-to="offer.date_to"
              :session="offer.session.name"
              :language="offerLanguage(offer)"
              :name="offer.name"
              :cancellation-deadline="cancellation(offer)"
              :class="'w-full py-16'"
              @click="offerSelect(offer)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Best offer fixed bottom -->
    <div
      class="fixed bottom-0 w-full flex flex-wrap px-16 text-white text-sm mt-40 lg:hidden z-10"
      :class="
        !searchInProgress && program.offers.length > 0
          ? 'bg-primary-gradient'
          : 'bg-danger-light'
      "
    >
      <div
        v-show="!searchInProgress && getBestPrice !== false"
        class="flex-grow py-16"
      >
        <div class="text-xs leading-12 text-white opacity-50">
          {{ $t('program.BestOffer') }}:
        </div>
        <div class="mt-4 leading-16 font-bold">
          {{ currency }}
          {{ getBestPrice | formatNumber('0,0', { thousandsSeparator: ' ' }) }}
        </div>
      </div>
      <div
        v-show="!searchInProgress && program.offers.length > 0"
        class="flex items-center py-12"
      >
        <div
          v-scroll-to="{ el: '#search-module' }"
          class="pb-9 bg-danger px-13 pt-10 rounded text-sm font-bold cursor-pointer"
        >
          {{ $t('program.Offers') }}
        </div>
      </div>
      <div
        v-show="!searchInProgress && program.offers.length === 0"
        class="py-13 md:flex md:flex-wrap md:items-center"
      >
        <div
          class="md:flex-1 text-white text-center font-bold text-sm leading-14 md:text-left"
        >
          {{ $t('general.NoResults') }}
        </div>
        <div class="mt-12 md:flex-initial md:mt-0">
          <ButtonSmall
            type="danger"
            class="w-full"
            @click="showProgramSearchFormModal(true)"
          >
            {{ $t('general.Search') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
    <!-- SearchModal -->
    <DefaultModal
      v-show="programSearchModalActive"
      :is-full-page="innerWidth < 772"
      @close="closeOutClick"
    >
      <div slot="header">
        <div
          class="flex w-full text-black py-20 px-16 md:px-0 md:py-0 md:pb-16"
        >
          <div class="flex flex-grow text-lg font-bold leading-24">
            {{ $t('program.ChangeSearch') }}
          </div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="showProgramSearchFormModal(false)"
            ></i>
          </div>
        </div>
        <div class="bg-primary-gradient h-1 w-full md:hidden"></div>
      </div>
      <div slot="body">
        <div class="w-full mt-64 md:mt-0">
          <div class="p-16 md:p-0 mx-auto">
            <div class="flex flex-col md:flex-row">
              <div class="flex flex-col sm:flex-row md:w-3/4 md:pr-8 lg:pr-0">
                <InputDateRange
                  v-model="dates"
                  :label-checkin="$t('program.DateFrom')"
                  :label-checkout="$t('program.DateTo')"
                  class="flex flex-row mt-8 w-full sm:w-1/2"
                  :input-style="['']"
                  :input-style-checkin="['lg:rounded-l lg:rounded-r-none']"
                  :input-style-checkout="[
                    'lg:rounded-none lg:border-l-0 lg:border-r-0'
                  ]"
                />
                <div class="mt-8 w-full sm:pl-8 sm:w-1/2 lg:pl-0">
                  <InputGuests
                    v-model="guests"
                    class="w-full"
                    :label="$t('program.Guests')"
                    :input-style="['lg:rounded-none']"
                  />
                </div>
              </div>
              <div class="mt-16 md:mt-24 md:w-1/4 md:pl-8 lg:pl-0">
                <div class="flex flex-row items-end justify-end sm:mt-1">
                  <ButtonMedium
                    class="uppercase w-full"
                    type="danger"
                    :input-style="['lg:rounded-l-none']"
                    :is-loading="searchInProgress"
                    @click="!searchInProgress ? startSearch() : ''"
                  >
                    {{ $t('general.Search') }}
                  </ButtonMedium>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
    <PermissionModal
      :show="permissionPortalFree"
      :permission-needed="'not_free'"
      @cancel="permissionPortalFree = false"
      @accept="$router.push(localePath('/weboffice/membership-upgrade'))"
    />
    <CartBlockModal :covid-cart-block="cartBlock" @accept="cartBlock = false" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { getGuestText } from '@/includes/utils'
import GalleryBox from '@/components/GalleryBox'
import SkeletonOffersWrapper from '@/components/skeleton/program/SkeletonOffersWrapper'

import ProgramOfferBox from '@/components/program/ProgramOfferBox'
import ButtonSmall from '@/components/micro/ButtonSmall'
import InputDateRange from '@/components/micro/InputDateRange'
import InputGuests from '@/components/micro/InputGuests'
import ButtonMedium from '@/components/micro/ButtonMedium'
import DefaultModal from '@/components/modal/DefaultModal'
import PermissionModal from '@/components/PermissionModal'
import CartBlockModal from '@/components/modal/CartBlockModal'

export default {
  name: 'ProgramDetails',
  components: {
    SkeletonOffersWrapper,
    DefaultModal,
    PermissionModal,
    ButtonSmall,
    ProgramOfferBox,
    GalleryBox,
    InputDateRange,
    InputGuests,
    ButtonMedium,
    CartBlockModal
  },
  async asyncData({ app, store, route, redirect }) {
    let program
    try {
      program = await store.dispatch('program/getProgramDetails', {
        activity_id: route.params.slug,
        lang: app.i18n.locale,
        search_id: route.params.id
      })
    } catch (e) {
      redirect(app.localePath('/program/search/' + route.params.id))
    }
    if (program) {
      program.guests = getGuestText(
        program.request.paxDatas.adultCount,
        program.request.paxDatas.childCount
      )
      return {
        program,
        dates: {
          date1: program.request.fromDate,
          date2: program.request.toDate
        },
        guests: {
          adults: parseInt(program.request.paxDatas.adultCount),
          children: parseInt(program.request.paxDatas.childCount),
          childrenAges: program.request.paxDatas.childrenAges
        },
        request: program.request
      }
    }
  },
  data() {
    return {
      getLimitOffer: 10,
      activeOfferDetailsDetails: false,
      hover: false,
      showAllOffers: false,
      cartAddInProgress: false,
      programSearchModalActive: false,
      permissionPortalFree: false,
      searchInProgress: false,
      innerWidth: 0,
      cartBlock: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('user', ['getFees']),
    currency() {
      return this.getCurrency
    },
    isPortalFree() {
      if (this.getFees.portal !== undefined) {
        const today = new Date()
        let check = this.getFees.portal.expirationDate
        if (typeof check.split !== 'undefined') {
          const arr = check.split(/[- :]/)
          check = new Date(
            arr[0],
            arr[1] - 1,
            arr[2],
            arr[3] !== undefined ? arr[3] : 0,
            arr[4] !== undefined ? arr[4] : 0,
            arr[5] !== undefined ? arr[5] : 0
          )
        } else {
          check = new Date(check)
        }

        if (check < today) {
          return true
        }
      }
      return false
    },
    getBestPrice() {
      if (this.program.offers !== undefined && this.program.offers.length > 0) {
        return Math.ceil(this.program.offers[0].price[this.currency])
      }
      return false
    }
  },
  mounted() {
    this.calculateSize()
    window.addEventListener('resize', this.calculateSize)
    this.$nextTick(() => {
      if (this.$route.hash !== '') {
        this.$scrollTo(this.$route.hash)
      }
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateSize)
  },
  methods: {
    ...mapActions('program', ['initProgramSearch', 'addToCart']),
    ...mapGetters('user', ['isLoggedIn']),
    closeOutClick() {
      if (this.innerWidth > 771) {
        this.programSearchModalActive = false
      }
    },
    cancellation(offer) {
      if (offer.freeCancellationDate === false) {
        if (offer.freeCancellation === true) {
          return this.$t('hotel.CancelInCart')
        } else {
          return this.$t('hotel.NonRefundable')
        }
      } else {
        return offer.freeCancellationDate
      }
    },
    offerLanguage(offer) {
      if (offer.languages !== undefined && offer.languages.length > 0) {
        if (offer.languages[0].description !== undefined) {
          return offer.languages[0].description
        }
      }
      return ''
    },
    // async startSearch() {
    // this.showProgramSearchFormModal(false)
    // this.searchInProgress = true
    // this.request = {
    //   destination: this.program.request.destination,
    //   destination_name: this.program.request.destination_name,
    //   from: this.dates.date1,
    //   to: this.dates.date2,
    //   adults: this.guests.adults,
    //   children: this.guests.children,
    //   childrenages: this.guests.childrenages,
    //   fts_name: this.program.name
    // }
    // const result = await this.initProgramSearch({
    //   destination: this.request.destination,
    //   destination_name: this.request.destination_name,
    //   text_id: Number(this.request.fts_id),
    //   fromDate: this.dates.date1,
    //   toDate: this.dates.date2,
    //   paxDatas: {
    //     adultCount: this.guests.adults,
    //     childCount: this.guests.children,
    //     childrenAges: this.guests.childrenAges
    //   },
    //   client_nationality: 'HU',
    //   program_ids: this.program.id,
    //   lang: this.$i18n.locale
    // })
    // this.$router.push(
    //   this.localePath(
    //     '/program/search/' + result.search_id + '/' + this.$route.params.slug
    //   )
    // )
    // },
    async offerSelect(offer) {
      // this.cartBlock = true
      if (this.cartAddInProgress) {
        return
      }

      if (!this.isLoggedIn()) {
        this.$eventBus.publish('showLoginModal')
      } else if (this.isPortalFree) {
        this.permissionPortalFree = true
      } else {
        this.cartAddInProgress = true
        let resDetails
        try {
          resDetails = await this.addToCart({
            search_id: this.$route.params.id,
            activity_id: this.program.activity_id,
            rate_key: offer.rate_key,
            fromDate: offer.date_from,
            toDate: offer.date_to,
            lang: this.$i18n.locale
          })
        } catch (error) {
          if (error.response !== undefined) {
            const serverMessage = await error.response.json()
            this.$store.dispatch('general/showSnackbar', {
              message: serverMessage.messages || 'Unknown error'
            })
          }
        }
        if (resDetails) {
          this.cartAddInProgress = false
          if (resDetails.status === 'PERMISSION') {
            this.permissionNeeded = resDetails.permission_needed
            this.permissionModalActive = true
          } else {
            this.$store.commit('program/setCartCache', resDetails)
            await this.$router.push(this.localePath('/program/cart'))
          }
        }
      }
    },
    showProgramSearchFormModal(status) {
      if (status) {
        if (this.innerWidth < 772) {
          document.body.classList.add('fixed')
        }
        this.programSearchModalActive = true
      } else {
        if (this.innerWidth < 772) {
          document.body.classList.remove('fixed')
        }
        this.programSearchModalActive = false
      }
    },
    showOfferBoxDetails(index) {
      if (this.activeOfferDetailsDetails === index) {
        this.activeOfferDetailsDetails = false
      } else {
        this.activeOfferDetailsDetails = index
      }
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    formatStartPointText(startPoint, index) {
      let text = ''

      if (index !== undefined) {
        text += index + 1 + '. '
      }

      if (
        startPoint.meetingPoint.country !== undefined &&
        startPoint.meetingPoint.country.length > 0
      ) {
        text += startPoint.meetingPoint.country
      }

      if (
        startPoint.meetingPoint.zip !== undefined &&
        startPoint.meetingPoint.zip.length > 0
      ) {
        if (text.length > 0) {
          text += ', '
        }
        text += startPoint.meetingPoint.zip
      }

      if (
        startPoint.meetingPoint.city !== undefined &&
        startPoint.meetingPoint.city.length > 0
      ) {
        if (text.length > 0) {
          text += ', '
        }
        text += startPoint.meetingPoint.city
      }

      if (
        startPoint.meetingPoint.address !== undefined &&
        startPoint.meetingPoint.address.length > 0
      ) {
        if (text.length > 0) {
          text += ', '
        }
        text += startPoint.meetingPoint.address
      }
      if (
        startPoint.pickupInstructions !== undefined &&
        startPoint.pickupInstructions.length > 0
      ) {
        if (text.length > 0) {
          text += ' ( '
        }

        text += startPoint.pickupInstructions

        if (text.length > 0) {
          text += ' )'
        }
      }

      return text
    },
    formatEndPointText(endPoint) {
      let text = ''
      if (endPoint.type !== undefined && endPoint.type.length > 0) {
        text += endPoint.type
      }
      return text
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'notranslate'
      },
      title:
        this.program !== undefined
          ? this.program.name + this.$t('meta.TitleSuffix')
          : this.$t('meta.ProgramTitle') + this.$t('meta.TitleSuffix'),
      meta: [
        {
          property: 'og:title',
          content:
            this.program !== undefined
              ? this.program.name + this.$t('meta.TitleSuffix')
              : this.$t('meta.ProgramTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'twitter:title',
          content:
            this.program !== undefined
              ? this.program.name + this.$t('meta.TitleSuffix')
              : this.$t('meta.ProgramTitle') + this.$t('meta.TitleSuffix')
        },
        {
          property: 'og:description',
          content: this.$t('meta.ProgramDescription')
        },
        {
          hid: 'description',
          name: 'description',
          content: this.$t('meta.ProgramDescription')
        },
        {
          property: 'twitter:description',
          content: this.$t('meta.ProgramDescription')
        }
      ]
    }
  }
}
</script>
