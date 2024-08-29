<template>
  <div
    v-if="flight !== false"
    class="flex flex-col lg:flex-row"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Header if best price-->
    <div
      v-if="bestPrice"
      :class="hover ? 'border-primary-dark' : 'border-primary'"
      class="bg-primary border border-b-0 w-full rounded-t text-white text-center leading-14 py-10 font-bold lg:flex lg:flex-initial lg:w-auto lg:items-center px-10 lg:rounded-t-none lg:rounded-l lg:border-r-0 lg:border-b z-0 cursor-pointer"
      @click="showDetails = !showDetails"
    >
      #1
    </div>
    <!-- Body-->
    <div
      :class="[
        bestPrice
          ? hover
            ? 'border-primary-dark'
            : 'border-primary'
          : hover
          ? 'border-grey'
          : 'border-grey-light',
        bestPrice
          ? 'border-l border-r border-b-0 border-t-0 bg-primary-opaque lg:border-r-0 lg:border-l-0 lg:border-t lg:border-b'
          : 'border-b-0 lg:rounded-t-none lg:border-r-0 lg:border-b',
        !showInModal && !bestPrice ? 'rounded-t lg:rounded-l' : ''
      ]"
      class="w-full flex flex-col border z-0 py-16 cursor-pointer justify-center"
      @click="showDetails = !showDetails"
    >
      <div class="flex flex-col sm:flex-row">
        <div
          class="flex flex-row sm:items-center sm:justify-center px-16 mr-4 sm:flex-col"
        >
          <div class="sm:items-center">
            <img
              class="w-32"
              :src="
                'https://cdn-dev.fireflies.com/airlines/' +
                  flight.outbound.marketingAirline +
                  '.png'
              "
              :alt="flight.outbound.marketingAirlineName"
              :title="flight.outbound.marketingAirlineName"
            />
          </div>
          <div class="flex items-center text-xs leading-12 mt-4 ml-4 sm:ml-0">
            {{ flight.outbound.cabin }}
          </div>
        </div>
        <div
          class="flex flex-grow sm:w-auto w-full mt-8 sm:mt-0 px-16 sm:items-center"
        >
          <div class="flex flex-initial">
            <div
              class="flex flex-col sm:flex-row items-center sm:justify-end w-min-105"
            >
              <div
                :class="
                  flight.outbound.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-0'
                "
                class="text-lg leading-24 font-bold text-black mb-4 sm:order-2"
              >
                {{ flight.outbound.departure.time }}
              </div>
              <div
                :class="
                  flight.outbound.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-0'
                "
                :title="
                  flight.outbound.departure.city.name +
                    ', ' +
                    flight.outbound.departure.airport.name
                "
                class="leading-14 text-right text-grey-dark w-full sm:w-auto sm:order-1 sm:mr-8"
              >
                {{ flight.outbound.departure.airport.code }}
              </div>
            </div>
          </div>
          <!-- Horizontal line departure-->
          <div
            :class="flight.outbound.breakpoints.length === 0 ? 'mb-12' : ''"
            class="flex-grow text-center mr-16 ml-16"
          >
            <div
              class="flex flex-wrap w-full h-full items-center  justify-center"
            >
              <div class="flex w-full text-center">
                <div class="text-xs leading-12 text-grey-dark w-full">
                  {{
                    flight.outboundFullTime !== undefined
                      ? parseInt(
                          flight.outboundFullTime.substring(
                            0,
                            flight.outboundFullTime.length - 2
                          )
                        ) +
                        ' ' +
                        $t('flight.HourShort') +
                        ' ' +
                        parseInt(flight.outboundFullTime.slice(-2)) +
                        ' ' +
                        $t('flight.MinuteShort')
                      : timeCalculator(
                          flight.outbound.departure.dateTime,
                          flight.outbound.arrival.dateTime
                        )
                  }}
                </div>
              </div>
              <HorizontalTimeline
                :stops="flight.outbound.breakpoints.length - 1"
              />
              <div
                v-show="flight.outbound.breakpoints.length !== 0"
                class="flex w-2/3"
              >
                <div class="text-xs leading-12 text-center text-danger w-full">
                  <div class="xl:inline-block">
                    {{ flight.outbound.breakpoints.length - 1 }}
                    <span class="lowercase">{{ $t('flight.Transfer') }}</span
                    >:
                  </div>
                  <div
                    class="xl:inline-block"
                    v-html="getBreakpoints(flight.outbound.breakpoints)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-initial">
            <div
              class="flex flex-col items-center w-min-105 sm:justify-start sm:flex-row"
            >
              <div
                :class="
                  flight.outbound.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-0'
                "
                class="flex flex-row text-lg leading-24 font-bold text-black mb-4 w-full sm:w-auto"
              >
                {{ flight.outbound.arrival.time }}
                <span
                  v-if="outboundDayDiff > 0"
                  class="text-danger cursor-pointer font-normal ml-4"
                  :title="
                    outboundDayDiff === 1
                      ? $t('flight.ArrivalNextDay')
                      : $t('flight.DateOfArrival') +
                        ': ' +
                        flight.outbound.arrival.dateTime.substr(0, 10)
                  "
                  >+{{ outboundDayDiff }}</span
                >
              </div>
              <div
                :class="
                  flight.outbound.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-0'
                "
                :title="
                  flight.outbound.arrival.city.name +
                    ', ' +
                    flight.outbound.arrival.airport.name
                "
                class="leading-14 text-grey-dark sm:ml-8 w-full"
              >
                {{ flight.outbound.arrival.airport.code }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Details departure-->
      <div v-show="showDetails" class="px-16 w-full">
        <div class="flex flex-row w-full text-black leading-16 mt-16">
          <div class="flex-col mr-6">
            <i class="fas fa-plane"></i>
          </div>
          <div class="flex-col font-bold">
            {{ $t('flight.Departure') }}
          </div>
        </div>
        <VerticalTimeline
          :stops="flight.outbound.breakpoints.length - 1"
          :timeline="getTimeline(flight.outbound)"
          class="ml-4 my-20"
        />
      </div>
      <!-- Return -->
      <div v-if="flight.return != undefined" class="w-full flex flex-wrap">
        <div class="h-1 w-full bg-grey-light my-16"></div>
        <div
          class="flex flex-row items-center justify-center px-16 mr-4 sm:flex-col"
        >
          <div class="sm:items-center">
            <img
              class="w-32"
              :src="
                'https://cdn-dev.fireflies.com/airlines/' +
                  flight.return.marketingAirline +
                  '.png'
              "
              :alt="flight.return.marketingAirlineName"
              :title="flight.return.marketingAirlineName"
            />
          </div>
          <div class="text-xs leading-12 mt-4 ml-4 sm:ml-0">
            {{ flight.return.cabin }}
          </div>
        </div>
        <div
          class="flex sm:flex-grow sm:w-auto flex-row w-full mt-8 sm:mt-0 px-16 sm:items-center"
        >
          <div class="flex flex-initial h-full">
            <div
              class="flex flex-col sm:flex-row items-center justify-end w-min-105"
            >
              <div
                :class="
                  flight.return.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-10'
                "
                class="text-lg leading-24 font-bold text-black mb-4 sm:order-2"
              >
                {{ flight.return.departure.time }}
              </div>
              <div
                :class="
                  flight.return.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-10'
                "
                :title="
                  flight.return.departure.city.name +
                    ', ' +
                    flight.return.departure.airport.name
                "
                class="leading-14 text-right text-grey-dark w-full sm:w-auto sm:order-1 sm:mr-8"
              >
                {{ flight.return.departure.airport.code }}
              </div>
            </div>
          </div>
          <!-- Horizontal line return-->
          <div
            :class="flight.return.breakpoints.length === 0 ? 'mb-12' : ''"
            class="flex-grow text-center mr-16 ml-16"
          >
            <div
              class="flex flex-wrap w-full h-full items-center justify-center"
            >
              <div class="flex w-full text-center">
                <div class="text-xs leading-12 text-grey-dark w-full">
                  {{
                    flight.returnFullTime !== undefined
                      ? parseInt(
                          flight.returnFullTime.substring(
                            0,
                            flight.returnFullTime.length - 2
                          )
                        ) +
                        ' ' +
                        $t('flight.HourShort') +
                        ' ' +
                        parseInt(flight.returnFullTime.slice(-2)) +
                        ' ' +
                        $t('flight.MinuteShort')
                      : timeCalculator(
                          flight.return.departure.dateTime,
                          flight.return.arrival.dateTime
                        )
                  }}
                </div>
              </div>
              <HorizontalTimeline
                :stops="flight.return.breakpoints.length - 1"
              />
              <div
                v-if="flight.return.breakpoints.length !== 0"
                class="flex w-2/3"
              >
                <div class="text-xs leading-12 text-center text-danger w-full">
                  <div class="xl:inline-block">
                    {{ flight.return.breakpoints.length - 1 }}
                    <span class="lowercase">{{ $t('flight.Transfer') }}</span
                    >:
                  </div>
                  <div
                    class="xl:inline-block"
                    v-html="getBreakpoints(flight.return.breakpoints)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-initial w-min-105">
            <div class="sm:flex sm:flex-wrap sm:items-center">
              <div
                :class="
                  flight.return.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-10'
                "
                class="text-lg leading-24 font-bold text-black mb-4"
              >
                {{ flight.return.arrival.time }}
                <span
                  v-if="returnDayDiff > 0"
                  class="text-danger cursor-pointer font-normal"
                  :title="
                    outboundDayDiff === 1
                      ? $t('flight.ArrivalNextDay')
                      : $t('flight.DateOfArrival') +
                        ': ' +
                        flight.return.arrival.dateTime.substr(0, 10)
                  "
                  >+{{ returnDayDiff }}</span
                >
              </div>
              <div
                :class="
                  flight.return.breakpoints.length === 0
                    ? 'sm:mb-0'
                    : 'sm:mb-10 xl:mb-10'
                "
                :title="
                  flight.return.arrival.city.name +
                    ', ' +
                    flight.return.arrival.airport.name
                "
                class="leading-14 text-grey-dark sm:ml-8"
              >
                {{ flight.return.arrival.airport.code }}
              </div>
            </div>
          </div>
        </div>
        <!-- Details return-->
        <div v-show="showDetails" class="px-16 w-full">
          <div class="flex flex-row w-full text-black leading-16 mt-16">
            <div class="flex-col mr-6">
              <i class="fas fa-plane fa-rotate-180"></i>
            </div>
            <div class="flex-col font-bold">
              {{ $t('flight.Arrival') }}
            </div>
          </div>
          <VerticalTimeline
            :stops="flight.return.breakpoints.length - 1"
            :timeline="getTimeline(flight.return)"
            class="ml-4 my-20"
          />
        </div>
      </div>
    </div>
    <!-- Footer-->
    <div
      :class="[
        bestPrice
          ? hover
            ? 'border-primary-dark'
            : 'border-primary'
          : hover
          ? 'border-grey'
          : 'border-grey-light',
        bestPrice
          ? 'bg-primary border border-t-0 lg:border-t lg:border-l-0'
          : 'bg-grey-lighter-opaque border border-t-0 lg:border-t lg:border-l-0',
        !showInModal ? 'lg:rounded-r' : ''
      ]"
      class="flex flex-row w-full rounded-b border lg:flex lg:flex-initial lg:w-auto lg:rounded-b-none z-0"
    >
      <div
        :class="[
          bestPrice && !showDetails
            ? 'text-white hover:text-opacity-50'
            : showDetails
            ? 'text-black'
            : 'text-primary hover:text-primary-dark',
          !bestPrice
            ? 'border-t border-grey-light lg:border-t-0 lg:border-l'
            : 'border-t border-primary lg:border-t-0 lg:border-l'
        ]"
        class="flex flex-initial px-16 py-18 cursor-pointer items-center lg:px-8 lg:py-0"
        @click="showDetails = !showDetails"
      >
        <i class="fas fa-info-circle"></i>
      </div>
      <div
        :class="bestPrice ? 'bg-white opacity-40' : 'bg-grey-light'"
        class="w-1 h-full bg-white"
      ></div>
      <div
        :class="!bestPrice ? 'border-t border-grey-light lg:border-t-0' : ''"
        class="flex flex-grow md:w-128 flex-row justify-end lg:justify-center items-center py-16 lg:mx-42 lg:flex-col"
      >
        <div
          :class="bestPrice ? 'text-white' : 'text-black'"
          class="text-2x leading-18 font-bold mr-16 lg:flex lg:mr-0 lg:mb-16"
        >
          {{ currency }}
          {{
            Math.ceil(flight.total_fare[currency])
              | formatNumber('0,0', { thousandsSeparator: ' ' })
          }}
        </div>
        <div class="mr-16 lg:w-full lg:mr-0 lg:text-center bg-dark-hard">
          <ButtonSmall
            :type="bestPrice ? 'danger' : 'inverted'"
            :is-loading="showDetailsButtonLoading"
            @click="$emit('toCart')"
          >
            {{ $t('flight.Booking') }}
          </ButtonSmall>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { differenceInMinutes, differenceInDays } from 'date-fns'
import HorizontalTimeline from '@/components/micro/HorizontalTimeline'
import VerticalTimeline from '@/components/micro/VerticalTimeline'
import ButtonSmall from '@/components/micro/ButtonSmall'

export default {
  name: 'FlightSearchResultCard',
  components: {
    ButtonSmall,
    HorizontalTimeline,
    VerticalTimeline
  },
  props: {
    bestPrice: {
      type: Boolean,
      default: false
    },
    oneWay: {
      type: Boolean,
      default: false
    },
    stops: {
      type: Number,
      default: 0
    },
    arrivesNexDay: {
      type: Boolean,
      default: false
    },
    showInModal: {
      type: Boolean,
      default: false
    },
    flight: {
      type: [Object, Boolean],
      required: true
    },
    showDetailsButtonLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showDetails: false,
      hover: false,
      outboundDayDiff: 0,
      returnDayDiff: 0
    }
  },
  computed: {
    ...mapGetters('general', ['getCurrency']),
    currency() {
      return this.getCurrency
    }
  },
  mounted() {
    if (this.flight.outbound !== undefined) {
      const outboundDeparture = new Date(
        this.flight.outbound.departure.dateTime
      )
      const outboundArrival = new Date(this.flight.outbound.arrival.dateTime)
      this.outboundDayDiff = differenceInDays(
        outboundArrival,
        outboundDeparture
      )
    }
    if (this.flight.return !== undefined) {
      const returnDeparture = new Date(this.flight.return.departure.dateTime)
      const returnArrival = new Date(this.flight.return.arrival.dateTime)
      this.returnDayDiff = differenceInDays(returnArrival, returnDeparture)
    }
  },
  methods: {
    getBreakpoints(breakpoints) {
      const breakpointCodes = []
      if (breakpoints.length > 0) {
        for (let i = 0; i < breakpoints.length - 1; i++) {
          breakpointCodes.push(
            "<span title='" +
              breakpoints[i].arrival.city.name +
              ', ' +
              breakpoints[i].arrival.airport.name +
              "'>" +
              breakpoints[i].arrival.airport.code +
              '</span>'
          )
        }
      }
      return breakpointCodes.join(', ')
    },
    getTimeline(way) {
      const timeline = []
      let item = {
        title: way.departure.time + ' ' + way.departure.airport.code
      }
      if (way.breakpoints !== undefined && way.breakpoints.length > 0) {
        item.description =
          this.$t('flight.FlightNumber') +
          ': ' +
          way.flightNumber +
          ' ' +
          this.$t('flight.FlightTime') +
          ': ' +
          this.timeCalculator(
            way.breakpoints[0].departure.dateTime,
            way.breakpoints[0].arrival.dateTime
          )
      }
      timeline.push(item)
      if (way.breakpoints !== undefined && way.breakpoints.length > 0) {
        for (let i = 0; i < way.breakpoints.length; i++) {
          if (way.breakpoints[i + 1] !== undefined) {
            item = {
              title:
                way.breakpoints[i].arrival.time +
                ' ' +
                way.breakpoints[i].arrival.airport.code,
              stoppingTime: this.timeCalculator(
                way.breakpoints[i].arrival.dateTime,
                way.breakpoints[i + 1].departure.dateTime
              )
            }
            timeline.push(item)
            item = {
              title:
                way.breakpoints[i + 1].departure.time +
                ' ' +
                way.breakpoints[i + 1].departure.airport.code,
              description:
                this.$t('flight.FlightNumber') +
                ': ' +
                way.breakpoints[i + 1].flightNumber +
                ', ' +
                way.breakpoints[i + 1].departure.airport.code +
                ' - ' +
                way.breakpoints[i + 1].arrival.airport.code +
                ', ' +
                this.$t('flight.FlightTime') +
                ': ' +
                this.timeCalculator(
                  way.breakpoints[i + 1].departure.dateTime,
                  way.breakpoints[i + 1].arrival.dateTime
                )
            }
            timeline.push(item)
          }
        }
      }
      timeline.push({
        title: way.arrival.time + ' ' + way.arrival.airport.code
      })
      return timeline
    },
    timeCalculator(start, end) {
      const n = Math.abs(differenceInMinutes(new Date(start), new Date(end)))
      const hours = Math.floor(n / 60)
      const minutes = n - hours * 60
      let time = ''
      if (hours > 0) {
        time += hours + ' ' + this.$t('flight.HourShort') + ' '
      }
      if (minutes > 0) {
        time += minutes + ' ' + this.$t('flight.MinuteShort') + ' '
      }
      return time
    }
  }
}
</script>
<style scoped>
@media (min-width: 520px) {
  .w-min-105 {
    min-width: 105px;
  }
}
</style>
