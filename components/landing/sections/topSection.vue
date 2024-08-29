<template>
  <main
    style="top: 0; left: 0; z-index: 99;"
    class="fixed w-full bg-grey-lighter content-center transition-height duration-200 shadow ease-in-out py-4"
    :class="compact ? 'h-48' : 'h-88 py-20'"
  >
    <div class="lg:px-34 px-16 flex flex-row">
      <div
        class="font-bold px-9 lg:text-base flex flex-shrink-0 md:w-177 w-128 items-center text-xs lg:leading-18 leading-14"
      >
        {{ $t('landing.ActivitiesHeader') }}
      </div>
      <div
        v-if="activities !== undefined && activities.length > 0"
        class="flex scroller-gradient"
      >
        <Scroller>
          <div
            v-for="(activity, key) in activities"
            :key="key"
            class="flex flex-row flex-nowrap flex-none items-center text-sm leading-14 w-240"
          >
            <div
              class="mr-16 transition-height transition-width duration-200 ease-in-out"
              :class="!compact ? 'lg:h-34 lg:w-48' : 'h-30 w-42'"
            >
              <img
                class="rounded w-60 border border-grey transition-height transition-width duration-200 ease-in-out"
                :class="!compact ? 'lg:h-34 lg:w-48' : 'h-30 w-42'"
                :src="
                  'https://cdn.fireflies.com/flags/' +
                    activity.countryISO.toLowerCase() +
                    '.png'
                "
                draggable="false"
              />
            </div>
            <div class="flex flex-col">
              <div class="font-bold text-xs text-primary">
                {{ activity.username }}
              </div>
              <div class="text-xs leading-12">
                {{
                  activity.country[$i18n.locale] !== undefined
                    ? activity.country[$i18n.locale]
                    : activity.country.fallback !== undefined
                    ? activity.country.fallback
                    : activity.country
                }}
                |
                {{
                  activity.type == 'BUY'
                    ? $t('powerline.Buying')
                    : $t('powerline.Registration')
                }}
                <br />
                <span class="text-2xs">{{
                  isDateInPastHour(activity.date)
                }}</span>
              </div>
            </div>
          </div>
        </Scroller>
      </div>
    </div>
  </main>
</template>

<script>
import { formatDateDisplay } from '@/includes/utils'
import Scroller from '@/components/Scroller'
export default {
  name: 'TopSection',
  components: {
    Scroller
  },
  data() {
    return {
      compact: false,
      navTo: [0, true],
      perPage: 7,
      activities: []
    }
  },
  async mounted() {
    this.getCurrentScrollPosition()
    window.addEventListener('scroll', this.getCurrentScrollPosition)
    if (window.innerWidth < 1280) {
      this.perPage = 1
    } else if (window.innerWidth < 1440) {
      this.perPage = 5
    } else if (window.innerWidth > 1440) {
      this.perPage = 7
    }
    let res
    try {
      res = await this.$store.dispatch('user/activities')
    } catch (e) {
      console.log(e)
    }

    this.activities = res
  },
  methods: {
    formatDateDisplay,
    isDateInPastHour(date) {
      if (typeof date.split !== 'undefined') {
        const arr = date.split(/[- :]/)
        date = new Date(
          arr[0],
          arr[1] - 1,
          arr[2],
          arr[3] !== undefined ? arr[3] : 0,
          arr[4] !== undefined ? arr[4] : 0,
          arr[5] !== undefined ? arr[5] : 0
        )
      } else {
        date = new Date(date)
      }

      const now = new Date()
      const nowTime = now.getTime()
      const dateTime = date.getTime()
      const timeDifference = nowTime - dateTime
      const oneHourInMilliseconds = 60 * 60 * 1000
      if (timeDifference >= 0 && timeDifference <= oneHourInMilliseconds) {
        return (
          Math.floor(timeDifference / (60 * 1000)) +
          ' ' +
          this.$t('landing.fromMinutes')
        )
      } else {
        return (
          formatDateDisplay(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
          ) +
          ' | ' +
          date.getHours() +
          ':' +
          date.getMinutes()
        )
      }
    },
    getCurrentScrollPosition() {
      if (window.innerWidth < 730) {
        this.compact = true
      } else if (window.scrollY >= 88) {
        this.compact = true
      } else {
        this.compact = false
      }
    }
  }
}
</script>
<style scoped>
.scroller-gradient {
  overflow: hidden;
  z-index: 1;
  @apply relative px-2;
}

.scroller-gradient:before {
  pointer-events: none;
  z-index: 2;
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 62px;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    90deg,
    rgba(247, 247, 247, 1) 5%,
    rgba(247, 247, 247, 0) 100%
  );
}

.scroller-gradient:after {
  pointer-events: none;
  z-index: 2;
  content: '';
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 62px;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    90deg,
    rgba(247, 247, 247, 0) 5%,
    rgba(247, 247, 247, 1) 100%
  );
}
</style>
