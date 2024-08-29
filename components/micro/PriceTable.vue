<template>
  <div v-if="tableCells.length > 0" class="relative">
    <div
      class="absolute w-24 top-0 left-0 bg-white-to-black-gradient z-10 h-320 md:hidden"
    ></div>
    <div
      class="absolute w-24 top-0 right-0 bg-black-to-white-gradient z-10 h-320 md:hidden"
    ></div>
    <Scrollbar>
      <div class="pb-20 md:pb-0" style="min-width: 740px">
        <div
          v-for="(row, index) in tableCells"
          :key="index"
          class="flex flex-row"
        >
          <div
            v-for="(column, columnIndex) in row"
            :key="columnIndex"
            :class="[
              column.class,
              column.value === null && index !== 0 && columnIndex !== 0
                ? 'diagonal-line'
                : '',
              getHoverEffect(
                index,
                columnIndex,
                column.isBestPrice,
                column.bestPriceInDay
              )
            ]"
            class="flex w-1/8 h-40 items-center justify-center text-xs border-t border-l border-grey-light cursor-pointer"
            @click="
              showFlightSearchResultCard(
                column.value instanceof Object ? column.value : false,
                column.value instanceof Object,
                column.isBestPrice
              )
            "
            @mouseover="changeHover(index, columnIndex, column.value)"
            @mouseleave="changeHover(index, columnIndex)"
          >
            <div
              :class="column.title ? 'font-bold' : ''"
              class="flex flex-col leading-12 text-xs text-center"
            >
              <div>
                {{ column.title }}
              </div>
              <div>
                {{
                  column.value instanceof Object
                    ? currency +
                      ' ' +
                      $options.filters.formatNumber(
                        Math.ceil(column.value.total_fare[currency]),
                        '0,0',
                        { thousandsSeparator: ' ' }
                      )
                    : column.value
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Scrollbar>
    <DefaultModal
      v-show="flightCardModalActive"
      :default-padding="'p-0 rounded-tl-none'"
      :modal-max-width="flightCardModalMaxWidth + 'px'"
      @close="flightCardModalActive = false"
    >
      <div slot="header" class="relative">
        <div
          v-show="flightCardModalIsBestPrice"
          class="absolute -t-24 px-8 py-6 bg-primary text-white text-sm font-bold rounded-t z-40"
        >
          {{ $t('flight.PeriodBestOffer') }}
        </div>
        <div class="flex w-full text-black p-16">
          <div
            class="flex flex-grow text-lg font-bold leading-24"
            v-html="getFlightCardTitle"
          ></div>
          <div class="flex items-center">
            <i
              class="fas fa-times opacity-50 cursor-pointer"
              @click="showFlightSearchResultCard(false, false, false)"
            ></i>
          </div>
        </div>
      </div>
      <div slot="body">
        <div
          class="flex flex-wrap justify-start overflow-y-auto flight-search-result-modal-max-height"
        >
          <FlightSearchResultCard
            :best-price="false"
            :one-way="false"
            :stops="2"
            :arrives-nex-day="true"
            :show-in-modal="true"
            :flight="selectedFlightData"
            :show-details-button-loading="detailsLoading"
            class="w-full"
            @toCart="toCart(selectedFlightData)"
          />
        </div>
      </div>
      <div slot="footer"></div>
    </DefaultModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FlightSearchResultCard from '@/components/flight/FlightSearchResultCard'
import Scrollbar from '@/components/Scrollbar'
import DefaultModal from '@/components/modal/DefaultModal'
export default {
  name: 'PriceTable',
  components: {
    DefaultModal,
    FlightSearchResultCard,
    Scrollbar
  },
  props: {
    tableCells: {
      type: Array,
      required: true
    },
    detailsLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      flightCardModalActive: false,
      flightCardModalIsBestPrice: false,
      flightCardModalMaxWidth: 896,
      selectedRow: 4,
      selectedColumn: 4,
      selectedFlightData: false
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    ...mapGetters('user', ['isLoggedIn']),
    currency() {
      return this.getCurrency
    },
    getFlightCardTitle() {
      if (
        this.selectedFlightData.departureDate !== undefined &&
        this.selectedFlightData.returnDate !== undefined
      ) {
        return (
          '<div class="flex-row">' +
          this.selectedFlightData.departureDate.substr(5, 5).replace('-', '.') +
          '</div>' +
          '<div class="flex-row mx-4"><i class="far fa-exchange"></i></div>' +
          '<div class="flex-row">' +
          this.selectedFlightData.returnDate.substr(5, 5).replace('-', '.') +
          '</div>'
        )
      }
      return ''
    }
  },
  mounted() {
    this.calculateFlightCardModalMaxWidth()
    window.addEventListener('resize', this.calculateFlightCardModalMaxWidth)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.calculateFlightCardModalMaxWidth)
  },
  methods: {
    showFlightSearchResultCard(flightData, status, isBestPrice) {
      this.selectedFlightData = flightData
      if (status) {
        this.flightCardModalActive = true
      } else {
        this.flightCardModalActive = false
      }
      if (isBestPrice === true) {
        this.flightCardModalIsBestPrice = true
      } else {
        this.flightCardModalIsBestPrice = false
      }
    },
    calculateFlightCardModalMaxWidth() {
      if (window.innerWidth >= 772 && window.innerWidth < 1024) {
        this.flightCardModalMaxWidth = 488
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        this.flightCardModalMaxWidth = 740
      } else {
        this.flightCardModalMaxWidth = 896
      }
    },
    changeHover(row, column, value) {
      if (row > 0 && column > 0) {
        this.selectedRow = row
        this.selectedColumn = column
      } else {
        this.selectedRow = 4
        this.selectedColumn = 4
      }
    },
    getHoverEffect(row, column, isBestPrice, bestPriceInDay) {
      let extraClass = ''
      if (
        !isBestPrice &&
        ((row === this.selectedRow && column <= this.selectedColumn) ||
          (column === this.selectedColumn && row <= this.selectedRow))
      ) {
        extraClass = 'bg-grey-opaque'
      } else if (row === 0 || column === 0) {
        extraClass = 'bg-grey-lighter-opaque'
      }
      if (row === this.selectedRow && column === this.selectedColumn) {
        extraClass += ' hover:underline'
        if (isBestPrice) {
          extraClass += ' hover:bg-primary-dark'
        } else if (bestPriceInDay) {
          extraClass +=
            ' hover:text-white hover:bg-primary-dark hover:bg-opacity-20'
        } else {
          extraClass += ' hover:bg-grey hover:bg-opacity-50'
        }
      }
      if (row === this.selectedRow && column === 0) {
        extraClass += ' border-l-primary'
      }
      if (column === this.selectedColumn && row === 0) {
        extraClass += ' border-t-primary'
      }
      return extraClass
    },
    toCart(selectedFlightData) {
      if (!this.isLoggedIn) {
        this.flightCardModalActive = false
      }
      this.$emit(
        'toCart',
        Object.assign(selectedFlightData, { calendarSearch: true })
      )
    }
  }
}
</script>

<style>
.border-t-primary {
  border-top-color: #00adb5;
}

.border-l-primary {
  border-left-color: #00adb5;
}
.diagonal-line {
  background: linear-gradient(
    to top right,
    #fff calc(50% - 1px),
    rgba(232, 234, 236, 0.5),
    #fff calc(50% + 1px)
  );
}
.bg-grey-opaque.diagonal-line {
  background: linear-gradient(
    to top right,
    rgba(232, 234, 236, 0.5) calc(50% - 1px),
    rgba(232, 234, 236, 0.5),
    rgba(232, 234, 236, 0.5) calc(50% + 1px)
  );
}
.bg-primary-lighter-opaque {
  background-color: rgba(0, 173, 181, 0.2);
}
.price-table.ps {
  max-height: unset;
}
.price-table .ps__thumb-x {
  @apply bg-primary;
  @apply rounded;
  bottom: 0;
}
.price-table .ps__rail-x:hover > .ps__thumb-x {
  @apply bg-primary;
}
.price-table .ps__rail-x {
  @apply h-4;
  @apply bg-grey-light !important;
  @apply opacity-100 !important;
  @apply rounded;
}
.price-table .ps__thumb-x {
  @apply h-4;
}
.ps__rail-x:hover > .ps__thumb-x,
.ps__rail-x:focus > .ps__thumb-x,
.ps__rail-x.ps--clicking .ps__thumb-x {
  @apply bg-primary;
  @apply h-4;
}
.-t-24 {
  top: -33px;
}

.flight-search-result-modal-max-height {
  max-height: 460px;
}
</style>
