<template>
  <div class="absolute z-50">
    <div
      class="calendar-wrapper relative bg-white shadow-drop text-black rounded flex flex-col"
    >
      <div
        class="flex flex-row px-16 py-20 justify-between items-center border-b border-grey-dark"
      >
        <i
          class="fa fa-chevron-left text-base leading-16 font-black cursor-pointer hover:opacity-80"
          @click="previous()"
        ></i>
        <div
          v-show="activeView === 'days'"
          class="text-lg leading-24 text-center cursor-pointer"
          @click="changeView('months')"
        >
          {{ monthsLong[currentMonth] }} {{ currentYear }}
        </div>
        <div
          v-show="activeView === 'months'"
          class="text-lg leading-24 text-center cursor-pointer"
          @click="changeView('years')"
        >
          {{ currentYear }}
        </div>
        <div
          v-show="activeView === 'years'"
          class="text-lg leading-24 text-center cursor-pointer"
        >
          {{ currentYear - 6 }} - {{ currentYear + 6 }}
        </div>
        <i
          class="fa fa-chevron-right text-base leading-16 font-black cursor-pointer hover:opacity-80"
          @click="next()"
        ></i>
      </div>
      <div v-show="activeView === 'days'" class="calendar-wrapper-inner-days">
        <div class="flex flex-row justify-between items-center pt-14 pb-5 px-8">
          <div
            v-for="(day, index) in days"
            :key="index"
            class="text-xs leading-16 font-light uppercase text-center w-1/7"
          >
            {{ day }}
          </div>
        </div>
        <div class="flex flex-wrap px-8">
          <div
            v-for="(date, index) in displayDates"
            :key="index"
            class="text-base leading-16 w-1/7 text-center h-40 cursor-pointer rounded flex items-center justify-center"
            :class="getDayClasses(date)"
            @click="selectDate(date)"
            @mouseover="hoverHandler(index)"
            @mouseleave="hoverDate = false"
          >
            <span>{{ date.day }}</span>
          </div>
        </div>
      </div>
      <div
        v-show="activeView === 'months'"
        class="calendar-wrapper-inner flex flex-wrap justify-center items-center"
      >
        <div
          v-for="(month, index) in monthsShort"
          :key="index"
          class="w-1/3 text-base leading-16 text-center cursor-pointer rounded h-70 flex items-center justify-center"
          :class="{
            'bg-primary text-white':
              index === selectedMonthYear.month &&
              currentYear === selectedMonthYear.year,
            'text-grey':
              disablePast &&
              ((index < new Date().getMonth() &&
                currentYear === new Date().getFullYear()) ||
                currentYear < new Date().getFullYear()),
            'hover:bg-primary-opaque':
              (index >= new Date().getMonth() &&
                currentYear === new Date().getFullYear() &&
                index !== currentMonth) ||
              (currentYear > new Date().getFullYear() &&
                !(
                  index === selectedMonthYear.month &&
                  currentYear === selectedMonthYear.year
                ))
          }"
          @click="selectMonth(index)"
          @mouseover="hoverMonth = index"
        >
          <span>{{ month }}</span>
        </div>
      </div>
      <div
        v-show="activeView === 'years'"
        class="calendar-wrapper-inner flex flex-wrap justify-center items-center"
      >
        <div
          v-for="(year, index) in computedYears"
          :key="index"
          class="w-1/3 text-base leading-16 text-center cursor-pointer rounded h-70 flex items-center justify-center"
          :class="{
            'bg-primary text-white': year === selectedMonthYear.year,
            'text-grey': disablePast && year < new Date().getFullYear(),
            'hover:bg-primary-opaque':
              disablePast &&
              year >= new Date().getFullYear() &&
              year !== currentYear
          }"
          @mouseover="hoverYear = year"
          @click="selectYear(year)"
        >
          {{ year }}
        </div>
      </div>
      <div
        v-show="activeView === 'days'"
        class="border-t border-grey-dark py-16 text-center text-sm leading-14"
      >
        {{ computedCheckin }}
        {{ selectRange ? ' - ' + computedCheckout : '' }}
      </div>
      <div
        v-show="activeView === 'months'"
        class="border-t border-grey-dark py-16 text-center text-sm leading-14"
      >
        {{ computedMonth }} {{ currentYear }}
      </div>
      <div
        v-show="activeView === 'years'"
        class="border-t border-grey-dark py-16 text-center text-sm leading-14"
      >
        {{ hoverYear || selectedMonthYear.year }}
      </div>
    </div>
  </div>
</template>

<script>
import { formatDateApi, calcNights } from '@/includes/utils'

export default {
  name: 'Calendar',
  props: {
    disablePast: {
      type: Boolean,
      default: false
    },
    overwriteToday: {
      type: String,
      default: null
    },
    selectRange: {
      type: Boolean,
      default: false
    },
    labels: {
      type: Object,
      default() {
        return {
          date1: '',
          date2: ''
        }
      }
    },
    isNights: {
      type: Boolean,
      default: true
    },
    isEndDate: {
      type: Boolean,
      default: false
    },
    enableSameDate: {
      type: Boolean,
      default: false
    },
    initValues: {
      type: Object,
      default() {
        return {
          date1: '',
          date2: ''
        }
      }
    },
    maxDateYear: {
      type: Number,
      default: 0
    },
    maxDateInterval: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedDate1: false,
      selectedDate2: false,
      hoverDate: false,
      hoverMonth: false,
      hoverYear: false,
      activeView: 'days',

      today: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectedMonthYear: {
        month: new Date().getMonth(),
        year: new Date().getFullYear()
      },
      displayDates: [],

      monthsShort: [
        this.$t('general.JanuaryShort'),
        this.$t('general.FebruaryShort'),
        this.$t('general.MarchShort'),
        this.$t('general.AprilShort'),
        this.$t('general.MayShort'),
        this.$t('general.JuneShort'),
        this.$t('general.JulyShort'),
        this.$t('general.AugustShort'),
        this.$t('general.SeptemberShort'),
        this.$t('general.OctoberShort'),
        this.$t('general.NovemberShort'),
        this.$t('general.DecemberShort')
      ],
      monthsLong: [
        this.$t('general.January'),
        this.$t('general.February'),
        this.$t('general.March'),
        this.$t('general.April'),
        this.$t('general.May'),
        this.$t('general.June'),
        this.$t('general.July'),
        this.$t('general.August'),
        this.$t('general.September'),
        this.$t('general.October'),
        this.$t('general.November'),
        this.$t('general.December')
      ],
      days: [
        this.$t('general.MondayShort'),
        this.$t('general.TuesdayShort'),
        this.$t('general.WednesdayShort'),
        this.$t('general.ThursdayShort'),
        this.$t('general.FridayShort'),
        this.$t('general.SaturdayShort'),
        this.$t('general.SundayShort')
      ]
    }
  },
  computed: {
    computedYears() {
      const yearsArray = []
      for (let i = 0; i < 12; i++) {
        yearsArray.push(this.currentYear - 6 + i)
      }

      return yearsArray
    },
    computedMonth() {
      return this.monthsShort[this.hoverMonth]
    },
    computedCheckin() {
      if (
        this.selectedDate1 !== false &&
        this.selectedDate2 !== false &&
        this.hoverDate !== false
      ) {
        return this.formatCalendarDate(this.hoverDate)
      } else if (this.selectedDate1 !== false) {
        return this.formatCalendarDate(this.selectedDate1)
      } else {
        return this.labels.date1
      }
    },
    computedCheckout() {
      if (
        this.selectedDate2 !== false &&
        this.hoverDate !== false &&
        new Date(
          this.hoverDate.year,
          this.hoverDate.month,
          this.hoverDate.day
        ) !==
          new Date(
            this.selectedDate1.year,
            this.selectedDate1.month,
            this.selectedDate1.day
          )
      ) {
        return this.labels.date2
      } else if (
        (this.selectedDate1 &&
          this.selectedDate2 &&
          new Date(
            this.selectedDate1.year,
            this.selectedDate1.month,
            this.selectedDate1.day
          ) >=
            new Date(
              this.selectedDate2.year,
              this.selectedDate2.month,
              this.selectedDate2.day
            )) ||
        (!this.selectedDate2 && !this.hoverDate)
      ) {
        return this.labels.date2
      }

      if (
        this.selectedDate1 &&
        !this.selectedDate2 &&
        new Date(
          this.selectedDate1.year,
          this.selectedDate1.month,
          this.selectedDate1.day
        ) >=
          new Date(
            this.hoverDate.year,
            this.hoverDate.month,
            this.hoverDate.day
          )
      ) {
        return this.labels.date2
      }
      if (this.isNights) {
        return (
          this.formatCalendarDate(this.selectedDate2 || this.hoverDate) +
          ' (' +
          calcNights(
            formatDateApi(
              this.selectedDate1.year,
              this.selectedDate1.month + 1,
              this.selectedDate1.day
            ),
            this.selectedDate2
              ? formatDateApi(
                  this.selectedDate2.year,
                  this.selectedDate2.month + 1,
                  this.selectedDate2.day
                )
              : formatDateApi(
                  this.hoverDate.year,
                  this.hoverDate.month + 1,
                  this.hoverDate.day
                )
          ) +
          ' ' +
          this.$t('general.Nights') +
          ')'
        )
      } else {
        return this.formatCalendarDate(this.selectedDate2 || this.hoverDate)
      }
    }
  },
  watch: {
    initValues(newValue) {
      if (typeof newValue.date1 !== 'undefined' && newValue.date1 !== '') {
        const tempDate1 = new Date(newValue.date1)
        this.selectedDate1 = {
          day: tempDate1.getDate(),
          month: tempDate1.getMonth(),
          year: tempDate1.getFullYear()
        }
        this.currentYear = this.selectedDate1.year
        this.currentMonth = this.selectedDate1.month
      }
      if (typeof newValue.date2 !== 'undefined' && newValue.date2 !== '') {
        const tempDate2 = new Date(newValue.date2)
        this.selectedDate2 = {
          day: tempDate2.getDate(),
          month: tempDate2.getMonth(),
          year: tempDate2.getFullYear()
        }
      }
      this.setDisplayDates()
    }
  },
  mounted() {
    if (
      typeof this.initValues.date1 !== 'undefined' &&
      this.initValues.date1 !== ''
    ) {
      const tempDate1 = new Date(this.initValues.date1)
      this.selectedDate1 = {
        day: tempDate1.getDate(),
        month: tempDate1.getMonth(),
        year: tempDate1.getFullYear()
      }
      this.currentYear = this.selectedDate1.year
      this.currentMonth = this.selectedDate1.month
    }
    if (
      typeof this.initValues.date2 !== 'undefined' &&
      this.initValues.date2 !== ''
    ) {
      const tempDate2 = new Date(this.initValues.date2)
      this.selectedDate2 = {
        day: tempDate2.getDate(),
        month: tempDate2.getMonth(),
        year: tempDate2.getFullYear()
      }
    }
    this.setDisplayDates()
  },
  methods: {
    changeView(view) {
      this.selectedMonthYear = {
        month: this.currentMonth,
        year: this.currentYear
      }
      this.activeView = view
    },
    formatDateApi(p1, p2, p3) {
      return formatDateApi(p1, p2, p3)
    },
    calcNights(p1, p2) {
      return calcNights(p1, p2)
    },
    formatCalendarDate(date) {
      let day = new Date(date.year, date.month, date.day).getDay()
      if (day === 0) {
        day = 7
      }
      return (
        this.days[day - 1] +
        ', ' +
        date.day +
        ' ' +
        this.monthsShort[date.month]
      )
    },
    selectYear(year) {
      if (
        year < Date.parse(this.overwriteToday) &&
        this.disablePast &&
        this.overwriteToday !== null
      ) {
        return
      }

      if (year < new Date().getFullYear() && this.disablePast) {
        return
      }

      this.currentYear = year
      this.activeView = 'months'
    },
    selectMonth(index) {
      if (this.disablePast && this.overwriteToday !== null) {
        if (
          (index < Date.parse(this.overwriteToday).getMonth() &&
            this.currentYear ===
              Date.parse(this.overwriteToday).getFullYear()) ||
          this.currentYear < Date.parse(this.overwriteToday).getFullYear()
        ) {
          return
        }
      }

      if (
        this.disablePast &&
        ((index < new Date().getMonth() &&
          this.currentYear === new Date().getFullYear()) ||
          this.currentYear < new Date().getFullYear())
      ) {
        return
      }

      this.currentMonth = index
      this.setDisplayDates()
      this.activeView = 'days'
    },
    selectDate(date) {
      if (
        Date.parse(date) < Date.parse(this.overwriteToday) &&
        this.disablePast &&
        this.overwriteToday !== null
      ) {
        this.selectedDate1.year = Date.parse(this.overwriteToday).getFullYear()
        this.selectedDate1.month = Date.parse(this.overwriteToday).getMonth()
        this.selectedDate1.day = Date.parse(this.overwriteToday).getDate()
        return
      }

      if (this.isEndDate) {
        this.selectedDate2 = false
      }
      if (this.selectRange) {
        if (this.disablePast && this.isInPast(date)) {
          return
        } else if (
          this.selectedDate1 &&
          !this.selectedDate2 &&
          date.year === this.selectedDate1.year &&
          date.month === this.selectedDate1.month &&
          date.day === this.selectedDate1.day
        ) {
          if (this.enableSameDate) {
            if (this.maxDateInterval !== 0) {
              if (
                calcNights(
                  formatDateApi(
                    this.selectedDate1.year,
                    this.selectedDate1.month + 1,
                    this.selectedDate1.day
                  ),
                  formatDateApi(date.year, date.month + 1, date.day)
                ) > this.maxDateInterval
              ) {
                return
              }
            }

            this.selectedDate2 = date
            this.$emit('select', {
              date1: formatDateApi(
                this.selectedDate1.year,
                this.selectedDate1.month + 1,
                this.selectedDate1.day
              ),
              date2: formatDateApi(date.year, date.month + 1, date.day)
            })
          } else {
            return
          }
        } else if (
          this.selectedDate1 &&
          !this.selectedDate2 &&
          new Date(date.year, date.month, date.day) <
            new Date(
              this.selectedDate1.year,
              this.selectedDate1.month,
              this.selectedDate1.day
            )
        ) {
          this.selectedDate1 = date

          this.$emit('select', {
            date1: formatDateApi(
              this.selectedDate1.year,
              this.selectedDate1.month + 1,
              this.selectedDate1.day
            ),
            date2: false
          })
        } else if (!this.selectedDate1) {
          this.selectedDate1 = date

          this.$emit('select', {
            date1: formatDateApi(
              this.selectedDate1.year,
              this.selectedDate1.month + 1,
              this.selectedDate1.day
            ),
            date2: false
          })
        } else if (!this.selectedDate2) {
          if (this.maxDateInterval !== 0) {
            if (
              calcNights(
                formatDateApi(
                  this.selectedDate1.year,
                  this.selectedDate1.month + 1,
                  this.selectedDate1.day
                ),
                formatDateApi(date.year, date.month + 1, date.day)
              ) > this.maxDateInterval
            ) {
              return
            }
          }

          this.selectedDate2 = date

          this.$emit('select', {
            date1: formatDateApi(
              this.selectedDate1.year,
              this.selectedDate1.month + 1,
              this.selectedDate1.day
            ),
            date2: formatDateApi(date.year, date.month + 1, date.day)
          })
        } else {
          this.selectedDate1 = date
          this.selectedDate2 = false

          this.$emit('select', {
            date1: formatDateApi(
              this.selectedDate1.year,
              this.selectedDate1.month + 1,
              this.selectedDate1.day
            ),
            date2: false
          })
        }
      } else {
        this.selectedDate1 = date
        this.$emit('select', formatDateApi(date.year, date.month + 1, date.day))
      }

      this.setDisplayDates()
    },
    hoverHandler(index) {
      const displayDates = this.displayDates
      this.hoverDate = displayDates[index]
      if (this.selectedDate1 && !this.selectedDate2) {
        // kiválasztás kijelölés
        let selectionPointer = false
        // ha előző oldalon van a checkin dátum
        if (
          new Date(
            this.selectedDate1.year,
            this.selectedDate1.month,
            this.selectedDate1.day
          ) <
          new Date(
            displayDates[0].year,
            displayDates[0].month,
            displayDates[0].day
          )
        ) {
          selectionPointer = true
        }
        for (let i = 0; i < displayDates.length; i++) {
          if (
            displayDates[i].day === this.selectedDate1.day &&
            displayDates[i].month === this.selectedDate1.month &&
            displayDates[i].year === this.selectedDate1.year
          ) {
            displayDates[i].selectType = 'date1'
            selectionPointer = true
          } else if (i === index) {
            displayDates[i].selectType = 'hover'
            selectionPointer = false
          } else if (selectionPointer === true && this.selectRange) {
            displayDates[i].selectType = 'range'
          } else {
            displayDates[i].selectType = false
          }
        }

        for (const f in displayDates) {
          this.$set(this.displayDates, f, displayDates[f])
        }
      }
    },
    isInPast(date) {
      if (this.overwriteToday !== null) {
        return (
          Date.parse(this.overwriteToday) >
          new Date(date.year, date.month, date.day + 1)
        )
      }
      if (this.maxDateYear !== 0) {
        const today = new Date()
        if (
          new Date(
            today.getFullYear() + this.maxDateYear,
            today.getMonth(),
            today.getDate() + 1
          ) < new Date(date.year, date.month, date.day + 1)
        ) {
          return true
        }
      }

      if (this.maxDateInterval !== 0) {
        if (this.selectedDate1 !== false && this.selectedDate2 === false) {
          const today = new Date(
            this.selectedDate1.year,
            this.selectedDate1.month,
            this.selectedDate1.day
          )
          if (
            new Date(
              today.getFullYear(),
              today.getMonth() + 1,
              today.getDate()
            ) < new Date(date.year, date.month, date.day + 1)
          ) {
            return true
          }
        }
      }

      return new Date() > new Date(date.year, date.month, date.day)
    },
    getDayClasses(date) {
      return [
        date.selectType === 'date1' && this.selectRange
          ? 'text-white bg-primary hover:bg-primary rounded-r-none'
          : date.selectType === 'date1' && !this.selectRange
          ? 'text-white bg-primary hover:bg-primary '
          : date.selectType === 'date2'
          ? 'text-white bg-primary hover:bg-primary rounded-l-none'
          : date.selectType === 'hover'
          ? 'text-black bg-primary-opaque hover:bg-primary-opaque rounded-l-none'
          : date.selectType === 'range'
          ? 'text-black bg-grey-opaque hover:bg-grey-opaque rounded-l-none rounded-r-none'
          : 'text-black hover:bg-primary-opaque',
        date.month !== this.currentMonth &&
        !['date1', 'date2', 'hover', 'range'].includes(date.selectType)
          ? 'text-grey'
          : '',
        this.disablePast && this.isInPast(date) ? 'text-grey' : ''
      ]
    },
    next() {
      if (this.activeView === 'days') {
        this.currentYear =
          this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear
        this.currentMonth = (this.currentMonth + 1) % 12
        this.setDisplayDates()
      } else if (this.activeView === 'months') {
        this.currentYear++
      } else if (this.activeView === 'years') {
        this.currentYear = this.currentYear + 12
      }
    },
    previous() {
      if (this.activeView === 'days') {
        this.currentYear =
          this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear
        this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1
        this.setDisplayDates()
      } else if (this.activeView === 'months') {
        this.currentYear--
      } else if (this.activeView === 'years') {
        this.currentYear = this.currentYear - 12
      }
    },
    setDisplayDates() {
      const displayDates = []

      let firstDayCurrentMonth = new Date(
        this.currentYear,
        this.currentMonth
      ).getDay()

      if (firstDayCurrentMonth === 0) {
        firstDayCurrentMonth = 7
      }

      const daysInCurrentMonth =
        32 - new Date(this.currentYear, this.currentMonth, 32).getDate()

      // előző hónap
      let lastMonth = this.currentMonth - 1
      let lastYear = this.currentYear
      if (lastMonth < 0) {
        lastMonth = 11
        lastYear = this.currentYear - 1
      }

      const daysInLastMonth = 32 - new Date(lastYear, lastMonth, 32).getDate()

      for (let i = firstDayCurrentMonth - 1; i > 0; i--) {
        displayDates.push({
          day: daysInLastMonth - (i - 1),
          month: lastMonth,
          year: lastYear
        })
      }

      // aktuális hónap
      for (let i = 1; i <= daysInCurrentMonth; i++) {
        displayDates.push({
          day: i,
          month: this.currentMonth,
          year: this.currentYear
        })
      }

      // köv hónap
      let nextMonth = this.currentMonth + 1
      let nextYear = this.currentYear
      if (nextMonth === 12) {
        nextMonth = 0
        nextYear = this.currentYear + 1
      }

      for (let i = 1; displayDates.length % 7 !== 0; i++) {
        displayDates.push({
          day: i,
          month: nextMonth,
          year: nextYear
        })
      }

      if (displayDates.length < 42) {
        for (let i = 0; i < 7; i++) {
          displayDates.push({
            day:
              displayDates[displayDates.length - 1].month === nextMonth
                ? displayDates[displayDates.length - 1].day + 1
                : i + 1,
            month: nextMonth,
            year: nextYear
          })
        }
      }

      // kiválasztás kijelölés
      let selectionPointer = false
      // ha előző oldalon van a checkin dátum
      if (
        new Date(
          this.selectedDate1.year,
          this.selectedDate1.month,
          this.selectedDate1.day
        ) <
          new Date(
            displayDates[0].year,
            displayDates[0].month,
            displayDates[0].day
          ) &&
        new Date(
          this.selectedDate2.year,
          this.selectedDate2.month,
          this.selectedDate2.day
        ) >
          new Date(
            displayDates[0].year,
            displayDates[0].month,
            displayDates[0].day
          )
      ) {
        selectionPointer = true
      }
      for (let i = 0; i < displayDates.length; i++) {
        if (
          displayDates[i].day === this.selectedDate1.day &&
          displayDates[i].month === this.selectedDate1.month &&
          displayDates[i].year === this.selectedDate1.year
        ) {
          displayDates[i].selectType = 'date1'
          if (this.selectedDate2) {
            selectionPointer = true
          }
        } else if (
          displayDates[i].day === this.selectedDate2.day &&
          displayDates[i].month === this.selectedDate2.month &&
          displayDates[i].year === this.selectedDate2.year
        ) {
          displayDates[i].selectType = 'date2'
          selectionPointer = false
        } else if (selectionPointer === true && this.selectRange) {
          displayDates[i].selectType = 'range'
        } else {
          displayDates[i].selectType = false
        }
      }

      for (const f in displayDates) {
        this.$set(this.displayDates, f, displayDates[f])
      }
    }
  }
}
</script>

<style>
.calendar-wrapper {
  top: 66px;
  width: 288px;
}

.calendar-wrapper-inner-days {
  height: 275px;
}
.calendar-wrapper-inner {
  height: 280px;
}
</style>
