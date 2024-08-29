<template>
  <main class="flex-grow">
    <SkeletonSearchWrapper v-show="isLoading" :request="requestExample" />
    <div v-show="!isLoading">
      <div class="hidden md:block w-full bg-primary-gradient text-white">
        <TransferSearchForm
          :from-search-init="'Budapest (BUD)'"
          :to-search-init="'Four Seasons Hotel Gresham Palace Budapest'"
          @search="getResults"
        />
      </div>
      <div class="bg-primary-gradient h-1 w-full md:hidden"></div>
      <div class="flex flex-col p-16 xl:px-40 max-w-screen-xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between mt-8 mb-24">
          <div class="flex flex-row justify-start items-center">
            <i
              class="fa fa-chevron-left text-primary text-sm leading-14 cursor-pointer"
              @click="$router.back()"
            ></i>
            <div class="ml-8">
              <p class="text-sm leading-14 font-bold text-black mb-6">
                150 {{ $t('general.Offers') }}
              </p>
              <p class="text-xs leading-12">
                Teljes ár Retúr útra, tartalmazza az ÁFÁ-t és a Bankkártya
                kezelési költséget.
              </p>
            </div>
          </div>
          <div class="mt-16 md:mt-0">
            <ButtonGroup
              :width="innerWidth < 772 ? false : 288"
              :buttons="[
                {
                  text: 'Ár',
                  action: () => {
                    requestOrder('price')
                  },
                  active: orderType === 'price'
                },
                {
                  text: 'Menetidő',
                  action: () => {
                    requestOrder('travelTime')
                  },
                  active: orderType === 'travelTime'
                }
              ]"
            />
          </div>
        </div>
        <div class="flex flex-col lg:flex-row">
          <div class="flex flex-col w-full lg:w-1/2 lg:mr-8">
            <VerticalTimeline
              :stops="0"
              :timeline="timelineDepartment"
              :details-column-width="'w-full'"
              class="ml-4 mt-10 mb-13 sm:hidden"
            />
            <div class="flex flex-row hidden sm:flex">
              <div class="flex flex-col w-3/7 md:w-2/7 lg:w-3/7 xl:w-4/12">
                <div class="text-black text-sm leading-20">
                  {{ timelineDepartment[0]['title'] }}
                </div>
                <div class="text-xs leading-16 mt-4">
                  {{ timelineDepartment[0]['description'] }}
                </div>
              </div>
              <div
                class="w-1/7 ml-8 mr-18 flex items-center md:w-4/7 lg:w-1/7 xl:w-4/12"
              >
                <HorizontalTimeline :stops="0" class="ml-4 sm:mt-0 sm:mb-0" />
              </div>
              <div class="flex flex-col w-3/7 md:w-2/7 lg:w-3/7 xl:w-4/12">
                <div class="text-black text-sm leading-20">
                  {{ timelineDepartment[1]['title'] }}
                </div>
              </div>
            </div>
            <div class="bg-grey-light h-1 w-full my-8"></div>
            <VerticalTimeline
              :stops="0"
              :timeline="timelineReturn"
              :details-column-width="'w-full'"
              class="ml-4 mt-16 mb-24 sm:hidden"
            />
            <div class="flex flex-row hidden sm:flex">
              <div class="flex flex-col w-3/7 md:w-2/7 lg:w-3/7 xl:w-4/12">
                <div class="text-black text-sm leading-20">
                  {{ timelineReturn[0]['title'] }}
                </div>
              </div>
              <div
                class="w-1/7 ml-8 mr-18 flex items-center md:w-4/7 lg:w-1/7 xl:w-4/12"
              >
                <HorizontalTimeline :stops="0" class="ml-4 sm:mt-0 sm:mb-0" />
              </div>
              <div class="flex flex-col w-3/7 md:w-2/7 lg:w-3/7 xl:w-4/12">
                <div class="text-black text-sm leading-20">
                  {{ timelineReturn[1]['title'] }}
                </div>
                <div class="text-xs leading-16 mt-4">
                  {{ timelineReturn[1]['description'] }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col w-full mt-24 lg:w-1/2 lg:mt-0 lg:ml-8">
            <!-- TransferCards-->
            <div class="flex flex-wrap justify-start">
              <TransferSearchResultCard
                v-for="index in 5"
                :key="index"
                :best-price="index === 1"
                :details-active="
                  activeTransferSearchResultCardDetails === index
                "
                class="w-full mb-24"
                @showDetails="showTransferSearchResultCardDetails(index)"
              />
            </div>
            <!-- Pagination -->
            <div class="w-full px-16 mb-56 flex justify-center">
              <Pagination
                :max-pages="maxPages"
                :current-page="currentPage"
                @click="navPage"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Mobile bottom navbar-->
      <div class="fixed bottom-0 bg-white w-full z-10 md:hidden">
        <div class="bg-primary-gradient h-1"></div>
        <div class="flex flex-wrap pt-8 pb-10 px-16">
          <div
            class="w-full text-center text-primary"
            @click="showTransferSearchFormModal(true)"
          >
            <div class="text-base mb-8">
              <i class="far fa-search"></i>
            </div>
            <div class="text-primary text-sm leading-12 px-32">
              {{ $t('general.StartNewSearch') }}
            </div>
          </div>
        </div>
      </div>
      <!-- New search mobil modal-->
      <DefaultModal v-show="transferSearchFormModalActive" :is-full-page="true">
        <div slot="header">
          <div class="flex w-full text-black py-20 px-16">
            <div class="flex flex-grow text-lg font-bold leading-24">
              {{ $t('general.StartNewSearch') }}
            </div>
            <div class="flex items-center">
              <i
                class="fas fa-times opacity-50 cursor-pointer"
                @click="showTransferSearchFormModal(false)"
              ></i>
            </div>
          </div>
          <div class="bg-primary-gradient h-1 w-full"></div>
        </div>
        <div slot="body">
          <div class="flex flex-wrap mt-64">
            <TransferSearchForm
              :is-dark="false"
              :from-search-init="'Budapest (BUD)'"
              :to-search-init="'Four Seasons Hotel Gresham Palace Budapest'"
              class="mt-8"
              @search="getResults"
            />
          </div>
        </div>
        <div slot="footer"></div>
      </DefaultModal>
    </div>
  </main>
</template>

<script>
import SkeletonSearchWrapper from '@/components/skeleton/transfer/SkeletonSearchWrapper'
import TransferSearchForm from '@/components/forms/TransferSearchForm'
import DefaultModal from '@/components/modal/DefaultModal'
import TransferSearchResultCard from '@/components/transfer/TransferSearchResultCard'

import Pagination from '@/components/Pagination'
import ButtonGroup from '@/components/micro/ButtonGroup'
import VerticalTimeline from '@/components/micro/VerticalTimeline'
import HorizontalTimeline from '@/components/micro/HorizontalTimeline'

export default {
  name: 'TransferSearchPage',
  components: {
    SkeletonSearchWrapper,
    TransferSearchForm,
    DefaultModal,
    ButtonGroup,
    VerticalTimeline,
    HorizontalTimeline,
    Pagination,
    TransferSearchResultCard
  },
  asyncData({ app, redirect }) {
    redirect(app.localePath('index'))
  },
  data() {
    return {
      isLoading: true,
      requestExample: {
        adults: '2',
        checkin: '2020-03-12',
        checkout: '2020-03-14',
        checkinTime: '(10:00)',
        checkoutTime: '(10:00)',
        children: '2',
        from: 'BUD',
        to: 'Four Seasons Hotel Gresham Palace',
        oneWay: false
      },
      transferSearchFormModalActive: false,
      orderType: 'price',
      innerWidth: 0,
      timelineDepartment: [
        {
          title: 'Budapest (BUD)',
          description: 'Járat érkezése: 2019.10.15 - 10:00',
          descriptionRequired: true
        },
        {
          title: 'Four Seasons Hotel Gresham Palace Budapest'
        }
      ],
      timelineReturn: [
        {
          title: 'Four Seasons Hotel Gresham Palace Budapest',
          descriptionRequired: false
        },
        {
          title: 'Budapest (BUD)',
          description: 'Járat távozása: 2019.10.15 - 10:00',
          descriptionRequired: true
        }
      ],
      currentPage: 6,
      maxPages: 12,
      activeTransferSearchResultCardDetails: false
    }
  },
  mounted() {
    this.getResults()
    this.calculateSize()
  },
  methods: {
    getResults(filters = false) {
      if (this.transferSearchFormModalActive) {
        this.showTransferSearchFormModal(false)
      }
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
      }, 5000)
    },
    showTransferSearchFormModal(status) {
      if (status) {
        document.body.classList.add('fixed')
        this.transferSearchFormModalActive = true
      } else {
        document.body.classList.remove('fixed')
        this.transferSearchFormModalActive = false
      }
    },
    requestOrder(type) {
      this.orderType = type
      this.getResults()
    },
    navPage(page) {
      this.currentPage = page
      this.$scrollTo('#__nuxt')
      this.getResults()
    },
    calculateSize() {
      this.innerWidth = window.innerWidth
    },
    showTransferSearchResultCardDetails(index) {
      if (this.activeTransferSearchResultCardDetails === index) {
        this.activeTransferSearchResultCardDetails = false
      } else {
        this.activeTransferSearchResultCardDetails = index
      }
    }
  }
}
</script>
