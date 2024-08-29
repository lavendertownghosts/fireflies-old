<template>
  <div class="countdown">
    <span
      v-if="
        remaining.days.value > 0 ||
          (remaining.years.value > 0 && remaining.days.value == 0)
      "
    >
      <span v-if="remaining.years.value != 0"
        >{{ remaining.years.value }} {{ remaining.years.label }}</span
      >
      <span
        >{{ remaining.days.value &lt; 10 ? '0' + remaining.days.value : remaining.days.value}}
        {{ remaining.days.label }}</span
      >
      <span
        >{{ remaining.hours.value &lt; 10 ? '0' + remaining.hours.value : remaining.hours.value}}
        {{ remaining.hours.label }}</span
      >
    </span>
    <span v-else>
      <span
        >{{
          remaining.hours.value &lt; 10
            ? '0' + remaining.hours.value
            : remaining.hours.value
        }}
        :</span
      >
      <span
        >{{
          remaining.minutes.value &lt; 10
            ? '0' + remaining.minutes.value
            : remaining.minutes.value
        }}
        :</span
      >
      <span>{{
        remaining.seconds.value &lt; 10
          ? '0' + remaining.seconds.value
          : remaining.seconds.value
      }}</span>
    </span>
  </div>
</template>

<script>
import * as workerTimers from 'worker-timers'
import {
  addDays,
  addHours,
  addMinutes,
  addYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  differenceInYears
} from 'date-fns'

export default {
  name: 'CountDown',
  props: {
    endDate: {
      type: [String, Boolean],
      default: false
    }
  },
  data() {
    return {
      remaining: {
        years: {
          label: this.$t('general.Year'),
          value: 0
        },
        days: {
          label: this.$t('general.Day'),
          value: 0
        },
        hours: {
          label: this.$t('general.Hour'),
          value: 0
        },
        minutes: {
          label: this.$t('general.Minute'),
          value: 0
        },
        seconds: {
          label: this.$t('general.Second'),
          value: 0
        }
      },
      tick: false
    }
  },
  mounted() {
    if (this.tick !== false) {
      workerTimers.clearInterval(this.tick)
      this.tick = false
    }

    this.calcRemainingTime(this.endDate)
    this.tick = workerTimers.setInterval(() => {
      this.calcRemainingTime(this.endDate)
    }, 500)
  },
  methods: {
    calcRemainingTime(date) {
      // Kukás iPhone nem kezel bármilyen dátumformátumot ezért konvertálni kell, viva la epül
      const arr = date.split(/[- :]/)
      date = new Date(
        arr[0],
        arr[1] - 1,
        arr[2],
        arr[3] !== undefined ? arr[3] : 0,
        arr[4] !== undefined ? arr[4] : 0,
        arr[5] !== undefined ? arr[5] : 0
      )

      let today = new Date()

      if (date < today) {
        return false
      }

      let temp

      temp = differenceInYears(date, today)
      this.remaining.years.value = temp
      today = addYears(today, temp)

      temp = differenceInDays(date, today)
      this.remaining.days.value = temp
      today = addDays(today, temp)

      temp = differenceInHours(date, today)
      this.remaining.hours.value = temp
      today = addHours(today, temp)

      temp = differenceInMinutes(date, today)
      this.remaining.minutes.value = temp
      today = addMinutes(today, temp)

      temp = differenceInSeconds(date, today)
      this.remaining.seconds.value = temp

      if (
        !(
          (this.remaining.days.value > 0) &
          (this.remaining.months > 0) &
          (this.remaining.years.value > 0)
        )
      ) {
      }
    }
  }
}
</script>

<style scoped></style>
