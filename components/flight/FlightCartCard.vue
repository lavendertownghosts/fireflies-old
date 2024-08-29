<template>
  <div>
    <div class="flex flex-row px-16 items-center sm:pt-16 md:pt-0">
      <div class="flex-col mr-4">
        <img
          class="w-32 cursor-help"
          :src="
            'https://cdn.gekko-marketing.com/airlines/' +
              flight.firstLeg.marketingAirline +
              '.png'
          "
          :alt="flight.firstLeg.operatingAirlineName"
          :title="flight.firstLeg.operatingAirlineName"
        />
      </div>
      <div class="flex-col text-xs leading-12">
        {{ flight.firstLeg.cabin }}
      </div>
    </div>
    <div class="flex flex-row flex-grow mt-8 px-16 sm:items-center">
      <div class="flex flex-initial">
        <div class="flex flex-col items-right w-min-105">
          <div
            :class="
              flight.firstLeg.breakpoints.length === 0
                ? 'sm:mb-0'
                : 'sm:mb-10 xl:mb-0'
            "
            class="text-lg leading-24 font-bold text-black mb-4"
          >
            {{ flight.firstLeg.departure.time }}
          </div>
          <div
            :class="
              flight.firstLeg.breakpoints.length === 0
                ? 'sm:mb-0'
                : 'sm:mb-10 xl:mb-0'
            "
            :title="
              flight.firstLeg.departure.city.name +
                ', ' +
                flight.firstLeg.departure.airport.name
            "
            class="leading-14 text-right text-grey-dark w-full"
          >
            {{ flight.firstLeg.departure.airport.code }}
          </div>
        </div>
      </div>
      <!-- Horizontal line departure-->
      <div
        :class="flight.firstLeg.breakpoints.length === 0 ? 'mb-12' : ''"
        class="flex-grow text-center mr-16 ml-16"
      >
        <div class="flex flex-wrap w-full h-full items-center  justify-center">
          <div class="flex w-full text-center">
            <div class="text-xs leading-12 text-grey-dark w-full">
              {{
                flight.firstLegFullTime !== undefined
                  ? parseInt(
                      flight.firstLegFullTime.substring(
                        0,
                        flight.firstLegFullTime.length - 2
                      )
                    ) +
                    ' ' +
                    $t('flight.HourShort') +
                    ' ' +
                    parseInt(flight.firstLegFullTime.slice(-2)) +
                    ' ' +
                    $t('flight.MinuteShort')
                  : timeCalculator(
                      flight.firstLeg.departure.dateTime,
                      flight.firstLeg.arrival.dateTime
                    )
              }}
            </div>
          </div>
          <HorizontalTimeline :stops="flight.firstLeg.breakpoints.length - 1" />
          <div
            v-show="flight.firstLeg.breakpoints.length !== 0"
            class="flex w-2/3"
          >
            <div class="text-xs leading-12 text-center text-danger w-full">
              <div class="xl:inline-block">
                {{ flight.firstLeg.breakpoints.length - 1 }}
                <span class="lowercase">{{ $t('flight.Transfer') }}</span
                >:
              </div>
              <div
                class="xl:inline-block"
                v-html="getBreakpoints(flight.firstLeg.breakpoints)"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-initial">
        <div class="flex flex-col items-center w-min-105 sm:justify-start">
          <div
            :class="
              flight.firstLeg.breakpoints.length === 0
                ? 'sm:mb-0'
                : 'sm:mb-10 xl:mb-0'
            "
            class="flex flex-row text-lg leading-24 font-bold text-black mb-4 w-full sm:w-auto"
          >
            {{ flight.firstLeg.arrival.time }}
            <span
              v-if="firstLegDayDiff > 0"
              class="text-danger cursor-pointer font-normal ml-4"
              :title="
                firstLegDayDiff === 1
                  ? $t('flight.ArrivalNextDay')
                  : $t('flight.DateOfArrival') +
                    ': ' +
                    flight.firstLeg.arrival.dateTime.substr(0, 10)
              "
              >+{{ firstLegDayDiff }}</span
            >
          </div>
          <div
            :class="
              flight.firstLeg.breakpoints.length === 0
                ? 'sm:mb-0'
                : 'sm:mb-10 xl:mb-0'
            "
            :title="
              flight.firstLeg.arrival.city.name +
                ', ' +
                flight.firstLeg.arrival.airport.name
            "
            class="leading-14 text-grey-dark sm:ml-8 w-full"
          >
            {{ flight.firstLeg.arrival.airport.code }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-grey-light h-1 m-16"></div>
    <div v-if="flight.returnLeg !== undefined">
      <div class="flex flex-row items-center px-16">
        <div class="flex-col mr-4">
          <img
            class="w-32 cursor-help"
            :src="
              'https://cdn.gekko-marketing.com/airlines/' +
                flight.returnLeg.marketingAirline +
                '.png'
            "
            :alt="flight.returnLeg.operatingAirlineName"
            :title="flight.returnLeg.operatingAirlineName"
          />
        </div>
        <div class="flex-col text-xs leading-12">
          {{ flight.firstLeg.cabin }}
        </div>
      </div>
      <div class="flex flex-row flex-grow mt-8 px-16 sm:items-center">
        <div class="flex flex-initial">
          <div class="flex flex-col items-right w-min-105">
            <div
              :class="
                flight.returnLeg.breakpoints.length === 0
                  ? 'sm:mb-0'
                  : 'sm:mb-10 xl:mb-0'
              "
              class="text-lg leading-24 font-bold text-black mb-4"
            >
              {{ flight.returnLeg.departure.time }}
            </div>
            <div
              :class="
                flight.returnLeg.breakpoints.length === 0
                  ? 'sm:mb-0'
                  : 'sm:mb-10 xl:mb-0'
              "
              :title="
                flight.returnLeg.departure.city.name +
                  ', ' +
                  flight.returnLeg.departure.airport.name
              "
              class="leading-14 text-right text-grey-dark w-full"
            >
              {{ flight.returnLeg.departure.airport.code }}
            </div>
          </div>
        </div>
        <!-- Horizontal line return-->
        <div
          :class="flight.returnLeg.breakpoints.length === 0 ? 'mb-12' : ''"
          class="flex-grow text-center mr-16 ml-16"
        >
          <div
            class="flex flex-wrap w-full h-full items-center  justify-center"
          >
            <div class="flex w-full text-center">
              <div class="text-xs leading-12 text-grey-dark w-full">
                {{
                  flight.returnLegFullTime !== undefined
                    ? parseInt(
                        flight.returnLegFullTime.substring(
                          0,
                          flight.returnLegFullTime.length - 2
                        )
                      ) +
                      ' ' +
                      $t('flight.HourShort') +
                      ' ' +
                      parseInt(flight.returnLegFullTime.slice(-2)) +
                      ' ' +
                      $t('flight.MinuteShort')
                    : timeCalculator(
                        flight.returnLeg.departure.dateTime,
                        flight.returnLeg.arrival.dateTime
                      )
                }}
              </div>
            </div>
            <HorizontalTimeline
              :stops="flight.returnLeg.breakpoints.length - 1"
            />
            <div
              v-show="flight.returnLeg.breakpoints.length !== 0"
              class="flex w-2/3"
            >
              <div class="text-xs leading-12 text-center text-danger w-full">
                <div class="xl:inline-block">
                  {{ flight.returnLeg.breakpoints.length - 1 }}
                  <span class="lowercase">{{ $t('flight.Transfer') }}</span
                  >:
                </div>
                <div
                  class="xl:inline-block"
                  v-html="getBreakpoints(flight.returnLeg.breakpoints)"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-initial">
          <div class="flex flex-col items-center w-min-105">
            <div
              :class="
                flight.returnLeg.breakpoints.length === 0
                  ? 'sm:mb-0'
                  : 'sm:mb-10 xl:mb-0'
              "
              class="flex flex-row text-lg leading-24 font-bold text-black mb-4 w-full sm:w-auto"
            >
              {{ flight.returnLeg.arrival.time }}
              <span
                v-if="returnLegDayDiff > 0"
                class="text-danger cursor-pointer font-normal ml-4"
                :title="
                  returnLegDayDiff === 1
                    ? $t('flight.ArrivalNextDay')
                    : $t('flight.DateOfArrival') +
                      ': ' +
                      flight.returnLeg.arrival.dateTime.substr(0, 10)
                "
                >+{{ returnLegDayDiff }}</span
              >
            </div>
            <div
              :class="
                flight.returnLeg.breakpoints.length === 0
                  ? 'sm:mb-0'
                  : 'sm:mb-10 xl:mb-0'
              "
              :title="
                flight.returnLeg.arrival.city.name +
                  ', ' +
                  flight.returnLeg.arrival.airport.name
              "
              class="leading-14 text-grey-dark sm:ml-8 w-full"
            >
              {{ flight.returnLeg.arrival.airport.code }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { differenceInDays, differenceInMinutes } from 'date-fns'
import HorizontalTimeline from '@/components/micro/HorizontalTimeline'
export default {
  name: 'FlightCartCard',
  components: { HorizontalTimeline },
  props: {
    timelineExtraClass: {
      type: [String, Boolean],
      default: false
    },
    flight: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      firstLegDayDiff: null,
      returnLegDayDiff: null
    }
  },
  mounted() {
    if (this.flight.firstLeg !== undefined) {
      const firstLegDeparture = new Date(
        this.flight.firstLeg.departure.dateTime
      )
      const firstLegArrival = new Date(this.flight.firstLeg.arrival.dateTime)
      this.firstLegDayDiff = differenceInDays(
        firstLegArrival,
        firstLegDeparture
      )
    }
    if (this.flight.returnLeg !== undefined) {
      const returnDeparture = new Date(this.flight.returnLeg.departure.dateTime)
      const returnArrival = new Date(this.flight.returnLeg.arrival.dateTime)
      this.returnLegDayDiff = differenceInDays(returnArrival, returnDeparture)
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
