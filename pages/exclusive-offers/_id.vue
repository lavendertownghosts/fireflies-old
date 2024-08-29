<template>
  <div>
    <SkeletonSearchWrapper v-show="isLoading" />
    <div v-if="!isLoading">
      <div class="bg-primary-gradient">
        <div
          class="flex flex-row items-center justify-between px-16 py-24 lg:py-18 text-white font-bold text-lg leading-30 md:leading-24 xl:px-40 max-w-screen-xl mx-auto"
        >
          <div class="hidden md:block md:flex-initial md:mr-16">
            <img
              src="~assets/images/white-turq/travel-services/hotel/hotel-60.svg"
              class="w-60 h-60"
            />
          </div>

          <div class="flex-grow leading-32 md:leading-24">
            <div class="flex flex-wrap">
              <div class="mr-4">
                {{ offer.hotelname }}
                <StarRatings
                  class="inline-block"
                  :stars="parseInt(offer.hotelstar)"
                />
              </div>
            </div>
            <div class="hidden md:block md:mt-2 text-sm leading-14">
              {{ offer.hoteladdress }}
            </div>
          </div>
        </div>
      </div>
      <div class="p-16 xl:px-40 max-w-screen-xl mx-auto text-black">
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
          class="flex flex-row mt-4 cursor-pointer"
          @click="$router.push(localePath('/exclusive-offers'))"
        >
          <i class="fa fa-chevron-left text-primary text-sm leading-14"></i>
          <p class="ml-8 text-sm leading-14 link font-bold mb-6">
            {{ $t('general.Back') }}
          </p>
        </div>
        <div class="flex flex-col md:flex-row items-stretch">
          <div class="w-auto md:mr-8 mb-40">
            <div class="py-16 flex flex-wrap">
              <div
                class="w-full hidden lg:block mb-16 md:mb-0  md:pr-8 md:w-1/2"
              >
                <GalleryBox :images="images" />
              </div>
              <div class="w-full md:pl-8 md:w-1/2 translate">
                <div class="font-bold cursor-pointer leading-14">
                  {{ $t('hotel.AboutTheHotel') }}
                </div>
                <div class="mt-8">
                  <span>
                    {{ offer.hoteldesc }}
                  </span>
                </div>
              </div>
            </div>
            <div class="py-16 pt-0 flex flex-wrap">
              <div class="font-bold cursor-pointer w-full leading-14">
                {{ $t('exclusive_offers.OtherInfo') }}
              </div>
              <div class="mt-8 mb-16">
                {{ offer.customredeemdesc }}
              </div>
            </div>
          </div>
          <!-- Summary -->
          <div class="md:flex-shrink-0 md:ml-8 mb-12 order-first lg:order-none">
            <div
              class="w-full lg:hidden mt-16 mb-16 md:mb-0 md:mt-0 md:pr-8 md:w-1/2"
            >
              <GalleryBox :images="images" />
            </div>
            <div class="p-16 rounded border border-grey-light h-auto">
              <div class="flex flex-row w-full">
                <div class="w-20 mr-8 text-center">
                  <i class="far fa-calendar-alt"></i>
                </div>
                <div class="sm:w-3/4 md:w-auto">
                  {{ offer.checkin | formatDateDisplay }} -
                  {{ offer.checkout | formatDateDisplay }}<br />
                  {{ offer.nightsnum }} {{ $t('general.Nights') }}
                </div>
              </div>
              <!-- <div class="bg-grey-light h-1 my-12"></div>
            <div class="flex flex-row w-full">
              <div class="w-20 mr-8 text-center">
                <i class="far fa-map-marker-alt"></i>
              </div>
              <div class="sm:w-3/4 md:w-auto">
                In the city center
              </div>
            </div> -->
              <div class="bg-grey-light h-1 my-12"></div>
              <div class="flex flex-row w-full">
                <div class="w-20 mr-8 text-center">
                  <i class="far fa-user-friends"></i>
                </div>
                <div class="sm:w-3/4 md:w-auto">
                  {{ getGuestText(offer.adultcount, offer.childrencount) }}
                </div>
              </div>
              <div class="bg-grey-light h-1 my-12"></div>
              <div class="flex flex-row w-full">
                <div class="w-20 mr-8 text-center">
                  <i class="far fa-bed"></i>
                </div>
                <div class="sm:w-3/4 md:w-auto">
                  {{ getBoardName(offer.services) }}
                </div>
              </div>
              <div class="bg-grey-light h-1 my-12"></div>
              <div class="flex flex-row w-full">
                <div class="w-20 mr-8 text-center">
                  <i class="far fa-umbrella-beach"></i>
                </div>
                <div class="sm:w-3/4 md:w-auto">
                  {{ offer.roomtypedesc }}
                </div>
              </div>
              <div class="bg-grey-light h-1 my-12"></div>
              <div class="flex flex-row w-full">
                <div class="w-20 mr-8 text-center">
                  <i class="far fa-suitcase"></i>
                </div>
                <div class="sm:w-3/4 md:w-auto">
                  <span v-if="offer.request.business == '0'">{{
                    $t('exclusive_offers.NotBusiness')
                  }}</span>
                  <span v-else>{{ $t('exclusive_offers.Business') }}</span>
                </div>
              </div>
              <div class="bg-grey-light h-1 my-12"></div>
              <div
                class="flex flex-row w-full"
                :class="offer.cancellable ? 'text-primary' : 'text-danger'"
              >
                <div class="w-20 mr-8 text-center">
                  <i v-if="offer.cancellable" class="far fa-check"></i>
                  <i v-if="!offer.cancellable" class="far fa-times"></i>
                </div>
                <div class="sm:w-3/4 md:w-auto">
                  {{ $t('weboffice.Cancelable') }}:
                  {{ offer.cancelable | formatDateDisplay }}
                </div>
              </div>
              <div class="bg-grey-light h-1 my-12"></div>
              <div class="flex flex-col">
                <p class="text-xs">
                  {{ $t('exclusive_offers.OriginalPrice') }}:
                  {{ currency }}
                  {{
                    offer.originalPrice[currency]
                      | formatNumber('0,0', { thousandsSeparator: ' ' })
                  }}
                  <i class="far fa-info-circle text-primary"></i>
                </p>
                <p class="text-base leading-16 font-bold text-warning">
                  <span class="pr-6 lg:pr-0 xl:pr-6">{{ offer.BPO }}</span>
                  <span class="ff-currency bpo bg-warning"></span
                  ><span class="pr-6 lg:pr-0 xl:pr-6">BPO</span
                  ><span
                    v-show="offer.price[currency] > 0"
                    class="pr-6 lg:pr-0 xl:pr-6"
                    >+</span
                  >
                  <span v-show="offer.price[currency] > 0">
                    {{ currency }}
                    {{
                      offer.price[currency]
                        | formatNumber('0,0', { thousandsSeparator: ' ' })
                    }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import GalleryBox from '@/components/GalleryBox'
import StarRatings from '@/components/micro/StarRatings'
import SkeletonSearchWrapper from '@/components/skeleton/program/SkeletonSearchWrapper'
import { getGuestText, getBoardName, formatDateDisplay } from '@/includes/utils'
export default {
  name: 'ExclusiveOffer',
  components: {
    StarRatings,
    SkeletonSearchWrapper,
    GalleryBox
  },
  data() {
    return {
      getBoardName,
      formatDateDisplay,
      getGuestText,
      isLoading: true,
      images: [],
      showMore: false,
      offer: {
        cancellable: false
      }
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    }
  },
  mounted() {
    this.getExclusiveOffer()
  },
  methods: {
    async getExclusiveOffer() {
      let res
      this.isLoading = true
      try {
        res = await this.$store.dispatch('exclusive-offers/getExcluiveOffer', {
          offerId: this.$route.params.id
        })
      } catch (e) {
        console.log(e)
      }

      if (res !== undefined) {
        this.offer = res
        Object.values(this.offer.pictures).forEach((value) => {
          this.images.push(value.picurl)
        })
      }

      this.isLoading = false
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: 'notranslate'
      }
    }
  }
}
</script>
